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

export interface BoxGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

export const interpolateBoxGeometry = (
  a: BoxGeometry,
  b: BoxGeometry,
  progress: number
): BoxGeometry => ({
  x: a.x + (b.x - a.x) * progress,
  y: a.y + (b.y - a.y) * progress,
  width: a.width + (b.width - a.width) * progress,
  height: a.height + (b.height - a.height) * progress,
  radius: a.radius + (b.radius - a.radius) * progress,
});

export const computeHarmonicStagger = (
  index: number,
  baseDelaySec: number,
  fps: number,
  exponent = 0.8
): number => Math.round(Math.pow(Math.max(0, index), exponent) * sec(baseDelaySec, fps));

// ============================================================================
// 4.6 Master Motion Design Math (Disney / Ben Marriott / Ordinary Folk / Kowalski)
// ============================================================================
export type MassSpringTier = "micro" | "card" | "device" | "stage";

export const getSpringForMass = (tier: MassSpringTier) => {
  switch (tier) {
    case "micro":
      return { damping: 22, stiffness: 260, mass: 0.55 } as const;
    case "card":
      return SPRING_SNAPPY;
    case "device":
      return { damping: 30, stiffness: 135, mass: 1.25 } as const;
    case "stage":
      return { damping: 32, stiffness: 105, mass: 1.45 } as const;
  }
};

