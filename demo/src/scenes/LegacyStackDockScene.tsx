import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  computeVelocityBlur,
  EASE_IN_EXPO,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  SPRING_EDITORIAL,
} from "../lib/motion";

export interface LegacyStackDockSceneProps {
  hookLine1?: string;
  hookLine2?: string;
  brandWordmark?: string;
  accentColor?: string;
  legacyTools?: Array<{ code: string; name: string; bg: string; fg: string }>;
}

const DEFAULT_LEGACY_TOOLS = [
  { code: "Pr", name: "Premiere", bg: "#1E1B4B", fg: "#C4B5FD" },
  { code: "Ae", name: "After FX", bg: "#17153B", fg: "#A78BFA" },
  { code: "FC", name: "Final Cut", bg: "#18181B", fg: "#F4F4F5" },
  { code: "DR", name: "Resolve", bg: "#1E293B", fg: "#38BDF8" },
];

export const MotionflyEmblem: React.FC<{ size?: number; bg?: string; fg?: string }> = ({
  size = 64,
  bg = "#0B0B0F",
  fg = "#FFFFFF",
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0 }}>
    <rect width="64" height="64" rx="16" fill={bg} />
    {/* Crisp 4-direction motion diamond emblem */}
    <path d="M32 13L38 22H26L32 13Z" fill={fg} />
    <path d="M32 51L26 42H38L32 51Z" fill={fg} />
    <path d="M13 32L22 26V38L13 32Z" fill={fg} />
    <path d="M51 32L42 38V26L51 32Z" fill={fg} />
  </svg>
);

/**
 * Archetype 3 — Scene 1 (180f / 6.0s @ 30fps):
 * Frame-0 bold kinetic hook with editor selection handles ->
 * Rack-focused studio backdrop + whipped legacy tool carousel snapping to hero emblem -> iris wipe.
 */
