# Objective Pass/Block Review Gates & Blind Adversarial Critic

Approval of a generated launch film must be **earned, never assumed**. Whenever auditing a composition or inspecting `out/qa/contact-sheet.html` AND **watching the exported `.mp4` end-to-end**, adopt a **"Default to Flagging"** posture: if **any** shot violates one of the **5 Universal Laws**, triggers any item on the **Blind Adversarial Critic Checklist**, or fails the **UI Craft Gates** in [styles/product-cinema.md](../styles/product-cinema.md), issue a **`BLOCK`** verdict until remediated.

---

## 1. The 5 Universal Laws

| # | Universal Law | Hard Pass Criteria | Immediate `BLOCK` Trigger |
| :-: | :--- | :--- | :--- |
| **L1** | **The 15-Second Stranger Test (Unmistakable Clarity)** | Complete 3-sentence story (`Hook → Proof → CTA`) reads unmistakably muted in one watch; Frame 0 is alive and establishes the world immediately; every beat directly serves this product's real proposition. | Confusing or vague story, blank/fade-from-black Frame 0, cutting into unrelated fake products or random vanity numbers (`40ms`, `10x`) just to hit a motion effect, or prose paragraphs that force reading instead of watching. |
| **L2** | **Zero Dev/QA Jargon, HUD Telemetry Chrome, or Corner Counters** | 100% viewer-facing, distraction-free, brand-authentic visuals and copy across every single rendered frame. | Any internal debug label, fake `97 SCORE` badge/ring, `const res = await` filler code, gate IDs, template placeholders, **AI-slop HUD/telemetry chrome** (uppercase monospace kickers like `— NE · 10 RELEASE`, dot-separated metadata captions like `NE · 10 · 7 / 7 RECEIPTS VERIFIED`, rounded glowing-dot pills like `• RECEIPT 03 / 07`, labeled percentage/voltage/progress bars), or **corner slide/step counters (`01 / 07`)** anywhere in the frame. |
| **L3** | **Anti-Template Originality, Varied Choreography & Physically Driven Loop** | Brand-authentic visual world derived from the real product, varied spatial choreography (zero consecutive repetitive transitions), `70%+` calm negative space, a **finale whose motion physically drives the lockup**, and a **seamless infinite loop bridge** back into Frame 0. | Recycled default brand costume, repetitive transitions, PowerPoint/"Magic Move" uniform centred box resizing, **static centered flexbox endings** (logo + tagline + URL pill stacked in a disconnected column), unbridged ending → Frame 0 loop seam, widget buffets, dangling wires, or abstract ink-blob/paper-cutout filler. |
| **L4** | **Frame-Clock Determinism + Verified Font Loading** | 100% driven by `useCurrentFrame()`, `interpolate()`, and `spring()`; clean `npx tsc --noEmit`; every display/body/mono webfont loaded deterministically via `@remotion/google-fonts` (or awaited `document.fonts.load`) and visually verified in stills and video. | Any `Math.random()`, `Date.now()`, `useFrame` delta drift, CSS `@keyframes`, CSS `transition`, TypeScript compiler error, or silent fallback to Times New Roman, Georgia, Arial, or system sans/serif on any rendered frame. |
| **L5** | **Matching Real Music + Procedural SFX Discipline** | Real, license-cleared background music matching the product's mood and tempo—beat-synced via [analyze-music.mjs](../scripts/analyze-music.mjs) with bar-aligned loop-clean fades—layered with crisp offline procedural DSP SFX ([generate-dsp-sfx.mjs](../scripts/generate-dsp-sfx.mjs)) and music ducking, mastered via [master-audio.mjs](../scripts/master-audio.mjs) to `-14.0 LUFS ± 1.5` (`truePeak <= -1.0 dBTP`). *(SFX-only allowed only when explicitly requested or awaiting a licensed track.)* | Any code-generated synth/chiptune music bed, mismatched/off-beat music, dry SFX-only cut delivered without attempting/prompting for matching real music, harsh raw sine-wave beeps, piercing treble chimes, audible loop-seam click, clipping (`> -1.0 dBTP`), or unmastered loudness (`< -18 LUFS` or `> -11 LUFS`). |

---

## 2. Blind Adversarial Critic Checklist (Pre-Export & End-to-End MP4 Rejection Gate)

Before approving any render, switch completely out of author mode into **Blind Adversarial Critic** mode:

1. **Inspect Stills Pre-Check AND Watch the Exported `.mp4` End-to-End**: Use `out/qa/contact-sheet.html` and rendered PNG stills only as a fast structural pre-check (fonts, cut boundaries, loop-seam frames). **ALWAYS watch/inspect the actual exported mastered `.mp4` end-to-end** (including looping from the final second back into Frame 0) without trusting `DIRECTION.md` intentions or code comments. Stills alone cannot reveal real pacing, mid-transition overlaps, easing feel, motion flow, or audio-visual beat sync.
2. **Apply the Rejection Checklist**: Immediately **`BLOCK`** the film if **ANY** single item below is visible or audible:

