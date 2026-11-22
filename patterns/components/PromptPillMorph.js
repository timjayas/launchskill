/**
 * Pattern 01: PromptPillMorph (Fuser 00:04.96 – 00:09.17)
 * ---------------------------------------------------------------------------
 * Editorial caret text -> morphs into rounded input pill -> fast command typing
 * -> spinner + pink radial execution halo -> upward lift -> pink-bordered
 * Subject Masking Tool Node springs in -> live before/after split wipe.
 *
 * Try breaking it:
 * - Set Easing to "linear" to see how mechanical the pill morph & wipe become.
 * - Crank Overshoot > 1.8 to see why cartoony bounce kills editorial SaaS tone.
 * - Increase Duration > 1.8x to feel the energy drain out of the 0.55s wipe.
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  // Clearly commented default tuning constants (Senior Fuser feel)
  const DEFAULTS = {
    duration: 1.0,       // Global timing multiplier (1.0 = Fuser reference pace)
    easePreset: 'expo',  // Primary deceleration curve: 'expo' | 'power3' | 'back' | 'linear'
    stagger: 0.05,       // Micro-stagger between UI accents (seconds)
    overshoot: 0.35,     // Subtle spring pop on pill & card spawn (0..3)
    blur: 1.0,           // Velocity blur multiplier (0..2.5)
  };

  const AMATEUR = {
    duration: 1.9,
    easePreset: 'linear',
    stagger: 0.18,
    overshoot: 2.4,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'prompt-pill-morph',
    name: 'PromptPillMorph',
    label: '01 · Prompt → Pill → Wipe',
    timestamp: '00:04.96 – 00:09.17',
    tag: 'UI State Morph',
    directorNote:
      'Compresses AI latency into a 0.5s tactile dopamine beat: text wraps into a pill, blooms with a pink executing halo, lifts with subtle blur, and lands as a live before/after split-wipe node.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene pat-white" data-pat="prompt-pill">
          <!-- Phase 1 & 2: Editorial Text & Morphing Pill -->
          <div class="ppm-pill-wrap">
            <div class="ppm-pill">
              <span class="ppm-spinner" aria-hidden="true"></span>
              <span class="ppm-text">Want it? Prompt it.</span>
              <span class="ppm-caret"></span>
            </div>
          </div>

          <!-- Phase 3: Generated Subject Masking Tool Node -->
          <div class="fuser-node ppm-node">
            <div class="fuser-node-header">
              <span class="fuser-dot"></span>
              <span class="fuser-node-title">Subject Masking</span>
              <span class="fuser-node-grip">⋮⋮</span>
            </div>
            <div class="ppm-canvas">
              <!-- Clean white cutout ("After" layer underneath) -->
              <div class="ppm-layer ppm-after">
                <svg viewBox="0 0 260 320" class="ppm-art">
                  <rect width="260" height="320" fill="#ffffff" />
                  <!-- Subtle studio floor shadow -->
                  <ellipse cx="142" cy="286" rx="74" ry="12" fill="rgba(17,17,22,0.10)" />
                  <!-- Stylized fashion silhouette + dog cutout -->
                  <g fill="#18181b">
                    <circle cx="158" cy="72" r="20" />
                    <path d="M132 100 C132 92 184 92 184 100 L198 188 L176 190 L166 276 L150 276 L152 198 L144 198 L136 276 L120 276 L124 186 Z" />
                    <!-- Leash -->
                    <path d="M126 154 Q96 190 78 212" stroke="#18181b" stroke-width="2.5" fill="none" />
                    <!-- Dog silhouette -->
                    <path d="M44 222 C54 206 76 206 86 218 L108 218 C118 218 124 230 120 242 L116 278 L104 278 L104 252 L74 252 L72 278 L60 278 L60 248 L48 242 Z" />
                    <circle cx="80" cy="210" r="10" />
                  </g>
                </svg>
              </div>

              <!-- Cobalt blue studio backdrop ("Before" layer clipped by wipe) -->
              <div class="ppm-layer ppm-before">
                <svg viewBox="0 0 260 320" class="ppm-art">
                  <defs>
                    <linearGradient id="ppmBlueBg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#1d4ed8" />
                      <stop offset="100%" stop-color="#1e40af" />
                    </linearGradient>
                  </defs>
                  <rect width="260" height="320" fill="url(#ppmBlueBg)" />
                  <ellipse cx="142" cy="286" rx="74" ry="12" fill="rgba(0,0,0,0.28)" />
                  <g fill="#111115">
                    <circle cx="158" cy="72" r="20" />
                    <path d="M132 100 C132 92 184 92 184 100 L198 188 L176 190 L166 276 L150 276 L152 198 L144 198 L136 276 L120 276 L124 186 Z" />
                    <path d="M126 154 Q96 190 78 212" stroke="#111115" stroke-width="2.5" fill="none" />
                    <path d="M44 222 C54 206 76 206 86 218 L108 218 C118 218 124 230 120 242 L116 278 L104 278 L104 252 L74 252 L72 278 L60 278 L60 248 L48 242 Z" />
                    <circle cx="80" cy="210" r="10" />
                  </g>
                </svg>
              </div>

              <!-- Crisp wipe divider line + orange cursor handle -->
              <div class="ppm-wipe-bar">
                <div class="ppm-wipe-handle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3L19 12L12 13.8L9 20L5 3Z" fill="#f97316" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="ppm-footer">
              <span class="ppm-badge">Before / After</span>
              <span class="ppm-status">BG Removed · 100%</span>
            </div>
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);
      const easeInOut = helpers.resolveEase(params.easePreset, 'inOut', params.overshoot);
      const blurPx = 10 * params.blur;

      const pillWrap = stage.querySelector('.ppm-pill-wrap');
      const pill = stage.querySelector('.ppm-pill');
      const textEl = stage.querySelector('.ppm-text');
      const spinner = stage.querySelector('.ppm-spinner');
      const node = stage.querySelector('.ppm-node');
      const beforeLayer = stage.querySelector('.ppm-before');
      const wipeBar = stage.querySelector('.ppm-wipe-bar');
      const statusEl = stage.querySelector('.ppm-status');

      const promptStr = 'Remove background';
      const typeState = { chars: 0 };

      // Reset deterministic initial states
      gsap.set(pillWrap, { y: 0, opacity: 1, filter: 'blur(0px)' });
      gsap.set(pill, {
        backgroundColor: 'rgba(255,255,255,0)',
        borderColor: 'rgba(228,228,231,0)',
        boxShadow: '0 0 0 0 rgba(244,114,182,0)',
        paddingLeft: 10,
        paddingRight: 10,
        scale: 1,
      });
      gsap.set(spinner, { width: 0, marginRight: 0, opacity: 0, rotation: 0 });
      gsap.set(node, { y: 56, scale: 0.88, opacity: 0, filter: `blur(${blurPx * 0.6}px)` });
      gsap.set(beforeLayer, { clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(wipeBar, { left: '0%', opacity: 0 });
      gsap.set(statusEl, { opacity: 0, y: 6 });

      const tl = gsap.timeline({ paused: true });

      // 1. Readability hold on bare editorial text
      tl.addLabel('Editorial Hold', 0);
      tl.to({}, { duration: 0.65 * d });

      // 2. Morph text container into rounded pill + clear to prompt
      tl.addLabel('Pill Morph', '>');
      tl.to(pill, {
        backgroundColor: '#ffffff',
        borderColor: '#e4e4e7',
        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
        paddingLeft: 18,
        paddingRight: 20,
        scale: 1.03,
        duration: 0.28 * d,
        ease: easeOut,
      });

      // Deterministic typing via proxy object so scrubbing backward works!
      tl.to(
        typeState,
        {
          chars: promptStr.length,
          duration: 0.48 * d,
          ease: 'none',
          onUpdate: () => {
            const c = Math.round(typeState.chars);
            textEl.textContent = c === 0 ? 'Want it? Prompt it.' : promptStr.slice(0, c);
          },
        },
        '>-0.06'
      );

      // 3. Executing state: spinner + Fuser pink radial halo
      tl.addLabel('Pink Halo', '>');
      tl.to(spinner, {
        width: 14,
        marginRight: 8,
        opacity: 1,
        duration: 0.16 * d,
        ease: easeOut,
      });
      tl.to(
        spinner,
        {
          rotation: 360,
          duration: 0.55 * d,
          ease: 'none',
        },
        '<'
      );
      tl.to(
        pill,
        {
          borderColor: '#f472b6',
          boxShadow: '0 0 0 4px rgba(244,114,182,0.18), 0 0 28px rgba(236,72,153,0.42)',
          scale: 1.0,
          duration: 0.30 * d,
          ease: easeOut,
        },
        '<'
      );

      // 4. Pill lifts upward with subtle velocity blur & spawns Tool Node
      tl.addLabel('Node Spawn', '>+0.12');
      tl.to(pillWrap, {
        y: -155,
        opacity: 0,
        filter: `blur(${blurPx}px)`,
        duration: 0.24 * d,
        ease: easeInOut,
      });
      tl.to(
        node,
        {
          y: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.34 * d,
          ease: params.overshoot > 0.05 ? `back.out(${(1 + params.overshoot * 0.9).toFixed(2)})` : easeOut,
        },
        `<+${Math.max(0.03, params.stagger).toFixed(2)}`
      );

      // 5. "Before" readability hold so viewer registers cobalt background
      tl.addLabel('Before Hold', '>');
      tl.to({}, { duration: 0.55 * d });

      // 6. Live interactive split-wipe left -> right
      tl.addLabel('Split Wipe', '>');
      tl.to(wipeBar, { opacity: 1, duration: 0.10 * d });
      tl.to(
        beforeLayer,
        {
          clipPath: 'inset(0% 0% 0% 100%)',
          duration: 0.58 * d,
          ease: easeInOut,
        },
        '<'
      );
      tl.to(
        wipeBar,
        {
          left: '100%',
          duration: 0.58 * d,
          ease: easeInOut,
        },
        '<'
      );
      tl.to(wipeBar, { opacity: 0, duration: 0.12 * d });
      tl.to(
        statusEl,
        {
          opacity: 1,
          y: 0,
          duration: 0.22 * d,
          ease: easeOut,
        },
        `<-${(params.stagger * 0.5).toFixed(2)}`
      );

      // 7. Crisp "After" proof hold
      tl.addLabel('After Hold', '>');
      tl.to({}, { duration: 0.75 * d });

      return tl;
    },
  });
})();
