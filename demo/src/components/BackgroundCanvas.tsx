import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import "@react-three/fiber";
import * as THREE from "three";
import type { LaunchTheme } from "../lib/schema";

interface AmbientSceneProps {
  frame: number;
  fps: number;
  accent: string;
  accentSecondary: string;
  mode: "saas" | "feature" | "emblem";
  intensity: number;
}

const createRoundedRectShape = (width: number, height: number, radius: number): THREE.Shape => {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
};

const Ambient3DScene: React.FC<AmbientSceneProps> = ({
  frame,
  fps,
  accent,
  accentSecondary,
  mode,
  intensity,
}) => {
  const t = frame / fps;

  const roundedSlabGeometry = useMemo(() => {
    const shape = createRoundedRectShape(2.4, 2.4, 0.42);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    geom.center();
    return geom;
  }, []);

  const ringRotX = 0.55 + Math.sin(t * 0.45) * 0.14;
  const ringRotY = t * 0.24;
  const floatY = Math.sin(t * 1.1) * 0.14;
  const sweepX = Math.sin(t * 0.7) * 4.2;

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 6]} intensity={1.45} color="#ffffff" />
      <pointLight position={[sweepX, 2.2, 3.6]} intensity={24 * intensity} color={accent} />
      <pointLight position={[-sweepX * 0.8, -2.5, 2.8]} intensity={18 * intensity} color={accentSecondary} />

      {/* Subtle architectural orbital ring */}
      <group
        position={[mode === "feature" ? 2.1 : 0, floatY * 0.5, -2.2]}
        rotation={[ringRotX, ringRotY, 0.12]}
        scale={mode === "emblem" ? 1.12 : 1.35}
      >
        <mesh>
          <torusGeometry args={[2.55, 0.018, 24, 128]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.45 * intensity}
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.42 * intensity}
          />
        </mesh>
        <mesh rotation={[Math.PI * 0.36, 0.4, 0]}>
          <torusGeometry args={[3.15, 0.01, 20, 128]} />
          <meshStandardMaterial
            color={accentSecondary}
            emissive={accentSecondary}
            emissiveIntensity={0.35 * intensity}
            metalness={0.6}
            roughness={0.25}
            transparent
            opacity={0.24 * intensity}
          />
        </mesh>
      </group>

      {/* Subtle floating glassmorphic prism accents */}
      {mode !== "emblem" && (
        <>
          <mesh
            position={[-3.6, 1.35 + floatY, -1.6]}
            rotation={[0.4 + t * 0.18, 0.6 + t * 0.22, 0.2]}
          >
            <octahedronGeometry args={[0.38, 0]} />
            <meshPhysicalMaterial
              color="#1f2438"
              metalness={0.3}
              roughness={0.18}
              clearcoat={0.9}
              emissive={accent}
              emissiveIntensity={0.16 * intensity}
            />
          </mesh>
          <mesh
            position={[3.75, -1.25 - floatY * 0.8, -1.8]}
            rotation={[0.25 - t * 0.15, -0.5 + t * 0.2, 0.4]}
          >
            <icosahedronGeometry args={[0.32, 0]} />
            <meshPhysicalMaterial
              color="#1a2233"
              metalness={0.35}
              roughness={0.2}
              clearcoat={0.85}
              emissive={accentSecondary}
              emissiveIntensity={0.18 * intensity}
            />
          </mesh>
        </>
      )}

      {/* Sculpted 3D emblem slab for the Simple Product Reveal template */}
      {mode === "emblem" && (
        <group
          position={[0, floatY * 0.7, 0.2]}
          rotation={[
            Math.sin(t * 0.85) * 0.14,
            Math.sin(t * 0.65) * 0.32 + t * 0.16,
            Math.cos(t * 0.5) * 0.05,
          ]}
          scale={0.72 + intensity * 0.28}
        >
          <mesh geometry={roundedSlabGeometry}>
            <meshPhysicalMaterial
              color="#141624"
              metalness={0.55}
              roughness={0.16}
              clearcoat={1}
              clearcoatRoughness={0.1}
              emissive={accent}
              emissiveIntensity={0.12 * intensity}
            />
          </mesh>
          <mesh position={[0, 0, 0.22]}>
            <torusGeometry args={[0.68, 0.075, 24, 64]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.65}
              metalness={0.4}
              roughness={0.18}
            />
          </mesh>
          <mesh position={[0, 0, 0.26]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.42, 0.42, 0.12]} />
            <meshStandardMaterial
              color={accentSecondary}
              emissive={accentSecondary}
              emissiveIntensity={0.55}
              metalness={0.5}
              roughness={0.15}
            />
          </mesh>
        </group>
      )}
    </>
  );
};

interface BackgroundCanvasProps {
  theme: LaunchTheme;
  mode?: "saas" | "feature" | "emblem";
  focusIntensity?: number;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({
  theme,
  mode = "saas",
  focusIntensity = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  const glowShiftX = interpolate(frame, [0, durationInFrames], [36, 64]);
  const glowShiftY = interpolate(frame, [0, durationInFrames], [28, 56]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background, overflow: "hidden" }}>
      {/* Soft radial ambient glow */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(circle at ${glowShiftX}% ${glowShiftY}%, ${theme.accent}2B 0%, transparent 50%),
            radial-gradient(circle at ${100 - glowShiftX}% ${100 - glowShiftY * 0.7}%, ${theme.accentSecondary}1D 0%, transparent 46%)
          `,
        }}
      />

      {/* Crisp subtle studio dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(circle at 50% 50%, black 35%, transparent 88%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 35%, transparent 88%)",
          opacity: 0.7,
        }}
      />

      {/* Single persistent deterministic React Three Fiber layer */}
      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 0, 6.2], fov: 36 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Ambient3DScene
            frame={frame}
            fps={fps}
            accent={theme.accent}
            accentSecondary={theme.accentSecondary}
            mode={mode}
            intensity={focusIntensity}
          />
        </ThreeCanvas>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
