#!/usr/bin/env node
/**
 * Tier-1 Procedural DSP Music Bed Generator (Zero External Dependencies, 100% License-Free)
 *
 * Synthesizes a modern, minimalist electronic/tech launch trailer music bed in
 * 48 kHz Stereo 16-bit PCM WAV — built with real audio DSP (never raw chiptune):
 *   - Tight studio kick (pitch-enveloped sub + filtered transient click + tanh warmth)
 *   - Brushed stereo hi-hats & 16th shaker groove (high-passed pink/white noise)
 *   - Wood-rim / soft studio clap on beats 2 & 4 + stereo room ambience
 *   - Sidechained warm analog sub-bass (filtered saw/tri hybrid, mono < 140 Hz)
 *   - Filtered FM glass plucks + ping-pong dotted-8th stereo delay
 *   - Warm stereo pad + Schroeder 4-comb/2-allpass room reverb
 *   - Structural arrangement locked to exact beat cuts (default: 40 beats @ 142 BPM)
 *
 * Usage:
 *   node skills/launchskill/scripts/generate-dsp-music.mjs --bpm 142 --beats 40 --out public/audio/bed-142bpm.wav
 */

import fs from "node:fs";
import path from "node:path";

const SAMPLE_RATE = 48000;
const CHANNELS = 2;
const BITS_PER_SAMPLE = 16;

function createRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function softSat(x, drive = 1.4) {
  return Math.tanh(x * drive) / Math.tanh(drive);
}

function midiToHz(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Paul Kellet's high-precision pink noise filter */
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
    const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
    return pink;
  };
}

/** Simple 1-pole lowpass / highpass helpers */
function createSvf() {
  let low = 0;
  let band = 0;
  return {
    process(input, cutoffHz, q = 0.75) {
      const clamped = Math.max(25, Math.min(SAMPLE_RATE * 0.43, cutoffHz));
      const f = 2 * Math.sin((Math.PI * clamped) / SAMPLE_RATE);
      low += f * band;
      const high = input - low - q * band;
      band += f * high;
      return { low, band, high };
    },
  };
}

/** Stereo Schroeder Room Reverb */
function applyStereoReverb(inL, inR, wet = 0.22) {
  const n = inL.length;
  const outL = new Float32Array(n);
  const outR = new Float32Array(n);
  const combDelaysL = [1399, 1613, 1877, 2111];
  const combDelaysR = [1427, 1657, 1907, 2143];
  const combFb = 0.76;

  const makeCombs = (delays) =>
    delays.map((len) => ({ buf: new Float32Array(len), idx: 0, lp: 0 }));
  const combsL = makeCombs(combDelaysL);
  const combsR = makeCombs(combDelaysR);
  const apL = [347, 113].map((len) => ({ buf: new Float32Array(len), idx: 0 }));
  const apR = [367, 127].map((len) => ({ buf: new Float32Array(len), idx: 0 }));

  for (let i = 0; i < n; i++) {
    let sumL = 0;
    let sumR = 0;
    const xL = inL[i];
    const xR = inR[i];
    for (let c = 0; c < 4; c++) {
      const cL = combsL[c];
      const yL = cL.buf[cL.idx];
      cL.lp = cL.lp * 0.35 + yL * 0.65;
      cL.buf[cL.idx] = xL + cL.lp * combFb;
      cL.idx = (cL.idx + 1) % cL.buf.length;
      sumL += yL;

      const cR = combsR[c];
      const yR = cR.buf[cR.idx];
      cR.lp = cR.lp * 0.35 + yR * 0.65;
      cR.buf[cR.idx] = xR + cR.lp * combFb;
      cR.idx = (cR.idx + 1) % cR.buf.length;
      sumR += yR;
    }
    let wL = sumL * 0.25;
    let wR = sumR * 0.25;
    for (let a = 0; a < 2; a++) {
      const aL = apL[a];
      const bufOutL = aL.buf[aL.idx];
      const vL = wL + bufOutL * 0.5;
      aL.buf[aL.idx] = vL;
      aL.idx = (aL.idx + 1) % aL.buf.length;
      wL = bufOutL - vL * 0.5;

      const aR = apR[a];
      const bufOutR = aR.buf[aR.idx];
      const vR = wR + bufOutR * 0.5;
      aR.buf[aR.idx] = vR;
      aR.idx = (aR.idx + 1) % aR.buf.length;
      wR = bufOutR - vR * 0.5;
    }
    outL[i] = inL[i] + wL * wet;
    outR[i] = inR[i] + wR * wet;
  }
  return [outL, outR];
}

