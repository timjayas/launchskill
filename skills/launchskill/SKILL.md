---
name: launchskill
description: >-
  Opinionated, brand-adaptive Remotion skill for building 15-45 second 16:9
  premium product showcase and clean UI motion launch films optimized for X (Twitter).
  Derives exact brand palette, typography (@remotion/google-fonts), and surface polarity
  from the target product in Stage 0 (DIRECTION.md), then applies varied spatial camera
  choreography (<SpatialCameraRig>), pixel-locked portal match cuts, direct overlapping
  SVG clip-path peels, real UI/code micro-proof, physically driven finale lockups,
  seamless infinite loops back into Frame 0, real beat-synced music mastered with offline
  48 kHz procedural DSP SFX (-14 LUFS), and end-to-end rendered MP4 review.
license: MIT
---

# LaunchSkill — Opinionated Premium Product Showcase & Clean UI Motion Engine

Build studio-grade **15–45 second** `16:9` product launch films written **100% in code** with Remotion, tuned specifically for **Premium Product Showcase & Clean UI Motion** on X (Twitter).

LaunchSkill is **unapologetically opinionated about craft**—clean UI choreography, real software/hardware proof, focal-locked camera dives, pixel-locked portal match cuts, direct overlapping peels, and zero-seam loops—while remaining **100% brand-adaptive** in colors, typography, and surface polarity.

> **THE ANTI-TEMPLATE RULE (NON-NEGOTIABLE):**
> **Never default to Anthropic parchment/terracotta (`#F4F1EA` + `#D97757`), generic Swiss monochrome, or purple-blue SaaS gradients unless the user's actual brand calls for them.** Derive every surface, accent, corner radius, and font pairing from the target product's own identity.
>
> **EXPLICITLY OUT OF SCOPE:** Abstract ink-blob morphs, hand-drawn boil filters, 12fps stop-motion paper cutouts, calligraphic line-art manifestos, and generic chat-bubble/dashboard slop.

---

## 0. Mandatory Stage 0 — Brand Discovery & `DIRECTION.md` Gate

**STOP before writing any `.tsx` file.** Every film MUST begin by discovering the target product's real identity and writing a concise **`DIRECTION.md`** in the composition folder:

1. **Brand Discovery Summary:** Inspect the user's workspace (`README.md`, `package.json`, CSS/Tailwind theme tokens, `public/logos/`, screenshots/recordings) or prompt to extract **real brand colors, fonts, surface polarity, logo geometry, audience, and core value proposition**. If no repo exists yet, derive a bespoke domain-native palette (`CANVAS`, `PRIMARY_INK`, `ACCENT`, `MUTED`) and `@remotion/google-fonts` pairing.
2. **The 15-Second Stranger Test:** Write the entire film in **3 plain sentences (`Hook → Product Proof → CTA`)**. If a muted stranger scrolling X cannot explain what the product does after one watch, rewrite before coding.
3. **Structural Archetype Selection:** Lock **ONE** structural rhythm from [styles/product-cinema.md](./styles/product-cinema.md) (`precision-devtool`, `kinetic-studio`, `rebrand-editorial`, `motionfly-agentic`, `hera-ad-canvas`, `editorial-gallery`, `hardware-studio`, or `architectural-archive`) and **ONE** motion temperament (`taut-mechanical`, `editorial-fluid`, or `tactile-snappy`).
4. **Core Emotion & Alive Frame-0 Hook (`0–2s`):** State what the viewer feels on Frame 0 (mid-action, high figure-ground contrast—never fade-from-black or a feature checklist).
5. **Original Hero Motif, Varied Transition Map & Seamless Loop Bridge:** Define **one persistent UI object, rail, card, or device** that physically transforms across cuts, map **3–4 distinct spatial transitions** (never repeat the same transition consecutively), specify how the finale **physically drives** the brand lockup (never cut to a static centered flexbox stack), and design the **mandatory seamless infinite loop bridge** back into Frame 0's exact geometry and camera state.
6. **Derived Brand System & Copy Budget:** Exact hex tokens, exact `@remotion/google-fonts` families (zero system fallbacks), and strict copy discipline (`2–5` words/beat, `>= 32px` for mobile X legibility inside `120px × 90px` safe margins).
7. **Explicit Exclusion List:** Name the clichés and off-brand tropes forbidden in this film—always excluding **AI-slop HUD/telemetry chrome** (uppercase monospace kickers like `— NE · 10 RELEASE`, dot-separated metadata captions like `NE · 10 · 7 / 7 RECEIPTS VERIFIED`, rounded glowing-dot pills like `• RECEIPT 03 / 07`, labeled percentage/voltage bars) and **all corner counters (`01 / 07`)**.

