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
  computeCameraTransform,
  computeHarmonicStagger,
  durSec,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  sec,
} from "./motion";

// ============================================================================
// 1. True Directional Motion Blur Wrapper (SVG feGaussianBlur stdDeviation="x y")
// ============================================================================
export interface DirectionalMotionBlurProps {
  blurX: number;
  blurY: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Applies true anisotropic directional blur so horizontal whip-pans streak
 * horizontally and vertical slot drums streak vertically.
 * Drops strictly to zero filter overhead when resting (<= 0.15px).
 */
export const DirectionalMotionBlur: React.FC<DirectionalMotionBlurProps> = ({
  blurX,
  blurY,
  style,
  children,
}) => {
  const rawId = useId();
  const filterId = `dir-blur-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
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
// 2. High-Performance Tiled Deterministic Film Grain (5-10x Faster Than Full-HD feTurbulence)
// ============================================================================
// Pre-encoded 128x128 tileable monochrome noise tile — rasterized once by Chromium,
// shifted deterministically via backgroundPosition every ~2 frames for H.264 anti-banding.
const GRAIN_TILE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="7" stitchTiles="stitch"/></filter>` +
    `<rect width="128" height="128" filter="url(#n)"/>` +
    `</svg>`
);
const GRAIN_TILE_DATA_URI = `url("data:image/svg+xml,${GRAIN_TILE_SVG}")`;

export const FilmGrainOverlay: React.FC<{
  frame?: number;
  fps?: number;
  opacity?: number;
}> = ({ frame: frameProp, fps: fpsProp, opacity = 0.025 }) => {
  const hookFrame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const frame = frameProp ?? hookFrame;
  const fps = fpsProp ?? videoConfig.fps;

  // Deterministic step every ~1/15s (every 2f @ 30fps, 4f @ 60fps, 2f @ 24fps)
  const stepFrames = Math.max(1, Math.round(fps / 15));
  const step = Math.floor(frame / stepFrames);
  const offsetX = (step * 47) % 128;
  const offsetY = (step * 73) % 128;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
        backgroundImage: GRAIN_TILE_DATA_URI,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        backgroundPosition: `${offsetX}px ${offsetY}px`,
      }}
    />
  );
};

// ============================================================================
// 3. Exact Focal-Lock 2D Spatial Camera Rig (With Directional Velocity Blur)
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
// 4. Brand-Driven Tool Node Chrome Card (No Hardcoded Reference Colors)
// ============================================================================
export const NodeChromeCard: React.FC<{
  title: string;
  accentColor: string;
  width?: number;
  height?: number;
  dark?: boolean;
  darkSurface?: string;
  darkHeaderBg?: string;
  radius?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  title,
  accentColor,
  width,
  height,
  dark = false,
  darkSurface = "#141418",
  darkHeaderBg = "#1C1C22",
  radius = 22,
  style,
  children,
}) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: dark ? darkSurface : "#FFFFFF",
        border: `2px solid ${accentColor}`,
        borderRadius: radius,
        boxShadow: dark
          ? "0 26px 70px rgba(0,0,0,0.42)"
          : `0 24px 64px rgba(17,17,22,0.10), 0 0 0 4px ${accentColor}16`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT_SANS,
        ...style,
      }}
    >
      <div
        style={{
          height: 46,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: dark
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid #F4F4F5",
          backgroundColor: dark ? darkHeaderBg : "#FFFFFF",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: accentColor,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 19,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: dark ? "#FAFAFA" : "#18181B",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 18,
            color: dark ? "rgba(255,255,255,0.35)" : "#A1A1AA",
            letterSpacing: "-2px",
          }}
        >
          ⋮⋮
        </span>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// 5. Tactile Vector Cursor (Neutral Ink Default — Pass Brand Accent When Needed)
