/**
 * T3Code — Official 16.9-Second 16:9 X Launch Video (v6 Architectural Slats + Seamless Loop)
 * Technique Playbook: product-cinema (Precision DevTool Archetype)
 * Tempo: 120 BPM · 30 FPS · 507 frames (16.90s)
 * Audio: Crisp 48 kHz Procedural DSP Studio Foley Only (Zero Code-Generated Music) -> Mastered -14 LUFS
 * Hero Motif: Seamless Infinite Loop + Pill-to-Stage Expansion + 8-Column Architectural Slats
 */
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { z } from "zod";
import {
  T3AudioLayer,
  T3E_THEME,
  T3FastFilmGrain,
  type T3EAudioCue,
} from "../components/T3CodeEditorPrimitives";
import { sec } from "../lib/studioMotion";
import { T3EDarkClimaxScene } from "../scenes/t3code-editor/T3EDarkClimaxScene";
import { T3EEditorDemoScene } from "../scenes/t3code-editor/T3EEditorDemoScene";
import { T3EFinaleLockupScene } from "../scenes/t3code-editor/T3EFinaleLockupScene";
import { T3EHookRailScene } from "../scenes/t3code-editor/T3EHookRailScene";
import { T3ESubscriptionSwapScene } from "../scenes/t3code-editor/T3ESubscriptionSwapScene";

export const t3CodeEditorLaunchSchema = z.object({
  brandName: z.string(),
  ctaUrl: z.string(),
  bpm: z.number().min(100).max(145),
});

export type T3CodeEditorLaunchProps = z.infer<typeof t3CodeEditorLaunchSchema>;

export const defaultT3CodeEditorLaunchProps: T3CodeEditorLaunchProps = {
  brandName: "T3Code",
  ctaUrl: "t3code.dev",
  bpm: 120,
};

export const getT3CodeEditorTotalFrames = (_bpm: number, fps: number): number => {
  return sec(16.6, fps); // 498 frames @ 30fps (16.60s)
};