---

## 1. Minimal Inputs & Optional Pre-Production Research

Only **three inputs** are required: **Product Name**, **1-sentence mechanism**, and **1–3 concrete proof points** (plus optional real screenshots/recordings or repo path). Lead hooks with concrete product reality—never vague slogans.

- *(Optional — opt-in network)* Benchmark hooks & pacing on What Ships via [scripts/search-whatships.mjs](./scripts/search-whatships.mjs):
  ```bash
  node <skill-dir>/scripts/search-whatships.mjs --query "<category>" --limit 6
  ```
- *(Optional — local reference study)* Reverse-engineer pacing and cut cadence from a local `.mp4` via [scripts/extract-motion-dna.mjs](./scripts/extract-motion-dna.mjs):
  ```bash
  node <skill-dir>/scripts/extract-motion-dna.mjs --in ref.mp4 --out analysis/motion-dna.json
  ```

---

## 2. Core Craft Stack & Required Packages

Install version-matched packages alongside `remotion`:
- **`@remotion/google-fonts`** — Race-free, build-verified webfont loading so headless Chromium never silently falls back to Arial or Times New Roman.
- **`@remotion/three`** *(hardware/3D marks only)* — Persistent `<ThreeCanvas>` + offline `RoomEnvironment` IBL when showcasing physical hardware or sculptural 3D marks.

### Signature Product-Showcase Mechanics
- **FPS-Agnostic Timing & Portal Math** ([templates/motion.ts](./templates/motion.ts)): `createBeatGrid(bpm, fps)`, `sec(s, fps)`, `SPRING_EDITORIAL`, `SPRING_SNAPPY`, `EASE_OUT_EXPO`, `EASE_IN_EXPO`, `EASE_IN_OUT_QUINT`, `computePortalCatchZoom(sourceW, sourceZoom, targetW)`, and `interpolateBoxGeometry`.
- **Focal-Locked Camera & Cyclorama** ([templates/StudioPrimitives.tsx](./templates/StudioPrimitives.tsx)): `<SpatialCameraRig>` (`transformOrigin: "0 0"`, `x = W/2 - wx * zoom`, `y = H/2 - wy * zoom`), `<StudioCyclorama />` (clean linear tonal falloff + subtle dot-grid, zero blurred radial glow orbs), `<DirectionalMotionBlur>` (`3–4f` peak-velocity confinement, `0` at rest), and `<FilmGrainOverlay />` (`128×128` tiled H.264 anti-banding grain).
- **Real Product Proof** ([styles/product-cinema.md](./styles/product-cinema.md)): High-contrast app window chrome, real multi-token syntax diffs (zero `opacity: 0` vertical blank-gap holes), direct overlapping SVG `<clipPath>` peels (zero fade-to-blank seams), and zero-seam Finale → Frame 0 X auto-loops.

---

## 3. Reference Map

- **Primary Craft Playbook & UI Gates**: [styles/product-cinema.md](./styles/product-cinema.md)
- **Creative Direction & Motion Psychology**: [references/creative-direction-and-motion-psychology.md](./references/creative-direction-and-motion-psychology.md)
- **Pacing, Beat Grids & Pro Transitions (Recipes A–J)**: [references/pacing-and-transitions.md](./references/pacing-and-transitions.md)
- **5 Universal Laws & Blind Adversarial Critic**: [references/review-gates.md](./references/review-gates.md)
- **Interactive UI & Real Media Recipes**: [references/micro-interactions.md](./references/micro-interactions.md)
- **Motion Design System & Empirical Benchmarks**: [references/motion-design-system.md](./references/motion-design-system.md) · [references/benchmarks.md](./references/benchmarks.md)
- **Procedural DSP SFX, BYO `.mp3` Sync & `-14 LUFS` Mastering**: [references/sound-design-and-audio.md](./references/sound-design-and-audio.md)
- **X 1080p Export Specs & Cut-Boundary Visual QA**: [references/x-export-settings.md](./references/x-export-settings.md)
- **Optional 3D Studio IBL (Hardware Only)**: [references/r3f-remotion-guide.md](./references/r3f-remotion-guide.md)

---

## 4. The 5 Universal Laws (Summary)

