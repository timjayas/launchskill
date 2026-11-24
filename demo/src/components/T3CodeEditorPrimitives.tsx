import React, { useId } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { sec } from "../lib/studioMotion";

// ============================================================================
// 1. Verified @remotion/google-fonts Loading (Zero System Font Fallback)
// ============================================================================
const spaceGroteskFont = loadSpaceGrotesk("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

const interFont = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const jetBrainsMonoFont = loadJetBrainsMono("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const T3E_FONTS = {
  display: spaceGroteskFont.fontFamily,
  sans: interFont.fontFamily,
  mono: jetBrainsMonoFont.fontFamily,
} as const;

// ============================================================================
// 2. Bespoke Brand Tokens — T3Code AI Code Editor
// ============================================================================
export const T3E_THEME = {
  // Architectural Gallery Light Polarity (~83% runtime)
  canvasTop: "#FFFFFF",
  canvasMid: "#F6F6F4",
  canvasBottom: "#EAEAE6",
  surfaceLight: "#FFFFFF",
  borderLight: "rgba(14, 15, 18, 0.09)",
  borderLightStrong: "rgba(14, 15, 18, 0.16)",

  // High-Contrast Obsidian Chrome & Earned Dark Climax (~17% runtime)
  obsidianTop: "#13151B",
  obsidian: "#0C0D10",
  obsidianBottom: "#08090C",
  editorSurface: "#12151C",
  editorElevated: "#181C25",
  editorBorder: "rgba(255, 255, 255, 0.11)",
  editorBorderSubtle: "rgba(255, 255, 255, 0.06)",

  // Typography Ink
  ink: "#0E0F12",
  inkSecondary: "#454954",
  inkMuted: "#5A5F6B",
  inkOnDark: "#F8F9FB",
  inkMutedOnDark: "#98A0B0",

  // Primary Brand Accent: Electric Cobalt (Cursor Beam & Active Rail)
  cobalt: "#2563EB",
  cobaltBright: "#3B82F6",
  cobaltSoft: "rgba(37, 99, 235, 0.14)",

  // Authentic Subscription Provider Accents (strictly scoped to provider pills)
  claude: "#D97757",
  codex: "#10A37F",
  gemini: "#3B82F6",

  // Syntax & Diff Accents
  diffAddBg: "rgba(16, 185, 129, 0.13)",
  diffAddBorder: "#10B981",
  diffAddText: "#6EE7B7",
  diffDelBg: "rgba(239, 68, 68, 0.12)",
  diffDelBorder: "#EF4444",
  diffDelText: "#FCA5A5",

  // Multi-layer Studio Shadows
  shadowWindow:
    "0 44px 100px rgba(12, 13, 16, 0.24), 0 14px 32px rgba(12, 13, 16, 0.14), 0 1px 3px rgba(12, 13, 16, 0.08)",
  shadowRail:
    "0 26px 64px rgba(12, 13, 16, 0.20), 0 8px 20px rgba(12, 13, 16, 0.12)",
  shadowCard:
    "0 14px 36px rgba(14, 15, 18, 0.08), 0 2px 8px rgba(14, 15, 18, 0.04)",

  radiusWindow: 16,
  radiusRail: 14,
  radiusPill: 999,
} as const;

// ============================================================================
// 3. Camera-Coupled Studio Cyclorama (Zero Blurred Radial Orbs)
// ============================================================================
export const T3StudioCyclorama: React.FC<{
  dark?: boolean;
  zoom?: number;
  panX?: number;
  panY?: number;
  dotOpacity?: number;
}> = ({ dark = false, zoom = 1, panX = 0, panY = 0, dotOpacity }) => {
  const bg = dark
    ? `linear-gradient(180deg, ${T3E_THEME.obsidianTop} 0%, ${T3E_THEME.obsidian} 52%, ${T3E_THEME.obsidianBottom} 100%)`
    : `linear-gradient(180deg, ${T3E_THEME.canvasTop} 0%, ${T3E_THEME.canvasMid} 56%, ${T3E_THEME.canvasBottom} 100%)`;

  const dotColor = dark
    ? `rgba(255, 255, 255, ${dotOpacity ?? 0.06})`
    : `rgba(14, 15, 18, ${dotOpacity ?? 0.065})`;

  const gridSpacing = Math.max(18, Math.round(32 * Math.min(1.5, zoom)));

  return (
    <AbsoluteFill
      style={{
        background: bg,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -160,
          backgroundImage: `radial-gradient(${dotColor} 1.25px, transparent 1.25px)`,
          backgroundSize: `${gridSpacing}px ${gridSpacing}px`,
          backgroundPosition: `${panX * 0.28}px ${panY * 0.28}px`,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// 4. Focal-Locked Spatial Camera Rig + Directional Motion Blur
// ============================================================================
export const T3SpatialCamera: React.FC<{
  wx: number;
  wy: number;
  zoom: number;
  blurX?: number;
  blurY?: number;
  children: React.ReactNode;
}> = ({ wx, wy, zoom, blurX = 0, blurY = 0, children }) => {
  const { width, height } = useVideoConfig();
  const filterId = useId().replace(/:/g, "");
  const tx = width / 2 - wx * zoom;
  const ty = height / 2 - wy * zoom;
  const hasBlur = blurX > 0.25 || blurY > 0.25;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {hasBlur && (
        <svg
          width="0"
          height="0"
          style={{ position: "absolute", pointerEvents: "none" }}
        >
          <defs>
            <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={`${blurX.toFixed(2)} ${blurY.toFixed(2)}`}
              />
            </filter>
          </defs>
        </svg>
      )}
      <div
        style={{
          position: "absolute",
          width,
          height,
          transformOrigin: "0 0",
          transform: `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${zoom.toFixed(4)})`,
          filter: hasBlur ? `url(#${filterId})` : "none",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 5. Official Provider & Brand Vector Marks
// ============================================================================
export const ClaudeMark: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <Img
    src={staticFile("logos/claude-color.svg")}
    style={{ width: size, height: size, objectFit: "contain", display: "block" }}
  />
);

export const CodexMark: React.FC<{ size?: number; light?: boolean }> = ({
  size = 26,
  light = true,
}) => (
  <Img
    src={staticFile("logos/openai.svg")}
    style={{
      width: size,
      height: size,
      objectFit: "contain",
      display: "block",
      filter: light ? "invert(1) brightness(1.05)" : "none",
    }}
  />
);

export const GeminiMark: React.FC<{ size?: number }> = ({ size = 26 }) => {
  const gradId = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="3"
          y1="3"
          x2="25"
          y2="25"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1A73E8" />
          <stop offset="55%" stopColor="#4285F4" />
          <stop offset="100%" stopColor="#8AB4F8" />
        </linearGradient>
      </defs>
      <path
        d="M14 2C14.7 8.4 19.6 13.3 26 14C19.6 14.7 14.7 19.6 14 26C13.3 19.6 8.4 14.7 2 14C8.4 13.3 13.3 8.4 14 2Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  );
};

export const T3CodeMark: React.FC<{
  size?: number;
  darkSurface?: boolean;
}> = ({ size = 48, darkSurface = false }) => {
  const bg = darkSurface ? "#F8F9FB" : T3E_THEME.obsidian;
  const fg = darkSurface ? T3E_THEME.obsidian : "#F8F9FB";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.24),
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: darkSurface
          ? "0 8px 24px rgba(0,0,0,0.4)"
          : "0 12px 28px rgba(12,13,16,0.22)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <svg
        width={Math.round(size * 0.62)}
        height={Math.round(size * 0.62)}
        viewBox="0 0 32 32"
        fill="none"
      >
        {/* Architectural T + 3 Monogram */}
        <path
          d="M4 6H20V10.2H14.2V26H9.8V10.2H4V6Z"
          fill={fg}
        />
        <path
          d="M21 6H28V10H24.2V13.8H28V17.8H24.2V22H28V26H21V22H24.2V17.8H21.6V13.8H24.2V10H21V6Z"
          fill={T3E_THEME.cobaltBright}
        />
      </svg>
    </div>
  );
};

// ============================================================================
// 6. Baseline-Masked Kinetic Typography (Harmonic Stagger)
// ============================================================================
export const T3MaskedWords: React.FC<{
  words: Array<{ text: string; color?: string; weight?: number }>;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  align?: "center" | "left";
}> = ({
  words,
  startFrame = 0,
  fontSize = 84,
  color = T3E_THEME.ink,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: Math.round(fontSize * 0.25),
        rowGap: Math.round(fontSize * 0.08),
      }}
    >
      {words.map((w, idx) => {
        const delayFrames = Math.round(Math.pow(idx, 0.8) * sec(0.055, fps));
        const p = spring({
          frame: Math.max(0, frame - startFrame - delayFrames),
          fps,
          config: { damping: 26, stiffness: 220, mass: 0.78 },
        });
        const yPercent = (1 - p) * 112;

        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: "0.14em",
              marginBottom: "-0.14em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translate3d(0, ${yPercent.toFixed(2)}%, 0)`,
                fontFamily: T3E_FONTS.display,
                fontWeight: w.weight ?? 700,
                fontSize,
                letterSpacing: "-0.04em",
                lineHeight: 1.04,
                color: w.color ?? color,
              }}
            >
              {w.text}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// ============================================================================
// 7. Fast 128x128 Tiled Anti-Banding Film Grain
// ============================================================================
const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="128" height="128" filter="url(#n)" opacity="0.55"/></svg>`
);

export const T3FastFilmGrain: React.FC<{ opacity?: number }> = ({
  opacity = 0.022,
}) => {
  const frame = useCurrentFrame();
  // Deterministic 12fps grain shift
  const step = Math.floor(frame / 2);
  const ox = (step * 37) % 128;
  const oy = (step * 53) % 128;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        backgroundPosition: `${ox}px ${oy}px`,
        mixBlendMode: "overlay",
      }}
    />
  );
};

// ============================================================================
// 8. Procedural DSP Audio Layer (SFX-Only Default, Peak-Aligned)
// ============================================================================
export interface T3EAudioCue {
  frame?: number;
  peakAtFrame?: number;
  peakOffsetSec?: number;
  src: string;
  volume?: number;
  playbackRate?: number;
}

export const T3AudioLayer: React.FC<{ cues: T3EAudioCue[] }> = ({ cues }) => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <>
      {cues.map((cue, idx) => {
        const startFrame =
          cue.peakAtFrame !== undefined
            ? Math.max(
                0,
                cue.peakAtFrame - sec(cue.peakOffsetSec ?? 0.16, fps)
              )
            : Math.max(0, cue.frame ?? 0);

        if (startFrame >= durationInFrames) return null;

        return (
          <Sequence key={idx} from={startFrame}>
            <Audio
              src={staticFile(cue.src)}
              volume={cue.volume ?? 0.32}
              playbackRate={cue.playbackRate ?? 1}
            />
          </Sequence>
        );
      })}
    </>
  );
};
