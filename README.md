# LaunchSkill

[![Version](https://img.shields.io/badge/version-v0.5%20(beta)-blueviolet)](https://github.com/timjayas/launchskill)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-compatible-black)](https://agentskills.io)

Opinionated, brand-adaptive **Agent Skill** for building **15–45 second 16:9 premium product showcase & clean UI motion launch films** in Remotion—100% in code, tuned for X (Twitter).

Works across AI coding agents supporting the open [Agent Skills](https://agentskills.io) spec (Claude Code, Cursor, Codex, Antigravity, Windsurf, Copilot, and more).

> **Beta (`v0.5`):** LaunchSkill is in active beta. Expect **1 prompt** to generate a full, playable base cut, plus **3–5 short directing prompts** to dial in pacing, framing, and polish.

---

## Concept Demos

> *(Unofficial concept demos built with LaunchSkill in Remotion to showcase brand-adaptive motion across two completely different aesthetics.)*


### T3Code Concept Launch

https://github.com/user-attachments/assets/01b5fcde-ebb4-4e84-b500-23a6b59a50a6

### Spotify Concept Launch

https://github.com/user-attachments/assets/54215e09-77d9-49b4-bbdf-cc76593e05fb


---

## Install (1-Line)

```bash
# Install into your current project
npx skills add timjayas/launchskill

# Or install globally across your coding agents
npx skills add timjayas/launchskill -g
```

---

## Prerequisites

- **Node.js 18+** — all skill scripts use Node.js built-ins only (zero extra npm dependencies).
- **FFmpeg** — used for `-14 LUFS` broadcast mastering (`master-audio.mjs`), `.mp3` beat/drop detection (`analyze-music.mjs`), and Motion DNA analysis (`extract-motion-dna.mjs`). Auto-discovered from `PATH` or Remotion's bundled `@remotion/compositor-*`; scripts exit with a clear install hint if missing:
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt-get install ffmpeg`
  - Windows: `winget install Gyan.FFmpeg`
- **Remotion 4** (`remotion`, `@remotion/paths`, `@remotion/google-fonts`) in your target video project.

---

## The Honest Workflow: 1 Base Prompt + 2–3 Directing Prompts

LaunchSkill is designed like working with a motion director, not a 1-click template generator:

1. **Prompt 1 — Build the Base Film:** Give your agent your **product name**, **1-sentence pitch**, and **1–3 concrete proof points** (plus optional screenshots or repo files). LaunchSkill runs a mandatory **Stage 0 (`DIRECTION.md`)** brand-discovery gate, locks one motion playbook, builds the Remotion scenes, synthesizes offline procedural SFX, and renders a visual QA contact sheet.
2. **Prompts 2–4 — Direct the Cut:** Scrub the base cut in Remotion Studio (`npm run studio`) or the QA contact sheet, then send 2–3 focused directing notes:
   - *"Tighten Scene 2 by 15 frames and punch in closer on the code diff."*
   - *"Swap the dark background in Act 2 for a clean light surface polarity flip."*
   - *"Sync the main cuts to `public/audio/my-track.mp3` and master to -14 LUFS."*

### Example Starter Prompt

> *"Use `launchskill` to build a 20-second 16:9 launch film in Remotion for **PulseDB** — instant Postgres branching for every pull request. Prove 3 things: (1) 400ms PR branch spin-up, (2) live schema diff, and (3) automatic teardown on merge. Discover the brand from this repo, lock the best technique playbook in `DIRECTION.md`, synthesize procedural DSP SFX, and run the visual QA contact sheet before final export."*

---

## Audio: Matching Real Music + Procedural DSP SFX

LaunchSkill never ships bundled copyrighted music or cheap code-generated synth loops—instead, its standard production pipeline pairs a **real, license-cleared matching music track** with offline procedural studio SFX:

- **Matching Real Music *(beat-synced, offline analysis)*:** Source a real, license-cleared `.mp3` / `.wav` matching the product's mood and tempo (`public/audio/`), then run `analyze-music.mjs` to lock cuts, drops, and loop boundaries to the real song.
- **Procedural DSP SFX *(offline, license-free)*:** Synthesizes crisp clicks, whooshes, thuds, and tactile foley locally as 48 kHz WAVs (`generate-dsp-sfx.mjs`), automatically ducking the music bed under hero impacts.
- **Broadcast Mastering *(offline, FFmpeg)*:** `master-audio.mjs` applies two-pass linear EBU R128 mastering (`-14 LUFS`, `-1.5 dBTP`) while copying the video stream untouched (`-c:v copy`).
- **AI Foley *(optional, opt-in)*:** Set `ELEVENLABS_API_KEY` to generate bespoke foley with auto sample-0 transient trimming (`generate-ai-sfx.mjs`).

| Mode | Command | Requirement |
| :--- | :--- | :---: |
| **Matching Music Beat Sync** *(recommended)* | `node skills/launchskill/scripts/analyze-music.mjs --in public/audio/track.mp3 --out src/audio-beats.json --fps 30` | Offline (FFmpeg for `.mp3`) |
| **Procedural DSP SFX** *(always layered)* | `node skills/launchskill/scripts/generate-dsp-sfx.mjs --out public/sfx` | Offline (Node only) |
| **Broadcast Mastering (`-14 LUFS`)** | `node skills/launchskill/scripts/master-audio.mjs --in out/launch.mp4 --out out/launch-mastered.mp4` | Offline (FFmpeg) |
| **ElevenLabs AI Foley** *(optional)* | `ELEVENLABS_API_KEY=... node skills/launchskill/scripts/generate-ai-sfx.mjs --pack studio --out public/sfx` | Opt-in API key |

---

## What's Inside

- **Brand-First Stage 0 Gate (`DIRECTION.md`):** Extracts palette, typography (`@remotion/google-fonts`), and surface polarity from your repo or brief before writing any `.tsx`—zero recycled templates, zero AI-slop HUD/telemetry chrome, and zero corner counters (`01 / 07`).
- **Opinionated Product Cinema Craft (`skills/launchskill/styles/product-cinema.md`):** Varied spatial choreography (no repetitive transitions), `<SpatialCameraRig>` macro UI dives (`1.0× ↔ 1.6–2.2×`), pixel-locked portal match cuts (`computePortalCatchZoom`), direct overlapping SVG `<clipPath>` peels, physically driven finale lockups (no static centered flexbox endings), and seamless infinite loops back into Frame 0.
- **Deterministic Motion Foundation (`skills/launchskill/templates/`):** 100% frame-clock driven (`useCurrentFrame`, `interpolate`, `spring`)—zero `Math.random()`, `Date.now()`, or CSS transitions.
- **Two-Stage Visual & Playback QA (`qa-frames.mjs` + End-to-End `.mp4` Review):** Renders hero stills, `cut - 1 / cut / cut + 2` triplets, and `loop-end / loop-start` seam frames into `contact-sheet.html` as a pre-check, followed by mandatory end-to-end review of the exported mastered `.mp4` against the 5 Universal Laws + Blind Adversarial Critic (`references/review-gates.md`).

---

## Known Beta Limits (`v0.5`)

- **Not 1-shot perfection:** The first generation gives you a strong, structured base cut; plan on 2–3 short directing prompts to nail exact rhythm, copy restraint, and visual taste.
- **16:9 landscape first:** Pacing, safe zones, and camera rigs are tuned for `1920×1080` X/Twitter launch videos. Vertical (`9:16`) and square (`1:1`) formats require manual reframing.
- **Bring or source your own licensed music:** No copyrighted music tracks are bundled—source a matching royalty-free/licensed `.mp3`/`.wav` for `public/audio/` (or explicitly opt into SFX-only).
- **Local Chromium / WebGL rendering:** Remotion renders depend on local Chromium + `--gl=angle` (or `swiftshader` on headless machines); heavy 3D (`@remotion/three`) scenes render slower without GPU acceleration.
- **Always watch the exported `.mp4` end-to-end:** `qa-frames.mjs` catches cut-boundary and loop-seam frame issues upfront, but real pacing, overlaps, and motion flow must always be verified on the rendered `.mp4`.

---

## Explore Locally

```bash
git clone [https://github.com/timjayas/launchskill.git](https://github.com/timjayas/launchskill.git)
cd launchskill/demo
npm install
node ../skills/launchskill/scripts/generate-dsp-sfx.mjs --out public/sfx
npm run studio
```

---

## Security & License

- **Security:** See [SECURITY.md](./SECURITY.md) for the script-by-script filesystem, subprocess, and opt-in network inventory.
- **License:** [MIT](./LICENSE).
