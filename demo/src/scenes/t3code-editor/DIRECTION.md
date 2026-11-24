# DIRECTION.md — T3Code Launch Film

## 1. Brand Discovery Summary
- **Product:** **T3Code** — an AI-powered code editor that lets developers code using their existing AI subscriptions (**Claude**, **Codex**, **Gemini**, and more) inside one fast, native workspace.
- **Workspace Assets Discovered:**
  - Official vector SVGs in `demo/public/logos/`: `claude-color.svg`, `openai.svg`, `opencode.svg` (plus bespoke clean vector Gemini 4-point star emblem and T3Code geometric `T3` monolith mark).
  - 14 offline 48 kHz stereo procedural DSP studio foley WAVs in `demo/public/sfx/`.
- **Audience:** Software engineers & builders scrolling X who already pay for Claude, ChatGPT/Codex, and Gemini subscriptions and want one ultra-fast AI editor without paying double for per-seat markups.
- **Core Value Proposition:** One native AI code editor powered directly by the Claude, Codex, and Gemini subscriptions you already own.

## 2. The 15-Second Stranger Test (Hook → Proof → CTA)
1. **Hook (0.0–3.0s):** T3Code opens mid-action inside its Obsidian Subscription Rail as Claude, Codex, and Gemini snap into one unified code editor.
2. **Proof (3.0–14.5s):** Watch T3Code switch live between Claude, Codex, and Gemini subscriptions inside a real Dark-Mode macOS editor, streaming a multi-token TypeScript diff and applying it in one keystroke—using the subscriptions you already pay for.
3. **CTA (14.5–18.0s):** Your models, one fast editor—**T3Code** (`t3code.dev`).

## 3. Locked Technique Playbook & Isolation
- **Primary Playbook:** `product-cinema` (`skills/launchskill/styles/product-cinema.md`)
- **Structural Archetype:** **Precision DevTool (`precision-devtool`)**
- **Format & Tempo:** `1920 × 1080` (16:9), `30 fps`, `18.0s` (`540 frames`, `120 BPM` = `36 beats`, `15 frames/beat`)
- **Motion Temperament:** `taut-mechanical` (`SPRING_EDITORIAL` for panels/camera, `SPRING_SNAPPY` for micro-UI controls, `EASE_OUT_EXPO` for arrivals, `EASE_IN_EXPO` strictly for outgoing velocity match-cuts)
- **Primitive Isolation:** Strictly `product-cinema` custom primitives (`T3CodeEditorPrimitives.tsx`). Zero abstract-pack primitives (`PaperCutoutLayer`, `OrganicBoilFilter`, `LiquidMetaballStage`), zero `VisualWidgets.tsx` sticker buffet.

## 4. Core Emotion & Frame-0 Hook (`0–2s`)
- **Emotion:** Precision engineering relief — closing scattered AI tabs and snapping into one crisp, native code editor.
- **Frame 0 (Alive Mid-Action):** Opens at `1.85×` macro scale on the `#0C0D10` Obsidian Subscription Rail floating over a clean `#F6F6F4` architectural cyclorama, with the `#2563EB` Cobalt Caret Beam mid-sweep across `Claude · Codex · Gemini` and `"T3Code"` locked dead-center.

## 5. Original Hero Motif & Visual Thread (Object Permanence)
- **Hero Motif:** **The Obsidian Subscription Rail & `#2563EB` Cobalt Caret Beam.**
  - **Beat 1 (`f0–f90`, `0.0–3.0s`, Light):** Macro `1.85×` Subscription Rail (`Claude · Codex · Gemini` connected pills) pulls back smoothly (`EASE_OUT_EXPO`) and expands via shared container geometry into the header of the full T3Code IDE window.
  - **Beat 2 (`f90–f240`, `3.0–8.0s`, Light + Dark macOS IDE):** Full Dark-Mode macOS T3Code Editor (`#0C0D10` chrome, `#FF5F56`/`#FFBD2E`/`#27C93F` traffic lights, crisp `1px` border). Live subscription switcher steps `Claude → Codex → Gemini` while `<T3SpatialCamera>` dives `1.0× → 1.75×` onto real multi-token TypeScript code (`src/auth/session.ts`), smoothly expanding inline `+38 -12` diff rows (zero blank vertical gaps) and landing a tactile `⌘↵ Apply` click → `Applied ✓`.
  - **Beat 3 (`f240–f345`, `8.0–11.5s`, Light):** Velocity pull-out into a crisp editorial inline subscription slot-swap: `"Code with your"` + locked-width vector logo slot (`Claude`, `Codex`, `Gemini`, `+ more`) + `"subscription."`
  - **Beat 4 (`f345–f435`, `11.5–14.5s`, Earned `#0C0D10` Dark Climax):** The `#2563EB` Cobalt Caret Beam sweeps left-to-right as a razor-sharp architectural curtain wipe into `#0C0D10` obsidian polarity: `"Your models."` → `"One fast editor."` anchored above the unified `Claude · Codex · Gemini` subscription bar.
  - **Beat 5 (`f435–f540`, `14.5–18.0s`, Light Finale):** Crisp snap back to `#F6F6F4` light studio polarity for a `3.5s` living hold (subtle specular sheen + caret breath): Geometric `T3` obsidian monogram + `"T3Code"` + `"Claude · Codex · Gemini"` + `t3code.dev`.

## 6. Derived Brand System & Copy Budget
- **Palette:**
  - `CANVAS`: `#F6F6F4` (Architectural Gallery White)
  - `CANVAS_EDGE`: `#EAEAE6` (Subtle Cyclorama Falloff)
  - `OBSIDIAN`: `#0C0D10` (Dark macOS Chrome & Climax Polarity)
  - `EDITOR_SURFACE`: `#12151C` (Code Editor Pane)
  - `PRIMARY_INK`: `#0E0F12`
  - `MUTED_INK`: `#5A5F6B`
  - `ACCENT`: `#2563EB` (Electric Cobalt — active rail & caret beam)
  - Provider accents (strictly scoped to provider icons/dots): Claude `#D97757`, Codex `#10A37F`, Gemini `#3B82F6`
- **Verified `@remotion/google-fonts` Pairing:**
  - Display: `Space Grotesk` (`600`, `700`)
  - UI Sans: `Inter` (`400`, `500`, `600`, `700`)
  - Code / Mono: `JetBrains Mono` (`400`, `500`, `600`)
- **Audio:** Crisp 48 kHz Procedural DSP Studio Foley only (`demo/public/sfx/*.wav`), zero code-generated synth music beds, mastered via `master-audio.mjs` to `-14 LUFS` / `-1.5 dBTP`.
- **Copy Discipline:** `2–5` words per beat, `>= 32px` for all readable UI callouts/captions, strictly inside `120px × 90px` safe zones.

## 7. Explicit Exclusion List
- No chat bubbles, fake iMessage threads, or prompt boxes typing 15-word sentences.
- No recycled Anthropic parchment/terracotta canvases, no purple-blue SaaS gradients, no blurred circular radial-gradient glow orbs.
- No wireframe CAD grid wallpaper, no giant faint background watermark words, no gray skeleton-loader bars, no fake `97 SCORE` radial rings.
- No blank-gap diff fade-ins (`opacity: 0` empty vertical holes in code editors).
- No sparkle icons (`✨`), no code-generated synth/chiptune music loops, no `Math.random()` / `Date.now()` / CSS `@keyframes` / CSS `transition`.
