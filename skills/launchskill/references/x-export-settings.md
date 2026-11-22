# X (Twitter) Video Export, Compression Defense & Motion-Boundary Visual QA

Encoding flags, X re-encoder defense, and the mandatory **Hero + Cut-Boundary Contact-Sheet QA** loop to run before shipping any launch video.

---

## 1. X Technical Specifications (16:9 Landscape)

| Property | Recommended Value | Why It Matters |
| :--- | :--- | :--- |
| **Resolution** | `1920 × 1080` (16:9) | Maximum sharpness before X downscales; ideal for readable UI |
| **Frame Rate** | `30 fps` (or `24p` cinema / `60p` micro-UI) | All templates use `sec()` & `createBeatGrid()`, so changing `fps` requires zero timing rewrites |
| **Duration** | `15 – 45 seconds` (hard cap `60s`) | Sweet spot for completion rate and auto-replays on X |
| **Codec** | `H.264` (`--codec=h264`) | Universal compatibility with X ingest pipeline |
| **Pixel Format** | `yuv420p` (`--pixel-format=yuv420p`) | Prevents black frames or color shift on iOS/Android |
| **Quality (CRF)** | `16 – 18` (`--crf=18`) | Near-lossless master so X's transcode starts from crisp pixels |
| **Audio** | AAC, `48 kHz`, `192 kbps`, `-14 LUFS` | Video must read 100% muted; run `scripts/generate-dsp-sfx.mjs` + `scripts/generate-dsp-music.mjs` (Tier-1 100% license-free studio DSP foley & music bed) or optional `scripts/generate-ai-sfx.mjs` / real track + `scripts/master-audio.mjs` (`-14 LUFS`, `-1.5 dBTP`) |

---

## 2. Standard Export Commands

```bash
# Standard 1080p X Master (with procedural SFX / audio bed)
npx remotion render <CompositionId> out/launch-video-x.mp4 \
  --codec=h264 \
  --pixel-format=yuv420p \
  --crf=18 \
  --audio-codec=aac \
  --audio-bitrate=192k \
  --gl=angle
```

For `60 fps` ultra-fluid UI showcases, set `fps={60}` in `src/Root.tsx` and render with `--crf=17`.

---

## 3. Defending Against X's H.264 Re-Encoder

Bake these defenses into every composition:
- **Dither gradients with fast tiled `2.2–2.8%` film grain** (`FilmGrainOverlay` in [templates/StudioPrimitives.tsx](../templates/StudioPrimitives.tsx)) so obsidian backgrounds and light cycloramas never turn into blocky color bands—without the 5–10× slowdown of full-HD `<feTurbulence>`.
- **High-contrast legibility**: Keep primary copy contrast `>= 7:1` and muted copy `>= 4.5:1`.
- **Crisp `1px` borders** (`rgba(10,10,10,0.09)` on light, `rgba(255,255,255,0.11)` on dark) around UI windows so edges survive mobile downscaling.
- **Clean loop boundary**: End on a calm `2.5–3.2s` brand + URL lockup that cuts cleanly back to your bold Frame-0 hook for seamless X auto-replays.

---

## 4. Mandatory Motion-Boundary + Contact-Sheet Visual QA Loop

Never stop at checking 5 calm midpoint frames—most Remotion visual bugs (crossfade ghosting, snap-pops, unloaded webfonts, or stray motion blur left on a resting frame) happen **right on cut boundaries**.

### Automated QA Runner (`scripts/qa-frames.mjs`)
Run the bundled zero-dependency QA script to render **5 strategic hero stills** PLUS **cut-boundary triplets (`cut - 1`, `cut`, `cut + 2`)** for every major edit boundary, and compile an inspectable `contact-sheet.html`:

```bash
node skills/launchskill/scripts/qa-frames.mjs \
  --comp <CompositionId> \
  --fps 30 \
  --duration 720 \
  --cuts 75,390,540,600 \
  --out out/qa \
  --gl angle
```

Or run the equivalent Remotion CLI stills manually:
```bash
# 5 Hero Stills (Hook, Product, Macro, Midpoint/Theme Flip, CTA)
npx remotion still <CompositionId> out/qa/hero-01-hook.png --frame=12 --gl=angle
npx remotion still <CompositionId> out/qa/hero-02-product.png --frame=160 --gl=angle
npx remotion still <CompositionId> out/qa/hero-03-macro.png --frame=300 --gl=angle
npx remotion still <CompositionId> out/qa/hero-04-chapter.png --frame=460 --gl=angle
npx remotion still <CompositionId> out/qa/hero-05-cta.png --frame=650 --gl=angle

# Cut-Boundary Triplet Example (for cutFrame = 390)
npx remotion still <CompositionId> out/qa/cut-01-pre.png  --frame=389 --gl=angle
npx remotion still <CompositionId> out/qa/cut-01-on.png   --frame=390 --gl=angle
npx remotion still <CompositionId> out/qa/cut-01-post.png --frame=392 --gl=angle
```

### 8-Point Studio Inspection Rubric
Open every rendered PNG (and `out/qa/contact-sheet.html`) and fix any failure before shipping:
1. **Real Webfont Verification**: Confirm `Inter` / `Instrument Serif` / `JetBrains Mono` actually rendered—zero Segoe UI / Arial fallback.
2. **Cut-Boundary Cleanliness (`cut - 1`, `cut`, `cut + 2`)**: Zero ghosting between outgoing/incoming text layers, zero 1-frame empty flashes, and zero abrupt pop-in before motion vectors align.
3. **Zero Stray Blur at Rest**: Confirm `<DirectionalMotionBlur>` drops cleanly to `0` on every holding frame; directional streaks appear strictly along the travel axis during fast motion.
4. **360px Mobile Squint Test**: Mentally shrink every hero frame to phone width. Can you read every headline, badge, counter, and URL effortlessly in under 1.5 seconds?
5. **Optical Type & Safe Zones**: Verify `120px × 90px` safe margins (clearing X scrubber/mute UI), `tabular-nums` on every animated number, and hierarchical secondary settle on inner card elements.
6. **Brand Authenticity (De-Cloning Check)**: Confirm accent colors, cursor styling, and motion temperament match the target product's brand—never leaked `#EC4899` or `#F97316` reference defaults.
7. **Surface & 3D IBL Craft**: If using `<ThreeCanvas>`, confirm smooth studio softbox reflections (`RoomEnvironment`) and clean Gaussian contact shadows with zero banding.
8. **Light-First, Dark macOS Contrast & Anti-Slop Audit**: Confirm crisp light/white (`#FFFFFF` / `#F9F9F8` / `#F7F7F5`) `<StudioCyclorama />` primary polarity (unless dark theme was explicitly requested) with camera-coupled spatial depth; verify any code editor/devtool on a light canvas uses **Dark-Mode macOS chrome (`#0D0D10`, real traffic lights, multi-token syntax highlighting, zero blank-gap diff fade-ins)**; confirm official vector brand SVGs, **zero blurred circular/radial background glow blobs**, zero gray skeleton-loader bars, zero dense text-wall spec tables, zero parked idle seconds, zero floating wireframe rings, zero sparkle icons (`✨`), zero rainbow text, zero incomplete agent checklists, and zero empty fade-to-black tails.
