import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  GeometricAlbumArt,
  LiveEqualizerBars,
  SPOTIFY_FONT_MONO,
  SPOTIFY_FONT_SANS,
  SPOTIFY_THEME,
  SpotifyPlayDisc,
  SpotifyStudioBackdrop,
} from "../../components/SpotifyMusicPrimitives";
import { EASE_IN_EXPO, EASE_OUT_EXPO, SPRING_SNAPPY, sec } from "../../lib/studioMotion";

// Realistic multi-groove obsidian vinyl disc with rotating diagonal specular light sheen
const RealisticVinylRecord: React.FC<{
  size: number;
  spinDeg: number;
  sheenDeg: number;
}> = ({ size, spinDeg, sheenDeg }) => {
  // 26 fine concentric groove radii (in 0..500 viewBox space) for unmistakable vinyl texture at 3.4x macro
  const grooveRadii = Array.from({ length: 26 }, (_, i) => 118 + i * 13.8);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: "radial-gradient(circle at 50% 50%, #141416 0%, #09090B 62%, #131316 97%, #26262B 100%)",
        boxShadow:
          "0 40px 100px rgba(0, 0, 0, 0.85), inset 0 0 0 2px rgba(255, 255, 255, 0.14)",
      }}
    >
      {/* Fine concentric micro-grooves rotating smoothly */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 1000 1000"
        fill="none"
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotate(${spinDeg}deg)`,
        }}
      >
        {grooveRadii.map((r, i) => {
          // Subtle track-band spacing & natural vinyl groove luminance variation
          const isBandBreak = i === 8 || i === 17;
          const opacity = isBandBreak ? 0.14 : 0.045 + ((i * 7) % 5) * 0.015;
          const strokeWidth = isBandBreak ? 1.8 : 0.9;
          return (
            <circle
              key={i}
              cx="500"
              cy="500"
              r={r}
              stroke="#FFFFFF"
              strokeOpacity={opacity}
              strokeWidth={strokeWidth}
            />
          );
        })}
        {/* Subtle run-out groove spiral & inner label ring */}
        <circle cx="500" cy="500" r="106" stroke="#1DB954" strokeOpacity="0.28" strokeWidth="1.4" />
        <circle cx="500" cy="500" r="96" fill="#0F1B14" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
      </svg>

      {/* Authentic anisotropic vinyl diagonal light-sheen reflection (dual opposing wedge bands) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          transform: `rotate(${sheenDeg}deg)`,
          background:
            "conic-gradient(from 18deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.02) 14deg, rgba(255,255,255,0.13) 26deg, rgba(255,255,255,0.02) 38deg, transparent 58deg, transparent 180deg, rgba(255,255,255,0.02) 194deg, rgba(255,255,255,0.11) 206deg, rgba(255,255,255,0.02) 218deg, transparent 238deg)",
          pointerEvents: "none",
        }}
      />

      {/* Crisp secondary studio rim highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          transform: `rotate(${-sheenDeg * 0.4}deg)`,
          background:
            "linear-gradient(128deg, rgba(255,255,255,0.09) 0%, transparent 32%, transparent 68%, rgba(29,185,84,0.08) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export const SMHookPlayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // f10 (0.33s): Play Disc punches down on its own (zero mouse cursor)
  const tapFrame = 10;
  const isPlaying = frame >= tapFrame;

  // Razor-snappy tactile depress -> rebound
  const pressScale =
    frame < tapFrame - 2
      ? 1
      : frame < tapFrame + 2
        ? interpolate(frame, [tapFrame - 2, tapFrame + 1], [1, 0.85], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : 0.85 +
          0.15 *
            spring({
              frame: Math.max(0, frame - tapFrame - 1),
              fps,
              config: { damping: 14, stiffness: 320, mass: 0.58 },
            });

  // 3 crisp staggered Spotify soundwave arcs ripping outward on depress
  const wave1 = interpolate(frame, [tapFrame, tapFrame + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const wave2 = interpolate(frame, [tapFrame + 3, tapFrame + 21], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const wave3 = interpolate(frame, [tapFrame + 6, tapFrame + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Pull-back from 3.4x extreme vinyl macro -> 1.0x studio player bar (f15..f38)
  const pullP = interpolate(frame, [15, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Gentle living drift during hold (f38..f62) + velocity exit (f62..f75)
  const holdDrift = interpolate(frame, [38, 62], [0, -0.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitP = interpolate(frame, [62, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const vinylZoom = interpolate(pullP, [0, 1], [3.4, 0.72]);
  const vinylOpacity = interpolate(pullP, [0.35, 0.82], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Player bar & headline emerge seamlessly as vinyl pulls back
  const uiRevealP = interpolate(pullP, [0.22, 0.92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const uiScale = interpolate(pullP, [0, 1], [1.38, 1.0]) + holdDrift + exitP * 0.24;

  // Baseline-masked headline reveal
  const line1P = spring({
    frame: Math.max(0, frame - 24),
    fps,
    config: SPRING_SNAPPY,
  });
  const line2P = spring({
    frame: Math.max(0, frame - 29),
    fps,
    config: SPRING_SNAPPY,
  });

  // Continuous vinyl rotation (already spinning on Frame 0!)
  const spinDeg = frame * 1.65;
  const sheenDeg = -14 + Math.sin(frame * 0.08) * 18 + frame * 0.45;

  // Live playback progress & timecode
  const playSec = isPlaying ? Math.max(0, (frame - tapFrame) / fps) : 0;
  const trackProgress = 0.28 + playSec * 0.04;
  const totalSec = Math.floor(102 + playSec);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");

  return (
    <AbsoluteFill style={{ backgroundColor: SPOTIFY_THEME.obsidianBg, overflow: "hidden" }}>
      <SpotifyStudioBackdrop
        polarity="dark"
        parallaxX={frame * -0.35}
        parallaxY={exitP * -40}
      />

      {/* LAYER 1: 3.4x Macro Realistic Spinning Vinyl + Center Spindle Play Disc */}
      {vinylOpacity > 0.01 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: vinylOpacity,
            transform: `scale(${vinylZoom})`,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 560,
              height: 560,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RealisticVinylRecord size={560} spinDeg={spinDeg} sheenDeg={sheenDeg} />

            {/* 3 Crisp Expanding Spotify Soundwave Arcs ripping outward on f10 punch */}
            {[wave1, wave2, wave3].map((w, idx) =>
              w > 0.01 && w < 0.99 ? (
                <svg
                  key={idx}
                  width="560"
                  height="560"
                  viewBox="0 0 560 560"
                  fill="none"
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `scale(${0.28 + w * (0.72 + idx * 0.18)})`,
                    opacity: (1 - w) * 0.92,
                    pointerEvents: "none",
                  }}
                >
                  {/* Top & bottom symmetric Spotify soundwave arcs */}
                  <path
                    d="M150 165C225 118 335 118 410 165"
                    stroke={SPOTIFY_THEME.greenBright}
                    strokeWidth={7 - idx * 1.4}
                    strokeLinecap="round"
                  />
                  <path
                    d="M150 395C225 442 335 442 410 395"
                    stroke={SPOTIFY_THEME.greenBright}
                    strokeWidth={7 - idx * 1.4}
                    strokeLinecap="round"
                  />
                </svg>
              ) : null
            )}

            {/* Center Spindle: Hero Spotify Green Play Disc */}
            <div style={{ position: "absolute" }}>
              <SpotifyPlayDisc
                size={96}
                isPlaying={isPlaying}
                pressScale={pressScale}
                ringPulse={wave1}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* LAYER 2: Pulled-Back Studio Headline + Obsidian Player Bar */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate3d(0, ${-exitP * 65}px, 0) scale(${uiScale})`,
          transformOrigin: "center center",
          opacity: uiRevealP * (1 - exitP * 0.85),
        }}
      >
        <div style={{ marginBottom: 52, textAlign: "center" }}>
          <div style={{ overflow: "hidden", paddingBottom: 6 }}>
            <div
              style={{
                fontFamily: SPOTIFY_FONT_SANS,
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 1.04,
                color: SPOTIFY_THEME.inkDark,
                transform: `translate3d(0, ${(1 - line1P) * 105}%, 0)`,
              }}
            >
              Press play.
            </div>
          </div>
          <div style={{ overflow: "hidden", paddingBottom: 8 }}>
            <div
              style={{
                fontFamily: SPOTIFY_FONT_SANS,
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 1.04,
                color: SPOTIFY_THEME.green,
                transform: `translate3d(0, ${(1 - line2P) * 105}%, 0)`,
              }}
            >
              Feel everything.
            </div>
          </div>
        </div>

        {/* Obsidian Player Bar */}
        <div
          style={{
            position: "relative",
            width: 860,
            height: 148,
            borderRadius: 28,
            backgroundColor: SPOTIFY_THEME.obsidianSurface,
            border: `1px solid rgba(29, 185, 84, 0.36)`,
            boxShadow: "0 32px 72px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255,255,255,0.08)",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22, minWidth: 0 }}>
            <GeometricAlbumArt
              variant="midnight"
              size={92}
              radius={16}
              spinDeg={spinDeg * 0.6}
            />
            <div>
              <div
                style={{
                  fontFamily: SPOTIFY_FONT_SANS,
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: SPOTIFY_THEME.inkDark,
                  marginBottom: 6,
                }}
              >
                Midnight Pulse
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontFamily: SPOTIFY_FONT_SANS,
                    fontSize: 19,
                    fontWeight: 500,
                    color: SPOTIFY_THEME.mutedDark,
                  }}
                >
                  Sola · Lossless
                </span>
                <LiveEqualizerBars
                  count={4}
                  width={26}
                  height={16}
                  active={true}
                  color={SPOTIFY_THEME.green}
                />
              </div>
            </div>
          </div>

          <div style={{ flex: 1, maxWidth: 270 }}>
            <div
              style={{
                height: 6,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.12)",
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, trackProgress * 100)}%`,
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor: SPOTIFY_THEME.green,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: SPOTIFY_FONT_MONO,
                fontSize: 14,
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
                color: SPOTIFY_THEME.mutedDark,
              }}
            >
              <span>{`${mm}:${ss}`}</span>
              <span>03:28</span>
            </div>
          </div>

          <SpotifyPlayDisc size={84} isPlaying={true} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
