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
  computeSecondarySettle,
  sec,
} from "../../lib/studioMotion";

export interface AntigravityHookSceneProps {
  brandName: string;
  badgeText: string;
  hookLine1: string;
  hookLine2: string;
  subline: string;
  accentColor: string;
  skyColor: string;
}

interface OrbitArtifactCard {
  title: string;
  metric: string;
  codePreview: string;
  tag: string;
  x: number;
  y: number;
  rot: number;
  tint: string;
  accent: string;
}

const ORBIT_ARTIFACTS: OrbitArtifactCard[] = [
  {
    title: "webhooks.ts",
    metric: "+68 −4",
    codePreview: "verifySignature(raw, sig)",
    tag: "DIFF",
    x: 270,
    y: 230,
    rot: -2.2,
    tint: "#EFF6FF",
    accent: "#2563EB",
  },
  {
    title: "vitest suite",
    metric: "18 / 18 ✓",
    codePreview: "PASS · 42ms · 0 flakes",
    tag: "VERIFY",
    x: 1645,
    y: 225,
    rot: 2.0,
    tint: "#ECFDF5",
    accent: "#059669",
  },
  {
    title: "retryQueue.ts",
    metric: "5× backoff",
    codePreview: "enqueue(ev.id, policy)",
    tag: "WORKER",
    x: 215,
    y: 555,
    rot: 1.6,
    tint: "#F0F9FF",
    accent: "#0EA5E9",
  },
  {
    title: "Browser QA",
    metric: "200 OK",
    codePreview: "checkout flow verified",
    tag: "AGENT",
    x: 1700,
    y: 555,
    rot: -1.8,
    tint: "#F8FAFC",
    accent: "#0B0D12",
  },
  {
    title: "AST Index",
    metric: "48 files",
    codePreview: "graph synced in 0.3s",
    tag: "CONTEXT",
    x: 335,
    y: 865,
    rot: -1.4,
    tint: "#F8FAFC",
    accent: "#2563EB",
  },
  {
    title: "Ready PR #412",
    metric: "0 errors",
    codePreview: "feat/stripe-webhooks",
    tag: "SHIP",
    x: 1585,
    y: 865,
    rot: 1.8,
    tint: "#ECFDF5",
    accent: "#059669",
  },
];

/**
 * Shot 1 (Beats 0 -> 6, 3.0s): Weightless Light-Gallery Hook + Radial Orbital Code Burst
 * - Pure #FFFFFF gallery studio canvas — Frame-0 alive (progress >= 0.45 at f=0).
 * - Editorial pairing: Inter ExtraBold + italic Instrument Serif ("gravity.").
 * - 6 floating tactile code/verification artifact cards burst radially outward from center,
 *   hover weightlessly around the clean safe typography core, then snap-implode into Shot 2!
 */
