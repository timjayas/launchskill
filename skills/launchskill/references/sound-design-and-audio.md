# Studio Sound Design, Matching Real Music & Procedural DSP Foley

X timelines auto-play muted, so every launch video **must read 100% clearly without sound**. When viewers tap unmute, studio polish comes from **real, matching background music beat-synced to the cut + crisp, sample-0 accurate procedural DSP SFX**, ducked cleanly and mastered to `-14 LUFS`.

> **Audio Quality Law (Real Matching Music + Crisp SFX · Zero Code-Generated Music):**
> 1. **NEVER synthesize code-generated background music beds or JS synth/chiptune loops.** Generated music sounds artificial and cheapens high-craft motion design.
> 2. **Source Real Matching Background Music (Standard Expectation):** Check `public/audio/` or the workspace first; if no track is present, actively source (or guide/ask the user to provide) a **real, license-cleared `.mp3` / `.wav`** whose genre, tempo (`110–134 BPM` sweet spot), and energy arc genuinely match the product's world (royalty-free / Creative Commons / licensed library). Run [scripts/analyze-music.mjs](../scripts/analyze-music.mjs) to lock every cut and climax drop to the real song. *(Only fall back to SFX-only when the user explicitly requests SFX-only or while awaiting a licensed track.)*
> 3. **Layer Procedural DSP SFX + Music Ducking:** Run [scripts/generate-dsp-sfx.mjs](../scripts/generate-dsp-sfx.mjs) for tactile mechanical clicks, swept pink-noise air whooshes, pitch-enveloped sub-drops, 1s risers, and warm felt-marimba resolves—automatically ducking the music bed `-4 to -6 dB` under hero hits (`duckMusic: true`) and mastering the combined mix via [scripts/master-audio.mjs](../scripts/master-audio.mjs).

---

## 1. Two-Tier Studio Foley Architecture (SFX Only)

### Tier 1 (Default — Offline, Zero-API-Key, License-Free): Procedural DSP SFX Engine
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

### Tier 2 (Optional Upgrade): ElevenLabs AI Foley + Auto FFmpeg Transient Trim
When `ELEVENLABS_API_KEY` is set and a product needs photorealistic physical-object foley (e.g., brushed aluminum bottle cap twist, camera shutter, mechanical watch dial), run [scripts/generate-ai-sfx.mjs](../scripts/generate-ai-sfx.mjs):

```bash
node skills/launchskill/scripts/generate-ai-sfx.mjs --pack studio --out public/sfx
```

---

## 2. Sourcing & Beat-Syncing Real Matching Music (`analyze-music.mjs`)

Real produced music gives a launch film emotional momentum and rhythmic cohesion that bare SFX cannot match:

1. **Match the Product's World:** Pick a real, license-cleared instrumental track (royalty-free / CC0 / user-licensed library) whose sonic texture matches the brand—e.g., crisp minimalist electronic/IDM pulse for a devtool, warm tactile percussion/indie grooves for a creative app, tight kinetic house/breakbeat for a high-energy showcase. Avoid generic corporate ukulele, cheesy epic trailer horns, or vocal tracks that fight on-screen copy.
2. **Extract Exact Tempo, Phase & Drop:** Drop the track into `public/audio/track.mp3` (or `.wav`) and run [scripts/analyze-music.mjs](../scripts/analyze-music.mjs):

```bash
node skills/launchskill/scripts/analyze-music.mjs \
  --in public/audio/track.mp3 \
  --out src/audio-beats.json \
  --fps 30
```

3. **Lock Cuts & Infinite-Loop Boundary to the Music Grid:**
   - Pass the detected `bpm` and `firstBeatSec` directly into `createBeatGrid(bpm, fps, firstBeatSec)` from [templates/motion.ts](../templates/motion.ts), and align your climax or hero reveal directly to `dropFrame`.
   - Size the composition duration to a clean musical bar boundary (e.g., `8`, `12`, or `16` bars at `bpm`) and apply loop-safe fades (`fadeInSec={0.2}`, `fadeOutSec={0.35}` — roughly `6f` in / `10f` out at `30fps`) so the seamless infinite loop back to Frame 0 never clicks or cuts mid-bar.
   - *(If the user explicitly requests SFX-only—or no licensed track is available yet—omit `musicTrack` and keep crisp SFX only.)*

---

## 3. Studio Mixing in Remotion (`SoundTrackLayer` v2)

