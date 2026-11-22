# Motion Design System for X Launch Videos

Principles, canonical physics constants, hierarchical secondary motion, true directional blur, optical typography craft, race-free font loading, and high-speed film grain for studio-grade 15–60s launch films in Remotion.

> **Single Source of Truth:** All constants below match [templates/motion.ts](../templates/motion.ts) and [templates/StudioPrimitives.tsx](../templates/StudioPrimitives.tsx) verbatim. Never drift spring or easing numbers across compositions.

---

## 1. The Frame-0 Scroll-Stopper & FPS-Agnostic Timing Law

X timelines auto-play silently while users scroll rapidly. If frames `0–15` are dark or empty, viewers scroll past.

- **Immediate visual presence**: At `frame = 0`, typography is already mid-arrival (`progress >= 0.35`) or the product visual is cleanly framed. Never fade up from black.
- **Punchy opening**: Reveal Line 1 of the hook within `0.0–0.4s`, Line 2 within `0.15–0.6s`.
- **Word count ceiling**: Maximum **5–7 words** across 1–2 lines, in **sentence case** (avoid ALL-CAPS shouting unless typographic poster climax).
- **100% FPS-Agnostic Timing**: Never hardcode raw 30fps frame numbers (`32`, `70`, `88`, `120`). Drive every cue from `createBeatGrid(bpm, fps)` or `sec(seconds, fps)` so `24p`, `30p`, and `60p` renders stay temporally identical:

```ts
export const sec = (seconds: number, fps: number): number => Math.round(seconds * fps);
export const durSec = (seconds: number, fps: number): number => Math.max(1, Math.round(seconds * fps));
```

---

## 2. Canonical Easing, Springs & Motion Temperaments

Never use linear easing for UI reveals or camera moves, and avoid rubbery cartoon bounce. Use these **exact canonical constants** (identical to `templates/motion.ts`):

```ts
import { Easing } from "remotion";

export const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
export const FONT_SERIF = "'Instrument Serif', 'Playfair Display', Georgia, serif";
export const FONT_MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

// Heavily damped studio editorial settle (zero cartoon overshoot — default for SaaS & UI)
export const SPRING_EDITORIAL = { damping: 28, stiffness: 180, mass: 0.9 } as const;

// Snappy micro-interactions (buttons, chips, cursor focus, cards)
export const SPRING_SNAPPY = { damping: 24, stiffness: 200, mass: 0.8 } as const;

// Larger focal panels & 3D stage entrances
export const SPRING_SMOOTH = { damping: 28, stiffness: 120, mass: 1.0 } as const;

// Expressive pop (inline thumbnails, checkmarks, notification badges)
export const SPRING_POP = { damping: 18, stiffness: 240, mass: 0.72 } as const;

// Custom Cubic Beziers (camera pushes, masks, motor drags, velocity-matched cuts)
export const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);        // Fast arrival, silky stop
export const EASE_IN_EXPO = Easing.bezier(0.7, 0, 0.84, 0);         // Fast acceleration into hard cut
export const EASE_IN_OUT_QUINT = Easing.bezier(0.83, 0, 0.17, 1);   // Macro camera pushes & theme flips
export const EASE_HUMAN_MOTOR = Easing.bezier(0.45, 0, 0.55, 1);    // Tactile slider drags & human scrubs
```

### Asymmetric Hold-Budget Law
Amateurs spend `0.75s` sliding a card in and `0.45s` holding it. Senior studio edits invert that ratio:
- **Transitions & snaps**: **`0.15s – 0.30s`** (`EASE_OUT_EXPO` / `EASE_IN_OUT_QUINT` / `SPRING_EDITORIAL`).
- **Readability holds**: **`0.75s – 1.35s`** at `0px` drift and `0px` blur so the eye actually registers the copy and UI proof (`2.5–3.2s` CTA URL hold).
- **Single-feature UI hero beat**: **`2.0s – 2.6s`** total (`0.22s` snap-in + `0.7s` before state + `0.6s` live interaction + `0.85s` after proof).

### Foveal Anchor Discipline (Zero Eye Hunting)
Across rapid multi-cut edits, restrict focal movement to **only three screen zones**:
1. **Center Anchor (`50%, 50%`)**: Default for `75–80%` of shots.
2. **Asymmetric Split (`33% X` visual / `68% X` typography)**: Sustained slot-machine / feature carousels.
3. **Causal Pair (`36% X` input → `64% X` output)**: Wired node pipelines or static→motion side-by-side splits.

