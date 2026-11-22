/**
 * Archetype 4 (Hera Canvas) — Scene 2: BrandKitRadialBloomScene (240f / 8.0s @ 30fps)
 * -----------------------------------------------------------------------------------
 * 000–036f: Dark Crimson-Ember Interstitial ("Hera knows your brand")
 * 036–150f: URL-to-Brand-Kit Radial Bloom on #F6F6F5 dot-grid canvas
 *           (Centered URL prompt -> Colors, Logo, Type, Starter Set spring radially)
 * 150–240f: Midpoint Multi-Angle Dark Showcase ("Explore different angles" + drifting wall)
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CanvasPromptCard,
  CanvasSpawnRipple,
  CrimsonEmberBackdrop,
  CrimsonInterstitialText,
  DotGridCanvasBackdrop,
  ProductStickVector,
} from "../components/HeraAdPrimitives";
import {
  EASE_OUT_EXPO,
  FONT_SANS,
  FONT_SERIF,
  getCaretOpacity,
  getNaturalTypedLength,
  SPRING_EDITORIAL,
} from "../lib/motion";

export interface BrandKitRadialBloomProps {
  brandWordmark?: string;
  productBrand?: string;
  brandDomain?: string;
  brandFontName?: string;
  accentColor?: string;
  swatches?: [string, string, string, string, string];
}

export const BrandKitRadialBloomScene: React.FC<BrandKitRadialBloomProps> = ({
  brandWordmark = "Hera",
  productBrand = "Daily",
  brandDomain = "drink-daily.com",
  brandFontName = "Forrest",
  accentColor = "#E11D48",
  swatches = ["#FFF7ED", "#4C0549", "#E11D48", "#FB7185", "#F472B6"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- ACT A: DARK INTERSTITIAL (0..36f) ----
  if (frame < 36) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <CrimsonEmberBackdrop frame={frame} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 140px" }}>
          <CrimsonInterstitialText
            prefix={`${brandWordmark} knows `}
            highlight="your brand"
            frame={frame}
            fps={fps}
            startFrame={0}
            fontSize={92}
          />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ---- ACT B: URL-TO-BRAND-KIT RADIAL BLOOM ON DOT-GRID (36..150f) ----
  if (frame < 150) {
    const bFrame = frame - 36; // 0..114
    const promptFull = `Set up our brand for ${brandDomain}`;
    const typedLen = getNaturalTypedLength(promptFull, bFrame, 2, 46, fps);
    const isTyping = typedLen < promptFull.length;
    const submitted = bFrame >= 34;

    const rippleProgress = interpolate(bFrame, [34, 78], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const cardBloom = (delay: number) =>
      spring({
        frame: Math.max(0, bFrame - (38 + delay)),
        fps,
        config: SPRING_EDITORIAL,
        durationInFrames: 24,
      });

    const logoSp = cardBloom(0);
    const typeSp = cardBloom(5);
    const colorSp = cardBloom(10);
    const starterSp = cardBloom(15);

    const promptScale = interpolate(bFrame, [36, 56], [1.08, 0.96], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });

    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#F6F6F5", fontFamily: FONT_SANS }}>
        <DotGridCanvasBackdrop panX={-bFrame * 0.2} panY={0} />

        {/* Central pink radial wave when brand tokens explode outward */}
        <CanvasSpawnRipple x={960} y={540} progress={rippleProgress} color="#EC4899" maxRadius={680} />

        {/* Quadrant 1 (Top-Center): Colors Palette Card */}
        {bFrame >= 46 && (
          <div
            style={{
              position: "absolute",
              left: 440,
              top: 86,
              transform: `translate(${(1 - colorSp) * 160}px, ${(1 - colorSp) * 260}px) scale(${
                0.76 + colorSp * 0.24
              })`,
              opacity: interpolate(bFrame, [46, 54], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600, color: "#52525B", marginBottom: 10 }}>
              Colors
            </div>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                padding: "24px 30px",
                border: "1.5px solid #E4E4E7",
                boxShadow: "0 18px 46px rgba(15,15,22,0.08)",
                display: "flex",
                gap: 20,
              }}
            >
              {swatches.map((hex, i) => (
                <div
                  key={hex}
                  style={{
                    width: 82,
                    height: 82,
                    borderRadius: "50%",
                    backgroundColor: hex,
                    border: i === 0 ? "1.5px solid #E4E4E7" : "none",
                    boxShadow: "inset 0 -4px 10px rgba(0,0,0,0.08)",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quadrant 2 (Top-Right): Logo Card */}
        {bFrame >= 36 && (
          <div
            style={{
              position: "absolute",
              left: 1385,
              top: 136,
              transform: `translate(${(1 - logoSp) * -320}px, ${(1 - logoSp) * 240}px) scale(${
                0.72 + logoSp * 0.28
              })`,
              opacity: interpolate(bFrame, [36, 44], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600, color: "#52525B", marginBottom: 10 }}>
              Logo
            </div>
            <div
              style={{
                width: 400,
                height: 218,
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: `2px solid ${accentColor}`,
                boxShadow: "0 20px 50px rgba(225,29,72,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 96,
                  fontWeight: 900,
                  letterSpacing: "-0.055em",
                  background: "linear-gradient(110deg, #F97316 0%, #E11D48 55%, #BE123C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {productBrand}
              </span>
            </div>
          </div>
        )}

        {/* Quadrant 3 (Bottom-Left): Typography Specimen Card */}
        {bFrame >= 41 && (
          <div
            style={{
              position: "absolute",
              left: 146,
              top: 686,
              transform: `translate(${(1 - typeSp) * 340}px, ${(1 - typeSp) * -170}px) scale(${
                0.76 + typeSp * 0.24
              })`,
              opacity: interpolate(bFrame, [41, 49], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600, color: "#52525B", marginBottom: 10 }}>
              Type
            </div>
            <div
              style={{
                width: 540,
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                padding: "28px 34px",
                border: "1.5px solid #E4E4E7",
                boxShadow: "0 18px 46px rgba(15,15,22,0.08)",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: 78,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#4C0549",
                  lineHeight: 0.96,
                }}
              >
                {brandFontName}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#52525B",
                  marginTop: 12,
                }}
              >
                DM Sans for copy, labels and buttons
              </div>
            </div>
          </div>
        )}

        {/* Quadrant 4 (Bottom-Right): Starter Set Visual Card */}
        {bFrame >= 51 && (
          <div
            style={{
              position: "absolute",
              left: 1054,
              top: 722,
              transform: `translate(${(1 - starterSp) * -220}px, ${(1 - starterSp) * -160}px) scale(${
                0.76 + starterSp * 0.24
              })`,
              opacity: interpolate(bFrame, [51, 59], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600, color: "#52525B", marginBottom: 10 }}>
              Starter set
            </div>
            <div
              style={{
                width: 610,
                height: 210,
                borderRadius: 20,
                padding: 18,
                backgroundColor: "#FFFFFF",
                border: "1.5px solid #E4E4E7",
                boxShadow: "0 18px 46px rgba(15,15,22,0.08)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 14,
                  background: "linear-gradient(108deg, #FDE047 0%, #FB7185 45%, #DB2777 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  padding: "0 24px",
                }}
              >
                <ProductStickVector brand={productBrand} flavor="GLOW" width={196} height={50} rotationDeg={-16} />
                <ProductStickVector
                  brand={productBrand}
                  flavor="MIXED BOX"
                  colorA="#EA580C"
                  colorB="#FACC15"
                  width={180}
                  height={54}
                  rotationDeg={12}
                />
              </div>
            </div>
          </div>
        )}

        {/* Center Anchor: URL Prompt Composer */}
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `scale(${promptScale})` }}>
            <CanvasPromptCard
              modeLabel="Brand Kit"
              promptText={promptFull.slice(0, typedLen)}
              showCaret={getCaretOpacity(bFrame, isTyping, fps) > 0.5 && !submitted}
              submitted={submitted}
              width={690}
              accentColor={accentColor}
            />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ---- ACT C: MIDPOINT MULTI-ANGLE DARK SHOWCASE WALL (150..240f) ----
  const wFrame = frame - 150; // 0..90
  const angles = [
    { quote: "This meeting could've been a sip.", tag: "Office UGC", bg: "linear-gradient(145deg,#312E81,#4C1D95)", x: 110, y: 80, w: 390, h: 250, vx: -1.1 },
    { quote: "Came for a snack. Stayed for Glow.", tag: "Retail Angle", bg: "linear-gradient(145deg,#7C2D12,#9A3412)", x: 560, y: 40, w: 350, h: 280, vx: 0.8 },
    { quote: "My emotional support passenger.", tag: "Travel Reel", bg: "linear-gradient(145deg,#831843,#BE185D)", x: 970, y: 74, w: 410, h: 255, vx: -0.9 },
    { quote: "Booked. Busy. Horizontal.", tag: "Poolside", bg: "linear-gradient(145deg,#134E4A,#0F766E)", x: 1440, y: 50, w: 370, h: 270, vx: 1.0 },
    { quote: "Zero sugar. Zero crash.", tag: "Creator Hook", bg: "linear-gradient(145deg,#581C87,#9333EA)", x: 160, y: 710, w: 380, h: 270, vx: 1.1 },
    { quote: "One stick. One bottle. Done.", tag: "Product Demo", bg: "linear-gradient(145deg,#9F1239,#E11D48)", x: 610, y: 740, w: 420, h: 250, vx: -0.8 },
    { quote: "Water. But actually exciting.", tag: "Paid Social", bg: "linear-gradient(145deg,#3F6212,#65A30D)", x: 1090, y: 720, w: 370, h: 270, vx: 0.9 },
    { quote: "The only routine I didn't abandon.", tag: "Testimonial", bg: "linear-gradient(145deg,#78350F,#D97706)", x: 1510, y: 730, w: 340, h: 255, vx: -1.0 },
  ];

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      <CrimsonEmberBackdrop frame={frame} />

      {angles.map((card, i) => {
        const sp = spring({
          frame: Math.max(0, wFrame - i * 3),
          fps,
          config: SPRING_EDITORIAL,
          durationInFrames: 22,
        });
        const drift = wFrame * card.vx * 1.4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: card.x + drift,
              top: card.y,
              width: card.w,
              height: card.h,
              borderRadius: 20,
              background: card.bg,
              padding: "22px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 22px 54px rgba(0,0,0,0.42)",
              transform: `scale(${0.86 + sp * 0.14})`,
              opacity: interpolate(wFrame - i * 3, [0, 8], [0, 0.92], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <span
              style={{
                alignSelf: "flex-start",
                padding: "4px 10px",
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.16)",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              {card.tag}
            </span>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontSize: 32,
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              “{card.quote}”
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.8)" }}>
              {productBrand} · 9:16 / 4:5
            </div>
          </div>
        );
      })}

      {/* Center Editorial Band */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            padding: "22px 44px",
            borderRadius: 24,
            backgroundColor: "rgba(12, 6, 7, 0.78)",
            border: "1px solid rgba(244, 63, 94, 0.25)",
          }}
        >
          <CrimsonInterstitialText
            prefix="Explore "
            highlight="different angles"
            frame={frame}
            fps={fps}
            startFrame={150}
            fontSize={84}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
