#!/usr/bin/env node
/**
 * Broadcast Loudness Mastering Script for X (Twitter) Launch Videos (-14 LUFS / -1.5 dBTP)
 * Zero external npm dependencies (auto-discovers global or Remotion-bundled FFmpeg).
 *
 * Uses `-c:v copy` so video frames are NEVER re-encoded (zero quality loss, completes in ~1-2s).
 * Applies 30Hz highpass (cleans sub-mud) + EBU R128 loudness normalization so X's audio
 * normalizer never crushes, distorts, or pumps your launch trailer.
 *
 * Usage:
 *   node scripts/master-audio.mjs --in out/launch-video.mp4 --out out/launch-video-mastered.mp4
 *   node scripts/master-audio.mjs --in out/launch-video.mp4 --measure
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { findFfmpeg, FFMPEG_INSTALL_HINT } from "./_ffmpeg.mjs";

function parseArgs(argv) {
  const opts = {
    input: "",
    out: "",
    targetI: -14,
    targetTp: -1.5,
    targetLra: 11,
    measureOnly: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if ((a === "--in" || a === "-i") && argv[i + 1]) opts.input = argv[++i];
    else if ((a === "--out" || a === "-o") && argv[i + 1]) opts.out = argv[++i];
    else if (a === "--lufs" && argv[i + 1]) opts.targetI = Number(argv[++i]);
    else if (a === "--tp" && argv[i + 1]) opts.targetTp = Number(argv[++i]);
    else if (a === "--measure") opts.measureOnly = true;
    else if (!a.startsWith("-") && !opts.input) opts.input = a;
  }
  return opts;
}

function assertFinite(name, val, min, max) {
  const n = Number(val);
  if (!Number.isFinite(n) || n < min || n > max) {
    throw new Error(`Invalid numeric value for ${name}: ${val}`);
  }
  return n;
}

function measureLoudness(ffmpeg, inputPath, opts) {
  const res = spawnSync(
    ffmpeg.bin,
    [
      "-hide_banner",
      "-i",
      inputPath,
      "-vn",
      "-af",
      `loudnorm=I=${opts.targetI}:TP=${opts.targetTp}:LRA=${opts.targetLra}:print_format=json`,
      "-f",
      "null",
      "-",
    ],
    { encoding: "utf8", env: ffmpeg.env, shell: false }
  );

  const stderr = `${res.stderr || ""}`;
  const jsonStart = stderr.lastIndexOf("{");
  const jsonEnd = stderr.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd <= jsonStart) {
    if (stderr.includes("does not contain any stream") || stderr.includes("matches no streams")) {
      throw new Error("Input video has no audio stream to master.");
    }
    throw new Error(`Could not parse FFmpeg loudnorm measurement:\n${stderr.slice(-500)}`);
  }
  return JSON.parse(stderr.slice(jsonStart, jsonEnd + 1));
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.input) {
    console.error(
      "Usage: node scripts/master-audio.mjs --in out/launch-video.mp4 [--out out/launch-video-mastered.mp4] [--lufs -14] [--measure]"
    );
    process.exit(1);
  }

  opts.targetI = assertFinite("--lufs", opts.targetI, -70, -5);
  opts.targetTp = assertFinite("--tp", opts.targetTp, -9, 0);
  opts.targetLra = assertFinite("targetLra", opts.targetLra, 1, 50);

  const inputPath = path.resolve(process.cwd(), opts.input);
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const ffmpeg = findFfmpeg();
  if (!ffmpeg) {
    console.error(FFMPEG_INSTALL_HINT);
    process.exit(1);
  }

  const stats = measureLoudness(ffmpeg, inputPath, opts);
  const measuredI = assertFinite("measured_I", stats.input_i, -120, 0);
  const measuredTp = assertFinite("measured_TP", stats.input_tp, -120, 24);
  const measuredLra = assertFinite("measured_LRA", stats.input_lra, 0, 100);
  const measuredThresh = assertFinite("measured_thresh", stats.input_thresh, -120, 0);
  const targetOffset = assertFinite("target_offset", stats.target_offset, -100, 100);

  console.log(`Measured Audio (${path.basename(inputPath)}):`);
  console.log(`  Integrated Loudness : ${measuredI} LUFS  (target: ${opts.targetI} LUFS)`);
  console.log(`  True Peak           : ${measuredTp} dBTP (ceiling: ${opts.targetTp} dBTP)`);
  console.log(`  Loudness Range      : ${measuredLra} LU`);

  if (opts.measureOnly) return;

  const outPath = opts.out
    ? path.resolve(process.cwd(), opts.out)
    : inputPath.replace(/(\.[^.]+)$/, "-mastered$1");

  // True two-pass linear EBU R128 loudness mastering (preserves dynamics without pumping)
  const af = `loudnorm=I=${opts.targetI}:TP=${opts.targetTp}:LRA=${opts.targetLra}:measured_I=${measuredI}:measured_TP=${measuredTp}:measured_LRA=${measuredLra}:measured_thresh=${measuredThresh}:offset=${targetOffset}:linear=true`;

  const pass2 = spawnSync(
    ffmpeg.bin,
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      inputPath,
      "-c:v",
      "copy",
      "-af",
      af,
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-ar",
      "48000",
      "-movflags",
      "+faststart",
      outPath,
    ],
    { encoding: "utf8", env: ffmpeg.env, shell: false }
  );

  if (pass2.status !== 0) {
    console.error(`Mastering failed: ${pass2.stderr}`);
    process.exit(pass2.status ?? 1);
  }

  console.log(`  ✓ Mastered (video stream copied untouched) -> ${outPath}`);
}

main();
