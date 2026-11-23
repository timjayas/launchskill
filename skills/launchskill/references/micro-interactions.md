# Micro-Interactions, Visual-First Widgets, 2.5D Hardware & Camera Recipes

Static dashboards, chat bubbles typing long sentences, and 15-row text tables scream "AI template slop." High-craft X launch videos **amaze viewers at first glance through design, illustration, and physical transformation**—never by forcing them to read a user manual.

All recipes below are **100% deterministic and FPS-agnostic** (using `sec(seconds, fps)` and canonical primitives from [templates/motion.ts](../templates/motion.ts) and [templates/StudioPrimitives.tsx](../templates/StudioPrimitives.tsx)).

---

## 0. The Text-to-Visual Widget Translation Matrix (Replace Text Manuals With Visual Motion)

**Rule #1 of Launch Video Design:** Before putting any text block, chat bubble, or feature table on screen, translate the concept into a **self-explanatory visual illustration or tactile widget** (capping typography at **1–3 words max** per beat):

| Product Capability | ❌ Generic AI Text/Chat Slop (Forbidden) | ✅ Visual-First Motion Design Widget (Use This Instead) |
| :--- | :--- | :--- |
| **Voice / AI Intent / Prompt** | A chat bubble or prompt input bar typing a 15-word sentence (*"Just landed in Tokyo — which track is the Narita Express..."*) | **Sculptural Sonic Iris Capsule (`<LiveVoiceSpectrum />`)**: A glowing center emblem flanked by a 24-bar harmonic equalizer that physically morphs its container geometry (`interpolateBoxGeometry`) into the device screen. |
| **Time / Scheduling / Calendar** | A text row or message thread saying *"Rescheduled Dinner with Maya from 7:00 PM to 8:00 PM"* | **Sweeping Watch/Clock Dial (`<TactileClockDialWidget />`)**: A circular analog/digital clock face where the hands physically sweep from `7:00` to `8:00` and lock emerald green (`LOCKED ✓`). |
| **Camera Vision / Image Analysis** | A stick-figure raw SVG wireframe drawing or a 10-line text summary card | **Optical Lens Viewfinder + `+88px` Z-Exploded Visual Swatch Card**: A layered architectural/landscape illustration inside a rotating optical focus ring with a sweeping laser scan beam that explodes a miniature visual swatch card forward (`translateZ(+88px)`) out of the glass. |
| **Location / Navigation / Places** | A text badge saying *"Google Maps · Found Koffee Mameya 6 min away"* | **Topographic Vector Route Map**: Stylized architectural city blocks where a glowing S-curve polyline draws itself (`strokeDashoffset`) to a bouncing emerald destination pin. |
| **Multi-App Sync / Orchestration** | Fake iMessage chat bubbles or a dense 6-row text checklist | **3-Ring Rotating Orbital Constellation**: Counter-rotating dashed orbital rings with glowing nodes around a pulsing core that dives straight into a **Portal Zoom-Through Match Cut**. |
| **Studio Backdrop** | `1px` wireframe skeleton box grids or giant faint background watermark words (`"LIVE"`, `"VISION"`) | **`<SeamlessStudioBackdrop />`**: Clean, breathable tonal studio space where 100% of contrast belongs to the sculptural 2.5D foreground objects. |

---

## 1. The 2D Macro Camera Rig & 2.5D `<PerspectiveDeviceStage />`

Keep software UI **flat and orthogonal (`rotate = 0`)** and move a deterministic studio camera rig over it: push smoothly onto one meaningful interactive detail (`1.0 → 1.85×`), hold while the interaction plays, then pull back to reveal full system context.

```tsx
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { EASE_IN_OUT_QUINT, sec } from "../templates/motion";

export const CameraRig: React.FC<{
  zoom: number;
  focusX: number;
  focusY: number;
  children: React.ReactNode;
}> = ({ zoom, focusX, focusY, children }) => {
  const panFactor = Math.max(0, (zoom - 1) / Math.max(zoom, 0.001));
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${zoom}) translate3d(${-focusX * panFactor}px, ${-focusY * panFactor}px, 0)`,
        transformOrigin: "center center",
        willChange: "transform",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// FPS-agnostic Zoom In -> Hold -> Pull Out envelope:
const pushIn = interpolate(localFrame, [sec(1.5, fps), sec(2.25, fps)], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: EASE_IN_OUT_QUINT,
});
const pullOut = interpolate(localFrame, [sec(4.5, fps), sec(5.3, fps)], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: EASE_IN_OUT_QUINT,
});
const zoom = 1 + Math.max(0, pushIn - pullOut) * 0.85;
```

---

## 2. Deterministic Bézier Cursor + Causal Hover + Click Ripple

Real software demos feel alive when the vector pointer glides along a **subtle quadratic Bézier arc**, triggers a **pre-click hover lift** (`-3px` elevation + active border crispness) during its `0.15s` anticipation dwell, depresses (`1.0 → 0.86 → 1.0`), and fires an expanding ripple ring.

```tsx
const t = interpolate(frame, [startFrame, arriveFrame], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: EASE_IN_OUT_QUINT,
});
const ctrlX = (from.x + to.x) * 0.5 + 48;
const ctrlY = Math.min(from.y, to.y) - 65;
const inv = 1 - t;
const x = inv * inv * from.x + 2 * inv * t * ctrlX + t * t * to.x;
const y = inv * inv * from.y + 2 * inv * t * ctrlY + t * t * to.y;

// FPS-agnostic click depression (0.10s down, 0.17s rebound) & ripple (0.53s)
const clickDown = interpolate(
  frame,
  [clickFrame, clickFrame + sec(0.1, fps), clickFrame + sec(0.27, fps)],
  [1, 0.86, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
const rippleP = interpolate(frame, [clickFrame, clickFrame + sec(0.53, fps)], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: EASE_OUT_EXPO,
});
```

---

## 3. Natural-Cadence Typewriter + Blinking Caret + `@` Entity Chip

Uniform `1 char/frame` typing looks robotic and breaks when FPS changes. Always use `getNaturalTypedLength(text, frame, startFrame, charsPerSecond, fps)` and `getCaretOpacity(frame, isTyping, fps)` from [templates/motion.ts](../templates/motion.ts), which add deterministic micro-pauses on spaces and punctuation at any frame rate.

---

## 4. Shared-Element Layout Morphing

Interpolate a container's `(x, y, width, height, borderRadius)` continuously across `sec(0.65, fps)` using `EASE_IN_OUT_QUINT` instead of fading Card A out and sliding Card B in:

```ts
const morph = interpolate(localFrame, [morphStart, morphStart + sec(0.65, fps)], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: EASE_IN_OUT_QUINT,
});
```

---

## 5. Progressive Editorial Word-Reveal (Two-Tone Ink Shift)

Display a clean sentence in muted ink (`#A3A3A3`) and shift each word to crisp primary ink (`#0A0A0A`) on a `0.13s` stagger (`EASE_OUT_EXPO`), keeping baselines locked and travel subtle (`8–10px`).

---

## 6. First-Class Real Product Media Workflow (`<Img>` & `<OffthreadVideo>`)

Whenever the user has a real app screenshot (`public/app.png`) or screen recording (`public/demo.mp4`), **prefer staging the real product** over fabricating a fake HTML mockup. Elevate raw captures into launch-film cinema with **4 studio techniques**:

### A. `<SpatialCameraRig>` Zoom-Tracking Onto Live Screen Recordings
Mount `<OffthreadVideo>` (never `<Video>`—`<OffthreadVideo>` guarantees frame-accurate seeking and crisp headless Chromium export) inside a crisp framed bezel driven by `<SpatialCameraRig>` so the viewer's eye locks directly onto the button, terminal line, or canvas edit happening inside the recording:

