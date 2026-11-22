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
import { computeCameraTransform, durSec, FONT_MONO, FONT_SANS } from "../lib/studioMotion";

// ============================================================================
// 1. Bespoke Light-Gallery Spotify Brand Tokens
//    Pure Gallery White (#FFFFFF) & Studio Paper (#F7F7F5) — Zero Blur Circles
//    Single Primary Brand Accent: Spotify Green (#1DB954) + Deep Editorial Green (#0F8A3E)
// ============================================================================
export const SPOTIFY_STUDIO_THEME = {
  // Primary Light Gallery Surfaces (100% light-first clarity)
  bg: "#FFFFFF",
  paperBg: "#F7F7F5",
  mintBg: "#F3F8F5",
  surface: "#FFFFFF",
  surfaceSubtle: "#F4F5F6",
  surfaceElevated: "#FFFFFF",

  // Crisp architectural 1px hairlines & restrained neutral shadows
  border: "rgba(11, 11, 14, 0.09)",
  borderStrong: "rgba(11, 11, 14, 0.15)",
  shadowCard: "0 18px 46px rgba(11, 11, 14, 0.07), 0 3px 10px rgba(11, 11, 14, 0.04)",
  shadowHero: "0 30px 80px rgba(11, 11, 14, 0.09), 0 6px 18px rgba(11, 11, 14, 0.04)",

  // High-Contrast Editorial Ink Hierarchy (>= 7:1 primary, >= 4.5:1 muted)
  ink: "#0B0B0E",
  inkSecondary: "#3F3F46",
  inkMuted: "#686873",
  inkSoft: "#A1A1AA",

  // Single Primary Brand Accent (Spotify Green + AA/AAA editorial ink green)
  green: "#1DB954",
  greenDeep: "#0F8A3E",
  greenTint: "#EAF8EF",
  greenBorder: "rgba(29, 185, 84, 0.36)",

  // Soft Organic Consumer Corner Geometry
  radiusWindow: 26,
  radiusCard: 22,
  radiusControl: 16,
  radiusPill: 999,
} as const;

// ============================================================================
// 2. Authentic Spotify 3-Arc Soundwave Mark (Crisp Flat Vector — Zero Glow Halo)
// ============================================================================
export const SpotifyMark: React.FC<{
  size?: number;
  circleColor?: string;
  waveColor?: string;
}> = ({
  size = 64,
  circleColor = SPOTIFY_STUDIO_THEME.green,
  waveColor = "#FFFFFF",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ display: "block", flexShrink: 0 }}
    >
      <circle cx="32" cy="32" r="30" fill={circleColor} />
      <path
        d="M17.2 24.4C26.5 21.6 39.2 22.1 47.4 27.1"
        stroke={waveColor}
        strokeWidth="4.6"
        strokeLinecap="round"
      />
      <path
        d="M19.5 33.4C27.2 31.1 37.6 31.6 44.3 35.8"
        stroke={waveColor}
        strokeWidth="3.9"
        strokeLinecap="round"
      />
      <path
        d="M21.8 41.8C27.9 40.0 36.1 40.4 41.4 43.7"
        stroke={waveColor}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

// ============================================================================
// 3. Bespoke Editorial Album Cover Artwork (Crisp Graphic Prints on Light UI)
// ============================================================================
export type AlbumArtId =
  | "seoul-rain"
  | "midnight-velvet"
  | "analog-bloom"
  | "solar-dub"
  | "concrete-echo"
  | "northern-glass";