Import `<SoundTrackLayer />` from [templates/StudioPrimitives.tsx](../templates/StudioPrimitives.tsx) and `buildRoundRobinCues` from [templates/motion.ts](../templates/motion.ts). It provides clean SFX-first mixing automatically:
1. **Round-Robin + Deterministic Micro-Pitch (`playbackRate: 0.95–1.05`)**: Cycles `key-01..04.wav` or `click-01..03.wav` with slight pitch scatter so rapid typing or UI snaps sound organic.
2. **Peak-Aligned Risers & Whooshes (`peakAtFrame` + `peakOffsetSec`)**: Automatically starts sweeps *before* the cut so sonic peak hits the exact visual cut frame.
3. **Optional BYO Track Ducking (`duckMusic: true`)**: When a user-supplied `musicTrack` is passed, smoothly dips it `-4 to -6 dB` under hero impacts and breathes back up over `0.32s`.

```tsx
import { SoundTrackLayer, type SfxCue } from "../templates/StudioPrimitives";
import { buildRoundRobinCues, sec } from "../templates/motion";

const cues: SfxCue[] = [
  ...buildRoundRobinCues(
    typingFrames,
    ["sfx/key-01.wav", "sfx/key-02.wav", "sfx/key-03.wav", "sfx/key-04.wav"],
    fps,
    { volume: 0.24, pitchSpread: 0.05 }
  ),
  { frame: confirmFrame, src: "sfx/click-01.wav", volume: 0.42 },
  { peakAtFrame: pullBackFrame, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.34 },
  { frame: pullBackFrame, src: "sfx/sub-hit-soft.wav", volume: 0.34, duckMusic: true },
  { peakAtFrame: climaxFrame, peakOffsetSec: 1.0, src: "sfx/riser-1s.wav", volume: 0.28 },
  { frame: climaxFrame, src: "sfx/sub-hit-heavy.wav", volume: 0.44, duckMusic: true },
  { frame: finaleConfirmFrame, src: "sfx/resolve-warm.wav", volume: 0.26, duckMusic: true },
];

// Standard production mix: real beat-synced music bed + ducked procedural DSP SFX
<SoundTrackLayer
  musicTrack="audio/track.mp3"
  musicVolume={0.25}
  musicStartFromSec={audioBeats.firstBeatSec}
  fadeInSec={0.2}
  fadeOutSec={0.35}
  cues={cues}
/>;
```

### Mix Discipline & Level Targets (Music + SFX Production Mix)
Aim for **10–18 crisp, purposeful SFX cues** layered cleanly over the music bed so every transition, click, and climax hits with physical weight without muddying the track:

| Role | Typical Volume | Timing Rule |
| :--- | :---: | :--- |
| **Matching real music bed (`.mp3` / `.wav`)** | `0.22 – 0.28` | Beat-synced via `analyze-music.mjs`; bar-aligned duration + `6f/10f` loop-safe fades; auto-ducks (`-4 to -6 dB`) under hero impacts |
| **UI keystrokes / micro-pops** | `0.18 – 0.28` | Always round-robin + `pitchSpread: 0.05` synced to exact character frames |
| **Confirm clicks / snaps** | `0.34 – 0.46` | Exact visual snap frame (`0f` offset) |
| **Swept pink-noise whooshes** | `0.26 – 0.38` | Use `peakAtFrame: cutFrame` + `peakOffsetSec` (`0.16s` fast / `0.32s` deep) |
| **Sub-bass cut impacts** | `0.32 – 0.46` | Exact `cutFrame` (`0f` offset) with `duckMusic: true` for major pull-backs & polarity hits |
| **1s Risers** | `0.24 – 0.32` | Use `peakAtFrame: climaxFrame`, `peakOffsetSec: 1.0` |
| **CTA warm felt resolve** | `0.22 – 0.30` | `+0.05s` after final confirm click (`duckMusic: true`) — warm closure, never a harsh bell |

---

## 4. Clean Broadcast Mastering Pass (`master-audio.mjs`)

After `remotion render`, run [scripts/master-audio.mjs](../scripts/master-audio.mjs) to polish true-peak headroom (`-1.5 dBTP`) and loudness via two-pass EBU R128 while copying the video stream untouched (`-c:v copy` — zero visual re-encoding, finishes in ~1–2s):

```bash
node skills/launchskill/scripts/master-audio.mjs \
  --in out/launch-video.mp4 \
  --out out/launch-video-mastered.mp4
```

*(For sparse SFX-only cuts, pass `--lufs -16` or `-14` depending on transient density so crisp clicks stay punchy without clipping the `-1.5 dBTP` ceiling.)*
