import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AlbumCoverArt,
  SPOTIFY_STUDIO_THEME,
  SpotifyBackdrop,
  SpotifyMark,
  type AlbumArtId,
} from "../../components/SpotifyStudioPrimitives";
import {
  EASE_IN_EXPO,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  SPRING_EDITORIAL,
  SPRING_SNAPPY,
  computeSecondarySettle,
  sec,
} from "../../lib/studioMotion";

export interface SpotifyHookSceneProps {
  badgeText: string;
  hookLine1: string;
  hookLine2Prefix: string;
  hookLine2Serif: string;
  subline: string;
  accentColor: string;
}

interface OrbitAlbumCard {
  artId: AlbumArtId;
  title: string;
  meta: string;
  x: number;
  y: number;
  rot: number;
  showVinyl: boolean;
}

const ORBIT_ALBUMS: OrbitAlbumCard[] = [
  {
    artId: "seoul-rain",
    title: "Seoul Rain",
    meta: "120 BPM · LOSSLESS",
    x: 245,
    y: 220,
    rot: -4.2,
    showVinyl: true,
  },
  {
    artId: "midnight-velvet",
    title: "Velvet Echo",
    meta: "98 BPM · NIGHT",
    x: 1675,
    y: 215,
    rot: 3.8,
    showVinyl: false,
  },
  {
    artId: "analog-bloom",
    title: "Warm Tape 04",
    meta: "112 BPM · VINYL",
    x: 205,
    y: 550,
    rot: 2.6,
    showVinyl: false,
  },
  {
    artId: "solar-dub",
    title: "Solar Dub",
    meta: "124 BPM · STUDIO",
    x: 1715,
    y: 548,
    rot: -3.2,
    showVinyl: true,
  },
  {
    artId: "concrete-echo",
    title: "Concrete Echo",
    meta: "128 BPM · FOCUS",
    x: 285,
    y: 868,
    rot: -2.4,
    showVinyl: false,
  },
  {
    artId: "northern-glass",
    title: "Northern Glass",
    meta: "116 BPM · AMBIENT",
    x: 1635,
    y: 868,
    rot: 3.0,
    showVinyl: false,
  },
];

/**
 * Shot 1 (Beats 0 -> 7, 3.5s): Pure Gallery White Hook + 6-Card Orbital Album Burst
 * - Crisp flat #FFFFFF gallery studio canvas — zero blur circles, zero radial glow blobs.
 * - Frame-0 alive (progress >= 0.48 at f=0).
 * - 6 elevated white album cards burst radially into perimeter zones around the center core,
 *   then snap-implode cleanly into Shot 2.
 */
