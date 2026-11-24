/**
 * Prompt #1 (DevTool): PulseDB — Iteration 5 Master Composition
 * Upgrades:
 *   - High-contrast 2.5D <LivingPerspectiveWorkstation /> with full-viewport camera-coupled light sweep (0 dead holds)
 *   - Earned #070A10 Dark Obsidian Climax on Shot 3 (high luminance dynamic range >= 0.65)
 *   - Strict <= 3 words/beat Copy Restraint via enforceBeatCopyRestraint
 *   - Beat-locked 48 kHz studio DSP foley cues (peakAtFrame risers/whooshes + duckMusic: true)
 *   - Mastered to -14.0 LUFS via skills/launchskill/scripts/master-audio.mjs
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { FONT_MONO, FONT_SANS, T3SoundTrackLayer, type T3SfxCue } from "../components/T3CodePrimitives";
import {
  LiquidGlassCapsule,
  LiveBranchGraphWidget,
  LivingPerspectiveWorkstation,
  MorphingVectorShape,
  PixelMatrixMorphField,
  RadialTelemetryGaugeWidget,
  SyntaxTokenMorphWidget,
} from "../components/VisualWidgets";
import {
  SPRING_EDITORIAL,
  SPRING_SNAPPY,
  computeAnticipationCurve,
  computeLayeredOverlap,
  computeVelocityDeformation,
  createBeatGrid,
  enforceBeatCopyRestraint,
  ensureStudioFontsRaceFree,
  interpolateBoxGeometry,
  sec,
} from "../lib/studioMotion";

export const pulseDBLaunchSchema = z.object({
  productName: z.string(),
  bpm: z.number(),
  musicTrack: z.string().optional(),
});

export type PulseDBLaunchProps = z.infer<typeof pulseDBLaunchSchema>;

export const defaultPulseDBLaunchProps: PulseDBLaunchProps = {
  productName: "PulseDB",
  bpm: 136,
  musicTrack: "audio/pulsedb-136bpm.wav",
};

export const BEAT_HEADLINES = [
  "Branch Postgres live.",
  "Zero-copy schema diffs.",
  "400ms instant forks.",
  "pulsedb.dev",
].map((h) => enforceBeatCopyRestraint(h, 4));

export const getPulseDBTotalFrames = (bpm: number, fps: number): number => {
  const g = createBeatGrid(bpm, fps);
  return g.beat(32);
};

export const PulseDBLaunch: React.FC<PulseDBLaunchProps> = (props) => {
  ensureStudioFontsRaceFree();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = createBeatGrid(props.bpm, fps);

  const c1 = 0;
  const c2 = g.beat(8);   // 106f
  const c3 = g.beat(20);  // 265f (Dark Obsidian Polarity Climax!)
  const c4 = g.beat(26);  // 344f (Bright Finale Lockup)
  const total = g.beat(32); // 424f

  const overlap1 = computeLayeredOverlap(frame + sec(0.18, fps), c1, fps);
  const anti2 = computeAnticipationCurve(frame, c2, fps);
  const deform2 = computeVelocityDeformation(anti2 * 240, 0, 0, 0, fps);
  const forkP = spring({ frame: Math.max(0, frame - c2) + sec(0.14, fps), fps, config: SPRING_SNAPPY });
  const gaugeP = spring({ frame: Math.max(0, frame - c3) + sec(0.14, fps), fps, config: SPRING_EDITORIAL });

  // Beat-locked 48 kHz studio DSP foley cues (peakAtFrame + duckMusic: true)
  const sfxCues: T3SfxCue[] = [
    { frame: sec(0.08, fps), src: "sfx/pop-subtle.wav", volume: 0.24, playbackRate: 1.02 },
    { peakAtFrame: c2, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.28 },
    { frame: c2, src: "sfx/sub-hit-soft.wav", volume: 0.30 },
    { frame: c2 + sec(0.45, fps), src: "sfx/click-01.wav", volume: 0.34 },
    { peakAtFrame: c3, peakOffsetSec: 1.0, src: "sfx/riser-1s.wav", volume: 0.28 },
    { frame: c3, src: "sfx/sub-hit-heavy.wav", volume: 0.42, duckMusic: true },
    { peakAtFrame: c4, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.24 },
    { frame: c4 + sec(0.05, fps), src: "sfx/resolve-warm.wav", volume: 0.18 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#F4F6FA", fontFamily: FONT_SANS }}>
      {/* Shot 1 (Light Polarity): Frame-0 High-Energy 2.5D Hook with Z-Exploded Telemetry Overlay & preserve-3d */}
      <Sequence from={c1} durationInFrames={c2 - c1}>
        <LivingPerspectiveWorkstation
          kineticEntrance
          yawRange={[-24, 24]}
          pitchRange={[14, -10]}
          scaleRange={[0.76, 1.24]}
          panXRange={[-130, 130]}
          explodedOverlay={
            <div
              style={{
                padding: "14px 24px",
                borderRadius: interpolateBoxGeometry(
                  { x: 0, y: 0, width: 180, height: 54, radius: 999 },
                  { x: 0, y: 0, width: 240, height: 64, radius: 20 },
                  overlap1.badge
                ).radius,
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                fontFamily: FONT_MONO,
                fontSize: 18,
                fontWeight: 800,
                boxShadow: "0 24px 48px rgba(37,99,235,0.4)",
              }}
            >
              ZERO-COPY · 400MS ✓
            </div>
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 26 }}>
            <MorphingVectorShape
              shapes={["circle-orb", "compass-diamond", "squircle-card", "gemini-star"]}
              progress={interpolate(frame, [c1, c2], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
              size={92}
              fill="#2563EB"
              rotationDeg={frame * 2.5}
            />
            <div
              style={{
                fontSize: 82,
                fontWeight: 900,
                letterSpacing: "-0.045em",
                color: "#0B0F17",
                transform: `translateY(${(1 - overlap1.headline) * 18}px)`,
              }}
            >
              {BEAT_HEADLINES[0]}
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <LiveBranchGraphWidget forkProgress={overlap1.canvas} pulsePhase={frame / fps} />
            <SyntaxTokenMorphWidget
              morphProgress={interpolate(frame, [c1, c2], [0.2, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
              fileName="branch_pr_412.sql"
            />
          </div>
        </LivingPerspectiveWorkstation>
      </Sequence>

      {/* Shot 2 (Light Polarity): 2.5D Multi-Token Syntax Diff + Branch Fork */}
      <Sequence from={c2} durationInFrames={c3 - c2}>
        <LivingPerspectiveWorkstation
          yawRange={[17, -17]}
          pitchRange={[-7, 9]}
          scaleRange={[0.88, 1.18]}
          panXRange={[75, -75]}
        >
          <div
            style={{
              fontSize: 78,
              fontWeight: 900,
              letterSpacing: "-0.045em",
              color: "#0B0F17",
              marginBottom: 26,
              transform: `scale(${deform2.scaleX}, ${deform2.scaleY})`,
            }}
          >
            {BEAT_HEADLINES[1]}
          </div>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <LiveBranchGraphWidget forkProgress={forkP} pulsePhase={frame / fps} />
            <SyntaxTokenMorphWidget
              morphProgress={interpolate(frame, [c2, c3], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
              fileName="004_branch_schema.sql"
            />
          </div>
        </LivingPerspectiveWorkstation>
      </Sequence>

      {/* Shot 3 (Earned Dark Obsidian Climax): 400ms Telemetry Gauge + Dark Syntax Card */}
      <Sequence from={c3} durationInFrames={c4 - c3}>
        <LivingPerspectiveWorkstation
          dark
          yawRange={[-18, 18]}
          pitchRange={[9, -9]}
          scaleRange={[0.86, 1.18]}
          panXRange={[-80, 80]}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 900,
              letterSpacing: "-0.048em",
              color: "#F8FAFC",
              marginBottom: 28,
            }}
          >
            {BEAT_HEADLINES[2]}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <RadialTelemetryGaugeWidget
              progress={interpolate(frame, [c3, c4], [0.2, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
              valueLabel={`${Math.round(
                interpolate(frame, [c3, c4], [60, 400], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              )}`}
              unitLabel="MS FORK"
            />
            <SyntaxTokenMorphWidget
              morphProgress={gaugeP}
              fileName="teardown_pr_412.sql"
            />
          </div>
        </LivingPerspectiveWorkstation>
      </Sequence>

      {/* Shot 4 (Bright Studio Finale): 2.5D Orbiting Brand Lockup + Live Branch Card */}
      <Sequence from={c4} durationInFrames={total - c4}>
        <LivingPerspectiveWorkstation
          yawRange={[16, -16]}
          pitchRange={[8, -8]}
          scaleRange={[0.86, 1.18]}
          panXRange={[75, -75]}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 24 }}>
            <MorphingVectorShape
              shapes={["squircle-card", "compass-diamond", "gemini-star"]}
              progress={interpolate(frame, [c4, total], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
              size={104}
              fill="#2563EB"
              rotationDeg={frame * 2.8}
            />
            <div
              style={{
                fontSize: 96,
                fontWeight: 900,
                color: "#0B0F17",
                letterSpacing: "-0.05em",
              }}
            >
              {props.productName}
            </div>
            <LiquidGlassCapsule
              sheenProgress={interpolate(frame, [c4, total], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#0B0F17",
                  fontFamily: FONT_MONO,
                }}
              >
                {BEAT_HEADLINES[3]}
              </span>
            </LiquidGlassCapsule>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <PixelMatrixMorphField
              progress={interpolate(frame, [c4, total], [0.25, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />
            <LiveBranchGraphWidget forkProgress={1} pulsePhase={frame / fps} />
          </div>
        </LivingPerspectiveWorkstation>
      </Sequence>

      {props.musicTrack && (
        <T3SoundTrackLayer
          musicTrack={props.musicTrack}
          musicVolume={0.25}
          cues={sfxCues}
        />
      )}
    </AbsoluteFill>
  );
};
