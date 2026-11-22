#!/usr/bin/env node
/**
 * Tier-1 Procedural DSP Studio SFX Engine (100% Code-Generated, Deterministic, License-Free)
 *
 * Generates all 14 studio foley WAV slots declared in `assets/sfx/manifest.json` (48 kHz, 16-bit
 * Stereo PCM) using genuine acoustic DSP — zero naive/raw sine-wave beeps, zero API keys required:
 *
 *   - Whooshes & Risers (`whoosh-fast`, `whoosh-deep`, `riser-1s`):
 *       Paul Kellet pink noise -> time-varying 2-pole RBJ resonant bandpass sweep ->
 *       exact peakOffsetSec alignment -> stereo decorrelation + Schroeder room reverb tail.
 *   - Clicks, Key Taps & UI Pops (`click-01..03`, `key-01..04`, `pop-subtle`):
 *       Multi-layer sample-0 transients: 2-4ms band-limited noise impulse attack +
 *       damped 180-350 Hz resonant body + chassis modal partial + asymmetric soft saturation.
 *   - Sub-Bass Impacts (`sub-hit-soft`, `sub-hit-heavy`):
 *       Exponential pitch-enveloped sub-bass drops (110 Hz -> 42 Hz / 118 Hz -> 38 Hz) +
 *       damped chest transient + warm harmonic tape saturation.
 *   - Brand Resolve Chime (`resolve-warm`):
 *       Modal / FM harmonic decay (decaying FM shimmer index -> pure warm glassy partials) +
 *       stereo early reflections & short studio room ambience.
 *
 * Usage:
 *   node skills/launchskill/scripts/generate-dsp-sfx.mjs --out public/sfx
 */

import fs from "node:fs";
import path from "node:path";

const SAMPLE_RATE = 48000;
const CHANNELS = 2;
const BITS_PER_SAMPLE = 16;

// ============================================================================
// 1. Deterministic PRNG & True Paul Kellet Pink Noise Generator (1/f spectrum)
// ============================================================================
function createRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createPinkNoise(seed) {
  const rng = createRng(seed);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  return () => {
    const white = rng() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    return pink * 0.11;
  };
}

// ============================================================================
// 2. Real-Time RBJ 2-Pole Biquad Filters (Bandpass, Lowpass, Highpass)
// ============================================================================
class Biquad {
  constructor() {
    this.b0 = 1; this.b1 = 0; this.b2 = 0;
    this.a1 = 0; this.a2 = 0;
    this.x1 = 0; this.x2 = 0;
    this.y1 = 0; this.y2 = 0;
  }

  setBandpass(freqHz, q) {
    const f = Math.max(25, Math.min(SAMPLE_RATE * 0.45, freqHz));
    const w0 = (2 * Math.PI * f) / SAMPLE_RATE;
    const alpha = Math.sin(w0) / (2 * Math.max(0.2, q));
    const a0 = 1 + alpha;
    this.b0 = alpha / a0;
    this.b1 = 0;
    this.b2 = -alpha / a0;
    this.a1 = (-2 * Math.cos(w0)) / a0;
    this.a2 = (1 - alpha) / a0;
  }

  setLowpass(freqHz, q = 0.707) {
    const f = Math.max(25, Math.min(SAMPLE_RATE * 0.45, freqHz));
    const w0 = (2 * Math.PI * f) / SAMPLE_RATE;
    const cosW = Math.cos(w0);
    const alpha = Math.sin(w0) / (2 * Math.max(0.2, q));
    const a0 = 1 + alpha;
    this.b0 = ((1 - cosW) * 0.5) / a0;
    this.b1 = (1 - cosW) / a0;
    this.b2 = ((1 - cosW) * 0.5) / a0;
    this.a1 = (-2 * cosW) / a0;
    this.a2 = (1 - alpha) / a0;
  }

