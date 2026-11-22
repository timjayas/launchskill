import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AgentAppIcon,
  FONT_MONO,
  FONT_SANS,
  T3_THEME,
  T3Cursor,
  T3SpatialCameraRig,
  T3StudioCyclorama,
  type AgentBrandId,
} from "../../components/T3CodePrimitives";
import {
  EASE_IN_EXPO,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  SPRING_EDITORIAL,
  SPRING_POP,
  computeVelocityBlur,
  sec,
} from "../../lib/studioMotion";

export interface T3ControlPlaneWorkspaceSceneProps {
  repoName: string;
}

interface ThreadItem {
  id: string;
  brand: AgentBrandId;
  agent: string;
  title: string;
  branch: string;
  deltaAdd: string;
  deltaDel: string;
  accent: string;
  active?: boolean;
  doneAtSec: number;
}

const THREADS: ThreadItem[] = [
  {
    id: "claude",
    brand: "claude",
    agent: "Claude Code",
    title: "Passkey auth flow",
    branch: "wt/passkey-auth",
    deltaAdd: "+94",
    deltaDel: "−26",
    accent: T3_THEME.claude,
    active: true,
    doneAtSec: 0.65,
  },
  {
    id: "codex",
    brand: "codex",
    agent: "Codex CLI",
    title: "Playwright E2E suite",
    branch: "wt/e2e-tests",
    deltaAdd: "+48",
    deltaDel: "−12",
    accent: T3_THEME.codex,
    doneAtSec: 1.02,
  },
  {
    id: "opencode",
    brand: "opencode",
    agent: "OpenCode",
    title: "Migration notes",
    branch: "wt/docs",
    deltaAdd: "+22",
    deltaDel: "−4",
    accent: T3_THEME.opencode,
    doneAtSec: 1.32,
  },
];

// Authentic VS Code / Cursor / Zed dark-mode token syntax colors
const SYN = {
  kw: "#C084FC",      // keywords: export, async, function, const, await, return
  fn: "#60A5FA",      // functions: verifySignIn, verifyWebAuthn, createSessionCookie
  type: "#2DD4BF",    // types: Request, PasskeyAssertion
  ident: "#E4E4E7",   // identifiers
  prop: "#93C5FD",    // properties
  str: "#FCD34D",     // strings
  punct: "#71717A",   // braces, punctuation
  del: "#FCA5A5",     // deleted line text
} as const;

interface TokenSpan {
  text: string;
  color: string;
}

interface SyntaxDiffLine {
  num: string;
  kind: "ctx" | "del" | "add";
  tokens: TokenSpan[];
}

const INLINE_DIFF: SyntaxDiffLine[] = [
  {
    num: "18",
    kind: "ctx",
    tokens: [
      { text: "export async function ", color: SYN.kw },
      { text: "verifySignIn", color: SYN.fn },
      { text: "(", color: SYN.punct },
      { text: "req", color: SYN.ident },
      { text: ": ", color: SYN.punct },
      { text: "Request", color: SYN.type },
      { text: ") {", color: SYN.punct },
    ],
  },
  {
    num: "19",
    kind: "del",
    tokens: [
      { text: "  const { email, password } = await req.json();", color: SYN.del },
    ],
  },
  {
    num: "20",
    kind: "del",
    tokens: [
      { text: "  return verifyPasswordHash(email, password);", color: SYN.del },
    ],
  },
  {
    num: "21",
    kind: "add",
    tokens: [
      { text: "  const ", color: SYN.kw },
      { text: "assertion ", color: SYN.ident },
      { text: "= ", color: SYN.punct },
      { text: "await ", color: SYN.kw },
      { text: "req", color: SYN.ident },
      { text: ".", color: SYN.punct },
      { text: "json", color: SYN.fn },
      { text: "<", color: SYN.punct },
      { text: "PasskeyAssertion", color: SYN.type },
      { text: ">();", color: SYN.punct },
    ],
  },
  {
    num: "22",
    kind: "add",
    tokens: [
      { text: "  const ", color: SYN.kw },
      { text: "{ ", color: SYN.punct },
      { text: "verified", color: SYN.ident },
      { text: ", ", color: SYN.punct },
      { text: "user ", color: SYN.ident },
      { text: "} = ", color: SYN.punct },
      { text: "await ", color: SYN.kw },
      { text: "verifyWebAuthn", color: SYN.fn },
      { text: "({", color: SYN.punct },
    ],
  },
  {
    num: "23",
    kind: "add",
    tokens: [
      { text: "    assertion", color: SYN.ident },
      { text: ", ", color: SYN.punct },
      { text: "expectedOrigin", color: SYN.prop },
      { text: ": ", color: SYN.punct },
      { text: "env", color: SYN.ident },
      { text: ".", color: SYN.punct },
      { text: "APP_ORIGIN", color: SYN.prop },
      { text: ", ", color: SYN.punct },
      { text: "rpId", color: SYN.prop },
      { text: ": ", color: SYN.punct },
      { text: "'t3.codes'", color: SYN.str },
    ],
  },
  {
    num: "24",
    kind: "add",
    tokens: [
      { text: "  });", color: SYN.punct },
    ],
  },
  {
    num: "25",
    kind: "ctx",
    tokens: [
      { text: "  return ", color: SYN.kw },
      { text: "createSessionCookie", color: SYN.fn },
      { text: "(", color: SYN.punct },
      { text: "user", color: SYN.ident },
      { text: ".", color: SYN.punct },
      { text: "id", color: SYN.prop },
      { text: ");", color: SYN.punct },
    ],
  },
  {
    num: "26",
    kind: "ctx",
    tokens: [{ text: "}", color: SYN.punct }],
  },
];