export const LegacyStackDockScene: React.FC<LegacyStackDockSceneProps> = ({
  hookLine1 = "One prompt.",
  hookLine2 = "Full launch video.",
  brandWordmark = "Motionfly",
  accentColor = "#7C3AED",
  legacyTools = DEFAULT_LEGACY_TOOLS,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cutToDock = 64; // 2.13s hook -> 3.87s replacement dock + iris

  if (frame < cutToDock) {
    // Frame 0 already alive (progress >= 0.45 at frame 0 — beats Motionfly's tiny "One" tell!)
    const line1P = interpolate(frame, [-8, 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    const line2P = interpolate(frame, [2, 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    const boxP = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING_EDITORIAL });

    // Clean horizontal split acceleration on last 10f before cut
    const splitOut = interpolate(frame, [cutToDock - 10, cutToDock], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    });

    const handlePadX = 46 + splitOut * 140;
    const handlePadY = 34;

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
        <div
          style={{
            position: "relative",
            padding: `${handlePadY}px ${handlePadX}px`,
            border: `1.5px solid rgba(124, 58, 237, ${(0.28 * boxP * (1 - splitOut)).toFixed(2)})`,
            borderRadius: 24,
          }}
        >
          {/* 4 Crisp Editor Bounding-Box Corner Handles */}
          {[
            { top: -6, left: -6 },
            { top: -6, right: -6 },
            { bottom: -6, left: -6 },
            { bottom: -6, right: -6 },
          ].map((pos, idx) => (
            <div
              key={idx}
              style={{
                position: "absolute",
                ...pos,
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: "#FFFFFF",
                border: `2.5px solid ${accentColor}`,
                transform: `scale(${boxP * (1 - splitOut)})`,
              }}
            />
          ))}

          {/* Top-left mini frame spec pill */}
          <div
            style={{
              position: "absolute",
              top: -34,
              left: 0,
              fontFamily: FONT_MONO,
              fontSize: 15,
              fontWeight: 600,
              color: accentColor,
              opacity: boxP * (1 - splitOut),
              letterSpacing: "0.04em",
            }}
          >
            1920 × 1080 · 30 FPS · ONE-SHOT MCP
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 28 + splitOut * 160,
              opacity: 1 - splitOut * 0.85,
            }}
          >
            <span
              style={{
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 1.04,
                color: "#71717A",
                transform: `translateY(${(1 - line1P) * 36}px) translateX(${-splitOut * 90}px)`,
                opacity: line1P,
              }}
            >
              {hookLine1}
            </span>
            <span
              style={{
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 1.04,
                color: "#0B0B0F",
                transform: `translateY(${(1 - line2P) * 42}px) translateX(${splitOut * 90}px)`,
                opacity: line2P,
              }}
            >
              {hookLine2}
            </span>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // Phase 2 (lf = 0..116): Legacy-Stack-to-Hero Replacement Dock + Iris Wipe
  const lf = frame - cutToDock;

  // Rack-focus warm cinematic architectural horizon plate (0px -> 12px blur)
  const rackBlur = interpolate(lf, [0, 26], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // 4 legacy icons + 1 hero icon (index 4) spaced 270px apart
  const slotStep = 270;
  const getDockOffset = (t: number) => {
    const p = interpolate(t, [4, 72], [0, 4], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    return p * slotStep;
  };

  const dockX = getDockOffset(lf);
  const prevDockX = getDockOffset(Math.max(0, lf - 1));
  const dockBlur = computeVelocityBlur(dockX, prevDockX, 0.22, 12);
  const heroLocked = lf >= 68;
  const heroPop = spring({ frame: Math.max(0, lf - 68), fps, config: SPRING_EDITORIAL });

  // Clean dark circular iris expansion directly from hero emblem (lf 94..116)
  const irisP = interpolate(lf, [94, 114], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const allItems = [
    ...legacyTools.map((t) => ({ ...t, isHero: false })),
    { code: "MF", name: brandWordmark, bg: "#0B0B0F", fg: "#FFFFFF", isHero: true },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0E14", fontFamily: FONT_SANS, overflow: "hidden" }}>
      {/* Warm Editorial Architectural Horizon Plate (Rack-focuses smoothly behind dock) */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(165deg, #FDE68A 0%, #FCA5A5 34%, #6366F1 68%, #0F172A 100%)",
          filter: rackBlur > 0.2 ? `blur(${rackBlur.toFixed(1)}px)` : undefined,
          transform: `scale(${1.04 + rackBlur * 0.004})`,
        }}
      >
        {/* Minimal sunset horizon silhouette + studio light sweep */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 68% 36%, rgba(255,255,255,0.45) 0%, transparent 45%), linear-gradient(180deg, rgba(15,23,42,0.12) 0%, rgba(15,23,42,0.58) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* Top Caption */}
      <div
        style={{
          position: "absolute",
          top: 118,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "0.10em",
          color: "rgba(255,255,255,0.88)",
          textShadow: "0 2px 16px rgba(0,0,0,0.28)",
          opacity: 1 - irisP,
        }}
      >
        SKIP THE TIMELINE WRANGLING & LEARNING CURVE
      </div>

      {/* Horizontal Whipped Icon Replacement Dock */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1920, height: 280 }}>
          {allItems.map((item, idx) => {
            const centerX = 960 + idx * slotStep - dockX;
            const distFromCenter = Math.abs(centerX - 960);
            const focusFactor = Math.max(0, 1 - distFromCenter / 320);
            const scale = item.isHero && heroLocked
              ? 1.05 + heroPop * 0.14
              : 0.78 + focusFactor * 0.30;
            const opacity = Math.max(0.18, 1 - distFromCenter / 680);

            return (
              <div
                key={item.code}
                style={{
                  position: "absolute",
                  left: centerX - 76,
                  top: 56,
                  width: 152,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  transform: `scale(${scale})`,
                  opacity: item.isHero ? 1 : opacity * (1 - irisP),
                  filter: dockBlur > 0.3 ? `blur(${dockBlur.toFixed(1)}px)` : undefined,
                  zIndex: item.isHero ? 25 : Math.round(focusFactor * 10),
                }}
              >
                {item.isHero ? (
                  <div
                    style={{
                      width: 138,
                      height: 138,
                      borderRadius: 34,
                      backgroundColor: "#0B0B0F",
                      border: `3px solid ${heroLocked ? "#FFFFFF" : "rgba(255,255,255,0.45)"}`,
                      boxShadow: "0 28px 64px rgba(0,0,0,0.48)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MotionflyEmblem size={96} bg="#0B0B0F" fg="#FFFFFF" />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 128,
                      height: 128,
                      borderRadius: 30,
                      backgroundColor: item.bg,
                      border: "2px solid rgba(255,255,255,0.22)",
                      boxShadow: "0 20px 44px rgba(0,0,0,0.34)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 52,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: item.fg,
                    }}
                  >
                    {item.code}
                  </div>
                )}

                <span
                  style={{
                    fontSize: 20,
                    fontWeight: item.isHero ? 700 : 600,
                    color: "#FFFFFF",
                    opacity: focusFactor > 0.45 ? 1 : 0.45,
                    textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                  }}
                >
                  {item.name}
                </span>
              </div>
            );
          })}

          {/* Centered Crisp Focus Underline Bar */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 18,
              width: heroLocked ? 180 : 140,
              height: 5,
              borderRadius: 999,
              backgroundColor: "#FFFFFF",
              transform: "translateX(-50%)",
              opacity: 0.9 * (1 - irisP),
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Hero Emblem Dark Circular Iris Expansion into Scene 2 */}
      {irisP > 0.005 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 120,
            height: 120,
            borderRadius: 999,
            backgroundColor: "#FFFFFF",
            border: `6px solid ${accentColor}`,
            transform: `translate(-50%, -50%) scale(${0.8 + irisP * 22})`,
            zIndex: 45,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
