# Technique Playbook 1: `editorial-morph` — Continuous SVG Silhouette Morphing & Viscous Merging

> **Pure Technique Playbook (Brand-Agnostic):** This playbook governs **how to engineer continuous zero-hard-cut SVG morphs, smooth-min liquid merges, and tactile edge life in code**. It prescribes **ZERO default colors, ZERO default fonts, and ZERO fixed story beats**. Derive `CANVAS`, `PRIMARY_INK`, `ACCENT`, `MUTED`, and your `@remotion/google-fonts` pairing strictly from the user's brand in `DIRECTION.md` (never default to parchment/terracotta or `Instrument Serif` unless the brand calls for them).

> **Isolation Contract:** When `editorial-morph` is selected, load **ONLY** this playbook and its authorized primitives below. Never leak software UI chrome (`VisualWidgets.tsx`, terminals, NLE timelines, waveforms, or SaaS cards) into a pure silhouette morph film.

---

## 1. When to Choose This Technique

- **Best For:** Category-defining launches, conceptual AI/model stories, brand manifestos, creative skills/agents, or any narrative where **one living geometric form transforming continuously** communicates the product's thesis more memorably than literal UI boxes.
- **Core Motion Principle:** Object permanence taken to its purest form—no hard scene cuts, no slide swaps. Every beat evolves physically out of the previous silhouette.

---

## 2. Brand Token Slots (Fill From Stage 0 Brand Discovery)

Populate these 4 semantic slots from the user's workspace/brand (or invent a bespoke domain-native palette in `DIRECTION.md`—light, dark, warm, cool, or chromatic):

| Semantic Slot | Token | Discipline Rule |
| :--- | :--- | :--- |
| **Primary Canvas** | `CANVAS` | Pure matte surface occupying `70–85%` of the frame at all times. Zero muddy radial glow orbs or generic neon gradients. |
| **Primary Form / Ink** | `PRIMARY_INK` | High-contrast hero SVG silhouettes, liquid metaball mass, and display typography (`>= 7:1` contrast against `CANVAS`). |
| **Focal Accent** | `ACCENT` | Single disciplined brand accent (`5–12%` frame area: focal core, punctuation mark, or climax highlight). |
| **Secondary / Quiet Depth** | `MUTED` | Restrained micro-captions, registration hairlines, or velocity-coupled print echoes (`>= 4.5:1` for readable text). |
| **Polarity Inversion (Optional)** | `INVERTED_CANVAS` | Optional finale polarity flip (`PRIMARY_INK` ↔ `CANVAS`) entered **strictly via a continuous liquid metaball flood**, never a hard cut. |

---

## 3. Typography Engineering (Zero Fallback Fonts)

Load the brand's chosen display + body/mono faces deterministically via **`@remotion/google-fonts`** at module scope (exact family derived in `DIRECTION.md`—serif, grotesk, geometric sans, or editorial display):

```tsx
// Replace with the exact @remotion/google-fonts families chosen in DIRECTION.md
import { loadFont as loadDisplay } from "@remotion/google-fonts/<BrandDisplayFont>";
import { loadFont as loadSupport } from "@remotion/google-fonts/<BrandSupportFont>";

const { fontFamily: DISPLAY } = loadDisplay("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});
const { fontFamily: SUPPORT } = loadSupport("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});
```

- **Optical Scale & Legibility:** Hero display at `84–136px` (`1920×1080`), tight editorial tracking, optically flat and razor-sharp (`0px` blur, no forced 2.5D tilt). Supporting captions `>= 24–28px` so they survive `360px` mobile feeds.
- **Copy Restraint:** Keep copy beats sparse (`<= 4 words/beat`, ideally `3–4` total beats across a 15–25s film). Never stack paragraphs, bullet lists, or callout boxes.
- **Fixed-Height Baseline Clip-Masking:** Reveal and exit type inside `overflow: "hidden"` baseline clip boxes using `EASE_OUT_EXPO` / `EASE_IN_OUT_QUINT` (never bouncy SaaS springs). **Never return `null` on a line's exit** inside a vertical stack—use `visibility: "hidden"` so sibling lines never collapse or jump vertically.

---

## 4. Motion Engineering & Continuous Morph Craft

### The Zero Hard Cuts Law
From `frame = 0` to the final hold, carry **one unbroken living form** across the canvas:

