# Studio Sound Design, Tier-1 Procedural DSP Foley & Beat-Synced Mastering

X timelines auto-play muted, so every launch video **must read 100% clearly without sound**. When viewers tap unmute, studio polish lives or dies on tactile, sample-0 accurate sound design, beat-locked pacing, and clean `-14 LUFS` broadcast headroom.

> **Audio Quality Law (Ban Naive Synths — Not Proper DSP):**
> 1. **NEVER ship raw/naive sine-wave beeps, harsh white-noise bursts, or cheap chiptune JS music loops.**
> 2. **Keep the repo 100% code-generated and license-free out of the box** using our **Tier-1 Procedural DSP SFX Engine** ([scripts/generate-dsp-sfx.mjs](../scripts/generate-dsp-sfx.mjs)) and optional **Tier-1 Procedural DSP Music Bed Generator** ([scripts/generate-dsp-music.mjs](../scripts/generate-dsp-music.mjs)) — built with genuine studio DSP (pink noise, swept resonant biquads, multi-layer transients, sidechained analog sub-bass, pitch-enveloped sub drops, filtered FM/modal decay, warm soft saturation, ping-pong delay, and Schroeder stereo room reverb).
> 3. **Hierarchy of Taste:** *Real produced instrumental track (or Tier-1 Procedural DSP Music Bed) + Tier-1 Procedural DSP (or Tier-2 recorded/AI) foley* **>** *Tier-1 Procedural DSP foley pack alone* **>** *Clean silent export* **>** *Naive raw sine-wave beeps / chiptune music loops (forbidden)*.

---

## 1. Two-Tier Studio Foley Architecture

### Tier 1 (Default — 100% Code-Generated, Offline, Zero-API-Key, License-Free): Procedural DSP SFX Engine
Run [scripts/generate-dsp-sfx.mjs](../scripts/generate-dsp-sfx.mjs) to deterministically synthesize all **14 studio 48 kHz 16-bit Stereo WAV slots** declared in [assets/sfx/manifest.json](../assets/sfx/manifest.json) with sample-0 transient alignment and exact `peakOffsetSec` curves:

```bash
# Populate your project's public/sfx/ (run with your installed skill path)
node skills/launchskill/scripts/generate-dsp-sfx.mjs --out public/sfx
```

Each DSP family uses dedicated studio sound-design architecture (never raw single-oscillator beeps):
- **Whooshes & Risers (`whoosh-fast.wav` @ `0.16s` peak, `whoosh-deep.wav` @ `0.32s` peak, `riser-1s.wav` @ `1.0s` peak)**: Paul Kellet **pink noise** (`1/f` spectrum) routed through a time-varying **2-pole RBJ resonant bandpass filter** matched to exact transition durations, subtle stereo air decorrelation, and a short damped **Schroeder studio room reverb tail**.
- **Clicks, Key Taps & UI Pops (`click-01..03.wav`, `key-01..04.wav`, `pop-subtle.wav`)**: Multi-layer sample-0 transients combining a **2–4 ms** band-limited noise attack, **damped 180–350 Hz body resonance**, subtle chassis/glass modal partial, and **asymmetric soft tape saturation (`tanh`)** — with distinct round-robin variants to kill robotic machine-gun repetition.
- **Impacts & Climax Drops (`sub-hit-soft.wav`, `sub-hit-heavy.wav`)**: **Exponential pitch-enveloped sub-bass drops** (`110 Hz → 42 Hz` / `118 Hz → 38 Hz`) + `3 ms` damped low-end chest transient + **warm harmonic saturation** (audible even on mobile phone speakers) + `28 Hz` highpass cleanup.
- **Brand Resolve Chime (`resolve-warm.wav`)**: **Warm mid-register felt-marimba resolve** (`D4 → A4` + soft `E5` warmth, `14 ms` soft attack, `1850 Hz` low-pass warmth filter, `-8.0 dBFS` gentle peak — zero harsh piercing treble bells) + stereo early reflections and short studio room ambience.

*(Optional Python `numpy`/`scipy` equivalent: the exact same DSP graph — Voss-McCartney pink noise, `scipy.signal.sosfilt` resonant bandpass sweeps, multi-layer transient summing, `np.tanh` soft clipping, and FFmpeg `-af highpass=f=28,alimiter` finishing — can be used when generating bespoke custom Foley.)*

### Tier 2 (Optional Upgrade): ElevenLabs AI Foley + Auto FFmpeg Transient Trim
When `ELEVENLABS_API_KEY` is set and a product needs photorealistic physical-object foley (e.g., brushed aluminum bottle cap twist, camera shutter, mechanical watch dial), run [scripts/generate-ai-sfx.mjs](../scripts/generate-ai-sfx.mjs):

```bash
node skills/launchskill/scripts/generate-ai-sfx.mjs --pack studio --out public/sfx
```

---

## 2. Background Music Bed (Tier-1 Procedural DSP Bed OR Tier-2 Real Instrumental Track)

### Option A (Zero-Dependency, 100% License-Free): Tier-1 Procedural DSP Music Bed
Generate a beat-locked, structurally arranged minimalist electronic/tech music bed (`48 kHz` Stereo 16-bit PCM) directly matched to your composition's BPM and exact beat count via [scripts/generate-dsp-music.mjs](../scripts/generate-dsp-music.mjs):

```bash
node skills/launchskill/scripts/generate-dsp-music.mjs \
  --bpm 142 \
  --beats 40 \
  --out public/audio/bed-142bpm.wav
```