export const SpotifyHookScene: React.FC<SpotifyHookSceneProps> = ({
  badgeText,
  hookLine1,
  hookLine2Prefix,
  hookLine2Serif,
  subline,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fAlive = frame + sec(0.22, fps);

  const badgePop = spring({
    frame: fAlive,
    fps,
    config: SPRING_SNAPPY,
  });

  const line1P = spring({
    frame: Math.max(0, fAlive - sec(0.05, fps)),
    fps,
    config: SPRING_EDITORIAL,
  });

  const line2P = spring({
    frame: Math.max(0, fAlive - sec(0.18, fps)),
    fps,
    config: SPRING_EDITORIAL,
  });

  const subSettle = computeSecondarySettle(frame, sec(0.22, fps), fps, 0.08, 10);

  const exitStart = durationInFrames - sec(0.28, fps);
  const exitP = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const centerExitScale = interpolate(exitP, [0, 1], [1, 0.92]);
  const centerExitOpacity = interpolate(exitP, [0.45, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }} durationInFrames={105}>
      <SpotifyBackdrop mode="white" showDotGrid />

      {/* 6 Orbital Bespoke Album Cards (Pure White Architectural Cards — Zero Overlap) */}
      {ORBIT_ALBUMS.map((card, idx) => {
        const burstStart = sec(0.18 + idx * 0.055, fps);
        const burstP = spring({
          frame: Math.max(0, frame - burstStart),
          fps,
          config: SPRING_SNAPPY,
        });

        const metaSettle = computeSecondarySettle(frame, burstStart, fps, 0.08, 8);

        const orbitFactor = burstP * (1 - exitP * 0.62);
        const curX = interpolate(orbitFactor, [0, 1], [960, card.x]);
        const curY =
          interpolate(orbitFactor, [0, 1], [540, card.y]) +
          Math.sin((frame / fps) * 2.1 + idx * 1.25) * 6 * (1 - exitP);
        const curScale = interpolate(burstP, [0, 1], [0.46, 1]) * (1 - exitP * 0.34);
        const cardOpacity =
          interpolate(burstP, [0, 0.25], [0, 1], { extrapolateRight: "clamp" }) *
          (1 - exitP * 0.92);

        return (
          <div
            key={card.artId}
            style={{
              position: "absolute",
              left: curX,
              top: curY,
              transform: `translate(-50%, -50%) rotate(${card.rot * (1 - exitP)}deg) scale(${curScale})`,
              opacity: cardOpacity,
              width: 294,
              padding: "14px 18px 14px 14px",
              borderRadius: SPOTIFY_STUDIO_THEME.radiusCard,
              backgroundColor: SPOTIFY_STUDIO_THEME.surface,
              border: `1px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
              boxShadow: SPOTIFY_STUDIO_THEME.shadowCard,
              display: "flex",
              alignItems: "center",
              gap: 14,
              pointerEvents: "none",
            }}
          >
            <AlbumCoverArt
              id={card.artId}
              size={72}
              radius={12}
              showVinyl={card.showVinyl}
              vinylPeek={0.22}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                minWidth: 0,
                marginLeft: card.showVinyl ? 10 : 0,
                transform: `translateY(${metaSettle.translateY}px)`,
                opacity: metaSettle.opacity,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: SPOTIFY_STUDIO_THEME.ink,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {card.title}
              </span>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: SPOTIFY_STUDIO_THEME.greenDeep,
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                {card.meta}
              </span>
            </div>
          </div>
        );
      })}

      {/* Centered Editorial Hook Core (Strictly Inside 120px x 90px Safe Margins) */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "90px 120px",
          transform: `scale(${centerExitScale})`,
          opacity: centerExitOpacity,
        }}
      >
        {/* Brand Emblem + Clean White Pill Eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "10px 22px 10px 12px",
            borderRadius: SPOTIFY_STUDIO_THEME.radiusPill,
            backgroundColor: SPOTIFY_STUDIO_THEME.paperBg,
            border: `1px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
            marginBottom: 34,
            transform: `translateY(${(1 - badgePop) * 14}px) scale(${0.92 + badgePop * 0.08})`,
            opacity: Math.min(1, badgePop * 1.4),
          }}
        >
          <SpotifyMark size={34} circleColor={accentColor} waveColor="#FFFFFF" />
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: SPOTIFY_STUDIO_THEME.ink,
              textTransform: "uppercase",
            }}
          >
            {badgeText}
          </span>
        </div>

        {/* Two-Tone Editorial Display Headline on Pure White */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: 1080,
          }}
        >
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 118,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 0.98,
              color: SPOTIFY_STUDIO_THEME.inkMuted,
              transform: `translateY(${(1 - line1P) * 28}px)`,
              opacity: Math.min(1, line1P * 1.3),
            }}
          >
            {hookLine1}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 20,
              marginTop: 6,
              transform: `translateY(${(1 - line2P) * 28}px)`,
              opacity: Math.min(1, line2P * 1.3),
            }}
          >
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: 118,
                fontWeight: 700,
                letterSpacing: "-0.045em",
                lineHeight: 1.0,
                color: SPOTIFY_STUDIO_THEME.ink,
              }}
            >
              {hookLine2Prefix}
            </span>
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontStyle: "italic",
                fontSize: 132,
                fontWeight: 400,
                letterSpacing: "-0.015em",
                lineHeight: 0.98,
                color: SPOTIFY_STUDIO_THEME.greenDeep,
              }}
            >
              {hookLine2Serif}
            </span>
          </div>
        </div>

        {/* Concise Subline with Hierarchical Secondary Settle */}
        <p
          style={{
            margin: "34px 0 0",
            maxWidth: 760,
            textAlign: "center",
            fontFamily: FONT_SANS,
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            lineHeight: 1.35,
            color: SPOTIFY_STUDIO_THEME.inkMuted,
            transform: `translateY(${subSettle.translateY}px)`,
            opacity: subSettle.opacity,
          }}
        >
          {subline}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