```tsx
import { OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SpatialCameraRig } from "../templates/StudioPrimitives";
import { computeVelocityBlur, EASE_IN_OUT_QUINT, sec } from "../templates/motion";

const evalCam = (f: number) => {
  const push = interpolate(f, [sec(1.2, fps), sec(2.0, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  return {
    wx: interpolate(push, [0, 1], [960, 620]), // Pan directly onto toolbar/prompt inside 1920x1080 capture
    wy: interpolate(push, [0, 1], [540, 390]),
    zoom: interpolate(push, [0, 1], [0.84, 1.65]),
  };
};

const cam = evalCam(frame);
const prev = evalCam(Math.max(0, frame - 1));
const { blurX, blurY } = computeVelocityBlur(cam.wx, cam.wy, prev.wx, prev.wy, fps, 0.1, 10);

<SpatialCameraRig focusX={cam.wx} focusY={cam.wy} zoom={cam.zoom} blurX={blurX} blurY={blurY}>
  <div style={{ width: 1920, height: 1080, padding: 80, display: "grid", placeItems: "center" }}>
    <div style={{ width: 1520, borderRadius: 22, overflow: "hidden", border: "1px solid rgba(10,10,10,0.10)", boxShadow: "0 40px 100px rgba(10,10,10,0.14)" }}>
      <OffthreadVideo src={staticFile("demo.mp4")} style={{ width: "100%", display: "block" }} />
    </div>
  </div>
</SpatialCameraRig>
```

### B. Deterministic Speed-Ramping (Compress Boring Waits, Play Hero Actions at `1.0×`)
Raw screen recordings always include 2–4 seconds of boring typing, network spinners, or mouse travel. Slice the recording into `<Sequence>` segments with explicit `startFrom`, `endAt`, and `playbackRate` (e.g., `1.0×` for hero click → `3.5×` through loading wait → `1.0×` for result payoff) or compute exact source timestamps with `evaluateSpeedRampSec()` from [templates/motion.ts](../templates/motion.ts):

```tsx
// Segment 1 (0.0s -> 1.8s): Hero prompt click at real-time 1.0x
<Sequence from={0} durationInFrames={sec(1.8, fps)}>
  <OffthreadVideo src={staticFile("demo.mp4")} startFrom={0} playbackRate={1.0} style={{ width: "100%" }} />
</Sequence>
// Segment 2 (1.8s -> 2.6s): Compress 3.2s loading spinner at 4.0x (with subtle speed pill HUD!)
<Sequence from={sec(1.8, fps)} durationInFrames={sec(0.8, fps)}>
  <OffthreadVideo src={staticFile("demo.mp4")} startFrom={sec(1.8, fps)} playbackRate={4.0} style={{ width: "100%" }} />
</Sequence>
// Segment 3 (2.6s -> 5.0s): Snap back to 1.0x for crisp finished result
<Sequence from={sec(2.6, fps)} durationInFrames={sec(2.4, fps)}>
  <OffthreadVideo src={staticFile("demo.mp4")} startFrom={sec(5.0, fps)} playbackRate={1.0} style={{ width: "100%" }} />
</Sequence>
```

### C. Animated Spotlight Masks & Architectural Callout Overlays
Layer a soft radial spotlight mask (`radial-gradient(circle at X% Y%, transparent 16%, rgba(9,9,11,0.52) 44%)`) + a `1.5px` SVG architectural leader line (`strokeDashoffset` draw via `EASE_OUT_EXPO`) and a frosted spec pill over a real `<Img>` or `<OffthreadVideo>` so mobile X viewers know *immediately* where to look.

### D. Real-to-Motion Handoffs (Hybrid Capture + Vector Craft)
Start on a real crisp `<Img>`/`<OffthreadVideo>` frame inside your app chrome, zoom into a focal card/artboard with `<SpatialCameraRig>`, and hard-cut or `clip-path` wipe at peak zoom into a pure 2D Remotion vector recreation of that element so you can animate kinetic typography, counters, or brand lockups at infinite resolution.

---

## 7. Exact Focal-Lock `<SpatialCameraRig>` (Zero-Drift Pan, Zoom & Directional Blur)

Always lock `transformOrigin: "0 0"` and map world coordinates `(wx, wy)` directly to viewport center `(W/2, H/2)` using `computeCameraTransform` + `computeVelocityBlur` + `<SpatialCameraRig>` from [templates/StudioPrimitives.tsx](../templates/StudioPrimitives.tsx). Never animate `scale` around `transformOrigin: "center"` during world pans (causes drunken curved arcs).

