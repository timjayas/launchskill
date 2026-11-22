import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BackgroundCanvas } from "../components/BackgroundCanvas";
import { EndCardCTA } from "../components/EndCardCTA";
import { KineticHeadline } from "../components/KineticHeadline";
import { ProductStage3D } from "../components/ProductStage3D";
import { FONT_MONO, FONT_SANS, SPRING_SNAPPY, getSceneEnvelope } from "../lib/motion";
import type { SaasLaunchProps } from "../lib/schema";

export const SaasLaunch: React.FC<SaasLaunchProps> = ({
  productName,
  badge,
  hookLines,
  tagline,
  dashboardTitle,
  dashboardMetricLabel,
  dashboardMetricValue,
  dashboardDelta,
  dashboardHighlights,
  features,
  ctaHeadline,
  ctaButtonText,
  ctaUrl,
  theme,
  timingSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const overlap = Math.round(fps * 0.25);

  const hookDuration = Math.round(timingSeconds.hook * fps);
  const heroStart = hookDuration - overlap;
  const heroDuration = Math.round(timingSeconds.hero * fps);

  const featuresStart = heroStart + heroDuration - overlap;
  const featuresDuration = Math.round(timingSeconds.features * fps);

  const ctaStart = featuresStart + featuresDuration - overlap;
  const ctaDuration = Math.round(timingSeconds.cta * fps);

  const hookEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: 0,
    durationFrames: hookDuration,
    instantStart: true,
  });

  const heroEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: heroStart,
    durationFrames: heroDuration,
  });

  const featuresEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: featuresStart,
    durationFrames: featuresDuration,
  });

  const ctaEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: ctaStart,
    durationFrames: ctaDuration,
    exitFrames: 1,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background, fontFamily: FONT_SANS }}>
      <BackgroundCanvas theme={theme} mode="saas" />

      {/* BEAT 1: 1-3s Scroll-Stopping Hook */}
      {hookEnv.visible && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "90px 120px",
            opacity: hookEnv.opacity,
            transform: `translateY(${hookEnv.translateY}px) scale(${hookEnv.scale})`,
          }}
        >
          <KineticHeadline
            badge={badge}
            lines={hookLines}
            subtitle={tagline}
            localFrame={hookEnv.localFrame}
            fps={fps}
            theme={theme}
            fontSize={112}
          />
        </AbsoluteFill>
      )}

      {/* BEAT 2: 3D Floating Product Dashboard Showcase */}
      {heroEnv.visible && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "90px 120px",
            opacity: heroEnv.opacity,
            transform: `translateY(${heroEnv.translateY}px) scale(${heroEnv.scale})`,
          }}
        >
          <ProductStage3D
            productName={productName}
            dashboardTitle={dashboardTitle}
            metricLabel={dashboardMetricLabel}
            metricValue={dashboardMetricValue}
            delta={dashboardDelta}
            highlights={dashboardHighlights}
            localFrame={heroEnv.localFrame}
            fps={fps}
            theme={theme}
          />
        </AbsoluteFill>
      )}

      {/* BEAT 3: Staggered 3-Card Feature Bento */}
      {featuresEnv.visible && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "90px 120px",
            opacity: featuresEnv.opacity,
            transform: `translateY(${featuresEnv.translateY}px) scale(${featuresEnv.scale})`,
          }}
        >
          <div style={{ width: "100%", maxWidth: 1620, display: "flex", flexDirection: "column", gap: 44 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 24,
                    fontWeight: 600,
                    color: theme.accentSecondary,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Built for velocity
                </div>
                <div
                  style={{
                    fontSize: 68,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: theme.textPrimary,
                    lineHeight: 1.06,
                  }}
                >
                  Everything your team needs to ship.
                </div>
              </div>
              <div
                style={{
                  fontSize: 28,
                  color: theme.textMuted,
                  fontWeight: 500,
                }}
              >
                {productName}
              </div>
            </div>

            <div style={{ display: "flex", gap: 28 }}>
              {features.map((feature, index) => {
                const cardSpring = spring({
                  frame: Math.max(0, featuresEnv.localFrame - 8 - index * 7),
                  fps,
                  config: SPRING_SNAPPY,
                  durationInFrames: Math.round(fps * 0.6),
                });

                return (
                  <div
                    key={`${feature.title}-${index}`}
                    style={{
                      flex: 1,
                      borderRadius: 24,
                      backgroundColor: `${theme.surface}F2`,
                      border: `1px solid ${theme.border}`,
                      padding: 36,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 420,
                      opacity: interpolate(cardSpring, [0, 1], [0, 1]),
                      transform: `translateY(${interpolate(cardSpring, [0, 1], [38, 0])}px)`,
                      boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "inline-block",
                          padding: "8px 16px",
                          borderRadius: 999,
                          backgroundColor: `${theme.accent}20`,
                          border: `1px solid ${theme.accent}45`,
                          color: theme.accentSecondary,
                          fontFamily: FONT_MONO,
                          fontSize: 22,
                          fontWeight: 600,
                          marginBottom: 24,
                        }}
                      >
                        {feature.label}
                      </div>
                      <div
                        style={{
                          fontSize: 40,
                          fontWeight: 700,
                          letterSpacing: "-0.025em",
                          color: theme.textPrimary,
                          lineHeight: 1.15,
                          marginBottom: 16,
                        }}
                      >
                        {feature.title}
                      </div>
                      <div
                        style={{
                          fontSize: 28,
                          color: theme.textMuted,
                          lineHeight: 1.4,
                        }}
                      >
                        {feature.description}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 32,
                        paddingTop: 22,
                        borderTop: `1px solid ${theme.border}`,
                        fontSize: 48,
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        backgroundImage: `linear-gradient(95deg, ${theme.textPrimary}, ${theme.accentSecondary})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {feature.metric}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* BEAT 4: High-Contrast CTA End Card */}
      {ctaEnv.visible && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: ctaEnv.opacity,
            transform: `translateY(${ctaEnv.translateY}px) scale(${ctaEnv.scale})`,
          }}
        >
          <EndCardCTA
            productName={productName}
            headline={ctaHeadline}
            buttonText={ctaButtonText}
            url={ctaUrl}
            localFrame={ctaEnv.localFrame}
            fps={fps}
            theme={theme}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
