# Studio-Grade React Three Fiber in Remotion (and When NOT to Use 3D)

How to use `@remotion/three` and `@react-three/fiber` for realistic, flicker-free studio product renders—without falling into the "plastic CGI" or "floating wireframe ring" traps.

---

## 1. Decision Matrix: When to Use 3D vs. Pure 2D Camera Rig

**Do NOT force `<ThreeCanvas>` into every video.** Unmotivated floating toruses, octahedrons, and tilted glass cards behind 2D SaaS dashboards make videos look cheaper, not more premium.

| Video Subject | Recommended Engine | Why |
| :--- | :--- | :--- |
| **SaaS dashboard, AI prompt workflow, CLI, DevTool, mobile app UI** | **Pure 2D HTML/CSS + `<CameraRig>`** | Orthogonal vector typography stays razor-sharp after X compression; macro zoom-ins + live micro-interactions look 10× more realistic than floating polyhedrons. |
| **Physical hardware, wearables, bottles, packaging, sculptural 3D emblem** | **Persistent `<ThreeCanvas>` + Offline Studio IBL** | Real physical curvature, studio softbox reflections, mechanical motion (cap lift, hinge open), and macro camera framing shine in WebGL. |
| **Brand teaser / logo reveal with tactile 3D mark** | **Persistent `<ThreeCanvas>` + Clean 2D Editorial Type** | Sculpted metallic/ceramic brand mark with real environment reflections centered on generous studio whitespace. |

---

## 2. Golden Rules for Deterministic WebGL in Remotion

Remotion renders frames concurrently in arbitrary order across tabs. Any stateful or clock-based 3D logic causes flicker:

1. **Never use `useFrame` clock deltas** (`state.clock.elapsedTime` or `delta`).
2. **Pass `frame` and `fps` as explicit props** from the outer Remotion component into `<ThreeCanvas>` children.
3. **Never use `Math.random()`** — use deterministic trig or Remotion's `random("seed")`.
4. **Mount at most one persistent `<ThreeCanvas>` per composition.** Drive camera rig, lighting, and object states from `frame` instead of unmounting/remounting canvases across `<Sequence>` boundaries.

---

## 3. Mandatory Offline Studio IBL (Fixes "Flat Plastic Metal")

Bare `directionalLight` + `pointLight` makes metallic materials (`metalness > 0.5`) look dull gray with harsh pinpoint dots because **metals get 85% of their visual realism from reflecting their environment**.

Never fetch remote `.hdr` files over the network during headless renders. Instead, generate an **instant, 100% offline deterministic studio softbox environment** using Three.js's built-in `RoomEnvironment` + `PMREMGenerator`:

```tsx
import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Generates an offline procedural studio softbox environment map (IBL).
 * Zero network fetches, 100% deterministic across concurrent Remotion frames.
 */
export const OfflineStudioEnvironment: React.FC<{ intensity?: number }> = ({
  intensity = 0.85,
}) => {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    const renderTarget = pmrem.fromScene(envScene, 0.04);

    scene.environment = renderTarget.texture;
    if ("environmentIntensity" in scene) {
      (scene as THREE.Scene & { environmentIntensity: number }).environmentIntensity = intensity;
    }

    return () => {
      scene.environment = null;
      renderTarget.dispose();
      envScene.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, intensity]);

  return null;
};
```

> **Color Management Tip:** Configure `<ThreeCanvas gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}>` so highlights roll off smoothly like cinema film rather than clipping to harsh white blobs.

---

## 4. Clean Non-Banded Studio Contact Shadow

Cheap circular `DataTexture` planes can show concentric banding on bright studio cycloramas. Use a `256×256` smooth Gaussian `exp(-r² * k)` falloff with `LinearFilter`, `toneMapped={false}`, and `depthWrite={false}`:

```ts
const contactShadowTexture = useMemo(() => {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = ((x + 0.5) / size) * 2 - 1;
      const ny = ((y + 0.5) / size) * 2 - 1;
      const r2 = nx * nx + ny * ny;
      // Smooth Gaussian studio softbox falloff — zero hard circular edge
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
```

Mount with `<meshBasicMaterial map={contactShadowTexture} transparent opacity={0.38} depthWrite={false} toneMapped={false} />`.

---

## 5. Studio PBR Material Cheat Sheet (With Offline IBL Active)

| Surface | `metalness` | `roughness` | `clearcoat` | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Brushed Titanium / Machined Aluminum** | `0.88` | `0.24` | `0.15` | Looks rich silver/champagne only when `OfflineStudioEnvironment` is active |
| **Matte Anodized Ceramic / Powdercoat** | `0.18` | `0.42` | `0.22` | Satin specular roll-off; never mirror-shiny |
| **Optical Glass / Frosted Acrylic** | `0.05` | `0.10` | `1.0` | Pair with `transmission={0.82}` or crisp translucent tint (`opacity={0.45}`) |
| **Soft-Touch Silicone / Rubber** | `0.02` | `0.86` | `0.0` | Absorbs highlights cleanly for bases and grips |

---

## 6. Precision Camera Rig Discipline (No Aimless Orbiting)

- **Move on deliberate keyframes, not constant sine bobbing**: Use `EASE_IN_OUT_QUINT` between hero wide shots and `1.8×–2.2×` macro detail holds.
- **Restrain idle drift**: If a hero object holds for 2 seconds, keep subtle micro-motion tiny (`rotation.y` drift `<= 0.04 rad`, `posY` drift `<= 0.025`).
- **No sci-fi rings on physical products**: Unless the brand is explicitly futuristic/AR, avoid orbiting neon torus halos around real hardware—use dramatic studio rim lighting and dark cyclorama contrast instead.

---

## 7. Headless Rendering Config (`remotion.config.ts`)

Always include `remotion.config.ts` for reliable WebGL across Windows, macOS, and Linux CI:

```ts
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("angle");
```
