import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DirectionalMotionBlur, TactileCursor } from "../StudioPrimitives";
import {
  EASE_IN_EXPO,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  getCaretOpacity,
  getNaturalTypedLength,
  sec,
  SPRING_SNAPPY,
} from "../motion";

export interface ZScatterThemeFlipProps {
  pivotPrompt: string;
  synthesisPrompt: string;
  submitAccent?: string;
}

const WARM_MOOD = [
  { x: 0, y: -40, w: 320, h: 210, bg: "conic-gradient(from 90deg, #0EA5E9, #0F766E, #2563EB, #38BDF8)" },
  { x: -330, y: -200, w: 190, h: 200, bg: "linear-gradient(135deg, #FDE68A, #F59E0B)" },
  { x: 290, y: -210, w: 220, h: 170, bg: "linear-gradient(135deg, #DDD6FE, #38BDF8)" },
  { x: -420, y: 110, w: 220, h: 175, bg: "linear-gradient(135deg, #FDBA74, #9A3412)" },
  { x: 350, y: 115, w: 210, h: 185, bg: "linear-gradient(135deg, #1E1B4B, #3B82F6)" },
  { x: -75, y: 185, w: 195, h: 170, bg: "linear-gradient(135deg, #BAE6FD, #0EA5E9)" },
];

const TECH_MOOD = [
  { x: -165, y: -155, w: 240, h: 175, bg: "#141419", accent: "#38BDF8", code: "0xFF · SYS" },
  { x: 145, y: -175, w: 230, h: 185, bg: "#111827", accent: "#2563EB", code: "GRID // 24" },
  { x: -290, y: 45, w: 220, h: 175, bg: "#18181B", accent: "#A855F7", code: "MONO.UI" },
  { x: 10, y: 15, w: 260, h: 190, bg: "#09090B", accent: "#4ADE80", code: "MCP.CORE" },
  { x: 290, y: 40, w: 225, h: 175, bg: "#171717", accent: "#0EA5E9", code: "SPEC_V2" },
  { x: -105, y: 195, w: 220, h: 165, bg: "#1E1B4B", accent: "#C4B5FD", code: "TOKEN.JS" },
  { x: 155, y: 185, w: 220, h: 165, bg: "#0F172A", accent: "#22D3EE", code: "RASTER" },
];

