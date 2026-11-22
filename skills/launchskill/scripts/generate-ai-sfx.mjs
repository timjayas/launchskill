#!/usr/bin/env node
/**
 * Tier 2 Studio AI SFX Generator (ElevenLabs Sound Effects v2 + Auto FFmpeg Transient Trim)
 * Zero external npm dependencies (uses Node 18+ built-in fetch + auto-discovered FFmpeg).
 *
 * Fixes ElevenLabs' #1 Remotion issue automatically:
 *   - Strips leading silence (50-250ms) on transient hits (clicks, keys, impacts, pops) so
 *     every cue triggers on sample 0 with exact frame accuracy.
 *   - Applies 30Hz highpass, micro click-free fades, and peak headroom normalization (-3 to -7.5 dBFS).
 *   - Outputs crisp 48 kHz 16-bit PCM WAV files ready for <Audio src={staticFile(...)} />.
 *
 * Usage:
 *   # Generate the entire 14-asset studio foley pack once (save into skill or public/sfx):
 *   node scripts/generate-ai-sfx.mjs --pack studio --out public/sfx
 *
 *   # Re-roll specific assets from manifest.json:
 *   node scripts/generate-ai-sfx.mjs --pack studio --only click-02,whoosh-fast --out public/sfx
 *
 *   # Generate a bespoke product-specific foley sound (e.g., brushed metal cap twist):
 *   node scripts/generate-ai-sfx.mjs --prompt "crisp brushed aluminum bottle cap twist open, dry studio mic" --name cap-twist --duration 0.7 --trim transient --out public/sfx
 *
 *   # Preview the generation & FFmpeg trim plan without calling the API:
 *   node scripts/generate-ai-sfx.mjs --pack studio --dry-run
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findFfmpeg } from "./_ffmpeg.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_MANIFEST = path.resolve(__dirname, "..", "assets", "sfx", "manifest.json");
const ELEVENLABS_ENDPOINT = "https://api.elevenlabs.io/v1/sound-generation";

function parseArgs(argv) {
  const opts = {
    pack: "",
    manifest: DEFAULT_MANIFEST,
    only: [],
    prompt: "",
    name: "custom-sfx",
    duration: 0.6,
    trim: "transient",
    maxLength: 0,
    targetDb: -5.0,
    influence: 0.42,
    out: path.join("public", "sfx"),
    dryRun: false,
    force: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--pack" && argv[i + 1]) opts.pack = argv[++i];
    else if (a === "--manifest" && argv[i + 1]) opts.manifest = path.resolve(argv[++i]);
    else if (a === "--only" && argv[i + 1]) {
      opts.only = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    } else if (a === "--prompt" && argv[i + 1]) opts.prompt = argv[++i];
    else if (a === "--name" && argv[i + 1]) opts.name = argv[++i].replace(/\.wav$/i, "");
    else if (a === "--duration" && argv[i + 1]) opts.duration = Number(argv[++i]);
    else if (a === "--trim" && argv[i + 1]) opts.trim = argv[++i];
    else if (a === "--max-length" && argv[i + 1]) opts.maxLength = Number(argv[++i]);
    else if (a === "--target-db" && argv[i + 1]) opts.targetDb = Number(argv[++i]);
    else if (a === "--influence" && argv[i + 1]) opts.influence = Number(argv[++i]);
    else if (a === "--out" && argv[i + 1]) opts.out = argv[++i];
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--force") opts.force = true;
  }
  return opts;
}

const SAFE_ID_RE = /^[A-Za-z0-9._-]+$/;
const ALLOWED_TRIM_MODES = new Set(["transient", "preserve"]);

function resolveInsideDir(baseDir, relFile) {
  const resolvedBase = path.resolve(baseDir);
  const resolvedTarget = path.resolve(resolvedBase, relFile);
  const rel = path.relative(resolvedBase, resolvedTarget);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Unsafe output filename (escapes output directory): ${relFile}`);
  }
  return resolvedTarget;
}

function buildJobs(opts) {
  if (opts.prompt) {
    if (!SAFE_ID_RE.test(opts.name)) {
      throw new Error(`Invalid --name "${opts.name}". Allowed characters: A-Z, a-z, 0-9, ., _, -.`);
    }
    if (!ALLOWED_TRIM_MODES.has(opts.trim)) {
      throw new Error(`Invalid --trim "${opts.trim}". Allowed: transient, preserve.`);
    }
    const dur = Math.max(0.5, Math.min(22, Number.isFinite(opts.duration) ? opts.duration : 0.6));
    const maxLen = Number.isFinite(opts.maxLength) && opts.maxLength > 0 ? Math.min(22, opts.maxLength) : dur;
    const targetDb = Number.isFinite(opts.targetDb) ? Math.max(-36, Math.min(0, opts.targetDb)) : -5.0;
    const influence = Number.isFinite(opts.influence) ? Math.max(0, Math.min(1, opts.influence)) : 0.42;
    return [
      {
        id: opts.name,
        file: `${opts.name}.wav`,
        durationSec: dur,
        trimMode: opts.trim,
        maxLengthSec: maxLen,
        targetDb,
        promptInfluence: influence,
        prompt: opts.prompt,
      },
    ];
  }

  if (!fs.existsSync(opts.manifest)) {
    throw new Error(`SFX manifest not found: ${opts.manifest}`);
  }
  const manifest = JSON.parse(fs.readFileSync(opts.manifest, "utf8"));
  let jobs = manifest.assets || [];
  if (opts.only.length > 0) {
    const wanted = new Set(opts.only);
    jobs = jobs.filter((j) => wanted.has(j.id) || wanted.has(j.group));
  }
  for (const job of jobs) {
    if (!SAFE_ID_RE.test(String(job.id || "")) || !SAFE_ID_RE.test(String(job.file || ""))) {
      throw new Error(`Unsafe manifest entry id/file: ${job.id} / ${job.file}`);
    }
  }
  return jobs;
}

function postProcessWithFfmpeg(ffmpeg, rawMp3Path, outWavPath, job) {
  const filters = ["highpass=f=30"];

  // Strip leading silence on transient hits so clicks/impacts trigger on sample 0
  if (job.trimMode === "transient") {
    filters.push("silenceremove=start_periods=1:start_duration=0:start_threshold=-42dB");
  }

  // Cap clip length cleanly to avoid stray ElevenLabs double-hits or trailing hiss
  if (job.maxLengthSec && job.maxLengthSec > 0) {
    const fadeDur = Math.min(0.035, job.maxLengthSec * 0.25);
    const fadeStart = Math.max(0, job.maxLengthSec - fadeDur);
    filters.push(`atrim=0:${job.maxLengthSec.toFixed(3)}`);
    filters.push(`afade=t=in:st=0:d=0.002`);
    filters.push(`afade=t=out:st=${fadeStart.toFixed(3)}:d=${fadeDur.toFixed(3)}`);
  }

  // Peak normalize via volumedetect headroom pass
  const detect = spawnSync(
    ffmpeg.bin,
    ["-hide_banner", "-i", rawMp3Path, "-af", `${filters.join(",")},volumedetect`, "-f", "null", "-"],
    { encoding: "utf8", env: ffmpeg.env, shell: false }
  );
  const stderr = `${detect.stderr || ""}`;
  const maxMatch = stderr.match(/max_volume:\s*([-0-9.]+)\s*dB/i);
  if (maxMatch) {
    const currentPeak = Number(maxMatch[1]);
    if (Number.isFinite(currentPeak) && currentPeak > -80) {
      const gainDb = (job.targetDb ?? -5.0) - currentPeak;
      const clampedGain = Math.max(-18, Math.min(18, gainDb));
      filters.push(`volume=${clampedGain.toFixed(2)}dB`);
    }
  }

  const res = spawnSync(
    ffmpeg.bin,
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      rawMp3Path,
      "-af",
      filters.join(","),
      "-ar",
      "48000",
      "-ac",
      "2",
      "-c:a",
      "pcm_s16le",
      outWavPath,
    ],
    { encoding: "utf8", env: ffmpeg.env, shell: false }
  );

  if (res.status !== 0) {
    throw new Error(`FFmpeg post-process failed for ${job.id}: ${res.stderr}`);
  }
}

async function generateOne(apiKey, job, outDir, ffmpeg) {
  const res = await fetch(ELEVENLABS_ENDPOINT, {
    method: "POST",
    signal: AbortSignal.timeout(30_000),
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: job.prompt,
      duration_seconds: Math.max(0.5, Math.min(22, job.durationSec ?? 0.6)),
      prompt_influence: job.promptInfluence ?? 0.42,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`ElevenLabs API ${res.status} for "${job.id}": ${errText.slice(0, 240)}`);
  }

  const bytes = Buffer.from(await res.arrayBuffer());
  const outWav = resolveInsideDir(outDir, job.file);

  if (ffmpeg) {
    const tmpFile = path.join(os.tmpdir(), `launchskill-${job.id}-${Date.now()}.mp3`);
    fs.writeFileSync(tmpFile, bytes);
    try {
      postProcessWithFfmpeg(ffmpeg, tmpFile, outWav, job);
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
    return { path: outWav, trimmed: true, bytes: fs.statSync(outWav).size };
  }

  // Fallback if FFmpeg is completely unavailable: save raw MP3 alongside notice
  const fallbackMp3 = outWav.replace(/\.wav$/i, ".mp3");
  fs.writeFileSync(fallbackMp3, bytes);
  return { path: fallbackMp3, trimmed: false, bytes: bytes.length };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.pack && !opts.prompt) {
    console.log(
      [
        "Usage:",
        "  node scripts/generate-ai-sfx.mjs --pack studio --out public/sfx [--only id1,id2] [--force] [--dry-run]",
        '  node scripts/generate-ai-sfx.mjs --prompt "..." --name custom --duration 0.6 --trim transient --out public/sfx',
      ].join("\n")
    );
    process.exit(1);
  }

  const jobs = buildJobs(opts);
  const outDir = path.resolve(process.cwd(), opts.out);
  const ffmpeg = findFfmpeg();

  console.log(`ElevenLabs AI SFX Plan (${jobs.length} asset${jobs.length === 1 ? "" : "s"} -> ${outDir})`);
  console.log(`  FFmpeg transient trim: ${ffmpeg ? `enabled (${ffmpeg.bin})` : "NOT FOUND (raw MP3 fallback)"}`);
  for (const job of jobs) {
    console.log(
      `  - ${job.file.padEnd(18)} dur=${String(job.durationSec).padStart(4)}s  trim=${job.trimMode.padEnd(9)}  max=${String(job.maxLengthSec).padStart(4)}s  target=${job.targetDb}dBFS`
    );
  }

  if (opts.dryRun) {
    console.log("\nDry-run enabled; skipped API calls.");
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error(
      [
        "\nMissing ELEVENLABS_API_KEY environment variable.",
        "Options:",
        "  1. Export ELEVENLABS_API_KEY and re-run to synthesize opt-in AI foley.",
        "  2. Or use the 100% offline procedural DSP engine: node scripts/generate-dsp-sfx.mjs --out public/sfx",
        "  (Never synthesize fake background music in JavaScript.)",
      ].join("\n")
    );
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  for (const job of jobs) {
    const targetPath = path.join(outDir, job.file);
    if (!opts.force && fs.existsSync(targetPath)) {
      console.log(`  • Skipping existing ${job.file} (pass --force to overwrite)`);
      continue;
    }
    const result = await generateOne(apiKey, job, outDir, ffmpeg);
    console.log(
      `  ✓ ${path.basename(result.path).padEnd(18)} ${result.bytes} bytes  ${result.trimmed ? "[trimmed 48kHz WAV]" : "[raw MP3 - install ffmpeg for sample-0 trim]"}`
    );
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
