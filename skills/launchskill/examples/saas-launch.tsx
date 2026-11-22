/**
 * Template 1: Editorial SaaS Launch (24s / 48 beats @ 120 BPM, 1920x1080, FPS-agnostic)
 * Art Direction Preset: `editorial-gallery` · Motion Temperament: `editorial-fluid`
 * Engine: Pure 2D + Deterministic Macro Camera Rig (zero decorative 3D clutter)
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { FilmGrainOverlay } from "../templates/StudioPrimitives";
import {
  computeSecondarySettle,
  createBeatGrid,
  durSec,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  ensureStudioFonts,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  getCaretOpacity,
  getNaturalTypedLength,
  sec,
  SPRING_EDITORIAL,
  SPRING_POP,
} from "../templates/motion";

export const saasLaunchSchema = z.object({
  productName: z.string(),
  badge: z.string(),
  hookLine1: z.string(),
  hookLine2Prefix: z.string(),
  hookLine2Serif: z.string(),
  tagline: z.string(),
  promptPrefix: z.string(),
  entityChip: z.string(),
  promptSuffix: z.string(),
  actionLabel: z.string(),
  resultCards: z.tuple([
    z.object({ label: z.string(), title: z.string(), value: z.string() }),
    z.object({ label: z.string(), title: z.string(), value: z.string() }),
    z.object({ label: z.string(), title: z.string(), value: z.string() }),
  ]),
  darkHeadline: z.tuple([z.string(), z.string()]),
  heroMetricValue: z.number(),
  heroMetricSuffix: z.string(),
  heroMetricLabel: z.string(),
  features: z.tuple([
    z.object({ label: z.string(), title: z.string(), metric: z.string() }),
    z.object({ label: z.string(), title: z.string(), metric: z.string() }),
    z.object({ label: z.string(), title: z.string(), metric: z.string() }),
  ]),
  statementLeft: z.string(),
  statementRight: z.string(),
  ctaHeadline: z.string(),
  ctaButtonText: z.string(),
  ctaUrl: z.string(),
  bpm: z.number().min(90).max(145),
  theme: z.object({
    lightBg: z.string(),
    lightSurface: z.string(),
    lightTextPrimary: z.string(),
    lightTextMuted: z.string(),
    darkBg: z.string(),
    darkSurface: z.string(),
    darkTextPrimary: z.string(),
    darkTextMuted: z.string(),
    accent: z.string(),
    washWarm: z.string(),
    washCool: z.string(),
  }),
});

export type SaasLaunchProps = z.infer<typeof saasLaunchSchema>;

export const defaultSaasLaunchProps: SaasLaunchProps = {
  productName: "Pulseflow",
  badge: "Introducing Pulseflow 2.0",
  hookLine1: "Ship releases in minutes,",
  hookLine2Prefix: "not ",
  hookLine2Serif: "quarters.",
  tagline: "Automated release telemetry, canary gates, and instant rollbacks.",
  promptPrefix: "Deploy ",
  entityChip: "@checkout-api",
  promptSuffix: " with automated p99 health gate",
  actionLabel: "Ship release",
  resultCards: [
    { label: "CANARY GATE", title: "Latency p99 verified", value: "38 ms" },
    { label: "TRACE DIFF", title: "Zero regressions found", value: "100%" },
    { label: "ROLLBACK", title: "Instant state snapshot", value: "Ready" },
  ],
  darkHeadline: ["Built for teams", "that ship daily."],
  heroMetricValue: 400,
  heroMetricSuffix: "ms",
  heroMetricLabel: "median anomaly detection across global edges",
  features: [
    { label: "AUTOMATION", title: "Zero-config CI/CD release gates", metric: "10× faster" },
    { label: "OBSERVABILITY", title: "Real-time trace diff on every deploy", metric: "< 400ms" },
    { label: "RELIABILITY", title: "Deterministic one-click global rollback", metric: "99.98%" },
  ],
  statementLeft: "Less firefighting.",
  statementRight: "More shipping.",
  ctaHeadline: "Release software with calm confidence.",
  ctaButtonText: "Start free",
  ctaUrl: "pulseflow.dev",
  bpm: 120,
  theme: {
    lightBg: "#F7F7F5",
    lightSurface: "#FFFFFF",
    lightTextPrimary: "#0A0A0A",
    lightTextMuted: "#737373",
    darkBg: "#09090B",
    darkSurface: "#141418",
    darkTextPrimary: "#FAFAFA",
    darkTextMuted: "#8E8E98",
    accent: "#2563EB",
    washWarm: "#FDBA74",
    washCool: "#93C5FD",
  },
};

export const SaasLaunchTemplate: React.FC<SaasLaunchProps> = (props) => {
  ensureStudioFonts();
  const {
    productName,
    badge,
    hookLine1,
    hookLine2Prefix,
    hookLine2Serif,
    tagline,
    promptPrefix,
    entityChip,
    promptSuffix,
    actionLabel,
    resultCards,
    darkHeadline,
    heroMetricValue,
    heroMetricSuffix,
    heroMetricLabel,
    features,
    statementLeft,
    statementRight,
    ctaHeadline,
    ctaButtonText,
    ctaUrl,
    bpm,
    theme,
  } = props;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = createBeatGrid(bpm, fps);

  const bWorkspace = g.beat(5);
  const bMacroIn = g.beat(12);
  const bClick = g.beat(16);
  const bPullOut = g.beat(20);
  const bDark = g.beat(26);
  const bStatement = g.beat(36);
  const bCta = g.beat(40);

  // Deliberate palette inversion for Dark Chapter (Beats 26 -> 36)
  const darkIn = interpolate(frame, [bDark - sec(0.17, fps), bDark + sec(0.33, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const darkOut = frame >= bStatement ? 1 : 0;
  const darkProgress = Math.max(0, darkIn - darkOut);
  const bgColor = interpolateColors(darkProgress, [0, 1], [theme.lightBg, theme.darkBg]);

  // Macro Camera Rig envelope inside Workspace scene
  const zoomIn = interpolate(frame, [bMacroIn, bMacroIn + sec(0.67, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const zoomOut = interpolate(frame, [bPullOut, bPullOut + sec(0.73, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const macroFactor = Math.max(0, zoomIn - zoomOut);
  const camZoom = 1 + macroFactor * 0.72;
  const panFactor = (camZoom - 1) / camZoom;
  const camTx = -340 * panFactor;
  const camTy = 75 * panFactor;

  // Shot 1: Frame-0 Hook progress (already alive at frame 0)
  const hook1 = interpolate(frame, [0, sec(0.47, fps)], [0.38, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const hook2 = interpolate(frame, [sec(0.13, fps), sec(0.63, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const hookSub = interpolate(frame, [sec(0.33, fps), sec(0.87, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Shot 2-4: Live Workspace typing, cursor & click payoff
  const wsLocal = frame - bWorkspace;
  const wsEnter = spring({
    frame: Math.max(0, wsLocal),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: durSec(0.67, fps),
  });
  const typeStart = bWorkspace + sec(0.33, fps);
  const typedPrefix = promptPrefix.slice(0, getNaturalTypedLength(promptPrefix, frame, typeStart, 28, fps));
  const chipStart = bWorkspace + sec(0.8, fps);
  const chipPop = spring({
    frame: Math.max(0, frame - chipStart),
    fps,
    config: SPRING_POP,
    durationInFrames: durSec(0.53, fps),
  });
  const typedSuffix = promptSuffix.slice(
    0,
    getNaturalTypedLength(promptSuffix, frame, chipStart + sec(0.27, fps), 30, fps)
  );
  const isTyping = frame >= typeStart && typedSuffix.length < promptSuffix.length;
  const caretOpacity = getCaretOpacity(frame, isTyping, fps);

  // Deterministic Bezier Cursor glide -> anticipation pause -> click
  const cursorStart = bMacroIn + sec(0.47, fps);
  const cursorArrive = bClick - sec(0.13, fps);
  const ct = interpolate(frame, [cursorStart, cursorArrive], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const cFrom = { x: 1120, y: 690 };
  const cTo = { x: 1355, y: 458 };
  const cCtrl = { x: 1275, y: 520 };
  const invT = 1 - ct;
  const cursorX = invT * invT * cFrom.x + 2 * invT * ct * cCtrl.x + ct * ct * cTo.x;
  const cursorY = invT * invT * cFrom.y + 2 * invT * ct * cCtrl.y + ct * ct * cTo.y;
  const clickScale = interpolate(
    frame,
    [bClick, bClick + sec(0.1, fps), bClick + sec(0.27, fps)],
    [1, 0.88, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const isClicked = frame >= bClick + sec(0.07, fps);
  const rippleP = interpolate(frame, [bClick, bClick + sec(0.5, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Shot 5: Dark chapter counter
  const darkLocal = frame - bDark;
  const metricP = interpolate(darkLocal, [sec(0.2, fps), sec(1.2, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const displayMetric = Math.round(heroMetricValue * metricP);

  // Shot 6: Inline reflow pop
  const stmtLocal = frame - bStatement;
  const inlinePop = spring({
    frame: Math.max(0, stmtLocal - sec(0.33, fps)),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: durSec(0.67, fps),
  });

  // Shot 7: CTA settle + secondary follow-through
  const ctaLocal = frame - bCta;
  const ctaEnter = spring({
    frame: Math.max(0, ctaLocal),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: durSec(0.67, fps),
  });
  const ctaButtonsFollow = computeSecondarySettle(ctaLocal, 0, fps, 0.09, 10);

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, fontFamily: FONT_SANS, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            darkProgress < 0.5
              ? `radial-gradient(circle at 78% 22%, ${theme.washWarm}2E 0%, transparent 45%), radial-gradient(circle at 18% 80%, ${theme.washCool}2C 0%, transparent 48%)`
              : `radial-gradient(circle at 22% 30%, ${theme.accent}24 0%, transparent 45%)`,
        }}
      />

      {/* SHOT 1: FRAME-0 EDITORIAL GALLERY HOOK */}
      {frame < bWorkspace && (
        <AbsoluteFill style={{ padding: "90px 120px", justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 1420 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 22px",
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.78)",
                border: "1px solid rgba(10,10,10,0.09)",
                fontSize: 26,
                fontWeight: 500,
                color: theme.lightTextPrimary,
                marginBottom: 34,
              }}
            >
              <span style={{ width: 9, height: 9, borderRadius: 99, backgroundColor: theme.accent }} />
              {badge}
            </div>

            <div style={{ overflow: "hidden", paddingBottom: 6 }}>
              <div
                style={{
                  fontSize: 104,
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.04,
                  color: theme.lightTextMuted,
                  transform: `translateY(${interpolate(hook1, [0, 1], [54, 0])}px)`,
                  opacity: hook1,
                }}
              >
                {hookLine1}
              </div>
            </div>

            <div style={{ overflow: "hidden", paddingBottom: 10 }}>
              <div
                style={{
                  fontSize: 104,
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.04,
                  color: theme.lightTextPrimary,
                  transform: `translateY(${interpolate(hook2, [0, 1], [62, 0])}px)`,
                  opacity: hook2,
                }}
              >
                {hookLine2Prefix}
                <span style={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 118, letterSpacing: "-0.02em" }}>
                  {hookLine2Serif}
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: 28,
                fontSize: 36,
                fontWeight: 400,
                color: theme.lightTextMuted,
                maxWidth: 980,
                lineHeight: 1.38,
                opacity: hookSub,
                transform: `translateY(${interpolate(hookSub, [0, 1], [16, 0])}px)`,
              }}
            >
              {tagline}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SHOTS 2-4: LIVE WORKSPACE + MACRO CAMERA RIG */}
      {frame >= bWorkspace && frame < bDark && (
        <AbsoluteFill
          style={{
            transform: `scale(${camZoom}) translate3d(${camTx}px, ${camTy}px, 0)`,
            transformOrigin: "center center",
            justifyContent: "center",
            alignItems: "center",
            padding: "90px 120px",
          }}
        >
          <div
            style={{
              width: 1460,
              borderRadius: 26,
              backgroundColor: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(10,10,10,0.09)",
              boxShadow: "0 36px 96px rgba(10,10,10,0.08)",
              padding: 40,
              display: "flex",
              flexDirection: "column",
              gap: 32,
              opacity: wsEnter,
              transform: `translateY(${interpolate(wsEnter, [0, 1], [24, 0])}px) scale(${interpolate(wsEnter, [0, 1], [0.97, 1])})`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(10,10,10,0.08)", paddingBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: theme.lightTextPrimary, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 }}>
                  {productName.slice(0, 1)}
                </div>
                <span style={{ fontSize: 26, fontWeight: 600, color: theme.lightTextPrimary, letterSpacing: "-0.02em" }}>{productName} Studio</span>
              </div>
              <span style={{ fontFamily: FONT_MONO, fontSize: 22, color: isClicked ? "#059669" : theme.lightTextMuted }}>
                {isClicked ? "● VERIFIED · LIVE" : "READY"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                padding: "18px 22px 18px 28px",
                borderRadius: 18,
                backgroundColor: "#F9F9F8",
                border: `1px solid ${isClicked ? theme.accent : "rgba(10,10,10,0.11)"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, fontSize: 30, fontWeight: 500, color: theme.lightTextPrimary, letterSpacing: "-0.015em" }}>
                <span>{typedPrefix}</span>
                {frame >= chipStart && (
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "4px 14px",
                      borderRadius: 10,
                      backgroundColor: `${theme.accent}18`,
                      color: theme.accent,
                      fontFamily: FONT_MONO,
                      fontSize: 25,
                      fontWeight: 600,
                      transform: `scale(${interpolate(chipPop, [0, 1], [0.75, 1])})`,
                      opacity: chipPop,
                    }}
                  >
                    {entityChip}
                  </span>
                )}
                <span>{typedSuffix}</span>
                {!isClicked && (
                  <span style={{ width: 3, height: 34, backgroundColor: theme.accent, opacity: caretOpacity, borderRadius: 2 }} />
                )}
              </div>

              <div
                style={{
                  flexShrink: 0,
                  padding: "16px 30px",
                  borderRadius: 14,
                  backgroundColor: isClicked ? "#059669" : theme.lightTextPrimary,
                  color: "#FFFFFF",
                  fontSize: 25,
                  fontWeight: 600,
                  transform: `scale(${clickScale})`,
                }}
              >
                {isClicked ? "✓ Shipped" : actionLabel}
              </div>
            </div>

            {/* System Payoff Cards (Outer container settles at t, inner metric follows +0.08s) */}
            <div style={{ display: "flex", gap: 22, minHeight: 220 }}>
              {resultCards.map((card, idx) => {
                const cardStart = bClick + sec(0.2 + idx * 0.16, fps);
                const cp = spring({
                  frame: Math.max(0, frame - cardStart),
                  fps,
                  config: SPRING_EDITORIAL,
                  durationInFrames: durSec(0.6, fps),
                });
                const inner = computeSecondarySettle(frame, cardStart, fps, 0.08, 8);
                const revealed = frame >= bClick + sec(0.17, fps);
                return (
                  <div
                    key={card.label}
                    style={{
                      flex: 1,
                      borderRadius: 18,
                      padding: 28,
                      backgroundColor: revealed ? "#FFFFFF" : "#F3F3F1",
                      border: "1px solid rgba(10,10,10,0.08)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      opacity: revealed ? cp : 0.45,
                      transform: revealed ? `translateY(${interpolate(cp, [0, 1], [18, 0])}px)` : "none",
                    }}
                  >
                    <div style={{ transform: revealed ? `translateY(${inner.translateY}px)` : "none" }}>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 600, color: theme.accent, letterSpacing: "0.06em" }}>
                        {card.label}
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 600, color: theme.lightTextPrimary, marginTop: 10 }}>
                        {card.title}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 44,
                        fontWeight: 700,
                        color: theme.lightTextPrimary,
                        letterSpacing: "-0.03em",
                        fontVariantNumeric: "tabular-nums",
                        transform: revealed ? `translateY(${inner.translateY}px)` : "none",
                      }}
                    >
                      {card.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {frame >= cursorStart && frame < bPullOut + sec(0.2, fps) && (
            <div style={{ position: "absolute", left: 0, top: 0, transform: `translate3d(${cursorX}px, ${cursorY}px, 0)`, pointerEvents: "none" }}>
              {frame >= bClick && rippleP < 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: -24,
                    top: -24,
                    width: 48,
                    height: 48,
                    borderRadius: 999,
                    border: `2px solid ${theme.accent}`,
                    transform: `scale(${0.35 + rippleP * 1.4})`,
                    opacity: (1 - rippleP) * 0.7,
                  }}
                />
              )}
              <svg width={34} height={34} viewBox="0 0 24 24" style={{ transform: `scale(${clickScale})`, transformOrigin: "top left", filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.22))" }}>
                <path d="M5.5 3.2L19.2 12.1L12.6 13.5L9.4 19.6L5.5 3.2Z" fill="#0A0A0A" stroke="#FFFFFF" strokeWidth={1.6} strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* SHOT 5: INTENTIONAL DARK CHAPTER PROOF */}
      {frame >= bDark && frame < bStatement && (
        <AbsoluteFill style={{ padding: "90px 120px", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 72, width: "100%" }}>
            <div style={{ flex: 0.95, display: "flex", flexDirection: "column", gap: 28 }}>
              <div>
                <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.06, color: theme.darkTextMuted }}>
                  {darkHeadline[0]}
                </div>
                <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.06, color: theme.darkTextPrimary }}>
                  {darkHeadline[1]}
                </div>
              </div>

              <div style={{ marginTop: 12, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ fontSize: 108, fontWeight: 700, letterSpacing: "-0.045em", color: theme.darkTextPrimary, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                  &lt; {displayMetric}
                  <span style={{ color: theme.darkTextMuted, fontSize: 64 }}>{heroMetricSuffix}</span>
                </div>
                <div style={{ marginTop: 12, fontSize: 30, color: theme.darkTextMuted }}>{heroMetricLabel}</div>
              </div>
            </div>

            <div style={{ flex: 1.05, display: "flex", flexDirection: "column", gap: 18 }}>
              {features.map((f, idx) => {
                const rowStart = sec(0.27 + idx * 0.2, fps);
                const rp = spring({
                  frame: Math.max(0, darkLocal - rowStart),
                  fps,
                  config: SPRING_EDITORIAL,
                  durationInFrames: durSec(0.6, fps),
                });
                const inner = computeSecondarySettle(darkLocal, rowStart, fps, 0.08, 8);
                return (
                  <div
                    key={f.label}
                    style={{
                      padding: "28px 32px",
                      borderRadius: 20,
                      backgroundColor: theme.darkSurface,
                      border: "1px solid rgba(255,255,255,0.10)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 24,
                      opacity: rp,
                      transform: `translateY(${interpolate(rp, [0, 1], [20, 0])}px)`,
                    }}
                  >
                    <div style={{ transform: `translateY(${inner.translateY}px)` }}>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 600, color: theme.darkTextMuted, letterSpacing: "0.08em" }}>
                        {f.label}
                      </div>
                      <div style={{ fontSize: 32, fontWeight: 600, color: theme.darkTextPrimary, marginTop: 8, letterSpacing: "-0.02em" }}>
                        {f.title}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 28,
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                        color: theme.darkTextPrimary,
                        padding: "10px 18px",
                        borderRadius: 12,
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        flexShrink: 0,
                      }}
                    >
                      {f.metric}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SHOT 6: EDITORIAL STATEMENT + INLINE REFLOW */}
      {frame >= bStatement && frame < bCta && (
        <AbsoluteFill style={{ padding: "90px 120px", justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 88, fontWeight: 600, letterSpacing: "-0.04em", color: theme.lightTextPrimary }}>
            <span style={{ color: theme.lightTextMuted }}>{statementLeft}</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: interpolate(inlinePop, [0, 1], [0, 96]),
                height: 96,
                margin: `0 ${interpolate(inlinePop, [0, 1], [0, 26])}px`,
                borderRadius: 24,
                backgroundColor: theme.lightTextPrimary,
                color: "#FFFFFF",
                fontSize: 44,
                fontWeight: 700,
                transform: `scale(${interpolate(inlinePop, [0, 1], [0.4, 1])})`,
                opacity: inlinePop,
                overflow: "hidden",
              }}
            >
              {productName.slice(0, 1)}
            </span>
            <span>{statementRight}</span>
          </div>
        </AbsoluteFill>
      )}

      {/* SHOT 7: MUSEUM-MARGIN CTA END CARD */}
      {frame >= bCta && (
        <AbsoluteFill style={{ padding: "90px 120px", justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 30,
              opacity: ctaEnter,
              transform: `translateY(${interpolate(ctaEnter, [0, 1], [18, 0])}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 15, backgroundColor: theme.lightTextPrimary, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>
                {productName.slice(0, 1)}
              </div>
              <span style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.03em", color: theme.lightTextPrimary }}>{productName}</span>
            </div>

            <div style={{ fontSize: 78, fontWeight: 600, letterSpacing: "-0.035em", color: theme.lightTextPrimary, maxWidth: 1180, lineHeight: 1.08 }}>
              {ctaHeadline}
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 8,
                opacity: ctaButtonsFollow.opacity,
                transform: `translateY(${ctaButtonsFollow.translateY}px)`,
              }}
            >
              <div style={{ padding: "18px 36px", borderRadius: 999, backgroundColor: theme.lightTextPrimary, color: "#FFFFFF", fontSize: 28, fontWeight: 600 }}>
                {ctaButtonText}
              </div>
              <div style={{ padding: "18px 34px", borderRadius: 999, backgroundColor: "#FFFFFF", border: "1px solid rgba(10,10,10,0.12)", color: theme.lightTextPrimary, fontFamily: FONT_MONO, fontSize: 26, fontWeight: 500 }}>
                {ctaUrl}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      <FilmGrainOverlay frame={frame} fps={fps} opacity={0.025} />
    </AbsoluteFill>
  );
};
