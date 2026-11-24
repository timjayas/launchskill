import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  DirectionalBlurLayer,
  LS_THEME,
  LaunchSkillCyclorama,
  MaskedHeadline,
} from "../../components/LaunchSkillPrimitives";
import {
  EASE_OUT_EXPO,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  getSpringForMass,
  sec,
} from "../../lib/studioMotion";

const QA_STRIP_FRAMES = [
  { id: "01", label: "HOOK · 0.0s", dark: false, accentWidth: 62 },
  { id: "02", label: "TIMELINE · 4.2s", dark: true, accentWidth: 84 },
  { id: "03", label: "CAMERA · 7.8s", dark: true, accentWidth: 48 },
  { id: "04", label: "FINALE · 16.5s", dark: false, accentWidth: 70 },
];

const STEREO_BARS = Array.from({ length: 48 }, (_, idx) => {
  const center = (48 - 1) / 2;
  const dist = Math.abs(idx - center) / center;
  const env = Math.pow(1 - dist * 0.78, 1.45);
  const harmonic = 0.45 + 0.55 * Math.abs(Math.sin(idx * 0.92 + 0.4) * Math.cos(idx * 0.37));
  return env * harmonic;
});

/**
 * Shot 3 (7.5s - 12.0s | f225 - f360 @ 30fps, local f0 - f135):
 *   Three brisk 1.5s (45f) kinetic proof cuts proving real LaunchSkill output craft:
 *   - Beat 3A (f0-f45, Obsidian #0B0B0D): "Real camera." — 2.5D tilted cinema viewport
 *     with coupled specular glass sheen, vermilion viewfinder L-brackets & Z-exploded HUD.
 *   - Beat 3B (f45-f90, Paper #F7F6F2): "Zero templates." — 100ms directional whip-pan
 *     into playhead-sliced editorial typography + gliding 4-frame QA contact sheet + QA PASS ✓.
 *   - Beat 3C (f90-f135, Obsidian #0B0B0D): "Ready for X." — Stereo DSP acoustic horizon
 *     swept by the centered Vermilion Playhead locking -14.0 LUFS · 1080p H.264.
 */
