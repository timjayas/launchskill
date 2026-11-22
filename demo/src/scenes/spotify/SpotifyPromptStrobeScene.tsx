import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AlbumCoverArt,
  DirectionalMotionBlur,
  SPOTIFY_STUDIO_THEME,
  SpotifyBackdrop,
  SpotifyMark,
  TactileCursor,
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
  SPRING_SNAPPY,
  computeSecondarySettle,
  getCaretOpacity,
  getNaturalTypedLength,
  sec,
} from "../../lib/studioMotion";

export interface SpotifyPromptStrobeSceneProps {
  promptQuery: string;
  libraryCountTarget: number;
  accentColor: string;
}

interface StrobePlate {
  artId: AlbumArtId;
  bg: string;
  accent: string;
  eyebrow: string;
  headline: string;
  serifWord: string;
  bpmTag: string;
}

// Crisp light-editorial gallery plates (zero dark washes, zero blurred radial circles!)
const STROBE_PLATES: StrobePlate[] = [
  {
    artId: "seoul-rain",
    bg: "#FFFFFF",
    accent: "#0F8A3E",
    eyebrow: "SONIC MATCH · 01",
    headline: "Late night",
    serifWord: "rain.",
    bpmTag: "120 BPM · MINOR 9TH",
  },
  {
    artId: "midnight-velvet",
    bg: "#FAF5F6",
    accent: "#BE123C",
    eyebrow: "SONIC MATCH · 02",
    headline: "Warm analog",
    serifWord: "synth.",
    bpmTag: "120 BPM · SUB BASS",
  },
  {
    artId: "analog-bloom",
    bg: "#FBF8F1",
    accent: "#B45309",
    eyebrow: "SONIC MATCH · 03",
    headline: "Zero-skip",
    serifWord: "flow.",
    bpmTag: "120 BPM · HARMONIC LOCK",
  },
];

/**
 * Shot 2 (Beats 7 -> 18, 5.5s): Crisp Light Paper AI Prompt ->
 *   Hard-Cut 2.12x Macro Prompt Typing & Click -> Shimmer Status ->
 *   3-Beat Light-Gallery Retrieval Strobe + Tabular Counter HUD -> Directional Whip-Pan Out
 */
