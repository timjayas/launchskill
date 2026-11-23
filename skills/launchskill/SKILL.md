---
name: launchskill
description: >-
  Generates studio-grade 15-60 second 16:9 product launch videos optimized for X (Twitter)
  using Remotion, multi-archetype motion grammar (Spatial Creative Tool, Editorial Brand Punch,
  Chat-to-Cinema Agentic, Creative Ad Canvas), deterministic 2D macro camera rigs, directional
  motion blur, offline procedural DSP studio foley & beat-synced audio mastering, and selective
  React Three Fiber (@remotion/three) with offline studio IBL lighting. Use when creating a
  product launch video, SaaS trailer, MCP/AI demo, creative ad canvas showcase, devtool drop,
  or 3D reveal.
license: MIT
---

# X Product Launch Video Generator (Multi-Archetype Studio System)

Generate agency-grade **15–60 second** `16:9` launch videos engineered for the X (Twitter) feed: brand-first art direction, frame-0 scroll-stopping hooks, FPS-agnostic beat-locked pacing, real UI/media micro-interactions, exact focal-lock 2D camera rigs, directional velocity blur, camera-coupled `<StudioCyclorama />` depth, Tier-1 license-free procedural DSP studio foley + beat-synced `-14 LUFS` audio mastering, race-free webfonts, selective offline-IBL 3D via `@remotion/three`, and live Zod config customization.

---

## 0. Mandatory Creative Director Protocol (Visual-First Motion Design — Zero Template or Text Slop)

