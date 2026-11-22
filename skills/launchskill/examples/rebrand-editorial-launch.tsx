import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import launchConfigJson from "../templates/launch.config.json";
import { FilmGrainOverlay } from "../templates/StudioPrimitives";
import { durSec, ensureStudioFonts } from "../templates/motion";
import { CardToChipDockScene } from "../templates/scenes/CardToChipDockScene";
import { InlineLogoSlotHeadlineScene } from "../templates/scenes/InlineLogoSlotHeadlineScene";
import { MacroPromptStrobeScene } from "../templates/scenes/MacroPromptStrobeScene";
import { ZScatterThemeFlipScene } from "../templates/scenes/ZScatterThemeFlipScene";
import {
  defaultKineticStudioProps,
  getKineticStudioTotalFrames,
  KineticStudioLaunch,
} from "./kinetic-studio-launch";

export const sceneIdSchema = z.enum([
  "macro-prompt-strobe",
  "card-to-chip-dock",
  "z-scatter-theme-flip",
  "inline-logo-slot-headline",
]);

export type SceneId = z.infer<typeof sceneIdSchema>;

/** FPS-agnostic scene durations in seconds (scales identically to 24p, 30p, and 60p) */
export const SCENE_DURATIONS_SEC: Record<SceneId, number> = {
  "macro-prompt-strobe": 6.2,
  "card-to-chip-dock": 5.4,
  "z-scatter-theme-flip": 9.6,
  "inline-logo-slot-headline": 6.8,
};

export const rebrandEditorialSchema = z.object({
  preset: z.enum(["rebrand-editorial", "fuser", "blend"]),
  temperament: z.enum(["taut-mechanical", "editorial-fluid", "tactile-snappy"]).default("editorial-fluid"),
  bpm: z.number().min(100).max(150),
  brandTitle: z.string(),
  brandWordmark: z.string(),
  mcpBadge: z.string(),
  ctaUrl: z.string(),
  submitAccent: z.string(),
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
  const activeScenes: SceneId[] =
    props.preset === "rebrand-editorial"
      ? [
          "macro-prompt-strobe",
          "card-to-chip-dock",
          "z-scatter-theme-flip",
          "inline-logo-slot-headline",
        ]
      : props.scenes;
  return activeScenes.reduce((sum, id) => sum + durSec(SCENE_DURATIONS_SEC[id], fps), 0);
};

export const RebrandEditorialLaunch: React.FC<RebrandEditorialProps> = (props) => {
  ensureStudioFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // One-switch toggle to Archetype 1 (Spatial Creative Tool) via templates/launch.config.json
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
        const dur = durSec(SCENE_DURATIONS_SEC[sceneId], fps);
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
                submitAccent={props.submitAccent}
              />
            )}
            {sceneId === "card-to-chip-dock" && (
              <CardToChipDockScene
                mcpBadge={props.mcpBadge}
                followUpPrompt={props.followUpPrompt}
                submitAccent={props.submitAccent}
              />
            )}
            {sceneId === "z-scatter-theme-flip" && (
              <ZScatterThemeFlipScene
                pivotPrompt={props.pivotPrompt}
                synthesisPrompt={props.synthesisPrompt}
                submitAccent={props.submitAccent}
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
          </Sequence>
        );
      })}

      {/* High-Speed Tiled Deterministic Film Grain */}
      <FilmGrainOverlay frame={frame} fps={fps} opacity={0.022} />
    </AbsoluteFill>
  );
};
