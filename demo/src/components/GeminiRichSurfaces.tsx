import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  type CanonicalMorphShapeId,
  EASE_OUT_EXPO,
  SPRING_POP,
  SPRING_SNAPPY,
  morphCanonicalSvgShapes,
  sec,
} from "../lib/studioMotion";
import {
  FONT_MONO,
  FONT_SANS,
  GEMINI_THEME,
  GeminiStarMark,
} from "./GeminiMobilePrimitives";

// ============================================================================
// 0. <MorphingVectorShape /> — 64-Vertex Smooth SVG Shape-to-Shape Morpher
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
  size = 96,
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
        filter: glowColor ? `drop-shadow(0 10px 26px ${glowColor})` : undefined,
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
// 1. Harmonic Voice Waveform (Pure Visual Rhythm — Zero Chat Bubbles!)
// ============================================================================
export const LiveVoiceSpectrum: React.FC<{
  energy?: number;
  bars?: number;
  height?: number;
  accentColor?: string;
  secondaryColor?: string;
}> = ({
  energy = 1,
  bars = 24,
  height = 64,
  accentColor = "#1A73E8",
  secondaryColor = "#60A5FA",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        height,
      }}
    >
      {Array.from({ length: bars }, (_, i) => {
        const norm = (i / (bars - 1)) * 2 - 1;
        const envelope = Math.exp(-norm * norm * 2.2);
        const f1 = Math.sin(t * 11.5 + i * 0.62);
        const f2 = Math.cos(t * 7.1 - i * 0.45);
        const wave = 0.5 + 0.5 * (f1 * 0.58 + f2 * 0.42);
        const barH = Math.max(8, Math.round((8 + wave * (height - 10) * envelope) * energy));
        const isCore = Math.abs(norm) < 0.42;

        return (
          <div
            key={i}
            style={{
              width: 6,
              height: barH,
              borderRadius: 999,
              backgroundColor: isCore ? accentColor : secondaryColor,
              opacity: isCore ? 1 : 0.65,
            }}
          />
        );
      })}
    </div>
  );
};

