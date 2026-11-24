import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  LS_THEME,
  LaunchSkillCyclorama,
  LaunchSkillMark,
} from "../../components/LaunchSkillPrimitives";
import {
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  computeSecondarySettle,
  getCaretOpacity,
  getSpringForMass,
  sec,
} from "../../lib/studioMotion";

/**
 * Shot 5 (15.0s - 18.0s | f450 - f540 @ 30fps, local f0 - f90):
 *   - Shared-element contraction from Shot 4's dark CLI pill into the LaunchSkill
 *     geometric obsidian squircle mark (housing the Vermilion Caret-Playhead).
 *   - Lockup: LaunchSkill wordmark + "Prompts to launch videos." (4 words) +
 *     exact 1-line install command pill & GitHub URL safely inside 120x90px X margins.
 *   - Living Hold (zero dead frames): specular light sweeps across the mark, cyclorama
 *     gently breathes (1.0 -> 1.032), vermilion caret blinks rhythmically, clean loop to f0!
 */
export const LSFinaleLockupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalLocal = sec(3.0, fps);

  // Snappy editorial arrival from Shot 4 contraction (floor >= 0.92, never scale 0!)
  const markP = spring({
    frame,
    fps,
    config: getSpringForMass("card"),
  });
  const markScale = 0.92 + markP * 0.08;

  // Hierarchical secondary settle (+75ms wordmark, +140ms subtitle, +220ms CTA pill)
  const wordSettle = computeSecondarySettle(frame, 0, fps, 0.075, 10);
  const subSettle = computeSecondarySettle(frame, 0, fps, 0.14, 10);
  const ctaSettle = computeSecondarySettle(frame, 0, fps, 0.22, 12);

  // Continuous living hold motion so zero 0.6s window is ever frozen (Gate G5)
  const cycloramaZoom = interpolate(frame, [0, totalLocal], [1.0, 1.038], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cycloramaPanY = interpolate(frame, [0, totalLocal], [0, -18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Single studio specular sheen sweeping cleanly across the obsidian squircle mark
  const sheenProgress = interpolate(frame, [sec(0.55, fps), sec(2.15, fps)], [-0.3, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const playheadPulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2.2);
  const caretOpacity = getCaretOpacity(frame, false, fps);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LaunchSkillCyclorama zoom={cycloramaZoom} panY={cycloramaPanY} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "90px 120px",
          boxSizing: "border-box",
        }}
      >
        {/* Hero Brand Lockup: Geometric Playhead Mark + Bold Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            transform: `scale(${markScale})`,
          }}
        >
          <LaunchSkillMark
            size={104}
            sheenProgress={sheenProgress}
            playheadPulse={playheadPulse}
          />

          <div
            style={{
              transform: `translate3d(0, ${wordSettle.translateY}px, 0)`,
              opacity: wordSettle.opacity,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-0.048em",
                lineHeight: 1.0,
                color: LS_THEME.ink,
              }}
            >
              Launch
            </span>
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-0.048em",
                lineHeight: 1.0,
                color: LS_THEME.vermilion,
              }}
            >
              Skill
            </span>
          </div>
        </div>

        {/* 4-Word Editorial Tagline */}
        <div
          style={{
            marginTop: 28,
            transform: `translate3d(0, ${subSettle.translateY}px, 0)`,
            opacity: subSettle.opacity,
            fontFamily: FONT_SERIF,
            fontStyle: "italic",
            fontSize: 48,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            color: LS_THEME.inkSecondary,
          }}
        >
          Prompts to launch videos.
        </div>

        {/* Clean High-Contrast 1-Line Install Pill */}
        <div
          style={{
            marginTop: 54,
            transform: `translate3d(0, ${ctaSettle.translateY}px, 0)`,
            opacity: ctaSettle.opacity,
            padding: "20px 36px",
            borderRadius: 999,
            backgroundColor: LS_THEME.deckSurface,
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: LS_THEME.shadowPill,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: FONT_MONO,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-0.015em",
            color: "#FAF9F6",
          }}
        >
          <span style={{ color: LS_THEME.vermilion }}>$</span>
          <span>npx skills add timjayas/launchskill</span>
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: 24,
              borderRadius: 1.5,
              backgroundColor: LS_THEME.vermilion,
              opacity: caretOpacity,
            }}
          />
        </div>

        {/* Quiet Open-Source Repo URL */}
        <div
          style={{
            marginTop: 24,
            opacity: ctaSettle.opacity * 0.78,
            fontFamily: FONT_MONO,
            fontSize: 17,
            fontWeight: 500,
            letterSpacing: "0.04em",
            color: LS_THEME.inkMuted,
          }}
        >
          github.com/timjayas/launchskill · OPEN SOURCE
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
