import React from "react";
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { sec } from "../lib/studioMotion";

// Race-free verified webfont loading (Universal Law L4)
const jakarta = loadJakarta("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

const jetbrainsMono = loadMono("normal", {
  weights: ["500", "600"],
  subsets: ["latin"],
});

export const SPOTIFY_FONT_SANS = jakarta.fontFamily;
export const SPOTIFY_FONT_MONO = jetbrainsMono.fontFamily;

export const SPOTIFY_THEME = {
  obsidianBg: "#0A0A0A",
  obsidianTop: "#0F0F11",
  obsidianBottom: "#070708",
  obsidianSurface: "#161618",
  obsidianElevated: "#1F1F23",
  obsidianBorder: "rgba(255, 255, 255, 0.10)",
  obsidianBorderStrong: "rgba(255, 255, 255, 0.16)",
  lightBg: "#F6F6F2",
  lightTop: "#FAF9F6",
  lightBottom: "#EEEDE7",
  lightSurface: "#FFFFFF",
  lightBorder: "rgba(18, 18, 18, 0.09)",
  green: "#1DB954",
  greenBright: "#1ED760",
  greenDeep: "#158A3E",
  inkDark: "#FFFFFF",
  mutedDark: "#A7A7A7",
  inkLight: "#121212",
  mutedLight: "#5E5E5E",
} as const;

// ============================================================================
// 1. Clean Linear Studio Backdrops (Zero Radial Glow Orbs)
// ============================================================================
export const SpotifyStudioBackdrop: React.FC<{
  polarity: "dark" | "light";
  parallaxX?: number;
  parallaxY?: number;
}> = ({ polarity, parallaxX = 0, parallaxY = 0 }) => {
  const isDark = polarity === "dark";
  const bg = isDark
    ? `linear-gradient(180deg, ${SPOTIFY_THEME.obsidianTop} 0%, ${SPOTIFY_THEME.obsidianBg} 52%, ${SPOTIFY_THEME.obsidianBottom} 100%)`
    : `linear-gradient(180deg, ${SPOTIFY_THEME.lightTop} 0%, ${SPOTIFY_THEME.lightBg} 55%, ${SPOTIFY_THEME.lightBottom} 100%)`;

  const dotColor = isDark ? "rgba(255,255,255,0.055)" : "rgba(18,18,18,0.075)";
  const gridX = ((parallaxX % 32) + 32) % 32;
  const gridY = ((parallaxY % 32) + 32) % 32;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: bg,
        overflow: "hidden",
      }}
    >
      {/* Camera-coupled 32px micro-dot architectural plane */}
      <div
        style={{
          position: "absolute",
          inset: -64,
          backgroundImage: `radial-gradient(${dotColor} 1.25px, transparent 1.25px)`,
          backgroundSize: "32px 32px",
          transform: `translate3d(${gridX}px, ${gridY}px, 0)`,
        }}
      />
    </div>
  );
};

// Lightweight tiled anti-banding film grain (no SVG feTurbulence overhead)
export const SpotifyFilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.025 }) => {
  const frame = useCurrentFrame();
  const ox = (frame * 37) % 128;
  const oy = (frame * 53) % 128;
  return (
    <div
      style={{
        position: "absolute",
        inset: -128,
        pointerEvents: "none",
        opacity,
        backgroundImage:
          "repeating-radial-gradient(circle at 17% 32%, rgba(255,255,255,0.7) 0, rgba(0,0,0,0.7) 1px, transparent 2px)",
        backgroundSize: "128px 128px",
        transform: `translate3d(${ox}px, ${oy}px, 0)`,
        mixBlendMode: "overlay",
      }}
    />
  );
};

