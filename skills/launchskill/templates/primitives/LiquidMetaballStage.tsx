import React, { useId } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

export interface MetaballBlobKeyframe {
  frame: number;
  cx: number;
  cy: number;
  r: number;
  opacity?: number;
}

export interface MetaballBlob {
  /** Optional stable React key. */
  id?: string;
  /** Center X coordinate in SVG viewBox units (used when keyframes is omitted). */
  cx: number;
  /** Center Y coordinate in SVG viewBox units (used when keyframes is omitted). */
  cy: number;
  /** Radius in SVG viewBox units (used when keyframes is omitted). */
  r: number;
  /** Fill color for the blob (falls back to stage defaultFill). */
  fill?: string;
  /** Optional opacity (default 1). */
  opacity?: number;
  /** Optional deterministic frame keyframes interpolated via Remotion's interpolate(). */
  keyframes?: readonly MetaballBlobKeyframe[];
  /** Optional easing curve applied between keyframes (default cubic in-out). */
  easing?: (t: number) => number;
}

export interface LiquidMetaballStageProps {
  /** Declarative blobs rendered inside the gooey smooth-min filter group. */
  blobs?: readonly MetaballBlob[];
  /** Custom SVG elements rendered inside the gooey smooth-min filter group. */
  children?: React.ReactNode;
  /** SVG Gaussian blur stdDeviation before alpha thresholding (default 16). */
  blurStdDeviation?: number;
  /** Alpha slope multiplier in feColorMatrix row 4 (default 24). */
  alphaGain?: number;
  /** Alpha offset threshold in feColorMatrix row 4 (default -10). */
  alphaOffset?: number;
  /** Keep sharp interior fills via feComposite operator="atop" (default false). */
  preserveSharpCore?: boolean;
  /** SVG viewBox (default "0 0 1920 1080"). */
  viewBox?: string;
  /** Width of the SVG stage (default "100%"). */
  width?: number | string;
  /** Height of the SVG stage (default "100%"). */
  height?: number | string;
  /** Optional stage background fill. */
  background?: string;
  /** Default blob fill when a blob omits fill (default "#141413"). */
  defaultFill?: string;
  /** Optional explicit frame override. */
  frame?: number;
  /** Optional filter region expansion percentage (default 20). */
  filterMarginPercent?: number;
  style?: React.CSSProperties;
  className?: string;
}

const DEFAULT_EASING = Easing.inOut(Easing.cubic);

const evaluateBlobAtFrame = (
  blob: MetaballBlob,
  frame: number
): { cx: number; cy: number; r: number; opacity: number } => {
  const kf = blob.keyframes;
  if (!kf || kf.length === 0) {
    return {
      cx: blob.cx,
      cy: blob.cy,
      r: Math.max(0, blob.r),
      opacity: blob.opacity ?? 1,
    };
  }

  const sorted = [...kf].sort((a, b) => a.frame - b.frame);
  if (sorted.length === 1 || frame <= sorted[0].frame) {
    const first = sorted[0];
    return {
      cx: first.cx,
      cy: first.cy,
      r: Math.max(0, first.r),
      opacity: first.opacity ?? blob.opacity ?? 1,
    };
  }

  const last = sorted[sorted.length - 1];
  if (frame >= last.frame) {
    return {
      cx: last.cx,
      cy: last.cy,
      r: Math.max(0, last.r),
      opacity: last.opacity ?? blob.opacity ?? 1,
    };
  }

  let segIndex = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (frame >= sorted[i].frame && frame <= sorted[i + 1].frame) {
      segIndex = i;
      break;
    }
  }

  const a = sorted[segIndex];
  const b = sorted[segIndex + 1];
  const easing = blob.easing ?? DEFAULT_EASING;
  const span = b.frame - a.frame;
  const t =
    span <= 0
      ? 1
      : interpolate(frame, [a.frame, b.frame], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing,
        });

  const aOpacity = a.opacity ?? blob.opacity ?? 1;
  const bOpacity = b.opacity ?? blob.opacity ?? 1;

  return {
    cx: a.cx + (b.cx - a.cx) * t,
    cy: a.cy + (b.cy - a.cy) * t,
    r: Math.max(0, a.r + (b.r - a.r) * t),
    opacity: aOpacity + (bOpacity - aOpacity) * t,
  };
};

/**
 * Deterministic SVG liquid metaball stage using <feGaussianBlur> + <feColorMatrix>
 * smooth-min alpha thresholding to organically fuse circles and vector shapes.
 */
export const LiquidMetaballStage: React.FC<LiquidMetaballStageProps> = ({
  blobs = [],
  children,
  blurStdDeviation = 16,
  alphaGain = 24,
  alphaOffset = -10,
  preserveSharpCore = false,
  viewBox = "0 0 1920 1080",
  width = "100%",
  height = "100%",
  background,
  defaultFill = "#141413",
  frame: frameProp,
  filterMarginPercent = 20,
  style,
  className,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const rawId = useId();
  const filterId = `liquid-metaball-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const safeBlur = Math.max(0, blurStdDeviation);
  const margin = Math.max(0, filterMarginPercent);
  const matrixValues = `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${alphaGain} ${alphaOffset}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className={className}
      style={{
        display: "block",
        background,
        overflow: "visible",
        ...style,
      }}
    >
      <defs>
        <filter
          id={filterId}
          x={`-${margin}%`}
          y={`-${margin}%`}
          width={`${100 + margin * 2}%`}
          height={`${100 + margin * 2}%`}
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={safeBlur}
            result="metaballBlur"
          />
          <feColorMatrix
            in="metaballBlur"
            type="matrix"
            values={matrixValues}
            result="metaballThreshold"
          />
          {preserveSharpCore && (
            <feComposite
              in="SourceGraphic"
              in2="metaballThreshold"
              operator="atop"
            />
          )}
        </filter>
      </defs>

      <g filter={safeBlur > 0.01 ? `url(#${filterId})` : undefined}>
        {blobs.map((blob, index) => {
          const state = evaluateBlobAtFrame(blob, frame);
          if (state.r <= 0.01 || state.opacity <= 0.001) {
            return null;
          }
          return (
            <circle
              key={blob.id ?? `blob-${index}`}
              cx={state.cx}
              cy={state.cy}
              r={state.r}
              fill={blob.fill ?? defaultFill}
              opacity={state.opacity}
            />
          );
        })}
        {children}
      </g>
    </svg>
  );
};
