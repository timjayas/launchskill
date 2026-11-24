import React from "react";
import { Composition } from "remotion";
import {
  SpotifyMusicLaunch,
  defaultSpotifyMusicLaunchProps,
  spotifyMusicLaunchSchema,
  getSpotifyMusicTotalFrames,
} from "./compositions/SpotifyMusicLaunch";
import {
  T3CodeEditorLaunch,
  defaultT3CodeEditorLaunchProps,
  t3CodeEditorLaunchSchema,
  getT3CodeEditorTotalFrames,
} from "./compositions/T3CodeEditorLaunch";
import {
  T3CodeLaunch,
  defaultT3CodeLaunchProps,
  t3CodeLaunchSchema,
  getT3CodeTotalFrames,
} from "./compositions/T3CodeLaunch";
import {
  SpotifyStudioLaunch,
  defaultSpotifyStudioLaunchProps,
  spotifyStudioLaunchSchema,
  getSpotifyStudioTotalFrames,
} from "./compositions/SpotifyStudioLaunch";
import {
  AntigravityLaunch,
  antigravityLaunchSchema,
  defaultAntigravityLaunchProps,
  getAntigravityTotalFrames,
} from "./compositions/AntigravityLaunch";
import {
  HeraAdCanvasLaunch,
  defaultHeraAdCanvasProps,
  heraAdCanvasSchema,
  getHeraAdCanvasTotalFrames,
} from "./compositions/HeraAdCanvasLaunch";
import {
  MotionflyAgenticLaunch,
  defaultMotionflyAgenticProps,
  motionflyAgenticSchema,
  getMotionflyAgenticTotalFrames,
} from "./compositions/MotionflyAgenticLaunch";
import {
  SpotifyLaunch,
  defaultSpotifyLaunchProps,
  spotifyLaunchSchema,
  getSpotifyLaunchTotalFrames,
} from "./compositions/SpotifyLaunch";
import {
  RebrandEditorialLaunch,
  defaultRebrandEditorialProps,
  rebrandEditorialSchema,
  getConfigurableLaunchTotalFrames,
} from "./compositions/RebrandEditorialLaunch";
import {
  KineticStudioLaunch,
  defaultKineticStudioProps,
  kineticStudioSchema,
  getKineticStudioTotalFrames,
} from "./compositions/KineticStudioLaunch";
import {
  Gemini4NeonLaunch,
  defaultGemini4NeonProps,
  gemini4NeonSchema,
  getGemini4NeonTotalFrames,
} from "./compositions/Gemini4NeonLaunch";
import { SaasLaunch } from "./compositions/SaasLaunch";
import { AppFeatureHighlight } from "./compositions/AppFeatureHighlight";
import { SimpleProductReveal } from "./compositions/SimpleProductReveal";
import { WaterBottleLaunch } from "./compositions/WaterBottleLaunch";
import {
  appFeatureHighlightSchema,
  getTotalFrames,
  saasLaunchSchema,
  simpleProductRevealSchema,
  waterBottleLaunchSchema,
  type AppFeatureHighlightProps,
  type SaasLaunchProps,
  type SimpleProductRevealProps,
  type WaterBottleLaunchProps,
} from "./lib/schema";

const FPS = 30;

export const defaultSaasLaunchProps: SaasLaunchProps = {
  productName: "Pulseflow",
  badge: "Now in Public Beta",
  hookLines: ["Ship releases in minutes.", "Not quarters."],
  tagline: "Automated release telemetry, instant rollbacks, and live incident clarity for modern engineering teams.",
  dashboardTitle: "Release Control",
  dashboardMetricLabel: "Deployments Shipped",
  dashboardMetricValue: "14,820",
  dashboardDelta: "+42.8% velocity",
  dashboardHighlights: [
    "Zero-config CI/CD pipeline detection",
    "Instant anomaly alerts in under 400ms",
    "One-click deterministic canary rollbacks",
  ],
  features: [
    {
      label: "AUTOMATION",
      title: "Zero-touch deploys",
      metric: "10× faster",
      description: "Merge to main and ship with automatic health gates.",
    },
    {
      label: "OBSERVABILITY",
      title: "Real-time trace diff",
      metric: "< 400ms",
      description: "Spot latency regressions the second a build goes live.",
    },
    {
      label: "RELIABILITY",
      title: "Instant rollback",
      metric: "99.98%",
      description: "Revert risky releases globally with a single command.",
    },
  ],
  ctaHeadline: "Ship faster without breaking production.",
  ctaButtonText: "Start free",
  ctaUrl: "pulseflow.dev",
  theme: {
    background: "#09090B",
    surface: "#13131A",
    border: "rgba(255, 255, 255, 0.12)",
    textPrimary: "#FAFAFA",
    textMuted: "#A1A1AA",
    accent: "#6366F1",
    accentSecondary: "#22D3EE",
  },
  timingSeconds: {
    hook: 3.2,
    hero: 10.5,
    features: 11.0,
    cta: 6.0,
  },
};

