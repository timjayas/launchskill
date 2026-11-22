import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TactileCursor } from "../StudioPrimitives";
import {
  computeSecondarySettle,
  EASE_IN_EXPO,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  getCaretOpacity,
  getNaturalTypedLength,
  sec,
  SPRING_EDITORIAL,
  SPRING_SNAPPY,
} from "../motion";

export interface MacroPromptStrobeProps {
  brandTitle: string;
  mcpBadge: string;
  promptText: string;
  searchStatus: string;
  libraryCountLabel: string;
  submitAccent?: string;
}

const COLLAGE_CARDS = [
  { x: -560, y: -240, rot: -8, w: 230, h: 260, bg: "#FEF08A", fg: "#111114", label: "20:30" },
  { x: -290, y: -300, rot: 4, w: 210, h: 200, bg: "#0F172A", fg: "#38BDF8", label: "KOVA" },
  { x: 20, y: -290, rot: -3, w: 240, h: 210, bg: "#1D4ED8", fg: "#FFFFFF", label: "FORMA" },
  { x: 340, y: -260, rot: 7, w: 225, h: 240, bg: "#18181B", fg: "#A7F3D0", label: "ZERO" },
  { x: 590, y: -160, rot: -6, w: 220, h: 260, bg: "#10B981", fg: "#064E3B", label: "WABI" },
  { x: -460, y: 180, rot: 6, w: 250, h: 210, bg: "#E0E7FF", fg: "#3730A3", label: "AMPER" },
  { x: -130, y: 240, rot: -5, w: 260, h: 220, bg: "#111114", fg: "#FAFAFA", label: "SUPER" },
  { x: 220, y: 230, rot: 4, w: 245, h: 215, bg: "#F1F5F9", fg: "#0F172A", label: "INDEX" },
  { x: 530, y: 200, rot: -7, w: 235, h: 225, bg: "#1E1B4B", fg: "#C4B5FD", label: "ARC" },
];

