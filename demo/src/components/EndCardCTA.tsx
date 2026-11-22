import React from "react";
import { interpolate, spring } from "remotion";
import { FONT_MONO, FONT_SANS, SPRING_POP, SPRING_SNAPPY } from "../lib/motion";
import type { LaunchTheme } from "../lib/schema";

interface EndCardCTAProps {
  productName: string;
  headline: string;
  buttonText?: string;
  url: string;
  localFrame: number;
  fps: number;
  theme: LaunchTheme;
}

export const EndCardCTA: React.FC<EndCardCTAProps> = ({
  productName,
  headline,
  buttonText = "Get started free",
  url,
  localFrame,
  fps,
  theme,
}) => {
  const logoSpring = spring({
    frame: Math.max(0, localFrame),
    fps,
    config: SPRING_POP,
    durationInFrames: Math.round(fps * 0.5),
  });

  const headlineSpring = spring({
    frame: Math.max(0, localFrame - 6),
    fps,
    config: SPRING_SNAPPY,
    durationInFrames: Math.round(fps * 0.55),
  });

  const pillSpring = spring({
    frame: Math.max(0, localFrame - 12),
    fps,
    config: SPRING_SNAPPY,
    durationInFrames: Math.round(fps * 0.55),
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: FONT_SANS,
        gap: 28,
        padding: "0 120px",
      }}
    >
      {/* Brand mark lockup */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 18,
          transform: `scale(${interpolate(logoSpring, [0, 1], [0.85, 1])})`,
          opacity: interpolate(logoSpring, [0, 1], [0, 1]),
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 800,
            color: "#09090B",
            boxShadow: `0 12px 40px ${theme.accent}55`,
          }}
        >
          {productName.slice(0, 1).toUpperCase()}
        </div>
        <span
          style={{
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: theme.textPrimary,
          }}
        >
          {productName}
        </span>
      </div>

      {/* Main CTA headline */}
      <div
        style={{
          fontSize: 82,
          fontWeight: 800,
          letterSpacing: "-0.035em",
          lineHeight: 1.08,
          color: theme.textPrimary,
          maxWidth: 1280,
          opacity: interpolate(headlineSpring, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(headlineSpring, [0, 1], [24, 0])}px)`,
        }}
      >
        {headline}
      </div>

      {/* CTA Pill + URL */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginTop: 10,
          opacity: interpolate(pillSpring, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(pillSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            padding: "18px 34px",
            borderRadius: 999,
            background: `linear-gradient(95deg, ${theme.accent}, ${theme.accentSecondary})`,
            color: "#09090B",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            boxShadow: `0 10px 36px ${theme.accent}50`,
          }}
        >
          {buttonText}
        </div>
        <div
          style={{
            padding: "18px 32px",
            borderRadius: 999,
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            color: theme.textPrimary,
            fontFamily: FONT_MONO,
            fontSize: 28,
            fontWeight: 500,
          }}
        >
          {url}
        </div>
      </div>
    </div>
  );
};
