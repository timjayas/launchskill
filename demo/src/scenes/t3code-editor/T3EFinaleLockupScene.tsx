import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  ClaudeMark,
  GeminiMark,
  T3CodeMark,
  T3E_FONTS,
  T3E_THEME,
  T3SpatialCamera,
  T3StudioCyclorama,
} from "../../components/T3CodeEditorPrimitives";
import { EASE_IN_OUT_QUINT, EASE_OUT_EXPO, SPRING_EDITORIAL } from "../../lib/studioMotion";
import { LOOP_CARDS } from "./T3EHookRailScene";

const hexToRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
};

export const T3EFinaleLockupScene: React.FC<{ ctaUrl: string }> = ({ ctaUrl }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ============================================================================
  // Beat 5 (102f = 3.40s): 8-Column Architectural Mechanical Slats Reveal
  // -> Finale Lockup Hold -> Seamless Loop Morph into Frame 0!
  // - f0..f18:  8 lightweight vertical #0C0D10 obsidian slats retract smoothly
  //             upward in a crisp staggered wave, unveiling the living Finale
  //             Lockup already breathing underneath (zero GPU lag, locked 60fps!)
  // - f18..f70: Clean living hold of T3Code| + Claude · Codex · Gemini + t3code.dev
  // - f70..f99: The 3 inline models morph seamlessly into Frame 0's 3 obsidian cards!
  // ============================================================================
  const lockupEnter = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRING_EDITORIAL,
  });

  const subEnter = spring({
    frame: Math.max(0, frame - 7),
    fps,
    config: SPRING_EDITORIAL,
  });

  const ctaEnter = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: SPRING_EDITORIAL,
  });

  // Exit of surrounding finale chrome (f68 -> f80)
  const chromeExit = interpolate(frame, [68, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Morph of the 3 inline models into the 3 obsidian cards + zoom 1.0x -> 2.2x (f70 -> f99)
  const loopMorph = interpolate(frame, [70, 99], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  const holdDrift = interpolate(frame, [0, 70], [0.992, 1.016], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = holdDrift + (2.2 - holdDrift) * loopMorph;

  // Cyclorama pan smoothly returns to (0, 0) at loopMorph = 1 to match f0 seamlessly
  const holdPanX = -Math.min(frame, 70) * 0.45;
  const holdPanY = -Math.min(frame, 70) * 0.2;
  const panX = holdPanX * (1 - loopMorph);
  const panY = holdPanY * (1 - loopMorph);

  const sheenX = interpolate(frame, [16, 64], [-220, 260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const caretOpacity = 0.5 + 0.5 * Math.abs(Math.sin((frame / fps) * Math.PI * 1.5));

  const rTxt = Math.round(69 + (255 - 69) * loopMorph);
  const gTxt = Math.round(73 + (255 - 73) * loopMorph);
  const bTxt = Math.round(84 + (255 - 84) * loopMorph);
  const labelColor = `rgb(${rTxt}, ${gTxt}, ${bTxt})`;

  return (
    <AbsoluteFill>
      <T3StudioCyclorama zoom={zoom} panX={panX} panY={panY} />

      <T3SpatialCamera wx={width / 2} wy={height / 2} zoom={zoom}>
        <AbsoluteFill style={{ position: "relative" }}>
          {/* Top: T3Code| Brand Lockup */}
          {chromeExit < 0.99 && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 382,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
                opacity: Math.min(1, lockupEnter * 1.35) * (1 - chromeExit),
                transform: `translate3d(0, ${(chromeExit * -34).toFixed(1)}px, 0) scale(${(0.94 + lockupEnter * 0.06).toFixed(4)})`,
              }}
            >
              <T3CodeMark size={86} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: T3E_FONTS.display,
                    fontWeight: 700,
                    fontSize: 100,
                    letterSpacing: "-0.045em",
                    lineHeight: 1,
                    color: T3E_THEME.ink,
                  }}
                >
                  T3Code
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 76,
                    borderRadius: 3,
                    backgroundColor: T3E_THEME.cobalt,
                    opacity: caretOpacity,
                  }}
                />
              </div>
            </div>
          )}

          {/* Middle (centered on y=540): 3 Models Morphing Seamlessly into Frame 0's 3 Cards */}
          <div
            style={{
              position: "absolute",
              left: width / 2,
              top: height / 2,
              width: 0,
              height: 0,
              opacity: Math.min(1, subEnter * 1.2),
              transform: `translate3d(0, ${((1 - subEnter) * 10 * (1 - loopMorph)).toFixed(2)}px, 0)`,
            }}
          >
            {chromeExit < 0.95 && (
              <>
                <span
                  style={{
                    position: "absolute",
                    left: -96,
                    top: -18,
                    fontSize: 26,
                    color: "rgba(14, 15, 18, 0.24)",
                    opacity: 1 - chromeExit,
                    transform: "translateX(-50%)",
                  }}
                >
                  ·
                </span>
                <span
                  style={{
                    position: "absolute",
                    left: 96,
                    top: -18,
                    fontSize: 26,
                    color: "rgba(14, 15, 18, 0.24)",
                    opacity: 1 - chromeExit,
                    transform: "translateX(-50%)",
                  }}
                >
                  ·
                </span>
              </>
            )}

            {LOOP_CARDS.map((card) => {
              const [br, bg, bb] = hexToRgb(card.color);
              const cardW = 156 + (212 - 156) * loopMorph;
              const cardH = 44 + (82 - 44) * loopMorph;
              const cx = card.inlineX + (card.startX - card.inlineX) * loopMorph;
              const cy = card.startY * loopMorph;
              const rot = card.startRot * loopMorph;
              const radius = 10 + 4 * loopMorph;
              const iconSize = 26 + 2 * loopMorph;
              const fontSize = 28 - 4 * loopMorph;
              const gap = 9 + 3 * loopMorph;

              return (
                <div
                  key={card.id}
                  style={{
                    position: "absolute",
                    width: cardW,
                    height: cardH,
                    left: cx - cardW / 2,
                    top: cy - cardH / 2,
                    borderRadius: radius,
                    backgroundColor: `rgba(12, 13, 16, ${loopMorph.toFixed(4)})`,
                    border: `1.5px solid rgba(${br}, ${bg}, ${bb}, ${loopMorph.toFixed(4)})`,
                    boxShadow:
                      loopMorph > 0.02
                        ? `0 ${(26 * loopMorph).toFixed(1)}px ${(64 * loopMorph).toFixed(1)}px rgba(12, 13, 16, ${(0.2 * loopMorph).toFixed(3)}), 0 ${(8 * loopMorph).toFixed(1)}px ${(20 * loopMorph).toFixed(1)}px rgba(12, 13, 16, ${(0.12 * loopMorph).toFixed(3)})`
                        : "none",
                    transform: `rotate(${rot.toFixed(2)}deg)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap,
                  }}
                >
                  {card.id === "claude" && <ClaudeMark size={iconSize} />}
                  {card.id === "codex" && (
                    <Img
                      src={staticFile("logos/openai.svg")}
                      style={{
                        width: iconSize,
                        height: iconSize,
                        objectFit: "contain",
                        display: "block",
                        filter: `invert(${loopMorph.toFixed(3)}) brightness(${(1 + 0.05 * loopMorph).toFixed(3)})`,
                      }}
                    />
                  )}
                  {card.id === "gemini" && <GeminiMark size={iconSize} />}
                  <span
                    style={{
                      fontFamily: T3E_FONTS.sans,
                      fontWeight: 600,
                      fontSize,
                      color: labelColor,
                      letterSpacing: `${(-0.02 * loopMorph).toFixed(4)}em`,
                    }}
                  >
                    {card.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom: Obsidian CTA Pill */}
          {chromeExit < 0.99 && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 606,
                display: "flex",
                justifyContent: "center",
                opacity: Math.min(1, ctaEnter * 1.2) * (1 - chromeExit),
                transform: `translate3d(0, ${((1 - ctaEnter) * 12 + chromeExit * 34).toFixed(1)}px, 0)`,
              }}
            >
              <div
                style={{
                  padding: "18px 42px",
                  borderRadius: 999,
                  backgroundColor: T3E_THEME.obsidian,
                  boxShadow: T3E_THEME.shadowRail,
                  border: `1px solid ${T3E_THEME.editorBorder}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    bottom: -20,
                    width: 110,
                    left: "50%",
                    transform: `translate3d(${sheenX}px, 0, 0) rotate(22deg)`,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0) 100%)",
                    pointerEvents: "none",
                  }}
                />
                <span
                  style={{
                    fontFamily: T3E_FONTS.mono,
                    fontWeight: 600,
                    fontSize: 30,
                    letterSpacing: "-0.01em",
                    color: "#FFFFFF",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {ctaUrl}
                </span>
              </div>
            </div>
          )}
        </AbsoluteFill>
      </T3SpatialCamera>
    </AbsoluteFill>
  );
};
