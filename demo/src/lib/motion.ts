import { continueRender, delayRender, Easing, interpolate, spring } from "remotion";

export const FONT_SANS =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const FONT_SERIF =
  "'Playfair Display', 'Instrument Serif', Georgia, 'Times New Roman', serif";

export const FONT_MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

// Heavily damped editorial settle (zero cartoon bounce — default for SaaS & UI)
export const SPRING_EDITORIAL = {
  damping: 28,
  stiffness: 180,
  mass: 0.9,
};

export const SPRING_SNAPPY = {
  damping: 22,
  stiffness: 170,
  mass: 0.85,
};

export const SPRING_SMOOTH = {
  damping: 26,
  stiffness: 110,
  mass: 1.0,
};

export const SPRING_POP = {
  damping: 16,
  stiffness: 220,
  mass: 0.7,
};

export const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_EXPO = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_IN_OUT_QUINT = Easing.bezier(0.83, 0, 0.17, 1);
export const EASE_HUMAN_MOTOR = Easing.bezier(0.45, 0, 0.55, 1);

/**
 * Zero-dependency deterministic webfont loader for headless Chromium renders.
 * Prevents silent fallback to Segoe UI / Arial; resolves gracefully offline.
 */
let studioFontsRequested = false;
export const ensureStudioFonts = () => {
  if (studioFontsRequested || typeof document === "undefined") return;
  studioFontsRequested = true;

  const handle = delayRender("Loading studio webfonts");
  const finish = () => continueRender(handle);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600&family=Playfair+Display:wght@600;700;800&display=swap";
  document.head.appendChild(link);

  Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ]).then(finish, finish);
};

/**
 * Deterministic BPM-to-frame beat grid helper.
 */
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
 * Exact focal-lock 2D camera math (requires transformOrigin: "0 0").
 * Maps any world coordinate (wx, wy) directly to viewport center at any zoom.
 */
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

/**
 * Velocity-coupled directional blur helper: 0px at rest, optical streak in motion.
 */
export const computeVelocityBlur = (
  currentVal: number,
  prevVal: number,
  sensitivity = 0.08,
  maxBlurPx = 14
): number => {
  const speed = Math.abs(currentVal - prevVal);
  return speed < 1.5 ? 0 : Math.min(maxBlurPx, (speed - 1.5) * sensitivity);
};

/**
 * Deterministic natural-cadence typewriter length (micro-pauses at spaces/punctuation).
 */
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
      ch === " " ? 1.45 : ch === "," || ch === "." ? 2.1 : 0.84 + ((cursor * 7) % 5) * 0.07;
    accFrames += baseFramesPerChar * weight;
    if (accFrames > elapsed) break;
    cursor++;
  }
  return cursor;
};

/**
 * Crisp deterministic caret blink (solid while typing, rhythmic blink at rest).
 */
export const getCaretOpacity = (frame: number, isTyping: boolean, fps = 30): number => {
  if (isTyping) return 1;
  return Math.sin((frame / fps) * Math.PI * 3.2) > -0.15 ? 1 : 0;
};

export interface SceneEnvelope {
  localFrame: number;
  enter: number;
  exit: number;
  opacity: number;
  translateY: number;
  scale: number;
  visible: boolean;
}

/**
 * Computes deterministic enter/exit motion for a scene window.
 * Keeps transitions crisp and avoids abrupt cuts.
 */
export const getSceneEnvelope = ({
  frame,
  fps,
  startFrame,
  durationFrames,
  instantStart = false,
  exitFrames = Math.round(fps * 0.4),
}: {
  frame: number;
  fps: number;
  startFrame: number;
  durationFrames: number;
  instantStart?: boolean;
  exitFrames?: number;
}): SceneEnvelope => {
  const localFrame = frame - startFrame;
  const visible = localFrame >= -2 && localFrame <= durationFrames + 2;

  const enter = instantStart
    ? 1
    : spring({
        frame: Math.max(0, localFrame),
        fps,
        config: SPRING_SNAPPY,
        durationInFrames: Math.round(fps * 0.6),
      });

  const exitStart = Math.max(1, durationFrames - exitFrames);
  const exit = interpolate(localFrame, [exitStart, durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const enterOpacity = instantStart
    ? 1
    : interpolate(localFrame, [0, Math.round(fps * 0.25)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const opacity = enterOpacity * (1 - exit);
  const translateY = (1 - enter) * 28 - exit * 20;
  const scale = 0.975 + enter * 0.025 - exit * 0.02;

  return {
    localFrame,
    enter,
    exit,
    opacity,
    translateY,
    scale,
    visible,
  };
};
