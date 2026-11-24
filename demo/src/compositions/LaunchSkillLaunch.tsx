/**
 * LaunchSkill — Official 18-Second 16:9 X Launch Video
 * Creative Mode: Mode A — Product Proof (Editorial Studio Cinema Craft)
 * Tempo: 120 BPM · 30 FPS · 36 Beats (540 frames = 18.0s)
 * Audio: Pure 48 kHz Procedural DSP Studio Foley (Zero Code-Generated Music) -> Mastered -14 LUFS
 * Hero Motif: The Cinema Vermilion (#E5482E) Typing Caret physically transforms into the Video Timeline Playhead.
 */
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { z } from "zod";
import {
  FastFilmGrain,
  LS_THEME,
  LaunchSkillSoundLayer,
  type LSSfxCue,
} from "../components/LaunchSkillPrimitives";
import { createBeatGrid, ensureStudioFontsRaceFree, sec } from "../lib/studioMotion";
import { LSFinaleLockupScene } from "../scenes/launchskill/LSFinaleLockupScene";
import { LSHookPromptScene } from "../scenes/launchskill/LSHookPromptScene";
import { LSInstallAgentsScene } from "../scenes/launchskill/LSInstallAgentsScene";
import { LSKineticProofScene } from "../scenes/launchskill/LSKineticProofScene";
import { LSTimelineDeckScene } from "../scenes/launchskill/LSTimelineDeckScene";

export const launchSkillLaunchSchema = z.object({
  productName: z.string(),
  bpm: z.number(),
});

export type LaunchSkillLaunchProps = z.infer<typeof launchSkillLaunchSchema>;

export const defaultLaunchSkillLaunchProps: LaunchSkillLaunchProps = {
  productName: "LaunchSkill",
  bpm: 120,
};

export const getLaunchSkillTotalFrames = (bpm: number, fps: number): number => {
  const g = createBeatGrid(bpm, fps);
  return g.beat(36); // 540 frames @ 30fps (18.0s)
};

