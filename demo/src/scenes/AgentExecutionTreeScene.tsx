import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SpatialCameraRig, TactileCursor } from "../components/StudioPrimitives";
import {
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  getCaretOpacity,
  getNaturalTypedLength,
  SPRING_EDITORIAL,
  SPRING_POP,
} from "../lib/motion";
import { MotionflyEmblem } from "./LegacyStackDockScene";

export interface AgentExecutionTreeSceneProps {
  promptHeader?: string;
  styleChipLabel?: string;
  promptText?: string;
  agentSteps?: string[];
  accentColor?: string;
  tealColor?: string;
}

const DEFAULT_STEPS = [
  "Writing the launch script",
  "Building 3D device stage",
  "Animating kinetic typography",
  "Synthesizing studio voiceover",
  "Mixing 120 BPM music & SFX",
];

/**
 * Archetype 3 — Scene 2 (240f / 8.0s @ 30fps):
 * Style-chip prompt bar -> Smooth 1.72x macro typing & crisp tactile click (zero rubbery border warp!) ->
 * Prompt docks top-right as chat bubble + 5-step vertical connected MCP pipeline tree completing ALL steps!
 */
export const AgentExecutionTreeScene: React.FC<AgentExecutionTreeSceneProps> = ({
  promptHeader = "Prompt a Video",
  styleChipLabel = "Style · Product launch",
  promptText = "A 30-second launch video for my habit app, upbeat & modern",
  agentSteps = DEFAULT_STEPS,
  accentColor = "#7C3AED",
  tealColor = "#0D9488",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cutToTree = 104; // 3.47s prompt & macro click -> 4.53s full 5-step execution tree

  if (frame < cutToTree) {
    // Smooth 8f optical camera push-in synced with natural typing (eliminates wide tiny typing wait)
    const barIn = spring({ frame, fps, config: SPRING_EDITORIAL });
    const macroPush = interpolate(frame, [10, 19], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });

    const typedLen = getNaturalTypedLength(promptText, frame, 14, 34, fps);
    const typedStr = promptText.slice(0, typedLen);
    const isTyping = frame >= 14 && typedLen < promptText.length;
    const caretOp = getCaretOpacity(frame, isTyping, fps);

    // Keep full typed prompt + submit button cleanly inside viewport
    const panRight = interpolate(frame, [66, 78], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const focusX = interpolate(macroPush, [0, 1], [960, 960 + panRight * 90]);
    const focusY = interpolate(macroPush, [0, 1], [540, 565]);
    const zoom = 1 + macroPush * 0.62; // 1.0 -> 1.62x (100% legible on 360px mobile, zero clipped chars)

    // Crisp tactile submit click at f=84 (ZERO rubbery border warp!)
    const clickFrame = 84;
    const cursorT = interpolate(frame, [68, 81], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const cursorX = interpolate(cursorT, [0, 1], [1260, 1434]);
    const cursorY = interpolate(cursorT, [0, 1], [720, 624]);
    const clickScale = interpolate(frame, [clickFrame, clickFrame + 2, clickFrame + 6], [1, 0.86, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const clicked = frame >= clickFrame;
    const rippleP = interpolate(frame, [clickFrame, clickFrame + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });

    return (
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", fontFamily: FONT_SANS }}>
        <SpatialCameraRig focusX={focusX} focusY={focusY} zoom={zoom}>
          <div style={{ width: 1920, height: 1080, position: "relative" }}>
            {/* Subtle lavender studio aura */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "48%",
                width: 1180,
                height: 620,
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Header: Emblem + "Prompt a Video" */}
            <div
              style={{
                position: "absolute",
                top: 290,
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                transform: `translateY(${(1 - barIn) * 20}px)`,
                opacity: barIn,
              }}
            >
              <MotionflyEmblem size={68} bg="#0B0B0F" fg="#FFFFFF" />
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  color: "#0B0B0F",
                }}
              >
                {promptHeader}
              </div>
            </div>

            {/* Rounded Chat Prompt Card with Style Preset Chip */}
            <div
              style={{
                position: "absolute",
                left: 410,
                top: 486,
                width: 1100,
                minHeight: 178,
                borderRadius: 28,
                backgroundColor: "#FFFFFF",
                border: clicked ? `2px solid ${tealColor}` : `2px solid ${accentColor}`,
                boxShadow: clicked
                  ? "0 24px 64px rgba(13,148,136,0.16), 0 0 0 6px rgba(13,148,136,0.12)"
                  : "0 24px 64px rgba(124,58,237,0.12), 0 0 0 5px rgba(124,58,237,0.08)",
                padding: "28px 30px 22px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 26,
                transform: `scale(${0.95 + barIn * 0.05})`,
              }}
            >
              {/* Typed Prompt Row */}
              <div
                style={{
                  fontSize: 31,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: "#0B0B0F",
                  lineHeight: 1.28,
                  minHeight: 42,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span>{typedStr}</span>
                <span
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: 34,
                    marginLeft: 3,
                    borderRadius: 2,
                    backgroundColor: clicked ? tealColor : accentColor,
                    opacity: caretOp,
                  }}
                />
              </div>

              {/* Bottom Controls Row: + Button, Style Chip, Mic, Submit Button */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      border: "1.5px solid #E4E4E7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      color: "#52525B",
                    }}
                  >
                    +
                  </div>
                  <div
                    style={{
                      height: 44,
                      padding: "0 16px",
                      borderRadius: 12,
                      backgroundColor: "#F5F3FF",
                      border: "1.5px solid #DDD6FE",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: FONT_MONO,
                      fontSize: 15,
                      fontWeight: 600,
                      color: accentColor,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: accentColor,
                      }}
                    />
                    <span>{styleChipLabel}</span>
                  </div>
                </div>

                {/* Right Submit Pill (Violet -> Teal on click) */}
                <div style={{ position: "relative", width: 52, height: 52 }}>
                  {clicked && rippleP < 1 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -10,
                        borderRadius: 18,
                        border: `2.5px solid ${tealColor}`,
                        transform: `scale(${0.8 + rippleP * 0.7})`,
                        opacity: 1 - rippleP,
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      backgroundColor: clicked ? tealColor : accentColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `scale(${clickScale})`,
                      boxShadow: clicked
                        ? "0 8px 20px rgba(13,148,136,0.34)"
                        : "0 8px 20px rgba(124,58,237,0.30)",
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 19V5M12 5L6 11M12 5L18 11"
                        stroke="#FFFFFF"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {frame >= 68 && (
              <TactileCursor
                x={cursorX}
                y={cursorY}
                scale={clickScale * 0.92}
                fill={accentColor}
              />
            )}
          </div>
        </SpatialCameraRig>
      </AbsoluteFill>
    );
  }

  // Phase 2 (lf = 0..136): Docked User Prompt Bubble + Complete 5-Step Connected Agent Execution Tree
  const lf = frame - cutToTree;
  const bubbleIn = spring({ frame: lf, fps, config: SPRING_EDITORIAL });

  // Stagger every step tightly (18f / 0.60s cadence) so ALL 5 steps finish cleanly before cutting!
  const stepCadence = 18;
  const allDoneFrame = 12 + agentSteps.length * stepCadence + 8; // lf = 110 (0.87s calm Ready hold!)
  const readyPop = spring({ frame: Math.max(0, lf - allDoneFrame), fps, config: SPRING_POP });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        fontFamily: FONT_SANS,
        padding: "104px 160px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top-Right Docked User Chat Bubble */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          transform: `translateY(${(1 - bubbleIn) * 24}px)`,
          opacity: bubbleIn,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            padding: "22px 32px",
            borderRadius: "24px 24px 6px 24px",
            backgroundColor: "#F4F4F6",
            border: "1px solid #E4E4E7",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "#18181B",
            boxShadow: "0 12px 32px rgba(10,10,12,0.05)",
          }}
        >
          {promptText}
        </div>
      </div>

      {/* Left-Aligned Vertical Connected MCP Execution Tree */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 24 }}>
        {/* Agent Status Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 34 }}>
          <MotionflyEmblem size={42} bg="#0B0B0F" fg="#FFFFFF" />
          <span
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: lf >= allDoneFrame ? tealColor : accentColor,
            }}
          >
            {lf >= allDoneFrame ? "Film built in one shot" : "Motionfly MCP · Generating..."}
          </span>

          {lf >= allDoneFrame && (
            <div
              style={{
                marginLeft: 12,
                padding: "8px 18px",
                borderRadius: 999,
                backgroundColor: "#CCFBF1",
                border: `1.5px solid ${tealColor}`,
                fontFamily: FONT_MONO,
                fontSize: 16,
                fontWeight: 700,
                color: "#0F766E",
                transform: `scale(${0.8 + readyPop * 0.2})`,
                opacity: readyPop,
              }}
            >
              ✓ READY · 0:30 · 1080P
            </div>
          )}
        </div>

        {/* Connected 5-Step Pipeline Spine */}
        <div style={{ display: "flex", flexDirection: "column", paddingLeft: 18 }}>
          {agentSteps.map((stepLabel, idx) => {
            const startF = 10 + idx * stepCadence;
            const doneF = startF + 13;
            const appear = spring({ frame: Math.max(0, lf - startF), fps, config: SPRING_EDITORIAL });
            const isDone = lf >= doneF;
            const checkPop = spring({ frame: Math.max(0, lf - doneF), fps, config: SPRING_POP });
            const connectorDraw = interpolate(lf, [startF + 6, startF + stepCadence], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE_OUT_EXPO,
            });

            if (lf < startF - 2) return null;

            return (
              <div key={stepLabel} style={{ display: "flex", alignItems: "stretch", gap: 22 }}>
                {/* Vertical Spine Column (Status Icon + Hairline Connector) */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 34 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 999,
                      backgroundColor: isDone ? tealColor : "#F5F3FF",
                      border: isDone ? `2px solid ${tealColor}` : `2.5px dashed ${accentColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: isDone
                        ? `scale(${0.85 + checkPop * 0.15})`
                        : `rotate(${(lf - startF) * 14}deg)`,
                      flexShrink: 0,
                    }}
                  >
                    {isDone && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="#FFFFFF"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  {idx < agentSteps.length - 1 && (
                    <div
                      style={{
                        width: 2.5,
                        height: 44,
                        backgroundColor: "#E4E4E7",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: `${connectorDraw * 100}%`,
                          backgroundColor: isDone ? tealColor : accentColor,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Step Label & Timing Spec */}
                <div
                  style={{
                    paddingBottom: idx < agentSteps.length - 1 ? 30 : 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    transform: `translateY(${(1 - appear) * 14}px)`,
                    opacity: appear,
                  }}
                >
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: isDone ? 650 : 700,
                      letterSpacing: "-0.025em",
                      color: isDone ? "#18181B" : accentColor,
                    }}
                  >
                    {stepLabel}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 15,
                      fontWeight: 600,
                      color: isDone ? tealColor : "#A1A1AA",
                    }}
                  >
                    {isDone ? "DONE" : "RUNNING..."}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
