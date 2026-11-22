import { continueRender, delayRender, Easing, interpolate, spring } from "remotion";

// ============================================================================
// 1. Canonical Typography Tokens (Single Source of Truth)
// ============================================================================
export const FONT_SANS =
  "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export const FONT_SERIF =
  "'Instrument Serif', 'Playfair Display', Georgia, serif";

export const FONT_MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

// ============================================================================
// 2. Canonical Spring & Easing Physics (Single Source of Truth)
// ============================================================================
/** Heavily damped studio editorial settle (zero cartoon overshoot — default for SaaS & UI) */
export const SPRING_EDITORIAL = {
  damping: 28,
  stiffness: 180,
  mass: 0.9,
} as const;

/** Snappy micro-interactions (buttons, chips, cursor focus, cards) */
export const SPRING_SNAPPY = {
  damping: 24,
  stiffness: 200,
  mass: 0.8,
} as const;

/** Larger focal panels & stage entrances */
export const SPRING_SMOOTH = {
  damping: 28,
  stiffness: 120,
  mass: 1.0,
} as const;

/** Expressive pop (inline thumbnails, checkmarks, notification badges) */
export const SPRING_POP = {
  damping: 18,
  stiffness: 240,
  mass: 0.72,
} as const;

export const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_EXPO = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_IN_OUT_QUINT = Easing.bezier(0.83, 0, 0.17, 1);
export const EASE_HUMAN_MOTOR = Easing.bezier(0.45, 0, 0.55, 1);

// ============================================================================
// 3. Brand Motion Temperament Profiles
// ============================================================================
export type MotionTemperamentId =
  | "taut-mechanical"
  | "editorial-fluid"
  | "tactile-snappy";

export interface MotionTemperament {
  id: MotionTemperamentId;
  primarySpring: { readonly damping: number; readonly stiffness: number; readonly mass: number };
  accentSpring: { readonly damping: number; readonly stiffness: number; readonly mass: number };
  secondaryOffsetSec: number;
  secondaryTravelPx: number;
  snapSec: number;
  holdMinSec: number;
}

export const MOTION_TEMPERAMENTS: Record<MotionTemperamentId, MotionTemperament> = {
  "taut-mechanical": {
    id: "taut-mechanical",
    primarySpring: SPRING_EDITORIAL,
    accentSpring: SPRING_SNAPPY,
    secondaryOffsetSec: 0.065,
    secondaryTravelPx: 6,
    snapSec: 0.18,
    holdMinSec: 0.85,
  },
  "editorial-fluid": {
    id: "editorial-fluid",
    primarySpring: SPRING_SMOOTH,
    accentSpring: SPRING_EDITORIAL,
    secondaryOffsetSec: 0.095,
    secondaryTravelPx: 10,
    snapSec: 0.26,
    holdMinSec: 1.1,
  },
  "tactile-snappy": {
    id: "tactile-snappy",
    primarySpring: SPRING_SNAPPY,
    accentSpring: SPRING_POP,
    secondaryOffsetSec: 0.075,
    secondaryTravelPx: 8,
    snapSec: 0.2,
    holdMinSec: 0.8,
  },
};

// ============================================================================
// 4. FPS-Agnostic Timing & Hierarchical Secondary Settle Helpers
// ============================================================================
/** Convert seconds to rounded frames so 24p, 30p, and 60p stay temporally identical. */
export const sec = (seconds: number, fps: number): number =>
  Math.round(seconds * fps);

/** Minimum 1-frame duration helper for interpolate / Sequence ranges. */
export const durSec = (seconds: number, fps: number): number =>
  Math.max(1, Math.round(seconds * fps));

/** Deterministic BPM-to-frame beat grid helper. */
export const createBeatGrid = (bpm: number, fps: number) => {
  const framesPerBeat = (60 / bpm) * fps;
  return {
    framesPerBeat,
    beat: (n: number) => Math.round(n * framesPerBeat),
    bar: (n: number) => Math.round(n * 4 * framesPerBeat),
    dur: (beats: number) => Math.max(1, Math.round(beats * framesPerBeat)),
  };
};

/**
 * Hierarchical secondary settle for inner card content / typography.
 * Outer container settles at `startFrame`; inner content follows +2-3f later
 * (`offsetSec` = 0.065-0.10s) with restrained 6-12px travel.
 */
export const computeSecondarySettle = (
  frame: number,
  startFrame: number,
  fps: number,
  offsetSec = 0.065,
  travelPx = 6
): { progress: number; translateY: number; opacity: number } => {
  const delayedStart = startFrame + sec(offsetSec, fps);
  const progress = spring({
    frame: Math.max(0, frame - delayedStart),
    fps,
    config: SPRING_EDITORIAL,
  });
  return {
    progress,
    translateY: (1 - progress) * travelPx,
    opacity: Math.min(1, progress * 1.25),
  };
};

