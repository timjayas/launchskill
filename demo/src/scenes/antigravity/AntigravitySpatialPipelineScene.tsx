import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ANTIGRAVITY_THEME,
  AntigravityMark,
  DirectionalMotionBlur,
  PipelineWireLight,
  StudioLightBackdrop,
} from "../../components/AntigravityPrimitives";
import {
  EASE_IN_EXPO,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  SPRING_EDITORIAL,
  SPRING_POP,
  sec,
} from "../../lib/studioMotion";

export interface AntigravitySpatialPipelineSceneProps {
  repoChip: string;
  promptText: string;
  slotCapabilities: string[];
  accentColor: string;
  skyColor: string;
}

/**
 * Shot 3 (Beats 14 -> 24, 5.0s): CREATIVE SPATIAL CANVAS — Accelerating Slot-Drum -> Wired 3-Node Dataflow
 * Completely replaces the static checklist with two kinetic motionskill signature patterns on pure light canvas:
 *   - Phase A (0.00s -> 2.35s): Asymmetric Split (36% live preview card / 64% masked vertical slot-machine drum
 *     with true vertical DirectionalMotionBlur snapping through 3 readable detents then accelerating into "Ship PR")
 *   - Phase B (2.35s -> 5.00s): Crisp horizontal whip-pan into a 3-Node Wired Spatial Dataflow
 *     (Prompt Spec ──▶ Multi-File Diff ──▶ Verified Build) with animated cobalt SVG Bezier wires & traveling signal pulses!
 */
