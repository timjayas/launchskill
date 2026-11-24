import React from "react";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { Easing, interpolate, useCurrentFrame } from "remotion";

export interface CameraTrackedStrokeTipState {
  x: number;
  y: number;
  progress: number;
  drawnLength: number;
  totalLength: number;
}

export interface CameraTrackedStrokeProps {
  /** Unbroken SVG path data string to evolve and track. */
  d: string;
  /** Frame when stroke drawing begins (default 0). */
  startFrame?: number;
  /** Frame when stroke drawing completes (default 90). */
  endFrame?: number;
  /** Easing curve for stroke progress (default cubic in-out). */
  easing?: (t: number) => number;
  /** Camera zoom factor centered on the tracked focus point (default 1.6). */
  zoom?: number;
  /**
   * How tightly the camera centers on the live drawing tip vs `cameraAnchor`
   * (0 = fixed on anchor, 1 = locked to live tip; default 1).
   */
  followStrength?: number;
  /**
   * Deterministic camera follow lag/smoothing in [0, 0.92].
   * 0 = instantaneous tip lock; higher values produce smooth cameraman inertia (default 0.45).
   */
  cameraDamping?: number;
  /** Optional world-space resting anchor when `followStrength < 1`. */
  cameraAnchor?: { x: number; y: number };
  /** SVG viewport width in px (default 1920). */
  viewportWidth?: number;
  /** SVG viewport height in px (default 1080). */
  viewportHeight?: number;
  /** Live ink stroke color (default "#141413"). */
  strokeColor?: string;
  /** Live ink stroke width in world-space units (default 6). */
  strokeWidth?: number;
  /** Stroke linecap (default "round"). */
  strokeLinecap?: React.SVGProps<SVGPathElement>["strokeLinecap"];
  /** Stroke linejoin (default "round"). */
  strokeLinejoin?: React.SVGProps<SVGPathElement>["strokeLinejoin"];
  /** Optional subtle full-path guide stroke color underneath the live stroke. */
  guideStrokeColor?: string;
  /** Opacity of the optional guide stroke (default 0.14). */
  guideStrokeOpacity?: number;
  /** Stage background CSS color/gradient (default "transparent"). */
  background?: string;
  /** Show a drawing nib indicator at the live stroke tip (default true). */
  showNib?: boolean;
  /** Radius of the drawing nib circle in world-space units (default 7). */
  nibRadius?: number;
  /** Fill color of the drawing nib (defaults to `strokeColor`). */
  nibColor?: string;
  /** Render prop for dynamic world-space SVG elements synced to the live tip. */
  renderOverlay?: (tip: CameraTrackedStrokeTipState) => React.ReactNode;
  /** Static or custom world-space SVG children transformed by the same camera. */
  children?: React.ReactNode;
  /** Optional explicit frame override. */
  frame?: number;
  style?: React.CSSProperties;
  className?: string;
}

const DEFAULT_EASING = Easing.inOut(Easing.cubic);
const DAMPING_SAMPLE_WINDOW = 18;

const computeStrokeProgress = (
  frame: number,
  startFrame: number,
  endFrame: number,
  easing: (t: number) => number
): number => {
  if (endFrame <= startFrame) {
    return frame >= startFrame ? 1 : 0;
  }
  return interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
};

const safePointAtLength = (
  d: string,
  length: number,
  totalLength: number,
  fallback: { x: number; y: number }
): { x: number; y: number } => {
  if (!Number.isFinite(totalLength) || totalLength <= 0) {
    return fallback;
  }
  const clamped = Math.max(0, Math.min(totalLength, length));
  const pt = getPointAtLength(d, clamped);
  if (!pt || !Number.isFinite(pt.x) || !Number.isFinite(pt.y)) {
    return fallback;
  }
  return { x: pt.x, y: pt.y };
};

/**
 * Draws an unbroken live SVG stroke using `@remotion/paths` (`evolvePath`,
 * `getPointAtLength`, `getLength`) while smoothly translating and zooming a
 * deterministic SVG camera viewport to follow the live drawing nib.
 */
