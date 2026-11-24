import React, { useId } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  computeCameraTransform,
  computeHarmonicStagger,
  durSec,
  sec,
} from "../lib/studioMotion";

// ============================================================================
// 1. Bespoke Brand Tokens — LaunchSkill Official Identity
//    Mode A (Product Proof · Editorial Studio Cinema Craft)
//    - Warm Archival Studio Paper (#F7F6F2) primary polarity (~83%)
//    - Cinema Obsidian (#0B0B0D) earned proof polarity (~17%)
//    - Dark-Mode macOS Deck Chrome (#0E0E11) for crisp contrast on paper
//    - Single Primary Accent: Cinema Vermilion (#E5482E) — playhead / REC tally
// ============================================================================
export const LS_THEME = {
  paperTop: "#FFFFFF",
  paperMid: "#F7F6F2",
  paperBottom: "#ECE9E1",
  paperSurface: "#FFFFFF",
  paperBorder: "rgba(20, 20, 19, 0.09)",
  paperBorderStrong: "rgba(20, 20, 19, 0.16)",

  obsidianTop: "#131316",
  obsidianMid: "#0B0B0D",
  obsidianBottom: "#070709",
  deckSurface: "#0E0E11",
  deckElevated: "#16161B",
  deckBorder: "rgba(255, 255, 255, 0.11)",
  deckBorderSubtle: "rgba(255, 255, 255, 0.06)",

  ink: "#141413",
  inkSecondary: "#4B4A46",
  inkMuted: "#76746E",
  inkOnDark: "#FAF9F6",
  inkMutedOnDark: "#9A9892",

  // Single Brand Accent: Cinema Vermilion (Caret + Playhead + Active Tally)
  vermilion: "#E5482E",
  vermilionSoft: "rgba(229, 72, 46, 0.14)",
  vermilionGlow: "rgba(229, 72, 46, 0.36)",

  // Semantic code/status hues (used strictly inside real syntax & QA stamps)
  emerald: "#22C55E",
  amber: "#F59E0B",
  sky: "#60A5FA",

  // Multi-layer studio elevation shadows
  shadowDeck:
    "0 36px 90px rgba(14, 14, 17, 0.22), 0 12px 28px rgba(14, 14, 17, 0.14), 0 1px 3px rgba(14, 14, 17, 0.08)",
  shadowPill:
    "0 24px 60px rgba(14, 14, 17, 0.18), 0 6px 16px rgba(14, 14, 17, 0.10)",
  shadowCard:
    "0 12px 32px rgba(20, 20, 19, 0.07), 0 2px 6px rgba(20, 20, 19, 0.04)",

  radiusDeck: 18,
  radiusCard: 14,
  radiusClip: 10,
  radiusPill: 999,
} as const;