---

## 3. Secondary Motion & Hierarchical Settle Principles

Flat rigid-body motion (moving an entire card + its title + its badge as one frozen bitmap) feels templated. Layer **hierarchical follow-through** and **causal state feedback**:

1. **Container-First, Content-Second (`+2–3f` / `+0.07–0.10s`)**:
   - The outer card/modal settles at `t = startFrame` (`16–24px` travel, scale `0.96 → 1.0`).
   - Inner content (eyebrow, title, metric, CTA pill) follows **`+0.07–0.10s`** later with smaller, calmer travel (**`6–12px`**), giving cards genuine physical mass without looking sluggish:
   ```ts
   export const computeSecondarySettle = (
     frame: number,
     startFrame: number,
     fps: number,
     offsetSec = 0.08,
     travelPx = 8
   ) => {
     const progress = spring({
       frame: Math.max(0, frame - (startFrame + sec(offsetSec, fps))),
       fps,
       config: SPRING_EDITORIAL,
     });
     return {
       progress,
       translateY: (1 - progress) * travelPx,
       opacity: Math.min(1, progress * 1.25),
     };
   };
   ```
2. **Causal Micro-State Reactions**:
   - **Pre-click hover (`-0.15s` before click)**: Subtle card lift (`-3px`), elevation shadow deepening, and `1px → 2px` active border crispness as the cursor arrives.
   - **Click depression (`0.0–0.10s`)**: Scale dip (`1.0 → 0.88 → 1.0`) paired with an expanding ripple ring and immediate state flip (button color, active status dot, badge pop via `SPRING_POP`).
   - **Focus lock**: Dim secondary siblings to `0.45–0.65` opacity (or `blur(2px)`) while the focused control gains a crisp brand-accent ring.
3. **Stagger Restraint**: `0.03–0.07s` (`1–2f @ 30p`) inside tight card/row groups; `0.13–0.18s` between headline lines. Never exceed `0.14s` inside one cohesive list or the eye fractures.

---

## 4. True Directional Velocity Motion Blur

Isotropic CSS `filter: blur(12px)` turns horizontal whip-pans into muddy blobs. Always compute separate **`(blurX, blurY)`** velocities normalized to FPS, and render them through an SVG `<feGaussianBlur stdDeviation="${blurX} ${blurY}" />` filter—dropping strictly to **`0` (`filter: undefined`)** at rest:

```tsx
export const computeVelocityBlur = (
  currentX: number,
  currentY: number,
  prevX: number,
  prevY: number,
  fps = 30,
  sensitivity = 0.08,
  maxBlurPx = 14
) => {
  const fpsScale = fps / 30;
  const vx = Math.abs(currentX - prevX) * fpsScale;
  const vy = Math.abs(currentY - prevY) * fpsScale;
  const threshold = 1.5;
  return {
    blurX: vx < threshold ? 0 : Math.min(maxBlurPx, (vx - threshold) * sensitivity),
    blurY: vy < threshold ? 0 : Math.min(maxBlurPx, (vy - threshold) * sensitivity),
  };
};
```

Wrap fast-moving layers with `<DirectionalMotionBlur blurX={blurX} blurY={blurY}>` from [templates/StudioPrimitives.tsx](../templates/StudioPrimitives.tsx):
- **Horizontal whip-pans**: `blurX > 0, blurY = 0` → clean horizontal optical streak.
- **Vertical slot drums**: `blurX = 0, blurY > 0` → authentic vertical reel streak.
- **Holding frames**: `blurX = 0, blurY = 0` → SVG filter unmounted (`filter: undefined`) for 100% razor-sharp pixels and zero GPU cost.

---

## 5. Race-Free Mandatory Webfont Loading

Declaring `fontFamily: "'Inter', sans-serif"` without awaiting loaded font faces causes headless Chromium to silently fall back to Segoe UI / DejaVu Sans.

### Option A: `@remotion/google-fonts` (#1 Recommended — Zero Race Condition)
```ts
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: FONT_SANS } = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
export const { fontFamily: FONT_SERIF } = loadInstrumentSerif("italic", {
  weights: ["400"],
  subsets: ["latin"],
});
export const { fontFamily: FONT_MONO } = loadJetBrainsMono("normal", {
  weights: ["500", "600"],
  subsets: ["latin"],
});
```

