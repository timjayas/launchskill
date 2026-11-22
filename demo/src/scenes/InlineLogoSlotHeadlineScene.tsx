import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_OUT_EXPO, FONT_MONO, FONT_SANS, FONT_SERIF, SPRING_EDITORIAL } from "../lib/motion";

export interface InlineLogoSlotHeadlineProps {
  headlineLine1: string;
  headlineLine2Prefix: string;
  headlineLine2Suffix: string;
  brandWordmark: string;
  ctaUrl: string;
}

const PartnerGlyph: React.FC<{ idx: number }> = ({ idx }) => {
  if (idx === 0) {
    return (
      <span style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 82, color: "#0B0B0E" }}>
        AI
      </span>
    );
  }
  if (idx === 1) {
    // OpenAI-inspired geometric rosette
    return (
      <svg width={70} height={70} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" stroke="#111114" strokeWidth="4.5" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="32"
            cy="22"
            rx="8"
            ry="14"
            stroke="#111114"
            strokeWidth="3.2"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
      </svg>
    );
  }
  if (idx === 2) {
    // Claude-inspired coral starburst
    return (
      <svg width={72} height={72} viewBox="0 0 64 64" fill="none">
        {[0, 30, 60, 90, 120, 150].map((deg) => (
          <rect
            key={deg}
            x="29"
            y="8"
            width="6"
            height="48"
            rx="3"
            fill="#D97757"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
      </svg>
    );
  }
  // Cursor-inspired 3D isometric cube
  return (
    <svg width={68} height={68} viewBox="0 0 64 64" fill="none">
      <polygon points="32,6 56,20 32,34 8,20" fill="#18181B" />
      <polygon points="8,20 32,34 32,58 8,44" fill="#52525B" />
      <polygon points="56,20 32,34 32,58 56,44" fill="#A1A1AA" />
    </svg>
  );
};

export const InlineLogoSlotHeadlineScene: React.FC<InlineLogoSlotHeadlineProps> = ({
  headlineLine1,
  headlineLine2Prefix,
  headlineLine2Suffix,
  brandWordmark,
  ctaUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Windows (204f @ 30fps = 6.8s)
  const fWordmarkStart = 104;

  // 1. Editorial Serif Thesis + Locked-Baseline Inline AI Logo Slot-Swap (0..104)
  if (frame < fWordmarkStart) {
    const line1In = interpolate(frame, [0, 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    const line2In = interpolate(frame, [5, 19], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });

    // Cycle 4 slots cleanly every 22 frames (~0.73s per icon) after initial hold
    const slotIdx = frame < 34 ? 0 : frame < 56 ? 1 : frame < 78 ? 2 : 3;
    const slotStart = slotIdx === 0 ? 0 : slotIdx === 1 ? 34 : slotIdx === 2 ? 56 : 78;
    const slotPop = spring({
      frame: Math.max(0, frame - slotStart),
      fps,
      config: SPRING_EDITORIAL,
    });

    return (
      <AbsoluteFill style={{ backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            fontFamily: FONT_SERIF,
            fontSize: 82,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.14,
            color: "#0B0B0E",
            textAlign: "center",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div style={{ transform: `translate3d(0, ${(1 - line1In) * 80}px, 0)`, opacity: line1In }}>
              {headlineLine1}
            </div>
          </div>

          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                transform: `translate3d(0, ${(1 - line2In) * 80}px, 0)`,
                opacity: line2In,
              }}
            >
              <span>{headlineLine2Prefix}</span>
              {/* Fixed-width baseline-locked inline slot prevents ANY horizontal jitter! */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 88,
                  height: 84,
                  overflow: "hidden",
                  verticalAlign: "middle",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `translate3d(0, ${(1 - slotPop) * 32}px, 0) scale(${0.72 + slotPop * 0.28})`,
                    opacity: slotPop,
                  }}
                >
                  <PartnerGlyph idx={slotIdx} />
                </span>
              </span>
              <span>{headlineLine2Suffix}</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // 2. Calm Editorial Serif Brand Wordmark + Micro URL End-Card (104..204 = 3.3s hold!)
  const lf = frame - fWordmarkStart;
  const markIn = interpolate(lf, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const urlIn = interpolate(lf, [10, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 122,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#0B0B0E",
              transform: `translate3d(0, ${(1 - markIn) * 90}px, 0)`,
              opacity: markIn,
            }}
          >
            {brandWordmark}
          </div>
        </div>

        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "0.01em",
            color: "#52525B",
            opacity: urlIn,
            transform: `translate3d(0, ${(1 - urlIn) * 14}px, 0)`,
          }}
        >
          {ctaUrl}
        </div>
      </div>
    </AbsoluteFill>
  );
};