Uses real studio DSP architecture (never cheap chiptune): pitch-enveloped studio kick + `tanh` warmth, 16th brushed stereo hi-hats, wood-rim/clap on beats 2 & 4, **sidechained warm analog sub-bass** (mono `< 140 Hz`), filtered FM glass plucks with dotted-8th ping-pong stereo delay, warm stereo pads, Schroeder room reverb, a 2-beat dark-climax drop-out, and a resolved `Dmaj9` finale tail.

### Option B (Optional Real Produced Track): Automatic Beat & Drop Detection
When you supply a real produced instrumental track (royalty-free / CC0 / commercial license, 35–60s), run [scripts/analyze-music.mjs](../scripts/analyze-music.mjs) to extract the exact tempo, first-beat phase offset, and primary bass drop:

```bash
node skills/launchskill/scripts/analyze-music.mjs \
  --in public/audio/bed.mp3 \
  --out src/audio-beats.json \
  --fps 30
```

Pass the detected `bpm` and `firstBeatSec` directly into `createBeatGrid(bpm, fps, firstBeatSec)` from [templates/motion.ts](../templates/motion.ts), and align your dark polarity climax or hero reveal directly to `dropFrame`!

---

## 3. Studio Mixing in Remotion (`SoundTrackLayer` v2)

Import `<SoundTrackLayer />` from [templates/StudioPrimitives.tsx](../templates/StudioPrimitives.tsx) and `buildRoundRobinCues` from [templates/motion.ts](../templates/motion.ts). It provides four studio mixing primitives automatically:
1. **Round-Robin + Deterministic Micro-Pitch (`playbackRate: 0.95–1.05`)**: Cycles `key-01..04.wav` or `click-01..03.wav` with slight pitch scatter so rapid typing or card pops sound organic.
2. **Peak-Aligned Risers & Whooshes (`peakAtFrame` + `peakOffsetSec`)**: Automatically starts sweeps *before* the cut so sonic peak hits the exact visual cut frame.
3. **Dynamic Music Bed Ducking (`duckMusic: true` / `duckWindows`)**: Smoothly dips background music `-4 to -6 dB` under hero impacts or the CTA resolve and breathes back up over `0.32s`.
4. **Loop-Safe Fade-In & Tail Fade-Out**: Aligns `musicStartFromSec` to `firstBeatSec` with a clean `1.1–1.2s` ending fade.

```tsx
import { SoundTrackLayer, type SfxCue } from "../templates/StudioPrimitives";
import { buildRoundRobinCues, createBeatGrid, sec } from "../templates/motion";

const g = createBeatGrid(132, fps, firstBeatSec);

const cues: SfxCue[] = [
  ...buildRoundRobinCues(
    typingFrames,
    ["sfx/key-01.wav", "sfx/key-02.wav", "sfx/key-03.wav", "sfx/key-04.wav"],
    fps,
    { volume: 0.14, pitchSpread: 0.05 }
  ),
  // Riser peaks right on the dark polarity climax!
  { peakAtFrame: g.beat(30), peakOffsetSec: 1.0, src: "sfx/riser-1s.wav", volume: 0.24 },
  { frame: g.beat(30), src: "sfx/sub-hit-heavy.wav", volume: 0.36, duckMusic: true },
  // Whip-pan whoosh peaks right on the cut frame
  { peakAtFrame: g.beat(9), peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.22 },
  // Tactile click on exact clickFrame
  { frame: clickFrame, src: "sfx/click-01.wav", volume: 0.36 },
  // Subtle felt-warm CTA resolve blends smoothly into the music bed (never sharp/loud!)
  { frame: g.beat(34) + sec(0.05, fps), src: "sfx/resolve-warm.wav", volume: 0.16 },
];

<SoundTrackLayer
  musicTrack="audio/bed-142bpm.wav"
  musicVolume={0.24}
  musicStartFromSec={firstBeatSec}
  cues={cues}
/>;
```

### Mix Discipline & Level Targets
Aim for **8–14 purposeful cues** across an 18–30s edit (leave breathing silence on readability holds):

| Role | Typical Volume | Timing Rule |
| :--- | :---: | :--- |
| **Music bed** | `0.22 – 0.28` | Align `musicStartFromSec` to `firstBeatSec`; auto-ducks `-4 to -6 dB` under hero hits |
| **UI keystrokes / micro-pops** | `0.11 – 0.17` | Always round-robin + `pitchSpread: 0.05` (every 2nd–3rd char only) |
| **Swept pink-noise whooshes** | `0.18 – 0.26` | Use `peakAtFrame: cutFrame` + `peakOffsetSec` (`0.16s` fast / `0.32s` deep) |
| **Sub-bass cut impacts** | `0.28 – 0.38` | Exact `cutFrame` (`0f` offset); pair `sub-hit-heavy` with `duckMusic: true` |
| **1s Risers** | `0.20 – 0.28` | Use `peakAtFrame: climaxFrame`, `peakOffsetSec: 1.0` |
| **CTA warm felt resolve** | `0.14 – 0.20` | `+0.05s` after final mark lockup — soft warmth, never a loud sharp bell |

---

## 4. Mandatory Broadcast Mastering Pass (`-14 LUFS` / `-1.5 dBTP`)

After `remotion render`, run [scripts/master-audio.mjs](../scripts/master-audio.mjs) to normalize loudness via **two-pass linear EBU R128** while copying the video stream untouched (`-c:v copy` — zero visual re-encoding, finishes in ~1–2s):

```bash
node skills/launchskill/scripts/master-audio.mjs \
  --in out/launch-video.mp4 \
  --out out/launch-video-mastered.mp4
```

Use `--measure` to inspect integrated LUFS and true peak before publishing so X's audio normalizer never crushes or pumps your launch film.
