# License-Free Studio SFX Pack (`assets/sfx/`)

All **14 studio foley WAV slots** in [`manifest.json`](./manifest.json) are generated deterministically and 100% license-free using our **Tier-1 Procedural DSP SFX Engine** (48 kHz, 16-bit Stereo PCM):

```bash
node skills/launchskill/scripts/generate-dsp-sfx.mjs \
  --out public/sfx
```

### Acoustic DSP Architecture
- **Whooshes & Risers (`whoosh-fast.wav`, `whoosh-deep.wav`, `riser-1s.wav`)**: Swept resonant bandpass-filtered Paul Kellet pink noise + subtle stereo Schroeder room reverb tail, aligned to exact `peakOffsetSec` (`0.16s`, `0.32s`, `1.0s`).
- **Clicks, Keys & Pops (`click-01..03.wav`, `key-01..04.wav`, `pop-subtle.wav`)**: Sample-0 multi-layer transients (`2–4ms` band-limited noise attack + damped `180–350 Hz` body resonance + subtle modal shell + asymmetric soft tape saturation).
- **Sub-Bass Impacts (`sub-hit-soft.wav`, `sub-hit-heavy.wav`)**: Pitch-enveloped sub-bass drops (`110 Hz → 42 Hz` / `118 Hz → 38 Hz`) + damped chest transient + warm harmonic saturation.
- **Brand Resolve (`resolve-warm.wav`)**: Decaying-index modal/FM harmonic chime + stereo early reflections & short studio room ambience.

*(Optional Tier 2)* Replace any individual slot with custom physical-object foley via `scripts/generate-ai-sfx.mjs` (`ELEVENLABS_API_KEY`) or your own recorded WAVs matching `manifest.json`.