export const AlbumCoverArt: React.FC<{
  id: AlbumArtId;
  size: number;
  radius?: number;
  showVinyl?: boolean;
  vinylPeek?: number;
}> = ({ id, size, radius = 16, showVinyl = false, vinylPeek = 0.24 }) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const renderArtSvg = () => {
    switch (id) {
      case "seoul-rain":
        return (
          <svg width={size} height={size} viewBox="0 0 240 240" fill="none">
            <rect width="240" height="240" fill="#0F261D" />
            <circle cx="120" cy="100" r="56" stroke="#1DB954" strokeWidth="2.5" />
            <circle cx="120" cy="100" r="34" fill="#1DB954" fillOpacity="0.24" />
            <circle cx="120" cy="100" r="14" fill="#FFFFFF" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <rect
                key={i}
                x={36 + i * 28}
                y={152 + (i % 2) * 10}
                width={3.5}
                height={50 - (i % 3) * 10}
                rx={1.75}
                fill="#1ED760"
                fillOpacity={0.35 + (i % 3) * 0.25}
              />
            ))}
            <text
              x="20"
              y="220"
              fill="#FFFFFF"
              fontSize="13"
              fontWeight="700"
              letterSpacing="2.4"
              fontFamily={FONT_MONO}
            >
              SEOUL · 02:14
            </text>
          </svg>
        );

      case "midnight-velvet":
        return (
          <svg width={size} height={size} viewBox="0 0 240 240" fill="none">
            <defs>
              <linearGradient id={`mv-bg-${uid}`} x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3B122B" />
                <stop offset="100%" stopColor="#170A16" />
              </linearGradient>
            </defs>
            <rect width="240" height="240" fill={`url(#mv-bg-${uid})`} />
            <path d="M24 166C68 96 156 178 216 74" stroke="#FDA4AF" strokeWidth="4" strokeLinecap="round" />
            <path d="M24 190C76 128 156 202 216 106" stroke="#FB7185" strokeWidth="2" strokeOpacity="0.65" />
            <circle cx="152" cy="86" r="24" fill="#FFF1F2" />
            <text
              x="20"
              y="34"
              fill="#FFE4E6"
              fontSize="12"
              fontWeight="600"
              letterSpacing="2"
              fontFamily={FONT_MONO}
            >
              VELVET SESSION
            </text>
          </svg>
        );

      case "analog-bloom":
        return (
          <svg width={size} height={size} viewBox="0 0 240 240" fill="none">
            <rect width="240" height="240" fill="#FBF5E6" />
            <circle cx="120" cy="108" r="68" fill="#F59E0B" fillOpacity="0.22" />
            <circle cx="120" cy="108" r="44" fill="#F59E0B" fillOpacity="0.48" />
            <circle cx="120" cy="108" r="22" fill="#D97706" />
            <rect x="28" y="168" width="184" height="2.5" fill="#1C1917" fillOpacity="0.22" />
            <text
              x="28"
              y="198"
              fill="#1C1917"
              fontSize="14"
              fontWeight="700"
              letterSpacing="1.8"
              fontFamily={FONT_SANS}
            >
              WARM TAPE 04
            </text>
          </svg>
        );

      case "solar-dub":
        return (
          <svg width={size} height={size} viewBox="0 0 240 240" fill="none">
            <rect width="240" height="240" fill="#F3EFE6" />
            <rect x="20" y="20" width="200" height="128" rx="14" fill="#111114" />
            <circle cx="120" cy="84" r="42" fill="#1DB954" />
            <circle cx="144" cy="84" r="42" fill="#F3EFE6" fillOpacity="0.2" />
            <rect x="20" y="168" width="120" height="10" rx="5" fill="#111114" />
            <rect x="20" y="188" width="76" height="8" rx="4" fill="#111114" fillOpacity="0.35" />
            <circle cx="204" cy="186" r="14" fill="#1DB954" />
          </svg>
        );

      case "concrete-echo":
        return (
          <svg width={size} height={size} viewBox="0 0 240 240" fill="none">
            <rect width="240" height="240" fill="#EFF4FA" />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={28 + i * 16}
                y={28 + i * 16}
                width={184 - i * 32}
                height={184 - i * 32}
                rx={16 - i * 2}
                stroke="#1E3A8A"
                strokeOpacity={0.14 + i * 0.14}
                strokeWidth="2.4"
              />
            ))}
            <circle cx="120" cy="120" r="16" fill="#2563EB" />
          </svg>
        );

      case "northern-glass":
        return (
          <svg width={size} height={size} viewBox="0 0 240 240" fill="none">
            <rect width="240" height="240" fill="#EAF7EF" />
            <polygon points="120,34 202,188 38,188" fill="#1DB954" fillOpacity="0.22" stroke="#0F8A3E" strokeWidth="2.8" />
            <polygon points="120,74 172,172 68,172" fill="#1DB954" fillOpacity="0.36" />
            <line x1="28" y1="138" x2="212" y2="138" stroke="#0B0B0E" strokeOpacity="0.35" strokeWidth="1.6" />
          </svg>
        );
    }
  };

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {showVinyl && (
        <div
          style={{
            position: "absolute",
            top: Math.round(size * 0.05),
            left: Math.round(size * vinylPeek),
            width: Math.round(size * 0.9),
            height: Math.round(size * 0.9),
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, #1DB954 0%, #1DB954 16%, #18181D 17%, #18181D 24%, #26262E 25%, #121216 38%, #24242B 40%, #111114 100%)",
            border: "1.5px solid rgba(11, 11, 14, 0.18)",
            boxShadow: "0 12px 26px rgba(11, 11, 14, 0.16)",
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          borderRadius: radius,
          overflow: "hidden",
          boxShadow: "0 14px 34px rgba(11, 11, 14, 0.12)",
          border: "1px solid rgba(11, 11, 14, 0.08)",
        }}
      >
        {renderArtSvg()}
      </div>
    </div>
  );
};

