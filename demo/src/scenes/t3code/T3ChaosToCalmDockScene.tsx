import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AgentAppIcon,
  FONT_SANS,
  T3_THEME,
  T3DirectionalBlur,
  T3StudioCyclorama,
  type AgentBrandId,
} from "../../components/T3CodePrimitives";
import {
  EASE_IN_EXPO,
  EASE_OUT_EXPO,
  SPRING_POP,
  computeSecondarySettle,
  sec,
} from "../../lib/studioMotion";

export interface T3ChaosToCalmDockSceneProps {
  whisperMuted: string;
  whisperInk: string;
}

const DOCK_STRIP: AgentBrandId[] = [
  "terminal",
  "claude",
  "cursor",
  "codex",
  "opencode",
  "terminal",
  "claude",
  "codex",
  "t3",       // index 8 -> Hero magnetic lock dead-center!
  "opencode",
  "cursor",
  "claude",
];

/**
 * Beat 2 (Beats 4 -> 9 @ 132 BPM, 2.27s = 68f): Chaos -> Calm Tactile Glass Dock
 * - Zero idle park: rapid 0.88s icon whip -> magnetic T3 lock -> continuous forward drift (1.0 -> 1.05)
 *   accelerating directly into a velocity zoom-through revealing the real T3 Code desktop workspace!
 */
export const T3ChaosToCalmDockScene: React.FC<T3ChaosToCalmDockSceneProps> = ({
  whisperMuted,
  whisperInk,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enterP = interpolate(frame, [0, sec(0.22, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Gentle continuous approach drift so dock never feels parked
  const liveDrift = interpolate(frame, [sec(0.85, fps), durationInFrames], [1.0, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitLead = sec(0.22, fps);
  const exitP = interpolate(
    frame,
    [durationInFrames - exitLead, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    }
  );

  const stageScale = (0.86 + enterP * 0.14) * liveDrift * (1 + exitP * 0.28);
  const stageOpacity = Math.max(0.86, Math.min(1, enterP * 1.45)) * (1 - exitP * 0.4);
  const textSettle = computeSecondarySettle(frame + sec(0.08, fps), 0, fps, 0.045, 7);

  // Fast 0.88s horizontal icon whip settling onto T3 dead-center
  const slotPitch = 136;
  const heroIndex = 8;
  const startIndex = 1.6;

  const evalScrollX = (f: number) => {
    const p = interpolate(f, [0, sec(0.88, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    const currentIndex = interpolate(p, [0, 1], [startIndex, heroIndex]);
    return -currentIndex * slotPitch;
  };

  const scrollX = evalScrollX(frame);
  const prevScrollX = evalScrollX(Math.max(0, frame - 1));
  const vx = Math.abs(scrollX - prevScrollX) * (fps / 30);
  const railBlurX = vx < 1.5 ? 0 : Math.min(14, (vx - 1.5) * 0.21);

  const lockFrame = sec(0.82, fps);
  const lockPop = spring({
    frame: Math.max(0, frame - lockFrame),
    fps,
    config: SPRING_POP,
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      {/* Parallax Dot-Grid Coupling Horizontally With Icon Whip + Forward Zoom */}
      <T3StudioCyclorama
        panX={(scrollX + heroIndex * slotPitch) * 0.14}
        zoom={stageScale}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 50,
          transform: `scale(${stageScale})`,
          opacity: stageOpacity,
        }}
      >
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          letterSpacing: "-0.038em",
          lineHeight: 1.08,
          color: T3_THEME.inkMuted,
          opacity: Math.max(0.86, textSettle.opacity) * (1 - exitP * 0.8),
          transform: `translate3d(0, ${textSettle.translateY - exitP * 18}px, 0)`,
        }}
      >
        <span>{whisperMuted} </span>
        <span style={{ color: T3_THEME.ink }}>{whisperInk}</span>
      </div>

      {/* Symmetrical Frosted Glass Dock */}
      <div
        style={{
          position: "relative",
          width: 920,
          height: 174,
          borderRadius: 42,
          backgroundColor: T3_THEME.surfaceGlass,
          border: `1px solid ${T3_THEME.border}`,
          boxShadow: T3_THEME.shadowHero,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 124,
            height: 124,
            borderRadius: 30,
            backgroundColor: T3_THEME.surfaceSubtle,
            border: `1px solid ${T3_THEME.border}`,
            opacity: lockPop,
            transform: `scale(${0.88 + lockPop * 0.12})`,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, #000 18%, #000 82%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, #000 18%, #000 82%, transparent 100%)",
          }}
        >
          <T3DirectionalBlur blurX={railBlurX} blurY={0}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {DOCK_STRIP.map((brand, idx) => {
                const centerOffset = idx * slotPitch + scrollX;
                const dist = Math.abs(centerOffset);
                const isHero = idx === heroIndex;
                const proximity = Math.max(0, 1 - dist / 220);

                const iconScale = isHero
                  ? 0.92 + proximity * 0.24 + lockPop * 0.04
                  : 0.78 + proximity * 0.16;

                const iconOpacity = isHero
                  ? 1
                  : Math.max(0.28, 1 - dist / 460);

                return (
                  <div
                    key={`${brand}-${idx}`}
                    style={{
                      position: "absolute",
                      left: 460 + centerOffset - 46,
                      top: 87 - 46,
                      transform: `scale(${iconScale})`,
                      opacity: iconOpacity,
                      zIndex: isHero ? 10 : 2,
                    }}
                  >
                    <AgentAppIcon brand={brand} size={92} elevated={isHero || proximity > 0.4} />
                  </div>
                );
              })}
            </div>
          </T3DirectionalBlur>
        </div>
      </div>

      <div
        style={{
          height: 36,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: lockPop * (1 - exitP),
          transform: `translate3d(0, ${(1 - lockPop) * 8}px, 0)`,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: T3_THEME.codex }} />
        <span
          style={{
            fontSize: 21,
            fontWeight: 500,
            letterSpacing: "-0.015em",
            color: T3_THEME.inkSecondary,
          }}
        >
          Claude Code · Codex · OpenCode · Cursor
        </span>
      </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
