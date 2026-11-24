---
name: launchskill
description: >-
  Brand-agnostic, creative-coding motion engine for 15-60 second 16:9 product launch films
  optimized for X (Twitter) in Remotion. Starts by discovering the product's real brand
  identity from the workspace/prompt (or inventing a bespoke domain-native world from scratch),
  then applies pure motion Technique Playbooks (continuous SVG morphing, camera-tracked vector
  drawing, decoupled 12fps/30fps tactile cutouts, or concrete software/hardware Product Cinema).
  Enforces deterministic frame-clock physics, verified @remotion/google-fonts loading, offline
  procedural DSP studio SFX (or optional BYO .mp3 mastered to -14 LUFS), and blind adversarial QA.
license: MIT
---

# LaunchSkill — Brand-Agnostic Creative-Coding Launch Film Engine

Build original, agency-grade **15–60 second** `16:9` product launch films written **100% in code** with Remotion. Every film is designed **from scratch around the user's real product and brand**—never pasted into a recycled color costume or rigid story template—powered by deterministic `useCurrentFrame()` physics, verified `@remotion/google-fonts` typography, offline procedural DSP SFX (with optional BYO `.mp3` sync & `-14 LUFS` mastering), and blind adversarial visual QA.

> **THE ANTI-TEMPLATE RULE (NON-NEGOTIABLE):**
> **Never default to Anthropic parchment/terracotta (`#F4F1EA` + `#D97757`), generic Swiss monochrome, or purple-blue SaaS gradients unless the user's actual brand or request calls for them.** Every film must derive its palette, typography, surface polarity, and visual metaphor from the target product's own identity and domain.

---

## 0. Mandatory Stage 0 — Brand Discovery & `DIRECTION.md` Gate

**STOP before writing any `.tsx` file.** Every film MUST begin by discovering the product's real identity, locking **ONE** primary Technique Playbook below, and writing a concise **`DIRECTION.md`** in the project root (or composition folder).

### Step 0A — Discover the Real Brand First (Before Inventing Anything)
1. **Inspect the workspace and user prompt first:** Check `README.md`, `package.json`, CSS/Tailwind theme tokens (`tailwind.config.*`, `globals.css`, design tokens), `public/logos/`, screenshots/recordings, or the user's description to extract their **real brand colors, fonts, surface polarity, logo geometry, audience, and core value proposition**.
2. **If no repo or brand system exists yet:** Invent a **bespoke** palette (`CANVAS`, `PRIMARY_INK`, `ACCENT`, `MUTED`), a domain-authentic `@remotion/google-fonts` pairing, and **one original visual metaphor** tailored specifically to that product's category and emotional register.

### Step 0B — Choose ONE Primary Technique Playbook (Pure Craft, Zero Prescribed Aesthetics)

Each file in `./styles/` is a **pure motion Technique Playbook**—it teaches *how to engineer elite motion in code*, NOT what colors, fonts, or stories to use:

| Technique Playbook | Load File | Core Motion Craft | Best For | Primary Primitives |
| :--- | :--- | :--- | :--- | :--- |
| **1. Continuous SVG Morph** | [editorial-morph.md](./styles/editorial-morph.md) | Zero-hard-cut `interpolatePaths` silhouette morphing, smooth-min `LiquidMetaballStage` merges/polarity floods, `12fps` `OrganicBoilFilter` tactile life, baseline clip-mask type | Conceptual launches, AI models, brand manifestos, skills/agents, or any story where fluid physical transformation beats literal UI boxes | `MorphingShape`, `LiquidMetaballStage`, `OrganicBoilFilter`, `motion.ts` |
| **2. Camera-Tracked Single Line** | [single-line-kinetic.md](./styles/single-line-kinetic.md) | One unbroken `CameraTrackedStroke` across a `2×–3×` world canvas with damped tip tracking, dynamic zoom contrast, trajectory-anchored copy, and one climax colour-flood downbeat | Workflows, creative tools, architecture/lineage stories, reasoning chains, or narratives built around continuous connection | `CameraTrackedStroke`, `OrganicBoilFilter`, `MorphingShape`, `motion.ts` |
| **3. Decoupled Tactile Cutouts** | [paper-cutout.md](./styles/paper-cutout.md) | Stepped `12fps` object physics (`PaperCutoutLayer`) riding on a smooth `30fps` multi-plane parallax camera, hard directional elevation shadows, and physical sheet/aperture wipes | Craft-forward consumer drops, storytelling platforms, playful or physical-feeling brands that stand out against flat glass feeds | `PaperCutoutLayer`, `OrganicBoilFilter`, `MorphingShape`, `motion.ts` |
| **4. Product Cinema (UI & Hardware)** | [product-cinema.md](./styles/product-cinema.md) | `<SpatialCameraRig>` macro UI zooms, 2.5D perspective device staging, real screen recordings/diffs, interactive micro-proof widgets, optional `@remotion/three` studio hardware | Concrete software demos, SaaS/devtools, mobile apps, agentic UIs, and physical hardware where real product interaction is the hero | `StudioPrimitives`, `VisualWidgets`, `templates/scenes/`, `benchmarks.md`, `motion.ts` |

