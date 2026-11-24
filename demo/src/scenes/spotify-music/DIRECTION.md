# Creative Direction Brief — Spotify Launch Film (`DIRECTION.md`)

## 1. Brand Discovery Summary
- **Product:** **Spotify** — the global music streaming app.
- **Source of Identity:** Derived directly from Spotify's real-world consumer brand system: deep OLED obsidian studio surfaces (`#0A0A0A` / `#121212` / `#181818`), unmistakable Spotify Green (`#1DB954` / `#1ED760`), crisp geometric circular sans typography (`Plus Jakarta Sans` via `@remotion/google-fonts`), and `JetBrains Mono` (`tabular-nums`) for live track timecodes.
- **Audience & Core Value Prop:** Everyday listeners and music lovers who want instant, effortless playback, deeply personalized discovery, and uninterrupted listening across every device.

---

## 2. The 15-Second Stranger Test (3-Sentence Story)
1. **Hook (`0.0–3.0s`, `f0–f90`):** Opens mid-action at `2.35×` macro zoom on a tactile Spotify Green Play Disc (`#1DB954`) inside a dark obsidian player bar as a click triggers instant playback—pulling back (`2.35× → 1.0×`) to reveal *"Press play. Feel everything."*
2. **Proof (`3.0–15.0s`, `f90–f450`):** The Play Disc docks into a 2.5D tilted titanium smartphone (`rotateY: -18° → +14°`) with coupled glass sheen and a `+82px` Z-exploded live synced-lyrics card; portals through the album artwork onto a crisp matte-paper Discovery stage (`#F6F6F2`) where curated mixes (*Discover Weekly*, *Release Radar*, *Late Night Drive*) switch moods live; then whip-pans back to obsidian where the Play Disc glides seamlessly across **Phone → Headphones → Speaker** via Spotify Connect with uninterrupted timecode.
3. **CTA (`15.0–18.0s`, `f450–f540`):** The active device capsule contracts around the green Play Disc as its 3 iconic soundwave arcs draw out into the Spotify emblem + wordmark lockup (*"Music for everyone."* · `spotify.com`) on a living `3.0s` hold.

---

## 3. Locked Technique Playbook & Primitive Isolation
- **Locked Playbook:** **Playbook 4 — `product-cinema` (Software UI & Mobile App Cinema)**
- **Duration & Tempo:** `18.0s` · `540 frames @ 30fps` · `120 BPM` (`36 beats`, `15 frames/beat`).
- **Primitive Isolation:** Uses strictly `product-cinema` craft (`<SpatialCameraRig>` macro-to-wide choreography, 2.5D perspective hardware stage with coupled glass sheen and Z-exploded cards, `<DirectionalMotionBlur>` whip-pans, verified `@remotion/google-fonts`, and `<SoundTrackLayer>` DSP SFX). Zero cross-pack leakage (`PaperCutoutLayer`, `OrganicBoilFilter`, `LiquidMetaballStage`, `CameraTrackedStroke`).

---

## 4. Core Emotion & Frame-0 Hook (`0.0–3.0s`)
- **Emotion:** The visceral thrill of pressing play—tactile, rhythmic, effortless, and alive.
- **Frame-0 Presence:** Alive at `frame = 0` (`progress >= 0.40`, `2.35×` macro zoom) centered on the glowing-edge-free, crisp `#1DB954` Spotify Play Disc inside a sleek `#161618` player bar with live equalizer bars already pulsing on beat. Zero fade-from-black, zero blank frames.

---

## 5. Original Hero Motif & Visual Thread (Object Permanence)
- **Hero Motif:** **The Spotify Green Play Disc (`#1DB954`)**.
  - **Beat 1 (`f0–f90`):** Macro Play button pressed live → triggers acoustic ring pulse & `2.35× → 1.0×` pull-back.
  - **Beat 2 (`f90–f225`):** Anchors the Now Playing controls inside the 2.5D tilted phone while exploding a `+82px` Z-layer Synced Lyrics card from its coordinate → `1.0× → 4.2×` portal zoom-through the album art.
  - **Beat 3 (`f225–f345`):** Earned light-paper polarity (`#F6F6F2`) Discovery stage — Play Disc marks the active curated playlist card as mood switches live, exiting on a peak-velocity horizontal whip-pan.
  - **Beat 4 (`f345–f450`):** Glides smoothly along a single 1-to-1 connected rail across **iPhone → Studio Headphones → Home Speaker** while track timecode (`01:42 → 01:45`) plays without skipping a beat.
  - **Beat 5 (`f450–f540`):** Contracts to center stage and morphs its play triangle into the 3 iconic curved Spotify soundwave arcs beside the bold **Spotify** wordmark and `spotify.com` pill.

---

## 6. Derived Brand System & Copy Budget
- **Palette Tokens:**
  - `OBSIDIAN_BG`: `#0A0A0A` (primary dark studio ground, `78%` of runtime)
  - `OBSIDIAN_SURFACE`: `#161618` / `#1E1E22` (elevated hardware & card chrome with `1px` `rgba(255,255,255,0.10)` hairline)
  - `LIGHT_PAPER_BG`: `#F6F6F2` (earned `4.0s` light polarity discovery chapter, `22%` of runtime)
  - `ACCENT_GREEN`: `#1DB954` (`#1ED760` highlight)
  - `PRIMARY_INK_DARK`: `#FFFFFF` · `MUTED_INK_DARK`: `#A7A7A7`
  - `PRIMARY_INK_LIGHT`: `#121212` · `MUTED_INK_LIGHT`: `#5E5E5E`
- **Verified Webfonts (`@remotion/google-fonts`):**
  - `@remotion/google-fonts/PlusJakartaSans` (`600`, `700`, `800`) — Display headlines & UI
  - `@remotion/google-fonts/JetBrainsMono` (`500`, `600`) — Live `tabular-nums` track timers & lossless badges
- **Motion Temperament:** `tactile-snappy` (`SPRING_SNAPPY` for taps/cards, `EASE_OUT_EXPO` / `SPRING_SMOOTH` for 2.5D device & camera moves).
- **Copy Budget:** Max `2–4 words` per beat (`"Press play."`, `"Feel everything."`, `"Live lyrics."`, `"Made for you."`, `"Every device."`, `"Music for everyone."`). Zero paragraphs.

---

## 7. Audio Architecture & Explicit Exclusion List
- **Audio:** Crisp 48 kHz offline procedural DSP SFX only (`demo/public/sfx/*.wav`, zero code-generated music bed) synced to exact click/cut frames and mastered post-render to `-14 LUFS` / `-1.5 dBTP` via `master-audio.mjs`.
- **Banned:** Chat bubbles or typed prompt sentences; gray skeleton bars; fake `97 SCORE` or `const res = await` dashboards; blurred circular radial-gradient background glow orbs; dangling decorative wires; forced 2.5D tilt on flat editorial text; sparkle icons (`✨`); LLM stick-figure SVG clipart; `scale(0)` vacuum card entrances; dead-frame holds (`> 0.6s` with `< 1%` pixel change); code-generated music beds; recycled parchment/terracotta or purple-blue SaaS costumes.
