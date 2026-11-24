import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  type AlbumArtVariant,
  DirectionalMotionBlur,
  GeometricAlbumArt,
  LiveEqualizerBars,
  SPOTIFY_FONT_MONO,
  SPOTIFY_FONT_SANS,
  SPOTIFY_THEME,
  SpotifyPlayDisc,
  SpotifyStudioBackdrop,
} from "../../components/SpotifyMusicPrimitives";
import { EASE_IN_EXPO, EASE_IN_OUT_QUINT, EASE_OUT_EXPO, SPRING_SNAPPY } from "../../lib/studioMotion";

interface MixCardData {
  id: string;
  mood: string;
  title: string;
  subtitle: string;
  bpm: string;
  variant: AlbumArtVariant;
}

const MIX_CARDS: MixCardData[] = [
  {
    id: "discover",
    mood: "Chill",
    title: "Discover Weekly",
    subtitle: "30 fresh tracks",
    bpm: "108 BPM",
    variant: "discover",
  },
  {
    id: "radar",
    mood: "Focus",
    title: "Release Radar",
    subtitle: "New drops today",
    bpm: "120 BPM",
    variant: "radar",
  },
  {
    id: "drive",
    mood: "Euphoric",
    title: "Late Night Drive",
    subtitle: "Made for your night",
    bpm: "128 BPM",
    variant: "drive",
  },
];

