import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  SPRING_EDITORIAL,
  SPRING_POP,
  SPRING_SNAPPY,
} from "../lib/motion";

export interface TimelineAssemblyRevealSceneProps {
  previewAppName?: string;
  previewHeadline?: string;
  previewHabits?: string[];
  accentColor?: string;
  tealColor?: string;
}

const DEFAULT_HABITS = ["Drink 2L water", "Morning 5K run", "Deep work · 90m"];

const TRACKS = [
  {
    name: "VIDEO",
    color: "#7C3AED",
    clips: [
      { left: 2, width: 22, label: "Hook + Dock" },
      { left: 25, width: 32, label: "Live App Preview" },
      { left: 58, width: 24, label: "Cursor Swarm" },
      { left: 83, width: 15, label: "CTA Lockup" },
    ],
  },
  {
    name: "MOTION",
    color: "#DB2777",
    clips: [
      { left: 4, width: 19, label: "Spring Stagger" },
      { left: 27, width: 28, label: "Macro Camera Rig" },
      { left: 60, width: 36, label: "Emblem Reflow" },
    ],
  },
  {
    name: "VOICE",
    color: "#EA580C",
    clips: [
      { left: 3, width: 42, label: "Studio VO · Take 01" },
      { left: 48, width: 44, label: "Studio VO · Climax" },
    ],
  },
  {
    name: "AUDIO",
    color: "#0D9488",
    clips: [{ left: 0, width: 98, label: "120 BPM Electronic Bed + Tactile SFX" }],
  },
];

/**
 * Archetype 3 — Scene 3 (210f / 7.0s @ 30fps):
 * Meta "Film-Inside-a-Film" Timeline Assembly Reveal:
 * Multi-track NLE clips snap cleanly under a live playhead while the generated Habit Tracker app
 * genuinely animates inside its device frame (real progress ring + task checkoffs — zero static square!).
 */
