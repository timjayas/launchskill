import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TactileCursor } from "../StudioPrimitives";
import {
  computeSecondarySettle,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_SANS,
  FONT_SERIF,
  getCaretOpacity,
  getNaturalTypedLength,
  sec,
  SPRING_EDITORIAL,
} from "../motion";

export interface CardToChipDockProps {
  mcpBadge: string;
  followUpPrompt: string;
  submitAccent?: string;
}

const BRAND_RESULTS = [
  { name: "Forma", year: "2024", bg: "linear-gradient(135deg, #0EA5E9, #1D4ED8)", fg: "#FFFFFF", serif: true },
  { name: "Zero", year: "2025", bg: "#FDE047", fg: "#1D4ED8", serif: false },
  { name: "Wabi", year: "2026", bg: "conic-gradient(from 120deg, #0EA5E9, #0F766E, #2563EB, #38BDF8, #0EA5E9)", fg: "#FFFFFF", serif: false },
  { name: "Amperos", year: "2025", bg: "#18181B", fg: "#F5F5F4", serif: true },
  { name: "Index", year: "2025", bg: "#0F172A", fg: "#E2E8F0", serif: false },
];

export const CardToChipDockScene: React.FC<CardToChipDockProps> = ({
  mcpBadge,
  followUpPrompt,
  submitAccent = "#2563EB",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 100% FPS-agnostic windows (5.4s total)
  const fClick = sec(1.53, fps);
  const fDockStart = sec(1.67, fps);
  const fDockEnd = sec(2.47, fps);
  const fTypeStart = sec(2.6, fps);
  const fSubmit = sec(4.8, fps);

  const shelfIn = spring({ frame, fps, config: SPRING_EDITORIAL });
  const headerFollow = computeSecondarySettle(frame, 0, fps, 0.08, 8);

  const dockP = interpolate(frame, [fDockStart, fDockEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const siblingsFade = interpolate(frame, [fDockStart, fDockStart + sec(0.4, fps)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const barIn = interpolate(frame, [fDockStart + sec(0.27, fps), fDockEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Cursor glides to Card #3 (960, 520), clicks, then glides to submit (1442, 588)
  const toCard = interpolate(frame, [sec(0.6, fps), fClick - sec(0.13, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const toSubmit = interpolate(frame, [sec(4.0, fps), fSubmit - sec(0.1, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const cursorSwitch = sec(3.0, fps);
  const cursorX =
    frame < cursorSwitch
      ? interpolate(toCard, [0, 1], [1340, 960])
      : interpolate(toSubmit, [0, 1], [960, 1442]);
  const cursorY =
    frame < cursorSwitch
      ? interpolate(toCard, [0, 1], [760, 515])
      : interpolate(toSubmit, [0, 1], [660, 588]);

  const clickDip =
    interpolate(frame, [fClick, fClick + sec(0.1, fps), fClick + sec(0.23, fps)], [1, 0.85, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [fSubmit, fSubmit + sec(0.1, fps), fSubmit + sec(0.23, fps)], [1, 0.85, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // Morphing Card #3 -> docked 68x68 chip inside prompt box
  const chipLeft = interpolate(dockP, [0, 1], [960 - 135, 456]);
  const chipTop = interpolate(dockP, [0, 1], [510 - 105, 474]);
  const chipW = interpolate(dockP, [0, 1], [270, 68]);
  const chipH = interpolate(dockP, [0, 1], [210, 68]);
  const chipRadius = interpolate(dockP, [0, 1], [20, 14]);
  const cardHovered = frame >= fClick - sec(0.2, fps) && frame < fDockStart;

  const typedLen = getNaturalTypedLength(followUpPrompt, frame, fTypeStart, 36, fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", fontFamily: FONT_SANS }}>
      {/* MCP Result Shelf Header + 5 Cards */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 290,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          opacity: siblingsFade,
          transform: `translate3d(0, ${(1 - shelfIn) * 24}px, 0)`,
        }}
      >
        <div
          style={{
            width: 1470,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            opacity: headerFollow.opacity,
            transform: `translate3d(0, ${headerFollow.translateY}px, 0)`,
          }}
        >
          <span style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 32 }}>{mcpBadge}</span>
          <span style={{ color: "#71717A" }}>Found 5 standout design systems</span>
        </div>

        <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
          {BRAND_RESULTS.map((b, i) => (
            <div
              key={b.name}
              style={{
                width: 270,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                opacity: i === 2 ? 0 : 1,
              }}
            >
              <div
                style={{
                  width: 270,
                  height: 210,
                  borderRadius: 20,
                  background: b.bg,
                  color: b.fg,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: b.serif ? FONT_SERIF : FONT_SANS,
                  fontSize: 38,
                  fontWeight: 700,
                  boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
                }}
              >
                {b.name}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 600, color: "#18181B" }}>
                <span>{b.name}</span>
                <span style={{ color: "#A1A1AA", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{b.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rounded Multi-Turn Prompt Box */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 446,
          transform: `translate3d(-50%, ${(1 - barIn) * 28}px, 0)`,
          opacity: barIn,
          width: 1080,
          height: 196,
          borderRadius: 34,
          backgroundColor: "#FFFFFF",
          border: `2px solid ${frame >= fSubmit ? submitAccent : "#E4E4E7"}`,
          boxShadow: "0 20px 56px rgba(0,0,0,0.08)",
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, color: "#18181B" }}>
            <span style={{ color: "#A1A1AA", fontSize: 34 }}>+</span>
            <span>{followUpPrompt.slice(0, typedLen)}</span>
            <span
              style={{
                width: 2.5,
                height: 32,
                backgroundColor: "#18181B",
                opacity: getCaretOpacity(frame, typedLen < followUpPrompt.length, fps),
              }}
            />
          </div>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 999,
              backgroundColor: submitAccent,
              color: "#FFFFFF",
              display: "grid",
              placeItems: "center",
              fontSize: 30,
              fontWeight: 700,
              transform: `scale(${frame >= fSubmit ? clickDip : 1})`,
            }}
          >
            ↑
          </div>
        </div>
      </div>

      {/* Continuously Morphing Hero Card #3 -> Inline Docked Visual Chip */}
      <div
        style={{
          position: "absolute",
          left: chipLeft,
          top: chipTop,
          width: chipW,
          height: chipH,
          borderRadius: chipRadius,
          background: BRAND_RESULTS[2].bg,
          color: "#FFFFFF",
          display: "grid",
          placeItems: "center",
          fontSize: interpolate(dockP, [0, 1], [40, 14]),
          fontWeight: 800,
          boxShadow: cardHovered
            ? `0 22px 48px rgba(14,165,233,0.34), 0 0 0 3px ${submitAccent}`
            : "0 16px 38px rgba(14,165,233,0.22)",
          transform: cardHovered ? "translate3d(0, -4px, 0) scale(1.02)" : undefined,
          border: dockP > 0.5 ? "2px solid rgba(255,255,255,0.85)" : "none",
          zIndex: 20,
        }}
      >
        {dockP < 0.65 ? "Wabi" : ""}
      </div>

      <TactileCursor x={cursorX} y={cursorY} scale={clickDip} fill="#111114" />
    </AbsoluteFill>
  );
};
