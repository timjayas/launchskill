/**
 * Gemini Mobile App v3 — Pure Visual & Illustrative Motion Design (22.50s / 48 beats @ 128 BPM = 675f @ 30fps)
 *
 * Visual-First Motion Principles (Zero AI Slop):
 *   - ZERO wireframe/skeleton grid backgrounds
 *   - ZERO distracting giant background watermark words ("LIVE", "VISION", "ACTION")
 *   - ZERO chat bubbles, fake prompt boxes, or long typed sentences
 *   - ZERO explanatory paragraphs or dense text tables (max 2-3 words at any moment!)
 *   - 100% driven by sculptural illustration, 2.5D hardware choreography, container morphing,
 *     exploded Z-axis visual cards, sweeping watch dials, topographic route animation, and portal match-cuts.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import {
  FONT_MONO,
  FONT_SANS,
  GEMINI_THEME,
  GeminiDirectionalBlur,
  GeminiFilmGrain,
  GeminiSoundTrackLayer,
  GeminiSpatialBackdrop,
  GeminiStarMark,
  MaskedWords,
  PerspectivePhoneStage,
  type GeminiSfxCue,
} from "../components/GeminiMobilePrimitives";
import {
  CameraLensViewfinderIllustration,
  ExplodedVisualInsightCard,
  LiveVoiceSpectrum,
  MorphingVectorShape,
  TactileClockDialWidget,
  TactileRouteMapWidget,
} from "../components/GeminiRichSurfaces";
import {
  EASE_IN_EXPO,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  SPRING_EDITORIAL,
  SPRING_POP,
  SPRING_SNAPPY,
  computeAnticipationCurve,
  computeVelocityDeformation,
  createBeatGrid,
  ensureStudioFontsRaceFree,
  sec,
} from "../lib/studioMotion";

export const geminiMobileLaunchSchema = z.object({
  brandName: z.string(),
  voiceQuery: z.string(),
  ctaUrl: z.string(),
  platformBadge: z.string(),
  bpm: z.number().min(100).max(145),
  enableRealSfx: z.boolean(),
  musicTrack: z.string().optional(),
  musicStartFromSec: z.number().min(0),
  musicVolume: z.number().min(0).max(1),
});

export type GeminiMobileLaunchProps = z.infer<typeof geminiMobileLaunchSchema>;

export const defaultGeminiMobileLaunchProps: GeminiMobileLaunchProps = {
  brandName: "Gemini",
  voiceQuery: "",
  ctaUrl: "gemini.google.com/app",
  platformBadge: "iOS · Android",
  bpm: 128,
  enableRealSfx: true,
  musicTrack: "audio/gemini-mobile-128bpm.wav",
  musicStartFromSec: 0,
  musicVolume: 0.24,
};

export const GEMINI_MOBILE_BEAT_CUTS = {
  morphToPhone: 4,     //  56f (1.88s — Sonic Iris capsule morphs into 3D Phone)
  explodeCard: 10,     // 141f (4.69s — Visual card explodes +88px out of glass)
  whipToActions: 19,   // 267f (8.91s — 2.5D Perspective Whip-Turn across stage)
  portalDive: 35,      // 492f (16.41s — Portal Zoom-Through Match Cut)
  total: 48,           // 675f (22.50s)
} as const;

export const getGeminiMobileTotalFrames = (bpm: number, fps: number): number => {
  const g = createBeatGrid(bpm, fps);
  return g.beat(GEMINI_MOBILE_BEAT_CUTS.total);
};

export const GeminiMobileLaunch: React.FC<GeminiMobileLaunchProps> = (props) => {
  ensureStudioFontsRaceFree();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const g = createBeatGrid(props.bpm, fps);
  const fMorphStart = g.beat(GEMINI_MOBILE_BEAT_CUTS.morphToPhone);      // ~56f
  const fMorphEnd = fMorphStart + sec(0.72, fps);                        // ~78f
  const fExplode = g.beat(GEMINI_MOBILE_BEAT_CUTS.explodeCard);          // ~141f
  const fWhipStart = g.beat(GEMINI_MOBILE_BEAT_CUTS.whipToActions);      // ~267f
  const fWhipEnd = fWhipStart + sec(0.62, fps);                          // ~286f
  const fPortalStart = g.beat(GEMINI_MOBILE_BEAT_CUTS.portalDive);       // ~492f
  const fPortalCut = fPortalStart + sec(0.56, fps);                      // ~509f

  // ==========================================================================
  // 1. CONTINUOUS THROUGH-LINE OBJECT GEOMETRY (Sonic Iris -> 3D Phone -> Portal)
  // ==========================================================================
  const morphP = interpolate(frame, [fMorphStart, fMorphEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  // 2.5D Whip-Turn with Disney Principle #2 Anticipation (coils back -10% before whipping across stage!)
  const whipP = computeAnticipationCurve(frame, fWhipStart, fps, {
    anticipationSec: 0.1,
    driveSec: 0.52,
    pullback: -0.09,
  });

  // Volume-Preserving Elastic Squash & Stretch during the whip-turn
  const prevWhipP = computeAnticipationCurve(Math.max(0, frame - 1), fWhipStart, fps, {
    anticipationSec: 0.1,
    driveSec: 0.52,
    pullback: -0.09,
  });
  const deform = computeVelocityDeformation(
    whipP * -610,
    0,
    prevWhipP * -610,
    0,
    fps,
    0.0014,
    0.065
  );

  const portalInP = interpolate(frame, [fPortalStart, fPortalCut], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  // Living 2.5D camera orbit
  const floatYaw = Math.sin((frame / fps) * 1.65) * 2.6;
  const floatPitch = Math.cos((frame / fps) * 1.35) * 1.8;

  // Morphing container dimensions (Sculptural Sonic Capsule 540x210 -> Phone 440x888)
  const containerW = interpolate(morphP, [0, 1], [540, 440]);
  const containerH = interpolate(morphP, [0, 1], [210, 888]);
  const containerRadius = interpolate(morphP, [0, 1], [105, 54]);

  const stageX =
    interpolate(morphP, [0, 1], [0, 260]) +
    interpolate(whipP, [0, 1], [0, -610]) +
    interpolate(portalInP, [0, 1], [0, 350]);

  const stageY =
    interpolate(morphP, [0, 1], [0, 6]) +
    interpolate(portalInP, [0, 1], [0, -16]);

  const rotateX =
    interpolate(morphP, [0, 1], [11, 6]) +
    interpolate(whipP, [0, 1], [0, -2]) +
    floatPitch * (1 - portalInP);

  const rotateY =
    interpolate(morphP, [0, 1], [0, -18]) +
    interpolate(whipP, [0, 1], [0, 35]) +
    interpolate(portalInP, [0, 1], [0, -17]) +
    floatYaw * (1 - portalInP);

  const rotateZ =
    interpolate(morphP, [0, 1], [0, -1.8]) +
    interpolate(whipP, [0, 1], [0, 3.2]) * (1 - portalInP);

  const frame0Enter = spring({
    frame: frame + sec(0.2, fps),
    fps,
    config: SPRING_EDITORIAL,
  });
  const baseScale = (0.92 + frame0Enter * 0.08) * (1 + portalInP * 6.8);

  // Horizontal directional blur strictly during the 2.5D whip-turn
  const whipVelocity =
    frame >= fWhipStart && frame <= fWhipEnd
      ? Math.sin(((frame - fWhipStart) / (fWhipEnd - fWhipStart)) * Math.PI)
      : 0;
  const stageBlurX = whipVelocity > 0.05 ? whipVelocity * 14 : 0;

  // ==========================================================================
  // 2. VISUAL ILLUSTRATION TIMELINES
  // ==========================================================================
  // Act II: Camera Lens focus lock + laser scan + Exploded Visual Card
  const lensFocusP = spring({
    frame: Math.max(0, frame - (fMorphEnd + sec(0.12, fps))),
    fps,
    config: SPRING_SNAPPY,
  });
  const laserScanP = interpolate(
    frame,
    [fMorphEnd + sec(0.18, fps), fExplode - sec(0.05, fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const explodeIn = spring({
    frame: Math.max(0, frame - fExplode),
    fps,
    config: SPRING_POP,
  });
  const explodeOut = interpolate(
    frame,
    [fWhipStart - sec(0.18, fps), fWhipStart + sec(0.08, fps)],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const explodedCardProgress = explodeIn * explodeOut;

  // Act III: Tactile Clock Dial Sweep (7:00 -> 8:00) & Topographic Route Map
  const clockEnter = spring({
    frame: Math.max(0, frame - (fWhipEnd - sec(0.06, fps))),
    fps,
    config: SPRING_SNAPPY,
  });
  const clockSweep = interpolate(
    frame,
    [fWhipEnd + sec(0.35, fps), fWhipEnd + sec(1.25, fps)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    }
  );
  const mapEnter = spring({
    frame: Math.max(0, frame - (fWhipEnd + sec(0.22, fps))),
    fps,
    config: SPRING_SNAPPY,
  });
  const mapRoute = interpolate(
    frame,
    [fWhipEnd + sec(0.75, fps), fWhipEnd + sec(1.95, fps)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    }
  );
  const widgetsExit = interpolate(
    frame,
    [fPortalStart - sec(0.1, fps), fPortalStart + sec(0.26, fps)],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Act IV: Portal Zoom-Through Finale
  const inFinale = frame >= fPortalCut;
  const finaleDecel = interpolate(
    frame,
    [fPortalCut, fPortalCut + sec(0.52, fps)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    }
  );

  // ==========================================================================
  // 3. BEAT-LOCKED STUDIO DSP FOLEY CUES
  // ==========================================================================
  const sfxCues: GeminiSfxCue[] = props.enableRealSfx
    ? [
        { frame: sec(0.08, fps), src: "sfx/pop-subtle.wav", volume: 0.24, playbackRate: 1.02 },
        { peakAtFrame: fMorphStart + sec(0.32, fps), peakOffsetSec: 0.32, src: "sfx/whoosh-deep.wav", volume: 0.28 },
        { frame: fMorphEnd, src: "sfx/sub-hit-soft.wav", volume: 0.28 },
        { frame: fMorphEnd + sec(0.25, fps), src: "sfx/key-01.wav", volume: 0.22, playbackRate: 1.04 },
        { frame: fExplode, src: "sfx/sub-hit-soft.wav", volume: 0.32 },
        { frame: fExplode + sec(0.04, fps), src: "sfx/pop-subtle.wav", volume: 0.28, playbackRate: 0.96 },
        { peakAtFrame: fWhipStart + sec(0.28, fps), peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.32 },
        { frame: fWhipEnd + sec(0.15, fps), src: "sfx/pop-subtle.wav", volume: 0.22, playbackRate: 0.98 },
        { frame: fWhipEnd + sec(1.22, fps), src: "sfx/click-02.wav", volume: 0.38 },
        { frame: fWhipEnd + sec(1.9, fps), src: "sfx/pop-subtle.wav", volume: 0.24, playbackRate: 1.05 },
        { peakAtFrame: fPortalCut, peakOffsetSec: 1.0, src: "sfx/riser-1s.wav", volume: 0.30 },
        { frame: fPortalCut, src: "sfx/sub-hit-heavy.wav", volume: 0.42, duckMusic: true },
        { frame: fPortalCut + sec(0.55, fps), src: "sfx/resolve-warm.wav", volume: 0.18 },
      ]
    : [];

  return (
    <AbsoluteFill style={{ backgroundColor: GEMINI_THEME.canvas, overflow: "hidden" }}>
      {!inFinale && (
        <AbsoluteFill>
          {/* Pure Seamless Studio Backdrop (Zero Skeleton Grid, Zero Watermark Text!) */}
          <GeminiSpatialBackdrop dark={false} />

          {/* ACT II MINIMAL 2-WORD KINETIC ACCENT (Left of 3D Phone — Zero Paragraphs!) */}
          {morphP > 0.45 && whipP < 0.55 && (
            <div
              style={{
                position: "absolute",
                left: 180,
                top: 410,
                opacity:
                  interpolate(morphP, [0.45, 0.92], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }) *
                  interpolate(whipP, [0, 0.4], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                transform: `translate3d(${-whipP * 180}px, 0, 0)`,
              }}
            >
              <MaskedWords
                startFrame={fMorphStart + sec(0.25, fps)}
                fontSize={104}
                words={[
                  { text: "See" },
                  { text: "live.", italic: true, color: GEMINI_THEME.accent },
                ]}
              />
            </div>
          )}

          {/* PERSISTENT THROUGH-LINE 2.5D OBJECT (Sonic Iris Capsule -> 3D Tilted Phone) */}
          <GeminiDirectionalBlur blurX={stageBlurX} blurY={0}>
            <PerspectivePhoneStage
              x={stageX}
              y={stageY}
              scale={baseScale}
              rotateX={rotateX}
              rotateY={rotateY}
              rotateZ={rotateZ}
              width={containerW}
              height={containerH}
              radius={containerRadius}
              darkScreen
              chromeProgress={morphP}
              explodedOverlay={
                <ExplodedVisualInsightCard popProgress={explodedCardProgress} />
              }
            >
              {/* A) ACT I CONTENT: Sculptural Sonic Iris & Equalizer (Zero Chat Bubbles!) */}
              {morphP < 0.65 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 28,
                    background:
                      "radial-gradient(circle at 50% 50%, #172554 0%, #0C1018 75%)",
                    opacity: interpolate(morphP, [0, 0.55], [1, 0], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  <LiveVoiceSpectrum
                    energy={1}
                    bars={10}
                    height={76}
                    accentColor="#60A5FA"
                    secondaryColor="#3B82F6"
                  />

                  {/* Sculptural 64-Vertex Morphing Vector Core (Circle -> Camera Aperture -> Gemini Star) */}
                  <div
                    style={{
                      width: 108,
                      height: 108,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `scale(${deform.scaleX}, ${deform.scaleY})`,
                      flexShrink: 0,
                    }}
                  >
                    <MorphingVectorShape
                      shapes={["circle-orb", "camera-aperture", "compass-diamond", "gemini-star"]}
                      progress={interpolate(frame, [0, fMorphStart], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })}
                      size={98}
                      fill="#1A73E8"
                      glowColor="rgba(59, 130, 246, 0.72)"
                      rotationDeg={frame * 1.3}
                    />
                  </div>

                  <LiveVoiceSpectrum
                    energy={1}
                    bars={10}
                    height={76}
                    accentColor="#60A5FA"
                    secondaryColor="#3B82F6"
                  />
                </div>
              )}

              {/* B) ACT II CONTENT: Rich Architectural Camera Viewfinder Illustration */}
              {morphP > 0.25 && whipP < 0.55 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity:
                      interpolate(morphP, [0.25, 0.75], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }) *
                      interpolate(whipP, [0.1, 0.5], [1, 0], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }),
                  }}
                >
                  <CameraLensViewfinderIllustration
                    focusProgress={lensFocusP}
                    scanBeamProgress={laserScanP}
                  />
                </div>
              )}

              {/* C) ACT III CONTENT: Sculptural Orbital Action Core (Zero Chat Thread Slop!) */}
              {whipP > 0.45 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at 50% 44%, #172554 0%, #0B0F19 72%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "28px 22px 36px",
                    opacity: interpolate(whipP, [0.45, 0.85], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  {/* Top Minimal Status Pill */}
                  <div
                    style={{
                      padding: "7px 16px",
                      borderRadius: 999,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      fontFamily: FONT_MONO,
                      fontSize: 12.5,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: mapRoute > 0.85 ? "#4ADE80" : "#93C5FD",
                    }}
                  >
                    {mapRoute > 0.85 ? "● SYNCED ✓" : "● LIVE SYNC"}
                  </div>

                  {/* Sculptural 3-Ring Rotating Orbital Constellation SVG */}
                  <div
                    style={{
                      position: "relative",
                      width: 320,
                      height: 320,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
                      <g transform={`translate(160, 160) rotate(${frame * 0.9})`}>
                        <circle
                          cx="0"
                          cy="0"
                          r="134"
                          stroke="rgba(96, 165, 250, 0.24)"
                          strokeWidth="2"
                          strokeDasharray="10 14"
                        />
                        <circle cx="0" cy="-134" r="8" fill="#60A5FA" />
                        <circle cx="116" cy="67" r="8" fill="#34D399" />
                        <circle cx="-116" cy="67" r="8" fill="#FBBF24" />
                      </g>
                      <g transform={`translate(160, 160) rotate(${-frame * 1.3})`}>
                        <circle
                          cx="0"
                          cy="0"
                          r="92"
                          stroke="rgba(147, 197, 253, 0.38)"
                          strokeWidth="2.5"
                          strokeDasharray="36 18"
                        />
                      </g>
                    </svg>

                    {/* Center Portal Core (Camera Dives Inside This in Act IV!) */}
                    <div
                      style={{
                        position: "absolute",
                        width: 104,
                        height: 104,
                        borderRadius: 34,
                        background:
                          "linear-gradient(145deg, #3B82F6 0%, #1A73E8 60%, #1D4ED8 100%)",
                        boxShadow: "0 0 54px rgba(37, 99, 235, 0.75)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <GeminiStarMark size={54} color="#FFFFFF" />
                    </div>
                  </div>

                  {/* Bottom Harmonic Equalizer */}
                  <LiveVoiceSpectrum
                    energy={0.85}
                    bars={18}
                    height={46}
                    accentColor="#60A5FA"
                    secondaryColor="#3B82F6"
                  />
                </div>
              )}
            </PerspectivePhoneStage>
          </GeminiDirectionalBlur>

          {/* ACT III PURE VISUAL WIDGETS: Sweeping Clock Dial + Topographic Route Map */}
          {whipP > 0.65 && (
            <div
              style={{
                position: "absolute",
                left: 880,
                top: 265,
                display: "flex",
                 gap: 28,
                opacity: widgetsExit,
                transform: `scale(${0.92 + widgetsExit * 0.08})`,
              }}
            >
              <TactileClockDialWidget
                enterProgress={clockEnter}
                sweepProgress={clockSweep}
              />
              <TactileRouteMapWidget
                enterProgress={mapEnter}
                routeProgress={mapRoute}
              />
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ====================================================================
          ACT IV: PORTAL ZOOM-THROUGH MATCH CUT -> LIVING 3D GLASS FINALE
         ==================================================================== */}
      {inFinale && (
        <AbsoluteFill>
          <GeminiSpatialBackdrop dark={false} />

          <div
            style={{
              position: "absolute",
              inset: 0,
              perspective: 1400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${0.86 + finaleDecel * 0.14})`,
            }}
          >
            {/* Living 3D Glass Emblem (Continuously Orbits ±6° with Traveling Specular Sheen!) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                marginBottom: 28,
                transformStyle: "preserve-3d",
                transform: `rotateX(${floatPitch * 2.2}deg) rotateY(${floatYaw * 2.6}deg)`,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 112,
                  height: 112,
                  borderRadius: 34,
                  background:
                    "linear-gradient(145deg, #2B84FF 0%, #1A73E8 55%, #1251A8 100%)",
                  boxShadow:
                    "0 28px 64px rgba(26, 115, 232, 0.35), inset 0 2px 2px rgba(255,255,255,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <GeminiStarMark size={62} color="#FFFFFF" />
                <div
                  style={{
                    position: "absolute",
                    top: "-40%",
                    bottom: "-40%",
                    width: 54,
                    left: "50%",
                    transform: `translate3d(${floatYaw * 18}px, 0, 0) rotate(25deg)`,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
                  }}
                />
              </div>

              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 124,
                  fontWeight: 800,
                  letterSpacing: "-0.052em",
                  lineHeight: 0.98,
                  color: GEMINI_THEME.ink,
                }}
              >
                {props.brandName}
              </span>
            </div>

            {/* 3-Word Kinetic Punch Only (Zero Paragraph!) */}
            <MaskedWords
              startFrame={fPortalCut + sec(0.06, fps)}
              align="center"
              fontSize={58}
              words={[
                { text: "See." },
                { text: "Speak.", italic: true, color: GEMINI_THEME.accent },
                { text: "Done." },
              ]}
            />

            {/* Minimal URL Pill */}
            <div
              style={{
                marginTop: 42,
                padding: "18px 42px",
                borderRadius: 999,
                backgroundColor: GEMINI_THEME.ink,
                color: "#FFFFFF",
                boxShadow: GEMINI_THEME.shadowCard,
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <GeminiStarMark size={20} color="#60A5FA" />
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                }}
              >
                {props.ctaUrl}
              </span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Subtle 128x128 Tiled Film Grain */}
      <GeminiFilmGrain frame={frame} fps={fps} opacity={0.018} />

      {/* 128 BPM Studio DSP Audio Layer */}
      {(props.musicTrack || sfxCues.length > 0) && (
        <GeminiSoundTrackLayer
          musicTrack={props.musicTrack}
          musicVolume={props.musicVolume}
          musicStartFromSec={props.musicStartFromSec}
          cues={sfxCues}
        />
      )}
    </AbsoluteFill>
  );
};
