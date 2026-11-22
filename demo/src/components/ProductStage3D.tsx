import React from "react";
import { interpolate, spring } from "remotion";
import { FONT_MONO, FONT_SANS, SPRING_SMOOTH, SPRING_SNAPPY } from "../lib/motion";
import type { LaunchTheme } from "../lib/schema";

interface ProductStage3DProps {
  productName: string;
  dashboardTitle: string;
  metricLabel: string;
  metricValue: string;
  delta: string;
  highlights: readonly [string, string, string];
  localFrame: number;
  fps: number;
  theme: LaunchTheme;
}

/**
 * Crisp 2D SaaS UI synchronized with subtle 3D perspective motion so typography
 * stays vector-sharp under X's H.264 compression while sitting inside the R3F 3D space.
 */
export const ProductStage3D: React.FC<ProductStage3DProps> = ({
  productName,
  dashboardTitle,
  metricLabel,
  metricValue,
  delta,
  highlights,
  localFrame,
  fps,
  theme,
}) => {
  const t = localFrame / fps;

  const entry = spring({
    frame: Math.max(0, localFrame),
    fps,
    config: SPRING_SMOOTH,
    durationInFrames: Math.round(fps * 0.9),
  });

  // Gentle 3D parallax settle: glides from angled hero entrance into crisp frontal read
  const rotateY = interpolate(entry, [0, 1], [-14, 0]) + Math.sin(t * 0.9) * 2.4;
  const rotateX = interpolate(entry, [0, 1], [10, 0]) + Math.cos(t * 0.7) * 1.4;
  const scale = interpolate(entry, [0, 1], [0.88, 1]);
  const floatY = Math.sin(t * 1.3) * 6;

  // Deterministic bar heights for a clean live-telemetry chart
  const bars = [38, 52, 46, 68, 62, 79, 86, 94];

  // Active highlighted row cycles smoothly across the 3 product highlights
  const activeIndex = Math.min(2, Math.floor(Math.max(0, localFrame - 24) / Math.round(fps * 2.2)));

  return (
    <div
      style={{
        width: 1460,
        perspective: 1600,
        fontFamily: FONT_SANS,
      }}
    >
      <div
        style={{
          transform: `translateY(${floatY}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          borderRadius: 28,
          backgroundColor: `${theme.surface}EE`,
          border: `1px solid ${theme.border}`,
          boxShadow: `0 40px 120px rgba(0,0,0,0.65), 0 0 0 1px ${theme.accent}25`,
          padding: 36,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Window top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 20,
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 99, backgroundColor: "#FF5F56" }} />
              <span style={{ width: 12, height: 12, borderRadius: 99, backgroundColor: "#FFBD2E" }} />
              <span style={{ width: 12, height: 12, borderRadius: 99, backgroundColor: "#27C93F" }} />
            </div>
            <span
              style={{
                marginLeft: 12,
                fontSize: 26,
                fontWeight: 600,
                color: theme.textPrimary,
              }}
            >
              {productName} — {dashboardTitle}
            </span>
          </div>

          <div
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              backgroundColor: `${theme.accent}22`,
              border: `1px solid ${theme.accent}50`,
              color: theme.accentSecondary,
              fontFamily: FONT_MONO,
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            LIVE · 99.98%
          </div>
        </div>

        {/* Main 2-column product content */}
        <div style={{ display: "flex", gap: 28 }}>
          {/* Left: Primary Hero Metric + Animated Bars */}
          <div
            style={{
              flex: 1.25,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.03)",
              border: `1px solid ${theme.border}`,
              padding: 30,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 28,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 24, color: theme.textMuted, fontWeight: 500 }}>
                  {metricLabel}
                </div>
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    letterSpacing: "-0.035em",
                    color: theme.textPrimary,
                    marginTop: 6,
                  }}
                >
                  {metricValue}
                </div>
              </div>
              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: 12,
                  backgroundColor: "rgba(34, 197, 94, 0.14)",
                  border: "1px solid rgba(34, 197, 94, 0.35)",
                  color: "#4ADE80",
                  fontFamily: FONT_MONO,
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                {delta}
              </div>
            </div>

            {/* Staggered telemetry bars */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 16,
                height: 210,
                paddingTop: 12,
              }}
            >
              {bars.map((heightPct, i) => {
                const barProgress = spring({
                  frame: Math.max(0, localFrame - 12 - i * 3),
                  fps,
                  config: SPRING_SNAPPY,
                  durationInFrames: Math.round(fps * 0.65),
                });
                const isLatest = i >= bars.length - 2;

                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${heightPct * barProgress}%`,
                      borderRadius: "10px 10px 4px 4px",
                      background: isLatest
                        ? `linear-gradient(180deg, ${theme.accentSecondary}, ${theme.accent})`
                        : `linear-gradient(180deg, ${theme.accent}AA, ${theme.accent}28)`,
                      boxShadow: isLatest ? `0 0 28px ${theme.accent}55` : "none",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Right: Live Feature Highlights Feed */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {highlights.map((item, idx) => {
              const itemSpring = spring({
                frame: Math.max(0, localFrame - 16 - idx * 7),
                fps,
                config: SPRING_SNAPPY,
                durationInFrames: Math.round(fps * 0.55),
              });
              const isActive = idx === activeIndex;

              return (
                <div
                  key={`${item}-${idx}`}
                  style={{
                    flex: 1,
                    borderRadius: 18,
                    padding: "22px 26px",
                    backgroundColor: isActive ? `${theme.accent}22` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? theme.accent : theme.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    opacity: interpolate(itemSpring, [0, 1], [0, 1]),
                    transform: `translateX(${interpolate(itemSpring, [0, 1], [28, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: isActive ? theme.accent : "rgba(255,255,255,0.08)",
                      color: isActive ? "#09090B" : theme.textPrimary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: FONT_MONO,
                      fontSize: 22,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    0{idx + 1}
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: theme.textPrimary,
                      lineHeight: 1.25,
                    }}
                  >
                    {item}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
