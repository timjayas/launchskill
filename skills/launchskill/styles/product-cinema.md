# Technique Playbook 4: `product-cinema` — Software UI & Hardware Launch Cinema

> **Pure Technique Playbook (Brand-Agnostic):** Load `product-cinema` **ONLY** for concrete software UI, developer tool, creative app, agentic workflow, or physical hardware demos where real interfaces and interactive micro-proof are the hero. It prescribes **ZERO default colors, ZERO default fonts, and ZERO fixed light/dark polarity**—derive every surface, accent, corner radius, and font pairing directly from the user's real product and brand in `DIRECTION.md`.

---

## 1. When to Choose This Technique

- **Best For:** SaaS apps, developer tools/IDEs/CLIs, AI agents & MCP servers, creative/node/ad canvases, mobile apps, design systems, and industrial hardware where the viewer must see **tangible software craft, real micro-interactions, or physical product geometry** in action.
- **2D vs. 3D Rule:** Keep desktop/web software UI orthogonal 2D + `<SpatialCameraRig>` (or intentional 2.5D hardware framing for mobile/laptop devices); reserve `@remotion/three` strictly for physical hardware or sculptural 3D brand marks (see [`../references/r3f-remotion-guide.md`](../references/r3f-remotion-guide.md)).

---

## 2. Owned References & Primitives

This playbook owns all UI-specific primitives, scene blueprints, benchmarks, and interaction guides:

