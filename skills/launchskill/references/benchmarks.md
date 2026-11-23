# Quantitative Motion-Design Benchmarks & 10 Signature Patterns (100ms / 10 FPS Resolution)

Empirical motion telemetry and `0.1s`-interval (`100ms` / `10 FPS`) frame-by-frame transition mechanics distilled from 10 handpicked pure motion-design launch films (analyzed via FFmpeg `30 FPS` RGB24 frame-delta streaming and `0.1s` composite contact sheets).

---

## 1. Empirical Telemetry Across the 10 Reference Films

| # | Reference Film | Resolution | Duration | Hard Cuts | Median Shot | Luminance Range | Polarity Split (`Light / Dark / Chromatic`) | Primary Motion Paradigm |
| :-: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | **Paper (`paper-rich-text`)** | `1080×1080` | `45.03s` | `8` | `3.87s` *(min `0.97s`)* | `0.666` | `63% / 25% / 13%` | In-place live font-family morphing, `1.2s` character-scramble decrypt (`xom → agents`), & `0.8s` ink-splat polarity wipe |
| **2** | **Mimon (`launch-video-skill`)** | `1920×1080` | `53.83s` | `1` *(continuous)* | Continuous morph | `0.058` *(paper `#F8F8F7`)* | `100% / 0% / 0%` | `0:00–0:11` single green pixel → radial mosaic wall (`0.8s`) → ray node cloud → `0.6s` vector implosion into pixel logo |
| **3** | **Interface Lineage (`interface-lineage`)** | `1280×720` | `61.80s` | `1` *(continuous)* | Continuous morph | `0.796` | `72% / 28% / 0%` | `0:00–0:14` `1px` pill → `0.3s` droplet crown splash → catenary sag (`0.4s`) → right-to-left fill → `90°` rotate → `0.9s` iris portal |
| **4** | **Glisse (`glisse`)** | `1600×900` | `20.30s` | `1` *(continuous)* | Continuous stage | `0.340` | `0% / 0% / 100%` | Refractive frosted liquid-glass capsule + `0.3s` sky-light reflection swap + `0.2s` cursor-origin context menu bloom |
| **5** | **Clanker UI (`clanker-ui`)** | `1280×720` | `14.87s` | `6` | `2.00s` *(min `0.97s`)* | `0.879` | `67% / 33% / 0%` | `0.2s` slot-wheel text swap → zero-chrome diff trace (`+18 −4`) → `0.3s` spinner-to-checkmark morph → `1.1s` dark 8-window pull-back |
| **6** | **Epstein.md / Shipper (`epstein-md`)** | `1920×1080` | `26.60s` | `5` | `3.23s` | `0.975` | `80% / 20% / 0%` | `0.2s` emerald click halo → smooth inertial phase dashboard → `0.3s` 3D Z-axis page-flip (`22.5° → 90°`) between UI screens |
| **7** | **Linearity AI (`linearity-ai`)** | `1920×1080` | `57.87s` | `9` | `3.27s` | `0.957` | `44% / 33% / 23%` | `0.4s` inline vector-icon gap expansion → `1.2s` amber light-slit morph (`360×24 → 180×180`) → `0.2s` card-stack fan-out |
| **8** | **Graphical (`graphical`)** | `2560×1440` | `39.00s` | `2` | Continuous bento | `0.265` | `100% / 0% / 0%` | `0.3s` center-outward `3×2` bento pop → `0.1s` dark inspector snap → live bounding-box hue/radius scrubbing |
| **9** | **shadercn (`shadercn`)** | `1920×1080` | `15.07s` | `4` | `3.77s` | `0.076` *(obsidian `#050507`)* | `0% / 100% / 0%` | `0.8s` pixel-art `(S)` → `0.2s` 3D orb bloom → `0.6s` 33-orb grid wave → shader-masked knockout text (`Copy. Paste. Ship.`) |
| **10** | **ImagineArt (`imagineart-pinterest`)** | `1920×1080` | `25.80s` | `9` | `3.07s` | `0.226` | `0% / 100% / 0%` | `0:00–0:20` zero-text guided feature proof: `0.2s` pill split (`[Workflow] 🔗 [Pinterest]`) → `0.3s` top-down purple curtain wipe → Bezier node wires |

---

## 2. Six Hard Quantitative Laws Distilled at `0.1s` (`100ms`) Resolution

