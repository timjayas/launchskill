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
import { computeCameraTransform, durSec } from "../lib/studioMotion";

// ============================================================================
// 1. Bespoke Light-Studio Brand Tokens for Antigravity (AI Coding Platform)
//    Weightless gallery-white & architectural paper + Aerospace Cobalt/Sky
// ============================================================================
export const ANTIGRAVITY_THEME = {
  // Primary Light Gallery Surfaces (100% weightless light theme)
  bg: "#FFFFFF",
  paperBg: "#F7F7F5",
  canvasBg: "#F5F7FA",
  surface: "#FFFFFF",
  surfaceSubtle: "#F4F5F8",
  surfaceElevated: "#FFFFFF",

  // Crisp architectural borders & shadows
  border: "rgba(11, 13, 18, 0.09)",
  borderStrong: "rgba(11, 13, 18, 0.16)",
  shadowCard: "0 20px 50px rgba(11, 13, 18, 0.07), 0 4px 14px rgba(11, 13, 18, 0.04)",
  shadowHero: "0 34px 90px rgba(11, 13, 18, 0.11), 0 8px 24px rgba(11, 13, 18, 0.05)",

  // Ink hierarchy (high contrast >= 7:1 primary, >= 4.5:1 muted)
  ink: "#0B0D12",
  inkSecondary: "#334155",
  inkMuted: "#64748B",
  inkSoft: "#94A3B8",

  // Single Primary Brand Accent (Aerospace Cobalt + Sky telemetry highlight)
  accent: "#2563EB",
  accentSky: "#0EA5E9",
  accentSoft: "rgba(37, 99, 235, 0.09)",
  accentBorder: "rgba(37, 99, 235, 0.36)",

  // Semantic engineering status tints only
  success: "#059669",
  successLight: "#10B981",
  successBg: "#ECFDF5",
  successBorder: "rgba(5, 150, 105, 0.28)",
  danger: "#DC2626",
  dangerBg: "#FEF2F2",
  dangerBorder: "rgba(220, 38, 38, 0.24)",

  // Architectural sharp corner geometry
  radiusWindow: 16,
  radiusCard: 14,
  radiusControl: 10,
} as const;

// ============================================================================
// 2. Bespoke Antigravity Vector Mark (Ascending Delta + Precision Orbital Arc)
// ============================================================================
export const AntigravityMark: React.FC<{
  size?: number;
  variant?: "dark" | "light" | "badge" | "lightBadge";
  accentColor?: string;
  skyColor?: string;
}> = ({
  size = 56,
  variant = "light",
  accentColor = ANTIGRAVITY_THEME.accent,
  skyColor = ANTIGRAVITY_THEME.accentSky,
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradId = `ag-grad-${uid}`;
  const isLightInk = variant === "dark";

  if (variant === "badge" || variant === "lightBadge") {
    const darkPill = variant === "badge";
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.26),
          background: darkPill
            ? "linear-gradient(145deg, #161A26 0%, #0B0D12 100%)"
            : "linear-gradient(145deg, #FFFFFF 0%, #F1F5F9 100%)",
          border: darkPill
            ? "1.5px solid rgba(255, 255, 255, 0.14)"
            : `1.5px solid ${ANTIGRAVITY_THEME.borderStrong}`,
          boxShadow: darkPill
            ? `0 18px 40px rgba(11, 13, 18, 0.22), 0 0 0 4px rgba(37, 99, 235, 0.10)`
            : `0 14px 34px rgba(11, 13, 18, 0.08), inset 0 1px 0 #FFFFFF`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <AntigravityMark
          size={Math.round(size * 0.62)}
          variant={darkPill ? "dark" : "light"}
          accentColor={accentColor}
          skyColor={skyColor}
        />
      </div>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gradId} x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={skyColor} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
      </defs>
      {/* Orbital lift arc */}
      <path
        d="M11 45.5C18.5 34.5 45.5 34.5 53 45.5"
        stroke={`url(#${gradId})`}
        strokeWidth="4.4"
        strokeLinecap="round"
        opacity={0.96}
      />
      {/* Ascending architectural A-delta */}
      <path
        d="M32 9L50 51H41.4L32 28.4L22.6 51H14L32 9Z"
        fill={isLightInk ? "#FAFAFA" : "#0B0D12"}
      />
      {/* Precision apex telemetry dot */}
      <circle cx="32" cy="48.5" r="3.4" fill={accentColor} />
    </svg>
  );
};

