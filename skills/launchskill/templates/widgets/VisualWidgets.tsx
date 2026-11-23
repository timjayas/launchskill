import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  type CanonicalMorphShapeId,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  durSec,
  morphCanonicalSvgShapes,
  sec,
} from "../motion";

// ============================================================================
// 1. <MorphingVectorShape /> — 64-Vertex Smooth SVG Shape-to-Shape Morpher
//    Morphs seamlessly across ["circle-orb", "camera-aperture", "compass-diamond",
//    "squircle-card", "map-pin", "gemini-star"] with zero vertex inversions.
// ============================================================================
export const MorphingVectorShape: React.FC<{
  shapes: readonly CanonicalMorphShapeId[];
  progress: number;
  size?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rotationDeg?: number;
  glowColor?: string;
  style?: React.CSSProperties;
}> = ({
  shapes,
  progress,
  size = 112,
  fill = "#1A73E8",
  stroke = "rgba(255,255,255,0.45)",
  strokeWidth = 2.5,
  rotationDeg = 0,
  glowColor,
  style,
}) => {
  const pathD = morphCanonicalSvgShapes(shapes, progress, 100, 1);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      style={{
        display: "block",
        flexShrink: 0,
        transform: rotationDeg !== 0 ? `rotate(${rotationDeg}deg)` : undefined,
        filter: glowColor ? `drop-shadow(0 12px 28px ${glowColor})` : undefined,
        ...style,
      }}
    >
      <path
        d={pathD}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================================================
// 2. <SonicIrisWidget /> — Sculptural Voice & Intent Core (Replaces Chat Bubbles!)
// ============================================================================
export const SonicIrisWidget: React.FC<{
  energy?: number;
  morphProgress?: number;
  accentColor?: string;
  secondaryColor?: string;
}> = ({
  energy = 1,
  morphProgress = 0,
  accentColor = "#3B82F6",
  secondaryColor = "#60A5FA",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const renderBars = (side: "left" | "right") => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, height: 76 }}>
      {Array.from({ length: 10 }, (_, i) => {
        const idx = side === "left" ? 9 - i : i;
        const envelope = Math.exp(-(idx / 10) * 1.4);
        const wave =
          0.5 +
          0.5 *
            (Math.sin(t * 11.8 + idx * 0.65) * 0.58 +
              Math.cos(t * 7.3 - idx * 0.42) * 0.42);
        const h = Math.max(8, Math.round((8 + wave * 64 * envelope) * energy));
        return (
          <div
            key={i}
            style={{
              width: 6,
              height: h,
              borderRadius: 999,
              backgroundColor: idx < 4 ? secondaryColor : accentColor,
              opacity: idx < 4 ? 1 : 0.68,
            }}
          />
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
      }}
    >
      {renderBars("left")}
      <MorphingVectorShape
        shapes={["circle-orb", "camera-aperture", "gemini-star"]}
        progress={morphProgress}
        size={96}
        fill={accentColor}
        glowColor="rgba(59, 130, 246, 0.55)"
        rotationDeg={frame * 1.1}
      />
      {renderBars("right")}
    </div>
  );
};

// ============================================================================
// 3. <SweepingWatchDialWidget /> — Visual Time/Schedule Shift (Replaces Text Rows!)
// ============================================================================
export const SweepingWatchDialWidget: React.FC<{
  enterProgress: number;
  sweepProgress: number;
  fromHour?: number;
  toHour?: number;
  accentColor?: string;
  lockedColor?: string;
}> = ({
  enterProgress,
  sweepProgress,
  fromHour = 7,
  toHour = 8,
  accentColor = "#1A73E8",
  lockedColor = "#16A34A",
}) => {
  if (enterProgress <= 0.01) return null;

  const isLocked = sweepProgress > 0.85;
  const activeColor = isLocked ? lockedColor : accentColor;
  const hourAngle = interpolate(sweepProgress, [0, 1], [fromHour * 30, toHour * 30]);
  const minuteAngle = interpolate(sweepProgress, [0, 1], [0, 360]);
  const displayedHour = sweepProgress > 0.5 ? toHour : fromHour;

  return (
    <div
      style={{
        width: 390,
        height: 240,
        backgroundColor: "#FFFFFF",
        borderRadius: 34,
        border: `2px solid ${isLocked ? "rgba(22,163,74,0.38)" : "rgba(15,23,42,0.14)"}`,
        boxShadow: "0 28px 68px rgba(11, 15, 23, 0.16)",
        padding: "22px 26px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transform: `translate3d(${(1 - enterProgress) * -80}px, 0, 0) scale(${0.84 + enterProgress * 0.16})`,
        opacity: Math.min(1, enterProgress * 1.3),
      }}
    >
      <div style={{ position: "relative", width: 168, height: 168, flexShrink: 0 }}>
        <svg width="168" height="168" viewBox="0 0 168 168" fill="none">
          <circle
            cx="84"
            cy="84"
            r="76"
            fill="#F8FAFC"
            stroke="rgba(15,23,42,0.1)"
            strokeWidth="2.5"
          />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            const r1 = i % 3 === 0 ? 58 : 63;
            const r2 = 69;
            return (
              <line
                key={i}
                x1={84 + Math.sin(a) * r1}
                y1={84 - Math.cos(a) * r1}
                x2={84 + Math.sin(a) * r2}
                y2={84 - Math.cos(a) * r2}
                stroke={i === toHour % 12 && isLocked ? lockedColor : "#64748B"}
                strokeWidth={i % 3 === 0 ? "3" : "2"}
                strokeLinecap="round"
              />
            );
          })}
          <g transform={`translate(84, 84) rotate(${hourAngle})`}>
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-42"
              stroke={activeColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
          <g transform={`translate(84, 84) rotate(${minuteAngle})`}>
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-56"
              stroke="#0B0F17"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
          <circle cx="84" cy="84" r="7" fill={activeColor} />
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
        <span
          style={{
            padding: "6px 13px",
            borderRadius: 999,
            backgroundColor: isLocked ? "#DCFCE7" : "#E8F0FE",
            color: activeColor,
            fontFamily: FONT_MONO,
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          {isLocked ? "LOCKED ✓" : "SHIFT"}
        </span>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 58,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 1,
            color: "#0B0F17",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {displayedHour}:00
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. <TopographicRouteMapWidget /> — Pure Visual Route & Pin Drop
// ============================================================================
export const TopographicRouteMapWidget: React.FC<{
  enterProgress: number;
  routeProgress: number;
  badgeText?: string;
}> = ({ enterProgress, routeProgress, badgeText = "6 MIN · PINNED ✓" }) => {
  if (enterProgress <= 0.01) return null;

  const clamped = Math.max(0, Math.min(1, routeProgress));
  const pathLen = 310;

  return (
    <div
      style={{
        width: 390,
        height: 240,
        backgroundColor: "#0F172A",
        borderRadius: 34,
        border: "2px solid rgba(96, 165, 250, 0.38)",
        boxShadow: "0 28px 68px rgba(11, 15, 23, 0.16)",
        overflow: "hidden",
        position: "relative",
        transform: `translate3d(${(1 - enterProgress) * -80}px, 0, 0) scale(${0.84 + enterProgress * 0.16})`,
        opacity: Math.min(1, enterProgress * 1.3),
      }}
    >
      <svg width="390" height="240" viewBox="0 0 390 240" fill="none">
        <rect x="18" y="18" width="110" height="82" rx="14" fill="#1E293B" />
        <rect x="148" y="18" width="224" height="72" rx="14" fill="#1E293B" />
        <rect x="18" y="122" width="150" height="100" rx="14" fill="#1E293B" />
        <rect x="190" y="112" width="182" height="110" rx="14" fill="#1E293B" />

        <path
          d="M68 182C136 182 136 102 214 102C278 102 278 56 322 56"
          stroke="rgba(96,165,250,0.22)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M68 182C136 182 136 102 214 102C278 102 278 56 322 56"
          stroke="#3B82F6"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={pathLen}
          strokeDashoffset={pathLen * (1 - clamped)}
        />

        <circle cx="68" cy="182" r="9" fill="#FFFFFF" stroke="#1A73E8" strokeWidth="4" />

        <g transform={`translate(322, ${56 - (1 - clamped) * 28}) scale(${0.5 + clamped * 0.5})`}>
          <circle cx="0" cy="0" r="22" fill="rgba(34, 197, 94, 0.25)" />
          <path
            d="M0 -22C-10 -22 -18 -14 -18 -4C-18 10 0 24 0 24C0 24 18 10 18 -4C18 -14 10 -22 0 -22Z"
            fill="#22C55E"
          />
          <circle cx="0" cy="-5" r="6" fill="#FFFFFF" />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 20,
          top: 18,
          padding: "7px 14px",
          borderRadius: 999,
          backgroundColor: "rgba(15, 23, 42, 0.88)",
          border: "1px solid rgba(255,255,255,0.15)",
          fontFamily: FONT_MONO,
          fontSize: 13,
          fontWeight: 800,
          color: "#4ADE80",
        }}
      >
        {badgeText}
      </div>
    </div>
  );
};

// ============================================================================
// 5. <RadialTelemetryGaugeWidget /> — Visual Speed/Performance Arc
// ============================================================================
export const RadialTelemetryGaugeWidget: React.FC<{
  progress: number;
  valueLabel: string;
  unitLabel?: string;
  accentColor?: string;
}> = ({ progress, valueLabel, unitLabel = "MS", accentColor = "#1A73E8" }) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const arcLen = 282;

  return (
    <div
      style={{
        width: 240,
        height: 240,
        borderRadius: 34,
        backgroundColor: "#FFFFFF",
        border: "1.5px solid rgba(15,23,42,0.1)",
        boxShadow: "0 24px 56px rgba(11,15,23,0.12)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="196" height="196" viewBox="0 0 196 196" fill="none">
        <circle
          cx="98"
          cy="98"
          r="68"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth="12"
          strokeDasharray={`${arcLen} 400`}
          transform="rotate(140 98 98)"
          strokeLinecap="round"
        />
        <circle
          cx="98"
          cy="98"
          r="68"
          stroke={accentColor}
          strokeWidth="12"
          strokeDasharray={`${arcLen * clamped} 400`}
          transform="rotate(140 98 98)"
          strokeLinecap="round"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#0B0F17",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {valueLabel}
        </span>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 13,
            fontWeight: 700,
            color: "#64748B",
          }}
        >
          {unitLabel}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// 6. <SyntaxTokenMorphWidget /> — Focused 4-Line Code Token Morph (Zero Blank Gaps)
// ============================================================================
export const SyntaxTokenMorphWidget: React.FC<{
  morphProgress: number;
  fileName?: string;
}> = ({ morphProgress, fileName = "agent.ts" }) => {
  const isVerified = morphProgress > 0.65;

  return (
    <div
      style={{
        width: 580,
        borderRadius: 24,
        backgroundColor: "#0D0D10",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 32px 76px rgba(0,0,0,0.34)",
        overflow: "hidden",
        fontFamily: FONT_MONO,
      }}
    >
      {/* Sleek Dark macOS Header */}
      <div
        style={{
          height: 44,
          padding: "0 18px",
          backgroundColor: "#141418",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ width: 11, height: 11, borderRadius: 99, backgroundColor: "#FF5F56" }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, backgroundColor: "#FFBD2E" }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, backgroundColor: "#27C93F" }} />
        <span style={{ marginLeft: 10, fontSize: 14, color: "#A1A1AA", fontWeight: 600 }}>
          {fileName}
        </span>
        <span
          style={{
            marginLeft: "auto",
            padding: "3px 10px",
            borderRadius: 99,
            backgroundColor: isVerified ? "rgba(34,197,94,0.18)" : "rgba(59,130,246,0.18)",
            color: isVerified ? "#4ADE80" : "#60A5FA",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {isVerified ? "+2 −1 ✓" : "DIFF"}
        </span>
      </div>

      {/* 3 Ultra-Legible 20px Code Lines (In-Place Token Swap — Zero Empty Holes!) */}
      <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12, fontSize: 19 }}>
        <div style={{ color: "#E4E4E7" }}>
          <span style={{ color: "#C084FC" }}>const </span>
          <span style={{ color: "#93C5FD" }}>res </span>= <span style={{ color: "#C084FC" }}>await </span>
          <span style={{ color: "#60A5FA" }}>gemini</span>.run();
        </div>

        <div
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            backgroundColor: isVerified
              ? "rgba(34, 197, 94, 0.14)"
              : "rgba(239, 68, 68, 0.14)",
            borderLeft: `3.5px solid ${isVerified ? "#4ADE80" : "#F87171"}`,
            color: isVerified ? "#86EFAC" : "#FCA5A5",
            fontWeight: 600,
          }}
        >
          {isVerified ? "+ mode: 'live-vision-v2'" : "- mode: 'legacy-poll'"}
        </div>

        <div style={{ color: "#E4E4E7" }}>
          <span style={{ color: "#C084FC" }}>return </span>
          <span style={{ color: "#4ADE80" }}>res.verified</span>;
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 7. <LiveBranchGraphWidget /> — Zero-Copy Database/Git Branch Fork Visualizer
//    (Continuous traveling data pulses + animated bezier branch fork — Zero Skeleton Bars!)
// ============================================================================
export const LiveBranchGraphWidget: React.FC<{
  forkProgress: number;
  pulsePhase: number;
  branchName?: string;
  latencyLabel?: string;
}> = ({
  forkProgress,
  pulsePhase,
  branchName = "pr-412 / zero-copy",
  latencyLabel = "400ms",
}) => {
  const clamped = Math.max(0, Math.min(1, forkProgress));
  const pathLen = 320;
  const pulseX = 70 + ((pulsePhase * 280) % 360);

  return (
    <div
      style={{
        width: 580,
        height: 230,
        borderRadius: 24,
        backgroundColor: "#0D111A",
        border: "1.5px solid rgba(59, 130, 246, 0.38)",
        boxShadow: "0 28px 68px rgba(0,0,0,0.28)",
        padding: "18px 22px",
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT_MONO,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#93C5FD" }}>
          main → {branchName}
        </span>
        <span
          style={{
            padding: "4px 11px",
            borderRadius: 99,
            backgroundColor: "rgba(34,197,94,0.18)",
            color: "#4ADE80",
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          FORKED · {latencyLabel} ✓
        </span>
      </div>

      <svg width="536" height="156" viewBox="0 0 536 156" fill="none">
        {/* Main Trunk Line */}
        <line x1="36" y1="48" x2="496" y2="48" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
        {/* Animated Zero-Copy PR Branch Fork */}
        <path
          d="M128 48C184 48 192 118 254 118H468"
          stroke="#3B82F6"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={pathLen}
          strokeDashoffset={pathLen * (1 - clamped)}
        />
        {/* Continuously Traveling Data Pulse (prevents dead-frame holds!) */}
        <circle cx={pulseX} cy={pulseX > 220 ? 118 : 48} r="10" fill="#60A5FA" />
        <circle cx="128" cy="48" r="9" fill="#F8FAFC" stroke="#3B82F6" strokeWidth="4" />
        <circle
          cx="360"
          cy="118"
          r={10 * clamped}
          fill="#22C55E"
          stroke="#FFFFFF"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};

// ============================================================================
// 8. <LivingPerspectiveWorkstation /> — Continuous 2.5D Orbit + Specular Sweep Rig
//    Guarantees living visual momentum (>1% active pixel delta on every frame)
//    so readability holds never freeze into dead static screenshots.
// ============================================================================
export const LivingPerspectiveWorkstation: React.FC<{
  children: React.ReactNode;
  explodedOverlay?: React.ReactNode;
  yawRange?: [number, number];
  pitchRange?: [number, number];
  scaleRange?: [number, number];
  panXRange?: [number, number];
  dark?: boolean;
  kineticEntrance?: boolean;
}> = ({
  children,
  explodedOverlay,
  yawRange = [-14, 14],
  pitchRange = [8, -6],
  scaleRange = [0.88, 1.16],
  panXRange = [-64, 64],
  dark = false,
  kineticEntrance = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const p = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const yaw = interpolate(p, [0, 1], yawRange);
  const pitch = interpolate(p, [0, 1], pitchRange);
  const scale = interpolate(p, [0, 1], scaleRange);
  const panX = interpolate(p, [0, 1], panXRange);
  const sheenX = interpolate(p, [0, 1], [-860, 860]);
  const bgAngle = Math.round(120 + p * 90);
  const bgShift = Math.round(p * 40);

  const bgGradient = dark
    ? `linear-gradient(${bgAngle}deg, #060911 0%, #111C38 ${40 + bgShift}%, #05070C 100%)`
    : kineticEntrance
      ? `linear-gradient(${bgAngle}deg, #FFFFFF 0%, #DBEAFE ${30 + bgShift}%, #EFF6FF 100%)`
      : `linear-gradient(${bgAngle}deg, #FFFFFF 0%, #EEF2F9 ${40 + bgShift}%, #DCE5F4 100%)`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: 1300,
        background: bgGradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Full-Viewport Studio Light Band Coupled to Camera Pan */}
      <div
        style={{
          position: "absolute",
          top: "-35%",
          bottom: "-35%",
          left: "50%",
          width: kineticEntrance ? 820 : 620,
          transform: `translate3d(${sheenX}px, 0, 0) rotate(22deg)`,
          background: dark
            ? "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.22) 50%, rgba(59,130,246,0) 100%)"
            : "linear-gradient(90deg, rgba(37,99,235,0) 0%, rgba(37,99,235,0.18) 50%, rgba(37,99,235,0) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `translate3d(${panX}px, 0, 0) scale(${scale}) rotateX(${pitch}deg) rotateY(${yaw}deg)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}

        {explodedOverlay && (
          <div
            style={{
              position: "absolute",
              right: -48,
              bottom: -36,
              transform: "translateZ(88px)",
              transformStyle: "preserve-3d",
              pointerEvents: "none",
            }}
          >
            {explodedOverlay}
          </div>
        )}

        {/* Coupled Specular Light Sweep Across the 2.5D Workstation */}
        <div
          style={{
            position: "absolute",
            inset: -80,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40%",
              bottom: "-40%",
              left: "50%",
              width: 280,
              transform: `translate3d(${sheenX * 0.75}px, 0, 0) rotate(24deg)`,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 9. <PixelMatrixMorphField /> — Distilled from `launch-video-skill` (0:00–0:11)
//    Pinpoint seed pixel -> expanding radial mosaic grid -> ray-connected nodes
// ============================================================================
export const PixelMatrixMorphField: React.FC<{
  progress: number;
  accentColor?: string;
  tileColor?: string;
}> = ({
  progress,
  accentColor = "#2563EB",
  tileColor = "rgba(15, 23, 42, 0.11)",
}) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const cols = 15;
  const rows = 7;
  const cell = 28;
  const w = cols * cell;
  const h = rows * cell;
  const cx = Math.floor(cols / 2);
  const cy = Math.floor(rows / 2);
  const maxDist = Math.hypot(cx, cy);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" style={{ overflow: "visible" }}>
      {/* Ray vectors shooting from center seed to satellite accent nodes in second half */}
      {clamped > 0.35 &&
        [
          [-5, -2],
          [5, -2],
          [-6, 1],
          [6, 1],
          [-3, 3],
          [3, 3],
          [0, -3],
          [0, 3],
        ].map(([dx, dy], idx) => {
          const rayP = Math.max(0, Math.min(1, (clamped - 0.35) / 0.65));
          const x1 = cx * cell + cell / 2;
          const y1 = cy * cell + cell / 2;
          const x2 = x1 + dx * cell * rayP;
          const y2 = y1 + dy * cell * rayP;
          return (
            <g key={`ray-${idx}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={accentColor}
                strokeWidth="1.75"
                strokeOpacity={0.55}
              />
              <rect
                x={x2 - 6}
                y={y2 - 6}
                width={12}
                height={12}
                rx={2}
                fill={accentColor}
              />
            </g>
          );
        })}

      {/* Procedural Tile Matrix */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const dist = Math.hypot(c - cx, r - cy) / maxDist;
          const isCenter = c === cx && r === cy;
          const wave = Math.max(0, Math.min(1, (clamped * 1.4 - dist) * 2.4));
          const isAccentNode = ((r * 7 + c * 13) % 11 === 0) && wave > 0.5;
          if (!isCenter && wave <= 0.02) return null;
          const sz = isCenter ? 18 : Math.round(18 * wave);

          return (
            <rect
              key={`${r}-${c}`}
              x={c * cell + (cell - sz) / 2}
              y={r * cell + (cell - sz) / 2}
              width={sz}
              height={sz}
              rx={3}
              fill={isCenter || isAccentNode ? accentColor : tileColor}
            />
          );
        })
      )}
    </svg>
  );
};

// ============================================================================
// 10. <LiquidGlassCapsule /> — Distilled from `glisse` (Refractive Liquid Glass)
// ============================================================================
export const LiquidGlassCapsule: React.FC<{
  sheenProgress: number;
  width?: number | string;
  padding?: string;
  dark?: boolean;
  children: React.ReactNode;
}> = ({
  sheenProgress,
  width = "auto",
  padding = "18px 32px",
  dark = false,
  children,
}) => {
  const glareOffset = interpolate(sheenProgress, [0, 1], [-220, 220]);

  return (
    <div
      style={{
        position: "relative",
        width,
        padding,
        borderRadius: 999,
        backgroundColor: dark ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.72)",
        backdropFilter: "blur(24px) saturate(180%)",
        border: dark
          ? "1.5px solid rgba(255, 255, 255, 0.36)"
          : "1.5px solid rgba(255, 255, 255, 0.92)",
        boxShadow: dark
          ? "inset 0 2px 3px rgba(255,255,255,0.45), inset 0 -2px 6px rgba(59,130,246,0.35), 0 28px 64px rgba(0,0,0,0.48)"
          : "inset 0 2px 4px rgba(255,255,255,0.95), inset 0 -2px 6px rgba(37,99,235,0.16), 0 24px 54px rgba(15,23,42,0.12)",
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
      }}
    >
      {/* Dynamic Refractive Caustic Glare Sweep */}
      <div
        style={{
          position: "absolute",
          top: "-40%",
          bottom: "-40%",
          left: "50%",
          width: 160,
          transform: `translate3d(${glareOffset}px, 0, 0) rotate(28deg)`,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 18 }}>
        {children}
      </div>
    </div>
  );
};