export const CameraTrackedStroke: React.FC<CameraTrackedStrokeProps> = ({
  d,
  startFrame = 0,
  endFrame = 90,
  easing = DEFAULT_EASING,
  zoom = 1.6,
  followStrength = 1,
  cameraDamping = 0.45,
  cameraAnchor,
  viewportWidth = 1920,
  viewportHeight = 1080,
  strokeColor = "#141413",
  strokeWidth = 6,
  strokeLinecap = "round",
  strokeLinejoin = "round",
  guideStrokeColor,
  guideStrokeOpacity = 0.14,
  background = "transparent",
  showNib = true,
  nibRadius = 7,
  nibColor,
  renderOverlay,
  children,
  frame: frameProp,
  style,
  className,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const trimmedPath = d.trim();
  const rawTotalLength = trimmedPath.length > 0 ? getLength(trimmedPath) : 0;
  const totalLength =
    Number.isFinite(rawTotalLength) && rawTotalLength > 0 ? rawTotalLength : 0;

  const fallbackPoint = {
    x: viewportWidth / 2,
    y: viewportHeight / 2,
  };

  const progress = computeStrokeProgress(frame, startFrame, endFrame, easing);
  const drawnLength = progress * totalLength;
  const tipPoint = safePointAtLength(
    trimmedPath,
    drawnLength,
    totalLength,
    fallbackPoint
  );

  // Deterministic exponential moving average over prior frames for smooth camera inertia.
  const clampedDamping = Math.max(0, Math.min(0.92, cameraDamping));
  let smoothedX = tipPoint.x;
  let smoothedY = tipPoint.y;

  if (clampedDamping > 0.001 && totalLength > 0) {
    let weightSum = 0;
    let accX = 0;
    let accY = 0;
    for (let k = 0; k <= DAMPING_SAMPLE_WINDOW; k++) {
      const sampleFrame = Math.max(0, frame - k);
      const sampleProgress = computeStrokeProgress(
        sampleFrame,
        startFrame,
        endFrame,
        easing
      );
      const samplePoint = safePointAtLength(
        trimmedPath,
        sampleProgress * totalLength,
        totalLength,
        tipPoint
      );
      const w = Math.pow(clampedDamping, k);
      accX += samplePoint.x * w;
      accY += samplePoint.y * w;
      weightSum += w;
    }
    if (weightSum > 0) {
      smoothedX = accX / weightSum;
      smoothedY = accY / weightSum;
    }
  }

  const anchor =
    cameraAnchor ??
    safePointAtLength(trimmedPath, totalLength * 0.5, totalLength, fallbackPoint);
  const clampedFollow = Math.max(0, Math.min(1, followStrength));
  const focusX = anchor.x + (smoothedX - anchor.x) * clampedFollow;
  const focusY = anchor.y + (smoothedY - anchor.y) * clampedFollow;

  const safeZoom = Number.isFinite(zoom) && zoom > 0.01 ? zoom : 1;
  const camTx = viewportWidth / 2 - focusX * safeZoom;
  const camTy = viewportHeight / 2 - focusY * safeZoom;

  // Safely evolve dasharray/dashoffset without NaN at progress === 0 or length === 0.
  let strokeDasharray: string | undefined;
  let strokeDashoffset: number | undefined;
  let drawVisible = false;

  if (totalLength > 0 && progress > 0) {
    const evolved = evolvePath(progress, trimmedPath);
    const offsetFinite = Number.isFinite(evolved.strokeDashoffset);
    if (offsetFinite && !evolved.strokeDasharray.includes("NaN")) {
      strokeDasharray = evolved.strokeDasharray;
      strokeDashoffset = evolved.strokeDashoffset;
      drawVisible = true;
    } else {
      strokeDasharray = `${totalLength} ${totalLength}`;
      strokeDashoffset = totalLength * (1 - progress);
      drawVisible = true;
    }
  }

  const tipState: CameraTrackedStrokeTipState = {
    x: tipPoint.x,
    y: tipPoint.y,
    progress,
    drawnLength,
    totalLength,
  };

  return (
    <svg
      width={viewportWidth}
      height={viewportHeight}
      viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background,
        overflow: "hidden",
        ...style,
      }}
    >
      <g transform={`translate(${camTx.toFixed(3)}, ${camTy.toFixed(3)}) scale(${safeZoom.toFixed(4)})`}>
        {children}

        {guideStrokeColor && totalLength > 0 && (
          <path
            d={trimmedPath}
            fill="none"
            stroke={guideStrokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap}
            strokeLinejoin={strokeLinejoin}
            opacity={guideStrokeOpacity}
          />
        )}

        {drawVisible && (
          <path
            d={trimmedPath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap}
            strokeLinejoin={strokeLinejoin}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        )}

        {showNib && totalLength > 0 && progress > 0 && (
          <circle
            cx={tipPoint.x}
            cy={tipPoint.y}
            r={Math.max(0.5, nibRadius)}
            fill={nibColor ?? strokeColor}
          />
        )}

        {renderOverlay ? renderOverlay(tipState) : null}
      </g>
    </svg>
  );
};
