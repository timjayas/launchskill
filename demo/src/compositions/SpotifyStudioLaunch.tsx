/**
 * Spotify — Studio X Product Launch Video (26.0s / 52 beats @ 120 BPM, 100% FPS-agnostic)
 *
 * Mandatory Light-First Brand Token Derivation (Zero Blur Circles, Zero Cloned Defaults):
 *   1. Surface Polarity:   Pure Light Gallery White (#FFFFFF / #F7F7F5 / #F3F8F5) across 100% of runtime
 *   2. Primary Accent:     Spotify Green (#1DB954) + High-Contrast Editorial Green (#0F8A3E)
 *   3. Corner Geometry:    Soft Organic Consumer (20–26px cards + 999px pills)
 *   4. Typography:         Inter (400–800) + italic Instrument Serif editorial accents + JetBrains Mono (tabular-nums)
 *   5. Motion Temperament: tactile-snappy with hierarchical secondary settle & true directional velocity blur
 *
 * 6-Shot BPM Beat-Grid Blueprint (52 beats @ 120 BPM = 26.0s = 780f @ 30fps):
 *   1. Beats  0 ->  7 (3.5s): Frame-0 Alive Pure White Hook + 6-Card Orbital Bespoke Album Burst -> Implosion
 *   2. Beats  7 -> 18 (5.5s): Studio Paper AI Prompt -> Hard-Cut 2.12x Macro Typing & Click -> 3-Beat Light Strobe + Counter HUD
 *   3. Beats 18 -> 30 (6.0s): Directional Whip-Pan -> Light Lossless Player -> <SpatialCameraRig> Push -> Forward/Back Live Scrub & Save
 *   4. Beats 30 -> 40 (5.0s): Clip-Path Wipe -> Mint-White Mood Slot-Drum (blurY) -> Whip-Pan -> 1-to-1 Wired Smart Crossfade Pipeline
 *   5. Beats 40 -> 46 (3.0s): Hard Beat-Cut -> Pure White Inline Device Slot-Swap (Spotify Connect) -> Peak-Velocity Zoom-Through
 *   6. Beats 46 -> 52 (3.0s): Pure White Iconic Spotify Mark->Wordmark Lockup + High-Contrast CTA Pill & URL Calm Hold
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import {
  SPOTIFY_STUDIO_THEME,
  SoundTrackLayer,
  TiledFilmGrainOverlay,
  type SfxCue,
} from "../components/SpotifyStudioPrimitives";
import { createBeatGrid, ensureStudioFontsRaceFree, sec } from "../lib/studioMotion";
import { SpotifyConnectScene } from "../scenes/spotify/SpotifyConnectScene";
import { SpotifyFinaleScene } from "../scenes/spotify/SpotifyFinaleScene";
import { SpotifyHookScene } from "../scenes/spotify/SpotifyHookScene";
import { SpotifyMixPipelineScene } from "../scenes/spotify/SpotifyMixPipelineScene";
import { SpotifyPlayerMacroScene } from "../scenes/spotify/SpotifyPlayerMacroScene";
import { SpotifyPromptStrobeScene } from "../scenes/spotify/SpotifyPromptStrobeScene";

export const spotifyStudioLaunchSchema = z.object({
  brandName: z.string(),
  badgeText: z.string(),
  hookLine1: z.string(),
  hookLine2Prefix: z.string(),
  hookLine2Serif: z.string(),
  subline: z.string(),
  promptQuery: z.string(),
  libraryCountTarget: z.number(),
  playlistTitle: z.string(),
  trackTitle: z.string(),
  trackArtist: z.string(),
  audioSpecBadge: z.string(),
  syncedLyrics: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  slotMoods: z.array(z.string()).min(6).max(10),
  pipelineHeadlineMuted: z.string(),
  pipelineHeadlineSerif: z.string(),
  connectLine1: z.string(),
  connectLine2Prefix: z.string(),
  connectLine2Serif: z.string(),
  connectDevices: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  ctaTaglinePrefix: z.string(),
  ctaTaglineSerif: z.string(),
  ctaButtonText: z.string(),
  ctaUrl: z.string(),
  accentColor: z.string(),
  bpm: z.number().min(100).max(140),
  enableSfx: z.boolean(),
  musicTrack: z.string().optional(),
  musicVolume: z.number().min(0).max(1),
});

export type SpotifyStudioLaunchProps = z.infer<typeof spotifyStudioLaunchSchema>;

export const defaultSpotifyStudioLaunchProps: SpotifyStudioLaunchProps = {
  brandName: "Spotify",
  badgeText: "SPOTIFY · AUDIO IN MOTION",
  hookLine1: "Every moment,",
  hookLine2Prefix: "has a",
  hookLine2Serif: "soundtrack.",
  subline: "Prompt playlists, lossless studio playback, and seamless beat-matched mixes.",
  promptQuery: "Late night rain in Seoul, 120 BPM",
  libraryCountTarget: 100000000,
  playlistTitle: "SEOUL RAIN · 120 BPM",
  trackTitle: "Midnight Neon",
  trackArtist: "Sora & Kenji",
  audioSpecBadge: "LOSSLESS · 24-BIT / 96 KHZ",
  syncedLyrics: [
    "City lights dissolve into the rain",
    "Neon reflections on wet glass",
    "Slow down the tempo, keep the bass",
    "Midnight in Seoul, nothing left to chase",
  ],
  slotMoods: [
    "Midnight Drive",
    "Deep Focus",
    "Vinyl Jazz",
    "Analog Synth",
    "Morning Run",
    "Late Night Dub",
    "Acoustic Warmth",
    "100M+ Tracks",
  ],
  pipelineHeadlineMuted: "Seamless mix.",
  pipelineHeadlineSerif: "Zero silence.",
  connectLine1: "Listen seamlessly",
  connectLine2Prefix: "across every",
  connectLine2Serif: "space.",
  connectDevices: ["AirPods Pro", "CarPlay Audio", "Studio Monitors", "MacBook Pro"],
  ctaTaglinePrefix: "Sound, tuned to your",
  ctaTaglineSerif: "moment.",
  ctaButtonText: "Listen Free",
  ctaUrl: "spotify.com",
  accentColor: SPOTIFY_STUDIO_THEME.green,
  bpm: 120,
  enableSfx: true,
  musicTrack: "audio/spotify-bed-120bpm.wav",
  musicVolume: 0.24,
};

export const SPOTIFY_STUDIO_BEAT_CUTS = {
  shot2: 7,
  shot3: 18,
  shot4: 30,
  shot5: 40,
  shot6: 46,
  total: 52,
} as const;

export const getSpotifyStudioTotalFrames = (bpm: number, fps: number): number => {
  const g = createBeatGrid(bpm, fps);
  return g.beat(SPOTIFY_STUDIO_BEAT_CUTS.total); // 780 frames @ 30fps, 120 BPM (26.0s)
};

export const SpotifyStudioLaunch: React.FC<SpotifyStudioLaunchProps> = (props) => {
  ensureStudioFontsRaceFree();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const g = createBeatGrid(props.bpm, fps);
  const s1Start = 0;
  const s2Start = g.beat(SPOTIFY_STUDIO_BEAT_CUTS.shot2); // 105f (3.5s)
  const s3Start = g.beat(SPOTIFY_STUDIO_BEAT_CUTS.shot3); // 270f (9.0s)
  const s4Start = g.beat(SPOTIFY_STUDIO_BEAT_CUTS.shot4); // 450f (15.0s)
  const s5Start = g.beat(SPOTIFY_STUDIO_BEAT_CUTS.shot5); // 600f (20.0s)
  const s6Start = g.beat(SPOTIFY_STUDIO_BEAT_CUTS.shot6); // 690f (23.0s)
  const total = g.beat(SPOTIFY_STUDIO_BEAT_CUTS.total);   // 780f (26.0s)

  const sfxCues: SfxCue[] = props.enableSfx
    ? [
        // Shot 2 Warm Paper cut + natural macro typing ticks + Create Mix click + Strobe cut + Whip-pan whoosh
        { frame: s2Start, src: "sfx/spotify-studio/cut-hit.wav", volume: 0.34 },
        { frame: s2Start + sec(0.84, fps), src: "sfx/spotify-studio/key-tick.wav", volume: 0.16 },
        { frame: s2Start + sec(1.12, fps), src: "sfx/spotify-studio/key-tick.wav", volume: 0.16 },
        { frame: s2Start + sec(1.42, fps), src: "sfx/spotify-studio/key-tick.wav", volume: 0.16 },
        { frame: s2Start + sec(1.74, fps), src: "sfx/spotify-studio/key-tick.wav", volume: 0.16 },
        { frame: s2Start + sec(2.68, fps), src: "sfx/spotify-studio/click.wav", volume: 0.44 },
        { frame: s2Start + sec(3.82, fps), src: "sfx/spotify-studio/cut-hit.wav", volume: 0.30 },
        { frame: s3Start - sec(0.14, fps), src: "sfx/spotify-studio/whoosh.wav", volume: 0.25 },

        // Shot 3 Macro Camera push whoosh + Save Heart click
        { frame: s3Start + sec(0.88, fps), src: "sfx/spotify-studio/whoosh.wav", volume: 0.22 },
        { frame: s3Start + sec(4.62, fps), src: "sfx/spotify-studio/click.wav", volume: 0.44 },

        // Shot 4 Forest curtain wipe hit + Slot detents + Mid-shot whip-pan + Harmonic Lock pop
        { frame: s4Start, src: "sfx/spotify-studio/cut-hit.wav", volume: 0.36 },
        { frame: s4Start + sec(0.56, fps), src: "sfx/spotify-studio/key-tick.wav", volume: 0.20 },
        { frame: s4Start + sec(1.16, fps), src: "sfx/spotify-studio/key-tick.wav", volume: 0.20 },
        { frame: s4Start + sec(2.24, fps), src: "sfx/spotify-studio/whoosh.wav", volume: 0.24 },
        { frame: s4Start + sec(3.73, fps), src: "sfx/spotify-studio/click.wav", volume: 0.38 },

        // Shot 5 Connect cut + Device swap ticks + Zoom-through whoosh
        { frame: s5Start, src: "sfx/spotify-studio/cut-hit.wav", volume: 0.36 },
        { frame: s5Start + sec(0.62, fps), src: "sfx/spotify-studio/key-tick.wav", volume: 0.18 },
        { frame: s5Start + sec(1.24, fps), src: "sfx/spotify-studio/key-tick.wav", volume: 0.18 },
        { frame: s6Start - sec(0.24, fps), src: "sfx/spotify-studio/whoosh.wav", volume: 0.26 },

        // Shot 6 Iconic Spotify Finale harmonic resolve
        { frame: s6Start + sec(0.08, fps), src: "sfx/spotify-studio/chime.wav", volume: 0.36 },
      ]
    : [];

  return (
    <AbsoluteFill
      style={{ backgroundColor: SPOTIFY_STUDIO_THEME.bg, overflow: "hidden" }}
      from={68}
    >
      {/* Shot 1: Frame-0 Alive Obsidian Hook + Orbital Bespoke Album Burst */}
      <Sequence durationInFrames={s2Start - s1Start}>
        <SpotifyHookScene
          badgeText={props.badgeText}
          hookLine1={props.hookLine1}
          hookLine2Prefix={props.hookLine2Prefix}
          hookLine2Serif={props.hookLine2Serif}
          subline={props.subline}
          accentColor={props.accentColor}
        />
      </Sequence>

      {/* Shot 2: Warm Editorial Paper Prompt -> Hard-Cut Macro Typing -> 3-Beat Retrieval Strobe */}
      <Sequence from={s2Start} durationInFrames={s3Start - s2Start}>
        <SpotifyPromptStrobeScene
          promptQuery={props.promptQuery}
          libraryCountTarget={props.libraryCountTarget}
          accentColor={props.accentColor}
        />
      </Sequence>

      {/* Shot 3: Obsidian Lossless Player + <SpatialCameraRig> Push + Forward/Back Live Scrub
          Extended by 0.34s beneath Shot 4's architectural clip-path curtain wipe for zero black flash */}
      <Sequence from={s3Start} durationInFrames={s4Start - s3Start + sec(0.34, fps)}>
        <SpotifyPlayerMacroScene
          playlistTitle={props.playlistTitle}
          trackTitle={props.trackTitle}
          trackArtist={props.trackArtist}
          audioSpecBadge={props.audioSpecBadge}
          syncedLyrics={props.syncedLyrics}
          accentColor={props.accentColor}
        />
      </Sequence>

      {/* Shot 4: Deep Forest Mood Slot-Drum -> 1-to-1 Wired Smart Crossfade Pipeline */}
      <Sequence from={s4Start} durationInFrames={s5Start - s4Start}>
        <SpotifyMixPipelineScene
          slotMoods={props.slotMoods}
          pipelineHeadlineMuted={props.pipelineHeadlineMuted}
          pipelineHeadlineSerif={props.pipelineHeadlineSerif}
          accentColor={props.accentColor}
        />
      </Sequence>

      {/* Shot 5: Fixed-Width Inline Device Slot-Swap (Spotify Connect) -> Zoom-Through */}
      <Sequence from={s5Start} durationInFrames={s6Start - s5Start}>
        <SpotifyConnectScene
          connectLine1={props.connectLine1}
          connectLine2Prefix={props.connectLine2Prefix}
          connectLine2Serif={props.connectLine2Serif}
          connectDevices={props.connectDevices}
          accentColor={props.accentColor}
        />
      </Sequence>

      {/* Shot 6: Iconic Spotify Brand Lockup + Calm CTA URL Hold */}
      <Sequence from={s6Start} durationInFrames={total - s6Start}>
        <SpotifyFinaleScene
          brandName={props.brandName}
          ctaTaglinePrefix={props.ctaTaglinePrefix}
          ctaTaglineSerif={props.ctaTaglineSerif}
          ctaButtonText={props.ctaButtonText}
          ctaUrl={props.ctaUrl}
          accentColor={props.accentColor}
        />
      </Sequence>

      {/* High-Speed Tiled Deterministic Film Grain (H.264 Anti-Banding Defense) */}
      <TiledFilmGrainOverlay frame={frame} fps={fps} opacity={0.024} />

      {/* Beat-Locked 120 BPM Groove Bed + Procedural 48 kHz WAV Micro-SFX */}
      <SoundTrackLayer
        musicTrack={props.musicTrack}
        musicVolume={props.musicVolume}
        cues={sfxCues}
      />
    </AbsoluteFill>
  );
};