1. **`100ms–300ms` Micro-Transition Snap Windows (`3–9 frames @ 30fps`):**
   - At `0.1s` inspection, state transitions inside a continuous shot never drag out over `1.0s`:
     - **Slot-wheel vertical text swap** (`Clanker UI` `1.4s–1.6s`): **`0.2s` (`6 frames`)**.
     - **Pill-to-dual-badge magnetic split** (`ImagineArt` `8.3s–8.5s`): **`0.2s` (`6 frames`)**.
     - **Context-menu trigger-origin bloom** (`Glisse` `12.0s–12.2s`): **`0.2s` (`6 frames`)**.
     - **3D Z-axis card/screen flip (`0° → 90° → 180°`)** (`Shipper` `12.1s–12.4s`): **`0.3s` (`9 frames`)**.
     - **Top-down chromatic curtain reveal** (`ImagineArt` `10.0s–10.3s`): **`0.3s` (`9 frames`)**.
2. **Median Shot Duration & Accordion Rhythm (`0.97s` Bursts ↔ `3.07–3.87s` Hero Holds):**
   - Global median shot duration across multi-cut films is **`3.25s`** (`clanker-ui` runs at **`2.00s` median** with **`0.97s` rapid-fire beat cuts** and a **`1.1s` dark multi-window overview insert** at `7.9s–8.9s`).
3. **In-Place Continuous Morphing Beats Hard Slide Cuts:**
   - 40% of the reference films (`launch-video-skill`, `interface-lineage`, `glisse`, `graphical`) use **zero hard cuts** during their core 15–20s sequence—a single central element physically transforms in place through 4–6 distinct geometry states.
4. **Organic & Geometric Portal Wipes Over Opacity Cross-Dissolves:**
   - Instead of fading full screens via `opacity: 0 → 1`, top motion films change polarity using **spatial portal masks**:
     - **Circular Cursor Iris Portal (`0.9s`):** Expanding/collapsing dark circle centered directly on the cursor (`Interface Lineage` `35.7s–36.7s` & `45.0s–45.7s`).
     - **Organic Ink-Splat Wipe (`0.8s`):** Irregular black liquid blotch expanding from the bottom-left corner (`Paper` `27.3s–28.1s`).
     - **Single-Frame Horizontal Motion-Blur Whip (`0.1s`):** `scaleX(3.5)` directional blur frame bridging two high-density cuts (`Paper` `24.2s`, `25.2s`, `26.2s`, `32.1s`).
5. **Pinpoint-to-Field Scale Progression (`12px` Seed → Full-Screen Field in `0.6–0.8s`):**
   - Opening on a single concentrated focal point at `(960, 540)` (`10px` green pixel in `launch-video-skill`, `8px` white dot in `shadercn`, `24px` pixel cluster in `paper-rich-text`) and blooming radially into a full-viewport matrix in **`0.6–0.8s`** creates maximum pre-attentive scale contrast.
6. **Zero-Text Guided Choreography (`<= 4 Words/Beat`):**
   - Headline beats across all 10 films average **`2.8 words`**. Workflows are explained via **cursor selection, badge-to-badge magnetic docking, Bezier node wiring, and camera pull-backs**—never explanatory paragraphs.

---

## 3. Ten Signature Motion Patterns & `0.1s` (`100ms`) Frame-by-Frame Breakdowns

### Pattern 1: Creative Live-Font Morph, Character-Scramble Decrypt & Ink-Splat Wipe (*Paper*)
- **`0.1s` Frame-by-Frame Choreography (`01a` & `01b`):**
  1. **`0.0s–1.9s` (Cursor Swarm Collage):** 6–8 pixel-art/tiny icon sprites orbit a central point with colored name tags (`#EF4444`, `#22C55E`, `#A855F7`) and collapse inward at `1.8s–1.9s` into a single `2px` vertical text caret `|` at `2.0s`.
  2. **`3.3s–3.4s` (`0.1s` Directional Whip Pan):** Typing `"say hi to"` whips horizontally left in a single `100ms` motion-blurred frame (`3.3s`) to reveal `"rich text"`.
  3. **`4.6s–5.9s` (Live Selection Font Morph + Bezier Handles):** At `4.6s`, a translucent blue selection box (`rgba(59,130,246,0.22)`) highlights `"rich text"`. In **`0.1s` (`4.6s → 4.7s`)**, `"Rich"` snaps into a calligraphic script while `"text"` stays geometric sans; at `5.4s–5.9s`, `"text"` exposes live SVG control vertices around the `"x"`.
  4. **`8.7s–9.8s` (`1.1s` Character-Scramble Decrypt):** Inside a blue selection box, a 6-character string cycles random alphanumeric glyphs every `100ms` (`"r"` → `"44"` → `"xom"` → `"sMGc"` → `"a7bfT"` → `"agTR@"` → `"ageJy3"` → `"agensk"` → `"agentK"`) before locking into violet `"agents"` at `9.8s`.
  5. **`24.2s`, `25.2s`, `26.2s` (Exact `1.0s` Beat Whip Cuts):** Every `1.0s`, a single `100ms` full-screen horizontal directional blur frame cuts between dense typographic walls.
  6. **`27.3s–28.1s` (`0.8s` Ink-Splat Polarity Wipe):** An organic black ink blob expands from bottom-left (`27.3s: 15%` → `27.6s: 50%` → `28.1s: 100%` obsidian `#070709`).
  7. **`29.9s–31.6s` (Wireframe-to-Solid Fill Cascade):** Outlined display type `"SAY IT LIKE YOU MEAN IT."` fills with solid white sequentially row-by-row as multi-cursor selection boxes sweep across the letters.

