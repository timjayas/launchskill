import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface PaperCutoutKeyframe {
  frame: number;
  x?: number;
  y?: number;
  rotate?: number;
  scale?: number;
  opacity?: number;
}

export interface PaperCutoutLayerProps {
  /** Stepped frame rate for stop-motion object animation (default 12fps). */
  objectFps?: number;
  /** Smooth native-fps camera X pan coordinate in px (default 0). */
  cameraX?: number;
  /** Smooth native-fps camera Y pan coordinate in px (default 0). */
  cameraY?: number;
  /** Smooth native-fps camera zoom multiplier (default 1). */
  cameraScale?: number;
  /** Parallax depth factor: 0 = locked backdrop, 1 = focal plane, >1 = foreground (default 1). */
  parallaxDepth?: number;
  /** Optional stepped object motion keyframes evaluated on the quantized objectFps clock. */
  objectKeyframes?: readonly PaperCutoutKeyframe[];
  /** Optional easing curve applied between objectKeyframes (default linear). */
  objectEasing?: (t: number) => number;
  /** Render callback receiving the quantized stepped frame (in composition frame units). */
  renderAtSteppedFrame?: (steppedFrame: number) => React.ReactNode;
  /** Plain children rendered inside the cutout layer. */
  children?: React.ReactNode;
  /** Crisp cut-paper edge width in px (0 disables rim; default 2.5). */
  rimWidth?: number;
  /** Cut-paper edge rim color (default "rgba(255, 252, 246, 0.94)"). */
  rimColor?: string;
  /**
   * How the crisp cut-paper rim is rendered:
   * - "silhouette": hugs arbitrary transparent SVG/cutout contours via crisp drop-shadow contour
   * - "box": applies CSS border on the cutout container
   * - "none": omits paper rim
   * Default: "box" when paperBackground is provided, otherwise "silhouette".
   */
  rimMode?: "silhouette" | "box" | "none";
  /** Optional paper stock fill color when using rectangular/clipped card cutouts. */
  paperBackground?: string;
  /** Optional CSS clip-path polygon/path for scissor-cut silhouettes. */
  clipPath?: string;
  /** Hard tactile drop-shadow horizontal offset in px (default 10). */
  shadowOffsetX?: number;
  /** Hard tactile drop-shadow vertical offset in px (default 14). */
  shadowOffsetY?: number;
  /** Hard tactile drop-shadow blur radius in px (keep low 0-6px for paper feel; default 3). */
  shadowBlur?: number;
  /** Hard tactile drop-shadow color (default "rgba(18, 16, 14, 0.28)"). */
  shadowColor?: string;
  /** Transform origin for stepped object rotation/scaling (default "center center"). */
  transformOrigin?: string;
  /** Optional explicit frame override. */
  frame?: number;
  /** Optional explicit fps override. */
  fps?: number;
  style?: React.CSSProperties;
  className?: string;
}

interface EvaluatedObjectPose {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
}

const IDENTITY_POSE: EvaluatedObjectPose = {
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
  opacity: 1,
};

const evaluateSteppedKeyframes = (
  keyframes: readonly PaperCutoutKeyframe[] | undefined,
  steppedFrame: number,
  easing: (t: number) => number
): EvaluatedObjectPose => {
  if (!keyframes || keyframes.length === 0) {
    return IDENTITY_POSE;
  }

  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
  const toPose = (kf: PaperCutoutKeyframe): EvaluatedObjectPose => ({
    x: kf.x ?? 0,
    y: kf.y ?? 0,
    rotate: kf.rotate ?? 0,
    scale: kf.scale ?? 1,
    opacity: kf.opacity ?? 1,
  });

  if (sorted.length === 1 || steppedFrame <= sorted[0].frame) {
    return toPose(sorted[0]);
  }

  const last = sorted[sorted.length - 1];
  if (steppedFrame >= last.frame) {
    return toPose(last);
  }

  let segIndex = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (steppedFrame >= sorted[i].frame && steppedFrame <= sorted[i + 1].frame) {
      segIndex = i;
      break;
    }
  }

  const a = toPose(sorted[segIndex]);
  const b = toPose(sorted[segIndex + 1]);
  const frameA = sorted[segIndex].frame;
  const frameB = sorted[segIndex + 1].frame;
  const span = frameB - frameA;
  const t =
    span <= 0
      ? 1
      : interpolate(steppedFrame, [frameA, frameB], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing,
        });

  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    rotate: a.rotate + (b.rotate - a.rotate) * t,
    scale: a.scale + (b.scale - a.scale) * t,
    opacity: a.opacity + (b.opacity - a.opacity) * t,
  };
};