/** Add a tight studio kick at sampleOffset */
function addKick(busL, busR, sidechainEnv, offset, gain = 0.85, heavy = true) {
  const dur = 0.32;
  const len = Math.floor(SAMPLE_RATE * dur);
  const rng = createRng(1001 + offset);
  let phase = 0;
  for (let i = 0; i < len && offset + i < busL.length; i++) {
    const t = i / SAMPLE_RATE;
    const fEnd = heavy ? 44 : 52;
    const freq = fEnd + 78 * Math.exp(-t * 38);
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const subEnv = Math.exp(-t * 11.5) * Math.min(1, t / 0.0025);
    const sub = Math.sin(phase) * subEnv;

    const clickEnv = Math.exp(-t * 280);
    const click = ((rng() * 2 - 1) * 0.35 + Math.sin(2 * Math.PI * 340 * t) * 0.45) * clickEnv;

    const s = softSat(sub * 0.92 + click * 0.32, 1.35) * gain;
    busL[offset + i] += s;
    busR[offset + i] += s;
  }
  // Register sidechain ducking envelope (~180ms recovery)
  const scLen = Math.floor(SAMPLE_RATE * 0.24);
  for (let i = 0; i < scLen && offset + i < sidechainEnv.length; i++) {
    const t = i / SAMPLE_RATE;
    const duck = 1 - 0.52 * Math.exp(-t * 18) * Math.min(1, t / 0.003);
    sidechainEnv[offset + i] = Math.min(sidechainEnv[offset + i], duck);
  }
}

/** Add brushed stereo hi-hat or shaker */
function addHat(busL, busR, pink, offset, open = false, gain = 0.16, pan = 0.12) {
  const dur = open ? 0.16 : 0.055;
  const len = Math.floor(SAMPLE_RATE * dur);
  const svf = createSvf();
  const decay = open ? 24 : 78;
  const lGain = gain * (1 - pan);
  const rGain = gain * (1 + pan);
  for (let i = 0; i < len && offset + i < busL.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * decay) * Math.min(1, t / 0.0012);
    const { high } = svf.process(pink(), open ? 6200 : 7600, 0.72);
    const s = softSat(high * env, 1.15);
    busL[offset + i] += s * lGain;
    busR[offset + i] += s * rGain;
  }
}

/** Add wood-rim / crisp studio clap on 2 & 4 */
function addRimClap(busL, busR, pink, offset, gain = 0.24) {
  const dur = 0.14;
  const len = Math.floor(SAMPLE_RATE * dur);
  const svf = createSvf();
  for (let i = 0; i < len && offset + i < busL.length; i++) {
    const t = i / SAMPLE_RATE;
    const rim = Math.sin(2 * Math.PI * 465 * t) * Math.exp(-t * 68) * 0.42;
    const clapBurst =
      (Math.exp(-t * 48) + 0.55 * Math.exp(-Math.max(0, t - 0.011) * 58)) *
      Math.min(1, t / 0.0015);
    const { band } = svf.process(pink(), 1750, 0.85);
    const s = softSat((rim + band * clapBurst * 1.15) * gain, 1.25);
    busL[offset + i] += s * 0.96;
    busR[offset + i] += s * 1.04;
  }
}

/** Add filtered warm analog bass note */
function addBassNote(busL, busR, offset, durSec, midi, gain = 0.42) {
  const len = Math.floor(SAMPLE_RATE * durSec);
  const freq = midiToHz(midi);
  const svf = createSvf();
  let phase = 0;
  for (let i = 0; i < len && offset + i < busL.length; i++) {
    const t = i / SAMPLE_RATE;
    phase = (phase + freq / SAMPLE_RATE) % 1;
    // Smooth saw + sub sine blend
    const saw = phase * 2 - 1;
    const sub = Math.sin(2 * Math.PI * phase);
    const raw = saw * 0.55 + sub * 0.65;
    const cutoff = 165 + 420 * Math.exp(-t * 9.5);
    const { low } = svf.process(raw, cutoff, 0.72);
    const att = Math.min(1, t / 0.008);
    const rel = Math.min(1, Math.max(0, durSec - t) / 0.025);
    const s = softSat(low, 1.25) * att * rel * gain;
    busL[offset + i] += s;
    busR[offset + i] += s;
  }
}

