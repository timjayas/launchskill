import React, { useId } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ClaudeMark,
  CodexMark,
  GeminiMark,
  T3CodeMark,
  T3E_FONTS,
  T3E_THEME,
  T3StudioCyclorama,
} from "../../components/T3CodeEditorPrimitives";
import { EASE_IN_OUT_QUINT, EASE_OUT_EXPO, SPRING_EDITORIAL } from "../../lib/studioMotion";

const SLAT_COUNT = 8;

export const T3EDarkClimaxScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const clipId = useId().replace(/:/g, "");

  // ============================================================================
  // Beat 4 (90f = 3.00s): Obsidian Climax -> Direct 8-Slat Physical Peel
  // - f0..f35:  "Your models." rises cleanly inside #0C0D10 obsidian
  // - f35..f44: Simultaneous vertical baseline flip -> "One fast editor." + dock sweep
  // - f72..f90: ZERO fade-out! "One fast editor." stays 100% solid while 8 vertical
  //             slats with crisp white (#FFFFFF) leading peel lines physically peel
  //             Scene 4's actual surface upward, revealing Scene 5 directly underneath!
  // ============================================================================
  const enter = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: SPRING_EDITORIAL,
  });

  const flipProgress = interpolate(frame, [35, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  const dockSweep = interpolate(frame, [35, 51], [-220, 620], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const dockSweepOpacity = interpolate(frame, [35, 40, 48, 52], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const driftScale = interpolate(frame, [0, 90], [0.992, 1.032], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dockEnter = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: SPRING_EDITORIAL,
  });

  const beatAY = (1 - enter) * 108 - flipProgress * 115;
  const beatBY = (1 - flipProgress) * 115;

  // Direct 8-slat peel starts at f72 (overlaps directly on top of Scene 5!)
  const PEEL_START = 72;
  const isPeeling = frame >= PEEL_START;
  const slatW = width / SLAT_COUNT;

  const slats = Array.from({ length: SLAT_COUNT }).map((_, i) => {
    const start = PEEL_START + i * 1.2;
    const p = interpolate(frame, [start, start + 9], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    // Remaining height of Scene 4 in this column as it peels upward
    const remainingH = Math.max(0, height * (1 - p));
    return { i, p, remainingH };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Single lightweight SVG clipPath with 8 retracting column rects (60fps GPU-fast) */}
      {isPeeling && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <clipPath id={clipId}>
              {slats.map(({ i, remainingH }) => (
                <rect
                  key={i}
                  x={i * slatW}
                  y={0}
                  width={slatW + 1}
                  height={remainingH}
                />
              ))}
            </clipPath>
          </defs>
        </svg>
      )}

      {/* Scene 4 Content — stays 100% SOLID (zero fade-out) as the 8 slats peel it upward! */}
      <AbsoluteFill
        style={{
          backgroundColor: T3E_THEME.obsidian,
          clipPath: isPeeling ? `url(#${clipId})` : "none",
        }}
      >
        <T3StudioCyclorama
          dark
          zoom={driftScale}
          panX={frame * -0.75}
          panY={frame * -0.28}
        />

        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "90px 120px",
            transform: `scale(${driftScale.toFixed(4)})`,
          }}
        >
          {/* Baseline-Clipped Dual Headline Slot (Simultaneous Vertical Flip) */}
          <div
            style={{
              position: "relative",
              height: 122,
              width: "100%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {flipProgress < 0.99 && (
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 24,
                  transform: `translate3d(0, ${beatAY.toFixed(2)}%, 0)`,
                  fontFamily: T3E_FONTS.display,
                  fontWeight: 700,
                  fontSize: 96,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                }}
              >
                <span style={{ color: T3E_THEME.inkMutedOnDark }}>Your</span>
                <span style={{ color: T3E_THEME.inkOnDark }}>models.</span>
              </div>
            )}

            {flipProgress > 0.01 && (
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 24,
                  transform: `translate3d(0, ${beatBY.toFixed(2)}%, 0)`,
                  fontFamily: T3E_FONTS.display,
                  fontWeight: 700,
                  fontSize: 96,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                }}
              >
                <span style={{ color: T3E_THEME.cobaltBright }}>One</span>
                <span style={{ color: T3E_THEME.inkOnDark }}>fast</span>
                <span style={{ color: T3E_THEME.inkOnDark }}>editor.</span>
              </div>
            )}
          </div>

          {/* Unified Provider Bar with Cobalt Power-Up Sweep */}
          <div
            style={{
              marginTop: 52,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "16px 26px",
              borderRadius: 16,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${
                flipProgress > 0.35
                  ? "rgba(59, 130, 246, 0.45)"
                  : T3E_THEME.editorBorder
              }`,
              opacity: Math.min(1, dockEnter * 1.2),
              transform: `translate3d(0, ${((1 - dockEnter) * 16).toFixed(2)}px, 0)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {dockSweepOpacity > 0.01 && (
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  bottom: -20,
                  width: 140,
                  left: 0,
                  opacity: dockSweepOpacity,
                  transform: `translate3d(${dockSweep.toFixed(1)}px, 0, 0) rotate(18deg)`,
                  background:
                    "linear-gradient(90deg, rgba(37,99,235,0) 0%, rgba(59,130,246,0.38) 50%, rgba(37,99,235,0) 100%)",
                  pointerEvents: "none",
                }}
              />
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 2 }}>
              <ClaudeMark size={28} />
              <span style={{ fontFamily: T3E_FONTS.sans, fontWeight: 600, fontSize: 24, color: T3E_THEME.inkOnDark }}>
                Claude
              </span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 22, position: "relative", zIndex: 2 }}>·</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 2 }}>
              <CodexMark size={28} light />
              <span style={{ fontFamily: T3E_FONTS.sans, fontWeight: 600, fontSize: 24, color: T3E_THEME.inkOnDark }}>
                Codex
              </span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 22, position: "relative", zIndex: 2 }}>·</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 2 }}>
              <GeminiMark size={28} />
              <span style={{ fontFamily: T3E_FONTS.sans, fontWeight: 600, fontSize: 24, color: T3E_THEME.inkOnDark }}>
                Gemini
              </span>
            </div>
            <span
              style={{
                width: 1,
                height: 28,
                backgroundColor: "rgba(255,255,255,0.16)",
                margin: "0 8px",
                position: "relative",
                zIndex: 2,
              }}
            />
            <div style={{ position: "relative", zIndex: 2 }}>
              <T3CodeMark size={34} darkSurface />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Crisp #FFFFFF White Leading Peel Lines travelling right on top of each peeling slat */}
      {isPeeling &&
        slats.map(({ i, p, remainingH }) => {
          if (p <= 0.01 || p >= 0.99) return null;
          return (
            <div
              key={`lip-${i}`}
              style={{
                position: "absolute",
                left: i * slatW,
                top: remainingH - 3,
                width: slatW + 1,
                height: 4,
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 14px rgba(12, 13, 16, 0.24)",
              }}
            />
          );
        })}
    </AbsoluteFill>
  );
};
