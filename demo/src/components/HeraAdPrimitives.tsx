import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import {
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  SPRING_EDITORIAL,
} from "../lib/motion";

export interface HeraBrandTokens {
  brandWordmark: string;
  brandDomain: string;
  productBrand: string;
  primaryPlum: string;
  accentCrimson: string;
  accentPink: string;
  accentCoral: string;
  creamSurface: string;
}

export const DEFAULT_HERA_BRAND: HeraBrandTokens = {
  brandWordmark: "Hera",
  brandDomain: "drink-daily.com",
  productBrand: "Daily",
  primaryPlum: "#4C0549",
  accentCrimson: "#E11D48",
  accentPink: "#EC4899",
  accentCoral: "#FB7185",
  creamSurface: "#FDF8F4",
};

/**
 * 4-petal geometric brand emblem (vector SVG, zero external images).
 */
export const HeraPetalMark: React.FC<{
  size?: number;
  color?: string;
  rotationDeg?: number;
}> = ({ size = 44, color = "#FFFFFF", rotationDeg = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    style={{ transform: `rotate(${rotationDeg}deg)`, flexShrink: 0 }}
  >
    <rect x="6" y="6" width="16" height="16" rx="8" fill={color} />
    <rect x="26" y="6" width="16" height="16" rx="5" fill={color} opacity="0.92" />
    <rect x="6" y="26" width="16" height="16" rx="5" fill={color} opacity="0.92" />
    <rect x="26" y="26" width="16" height="16" rx="8" fill={color} />
  </svg>
);

/**
 * Signature dark crimson-ember backdrop with drifting warm terracotta wash.
 */
export const CrimsonEmberBackdrop: React.FC<{ frame: number }> = ({ frame }) => {
  const driftX = Math.sin(frame * 0.03) * 60;
  const driftY = Math.cos(frame * 0.025) * 36;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0C0607",
        backgroundImage: `
          radial-gradient(62% 58% at ${76 + driftX * 0.08}% ${74 + driftY * 0.08}%, rgba(164, 34, 48, 0.56) 0%, rgba(102, 18, 30, 0.24) 46%, rgba(12, 6, 7, 0) 78%),
          radial-gradient(50% 48% at ${20 - driftX * 0.06}% ${24 - driftY * 0.06}%, rgba(132, 26, 38, 0.34) 0%, rgba(12, 6, 7, 0) 72%)
        `,
      }}
    />
  );
};

/**
 * Light #F6F6F5 infinite dot-grid canvas (freeform artboard workspace).
 */
export const DotGridCanvasBackdrop: React.FC<{
  panX?: number;
  panY?: number;
}> = ({ panX = 0, panY = 0 }) => (
  <AbsoluteFill
    style={{
      backgroundColor: "#F6F6F5",
      backgroundImage: "radial-gradient(#D4D4D8 1.65px, transparent 1.65px)",
      backgroundSize: "30px 30px",
      backgroundPosition: `${panX}px ${panY}px`,
    }}
  />
);

/**
 * Localized radial pink dot-grid ripple emitted wherever an agent spawns/transmutes an artboard.
 */
