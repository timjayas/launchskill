# Objective Pass/Block Review Gates & Blind Adversarial Critic

Approval of a generated launch film must be **earned, never assumed**. Whenever auditing a composition or inspecting a rendered `.mp4` + `out/qa/contact-sheet.html`, adopt a **"Default to Flagging"** posture: if **any** shot violates one of the **5 Universal Laws**, triggers any item on the **Blind Adversarial Critic Checklist**, or breaks the locked style pack's rules, issue a **`BLOCK`** verdict until remediated.

---

## 1. Two-Layer Audit Architecture

1. **Universal Layer (This Document — Mandatory for ALL 4 Style Packs)**: The **5 Universal Laws** and the **Blind Adversarial Critic Checklist** apply identically to every film (`editorial-morph`, `single-line-kinetic`, `paper-cutout`, and `product-cinema`).
2. **Style-Pack Layer (Isolated — Load ONLY Your Locked Pack)**:
   - Software/hardware UI demos (card entrance scale floors `>= 0.90`, micro-UI vs. camera spring mass proportionality, dark macOS chrome contrast on light cycloramas, zero dead-frame holds, and UI benchmarks) are governed exclusively by [product-cinema.md](../styles/product-cinema.md).
   - Abstract creative-coding films are governed exclusively by their locked style pack: [editorial-morph.md](../styles/editorial-morph.md), [single-line-kinetic.md](../styles/single-line-kinetic.md), or [paper-cutout.md](../styles/paper-cutout.md).

---

## 2. The 5 Universal Laws (All Style Packs)

| # | Universal Law | Hard Pass Criteria | Immediate `BLOCK` Trigger |
| :-: | :--- | :--- | :--- |
| **L1** | **The 15-Second Stranger Test (Unmistakable Clarity)** | Complete 3-sentence story (`Hook → Proof → CTA`) reads unmistakably muted in one watch; Frame 0 is alive and establishes the world immediately; every beat directly serves this product's real proposition. | Confusing or vague story, blank/fade-from-black Frame 0, cutting into unrelated fake products or random vanity numbers (`40ms`, `10x`) just to hit a motion effect, or prose paragraphs that force reading instead of watching. |
| **L2** | **Zero Internal Dev/QA Jargon On Screen** | 100% viewer-facing, brand-authentic visuals and copy across every single rendered frame. | Any internal debug label, frame counter, fake `97 SCORE` badge/ring, `const res = await` filler code, `CAMERA / TYPE / AUDIO` meta-labels, gate IDs, rubric scores, or template placeholder strings visible in any frame. |
| **L3** | **Anti-Template Originality & Kinetic Craft** | Brand-authentic visual world derived from the real product (never recycled Anthropic parchment/terracotta, generic Swiss monochrome, or purple-blue SaaS costumes), genuine spatial choreography, scale/rhythm contrast, generous calm negative space, and single-playbook cohesion. | Recycled default brand costume unrelated to the product, PowerPoint / "Magic Move" uniform centred box resizing every 3–4s, static slide-deck pacing, widget buffets stacking 3+ unrelated elements, dangling wires pointing into empty air, or mixing incompatible techniques in one film. |
| **L4** | **Frame-Clock Determinism + Verified Font Loading** | 100% driven by `useCurrentFrame()`, `interpolate()`, and `spring()`; clean `npx tsc --noEmit`; every display/body/mono webfont loaded deterministically via `@remotion/google-fonts` (or awaited `document.fonts.load`) and visually verified in stills. | Any `Math.random()`, `Date.now()`, `useFrame` delta drift, CSS `@keyframes`, CSS `transition`, TypeScript compiler error, or silent fallback to Times New Roman, Georgia, Arial, or system sans/serif on any rendered frame. |
| **L5** | **SFX-Only / BYO Audio Discipline** | Crisp offline procedural DSP SFX ([generate-dsp-sfx.mjs](../scripts/generate-dsp-sfx.mjs)) as default—or user-supplied licensed `.mp3` synced via [analyze-music.mjs](../scripts/analyze-music.mjs)—mastered via [master-audio.mjs](../scripts/master-audio.mjs) to `-14.0 LUFS ± 1.5` (`truePeak <= -1.0 dBTP`) with peak-aligned cuts. | Any code-generated synth/chiptune music bed, harsh raw sine-wave beeps, piercing treble chimes, clipping (`> -1.0 dBTP`), or unmastered loudness (`< -18 LUFS` or `> -11 LUFS`). |

---

## 3. Blind Adversarial Critic Checklist (Pre-Export Rejection Gate)

Before approving any render, switch completely out of author mode into **Blind Adversarial Critic** mode:

1. **Inspect Rendered Frames Blindly**: Open `out/qa/contact-sheet.html`, the rendered PNG stills, and the `.mp4` **without** trusting `DIRECTION.md` intentions or code comments. Judge strictly what lands in the pixels at both full `1080p` and `360px` mobile X feed width.
2. **Apply the "Smells Like a React CSS Demo" Rejection Test**: Immediately **`BLOCK`** the film if **ANY** single item below is visible on screen:

- [ ] **React / Tailwind Box Smell**: Rounded-corner `<div>` cards with subtle borders, drop shadows, pill chips, or generic SaaS container chrome pretending to be a launch film (especially fatal in abstract style packs).
- [ ] **Landing-Page Flexbox Stack**: Centred headline stacked vertically over a subtitle stacked over a card/button (`flex-direction: column; align-items: center`) that looks like a static web page hero rather than directed motion cinema.
- [ ] **Linear CSS Box Resizing ("Magic Move" Slop)**: Containers or rectangles smoothly growing/shrinking in place at one uniform medium speed instead of real SVG path morphing, live tracked strokes, stepped stop-motion parallax, or focal-locked camera choreography.
- [ ] **Fallback System Typography**: Unloaded webfonts silently falling back to Times New Roman, Arial, or mismatched system fonts in DOM or SVG `<text>` nodes.
- [ ] **Cross-Pack Contamination / UI Chrome Leakage**: Generic progress bars, audio waveforms, NLE timelines, terminal titlebars, macOS traffic lights, chat prompt inputs, or KPI dashboards leaking into an abstract film (`editorial-morph`, `single-line-kinetic`, `paper-cutout`).
- [ ] **Static Slide-Deck Pacing**: Disconnected full-screen fades/slides with identical beat cadence, dead static holds with zero living craft, or no persistent visual thread linking opening to finale.
- [ ] **Recycled Brand Costume (Anti-Template Violation)**: Defaulting to Anthropic parchment/terracotta (`#F4F1EA` + `#D97757`), generic Swiss monochrome, or purple-blue SaaS gradients when the user's real product/brand has a different identity.
- [ ] **Generic AI Slop Tropes**: Sparkle icons (`✨`), blurred neon/radial glow orbs behind copy, gray skeleton-loader bars, fake `97 SCORE` radial rings, or wireframe CAD grid wallpaper.
- [ ] **Mobile Feed Failure & Macro Edge Clipping**: Unreadable sub-28px micro-copy, low-contrast text, clipped strokes/glyphs, macro focal objects exceeding `92%` viewport width (`elementW * macroZoom > 0.92 * W` unless intentional edge bleed), or essential visuals spilling outside `120px × 90px` safe margins.
- [ ] **Fade-to-Blank Peel Seams & DOM 3D Lag**: Fading an outgoing scene to blank solid color before a wipe/peel (always overlap and peel real pixels directly), or mounting `> 30` simultaneous `preserve-3d` DOM nodes that tank Studio playback FPS (use SVG `<clipPath>` masks for crisp geometric transitions or WebGL/Three `InstancedMesh` for dense 3D grids).

> **Zero-Tolerance Rule:** If **even ONE** checklist item triggers, the verdict is **`BLOCK`**. Fix the architectural root cause (never a cosmetic patch), re-run [scripts/qa-frames.mjs](../scripts/qa-frames.mjs), and re-audit blindly until zero items trigger.

---

## 4. Supplemental Style-Pack Gates

After clearing Sections 2 and 3, apply **ONLY** the supplemental gates for your film's locked style pack:
- **Software UI / Hardware Demos**: Load [../styles/product-cinema.md](../styles/product-cinema.md) for UI-specific pass/block gates (entrance scale floors, micro-UI vs. 2.5D spring durations, dark macOS chrome contrast, zero dead-frame holds, and quantitative UI benchmarks).
- **Abstract Launch Films**: Load your locked pack ([../styles/editorial-morph.md](../styles/editorial-morph.md), [../styles/single-line-kinetic.md](../styles/single-line-kinetic.md), or [../styles/paper-cutout.md](../styles/paper-cutout.md)) and verify 100% adherence to its palette, shot grammar, copy cap, and ban list.

---

## 5. Mandatory Audit Output Format (Findings Table + Verdict)

Format every pre-export review or self-improvement loop audit strictly as:

```markdown
| File / Shot | Frame Window | Law / Critic Check | Why It Fails Craft | Concrete Remediation |
| :--- | :---: | :---: | :--- | :--- |
| `Film.tsx` (Beat 2) | `f90–f180` | **Critic: React CSS Demo** | Rounded bordered `<div>` card resizing linearly in centre of canvas | Replace box with continuous `<MorphingShape />` silhouette transition on the brand's derived canvas |
| `Film.tsx` (Beat 1) | `f0–f60` | **L4 (Font Loading)** | SVG `<text>` rendered in fallback Times New Roman instead of the brand's display font | Load via `@remotion/google-fonts/<BrandFont>` and pass exact `fontFamily` token |

**Verdict:** `BLOCK` (issue `APPROVE` only when 0 Universal Law violations, 0 Blind Critic triggers, and 0 locked Style-Pack violations remain)
```