// ============================================================================
// 5. Race-Free Deterministic Webfont Loader
// ============================================================================
const STUDIO_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap";

const STUDIO_FONT_SPECS = [
  "400 16px 'Inter'",
  "500 16px 'Inter'",
  "600 16px 'Inter'",
  "700 16px 'Inter'",
  "800 16px 'Inter'",
  "italic 400 16px 'Instrument Serif'",
  "400 16px 'Instrument Serif'",
  "500 16px 'JetBrains Mono'",
  "600 16px 'JetBrains Mono'",
];

let studioFontsRequested = false;

/**
 * Waits for stylesheet onload AND explicitly loads required weights via
 * `document.fonts.load(...)` before calling `continueRender`, with a safe
 * offline timeout fallback so headless renders never hang or fall back early.
 */
export const ensureStudioFontsRaceFree = (timeoutMs = 3500): void => {
  if (studioFontsRequested || typeof document === "undefined") return;
  studioFontsRequested = true;

  const handle = delayRender("Loading studio webfonts (race-free)");
  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    continueRender(handle);
  };

  const stylesheetLoaded = new Promise<void>((resolve) => {
    const existing = document.querySelector<HTMLLinkElement>(
      `link[data-studio-fonts="true"]`
    );
    if (existing) {
      resolve();
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = STUDIO_FONTS_URL;
    link.dataset.studioFonts = "true";
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });

  const loadAllFaces = stylesheetLoaded.then(async () => {
    if (!("fonts" in document)) return;
    await Promise.all(
      STUDIO_FONT_SPECS.map((spec) =>
        document.fonts.load(spec).catch(() => undefined)
      )
    );
    await document.fonts.ready;
  });

  const timeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));
  Promise.race([loadAllFaces, timeout]).then(finish, finish);
};

// ============================================================================
// 6. Exact Focal-Lock 2D Camera & True Directional Velocity Blur
// ============================================================================
export const computeCameraTransform = (
  wx: number,
  wy: number,
  zoom: number,
  viewportW = 1920,
  viewportH = 1080
) => ({
  x: viewportW / 2 - wx * zoom,
  y: viewportH / 2 - wy * zoom,
  scale: zoom,
});

export interface DirectionalBlurResult {
  blurX: number;
  blurY: number;
}

/**
 * Computes separate horizontal (vx) and vertical (vy) optical motion blur.
 * Normalized to 30fps velocity so 24p, 30p, and 60p produce identical streak length.
 * Drops strictly to { blurX: 0, blurY: 0 } at rest so holding frames stay razor-sharp.
 */
export const computeVelocityBlur = (
  currentX: number,
  currentY: number,
  prevX: number,
  prevY: number,
  fps = 30,
  sensitivity = 0.08,
  maxBlurPx = 14
): DirectionalBlurResult => {
  const fpsScale = fps / 30;
  const vx = Math.abs(currentX - prevX) * fpsScale;
  const vy = Math.abs(currentY - prevY) * fpsScale;
  const threshold = 1.5;

  return {
    blurX: vx < threshold ? 0 : Math.min(maxBlurPx, (vx - threshold) * sensitivity),
    blurY: vy < threshold ? 0 : Math.min(maxBlurPx, (vy - threshold) * sensitivity),
  };
};

// ============================================================================
// 7. Natural-Cadence Typewriter & Caret Helpers
// ============================================================================
export const getNaturalTypedLength = (
  text: string,
  frame: number,
  startFrame: number,
  charsPerSecond = 28,
  fps = 30
): number => {
  if (frame <= startFrame) return 0;
  const elapsed = frame - startFrame;
  const baseFramesPerChar = fps / charsPerSecond;

  let cursor = 0;
  let accFrames = 0;
  while (cursor < text.length) {
    const ch = text[cursor];
    const weight =
      ch === " "
        ? 1.45
        : ch === "," || ch === "."
          ? 2.1
          : 0.84 + ((cursor * 7) % 5) * 0.07;
    accFrames += baseFramesPerChar * weight;
    if (accFrames > elapsed) break;
    cursor++;
  }
  return cursor;
};

export const getCaretOpacity = (
  frame: number,
  isTyping: boolean,
  fps = 30
): number => {
  if (isTyping) return 1;
  return Math.sin((frame / fps) * Math.PI * 3.2) > -0.15 ? 1 : 0;
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const safeInterpolate = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  easing?: (t: number) => number
) =>
  interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
