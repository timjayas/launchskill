/**
 * Template 3: Studio 3D Product Reveal (16s, 1920x1080, FPS-agnostic)
 * Art Direction Preset: `hardware-studio` · Motion Temperament: `editorial-fluid`
 * Engine: Single Persistent <ThreeCanvas> + Offline Procedural PMREM Studio Softbox IBL
 */
import React, { useEffect, useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { z } from "zod";
import { FilmGrainOverlay } from "../templates/StudioPrimitives";
import {
  computeSecondarySettle,
  durSec,
  EASE_IN_OUT_QUINT,
  EASE_OUT_EXPO,
  ensureStudioFonts,
  FONT_MONO,
  FONT_SANS,
  sec,
  SPRING_EDITORIAL,
} from "../templates/motion";

export const simpleProductRevealSchema = z.object({
  productName: z.string(),
  launchTag: z.string(),
  hookLines: z.tuple([z.string(), z.string()]),
  macroTitle: z.string(),
  macroDetail: z.string(),
  valueProp: z.string(),
  specsLine: z.string(),
  ctaUrl: z.string(),
  theme: z.object({
    lightBg: z.string(),
    darkBg: z.string(),
    lightTextPrimary: z.string(),
    lightTextMuted: z.string(),
    darkTextPrimary: z.string(),
    darkTextMuted: z.string(),
    bodyColor: z.string(),
    metalColor: z.string(),
    accent: z.string(),
  }),
});

export type SimpleProductRevealProps = z.infer<typeof simpleProductRevealSchema>;

export const defaultSimpleProductRevealProps: SimpleProductRevealProps = {
  productName: "Velo One",
  launchTag: "Series 01 · Available Now",
  hookLines: ["Precision hardware,", "crafted in titanium."],
  macroTitle: "CNC chamfered core",
  macroDetail: "Grade-5 brushed titanium chassis with flush sapphire indicator.",
  valueProp: "Minimalist spatial dial engineered for tactile studio control.",
  specsLine: "62 mm · 140 g · Grade-5 Titanium",
  ctaUrl: "velo.design",
  theme: {
    lightBg: "#F4F4F2",
    darkBg: "#0A0B0E",
    lightTextPrimary: "#0A0A0A",
    lightTextMuted: "#6B7280",
    darkTextPrimary: "#FAFAFA",
    darkTextMuted: "#9CA3AF",
    bodyColor: "#1B2230",
    metalColor: "#C8CDD6",
    accent: "#2563EB",
  },
};

const OfflineStudioEnvironment: React.FC<{ intensity: number }> = ({ intensity }) => {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    const rt = pmrem.fromScene(envScene, 0.04);
    scene.environment = rt.texture;
    if ("environmentIntensity" in scene) {
      (scene as THREE.Scene & { environmentIntensity: number }).environmentIntensity = intensity;
    }
    return () => {
      scene.environment = null;
      rt.dispose();
      envScene.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, intensity]);

  return null;
};

