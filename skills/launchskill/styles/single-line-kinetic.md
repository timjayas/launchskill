# Technique Playbook 2: `single-line-kinetic` — Continuous Camera-Tracked Vector Drawing

> **Pure Technique Playbook (Brand-Agnostic):** This playbook governs **how to engineer an unbroken world-space SVG drawing chased by a damped dynamic camera with one climax colour-flood downbeat**. It prescribes **ZERO default colors, ZERO default fonts, and ZERO fixed story beats**. Derive `CANVAS`, `STROKE_INK`, `MUTED_INK`, `FLOOD_ACCENT`, and your `@remotion/google-fonts` pairing strictly from the user's brand in `DIRECTION.md`.

> **Isolation Contract:** When `single-line-kinetic` is selected, load **ONLY** this playbook and its authorized primitives below. Never load `VisualWidgets.tsx`, `StudioPrimitives.tsx`, `LiquidMetaballStage.tsx`, or `PaperCutoutLayer.tsx`.

---

## 1. When to Choose This Technique

- **Best For:** Workflows, design/creative tools, systems architecture, reasoning chains, lineage explainers, or any product story built around **connection, continuity, and unfolding logic** where one unbroken vector thread guides the viewer's eye from opening to finale.
- **Core Motion Principle:** The live drawing tip IS the protagonist; the virtual camera rides behind it across an oversized `2×–3×` world canvas, shifting between tight macro tracking and wide architectural reveals.

---

## 2. Brand Token Slots & The Single Colour-Flood Downbeat

Derive these 4 semantic slots from the user's brand in `DIRECTION.md` (light-on-dark, dark-on-light, or colored ground—whatever fits the brand):

| Semantic Slot | Token | Usage Rule |
| :--- | :--- | :--- |
| **World Canvas** | `CANVAS` | Oversized `2×–3×` world canvas (`3840×2160` to `5760×3240`). Clean matte ground—zero wireframe CAD grid wallpaper or radial glow orbs. |
| **Continuous Stroke** | `STROKE_INK` | The single unbroken SVG vector stroke (`strokeWidth: 3.5–6px` in world coordinates, round caps/joins, `>= 7:1` contrast vs. `CANVAS`). |
| **Secondary Annotation** | `MUTED_INK` | Quiet guide rails, coordinate ticks, or secondary geometric echoes directly birthed by the line. |
| **Single Climax Flood** | `FLOOD_ACCENT` | Brand hero accent hue (or high-contrast polarity inversion) reserved **strictly for the ONE colour-flood downbeat**. |

### The "Exactly ONE Colour-Flood Downbeat" Law
- Through Acts 1 & 2, build visual tension purely through **line velocity, curvature, and camera scale** in your primary two-tone pairing (`CANVAS` + `STROKE_INK`).
- On the **climax beat**—the exact frame where the continuous stroke closes a geometric form, encircles the hero motif, or snaps taut across the horizon—trigger **EXACTLY ONE full-bleed colour flood** (`FLOOD_ACCENT`) flipping stroke/type polarity for maximum visual release.
- Never repeat competing colour floods; one decisive inversion lands hardest.

---

## 3. Typography Engineering (Trajectory-Integrated, Zero Fallback Fonts)

Load the brand's display + supporting faces via **`@remotion/google-fonts`** at module scope (zero system fallbacks):

