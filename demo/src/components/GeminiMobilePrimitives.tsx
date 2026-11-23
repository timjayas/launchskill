import React, { useId } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  durSec,
  sec,
} from "../lib/studioMotion";

// ============================================================================
// 1. Bespoke Google Gemini Mobile v2 Design System
//    - Tactile 2.5D Perspective Hardware + Coupled Specular Glass Sheen
//    - Exploded Z-Axis Screen-to-World Cards (translateZ +65px to +115px)
//    - Depth-Occluded Giant Background Typography (translateZ -150px)
//    - Zero Stick-Figure Clipart, Zero Cloned T3Code Scenes
// ============================================================================
export const GEMINI_THEME = {
  canvas: "#F4F6F9",
  surface: "#FFFFFF",
  surfaceSubtle: "#EEF2F7",
  surfaceGlass: "rgba(255, 255, 255, 0.92)",
  border: "rgba(15, 23, 42, 0.09)",
  borderStrong: "rgba(15, 23, 42, 0.16)",

  ink: "#0B0F17",
  inkSecondary: "#334155",
  inkMuted: "#64748B",
  inkFaint: "#94A3B8",

  darkCanvas: "#080B11",
  darkSurface: "#111622",
  darkSurfaceElevated: "#192030",
  darkBorder: "rgba(255, 255, 255, 0.12)",
  darkInk: "#F8FAFC",
  darkMuted: "#94A3B8",

  accent: "#1A73E8",
  accentBright: "#4C9AFF",
  accentSoft: "#E8F0FE",
  success: "#16A34A",
  successSoft: "#DCFCE7",
  warning: "#D97706",
  warningSoft: "#FEF3C7",

  shadowCard:
    "0 28px 68px rgba(11, 15, 23, 0.16), 0 8px 20px rgba(11, 15, 23, 0.08), 0 1px 3px rgba(11, 15, 23, 0.06)",
  shadowExploded:
    "0 42px 92px rgba(11, 15, 23, 0.28), 0 14px 32px rgba(26, 115, 232, 0.14)",

  radiusPhone: 54,
  radiusScreen: 44,
  radiusCard: 26,
  radiusPill: 999,
} as const;

// ============================================================================
// 2. Geometric 4-Point Gemini Star Mark
// ============================================================================
export const GeminiStarMark: React.FC<{
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ size = 48, color = GEMINI_THEME.accent, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    style={{ display: "block", flexShrink: 0, ...style }}
  >
    <path
      d="M14 0.75C14 8.067 19.933 14 27.25 14C19.933 14 14 19.933 14 27.25C14 19.933 8.067 14 0.75 14C8.067 14 14 8.067 14 0.75Z"
      fill={color}
    />
  </svg>
);

