# Pacing, Beat-Grid Architecture & Pro Transitions

On X (Twitter), **pacing is retention**. A 30-second video made of 4 static slides crossfading into each other feels like a PowerPoint deck and loses viewers by second 4. Agency-grade launch videos use **8–14 purposeful visual beats** locked to a musical grid, alternating brisk pattern interrupts (`0.6–1.2s`) with calm focal holds (`1.8–2.6s`).

---

## 1. The FPS-Agnostic BPM Beat-Grid System

Even for muted playback, cutting on a consistent rhythmic pulse makes motion feel subconsciously cohesive—and makes syncing procedural SFX and music trivial. Always use `createBeatGrid(bpm, fps)` and `sec(seconds, fps)` from [templates/motion.ts](../templates/motion.ts) so `24p`, `30p`, and `60p` stay temporally identical:

```ts
export const sec = (seconds: number, fps: number): number => Math.round(seconds * fps);

export const createBeatGrid = (bpm: number, fps: number) => {
  const framesPerBeat = (60 / bpm) * fps;
  return {
    framesPerBeat,
    beat: (n: number) => Math.round(n * framesPerBeat),
    bar: (n: number) => Math.round(n * 4 * framesPerBeat),
    dur: (beats: number) => Math.max(1, Math.round(beats * framesPerBeat)),
  };
};
```

### Pacing Cadence Rule: **Fast – Hold – Fast**
- **Never hold a static screen longer than `2.5s`** without a purposeful camera move, state change, cursor action, or rhythmic cut.
- **Never stack 5+ rapid cuts without a focal hold**—viewers on mobile X need `1.5–2.2s` to read a real product interaction.
- **Frame 0 is already alive**: At `frame = 0`, typography is mid-arrival (`progress >= 0.35`) or the product visual is cleanly framed. Never fade up from black.

---

## 2. Proven Multi-Shot Blueprints (15s – 45s)

### Blueprint A: Editorial SaaS Launch (`24s` / `48 beats @ 120 BPM`)
| Shot | Beats | Duration | Visual & Compositional Shift | Transition Out |
| :--- | :--- | :--- | :--- | :--- |
| **1. Hook** | `0 → 5` | `2.5s` | Full-bleed gallery light, two-tone editorial headline + italic serif word | Beat-locked hard cut |
| **2. Product Reveal** | `5 → 12` | `3.5s` | Orthogonal workspace window; natural-cadence prompt + `@` chip | Continuous (same stage) |
| **3. Macro Action** | `12 → 20` | `4.0s` | **Camera Rig pushes in (`1.0 → 1.75×`)**; Bézier cursor glides & clicks trigger | Continuous pull-out |
| **4. System Payoff** | `20 → 26` | `3.0s` | Camera pulls back (`1.75 → 1.0×`) revealing live generated multi-card result | Anchor theme-flip |
| **5. Dark Chapter** | `26 → 36` | `5.0s` | **Palette inverts to `#09090B`**; tabular proof metric + 3 crisp staggered rows | Beat-locked hard cut |
| **6. Statement Reset** | `36 → 40` | `2.0s` | Full-bleed light punchline statement with inline visual reflow pop | Hard cut |
| **7. Brand Lockup CTA** | `40 → 48` | `4.0s` | Centered mark + 1-line positioning + high-contrast URL pill (calm hold) | Clean loop back to frame 0 |

### Blueprint B: Precision DevTool Feature Drop (`18s` / `36–38 beats @ 125 BPM`)
| Shot | Beats | Duration | Visual & Compositional Shift | Transition Out |
| :--- | :--- | :--- | :--- | :--- |
| **1. Tension Hook** | `0 → 4` | `1.9s` | Obsidian canvas, tight 4-word claim + version badge | Hard beat-cut |
| **2. `⌘K` Trigger** | `4 → 12` | `3.8s` | Command palette centered; realistic typing + execution trigger | Continuous zoom |
| **3. Macro Execution** | `12 → 20` | `3.8s` | Camera zooms into live step progress / code diff resolving | `clip-path` wipe |
| **4. Impact Metric** | `20 → 27` | `3.4s` | Oversized `tabular-nums` stat (`4.6 hrs`, `< 40ms`) + crisp 1-line proof | Hard beat-cut |
| **5. CTA Lockup** | `27 → 37` | `4.8s` | Minimal wordmark + command/URL pill | Clean hold |