// ============================================================================
// 3. Light Studio Architectural Dot-Grid Backdrop (Soft Warm/Cool Wash)
// ============================================================================
export const StudioLightBackdrop: React.FC<{
  surface?: "white" | "paper" | "canvas";
  showGrid?: boolean;
  glowX?: string;
  glowY?: string;
  glowIntensity?: number;
}> = ({
  surface = "white",
  showGrid = true,
  glowX = "50%",
  glowY = "36%",
  glowIntensity = 0.11,
}) => {
  const bg =
    surface === "paper"
      ? ANTIGRAVITY_THEME.paperBg
      : surface === "canvas"
        ? ANTIGRAVITY_THEME.canvasBg
        : ANTIGRAVITY_THEME.bg;

  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      {showGrid && (
        <AbsoluteFill
          style={{
            backgroundImage:
              "radial-gradient(rgba(11, 13, 18, 0.13) 1.3px, transparent 1.3px)",
            backgroundSize: "30px 30px",
            opacity: 0.72,
          }}
        />
      )}
      {/* Soft aerospace sky + subtle warm studio paper light wash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(980px 600px at ${glowX} ${glowY}, rgba(37, 99, 235, ${glowIntensity}) 0%, rgba(14, 165, 233, ${glowIntensity * 0.45}) 35%, transparent 72%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// 4. 1-to-1 Light-Mode SVG Bezier Pipeline Wire + Traveling Signal Pulse
// ============================================================================
export const PipelineWireLight: React.FC<{
  width?: number;
  height?: number;
  drawProgress: number;
  pulseProgress?: number;
  pulseOpacity?: number;
  accentColor?: string;
}> = ({
  width = 110,
  height = 80,
  drawProgress,
  pulseProgress = 0,
  pulseOpacity = 0,
  accentColor = ANTIGRAVITY_THEME.accent,
}) => {
  const clampedDraw = Math.max(0, Math.min(1, drawProgress));
  const clampedPulse = Math.max(0, Math.min(1, pulseProgress));
  const yMid = height / 2;
  const xStart = 6;
  const xEnd = width - 6;
  const pathLen = xEnd - xStart;
  const pulseX = xStart + clampedPulse * pathLen;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible", flexShrink: 0 }}
    >
      {/* Subtle architectural guide wire */}
      <path
        d={`M ${xStart} ${yMid} C ${width * 0.36} ${yMid}, ${width * 0.64} ${yMid}, ${xEnd} ${yMid}`}
        fill="none"
        stroke="rgba(11, 13, 18, 0.12)"
        strokeWidth={3}
        strokeDasharray="6 6"
      />
      {/* Drawn active cobalt wire */}
      <path
        d={`M ${xStart} ${yMid} C ${width * 0.36} ${yMid}, ${width * 0.64} ${yMid}, ${xEnd} ${yMid}`}
        fill="none"
        stroke={accentColor}
        strokeWidth={3.8}
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen * (1 - clampedDraw)}
      />
      {/* Terminal port dots */}
      <circle cx={xStart} cy={yMid} r={5} fill="#FFFFFF" stroke={accentColor} strokeWidth={2.5} />
      <circle
        cx={xEnd}
        cy={yMid}
        r={5}
        fill={clampedDraw > 0.96 ? accentColor : "#FFFFFF"}
        stroke={accentColor}
        strokeWidth={2.5}
      />
      {/* Traveling luminous data pulse */}
      {pulseOpacity > 0.01 && (
        <g opacity={pulseOpacity}>
          <circle cx={pulseX} cy={yMid} r={11} fill={accentColor} opacity={0.22} />
          <circle cx={pulseX} cy={yMid} r={5.5} fill={accentColor} stroke="#FFFFFF" strokeWidth={2} />
        </g>
      )}
    </svg>
  );
};

