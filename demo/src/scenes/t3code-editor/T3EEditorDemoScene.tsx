import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ClaudeMark,
  CodexMark,
  GeminiMark,
  T3CodeMark,
  T3E_FONTS,
  T3E_THEME,
  T3SpatialCamera,
  T3StudioCyclorama,
} from "../../components/T3CodeEditorPrimitives";
import {
  EASE_IN_EXPO,
  EASE_OUT_EXPO,
  SPRING_POP,
  SPRING_SNAPPY,
} from "../../lib/studioMotion";

interface CodeToken {
  text: string;
  color: string;
}

interface CodeLine {
  num: number;
  tokens: CodeToken[];
  kind?: "normal" | "add" | "del";
  revealAtFrame?: number;
}

const C = {
  kw: "#C084FC",
  fn: "#60A5FA",
  str: "#34D399",
  type: "#FBBF24",
  plain: "#E2E8F0",
  muted: "#64748B",
  op: "#94A3B8",
};

const CODE_LINES: CodeLine[] = [
  {
    num: 14,
    tokens: [
      { text: "export async function ", color: C.kw },
      { text: "routeCompletion", color: C.fn },
      { text: "(", color: C.op },
      { text: "ctx", color: C.plain },
      { text: ": ", color: C.op },
      { text: "EditorContext", color: C.type },
      { text: ") {", color: C.op },
    ],
  },
  {
    num: 15,
    tokens: [
      { text: "  const ", color: C.kw },
      { text: "session ", color: C.plain },
      { text: "= ", color: C.op },
      { text: "await ", color: C.kw },
      { text: "subscriptions", color: C.plain },
      { text: ".", color: C.op },
      { text: "resolveActive", color: C.fn },
      { text: "(ctx.provider);", color: C.plain },
    ],
  },
  {
    num: 16,
    kind: "del",
    tokens: [
      { text: "- return ", color: T3E_THEME.diffDelText },
      { text: "legacyProxy", color: T3E_THEME.diffDelText },
      { text: "(ctx.file, { billing: ", color: T3E_THEME.diffDelText },
      { text: '"per-token"', color: T3E_THEME.diffDelText },
      { text: " });", color: T3E_THEME.diffDelText },
    ],
  },
  {
    num: 17,
    kind: "add",
    revealAtFrame: 42,
    tokens: [
      { text: "+ const ", color: C.kw },
      { text: "stream ", color: C.plain },
      { text: "= ", color: C.op },
      { text: "session", color: C.plain },
      { text: ".", color: C.op },
      { text: "streamPatch", color: C.fn },
      { text: "({", color: C.op },
    ],
  },
  {
    num: 18,
    kind: "add",
    revealAtFrame: 50,
    tokens: [
      { text: "+   model: ", color: C.plain },
      { text: "ctx.activePlan", color: C.type },
      { text: ", ", color: C.op },
      { text: "// Claude · Codex · Gemini", color: C.muted },
    ],
  },
  {
    num: 19,
    kind: "add",
    revealAtFrame: 58,
    tokens: [
      { text: "+   workspace: ", color: C.plain },
      { text: "ctx.gitRoot", color: C.str },
      { text: ", ", color: C.op },
      { text: "zeroMarkup: ", color: C.plain },
      { text: "true", color: C.kw },
      { text: ",", color: C.op },
    ],
  },
  {
    num: 20,
    kind: "add",
    revealAtFrame: 66,
    tokens: [{ text: "+ });", color: C.op }],
  },
  {
    num: 21,
    tokens: [
      { text: "  return ", color: C.kw },
      { text: "applyInlineDiff", color: C.fn },
      { text: "(stream, { atomic: ", color: C.plain },
      { text: "true", color: C.kw },
      { text: " });", color: C.op },
    ],
  },
  {
    num: 22,
    tokens: [{ text: "}", color: C.op }],
  },
];

const FILES = [
  { name: "session.ts", active: true, badge: "+38" },
  { name: "providers.ts", active: false, badge: "" },
  { name: "diffEngine.ts", active: false, badge: "+12" },
  { name: "keybindings.ts", active: false, badge: "" },
];

