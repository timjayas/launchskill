import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { z } from "zod";
import launchConfigJson from "../../launch.config.json";
import { FilmGrainOverlay } from "../components/StudioPrimitives";
import { ensureStudioFonts } from "../lib/motion";
import { AgentExecutionTreeScene } from "../scenes/AgentExecutionTreeScene";
import { BrandKitRadialBloomScene } from "../scenes/BrandKitRadialBloomScene";
import { CardToChipDockScene } from "../scenes/CardToChipDockScene";
import { InlineLogoSlotHeadlineScene } from "../scenes/InlineLogoSlotHeadlineScene";
import { LegacyStackDockScene } from "../scenes/LegacyStackDockScene";
import { MacroPromptStrobeScene } from "../scenes/MacroPromptStrobeScene";
import { MultiArtboardAdGridScene } from "../scenes/MultiArtboardAdGridScene";
import { MultiplayerCursorSwarmScene } from "../scenes/MultiplayerCursorSwarmScene";
import { ReferenceAdTransmuteScene } from "../scenes/ReferenceAdTransmuteScene";
import { StaticToMotionAdZoomScene } from "../scenes/StaticToMotionAdZoomScene";
import { TimelineAssemblyRevealScene } from "../scenes/TimelineAssemblyRevealScene";
import { ZScatterThemeFlipScene } from "../scenes/ZScatterThemeFlipScene";
import {
  defaultHeraAdCanvasProps,
  getHeraAdCanvasTotalFrames,
  HeraAdCanvasLaunch,
} from "./HeraAdCanvasLaunch";
import {
  defaultKineticStudioProps,
  getKineticStudioTotalFrames,
  KineticStudioLaunch,
} from "./KineticStudioLaunch";
import {
  defaultMotionflyAgenticProps,
  getMotionflyAgenticTotalFrames,
  MotionflyAgenticLaunch,
} from "./MotionflyAgenticLaunch";

export const sceneIdSchema = z.enum([
  "macro-prompt-strobe",
  "card-to-chip-dock",
  "z-scatter-theme-flip",
  "inline-logo-slot-headline",
  "legacy-stack-dock",
  "agent-execution-tree",
  "timeline-assembly-reveal",
  "multiplayer-cursor-swarm",
  "multi-artboard-ad-grid",
  "brand-kit-radial-bloom",
  "reference-ad-transmute",
  "static-to-motion-ad-zoom",
]);

export type SceneId = z.infer<typeof sceneIdSchema>;

export const SCENE_DURATIONS: Record<SceneId, number> = {
  "macro-prompt-strobe": 186,       // 6.2s @ 30fps
  "card-to-chip-dock": 162,         // 5.4s @ 30fps
  "z-scatter-theme-flip": 288,      // 9.6s @ 30fps
  "inline-logo-slot-headline": 204, // 6.8s @ 30fps
  "legacy-stack-dock": 180,         // 6.0s @ 30fps (Archetype 3)
  "agent-execution-tree": 240,      // 8.0s @ 30fps (Archetype 3)
  "timeline-assembly-reveal": 210,  // 7.0s @ 30fps (Archetype 3)
  "multiplayer-cursor-swarm": 210,  // 7.0s @ 30fps (Archetype 3)
  "multi-artboard-ad-grid": 330,    // 11.0s @ 30fps (Archetype 4)
  "brand-kit-radial-bloom": 240,    // 8.0s @ 30fps (Archetype 4)
  "reference-ad-transmute": 240,    // 8.0s @ 30fps (Archetype 4)
  "static-to-motion-ad-zoom": 450,  // 15.0s @ 30fps (Archetype 4)
};

export const rebrandEditorialSchema = z.object({
  preset: z.enum(["rebrand-editorial", "fuser", "motionfly-agentic", "hera-ad-canvas", "blend"]),
  bpm: z.number().min(100).max(160),
  brandTitle: z.string(),
  brandWordmark: z.string(),
  mcpBadge: z.string(),
  ctaUrl: z.string(),
  submitBlue: z.string(),
  accentColor: z.string(),
  promptText: z.string(),
  searchStatus: z.string(),
  libraryCountLabel: z.string(),
  followUpPrompt: z.string(),
  pivotPrompt: z.string(),
  synthesisPrompt: z.string(),
  headlineLine1: z.string(),
  headlineLine2Prefix: z.string(),
  headlineLine2Suffix: z.string(),
  scenes: z.array(sceneIdSchema).min(1),
});

export type RebrandEditorialProps = z.infer<typeof rebrandEditorialSchema>;

export const defaultRebrandEditorialProps: RebrandEditorialProps =
  rebrandEditorialSchema.parse(launchConfigJson);

export const getConfigurableLaunchTotalFrames = (
  props: RebrandEditorialProps,
  fps: number
): number => {
  if (props.preset === "fuser") {
    return getKineticStudioTotalFrames(props.bpm, fps);
  }
  if (props.preset === "motionfly-agentic") {
    return getMotionflyAgenticTotalFrames();
  }
  if (props.preset === "hera-ad-canvas") {
    return getHeraAdCanvasTotalFrames();
  }
  const activeScenes: SceneId[] =
    props.preset === "rebrand-editorial"
      ? [
          "macro-prompt-strobe",
          "card-to-chip-dock",
          "z-scatter-theme-flip",
          "inline-logo-slot-headline",
        ]
      : props.scenes;
  return activeScenes.reduce((sum, id) => sum + SCENE_DURATIONS[id], 0);
};