export const T3CodeEditorLaunch: React.FC<T3CodeEditorLaunchProps> = (props) => {
  const { fps } = useVideoConfig();

  // Precision 16.60s (498f @ 30fps) Seamless Loop Timeline:
  // Note: Beat 4 (f324..f414) overlaps Beat 5 (f396..f498) by 18 frames so Beat 4's
  // actual "One fast editor." surface physically peels upward to reveal Beat 5 directly underneath!
  const s1Start = 0;                 // f0   (0.00s) — 3 Landed Cards -> Bounce Pulse -> Merge @ f44 -> IDE Unfold
  const s2Start = sec(3.3, fps);     // f99  (3.30s) — Dark macOS IDE + Macro Diff + 4.5x Portal Match Cut
  const s3Start = sec(7.8, fps);     // f234 (7.80s) — Portal Catch + Accelerating Slot-Drum -> Pill-to-Stage Expansion
  const s4Start = sec(10.8, fps);    // f324 (10.8s) — Obsidian Climax (90f total, peels directly over Beat 5 at f396..f414)
  const s5Start = sec(13.2, fps);    // f396 (13.2s) — Finale Lockup sits directly underneath Beat 4's peel -> 3-Card Loop Morph
  const total = sec(16.6, fps);      // f498 (16.6s)

  const cues: T3EAudioCue[] = [
    // Beat 1: 3 staggered bounce pulses (Claude f2, Codex f9, Gemini f16) -> merge snap @ f44
    { frame: 2, src: "sfx/pop-subtle.wav", volume: 0.34, playbackRate: 0.96 },
    { frame: 9, src: "sfx/pop-subtle.wav", volume: 0.36, playbackRate: 1.02 },
    { frame: 16, src: "sfx/pop-subtle.wav", volume: 0.38, playbackRate: 1.08 },
    { peakAtFrame: 44, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.34 },
    { frame: 44, src: "sfx/sub-hit-soft.wav", volume: 0.42 },
    { frame: 44, src: "sfx/click-01.wav", volume: 0.44 },
    { peakAtFrame: 53, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.28 },
    { peakAtFrame: s2Start, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.34 },

    // Beat 2: IDE top-bar unfold + provider clicks + macro diff stream + Apply + 4.5x Portal Match Cut
    { frame: s2Start, src: "sfx/click-02.wav", volume: 0.36 },
    { frame: s2Start + 16, src: "sfx/click-03.wav", volume: 0.32, playbackRate: 0.99 },
    { peakAtFrame: s2Start + 33, peakOffsetSec: 0.32, src: "sfx/whoosh-deep.wav", volume: 0.30 },
    { frame: s2Start + 36, src: "sfx/click-01.wav", volume: 0.36, playbackRate: 1.03 },
    { frame: s2Start + 42, src: "sfx/key-01.wav", volume: 0.22, playbackRate: 0.97 },
    { frame: s2Start + 50, src: "sfx/key-02.wav", volume: 0.22, playbackRate: 1.0 },
    { frame: s2Start + 58, src: "sfx/key-03.wav", volume: 0.22, playbackRate: 1.03 },
    { frame: s2Start + 66, src: "sfx/key-04.wav", volume: 0.22, playbackRate: 1.06 },
    { peakAtFrame: s2Start + 83, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.28 },
    { frame: s2Start + 94, src: "sfx/click-02.wav", volume: 0.44 },
    { frame: s2Start + 96, src: "sfx/pop-subtle.wav", volume: 0.34, playbackRate: 1.05 },
    { peakAtFrame: s3Start, peakOffsetSec: 0.32, src: "sfx/whoosh-deep.wav", volume: 0.40 },

    // Beat 3: Portal catch snap + accelerating slot-drum ticks + Pill-to-Stage Expansion riser
    { frame: s3Start, src: "sfx/sub-hit-soft.wav", volume: 0.36 },
    { frame: s3Start + 29, src: "sfx/click-01.wav", volume: 0.36, playbackRate: 0.98 },
    { frame: s3Start + 42, src: "sfx/click-02.wav", volume: 0.38, playbackRate: 1.03 },
    { frame: s3Start + 53, src: "sfx/click-03.wav", volume: 0.40, playbackRate: 1.08 },
    { peakAtFrame: s4Start, peakOffsetSec: 1.0, src: "sfx/riser-1s.wav", volume: 0.32 },

    // Beat 4: Obsidian landing + simultaneous baseline flip
    { frame: s4Start, src: "sfx/sub-hit-heavy.wav", volume: 0.46 },
    { frame: s4Start + 36, src: "sfx/sub-hit-soft.wav", volume: 0.40 },
    { frame: s4Start + 36, src: "sfx/click-01.wav", volume: 0.36 },

    // Beat 5: 8-Slat Mechanical Retract whoosh + Warm Felt-Marimba Resolve + Loop-Back Morph Whoosh
    { peakAtFrame: s5Start + 6, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.32 },
    { frame: s5Start + 6, src: "sfx/resolve-warm.wav", volume: 0.28 },
    { peakAtFrame: s5Start + 88, peakOffsetSec: 0.32, src: "sfx/whoosh-deep.wav", volume: 0.26 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: T3E_THEME.canvasMid, overflow: "hidden" }}>
      <Sequence from={s1Start} durationInFrames={s2Start - s1Start}>
        <T3EHookRailScene />
      </Sequence>

      <Sequence from={s2Start} durationInFrames={s3Start - s2Start}>
        <T3EEditorDemoScene />
      </Sequence>

      <Sequence from={s3Start} durationInFrames={s4Start - s3Start}>
        <T3ESubscriptionSwapScene />
      </Sequence>

      {/* Beat 5 mounts UNDERNEATH Beat 4 at f396 so Beat 4's 8 white-edged slats physically peel it open! */}
      <Sequence from={s5Start} durationInFrames={total - s5Start}>
        <T3EFinaleLockupScene ctaUrl={props.ctaUrl} />
      </Sequence>

      <Sequence from={s4Start} durationInFrames={90}>
        <T3EDarkClimaxScene />
      </Sequence>

      <T3FastFilmGrain opacity={0.022} />
      <T3AudioLayer cues={cues} />
    </AbsoluteFill>
  );
};
