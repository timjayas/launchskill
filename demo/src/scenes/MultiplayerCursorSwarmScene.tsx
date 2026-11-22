import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  EASE_IN_EXPO,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  getCaretOpacity,
  getNaturalTypedLength,
  SPRING_EDITORIAL,
} from "../lib/motion";
import { MotionflyEmblem } from "./LegacyStackDockScene";

export interface MultiplayerCursorSwarmSceneProps {
  thesisLine1?: string;
  thesisLine2?: string;
  agentRoles?: [string, string, string, string];
  brandWordmark?: string;
  ctaButtonText?: string;
  ctaUrl?: string;
  accentColor?: string;
}

const SWARM_ANCHORS = [
  { baseX: 430, baseY: 260, ampX: 34, ampY: 18, phase: 0.0, color: "#7C3AED" },
  { baseX: 1420, baseY: 270, ampX: 38, ampY: 22, phase: 1.7, color: "#DB2777" },
  { baseX: 470, baseY: 800, ampX: 36, ampY: 20, phase: 3.1, color: "#EA580C" },
  { baseX: 1380, baseY: 790, ampX: 34, ampY: 24, phase: 4.5, color: "#059669" },
];

/**
 * Archetype 3 — Scene 4 (210f / 7.0s @ 30fps):
 * Multiplayer Figma-style Agent Cursor Swarm + live caret type-over thesis ->
 * Fast 0.45s convergence match-cut -> Fast <=0.85s inline mark-to-wordmark reflow + 2.4s calm CTA hold.
 */
export const MultiplayerCursorSwarmScene: React.FC<MultiplayerCursorSwarmSceneProps> = ({
  thesisLine1 = "Studio launch films.",
  thesisLine2 = "In minutes, not weeks.",
  agentRoles = ["Script", "3D Stage", "Voice", "Audio Mix"],
  brandWordmark = "Motionfly",
  ctaButtonText = "Get Started Free",
  ctaUrl = "motionfly.co",
  accentColor = "#7C3AED",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cutToFinale = 114; // 3.80s cursor swarm & convergence -> 3.20s crisp lockup + CTA hold

  if (frame < cutToFinale) {
    const enterP = spring({ frame, fps, config: SPRING_EDITORIAL });

    // Natural caret type-over on Line 2 (zero contradictory copy!)
    const typedLen = getNaturalTypedLength(thesisLine2, frame, 12, 24, fps);
    const typedLine2 = thesisLine2.slice(0, typedLen);
    const isTyping = frame >= 12 && typedLen < thesisLine2.length;
    const caretOp = getCaretOpacity(frame, isTyping, fps);

    // Brisk 14f convergence inward into center mark right at cutToFinale
    const converge = interpolate(frame, [cutToFinale - 14, cutToFinale], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    });

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#FFFFFF",
          fontFamily: FONT_SANS,
          alignItems: "center",
          justifyContent: "center",
          padding: "90px 120px",
        }}
      >
        {/* 4 Color-Coded Multiplayer Agent Cursors on Continuous Deterministic Micro-Orbits */}
        {SWARM_ANCHORS.map((anchor, idx) => {
          const pillIn = spring({ frame: Math.max(0, frame - (4 + idx * 3)), fps, config: SPRING_EDITORIAL });
          const orbitX = anchor.baseX + Math.sin(frame * 0.065 + anchor.phase) * anchor.ampX;
          const orbitY = anchor.baseY + Math.cos(frame * 0.055 + anchor.phase) * anchor.ampY;
          const x = interpolate(converge, [0, 1], [orbitX, 960]);
          const y = interpolate(converge, [0, 1], [orbitY, 540]);
          const scale = pillIn * (1 - converge * 0.65);

          return (
            <div
              key={agentRoles[idx]}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity: pillIn * (1 - converge * 0.9),
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
                zIndex: 20,
              }}
            >
              {/* Crisp Multiplayer Pointer */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4.5 3L19.5 11.8L12.2 13.8L9.2 20.8L4.5 3Z"
                  fill={anchor.color}
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Strict Zod-Validated Role Pill (Zero garbled AI labels!) */}
              <div
                style={{
                  marginTop: 14,
                  padding: "8px 16px",
                  borderRadius: 999,
                  backgroundColor: anchor.color,
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  boxShadow: "0 10px 26px rgba(10,10,12,0.14)",
                  whiteSpace: "nowrap",
                }}
              >
                {agentRoles[idx]}
              </div>
            </div>
          );
        })}

        {/* Centered Two-Tone Editorial Thesis */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            transform: `scale(${(0.95 + enterP * 0.05) * (1 - converge * 0.35)}) rotate(${-converge * 4}deg)`,
            opacity: enterP * (1 - converge * 0.92),
          }}
        >
          <div
            style={{
              fontSize: 94,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 1.06,
              color: "#0B0B0F",
            }}
          >
            {thesisLine1}
          </div>

          <div
            style={{
              fontSize: 94,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 1.06,
              color: "#71717A",
              display: "flex",
              alignItems: "center",
              minHeight: 104,
            }}
          >
            <span>{typedLine2}</span>
            <span
              style={{
                display: "inline-block",
                width: 4.5,
                height: 82,
                marginLeft: 6,
                borderRadius: 3,
                backgroundColor: accentColor,
                opacity: caretOp,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // Phase 2 (lf = 0..96 / 3.2s): Fast <=0.85s Inline Mark -> Wordmark Reflow + Rock-Solid 2.35s CTA Hold
  const lf = frame - cutToFinale;
  const markPop = spring({ frame: lf, fps, config: SPRING_EDITORIAL });
  const markRot = interpolate(lf, [0, 14], [-38, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const wordReflow = interpolate(lf, [10, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const wordWidth = interpolate(wordReflow, [0, 1], [0, 520]);
  const wordGap = interpolate(wordReflow, [0, 1], [0, 24]);

  const ctaP = interpolate(lf, [18, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        fontFamily: FONT_SANS,
        alignItems: "center",
        justifyContent: "center",
        padding: "90px 120px",
      }}
    >
      {/* Subtle Studio Violet Aura */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "47%",
          width: 1100,
          height: 600,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Inline Mark -> Wordmark Reflow Lockup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
            transform: `scale(${0.86 + markPop * 0.14})`,
          }}
        >
          <div style={{ transform: `rotate(${markRot}deg)` }}>
            <MotionflyEmblem size={102} bg="#0B0B0F" fg="#FFFFFF" />
          </div>
          <div
            style={{
              width: wordWidth,
              marginLeft: wordGap,
              overflow: "hidden",
              padding: "8px 0 18px",
            }}
          >
            <span
              style={{
                fontSize: 108,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 1.12,
                color: "#0B0B0F",
                whiteSpace: "nowrap",
                display: "inline-block",
                transform: `translateX(${(1 - wordReflow) * -28}px)`,
                opacity: wordReflow,
              }}
            >
              {brandWordmark}
            </span>
          </div>
        </div>

        {/* Crisp Unified CTA Capsule + URL */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            transform: `translateY(${(1 - ctaP) * 18}px)`,
            opacity: ctaP,
          }}
        >
          <div
            style={{
              padding: "20px 44px",
              borderRadius: 999,
              backgroundColor: "#0B0B0F",
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              boxShadow: "0 18px 42px rgba(11,11,15,0.16)",
            }}
          >
            {ctaButtonText} →
          </div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 24,
              fontWeight: 600,
              color: "#71717A",
              letterSpacing: "0.02em",
            }}
          >
            {ctaUrl}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
