/**
 * Spotify — Studio X Product Launch Video (26s / 780 frames @ 30fps, 120 BPM, 1920x1080)
 * Art Direction: Multi-Archetype Studio System (Kinetic Studio + Editorial Brand Punch)
 * Engine: Pure 2D + Exact Focal-Lock <SpatialCameraRig> + Velocity-Coupled Blur (100% deterministic)
 *
 * Beat-Locked Multi-Shot Arc (120 BPM = 15 frames/beat @ 30fps, 52 beats total):
 *   1. Beats  0–6  (3.0s): Frame-0 scroll-stopper hook + 8-card orbital bespoke album burst -> implosion
 *   2. Beats  6–15 (4.5s): Wide prompt bar -> Hard-cut 2.45x macro typing & click -> 3-beat full-bleed strobe + counter HUD
 *   3. Beats 15–25 (5.0s): Whip-pan into obsidian Spotify player -> Macro Camera Rig push -> Forward/back tactile scrub + save
 *   4. Beats 25–32 (3.5s): Clip-path wipe -> Asymmetric split (33%/68%) accelerating mood/genre slot-machine drum -> green swipe
 *   5. Beats 32–40 (4.0s): Deep forest-obsidian chapter -> 1-to-1 wired Smart Crossfade -> Synced Lyrics live pulse pipeline
 *   6. Beats 40–46 (3.0s): Hard beat-cut -> Locked-width inline device slot-swap (Spotify Connect) -> Peak-velocity match-cut
 *   7. Beats 46–52 (3.0s): Museum-whitespace obsidian Spotify brand lockup + high-contrast green CTA pill (2.6s calm hold)
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import {
  FilmGrainOverlay,
  SpatialCameraRig,
  TactileCursor,
} from "../components/StudioPrimitives";
import {
  computeVelocityBlur,
  createBeatGrid,
  EASE_HUMAN_MOTOR,
  EASE_IN_EXPO,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  ensureStudioFonts,
  FONT_MONO,
  FONT_SANS,
  getCaretOpacity,
  getNaturalTypedLength,
  SPRING_EDITORIAL,
  SPRING_POP,
  SPRING_SNAPPY,
} from "../lib/motion";

const FONT_INSTRUMENT_SERIF = "'Instrument Serif', 'Playfair Display', Georgia, serif";

export const spotifyLaunchSchema = z.object({
  productName: z.string(),
  hookBadge: z.string(),
  hookLine1: z.string(),
  hookLine2Prefix: z.string(),
  hookLine2Serif: z.string(),
  promptPlaceholder: z.string(),
  promptQuery: z.string(),
  libraryCountTarget: z.number(),
  playlistTitle: z.string(),
  trackTitle: z.string(),
  trackArtist: z.string(),
  audioSpecBadge: z.string(),
  slotMoods: z.array(z.string()).min(6).max(10),
  pipelineHeadlineMuted: z.string(),
  pipelineHeadlineSerif: z.string(),
  syncedLyrics: z.tuple([z.string(), z.string(), z.string()]),
  connectLine1: z.string(),
  connectLine2Prefix: z.string(),
  connectDevices: z.array(z.string()).length(4),
  ctaTaglinePrefix: z.string(),
  ctaTaglineSerif: z.string(),
  ctaButtonText: z.string(),
  ctaUrl: z.string(),
  bpm: z.number().min(100).max(144),
  musicSrc: z.string(),
  musicVolume: z.number().min(0).max(1),
  sfxEnabled: z.boolean(),
  sfxVolume: z.number().min(0).max(1),
  theme: z.object({
    green: z.string(),
    greenBright: z.string(),
    obsidian: z.string(),
    surfaceDark: z.string(),
    lightBg: z.string(),
    inkLight: z.string(),
    inkMuted: z.string(),
    forestBg: z.string(),
  }),
});

export type SpotifyLaunchProps = z.infer<typeof spotifyLaunchSchema>;

export const defaultSpotifyLaunchProps: SpotifyLaunchProps = {
  productName: "Spotify",
  hookBadge: "SPOTIFY",
  hookLine1: "Every sound,",
  hookLine2Prefix: "in ",
  hookLine2Serif: "motion.",
  promptPlaceholder: "Describe a mood, tempo, or scene...",
  promptQuery: "Late night Tokyo rain, 118 BPM",
  libraryCountTarget: 100000000,
  playlistTitle: "Tokyo Rain · 118 BPM",
  trackTitle: "Midnight Rain",
  trackArtist: "Kaito & Sora",
  audioSpecBadge: "LOSSLESS · 24-BIT",
  slotMoods: [
    "Deep Focus",
    "Late Night Drive",
    "Morning Run",
    "Vinyl Jazz",
    "Indie Acoustic",
    "Synthwave",
    "Lo-Fi Beats",
    "100M+ Tracks",
  ],
  pipelineHeadlineMuted: "Seamless mix.",
  pipelineHeadlineSerif: "Zero silence.",
  syncedLyrics: [
    "Neon reflections on the glass",
    "Every heartbeat stays in time",
    "Turn the midnight into gold",
  ],
  connectLine1: "Start on one screen.",
  connectLine2Prefix: "Keep playing on ",
  connectDevices: ["iPhone", "Desktop", "Speaker", "CarPlay"],
  ctaTaglinePrefix: "Music for ",
  ctaTaglineSerif: "every moment.",
  ctaButtonText: "Listen free",
  ctaUrl: "spotify.com",
  bpm: 120,
  musicSrc: "audio/spotify-bed-120bpm.wav",
  musicVolume: 0.48,
  sfxEnabled: true,
  sfxVolume: 0.44,
  theme: {
    green: "#1DB954",
    greenBright: "#1ED760",
    obsidian: "#09090B",
    surfaceDark: "#121216",
    lightBg: "#FFFFFF",
    inkLight: "#0A0A0C",
    inkMuted: "#71717A",
    forestBg: "#08140E",
  },
};

export const getSpotifyLaunchTotalFrames = (bpm: number, fps: number): number => {
  const g = createBeatGrid(bpm, fps);
  return g.beat(52); // 26.0s / 780 frames @ 120 BPM, 30fps
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const formatTime = (seconds: number): string => {
  const clamped = Math.max(0, Math.floor(seconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

// ============================================================================
// Iconic Spotify Brand Mark (Precision Vector SVG)
// ============================================================================
const SpotifyMark: React.FC<{ size?: number; bg?: string; stroke?: string }> = ({
  size = 56,
  bg = "#1ED760",
  stroke = "#09090B",
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="32" cy="32" r="30" fill={bg} />
    <g transform="rotate(7 32 32)">
      <path
        d="M16.5 23.2C26.5 20.1 40.2 20.8 48.8 25.4"
        stroke={stroke}
        strokeWidth="4.8"
        strokeLinecap="round"
      />
      <path
        d="M19.2 33.1C27.5 30.6 38.6 31.3 45.6 35.1"
        stroke={stroke}
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path
        d="M21.8 42.3C28.4 40.4 36.8 41.0 42.3 44.0"
        stroke={stroke}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

// ============================================================================
// Bespoke Geometric Album Cover Art (Zero broken external images)
// ============================================================================
interface AlbumMeta {
  id: string;
  title: string;
  artist: string;
  bpm: string;
  duration: string;
  bg: string;
  fg: string;
  accent: string;
  pattern: "vinyl" | "bauhaus" | "bars" | "horizon" | "grid" | "arcs" | "monolith" | "wave";
}

const ALBUMS: AlbumMeta[] = [
  {
    id: "midnight",
    title: "Midnight Rain",
    artist: "Kaito & Sora",
    bpm: "118 BPM",
    duration: "3:42",
    bg: "#0F172A",
    fg: "#E2E8F0",
    accent: "#1ED760",
    pattern: "vinyl",
  },
  {
    id: "shibuya",
    title: "Shibuya 02:14",
    artist: "Haru Matsuda",
    bpm: "118 BPM",
    duration: "3:18",
    bg: "#431407",
    fg: "#FFEDD5",
    accent: "#FB923C",
    pattern: "bars",
  },
  {
    id: "glass",
    title: "Glass Umbrella",
    artist: "Nora Lin",
    bpm: "116 BPM",
    duration: "4:05",
    bg: "#1E1B4B",
    fg: "#E0E7FF",
    accent: "#60A5FA",
    pattern: "bauhaus",
  },
  {
    id: "velvet",
    title: "Velvet Pulse",
    artist: "Solstice Club",
    bpm: "120 BPM",
    duration: "3:51",
    bg: "#052E16",
    fg: "#DCFCE7",
    accent: "#1ED760",
    pattern: "arcs",
  },
  {
    id: "amber",
    title: "Amber Tape",
    artist: "Milo Vance",
    bpm: "94 BPM",
    duration: "2:58",
    bg: "#451A03",
    fg: "#FEF3C7",
    accent: "#F59E0B",
    pattern: "horizon",
  },
  {
    id: "cobalt",
    title: "Blue Hour",
    artist: "Elena Ross",
    bpm: "124 BPM",
    duration: "3:29",
    bg: "#172554",
    fg: "#DBEAFE",
    accent: "#38BDF8",
    pattern: "grid",
  },
  {
    id: "slate",
    title: "Mono Chrome",
    artist: "Taktik",
    bpm: "128 BPM",
    duration: "4:12",
    bg: "#18181B",
    fg: "#FAFAFA",
    accent: "#A1A1AA",
    pattern: "monolith",
  },
  {
    id: "plum",
    title: "Afterglow",
    artist: "Soraia",
    bpm: "112 BPM",
    duration: "3:36",
    bg: "#3B0764",
    fg: "#F3E8FF",
    accent: "#F472B6",
    pattern: "wave",
  },
];

const AlbumCoverArt: React.FC<{
  album: AlbumMeta;
  size: number;
  radius?: number;
  frame?: number;
  showLabel?: boolean;
}> = ({ album, size, radius = 16, frame = 0, showLabel = false }) => {
  const spin = (frame * 0.7) % 360;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: album.bg,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: "block" }}>
        {album.pattern === "vinyl" && (
          <g transform={`rotate(${spin} 100 100)`}>
            <circle cx="100" cy="100" r="82" fill="none" stroke={album.fg} strokeOpacity="0.14" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="64" fill="none" stroke={album.fg} strokeOpacity="0.2" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="46" fill="none" stroke={album.accent} strokeOpacity="0.65" strokeWidth="2.5" strokeDasharray="48 16" />
            <circle cx="100" cy="100" r="24" fill={album.accent} />
            <circle cx="100" cy="100" r="7" fill={album.bg} />
          </g>
        )}
        {album.pattern === "bars" && (
          <>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <rect
                key={i}
                x={22 + i * 24}
                y={34 + ((i * 23) % 44)}
                width="14"
                height={132 - ((i * 19) % 42)}
                rx="7"
                fill={i % 2 === 0 ? album.accent : album.fg}
                fillOpacity={i % 2 === 0 ? 0.92 : 0.25}
              />
            ))}
          </>
        )}
        {album.pattern === "bauhaus" && (
          <>
            <path d="M 0 100 A 100 100 0 0 1 100 0 L 100 100 Z" fill={album.accent} fillOpacity="0.88" />
            <circle cx="128" cy="126" r="46" fill={album.fg} fillOpacity="0.92" />
            <circle cx="128" cy="126" r="20" fill={album.bg} />
            <rect x="24" y="132" width="44" height="44" rx="8" fill={album.fg} fillOpacity="0.22" />
          </>
        )}
        {album.pattern === "arcs" && (
          <>
            <circle cx="100" cy="180" r="130" fill="none" stroke={album.accent} strokeWidth="12" strokeOpacity="0.9" />
            <circle cx="100" cy="180" r="96" fill="none" stroke={album.fg} strokeWidth="8" strokeOpacity="0.35" />
            <circle cx="100" cy="180" r="62" fill="none" stroke={album.accent} strokeWidth="6" strokeOpacity="0.65" />
            <circle cx="100" cy="48" r="14" fill={album.fg} />
          </>
        )}
        {album.pattern === "horizon" && (
          <>
            <circle cx="100" cy="94" r="48" fill={album.accent} />
            <rect x="0" y="108" width="200" height="92" fill={album.bg} />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={28 + i * 10}
                y={116 + i * 14}
                width={144 - i * 20}
                height="4"
                rx="2"
                fill={album.fg}
                fillOpacity={0.65 - i * 0.11}
              />
            ))}
          </>
        )}
        {album.pattern === "grid" && (
          <>
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={38 + c * 41}
                  cy={38 + r * 41}
                  r={(r + c) % 3 === 0 ? 15 : 8}
                  fill={(r + c) % 3 === 0 ? album.accent : album.fg}
                  fillOpacity={(r + c) % 3 === 0 ? 0.92 : 0.25}
                />
              ))
            )}
          </>
        )}
        {album.pattern === "monolith" && (
          <>
            <rect x="28" y="28" width="64" height="144" rx="10" fill={album.fg} />
            <rect x="108" y="28" width="64" height="64" rx="10" fill={album.accent} fillOpacity="0.45" />
            <circle cx="140" cy="140" r="32" fill="#1ED760" />
          </>
        )}
        {album.pattern === "wave" && (
          <>
            <path
              d="M -10 112 Q 45 48 100 112 T 210 112 L 210 210 L -10 210 Z"
              fill={album.accent}
              fillOpacity="0.88"
            />
            <path
              d="M -10 144 Q 45 92 100 144 T 210 144 L 210 210 L -10 210 Z"
              fill={album.fg}
              fillOpacity="0.22"
            />
            <circle cx="148" cy="54" r="18" fill={album.fg} fillOpacity="0.92" />
          </>
        )}
      </svg>

      {showLabel && (
        <div
          style={{
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 12,
            padding: "8px 10px",
            borderRadius: 10,
            backgroundColor: "rgba(9,9,11,0.72)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div
            style={{
              fontSize: Math.max(12, Math.round(size * 0.082)),
              fontWeight: 700,
              color: "#FAFAFA",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {album.title}
          </div>
          <div
            style={{
              fontSize: Math.max(10, Math.round(size * 0.064)),
              fontWeight: 500,
              color: "rgba(255,255,255,0.68)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {album.artist}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Device Vector Icons for Shot 6 (Spotify Connect Inline Slot)
// ============================================================================
const DeviceIcon: React.FC<{ index: number; color: string }> = ({ index, color }) => {
  if (index === 0) {
    // iPhone
    return (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="2.5" width="12" height="19" rx="3" stroke={color} strokeWidth="2.1" />
        <line x1="10" y1="18.2" x2="14" y2="18.2" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    );
  }
  if (index === 1) {
    // Desktop / Laptop
    return (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="4.5" width="17" height="12" rx="2.2" stroke={color} strokeWidth="2.1" />
        <line x1="2" y1="19.5" x2="22" y2="19.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (index === 2) {
    // Hi-Fi Speaker
    return (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="2.5" width="14" height="19" rx="3" stroke={color} strokeWidth="2.1" />
        <circle cx="12" cy="7.5" r="1.5" fill={color} />
        <circle cx="12" cy="14.5" r="3.6" stroke={color} strokeWidth="2.1" />
      </svg>
    );
  }
  // CarPlay / Dashboard
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.8" stroke={color} strokeWidth="2.1" />
      <circle cx="12" cy="12" r="2.2" fill={color} />
      <path d="M5 10.5H19M12 14.2V20.5" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
};

// ============================================================================
// Custom Dark/Light Active Chrome Card (Spotify Green Native)
// ============================================================================
const SpotifyNodeCard: React.FC<{
  title: string;
  accentColor: string;
  width: number;
  height: number;
  dark?: boolean;
  badge?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ title, accentColor, width, height, dark = false, badge, style, children }) => (
  <div
    style={{
      width,
      height,
      backgroundColor: dark ? "#0E1C15" : "#FFFFFF",
      border: `2.5px solid ${accentColor}`,
      borderRadius: 24,
      boxShadow: dark
        ? `0 28px 72px rgba(0,0,0,0.45), 0 0 0 5px ${accentColor}16`
        : `0 24px 64px rgba(10,10,12,0.10), 0 0 0 5px ${accentColor}16`,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: FONT_SANS,
      ...style,
    }}
  >
    <div
      style={{
        height: 50,
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderBottom: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid #F1F1F4",
        backgroundColor: dark ? "#0A1510" : "#FAFAFA",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          backgroundColor: accentColor,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 18,
          fontWeight: 650,
          letterSpacing: "-0.02em",
          color: dark ? "#F0FDF4" : "#18181B",
        }}
      >
        {title}
      </span>
      {badge && (
        <span
          style={{
            marginLeft: "auto",
            fontFamily: FONT_MONO,
            fontSize: 13,
            fontWeight: 600,
            color: accentColor,
            backgroundColor: dark ? "rgba(30,215,96,0.12)" : "rgba(29,185,84,0.10)",
            padding: "4px 10px",
            borderRadius: 999,
          }}
        >
          {badge}
        </span>
      )}
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
  </div>
);

// ============================================================================
// Orbital Album Coordinates (Shot 1 — Guaranteed zero headline overlap)
// ============================================================================
const ORBIT_SLOTS = [
  { dx: -685, dy: -310, size: 172, rot: -5, albumIdx: 0 },
  { dx: -290, dy: -365, size: 162, rot: 3, albumIdx: 1 },
  { dx: 290, dy: -365, size: 162, rot: -3, albumIdx: 2 },
  { dx: 685, dy: -310, size: 172, rot: 5, albumIdx: 3 },
  { dx: 690, dy: 295, size: 172, rot: -4, albumIdx: 4 },
  { dx: 290, dy: 360, size: 162, rot: 3, albumIdx: 5 },
  { dx: -290, dy: 360, size: 162, rot: -3, albumIdx: 6 },
  { dx: -690, dy: 295, size: 172, rot: 4, albumIdx: 7 },
];

// ============================================================================
// Main Composition: SpotifyLaunch
// ============================================================================
export const SpotifyLaunch: React.FC<SpotifyLaunchProps> = (props) => {
  ensureStudioFonts();

  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const g = createBeatGrid(props.bpm, fps);
  const { theme } = props;

  // Beat-locked shot boundaries (52 beats = 780 frames @ 120 BPM, 30 fps)
  const s1End = g.beat(6);  // 90:  Hook + Orbital Album Burst
  const s2End = g.beat(15); // 225: Macro Typing Punch-In + 3-Beat Crate-Digging Strobe
  const s3End = g.beat(25); // 375: Obsidian Live Player + Macro Camera Rig + Tactile Scrub
  const s4End = g.beat(32); // 480: Accelerating Vertical Mood Slot Drum
  const s5End = g.beat(40); // 600: 1-to-1 Wired Smart Crossfade -> Synced Lyrics
  const s6End = g.beat(46); // 690: Inline Device Slot-Swap (Spotify Connect) -> Match-Cut
  const s7End = g.beat(52); // 780: Obsidian Brand Lockup & CTA End Card

  // Chromatic Spotify Green Pattern-Interrupt Swipe bridging Shot 4 -> Shot 5 (centered on s4End)
  const swipeStart = s4End - 8;
  const swipeEnd = s4End + 8;
  const swipeVisible = frame >= swipeStart && frame <= swipeEnd;
  const swipeX = interpolate(frame, [swipeStart, s4End, swipeEnd], [105, 0, -105], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  // Optional audio bed fade-out
  const bedFadeOut = interpolate(
    frame,
    [durationInFrames - fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Frame-accurate tactile SFX cue sheet (locked to exact visual action frames)
  const sfxCues: Array<{ frame: number; src: string; gain: number; durFrames?: number }> = [
    // Shot 1: Orbital burst + snap implosion
    { frame: 18, src: "sfx/orb-whoosh.wav", gain: 0.34, durFrames: 20 },
    { frame: s1End - 12, src: "sfx/orb-whoosh.wav", gain: 0.38, durFrames: 20 },

    // Shot 2: Natural typing ticks + submit click + causal iris bloom + strobe hits + depth dive
    { frame: s1End + 19, src: "sfx/key-tick.wav", gain: 0.42, durFrames: 6 },
    { frame: s1End + 24, src: "sfx/key-tick.wav", gain: 0.38, durFrames: 6 },
    { frame: s1End + 28, src: "sfx/key-tick.wav", gain: 0.44, durFrames: 6 },
    { frame: s1End + 33, src: "sfx/key-tick.wav", gain: 0.40, durFrames: 6 },
    { frame: s1End + 38, src: "sfx/key-tick.wav", gain: 0.42, durFrames: 6 },
    { frame: s1End + 43, src: "sfx/key-tick.wav", gain: 0.38, durFrames: 6 },
    { frame: s1End + 48, src: "sfx/key-tick.wav", gain: 0.44, durFrames: 6 },
    { frame: s1End + 53, src: "sfx/key-tick.wav", gain: 0.40, durFrames: 6 },
    { frame: s1End + 66, src: "sfx/ui-click.wav", gain: 0.92, durFrames: 8 },
    { frame: s1End + 69, src: "sfx/bloom-hit.wav", gain: 0.85, durFrames: 22 },
    { frame: s1End + 94, src: "sfx/bloom-hit.wav", gain: 0.68, durFrames: 20 },
    { frame: s1End + 112, src: "sfx/bloom-hit.wav", gain: 0.72, durFrames: 20 },
    { frame: s2End - 9, src: "sfx/depth-dive.wav", gain: 0.56, durFrames: 20 },

    // Shot 3: Save click + clean transition into Shot 4 (no scrub/squish noise!)
    { frame: s2End + 128, src: "sfx/ui-click.wav", gain: 0.92, durFrames: 8 },
    { frame: s3End - 10, src: "sfx/curtain-swipe.wav", gain: 0.42, durFrames: 18 },

    // Shot 4: Mood slot-machine rotary detents + Spotify Green chromatic swipe
    { frame: s3End + 14, src: "sfx/slot-detent.wav", gain: 0.70, durFrames: 6 },
    { frame: s3End + 33, src: "sfx/slot-detent.wav", gain: 0.72, durFrames: 6 },
    { frame: s3End + 52, src: "sfx/slot-detent.wav", gain: 0.74, durFrames: 6 },
    { frame: s3End + 65, src: "sfx/slot-detent.wav", gain: 0.60, durFrames: 6 },
    { frame: s3End + 74, src: "sfx/slot-detent.wav", gain: 0.56, durFrames: 6 },
    { frame: s3End + 82, src: "sfx/slot-detent.wav", gain: 0.54, durFrames: 6 },
    { frame: s4End - 7, src: "sfx/curtain-swipe.wav", gain: 0.48, durFrames: 18 },

    // Shot 5: Beat cut into Shot 6
    { frame: s5End - 1, src: "sfx/bloom-hit.wav", gain: 0.62, durFrames: 20 },

    // Shot 6: Spotify Connect inline device swap ticks + vertical Spotify Green curtain
    { frame: s5End + 4, src: "sfx/slot-detent.wav", gain: 0.72, durFrames: 6 },
    { frame: s5End + 21, src: "sfx/slot-detent.wav", gain: 0.72, durFrames: 6 },
    { frame: s5End + 38, src: "sfx/slot-detent.wav", gain: 0.74, durFrames: 6 },
    { frame: s5End + 55, src: "sfx/slot-detent.wav", gain: 0.76, durFrames: 6 },
    { frame: s6End - 8, src: "sfx/curtain-swipe.wav", gain: 0.48, durFrames: 18 },

    // Shot 7: Radiant Cmaj9 studio resolve chime on emblem & wordmark lockup
    { frame: s6End + 4, src: "sfx/finale-chime.wav", gain: 0.92, durFrames: 66 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.lightBg,
        fontFamily: FONT_SANS,
        overflow: "hidden",
      }}
    >
      {/* 120 BPM Beat-Locked Background Music Bed */}
      {props.musicSrc.trim().length > 0 && (
        <Audio
          src={staticFile(props.musicSrc)}
          volume={props.musicVolume * bedFadeOut}
        />
      )}

      {/* Frame-Accurate Tactile SFX Layer */}
      {props.sfxEnabled &&
        sfxCues.map((cue, idx) => (
          <Sequence
            key={`${cue.src}-${cue.frame}-${idx}`}
            from={Math.max(0, cue.frame)}
            durationInFrames={cue.durFrames ?? 20}
          >
            <Audio
              src={staticFile(cue.src)}
              volume={Math.min(0.85, props.sfxVolume * cue.gain)}
            />
          </Sequence>
        ))}

      {/* =====================================================================
          SHOT 1 (Beats 0–6 / f 0–90): Frame-0 Scroll-Stopper + Orbital Albums
      ===================================================================== */}
      {frame < s1End && (() => {
        const lf = frame;

        // Frame-0 alive: progress starts >= 0.45 at frame 0 (never empty or dark)
        const line1P = interpolate(lf, [-8, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });
        const line2P = interpolate(lf, [-2, 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });

        // Snap implosion into Shot 2's centered prompt bar
        const implode = interpolate(lf, [s1End - 12, s1End], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_EXPO,
        });

        const centerScale = 1 - implode * 0.24;
        const centerOpacity = 1 - implode * 0.92;

        return (
          <AbsoluteFill style={{ backgroundColor: theme.lightBg }}>
            {/* Subtle soft Spotify green studio aura (zero harsh neon) */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 1120,
                height: 680,
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(ellipse at center, rgba(30,215,96,0.11) 0%, rgba(30,215,96,0.03) 48%, transparent 74%)",
                pointerEvents: "none",
              }}
            />

            {/* 8 Orbital Bespoke Album Cards bursting cleanly around safe zone */}
            {ORBIT_SLOTS.map((slot, idx) => {
              const burstStart = 18 + idx * 2;
              const burstIn = spring({
                frame: Math.max(0, lf - burstStart),
                fps,
                config: SPRING_EDITORIAL,
              });
              const drift = Math.sin((lf + idx * 11) * 0.08) * 6;
              const radialFactor = burstIn * (1 - implode);
              const x = 960 + slot.dx * radialFactor;
              const y = 540 + slot.dy * radialFactor + drift * burstIn * (1 - implode);
              const scale = (0.45 + burstIn * 0.55) * (1 - implode * 0.72);
              const opacity = clamp01(burstIn * 1.4) * (1 - implode);

              return (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: x - slot.size / 2,
                    top: y - slot.size / 2,
                    transform: `scale(${scale}) rotate(${slot.rot * (1 - implode)}deg)`,
                    opacity,
                    boxShadow: "0 20px 44px rgba(10,10,12,0.14)",
                    borderRadius: 18,
                  }}
                >
                  <AlbumCoverArt
                    album={ALBUMS[slot.albumIdx]}
                    size={slot.size}
                    radius={18}
                    frame={lf}
                    showLabel
                  />
                </div>
              );
            })}

            {/* Centered Foveal Anchor Headline (Live on Frame 0) */}
            <AbsoluteFill
              style={{
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${centerScale})`,
                opacity: centerOpacity,
                padding: "90px 120px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Brand Pill */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 22px 10px 12px",
                    borderRadius: 999,
                    backgroundColor: "#F4F4F5",
                    border: "1px solid rgba(10,10,12,0.08)",
                    marginBottom: 28,
                    transform: `translateY(${(1 - line1P) * 14}px)`,
                  }}
                >
                  <SpotifyMark size={30} bg={theme.greenBright} stroke="#09090B" />
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: theme.inkLight,
                    }}
                  >
                    {props.hookBadge}
                  </span>
                </div>

                {/* Line 1 (Two-Tone Muted) */}
                <div style={{ overflow: "hidden", paddingBottom: 4 }}>
                  <div
                    style={{
                      fontSize: 108,
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      lineHeight: 1.03,
                      color: theme.inkMuted,
                      transform: `translateY(${(1 - line1P) * 48}px)`,
                    }}
                  >
                    {props.hookLine1}
                  </div>
                </div>

                {/* Line 2 (Crisp Ink + Italic Instrument Serif) */}
                <div style={{ overflow: "hidden", paddingBottom: 10 }}>
                  <div
                    style={{
                      fontSize: 108,
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      lineHeight: 1.03,
                      color: theme.inkLight,
                      transform: `translateY(${(1 - line2P) * 56}px)`,
                      display: "flex",
                      alignItems: "baseline",
                    }}
                  >
                    <span>{props.hookLine2Prefix}</span>
                    <span
                      style={{
                        fontFamily: FONT_INSTRUMENT_SERIF,
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: 126,
                        letterSpacing: "-0.015em",
                        color: theme.inkLight,
                        marginLeft: 26,
                      }}
                    >
                      {props.hookLine2Serif}
                    </span>
                  </div>
                </div>
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })()}

      {/* =====================================================================
          SHOT 2 (Beats 6–15 / f 90–225): Shared-Element Pill Morph -> Smooth Macro Typing ->
          Causal Submit Bloom -> 3-Beat Crate-Digging Strobe -> Velocity-Matched Depth Dive
      ===================================================================== */}
      {frame >= s1End && frame < s2End && (() => {
        const lf = frame - s1End; // 0..135
        const isStrobePhase = lf >= 76;

        if (!isStrobePhase) {
          // Shared-Element Pill Morph out of Shot 1's implosion (lf 0..14)
          const pillMorph = interpolate(lf, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE_OUT_EXPO,
          });
          const pillWidth = interpolate(pillMorph, [0, 1], [116, 1080]);
          const pillContentOp = interpolate(lf, [7, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Smooth 8-frame optical camera push-in (1.0 -> 1.78x) synced with typing start
          const macroPush = interpolate(lf, [14, 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE_OUT_EXPO,
          });

          const typedCount = getNaturalTypedLength(props.promptQuery, lf, 18, 25, fps);
          const typedText = props.promptQuery.slice(0, typedCount);
          const isTyping = lf >= 18 && typedCount < props.promptQuery.length;
          const caretOp = getCaretOpacity(lf, isTyping, fps);

          // Keep full typed prompt + green submit button cleanly framed during macro punch-in
          const caretWorldX = 820 + typedCount * 5.2;
          const panToButton = interpolate(lf, [55, 65], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE_IN_OUT_QUINT,
          });
          const targetMacroX = interpolate(panToButton, [0, 1], [Math.min(970, caretWorldX), 990]);
          const zoom = 1 + macroPush * 0.68; // 1.0 -> 1.68x smoothly (keeps entire prompt + submit button unclipped!)
          const focusX = interpolate(macroPush, [0, 1], [960, targetMacroX]);

          // Tactile cursor glides onto green submit button and presses at lf=66
          const clickFrame = 66;
          const cursorT = interpolate(lf, [54, 64], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE_IN_OUT_QUINT,
          });
          const cursorX = interpolate(cursorT, [0, 1], [1240, 1442]);
          const cursorY = interpolate(cursorT, [0, 1], [665, 544]);
          const cursorClickScale = interpolate(
            lf,
            [clickFrame, clickFrame + 2, clickFrame + 6],
            [1, 0.84, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const btnScale = interpolate(
            lf,
            [clickFrame, clickFrame + 2, clickFrame + 7],
            [1, 0.86, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const haloActive = lf >= clickFrame;

          // Causal radial midnight-iris bloom expanding directly out of the clicked submit button (lf 68..76)
          const submitBloomP = interpolate(lf, [68, 76], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE_IN_EXPO,
          });

          return (
            <AbsoluteFill style={{ backgroundColor: theme.lightBg }}>
              <SpatialCameraRig focusX={focusX} focusY={540} zoom={zoom}>
                <div style={{ width: 1920, height: 1080, position: "relative" }}>
                  {/* Subtle editorial eyebrow above prompt bar */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 392,
                      textAlign: "center",
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      color: theme.inkMuted,
                      fontFamily: FONT_MONO,
                      opacity: pillContentOp,
                      transform: `translateY(${(1 - pillMorph) * 14}px)`,
                    }}
                  >
                    AI PLAYLIST  ·  DESCRIBE ANY VIBE
                  </div>

                  {/* Shared-Element Morphing Spotify Prompt Pill (centered around x=960) */}
                  <div
                    style={{
                      position: "absolute",
                      left: 960 - pillWidth / 2,
                      top: 484,
                      width: pillWidth,
                      height: 112,
                      borderRadius: 999,
                      backgroundColor: "#FFFFFF",
                      border: haloActive
                        ? `2.5px solid ${theme.green}`
                        : "2px solid #E4E4E7",
                      boxShadow: haloActive
                        ? "0 24px 60px rgba(29,185,84,0.22), 0 0 0 8px rgba(30,215,96,0.16)"
                        : "0 20px 54px rgba(10,10,12,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: pillMorph < 0.25 ? "center" : "flex-start",
                      padding: pillMorph < 0.25 ? "0" : "0 20px 0 28px",
                      gap: 20,
                      overflow: "hidden",
                    }}
                  >
                    <SpotifyMark size={44} bg={theme.greenBright} stroke="#09090B" />

                    {/* Prompt Text Field */}
                    {pillMorph >= 0.25 && (
                      <div
                        style={{
                          flex: 1,
                          fontSize: 36,
                          fontWeight: 600,
                          letterSpacing: "-0.025em",
                          color: typedCount > 0 ? theme.inkLight : "#A1A1AA",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          opacity: pillContentOp,
                        }}
                      >
                        <span>{typedCount > 0 ? typedText : props.promptPlaceholder}</span>
                        {macroPush > 0.4 && (
                          <span
                            style={{
                              display: "inline-block",
                              width: 3.5,
                              height: 40,
                              marginLeft: 4,
                              borderRadius: 2,
                              backgroundColor: theme.green,
                              opacity: caretOp,
                            }}
                          />
                        )}
                      </div>
                    )}

                    {/* Circular Green Submit Pill */}
                    {pillMorph >= 0.35 && (
                      <div
                        style={{
                          position: "relative",
                          width: 68,
                          height: 68,
                          flexShrink: 0,
                          opacity: pillContentOp,
                        }}
                      >
                        <div
                          style={{
                            width: 68,
                            height: 68,
                            borderRadius: 999,
                            backgroundColor: theme.greenBright,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: `scale(${btnScale})`,
                            boxShadow: "0 10px 24px rgba(29,185,84,0.30)",
                          }}
                        >
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 19V5M12 5L6 11M12 5L18 11"
                              stroke="#09090B"
                              strokeWidth="2.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Causal Radial Iris Bloom originating directly from the clicked Submit button (1446, 540) */}
                  {submitBloomP > 0.005 && (
                    <div
                      style={{
                        position: "absolute",
                        left: 1446,
                        top: 540,
                        width: 90,
                        height: 90,
                        borderRadius: 999,
                        backgroundColor: "#0F172A",
                        border: `5px solid ${theme.greenBright}`,
                        transform: `translate(-50%, -50%) scale(${0.6 + submitBloomP * 28})`,
                        zIndex: 70,
                      }}
                    />
                  )}

                  {/* Tactile Cursor inside World Space */}
                  {lf >= 54 && submitBloomP < 0.35 && (
                    <TactileCursor
                      x={cursorX}
                      y={cursorY}
                      scale={cursorClickScale * 0.92}
                      fill="#0A0A0C"
                    />
                  )}
                </div>
              </SpatialCameraRig>
            </AbsoluteFill>
          );
        }

        // Phase C (lf 76..135): 3-Beat Full-Bleed Crate-Digging Strobe + Zero-Gap Velocity-Matched Depth Dive
        const strobeIdx = lf < 94 ? 0 : lf < 112 ? 1 : 2;
        const strobeFrames = [
          {
            bg: "#0F172A",
            accent: "#38BDF8",
            title: "MIDNIGHT DRIFT",
            tag: "SYNTH · 118 BPM · TOKYO",
            album: ALBUMS[0],
            count: "34,820,400",
            status: "Scanning 100M+ tracks",
            done: false,
          },
          {
            bg: "#431407",
            accent: "#FB923C",
            title: "SHIBUYA RAIN",
            tag: "LO-FI · 118 BPM · LATE NIGHT",
            album: ALBUMS[1],
            count: "87,190,110",
            status: "Matching key & energy",
            done: false,
          },
          {
            bg: "#052E16",
            accent: "#1ED760",
            title: "VELVET PULSE",
            tag: "AMBIENT · 118 BPM · LOCKED",
            album: ALBUMS[3],
            count: "14 tracks mixed",
            status: "Playlist ready",
            done: true,
          },
        ];
        const activeStrobe = strobeFrames[strobeIdx];
        const strobeLocal = strobeIdx === 0 ? lf - 76 : strobeIdx === 1 ? lf - 94 : lf - 112;
        const posterEnterScale = interpolate(strobeLocal, [0, 12], [1.06, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });

        // Zero-gap Velocity-Matched Scale-Through Depth Dive into Shot 3's Obsidian Player (lf 124..135)
        const diveOut = interpolate(lf, [124, 135], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_EXPO,
        });
        const bgColor =
          strobeIdx === 2
            ? interpolateColors(diveOut, [0, 1], [activeStrobe.bg, theme.obsidian])
            : activeStrobe.bg;
        const diveScale = posterEnterScale + diveOut * 0.34;
        const diveBlur = diveOut * 9;
        const diveContentOp = 1 - diveOut * 0.85;

        return (
          <AbsoluteFill style={{ backgroundColor: bgColor }}>
            {/* Full-Bleed Graphic Poster Backdrop (scales toward camera at peak velocity, zero edge gaps!) */}
            <AbsoluteFill
              style={{
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${diveScale})`,
                filter: diveBlur > 0.3 ? `blur(${diveBlur.toFixed(1)}px)` : undefined,
                opacity: diveContentOp,
              }}
            >
              {/* Huge subtle background watermark typography */}
              <div
                style={{
                  position: "absolute",
                  fontSize: 220,
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  color: "rgba(255,255,255,0.06)",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >
                {activeStrobe.title}
              </div>

              {/* Crisp Editorial Split Poster inside Safe Zone */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 72,
                  padding: "0 140px",
                }}
              >
                <div
                  style={{
                    boxShadow: "0 36px 90px rgba(0,0,0,0.45)",
                    borderRadius: 28,
                    border: `2px solid ${activeStrobe.accent}`,
                  }}
                >
                  <AlbumCoverArt
                    album={activeStrobe.album}
                    size={380}
                    radius={26}
                    frame={lf * 2}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: activeStrobe.accent,
                    }}
                  >
                    {activeStrobe.tag}
                  </div>
                  <div
                    style={{
                      fontSize: 94,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      lineHeight: 0.98,
                      color: "#FAFAFA",
                    }}
                  >
                    {activeStrobe.title}
                  </div>
                  <div
                    style={{
                      fontSize: 30,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.72)",
                    }}
                  >
                    {activeStrobe.album.artist}  ·  {activeStrobe.album.duration}
                  </div>
                </div>
              </div>
            </AbsoluteFill>

            {/* Anchored Bottom-Center Live Counter HUD */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: 96,
                transform: `translate(-50%, ${diveOut * 28}px)`,
                opacity: 1 - diveOut,
                display: "inline-flex",
                alignItems: "center",
                gap: 18,
                padding: "16px 30px",
                borderRadius: 999,
                backgroundColor: "rgba(9,9,11,0.78)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.16)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  backgroundColor: activeStrobe.done ? theme.greenBright : activeStrobe.accent,
                }}
              />
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {activeStrobe.status}
              </span>
              <span
                style={{
                  width: 1,
                  height: 22,
                  backgroundColor: "rgba(255,255,255,0.20)",
                }}
              />
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 22,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                  color: activeStrobe.done ? theme.greenBright : "#FAFAFA",
                }}
              >
                {activeStrobe.count}
              </span>
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* =====================================================================
          SHOT 3 (Beats 15–25 / f 225–375): Obsidian Live Spotify Player + Macro Scrub
      ===================================================================== */}
      {frame >= s2End && frame < s3End && (() => {
        const lf = frame - s2End; // 0..150

        // Velocity-matched scale-through arrival directly out of Shot 2's obsidian depth dive (zero edge gaps!)
        const diveIn = interpolate(lf, [0, 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });
        const enterScale = 0.88 + diveIn * 0.12;
        const enterOp = interpolate(lf, [0, 5], [0.25, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Macro Camera Rig: full-frame (0..28) -> zoom onto scrub bar (28..46) -> hold -> pull out (106..126)
        const pushIn = interpolate(lf, [28, 46], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_OUT_QUINT,
        });
        const pullOut = interpolate(lf, [106, 124], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_OUT_QUINT,
        });
        const zoomP = Math.max(0, pushIn - pullOut);
        const zoom = (1 + zoomP * 0.54) * enterScale; // Smoothly decelerates into 1.0, then zooms 1.54x -> 1.0
        const focusX = 960;
        const focusY = interpolate(zoomP, [0, 1], [540, 845]);

        // Forward-AND-Back Tactile Scrubbing (Rule #10!)
        // Scrub bar world geometry: x=530..1390 (width=860), y=874
        const scrubForward = interpolate(lf, [54, 78], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_HUMAN_MOTOR,
        });
        const scrubBack = interpolate(lf, [83, 104], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_HUMAN_MOTOR,
        });
        const passivePlay = lf < 54 ? lf * 0.0014 : lf > 104 ? (lf - 104) * 0.0015 : 0;
        const scrubFrac = clamp01(0.32 + scrubForward * 0.40 - scrubBack * 0.21 + passivePlay);
        const currentSec = scrubFrac * 222; // 3:42 = 222s

        // Scrub bar thumb coordinates inside 1920x1080 player layout
        const barLeft = 530;
        const barWidth = 860;
        const barY = 874;
        const thumbX = barLeft + scrubFrac * barWidth;

        // Tactile Cursor path: arrives on thumb -> drags forward & back -> glides to Save button & clicks at lf=128
        const cursorArrive = interpolate(lf, [40, 51], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_OUT_QUINT,
        });
        const cursorToSave = interpolate(lf, [112, 126], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_OUT_QUINT,
        });

        let cursorX = interpolate(cursorArrive, [0, 1], [1080, thumbX]);
        let cursorY = interpolate(cursorArrive, [0, 1], [760, barY]);
        if (lf >= 51 && lf < 112) {
          cursorX = thumbX;
          cursorY = barY;
        } else if (lf >= 112) {
          cursorX = interpolate(cursorToSave, [0, 1], [thumbX, 742]);
          cursorY = interpolate(cursorToSave, [0, 1], [barY, 636]);
        }

        const isDragging = lf >= 53 && lf <= 105;
        const saveClickFrame = 128;
        const saved = lf >= saveClickFrame;
        const savedPop = spring({
          frame: Math.max(0, lf - saveClickFrame),
          fps,
          config: SPRING_POP,
        });
        const cursorScale = isDragging
          ? 0.88
          : interpolate(lf, [saveClickFrame, saveClickFrame + 2, saveClickFrame + 6], [1, 0.84, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

        // Velocity boost on spectrum bars while scrubbing
        const prevScrubF = Math.max(0, lf - 1);
        const prevFwd = interpolate(prevScrubF, [54, 78], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_HUMAN_MOTOR,
        });
        const prevBack = interpolate(prevScrubF, [83, 104], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_HUMAN_MOTOR,
        });
        const scrubSpeed = Math.abs(scrubForward * 0.4 - scrubBack * 0.21 - (prevFwd * 0.4 - prevBack * 0.21)) * 45;

        return (
          <AbsoluteFill
            style={{
              backgroundColor: theme.obsidian,
            }}
          >
            {/* Subtle radial emerald glow behind player */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "44%",
                width: 1380,
                height: 760,
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(ellipse at center, rgba(30,215,96,0.11) 0%, rgba(30,215,96,0.02) 50%, transparent 75%)",
                pointerEvents: "none",
                opacity: enterOp,
              }}
            />

            <SpatialCameraRig focusX={focusX} focusY={focusY} zoom={zoom}>
              <div style={{ width: 1920, height: 1080, position: "relative" }}>
                {/* Orthogonal 2D Spotify App Window (1520 x 790, centered cleanly inside safe zone) */}
                <div
                  style={{
                    position: "absolute",
                    left: 200,
                    top: 145,
                    width: 1520,
                    height: 790,
                    borderRadius: 24,
                    backgroundColor: theme.surfaceDark,
                    border: "1px solid rgba(255,255,255,0.11)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.10), 0 42px 110px rgba(0,0,0,0.65)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  {/* App Header Chrome */}
                  <div
                    style={{
                      height: 64,
                      padding: "0 28px",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#0E0E12",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <SpotifyMark size={28} bg={theme.greenBright} stroke="#09090B" />
                      <span
                        style={{
                          fontSize: 19,
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          color: "#FAFAFA",
                        }}
                      >
                        {props.playlistTitle}
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#A1A1AA",
                          padding: "4px 10px",
                          borderRadius: 999,
                          backgroundColor: "rgba(255,255,255,0.06)",
                        }}
                      >
                        AI Mix · 14 Tracks
                      </span>
                    </div>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 14px",
                        borderRadius: 999,
                        backgroundColor: "rgba(30,215,96,0.12)",
                        border: "1px solid rgba(30,215,96,0.28)",
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 999,
                          backgroundColor: theme.greenBright,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 14,
                          fontWeight: 600,
                          color: theme.greenBright,
                        }}
                      >
                        {props.audioSpecBadge}
                      </span>
                    </div>
                  </div>

                  {/* Main Body: Now Playing Hero (Left) + Queue (Right) */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      padding: "36px 42px",
                      gap: 48,
                    }}
                  >
                    {/* Left Now Playing Column */}
                    <div style={{ width: 610, display: "flex", flexDirection: "column", gap: 24 }}>
                      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
                        <div
                          style={{
                            borderRadius: 20,
                            boxShadow: "0 24px 54px rgba(0,0,0,0.5)",
                          }}
                        >
                          <AlbumCoverArt
                            album={ALBUMS[0]}
                            size={250}
                            radius={20}
                            frame={lf + scrubFrac * 180}
                          />
                        </div>

                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                          <span
                            style={{
                              fontFamily: FONT_MONO,
                              fontSize: 14,
                              fontWeight: 600,
                              letterSpacing: "0.08em",
                              color: theme.greenBright,
                            }}
                          >
                            NOW PLAYING
                          </span>
                          <div
                            style={{
                              fontSize: 40,
                              fontWeight: 700,
                              letterSpacing: "-0.03em",
                              lineHeight: 1.08,
                              color: "#FAFAFA",
                            }}
                          >
                            {props.trackTitle}
                          </div>
                          <div style={{ fontSize: 22, fontWeight: 500, color: "#A1A1AA" }}>
                            {props.trackArtist}
                          </div>

                          {/* Save / Library Action Pill */}
                          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 18px",
                                borderRadius: 999,
                                backgroundColor: saved
                                  ? theme.greenBright
                                  : "rgba(255,255,255,0.08)",
                                border: saved
                                  ? `1px solid ${theme.greenBright}`
                                  : "1px solid rgba(255,255,255,0.14)",
                                transform: saved ? `scale(${0.92 + savedPop * 0.08})` : "scale(1)",
                              }}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                {saved ? (
                                  <path
                                    d="M5 13l4 4L19 7"
                                    stroke="#09090B"
                                    strokeWidth="2.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                ) : (
                                  <path
                                    d="M12 5v14M5 12h14"
                                    stroke="#FAFAFA"
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                  />
                                )}
                              </svg>
                              <span
                                style={{
                                  fontSize: 16,
                                  fontWeight: 700,
                                  color: saved ? "#09090B" : "#FAFAFA",
                                }}
                              >
                                {saved ? "Saved to Library" : "Save Track"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Deterministic Live 28-Bar Audio Spectrum responding 1:1 to scrub */}
                      <div
                        style={{
                          height: 158,
                          borderRadius: 18,
                          backgroundColor: "#0B0B0E",
                          border: "1px solid rgba(255,255,255,0.07)",
                          padding: "20px 24px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontFamily: FONT_MONO,
                            fontSize: 13,
                            color: "#71717A",
                          }}
                        >
                          <span>LIVE SPECTRUM</span>
                          <span style={{ color: isDragging ? theme.greenBright : "#A1A1AA" }}>
                            {isDragging ? "SCRUBBING · REAL TIME" : "118 BPM · 96 kHz"}
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            height: 88,
                            gap: 6,
                          }}
                        >
                          {Array.from({ length: 28 }).map((_, i) => {
                            const phase = lf * 0.28 + scrubFrac * 18 + i * 0.55;
                            const wave =
                              0.26 +
                              0.44 * Math.abs(Math.sin(phase)) +
                              0.24 * Math.abs(Math.cos(phase * 0.63 + i * 0.25));
                            const boosted = Math.min(1, wave + scrubSpeed * 0.22);
                            const barPct = Math.round(boosted * 100);
                            const isPlayed = i / 28 <= scrubFrac;
                            return (
                              <div
                                key={i}
                                style={{
                                  flex: 1,
                                  height: `${Math.max(16, barPct)}%`,
                                  borderRadius: 999,
                                  backgroundColor: isPlayed
                                    ? theme.greenBright
                                    : "rgba(255,255,255,0.18)",
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Up-Next Queue Column */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: FONT_MONO,
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            color: "#A1A1AA",
                          }}
                        >
                          UP NEXT IN QUEUE
                        </span>
                        <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: "#71717A" }}>
                          SMART ORDER
                        </span>
                      </div>

                      {ALBUMS.slice(0, 4).map((trk, i) => {
                        const active = i === 0;
                        return (
                          <div
                            key={trk.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 18,
                              padding: "14px 18px",
                              borderRadius: 16,
                              backgroundColor: active
                                ? "rgba(30,215,96,0.10)"
                                : "rgba(255,255,255,0.03)",
                              border: active
                                ? "1px solid rgba(30,215,96,0.32)"
                                : "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <AlbumCoverArt album={trk} size={62} radius={10} frame={active ? lf : 0} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 21,
                                  fontWeight: 650,
                                  color: active ? theme.greenBright : "#FAFAFA",
                                  letterSpacing: "-0.02em",
                                }}
                              >
                                {trk.title}
                              </div>
                              <div style={{ fontSize: 16, color: "#A1A1AA", marginTop: 2 }}>
                                {trk.artist}
                              </div>
                            </div>
                            <span
                              style={{
                                fontFamily: FONT_MONO,
                                fontSize: 14,
                                color: active ? theme.greenBright : "#71717A",
                                padding: "4px 10px",
                                borderRadius: 8,
                                backgroundColor: "rgba(255,255,255,0.04)",
                              }}
                            >
                              {trk.bpm}
                            </span>
                            <span
                              style={{
                                fontFamily: FONT_MONO,
                                fontSize: 16,
                                fontVariantNumeric: "tabular-nums",
                                color: "#A1A1AA",
                                width: 52,
                                textAlign: "right",
                              }}
                            >
                              {trk.duration}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Transport & Live Tactile Scrubber */}
                  <div
                    style={{
                      height: 150,
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                      backgroundColor: "#0D0D11",
                      padding: "20px 42px 24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Transport Controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: theme.greenBright }}>
                        SHUFFLE
                      </span>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#FAFAFA">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                      </svg>
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 999,
                          backgroundColor: "#FAFAFA",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#09090B">
                          <rect x="6" y="5" width="4" height="14" rx="1" />
                          <rect x="14" y="5" width="4" height="14" rx="1" />
                        </svg>
                      </div>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#FAFAFA">
                        <path d="M16 6h2v12h-2zm-10 0v12l8.5-6z" />
                      </svg>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: "#71717A" }}>
                        CROSSFADE 6S
                      </span>
                    </div>

                    {/* Interactive Scrubber Row */}
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 20,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 20,
                          fontWeight: 600,
                          fontVariantNumeric: "tabular-nums",
                          color: isDragging ? theme.greenBright : "#FAFAFA",
                          width: 64,
                          textAlign: "right",
                        }}
                      >
                        {formatTime(currentSec)}
                      </span>

                      {/* Track Bar (980px wide, aligned to world x=470..1450) */}
                      <div
                        style={{
                          width: barWidth,
                          height: 10,
                          borderRadius: 999,
                          backgroundColor: "rgba(255,255,255,0.16)",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: `${scrubFrac * 100}%`,
                            height: "100%",
                            borderRadius: 999,
                            backgroundColor: theme.greenBright,
                          }}
                        />
                        {/* Thumb Handle */}
                        <div
                          style={{
                            position: "absolute",
                            left: `${scrubFrac * 100}%`,
                            top: "50%",
                            width: isDragging ? 26 : 20,
                            height: isDragging ? 26 : 20,
                            borderRadius: 999,
                            backgroundColor: "#FFFFFF",
                            border: `3px solid ${theme.greenBright}`,
                            transform: "translate(-50%, -50%)",
                            boxShadow: isDragging
                              ? "0 0 0 8px rgba(30,215,96,0.28)"
                              : "0 4px 12px rgba(0,0,0,0.45)",
                          }}
                        />
                      </div>

                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 20,
                          fontWeight: 500,
                          fontVariantNumeric: "tabular-nums",
                          color: "#71717A",
                          width: 64,
                        }}
                      >
                        3:42
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tactile Cursor inside World Space */}
                {lf >= 40 && (
                  <TactileCursor
                    x={cursorX}
                    y={cursorY}
                    scale={cursorScale}
                    fill={theme.greenBright}
                  />
                )}
              </div>
            </SpatialCameraRig>
          </AbsoluteFill>
        );
      })()}

      {/* =====================================================================
          SHOT 4 (Beats 25–32 / f 375–480): Accelerating Mood Slot-Machine Drum
      ===================================================================== */}
      {frame >= s3End - 10 && frame < s4End && (() => {
        const lf = frame - s3End; // -10..105 (enters with crisp 10f architectural clip-path wipe!)
        const wipePct = interpolate(lf, [-10, 0], [100, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_OUT_QUINT,
        });

        // 3 readable detents (0..18, 18..36, 36..54), then exponential speed-blur ramp (54..102)
        const getDrumIndex = (t: number): number => {
          if (t <= 14) return 0;
          if (t <= 20) return interpolate(t, [14, 20], [0, 1], { easing: EASE_OUT_EXPO });
          if (t <= 33) return 1;
          if (t <= 39) return interpolate(t, [33, 39], [1, 2], { easing: EASE_OUT_EXPO });
          if (t <= 52) return 2;
          // Exponential ramp through remaining moods 2 -> 7
          const rampP = interpolate(t, [52, 92], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE_IN_OUT_QUINT,
          });
          return 2 + rampP * (props.slotMoods.length - 3);
        };

        const drumIdx = getDrumIndex(Math.max(0, lf));
        const prevDrumIdx = getDrumIndex(Math.max(0, lf - 1));
        const rowHeight = 114;
        const drumY = -drumIdx * rowHeight;
        const prevDrumY = -prevDrumIdx * rowHeight;
        const drumBlur = computeVelocityBlur(drumY, prevDrumY, 0.24, 12);

        const activeMoodIdx = Math.min(
          props.slotMoods.length - 1,
          Math.max(0, Math.round(drumIdx))
        );
        const activeAlbum = ALBUMS[activeMoodIdx % ALBUMS.length];

        return (
          <AbsoluteFill
            style={{
              backgroundColor: theme.lightBg,
              clipPath: wipePct > 0.1 ? `inset(${wipePct.toFixed(1)}% 0 0 0)` : undefined,
            }}
          >
            {/* Asymmetric Split Foveal Anchor: 33% X Visual Card / 68% X Vertical Slot Drum */}
            <AbsoluteFill
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: "90px 140px",
                gap: 96,
              }}
            >
              {/* Left 33% X: Stationary Active Chrome Preview Node */}
              <div style={{ flexShrink: 0 }}>
                <SpotifyNodeCard
                  title="Spotify Mix"
                  accentColor={theme.green}
                  width={520}
                  height={560}
                  badge={activeAlbum.bpm}
                >
                  <div
                    style={{
                      padding: 32,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <AlbumCoverArt
                      album={activeAlbum}
                      size={320}
                      radius={22}
                      frame={Math.max(0, lf) * 2}
                    />

                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div
                          style={{
                            fontSize: 28,
                            fontWeight: 700,
                            letterSpacing: "-0.03em",
                            color: theme.inkLight,
                          }}
                        >
                          {props.slotMoods[activeMoodIdx]}
                        </div>
                        <div style={{ fontSize: 18, color: theme.inkMuted, marginTop: 2 }}>
                          {activeAlbum.title} · {activeAlbum.artist}
                        </div>
                      </div>

                      {/* Mini Live EQ Bars */}
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 32 }}>
                        {[0, 1, 2, 3].map((b) => {
                          const h = 10 + Math.abs(Math.sin(Math.max(0, lf) * 0.35 + b * 1.4)) * 22;
                          return (
                            <div
                              key={b}
                              style={{
                                width: 6,
                                height: h,
                                borderRadius: 999,
                                backgroundColor: theme.green,
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </SpotifyNodeCard>
              </div>

              {/* Right 68% X: Gradient-Masked Vertical Slot-Machine Label Drum */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: theme.green,
                  }}
                >
                  EVERY MOOD, INSTANTLY
                </div>

                {/* 3-Row Masked Drum Viewport */}
                <div
                  style={{
                    height: rowHeight * 3,
                    position: "relative",
                    overflow: "hidden",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: rowHeight,
                      left: 0,
                      right: 0,
                      transform: `translate3d(0, ${drumY}px, 0)`,
                      filter: drumBlur > 0.3 ? `blur(${drumBlur.toFixed(1)}px)` : undefined,
                    }}
                  >
                    {props.slotMoods.map((mood, idx) => {
                      const dist = Math.abs(idx - drumIdx);
                      const isCenter = dist < 0.45;
                      return (
                        <div
                          key={mood}
                          style={{
                            height: rowHeight,
                            display: "flex",
                            alignItems: "center",
                            fontSize: 82,
                            fontWeight: 700,
                            letterSpacing: "-0.04em",
                            lineHeight: 1,
                            color: isCenter ? theme.inkLight : "#A1A1AA",
                            opacity: Math.max(0.22, 1 - dist * 0.62),
                            whiteSpace: "nowrap",
                          }}
                        >
                          {mood}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })()}

      {/* =====================================================================
          SHOT 5 (Beats 32–40 / f 480–600): Tactile 3D Cover-Flow Crossfade +
          Authentic Full-Scale Kinetic Word-by-Word Spotify Synced Lyrics
      ===================================================================== */}
      {frame >= s4End && frame < s5End && (() => {
        const lf = frame - s4End; // 0..120

        const stageIn = spring({ frame: lf, fps, config: SPRING_EDITORIAL });

        // Smooth physical crossfade between Track A (Midnight Rain) -> Track B (Shibuya 02:14)
        const crossfadeP = interpolate(lf, [22, 84], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_OUT_QUINT,
        });

        // Organic atmospheric backdrop smoothly morphs from Midnight Cobalt -> Deep Terracotta
        const bgBase = interpolateColors(crossfadeP, [0, 1], ["#0A1020", "#1E0E08"]);
        const auraPrimary = interpolateColors(crossfadeP, [0, 1], ["#2563EB", "#EA580C"]);
        const auraSecondary = interpolateColors(crossfadeP, [0, 1], ["#1ED760", "#F59E0B"]);

        // 5-line scrolling Spotify Lyrics stage (active line glides smoothly to vertical center)
        const lyricLines = [
          "City lights blur past the train",
          props.syncedLyrics[0],
          props.syncedLyrics[1],
          props.syncedLyrics[2],
          "Never let the rhythm fade",
        ];

        // Smooth beat-locked vertical lyric scroll: holds line 1 (0..34) -> glides to line 2 (34..44) -> glides to line 3 (70..80)
        const scrollStep1 = interpolate(lf, [34, 46], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });
        const scrollStep2 = interpolate(lf, [70, 82], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });
        const scrollIdx = 1 + scrollStep1 + scrollStep2; // 1.0 -> 2.0 -> 3.0
        const lyricRowH = 148;
        const lyricContainerY = -scrollIdx * lyricRowH;

        // Track A (receding left in 3D cover-flow depth) & Track B (sweeping forward to hero focus)
        const trackAX = interpolate(crossfadeP, [0, 1], [0, -175]);
        const trackAZ = interpolate(crossfadeP, [0, 1], [0, -150]);
        const trackARotY = interpolate(crossfadeP, [0, 1], [0, 26]);
        const trackAScale = interpolate(crossfadeP, [0, 1], [1.02, 0.80]);
        const trackAOp = interpolate(crossfadeP, [0, 1], [1.0, 0.34]);

        const trackBX = interpolate(crossfadeP, [0, 1], [180, 0]);
        const trackBZ = interpolate(crossfadeP, [0, 1], [-150, 0]);
        const trackBRotY = interpolate(crossfadeP, [0, 1], [-26, 0]);
        const trackBScale = interpolate(crossfadeP, [0, 1], [0.80, 1.02]);
        const trackBOp = interpolate(crossfadeP, [0, 1], [0.34, 1.0]);

        return (
          <AbsoluteFill style={{ backgroundColor: bgBase }}>
            {/* Soft Painterly Dual-Track Color-Field Washes (Zero boxy borders!) */}
            <div
              style={{
                position: "absolute",
                left: "16%",
                top: "24%",
                width: 920,
                height: 760,
                borderRadius: 999,
                background: auraPrimary,
                opacity: 0.22,
                filter: "blur(120px)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "8%",
                bottom: "10%",
                width: 780,
                height: 620,
                borderRadius: 999,
                background: auraSecondary,
                opacity: 0.14,
                filter: "blur(120px)",
                pointerEvents: "none",
              }}
            />

            <AbsoluteFill
              style={{
                padding: "88px 130px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Top Minimal Editorial Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transform: `translateY(${(1 - stageIn) * 18}px)`,
                  opacity: stageIn,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                  <span
                    style={{
                      fontSize: 54,
                      fontWeight: 700,
                      letterSpacing: "-0.035em",
                      color: "rgba(255,255,255,0.52)",
                    }}
                  >
                    {props.pipelineHeadlineMuted}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_INSTRUMENT_SERIF,
                      fontStyle: "italic",
                      fontSize: 66,
                      fontWeight: 400,
                      letterSpacing: "-0.015em",
                      color: "#FAFAFA",
                    }}
                  >
                    {props.pipelineHeadlineSerif}
                  </span>
                </div>

                {/* Live Crossfade & Lyrics Pill */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 20px",
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    fontFamily: FONT_MONO,
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "#FAFAFA",
                  }}
                >
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 999,
                      backgroundColor: theme.greenBright,
                    }}
                  />
                  <span>SMART CROSSFADE  ·  LIVE LYRICS</span>
                </div>
              </div>

              {/* Asymmetric Split Stage: Left 3D Cover-Flow Deck (36% X) | Right Kinetic Lyrics (64% X) */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 88,
                  marginTop: 18,
                }}
              >
                {/* Left Focal Zone: Tactile 3D Cover-Flow Crossfade Deck + Morphing Mix Ribbon */}
                <div
                  style={{
                    width: 640,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 38,
                    flexShrink: 0,
                  }}
                >
                  {/* 3D Perspective Stage */}
                  <div
                    style={{
                      width: 620,
                      height: 410,
                      position: "relative",
                      perspective: 1100,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Track A: Midnight Rain (sweeps gently back-left) */}
                    <div
                      style={{
                        position: "absolute",
                        transform: `translate3d(${trackAX}px, 0, ${trackAZ}px) rotateY(${trackARotY}deg) scale(${trackAScale})`,
                        opacity: trackAOp,
                        zIndex: crossfadeP < 0.5 ? 20 : 10,
                        boxShadow: "0 36px 80px rgba(0,0,0,0.52)",
                        borderRadius: 28,
                      }}
                    >
                      <AlbumCoverArt
                        album={ALBUMS[0]}
                        size={360}
                        radius={28}
                        frame={lf * 1.6}
                        showLabel
                      />
                    </div>

                    {/* Track B: Shibuya 02:14 (glides forward into dead-center hero focus) */}
                    <div
                      style={{
                        position: "absolute",
                        transform: `translate3d(${trackBX}px, 0, ${trackBZ}px) rotateY(${trackBRotY}deg) scale(${trackBScale})`,
                        opacity: trackBOp,
                        zIndex: crossfadeP >= 0.5 ? 20 : 10,
                        boxShadow: "0 36px 80px rgba(0,0,0,0.52)",
                        borderRadius: 28,
                      }}
                    >
                      <AlbumCoverArt
                        album={ALBUMS[1]}
                        size={360}
                        radius={28}
                        frame={lf * 1.6}
                        showLabel
                      />
                    </div>
                  </div>

                  {/* Borderless Floating Crossfade Waveform Mix Ribbon */}
                  <div
                    style={{
                      width: 560,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontFamily: FONT_MONO,
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ color: crossfadeP < 0.5 ? "#60A5FA" : "rgba(255,255,255,0.42)" }}>
                        MIDNIGHT RAIN
                      </span>
                      <span style={{ color: theme.greenBright }}>
                        {Math.round(crossfadeP * 100)}% MIXED · 118 BPM
                      </span>
                      <span style={{ color: crossfadeP >= 0.5 ? "#FB923C" : "rgba(255,255,255,0.42)" }}>
                        SHIBUYA 02:14
                      </span>
                    </div>

                    {/* Live 28-bar Dual-Color Morphing Audio Waveform */}
                    <div
                      style={{
                        height: 54,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 6,
                      }}
                    >
                      {Array.from({ length: 28 }).map((_, i) => {
                        const frac = i / 27;
                        const beatWave =
                          0.28 +
                          0.52 * Math.abs(Math.sin(lf * 0.28 + i * 0.48)) +
                          0.20 * Math.abs(Math.cos(lf * 0.19 - i * 0.35));
                        const barH = Math.round(12 + beatWave * 40);
                        const activeBlend = frac <= crossfadeP;
                        const barColor = activeBlend
                          ? interpolateColors(frac, [0, 1], ["#1ED760", "#FB923C"])
                          : "rgba(96,165,250,0.45)";
                        return (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: barH,
                              borderRadius: 999,
                              backgroundColor: barColor,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Focal Zone: Authentic Full-Scale Kinetic Word-by-Word Spotify Lyrics */}
                <div
                  style={{
                    flex: 1,
                    height: 540,
                    position: "relative",
                    overflow: "hidden",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 196,
                      left: 0,
                      right: 0,
                      transform: `translate3d(0, ${lyricContainerY}px, 0)`,
                    }}
                  >
                    {lyricLines.map((line, lineIdx) => {
                      const dist = Math.abs(lineIdx - scrollIdx);
                      const isFocal = dist < 0.55;
                      const words = line.split(" ");

                      // Per-line word-by-word highlight window
                      const lineStart = lineIdx === 1 ? 6 : lineIdx === 2 ? 38 : lineIdx === 3 ? 74 : 0;

                      return (
                        <div
                          key={lineIdx}
                          style={{
                            height: lyricRowH,
                            display: "flex",
                            flexWrap: "wrap",
                            alignContent: "center",
                            gap: "6px 16px",
                            transform: `scale(${isFocal ? 1.0 : 0.94})`,
                            transformOrigin: "left center",
                            opacity: isFocal ? 1 : lineIdx < scrollIdx ? 0.30 : 0.22,
                          }}
                        >
                          {words.map((word, wIdx) => {
                            const wp = isFocal
                              ? interpolate(
                                  lf,
                                  [lineStart + wIdx * 4, lineStart + wIdx * 4 + 7],
                                  [0, 1],
                                  {
                                    extrapolateLeft: "clamp",
                                    extrapolateRight: "clamp",
                                    easing: EASE_OUT_EXPO,
                                  }
                                )
                              : lineIdx < scrollIdx
                              ? 1
                              : 0;

                            const color = isFocal
                              ? interpolateColors(wp, [0, 1], ["rgba(255,255,255,0.30)", "#FFFFFF"])
                              : "#FFFFFF";

                            return (
                              <span
                                key={wIdx}
                                style={{
                                  fontSize: 56,
                                  fontWeight: 800,
                                  letterSpacing: "-0.035em",
                                  lineHeight: 1.12,
                                  color,
                                  transform: isFocal ? `translateY(${(1 - wp) * 6}px)` : undefined,
                                }}
                              >
                                {word}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })()}

      {/* Chromatic Spotify Green Pattern-Interrupt Swipe (Shot 4 -> Shot 5) */}
      {swipeVisible && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(120deg, #1DB954 0%, #1ED760 52%, #15803D 100%)",
            transform: `translate3d(${swipeX}%, 0, 0)`,
            zIndex: 40,
          }}
        />
      )}

      {/* =====================================================================
          SHOT 6 (Beats 40–46 / f 600–690): Inline Device Slot-Swap (Spotify Connect)
      ===================================================================== */}
      {frame >= s5End && frame < s6End && (() => {
        const lf = frame - s5End; // 0..90

        const textIn = spring({ frame: lf, fps, config: SPRING_EDITORIAL });

        // Cycle 4 devices cleanly every 17 frames (~0.57s) with locked slot width
        const slotDur = 17;
        const deviceIdx = Math.min(
          props.connectDevices.length - 1,
          Math.floor(Math.max(0, lf - 4) / slotDur)
        );
        const slotLocal = Math.max(0, lf - 4) - deviceIdx * slotDur;
        const slotPop = interpolate(slotLocal, [0, 7], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });

        // Clean upward kinetic exit as the Spotify Green architectural curtain sweeps in (lf 76..88)
        const exitLift = interpolate(lf, [76, 88], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_EXPO,
        });

        return (
          <AbsoluteFill
            style={{
              backgroundColor: theme.lightBg,
              alignItems: "center",
              justifyContent: "center",
              padding: "90px 120px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
                transform: `translateY(${(1 - textIn) * 22 - exitLift * 64}px)`,
                opacity: textIn * (1 - exitLift * 0.9),
              }}
            >
              {/* Line 1 */}
              <div
                style={{
                  fontSize: 92,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.08,
                  color: theme.inkMuted,
                }}
              >
                {props.connectLine1}
              </div>

              {/* Line 2 with Locked-Width Inline Device Slot (Zero horizontal jitter!) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 92,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.08,
                  color: theme.inkLight,
                }}
              >
                <span>{props.connectLine2Prefix}</span>

                {/* Locked-Width Inline Device Pill */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 348,
                    height: 102,
                    marginLeft: 20,
                    borderRadius: 26,
                    backgroundColor: theme.obsidian,
                    boxShadow: "0 20px 50px rgba(9,9,11,0.18)",
                    overflow: "hidden",
                    verticalAlign: "middle",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 16,
                      transform: `translateY(${(1 - slotPop) * 28}px)`,
                      opacity: slotPop,
                    }}
                  >
                    <DeviceIcon index={deviceIdx} color={theme.greenBright} />
                    <span
                      style={{
                        fontSize: 54,
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: "#FAFAFA",
                      }}
                    >
                      {props.connectDevices[deviceIdx]}
                    </span>
                  </span>
                </span>
              </div>

              {/* Quiet Editorial Footnote */}
              <div
                style={{
                  marginTop: 34,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: FONT_MONO,
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: theme.inkMuted,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: theme.green,
                  }}
                />
                <span>SPOTIFY CONNECT  ·  INSTANT HANDOFF</span>
              </div>
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* =====================================================================
          SHOT 7 (Beats 46–52 / f 690–780): Gallery-White Editorial Brand Lockup Finale
          (Cohesive with Shots 1/2/4/6 + seamless loop back to Frame 0!)
      ===================================================================== */}
      {frame >= s6End && frame <= s7End && (() => {
        const lf = frame - s6End; // 0..90 (3.0s total)

        // Stage 1 (lf 4..20): Spotify emblem springs dead-center with subtle acoustic ripple
        const markSpring = spring({
          frame: Math.max(0, lf - 4),
          fps,
          config: SPRING_EDITORIAL,
        });
        const ring1P = interpolate(lf, [6, 34], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });
        const ring2P = interpolate(lf, [12, 42], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });

        // Stage 2 (lf 14..29): Inline Wordmark reflow smoothly glides mark left as "Spotify" masks in
        const wordReflow = interpolate(lf, [14, 29], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });
        const wordWidth = interpolate(wordReflow, [0, 1], [0, 392]);
        const wordGap = interpolate(wordReflow, [0, 1], [0, 26]);

        // Stage 3 (lf 22..36): Editorial two-tone tagline masked rise
        const tagP = interpolate(lf, [22, 36], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });

        // Stage 4 (lf 30..43): Unified high-contrast obsidian studio CTA pill + bottom hairline specs
        const pillP = interpolate(lf, [30, 43], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT_EXPO,
        });

        return (
          <AbsoluteFill
            style={{
              backgroundColor: theme.lightBg,
              alignItems: "center",
              justifyContent: "center",
              padding: "90px 120px",
            }}
          >
            {/* Whisper-Soft Gallery Studio Green Aura (Matches Shot 1 for seamless loop!) */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "47%",
                width: 1180,
                height: 660,
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(ellipse at center, rgba(30,215,96,0.10) 0%, rgba(30,215,96,0.03) 48%, transparent 74%)",
                pointerEvents: "none",
              }}
            />

            {/* Delicate Concentric Acoustic Ripple Rings on Emblem Arrival */}
            {ring1P > 0 && ring1P < 1 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "40%",
                  width: 120,
                  height: 120,
                  borderRadius: 999,
                  border: "1.5px solid rgba(29,185,84,0.32)",
                  transform: `translate(-50%, -50%) scale(${1 + ring1P * 3.2})`,
                  opacity: (1 - ring1P) * 0.8,
                  pointerEvents: "none",
                }}
              />
            )}
            {ring2P > 0 && ring2P < 1 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "40%",
                  width: 120,
                  height: 120,
                  borderRadius: 999,
                  border: "1.5px solid rgba(29,185,84,0.22)",
                  transform: `translate(-50%, -50%) scale(${1 + ring2P * 4.4})`,
                  opacity: (1 - ring2P) * 0.65,
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Centerpiece Editorial Lockup Stack */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Inline Reflow Brand Mark + Wordmark Lockup */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 28,
                  transform: `scale(${0.86 + markSpring * 0.14})`,
                  opacity: clamp01(markSpring * 1.4),
                }}
              >
                <SpotifyMark size={108} bg={theme.green} stroke="#FFFFFF" />

                <div
                  style={{
                    width: wordWidth,
                    marginLeft: wordGap,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 0 22px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 114,
                      fontWeight: 800,
                      letterSpacing: "-0.048em",
                      lineHeight: 1.14,
                      color: theme.inkLight,
                      whiteSpace: "nowrap",
                      transform: `translateX(${(1 - wordReflow) * -26}px)`,
                      opacity: clamp01(wordReflow * 1.25),
                    }}
                  >
                    {props.productName}
                  </span>
                </div>
              </div>

              {/* Editorial Two-Tone Positioning Tagline (Echoes Shot 1's Typography DNA) */}
              <div style={{ overflow: "hidden", paddingBottom: 8, marginBottom: 42 }}>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    color: theme.inkMuted,
                    display: "flex",
                    alignItems: "baseline",
                    transform: `translateY(${(1 - tagP) * 44}px)`,
                    opacity: tagP,
                  }}
                >
                  <span>{props.ctaTaglinePrefix}</span>
                  <span
                    style={{
                      fontFamily: FONT_INSTRUMENT_SERIF,
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: 70,
                      letterSpacing: "-0.015em",
                      color: theme.inkLight,
                      marginLeft: 18,
                    }}
                  >
                    {props.ctaTaglineSerif}
                  </span>
                </div>
              </div>

              {/* Single Unified High-Contrast Studio Action Capsule (Zero neon clutter) */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 24,
                  height: 76,
                  padding: "0 34px",
                  borderRadius: 999,
                  backgroundColor: theme.obsidian,
                  boxShadow: "0 20px 48px rgba(10,10,12,0.14)",
                  transform: `translateY(${(1 - pillP) * 20}px) scale(${0.96 + pillP * 0.04})`,
                  opacity: pillP,
                }}
              >
                {/* Live 3-Bar Micro EQ Indicator */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 22 }}>
                  {[0, 1, 2].map((b) => {
                    const barH = 8 + Math.abs(Math.sin(lf * 0.28 + b * 1.5)) * 14;
                    return (
                      <div
                        key={b}
                        style={{
                          width: 4.5,
                          height: barH,
                          borderRadius: 999,
                          backgroundColor: theme.greenBright,
                        }}
                      />
                    );
                  })}
                </div>

                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 23,
                    fontWeight: 600,
                    color: "#FAFAFA",
                    letterSpacing: "0.01em",
                  }}
                >
                  {props.ctaUrl}
                </span>

                <span
                  style={{
                    width: 1,
                    height: 24,
                    backgroundColor: "rgba(255,255,255,0.18)",
                  }}
                />

                <span
                  style={{
                    fontSize: 23,
                    fontWeight: 700,
                    letterSpacing: "-0.015em",
                    color: theme.greenBright,
                  }}
                >
                  {props.ctaButtonText} →
                </span>
              </div>
            </div>

            {/* Quiet Architectural Platform Spec Line inside Bottom Safe Margin */}
            <div
              style={{
                position: "absolute",
                bottom: 92,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: FONT_MONO,
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#A1A1AA",
                opacity: pillP * 0.9,
              }}
            >
              100M+ TRACKS  ·  LOSSLESS 24-BIT  ·  iOS  ·  DESKTOP  ·  SPEAKER  ·  CARPLAY
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* Architectural Spotify Green Vertical Curtain Wipe (Shot 6 -> Shot 7, 100% opaque at s6End) */}
      {frame >= s6End - 8 && frame <= s6End + 9 && (() => {
        const wipeY = interpolate(frame, [s6End - 8, s6End, s6End + 9], [104, 0, -104], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_OUT_QUINT,
        });
        return (
          <AbsoluteFill
            style={{
              background: "linear-gradient(180deg, #1ED760 0%, #1DB954 100%)",
              transform: `translate3d(0, ${wipeY}%, 0)`,
              zIndex: 55,
            }}
          />
        );
      })()}

      {/* Deterministic 2.4% SVG Fractal-Noise Film Grain (X H.264 Banding Defense) */}
      <FilmGrainOverlay frame={frame} opacity={0.024} />
    </AbsoluteFill>
  );
};
