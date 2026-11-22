/**
 * Archetype 4 (Hera Canvas) — Scene 4: StaticToMotionAdZoomScene (450f / 15.0s @ 30fps)
 * -----------------------------------------------------------------------------------
 * 000–036f: Dark Crimson-Ember Interstitial ("Create static and motion ads")
 * 036–180f: Static-to-Motion Side-by-Side Split on #F6F6F5 dot-grid
 *           (Left static 4:5 ad + Animation prompt -> Right companion artboard blooms & animates live)
 * 180–255f: "Showing Output Inside the Tool" — Focal-Locked Canvas-to-Full-Bleed Ad Zoom
 *           (Camera locks onto animated right artboard and smoothly fills 1920x1080 viewport)
 * 255–345f: Dark Multi-Aspect Canvas Panorama Masonry Sweep (14+ finished ads on beat pulses)
 * 345–450f: Fast <=0.85s Brand Lockup + Calm 2.65s URL CTA Hold (upgrades ref's 3.5s empty fade)
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CanvasPromptCard,
  CanvasSpawnRipple,
  CommercialAdCard,
  CrimsonEmberBackdrop,
  CrimsonInterstitialText,
  DotGridCanvasBackdrop,
  HeraPetalMark,
  ProductStickVector,
} from "../components/HeraAdPrimitives";
import {
  computeCameraTransform,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  getCaretOpacity,
  getNaturalTypedLength,
  SPRING_EDITORIAL,
  SPRING_POP,
} from "../lib/motion";

export interface StaticToMotionAdZoomProps {
  brandWordmark?: string;
  productBrand?: string;
  ctaUrl?: string;
  ctaButtonText?: string;
  animatePrompt?: string;
  accentColor?: string;
}

export const StaticToMotionAdZoomScene: React.FC<StaticToMotionAdZoomProps> = ({
  brandWordmark = "Hera",
  productBrand = "Daily",
  ctaUrl = "hera.video/canvas",
  ctaButtonText = "Try Hera Canvas",
  animatePrompt = "Animate this ad",
  accentColor = "#E11D48",
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
            prefix="Create static and "
            highlight="motion ads"
            frame={frame}
            fps={fps}
            startFrame={0}
            fontSize={88}
          />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ---- ACT B + C: STATIC-TO-MOTION SPLIT -> CANVAS-TO-FULL-BLEED AD ZOOM (36..255f) ----
  if (frame < 255) {
    const sFrame = frame - 36; // 0..219
    const typedLen = getNaturalTypedLength(animatePrompt, sFrame, 4, 34, fps);
    const isTyping = typedLen < animatePrompt.length;
    const submitted = sFrame >= 36;

    // Right animated companion artboard center in canvas space
    const rightX = 995;
    const rightY = 98;
    const rightW = 500;
    const rightH = 604;
    const rightCX = rightX + rightW / 2; // 1245
    const rightCY = rightY + rightH / 2; // 400

    // Companion card blooms right after submit (sFrame 40..64)
    const companionSp = spring({
      frame: Math.max(0, sFrame - 40),
      fps,
      config: SPRING_EDITORIAL,
      durationInFrames: 24,
    });
    const rippleProgress = interpolate(sFrame, [38, 78], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Live kinetic animation INSIDE the right companion artboard (loops cleanly during zoom!)
    const animLocal = Math.max(0, sFrame - 52);
    const line1Sp = spring({ frame: Math.max(0, animLocal), fps, config: SPRING_EDITORIAL, durationInFrames: 20 });
    const line2Sp = spring({ frame: Math.max(0, animLocal - 7), fps, config: SPRING_EDITORIAL, durationInFrames: 20 });
    const line3Sp = spring({ frame: Math.max(0, animLocal - 14), fps, config: SPRING_EDITORIAL, durationInFrames: 20 });
    const stickDropSp = spring({ frame: Math.max(0, animLocal - 20), fps, config: SPRING_POP, durationInFrames: 24 });
    const stickTilt = interpolate(animLocal, [20, 44, 96, 150], [-22, -4, 3, -2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const ctaPillSp = spring({ frame: Math.max(0, animLocal - 34), fps, config: SPRING_EDITORIAL, durationInFrames: 18 });

    // "Showing Output Inside the Tool": Focal-Locked Camera Zoom (sFrame 144..186 -> holds full-bleed 186..219)
    const zoomProg = interpolate(sFrame, [144, 184], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const camX = interpolate(zoomProg, [0, 1], [960, rightCX]);
    const camY = interpolate(zoomProg, [0, 1], [540, rightCY]);
    // Zoom so the 604px tall artboard fills 1080p cleanly inside safe-zone while blending into full-bleed 16:9!
    const camZoom = interpolate(zoomProg, [0, 1], [1.0, 1.72]);
    const cam = computeCameraTransform(camX, camY, camZoom);

    // Tool chrome & left static card fade away cleanly during camera zoom
    const chromeFade = interpolate(zoomProg, [0, 0.45], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // As zoom completes, smoothly widen the artboard backdrop to full-bleed 16:9 commercial playback
    const fullBleedExpand = interpolate(zoomProg, [0.42, 0.92], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });

    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#F6F6F5", fontFamily: FONT_SANS }}>
        <DotGridCanvasBackdrop panX={-sFrame * 0.15} panY={0} />

        {/* Full-Bleed Cream Edge Wash ABOVE dot-grid & BELOW camera rig so zoom melts seamlessly into 16:9 */}
        {fullBleedExpand > 0.01 && (
          <AbsoluteFill
            style={{
              backgroundColor: "#FDF8F4",
              opacity: fullBleedExpand,
            }}
          />
        )}

        {/* Focal-Locked Camera Rig */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate3d(${cam.x}px, ${cam.y}px, 0) scale(${cam.scale})`,
            transformOrigin: "0 0",
          }}
        >
          <CanvasSpawnRipple
            x={rightCX}
            y={rightCY}
            progress={rippleProgress}
            color="#EC4899"
            maxRadius={420}
          />

          {/* Left Static Source Ad (Frozen reference) */}
          <div
            style={{
              position: "absolute",
              left: 472,
              top: 170,
              opacity: chromeFade,
              transform: `translateX(${interpolate(companionSp, [0, 1], [170, 0])}px)`,
            }}
          >
            <div
              style={{
                marginBottom: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 999,
                backgroundColor: "#FFFFFF",
                border: "1px solid #E4E4E7",
                fontSize: 13,
                fontWeight: 650,
                color: "#71717A",
                fontFamily: FONT_MONO,
              }}
            >
              STATIC · JPG
            </div>
            <CommercialAdCard
              variant="editorial-no-sugar"
              brand={productBrand}
              width={408}
              height={480}
            />
          </div>

          {/* Right Animated Companion Artboard (Comes alive live -> zooms to Full-Bleed!) */}
          {sFrame >= 40 && (
            <div
              style={{
                position: "absolute",
                left: rightX,
                top: rightY,
                width: rightW,
                height: rightH,
                transform: `scale(${0.8 + companionSp * 0.2})`,
                opacity: interpolate(sFrame, [40, 48], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              {/* Status badge fades out during zoom */}
              <div
                style={{
                  position: "absolute",
                  top: -36,
                  left: 0,
                  opacity: chromeFade,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "4px 12px",
                  borderRadius: 999,
                  backgroundColor: "#141418",
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: FONT_MONO,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: 99, backgroundColor: "#F43F5E" }} />
                LIVE MOTION · 60 FPS
              </div>

              {/* Artboard Canvas Surface (expands borderless into Full-Bleed Cream Commercial) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: interpolate(fullBleedExpand, [0, 1], [18, 0]),
                  background:
                    sFrame < 54
                      ? "linear-gradient(155deg, #FDA4AF 0%, #FBCFE8 55%, #FDF8F4 100%)"
                      : "#FDF8F4",
                  border:
                    chromeFade > 0.05
                      ? `2.5px solid rgba(244, 63, 94, ${chromeFade.toFixed(2)})`
                      : "none",
                  boxShadow:
                    chromeFade > 0.05
                      ? `0 26px 64px rgba(225,29,72,${(0.18 * chromeFade).toFixed(2)})`
                      : "none",
                  padding: "30px 36px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: accentColor,
                    opacity: interpolate(animLocal, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
                  }}
                >
                  {productBrand}
                </div>

                {/* Live Staggered Kinetic Typography */}
                <div
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: 80,
                    fontWeight: 800,
                    color: "#4C0549",
                    lineHeight: 0.94,
                    letterSpacing: "-0.038em",
                  }}
                >
                  <div
                    style={{
                      transform: `translateY(${(1 - line1Sp) * 34}px)`,
                      opacity: line1Sp,
                    }}
                  >
                    No added
                  </div>
                  <div
                    style={{
                      transform: `translateY(${(1 - line2Sp) * 34}px)`,
                      opacity: line2Sp,
                    }}
                  >
                    sugar.
                  </div>
                  <div
                    style={{
                      transform: `translateY(${(1 - line3Sp) * 34}px)`,
                      opacity: line3Sp,
                    }}
                  >
                    All {productBrand}.
                  </div>
                </div>

                {/* Live Tumbling Product Stick + Animated CTA */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      transform: `translateY(${(1 - stickDropSp) * -46}px) scale(${
                        0.82 + stickDropSp * 0.18
                      })`,
                      opacity: interpolate(animLocal, [18, 26], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }),
                    }}
                  >
                    <ProductStickVector
                      brand={productBrand}
                      flavor="GLOW"
                      width={370}
                      height={68}
                      rotationDeg={stickTilt}
                    />
                  </div>
                  <div
                    style={{
                      padding: "10px 26px",
                      borderRadius: 999,
                      backgroundColor: "#4C0549",
                      color: "#FFFFFF",
                      fontSize: 16,
                      fontWeight: 700,
                      transform: `scale(${0.8 + ctaPillSp * 0.2})`,
                      opacity: ctaPillSp,
                    }}
                  >
                    Discover {productBrand} →
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Docked Bottom Prompt Bar (Animation Mode) */}
          <div
            style={{
              position: "absolute",
              left: 615,
              top: 760,
              opacity: chromeFade,
              transform: `translateY(${(1 - chromeFade) * 60}px)`,
            }}
          >
            <CanvasPromptCard
              modeLabel="Animation"
              attachmentName="daily-sugar-v2.jpg"
              promptText={animatePrompt.slice(0, typedLen)}
              showCaret={getCaretOpacity(sFrame, isTyping, fps) > 0.5 && !submitted}
              submitted={submitted}
              width={690}
              accentColor={accentColor}
            />
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // ---- ACT D: DARK CANVAS PANORAMA MASONRY SWEEP (255..345f) ----
  if (frame < 345) {
    const pFrame = frame - 255; // 0..90
    const wallZoom = interpolate(pFrame, [0, 90], [1.12, 0.96], {
      easing: EASE_OUT_EXPO,
    });
    const wallPanX = interpolate(pFrame, [0, 90], [28, -46]);
    const beatPulse = Math.floor(pFrame / 12); // rhythmic 0.4s beat pulse shifts

    const tiles: Array<{
      x: number;
      y: number;
      w: number;
      h: number;
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
    }> = [
      { x: 20, y: 20, w: 300, h: 420, variant: "zesty-citrus" },
      { x: 344, y: 20, w: 460, h: 250, variant: "banner-16x9" },
      { x: 828, y: 20, w: 310, h: 430, variant: "glow-hero" },
      { x: 1162, y: 20, w: 420, h: 240, variant: "water-wow" },
      { x: 1606, y: 20, w: 294, h: 440, variant: "story-9x16" },
      { x: 344, y: 294, w: 460, h: 320, variant: "dual-pour-brand" },
      { x: 1162, y: 284, w: 420, h: 350, variant: "berry-glass" },
      { x: 20, y: 464, w: 300, h: 440, variant: "comparison-brand" },
      { x: 828, y: 474, w: 310, h: 440, variant: "editorial-no-sugar" },
      { x: 344, y: 638, w: 460, h: 260, variant: "water-wow" },
      { x: 1162, y: 658, w: 420, h: 250, variant: "banner-16x9" },
      { x: 1606, y: 484, w: 294, h: 430, variant: "zesty-citrus" },
    ];

    return (
      <AbsoluteFill style={{ backgroundColor: "#0C0607", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: -40,
            transform: `translate3d(${wallPanX}px, 0, 0) scale(${wallZoom})`,
            transformOrigin: "50% 50%",
          }}
        >
          {tiles.map((t, i) => {
            const tilePop = (i + beatPulse) % 5 === 0 ? 1.03 : 1;
            const sp = spring({
              frame: Math.max(0, pFrame - (i % 4) * 2),
              fps,
              config: SPRING_EDITORIAL,
              durationInFrames: 18,
            });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: t.x + 40,
                  top: t.y + 80,
                  transform: `scale(${(0.92 + sp * 0.08) * tilePop})`,
                }}
              >
                <CommercialAdCard
                  variant={t.variant}
                  brand={productBrand}
                  width={t.w}
                  height={t.h}
                  activeBorder={(i + beatPulse) % 5 === 0}
                />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    );
  }

  // ---- ACT E: FAST <=0.85s BRAND LOCKUP + CALM 2.65s URL CTA HOLD (345..450f) ----
  const eFrame = frame - 345; // 0..105 (3.5s total)
  const markSp = spring({
    frame: eFrame,
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: 16,
  });
  const wordOpen = interpolate(eFrame, [6, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const ctaSp = spring({
    frame: Math.max(0, eFrame - 16),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: 18,
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      <CrimsonEmberBackdrop frame={frame} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 34,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `scale(${0.7 + markSp * 0.3})` }}>
            <HeraPetalMark size={74} color="#FFFFFF" />
          </div>
          <div
            style={{
              width: wordOpen * 255,
              marginLeft: wordOpen * 22,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: 92,
                fontWeight: 750,
                letterSpacing: "-0.045em",
                color: "#FFFFFF",
              }}
            >
              {brandWordmark}
            </span>
          </div>
        </div>

        {/* Crisp CTA Pill + Rock-Solid URL Hold (2.65s calm reading time) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            opacity: ctaSp,
            transform: `translateY(${(1 - ctaSp) * 20}px)`,
          }}
        >
          <div
            style={{
              padding: "16px 36px",
              borderRadius: 999,
              backgroundColor: "#FFFFFF",
              color: "#0C0607",
              fontSize: 26,
              fontWeight: 750,
              letterSpacing: "-0.02em",
              boxShadow: "0 18px 44px rgba(244, 63, 94, 0.28)",
            }}
          >
            {ctaButtonText} →
          </div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 26,
              fontWeight: 600,
              color: "rgba(255,255,255,0.82)",
              letterSpacing: "0.02em",
            }}
          >
            {ctaUrl}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
