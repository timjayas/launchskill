import React, { useId } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ClaudeMark,
  CodexMark,
  GeminiMark,
  T3CodeMark,
  T3E_FONTS,
  T3E_THEME,
  T3SpatialCamera,
  T3StudioCyclorama,
} from "../../components/T3CodeEditorPrimitives";
import { EASE_IN_EXPO, EASE_OUT_EXPO } from "../../lib/studioMotion";

// Starts on Gemini to match Beat 2's 4.5x portal zoom out of the Gemini pill,
// then accelerates cleanly: 0.55s -> 0.42s -> 0.34s into "+ more"
const SLOTS = [
  { id: "gemini", label: "Gemini", accent: T3E_THEME.gemini },
  { id: "claude", label: "Claude", accent: T3E_THEME.claude },
  { id: "codex", label: "Codex", accent: T3E_THEME.codex },
  { id: "more", label: "+ more", accent: T3E_THEME.cobaltBright },
] as const;

// Exact inline coordinates so the 340x92 slot pill center is locked at (858, 540)
const PILL_W = 340;
const PILL_H = 92;
const PILL_CENTER_X = 858;
const PILL_CENTER_Y = 540;

export const T3ESubscriptionSwapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const blurFilterId = useId().replace(/:/g, "");

  // Portal Catch-and-Settle (f0 -> f12)
  const portalSettle = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Living gentle drift during slot-swap (f12 -> f74)
  const drift = interpolate(frame, [12, 74], [0, 0.025], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Upgrade 1 (Scene 3 -> Scene 4): Pill-to-Stage Obsidian Expansion (f75 -> f89)
  // The "+ more" obsidian pill physically expands to fill the entire 1920x1080 viewport,
  // seamlessly becoming Scene 4's #0C0D10 obsidian stage with zero pop-out!
  const expandToStage = interpolate(frame, [75, 89], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const copyExit = interpolate(frame, [73, 81], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const pillContentFade = interpolate(frame, [75, 82], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const zoom = (2.17 - portalSettle * 1.17 + drift) * (1 - expandToStage) + 1.0 * expandToStage;
  const wx = PILL_CENTER_X + portalSettle * (width / 2 - PILL_CENTER_X);
  const wy = PILL_CENTER_Y + portalSettle * (height / 2 - PILL_CENTER_Y);

  const copyReveal = interpolate(frame, [4, 13], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const swapFrames = [0, 29, 42, 53];
  let slotIdx = 0;
  for (let i = swapFrames.length - 1; i >= 0; i--) {
    if (frame >= swapFrames[i]) {
      slotIdx = i;
      break;
    }
  }

  const slotLocalFrame = frame - swapFrames[slotIdx];
  const slotProgress =
    slotIdx === 0
      ? 1
      : spring({
          frame: slotLocalFrame,
          fps,
          config: { damping: 28, stiffness: 360, mass: 0.65 },
        });

  const activeSlot = SLOTS[slotIdx];
  const prevSlot = slotIdx > 0 ? SLOTS[slotIdx - 1] : null;

  const slotBlurY =
    slotIdx > 0 && slotLocalFrame >= 0 && slotLocalFrame <= 3
      ? [6.5, 5.0, 2.8, 1.1][slotLocalFrame]
      : 0;

  const inY = (1 - slotProgress) * 64;
  const outY = -slotProgress * 64;

  const sheenX = interpolate(frame, [10, 74], [-240, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Expanding pill geometry: (688, 494, 340x92, r=20) -> (0, 0, 1920x1080, r=0)
  const pillLeft = (PILL_CENTER_X - PILL_W / 2) * (1 - expandToStage);
  const pillTop = (PILL_CENTER_Y - PILL_H / 2) * (1 - expandToStage);
  const pillWidth = PILL_W + (width - PILL_W) * expandToStage;
  const pillHeight = PILL_H + (height - PILL_H) * expandToStage;
  const pillRadius = 20 * (1 - expandToStage);

  const renderSlotContent = (slot: (typeof SLOTS)[number]) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 15,
        height: "100%",
        width: "100%",
      }}
    >
      {slot.id === "claude" && <ClaudeMark size={38} />}
      {slot.id === "codex" && <CodexMark size={38} light />}
      {slot.id === "gemini" && <GeminiMark size={38} />}
      {slot.id === "more" && <T3CodeMark size={38} darkSurface />}
      <span
        style={{
          fontFamily: T3E_FONTS.display,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: "-0.03em",
          color: "#FFFFFF",
        }}
      >
        {slot.label}
      </span>
    </div>
  );

  return (
    <AbsoluteFill>
      <T3StudioCyclorama zoom={Math.min(1.6, zoom)} panX={-frame * 0.7} panY={frame * 0.25} />

      {slotBlurY > 0.2 && (
        <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
          <defs>
            <filter id={blurFilterId} x="-15%" y="-30%" width="130%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={`0 ${slotBlurY.toFixed(2)}`} />
            </filter>
          </defs>
        </svg>
      )}

      <T3SpatialCamera wx={wx} wy={wy} zoom={zoom}>
        <AbsoluteFill style={{ position: "relative" }}>
          {/* Line 1: Editorial Lead */}
          {copyExit < 0.99 && (
            <div
              style={{
                position: "absolute",
                left: 120,
                right: 120,
                top: 378,
                textAlign: "center",
                fontFamily: T3E_FONTS.display,
                fontWeight: 700,
                fontSize: 80,
                letterSpacing: "-0.04em",
                lineHeight: 1.06,
                color: T3E_THEME.inkMuted,
                opacity: copyReveal * (1 - copyExit),
                transform: `translate3d(0, ${((1 - copyReveal) * 18 - copyExit * 34).toFixed(1)}px, 0)`,
              }}
            >
              Code with your
            </div>
          )}

          {/* "plan." text to the right of the pill */}
          {copyExit < 0.99 && (
            <span
              style={{
                position: "absolute",
                left: PILL_CENTER_X + PILL_W / 2 + 24,
                top: PILL_CENTER_Y - 42,
                fontFamily: T3E_FONTS.display,
                fontWeight: 700,
                fontSize: 80,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: T3E_THEME.ink,
                opacity: copyReveal * (1 - copyExit),
                transform: `translate3d(${((1 - copyReveal) * -16 + copyExit * 42).toFixed(1)}px, 0, 0)`,
              }}
            >
              plan.
            </span>
          )}

          {/* Crisp 4-word sub-caption */}
          {copyExit < 0.99 && (
            <div
              style={{
                position: "absolute",
                left: 120,
                right: 120,
                top: 630,
                textAlign: "center",
                opacity: copyReveal * (1 - copyExit),
                transform: `translate3d(0, ${((1 - copyReveal) * 14 + copyExit * 28).toFixed(1)}px, 0)`,
                fontFamily: T3E_FONTS.mono,
                fontWeight: 500,
                fontSize: 28,
                color: T3E_THEME.inkSecondary,
                letterSpacing: "-0.015em",
              }}
            >
              Zero extra API markups.
            </div>
          )}

          {/* Locked-Width Obsidian Slot Pill -> Expands Seamlessly into Scene 4 Obsidian Stage */}
          <div
            style={{
              position: "absolute",
              left: pillLeft,
              top: pillTop,
              width: pillWidth,
              height: pillHeight,
              borderRadius: pillRadius,
              backgroundColor: T3E_THEME.obsidian,
              border: expandToStage < 0.85 ? `2px solid ${activeSlot.accent}` : "none",
              boxShadow: expandToStage < 0.85 ? T3E_THEME.shadowRail : "none",
              overflow: "hidden",
              zIndex: 10,
            }}
          >
            {/* Specular Sheen */}
            {pillContentFade > 0.02 && (
              <div
                style={{
                  position: "absolute",
                  top: -30,
                  bottom: -30,
                  width: 130,
                  left: "50%",
                  opacity: pillContentFade,
                  transform: `translate3d(${sheenX}px, 0, 0) rotate(22deg)`,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.11) 50%, rgba(255,255,255,0) 100%)",
                  pointerEvents: "none",
                  zIndex: 5,
                }}
              />
            )}

            {/* Moving Slot Content */}
            {pillContentFade > 0.01 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: pillContentFade,
                  filter: slotBlurY > 0.2 ? `url(#${blurFilterId})` : "none",
                }}
              >
                {prevSlot && slotProgress < 0.99 && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      transform: `translate3d(0, ${outY.toFixed(2)}px, 0)`,
                      opacity: Math.max(0, 1 - slotProgress * 1.45),
                    }}
                  >
                    {renderSlotContent(prevSlot)}
                  </div>
                )}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `translate3d(0, ${inY.toFixed(2)}px, 0)`,
                    opacity: Math.min(1, slotProgress * 1.3),
                  }}
                >
                  {renderSlotContent(activeSlot)}
                </div>
              </div>
            )}
          </div>
        </AbsoluteFill>
      </T3SpatialCamera>
    </AbsoluteFill>
  );
};