export const AntigravitySpatialPipelineScene: React.FC<AntigravitySpatialPipelineSceneProps> = ({
  repoChip,
  promptText,
  slotCapabilities,
  accentColor,
  skyColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phaseCut = sec(2.35, fps);
  const inPhaseA = frame < phaseCut;

  // Entry whip-pan from Shot 2 (0.00 -> 0.22s)
  const whipInA = interpolate(frame, [0, sec(0.22, fps)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Internal whip-pan transition between Phase A (Slot Drum) and Phase B (Wired 3-Node Pipeline)
  const midWhipOut = interpolate(frame, [phaseCut - sec(0.16, fps), phaseCut], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });
  const midWhipIn = interpolate(frame, [phaseCut, phaseCut + sec(0.22, fps)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // =========================================================================
  // PHASE A: Accelerating Vertical Slot-Machine Drum (0.00s -> 2.35s)
  // =========================================================================
  const evalDrumIndex = (f: number): number => {
    // Hold 0 (0.00->0.52s) -> Snap to 1 (0.52->0.72s) -> Hold 1 (0.72->1.15s) ->
    // Snap to 2 (1.15->1.35s) -> Hold 2 (1.35->1.70s) -> Accelerate fast to index 5 (1.70->2.22s)!
    const s1 = interpolate(f, [sec(0.5, fps), sec(0.7, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const s2 = interpolate(f, [sec(1.1, fps), sec(1.3, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const accel = interpolate(f, [sec(1.66, fps), sec(2.2, fps)], [0, 3], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    });
    return s1 + s2 + accel;
  };

  const rowHeight = 148;
  const drumIdx = evalDrumIndex(frame);
  const prevDrumIdx = evalDrumIndex(Math.max(0, frame - 1));
  const drumVelocityPx = Math.abs(drumIdx - prevDrumIdx) * rowHeight * (fps / 30);
  const drumBlurY =
    drumVelocityPx < 3 ? 0 : Math.min(14, (drumVelocityPx - 3) * 0.14);

  const activeStage = Math.min(2, Math.floor(drumIdx + 0.35));

  const stagePreviews = [
    {
      badge: "STEP 01 · CONTEXT GRAPH",
      title: "Architecture Mapped",
      stat: "48 files",
      lines: ["→ src/api/webhooks.ts", "→ src/workers/retryQueue.ts", "→ tests/webhooks.test.ts"],
    },
    {
      badge: "STEP 02 · CODE SYNTHESIS",
      title: "Multi-File Diff Ready",
      stat: "+186 −14",
      lines: ["+ verifySignature(body, sig)", "+ retryQueue.enqueue(id, 5)", "+ idempotencyKey: event.id"],
    },
    {
      badge: "STEP 03 · LIVE SANDBOX",
      title: "Tests Passing Live",
      stat: "18 / 18 ✓",
      lines: ["✓ HMAC signature verified", "✓ exponential backoff pass", "✓ tsc --noEmit · 0 errors"],
    },
  ];
  const currentPreview = stagePreviews[activeStage];

  // =========================================================================
  // PHASE B: Wired 3-Node Spatial Dataflow (2.35s -> 5.00s)
  // =========================================================================
  const lf = Math.max(0, frame - phaseCut);

  const wire1Draw = interpolate(lf, [sec(0.18, fps), sec(0.56, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const pulse1P = interpolate(lf, [sec(0.45, fps), sec(0.88, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const pulse1Vis = lf >= sec(0.45, fps) && lf <= sec(0.92, fps) ? 1 : 0;

  const node2Active = lf >= sec(0.82, fps);
  const node2Pop = spring({
    frame: Math.max(0, lf - sec(0.82, fps)),
    fps,
    config: SPRING_EDITORIAL,
  });

  const wire2Draw = interpolate(lf, [sec(0.95, fps), sec(1.32, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const pulse2P = interpolate(lf, [sec(1.18, fps), sec(1.56, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const pulse2Vis = lf >= sec(1.18, fps) && lf <= sec(1.6, fps) ? 1 : 0;

  const node3Active = lf >= sec(1.5, fps);
  const node3Pop = spring({
    frame: Math.max(0, lf - sec(1.5, fps)),
    fps,
    config: SPRING_POP,
  });

  const locCounter = Math.round(
    interpolate(lf, [sec(0.82, fps), sec(1.42, fps)], [0, 186], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    })
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      <StudioLightBackdrop
        surface="white"
        showGrid
        glowX={inPhaseA ? "32%" : "50%"}
        glowY="50%"
        glowIntensity={0.11}
      />

      {/* PHASE A: Split-Screen Live Node + Accelerating Vertical Slot-Machine Drum */}
      {inPhaseA && (
        <DirectionalMotionBlur
          blurX={whipInA * 13 + midWhipOut * 14}
          blurY={0}
          style={{
            transform: `translate3d(${whipInA * 420 - midWhipOut * 520}px, 0, 0)`,
          }}
        >
          <AbsoluteFill
            style={{
              padding: "96px 128px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 64,
            }}
          >
            {/* LEFT 38%: Stationary Brand-Framed Live Antigravity Agent Node */}
            <div
              style={{
                width: 580,
                height: 540,
                borderRadius: 20,
                backgroundColor: "#FFFFFF",
                border: `2.5px solid ${accentColor}`,
                boxShadow: `${ANTIGRAVITY_THEME.shadowHero}, 0 0 0 6px rgba(37,99,235,0.08)`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
              }}
            >
              {/* Node Header Chrome */}
              <div
                style={{
                  height: 54,
                  padding: "0 22px",
                  borderBottom: `1px solid ${ANTIGRAVITY_THEME.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#FAFBFC",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      backgroundColor: accentColor,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 16,
                      fontWeight: 700,
                      color: ANTIGRAVITY_THEME.ink,
                    }}
                  >
                    {repoChip}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 15,
                    fontWeight: 700,
                    color: activeStage === 2 ? ANTIGRAVITY_THEME.success : accentColor,
                    backgroundColor:
                      activeStage === 2
                        ? ANTIGRAVITY_THEME.successBg
                        : ANTIGRAVITY_THEME.accentSoft,
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {currentPreview.stat}
                </span>
              </div>

              {/* Node Live Visual Body */}
              <div
                style={{
                  flex: 1,
                  padding: "28px 26px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: accentColor,
                    }}
                  >
                    {currentPreview.badge}
                  </span>
                  <div
                    style={{
                      fontSize: 38,
                      fontWeight: 800,
                      letterSpacing: "-0.035em",
                      color: ANTIGRAVITY_THEME.ink,
                      lineHeight: 1.08,
                    }}
                  >
                    {currentPreview.title}
                  </div>
                </div>

                {/* Live Mini Terminal / AST Output Rows */}
                <div
                  style={{
                    borderRadius: 12,
                    backgroundColor: ANTIGRAVITY_THEME.canvasBg,
                    border: `1px solid ${ANTIGRAVITY_THEME.border}`,
                    padding: "18px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    fontFamily: FONT_MONO,
                    fontSize: 19,
                    fontWeight: 600,
                  }}
                >
                  {currentPreview.lines.map((line) => {
                    const isGreen = line.startsWith("+") || line.startsWith("✓");
                    return (
                      <div
                        key={line}
                        style={{
                          color: isGreen ? ANTIGRAVITY_THEME.success : ANTIGRAVITY_THEME.inkSecondary,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>

                {/* Footer Status Bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 14,
                    borderTop: `1px solid ${ANTIGRAVITY_THEME.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <AntigravityMark size={24} variant="light" accentColor={accentColor} skyColor={skyColor} />
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 15,
                        fontWeight: 600,
                        color: ANTIGRAVITY_THEME.inkMuted,
                      }}
                    >
                      AUTONOMOUS ENGINE
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        style={{
                          width: dot === activeStage ? 26 : 8,
                          height: 8,
                          borderRadius: 999,
                          backgroundColor:
                            dot <= activeStage ? accentColor : "rgba(11,13,18,0.14)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT 62%: Masked Accelerating Vertical Capability Slot-Machine Drum */}
            <div
              style={{
                flex: 1,
                height: 520,
                position: "relative",
                overflow: "hidden",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 26%, #000 74%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 26%, #000 74%, transparent 100%)",
              }}
            >
              {/* Subtle focal horizontal detent guide */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  height: 122,
                  transform: "translateY(-50%)",
                  borderTop: `1.5px solid ${ANTIGRAVITY_THEME.accentBorder}`,
                  borderBottom: `1.5px solid ${ANTIGRAVITY_THEME.accentBorder}`,
                  backgroundColor: "rgba(37, 99, 235, 0.04)",
                  borderRadius: 14,
                  pointerEvents: "none",
                }}
              />

              <DirectionalMotionBlur blurX={0} blurY={drumBlurY}>
                <div
                  style={{
                    position: "absolute",
                    left: 28,
                    right: 0,
                    top: 520 / 2 - rowHeight / 2,
                    transform: `translate3d(0, ${-drumIdx * rowHeight}px, 0)`,
                  }}
                >
                  {slotCapabilities.map((label, idx) => {
                    const dist = Math.abs(idx - drumIdx);
                    const isFocused = dist < 0.45;
                    return (
                      <div
                        key={label}
                        style={{
                          height: rowHeight,
                          display: "flex",
                          alignItems: "center",
                          gap: 20,
                          opacity: Math.max(0.22, 1 - dist * 0.52),
                        }}
                      >
                        <span
                          style={{
                            fontFamily: FONT_MONO,
                            fontSize: 22,
                            fontWeight: 700,
                            color: isFocused ? accentColor : ANTIGRAVITY_THEME.inkSoft,
                            fontVariantNumeric: "tabular-nums",
                            width: 44,
                          }}
                        >
                          0{idx + 1}
                        </span>
                        <span
                          style={{
                            fontSize: 72,
                            fontWeight: 800,
                            letterSpacing: "-0.045em",
                            lineHeight: 1.0,
                            color: isFocused ? ANTIGRAVITY_THEME.ink : ANTIGRAVITY_THEME.inkSoft,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </DirectionalMotionBlur>
            </div>
          </AbsoluteFill>
        </DirectionalMotionBlur>
      )}

      {/* PHASE B: 1-to-1 Wired 3-Node Spatial Agent Dataflow (Prompt -> Code Diff -> Verified Build) */}
      {!inPhaseA && (
        <DirectionalMotionBlur
          blurX={midWhipIn * 14}
          blurY={0}
          style={{
            transform: `translate3d(${midWhipIn * 480}px, 0, 0)`,
          }}
        >
          <AbsoluteFill
            style={{
              padding: "92px 124px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Clean Top Header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: accentColor,
                    textTransform: "uppercase",
                  }}
                >
                  02 / LIVE AGENT PIPELINE
                </span>
                <div
                  style={{
                    fontSize: 54,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.04,
                    color: ANTIGRAVITY_THEME.ink,
                  }}
                >
                  Wired from prompt to green build.
                </div>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 18px",
                  borderRadius: 10,
                  backgroundColor: node3Active ? ANTIGRAVITY_THEME.successBg : "#FFFFFF",
                  border: node3Active
                    ? `1.5px solid ${ANTIGRAVITY_THEME.successBorder}`
                    : `1px solid ${ANTIGRAVITY_THEME.borderStrong}`,
                  fontFamily: FONT_MONO,
                  fontSize: 18,
                  fontWeight: 700,
                  color: node3Active ? ANTIGRAVITY_THEME.success : ANTIGRAVITY_THEME.inkMuted,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <span>{node3Active ? "✓ READY TO MERGE" : "● PIPELINE RUNNING"}</span>
                <span>·</span>
                <span>2.7s</span>
              </div>
            </div>

            {/* Center 3-Node Horizontal Spatial Pipeline + Animated SVG Bezier Wires */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0,
              }}
            >
              {/* NODE 1: Prompt Input */}
              <div
                style={{
                  width: 460,
                  height: 410,
                  borderRadius: 18,
                  backgroundColor: "#FFFFFF",
                  border: `2px solid ${accentColor}`,
                  boxShadow: ANTIGRAVITY_THEME.shadowHero,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    height: 48,
                    padding: "0 20px",
                    backgroundColor: "#FAFBFC",
                    borderBottom: `1px solid ${ANTIGRAVITY_THEME.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 999, backgroundColor: accentColor }} />
                    <span style={{ fontSize: 18, fontWeight: 700, color: ANTIGRAVITY_THEME.ink }}>
                      01 · Prompt Spec
                    </span>
                  </div>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: accentColor }}>
                    INPUT
                  </span>
                </div>

                <div
                  style={{
                    flex: 1,
                    padding: "24px 22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 15,
                      fontWeight: 600,
                      color: accentColor,
                      backgroundColor: ANTIGRAVITY_THEME.accentSoft,
                      padding: "6px 12px",
                      borderRadius: 7,
                      alignSelf: "flex-start",
                    }}
                  >
                    {repoChip}
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      letterSpacing: "-0.025em",
                      lineHeight: 1.28,
                      color: ANTIGRAVITY_THEME.ink,
                    }}
                  >
                    “{promptText}”
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      fontFamily: FONT_MONO,
                      fontSize: 14,
                      fontWeight: 600,
                      color: ANTIGRAVITY_THEME.inkMuted,
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: ANTIGRAVITY_THEME.surfaceSubtle,
                        padding: "6px 10px",
                        borderRadius: 6,
                      }}
                    >
                      48 files
                    </span>
                    <span
                      style={{
                        backgroundColor: ANTIGRAVITY_THEME.surfaceSubtle,
                        padding: "6px 10px",
                        borderRadius: 6,
                      }}
                    >
                      TypeScript
                    </span>
                  </div>
                </div>
              </div>

              {/* WIRE 1 -> 2 */}
              <PipelineWireLight
                width={106}
                height={80}
                drawProgress={wire1Draw}
                pulseProgress={pulse1P}
                pulseOpacity={pulse1Vis}
                accentColor={accentColor}
              />

              {/* NODE 2: Multi-File Code Synthesis */}
              <div
                style={{
                  width: 490,
                  height: 410,
                  borderRadius: 18,
                  backgroundColor: "#FFFFFF",
                  border: node2Active
                    ? `2.5px solid ${accentColor}`
                    : `1.5px solid ${ANTIGRAVITY_THEME.borderStrong}`,
                  boxShadow: node2Active
                    ? `${ANTIGRAVITY_THEME.shadowHero}, 0 0 0 6px rgba(37,99,235,0.08)`
                    : ANTIGRAVITY_THEME.shadowCard,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  flexShrink: 0,
                  transform: `scale(${node2Active ? 0.985 + node2Pop * 0.015 : 0.985})`,
                }}
              >
                <div
                  style={{
                    height: 48,
                    padding: "0 20px",
                    backgroundColor: "#FAFBFC",
                    borderBottom: `1px solid ${ANTIGRAVITY_THEME.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: 999,
                        backgroundColor: node2Active ? accentColor : ANTIGRAVITY_THEME.inkSoft,
                      }}
                    />
                    <span style={{ fontSize: 18, fontWeight: 700, color: ANTIGRAVITY_THEME.ink }}>
                      02 · Code Synthesis
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 15,
                      fontWeight: 700,
                      color: ANTIGRAVITY_THEME.success,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    +{locCounter} −14
                  </span>
                </div>

                <div
                  style={{
                    flex: 1,
                    padding: "20px 22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 10,
                    fontFamily: FONT_MONO,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {[
                    { file: "src/api/webhooks.ts", delta: "+68" },
                    { file: "src/workers/retryQueue.ts", delta: "+74" },
                    { file: "tests/webhooks.test.ts", delta: "+44" },
                  ].map((item, idx) => {
                    const rowP = spring({
                      frame: Math.max(0, lf - sec(0.84 + idx * 0.08, fps)),
                      fps,
                      config: SPRING_EDITORIAL,
                    });
                    return (
                      <div
                        key={item.file}
                        style={{
                          padding: "13px 15px",
                          borderRadius: 10,
                          backgroundColor: node2Active
                            ? ANTIGRAVITY_THEME.successBg
                            : ANTIGRAVITY_THEME.surfaceSubtle,
                          border: node2Active
                            ? `1px solid ${ANTIGRAVITY_THEME.successBorder}`
                            : `1px solid ${ANTIGRAVITY_THEME.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          opacity: node2Active ? Math.max(0.4, rowP) : 0.45,
                          transform: `translate3d(${node2Active ? (1 - rowP) * 10 : 0}px, 0, 0)`,
                        }}
                      >
                        <span style={{ color: ANTIGRAVITY_THEME.ink }}>{item.file}</span>
                        <span style={{ color: ANTIGRAVITY_THEME.success, fontVariantNumeric: "tabular-nums" }}>
                          {item.delta}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* WIRE 2 -> 3 */}
              <PipelineWireLight
                width={106}
                height={80}
                drawProgress={wire2Draw}
                pulseProgress={pulse2P}
                pulseOpacity={pulse2Vis}
                accentColor={node3Active ? ANTIGRAVITY_THEME.success : accentColor}
              />

              {/* NODE 3: Verified Build Output */}
              <div
                style={{
                  width: 460,
                  height: 410,
                  borderRadius: 18,
                  backgroundColor: "#FFFFFF",
                  border: node3Active
                    ? `2.5px solid ${ANTIGRAVITY_THEME.success}`
                    : `1.5px solid ${ANTIGRAVITY_THEME.borderStrong}`,
                  boxShadow: node3Active
                    ? `${ANTIGRAVITY_THEME.shadowHero}, 0 0 0 6px rgba(5,150,105,0.10)`
                    : ANTIGRAVITY_THEME.shadowCard,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  flexShrink: 0,
                  transform: `scale(${node3Active ? 0.97 + node3Pop * 0.03 : 0.985})`,
                }}
              >
                <div
                  style={{
                    height: 48,
                    padding: "0 20px",
                    backgroundColor: node3Active ? ANTIGRAVITY_THEME.successBg : "#FAFBFC",
                    borderBottom: `1px solid ${ANTIGRAVITY_THEME.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: 999,
                        backgroundColor: node3Active
                          ? ANTIGRAVITY_THEME.success
                          : ANTIGRAVITY_THEME.inkSoft,
                      }}
                    />
                    <span style={{ fontSize: 18, fontWeight: 700, color: ANTIGRAVITY_THEME.ink }}>
                      03 · Verified Output
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 14,
                      fontWeight: 700,
                      color: node3Active ? ANTIGRAVITY_THEME.success : ANTIGRAVITY_THEME.inkMuted,
                    }}
                  >
                    {node3Active ? "VERIFIED" : "WAITING"}
                  </span>
                </div>

                <div
                  style={{
                    flex: 1,
                    padding: "24px 22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span
                      style={{
                        fontSize: 64,
                        fontWeight: 800,
                        letterSpacing: "-0.045em",
                        lineHeight: 1.0,
                        color: node3Active ? ANTIGRAVITY_THEME.success : ANTIGRAVITY_THEME.inkSoft,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {node3Active ? "18/18" : "0/18"}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 18,
                        fontWeight: 700,
                        color: node3Active ? ANTIGRAVITY_THEME.success : ANTIGRAVITY_THEME.inkMuted,
                      }}
                    >
                      TESTS PASS
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 9, fontFamily: FONT_MONO, fontSize: 16, fontWeight: 600 }}>
                    <div style={{ color: node3Active ? ANTIGRAVITY_THEME.ink : ANTIGRAVITY_THEME.inkSoft }}>
                      <span style={{ color: ANTIGRAVITY_THEME.success, marginRight: 8 }}>✓</span>
                      vitest run · 42ms
                    </div>
                    <div style={{ color: node3Active ? ANTIGRAVITY_THEME.ink : ANTIGRAVITY_THEME.inkSoft }}>
                      <span style={{ color: ANTIGRAVITY_THEME.success, marginRight: 8 }}>✓</span>
                      tsc --noEmit · 0 errors
                    </div>
                    <div style={{ color: node3Active ? ANTIGRAVITY_THEME.ink : ANTIGRAVITY_THEME.inkSoft }}>
                      <span style={{ color: ANTIGRAVITY_THEME.success, marginRight: 8 }}>✓</span>
                      PR ready to ship
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AbsoluteFill>
        </DirectionalMotionBlur>
      )}
    </AbsoluteFill>
  );
};
