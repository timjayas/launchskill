import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ClaudeMark,
  CodexMark,
  GeminiMark,
  T3CodeMark,
  T3E_FONTS,
  T3E_THEME,
  T3MaskedWords,
  T3SpatialCamera,
  T3StudioCyclorama,
} from "../../components/T3CodeEditorPrimitives";
import {
  EASE_IN_EXPO,
  EASE_OUT_EXPO,
  SPRING_SNAPPY,
} from "../../lib/studioMotion";

// Shared exact loop coordinates — pixel-identical to the final frame of T3EFinaleLockupScene
export const LOOP_CARDS = [
  {
    id: "claude",
    label: "Claude",
    color: T3E_THEME.claude,
    pulseFrame: 2,
    inlineX: -186,
    startX: -248,
    startY: -20,
    startRot: -3.2,
    mergeTargetX: -120,
  },
  {
    id: "codex",
    label: "Codex",
    color: T3E_THEME.codex,
    pulseFrame: 9,
    inlineX: 0,
    startX: 0,
    startY: 16,
    startRot: 1.8,
    mergeTargetX: 0,
  },
  {
    id: "gemini",
    label: "Gemini",
    color: T3E_THEME.gemini,
    pulseFrame: 16,
    inlineX: 186,
    startX: 248,
    startY: -14,
    startRot: 3.4,
    mergeTargetX: 120,
  },
] as const;

