# Objective Pass/Block Review Gates for X Launch Videos

Approval of a generated launch video must be **earned, never assumed**. Whenever auditing a composition or inspecting a rendered `.mp4` + `0.5s` contact sheet, adopt a **"Default to Flagging"** posture: if any shot violates one of the 10 quantifiable boundaries below, issue a **`BLOCK`** verdict until remediated.

---

## 1. The 5 Structural Architecture Principles

1. **Lean Router Entry Point + Scoped Reference Modules**: Keep `SKILL.md` focused strictly on workflow routing and global laws; load specialized guides (`benchmarks.md`, `review-gates.md`, `micro-interactions.md`, `sound-design-and-audio.md`) on demand.
2. **Creation Posture vs. Audit Posture**: Separate building the scene from grading it. During audit, treat every unmotivated animation, static hold, or text block as a defect.
3. **Quantified Physical Thresholds Over Subjective Adjectives**: Never judge motion as merely *"smooth"* or *"clean"*—verify exact numbers (entrance scale floor `>= 0.90`, micro-UI snap `<= 300ms`, zero holds `> 0.6s` with `< 1%` active pixels, `<= 4 words/beat`, `-14.0 LUFS ± 1.5`).
4. **Pinpointed Findings Table**: Every review must output a structured table mapping each defect to an exact file, frame/time window, violation category, and fix.
5. **Frame-Clock & Compositor Purity**: All motion must be a pure function of Remotion `useCurrentFrame()` and `fps`.

---

## 2. The 10 Non-Negotiable Pass/Block Standards

| # | Gate Category | Hard Pass Criteria | Immediate `BLOCK` Trigger |
| :-: | :--- | :--- | :--- |
| **G1** | **Frame-0 Presence & Hook Velocity (`0–3s`)** | Canvas is mid-action at `frame = 0` (`spatialContrast >= 0.11`, `hookActivePixels >= 12%`) with a single clear focal anchor. | Blank/faint Frame 0, fade-from-black opening, or 5-way scattered symmetric cards splitting foveal attention. |
| **G2** | **No Vacuum `scale(0)` Entrances** | UI cards, badges, and devices enter from `scale(0.90–0.96)` combined with opacity, Z-depth, or baseline masking. | Scaling an interface container from `0 → 1` out of thin air (`scale(0)` pop-in vacuum). |
| **G3** | **Entrance vs. Exit Easing Discipline** | Arrivals use responsive deceleration (`EASE_OUT_EXPO` or damped springs); `EASE_IN_EXPO` is used strictly for outgoing acceleration into a velocity match-cut. | Using `EASE_IN` on an arriving UI element (sluggish start where the viewer's eye is waiting). |
| **G4** | **Duration & Mass Proportionality** | Micro-UI interactions complete in `120–280ms`; spatial camera & 2.5D hardware moves settle in `420–680ms` (`getSpringForMass`). | Uniform spring constants across all hierarchy tiers, or sluggish `> 400ms` button/pill transitions. |
| **G5** | **Zero Dead-Frame Holds (`> 0.6s`)** | Every readability window maintains `>= 1%` active pixel delta via continuous 2.5D camera orbit, coupled glass sheen, or live widget motion. | Any contiguous span `> 0.6s` (`> 18 frames @ 30fps`) with `< 1%` active pixel change. |
| **G6** | **Visual-First Craft (Zero Skeleton or Chat-Bubble Slop)** | Capabilities are demonstrated via tactile visual widgets, rich illustrations, shader orbs, liquid glass, or real multi-token syntax diffs. | Gray skeleton loader bars (`AbstractCodeBars`), fake chat-bubble prompt boxes typing long sentences, or raw LLM stick-figure SVG drawings. |
| **G7** | **Copy Restraint (`<= 4 Words/Beat`)** | Every kinetic headline or typographic beat contains `1–4 words max`, letting visual choreography carry 90%+ of explanation. | Any beat exceeding `4 words`, multi-line explanatory side paragraphs, or dense 15-row schedule tables. |
| **G8** | **Scale & Polarity Dynamic Range** | Adjacent shots shift camera scale (`>= 1.4×`) or 2.5D perspective angle (`>= 20°`), with timeline luminance range `>= 0.45`. | 4+ consecutive shots at identical flat `1.0×` zoom and identical background luminance (`luminanceRange < 0.15`). |
| **G9** | **Frame-Clock & Determinism Purity** | 100% driven by `useCurrentFrame()`, `interpolate()`, and `spring()`. Clean `tsc --noEmit` build. | Any `Math.random()`, `Date.now()`, CSS `transition`, CSS `@keyframes`, or TypeScript compiler error. |
| **G10** | **Beat-Cut Sync & Broadcast Loudness (`-14 LUFS`)** | Visual velocity peaks lock within `±2 frames` of the BPM beat grid; integrated loudness is `-14.0 LUFS ± 1.5` (`truePeak <= -1.0 dBTP`). | Unmastered audio (`< -18 LUFS` or `> -11 LUFS`), raw sine-wave beeps, or cuts drifting off the beat grid. |

---

## 3. Mandatory Audit Output Format (Findings Table + Verdict)

When running a pre-export review or diagnosing a render in the self-improvement loop, format findings as:

```markdown
| File / Shot | Frame Window | Gate Violated | Why It Fails Craft | Concrete Remediation |
| :--- | :---: | :---: | :--- | :--- |
| `Comp.tsx` (Shot 2) | `f106–f164` | **G5 (Dead Hold)** | `< 1%` pixel delta for `1.93s` while card sits static | Wrap stage in `<LivingPerspectiveWorkstation />` with coupled specular sheen |
| `Comp.tsx` (Shot 1) | `f0–f84` | **G7 (Copy Restraint)** | 9-word headline forces reading instead of watching | Compress via `enforceBeatCopyRestraint` to `"Branch Postgres live."` (3 words) |

**Verdict:** `BLOCK` (or `APPROVE` only when 0 blocking violations remain and Total Score >= 95/100)
```
