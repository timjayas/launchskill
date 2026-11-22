import React from "react";
import { interpolate, spring } from "remotion";
import { FONT_SANS, SPRING_SNAPPY } from "../lib/motion";
import type { LaunchTheme } from "../lib/schema";

interface KineticHeadlineProps {
  lines: readonly string[];
  subtitle?: string;
  badge?: string;
  localFrame: number;
  fps: number;
  theme: LaunchTheme;
  align?: "center" | "left";
  fontSize?: number;
  highlightSecondLine?: boolean;
}

export const KineticHeadline: React.FC<KineticHeadlineProps> = ({
  lines,
  subtitle,
  badge,
  localFrame,
  fps,
  theme,
  align = "center",
  fontSize = 104,
  highlightSecondLine = true,
}) => {
  const badgeProgress = spring({
    frame: Math.max(0, localFrame),
    fps,
    config: SPRING_SNAPPY,
    durationInFrames: Math.round(fps * 0.45),
  });

  const subtitleProgress = spring({
    frame: Math.max(0, localFrame - 10),
    fps,
    config: SPRING_SNAPPY,
    durationInFrames: Math.round(fps * 0.55),
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        fontFamily: FONT_SANS,
        maxWidth: 1520,
      }}
    >
      {badge && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 22px",
            borderRadius: 999,
            backgroundColor: `${theme.accent}20`,
            border: `1px solid ${theme.accent}55`,
            color: theme.textPrimary,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "0.02em",
            marginBottom: 28,
            opacity: interpolate(badgeProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(badgeProgress, [0, 1], [16, 0])}px)`,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: theme.accentSecondary,
              boxShadow: `0 0 14px ${theme.accentSecondary}`,
            }}
          />
          {badge}
        </div>
      )}

      {lines.map((line, index) => {
        // Frame-0 presence on line 0 so X scroll-stop is immediate
        const staggerDelay = index * 5;
        const progress = spring({
          frame: Math.max(0, localFrame - staggerDelay + (index === 0 ? 4 : 0)),
          fps,
          config: SPRING_SNAPPY,
          durationInFrames: Math.round(fps * 0.5),
        });

        const isGradientLine = highlightSecondLine && index === lines.length - 1 && lines.length > 1;

        return (
          <div
            key={`${line}-${index}`}
            style={{
              overflow: "hidden",
              paddingBottom: 6,
            }}
          >
            <div
              style={{
                fontSize,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                transform: `translateY(${interpolate(progress, [0, 1], [82, 0])}%)`,
                opacity: interpolate(progress, [0, 0.25, 1], [0.25, 1, 1]),
                ...(isGradientLine
                  ? {
                      backgroundImage: `linear-gradient(95deg, ${theme.textPrimary} 0%, ${theme.accent} 62%, ${theme.accentSecondary} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : { color: theme.textPrimary }),
              }}
            >
              {line}
            </div>
          </div>
        );
      })}

      {subtitle && (
        <div
          style={{
            marginTop: 26,
            fontSize: 38,
            fontWeight: 400,
            lineHeight: 1.35,
            color: theme.textMuted,
            maxWidth: 1120,
            opacity: interpolate(subtitleProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(subtitleProgress, [0, 1], [18, 0])}px)`,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