export const T3EHookRailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ============================================================================
  // Beat 1 Choreography (99f = 3.30s @ 30fps, Option A Invisible Loop):
  // - f0:          All 3 obsidian cards already landed at 2.2x macro (pixel-exact
  //                match to final frame of T3EFinaleLockupScene!)
  // - f2, f9, f16: Staggered one-by-one tactile bounce pulse (Claude -> Codex -> Gemini)
  // - f16..f32:    Hold so viewer registers all 3 separate subscriptions
  // - f32..f44:    All 3 cards physically pull inward, straighten tilt & merge
  // - f44:         Lock into unified #0C0D10 T3Code Obsidian Rail (tactile recoil)
  // - f45..f63:    Camera pulls back 2.2x -> 1.0x revealing headline
  // - f74..f82:    Headline & caption exit cleanly (zero ghosted text on f98)
  // - f82..f99:    Rail glides up to y=168 & widens 940 -> 1540px into IDE header
  // ============================================================================
  const MERGE_START = 32;
  const MERGE_LOCK = 44;

  const converge = interpolate(frame, [MERGE_START, MERGE_LOCK], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const clampSpring = spring({
    frame: Math.max(0, frame - MERGE_LOCK),
    fps,
    config: SPRING_SNAPPY,
  });
  const isMerged = frame >= MERGE_LOCK;

  const recoil =
    frame >= MERGE_LOCK && frame <= MERGE_LOCK + 9
      ? 1 - Math.sin(((frame - MERGE_LOCK) / 9) * Math.PI) * 0.042
      : 1;

  const pullBack = interpolate(frame, [45, 63], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const copyExit = interpolate(frame, [74, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const dockToTop = interpolate(frame, [82, 99], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const zoom = 2.2 - pullBack * 1.2;
  const wx = width / 2;
  const wy = height / 2;

  const blurY =
    pullBack > 0.04 && pullBack < 0.94 ? Math.sin(pullBack * Math.PI) * 4.2 : 0;

  const baseRailW = 800 + pullBack * 140;
  const railW = baseRailW + dockToTop * (1540 - baseRailW);
  const railH = 100 - dockToTop * (100 - 76);
  const railYOffset = -dockToTop * (540 - 168);
  const railRadius = 18 - dockToTop * 2;

  const sheenX = interpolate(frame, [MERGE_LOCK, 88], [-480, 560], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headlineOpacity = (1 - copyExit) * (pullBack > 0.15 ? 1 : 0);

  // Start cyclorama pan from 0 at f0 so loop seam with Finale is 100% invisible
  const panX = frame > MERGE_START ? -(frame - MERGE_START) * 0.7 : 0;
  const panY = frame > MERGE_START ? -(frame - MERGE_START) * 0.3 : 0;

  return (
    <AbsoluteFill>
      <T3StudioCyclorama zoom={zoom} panX={panX} panY={panY} />

      <T3SpatialCamera wx={wx} wy={wy} zoom={zoom} blurY={blurY}>
        <AbsoluteFill style={{ position: "relative" }}>
          {/* Headline above Rail — exits cleanly by f82 (zero ghosting on f98) */}
          {copyExit < 0.99 && (
            <div
              style={{
                position: "absolute",
                left: 120,
                right: 120,
                top: 310,
                display: "flex",
                justifyContent: "center",
                opacity: headlineOpacity,
                transform: `translate3d(0, ${(copyExit * -24).toFixed(2)}px, 0)`,
                clipPath: `inset(0 0 ${(copyExit * 100).toFixed(1)}% 0)`,
              }}
            >
              <T3MaskedWords
                startFrame={49}
                fontSize={80}
                words={[
                  { text: "One" },
                  { text: "editor." },
                  { text: "Every", color: T3E_THEME.cobalt },
                  { text: "subscription." },
                ]}
              />
            </div>
          )}

          {/* PHASE A (f0..f43): 3 Landed Cards -> One-by-One Bounce Pulse -> Merge Into One */}
          {!isMerged && (
            <div
              style={{
                position: "absolute",
                left: width / 2,
                top: height / 2,
                width: 0,
                height: 0,
              }}
            >
              {LOOP_CARDS.map((card) => {
                // Crisp staggered bounce pulse (10-frame damped sine hop)
                const dt = frame - card.pulseFrame;
                const pulseEnv =
                  dt >= 0 && dt <= 11
                    ? Math.sin((dt / 11) * Math.PI) * Math.exp(-dt * 0.14)
                    : 0;

                const pulseScale = 1 + pulseEnv * 0.11;
                const pulseLiftY = -pulseEnv * 11;

                const cx = card.startX + (card.mergeTargetX - card.startX) * converge;
                const cy = card.startY * (1 - converge) + pulseLiftY;
                const rot = card.startRot * (1 - converge);
                const mergeScaleX = 1 + converge * 0.08;

                return (
                  <div
                    key={card.id}
                    style={{
                      position: "absolute",
                      width: 212,
                      height: 82,
                      left: cx - 106,
                      top: cy - 41,
                      borderRadius: 14,
                      backgroundColor: T3E_THEME.obsidian,
                      border: `1.5px solid ${card.color}`,
                      boxShadow: T3E_THEME.shadowRail,
                      transform: `scale(${(pulseScale * mergeScaleX).toFixed(4)}, ${pulseScale.toFixed(4)}) rotate(${rot.toFixed(2)}deg)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                    }}
                  >
                    {card.id === "claude" && <ClaudeMark size={28} />}
                    {card.id === "codex" && <CodexMark size={28} light />}
                    {card.id === "gemini" && <GeminiMark size={28} />}
                    <span
                      style={{
                        fontFamily: T3E_FONTS.sans,
                        fontWeight: 600,
                        fontSize: 24,
                        color: "#FFFFFF",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {card.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* PHASE B (f44..f99): Unified Obsidian Subscription Rail -> Unfolds into IDE Header */}
          {isMerged && (
            <div
              style={{
                position: "absolute",
                left: (width - railW) / 2,
                top: height / 2 - railH / 2 + railYOffset,
                width: railW,
                height: railH,
                borderRadius: railRadius,
                borderBottomLeftRadius: dockToTop > 0.7 ? 0 : railRadius,
                borderBottomRightRadius: dockToTop > 0.7 ? 0 : railRadius,
                backgroundColor: T3E_THEME.obsidian,
                border: `1px solid ${T3E_THEME.editorBorder}`,
                boxShadow: T3E_THEME.shadowRail,
                transform: `scale(${recoil.toFixed(4)})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: dockToTop > 0.5 ? "0 26px" : "0 20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  bottom: -40,
                  width: 220,
                  left: "50%",
                  transform: `translate3d(${sheenX}px, 0, 0) rotate(22deg)`,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.085) 50%, rgba(255,255,255,0) 100%)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  position: "relative",
                  zIndex: 2,
                  opacity: Math.min(1, clampSpring * 1.4),
                  transform: `translate3d(${((1 - clampSpring) * -18).toFixed(1)}px, 0, 0)`,
                }}
              >
                <T3CodeMark size={Math.round(46 - dockToTop * 16)} darkSurface />
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontFamily: T3E_FONTS.display,
                      fontWeight: 700,
                      fontSize: Math.round(32 - dockToTop * 10),
                      letterSpacing: "-0.03em",
                      color: T3E_THEME.inkOnDark,
                    }}
                  >
                    T3Code
                  </span>
                  {dockToTop < 0.5 && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 4,
                        height: 30,
                        borderRadius: 2,
                        backgroundColor: T3E_THEME.cobaltBright,
                      }}
                    />
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {LOOP_CARDS.map((prov, idx) => {
                  const isHighlighted = idx === 0;
                  return (
                    <div
                      key={prov.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: dockToTop > 0.5 ? "8px 16px" : "10px 14px",
                        borderRadius: 10,
                        backgroundColor: isHighlighted
                          ? "rgba(255, 255, 255, 0.12)"
                          : "rgba(255, 255, 255, 0.04)",
                        border: isHighlighted
                          ? `1.5px solid ${prov.color}`
                          : "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      {prov.id === "claude" && <ClaudeMark size={22} />}
                      {prov.id === "codex" && <CodexMark size={22} light />}
                      {prov.id === "gemini" && <GeminiMark size={22} />}
                      <span
                        style={{
                          fontFamily: T3E_FONTS.sans,
                          fontWeight: 600,
                          fontSize: Math.round(21 - dockToTop * 3),
                          color: isHighlighted ? "#FFFFFF" : T3E_THEME.inkMutedOnDark,
                        }}
                      >
                        {prov.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom sub-caption — exits cleanly by f82 (zero ghosting on f98) */}
          {copyExit < 0.99 && (
            <div
              style={{
                position: "absolute",
                left: 120,
                right: 120,
                top: 632,
                textAlign: "center",
                opacity: Math.max(0, pullBack * (1 - copyExit)),
                transform: `translate3d(0, ${((1 - pullBack) * 14 + copyExit * 16).toFixed(1)}px, 0)`,
                fontFamily: T3E_FONTS.mono,
                fontWeight: 500,
                fontSize: 24,
                color: T3E_THEME.inkMuted,
                letterSpacing: "-0.01em",
              }}
            >
              Bring your Claude, Codex &amp; Gemini plans.
            </div>
          )}
        </AbsoluteFill>
      </T3SpatialCamera>
    </AbsoluteFill>
  );
};
