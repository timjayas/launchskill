# Art Direction Presets & Brand-First Token Derivation

> **De-Cloning Law:** Never copy-paste signature colors, cursors, or props from reference videos (e.g., Fuser's `#EC4899` pink borders or `#F97316` orange cursors, Hera's crimson ember, or Motionfly's violet) unless they genuinely match the target product's brand. Always derive bespoke brand tokens **first**, then map those tokens into the structural grammar of your chosen archetype.

---

## Mandatory Step 1.5: Brand Token & Motion Temperament Derivation

Before selecting an archetype or writing a single component, derive these **5 brand tokens** from the user's product brief, URL, or brand assets:

| Token Dimension | How to Derive | Rule of Discipline |
| :--- | :--- | :--- |
| **1. Surface Contrast Polarity** | **Default to Pure Light Gallery White (`#FFFFFF` / `#F9F9F8` / `#F7F7F5`)** across `80–90%` of runtime (with one optional brief `1.8–2.5s` `#141413` dark polarity climax). Only use dark obsidian (`#09090B`) as primary if the user explicitly requests a dark theme. | Keep backgrounds **clean flat solid surfaces**. **NEVER use blurred circular radial-gradient glows or ambient color orbs**. **DevTool / Code Editor Rule:** Never float a white code window on a white canvas (zero figure-ground contrast) — stage code editors inside sleek **Dark-Mode macOS desktop chrome (`#0D0D10`, real `#FF5F56`/`#FFBD2E`/`#27C93F` traffic lights, `1px` specular hairline, deep studio shadow)** floating on the bright off-white studio cyclorama! |
| **2. Single Primary Brand Accent** | Extract the product's 1 signature brand hue (or pure monochrome ink `#111114`/`#FAFAFA` if editorial) | Maximum **1 primary accent** + optional semantic status tint (`success`/`warning`). Never stack 3+ competing accent colors on one screen. |
| **3. Corner-Radius Geometry** | Sharp architectural (`8–12px`) for technical/dev tools · Balanced studio (`18–24px`) for modern SaaS · Soft organic (`26–34px` + pills) for consumer/creative tools | Lock one radius scale across cards, chips, and modals so every cut feels authored by one design system. |
| **4. Typography Pairing** | Geometric Sans (`Inter`) + Mono (`JetBrains Mono`) for technical authority; add Display Serif (`Instrument Serif` / `Playfair Display`) only when editorial contrast or luxury craft fits the brand | Load real webfonts (`@remotion/google-fonts` or `ensureStudioFonts()`). Never rely on system fallbacks. |
| **5. Motion Temperament** | Pick **one** temperament below based on product personality—not just the archetype's default | Governs spring damping, travel distance, and hold duration across the entire film. |

### Motion Temperament Profiles

| Temperament | Best For | Spring / Snap Feel | Secondary Follow-Through |
| :--- | :--- | :--- | :--- |
| **`taut-mechanical`** | DevTools, infra, APIs, security, fintech | `SPRING_EDITORIAL` / `SPRING_SNAPPY`, `0.15–0.20s` snaps, zero overshoot, crisp hard cuts | `+0.065s` (`~2f @ 30p`), tight `6px` inner travel |
| **`editorial-fluid`** | Storytelling SaaS, AI research, luxury hardware, brand platforms | `SPRING_SMOOTH` / `SPRING_EDITORIAL`, `0.24–0.30s` glides, generous `1.0–1.35s` museum holds | `+0.095s` (`~3f @ 30p`), `10px` inner travel |
| **`tactile-snappy`** | Creative suites, ad canvases, multiplayer tools, consumer apps | `SPRING_SNAPPY` / `SPRING_POP`, `0.18–0.24s` direct-manipulation snaps, directional whip-pans | `+0.075s` (`~2f @ 30p`), `8px` inner travel |

---

## Preset Selection Matrix

| Product Category | Default Preset | 3D vs. 2D Default | Signature Feel |
| :--- | :--- | :--- | :--- |
| Creative suites, AI toolkits, node/canvas tools, viral X demos | **`kinetic-studio`** | Pure 2D + Spatial Camera Rig + Directional Blur (`24p`/`30p`) | Stark `#FFFFFF` gallery canvas, brand-accented active borders, rapid tactile demos, chromatic pattern interrupt |
| AI search/RAG agents, MCP libraries, sub-30s brand drops | **`rebrand-editorial`** | Pure 2D + Hard-Cut Macro Punch-Ins (`30p`) | Display Serif hooks, `3.2×` macro typing, retrieval strobes, card-to-chip dock, single Light→Dark inversion |
| Autonomous coding/video/workflow agents, Chat-to-App builders | **`motionfly-agentic`** | Pure 2D + Meta Timeline + Cursor Swarm (`30p`) | Legacy replacement dock, connected vertical agent execution tree, animated meta preview, multiplayer swarm |
| Creative/ad/brand generators, multi-format design canvases | **`hera-ad-canvas`** | Pure 2D + Freeform Dot-Grid Canvas (`60p`/`30p`) | 4-cycle Dark↔Light heartbeat, parallel agent cursors spawning multi-aspect artboards, URL→Brand Kit bloom, static→motion full-bleed zoom |
| Storytelling SaaS, AI apps, modern productivity | **`editorial-gallery`** | 2D-first + Macro Camera Rig (selective 3D emblem only) | Studio paper + obsidian dark chapter inversion, two-tone ink contrast |
| DevTools, APIs, CLI, infra, databases, observability | **`precision-devtool`** | Pure 2D + Macro Camera Rig (zero floating 3D primitives) | Obsidian canvas, `1px` silver hairlines, monospace precision |
| Physical hardware, wearables, industrial consumer goods | **`hardware-studio`** | Persistent `@remotion/three` + Offline Studio PMREM IBL | Cyclorama studio, brushed metal reflections, macro leader lines |
| Consumer social, mobile apps, productivity, indie tools | **`expressive-consumer`** | 2D-first + tactile cards / real UI recordings | Warm alabaster canvas, confident color blocks, crisp spring snaps |
| Design systems, directories, research tools, Swiss-editorial launches | **`architectural-archive`** | Pure 2D + `0px` Viewfinder Grid + Rolling Odometers (`30p`) | Crisp `0px` corners, `1px` full-bleed hairline grids, `+` crosshairs, L-corner brackets, zero-padded mono indices (`0001 / 3326`), monochrome Zinc polarity |

### Proven X Hook Copy Law (Distilled From 3,300+ Curated Launches on What Ships)
High-retention X launches skip vague slogans (*"The future of productivity"*) and lead with a **concrete 4–7 word mechanism**:
- Formula: **`<Product> — <concrete visual/functional reality>`**
- Strong examples: *"a real Android phone in your Codespace"* · *"your Claude sessions on one canvas"* · *"a living system instead of a PDF"* · *"a design system that keeps agents on brand"*.

---

## 1. `editorial-gallery` (Default)

Inspired by high-craft product reels (ElevenLabs, Apple software, Figma). Gallery light primary canvas with an intentional obsidian dark chapter to separate workflow proof or technical depth.

```ts
export const EDITORIAL_GALLERY_THEME = {
  lightBg: "#F7F7F5",
  lightSurface: "#FFFFFF",
  lightBorder: "rgba(10, 10, 10, 0.09)",
  lightTextPrimary: "#0A0A0A",
  lightTextMuted: "#737373",

  darkBg: "#09090B",
  darkSurface: "#141417",
  darkBorder: "rgba(255, 255, 255, 0.11)",
  darkTextPrimary: "#FAFAFA",
  darkTextMuted: "#A1A1AA",

  accent: "#111111",          // Override with derived brand primary (e.g. #2563EB, #0F766E)
  washWarm: "#FDBA74",        // Soft warm blur wash at 14-20% opacity
  washCool: "#93C5FD",        // Soft cool blur wash at 14-20% opacity
};
```

- **Typography Pairing**: `Inter` (500/600/700, `-0.035em` tracking, sentence case) + italic `Instrument Serif` (400) for 1–2 focal emotional words per headline + `JetBrains Mono` (500) for quiet micro-specs.
- **Two-Tone Ink Hierarchy**: Put context words in `lightTextMuted` and focal words in `lightTextPrimary` rather than rainbow gradients or ALL-CAPS shouting.
- **Clean Studio Surfaces (Zero Blur Circles)**: Rely on pure `#FFFFFF` / `#F7F7F5` gallery contrast, crisp `1px` architectural borders, and restrained neutral elevation shadows — never blurred radial-gradient backdrop circles, ambient glow orbs, sparkle icons (`✨`), or electric neon grids.

---

## 2. `precision-devtool`

Inspired by Linear, Vercel, Raycast, and Stripe Docs. Razor-sharp technical authority with zero decorative fluff.

```ts
export const PRECISION_DEVTOOL_THEME = {
  bg: "#09090B",
  surface: "#111114",
  surfaceElevated: "#18181C",
  border: "rgba(255, 255, 255, 0.10)",
  borderActive: "rgba(255, 255, 255, 0.28)",
  textPrimary: "#FAFAFA",
  textMuted: "#8E8E98",
  accent: "#FAFAFA",          // Crisp monochrome default; override with derived brand accent
  accentTint: "#38BDF8",      // Subtle semantic highlight (code tokens, active cursor, status dot)
  success: "#4ADE80",
};
```

- **Typography Pairing**: `Inter` (600/700, `-0.035em`) + `JetBrains Mono` (500/600) for CLI commands, diffs, latencies, and `⌘K` shortcuts.
- **Surface Craft**: Top-edge specular hairline (`inset 0 1px 0 rgba(255,255,255,0.08)`), faint dot-grid (`opacity: 0.06`), and **2.5% tiled film grain** so obsidian gradients never band after X H.264 compression.

---

## 3. `hardware-studio`

Inspired by Apple Hardware, Nothing, and Teenage Engineering. Physical product as sculptural hero on a clean studio cyclorama.

```ts
export const HARDWARE_STUDIO_THEME = {
  lightBg: "#F4F4F2",
  darkBg: "#0A0B0E",
  lightTextPrimary: "#0A0A0A",
  lightTextMuted: "#6B7280",
  darkTextPrimary: "#F9FAFB",
  darkTextMuted: "#9CA3AF",
  accent: "#2563EB",          // Override with brand accent (anodized seal, LED indicator, spec callout)
  accentSecondary: "#60A5FA",
  bodyColor: "#14213D",       // Primary hardware finish
  metalColor: "#9CA3AF",      // Brushed titanium / anodized aluminum
};
```

- **Lighting Requirement**: Always use **offline procedural studio IBL (`RoomEnvironment` / `PMREMGenerator`)** inside `<ThreeCanvas>` so metallic and satin surfaces show realistic studio softbox reflections.
- **Compositional Variety**: Alternate (1) centered hero silhouette, (2) `1.8×–2.2×` macro detail + `1px` architectural SVG leader line, (3) dark-chapter technical breakdown, and (4) quiet cyclorama brand lockup + CTA.

---

## 4. `expressive-consumer`

Inspired by Arc, Notion, and Loom. Warm, approachable, energetic, yet clean enough to read instantly on a 360px mobile X feed.

```ts
export const EXPRESSIVE_CONSUMER_THEME = {
  bg: "#FAF8F4",              // Warm studio alabaster
  surface: "#FFFFFF",
  surfaceTint: "#F3EFE8",
  border: "rgba(20, 18, 15, 0.09)",
  textPrimary: "#14120F",
  textMuted: "#6E6A63",
  accent: "#FF5A36",          // Override with brand primary (terracotta, cobalt, emerald, etc.)
  accentSoft: "#FFE7E0",
};
```

- **Typography Pairing**: `Inter` (700, `-0.03em`) + italic `Instrument Serif` for human warmth.
- **Choreography**: Inline thumbnail/icon reflow pops between headline words, tactile card fan-outs, and crisp full-bleed brand-color statement beats (`0.7s–1.1s`) as rhythmic pattern interrupts.

---

## 5. `kinetic-studio` (Archetype 1: Spatial Creative Tool)

Structural grammar inspired by high-velocity spatial tool launches (*Fuser — Tool Node*). Combines stark gallery-white `#FFFFFF` micro-breaths with hyper-tactile interactive demos, directional velocity blur, and one deliberate color-block pattern interrupt.

```ts
export const KINETIC_STUDIO_THEME = {
  bg: "#FFFFFF",                // Pure gallery white canvas (~70% of runtime)
  surface: "#FFFFFF",
  surfaceSubtle: "#FAFAFA",
  borderNeutral: "#E4E4E7",
  textPrimary: "#111114",
  textMuted: "#71717A",

  // ALWAYS override with the target product's derived brand tokens (never leave cloned pink/orange!)
  activeChrome: "#2563EB",      // 2px active node border & executing halo -> set to Brand Primary
  cursorAccent: "#111114",      // Tactile pointer fill -> neutral ink or brand accent
  interruptChapterBg: "#0F172A", // Deep moody chapter surface (slate / forest / burgundy matching brand)
  interruptInk: "#38BDF8",       // High-contrast ink on interrupt chapter
};
```

- **Frame Rate & Cadence**: `24 fps` (cinematic editorial punch) or `30 fps`, locked to **128–134 BPM**.
- **Signature Visual Grammar**: Recurring caret motif (`|`), brand-accented active node frames, prompt-to-pill morph + executing halo, accelerating vertical slot drum with true vertical blur, forward-and-back live slider scrubs, 1-to-1 wired dataflow, and peak-velocity scale-through match-cut.

---

## 6. `rebrand-editorial` (Archetype 2: Editorial Brand Punch)

Structural grammar inspired by sub-30s editorial MCP drops (*Rebrand MCP*, `29s`, `30p`, `116 BPM`). Pairs high-contrast Display Serif headlines with `3.2×` hard-cut macro typing punch-ins, full-bleed retrieval strobes, and one earned midpoint Light → Dark canvas inversion.

```ts
export const REBRAND_EDITORIAL_THEME = {
  lightBg: "#FFFFFF",
  darkBg: "#0D0D10",
  surfaceLight: "#FFFFFF",
  surfaceDark: "#18181D",
  borderLight: "#E4E4E7",
  borderDark: "rgba(255, 255, 255, 0.14)",
  inkLight: "#0B0B0E",
  inkDark: "#FAFAFA",
  muted: "#71717A",
  submitAccent: "#2563EB",      // Override with brand submit accent
};
```

- **Typography Pairing**: Display Serif (`Instrument Serif` / `Playfair Display` 600–700, `-0.025em`) + crisp `Inter` (500–600) for chat prompts & tabular counter HUDs.
- **Signature Visual Grammar**: Sub-2.7s hook → `3.2×` macro typing → 3-beat retrieval strobe + counter HUD → card-to-prompt-chip spatial docking → 3D Z-scatter + locked-center Light→Dark inversion → luminous singularity bloom → inline logo-slot finale.

---

## 7. `motionfly-agentic` (Archetype 3: Chat-to-Cinema / Agentic Demo)

Structural grammar inspired by autonomous MCP / video-agent launches (*Motionfly MCP*, `28–30s`, `30p`, `120 BPM`) with strict coherence guards.

```ts
export const MOTIONFLY_AGENTIC_THEME = {
  bg: "#FFFFFF",                // Crisp studio gallery white (~80% of runtime)
  darkStage: "#0D0E14",         // Obsidian stinger & studio timeline stage
  surface: "#FFFFFF",
  surfaceSubtle: "#F4F4F6",
  border: "#E4E4E7",
  ink: "#0B0B0F",
  muted: "#71717A",
  accent: "#7C3AED",            // Override with derived brand primary
  accentComplete: "#0D9488",    // Verified step completion tint
  swarmColors: ["#2563EB", "#0D9488", "#D97706", "#7C3AED"],
};
```

- **Typography Pairing**: Crisp geometric `Inter` (600–800, `-0.04em`) + `JetBrains Mono` (500/600) for timecodes (`00:08.15`), tool-call steps, and preset chips.
- **Signature Visual Grammar**: Legacy-stack-to-hero replacement dock → style-chip prompt → connected vertical agent execution tree (all steps completing live!) → meta timeline assembly reveal with real animated preview → multiplayer cursor swarm convergence → fast (`<= 0.9s`) mark→wordmark CTA hold.

---

## 8. `hera-ad-canvas` (Archetype 4: Creative Ad Canvas)

Structural grammar distilled for mid-length (`40–45s`, `60p` or `30p`, `~128 BPM`) creative/ad/brand generators that must prove both **freeform tool speed** AND **finished commercial taste**.

```ts
export const HERA_AD_CANVAS_THEME = {
  // Alternating 4-cycle Dark <-> Light commercial heartbeat
  darkStageBg: "#0C0809",        // Warm obsidian stage (tint subtly toward derived brand hue)
  darkGlowTint: "#DC2626",       // Sweeping kinetic highlight sweep -> override with brand primary!
  darkTextPrimary: "#FAFAFA",
  darkTextMuted: "#A1A1AA",

  // Airy infinite dot-grid freeform artboard canvas
  canvasBg: "#F6F6F5",
  canvasDotColor: "rgba(17, 17, 20, 0.14)",
  canvasCardBg: "#FFFFFF",
  canvasBorder: "rgba(17, 17, 20, 0.09)",

  // Generation ripple & active artboard frame -> override with derived brand accent
  activeAccent: "#2563EB",
  rippleTint: "rgba(37, 99, 235, 0.22)",
  cursorPillBg: "#111114",
  cursorPillInk: "#FFFFFF",
};
```

- **Typography Pairing**: Geometric `Inter` (600–800, `-0.04em`) for bold dark interstitial claims & prompt UI + bespoke brand display font inside generated ad artboards + `JetBrains Mono` for aspect ratio pills (`16:9`, `1:1`, `4:5`, `9:16`) and URL tokens.
- **Surface Rhythm (4-Cycle Dark ↔ Light Heartbeat)**: Spend `~54%` on dark editorial interstitials + full-bleed commercial ad showcases (Z-depth ad cloud, midpoint multi-angle ad wall, climax panorama sweep) and `~46%` on crisp `#F6F6F5` infinite dot-grid canvas demos (never exceeding `6.75s` continuously on light canvas without a `1.0–2.25s` dark reset).
- **Signature Visual Grammar**:
  - **Zero Node Wires**: Parallel prompts spawn mixed-aspect artboards (`16:9`, `1:1`, `4:5`, `9:16`) across an open dot-grid via dark-pill agent cursors + localized radial dot-grid ripples.
  - **Visual Brand Intelligence**: URL-to-Brand-Kit 4-quadrant radial bloom (`Logo · Colors · Type · Starter Set`) + layout-preserving in-place reference-ad transmutation.
  - **Output Inside the Tool → Full-Bleed Payoff**: Side-by-side static→motion split on the dot-grid, zooming seamlessly via `<SpatialCameraRig>` onto the live artboard until it fills `1920×1080` (or punching into a dark multi-aspect Canvas Panorama Masonry Sweep).
  - **Mandatory X Upgrades**: Canvas must be alive at `frame = 0` (never a `0.5s` black fade-in), and end on a crisp `2.5–3.0s` brand lockup + CTA URL hold (never a `3.5s` empty fade-to-black tail).

---

## 9. `architectural-archive` (Sharp `0px` Swiss Viewfinder Grid — What Ships Grammar)

Inspired by modern technical-archive & Swiss editorial launches (`whatships.com`, Dieter Rams / editorial index design). Stands sharply apart from rounded SaaS pills by committing 100% to **`0px` razor corners**, **`1px` structural grid lines**, **L-shaped viewfinder corner brackets**, **`+` grid intersection crosshairs**, and **zero-padded monospace counters (`0001 / 3326`)**.

```ts
export const ARCHITECTURAL_ARCHIVE_THEME = {
  // Light polarity (default unless dark mode explicitly requested)
  lightBg: "#FAFAFA",
  lightSurface: "#FFFFFF",
  lightGridLine: "#E4E4E7",
  lightBracket: "#52525B",
  lightInk: "#09090B",
  lightMuted: "#52525B",

  // Optional dark chapter inversion (pure Zinc monochrome)
  darkBg: "#09090B",
  darkSurface: "#18181B",
  darkGridLine: "#27272A",
  darkBracket: "#D4D4D8",
  darkInk: "#FAFAFA",
  darkMuted: "#A1A1AA",

  // Zero decorative gradients — crisp single focus ring / brand accent only
  accent: "#4F7BFF",              // Override with derived brand primary (or pure ink)
  radius: 0,                      // Strictly 0px square corners everywhere
};
```

- **Typography Pairing**: Geometric Sans (`Inter` / `Geist`, 600–700, `-0.04em`) for stark kinetic headlines + **`JetBrains Mono` / `IBM Plex Mono`** (500, uppercase, `+0.06em` tracking, strict `tabular-nums`) for hairline key/value spec rows, index counters (`0001 / 0005`), and timestamps.
- **Signature Visual Grammar**:
  - Mount focal demos inside `<ViewfinderFrame />` with L-shaped corner reticles and hairline metadata bars instead of macOS traffic-light windows.
  - Pair stark off-white kinetic type slates with `<RollingOdometer />` counters and crisp `40ms` staggered structural reveals (`taut-mechanical` temperament).
  - Zero decorative gradients, zero rounded bubbles, zero background glow orbs.

---

## Universal Anti-Cliché Checklist (Applies to ALL Presets)

Never generate these telltale "AI template" artifacts:
1. **Unloaded system fonts** (declaring `'Inter'` without loading it so headless Chromium falls back to Segoe UI / DejaVu Sans).
2. **Cloned reference colors/props** (defaulting to Fuser pink `#EC4899` borders or `#F97316` cursors on unrelated products).
3. **Floating decorative 3D primitives** (spinning wireframe toruses, random octahedrons) behind 2D SaaS UI.
4. **Blurred circular background glows / radial ambient orbs** (`radial-gradient` haze circles, `filter: blur(...)` colored backdrop blobs), neon purple-to-cyan rainbow gradient headlines, or heavy glowing outer drop shadows.
5. **Defaulting to dark themes** when the user did not explicitly request dark mode — always lead with crisp `#FFFFFF` / `#F7F7F5` light gallery polarity.
6. **Fake static KPI bar charts, gray skeleton-loader bars, or washed-out white-on-white code windows** — when showing a code editor or devtool on a light cyclorama, stage it inside **Dark-Mode macOS chrome (`#0D0D10`)** with **real multi-token syntax highlighting**, **authentic official brand SVGs**, and **zero empty blank-gap diff holes** (`opacity: 0` lines leaving broken whitespace).
7. **Text-wall pitch decks / dense 30-line spec tables** — keep typographic beats to **2–5 words** with generous negative space, continuous living momentum (zero parked idle seconds), and one focal object per beat.
8. **Sparkle icons (`✨`)**, glitch RGB-split wipes, 3D cube-flip transitions, or muddy opacity crossfades.