1. **Phase-Aligned Continuous Silhouette Morphing (`MorphingShape`):**
   - Author 4–6 closed SVG cubic-Bézier keyframes (`M ... C ... Z`) driven by `interpolatePaths` inside [`MorphingShape.tsx`](../templates/primitives/MorphingShape.tsx).
   - **Zero-Twist Parameterization Rule:** Give every keyframe the **same winding direction (clockwise)**, the **same starting angular anchor (e.g., 12 o'clock `-π/2`)**, and matching segment density (e.g., 24–32 Catmull-Rom-to-cubic-Bézier segments) so intermediate frames morph like liquid silk without vertex inversions or self-intersections.
   - Invent silhouettes native to *this* product's real story—never recycle generic clipart or previous films' shapes.
2. **Smooth-Min Viscous Merging & Polarity Floods (`LiquidMetaballStage`):**
   - Use [`LiquidMetaballStage.tsx`](../templates/primitives/LiquidMetaballStage.tsx) (`feGaussianBlur` + `feColorMatrix` alpha thresholding) whenever discrete particles coalesce into a unified form, split apart organically, or flood the viewport into a seamless polarity inversion.
   - Balance `blurStdDeviation` (`10–18`) with crisp `alphaGain` (`18–26`) and `alphaOffset` (`-9` to `-11`) so edges stay razor-crisp and viscous rather than foggy.
3. **12fps Tactile Edge Life & Surface Grain (`OrganicBoilFilter`):**
   - Wrap SVG artwork in [`OrganicBoilFilter.tsx`](../templates/primitives/OrganicBoilFilter.tsx) (`boilFps={12}`, subtle `displacementScale={1.2–2.4}`, `grainOpacity={0.03–0.055}`) so calm reading holds stay physically alive and H.264 gradients/solids resist banding.
   - Keep display typography crisp outside the displacement filter so letterforms stay sharp.
4. **Rhythm & Scale Contrast (`15–30s`):**
   - **Frame 0 Mid-Action:** Open already breathing/moving—never fade from black.
   - **Accordion Pacing:** Alternate brisk, decisive morphs (`0.4s–0.9s` with `EASE_IN_OUT_QUINT` / `EASE_OUT_EXPO`) with calm, readable living holds (`1.2s–2.4s`).
   - **Scale Drama:** Contrast intimate, spacious framing (`0.8×` with `80%+` negative space) against bold asymmetric expansion (`1.3×–1.8×`) on the climax beat.
   - **Unhurried Brand Coda:** Resolve cleanly into the brand mark + clear CTA/identifier held solid for `2.5–4.0s` while subtle 12fps surface texture keeps the frame alive.

---

## 5. Authorized Primitives & Exact Imports

- [`../templates/primitives/MorphingShape.tsx`](../templates/primitives/MorphingShape.tsx) — Continuous `interpolatePaths` SVG silhouette morphing.
- [`../templates/primitives/OrganicBoilFilter.tsx`](../templates/primitives/OrganicBoilFilter.tsx) — Deterministic 12fps SVG turbulence edge boil + surface grain overlay.
- [`../templates/primitives/LiquidMetaballStage.tsx`](../templates/primitives/LiquidMetaballStage.tsx) — Smooth-min SVG gooey merging, splitting, and seamless polarity floods.
- [`../templates/motion.ts`](../templates/motion.ts) — FPS-agnostic timing (`sec`, `durSec`, `createBeatGrid`) and canonical easings (`EASE_OUT_EXPO`, `EASE_IN_OUT_QUINT`, `SPRING_SMOOTH`).

```tsx
import {
  MorphingShape,
  OrganicBoilFilter,
  LiquidMetaballStage,
} from "../templates/primitives";
import { EASE_OUT_EXPO, EASE_IN_OUT_QUINT, sec } from "../templates/motion";
```

---

## 6. Audio Discipline (Tactile Minimalism)

- Generate offline DSP SFX via [`../scripts/generate-dsp-sfx.mjs`](../scripts/generate-dsp-sfx.mjs) and master to `-14 LUFS` via [`../scripts/master-audio.mjs`](../scripts/master-audio.mjs) (or sync a user-supplied BYO `.mp3` via [`../scripts/analyze-music.mjs`](../scripts/analyze-music.mjs)).
- Sync sparse, physical transients within `±1 frame` of morph inflection points: swept pink-noise air whooshes on expansions, muted sub-thuds on liquid merges/floods, and a warm felt-marimba resolve on the coda.
- Ban UI keyboard clacks, robotic sci-fi beeps, and code-generated synth loops.

---

## 7. Explicit Ban List (Zero Cross-Contamination)

An `editorial-morph` film is **IMMEDIATELY REJECTED (`BLOCK`)** if ANY of the following appear:

- **Banned UI / SaaS Leakage:** Terminal windows, NLE video timelines, playheads, audio waveforms, mock browser chrome, macOS traffic lights, chat prompt inputs, KPI dashboards, rounded-corner SaaS cards, progress bars, or mouse cursors.
- **Banned Cross-Technique Leakage:** `PaperCutoutLayer` stepped stop-motion drop-shadow stacks or `CameraTrackedStroke` mechanical drafting-world nib chases.
- **Banned Visual & Structural Slop:** Hard scene cuts between disconnected layouts, radial glow orbs, 2.5D tilted flat text, DOM-collapsing clip exits that shift adjacent lines, fallback system fonts, or unmotivated recycled brand costumes.

---

## 8. Technique-Specific Pre-Export Review Gates

Verify every frame from [`../scripts/qa-frames.mjs`](../scripts/qa-frames.mjs) against [`../references/review-gates.md`](../references/review-gates.md) PLUS these gates:

| Gate | Pass Criteria | `BLOCK` Trigger |
| :--- | :--- | :--- |
| **EM-1 (Zero Hard Cuts)** | Every transition flows continuously via `MorphingShape` or `LiquidMetaballStage`. | Any abrupt `<Sequence>` jump cut swapping to an unrelated layout. |
| **EM-2 (Brand-Derived Space & Contrast)** | Brand-derived `CANVAS` holds `70–85%` uncluttered negative space; contrast `>= 7:1` on primary copy. | Unmotivated recycled palette costume, neon washes, or cluttered frames (`< 65%` space). |
| **EM-3 (Copy Restraint & Clean Clips)** | Sparse beats (`<= 4 words/beat`), verified `@remotion/google-fonts`, zero line-jump clip exits. | Prose walls, unloaded fallback fonts, or height-collapsing exit jumps. |
| **EM-4 (Zero UI Leakage)** | 100% pure abstract SVG silhouettes, liquid merges, and crisp editorial type. | Any UI card, terminal, waveform, timeline, progress bar, or browser chrome. |
| **EM-5 (12fps Tactile Life)** | Subtle 12fps `OrganicBoilFilter` keeps artwork alive during holds without distorting type. | Sterile flat stillness or excessive boil (`displacementScale > 4`) wobbling text. |
