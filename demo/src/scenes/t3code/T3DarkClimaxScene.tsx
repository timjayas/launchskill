import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AgentAppIcon,
  FONT_MONO,
  FONT_SANS,
  T3StudioCyclorama,
} from "../../components/T3CodePrimitives";
import {
  EASE_IN_EXPO,
  EASE_OUT_EXPO,
  SPRING_SNAPPY,
  sec,
} from "../../lib/studioMotion";

export interface T3DarkClimaxSceneProps {
  beat1Muted: string;
  beat1Bright: string;
  beat2Punch: string;
}

/**
 * Beat 5 (Beats 30 -> 34 @ 132 BPM, 1.82s = 55f): Earned #141413 Dark Polarity Climax
 * - Camera-coupled dark precision dot-grid + razor-thin architectural horizon hairlines
 *   sweeping crisply inward on each downbeat (zero neon, zero glowing blobs).
 * - Tracking condensation + kinetic punch into peak-velocity scale-through into bright Finale!
 */
export const T3DarkClimaxScene: React.FC<T3DarkClimaxSceneProps> = ({
  beat1Muted,
  beat1Bright,
  beat2Punch,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const halfFrame = Math.round(durationInFrames / 2);
  const isPhase2 = frame >= halfFrame;

  const p1Enter = interpolate(frame, [0, sec(0.2, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const p1Drift = interpolate(frame, [0, halfFrame], [0.98, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const p2Local = Math.max(0, frame - halfFrame);
  const p2Enter = spring({
    frame: p2Local + sec(0.08, fps),
    fps,
    config: SPRING_SNAPPY,
  });
  const p2Tracking = interpolate(p2Local, [0, sec(0.26, fps)], [-0.015, -0.052], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const p2Exit = interpolate(
    frame,
    [durationInFrames - sec(0.22, fps), durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    }
  );

  // Subtle architectural hairline sweep framing each downbeat punch
  const lineDraw = interpolate(
    isPhase2 ? p2Local : frame,
    [0, sec(0.32, fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT_EXPO }
  );

  const bgZoom = isPhase2
    ? 1.04 + p2Enter * 0.04 + p2Exit * 0.24
    : p1Drift;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      {/* Camera-Coupled Deep Charcoal Studio Cyclorama + Subtle Dot-Grid */}
      <T3StudioCyclorama
        dark
        zoom={bgZoom}
        panY={interpolate(frame, [0, durationInFrames], [18, -24])}
        dotOpacity={0.075}
      />

      {/* Crisp Architectural Horizon Hairlines Drawing Outward */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 184,
          width: `${lineDraw * 76}%`,
          height: 1,
          backgroundColor: "rgba(255, 255, 255, 0.11)",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 184,
          width: `${lineDraw * 76}%`,
          height: 1,
          backgroundColor: "rgba(255, 255, 255, 0.11)",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!isPhase2 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 44,
              transform: `scale(${(0.92 + p1Enter * 0.08) * p1Drift})`,
              opacity: Math.max(0.88, p1Enter * 1.4),
            }}
          >
            <div
              style={{
                fontSize: 98,
                fontWeight: 800,
                letterSpacing: "-0.048em",
                lineHeight: 1.02,
                textAlign: "center",
              }}
            >
              <span style={{ color: "#787873" }}>{beat1Muted} </span>
              <span style={{ color: "#F9F9F8" }}>{beat1Bright}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {[
                { brand: "claude" as const, label: "wt/passkey-auth" },
                { brand: "codex" as const, label: "wt/e2e-tests" },
                { brand: "opencode" as const, label: "wt/docs" },
              ].map((item, i) => {
                const chipP = spring({
                  frame: Math.max(0, frame - sec(0.04 + i * 0.05, fps)),
                  fps,
                  config: SPRING_SNAPPY,
                });
                return (
                  <div
                    key={item.label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 20px 12px 14px",
                      borderRadius: 999,
                      backgroundColor: "#1F1F1D",
                      border: "1px solid rgba(255, 255, 255, 0.13)",
                      transform: `translate3d(0, ${(1 - chipP) * 14}px, 0) scale(${0.92 + chipP * 0.08})`,
                      opacity: Math.max(0.68, chipP),
                    }}
                  >
                    <AgentAppIcon brand={item.brand} size={34} elevated={false} />
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#E4E4E0",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              transform: `scale(${(0.94 + p2Enter * 0.06) * (1 + p2Exit * 0.24)})`,
              opacity: 1 - p2Exit * 0.45,
            }}
          >
            <div
              style={{
                fontSize: 128,
                fontWeight: 800,
                letterSpacing: `${p2Tracking}em`,
                lineHeight: 0.98,
                color: "#F9F9F8",
                textAlign: "center",
              }}
            >
              {beat2Punch}
            </div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "#A1A19B",
                textTransform: "uppercase",
              }}
            >
              OPEN SOURCE · BRING YOUR OWN SUBSCRIPTION
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