// ============================================================================
// 2. Camera-Coupled Studio Cyclorama (Zero Blurred Radial Orbs)
// ============================================================================
export const LaunchSkillCyclorama: React.FC<{
  dark?: boolean;
  zoom?: number;
  panX?: number;
  panY?: number;
  dotOpacity?: number;
}> = ({ dark = false, zoom = 1, panX = 0, panY = 0, dotOpacity }) => {
  const bg = dark
    ? `linear-gradient(180deg, ${LS_THEME.obsidianTop} 0%, ${LS_THEME.obsidianMid} 54%, ${LS_THEME.obsidianBottom} 100%)`
    : `linear-gradient(180deg, ${LS_THEME.paperTop} 0%, ${LS_THEME.paperMid} 58%, ${LS_THEME.paperBottom} 100%)`;

  const dotColor = dark
    ? `rgba(255, 255, 255, ${dotOpacity ?? 0.065})`
    : `rgba(20, 20, 19, ${dotOpacity ?? 0.075})`;

  return (
    <AbsoluteFill
      style={{
        background: bg,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "-22%",
          top: "-22%",
          width: "144%",
          height: "144%",
          backgroundImage: `radial-gradient(${dotColor} 1.3px, transparent 1.3px)`,
          backgroundSize: "30px 30px",
          transformOrigin: "center center",
          transform: `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`,
          willChange: "transform",
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// 3. High-Performance Pre-Encoded 128x128 Tiled Deterministic Film Grain
//    (Defends against X H.264 banding at 5-10x render speed vs full-HD SVG filter)
// ============================================================================
const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="11" stitchTiles="stitch"/></filter>` +
    `<rect width="128" height="128" filter="url(#g)"/>` +
    `</svg>`
);
const GRAIN_URI = `url("data:image/svg+xml,${GRAIN_SVG}")`;

export const FastFilmGrain: React.FC<{ opacity?: number }> = ({
  opacity = 0.024,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stepFrames = Math.max(1, Math.round(fps / 15));
  const step = Math.floor(frame / stepFrames);
  const ox = (step * 43) % 128;
  const oy = (step * 71) % 128;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
        backgroundImage: GRAIN_URI,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        backgroundPosition: `${ox}px ${oy}px`,
      }}
    />
  );
};

// ============================================================================
// 4. True Anisotropic Directional Motion Blur (Zero Overhead at Rest)
// ============================================================================
export const DirectionalBlurLayer: React.FC<{
  blurX: number;
  blurY: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ blurX, blurY, style, children }) => {
  const rawId = useId();
  const filterId = `ls-blur-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const bx = blurX > 0.15 ? Number(blurX.toFixed(2)) : 0;
  const by = blurY > 0.15 ? Number(blurY.toFixed(2)) : 0;
  const active = bx > 0 || by > 0;

  return (
    <>
      {active && (
        <svg
          width={0}
          height={0}
          aria-hidden="true"
          style={{ position: "absolute", pointerEvents: "none" }}
        >
          <defs>
            <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={`${bx} ${by}`} />
            </filter>
          </defs>
        </svg>
      )}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          ...style,
          filter: active ? `url(#${filterId})` : undefined,
        }}
      >
        {children}
      </div>
    </>
  );
};

// ============================================================================
// 5. Exact Focal-Lock 2D Camera Rig with Anisotropic Velocity Blur
// ============================================================================
export const LSCameraRig: React.FC<{
  focusX: number;
  focusY: number;
  zoom: number;
  blurX?: number;
  blurY?: number;
  children: React.ReactNode;
}> = ({ focusX, focusY, zoom, blurX = 0, blurY = 0, children }) => {
  const { x, y, scale } = computeCameraTransform(focusX, focusY, zoom, 1920, 1080);

  return (
    <DirectionalBlurLayer blurX={blurX} blurY={blurY}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          transformOrigin: "0 0",
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </DirectionalBlurLayer>
  );
};

// ============================================================================
// 6. Baseline-Masked Editorial Kinetic Headline (<= 4 Words / Beat)
// ============================================================================
export interface HeadlineWord {
  text: string;
  italic?: boolean;
  accent?: string;
  muted?: boolean;
}

export const MaskedHeadline: React.FC<{
  words: HeadlineWord[];
  startFrame?: number;
  fontSize?: number;
  dark?: boolean;
  align?: "center" | "left";
}> = ({
  words,
  startFrame = 0,
  fontSize = 84,
  dark = false,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const baseColor = dark ? LS_THEME.inkOnDark : LS_THEME.ink;
  const mutedColor = dark ? LS_THEME.inkMutedOnDark : LS_THEME.inkMuted;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: Math.round(fontSize * 0.24),
        rowGap: Math.round(fontSize * 0.08),
      }}
    >
      {words.map((w, idx) => {
        const delay = computeHarmonicStagger(idx, 0.05, fps, 0.82);
        const p = spring({
          frame: Math.max(0, frame - startFrame - delay),
          fps,
          config: { damping: 24, stiffness: 220, mass: 0.78 },
        });
        const yPct = (1 - p) * 112;
        const rot = (1 - p) * 3.5;

        return (
          <span
            key={`${w.text}-${idx}`}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: "0.16em",
              marginBottom: "-0.16em",
              paddingRight: w.italic ? "0.06em" : 0,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translate3d(0, ${yPct}%, 0) rotate(${rot}deg)`,
                transformOrigin: "left bottom",
                fontFamily: w.italic ? FONT_SERIF : FONT_SANS,
                fontStyle: w.italic ? "italic" : "normal",
                fontWeight: w.italic ? 400 : 750,
                fontSize: w.italic ? Math.round(fontSize * 1.12) : fontSize,
                letterSpacing: w.italic ? "-0.012em" : "-0.045em",
                lineHeight: 1.02,
                color: w.accent ?? (w.muted ? mutedColor : baseColor),
              }}
            >
              {w.text}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// ============================================================================
// 7. LaunchSkill Geometric Playhead Mark (Obsidian Squircle + Vermilion Playhead)
// ============================================================================
export const LaunchSkillMark: React.FC<{
  size?: number;
  sheenProgress?: number; // -0.5 to 1.5
  playheadPulse?: number; // 0 to 1
}> = ({ size = 96, sheenProgress = -1, playheadPulse = 1 }) => {
  const radius = Math.round(size * 0.25);
  const sheenX = interpolate(sheenProgress, [-0.3, 1.3], [-size * 1.4, size * 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showSheen = sheenProgress > -0.25 && sheenProgress < 1.25;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: LS_THEME.deckSurface,
        border: "1px solid rgba(255, 255, 255, 0.14)",
        boxShadow:
          "0 22px 48px rgba(14, 14, 17, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <svg
        width={Math.round(size * 0.64)}
        height={Math.round(size * 0.64)}
        viewBox="0 0 64 64"
        fill="none"
      >
        {/* Subtle horizontal timeline rails */}
        <rect x="6" y="18" width="16" height="6" rx="3" fill="rgba(255,255,255,0.22)" />
        <rect x="6" y="30" width="22" height="6" rx="3" fill="rgba(255,255,255,0.16)" />
        <rect x="6" y="42" width="13" height="6" rx="3" fill="rgba(255,255,255,0.22)" />

        {/* Play triangle (cinema output) */}
        <path
          d="M37 19.5L56.5 32L37 44.5V19.5Z"
          fill="#FAF9F6"
        />

        {/* Hero Motif: Vermilion Caret / Playhead vertical axis + diamond cap */}
        <g opacity={0.85 + playheadPulse * 0.15}>
          <path d="M27.5 8L33 14.5H22L27.5 8Z" fill={LS_THEME.vermilion} />
          <rect x="25.5" y="13.5" width="4" height="42.5" rx="2" fill={LS_THEME.vermilion} />
        </g>
      </svg>

      {/* Coupled Specular Studio Glass Sheen */}
      {showSheen && (
        <div
          style={{
            position: "absolute",
            top: "-30%",
            bottom: "-30%",
            width: Math.round(size * 0.42),
            left: "50%",
            transform: `translate3d(${sheenX}px, 0, 0) rotate(24deg)`,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// 8. Official Vector Coding-Agent Logos (Authentic Brand SVGs)
// ============================================================================
export type CodingAgentId = "claude" | "cursor" | "codex" | "opencode";

export const AgentBrandIcon: React.FC<{
  agent: CodingAgentId;
  size?: number;
}> = ({ agent, size = 28 }) => {
  switch (agent) {
    case "claude":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"
            fill="#D97757"
          />
        </svg>
      );
    case "cursor":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z"
            fill="#141413"
          />
        </svg>
      );
    case "codex":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"
            fill="#10A37F"
          />
        </svg>
      );
    case "opencode":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M16 6H8v12h8V6zm4 16H4V2h16v20z" fill="#141413" />
        </svg>
      );
  }
};

// ============================================================================
// 9. Studio SFX-Only Audio Layer (Zero Code-Generated Music!)
// ============================================================================
export interface LSSfxCue {
  frame?: number;
  peakAtFrame?: number;
  peakOffsetSec?: number;
  src: string;
  volume?: number;
  playbackRate?: number;
  durationInFrames?: number;
}

export const LaunchSkillSoundLayer: React.FC<{ cues: LSSfxCue[] }> = ({ cues }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {cues.map((cue, idx) => {
        const startFrame =
          cue.peakAtFrame !== undefined
            ? Math.round(cue.peakAtFrame - (cue.peakOffsetSec ?? 0.16) * fps)
            : Math.round(cue.frame ?? 0);
        const safeFrom = Math.max(0, startFrame);
        return (
          <Sequence
            key={`${cue.src}-${safeFrom}-${idx}`}
            from={safeFrom}
            durationInFrames={cue.durationInFrames ?? durSec(1.4, fps)}
          >
            <Audio
              src={staticFile(cue.src)}
              volume={cue.volume ?? 0.36}
              playbackRate={cue.playbackRate ?? 1}
            />
          </Sequence>
        );
      })}
    </>
  );
};

export const formatSmpteTimecode = (totalFrames: number, fps: number): string => {
  const safe = Math.max(0, Math.floor(totalFrames));
  const secs = Math.floor(safe / fps);
  const remFrames = safe % fps;
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  return `${String(mins).padStart(2, "0")}:${String(remSecs).padStart(2, "0")}:${String(remFrames).padStart(2, "0")}`;
};

export { FONT_MONO, FONT_SANS, FONT_SERIF, sec };