export const defaultAppFeatureHighlightProps: AppFeatureHighlightProps = {
  productName: "Kova",
  featureBadge: "New in Kova 2.4",
  hookLines: ["One command.", "Zero busywork."],
  featureTitle: "Instant AI Workflow Sync",
  featureDescription:
    "Turn meeting notes and PR threads into prioritized sprint tasks automatically—without leaving your keyboard.",
  calloutLabel: "Sync sprint from #engineering",
  calloutDetail: "12 tasks routed in 1.2s",
  impactStat: "4.6 hrs",
  impactLabel: "saved per engineer every single week",
  ctaHeadline: "Try Instant Workflow Sync today.",
  ctaUrl: "kova.app/sync",
  theme: {
    background: "#09090B",
    surface: "#12131C",
    border: "rgba(255, 255, 255, 0.12)",
    textPrimary: "#FAFAFA",
    textMuted: "#A1A1AA",
    accent: "#8B5CF6",
    accentSecondary: "#38BDF8",
  },
  timingSeconds: {
    hook: 2.6,
    spotlight: 9.5,
    impact: 4.2,
    cta: 4.5,
  },
};

export const defaultSimpleProductRevealProps: SimpleProductRevealProps = {
  productName: "Velo",
  monogram: "VL",
  launchTag: "Launching Today",
  hookLines: ["Design systems,", "finally alive."],
  valueProp: "The spatial token engine built for speed and precision.",
  ctaUrl: "velo.design",
  theme: {
    background: "#09090B",
    surface: "#13131A",
    border: "rgba(255, 255, 255, 0.12)",
    textPrimary: "#FAFAFA",
    textMuted: "#A1A1AA",
    accent: "#10B981",
    accentSecondary: "#22D3EE",
  },
  timingSeconds: {
    hook: 2.6,
    reveal: 7.6,
    cta: 5.3,
  },
};

