import React, { useId } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface OrganicBoilFilterProps {
  /** Frame rate of the hand-inked line boil cadence (default 12fps on-twos). */
  boilFps?: number;
  /** SVG feTurbulence baseFrequency controlling boil grain size (default 0.022). */
  baseFrequency?: number;
  /** Number of turbulence octaves (default 2). */
  numOctaves?: number;
  /** Displacement scale in px controlling line wobble amplitude (default 3.2). */
  displacementScale?: number;
  /** Deterministic seed offset so multiple layers boil independently (default 0). */
  seedOffset?: number;
  /** Turbulence algorithm type (default "fractalNoise"). */
  turbulenceType?: "fractalNoise" | "turbulence";
  /** Optional tactile paper grain overlay opacity (0 disables overlay; default 0.06). */
  grainOpacity?: number;
  /** Blend mode for the tactile paper grain overlay (default "multiply"). */
  grainBlendMode?: React.CSSProperties["mixBlendMode"];
  /** Optional explicit frame override for testing or nested timelines. */
  frame?: number;
  /** Optional explicit fps override. */
  fps?: number;
  /** Optional filter region expansion percentage to avoid clipping edges (default 8). */
  filterMarginPercent?: number;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

// Pre-encoded 128x128 tileable monochrome paper grain tile.
// Rasterized once by Chromium and shifted deterministically on the stepped boil clock.
const PAPER_GRAIN_TILE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<filter id="pg"><feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="3" seed="11" stitchTiles="stitch"/>` +
    `<feColorMatrix type="saturate" values="0"/></filter>` +
    `<rect width="128" height="128" filter="url(#pg)"/>` +
    `</svg>`
);
const PAPER_GRAIN_DATA_URI = `url("data:image/svg+xml,${PAPER_GRAIN_TILE_SVG}")`;

/**
 * Deterministic 12fps on-twos SVG hand-inked line boil (<feTurbulence> + <feDisplacementMap>)
 * wrapped around arbitrary SVG or HTML children, with an optional tactile paper grain overlay.
 */
export const OrganicBoilFilter: React.FC<OrganicBoilFilterProps> = ({
  boilFps = 12,
  baseFrequency = 0.022,
  numOctaves = 2,
  displacementScale = 3.2,
  seedOffset = 0,
  turbulenceType = "fractalNoise",
  grainOpacity = 0.06,
  grainBlendMode = "multiply",
  frame: frameProp,
  fps: fpsProp,
  filterMarginPercent = 8,
  style,
  className,
  children,
}) => {
  const hookFrame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const frame = frameProp ?? hookFrame;
  const fps = fpsProp ?? videoConfig.fps;

  const rawId = useId();
  const filterId = `organic-boil-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const safeBoilFps = Math.max(1, boilFps);
  const stepFrames = Math.max(1, Math.round(fps / safeBoilFps));
  const boilStep = Math.floor(frame / stepFrames);

  // Deterministic prime-stride seed progression (strictly positive integer, purely frame-clock driven).
  const seed = Math.abs((boilStep * 17 + Math.round(seedOffset) * 31) % 997) + 1;
  const active = displacementScale > 0.01;
  const clampedGrainOpacity = Math.max(0, Math.min(1, grainOpacity));

  const margin = Math.max(0, filterMarginPercent);
  const grainOffsetX = ((boilStep * 43 + Math.round(seedOffset) * 19) % 128 + 128) % 128;
  const grainOffsetY = ((boilStep * 71 + Math.round(seedOffset) * 29) % 128 + 128) % 128;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {active && (
        <svg
          width={0}
          height={0}
          aria-hidden="true"
          style={{ position: "absolute", pointerEvents: "none" }}
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
              <feTurbulence
                type={turbulenceType}
                baseFrequency={baseFrequency}
                numOctaves={Math.max(1, Math.round(numOctaves))}
                seed={seed}
                result="boilNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="boilNoise"
                scale={displacementScale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          filter: active ? `url(#${filterId})` : undefined,
        }}
      >
        {children}
      </div>

      {clampedGrainOpacity > 0.001 && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: clampedGrainOpacity,
            mixBlendMode: grainBlendMode,
            backgroundImage: PAPER_GRAIN_DATA_URI,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
            backgroundPosition: `${grainOffsetX}px ${grainOffsetY}px`,
          }}
        />
      )}
    </div>
  );
};
