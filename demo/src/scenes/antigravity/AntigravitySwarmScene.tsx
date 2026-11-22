import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ANTIGRAVITY_THEME,
  AntigravityMark,
  StudioLightBackdrop,
} from "../../components/AntigravityPrimitives";
import {
  EASE_IN_EXPO,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  SPRING_EDITORIAL,
  getCaretOpacity,
  getNaturalTypedLength,
  sec,
} from "../../lib/studioMotion";

export interface AntigravitySwarmSceneProps {
  thesisLine1: string;
  thesisLine2: string;
  agentRoles: [string, string, string, string];
  accentColor: string;
  skyColor: string;
}

interface SwarmArtifactAgent {
  role: string;
  status: string;
  cardTitle: string;
  cardSnippet: string;
  baseX: number;
  baseY: number;
  accent: string;
  tint: string;
  spawnDelaySec: number;
}

/**
 * Shot 5 (Beats 34 -> 41, 3.5s): Freeform Light Dot-Grid Multi-Agent Canvas Bloom & Swarm
 * - 4 parallel coding agents spawn live tactile mini artifact cards in the 4 quadrants with localized
 *   cobalt dot-grid ripples (zero node wires, zero overlap with center thesis!).
 * - Center thesis pairs Inter Bold + italic Instrument Serif ("In parallel.").
 * - Converges smoothly inward (EASE_IN_EXPO) into a pure-white gallery bloom centered on the Antigravity mark!
 */
