import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  DirectionalMotionBlur,
  LiveEqualizerBars,
  SPOTIFY_FONT_MONO,
  SPOTIFY_FONT_SANS,
  SPOTIFY_THEME,
  SpotifyPlayDisc,
  SpotifyStudioBackdrop,
} from "../../components/SpotifyMusicPrimitives";
import { EASE_IN_EXPO, EASE_IN_OUT_QUINT, EASE_OUT_EXPO, SPRING_SNAPPY, sec } from "../../lib/studioMotion";

const DEVICE_META = [
  { id: "phone", label: "iPhone 16 Pro", tag: "POCKET" },
  { id: "headphones", label: "Studio Over-Ear", tag: "LOSSLESS" },
  { id: "speaker", label: "Living Room", tag: "HI-FI SPEAKER" },
] as const;

// 1. Minimalist Industrial-Design iPhone 16 Pro Silhouette (centered around 122px Play Disc)
const PhoneChassisSilhouette: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: 224,
      height: 412,
      borderRadius: 46,
      background: "linear-gradient(155deg, #2B2B31 0%, #151518 48%, #222227 100%)",
      border: "2px solid rgba(255,255,255,0.22)",
      boxShadow:
        "0 36px 80px rgba(0,0,0,0.72), inset 0 1.5px 1px rgba(255,255,255,0.26)",
      padding: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {/* Inner OLED glass plane */}
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 36,
        background: "linear-gradient(180deg, #131B16 0%, #0D0D10 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          width: 72,
          height: 20,
          borderRadius: 999,
          backgroundColor: "#000000",
        }}
      />
      {/* Subtle home indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 78,
          height: 4,
          borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.22)",
        }}
      />
    </div>
  </div>
);

// 2. Minimalist Industrial-Design Studio Over-Ear Headphones Silhouette
const HeadphonesChassisSilhouette: React.FC = () => (
  <svg
    width="400"
    height="380"
    viewBox="0 0 400 380"
    fill="none"
    style={{ filter: "drop-shadow(0 36px 72px rgba(0,0,0,0.72))" }}
  >
    <defs>
      <linearGradient id="hp-metal" x1="0" y1="0" x2="400" y2="380" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#35353C" />
        <stop offset="50%" stopColor="#17171B" />
        <stop offset="100%" stopColor="#2A2A30" />
      </linearGradient>
      <linearGradient id="hp-cup" x1="0" y1="160" x2="0" y2="340" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#26262C" />
        <stop offset="100%" stopColor="#121215" />
      </linearGradient>
    </defs>

    {/* Sculpted outer headband arch */}
    <path
      d="M72 224V184C72 108 128 50 200 50C272 50 328 108 328 184V224"
      stroke="url(#hp-metal)"
      strokeWidth="26"
      strokeLinecap="round"
    />
    {/* Crisp top specular rim on headband */}
    <path
      d="M72 216V184C72 108 128 50 200 50C272 50 328 108 328 184V216"
      stroke="rgba(255,255,255,0.22)"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Left Earcup Assembly */}
    <rect
      x="34"
      y="186"
      width="68"
      height="136"
      rx="34"
      fill="url(#hp-cup)"
      stroke="rgba(255,255,255,0.22)"
      strokeWidth="2"
    />
    <rect x="86" y="200" width="22" height="108" rx="11" fill="#1D1D22" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    {/* Subtle green status LED on left cup */}
    <circle cx="68" cy="296" r="4" fill={SPOTIFY_THEME.greenBright} />

    {/* Right Earcup Assembly */}
    <rect
      x="298"
      y="186"
      width="68"
      height="136"
      rx="34"
      fill="url(#hp-cup)"
      stroke="rgba(255,255,255,0.22)"
      strokeWidth="2"
    />
    <rect x="292" y="200" width="22" height="108" rx="11" fill="#1D1D22" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

    {/* Subtle acoustic coupling ring centered behind Play Disc */}
    <circle
      cx="200"
      cy="214"
      r="82"
      stroke="rgba(29, 185, 84, 0.28)"
      strokeWidth="1.5"
      strokeDasharray="6 6"
    />
  </svg>
);