Every film must pass all 5 laws, the **Blind Adversarial Critic Checklist** ([references/review-gates.md](./references/review-gates.md)), and the **UI Craft Gates** ([styles/product-cinema.md](./styles/product-cinema.md)):
1. **The 15-Second Stranger Test**: Clear `Hook → Proof → CTA` readable muted in one watch; Frame 0 is alive; zero unrelated filler visuals.
2. **Zero Dev/QA Jargon, HUD Telemetry Chrome, or Corner Counters**: Zero debug labels, fake `97 SCORE` rings, `const res = await` filler, placeholder strings, **AI-slop HUD/telemetry chrome** (uppercase monospace kickers like `— NE · 10 RELEASE`, dot-separated metadata captions like `NE · 10 · 7 / 7 RECEIPTS VERIFIED`, rounded glowing-dot pills like `• RECEIPT 03 / 07`, labeled percentage/voltage bars), or **corner slide/step counters (`01 / 07`)** cluttering the frame.
3. **Anti-Template Originality, Varied Choreography & Physically Driven Loop**: Derived from the target product's real brand, with varied spatial choreography (zero repetitive transitions), `70%+` calm negative space, direct overlapping peels (zero fade-to-blank gaps), a **finale that physically drives the brand lockup** (never a static centered flexbox ending), a **seamless infinite loop bridging the ending back into Frame 0**, `<= 92%` macro safe-width, and `<= 30` simultaneous `preserve-3d` DOM nodes.
4. **Frame-Clock Determinism + Verified Font Loading**: 100% `useCurrentFrame()` / `interpolate()` / `spring()`, zero `Math.random()` / `Date.now()` / CSS `@keyframes` / CSS `transition`, clean `tsc --noEmit`, and verified `@remotion/google-fonts`.
5. **Matching Real Music + Procedural SFX Discipline**: Source a real, license-cleared background track matching the product's mood/tempo, beat-sync edits via `analyze-music.mjs`, layer crisp 48 kHz procedural DSP SFX (`generate-dsp-sfx.mjs`) with music ducking and loop-clean fades, and master via `master-audio.mjs` to `-14 LUFS` (`truePeak <= -1.0 dBTP`); zero code-generated synth/chiptune music beds (use SFX-only only if explicitly requested or while awaiting a licensed track).

---

## 5. Self-Contained Audio, Visual QA, Export & End-to-End MP4 Review Pipeline

1. **Source Real Matching Music + Synthesize Procedural DSP SFX**
   - Source a real, license-cleared `.mp3`/`.wav` whose genre, energy arc, and tempo fit the product (`public/audio/track.mp3`), analyze its exact beat grid, and synthesize all 14 stereo 48 kHz studio SFX WAVs:
   ```bash
   # Synthesize 14 offline stereo 48 kHz studio SFX WAVs
   node <skill-dir>/scripts/generate-dsp-sfx.mjs --out public/sfx

   # Beat-sync edits & climax drop to the real matching music track (auto-uses Remotion's bundled FFmpeg)
   node <skill-dir>/scripts/analyze-music.mjs --in public/audio/track.mp3 --out src/audio-beats.json --fps 30
   ```
2. **Typecheck & Verify Composition Registration**
   ```bash
   npx tsc --noEmit && npx remotion compositions
   ```
3. **Run Motion-Boundary & Loop-Seam Contact-Sheet Pre-Check**
   ```bash
   node <skill-dir>/scripts/qa-frames.mjs --comp <Id> --fps 30 --duration <frames> --cuts <c1,c2,...>
   ```
   Inspect every hero, `cut - 1 / cut / cut + 2` triplet, and `loop-end / loop-start` seam PNG blindly against [references/review-gates.md](./references/review-gates.md) and [styles/product-cinema.md](./styles/product-cinema.md). Fix every `BLOCK` finding before rendering.
4. **Export X-Optimized 1080p MP4 & Master Audio (`-14 LUFS`, Zero Video Re-Encode)**
   ```bash
   npx remotion render <CompositionId> out/launch-video.mp4 \
     --codec=h264 --pixel-format=yuv420p --crf=18 --audio-codec=aac --audio-bitrate=192k --gl=angle
   node <skill-dir>/scripts/master-audio.mjs --in out/launch-video.mp4 --out out/launch-video-mastered.mp4
   ```
5. **MANDATORY: Watch & Audit the Exported `.mp4` End-to-End (Never Stop at Stills)**
   - **Static QA PNGs cannot catch real pacing, mid-transition overlaps, motion flow, or audio-visual drift.**
   - Watch/inspect `out/launch-video-mastered.mp4` end-to-end (including the wrap from the final second back into Frame 0) to judge perceived rhythm, transition variety, text/element overlaps, finale lockup physics, music+SFX sync, and seamless infinite-loop continuity. If anything drags, overlaps, repeats, or seams visibly, fix the root cause and re-render before handoff.