  setHighpass(freqHz, q = 0.707) {
    const f = Math.max(15, Math.min(SAMPLE_RATE * 0.45, freqHz));
    const w0 = (2 * Math.PI * f) / SAMPLE_RATE;
    const cosW = Math.cos(w0);
    const alpha = Math.sin(w0) / (2 * Math.max(0.2, q));
    const a0 = 1 + alpha;
    this.b0 = ((1 + cosW) * 0.5) / a0;
    this.b1 = -(1 + cosW) / a0;
    this.b2 = ((1 + cosW) * 0.5) / a0;
    this.a1 = (-2 * cosW) / a0;
    this.a2 = (1 - alpha) / a0;
  }

  process(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}

// ============================================================================
// 3. Warm Analog Saturation & Short Stereo Room Ambience (Schroeder Early + Combs)
// ============================================================================
/** Asymmetric soft tape saturation (adds warm 2nd + 3rd harmonics without harsh clipping) */
function softSat(x, drive = 1.6, asym = 0.08) {
  const driven = x * drive;
  return Math.tanh(driven + asym * driven * driven) / Math.tanh(drive);
}

/** Tasteful short studio room reverb (4 damped comb filters + early reflections, stereo) */
function applyStudioRoom(left, right, wet = 0.18, decay = 0.52, dampHz = 4200) {
  const n = left.length;
  const outL = new Float64Array(n);
  const outR = new Float64Array(n);

  const combDelaysL = [541, 719, 907, 1123];
  const combDelaysR = [563, 739, 937, 1151];

  const combsL = combDelaysL.map((d) => ({
    buf: new Float64Array(d),
    idx: 0,
    lp: 0,
    fb: decay,
  }));
  const combsR = combDelaysR.map((d) => ({
    buf: new Float64Array(d),
    idx: 0,
    lp: 0,
    fb: decay,
  }));

  const dampAlpha = Math.exp((-2 * Math.PI * dampHz) / SAMPLE_RATE);

  for (let i = 0; i < n; i++) {
    const inL = left[i];
    const inR = right[i];
    let wetL = 0;
    let wetR = 0;

    for (const c of combsL) {
      const delayed = c.buf[c.idx];
      c.lp = delayed * (1 - dampAlpha) + c.lp * dampAlpha;
      c.buf[c.idx] = inL + c.lp * c.fb;
      c.idx = (c.idx + 1) % c.buf.length;
      wetL += c.lp;
    }
    for (const c of combsR) {
      const delayed = c.buf[c.idx];
      c.lp = delayed * (1 - dampAlpha) + c.lp * dampAlpha;
      c.buf[c.idx] = inR + c.lp * c.fb;
      c.idx = (c.idx + 1) % c.buf.length;
      wetR += c.lp;
    }

    outL[i] = inL * (1 - wet * 0.4) + (wetL * 0.25) * wet;
    outR[i] = inR * (1 - wet * 0.4) + (wetR * 0.25) * wet;
  }
  return [outL, outR];
}

// ============================================================================
// 4. Master Finishing (30 Hz HPF, DC Removal, Click-Free Tails, Exact Target dBFS)
// ============================================================================
function finalizeStereo(left, right, targetDb = -4.5, preserveAttack = false) {
  const n = left.length;
  const hpL = new Biquad();
  const hpR = new Biquad();
  hpL.setHighpass(28, 0.707);
  hpR.setHighpass(28, 0.707);

  for (let i = 0; i < n; i++) {
    left[i] = hpL.process(left[i]);
    right[i] = hpR.process(right[i]);
  }

  // Ultra-short anti-click fade-in (0.4ms on sample-0 transients, 4ms on swells) + smooth tail fade
  const fadeIn = preserveAttack
    ? Math.floor(SAMPLE_RATE * 0.004)
    : Math.floor(SAMPLE_RATE * 0.0004);
  const fadeOut = Math.min(Math.floor(SAMPLE_RATE * 0.018), Math.floor(n * 0.25));

  for (let i = 0; i < fadeIn && i < n; i++) {
    const g = i / fadeIn;
    left[i] *= g;
    right[i] *= g;
  }
  for (let i = 0; i < fadeOut && i < n; i++) {
    const g = i / fadeOut;
    left[n - 1 - i] *= g;
    right[n - 1 - i] *= g;
  }

  let peak = 0;
  for (let i = 0; i < n; i++) {
    const aL = Math.abs(left[i]);
    const aR = Math.abs(right[i]);
    if (aL > peak) peak = aL;
    if (aR > peak) peak = aR;
  }

  const targetLin = Math.pow(10, targetDb / 20);
  if (peak > 1e-7) {
    const gain = targetLin / peak;
    for (let i = 0; i < n; i++) {
      left[i] = Math.max(-0.98, Math.min(0.98, left[i] * gain));
      right[i] = Math.max(-0.98, Math.min(0.98, right[i] * gain));
    }
  }
  return [left, right];
}

function encodeStereoWav16(left, right) {
  const numFrames = left.length;
  const blockAlign = CHANNELS * (BITS_PER_SAMPLE / 8);
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = numFrames * blockAlign;
  const buf = Buffer.alloc(44 + dataSize);

  buf.write("RIFF", 0, "ascii");
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVE", 8, "ascii");
  buf.write("fmt ", 12, "ascii");
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(CHANNELS, 22);
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(byteRate, 28);
  buf.writeUInt16LE(blockAlign, 32);
  buf.writeUInt16LE(BITS_PER_SAMPLE, 34);
  buf.write("data", 36, "ascii");
  buf.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numFrames; i++) {
    const cL = Math.max(-1, Math.min(1, left[i]));
    const cR = Math.max(-1, Math.min(1, right[i]));
    const sL = cL < 0 ? Math.round(cL * 32768) : Math.round(cL * 32767);
    const sR = cR < 0 ? Math.round(cR * 32768) : Math.round(cR * 32767);
    buf.writeInt16LE(sL, 44 + i * 4);
    buf.writeInt16LE(sR, 44 + i * 4 + 2);
  }
  return buf;
}

