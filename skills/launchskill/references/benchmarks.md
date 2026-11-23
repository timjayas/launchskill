# Quantitative Motion-Design Benchmarks & 10 Signature Patterns

Empirical motion telemetry and visual choreography recipes distilled from 10 handpicked pure motion-design launch films (analyzed via FFmpeg `64×36` RGB24 frame-delta streaming and `0.5s` contact sheets).

---

## 1. Empirical Telemetry Across the 10 Reference Films

| # | Reference Film | Resolution | Duration | Hard Cuts | Median Shot | Luminance Range | Polarity Split (`Light / Dark / Chromatic`) | Primary Motion Paradigm |
| :-: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | **Paper (`paper-rich-text`)** | `1080×1080` | `45.03s` | `8` | `3.87s` *(min `0.97s`)* | `0.666` | `63% / 25% / 13%` | In-place live font-family morphing + multi-cursor bounding-box swarm |
| **2** | **Mimon (`launch-video-skill`)** | `1920×1080` | `53.83s` | `1` *(continuous)* | Continuous morph | `0.058` *(paper `#F8F8F7`)* | `100% / 0% / 0%` | `0:00–0:11` single green pixel → mosaic wall → ray-connected node cloud → pixel logo |
| **3** | **Interface Lineage (`interface-lineage`)** | `1280×720` | `61.80s` | `1` *(continuous)* | Continuous morph | `0.796` | `72% / 28% / 0%` | `0:00–0:14` `1px` hairline pill → ink-drop ripples → elastic catenary curve → archival dark flip |
| **4** | **Glisse (`glisse`)** | `1600×900` | `20.30s` | `1` *(continuous)* | Continuous stage | `0.340` | `0% / 0% / 100%` | Refractive frosted liquid-glass capsule + specular rim caustic sweep over moving silk ribbon |
| **5** | **Clanker UI (`clanker-ui`)** | `1280×720` | `14.87s` | `6` | `2.00s` *(min `0.97s`)* | `0.879` | `67% / 33% / 0%` | Segmented radial spinner → zero-chrome inline diff trace (`+18 −4`) → brisk beat-locked cuts |
| **6** | **Epstein.md / Shipper (`epstein-md`)** | `1920×1080` | `26.60s` | `5` | `3.23s` | `0.975` | `80% / 20% / 0%` | 2-word serif/sans hook → clean vertical phase dashboard with smooth inertial scroll & 1-click toggle |
| **7** | **Linearity AI (`linearity-ai`)** | `1920×1080` | `57.87s` | `9` | `3.27s` | `0.957` | `44% / 33% / 23%` | Inline vector-icon headline expansion → warm amber light-slit morph → 3D fanned campaign cards |
| **8** | **Graphical (`graphical`)** | `2560×1440` | `39.00s` | `2` | Continuous bento | `0.265` | `100% / 0% / 0%` | Playful multi-widget style-system bento grid + dark motion-curve & color-stop inspector drawer |
| **9** | **shadercn (`shadercn`)** | `1920×1080` | `15.07s` | `4` | `3.77s` | `0.076` *(obsidian `#050507`)* | `0% / 100% / 0%` | Pinpoint white dot → iridescent 3D orb overlapping type → 30-orb 3×10 grid → code + live orb split |
| **10** | **ImagineArt (`imagineart-pinterest`)** | `1920×1080` | `25.80s` | `9` | `3.07s` | `0.226` | `0% / 100% / 0%` | `0:00–0:20` zero-text guided feature proof: Z-depth photo cloud → prompt pill → `[Workflow] 🔗 [Pinterest]` badge snap → canvas zoom-out |

---

## 2. Five Hard Quantitative Laws Distilled From the Dataset

1. **Median Shot Duration & Accordion Rhythm (`0.97s` Bursts ↔ `3.07–3.87s` Hero Holds):**
   - Across multi-cut films (`paper-rich-text`, `clanker-ui`, `epstein-md`, `linearity-ai`, `shadercn`, `imagineart-pinterest`), the **global median shot duration is `3.25s`** (rapid sub-30s drops like `clanker-ui` run at **`2.00s` median** with **`0.97s` rapid-fire beat cuts**).
   - **Rule:** Never cut slower than `4.2s` without an internal spatial transformation, and pair `3.0–3.8s` hero demonstrations with `0.8–1.0s` rhythmic bursts.
2. **In-Place Continuous Morphing Beats Hard Slide Cuts:**
   - 40% of the top motion reels (`launch-video-skill`, `interface-lineage`, `glisse`, `graphical`) use **zero hard cuts** during their core 15–20s sequence—instead, a single central element physically transforms in place (pixel dot → mosaic grid → ray graph → logo; or `1px` pill → droplet ripple → catenary curve).
