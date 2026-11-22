/**
 * Motionfly MCP — Archetype 3: Chat-to-Cinema / Agentic Demo (28s / 840 frames @ 30fps, 120 BPM)
 * Composes all 4 modular Archetype 3 scenes:
 *   1. LegacyStackDockScene         (180f / 6.0s): Frame-0 hook + legacy editor replacement dock -> iris
 *   2. AgentExecutionTreeScene      (240f / 8.0s): Style-chip prompt + macro click -> 5-step MCP pipeline tree
 *   3. TimelineAssemblyRevealScene  (210f / 7.0s): Meta film-in-film live app preview + multi-track timeline
 *   4. MultiplayerCursorSwarmScene  (210f / 7.0s): 4-agent cursor swarm + caret thesis -> fast mark reflow CTA
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { z } from "zod";
import { FilmGrainOverlay } from "../components/StudioPrimitives";
import { ensureStudioFonts } from "../lib/motion";
import { AgentExecutionTreeScene } from "../scenes/AgentExecutionTreeScene";
import { LegacyStackDockScene } from "../scenes/LegacyStackDockScene";
import { MultiplayerCursorSwarmScene } from "../scenes/MultiplayerCursorSwarmScene";
import { TimelineAssemblyRevealScene } from "../scenes/TimelineAssemblyRevealScene";

export const motionflyAgenticSchema = z.object({
  brandWordmark: z.string(),
  hookLine1: z.string(),
  hookLine2: z.string(),
  promptHeader: z.string(),
  styleChipLabel: z.string(),
  promptText: z.string(),
  agentSteps: z.array(z.string()).length(5),
  previewAppName: z.string(),
  previewHeadline: z.string(),
  previewHabits: z.array(z.string()).length(3),
  thesisLine1: z.string(),
  thesisLine2: z.string(),
  agentRoles: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  ctaButtonText: z.string(),
  ctaUrl: z.string(),
  accentColor: z.string(),
  tealColor: z.string(),
  bpm: z.number().min(100).max(144),
});

export type MotionflyAgenticProps = z.infer<typeof motionflyAgenticSchema>;

export const defaultMotionflyAgenticProps: MotionflyAgenticProps = {
  brandWordmark: "Motionfly",
  hookLine1: "One prompt.",
  hookLine2: "Full launch video.",
  promptHeader: "Prompt a Video",
  styleChipLabel: "Style · Product launch",
  promptText: "A 30-second launch video for my habit app, upbeat & modern",
  agentSteps: [
    "Writing the launch script",
    "Building 3D device stage",
    "Animating kinetic typography",
    "Synthesizing studio voiceover",
    "Mixing 120 BPM music & SFX",
  ],
  previewAppName: "HabitFlow",
  previewHeadline: "Build better habits",
  previewHabits: ["Drink 2L water", "Morning 5K run", "Deep work · 90m"],
  thesisLine1: "Studio launch films.",
  thesisLine2: "In minutes, not weeks.",
  agentRoles: ["Script", "3D Stage", "Voice", "Audio Mix"],
  ctaButtonText: "Get Started Free",
  ctaUrl: "motionfly.co",
  accentColor: "#7C3AED",
  tealColor: "#0D9488",
  bpm: 120,
};

export const MOTIONFLY_SCENE_DURATIONS = {
  dock: 180,
  tree: 240,
  timeline: 210,
  swarm: 210,
} as const;

export const getMotionflyAgenticTotalFrames = (): number =>
  MOTIONFLY_SCENE_DURATIONS.dock +
  MOTIONFLY_SCENE_DURATIONS.tree +
  MOTIONFLY_SCENE_DURATIONS.timeline +
  MOTIONFLY_SCENE_DURATIONS.swarm; // 840 frames = 28.0s @ 30fps

export const MotionflyAgenticLaunch: React.FC<MotionflyAgenticProps> = (props) => {
  ensureStudioFonts();
  const frame = useCurrentFrame();

  const d1 = MOTIONFLY_SCENE_DURATIONS.dock;
  const d2 = MOTIONFLY_SCENE_DURATIONS.tree;
  const d3 = MOTIONFLY_SCENE_DURATIONS.timeline;
  const d4 = MOTIONFLY_SCENE_DURATIONS.swarm;

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={d1}>
        <LegacyStackDockScene
          hookLine1={props.hookLine1}
          hookLine2={props.hookLine2}
          brandWordmark={props.brandWordmark}
          accentColor={props.accentColor}
        />
      </Sequence>

      <Sequence from={d1} durationInFrames={d2}>
        <AgentExecutionTreeScene
          promptHeader={props.promptHeader}
          styleChipLabel={props.styleChipLabel}
          promptText={props.promptText}
          agentSteps={props.agentSteps}
          accentColor={props.accentColor}
          tealColor={props.tealColor}
        />
      </Sequence>

      <Sequence from={d1 + d2} durationInFrames={d3}>
        <TimelineAssemblyRevealScene
          previewAppName={props.previewAppName}
          previewHeadline={props.previewHeadline}
          previewHabits={props.previewHabits}
          accentColor={props.accentColor}
          tealColor={props.tealColor}
        />
      </Sequence>

      <Sequence from={d1 + d2 + d3} durationInFrames={d4}>
        <MultiplayerCursorSwarmScene
          thesisLine1={props.thesisLine1}
          thesisLine2={props.thesisLine2}
          agentRoles={props.agentRoles}
          brandWordmark={props.brandWordmark}
          ctaButtonText={props.ctaButtonText}
          ctaUrl={props.ctaUrl}
          accentColor={props.accentColor}
        />
      </Sequence>

      {/* Deterministic anti-banding film grain across every frame */}
      <FilmGrainOverlay frame={frame} opacity={0.022} />
    </AbsoluteFill>
  );
};