export const SMDiscoveryLightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active mood switches locked to camera beats:
  // f0..f38: Discover Weekly (1.55x macro)
  // f38..f72: Release Radar (1.52x lateral sweep)
  // f72..f120: Late Night Drive (1.0x wide pull-back -> whip-pan exit)
  const switch1 = 38;
  const switch2 = 72;
  const activeIdx = frame < switch1 ? 0 : frame < switch2 ? 1 : 2;

  // Exact focal-locked virtual camera choreography (transformOrigin: "0 0")
  let wx = 445;
  let wy = 642;
  let zoom = 1.44;
  let panBlurX = 0;

  if (frame < 36) {
    // Macro arrival settle on Discover Weekly + gentle living drift
    const enterP = interpolate(frame, [0, 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    zoom = interpolate(enterP, [0, 1], [1.36, 1.44]);
    wx = interpolate(frame, [0, 36], [435, 452], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    wy = 642;
  } else if (frame < 50) {
    // Crisp lateral sweep across canvas -> Release Radar
    const panP = interpolate(frame, [36, 50], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    wx = interpolate(panP, [0, 1], [452, 960]);
    wy = 642;
    zoom = interpolate(panP, [0, 1], [1.44, 1.42]);
    // Velocity-proportional horizontal blur peaking at mid-pan, strictly 0 at ends
    panBlurX = Math.round(Math.sin(panP * Math.PI) * 14);
  } else if (frame < 72) {
    // Clean living hold on Release Radar (0px blur)
    wx = interpolate(frame, [50, 72], [960, 970], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    wy = 642;
    zoom = 1.42;
  } else if (frame < 88) {
    // Exponential pull-back to 1.0x wide as Late Night Drive activates
    const pullP = interpolate(frame, [72, 88], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    wx = interpolate(pullP, [0, 1], [970, 960]);
    wy = interpolate(pullP, [0, 1], [642, 540]);
    zoom = interpolate(pullP, [0, 1], [1.42, 1.0]);
  } else {
    // Wide hold (f88..f104) before horizontal whip-pan exit
    wx = 960;
    wy = 540;
    zoom = interpolate(frame, [88, 104], [1.0, 1.015], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // Horizontal directional whip-pan exit (f104..f120)
  const whipP = interpolate(frame, [104, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });
  const whipX = -whipP * 1950;
  const totalBlurX = whipP > 0.05 ? Math.round(whipP * 38) : panBlurX;

  const camX = 960 - wx * zoom + whipX;
  const camY = 540 - wy * zoom;

  const headP = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: SPRING_SNAPPY,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: SPOTIFY_THEME.lightBg, overflow: "hidden" }}>
      <SpotifyStudioBackdrop
        polarity="light"
        parallaxX={camX * 0.18}
        parallaxY={camY * 0.18}
      />

      <DirectionalMotionBlur id="sm-discovery-whip" blurX={totalBlurX} blurY={0}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            padding: "96px 140px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transformOrigin: "0 0",
            transform: `translate3d(${camX.toFixed(1)}px, ${camY.toFixed(1)}px, 0) scale(${zoom.toFixed(4)})`,
          }}
        >
          {/* Top Row: Editorial Headline + Live Mood Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: SPOTIFY_FONT_MONO,
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: SPOTIFY_THEME.greenDeep,
                  marginBottom: 12,
                }}
              >
                CURATED FOR YOU
              </div>
              <div style={{ overflow: "hidden", paddingBottom: 6 }}>
                <div
                  style={{
                    fontFamily: SPOTIFY_FONT_SANS,
                    fontSize: 82,
                    fontWeight: 800,
                    letterSpacing: "-0.045em",
                    lineHeight: 1.02,
                    color: SPOTIFY_THEME.inkLight,
                    transform: `translate3d(0, ${(1 - headP) * 105}%, 0)`,
                  }}
                >
                  Made for you.
                </div>
              </div>
            </div>

            {/* Tactile Mood Pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 8,
                borderRadius: 999,
                backgroundColor: "#EAE9E2",
                border: `1px solid ${SPOTIFY_THEME.lightBorder}`,
              }}
            >
              {MIX_CARDS.map((card, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <div
                    key={card.id}
                    style={{
                      padding: "12px 26px",
                      borderRadius: 999,
                      backgroundColor: isActive ? SPOTIFY_THEME.inkLight : "transparent",
                      color: isActive ? "#FFFFFF" : SPOTIFY_THEME.mutedLight,
                      fontFamily: SPOTIFY_FONT_SANS,
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {card.mood}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Row: 3 Tactile Curated Mix Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 34,
              alignItems: "center",
              marginTop: 20,
            }}
          >
            {MIX_CARDS.map((card, idx) => {
              const isActive = idx === activeIdx;
              const activateFrame = idx === 0 ? 0 : idx === 1 ? switch1 : switch2;
              const popP = spring({
                frame: Math.max(0, frame - activateFrame),
                fps,
                config: SPRING_SNAPPY,
              });
              const liftY = isActive ? interpolate(popP, [0, 1], [0, -16]) : 4;
              const cardScale = isActive ? interpolate(popP, [0, 1], [0.98, 1.025]) : 0.97;

              return (
                <div
                  key={card.id}
                  style={{
                    position: "relative",
                    borderRadius: 28,
                    padding: 26,
                    backgroundColor: isActive ? "#121214" : SPOTIFY_THEME.lightSurface,
                    border: isActive
                      ? `2px solid ${SPOTIFY_THEME.green}`
                      : `1px solid ${SPOTIFY_THEME.lightBorder}`,
                    boxShadow: isActive
                      ? "0 30px 64px rgba(18, 18, 18, 0.22)"
                      : "0 12px 28px rgba(18, 18, 18, 0.06)",
                    transform: `translate3d(0, ${liftY}px, 0) scale(${cardScale})`,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      marginBottom: 24,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <GeometricAlbumArt
                      variant={card.variant}
                      size={456}
                      radius={20}
                      spinDeg={isActive ? (frame - activateFrame) * 0.9 : 0}
                    />

                    {/* Hero Spotify Play Disc docks onto the active curated card */}
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          right: 18,
                          bottom: 18,
                          transform: `scale(${interpolate(popP, [0, 1], [0.9, 1])})`,
                        }}
                      >
                        <SpotifyPlayDisc size={76} isPlaying={true} />
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: SPOTIFY_FONT_SANS,
                          fontSize: 30,
                          fontWeight: 800,
                          letterSpacing: "-0.03em",
                          color: isActive ? "#FFFFFF" : SPOTIFY_THEME.inkLight,
                          marginBottom: 4,
                        }}
                      >
                        {card.title}
                      </div>
                      <div
                        style={{
                          fontFamily: SPOTIFY_FONT_SANS,
                          fontSize: 19,
                          fontWeight: 500,
                          color: isActive ? SPOTIFY_THEME.mutedDark : SPOTIFY_THEME.mutedLight,
                        }}
                      >
                        {card.subtitle}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 8,
                      }}
                    >
                      {isActive && (
                        <LiveEqualizerBars
                          count={4}
                          width={26}
                          height={18}
                          color={SPOTIFY_THEME.green}
                        />
                      )}
                      <span
                        style={{
                          fontFamily: SPOTIFY_FONT_MONO,
                          fontSize: 14,
                          fontWeight: 600,
                          fontVariantNumeric: "tabular-nums",
                          color: isActive ? SPOTIFY_THEME.greenBright : SPOTIFY_THEME.mutedLight,
                        }}
                      >
                        {card.bpm}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DirectionalMotionBlur>
    </AbsoluteFill>
  );
};