export const TimelineAssemblyRevealScene: React.FC<TimelineAssemblyRevealSceneProps> = ({
  previewAppName = "HabitFlow",
  previewHeadline = "Build better habits",
  previewHabits = DEFAULT_HABITS,
  accentColor = "#7C3AED",
  tealColor = "#10B981",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stageIn = spring({ frame, fps, config: SPRING_EDITORIAL });

  // Live sweeping timeline playhead (0% -> 86% across 185 frames)
  const playheadPct = interpolate(frame, [16, 192], [8, 88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const secFloat = (playheadPct / 100) * 30;
  const secInt = Math.floor(secFloat);
  const frameRem = Math.floor((secFloat - secInt) * 30);
  const timecode = `00:00:${String(secInt).padStart(2, "0")}:${String(frameRem).padStart(2, "0")}`;

  // Genuine interactive state progression inside the generated app preview (driven by playhead!)
  const done1 = frame >= 44;
  const done2 = frame >= 86;
  const done3 = frame >= 128;
  const completedCount = (done1 ? 1 : 0) + (done2 ? 1 : 0) + (done3 ? 1 : 0);
  const goalPct = interpolate(
    frame,
    [20, 44, 86, 128, 146],
    [0.12, 0.36, 0.68, 0.94, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT_EXPO }
  );
  const ringCircumference = 2 * Math.PI * 52;

  // Crisp upward clip-path exit on last 10f into Scene 4's pure white canvas
  const exitWipe = interpolate(frame, [198, 210], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D0E14",
        fontFamily: FONT_SANS,
        padding: "70px 110px 66px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
        clipPath: exitWipe > 0.2 ? `inset(0 0 ${exitWipe.toFixed(1)}% 0)` : undefined,
      }}
    >
      {/* Top Studio Monitor Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: stageIn,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: tealColor,
            }}
          />
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#E4E4E7",
            }}
          >
            LIVE GENERATED FILM · {previewAppName.toUpperCase()} LAUNCH
          </span>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 18,
            padding: "8px 18px",
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            fontFamily: FONT_MONO,
            fontSize: 16,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            color: "#FAFAFA",
          }}
        >
          <span style={{ color: accentColor }}>PLAYING</span>
          <span>{timecode}</span>
          <span style={{ color: "#71717A" }}>/ 00:00:30:00</span>
        </div>
      </div>

      {/* Top 60%: Meta "Film-Inside-a-Film" Animated App Preview Stage */}
      <div
        style={{
          flex: 1,
          borderRadius: 24,
          backgroundColor: "#14151E",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 30px 70px rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "34px 68px",
          gap: 56,
          transform: `scale(${0.96 + stageIn * 0.04})`,
        }}
      >
        {/* Left: Live Generated Mobile Device Mockup (Genuinely Animating!) */}
        <div
          style={{
            width: 580,
            height: 455,
            borderRadius: 34,
            backgroundColor: "#FFFFFF",
            border: "8px solid #27272A",
            boxShadow: "0 28px 64px rgba(0,0,0,0.5)",
            padding: "28px 34px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Phone Header + Live Daily Goal Ring */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: accentColor,
                }}
              >
                {previewAppName.toUpperCase()} · TODAY
              </div>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  color: "#0B0B0F",
                  marginTop: 4,
                }}
              >
                {previewHeadline}
              </div>
            </div>

            {/* Live Filling Circular Ring */}
            <div style={{ position: "relative", width: 118, height: 118, flexShrink: 0 }}>
              <svg width="118" height="118" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="#F4F4F5" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={completedCount === 3 ? tealColor : accentColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringCircumference * (1 - goalPct)}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_MONO,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#0B0B0F",
                }}
              >
                {Math.round(goalPct * 100)}%
              </div>
            </div>
          </div>

          {/* Interactive Habit Checklist Rows (Checking off in real time!) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {previewHabits.map((habit, idx) => {
              const checkFrame = idx === 0 ? 44 : idx === 1 ? 86 : 128;
              const isChecked = frame >= checkFrame;
              const pop = spring({ frame: Math.max(0, frame - checkFrame), fps, config: SPRING_POP });
              return (
                <div
                  key={habit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 18px",
                    borderRadius: 16,
                    backgroundColor: isChecked ? "#ECFDF5" : "#F8FAFC",
                    border: isChecked ? `1.5px solid ${tealColor}` : "1.5px solid #E4E4E7",
                    transform: isChecked ? `scale(${0.97 + pop * 0.03})` : "scale(1)",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      backgroundColor: isChecked ? tealColor : "#FFFFFF",
                      border: isChecked ? `2px solid ${tealColor}` : "2px solid #D4D4D8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isChecked && (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="#FFFFFF"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 650,
                      color: isChecked ? "#065F46" : "#18181B",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {habit}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: FONT_MONO,
                      fontSize: 13,
                      fontWeight: 600,
                      color: isChecked ? tealColor : "#A1A1AA",
                    }}
                  >
                    {isChecked ? "DONE" : "NEXT"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Generated Shot Telemetry & Live Caption Preview */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: accentColor,
            }}
          >
            AUTO-ASSEMBLED SCENE · 100% DETERMINISTIC
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "#FAFAFA",
            }}
          >
            Real UI motion,
            <br />
            <span style={{ color: "#A1A1AA" }}>synced to every beat.</span>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {[
              { label: "STREAK", val: `${11 + completedCount} days`, hi: true },
              { label: "TRACKS", val: "4 synced", hi: false },
              { label: "EXPORT", val: "1080p · 30p", hi: false },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  padding: "16px 20px",
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: stat.hi
                    ? `1px solid ${tealColor}66`
                    : "1px solid rgba(255,255,255,0.09)",
                }}
              >
                <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#71717A" }}>
                  {stat.label}
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 24,
                    fontWeight: 700,
                    color: stat.hi ? tealColor : "#FAFAFA",
                    marginTop: 4,
                  }}
                >
                  {stat.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 32%: Multi-Track Timeline Assembly Engine */}
      <div
        style={{
          height: 295,
          borderRadius: 22,
          backgroundColor: "#12131B",
          border: "1px solid rgba(255,255,255,0.10)",
          padding: "18px 26px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Timecode Ruler */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: 112,
            fontFamily: FONT_MONO,
            fontSize: 12,
            color: "#71717A",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            paddingBottom: 8,
          }}
        >
          {["00:00", "00:05", "00:10", "00:15", "00:20", "00:25", "00:30"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        {/* 4 Assembling Tracks */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
          {TRACKS.map((track, tIdx) => (
            <div key={track.name} style={{ display: "flex", alignItems: "center", gap: 16, height: 46 }}>
              <div
                style={{
                  width: 96,
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#A1A1AA",
                  letterSpacing: "0.06em",
                  flexShrink: 0,
                }}
              >
                {track.name}
              </div>

              <div
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {track.clips.map((clip, cIdx) => {
                  const snapF = 6 + tIdx * 5 + cIdx * 4;
                  const snapP = spring({ frame: Math.max(0, frame - snapF), fps, config: SPRING_SNAPPY });
                  return (
                    <div
                      key={clip.label}
                      style={{
                        position: "absolute",
                        left: `${clip.left}%`,
                        width: `${clip.width}%`,
                        top: 3,
                        bottom: 3,
                        borderRadius: 8,
                        backgroundColor: `${track.color}30`,
                        border: `1.5px solid ${track.color}`,
                        padding: "0 12px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: 14,
                        fontWeight: 650,
                        color: "#FAFAFA",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        transform: `scaleX(${snapP})`,
                        transformOrigin: "left center",
                        opacity: snapP,
                      }}
                    >
                      {clip.label}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Live Vertical Playhead Sweeping Across Tracks */}
          <div
            style={{
              position: "absolute",
              left: `calc(112px + (100% - 112px) * ${(playheadPct / 100).toFixed(4)})`,
              top: -12,
              bottom: -8,
              width: 2.5,
              backgroundColor: "#FFFFFF",
              boxShadow: `0 0 14px ${accentColor}`,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -4,
                left: -6,
                width: 14,
                height: 14,
                borderRadius: 4,
                backgroundColor: accentColor,
                border: "2px solid #FFFFFF",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
