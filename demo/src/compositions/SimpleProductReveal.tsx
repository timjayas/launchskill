import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BackgroundCanvas } from "../components/BackgroundCanvas";
import { EndCardCTA } from "../components/EndCardCTA";
import { KineticHeadline } from "../components/KineticHeadline";
import { FONT_MONO, FONT_SANS, SPRING_SMOOTH, getSceneEnvelope } from "../lib/motion";
import type { SimpleProductRevealProps } from "../lib/schema";

export const SimpleProductReveal: React.FC<SimpleProductRevealProps> = ({
  productName,
  monogram,
  launchTag,
  hookLines,
  valueProp,
  ctaUrl,
  theme,
  timingSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const overlap = Math.round(fps * 0.25);

  const hookDuration = Math.round(timingSeconds.hook * fps);
  const revealStart = hookDuration - overlap;
  const revealDuration = Math.round(timingSeconds.reveal * fps);

  const ctaStart = revealStart + revealDuration - overlap;
  const ctaDuration = Math.round(timingSeconds.cta * fps);

  const hookEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: 0,
    durationFrames: hookDuration,
    instantStart: true,
  });

  const revealEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: revealStart,
    durationFrames: revealDuration,
  });

  const ctaEnv = getSceneEnvelope({
    frame,
    fps,
    startFrame: ctaStart,
    durationFrames: ctaDuration,
    exitFrames: 1,
  });

  // Modulate the 3D emblem intensity so it takes center stage cleanly during Beat 2
  const emblemIntensity = interpolate(
    frame,
    [0, revealStart, revealStart + 18, ctaStart - 10, ctaStart + 16],
    [0.35, 0.4, 1.0, 1.0, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const brandReveal = spring({
    frame: Math.max(0, revealEnv.localFrame - 12),
    fps,
    config: SPRING_SMOOTH,
    durationInFrames: Math.round(fps * 0.7),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background, fontFamily: FONT_SANS }}>
      {/* Sculpted 3D Emblem orbits live in the center via R3F */}
      <BackgroundCanvas theme={theme} mode="emblem" focusIntensity={emblemIntensity} />

      {/* BEAT 1: Minimal Punchy Teaser Hook */}
      {hookEnv.visible && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "90px 120px",
            opacity: hookEnv.opacity,
            transform: `translateY(${hookEnv.translateY}px) scale(${hookEnv.scale})`,
          }}
        >
          <KineticHeadline
            badge={launchTag}
            lines={hookLines}
            localFrame={hookEnv.localFrame}
            fps={fps}
            theme={theme}
            fontSize={114}
          />
        </AbsoluteFill>
      )}

      {/* BEAT 2: 3D Sculpted Emblem Stage + Brand Lockup */}
      {revealEnv.visible && (
        <AbsoluteFill
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            padding: "92px 120px",
            opacity: revealEnv.opacity,
          }}
        >
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 26,
              fontWeight: 600,
              color: theme.accentSecondary,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              opacity: interpolate(brandReveal, [0, 1], [0, 1]),
            }}
          >
            INTRODUCING · {monogram}
          </div>

          {/* Center stays open for the 3D R3F sculpted plaque */}
          <div style={{ flex: 1 }} />

          <div
            style={{
              textAlign: "center",
              opacity: interpolate(brandReveal, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(brandReveal, [0, 1], [28, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: 88,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: theme.textPrimary,
                lineHeight: 1.05,
              }}
            >
              {productName}
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 36,
                color: theme.textMuted,
                maxWidth: 1100,
              }}
            >
              {valueProp}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* BEAT 3: Clean Closing CTA */}
      {ctaEnv.visible && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: ctaEnv.opacity,
            transform: `translateY(${ctaEnv.translateY}px) scale(${ctaEnv.scale})`,
          }}
        >
          <EndCardCTA
            productName={productName}
            headline={valueProp}
            buttonText="Join launch"
            url={ctaUrl}
            localFrame={ctaEnv.localFrame}
            fps={fps}
            theme={theme}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
