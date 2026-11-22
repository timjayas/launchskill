/**
 * Archetype 4 (Hera Canvas) — Scene 1: MultiArtboardAdGridScene (330f / 11.0s @ 30fps)
 * -----------------------------------------------------------------------------------
 * 000–024f: Frame-0 alive crimson-ember emblem bloom -> inline wordmark slide
 * 024–066f: Kinetic ad hook ("Create hundreds of on-brand ads") + 3D Z-depth ad cloud
 * 066–096f: Dark crimson interstitial ("Run multiple AI agents on one canvas")
 * 096–154f: Light #F6F6F5 dot-grid canvas with 3 stacked parallel prompts typing live
 * 154–330f: Freeform multi-aspect artboard choreography (4:5, 16:9, 9:16, 1:1) driven by
 *           3 dark-pill AI agent cursors + localized pink radial dot-grid ripples (zero wires)
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AgentRolePillCursor,
  CanvasPromptCard,
  CanvasSpawnRipple,
  CommercialAdCard,
  CrimsonEmberBackdrop,
  CrimsonInterstitialText,
  DotGridCanvasBackdrop,
  HeraPetalMark,
} from "../components/HeraAdPrimitives";
import {
  computeCameraTransform,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_SANS,
  getCaretOpacity,
  getNaturalTypedLength,
  SPRING_EDITORIAL,
  SPRING_SNAPPY,
} from "../lib/motion";

export interface MultiArtboardAdGridProps {
  brandWordmark?: string;
  productBrand?: string;
  accentColor?: string;
  hookLead?: string;
  hookScaleWord?: string;
  hookTail?: string;
  prompt1?: string;
  prompt2?: string;
  prompt3?: string;
  agentLabels?: [string, string, string];
}

export const MultiArtboardAdGridScene: React.FC<MultiArtboardAdGridProps> = ({
  brandWordmark = "Hera",
  productBrand = "Daily",
  accentColor = "#E11D48",
  hookLead = "Create",
  hookScaleWord = "hundreds",
  hookTail = "of on-brand ads in minutes",
  prompt1 = "Use our brand font in the title and remove the stars",
  prompt2 = "Create 1:1 and 9:16 format for this ad",
  prompt3 = "Make this ad editable",
  agentLabels = ["Brand font", "Social formats", "Editable ad"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- ACT 1: DARK CRIMSON-EMBER HOOK (0..96f) ----
  if (frame < 96) {
    // Sub-phase 1A: 0..26f Frame-0 alive mark bloom -> slide left + wordmark reveal
    const markScale = spring({
      frame: frame + 6, // frame-0 already >= 0.45 alive!
      fps,
      config: SPRING_EDITORIAL,
      durationInFrames: 18,
    });
    const wordReveal = interpolate(frame, [6, 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });

    // Sub-phase 1B: 26..66f Kinetic Hook + 3D Z-Depth Ad Cloud
    const cloudLocal = Math.max(0, frame - 26);
    const cloudAds: Array<{
      x: number;
      y: number;
      zStart: number;
      w: number;
      h: number;
      variant: "glow-hero" | "banner-16x9" | "story-9x16" | "editorial-no-sugar" | "zesty-citrus" | "berry-glass" | "water-wow";
    }> = [
      { x: 240, y: 180, zStart: 0.42, w: 230, h: 300, variant: "glow-hero" },
      { x: 1460, y: 150, zStart: 0.48, w: 300, h: 170, variant: "water-wow" },
      { x: 180, y: 690, zStart: 0.36, w: 220, h: 270, variant: "zesty-citrus" },
      { x: 1500, y: 660, zStart: 0.44, w: 240, h: 300, variant: "berry-glass" },
      { x: 520, y: 740, zStart: 0.32, w: 230, h: 260, variant: "editorial-no-sugar" },
      { x: 1180, y: 120, zStart: 0.38, w: 220, h: 280, variant: "story-9x16" },
      { x: 960, y: 810, zStart: 0.5, w: 340, h: 190, variant: "banner-16x9" },
    ];

    return (
      <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
        <CrimsonEmberBackdrop frame={frame} />

        {frame < 26 && (
          <AbsoluteFill
            style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ transform: `scale(${0.75 + markScale * 0.25})` }}>
                <HeraPetalMark size={64} color="#FFFFFF" />
              </div>
              <div
                style={{
                  width: wordReveal * 230,
                  marginLeft: wordReveal * 18,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    fontSize: 78,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: "#FFFFFF",
                  }}
                >
                  {brandWordmark}
                </span>
              </div>
            </div>
          </AbsoluteFill>
        )}

        {frame >= 26 && frame < 66 && (
          <AbsoluteFill>
            {/* 3D Z-Depth rushing ad cloud */}
            {cloudAds.map((ad, idx) => {
              const p = interpolate(cloudLocal, [0, 38], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE_OUT_EXPO,
              });
              const zScale = ad.zStart + p * (0.72 + (idx % 3) * 0.16);
              const driftX = (ad.x - 960) * (1 + p * 0.32) + 960;
              const driftY = (ad.y - 540) * (1 + p * 0.28) + 540;
              const blurPx = interpolate(p, [0, 0.35, 0.85, 1], [6, 1.5, 0, 2]);
              const op = interpolate(cloudLocal, [0, 7, 34, 40], [0, 0.92, 0.92, 0.25], {
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: driftX - ad.w / 2,
                    top: driftY - ad.h / 2,
                    transform: `scale(${zScale})`,
                    opacity: op,
                    filter: blurPx > 0.4 ? `blur(${blurPx.toFixed(1)}px)` : undefined,
                  }}
                >
                  <CommercialAdCard
                    variant={ad.variant}
                    brand={productBrand}
                    width={ad.w}
                    height={ad.h}
                  />
                </div>
              );
            })}

            {/* Center Kinetic Ad Hook */}
            <AbsoluteFill
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: "0 140px",
              }}
            >
              {frame < 36 && (
                <CrimsonInterstitialText
                  prefix=""
                  highlight={hookLead}
                  frame={frame}
                  fps={fps}
                  startFrame={26}
                  fontSize={106}
                />
              )}
              {frame >= 36 && frame < 50 && (
                <div
                  style={{
                    fontSize: 168,
                    fontWeight: 800,
                    letterSpacing: "-0.055em",
                    color: "#FFFFFF",
                    textShadow: "0 18px 54px rgba(0,0,0,0.6)",
                    transform: `scale(${interpolate(frame, [36, 48], [1.12, 0.98], {
                      extrapolateRight: "clamp",
                      easing: EASE_OUT_EXPO,
                    })})`,
                  }}
                >
                  {hookScaleWord}
                </div>
              )}
              {frame >= 50 && (
                <div
                  style={{
                    padding: "18px 34px",
                    borderRadius: 24,
                    backgroundColor: "rgba(12, 6, 7, 0.72)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <CrimsonInterstitialText
                    prefix=""
                    highlight={hookTail}
                    frame={frame}
                    fps={fps}
                    startFrame={50}
                    fontSize={72}
                  />
                </div>
              )}
            </AbsoluteFill>
          </AbsoluteFill>
        )}

        {frame >= 66 && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 140px" }}>
            {frame < 81 ? (
              <CrimsonInterstitialText
                prefix="Run "
                highlight="multiple AI agents"
                frame={frame}
                fps={fps}
                startFrame={66}
                fontSize={88}
              />
            ) : (
              <CrimsonInterstitialText
                prefix="on one "
                highlight="canvas"
                frame={frame}
                fps={fps}
                startFrame={81}
                fontSize={92}
              />
            )}
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    );
  }

  // ---- ACT 2: LIGHT #F6F6F5 DOT-GRID FREEFORM MULTI-ARTBOARD CANVAS (96..330f) ----
  const cFrame = frame - 96; // 0..234

  // Phase 2A: Stacked triple prompts typing (0..58cFrame)
  const stackZoomOut = interpolate(cFrame, [52, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const stackOpacity = interpolate(cFrame, [60, 74], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const p1Len = getNaturalTypedLength(prompt1, cFrame, 4, 44, fps);
  const p2Len = getNaturalTypedLength(prompt2, cFrame, 10, 42, fps);
  const p3Len = getNaturalTypedLength(prompt3, cFrame, 18, 38, fps);
  const submitted = cFrame >= 46;

  // Phase 2B: Camera gently breathes across the freeform dot-grid artboard panorama
  const camZoom = interpolate(cFrame, [56, 86, 175, 234], [1.14, 1.0, 0.96, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const camX = interpolate(cFrame, [66, 150, 234], [960, 980, 960], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cam = computeCameraTransform(camX, 540, camZoom);

  // Staggered mixed-aspect artboards spawned by the 3 parallel agents
  const artboards: Array<{
    id: string;
    spawnAt: number;
    x: number;
    y: number;
    w: number;
    h: number;
    ratioTag: string;
    variant: "glow-hero" | "banner-16x9" | "story-9x16" | "editorial-no-sugar" | "berry-glass";
  }> = [
    {
      id: "glow-orig",
      spawnAt: 64,
      x: 110,
      y: 92,
      w: 256,
      h: 416,
      ratioTag: "4:5 · Source",
      variant: "glow-hero",
    },
    {
      id: "glow-rebrand",
      spawnAt: 78,
      x: 404,
      y: 72,
      w: 266,
      h: 432,
      ratioTag: "4:5 · Brand Font",
      variant: "berry-glass",
    },
    {
      id: "banner-16x9",
      spawnAt: 92,
      x: 840,
      y: 258,
      w: 500,
      h: 280,
      ratioTag: "16:9 · Banner",
      variant: "banner-16x9",
    },
    {
      id: "story-9x16",
      spawnAt: 112,
      x: 1418,
      y: 96,
      w: 268,
      h: 472,
      ratioTag: "9:16 · Story",
      variant: "story-9x16",
    },
    {
      id: "editable-4x5",
      spawnAt: 102,
      x: 248,
      y: 590,
      w: 300,
      h: 374,
      ratioTag: "4:5 · Editable",
      variant: "editorial-no-sugar",
    },
    {
      id: "square-1x1",
      spawnAt: 134,
      x: 1372,
      y: 622,
      w: 314,
      h: 314,
      ratioTag: "1:1 · Feed",
      variant: "editorial-no-sugar",
    },
  ];

  // 3 parallel dark-pill AI agent cursors gliding smoothly across their assigned zones
  const cursorEnter = interpolate(cFrame, [66, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const c1x = interpolate(cFrame, [66, 98, 175, 234], [820, 610, 635, 622], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const c1y = interpolate(cFrame, [66, 98, 175, 234], [240, 440, 452, 438], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  const c2x = interpolate(cFrame, [66, 114, 152, 234], [980, 1345, 1665, 1682], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const c2y = interpolate(cFrame, [66, 114, 152, 234], [480, 460, 868, 886], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  const c3x = interpolate(cFrame, [66, 118, 185, 234], [870, 520, 540, 528], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const c3y = interpolate(cFrame, [66, 118, 185, 234], [760, 888, 868, 878], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#F6F6F5" }}>
      <DotGridCanvasBackdrop panX={-cFrame * 0.25} panY={-cFrame * 0.12} />

      {/* Camera-transformed infinite freeform canvas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate3d(${cam.x}px, ${cam.y}px, 0) scale(${cam.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Localized Pink Radial Dot-Grid Spawn Ripples */}
        {artboards.map((ab) => {
          const rip = interpolate(cFrame, [ab.spawnAt - 6, ab.spawnAt + 34], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <CanvasSpawnRipple
              key={`rip-${ab.id}`}
              x={ab.x + ab.w / 2}
              y={ab.y + ab.h / 2}
              progress={rip}
              color="#EC4899"
              maxRadius={Math.max(ab.w, ab.h) * 0.78}
            />
          );
        })}

        {/* Multi-Aspect-Ratio Commercial Ad Artboards */}
        {artboards.map((ab) => {
          if (cFrame < ab.spawnAt - 2) return null;
          const sp = spring({
            frame: Math.max(0, cFrame - ab.spawnAt),
            fps,
            config: SPRING_EDITORIAL,
            durationInFrames: 24,
          });
          const op = interpolate(cFrame, [ab.spawnAt, ab.spawnAt + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={ab.id}
              style={{
                position: "absolute",
                left: ab.x,
                top: ab.y,
                opacity: op,
                transform: `scale(${0.82 + sp * 0.18}) translateY(${(1 - sp) * 28}px)`,
              }}
            >
              <div
                style={{
                  marginBottom: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.92)",
                  border: "1px solid #E4E4E7",
                  fontFamily: FONT_SANS,
                  fontSize: 13,
                  fontWeight: 650,
                  color: "#52525B",
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: 99, backgroundColor: accentColor }} />
                {ab.ratioTag}
              </div>
              <CommercialAdCard
                variant={ab.variant}
                brand={productBrand}
                width={ab.w}
                height={ab.h}
                activeBorder={cFrame - ab.spawnAt < 26}
              />
            </div>
          );
        })}

        {/* 3 Stacked Parallel Prompt Cards (Collapse smoothly into canvas fan-out) */}
        {stackOpacity > 0.01 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 28,
              opacity: stackOpacity,
              transform: `scale(${1 - stackZoomOut * 0.28})`,
            }}
          >
            {[
              {
                att: "daily-glow-v11.jpg",
                txt: prompt1.slice(0, p1Len),
                caret: p1Len < prompt1.length,
                delay: 0,
              },
              {
                att: "daily-moment-v6.jpg",
                txt: prompt2.slice(0, p2Len),
                caret: p2Len < prompt2.length,
                delay: 4,
              },
              {
                att: "daily-hero-v11.jpg",
                txt: prompt3.slice(0, p3Len),
                caret: p3Len < prompt3.length,
                delay: 8,
              },
            ].map((item, idx) => {
              const cardSp = spring({
                frame: Math.max(0, cFrame - item.delay),
                fps,
                config: SPRING_SNAPPY,
                durationInFrames: 18,
              });
              return (
                <div
                  key={idx}
                  style={{
                    transform: `translateY(${(1 - cardSp) * 32}px) scale(${0.95 + cardSp * 0.05})`,
                    opacity: interpolate(cFrame - item.delay, [0, 6], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  <CanvasPromptCard
                    modeLabel="Image"
                    attachmentName={item.att}
                    promptText={item.txt}
                    showCaret={item.caret && getCaretOpacity(cFrame, true, fps) > 0.5}
                    submitted={submitted}
                    width={720}
                    accentColor={accentColor}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* 3 Parallel Dark-Pill AI Agent Cursors */}
        {cursorEnter > 0.01 && (
          <>
            <AgentRolePillCursor
              x={c1x}
              y={c1y}
              label={agentLabels[0]}
              opacity={cursorEnter}
              scale={0.85 + cursorEnter * 0.15}
            />
            <AgentRolePillCursor
              x={c2x}
              y={c2y}
              label={agentLabels[1]}
              opacity={cursorEnter}
              scale={0.85 + cursorEnter * 0.15}
            />
            <AgentRolePillCursor
              x={c3x}
              y={c3y}
              label={agentLabels[2]}
              opacity={cursorEnter}
              scale={0.85 + cursorEnter * 0.15}
            />
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