---

## 8. Prompt-to-Pill Morph + Radial Executing Halo

Turn abstract "AI generation" into a `0.5s` tactile bridge before a result node spawns:
1. Hold bare centered editorial text (`0.6–0.9s`).
2. Morph into a rounded pill (`borderRadius: 999`) over `0.25s` (`EASE_OUT_EXPO`).
3. Fast-type command (`28–36 chars/sec`), pop spinner (`width: 0 → 24px`), and bloom a radial executing halo tinted to your **derived brand accent** (`0 0 0 8px ${accent}26, 0 0 54px ${accent}66`).
4. Lift pill upward (`-260px`) with vertical `<DirectionalMotionBlur blurX={0} blurY={...}>` while the generated node springs dead-center (`50%, 50%`) with `0.05s` overlap.

---

## 9. Accelerating Vertical Slot-Machine Drum

Display an asymmetric split (`33% X` stationary preview node / `67% X` 3-row masked vertical label drum):
- Mask top/bottom edges (`linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%)`).
- Hold **3 readable detents** (`0.5–0.7s` each), then accelerate exponentially (`EASE_IN_EXPO`) wrapped in `<DirectionalMotionBlur blurX={0} blurY={drumBlurY}>` so rows streak strictly vertically.

---

## 10. Direct-Manipulation Live Slider Scrub (Forward + Back)

Prove a parameter is genuinely live by scrubbing **both forward AND back**: arrive on thumb → dwell `0.08–0.10s` (grab anticipation) → drag right (`EASE_HUMAN_MOTOR`) → brief pause → drag back left while modulating scale/shader/layout 1:1 on every frame.

---

## 11. 1-to-1 Connected Node Wire + Traveling Signal Pulse

Keep wired close-ups strictly **1-to-1 Left → Right** (`Input Node → ConnectedNodeWire → Output Node` from `templates/StudioPrimitives.tsx`): animate `drawProgress` (`0 → 1`) and fire a bright traveling pulse bead (`pulseProgress: 0 → 1`) right before the output rows highlight.

---

## 12. Selective Depth-of-Field Focus Frame & 3D Cover-Flow Deck

- **Selective DOF Frame:** Render the full-bleed subject at `filter: "blur(24px)"` behind a centered brand-accented frame clipping the **pixel-identical** subject at `0px` blur with crisp vector tracking boxes overlaid.
- **3D Cover-Flow Deck:** Apply `perspective: 1100`; keep the active hero card flat (`rotateY(0deg)`, `scale(1.06)`) and angle flanking cards at `rotateY(±38deg)` with progressive `translateZ` recession.

---

## 13. Hard-Cut `3.2×` Macro Typing & Button Punch-In

Never leave 12–14px chat text tiny on mobile X: establish the wide chat bar (`0.4–0.6s`) → **hard-cut (`0f` crossfade)** to a `3.2×` scaled close-up tracking the typing caret (`88–104px` apparent font size) → hard-cut back wide (or cut to a `3.5×` macro submit click `scale: 1 → 0.84 → 1`).

---

## 14. MCP Retrieval Strobe + Live Tabular Counter HUD

Replace dead AI loading spinners with a `1.4–1.6s` sensory montage: `0.55s` linear-gradient `background-clip: text` shimmer row → **3 full-bleed high-contrast identity frames** (`0.4s` each on eighth-note beats) with a frosted pill HUD pinned bottom-center (`bottom >= 90px`) running a `tabular-nums` library counter.

---

## 15. Card-to-Prompt-Chip Spatial Docking

Display a 5-card result shelf; when the cursor hovers (`-4px` lift + brand border) and clicks card #3, fade siblings (`0.35s`, `EASE_OUT_EXPO`) while interpolating card #3's `(left, top, width, height, borderRadius)` along `EASE_IN_OUT_QUINT` directly into a `68×68px` docked chip inside the multi-turn prompt box.

---

## 16. Inline Brand-Icon Slot-Swap Headline