### Pattern 2: Procedural Pixel-Matrix Field & `0.6s` Vector Ray Implosion (*Launch Video Skill `0:00–0:11`*)
- **`0.1s` Frame-by-Frame Choreography (`02`):**
  1. **`0.0s–2.0s` (Pinpoint Seed + `0.2s` Rack Focus):** Single `10×10px` olive-green pixel (`#65A30D`) at dead center; `"You built something."` racks from blurred (`0.6s`) to crisp (`0.8s`) in **`0.2s`**.
  2. **`2.1s–2.9s` (`0.8s` Radial Pixel Shockwave):** Concentric mosaic wave of `18×18px` neutral gray squares expands radially from the center dot (`2.1s: r=24px` → `2.3s: r=140px` → `2.5s: r=320px` → `2.9s: full 1920×1080`).
  3. **`4.1s–4.4s` (`0.3s` Vertical Rain Decimation):** At `4.1s–4.3s`, the pixel grid streaks vertically like falling matrix rain while copy morphs into `"On X, one flick and it's gone."`
  4. **`6.5s–7.1s` (`0.6s` Network Ray Graph Emergence):** Background gray tiles fade out while `1px` straight vector lines connect ~18 green pixel nodes across the canvas.
  5. **`9.2s–9.8s` (`0.6s` Particle Swarm Implosion):** At `9.2s`, the entire grid shatters into ~250 high-contrast black & green pixel particles that accelerate inward along radial trajectories (`9.4s` → `9.6s` → `9.8s`), locking into the pixel-art `>>` chevron + green circle at `9.9s`.
  6. **`10.8s–11.0s` (`0.2s` Logo Lockup):** The green circle shrinks into the chevron tip as `"mimon"` slides out to the right in `200ms`.

### Pattern 3: `1px` Single-Line Physics Metaphor & `0.9s` Cursor Iris Portal (*Interface Lineage `0:00–0:14` & `0:35–0:50`*)
- **`0.1s` Frame-by-Frame Choreography (`03a` & `03b`):**
  1. **`0.3s–0.7s` (`0.4s` Pill Stroke Draw):** A tiny `24×12px` center capsule at `0.3s` stretches horizontally into a `220×44px` `1px` hairline pill by `0.7s`.
  2. **`2.7s–3.1s` (`0.4s` Gravity Detach):** The right-hand dark submit dot detaches from inside the pill (`2.7s`) and falls vertically (`2.8s` → `3.1s`) while the pill floats upward.
  3. **`3.2s–3.9s` (`0.7s` Liquid Crown Splash & Concentric Ripples):**
     - `3.2s`: Dot impacts an invisible surface plane, spawning 1 elliptical ring.
     - `3.3s–3.6s`: A physical **liquid rebound column + 3 tiny crown droplets** shoot upward (`3.5s–3.7s`) at the exact center of 4 concentric elliptical ripples!
  4. **`7.1s–8.6s` (Elastic Catenary Wire & Rebound):** The horizontal hairline (`6.2s–7.1s`) bends downward at `7.2s–7.4s` (`sag = 38px`) as the dark ball drops onto it, oscillates through `7.5s–8.5s` with a hollow counter-circle beneath the wire, and snaps flat into a double line at `8.6s`.
  5. **`10.8s–11.8s` (`1.0s` Right-to-Left Solid Bar Fill):** A solid black fill sweeps from right (`10.9s: 15%`) to left (`11.7s: 100%`) inside the horizontal bar.
  6. **`12.2s–12.6s` (`0.4s` `90°` Aspect Morph into Vertical Monolith):** The horizontal bar compresses and rotates into a vertical smartphone/monolith outline with a bottom circle (`12.4s–12.6s`), then shrinks (`13.0s–13.4s`) and flips back into a horizontal toggle pill (`13.5s–13.8s`).
  7. **`35.7s–36.9s` & `45.0s–45.7s` (`0.9s` Circular Cursor Iris Portal):** At `35.7s`, a black circle blooms directly from the cursor tip (`r: 12px → 1400px` by `36.9s`), revealing a dark 3D constellation lineage graph where hovering nodes pops archival UI cards in **`0.2s`** (`38.1s–38.3s`, `39.6s–39.8s`, `41.5s–41.7s`), before iris-collapsing back to white paper in **`0.7s`** (`45.0s–45.7s`).

