#!/usr/bin/env node
/**
 * Backward-Compatible Alias -> Tier-1 Procedural DSP SFX Engine (`generate-dsp-sfx.mjs`)
 *
 * The legacy 5-file naive mono sine-beep generator has been retired and replaced by
 * the 14-slot Stereo 48 kHz Tier-1 Procedural DSP SFX Engine (swept pink-noise
 * bandpass whooshes + Schroeder room reverb, multi-layer tactile clicks/keys,
 * pitch-enveloped sub-bass drops with warm saturation, modal/FM chime).
 *
 * Usage:
 *   node scripts/generate-sfx.mjs --out public/sfx
 *   (Prefer invoking `node scripts/generate-dsp-sfx.mjs --out public/sfx` directly.)
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dspScript = path.join(__dirname, "generate-dsp-sfx.mjs");

console.log(
  "[launchskill] Forwarding to Tier-1 Procedural DSP SFX Engine (scripts/generate-dsp-sfx.mjs)..."
);

const result = spawnSync(process.execPath, [dspScript, ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: false,
});

process.exit(result.status ?? 1);