// ============================================================================
// 5. Studio DSP Sound Generators (All 14 Manifest Slots)
// ============================================================================

/** Multi-layer tactile UI click / mechanical key tap (2-4ms filtered noise + damped 180-350 Hz body + soft sat) */
function synthTactileTap({
  seed,
  durSec,
  attackMs,
  attackBandHz,
  bodyHz,
  bodyDecaySec,
  shellHz,
  shellMix,
  drive,
  targetDb,
}) {
  const n = Math.floor(SAMPLE_RATE * durSec);
  const left = new Float64Array(n);
  const right = new Float64Array(n);
  const rngL = createRng(seed);
  const rngR = createRng(seed + 7919);

  const bpL = new Biquad();
  const bpR = new Biquad();
  bpL.setBandpass(attackBandHz, 1.35);
  bpR.setBandpass(attackBandHz * 1.03, 1.35);

  let bodyPhase = 0;
  let shellPhase = 0;

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;

    // Layer 1: 2-4ms filtered micro-impulse noise transient (sample-0 snap)
    const atkEnv = Math.exp(-t / (attackMs / 1000));
    const nL = bpL.process((rngL() * 2 - 1) * atkEnv);
    const nR = bpR.process((rngR() * 2 - 1) * atkEnv);

    // Layer 2: Damped 180-350 Hz tactile body resonance with natural downward micro-drop
    const instBodyHz = bodyHz * (0.72 + 0.55 * Math.exp(-t / 0.008));
    bodyPhase += (2 * Math.PI * instBodyHz) / SAMPLE_RATE;
    const bodyEnv = Math.exp(-t / bodyDecaySec);
    const body = Math.sin(bodyPhase) * bodyEnv;

    // Layer 3: Subtle chassis / glass modal harmonic
    shellPhase += (2 * Math.PI * shellHz) / SAMPLE_RATE;
    const shell = Math.sin(shellPhase) * Math.exp(-t / (bodyDecaySec * 0.45)) * shellMix;

    // Combine + warm asymmetric analog saturation
    const rawL = nL * 1.35 + body * 0.72 + shell;
    const rawR = nR * 1.35 + body * 0.72 + shell * 0.96;
    left[i] = softSat(rawL, drive, 0.07);
    right[i] = softSat(rawR, drive, 0.07);
  }

  return finalizeStereo(left, right, targetDb, false);
}