export const AntigravityHookScene: React.FC<AntigravityHookSceneProps> = ({
  brandName,
  badgeText,
  hookLine1,
  hookLine2,
  subline,
  accentColor,
  skyColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Frame-0 alive offset so f=0 is already crisp & mid-arrival
  const frame0Offset = sec(0.16, fps);

  const badgeSpring = spring({
    frame: frame + frame0Offset,
    fps,
    config: SPRING_EDITORIAL,
  });

  const line1Spring = spring({
    frame: frame + Math.round(frame0Offset * 0.9),
    fps,
    config: SPRING_EDITORIAL,
  });

  const line2Spring = spring({
    frame: Math.max(0, frame - sec(0.1, fps)) + Math.round(frame0Offset * 0.5),
    fps,
    config: SPRING_EDITORIAL,
  });

  const subSettle = computeSecondarySettle(frame, sec(0.2, fps), fps, 0.065, 8);

  // Snap implosion in final 0.34s to launch Shot 2 cleanly
  const implodeP = interpolate(frame, [sec(2.64, fps), sec(2.98, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const ruleWidth = interpolate(frame, [0, sec(0.55, fps)], [110, 380], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const tSec = frame / fps;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      <StudioLightBackdrop surface="white" showGrid glowX="50%" glowY="44%" glowIntensity={0.11} />

      {/* 6 Weightless Radial Orbital Code-Artifact Cards (strictly clear of center core) */}
      {ORBIT_ARTIFACTS.map((card, idx) => {
        const burstSpring = spring({
          frame: Math.max(0, frame - sec(0.14 + idx * 0.055, fps)),
          fps,
          config: SPRING_EDITORIAL,
        });

        // Gentle deterministic weightless float once arrived
        const floatY = Math.sin(tSec * 2.1 + idx * 1.15) * 7 * burstSpring;
        const floatX = Math.cos(tSec * 1.5 + idx * 0.9) * 4 * burstSpring;

        const outFactor = burstSpring * (1 - implodeP);
        const cx = interpolate(outFactor, [0, 1], [960, card.x]) + floatX;
        const cy = interpolate(outFactor, [0, 1], [540, card.y]) + floatY;
        const scale = (0.58 + burstSpring * 0.42) * (1 - implodeP * 0.55);
        const opacity = Math.min(1, burstSpring * 1.35) * (1 - implodeP);

        return (
          <div
            key={card.title}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 288,
              borderRadius: ANTIGRAVITY_THEME.radiusCard,
              backgroundColor: "#FFFFFF",
              border: `1.5px solid ${ANTIGRAVITY_THEME.border}`,
              boxShadow: ANTIGRAVITY_THEME.shadowCard,
              padding: "16px 18px",
              transform: `translate3d(${cx - 144}px, ${cy - 58}px, 0) rotate(${card.rot * outFactor}deg) scale(${scale})`,
              opacity,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: card.accent,
                  backgroundColor: card.tint,
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                {card.tag}
              </span>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 15,
                  fontWeight: 700,
                  color: card.accent,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {card.metric}
              </span>
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: ANTIGRAVITY_THEME.ink,
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 14,
                fontWeight: 500,
                color: ANTIGRAVITY_THEME.inkMuted,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {card.codePreview}
            </div>
          </div>
        );
      })}

      {/* Center Editorial Focal Core */}
      <AbsoluteFill
        style={{
          padding: "96px 140px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${1 - implodeP * 0.08})`,
          opacity: 1 - implodeP * 0.85,
        }}
      >
        {/* Top Brand Identity Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "9px 20px 9px 11px",
            borderRadius: 999,
            backgroundColor: "#FFFFFF",
            border: `1.5px solid ${ANTIGRAVITY_THEME.borderStrong}`,
            boxShadow: ANTIGRAVITY_THEME.shadowCard,
            marginBottom: 38,
            opacity: Math.min(1, badgeSpring * 1.15),
            transform: `translate3d(0, ${(1 - badgeSpring) * 14}px, 0)`,
          }}
        >
          <AntigravityMark
            size={34}
            variant="badge"
            accentColor={accentColor}
            skyColor={skyColor}
          />
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: ANTIGRAVITY_THEME.ink,
            }}
          >
            {brandName}
          </span>
          <span
            style={{
              width: 1,
              height: 18,
              backgroundColor: ANTIGRAVITY_THEME.borderStrong,
            }}
          />
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: accentColor,
              textTransform: "uppercase",
            }}
          >
            {badgeText}
          </span>
        </div>

        {/* Two-Tone Editorial Headline: Inter Sans + Italic Instrument Serif */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 112,
              fontWeight: 700,
              letterSpacing: "-0.048em",
              lineHeight: 0.98,
              color: ANTIGRAVITY_THEME.inkMuted,
              opacity: Math.min(1, line1Spring * 1.2),
              transform: `translate3d(0, ${(1 - line1Spring) * 22}px, 0)`,
            }}
          >
            {hookLine1}
          </div>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontStyle: "italic",
              fontSize: 148,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 0.96,
              color: ANTIGRAVITY_THEME.ink,
              opacity: Math.min(1, line2Spring * 1.2),
              transform: `translate3d(0, ${(1 - line2Spring) * 24}px, 0)`,
            }}
          >
            {hookLine2}
          </div>
        </div>

        {/* Cobalt Precision Hairline */}
        <div
          style={{
            width: ruleWidth,
            height: 2.5,
            marginTop: 28,
            marginBottom: 24,
            borderRadius: 999,
            background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
            opacity: 0.78,
          }}
        />

        {/* Crisp Positioning Subline */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            letterSpacing: "-0.015em",
            lineHeight: 1.35,
            color: ANTIGRAVITY_THEME.inkSecondary,
            maxWidth: 820,
            textAlign: "center",
            opacity: subSettle.opacity,
            transform: `translate3d(0, ${subSettle.translateY}px, 0)`,
          }}
        >
          {subline}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