export const computeAnticipationCurve = (
  frame: number,
  startFrame: number,
  fps: number,
  options?: { anticipationSec?: number; driveSec?: number; pullback?: number }
): number => {
  const antiFrames = durSec(options?.anticipationSec ?? 0.11, fps);
  const driveFrames = durSec(options?.driveSec ?? 0.28, fps);
  const pullback = options?.pullback ?? -0.11;

  if (frame <= startFrame) return 0;
  if (frame <= startFrame + antiFrames) {
    return interpolate(frame, [startFrame, startFrame + antiFrames], [0, pullback], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
  }
  return interpolate(
    frame,
    [startFrame + antiFrames, startFrame + antiFrames + driveFrames],
    [pullback, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    }
  );
};

export const computeVelocityDeformation = (
  currentX: number,
  currentY: number,
  prevX: number,
  prevY: number,
  fps = 30,
  sensitivity = 0.0022,
  maxStretch = 0.09
): { scaleX: number; scaleY: number } => {
  const fpsScale = fps / 30;
  const vx = Math.abs(currentX - prevX) * fpsScale;
  const vy = Math.abs(currentY - prevY) * fpsScale;
  const threshold = 2.0;

  const sx = vx < threshold ? 0 : Math.min(maxStretch, (vx - threshold) * sensitivity);
  const sy = vy < threshold ? 0 : Math.min(maxStretch, (vy - threshold) * sensitivity);

  const netX = 1 + sx - sy * 0.45;
  const netY = 1 + sy - sx * 0.45;

  return {
    scaleX: Number(netX.toFixed(4)),
    scaleY: Number(netY.toFixed(4)),
  };
};

export const interpolateQuadraticArc = (
  progress: number,
  from: { x: number; y: number },
  to: { x: number; y: number },
  arcLiftPx = -90,
  arcSidePx = 0
): { x: number; y: number } => {
  const t = Math.max(0, Math.min(1, progress));
  const inv = 1 - t;
  const ctrlX = (from.x + to.x) * 0.5 + arcSidePx;
  const ctrlY = Math.min(from.y, to.y) + arcLiftPx;
  return {
    x: inv * inv * from.x + 2 * inv * t * ctrlX + t * t * to.x,
    y: inv * inv * from.y + 2 * inv * t * ctrlY + t * t * to.y,
  };
};

export interface LayeredOverlapResult {
  shell: number;
  canvas: number;
  headline: number;
  badge: number;
}

export const computeLayeredOverlap = (
  frame: number,
  startFrame: number,
  fps: number,
  stepOffsetSec = 0.06
): LayeredOverlapResult => {
  const step = sec(stepOffsetSec, fps);
  return {
    shell: spring({
      frame: Math.max(0, frame - startFrame),
      fps,
      config: SPRING_SNAPPY,
    }),
    canvas: spring({
      frame: Math.max(0, frame - (startFrame + step)),
      fps,
      config: SPRING_EDITORIAL,
    }),
    headline: spring({
      frame: Math.max(0, frame - (startFrame + step * 2)),
      fps,
      config: SPRING_EDITORIAL,
    }),
    badge: spring({
      frame: Math.max(0, frame - (startFrame + step * 3)),
      fps,
      config: SPRING_POP,
    }),
  };
};

export const computeTriggerOriginStyle = (
  triggerX: number,
  triggerY: number,
  cardBox: { x: number; y: number; width: number; height: number }
): string => {
  const ox = Math.round(triggerX - cardBox.x);
  const oy = Math.round(triggerY - cardBox.y);
  return `${ox}px ${oy}px`;
};

export const enforceBeatCopyRestraint = (
  headline: string,
  maxWords = 4
): string => {
  const words = headline.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return words.slice(0, maxWords).join(" ");
};

export type CanonicalMorphShapeId =
  | "gemini-star"
  | "circle-orb"
  | "camera-aperture"
  | "squircle-card"
  | "compass-diamond"
  | "map-pin";

const MORPH_VERTEX_COUNT = 64;

const sampleCanonicalShapeRadius = (
  shape: CanonicalMorphShapeId,
  theta: number
): { r: number; yOffset?: number } => {
  switch (shape) {
    case "gemini-star": {
      const c = Math.abs(Math.cos(theta));
      const s = Math.abs(Math.sin(theta));
      const astroid = Math.pow(Math.pow(c, 0.58) + Math.pow(s, 0.58), -1 / 0.58);
      return { r: 22 + astroid * 78 };
    }
    case "circle-orb":
      return { r: 84 };
    case "camera-aperture":
      return { r: 82 + Math.cos(theta * 8) * 5.5 };
    case "squircle-card": {
      const n = 4.2;
      const denom = Math.pow(
        Math.pow(Math.abs(Math.cos(theta)), n) + Math.pow(Math.abs(Math.sin(theta)), n),
        1 / n
      );
      return { r: 82 / Math.max(0.001, denom) };
    }
    case "compass-diamond": {
      const c = Math.abs(Math.cos(theta));
      const s = Math.abs(Math.sin(theta));
      return { r: 86 / (c + s) };
    }
    case "map-pin": {
      const sinT = Math.sin(theta);
      const pinch = sinT > 0 ? Math.pow(sinT, 2.2) * 28 : 0;
      return { r: 74 + pinch, yOffset: -6 };
    }
  }
};

export const morphCanonicalSvgShapes = (
  shapes: readonly CanonicalMorphShapeId[],
  progress: number,
  center = 100,
  scale = 1
): string => {
  if (shapes.length === 0) return "";
  if (shapes.length === 1) {
    return morphCanonicalSvgShapes([shapes[0], shapes[0]], 0, center, scale);
  }

  const clamped = Math.max(0, Math.min(1, progress));
  const scaled = clamped * (shapes.length - 1);
  const idx = Math.min(shapes.length - 2, Math.floor(scaled));
  const localT = scaled - idx;
  const shapeA = shapes[idx];
  const shapeB = shapes[idx + 1];

  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < MORPH_VERTEX_COUNT; i++) {
    const theta = -Math.PI / 2 + (i / MORPH_VERTEX_COUNT) * Math.PI * 2;
    const a = sampleCanonicalShapeRadius(shapeA, theta);
    const b = sampleCanonicalShapeRadius(shapeB, theta);
    const r = (a.r + (b.r - a.r) * localT) * scale;
    const yOff = ((a.yOffset ?? 0) + ((b.yOffset ?? 0) - (a.yOffset ?? 0)) * localT) * scale;
    pts.push({
      x: center + Math.cos(theta) * r,
      y: center + Math.sin(theta) * r + yOff,
    });
  }

  return (
    pts
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(" ") + " Z"
  );
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
