# Fuser — Tool Node: Principal Motion Design Breakdown

> **Source Video:** `Fuser — Tool Node` (`@fuserstudio`, Nov 2026) *(reference video excluded from public repo)*
> **Technical Specs:** `1920×1080` (16:9) · **Native `24 fps`** (`1,447` frames, `60.29s` video / `60.31s` audio) · Stereo AAC 48 kHz
> **Audit Data:** [Raw Cut & Audio Manifest](./audit-manifest.json)

---

## Executive Motion Thesis

Why does **Fuser — Tool Node** feel unmistakably editorial and high-craft compared to generic SaaS launch videos? Three deliberate architectural choices carry the entire 60-second edit:

1. **Native 24 fps Cinema Cadence + Directional Motion Blur:** Instead of clinical 60 fps screen recordings, Fuser renders at **24 fps** (`41.7 ms/frame`) and pairs hyper-snappy `3–5 frame` (`125–210 ms`) transitions with **velocity-proportional directional blur**. The eye reads the speed as physical camera momentum rather than CSS sliding.
2. **Gallery White Negative Space as Rhythm Control:** Nearly 70% of the canvas stays pure gallery white (`#FFFFFF`) with ultra-minimal charcoal micro-typography (`18–24px` centered). Dense, high-energy visual clusters never collide back-to-back without either a **white micro-breath** (`0.6–1.2s`) or a **chromatic pattern interrupt** (`00:36.08` gradient swipe, `00:43.62` burgundy audio chapter).
3. **Locked Foveal Anchor (`50%, 50%`):** Across **43 detected cuts**, the hero focal object (typing caret → prompt pill → pink-bordered Tool Node → centered eye-tracker crop → wired output) stays anchored at screen center or follows an explicit left-to-right causality vector (`Control → Wire → Output`). The viewer's eye *never* hunts.

---

## 1. Shot-by-Shot Timeline Table

> *Note:* Source runs at **24 fps native**. Durations below show seconds, native `24p` frame counts, and `60p`-equivalent frame counts (`×2.5`) for direct translation into 60 fps web/Remotion timelines.

