import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ANTIGRAVITY_THEME,
  AerospaceCursor,
  AntigravityMark,
  DirectionalMotionBlur,
  SpatialCameraRig2D,
  StudioLightBackdrop,
} from "../../components/AntigravityPrimitives";
import {
  EASE_IN_EXPO,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  SPRING_EDITORIAL,
  computeSecondarySettle,
  getCaretOpacity,
  getNaturalTypedLength,
  sec,
} from "../../lib/studioMotion";

export interface AntigravityMacroPromptSceneProps {
  repoChip: string;
  modeChip: string;
  promptText: string;
  accentColor: string;
  skyColor: string;
}

/**
 * Shot 2 (Beats 6 -> 14, 4.0s): Light Frosted Command Bar -> 2.22x Macro Typing -> Cursor Click -> Whip-Pan
 * - Bright #F7F7F5 studio paper canvas with elevated crisp white architectural card.
 * - 0.00s - 0.45s: Wide establishing shot (1.0x)
 * - 0.45s - 2.35s: Hard-cut 2.22x macro typing punch-in tracking the bright cobalt caret
 * - 2.35s - 3.68s: Centered 1.15x view as dark-ink cursor glides, hovers (-3px), clicks Run Agent, & blooms cobalt halo
 * - 3.68s - 4.00s: True horizontal directional whip-pan (blurX > 0, blurY = 0)
 */