export const defaultWaterBottleLaunchProps: WaterBottleLaunchProps = {
  productName: "Aera",
  editionBadge: "Series 01 · Architectural Hydration",
  hookLines: ["Pure hydration,", "crafted to last."],
  tagline: "Double-wall titanium steel engineered for effortless everyday carry.",
  macroCalloutTitle: "Magnetic leakproof seal",
  macroCalloutDetail: "Zero-thread twist lock · 100% airtight",
  specsLine: "750 ml · 285 g · 18/8 Titanium Steel",
  coldHours: 36,
  hotHours: 18,
  chapterHeadline: ["Engineered for", "every extreme."],
  features: [
    {
      label: "THERMAL CORE",
      title: "36h ice cold",
      metric: "2°C",
      description: "Copper-lined vacuum chamber locks temperature all day.",
    },
    {
      label: "PURE TASTE",
      title: "Ceramic interior",
      metric: "0% metal",
      description: "Silica-glazed inner wall keeps water crisp and neutral.",
    },
    {
      label: "PRECISION CAP",
      title: "One-hand lock",
      metric: "360° seal",
      description: "Machined magnetic cap with flush folding carry loop.",
    },
  ],
  ctaHeadline: "Hydration, distilled to its purest form.",
  ctaButtonText: "Pre-order Series 01",
  ctaUrl: "aeravessel.com",
  theme: {
    lightBackground: "#F7F7F5",
    darkBackground: "#09090B",
    lightTextPrimary: "#0A0A0A",
    lightTextMuted: "#737373",
    darkTextPrimary: "#FAFAFA",
    darkTextMuted: "#9CA3AF",
    accent: "#2563EB",
    accentSecondary: "#38BDF8",
    bottleColor: "#1D3557",
    capColor: "#D8DEE6",
  },
  timingSeconds: {
    hook: 3.2,
    reveal: 9.2,
    features: 8.2,
    cta: 5.2,
  },
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SpotifyMusicLaunch"
        component={SpotifyMusicLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getSpotifyMusicTotalFrames(defaultSpotifyMusicLaunchProps.bpm, FPS)}
        schema={spotifyMusicLaunchSchema}
        defaultProps={defaultSpotifyMusicLaunchProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getSpotifyMusicTotalFrames(props.bpm, FPS),
        })}
      />
      <Composition
        id="T3CodeEditorLaunch"
        component={T3CodeEditorLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getT3CodeEditorTotalFrames(defaultT3CodeEditorLaunchProps.bpm, FPS)}
        schema={t3CodeEditorLaunchSchema}
        defaultProps={defaultT3CodeEditorLaunchProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getT3CodeEditorTotalFrames(props.bpm, FPS),
        })}
      />
      <Composition
        id="T3CodeLaunch"
        component={T3CodeLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getT3CodeTotalFrames(defaultT3CodeLaunchProps.bpm, FPS)}
        schema={t3CodeLaunchSchema}
        defaultProps={defaultT3CodeLaunchProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getT3CodeTotalFrames(props.bpm, FPS),
        })}
      />
      <Composition
        id="SpotifyStudioLaunch"
        component={SpotifyStudioLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getSpotifyStudioTotalFrames(defaultSpotifyStudioLaunchProps.bpm, FPS)}
        schema={spotifyStudioLaunchSchema}
        defaultProps={defaultSpotifyStudioLaunchProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getSpotifyStudioTotalFrames(props.bpm, FPS),
        })}
      />
      <Composition
        id="AntigravityLaunch"
        component={AntigravityLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getAntigravityTotalFrames(defaultAntigravityLaunchProps.bpm, FPS)}
        schema={antigravityLaunchSchema}
        defaultProps={defaultAntigravityLaunchProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getAntigravityTotalFrames(props.bpm, FPS),
        })}
      />
      <Composition
        id="HeraAdCanvasLaunch"
        component={HeraAdCanvasLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getHeraAdCanvasTotalFrames()}
        schema={heraAdCanvasSchema}
        defaultProps={defaultHeraAdCanvasProps}
      />
      <Composition
        id="MotionflyAgenticLaunch"
        component={MotionflyAgenticLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getMotionflyAgenticTotalFrames()}
        schema={motionflyAgenticSchema}
        defaultProps={defaultMotionflyAgenticProps}
      />
      <Composition
        id="SpotifyLaunch"
        component={SpotifyLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getSpotifyLaunchTotalFrames(defaultSpotifyLaunchProps.bpm, FPS)}
        schema={spotifyLaunchSchema}
        defaultProps={defaultSpotifyLaunchProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getSpotifyLaunchTotalFrames(props.bpm, FPS),
        })}
      />
      <Composition
        id="RebrandEditorialLaunch"
        component={RebrandEditorialLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getConfigurableLaunchTotalFrames(defaultRebrandEditorialProps, FPS)}
        schema={rebrandEditorialSchema}
        defaultProps={defaultRebrandEditorialProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getConfigurableLaunchTotalFrames(props, FPS),
        })}
      />
      <Composition
        id="KineticStudioLaunch"
        component={KineticStudioLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getKineticStudioTotalFrames(defaultKineticStudioProps.bpm, FPS)}
        schema={kineticStudioSchema}
        defaultProps={defaultKineticStudioProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getKineticStudioTotalFrames(props.bpm, FPS),
        })}
      />
      <Composition
        id="Gemini4NeonLaunch"
        component={Gemini4NeonLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getGemini4NeonTotalFrames(defaultGemini4NeonProps.bpm, FPS)}
        schema={gemini4NeonSchema}
        defaultProps={defaultGemini4NeonProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getGemini4NeonTotalFrames(props.bpm, FPS),
        })}
      />
      <Composition
        id="WaterBottleLaunch"
        component={WaterBottleLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getTotalFrames(defaultWaterBottleLaunchProps.timingSeconds, FPS)}
        schema={waterBottleLaunchSchema}
        defaultProps={defaultWaterBottleLaunchProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getTotalFrames(props.timingSeconds, FPS),
        })}
      />
      <Composition
        id="SaasLaunch"
        component={SaasLaunch}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getTotalFrames(defaultSaasLaunchProps.timingSeconds, FPS)}
        schema={saasLaunchSchema}
        defaultProps={defaultSaasLaunchProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getTotalFrames(props.timingSeconds, FPS),
        })}
      />

      <Composition
        id="AppFeatureHighlight"
        component={AppFeatureHighlight}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getTotalFrames(defaultAppFeatureHighlightProps.timingSeconds, FPS)}
        schema={appFeatureHighlightSchema}
        defaultProps={defaultAppFeatureHighlightProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getTotalFrames(props.timingSeconds, FPS),
        })}
      />

      <Composition
        id="SimpleProductReveal"
        component={SimpleProductReveal}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={getTotalFrames(defaultSimpleProductRevealProps.timingSeconds, FPS)}
        schema={simpleProductRevealSchema}
        defaultProps={defaultSimpleProductRevealProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: getTotalFrames(props.timingSeconds, FPS),
        })}
      />
    </>
  );
};