/** Swept resonant bandpass-filtered pink noise whoosh aligned strictly to peakOffsetSec + subtle room tail */
function synthWhoosh({
  seed,
  durSec,
  peakOffsetSec,
  startHz,
  peakHz,
  endHz,
  q,
  subChestMix,
  reverbWet,
  targetDb,
}) {
  const n = Math.floor(SAMPLE_RATE * durSec);
  const left = new Float64Array(n);
  const right = new Float64Array(n);
  const pinkL = createPinkNoise(seed);
  const pinkR = createPinkNoise(seed + 4211);

  const bpL = new Biquad();
  const bpR = new Biquad();
  const lpL = new Biquad();
  const lpR = new Biquad();
  lpL.setLowpass(6200, 0.7);
  lpR.setLowpass(6200, 0.7);

  let chestPhase = 0;

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    let env;
    let cutoffHz;

    if (t <= peakOffsetSec) {
      const u = t / Math.max(0.01, peakOffsetSec); // 0 -> 1
      env = Math.pow(u, 2.05);
      cutoffHz = startHz + (peakHz - startHz) * Math.pow(u, 1.7);
    } else {
      const u = (t - peakOffsetSec) / Math.max(0.01, durSec - peakOffsetSec); // 0 -> 1
      env = Math.exp(-u * 3.8) * (1 - u * 0.2);
      cutoffHz = endHz + (peakHz - endHz) * Math.exp(-u * 3.1);
    }

    // Update biquad smoothly every 4 samples (0.08ms) for silky zipper-free sweep
    if (i % 4 === 0) {
      bpL.setBandpass(cutoffHz, q);
      bpR.setBandpass(cutoffHz * 1.045, q); // subtle natural stereo air width
    }

    const airL = lpL.process(bpL.process(pinkL())) * env;
    const airR = lpR.process(bpR.process(pinkR())) * env;

    // Optional warm low-mid air movement for deep camera zoom whooshes
    const chestHz = 56 + 54 * env;
    chestPhase += (2 * Math.PI * chestHz) / SAMPLE_RATE;
    const chest = Math.sin(chestPhase) * env * env * subChestMix;

    left[i] = softSat(airL * 2.2 + chest, 1.3, 0.04);
    right[i] = softSat(airR * 2.2 + chest, 1.3, 0.04);
  }

  const [revL, revR] = applyStudioRoom(left, right, reverbWet, 0.46, 3400);
  return finalizeStereo(revL, revR, targetDb, true);
}

/** 1.0s smooth reverse-air & warm analog fifth swell riser peaking sharply at peakOffsetSec */
function synthRiser({ seed, durSec, peakOffsetSec, targetDb }) {
  const n = Math.floor(SAMPLE_RATE * durSec);
  const left = new Float64Array(n);
  const right = new Float64Array(n);
  const pinkL = createPinkNoise(seed);
  const pinkR = createPinkNoise(seed + 1337);

  const bpL = new Biquad();
  const bpR = new Biquad();
  let p1 = 0, p2 = 0, p3 = 0;

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    let env;
    let cutoffHz;
    if (t <= peakOffsetSec) {
      const u = t / peakOffsetSec;
      env = Math.pow(u, 2.4);
      cutoffHz = 180 + 3100 * Math.pow(u, 2.1);
    } else {
      // Crisp studio cutoff right after peak (short 120ms natural room tail carries over)
      const u = (t - peakOffsetSec) / Math.max(0.01, durSec - peakOffsetSec);
      env = Math.exp(-u * 18);
      cutoffHz = 3280;
    }

    if (i % 4 === 0) {
      bpL.setBandpass(cutoffHz, 2.5);
      bpR.setBandpass(cutoffHz * 1.03, 2.5);
    }

    const airL = bpL.process(pinkL()) * env * 2.0;
    const airR = bpR.process(pinkR()) * env * 2.0;

    // Warm subtle analog fifth harmonic bed underneath air sweep
    const baseHz = 110 + 18 * Math.min(1, t / peakOffsetSec);
    p1 += (2 * Math.PI * baseHz) / SAMPLE_RATE;
    p2 += (2 * Math.PI * baseHz * 1.498) / SAMPLE_RATE;
    p3 += (2 * Math.PI * baseHz * 2.003) / SAMPLE_RATE;
    const pad = (Math.sin(p1) * 0.45 + Math.sin(p2) * 0.3 + Math.sin(p3) * 0.15) * env * 0.42;

    left[i] = softSat(airL + pad, 1.45, 0.05);
    right[i] = softSat(airR + pad * 0.98, 1.45, 0.05);
  }

  const [revL, revR] = applyStudioRoom(left, right, 0.24, 0.56, 3600);
  return finalizeStereo(revL, revR, targetDb, true);
}

