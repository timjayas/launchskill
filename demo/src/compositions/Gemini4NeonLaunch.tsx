/**
 * Gemini 4 Neon — Studio X Product Launch Video (24s / 720 frames @ 30fps, 120 BPM, 1920x1080)
 * Art Direction Preset: `editorial-gallery` (100% cohesive studio gallery paper `#F7F7F5` throughout)
 * Engine: Pure 2D + Deterministic Macro Camera Rig (zero dark-mode AI slop, 100% frame-driven)
 *
 * Beat-Locked Multi-Shot Arc (120 BPM = 15 frames/beat @ 30fps, 48 beats total):
 *   1. Beats  0–5  (2.5s): Frame-0 gallery-light editorial hook + italic serif accent (live on frame 0)
 *   2. Beats  5–12 (3.5s): Hard beat-cut -> orthogonal Gemini Studio + natural typing + @entity chip
 *   3. Beats 12–20 (4.0s): Macro Camera Rig push (1.0x -> 1.48x) + Bezier cursor glide, anticipation & click
 *   4. Beats 20–26 (3.0s): Camera pull-out -> live reasoning trace + 3 verified execution payoff cards
 *   5. Beats 26–36 (5.0s): Cohesive gallery-light Multimodal Context Sweep (2.0M) + Live Atomic Diff verification
 *   6. Beats 36–40 (2.0s): Beat-locked hard cut -> editorial statement reset + inline Gemini star reflow
 *   7. Beats 40–48 (4.0s): Beat-locked hard cut -> museum-whitespace brand lockup + high-contrast URL CTA
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const gemini4NeonSchema = z.object({
  productName: z.string(),
  badge: z.string(),
  modelPill: z.string(),
  hookLine1: z.string(),
  hookLine2Prefix: z.string(),
  hookLine2Serif: z.string(),
  tagline: z.string(),
  promptPrefix: z.string(),
  entityChip: z.string(),
  promptSuffix: z.string(),
  actionLabel: z.string(),
  actionDoneLabel: z.string(),
  reasoningTrace: z.string(),
  resultCards: z.tuple([
    z.object({ label: z.string(), title: z.string(), value: z.string() }),
    z.object({ label: z.string(), title: z.string(), value: z.string() }),
    z.object({ label: z.string(), title: z.string(), value: z.string() }),
  ]),
  chapterHeadlineMuted: z.string(),
  chapterHeadlinePrefix: z.string(),
  chapterHeadlineSerif: z.string(),
  contextWindowValue: z.number(),
  contextWindowSuffix: z.string(),
  ttftSpec: z.string(),
  modalities: z.tuple([
    z.object({ kind: z.string(), detail: z.string(), spans: z.string() }),
    z.object({ kind: z.string(), detail: z.string(), spans: z.string() }),
    z.object({ kind: z.string(), detail: z.string(), spans: z.string() }),
    z.object({ kind: z.string(), detail: z.string(), spans: z.string() }),
  ]),
  diffFileName: z.string(),
  diffRemovedLine: z.string(),
  diffAddedLines: z.tuple([z.string(), z.string(), z.string()]),
  diffFooterPending: z.string(),
  diffFooterVerified: z.string(),
  statementLeft: z.string(),
  statementRightPrefix: z.string(),
  statementRightSerif: z.string(),
  ctaHeadlinePrefix: z.string(),
  ctaHeadlineSerif: z.string(),
  ctaButtonText: z.string(),
  ctaUrl: z.string(),
  bpm: z.number().min(96).max(144),
  musicSrc: z.string(),
  musicVolume: z.number().min(0).max(1),
  theme: z.object({
    lightBg: z.string(),
    lightSurface: z.string(),
    lightTextPrimary: z.string(),
    lightTextMuted: z.string(),
    accent: z.string(),
    success: z.string(),
    washCool: z.string(),
    washIris: z.string(),
    washWarm: z.string(),
  }),
});

export type Gemini4NeonProps = z.infer<typeof gemini4NeonSchema>;

export const defaultGemini4NeonProps: Gemini4NeonProps = {
  productName: "Gemini 4 Neon",
  badge: "Introducing Gemini 4 Neon",
  modelPill: "gemini-4-neon · high",
  hookLine1: "Deep reasoning,",
  hookLine2Prefix: "in ",
  hookLine2Serif: "real time.",
  tagline: "Native multimodal intelligence, 2M token context, and verified autonomous execution.",
  promptPrefix: "Refactor ",
  entityChip: "@payments-core",
  promptSuffix: " and verify zero-downtime migration",
  actionLabel: "Run Neon",
  actionDoneLabel: "Verified",
  reasoningTrace: "Thought 0.4s  ·  Analyzed 18 modules  ·  42 / 42 checks passed",
  resultCards: [
    { label: "REASONING", title: "Multi-file plan synthesized", value: "0.4 s" },
    { label: "VERIFIED DIFF", title: "Zero regressions in suite", value: "42 / 42" },
    { label: "THROUGHPUT", title: "Native Neon decoding", value: "248 t/s" },
  ],
  chapterHeadlineMuted: "One context.",
  chapterHeadlinePrefix: "Every ",
  chapterHeadlineSerif: "modality.",
  contextWindowValue: 2.0,
  contextWindowSuffix: "M tokens",
  ttftSpec: "180 ms TTFT",
  modalities: [
    { kind: "CODEBASE", detail: "142 TypeScript & SQL modules", spans: "1.12M" },
    { kind: "VIDEO", detail: "4K checkout flow recording", spans: "480K" },
    { kind: "AUDIO", detail: "Live incident call transcript", spans: "240K" },
    { kind: "DOCS", detail: "RFC specs & migration runbook", spans: "160K" },
  ],
  diffFileName: "payments-core/migrate.ts",
  diffRemovedLine: '- lockTable("orders");',
  diffAddedLines: [
    '+ shadowWrite("orders_v2");',
    "+ verifyParity({ zeroDrop: true });",
    '+ cutoverAtomic("live");',
  ],
  diffFooterPending: "Running 42 integration checks...",
  diffFooterVerified: "✓ 42 / 42 checks passed  ·  0 ms downtime",
  statementLeft: "Think deeper.",
  statementRightPrefix: "Ship ",
  statementRightSerif: "faster.",
  ctaHeadlinePrefix: "Intelligence at the speed of ",
  ctaHeadlineSerif: "thought.",
  ctaButtonText: "Try Gemini 4 Neon",
  ctaUrl: "deepmind.google/gemini",
  bpm: 120,
  musicSrc: "",
  musicVolume: 0.28,
  theme: {
    lightBg: "#F7F7F5",
    lightSurface: "#FFFFFF",
    lightTextPrimary: "#0A0A0A",
    lightTextMuted: "#6F6F75",
    accent: "#2563EB",
    success: "#059669",
    washCool: "#93C5FD",
    washIris: "#C4B5FD",
    washWarm: "#FDBA74",
  },
};

export const getGemini4NeonTotalFrames = (bpm: number, fps: number): number => {
  const seconds = (48 * 60) / bpm;
  const clamped = Math.min(45, Math.max(15, seconds));
  return Math.round(clamped * fps);
};

// --- Studio Webfont Loader (zero extra deps, deterministic delayRender with offline fallback) ---
let geminiFontsStarted = false;
const ensureGeminiFonts = () => {
  if (geminiFontsStarted || typeof document === "undefined") return;
  geminiFontsStarted = true;
  const handle = delayRender("Load Inter, Instrument Serif, JetBrains Mono");
  const done = () => continueRender(handle);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap";
  document.head.appendChild(link);

  Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ]).then(done, done);
};

const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_SERIF = "'Instrument Serif', Georgia, serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

const SPRING_EDITORIAL = { damping: 28, stiffness: 180, mass: 0.9 };
const SPRING_POP = { damping: 20, stiffness: 235, mass: 0.74 };
const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN_OUT_QUINT = Easing.bezier(0.83, 0, 0.17, 1);

/** Deterministic natural-cadence typewriter with subtle pauses at spaces & punctuation */
const getNaturalTypedLength = (
  text: string,
  frame: number,
  startFrame: number,
  charsPerSecond: number,
  fps: number
): number => {
  if (frame <= startFrame) return 0;
  const elapsed = frame - startFrame;
  const baseFramesPerChar = fps / charsPerSecond;
  let i = 0;
  let acc = 0;
  while (i < text.length) {
    const ch = text[i];
    const weight =
      ch === " " ? 1.55 : ch === "," || ch === "." ? 2.3 : 0.84 + ((i * 7) % 5) * 0.08;
    acc += baseFramesPerChar * weight;
    if (acc > elapsed) break;
    i++;
  }
  return i;
};

