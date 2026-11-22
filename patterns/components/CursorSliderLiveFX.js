/**
 * Pattern 03: CursorSliderLiveFX (Fuser 00:23.54 – 00:30.96)
 * ---------------------------------------------------------------------------
 * Demonstrates Fuser's tactile orange cursor scrubbing a minimalist slider
 * to scale the "Live" display headline 1:1 in real time, then whip-panning
 * into a Risograph shader node that daisy-chains 2 live sibling nodes.
 *
 * Try breaking it:
 * - Set Easing to "linear" and watch the cursor immediately feel robotic.
 * - Increase Stagger > 0.16s to feel the 3-node daisy-chain lose punch.
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.06,
    overshoot: 0.3,
    blur: 1.0,
  };

  const AMATEUR = {
    duration: 1.9,
    easePreset: 'linear',
    stagger: 0.22,
    overshoot: 2.3,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'cursor-slider-live-fx',
    name: 'CursorSliderLiveFX',
    label: '03 · Cursor + Live Slider',
    timestamp: '00:23.54 – 00:30.96',
    tag: 'Direct Manipulation',
    directorNote:
      'Scrubbing BOTH forward and backward proves real-time control. The 1:1 visual coupling teaches the slider metaphor on typography before transferring it to chained shader nodes.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene pat-white csl-scene" data-pat="cursor-slider">
          <!-- Act A: "Live" typography + tactile horizontal slider -->
          <div class="csl-live-stage">
            <div class="csl-live-word">Live</div>
            <div class="csl-slider-wrap">
              <div class="csl-slider-track">
                <div class="csl-slider-fill"></div>
                <div class="csl-slider-thumb"></div>
              </div>
              <div class="csl-cursor">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 3L19 11.5L11.8 13.6L9 20.5L4 3Z" fill="#f97316" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Act B: Whip-pan into 3 Daisy-Chained Shader Nodes -->
          <div class="csl-nodes-row">
            <div class="fuser-node csl-shader-node csl-node-1">
              <div class="fuser-node-header">
                <span class="fuser-dot"></span>
                <span class="fuser-node-title">Risograph</span>
              </div>
              <div class="csl-portrait csl-riso">
                <div class="csl-portrait-inner csl-zoom-target"></div>
              </div>
              <div class="csl-mini-slider"><span>Zoom</span><div class="csl-mini-bar"><div class="csl-mini-fill csl-fill-1"></div></div></div>
            </div>

            <div class="fuser-node csl-shader-node csl-node-2">
              <div class="fuser-node-header">
                <span class="fuser-dot"></span>
                <span class="fuser-node-title">Line Hatch</span>
              </div>
              <div class="csl-portrait csl-hatch">
                <div class="csl-portrait-inner csl-hatch-target"></div>
              </div>
              <div class="csl-mini-slider"><span>Angle</span><div class="csl-mini-bar"><div class="csl-mini-fill csl-fill-2"></div></div></div>
            </div>

            <div class="fuser-node csl-shader-node csl-node-3">
              <div class="fuser-node-header">
                <span class="fuser-dot"></span>
                <span class="fuser-node-title">Halftone</span>
              </div>
              <div class="csl-portrait csl-halftone">
                <div class="csl-portrait-inner csl-half-target"></div>
              </div>
              <div class="csl-mini-slider"><span>Dot</span><div class="csl-mini-bar"><div class="csl-mini-fill csl-fill-3"></div></div></div>
            </div>
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);
      const easeInOut = helpers.resolveEase(params.easePreset, 'inOut', params.overshoot);
      const easeHuman = params.easePreset === 'linear' ? 'none' : 'sine.inOut';
      const blurPx = 12 * params.blur;

      const liveStage = stage.querySelector('.csl-live-stage');
      const liveWord = stage.querySelector('.csl-live-word');
      const fill = stage.querySelector('.csl-slider-fill');
      const thumb = stage.querySelector('.csl-slider-thumb');
      const cursor = stage.querySelector('.csl-cursor');

      const nodesRow = stage.querySelector('.csl-nodes-row');
      const n1 = stage.querySelector('.csl-node-1');
      const n2 = stage.querySelector('.csl-node-2');
      const n3 = stage.querySelector('.csl-node-3');
      const zoomTarget = stage.querySelector('.csl-zoom-target');
      const hatchTarget = stage.querySelector('.csl-hatch-target');
      const halfTarget = stage.querySelector('.csl-half-target');
      const f1 = stage.querySelector('.csl-fill-1');
      const f2 = stage.querySelector('.csl-fill-2');
      const f3 = stage.querySelector('.csl-fill-3');

      const trackWidth = 180;
      const sliderState = { p: 0.14 };

      function applySlider(p) {
        fill.style.width = `${(p * 100).toFixed(1)}%`;
        thumb.style.left = `${(p * trackWidth).toFixed(1)}px`;
        cursor.style.left = `${(p * trackWidth + 4).toFixed(1)}px`;
        // Direct 1:1 coupling to headline scale
        const sc = 0.72 + p * 1.05;
        liveWord.style.transform = `scale(${sc.toFixed(3)})`;
      }

      gsap.set(liveStage, { x: 0, opacity: 1, filter: 'blur(0px)' });
      gsap.set(cursor, { y: 18, opacity: 0 });
      applySlider(0.14);

      gsap.set(nodesRow, { x: 260, opacity: 0, filter: `blur(${blurPx}px)` });
      gsap.set(n1, { x: 214, scale: 1.18, opacity: 1 });
      gsap.set([n2, n3], { x: -40, scale: 0.82, opacity: 0 });
      gsap.set(zoomTarget, { scale: 1.0 });
      gsap.set(hatchTarget, { scale: 1.05, rotation: 0 });
      gsap.set(halfTarget, { scale: 1.0 });
      gsap.set(f1, { width: '25%' });
      gsap.set(f2, { width: '35%' });
      gsap.set(f3, { width: '30%' });

      const tl = gsap.timeline({ paused: true });

      // 1. Cursor arrives & grabs slider thumb
      tl.addLabel('Cursor Grab', 0);
      tl.to(cursor, { y: 4, opacity: 1, duration: 0.24 * d, ease: easeOut });
      tl.to({}, { duration: 0.12 * d }); // 2-3f natural dwell before drag

      // 2. Scrub right (Live grows 2.1x!)
      tl.addLabel('Live Scrub Up', '>');
      tl.to(sliderState, {
        p: 0.92,
        duration: 0.62 * d,
        ease: easeHuman,
        onUpdate: () => applySlider(sliderState.p),
      });

      // 3. Scrub back down (proves live continuous input!)
      tl.addLabel('Scrub Down', '>+0.08');
      tl.to(sliderState, {
        p: 0.22,
        duration: 0.52 * d,
        ease: easeHuman,
        onUpdate: () => applySlider(sliderState.p),
      });

      // 4. Horizontal Whip-Pan into Risograph Hero Node
      tl.addLabel('Whip Pan', '>+0.08');
      tl.to(liveStage, {
        x: -260,
        opacity: 0,
        filter: `blur(${blurPx}px)`,
        duration: 0.24 * d,
        ease: easeInOut,
      });
      tl.to(
        nodesRow,
        {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.28 * d,
          ease: easeOut,
        },
        '<+0.05'
      );

      // 5. Zoom slider scrubs live on Hero Node
      tl.addLabel('Live Zoom FX', '>');
      tl.to(zoomTarget, { scale: 1.48, duration: 0.62 * d, ease: easeHuman });
      tl.to(f1, { width: '86%', duration: 0.62 * d, ease: easeHuman }, '<');

      // 6. Daisy-Chain Expansion: Hero shifts left + 2 sibling nodes spring in!
      tl.addLabel('Daisy Chain', '>+0.12');
      tl.to(n1, { x: 0, scale: 1.0, duration: 0.36 * d, ease: easeOut });
      tl.to(
        [n2, n3],
        {
          x: 0,
          scale: 1.0,
          opacity: 1,
          duration: 0.38 * d,
          stagger: params.stagger,
          ease: params.overshoot > 0.05 ? `back.out(${(1 + params.overshoot * 0.9).toFixed(2)})` : easeOut,
        },
        `<+${(params.stagger * 0.8).toFixed(3)}`
      );

      // Simultaneous live modulation across all 3 chained nodes
      tl.to(hatchTarget, { scale: 1.32, rotation: 6, duration: 0.55 * d, ease: easeHuman }, '<+0.15');
      tl.to(f2, { width: '82%', duration: 0.55 * d, ease: easeHuman }, '<');
      tl.to(halfTarget, { scale: 1.28, duration: 0.55 * d, ease: easeHuman }, '<+0.08');
      tl.to(f3, { width: '78%', duration: 0.55 * d, ease: easeHuman }, '<');

      tl.addLabel('Hold', '>');
      tl.to({}, { duration: 0.65 * d });

      return tl;
    },
  });
})();