/** Pitch-enveloped sub-bass impact (110 -> 42 Hz / 118 -> 38 Hz) + warm harmonic saturation */
function synthSubImpact({
  seed,
  durSec,
  startHz,
  endHz,
  pitchTauSec,
  ampTauSec,
  drive,
  reverbWet,
  targetDb,
}) {
  const n = Math.floor(SAMPLE_RATE * durSec);
  const left = new Float64Array(n);
  const right = new Float64Array(n);
  const pink = createPinkNoise(seed);

  const lp = new Biquad();
  lp.setLowpass(260, 0.9);
  let phase = 0;

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const instHz = endHz + (startHz - endHz) * Math.exp(-t / pitchTauSec);
    phase += (2 * Math.PI * instHz) / SAMPLE_RATE;

    const subEnv = Math.exp(-t / ampTauSec) * Math.min(1, t / 0.0022);
    const sub = Math.sin(phase) * subEnv;

    // Subtle damped low-end mallet transient (3.5ms) for physical punch
    const punch = lp.process(pink()) * Math.exp(-t / 0.012) * 1.45;

    // Warm harmonic tape saturation adds audible upper-bass warmth on phone speakers!
    const sat = softSat(sub * 1.05 + punch * 0.5, drive, 0.11);
    left[i] = sat;
    right[i] = sat;
  }

  const [revL, revR] =
    reverbWet > 0 ? applyStudioRoom(left, right, reverbWet, 0.48, 900) : [left, right];
  return finalizeStereo(revL, revR, targetDb, false);
}

/** Organic subtle wooden-bubble UI badge pop */
function synthPopSubtle({ seed, durSec, targetDb }) {
  const n = Math.floor(SAMPLE_RATE * durSec);
  const left = new Float64Array(n);
  const right = new Float64Array(n);
  const rng = createRng(seed);
  const bp = new Biquad();
  bp.setBandpass(1450, 1.6);

  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    // Gentle upward organic pitch bend (260 -> 470 Hz)
    const instHz = 470 - 210 * Math.exp(-t / 0.016);
    phase += (2 * Math.PI * instHz) / SAMPLE_RATE;
    const env = Math.exp(-t / 0.024) * Math.min(1, t / 0.0018);
    const tap = bp.process((rng() * 2 - 1) * Math.exp(-t / 0.003)) * 0.45;
    const s = softSat(Math.sin(phase) * env + tap, 1.35, 0.05);
    left[i] = s;
    right[i] = s;
  }
  return finalizeStereo(left, right, targetDb, false);
}

