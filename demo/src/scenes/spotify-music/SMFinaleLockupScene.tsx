import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  SPOTIFY_FONT_MONO,
  SPOTIFY_FONT_SANS,
  SPOTIFY_THEME,
  SpotifyLogoMark,
  SpotifyStudioBackdrop,
} from "../../components/SpotifyMusicPrimitives";
import { EASE_OUT_EXPO, SPRING_EDITORIAL, SPRING_SNAPPY, sec } from "../../lib/studioMotion";

export const SMFinaleLockupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Arcs draw cleanly out of the Hero Green Disc (f2..f22)
  const arcProgress = interpolate(frame, [2, sec(0.72, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Lockup smoothly splits open to reveal "Spotify" wordmark
  const splitP = spring({
    frame: Math.max(0, frame - sec(0.22, fps)),
    fps,
    config: SPRING_EDITORIAL,
  });

  const subP = spring({
    frame: Math.max(0, frame - sec(0.45, fps)),
    fps,
    config: SPRING_SNAPPY,
  });

  const pillP = spring({
    frame: Math.max(0, frame - sec(0.62, fps)),
    fps,
    config: SPRING_SNAPPY,
  });

  // Living 2.5s hold: crisp 1.5px concentric acoustic ring + subtle specular sweep + slow camera settle
  const holdScale = interpolate(frame, [0, sec(2.5, fps)], [1.04, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const pulseCycle = ((frame / fps) * 0.62) % 1;
  const sheenX = interpolate(frame, [sec(0.65, fps), sec(2.2, fps)], [-260, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: SPOTIFY_THEME.obsidianBg, overflow: "hidden" }}>
      <SpotifyStudioBackdrop polarity="dark" parallaxX={frame * 0.28} parallaxY={0} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${holdScale})`,
        }}
      >
        {/* Iconic Mark + Wordmark Lockup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: interpolate(splitP, [0, 1], [0, 32]),
            marginBottom: 30,
          }}
        >
          <div style={{ position: "relative" }}>
            {/* Crisp 1.5px acoustic hairline pulse (zero fuzzy blur) */}
            <div
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                border: `1.5px solid ${SPOTIFY_THEME.green}`,
                transform: `scale(${1 + pulseCycle * 0.55})`,
                opacity: (1 - pulseCycle) * 0.48,
                pointerEvents: "none",
              }}
            />
            <SpotifyLogoMark size={122} arcProgress={arcProgress} />
          </div>

          {/* Horizontal clip-mask reveal of "Spotify" wordmark */}
          <div
            style={{
              overflow: "hidden",
              maxWidth: interpolate(splitP, [0, 1], [0, 440]),
              opacity: interpolate(splitP, [0.1, 0.6], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                fontFamily: SPOTIFY_FONT_SANS,
                fontSize: 112,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 1,
                color: SPOTIFY_THEME.inkDark,
                whiteSpace: "nowrap",
                paddingRight: 8,
              }}
            >
              Spotify
            </div>
          </div>
        </div>

        {/* Concise Tagline */}
        <div style={{ overflow: "hidden", marginBottom: 42 }}>
          <div
            style={{
              fontFamily: SPOTIFY_FONT_SANS,
              fontSize: 36,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: SPOTIFY_THEME.mutedDark,
              transform: `translate3d(0, ${(1 - subP) * 105}%, 0)`,
            }}
          >
            Music for everyone.
          </div>
        </div>

        {/* Crisp CTA Pill with Subtle Living Specular Sweep */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 34px",
            borderRadius: 999,
            backgroundColor: SPOTIFY_THEME.obsidianSurface,
            border: `1.5px solid rgba(29, 185, 84, 0.45)`,
            boxShadow: "0 18px 44px rgba(0,0,0,0.5)",
            opacity: interpolate(pillP, [0, 1], [0, 1]),
            transform: `translate3d(0, ${(1 - pillP) * 18}px, 0) scale(${interpolate(
              pillP,
              [0, 1],
              [0.94, 1]
            )})`,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: SPOTIFY_THEME.greenBright,
            }}
          />
          <span
            style={{
              fontFamily: SPOTIFY_FONT_MONO,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "#FFFFFF",
            }}
          >
            spotify.com
          </span>

          {/* Living specular light sweep */}
          <div
            style={{
              position: "absolute",
              top: -20,
              bottom: -20,
              width: 90,
              left: sheenX,
              transform: "rotate(22deg)",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.16) 50%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