| # | Timestamp | Duration (s / 24p / 60p) | Shot Type | Primary Motion Technique | Purpose in the Narrative |
|---|---|---|---|---|---|
| **01** | `00:00.00 – 00:00.71` | `0.71s` / `17f` / `43f` | Minimalist Title Card | Caret-typed micro-headline (`INTRODUCING\|`) on pure white | Immediate frame-0 scroll-stop; establishes the editorial typing motif. |
| **02** | `00:00.71 – 00:01.25` | `0.54s` / `13f` / `32f` | Hero Wordmark Reveal | Scale-in + subtle defocus-to-sharp settle on `"Tools"` | Anchors the core product noun dead-center before visual complexity enters. |
| **03** | `00:01.25 – 00:02.92` | `1.67s` / `40f` / `100f` | Radial Orbital Gallery | Staggered radial burst of 12+ Tool Node cards orbiting `"Tools"` (`0.75s` burst, `0.92s` float hold) | Instant breadth proof: "not one tool—an entire creative ecosystem." |
| **04** | `00:02.92 – 00:03.46` | `0.54s` / `13f` / `32f` | Radial Implosion | High-velocity snap-out collapse of cards back off-frame; `"Tools"` holds `0.3s` then hard-clears to caret `\|` | Clears visual memory cleanly before introducing the interaction model. |
| **05** | `00:03.46 – 00:04.96` | `1.50s` / `36f` / `90f` | Editorial Thesis Beat | Fast cadence typing (`"Want it? Prompt it."`) + `~1.0s` readability hold | States the core value proposition in 4 words. |
| **06** | `00:04.96 – 00:06.67` | `1.71s` / `41f` / `103f` | UI Prompt-to-Pill Morph | Text container morphs into rounded pill (`Want it\|` → clears → types `Remove background`) → spinner + pink radial execution halo → upward lift blur | Bridges abstract promise ("Prompt it") to concrete UI mechanics. |
| **07** | `00:06.67 – 00:09.17` | `2.50s` / `60f` / `150f` | Single-Node UI Demo | Centered pink-framed node (`Subject Masking`); `1.0s` "Before" hold → `0.55s` left-to-right interactive split-wipe removing cobalt backdrop → `0.85s` live playback hold | Delivers the first "magic moment" with undeniable before/after clarity. |
| **08** | `00:09.17 – 00:09.96` | `0.79s` / `19f` / `47f` | Whip-Pan → Prompt Pill | 3-frame horizontal directional blur exits node; new pill types `"Join clips into one video"` + pink glow | Establishes horizontal whip-pan as the "next tool" spatial grammar. |
| **09** | `00:09.96 – 00:11.54` | `1.58s` / `38f` / `95f` | Multi-Clip Convergence | 4 video clips whip-pan in horizontally (`0.4s`) → hold (`0.5s`) → collapse inward/downward with vertical blur into 1 unified node + 4-thumb timeline strip | Visually explains multi-input merging without a single word of explanation. |
| **10** | `00:11.54 – 00:14.04` | `2.50s` / `60f` / `150f` | Live Output Proof | Centered `Join Videos` node plays 4 rapid stitched cuts (`~0.6s` each) synced with active bottom strip → directional blur exit | Proves real output fidelity—not a static mockup. |
| **11** | `00:14.04 – 00:16.38` | `2.34s` / `56f` / `140f` | Two-Beat Chapter Breath | Pure white canvas: `"Create once\|"` (`0.8s`) → caret reset → `"Use forever.\|"` (`1.2s`) | Lowers cognitive load; tees up reusability before the rapid-fire montage. |
| **12** | `00:16.38 – 00:22.25` | `5.87s` / `141f` / `352f` | Split-Screen Vertical Drum | Left (`33%`): pink-framed preview node; Right (`68%`): 3-row vertical typography slot drum (`GIF Converter` → `Grid Crop` → `Contact Sheet` → `Extract Color Palette`) accelerating exponentially through 6+ more tools with progressive vertical motion blur | Escalates pacing and demonstrates tool variety via mechanical slot-machine momentum. |
| **13** | `00:22.25 – 00:23.54` | `1.29s` / `31f` / `77f` | Audio Drop Kinetic Beat | **133 BPM beat drop (`22.42s`)**: hard single-word cuts on beat — `"Tweak"` (`0.55s`) → `"Tools"` (`0.50s`) → `"L..."` | Shifts the film from Act 1 (creation) into Act 2 (real-time tactile control). |
| **14** | `00:23.54 – 00:25.50` | `1.96s` / `47f` / `118f` | Direct-Manipulation Type | Orange cursor drags horizontal slider thumb right & left; `"Live"` display word scales `1.0× → 2.1× → 1.0×` in exact 1:1 sync | Teaches the viewer the slider visual metaphor in isolation before applying it to imagery. |
| **15** | `00:25.50 – 00:27.42` | `1.92s` / `46f` / `115f` | Live Shader Node Close-Up | Horizontal whip-pan into Risograph portrait node; cursor scrubs `Zoom` slider right with real-time image zoom & halftone response | Transfers the `"Live"` slider feel directly onto real creative output. |
| **16** | `00:27.42 – 00:30.96` | `3.54s` / `85f` / `212f` | Daisy-Chain Node Expansion | Single node scales down & shifts left while 2 sibling shader nodes (`Risograph`, `Line Hatch`, `Halftone`) spring out beside it; live sliders scrub across all 3 simultaneously → whip-pan exit | Demonstrates non-destructive chaining & live multi-variation exploration. |
| **17** | `00:30.96 – 00:32.67` | `1.71s` / `41f` / `103f` | Chapter Breath | Clean white canvas: `"Craft your signature look\|"` (`1.2s` hold) | Resets cadence before the highest-velocity 3D sequence. |
| **18** | `00:32.67 – 00:36.08` | `3.41s` / `82f` / `205f` | 3D Cover-Flow Carousel | Centered hero card (`Track & Cutout`) fans out into a 3D Y-axis rotated deck (`Pixel Stretch`, `Riso Crops`, `Slit-Scan`, `Halftone`, `Mosaic`); beat-locked rapid flips accelerating into full horizontal speed-blur | Adds true Z-depth dimensionality and high-fashion visual energy. |
| **19** | `00:36.08 – 00:36.33` | `0.25s` / `6f` / `15f` | Chromatic Pattern Interrupt | Full-bleed magenta-to-violet diagonal gradient flash/swipe | Hard visual palate cleanser separating Stylistic Tools from AI Smart Tools. |
| **20** | `00:36.33 – 00:38.67` | `2.34s` / `56f` / `140f` | Chapter Intro + Smart Pill | `"Smart tools\|"` (`1.0s`) → prompt pill with inline avatar thumbnail + `"Eye tracker 👀"` → spinner + pink execution glow | Reuses the Act 1 prompt-pill grammar so the viewer reads it effortlessly. |
| **21** | `00:38.67 – 00:41.75` | `3.08s` / `74f` / `185f` | Selective DOF Focus Frame | Full-bleed blurred portrait background; centered sharp pink-bordered `Eye Detection` node displays live pink tracking overlays across 3 beat-synced portrait swaps (`1.1s`, `0.8s`, `1.1s`) | Brilliant spatial framing: isolates AI tracking precision while keeping rich visual atmosphere. |
| **22** | `00:41.75 – 00:43.62` | `1.87s` / `45f` / `112f` | Dual-Node Wire Dataflow | Blurred dark backdrop; 2 pink-framed portrait nodes connected by crisp horizontal wire (`Input → Subtitles`) showing synced word-by-word captions (`"the tool you keep wishing would build"`) | Introduces explicit node-to-node wiring (`Input → Output`) on a familiar video task. |
| **23** | `00:43.62 – 00:45.00` | `1.38s` / `33f` / `83f` | Burgundy Audio Pipeline | Whip-pan onto moody maroon `#7D454B` background: live pulsing `Audio Waveform` pill wired directly into a synced `Lyrics` card (`"Wake me up inside..."`) | Chromatic contrast + multi-modal proof (not just images/video—audio too). |
| **24** | `00:45.00 – 00:47.42` | `2.42s` / `58f` / `145f` | Three-Beat Escalation | White canvas rapid cadence: `"Save your tools\|"` (`0.6s`) → `"Reuse your tools\|"` (`0.9s`) → `"Share your tools\|"` (`0.75s`) | Builds rhythmic anticipation for the full-canvas reveal. |
| **25** | `00:47.42 – 00:51.46` | `4.04s` / `97f` / `242f` | Infinite 2D Canvas Camera Glide | 3 energetic diagonal whip-pan hops across a dense living grid of 20+ Tool Nodes (`Color Pop`, `Motion Track`, `Contact Sheet`, etc.), decelerating and zooming dead-center onto `Kinetic Type` | Macro "zoom-out" payoff showing the infinite canvas workspace, then funneling smoothly into the finale hero. |
| **26** | `00:51.46 – 00:54.38` | `2.92s` / `70f` / `175f` | Control → Wired Output Demo | `Kinetic Type` flips to white control panel (`Make tools.`, `Weight`, `Wave`, `Palette`); camera pans right revealing wired pink/black output card rippling live as cursor scrubs `Wave` | Synthesizes every prior concept (typing + slider + wiring + live shader) into one climactic interaction. |
| **27** | `00:54.38 – 00:57.29` | `2.91s` / `70f` / `175f` | Scale-Through Match-Cut Climax | Output card punches full-bleed 16:9 (`MAKE TOOLS` undulating on beat) → transitions seamlessly into crisp high-contrast black-on-white lockup `"GO MAKE YOUR OWN TOOLS"` (`1.45s` hold) | High-energy call-to-action climax earned by literally *using* the product's own tool to render the title card. |
| **28** | `00:57.29 – 01:00.29` | `3.00s` / `72f` / `180f` | Geometric Brand Wipe & URL | `10f` lavender/black expanding circle iris wipe → centered crisp Fuser puzzle-node icon (`1.0s` hold) → types `"fuser.studio/tools\|"` (`1.4s` end hold) | Clean, memorable brand signature bookending the opening caret motif. |

