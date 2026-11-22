import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AlbumCoverArt,
  DirectionalMotionBlur,
  SPOTIFY_STUDIO_THEME,
  SpotifyBackdrop,
  SpotifyMark,
  SpatialCameraRig,
  TactileCursor,
} from "../../components/SpotifyStudioPrimitives";
import {
  EASE_HUMAN_MOTOR,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  SPRING_EDITORIAL,
  SPRING_POP,
  computeSecondarySettle,
  computeVelocityBlur,
  sec,
} from "../../lib/studioMotion";

export interface SpotifyPlayerMacroSceneProps {
  playlistTitle: string;
  trackTitle: string;
  trackArtist: string;
  audioSpecBadge: string;
  syncedLyrics: [string, string, string, string];
  accentColor: string;
}

const TOTAL_TRACK_SECONDS = 222;

const formatTimecode = (seconds: number): string => {
  const clamped = Math.max(0, Math.min(TOTAL_TRACK_SECONDS, Math.round(seconds)));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const WAVEFORM_BARS = Array.from({ length: 44 }, (_, i) => {
  const wave =
    0.34 +
    0.32 * Math.abs(Math.sin(i * 0.42 + 0.6)) +
    0.24 * Math.abs(Math.cos(i * 0.88 - 0.3)) +
    (i % 4 === 0 ? 0.1 : 0);
  return Math.min(1, Math.max(0.18, wave));
});

/**
 * Shot 3 (Beats 18 -> 30, 6.0s): Crisp Light-Gallery Lossless Spotify Studio Player +
 *   Exact Focal-Lock <SpatialCameraRig> Push + Forward-and-Back Tactile Scrubber +
 *   1:1 Live Synced Lyrics & Save Heart Pop
 */
export const SpotifyPlayerMacroScene: React.FC<SpotifyPlayerMacroSceneProps> = ({
  playlistTitle,
  trackTitle,
  trackArtist,
  audioSpecBadge,
  syncedLyrics,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const whipIn = interpolate(frame, [0, sec(0.18, fps)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const windowPop = spring({
    frame,
    fps,
    config: SPRING_EDITORIAL,
  });
  const headerSettle = computeSecondarySettle(frame, 0, fps, 0.075, 8);

  const grabStart = sec(2.05, fps);
  const forwardEnd = sec(3.15, fps);
  const backStart = sec(3.3, fps);
  const backEnd = sec(4.05, fps);
  const heartClickFrame = sec(4.62, fps);

  const scrubForward = interpolate(frame, [grabStart, forwardEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_HUMAN_MOTOR,
  });
  const scrubBack = interpolate(frame, [backStart, backEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_HUMAN_MOTOR,
  });
  const passiveDrift = interpolate(frame, [0, grabStart], [0.26, 0.31], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const postScrubDrift = interpolate(frame, [backEnd, sec(6.0, fps)], [0, 0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const playheadProgress =
    passiveDrift + scrubForward * 0.42 - scrubBack * 0.24 + postScrubDrift;

  const currentSec = playheadProgress * TOTAL_TRACK_SECONDS;
  const activeLyricIdx =
    playheadProgress < 0.36
      ? 0
      : playheadProgress < 0.56
        ? 1
        : playheadProgress < 0.72
          ? 2
          : 3;

  const evalCamera = (f: number) => {
    const pushIn = interpolate(f, [sec(0.95, fps), sec(1.62, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const panToHeart = interpolate(f, [sec(4.05, fps), sec(4.48, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const pullOut = interpolate(f, [sec(4.92, fps), sec(5.55, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });

    const env = Math.max(0, pushIn - pullOut);
    const targetWx = interpolate(panToHeart, [0, 1], [1006, 1280]);
    const targetWy = interpolate(panToHeart, [0, 1], [785, 675]);

    return {
      wx: interpolate(env, [0, 1], [960, targetWx]),
      wy: interpolate(env, [0, 1], [540, targetWy]),
      zoom: interpolate(env, [0, 1], [1.0, 1.54]),
    };
  };

  const cam = evalCamera(frame);
  const prevCam = evalCamera(Math.max(0, frame - 1));
  const camBlur = computeVelocityBlur(cam.wx, cam.wy, prevCam.wx, prevCam.wy, fps, 0.08, 10);

  const trackLeft = 504;
  const trackWidth = 1004;
  const thumbX = trackLeft + playheadProgress * trackWidth;
  const thumbY = 832;

  const heartX = 1508;
  const heartY = 661;

  const cEnterStart = sec(1.48, fps);
  const cArriveThumb = sec(1.92, fps);
  const cLeaveThumb = sec(4.12, fps);
  const cArriveHeart = sec(4.52, fps);

  let cursorX = 1320;
  let cursorY = 900;
  if (frame < cArriveThumb) {
    const t = interpolate(frame, [cEnterStart, cArriveThumb], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const from = { x: 1240, y: 920 };
    const to = { x: trackLeft + 0.31 * trackWidth, y: thumbY };
    const ctrl = { x: 1020, y: 905 };
    const inv = 1 - t;
    cursorX = inv * inv * from.x + 2 * inv * t * ctrl.x + t * t * to.x;
    cursorY = inv * inv * from.y + 2 * inv * t * ctrl.y + t * t * to.y;
  } else if (frame < cLeaveThumb) {
    cursorX = thumbX;
    cursorY = thumbY;
  } else {
    const t = interpolate(frame, [cLeaveThumb, cArriveHeart], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const from = { x: trackLeft + 0.49 * trackWidth, y: thumbY };
    const to = { x: heartX, y: heartY };
    const ctrl = { x: 1240, y: 745 };
    const inv = 1 - t;
    cursorX = inv * inv * from.x + 2 * inv * t * ctrl.x + t * t * to.x;
    cursorY = inv * inv * from.y + 2 * inv * t * ctrl.y + t * t * to.y;
  }

  const cursorOpacity =
    interpolate(frame, [cEnterStart, cEnterStart + sec(0.14, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [sec(5.05, fps), sec(5.32, fps)], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const isGrabbingThumb = frame >= grabStart - sec(0.08, fps) && frame <= backEnd + sec(0.06, fps);
  const heartPressScale = interpolate(
    frame,
    [heartClickFrame, heartClickFrame + sec(0.08, fps), heartClickFrame + sec(0.24, fps)],
    [1, 0.85, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cursorScale = isGrabbingThumb ? 0.92 : heartPressScale;

  const isSaved = frame >= heartClickFrame;
  const savedPop = spring({
    frame: Math.max(0, frame - heartClickFrame),
    fps,
    config: SPRING_POP,
  });
  const savedRipple = interpolate(frame, [heartClickFrame, heartClickFrame + sec(0.45, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SpotifyBackdrop mode="paper" showDotGrid />

      <DirectionalMotionBlur blurX={whipIn * 14} blurY={0}>
        <AbsoluteFill style={{ transform: `translate3d(${whipIn * 340}px, 0, 0)` }}>
          <SpatialCameraRig
            focusX={cam.wx}
            focusY={cam.wy}
            zoom={cam.zoom}
            blurX={camBlur.blurX}
            blurY={camBlur.blurY}
          >
            <div style={{ position: "relative", width: 1920, height: 1080 }}>
              {/* Orthogonal Light-Gallery Spotify Studio Player Window (1380x750 centered at 960, 540) */}
              <div
                style={{
                  position: "absolute",
                  left: 270,
                  top: 165,
                  width: 1380,
                  height: 750,
                  borderRadius: SPOTIFY_STUDIO_THEME.radiusWindow,
                  backgroundColor: SPOTIFY_STUDIO_THEME.surface,
                  border: `1.5px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
                  boxShadow: SPOTIFY_STUDIO_THEME.shadowHero,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  transform: `scale(${0.96 + windowPop * 0.04})`,
                }}
              >
                {/* Top Player Chrome Bar */}
                <div
                  style={{
                    height: 74,
                    padding: "0 34px",
                    borderBottom: `1px solid ${SPOTIFY_STUDIO_THEME.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#FAFAFA",
                    transform: `translateY(${headerSettle.translateY}px)`,
                    opacity: headerSettle.opacity,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <SpotifyMark size={30} circleColor={accentColor} waveColor="#FFFFFF" />
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 16,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        color: SPOTIFY_STUDIO_THEME.inkMuted,
                        textTransform: "uppercase",
                      }}
                    >
                      NOW PLAYING · {playlistTitle}
                    </span>
                  </div>

                  {/* Crisp Lossless Spec Pill */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 18px",
                      borderRadius: 999,
                      backgroundColor: SPOTIFY_STUDIO_THEME.greenTint,
                      border: `1px solid ${SPOTIFY_STUDIO_THEME.greenBorder}`,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: accentColor,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 15,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        color: SPOTIFY_STUDIO_THEME.greenDeep,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {audioSpecBadge}
                    </span>
                  </div>
                </div>

                {/* Middle Stage: Left Album Art + Track Info | Right Live Synced Lyrics */}
                <div
                  style={{
                    flex: 1,
                    padding: "36px 46px 22px",
                    display: "flex",
                    alignItems: "center",
                    gap: 54,
                  }}
                >
                  {/* Left: Hero Album Art & Track Meta */}
                  <div
                    style={{
                      width: 470,
                      display: "flex",
                      flexDirection: "column",
                      gap: 24,
                      flexShrink: 0,
                    }}
                  >
                    <AlbumCoverArt
                      id="seoul-rain"
                      size={310}
                      radius={22}
                      showVinyl
                      vinylPeek={0.26}
                    />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span
                          style={{
                            fontFamily: FONT_SANS,
                            fontSize: 38,
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            color: SPOTIFY_STUDIO_THEME.ink,
                          }}
                        >
                          {trackTitle}
                        </span>
                        <span
                          style={{
                            fontFamily: FONT_SANS,
                            fontSize: 22,
                            fontWeight: 500,
                            color: SPOTIFY_STUDIO_THEME.inkMuted,
                          }}
                        >
                          {trackArtist}
                        </span>
                      </div>

                      {/* Live Mini Acoustic Spectrum */}
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 34 }}>
                        {[0, 1, 2, 3, 4].map((b) => {
                          const h =
                            10 +
                            Math.round(
                              22 * Math.abs(Math.sin((frame / fps) * 6.4 + b * 1.15))
                            );
                          return (
                            <div
                              key={b}
                              style={{
                                width: 5,
                                height: h,
                                borderRadius: 3,
                                backgroundColor: accentColor,
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right: Clean Light Synced Lyrics Panel */}
                  <div
                    style={{
                      flex: 1,
                      height: 416,
                      borderRadius: 22,
                      padding: "30px 36px",
                      backgroundColor: SPOTIFY_STUDIO_THEME.surfaceSubtle,
                      border: `1px solid ${SPOTIFY_STUDIO_THEME.border}`,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 15,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          color: SPOTIFY_STUDIO_THEME.inkMuted,
                        }}
                      >
                        SYNCED LYRICS · LIVE
                      </span>

                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 15,
                          fontWeight: 700,
                          color: SPOTIFY_STUDIO_THEME.greenDeep,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        LINE 0{activeLyricIdx + 1} / 04
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 22,
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      {syncedLyrics.map((line, i) => {
                        const isActive = i === activeLyricIdx;
                        const isPast = i < activeLyricIdx;
                        return (
                          <div
                            key={line}
                            style={{
                              fontFamily: FONT_SANS,
                              fontSize: isActive ? 34 : 28,
                              fontWeight: isActive ? 800 : 600,
                              letterSpacing: "-0.025em",
                              lineHeight: 1.18,
                              color: isActive
                                ? SPOTIFY_STUDIO_THEME.ink
                                : isPast
                                  ? "rgba(11, 11, 14, 0.42)"
                                  : "rgba(11, 11, 14, 0.28)",
                              transform: `translateX(${isActive ? 8 : 0}px)`,
                              borderLeft: isActive
                                ? `4px solid ${accentColor}`
                                : "4px solid transparent",
                              paddingLeft: 16,
                            }}
                          >
                            {line}
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom status row inside lyrics panel with Save Heart Action */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: 14,
                        borderTop: `1px solid ${SPOTIFY_STUDIO_THEME.border}`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 15,
                          fontWeight: 600,
                          color: isSaved
                            ? SPOTIFY_STUDIO_THEME.greenDeep
                            : SPOTIFY_STUDIO_THEME.inkMuted,
                        }}
                      >
                        {isSaved ? "Saved to Liked Songs ✓" : "Save track to Library"}
                      </span>

                      <div
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 20px",
                          borderRadius: 999,
                          backgroundColor: isSaved ? accentColor : "#FFFFFF",
                          border: isSaved
                            ? `1.5px solid ${accentColor}`
                            : `1.5px solid ${SPOTIFY_STUDIO_THEME.borderStrong}`,
                          transform: `scale(${
                            isSaved ? 1 + (savedPop - 0.85) * 0.14 : heartPressScale
                          })`,
                        }}
                      >
                        <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 20.5L10.55 19.18C5.4 14.51 2 11.42 2 7.65C2 4.56 4.42 2.15 7.5 2.15C9.24 2.15 10.91 2.96 12 4.24C13.09 2.96 14.76 2.15 16.5 2.15C19.58 2.15 22 4.56 22 7.65C22 11.42 18.6 14.51 13.45 19.19L12 20.5Z"
                            fill={isSaved ? "#FFFFFF" : "none"}
                            stroke={isSaved ? "#FFFFFF" : SPOTIFY_STUDIO_THEME.ink}
                            strokeWidth="2.2"
                          />
                        </svg>
                        <span
                          style={{
                            fontFamily: FONT_SANS,
                            fontSize: 17,
                            fontWeight: 800,
                            color: isSaved ? "#FFFFFF" : SPOTIFY_STUDIO_THEME.ink,
                          }}
                        >
                          {isSaved ? "Saved" : "Save"}
                        </span>
                        {isSaved && savedRipple < 1 && (
                          <div
                            style={{
                              position: "absolute",
                              inset: -6,
                              borderRadius: 999,
                              border: `3px solid ${accentColor}`,
                              transform: `scale(${1 + savedRipple * 0.35})`,
                              opacity: 1 - savedRipple,
                              pointerEvents: "none",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Playback Scrubber Dock */}
                <div
                  style={{
                    height: 158,
                    padding: "18px 46px 26px",
                    borderTop: `1px solid ${SPOTIFY_STUDIO_THEME.border}`,
                    backgroundColor: "#FAFAFA",
                    display: "flex",
                    alignItems: "center",
                    gap: 28,
                  }}
                >
                  {/* Play/Pause Crisp Green Circle Button */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      backgroundColor: accentColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="#FFFFFF">
                      <rect x="6" y="4.5" width="4.2" height="15" rx="1.5" />
                      <rect x="13.8" y="4.5" width="4.2" height="15" rx="1.5" />
                    </svg>
                  </div>

                  {/* Current Tabular Timecode */}
                  <span
                    style={{
                      width: 68,
                      fontFamily: FONT_MONO,
                      fontSize: 21,
                      fontWeight: 700,
                      color: isGrabbingThumb
                        ? SPOTIFY_STUDIO_THEME.greenDeep
                        : SPOTIFY_STUDIO_THEME.ink,
                      fontVariantNumeric: "tabular-nums",
                      flexShrink: 0,
                    }}
                  >
                    {formatTimecode(currentSec)}
                  </span>

                  {/* Interactive 44-Bar Acoustic Waveform Scrubber */}
                  <div
                    style={{
                      position: "relative",
                      flex: 1,
                      height: 68,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 6,
                    }}
                  >
                    {WAVEFORM_BARS.map((amp, i) => {
                      const barRatio = i / (WAVEFORM_BARS.length - 1);
                      const isPlayed = barRatio <= playheadProgress;
                      const isNearHead = Math.abs(barRatio - playheadProgress) < 0.04;
                      return (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: Math.round(amp * 54),
                            borderRadius: 4,
                            backgroundColor: isPlayed
                              ? isNearHead
                                ? SPOTIFY_STUDIO_THEME.ink
                                : accentColor
                              : "rgba(11, 11, 14, 0.14)",
                          }}
                        />
                      );
                    })}

                    {/* Tactile Playhead Thumb (Crisp border ring — zero hazy blur) */}
                    <div
                      style={{
                        position: "absolute",
                        left: `${playheadProgress * 100}%`,
                        top: "50%",
                        width: isGrabbingThumb ? 24 : 18,
                        height: isGrabbingThumb ? 24 : 18,
                        borderRadius: "50%",
                        backgroundColor: "#FFFFFF",
                        border: `3.5px solid ${accentColor}`,
                        transform: "translate(-50%, -50%)",
                        boxShadow: isGrabbingThumb
                          ? `0 0 0 6px rgba(29, 185, 84, 0.18), 0 4px 10px rgba(11,11,14,0.18)`
                          : "0 3px 8px rgba(11, 11, 14, 0.18)",
                      }}
                    />
                  </div>

                  {/* Total Tabular Timecode */}
                  <span
                    style={{
                      width: 68,
                      textAlign: "right",
                      fontFamily: FONT_MONO,
                      fontSize: 21,
                      fontWeight: 600,
                      color: SPOTIFY_STUDIO_THEME.inkMuted,
                      fontVariantNumeric: "tabular-nums",
                      flexShrink: 0,
                    }}
                  >
                    03:42
                  </span>
                </div>
              </div>

              {/* World-Space Crisp Dark Pointer on Light UI */}
              {frame >= cEnterStart && (
                <TactileCursor
                  x={cursorX}
                  y={cursorY}
                  scale={cursorScale}
                  opacity={cursorOpacity}
                  fill="#0B0B0E"
                  stroke="#FFFFFF"
                />
              )}
            </div>
          </SpatialCameraRig>
        </AbsoluteFill>
      </DirectionalMotionBlur>
    </AbsoluteFill>
  );
};