export const LaunchSkillLaunch: React.FC<LaunchSkillLaunchProps> = (props) => {
  ensureStudioFontsRaceFree();
  const { fps } = useVideoConfig();
  const g = createBeatGrid(props.bpm, fps);

  // Beat-locked edit boundaries (120 BPM => 15f/beat @ 30fps)
  const s1Start = g.beat(0);  // f0   (0.0s) — Hook: Macro Prompt -> Caret stretches into Playhead
  const s2Start = g.beat(6);  // f90  (3.0s) — Studio Timeline Deck + Macro Dive + Portal Zoom
  const s3Start = g.beat(15); // f225 (7.5s) — 3 Brisk 1.5s Proof Cuts (Camera / QA / -14 LUFS)
  const s4Start = g.beat(24); // f360 (12.0s) — Playhead Curtain Wipe + CLI Install + Agents
  const s5Start = g.beat(30); // f450 (15.0s) — Finale Brand Lockup + Living Hold
  const total = g.beat(36);   // f540 (18.0s)

  const keyFiles = [
    "sfx/key-01.wav",
    "sfx/key-02.wav",
    "sfx/key-03.wav",
    "sfx/key-04.wav",
  ];

  // Crisp round-robin typing transients (Shot 1 prompt + Shot 4 CLI install)
  const hookTypingCues: LSSfxCue[] = [0.1, 0.24, 0.39, 0.54, 0.68].map((tSec, i) => ({
    frame: s1Start + sec(tSec, fps),
    src: keyFiles[i % keyFiles.length],
    volume: 0.24,
    playbackRate: 0.96 + (i % 4) * 0.028,
  }));

  const cliTypingCues: LSSfxCue[] = [0.24, 0.38, 0.52, 0.68, 0.84, 1.0, 1.16].map((tSec, i) => ({
    frame: s4Start + sec(tSec, fps),
    src: keyFiles[(i + 1) % keyFiles.length],
    volume: 0.22,
    playbackRate: 0.95 + (i % 4) * 0.03,
  }));

  const badgePopCues: LSSfxCue[] = [0.74, 0.84, 0.94, 1.04].map((tSec, i) => ({
    frame: s4Start + sec(tSec, fps),
    src: "sfx/pop-subtle.wav",
    volume: 0.22,
    playbackRate: 0.96 + i * 0.032,
  }));

  const sfxCues: LSSfxCue[] = [
    ...hookTypingCues,
    // Shot 1: [↵ Run] snap + camera pull-back
    { frame: s1Start + sec(1.05, fps), src: "sfx/click-01.wav", volume: 0.44 },
    { peakAtFrame: s1Start + sec(1.2, fps), peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.34 },
    { frame: s1Start + sec(1.12, fps), src: "sfx/sub-hit-soft.wav", volume: 0.36 },

    // Shot 2: Studio Deck expand + macro dive + portal zoom riser
    { peakAtFrame: s2Start, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.30 },
    { frame: s2Start, src: "sfx/click-02.wav", volume: 0.36 },
    { peakAtFrame: s2Start + sec(2.0, fps), peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.34 },
    { frame: s2Start + sec(1.98, fps), src: "sfx/pop-subtle.wav", volume: 0.30 },
    { frame: s2Start + sec(2.95, fps), src: "sfx/click-03.wav", volume: 0.32 },
    { peakAtFrame: s3Start, peakOffsetSec: 1.0, src: "sfx/riser-1s.wav", volume: 0.30 },

    // Shot 3: 3 Brisk 1.5s Proof Cuts
    { frame: s3Start, src: "sfx/sub-hit-heavy.wav", volume: 0.46 },
    { peakAtFrame: s3Start + sec(1.5, fps), peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.38 },
    { frame: s3Start + sec(1.5, fps), src: "sfx/click-01.wav", volume: 0.36 },
    { frame: s3Start + sec(2.05, fps), src: "sfx/pop-subtle.wav", volume: 0.34, playbackRate: 1.04 },
    { frame: s3Start + sec(3.0, fps), src: "sfx/sub-hit-soft.wav", volume: 0.42 },
    { frame: s3Start + sec(3.0, fps), src: "sfx/click-02.wav", volume: 0.32 },

    // Shot 4: Playhead Curtain Wipe + CLI Install + Agent Badges
    { peakAtFrame: s4Start + sec(0.1, fps), peakOffsetSec: 0.32, src: "sfx/whoosh-deep.wav", volume: 0.36 },
    ...cliTypingCues,
    ...badgePopCues,

    // Shot 5: Finale Lockup + Warm Felt-Marimba Resolve
    { peakAtFrame: s5Start, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.28 },
    { frame: s5Start, src: "sfx/click-01.wav", volume: 0.38 },
    { frame: s5Start + sec(0.12, fps), src: "sfx/resolve-warm.wav", volume: 0.30 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: LS_THEME.paperMid }}>
      <Sequence from={s1Start} durationInFrames={s2Start - s1Start}>
        <LSHookPromptScene />
      </Sequence>

      <Sequence from={s2Start} durationInFrames={s3Start - s2Start}>
        <LSTimelineDeckScene />
      </Sequence>

      <Sequence from={s3Start} durationInFrames={s4Start - s3Start}>
        <LSKineticProofScene />
      </Sequence>

      <Sequence from={s4Start} durationInFrames={s5Start - s4Start}>
        <LSInstallAgentsScene />
      </Sequence>

      <Sequence from={s5Start} durationInFrames={total - s5Start}>
        <LSFinaleLockupScene />
      </Sequence>

      {/* Fast pre-encoded 128x128 tiled film grain for H.264 anti-banding */}
      <FastFilmGrain opacity={0.024} />

      {/* Crisp 48 kHz Procedural DSP Studio Foley Only */}
      <LaunchSkillSoundLayer cues={sfxCues} />
    </AbsoluteFill>
  );
};
