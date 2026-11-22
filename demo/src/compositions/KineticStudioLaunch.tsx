import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import {
  ConnectedNodeWire,
  FilmGrainOverlay,
  NodeChromeCard,
  SpatialCameraRig,
  TactileCursor,
} from "../components/StudioPrimitives";
import {
  computeVelocityBlur,
  createBeatGrid,
  EASE_HUMAN_MOTOR,
  EASE_IN_EXPO,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  ensureStudioFonts,
  FONT_MONO,
  FONT_SANS,
  getCaretOpacity,
  getNaturalTypedLength,
  SPRING_EDITORIAL,
  SPRING_SNAPPY,
} from "../lib/motion";

export const kineticStudioSchema = z.object({
  productName: z.string(),
  introLabel: z.string(),
  heroWord: z.string(),
  promptLead: z.string(),
  promptCommand: z.string(),
  wipeNodeTitle: z.string(),
  slotTools: z.array(z.string()).min(5).max(8),
  liveWord: z.string(),
  pipelineTitle: z.string(),
  pipelineLines: z.array(z.string()).length(3),
  ctaHeadlineLines: z.array(z.string()).length(3),
  ctaUrl: z.string(),
  accentColor: z.string(),
  cursorColor: z.string(),
  interruptChapterBg: z.string(),
  bpm: z.number().min(100).max(150),
});

export type KineticStudioProps = z.infer<typeof kineticStudioSchema>;

export const defaultKineticStudioProps: KineticStudioProps = {
  productName: "Prism",
  introLabel: "INTRODUCING",
  heroWord: "Tools",
  promptLead: "Want it? Prompt it.",
  promptCommand: "Remove background",
  wipeNodeTitle: "Subject Masking",
  slotTools: [
    "GIF Converter",
    "Grid Crop",
    "Contact Sheet",
    "Extract Palette",
    "Extract Audio",
    "Posterize",
    "Kinetic Type",
  ],
  liveWord: "Live",
  pipelineTitle: "Synced Pipeline",
  pipelineLines: ["Prompt any creative tool", "wire every node live", "ship in seconds"],
  ctaHeadlineLines: ["GO MAKE", "YOUR OWN", "TOOLS"],
  ctaUrl: "prism.studio/tools",
  accentColor: "#EC4899",
  cursorColor: "#F97316",
  interruptChapterBg: "#7B444A",
  bpm: 132,
};