- [ ] **AI-Slop HUD / Telemetry Chrome**: Uppercase monospace kickers (`— NE · 10 RELEASE`, `// PHASE 02`), dot-separated metadata captions (`NE · 10 · 7 / 7 RECEIPTS VERIFIED`), rounded glowing-dot status pills (`• RECEIPT 03 / 07`, `• LIVE`), or labeled percentage/voltage/progress bars decorating the frame.
- [ ] **Corner Counter Distraction**: Any persistent or per-scene corner counter (`01 / 07`, `0001 / 0004`, `3/7`) sitting in the top-right or frame corners.
- [ ] **Static Centered Flexbox Ending & Landing-Page Stacks**: Any shot—especially the **finale**—that hard-cuts into a disconnected `flex-direction: column; align-items: center` stack (logo stacked over subtitle over URL pill) instead of letting the penultimate scene's spatial choreography physically drive, morph, or assemble the brand lockup.
- [ ] **Repetitive Transitions & Linear CSS Box Resizing ("Magic Move" Slop)**: Repeating the same transition mechanic consecutively across beats, or smoothly resizing centered boxes in place at one uniform medium speed instead of varied spatial camera choreography, portal match cuts, direct peels, and container morphs.
- [ ] **Unwatched `.mp4` / Motion-Flow & Overlap Defects**: Approving from static QA stills alone, OR letting the end-to-end `.mp4` exhibit sluggish/rushed pacing, mid-transition text/element overlaps, jerky velocity handoffs, or off-beat audio-visual cuts.
- [ ] **Broken Infinite Loop Seam**: Ending scene cuts harshly or jumps back into Frame 0 instead of physically bridging its geometry, polarity, camera state, and music tail seamlessly back into Frame 0.
- [ ] **Fallback System Typography**: Unloaded webfonts silently falling back to Times New Roman, Arial, or mismatched system fonts in DOM or SVG `<text>` nodes.
- [ ] **Recycled Brand Costume (Anti-Template Violation)**: Defaulting to Anthropic parchment/terracotta (`#F4F1EA` + `#D97757`), generic Swiss monochrome, or purple-blue SaaS gradients when the user's real product/brand has a different identity.
- [ ] **Generic AI Slop Tropes**: Chat bubbles typing 15-word sentences, sparkle icons (`✨`), blurred neon/radial glow orbs behind copy, gray skeleton-loader bars, fake `97 SCORE` radial rings, or wireframe CAD grid wallpaper.
- [ ] **Mobile Feed Failure & Macro Edge Clipping**: Unreadable sub-28px micro-copy, low-contrast text, clipped strokes/glyphs, macro focal objects exceeding `92%` viewport width (`elementW * macroZoom > 0.92 * W` unless intentional edge bleed), or essential visuals spilling outside `120px × 90px` safe margins.
- [ ] **Fade-to-Blank Peel Seams & DOM 3D Lag**: Fading an outgoing scene to blank solid color before a wipe/peel (always overlap and peel real pixels directly), or mounting `> 30` simultaneous `preserve-3d` DOM nodes that tank Studio playback FPS (use SVG `<clipPath>` masks for crisp geometric transitions or WebGL/Three `InstancedMesh` for dense 3D grids).

> **Zero-Tolerance Rule:** If **even ONE** checklist item triggers—in stills OR during end-to-end `.mp4` playback—the verdict is **`BLOCK`**. Fix the architectural root cause (never a cosmetic patch), re-run [scripts/qa-frames.mjs](../scripts/qa-frames.mjs), re-render, and watch the updated `.mp4` end-to-end until zero items trigger.

---

## 3. UI Craft Gates

After clearing Sections 1 and 2, verify all 10 UI-specific quantitative gates (`UI-1` through `UI-10`) in [styles/product-cinema.md](../styles/product-cinema.md).

---

## 4. Mandatory Audit Output Format (Findings Table + Verdict)

Format every pre-export review or self-improvement loop audit strictly as:

```markdown
| File / Shot | Frame Window | Law / Critic Check | Why It Fails Craft | Concrete Remediation |
| :--- | :---: | :---: | :--- | :--- |
| `Film.tsx` (Beat 2) | `f90–f180` | **Critic: Fade-to-Blank Peel** | Outgoing headline fades to blank solid color before the slat wipe begins | Overlap Beat 3 underneath Beat 2 and peel Beat 2's actual pixels via SVG `<clipPath>` |
| `Film.tsx` (Beat 1) | `f0–f60` | **L4 (Font Loading)** | Typography rendered in fallback Arial instead of the brand's display font | Load via `@remotion/google-fonts/<BrandFont>` and pass exact `fontFamily` token |

**Verdict:** `BLOCK` (issue `APPROVE` only when 0 Universal Law violations, 0 Blind Critic triggers, and 0 UI Craft Gate violations remain)
```
