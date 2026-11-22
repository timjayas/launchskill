import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ANTIGRAVITY_THEME,
  AntigravityMark,
  SpatialCameraRig2D,
  StudioLightBackdrop,
} from "../../components/AntigravityPrimitives";
import {
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  SPRING_EDITORIAL,
  SPRING_POP,
  computeSecondarySettle,
  computeVelocityBlur,
  sec,
} from "../../lib/studioMotion";

export interface AntigravityIdeDiffSceneProps {
  repoChip: string;
  accentColor: string;
  skyColor: string;
}

interface DiffLine {
  num: string;
  kind: "ctx" | "del" | "add";
  code: string;
}

const DIFF_LINES: DiffLine[] = [
  { num: "14", kind: "ctx", code: "export async function handleStripeWebhook(req: Request) {" },
  { num: "15", kind: "del", code: "  const event = JSON.parse(await req.text());" },
  { num: "16", kind: "add", code: "  const sig = req.headers.get('stripe-signature') ?? '';" },
  { num: "17", kind: "add", code: "  const event = verifySignature(await req.text(), sig);" },
  { num: "18", kind: "add", code: "  await retryQueue.enqueue(event.id, {" },
  { num: "19", kind: "add", code: "    attempts: 5, backoff: 'exponential', idempotencyKey: event.id" },
  { num: "20", kind: "add", code: "  });" },
  { num: "21", kind: "ctx", code: "  return Response.json({ received: true, id: event.id });" },
  { num: "22", kind: "ctx", code: "}" },
];

const WORKSPACE_FILES = [
  { name: "src/api/webhooks.ts", delta: "+68", active: true },
  { name: "src/workers/retryQueue.ts", delta: "+74", active: false },
  { name: "tests/webhooks.test.ts", delta: "+44", active: false },
  { name: "src/types/stripe.ts", delta: "+14", active: false },
];

/**
 * Shot 4 (Beats 24 -> 34, 5.0s): Crisp Light-Studio Orthogonal IDE Multi-File Diff + Macro Camera Rig
 * - Pure white #FFFFFF editor & #F6F8FB sidebar on airy studio paper canvas.
 * - Live streaming TypeScript diff + light terminal flipping green (18/18 PASSED · 42ms).
 * - <SpatialCameraRig2D> pushes smoothly in (1.0 -> 1.46x) with directional velocity blur,
 *   holds 2.1s rock-solid at 0px blur, then pulls cleanly back to 1.0x.
 */