### Blueprint C: Physical Hardware / 3D Product Reveal (`16s–24s`)
| Shot | Beats | Duration | Visual & Compositional Shift | Transition Out |
| :--- | :--- | :--- | :--- | :--- |
| **1. Silhouette Hook** | `0 → 5` | `2.5s` | Gallery cyclorama, product framed on right third, editorial two-tone hook left | Smooth rig glide |
| **2. Centered Reveal** | `5 → 11` | `3.0s` | Product glides to hero showcase; specs line reveals cleanly | Continuous macro push |
| **3. Macro Detail** | `11 → 19` | `4.0s` | Camera pushes `1.85–2.2×` onto key mechanical detail + `1px` SVG leader line | Pull-out + theme-flip |
| **4. Dark Tech Proof** | `19 → 29` | `5.0s` | Studio shifts to obsidian + rim light; hardware architecture + spec bar | Theme-flip to light |
| **5. Studio Lockup** | `29 → 38` | `4.5s` | Clean light cyclorama, brand mark + pre-order URL | Calm hold |

### Blueprint D: Kinetic Studio Showcase (`24s` / `53 beats @ 132 BPM` — Archetype 1)
| Shot | Beats | Duration | Visual & Compositional Shift | Transition Out |
| :--- | :--- | :--- | :--- | :--- |
| **1. Caret + Orbital Burst** | `0 → 6` | `2.7s` | Pure `#FFFFFF`, caret wordmark dead-center + radial burst of brand-framed tool cards | Snap implosion to caret |
| **2. Prompt → Pill → Wipe** | `6 → 15` | `4.1s` | Bare text morphs into rounded pill → types prompt → brand executing halo → live split-wipe node | Directional horizontal whip-pan |
| **3. Accelerating Slot Drum** | `15 → 24` | `4.1s` | Split-screen (`33%` preview / `67%` vertical label drum): 3 readable detents → vertical speed-blur ramp | Vertical speed whip-out |
| **4. Live Cursor Slider + Chain** | `24 → 33` | `4.1s` | Tactile cursor scrubs `"Live"` forward & back → horizontal whip-pan into 3-node daisy-chain | Chromatic gradient swipe |
| **5. Wired Node Dataflow** | `33 → 40` | `3.2s` | Moody brand color-block chapter; `Input Node → Bezier Wire + Signal Pulse → Synced Output` | Hard beat-cut to white |
| **6. 2D Canvas Glide → Match-Cut** | `40 → 47` | `3.2s` | 2 velocity camera hops across node grid → focal lock onto hero node → peak-velocity scale-through CTA | Geometric iris wipe |
| **7. Brand Mark + URL Caret** | `47 → 53` | `2.7s` | Centered vector emblem (`1.0s` hold) → caret-typed URL calm hold | Clean loop |

### Blueprint E: Editorial Brand Punch (`28s` / `54 beats @ 116 BPM` — Archetype 2)
| Shot | Beats | Duration | Visual & Compositional Shift | Transition Out |
| :--- | :--- | :--- | :--- | :--- |
| **1. Serif Hook + Collage** | `0 → 5` | `2.6s` | Pure `#FFFFFF` Display Serif title (`1.1s`) → depth-layered identity collage burst (`1.3s`) | Snap collapse to chat bar |
| **2. Macro Prompt + Strobe** | `5 → 14` | `4.6s` | Wide chat bar → **hard-cut `3.2×` macro typing** → submit click → MCP shimmer → **3 full-bleed retrieval strobes + live counter HUD** | Clean snap to result shelf |
| **3. Card → Chip Dock** | `14 → 22` | `4.1s` | 5-card MCP result row → cursor hovers & picks hero card → card morphs & **docks inside prompt box as inline chip** | Focus settle to center |
| **4. Z-Scatter + Dark Inversion** | `22 → 37` | `7.8s` | Radial moodboard → **3D Z-Scatter blast-swap** into dark technical cluster → **locked-center Light→Dark inversion** | Hard-cut macro click |
| **5. Macro Click + Singularity** | `37 → 44` | `3.6s` | **`3.5×` close-up submit click** → dark cards morph into **glowing orbs swirling into radiant singularity bloom** → `#FFFFFF` | Pure white reveal |
| **6. Inline Logo-Slot Finale** | `44 → 54` | `6.8s` | Editorial Serif thesis cycling locked-baseline inline `AI → OpenAI → Claude → Cursor` (`3.5s`) → Serif Wordmark + URL (`3.3s` hold) | Clean loop |