### Pattern 4: Refractive Liquid Glass Capsule, `0.3s` Environment Reflection Swap & `0.2s` Trigger Menu (*Glisse*)
- **`0.1s` Frame-by-Frame Choreography (`04`):**
  1. **`0.0s–7.8s` (Parallax Silk Ribbon + Specular Rim Tracking):** As the pointer orbits the frosted glass stack (`File / Edit / View / Work` menu bar, `Continue` pill, slider, `Search` bar), the `1.5px` top-left specular highlight shifts continuously in opposite phase.
  2. **`7.9s–9.7s` (Live Slider Scrubbing):** Cursor grabs the circular glass thumb at `7.9s`, drags left to `15%` (`8.0s`), and scrubs smoothly to `85%` (`9.7s`) with an electric-blue fill track.
  3. **`10.5s–10.8s` (`0.3s` Environment Reflection Swap):** In `300ms`, the entire background environment shifts from deep cobalt night (`10.4s`) to warm sunlit cyan (`10.8s`), demonstrating real-time optical refraction through the translucent glass capsules.
  4. **`12.0s–12.2s` (`0.2s` Trigger-Origin Context Menu Bloom):** Clicking the `+` button at `11.9s` expands a frosted glass popover menu (`Pin / Rename / Duplicate / Delete`) directly out of the button's coordinates (`scale: 0.4 → 1.0` over `12.0s → 12.2s`), collapsing back in **`0.2s`** (`14.0s → 14.2s`).

### Pattern 5: `0.2s` Slot-Wheel Text Swap, `0.3s` Spinner-to-Check Morph & Dark Overview Insert (*Clanker UI*)
- **`0.1s` Frame-by-Frame Choreography (`05`):**
  1. **`0.7s–0.9s` & `1.4s–1.6s` (`0.2s` Vertical Slot-Wheel Text Swap):** The 8-segment spinner stays pinned on the left while `"Searching..."` rolls upward out of a tight clip mask and `"Reading 3 files"` rolls in from below in exactly **`200ms`** (`1.4s → 1.6s`).
  2. **`2.1s–2.2s` (`0.1s` Accordion Trace Unfold):** Hard-snaps into a 4-row left-aligned execution trace (`Editing policy.ts 1s`, `Searched for rollout policy`, `Read 3 files`).
  3. **`3.1s–3.2s` (Instant Polarity Inversion):** Zero-fade `1-frame` cut from `#F9F9F9` light mode to `#141416` dark mode on the exact same trace layout (`Edited src/policy.ts +18 −4`).
  4. **`4.2s–4.5s` (`0.3s` Spinner → Solid Disc → Checkmark Morph):** On an extreme macro close-up, the 8-segment spinner collapses radially into a solid black disc (`4.3s`) and punches out a white checkmark (`4.4s–4.5s`) next to `"Run the"`.
  5. **`5.7s–6.3s` (`0.6s` Macro Button Push-In):** Camera pushes `2.8×` directly into the black `[Allow once ↵]` pill button.
  6. **`7.9s–8.9s` (`1.0s` Dark 8-Window Grid Overview):** Flips to a dark `#0B0B0D` canvas showing a `4×2` grid of 8 live dark terminal cards running in parallel before zooming back into a single card at `9.0s`.