Lock the `[SLOT]` inside a fixed-width `inline-flex` box (`width: 88px`, `height: 84px`, `overflow: "hidden"`) inside a centered 2-line Display Serif headline so swapping `AI → OpenAI → Claude → Cursor` every `~0.7s` produces **zero horizontal baseline jitter**.

---

## 17. Legacy-Stack-to-Hero Replacement Dock

Rack-focus a soft contextual plate (`blur: 0 → 12px`) while a horizontal dock of incumbent software tiles (`Pr`, `Ae`, `FCP`, `DaVinci`) whips across a centered baseline with horizontal `<DirectionalMotionBlur blurX={...} blurY={0}>`, decelerating (`EASE_OUT_EXPO`) onto the hero product mark dead-center → dark circular iris wipe into the next scene.

---

## 18. Connected Vertical Agent Execution Tree

Dock the submitted prompt at top-right as a chat bubble while mounting a vertical 5-step execution spine on the left. Stagger step completions (`0.38–0.48s` each): draw a `1.5px` vertical hairline down to each row, spin a dashed ring (`0.25s`), then pop a solid completion checkmark (`SPRING_POP`). **Complete every step** into a `"Ready · 0:30"` badge (`tabular-nums`) and cut within `0.35s`.

---

## 19. Meta "Film-Inside-a-Film" Timeline Assembly Reveal

Pair a focal-locked generated preview (`top 62%`) with a multi-track NLE timeline (`bottom 32%`: `VIDEO`, `MOTION`, `VOICE`, `AUDIO`). Snap clips into place (`SPRING_SNAPPY`, `0.06s` stagger) as a vertical playhead sweeps across tracks, driving **real live UI state progression** inside the preview frame 1:1 with the playhead.

---

## 20. Multiplayer Agent Cursor Swarm + Convergence Match-Cut

Center a high-contrast two-tone thesis with live caret type-over inside safe margins. Orbit 4 color-coded role cursor pills (`Script`, `3D Stage`, `Voice`, `Audio Mix`) along smooth deterministic perimeter arcs (zero overlap with center copy), then converge all 4 inward (`EASE_IN_EXPO`, `0.35s`) into the centered brand emblem → fast (`<= 0.9s`) wordmark reflow + `2.8s` CTA hold.

---

## 21. Multi-Artboard Freeform Canvas Choreography (`hera-ad-canvas`)

Prove parallel creative generation **without node-wire spaghetti** on an airy `#F6F6F5` infinite dot-grid (`radial-gradient(rgba(17,17,20,0.14) 1.5px, transparent 1.5px)`, `backgroundSize: "28px 28px"`):
1. **Stacked Parallel Prompt Entry (`1.5–1.8s`)**: Stack 3 floating prompt cards center-frame typing distinct briefs concurrently (`"Use brand font"`, `"Create 1:1 & 9:16 formats"`, `"Make ad editable"`).
2. **Camera Pull-Out + Agent Fan-Out (`0.45s`, `EASE_IN_OUT_QUINT`)**: Pull `<SpatialCameraRig>` out (`zoom: 1.25 → 0.78`) as **3 dark-pill agent cursors** glide to separate canvas zones.
3. **Mixed-Aspect Artboard Spawns + Radial Dot-Grid Ripples**: Spawn heterogeneous commercial artboards (`16:9`, `1:1`, `4:5`, `9:16`) staggered by `0.25–0.35s` (`SPRING_EDITORIAL`) while pulsing a localized radial brand-tint ripple (`scale: 0.6 → 1.35`, `opacity: 0.35 → 0`) directly beneath each generating artboard on the dot grid.

---

## 22. URL-to-Brand-Kit Radial Bloom (`hera-ad-canvas`)

