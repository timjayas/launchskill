import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BackgroundCanvas } from "../components/BackgroundCanvas";
import { EndCardCTA } from "../components/EndCardCTA";
import { KineticHeadline } from "../components/KineticHeadline";
import { FONT_MONO, FONT_SANS, SPRING_POP, SPRING_SMOOTH, SPRING_SNAPPY, getSceneEnvelope } from "../lib/motion";
import type { AppFeatureHighlightProps } from "../lib/schema";

export const AppFeatureHighlight: React.FC<AppFeatureHighlightProps> = ({
  productName,
  featureBadge,
  hookLines,
  featureTitle,
  featureDescription,
  calloutLabel,
  calloutDetail,
  impactStat,
  impactLabel,
  ctaHeadline,
  ctaUrl,
  theme,
  timingSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const overlap = Math.round(fps * 0.25);

  const hookDuration = Math.round(timingSeconds.hook * fps);
  const spotlightStart = hookDuration - overlap;
  const spotlightDuration = Math.round(timingSeconds.spotlight * fps);

  const impactStart = spotlightStart + spotlightDuration - overlap;
  const impactDuration = Math.round(timingSeconds.impact * fps);

  const ctaStart = impactStart + impactDuration - overlap;
  const ctaDuration = Math.round(timingSeconds.cta * fps);

  const hookEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: 0,
    durationFrames: hookDuration,
    instantStart: true,
  });

  const spotlightEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: spotlightStart,
    durationFrames: spotlightDuration,
  });

  const impactEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: impactStart,
    durationFrames: impactDuration,
  });

  const ctaEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: ctaStart,
    durationFrames: ctaDuration,
    exitFrames: 1,
  });

  // Spotlight 3D tilt + zoomed callout pop
  const cardEntry = spring({
    frame: Math.max(0, spotlightEnv.localFrame),
    fps,
    config: SPRING_SMOOTH,
    durationInFrames: Math.round(fps * 0.85),
  });

  const calloutPop = spring({
    frame: Math.max(0, spotlightEnv.localFrame - Math.round(fps * 1.4)),
    fps,
    config: SPRING_POP,
    durationInFrames: Math.round(fps * 0.55),
  });

  const impactPop = spring({
    frame: Math.max(0, impactEnv.localFrame - 4),
    fps,
    config: SPRING_SNAPPY,
    durationInFrames: Math.round(fps * 0.55),
  });

  const tSpot = spotlightEnv.localFrame / fps;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background, fontFamily: FONT_SANS }}>
      <BackgroundCanvas theme={theme} mode="feature" />

      {/* BEAT 1: Kinetic Feature Hook */}
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
            badge={featureBadge}
            lines={hookLines}
            localFrame={hookEnv.localFrame}
            fps={fps}
            theme={theme}
            fontSize={108}
          />
        </AbsoluteFill>
      )}

      {/* BEAT 2: Split 3D Angled Feature Window + Live Callout */}
      {spotlightEnv.visible && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "90px 120px",
            opacity: spotlightEnv.opacity,
            transform: `translateY(${spotlightEnv.translateY}px)`,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1620,
              display: "flex",
              alignItems: "center",
              gap: 64,
            }}
          >
            {/* Left Copy Column */}
            <div style={{ flex: 0.9, display: "flex", flexDirection: "column", gap: 22 }}>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 24,
                  fontWeight: 600,
                  color: theme.accentSecondary,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {productName} · New Feature
              </div>
              <div
                style={{
                  fontSize: 66,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.08,
                  color: theme.textPrimary,
                }}
              >
                {featureTitle}
              </div>
              <div
                style={{
                  fontSize: 34,
                  lineHeight: 1.4,
                  color: theme.textMuted,
                }}
              >
                {featureDescription}
              </div>
            </div>

            {/* Right 3D Angled App Window + Popped Callout */}
            <div style={{ flex: 1.15, perspective: 1500, position: "relative" }}>
              <div
                style={{
                  borderRadius: 26,
                  backgroundColor: `${theme.surface}F4`,
                  border: `1px solid ${theme.border}`,
                  padding: 34,
                  boxShadow: `0 36px 96px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accent}30`,
                  transform: `rotateY(${interpolate(cardEntry, [0, 1], [-18, -7]) + Math.sin(tSpot * 0.9) * 1.8}deg) rotateX(${interpolate(cardEntry, [0, 1], [8, 3])}deg) scale(${interpolate(cardEntry, [0, 1], [0.9, 1])})`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                }}
              >
                {/* Command bar mockup */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 22px",
                    borderRadius: 14,
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${theme.border}`,
                    fontFamily: FONT_MONO,
                    fontSize: 24,
                    color: theme.textPrimary,
                  }}
                >
                  <span>⌘K  {calloutLabel}</span>
                  <span style={{ color: theme.accentSecondary }}>ENTER ↵</span>
                </div>

                {/* Simulated workflow pipeline steps */}
                {["Analyze context", "Apply smart action", "Verify & publish"].map((step, i) => {
                  const done = spotlightEnv.localFrame > Math.round(fps * (0.9 + i * 0.95));
                  return (
                    <div
                      key={step}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px 24px",
                        borderRadius: 16,
                        backgroundColor: done ? `${theme.accent}20` : "rgba(255,255,255,0.025)",
                        border: `1px solid ${done ? theme.accent : theme.border}`,
                      }}
                    >
                      <span style={{ fontSize: 28, fontWeight: 600, color: theme.textPrimary }}>
                        {step}
                      </span>
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 22,
                          fontWeight: 700,
                          color: done ? "#4ADE80" : theme.textMuted,
                        }}
                      >
                        {done ? "DONE" : "READY"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Floating Zoomed Callout Badge */}
              <div
                style={{
                  position: "absolute",
                  right: -20,
                  bottom: -30,
                  padding: "22px 30px",
                  borderRadius: 20,
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                  color: "#09090B",
                  boxShadow: `0 22px 60px ${theme.accent}66`,
                  opacity: interpolate(calloutPop, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(calloutPop, [0, 1], [28, 0])}px) scale(${interpolate(calloutPop, [0, 1], [0.88, 1])})`,
                }}
              >
                <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, opacity: 0.85 }}>
                  HIGHLIGHT
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 4 }}>
                  {calloutDetail}
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* BEAT 3: Single Bold Impact Stat */}
      {impactEnv.visible && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "90px 120px",
            opacity: impactEnv.opacity,
            transform: `translateY(${impactEnv.translateY}px)`,
          }}
        >
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div
              style={{
                fontSize: 168,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 1,
                backgroundImage: `linear-gradient(95deg, ${theme.textPrimary} 0%, ${theme.accent} 55%, ${theme.accentSecondary} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                transform: `scale(${interpolate(impactPop, [0, 1], [0.84, 1])})`,
              }}
            >
              {impactStat}
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 500,
                color: theme.textMuted,
                maxWidth: 1100,
              }}
            >
              {impactLabel}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* BEAT 4: CTA End Card */}
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
            buttonText="Try it now"
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