export const AntigravityIdeDiffScene: React.FC<AntigravityIdeDiffSceneProps> = ({
  repoChip,
  accentColor,
  skyColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const winSpring = spring({
    frame: frame + sec(0.08, fps),
    fps,
    config: SPRING_EDITORIAL,
  });
  const innerSettle = computeSecondarySettle(frame, 0, fps, 0.065, 6);

  const evalCamera = (f: number) => {
    const push = interpolate(f, [sec(0.85, fps), sec(1.55, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const pull = interpolate(f, [sec(3.65, fps), sec(4.45, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    });
    const k = Math.max(0, push - pull);
    return {
      wx: interpolate(k, [0, 1], [960, 1110]),
      wy: interpolate(k, [0, 1], [540, 595]),
      zoom: interpolate(k, [0, 1], [1.0, 1.46]),
    };
  };

  const cam = evalCamera(frame);
  const prevCam = evalCamera(Math.max(0, frame - 1));
  const { blurX, blurY } = computeVelocityBlur(
    cam.wx,
    cam.wy,
    prevCam.wx,
    prevCam.wy,
    fps,
    0.09,
    8
  );

  const testsPassFrame = sec(2.15, fps);
  const testsPassed = frame >= testsPassFrame;
  const passBadgePop = spring({
    frame: Math.max(0, frame - testsPassFrame),
    fps,
    config: SPRING_POP,
  });

  const passedCount = Math.round(
    interpolate(frame, [sec(1.4, fps), testsPassFrame], [4, 18], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    })
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT_SANS }}>
      <StudioLightBackdrop surface="paper" showGrid glowX="58%" glowY="46%" glowIntensity={0.09} />

      <SpatialCameraRig2D
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
            padding: "90px 128px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Light Architectural IDE Workspace Window (1640 x 860) */}
          <div
            style={{
              width: 1640,
              height: 860,
              borderRadius: ANTIGRAVITY_THEME.radiusWindow,
              backgroundColor: "#FFFFFF",
              border: `1.5px solid ${ANTIGRAVITY_THEME.borderStrong}`,
              boxShadow: ANTIGRAVITY_THEME.shadowHero,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transform: `scale(${0.97 + winSpring * 0.03}) translate3d(0, ${(1 - winSpring) * 14}px, 0)`,
              opacity: Math.min(1, winSpring * 1.25),
            }}
          >
            {/* Window Title Bar */}
            <div
              style={{
                height: 54,
                padding: "0 22px",
                backgroundColor: "#F8FAFC",
                borderBottom: `1px solid ${ANTIGRAVITY_THEME.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: "rgba(11,13,18,0.14)" }} />
                  <span style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: "rgba(11,13,18,0.14)" }} />
                  <span style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: "rgba(11,13,18,0.14)" }} />
                </div>
                <AntigravityMark size={22} variant="light" accentColor={accentColor} skyColor={skyColor} />
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 17,
                    fontWeight: 700,
                    color: ANTIGRAVITY_THEME.ink,
                  }}
                >
                  {repoChip}
                </span>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 15,
                    fontWeight: 500,
                    color: ANTIGRAVITY_THEME.inkMuted,
                  }}
                >
                  feat/stripe-webhooks
                </span>
              </div>

              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 15,
                  fontWeight: 700,
                  color: testsPassed ? ANTIGRAVITY_THEME.success : accentColor,
                  backgroundColor: testsPassed
                    ? ANTIGRAVITY_THEME.successBg
                    : ANTIGRAVITY_THEME.accentSoft,
                  border: testsPassed
                    ? `1px solid ${ANTIGRAVITY_THEME.successBorder}`
                    : `1px solid ${ANTIGRAVITY_THEME.accentBorder}`,
                  padding: "5px 12px",
                  borderRadius: 7,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {testsPassed ? "✓ VERIFIED · 0 ERRORS" : "VERIFYING DIFF..."}
              </span>
            </div>

            {/* IDE Body */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              {/* Left File Tree Sidebar */}
              <div
                style={{
                  width: 370,
                  backgroundColor: "#F8FAFC",
                  borderRight: `1px solid ${ANTIGRAVITY_THEME.border}`,
                  padding: "22px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  flexShrink: 0,
                  opacity: innerSettle.opacity,
                  transform: `translate3d(0, ${innerSettle.translateY}px, 0)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: ANTIGRAVITY_THEME.inkMuted,
                    textTransform: "uppercase",
                    padding: "0 10px 8px",
                  }}
                >
                  CHANGED FILES (4)
                </div>

                {WORKSPACE_FILES.map((file, idx) => {
                  const fileSpring = spring({
                    frame: Math.max(0, frame - sec(0.08 + idx * 0.07, fps)),
                    fps,
                    config: SPRING_EDITORIAL,
                  });
                  return (
                    <div
                      key={file.name}
                      style={{
                        height: 48,
                        padding: "0 14px",
                        borderRadius: 9,
                        backgroundColor: file.active ? "#FFFFFF" : "transparent",
                        border: file.active
                          ? `1.5px solid ${ANTIGRAVITY_THEME.accentBorder}`
                          : "1px solid transparent",
                        boxShadow: file.active ? "0 4px 12px rgba(11,13,18,0.05)" : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        opacity: fileSpring,
                        transform: `translate3d(${(1 - fileSpring) * 10}px, 0, 0)`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 16,
                          fontWeight: file.active ? 700 : 500,
                          color: file.active
                            ? ANTIGRAVITY_THEME.ink
                            : ANTIGRAVITY_THEME.inkSecondary,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.name}
                      </span>
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 15,
                          fontWeight: 700,
                          color: ANTIGRAVITY_THEME.success,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {file.delta}
                      </span>
                    </div>
                  );
                })}

                {/* Agent Review Card */}
                <div
                  style={{
                    marginTop: "auto",
                    borderRadius: 12,
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${ANTIGRAVITY_THEME.border}`,
                    boxShadow: "0 6px 18px rgba(11,13,18,0.04)",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 13,
                      fontWeight: 700,
                      color: accentColor,
                      letterSpacing: "0.06em",
                    }}
                  >
                    AGENT REVIEW
                  </span>
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 500,
                      lineHeight: 1.4,
                      color: ANTIGRAVITY_THEME.inkSecondary,
                    }}
                  >
                    Signature verification & exponential retry queue validated against Stripe fixtures.
                  </span>
                </div>
              </div>

              {/* Right Code Diff + Integrated Light Verification Terminal */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Editor Tab Bar */}
                <div
                  style={{
                    height: 46,
                    padding: "0 24px",
                    borderBottom: `1px solid ${ANTIGRAVITY_THEME.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: accentColor,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 17,
                        fontWeight: 700,
                        color: ANTIGRAVITY_THEME.ink,
                      }}
                    >
                      src/api/webhooks.ts
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 15,
                      fontWeight: 700,
                      color: ANTIGRAVITY_THEME.success,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    +68 −14 · TypeScript
                  </span>
                </div>

                {/* Streaming Light-Mode Code Diff Area */}
                <div
                  style={{
                    flex: 1,
                    padding: "22px 26px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontFamily: FONT_MONO,
                    fontSize: 21,
                    lineHeight: 1.55,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  {DIFF_LINES.map((line, i) => {
                    const lineReveal =
                      line.kind === "add"
                        ? spring({
                            frame: Math.max(0, frame - sec(0.32 + i * 0.13, fps)),
                            fps,
                            config: SPRING_EDITORIAL,
                          })
                        : 1;

                    const bg =
                      line.kind === "add"
                        ? ANTIGRAVITY_THEME.successBg
                        : line.kind === "del"
                          ? ANTIGRAVITY_THEME.dangerBg
                          : "transparent";

                    const gutterColor =
                      line.kind === "add"
                        ? ANTIGRAVITY_THEME.success
                        : line.kind === "del"
                          ? ANTIGRAVITY_THEME.danger
                          : ANTIGRAVITY_THEME.inkSoft;

                    const prefix = line.kind === "add" ? "+" : line.kind === "del" ? "−" : " ";

                    return (
                      <div
                        key={line.num}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 18,
                          padding: "4px 14px",
                          borderRadius: 7,
                          backgroundColor: bg,
                          borderLeft:
                            line.kind === "add"
                              ? `3px solid ${ANTIGRAVITY_THEME.success}`
                              : line.kind === "del"
                                ? `3px solid ${ANTIGRAVITY_THEME.danger}`
                                : "3px solid transparent",
                          opacity: lineReveal,
                          transform: `translate3d(${(1 - lineReveal) * 14}px, 0, 0)`,
                        }}
                      >
                        <span
                          style={{
                            width: 30,
                            color: ANTIGRAVITY_THEME.inkSoft,
                            fontSize: 16,
                            fontVariantNumeric: "tabular-nums",
                            textAlign: "right",
                            flexShrink: 0,
                          }}
                        >
                          {line.num}
                        </span>
                        <span
                          style={{
                            width: 16,
                            color: gutterColor,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {prefix}
                        </span>
                        <span
                          style={{
                            color:
                              line.kind === "del"
                                ? "#991B1B"
                                : line.kind === "add"
                                  ? "#064E3B"
                                  : ANTIGRAVITY_THEME.inkSecondary,
                            fontWeight: line.kind === "add" ? 600 : 500,
                            textDecoration: line.kind === "del" ? "line-through" : "none",
                            whiteSpace: "pre",
                          }}
                        >
                          {line.code}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Integrated Bottom Light Verification Terminal */}
                <div
                  style={{
                    height: 224,
                    backgroundColor: "#F8FAFC",
                    borderTop: `1.5px solid ${ANTIGRAVITY_THEME.borderStrong}`,
                    padding: "20px 28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 15,
                          fontWeight: 700,
                          color: ANTIGRAVITY_THEME.inkMuted,
                          letterSpacing: "0.06em",
                        }}
                      >
                        TERMINAL · AUTO-VERIFY
                      </span>
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 17,
                          fontWeight: 700,
                          color: accentColor,
                        }}
                      >
                        $ npx vitest run tests/webhooks.test.ts
                      </span>
                    </div>

                    {/* Prominent Emerald Pass Pill */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 16px",
                        borderRadius: 9,
                        backgroundColor: testsPassed
                          ? ANTIGRAVITY_THEME.success
                          : "#FFFFFF",
                        color: testsPassed ? "#FFFFFF" : accentColor,
                        border: testsPassed
                          ? "1px solid transparent"
                          : `1px solid ${ANTIGRAVITY_THEME.accentBorder}`,
                        fontFamily: FONT_MONO,
                        fontSize: 18,
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                        transform: testsPassed ? `scale(${0.86 + passBadgePop * 0.14})` : "scale(1)",
                        boxShadow: testsPassed
                          ? "0 10px 28px rgba(5,150,105,0.32)"
                          : "none",
                      }}
                    >
                      <span>{testsPassed ? "✓" : "●"}</span>
                      <span>{passedCount} / 18 PASSED</span>
                      <span>·</span>
                      <span>42ms</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px 28px",
                      fontFamily: FONT_MONO,
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                  >
                    {[
                      { label: "verifies HMAC signature header", ms: "9ms", doneAt: 1.55 },
                      { label: "enqueues exponential backoff retries", ms: "14ms", doneAt: 1.75 },
                      { label: "deduplicates repeated idempotency keys", ms: "11ms", doneAt: 1.95 },
                      { label: "passes tsc --noEmit with 0 errors", ms: "8ms", doneAt: 2.1 },
                    ].map((test) => {
                      const ok = frame >= sec(test.doneAt, fps);
                      return (
                        <div
                          key={test.label}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            borderRadius: 8,
                            backgroundColor: ok ? "#ECFDF5" : "#FFFFFF",
                            border: ok
                              ? `1px solid ${ANTIGRAVITY_THEME.successBorder}`
                              : `1px solid ${ANTIGRAVITY_THEME.border}`,
                          }}
                        >
                          <span style={{ color: ok ? ANTIGRAVITY_THEME.ink : ANTIGRAVITY_THEME.inkMuted }}>
                            <span style={{ color: ok ? ANTIGRAVITY_THEME.success : accentColor, marginRight: 10 }}>
                              {ok ? "✓" : "…"}
                            </span>
                            {test.label}
                          </span>
                          <span
                            style={{
                              color: ANTIGRAVITY_THEME.inkMuted,
                              fontVariantNumeric: "tabular-nums",
                              fontSize: 16,
                            }}
                          >
                            {test.ms}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SpatialCameraRig2D>
    </AbsoluteFill>
  );
};