### Blueprint F: Chat-to-Cinema / Agentic Demo (`28s` / `56 beats @ 120 BPM` — Archetype 3)
| Shot | Beats | Duration | Visual & Compositional Shift | Transition Out |
| :--- | :--- | :--- | :--- | :--- |
| **1. Hook + Legacy Replacement Dock** | `0 → 12` | `6.0s` | Frame-0 bold kinetic hook → rack-focused plate + whipped legacy icons (`Pr → Ae → FCP → DaVinci → Hero`) snapping center | Hero emblem dark iris wipe |
| **2. Style-Chip Prompt → Execution Tree** | `12 → 28` | `8.0s` | Style-chip prompt bar → `2.2×` macro typing & click → prompt docks top-right while 5-step vertical MCP tree draws & completes every step (`Ready · 0:30`) | Beat-locked hard cut |
| **3. Meta Timeline Assembly Reveal** | `28 → 42` | `7.0s` | Dark studio frame: multi-track timeline (`Video · Motion · VO · Audio`) snaps clips under live playhead while preview genuinely animates 1:1 | Architectural `clip-path` wipe |
| **4. Multiplayer Cursor Swarm → Lockup** | `42 → 56` | `7.0s` | Pure `#FFFFFF`: two-tone thesis with caret type-over orbited by 4 agent cursors → `0.35s` convergence into mark→wordmark reflow + `2.8s` CTA hold | Clean loop |

### Blueprint G: Creative Ad Canvas (`42s` / `~90 beats @ 128 BPM` — Archetype 4, `hera-ad-canvas`)
Built for mid-length commercial showcases that sustain retention across 40–45s using a **4-cycle Dark ↔ Light heartbeat** (`~54%` dark editorial/ad showcases + `~46%` light `#F6F6F5` dot-grid tool demos; cuts locked to `0.25s / 0.50s` grid):

| Shot | Time | Duration | Surface Mode | Visual & Compositional Shift | Transition Out |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Frame-0 Mark Bloom + Z-Depth Ad Cloud** | `00.0–04.5s` | `4.5s` | Dark Stage | Alive at `frame = 0` (no black intro!): brand mark shifts into wordmark (`1.5s`) → kinetic hook + 20+ blurred-to-sharp multi-aspect ads rushing through Z-depth (`3.0s`) | Beat-locked hard cut |
| **2. Rapid Ad Cascade + Interstitial #1** | `04.5–08.5s` | `4.0s` | Dark Stage | `0.25–0.35s` rhythmic cascade of `16:9` / `1:1` / `4:5` / `9:16` finished ads (`2.0s`) → sweeping accent highlight thesis `"Run multiple AI agents / on one canvas"` (`2.0s`) | Crisp hard cut to dot-grid |
| **3. Parallel Prompt Stack → Freeform Canvas** | `08.5–15.2s` | `6.7s` | `#F6F6F5` Dot-Grid | 3 stacked prompt cards type concurrently → camera pulls back as 3 dark-pill agent cursors fan out & spawn mixed-aspect artboards with localized radial dot-grid ripples (zero node wires) | Hard cut to dark reset |
| **4. Interstitial #2 → URL-to-Brand-Kit Bloom** | `15.2–20.2s` | `5.0s` | Dark (`1.25s`) → Dot-Grid (`3.75s`) | `"Knows your brand"` dark reset → centered URL prompt submits & radiates **4 Brand Kit artboards** (`Logo · Colors · Type · Starter Set`) into the 4 quadrants with `1.2s` cognitive hold | Hard cut to dark showcase |
| **5. Midpoint Multi-Angle Ad Wall** | `20.2–24.0s` | `3.8s` | Dark Showcase | Beats the `0:22` retention dip: centered thesis hovers over live lifestyle/UGC ads panning & multiplying outward across rows | Tight `1.0s` dark interstitial |
| **6. Interstitial #3 → In-Place Reference Transmutation** | `24.0–28.5s` | `4.5s` | Dark (`1.0s`) → Dot-Grid (`3.5s`) | `"Use any ad as a reference"` → 3 competitor reference ads fan onto dot-grid → cursor tap → staggered brand shimmer transmutes all 3 **in-place** preserving 1:1 layout skeletons | Hard cut to dark reset |
| **7. Interstitial #4 → Static-to-Motion Side-by-Side** | `28.5–34.5s` | `6.0s` | Dark (`1.25s`) → Dot-Grid (`4.75s`) | `"Create static and motion ads"` → static `4:5` source left + docked `Animation` prompt bar spawns glowing companion artboard right playing live kinetic type + hero product motion | `<SpatialCameraRig>` zoom into full-bleed ad |
| **8. Canvas Panorama Masonry Sweep** | `34.5–37.2s` | `2.7s` | Dark Climax Wall | Seamless full-bleed ad payoff → edge-to-edge masonry wall of `15+` multi-aspect finished ads pulsing on `0.25s` beat cadence | Beat-locked hard cut |
| **9. Brand Lockup + CTA URL Hold** | `37.2–42.0s` | `4.8s` | Dark Stage | Mark→wordmark lockup snaps in `<= 0.9s` + **calm `2.8–3.2s` CTA URL hold** (replaces empty fade-to-black tail) | Clean loop back to Frame 0 |

