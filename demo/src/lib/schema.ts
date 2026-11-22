import { z } from "zod";

export const themeSchema = z.object({
  background: z.string().default("#09090B"),
  surface: z.string().default("#13131A"),
  border: z.string().default("rgba(255, 255, 255, 0.12)"),
  textPrimary: z.string().default("#FAFAFA"),
  textMuted: z.string().default("#A1A1AA"),
  accent: z.string().default("#6366F1"),
  accentSecondary: z.string().default("#22D3EE"),
});

export type LaunchTheme = z.infer<typeof themeSchema>;

export const featureItemSchema = z.object({
  label: z.string(),
  title: z.string(),
  metric: z.string(),
  description: z.string(),
});

export type FeatureItem = z.infer<typeof featureItemSchema>;

export const saasLaunchSchema = z.object({
  productName: z.string(),
  badge: z.string(),
  hookLines: z.tuple([z.string(), z.string()]),
  tagline: z.string(),
  dashboardTitle: z.string(),
  dashboardMetricLabel: z.string(),
  dashboardMetricValue: z.string(),
  dashboardDelta: z.string(),
  dashboardHighlights: z.tuple([z.string(), z.string(), z.string()]),
  features: z.tuple([featureItemSchema, featureItemSchema, featureItemSchema]),
  ctaHeadline: z.string(),
  ctaButtonText: z.string(),
  ctaUrl: z.string(),
  theme: themeSchema,
  timingSeconds: z.object({
    hook: z.number().min(1.5).max(5),
    hero: z.number().min(5).max(16),
    features: z.number().min(5).max(16),
    cta: z.number().min(3).max(8),
  }),
});

export type SaasLaunchProps = z.infer<typeof saasLaunchSchema>;

export const appFeatureHighlightSchema = z.object({
  productName: z.string(),
  featureBadge: z.string(),
  hookLines: z.tuple([z.string(), z.string()]),
  featureTitle: z.string(),
  featureDescription: z.string(),
  calloutLabel: z.string(),
  calloutDetail: z.string(),
  impactStat: z.string(),
  impactLabel: z.string(),
  ctaHeadline: z.string(),
  ctaUrl: z.string(),
  theme: themeSchema,
  timingSeconds: z.object({
    hook: z.number().min(1.5).max(4),
    spotlight: z.number().min(5).max(14),
    impact: z.number().min(3).max(8),
    cta: z.number().min(3).max(8),
  }),
});

export type AppFeatureHighlightProps = z.infer<typeof appFeatureHighlightSchema>;

export const simpleProductRevealSchema = z.object({
  productName: z.string(),
  monogram: z.string().min(1).max(3),
  launchTag: z.string(),
  hookLines: z.tuple([z.string(), z.string()]),
  valueProp: z.string(),
  ctaUrl: z.string(),
  theme: themeSchema,
  timingSeconds: z.object({
    hook: z.number().min(1.5).max(4),
    reveal: z.number().min(5).max(14),
    cta: z.number().min(3.5).max(9),
  }),
});

export type SimpleProductRevealProps = z.infer<typeof simpleProductRevealSchema>;

export const waterBottleThemeSchema = z.object({
  lightBackground: z.string().default("#F7F7F5"),
  darkBackground: z.string().default("#09090B"),
  lightTextPrimary: z.string().default("#0A0A0A"),
  lightTextMuted: z.string().default("#737373"),
  darkTextPrimary: z.string().default("#FAFAFA"),
  darkTextMuted: z.string().default("#9CA3AF"),
  accent: z.string().default("#2563EB"),
  accentSecondary: z.string().default("#38BDF8"),
  bottleColor: z.string().default("#1D3557"),
  capColor: z.string().default("#D8DEE6"),
});

export type WaterBottleTheme = z.infer<typeof waterBottleThemeSchema>;

export const waterBottleLaunchSchema = z.object({
  productName: z.string(),
  editionBadge: z.string(),
  hookLines: z.tuple([z.string(), z.string()]),
  tagline: z.string(),
  macroCalloutTitle: z.string(),
  macroCalloutDetail: z.string(),
  specsLine: z.string(),
  coldHours: z.number().min(6).max(72),
  hotHours: z.number().min(4).max(48),
  chapterHeadline: z.tuple([z.string(), z.string()]),
  features: z.tuple([featureItemSchema, featureItemSchema, featureItemSchema]),
  ctaHeadline: z.string(),
  ctaButtonText: z.string(),
  ctaUrl: z.string(),
  theme: waterBottleThemeSchema,
  timingSeconds: z.object({
    hook: z.number().min(1.8).max(5),
    reveal: z.number().min(5).max(14),
    features: z.number().min(5).max(14),
    cta: z.number().min(3.5).max(8),
  }),
});

export type WaterBottleLaunchProps = z.infer<typeof waterBottleLaunchSchema>;

export const getTotalFrames = (
  timingSeconds: Record<string, number>,
  fps: number,
  overlapSeconds = 0.25
): number => {
  const values = Object.values(timingSeconds);
  const sumSeconds = values.reduce((acc, s) => acc + s, 0);
  const totalOverlap = Math.max(0, values.length - 1) * overlapSeconds;
  const clampedSeconds = Math.min(45, Math.max(15, sumSeconds - totalOverlap));
  return Math.round(clampedSeconds * fps);
};
