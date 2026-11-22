/**
 * Pattern 08: CardToChipDock (Rebrand MCP 00:07.13 – 00:11.47)
 * ---------------------------------------------------------------------------
 * 5-brand MCP result shelf -> cursor clicks hero card #3 (Wabi) -> siblings
 * collapse away while card #3 morphs continuously down & left to dock INSIDE
 * the prompt input box as an inline visual attachment chip!
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.04,
    overshoot: 0.25,
    blur: 1.0,
  };

  const AMATEUR = {
    duration: 1.95,
    easePreset: 'linear',
    stagger: 0.18,
    overshoot: 2.2,
    blur: 0.0,
  };

  const CARDS = [
    { name: 'Ideogram', bg: 'linear-gradient(135deg,#fb7185,#38bdf8)', fg: '#fff' },
    { name: 'Zero', bg: '#fde047', fg: '#1d4ed8' },
    { name: 'Wabi', bg: 'conic-gradient(from 120deg,#fb923c,#f43f5e,#8b5cf6,#38bdf8,#fb923c)', fg: '#fff', hero: true },
    { name: 'Amperos', bg: '#18181b', fg: '#f4f4f5' },
    { name: 'Superhuman', bg: '#9f1239', fg: '#ffe4e6' },
  ];

  window.MotionPatterns.push({
    id: 'card-to-chip-dock',
    archetype: 'rebrand',
    name: 'CardToChipDock',
    label: '08 · Card → Chip Dock',
    timestamp: '00:07.13 – 00:11.47',
    tag: 'Spatial Morph',
    directorNote:
      'Visually explains multi-turn image referencing without upload dialogs: the selected result card physically detaches, shrinks, and lands inside the prompt input slot.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene pat-white rb-ctd" data-pat="card-chip-dock">
          <!-- Result Shelf Header + Sibling Cards -->
          <div class="rb-shelf-wrap">
            <div class="rb-shelf-head"><span class="rb-serif-r">R Rebrand</span> <span class="rb-muted">Found 5 brands</span></div>
            <div class="rb-shelf-row">
              ${CARDS.map(
                (c, i) => `
                <div class="rb-res-card ${c.hero ? 'rb-res-ghost' : ''}" data-idx="${i}">
                  <div class="rb-res-thumb" style="background:${c.bg};color:${c.fg}">${c.name}</div>
                  <div class="rb-res-name">${c.name}</div>
                </div>`
              ).join('')}
            </div>
          </div>

          <!-- Multi-Turn Prompt Box (appears as Hero Card docks into top-left slot) -->
          <div class="rb-dock-box">
            <div class="rb-dock-bottom">
              <span class="rb-plus">+</span>
              <span class="rb-dock-typed"></span><span class="rb-dock-caret"></span>
              <span class="rb-submit-btn rb-dock-send">↑</span>
            </div>
          </div>

          <!-- Continuously Morphing Hero Card -> Inline Thumbnail Chip -->
          <div class="rb-hero-morph" style="background:${CARDS[2].bg}">
            <span class="rb-hero-morph-label">Wabi</span>
          </div>

          <!-- Tactile Pointer -->
          <div class="rb-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 3L19 11.5L11.8 13.6L9 20.5L4 3Z" fill="#111114" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeInOut = helpers.resolveEase(params.easePreset, 'inOut', params.overshoot);
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);

      const shelfWrap = stage.querySelector('.rb-shelf-wrap');
      const siblings = Array.from(stage.querySelectorAll('.rb-res-card:not(.rb-res-ghost)'));
      const dockBox = stage.querySelector('.rb-dock-box');
      const heroMorph = stage.querySelector('.rb-hero-morph');
      const heroLabel = stage.querySelector('.rb-hero-morph-label');
      const pointer = stage.querySelector('.rb-pointer');
      const typedEl = stage.querySelector('.rb-dock-typed');

      const followStr = 'I like this style, can you show me similar shots?';
      const typeProxy = { chars: 0 };

      // Hero Card starts right at slot #3 center (x=340, y=172, w=120, h=96) -> docks at (x=192, y=198, w=34, h=34)
      gsap.set(shelfWrap, { opacity: 1, y: 0 });
      gsap.set(siblings, { opacity: 1, scale: 1 });
      gsap.set(dockBox, { opacity: 0, y: 20 });
      gsap.set(heroMorph, { left: 340, top: 172, width: 120, height: 96, borderRadius: 12 });
      gsap.set(heroLabel, { opacity: 1 });
      gsap.set(pointer, { left: 560, top: 320, opacity: 0, scale: 1 });
      typedEl.textContent = '';

      const tl = gsap.timeline({ paused: true });

      // 1. Shelf Hold + Cursor Glides to Card #3
      tl.addLabel('Browse Shelf', 0);
      tl.to(pointer, { opacity: 1, duration: 0.16 * d });
      tl.to(pointer, { left: 398, top: 218, duration: 0.52 * d, ease: easeInOut }, '<');
      tl.to(pointer, { scale: 0.84, duration: 0.08 * d });
      tl.to(pointer, { scale: 1, duration: 0.10 * d });

      // 2. Siblings collapse while Hero Card #3 morphs & docks inside Prompt Box!
      tl.addLabel('Card → Chip Dock', '>');
      tl.to(siblings, {
        opacity: 0,
        scale: 0.86,
        duration: 0.24 * d,
        stagger: params.stagger * 0.5,
        ease: easeOut,
      });
      tl.to(shelfWrap, { opacity: 0, duration: 0.24 * d }, '<');
      tl.to(heroLabel, { opacity: 0, duration: 0.16 * d }, '<');
      tl.to(
        heroMorph,
        {
          left: 194,
          top: 196,
          width: 36,
          height: 36,
          borderRadius: 8,
          duration: 0.52 * d,
          ease: easeInOut,
        },
        '<'
      );
      tl.to(dockBox, { opacity: 1, y: 0, duration: 0.34 * d, ease: easeOut }, '<+0.14');

      // 3. Multi-turn follow-up prompt types beside the docked chip!
      tl.addLabel('Follow-Up Type', '>');
      tl.to(pointer, { left: 584, top: 254, duration: 0.45 * d, ease: easeInOut }, '<');
      tl.to(
        typeProxy,
        {
          chars: followStr.length,
          duration: 1.05 * d,
          ease: 'none',
          onUpdate: () => {
            typedEl.textContent = followStr.slice(0, Math.round(typeProxy.chars));
          },
        },
        '<'
      );

      tl.addLabel('Hold', '>');
      tl.to({}, { duration: 0.55 * d });

      return tl;
    },
  });
})();