### Blueprint H: Kinetic Type Manifesto & Architectural Archive (`22s` / `44 beats @ 120 BPM` — `architectural-archive`)
Proves you can hold X retention for 20–25s **without leaning on chat bars or fake dashboards** — built from stark kinetic typography slates, `<ViewfinderFrame />` real media/UI captures, hairline spec tables, and `<RollingOdometer />` proof:

| Shot | Beats | Duration | Visual & Compositional Shift | Transition Out |
| :--- | :--- | :--- | :--- | :--- |
| **1. Stark Kinetic Type Slate** | `0 → 6` | `3.0s` | `#FAFAFA` hairline architectural grid with `+` intersection crosshairs; huge concrete 4–6 word claim (`>= 108px`, alive at frame 0) | Beat-locked hard cut |
| **2. `<ViewfinderFrame>` Product Proof** | `6 → 16` | `5.0s` | Centered `0px`-corner `<ViewfinderFrame indexLabel="0001 / 0004">` framing real `<OffthreadVideo>` / crisp UI with `<SpatialCameraRig>` macro push (`1.0 → 1.75×`) | Architectural `clip-path` wipe |
| **3. Hairline Spec / Comparison Rows** | `16 → 24` | `4.0s` | Full-bleed hairline-separated uppercase mono key/value rows snapping in at `0.04s` stagger (`CATEGORY`, `SPEED`, `WORKFLOW`) + live `<RollingOdometer />` hero number | Anchor Light→Dark inversion |
| **4. Dark Chapter Tactile Proof** | `24 → 34` | `5.0s` | Pure `#09090B` Zinc inversion: real device / flat-lay or second focal `<ViewfinderFrame>` interaction proving end-to-end payoff | Beat-locked hard cut to light |
| **5. Index Lockup & CTA Hold** | `34 → 44` | `5.0s` | `#FAFAFA` grid canvas: rolling index finishes (`0004 / 0004`), razor wordmark + 1-line concrete promise + sharp `0px` high-contrast URL bar (`2.8s` calm hold) | Clean loop back to Frame 0 |

---

## 3. Pro Transition Recipes (100% FPS-Agnostic — Zero Muddy Crossfades)

Stop using generic opacity crossfades on every cut. All frame math below scales cleanly across `24p`, `30p`, and `60p` via `sec(seconds, fps)`:

### A. Beat-Locked Hard Cut (Default between distinct shots)
Zero opacity overlap. Render Shot A for `frame < cutFrame` and Shot B for `frame >= cutFrame`, paired with a brisk `0.25–0.35s` `EASE_OUT_EXPO` arrival on Shot B.

```tsx
{frame < cutFrame && <ShotA frame={frame} />}
{frame >= cutFrame && <ShotB frame={frame - cutFrame} />}
```

### B. Velocity-Matched Zoom-Through (High-Energy Handoff)
Accelerate outgoing shot (`EASE_IN_EXPO`) and decelerate incoming shot (`EASE_OUT_EXPO`) across a **0-frame splice**:

```ts
const outLead = sec(0.33, fps);
const inTail = sec(0.47, fps);

const zoomOutExit = interpolate(frame, [cutFrame - outLead, cutFrame], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: EASE_IN_EXPO,
});
const outScale = 1 + zoomOutExit * 0.24;

const zoomInEnter = interpolate(frame, [cutFrame, cutFrame + inTail], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: EASE_OUT_EXPO,
});
const inScale = 0.88 + zoomInEnter * 0.12;
```

### C. Anchor Theme-Flip (Light ↔ Dark Chapter Inversion)
Keep the focal card, hardware, or emblem anchored while inverting canvas & ink with `interpolateColors`:

