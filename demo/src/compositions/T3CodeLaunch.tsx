/**
 * T3 Code — Launch Video v4 (18.18s / 40 beats @ 132 BPM = 545f @ 30fps, 100% FPS-agnostic)
 *
 * Art Direction ("Fuser meets Apple meets Linear"):
 *   - 90% Crisp Swiss Minimalist Off-White (#F9F9F8) + 10% Earned #141413 Dark Polarity Climax
 *   - Official vector logos: Claude, OpenAI Codex, OpenCode, Cursor, Terminal, T3 Code
 *   - Accurate T3 Code Control-Plane Workflow: Parallel isolated Git worktree threads
 *     -> <T3SpatialCameraRig> macro push into real inline TypeScript diff (+142 -38)
 *     -> tactile click on "Commit & push / Open PR" -> "PR #412 Opened ✓"
 *   - Zero parked seconds, velocity-matched transitions, locked strictly to 132 BPM downbeats
 *     so dropping a 132 BPM MP3 into demo/public/audio/ locks every cut directly to the beat!
 *
 * 6-Beat 132 BPM Downbeat Blueprint (40 beats = 18.18s = 545f @ 30fps):
 *   1. Beats  0 ->  4 (1.82s,   0-> 55f, Light): Frame-0 Alive "Code.|" + 4 Official-Logo Cards -> Implosion
 *   2. Beats  4 ->  9 (2.27s,  55->123f, Light): Chaos -> Calm Tactile Glass Dock -> Velocity Zoom-Through
 *   3. Beats  9 -> 24 (6.82s, 123->327f, Light): Real T3 Code Control Plane (Threads -> Macro Diff -> Commit & Push)
 *   4. Beats 24 -> 30 (2.73s, 327->409f, Light): Airy Official-Logo Keys Swap ("Use your own [LOGO] keys.")
 *   5. Beats 30 -> 34 (1.82s, 409->464f, Dark ): Earned #141413 Dark Polarity Climax ("Parallel branches. One control plane.")
 *   6. Beats 34 -> 40 (2.73s, 464->545f, Light): Iconic Minimal T3 Code Lockup + Calm Hold (t3.codes · Clean Loop)
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import {
  T3_THEME,
  T3FilmGrain,
  T3SoundTrackLayer,
  type T3SfxCue,
} from "../components/T3CodePrimitives";
import { createBeatGrid, ensureStudioFontsRaceFree, sec } from "../lib/studioMotion";
import { T3ChaosToCalmDockScene } from "../scenes/t3code/T3ChaosToCalmDockScene";
import { T3ControlPlaneWorkspaceScene } from "../scenes/t3code/T3ControlPlaneWorkspaceScene";
import { T3DarkClimaxScene } from "../scenes/t3code/T3DarkClimaxScene";
import { T3FinaleLockupScene } from "../scenes/t3code/T3FinaleLockupScene";
import { T3HookSlotScene } from "../scenes/t3code/T3HookSlotScene";
import { T3InlineBrandSwapScene } from "../scenes/t3code/T3InlineBrandSwapScene";

export const t3CodeLaunchSchema = z.object({
  brandName: z.string(),
  heroWord: z.string(),
  dockWhisperMuted: z.string(),
  dockWhisperInk: z.string(),
  repoName: z.string(),
  swapLine1Muted: z.string(),
  swapLine2Suffix: z.string(),
  darkClimaxBeat1Muted: z.string(),
  darkClimaxBeat1Bright: z.string(),
  darkClimaxBeat2Punch: z.string(),
  positioningLine: z.string(),
  ctaUrl: z.string(),
  bpm: z.number().min(100).max(145),
  /** Enable only when curated real WAV foley assets exist in public/sfx/ */
  enableRealSfx: z.boolean(),
  /** Drop a 132 BPM MP3 into demo/public/audio/ and set e.g. "audio/bed-132bpm.mp3" */
  musicTrack: z.string().optional(),
  /** First downbeat offset (seconds) from analyze-music.mjs for exact beat-lock */
  musicStartFromSec: z.number().min(0),
  musicVolume: z.number().min(0).max(1),
});

export type T3CodeLaunchProps = z.infer<typeof t3CodeLaunchSchema>;

