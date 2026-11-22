import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ANTIGRAVITY_THEME,
  AntigravityMark,
  StudioLightBackdrop,
} from "../../components/AntigravityPrimitives";
import {
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  SPRING_EDITORIAL,
  computeSecondarySettle,
  sec,
} from "../../lib/studioMotion";

export interface AntigravityFinaleSceneProps {
  brandName: string;
  positioningLine: string;
  ctaButtonText: string;
  ctaUrl: string;
  accentColor: string;
  skyColor: string;
}

/**
 * Shot 6 (Beats 41 -> 48, 3.5s): Pure Light-Gallery Brand Lockup + Calm CTA URL Hold
 * - Pure #FFFFFF gallery stage matching Frame-0 seamlessly for clean X auto-replays.
 * - Fast (<= 0.65s) mark -> dark-ink geometric wordmark reflow + rock-solid 2.75s CTA hold.
 */
export const AntigravityFinaleScene: React.FC<AntigravityFinaleSceneProps> = ({
  brandName,
  positioningLine,
  ctaButtonText,
  ctaUrl,
  accentColor,
  skyColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordmarkProgress = spring({
    frame: Math.max(0, frame - sec(0.1, fps)),
    fps,
    config: SPRING_EDITORIAL,
  });

  const subSettle = computeSecondarySettle(frame, sec(0.24, fps), fps, 0.065, 8);
  const ctaSettle = computeSecondarySettle(frame, sec(0.38, fps), fps, 0.065, 8);

  const wordmarkWidth = interpolate(wordmarkProgress, [0, 1], [0, 530], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      <StudioLightBackdrop surface="white" showGrid glowX="50%" glowY="44%" glowIntensity={0.12} />

      <AbsoluteFill
        style={{
          padding: "96px 140px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Emblem + Crisp Dark-Ink Wordmark Lockup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: interpolate(wordmarkProgress, [0, 1], [0, 26]),
            marginBottom: 26,
          }}
        >
          <AntigravityMark
            size={88}
            variant="badge"
            accentColor={accentColor}
            skyColor={skyColor}
          />

          <div
            style={{
              width: wordmarkWidth,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-0.048em",
                lineHeight: 1.0,
                color: ANTIGRAVITY_THEME.ink,
                whiteSpace: "nowrap",
                opacity: Math.min(1, wordmarkProgress * 1.4),
              }}
            >
              {brandName}
            </span>
          </div>
        </div>

        {/* Crisp 1-Line Positioning */}
        <div
          style={{
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: "-0.015em",
            lineHeight: 1.32,
            color: ANTIGRAVITY_THEME.inkSecondary,
            textAlign: "center",
            marginBottom: 44,
            opacity: subSettle.opacity,
            transform: `translate3d(0, ${subSettle.translateY}px, 0)`,
          }}
        >
          {positioningLine}
        </div>

        {/* High-Contrast Studio CTA Bar + URL Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 18,
            padding: "11px 13px 11px 28px",
            borderRadius: 15,
            backgroundColor: "#FFFFFF",
            border: `1.5px solid ${ANTIGRAVITY_THEME.borderStrong}`,
            boxShadow: ANTIGRAVITY_THEME.shadowHero,
            opacity: ctaSettle.opacity,
            transform: `translate3d(0, ${ctaSettle.translateY}px, 0)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.01em",
              color: ANTIGRAVITY_THEME.ink,
            }}
          >
            {ctaUrl}
          </span>

          <div
            style={{
              height: 54,
              padding: "0 26px",
              borderRadius: 10,
              backgroundColor: accentColor,
              color: "#FFFFFF",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.015em",
              boxShadow: "0 10px 26px rgba(37, 99, 235, 0.34)",
            }}
          >
            <span>{ctaButtonText}</span>
            <span style={{ fontFamily: FONT_MONO }}>→</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
