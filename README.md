# LaunchSkill

Brand-agnostic, creative-coding **Agent Skill** for building studio-grade **15–60 second 16:9 product launch films** in Remotion—100% in code, optimized for X (Twitter).

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

## v1.0 Architecture

### 1. Brand-First Discovery (No Fixed Templates)
Every film starts with a mandatory **Stage 0 (`DIRECTION.md`) gate** before a single line of `.tsx` is written:
- **Discover the real brand first:** Inspects the workspace (`README.md`, `package.json`, Tailwind/CSS tokens, logos, screenshots) or derives a bespoke palette, verified `@remotion/google-fonts` pairing, and original visual metaphor from scratch.
- **Anti-template discipline:** Never pastes your product into recycled color costumes, chat-bubble tropes, or rigid slide decks.
- **Pure Motion Technique Playbooks (`skills/launchskill/styles/`):** Lock **one** craft playbook per film—isolated cleanly so abstract films never leak UI chrome:
  - **Continuous SVG Morph** (`editorial-morph.md`) — Zero-hard-cut `interpolatePaths` silhouette morphs, smooth-min metaball merges, `12fps` tactile boil.
  - **Camera-Tracked Single Line** (`single-line-kinetic.md`) — One unbroken `CameraTrackedStroke` across a `2×–3×` world canvas with damped nib tracking.
  - **Decoupled Tactile Cutouts** (`paper-cutout.md`) — Stepped `12fps` physical cutouts riding on a smooth `30fps` multi-plane parallax camera.
  - **Product Cinema** (`product-cinema.md`) — `<SpatialCameraRig>` macro UI zooms, 2.5D perspective device stages, real code/product proof widgets, optional `@remotion/three` studio hardware.

### 2. Code-Driven Remotion Primitives
All motion is 100% deterministic (`useCurrentFrame()`, `interpolate()`, `spring()`)—zero `Math.random()`, `Date.now()`, or CSS animations—built on `@remotion/paths` and `@remotion/google-fonts`:

| Primitive | Mechanism |
| :--- | :--- |
| `MorphingShape` | Continuous SVG silhouette morphing across keyframes via `interpolatePaths` |
| `CameraTrackedStroke` | Unbroken vector drawing via `evolvePath` + `getPointAtLength` with viewport tracking |
| `OrganicBoilFilter` | Seeded `12fps` `<feTurbulence>` + `<feDisplacementMap>` tactile edge life |
| `LiquidMetaballStage` | SVG `<feGaussianBlur>` + `<feColorMatrix>` smooth-min shape merges & polarity floods |
| `PaperCutoutLayer` | Decoupled `12fps` stepped cutout physics inside a smooth `30fps`/`60fps` parallax plane |
| `motion.ts` & `StudioPrimitives` | FPS-agnostic timing (`sec`, `createBeatGrid`), canonical springs, `<SpatialCameraRig>`, and Product Cinema widgets |

### 3. Procedural DSP SFX + Optional BYO `.mp3` Mastering (`-14 LUFS`)
Ships **100% offline and license-free by default**—zero bundled copyright audio, zero API keys required, and zero code-generated synth music beds:

| Mode | Command | Network / API Key |
| :--- | :--- | :---: |
| **Procedural DSP SFX** *(default)* | `node skills/launchskill/scripts/generate-dsp-sfx.mjs --out public/sfx` | **Offline (none)** |
| **BYO Licensed `.mp3` Beat Sync** *(optional)* | `node skills/launchskill/scripts/analyze-music.mjs --in public/audio/track.mp3 --out src/audio-beats.json --fps 30` | **Offline (none)** |
| **ElevenLabs AI Foley** *(optional)* | `ELEVENLABS_API_KEY=... node skills/launchskill/scripts/generate-ai-sfx.mjs --pack studio --out public/sfx` | **Opt-in env var** |
| **Broadcast Mastering (`-14 LUFS`)** | `node skills/launchskill/scripts/master-audio.mjs --in out/launch.mp4 --out out/launch-mastered.mp4` | **Offline (FFmpeg)** |

Two-pass linear EBU R128 mastering (`-14 LUFS`, `-1.5 dBTP`) copies the video stream directly (`-c:v copy`) with zero re-encoding.

### 4. Built-In Visual QA Critic
Before final export, `qa-frames.mjs` renders hero stills plus `cut - 1`, `cut`, and `cut + 2` boundary triplets into an inspectable `contact-sheet.html`:

```bash
node skills/launchskill/scripts/qa-frames.mjs --comp <CompositionId> --fps 30 --duration <frames> --cuts <c1,c2,...>
```

Every frame is audited blindly against the **5 Universal Laws & Blind Adversarial Critic Checklist** (`references/review-gates.md`):
1. **15-Second Stranger Test** — Readable muted in one watch (`Hook → Proof → CTA`), alive on Frame 0.
2. **Zero Dev/QA Jargon** — No debug HUDs, fake score rings, or placeholder copy on screen.
3. **Anti-Template Originality** — True to the target product's brand with genuine spatial choreography.
4. **Frame-Clock Determinism & Verified Fonts** — Clean `tsc --noEmit`, `@remotion/google-fonts` loaded, zero system fallbacks.
5. **SFX-Only / BYO Audio Discipline** — Crisp procedural SFX or mastered BYO `.mp3` (`-14 LUFS`).

---

## Quickstart

### Prompt Your Coding Agent
After `npx skills add timjayas/launchskill`, give your agent **Product Name**, **1-sentence description**, and **1–3 concrete proof points** (plus optional screenshots or repo context):

> *"Use `launchskill` to build a 20-second 16:9 launch film in Remotion for **PulseDB** — instant Postgres branching for every pull request. Prove 3 things: (1) 400ms PR branch spin-up, (2) live schema diff, and (3) automatic teardown on merge. Discover the brand from this repo, lock the best technique playbook in `DIRECTION.md`, synthesize procedural DSP SFX, and run the visual QA contact sheet before final export."*

### Prerequisites
- **Node.js 18+** (all skill scripts use only Node.js built-ins)
- **Remotion 4** + `@remotion/paths` + `@remotion/google-fonts`
- **FFmpeg** *(optional)* — auto-discovered from `PATH` or Remotion's bundled `@remotion/compositor-*` binary for `-14 LUFS` mastering and MP3 decoding

### Explore Locally (Demo Kit & Interactive Motion Lab)
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
│   ├── SKILL.md                                # Brand-first v1.0 playbook & Stage 0 gate
│   ├── styles/                                 # 4 isolated Technique Playbooks (morph, single-line, cutout, cinema)
│   ├── references/                             # Universal laws, blind QA critic, benchmarks, physics, audio & X export
│   ├── templates/                              # Creative-coding primitives, motion.ts, StudioPrimitives, widgets & scenes
│   ├── scripts/                                # Offline DSP SFX, beat sync, Motion DNA, QA contact sheet & -14 LUFS mastering
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