/**
 * Beat 3 (Beats 9 -> 24 @ 132 BPM, 6.82s = 204f):
 * Dark-Mode macOS T3 Code Desktop App Floating on Bright #F9F9F8 Studio Cyclorama
 * - High figure-ground contrast: deep #0D0D10 macOS window + real #FF5F56/#FFBD2E/#27C93F traffic
 *   lights + specular hairline + deep grounded studio shadow floating cleanly on #F9F9F8!
 * - Zero blank diff gaps: all code populated cleanly from frame 0 with authentic multi-token
 *   syntax highlighting and crisp emerald diff illumination sweeping in as the camera pushes.
 * - Parallel isolated Claude Code / Codex CLI / OpenCode threads -> <T3SpatialCameraRig> macro push
 *   into inline diff (+142 -38) -> smooth glide & tactile click on Commit & push -> "PR #412 Opened ✓".
 */
export const T3ControlPlaneWorkspaceScene: React.FC<T3ControlPlaneWorkspaceSceneProps> = ({
  repoName,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enterP = interpolate(frame, [0, sec(0.28, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  const exitLead = sec(0.22, fps);
  const exitP = interpolate(
    frame,
    [durationInFrames - exitLead, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    }
  );

  // Continuous 3-stage <T3SpatialCameraRig> choreography (zero parked frames!)
  const evalCamera = (f: number) => {
    const pushDiff = interpolate(f, [sec(1.24, fps), sec(1.88, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const toCommit = interpolate(f, [sec(3.40, fps), sec(4.08, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });

    const diffDriftX = interpolate(f, [sec(1.88, fps), sec(3.40, fps)], [0, 32], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const diffDriftY = interpolate(f, [sec(1.88, fps), sec(3.40, fps)], [0, 16], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const wideDrift = interpolate(f, [0, sec(1.24, fps)], [0, 0.035], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const wxWide = 960;
    const wyWide = 540;
    const wxDiff = 1125 + diffDriftX;
    const wyDiff = 536 + diffDriftY;
    const wxShip = 1185;
    const wyShip = 330;

    const wx1 = interpolate(pushDiff, [0, 1], [wxWide, wxDiff]);
    const wy1 = interpolate(pushDiff, [0, 1], [wyWide, wyDiff]);
    const z1 = interpolate(pushDiff, [0, 1], [0.965 + wideDrift, 1.48]);

    const wx = interpolate(toCommit, [0, 1], [wx1, wxShip]);
    const wy = interpolate(toCommit, [0, 1], [wy1, wyShip]);
    const zoom = interpolate(toCommit, [0, 1], [z1, 1.24]);

    const envZoom = (0.88 + enterP * 0.12) * (1 - exitP * 0.1);
    return { wx, wy, zoom: zoom * envZoom };
  };

  const cam = evalCamera(frame);
  const prevCam = evalCamera(Math.max(0, frame - 1));
  const { blurX, blurY } = computeVelocityBlur(
    cam.wx,
    cam.wy,
    prevCam.wx,
    prevCam.wy,
    fps,
    0.075,
    7
  );

  // Tactile cursor glides cleanly onto Commit & push button (world center ~1632, 152)
  const cursorStart = sec(4.15, fps);
  const cursorArrive = sec(4.68, fps);
  const clickFrame = sec(4.82, fps);
  const isHover = frame >= cursorArrive - sec(0.1, fps) && frame < clickFrame;
  const isPushed = frame >= clickFrame;

  const cursorT = interpolate(frame, [cursorStart, cursorArrive], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  const fromPt = { x: 1260, y: 610 };
  const toPt = { x: 1544, y: 326 };
  const ctrlX = 1445;
  const ctrlY = 510;
  const inv = 1 - cursorT;
  const cursorX = inv * inv * fromPt.x + 2 * inv * cursorT * ctrlX + cursorT * cursorT * toPt.x;
  const cursorY = inv * inv * fromPt.y + 2 * inv * cursorT * ctrlY + cursorT * cursorT * toPt.y;

  const cursorOpacity =
    interpolate(
      frame,
      [cursorStart - sec(0.05, fps), cursorStart + sec(0.1, fps)],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    ) *
    (1 - exitP);

  const clickScale = interpolate(
    frame,
    [clickFrame, clickFrame + sec(0.08, fps), clickFrame + sec(0.22, fps)],
    [1, 0.85, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const rippleProgress = interpolate(frame, [clickFrame, clickFrame + sec(0.46, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const prPop = spring({
    frame: Math.max(0, frame - clickFrame),
    fps,
    config: SPRING_POP,
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        fontFamily: FONT_SANS,
      }}
    >
      {/* Camera-Coupled Studio Cyclorama + Precision Dot-Grid Gliding 1:1 Behind Dark macOS Window */}
      <T3StudioCyclorama
        zoom={cam.zoom}
        panX={(960 - cam.wx) * 0.45}
        panY={(540 - cam.wy) * 0.45}
      />

      <T3SpatialCameraRig
        focusX={cam.wx}
        focusY={cam.wy}
        zoom={cam.zoom}
        blurX={blurX}
        blurY={blurY}
      >
        <div
          style={{
            width: 1920,
            height: 1080,
            padding: "96px 128px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: Math.max(0.88, Math.min(1, enterP * 1.45)) * (1 - exitP * 0.45),
          }}
        >
          {/* Authentic Dark-Mode macOS Desktop Window Floating on Bright #F9F9F8 Studio Floor */}
          <div
            style={{
              width: 1624,
              height: 836,
              borderRadius: 18,
              backgroundColor: "#0D0D10",
              border: "1px solid rgba(255, 255, 255, 0.13)",
              boxShadow:
                "0 44px 110px rgba(10, 10, 14, 0.34), 0 14px 34px rgba(10, 10, 14, 0.20), 0 0 0 1px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Authentic macOS Dark Vibrancy Titlebar */}
            <div
              style={{
                height: 58,
                padding: "0 22px",
                backgroundColor: "#141418",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              {/* Left Authentic macOS Traffic Lights + Workspace Title */}
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: 999,
                      backgroundColor: "#FF5F56",
                      border: "0.5px solid #E0443E",
                    }}
                  />
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: 999,
                      backgroundColor: "#FFBD2E",
                      border: "0.5px solid #DEA123",
                    }}
                  />
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: 999,
                      backgroundColor: "#27C93F",
                      border: "0.5px solid #1AAB29",
                    }}
                  />
                </div>

                <div
                  style={{
                    width: 1,
                    height: 20,
                    backgroundColor: "rgba(255, 255, 255, 0.10)",
                  }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <AgentAppIcon
                    brand="t3"
                    size={26}
                    elevated={false}
                    style={{ border: "1px solid rgba(255,255,255,0.22)" }}
                  />
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: "#FAFAFA",
                    }}
                  >
                    {repoName}
                  </span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 7,
                      backgroundColor: "rgba(255, 255, 255, 0.07)",
                      border: "1px solid rgba(255, 255, 255, 0.09)",
                      fontFamily: FONT_MONO,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#A1A1AA",
                    }}
                  >
                    ⎇ wt/passkey-auth
                  </span>
                </div>
              </div>

              {/* Right Combined Diff Stat + Crisp High-Contrast Commit & Push / Open PR Button */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.09)",
                    fontFamily: FONT_MONO,
                    fontSize: 14,
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <span style={{ color: "#4ADE80" }}>+142</span>
                  <span style={{ color: "#F87171", marginLeft: 8 }}>−38</span>
                </span>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "9px 18px",
                    borderRadius: 10,
                    backgroundColor: isPushed ? "#16A34A" : "#FAFAFA",
                    color: isPushed ? "#FFFFFF" : "#09090B",
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "-0.015em",
                    transform: `translate3d(0, ${isHover ? -2 : 0}px, 0) scale(${
                      isPushed ? 0.92 + prPop * 0.08 : clickScale
                    })`,
                    boxShadow: isHover
                      ? "0 8px 24px rgba(255, 255, 255, 0.22)"
                      : isPushed
                        ? "0 10px 28px rgba(22, 163, 74, 0.42)"
                        : "none",
                  }}
                >
                  <span>{isPushed ? "PR #412 Opened ✓" : "Commit & push"}</span>
                  {!isPushed && (
                    <span style={{ opacity: 0.52, fontSize: 13, fontFamily: FONT_MONO }}>
                      · Open PR
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Dark macOS Split Workspace Body */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              {/* Left Isolated Parallel Agent Threads Sidebar */}
              <div
                style={{
                  width: 396,
                  backgroundColor: "#111115",
                  borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "22px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 8px 6px",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: "#71717A",
                    textTransform: "uppercase",
                  }}
                >
                  <span>Parallel Threads</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#A1A1AA" }}>
                    3 worktrees
                  </span>
                </div>

                {THREADS.map((t, idx) => {
                  const done = frame >= sec(t.doneAtSec, fps);
                  const pop = spring({
                    frame: Math.max(0, frame - sec(t.doneAtSec, fps)),
                    fps,
                    config: SPRING_POP,
                  });
                  const rowIn = spring({
                    frame: frame + sec(0.16 - idx * 0.03, fps),
                    fps,
                    config: SPRING_EDITORIAL,
                  });

                  return (
                    <div
                      key={t.id}
                      style={{
                        padding: "15px 15px",
                        borderRadius: 13,
                        backgroundColor: t.active
                          ? "#1A1A21"
                          : "rgba(255, 255, 255, 0.02)",
                        border: t.active
                          ? "1px solid rgba(255, 255, 255, 0.14)"
                          : "1px solid rgba(255, 255, 255, 0.04)",
                        boxShadow: t.active
                          ? "0 8px 22px rgba(0, 0, 0, 0.28)"
                          : "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        opacity: Math.max(0.84, rowIn),
                        transform: `translate3d(0, ${(1 - rowIn) * 6}px, 0)`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <AgentAppIcon brand={t.brand} size={34} elevated={false} />
                          <div>
                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                color: "#FAFAFA",
                                lineHeight: 1.18,
                              }}
                            >
                              {t.agent}
                            </div>
                            <div
                              style={{
                                fontSize: 13.5,
                                fontWeight: 500,
                                color: "#A1A1AA",
                              }}
                            >
                              {t.title}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 999,
                            backgroundColor: done ? "#22C55E" : "rgba(255, 255, 255, 0.09)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: done ? `scale(${0.78 + pop * 0.22})` : "scale(1)",
                          }}
                        >
                          {done ? (
                            <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                              <path
                                d="M5 12.5L10 17.5L19 7.5"
                                stroke="#09090B"
                                strokeWidth={3.4}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: 999,
                                backgroundColor: t.accent,
                              }}
                            />
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontFamily: FONT_MONO,
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#71717A",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        <span style={{ color: "#A1A1AA" }}>⎇ {t.branch}</span>
                        <span>
                          <span style={{ color: "#4ADE80" }}>{t.deltaAdd}</span>
                          <span style={{ color: "#F87171", marginLeft: 6 }}>{t.deltaDel}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Bottom Worktree Isolation Status Pill */}
                <div
                  style={{
                    marginTop: "auto",
                    padding: "13px 15px",
                    borderRadius: 12,
                    backgroundColor: isPushed
                      ? "rgba(34, 197, 94, 0.14)"
                      : "rgba(255, 255, 255, 0.04)",
                    border: `1px solid ${
                      isPushed
                        ? "rgba(74, 222, 128, 0.34)"
                        : "rgba(255, 255, 255, 0.08)"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: isPushed ? "#4ADE80" : "#D4D4D8",
                  }}
                >
                  <span>{isPushed ? "✓ Pushed to GitHub" : "Isolated worktrees"}</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 12.5, color: "#A1A1AA" }}>
                    {isPushed ? "PR #412" : "0 conflicts"}
                  </span>
                </div>
              </div>

              {/* Right Dark-Mode Inline Syntax Diff Pane (Zero Blank Gaps!) */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#0D0D10",
                  overflow: "hidden",
                }}
              >
                {/* Clean File Tab Header */}
                <div
                  style={{
                    height: 50,
                    padding: "0 26px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: "#111115",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <AgentAppIcon brand="claude" size={22} elevated={false} />
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#FAFAFA",
                      }}
                    >
                      src/auth/passkey.ts
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#71717A",
                      }}
                    >
                      Inline diff
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 14,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    <span style={{ color: "#4ADE80" }}>+142</span>
                    <span style={{ color: "#F87171", marginLeft: 8 }}>−38</span>
                  </span>
                </div>

                {/* Multi-Token Syntax-Highlighted Code Diff (100% Populated From Frame 0!) */}
                <div
                  style={{
                    flex: 1,
                    padding: "28px 28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 8,
                    fontFamily: FONT_MONO,
                    fontSize: 20,
                    lineHeight: 1.52,
                  }}
                >
                  {INLINE_DIFF.map((row, idx) => {
                    // Subtle emerald highlight sweep across added lines (never hides code / zero blank holes!)
                    const highlightSweep =
                      row.kind === "add"
                        ? interpolate(
                            frame,
                            [sec(0.25 + idx * 0.12, fps), sec(0.65 + idx * 0.12, fps)],
                            [0.45, 1],
                            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT_EXPO }
                          )
                        : 1;

                    const bg =
                      row.kind === "add"
                        ? `rgba(34, 197, 94, ${0.06 + highlightSweep * 0.08})`
                        : row.kind === "del"
                          ? "rgba(239, 68, 68, 0.12)"
                          : "transparent";

                    const barColor =
                      row.kind === "add"
                        ? `rgba(74, 222, 128, ${0.45 + highlightSweep * 0.55})`
                        : row.kind === "del"
                          ? "#F87171"
                          : "transparent";

                    return (
                      <div
                        key={row.num}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          padding: "6px 14px",
                          borderRadius: 8,
                          backgroundColor: bg,
                          borderLeft: `3px solid ${barColor}`,
                        }}
                      >
                        <span
                          style={{
                            width: 28,
                            fontSize: 15,
                            color: "#52525B",
                            textAlign: "right",
                            fontVariantNumeric: "tabular-nums",
                            flexShrink: 0,
                          }}
                        >
                          {row.num}
                        </span>
                        <span
                          style={{
                            width: 14,
                            fontWeight: 700,
                            color:
                              row.kind === "add"
                                ? "#4ADE80"
                                : row.kind === "del"
                                  ? "#F87171"
                                  : "#52525B",
                            flexShrink: 0,
                          }}
                        >
                          {row.kind === "add" ? "+" : row.kind === "del" ? "−" : " "}
                        </span>
                        <span
                          style={{
                            whiteSpace: "pre",
                            textDecoration: row.kind === "del" ? "line-through" : "none",
                            opacity: row.kind === "del" ? 0.78 : 1,
                          }}
                        >
                          {row.tokens.map((tok, tIdx) => (
                            <span key={tIdx} style={{ color: tok.color }}>
                              {tok.text}
                            </span>
                          ))}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Dark Integrated Checks Status Footer */}
                <div
                  style={{
                    height: 56,
                    padding: "0 26px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: "#111115",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#A1A1AA",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ color: "#4ADE80" }}>✓ 14 / 14 Playwright E2E passing</span>
                    <span style={{ color: "#3F3F46" }}>·</span>
                    <span>0 TypeScript errors</span>
                  </div>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: "#71717A" }}>
                    {isPushed ? "github.com/pingdotgg/t3-app/pull/412" : "Ready to push"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </T3SpatialCameraRig>

      {/* High-Contrast Light-Fill Cursor Over Dark macOS Chrome */}
      {frame >= cursorStart - sec(0.05, fps) && (
        <T3Cursor
          x={cursorX}
          y={cursorY}
          scale={clickScale}
          opacity={cursorOpacity}
          darkSurface={true}
          rippleProgress={rippleProgress}
          rippleColor="#4ADE80"
        />
      )}
    </AbsoluteFill>
  );
};