// ============================================================================
// 2. Spotify Official Geometric Logo Mark (with drawable arcs for Finale)
// ============================================================================
export const SpotifyLogoMark: React.FC<{
  size: number;
  arcProgress?: number; // 0 -> 1 draws the 3 iconic curved arcs
  bgColor?: string;
  arcColor?: string;
}> = ({
  size,
  arcProgress = 1,
  bgColor = SPOTIFY_THEME.green,
  arcColor = "#0A0A0A",
}) => {
  const p1 = interpolate(arcProgress, [0, 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p2 = interpolate(arcProgress, [0.16, 0.78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p3 = interpolate(arcProgress, [0.32, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48" fill={bgColor} />
      {/* Top arc */}
      <path
        d="M25.5 39.5C41.5 34.8 61.8 35.8 75.5 43.2"
        stroke={arcColor}
        strokeWidth="7.4"
        strokeLinecap="round"
        strokeOpacity={p1 > 0.01 ? 1 : 0}
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100 * (1 - p1)}
      />
      {/* Middle arc */}
      <path
        d="M29.8 54.4C43.2 50.6 59.6 51.5 70.6 57.6"
        stroke={arcColor}
        strokeWidth="6.4"
        strokeLinecap="round"
        strokeOpacity={p2 > 0.01 ? 1 : 0}
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100 * (1 - p2)}
      />
      {/* Bottom arc */}
      <path
        d="M34.2 68.5C44.8 65.5 57.5 66.2 66.2 71.1"
        stroke={arcColor}
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeOpacity={p3 > 0.01 ? 1 : 0}
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100 * (1 - p3)}
      />
    </svg>
  );
};

// ============================================================================
// 3. Hero Motif — The Tactile Spotify Green Play Disc
// ============================================================================
export const SpotifyPlayDisc: React.FC<{
  size: number;
  isPlaying?: boolean;
  pressScale?: number;
  ringPulse?: number; // 0 -> 1 expanding crisp acoustic ring
}> = ({ size, isPlaying = false, pressScale = 1, ringPulse = 0 }) => {
  const iconSize = Math.round(size * 0.44);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${pressScale})`,
      }}
    >
      {/* Crisp 1.5px acoustic shockwave ring (no fuzzy glow) */}
      {ringPulse > 0.01 && ringPulse < 0.99 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `2.5px solid ${SPOTIFY_THEME.greenBright}`,
            transform: `scale(${1 + ringPulse * 1.45})`,
            opacity: (1 - ringPulse) * 0.72,
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `linear-gradient(180deg, ${SPOTIFY_THEME.greenBright} 0%, ${SPOTIFY_THEME.green} 100%)`,
          boxShadow:
            "inset 0 1.5px 0 rgba(255,255,255,0.34), 0 12px 28px rgba(0,0,0,0.42)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isPlaying ? (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <rect x="5" y="4" width="4.6" height="16" rx="1.6" fill="#0A0A0A" />
            <rect x="14.4" y="4" width="4.6" height="16" rx="1.6" fill="#0A0A0A" />
          </svg>
        ) : (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            style={{ transform: "translateX(2px)" }}
          >
            <path d="M6.5 4.6L19.8 12L6.5 19.4V4.6Z" fill="#0A0A0A" />
          </svg>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 4. Deterministic Live Equalizer Bars (Living Hold Micro-Momentum)
// ============================================================================
export const LiveEqualizerBars: React.FC<{
  count?: number;
  width?: number;
  height?: number;
  color?: string;
  active?: boolean;
  energy?: number;
}> = ({
  count = 5,
  width = 36,
  height = 28,
  color = SPOTIFY_THEME.green,
  active = true,
  energy = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const gap = Math.max(2, Math.round(width / (count * 3.2)));
  const barW = Math.max(2.5, (width - gap * (count - 1)) / count);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        width,
        height,
        gap,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const phase = i * 1.15 + 0.4;
        const beatWave = Math.abs(Math.sin(t * Math.PI * 2 + phase));
        const subWave = Math.abs(Math.cos(t * Math.PI * 3.1 + i * 0.72));
        const level = active
          ? 0.22 + (0.48 * beatWave + 0.30 * subWave) * energy
          : 0.18;
        const barH = Math.max(4, Math.round(height * Math.min(1, level)));

        return (
          <div
            key={i}
            style={{
              width: barW,
              height: barH,
              borderRadius: barW,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
};

// ============================================================================
// 5. Studio Graphic Album Art (Zero Stick-Figure Clipart)
// ============================================================================
export type AlbumArtVariant = "midnight" | "discover" | "radar" | "drive";

export const GeometricAlbumArt: React.FC<{
  variant: AlbumArtVariant;
  size: number;
  radius?: number;
  spinDeg?: number;
}> = ({ variant, size, radius = 18, spinDeg = 0 }) => {
  const palettes: Record<
    AlbumArtVariant,
    { bg: string; band1: string; band2: string; accent: string; label: string }
  > = {
    midnight: {
      bg: "linear-gradient(135deg, #102820 0%, #0D1B2A 52%, #1B102E 100%)",
      band1: "#1DB954",
      band2: "#2DD4BF",
      accent: "#E2F8EA",
      label: "VOL. 04",
    },
    discover: {
      bg: "linear-gradient(135deg, #1D3557 0%, #2B2D42 55%, #161618 100%)",
      band1: "#FF6B4A",
      band2: "#F4D35E",
      accent: "#FFFFFF",
      label: "WEEKLY",
    },
    radar: {
      bg: "linear-gradient(135deg, #14281D 0%, #1E3A2B 52%, #0F1713 100%)",
      band1: "#1ED760",
      band2: "#A3E635",
      accent: "#ECFCCB",
      label: "FRIDAY",
    },
    drive: {
      bg: "linear-gradient(135deg, #2D142C 0%, #510A32 52%, #1A0B1E 100%)",
      band1: "#F97316",
      band2: "#FB7185",
      accent: "#FFF1F2",
      label: "NIGHT",
    },
  };

  const p = palettes[variant];

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: radius,
        overflow: "hidden",
        background: p.bg,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
        flexShrink: 0,
      }}
    >
      {/* Architectural Vinyl / Graphic Rings */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotate(${spinDeg}deg)`,
        }}
      >
        <circle cx="152" cy="96" r="88" fill={p.band1} fillOpacity="0.88" />
        <circle cx="88" cy="154" r="64" fill={p.band2} fillOpacity="0.65" />
        <circle cx="120" cy="120" r="82" stroke={p.accent} strokeOpacity="0.22" strokeWidth="1.5" />
        <circle cx="120" cy="120" r="56" stroke={p.accent} strokeOpacity="0.28" strokeWidth="1.5" />
        <circle cx="120" cy="120" r="24" fill="#0A0A0A" />
        <circle cx="120" cy="120" r="8" fill={p.band1} />
      </svg>

      {/* Crisp geometric graphic diagonal slice */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "36%",
          background: "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.68) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: Math.round(size * 0.08),
          top: Math.round(size * 0.08),
          fontFamily: SPOTIFY_FONT_MONO,
          fontSize: Math.max(11, Math.round(size * 0.065)),
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.85)",
          backgroundColor: "rgba(10,10,10,0.45)",
          padding: "4px 8px",
          borderRadius: 6,
        }}
      >
        {p.label}
      </div>
    </div>
  );
};