// 3. Minimalist Industrial-Design Hi-Fi Speaker Cabinet (Woofer matches exact 122px Play Disc)
const SpeakerChassisSilhouette: React.FC<{ pulse: number }> = ({ pulse }) => (
  <div
    style={{
      position: "relative",
      width: 284,
      height: 404,
      borderRadius: 36,
      background: "linear-gradient(155deg, #29292F 0%, #141418 52%, #1F1F24 100%)",
      border: "2px solid rgba(255,255,255,0.22)",
      boxShadow:
        "0 36px 80px rgba(0,0,0,0.75), inset 0 1.5px 1px rgba(255,255,255,0.24)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    {/* Precision Top Tweeter Dome */}
    <div
      style={{
        marginTop: 42,
        width: 58,
        height: 58,
        borderRadius: "50%",
        background: "radial-gradient(circle at 38% 35%, #2C2C33 0%, #0D0D10 72%)",
        border: "1.5px solid rgba(255,255,255,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          backgroundColor: "#222227",
          border: "1px solid rgba(255,255,255,0.28)",
        }}
      />
    </div>

    {/* Acoustic Woofer Surround Ring — centered at exact 50% of cabinet height to match 122px Play Disc */}
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 162,
        height: 162,
        marginLeft: -81,
        marginTop: -81,
        borderRadius: "50%",
        background: "radial-gradient(circle at 50% 50%, #0A0A0C 58%, #202026 84%, #121215 100%)",
        border: "2px solid rgba(255,255,255,0.16)",
        boxShadow: "inset 0 0 18px rgba(0,0,0,0.85)",
        transform: `scale(${1 + pulse * 0.035})`,
      }}
    />

    {/* Subtle bottom bass reflex port slot */}
    <div
      style={{
        position: "absolute",
        bottom: 30,
        width: 84,
        height: 8,
        borderRadius: 999,
        backgroundColor: "#08080A",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    />
  </div>
);

export const SMConnectHandoffScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Horizontal whip-pan arrival from Discovery (f0..f10, drops cleanly to 0px blur at rest!)
  const enterP = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const enterX = (1 - enterP) * 1150;
  const enterBlurX = enterP < 0.92 ? Math.round((1 - enterP) * 32) : 0;

  // Exact 90° edge-on whip-swap boundaries (90 frames total = 3.0s):
  // Swap 1 (Phone -> Headphones): f22..f28 (0° -> 90°), swap @ f28, f28..f35 (-90° -> 0°)
  // Swap 2 (Headphones -> Speaker): f50..f56 (0° -> 90°), swap @ f56, f56..f63 (-90° -> 0°)
  const swap1Frame = 28;
  const swap2Frame = 56;
  const activeIdx = frame < swap1Frame ? 0 : frame < swap2Frame ? 1 : 2;

  let chassisRotateY = 0;
  if (frame < 22) {
    // Gentle living 2.5D orbit on Phone
    chassisRotateY = interpolate(frame, [0, 22], [-10, 6], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < swap1Frame) {
    // Whip out to exact 90° edge-on
    chassisRotateY = interpolate(frame, [22, swap1Frame], [6, 90], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    });
  } else if (frame < 35) {
    // Whip in from -90° edge-on
    chassisRotateY = interpolate(frame, [swap1Frame, 35], [-90, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
  } else if (frame < 50) {
    // Living 2.5D orbit on Headphones
    chassisRotateY = interpolate(frame, [35, 50], [0, 7], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < swap2Frame) {
    // Whip out to exact 90° edge-on
    chassisRotateY = interpolate(frame, [50, swap2Frame], [7, 90], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_EXPO,
    });
  } else if (frame < 63) {
    // Whip in from -90° edge-on
    chassisRotateY = interpolate(frame, [swap2Frame, 63], [-90, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    });
  } else {
    // Subtle living settle on Hi-Fi Speaker
    chassisRotateY = interpolate(frame, [63, 78], [0, -5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // Finale convergence (f76..f90): Speaker cabinet recedes while 122px Play Disc/Driver Cone
  // glides to exact Finale SpotifyLogoMark center Y (454px) for a pixel-locked match-cut!
  const convergeP = interpolate(frame, [76, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });

  // Stationary hardware stage center is (960, 610); glides cleanly to (960, 454) for Finale
  const coreY = interpolate(convergeP, [0, 1], [610, 454]);
  const wooferPulse = Math.abs(Math.sin((frame / fps) * Math.PI * 2));

  // Uninterrupted live timecode
  const liveSec = Math.floor(110 + frame / fps);
  const mm = String(Math.floor(liveSec / 60)).padStart(2, "0");
  const ss = String(liveSec % 60).padStart(2, "0");

  const headP = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: SPRING_SNAPPY,
  });

  const activeDevice = DEVICE_META[activeIdx];
  const labelFrame = activeIdx === 0 ? 0 : activeIdx === 1 ? swap1Frame : swap2Frame;
  const labelP = spring({
    frame: Math.max(0, frame - labelFrame),
    fps,
    config: SPRING_SNAPPY,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: SPOTIFY_THEME.obsidianBg, overflow: "hidden" }}>
      <SpotifyStudioBackdrop
        polarity="dark"
        parallaxX={-chassisRotateY * 0.6 + enterX * 0.1}
        parallaxY={0}
      />

      <DirectionalMotionBlur id="sm-connect-whip" blurX={enterBlurX} blurY={0}>
        <AbsoluteFill style={{ transform: `translate3d(${enterX}px, 0, 0)` }}>
          {/* Top Editorial Headline + Uninterrupted Live Timecode Pill */}
          <div
            style={{
              position: "absolute",
              top: 86,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: 1 - convergeP,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 22px",
                borderRadius: 999,
                backgroundColor: SPOTIFY_THEME.obsidianSurface,
                border: `1px solid ${SPOTIFY_THEME.obsidianBorderStrong}`,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  backgroundColor: SPOTIFY_THEME.greenBright,
                }}
              />
              <span
                style={{
                  fontFamily: SPOTIFY_FONT_MONO,
                  fontSize: 15,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "0.06em",
                  color: "#FFFFFF",
                }}
              >
                {`SPOTIFY CONNECT · ${mm}:${ss} LIVE`}
              </span>
            </div>

            <div style={{ overflow: "hidden", paddingBottom: 8 }}>
              <div
                style={{
                  fontFamily: SPOTIFY_FONT_SANS,
                  fontSize: 84,
                  fontWeight: 800,
                  letterSpacing: "-0.045em",
                  lineHeight: 1.04,
                  color: SPOTIFY_THEME.inkDark,
                  transform: `translate3d(0, ${(1 - headP) * 105}%, 0)`,
                }}
              >
                Every device.{" "}
                <span style={{ color: SPOTIFY_THEME.green }}>Zero pause.</span>
              </div>
            </div>
          </div>

          {/* Center-Locked 2.5D Hardware Whip-Swap Stage */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 610 - 220,
              height: 440,
              perspective: 1400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 1 - convergeP,
              transform: `scale(${1 - convergeP * 0.08})`,
            }}
          >
            <div
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${chassisRotateY}deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activeIdx === 0 && <PhoneChassisSilhouette />}
              {activeIdx === 1 && <HeadphonesChassisSilhouette />}
              {activeIdx === 2 && <SpeakerChassisSilhouette pulse={wooferPulse} />}
            </div>
          </div>

          {/* Stationary Hero #1DB954 Play Disc / Speaker Driver Cone (Exact 122px diameter) */}
          <div
            style={{
              position: "absolute",
              left: 960 - 61,
              top: coreY - 61,
              zIndex: 20,
            }}
          >
            <SpotifyPlayDisc
              size={122}
              isPlaying={true}
              pressScale={1 + (activeIdx === 2 ? wooferPulse * 0.025 : 0)}
            />
          </div>

          {/* Bottom Active Device Status Indicator (Flips crisply on each 90° swap) */}
          <div
            style={{
              position: "absolute",
              bottom: 78,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              opacity: 1 - convergeP,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 26px",
                borderRadius: 999,
                backgroundColor: SPOTIFY_THEME.obsidianSurface,
                border: `1px solid rgba(29, 185, 84, 0.35)`,
                transform: `translate3d(0, ${(1 - labelP) * 14}px, 0)`,
              }}
            >
              <LiveEqualizerBars
                count={4}
                width={22}
                height={16}
                active={true}
                color={SPOTIFY_THEME.greenBright}
              />
              <span
                style={{
                  fontFamily: SPOTIFY_FONT_SANS,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                }}
              >
                {activeDevice.label}
              </span>
              <span
                style={{
                  fontFamily: SPOTIFY_FONT_MONO,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: SPOTIFY_THEME.greenBright,
                }}
              >
                {activeDevice.tag}
              </span>
            </div>

            {/* 3 Minimalist Device Step Dots */}
            <div style={{ display: "flex", gap: 10 }}>
              {DEVICE_META.map((d, idx) => (
                <div
                  key={d.id}
                  style={{
                    width: idx === activeIdx ? 28 : 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor:
                      idx === activeIdx ? SPOTIFY_THEME.greenBright : "rgba(255,255,255,0.22)",
                  }}
                />
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </DirectionalMotionBlur>
    </AbsoluteFill>
  );
};