export const LSKineticProofScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const b1 = sec(1.5, fps); // 45f
  const b2 = sec(3.0, fps); // 90f

  // =========================================================================
  // BEAT 3A: Obsidian 2.5D Camera Viewport ("Real camera.")
  // =========================================================================
  if (frame < b1) {
    const t = frame / b1;
    const enterP = interpolate(frame, [0, sec(0.32, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    const viewportScale = interpolate(enterP, [0, 1], [0.91, 1.0]);
    const rotY = interpolate(t, [0, 1], [-18, 14]);
    const rotX = interpolate(t, [0, 1], [7, 1.5]);
    const sheenX = interpolate(t, [0, 1], [-480, 480]) - rotY * 10;
    const shadowX = -rotY * 2.2;
    const shadowY = 44 + rotX * 1.8;

    const liveZoomVal = interpolate(t, [0, 1], [1.0, 2.2]);
    const reticleProgress = interpolate(t, [0, 1], [0.18, 0.84]);

    const badgeP = spring({
      frame: Math.max(0, frame - sec(0.16, fps)),
      fps,
      config: getSpringForMass("card"),
    });

    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <LaunchSkillCyclorama dark zoom={1 + t * 0.08} panX={-rotY * 1.4} />

        {/* Flat, Razor-Sharp Editorial Headline Above Stage (Never Tilted!) */}
        <div
          style={{
            position: "absolute",
            top: 96,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <MaskedHeadline
            startFrame={0}
            fontSize={80}
            dark
            words={[
              { text: "Real" },
              { text: "camera.", italic: true, accent: LS_THEME.vermilion },
            ]}
          />
        </div>

        {/* 2.5D Perspective Cinema Viewport + Coupled Specular Sheen + Exploded Z-HUD */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            top: 136,
            perspective: 1450,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 1020,
              height: 574,
              transformStyle: "preserve-3d",
              transform: `scale(${viewportScale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              filter: `drop-shadow(${shadowX}px ${shadowY}px 56px rgba(0, 0, 0, 0.65))`,
            }}
          >
            {/* Base Cinema Viewport Glass (Z = 0) */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: 18,
                backgroundColor: "#121216",
                border: "1px solid rgba(255,255,255,0.16)",
                overflow: "hidden",
              }}
            >
              {/* Subtle architectural 16:9 composition framing inside the viewport */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, #191920 0%, #101014 60%, #0C0C10 100%)",
                }}
              />

              {/* Rule-of-thirds camera viewfinder guides */}
              <div
                style={{
                  position: "absolute",
                  left: "33.33%",
                  top: 28,
                  bottom: 28,
                  width: 1,
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "66.66%",
                  top: 28,
                  bottom: 28,
                  width: 1,
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "33.33%",
                  left: 28,
                  right: 28,
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "66.66%",
                  left: 28,
                  right: 28,
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              />

              {/* Four Crisp Vermilion Viewfinder L-Brackets */}
              {[
                { top: 28, left: 28, bt: 2, bl: 2 },
                { top: 28, right: 28, bt: 2, br: 2 },
                { bottom: 28, left: 28, bb: 2, bl: 2 },
                { bottom: 28, right: 28, bb: 2, br: 2 },
              ].map((c, idx) => (
                <span
                  key={idx}
                  style={{
                    position: "absolute",
                    width: 22,
                    height: 22,
                    top: c.top,
                    bottom: c.bottom,
                    left: c.left,
                    right: c.right,
                    borderTop: c.bt ? `2.5px solid ${LS_THEME.vermilion}` : undefined,
                    borderBottom: c.bb ? `2.5px solid ${LS_THEME.vermilion}` : undefined,
                    borderLeft: c.bl ? `2.5px solid ${LS_THEME.vermilion}` : undefined,
                    borderRight: c.br ? `2.5px solid ${LS_THEME.vermilion}` : undefined,
                  }}
                />
              ))}

              {/* Animated Focal Subject inside the Cinema Viewport */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${0.92 + t * 0.2})`,
                }}
              >
                <div
                  style={{
                    width: 500,
                    height: 240,
                    borderRadius: 16,
                    backgroundColor: "#FAF9F6",
                    border: "1px solid rgba(255,255,255,0.4)",
                    boxShadow: "0 28px 60px rgba(0,0,0,0.5)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: LS_THEME.vermilion,
                    }}
                  >
                    FOCAL LOCK · ACTIVE
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 44,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: LS_THEME.ink,
                    }}
                  >
                    1920 × 1080
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 14,
                      color: LS_THEME.inkMuted,
                    }}
                  >
                    EASE_OUT_EXPO · 0PX DRIFT
                  </span>
                </div>
              </div>

              {/* Hero Motif: Vermilion Playhead sweeping across the viewport */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${reticleProgress * 100}%`,
                  width: 2.5,
                  backgroundColor: LS_THEME.vermilion,
                  boxShadow: `0 0 16px ${LS_THEME.vermilionGlow}`,
                }}
              />

              {/* Coupled Specular Studio Glass Sheen */}
              <div
                style={{
                  position: "absolute",
                  top: "-30%",
                  bottom: "-30%",
                  width: 240,
                  left: "50%",
                  transform: `translate3d(${sheenX}px, 0, 0) rotate(22deg)`,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Exploded Front Z-Plane (+74px): Floating Camera Rig Telemetry Pill */}
            <div
              style={{
                position: "absolute",
                right: -46,
                bottom: -26,
                transform: `translateZ(74px) scale(${0.92 + badgeP * 0.08})`,
                opacity: badgeP,
                padding: "16px 26px",
                borderRadius: 14,
                backgroundColor: LS_THEME.vermilion,
                color: "#FFFFFF",
                fontFamily: FONT_MONO,
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: "0.04em",
                fontVariantNumeric: "tabular-nums",
                boxShadow: "0 24px 48px rgba(229, 72, 46, 0.42)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span>ZOOM {liveZoomVal.toFixed(2)}×</span>
              <span style={{ opacity: 0.55 }}>|</span>
              <span>30 FPS</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // =========================================================================
  // BEAT 3B: Archival Paper Whip-Pan & Contact-Sheet QA ("Zero templates.")
  // =========================================================================
  if (frame < b2) {
    const localF = frame - b1;
    const t = localF / (b2 - b1);

    // 100ms (3-frame) horizontal directional whip-pan arrival!
    const whipP = interpolate(localF, [0, sec(0.16, fps)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    const whipX = (1 - whipP) * 260;
    const whipBlurX = localF < 4 ? interpolate(localF, [0, 4], [26, 0]) : 0;

    // Hero Motif: Vermilion Playhead slices horizontally across the editorial headline (full 100% reveal!)
    const slicePct = interpolate(localF, [sec(0.05, fps), sec(0.62, fps)], [0.04, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
    const revealRightInsetPct = Math.max(0, (1 - slicePct) * 100);

    // Contact-sheet strip glides smoothly left
    const stripDriftX = interpolate(t, [0, 1], [34, -42]);

    // QA PASS stamp snaps crisply at local f16
    const qaStampP = spring({
      frame: Math.max(0, localF - sec(0.55, fps)),
      fps,
      config: getSpringForMass("micro"),
    });

    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <LaunchSkillCyclorama zoom={1 + t * 0.05} panX={stripDriftX * 0.35} />

        <DirectionalBlurLayer blurX={whipBlurX} blurY={0}>
          <AbsoluteFill
            style={{
              transform: `translate3d(${whipX}px, 0, 0)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 120px",
              boxSizing: "border-box",
            }}
          >
            {/* Playhead-Sliced Oversized Editorial Headline */}
            <div
              style={{
                position: "relative",
                marginBottom: 74,
                padding: "12px 44px 12px 28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 28,
                  paddingRight: 22,
                  clipPath:
                    revealRightInsetPct <= 0.2
                      ? "none"
                      : `inset(0 ${revealRightInsetPct}% 0 0)`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 112,
                    fontWeight: 800,
                    letterSpacing: "-0.048em",
                    lineHeight: 1.0,
                    color: LS_THEME.ink,
                  }}
                >
                  Zero
                </span>
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontStyle: "italic",
                    fontSize: 126,
                    fontWeight: 400,
                    letterSpacing: "-0.015em",
                    lineHeight: 1.0,
                    color: LS_THEME.vermilion,
                  }}
                >
                  templates.
                </span>
              </div>

              {/* Hero Motif: Vermilion Playhead slicing cleanly across the words */}
              <div
                style={{
                  position: "absolute",
                  top: -8,
                  bottom: -8,
                  left: `${slicePct * 100}%`,
                  width: 4,
                  borderRadius: 2,
                  backgroundColor: LS_THEME.vermilion,
                  boxShadow: `0 0 18px ${LS_THEME.vermilionGlow}`,
                  opacity: interpolate(localF, [sec(0.7, fps), sec(1.0, fps)], [1, 0.32], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              />
            </div>

            {/* Gliding 4-Frame Visual QA Contact-Sheet Strip (Bespoke Miniatures, Zero Skeleton Bars) */}
            <div
              style={{
                display: "flex",
                gap: 24,
                transform: `translate3d(${stripDriftX}px, 0, 0)`,
                position: "relative",
              }}
            >
              {QA_STRIP_FRAMES.map((item, idx) => {
                const isInspected = t > idx * 0.16;
                return (
                  <div
                    key={item.id}
                    style={{
                      width: 340,
                      height: 224,
                      borderRadius: 14,
                      backgroundColor: item.dark ? LS_THEME.deckSurface : "#FFFFFF",
                      border: isInspected
                        ? `1.5px solid ${item.dark ? LS_THEME.vermilion : LS_THEME.ink}`
                        : `1px solid ${LS_THEME.paperBorder}`,
                      boxShadow: LS_THEME.shadowCard,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Bespoke Miniature Shot Composition */}
                    <div
                      style={{
                        flex: 1,
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: item.dark ? "#0B0B0D" : "#F7F6F2",
                        overflow: "hidden",
                      }}
                    >
                      {item.id === "01" && (
                        <>
                          <span
                            style={{
                              fontFamily: FONT_SANS,
                              fontSize: 18,
                              fontWeight: 800,
                              letterSpacing: "-0.04em",
                              color: LS_THEME.ink,
                              marginBottom: 12,
                            }}
                          >
                            Prompt to <em style={{ fontFamily: FONT_SERIF, color: LS_THEME.vermilion }}>cinema.</em>
                          </span>
                          <div
                            style={{
                              width: 210,
                              height: 30,
                              borderRadius: 8,
                              backgroundColor: LS_THEME.deckSurface,
                              display: "flex",
                              alignItems: "center",
                              padding: "0 10px",
                              gap: 6,
                              fontFamily: FONT_MONO,
                              fontSize: 10,
                              color: "#FAF9F6",
                            }}
                          >
                            <span style={{ color: LS_THEME.vermilion }}>&gt;</span>
                            <span>/launchskill</span>
                            <span style={{ width: 2, height: 14, backgroundColor: LS_THEME.vermilion }} />
                          </div>
                        </>
                      )}

                      {item.id === "02" && (
                        <div
                          style={{
                            width: 256,
                            height: 112,
                            borderRadius: 10,
                            backgroundColor: "#141419",
                            border: "1px solid rgba(255,255,255,0.12)",
                            padding: 12,
                            boxSizing: "border-box",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            position: "relative",
                          }}
                        >
                          <div style={{ display: "flex", gap: 6 }}>
                            <span style={{ flex: 1, height: 18, borderRadius: 4, backgroundColor: "#1F1F27" }} />
                            <span style={{ flex: 1.3, height: 18, borderRadius: 4, backgroundColor: "rgba(229,72,46,0.28)", border: `1px solid ${LS_THEME.vermilion}` }} />
                            <span style={{ flex: 0.9, height: 18, borderRadius: 4, backgroundColor: "#1F1F27" }} />
                          </div>
                          <svg width="230" height="22" viewBox="0 0 230 22">
                            <path d="M0 14 Q36 2 72 14 T144 10 T230 14" fill="none" stroke="#FAF9F6" strokeWidth="2" />
                          </svg>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 22 }}>
                            {[8, 16, 12, 20, 14, 10, 18, 22, 12, 16, 10, 14, 18, 9, 12].map((h, i) => (
                              <span
                                key={i}
                                style={{
                                  width: 4,
                                  height: h,
                                  borderRadius: 2,
                                  backgroundColor: i === 6 || i === 7 ? LS_THEME.vermilion : "rgba(255,255,255,0.45)",
                                }}
                              />
                            ))}
                          </div>
                          <span style={{ position: "absolute", top: 0, bottom: 0, left: "52%", width: 2, backgroundColor: LS_THEME.vermilion }} />
                        </div>
                      )}

                      {item.id === "03" && (
                        <div
                          style={{
                            width: 224,
                            height: 118,
                            borderRadius: 10,
                            backgroundColor: "#15151B",
                            border: "1px solid rgba(255,255,255,0.16)",
                            transform: "perspective(400px) rotateY(-12deg) rotateX(4deg)",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ position: "absolute", top: 10, left: 10, width: 10, height: 10, borderTop: `2px solid ${LS_THEME.vermilion}`, borderLeft: `2px solid ${LS_THEME.vermilion}` }} />
                          <span style={{ position: "absolute", top: 10, right: 10, width: 10, height: 10, borderTop: `2px solid ${LS_THEME.vermilion}`, borderRight: `2px solid ${LS_THEME.vermilion}` }} />
                          <span style={{ position: "absolute", bottom: 10, left: 10, width: 10, height: 10, borderBottom: `2px solid ${LS_THEME.vermilion}`, borderLeft: `2px solid ${LS_THEME.vermilion}` }} />
                          <span style={{ position: "absolute", bottom: 10, right: 10, width: 10, height: 10, borderBottom: `2px solid ${LS_THEME.vermilion}`, borderRight: `2px solid ${LS_THEME.vermilion}` }} />
                          <div style={{ padding: "8px 16px", borderRadius: 6, backgroundColor: "#FAF9F6", fontFamily: FONT_SANS, fontSize: 13, fontWeight: 800, color: LS_THEME.ink }}>
                            1920 × 1080
                          </div>
                        </div>
                      )}

                      {item.id === "04" && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: LS_THEME.deckSurface, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ width: 2.5, height: 18, borderRadius: 1, backgroundColor: LS_THEME.vermilion, marginRight: 3 }} />
                              <span style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "8px solid #FAF9F6" }} />
                            </div>
                            <span style={{ fontFamily: FONT_SANS, fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: LS_THEME.ink }}>
                              Launch<span style={{ color: LS_THEME.vermilion }}>Skill</span>
                            </span>
                          </div>
                          <span style={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: 15, color: LS_THEME.inkSecondary }}>
                            Prompts to launch videos.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer Meta Row */}
                    <div
                      style={{
                        height: 44,
                        padding: "0 16px",
                        borderTop: item.dark
                          ? "1px solid rgba(255,255,255,0.09)"
                          : `1px solid ${LS_THEME.paperBorder}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontFamily: FONT_MONO,
                        fontSize: 13,
                        fontWeight: 600,
                        color: item.dark ? "#D4D4D8" : LS_THEME.inkSecondary,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <span>{item.label}</span>
                      <span style={{ color: isInspected ? LS_THEME.emerald : LS_THEME.inkMuted }}>
                        {isInspected ? "PASS ✓" : "…"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Crisp Floating QA Audit Pill */}
            <div
              style={{
                marginTop: 42,
                padding: "13px 26px",
                borderRadius: 999,
                backgroundColor: LS_THEME.deckSurface,
                color: "#FAF9F6",
                fontFamily: FONT_MONO,
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: 12,
                boxShadow: LS_THEME.shadowPill,
                transform: `scale(${0.92 + qaStampP * 0.08})`,
                opacity: qaStampP,
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 999,
                  backgroundColor: LS_THEME.emerald,
                }}
              />
              <span>13/13 QUALITY GATES VERIFIED</span>
            </div>
          </AbsoluteFill>
        </DirectionalBlurLayer>
      </AbsoluteFill>
    );
  }

  // =========================================================================
  // BEAT 3C: Obsidian Broadcast Audio & X Export ("Ready for X.")
  // =========================================================================
  const localF = frame - b2;
  const t = localF / (sec(4.5, fps) - b2);
  const enterP = interpolate(localF, [0, sec(0.26, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Playhead sweeps across the stereo acoustic horizon
  const waveHeadIdx = interpolate(t, [0, 1], [6, STEREO_BARS.length - 6]);
  const lufsVal = interpolate(enterP, [0, 1], [-18.4, -14.0]);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <LaunchSkillCyclorama dark zoom={1 + t * 0.08} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 140px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginBottom: 68 }}>
          <MaskedHeadline
            startFrame={b2}
            fontSize={88}
            dark
            words={[
              { text: "Ready" },
              { text: "for", muted: true },
              { text: "X.", italic: true, accent: LS_THEME.vermilion },
            ]}
          />
        </div>

        {/* Sculptural Stereo 48 kHz Acoustic Horizon */}
        <div
          style={{
            position: "relative",
            width: 1320,
            height: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `scale(${0.94 + enterP * 0.06})`,
          }}
        >
          {/* Center Reference Hairline */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: 1,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          />

          {STEREO_BARS.map((amp, idx) => {
            const dist = Math.abs(idx - waveHeadIdx);
            const boost = Math.exp(-dist * 0.35);
            const livePulse = 0.72 + 0.28 * Math.sin(localF * 0.28 + idx * 0.45);
            const barH = Math.round(18 + (amp * 150 * livePulse + boost * 62) * enterP);
            const isLit = dist < 4.5;

            return (
              <div
                key={idx}
                style={{
                  width: 13,
                  height: barH,
                  borderRadius: 6,
                  backgroundColor: isLit
                    ? LS_THEME.vermilion
                    : idx < waveHeadIdx
                      ? "rgba(250, 249, 246, 0.85)"
                      : "rgba(255, 255, 255, 0.20)",
                  boxShadow: isLit ? `0 0 22px ${LS_THEME.vermilionGlow}` : undefined,
                }}
              />
            );
          })}

          {/* Hero Motif: Vermilion Playhead gliding across acoustic horizon */}
          <div
            style={{
              position: "absolute",
              top: -18,
              bottom: -18,
              left: `${(waveHeadIdx / (STEREO_BARS.length - 1)) * 100}%`,
              width: 3.5,
              borderRadius: 2,
              backgroundColor: LS_THEME.vermilion,
              boxShadow: `0 0 24px ${LS_THEME.vermilionGlow}`,
            }}
          />
        </div>

        {/* Crisp Broadcast Mastering Readout */}
        <div
          style={{
            marginTop: 64,
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontFamily: FONT_MONO,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.04em",
            fontVariantNumeric: "tabular-nums",
            color: "#FAF9F6",
            opacity: enterP,
          }}
        >
          <span
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              backgroundColor: "rgba(229, 72, 46, 0.16)",
              border: `1px solid ${LS_THEME.vermilion}`,
              color: "#FFFFFF",
            }}
          >
            {lufsVal.toFixed(1)} LUFS
          </span>
          <span style={{ color: "#71717A" }}>·</span>
          <span>1080p H.264</span>
          <span style={{ color: "#71717A" }}>·</span>
          <span style={{ color: "#A1A1AA" }}>48 kHz FOLEY</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
