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
| **Audio** | AAC, `48 kHz`, `192 kbps`, `-14 LUFS` | Video must read 100% muted AND hit hard unmuted: source a real matching music track (`scripts/analyze-music.mjs`), layer crisp offline procedural DSP SFX (`scripts/generate-dsp-sfx.mjs`) with music ducking, and master via `scripts/master-audio.mjs` (`-14 LUFS`, `-1.5 dBTP`) |

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
- **Seamless infinite loop bridge**: Physically drive the brand lockup from the penultimate scene, hold cleanly (`1.8–2.6s`), and bridge the final `0.6–1.0s` back into Frame 0's exact geometry, camera state, and polarity (with bar-aligned loop-safe audio fades) for an invisible X auto-replay.

---

## 4. Mandatory Two-Stage QA: Stills Pre-Check + End-to-End Rendered `.mp4` Review

**Never approve a video from static QA stills alone.** Stills catch font fallbacks and 1-frame cut glitches, but they **cannot** show real perceived pacing, mid-transition overlaps, easing jerkiness, motion flow, audio-visual beat sync, or whether the ending truly loops seamlessly back into Frame 0.

### Stage 4A — Fast Structural Pre-Check (`scripts/qa-frames.mjs`)
Run the bundled zero-dependency QA script before full render to inspect **5 strategic hero stills**, **cut-boundary triplets (`cut - 1`, `cut`, `cut + 2`)**, AND the **loop-seam pair (`duration - 1` vs. `0`)** in `contact-sheet.html`:

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
# 5 Hero Stills (Hook, Product, Macro, Midpoint/Theme Flip, Finale Lockup)
npx remotion still <CompositionId> out/qa/hero-01-hook.png --frame=12 --gl=angle
npx remotion still <CompositionId> out/qa/hero-02-product.png --frame=160 --gl=angle
npx remotion still <CompositionId> out/qa/hero-03-macro.png --frame=300 --gl=angle
npx remotion still <CompositionId> out/qa/hero-04-chapter.png --frame=460 --gl=angle
npx remotion still <CompositionId> out/qa/hero-05-cta.png --frame=650 --gl=angle

# Loop-Seam Pair (final frame -> Frame 0 continuity)
npx remotion still <CompositionId> out/qa/loop-end.png --frame=719 --gl=angle
npx remotion still <CompositionId> out/qa/loop-start.png --frame=0 --gl=angle

# Cut-Boundary Triplet Example (for cutFrame = 390)
npx remotion still <CompositionId> out/qa/cut-01-pre.png  --frame=389 --gl=angle
npx remotion still <CompositionId> out/qa/cut-01-on.png   --frame=390 --gl=angle
npx remotion still <CompositionId> out/qa/cut-01-post.png --frame=392 --gl=angle
```

### Stage 4B — MANDATORY End-to-End Exported `.mp4` Watch Review
After exporting and mastering `out/launch-video-mastered.mp4`, **watch/inspect the actual rendered `.mp4` end-to-end** (including looping from the final second back into `0:00`) before handoff:
- **Pacing & Rhythm:** Does any beat drag, rush, or repeat the same cadence? Are cuts locked to the real music track's beats and drop?
- **Overlaps & Motion Flow:** Do any outgoing/incoming elements collide or overlap awkwardly mid-transition? Are consecutive transitions varied instead of repetitive?
- **Finale & Loop Continuity:** Does the penultimate scene physically drive the lockup (never a static centered flexbox stack), and does the ending bridge cleanly back into Frame 0 without a visual or audio jump?

### 10-Point Studio Inspection Rubric (Stills + End-to-End `.mp4`)
Verify every point below across BOTH `out/qa/contact-sheet.html` and full `.mp4` playback before shipping:
1. **End-to-End `.mp4` Playback Verified**: Actual rendered mastered `.mp4` watched completely (not judged from PNG stills alone) for real pacing, overlaps, motion flow, and beat sync.
2. **Zero AI-Slop HUD/Telemetry Chrome & Zero Corner Counters**: Zero uppercase monospace kickers (`— NE · 10 RELEASE`), zero dot-separated metadata captions (`NE · 10 · 7 / 7 RECEIPTS VERIFIED`), zero rounded glowing-dot pills (`• RECEIPT 03 / 07`), zero labeled percentage/voltage bars, and **zero corner counters (`01 / 07`)**.
3. **Varied Choreography & Physically Driven Finale**: No consecutive repeated transitions; the finale's active geometry/camera physically drives the brand lockup (zero static centered flexbox endings).
4. **Seamless Infinite Loop (`duration - 1` → `0`)**: Ending bridges smoothly back into Frame 0's exact spatial state, polarity, and audio bar boundary with zero pop or jump.
5. **Matching Real Music + Mastered SFX**: Real license-cleared track matching the product's mood/tempo, beat-synced via `analyze-music.mjs`, ducked cleanly under tactile DSP SFX, and mastered to `-14 LUFS` / `-1.5 dBTP` (zero code-generated synth beds).
6. **Real Webfont Verification**: Confirm `@remotion/google-fonts` faces actually rendered—zero Segoe UI / Arial / Times New Roman fallback.
7. **Cut-Boundary Cleanliness (`cut - 1`, `cut`, `cut + 2`)**: Zero ghosting between outgoing/incoming text layers, zero 1-frame empty flashes, zero fade-to-blank peel seams, and zero stray `<DirectionalMotionBlur>` on resting frames.
8. **360px Mobile Squint Test & Safe Zones**: Every headline, UI label, and URL reads effortlessly at phone width inside `120px × 90px` safe margins (`tabular-nums` on every animated number).
9. **Brand Authenticity (De-Cloning Check)**: Surface polarity, accents, radius, typography, and motion temperament match the target product's real brand—never leaked reference defaults.
10. **Clean Surface & Anti-Slop Contrast**: High-contrast figure-ground separation (e.g., Dark-Mode macOS chrome `#0D0D10` with real multi-token syntax highlighting and zero blank-gap diff holes when staging code editors on light canvases), official vector brand SVGs, zero blurred circular background glow blobs, zero gray skeleton-loader bars, zero sparkle icons (`✨`), and zero empty fade-to-black tails.