/** Modal / FM harmonic decay warm felt-glass brand resolve + short studio room ambience */
function synthResolveWarm({ durSec, targetDb }) {
  const n = Math.floor(SAMPLE_RATE * durSec);
  const left = new Float64Array(n);
  const right = new Float64Array(n);

  // Warm mid-register studio felt-marimba resolve (D4 -> A4 + soft E5 warmth, zero piercing treble)
  const voices = [
    { startSec: 0.0, carrierHz: 293.66, modRatio: 1.0, modIndex0: 0.42, amp: 0.48, decay: 0.52, pan: -0.15 },
    { startSec: 0.095, carrierHz: 440.0, modRatio: 1.0, modIndex0: 0.36, amp: 0.42, decay: 0.62, pan: 0.15 },
    { startSec: 0.105, carrierHz: 587.33, modRatio: 1.0, modIndex0: 0.22, amp: 0.20, decay: 0.48, pan: 0.05 },
    { startSec: 0.0, carrierHz: 146.83, modRatio: 1.0, modIndex0: 0.12, amp: 0.28, decay: 0.58, pan: 0.0 },
  ];

  const lpfL = new Biquad();
  const lpfR = new Biquad();
  lpfL.setLowpass(1850, 0.707);
  lpfR.setLowpass(1850, 0.707);

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    let sumL = 0;
    let sumR = 0;

    for (const v of voices) {
      if (t < v.startSec) continue;
      const lt = t - v.startSec;
      const atk = Math.min(1, lt / 0.014);
      const env = Math.exp(-lt / v.decay) * atk;

      const fmIndex = v.modIndex0 * Math.exp(-lt / 0.032);
      const mod = Math.sin(2 * Math.PI * v.carrierHz * v.modRatio * lt) * fmIndex;
      const sample = Math.sin(2 * Math.PI * v.carrierHz * lt + mod) * v.amp * env;

      const panL = Math.cos(((v.pan + 1) * Math.PI) / 4);
      const panR = Math.sin(((v.pan + 1) * Math.PI) / 4);
      sumL += sample * panL;
      sumR += sample * panR;
    }

    left[i] = softSat(lpfL.process(sumL), 1.12, 0.02);
    right[i] = softSat(lpfR.process(sumR), 1.12, 0.02);
  }

  const [revL, revR] = applyStudioRoom(left, right, 0.32, 0.62, 2600);
  return finalizeStereo(revL, revR, targetDb, false);
}

// ============================================================================
// 6. CLI Runner — Builds All 14 Manifest Slots Deterministically
// ============================================================================
function parseOutDirs(argv) {
  const dirs = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out" && argv[i + 1]) {
      dirs.push(argv[++i]);
    }
  }
  return dirs.length > 0 ? dirs : [path.join("public", "sfx")];
}

