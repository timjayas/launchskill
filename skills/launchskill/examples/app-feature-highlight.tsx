/**
 * Template 2: Precision DevTool Feature Highlight (18s, 1920x1080, FPS-agnostic)
 * Art Direction Preset: `precision-devtool` · Motion Temperament: `taut-mechanical`
 * Engine: Pure 2D + Macro Camera Rig + Clip-Path Wipe (zero neon clutter or floating 3D primitives)
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { FilmGrainOverlay } from "../templates/StudioPrimitives";
import {
  computeSecondarySettle,
  durSec,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  ensureStudioFonts,
  FONT_MONO,
  FONT_SANS,
  getNaturalTypedLength,
  sec,
  SPRING_EDITORIAL,
  SPRING_POP,
} from "../templates/motion";

export const appFeatureHighlightSchema = z.object({
  productName: z.string(),
  featureBadge: z.string(),
  hookLines: z.tuple([z.string(), z.string()]),
  commandText: z.string(),
  steps: z.tuple([z.string(), z.string(), z.string()]),
  resultBadge: z.string(),
  impactValue: z.number(),
  impactSuffix: z.string(),
  impactLabel: z.string(),
  ctaHeadline: z.string(),
  ctaUrl: z.string(),
  theme: z.object({
    bg: z.string(),
    surface: z.string(),
    border: z.string(),
    textPrimary: z.string(),
    textMuted: z.string(),
    accentTint: z.string(),
    success: z.string(),
  }),
});

export type AppFeatureHighlightProps = z.infer<typeof appFeatureHighlightSchema>;

export const defaultAppFeatureHighlightProps: AppFeatureHighlightProps = {
  productName: "Kova",
  featureBadge: "New in Kova 2.4",
  hookLines: ["One command.", "Zero busywork."],
  commandText: "sync sprint from #engineering",
  steps: ["Analyze PR threads & meeting notes", "Prioritize & assign 12 sprint tasks", "Publish diff to Linear & Slack"],
  resultBadge: "12 tasks synced in 1.2s",
  impactValue: 4.6,
  impactSuffix: " hrs",
  impactLabel: "saved per engineer every single week",
  ctaHeadline: "Try Instant Workflow Sync today.",
  ctaUrl: "kova.app/sync",
  theme: {
    bg: "#09090B",
    surface: "#121216",
    border: "rgba(255, 255, 255, 0.10)",
    textPrimary: "#FAFAFA",
    textMuted: "#8E8E98",
    accentTint: "#38BDF8",
    success: "#4ADE80",
  },
};

export const AppFeatureHighlightTemplate: React.FC<AppFeatureHighlightProps> = (props) => {
  ensureStudioFonts();
  const {
    productName,
    featureBadge,
    hookLines,
    commandText,
    steps,
    resultBadge,
    impactValue,
    impactSuffix,
    impactLabel,
    ctaHeadline,
    ctaUrl,
    theme,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 100% FPS-agnostic cut points (18s total)
  const fCmd = sec(2.0, fps);
  const fRun = sec(4.4, fps);
  const fZoom = sec(5.2, fps);
  const fImpact = sec(10.6, fps);
  const fCta = sec(14.0, fps);
  const wipeDur = sec(0.53, fps);

  // Shot 1: Hook arrival (already live on frame 0)
  const h1 = interpolate(frame, [0, sec(0.4, fps)], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const h2 = interpolate(frame, [sec(0.13, fps), sec(0.53, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Shot 2-3: Command palette typing + macro camera zoom
  const cmdLocal = frame - fCmd;
  const cmdEnter = spring({
    frame: Math.max(0, cmdLocal),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: durSec(0.6, fps),
  });
  const cmdInner = computeSecondarySettle(cmdLocal, 0, fps, 0.07, 6);
  const typedCount = getNaturalTypedLength(commandText, frame, fCmd + sec(0.33, fps), 24, fps);
  const typed = commandText.slice(0, typedCount);

  const zoomP = interpolate(frame, [fZoom, fZoom + sec(0.73, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const camScale = 1 + zoomP * 0.42;
  const camTy = -82 * ((camScale - 1) / camScale);

  const toastStart = fRun + sec(3.1, fps);
  const toastPop = spring({
    frame: Math.max(0, frame - toastStart),
    fps,
    config: SPRING_POP,
    durationInFrames: durSec(0.53, fps),
  });

  // Shot 4: Architectural clip-path curtain wipe + tabular counter
  const wipe = interpolate(frame, [fImpact, fImpact + wipeDur], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const statP = interpolate(frame, [fImpact + sec(0.27, fps), fImpact + sec(1.27, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const displayStat = (impactValue * statP).toFixed(1);

  // Shot 5: CTA settle
  const ctaEnter = spring({
    frame: Math.max(0, frame - fCta),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: durSec(0.6, fps),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: FONT_SANS, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          opacity: 0.45,
        }}
      />

      {/* SHOT 1: TIGHT HOOK */}
      {frame < fCmd && (
        <AbsoluteFill style={{ padding: "90px 120px", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ padding: "9px 20px", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${theme.border}`, fontFamily: FONT_MONO, fontSize: 22, color: theme.textMuted, marginBottom: 30 }}>
              {featureBadge}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 108, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, color: theme.textMuted, opacity: h1, transform: `translateY(${(1 - h1) * 48}px)` }}>
                {hookLines[0]}
              </div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 108, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, color: theme.textPrimary, opacity: h2, transform: `translateY(${(1 - h2) * 56}px)` }}>
                {hookLines[1]}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SHOTS 2-3: LIVE COMMAND PALETTE + MACRO ZOOM */}
      {frame >= fCmd && frame < fImpact + wipeDur && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "90px 120px",
            transform: `scale(${camScale}) translate3d(0, ${camTy}px, 0)`,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              width: 1180,
              borderRadius: 22,
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              boxShadow: "0 40px 110px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.08)",
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              opacity: cmdEnter,
              transform: `translateY(${(1 - cmdEnter) * 22}px) scale(${0.97 + cmdEnter * 0.03})`,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderRadius: 14, backgroundColor: "rgba(255,255,255,0.035)", border: `1px solid ${frame >= fRun ? "rgba(255,255,255,0.24)" : theme.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: FONT_MONO, fontSize: 28, color: theme.textPrimary }}>
                <span style={{ padding: "4px 10px", borderRadius: 8, backgroundColor: "rgba(255,255,255,0.08)", fontSize: 22, color: theme.textMuted }}>⌘K</span>
                <span>{typed}</span>
                {frame < fRun && <span style={{ width: 2.5, height: 30, backgroundColor: theme.accentTint }} />}
              </div>
              <span style={{ fontFamily: FONT_MONO, fontSize: 20, color: frame >= fRun ? theme.success : theme.textMuted }}>
                {frame >= fRun ? "RUNNING" : "ENTER ↵"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, transform: `translateY(${cmdInner.translateY}px)` }}>
              {steps.map((step, i) => {
                const doneFrame = fRun + sec(0.75 + i * 0.95, fps);
                const isDone = frame >= doneFrame;
                const checkPop = spring({
                  frame: Math.max(0, frame - doneFrame),
                  fps,
                  config: SPRING_POP,
                  durationInFrames: durSec(0.47, fps),
                });
                return (
                  <div
                    key={step}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "22px 26px",
                      borderRadius: 14,
                      backgroundColor: isDone ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.015)",
                      border: `1px solid ${isDone ? "rgba(255,255,255,0.18)" : theme.border}`,
                    }}
                  >
                    <span style={{ fontSize: 28, fontWeight: 500, color: isDone ? theme.textPrimary : theme.textMuted }}>{step}</span>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 22,
                        fontWeight: 600,
                        color: isDone ? theme.success : theme.textMuted,
                        transform: isDone ? `scale(${0.85 + checkPop * 0.15})` : "none",
                      }}
                    >
                      {isDone ? "✓ DONE" : "QUEUED"}
                    </span>
                  </div>
                );
              })}
            </div>

            {frame >= toastStart && (
              <div
                style={{
                  alignSelf: "flex-end",
                  padding: "12px 22px",
                  borderRadius: 12,
                  backgroundColor: theme.textPrimary,
                  color: theme.bg,
                  fontFamily: FONT_MONO,
                  fontSize: 23,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                  opacity: toastPop,
                  transform: `translateY(${(1 - toastPop) * 10}px)`,
                }}
              >
                {resultBadge}
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* SHOT 4: CLIP-PATH CURTAIN WIPE -> IMPACT METRIC */}
      {frame >= fImpact && frame < fCta && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FAFAFA",
            clipPath: `inset(0 0 ${wipe}% 0)`,
            padding: "90px 120px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 176, fontWeight: 700, letterSpacing: "-0.05em", color: "#09090B", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {displayStat}
              <span style={{ color: "#737373" }}>{impactSuffix}</span>
            </div>
            <div style={{ fontSize: 40, fontWeight: 500, color: "#52525B", marginTop: 18, letterSpacing: "-0.02em" }}>
              {impactLabel}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SHOT 5: HARD BEAT-CUT -> MONOCHROME CTA */}
      {frame >= fCta && (
        <AbsoluteFill style={{ padding: "90px 120px", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: ctaEnter, transform: `translateY(${(1 - ctaEnter) * 16}px)` }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 26, fontWeight: 600, color: theme.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {productName}
            </div>
            <div style={{ fontSize: 78, fontWeight: 600, color: theme.textPrimary, letterSpacing: "-0.035em", maxWidth: 1200 }}>
              {ctaHeadline}
            </div>
            <div style={{ marginTop: 8, padding: "18px 36px", borderRadius: 999, backgroundColor: theme.textPrimary, color: theme.bg, fontFamily: FONT_MONO, fontSize: 28, fontWeight: 600 }}>
              {ctaUrl}
            </div>
          </div>
        </AbsoluteFill>
      )}

      <FilmGrainOverlay frame={frame} fps={fps} opacity={0.028} />
    </AbsoluteFill>
  );
};
