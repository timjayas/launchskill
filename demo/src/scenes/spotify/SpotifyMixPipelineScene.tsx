import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AlbumCoverArt,
  ConnectedNodeWire,
  DirectionalMotionBlur,
  SPOTIFY_STUDIO_THEME,
  SpotifyBackdrop,
  type AlbumArtId,
} from "../../components/SpotifyStudioPrimitives";
import {
  EASE_IN_EXPO,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  SPRING_EDITORIAL,
  SPRING_POP,
  computeSecondarySettle,
  sec,
} from "../../lib/studioMotion";

export interface SpotifyMixPipelineSceneProps {
  slotMoods: string[];
  pipelineHeadlineMuted: string;
  pipelineHeadlineSerif: string;
  accentColor: string;
}

const SLOT_ART_CYCLE: AlbumArtId[] = [
  "seoul-rain",
  "concrete-echo",
  "analog-bloom",
  "midnight-velvet",
  "solar-dub",
  "northern-glass",
];

const SLOT_BPM_CYCLE = ["120 BPM", "104 BPM", "112 BPM", "98 BPM", "124 BPM", "116 BPM"];

/**
 * Shot 4 (Beats 30 -> 40, 5.0s): Crisp Mint-White Architectural Chapter (Zero Blur Circles)
 *   - Enters via crisp architectural clip-path curtain wipe over Shot 3.
 *   - Part A (0.0s - 2.35s): Asymmetric Split (35% / 65%) Vertical Mood Slot-Drum
 *     holding 3 crisp readable detents -> accelerating vertical DirectionalMotionBlur ramp.
 *   - Mid-shot horizontal whip-pan (blurX) into Part B.
 *   - Part B (2.35s - 5.0s): 1-to-1 Wired Smart Mix Crossfade Pipeline on Light Gallery Canvas.
 */