/** Add filtered FM glass pluck */
function addPluck(busL, busR, offset, midi, durSec = 0.28, gain = 0.22, pan = 0) {
  const len = Math.floor(SAMPLE_RATE * durSec);
  const freq = midiToHz(midi);
  const svf = createSvf();
  const lGain = gain * Math.max(0.2, 1 - pan);
  const rGain = gain * Math.max(0.2, 1 + pan);
  for (let i = 0; i < len && offset + i < busL.length; i++) {
    const t = i / SAMPLE_RATE;
    const modIndex = 1.6 * Math.exp(-t * 18);
    const mod = Math.sin(2 * Math.PI * freq * 2.0 * t) * modIndex;
    const carrier = Math.sin(2 * Math.PI * freq * t + mod);
    const sub = Math.sin(2 * Math.PI * freq * 0.5 * t) * 0.22;
    const cutoff = 420 + 2600 * Math.exp(-t * 14);
    const { low } = svf.process(carrier + sub, cutoff, 0.78);
    const env = Math.min(1, t / 0.004) * Math.exp(-t * 8.5);
    const s = softSat(low * env, 1.1);
    busL[offset + i] += s * lGain;
    busR[offset + i] += s * rGain;
  }
}

/** Add warm stereo pad chord */
function addPadChord(busL, busR, offset, durSec, midis, gain = 0.13) {
  const len = Math.floor(SAMPLE_RATE * durSec);
  const svfL = createSvf();
  const svfR = createSvf();
  for (let i = 0; i < len && offset + i < busL.length; i++) {
    const t = i / SAMPLE_RATE;
    const att = Math.min(1, t / 0.18);
    const rel = Math.min(1, Math.max(0, durSec - t) / 0.45);
    const env = att * rel * gain;
    let sumL = 0;
    let sumR = 0;
    for (let m = 0; m < midis.length; m++) {
      const f = midiToHz(midis[m]);
      sumL += Math.sin(2 * Math.PI * (f * 0.9985) * t) + 0.35 * Math.sin(2 * Math.PI * f * 2 * t);
      sumR += Math.sin(2 * Math.PI * (f * 1.0015) * t) + 0.35 * Math.sin(2 * Math.PI * f * 2 * t);
    }
    const { low: l } = svfL.process(sumL / midis.length, 980, 0.75);
    const { low: r } = svfR.process(sumR / midis.length, 980, 0.75);
    busL[offset + i] += l * env;
    busR[offset + i] += r * env;
  }
}

/** Stereo ping-pong delay for plucks/arps */
function applyPingPongDelay(inL, inR, beatSec, feedback = 0.24, mix = 0.28) {
  const n = inL.length;
  const outL = new Float32Array(n);
  const outR = new Float32Array(n);
  const dL = Math.floor(beatSec * 0.75 * SAMPLE_RATE); // dotted 8th
  const dR = Math.floor(beatSec * 0.5 * SAMPLE_RATE);  // 8th
  const bufL = new Float32Array(dL);
  const bufR = new Float32Array(dR);
  let idxL = 0;
  let idxR = 0;
  for (let i = 0; i < n; i++) {
    const tapL = bufL[idxL];
    const tapR = bufR[idxR];
    bufL[idxL] = inL[i] + tapR * feedback;
    bufR[idxR] = inR[i] + tapL * feedback;
    idxL = (idxL + 1) % dL;
    idxR = (idxR + 1) % dR;
    outL[i] = inL[i] + tapL * mix;
    outR[i] = inR[i] + tapR * mix;
  }
  return [outL, outR];
}

function encodeStereoWav16(left, right) {
  const numFrames = left.length;
  const blockAlign = CHANNELS * (BITS_PER_SAMPLE / 8);
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = numFrames * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0, "ascii");
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8, "ascii");
  buffer.write("fmt ", 12, "ascii");
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);
  buffer.write("data", 36, "ascii");
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numFrames; i++) {
    const cL = Math.max(-1, Math.min(1, left[i]));
    const cR = Math.max(-1, Math.min(1, right[i]));
    const o = 44 + i * 4;
    buffer.writeInt16LE(cL < 0 ? Math.round(cL * 32768) : Math.round(cL * 32767), o);
    buffer.writeInt16LE(cR < 0 ? Math.round(cR * 32768) : Math.round(cR * 32767), o + 2);
  }
  return buffer;
}

