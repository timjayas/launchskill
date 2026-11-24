import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  GeometricAlbumArt,
  LiveEqualizerBars,
  PerspectivePhoneStage,
  SPOTIFY_FONT_MONO,
  SPOTIFY_FONT_SANS,
  SPOTIFY_THEME,
  SpotifyPlayDisc,
  SpotifyStudioBackdrop,
} from "../../components/SpotifyMusicPrimitives";
import { EASE_IN_EXPO, EASE_OUT_EXPO, SPRING_SMOOTH, SPRING_SNAPPY, sec } from "../../lib/studioMotion";

export const SMNowPlaying25DScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone entrance (scale floor >= 0.92 per UI-2, zero vacuum scale(0))
  const enterP = spring({
    frame,
    fps,
    config: SPRING_SMOOTH,
  });

  // Continuous 2.5D orbit & living specular glass sheen (4.0s = 120f)
  const orbitT = interpolate(frame, [0, sec(3.1, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotateY = interpolate(orbitT, [0, 1], [-18, 13]);
  const rotateX = interpolate(orbitT, [0, 1], [7, 2]);
  const rotateZ = interpolate(orbitT, [0, 1], [-1.5, 1.0]);
  const sheenProgress = interpolate(frame, [0, sec(3.2, fps)], [0.15, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exploded +82px Z-layer Synced Lyrics card expands from exact lyric bar coordinate
  const lyricsTrigger = sec(0.68, fps);
  const lyricsP = spring({
    frame: Math.max(0, frame - lyricsTrigger),
    fps,
    config: SPRING_SNAPPY,
  });
  const lyricsScale = interpolate(lyricsP, [0, 1], [0.92, 1]);
  const lyricsY = interpolate(lyricsP, [0, 1], [28, 0]);
  const lyricsOpacity = interpolate(frame, [lyricsTrigger, lyricsTrigger + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Active lyric line steps cleanly at 1.85s
  const lyricStep2 = frame >= sec(1.85, fps);

  // Portal Zoom-Through Match Cut into Light Discovery stage (f94..f120)
  const portalStart = sec(3.12, fps);
  const portalEnd = sec(4.0, fps);
  const portalP = interpolate(frame, [portalStart, portalEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const stageScale = interpolate(enterP, [0, 1], [0.93, 1]) + portalP * 3.2;
  const phoneX = 270 - portalP * 270;
  const phoneY = interpolate(enterP, [0, 1], [26, 0]) + portalP * 140;

  // Left editorial copy
  const copyP1 = spring({
    frame: Math.max(0, frame - sec(0.18, fps)),
    fps,
    config: SPRING_SNAPPY,
  });
  const copyP2 = spring({
    frame: Math.max(0, frame - sec(0.32, fps)),
    fps,
    config: SPRING_SNAPPY,
  });
  const copyFadeOut = interpolate(portalP, [0, 0.35], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // White portal flash at peak velocity for seamless cut into Light Paper Scene 3
  const portalFlashOpacity = interpolate(portalP, [0.58, 0.96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const elapsedSec = Math.floor(104 + frame / fps);
  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
  const ss = String(elapsedSec % 60).padStart(2, "0");
  const scrubPct = 36 + (frame / sec(4.5, fps)) * 16;

  // Exploded front Z-layer Lyrics Card (+82px in front of glass, clear of Play Disc)
  const explodedLyricsCard = (
    <div
      style={{
        position: "absolute",
        left: -268,
        bottom: 108,
        width: 348,
        borderRadius: 24,
        backgroundColor: "#14261B",
        border: `1.5px solid rgba(29, 185, 84, 0.55)`,
        boxShadow: "0 28px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.16)",
        padding: "20px 24px",
        transformOrigin: "right bottom",
        transform: `translate3d(0, ${lyricsY}px, 0) scale(${lyricsScale})`,
        opacity: lyricsOpacity * (1 - portalP * 2.2),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: SPOTIFY_FONT_MONO,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: SPOTIFY_THEME.greenBright,
          }}
        >
          SYNCED LYRICS
        </span>
        <LiveEqualizerBars count={4} width={22} height={14} color={SPOTIFY_THEME.greenBright} />
      </div>
      <div
        style={{
          fontFamily: SPOTIFY_FONT_SANS,
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1.32,
          letterSpacing: "-0.02em",
          color: lyricStep2 ? "rgba(255,255,255,0.42)" : "#FFFFFF",
          marginBottom: 8,
        }}
      >
        Hold the rhythm in the dark
      </div>
      <div
        style={{
          fontFamily: SPOTIFY_FONT_SANS,
          fontSize: 24,
          fontWeight: 800,
          lineHeight: 1.28,
          letterSpacing: "-0.025em",
          color: lyricStep2 ? "#FFFFFF" : "rgba(255,255,255,0.48)",
        }}
      >
        Turning every room to light
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: SPOTIFY_THEME.obsidianBg, overflow: "hidden" }}>
      <SpotifyStudioBackdrop
        polarity="dark"
        parallaxX={-rotateY * 1.4}
        parallaxY={-rotateX * 1.2}
      />

      {/* Left-Side Clean Editorial Typography (Optically Flat, Never 2.5D Tilted) */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 0,
          bottom: 0,
          width: 660,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: copyFadeOut,
        }}
      >
        <div
          style={{
            fontFamily: SPOTIFY_FONT_MONO,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: SPOTIFY_THEME.green,
            marginBottom: 20,
            opacity: interpolate(copyP1, [0, 1], [0, 1]),
          }}
        >
          NOW PLAYING
        </div>
        <div style={{ overflow: "hidden", paddingBottom: 6 }}>
          <div
            style={{
              fontFamily: SPOTIFY_FONT_SANS,
              fontSize: 88,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 1.03,
              color: SPOTIFY_THEME.inkDark,
              transform: `translate3d(0, ${(1 - copyP1) * 108}%, 0)`,
            }}
          >
            Live lyrics.
          </div>
        </div>
        <div style={{ overflow: "hidden", paddingBottom: 10 }}>
          <div
            style={{
              fontFamily: SPOTIFY_FONT_SANS,
              fontSize: 88,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 1.03,
              color: SPOTIFY_THEME.green,
              transform: `translate3d(0, ${(1 - copyP2) * 108}%, 0)`,
            }}
          >
            Every beat.
          </div>
        </div>
      </div>

      {/* Right-Center 2.5D Tilted Titanium Smartphone with Exploded Z-Layer */}
      <PerspectivePhoneStage
        rotateX={rotateX * (1 - portalP)}
        rotateY={rotateY * (1 - portalP)}
        rotateZ={rotateZ * (1 - portalP)}
        scale={stageScale}
        x={phoneX}
        y={phoneY}
        sheenProgress={sheenProgress}
        explodedOverlay={explodedLyricsCard}
      >
        {/* Inside OLED Screen: Authentic Spotify Now Playing */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "62px 28px 34px",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(180deg, #16261E 0%, #111113 48%, #0B0B0C 100%)",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontFamily: SPOTIFY_FONT_MONO,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.72)",
              }}
            >
              PLAYING FROM ALBUM
            </span>
            <span
              style={{
                fontFamily: SPOTIFY_FONT_MONO,
                fontSize: 12,
                fontWeight: 600,
                color: SPOTIFY_THEME.green,
              }}
            >
              24-BIT
            </span>
          </div>

          {/* Hero Album Art */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <GeometricAlbumArt
              variant="midnight"
              size={336}
              radius={22}
              spinDeg={frame * 0.65}
            />
          </div>

          {/* Track Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: SPOTIFY_FONT_SANS,
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#FFFFFF",
                }}
              >
                Midnight Pulse
              </div>
              <div
                style={{
                  fontFamily: SPOTIFY_FONT_SANS,
                  fontSize: 18,
                  fontWeight: 500,
                  color: SPOTIFY_THEME.mutedDark,
                  marginTop: 2,
                }}
              >
                Sola
              </div>
            </div>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                backgroundColor: SPOTIFY_THEME.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13L9.5 17.5L19 8"
                  stroke="#0A0A0A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Live Scrubber */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                height: 5,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.16)",
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: `${scrubPct}%`,
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor: "#FFFFFF",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: SPOTIFY_FONT_MONO,
                fontSize: 12,
                fontVariantNumeric: "tabular-nums",
                color: SPOTIFY_THEME.mutedDark,
              }}
            >
              <span>{`${mm}:${ss}`}</span>
              <span>03:28</span>
            </div>
          </div>

          {/* Transport Controls featuring Hero Play Disc */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              marginBottom: 22,
            }}
          >
            {/* Prev icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="5" width="2.5" height="14" rx="1" fill="#FFFFFF" />
              <path d="M19 5.5L8.5 12L19 18.5V5.5Z" fill="#FFFFFF" />
            </svg>
            <SpotifyPlayDisc size={70} isPlaying={true} />
            {/* Next icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="17.5" y="5" width="2.5" height="14" rx="1" fill="#FFFFFF" />
              <path d="M5 5.5L15.5 12L5 18.5V5.5Z" fill="#FFFFFF" />
            </svg>
          </div>
        </div>
      </PerspectivePhoneStage>

      {/* Portal Match-Cut Flash into Light Discovery Stage */}
      {portalFlashOpacity > 0.01 && (
        <AbsoluteFill
          style={{
            backgroundColor: SPOTIFY_THEME.lightBg,
            opacity: portalFlashOpacity,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
