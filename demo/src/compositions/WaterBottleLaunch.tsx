import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WaterBottle3DStage } from "../components/WaterBottle3DStage";
import {
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  getSceneEnvelope,
} from "../lib/motion";
import type { WaterBottleLaunchProps } from "../lib/schema";

const SPRING_EDITORIAL = {
  damping: 28,
  stiffness: 175,
  mass: 0.9,
};

export const WaterBottleLaunch: React.FC<WaterBottleLaunchProps> = ({
  productName,
  editionBadge,
  hookLines,
  tagline,
  macroCalloutTitle,
  macroCalloutDetail,
  specsLine,
  coldHours,
  hotHours,
  chapterHeadline,
  features,
  ctaHeadline,
  ctaButtonText,
  ctaUrl,
  theme,
  timingSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const overlap = Math.round(fps * 0.25);

  const hookDuration = Math.round(timingSeconds.hook * fps);
  const revealStart = hookDuration - overlap;
  const revealDuration = Math.round(timingSeconds.reveal * fps);

  const featuresStart = revealStart + revealDuration - overlap;
  const featuresDuration = Math.round(timingSeconds.features * fps);

  const ctaStart = featuresStart + featuresDuration - overlap;
  const ctaDuration = Math.max(
    Math.round(timingSeconds.cta * fps),
    durationInFrames - ctaStart
  );

  // Deliberate palette inversion: Gallery Light -> Obsidian Dark (Beat 3) -> Gallery Light (Beat 4)
  const darkEnter = interpolate(
    frame,
    [featuresStart - Math.round(fps * 0.15), featuresStart + Math.round(fps * 0.45)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    }
  );
  const darkExit = interpolate(
    frame,
    [ctaStart - Math.round(fps * 0.18), ctaStart + Math.round(fps * 0.42)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    }
  );
  const darkProgress = Math.max(0, darkEnter - darkExit);

  const bgColor = interpolateColors(
    darkProgress,
    [0, 1],
    [theme.lightBackground, theme.darkBackground]
  );

  // Scene envelopes
  const hookEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: 0,
    durationFrames: hookDuration,
    instantStart: true,
    exitFrames: Math.round(fps * 0.35),
  });

  const revealEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: revealStart,
    durationFrames: revealDuration,
    exitFrames: Math.round(fps * 0.35),
  });

  const featuresEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: featuresStart,
    durationFrames: featuresDuration,
    exitFrames: Math.round(fps * 0.35),
  });

  const ctaEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: ctaStart,
    durationFrames: ctaDuration,
    exitFrames: 1,
  });

  // Beat 1: Frame-0 kinetic text reveal (instant readability, zero blank start)
  const hookLine1Progress = interpolate(hookEnv.localFrame, [0, 14], [0.35, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const hookLine2Progress = interpolate(hookEnv.localFrame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const hookSubProgress = interpolate(hookEnv.localFrame, [11, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Beat 2: Sub-phases synchronized with 3D macro rig
  const macroInStart = revealStart + Math.round(revealDuration * 0.34);
  const macroInEnd = revealStart + Math.round(revealDuration * 0.46);
  const macroOutStart = revealStart + Math.round(revealDuration * 0.72);
  const macroOutEnd = revealStart + Math.round(revealDuration * 0.85);

  const macroIn = interpolate(frame, [macroInStart, macroInEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const macroOut = interpolate(frame, [macroOutStart, macroOutEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const macroFactor = Math.max(0, macroIn - macroOut);

  const revealTextOpacity = Math.max(0, 1 - macroFactor * 1.45);
  const macroCalloutOpacity = interpolate(macroFactor, [0.55, 0.98], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leaderLineProgress = interpolate(
    frame,
    [macroInEnd - 4, macroInEnd + 14],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    }
  );

  // Beat 3: Live thermal gauge counters + active card highlight
  const thermalProgress = interpolate(
    featuresEnv.localFrame,
    [10, Math.round(fps * 1.35)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    }
  );
  const displayColdHours = Math.round(coldHours * thermalProgress);
  const displayHotHours = Math.round(hotHours * thermalProgress);
  const activeFeatureIndex = Math.min(
    2,
    Math.floor(Math.max(0, featuresEnv.localFrame - 24) / Math.round(fps * 2.1))
  );

  // Beat 4: Closing CTA spring settle
  const ctaBrandSpring = spring({
    frame: Math.max(0, ctaEnv.localFrame - 4),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: Math.round(fps * 0.7),
  });
  const ctaPillSpring = spring({
    frame: Math.max(0, ctaEnv.localFrame - 14),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: Math.round(fps * 0.7),
  });

  // Soft painterly gradient field drift (organic studio light wash, no neon glare)
  const washShiftX = interpolate(frame, [0, durationInFrames], [72, 24]);
  const washShiftY = interpolate(frame, [0, durationInFrames], [30, 62]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        fontFamily: FONT_SANS,
        overflow: "hidden",
      }}
    >
      {/* Painterly organic ambient color wash (adapts seamlessly to light & dark chapters) */}
      <AbsoluteFill
        style={{
          background:
            darkProgress < 0.5
              ? `
                radial-gradient(circle at ${washShiftX}% ${washShiftY}%, ${theme.accentSecondary}24 0%, transparent 48%),
                radial-gradient(circle at ${100 - washShiftX}% ${82 - washShiftY * 0.4}%, #E2E8F099 0%, transparent 52%)
              `
              : `
                radial-gradient(circle at 28% 48%, ${theme.accent}36 0%, transparent 46%),
                radial-gradient(circle at 76% 24%, ${theme.accentSecondary}1E 0%, transparent 48%)
              `,
          opacity: 0.9,
        }}
      />

      {/* Subtle studio architectural corner framing ticks */}
      <AbsoluteFill style={{ pointerEvents: "none", padding: "52px 72px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: FONT_MONO,
            fontSize: 22,
            letterSpacing: "0.08em",
            color:
              darkProgress > 0.5
                ? "rgba(250,250,250,0.42)"
                : "rgba(10,10,10,0.38)",
          }}
        >
          <span>{productName.toUpperCase()} · 01</span>
          <span>{darkProgress > 0.5 ? "THERMAL ARCHITECTURE" : "STUDIO EDITION"}</span>
        </div>
      </AbsoluteFill>

      {/* Single Persistent Deterministic 3D Bottle Stage */}
      <WaterBottle3DStage
        theme={theme}
        timings={{
          hookEnd: hookDuration,
          revealStart,
          revealDuration,
          featuresStart,
          featuresDuration,
          ctaStart,
        }}
        darkProgress={darkProgress}
      />

      {/* ================================================================= */}
      {/* BEAT 1: 0–3s SCROLL-STOPPING EDITORIAL HOOK (Gallery Light)       */}
      {/* ================================================================= */}
      {hookEnv.visible && (
        <AbsoluteFill
          style={{
            padding: "90px 120px",
            justifyContent: "center",
            opacity: hookEnv.opacity,
            transform: `translateY(${hookEnv.translateY}px)`,
          }}
        >
          <div style={{ maxWidth: 1020, display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Crisp hairline studio badge */}
            <div
              style={{
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 22px",
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(10,10,10,0.10)",
                fontSize: 28,
                fontWeight: 500,
                color: theme.lightTextPrimary,
                letterSpacing: "-0.01em",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 99,
                  backgroundColor: theme.accent,
                }}
              />
              {editionBadge}
            </div>

            {/* Two-tone sentence-case headline (masked baseline glide) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ overflow: "hidden", paddingBottom: 6 }}>
                <div
                  style={{
                    fontSize: 108,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.04,
                    color: theme.lightTextMuted,
                    transform: `translateY(${interpolate(hookLine1Progress, [0, 1], [56, 0])}px)`,
                    opacity: hookLine1Progress,
                  }}
                >
                  {hookLines[0]}
                </div>
              </div>

              <div style={{ overflow: "hidden", paddingBottom: 8 }}>
                <div
                  style={{
                    fontSize: 108,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.04,
                    color: theme.lightTextPrimary,
                    transform: `translateY(${interpolate(hookLine2Progress, [0, 1], [68, 0])}px)`,
                    opacity: hookLine2Progress,
                  }}
                >
                  {hookLines[1]}
                </div>
              </div>
            </div>

            {/* Quiet concise positioning line */}
            <div
              style={{
                fontSize: 36,
                fontWeight: 400,
                color: theme.lightTextMuted,
                lineHeight: 1.38,
                maxWidth: 820,
                opacity: hookSubProgress,
                transform: `translateY(${interpolate(hookSubProgress, [0, 1], [18, 0])}px)`,
              }}
            >
              {tagline}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ================================================================= */}
      {/* BEAT 2: 3D STUDIO REVEAL + MACRO CAP LIFT INSPECTION              */}
      {/* ================================================================= */}
      {revealEnv.visible && (
        <AbsoluteFill
          style={{
            padding: "90px 120px",
            opacity: revealEnv.opacity,
          }}
        >
          {/* Phase 2A & 2C: Full Studio Product Typography (Right Column) */}
          {revealTextOpacity > 0.01 && (
            <div
              style={{
                position: "absolute",
                left: 880,
                right: 120,
                top: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 24,
                opacity: revealTextOpacity,
                transform: `translateY(${(1 - revealTextOpacity) * 18}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 26,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: theme.accent,
                }}
              >
                INTRODUCING · SERIES 01
              </div>

              <div
                style={{
                  fontSize: 96,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.02,
                  color: theme.lightTextPrimary,
                }}
              >
                {productName}
              </div>

              <div
                style={{
                  fontSize: 38,
                  fontWeight: 400,
                  lineHeight: 1.36,
                  color: theme.lightTextMuted,
                  maxWidth: 820,
                }}
              >
                {tagline}
              </div>

              {/* Clean architectural spec divider */}
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 24,
                  borderTop: "1px solid rgba(10,10,10,0.12)",
                  fontFamily: FONT_MONO,
                  fontSize: 28,
                  fontWeight: 500,
                  color: theme.lightTextPrimary,
                  letterSpacing: "0.02em",
                }}
              >
                {specsLine}
              </div>
            </div>
          )}

          {/* Phase 2B: Macro Cap Inspection Callout + Hairline Leader Line */}
          {macroCalloutOpacity > 0.01 && (
            <AbsoluteFill style={{ opacity: macroCalloutOpacity, pointerEvents: "none" }}>
              {/* Precision 1px architectural leader line from magnetic seal to callout card */}
              <svg
                width={1920}
                height={1080}
                style={{ position: "absolute", inset: 0 }}
              >
                <circle
                  cx={760}
                  cy={470}
                  r={7}
                  fill={theme.accent}
                  opacity={leaderLineProgress}
                />
                <circle
                  cx={760}
                  cy={470}
                  r={15}
                  fill="none"
                  stroke={theme.accent}
                  strokeWidth={1.5}
                  opacity={0.35 * leaderLineProgress}
                />
                <line
                  x1={775}
                  y1={470}
                  x2={775 + (920 - 775) * leaderLineProgress}
                  y2={470}
                  stroke="rgba(10,10,10,0.38)"
                  strokeWidth={1.5}
                />
              </svg>

              {/* Frosted glass orthogonal callout panel */}
              <div
                style={{
                  position: "absolute",
                  left: 920,
                  top: 345,
                  width: 820,
                  padding: "36px 42px",
                  borderRadius: 24,
                  backgroundColor: "rgba(255,255,255,0.82)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(10,10,10,0.10)",
                  boxShadow: "0 24px 70px rgba(10,10,10,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  transform: `translateX(${interpolate(macroCalloutOpacity, [0, 1], [22, 0])}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: theme.accent,
                  }}
                >
                  MACRO DETAIL · MAGNETIC CAP
                </div>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: theme.lightTextPrimary,
                    lineHeight: 1.12,
                  }}
                >
                  {macroCalloutTitle}
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 400,
                    color: theme.lightTextMuted,
                    lineHeight: 1.35,
                  }}
                >
                  {macroCalloutDetail}
                </div>
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {/* ================================================================= */}
      {/* BEAT 3: DELIBERATE DARK CHAPTER — THERMAL CORE & FEATURE PROOF    */}
      {/* ================================================================= */}
      {featuresEnv.visible && (
        <AbsoluteFill
          style={{
            padding: "90px 120px",
            opacity: featuresEnv.opacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 845,
              right: 120,
              top: 90,
              bottom: 90,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 28,
            }}
          >
            {/* Editorial two-tone dark chapter heading */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div
                style={{
                  fontSize: 66,
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.08,
                  color: theme.darkTextMuted,
                }}
              >
                {chapterHeadline[0]}
              </div>
              <div
                style={{
                  fontSize: 66,
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.08,
                  color: theme.darkTextPrimary,
                }}
              >
                {chapterHeadline[1]}
              </div>
            </div>

            {/* Live animated thermal retention dual bar */}
            <div
              style={{
                display: "flex",
                gap: 20,
                padding: "22px 26px",
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {/* Cold retention */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span
                    style={{
                      fontSize: 48,
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      color: theme.accentSecondary,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {displayColdHours}h
                  </span>
                  <span style={{ fontSize: 26, color: theme.darkTextMuted }}>Ice cold · 2°C</span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 99,
                    backgroundColor: "rgba(255,255,255,0.10)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.round(thermalProgress * 100)}%`,
                      borderRadius: 99,
                      background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentSecondary})`,
                    }}
                  />
                </div>
              </div>

              <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.12)" }} />

              {/* Hot retention */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span
                    style={{
                      fontSize: 48,
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      color: theme.darkTextPrimary,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {displayHotHours}h
                  </span>
                  <span style={{ fontSize: 26, color: theme.darkTextMuted }}>Piping hot · 88°C</span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 99,
                    backgroundColor: "rgba(255,255,255,0.10)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.round(thermalProgress * 76)}%`,
                      borderRadius: 99,
                      backgroundColor: theme.darkTextPrimary,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 3 Staggered Minimal Hairline Feature Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {features.map((feat, idx) => {
                const rowSpring = spring({
                  frame: Math.max(0, featuresEnv.localFrame - 12 - idx * 6),
                  fps,
                  config: SPRING_EDITORIAL,
                  durationInFrames: Math.round(fps * 0.6),
                });
                const isActive = idx === activeFeatureIndex;

                return (
                  <div
                    key={`${feat.label}-${idx}`}
                    style={{
                      padding: "22px 26px",
                      borderRadius: 18,
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${
                        isActive ? `${theme.accentSecondary}88` : "rgba(255,255,255,0.11)"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 24,
                      opacity: interpolate(rowSpring, [0, 1], [0, 1]),
                      transform: `translateY(${interpolate(rowSpring, [0, 1], [20, 0])}px)`,
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 22,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          color: isActive ? theme.accentSecondary : theme.darkTextMuted,
                        }}
                      >
                        {feat.label}
                      </div>
                      <div
                        style={{
                          fontSize: 34,
                          fontWeight: 600,
                          letterSpacing: "-0.02em",
                          color: theme.darkTextPrimary,
                          lineHeight: 1.15,
                        }}
                      >
                        {feat.title}
                      </div>
                      <div
                        style={{
                          fontSize: 26,
                          color: theme.darkTextMuted,
                          lineHeight: 1.3,
                        }}
                      >
                        {feat.description}
                      </div>
                    </div>

                    <div
                      style={{
                        flexShrink: 0,
                        padding: "10px 18px",
                        borderRadius: 12,
                        backgroundColor: isActive
                          ? `${theme.accent}33`
                          : "rgba(255,255,255,0.06)",
                        border: `1px solid ${
                          isActive ? `${theme.accentSecondary}66` : "rgba(255,255,255,0.10)"
                        }`,
                        fontFamily: FONT_MONO,
                        fontSize: 28,
                        fontWeight: 700,
                        color: isActive ? theme.accentSecondary : theme.darkTextPrimary,
                      }}
                    >
                      {feat.metric}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ================================================================= */}
      {/* BEAT 4: GALLERY LIGHT RETURN + HIGH-CONTRAST CTA END CARD         */}
      {/* ================================================================= */}
      {ctaEnv.visible && (
        <AbsoluteFill
          style={{
            padding: "90px 120px",
            opacity: ctaEnv.opacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 840,
              right: 120,
              top: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 30,
            }}
          >
            {/* Brand mark + wordmark lockup */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: interpolate(ctaBrandSpring, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(ctaBrandSpring, [0, 1], [22, 0])}px)`,
              }}
            >
              {/* Minimalist geometric water-vessel mark */}
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 18,
                  backgroundColor: theme.lightTextPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width={34} height={34} viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 4C16 4 7 14.2 7 20.5C7 25.47 11.03 29.5 16 29.5C20.97 29.5 25 25.47 25 20.5C25 14.2 16 4 16 4Z"
                    stroke="#FAFAFA"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="11.5"
                    y1="21.5"
                    x2="20.5"
                    y2="21.5"
                    stroke={theme.accentSecondary}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div
                style={{
                  fontSize: 82,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: theme.lightTextPrimary,
                  lineHeight: 1.0,
                }}
              >
                {productName}
              </div>
            </div>

            {/* Clean 1-line positioning */}
            <div
              style={{
                fontSize: 44,
                fontWeight: 500,
                letterSpacing: "-0.025em",
                lineHeight: 1.25,
                color: theme.lightTextMuted,
                maxWidth: 820,
                opacity: interpolate(ctaBrandSpring, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(ctaBrandSpring, [0, 1], [18, 0])}px)`,
              }}
            >
              {ctaHeadline}
            </div>

            {/* High-contrast action + URL pills (held calm for X clicks) */}
            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
                opacity: interpolate(ctaPillSpring, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(ctaPillSpring, [0, 1], [18, 0])}px)`,
              }}
            >
              <div
                style={{
                  padding: "20px 38px",
                  borderRadius: 999,
                  backgroundColor: theme.lightTextPrimary,
                  color: "#FAFAFA",
                  fontSize: 30,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {ctaButtonText}
              </div>

              <div
                style={{
                  padding: "20px 34px",
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.85)",
                  border: "1.5px solid rgba(10,10,10,0.16)",
                  color: theme.lightTextPrimary,
                  fontFamily: FONT_MONO,
                  fontSize: 30,
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                }}
              >
                {ctaUrl}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
