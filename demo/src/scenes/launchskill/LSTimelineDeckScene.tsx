import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  LS_THEME,
  LSCameraRig,
  LaunchSkillCyclorama,
  MaskedHeadline,
  formatSmpteTimecode,
} from "../../components/LaunchSkillPrimitives";
import {
  EASE_IN_EXPO,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  computeVelocityBlur,
  interpolateBoxGeometry,
  sec,
} from "../../lib/studioMotion";

const TIMELINE_CLIPS = [
  { label: "01 · 2.2× MACRO HOOK", startPct: 0.02, widthPct: 0.24 },
  { label: "02 · SPATIAL RIG", startPct: 0.28, widthPct: 0.26 },
  { label: "03 · WHIP-PAN CUT", startPct: 0.56, widthPct: 0.21 },
  { label: "04 · X FINALE", startPct: 0.79, widthPct: 0.19 },
];

// Deterministic 56-bar 48kHz DSP waveform profile (peaks align with beat cuts!)
const WAVEFORM_BARS = Array.from({ length: 56 }, (_, i) => {
  const t = i / 55;
  const beatDist = Math.min(
    Math.abs(t - 0.12),
    Math.abs(t - 0.34),
    Math.abs(t - 0.58),
    Math.abs(t - 0.82)
  );
  const transient = Math.exp(-beatDist * 22) * 0.72;
  const texture = 0.18 + Math.abs(Math.sin(i * 1.73) * Math.cos(i * 0.67)) * 0.34;
  return Math.min(1, transient + texture);
});

/**
 * Shot 2 (3.0s - 7.5s | f90 - f225 @ 30fps, local f0 - f135):
 *   - Shared-element container expansion: the obsidian command bar unfolds into a
 *     bespoke LaunchSkill Studio Mastering Deck (CAMERA / MOTION / AUDIO -14 LUFS).
 *   - Hero Motif: The Vermilion Playhead sweeps live across all 3 tracks, igniting
 *     active camera clips, drawing a real SVG spring velocity curve, and pulsing DSP audio.
 *   - Camera Choreography: Wide 1.0x -> 1.66x macro tracking dive at local f60 ->
 *     4.6x EASE_IN_EXPO portal zoom-through into obsidian at local f124-f135!
 *   - Copy restraint: "Directs every frame." (3 words).
 */