---

## 2. Animation Styles Taxonomy

### 1. Radial Orbital Burst & Snap-Collapse (`00:01.25 – 00:03.46`)
- **Mechanics:** 12+ rectangular UI cards radiate outward from behind a centered anchor word (`"Tools"`) along polar vectors with slight stagger (`1–2f` per card), decelerate into a gentle ambient hold, then collapse inward at ~2× exit velocity.
- **Why It Works:** Keeps the center safe zone 100% uncluttered so the headline stays legible while peripheral vision absorbs sheer breadth of capability.
- **Where It Fails If Overused:** Repeating radial bursts turns a product film into a noisy confetti screen; without a rock-solid center anchor, the eye fractures across 12 targets and reads zero of them.
- **Emotion / Clarity Created:** **Instant scale & abundance** — "this isn't a single feature, it's a universe."

### 2. Prompt-to-Pill Morph & Execution Halo (`00:04.96 – 00:06.67`, `00:37.25 – 00:38.67`)
- **Mechanics:** Bare editorial copy (`Want it? Prompt it.`) wraps seamlessly into a soft-shadowed pill input, fast-types a natural-language command (`25–40 ms/char`), pops a crisp spinner icon, radiates a **magenta/pink outer glow (`box-shadow` bloom)**, and lifts upward with slight vertical blur as the resulting Tool Node materializes.
- **Why It Works:** Compresses the most boring part of AI software (waiting for generation) into a **0.5-second tactile dopamine beat** with clear cause-and-effect state signaling (typing → running → glowing → spawned).
- **Where It Fails If Overused:** Using more than 2–3 prompt pills in a 60s video makes the film feel like a repetitive form-filling tutorial rather than a creative tool showcase.
- **Emotion / Clarity Created:** **Effortless magic & responsiveness** — intent immediately becomes software.