/**
 * Decoupled 12fps stepped paper-cutout object motion inside a smooth native-fps
 * (30fps/60fps) parallax camera layer, finished with crisp cut-paper edges and
 * a hard tactile drop shadow.
 */
export const PaperCutoutLayer: React.FC<PaperCutoutLayerProps> = ({
  objectFps = 12,
  cameraX = 0,
  cameraY = 0,
  cameraScale = 1,
  parallaxDepth = 1,
  objectKeyframes,
  objectEasing = Easing.linear,
  renderAtSteppedFrame,
  children,
  rimWidth = 2.5,
  rimColor = "rgba(255, 252, 246, 0.94)",
  rimMode,
  paperBackground,
  clipPath,
  shadowOffsetX = 10,
  shadowOffsetY = 14,
  shadowBlur = 3,
  shadowColor = "rgba(18, 16, 14, 0.28)",
  transformOrigin = "center center",
  frame: frameProp,
  fps: fpsProp,
  style,
  className,
}) => {
  const hookFrame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const frame = frameProp ?? hookFrame;
  const fps = fpsProp ?? videoConfig.fps;

  // Smooth native-fps camera/parallax transform
  const camTx = -cameraX * parallaxDepth;
  const camTy = -cameraY * parallaxDepth;
  const camScale = 1 + (cameraScale - 1) * parallaxDepth;

  // Quantized stop-motion object clock (e.g. 12fps inside a 30fps/60fps timeline)
  const stepInterval = Math.max(1, Math.round(fps / Math.max(1, objectFps)));
  const steppedFrame = Math.floor(frame / stepInterval) * stepInterval;
  const pose = evaluateSteppedKeyframes(objectKeyframes, steppedFrame, objectEasing);

  const resolvedRimMode = rimMode ?? (paperBackground ? "box" : "silhouette");
  const filterParts: string[] = [];

  if (resolvedRimMode === "silhouette" && rimWidth > 0) {
    const r = Number(rimWidth.toFixed(2));
    filterParts.push(
      `drop-shadow(${r}px 0 0 ${rimColor})`,
      `drop-shadow(-${r}px 0 0 ${rimColor})`,
      `drop-shadow(0 ${r}px 0 ${rimColor})`,
      `drop-shadow(0 -${r}px 0 ${rimColor})`
    );
  }

  if (shadowOffsetX !== 0 || shadowOffsetY !== 0 || shadowBlur > 0) {
    filterParts.push(
      `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px ${Math.max(0, shadowBlur)}px ${shadowColor})`
    );
  }

  const combinedFilter = filterParts.length > 0 ? filterParts.join(" ") : undefined;
  const content = renderAtSteppedFrame ? renderAtSteppedFrame(steppedFrame) : children;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: "center center",
        transform: `translate3d(${camTx}px, ${camTy}px, 0) scale(${camScale})`,
        willChange: "transform",
        pointerEvents: "none",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          opacity: pose.opacity,
          transformOrigin,
          transform: `translate3d(${pose.x}px, ${pose.y}px, 0) rotate(${pose.rotate}deg) scale(${pose.scale})`,
          filter: combinedFilter,
          willChange: "transform",
        }}
      >
        {clipPath || paperBackground || (resolvedRimMode === "box" && rimWidth > 0) ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              backgroundColor: paperBackground,
              clipPath,
              border:
                resolvedRimMode === "box" && rimWidth > 0
                  ? `${rimWidth}px solid ${rimColor}`
                  : undefined,
              boxSizing: "border-box",
            }}
          >
            {content}
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
};