- **Core Motion & Primitives:** [`../templates/motion.ts`](../templates/motion.ts) · [`../templates/StudioPrimitives.tsx`](../templates/StudioPrimitives.tsx) · [`../templates/widgets/VisualWidgets.tsx`](../templates/widgets/VisualWidgets.tsx) · [`../templates/scenes/`](../templates/scenes/) (`CardToChipDockScene.tsx`, `InlineLogoSlotHeadlineScene.tsx`, `MacroPromptStrobeScene.tsx`, `ZScatterThemeFlipScene.tsx`)
- **Empirical Motion Telemetry:** [`../references/benchmarks.md`](../references/benchmarks.md) (10-film `100ms` frame-by-frame pacing/velocity physics & signature UI patterns)
- **Art Direction & Token Reference:** [`../references/art-direction-presets.md`](../references/art-direction-presets.md) (structural references—always override tokens with the target product's real brand)
- **Interactive UI & Real Media Recipes:** [`../references/micro-interactions.md`](../references/micro-interactions.md)
- **Beat Grids, Blueprints & Transitions:** [`../references/pacing-and-transitions.md`](../references/pacing-and-transitions.md)
- **Motion Design System & 3D Studio IBL:** [`../references/motion-design-system.md`](../references/motion-design-system.md) · [`../references/r3f-remotion-guide.md`](../references/r3f-remotion-guide.md)
- **Self-Contained Reference Examples:** [`../examples/kinetic-studio-launch.tsx`](../examples/kinetic-studio-launch.tsx) · [`../examples/rebrand-editorial-launch.tsx`](../examples/rebrand-editorial-launch.tsx) · [`../examples/saas-launch.tsx`](../examples/saas-launch.tsx) · [`../examples/app-feature-highlight.tsx`](../examples/app-feature-highlight.tsx) · [`../examples/simple-product-reveal.tsx`](../examples/simple-product-reveal.tsx)

> **De-Cloning & Widget Cap Rule:** [`VisualWidgets.tsx`](../templates/widgets/VisualWidgets.tsx) is a **physics reference library**, NOT a sticker buffet. Build bespoke domain-native visuals and cap signature mechanics at **1–2 per 15-second film**.

---

## 3. Mandatory Brand Token & Motion Temperament Derivation (From Real Product)

**NEVER copy-paste colors, polarity, cursors, or props from reference examples** (no default purple-blue SaaS gradients, no default pink/orange cursors, no default white-only or obsidian-only costumes unless they belong to the product). Derive these **5 bespoke brand tokens** in `DIRECTION.md` from the user's repo/brand:

1. **Native Surface Polarity & Figure-Ground Contrast:**
   - Match the product's real habitat (light studio, dark obsidian, warm editorial, or chromatic brand surface).
   - Ensure unmistakable figure-ground separation between stage background and product window (e.g., if staging a code editor or devtool on a light stage, frame it in high-contrast dark app chrome with real multi-token syntax highlighting and deep contact shadow—never a washed-out white window floating on white, and zero blank-gap diff holes).
   - **Never use blurred circular/radial background glow orbs.** Use `<StudioCyclorama />` for subtle tonal depth and `<FilmGrainOverlay />` (`128×128` tiled anti-banding grain).
2. **Brand Accent System:** Extract the product's real primary accent (or monochrome ink); avoid stacking 3+ competing accents on one screen.
3. **Corner-Radius Geometry:** Match the product's actual UI geometry—Architectural (`0px`), Sharp (`8–12px`), Studio (`18–24px`), or Soft (`26–34px`).
4. **Verified Typography Pairing:** Load the brand's actual sans/serif/mono faces via `@remotion/google-fonts` (zero system fallbacks). Enforce `tabular-nums` on every counter/timer and keep readable copy inside `120px × 90px` safe margins.
5. **Motion Temperament:** Lock ONE temperament in `MOTION_TEMPERAMENTS` (`taut-mechanical`, `editorial-fluid`, or `tactile-snappy`) so spring damping, secondary settle (`+0.065–0.095s`, `6–10px` inner travel), and hold durations feel authored by one studio.

---

## 4. Structural Launch Archetypes (Pick ONE Motion Structure, Apply Target Brand)

Use these strictly as **structural choreography patterns**—never copy their reference colors or copy:

| Structural Archetype | Typical Runtime / Tempo | Best For | Signature Motion Grammar |
| :--- | :--- | :--- | :--- |
| **1. Spatial Creative Tool** (`kinetic-studio`) | `24–60s` · `24p`/`30p` · `132 BPM` | Creative suites, node/canvas tools, tactile editors | Brand-framed nodes, radial orbital bursts, vertical slot drums, live slider scrubs, 1-to-1 wired dataflow, `<SpatialCameraRig>` hops + `<DirectionalMotionBlur>` whip-pans |
| **2. Editorial Brand Punch** (`rebrand-editorial`) | `20–30s` · `30p` · `116 BPM` | AI search/RAG agents, MCP libraries, sub-30s drops | Display hooks, `3.2×` hard-cut macro typing punch-ins, full-bleed retrieval strobes, card-to-chip docking, 3D Z-scatter polarity flip, inline logo-slot headlines |
| **3. Chat-to-Cinema Agentic** (`motionfly-agentic`) | `24–30s` · `30p` · `120 BPM` | Autonomous coding/video/workflow agents, MCP builders | Legacy-stack replacement dock, connected vertical execution tree (100% steps completing live), meta output assembly reveal, multiplayer cursor swarm convergence |
| **4. Creative Ad Canvas** (`hera-ad-canvas`) | `40–45s` · `60p`/`30p` · `128 BPM` | Creative/ad/brand generators, multi-format canvases | Polarity heartbeat, parallel cursors spawning mixed-aspect artboards (`16:9`/`1:1`/`4:5`/`9:16`), URL→Brand Kit bloom, in-place transmutation, canvas-to-full-bleed zoom |
| **5. Editorial Gallery** (`editorial-gallery`) | `20–30s` · `30p` · `115–120 BPM` | Storytelling SaaS, AI apps | Calm high-contrast gallery pacing, earned polarity climax chapter, inline mark reflow |
| **6. Precision DevTool** (`precision-devtool`) | `16–22s` · `30p`/`60p` · `125 BPM` | DevTools, APIs, CLI, infra | Crisp `1px` hairlines, `⌘K` command palettes, live multi-token diffs, `tabular-nums` impact metrics |
| **7. Hardware Studio** (`hardware-studio`) | `16–24s` · `30p` · `112–116 BPM` | Physical hardware, 3D marks | Single persistent `<ThreeCanvas>` + offline `RoomEnvironment` PMREM studio IBL + `1px` macro leader lines |
| **8. Architectural Archive** (`architectural-archive`) | `20–30s` · `30p` · `120 BPM` | Design systems, directories, index launches | Sharp `0px` corners, `1px` hairline grids, `+` crosshairs, `<ViewfinderFrame>` L-brackets, `<RollingOdometer>` counters, stark kinetic type slates |

---

## 5. UI Pattern Decision Matrix

| Product Story | Recommended Pattern | Detailed Guide |
| :--- | :--- | :--- |
| "Stage a real screenshot or screen recording like cinema" | **`<SpatialCameraRig>` Zoom-Track + Speed-Ramped `<OffthreadVideo>` + Spotlight Callout** | [`micro-interactions.md`](../references/micro-interactions.md) |
| "Show a wide tool library fast" | **Radial Orbital Burst** or **Accelerating Vertical Slot Drum** (true vertical blur) | [`micro-interactions.md`](../references/micro-interactions.md) |
| "Show prompt typing clearly on 360px mobile X" | **Hard-Cut `3.2×` Macro Typing Punch-In** | [`micro-interactions.md`](../references/micro-interactions.md) |
| "Show AI search / MCP retrieval without spinners" | **Shimmer Status + 3-Beat Full-Bleed Retrieval Strobe + Tabular Counter HUD** | [`micro-interactions.md`](../references/micro-interactions.md) |
| "Show multi-turn visual context / before-after proof" | **Card-to-Prompt-Chip Docking** or **Forward-and-Back Live Slider Scrub** | [`micro-interactions.md`](../references/micro-interactions.md) |
| "Show autonomous multi-step build / meta output" | **Connected Vertical Agent Tree** (100% completed) + **Meta Assembly Reveal** | [`micro-interactions.md`](../references/micro-interactions.md) |
| "Show parallel multi-aspect generation / brand kit" | **Multi-Artboard Freeform Canvas** · **URL→Brand Kit Bloom** · **In-Place Transmutation** | [`micro-interactions.md`](../references/micro-interactions.md) |
| "Bridge tool output cleanly into full-bleed commercial" | **Static→Motion Split → Canvas-to-Full-Bleed Zoom** + **Panorama Sweep** | [`micro-interactions.md`](../references/micro-interactions.md) |
| "Stage a code editor / devtool with high contrast" | **High-Contrast App Window Chrome + Multi-Token Syntax Diff** | [`micro-interactions.md`](../references/micro-interactions.md) |
| "Hold attention without chat bars" | **Kinetic Type Slate + `<ViewfinderFrame>` + `<RollingOdometer>`** | [`micro-interactions.md`](../references/micro-interactions.md) |
| "Pivot mood dramatically or land an iconic finale" | **Z-Scatter + Anchor Theme-Flip**, **Directional Whip-Pan**, or **Peak-Velocity Match-Cut** | [`pacing-and-transitions.md`](../references/pacing-and-transitions.md) |

---

## 6. UI-Specific Pass/Block Review Gates (Supplement to Universal Laws)

Every `product-cinema` video MUST pass the 5 Universal Laws in [`../references/review-gates.md`](../references/review-gates.md) **AND** all **10 UI-specific quantitative gates** below (issue **`BLOCK`** on any violation):

| # | UI Gate Category | Hard Pass Criteria | Immediate `BLOCK` Trigger |
| :-: | :--- | :--- | :--- |
| **UI-1** | **Frame-0 Presence & Hook Velocity (`0–3s`)** | Canvas is mid-arrival at `frame = 0` (`progress >= 0.35`, `spatialContrast >= 0.11`, `hookActivePixels >= 12%`) with a single dominant focal anchor and concrete 4–7 word mechanism. | Blank/faint Frame 0, fade-from-black opening, vague slogan, or 5-way scattered symmetric cards splitting foveal attention. |
| **UI-2** | **No Vacuum `scale(0)` UI Entrances** | UI cards, badges, popovers, and devices enter from `scale(0.90–0.96)` combined with opacity, Z-depth, baseline masking, or contextual trigger origin (`transformOrigin` at clicked control). | Scaling an interface container from `0 → 1` out of thin air (`scale(0)` pop-in vacuum). |
| **UI-3** | **Entrance vs. Exit Easing Discipline** | Arrivals decelerate responsively (`EASE_OUT_EXPO` or damped springs like `SPRING_EDITORIAL`); `EASE_IN_EXPO` is reserved strictly for outgoing acceleration into a velocity match-cut. | Using `EASE_IN` on an arriving UI element (sluggish start while the viewer's eye waits). |
| **UI-4** | **Duration & Mass Proportionality** | Micro-UI interactions settle in **`120–280ms`** (`3–9f @ 30p`); spatial camera dives & 2.5D hardware moves settle in **`420–680ms`** (`getSpringForMass`). Inner content follows outer containers `+0.07–0.10s` later (`6–12px` travel). | Uniform spring constants across all hierarchy tiers, sluggish `> 400ms` button/pill transitions, or rigid single-block card motion. |
| **UI-5** | **Zero Dead-Frame Holds (`> 0.6s`)** | Readable UI holds rock-solid for `0.75–1.35s` (`2.5–3.2s` CTA) while maintaining `>= 1%` active pixel delta via continuous 2.5D camera orbit, coupled glass sheen, live widget activity, or cyclorama parallax. | Any contiguous span `> 0.6s` (`> 18 frames @ 30fps`) with `< 1%` active pixel change, or empty fade-to-black tails. |
| **UI-6** | **Visual-First UI Craft (Zero Skeleton / Chat-Bubble Slop)** | Capabilities are proved via real UI recordings, multi-token syntax diffs, rich layered widgets, interactive maps/sliders/timelines, or tactile 2.5D/3D hardware shaders. | Gray skeleton loader bars (`AbstractCodeBars`), fake chat-bubble prompt boxes typing long sentences, raw LLM stick-figure SVG clipart, or dense text-wall spec tables. |
| **UI-7** | **Scale & Polarity Dynamic Range** | Adjacent shots shift camera scale (`>= 1.4×`, ideally `2.2× ↔ 1.0×`) or 2.5D perspective angle (`>= 20°`), with meaningful luminance contrast across the edit. | 4+ consecutive shots at flat `1.0×` zoom and flat uniform luminance (`luminanceRange < 0.15`). |
| **UI-8** | **Figure-Ground Window Contrast** | App windows, code editors, and UI panels have unmistakable edge contrast, authentic syntax/content tokens, and clean contact shadows against the stage ground (zero blank-gap diff holes). | Washed-out low-contrast windows blending into the background, missing syntax tokens, or `opacity: 0` empty line gaps during diff animations. |
| **UI-9** | **1–2 Signature Mechanics Cap & Single-World Cohesion** | Every shot has `1` clear focal subject, `70%+` calm negative space, at most `1–2` signature mechanics per 15s film, and zero dangling connector wires or unmotivated 2.5D tilt on flat editorial text. | Stacking 3+ unrelated pre-built widgets ("widget buffet"), dangling wires pointing into empty whitespace, half-finished agent checklists, or forced 3D tilt on flat typography. |
| **UI-10** | **Beat-Cut Sync, Confined Blur & Crisp Settle** | Visual velocity peaks lock within `±2 frames` of `createBeatGrid(bpm, fps)`; rapid whip-pans/slot-drums confine `<DirectionalMotionBlur>` strictly to the `3–4` peak-velocity frames (`0` at rest) paired with high-stiffness settle springs (`stiffness >= 320`) so labels lock dead-center immediately. | Drifting off-beat cuts, blurred static/landing text, sluggish slot-drum settles, muddy opacity crossfades, or 3D cube-flip transitions. |

---

## 7. Explicit Ban List (Zero Cross-Contamination)

A `product-cinema` film is **IMMEDIATELY REJECTED (`BLOCK`)** if ANY of the following appear:

- **Banned Cross-Technique Leakage:** Mixing `PaperCutoutLayer` stepped stop-motion drop shadows, `OrganicBoilFilter` hand-inked wobble on crisp software UI chrome, arbitrary `LiquidMetaballStage` ink-blob filler, or unrelated calligraphic `CameraTrackedStroke` filler into a concrete software demo *(unless the product itself is literally a drawing/collage/ink tool and the effect is motivated by the real UI)*.
- **Banned AI Template Slop:** Widget buffets (`3+` unrelated widgets in one shot), fake `97 SCORE` radial donuts, `const res = await product.run()` placeholder code when the product isn't an IDE, blurred circular radial-gradient background orbs, sparkle icons (`✨`), floating 3D toruses behind 2D SaaS UI, recycled reference brand costumes (purple-blue gradients, parchment/terracotta, or cloned pink/orange cursors), unreadable `12px` chat bars, or code-generated synth music beds.