> **Technique Isolation Rule:** Load **ONLY** the Technique Playbook and primitives your `DIRECTION.md` commits to. When using an abstract technique playbook (`editorial-morph`, `single-line-kinetic`, or `paper-cutout`), **never** leak software UI chrome (`VisualWidgets.tsx`, terminals, NLE timelines, waveforms, rounded SaaS cards) into the film unless the product literally requires it and `DIRECTION.md` justifies it.

### Step 0C — Required Commitments in `DIRECTION.md`
1. **Brand Discovery Summary:** Exact source of the brand identity (workspace files inspected or bespoke domain derivation), audience, and core value prop.
2. **The 15-Second Stranger Test:** Write the entire film in **3 plain sentences (`Hook → Proof → CTA`)**. If a muted stranger on X cannot explain what the product does after one watch, rewrite before coding.
3. **Locked Technique Playbook:** Name the single playbook from `./styles/` and confirm clean primitive isolation.
4. **Core Emotion & Frame-0 Hook (`0–2s`):** State what the viewer feels on Frame 0 (mid-action, never fade-from-black or a feature checklist).
5. **Original Hero Motif & Visual Thread:** Invent **one bespoke physical object, silhouette, stroke, or UI artifact** native to *this* product that carries continuity from Frame 0 to the finale.
6. **Derived Brand System & Copy Budget:** Exact hex tokens (`CANVAS`, `PRIMARY_INK`, `ACCENT`, `MUTED`), exact `@remotion/google-fonts` families (zero system fallbacks), and strict copy discipline (`<= 4 words/beat`).
7. **Explicit Exclusion List:** Name the clichés and off-brand tropes forbidden in this film (including any unmotivated template costumes).

---

## 1. Minimal Inputs & Optional Pre-Production Research

Only **three inputs** are required: **Product Name**, **Short Description** (1 sentence), and **Key Proof Point(s)** (1–3 concrete capabilities, plus optional real screenshots/recordings or repo path). Lead hooks with a concrete reality—never vague slogans.

- *(Optional — opt-in network call)* Benchmark hooks & pacing against 3,300+ curated X launch films on What Ships via [scripts/search-whatships.mjs](./scripts/search-whatships.mjs):
  ```bash
  node <skill-dir>/scripts/search-whatships.mjs --query "<category or keyword>" --limit 6
  ```
- *(Optional — local reference study)* Reverse-engineer pacing, cut cadence, and velocity curves from a local reference `.mp4` via [scripts/extract-motion-dna.mjs](./scripts/extract-motion-dna.mjs):
  ```bash
  node <skill-dir>/scripts/extract-motion-dna.mjs --in ref.mp4 --out analysis/motion-dna.json
  ```

---

## 2. Creative-Coding Primitives & Required Packages

### Required Remotion Packages
Install exact version-matched packages alongside `remotion` in your Remotion project:
- **`@remotion/paths`** — Deterministic SVG path morphing (`interpolatePaths`), live stroke evolution (`evolvePath`), and camera nib tracking (`getPointAtLength`, `getLength`).
- **`@remotion/google-fonts`** — Race-free, build-verified webfont loading so headless renders never silently fall back to Times New Roman, Georgia, or Arial.

### Built-In Creative-Coding Primitives ([templates/primitives/index.ts](./templates/primitives/index.ts))
All five primitives are 100% `useCurrentFrame()`-driven, strict TypeScript, and free of `Math.random()`, `Date.now()`, or CSS animations:

| Primitive | File | Creative-Coding Mechanism | Primary Playbook |
| :--- | :--- | :--- | :--- |
| **`MorphingShape`** | [MorphingShape.tsx](./templates/primitives/MorphingShape.tsx) | Continuous SVG silhouette morphing across keyframes via `interpolatePaths` | `editorial-morph`, `single-line-kinetic`, `paper-cutout` |
| **`CameraTrackedStroke`** | [CameraTrackedStroke.tsx](./templates/primitives/CameraTrackedStroke.tsx) | Unbroken live vector drawing via `evolvePath` + `getPointAtLength` with smooth viewport camera tracking | `single-line-kinetic` |
| **`OrganicBoilFilter`** | [OrganicBoilFilter.tsx](./templates/primitives/OrganicBoilFilter.tsx) | Seeded `12fps` on-twos `<feTurbulence>` + `<feDisplacementMap>` tactile edge boil + optional surface grain | `editorial-morph`, `single-line-kinetic`, `paper-cutout` |
| **`LiquidMetaballStage`** | [LiquidMetaballStage.tsx](./templates/primitives/LiquidMetaballStage.tsx) | SVG `<feGaussianBlur>` + `<feColorMatrix>` smooth-min threshold matrix for organic shape merging & polarity floods | `editorial-morph` |
| **`PaperCutoutLayer`** | [PaperCutoutLayer.tsx](./templates/primitives/PaperCutoutLayer.tsx) | Decoupled `12fps` stepped object physics inside a smooth `30fps`/`60fps` parallax camera plane with rim & hard drop shadow | `paper-cutout` |

**Shared Engineering Foundation (All Playbooks):**
- FPS-agnostic timing, beat grids (`createBeatGrid`, `sec`, `durSec`), canonical easing & springs, and round-robin SFX helpers: [templates/motion.ts](./templates/motion.ts)
- Starter configuration schema: [templates/launch.config.json](./templates/launch.config.json)
- Audio mixing: use Remotion `<Audio>` + `<Sequence>` directly (or `<SoundTrackLayer />` from [templates/StudioPrimitives.tsx](./templates/StudioPrimitives.tsx)).

---

## 3. Progressive Reference Map (Load Only What Applies)

### Universal Engineering Guides (All Playbooks)
- **Creative Direction & Motion Psychology**: [creative-direction-and-motion-psychology.md](./references/creative-direction-and-motion-psychology.md)
- **5 Universal Laws & Blind Adversarial Critic Checklist**: [review-gates.md](./references/review-gates.md)
- **Empirical Timing & Pacing Physics (10-Film Benchmarks)**: [benchmarks.md](./references/benchmarks.md)
- **Canonical Physics, Easing & FPS-Agnostic Timing**: [motion-design-system.md](./references/motion-design-system.md)
- **Procedural DSP SFX, Optional BYO `.mp3` Sync & `-14 LUFS` Mastering**: [sound-design-and-audio.md](./references/sound-design-and-audio.md)
- **X 1080p Export Specs & Cut-Boundary Visual QA**: [x-export-settings.md](./references/x-export-settings.md)

### Technique Playbooks (Load ONLY Your Locked Playbook)
- **Continuous SVG Morph**: [styles/editorial-morph.md](./styles/editorial-morph.md)
- **Camera-Tracked Single Line**: [styles/single-line-kinetic.md](./styles/single-line-kinetic.md)
- **Decoupled Tactile Cutouts**: [styles/paper-cutout.md](./styles/paper-cutout.md)
- **Product Cinema (Software/Hardware UI)**: [styles/product-cinema.md](./styles/product-cinema.md) — owns [VisualWidgets.tsx](./templates/widgets/VisualWidgets.tsx), [templates/scenes/](./templates/scenes/), [micro-interactions.md](./references/micro-interactions.md), [art-direction-presets.md](./references/art-direction-presets.md), [pacing-and-transitions.md](./references/pacing-and-transitions.md), [r3f-remotion-guide.md](./references/r3f-remotion-guide.md), and the Product Cinema reference examples ([kinetic-studio-launch.tsx](./examples/kinetic-studio-launch.tsx), [rebrand-editorial-launch.tsx](./examples/rebrand-editorial-launch.tsx), [saas-launch.tsx](./examples/saas-launch.tsx), [app-feature-highlight.tsx](./examples/app-feature-highlight.tsx), [simple-product-reveal.tsx](./examples/simple-product-reveal.tsx)).

---

## 4. The 5 Universal Laws (Summary)

