#!/usr/bin/env node
/**
 * Real Music Track BPM, First-Beat & Bass-Drop Analyzer (Zero External NPM Dependencies)
 *
 * Reads any real music bed (.wav or .mp3/.m4a via global or Remotion-bundled FFmpeg),
 * detects tempo (BPM), first strong beat offset, energy peaks, and the primary musical drop,
 * and writes a deterministic JSON cue file (`audio-beats.json`) so Remotion edits lock
 * directly to the real song instead of guessing.
 *
 * Usage:
 *   node scripts/analyze-music.mjs --in public/audio/bed.mp3 --out src/audio-beats.json
 *   node scripts/analyze-music.mjs --in public/audio/bed.wav --fps 30
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { findFfmpeg, FFMPEG_INSTALL_HINT } from "./_ffmpeg.mjs";

const ANALYSIS_RATE = 22050;
const HOP_SIZE = 256; // ~11.6 ms per onset frame
const FRAME_SIZE = 512;

function parseArgs(argv) {
  const opts = {
    input: "",
    out: "",
    fps: 30,
    minBpm: 92,
    maxBpm: 155,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if ((a === "--in" || a === "-i") && argv[i + 1]) opts.input = argv[++i];
    else if ((a === "--out" || a === "-o") && argv[i + 1]) opts.out = argv[++i];
    else if (a === "--fps" && argv[i + 1]) opts.fps = Number(argv[++i]);
    else if (a === "--min-bpm" && argv[i + 1]) opts.minBpm = Number(argv[++i]);
    else if (a === "--max-bpm" && argv[i + 1]) opts.maxBpm = Number(argv[++i]);
    else if (!a.startsWith("-") && !opts.input) opts.input = a;
  }
  return opts;
}

/** Decode any audio format to mono Float32 PCM at ANALYSIS_RATE via FFmpeg */
function decodeWithFfmpeg(ffmpeg, inputPath) {
  const res = spawnSync(
    ffmpeg.bin,
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      inputPath,
      "-ac",
      "1",
      "-ar",
      String(ANALYSIS_RATE),
      "-f",
      "f32le",
      "pipe:1",
    ],
    { maxBuffer: 256 * 1024 * 1024, env: ffmpeg.env, shell: false }
  );
  if (res.status !== 0) {
    throw new Error(`FFmpeg failed to decode ${inputPath}: ${res.stderr?.toString("utf8")}`);
  }
  const buf = res.stdout;
  const count = Math.floor(buf.length / 4);
  const out = new Float32Array(count);
  for (let i = 0; i < count; i++) out[i] = buf.readFloatLE(i * 4);
  return { samples: out, sampleRate: ANALYSIS_RATE };
}

/** Fallback pure-Node PCM WAV decoder (16-bit PCM) if FFmpeg is unavailable */
function decodeWavNative(inputPath) {
  const buf = fs.readFileSync(inputPath);
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error(
      `Input is not a PCM WAV file and FFmpeg is required to decode compressed audio (.mp3/.m4a).\n${FFMPEG_INSTALL_HINT}`
    );
  }
  let offset = 12;
  let sampleRate = 48000;
  let channels = 1;
  let bitsPerSample = 16;
  let dataStart = -1;
  let dataSize = 0;

  while (offset + 8 <= buf.length) {
    const id = buf.toString("ascii", offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === "fmt ") {
      channels = buf.readUInt16LE(offset + 10);
      sampleRate = buf.readUInt32LE(offset + 12);
      bitsPerSample = buf.readUInt16LE(offset + 22);
    } else if (id === "data") {
      dataStart = offset + 8;
      dataSize = size;
      break;
    }
    offset += 8 + size + (size % 2);
  }

  if (dataStart < 0 || bitsPerSample !== 16) {
    throw new Error(
      `Native WAV fallback supports 16-bit PCM WAV only.\n${FFMPEG_INSTALL_HINT}`
    );
  }

  const bytesPerFrame = channels * 2;
  const totalFrames = Math.floor(Math.min(dataSize, buf.length - dataStart) / bytesPerFrame);
  const step = Math.max(1, Math.round(sampleRate / ANALYSIS_RATE));
  const outLen = Math.floor(totalFrames / step);
  const out = new Float32Array(outLen);

  for (let i = 0; i < outLen; i++) {
    const srcFrame = i * step;
    let sum = 0;
    for (let ch = 0; ch < channels; ch++) {
      sum += buf.readInt16LE(dataStart + srcFrame * bytesPerFrame + ch * 2) / 32768;
    }
    out[i] = sum / channels;
  }
  return { samples: out, sampleRate: sampleRate / step };
}