// ============================================================================
// 5. True Directional Motion Blur Wrapper (SVG feGaussianBlur stdDeviation="x y")
// ============================================================================
export const DirectionalMotionBlur: React.FC<{
  blurX: number;
  blurY: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ blurX, blurY, style, children }) => {
  const rawId = useId();
  const filterId = `ag-dir-blur-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const bx = blurX > 0.15 ? Number(blurX.toFixed(2)) : 0;
  const by = blurY > 0.15 ? Number(blurY.toFixed(2)) : 0;
  const active = bx > 0 || by > 0;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
        filter: active ? `url(#${filterId})` : undefined,
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
            <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={`${bx} ${by}`} />
            </filter>
          </defs>
        </svg>
      )}
      {children}
    </div>
  );
};

// ============================================================================
// 6. High-Performance Tiled Deterministic Film Grain (128x128 anti-banding)
// ============================================================================
const GRAIN_TILE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="7" stitchTiles="stitch"/></filter>` +
    `<rect width="128" height="128" filter="url(#n)"/>` +
    `</svg>`
);
const GRAIN_TILE_DATA_URI = `url("data:image/svg+xml,${GRAIN_TILE_SVG}")`;

export const TiledFilmGrainOverlay: React.FC<{
  frame?: number;
  fps?: number;
  opacity?: number;
}> = ({ frame: frameProp, fps: fpsProp, opacity = 0.022 }) => {
  const hookFrame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const frame = frameProp ?? hookFrame;
  const fps = fpsProp ?? videoConfig.fps;

  const stepFrames = Math.max(1, Math.round(fps / 15));
  const step = Math.floor(frame / stepFrames);
  const offsetX = (step * 47) % 128;
  const offsetY = (step * 73) % 128;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        mixBlendMode: "multiply",
        backgroundImage: GRAIN_TILE_DATA_URI,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        backgroundPosition: `${offsetX}px ${offsetY}px`,
      }}
    />
  );
};

// ============================================================================
// 7. Exact Focal-Lock 2D Spatial Camera Rig (With True Directional Blur)
// ============================================================================
export const SpatialCameraRig2D: React.FC<{
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
    <DirectionalMotionBlur blurX={blurX} blurY={blurY}>
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
    </DirectionalMotionBlur>
  );
};

// ============================================================================
// 8. Crisp Obsidian-Ink Vector Cursor (High-contrast on Light Studio Canvas)
// ============================================================================
export const AerospaceCursor: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  fill?: string;
  stroke?: string;
}> = ({ x, y, scale = 1, opacity = 1, fill = "#0B0D12", stroke = "#FFFFFF" }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        transformOrigin: "top left",
        opacity,
        pointerEvents: "none",
        zIndex: 80,
        filter: "drop-shadow(0 10px 18px rgba(11, 13, 18, 0.24))",
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
  );
};

// ============================================================================
// 9. Declarative Beat-Locked Audio & Procedural SFX Layer
// ============================================================================
export interface SfxCue {
  frame: number;
  src: string;
  volume?: number;
  durationInFrames?: number;
}

export const SoundTrackLayer: React.FC<{
  musicTrack?: string;
  musicVolume?: number;
  cues?: SfxCue[];
}> = ({ musicTrack, musicVolume = 0.24, cues = [] }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const fadeStart = Math.max(0, durationInFrames - durSec(1.0, fps));
  const bedFadeOut = interpolate(frame, [fadeStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {musicTrack && (
        <Audio src={staticFile(musicTrack)} volume={musicVolume * bedFadeOut} />
      )}
      {cues.map((cue, idx) => (
        <Sequence
          key={`${cue.src}-${cue.frame}-${idx}`}
          from={Math.max(0, Math.round(cue.frame))}
          durationInFrames={cue.durationInFrames ?? durSec(1.1, fps)}
        >
          <Audio src={staticFile(cue.src)} volume={cue.volume ?? 0.36} />
        </Sequence>
      ))}
    </>
  );
};