// ============================================================================
export const TactileCursor: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  fill?: string;
}> = ({ x, y, scale = 1, opacity = 1, fill = "#111114" }) => {
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
        zIndex: 60,
        filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.22))",
      }}
    >
      <svg width={44} height={44} viewBox="0 0 24 24" fill="none">
        <path
          d="M4.5 3L19.5 11.8L12.2 13.8L9.2 20.8L4.5 3Z"
          fill={fill}
          stroke="#FFFFFF"
          strokeWidth={1.7}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// ============================================================================
// 6. 1-to-1 SVG Bezier Node Wire + Traveling Signal Pulse
// ============================================================================
export const ConnectedNodeWire: React.FC<{
  width?: number;
  height?: number;
  drawProgress: number;
  pulseProgress?: number;
  pulseOpacity?: number;
  accentColor?: string;
}> = ({
  width = 220,
  height = 100,
  drawProgress,
  pulseProgress = 0,
  pulseOpacity = 0,
  accentColor = "#38BDF8",
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
      <path
        d={`M ${xStart} ${yMid} C ${width * 0.38} ${yMid}, ${width * 0.62} ${yMid}, ${xEnd} ${yMid}`}
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth={3.5}
      />
      <path
        d={`M ${xStart} ${yMid} C ${width * 0.38} ${yMid}, ${width * 0.62} ${yMid}, ${xEnd} ${yMid}`}
        fill="none"
        stroke={accentColor}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen * (1 - clampedDraw)}
      />
      {pulseOpacity > 0.01 && (
        <circle
          cx={pulseX}
          cy={yMid}
          r={8}
          fill="#FFFFFF"
          opacity={pulseOpacity}
          style={{ filter: `drop-shadow(0 0 12px ${accentColor})` }}
        />
      )}
    </svg>
  );
};

// ============================================================================
// 7. Studio Audio Layer v2 (Round-Robin Micro-Pitch, Peak-Aligned Risers & Auto Music Ducking)
// ============================================================================
export interface SfxCue {
  /** Direct start frame (omit if using peakAtFrame + peakOffsetSec for risers/whooshes) */
  frame?: number;
  /** Target cut/impact frame where a riser or whoosh should reach peak intensity */
  peakAtFrame?: number;
  /** Seconds from clip start to its sonic peak (e.g. 0.16s for whoosh-fast, 1.0s for riser-1s) */
  peakOffsetSec?: number;
  /** Path inside public/, e.g. "sfx/click-01.wav", "sfx/sub-hit-soft.wav", "sfx/whoosh-fast.wav" */
  src: string;
  /** 0.0 - 1.0 (keep subtle: UI ticks 0.12-0.18, whooshes 0.18-0.26, sub-hits 0.30-0.40) */
  volume?: number;
  /** Deterministic micro-pitch variation (e.g. 0.95 - 1.05) to kill machine-gun repetition */
  playbackRate?: number;
  durationInFrames?: number;
  /** When true, smoothly ducks the background music bed around this cue (e.g. hero impact or CTA chime) */
  duckMusic?: boolean;
}

export interface MusicDuckWindow {
  startFrame: number;
  endFrame: number;
  /** Multiplier applied to musicVolume during the window (default 0.52 ~= -5.6 dB) */
  duckLevel?: number;
}