function analyzeTrack(samples, sampleRate, fps, minBpm, maxBpm) {
  const durationSec = samples.length / sampleRate;
  const numFrames = Math.max(1, Math.floor((samples.length - FRAME_SIZE) / HOP_SIZE));
  const hopSec = HOP_SIZE / sampleRate;

  // 1. Compute broadband + low-end (kick/bass) RMS envelopes via simple 1-pole LP (~180Hz)
  const rms = new Float32Array(numFrames);
  const lowRms = new Float32Array(numFrames);
  const alpha = (2 * Math.PI * 180) / (2 * Math.PI * 180 + sampleRate);
  let lp = 0;

  for (let f = 0; f < numFrames; f++) {
    const start = f * HOP_SIZE;
    let sumSq = 0;
    let lowSumSq = 0;
    for (let i = 0; i < FRAME_SIZE; i++) {
      const s = samples[start + i];
      lp += alpha * (s - lp);
      sumSq += s * s;
      lowSumSq += lp * lp;
    }
    rms[f] = Math.sqrt(sumSq / FRAME_SIZE);
    lowRms[f] = Math.sqrt(lowSumSq / FRAME_SIZE);
  }

  // 2. Positive onset strength envelope (weighted toward kick/transient energy)
  const onset = new Float32Array(numFrames);
  for (let f = 1; f < numFrames; f++) {
    const dAll = Math.max(0, rms[f] - rms[f - 1]);
    const dLow = Math.max(0, lowRms[f] - lowRms[f - 1]);
    onset[f] = dAll * 0.45 + dLow * 0.55;
  }

  // Subtract local moving mean to isolate crisp rhythmic pulses
  const normOnset = new Float32Array(numFrames);
  const win = Math.max(4, Math.round(0.35 / hopSec));
  for (let f = 0; f < numFrames; f++) {
    const lo = Math.max(0, f - win);
    const hi = Math.min(numFrames - 1, f + win);
    let mean = 0;
    for (let j = lo; j <= hi; j++) mean += onset[j];
    mean /= hi - lo + 1;
    normOnset[f] = Math.max(0, onset[f] - mean * 1.1);
  }

  // 3. Tempo estimation via autocorrelation across [minBpm, maxBpm]
  const minLag = Math.max(2, Math.floor(60 / (maxBpm * hopSec)));
  const maxLag = Math.min(Math.floor(numFrames / 3), Math.ceil(60 / (minBpm * hopSec)));

  let bestLag = Math.round(60 / (120 * hopSec));
  let bestScore = -1;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let score = 0;
    const limit = numFrames - lag;
    for (let i = 0; i < limit; i++) {
      score += normOnset[i] * normOnset[i + lag];
    }
    // Slight perceptual prior favoring 110-134 BPM X launch sweet spot
    const candBpm = 60 / (lag * hopSec);
    const prior = 1 + 0.08 * Math.exp(-Math.pow((candBpm - 122) / 18, 2));
    const weighted = (score / Math.max(1, limit)) * prior;
    if (weighted > bestScore) {
      bestScore = weighted;
      bestLag = lag;
    }
  }

  const rawBpm = 60 / (bestLag * hopSec);
  const bpm = Math.round(rawBpm * 2) / 2; // Snap to clean 0.5 BPM precision
  const beatPeriodSec = 60 / bpm;

  // 4. Phase alignment: find firstBeatSec in [0, beatPeriodSec) maximizing onset alignment
  const steps = 60;
  let bestPhase = 0;
  let bestPhaseScore = -1;
  for (let s = 0; s < steps; s++) {
    const phase = (s / steps) * beatPeriodSec;
    let sum = 0;
    for (let t = phase; t < durationSec; t += beatPeriodSec) {
      const idx = Math.round(t / hopSec);
      if (idx >= 0 && idx < numFrames) {
        sum += normOnset[idx];
        if (idx > 0) sum += normOnset[idx - 1] * 0.5;
        if (idx + 1 < numFrames) sum += normOnset[idx + 1] * 0.5;
      }
    }
    if (sum > bestPhaseScore) {
      bestPhaseScore = sum;
      bestPhase = phase;
    }
  }

  // 5. Detect primary bass/energy drop (biggest sustained low-end energy jump across 1.0s window)
  const dropWin = Math.max(4, Math.round(1.0 / hopSec));
  let dropFrame = 0;
  let maxEnergyJump = -1;
  const searchStart = Math.round(2.0 / hopSec);
  const searchEnd = Math.min(numFrames - dropWin - 1, Math.round((durationSec - 2.0) / hopSec));
  for (let f = searchStart; f < searchEnd; f++) {
    let before = 0;
    let after = 0;
    for (let k = 0; k < dropWin; k++) {
      before += lowRms[f - k];
      after += lowRms[f + k];
    }
    const jump = (after - before) / dropWin;
    if (jump > maxEnergyJump) {
      maxEnergyJump = jump;
      dropFrame = f;
    }
  }

  // Snap drop to nearest detected beat for frame-clean cutting
  const rawDropSec = dropFrame * hopSec;
  const nearestBeatIdx = Math.max(0, Math.round((rawDropSec - bestPhase) / beatPeriodSec));
  const dropSec = Number((bestPhase + nearestBeatIdx * beatPeriodSec).toFixed(3));

  const beatTimestampsSec = [];
  for (let t = bestPhase; t < durationSec; t += beatPeriodSec) {
    beatTimestampsSec.push(Number(t.toFixed(3)));
  }

  return {
    bpm,
    fps,
    durationSec: Number(durationSec.toFixed(3)),
    firstBeatSec: Number(bestPhase.toFixed(3)),
    firstBeatFrame: Math.round(bestPhase * fps),
    dropSec,
    dropFrame: Math.round(dropSec * fps),
    dropBeatIndex: nearestBeatIdx,
    totalBeats: beatTimestampsSec.length,
    beatTimestampsSec,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.input) {
    console.error(
      "Usage: node scripts/analyze-music.mjs --in <track.mp3|track.wav> [--out audio-beats.json] [--fps 30]"
    );
    process.exit(1);
  }

  if (!Number.isFinite(opts.fps) || opts.fps <= 0 || opts.fps > 240) {
    console.error(`Invalid --fps value: ${opts.fps}`);
    process.exit(1);
  }
  if (!Number.isFinite(opts.minBpm) || !Number.isFinite(opts.maxBpm) || opts.minBpm < 30 || opts.maxBpm > 300 || opts.minBpm >= opts.maxBpm) {
    console.error(`Invalid BPM bounds: min=${opts.minBpm}, max=${opts.maxBpm}`);
    process.exit(1);
  }

  const inputPath = path.resolve(process.cwd(), opts.input);
  if (!fs.existsSync(inputPath)) {
    console.error(`Audio file not found: ${inputPath}`);
    process.exit(1);
  }

  const ffmpegBin = findFfmpeg();
  const decoded = ffmpegBin ? decodeWithFfmpeg(ffmpegBin, inputPath) : decodeWavNative(inputPath);
  const result = analyzeTrack(decoded.samples, decoded.sampleRate, opts.fps, opts.minBpm, opts.maxBpm);

  console.log(`Analyzed ${path.basename(inputPath)}:`);
  console.log(`  Duration     : ${result.durationSec}s`);
  console.log(`  Detected BPM : ${result.bpm} BPM`);
  console.log(`  First Beat   : ${result.firstBeatSec}s (frame ${result.firstBeatFrame} @ ${opts.fps}fps)`);
  console.log(`  Primary Drop : ${result.dropSec}s (frame ${result.dropFrame}, beat #${result.dropBeatIndex})`);

  if (opts.out) {
    const outPath = path.resolve(process.cwd(), opts.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    console.log(`  ✓ Wrote beat map -> ${outPath}`);
  }
}

main();