3. **High Luminance Polarity Dynamic Range (`median = 0.666`, top `0.88–0.97`):**
   - Films that transition between gallery paper (`#F8F8F7`, `lum ~0.88`) and obsidian/charcoal (`#090B10` / `#232220`, `lum ~0.07`) achieve a luminance range of **`0.66–0.97`**, preventing visual habituation on muted X feeds.
4. **Pinpoint-to-Field Scale Progression (`12px` Seed → Full-Screen Field in `1.5–3.0s`):**
   - Opening on a single concentrated focal point at `(960, 540)` (`10px` green pixel in `launch-video-skill`, `8px` white dot in `shadercn`, `24px` pixel cluster in `paper-rich-text`) and blooming radially into a full-viewport matrix or 30-item grid creates maximum pre-attentive scale contrast.
5. **Zero-Text Guided Choreography (`<= 4 Words/Beat`):**
   - Headline beats across all 10 films average **`2.8 words`** (`"Your ideas"`, `"Make it good"`, `"Building apps"`, `"33 orbs. One command."`). Workflows are explained via **cursor selection, badge-to-badge magnetic docking, and camera pull-backs**—never paragraphs.

---

## 3. Ten Signature Motion Patterns & Remotion Implementation Recipes

### Pattern 1: Creative Live-Font Morph + Multi-Cursor Selection Swarm (*Paper*)
- **Visual Mechanic:** A single large word/phrase (`140px`) sits on a warm `#E4E4E7` canvas while 3–4 named colored cursors (`#EF4444`, `#22C55E`, `#EC4899`) drag live bounding boxes around individual words. As each selection box locks, that word's typography morphs in-place across distinct visual voices (Geometric Sans → Calligraphic Script with visible SVG Bezier control handles → Pixel Grid Font → Heavy Italic) with `SPRING_SNAPPY`.

### Pattern 2: Procedural Pixel-Matrix Field & Ray-Graph Collapse (*Launch Video Skill `0:00–0:11`*)
- **Visual Mechanic (`0:00–0:11` Breakdown):**
  1. **`0:00–0:02` (Pinpoint Seed):** A single `12×12px` accent square (`#65A30D`) sits dead-center while blurred background copy racks into sharp focus (`filter: blur(10px) → blur(0px)`).
  2. **`0:02–0:05` (Radial Tile Matrix):** A `28×16` grid of `18×18px` neutral squares (`#D4D4D8` / `#E4E4E7`) ripples outward from the center seed inside a circular mask (`r: 0 → 980px`).
  3. **`0:05–0:08` (Cellular Scatter → Network Rays):** Grid tiles decimate to 15% density while `1px` straight SVG lines shoot outward from the central accent pixel to 16 orbiting accent nodes.
  4. **`0:08–0:11` (Magnetic Pixel Assembly):** All satellite pixel squares accelerate inward along the ray vectors (`EASE_IN_OUT_QUINT`) and snap into a quantized pixel-art brand mark (`>>`).

### Pattern 3: `1px` Single-Line Geometric Physics Metaphor (*Interface Lineage `0:00–0:14` & `0:35–0:50`*)
- **Visual Mechanic:**
  - **`0:00–0:14` (The Living Hairline):** A single `1.5px` charcoal stroke (`#18181B` on `#F7F7F5`) morphs continuously through 4 physical states without a single cut:
    1. *Pill Outline* (`width: 220, height: 52, borderRadius: 999`) containing a `14px` circle.
    2. *Gravity Drop & Concentric Ripples:* The circle drops `-140px` vertically like an ink droplet, spawning 3 expanding elliptical `1px` SVG rings (`rx: 20 → 240, ry: 6 → 48`).
    3. *Elastic Catenary Curve:* The rings flatten into a horizontal `1.5px` tightrope (`M 680 560 Q 960 ${560 + sag} 1240 560`) that bends downward (`sag: 0 → 44 → 0`) under the rolling circle.
    4. *Solid Bar Extrusion:* The line snaps taut and fills into a high-contrast black rectangle (`height: 1.5 → 48px`).
  - **`0:35–0:50` (Archival Dark Chapter & Timeline Lineage):** Hard polarity flip to `#1E1D1B` warm obsidian framing archival media inside a sharp `1px` border with centered serif captioning below.