export const AntigravityMacroPromptScene: React.FC<AntigravityMacroPromptSceneProps> = ({
  repoChip,
  modeChip,
  promptText,
  accentColor,
  skyColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const macroInCut = sec(0.45, fps);
  const wideReturnCut = sec(2.35, fps);
  const typingStart = sec(0.5, fps);

  const cursorStart = sec(2.45, fps);
  const cursorArrive = sec(2.92, fps);
  const clickFrame = sec(3.06, fps);

  const whipStart = sec(3.68, fps);
  const whipEnd = sec(4.0, fps);

  const typedCount = getNaturalTypedLength(promptText, frame, typingStart, 27, fps);
  const isTyping = frame >= typingStart && typedCount < promptText.length;
  const displayedText = promptText.slice(0, typedCount);
  const caretOpacity = getCaretOpacity(frame, isTyping, fps);

  const entrySpring = spring({
    frame: frame + sec(0.08, fps),
    fps,
    config: SPRING_EDITORIAL,
  });
  const innerSettle = computeSecondarySettle(frame, 0, fps, 0.065, 6);

  const inMacro = frame >= macroInCut && frame < wideReturnCut;
  const inWideReturn = frame >= wideReturnCut;

  const textProgress = promptText.length > 0 ? typedCount / promptText.length : 0;
  const macroFocusX = interpolate(textProgress, [0, 1], [635, 1140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const focusX = inMacro ? macroFocusX : 960;
  const focusY = inMacro ? 545 : inWideReturn ? 550 : 540;
  const zoom = inMacro ? 2.22 : inWideReturn ? 1.15 : 1.0;

  // Bezier cursor trajectory in 1920x1080 world space
  const cursorT = interpolate(frame, [cursorStart, cursorArrive], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const fromPt = { x: 1120, y: 760 };
  const toPt = { x: 1358, y: 622 };
  const ctrlPt = { x: 1210, y: 580 };
  const invT = 1 - cursorT;
  const cursorX = invT * invT * fromPt.x + 2 * invT * cursorT * ctrlPt.x + cursorT * cursorT * toPt.x;
  const cursorY = invT * invT * fromPt.y + 2 * invT * cursorT * ctrlPt.y + cursorT * cursorT * toPt.y;
  const cursorVisible = inWideReturn
    ? interpolate(frame, [cursorStart, cursorStart + sec(0.14, fps)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const isHovering = frame >= cursorArrive - sec(0.12, fps);
  const hoverLift = isHovering
    ? interpolate(frame, [cursorArrive - sec(0.12, fps), cursorArrive], [0, -3], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_OUT_EXPO,
      })
    : 0;

  const clickScale = interpolate(
    frame,
    [clickFrame, clickFrame + sec(0.08, fps), clickFrame + sec(0.24, fps)],
    [1, 0.88, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const cursorScale = interpolate(
    frame,
    [clickFrame, clickFrame + sec(0.08, fps), clickFrame + sec(0.22, fps)],
    [1, 0.84, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const rippleP = interpolate(frame, [clickFrame, clickFrame + sec(0.5, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const isExecuting = frame >= clickFrame;
  const execGlow = isExecuting
    ? interpolate(frame, [clickFrame, clickFrame + sec(0.28, fps)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_OUT_EXPO,
      })
    : 0;

  const whipOut = interpolate(frame, [whipStart, whipEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });
  const whipTranslateX = -whipOut * 580;
  const whipBlurX = whipOut * 14;

  const spinnerDeg = isExecuting ? (frame - clickFrame) * (360 / fps) * 1.8 : 0;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      <StudioLightBackdrop
        surface="paper"
        showGrid
        glowX="52%"
        glowY="46%"
        glowIntensity={0.1 + execGlow * 0.1}
      />

      <DirectionalMotionBlur
        blurX={whipBlurX}
        blurY={0}
        style={{ transform: `translate3d(${whipTranslateX}px, 0, 0)` }}
      >
        <SpatialCameraRig2D focusX={focusX} focusY={focusY} zoom={zoom} blurX={0} blurY={0}>
          <div
            style={{
              width: 1920,
              height: 1080,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Eyebrow */}
            <div
              style={{
                position: "absolute",
                top: 292,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
                opacity: inMacro ? 0 : innerSettle.opacity,
                transform: `translate3d(0, ${innerSettle.translateY}px, 0)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: accentColor,
                  textTransform: "uppercase",
                }}
              >
                01 / PROMPT TO PRODUCTION
              </span>
              <span style={{ color: ANTIGRAVITY_THEME.inkSoft }}>·</span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: ANTIGRAVITY_THEME.inkMuted,
                }}
              >
                Describe the feature. Watch the platform build it.
              </span>
            </div>

            {/* Crisp Light Command Palette Card */}
            <div
              style={{
                width: 1060,
                height: 286,
                borderRadius: ANTIGRAVITY_THEME.radiusWindow,
                backgroundColor: "#FFFFFF",
                border: isExecuting
                  ? `2.5px solid ${accentColor}`
                  : `1.5px solid ${ANTIGRAVITY_THEME.borderStrong}`,
                boxShadow: isExecuting
                  ? `${ANTIGRAVITY_THEME.shadowHero}, 0 0 0 8px rgba(37,99,235,${execGlow * 0.14}), 0 0 54px rgba(37,99,235,${execGlow * 0.25})`
                  : ANTIGRAVITY_THEME.shadowHero,
                padding: "28px 34px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transform: `scale(${0.96 + entrySpring * 0.04}) translate3d(0, ${(1 - entrySpring) * 16}px, 0)`,
                opacity: Math.min(1, entrySpring * 1.2),
                position: "relative",
              }}
            >
              {/* Top Chips Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity: innerSettle.opacity,
                  transform: `translate3d(0, ${innerSettle.translateY}px, 0)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <AntigravityMark size={28} variant="light" accentColor={accentColor} skyColor={skyColor} />
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 18,
                      fontWeight: 600,
                      color: accentColor,
                      backgroundColor: ANTIGRAVITY_THEME.accentSoft,
                      border: `1px solid ${ANTIGRAVITY_THEME.accentBorder}`,
                      padding: "5px 12px",
                      borderRadius: 8,
                    }}
                  >
                    {repoChip}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 18,
                      fontWeight: 500,
                      color: ANTIGRAVITY_THEME.inkSecondary,
                      backgroundColor: ANTIGRAVITY_THEME.surfaceSubtle,
                      border: `1px solid ${ANTIGRAVITY_THEME.border}`,
                      padding: "5px 12px",
                      borderRadius: 8,
                    }}
                  >
                    {modeChip}
                  </span>
                </div>

                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 16,
                    fontWeight: 700,
                    color: isExecuting ? accentColor : ANTIGRAVITY_THEME.inkMuted,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {isExecuting ? "DISPATCHING AGENTS..." : "48 FILES INDEXED"}
                </span>
              </div>

              {/* Center Live Typed Prompt */}
              <div
                style={{
                  minHeight: 74,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 38,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.22,
                  color: ANTIGRAVITY_THEME.ink,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {displayedText.length === 0 ? (
                  <span style={{ color: ANTIGRAVITY_THEME.inkSoft, fontWeight: 500 }}>
                    What should Antigravity build?
                  </span>
                ) : (
                  <span>{displayedText}</span>
                )}
                <span
                  style={{
                    display: "inline-block",
                    width: 4,
                    height: 44,
                    marginLeft: 5,
                    borderRadius: 2,
                    backgroundColor: accentColor,
                    opacity: isExecuting ? 0 : caretOpacity,
                    verticalAlign: "middle",
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* Bottom Action Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 18,
                  borderTop: `1px solid ${ANTIGRAVITY_THEME.border}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 17,
                      fontWeight: 500,
                      color: ANTIGRAVITY_THEME.inkMuted,
                    }}
                  >
                    Model: <strong style={{ color: ANTIGRAVITY_THEME.ink }}>Antigravity-Pro</strong>
                  </span>
                  <span style={{ color: ANTIGRAVITY_THEME.borderStrong }}>|</span>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 17,
                      fontWeight: 500,
                      color: ANTIGRAVITY_THEME.inkMuted,
                    }}
                  >
                    Sandbox: <strong style={{ color: ANTIGRAVITY_THEME.success }}>Auto-Test On</strong>
                  </span>
                </div>

                {/* Run Agent CTA Button */}
                <div style={{ position: "relative" }}>
                  {isExecuting && rippleP < 0.99 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -8,
                        borderRadius: 14,
                        border: `2.5px solid ${accentColor}`,
                        opacity: (1 - rippleP) * 0.85,
                        transform: `scale(${1 + rippleP * 0.28})`,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  <div
                    style={{
                      height: 52,
                      padding: "0 24px",
                      borderRadius: ANTIGRAVITY_THEME.radiusControl,
                      backgroundColor: isExecuting ? ANTIGRAVITY_THEME.ink : accentColor,
                      color: "#FFFFFF",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: "-0.015em",
                      boxShadow: isHovering
                        ? `0 14px 30px rgba(37,99,235,0.38), 0 0 0 3px rgba(37,99,235,0.22)`
                        : `0 8px 20px rgba(37,99,235,0.28)`,
                      transform: `translate3d(0, ${hoverLift}px, 0) scale(${clickScale})`,
                    }}
                  >
                    {isExecuting ? (
                      <>
                        <svg
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          style={{ transform: `rotate(${spinnerDeg}deg)` }}
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="#FFFFFF"
                            strokeWidth="2.8"
                            strokeDasharray="36 18"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span>Launching</span>
                      </>
                    ) : (
                      <>
                        <span>Run Agent</span>
                        <span style={{ fontFamily: FONT_MONO, fontSize: 16, opacity: 0.9 }}>↵</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {cursorVisible > 0.01 && (
              <AerospaceCursor
                x={cursorX}
                y={cursorY}
                scale={cursorScale}
                opacity={cursorVisible}
                fill="#0B0D12"
                stroke="#FFFFFF"
              />
            )}
          </div>
        </SpatialCameraRig2D>
      </DirectionalMotionBlur>
    </AbsoluteFill>
  );
};
