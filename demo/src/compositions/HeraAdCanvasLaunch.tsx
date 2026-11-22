/**
 * Hera Canvas — Archetype 4: Creative Ad Canvas (42.0s / 1260 frames @ 30fps, ~128 BPM)
 * Composes all 4 net-new Archetype 4 scenes with a 4-cycle Dark Crimson-Ember <-> Light Dot-Grid Heartbeat:
 *   1. MultiArtboardAdGridScene   (330f / 11.0s): Frame-0 hook + Z-depth ad cloud -> 3 parallel prompts fanning out mixed-aspect artboards
 *   2. BrandKitRadialBloomScene   (240f /  8.0s): URL-to-Brand-Kit radial bloom -> midpoint multi-angle dark showcase wall
 *   3. ReferenceAdTransmuteScene  (240f /  8.0s): 3 competitor reference ads transmuting in-place with 1:1 layout preservation
 *   4. StaticToMotionAdZoomScene  (450f / 15.0s): Static->Motion side-by-side split -> focal-locked Canvas-to-Full-Bleed Ad Zoom -> Panorama sweep + CTA
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { z } from "zod";
import { FilmGrainOverlay } from "../components/StudioPrimitives";
import { ensureStudioFonts } from "../lib/motion";
import { BrandKitRadialBloomScene } from "../scenes/BrandKitRadialBloomScene";
import { MultiArtboardAdGridScene } from "../scenes/MultiArtboardAdGridScene";
import { ReferenceAdTransmuteScene } from "../scenes/ReferenceAdTransmuteScene";
import { StaticToMotionAdZoomScene } from "../scenes/StaticToMotionAdZoomScene";

export const heraAdCanvasSchema = z.object({
  brandWordmark: z.string(),
  productBrand: z.string(),
  brandDomain: z.string(),
  brandFontName: z.string(),
  hookLead: z.string(),
  hookScaleWord: z.string(),
  hookTail: z.string(),
  prompt1: z.string(),
  prompt2: z.string(),
  prompt3: z.string(),
  agentLabels: z.tuple([z.string(), z.string(), z.string()]),
  animatePrompt: z.string(),
  ctaButtonText: z.string(),
  ctaUrl: z.string(),
  accentColor: z.string(),
  swatches: z.tuple([z.string(), z.string(), z.string(), z.string(), z.string()]),
  bpm: z.number().min(100).max(160),
});

export type HeraAdCanvasProps = z.infer<typeof heraAdCanvasSchema>;

export const defaultHeraAdCanvasProps: HeraAdCanvasProps = {
  brandWordmark: "Hera",
  productBrand: "Daily",
  brandDomain: "drink-daily.com",
  brandFontName: "Forrest",
  hookLead: "Create",
  hookScaleWord: "hundreds",
  hookTail: "of on-brand ads in minutes",
  prompt1: "Use our brand font in the title and remove the stars",
  prompt2: "Create 1:1 and 9:16 format for this ad",
  prompt3: "Make this ad editable",
  agentLabels: ["Brand font", "Social formats", "Editable ad"],
  animatePrompt: "Animate this ad",
  ctaButtonText: "Try Hera Canvas",
  ctaUrl: "hera.video/canvas",
  accentColor: "#E11D48",
  swatches: ["#FFF7ED", "#4C0549", "#E11D48", "#FB7185", "#F472B6"],
  bpm: 128,
};

export const HERA_SCENE_DURATIONS = {
  adGrid: 330,
  brandKit: 240,
  referenceTransmute: 240,
  staticToMotion: 450,
} as const;

export const getHeraAdCanvasTotalFrames = (): number =>
  HERA_SCENE_DURATIONS.adGrid +
  HERA_SCENE_DURATIONS.brandKit +
  HERA_SCENE_DURATIONS.referenceTransmute +
  HERA_SCENE_DURATIONS.staticToMotion; // 1260 frames = 42.0s @ 30fps

export const HeraAdCanvasLaunch: React.FC<HeraAdCanvasProps> = (props) => {
  ensureStudioFonts();
  const frame = useCurrentFrame();

  const d1 = HERA_SCENE_DURATIONS.adGrid;
  const d2 = HERA_SCENE_DURATIONS.brandKit;
  const d3 = HERA_SCENE_DURATIONS.referenceTransmute;
  const d4 = HERA_SCENE_DURATIONS.staticToMotion;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0607", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={d1}>
        <MultiArtboardAdGridScene
          brandWordmark={props.brandWordmark}
          productBrand={props.productBrand}
          accentColor={props.accentColor}
          hookLead={props.hookLead}
          hookScaleWord={props.hookScaleWord}
          hookTail={props.hookTail}
          prompt1={props.prompt1}
          prompt2={props.prompt2}
          prompt3={props.prompt3}
          agentLabels={props.agentLabels}
        />
      </Sequence>

      <Sequence from={d1} durationInFrames={d2}>
        <BrandKitRadialBloomScene
          brandWordmark={props.brandWordmark}
          productBrand={props.productBrand}
          brandDomain={props.brandDomain}
          brandFontName={props.brandFontName}
          accentColor={props.accentColor}
          swatches={props.swatches}
        />
      </Sequence>

      <Sequence from={d1 + d2} durationInFrames={d3}>
        <ReferenceAdTransmuteScene
          productBrand={props.productBrand}
          accentColor={props.accentColor}
        />
      </Sequence>

      <Sequence from={d1 + d2 + d3} durationInFrames={d4}>
        <StaticToMotionAdZoomScene
          brandWordmark={props.brandWordmark}
          productBrand={props.productBrand}
          ctaUrl={props.ctaUrl}
          ctaButtonText={props.ctaButtonText}
          animatePrompt={props.animatePrompt}
          accentColor={props.accentColor}
        />
      </Sequence>

      {/* Deterministic anti-banding grain across every frame */}
      <FilmGrainOverlay frame={frame} opacity={0.024} />
    </AbsoluteFill>
  );
};