Replace boring brand-settings forms with a `3.5s` spatial visual explosion on the dot-grid canvas:
1. Keep a single centered prompt card (`"Set up our brand for yourbrand.com"`) as the spatial anchor; fast-type the URL (`0.9s`) and click submit (`0.15s`).
2. On submit, pulse a soft dot-grid ripple from center and spring **4 modular Brand System artboards** radially outward into the four quadrants (`0.12s` stagger, `SPRING_EDITORIAL`, inner labels following `+0.08s` via `computeSecondarySettle`):
   - **Top-Left / Top-Center (`Colors`)**: 5 circular brand swatches + hex tokens (`tabular-nums`).
   - **Top-Right (`Logo`)**: Clean brand mark & wordmark lockup tile.
   - **Bottom-Left (`Type`)**: Display + body font specimen tile.
   - **Bottom-Right (`Starter Set`)**: Hero on-brand product creative preview.
3. Hold rock-solid for **`1.2s`** at `0px` drift so viewers can read the brand kit effortlessly.

---

## 23. Reference-to-Brand In-Place Ad Transmutation (`hera-ad-canvas`)

Prove layout-preserving style transfer visually without a single explanation sentence:
1. Fan 3 heterogeneous third-party reference ads onto the dot-grid (`9:16` comparison layout, `1:1` hero callout, `4:5` split showcase) over `0.45s` (`SPRING_EDITORIAL`).
2. Glide cursor to tap the reference cluster (`0.20s` press + ripple).
3. Keep all 3 artboards **strictly locked at their exact `(x, y, width, height)` coordinates** while sweeping a localized brand-accent shimmer band (`0.35s` sweep, `0.15s` stagger across cards) that flips each card's `clipPath` in-place from reference styling into the user's cohesive brand colors, typography, and product imagery—preserving 1:1 layout skeletons. Hold **`1.1s`** for instant comparison payoff.

---

## 24. Static-to-Motion Side-by-Side Split → Full-Bleed Ad Zoom & Panorama Sweep (`hera-ad-canvas`)

Never leave generated creatives trapped tiny inside tool chrome—bridge tool proof seamlessly into a full-bleed commercial payoff:
1. **Side-by-Side Static → Motion Proof (`3.5–4.5s`)**: Anchor the frozen static `4:5` source ad at `36% X` on the dot-grid with a docked prompt bar (`Animation` mode + attached filename chip + `"Animate this ad"`). On submit, spawn a brand-framed companion artboard at `64% X` that plays **live kinetic typography + animated product motion** directly beside the frozen original.
2. **Canvas-to-Full-Bleed Ad Zoom (`0.55–0.75s`, `EASE_IN_OUT_QUINT`)**: Drive `<SpatialCameraRig>` directly onto the animated companion artboard center (`zoom: 1.0 → viewport-fill`, fading tool chrome `opacity: 1 → 0` over the first `0.25s`) so the creative becomes a full-bleed `1920×1080` commercial with zero jarring cut.
3. **Canvas Panorama Masonry Sweep (`2.0–2.8s`)**: Hard-cut to an edge-to-edge dark masonry wall packing `15+` finished `16:9`, `1:1`, `4:5`, and `9:16` ads, panning smoothly with subtle `0.25s` beat-locked scale pulses before snapping into the final Brand Lockup + CTA URL hold.

---

## 25. Architectural `<ViewfinderFrame>` & `<RollingOdometer>` (`architectural-archive`)

When a product calls for technical authority rather than bubbly SaaS cards, frame demos with sharp `0px` viewfinder geometry and mechanical rolling counters from [templates/StudioPrimitives.tsx](../templates/StudioPrimitives.tsx):
- **Viewfinder Reticles**: Wrap real `<OffthreadVideo>`, screenshots, or crisp UI inside `<ViewfinderFrame indexLabel="0001 / 0004" metaLabel="LIVE CAPTURE">` — adds four L-shaped corner brackets and a hairline mono metadata header with zero rounded clutter.
- **Rolling Digit Reels**: Replace plain incrementing strings with `<RollingOdometer value={3326} startFrame={g.beat(16)} durationSec={0.65} />` so each digit place rolls vertically on its own `0.045s`-staggered `EASE_OUT_EXPO` reel with rock-solid `tabular-nums`.

---

## 26. Physical Desk Flat-Lay / Real-Device Hybrid Staging

