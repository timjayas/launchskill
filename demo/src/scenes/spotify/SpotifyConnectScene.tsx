import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ConnectDeviceIcon,
  SPOTIFY_STUDIO_THEME,
  SpotifyBackdrop,
  type ConnectDeviceKind,
} from "../../components/SpotifyStudioPrimitives";
import {
  EASE_IN_EXPO,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  SPRING_EDITORIAL,
  SPRING_SNAPPY,
  computeSecondarySettle,
  sec,
} from "../../lib/studioMotion";

export interface SpotifyConnectSceneProps {
  connectLine1: string;
  connectLine2Prefix: string;
  connectLine2Serif: string;
  connectDevices: [string, string, string, string];
  accentColor: string;
}

const DEVICE_KINDS: ConnectDeviceKind[] = ["headphones", "car", "speaker", "laptop"];

/**
 * Shot 5 (Beats 40 -> 46, 3.0s): Pure Gallery White Inline Device Slot-Swap (Spotify Connect)
 *   - Clean solid #FFFFFF canvas — zero blur circles, zero glow halos.
 *   - Fixed-width inline green icon slot guarantees zero horizontal baseline jitter.
 *   - Accelerates via EASE_IN_EXPO into a velocity-matched zoom-through into Shot 6.
 */
export const SpotifyConnectScene: React.FC<SpotifyConnectSceneProps> = ({
  connectLine1,
  connectLine2Prefix,
  connectLine2Serif,
  connectDevices,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const arriveP = spring({
    frame: frame + sec(0.14, fps),
    fps,
    config: SPRING_EDITORIAL,
  });
  const badgeSettle = computeSecondarySettle(frame + sec(0.1, fps), 0, fps, 0.075, 8);

  const slotStep = sec(0.62, fps);
  const rawIdx = Math.floor(frame / slotStep);
  const activeIdx = Math.min(DEVICE_KINDS.length - 1, rawIdx);
  const slotLocal = frame - activeIdx * slotStep;

  const iconEnter = spring({
    frame: slotLocal + (activeIdx === 0 ? sec(0.16, fps) : 0),
    fps,
    config: SPRING_SNAPPY,
  });

  const exitLead = sec(0.34, fps);
  const zoomOutP = interpolate(frame, [durationInFrames - exitLead, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });
  const outScale = 1 + zoomOutP * 0.32;
  const outOpacity = interpolate(zoomOutP, [0.55, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SpotifyBackdrop mode="white" showDotGrid />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "96px 128px",
          transform: `scale(${outScale})`,
          opacity: outOpacity,
        }}
      >
        {/* Top Mono Eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 20px",
            borderRadius: 999,
            backgroundColor: SPOTIFY_STUDIO_THEME.paperBg,
            border: `1px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
            marginBottom: 42,
            transform: `translateY(${(1 - arriveP) * 16}px)`,
            opacity: Math.min(1, arriveP * 1.4),
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              backgroundColor: accentColor,
            }}
          />
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: SPOTIFY_STUDIO_THEME.ink,
            }}
          >
            SPOTIFY CONNECT
          </span>
        </div>

        {/* Two-Line Editorial Thesis With Fixed-Width Inline Icon Slot */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            transform: `translateY(${(1 - arriveP) * 24}px)`,
            opacity: Math.min(1, arriveP * 1.35),
          }}
        >
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 98,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 1.02,
              color: SPOTIFY_STUDIO_THEME.inkMuted,
            }}
          >
            {connectLine1}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
            }}
          >
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: 98,
                fontWeight: 700,
                letterSpacing: "-0.045em",
                lineHeight: 1.02,
                color: SPOTIFY_STUDIO_THEME.ink,
              }}
            >
              {connectLine2Prefix}
            </span>

            {/* Fixed-Width Locked-Baseline Inline Device Slot (Crisp Flat Shadow — Zero Glow Blob) */}
            <div
              style={{
                position: "relative",
                width: 114,
                height: 96,
                borderRadius: 26,
                backgroundColor: accentColor,
                boxShadow: "0 12px 26px rgba(11, 11, 14, 0.14)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  transform: `translateY(${(1 - iconEnter) * 44}px) scale(${0.86 + iconEnter * 0.14})`,
                  opacity: interpolate(iconEnter, [0, 0.3], [0, 1], {
                    extrapolateRight: "clamp",
                    easing: EASE_OUT_EXPO,
                  }),
                }}
              >
                <ConnectDeviceIcon kind={DEVICE_KINDS[activeIdx]} size={52} color="#FFFFFF" />
              </div>
            </div>

            <span
              style={{
                fontFamily: FONT_SERIF,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 110,
                letterSpacing: "-0.015em",
                lineHeight: 0.98,
                color: SPOTIFY_STUDIO_THEME.greenDeep,
              }}
            >
              {connectLine2Serif}
            </span>
          </div>
        </div>

        {/* Clean White Connected Device Status Pill */}
        <div
          style={{
            marginTop: 48,
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "14px 28px",
            borderRadius: 999,
            backgroundColor: SPOTIFY_STUDIO_THEME.surface,
            border: `1.5px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
            boxShadow: SPOTIFY_STUDIO_THEME.shadowCard,
            transform: `translateY(${badgeSettle.translateY}px)`,
            opacity: badgeSettle.opacity,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: accentColor,
            }}
          />
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: 23,
              fontWeight: 700,
              letterSpacing: "-0.015em",
              color: SPOTIFY_STUDIO_THEME.ink,
              minWidth: 196,
            }}
          >
            {connectDevices[activeIdx]}
          </span>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 18,
              fontWeight: 700,
              color: SPOTIFY_STUDIO_THEME.greenDeep,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            · 0ms handoff
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