export const RebrandEditorialLaunch: React.FC<RebrandEditorialProps> = (props) => {
  ensureStudioFonts();
  const frame = useCurrentFrame();

  // One-switch toggle to Archetype 1 (Fuser Spatial Creative Tool) via launch.config.json!
  if (props.preset === "fuser") {
    return (
      <KineticStudioLaunch
        {...defaultKineticStudioProps}
        productName={props.brandWordmark}
        heroWord={props.brandWordmark}
        promptCommand={props.promptText}
        ctaUrl={props.ctaUrl}
        accentColor={props.accentColor}
        bpm={props.bpm}
      />
    );
  }

  // One-switch toggle to Archetype 3 (Motionfly MCP Chat-to-Cinema / Agentic Demo) via launch.config.json!
  if (props.preset === "motionfly-agentic") {
    return (
      <MotionflyAgenticLaunch
        {...defaultMotionflyAgenticProps}
        brandWordmark={props.brandWordmark}
        promptText={props.promptText}
        ctaUrl={props.ctaUrl}
        accentColor={props.accentColor}
        bpm={props.bpm}
      />
    );
  }

  // One-switch toggle to Archetype 4 (Hera Canvas Creative Ad Canvas) via launch.config.json!
  if (props.preset === "hera-ad-canvas") {
    return (
      <HeraAdCanvasLaunch
        {...defaultHeraAdCanvasProps}
        brandWordmark={props.brandWordmark}
        ctaUrl={props.ctaUrl}
        accentColor={props.accentColor}
        bpm={props.bpm}
      />
    );
  }

  const activeScenes: SceneId[] =
    props.preset === "rebrand-editorial"
      ? [
          "macro-prompt-strobe",
          "card-to-chip-dock",
          "z-scatter-theme-flip",
          "inline-logo-slot-headline",
        ]
      : props.scenes;

  let cursor = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", overflow: "hidden" }}>
      {activeScenes.map((sceneId, idx) => {
        const from = cursor;
        const dur = SCENE_DURATIONS[sceneId];
        cursor += dur;

        return (
          <Sequence key={`${sceneId}-${idx}`} from={from} durationInFrames={dur}>
            {sceneId === "macro-prompt-strobe" && (
              <MacroPromptStrobeScene
                brandTitle={props.brandTitle}
                mcpBadge={props.mcpBadge}
                promptText={props.promptText}
                searchStatus={props.searchStatus}
                libraryCountLabel={props.libraryCountLabel}
                submitBlue={props.submitBlue}
              />
            )}
            {sceneId === "card-to-chip-dock" && (
              <CardToChipDockScene
                mcpBadge={props.mcpBadge}
                followUpPrompt={props.followUpPrompt}
                submitBlue={props.submitBlue}
              />
            )}
            {sceneId === "z-scatter-theme-flip" && (
              <ZScatterThemeFlipScene
                pivotPrompt={props.pivotPrompt}
                synthesisPrompt={props.synthesisPrompt}
                submitBlue={props.submitBlue}
              />
            )}
            {sceneId === "inline-logo-slot-headline" && (
              <InlineLogoSlotHeadlineScene
                headlineLine1={props.headlineLine1}
                headlineLine2Prefix={props.headlineLine2Prefix}
                headlineLine2Suffix={props.headlineLine2Suffix}
                brandWordmark={props.brandWordmark}
                ctaUrl={props.ctaUrl}
              />
            )}
            {sceneId === "legacy-stack-dock" && (
              <LegacyStackDockScene
                brandWordmark={props.brandWordmark}
                accentColor={props.accentColor}
              />
            )}
            {sceneId === "agent-execution-tree" && (
              <AgentExecutionTreeScene
                promptText={props.promptText}
                accentColor={props.accentColor}
              />
            )}
            {sceneId === "timeline-assembly-reveal" && (
              <TimelineAssemblyRevealScene accentColor={props.accentColor} />
            )}
            {sceneId === "multiplayer-cursor-swarm" && (
              <MultiplayerCursorSwarmScene
                brandWordmark={props.brandWordmark}
                ctaUrl={props.ctaUrl}
                accentColor={props.accentColor}
              />
            )}
            {sceneId === "multi-artboard-ad-grid" && (
              <MultiArtboardAdGridScene
                brandWordmark={props.brandWordmark}
                accentColor={props.accentColor}
              />
            )}
            {sceneId === "brand-kit-radial-bloom" && (
              <BrandKitRadialBloomScene
                brandWordmark={props.brandWordmark}
                accentColor={props.accentColor}
              />
            )}
            {sceneId === "reference-ad-transmute" && (
              <ReferenceAdTransmuteScene accentColor={props.accentColor} />
            )}
            {sceneId === "static-to-motion-ad-zoom" && (
              <StaticToMotionAdZoomScene
                brandWordmark={props.brandWordmark}
                ctaUrl={props.ctaUrl}
                accentColor={props.accentColor}
              />
            )}
          </Sequence>
        );
      })}

      {/* Deterministic anti-banding grain across every frame */}
      <FilmGrainOverlay frame={frame} opacity={0.022} />
    </AbsoluteFill>
  );
};
