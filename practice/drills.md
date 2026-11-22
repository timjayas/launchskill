# Fuser Motion Mastery — 5 Progressive Drills & Critique Loop

> **How to use this workbook:** Study each drill alongside [motion-breakdown.md](../analysis/motion-breakdown.md) and break the reference patterns inside the [Interactive Motion Pattern Lab](../patterns/index.html) (`0.25×` slow-mo + `←/→` frame stepping).
> Build your solution in HTML/CSS/GSAP, Remotion, or After Effects—then drop your code, live file path, or rendered clip in chat for a **Creative Director Critique**.

---

## Creative Director Critique Protocol (No Generic Praise)

When you submit a drill, I will audit it frame-by-frame across **5 ruthless grading axes**—never "looks great!":

| Axis | What I Audit | Automatic Failure Trigger |
|---|---|---|
| **1. Easing & Velocity Profile** | Exponential settle, velocity curve symmetry on hops, realistic motor curves on cursors | Any default CSS `ease`, `linear` UI slide, or bouncy rubber overshoot (`> 1.35`) on editorial UI |
| **2. Spacing & Weight** | Frame-to-frame spatial displacement (fast core, tight tail settle) | Equal frame spacing during entry/exit, or elements arriving simultaneously in a flat block |
| **3. Anticipation & State Bridges** | Micro-dwells (`2–3f`) before cursor drags, loading/halo bridges before node spawns | Teleporting UI states with zero causal bridge |
| **4. Readability Holds vs. Transitions** | Asymmetric budget (`0.18–0.32s` moves vs. `0.75–1.30s` holds) | Spending more time moving a card than letting the viewer read it |
| **5. Eye-Trace Continuity** | Foveal anchor discipline (`50%, 50%` or explicit Left → Right causality) | Making the viewer's eye jump diagonally across opposite corners between cuts |

---

## Drill 1 — Timing & Easing: The 3-Second Prompt-to-Node Reveal
**Reference Beat:** Fuser `00:04.96 – 00:08.00` · Study `01 · Prompt → Pill → Wipe` in `/patterns/index.html`

### Brief
Recreate a **3.0-second** (`72f` at 24p / `180f` at 60p) single-feature UI reveal on a pure `#FFFFFF` canvas:
1. **`0.00s – 0.65s` (Readability Hold):** Bare centered editorial text (`"Want it? Prompt it."`) with a crisp vertical caret.
2. **`0.65s – 1.35s` (Morph + Type):** Container morphs into a rounded pill (`border-radius: 999px`) and types a 2–3 word prompt (`"Remove background"` or your own tool name).
3. **`1.35s – 1.85s` (Causal State Bridge):** Spinner pops in (`width: 0 → 14px`) + pink radial executing halo blooms around the pill.
4. **`1.85s – 2.20s` (Lift & Spawn):** Pill lifts upward (`-140px`) with subtle vertical blur while a pink-bordered Tool Node springs into dead-center (`50%, 50%`).
5. **`2.20s – 3.00s` (Crisp Hold):** Zero drift; the node sits rock-solid for cognitive registration.

### 3 Classic Beginner Mistakes to Avoid
1. **The Mushy PowerPoint Morph:** Stretching the pill entrance over `0.7s` with CSS `ease-in-out`. *Fix:* Snap the pill border & shadow in `0.24–0.28s` with `expo.out` (`cubic-bezier(0.16, 1, 0.3, 1)`).
2. **Cartoony Rubber Overshoot:** Using `back.out(2.5)` or underdamped springs so the Tool Node wobbles like a mobile game popup. *Fix:* Critically damped settle (`overshoot ≤ 0.35` or `stiffness: 280, damping: 26`).
3. **Missing the Causal State Bridge:** Hard-cutting straight from typed text to the generated UI card. *Fix:* Always give the viewer `0.35–0.50s` of *execution feedback* (spinner + pink halo) so the spawn feels earned.