const StudioHardwareScene: React.FC<{
  frame: number;
  fps: number;
  theme: SimpleProductRevealProps["theme"];
  darkProgress: number;
  glideToLeft: number;
  macroFactor: number;
}> = ({ frame, fps, theme, darkProgress, glideToLeft, macroFactor }) => {
  const t = frame / fps;

  const chassisGeometry = useMemo(() => {
    const s = new THREE.Shape();
    const w = 1.9;
    const h = 1.9;
    const r = 0.36;
    const x = -w / 2;
    const y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.36,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.075,
      bevelThickness: 0.075,
    });
    g.center();
    return g;
  }, []);

  const shadowTexture = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = ((x + 0.5) / size) * 2 - 1;
        const ny = ((y + 0.5) / size) * 2 - 1;
        const r2 = nx * nx + ny * ny;
        const alpha = r2 >= 1 ? 0 : Math.exp(-r2 * 5.2) * Math.pow(1 - r2, 1.5);
        const idx = (y * size + x) * 4;
        data[idx] = 12;
        data[idx + 1] = 14;
        data[idx + 2] = 18;
        data[idx + 3] = Math.round(alpha * 255);
      }
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    return tex;
  }, []);

  const settle = interpolate(frame, [0, sec(0.73, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const posX = interpolate(glideToLeft, [0, 1], [1.62, -1.48]) + macroFactor * 0.25;
  const posY = -0.04 - macroFactor * 0.22 + Math.sin(t * 0.9) * 0.025 * (1 - macroFactor);
  const scale = interpolate(settle, [0, 1], [0.95, 1.0]) + macroFactor * 0.72;

  const rotY =
    interpolate(settle, [0, 1], [-0.45, -0.26]) +
    glideToLeft * 0.52 +
    macroFactor * 0.28 +
    darkProgress * 0.18;
  const rotX = 0.08 + macroFactor * 0.16;

  return (
    <>
      <OfflineStudioEnvironment intensity={interpolate(darkProgress, [0, 1], [0.95, 0.52])} />
      <directionalLight position={[4.5, 6, 5]} intensity={interpolate(darkProgress, [0, 1], [1.25, 0.9])} color="#ffffff" />
      <pointLight position={[-3.2, 1.6, 2.8]} intensity={interpolate(darkProgress, [0, 1], [3, 22])} color={theme.accent} />

      <group position={[posX, posY, 0]} rotation={[rotX, rotY, 0]} scale={scale}>
        <mesh geometry={chassisGeometry}>
          <meshPhysicalMaterial color={theme.bodyColor} metalness={0.58} roughness={0.32} clearcoat={0.28} clearcoatRoughness={0.26} />
        </mesh>

        <mesh position={[0, 0, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.66, 0.68, 0.14, 96]} />
          <meshPhysicalMaterial color={theme.metalColor} metalness={0.88} roughness={0.22} clearcoat={0.18} />
        </mesh>

        <mesh position={[0, 0, 0.345]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.56, 0.56, 0.02, 72]} />
          <meshStandardMaterial color={theme.bodyColor} metalness={0.35} roughness={0.44} />
        </mesh>

        <mesh position={[0, 0.42, 0.365]}>
          <capsuleGeometry args={[0.024, 0.1, 8, 16]} />
          <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={0.45 + darkProgress * 0.75} metalness={0.2} roughness={0.2} />
        </mesh>

        {darkProgress < 0.95 && macroFactor < 0.85 && (
          <mesh position={[0, -1.25, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.8, 2.8]} />
            <meshBasicMaterial
              map={shadowTexture}
              transparent
              opacity={0.36 * (1 - darkProgress) * (1 - macroFactor)}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        )}
      </group>
    </>
  );
};

export const SimpleProductRevealTemplate: React.FC<SimpleProductRevealProps> = (props) => {
  ensureStudioFonts();
  const { productName, launchTag, hookLines, macroTitle, macroDetail, valueProp, specsLine, ctaUrl, theme } = props;
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // 100% FPS-agnostic timeline (16s total)
  const fReveal = sec(2.6, fps);
  const fMacroIn = sec(5.0, fps);
  const fMacroOut = sec(8.4, fps);
  const fDark = sec(9.6, fps);
  const fCta = sec(12.6, fps);

  const glideToLeft = interpolate(frame, [fReveal - sec(0.27, fps), fReveal + sec(0.67, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const mIn = interpolate(frame, [fMacroIn, fMacroIn + sec(0.67, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const mOut = interpolate(frame, [fMacroOut, fMacroOut + sec(0.67, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const macroFactor = Math.max(0, mIn - mOut);

  const darkIn = interpolate(frame, [fDark - sec(0.2, fps), fDark + sec(0.4, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const darkOut = interpolate(frame, [fCta - sec(0.2, fps), fCta + sec(0.4, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const darkProgress = Math.max(0, darkIn - darkOut);
  const bgColor = interpolateColors(darkProgress, [0, 1], [theme.lightBg, theme.darkBg]);

  const h1 = interpolate(frame, [0, sec(0.47, fps)], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const h2 = interpolate(frame, [sec(0.17, fps), sec(0.63, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const leaderP = interpolate(frame, [fMacroIn + sec(0.47, fps), fMacroIn + sec(0.93, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });
  const ctaStart = fCta + sec(0.13, fps);
  const ctaPop = spring({
    frame: Math.max(0, frame - ctaStart),
    fps,
    config: SPRING_EDITORIAL,
    durationInFrames: durSec(0.6, fps),
  });
  const ctaFollow = computeSecondarySettle(frame, ctaStart, fps, 0.09, 10);

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, fontFamily: FONT_SANS, overflow: "hidden" }}>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 0, 5.8], fov: 34 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
        >
          <StudioHardwareScene
            frame={frame}
            fps={fps}
            theme={theme}
            darkProgress={darkProgress}
            glideToLeft={glideToLeft}
            macroFactor={macroFactor}
          />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* SHOT 1: HOOK */}
      {frame < fReveal && (
        <AbsoluteFill style={{ padding: "90px 120px", justifyContent: "center" }}>
          <div style={{ maxWidth: 960, display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ alignSelf: "flex-start", padding: "10px 20px", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.75)", border: "1px solid rgba(10,10,10,0.09)", fontSize: 24, fontWeight: 500, color: theme.lightTextPrimary }}>
              {launchTag}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 98, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, color: theme.lightTextMuted, opacity: h1, transform: `translateY(${(1 - h1) * 52}px)` }}>
                {hookLines[0]}
              </div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 98, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, color: theme.lightTextPrimary, opacity: h2, transform: `translateY(${(1 - h2) * 58}px)` }}>
                {hookLines[1]}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SHOT 2A: HERO INTRO */}
      {frame >= fReveal && frame < fMacroIn + sec(0.2, fps) && (
        <AbsoluteFill style={{ padding: "90px 120px", justifyContent: "center" }}>
          <div style={{ position: "absolute", left: 880, right: 120, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 24, fontWeight: 600, color: theme.accent, letterSpacing: "0.08em" }}>
              INTRODUCING
            </div>
            <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: "-0.04em", color: theme.lightTextPrimary }}>
              {productName}
            </div>
            <div style={{ fontSize: 36, color: theme.lightTextMuted, lineHeight: 1.38 }}>{valueProp}</div>
          </div>
        </AbsoluteFill>
      )}

      {/* SHOT 2B: MACRO DETAIL + 1px ARCHITECTURAL LEADER LINE */}
      {macroFactor > 0.45 && (
        <AbsoluteFill style={{ opacity: interpolate(macroFactor, [0.45, 0.95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <circle cx={740} cy={470} r={6} fill={theme.accent} opacity={leaderP} />
            <line x1={752} y1={470} x2={752 + 168 * leaderP} y2={470} stroke="rgba(10,10,10,0.4)" strokeWidth={1.5} />
          </svg>
          <div style={{ position: "absolute", left: 920, top: 375, width: 780, padding: "34px 40px", borderRadius: 22, backgroundColor: "rgba(255,255,255,0.86)", backdropFilter: "blur(20px)", border: "1px solid rgba(10,10,10,0.09)", boxShadow: "0 24px 64px rgba(10,10,10,0.08)" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: 600, color: theme.accent, letterSpacing: "0.08em" }}>MACRO DETAIL</div>
            <div style={{ fontSize: 44, fontWeight: 700, color: theme.lightTextPrimary, marginTop: 10, letterSpacing: "-0.03em" }}>{macroTitle}</div>
            <div style={{ fontSize: 30, color: theme.lightTextMuted, marginTop: 10, lineHeight: 1.35 }}>{macroDetail}</div>
          </div>
        </AbsoluteFill>
      )}

      {/* SHOT 3: DELIBERATE DARK CHAPTER */}
      {frame >= fDark && frame < fCta && (
        <AbsoluteFill style={{ padding: "90px 120px", justifyContent: "center" }}>
          <div style={{ position: "absolute", left: 880, right: 120, display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: 600, color: theme.accent, letterSpacing: "0.08em" }}>
              ARCHITECTURE
            </div>
            <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.1, color: theme.darkTextPrimary }}>
              {valueProp}
            </div>
            <div style={{ marginTop: 14, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.14)", fontFamily: FONT_MONO, fontSize: 26, fontVariantNumeric: "tabular-nums", color: theme.darkTextMuted }}>
              {specsLine}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SHOT 4: STUDIO CTA LOCKUP */}
      {frame >= fCta && (
        <AbsoluteFill style={{ padding: "90px 120px", justifyContent: "center" }}>
          <div style={{ position: "absolute", left: 880, right: 120, display: "flex", flexDirection: "column", gap: 26, opacity: ctaPop, transform: `translateY(${(1 - ctaPop) * 18}px)` }}>
            <div style={{ fontSize: 82, fontWeight: 700, letterSpacing: "-0.04em", color: theme.lightTextPrimary }}>{productName}</div>
            <div style={{ fontSize: 36, color: theme.lightTextMuted, lineHeight: 1.36 }}>{valueProp}</div>
            <div style={{ display: "flex", gap: 14, marginTop: 8, opacity: ctaFollow.opacity, transform: `translateY(${ctaFollow.translateY}px)` }}>
              <div style={{ padding: "18px 34px", borderRadius: 999, backgroundColor: theme.lightTextPrimary, color: "#FFFFFF", fontSize: 26, fontWeight: 600 }}>
                Pre-order
              </div>
              <div style={{ padding: "18px 32px", borderRadius: 999, backgroundColor: "#FFFFFF", border: "1px solid rgba(10,10,10,0.12)", color: theme.lightTextPrimary, fontFamily: FONT_MONO, fontSize: 26 }}>
                {ctaUrl}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      <FilmGrainOverlay frame={frame} fps={fps} opacity={0.024} />
    </AbsoluteFill>
  );
};