export const SpotifyMixPipelineScene: React.FC<SpotifyMixPipelineSceneProps> = ({
  slotMoods,
  pipelineHeadlineMuted,
  pipelineHeadlineSerif,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wipeInset = interpolate(frame, [0, sec(0.32, fps)], [84, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const splitFrame = sec(2.35, fps);
  const showPartB = frame >= splitFrame;

  const d1 = sec(0.56, fps);
  const d2 = sec(1.16, fps);
  const rampStart = sec(1.68, fps);
  const rampEnd = splitFrame;

  const evalDrumIndex = (f: number): number => {
    const step1 = interpolate(f, [d1, d1 + sec(0.22, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    const step2 = interpolate(f, [d2, d2 + sec(0.22, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    const speedRamp = interpolate(f, [rampStart, rampEnd], [0, 4.2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    });
    return step1 + step2 + speedRamp;
  };

  const drumIdx = evalDrumIndex(frame);
  const prevDrumIdx = evalDrumIndex(Math.max(0, frame - 1));
  const rowHeight = 132;
  const drumVelPx = Math.abs(drumIdx - prevDrumIdx) * rowHeight * (fps / 30);
  const drumBlurY = drumVelPx < 4 ? 0 : Math.min(14, (drumVelPx - 4) * 0.24);

  const activeDetentInt = Math.min(
    SLOT_ART_CYCLE.length - 1,
    Math.round(drumIdx) % SLOT_ART_CYCLE.length
  );

  const whipOutA = interpolate(frame, [splitFrame - sec(0.14, fps), splitFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });
  const whipInB = interpolate(frame, [splitFrame, splitFrame + sec(0.18, fps)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const bLocal = Math.max(0, frame - splitFrame);
  const nodePop = spring({
    frame: bLocal,
    fps,
    config: SPRING_EDITORIAL,
  });
  const headerSettle = computeSecondarySettle(bLocal, 0, fps, 0.06, 10);

  const wireDraw = interpolate(bLocal, [sec(0.22, fps), sec(0.86, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const pulseProgress = interpolate(bLocal, [sec(0.82, fps), sec(1.42, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const pulseOpacity = interpolate(
    bLocal,
    [sec(0.8, fps), sec(0.92, fps), sec(1.32, fps), sec(1.48, fps)],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const syncedFrame = sec(1.38, fps);
  const isSynced = bLocal >= syncedFrame;
  const syncPop = spring({
    frame: Math.max(0, bLocal - syncedFrame),
    fps,
    config: SPRING_POP,
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        clipPath: wipeInset > 0.1 ? `inset(${wipeInset}% 0 0 0)` : undefined,
      }}
    >
      <SpotifyBackdrop mode="mint" showDotGrid />

      {!showPartB ? (
        /* PART A: Asymmetric Split (35% Left White Mood Card / 65% Right Vertical Slot Drum) */
        <DirectionalMotionBlur blurX={whipOutA * 14} blurY={0}>
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "96px 140px",
              gap: 88,
              transform: `translate3d(${-whipOutA * 340}px, 0, 0)`,
            }}
          >
            {/* Left 35%: Clean White Active Mood Card */}
            <div
              style={{
                width: 470,
                padding: 28,
                borderRadius: SPOTIFY_STUDIO_THEME.radiusWindow,
                backgroundColor: SPOTIFY_STUDIO_THEME.surface,
                border: `1.5px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
                boxShadow: SPOTIFY_STUDIO_THEME.shadowHero,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: SPOTIFY_STUDIO_THEME.greenDeep,
                  }}
                >
                  DAYLIST · LIVE MOOD
                </span>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 15,
                    fontWeight: 700,
                    color: SPOTIFY_STUDIO_THEME.ink,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {SLOT_BPM_CYCLE[activeDetentInt]}
                </span>
              </div>

              <AlbumCoverArt
                id={SLOT_ART_CYCLE[activeDetentInt]}
                size={360}
                radius={20}
                showVinyl={false}
              />

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 22,
                    fontWeight: 600,
                    color: SPOTIFY_STUDIO_THEME.inkMuted,
                  }}
                >
                  Adapts in real time
                </span>
                <span
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    backgroundColor: accentColor,
                    color: "#FFFFFF",
                    fontFamily: FONT_MONO,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  AUTO-MIX
                </span>
              </div>
            </div>

            {/* Right 65%: Masked Accelerating Vertical Mood Slot Drum */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: SPOTIFY_STUDIO_THEME.greenDeep,
                  textTransform: "uppercase",
                }}
              >
                INSTANTLY TUNED TO EVERY VIBE
              </span>

              <div
                style={{
                  position: "relative",
                  height: rowHeight * 3,
                  overflow: "hidden",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, #000 26%, #000 74%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, #000 26%, #000 74%, transparent 100%)",
                }}
              >
                {/* Clean white center focus highlight box */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: rowHeight,
                    height: rowHeight,
                    border: `1.5px solid ${SPOTIFY_STUDIO_THEME.greenBorder}`,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 20,
                    boxShadow: SPOTIFY_STUDIO_THEME.shadowCard,
                    pointerEvents: "none",
                  }}
                />

                <DirectionalMotionBlur blurX={0} blurY={drumBlurY}>
                  <div
                    style={{
                      transform: `translate3d(0, ${rowHeight - drumIdx * rowHeight}px, 0)`,
                      willChange: "transform",
                    }}
                  >
                    {[...slotMoods, ...slotMoods].map((mood, idx) => {
                      const dist = Math.abs(idx - drumIdx);
                      const isCenter = dist < 0.45;
                      return (
                        <div
                          key={`${mood}-${idx}`}
                          style={{
                            height: rowHeight,
                            paddingLeft: 28,
                            display: "flex",
                            alignItems: "center",
                            fontFamily: FONT_SANS,
                            fontSize: 84,
                            fontWeight: 800,
                            letterSpacing: "-0.04em",
                            color: isCenter
                              ? SPOTIFY_STUDIO_THEME.ink
                              : "rgba(11, 11, 14, 0.24)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {mood}
                        </div>
                      );
                    })}
                  </div>
                </DirectionalMotionBlur>
              </div>
            </div>
          </AbsoluteFill>
        </DirectionalMotionBlur>
      ) : (
        /* PART B: 1-to-1 Wired Smart Mix Crossfade Pipeline on Clean Light Gallery */
        <DirectionalMotionBlur blurX={whipInB * 14} blurY={0}>
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "92px 128px",
              gap: 54,
              transform: `translate3d(${whipInB * 340}px, 0, 0)`,
            }}
          >
            {/* Top Editorial Thesis */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                transform: `translateY(${headerSettle.translateY}px)`,
                opacity: headerSettle.opacity,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: SPOTIFY_STUDIO_THEME.greenDeep,
                }}
              >
                SMART CROSSFADE ENGINE
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 20,
                  fontFamily: FONT_SANS,
                  fontSize: 78,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.0,
                }}
              >
                <span style={{ color: SPOTIFY_STUDIO_THEME.inkMuted }}>
                  {pipelineHeadlineMuted}
                </span>
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 88,
                    color: SPOTIFY_STUDIO_THEME.greenDeep,
                  }}
                >
                  {pipelineHeadlineSerif}
                </span>
              </div>
            </div>

            {/* Strictly 1-to-1 Left -> Right Node Pipeline */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0,
                transform: `scale(${0.95 + nodePop * 0.05})`,
              }}
            >
              {/* Left Node: Track 01 Outgoing */}
              <div
                style={{
                  width: 520,
                  padding: 30,
                  borderRadius: SPOTIFY_STUDIO_THEME.radiusWindow,
                  backgroundColor: SPOTIFY_STUDIO_THEME.surface,
                  border: `2px solid ${accentColor}`,
                  boxShadow: SPOTIFY_STUDIO_THEME.shadowHero,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: SPOTIFY_STUDIO_THEME.greenDeep,
                    }}
                  >
                    DECK A · OUTRO
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 15,
                      fontWeight: 600,
                      color: SPOTIFY_STUDIO_THEME.ink,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    120.0 BPM · F MIN
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                  <AlbumCoverArt id="seoul-rain" size={118} radius={16} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 30,
                        fontWeight: 800,
                        letterSpacing: "-0.025em",
                        color: SPOTIFY_STUDIO_THEME.ink,
                      }}
                    >
                      Midnight Neon
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 20,
                        fontWeight: 500,
                        color: SPOTIFY_STUDIO_THEME.inkMuted,
                      }}
                    >
                      Sora & Kenji
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 38 }}>
                  {Array.from({ length: 18 }, (_, i) => {
                    const taper = 1 - (i / 17) * 0.72;
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: Math.round(10 + taper * 28),
                          borderRadius: 3,
                          backgroundColor: accentColor,
                          opacity: 0.35 + taper * 0.65,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Center 1-to-1 Bezier Wire + Traveling Signal Pulse */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  margin: "0 -4px",
                  zIndex: 5,
                }}
              >
                <span
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    backgroundColor: "#FFFFFF",
                    border: `1.5px solid ${SPOTIFY_STUDIO_THEME.greenBorder}`,
                    fontFamily: FONT_MONO,
                    fontSize: 14,
                    fontWeight: 700,
                    color: SPOTIFY_STUDIO_THEME.greenDeep,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  BEAT-MATCH · 4.0s
                </span>
                <ConnectedNodeWire
                  width={230}
                  height={64}
                  drawProgress={wireDraw}
                  pulseProgress={pulseProgress}
                  pulseOpacity={pulseOpacity}
                  accentColor={accentColor}
                />
              </div>

              {/* Right Node: Track 02 Incoming (Illuminates Crisply on Pulse Arrival) */}
              <div
                style={{
                  width: 520,
                  padding: 30,
                  borderRadius: SPOTIFY_STUDIO_THEME.radiusWindow,
                  backgroundColor: SPOTIFY_STUDIO_THEME.surface,
                  border: isSynced
                    ? `2px solid ${accentColor}`
                    : `1.5px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
                  boxShadow: SPOTIFY_STUDIO_THEME.shadowHero,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                  transform: `scale(${isSynced ? 1 + (syncPop - 0.9) * 0.06 : 1})`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: isSynced
                        ? SPOTIFY_STUDIO_THEME.greenDeep
                        : SPOTIFY_STUDIO_THEME.inkMuted,
                    }}
                  >
                    DECK B · INTRO
                  </span>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: 999,
                      backgroundColor: isSynced
                        ? accentColor
                        : SPOTIFY_STUDIO_THEME.surfaceSubtle,
                      color: isSynced ? "#FFFFFF" : SPOTIFY_STUDIO_THEME.inkMuted,
                      fontFamily: FONT_MONO,
                      fontSize: 13,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {isSynced ? "HARMONIC LOCK ✓" : "120.0 BPM · SYNCING"}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                  <AlbumCoverArt id="midnight-velvet" size={118} radius={16} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 30,
                        fontWeight: 800,
                        letterSpacing: "-0.025em",
                        color: SPOTIFY_STUDIO_THEME.ink,
                      }}
                    >
                      Velvet Echo
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 20,
                        fontWeight: 500,
                        color: SPOTIFY_STUDIO_THEME.inkMuted,
                      }}
                    >
                      Mina & Tape Club
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 38 }}>
                  {Array.from({ length: 18 }, (_, i) => {
                    const rise = 0.25 + (i / 17) * 0.75;
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: Math.round(10 + rise * 28),
                          borderRadius: 3,
                          backgroundColor: isSynced
                            ? accentColor
                            : "rgba(11, 11, 14, 0.14)",
                          opacity: isSynced ? 0.4 + rise * 0.6 : 0.7,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </AbsoluteFill>
        </DirectionalMotionBlur>
      )}
    </AbsoluteFill>
  );
};