### Self-Check Before Submitting
- Scrub at `0.25×` speed: does the pill start lifting **before** the Tool Node finishes fading in (overlapping action, `30–60ms` stagger)?
- Turn on center crosshairs: does the vertical center of the prompt pill align with the center of the spawned Tool Node?

---

## Drill 2 — Camera & Spatial Continuity: 2D Canvas Pan-and-Zoom Lock
**Reference Beat:** Fuser `00:47.42 – 00:51.46` · Study `06 · 2D Camera + Match-Cut` in `/patterns/index.html`

### Brief
Build a virtual **2D Spatial Canvas** (`1200×800` world inside a `16:9` viewport) containing at least **6 Tool Nodes**, with **Node A** (top-left cluster) wired via an SVG bezier curve to **Node B** (bottom-right cluster). Animate a **4.0-second** continuous camera rig:
1. **`0.0s – 0.8s`:** Start framed tightly (`scale: 1.5`) on **Node A** executing a subtle live state change.
2. **`0.8s – 1.6s`:** Pull back slightly (`scale: 0.92`) while panning along the connecting bezier wire so the viewer sees the spatial relationship between both nodes.
3. **`1.6s – 2.5s`:** Execute a high-velocity camera hop (`expo.inOut`) with brief mid-path directional blur (`6–10px` at peak velocity, `0px` at rest) and **zoom straight into Node B (`scale: 1.85`)**, locking Node B's exact geometric center to viewport `(50%, 50%)`.
4. **`2.5s – 4.0s`:** Hold locked on Node B while its output activates.

### Technical Trap to Solve
Most developers animate `scale` and `translate` with `transform-origin: center` and accidentally create a drunken arc where the target drifts off-center mid-zoom.
- **Senior Formula:** Set `transform-origin: 0 0` on the world container and compute exact camera coordinates for any world point `(wx, wy)` at zoom `z`:
  ```js
  x = viewportWidth / 2 - wx * z;
  y = viewportHeight / 2 - wy * z;
  ```
- Pair that with a single timeline tween on `{ x, y, scale }` so focal lock is mathematically airtight.

### Self-Check Before Submitting
- Step frame-by-frame through the final `0.4s` of the zoom-in: does Node B glide smoothly into dead-center without wobbling laterally at the end?

---

## Drill 3 — Transition Craft: The Invisible Scale-Through Match-Cut
**Reference Beat:** Fuser `00:54.00 – 00:56.20` · Study the ending of `06 · 2D Camera + Match-Cut`

### Brief
Create a **2.5-second** seamless transition between **two completely different DOM/layer states** using a **velocity-masked Scale-Through Match-Cut**:
- **State A (UI World):** A framed Tool Node card (e.g., `Kinetic Type` or `Color Grade`) showing a miniature bold graphic inside its pink border, sitting at ~35% of screen width.
- **State B (Full-Bleed Brand World):** A full-bleed `16:9` graphic/headline takeover using the exact same color palette and typographic motif.

### Craft Rules
1. **Cut at Peak Velocity, Never at Rest:** Accelerate State A outward using `power4.in` (`0.26s`). Place the swap to State B at the **steepest velocity frame** (`t ≈ 0.22s`), and immediately decelerate State B into rest using `power4.out` (`0.24s`).
2. **Match Color & Anchor Geometry:** The background color or dominant typography inside State A's preview box must occupy the same center pixels as State B on the cut frame so the eye bridges the cut effortlessly.
3. **Zero Crossfade Mush:** Do **not** do a lazy `0.4s` opacity dissolve—opacity overlap must be `≤ 2–3 frames` (`40–80ms`).

### Self-Check Before Submitting
- Scrub `−1f / +1f` right across the cut frame: can you verify the speed curve stays monotonic (never slowing down *before* the cut and speeding up again after)?

---

## Drill 4 — Pacing & Hierarchy: 6-Second Multi-Element Choreography
**Reference Beat:** Fuser `00:23.54 – 00:29.50` · Study `03 · Cursor + Live Slider` in `/patterns/index.html`

