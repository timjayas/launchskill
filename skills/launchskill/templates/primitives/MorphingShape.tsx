import React from "react";
import { interpolatePaths } from "@remotion/paths";
import { Easing, useCurrentFrame } from "remotion";

export interface MorphKeyframe {
  /** Frame at which the silhouette reaches this SVG path `d`. */
  frame: number;
  /** SVG path data string (closed or open). */
  d: string;
}

export interface MorphingShapeProps {
  /** Ordered or unordered array of frame -> SVG path keyframes. */
  keyframes: readonly MorphKeyframe[];
  /**
   * Optional normalized progress override in [0, 1].
   * When provided, morphs uniformly across `keyframes` ignoring `frame`.
   */
  progress?: number;
  /** Optional explicit frame override (defaults to `useCurrentFrame()`). */
  frame?: number;
  /** Easing function passed to `@remotion/paths` `interpolatePaths` (default cubic in-out). */
  easing?: (t: number) => number;
  /** SVG path fill color (default "#141413"). */
  fill?: string;
  /** SVG path stroke color (default "none"). */
  stroke?: string;
  /** SVG path stroke width (default 0). */
  strokeWidth?: number;
  /** SVG stroke-linecap (default "round"). */
  strokeLinecap?: React.SVGProps<SVGPathElement>["strokeLinecap"];
  /** SVG stroke-linejoin (default "round"). */
  strokeLinejoin?: React.SVGProps<SVGPathElement>["strokeLinejoin"];
  /** SVG viewBox (default "0 0 200 200"). */
  viewBox?: string;
  /** SVG element width (default "100%"). */
  width?: number | string;
  /** SVG element height (default "100%"). */
  height?: number | string;
  /** Optional fill/stroke opacity (default 1). */
  opacity?: number;
  /** Optional extra SVG children (e.g. <defs> gradients or masks). */
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const DEFAULT_EASING = Easing.inOut(Easing.cubic);

const normalizeKeyframes = (
  keyframes: readonly MorphKeyframe[]
): MorphKeyframe[] => {
  const sorted = [...keyframes]
    .filter((kf) => kf.d.trim().length > 0)
    .sort((a, b) => a.frame - b.frame);

  // Deduplicate identical frames (later entry wins) so inputRange is strictly increasing.
  const deduped: MorphKeyframe[] = [];
  for (const kf of sorted) {
    if (deduped.length > 0 && deduped[deduped.length - 1].frame === kf.frame) {
      deduped[deduped.length - 1] = kf;
    } else {
      deduped.push(kf);
    }
  }
  return deduped;
};

/**
 * Deterministic SVG silhouette morphing primitive powered by `@remotion/paths`
 * `interpolatePaths` and `useCurrentFrame()`.
 */
export const MorphingShape: React.FC<MorphingShapeProps> = ({
  keyframes,
  progress,
  frame: frameProp,
  easing = DEFAULT_EASING,
  fill = "#141413",
  stroke = "none",
  strokeWidth = 0,
  strokeLinecap = "round",
  strokeLinejoin = "round",
  viewBox = "0 0 200 200",
  width = "100%",
  height = "100%",
  opacity = 1,
  children,
  style,
  className,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const normalized = normalizeKeyframes(keyframes);
  if (normalized.length === 0) {
    return null;
  }

  let morphedPath: string;
  if (normalized.length === 1) {
    morphedPath = normalized[0].d;
  } else if (progress !== undefined) {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const count = normalized.length;
    const inputRange = normalized.map((_, idx) => idx / (count - 1));
    const outputRange = normalized.map((kf) => kf.d);
    morphedPath = interpolatePaths(clampedProgress, inputRange, outputRange, {
      easing,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else {
    const inputRange = normalized.map((kf) => kf.frame);
    const outputRange = normalized.map((kf) => kf.d);
    morphedPath = interpolatePaths(frame, inputRange, outputRange, {
      easing,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className={className}
      style={{
        display: "block",
        overflow: "visible",
        ...style,
      }}
    >
      {children}
      <path
        d={morphedPath}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        opacity={opacity}
      />
    </svg>
  );
};