export const defaultT3CodeLaunchProps: T3CodeLaunchProps = {
  brandName: "T3 Code",
  heroWord: "Code.",
  dockWhisperMuted: "Every agent.",
  dockWhisperInk: "One calm home.",
  repoName: "pingdotgg/t3-app",
  swapLine1Muted: "Use your own",
  swapLine2Suffix: "keys.",
  darkClimaxBeat1Muted: "Parallel",
  darkClimaxBeat1Bright: "branches.",
  darkClimaxBeat2Punch: "One control plane.",
  positioningLine: "The open-source control plane for AI coding agents.",
  ctaUrl: "t3.codes",
  bpm: 142,
  enableRealSfx: true,
  musicTrack: "audio/t3-bed-142bpm.wav",
  musicStartFromSec: 0,
  musicVolume: 0.24,
};

export const T3_CODE_BEAT_CUTS = {
  beat2: 4,   //  55f (1.82s — exact Bar 1 downbeat @ 132 BPM)
  beat3: 9,   // 123f (4.09s)
  beat4: 24,  // 327f (10.91s — exact Bar 6 downbeat)
  beat5: 30,  // 409f (13.64s — Dark Polarity Climax)
  beat6: 34,  // 464f (15.45s — Bright Finale)
  total: 40,  // 545f (18.18s — exact Bar 10)
} as const;

export const getT3CodeTotalFrames = (bpm: number, fps: number): number => {
  const g = createBeatGrid(bpm, fps);
  return g.beat(T3_CODE_BEAT_CUTS.total); // 545 frames @ 30fps, 132 BPM (18.18s)
};