### Pattern 6: `0.2s` Emerald Click Halo, Inertial Phase Scroll & `0.3s` 3D Z-Axis Page Flip (*Epstein.md / Shipper*)
- **`0.1s` Frame-by-Frame Choreography (`06`):**
  1. **`0.1s–1.9s` (4-Word Sequential Color Build):** `"Building"` (`0.1s`) → `"Building apps"` (`0.5s`, emerald `#10B981`) → `"Building apps is"` (`1.2s`) → `"Building apps is hard"` (`1.5s`, coral `#EF4444`).
  2. **`4.8s–5.3s` (`0.5s` Emerald Cursor Ring Halo):** Before clicking the green send button on the prompt box, a glowing green radial aura blooms behind the hand cursor (`4.8s–5.3s`).
  3. **`6.2s–10.6s` (Smooth Vertical Phase Auto-Scroll + Ambient Pastel Blobs):** As `PHASE 1` → `PHASE 2` → `PHASE 3` complete, the checklist scrolls upward smoothly (`EASE_IN_OUT_QUINT`) framed by soft violet/pink corner aura glows (`6.2s–8.5s`).
  4. **`12.1s–12.4s` (`0.3s` 3D Perspective Y-Rotation Page Flip):** To transition from the generated Car Rental gallery (`12.0s`) to the analytics dashboard (`12.4s`), the entire UI window rotates in 3D perspective (`12.1s: rotateY(25deg)` → `12.2s: rotateY(78deg)` motion-blurred edge → `12.3s: rotateY(-35deg)` → `12.4s: rotateY(0deg)`).

### Pattern 7: `0.4s` Inline Icon Slot Expansion, `1.2s` Amber Light-Slit Morph & `0.2s` Card Stack Fan-Out (*Linearity AI*)
- **`0.1s` Frame-by-Frame Choreography (`07`):**
  1. **`0.3s–1.7s` (Staggered 3-Word Stack):** `"Graphic"` (`0.3s`) → `"tools"` (`0.6s`) → `"AI"` (`1.1s`) assemble on `#050505`.
  2. **`1.7s–2.1s` (`0.4s` Inline Icon-Slot Push):** `"AI"` and `"tools"` slide apart horizontally while 4 monochrome vector icons (`✦ ∅ ◓ △`) pop into the expanding gap at `100ms` intervals (`1.8s`, `1.9s`, `2.0s`, `2.1s`).
  3. **`2.7s–3.1s` (`0.4s` Diagonal Amber Silk Wave Wipe):** A glowing golden-amber ribbon sweeps diagonally across the black canvas, transitioning into a minimal dark prompt pill (`3.3s–4.8s`).
  4. **`5.0s–6.3s` (`1.3s` Glowing Amber Slit-to-Card Morph):** The dark pill ignites from right to left with an incandescent amber core (`5.0s–5.3s`), compresses horizontally (`5.7s–6.0s: width 340 → 140px`), and expands vertically (`6.1s–6.3s: height 28 → 160px`) into a rounded square campaign card!
  5. **`7.0s–8.4s` (`0.2s` Peripheral Bento Flash + `0.2s` Card Stack Fan-Out):** Surrounding green/yellow thumbnail squares flash in the dark periphery (`7.0s–8.2s`), then fade as the central card fans out into a 3-card tilted stack (`8.3s–8.5s`) while side words swap (`"Hand / you"` → `"flat / images"` → `"your team"` → `"can't edit"` with a 3D padlock dropping onto the dimmed stack at `10.8s–11.1s`).

### Pattern 8: `0.3s` Center-Out Bento Pop & Real-Time Inspector Bounding-Box Scrub (*Graphical*)
- **`0.1s` Frame-by-Frame Choreography (`08`):**
  1. **`0.3s–0.6s` (`0.3s` Center-Outward Bento Pop):** Starts with a single center card at `0.3s`, pops to 3 cards at `0.4s`, and locks the full 6-card `3×2` green style-system bento at `0.5s`.
  2. **`1.6s–2.0s` (`0.4s` Palette Morph Wipe):** The green bento fades down (`1.6s–1.7s`) and pops back at `1.8s–2.0s` in a deep eggplant-purple theme (`"What matters this quarter."`), then morphs again at `3.0s–3.3s` into a crimson-red theme (`"$1,290.36"`).
  3. **`4.0s–4.1s` (`0.1s` Dark Inspector Drawer Snap):** A sleek `#141416` property inspector snaps onto the right third of the screen in a single `100ms` cut.
  4. **`6.8s–11.9s` (Live Bounding-Box Color & Radius Scrubbing):** An active selection outline highlights target cards inside the left bento grid while scrubbing the right-hand inspector's color spectrum bar morphs the live cards' fills and border strokes through **Amber (`6.8s–7.9s`) → Chartreuse (`8.1s–8.5s`) → Sky Blue (`8.2s–8.4s`) → Emerald (`9.0s–11.9s`)**.
  5. **`12.0s–16.1s` (Spring Physics Curve Drawer):** Switches to a spring-slider test bench where green toggle bars oscillate with visible cubic-bezier/spring curves in the dark inspector.

