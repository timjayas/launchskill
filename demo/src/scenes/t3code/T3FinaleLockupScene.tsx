import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AgentAppIcon,
  FONT_SANS,
  T3_THEME,
  T3StudioCyclorama,
} from "../../components/T3CodePrimitives";
import {
  EASE_OUT_EXPO,
  SPRING_EDITORIAL,
  computeSecondarySettle,
  sec,
} from "../../lib/studioMotion";

export interface T3FinaleLockupSceneProps {
  brandName: string;
  positioningLine: string;
  ctaUrl: string;
}

/**
 * Beat 6 (14.67s -> 17.78s @ 135 BPM, 93f): Velocity-Matched Iconic Brand Lockup + 2.55s Calm Hold
 * - Catches Beat 5's inward gather momentum with silky scale deceleration (1.12 -> 1.0).
 * - Fast <= 0.42s T3 icon -> T3 Code wordmark reflow, then rock-solid calm hold looping back to Frame 0.
 */
export const T3FinaleLockupScene: React.FC<T3FinaleLockupSceneProps> = ({
  brandName,
  positioningLine,
  ctaUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const arriveP = interpolate(frame, [0, sec(0.24, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const wordReflow = spring({
    frame: Math.max(0, frame - sec(0.03, fps)),
    fps,
    config: SPRING_EDITORIAL,
  });

  const subSettle = computeSecondarySettle(frame, sec(0.08, fps), fps, 0.055, 7);
  const pillSettle = computeSecondarySettle(frame, sec(0.16, fps), fps, 0.055, 7);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      {/* Soft Studio Cyclorama Gently Settling Into Calm Stillness */}
      <T3StudioCyclorama
        zoom={1.06 - arriveP * 0.06}
        dotOpacity={0.07}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
      {/* Tactile Icon + Clean Wordmark Lockup */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 26,
          transform: `scale(${1.12 - arriveP * 0.12})`,
          opacity: Math.max(0.86, Math.min(1, arriveP * 1.4)),
        }}
      >
        <AgentAppIcon brand="t3" size={96} elevated />

        <div
          style={{
            overflow: "hidden",
            maxWidth: Math.round(wordReflow * 420),
            opacity: Math.min(1, wordReflow * 1.35),
          }}
        >
          <span
            style={{
              fontSize: 98,
              fontWeight: 800,
              letterSpacing: "-0.048em",
              lineHeight: 0.98,
              color: T3_THEME.ink,
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {brandName}
          </span>
        </div>
      </div>

      {/* Single Calm Whisper Positioning Line */}
      <div
        style={{
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: T3_THEME.inkMuted,
          opacity: subSettle.opacity,
          transform: `translate3d(0, ${subSettle.translateY}px, 0)`,
        }}
      >
        {positioningLine}
      </div>

      {/* Single High-Contrast Minimal Charcoal CTA Pill */}
      <div
        style={{
          marginTop: 8,
          padding: "16px 38px",
          borderRadius: 999,
          backgroundColor: T3_THEME.ink,
          color: "#FFFFFF",
          fontSize: 23,
          fontWeight: 600,
          letterSpacing: "-0.015em",
          boxShadow: T3_THEME.shadowIcon,
          opacity: pillSettle.opacity,
          transform: `translate3d(0, ${pillSettle.translateY}px, 0)`,
        }}
      >
        {ctaUrl}
      </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
