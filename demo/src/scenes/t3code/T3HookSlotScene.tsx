import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AgentAppIcon,
  FONT_MONO,
  FONT_SANS,
  T3_THEME,
  T3StudioCyclorama,
  type AgentBrandId,
} from "../../components/T3CodePrimitives";
import {
  EASE_IN_EXPO,
  SPRING_EDITORIAL,
  SPRING_SNAPPY,
  getCaretOpacity,
  sec,
} from "../../lib/studioMotion";

export interface T3HookSlotSceneProps {
  heroWord: string;
}

interface OrbitBadgeSpec {
  id: string;
  brand: AgentBrandId;
  title: string;
  meta: string;
  metaColor: string;
  metaBg: string;
  x: number;
  y: number;
  rotate: number;
  delaySec: number;
}

const FOREGROUND_BADGES: OrbitBadgeSpec[] = [
  {
    id: "claude",
    brand: "claude",
    title: "Claude Code",
    meta: "wt/passkey-auth",
    metaColor: T3_THEME.claude,
    metaBg: T3_THEME.claudeSoft,
    x: -510,
    y: -230,
    rotate: -2.6,
    delaySec: 0.08,
  },
  {
    id: "codex",
    brand: "codex",
    title: "Codex CLI",
    meta: "+142 −38",
    metaColor: T3_THEME.codex,
    metaBg: T3_THEME.codexSoft,
    x: 500,
    y: -220,
    rotate: 2.5,
    delaySec: 0.13,
  },
  {
    id: "opencode",
    brand: "opencode",
    title: "OpenCode",
    meta: "3 worktrees",
    metaColor: T3_THEME.opencode,
    metaBg: T3_THEME.opencodeSoft,
    x: -520,
    y: 215,
    rotate: 2.1,
    delaySec: 0.18,
  },
  {
    id: "cursor",
    brand: "cursor",
    title: "Open PR",
    meta: "PR #412 ✓",
    metaColor: T3_THEME.success,
    metaBg: T3_THEME.successSoft,
    x: 510,
    y: 220,
    rotate: -2.2,
    delaySec: 0.22,
  },
];

// Deeper Z-plane soft-focus cards for genuine optical depth (slower parallax, subtle 2.2px DOF)
const DEPTH_CARDS: Array<{
  id: string;
  brand: AgentBrandId;
  label: string;
  x: number;
  y: number;
  rotate: number;
  delaySec: number;
}> = [
  { id: "d-term", brand: "terminal", label: "git worktree add", x: -40, y: -348, rotate: -1.4, delaySec: 0.16 },
  { id: "d-t3", brand: "t3", label: "0 conflicts", x: 55, y: 342, rotate: 1.6, delaySec: 0.2 },
  { id: "d-codex", brand: "codex", label: "14/14 E2E", x: -690, y: -15, rotate: -3.2, delaySec: 0.24 },
  { id: "d-claude", brand: "claude", label: "BYO keys", x: 695, y: 8, rotate: 3.0, delaySec: 0.26 },
];

/**
 * Beat 1 (Beats 0 -> 4 @ 132 BPM, 1.82s = 55f): Z-Depth Studio Cyclorama Hook
 * - Camera-coupled precision dot-grid + curved studio wall falloff.
 * - 2-plane optical depth: 4 crisp foreground official-logo badges + 4 softer background depth
 *   cards drifting at 0.65x parallax for real cinema dimensionality.
 */