// ============================================================================
// 4. Clean Light Gallery Backdrop (Pure Solid Surface + Optional Crisp Dot-Grid)
//    STRICTLY ZERO blurred radial-gradient circle / ambient glow orb effects.
// ============================================================================
export const SpotifyBackdrop: React.FC<{
  mode?: "white" | "paper" | "mint";
  showDotGrid?: boolean;
}> = ({ mode = "white", showDotGrid = false }) => {
  const bg =
    mode === "paper"
      ? SPOTIFY_STUDIO_THEME.paperBg
      : mode === "mint"
        ? SPOTIFY_STUDIO_THEME.mintBg
        : SPOTIFY_STUDIO_THEME.bg;

  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {showDotGrid && (
        <AbsoluteFill
          style={{
            backgroundImage: "radial-gradient(rgba(11, 11, 14, 0.075) 1.3px, transparent 1.3px)",
            backgroundSize: "30px 30px",
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// 5. True Directional Motion Blur (SVG feGaussianBlur stdDeviation="x y")
//    Drops strictly to zero filter overhead at rest (<= 0.15px).
// ============================================================================
export const DirectionalMotionBlur: React.FC<{
  blurX: number;
  blurY: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ blurX, blurY, style, children }) => {
  const rawId = useId();
  const filterId = `sp-blur-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
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
// 6. Fast Tiled Deterministic Film Grain (128x128 Data-URI for Anti-Banding)
// ============================================================================
const GRAIN_TILE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="11" stitchTiles="stitch"/></filter>` +
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

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        mixBlendMode: "multiply",
        backgroundImage: GRAIN_TILE_DATA_URI,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        backgroundPosition: `${(step * 47) % 128}px ${(step * 73) % 128}px`,
      }}
    />
  );
};

// ============================================================================
// 7. Exact Focal-Lock 2D Spatial Camera Rig (transformOrigin: "0 0")
// ============================================================================
export const SpatialCameraRig: React.FC<{
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
// 8. Tactile Vector Pointer (Crisp Black Ink + White Outline on Light Canvas)
// ============================================================================
export const TactileCursor: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  fill?: string;
  stroke?: string;
}> = ({
  x,
  y,
  scale = 1,
  opacity = 1,
  fill = "#0B0B0E",
  stroke = "#FFFFFF",
}) => {
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
        filter: "drop-shadow(0 6px 12px rgba(11, 11, 14, 0.22))",
      }}
    >
      <svg width={44} height={44} viewBox="0 0 24 24" fill="none">
        <path
          d="M4.5 3L19.5 11.8L12.2 13.8L9.2 20.8L4.5 3Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={1.7}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// ============================================================================
