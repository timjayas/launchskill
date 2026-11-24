# Technique Playbook 3: `paper-cutout` — Decoupled 12fps/30fps Tactile Cutout Parallax

> **Pure Technique Playbook (Brand-Agnostic):** This playbook governs **how to engineer decoupled `12fps` stepped stop-motion object physics riding inside a smooth `30fps` multi-plane rostrum parallax camera with hard directional shadows**. It prescribes **ZERO default colors, ZERO default fonts, and ZERO fixed story beats**. Derive all matte surface colors and `@remotion/google-fonts` typography strictly from the user's brand in `DIRECTION.md`.

> **Isolation Contract:** When `paper-cutout` is selected, load **ONLY** this playbook and its authorized primitives below. Never load `VisualWidgets.tsx`, `StudioPrimitives.tsx`, `CameraTrackedStroke.tsx`, or `LiquidMetaballStage.tsx`.

---

## 1. When to Choose This Technique

- **Best For:** Craft-forward consumer launches, storytelling/publishing platforms, creative tools, physical/editorial brands, or playful-yet-sophisticated drops where **physical multi-plane materiality and bold graphic silhouettes** stop the scroll against cold glass feeds.
- **Core Motion Principle:** Decouple **object physics (`12fps` stepped on-twos)** from **camera optics (`30fps` silky multi-plane parallax)** so shapes feel physically cut and placed on an overhead animation stand.

---

## 2. Brand Materiality Slots (Fill From Stage 0 Brand Discovery)

Translate the user's real brand palette into **matte, flat-dyed tactile surface tokens** (never translucent SaaS glass, never neon glows):

| Semantic Slot | Token | Material Rule |
| :--- | :--- | :--- |
| **Base Board (`Z = 0`)** | `BOARD_BASE` | Uncoated matte stage floor derived from the brand's background polarity (light, dark, warm, or deeply dyed). |
| **Primary Graphic Stock** | `PRIMARY_CUTOUT` | High-contrast hero silhouette & display typography stock (`>= 7:1` against `BOARD_BASE`). |
| **Primary Brand Accent Stock** | `ACCENT_PRIMARY` | The product's signature brand hue rendered as rich matte pigment stock (zero CSS gradients). |
| **Optional Supporting Stock(s)** | `ACCENT_SECONDARY` | At most 1–2 restrained complementary matte tones derived from the brand system. |
| **Hard Directional Shadow** | `DIRECTIONAL_SHADOW` | Crisp offset shadow (`offsetX: 6–14px`, `offsetY: 8–18px`, tight `blur: 0–4px`) scaling proportionally with `parallaxDepth` to simulate a real overhead rostrum lamp. |

- **Cut-Edge Craft:** Add an optional subtle `1–1.5px` lamp-facing rim highlight and crisp silhouette geometry so every layer reads as physical thickness rather than a flat digital div.

---

## 3. Typography Engineering (Bold Graphic Display — Zero Fallback Fonts)

Load the brand's expressive display + supporting faces via **`@remotion/google-fonts`** at module scope (zero system fallbacks):

```tsx
// Replace with the exact @remotion/google-fonts families derived in DIRECTION.md
import { loadFont as loadDisplay } from "@remotion/google-fonts/<BrandDisplayFont>";
import { loadFont as loadSupport } from "@remotion/google-fonts/<BrandSupportFont>";

const { fontFamily: DISPLAY } = loadDisplay("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});
const { fontFamily: SUPPORT } = loadSupport("normal", {
  weights: ["500", "600"],
  subsets: ["latin"],
});
```

- **Poster-Scale Physical Type (`88–150px`):** Treat headlines as physical cut-out shapes or stamped letterpress strips (`<= 4 words/beat`, unmistakable at `360px` mobile width).
- **On-Twos Placement:** Animate text entrances on the **stepped `12fps` clock** (3–4 crisp tactile poses, slight `±1°–1.5°` hand-placed rotation settle) so typography obeys the exact same physical world as the cutouts.

---

## 4. Motion Engineering: The Decoupled `12fps` / `30fps` Rostrum Camera Law

1. **Stepped `12fps` Object Physics (`objectFps = 12`):**
   - Inside [`PaperCutoutLayer.tsx`](../templates/primitives/PaperCutoutLayer.tsx), every cutout's local position, rotation, scale, and shape swap evaluates on the stepped 12fps clock (`Math.floor(frame / Math.max(1, Math.round(fps / 12)))`).
   - Objects snap into place in 4–6 crisp stop-motion increments—never smooth 60fps CSS easing!
2. **Smooth `30fps` Multi-Plane Rostrum Camera (`cameraX`, `cameraY`, `cameraScale`, `parallaxDepth`):**
   - While cutouts step at 12fps, the virtual overhead camera glides smoothly at native `30fps` across **3–4 distinct Z-planes**:
     - **Plane 0 (`parallaxDepth: 0.2`):** Stage floor & broad background silhouettes (tight shadow `4px`).
     - **Plane 1 (`parallaxDepth: 0.6`):** Midground graphic bands & secondary forms (medium shadow `8–10px`).
     - **Plane 2 (`parallaxDepth: 1.0`):** Hero cutout subject & display headlines (deep shadow `12–16px`).
     - **Plane 3 (`parallaxDepth: 1.4`):** Foreground framing silhouettes sweeping past the lens for physical depth parallax.
