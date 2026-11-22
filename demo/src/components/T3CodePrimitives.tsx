import React, { useId } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FONT_MONO,
  FONT_SANS,
  computeCameraTransform,
  durSec,
} from "../lib/studioMotion";

// ============================================================================
// 1. Bespoke Swiss-Minimalist Off-White Design System — T3 Code v2
//    "Fuser meets Apple meets Linear"
//    - Warm Off-White Canvas (#F9F9F8) across 100% of runtime
//    - Deep Charcoal Typography (#141413) & Muted Stone (#787873)
//    - Tactile White & Subtle Glass Surfaces with Multi-Layer Soft Shadows
//    - Clean Brand Pops Strictly on Agent Icons (Claude, Codex, OpenCode, Cursor)
//    - Zero Neon, Zero AI Gradients, Zero Blur Circles, Zero Grid Clutter
// ============================================================================
export const T3_THEME = {
  canvas: "#F9F9F8",
  surface: "#FFFFFF",
  surfaceGlass: "rgba(255, 255, 255, 0.86)",
  surfaceSubtle: "#F2F2EF",
  border: "rgba(20, 20, 19, 0.08)",
  borderStrong: "rgba(20, 20, 19, 0.14)",

  ink: "#141413",
  inkSecondary: "#4A4A46",
  inkMuted: "#868680",
  inkFaint: "#B8B8B2",

  // Authentic Brand Pops (Used Strictly for Agent Icons & Minimal Semantic Cues)
  claude: "#D97757",      // Warm Terracotta
  claudeSoft: "#FDF1EC",
  codex: "#10A37F",       // Crisp Emerald
  codexSoft: "#ECFDF7",
  opencode: "#2563EB",    // Swiss Cobalt
  opencodeSoft: "#EFF6FF",
  cursor: "#1C1C1E",      // Tactile Carbon
  terminal: "#3A3A3C",    // Graphite
  success: "#16A34A",
  successSoft: "#F0FDF4",

  // Multi-layer Apple-style soft elevation shadows
  shadowSoft:
    "0 12px 32px rgba(20, 20, 19, 0.06), 0 2px 6px rgba(20, 20, 19, 0.04)",
  shadowHero:
    "0 28px 72px rgba(20, 20, 19, 0.09), 0 6px 18px rgba(20, 20, 19, 0.05), 0 1px 2px rgba(20, 20, 19, 0.04)",
  shadowIcon:
    "0 14px 30px rgba(20, 20, 19, 0.12), 0 3px 8px rgba(20, 20, 19, 0.06)",

  // Balanced Tactile Radii (Apple / Linear Studio Scale)
  radiusCard: 24,
  radiusPane: 20,
  radiusIcon: 20,
  radiusPill: 999,
} as const;

export type AgentBrandId = "t3" | "claude" | "codex" | "opencode" | "cursor" | "terminal";