// 9. 1-to-1 SVG Bezier Node Wire + Traveling Signal Pulse (Light Surface Ready)
// ============================================================================
export const ConnectedNodeWire: React.FC<{
  width?: number;
  height?: number;
  drawProgress: number;
  pulseProgress?: number;
  pulseOpacity?: number;
  accentColor?: string;
}> = ({
  width = 230,
  height = 64,
  drawProgress,
  pulseProgress = 0,
  pulseOpacity = 0,
  accentColor = SPOTIFY_STUDIO_THEME.green,
}) => {
  const clampedDraw = Math.max(0, Math.min(1, drawProgress));
  const clampedPulse = Math.max(0, Math.min(1, pulseProgress));
  const yMid = height / 2;
  const xStart = 8;
  const xEnd = width - 8;
  const pathLen = xEnd - xStart;
  const pulseX = xStart + clampedPulse * pathLen;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible", flexShrink: 0 }}
    >
      <path
        d={`M ${xStart} ${yMid} C ${width * 0.36} ${yMid}, ${width * 0.64} ${yMid}, ${xEnd} ${yMid}`}
        fill="none"
        stroke="rgba(11, 11, 14, 0.14)"
        strokeWidth={4}
      />
      <path
        d={`M ${xStart} ${yMid} C ${width * 0.36} ${yMid}, ${width * 0.64} ${yMid}, ${xEnd} ${yMid}`}
        fill="none"
        stroke={accentColor}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen * (1 - clampedDraw)}
      />
      <circle cx={xStart} cy={yMid} r={6} fill={accentColor} />
      <circle
        cx={xEnd}
        cy={yMid}
        r={6}
        fill={clampedDraw > 0.96 ? accentColor : "rgba(11, 11, 14, 0.22)"}
      />
      {pulseOpacity > 0.01 && (
        <g opacity={pulseOpacity}>
          <circle cx={pulseX} cy={yMid} r={11} fill={accentColor} fillOpacity={0.22} />
          <circle cx={pulseX} cy={yMid} r={6.5} fill="#0B0B0E" stroke={accentColor} strokeWidth={2.5} />
        </g>
      )}
    </svg>
  );
};

// ============================================================================
// 10. Crisp Vector Device Icons for Spotify Connect Inline Slot-Swap
// ============================================================================
export type ConnectDeviceKind = "headphones" | "car" | "speaker" | "laptop";

export const ConnectDeviceIcon: React.FC<{
  kind: ConnectDeviceKind;
  size?: number;
  color?: string;
}> = ({ kind, size = 46, color = "#FFFFFF" }) => {
  switch (kind) {
    case "headphones":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path
            d="M6 17V15.5C6 9.977 10.477 5.5 16 5.5C21.523 5.5 26 9.977 26 15.5V17"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <rect x="4.5" y="16" width="5.5" height="9.5" rx="2.75" fill={color} />
          <rect x="22" y="16" width="5.5" height="9.5" rx="2.75" fill={color} />
        </svg>
      );
    case "car":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path
            d="M7.5 14L10 8.5C10.5 7.5 11.4 7 12.5 7H19.5C20.6 7 21.5 7.5 22 8.5L24.5 14H7.5Z"
            stroke={color}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <rect x="5" y="14" width="22" height="8" rx="3" fill={color} />
          <circle cx="10" cy="23.5" r="2.6" fill={color} />
          <circle cx="22" cy="23.5" r="2.6" fill={color} />
        </svg>
      );
    case "speaker":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <rect x="8.5" y="4.5" width="15" height="23" rx="4" stroke={color} strokeWidth="2.6" />
          <circle cx="16" cy="11" r="2.1" fill={color} />
          <circle cx="16" cy="19.5" r="4.2" stroke={color} strokeWidth="2.5" />
        </svg>
      );
    case "laptop":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <rect x="6.5" y="7" width="19" height="13" rx="2.5" stroke={color} strokeWidth="2.6" />
          <path d="M4 23H28" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      );
  }
};

// ============================================================================
// 11. Declarative Beat-Locked Audio & Procedural SFX Layer
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

  const fadeStart = Math.max(0, durationInFrames - durSec(1.1, fps));
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
          durationInFrames={cue.durationInFrames ?? durSec(1.2, fps)}
        >
          <Audio src={staticFile(cue.src)} volume={cue.volume ?? 0.36} />
        </Sequence>
      ))}
    </>
  );
};
