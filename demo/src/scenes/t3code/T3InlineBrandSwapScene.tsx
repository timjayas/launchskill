import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AgentAppIcon,
  FONT_SANS,
  T3_THEME,
  T3DirectionalBlur,
  T3StudioCyclorama,
  type AgentBrandId,
} from "../../components/T3CodePrimitives";
import {
  EASE_IN_EXPO,
  EASE_OUT_EXPO,
  sec,
} from "../../lib/studioMotion";

export interface T3InlineBrandSwapSceneProps {
  line1Muted: string;
  line2Suffix: string;
}

const SWAP_AGENTS: Array<{ brand: AgentBrandId; label: string }> = [
  { brand: "claude", label: "Claude Code" },
  { brand: "codex", label: "Codex CLI" },
  { brand: "opencode", label: "OpenCode" },
  { brand: "cursor", label: "Cursor" },
];

/**
 * Beat 4 (Beats 24 -> 30 @ 132 BPM, 2.73s = 82f): Airy Official-Logo Keys Swap -> Dark Climax Punch
 * - Continuous subtle living scale drift (0.98 -> 1.04) across 4 brisk official-logo flips.
 * - Velocity forward punch (scale 1.0 -> 1.18) right on Bar 30 downbeat into the #141413 Dark Climax!
 */
export const T3InlineBrandSwapScene: React.FC<T3InlineBrandSwapSceneProps> = ({
  line1Muted,
  line2Suffix,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enterP = interpolate(frame, [0, sec(0.22, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const liveDrift = interpolate(frame, [0, durationInFrames], [0.98, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitLead = sec(0.2, fps);
  const exitP = interpolate(
    frame,
    [durationInFrames - exitLead, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    }
  );

  // 4 official logos cycling briskly on 0.56s intervals
  const switchTimes = [0, 0.56, 1.12, 1.68];
  const swapDur = sec(0.15, fps);

  let activeIdx = 0;
  let prevIdx = 0;
  let swapP = 1;

  for (let i = 1; i < switchTimes.length; i++) {
    const startF = sec(switchTimes[i], fps);
    if (frame >= startF) {
      activeIdx = i;
      prevIdx = i - 1;
      swapP = interpolate(frame, [startF, startF + swapDur], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: EASE_OUT_EXPO,
      });
    }
  }

  const swapBlurY = swapP > 0.02 && swapP < 0.9 ? Math.sin(swapP * Math.PI) * 9.5 : 0;
  const slotSize = 148;
  const displayIdx = activeIdx > 0 && swapP < 0.45 ? prevIdx : activeIdx;

  // Tactile beat-synced micro-breath on surrounding typography each time an official logo snaps in
  const swapKick = activeIdx > 0 ? Math.sin(swapP * Math.PI) : 0;
  const textKickScale = 1 + swapKick * 0.016;

  const stageScale = (0.88 + enterP * 0.12) * liveDrift * (1 + exitP * 0.18);
  const stageOpacity = Math.max(0.86, Math.min(1, enterP * 1.45)) * (1 - exitP * 0.45);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      <T3StudioCyclorama
        zoom={stageScale}
        panY={interpolate(frame, [0, durationInFrames], [14, -22])}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          transform: `scale(${stageScale * textKickScale})`,
          opacity: stageOpacity,
        }}
      >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div
          style={{
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: "-0.046em",
            lineHeight: 1.04,
            color: T3_THEME.inkMuted,
          }}
        >
          {line1Muted}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 28,
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: "-0.046em",
            lineHeight: 1.04,
            color: T3_THEME.ink,
          }}
        >
          <div
            style={{
              position: "relative",
              width: slotSize,
              height: slotSize,
              marginLeft: -14,
              marginRight: -14,
              overflow: "hidden",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
            }}
          >
            <T3DirectionalBlur blurX={0} blurY={swapBlurY}>
              <div style={{ position: "relative", width: slotSize, height: slotSize }}>
                {activeIdx > 0 && swapP < 0.99 && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `translate3d(0, ${-swapP * slotSize}px, 0)`,
                      opacity: 1 - swapP,
                    }}
                  >
                    <AgentAppIcon brand={SWAP_AGENTS[prevIdx].brand} size={94} elevated />
                  </div>
                )}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `translate3d(0, ${(1 - swapP) * slotSize}px, 0)`,
                  }}
                >
                  <AgentAppIcon brand={SWAP_AGENTS[activeIdx].brand} size={94} elevated />
                </div>
              </div>
            </T3DirectionalBlur>
          </div>

          <span>{line2Suffix}</span>
        </div>
      </div>

      <div
        style={{
          marginTop: 8,
          padding: "8px 20px",
          borderRadius: 999,
          backgroundColor: T3_THEME.surface,
          border: `1px solid ${T3_THEME.border}`,
          boxShadow: T3_THEME.shadowSoft,
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "-0.015em",
          color: T3_THEME.inkSecondary,
        }}
      >
        {SWAP_AGENTS[displayIdx].label} · $0 markup
      </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