**NEVER reskin an existing composition scene-for-scene**, and **NEVER make a launch video text-heavy like a manual**. Viewers must be amazed at first glance through **design, illustration, and transitions**—not by reading sentences. Follow the **Visual-First Laws** in [creative-direction-and-motion-psychology.md](./references/creative-direction-and-motion-psychology.md):
1. **Ban Chat Bubbles & Prompt Boxes**: Never show a chat bubble or prompt bar typing out a long sentence (the #1 tell of AI wrapper slop). Communicate voice/intent via sculptural sonic waveforms, glowing cores, and direct visual transformation.
2. **Ban Wireframe Skeleton Grids & Background Watermark Words**: Never put `1px` wireframe/skeleton grid lines or giant faint background title words (`"LIVE"`, `"VISION"`, `"ACTION"`) behind the subject—they create visual distraction. Keep backdrops clean and seamless.
3. **Show via Tactile Illustration & Visual Widgets (Max 1–3 Words per Beat)**: Never render explanatory side paragraphs, multi-line subtitles, or dense text tables. Communicate actions visually: e.g., an animated watch dial whose hands physically sweep `7:00 → 8:00`, a layered architectural camera viewfinder with optical laser scan + color-swatch extraction, or a topographic map drawing a glowing route curve to a bouncing pin.
4. **Through-Line Object Permanence & 2.5D Choreography**: Carry one persistent hero object across the entire edit via container morphs, 2.5D tilted perspective (`rotateX/Y/Z` + coupled glass sheen), `+88px` exploded Z-axis visual cards, and portal zoom-through match cuts.

## 1. Gather Minimal Inputs & Optional X Launch Benchmarking

Only **three inputs** are required: **Product Name**, **Short Description** (1 sentence), and **Key Feature(s)** (1–3 real capabilities, plus optional real screenshots/screen recordings). Lead hooks with a **concrete 4–7 word mechanism** (`<Product> — <concrete reality>`, e.g., *"a real Android phone in your Codespace"*), never vague slogans.
- *(Optional Pre-Production Research — opt-in network call)* Query 3,300+ curated X launch videos on What Ships (free public Remote MCP) for category hook & runtime benchmarks via [scripts/search-whatships.mjs](./scripts/search-whatships.mjs):
  ```bash
  node <skill-dir>/scripts/search-whatships.mjs --query "<category or keyword>" --limit 6
  ```

## 1.5 Mandatory Pre-Step: Brand Token & Motion Temperament Derivation

**NEVER copy-paste signature colors, cursors, or props from reference videos** (e.g., default pink `#EC4899` node borders or orange `#F97316` cursors) unless they genuinely match the target product's brand. Before choosing an archetype, derive these **5 bespoke brand tokens** (full guide: [art-direction-presets.md](./references/art-direction-presets.md)):

1. **Surface Polarity (Light-First Default + Dark macOS App Contrast)**: Default to **Pure Light Gallery White (`#FFFFFF` / `#F9F9F8` / `#F7F7F5`)** for `80–90%` of runtime (with one optional `1.8–2.5s` earned `#141413` dark climax beat); use dark surfaces as primary only when explicitly requested. **For code editors & devtools on a light canvas, always stage the desktop app inside sleek Dark-Mode macOS chrome (`#0D0D10`, real traffic lights, multi-token syntax highlighting, deep studio shadow)** for crisp figure-ground contrast — never a washed-out white code window on white. **Never use blurred circular/radial background glows or ambient orb washes.**
2. **Single Primary Accent**: Extract 1 brand hue (or monochrome ink); never stack 3+ competing accents.
3. **Corner-Radius Geometry**: Architectural (`0px` Swiss/viewfinder), Sharp (`8–12px` dev/infra), Studio (`18–24px` SaaS), or Soft (`26–34px` creative/consumer).
4. **Typography Pairing**: `Inter` + `JetBrains Mono` (+ `Instrument Serif` / `Playfair Display` only when editorial warmth fits).
5. **Motion Temperament**: Choose **`taut-mechanical`** (razor snaps, `6px` inner follow-through), **`editorial-fluid`** (calm glides, `1.1s` holds), or **`tactile-snappy`** (direct-manipulation pops, directional whip-pans).

---

## 2. Choose Launch Archetype (Map Your Brand Tokens Into Its Grammar)

| Archetype / Preset | Runtime / FPS / Tempo | Best For | Signature Motion Grammar |
| :--- | :--- | :--- | :--- |
| **1. Spatial Creative Tool** (`kinetic-studio`) | `24–60s` · `24p`/`30p` · `132 BPM` | Creative suites, node/canvas tools, tactile editors | Brand-framed nodes, radial orbital bursts, accelerating vertical slot drums, forward/back live slider scrubs, 1-to-1 wired dataflow, `<SpatialCameraRig>` hops + directional whip-pan blur |
| **2. Editorial Brand Punch** (`rebrand-editorial`) | `20–30s` · `30p` · `116 BPM` | AI search/RAG agents, MCP libraries, sub-30s drops | Display Serif hooks, `3.2×` hard-cut macro typing punch-ins, full-bleed retrieval strobes, card-to-prompt-chip docking, 3D Z-scatter + anchor Light→Dark inversion, inline logo-slot headlines |
| **3. Chat-to-Cinema Agentic** (`motionfly-agentic`) | `24–30s` · `30p` · `120 BPM` | Autonomous coding/video/workflow agents, MCP builders | Legacy-stack replacement dock, style-chip prompt → vertical connected MCP execution tree (all steps completing live), meta timeline assembly reveal, multiplayer cursor swarm convergence |
| **4. Creative Ad Canvas** (`hera-ad-canvas`) | `40–45s` · `60p`/`30p` · `128 BPM` | Creative/ad/brand generators, multi-format canvases | 4-cycle Dark↔Light dot-grid heartbeat, parallel agent cursors spawning mixed-aspect artboards (`16:9`/`1:1`/`4:5`/`9:16`, zero wires), URL→Brand Kit radial bloom, in-place reference transmutation, static→motion split → full-bleed ad zoom |
| **5. Editorial Gallery** (`editorial-gallery`) | `20–30s` · `30p` · `115–120 BPM` | Storytelling SaaS, AI apps | Studio paper `#F7F7F5` + obsidian `#09090B` dark chapter, two-tone ink contrast, inline mark reflow |
| **6. Precision DevTool** (`precision-devtool`) | `16–22s` · `30p`/`60p` · `125 BPM` | DevTools, APIs, CLI, infra | Obsidian `#09090B`, `1px` silver hairlines, `⌘K` command palettes, live diffs, `tabular-nums` impact metrics |
| **7. Hardware Studio** (`hardware-studio`) | `16–24s` · `30p` · `112–116 BPM` | Physical hardware, 3D marks | Single persistent `<ThreeCanvas>` + offline `RoomEnvironment` PMREM studio IBL + `1px` macro leader lines |
| **8. Architectural Archive** (`architectural-archive`) | `20–30s` · `30p` · `120 BPM` | Design systems, directories, Swiss-editorial launches | Sharp `0px` corners, `1px` hairline grids, `+` crosshairs, `<ViewfinderFrame>` L-brackets, `<RollingOdometer>` counters, stark kinetic type slates (zero chat bars needed) |

> **2D vs. 3D Rule:** Keep software UI orthogonal 2D + `<SpatialCameraRig>`; reserve `@remotion/three` strictly for physical hardware or sculptural 3D marks.

---

## 3. Pattern Decision Matrix & References

| Product Story | Recommended Pattern | Reference |
| :--- | :--- | :--- |
| "Stage a real screenshot or screen recording like cinema" | **`<SpatialCameraRig>` Zoom-Track + Speed-Ramped `<OffthreadVideo>` + Spotlight Callout** | [micro-interactions.md](./references/micro-interactions.md) |
| "Show a wide tool library fast" | **Radial Orbital Burst** or **Accelerating Vertical Slot Drum** (true vertical blur) | [micro-interactions.md](./references/micro-interactions.md) |
| "Show prompt typing clearly on 360px mobile X" | **Hard-Cut `3.2×` Macro Typing Punch-In** | [micro-interactions.md](./references/micro-interactions.md) |
| "Show AI search / MCP retrieval without spinners" | **Shimmer Status + 3-Beat Full-Bleed Retrieval Strobe + Tabular Counter HUD** | [micro-interactions.md](./references/micro-interactions.md) |
| "Show multi-turn visual context / before-after proof" | **Card-to-Prompt-Chip Docking** or **Forward-and-Back Live Slider Scrub** | [micro-interactions.md](./references/micro-interactions.md) |
| "Show autonomous multi-step build / meta output" | **Connected Vertical Agent Tree** (100% completed) + **Meta Timeline Assembly Reveal** | [micro-interactions.md](./references/micro-interactions.md) |
| "Show parallel multi-aspect ad generation / brand kit" | **Multi-Artboard Freeform Canvas** · **URL→Brand Kit Bloom** · **In-Place Reference Transmutation** | [micro-interactions.md](./references/micro-interactions.md) |
| "Bridge tool output cleanly into full-bleed commercial" | **Static→Motion Side-by-Side Split → Canvas-to-Full-Bleed Ad Zoom** + **Panorama Sweep** | [micro-interactions.md](./references/micro-interactions.md) |
| "Stage a code editor / devtool on a crisp light studio canvas" | **Dark-Mode macOS Window (`#0D0D10`) on `<StudioCyclorama />` + Multi-Token Syntax Diff (Zero Blank Gaps)** | [micro-interactions.md](./references/micro-interactions.md) |
| "Add subtle studio motion depth to clean light frames (zero blur orbs)" | **Camera-Coupled `<StudioCyclorama />` + 2-Plane Optical Z-Depth Parallax** | [micro-interactions.md](./references/micro-interactions.md) |
| "Hold attention without chat bars / stage tactile flat-lay or Swiss index" | **Kinetic Type Slate + `<ViewfinderFrame>` + `<RollingOdometer>`** or **Physical Desk Flat-Lay Zoom** | [micro-interactions.md](./references/micro-interactions.md) |
| "Pivot mood dramatically or land an iconic finale" | **Z-Scatter + Anchor Theme-Flip**, **Directional Whip-Pan**, or **Peak-Velocity Match-Cut** | [pacing-and-transitions.md](./references/pacing-and-transitions.md) |

**Detailed Reference Guides (Progressive Disclosure — Read Only What You Need):**
- Creative Direction, Motion Psychology & Anti-Template Choreography: [creative-direction-and-motion-psychology.md](./references/creative-direction-and-motion-psychology.md)
- Quantitative Motion Benchmarks & 10 Signature Patterns (Distilled from Curated Reference Reels): [benchmarks.md](./references/benchmarks.md)
- Objective Pass/Block Review Gates (10 Non-Negotiable Audit Standards): [review-gates.md](./references/review-gates.md)
- Tokens, Brand Derivation & All 9 Presets: [art-direction-presets.md](./references/art-direction-presets.md)
- Canonical Physics, Secondary Settle, Directional Blur, Fonts & Fast Grain: [motion-design-system.md](./references/motion-design-system.md)
- Beat-Grids, Blueprints A–H & FPS-Agnostic Transitions: [pacing-and-transitions.md](./references/pacing-and-transitions.md)
- Interactive UI, Real Media & Canvas Recipes: [micro-interactions.md](./references/micro-interactions.md)
- Offline Studio 3D IBL (`RoomEnvironment`): [r3f-remotion-guide.md](./references/r3f-remotion-guide.md)
- Tier-1 Procedural DSP Foley, Beat-Drop Analysis & `-14 LUFS` Mastering: [sound-design-and-audio.md](./references/sound-design-and-audio.md)
- X Export Specs & Cut-Boundary Contact-Sheet QA: [x-export-settings.md](./references/x-export-settings.md)

---

## 4. Non-Negotiable Studio Invariants & Anti-Patterns

1. **Frame-0 Alive & 100% FPS-Agnostic**: Canvas is already mid-arrival at `frame = 0` (`progress >= 0.35`). Derive every timing cue from `createBeatGrid(bpm, fps)` or `sec(s, fps)`—zero raw 30fps magic integers.
2. **Asymmetric Hold-Budget & Secondary Settle**: Snap transitions in `0.15–0.30s` (`EASE_OUT_EXPO` / `SPRING_EDITORIAL` `{ damping: 28, stiffness: 180, mass: 0.9 }`); hold readable UI rock-solid for `0.75–1.35s` (`2.5–3.2s` CTA hold). Inner content follows outer containers `+0.07–0.10s` later with `6–12px` travel.
3. **True Directional Blur, Camera-Coupled Cyclorama & Fast Tiled Grain**: Use `<DirectionalMotionBlur blurX={...} blurY={...}>` (dropping strictly to `0` at rest), `<StudioCyclorama />` for subtle curved tonal falloff + camera-coupled `30px` dot-grid depth, and the pre-encoded `128×128` tiled `<FilmGrainOverlay />` (never slow full-HD `<feTurbulence>`).
4. **Race-Free Fonts & Optical Typography**: Prefer `@remotion/google-fonts` or race-free `ensureStudioFonts()` (`link.onload` + `document.fonts.load`). Enforce `tabular-nums` on every counter/timer, scale tracking with size, and lock readable copy inside `120px × 90px` safe margins.
5. **Zero Nondeterminism, Blur Circles, Skeleton Slop, Text Walls, or Naive Synth Audio**: Zero `Math.random()`, `Date.now()`, `useFrame` deltas, CSS `@keyframes`, **blurred radial-gradient circle / ambient glow orb backgrounds**, washed-out white-on-white code windows, blank-gap diff fade-ins (`opacity: 0` holes), generic gray skeleton-loader bars, dense text-wall spec tables, parked idle seconds, dark-by-default templates when light fits, muddy crossfades, floating 3D toruses behind 2D UI, sparkle icons (`✨`), cloned reference pink/orange defaults, unreadable 12px chat bars, half-finished agent checklists, empty fade-to-black tails, **naive/chiptune JS music loops**, harsh/loud finale bell chimes, or raw sine-wave clicks in final exports.

---

## 5. Self-Contained Scaffolding, Studio Audio & Visual QA Workflow

All shared primitives, starter configs, audio pack specs, examples, and zero-dependency scripts live **inside this skill folder** (replace `<skill-dir>` below with your installed skill path, e.g. `skills/launchskill` or `.agents/skills/launchskill`):
- **Core Primitives, Widgets & Config**: [templates/motion.ts](./templates/motion.ts) · [templates/StudioPrimitives.tsx](./templates/StudioPrimitives.tsx) · [templates/widgets/VisualWidgets.tsx](./templates/widgets/VisualWidgets.tsx) · [templates/launch.config.json](./templates/launch.config.json) · [templates/scenes/](./templates/scenes/)
- **Motion DNA Extractor (Reverse-Engineer Reference MP4s)**: `node <skill-dir>/scripts/extract-motion-dna.mjs --in ref.mp4 --out analysis/motion-dna.json`
- **Curated Audio Kit Spec**: [assets/sfx/manifest.json](./assets/sfx/manifest.json) · [assets/sfx/README.md](./assets/sfx/README.md)
- **Self-Contained Examples**: [kinetic-studio-launch.tsx](./examples/kinetic-studio-launch.tsx) · [rebrand-editorial-launch.tsx](./examples/rebrand-editorial-launch.tsx) · [saas-launch.tsx](./examples/saas-launch.tsx) · [app-feature-highlight.tsx](./examples/app-feature-highlight.tsx) · [simple-product-reveal.tsx](./examples/simple-product-reveal.tsx)

1. **Prepare Studio Audio (100% Offline, License-Free Tier-1 Procedural DSP Foley & Music Bed)**:
   - **Foley (Tier 1 Default — Zero API Key)**: Generate all 14 stereo 48 kHz studio DSP WAVs via [scripts/generate-dsp-sfx.mjs](./scripts/generate-dsp-sfx.mjs) (swept pink-noise whooshes + reverb, multi-layer tactile clicks/keys, pitch-enveloped sub-bass drops, warm felt-marimba resolve) directly into `public/sfx/`:
     ```bash
     node <skill-dir>/scripts/generate-dsp-sfx.mjs --out public/sfx
     ```
   - **Procedural DSP Music Bed (Tier 1 Default — Zero API Key)**: Generate a beat-locked stereo electronic/tech groove via [scripts/generate-dsp-music.mjs](./scripts/generate-dsp-music.mjs) (sidechained analog sub-bass, studio kick, brushed hats, filtered FM plucks + ping-pong delay, dark-climax drop-out, `Dmaj9` resolve) matched to your exact BPM & beat count:
     ```bash
     node <skill-dir>/scripts/generate-dsp-music.mjs --bpm 142 --beats 40 --out public/audio/bed-142bpm.wav
     ```
   - *(Optional Tier 2 AI Foley — opt-in via `ELEVENLABS_API_KEY`)* Generate custom physical-object foley via [scripts/generate-ai-sfx.mjs](./scripts/generate-ai-sfx.mjs):
     ```bash
     node <skill-dir>/scripts/generate-ai-sfx.mjs --pack studio --out public/sfx
     ```
   - *(Optional Tier 2 Real Music Beat-Sync — offline)* When a licensed instrumental track is provided, extract exact BPM, first beat, and primary drop via [scripts/analyze-music.mjs](./scripts/analyze-music.mjs):
     ```bash
     node <skill-dir>/scripts/analyze-music.mjs --in public/audio/bed.mp3 --out src/audio-beats.json --fps 30
     ```
2. **Typecheck & Verify Composition Registration**:
   ```bash
   npx tsc --noEmit && npx remotion compositions
   ```
3. **Run Motion-Boundary + Contact-Sheet Visual QA** via [scripts/qa-frames.mjs](./scripts/qa-frames.mjs) (renders 5 hero stills + `cut - 1`, `cut`, `cut + 2` boundary triplets + `out/qa/contact-sheet.html`):
   ```bash
   node <skill-dir>/scripts/qa-frames.mjs --comp <Id> --fps 30 --duration <frames> --cuts <c1,c2,...>
   ```
   Visually inspect every PNG against the 8-point rubric in [x-export-settings.md](./references/x-export-settings.md) and fix defects before export.
4. **Export X-Optimized 1080p MP4 & Master Audio (`-14 LUFS`, Zero Video Re-Encode)** via [scripts/master-audio.mjs](./scripts/master-audio.mjs):
   ```bash
   npx remotion render <CompositionId> out/launch-video.mp4 \
     --codec=h264 --pixel-format=yuv420p --crf=18 --audio-codec=aac --audio-bitrate=192k --gl=angle
   node <skill-dir>/scripts/master-audio.mjs --in out/launch-video.mp4 --out out/launch-video-mastered.mp4
   ```