export const getKineticStudioTotalFrames = (bpm: number, fps: number): number => {
  const g = createBeatGrid(bpm, fps);
  return g.beat(53); // ~24.1s @ 132 BPM
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const ORBIT_CARDS = [
  { angle: -148, dist: 570, w: 235, h: 250, bg: "#FFF7ED", accent: "#F97316", title: "Color Pop" },
  { angle: -112, dist: 450, w: 220, h: 235, bg: "#EEF2FF", accent: "#4F46E5", title: "Riso Crops" },
  { angle: -66, dist: 455, w: 225, h: 235, bg: "#FDF2F8", accent: "#EC4899", title: "Duotone" },
  { angle: -26, dist: 585, w: 245, h: 255, bg: "#18181B", accent: "#FAFAFA", title: "Grid Crop" },
  { angle: 24, dist: 580, w: 240, h: 250, bg: "#ECFDF5", accent: "#059669", title: "Eye Track" },
  { angle: 68, dist: 455, w: 225, h: 235, bg: "#FEF3C7", accent: "#D97706", title: "Slit-Scan" },
  { angle: 114, dist: 455, w: 225, h: 235, bg: "#F4F4F5", accent: "#27272A", title: "Halftone" },
  { angle: 150, dist: 575, w: 240, h: 250, bg: "#F5F3FF", accent: "#7C3AED", title: "Motion Track" },
];

const CANVAS_NODES = [
  { x: 140, y: 120, w: 340, h: 360, title: "Color Pop", bg: "#FFF7ED", accent: "#F97316" },
  { x: 540, y: 100, w: 360, h: 380, title: "Product Shot", bg: "#F4F4F5", accent: "#27272A" },
  { x: 960, y: 120, w: 350, h: 360, title: "Gradient Map", bg: "#FEF3C7", accent: "#EC4899" },
  { x: 1380, y: 100, w: 360, h: 380, title: "Motion Track", bg: "#EDE9FE", accent: "#7C3AED" },
  { x: 1800, y: 120, w: 340, h: 360, title: "Object Detect", bg: "#ECFDF5", accent: "#059669" },

  { x: 160, y: 540, w: 350, h: 360, title: "Duotone", bg: "#FCE7F3", accent: "#DB2777" },
  { x: 570, y: 560, w: 350, h: 360, title: "Riso Crops", bg: "#E0E7FF", accent: "#4338CA" },
  { x: 980, y: 550, w: 360, h: 370, title: "Pixel Stretch", bg: "#18181B", accent: "#FAFAFA" },
  { x: 1410, y: 540, w: 390, h: 390, title: "Kinetic Type", bg: "#EC4899", accent: "#111114", hero: true },
  { x: 1860, y: 560, w: 340, h: 360, title: "Contact Sheet", bg: "#F1F5F9", accent: "#334155" },
];

export const KineticStudioLaunch: React.FC<KineticStudioProps> = (props) => {
  ensureStudioFonts();

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = createBeatGrid(props.bpm, fps);

  // Beat-locked shot boundaries (53 beats total)
  const s1End = g.beat(6);   // Radial Burst Hook
  const s2End = g.beat(15);  // Prompt -> Pill -> Wipe
  const s3End = g.beat(24);  // Accelerating Vertical Slot Drum
  const s4End = g.beat(33);  // Live Cursor Slider + 3-Node Daisy-Chain + Gradient Wipe
  const s5End = g.beat(40);  // Burgundy Wired Node Dataflow
  const s6End = g.beat(47);  // 2D Spatial Camera Rig -> Match-Cut Climax
  const s7End = g.beat(53);  // Geometric Iris Wipe -> Mark & Caret URL

  // Chromatic Gradient Pattern Interrupt centered right on s4End
  const gradStart = s4End - 9;
  const gradEnd = s4End + 9;
  const gradVisible = frame >= gradStart && frame <= gradEnd;
  const gradX = interpolate(frame, [gradStart, s4End, gradEnd], [105, 0, -105], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  // Geometric Iris Wipe centered right on s6End
  const irisStart = s6End - 6;
  const irisEnd = s6End + 7;
  const irisVisible = frame >= irisStart && frame <= irisEnd;
  const irisP = interpolate(frame, [irisStart, s6End, irisEnd], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", fontFamily: FONT_SANS, overflow: "hidden" }}>
      {/* =====================================================================
          SHOT 1: Frame-0 Caret Hook + Staggered Radial Orbital Burst
      ===================================================================== */}
      {frame < s1End && (() => {
        const lf = frame;
        const showIntro = lf < 16;
        const wordIn = spring({
          frame: Math.max(0, lf - 14),
          fps,
          config: SPRING_EDITORIAL,
        });
        const burstOut = interpolate(lf, [s1End - 12, s1End - 3], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_EXPO,
        });
        const wordBlur = (1 - wordIn) * 8;
        const showCaretOnly = lf >= s1End - 4;

        return (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            {/* Radial orbiting Tool Nodes */}
            {!showIntro &&
              ORBIT_CARDS.map((card, i) => {
                const startF = 24 + i * 2;
                const pop = spring({
                  frame: Math.max(0, lf - startF),
                  fps,
                  config: SPRING_SNAPPY,
                });
                const rad = (card.angle * Math.PI) / 180;
                const radius = card.dist * pop * (1 - burstOut * 0.92);
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                const floatY = Math.sin((lf + i * 9) * 0.08) * 6 * pop * (1 - burstOut);
                const scale = (0.45 + 0.55 * pop) * (1 - burstOut * 0.65);
                const opacity = clamp01(pop * 1.4) * (1 - burstOut);

                return (
                  <div
                    key={card.title}
                    style={{
                      position: "absolute",
                      transform: `translate3d(${x}px, ${y + floatY}px, 0) scale(${scale})`,
                      opacity,
                      filter: burstOut > 0.15 ? `blur(${burstOut * 12}px)` : undefined,
                    }}
                  >
                    <NodeChromeCard
                      title={card.title}
                      accentColor={props.accentColor}
                      width={card.w}
                      height={card.h}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: card.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 82,
                            height: 82,
                            borderRadius: 20,
                            backgroundColor: card.accent,
                            transform: `rotate(${(i % 2 === 0 ? 1 : -1) * 12}deg)`,
                          }}
                        />
                      </div>
                    </NodeChromeCard>
                  </div>
                );
              })}

            {/* Center Foveal Anchor */}
            {showIntro ? (
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "#18181B",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>{props.introLabel}</span>
                <span
                  style={{
                    width: 3,
                    height: 36,
                    backgroundColor: "#18181B",
                    opacity: getCaretOpacity(lf, true, fps),
                  }}
                />
              </div>
            ) : showCaretOnly ? (
              <div style={{ width: 3, height: 42, backgroundColor: "#18181B" }} />
            ) : (
              <div
                style={{
                  fontSize: 138,
                  fontWeight: 800,
                  letterSpacing: "-0.05em",
                  color: "#111114",
                  transform: `scale(${0.86 + wordIn * 0.14})`,
                  filter: wordBlur > 0.3 ? `blur(${wordBlur.toFixed(1)}px)` : undefined,
                  opacity: interpolate(lf, [s1End - 7, s1End - 4], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {props.heroWord}
              </div>
            )}
          </AbsoluteFill>
        );
      })()}

      {/* =====================================================================
          SHOT 2: Prompt-to-Pill Morph -> Pink Halo -> Live Split-Wipe
      ===================================================================== */}
      {frame >= s1End && frame < s2End && (() => {
        const lf = frame - s1End;
        const shotLen = s2End - s1End;

        const morphP = interpolate(lf, [22, 32], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });
        const typedLen = getNaturalTypedLength(props.promptCommand, lf, 31, 34, fps);
        const displayPrompt = lf < 31 ? props.promptLead : props.promptCommand.slice(0, typedLen);

        const haloP = interpolate(lf, [48, 58], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });
        const liftP = interpolate(lf, [62, 72], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_OUT_QUINT,
        });

        const nodeSpring = spring({
          frame: Math.max(0, lf - 64),
          fps,
          config: SPRING_EDITORIAL,
        });
        const wipeP = interpolate(lf, [84, 102], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_OUT_QUINT,
        });
        const whipOut = interpolate(lf, [shotLen - 6, shotLen], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_EXPO,
        });

        return (
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              transform: `translate3d(${-whipOut * 540}px, 0, 0)`,
              filter: whipOut > 0.05 ? `blur(${(whipOut * 16).toFixed(1)}px)` : undefined,
            }}
          >
            {/* Morphing Prompt Pill */}
            {liftP < 1 && (
              <div
                style={{
                  position: "absolute",
                  transform: `translate3d(0, ${-liftP * 260}px, 0) scale(${1 + morphP * 0.04})`,
                  opacity: 1 - liftP,
                  filter: liftP > 0.05 ? `blur(${(liftP * 12).toFixed(1)}px)` : undefined,
                  display: "inline-flex",
                  alignItems: "center",
                  height: 82,
                  padding: `0 ${20 + morphP * 20}px`,
                  borderRadius: 999,
                  backgroundColor: `rgba(255,255,255,${morphP})`,
                  border: `2.5px solid ${haloP > 0.2 ? props.accentColor : `rgba(228,228,231,${morphP})`}`,
                  boxShadow:
                    haloP > 0.05
                      ? `0 0 0 ${haloP * 8}px ${props.accentColor}26, 0 0 ${haloP * 54}px ${props.accentColor}66`
                      : `0 12px 32px rgba(0,0,0,${morphP * 0.07})`,
                  fontSize: 32,
                  fontWeight: 550,
                  letterSpacing: "-0.02em",
                  color: "#18181B",
                }}
              >
                {haloP > 0.02 && (
                  <span
                    style={{
                      width: haloP * 24,
                      height: 24,
                      marginRight: haloP * 14,
                      borderRadius: 999,
                      border: "3px solid #E4E4E7",
                      borderTopColor: props.accentColor,
                      transform: `rotate(${(lf - 48) * 26}deg)`,
                      display: "inline-block",
                    }}
                  />
                )}
                <span>{displayPrompt}</span>
                <span
                  style={{
                    width: 2.5,
                    height: 34,
                    marginLeft: 4,
                    backgroundColor: "#18181B",
                    opacity: getCaretOpacity(lf, lf >= 31 && typedLen < props.promptCommand.length, fps),
                  }}
                />
              </div>
            )}

            {/* Generated Subject Masking Node + Split Wipe */}
            {lf >= 64 && (
              <div
                style={{
                  transform: `translate3d(0, ${(1 - nodeSpring) * 90}px, 0) scale(${0.88 + nodeSpring * 0.12})`,
                  opacity: clamp01(nodeSpring * 1.4),
                }}
              >
                <NodeChromeCard title={props.wipeNodeTitle} accentColor={props.accentColor} width={540} height={640}>
                  {/* After layer: crisp white studio cutout */}
                  <div style={{ position: "absolute", inset: 0, backgroundColor: "#FFFFFF" }}>
                    <svg viewBox="0 0 260 320" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
                      <ellipse cx="142" cy="284" rx="76" ry="12" fill="rgba(17,17,22,0.10)" />
                      <g fill="#18181B">
                        <circle cx="156" cy="74" r="20" />
                        <path d="M130 102 C130 94 182 94 182 102 L196 188 L174 190 L164 276 L148 276 L150 198 L142 198 L134 276 L118 276 L122 186 Z" />
                        <path d="M124 154 Q94 190 76 212" stroke="#18181B" strokeWidth="2.5" fill="none" />
                        <path d="M44 222 C54 206 76 206 86 218 L108 218 C118 218 124 230 120 242 L116 278 L104 278 L104 252 L74 252 L72 278 L60 278 L60 248 L48 242 Z" />
                        <circle cx="80" cy="210" r="10" />
                      </g>
                    </svg>
                  </div>

                  {/* Before layer: cobalt studio backdrop clipped by wipeP */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      clipPath: `inset(0% 0% 0% ${(wipeP * 100).toFixed(2)}%)`,
                    }}
                  >
                    <svg viewBox="0 0 260 320" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
                      <rect width="260" height="320" fill="#1D4ED8" />
                      <ellipse cx="142" cy="284" rx="76" ry="12" fill="rgba(0,0,0,0.28)" />
                      <g fill="#111115">
                        <circle cx="156" cy="74" r="20" />
                        <path d="M130 102 C130 94 182 94 182 102 L196 188 L174 190 L164 276 L148 276 L150 198 L142 198 L134 276 L118 276 L122 186 Z" />
                        <path d="M124 154 Q94 190 76 212" stroke="#111115" strokeWidth="2.5" fill="none" />
                        <path d="M44 222 C54 206 76 206 86 218 L108 218 C118 218 124 230 120 242 L116 278 L104 278 L104 252 L74 252 L72 278 L60 278 L60 248 L48 242 Z" />
                        <circle cx="80" cy="210" r="10" />
                      </g>
                    </svg>
                  </div>

                  {/* Split Wipe Bar + Tactile Orange Cursor */}
                  {wipeP > 0.01 && wipeP < 0.99 && (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: `${wipeP * 100}%`,
                          width: 4,
                          backgroundColor: props.cursorColor,
                          boxShadow: `0 0 20px ${props.cursorColor}`,
                        }}
                      />
                      <TactileCursor x={wipeP * 540 - 4} y={310} fill={props.cursorColor} />
                    </>
                  )}
                </NodeChromeCard>
              </div>
            )}
          </AbsoluteFill>
        );
      })()}

      {/* =====================================================================
          SHOT 3: Split-Screen Vertical Slot-Machine Drum (Accelerating!)
      ===================================================================== */}
      {frame >= s2End && frame < s3End && (() => {
        const lf = frame - s2End;
        const shotLen = s3End - s2End;
        const whipIn = interpolate(lf, [0, 8], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });
        const whipOut = interpolate(lf, [shotLen - 7, shotLen], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_EXPO,
        });

        // Piecewise detent schedule -> exponential acceleration!
        const evalIdx = (f: number) => {
          const maxI = props.slotTools.length - 1;
          if (f < 22) return 0;
          if (f < 31) return interpolate(f, [22, 31], [0, 1], { easing: EASE_IN_OUT_QUINT });
          if (f < 48) return 1;
          if (f < 56) return interpolate(f, [48, 56], [1, 2], { easing: EASE_IN_OUT_QUINT });
          if (f < 72) return 2;
          if (f < 79) return interpolate(f, [72, 79], [2, 3], { easing: EASE_IN_OUT_QUINT });
          if (f < 88) return 3;
          return interpolate(f, [88, shotLen - 8], [3, maxI], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE_IN_EXPO,
          });
        };

        const currIdx = evalIdx(lf);
        const prevIdx = evalIdx(Math.max(0, lf - 1));
        const velBlur = computeVelocityBlur(currIdx * 100, prevIdx * 100, 0.36, 15);
        const activeRounded = Math.min(props.slotTools.length - 1, Math.round(currIdx));
        const rowH = 92;
        const slideH = 520;
        const swatches = ["#F97316", "#EC4899", "#4F46E5", "#2D3B45", "#8B5CF6", "#059669", "#E11D48"];

        return (
          <AbsoluteFill
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 210px",
              transform: `translate3d(${whipIn * 360}px, ${-whipOut * 220}px, 0)`,
              filter:
                whipIn > 0.05 || whipOut > 0.05
                  ? `blur(${Math.max(whipIn * 14, whipOut * 16).toFixed(1)}px)`
                  : undefined,
            }}
          >
            {/* Left (33%): Stationary Pink-Framed Node Preview */}
            <NodeChromeCard
              title={props.slotTools[activeRounded]}
              accentColor={props.accentColor}
              width={500}
              height={568}
            >
              <div
                style={{
                  transform: `translate3d(0, ${-currIdx * slideH}px, 0)`,
                  filter: velBlur > 0.4 ? `blur(${velBlur.toFixed(1)}px)` : undefined,
                }}
              >
                {props.slotTools.map((tool, i) => (
                  <div
                    key={tool}
                    style={{
                      height: slideH,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 24,
                      backgroundColor: i % 2 === 0 ? "#FAFAFA" : "#18181B",
                      color: i % 2 === 0 ? "#18181B" : "#FAFAFA",
                    }}
                  >
                    <div
                      style={{
                        width: 210,
                        height: 210,
                        borderRadius: i % 3 === 0 ? 999 : 28,
                        backgroundColor: swatches[i % swatches.length],
                        display: "grid",
                        placeItems: "center",
                        fontSize: 56,
                        fontWeight: 900,
                        color: "#FFFFFF",
                      }}
                    >
                      0{i + 1}
                    </div>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 22, opacity: 0.72 }}>{tool}</span>
                  </div>
                ))}
              </div>
            </NodeChromeCard>

            {/* Right (67%): 3-Row Masked Vertical Typography Drum */}
            <div
              style={{
                width: 780,
                height: rowH * 3,
                overflow: "hidden",
                maskImage: "linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%)",
              }}
            >
              <div
                style={{
                  transform: `translate3d(0, ${rowH - currIdx * rowH}px, 0)`,
                  filter: velBlur > 0.4 ? `blur(${velBlur.toFixed(1)}px)` : undefined,
                }}
              >
                {props.slotTools.map((tool, i) => {
                  const dist = Math.abs(i - currIdx);
                  return (
                    <div
                      key={tool}
                      style={{
                        height: rowH,
                        lineHeight: `${rowH}px`,
                        textAlign: "center",
                        fontSize: 60,
                        fontWeight: dist < 0.45 ? 750 : 500,
                        letterSpacing: "-0.035em",
                        color: "#111114",
                        opacity: dist < 0.45 ? 1 : dist < 1.5 ? 0.22 : 0.08,
                      }}
                    >
                      {tool}
                    </div>
                  );
                })}
              </div>
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* =====================================================================
          SHOT 4: Direct-Manipulation "Live" Slider -> 3-Node Daisy-Chain
      ===================================================================== */}
      {frame >= s3End && frame < s4End && (() => {
        const lf = frame - s3End;
        const switchF = 58;
        const whipP = interpolate(lf, [switchF - 5, switchF + 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_OUT_QUINT,
        });

        // Forward AND backward slider scrub proving true live control
        const sliderUp = interpolate(lf, [10, 32], [0.16, 0.92], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_HUMAN_MOTOR,
        });
        const sliderBack = interpolate(lf, [36, 52], [0, 0.68], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_HUMAN_MOTOR,
        });
        const sliderVal = Math.max(0.16, sliderUp - sliderBack);
        const trackW = 420;

        // Act B: Single Hero -> 3-Node Daisy-Chain
        const chainP = spring({
          frame: Math.max(0, lf - (switchF + 24)),
          fps,
          config: SPRING_EDITORIAL,
        });
        const chain2P = spring({
          frame: Math.max(0, lf - (switchF + 27)),
          fps,
          config: SPRING_EDITORIAL,
        });
        const shaderZoom = interpolate(lf, [switchF + 4, switchF + 24], [1.0, 1.48], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_HUMAN_MOTOR,
        });

        return (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            {/* Act A: "Live" Slider Typography */}
            {whipP < 1 && (
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 72,
                  transform: `translate3d(${-whipP * 760}px, 0, 0)`,
                  opacity: 1 - whipP,
                  filter: whipP > 0.05 ? `blur(${(whipP * 16).toFixed(1)}px)` : undefined,
                }}
              >
                <div
                  style={{
                    fontSize: 196,
                    fontWeight: 800,
                    letterSpacing: "-0.05em",
                    color: "#111114",
                    lineHeight: 1,
                    transform: `scale(${0.72 + sliderVal * 0.92})`,
                  }}
                >
                  {props.liveWord}
                </div>

                <div style={{ position: "relative", width: trackW, height: 48, display: "flex", alignItems: "center" }}>
                  <div style={{ width: trackW, height: 14, borderRadius: 999, backgroundColor: "#E4E4E7" }}>
                    <div
                      style={{
                        width: `${sliderVal * 100}%`,
                        height: "100%",
                        borderRadius: 999,
                        backgroundColor: "#111114",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: sliderVal * trackW,
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      backgroundColor: "#FFFFFF",
                      border: "4px solid #111114",
                      transform: "translateX(-50%)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                    }}
                  />
                  <TactileCursor x={sliderVal * trackW + 6} y={24} fill={props.cursorColor} />
                </div>
              </div>
            )}

            {/* Act B: Hero Shader Node -> 3-Card Staggered Daisy-Chain */}
            {lf >= switchF - 4 && (
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  gap: 40,
                  transform: `translate3d(${(1 - whipP) * 680}px, 0, 0)`,
                  filter: whipP < 0.95 ? `blur(${((1 - whipP) * 16).toFixed(1)}px)` : undefined,
                }}
              >
                {[
                  { title: "Risograph", bg: "#FDF2F8", color: "#EC4899", p: 1, shift: (1 - chainP) * 480 },
                  { title: "Line Hatch", bg: "#F4F4F5", color: "#18181B", p: chainP, shift: (1 - chainP) * -90 },
                  { title: "Halftone", bg: "#18181B", color: "#F472B6", p: chain2P, shift: (1 - chain2P) * -90 },
                ].map((node, idx) => (
                  <div
                    key={node.title}
                    style={{
                      transform: `translate3d(${node.shift}px, 0, 0) scale(${
                        idx === 0 ? 1.16 - chainP * 0.16 : 0.85 + node.p * 0.15
                      })`,
                      opacity: idx === 0 ? 1 : node.p,
                    }}
                  >
                    <NodeChromeCard title={node.title} accentColor={props.accentColor} width={440} height={540}>
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: node.bg,
                          display: "grid",
                          placeItems: "center",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: 240,
                            height: 240,
                            borderRadius: 999,
                            background: `radial-gradient(circle at 38% 38%, ${node.color}, #312E81)`,
                            transform: `scale(${idx === 0 ? shaderZoom : 1 + node.p * 0.25})`,
                          }}
                        />
                      </div>
                    </NodeChromeCard>
                  </div>
                ))}
              </div>
            )}
          </AbsoluteFill>
        );
      })()}

      {/* =====================================================================
          SHOT 5: Moody Color-Block Wired Node Dataflow (1-to-1 Input -> Output)
      ===================================================================== */}
      {frame >= s4End && frame < s5End && (() => {
        const lf = frame - s4End;
        const wireDraw = interpolate(lf, [10, 26], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_OUT_QUINT,
        });
        const outPop = spring({
          frame: Math.max(0, lf - 22),
          fps,
          config: SPRING_EDITORIAL,
        });

        // 3 sequential signal pulses triggering each line!
        const pulseStep = 20;
        const pulseBase = 30;
        const activePulseIdx = Math.floor((lf - pulseBase) / pulseStep);
        const pulseLocal = (lf - pulseBase) % pulseStep;
        const pulseProg =
          lf >= pulseBase && activePulseIdx < 3
            ? interpolate(pulseLocal, [0, 11], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE_IN_OUT_QUINT,
              })
            : 0;
        const pulseOp = lf >= pulseBase && activePulseIdx < 3 && pulseLocal < 13 ? 1 : 0;

        return (
          <AbsoluteFill
            style={{
              backgroundColor: props.interruptChapterBg,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            {/* Left Input Node: Live Audio Waveform Pill */}
            <div
              style={{
                width: 340,
                height: 150,
                borderRadius: 30,
                backgroundColor: "#FFFFFF",
                boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 11,
                position: "relative",
              }}
            >
              {Array.from({ length: 14 }, (_, i) => {
                const wave = 0.35 + Math.abs(Math.sin(lf * 0.24 + i * 0.65)) * 0.65;
                return (
                  <span
                    key={i}
                    style={{
                      width: 9,
                      height: 92 * wave,
                      borderRadius: 99,
                      backgroundColor: "#18181B",
                    }}
                  />
                );
              })}
              <span
                style={{
                  position: "absolute",
                  right: -10,
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: "#F9A8D4",
                  border: "4px solid #FFFFFF",
                }}
              />
            </div>

            {/* Center Precision SVG Bezier Wire */}
            <ConnectedNodeWire
              width={260}
              height={120}
              drawProgress={wireDraw}
              pulseProgress={pulseProg}
              pulseOpacity={pulseOp}
              accentColor="#F9A8D4"
            />

            {/* Right Output Node: Synced Live Output Card */}
            <div
              style={{
                transform: `translate3d(${(1 - outPop) * 50}px, 0, 0) scale(${0.92 + outPop * 0.08})`,
                opacity: clamp01(outPop * 1.4),
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: -10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: "#F9A8D4",
                  border: "4px solid #FFFFFF",
                  zIndex: 5,
                }}
              />
              <NodeChromeCard title={props.pipelineTitle} accentColor="#F9A8D4" width={620} height={310} dark>
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 18,
                    padding: "0 36px",
                  }}
                >
                  {props.pipelineLines.map((line, i) => {
                    const hitFrame = pulseBase + i * pulseStep + 8;
                    const p = interpolate(lf, [hitFrame, hitFrame + 9], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: EASE_OUT_EXPO,
                    });
                    return (
                      <div
                        key={line}
                        style={{
                          fontSize: 36,
                          fontWeight: 750,
                          letterSpacing: "-0.025em",
                          color: p > 0.35 ? "#FEF08A" : "#FDA4AF",
                          opacity: 0.24 + p * 0.76,
                          transform: `translate3d(0, ${(1 - p) * 12}px, 0)`,
                        }}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>
              </NodeChromeCard>
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* =====================================================================
          SHOT 6: 2D Spatial Camera Rig Glide -> Scale-Through Match-Cut Climax
      ===================================================================== */}
      {frame >= s5End && frame < s6End && (() => {
        const lf = frame - s5End;
        const cutToPink = 52;
        const cutToFinale = 68;

        // Camera focal waypoints in 2400x1100 world space (hero Kinetic Type center = 1605, 735)
        const evalCam = (f: number) => {
          if (f < 20) {
            const p = interpolate(f, [4, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE_IN_OUT_QUINT,
            });
            return {
              wx: interpolate(p, [0, 1], [680, 1180]),
              wy: interpolate(p, [0, 1], [340, 480]),
              z: interpolate(p, [0, 1], [0.88, 0.96]),
            };
          }
          if (f < 42) {
            const p = interpolate(f, [22, 42], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE_IN_OUT_QUINT,
            });
            return {
              wx: interpolate(p, [0, 1], [1180, 1605]),
              wy: interpolate(p, [0, 1], [480, 735]),
              z: interpolate(p, [0, 1], [0.96, 2.05]),
            };
          }
          const punch = interpolate(f, [44, cutToPink + 2], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE_IN_EXPO,
          });
          return { wx: 1605, wy: 735, z: 2.05 + punch * 4.4 };
        };

        const cam = evalCam(lf);
        const prevCam = evalCam(Math.max(0, lf - 1));
        const speed = Math.hypot(cam.wx - prevCam.wx, cam.wy - prevCam.wy) + Math.abs(cam.z - prevCam.z) * 180;
        const camBlur = speed < 4 ? 0 : Math.min(14, (speed - 4) * 0.14);

        return (
          <AbsoluteFill>
            {/* Infinite 2D Canvas World */}
            {lf < cutToPink + 2 && (
              <SpatialCameraRig focusX={cam.wx} focusY={cam.wy} zoom={cam.z} blurPx={camBlur}>
                <div style={{ width: 2400, height: 1150, position: "relative" }}>
                  {CANVAS_NODES.map((n) => (
                    <div
                      key={n.title}
                      style={{ position: "absolute", left: n.x, top: n.y }}
                    >
                      <NodeChromeCard title={n.title} accentColor={props.accentColor} width={n.w} height={n.h}>
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: n.bg,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {n.hero ? (
                            <div
                              style={{
                                fontSize: 64,
                                fontWeight: 900,
                                lineHeight: 0.9,
                                letterSpacing: "-0.045em",
                                color: "#111114",
                                textAlign: "center",
                              }}
                            >
                              KINETIC
                              <br />
                              TYPE
                            </div>
                          ) : (
                            <div
                              style={{
                                width: 110,
                                height: 110,
                                borderRadius: 24,
                                backgroundColor: n.accent,
                              }}
                            />
                          )}
                        </div>
                      </NodeChromeCard>
                    </div>
                  ))}
                </div>
              </SpatialCameraRig>
            )}

            {/* Peak-Velocity Match-Cut: Full-Bleed Pink Undulating Layer */}
            {lf >= cutToPink && lf < cutToFinale && (() => {
              const pIn = interpolate(lf, [cutToPink, cutToPink + 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE_OUT_EXPO,
              });
              const wave = 1 + Math.sin((lf - cutToPink) * 0.45) * 0.14;
              return (
                <AbsoluteFill
                  style={{
                    backgroundColor: props.accentColor,
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${0.86 + pIn * 0.14})`,
                  }}
                >
                  {["MAKE TOOLS", "MAKE TOOLS", "MAKE TOOLS"].map((txt, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: 230,
                        fontWeight: 900,
                        lineHeight: 0.86,
                        letterSpacing: "-0.05em",
                        color: idx === 1 ? "#111114" : "transparent",
                        WebkitTextStroke: idx === 1 ? undefined : "5px #111114",
                        transform: `scaleY(${idx === 1 ? wave : 2 - wave})`,
                      }}
                    >
                      {txt}
                    </div>
                  ))}
                </AbsoluteFill>
              );
            })()}

            {/* High-Contrast Hero CTA Lockup */}
            {lf >= cutToFinale && (
              <AbsoluteFill
                style={{
                  backgroundColor: "#FFFFFF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {props.ctaHeadlineLines.map((line, i) => {
                  const p = interpolate(lf, [cutToFinale + i * 2, cutToFinale + i * 2 + 10], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: EASE_OUT_EXPO,
                  });
                  return (
                    <div key={line} style={{ overflow: "hidden" }}>
                      <div
                        style={{
                          fontSize: 210,
                          fontWeight: 900,
                          lineHeight: 0.9,
                          letterSpacing: "-0.055em",
                          color: "#111114",
                          transform: `translate3d(0, ${(1 - p) * 140}px, 0)`,
                        }}
                      >
                        {line}
                      </div>
                    </div>
                  );
                })}
              </AbsoluteFill>
            )}
          </AbsoluteFill>
        );
      })()}

      {/* =====================================================================
          SHOT 7: Brand Mark Hold -> Minimal Caret URL End-Card
      ===================================================================== */}
      {frame >= s6End && frame <= s7End && (() => {
        const lf = frame - s6End;
        const showUrl = lf >= 30;
        const markPop = spring({ frame: lf, fps, config: SPRING_EDITORIAL });
        const typedUrlLen = getNaturalTypedLength(props.ctaUrl, lf, 32, 30, fps);

        return (
          <AbsoluteFill style={{ backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
            {!showUrl ? (
              <div style={{ transform: `scale(${0.82 + markPop * 0.18})`, opacity: markPop }}>
                <svg width={128} height={128} viewBox="0 0 64 64" fill="none">
                  <rect x="8" y="8" width="22" height="22" rx="6" fill="#111114" />
                  <rect x="34" y="8" width="22" height="22" rx="6" fill={props.accentColor} />
                  <rect x="8" y="34" width="22" height="22" rx="6" fill={props.accentColor} />
                  <rect x="34" y="34" width="22" height="22" rx="6" fill="#111114" />
                  <circle cx="32" cy="32" r="9" fill="#FFFFFF" />
                </svg>
              </div>
            ) : (
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: "#18181B",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>{props.ctaUrl.slice(0, typedUrlLen)}</span>
                <span
                  style={{
                    width: 3,
                    height: 46,
                    backgroundColor: "#18181B",
                    opacity: getCaretOpacity(lf, typedUrlLen < props.ctaUrl.length, fps),
                  }}
                />
              </div>
            )}
          </AbsoluteFill>
        );
      })()}

      {/* Global Chromatic Gradient Pattern Interrupt Swipe */}
      {gradVisible && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(125deg, #C084FC 0%, #F472B6 52%, #FB7185 100%)",
            transform: `translate3d(${gradX}%, 0, 0)`,
            zIndex: 80,
          }}
        />
      )}

      {/* Global Geometric Circle-Iris Brand Wipe */}
      {irisVisible && (
        <AbsoluteFill
          style={{
            backgroundColor: "#DDD6FE",
            opacity: irisP,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 85,
          }}
        >
          <div
            style={{
              width: 2400 * irisP,
              height: 2400 * irisP,
              borderRadius: 9999,
              backgroundColor: "#111114",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Anti-Banding Deterministic Film Grain */}
      <FilmGrainOverlay frame={frame} opacity={0.022} />
    </AbsoluteFill>
  );
};
