# LaunchSkill

[![Version](https://img.shields.io/badge/version-v0.5%20(beta)-blueviolet)](https://github.com/timjayas/launchskill)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-compatible-black)](https://agentskills.io)

Brand-agnostic creative-coding **Agent Skill** for building **15–60 second 16:9 product launch films** in Remotion—100% in code, tuned for X (Twitter).

Works across AI coding agents supporting the open [Agent Skills](https://agentskills.io) spec (Claude Code, Cursor, Codex, Antigravity, Windsurf, Copilot, and more).

> **Beta (`v0.5`):** LaunchSkill is in active beta. Expect **1 prompt** to generate a full, playable base cut, plus **2–3 short directing prompts** to dial in pacing, framing, and polish.

---

## Concept Demos

> *(Built with LaunchSkill in Remotion — drag and drop the `.mp4` files below in GitHub's README editor to embed them.)*

### Spotify Concept Launch
<!-- DRAG & DROP: Spotify concept demo .mp4 here on GitHub -->
`[ Video placeholder: drag-and-drop spotify-music-launch-mastered.mp4 here on GitHub ]`

### T3Code Concept Launch
<!-- DRAG & DROP: T3Code concept demo .mp4 here on GitHub -->
`[ Video placeholder: drag-and-drop t3code-editor-launch-mastered.mp4 here on GitHub ]`

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

## Audio: SFX-Only by Default + BYO `.mp3`

LaunchSkill ships **100% offline and license-free by default**—zero bundled copyrighted music, zero required API keys, and zero synthetic JS music beds:

- **Procedural DSP SFX *(default, offline)*:** Synthesizes crisp clicks, whooshes, thuds, and tactile foley locally as 48 kHz WAVs (`generate-dsp-sfx.mjs`).
- **BYO Licensed `.mp3` / `.wav` *(optional, offline)*:** Drop your own licensed music track into `public/audio/` and run `analyze-music.mjs` to detect BPM, first beat, and bass drop for frame-accurate cuts.
- **Broadcast Mastering *(offline, FFmpeg)*:** `master-audio.mjs` applies two-pass linear EBU R128 mastering (`-14 LUFS`, `-1.5 dBTP`) while copying the video stream untouched (`-c:v copy`).
- **AI Foley *(optional, opt-in)*:** Set `ELEVENLABS_API_KEY` to generate bespoke foley with auto sample-0 transient trimming (`generate-ai-sfx.mjs`).

| Mode | Command | Requirement |
| :--- | :--- | :---: |
| **Procedural DSP SFX** *(default)* | `node skills/launchskill/scripts/generate-dsp-sfx.mjs --out public/sfx` | Offline (Node only) |
| **BYO `.mp3` Beat Sync** *(optional)* | `node skills/launchskill/scripts/analyze-music.mjs --in public/audio/track.mp3 --out src/audio-beats.json --fps 30` | Offline (FFmpeg for `.mp3`) |
| **Broadcast Mastering (`-14 LUFS`)** | `node skills/launchskill/scripts/master-audio.mjs --in out/launch.mp4 --out out/launch-mastered.mp4` | Offline (FFmpeg) |
| **ElevenLabs AI Foley** *(optional)* | `ELEVENLABS_API_KEY=... node skills/launchskill/scripts/generate-ai-sfx.mjs --pack studio --out public/sfx` | Opt-in API key |

---

## What's Inside

- **Brand-First Stage 0 Gate (`DIRECTION.md`):** Extracts palette, typography (`@remotion/google-fonts`), and visual metaphors from your repo or brief before writing any `.tsx`.
- **4 Isolated Technique Playbooks (`skills/launchskill/styles/`):**
  - `editorial-morph.md` — Continuous `interpolatePaths` SVG morphs, metaball merges, `12fps` tactile boil.
  - `single-line-kinetic.md` — Unbroken `CameraTrackedStroke` across a `2×–3×` world canvas.
  - `paper-cutout.md` — Stepped `12fps` physical cutouts over a smooth `30fps` parallax camera.
  - `product-cinema.md` — `<SpatialCameraRig>` macro UI zooms, 2.5D device stages, and real product proof widgets.
- **Deterministic Primitives (`skills/launchskill/templates/`):** 100% frame-clock driven (`useCurrentFrame`, `interpolate`, `spring`)—zero `Math.random()`, `Date.now()`, or CSS transitions.
- **Visual QA Contact Sheet (`qa-frames.mjs`):** Renders hero stills + `cut - 1 / cut / cut + 2` boundary triplets into `contact-sheet.html` and audits against the 5 Universal Laws (`references/review-gates.md`).

---

## Known Beta Limits (`v0.5`)

- **Not 1-shot perfection:** The first generation gives you a strong, structured base cut; plan on 2–3 short directing prompts to nail exact rhythm, copy restraint, and visual taste.
- **16:9 landscape first:** Pacing, safe zones, and camera rigs are tuned for `1920×1080` X/Twitter launch videos. Vertical (`9:16`) and square (`1:1`) formats require manual reframing.
- **SFX-only out of the box:** No music tracks are bundled for licensing reasons—bring your own `.mp3`/`.wav` if you want a full soundtrack.
- **Local Chromium / WebGL rendering:** Remotion renders depend on local Chromium + `--gl=angle` (or `swiftshader` on headless machines); heavy 3D (`@remotion/three`) scenes render slower without GPU acceleration.
- **Visual QA still benefits from human eyes:** `qa-frames.mjs` catches cut-boundary glitches and layout issues, but final pacing and emotional punch are best verified by scrubbing in Remotion Studio.

---

## Explore Locally

```bash
git clone https://github.com/timjayas/launchskill.git
cd launchskill/demo
npm install
node ../skills/launchskill/scripts/generate-dsp-sfx.mjs --out public/sfx
npm run studio
```

Open [`lab/index.html`](./lab/index.html) directly in any browser (100% offline) to scrub the **18-pattern Interactive Motion Lab** frame-by-frame (`← / →`).

---

## Repository Structure

```text
launchskill/
├── README.md
├── LICENSE                                     # MIT License
├── SECURITY.md                                 # Script audit, offline defaults & disclosure policy
├── .cursorrules                                # Optional motion engineering rules
├── skills/launchskill/                         # Canonical Agent Skill (`npx skills add`)
│   ├── SKILL.md                                # Brand-first playbook & Stage 0 gate
│   ├── styles/                                 # 4 isolated Technique Playbooks
│   ├── references/                             # Universal laws, QA critic, physics, audio & X export
│   ├── templates/                              # Creative-coding primitives, motion.ts, widgets & scenes
│   ├── scripts/                                # Offline DSP SFX, beat sync, Motion DNA, QA & -14 LUFS mastering
│   ├── assets/sfx/                             # 14-slot studio foley manifest & DSP guide
│   └── examples/                               # Reference Remotion compositions
├── demo/                                       # Runnable Remotion 4 demo workspace
├── lab/ & patterns/                            # Zero-build offline 18-pattern Interactive Motion Lab
├── analysis/                                   # Empirical motion & BPM breakdowns
└── practice/drills.md                          # Progressive motion drills & critique rubric
```

---

## Security & License

- **Security:** See [SECURITY.md](./SECURITY.md) for the script-by-script filesystem, subprocess, and opt-in network inventory.
- **License:** [MIT](./LICENSE).