export const AntigravitySwarmScene: React.FC<AntigravitySwarmSceneProps> = ({
  thesisLine1,
  thesisLine2,
  agentRoles,
  accentColor,
  skyColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Head-start so cut-on frame is already alive & crisp (zero blank flash!)
  const enterSpring = spring({
    frame: frame + sec(0.12, fps),
    fps,
    config: SPRING_EDITORIAL,
  });

  const typeStart = sec(0.2, fps);
  const typedLen = getNaturalTypedLength(thesisLine2, frame, typeStart, 28, fps);
  const isTyping = frame >= typeStart && typedLen < thesisLine2.length;
  const caretOpacity = getCaretOpacity(frame, isTyping, fps);

  // Convergence + pure-white light bloom into Shot 6
  const convergeStart = sec(2.65, fps);
  const convergeEnd = sec(3.1, fps);
  const bloomStart = sec(3.0, fps);
  const bloomEnd = sec(3.4, fps);

  const convergeP = interpolate(frame, [convergeStart, convergeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const bloomRadius = interpolate(frame, [bloomStart, bloomEnd], [0, 1340], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const copyFade = interpolate(frame, [convergeStart, convergeStart + sec(0.3, fps)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const tSec = frame / fps;

  const agents: SwarmArtifactAgent[] = [
    {
      role: agentRoles[0],
      status: "48 files",
      cardTitle: "AST Dependency Map",
      cardSnippet: "api/ → workers/ → stripe",
      baseX: 310,
      baseY: 225,
      accent: accentColor,
      tint: "#EFF6FF",
      spawnDelaySec: 0.08,
    },
    {
      role: agentRoles[1],
      status: "+186 loc",
      cardTitle: "webhooks.ts",
      cardSnippet: "verifySignature + enqueue",
      baseX: 1610,
      baseY: 225,
      accent: skyColor,
      tint: "#F0F9FF",
      spawnDelaySec: 0.22,
    },
    {
      role: agentRoles[2],
      status: "18/18 ✓",
      cardTitle: "Vitest Sandbox",
      cardSnippet: "42ms · 0 regressions",
      baseX: 310,
      baseY: 855,
      accent: ANTIGRAVITY_THEME.success,
      tint: "#ECFDF5",
      spawnDelaySec: 0.36,
    },
    {
      role: agentRoles[3],
      status: "200 OK",
      cardTitle: "Live Browser QA",
      cardSnippet: "checkout webhook verified",
      baseX: 1610,
      baseY: 855,
      accent: ANTIGRAVITY_THEME.ink,
      tint: "#F1F5F9",
      spawnDelaySec: 0.5,
    },
  ];

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      <StudioLightBackdrop surface="canvas" showGrid glowX="50%" glowY="50%" glowIntensity={0.11} />

      {/* Center Editorial Two-Tone Thesis */}
      <AbsoluteFill
        style={{
          padding: "96px 140px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: copyFade,
          transform: `scale(${1 - convergeP * 0.08})`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 18px",
            borderRadius: 999,
            backgroundColor: "#FFFFFF",
            border: `1.5px solid ${ANTIGRAVITY_THEME.borderStrong}`,
            boxShadow: ANTIGRAVITY_THEME.shadowCard,
            marginBottom: 28,
            opacity: Math.min(1, enterSpring * 1.2),
            transform: `translate3d(0, ${(1 - enterSpring) * 14}px, 0)`,
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
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: ANTIGRAVITY_THEME.ink,
              textTransform: "uppercase",
            }}
          >
            03 / PARALLEL AGENT SWARM
          </span>
        </div>

        <div
          style={{
            fontSize: 98,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
            color: ANTIGRAVITY_THEME.inkMuted,
            textAlign: "center",
            opacity: Math.min(1, enterSpring * 1.25),
            transform: `translate3d(0, ${(1 - enterSpring) * 18}px, 0)`,
          }}
        >
          {thesisLine1}
        </div>

        <div
          style={{
            fontFamily: FONT_SERIF,
            fontStyle: "italic",
            fontSize: 136,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.02,
            color: ANTIGRAVITY_THEME.ink,
            textAlign: "center",
            minHeight: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>{thesisLine2.slice(0, typedLen)}</span>
          <span
            style={{
              display: "inline-block",
              width: 5,
              height: 98,
              marginLeft: 8,
              borderRadius: 3,
              backgroundColor: accentColor,
              opacity: caretOpacity,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* 4 Parallel Agents Spawning Live Tactile Mini Artifact Cards + Radial Dot-Grid Ripples */}
      {agents.map((agent, idx) => {
        const spawnStart = sec(agent.spawnDelaySec, fps);
        const cardPop = spring({
          frame: Math.max(0, frame - spawnStart),
          fps,
          config: SPRING_EDITORIAL,
        });

        const rippleP = interpolate(frame, [spawnStart, spawnStart + sec(0.6, fps)], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });

        const floatX = Math.cos(tSec * 1.6 + idx * 1.5) * 10 * cardPop;
        const floatY = Math.sin(tSec * 1.9 + idx * 1.2) * 8 * cardPop;

        const cx = interpolate(convergeP, [0, 1], [agent.baseX + floatX, 960]);
        const cy = interpolate(convergeP, [0, 1], [agent.baseY + floatY, 540]);
        const scale = (0.72 + cardPop * 0.28) * (1 - convergeP * 0.52);
        const opacity = Math.min(1, cardPop * 1.3) * (1 - convergeP * 0.92);

        return (
          <React.Fragment key={agent.role}>
            {/* Localized Radial Dot-Grid Generation Ripple */}
            {rippleP > 0.01 && rippleP < 0.99 && convergeP < 0.1 && (
              <div
                style={{
                  position: "absolute",
                  left: agent.baseX - 150,
                  top: agent.baseY - 150,
                  width: 300,
                  height: 300,
                  borderRadius: 9999,
                  border: `2px solid ${agent.accent}`,
                  backgroundColor: agent.tint,
                  opacity: (1 - rippleP) * 0.36,
                  transform: `scale(${0.55 + rippleP * 0.85})`,
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Mini Tactile Artboard Card + Attached Agent Cursor Pill */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: `translate3d(${cx - 170}px, ${cy - 68}px, 0) scale(${scale})`,
                opacity,
                pointerEvents: "none",
              }}
            >
              {/* Spawned Artifact Card */}
              <div
                style={{
                  width: 340,
                  borderRadius: 14,
                  backgroundColor: "#FFFFFF",
                  border: `1.5px solid ${ANTIGRAVITY_THEME.borderStrong}`,
                  boxShadow: ANTIGRAVITY_THEME.shadowCard,
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{
                      fontSize: 19,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: ANTIGRAVITY_THEME.ink,
                    }}
                  >
                    {agent.cardTitle}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 14,
                      fontWeight: 700,
                      color: agent.accent,
                      backgroundColor: agent.tint,
                      padding: "3px 9px",
                      borderRadius: 6,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {agent.status}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 15,
                    fontWeight: 500,
                    color: ANTIGRAVITY_THEME.inkMuted,
                  }}
                >
                  {agent.cardSnippet}
                </div>
              </div>

              {/* Crisp Dark-Pill Agent Cursor Floating Cleanly Above Card Top Edge */}
              <div
                style={{
                  position: "absolute",
                  top: -42,
                  left: idx % 2 === 0 ? -12 : 190,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 4,
                }}
              >
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4.5 3L19.5 11.8L12.2 13.8L9.2 20.8L4.5 3Z"
                    fill="#0B0D12"
                    stroke="#FFFFFF"
                    strokeWidth={1.6}
                    strokeLinejoin="round"
                  />
                </svg>
                <div
                  style={{
                    marginTop: 10,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "5px 12px",
                    borderRadius: 8,
                    backgroundColor: "#0B0D12",
                    color: "#FFFFFF",
                    fontSize: 15,
                    fontWeight: 700,
                    boxShadow: "0 10px 24px rgba(11,13,18,0.22)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      backgroundColor: agent.accent,
                    }}
                  />
                  <span>{agent.role}</span>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Pure-White Gallery Convergence Bloom into Shot 6 Finale */}
      {bloomRadius > 1 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: bloomRadius * 2,
              height: bloomRadius * 2,
              flexShrink: 0,
              borderRadius: 9999,
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 80px rgba(37, 99, 235, 0.16)",
            }}
          >
            {bloomRadius > 80 && (
              <div style={{ transform: "translate3d(0, -82px, 0)" }}>
                <AntigravityMark
                  size={88}
                  variant="badge"
                  accentColor={accentColor}
                  skyColor={skyColor}
                />
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