### Option B: Zero-Dependency Race-Free Loader (`ensureStudioFonts`)
Never call `document.fonts.ready` right after `document.head.appendChild(link)`—`document.fonts.ready` resolves *immediately* before the `<link>` CSS finishes downloading! Always await **`link.onload` AND `Promise.all(specs.map(s => document.fonts.load(s)))`** with a safe offline timeout fallback (canonical implementation in [templates/motion.ts](../templates/motion.ts)):

```ts
const stylesheetLoaded = new Promise<void>((resolve) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = STUDIO_FONTS_URL;
  link.onload = () => resolve();
  link.onerror = () => resolve();
  document.head.appendChild(link);
});

const loadAllFaces = stylesheetLoaded.then(async () => {
  if (!("fonts" in document)) return;
  await Promise.all(
    STUDIO_FONT_SPECS.map((spec) => document.fonts.load(spec).catch(() => undefined))
  );
  await document.fonts.ready;
});

Promise.race([loadAllFaces, new Promise<void>((r) => setTimeout(r, 3500))]).then(finish, finish);
```

---

## 6. Optical Typography Craft & X Safe Zones (`1920×1080`)

Design for **mobile portrait X feeds**, where `1920×1080` scales down ~5× to `~360–400 CSS px` wide.

| Role | Size (`1920×1080`) | Weight | Optical Tracking | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| Display / Hero (`>= 100px`) | `100px – 180px` | `700 – 800` | `-0.04em` to `-0.055em` | `0.94 – 1.04` |
| Hook Headline | `88px – 112px` | `600 – 700` | `-0.035em` | `1.04` |
| Editorial Italic Accent | `+6–10%` larger than sans | `400 italic` | `-0.015em` | `1.0` |
| Section Headline | `64px – 82px` | `600 – 700` | `-0.03em` | `1.08` |
| Subtitle / Body UI | `32px – 40px` | `400 – 500` | `-0.01em` to `0em` | `1.34 – 1.40` |
| Mono Spec / Pill / URL | `22px – 28px` | `500 – 600` | `+0.02em` to `+0.06em` | `1.0` |

### Mandatory Optical Typography Rules
1. **`tabular-nums` Everywhere Numbers Animate**: Apply `fontVariantNumeric: "tabular-nums"` to **every** animated counter, timer, timecode (`00:08.15`), percentage, metric badge, and card index so digits never jitter horizontally mid-roll.
2. **Tracking Scales With Font Size**: Tighten tracking smoothly as type grows (`-0.045em` at `120px`, `-0.02em` at `32px`, `+0.04em` for uppercase `18–22px` mono labels). Never apply `-0.04em` to small `20px` UI labels.
3. **Optical Alignment & Hanging Punctuation**: Pull opening quotation marks (`“`) or leading punctuation slightly outside the left text axis (`textIndent: "-0.38em"` or hanging span), and nudge curved display letters (`O`, `C`, `S`) or `44px+` vertical stacks cleanly into alignment with flush edges.
4. **Strict 16:9 + X-Feed Crop-Safe Composition**: Keep all readable copy, cursor labels, HUD pills, and URLs inside **`120px` horizontal × `90px` vertical** margins (`1680 × 900` safe box) — clearing X's bottom timeline scrubber, mute button, and rounded feed card corners. Keep hero headlines inside the central `1360 × 760` optical core so even cropped social thumbnails frame cleanly.

---

## 7. High-Speed Tiled Deterministic Film Grain (H.264 Anti-Banding)

Per-frame full-HD `1920×1080` SVG `<feTurbulence>` recomputes 2M noise pixels on every frame in headless Chromium, slowing renders 5–10×. Instead, use a **pre-encoded `128×128` tileable noise data-URI** shifted deterministically via `backgroundPosition` every ~`1/15s` (canonical implementation in [templates/StudioPrimitives.tsx](../templates/StudioPrimitives.tsx)):

```tsx
const GRAIN_TILE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="7" stitchTiles="stitch"/></filter>` +
    `<rect width="128" height="128" filter="url(#n)"/>` +
  `</svg>`
);

export const FilmGrainOverlay: React.FC<{ frame: number; fps?: number; opacity?: number }> = ({
  frame,
  fps = 30,
  opacity = 0.025,
}) => {
  const step = Math.floor(frame / Math.max(1, Math.round(fps / 15)));
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,${GRAIN_TILE_SVG}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        backgroundPosition: `${(step * 47) % 128}px ${(step * 73) % 128}px`,
      }}
    />
  );
};
```