### Pattern 9: `0.8s` Pixel-Art `(S)` → `0.2s` 3D Orb Bloom → `0.6s` 33-Orb Wave → Knockout Shader Text (*shadercn*)
- **`0.1s` Frame-by-Frame Choreography (`09`):**
  1. **`0.2s–1.5s` (Pinpoint Dot to Pixel-Art `(S)`):** A single `4px` white dot at `0.2s` steps through pixelated glyphs (`0.8s: S` → `1.1s: (S)`).
  2. **`1.6s–2.1s` (`0.5s` Pixel-to-3D Iridescent Sphere Morph):** Inside the pixel brackets `(...)`, the flat `S` inflates into a full 3D iridescent shader sphere (`1.6s–1.9s`), stretches horizontally with motion-blurred bracket wings at `2.0s`, and pops into a `240px` 3D orb at `2.1s`.
  3. **`4.0s–4.6s` (`0.6s` Center-Outward 33-Orb Grid Expansion):** The single orb pulls back (`3.9s–4.0s`) and fans outward column-by-column (`4.1s: 14 orbs` → `4.2s: 23 orbs` → `4.3s: 31 orbs` → `4.4s: 33 orbs` in a `11×3` matrix).
  4. **`7.5s–7.8s` (`0.3s` Horizontal Carousel Whip to Split View):** The 33-orb grid zooms and whips horizontally (`7.5s–7.6s`) into a single large hero orb on the right paired with a minimal dark code card on the left (`7.8s`).
  5. **`11.3s–12.9s` (Shader-Masked Knockout Display Typography):** At `11.3s–11.4s`, the striped shader orb zooms `4×` into the camera and becomes a **live animated shader texture clipped inside giant display words**: `"Copy."` (`11.5s–11.8s`) → `"Paste."` (`11.9s–12.3s`) → solid white `"Ship."` (`12.4s–12.8s`) → full-bleed `"Ship"` shader zoom (`12.9s`).

### Pattern 10: Zero-Text Guided Feature Proof: `0.2s` Pill Split, `0.3s` Curtain Wipe & Bezier Node Wires (*ImagineArt `0:00–0:20`*)
- **`0.1s` Frame-by-Frame Choreography (`10`):**
  1. **`1.2s–3.0s` (3D Radial Photo Cloud Explosion & Implosion):** From dead center behind `"Your ideas"`, ~28 photo thumbnails explode outward radially toward the camera (`1.2s → 1.8s`), drift past the lens (`1.9s–2.8s`), and implode back into a tight central cluster at **`3.0s`** (`0.2s` collapse) before vanishing at `3.1s`.
  2. **`4.4s–8.3s` (Single Centered Input Pill + Autocomplete Icon):** A crisp white input pill pops in at `4.4s`; typing `"Please connect to "` cycles live inline provider badges (`Google Drive` `5.4s` → `Dropbox` `5.9s` → `Unsplash` `6.3s` → `Pinterest` `7.0s`).
  3. **`8.3s–8.5s` (`0.2s` Magnetic Pill-to-Dual-Badge Split):** Clicking the purple arrow at `7.7s` splits the single input pill horizontally in **`200ms`** (`8.3s → 8.4s`) into two distinct white rounded badges linked by a center chain icon: `[Workflow] 🔗 [Pinterest]`.
  4. **`10.0s–10.4s` (`0.4s` Top-Down Purple Neon Curtain Reveal):** A glowing violet gradient curtain sweeps from top to bottom inside the dark workspace frame (`10.1s` → `10.3s`), materializing the imported 4-column Pinterest masonry grid underneath (`10.4s`).
  5. **`13.5s–14.8s` (Multi-Select Drag & Stack):** The purple cursor clicks 3 photo cards (`11.5s–13.4s`), collapses the rest of the board (`13.6s–13.8s`), and drags the selected photo stack across the dark canvas.
  6. **`15.1s–16.8s` (Radial Sub-Cards & Golden Bezier Node Wires):** At `15.1s`, 5 reference sub-cards sprout radially around the source photo with thin connecting lines; at `15.6s–16.0s`, 5 glowing golden-amber Bezier curves (`M x1 y1 C ...`) wire the references into a dark generator frame that sweeps open with a purple top-down curtain (`16.1s–16.4s`) to reveal the synthesized hero portrait!