3. **Stepped Silhouette Swaps (`MorphingShape`) & Surface Tooth (`OrganicBoilFilter`):**
   - Drive [`MorphingShape.tsx`](../templates/primitives/MorphingShape.tsx) with the **stepped 12fps `frame` prop** for tactile stop-motion replacement-animation shifts between crisp geometric forms.
   - Apply a light [`OrganicBoilFilter.tsx`](../templates/primitives/OrganicBoilFilter.tsx) (`boilFps={12}`, low `displacementScale={0.4–1.0}`, `grainOpacity={0.04–0.07}`) for real matte fiber texture.
4. **Physical Collage Transitions (Zero Digital Crossfades):**
   - Transition between acts by **sliding a full-bleed matte sheet** across the frame at 12fps, **hinging/folding a flap**, or **pushing the smooth 30fps camera straight through a cut aperture** into the next plane.

---

## 5. Authorized Primitives & Exact Imports

- [`../templates/primitives/PaperCutoutLayer.tsx`](../templates/primitives/PaperCutoutLayer.tsx) — Decoupled 12fps stepped object motion (`objectFps={12}`) riding inside a smooth 30fps parallax plane with rim & hard directional shadows.
- [`../templates/primitives/OrganicBoilFilter.tsx`](../templates/primitives/OrganicBoilFilter.tsx) — Tactile surface fiber grain & subtle 12fps cut-edge life.
- [`../templates/primitives/MorphingShape.tsx`](../templates/primitives/MorphingShape.tsx) — Stepped silhouette shifts (pass the stepped 12fps frame via `frame` prop).
- [`../templates/motion.ts`](../templates/motion.ts) — FPS-agnostic timing (`sec`, `durSec`, `createBeatGrid`) and smooth camera easings.

```tsx
import {
  PaperCutoutLayer,
  OrganicBoilFilter,
  MorphingShape,
} from "../templates/primitives";
import { EASE_OUT_EXPO, EASE_IN_OUT_QUINT, sec } from "../templates/motion";
```

---

## 6. Audio Discipline (Tactile Craft Foley)

- Synthesize offline DSP SFX via [`../scripts/generate-dsp-sfx.mjs`](../scripts/generate-dsp-sfx.mjs) and master to `-14 LUFS` via [`../scripts/master-audio.mjs`](../scripts/master-audio.mjs) (or sync a user-supplied BYO `.mp3` via [`../scripts/analyze-music.mjs`](../scripts/analyze-music.mjs)).
- Sync crisp **dry tactile snaps/clicks** to 12fps placements, **textured air sweeps** to sliding sheet wipes, and a **warm percussive resolve** on the finale stamp.

---

## 7. Explicit Ban List (Zero Cross-Contamination)

A `paper-cutout` film is **IMMEDIATELY REJECTED (`BLOCK`)** if ANY of the following appear:

- **Banned Digital/SaaS Tropes:** Glassmorphism (`backdrop-filter: blur`), soft diffuse SaaS elevation shadows, neon glows, radial-gradient orbs, UI windows/frames, mock browsers, terminals, code editors, chat prompts, KPI charts, or rounded SaaS cards pretending to be cutouts.
- **Banned Motion Cheats:** Smooth 30fps/60fps interpolated objects pretending to be stop-motion (objects MUST step on `objectFps={12}` while only the camera/parallax glides smoothly at `30fps`!).
- **Banned Cross-Technique Leakage:** Gooey `LiquidMetaballStage` ink merges or unbroken `CameraTrackedStroke` pen chases.
- **Banned Layout Slop:** Flat single-plane graphics with zero parallax depth, washed-out shadows, unloaded fallback fonts, or unmotivated recycled palettes.

---

## 8. Technique-Specific Pre-Export Review Gates

Verify every rendered frame from [`../scripts/qa-frames.mjs`](../scripts/qa-frames.mjs) against [`../references/review-gates.md`](../references/review-gates.md) PLUS these gates:

| Gate | Pass Criteria | `BLOCK` Trigger |
| :--- | :--- | :--- |
| **PC-1 (Decoupled 12fps / 30fps Physics)** | Cutouts step crisply at `12fps` (`PaperCutoutLayer`) while camera pan/zoom/parallax glides smoothly at `30fps`. | Smooth 30fps/60fps digital object sliding, or jittery stepped camera pans. |
| **PC-2 (Hard Directional Shadows)** | Every elevated layer casts a crisp directional shadow (`blur <= 4px`, offset scaling with `parallaxDepth`). | Soft diffuse SaaS box-shadows, glassmorphism, or flat shadowless shapes. |
| **PC-3 (Multi-Plane Depth)** | Visible parallax separation across `>= 3` depth planes (`parallaxDepth` spread from `0.2` to `1.4`). | Flat 1-plane collage with zero camera parallax depth. |
| **PC-4 (Brand-Derived Matte System & Type)** | Brand-derived matte pigment tones + verified `@remotion/google-fonts` display face, `<= 4 words/beat`. | Neon gradients, dark SaaS glow aesthetic, unmotivated costume palette, or fallback fonts. |
| **PC-5 (Zero UI / Cross-Technique Leakage)** | 100% physical cutout craft; zero software chrome, liquid metaballs, or single-line chase paths. | Any browser/terminal window, UI widget card, or metaball ink blob. |