export const T3HookSlotScene: React.FC<T3HookSlotSceneProps> = ({ heroWord }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const wordSpring = spring({
    frame: frame + sec(0.2, fps),
    fps,
    config: SPRING_EDITORIAL,
  });

  const liveDrift = interpolate(frame, [0, durationInFrames], [0.97, 1.055], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitLead = sec(0.24, fps);
  const implode = interpolate(
    frame,
    [durationInFrames - exitLead, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    }
  );

  const caretOpacity = getCaretOpacity(frame, false, fps);
  const wordScale = (0.94 + wordSpring * 0.06) * liveDrift * (1 + implode * 0.24);
  const wordOpacity = Math.min(1, wordSpring * 1.45) * (1 - implode * 0.45);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      {/* Camera-Coupled Studio Cyclorama + Micro Dot-Grid */}
      <T3StudioCyclorama
        zoom={liveDrift * (1 + implode * 0.18)}
        panY={interpolate(frame, [0, durationInFrames], [8, -14])}
      />

      {/* Deeper Z-Plane Background Cards (Subtle 2.2px Optical DOF, 0.65x Parallax) */}
      {DEPTH_CARDS.map((card, idx) => {
        const pop = spring({
          frame: Math.max(0, frame - sec(card.delaySec, fps)),
          fps,
          config: SPRING_EDITORIAL,
        });
        const expand = Math.max(0, pop * (1 - implode * 0.78)) * (0.94 + (liveDrift - 0.97) * 0.65);
        const floatY = Math.sin((frame / fps) * 2.2 + idx * 1.9) * 4 * (1 - implode);
        const cx = 960 + card.x * expand;
        const cy = 540 + card.y * expand + floatY;
        const scale = (0.58 + pop * 0.24) * (1 - implode * 0.25);
        const opacity = Math.min(1, pop * 1.3) * 0.52 * (1 - implode * 0.9);

        return (
          <div
            key={card.id}
            style={{
              position: "absolute",
              left: cx - 122,
              top: cy - 36,
              width: 244,
              height: 72,
              borderRadius: 18,
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              border: `1px solid ${T3_THEME.border}`,
              boxShadow: T3_THEME.shadowSoft,
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              transform: `scale(${scale}) rotate(${card.rotate}deg)`,
              opacity,
              filter: "blur(1.8px)",
              pointerEvents: "none",
            }}
          >
            <AgentAppIcon brand={card.brand} size={36} elevated={false} />
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 15,
                fontWeight: 600,
                color: T3_THEME.inkSecondary,
                whiteSpace: "nowrap",
              }}
            >
              {card.label}
            </span>
          </div>
        );
      })}

      {/* Razor-Sharp Foreground Official-Logo Badges */}
      {FOREGROUND_BADGES.map((card, idx) => {
        const pop = spring({
          frame: Math.max(0, frame - sec(card.delaySec, fps)),
          fps,
          config: SPRING_SNAPPY,
        });

        const expand = Math.max(0, pop * (1 - implode * 0.86)) * liveDrift;
        const floatY = Math.sin((frame / fps) * 3.1 + idx * 1.6) * 5 * (1 - implode);
        const cx = 960 + card.x * expand;
        const cy = 540 + card.y * expand + floatY;
        const scale = (0.55 + pop * 0.45) * (1 - implode * 0.35);
        const opacity = Math.min(1, pop * 1.6) * (1 - implode * 0.88);

        return (
          <div
            key={card.id}
            style={{
              position: "absolute",
              left: cx - 208,
              top: cy - 52,
              width: 416,
              height: 104,
              borderRadius: 24,
              backgroundColor: T3_THEME.surface,
              border: `1px solid ${T3_THEME.border}`,
              boxShadow: T3_THEME.shadowHero,
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              transform: `scale(${scale}) rotate(${card.rotate * (1 - implode)}deg)`,
              opacity,
              zIndex: 4,
              willChange: "transform, opacity",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <AgentAppIcon brand={card.brand} size={52} elevated={false} />
              <span
                style={{
                  fontSize: 21,
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: T3_THEME.ink,
                  whiteSpace: "nowrap",
                }}
              >
                {card.title}
              </span>
            </div>

            <span
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                backgroundColor: card.metaBg,
                color: card.metaColor,
                fontFamily: FONT_MONO,
                fontSize: 14,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              {card.meta}
            </span>
          </div>
        );
      })}

      {/* Center Minimal Caret Hero Word */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 8,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            transform: `scale(${wordScale}) translate3d(0, ${(1 - wordSpring) * 10}px, 0)`,
            opacity: wordOpacity,
          }}
        >
          <span
            style={{
              fontSize: 152,
              fontWeight: 800,
              letterSpacing: "-0.052em",
              lineHeight: 1.0,
              color: T3_THEME.ink,
            }}
          >
            {heroWord}
          </span>
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 122,
              borderRadius: 999,
              marginLeft: 14,
              backgroundColor: T3_THEME.ink,
              opacity: caretOpacity * 0.85,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
