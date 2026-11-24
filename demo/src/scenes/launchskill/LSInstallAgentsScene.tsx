import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AgentBrandIcon,
  type CodingAgentId,
  LS_THEME,
  LaunchSkillCyclorama,
  MaskedHeadline,
} from "../../components/LaunchSkillPrimitives";
import {
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  computeHarmonicStagger,
  getCaretOpacity,
  getSpringForMass,
  sec,
} from "../../lib/studioMotion";

const AGENTS: Array<{ id: CodingAgentId; name: string }> = [
  { id: "claude", name: "Claude Code" },
  { id: "cursor", name: "Cursor" },
  { id: "codex", name: "Codex" },
  { id: "opencode", name: "OpenCode" },
];

/**
 * Shot 4 (12.0s - 15.0s | f360 - f450 @ 30fps, local f0 - f90):
 *   - Architectural Playhead Curtain Wipe (local f0-f10): The Vermilion Playhead sweeps
 *     left-to-right across the entire 1920px viewport, peeling away Shot 3C's obsidian
 *     surface to reveal warm archival paper (#F7F6F2)!
 *   - Copy restraint: "Works everywhere." (2 words).
 *   - Center Hero: Dark-Mode macOS CLI pill typing "$ npx skills add timjayas/launchskill"
 *     with the Vermilion Caret back at the cursor tip.
 *   - Underneath: 4 official vector agent badges cascade harmonically from the pill.
 *   - Final 8 frames gently contract pill width to match-cut into Shot 5's mark!
 */
export const LSInstallAgentsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Architectural curtain wipe driven by the Vermilion Playhead (0 -> 1 over 0.30s)
  const wipeP = interpolate(frame, [0, sec(0.3, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const wipeX = wipeP * 1920;

  // Gentle living pull-back across the 3.0s hold (zero dead frames!)
  const stageZoom = interpolate(frame, [0, sec(3.0, fps)], [1.045, 0.99], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typing CLI command crisply with natural momentum
  const cliCommand = "npx skills add timjayas/launchskill";
  const typedLen = Math.min(
    cliCommand.length,
    Math.floor(
      interpolate(frame, [sec(0.22, fps), sec(1.38, fps)], [0, cliCommand.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );
  const typedCmd = cliCommand.slice(0, typedLen);
  const isTyping = frame >= sec(0.22, fps) && typedLen < cliCommand.length;
  const caretOpacity = getCaretOpacity(frame, isTyping, fps);

  // Pill is ALREADY present behind the peeling playhead curtain (zero empty-frame flash!)
  const pillEnter = spring({
    frame: frame + sec(0.14, fps),
    fps,
    config: getSpringForMass("card"),
  });

  // Subtle anticipation contraction in final 0.22s before morphing into Finale mark
  const handoffOut = interpolate(frame, [sec(2.74, fps), sec(3.0, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Outgoing Obsidian Layer behind the peeling curtain (visible during f0-f10) */}
      {wipeP < 0.995 && (
        <AbsoluteFill style={{ backgroundColor: LS_THEME.obsidianMid }} />
      )}

      {/* Incoming Bright Studio Paper World revealed by Playhead Curtain Wipe */}
      <AbsoluteFill
        style={{
          clipPath: `inset(0 ${Math.max(0, (1 - wipeP) * 100)}% 0 0)`,
        }}
      >
        <LaunchSkillCyclorama zoom={stageZoom} />

        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${stageZoom})`,
          }}
        >
          {/* Top Editorial Headline (2 words — already waiting behind playhead curtain!) */}
          <div style={{ marginBottom: 56 }}>
            <MaskedHeadline
              startFrame={-sec(0.18, fps)}
              fontSize={86}
              words={[
                { text: "Works" },
                { text: "everywhere.", italic: true, accent: LS_THEME.vermilion },
              ]}
            />
          </div>

          {/* Sleek Dark-Mode macOS Terminal Command Pill */}
          <div
            style={{
              width: interpolate(handoffOut, [0, 1], [960, 760]),
              height: 108,
              borderRadius: 22,
              backgroundColor: LS_THEME.deckSurface,
              border: "1px solid rgba(255,255,255,0.13)",
              boxShadow: LS_THEME.shadowDeck,
              display: "flex",
              alignItems: "center",
              padding: "0 34px",
              boxSizing: "border-box",
              transform: `scale(${0.94 + pillEnter * 0.06})`,
              opacity: Math.min(1, pillEnter * 1.3),
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top specular hairline */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 28,
                right: 28,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.24) 50%, transparent 100%)",
              }}
            />

            <div style={{ display: "flex", gap: 8, marginRight: 28, flexShrink: 0 }}>
              <span style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: "#FF5F56" }} />
              <span style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: "#FFBD2E" }} />
              <span style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: "#27C93F" }} />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontFamily: FONT_MONO,
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: LS_THEME.vermilion }}>$</span>
              <span style={{ color: "#FAF9F6" }}>{typedCmd}</span>
              {/* Hero Motif: Vermilion Caret back at cursor tip */}
              <span
                style={{
                  display: "inline-block",
                  width: 3.5,
                  height: 32,
                  borderRadius: 2,
                  backgroundColor: LS_THEME.vermilion,
                  boxShadow: `0 0 14px ${LS_THEME.vermilionGlow}`,
                  opacity: caretOpacity,
                  marginLeft: -4,
                }}
              />
            </div>
          </div>

          {/* 4 Official Vector Agent Badges cascading harmonically below the CLI pill */}
          <div
            style={{
              marginTop: 52,
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: 1 - handoffOut * 0.7,
              transform: `translateY(${handoffOut * -14}px)`,
            }}
          >
            {AGENTS.map((agent, idx) => {
              const delay = sec(0.72, fps) + computeHarmonicStagger(idx, 0.08, fps, 0.85);
              const p = spring({
                frame: Math.max(0, frame - delay),
                fps,
                config: getSpringForMass("card"),
              });
              const scale = 0.92 + p * 0.08;
              const y = (1 - p) * 20;

              return (
                <div
                  key={agent.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 26px",
                    borderRadius: 16,
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${LS_THEME.paperBorder}`,
                    boxShadow: LS_THEME.shadowCard,
                    transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    opacity: Math.min(1, p * 1.4),
                  }}
                >
                  <AgentBrandIcon agent={agent.id} size={28} />
                  <span
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 21,
                      fontWeight: 650,
                      letterSpacing: "-0.02em",
                      color: LS_THEME.ink,
                    }}
                  >
                    {agent.name}
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Hero Motif: Full-Height Vermilion Playhead Driving the Curtain Wipe */}
      {wipeP < 0.995 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: wipeX - 3,
            width: 6,
            backgroundColor: LS_THEME.vermilion,
            boxShadow: `0 0 36px ${LS_THEME.vermilionGlow}`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