// ============================================================================
// 6. 2.5D Perspective Titanium Smartphone Stage (with Glass Sheen & Z-Layers)
// ============================================================================
export const PerspectivePhoneStage: React.FC<{
  rotateX: number;
  rotateY: number;
  rotateZ?: number;
  scale?: number;
  x?: number;
  y?: number;
  sheenProgress?: number;
  behindText?: React.ReactNode;
  explodedOverlay?: React.ReactNode;
  children: React.ReactNode;
}> = ({
  rotateX,
  rotateY,
  rotateZ = 0,
  scale = 1,
  x = 0,
  y = 0,
  sheenProgress = 0.5,
  behindText,
  explodedOverlay,
  children,
}) => {
  const shadowX = -rotateY * 2.1;
  const shadowY = 42 + rotateX * 1.8;
  const sheenOffset = (sheenProgress - 0.5) * 740 - rotateY * 14;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {behindText && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translate3d(${-rotateY * 1.5}px, ${-rotateX * 1.1}px, -140px)`,
          }}
        >
          {behindText}
        </div>
      )}

      <div
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          filter: `drop-shadow(${shadowX}px ${shadowY}px 46px rgba(0, 0, 0, 0.55))`,
        }}
      >
        {/* Titanium Chassis + OLED Screen */}
        <div
          style={{
            position: "relative",
            width: 416,
            height: 820,
            borderRadius: 56,
            padding: 12,
            background: "linear-gradient(145deg, #3A3A40 0%, #1C1C20 45%, #2D2D33 100%)",
            boxShadow:
              "inset 0 1.5px 1px rgba(255,255,255,0.28), inset 0 -1.5px 2px rgba(0,0,0,0.7)",
            transform: "translateZ(0px)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 45,
              backgroundColor: "#111113",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Dynamic Island */}
            <div
              style={{
                position: "absolute",
                top: 14,
                left: "50%",
                transform: "translateX(-50%)",
                width: 112,
                height: 28,
                borderRadius: 999,
                backgroundColor: "#000000",
                zIndex: 30,
              }}
            />

            {children}

            {/* Coupled Specular Glass Sheen */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 45,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 40,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-30%",
                  bottom: "-30%",
                  width: 240,
                  left: "50%",
                  transform: `translate3d(${sheenOffset}px, 0, 0) rotate(24deg)`,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0) 100%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Exploded Front Z-Plane (+82px) */}
        {explodedOverlay && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: "translateZ(82px)",
              transformStyle: "preserve-3d",
              pointerEvents: "none",
            }}
          >
            {explodedOverlay}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 7. Directional Motion Blur (Strict 0px at Rest)
// ============================================================================
export const DirectionalMotionBlur: React.FC<{
  id: string;
  blurX: number;
  blurY: number;
  children: React.ReactNode;
}> = ({ id, blurX, blurY, children }) => {
  const active = blurX > 0.2 || blurY > 0.2;
  if (!active) {
    return <>{children}</>;
  }
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={`${blurX.toFixed(1)} ${blurY.toFixed(1)}`} />
          </filter>
        </defs>
      </svg>
      <div style={{ position: "absolute", inset: 0, filter: `url(#${id})` }}>{children}</div>
    </>
  );
};

// ============================================================================
// 8. SFX-Only Studio Audio Layer (Universal Law L5)
// ============================================================================
export interface SpotifySfxCue {
  frame?: number;
  peakAtFrame?: number;
  peakOffsetSec?: number;
  src: string;
  volume?: number;
  playbackRate?: number;
}

export const SpotifySoundLayer: React.FC<{ cues: SpotifySfxCue[] }> = ({ cues }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {cues.map((cue, idx) => {
        const startFrame =
          cue.peakAtFrame !== undefined
            ? Math.max(0, cue.peakAtFrame - sec(cue.peakOffsetSec ?? 0.16, fps))
            : Math.max(0, cue.frame ?? 0);

        return (
          <Sequence key={`${cue.src}-${idx}-${startFrame}`} from={startFrame}>
            <Audio
              src={staticFile(cue.src)}
              volume={cue.volume ?? 0.35}
              playbackRate={cue.playbackRate ?? 1}
            />
          </Sequence>
        );
      })}
    </>
  );
};