export const MacroPromptStrobeScene: React.FC<MacroPromptStrobeProps> = ({
  brandTitle,
  mcpBadge,
  promptText,
  searchStatus,
  libraryCountLabel,
  submitAccent = "#2563EB",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 100% FPS-agnostic windows (6.2s total)
  const fCollageStart = sec(1.07, fps);
  const fChatStart = sec(2.33, fps);
  const fMacroStart = sec(2.93, fps);
  const fWideSubmit = sec(4.0, fps);
  const fShimmerStart = sec(4.4, fps);
  const fStrobeStart = sec(4.93, fps);

  // 1. Editorial Serif Hook (0.0s .. 1.07s — already mid-arrival at frame 0)
  if (frame < fCollageStart) {
    const enter = spring({ frame: frame + sec(0.14, fps), fps, config: SPRING_EDITORIAL });
    return (
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: 124,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#0B0B0E",
            transform: `translate3d(0, ${(1 - enter) * 24}px, 0) scale(${0.95 + enter * 0.05})`,
            opacity: enter,
          }}
        >
          {brandTitle}
        </div>
      </AbsoluteFill>
    );
  }

  // 2. Depth-Sorted Collage Burst (1.07s .. 2.33s)
  if (frame < fChatStart) {
    const lf = frame - fCollageStart;
    const collapse = interpolate(lf, [sec(0.93, fps), sec(1.23, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    });
    return (
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
        {COLLAGE_CARDS.map((card, i) => {
          const cardStart = Math.round(i * sec(0.05, fps));
          const pop = spring({
            frame: Math.max(0, lf - cardStart),
            fps,
            config: SPRING_SNAPPY,
          });
          const inner = computeSecondarySettle(lf, cardStart, fps, 0.07, 8);
          const x = card.x * pop * (1 - collapse * 0.92);
          const y = card.y * pop * (1 - collapse * 0.92);
          const sc = (0.4 + pop * 0.6) * (1 - collapse * 0.72);
          return (
            <div
              key={card.label}
              style={{
                position: "absolute",
                width: card.w,
                height: card.h,
                borderRadius: 22,
                backgroundColor: card.bg,
                color: card.fg,
                boxShadow: "0 24px 54px rgba(0,0,0,0.14)",
                transform: `translate3d(${x}px, ${y}px, 0) rotate(${card.rot * (1 - collapse)}deg) scale(${sc})`,
                opacity: Math.min(1, pop * 1.4) * (1 - collapse),
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 22,
                fontFamily: FONT_SANS,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 15,
                  opacity: 0.7 * inner.opacity,
                  fontVariantNumeric: "tabular-nums",
                  transform: `translate3d(0, ${inner.translateY}px, 0)`,
                }}
              >
                0{i + 1}
              </span>
              <span
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  opacity: inner.opacity,
                  transform: `translate3d(0, ${inner.translateY}px, 0)`,
                }}
              >
                {card.label}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }

  // 3. Hard-Cut 3.2x Macro Typing Punch-In (2.93s .. 4.0s)
  if (frame >= fMacroStart && frame < fWideSubmit) {
    const typedLen = getNaturalTypedLength(promptText, frame, fChatStart + sec(0.13, fps), 34, fps);
    const visibleText = promptText.slice(0, typedLen);
    const panX = interpolate(typedLen, [0, promptText.length], [160, -240], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            fontFamily: FONT_SANS,
            fontSize: 94,
            fontWeight: 500,
            letterSpacing: "-0.035em",
            color: "#111114",
            transform: `translate3d(${panX}px, 0, 0)`,
          }}
        >
          <span>{visibleText}</span>
          <span
            style={{
              display: "inline-block",
              width: 4,
              height: 92,
              marginLeft: 6,
              backgroundColor: "#111114",
              opacity: getCaretOpacity(frame, typedLen < promptText.length, fps),
            }}
          />
        </div>
      </AbsoluteFill>
    );
  }

  // 4. Full-Bleed MCP Retrieval Strobe + Live Tabular Counter HUD (4.93s .. 6.2s)
  if (frame >= fStrobeStart) {
    const lf = frame - fStrobeStart;
    const flashIdx = lf < sec(0.43, fps) ? 0 : lf < sec(0.83, fps) ? 1 : 2;
    const countVal = Math.min(
      34340,
      Math.round(interpolate(lf, [0, sec(0.93, fps)], [4120, 34340], { extrapolateRight: "clamp" }))
    );
    const foundDone = lf >= sec(1.0, fps);

    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {flashIdx === 0 && (
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(circle at 60% 48%, #0EA5E9 0%, #2563EB 44%, #0F172A 100%)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: 168,
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                textShadow: "0 16px 48px rgba(0,0,0,0.22)",
              }}
            >
              Forma
            </div>
          </AbsoluteFill>
        )}

        {flashIdx === 1 && (
          <AbsoluteFill
            style={{
              backgroundColor: "#0F172A",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 36,
            }}
          >
            {[
              { bg: "#FDE047", fg: "#1D4ED8", sym: "↗" },
              { bg: "#2563EB", fg: "#FDE047", sym: "⇄" },
              { bg: "#0F766E", fg: "#CCFBF1", sym: "◎" },
            ].map((tile, idx) => (
              <div
                key={idx}
                style={{
                  width: 480,
                  height: 620,
                  borderRadius: 34,
                  backgroundColor: tile.bg,
                  color: tile.fg,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 190,
                  fontWeight: 800,
                }}
              >
                {tile.sym}
              </div>
            ))}
          </AbsoluteFill>
        )}

        {flashIdx === 2 && (
          <AbsoluteFill
            style={{
              backgroundColor: "#0B0B10",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 680,
                height: 680,
                borderRadius: 9999,
                background:
                  "conic-gradient(from 140deg, #0EA5E9, #2563EB, #0F766E, #38BDF8, #0EA5E9)",
                boxShadow: "inset -40px -40px 90px rgba(0,0,0,0.45), 0 30px 110px rgba(14,165,233,0.32)",
              }}
            />
          </AbsoluteFill>
        )}

        {/* Live Counter Pill HUD pinned bottom-center (safe margin >= 90px) */}
        <div
          style={{
            position: "absolute",
            bottom: 92,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(16px)",
            border: "1.5px solid rgba(0,0,0,0.08)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
            borderRadius: 999,
            padding: "14px 28px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: FONT_SANS,
            fontSize: 22,
            fontWeight: 600,
            color: "#111114",
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: foundDone ? "#10B981" : submitAccent,
            }}
          />
          <span>{foundDone ? "5 standout systems found" : `Searching ${mcpBadge}`}</span>
          <span
            style={{
              fontFamily: FONT_MONO,
              color: "#71717A",
              fontSize: 19,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {foundDone ? "0.4s" : `${countVal.toLocaleString()} / ${libraryCountLabel}`}
          </span>
        </div>
      </AbsoluteFill>
    );
  }

  // 5. Wide Chat Establish + Submit & MCP Shimmer
  const isShimmer = frame >= fShimmerStart;
  const typedWide = getNaturalTypedLength(promptText, frame, fChatStart + sec(0.13, fps), 34, fps);
  const clickScale = interpolate(
    frame,
    [fWideSubmit + sec(0.13, fps), fWideSubmit + sec(0.23, fps), fWideSubmit + sec(0.36, fps)],
    [1, 0.86, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const shimmerPos = interpolate(frame, [fShimmerStart, fStrobeStart], [-60, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
      {!isShimmer ? (
        <div
          style={{
            width: 1080,
            height: 104,
            borderRadius: 999,
            backgroundColor: "#FFFFFF",
            border: "2px solid #E4E4E7",
            boxShadow: "0 14px 40px rgba(0,0,0,0.06)",
            padding: "0 20px 0 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "#18181B", fontFamily: FONT_SANS }}>
            <span style={{ color: "#A1A1AA", fontSize: 34 }}>+</span>
            <span>{promptText.slice(0, typedWide)}</span>
            <span
              style={{
                width: 2.5,
                height: 32,
                backgroundColor: "#18181B",
                opacity: getCaretOpacity(frame, typedWide < promptText.length, fps),
              }}
            />
          </div>
          <div
            style={{
              width: 66,
              height: 66,
              borderRadius: 999,
              backgroundColor: submitAccent,
              color: "#FFFFFF",
              display: "grid",
              placeItems: "center",
              fontSize: 32,
              fontWeight: 700,
              transform: `scale(${clickScale})`,
            }}
          >
            ↑
          </div>
          {frame >= fWideSubmit && (
            <TactileCursor x={1018} y={54} scale={clickScale} fill="#111114" />
          )}
        </div>
      ) : (
        <div style={{ width: 1120, display: "flex", flexDirection: "column", gap: 38 }}>
          <div
            style={{
              alignSelf: "flex-end",
              backgroundColor: "#F4F4F5",
              color: "#18181B",
              padding: "20px 32px",
              borderRadius: 28,
              fontSize: 28,
              fontWeight: 500,
              fontFamily: FONT_SANS,
            }}
          >
            {promptText}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, fontFamily: FONT_SANS }}>
            <span style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 34, color: "#111114" }}>
              {mcpBadge}
            </span>
            <span
              style={{
                fontWeight: 500,
                background: `linear-gradient(90deg, #A1A1AA ${shimmerPos - 25}%, #111114 ${shimmerPos}%, #A1A1AA ${
                  shimmerPos + 25
                }%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {searchStatus}
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