```tsx
// Replace with the exact @remotion/google-fonts families derived in DIRECTION.md
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

- **Trajectory-Integrated Placement:** Place words (`<= 4 words/beat`, average `1–3 words`) **in world-space directly alongside the stroke's live trajectory** so the camera discovers each phrase as the drawing tip sweeps past its `(x, y)` anchor (`160–240ms` `EASE_OUT_EXPO` baseline unmasking).
- Never slap disconnected centred slide-deck headers over an unrelated line.

---

## 4. Motion Engineering & Camera-Tracked Line Choreography

1. **One Unbroken World-Space Path (`CameraTrackedStroke`):**
   - Author a single continuous SVG `d` path across a `2×–3×` world canvas inside [`CameraTrackedStroke.tsx`](../templates/primitives/CameraTrackedStroke.tsx).
   - Drive `evolvePath`, `getLength`, and `getPointAtLength` deterministically via `useCurrentFrame()`. Tune `followStrength` and `cameraDamping` for weighted cameraman inertia, and animate `zoom` dynamically (`1.8×–2.6×` macro tip chase ↔ `0.65×–1.0×` wide architectural pull-out).
   - **Everything grows from the line:** Any enclosed icon, horizon, loop, or finale mark must be physically drawn by the stroke (or refined out of its closed contour via [`MorphingShape.tsx`](../templates/primitives/MorphingShape.tsx)).
2. **Velocity & Curvature Contrast (Zero Metronomic Drawing):**
   - Never evolve the entire path at one constant linear speed.
   - Modulate progress with piecewise S-curves (`EASE_IN_OUT_QUINT` / `EASE_OUT_EXPO`): whip fast along straight connecting leads (`200–320ms`), decelerate deliberately around tight narrative turns (`600–900ms`) where world-space words unlock, and hold briefly (`0.4–0.6s` with subtle camera drift) at milestones.
3. **Optional Tactile Surface Texture (`OrganicBoilFilter`):**
   - Apply a light [`OrganicBoilFilter.tsx`](../templates/primitives/OrganicBoilFilter.tsx) (`boilFps={12}`, `displacementScale={0.6–1.4}`, `grainOpacity={0.025–0.04}`) when the brand benefits from tactile pen/print life (or `displacementScale={0}` with subtle grain for ultra-crisp technical brands).
4. **Structural Arc (`15–30s`):**
   - **Opening (`0–2s`):** Open at `frame = 0` with the stroke already `8–12%` evolved and moving decisively under `2.0×+` zoom; first world-space word unlocks beside the curve.
   - **Middle Journey:** Follow the unbroken line through 2–3 product-native geometric story beats, alternating tight macro tracking with a breathing wide pull-out.
   - **Climax Flood:** On the closing beat, trigger the single full-bleed `FLOOD_ACCENT` expansion while pulling back to `1.0×` to reveal the complete drawn structure in inverted contrast.
   - **Coda Hold (`2.2–3.0s`):** Resolve cleanly into the brand mark + clear CTA/identifier.

---

## 5. Authorized Primitives & Exact Imports

- [`../templates/primitives/CameraTrackedStroke.tsx`](../templates/primitives/CameraTrackedStroke.tsx) — Unbroken `evolvePath` + `getPointAtLength` engine with damped camera tracking, dynamic zoom, optional nib, and world-space `children`.
- [`../templates/primitives/OrganicBoilFilter.tsx`](../templates/primitives/OrganicBoilFilter.tsx) — Optional subtle 12fps edge texture and anti-banding grain.
- [`../templates/primitives/MorphingShape.tsx`](../templates/primitives/MorphingShape.tsx) — Optional closed-contour refinement once the continuous stroke closes into the finale mark.
- [`../templates/motion.ts`](../templates/motion.ts) — FPS-agnostic timing (`sec`, `durSec`, `createBeatGrid`) and canonical easing curves.

```tsx
import {
  CameraTrackedStroke,
  OrganicBoilFilter,
  MorphingShape,
} from "../templates/primitives";
import { EASE_OUT_EXPO, EASE_IN_OUT_QUINT, sec } from "../templates/motion";
```

---

## 6. Audio Discipline (Kinetic Line Foley)

- Synthesize offline DSP SFX via [`../scripts/generate-dsp-sfx.mjs`](../scripts/generate-dsp-sfx.mjs) and master to `-14 LUFS` via [`../scripts/master-audio.mjs`](../scripts/master-audio.mjs) (or sync a user-supplied BYO `.mp3` via [`../scripts/analyze-music.mjs`](../scripts/analyze-music.mjs)).
- Sync crisp **air-whoosh sweeps** to high-velocity straightaways, subtle **tactile ticks** when the nib passes a world-space word anchor, and **one decisive sub-bass drop + warm resolve** locked within `±1 frame` of the colour-flood downbeat.

---

## 7. Explicit Ban List (Zero Cross-Contamination)

A `single-line-kinetic` film is **IMMEDIATELY REJECTED (`BLOCK`)** if ANY of the following appear:

- **Banned UI / SaaS Leakage:** Multi-card UI grids, dashboard widgets, mock browser/macOS windows, terminal bars, chat prompt inputs, KPI charts, code editors, progress bars, or rounded-corner SaaS cards.
- **Banned Continuity Breakers:** Hard slide-deck cuts, disconnected shape swaps that do NOT grow out of the continuous line, or dangling decorative lines floating unconnected to the hero path.
- **Banned Cross-Technique Leakage:** Gooey `LiquidMetaballStage` blobs or stepped `PaperCutoutLayer` drop-shadow stacks.
- **Banned Pacing/Visual Slop:** Constant linear stroke velocity, static `1.0×` locked camera, `> 1` colour-flood polarity flips, `> 4 words/beat` prose blocks, or unmotivated recycled brand costumes.

---

## 8. Technique-Specific Pre-Export Review Gates

Verify every rendered frame from [`../scripts/qa-frames.mjs`](../scripts/qa-frames.mjs) against [`../references/review-gates.md`](../references/review-gates.md) PLUS these gates:

| Gate | Pass Criteria | `BLOCK` Trigger |
| :--- | :--- | :--- |
| **SL-1 (Unbroken Single Line)** | One continuous path evolves via `CameraTrackedStroke` across a `2×–3×` world canvas; all motifs grow directly from it. | Disconnected shape swaps, hard slide cuts, or broken orphan paths. |
| **SL-2 (Active Camera Follow & Scale Shift)** | Camera tracks the live drawing tip and shifts scale (`>= 1.6×` macro chase ↔ wide reveal) with non-linear velocity contrast. | Static `1.0×` flat frame or constant linear drawing speed. |
| **SL-3 (Exactly ONE Colour-Flood Downbeat)** | Two-tone discipline until **one** decisive full-bleed `FLOOD_ACCENT` flood on the climax closure beat. | Zero colour climax OR 2+ competing colour floods. |
| **SL-4 (Trajectory-Anchored Copy)** | `<= 4 words/beat` placed in world-space beside the line's path in verified `@remotion/google-fonts`. | Generic centred slide headers, long sentences, or system fallback fonts. |
| **SL-5 (Zero UI / Cross-Technique Leakage)** | Pure single-line vector craft only. | Any UI card grid, dashboard widget, liquid metaball blob, or paper-cutout shadow stack. |