export const SoundTrackLayer: React.FC<{
  /** Real produced instrumental bed inside public/, e.g. "audio/bed-120bpm.mp3" (NEVER JS-synthesized music!) */
  musicTrack?: string;
  musicVolume?: number;
  /** Align track start to detected firstBeatSec from analyze-music.mjs */
  musicStartFromSec?: number;
  /** Smooth fade-in (seconds) and loop-safe tail fade-out (seconds) */
  fadeInSec?: number;
  fadeOutSec?: number;
  /** Explicit duck windows (e.g. voiceover spans) combined with cues that set duckMusic: true */
  duckWindows?: MusicDuckWindow[];
  cues?: SfxCue[];
}> = ({
  musicTrack,
  musicVolume = 0.26,
  musicStartFromSec = 0,
  fadeInSec = 0.25,
  fadeOutSec = 1.2,
  duckWindows = [],
  cues = [],
}) => {
  const { durationInFrames, fps } = useVideoConfig();

  const resolvedCues = cues.map((cue) => {
    const startFrame =
      cue.peakAtFrame !== undefined
        ? Math.round(cue.peakAtFrame - (cue.peakOffsetSec ?? 0.2) * fps)
        : Math.round(cue.frame ?? 0);
    return {
      ...cue,
      resolvedFrom: Math.max(0, startFrame),
    };
  });

  // Combine explicit duck windows with any high-impact cues that request music ducking
  const allDuckWindows: MusicDuckWindow[] = [
    ...duckWindows,
    ...resolvedCues
      .filter((c) => c.duckMusic)
      .map((c) => ({
        startFrame: c.resolvedFrom,
        endFrame: c.resolvedFrom + durSec(0.55, fps),
        duckLevel: 0.56,
      })),
  ];

  const fadeInFrames = durSec(fadeInSec, fps);
  const fadeOutFrames = durSec(fadeOutSec, fps);
  const rampFrames = durSec(0.18, fps);
  const releaseFrames = durSec(0.32, fps);

  const computeMusicVolume = (f: number): number => {
    const fadeIn =
      fadeInSec > 0
        ? interpolate(f, [0, fadeInFrames], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : 1;
    const fadeOutStart = Math.max(0, durationInFrames - fadeOutFrames);
    const fadeOut = interpolate(f, [fadeOutStart, durationInFrames], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    let duckMult = 1;
    for (const w of allDuckWindows) {
      const target = w.duckLevel ?? 0.52;
      const enter = interpolate(f, [w.startFrame - rampFrames, w.startFrame], [1, target], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const exit = interpolate(f, [w.endFrame, w.endFrame + releaseFrames], [target, 1], {
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
          durationInFrames={cue.durationInFrames ?? durSec(1.2, fps)}
        >
          <Audio
            src={staticFile(cue.src)}
            volume={cue.volume ?? 0.34}
            playbackRate={cue.playbackRate ?? 1}
          />
        </Sequence>
      ))}
    </>
  );
};

// ============================================================================
// 8. Architectural Archive Primitives (Inspired by What Ships Swiss Viewfinder Grid)
//    - <ViewfinderFrame /> : Sharp 0px frame, L-shaped corner reticles, + crosshairs & index HUD
//    - <RollingOdometer /> : Deterministic vertical rolling digit reels with strict tabular-nums
// ============================================================================
export const ViewfinderFrame: React.FC<{
  width?: number | string;
  height?: number | string;
  indexLabel?: string;
  metaLabel?: string;
  dark?: boolean;
  bracketColor?: string;
  borderColor?: string;
  bracketSize?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  width = 1480,
  height = 760,
  indexLabel,
  metaLabel,
  dark = false,
  bracketColor,
  borderColor,
  bracketSize = 14,
  style,
  children,
}) => {
  const line = borderColor ?? (dark ? "#27272A" : "#E4E4E7");
  const corner = bracketColor ?? (dark ? "#D4D4D8" : "#52525B");
  const surface = dark ? "#111114" : "#FFFFFF";
  const metaInk = dark ? "#A1A1AA" : "#52525B";

  const cornerBase: React.CSSProperties = {
    position: "absolute",
    width: bracketSize,
    height: bracketSize,
    pointerEvents: "none",
    zIndex: 4,
  };

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 0,
        backgroundColor: surface,
        border: `1px solid ${line}`,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* Four crisp L-shaped viewfinder corner reticles */}
      <span style={{ ...cornerBase, top: -1, left: -1, borderTop: `2px solid ${corner}`, borderLeft: `2px solid ${corner}` }} />
      <span style={{ ...cornerBase, top: -1, right: -1, borderTop: `2px solid ${corner}`, borderRight: `2px solid ${corner}` }} />
      <span style={{ ...cornerBase, bottom: -1, left: -1, borderBottom: `2px solid ${corner}`, borderLeft: `2px solid ${corner}` }} />
      <span style={{ ...cornerBase, bottom: -1, right: -1, borderBottom: `2px solid ${corner}`, borderRight: `2px solid ${corner}` }} />

      {(indexLabel || metaLabel) && (
        <div
          style={{
            height: 44,
            padding: "0 18px",
            borderBottom: `1px solid ${line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: FONT_MONO,
            fontSize: 16,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: metaInk,
            fontVariantNumeric: "tabular-nums",
            flexShrink: 0,
          }}
        >
          <span>{metaLabel ?? ""}</span>
          <span>{indexLabel ?? ""}</span>
        </div>
      )}

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
    </div>
  );
};

export const RollingOdometer: React.FC<{
  value: number;
  startFrame?: number;
  durationSec?: number;
  minDigits?: number;
  prefix?: string;
  suffix?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  fontFamily?: string;
}> = ({
  value,
  startFrame = 0,
  durationSec = 0.65,
  minDigits = 0,
  prefix = "",
  suffix = "",
  fontSize = 84,
  fontWeight = 600,
  color = "#09090B",
  fontFamily = FONT_MONO,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rawStr = Math.max(0, Math.round(value)).toString();
  const padded = minDigits > rawStr.length ? rawStr.padStart(minDigits, "0") : rawStr;
  const formatted = minDigits > 0 ? padded : Number(rawStr).toLocaleString("en-US");
  const chars = formatted.split("");
  const lineHeightPx = Math.round(fontSize * 1.12);
  const durFrames = durSec(durationSec, fps);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight: `${lineHeightPx}px`,
        color,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.03em",
      }}
    >
      {prefix && <span>{prefix}</span>}
      {chars.map((ch, idx) => {
        if (!/[0-9]/.test(ch)) {
          return <span key={`sep-${idx}`}>{ch}</span>;
        }
        const digit = Number(ch);
        const stagger = sec(idx * 0.045, fps);
        const p = interpolate(frame, [startFrame + stagger, startFrame + stagger + durFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });
        // Roll smoothly through one extra subtle cycle on later digits for mechanical weight
        const targetSteps = digit + (idx % 2 === 1 ? 10 : 0);
        const translateY = -p * targetSteps * lineHeightPx;
        const reelDigits = Array.from({ length: targetSteps + 1 }, (_, n) => n % 10);

        return (
          <span
            key={`d-${idx}`}
            style={{
              display: "inline-block",
              height: lineHeightPx,
              overflow: "hidden",
              verticalAlign: "bottom",
            }}
          >
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                transform: `translate3d(0, ${translateY}px, 0)`,
              }}
            >
              {reelDigits.map((n, ri) => (
                <span
                  key={ri}
                  style={{
                    height: lineHeightPx,
                    lineHeight: `${lineHeightPx}px`,
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
      {suffix && <span>{suffix}</span>}
    </span>
  );
};

// ============================================================================
// 11. Camera-Coupled Studio Cyclorama + Precision Micro Dot-Grid
//     - Curved photo-studio linear tonal falloff (zero circular blur orbs / zero neon)
//     - Precision 30px dot-grid physically coupled to camera pan & zoom for 3D spatial depth
// ============================================================================
export const StudioCyclorama: React.FC<{
  dark?: boolean;
  zoom?: number;
  panX?: number;
  panY?: number;
  dotOpacity?: number;
  gridSize?: number;
  lightGradient?: string;
  darkGradient?: string;
}> = ({
  dark = false,
  zoom = 1,
  panX = 0,
  panY = 0,
  dotOpacity,
  gridSize = 30,
  lightGradient = "linear-gradient(180deg, #FFFFFF 0%, #F9F9F8 56%, #F1F1EC 100%)",
  darkGradient = "linear-gradient(180deg, #181817 0%, #141413 54%, #0C0C0B 100%)",
}) => {
  const bgGradient = dark ? darkGradient : lightGradient;
  const dotColor = dark
    ? `rgba(255, 255, 255, ${dotOpacity ?? 0.08})`
    : `rgba(20, 20, 19, ${dotOpacity ?? 0.085})`;

  // 140% overscan ensures camera pan/zoom parallax never exposes bare edges
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
          backgroundSize: `${gridSize}px ${gridSize}px`,
          transformOrigin: "center center",
          transform: `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`,
          willChange: "transform",
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// 12. Visual-First 2.5D & Illustrative Motion Primitives (Zero Chat-Bubble Slop)
//     - <SeamlessStudioBackdrop /> : Pure tonal studio space (zero skeleton grid, zero watermark words)
//     - <PerspectiveDeviceStage /> : 2.5D CSS preserve-3d rig + coupled glass sheen + +88px Z-exploded overlay
//     - <MaskedWords />            : Baseline-masked kinetic word reveal (1-3 words max per beat)
//     - <LiveVoiceSpectrum />      : Sculptural harmonic equalizer (replaces chat bubbles & typed prompts)
//     - <TactileClockDial />       : Sweeping circular watch dial (replaces text schedules)
// ============================================================================
export const SeamlessStudioBackdrop: React.FC<{
  dark?: boolean;
  lightGradient?: string;
  darkGradient?: string;
}> = ({
  dark = false,
  lightGradient = "linear-gradient(165deg, #FFFFFF 0%, #F7F9FC 58%, #EEF2F8 100%)",
  darkGradient = "linear-gradient(165deg, #0E131F 0%, #090C14 55%, #05070B 100%)",
}) => (
  <AbsoluteFill
    style={{
      background: dark ? darkGradient : lightGradient,
      overflow: "hidden",
      pointerEvents: "none",
    }}
  />
);

export const PerspectiveDeviceStage: React.FC<{
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
  /** 0 = morphing sonic/visual capsule, 1 = full hardware bezel */
  chromeProgress?: number;
  explodedZ?: number;
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
  explodedZ = 88,
  explodedOverlay,
  children,
}) => {
  const shadowX = Math.round(-rotateY * 2.1);
  const shadowY = Math.round(38 + rotateX * 1.7);
  const sheenOffset = -rotateY * 15 + rotateX * 6;
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

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: radius,
            padding: bezelPad,
            boxSizing: "border-box",
            background: "linear-gradient(140deg, #384152 0%, #181D27 46%, #0B0E14 100%)",
            boxShadow:
              "inset 0 1.5px 1px rgba(255,255,255,0.34), inset 0 -1.5px 2px rgba(0,0,0,0.65), 0 18px 42px rgba(9, 13, 24, 0.25)",
            border: "1px solid rgba(255,255,255,0.18)",
            transform: "translateZ(0px)",
          }}
        >
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
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>

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

        {explodedOverlay && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateZ(${explodedZ}px)`,
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
  defaultColor = "#0B0F17",
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
        const delay = computeHarmonicStagger(idx, 0.055, fps, 0.8);
        const p = interpolate(
          frame,
          [startFrame + delay, startFrame + delay + durSec(0.26, fps)],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT_EXPO }
        );
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

export const LiveVoiceSpectrum: React.FC<{
  energy?: number;
  bars?: number;
  height?: number;
  accentColor?: string;
  secondaryColor?: string;
}> = ({
  energy = 1,
  bars = 24,
  height = 64,
  accentColor = "#1A73E8",
  secondaryColor = "#60A5FA",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        height,
      }}
    >
      {Array.from({ length: bars }, (_, i) => {
        const norm = (i / (bars - 1)) * 2 - 1;
        const envelope = Math.exp(-norm * norm * 2.2);
        const f1 = Math.sin(t * 11.5 + i * 0.62);
        const f2 = Math.cos(t * 7.1 - i * 0.45);
        const wave = 0.5 + 0.5 * (f1 * 0.58 + f2 * 0.42);
        const barH = Math.max(8, Math.round((8 + wave * (height - 10) * envelope) * energy));
        const isCore = Math.abs(norm) < 0.42;

        return (
          <div
            key={i}
            style={{
              width: 6,
              height: barH,
              borderRadius: 999,
              backgroundColor: isCore ? accentColor : secondaryColor,
              opacity: isCore ? 1 : 0.65,
            }}
          />
        );
      })}
    </div>
  );
};