export const SpotifyPromptStrobeScene: React.FC<SpotifyPromptStrobeSceneProps> = ({
  promptQuery,
  libraryCountTarget,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const macroStart = sec(0.68, fps);
  const typeStart = sec(0.74, fps);
  const clickFrame = sec(2.68, fps);
  const shimmerStart = sec(3.12, fps);
  const strobeStart = sec(3.82, fps);
  const strobeStep = sec(0.5, fps);

  const isMacro = frame >= macroStart && frame < shimmerStart;
  const isShimmer = frame >= shimmerStart && frame < strobeStart;
  const isStrobe = frame >= strobeStart;

  const typedLen = getNaturalTypedLength(promptQuery, frame, typeStart, 27, fps);
  const typedText = promptQuery.slice(0, typedLen);
  const isTyping = frame >= typeStart && typedLen < promptQuery.length;
  const caretOpacity = getCaretOpacity(frame, isTyping, fps);

  const wideBarPop = spring({
    frame: frame + sec(0.14, fps),
    fps,
    config: SPRING_EDITORIAL,
  });

  const typingPanP = interpolate(frame, [macroStart, sec(2.2, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const buttonPanP = interpolate(frame, [sec(2.1, fps), sec(2.6, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  const macroOffsetX =
    interpolate(typingPanP, [0, 1], [230, -80]) +
    interpolate(buttonPanP, [0, 1], [0, -210]);

  const cursorStart = sec(2.08, fps);
  const cursorArrive = sec(2.54, fps);
  const cT = interpolate(frame, [cursorStart, cursorArrive], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const cFrom = { x: 1090, y: 210 };
  const cTo = { x: 1018, y: 54 };
  const cCtrl = { x: 1085, y: 120 };
  const inv = 1 - cT;
  const cursorX = inv * inv * cFrom.x + 2 * inv * cT * cCtrl.x + cT * cT * cTo.x;
  const cursorY = inv * inv * cFrom.y + 2 * inv * cT * cCtrl.y + cT * cT * cTo.y;
  const cursorOpacity = interpolate(frame, [cursorStart, cursorStart + sec(0.14, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isHoveringBtn = frame >= clickFrame - sec(0.16, fps) && frame < shimmerStart;
  const btnPressScale = interpolate(
    frame,
    [clickFrame, clickFrame + sec(0.08, fps), clickFrame + sec(0.24, fps)],
    [1, 0.88, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const rippleP = interpolate(frame, [clickFrame, clickFrame + sec(0.42, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const hasClicked = frame >= clickFrame;

  const whipOut = interpolate(
    frame,
    [durationInFrames - sec(0.16, fps), durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    }
  );

  // Phase D: 3-Beat Light-Gallery Retrieval Strobe + High-Contrast Tabular Counter HUD
  if (isStrobe) {
    const strobeLocal = frame - strobeStart;
    const plateIdx = Math.min(STROBE_PLATES.length - 1, Math.floor(strobeLocal / strobeStep));
    const plate = STROBE_PLATES[plateIdx];
    const plateLocalFrame = strobeLocal - plateIdx * strobeStep;

    const platePop = spring({
      frame: plateLocalFrame,
      fps,
      config: SPRING_SNAPPY,
    });
    const innerSettle = computeSecondarySettle(plateLocalFrame, 0, fps, 0.06, 10);

    const countP = interpolate(
      strobeLocal,
      [0, durationInFrames - strobeStart - sec(0.24, fps)],
      [0.14, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_OUT_EXPO,
      }
    );
    const displayCount = Math.round(libraryCountTarget * countP).toLocaleString("en-US");

    return (
      <AbsoluteFill style={{ backgroundColor: plate.bg, overflow: "hidden" }}>
        <DirectionalMotionBlur blurX={whipOut * 14} blurY={0}>
          <AbsoluteFill
            style={{
              backgroundColor: plate.bg,
              transform: `translate3d(${-whipOut * 360}px, 0, 0)`,
            }}
          >
            {/* Subtle crisp dot-grid only — zero radial blur circles */}
            <AbsoluteFill
              style={{
                backgroundImage:
                  "radial-gradient(rgba(11, 11, 14, 0.065) 1.3px, transparent 1.3px)",
                backgroundSize: "30px 30px",
                pointerEvents: "none",
              }}
            />

            {/* Asymmetric side-by-side editorial plate composition */}
            <AbsoluteFill
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "96px 144px 170px",
                gap: 72,
              }}
            >
              {/* Left typography stack */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 18px",
                    borderRadius: 999,
                    backgroundColor: "#FFFFFF",
                    border: `1.5px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: plate.accent,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      color: SPOTIFY_STUDIO_THEME.ink,
                    }}
                  >
                    {plate.eyebrow}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 104,
                    fontWeight: 700,
                    letterSpacing: "-0.045em",
                    lineHeight: 0.98,
                    color: SPOTIFY_STUDIO_THEME.ink,
                    transform: `translateY(${(1 - platePop) * 20}px)`,
                  }}
                >
                  {plate.headline}
                </div>

                <div
                  style={{
                    fontFamily: FONT_SERIF,
                    fontStyle: "italic",
                    fontSize: 124,
                    fontWeight: 400,
                    letterSpacing: "-0.015em",
                    lineHeight: 0.94,
                    color: plate.accent,
                    transform: `translateY(${innerSettle.translateY}px)`,
                    opacity: innerSettle.opacity,
                  }}
                >
                  {plate.serifWord}
                </div>

                <span
                  style={{
                    marginTop: 8,
                    fontFamily: FONT_MONO,
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: SPOTIFY_STUDIO_THEME.inkMuted,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {plate.bpmTag}
                </span>
              </div>

              {/* Right hero bespoke album plate */}
              <div
                style={{
                  transform: `scale(${0.92 + platePop * 0.08})`,
                  flexShrink: 0,
                  marginRight: 44,
                }}
              >
                <AlbumCoverArt id={plate.artId} size={410} radius={28} showVinyl vinylPeek={0.22} />
              </div>
            </AbsoluteFill>

            {/* Bottom-center Crisp White Tabular Counter HUD (above 90px safe bottom) */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: 92,
                transform: "translateX(-50%)",
                display: "inline-flex",
                alignItems: "center",
                gap: 18,
                padding: "14px 28px",
                borderRadius: 999,
                backgroundColor: "#FFFFFF",
                border: `1.5px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
                boxShadow: SPOTIFY_STUDIO_THEME.shadowCard,
              }}
            >
              <SpotifyMark size={28} circleColor={accentColor} waveColor="#FFFFFF" />
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 24,
                  fontWeight: 700,
                  color: SPOTIFY_STUDIO_THEME.ink,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "0.02em",
                }}
              >
                {displayCount}
              </span>
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 20,
                  fontWeight: 500,
                  color: SPOTIFY_STUDIO_THEME.inkMuted,
                }}
              >
                tracks analyzed · 0.4s
              </span>
            </div>
          </AbsoluteFill>
        </DirectionalMotionBlur>
      </AbsoluteFill>
    );
  }

  // Phases A, B, C on Crisp Studio Paper (#F7F7F5)
  const shimmerP = interpolate(frame, [shimmerStart, strobeStart], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shimmerSweepPos = interpolate(shimmerP, [0, 1], [-40, 140]);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SpotifyBackdrop mode="paper" showDotGrid />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "90px 120px",
        }}
      >
        {!isMacro && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 42,
              transform: `translateY(${(1 - wideBarPop) * 18}px)`,
              opacity: Math.min(1, wideBarPop * 1.4),
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 18px",
                borderRadius: 999,
                backgroundColor: "#FFFFFF",
                border: `1px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
                marginBottom: 20,
              }}
            >
              <SpotifyMark size={24} circleColor={accentColor} waveColor="#FFFFFF" />
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: SPOTIFY_STUDIO_THEME.ink,
                }}
              >
                AI PLAYLIST · PROMPT
              </span>
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: SPOTIFY_STUDIO_THEME.ink,
                textAlign: "center",
              }}
            >
              Type a vibe.{" "}
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 80,
                  color: SPOTIFY_STUDIO_THEME.greenDeep,
                }}
              >
                Hear it instantly.
              </span>
            </div>
          </div>
        )}

        {/* Prompt Bar Container (Hard-cut 2.12x Macro Zoom during Phase B) */}
        <div
          style={{
            position: "relative",
            width: 1120,
            transform: isMacro
              ? `scale(2.12) translate3d(${macroOffsetX}px, 0, 0)`
              : `scale(${0.94 + wideBarPop * 0.06}) translateY(${(1 - wideBarPop) * 14}px)`,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              position: "relative",
              height: 106,
              padding: "0 18px 0 32px",
              borderRadius: 999,
              backgroundColor: SPOTIFY_STUDIO_THEME.surface,
              border: hasClicked
                ? `2.5px solid ${accentColor}`
                : `2px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
              boxShadow: SPOTIFY_STUDIO_THEME.shadowHero,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: SPOTIFY_STUDIO_THEME.greenTint,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <SpotifyMark size={26} circleColor={accentColor} waveColor="#FFFFFF" />
            </div>

            <div
              style={{
                flex: 1,
                fontFamily: FONT_SANS,
                fontSize: 31,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: typedText.length > 0 ? SPOTIFY_STUDIO_THEME.ink : "#8E8E98",
                whiteSpace: "nowrap",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>
                {typedText.length > 0 ? typedText : "Describe a mood, city, or BPM..."}
              </span>
              {frame >= macroStart && !hasClicked && (
                <span
                  style={{
                    display: "inline-block",
                    width: 3.5,
                    height: 38,
                    marginLeft: 4,
                    borderRadius: 2,
                    backgroundColor: accentColor,
                    opacity: caretOpacity,
                  }}
                />
              )}
            </div>

            <div
              style={{
                position: "relative",
                padding: "18px 34px",
                borderRadius: 999,
                backgroundColor: hasClicked ? SPOTIFY_STUDIO_THEME.greenDeep : accentColor,
                color: "#FFFFFF",
                fontFamily: FONT_SANS,
                fontSize: 23,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                transform: `translateY(${isHoveringBtn && !hasClicked ? -3 : 0}px) scale(${btnPressScale})`,
                boxShadow: "0 8px 18px rgba(11, 11, 14, 0.12)",
                flexShrink: 0,
              }}
            >
              {hasClicked ? "Matching..." : "Create Mix"}

              {hasClicked && rippleP < 1 && (
                <div
                  style={{
                    position: "absolute",
                    inset: -6,
                    borderRadius: 999,
                    border: `3px solid ${accentColor}`,
                    transform: `scale(${1 + rippleP * 0.28})`,
                    opacity: 1 - rippleP,
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>

            {isMacro && frame >= cursorStart && (
              <TactileCursor
                x={cursorX}
                y={cursorY}
                scale={btnPressScale}
                opacity={cursorOpacity}
                fill="#0B0B0E"
                stroke="#FFFFFF"
              />
            )}
          </div>

          {isShimmer && (
            <div
              style={{
                marginTop: 34,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 28px",
                  borderRadius: 999,
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
                  boxShadow: SPOTIFY_STUDIO_THEME.shadowCard,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: accentColor,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    backgroundImage: `linear-gradient(90deg, #52525B 0%, #52525B ${shimmerSweepPos - 18}%, #0F8A3E ${shimmerSweepPos}%, #52525B ${shimmerSweepPos + 18}%, #52525B 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Scanning 100M+ tracks for 120 BPM · Late night Seoul...
                </span>
              </div>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