export const CanvasSpawnRipple: React.FC<{
  x: number;
  y: number;
  progress: number; // 0..1
  color?: string;
  maxRadius?: number;
}> = ({ x, y, progress, color = "#EC4899", maxRadius = 260 }) => {
  if (progress <= 0 || progress >= 1) return null;
  const r = interpolate(progress, [0, 1], [44, maxRadius], { easing: EASE_OUT_EXPO });
  const opacity = interpolate(progress, [0, 0.25, 1], [0, 0.42, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}44 0%, ${color}22 45%, ${color}00 72%)`,
        border: `1.5px solid ${color}40`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

/**
 * Sweeping crimson-to-white editorial chapter interstitial headline.
 */
export const CrimsonInterstitialText: React.FC<{
  prefix: string;
  highlight: string;
  suffix?: string;
  frame: number;
  fps: number;
  startFrame?: number;
  fontSize?: number;
}> = ({ prefix, highlight, suffix = "", frame, fps, startFrame = 0, fontSize = 86 }) => {
  const local = Math.max(0, frame - startFrame);
  const enter = spring({
    frame: local,
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: 18,
  });
  const sweep = interpolate(local, [4, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const highlightColor = sweep < 0.72 ? "#F43F5E" : "#FAFAFA";
  const highlightShadow =
    sweep < 0.72 ? `0 0 ${Math.round((1 - sweep) * 28)}px rgba(244, 63, 94, 0.55)` : "none";

  return (
    <div
      style={{
        fontFamily: FONT_SANS,
        fontSize,
        fontWeight: 600,
        letterSpacing: "-0.038em",
        color: "#FAFAFA",
        lineHeight: 1.08,
        textAlign: "center",
        transform: `translateY(${(1 - enter) * 20}px) scale(${0.97 + enter * 0.03})`,
        opacity: interpolate(local, [0, 7], [0.25, 1], { extrapolateRight: "clamp" }),
      }}
    >
      {prefix}
      <span
        style={{
          color: highlightColor,
          textShadow: highlightShadow,
          transition: "none",
        }}
      >
        {highlight}
      </span>
      {suffix}
    </div>
  );
};

/**
 * Floating white Hera-style prompt composer card with mode icons, attachment chip & submit arrow.
 */
export const CanvasPromptCard: React.FC<{
  modeLabel?: string;
  attachmentName?: string;
  promptText: string;
  showCaret?: boolean;
  submitted?: boolean;
  width?: number;
  accentColor?: string;
  style?: React.CSSProperties;
}> = ({
  modeLabel = "Image",
  attachmentName,
  promptText,
  showCaret = false,
  submitted = false,
  width = 620,
  accentColor = "#E11D48",
  style,
}) => (
  <div
    style={{
      width,
      backgroundColor: "#FFFFFF",
      borderRadius: 24,
      padding: "18px 22px 16px",
      border: submitted ? `2px solid ${accentColor}` : "1.5px solid #E4E4E7",
      boxShadow: submitted
        ? `0 22px 54px rgba(225,29,72,0.14), 0 0 0 4px ${accentColor}1A`
        : "0 20px 52px rgba(17,17,22,0.08)",
      fontFamily: FONT_SANS,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          padding: "5px 12px",
          borderRadius: 10,
          backgroundColor: "#F4F4F5",
          border: "1px solid #E4E4E7",
          fontSize: 15,
          fontWeight: 650,
          color: "#18181B",
        }}
      >
        {modeLabel}
      </span>
      {attachmentName && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 12px",
            borderRadius: 10,
            backgroundColor: "#FFF1F2",
            border: "1px solid #FECDD3",
            fontSize: 14,
            fontWeight: 600,
            color: "#9F1239",
            fontFamily: FONT_MONO,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: "linear-gradient(135deg, #EC4899, #FB7185)",
            }}
          />
          {attachmentName}
        </span>
      )}
    </div>

    <div
      style={{
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: "-0.02em",
        color: "#18181B",
        minHeight: 32,
        display: "flex",
        alignItems: "center",
      }}
    >
      <span>{promptText}</span>
      {showCaret && (
        <span
          style={{
            display: "inline-block",
            width: 2.5,
            height: 24,
            marginLeft: 3,
            backgroundColor: accentColor,
            borderRadius: 2,
          }}
        />
      )}
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          backgroundColor: "#F4F4F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 600,
          color: "#52525B",
        }}
      >
        +
      </span>
      <span
        style={{
          padding: "5px 12px",
          borderRadius: 999,
          backgroundColor: "#F4F4F5",
          fontSize: 14,
          fontWeight: 600,
          color: "#52525B",
        }}
      >
        Auto ⌄
      </span>
      <span
        style={{
          padding: "5px 12px",
          borderRadius: 999,
          backgroundColor: "#F4F4F5",
          fontSize: 14,
          fontWeight: 600,
          color: "#71717A",
        }}
      >
        Count Auto ⌄
      </span>
      <span
        style={{
          marginLeft: "auto",
          padding: "5px 12px",
          borderRadius: 999,
          backgroundColor: "#F4F4F5",
          fontSize: 14,
          fontWeight: 600,
          color: "#27272A",
        }}
      >
        Medium ⌄
      </span>
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          backgroundColor: submitted ? accentColor : "#111116",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 700,
          transform: submitted ? "scale(0.92)" : "scale(1)",
        }}
      >
        ↑
      </span>
    </div>
  </div>
);

/**
 * Dark-pill AI agent cursor with crimson 4-point star badge (Hera Canvas freeform signature).
 */
export const AgentRolePillCursor: React.FC<{
  x: number;
  y: number;
  label: string;
  opacity?: number;
  scale?: number;
}> = ({ x, y, label, opacity = 1, scale = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      transformOrigin: "0 0",
      opacity,
      pointerEvents: "none",
      zIndex: 40,
      display: "flex",
      alignItems: "flex-start",
      gap: 6,
    }}
  >
    <svg width="26" height="30" viewBox="0 0 28 32" fill="none">
      <path
        d="M3 2.5L23.5 14.8L13.5 17.5L9.2 27.5L3 2.5Z"
        fill="#111116"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
    <div
      style={{
        marginTop: 14,
        padding: "8px 16px",
        borderRadius: 999,
        backgroundColor: "#141418",
        color: "#FFFFFF",
        fontFamily: FONT_SANS,
        fontSize: 17,
        fontWeight: 650,
        letterSpacing: "-0.015em",
        display: "flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 12px 28px rgba(10,10,16,0.22)",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: "#F43F5E", fontSize: 16 }}>✦</span>
      <span>{label}</span>
    </div>
  </div>
);

/**
 * Stylized vector hydration stick sachet (used across Daily brand ads).
 */
export const ProductStickVector: React.FC<{
  brand?: string;
  flavor?: string;
  colorA?: string;
  colorB?: string;
  width?: number;
  height?: number;
  vertical?: boolean;
  rotationDeg?: number;
}> = ({
  brand = "Daily",
  flavor = "GLOW",
  colorA = "#DB2777",
  colorB = "#FB7185",
  width = 210,
  height = 54,
  vertical = false,
  rotationDeg = 0,
}) => (
  <div
    style={{
      width: vertical ? height : width,
      height: vertical ? width : height,
      borderRadius: 8,
      background: `linear-gradient(${vertical ? "180deg" : "105deg"}, ${colorA} 0%, ${colorB} 55%, ${colorA} 100%)`,
      boxShadow: "0 14px 28px rgba(76, 5, 73, 0.22), inset 0 2px 6px rgba(255,255,255,0.42)",
      display: "flex",
      flexDirection: vertical ? "column" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: vertical ? "14px 8px" : "0 18px",
      transform: `rotate(${rotationDeg}deg)`,
      position: "relative",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.3)",
    }}
  >
    <span
      style={{
        fontFamily: FONT_SANS,
        fontSize: vertical ? 20 : 24,
        fontWeight: 900,
        letterSpacing: "-0.04em",
        color: "#FFFFFF",
        writingMode: vertical ? "vertical-rl" : undefined,
        transform: vertical ? "rotate(180deg)" : undefined,
      }}
    >
      {brand}
    </span>
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "#4C0549",
        backgroundColor: "rgba(255,255,255,0.72)",
        padding: "3px 8px",
        borderRadius: 999,
      }}
    >
      {flavor}
    </span>
  </div>
);

/**
 * Reusable high-craft commercial ad artboard templates (16:9, 9:16, 4:5, 1:1).
 */
export const CommercialAdCard: React.FC<{
  variant:
    | "glow-hero"
    | "banner-16x9"
    | "story-9x16"
    | "editorial-no-sugar"
    | "comparison-brand"
    | "dual-pour-brand"
    | "zesty-citrus"
    | "berry-glass"
    | "water-wow";
  brand?: string;
  width: number;
  height: number;
  activeBorder?: boolean;
  style?: React.CSSProperties;
}> = ({ variant, brand = "Daily", width, height, activeBorder = false, style }) => {
  const baseStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    boxShadow: activeBorder
      ? "0 24px 60px rgba(225, 29, 72, 0.22), 0 0 0 3px #F43F5E"
      : "0 18px 46px rgba(15, 15, 22, 0.14)",
    fontFamily: FONT_SANS,
    ...style,
  };

  if (variant === "glow-hero") {
    return (
      <div
        style={{
          ...baseStyle,
          background:
            "radial-gradient(circle at 50% 24%, #FDA4AF 0%, #F43F5E 48%, #9D174D 100%)",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#FFFFFF",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>{brand}</div>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: Math.max(38, width * 0.2),
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              marginTop: 4,
            }}
          >
            GLOW
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.92, marginTop: 4 }}>
            Water with Benefits.
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {["COLLAGEN", "BIOTIN", "NO SUGAR"].map((tag) => (
            <span
              key={tag}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                backgroundColor: "rgba(255,255,255,0.92)",
                color: "#881337",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.04em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <ProductStickVector brand={brand} flavor="GLOW" width={width * 0.72} height={42} rotationDeg={-12} />
        <div
          style={{
            padding: "6px 14px",
            borderRadius: 999,
            backgroundColor: "#4C0549",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          Discover Glow
        </div>
      </div>
    );
  }

  if (variant === "banner-16x9") {
    return (
      <div
        style={{
          ...baseStyle,
          background:
            "linear-gradient(115deg, #DB2777 0%, #F472B6 38%, #FCE7F3 72%, #FDBA74 100%)",
          padding: "22px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 18,
            fontSize: 15,
            fontWeight: 900,
            color: "#FFFFFF",
          }}
        >
          {brand}
        </div>
        <ProductStickVector
          brand={brand}
          flavor="BERRY"
          vertical
          width={height * 0.76}
          height={48}
          rotationDeg={-4}
        />
        <div
          style={{
            flex: 1,
            fontFamily: FONT_SERIF,
            fontSize: Math.max(24, height * 0.145),
            fontWeight: 800,
            color: "#4C0549",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            textAlign: "right",
          }}
        >
          One stick.
          <br />
          Your moment.
        </div>
      </div>
    );
  }

  if (variant === "story-9x16") {
    return (
      <div
        style={{
          ...baseStyle,
          background:
            "radial-gradient(circle at 50% 62%, #FFF1F2 0%, #F9A8D4 48%, #DB2777 100%)",
          padding: "18px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ alignSelf: "flex-start", fontSize: 14, fontWeight: 900, color: "#FFFFFF" }}>
          {brand}
        </div>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: Math.max(22, width * 0.13),
            fontWeight: 800,
            color: "#4C0549",
            textAlign: "center",
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
          }}
        >
          One stick.
          <br />
          Your moment.
        </div>
        <ProductStickVector
          brand={brand}
          flavor="GLOW"
          vertical
          width={height * 0.46}
          height={44}
        />
        <div
          style={{
            padding: "6px 14px",
            borderRadius: 999,
            backgroundColor: "#4C0549",
            color: "#FFFFFF",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          Shop {brand}
        </div>
      </div>
    );
  }

  if (variant === "editorial-no-sugar") {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: "#FDF8F4",
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 900, color: "#E11D48" }}>{brand}</div>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: Math.max(30, width * 0.155),
            fontWeight: 800,
            color: "#4C0549",
            lineHeight: 0.96,
            letterSpacing: "-0.035em",
          }}
        >
          No added
          <br />
          sugar.
          <br />
          All {brand}.
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <ProductStickVector brand={brand} flavor="GLOW" width={width * 0.8} height={42} rotationDeg={-3} />
          <span
            style={{
              padding: "5px 14px",
              borderRadius: 999,
              backgroundColor: "#4C0549",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Discover {brand}
          </span>
        </div>
      </div>
    );
  }

  if (variant === "comparison-brand") {
    return (
      <div
        style={{
          ...baseStyle,
          background: "linear-gradient(180deg, #E11D48 0%, #FB7185 38%, #4C0549 38%, #3B0764 100%)",
          padding: 18,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#FFFFFF",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 900 }}>{brand}</div>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.02,
              marginTop: 4,
            }}
          >
            Water with
            <br />
            Benefits.
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr 1fr",
            gap: 6,
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: 10,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <div style={{ color: "#FBCFE8" }}>Feature</div>
          <div style={{ textAlign: "center", color: "#FDF2F8" }}>{brand}</div>
          <div style={{ textAlign: "center", color: "#A1A1AA" }}>Plain</div>
          {["Collagen", "Biotin", "Berry Taste", "0g Sugar"].map((row) => (
            <React.Fragment key={row}>
              <div style={{ fontWeight: 500, color: "#F5D0FE" }}>{row}</div>
              <div style={{ textAlign: "center", color: "#34D399" }}>✓</div>
              <div style={{ textAlign: "center", color: "#F43F5E" }}>✕</div>
            </React.Fragment>
          ))}
        </div>
        <div
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            backgroundColor: "#FDF2F8",
            color: "#4C0549",
            textAlign: "center",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          Try {brand} Glow
        </div>
      </div>
    );
  }

  if (variant === "dual-pour-brand") {
    return (
      <div
        style={{
          ...baseStyle,
          background: "linear-gradient(180deg, #FFF7ED 0%, #FBCFE8 62%, #E11D48 100%)",
          padding: 18,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#E11D48" }}>{brand}</div>
          <span
            style={{
              display: "inline-block",
              marginTop: 4,
              padding: "3px 10px",
              borderRadius: 999,
              backgroundColor: "#4C0549",
              color: "#FFFFFF",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.06em",
            }}
          >
            MIX + MAKE
          </span>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 28,
              fontWeight: 800,
              color: "#4C0549",
              lineHeight: 1.0,
              marginTop: 6,
            }}
          >
            Water with
            <br />
            Benefits.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <ProductStickVector brand={brand} flavor="GLOW" width={118} height={34} rotationDeg={28} />
          <ProductStickVector
            brand={brand}
            flavor="FOCUS"
            colorA="#7C3AED"
            colorB="#A78BFA"
            width={118}
            height={34}
            rotationDeg={-28}
          />
        </div>
        <div
          style={{
            padding: "6px 14px",
            borderRadius: 999,
            backgroundColor: "#4C0549",
            color: "#FFFFFF",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          Glow + Hydration
        </div>
      </div>
    );
  }

  if (variant === "zesty-citrus") {
    return (
      <div
        style={{
          ...baseStyle,
          background: "linear-gradient(155deg, #FDE047 0%, #FB923C 58%, #EA580C 100%)",
          padding: 18,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 900, color: "#4C0549" }}>{brand}</div>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: Math.max(26, width * 0.14),
            fontWeight: 800,
            color: "#4C0549",
            lineHeight: 0.98,
          }}
        >
          Hello,
          <br />
          zesty side.
        </div>
        <ProductStickVector
          brand={brand}
          flavor="CITRUS"
          colorA="#EA580C"
          colorB="#FACC15"
          width={width * 0.78}
          height={38}
          rotationDeg={-8}
        />
      </div>
    );
  }

  if (variant === "water-wow") {
    return (
      <div
        style={{
          ...baseStyle,
          background: "linear-gradient(120deg, #F7FEE7 0%, #BEF264 62%, #65A30D 100%)",
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: Math.max(24, height * 0.16),
            fontWeight: 800,
            color: "#3F0D3D",
            lineHeight: 1.0,
          }}
        >
          Water.
          <br />
          But wow.
        </div>
        <ProductStickVector
          brand={brand}
          flavor="FOCUS"
          colorA="#4D7C0F"
          colorB="#84CC16"
          width={width * 0.44}
          height={40}
          rotationDeg={-5}
        />
      </div>
    );
  }

  // berry-glass fallback
  return (
    <div
      style={{
        ...baseStyle,
        background: "linear-gradient(160deg, #E11D48 0%, #BE185D 60%, #4C0549 100%)",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#FFFFFF",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 900 }}>{brand}</div>
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontSize: Math.max(26, width * 0.14),
          fontWeight: 800,
          lineHeight: 0.98,
        }}
      >
        Berry love.
        <br />
        On the go.
      </div>
      <ProductStickVector brand={brand} flavor="BERRY" width={width * 0.76} height={38} rotationDeg={-6} />
    </div>
  );
};
