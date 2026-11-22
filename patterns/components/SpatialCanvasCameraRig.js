/**
 * Pattern 06: SpatialCanvasCameraRig (Fuser 00:47.42 – 00:57.29)
 * ---------------------------------------------------------------------------
 * Fuser's grand spatial finale: a virtual 2D camera executes 3 high-velocity
 * whip-pan hops across a living grid of Tool Nodes, decelerates dead-center
 * onto the pink "Kinetic Type" node, then punches through a Scale-Through
 * Match-Cut directly into the full-bleed "GO MAKE YOUR OWN TOOLS" climax!
 *
 * Try breaking it:
 * - Set Easing to "linear" to feel how dead & seasick an un-eased camera pan is.
 * - Drop Blur to 0x to see why fast canvas hops need velocity blur to feel optical.
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.05,
    overshoot: 0.2,
    blur: 1.0,
  };

  const AMATEUR = {
    duration: 2.1,
    easePreset: 'linear',
    stagger: 0.2,
    overshoot: 1.8,
    blur: 0.0,
  };

  const CANVAS_NODES = [
    { x: 40, y: 40, w: 165, h: 175, title: 'Color Pop', bg: '#fff7ed', accent: '#f97316' },
    { x: 230, y: 30, w: 185, h: 195, title: 'Product Shot', bg: '#f4f4f5', accent: '#27272a' },
    { x: 440, y: 45, w: 170, h: 180, title: 'Gradient Map', bg: '#fef3c7', accent: '#ec4899' },
    { x: 640, y: 35, w: 175, h: 185, title: 'Motion Track', bg: '#ede9fe', accent: '#7c3aed' },
    { x: 840, y: 45, w: 165, h: 175, title: 'Object Detect', bg: '#ecfdf5', accent: '#059669' },

    { x: 50, y: 245, w: 170, h: 180, title: 'Duotone', bg: '#fce7f3', accent: '#db2777' },
    { x: 245, y: 255, w: 175, h: 175, title: 'Riso Crops', bg: '#e0e7ff', accent: '#4338ca' },
    { x: 450, y: 250, w: 180, h: 185, title: 'Pixel Stretch', bg: '#18181b', accent: '#fafafa' },
    { x: 660, y: 245, w: 190, h: 190, title: 'Kinetic Type', bg: '#ec4899', accent: '#111114', hero: true },
    { x: 875, y: 255, w: 165, h: 175, title: 'Contact Sheet', bg: '#f1f5f9', accent: '#334155' },

    { x: 120, y: 455, w: 175, h: 165, title: 'Posterize', bg: '#fdf4ff', accent: '#c026d3' },
    { x: 340, y: 460, w: 185, h: 165, title: 'Frame Sheet', bg: '#fef9c3', accent: '#ca8a04' },
    { x: 560, y: 460, w: 175, h: 165, title: 'Slit-Scan', bg: '#ffedd5', accent: '#ea580c' },
    { x: 775, y: 460, w: 175, h: 165, title: 'Mosaic', bg: '#f4f4f5', accent: '#18181b' },
  ];

  window.MotionPatterns.push({
    id: 'spatial-canvas-camera-rig',
    name: 'SpatialCanvasCameraRig',
    label: '06 · 2D Camera + Match-Cut',
    timestamp: '00:47.42 – 00:57.29',
    tag: 'Camera Rig / Match-Cut',
    directorNote:
      'High-peak velocity camera hops (expo.inOut) prevent seasick linear drifting. The final zoom locks Kinetic Type dead-center, cutting at peak velocity into the full-bleed CTA lockup.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene pat-white scr-scene" data-pat="camera-rig">
          <!-- Virtual 2D Spatial World transformed by Camera Rig -->
          <div class="scr-world">
            <!-- Subtle dot grid on infinite canvas -->
            <div class="scr-grid-bg"></div>
            ${CANVAS_NODES.map(
              (n) => `
              <div
                class="fuser-node scr-node ${n.hero ? 'scr-hero-node' : ''}"
                style="left:${n.x}px; top:${n.y}px; width:${n.w}px; height:${n.h}px;"
              >
                <div class="fuser-node-header">
                  <span class="fuser-dot"></span>
                  <span class="fuser-node-title">${n.title}</span>
                </div>
                <div class="scr-node-body" style="background:${n.bg}; color:${n.accent};">
                  ${
                    n.hero
                      ? `<div class="scr-mini-kinetic">
                           <span>KINETIC</span>
                           <span class="solid">TYPE</span>
                           <span>KINETIC</span>
                         </div>`
                      : `<div class="scr-shape-swatch" style="background:${n.accent}"></div>`
                  }
                </div>
              </div>`
            ).join('')}
          </div>

          <!-- Scale-Through Match-Cut Full-Bleed Pink Transition -->
          <div class="scr-match-pink">
            <div class="scr-pink-line">MAKE TOOLS</div>
            <div class="scr-pink-line solid">MAKE TOOLS</div>
            <div class="scr-pink-line">MAKE TOOLS</div>
          </div>

          <!-- Final High-Contrast Climax Lockup -->
          <div class="scr-finale">
            <div class="scr-finale-line">GO MAKE</div>
            <div class="scr-finale-line">YOUR OWN</div>
            <div class="scr-finale-line">TOOLS</div>
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeHop = helpers.resolveEase(params.easePreset, 'inOut', 0);
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);
      const blurPx = 11 * params.blur;

      const world = stage.querySelector('.scr-world');
      const matchPink = stage.querySelector('.scr-match-pink');
      const pinkLines = Array.from(stage.querySelectorAll('.scr-pink-line'));
      const finale = stage.querySelector('.scr-finale');
      const finaleLines = Array.from(stage.querySelectorAll('.scr-finale-line'));

      // Stage reference viewport is 800x450 logical pixels; center = (400, 225)
      // Helper converts a world focal point (wx, wy) + zoom into exact CSS transform!
      function cam(wx, wy, zoom) {
        return {
          x: 400 - wx * zoom,
          y: 225 - wy * zoom,
          scale: zoom,
        };
      }

      // Hero Kinetic Type center is (660 + 95, 245 + 95) = (755, 340)
      const pStart = cam(290, 170, 0.92);
      const pHop1 = cam(540, 210, 0.98);
      const pHop2 = cam(440, 380, 1.05);
      const pLockHero = cam(755, 340, 2.05);
      const pPunchIn = cam(755, 340, 5.2);

      gsap.set(world, { ...pStart, transformOrigin: '0 0', filter: 'blur(0px)', opacity: 1 });
      gsap.set(matchPink, { opacity: 0, scale: 0.78 });
      gsap.set(finale, { opacity: 0 });
      gsap.set(finaleLines, { y: 42, opacity: 0 });

      const tl = gsap.timeline({ paused: true });

      // 1. Initial Cluster Hold
      tl.addLabel('Canvas Open', 0);
      tl.to({}, { duration: 0.35 * d });

      // 2. Whip-Pan Hop 1 (rightward across upper cluster)
      tl.addLabel('Camera Hop 1', '>');
      tl.to(world, { filter: `blur(${(blurPx * 0.85).toFixed(1)}px)`, duration: 0.16 * d }, '>');
      tl.to(world, { ...pHop1, duration: 0.40 * d, ease: easeHop }, '<');
      tl.to(world, { filter: 'blur(0px)', duration: 0.22 * d }, `<+${(0.18 * d).toFixed(3)}`);
      tl.to({}, { duration: 0.22 * d });

      // 3. Whip-Pan Hop 2 (diagonal sweep down-left)
      tl.addLabel('Camera Hop 2', '>');
      tl.to(world, { filter: `blur(${(blurPx * 0.95).toFixed(1)}px)`, duration: 0.16 * d }, '>');
      tl.to(world, { ...pHop2, duration: 0.42 * d, ease: easeHop }, '<');
      tl.to(world, { filter: 'blur(0px)', duration: 0.22 * d }, `<+${(0.20 * d).toFixed(3)}`);
      tl.to({}, { duration: 0.20 * d });

      // 4. Target Lock-On: Smooth zoom locking Kinetic Type dead-center (400, 225)!
      tl.addLabel('Target Lock', '>');
      tl.to(world, { filter: `blur(${(blurPx * 0.85).toFixed(1)}px)`, duration: 0.20 * d }, '>');
      tl.to(world, { ...pLockHero, duration: 0.62 * d, ease: easeHop }, '<');
      tl.to(world, { filter: 'blur(0px)', duration: 0.28 * d }, `<+${(0.30 * d).toFixed(3)}`);
      tl.to({}, { duration: 0.48 * d });

      // 5. Scale-Through Match-Cut! Accelerate INTO hero node -> cut at peak velocity!
      tl.addLabel('Match-Cut Punch', '>');
      tl.to(world, {
        ...pPunchIn,
        filter: `blur(${(blurPx * 0.9).toFixed(1)}px)`,
        duration: 0.28 * d,
        ease: 'power4.in',
      });
      tl.to(
        matchPink,
        {
          opacity: 1,
          scale: 1,
          duration: 0.22 * d,
          ease: easeOut,
        },
        '>-0.06'
      );
      // Undulating kinetic ripple across pink lines
      tl.to(
        pinkLines,
        {
          scaleY: 1.24,
          duration: 0.22 * d,
          stagger: params.stagger,
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut',
        },
        '>'
      );

      // 6. Climax Cut -> High-Contrast "GO MAKE YOUR OWN TOOLS"
      tl.addLabel('Climax Lockup', '>+0.06');
      tl.set(world, { opacity: 0 });
      tl.to(matchPink, { opacity: 0, duration: 0.12 * d });
      tl.set(finale, { opacity: 1 }, '<');
      tl.to(
        finaleLines,
        {
          y: 0,
          opacity: 1,
          duration: 0.32 * d,
          stagger: params.stagger,
          ease: easeOut,
        },
        '<'
      );

      tl.addLabel('CTA Hold', '>');
      tl.to({}, { duration: 0.85 * d });

      return tl;
    },
  });
})();