function parseArgs(argv) {
  const get = (flag, fallback) => {
    const idx = argv.indexOf(flag);
    return idx !== -1 && argv[idx + 1] ? argv[idx + 1] : fallback;
  };
  return {
    bpm: Number(get("--bpm", "142")),
    beats: Number(get("--beats", "40")),
    out: get("--out", path.join("public", "audio", "t3-bed-142bpm.wav")),
  };
}

function main() {
  const { bpm, beats, out } = parseArgs(process.argv.slice(2));
  if (!Number.isFinite(bpm) || bpm < 40 || bpm > 240) {
    console.error(`Invalid --bpm value: ${bpm} (expected 40–240).`);
    process.exit(1);
  }
  if (!Number.isFinite(beats) || beats < 1 || beats > 1024) {
    console.error(`Invalid --beats value: ${beats} (expected 1–1024).`);
    process.exit(1);
  }
  const beatSec = 60 / bpm;
  const totalSec = beats * beatSec;
  const totalSamples = Math.ceil(totalSec * SAMPLE_RATE);

  const drumL = new Float32Array(totalSamples);
  const drumR = new Float32Array(totalSamples);
  const bassL = new Float32Array(totalSamples);
  const bassR = new Float32Array(totalSamples);
  const melodicL = new Float32Array(totalSamples);
  const melodicR = new Float32Array(totalSamples);
  const sidechainEnv = new Float32Array(totalSamples).fill(1);
  const pink = createPinkNoise(777);

  // D Dorian / Minor tech chord progression (4-beat bars)
  // Bar chords: Dm9 -> Bbmaj7 -> C6 -> Am7
  const roots = [38, 34, 36, 33]; // D2, Bb1, C2, A1
  const chords = [
    [62, 65, 69, 72, 76], // Dm9
    [58, 62, 65, 69, 74], // Bbmaj7
    [60, 64, 67, 69, 74], // C6/9
    [57, 60, 64, 67, 72], // Am7
  ];
  const arpPattern = [0, 2, 3, 1, 4, 2, 3, 4];

  for (let b = 0; b < beats; b++) {
    const bOffset = Math.round(b * beatSec * SAMPLE_RATE);
    const barIdx = Math.floor(b / 4) % 4;
    const inBar = b % 4;

    // Structural sections matching T3 Code 40-beat arc:
    //   0..3  : Hook (minimal pulse)
    //   4..8  : Dock (groove enters)
    //   9..23 : Control Plane Workspace (full driving groove)
    //   24..29: Keys Swap (high-energy lift)
    //   30..33: Dark Climax (Beat 30-31 drop-out tension, Beat 32-33 slam)
    //   34..39: Finale (resolved warm chord + gentle fade)
    const isDropSilent = b === 30 || b === 31;
    const isFinale = b >= 34;

    // 1. Studio Kick
    if (!isDropSilent && (!isFinale || b < 36)) {
      const kickGain = b < 4 ? 0.56 : isFinale ? 0.5 : 0.88;
      addKick(drumL, drumR, sidechainEnv, bOffset, kickGain, b >= 4);
    }

    // 2. Rimshot / Clap on beats 2 & 4 (inBar === 1 or 3)
    if (b >= 4 && !isDropSilent && !isFinale && (inBar === 1 || inBar === 3)) {
      addRimClap(drumL, drumR, pink, bOffset, b >= 24 ? 0.28 : 0.22);
    }

    // 3. 16th-note brushed hi-hat & off-beat accent groove
    if (!isDropSilent && b < 38) {
      for (let sub = 0; sub < 4; sub++) {
        const sOff = bOffset + Math.round((sub * 0.25) * beatSec * SAMPLE_RATE);
        if (b < 4 && sub % 2 !== 0) continue;
        const isOffbeat = sub === 2;
        const hatGain =
          (isFinale ? 0.06 : b >= 24 ? 0.16 : 0.12) *
          (isOffbeat ? 1.25 : sub === 0 ? 0.45 : 0.65);
        addHat(
          drumL,
          drumR,
          pink,
          sOff,
          isOffbeat && b >= 8 && b < 34,
          hatGain,
          sub % 2 === 0 ? -0.14 : 0.14
        );
      }
    }

    // 4. Sidechained Bass Pulse (8th-note push)
    if (b >= 4 && !isDropSilent && b < 38) {
      const root = roots[barIdx];
      const bassGain = isFinale ? 0.24 : 0.44;
      addBassNote(bassL, bassR, bOffset, beatSec * 0.46, root, bassGain);
      if (b < 34) {
        const off8 = bOffset + Math.round(0.5 * beatSec * SAMPLE_RATE);
        addBassNote(
          bassL,
          bassR,
          off8,
          beatSec * 0.44,
          b >= 24 && inBar === 3 ? root + 12 : root,
          bassGain * 0.85
        );
      }
    }

    // 5. Filtered FM Glass Pluck Arpeggio (8th notes)
    if (!isDropSilent && b < 38) {
      const chord = chords[barIdx];
      for (let e = 0; e < 2; e++) {
        const step = (b * 2 + e) % arpPattern.length;
        const note = chord[arpPattern[step] % chord.length];
        const pOff = bOffset + Math.round(e * 0.5 * beatSec * SAMPLE_RATE);
        const pGain = b < 4 ? 0.13 : isFinale ? 0.11 : 0.18;
        const pan = e === 0 ? -0.25 : 0.25;
        addPluck(melodicL, melodicR, pOff, note, 0.26, pGain, pan);
      }
    }

    // 6. Warm Pad Chords on bar starts (and Finale resolve Dmaj9)
    if (b % 4 === 0 && b < 34) {
      addPadChord(melodicL, melodicR, bOffset, beatSec * 3.9, chords[barIdx], 0.12);
    } else if (b === 34) {
      // Bright resolved Dmaj9 chord for Finale lockup
      addPadChord(melodicL, melodicR, bOffset, beatSec * 5.8, [62, 66, 69, 73, 76], 0.15);
    }
  }

  // Apply Ping-Pong Delay + Stereo Reverb to Melodic Bus
  const [delL, delR] = applyPingPongDelay(melodicL, melodicR, beatSec, 0.24, 0.28);
  const [wetL, wetR] = applyStereoReverb(delL, delR, 0.24);

  // Mix Buses with Sidechain Ducking + Master Soft Limiting + Clean Loop Fade
  const outL = new Float32Array(totalSamples);
  const outR = new Float32Array(totalSamples);
  const fadeOutSamples = Math.floor(0.95 * SAMPLE_RATE);
  const fadeInSamples = Math.floor(0.02 * SAMPLE_RATE);

  for (let i = 0; i < totalSamples; i++) {
    const sc = sidechainEnv[i];
    const mixL = drumL[i] + bassL[i] * sc + wetL[i] * (0.65 + 0.35 * sc);
    const mixR = drumR[i] + bassR[i] * sc + wetR[i] * (0.65 + 0.35 * sc);

    let env = 1;
    if (i < fadeInSamples) env = i / fadeInSamples;
    if (i > totalSamples - fadeOutSamples) {
      env *= Math.max(0, (totalSamples - i) / fadeOutSamples);
    }

    outL[i] = softSat(mixL * env, 1.15);
    outR[i] = softSat(mixR * env, 1.15);
  }

  // Peak normalize safely to -2.0 dBFS (~0.794) so it blends cleanly under SFX
  let peak = 0;
  for (let i = 0; i < totalSamples; i++) {
    const aL = Math.abs(outL[i]);
    const aR = Math.abs(outR[i]);
    if (aL > peak) peak = aL;
    if (aR > peak) peak = aR;
  }
  const targetPeak = Math.pow(10, -2.0 / 20);
  if (peak > 1e-6) {
    const gain = targetPeak / peak;
    for (let i = 0; i < totalSamples; i++) {
      outL[i] *= gain;
      outR[i] *= gain;
    }
  }

  const outPath = path.resolve(process.cwd(), out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const wav = encodeStereoWav16(outL, outR);
  fs.writeFileSync(outPath, wav);
  console.log(
    `✓ Generated ${bpm} BPM, ${beats}-beat (${totalSec.toFixed(2)}s) Stereo DSP music bed -> ${outPath} (${(
      wav.length /
      (1024 * 1024)
    ).toFixed(2)} MB)`
  );
}

main();
