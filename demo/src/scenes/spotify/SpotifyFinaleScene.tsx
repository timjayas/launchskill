import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  SPOTIFY_STUDIO_THEME,
  SpotifyBackdrop,
  SpotifyMark,
} from "../../components/SpotifyStudioPrimitives";
import {
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  SPRING_EDITORIAL,
  computeSecondarySettle,
  sec,
} from "../../lib/studioMotion";

export interface SpotifyFinaleSceneProps {
  brandName: string;
  ctaTaglinePrefix: string;
  ctaTaglineSerif: string;
  ctaButtonText: string;
  ctaUrl: string;
  accentColor: string;
}

/**
 * Shot 6 (Beats 46 -> 52, 3.0s): Pure Museum-White Spotify Brand Lockup + Calm CTA Hold
 * - Pure flat #FFFFFF gallery canvas — zero blur circles, zero glow halos.
 * - Mark -> Wordmark reflow finishes within <= 0.70s.
 * - Holds rock-solid at 0px drift and 0px blur for > 2.2s for seamless X auto-replays.
 */
export const SpotifyFinaleScene: React.FC<SpotifyFinaleSceneProps> = ({
  brandName,
  ctaTaglinePrefix,
  ctaTaglineSerif,
  ctaButtonText,
  ctaUrl,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inTail = sec(0.36, fps);
  const enterP = interpolate(frame, [0, inTail], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const lockupScale = 0.88 + enterP * 0.12;

  const wordmarkReveal = spring({
    frame: Math.max(0, frame - sec(0.14, fps)),
    fps,
    config: SPRING_EDITORIAL,
  });

  const taglineSettle = computeSecondarySettle(frame, sec(0.24, fps), fps, 0.08, 10);
  const ctaSettle = computeSecondarySettle(frame, sec(0.38, fps), fps, 0.08, 12);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SpotifyBackdrop mode="white" showDotGrid={false} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "96px 128px",
          transform: `scale(${lockupScale})`,
        }}
      >
        {/* Centered Mark + Reflowed Wordmark Lockup */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: interpolate(wordmarkReveal, [0, 1], [0, 28]),
          }}
        >
          <SpotifyMark size={108} circleColor={accentColor} waveColor="#FFFFFF" />

          <div
            style={{
              overflow: "hidden",
              maxWidth: interpolate(wordmarkReveal, [0, 1], [0, 440]),
              opacity: Math.min(1, wordmarkReveal * 1.4),
            }}
          >
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: 108,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 1.0,
                color: SPOTIFY_STUDIO_THEME.ink,
                whiteSpace: "nowrap",
                display: "block",
              }}
            >
              {brandName}
            </span>
          </div>
        </div>

        {/* Two-Tone Editorial Positioning Line */}
        <div
          style={{
            marginTop: 34,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 14,
            transform: `translateY(${taglineSettle.translateY}px)`,
            opacity: taglineSettle.opacity,
          }}
        >
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: 44,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              color: SPOTIFY_STUDIO_THEME.inkMuted,
            }}
          >
            {ctaTaglinePrefix}
          </span>
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 52,
              letterSpacing: "-0.01em",
              color: SPOTIFY_STUDIO_THEME.ink,
            }}
          >
            {ctaTaglineSerif}
          </span>
        </div>

        {/* High-Contrast CTA Pill + Crisp Mono URL Hold */}
        <div
          style={{
            marginTop: 48,
            display: "inline-flex",
            alignItems: "center",
            gap: 18,
            transform: `translateY(${ctaSettle.translateY}px)`,
            opacity: ctaSettle.opacity,
          }}
        >
          <div
            style={{
              padding: "18px 40px",
              borderRadius: 999,
              backgroundColor: accentColor,
              color: "#FFFFFF",
              fontFamily: FONT_SANS,
              fontSize: 25,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              boxShadow: "0 12px 28px rgba(11, 11, 14, 0.12)",
            }}
          >
            {ctaButtonText}
          </div>

          <div
            style={{
              padding: "18px 34px",
              borderRadius: 999,
              backgroundColor: SPOTIFY_STUDIO_THEME.paperBg,
              border: `1.5px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
              fontFamily: FONT_MONO,
              fontSize: 23,
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: SPOTIFY_STUDIO_THEME.ink,
            }}
          >
            {ctaUrl}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