export const T3CodeLaunch: React.FC<T3CodeLaunchProps> = (props) => {
  ensureStudioFontsRaceFree();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const g = createBeatGrid(props.bpm, fps);
  const s1Start = 0;
  const s2Start = g.beat(T3_CODE_BEAT_CUTS.beat2); //  55f
  const s3Start = g.beat(T3_CODE_BEAT_CUTS.beat3); // 123f
  const s4Start = g.beat(T3_CODE_BEAT_CUTS.beat4); // 327f
  const s5Start = g.beat(T3_CODE_BEAT_CUTS.beat5); // 409f
  const s6Start = g.beat(T3_CODE_BEAT_CUTS.beat6); // 464f
  const total = g.beat(T3_CODE_BEAT_CUTS.total);   // 545f

  // Beat-locked Tier-1 Procedural DSP Studio Foley Cues (48 kHz Stereo WAVs in public/sfx/)
  const sfxCues: T3SfxCue[] = props.enableRealSfx
    ? [
        // Beat 1: Orbital burst pop + fast swept pink-noise whoosh peaking on Beat 2 cut
        { frame: sec(0.12, fps), src: "sfx/pop-subtle.wav", volume: 0.24, playbackRate: 0.98 },
        { peakAtFrame: s2Start, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.26 },

        // Beat 2: Tactile magnetic T3 dock lock + fast whoosh peaking into Beat 3 Dark macOS window
        { frame: s2Start + sec(0.82, fps), src: "sfx/click-01.wav", volume: 0.36 },
        { peakAtFrame: s3Start, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.28 },

        // Beat 3: Dark macOS window sub-hit + thread check pops + deep macro push whoosh + Commit click
        { frame: s3Start, src: "sfx/sub-hit-soft.wav", volume: 0.30 },
        { frame: s3Start + sec(0.65, fps), src: "sfx/pop-subtle.wav", volume: 0.18, playbackRate: 0.97 },
        { frame: s3Start + sec(1.02, fps), src: "sfx/pop-subtle.wav", volume: 0.18, playbackRate: 1.02 },
        { frame: s3Start + sec(1.32, fps), src: "sfx/pop-subtle.wav", volume: 0.18, playbackRate: 1.06 },
        { peakAtFrame: s3Start + sec(1.56, fps), peakOffsetSec: 0.32, src: "sfx/whoosh-deep.wav", volume: 0.26 },
        { frame: s3Start + sec(4.82, fps), src: "sfx/click-02.wav", volume: 0.44 },

        // Beat 4: Official logo swap round-robin taps + 1.0s riser peaking into #141413 Dark Climax
        { peakAtFrame: s4Start, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.24 },
        { frame: s4Start + sec(0.56, fps), src: "sfx/key-01.wav", volume: 0.24, playbackRate: 0.98 },
        { frame: s4Start + sec(1.12, fps), src: "sfx/key-02.wav", volume: 0.24, playbackRate: 1.01 },
        { frame: s4Start + sec(1.68, fps), src: "sfx/key-03.wav", volume: 0.24, playbackRate: 1.04 },
        { peakAtFrame: s5Start, peakOffsetSec: 1.0, src: "sfx/riser-1s.wav", volume: 0.28 },

        // Beat 5: Heavy pitch-enveloped sub drop on Dark Climax + midpoint cut hit + bright reveal whoosh
        { frame: s5Start, src: "sfx/sub-hit-heavy.wav", volume: 0.42, duckMusic: true },
        { frame: s5Start + Math.round((s6Start - s5Start) / 2), src: "sfx/sub-hit-soft.wav", volume: 0.34 },
        { peakAtFrame: s6Start, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.18 },

        // Beat 6: Soft felt-warm brand resolve (blends gently into the Dmaj9 music bed)
        { frame: s6Start + sec(0.05, fps), src: "sfx/resolve-warm.wav", volume: 0.16 },
      ]
    : [];

  return (
    <AbsoluteFill style={{ backgroundColor: T3_THEME.canvas, overflow: "hidden" }}>
      {/* Beat 1: Frame-0 Alive "Code.|" + 4 Official-Logo Control-Plane Badges */}
      <Sequence from={s1Start} durationInFrames={s2Start - s1Start}>
        <T3HookSlotScene heroWord={props.heroWord} />
      </Sequence>

      {/* Beat 2: Chaos -> Calm Symmetrical Frosted Glass Agent Dock */}
      <Sequence from={s2Start} durationInFrames={s3Start - s2Start}>
        <T3ChaosToCalmDockScene
          whisperMuted={props.dockWhisperMuted}
          whisperInk={props.dockWhisperInk}
        />
      </Sequence>

      {/* Beat 3: Real T3 Code Control Plane (Isolated Threads -> Macro Diff +142 -38 -> Commit & Push) */}
      <Sequence from={s3Start} durationInFrames={s4Start - s3Start}>
        <T3ControlPlaneWorkspaceScene repoName={props.repoName} />
      </Sequence>

      {/* Beat 4: Airy Official-Logo Keys Swap ("Use your own [LOGO] keys.") */}
      <Sequence from={s4Start} durationInFrames={s5Start - s4Start}>
        <T3InlineBrandSwapScene
          line1Muted={props.swapLine1Muted}
          line2Suffix={props.swapLine2Suffix}
        />
      </Sequence>

      {/* Beat 5: Earned #141413 Dark Polarity Climax (Zero Neon, Pure Contrast Punch) */}
      <Sequence from={s5Start} durationInFrames={s6Start - s5Start}>
        <T3DarkClimaxScene
          beat1Muted={props.darkClimaxBeat1Muted}
          beat1Bright={props.darkClimaxBeat1Bright}
          beat2Punch={props.darkClimaxBeat2Punch}
        />
      </Sequence>

      {/* Beat 6: Iconic Minimal T3 Code Lockup + Calm Hold */}
      <Sequence from={s6Start} durationInFrames={total - s6Start}>
        <T3FinaleLockupScene
          brandName={props.brandName}
          positioningLine={props.positioningLine}
          ctaUrl={props.ctaUrl}
        />
      </Sequence>

      {/* Subtle High-Speed 128x128 Tiled Film Grain (H.264 Anti-Banding Defense) */}
      <T3FilmGrain frame={frame} fps={fps} opacity={0.018} />

      {/* 132 BPM Audio Layer (Drop MP3 in demo/public/audio/ & set musicTrack + musicStartFromSec) */}
      {(props.musicTrack || sfxCues.length > 0) && (
        <T3SoundTrackLayer
          musicTrack={props.musicTrack}
          musicVolume={props.musicVolume}
          musicStartFromSec={props.musicStartFromSec}
          cues={sfxCues}
        />
      )}
    </AbsoluteFill>
  );
};