### 3. Real-Time Split-Wipe & Spatial Merge (`00:06.67 – 00:14.04`)
- **Mechanics:** Two complementary direct-manipulation metaphors: (a) a linear `clip-path` before/after wipe across a playing video (`Subject Masking`), and (b) 4 discrete clip cards converging inward along parabolic paths into a single unified node + bottom timeline strip (`Join Videos`).
- **Why It Works:** Shows the *transformation* happening live on moving footage, bypassing skepticism ("is that just a static before/after slide?").
- **Where It Fails If Overused:** Slow linear wipes (`>0.8s`) feel like PowerPoint transitions. Fuser keeps the wipe brisk (`~0.55s`) with a smooth ease-in-out curve and holds the *result* longer than the transition.
- **Emotion / Clarity Created:** **Immediate comprehension & proof of craft.**

### 4. Split-Screen Vertical Drum / Slot-Machine Carousel (`00:16.38 – 00:22.25`)
- **Mechanics:** Asymmetric two-column lockup: left column (`33% X`) houses a stationary pink-framed node preview; right column (`68% X`) scrolls a vertical typography reel (`opacity: 0.22 → 1.0 → 0.22`) that starts at a readable cadence (`1.0s/item`) and **exponentially accelerates** (`0.8s → 0.6s → 0.25s → 0.12s`) while ramping directional vertical blur (`0px → 18px`).
- **Why It Works:** Gives the viewer 3–4 readable anchors early so they understand the pattern, then lets **acceleration convey infinity**—the brain extrapolates "there are hundreds more" without needing to read item #9.
- **Where It Fails If Overused:** If acceleration starts too early (before item #2 is read), the viewer feels stressed and confused instead of impressed.
- **Emotion / Clarity Created:** **Momentum, depth of library, and mechanical precision.**

### 5. Tactile Cursor-Driven Live Slider (`00:23.54 – 00:30.96`, `00:51.46 – 00:54.38`)
- **Mechanics:** An unmistakable orange-accented pointer locks onto a minimalist slider thumb and drags smoothly with natural human ease-in-out; the target visual (`"Live"` typography scale, `Zoom` portrait shader, or `Kinetic Type` wave amplitude) responds **zero-latency 1:1 on every frame**.
- **Why It Works:** Human brains are wired to trust **physical agency**. Watching a cursor scrub *back and forth* (not just 0 → 100%) proves the parameter is truly live and interactive, not a baked animation.
- **Where It Fails If Overused:** Robotic linear cursor paths or jerky micro-jitters break the illusion immediately; always overshoot slightly or reverse direction once to prove continuous control.
- **Emotion / Clarity Created:** **Tactile agency & zero-latency responsiveness.**

### 6. 3D Cover-Flow Perspective Card Fan (`00:32.67 – 00:36.08`)
- **Mechanics:** Starts with one flat hero card (`rotateY(0deg)`), fans a dense deck outward along the X/Z axes (`rotateY(-38deg)`, `translateZ`, tight negative margin overlap), then cycles cards across the focal apex on the 133 BPM beat with velocity-linked horizontal blur.
- **Why It Works:** Breaks 2D flat-UI monotony with crisp architectural perspective while preserving the identical pink-bordered card grammar.
- **Where It Fails If Overused:** Excessive perspective distortion (`perspective < 600px`) or spinning cards past 70° makes UI thumbnails unreadable sludge.
- **Emotion / Clarity Created:** **Curated editorial luxury & kinetic flair.**

### 7. Selective Depth-of-Field Focus Frame (`00:38.67 – 00:41.75`)
- **Mechanics:** Dual-layer Z-axis compositing: background layer fills 100% of the viewport with `filter: blur(22px)` and slightly desaturated exposure; foreground layer is a centered square pink-bordered Tool Node clipping the **exact same video at 0px blur**, overlaid with crisp vector AI tracking boxes (`Eye Detection`).
- **Why It Works:** Turns a tiny square UI widget into a **cinematic full-bleed shot** without losing focus on the UI chrome. Swapping subjects inside the exact same pixel coordinates creates hypnotic beat-locked continuity.
- **Where It Fails If Overused:** If background and foreground scales/crops drift even 2% out of registration, the optical "lens" illusion breaks and looks like a sloppy picture-in-picture overlay.
- **Emotion / Clarity Created:** **Optical precision & AI intelligence.**

### 8. Connected Node Wire Dataflow (`00:41.75 – 00:45.00`, `00:52.75 – 00:54.38`)
- **Mechanics:** Left-to-right paired nodes (`Input → Wire → Output`) linked by a crisp `1.5px` neutral/pink connector path with endpoint port dots. Left node displays raw media or controls (`Video`, `Audio Waveform`, `Kinetic Type Controls`); right node renders transformed output (`Subtitles`, `Synced Lyrics`, `Wave Typography`) in frame-accurate sync.
- **Why It Works:** Directly visualizes Fuser's node-graph architecture in under 1.5 seconds using Western left-to-right reading order—zero arrows or explanatory labels needed.
- **Where It Fails If Overused:** Showing 8 tangled crossing wires ("spaghetti graph") instantly kills launch-video clarity. Fuser strictly limits wired close-ups to **1-to-1 pairs** and saves the big graph for the fast aerial canvas pan.
- **Emotion / Clarity Created:** **Systemic clarity & modular power.**

### 9. Infinite 2D Spatial Canvas Glide + Scale-Through Match-Cut (`00:47.42 – 00:57.29`)
- **Mechanics:** Virtual 2D camera (`scale` + `translate(x, y)` on a unified world container) executes 3 whip-pan hops across a bustling grid of 20+ animated nodes, eases smoothly into `scale(2.8)` locking directly onto the `Kinetic Type` node—which then punches full-bleed (`scale(1) → scale(2.4)`) into the film's final call-to-action lockup (`GO MAKE YOUR OWN TOOLS`).
- **Why It Works:** Connects the macro ecosystem view directly to the micro hero payoff in one unbroken spatial thread—and uses the product *itself* to generate the finale typography.
- **Where It Fails If Overused:** Drifting slowly across a large canvas with linear easing feels like a boring screen-share tour. Fuser uses **high-peak velocity hops** (`power4.inOut`) with brief micro-pauses over hero clusters so each hop feels rhythmic and intentional.
- **Emotion / Clarity Created:** **Grandeur, spatial continuity, and an earned climax.**

---

## 3. Physics, Easing & Rhythm Blueprint

### Estimated Motion Curves by Technique

| Motion Style | CSS `cubic-bezier` | GSAP Ease | Spring Equiv. (`stiffness / damping / mass`) | Anticipation / Overshoot |
|---|---|---|---|---|
| **Whip-Pan Transition (`3–5f`)** | `cubic-bezier(0.76, 0, 0.24, 1)` | `expo.inOut` / `power4.inOut` | N/A (velocity-driven blur curve) | Zero overshoot; symmetric steep spike peaking at frame 2–3 |
| **UI Node / Card Entrance** | `cubic-bezier(0.16, 1, 0.3, 1)` | `expo.out` / `power4.out` | `280 / 26 / 1.0` (critically damped) | Zero bounce! Ultra-fast launch, silky long tail settle |
| **Radial Orbital Burst** | `cubic-bezier(0.22, 1, 0.36, 1)` | `back.out(1.25)` (subtle) | `220 / 20 / 1.0` | Micro-overshoot (`~3–5%`) on outer cards for organic pop |
| **Prompt-to-Pill Morph** | `cubic-bezier(0.34, 1.35, 0.64, 1)` | `back.out(1.4)` | `300 / 22 / 0.9` | Slight tactile pop when pill border & shadow snap around text |
| **Slot-Machine Drum Step** | `cubic-bezier(0.65, 0, 0.35, 1)` | `power3.inOut` → `none` (at peak speed) | `240 / 24 / 1.0` | Distinct detents on items 1–4, then continuous exponential ramp |
| **Cursor Slider Scrubbing** | `cubic-bezier(0.45, 0, 0.55, 1)` | `sine.inOut` / `power2.inOut` | N/A (human motor curve) | Subtle `2f` dwell at slider grab & release points |
| **3D Cover-Flow Card Flip** | `cubic-bezier(0.22, 1, 0.36, 1)` | `power3.out` | `260 / 25 / 1.0` | Tight 1-beat snap into center hero plane (`rotateY: 0deg`) |
| **2D Spatial Camera Hop** | `cubic-bezier(0.83, 0, 0.17, 1)` | `expo.inOut` | N/A (camera rig) | High mid-path speed triggers directional blur; deep ease-out on target lock |
| **Scale-Through Match-Cut** | `cubic-bezier(0.7, 0, 0.3, 1)` | `power4.in` → hard cut → `power4.out` | N/A | Cut happens at **peak velocity**, hiding the DOM/layer swap completely |

### Pacing: Readability Hold Budget vs. Transition Speed

One of the biggest separators between junior and senior motion design is **asymmetric time allocation**: amateurs spend `0.8s` sliding a card in and `0.4s` holding it; Fuser spends **`0.15–0.28s`** transitioning and **`0.85–1.35s`** holding!

```text
AMATEUR TIMING (mushy, unreadable):
[==== 0.75s slow slide ====][= 0.45s hold =][==== 0.75s slow exit ====]

FUSER SENIOR TIMING (snappy, authoritative):
[0.18s snap][=========== 1.15s crisp readability hold ===========][0.15s whip]
```

**Observed Hold Budgets in Fuser:**
- **2–3 word editorial interstitials** (`"Create once"`, `"Smart tools"`, `"Reuse your tools"`): **`0.65s – 1.05s`** hold (`16–25f` at 24p / `39–63f` at 60p).
- **4–5 word thesis lines** (`"Want it? Prompt it."`, `"Craft your signature look"`): **`1.15s – 1.35s`** hold (`28–32f` at 24p / `69–81f` at 60p).
- **Single-feature UI hero demos** (`Subject Masking`, `Join Videos`, `Zoom` slider): **`2.0s – 2.5s`** total shot length (`0.2s` entry + `0.8s` setup/before + `0.6s` action + `0.8s` after-proof).
- **Whip-pan & cut transitions:** **`0.12s – 0.21s`** (`3–5f` at 24p / `8–13f` at 60p).

### Audio-to-Visual Rhythm & BPM Architecture
From our empirical waveform onset analysis ([audit-manifest.json](./audit-manifest.json)):
- **Act 1 (`00:00.0 – 00:22.4`):** Sparser percussive/tactile UI sound design (keystrokes, subtle clicks, soft whooshes on whip-pans) allowing variable editorial timing for conceptual explanation.
- **Act 2 & 3 (`00:22.42 – 00:57.7`):** Driving electronic pulse locked strictly to **~133 BPM** (`0.450s/beat` ≈ `10.8f` at 24p / `27f` at 60p).
  - Look at the exact beat alignment: `"Tweak"` (`22.42s`) → `"Tools"` (`22.88s`, +1 beat) → `"Live"` (`23.33s`, +1 beat) → Slider drop (`23.79s`, +1 beat) → Risograph Whip-Pan (`25.58s`, +4 beats) → Cover-Flow flips (`33.25s`, `33.75s`, `34.17s`, `34.75s`, `35.38s` — literally **1 card per beat**!).
  - **Key Director Takeaway:** Notice how major scene cuts land **1 frame before or dead-on the snare/kick transient**, while visual deceleration stretches cleanly across the off-beat!

### Focal-Point Handoff (Eye-Trace Map)
Across 60 seconds, Fuser restricts eye movement to **only three screen zones**:
1. **Center Anchor (`50%, 50%`)**: Used for 80% of the film (carets, pills, single nodes, Eye Detection DOF box, Cover-Flow hero card, Finale lockup, Logo).
2. **Asymmetric Split (`33% X` visual / `68% X` label)**: Used ONLY in the Vertical Slot Drum (`00:16–00:22`)—and kept locked for 6 full seconds so the eye settles into a relaxed left-right scan.
3. **Causal Wire Pair (`36% X` input → `64% X` output)**: Used in Subtitles (`00:41`), Audio-to-Lyrics (`00:43`), and Kinetic Type (`00:52`), always honoring left-to-right cause → effect.

---

## 4. Polish & Micro-Details That Elevate It to Studio Grade

1. **Velocity-Coupled Directional Motion Blur (Never Static Blur):**
   - Across fast transition keyframes (`#07`, `#12`, `#14`, `#18`, `#20`, `#23`, `#30`, `#40`, `#47` in [audit-manifest.json](./audit-manifest.json)), blur is **strictly directional** (horizontal streak on X-axis whip-pans, vertical streak on the accelerating slot drum) and drops to `0px` the instant velocity settles. This hides 24 fps judder and makes fast transitions feel optical rather than choppy.
2. **Signature Active-Node Pink Chrome (`#F472B6` / `#EC4899`):**
   - Every Fuser Tool Node shares a crisp `1.5px–2px` soft pink border + micro header bar (`• Tool Name` + subtle `:::` grip dots) + soft ambient shadow (`0 12px 32px rgba(0,0,0,0.08)`). Even during `0.25s` rapid cuts, your brain instantly recognizes "that pink frame = a Fuser Tool Node."
3. **The Executing Pink Halo State (`00:06.25`, `00:38.25`):**
   - Before a prompted node appears, the white pill blooms with a tight neon-pink outer glow (`0 0 24px rgba(244, 114, 182, 0.55)`) while a tiny minimalist spinner ticks. That 10-frame state bridge prevents the node spawn from feeling abrupt.
4. **Live Footage Inside Moving Cards:**
   - During the split-wipe (`00:07–00:09`), multi-clip merge (`00:10–00:13`), and dual-node subtitles (`00:42–00:43`), the underlying video clips *keep playing* while the UI animates. Motion inside motion creates subconscious realism.
5. **Micro-Typography Discipline & Caret Continuity:**
   - The thin vertical typing caret (`|`) appears at `00:00.25`, `00:03.50`, `00:15.00`, `00:32.00`, `00:37.00`, `00:46.00`, and `01:00.00` (`fuser.studio/tools|`). Using one tiny recurring punctuation mark ties a 28-shot montage into a single authored voice.
6. **Strategic Chromatic Pattern Interrupts:**
   - Because 80% of the film is stark `#FFFFFF` gallery white, the three non-white moments (`00:36.08` magenta-violet gradient wipe, `00:43.62` moody burgundy audio pipeline, `00:54.38` hot-pink/black full-bleed kinetic typography) hit with **10× visual impact**—resetting viewer attention right before fatigue sets in at the 36s, 44s, and 54s marks.
