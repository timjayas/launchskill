# LaunchSkill

Open-source **Agent Skill + Modular Remotion 4 Studio Kit + Interactive 18-Pattern Motion Lab** for generating studio-grade **15–60 second 16:9 product launch videos optimized for X (Twitter)**.

Works across AI coding agents supporting the open [Agent Skills](https://agentskills.io) specification (Claude Code, Cursor, Codex, Antigravity, Windsurf, Copilot, and more).

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

- **Node.js 18+** (uses built-in `fetch`, zero external dependencies for all skill scripts)
- **Remotion 4** (installed automatically inside `demo/` or your own Remotion project)
- **FFmpeg** *(optional)* — auto-discovered from `PATH` **or** from Remotion's bundled `@remotion/compositor-*` binary for `-14 LUFS` audio mastering and MP3 decoding

---

## 30-Second Quickstart

### 1. Trigger the Skill in Your Coding Agent
After installing via `npx skills add timjayas/launchskill`, prompt your agent with just three inputs (**Product Name**, **1-sentence mechanism**, and **1–3 key features**):

> **Example Prompt:**
> *"Use the `launchskill` skill to create a 24-second 16:9 X launch video in Remotion for **PulseDB** — instant Postgres branching for every pull request. Highlight 3 capabilities: (1) 1-click PR branch spin-up in 400ms, (2) live schema diff inside a Dark-Mode macOS terminal, and (3) automatic teardown on merge. Use pure light studio polarity, `#2563EB` accent, offline procedural DSP audio, and run the QA contact sheet before final export."*

### 2. Run the Included Remotion 4 Demo Kit Locally
```bash
git clone https://github.com/timjayas/launchskill.git
cd launchskill/demo
npm install

# Generate offline 48 kHz studio foley + beat-locked DSP music bed
node ../skills/launchskill/scripts/generate-dsp-sfx.mjs --out public/sfx
node ../skills/launchskill/scripts/generate-dsp-music.mjs --bpm 142 --beats 40 --out public/audio/t3-bed-142bpm.wav

# Preview in Remotion Studio
npm run studio

# Typecheck & verify compositions
npm run typecheck && npm run compositions
```

### 3. Open the Zero-Build Interactive Motion Lab
Open [`lab/index.html`](./lab/index.html) directly in Chrome, Edge, or Safari (100% offline) to scrub all **18 motion patterns** frame-by-frame (`← / →`), toggle `24p / 30p / 60p`, and compare **Senior** vs. **Amateur** motion physics.

---

## Studio Audio: Offline Procedural DSP vs. Optional BYO / AI Audio

LaunchSkill ships **100% license-free and offline by default** — zero bundled copyright audio, zero API keys required:

| Mode | Command | Network / API Key | Use Case |
| :--- | :--- | :---: | :--- |
| **Tier-1 Procedural DSP Foley** *(default)* | `node skills/launchskill/scripts/generate-dsp-sfx.mjs --out public/sfx` | **Offline (none)** | Deterministically synthesizes all 14 stereo 48 kHz WAV slots (swept pink-noise whooshes + Schroeder room reverb, sample-0 tactile clicks/keys, pitch-enveloped sub-bass drops, warm felt-marimba resolve) |
| **Tier-1 Procedural DSP Music Bed** *(default)* | `node skills/launchskill/scripts/generate-dsp-music.mjs --bpm 142 --beats 40 --out public/audio/bed.wav` | **Offline (none)** | Beat-locked minimalist electronic/tech groove (studio kick, sidechained analog sub-bass, brushed hats, filtered FM plucks + ping-pong delay, climax drop-out, `Dmaj9` resolve) |
| **Tier-2 BYO Licensed MP3 / WAV** *(optional)* | `node skills/launchskill/scripts/analyze-music.mjs --in public/audio/bed.mp3 --out src/audio-beats.json --fps 30` | **Offline (none)** | Extracts exact BPM, first-beat phase offset, and primary bass drop from your own licensed instrumental track so Remotion cuts lock directly to the song |
| **Tier-2 ElevenLabs AI Foley** *(optional)* | `ELEVENLABS_API_KEY=... node skills/launchskill/scripts/generate-ai-sfx.mjs --pack studio --out public/sfx` | **Opt-in env var** | Generates custom physical-object foley via ElevenLabs v2 with automatic FFmpeg leading-silence trim and peak normalization |
| **Broadcast Loudness Mastering** | `node skills/launchskill/scripts/master-audio.mjs --in out/launch.mp4 --out out/launch-mastered.mp4` | **Offline (FFmpeg)** | Two-pass linear EBU R128 mastering (`-14 LUFS` / `-1.5 dBTP`) with `-c:v copy` (zero video re-encoding) |

---

## Included Launch Archetypes

Switch presets in [`demo/launch.config.json`](./demo/launch.config.json) or let the skill derive bespoke brand tokens into any archetype:

1. **Spatial Creative Tool** (`kinetic-studio`) — Brand-framed nodes, radial bursts, vertical slot drums, live slider scrubs, 1-to-1 wired dataflow, focal-locked `<SpatialCameraRig>` hops + directional whip-pan blur.
2. **Editorial Brand Punch** (`rebrand-editorial`) — Display serif hooks, `3.2×` hard-cut macro typing punch-ins, MCP retrieval strobes, card-to-prompt-chip docking, Z-scatter Light→Dark flip, inline logo-slot headlines.
3. **Chat-to-Cinema Agentic** (`motionfly-agentic`) — Legacy-stack replacement dock, connected vertical MCP execution trees (all steps completing live), meta timeline assembly reveals, multiplayer cursor swarm convergence.
4. **Creative Ad Canvas** (`hera-ad-canvas`) — Dark↔Light dot-grid heartbeat, parallel agent cursors spawning mixed-aspect artboards, URL→Brand Kit radial bloom, in-place reference transmutation, canvas-to-full-bleed ad zoom.
5. Plus **`editorial-gallery`**, **`precision-devtool`**, **`hardware-studio`** (`@remotion/three` + offline `RoomEnvironment` IBL), and **`architectural-archive`**.

---

## Repository Structure

```text
launchskill/
├── README.md
├── LICENSE                                     # MIT License
├── SECURITY.md                                 # Script audit, offline defaults & disclosure policy
├── .cursorrules                                # Optional motion engineering rules for Cursor/Windsurf
├── skills/launchskill/                         # Canonical Agent Skill (discovered by `npx skills add`)
│   ├── SKILL.md                                # Core playbook (<150 lines) + YAML frontmatter
│   ├── references/                             # Deep guides (presets, physics, pacing, audio, 3D IBL, QA)
│   ├── scripts/                                # Zero-dependency Node.js DSP audio, QA & mastering CLI tools
│   ├── assets/sfx/                             # 14-slot studio foley manifest.json & DSP guide
│   ├── templates/                              # Shared motion.ts, StudioPrimitives.tsx, launch.config.json & scenes
│   └── examples/                               # 5 self-contained Remotion launch video examples
├── demo/                                       # Runnable Remotion 4 demo workspace & composable scenes
├── lab/ & patterns/                            # Zero-build offline 18-pattern Interactive Motion Lab
├── analysis/                                   # Empirical BPM & motion breakdowns (markdown + JSON manifests)
└── practice/drills.md                          # 5 progressive motion drills & critique rubric
```

---

## Security & License

- **Security:** See [SECURITY.md](./SECURITY.md) for the full script-by-script filesystem, subprocess, and opt-in network inventory.
- **License:** [MIT](./LICENSE).