```ts
const darkProgress = interpolate(
  frame,
  [flipFrame - sec(0.2, fps), flipFrame + sec(0.4, fps)],
  [0, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT_QUINT }
);
const bgColor = interpolateColors(darkProgress, [0, 1], ["#F7F7F5", "#09090B"]);
const inkColor = interpolateColors(darkProgress, [0, 1], ["#0A0A0A", "#FAFAFA"]);
```

### D. Architectural `clip-path` Curtain Wipe
```ts
const wipe = interpolate(frame, [wipeStart, wipeStart + sec(0.53, fps)], [100, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: EASE_IN_OUT_QUINT,
});
// style={{ clipPath: `inset(0 0 ${wipe}% 0)` }}
```

### E. Inline Media Reflow Reveal
Pop a rounded thumbnail or mark directly inline between headline words (`width: 0 → 128px`) so surrounding words glide apart naturally:

```tsx
const pop = spring({
  frame: Math.max(0, localFrame - sec(0.45, fps)),
  fps,
  config: SPRING_EDITORIAL,
});
```

### F. True Directional Whip-Pan Blur (`0.13–0.17s` Velocity Handoff)
Pair lateral translation with `<DirectionalMotionBlur blurX={...} blurY={0}>` (never isotropic CSS blur!) so motion streaks cleanly along the pan axis and drops to `0` at rest:

```tsx
const whipOut = interpolate(frame, [cutFrame - sec(0.14, fps), cutFrame], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: EASE_IN_EXPO,
});
const whipIn = interpolate(frame, [cutFrame, cutFrame + sec(0.17, fps)], [1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: EASE_OUT_EXPO,
});
// Outgoing: <DirectionalMotionBlur blurX={whipOut * 14} blurY={0}> with translate3d(${-whipOut * 340}px, 0, 0)
// Incoming: <DirectionalMotionBlur blurX={whipIn * 14} blurY={0}>  with translate3d(${whipIn * 340}px, 0, 0)
```

### G. Chromatic Pattern Interrupt Swipe (`0.35–0.50s`)
When 70%+ of your film is gallery white, a crisp full-bleed brand-color swipe resets attention around the `55–65%` mark—swap scenes at `swipeX === 0` (100% opaque coverage):

```ts
const half = sec(0.22, fps);
const swipeX = interpolate(frame, [cutFrame - half, cutFrame, cutFrame + half], [105, 0, -105], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: EASE_IN_OUT_QUINT,
});
```

### H. Peak-Velocity Scale-Through Match-Cut
Accelerate a framed UI control or card outward using `EASE_IN_EXPO` (`scale: 1 → 4.5`) with the camera pivot pinned to the element's exact `(wx, wy)` center (keep `opacity: 1`—never fade to washed-out gray before the cut). Catch the incoming scene's matching element at `incomingZoom = computePortalCatchZoom(sourceW, sourceZoom, targetW)` centered on its own `(wx, wy)`, then decelerate cleanly to `1.0×` with `EASE_OUT_EXPO`.

### I. Direct Overlapping SVG `<clipPath>` Peel (Zero Fade-to-Blank Seam)
Never fade an outgoing scene's content to a blank solid color before running a curtain or slat wipe—that reads like two disconnected scenes. Instead, mount the incoming `<Sequence>` **underneath** the outgoing `<Sequence>` for the `12–20f` transition window, keep the outgoing scene 100% solid, and peel its actual pixels away with a single GPU-light SVG `<clipPath>` (e.g., `6–8` staggered `<rect>` slats retracting with `EASE_IN_OUT_QUINT`, with optional leading edge lines when the brand's aesthetic calls for crisp architectural seams). When exiting copy ahead of a hard cut or container dock, finish outgoing copy fades **`10–15f` before the cut** so zero ghosted text lingers on the `cut - 1` splice frame.

### J. Zero-Seam Infinite Loop Contract (X Auto-Replay)
When designing a seamless loop from Finale → Frame 0:
1. Export one shared geometry constant (positions, dimensions, border-radii, zoom) used by both the Finale's end state and Frame 0.
2. Morph Finale elements into Frame 0's exact state over the final `0.8–1.0s` while resetting any background/cyclorama pan back to `(0, 0)`.
3. Open Frame 0 already landed in that exact state and immediately trigger a staggered pulse or motion impulse (`f2+`) so the loop seam is invisible.