// ============================================================================
// 3. True Directional Motion Blur (SVG feGaussianBlur stdDeviation="x y")
// ============================================================================
export const GeminiDirectionalBlur: React.FC<{
  blurX: number;
  blurY: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ blurX, blurY, style, children }) => {
  const rawId = useId();
  const filterId = `gm2-blur-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
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
// 4. Clean Studio Backdrop (Zero Skeleton Wireframe Grids, Zero Watermark Text!)
// ============================================================================
export const GeminiSpatialBackdrop: React.FC<{
  dark?: boolean;
  panX?: number;
  panY?: number;
  zoom?: number;
}> = ({
  dark = false,
}) => {
  const bg = dark
    ? "linear-gradient(165deg, #0E131F 0%, #090C14 55%, #05070B 100%)"
    : "linear-gradient(165deg, #FFFFFF 0%, #F7F9FC 58%, #EEF2F8 100%)";

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden", pointerEvents: "none" }} />
  );
};

// ============================================================================
// 5. 2.5D Perspective Hardware Rig with Coupled Specular Studio Glass Sheen
//    & Exploded Front Z-Plane (+85px) for Screen-to-World Pop-Out Cards
// ============================================================================
export const PerspectivePhoneStage: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  width?: number;
  height?: number;
  radius?: number;
  darkScreen?: boolean;
  chromeProgress?: number; // 0 = morphing pill bar, 1 = full phone hardware bezel
  timeLabel?: string;
  explodedOverlay?: React.ReactNode;
  children: React.ReactNode;
}> = ({
  x = 0,
  y = 0,
  scale = 1,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  width = 440,
  height = 888,
  radius = 54,
  darkScreen = true,
  chromeProgress = 1,
  timeLabel = "9:41",
  explodedOverlay,
  children,
}) => {
  // Dynamic elevation shadow shifts inversely to 3D tilt angle
  const shadowX = Math.round(-rotateY * 2.1);
  const shadowY = Math.round(38 + rotateX * 1.7);
  // Coupled studio light reflection sweeps across the OLED glass as the phone turns
  const sheenOffset = -rotateY * 15 + rotateX * 6;
  const statusInk = darkScreen ? "#F8FAFC" : "#0B0F17";
  const bezelPad = Math.round(4 + chromeProgress * 9);
  const innerRadius = Math.max(20, radius - bezelPad + 2);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: 1500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width,
          height,
          transformStyle: "preserve-3d",
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        }}
      >
        {/* Ground-Plane Soft Contact Shadow */}
        <div
          style={{
            position: "absolute",
            inset: 12,
            borderRadius: radius,
            backgroundColor: "rgba(9, 13, 24, 0.34)",
            filter: "blur(36px)",
            transform: `translate3d(${shadowX}px, ${shadowY}px, -45px)`,
            opacity: 0.75 + chromeProgress * 0.25,
          }}
        />

        {/* Titanium Hardware Chassis (Z = 0px) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: radius,
            padding: bezelPad,
            boxSizing: "border-box",
            background:
              "linear-gradient(140deg, #384152 0%, #181D27 46%, #0B0E14 100%)",
            boxShadow:
              "inset 0 1.5px 1px rgba(255,255,255,0.34), inset 0 -1.5px 2px rgba(0,0,0,0.65), 0 18px 42px rgba(9, 13, 24, 0.25)",
            border: "1px solid rgba(255,255,255,0.18)",
            transform: "translateZ(0px)",
          }}
        >
          {/* Side Titanium Buttons (fade in as phone morphs open) */}
          {chromeProgress > 0.5 && (
            <>
              <div
                style={{
                  position: "absolute",
                  right: -4,
                  top: "24%",
                  width: 4,
                  height: 82,
                  borderRadius: "0 3px 3px 0",
                  backgroundColor: "#28303F",
                  opacity: (chromeProgress - 0.5) * 2,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: -4,
                  top: "20%",
                  width: 4,
                  height: 52,
                  borderRadius: "3px 0 0 3px",
                  backgroundColor: "#28303F",
                  opacity: (chromeProgress - 0.5) * 2,
                }}
              />
            </>
          )}

          {/* Inner OLED Screen */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: innerRadius,
              backgroundColor: darkScreen ? "#0C1018" : "#F8FAFC",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Status Bar + Dynamic Island (fades in with chromeProgress) */}
            {chromeProgress > 0.35 && (
              <div
                style={{
                  height: 48,
                  padding: "10px 26px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: FONT_SANS,
                  color: statusInk,
                  opacity: Math.min(1, (chromeProgress - 0.35) / 0.5),
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 25,
                }}
              >
                <span
                  style={{
                    fontSize: 15.5,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {timeLabel}
                </span>

                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 11,
                    transform: "translateX(-50%)",
                    width: 106,
                    height: 27,
                    borderRadius: 999,
                    backgroundColor: "#05070B",
                    border: "1px solid rgba(255,255,255,0.09)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 9,
                  }}
                >
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 999,
                      backgroundColor: "#1D283A",
                      border: "1px solid rgba(96,165,250,0.35)",
                    }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                    <rect x="0" y="7" width="2.5" height="4" rx="1" fill={statusInk} />
                    <rect x="4.2" y="5" width="2.5" height="6" rx="1" fill={statusInk} />
                    <rect x="8.4" y="2.5" width="2.5" height="8.5" rx="1" fill={statusInk} />
                    <rect x="12.6" y="0" width="2.5" height="11" rx="1" fill={statusInk} />
                  </svg>
                  <div
                    style={{
                      width: 23,
                      height: 11.5,
                      borderRadius: 3.5,
                      border: `1.5px solid ${statusInk}`,
                      padding: 1.5,
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: "84%",
                        height: "100%",
                        borderRadius: 1.5,
                        backgroundColor: statusInk,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Main Screen Content */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              {children}
            </div>

            {/* Coupled Specular Studio Glass Light Sweep */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 35,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-35%",
                  bottom: "-35%",
                  left: "50%",
                  width: 230,
                  transform: `translate3d(${sheenOffset - 60}px, 0, 0) rotate(23deg)`,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.11) 50%, rgba(255,255,255,0) 100%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Exploded Front Z-Plane (+88px): Pop-Out Hero UI Cards Floating Above the Glass */}
        {explodedOverlay && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: "translateZ(88px)",
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
// 6. Baseline-Masked Kinetic Word Reveal (<MaskedWords />)
// ============================================================================
export const MaskedWords: React.FC<{
  words: Array<{ text: string; color?: string; italic?: boolean }>;
  startFrame?: number;
  fontSize?: number;
  defaultColor?: string;
  align?: "left" | "center";
}> = ({
  words,
  startFrame = 0,
  fontSize = 84,
  defaultColor = GEMINI_THEME.ink,
  align = "left",
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
        columnGap: Math.round(fontSize * 0.23),
        rowGap: Math.round(fontSize * 0.08),
      }}
    >
      {words.map((w, idx) => {
        const delay = Math.round(Math.pow(idx, 0.8) * sec(0.055, fps));
        const p = spring({
          frame: Math.max(0, frame - startFrame - delay),
          fps,
          config: { damping: 24, stiffness: 215, mass: 0.78 },
        });
        const yPct = (1 - p) * 108;
        const rot = (1 - p) * 4;

        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: "0.15em",
              marginBottom: "-0.15em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translate3d(0, ${yPct}%, 0) rotate(${rot}deg)`,
                transformOrigin: "left bottom",
                fontFamily: w.italic ? FONT_SERIF : FONT_SANS,
                fontStyle: w.italic ? "italic" : "normal",
                fontWeight: w.italic ? 400 : 750,
                fontSize: w.italic ? Math.round(fontSize * 1.08) : fontSize,
                letterSpacing: w.italic ? "-0.015em" : "-0.045em",
                lineHeight: 1.02,
                color: w.color ?? defaultColor,
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
// 7. Fast 128x128 Tiled Deterministic Film Grain
// ============================================================================
const GRAIN_TILE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="7" stitchTiles="stitch"/></filter>` +
    `<rect width="128" height="128" filter="url(#n)"/>` +
    `</svg>`
);
const GRAIN_TILE_DATA_URI = `url("data:image/svg+xml,${GRAIN_TILE_SVG}")`;

export const GeminiFilmGrain: React.FC<{
  frame?: number;
  fps?: number;
  opacity?: number;
}> = ({ frame: frameProp, fps: fpsProp, opacity = 0.02 }) => {
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
// 8. Studio Audio Layer v2
// ============================================================================
export interface GeminiSfxCue {
  frame?: number;
  peakAtFrame?: number;
  peakOffsetSec?: number;
  src: string;
  volume?: number;
  playbackRate?: number;
  durationInFrames?: number;
  duckMusic?: boolean;
}

export const GeminiSoundTrackLayer: React.FC<{
  musicTrack?: string;
  musicVolume?: number;
  musicStartFromSec?: number;
  cues?: GeminiSfxCue[];
}> = ({
  musicTrack,
  musicVolume = 0.24,
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
  const fadeOutFrames = durSec(1.15, fps);
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
      const enter = interpolate(f, [w.startFrame - rampFrames, w.startFrame], [1, 0.54], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const exit = interpolate(f, [w.endFrame, w.endFrame + releaseFrames], [0.54, 1], {
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
          durationInFrames={cue.durationInFrames ?? durSec(1.15, fps)}
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

export { FONT_MONO, FONT_SANS, FONT_SERIF };