### Pattern 4: Refractive Liquid Glass Capsule (*Glisse*)
- **Visual Mechanic:** Stage interactive controls inside a multi-layer translucent capsule over a moving diagonal chromatic ribbon:
  - Base fill: `rgba(255, 255, 255, 0.14)` with `backdropFilter: "blur(24px) saturate(180%)"`.
  - Specular caustic rim: `border: "1.5px solid rgba(255,255,255,0.42)"` + dual inset highlights (`boxShadow: "inset 0 2px 3px rgba(255,255,255,0.65), inset 0 -2px 6px rgba(59,130,246,0.35), 0 28px 64px rgba(8,14,38,0.42)"`).
  - As the cursor scrubs an internal slider, shift an internal diagonal glare gradient inversely to the knob position so the glass appears optically refractive.

### Pattern 5: Zero-Chrome Segmented Spinner → Inline Diff Trace (*Clanker UI*)
- **Visual Mechanic:** Skip heavy browser/window chrome entirely when demonstrating fast CLI/agent actions. Place an 8-segment rotating geometric ring directly on `#F9F9F9` paper next to a bold 3-word status (`"Waiting for you"`), then snap-expand vertically into a clean left-aligned action trace (`Edited src/policy.ts +18 −4` in emerald/coral mono tokens) with `2.0s` median shot cadence.

### Pattern 6: Two-Tone Word Hook → Smooth Inertial Phase Dashboard (*Epstein.md / Shipper*)
- **Visual Mechanic:** Open with a minimalist 2-word centered hook (`"Building apps"` with `"apps"` in emerald `#10B981`), cut to a serif+sans lockup (`"Shipper makes it"`), then glide vertically through a high-clarity phase checklist (`PHASE 1`, `PHASE 2`, `PHASE 3`) using `EASE_IN_OUT_QUINT` vertical camera scrolling and a 1-click green toggle confirmation.

### Pattern 7: Inline Icon-Slot Headline Expansion & Light-Slit Morph (*Linearity AI*)
- **Visual Mechanic:** On a `#050505` stage, split a 2-word headline (`"Graphic tools"`) apart horizontally while 4 crisp monochrome vector icons (`AI ✦ ∅ 🌀`) pop sequentially into the gap (`SPRING_POP`, `0.06s` stagger). Transition out by collapsing the typography into a glowing horizontal amber light slit (`width: 340, height: 28, borderRadius: 999, filter: blur(6px)`) that unfolds into 3D fanned campaign cards.

### Pattern 8: Playful Multi-Widget Style-System Bento + Live Inspector (*Graphical*)
- **Visual Mechanic:** Assemble 6 distinct visual-only design widgets in a `3×2` bento grid (typography weight specimen `Aa 123 #&!`, multi-stop color bar, `98%` area sparkline, circular progress badge), then slide a dark `#141416` inspector drawer in from the right edge where live green spring sliders scrub the bento widgets' corner radii and colors in real time.

### Pattern 9: Pinpoint-to-30-Orb Shader Grid & Split Code Proof (*shadercn*)
- **Visual Mechanic:**
  1. Start on `#050507` with a single `8px` white dot that blooms (`SPRING_POP`) into a `240px` iridescent shader sphere positioned **directly over the center letters** of `"Beautiful [ORB] shaders"`.
  2. Pull camera back (`scale: 2.4 → 1.0`) to reveal a **`10×3` grid of 30 distinct rotating shader orbs** above a minimal CLI command bar (`$ npx shadcn add @shadercn/orb-24`).
  3. Cut to a `50/50` split: dark JSX props card on the left (`state="speak"`, `size={400}`) driving a large reactive ribbed shader sphere on the right.

### Pattern 10: Zero-Text Guided Feature Walkthrough (*ImagineArt Pinterest `0:00–0:20`*)
- **Visual Mechanic (`0:00–0:20` Breakdown):**
  1. **`0:00–0:04` (Z-Depth Masonry Rush):** 2-word centered hook (`"Your ideas"`) as 16 photo cards rush past the camera along the Z-axis (`translateZ(-400px → +300px)` with radial focal blur).
  2. **`0:04–0:09` (Single Action Pill):** All photos implode into a single centered white input pill (`"Please connect to Pinterest |"`).
  3. **`0:09–0:13` (Magnetic Badge Link):** Clicking the purple arrow morphs the input pill into **two distinct white badges connected by a central link icon (`[Workflow] 🔗 [Pinterest]`)** with a tactile spring snap.
  4. **`0:13–0:20` (Guided Cursor Canvas Pull-Back):** Camera zooms out (`1.8× → 0.75×`) onto a dark dot-grid workspace as a bold purple cursor selects a photo card and fans out connected moodboard clusters—**communicating the entire product workflow without a single explanatory sentence.**