Every film—regardless of brand, aesthetic, or technique playbook—must pass all 5 laws and the **Blind Adversarial Critic Checklist** in [references/review-gates.md](./references/review-gates.md):
1. **The 15-Second Stranger Test**: Clear 3-sentence story (`Hook → Proof → CTA`) readable muted in one watch; Frame 0 is alive; zero unrelated filler visuals.
2. **Zero Internal Dev/QA Jargon On Screen**: Zero debug labels, frame counters, fake `97 SCORE` rings, `const res = await` filler, or placeholder text in any frame.
3. **Anti-Template Originality & Kinetic Craft**: Derived from the target product's real brand (never recycled parchment/terracotta, Swiss monochrome, or purple-blue SaaS costumes), with genuine spatial choreography, scale/rhythm contrast, and generous negative space.
4. **Frame-Clock Determinism + Verified Font Loading**: 100% `useCurrentFrame()` / `interpolate()` / `spring()`, zero `Math.random()` / `Date.now()` / CSS `@keyframes` / CSS `transition`, clean `tsc --noEmit`, and verified `@remotion/google-fonts` (zero system font fallback).
5. **SFX-Only / BYO Audio Discipline**: Crisp procedural DSP SFX default or user-supplied `.mp3` mastered to `-14 LUFS` (`truePeak <= -1.0 dBTP`); zero code-generated synth/chiptune music beds or harsh raw sine beeps.

---

## 5. Self-Contained Audio, Visual QA & X Export Pipeline

Replace `<skill-dir>` with your installed skill path (e.g. `skills/launchskill` or `.agents/skills/launchskill`).

1. **Prepare Studio Audio (SFX-Only Default + Optional BYO `.mp3` — Zero Code-Generated Music)**
   - **Tier 1 Default (Offline, Zero API Key, License-Free DSP SFX)**: Synthesize all 14 stereo 48 kHz studio SFX WAVs ([assets/sfx/manifest.json](./assets/sfx/manifest.json) · [assets/sfx/README.md](./assets/sfx/README.md)) via [scripts/generate-dsp-sfx.mjs](./scripts/generate-dsp-sfx.mjs):
     ```bash
     node <skill-dir>/scripts/generate-dsp-sfx.mjs --out public/sfx
     ```
   - *(Optional Tier 2 AI Foley — opt-in via `ELEVENLABS_API_KEY`)* Generate bespoke physical foley via [scripts/generate-ai-sfx.mjs](./scripts/generate-ai-sfx.mjs):
     ```bash
     node <skill-dir>/scripts/generate-ai-sfx.mjs --pack studio --out public/sfx
     ```
   - *(Optional BYO Music — ONLY when the user supplies their own `.mp3` in `public/audio/`)* Extract BPM, first beat, and primary drop via [scripts/analyze-music.mjs](./scripts/analyze-music.mjs); otherwise render **crisp SFX only**:
     ```bash
     node <skill-dir>/scripts/analyze-music.mjs --in public/audio/track.mp3 --out src/audio-beats.json --fps 30
     ```

2. **Typecheck & Verify Composition Registration**
   ```bash
   npx tsc --noEmit && npx remotion compositions
   ```

3. **Run Motion-Boundary Contact-Sheet QA & Blind Adversarial Audit**
   Render hero stills + `cut - 1`, `cut`, `cut + 2` boundary triplets + `out/qa/contact-sheet.html` via [scripts/qa-frames.mjs](./scripts/qa-frames.mjs):
   ```bash
   node <skill-dir>/scripts/qa-frames.mjs --comp <Id> --fps 30 --duration <frames> --cuts <c1,c2,...>
   ```
   Inspect every PNG blindly against the **5 Universal Laws + Blind Adversarial Critic Checklist** in [references/review-gates.md](./references/review-gates.md), your locked Technique Playbook's gates, and [references/x-export-settings.md](./references/x-export-settings.md). Fix every `BLOCK` finding before export.

4. **Export X-Optimized 1080p MP4 & Master Audio (`-14 LUFS`, Zero Video Re-Encode)**
   ```bash
   npx remotion render <CompositionId> out/launch-video.mp4 \
     --codec=h264 --pixel-format=yuv420p --crf=18 --audio-codec=aac --audio-bitrate=192k --gl=angle
   node <skill-dir>/scripts/master-audio.mjs --in out/launch-video.mp4 --out out/launch-video-mastered.mp4
   ```
