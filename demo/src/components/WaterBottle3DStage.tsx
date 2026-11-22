import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import "@react-three/fiber";
import * as THREE from "three";
import { EASE_IN_OUT_QUINT, EASE_OUT_EXPO } from "../lib/motion";
import type { WaterBottleTheme } from "../lib/schema";

interface StageTimings {
  hookEnd: number;
  revealStart: number;
  revealDuration: number;
  featuresStart: number;
  featuresDuration: number;
  ctaStart: number;
}

interface BottleSceneProps {
  frame: number;
  fps: number;
  theme: WaterBottleTheme;
  timings: StageTimings;
  darkProgress: number;
}

/**
 * Deterministic 3D studio water bottle sculpted with LatheGeometry + machined cap,
 * magnetic lift reveal, floating glass water droplets, and studio 3-point lighting.
 * Zero useFrame / Math.random / Date.now — 100% driven by Remotion's `frame` & `fps`.
 */
const BottleStudioScene: React.FC<BottleSceneProps> = ({
  frame,
  fps,
  theme,
  timings,
  darkProgress,
}) => {
  const t = frame / fps;

  // 1. Sculpted LatheGeometry for the main insulated body (y: -1.24 -> +0.86)
  const bottleBodyGeometry = useMemo(() => {
    const pts: THREE.Vector2[] = [
      new THREE.Vector2(0.0, -1.24),
      new THREE.Vector2(0.35, -1.24),
      new THREE.Vector2(0.395, -1.21),
      new THREE.Vector2(0.42, -1.14),
      new THREE.Vector2(0.425, -0.95),
      new THREE.Vector2(0.425, 0.36),
      new THREE.Vector2(0.418, 0.5),
      new THREE.Vector2(0.392, 0.62),
      new THREE.Vector2(0.345, 0.72),
      new THREE.Vector2(0.285, 0.8),
      new THREE.Vector2(0.265, 0.86),
    ];
    const geom = new THREE.LatheGeometry(pts, 72);
    geom.computeVertexNormals();
    return geom;
  }, []);

  // 2. Sculpted silicone base bumper (y: -1.31 -> -1.22)
  const basePadGeometry = useMemo(() => {
    const pts: THREE.Vector2[] = [
      new THREE.Vector2(0.0, -1.31),
      new THREE.Vector2(0.33, -1.31),
      new THREE.Vector2(0.375, -1.29),
      new THREE.Vector2(0.39, -1.24),
      new THREE.Vector2(0.36, -1.22),
    ];
    const geom = new THREE.LatheGeometry(pts, 64);
    geom.computeVertexNormals();
    return geom;
  }, []);

  // 3. Machined magnetic cap profile (y: 0.0 -> 0.30 in cap-local space)
  const capGeometry = useMemo(() => {
    const pts: THREE.Vector2[] = [
      new THREE.Vector2(0.255, 0.0),
      new THREE.Vector2(0.295, 0.0),
      new THREE.Vector2(0.305, 0.025),
      new THREE.Vector2(0.305, 0.255),
      new THREE.Vector2(0.288, 0.288),
      new THREE.Vector2(0.245, 0.302),
      new THREE.Vector2(0.0, 0.304),
    ];
    const geom = new THREE.LatheGeometry(pts, 72);
    geom.computeVertexNormals();
    return geom;
  }, []);

  // 4. Procedural velvety radial contact-shadow DataTexture (zero DOM canvas needed, 100% deterministic)
  const softShadowTexture = useMemo(() => {
    const size = 64;
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = (x + 0.5) / size - 0.5;
        const dy = (y + 0.5) / size - 0.5;
        const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2);
        // Smooth Gaussian-like studio softbox falloff
        const alpha = Math.pow(Math.max(0, 1 - dist), 2.4);
        const idx = (y * size + x) * 4;
        data[idx] = 10;
        data[idx + 1] = 12;
        data[idx + 2] = 16;
        data[idx + 3] = Math.round(alpha * 255);
      }
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // --- Deterministic Camera / Rig Keyframes ---
  const { hookEnd, revealStart, revealDuration, featuresStart, featuresDuration, ctaStart } =
    timings;

  // Sub-beats inside Beat 2 (Reveal): 2A Full Hero -> 2B Macro Cap Zoom -> 2C Pull Back
  const macroInStart = revealStart + Math.round(revealDuration * 0.34);
  const macroInEnd = revealStart + Math.round(revealDuration * 0.46);
  const macroOutStart = revealStart + Math.round(revealDuration * 0.72);
  const macroOutEnd = revealStart + Math.round(revealDuration * 0.85);

  // Beat 1 -> Beat 2 horizontal glide (right-third hero -> left-third showcase)
  const glideToReveal = interpolate(
    frame,
    [hookEnd - Math.round(fps * 0.45), revealStart + Math.round(fps * 0.7)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    }
  );

  // Macro zoom-in & pull-out envelope (0 -> 1 -> 0)
  const macroIn = interpolate(frame, [macroInStart, macroInEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const macroOut = interpolate(frame, [macroOutStart, macroOutEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_QUINT,
  });
  const macroFactor = Math.max(0, macroIn - macroOut);

  // Magnetic cap subtle lift demonstration during peak macro hold (0 -> 1 -> 0)
  const capLiftUp = interpolate(
    frame,
    [macroInEnd + Math.round(fps * 0.15), macroInEnd + Math.round(fps * 0.75)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT_EXPO,
    }
  );
  const capLiftDown = interpolate(
    frame,
    [macroOutStart - Math.round(fps * 0.45), macroOutStart + Math.round(fps * 0.05)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    }
  );
  const capLift = Math.max(0, capLiftUp - capLiftDown) * 0.17;

  // Beat 3 -> Beat 4 subtle framing shift for CTA end card
  const glideToCta = interpolate(
    frame,
    [ctaStart - Math.round(fps * 0.3), ctaStart + Math.round(fps * 0.7)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_IN_OUT_QUINT,
    }
  );

  // Frame-0 confident initial entrance settle (already visible at frame 0, subtle 8% poise settle)
  const initialSettle = interpolate(frame, [0, Math.round(fps * 0.85)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT_EXPO,
  });

  // Base horizontal position across the 4 beats
  const baseX =
    interpolate(glideToReveal, [0, 1], [1.72, -1.56]) -
    darkProgress * 0.14 -
    glideToCta * 0.18;
  const posX = baseX + macroFactor * 0.36;

  // Base vertical position (macro shifts bottle downward so cap sits center-frame)
  const gentleFloat = Math.sin(t * 1.15) * 0.045 * (1 - macroFactor * 0.65);
  const posY =
    interpolate(initialSettle, [0, 1], [-0.14, -0.04]) - macroFactor * 1.98 + gentleFloat;

  // Scale across beats + macro push
  const baseScale =
    interpolate(initialSettle, [0, 1], [0.98, 1.06]) +
    glideToReveal * 0.06 -
    glideToCta * 0.07;
  const scale = baseScale + macroFactor * 0.98;

  // Controlled studio angles (gentle, deliberate, never dizzying)
  const featurePhase = interpolate(
    frame,
    [featuresStart, featuresStart + featuresDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const rotY =
    interpolate(initialSettle, [0, 1], [-0.42, -0.22]) +
    glideToReveal * 0.46 +
    macroFactor * 0.35 +
    Math.sin(featurePhase * Math.PI * 1.5) * 0.22 * darkProgress +
    Math.sin(t * 0.55) * 0.06;

  const rotX = 0.05 + macroFactor * 0.13 + Math.cos(t * 0.48) * 0.025;
  const rotZ =
    interpolate(glideToReveal, [0, 1], [-0.045, 0.025]) * (1 - macroFactor * 0.8) -
    glideToCta * 0.025;

  // Studio lighting shifts cleanly between gallery light and dark obsidian chapter
  const ambientIntensity = interpolate(darkProgress, [0, 1], [0.92, 0.36]);
  const hemiIntensity = interpolate(darkProgress, [0, 1], [0.78, 0.28]);
  const keyIntensity = interpolate(darkProgress, [0, 1], [2.15, 1.75]);
  const fillIntensity = interpolate(darkProgress, [0, 1], [0.95, 0.38]);
  const rimSweepY = 0.4 + Math.sin(t * 0.85) * 1.15;

  // Deterministic floating translucent glass water droplets tightly framing the bottle
  const droplets = useMemo(
    () => [
      { x: -0.68, y: 0.56, z: 0.32, r: 0.05, speed: 0.9, phase: 0.4 },
      { x: 0.58, y: 0.84, z: -0.22, r: 0.038, speed: 1.1, phase: 1.7 },
      { x: 0.56, y: -0.26, z: 0.38, r: 0.048, speed: 0.8, phase: 2.9 },
      { x: -0.64, y: -0.66, z: 0.28, r: 0.044, speed: 1.05, phase: 4.1 },
      { x: 0.48, y: -0.88, z: -0.28, r: 0.034, speed: 1.2, phase: 5.2 },
    ],
    []
  );

  // Subtle floor shadow opacity (visible on light studio cyclorama, fades on dark chapter)
  const shadowOpacity = interpolate(darkProgress, [0, 1], [0.34, 0.0]) * (1 - macroFactor);

  return (
    <>
      {/* Studio 3-point + soft cyclorama wrap lighting */}
      <ambientLight intensity={ambientIntensity} color="#ffffff" />
      <hemisphereLight args={["#ffffff", "#cfd8e3", hemiIntensity]} />
      <directionalLight position={[4.5, 5.8, 5.2]} intensity={keyIntensity} color="#ffffff" />
      <directionalLight position={[-5.0, 2.2, 3.8]} intensity={fillIntensity} color="#EEF4FA" />

      {/* Specular editorial rim lights */}
      <pointLight
        position={[-3.2, rimSweepY, 2.6]}
        intensity={interpolate(darkProgress, [0, 1], [8, 28])}
        color={theme.accentSecondary}
      />
      <pointLight
        position={[2.4, -rimSweepY * 0.7, 2.2]}
        intensity={interpolate(darkProgress, [0, 1], [5, 22])}
        color={theme.accent}
      />

      {/* Primary Bottle Rig */}
      <group position={[posX, posY, 0]} rotation={[rotX, rotY, rotZ]} scale={scale}>
        {/* Matte ceramic-anodized insulated body (rotated PI so lathe seam faces rear -Z) */}
        <mesh geometry={bottleBodyGeometry} rotation={[0, Math.PI, 0]}>
          <meshPhysicalMaterial
            color={theme.bottleColor}
            metalness={0.28}
            roughness={0.34}
            clearcoat={0.38}
            clearcoatRoughness={0.26}
          />
        </mesh>

        {/* Soft-touch graphite silicone base pad */}
        <mesh geometry={basePadGeometry} rotation={[0, Math.PI, 0]}>
          <meshStandardMaterial color="#1A1D24" metalness={0.1} roughness={0.82} />
        </mesh>

        {/* Subtle recessed precision titanium collar ring on upper body */}
        <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.427, 0.006, 16, 72]} />
          <meshStandardMaterial color={theme.capColor} metalness={0.88} roughness={0.2} />
        </mesh>

        {/* Minimalist vertical brand emblem pill on bottle face */}
        <mesh position={[0, -0.02, 0.426]}>
          <capsuleGeometry args={[0.024, 0.14, 8, 16]} />
          <meshStandardMaterial
            color={theme.capColor}
            metalness={0.82}
            roughness={0.22}
            emissive={theme.accentSecondary}
            emissiveIntensity={0.08 + darkProgress * 0.22}
          />
        </mesh>

        {/* Precision brushed titanium neck sleeve */}
        <mesh position={[0, 0.94, 0]}>
          <cylinderGeometry args={[0.268, 0.272, 0.18, 64]} />
          <meshStandardMaterial color={theme.capColor} metalness={0.88} roughness={0.2} />
        </mesh>

        {/* Glacier-blue silicone airtight seal ring (revealed clearly as cap lifts!) */}
        <mesh position={[0, 0.985, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.271, 0.015, 20, 72]} />
          <meshStandardMaterial
            color={theme.accentSecondary}
            emissive={theme.accent}
            emissiveIntensity={0.45 + macroFactor * 0.65 + darkProgress * 0.45}
            metalness={0.2}
            roughness={0.25}
          />
        </mesh>

        {/* Inner dark thermal throat (visible during magnetic cap lift) */}
        <mesh position={[0, 1.01, 0]}>
          <cylinderGeometry args={[0.23, 0.23, 0.07, 48]} />
          <meshStandardMaterial color="#11141B" metalness={0.6} roughness={0.35} />
        </mesh>

        {/* Lifting Magnetic Cap Assembly */}
        <group position={[0, 1.01 + capLift, 0]}>
          {/* Cap body (rotated PI so lathe seam faces rear -Z) */}
          <mesh geometry={capGeometry} rotation={[0, Math.PI, 0]}>
            <meshPhysicalMaterial
              color={theme.capColor}
              metalness={0.82}
              roughness={0.22}
              clearcoat={0.45}
              clearcoatRoughness={0.18}
            />
          </mesh>

          {/* Subtle machined chamfer groove on cap */}
          <mesh position={[0, 0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.306, 0.0055, 16, 72]} />
            <meshStandardMaterial color="#6B7280" metalness={0.7} roughness={0.35} />
          </mesh>

          {/* Sculpted folding carry-loop arch */}
          <group position={[0, 0.285, 0]} rotation={[0.38, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.195, 0.022, 20, 64, Math.PI]} />
              <meshPhysicalMaterial
                color={theme.bottleColor}
                metalness={0.42}
                roughness={0.28}
                clearcoat={0.5}
              />
            </mesh>
            {/* Hinge pins */}
            <mesh position={[-0.195, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.026, 0.026, 0.045, 24]} />
              <meshStandardMaterial color={theme.capColor} metalness={0.9} roughness={0.18} />
            </mesh>
            <mesh position={[0.195, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.026, 0.026, 0.045, 24]} />
              <meshStandardMaterial color={theme.capColor} metalness={0.9} roughness={0.18} />
            </mesh>
          </group>
        </group>

        {/* Double-Wall Thermal Halo Rings (fade in cleanly during Dark Chapter Beat 3) */}
        {darkProgress > 0.02 && (
          <group position={[0, -0.08, 0]}>
            <mesh rotation={[Math.PI / 2 + 0.14, t * 0.25, 0]}>
              <torusGeometry args={[0.68, 0.0065, 16, 96]} />
              <meshStandardMaterial
                color={theme.accentSecondary}
                emissive={theme.accentSecondary}
                emissiveIntensity={0.8}
                transparent
                opacity={0.42 * darkProgress}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2 - 0.18, -t * 0.18, 0.1]}>
              <torusGeometry args={[0.82, 0.0045, 16, 96]} />
              <meshStandardMaterial
                color={theme.accent}
                emissive={theme.accent}
                emissiveIntensity={0.65}
                transparent
                opacity={0.28 * darkProgress}
              />
            </mesh>
          </group>
        )}

        {/* Deterministic Translucent Glass Water Droplets */}
        {droplets.map((d, idx) => {
          const driftY = Math.sin(t * d.speed + d.phase) * 0.09;
          const driftX = Math.cos(t * d.speed * 0.7 + d.phase) * 0.04;
          const dropletScale = 1 - macroFactor * 0.45;
          return (
            <mesh
              key={idx}
              position={[d.x + driftX, d.y + driftY, d.z]}
              scale={dropletScale}
            >
              <sphereGeometry args={[d.r, 28, 28]} />
              <meshPhysicalMaterial
                color={darkProgress > 0.5 ? theme.accentSecondary : "#E0F2FE"}
                metalness={0.08}
                roughness={0.06}
                clearcoat={1}
                clearcoatRoughness={0.04}
                transparent
                opacity={interpolate(darkProgress, [0, 1], [0.58, 0.72])}
              />
            </mesh>
          );
        })}

        {/* Soft velvety studio floor contact shadow (light gallery mode) */}
        {shadowOpacity > 0.005 && (
          <mesh position={[0, -1.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.95, 1.95]} />
            <meshBasicMaterial
              map={softShadowTexture}
              transparent
              opacity={shadowOpacity}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </>
  );
};

interface WaterBottle3DStageProps {
  theme: WaterBottleTheme;
  timings: StageTimings;
  darkProgress: number;
}

export const WaterBottle3DStage: React.FC<WaterBottle3DStageProps> = ({
  theme,
  timings,
  darkProgress,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, 6.2], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <BottleStudioScene
          frame={frame}
          fps={fps}
          theme={theme}
          timings={timings}
          darkProgress={darkProgress}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