export const LSTimelineDeckScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalLocal = sec(4.5, fps); // 135f

  // Shared-element expansion from Shot 1's bar geometry into full Studio Deck
  const expandP = interpolate(frame, [0, sec(0.36, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const deckGeom = interpolateBoxGeometry(
    { x: 420, y: 500, width: 1080, height: 152, radius: 18 },
    { x: 240, y: 292, width: 1440, height: 590, radius: 20 },
    expandP
  );

  // Continuous playhead progress across tracks (0.06 -> 0.92)
  const playheadPct = interpolate(frame, [0, sec(4.15, fps)], [0.06, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const trackAreaLeft = 220;
  const trackAreaWidth = 1170;
  const playheadLocalX = trackAreaLeft + playheadPct * trackAreaWidth;
  const playheadWorldX = deckGeom.x + playheadLocalX;

  // Camera Choreography:
  //   0.0s -> 1.95s: Calm wide establish with subtle living drift (1.0 -> 1.04)
  //   1.95s -> 2.35s: Snappy 1.04x -> 1.66x macro dive locked onto the moving Vermilion Playhead!
  //   2.35s -> 4.10s: Tracks smoothly with the playhead across beat hits
  //   4.10s -> 4.50s: EASE_IN_EXPO Portal Zoom-Through (1.66x -> 4.8x) straight into obsidian!
  const diveStart = sec(1.95, fps);
  const diveEnd = sec(2.35, fps);
  const portalStart = sec(4.12, fps);

  const computeCam = (f: number) => {
    const pPct = interpolate(f, [0, sec(4.15, fps)], [0.06, 0.92], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const phWorldX = 240 + trackAreaLeft + pPct * trackAreaWidth;

    const diveP = interpolate(f, [diveStart, diveEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    const portalP = interpolate(f, [portalStart, totalLocal], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    });

    const baseZoom = interpolate(f, [0, diveStart], [0.97, 1.04], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const zoomed = interpolate(diveP, [0, 1], [baseZoom, 1.66]);
    const finalZoom = interpolate(portalP, [0, 1], [zoomed, 4.9]);

    const trackedX = Math.min(1380, Math.max(580, phWorldX));
    const focusX = interpolate(diveP, [0, 1], [960, trackedX]);
    const focusY = interpolate(diveP, [0, 1], [540, 610]);
    const portalFocusY = interpolate(portalP, [0, 1], [focusY, 640]);

    return { zoom: finalZoom, focusX, focusY: portalFocusY, portalP };
  };

  const cam = computeCam(frame);
  const prevCam = computeCam(Math.max(0, frame - 1));
  const { blurX, blurY } = computeVelocityBlur(
    cam.focusX * cam.zoom,
    cam.focusY * cam.zoom,
    prevCam.focusX * prevCam.zoom,
    prevCam.focusY * prevCam.zoom,
    fps,
    0.035,
    10
  );

  // Content reveal inside deck (+70ms secondary settle after shell unfolds)
  const innerOpacity = interpolate(frame, [sec(0.12, fps), sec(0.38, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const innerSlideY = interpolate(frame, [sec(0.12, fps), sec(0.42, fps)], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Live SVG Spring Velocity Curve path (sampled deterministically across track width)
  const curveWidth = trackAreaWidth - 20;
  const curveHeight = 82;
  const curvePts: string[] = [];
  const totalSamples = 84;
  const activeSamples = Math.max(2, Math.floor(playheadPct * totalSamples));
  for (let i = 0; i <= activeSamples; i++) {
    const u = i / totalSamples;
    const x = u * curveWidth;
    // 4 crisp exponential-damped beat impulses across the timeline
    const localBeat = (u * 4) % 1;
    const impulse =
      Math.exp(-localBeat * 5.2) * Math.sin(localBeat * Math.PI * 2.8) * 0.85;
    const y = curveHeight * 0.56 - impulse * (curveHeight * 0.44);
    curvePts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const activeCurveD = curvePts.join(" ");

  // Full faint guide curve
  const guidePts: string[] = [];
  for (let i = 0; i <= totalSamples; i++) {
    const u = i / totalSamples;
    const x = u * curveWidth;
    const localBeat = (u * 4) % 1;
    const impulse =
      Math.exp(-localBeat * 5.2) * Math.sin(localBeat * Math.PI * 2.8) * 0.85;
    const y = curveHeight * 0.56 - impulse * (curveHeight * 0.44);
    guidePts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const guideCurveD = guidePts.join(" ");

  // Fade into pure obsidian in the last 5 frames of the portal zoom for zero-ghosting cut
  const portalBlackOverlay = interpolate(
    frame,
    [sec(4.32, fps), totalLocal],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LaunchSkillCyclorama
        zoom={1 + (cam.zoom - 1) * 0.22}
        panX={(960 - cam.focusX) * 0.14}
        panY={(540 - cam.focusY) * 0.14}
      />

      <LSCameraRig
        focusX={cam.focusX}
        focusY={cam.focusY}
        zoom={cam.zoom}
        blurX={blurX}
        blurY={blurY}
      >
        {/* Top Editorial Headline (anchored cleanly above deck in 70%+ calm negative space) */}
        <div
          style={{
            position: "absolute",
            top: 132,
            left: 240,
            right: 240,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <MaskedHeadline
            startFrame={sec(0.06, fps)}
            fontSize={74}
            align="left"
            words={[
              { text: "Directs" },
              { text: "every", muted: true },
              { text: "frame.", italic: true, accent: LS_THEME.vermilion },
            ]}
          />
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 18,
              fontWeight: 600,
              color: LS_THEME.inkMuted,
              letterSpacing: "0.06em",
              fontVariantNumeric: "tabular-nums",
              opacity: innerOpacity,
            }}
          >
            120 BPM · 30 FPS
          </div>
        </div>

        {/* Bespoke Dark-Mode Studio Mastering Deck (#0E0E11 floating on warm paper) */}
        <div
          style={{
            position: "absolute",
            left: deckGeom.x,
            top: deckGeom.y,
            width: deckGeom.width,
            height: deckGeom.height,
            borderRadius: deckGeom.radius,
            backgroundColor: LS_THEME.deckSurface,
            border: `1px solid ${LS_THEME.deckBorder}`,
            boxShadow: LS_THEME.shadowDeck,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Specular Top Edge */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 36,
              right: 36,
              height: 1,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
            }}
          />

          {/* Transport Bar */}
          <div
            style={{
              height: 60,
              padding: "0 26px",
              borderBottom: `1px solid ${LS_THEME.deckBorderSubtle}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              backgroundColor: "#121216",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: "#FF5F56" }} />
                <span style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: "#FFBD2E" }} />
                <span style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: "#27C93F" }} />
              </div>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#A1A1AA",
                  letterSpacing: "0.05em",
                }}
              >
                LAUNCHSKILL STUDIO · REMOTION 4
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                fontFamily: FONT_MONO,
                fontSize: 17,
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8, color: LS_THEME.vermilion }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: LS_THEME.vermilion,
                  }}
                />
                LIVE
              </span>
              <span style={{ color: "#FAF9F6" }}>
                {formatSmpteTimecode(90 + frame, fps)}
              </span>
            </div>
          </div>

          {/* Beat Ruler */}
          <div
            style={{
              height: 40,
              borderBottom: `1px solid ${LS_THEME.deckBorderSubtle}`,
              display: "flex",
              alignItems: "center",
              position: "relative",
              opacity: innerOpacity,
            }}
          >
            <div
              style={{
                width: trackAreaLeft,
                paddingLeft: 26,
                fontFamily: FONT_MONO,
                fontSize: 13,
                color: "#71717A",
                letterSpacing: "0.06em",
              }}
            >
              BEAT GRID
            </div>
            <div
              style={{
                position: "relative",
                width: trackAreaWidth,
                height: "100%",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                paddingBottom: 6,
              }}
            >
              {Array.from({ length: 17 }).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {idx % 4 === 0 && (
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 12,
                        color: "#71717A",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      B{idx + 1}
                    </span>
                  )}
                  <span
                    style={{
                      width: 1,
                      height: idx % 4 === 0 ? 11 : 6,
                      backgroundColor:
                        idx % 4 === 0 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 3 Bespoke Domain-Native Studio Tracks */}
          <div
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              opacity: innerOpacity,
              transform: `translateY(${innerSlideY}px)`,
            }}
          >
            {/* TRACK 01: CAMERA CHOREOGRAPHY CLIPS */}
            <div
              style={{
                flex: 1,
                borderBottom: `1px solid ${LS_THEME.deckBorderSubtle}`,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ width: trackAreaLeft, paddingLeft: 26, boxSizing: "border-box" }}>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#FAF9F6",
                    letterSpacing: "0.06em",
                  }}
                >
                  01 · CAMERA
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 13, color: "#71717A", marginTop: 4 }}>
                  Focal-lock rig
                </div>
              </div>

              <div style={{ position: "relative", width: trackAreaWidth, height: 84 }}>
                {TIMELINE_CLIPS.map((clip) => {
                  const isActive =
                    playheadPct >= clip.startPct &&
                    playheadPct <= clip.startPct + clip.widthPct;
                  const isPassed = playheadPct > clip.startPct + clip.widthPct;

                  return (
                    <div
                      key={clip.label}
                      style={{
                        position: "absolute",
                        left: `${clip.startPct * 100}%`,
                        width: `${clip.widthPct * 100}%`,
                        top: 8,
                        height: 68,
                        borderRadius: LS_THEME.radiusClip,
                        backgroundColor: isActive
                          ? "rgba(229, 72, 46, 0.16)"
                          : isPassed
                            ? "#1A1A20"
                            : "#15151A",
                        border: isActive
                          ? `1.5px solid ${LS_THEME.vermilion}`
                          : "1px solid rgba(255,255,255,0.11)",
                        padding: "0 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxSizing: "border-box",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 14,
                          fontWeight: 600,
                          color: isActive ? "#FFFFFF" : "#B4B4BC",
                          letterSpacing: "0.03em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {clip.label}
                      </span>
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 999,
                          backgroundColor: isActive
                            ? LS_THEME.vermilion
                            : isPassed
                              ? "#22C55E"
                              : "rgba(255,255,255,0.18)",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TRACK 02: MOTION PHYSICS CURVE (Live SVG Bezier Spring Trace) */}
            <div
              style={{
                flex: 1,
                borderBottom: `1px solid ${LS_THEME.deckBorderSubtle}`,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ width: trackAreaLeft, paddingLeft: 26, boxSizing: "border-box" }}>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#FAF9F6",
                    letterSpacing: "0.06em",
                  }}
                >
                  02 · PHYSICS
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 13, color: "#71717A", marginTop: 4 }}>
                  Expo &amp; springs
                </div>
              </div>

              <div style={{ position: "relative", width: trackAreaWidth, height: curveHeight }}>
                <svg
                  width={curveWidth}
                  height={curveHeight}
                  viewBox={`0 0 ${curveWidth} ${curveHeight}`}
                  style={{ overflow: "visible" }}
                >
                  <line
                    x1={0}
                    y1={curveHeight * 0.56}
                    x2={curveWidth}
                    y2={curveHeight * 0.56}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={1}
                    strokeDasharray="4 6"
                  />
                  <path
                    d={guideCurveD}
                    fill="none"
                    stroke="rgba(255,255,255,0.16)"
                    strokeWidth={2}
                  />
                  <path
                    d={activeCurveD}
                    fill="none"
                    stroke="#FAF9F6"
                    strokeWidth={2.8}
                    strokeLinecap="round"
                  />
                  {/* Live dot riding right on the playhead intersection */}
                  <circle
                    cx={playheadPct * curveWidth}
                    cy={
                      curveHeight * 0.56 -
                      Math.exp(-((playheadPct * 4) % 1) * 5.2) *
                        Math.sin(((playheadPct * 4) % 1) * Math.PI * 2.8) *
                        0.85 *
                        (curveHeight * 0.44)
                    }
                    r={5.5}
                    fill={LS_THEME.vermilion}
                  />
                </svg>
              </div>
            </div>

            {/* TRACK 03: 48 kHz DSP AUDIO WAVEFORM (-14 LUFS) */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ width: trackAreaLeft, paddingLeft: 26, boxSizing: "border-box" }}>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#FAF9F6",
                    letterSpacing: "0.06em",
                  }}
                >
                  03 · FOLEY
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#71717A", marginTop: 4 }}>
                  48kHz · -14 LUFS
                </div>
              </div>

              <div
                style={{
                  position: "relative",
                  width: trackAreaWidth - 20,
                  height: 82,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {WAVEFORM_BARS.map((amp, i) => {
                  const barPct = i / (WAVEFORM_BARS.length - 1);
                  const distToHead = Math.abs(barPct - playheadPct);
                  const nearHead = Math.max(0, 1 - distToHead * 14);
                  const isPassed = barPct <= playheadPct;
                  const heightPx = Math.round(10 + amp * 52 + nearHead * 18);

                  return (
                    <div
                      key={i}
                      style={{
                        width: 9,
                        height: heightPx,
                        borderRadius: 4,
                        backgroundColor:
                          nearHead > 0.25
                            ? LS_THEME.vermilion
                            : isPassed
                              ? "rgba(250, 249, 246, 0.72)"
                              : "rgba(255, 255, 255, 0.16)",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* CONTINUOUS HERO MOTIF: Vermilion Playhead sweeping across all 3 tracks */}
            <div
              style={{
                position: "absolute",
                top: -40,
                bottom: 0,
                left: playheadLocalX,
                width: 3,
                backgroundColor: LS_THEME.vermilion,
                boxShadow: `0 0 18px ${LS_THEME.vermilionGlow}`,
                pointerEvents: "none",
                zIndex: 20,
              }}
            >
              <svg
                width={18}
                height={14}
                viewBox="0 0 18 14"
                style={{ position: "absolute", top: -2, left: -7.5 }}
              >
                <path d="M1 0H17L9 13L1 0Z" fill={LS_THEME.vermilion} />
              </svg>
            </div>
          </div>
        </div>
      </LSCameraRig>

      {/* Clean portal dive fade to exact Shot 3A obsidian (#0B0B0D) at peak zoom velocity */}
      {portalBlackOverlay > 0.005 && (
        <AbsoluteFill
          style={{
            backgroundColor: LS_THEME.obsidianMid,
            opacity: portalBlackOverlay,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