function buildAllStudioAssets() {
  return [
    // 3 Round-Robin Tactile UI Clicks
    {
      file: "click-01.wav",
      stereo: synthTactileTap({
        seed: 1011, durSec: 0.11, attackMs: 2.6, attackBandHz: 3400,
        bodyHz: 255, bodyDecaySec: 0.018, shellHz: 1420, shellMix: 0.22, drive: 1.85, targetDb: -5.0,
      }),
    },
    {
      file: "click-02.wav",
      stereo: synthTactileTap({
        seed: 1022, durSec: 0.11, attackMs: 3.1, attackBandHz: 2950,
        bodyHz: 225, bodyDecaySec: 0.02, shellHz: 1180, shellMix: 0.2, drive: 1.8, targetDb: -5.0,
      }),
    },
    {
      file: "click-03.wav",
      stereo: synthTactileTap({
        seed: 1033, durSec: 0.11, attackMs: 2.3, attackBandHz: 3850,
        bodyHz: 290, bodyDecaySec: 0.016, shellHz: 1680, shellMix: 0.24, drive: 1.9, targetDb: -5.0,
      }),
    },

    // 4 Round-Robin Damped Laptop / Mechanical Keystrokes
    {
      file: "key-01.wav",
      stereo: synthTactileTap({
        seed: 2011, durSec: 0.072, attackMs: 2.2, attackBandHz: 2450,
        bodyHz: 210, bodyDecaySec: 0.013, shellHz: 780, shellMix: 0.16, drive: 1.55, targetDb: -7.5,
      }),
    },
    {
      file: "key-02.wav",
      stereo: synthTactileTap({
        seed: 2022, durSec: 0.072, attackMs: 2.5, attackBandHz: 2150,
        bodyHz: 192, bodyDecaySec: 0.014, shellHz: 710, shellMix: 0.15, drive: 1.5, targetDb: -7.5,
      }),
    },
    {
      file: "key-03.wav",
      stereo: synthTactileTap({
        seed: 2033, durSec: 0.072, attackMs: 2.0, attackBandHz: 2780,
        bodyHz: 238, bodyDecaySec: 0.012, shellHz: 860, shellMix: 0.17, drive: 1.6, targetDb: -7.5,
      }),
    },
    {
      file: "key-04.wav",
      stereo: synthTactileTap({
        seed: 2044, durSec: 0.072, attackMs: 2.4, attackBandHz: 2300,
        bodyHz: 222, bodyDecaySec: 0.013, shellHz: 745, shellMix: 0.15, drive: 1.55, targetDb: -7.5,
      }),
    },

    // Organic Swept Pink-Noise Whooshes & 1s Riser (Exact peakOffsetSec Alignment)
    {
      file: "whoosh-fast.wav",
      stereo: synthWhoosh({
        seed: 3011, durSec: 0.42, peakOffsetSec: 0.16,
        startHz: 220, peakHz: 2150, endHz: 290, q: 2.15,
        subChestMix: 0.16, reverbWet: 0.16, targetDb: -5.5,
      }),
    },
    {
      file: "whoosh-deep.wav",
      stereo: synthWhoosh({
        seed: 3022, durSec: 0.72, peakOffsetSec: 0.32,
        startHz: 120, peakHz: 960, endHz: 155, q: 1.95,
        subChestMix: 0.34, reverbWet: 0.22, targetDb: -5.0,
      }),
    },
    {
      file: "riser-1s.wav",
      stereo: synthRiser({
        seed: 3033, durSec: 1.15, peakOffsetSec: 1.0, targetDb: -4.5,
      }),
    },

    // Pitch-Enveloped Sub-Bass Impacts (110 -> 42 Hz / 118 -> 38 Hz + Warm Saturation)
    {
      file: "sub-hit-soft.wav",
      stereo: synthSubImpact({
        seed: 4011, durSec: 0.44, startHz: 110, endHz: 42,
        pitchTauSec: 0.048, ampTauSec: 0.115, drive: 1.85, reverbWet: 0.1, targetDb: -3.5,
      }),
    },
    {
      file: "sub-hit-heavy.wav",
      stereo: synthSubImpact({
        seed: 4022, durSec: 0.84, startHz: 118, endHz: 38,
        pitchTauSec: 0.068, ampTauSec: 0.24, drive: 2.1, reverbWet: 0.16, targetDb: -2.5,
      }),
    },

    // Tactile UI Pop & Modal/FM Brand Resolve Chime
    {
      file: "pop-subtle.wav",
      stereo: synthPopSubtle({ seed: 5011, durSec: 0.14, targetDb: -6.0 }),
    },
    {
      file: "resolve-warm.wav",
      stereo: synthResolveWarm({ durSec: 1.32, targetDb: -8.0 }),
    },
  ];
}

function main() {
  const outDirs = parseOutDirs(process.argv.slice(2)).map((d) =>
    path.resolve(process.cwd(), d)
  );
  const assets = buildAllStudioAssets();

  for (const dir of outDirs) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`\nTier-1 Procedural DSP SFX Pack (48 kHz 16-bit Stereo) -> ${dir}`);
    for (const asset of assets) {
      const wav = encodeStereoWav16(asset.stereo[0], asset.stereo[1]);
      fs.writeFileSync(path.join(dir, asset.file), wav);
      const ms = Math.round((asset.stereo[0].length / SAMPLE_RATE) * 1000);
      console.log(`  ✓ ${asset.file.padEnd(18)} ${String(ms).padStart(4)} ms  (${wav.length} bytes)`);
    }
  }
}

main();
