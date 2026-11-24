/**
 * Spotify — 16-Second 16:9 X Launch Film (Built with LaunchSkill)
 * Locked Technique Playbook: Playbook 4 — product-cinema
 * Tempo: 120 BPM · 30 FPS · 32 Beats (480 frames = 16.0s)
 * Audio: Pure 48 kHz Offline Procedural DSP Studio Foley (Zero Code-Generated Music) -> Mastered -14 LUFS
 * Hero Motif: The Spotify Green Play Disc (#1DB954) carried continuously:
 *   Vinyl Spindle -> 2.5D Now Playing -> Discovery Sweep -> 90° Hardware Whip-Swap -> Speaker Cone -> Spotify Mark
 */
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { z } from "zod";
import {
  SPOTIFY_THEME,
  SpotifyFilmGrain,
  SpotifySoundLayer,
  type SpotifySfxCue,
} from "../components/SpotifyMusicPrimitives";
import { createBeatGrid, sec } from "../lib/studioMotion";
import { SMConnectHandoffScene } from "../scenes/spotify-music/SMConnectHandoffScene";
import { SMDiscoveryLightScene } from "../scenes/spotify-music/SMDiscoveryLightScene";
import { SMFinaleLockupScene } from "../scenes/spotify-music/SMFinaleLockupScene";
import { SMHookPlayScene } from "../scenes/spotify-music/SMHookPlayScene";
import { SMNowPlaying25DScene } from "../scenes/spotify-music/SMNowPlaying25DScene";

export const spotifyMusicLaunchSchema = z.object({
  productName: z.string(),
  bpm: z.number(),
});

export type SpotifyMusicLaunchProps = z.infer<typeof spotifyMusicLaunchSchema>;

export const defaultSpotifyMusicLaunchProps: SpotifyMusicLaunchProps = {
  productName: "Spotify",
  bpm: 120,
};

export const getSpotifyMusicTotalFrames = (bpm: number, fps: number): number => {
  const g = createBeatGrid(bpm, fps);
  return g.beat(32); // 480 frames @ 30fps (16.0s)
};

export const SpotifyMusicLaunch: React.FC<SpotifyMusicLaunchProps> = (props) => {
  const { fps } = useVideoConfig();
  const g = createBeatGrid(props.bpm, fps);

  // Tighter 16.0s beat-locked edit boundaries (120 BPM => 15f/beat @ 30fps)
  const s1Start = g.beat(0);  // f0   (0.0s)  — Vinyl-Spindle 3.4x Macro Punch-Out (2.5s)
  const s2Start = g.beat(5);  // f75  (2.5s)  — 2.5D Phone Now Playing + Exploded Lyrics -> Portal (4.0s)
  const s3Start = g.beat(13); // f195 (6.5s)  — Light-Paper Discovery 1.55x Macro Sweep -> Whip-Pan (4.0s)
  const s4Start = g.beat(21); // f315 (10.5s) — Center-Locked 90° Hardware Whip-Swap Connect (3.0s)
  const s5Start = g.beat(27); // f405 (13.5s) — Finale Speaker Cone -> Spotify Mark Lockup (2.5s)
  const total = g.beat(32);   // f480 (16.0s)

  // Crisp SFX-only sound design (17 purposeful cues, peak-aligned within ±0 frames)
  const sfxCues: SpotifySfxCue[] = [
    // Beat 1: Vinyl Spindle Play Disc depress + soundwave burst + 3.4x -> 1.0x pull-back
    { frame: s1Start + 10, src: "sfx/click-01.wav", volume: 0.46 },
    { frame: s1Start + 11, src: "sfx/sub-hit-soft.wav", volume: 0.38 },
    { peakAtFrame: s1Start + 20, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.34 },

    // Beat 2: 2.5D Phone arrival + Z-exploded Lyrics pop + Portal Zoom riser into Light Polarity
    { peakAtFrame: s2Start, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.30 },
    { frame: s2Start + sec(0.68, fps), src: "sfx/pop-subtle.wav", volume: 0.34, playbackRate: 1.04 },
    { frame: s2Start + sec(1.85, fps), src: "sfx/click-02.wav", volume: 0.24, playbackRate: 1.02 },
    { peakAtFrame: s3Start, peakOffsetSec: 1.0, src: "sfx/riser-1s.wav", volume: 0.30 },

    // Beat 3: Light Polarity impact + lateral camera sweep + wide pull-back + horizontal whip-pan
    { frame: s3Start, src: "sfx/sub-hit-heavy.wav", volume: 0.44 },
    { peakAtFrame: s3Start + 42, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.32 },
    { frame: s3Start + 38, src: "sfx/click-02.wav", volume: 0.36, playbackRate: 0.98 },
    { frame: s3Start + 72, src: "sfx/click-03.wav", volume: 0.38, playbackRate: 1.05 },
    { peakAtFrame: s4Start, peakOffsetSec: 0.32, src: "sfx/whoosh-deep.wav", volume: 0.38 },

    // Beat 4: Connect arrival + 2 crisp 90° edge-on hardware whip-swaps
    { frame: s4Start, src: "sfx/sub-hit-soft.wav", volume: 0.38 },
    { peakAtFrame: s4Start + 28, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.30 },
    { frame: s4Start + 28, src: "sfx/click-01.wav", volume: 0.36, playbackRate: 0.96 },
    { peakAtFrame: s4Start + 56, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.32 },
    { frame: s4Start + 56, src: "sfx/click-02.wav", volume: 0.38, playbackRate: 1.06 },

    // Beat 5: Finale Speaker Cone -> Spotify Mark Arc Reveal + Warm Felt-Marimba Resolve
    { peakAtFrame: s5Start, peakOffsetSec: 0.16, src: "sfx/whoosh-fast.wav", volume: 0.28 },
    { frame: s5Start + 2, src: "sfx/click-01.wav", volume: 0.34 },
    { frame: s5Start + 4, src: "sfx/resolve-warm.wav", volume: 0.30 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: SPOTIFY_THEME.obsidianBg }}>
      <Sequence from={s1Start} durationInFrames={s2Start - s1Start}>
        <SMHookPlayScene />
      </Sequence>

      <Sequence from={s2Start} durationInFrames={s3Start - s2Start}>
        <SMNowPlaying25DScene />
      </Sequence>

      <Sequence from={s3Start} durationInFrames={s4Start - s3Start}>
        <SMDiscoveryLightScene />
      </Sequence>

      <Sequence from={s4Start} durationInFrames={s5Start - s4Start}>
        <SMConnectHandoffScene />
      </Sequence>

      <Sequence from={s5Start} durationInFrames={total - s5Start}>
        <SMFinaleLockupScene />
      </Sequence>

      <SpotifyFilmGrain opacity={0.024} />
      <SpotifySoundLayer cues={sfxCues} />
    </AbsoluteFill>
  );
};
