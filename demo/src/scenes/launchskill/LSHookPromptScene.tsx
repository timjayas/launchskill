import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  LS_THEME,
  LSCameraRig,
  LaunchSkillCyclorama,
  MaskedHeadline,
} from "../../components/LaunchSkillPrimitives";
import {
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  computeVelocityBlur,
  getCaretOpacity,
  getSpringForMass,
  sec,
} from "../../lib/studioMotion";

/**
 * Shot 1 (0.0s - 3.0s | f0 - f90 @ 30fps):
 *   - Frame-0 alive: opens at 2.15x macro zoom on a sleek Dark-Mode macOS command bar
 *     floating over warm archival paper (#F7F6F2), already mid-prompt.
 *   - The signature Vermilion Caret (#E5482E) strikes the final letters, triggers [↵ Run],
 *     and as camera snaps out (2.15x -> 1.0x in 260ms EASE_OUT_EXPO), the typing caret
 *     physically stretches downward into a cinema timeline playhead axis!
 *   - Copy restraint: "Prompt to cinema." (3 words).
 */
export const LSHookPromptScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fullPrompt = '"Launch video"';
  // Already 65% typed at frame 0 so Frame 0 is immediately readable & alive!
  const typedCount = Math.min(
    fullPrompt.length,
    Math.floor(
      interpolate(frame, [0, sec(0.75, fps)], [8, fullPrompt.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );
  const typedText = fullPrompt.slice(0, typedCount);
  const isTyping = frame < sec(0.78, fps);

  // Keycap press at 1.05s (f32)
  const submitFrame = sec(1.05, fps);
  const keyPressDown = spring({
    frame: Math.max(0, frame - submitFrame),
    fps,
    config: getSpringForMass("micro"),
  });
  const keyRelease = spring({
    frame: Math.max(0, frame - (submitFrame + sec(0.14, fps))),
    fps,
    config: getSpringForMass("micro"),
  });
  const enterPressed = Math.max(0, keyPressDown - keyRelease);

  // Camera pull-back: 2.12x macro -> 1.0x wide over 0.32s EASE_OUT_EXPO, then subtle living drift
  const pullStart = sec(1.12, fps);
  const pullEnd = sec(1.48, fps);
  const computeCamera = (f: number) => {
    const pullP = interpolate(f, [pullStart, pullEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    const macroDriftX = interpolate(f, [0, pullStart], [980, 1065], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const wideDriftZoom = interpolate(f, [pullEnd, sec(3.0, fps)], [1.0, 1.045], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const zoom = interpolate(pullP, [0, 1], [2.12, wideDriftZoom]);
    const focusX = interpolate(pullP, [0, 1], [macroDriftX, 960]);
    const focusY = interpolate(pullP, [0, 1], [590, 540]);
    return { zoom, focusX, focusY, pullP };
  };

  const cam = computeCamera(frame);
  const prevCam = computeCamera(Math.max(0, frame - 1));
  const { blurX, blurY } = computeVelocityBlur(
    cam.focusX * cam.zoom,
    cam.focusY * cam.zoom,
    prevCam.focusX * prevCam.zoom,
    prevCam.focusY * prevCam.zoom,
    fps,
    0.04,
    8
  );

  // Hero Motif: Vermilion Caret physically stretches into Cinema Playhead!
  const playheadMorph = interpolate(frame, [pullStart, sec(1.72, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const caretHeight = interpolate(playheadMorph, [0, 1], [34, 240]);
  const caretTopOffset = interpolate(playheadMorph, [0, 1], [0, -24]);
  const caretOpacity = playheadMorph > 0.05 ? 1 : getCaretOpacity(frame, isTyping, fps);

  // Subtle preview timeline ghost ticks blooming behind playhead as it stretches
  const railReveal = interpolate(frame, [sec(1.5, fps), sec(2.05, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Gentle anticipation expand right before handoff to Shot 2 (f82 -> f90)
  const handoffP = interpolate(frame, [sec(2.74, fps), sec(3.0, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const barWidth = interpolate(handoffP, [0, 1], [940, 1080]);
  const barHeight = interpolate(handoffP, [0, 1], [104, 152]);
  const barRadius = interpolate(handoffP, [0, 1], [22, 18]);
  const barTop = interpolate(handoffP, [0, 1], [538, 500]);
  const exitCopyOpacity = interpolate(handoffP, [0, 0.72], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitCopyShiftY = interpolate(handoffP, [0, 1], [0, -26]);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LaunchSkillCyclorama
        zoom={1 + (cam.zoom - 1) * 0.28}
        panX={(960 - cam.focusX) * 0.16}
        panY={(540 - cam.focusY) * 0.16}
      />

      <LSCameraRig
        focusX={cam.focusX}
        focusY={cam.focusY}
        zoom={cam.zoom}
        blurX={blurX}
        blurY={blurY}
      >
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Editorial Headline — rises cleanly above the bar on camera pull-back */}
          <div
            style={{
              position: "absolute",
              top: 248,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `translate3d(0, ${exitCopyShiftY}px, 0)`,
              opacity:
                interpolate(frame, [pullStart, sec(1.36, fps)], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }) * exitCopyOpacity,
            }}
          >
            <MaskedHeadline
              startFrame={sec(1.18, fps)}
              fontSize={96}
              words={[
                { text: "Prompt" },
                { text: "to", muted: true },
                { text: "cinema.", italic: true, accent: LS_THEME.vermilion },
              ]}
            />
          </div>

          {/* Hero Dark-Mode macOS Command Strip (Expands into Studio Deck in Shot 2) */}
          <div
            style={{
              position: "absolute",
              top: barTop,
              width: barWidth,
              height: barHeight,
              borderRadius: barRadius,
              backgroundColor: LS_THEME.deckSurface,
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: LS_THEME.shadowDeck,
              display: "flex",
              alignItems: "center",
              padding: "0 30px",
              boxSizing: "border-box",
            }}
          >
            {/* Top specular hairline */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 24,
                right: 24,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
              }}
            />

            {/* Authentic macOS traffic lights */}
            <div style={{ display: "flex", gap: 8, marginRight: 26, flexShrink: 0 }}>
              <span style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: "#FF5F56" }} />
              <span style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: "#FFBD2E" }} />
              <span style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: "#27C93F" }} />
            </div>

            {/* Monospace prompt command */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontFamily: FONT_MONO,
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: LS_THEME.inkOnDark,
                whiteSpace: "nowrap",
                position: "relative",
              }}
            >
              <span style={{ color: LS_THEME.vermilion, fontWeight: 700 }}>&gt;</span>
              <span style={{ color: "#A1A1AA" }}>/launchskill</span>
              <span style={{ color: "#FAF9F6", fontWeight: 600 }}>{typedText}</span>

              {/* HERO MOTIF: Vermilion Caret -> Stretches into Cinema Playhead! */}
              <div
                style={{
                  position: "relative",
                  width: 4,
                  height: 34,
                  marginLeft: 2,
                  opacity: caretOpacity,
                }}
              >
                {/* Playhead Diamond Crown emerges as caret stretches */}
                <svg
                  width={18}
                  height={12}
                  viewBox="0 0 18 12"
                  style={{
                    position: "absolute",
                    left: -7,
                    top: caretTopOffset - 10,
                    opacity: playheadMorph,
                    transform: `scale(${0.7 + playheadMorph * 0.3})`,
                  }}
                >
                  <path d="M1 0H17L9 11L1 0Z" fill={LS_THEME.vermilion} />
                </svg>

                {/* Vertical Caret / Playhead Stem */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: caretTopOffset,
                    width: 3.5,
                    height: caretHeight,
                    borderRadius: 2,
                    backgroundColor: LS_THEME.vermilion,
                    boxShadow: `0 0 18px ${LS_THEME.vermilionGlow}`,
                  }}
                />
              </div>
            </div>

            {/* Tactile [↵ Run] Keycap on Right */}
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 20px",
                borderRadius: 12,
                backgroundColor:
                  enterPressed > 0.2 ? LS_THEME.vermilion : "rgba(255,255,255,0.08)",
                border:
                  enterPressed > 0.2
                    ? `1px solid ${LS_THEME.vermilion}`
                    : "1px solid rgba(255,255,255,0.14)",
                color: "#FFFFFF",
                fontFamily: FONT_SANS,
                fontSize: 19,
                fontWeight: 650,
                letterSpacing: "-0.01em",
                transform: `scale(${1 - enterPressed * 0.08}) translateY(${enterPressed * 2}px)`,
              }}
            >
              <span>Run</span>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 17,
                  opacity: 0.88,
                }}
              >
                ↵
              </span>
            </div>
          </div>

          {/* Subtle Cinema Ruler Ticks materializing beneath the stretched Playhead */}
          <div
            style={{
              position: "absolute",
              top: 696,
              width: 940,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: railReveal * 0.78 * exitCopyOpacity,
              transform: `translateY(${(1 - railReveal) * 12}px)`,
              fontFamily: FONT_MONO,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: LS_THEME.inkMuted,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span>00:00:00</span>
            <span style={{ display: "flex", gap: 22, alignItems: "center" }}>
              {Array.from({ length: 19 }).map((_, idx) => (
                <span
                  key={idx}
                  style={{
                    width: 1.5,
                    height: idx % 4 === 0 ? 14 : 7,
                    backgroundColor:
                      idx === 12 ? LS_THEME.vermilion : "rgba(20,20,19,0.22)",
                  }}
                />
              ))}
            </span>
            <span>16:9 · 30P · X</span>
          </div>
        </AbsoluteFill>
      </LSCameraRig>
    </AbsoluteFill>
  );
};