// Mathematically locked coordinates of the Gemini Pro pill inside 1920x1080:
// Window: 1540x820 centered -> left=190, top=130. Header height=76 -> centerY=168.
// Center pill group is anchored at left="50%" (X=960) with 3 equal 164px pills + 8px gaps:
// Pill 0 (Claude): 960 - 172 = 788 | Pill 1 (Codex): 960 | Pill 2 (Gemini): 960 + 172 = 1132.
export const GEMINI_PILL_TARGET = {
  wx: 1132,
  wy: 168,
  width: 164,
  height: 44,
  radius: 10,
} as const;

export const T3EEditorDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Top-bar unfold from Beat 1's Obsidian Rail (f0 -> f11):
  // Header (76px = 9.3% of 820px) is already visible on f0; body unfolds cleanly downward!
  const unfold = interpolate(frame, [0, 11], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const clipBottomPct = (1 - unfold) * 90.7;

  // Camera Choreography (135f = 4.50s total):
  // f0..f26:   Wide 1.0x IDE view
  // f26..f40:  Macro dive 1.0x -> 1.54x onto live TypeScript diff
  // f40..f76:  Hold macro while Gemini streams 4 diff lines
  // f76..f90:  Pull back 1.54x -> 1.0x to frame Apply Diff click (f94)
  // f113..f135: Mathematically locked 1.0x -> 4.5x (EASE_IN_EXPO) Portal Match Cut
  //             pinned to GEMINI_PILL_TARGET (1132, 168) -> ZERO opacity fade!
  const diveIn = interpolate(frame, [26, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const diveOut = interpolate(frame, [76, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const portalZoom = interpolate(frame, [113, 134], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_EXPO,
  });

  const macroWeight = diveIn * (1 - diveOut);

  // Focal camera math:
  // When portalZoom > 0, smoothly lock pivot to exact Gemini pill center (1132, 168)
  // and accelerate zoom 1.0 -> 4.5x!
  const zoom = 1.0 + macroWeight * 0.54 + portalZoom * 3.5;
  const baseWx = width / 2 + macroWeight * 120;
  const baseWy = height / 2 + macroWeight * 48;
  const wx = baseWx + (GEMINI_PILL_TARGET.wx - baseWx) * Math.min(1, portalZoom * 1.45);
  const wy = baseWy + (GEMINI_PILL_TARGET.wy - baseWy) * Math.min(1, portalZoom * 1.45);

  // Directional blur strictly during fast camera travel (0 at rest)
  const diveInBlur =
    diveIn > 0.04 && diveIn < 0.96 ? Math.sin(diveIn * Math.PI) * 3.4 : 0;
  const diveOutBlur =
    diveOut > 0.04 && diveOut < 0.96 ? Math.sin(diveOut * Math.PI) * 3.2 : 0;
  const blurX = diveInBlur + diveOutBlur;

  // Live subscription switching: Claude (f0..f15) -> Codex (f16..f35) -> Gemini (f36+)
  const activeProv = frame < 16 ? "claude" : frame < 36 ? "codex" : "gemini";
  const activeColor =
    activeProv === "claude"
      ? T3E_THEME.claude
      : activeProv === "codex"
      ? T3E_THEME.codex
      : T3E_THEME.gemini;

  // Tactile Apply click at f94
  const applyFrame = 94;
  const isApplied = frame >= applyFrame;
  const applyPop = spring({
    frame: Math.max(0, frame - applyFrame),
    fps,
    config: SPRING_POP,
  });

  // Specular glass sheen
  const sheenX = interpolate(frame, [0, 115], [-720, 740], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <T3StudioCyclorama zoom={Math.min(2.2, zoom)} panX={-frame * 0.45} panY={-frame * 0.2} />

      <T3SpatialCamera wx={wx} wy={wy} zoom={zoom} blurX={blurX}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "90px 120px",
          }}
        >
          {/* High-Contrast Dark-Mode macOS T3Code Editor Window (Unfolds from top rail, opacity ALWAYS 1) */}
          <div
            style={{
              width: 1540,
              height: 820,
              borderRadius: T3E_THEME.radiusWindow,
              backgroundColor: T3E_THEME.obsidian,
              border: `1px solid ${T3E_THEME.editorBorder}`,
              boxShadow: T3E_THEME.shadowWindow,
              clipPath: `inset(0 0 ${clipBottomPct.toFixed(2)}% 0 round ${T3E_THEME.radiusWindow}px)`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Subtle specular studio glass sweep */}
            <div
              style={{
                position: "absolute",
                top: -60,
                bottom: -60,
                width: 280,
                left: "50%",
                transform: `translate3d(${sheenX}px, 0, 0) rotate(18deg)`,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.045) 50%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none",
                zIndex: 20,
              }}
            />

            {/* Top Bar (height=76px): macOS Traffic Lights + Mathematically Centered Subscription Switcher */}
            <div
              style={{
                height: 76,
                backgroundColor: "#0E1015",
                borderBottom: `1px solid ${T3E_THEME.editorBorderSubtle}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 26px",
                flexShrink: 0,
                position: "relative",
              }}
            >
              {/* macOS Traffic Lights + Brand */}
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: "#FF5F56" }} />
                  <span style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: "#FFBD2E" }} />
                  <span style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: "#27C93F" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <T3CodeMark size={30} darkSurface />
                  <span
                    style={{
                      fontFamily: T3E_FONTS.display,
                      fontWeight: 700,
                      fontSize: 22,
                      color: T3E_THEME.inkOnDark,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    T3Code
                  </span>
                </div>
              </div>

              {/* Exact-Center Subscription Switcher (3 x 164px pills, 8px gap -> Gemini center = X:1132, Y:168) */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: 6,
                  borderRadius: 14,
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                {(
                  [
                    { id: "claude", name: "Claude", color: T3E_THEME.claude },
                    { id: "codex", name: "Codex", color: T3E_THEME.codex },
                    { id: "gemini", name: "Gemini", color: T3E_THEME.gemini },
                  ] as const
                ).map((item) => {
                  const active = activeProv === item.id;
                  return (
                    <div
                      key={item.id}
                      style={{
                        width: GEMINI_PILL_TARGET.width,
                        height: GEMINI_PILL_TARGET.height,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 9,
                        borderRadius: GEMINI_PILL_TARGET.radius,
                        backgroundColor: active
                          ? T3E_THEME.obsidian
                          : "transparent",
                        border: active
                          ? `1.5px solid ${item.color}`
                          : "1px solid transparent",
                        boxSizing: "border-box",
                      }}
                    >
                      {item.id === "claude" && <ClaudeMark size={20} />}
                      {item.id === "codex" && <CodexMark size={20} light />}
                      {item.id === "gemini" && <GeminiMark size={20} />}
                      <span
                        style={{
                          fontFamily: T3E_FONTS.display,
                          fontWeight: 700,
                          fontSize: 20,
                          letterSpacing: "-0.02em",
                          color: active ? "#FFFFFF" : T3E_THEME.inkMutedOnDark,
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Right: Subscription Billing Status */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "8px 14px",
                  borderRadius: 999,
                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: "#10B981" }} />
                <span
                  style={{
                    fontFamily: T3E_FONTS.mono,
                    fontWeight: 500,
                    fontSize: 16,
                    color: "#6EE7B7",
                  }}
                >
                  Your Subscription
                </span>
              </div>
            </div>

            {/* Body: Sidebar + Main Editor Pane */}
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
              {/* Left File Tree Sidebar */}
              <div
                style={{
                  width: 300,
                  backgroundColor: "#0F1117",
                  borderRight: `1px solid ${T3E_THEME.editorBorderSubtle}`,
                  padding: "24px 18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: T3E_FONTS.mono,
                      fontSize: 14,
                      fontWeight: 600,
                      color: T3E_THEME.inkMutedOnDark,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 16,
                      paddingLeft: 10,
                    }}
                  >
                    WORKSPACE
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {FILES.map((f) => (
                      <div
                        key={f.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "11px 12px",
                          borderRadius: 9,
                          backgroundColor: f.active
                            ? "rgba(37, 99, 235, 0.16)"
                            : "transparent",
                          border: f.active
                            ? "1px solid rgba(59, 130, 246, 0.35)"
                            : "1px solid transparent",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: T3E_FONTS.mono,
                            fontSize: 17,
                            fontWeight: f.active ? 600 : 400,
                            color: f.active ? "#FFFFFF" : T3E_THEME.inkMutedOnDark,
                          }}
                        >
                          {f.name}
                        </span>
                        {f.badge && (
                          <span
                            style={{
                              fontFamily: T3E_FONTS.mono,
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#34D399",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {f.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Active Model Indicator */}
                <div
                  style={{
                    padding: "14px 14px",
                    borderRadius: 11,
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        backgroundColor: activeColor,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: T3E_FONTS.sans,
                        fontWeight: 600,
                        fontSize: 17,
                        color: "#FFFFFF",
                        textTransform: "capitalize",
                      }}
                    >
                      {activeProv} Active
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: T3E_FONTS.mono,
                      fontSize: 14,
                      color: T3E_THEME.inkMutedOnDark,
                    }}
                  >
                    ⌘M
                  </span>
                </div>
              </div>

              {/* Right Main Code Editor Pane */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: T3E_THEME.editorSurface,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {/* Editor File Tab & Diff Summary Header */}
                <div
                  style={{
                    height: 58,
                    borderBottom: `1px solid ${T3E_THEME.editorBorderSubtle}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 28px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span
                      style={{
                        fontFamily: T3E_FONTS.mono,
                        fontWeight: 600,
                        fontSize: 19,
                        color: "#FFFFFF",
                      }}
                    >
                      src/auth/session.ts
                    </span>
                    <span
                      style={{
                        fontFamily: T3E_FONTS.mono,
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#34D399",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +38
                    </span>
                    <span
                      style={{
                        fontFamily: T3E_FONTS.mono,
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#F87171",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      -12
                    </span>
                  </div>

                  {/* Tactile Apply Diff Action Pill */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 20px",
                      borderRadius: 10,
                      backgroundColor: isApplied ? "#10B981" : T3E_THEME.cobalt,
                      transform: `scale(${isApplied ? 0.96 + applyPop * 0.04 : 1})`,
                      boxShadow: isApplied
                        ? "0 8px 24px rgba(16, 185, 129, 0.35)"
                        : "0 8px 24px rgba(37, 99, 235, 0.35)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: T3E_FONTS.sans,
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#FFFFFF",
                      }}
                    >
                      {isApplied ? "Applied ✓" : "⌘↵ Apply Diff"}
                    </span>
                  </div>
                </div>

                {/* Multi-Token Syntax Code Block (Zero Blank-Gap Diff Holes) */}
                <div
                  style={{
                    flex: 1,
                    padding: "28px 32px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  {CODE_LINES.map((line) => {
                    let expandProgress = 1;
                    if (line.revealAtFrame !== undefined) {
                      expandProgress = spring({
                        frame: Math.max(0, frame - line.revealAtFrame),
                        fps,
                        config: SPRING_SNAPPY,
                      });
                    }

                    const isAdd = line.kind === "add";
                    const isDel = line.kind === "del";
                    const rowHeight = isAdd ? 50 * expandProgress : 50;

                    if (isAdd && expandProgress <= 0.01) {
                      return null;
                    }

                    return (
                      <div
                        key={line.num}
                        style={{
                          height: rowHeight,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          padding: "0 18px",
                          borderRadius: 6,
                          backgroundColor: isAdd
                            ? T3E_THEME.diffAddBg
                            : isDel
                            ? T3E_THEME.diffDelBg
                            : "transparent",
                          borderLeft: isAdd
                            ? `3px solid ${T3E_THEME.diffAddBorder}`
                            : isDel
                            ? `3px solid ${T3E_THEME.diffDelBorder}`
                            : "3px solid transparent",
                          opacity: isAdd ? Math.min(1, expandProgress * 1.4) : 1,
                        }}
                      >
                        <span
                          style={{
                            width: 48,
                            fontFamily: T3E_FONTS.mono,
                            fontSize: 18,
                            color: C.muted,
                            fontVariantNumeric: "tabular-nums",
                            flexShrink: 0,
                          }}
                        >
                          {line.num}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            whiteSpace: "pre",
                            fontFamily: T3E_FONTS.mono,
                            fontSize: 22,
                            fontWeight: 500,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {line.tokens.map((tok, i) => (
                            <span key={i} style={{ color: tok.color }}>
                              {tok.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </T3SpatialCamera>
    </AbsoluteFill>
  );
};
