/**
 * Pattern 02: VerticalSlotCarousel (Fuser 00:16.38 – 00:22.25)
 * ---------------------------------------------------------------------------
 * Asymmetric split layout: pink-bordered Tool Node preview pinned at left (33%),
 * paired with a 3-row vertical typography drum at right (68%).
 * Starts with readable 0.8s detents so the viewer learns the pattern, then
 * exponentially accelerates with velocity-coupled vertical motion blur.
 *
 * Try breaking it:
 * - Turn Blur to 0x to see why fast vertical scrolling looks stroby without blur.
 * - Increase Stagger to desynchronize the preview card swap from the label snap.
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.03,
    overshoot: 0.2,
    blur: 1.0,
  };

  const AMATEUR = {
    duration: 1.85,
    easePreset: 'linear',
    stagger: 0.2,
    overshoot: 2.0,
    blur: 0.0,
  };

  const TOOLS = [
    {
      name: 'GIF Converter',
      bg: '#f5f0ea',
      art: `<g>
        <rect x="16" y="18" width="66" height="84" rx="6" fill="#d6c5b3"/>
        <rect x="88" y="18" width="66" height="84" rx="6" fill="#cbb39c"/>
        <rect x="160" y="18" width="66" height="84" rx="6" fill="#bfa38a"/>
        <circle cx="121" cy="148" r="56" fill="#27272a"/>
        <circle cx="104" cy="140" r="7" fill="#fafaf9"/>
        <circle cx="138" cy="140" r="7" fill="#fafaf9"/>
        <path d="M106 168 Q121 178 136 168" stroke="#f472b6" stroke-width="4" fill="none" stroke-linecap="round"/>
      </g>`,
    },
    {
      name: 'Grid Crop',
      bg: '#111114',
      art: `<g fill="#ffffff">
        ${[0, 1, 2]
          .map((r) =>
            [0, 1, 2]
              .map(
                (c) =>
                  `<g transform="translate(${24 + c * 68}, ${26 + r * 72})">
                    <rect width="58" height="62" rx="4" fill="#18181b" stroke="#27272a"/>
                    <path d="M14 40 C22 22 36 22 44 18 C40 34 32 42 14 40 Z" fill="#fafafa"/>
                    <path d="M24 32 C16 20 12 16 10 12 C22 18 28 24 24 32 Z" fill="#e4e4e7"/>
                  </g>`
              )
              .join('')
          )
          .join('')}
      </g>`,
    },
    {
      name: 'Contact Sheet',
      bg: '#f4f4f5',
      art: `<g>
        <rect x="16" y="16" width="100" height="104" rx="6" fill="#fecdd3"/>
        <circle cx="66" cy="68" r="24" fill="#be123c"/>
        <rect x="124" y="16" width="100" height="104" rx="6" fill="#d9f99d"/>
        <circle cx="174" cy="68" r="24" fill="#3f6212"/>
        <rect x="16" y="128" width="100" height="104" rx="6" fill="#fde68a"/>
        <circle cx="66" cy="180" r="24" fill="#b45309"/>
        <rect x="124" y="128" width="100" height="104" rx="6" fill="#ddd6fe"/>
        <circle cx="174" cy="180" r="24" fill="#6d28d9"/>
      </g>`,
    },
    {
      name: 'Extract Color Palette',
      bg: '#ffffff',
      art: `<g font-family="Inter, sans-serif" font-size="11" font-weight="600">
        <rect x="14" y="14" width="212" height="40" rx="6" fill="#2d3b45"/><text x="26" y="38" fill="#fff">Dark Steel · #2D3B45</text>
        <rect x="14" y="60" width="212" height="40" rx="6" fill="#c7b299"/><text x="26" y="84" fill="#18181b">Warm Beige · #C7B299</text>
        <rect x="14" y="106" width="212" height="40" rx="6" fill="#e8dcc8"/><text x="26" y="130" fill="#18181b">Rich Cream · #E8DCC8</text>
        <rect x="14" y="152" width="212" height="40" rx="6" fill="#6b705c"/><text x="26" y="176" fill="#fff">Olive Drab · #6B705C</text>
        <rect x="14" y="198" width="212" height="40" rx="6" fill="#b5443e"/><text x="26" y="222" fill="#fff">Maroon Red · #B5443E</text>
      </g>`,
    },
    {
      name: 'Extract Audio',
      bg: '#18181b',
      art: `<g fill="#f472b6">
        ${Array.from({ length: 18 }, (_, i) => {
          const h = 24 + Math.round(Math.abs(Math.sin(i * 0.72)) * 110);
          return `<rect x="${20 + i * 11}" y="${126 - h / 2}" width="6" height="${h}" rx="3"/>`;
        }).join('')}
      </g>`,
    },
    {
      name: 'Posterize',
      bg: '#fdf2f8',
      art: `<g>
        <rect x="14" y="14" width="212" height="224" rx="10" fill="#ec4899"/>
        <circle cx="120" cy="112" r="70" fill="#1e1b4b"/>
        <circle cx="120" cy="112" r="42" fill="#f9a8d4"/>
        <circle cx="120" cy="112" r="18" fill="#111114"/>
      </g>`,
    },
    {
      name: 'Soft Focus',
      bg: '#fafafa',
      art: `<g>
        <defs><radialGradient id="sfGrad"><stop offset="0%" stop-color="#f97316"/><stop offset="60%" stop-color="#f472b6"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>
        <circle cx="120" cy="126" r="96" fill="url(#sfGrad)"/>
      </g>`,
    },
  ];

  window.MotionPatterns.push({
    id: 'vertical-slot-carousel',
    name: 'VerticalSlotCarousel',
    label: '02 · Vertical Slot Drum',
    timestamp: '00:16.38 – 00:22.25',
    tag: 'Accelerating Carousel',
    directorNote:
      'Gives 3 readable detents first so the eye learns the split-screen rule, then ramps velocity exponentially with directional vertical blur—implying an endless tool library.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene pat-white vsc-layout" data-pat="vertical-slot">
          <!-- Left column: Stationary Pink-Framed Preview Node -->
          <div class="vsc-left">
            <div class="fuser-node vsc-node">
              <div class="fuser-node-header">
                <span class="fuser-dot"></span>
                <span class="fuser-node-title vsc-active-title">${TOOLS[0].name}</span>
                <span class="fuser-node-grip">⋮⋮</span>
              </div>
              <div class="vsc-viewport">
                <div class="vsc-card-track">
                  ${TOOLS.map(
                    (t) => `
                    <div class="vsc-slide" style="background:${t.bg}">
                      <svg viewBox="0 0 240 252" class="vsc-svg">${t.art}</svg>
                    </div>`
                  ).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Right column: 3-Row Vertical Typography Slot Drum -->
          <div class="vsc-right">
            <div class="vsc-drum-mask">
              <div class="vsc-drum-track">
                ${TOOLS.map(
                  (t, i) => `<div class="vsc-drum-item" data-idx="${i}">${t.name}</div>`
                ).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeSnap = helpers.resolveEase(params.easePreset, 'inOut', params.overshoot);
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);
      const blurMax = 10 * params.blur;

      const node = stage.querySelector('.vsc-node');
      const cardTrack = stage.querySelector('.vsc-card-track');
      const drumTrack = stage.querySelector('.vsc-drum-track');
      const drumItems = Array.from(stage.querySelectorAll('.vsc-drum-item'));
      const titleEl = stage.querySelector('.vsc-active-title');

      const slideH = 236; // matches .vsc-viewport height
      const itemH = 44;   // matches .vsc-drum-item height

      function updateActiveLabel(activeIndex) {
        const clamped = Math.max(0, Math.min(TOOLS.length - 1, Math.round(activeIndex)));
        titleEl.textContent = TOOLS[clamped].name;
        drumItems.forEach((el, idx) => {
          const dist = Math.abs(idx - activeIndex);
          const op = dist < 0.5 ? 1 : dist < 1.5 ? 0.24 : 0.08;
          el.style.opacity = op.toFixed(2);
          el.style.fontWeight = dist < 0.45 ? '650' : '500';
        });
      }

      gsap.set(node, { x: 160, opacity: 0, filter: `blur(${blurMax}px)` });
      gsap.set(cardTrack, { y: 0, filter: 'blur(0px)' });
      gsap.set(drumTrack, { y: itemH, filter: 'blur(0px)' }); // item 0 centered in 3-row mask
      updateActiveLabel(0);

      const tl = gsap.timeline({ paused: true });
      const idxProxy = { val: 0 };

      // Whip-in from right
      tl.addLabel('Whip In', 0);
      tl.to(node, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.32 * d,
        ease: easeOut,
      });
      tl.to({}, { duration: 0.55 * d });

      // Step schedule: slows -> readable detents -> exponential acceleration!
      const steps = [
        { to: 1, move: 0.28, hold: 0.55, blur: 0.35, label: 'Detent 1' },
        { to: 2, move: 0.24, hold: 0.48, blur: 0.45, label: 'Detent 2' },
        { to: 3, move: 0.22, hold: 0.42, blur: 0.55, label: 'Detent 3' },
        { to: 4, move: 0.14, hold: 0.10, blur: 0.95, label: 'Accel Ramp' },
        { to: 5, move: 0.11, hold: 0.06, blur: 1.35 },
        { to: 6, move: 0.09, hold: 0.05, blur: 1.80 },
      ];

      steps.forEach((s) => {
        if (s.label) tl.addLabel(s.label, '>');
        const moveDur = s.move * d;
        const b = blurMax * s.blur;

        // Vertical velocity blur spike mid-scroll
        tl.to(
          [drumTrack, cardTrack],
          {
            filter: `blur(${b.toFixed(1)}px)`,
            duration: moveDur * 0.45,
            ease: 'power1.in',
          },
          '>'
        );

        tl.to(
          drumTrack,
          {
            y: itemH - s.to * itemH,
            duration: moveDur,
            ease: easeSnap,
          },
          '<'
        );

        tl.to(
          cardTrack,
          {
            y: -s.to * slideH,
            duration: moveDur,
            ease: easeSnap,
          },
          `<+${(params.stagger * 0.35).toFixed(3)}`
        );

        tl.to(
          idxProxy,
          {
            val: s.to,
            duration: moveDur,
            ease: 'none',
            onUpdate: () => updateActiveLabel(idxProxy.val),
          },
          '<'
        );

        tl.to(
          [drumTrack, cardTrack],
          {
            filter: 'blur(0px)',
            duration: moveDur * 0.55,
            ease: 'power2.out',
          },
          `<+${(moveDur * 0.45).toFixed(3)}`
        );

        if (s.hold > 0) {
          tl.to({}, { duration: s.hold * d });
        }
      });

      // Whip-out blur exit
      tl.addLabel('Speed Exit', '>');
      tl.to([node, drumTrack], {
        y: '-=90',
        opacity: 0,
        filter: `blur(${(blurMax * 1.6).toFixed(1)}px)`,
        duration: 0.22 * d,
        ease: 'power3.in',
      });

      return tl;
    },
  });
})();
