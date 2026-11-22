/**
 * Pattern 09: ZScatterThemeFlip (Rebrand MCP 00:15.00 – 00:22.75)
 * ---------------------------------------------------------------------------
 * Organic warm moodboard blasts outward past camera (3D Z-Scatter) as dark
 * technical brand cards converge center -> canvas & prompt bar smoothly invert
 * #FFFFFF -> #0D0D10 while cluster stays 100% locked -> Macro 3.5x Submit Click
 * -> Luminous Orb Singularity Bloom back to pure white!
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.04,
    overshoot: 0.2,
    blur: 1.0,
  };

  const AMATEUR = {
    duration: 2.0,
    easePreset: 'linear',
    stagger: 0.2,
    overshoot: 2.1,
    blur: 0.0,
  };

  const WARM = [
    { x: 0, y: -26, w: 132, h: 90, bg: 'conic-gradient(from 90deg,#fb923c,#f43f5e,#8b5cf6,#38bdf8)' },
    { x: -140, y: -88, w: 86, h: 86, bg: 'linear-gradient(135deg,#fde68a,#f472b6)' },
    { x: 132, y: -92, w: 94, h: 74, bg: 'linear-gradient(135deg,#ddd6fe,#38bdf8)' },
    { x: -172, y: 42, w: 92, h: 74, bg: 'linear-gradient(135deg,#fdba74,#9a3412)' },
    { x: 152, y: 44, w: 88, h: 78, bg: 'linear-gradient(135deg,#1e1b4b,#3b82f6)' },
  ];

  const TECH = [
    { x: -72, y: -74, w: 106, h: 76, accent: '#38bdf8', code: '0xFF' },
    { x: 64, y: -80, w: 102, h: 80, accent: '#f97316', code: 'GRID' },
    { x: -128, y: 14, w: 98, h: 76, accent: '#a855f7', code: 'MONO' },
    { x: 4, y: 4, w: 112, h: 82, accent: '#4ade80', code: 'MCP' },
    { x: 126, y: 12, w: 100, h: 76, accent: '#ec4899', code: 'SPEC' },
  ];

  window.MotionPatterns.push({
    id: 'z-scatter-theme-flip',
    archetype: 'rebrand',
    name: 'ZScatterThemeFlip',
    label: '09 · Z-Scatter + Dark Flip',
    timestamp: '00:15.00 – 00:22.75',
    tag: 'Theme Inversion',
    directorNote:
      'Literally performs the prompt ("feel technical") on the canvas: warm cards scatter past camera while dark cards lock dead-center through the Light→Dark inversion, ending in a luminous singularity.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene rb-ztf" data-pat="z-scatter-flip">
          <!-- Warm Organic Moodboard -->
          <div class="rb-mood-layer rb-warm-layer">
            ${WARM.map(
              (c) =>
                `<div class="rb-mood-card rb-warm-card" style="width:${c.w}px;height:${c.h}px;background:${c.bg}" data-x="${c.x}" data-y="${c.y}"></div>`
            ).join('')}
          </div>

          <!-- Technical Dark Moodboard -->
          <div class="rb-mood-layer rb-tech-layer">
            ${TECH.map(
              (c) =>
                `<div class="rb-mood-card rb-tech-card" style="width:${c.w}px;height:${c.h}px;border-color:${c.accent}66" data-x="${c.x}" data-y="${c.y}">
                   <span class="rb-tech-dot" style="background:${c.accent}"></span>
                   <span class="rb-tech-code">${c.code}</span>
                 </div>`
            ).join('')}
          </div>

          <!-- Bottom Chat Prompt Bar (Inverts Light -> Dark With Canvas!) -->
          <div class="rb-ztf-bar">
            <span class="rb-plus">+</span>
            <span class="rb-ztf-prompt">Show me brands that feel technical</span>
            <span class="rb-submit-btn">↑</span>
          </div>

          <!-- Luminous Singularity Orbs + White Bloom -->
          <div class="rb-singularity-layer">
            ${TECH.map(
              (c) => `<div class="rb-sing-orb" data-x="${c.x}" data-y="${c.y}"></div>`
            ).join('')}
            <div class="rb-sing-flash"></div>
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeInOut = helpers.resolveEase(params.easePreset, 'inOut', 0);
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);
      const blurPx = 12 * params.blur;

      const scene = stage.querySelector('.rb-ztf');
      const warmCards = Array.from(stage.querySelectorAll('.rb-warm-card'));
      const techCards = Array.from(stage.querySelectorAll('.rb-tech-card'));
      const bar = stage.querySelector('.rb-ztf-bar');
      const promptEl = stage.querySelector('.rb-ztf-prompt');
      const singLayer = stage.querySelector('.rb-singularity-layer');
      const orbs = Array.from(stage.querySelectorAll('.rb-sing-orb'));
      const flash = stage.querySelector('.rb-sing-flash');

      gsap.set(scene, { backgroundColor: '#ffffff' });
      gsap.set(bar, { backgroundColor: '#ffffff', borderColor: '#e4e4e7', color: '#18181b', opacity: 1 });
      gsap.set(singLayer, { opacity: 0 });
      gsap.set(flash, { scale: 0.1, opacity: 0 });

      warmCards.forEach((el) => {
        gsap.set(el, { x: Number(el.dataset.x), y: Number(el.dataset.y), scale: 1, opacity: 1, filter: 'blur(0px)' });
      });
      techCards.forEach((el) => {
        gsap.set(el, {
          x: Number(el.dataset.x) * 1.6,
          y: Number(el.dataset.y) * 1.6,
          scale: 0.45,
          opacity: 0,
          filter: `blur(${blurPx}px)`,
        });
      });
      orbs.forEach((el) => {
        gsap.set(el, { x: Number(el.dataset.x), y: Number(el.dataset.y), scale: 1, opacity: 0.92 });
      });

      const tl = gsap.timeline({ paused: true });

      // 1. Warm Organic Hold
      tl.addLabel('Warm Mood', 0);
      tl.to({}, { duration: 0.55 * d });

      // 2. 3D Z-Scatter Blast Swap!
      tl.addLabel('Z-Scatter Swap', '>');
      warmCards.forEach((el, i) => {
        tl.to(
          el,
          {
            x: Number(el.dataset.x) * 3.1,
            y: Number(el.dataset.y) * 2.9,
            scale: 2.35,
            opacity: 0,
            filter: `blur(${blurPx * 1.2}px)`,
            duration: 0.46 * d,
            ease: 'power3.in',
          },
          i === 0 ? '>' : `<+${(params.stagger * 0.4).toFixed(3)}`
        );
      });

      techCards.forEach((el, i) => {
        tl.to(
          el,
          {
            x: Number(el.dataset.x),
            y: Number(el.dataset.y),
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.48 * d,
            ease: easeOut,
          },
          i === 0 ? '>-0.24' : `<+${(params.stagger * 0.5).toFixed(3)}`
        );
      });

      // 3. Locked-Center Anchor Light -> Dark Theme Inversion!
      tl.addLabel('Dark Inversion', '>+0.12');
      tl.to(scene, { backgroundColor: '#0d0d10', duration: 0.60 * d, ease: easeInOut });
      tl.to(
        bar,
        {
          backgroundColor: '#18181f',
          borderColor: '#2e2e3a',
          color: '#f4f4f6',
          duration: 0.60 * d,
          ease: easeInOut,
        },
        '<'
      );
      tl.call(() => {
        promptEl.textContent = 'Combine these into visual exploration';
      });
      tl.to({}, { duration: 0.55 * d });

      // 4. Luminous Orb Singularity Bloom back to pure #FFFFFF!
      tl.addLabel('Singularity Bloom', '>');
      tl.to(bar, { opacity: 0, duration: 0.18 * d });
      tl.to(techCards, { opacity: 0, scale: 0.75, duration: 0.24 * d }, '<');
      tl.to(singLayer, { opacity: 1, duration: 0.18 * d }, '<');
      tl.to(
        orbs,
        {
          x: 0,
          y: 0,
          scale: 0.55,
          duration: 0.52 * d,
          stagger: params.stagger * 0.35,
          ease: 'power3.in',
        },
        '>-0.06'
      );
      tl.to(flash, { scale: 16, opacity: 1, duration: 0.42 * d, ease: easeOut }, '>-0.14');
      tl.to({}, { duration: 0.35 * d });

      return tl;
    },
  });
})();