One of the highest-performing launch patterns on X (e.g., mobile & AI assistant drops hitting `100K+` views) grounds software inside **physical reality** rather than floating screens in space:
1. Stage an overhead desk flat-lay or hands-on device photo/video (`<Img>` or `<OffthreadVideo>`) filling the full `1920×1080` viewport.
2. Track `<SpatialCameraRig>` smoothly onto the physical device screen (`zoom: 1.0 → 1.9×`, `EASE_IN_OUT_QUINT`) while compositing a sharp `1px` `<ViewfinderFrame>` callout or live kinetic caption inside the `120×90px` safe zone.
3. Pair every physical tap or switch inside the footage with a sample-0 trimmed real foley click (`sfx/click-01..03.wav`) so motion and sound feel physically welded together.

---

## 27. Dark-Mode macOS Desktop Window on Light `<StudioCyclorama />` + Multi-Token Syntax Diff

Never float a washed-out white code editor on a `#F9F9F8` / `#FFFFFF` studio canvas, and never fade in diff lines from `opacity: 0` (which creates ugly vertical blank holes mid-file). Stage developer tools and code editors with high-contrast hardware precision:
1. **Light Studio Stage + Dark macOS App Contrast**: Mount `<StudioCyclorama />` (`#FFFFFF → #F9F9F8 → #F1F1EC` curved linear studio wall + subtle `30px` dot-grid) as the outer gallery stage, and float the desktop app in obsidian macOS chrome (`#0D0D10` body, `#16161B` titlebar, real `#FF5F56` / `#FFBD2E` / `#27C93F` traffic lights, `1px` top specular hairline `rgba(255,255,255,0.12)`, and deep grounded shadow `0 44px 110px rgba(20,20,19,0.22)`).
2. **Real Multi-Token Syntax Highlighting (Zero Skeleton Bars)**: Tokenize every visible code line with genuine IDE colors (violet keywords `#C084FC`, sky functions `#60A5FA`, teal types `#2DD4BF`, amber strings `#FBBF24`, muted comments `#71717A`) — never fake monochrome strings or gray placeholder skeleton rectangles.
3. **Zero Blank-Gap Diff Choreography**: Keep 100% of surrounding context lines + old implementation visible from frame 0. Animate the diff via left-border emerald highlight (`#22C55E`) and subtle `translateY(4px → 0)` + background tint reveal (`rgba(34,197,94,0.13)`) over `0.22s` (`EASE_OUT_EXPO`) — zero empty vertical voids.
4. **High-Contrast Cursor Inversion**: Switch the studio cursor cleanly to crisp white-fill with dark stroke when operating over dark macOS chrome (`#0D0D10`), and click a real workflow CTA (e.g., `Commit & push · Open PR` → live badge flip `PR #412 Opened ✓`) synced to `sfx/click-01.wav` + `sfx/pop-subtle.wav`.

---

## 28. Camera-Coupled `<StudioCyclorama />` & 2-Plane Optical Z-Depth Parallax

Keep clean light-mode scenes feeling dimensional like filmed studio motion graphics (Apple / Linear / Vercel caliber) rather than flat Keynote slides — **without** adding noisy particles or blurred glow orbs:
1. **Camera-Coupled Background Plane (`<StudioCyclorama />`)**: Pass live camera zoom & pan (`panX = -cameraX * 0.14`, `zoom = 1 + (cameraZoom - 1) * 0.35`) into `<StudioCyclorama />` from [templates/StudioPrimitives.tsx](../templates/StudioPrimitives.tsx) so the `30px` architectural dot-grid tracks physically with every push, pan, and whip transition.
2. **2-Plane Optical DOF Layering**: On hero hooks and floating card showcases, pair 3–4 sharp foreground cards (`100%` opacity, crisp official vector brand SVGs, `1.0×` parallax) with 3–4 soft-focus background cards (`filter: blur(1.8px)`, `opacity: 0.34`, `scale: 0.78`, `0.62×` parallax) drifting slowly along the camera axis.
3. **Rule of 1 Low-Text Discipline**: Keep at most `2–5` bold words per beat and zero parked idle seconds — every visual frame is either arriving, executing a real interaction, or pushing into the next beat.