// ============================================================================
// 1.5 Camera-Coupled Studio Cyclorama + Precision Micro Dot-Grid
//     - Curved photo-studio linear tonal falloff (zero circular blur orbs / zero neon)
//     - Precision 28px dot-grid physically coupled to camera pan & zoom for 3D spatial feel
// ============================================================================
export const T3StudioCyclorama: React.FC<{
  dark?: boolean;
  zoom?: number;
  panX?: number;
  panY?: number;
  dotOpacity?: number;
}> = ({ dark = false, zoom = 1, panX = 0, panY = 0, dotOpacity }) => {
  const bgGradient = dark
    ? "linear-gradient(180deg, #181817 0%, #141413 54%, #0C0C0B 100%)"
    : "linear-gradient(180deg, #FFFFFF 0%, #F9F9F8 56%, #F1F1EC 100%)";

  const dotColor = dark
    ? `rgba(255, 255, 255, ${dotOpacity ?? 0.08})`
    : `rgba(20, 20, 19, ${dotOpacity ?? 0.085})`;

  // Slight overscan (140%) so pan/zoom parallax never exposes bare edges
  return (
    <AbsoluteFill
      style={{
        background: bgGradient,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "-20%",
          top: "-20%",
          width: "140%",
          height: "140%",
          backgroundImage: `radial-gradient(${dotColor} 1.35px, transparent 1.35px)`,
          backgroundSize: "30px 30px",
          transformOrigin: "center center",
          transform: `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`,
          willChange: "transform",
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// 2. Tactile Apple-Style Vector App Icons (Zero Generic Emojis, Crisp Geometry)
// ============================================================================
export const AgentAppIcon: React.FC<{
  brand: AgentBrandId;
  size?: number;
  elevated?: boolean;
  style?: React.CSSProperties;
}> = ({ brand, size = 76, elevated = true, style }) => {
  const radius = Math.round(size * 0.24);
  const iconDim = Math.round(size * 0.56);

  const palette: Record<AgentBrandId, { bg: string; fg: string; border: string }> = {
    t3: { bg: "#141413", fg: "#FFFFFF", border: "rgba(255,255,255,0.12)" },
    claude: { bg: T3_THEME.claude, fg: "#FFFFFF", border: "rgba(255,255,255,0.22)" },
    codex: { bg: T3_THEME.codex, fg: "#FFFFFF", border: "rgba(255,255,255,0.22)" },
    opencode: { bg: T3_THEME.opencode, fg: "#FFFFFF", border: "rgba(255,255,255,0.22)" },
    cursor: { bg: "#FFFFFF", fg: "#141413", border: "rgba(20,20,19,0.12)" },
    terminal: { bg: "#27272A", fg: "#FAFAFA", border: "rgba(255,255,255,0.12)" },
  };

  const p = palette[brand];

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: p.bg,
        border: `1px solid ${p.border}`,
        boxShadow: elevated
          ? `${T3_THEME.shadowIcon}, inset 0 1px 0 rgba(255,255,255,0.22)`
          : "inset 0 1px 0 rgba(255,255,255,0.18)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
        ...style,
      }}
    >
      {brand === "t3" && (
        <svg width={Math.round(size * 0.64)} height={Math.round(size * 0.64)} viewBox="0 0 36 36" fill="none">
          <path d="M4.5 9.5H18.5V13.8H13.6V27.5H9.1V13.8H4.5V9.5Z" fill={p.fg} />
          <path
            d="M20.4 9.5H31.5V13.5L26.1 17.3C29.2 17.7 31.8 19.8 31.8 23C31.8 26.3 29 28 25.1 28C22.4 28 20.6 27.2 19.4 26.2L21.4 22.9C22.3 23.7 23.5 24.2 25 24.2C26.6 24.2 27.6 23.5 27.6 22.3C27.6 21 26.4 20.3 24.1 20.3H22.2V17.1L26.8 13.7H20.4V9.5Z"
            fill={p.fg}
          />
        </svg>
      )}

      {brand === "claude" && (
        <svg width={iconDim} height={iconDim} viewBox="0 0 24 24" fill="none">
          {/* Official Anthropic Claude Sunburst Mark */}
          <path
            d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"
            fill={p.fg}
            fillRule="nonzero"
          />
        </svg>
      )}

      {brand === "codex" && (
        <svg width={iconDim} height={iconDim} viewBox="0 0 24 24" fill="none">
          {/* Official OpenAI / Codex Blossom Mark */}
          <path
            d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"
            fill={p.fg}
            fillRule="evenodd"
          />
        </svg>
      )}

      {brand === "opencode" && (
        <svg width={iconDim} height={iconDim} viewBox="0 0 24 24" fill="none">
          {/* Official OpenCode Geometric Nested-Square Mark */}
          <path
            d="M16 6H8v12h8V6zm4 16H4V2h16v20z"
            fill={p.fg}
            fillRule="evenodd"
          />
          <rect x="8" y="12" width="8" height="6" fill={p.fg} fillOpacity="0.35" />
        </svg>
      )}

      {brand === "cursor" && (
        <svg width={iconDim} height={iconDim} viewBox="0 0 24 24" fill="none">
          {/* Official Cursor Isometric Prism Mark */}
          <path
            d="M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z"
            fill={p.fg}
            fillRule="evenodd"
          />
        </svg>
      )}

      {brand === "terminal" && (
        <svg width={iconDim} height={iconDim} viewBox="0 0 32 32" fill="none">
          <path
            d="M7 10.5L13.5 16L7 21.5M16 21.5H25"
            stroke={p.fg}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

// ============================================================================
// 3. True Directional Velocity Motion Blur (SVG feGaussianBlur stdDeviation="x y")
//    Drops strictly to zero overhead at rest (<= 0.15px)
// ============================================================================
export const T3DirectionalBlur: React.FC<{
  blurX: number;
  blurY: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ blurX, blurY, style, children }) => {
  const rawId = useId();
  const filterId = `t3-v2-blur-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const bx = blurX > 0.15 ? Number(blurX.toFixed(2)) : 0;
  const by = blurY > 0.15 ? Number(blurY.toFixed(2)) : 0;
  const active = bx > 0 || by > 0;

  return (
    <>
      {active && (
        <svg
          width={0}
          height={0}
          aria-hidden="true"
          style={{ position: "absolute", pointerEvents: "none" }}
        >
          <defs>
            <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={`${bx} ${by}`} />
            </filter>
          </defs>
        </svg>
      )}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          ...style,
          filter: active ? `url(#${filterId})` : undefined,
        }}
      >
        {children}
      </div>
    </>
  );
};

// ============================================================================
// 4. Exact Focal-Lock 2D Spatial Camera Rig (transformOrigin: "0 0")
// ============================================================================
export const T3SpatialCameraRig: React.FC<{
  focusX: number;
  focusY: number;
  zoom: number;
  blurX?: number;
  blurY?: number;
  viewportW?: number;
  viewportH?: number;
  children: React.ReactNode;
}> = ({
  focusX,
  focusY,
  zoom,
  blurX = 0,
  blurY = 0,
  viewportW = 1920,
  viewportH = 1080,
  children,
}) => {
  const { x, y, scale } = computeCameraTransform(
    focusX,
    focusY,
    zoom,
    viewportW,
    viewportH
  );

  return (
    <T3DirectionalBlur blurX={blurX} blurY={blurY}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transformOrigin: "0 0",
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </T3DirectionalBlur>
  );
};

// ============================================================================
// 5. Tactile Minimal Cursor (Crisp Charcoal Pointer + Subtle Ripple)
// ============================================================================
export const T3Cursor: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  darkSurface?: boolean;
  rippleProgress?: number;
  rippleColor?: string;
}> = ({
  x,
  y,
  scale = 1,
  opacity = 1,
  darkSurface = false,
  rippleProgress = 0,
  rippleColor = T3_THEME.ink,
}) => {
  const fill = darkSurface ? "#FAFAFA" : T3_THEME.ink;
  const stroke = darkSurface ? "#09090B" : "#FFFFFF";
  return (
    <>
      {rippleProgress > 0.01 && rippleProgress < 0.99 && (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 68,
            height: 68,
            marginLeft: -34,
            marginTop: -34,
            borderRadius: 999,
            border: `2px solid ${rippleColor}`,
            transform: `scale(${0.28 + rippleProgress * 1.4})`,
            opacity: (1 - rippleProgress) * 0.45,
            pointerEvents: "none",
            zIndex: 55,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          transformOrigin: "top left",
          opacity,
          pointerEvents: "none",
          zIndex: 60,
          filter: "drop-shadow(0 8px 16px rgba(20, 20, 19, 0.22))",
        }}
      >
        <svg width={44} height={44} viewBox="0 0 24 24" fill="none">
          <path
            d="M4.5 3L19.5 11.8L12.2 13.8L9.2 20.8L4.5 3Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};

// ============================================================================
// 6. Fast 128x128 Tiled Deterministic Film Grain (Subtle H.264 Anti-Banding)
// ============================================================================
const GRAIN_TILE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="7" stitchTiles="stitch"/></filter>` +
    `<rect width="128" height="128" filter="url(#n)"/>` +
    `</svg>`
);
const GRAIN_TILE_DATA_URI = `url("data:image/svg+xml,${GRAIN_TILE_SVG}")`;

export const T3FilmGrain: React.FC<{
  frame?: number;
  fps?: number;
  opacity?: number;
}> = ({ frame: frameProp, fps: fpsProp, opacity = 0.018 }) => {
  const hookFrame = useCurrentFrame();
  const config = useVideoConfig();
  const frame = frameProp ?? hookFrame;
  const fps = fpsProp ?? config.fps;

  const stepFrames = Math.max(1, Math.round(fps / 15));
  const step = Math.floor(frame / stepFrames);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
        backgroundImage: GRAIN_TILE_DATA_URI,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        backgroundPosition: `${(step * 47) % 128}px ${(step * 73) % 128}px`,
      }}
    />
  );
};

// ============================================================================
// 7. Clean Abstract Visual Syntax Card Helper (Visual Craft — Zero Dense Copy!)
// ============================================================================
export const AbstractCodeBars: React.FC<{
  accent: string;
  progress: number;
  rows?: number;
  compact?: boolean;
}> = ({ accent, progress, rows = 6, compact = false }) => {
  const patterns = [
    [
      { w: 28, c: accent, o: 0.85 },
      { w: 46, c: T3_THEME.ink, o: 0.16 },
    ],
    [
      { w: 16, c: T3_THEME.ink, o: 0.08 },
      { w: 58, c: T3_THEME.ink, o: 0.18 },
      { w: 18, c: accent, o: 0.5 },
    ],
    [
      { w: 24, c: T3_THEME.ink, o: 0.08 },
      { w: 42, c: accent, o: 0.72 },
    ],
    [
      { w: 24, c: T3_THEME.ink, o: 0.08 },
      { w: 62, c: T3_THEME.ink, o: 0.14 },
    ],
    [
      { w: 16, c: T3_THEME.ink, o: 0.08 },
      { w: 38, c: accent, o: 0.65 },
      { w: 24, c: T3_THEME.ink, o: 0.14 },
    ],
    [
      { w: 32, c: T3_THEME.ink, o: 0.22 },
      { w: 26, c: T3_THEME.ink, o: 0.1 },
    ],
  ];

  const barH = compact ? 9 : 12;
  const gap = compact ? 11 : 16;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap, width: "100%" }}>
      {patterns.slice(0, rows).map((line, rIdx) => {
        const threshold = rIdx / rows;
        const rowP = Math.max(0, Math.min(1, (progress - threshold * 0.7) / 0.3));
        return (
          <div
            key={rIdx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: compact ? 8 : 10,
              opacity: 0.15 + rowP * 0.85,
              transform: `translate3d(${(1 - rowP) * 10}px, 0, 0)`,
            }}
          >
            {line.map((seg, sIdx) => (
              <span
                key={sIdx}
                style={{
                  height: barH,
                  width: `${seg.w * (0.25 + rowP * 0.75)}%`,
                  borderRadius: 999,
                  backgroundColor: seg.c,
                  opacity: seg.o,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// 8. Studio Audio Layer v2 (Ready for Curated Real Foley + Real Music Bed)
// ============================================================================
export interface T3SfxCue {
  frame?: number;
  peakAtFrame?: number;
  peakOffsetSec?: number;
  src: string;
  volume?: number;
  playbackRate?: number;
  durationInFrames?: number;
  duckMusic?: boolean;
}

export const T3SoundTrackLayer: React.FC<{
  musicTrack?: string;
  musicVolume?: number;
  musicStartFromSec?: number;
  cues?: T3SfxCue[];
}> = ({
  musicTrack,
  musicVolume = 0.25,
  musicStartFromSec = 0,
  cues = [],
}) => {
  const { durationInFrames, fps } = useVideoConfig();

  const resolvedCues = cues.map((cue) => {
    const startFrame =
      cue.peakAtFrame !== undefined
        ? Math.round(cue.peakAtFrame - (cue.peakOffsetSec ?? 0.16) * fps)
        : Math.round(cue.frame ?? 0);
    return { ...cue, resolvedFrom: Math.max(0, startFrame) };
  });

  const duckWindows = resolvedCues
    .filter((c) => c.duckMusic)
    .map((c) => ({
      startFrame: c.resolvedFrom,
      endFrame: c.resolvedFrom + durSec(0.55, fps),
    }));

  const fadeInFrames = durSec(0.25, fps);
  const fadeOutFrames = durSec(1.1, fps);
  const rampFrames = durSec(0.18, fps);
  const releaseFrames = durSec(0.32, fps);

  const computeMusicVolume = (f: number): number => {
    const fadeIn = interpolate(f, [0, fadeInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(
      f,
      [Math.max(0, durationInFrames - fadeOutFrames), durationInFrames],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    let duckMult = 1;
    for (const w of duckWindows) {
      const enter = interpolate(f, [w.startFrame - rampFrames, w.startFrame], [1, 0.56], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const exit = interpolate(f, [w.endFrame, w.endFrame + releaseFrames], [0.56, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const activeMult = f <= w.endFrame ? enter : exit;
      if (activeMult < duckMult) duckMult = activeMult;
    }
    return Math.max(0, musicVolume * fadeIn * fadeOut * duckMult);
  };

  return (
    <>
      {musicTrack && (
        <Audio
          src={staticFile(musicTrack)}
          startFrom={Math.max(0, Math.round(musicStartFromSec * fps))}
          volume={computeMusicVolume}
        />
      )}
      {resolvedCues.map((cue, idx) => (
        <Sequence
          key={`${cue.src}-${cue.resolvedFrom}-${idx}`}
          from={cue.resolvedFrom}
          durationInFrames={cue.durationInFrames ?? durSec(1.1, fps)}
        >
          <Audio
            src={staticFile(cue.src)}
            volume={cue.volume ?? 0.3}
            playbackRate={cue.playbackRate ?? 1}
          />
        </Sequence>
      ))}
    </>
  );
};

export { FONT_MONO, FONT_SANS };