// ============================================================================
// 2. Tactile Camera Lens & Rich Architectural Landscape Viewfinder Illustration
//    (100% Visual Design & Illustration — Zero Dense Text Tables!)
// ============================================================================
export const CameraLensViewfinderIllustration: React.FC<{
  focusProgress: number; // 0 -> 1 rotates lens ring & locks reticle onto subject
  scanBeamProgress: number; // 0 -> 1 sweeps optical recognition laser across artwork
}> = ({ focusProgress, scanBeamProgress }) => {
  const ringRotation = interpolate(focusProgress, [0, 1], [-38, 0]);
  const reticleScale = interpolate(focusProgress, [0, 1], [1.28, 1.0]);
  const beamY = interpolate(scanBeamProgress, [0, 1], [15, 285]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #0D1322 0%, #131C31 55%, #0A0E18 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 18px 26px",
        boxSizing: "border-box",
      }}
    >
      {/* Minimal Camera Viewfinder Top Bar (Icons + 1 Pill Only) */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 13px",
            borderRadius: 999,
            backgroundColor: "rgba(26, 115, 232, 0.24)",
            border: "1px solid rgba(96, 165, 250, 0.42)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: "#60A5FA",
            }}
          />
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#FFFFFF",
            }}
          >
            LIVE
          </span>
        </div>

        {/* Minimal Focal Length Badge */}
        <div
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.08)",
            fontFamily: FONT_MONO,
            fontSize: 12,
            fontWeight: 700,
            color: "#93C5FD",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          24MM · F/1.7
        </div>
      </div>

      {/* Rich Layered Vector Artwork Canvas inside Camera Viewfinder */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 460,
          borderRadius: 32,
          overflow: "hidden",
          border: "1.5px solid rgba(255,255,255,0.14)",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.45)",
          background:
            "linear-gradient(180deg, #1E3A8A 0%, #3B82F6 48%, #93C5FD 78%, #FEF3C7 100%)",
        }}
      >
        {/* Stylized Architectural Landscape & Geometric Sun Illustration */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 380 460"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {/* Warm Studio Sun Disc */}
          <circle cx="268" cy="128" r="54" fill="#FDE68A" />
          <circle cx="268" cy="128" r="74" fill="#FDE68A" fillOpacity="0.24" />

          {/* Far Mountain Ridge */}
          <path
            d="M-20 320L88 188L196 286L294 176L410 310V460H-20V320Z"
            fill="#1D4ED8"
            fillOpacity="0.72"
          />

          {/* Mid Architectural Terraces */}
          <path
            d="M-20 356C62 292 144 304 226 348C294 382 346 334 410 350V460H-20V356Z"
            fill="#1E293B"
          />

          {/* Sculptural Geometric Pavilion / Tower Subject in Foreground */}
          <g transform="translate(132, 152)">
            {/* Base Pedestal */}
            <rect x="16" y="138" width="84" height="18" rx="6" fill="#0F172A" />
            {/* Main Architectural Arch Monolith */}
            <rect
              x="24"
              y="32"
              width="68"
              height="108"
              rx="34"
              fill="#F8FAFC"
              stroke="#60A5FA"
              strokeWidth="3"
            />
            {/* Inner Cobalt Portal Cutout */}
            <rect x="40" y="64" width="36" height="76" rx="18" fill="#1A73E8" />
            {/* Floating Golden Sphere inside Arch */}
            <circle cx="58" cy="48" r="10" fill="#F59E0B" />
          </g>

          {/* Rotating Optical Precision Dial Ring */}
          <g
            transform={`translate(190, 236) rotate(${ringRotation})`}
            opacity={0.45 + focusProgress * 0.45}
          >
            <circle
              cx="0"
              cy="0"
              r="116"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeDasharray="6 10"
            />
            <circle
              cx="0"
              cy="0"
              r="96"
              stroke="#93C5FD"
              strokeWidth="2"
              strokeDasharray="28 18"
            />
          </g>
        </svg>

        {/* Optical Laser Scan Line Sweeping Across Viewfinder */}
        {scanBeamProgress > 0.02 && scanBeamProgress < 0.98 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: beamY,
              height: 3,
              background:
                "linear-gradient(90deg, rgba(96,165,250,0) 0%, #60A5FA 50%, rgba(96,165,250,0) 100%)",
              boxShadow: "0 0 20px 4px rgba(59, 130, 246, 0.65)",
            }}
          />
        )}

        {/* Crisp Corner Focus Reticle */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 164,
            height: 164,
            transform: `translate(-50%, -50%) scale(${reticleScale})`,
            opacity: focusProgress,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 24,
              height: 24,
              borderTop: "3.5px solid #FFFFFF",
              borderLeft: "3.5px solid #FFFFFF",
              borderTopLeftRadius: 8,
            }}
          />
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 24,
              height: 24,
              borderTop: "3.5px solid #FFFFFF",
              borderRight: "3.5px solid #FFFFFF",
              borderTopRightRadius: 8,
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 24,
              height: 24,
              borderBottom: "3.5px solid #FFFFFF",
              borderLeft: "3.5px solid #FFFFFF",
              borderBottomLeftRadius: 8,
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 24,
              height: 24,
              borderBottom: "3.5px solid #FFFFFF",
              borderRight: "3.5px solid #FFFFFF",
              borderBottomRightRadius: 8,
            }}
          />
        </div>
      </div>

      {/* Bottom Minimal Shutter & Live Voice Wave (Zero Text Clutter!) */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 10px 0",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GeminiStarMark size={22} color="#60A5FA" />
        </div>

        <LiveVoiceSpectrum
          energy={0.9}
          bars={15}
          height={38}
          accentColor="#60A5FA"
          secondaryColor="#93C5FD"
        />

        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            border: "2.5px solid #FFFFFF",
            padding: 3,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 999,
              backgroundColor: "#1A73E8",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. Exploded Z-Axis Visual Object Card (+90px in front of glass)
//    Pure Visual Swatches + Iconography + 2-Word Label (Zero Text Paragraph!)
// ============================================================================
export const ExplodedVisualInsightCard: React.FC<{
  popProgress: number;
}> = ({ popProgress }) => {
  if (popProgress <= 0.01) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: -58,
        right: -58,
        top: 290,
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        border: "2px solid #1A73E8",
        boxShadow: GEMINI_THEME.shadowExploded,
        padding: "18px 22px",
        transform: `translate3d(0, ${(1 - popProgress) * 28}px, 0) scale(${0.76 + popProgress * 0.24})`,
        opacity: Math.min(1, popProgress * 1.35),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      {/* Left Miniature Architectural Illustration Badge */}
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 20,
          background: "linear-gradient(145deg, #1E3A8A 0%, #3B82F6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 10px 24px rgba(26, 115, 232, 0.28)",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="8" y="6" width="20" height="24" rx="10" fill="#FFFFFF" />
          <rect x="13" y="13" width="10" height="17" rx="5" fill="#1A73E8" />
          <circle cx="18" cy="10" r="2.5" fill="#F59E0B" />
        </svg>
      </div>

      {/* Center Minimal Visual Palette + 2-Word Title */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 23,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: GEMINI_THEME.ink,
          }}
        >
           Helios Arch
        </div>
        {/* Visual Color Swatch Pills instead of long text sentences! */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          {["#1E3A8A", "#3B82F6", "#F59E0B", "#F8FAFC"].map((hex) => (
            <span
              key={hex}
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                backgroundColor: hex,
                border: "1.5px solid rgba(15,23,42,0.12)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Verified Check Orb */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 999,
          backgroundColor: GEMINI_THEME.successSoft,
          color: GEMINI_THEME.success,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12.5L9.8 17.2L19 7.5"
            stroke="#16A34A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

// ============================================================================
// 4. Tactile Analog/Digital Clock Dial Widget (Hands Physically Sweep 7 -> 8!)
//    Communicates "Rescheduled" via pure visual motion instead of text paragraphs!
// ============================================================================
export const TactileClockDialWidget: React.FC<{
  enterProgress: number;
  sweepProgress: number; // 0 -> 1 sweeps clock hand & glowing arc from 7:00 to 8:00
}> = ({ enterProgress, sweepProgress }) => {
  if (enterProgress <= 0.01) return null;

  const isLocked = sweepProgress > 0.85;
  const hourAngle = interpolate(sweepProgress, [0, 1], [210, 240]); // 7 o'clock -> 8 o'clock
  const minuteAngle = interpolate(sweepProgress, [0, 1], [0, 360]);

  return (
    <div
      style={{
        width: 390,
        height: 240,
        backgroundColor: "#FFFFFF",
        borderRadius: 34,
        border: `2px solid ${isLocked ? "rgba(22,163,74,0.38)" : GEMINI_THEME.borderStrong}`,
        boxShadow: GEMINI_THEME.shadowCard,
        padding: "22px 26px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transform: `translate3d(${(1 - enterProgress) * -80}px, 0, 0) scale(${0.84 + enterProgress * 0.16})`,
        opacity: Math.min(1, enterProgress * 1.3),
      }}
    >
      {/* Left Animated Circular Watch Dial SVG */}
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
          {/* 12 Hour Tick Marks */}
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
                stroke={i === 8 && isLocked ? "#16A34A" : "#64748B"}
                strokeWidth={i % 3 === 0 ? "3" : "2"}
                strokeLinecap="round"
              />
            );
          })}

          {/* Sweeping Hour Hand */}
          <g transform={`translate(84, 84) rotate(${hourAngle})`}>
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-42"
              stroke={isLocked ? "#16A34A" : "#1A73E8"}
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>

          {/* Sweeping Minute Hand */}
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

          <circle
            cx="84"
            cy="84"
            r="7"
            fill={isLocked ? "#16A34A" : "#1A73E8"}
          />
        </svg>
      </div>

      {/* Right Big Visual Time Numeral Only (Zero Paragraph!) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        <span
          style={{
            padding: "6px 13px",
            borderRadius: 999,
            backgroundColor: isLocked ? GEMINI_THEME.successSoft : GEMINI_THEME.accentSoft,
            color: isLocked ? GEMINI_THEME.success : GEMINI_THEME.accent,
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
            color: GEMINI_THEME.ink,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {sweepProgress > 0.5 ? "8:00" : "7:00"}
        </div>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 14,
            fontWeight: 700,
            color: GEMINI_THEME.inkMuted,
          }}
        >
          PM · CALENDAR
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// 5. Stylized Topographic Vector Map Widget (Pure Visual Route & Pin Drop!)
// ============================================================================
export const TactileRouteMapWidget: React.FC<{
  enterProgress: number;
  routeProgress: number;
}> = ({ enterProgress, routeProgress }) => {
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
        boxShadow: GEMINI_THEME.shadowCard,
        overflow: "hidden",
        position: "relative",
        transform: `translate3d(${(1 - enterProgress) * -80}px, 0, 0) scale(${0.84 + enterProgress * 0.16})`,
        opacity: Math.min(1, enterProgress * 1.3),
      }}
    >
      <svg width="390" height="240" viewBox="0 0 390 240" fill="none">
        {/* Stylized Topographic Blocks */}
        <rect x="18" y="18" width="110" height="82" rx="14" fill="#1E293B" />
        <rect x="148" y="18" width="224" height="72" rx="14" fill="#1E293B" />
        <rect x="18" y="122" width="150" height="100" rx="14" fill="#1E293B" />
        <rect x="190" y="112" width="182" height="110" rx="14" fill="#1E293B" />

        {/* Glowing S-Curve Route Path */}
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

        {/* Start Dot */}
        <circle cx="68" cy="182" r="9" fill="#FFFFFF" stroke="#1A73E8" strokeWidth="4" />

        {/* Bouncing Emerald Destination Pin */}
        <g
          transform={`translate(322, ${56 - (1 - clamped) * 28}) scale(${0.5 + clamped * 0.5})`}
        >
          <circle cx="0" cy="0" r="22" fill="rgba(34, 197, 94, 0.25)" />
          <path
            d="M0 -22C-10 -22 -18 -14 -18 -4C-18 10 0 24 0 24C0 24 18 10 18 -4C18 -14 10 -22 0 -22Z"
            fill="#22C55E"
          />
          <circle cx="0" cy="-5" r="6" fill="#FFFFFF" />
        </g>
      </svg>

      {/* Single Minimal Pill Badge */}
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
        6 MIN · PINNED ✓
      </div>
    </div>
  );
};
