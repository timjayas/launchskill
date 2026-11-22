/**
 * Archetype 4 (Hera Canvas) — Scene 3: ReferenceAdTransmuteScene (240f / 8.0s @ 30fps)
 * -----------------------------------------------------------------------------------
 * 000–032f: Dark Crimson-Ember Interstitial ("Use any ad as a reference")
 * 032–096f: 3 heterogeneous competitor reference ads fan onto the #F6F6F5 dot-grid canvas
 * 096–164f: Pointer taps center -> staggered pink radial shimmer & dot-grid ripple
 *           transmutes all 3 ads IN-PLACE into the user's brand while preserving 1:1 layouts
 * 164–240f: Crisp visual comparison hold showing cohesive brand transfer
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CanvasSpawnRipple,
  CommercialAdCard,
  CrimsonEmberBackdrop,
  CrimsonInterstitialText,
  DotGridCanvasBackdrop,
} from "../components/HeraAdPrimitives";
import { TactileCursor } from "../components/StudioPrimitives";
import {
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  SPRING_EDITORIAL,
} from "../lib/motion";

export interface ReferenceAdTransmuteProps {
  productBrand?: string;
  accentColor?: string;
}

const CompetitorCard: React.FC<{
  kind: "compare" | "callout" | "dual";
  width: number;
  height: number;
}> = ({ kind, width, height }) => {
  const base: React.CSSProperties = {
    width,
    height,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 18px 46px rgba(15,15,22,0.14)",
    fontFamily: FONT_SANS,
    position: "relative",
  };

  if (kind === "compare") {
    return (
      <div
        style={{
          ...base,
          background: "linear-gradient(180deg, #6D28D9 0%, #4C1D95 100%)",
          padding: 18,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#FFFFFF",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#FDE047" }}>REFERENCE · 9:16</div>
          <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.05, marginTop: 6 }}>
            Half the Price,
            <br />
            Better Ingredients
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr",
            gap: 6,
            backgroundColor: "rgba(0,0,0,0.24)",
            borderRadius: 12,
            padding: 10,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <div style={{ color: "#DDD6FE" }}>Spec</div>
          <div style={{ textAlign: "center", color: "#FDE047" }}>$27</div>
          <div style={{ textAlign: "center", color: "#C4B5FD" }}>$49</div>
          {["L-Theanine", "Lion's Mane", "Chaga", "Coffee"].map((r) => (
            <React.Fragment key={r}>
              <div style={{ fontWeight: 500 }}>{r}</div>
              <div style={{ textAlign: "center", color: "#FDE047" }}>✓</div>
              <div style={{ textAlign: "center", color: "#A78BFA" }}>✕</div>
            </React.Fragment>
          ))}
        </div>
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            backgroundColor: "#111116",
            textAlign: "center",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          TRY IT 35% OFF TODAY
        </div>
      </div>
    );
  }

  if (kind === "callout") {
    return (
      <div
        style={{
          ...base,
          background: "radial-gradient(circle at 50% 35%, #F472B6 0%, #DB2777 65%, #831843 100%)",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#FFFFFF",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>REFERENCE · 1:1</div>
        <div style={{ fontSize: 34, fontWeight: 900, fontStyle: "italic", textAlign: "center", lineHeight: 0.96 }}>
          Shirley
          <br />
          TEMPLE
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%" }}>
          {["PREBIOTICS", "20 CALORIES", "LOW SUGAR", "FIZZY POP"].map((t) => (
            <div
              key={t}
              style={{
                padding: "6px 8px",
                borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.22)",
                fontSize: 10,
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...base,
        background: "linear-gradient(180deg, #DBEAFE 0%, #C7D2FE 55%, #818CF8 100%)",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#1E1B4B",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#4338CA" }}>MIX + MAKE</div>
        <div style={{ fontSize: 25, fontWeight: 900, lineHeight: 1.04, marginTop: 4 }}>
          PURPLE CRISPY
          <br />
          WATER
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div
          style={{
            width: 96,
            height: 30,
            borderRadius: 6,
            backgroundColor: "#1E3A8A",
            color: "#FFFFFF",
            fontSize: 10,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(26deg)",
          }}
        >
          BLUE RAZ
        </div>
        <div
          style={{
            width: 96,
            height: 30,
            borderRadius: 6,
            backgroundColor: "#0369A1",
            color: "#FFFFFF",
            fontSize: 10,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-26deg)",
          }}
        >
          COTTON
        </div>
      </div>
      <div
        style={{
          padding: "5px 12px",
          borderRadius: 999,
          backgroundColor: "#1E1B4B",
          color: "#FFFFFF",
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        TRY IT NOW
      </div>
    </div>
  );
};

export const ReferenceAdTransmuteScene: React.FC<ReferenceAdTransmuteProps> = ({
  productBrand = "Daily",
  accentColor = "#E11D48",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- ACT A: DARK INTERSTITIAL (0..32f) ----
  if (frame < 32) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <CrimsonEmberBackdrop frame={frame} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 140px" }}>
          <CrimsonInterstitialText
            prefix="Use any ad as a "
            highlight="reference"
            frame={frame}
            fps={fps}
            startFrame={0}
            fontSize={88}
          />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ---- ACT B: DOT-GRID IN-PLACE TRANSMUTATION (32..240f) ----
  const rFrame = frame - 32; // 0..208

  const cards: Array<{
    id: string;
    compKind: "compare" | "callout" | "dual";
    brandVariant: "comparison-brand" | "glow-hero" | "dual-pour-brand";
    x: number;
    y: number;
    w: number;
    h: number;
    ratioLabel: string;
    transmuteAt: number;
  }> = [
    {
      id: "left-compare",
      compKind: "compare",
      brandVariant: "comparison-brand",
      x: 245,
      y: 150,
      w: 390,
      h: 640,
      ratioLabel: "Comparison Layout · 9:16",
      transmuteAt: 64,
    },
    {
      id: "center-callout",
      compKind: "callout",
      brandVariant: "glow-hero",
      x: 756,
      y: 230,
      w: 408,
      h: 580,
      ratioLabel: "Callout Hero · 4:5",
      transmuteAt: 76,
    },
    {
      id: "right-dual",
      compKind: "dual",
      brandVariant: "dual-pour-brand",
      x: 1286,
      y: 300,
      w: 390,
      h: 590,
      ratioLabel: "Dual-Pour Layout · 4:5",
      transmuteAt: 88,
    },
  ];

  // Cursor sweeps in and taps center reference card at rFrame = 56
  const curX = interpolate(rFrame, [26, 54, 72], [1180, 975, 1140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const curY = interpolate(rFrame, [26, 54, 72], [720, 535, 620], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const curOpacity = interpolate(rFrame, [24, 34, 68, 82], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const curScale = interpolate(rFrame, [52, 56, 61], [1, 0.84, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Top floating status pill transitions from "3 Reference Ads Dropped" -> "Brand Matched · 1:1 Layout"
  const allMatched = rFrame >= 102;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#F6F6F5", fontFamily: FONT_SANS }}>
      <DotGridCanvasBackdrop panX={-rFrame * 0.18} panY={0} />

      {/* Top status badge */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 22px",
          borderRadius: 999,
          backgroundColor: allMatched ? "#141418" : "#FFFFFF",
          color: allMatched ? "#FFFFFF" : "#27272A",
          border: allMatched ? `1.5px solid ${accentColor}` : "1.5px solid #E4E4E7",
          boxShadow: "0 12px 30px rgba(15,15,22,0.08)",
          fontSize: 16,
          fontWeight: 650,
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 30,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 99,
            backgroundColor: allMatched ? "#34D399" : accentColor,
          }}
        />
        <span>
          {allMatched
            ? `3/3 Transmuted to ${productBrand} Brand Kit · Layout Preserved`
            : "Reference Ads on Canvas · Click to Restyle In-Place"}
        </span>
      </div>

      {/* 3 In-Place Transmuting Cards */}
      {cards.map((card, idx) => {
        // Fan out cleanly from center stack (rFrame 0..28)
        const fan = spring({
          frame: Math.max(0, rFrame - idx * 3),
          fps,
          config: SPRING_EDITORIAL,
          durationInFrames: 26,
        });
        const startX = 765;
        const startY = 260;
        const curLeft = interpolate(fan, [0, 1], [startX, card.x]);
        const curTop = interpolate(fan, [0, 1], [startY, card.y]);
        const startRot = (idx - 1) * 10;
        const rot = interpolate(fan, [0, 1], [startRot, 0]);

        // Transmutation shimmer wipe (0..1)
        const wipe = interpolate(rFrame, [card.transmuteAt, card.transmuteAt + 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });
        const ripple = interpolate(rFrame, [card.transmuteAt - 4, card.transmuteAt + 34], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const popScale =
          rFrame >= card.transmuteAt && rFrame <= card.transmuteAt + 20
            ? interpolate(rFrame, [card.transmuteAt, card.transmuteAt + 8, card.transmuteAt + 20], [1, 1.035, 1])
            : 1;

        return (
          <React.Fragment key={card.id}>
            <CanvasSpawnRipple
              x={card.x + card.w / 2}
              y={card.y + card.h / 2}
              progress={ripple}
              color="#EC4899"
              maxRadius={340}
            />
            <div
              style={{
                position: "absolute",
                left: curLeft,
                top: curTop,
                transform: `rotate(${rot}deg) scale(${(0.75 + fan * 0.25) * popScale})`,
                opacity: interpolate(rFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              {/* Small geometry tag */}
              <div
                style={{
                  marginBottom: 10,
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  fontWeight: 600,
                  color: wipe > 0.5 ? accentColor : "#71717A",
                  textAlign: "center",
                }}
              >
                {wipe > 0.5 ? `✓ ${productBrand} · ${card.ratioLabel}` : card.ratioLabel}
              </div>

              <div style={{ position: "relative", width: card.w, height: card.h }}>
                {/* Layer 1: Original Reference Ad */}
                <div style={{ position: "absolute", inset: 0, opacity: 1 - wipe * 0.85 }}>
                  <CompetitorCard kind={card.compKind} width={card.w} height={card.h} />
                </div>

                {/* Layer 2: Brand-Matched Ad revealed via clean top-to-bottom clip wipe */}
                {wipe > 0.005 && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      clipPath: `inset(0 0 ${((1 - wipe) * 100).toFixed(2)}% 0)`,
                    }}
                  >
                    <CommercialAdCard
                      variant={card.brandVariant}
                      brand={productBrand}
                      width={card.w}
                      height={card.h}
                      activeBorder={wipe < 0.98}
                    />
                  </div>
                )}

                {/* Localized Pink Shimmer Bar leading the wipe */}
                {wipe > 0.02 && wipe < 0.96 && (
                  <div
                    style={{
                      position: "absolute",
                      left: -8,
                      right: -8,
                      top: wipe * card.h - 28,
                      height: 56,
                      background:
                        "linear-gradient(180deg, rgba(244,63,94,0) 0%, rgba(244,63,94,0.68) 50%, rgba(244,63,94,0) 100%)",
                      filter: "blur(6px)",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Tactile Trigger Cursor */}
      {curOpacity > 0.01 && (
        <TactileCursor x={curX} y={curY} scale={curScale} opacity={curOpacity} fill="#111116" />
      )}
    </AbsoluteFill>
  );
};