export const ZScatterThemeFlipScene: React.FC<ZScatterThemeFlipProps> = ({
  pivotPrompt,
  synthesisPrompt,
  submitAccent = "#2563EB",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 100% FPS-agnostic windows (9.6s total)
  const fScatterStart = sec(2.93, fps);
  const fDarkStart = sec(4.2, fps);
  const fDarkEnd = sec(4.93, fps);
  const fSynthType = sec(5.33, fps);
  const fMacroClickStart = sec(7.2, fps);
  const fMacroClickEnd = sec(7.93, fps);
  const fSingularityStart = sec(7.93, fps);

  // Hard-Cut 3.5x Macro Submit Button Click Punch-In
  if (frame >= fMacroClickStart && frame < fMacroClickEnd) {
    const lf = frame - fMacroClickStart;
    const press = interpolate(lf, [sec(0.23, fps), sec(0.36, fps), sec(0.53, fps)], [1, 0.84, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <AbsoluteFill style={{ backgroundColor: "#0D0D10", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 820,
            height: 220,
            borderRadius: 999,
            backgroundColor: "#26262E",
            border: "3px solid rgba(255,255,255,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 36px",
            gap: 44,
          }}
        >
          <span style={{ fontFamily: FONT_MONO, fontSize: 34, color: "#A1A1AA" }}>⌘↵</span>
          <div
            style={{
              width: 154,
              height: 154,
              borderRadius: 999,
              backgroundColor: submitAccent,
              color: "#FFFFFF",
              display: "grid",
              placeItems: "center",
              fontSize: 78,
              fontWeight: 700,
              transform: `scale(${press})`,
              boxShadow: `0 18px 50px ${submitAccent}88`,
            }}
          >
            ↑
          </div>
        </div>
        <TactileCursor x={1185} y={550} scale={press * 1.9} fill="#FFFFFF" />
      </AbsoluteFill>
    );
  }

  // Luminous Orb Singularity Bloom -> Dissolves dark cluster into pure white
  if (frame >= fSingularityStart) {
    const lf = frame - fSingularityStart;
    const orbMorph = interpolate(lf, [0, sec(0.47, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    const swirlIn = interpolate(lf, [sec(0.33, fps), sec(1.13, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    });
    const whiteFlash = interpolate(lf, [sec(1.07, fps), sec(1.53, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });

    return (
      <AbsoluteFill style={{ backgroundColor: "#0D0D10", alignItems: "center", justifyContent: "center" }}>
        {TECH_MOOD.map((c, i) => {
          const angle = swirlIn * 1.6 + i * 0.9;
          const dist = 1 - swirlIn;
          const x = c.x * dist * Math.cos(angle * 0.35);
          const y = c.y * dist;
          return (
            <div
              key={c.code}
              style={{
                position: "absolute",
                width: 170 * (1 - swirlIn * 0.35),
                height: 170 * (1 - swirlIn * 0.35),
                borderRadius: 9999,
                backgroundColor: "#FFFFFF",
                filter: `blur(${16 + orbMorph * 16}px)`,
                transform: `translate3d(${x}px, ${y}px, 0)`,
                opacity: 0.92,
              }}
            />
          );
        })}

        <div
          style={{
            position: "absolute",
            width: 220 + whiteFlash * 2600,
            height: 220 + whiteFlash * 2600,
            borderRadius: 9999,
            backgroundColor: "#FFFFFF",
            filter: `blur(${(1 - whiteFlash) * 42}px)`,
            opacity: interpolate(lf, [sec(0.6, fps), sec(1.2, fps)], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      </AbsoluteFill>
    );
  }

  // Anchor Light -> Dark Theme Inversion + 3D Z-Scatter Swap
  const darkP = interpolate(frame, [fDarkStart, fDarkEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const bgColor = interpolateColors(darkP, [0, 1], ["#FFFFFF", "#0D0D10"]);
  const barBg = interpolateColors(darkP, [0, 1], ["#FFFFFF", "#18181F"]);
  const barBorder = interpolateColors(darkP, [0, 1], ["#E4E4E7", "#2E2E3A"]);
  const barText = interpolateColors(darkP, [0, 1], ["#18181B", "#F4F4F6"]);

  const scatterOut = interpolate(frame, [fScatterStart, fScatterStart + sec(0.6, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });
  const techIn = interpolate(
    frame,
    [fScatterStart + sec(0.33, fps), fScatterStart + sec(1.0, fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT_EXPO }
  );

  const activePrompt = frame < fSynthType ? pivotPrompt : synthesisPrompt;
  const typedLen =
    frame < fSynthType
      ? getNaturalTypedLength(pivotPrompt, frame, sec(1.4, fps), 34, fps)
      : getNaturalTypedLength(synthesisPrompt, frame, fSynthType, 36, fps);

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, alignItems: "center", justifyContent: "center", fontFamily: FONT_SANS }}>
      {/* Outgoing Warm Moodboard -> Blasts Outward Past Camera */}
      {scatterOut < 1 && (
        <DirectionalMotionBlur
          blurX={scatterOut > 0.08 ? scatterOut * 14 : 0}
          blurY={scatterOut > 0.08 ? scatterOut * 8 : 0}
          style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {WARM_MOOD.map((c, i) => {
            const pop = spring({
              frame: Math.max(0, frame - Math.round(i * sec(0.1, fps))),
              fps,
              config: SPRING_SNAPPY,
            });
            const x = c.x * pop * (1 + scatterOut * 2.2);
            const y = (c.y - 50) * pop * (1 + scatterOut * 2.0);
            const sc = (0.45 + pop * 0.55) * (1 + scatterOut * 1.45);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: c.w,
                  height: c.h,
                  borderRadius: 22,
                  background: c.bg,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.14)",
                  transform: `translate3d(${x}px, ${y}px, 0) scale(${sc})`,
                  opacity: Math.min(1, pop * 1.3) * (1 - scatterOut),
                }}
              />
            );
          })}
        </DirectionalMotionBlur>
      )}

      {/* Incoming Technical Dark Cluster -> Rushes Inward & Stays Locked Center */}
      {techIn > 0 && (
        <DirectionalMotionBlur
          blurX={techIn < 0.85 ? (1 - techIn) * 10 : 0}
          blurY={techIn < 0.85 ? (1 - techIn) * 6 : 0}
          style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {TECH_MOOD.map((c, i) => {
            const stagger = Math.max(0, Math.min(1, (techIn - i * 0.03) / 0.78));
            const x = c.x * (1.55 - stagger * 0.55);
            const y = (c.y - 60) * (1.55 - stagger * 0.55);
            const sc = 0.5 + stagger * 0.5;
            return (
              <div
                key={c.code}
                style={{
                  position: "absolute",
                  width: c.w,
                  height: c.h,
                  borderRadius: 18,
                  backgroundColor: c.bg,
                  border: `1.5px solid ${c.accent}55`,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.34)",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transform: `translate3d(${x}px, ${y}px, 0) scale(${sc})`,
                  opacity: stagger,
                }}
              >
                <span style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: c.accent }} />
                <span style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: 600, color: "#FAFAFA" }}>
                  {c.code}
                </span>
              </div>
            );
          })}
        </DirectionalMotionBlur>
      )}

      {/* Anchored Bottom Chat Prompt Bar (Safe Margin >= 90px) */}
      <div
        style={{
          position: "absolute",
          bottom: 92,
          width: 980,
          height: 86,
          borderRadius: 999,
          backgroundColor: barBg,
          border: `2px solid ${barBorder}`,
          boxShadow: "0 16px 44px rgba(0,0,0,0.12)",
          padding: "0 16px 0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: barText }}>
          <span style={{ color: "#71717A" }}>+</span>
          <span>{activePrompt.slice(0, typedLen)}</span>
          <span
            style={{
              width: 2.5,
              height: 28,
              backgroundColor: barText,
              opacity: getCaretOpacity(frame, typedLen < activePrompt.length, fps),
            }}
          />
        </div>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            backgroundColor: submitAccent,
            color: "#FFFFFF",
            display: "grid",
            placeItems: "center",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          ↑
        </div>
      </div>
    </AbsoluteFill>
  );
};
