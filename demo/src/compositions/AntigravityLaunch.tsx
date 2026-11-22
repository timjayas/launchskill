/**
 * Antigravity — AI Coding Platform Launch Video (24s / 48 beats @ 120 BPM, 100% FPS-agnostic)
 *
 * Bespoke Light-Gallery Brand System:
 *   1. Surface Polarity:   Pure Light Gallery (#FFFFFF / #F7F7F5 / #F5F7FA) for 100% weightless clarity
 *   2. Primary Accent:     Aerospace Cobalt (#2563EB) + Sky (#0EA5E9) highlight (zero cloned defaults)
 *   3. Corner Geometry:    Architectural crisp (10–18px radius)
 *   4. Typography:         Inter (400–800) + italic Instrument Serif editorial accents + JetBrains Mono
 *   5. Motion Temperament: tactile-snappy / taut-mechanical hybrid with true directional motion blur
 *
 * 6-Shot Creative Beat-Grid Blueprint (48 beats @ 120 BPM = 24.0s = 720f @ 30fps):
 *   1. Beats  0 ->  6 (3.0s): Frame-0 Light-Gallery Editorial Hook + Weightless Orbital Code Burst
 *   2. Beats  6 -> 14 (4.0s): Frosted Light Command Bar -> 2.22x Macro Typing -> Cursor Click -> Whip-Pan
 *   3. Beats 14 -> 24 (5.0s): Accelerating Vertical Capability Slot-Drum -> Wired 3-Node Spatial Dataflow
 *   4. Beats 24 -> 34 (5.0s): Crisp Light-Mode IDE Multi-File Diff + Macro Camera Rig + Live Vitest Pass
 *   5. Beats 34 -> 41 (3.5s): Parallel Multi-Agent Freeform Canvas Spawning 4 Mini Artifacts -> White Bloom
 *   6. Beats 41 -> 48 (3.5s): Pure Light-Gallery Brand Lockup + Calm 2.75s CTA URL Hold (Clean Loop)
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import {
  ANTIGRAVITY_THEME,
  SoundTrackLayer,
  TiledFilmGrainOverlay,
  type SfxCue,
} from "../components/AntigravityPrimitives";
import { createBeatGrid, ensureStudioFontsRaceFree, sec } from "../lib/studioMotion";
import { AntigravityFinaleScene } from "../scenes/antigravity/AntigravityFinaleScene";
import { AntigravityHookScene } from "../scenes/antigravity/AntigravityHookScene";
import { AntigravityIdeDiffScene } from "../scenes/antigravity/AntigravityIdeDiffScene";
import { AntigravityMacroPromptScene } from "../scenes/antigravity/AntigravityMacroPromptScene";
import { AntigravitySpatialPipelineScene } from "../scenes/antigravity/AntigravitySpatialPipelineScene";
import { AntigravitySwarmScene } from "../scenes/antigravity/AntigravitySwarmScene";

export const antigravityLaunchSchema = z.object({
  brandName: z.string(),
  badgeText: z.string(),
  hookLine1: z.string(),
  hookLine2: z.string(),
  subline: z.string(),
  repoChip: z.string(),
  modeChip: z.string(),
  promptText: z.string(),
  slotCapabilities: z.array(z.string()).length(6),
  thesisLine1: z.string(),
  thesisLine2: z.string(),
  agentRoles: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  positioningLine: z.string(),
  ctaButtonText: z.string(),
  ctaUrl: z.string(),
  accentColor: z.string(),
  skyColor: z.string(),
  bpm: z.number().min(100).max(140),
  enableSfx: z.boolean(),
  musicTrack: z.string().optional(),
});

export type AntigravityLaunchProps = z.infer<typeof antigravityLaunchSchema>;

export const defaultAntigravityLaunchProps: AntigravityLaunchProps = {
  brandName: "Antigravity",
  badgeText: "AI CODING PLATFORM",
  hookLine1: "Code without",
  hookLine2: "gravity.",
  subline: "Autonomous engineering agents that plan, edit, and verify across your entire codebase.",
  repoChip: "@acme/payments",
  modeChip: "Autonomous · Multi-File",
  promptText: "Add Stripe webhooks with retry queue & tests",
  slotCapabilities: [
    "Index Codebase",
    "Synthesize Diff",
    "Verify Sandbox",
    "Browser QA",
    "Zero Lint Errors",
    "Ship Production PR",
  ],
  thesisLine1: "Ship entire features.",
  thesisLine2: "In parallel.",
  agentRoles: ["Architect", "Coder", "Test Runner", "Browser QA"],
  positioningLine: "The agentic AI coding platform built for effortless shipping.",
  ctaButtonText: "Download Free",
  ctaUrl: "antigravity.dev",
  accentColor: ANTIGRAVITY_THEME.accent,
  skyColor: ANTIGRAVITY_THEME.accentSky,
  bpm: 120,
  enableSfx: true,
};

export const ANTIGRAVITY_BEAT_CUTS = {
  shot2: 6,
  shot3: 14,
  shot4: 24,
  shot5: 34,
  shot6: 41,
  total: 48,
} as const;

export const getAntigravityTotalFrames = (bpm: number, fps: number): number => {
  const g = createBeatGrid(bpm, fps);
  return g.beat(ANTIGRAVITY_BEAT_CUTS.total); // 720 frames @ 30fps, 120 BPM (24.0s)
};

export const AntigravityLaunch: React.FC<AntigravityLaunchProps> = (props) => {
  ensureStudioFontsRaceFree();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const g = createBeatGrid(props.bpm, fps);
  const s1Start = 0;
  const s2Start = g.beat(ANTIGRAVITY_BEAT_CUTS.shot2); // 90f  (3.0s)
  const s3Start = g.beat(ANTIGRAVITY_BEAT_CUTS.shot3); // 210f (7.0s)
  const s4Start = g.beat(ANTIGRAVITY_BEAT_CUTS.shot4); // 360f (12.0s)
  const s5Start = g.beat(ANTIGRAVITY_BEAT_CUTS.shot5); // 510f (17.0s)
  const s6Start = g.beat(ANTIGRAVITY_BEAT_CUTS.shot6); // 615f (20.5s)
  const total = g.beat(ANTIGRAVITY_BEAT_CUTS.total);   // 720f (24.0s)

  const sfxCues: SfxCue[] = props.enableSfx
    ? [
        // Shot 2 cut + macro typing ticks + Run Agent click + whip-pan whoosh
        { frame: s2Start, src: "sfx/antigravity/cut-hit.wav", volume: 0.34 },
        { frame: s2Start + sec(0.65, fps), src: "sfx/antigravity/key-tick.wav", volume: 0.16 },
        { frame: s2Start + sec(0.95, fps), src: "sfx/antigravity/key-tick.wav", volume: 0.16 },
        { frame: s2Start + sec(1.3, fps), src: "sfx/antigravity/key-tick.wav", volume: 0.16 },
        { frame: s2Start + sec(1.65, fps), src: "sfx/antigravity/key-tick.wav", volume: 0.16 },
        { frame: s2Start + sec(2.0, fps), src: "sfx/antigravity/key-tick.wav", volume: 0.16 },
        { frame: s2Start + sec(3.06, fps), src: "sfx/antigravity/click.wav", volume: 0.44 },
        { frame: s3Start - sec(0.16, fps), src: "sfx/antigravity/whoosh.wav", volume: 0.24 },

        // Shot 3 slot drum detents + mid whip-pan into wired 3-node pipeline + verified pop
        { frame: s3Start + sec(0.54, fps), src: "sfx/antigravity/key-tick.wav", volume: 0.22 },
        { frame: s3Start + sec(1.14, fps), src: "sfx/antigravity/key-tick.wav", volume: 0.22 },
        { frame: s3Start + sec(2.22, fps), src: "sfx/antigravity/whoosh.wav", volume: 0.24 },
        { frame: s3Start + sec(3.85, fps), src: "sfx/antigravity/click.wav", volume: 0.38 },

        // Shot 4 Light IDE cut + macro camera push whoosh + test pass pop
        { frame: s4Start, src: "sfx/antigravity/cut-hit.wav", volume: 0.36 },
        { frame: s4Start + sec(0.82, fps), src: "sfx/antigravity/whoosh.wav", volume: 0.22 },
        { frame: s4Start + sec(2.15, fps), src: "sfx/antigravity/click.wav", volume: 0.38 },

        // Shot 5 Parallel Swarm cut + convergence whoosh
        { frame: s5Start, src: "sfx/antigravity/cut-hit.wav", volume: 0.36 },
        { frame: s6Start - sec(0.28, fps), src: "sfx/antigravity/whoosh.wav", volume: 0.25 },

        // Shot 6 Light-Gallery Finale harmonic resolve
        { frame: s6Start + sec(0.08, fps), src: "sfx/antigravity/chime.wav", volume: 0.34 },
      ]
    : [];

  return (
    <AbsoluteFill style={{ backgroundColor: ANTIGRAVITY_THEME.bg, overflow: "hidden" }}>
      {/* Shot 1: Light-Gallery Hook + Radial Orbital Code Burst */}
      <Sequence from={s1Start} durationInFrames={s2Start - s1Start}>
        <AntigravityHookScene
          brandName={props.brandName}
          badgeText={props.badgeText}
          hookLine1={props.hookLine1}
          hookLine2={props.hookLine2}
          subline={props.subline}
          accentColor={props.accentColor}
          skyColor={props.skyColor}
        />
      </Sequence>

      {/* Shot 2: Light Command Bar -> 2.22x Macro Typing -> Cursor Click -> Whip-Pan */}
      <Sequence from={s2Start} durationInFrames={s3Start - s2Start}>
        <AntigravityMacroPromptScene
          repoChip={props.repoChip}
          modeChip={props.modeChip}
          promptText={props.promptText}
          accentColor={props.accentColor}
          skyColor={props.skyColor}
        />
      </Sequence>

      {/* Shot 3: Accelerating Vertical Capability Slot-Drum -> Wired 3-Node Spatial Dataflow */}
      <Sequence from={s3Start} durationInFrames={s4Start - s3Start}>
        <AntigravitySpatialPipelineScene
          repoChip={props.repoChip}
          promptText={props.promptText}
          slotCapabilities={props.slotCapabilities}
          accentColor={props.accentColor}
          skyColor={props.skyColor}
        />
      </Sequence>

      {/* Shot 4: Light-Mode Orthogonal IDE Multi-File Diff + Macro Camera Rig + Live Vitest Pass */}
      <Sequence from={s4Start} durationInFrames={s5Start - s4Start}>
        <AntigravityIdeDiffScene
          repoChip={props.repoChip}
          accentColor={props.accentColor}
          skyColor={props.skyColor}
        />
      </Sequence>

      {/* Shot 5: Parallel Multi-Agent Freeform Canvas Spawning 4 Live Mini Artifacts -> White Bloom */}
      <Sequence from={s5Start} durationInFrames={s6Start - s5Start}>
        <AntigravitySwarmScene
          thesisLine1={props.thesisLine1}
          thesisLine2={props.thesisLine2}
          agentRoles={props.agentRoles}
          accentColor={props.accentColor}
          skyColor={props.skyColor}
        />
      </Sequence>

      {/* Shot 6: Pure Light-Gallery Brand Lockup + Calm CTA URL Hold */}
      <Sequence from={s6Start} durationInFrames={total - s6Start}>
        <AntigravityFinaleScene
          brandName={props.brandName}
          positioningLine={props.positioningLine}
          ctaButtonText={props.ctaButtonText}
          ctaUrl={props.ctaUrl}
          accentColor={props.accentColor}
          skyColor={props.skyColor}
        />
      </Sequence>

      {/* Beat-Locked Procedural SFX Layer */}
      <SoundTrackLayer musicTrack={props.musicTrack} cues={sfxCues} />

      {/* High-Speed 128x128 Tiled Deterministic Film Grain */}
      <TiledFilmGrainOverlay frame={frame} fps={fps} opacity={0.02} />
    </AbsoluteFill>
  );
};