### Brief
Choreograph a **6.0-second** sequence containing **at least 5 distinct animated elements** (headline, cursor, slider, hero node, and 2 spawned sibling nodes) where **only ONE visual story demands attention at any given millisecond**:
1. **`0.0s – 2.2s` (Micro-Interaction Solo):** Cursor enters with natural motor ease (`sine.inOut`), pauses `2–3f` on grab, drags a slider **up AND back down** while a single bold word scales 1:1 in real time.
2. **`2.2s – 2.5s` (3–5f Whip-Pan):** High-velocity horizontal directional blur sweeps the typography left while pulling a single hero Tool Node in from the right.
3. **`2.5s – 3.7s` (Hero Action):** Hero node's live parameter scrubs visibly on its own (focus stays 100% centered).
4. **`3.7s – 4.3s` (Staggered Daisy-Chain):** Hero node scales down & shifts left while **2 sibling nodes** spring out right with tight `45–70ms` stagger.
5. **`4.3s – 6.0s` (Unified Payoff Hold):** All 3 nodes run gentle synchronized live feedback with clean breathing room.

### Hierarchy Rule (How to Prevent Eye Hunting)
Never enter a new headline *while* a cursor is still dragging *while* two cards are popping in. Every overlapping handoff must follow a **Baton Pass**:
- Element A reaches `80%` settle → Element B begins launch → Element A holds still while Element B performs.

### Self-Check Before Submitting
- Mute the video and watch at `1×` without blinking: write down the exact path your eyes traveled (`Center → Down to Slider → Center → Left → Right`). If your eyes ever darted backward in confusion, fix the stagger or hold!

---

## Drill 5 — Original Mini-Edit: 10-Second Launch Shot Brief
**Goal:** Synthesize Fuser's entire motion grammar into an **original 10.0-second (`240f` @ 24p / `600f` @ 60p)** 16:9 launch film for a fresh product—no copying Fuser's assets or copy!

### Product Brief
- **Product:** **Prism — Live Shader Canvas** (a browser-based node studio for building interactive WebGL/CSS shaders with one prompt and real-time sliders).
- **Art Direction:** Pure gallery white `#FFFFFF` primary canvas, razor charcoal `#111114` typography, one electric signature node accent color of your choice (e.g., `#6366F1` Indigo or `#10B981` Emerald), plus **1 bold full-bleed chromatic pattern interrupt**.
- **Audio/Tempo Grid:** Lock your major cuts to **132 BPM** (`0.454s` per beat; `1.82s` per 4-beat bar).

### Required 10-Second Beat Sheet
| Time | Beats | Required Technique |
|---|---|---|
| `00:00.0 – 00:01.8` | Bar 1 | Frame-0 hook (`INTRODUCING` → bold wordmark or radial card peek) — zero fade from black! |
| `00:01.8 – 00:03.6` | Bar 2 | Prompt-to-Pill morph → executing glow bridge → Shader Node spawns center |
| `00:03.6 – 00:05.5` | Bar 3 | Direct-manipulation cursor drags a live slider (`Blur` / `Chromatic` / `Grain`) forward + back with 1:1 shader response |
| `00:05.5 – 00:07.3` | Bar 4 | 1-to-1 Wired Node Dataflow (`Shader Node → Export Node`) **OR** 2D Canvas Camera Hop across 4+ nodes |
| `00:07.3 – 00:07.7` | 1 beat | Full-bleed **Chromatic Pattern Interrupt** (gradient wipe or color-block punch) |
| `00:07.7 – 00:10.0` | Final Bar+ | Scale-Through Match-Cut into bold high-contrast climax lockup (`"BUILD SHADERS LIVE"`) + clean URL end-card (`1.0s+` hold) |

### How to Submit for Critique
Reply with:
1. Which Drill (`#1`–`#5`) you built.
2. Either your code file path (in `/practice/` or `/demo/`) **or** a rendered MP4/GIF/link.
3. Optional: tell me which transition felt hardest to time.

I will inspect your frame timings, easing curves, holds, and eye-trace, and give you a **brutally specific, actionable revision list**—just like a real studio dailies review.