/** Clean architectural 4-point Gemini star SVG (never emoji) */
const GeminiStarMark: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path
      d="M16 1.5C16.9 10.2 21.8 15.1 30.5 16C21.8 16.9 16.9 21.8 16 30.5C15.1 21.8 10.2 16.9 1.5 16C10.2 15.1 15.1 10.2 16 1.5Z"
      fill={color}
    />
  </svg>
);

/** Deterministic 3.4% film grain overlay to eliminate 8-bit & X H.264 gradient banding */
const FilmGrainOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const seed = Math.floor(frame / 2) % 24;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.034, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`g4n-grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.78"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g4n-grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// Deterministic attention span segment widths per modality track (pure visual data, zero Math.random)
const MODALITY_SEGMENTS: Array<Array<{ left: number; width: number; keySpan?: boolean }>> = [
  [
    { left: 2, width: 18 },
    { left: 23, width: 28, keySpan: true },
    { left: 54, width: 22 },
    { left: 79, width: 19, keySpan: true },
  ],
  [
    { left: 6, width: 26, keySpan: true },
    { left: 36, width: 20 },
    { left: 60, width: 32, keySpan: true },
  ],
  [
    { left: 10, width: 16 },
    { left: 30, width: 34, keySpan: true },
    { left: 68, width: 24 },
  ],
  [
    { left: 4, width: 24 },
    { left: 32, width: 18 },
    { left: 55, width: 36, keySpan: true },
  ],
];

export const Gemini4NeonLaunch: React.FC<Gemini4NeonProps> = (props) => {
  ensureGeminiFonts();

  const {
    productName,
    badge,
    modelPill,
    hookLine1,
    hookLine2Prefix,
    hookLine2Serif,
    tagline,
    promptPrefix,
    entityChip,
    promptSuffix,
    actionLabel,
    actionDoneLabel,
    reasoningTrace,
    resultCards,
    chapterHeadlineMuted,
    chapterHeadlinePrefix,
    chapterHeadlineSerif,
    contextWindowValue,
    contextWindowSuffix,
    ttftSpec,
    modalities,
    diffFileName,
    diffRemovedLine,
    diffAddedLines,
    diffFooterPending,
    diffFooterVerified,
    statementLeft,
    statementRightPrefix,
    statementRightSerif,
    ctaHeadlinePrefix,
    ctaHeadlineSerif,
    ctaButtonText,
    ctaUrl,
    bpm,
    musicSrc,
    musicVolume,
    theme,
  } = props;

  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Deterministic BPM beat-grid (120 BPM = 15 frames/beat @ 30fps)
  const beat = (n: number) => Math.round(n * (60 / bpm) * fps);

  const bWorkspace = beat(5); // 2.5s (f75)
  const bMacroIn = beat(12); // 6.0s (f180)
  const bClick = beat(16); // 8.0s (f240)
  const bPullOut = beat(20); // 10.0s (f300)
  const bMultimodal = beat(26); // 13.0s (f390)
  const bStatement = beat(36); // 18.0s (f540)
  const bCta = beat(40); // 20.0s (f600)

  // --- Shot 1: Frame-0 Editorial Hook (already mid-arrival at frame 0) ---
  const hookBadge = interpolate(frame, [0, 10], [0.55, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const hook1 = interpolate(frame, [0, 14], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const hook2 = interpolate(frame, [4, 19], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const hookSub = interpolate(frame, [10, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // --- Shots 2-4: Macro Camera Rig + Live Gemini Studio ---
  const wsLocal = frame - bWorkspace;
  const wsEnter = spring({
    frame: Math.max(0, wsLocal),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: 20,
  });

  const zoomIn = interpolate(frame, [bMacroIn, bMacroIn + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const zoomOut = interpolate(frame, [bPullOut, bPullOut + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const macroFactor = Math.max(0, zoomIn - zoomOut);
  const camZoom = 1 + macroFactor * 0.48; // 1.0 -> 1.48 -> 1.0 (keeps @entity chip & CTA cleanly in frame)
  const panFactor = (camZoom - 1) / camZoom;
  const camTx = -195 * panFactor;
  const camTy = 78 * panFactor;

  // Natural typing + @entity chip pop
  const typedPrefix = promptPrefix.slice(
    0,
    getNaturalTypedLength(promptPrefix, frame, bWorkspace + 10, 28, fps)
  );
  const chipStart = bWorkspace + 24;
  const chipPop = spring({
    frame: Math.max(0, frame - chipStart),
    fps,
    config: SPRING_POP,
    durationInFrames: 16,
  });
  const typedSuffix = promptSuffix.slice(
    0,
    getNaturalTypedLength(promptSuffix, frame, chipStart + 8, 30, fps)
  );
  const isTyping = frame >= bWorkspace + 10 && typedSuffix.length < promptSuffix.length;
  const caretVisible = isTyping || Math.sin((frame / fps) * Math.PI * 3.2) > -0.1;

  // Deterministic Quadratic Bezier Cursor inside the 1480px workspace card coordinates
  const cursorStart = bMacroIn + 12;
  const cursorArrive = bClick - 5; // 5-frame anticipation pause before click
  const ct = interpolate(frame, [cursorStart, cursorArrive], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const cFrom = { x: 1020, y: 420 };
  const cTo = { x: 1320, y: 174 };
  const cCtrl = { x: 1215, y: 248 };
  const invT = 1 - ct;
  const cursorX = invT * invT * cFrom.x + 2 * invT * ct * cCtrl.x + ct * ct * cTo.x;
  const cursorY = invT * invT * cFrom.y + 2 * invT * ct * cCtrl.y + ct * ct * cTo.y;
  const cursorOpacity = interpolate(frame, [cursorStart, cursorStart + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const clickScale = interpolate(frame, [bClick, bClick + 3, bClick + 8], [1, 0.87, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isClicked = frame >= bClick + 2;
  const rippleP = interpolate(frame, [bClick, bClick + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const traceReveal = spring({
    frame: Math.max(0, frame - (bClick + 1)),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: 18,
  });

  // --- Shot 5: Cohesive Gallery-Light Multimodal Context Sweep + Live Atomic Diff ---
  const mmLocal = frame - bMultimodal;
  const mmEnter = spring({
    frame: Math.max(0, mmLocal),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: 18,
  });
  // Smooth continuous attention scanner sweeping 0% -> 100% across the 2.0M multimodal tracks
  const scanProgress = interpolate(mmLocal, [8, 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const displayContext = (contextWindowValue * scanProgress).toFixed(1);
  // Subtle composed camera push across the 5-second interactive proof stage
  const mmCamScale = interpolate(mmLocal, [0, 145], [0.99, 1.022], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const diffVerified = mmLocal >= 96;
  const diffVerifyPop = spring({
    frame: Math.max(0, mmLocal - 96),
    fps,
    config: SPRING_POP,
    durationInFrames: 16,
  });

  // --- Shot 6: Editorial Statement + Inline Gemini Star Reflow ---
  const stmtLocal = frame - bStatement;
  const stmtEnter = interpolate(stmtLocal, [0, 12], [0.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const inlinePop = spring({
    frame: Math.max(0, stmtLocal - 10),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: 20,
  });

  // --- Shot 7: Calm Museum-Whitespace CTA Lockup ---
  const ctaLocal = frame - bCta;
  const ctaEnter = spring({
    frame: Math.max(0, ctaLocal),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: 20,
  });
  const ctaPills = spring({
    frame: Math.max(0, ctaLocal - 7),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: 18,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.lightBg,
        fontFamily: FONT_SANS,
        overflow: "hidden",
      }}
    >
      {/* Optional beat-synced audio bed (muted when musicSrc is empty) */}
      {musicSrc ? (
        <Audio
          src={staticFile(musicSrc)}
          volume={(f) => {
            const fadeIn = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" });
            const fadeOut = interpolate(
              f,
              [durationInFrames - 22, durationInFrames],
              [1, 0],
              { extrapolateLeft: "clamp" }
            );
            return musicVolume * fadeIn * fadeOut;
          }}
        />
      ) : null}

      {/* Consistent restrained organic studio paper wash across the entire film */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 80% 18%, ${theme.washCool}28 0%, transparent 48%), radial-gradient(circle at 18% 82%, ${theme.washIris}22 0%, transparent 50%), radial-gradient(circle at 52% 96%, ${theme.washWarm}18 0%, transparent 44%)`,
        }}
      />

      {/* ============================================================ */}
      {/* SHOT 1: FRAME-0 EDITORIAL GALLERY HOOK (Beats 0 -> 5)        */}
      {/* ============================================================ */}
      {frame < bWorkspace && (
        <AbsoluteFill
          style={{
            padding: "90px 120px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: 1460,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 24px",
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.84)",
                border: "1px solid rgba(10,10,10,0.09)",
                boxShadow: "0 8px 24px rgba(10,10,10,0.04)",
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: theme.lightTextPrimary,
                marginBottom: 38,
                opacity: hookBadge,
                transform: `translateY(${interpolate(hookBadge, [0, 1], [14, 0])}px)`,
              }}
            >
              <GeminiStarMark size={20} color={theme.accent} />
              <span>{badge}</span>
            </div>

            <div style={{ overflow: "hidden", paddingBottom: 6 }}>
              <div
                style={{
                  fontSize: 106,
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.04,
                  color: theme.lightTextMuted,
                  transform: `translateY(${interpolate(hook1, [0, 1], [52, 0])}px)`,
                  opacity: hook1,
                }}
              >
                {hookLine1}
              </div>
            </div>

            <div style={{ overflow: "hidden", paddingBottom: 12 }}>
              <div
                style={{
                  fontSize: 106,
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.04,
                  color: theme.lightTextPrimary,
                  transform: `translateY(${interpolate(hook2, [0, 1], [62, 0])}px)`,
                  opacity: hook2,
                }}
              >
                {hookLine2Prefix}
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 122,
                    letterSpacing: "-0.015em",
                  }}
                >
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
                maxWidth: 1040,
                lineHeight: 1.38,
                letterSpacing: "-0.01em",
                opacity: hookSub,
                transform: `translateY(${interpolate(hookSub, [0, 1], [16, 0])}px)`,
              }}
            >
              {tagline}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ============================================================ */}
      {/* SHOTS 2-4: LIVE GEMINI STUDIO + MACRO RIG (Beats 5 -> 26)    */}
      {/* ============================================================ */}
      {frame >= bWorkspace && frame < bMultimodal && (
        <AbsoluteFill
          style={{
            transform: `scale(${camZoom}) translate3d(${camTx}px, ${camTy}px, 0)`,
            transformOrigin: "center center",
            justifyContent: "center",
            alignItems: "center",
            padding: "90px 120px",
            willChange: "transform",
          }}
        >
          <div
            style={{
              width: 1480,
              borderRadius: 28,
              backgroundColor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(10,10,10,0.09)",
              boxShadow: "0 40px 104px rgba(10,10,10,0.08)",
              padding: 40,
              display: "flex",
              flexDirection: "column",
              gap: 24,
              position: "relative",
              opacity: wsEnter,
              transform: `translateY(${interpolate(wsEnter, [0, 1], [24, 0])}px) scale(${interpolate(wsEnter, [0, 1], [0.97, 1])})`,
            }}
          >
            {/* Workspace Top Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(10,10,10,0.08)",
                paddingBottom: 22,
                height: 58,
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: theme.lightTextPrimary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <GeminiStarMark size={20} color="#FFFFFF" />
                </div>
                <span
                  style={{
                    fontSize: 27,
                    fontWeight: 600,
                    color: theme.lightTextPrimary,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Gemini Studio
                </span>
                <span
                  style={{
                    marginLeft: 6,
                    padding: "6px 14px",
                    borderRadius: 999,
                    backgroundColor: `${theme.accent}12`,
                    border: `1px solid ${theme.accent}28`,
                    color: theme.accent,
                    fontFamily: FONT_MONO,
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  {modelPill}
                </span>
              </div>

              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 21,
                  fontWeight: 600,
                  color: isClicked ? theme.success : theme.lightTextMuted,
                  letterSpacing: "0.02em",
                }}
              >
                {isClicked ? "● LIVE · 248 TOK/S" : "2M CONTEXT · READY"}
              </span>
            </div>

            {/* Interactive Prompt Composer (Macro Camera Rig Focal Target) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                padding: "16px 20px 16px 28px",
                height: 98,
                boxSizing: "border-box",
                borderRadius: 20,
                backgroundColor: "#F9F9F8",
                border: `1.5px solid ${isClicked ? theme.accent : "rgba(10,10,10,0.11)"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 30,
                  fontWeight: 500,
                  color: theme.lightTextPrimary,
                  letterSpacing: "-0.015em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <span>{typedPrefix}</span>
                {frame >= chipStart && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "4px 14px",
                      borderRadius: 10,
                      backgroundColor: `${theme.accent}16`,
                      color: theme.accent,
                      fontFamily: FONT_MONO,
                      fontSize: 24,
                      fontWeight: 600,
                      transform: `scale(${interpolate(chipPop, [0, 1], [0.76, 1])})`,
                      opacity: chipPop,
                    }}
                  >
                    {entityChip}
                  </span>
                )}
                <span>{typedSuffix}</span>
                {!isClicked && (
                  <span
                    style={{
                      width: 3,
                      height: 34,
                      backgroundColor: theme.accent,
                      opacity: caretVisible ? 1 : 0,
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  flexShrink: 0,
                  width: 196,
                  height: 62,
                  borderRadius: 14,
                  backgroundColor: isClicked ? theme.success : theme.lightTextPrimary,
                  color: "#FFFFFF",
                  fontSize: 25,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transform: `scale(${clickScale})`,
                }}
              >
                {isClicked ? `✓ ${actionDoneLabel}` : actionLabel}
              </div>
            </div>

            {/* Live Reasoning Trace Strip (fixed height so composer never shifts) */}
            <div
              style={{
                height: 54,
                borderRadius: 14,
                padding: "0 22px",
                backgroundColor: isClicked ? `${theme.accent}0D` : "#F4F4F2",
                border: `1px solid ${isClicked ? `${theme.accent}2B` : "rgba(10,10,10,0.06)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: FONT_MONO,
                  fontSize: 21,
                  fontWeight: 500,
                  color: isClicked ? theme.lightTextPrimary : theme.lightTextMuted,
                  opacity: isClicked ? traceReveal : 0.65,
                  transform: isClicked
                    ? `translateY(${interpolate(traceReveal, [0, 1], [8, 0])}px)`
                    : "none",
                }}
              >
                <GeminiStarMark size={16} color={isClicked ? theme.accent : theme.lightTextMuted} />
                <span>{isClicked ? reasoningTrace : "Awaiting execution prompt..."}</span>
              </div>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 19,
                  fontWeight: 600,
                  color: isClicked ? theme.accent : theme.lightTextMuted,
                  opacity: isClicked ? traceReveal : 0.45,
                }}
              >
                {isClicked ? "THINKING BUDGET · ADAPTIVE" : "STANDBY"}
              </span>
            </div>

            {/* System Payoff Cards (populate immediately after click as camera pulls back) */}
            <div style={{ display: "flex", gap: 22, height: 224 }}>
              {resultCards.map((card, idx) => {
                const cp = spring({
                  frame: Math.max(0, frame - (bClick + 6 + idx * 5)),
                  fps,
                  config: SPRING_EDITORIAL,
                  durationInFrames: 18,
                });
                const revealed = frame >= bClick + 5;
                return (
                  <div
                    key={card.label}
                    style={{
                      flex: 1,
                      borderRadius: 20,
                      padding: 28,
                      backgroundColor: revealed ? "#FFFFFF" : "#F3F3F1",
                      border: `1px solid ${revealed ? "rgba(10,10,10,0.09)" : "rgba(10,10,10,0.05)"}`,
                      boxShadow: revealed ? "0 12px 32px rgba(10,10,10,0.04)" : "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      opacity: revealed ? cp : 0.45,
                      transform: revealed
                        ? `translateY(${interpolate(cp, [0, 1], [18, 0])}px)`
                        : "none",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 20,
                          fontWeight: 600,
                          color: theme.accent,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {card.label}
                      </div>
                      <div
                        style={{
                          fontSize: 28,
                          fontWeight: 600,
                          color: theme.lightTextPrimary,
                          marginTop: 10,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.2,
                        }}
                      >
                        {card.title}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 46,
                        fontWeight: 700,
                        color: theme.lightTextPrimary,
                        letterSpacing: "-0.035em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {card.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Deterministic Bezier Cursor + Click Ripple (card-relative coordinates) */}
            {frame >= cursorStart && frame < bPullOut + 6 && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  transform: `translate3d(${cursorX}px, ${cursorY}px, 0)`,
                  opacity: cursorOpacity,
                  pointerEvents: "none",
                  zIndex: 50,
                }}
              >
                {frame >= bClick && rippleP < 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: -26,
                      top: -26,
                      width: 52,
                      height: 52,
                      borderRadius: 999,
                      border: `2.5px solid ${theme.accent}`,
                      transform: `scale(${0.35 + rippleP * 1.45})`,
                      opacity: (1 - rippleP) * 0.72,
                    }}
                  />
                )}
                <svg
                  width={34}
                  height={34}
                  viewBox="0 0 24 24"
                  style={{
                    transform: `scale(${clickScale})`,
                    transformOrigin: "top left",
                    filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.22))",
                  }}
                >
                  <path
                    d="M5.5 3.2L19.2 12.1L12.6 13.5L9.4 19.6L5.5 3.2Z"
                    fill="#0A0A0A"
                    stroke="#FFFFFF"
                    strokeWidth={1.6}
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ============================================================ */}
      {/* SHOT 5: GALLERY-LIGHT MULTIMODAL CONTEXT + LIVE ATOMIC DIFF  */}
      {/* Cohesive studio paper canvas — real product motion, zero     */}
      {/* dark-mode shift or static KPI cards (Beats 26 -> 36)         */}
      {/* ============================================================ */}
      {frame >= bMultimodal && frame < bStatement && (
        <AbsoluteFill
          style={{
            padding: "90px 120px",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${mmCamScale})`,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              width: 1480,
              display: "flex",
              flexDirection: "column",
              gap: 30,
              opacity: mmEnter,
              transform: `translateY(${interpolate(mmEnter, [0, 1], [18, 0])}px)`,
            }}
          >
            {/* Top Editorial Header Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  fontSize: 66,
                  fontWeight: 600,
                  letterSpacing: "-0.038em",
                  lineHeight: 1.04,
                  color: theme.lightTextPrimary,
                }}
              >
                <span style={{ color: theme.lightTextMuted }}>{chapterHeadlineMuted} </span>
                <span>{chapterHeadlinePrefix}</span>
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 78,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {chapterHeadlineSerif}
                </span>
              </div>

              {/* Live Animated 2.0M Context Pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 24px",
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(10,10,10,0.09)",
                  boxShadow: "0 10px 28px rgba(10,10,10,0.04)",
                }}
              >
                <GeminiStarMark size={18} color={theme.accent} />
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 25,
                    fontWeight: 600,
                    color: theme.lightTextPrimary,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {displayContext}
                  {contextWindowSuffix}
                </span>
                <span
                  style={{
                    width: 1,
                    height: 22,
                    backgroundColor: "rgba(10,10,10,0.12)",
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 22,
                    fontWeight: 600,
                    color: theme.accent,
                  }}
                >
                  {ttftSpec}
                </span>
              </div>
            </div>

            {/* Dual Gallery-Light Interactive Product Sheets */}
            <div style={{ display: "flex", gap: 24, height: 520 }}>
              {/* LEFT SHEET: Multimodal Context Attention Scanner */}
              <div
                style={{
                  flex: 1.12,
                  borderRadius: 26,
                  backgroundColor: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(10,10,10,0.09)",
                  boxShadow: "0 30px 80px rgba(10,10,10,0.06)",
                  padding: "32px 34px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(10,10,10,0.08)",
                    paddingBottom: 18,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 21,
                      fontWeight: 600,
                      color: theme.lightTextPrimary,
                      letterSpacing: "0.04em",
                    }}
                  >
                    MULTIMODAL CONTEXT INDEX
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 20,
                      fontWeight: 600,
                      color: scanProgress >= 0.98 ? theme.success : theme.accent,
                    }}
                  >
                    {scanProgress >= 0.98 ? "● FULL RECALL" : "● INDEXING"}
                  </span>
                </div>

                {/* 4 Modality Tracks with Live Deterministic Attention Playhead */}
                <div
                  style={{
                    position: "relative",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    paddingTop: 26,
                    paddingBottom: 6,
                  }}
                >
                  {/* Vertical Hairline Attention Playhead sweeping cleanly across all 4 rails */}
                  <div
                    style={{
                      position: "absolute",
                      top: 22,
                      bottom: 2,
                      left: `${scanProgress * 100}%`,
                      width: 2,
                      backgroundColor: theme.accent,
                      opacity: scanProgress > 0.01 && scanProgress < 0.995 ? 0.42 : 0,
                      zIndex: 1,
                      pointerEvents: "none",
                    }}
                  />

                  {modalities.map((mod, idx) => {
                    const segs = MODALITY_SEGMENTS[idx] ?? [];
                    const trackDone = scanProgress >= 0.85;
                    return (
                      <div key={mod.kind} style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 2 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                            <span
                              style={{
                                fontFamily: FONT_MONO,
                                fontSize: 20,
                                fontWeight: 600,
                                color: theme.accent,
                                letterSpacing: "0.05em",
                                width: 120,
                              }}
                            >
                              {mod.kind}
                            </span>
                            <span
                              style={{
                                fontSize: 24,
                                fontWeight: 500,
                                color: theme.lightTextPrimary,
                                letterSpacing: "-0.015em",
                              }}
                            >
                              {mod.detail}
                            </span>
                          </div>
                          <span
                            style={{
                              fontFamily: FONT_MONO,
                              fontSize: 20,
                              fontWeight: 600,
                              color: trackDone ? theme.lightTextPrimary : theme.lightTextMuted,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {mod.spans}
                          </span>
                        </div>

                        {/* Horizontal Span Timeline Rail */}
                        <div
                          style={{
                            position: "relative",
                            height: 22,
                            borderRadius: 7,
                            backgroundColor: "#F3F3F0",
                            border: "1px solid rgba(10,10,10,0.06)",
                            overflow: "hidden",
                          }}
                        >
                          {segs.map((seg, sIdx) => {
                            const segThreshold = seg.left / 100;
                            const active = scanProgress >= segThreshold;
                            return (
                              <div
                                key={sIdx}
                                style={{
                                  position: "absolute",
                                  top: 3,
                                  bottom: 3,
                                  left: `${seg.left}%`,
                                  width: `${seg.width}%`,
                                  borderRadius: 4,
                                  backgroundColor: active
                                    ? seg.keySpan
                                      ? theme.accent
                                      : "rgba(37, 99, 235, 0.28)"
                                    : "rgba(10, 10, 10, 0.09)",
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT SHEET: Live Atomic Code Diff & Automated Verification */}
              <div
                style={{
                  flex: 0.88,
                  borderRadius: 26,
                  backgroundColor: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(10,10,10,0.09)",
                  boxShadow: "0 30px 80px rgba(10,10,10,0.06)",
                  padding: "32px 34px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(10,10,10,0.08)",
                    paddingBottom: 18,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 22,
                      fontWeight: 600,
                      color: theme.lightTextPrimary,
                    }}
                  >
                    {diffFileName}
                  </span>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: 999,
                      backgroundColor: diffVerified ? "#ECFDF5" : "#F3F3F0",
                      border: `1px solid ${diffVerified ? "rgba(5,150,105,0.28)" : "rgba(10,10,10,0.08)"}`,
                      fontFamily: FONT_MONO,
                      fontSize: 19,
                      fontWeight: 600,
                      color: diffVerified ? theme.success : theme.lightTextMuted,
                    }}
                  >
                    {diffVerified ? "APPLIED" : "PATCHING"}
                  </span>
                </div>

                {/* Diff Lines — crisp architectural clip-path reveal line by line */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div
                    style={{
                      padding: "16px 20px",
                      borderRadius: 12,
                      backgroundColor: "#FEF2F2",
                      border: "1px solid rgba(220, 38, 38, 0.16)",
                      fontFamily: FONT_MONO,
                      fontSize: 23,
                      fontWeight: 500,
                      color: "#B91C1C",
                      textDecoration: "line-through",
                      opacity: 0.85,
                    }}
                  >
                    {diffRemovedLine}
                  </div>

                  {diffAddedLines.map((line, idx) => {
                    const lineStart = 22 + idx * 18;
                    const wipeRight = interpolate(mmLocal, [lineStart, lineStart + 16], [100, 0], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: EASE_OUT_EXPO,
                    });
                    return (
                      <div
                        key={line}
                        style={{
                          padding: "16px 20px",
                          borderRadius: 12,
                          backgroundColor: "#ECFDF5",
                          border: "1px solid rgba(5, 150, 105, 0.20)",
                          fontFamily: FONT_MONO,
                          fontSize: 23,
                          fontWeight: 600,
                          color: "#065F46",
                          clipPath: `inset(0 ${wipeRight}% 0 0)`,
                        }}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>

                {/* Live Verification Progress & Final Check */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 999,
                      backgroundColor: "#EEEEEC",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(100, scanProgress * 100)}%`,
                        borderRadius: 999,
                        backgroundColor: diffVerified ? theme.success : theme.accent,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 21,
                      fontWeight: 600,
                      color: diffVerified ? theme.success : theme.lightTextMuted,
                      transform: diffVerified
                        ? `scale(${interpolate(diffVerifyPop, [0, 1], [0.96, 1])})`
                        : "none",
                      transformOrigin: "left center",
                    }}
                  >
                    {diffVerified ? diffFooterVerified : diffFooterPending}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ============================================================ */}
      {/* SHOT 6: EDITORIAL STATEMENT + INLINE REFLOW (Beats 36 -> 40) */}
      {/* ============================================================ */}
      {frame >= bStatement && frame < bCta && (
        <AbsoluteFill
          style={{
            padding: "90px 120px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 88,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              color: theme.lightTextPrimary,
              opacity: stmtEnter,
              transform: `translateY(${interpolate(stmtEnter, [0, 1], [16, 0])}px)`,
            }}
          >
            <span style={{ color: theme.lightTextMuted }}>{statementLeft}</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: interpolate(inlinePop, [0, 1], [0, 96]),
                height: 96,
                margin: `0 ${interpolate(inlinePop, [0, 1], [0, 28])}px`,
                borderRadius: 26,
                backgroundColor: theme.lightTextPrimary,
                boxShadow: "0 18px 42px rgba(10,10,10,0.14)",
                transform: `scale(${interpolate(inlinePop, [0, 1], [0.4, 1])})`,
                opacity: inlinePop,
                overflow: "hidden",
              }}
            >
              <GeminiStarMark size={46} color="#FFFFFF" />
            </span>
            <span>
              {statementRightPrefix}
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 102,
                  letterSpacing: "-0.015em",
                  marginLeft: 6,
                }}
              >
                {statementRightSerif}
              </span>
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* ============================================================ */}
      {/* SHOT 7: MUSEUM-MARGIN CTA END CARD (Beats 40 -> 48)          */}
      {/* ============================================================ */}
      {frame >= bCta && (
        <AbsoluteFill
          style={{
            padding: "90px 120px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: theme.lightTextPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 14px 30px rgba(10,10,10,0.12)",
                }}
              >
                <GeminiStarMark size={30} color="#FFFFFF" />
              </div>
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: theme.lightTextPrimary,
                }}
              >
                {productName}
              </span>
            </div>

            <div
              style={{
                fontSize: 78,
                fontWeight: 600,
                letterSpacing: "-0.035em",
                color: theme.lightTextPrimary,
                maxWidth: 1220,
                lineHeight: 1.08,
              }}
            >
              {ctaHeadlinePrefix}
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 90,
                  letterSpacing: "-0.015em",
                }}
              >
                {ctaHeadlineSerif}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: 18,
                marginTop: 10,
                opacity: ctaPills,
                transform: `translateY(${interpolate(ctaPills, [0, 1], [12, 0])}px)`,
              }}
            >
              <div
                style={{
                  padding: "19px 38px",
                  borderRadius: 999,
                  backgroundColor: theme.lightTextPrimary,
                  color: "#FFFFFF",
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {ctaButtonText}
              </div>
              <div
                style={{
                  padding: "19px 36px",
                  borderRadius: 999,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(10,10,10,0.12)",
                  color: theme.lightTextPrimary,
                  fontFamily: FONT_MONO,
                  fontSize: 26,
                  fontWeight: 500,
                }}
              >
                {ctaUrl}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      <FilmGrainOverlay frame={frame} />
    </AbsoluteFill>
  );
};
