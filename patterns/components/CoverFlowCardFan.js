/**
 * Pattern 04: CoverFlowCardFan (Fuser 00:32.67 – 00:36.33)
 * ---------------------------------------------------------------------------
 * Single centered hero card ("Track & Cutout") fans out a true 3D Y-axis
 * perspective deck (Pixel Stretch -> Riso Crops -> Slit-Scan -> Halftone -> Mosaic),
 * flips cards across the focal center on the 133 BPM beat, accelerates into
 * horizontal velocity blur, and clears with Fuser's magenta-violet gradient wipe.
 *
 * Try breaking it:
 * - Crank Stagger > 0.16s to feel the fan-out turn sluggish instead of crisp.
 * - Drop Blur to 0x during the final speed-blur to feel the harsh strobe.
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.045,
    overshoot: 0.25,
    blur: 1.0,
  };

  const AMATEUR = {
    duration: 1.9,
    easePreset: 'linear',
    stagger: 0.19,
    overshoot: 2.1,
    blur: 0.0,
  };

  const DECK = [
    { title: 'Track & Cutout', bg: '#111114', accent: '#f4f4f5', motif: 'cutout' },
    { title: 'Pixel Stretch', bg: '#1e1b4b', accent: '#c084fc', motif: 'stretch' },
    { title: 'Riso Crops', bg: '#f5f3ff', accent: '#6366f1', motif: 'riso' },
    { title: 'Slit-Scan', bg: '#27201c', accent: '#fb923c', motif: 'slit' },
    { title: 'Halftone', bg: '#18181b', accent: '#f472b6', motif: 'halftone' },
    { title: 'Mosaic', bg: '#fafaf9', accent: '#0f172a', motif: 'mosaic' },
  ];

  function renderCardArt(c) {
    if (c.motif === 'cutout') {
      return `<rect width="180" height="220" fill="#111114"/>
        <circle cx="90" cy="78" r="36" fill="#fafafa"/>
        <circle cx="48" cy="148" r="32" fill="#d4d4d8"/>
        <circle cx="132" cy="148" r="32" fill="#a1a1aa"/>
        <path d="M24 26 L38 26 M31 19 L31 33" stroke="#f472b6" stroke-width="2.5"/>`;
    }
    if (c.motif === 'stretch') {
      return `<rect width="180" height="220" fill="#18181b"/>
        <rect x="0" y="34" width="180" height="18" fill="#e4e4e7"/>
        <rect x="0" y="64" width="180" height="32" fill="#a1a1aa"/>
        <rect x="0" y="106" width="180" height="22" fill="#f472b6"/>
        <rect x="0" y="142" width="180" height="38" fill="#52525b"/>
        <circle cx="90" cy="110" r="46" fill="#fafafa" fill-opacity="0.88"/>`;
    }
    if (c.motif === 'riso') {
      return `<rect width="180" height="220" fill="#eef2ff"/>
        <circle cx="92" cy="96" r="56" fill="#4f46e5" fill-opacity="0.72"/>
        <circle cx="84" cy="102" r="48" fill="#ec4899" fill-opacity="0.45"/>
        <rect x="34" y="160" width="112" height="24" rx="4" fill="#312e81"/>`;
    }
    if (c.motif === 'slit') {
      return `<rect width="180" height="220" fill="#1c1917"/>
        <path d="M0 40 Q90 90 180 40 L180 95 Q90 145 0 95 Z" fill="#fdba74"/>
        <path d="M0 105 Q90 60 180 120 L180 175 Q90 120 0 175 Z" fill="#ea580c"/>`;
    }
    if (c.motif === 'halftone') {
      return `<rect width="180" height="220" fill="#09090b"/>
        ${[0, 1, 2, 3, 4]
          .map((r) =>
            [0, 1, 2, 3]
              .map(
                (col) =>
                  `<circle cx="${30 + col * 40}" cy="${32 + r * 40}" r="${6 + ((r + col) % 3) * 4}" fill="#f472b6"/>`
              )
              .join('')
          )
          .join('')}`;
    }
    return `<rect width="180" height="220" fill="#fafaf9"/>
      ${[0, 1, 2]
        .map((r) =>
          [0, 1, 2]
            .map(
              (col) =>
                `<rect x="${16 + col * 52}" y="${20 + r * 62}" width="44" height="54" rx="4" fill="${
                  (r + col) % 2 === 0 ? '#27272a' : '#f472b6'
                }"/>`
            )
            .join('')
        )
        .join('')}`;
  }

  window.MotionPatterns.push({
    id: 'cover-flow-card-fan',
    name: 'CoverFlowCardFan',
    label: '04 · 3D Cover-Flow Fan',
    timestamp: '00:32.67 – 00:36.33',
    tag: '3D Perspective',
    directorNote:
      'Breaks flat 2D UI monotony with crisp Y-axis card perspective. Cards snap flat to rotateY(0deg) at center focus, cycle on the 133 BPM beat, and exit via a magenta-violet gradient wipe.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene pat-white cf-scene" data-pat="cover-flow">
          <div class="cf-stage-3d">
            ${DECK.map(
              (card, i) => `
              <div class="fuser-node cf-card" data-idx="${i}">
                <div class="fuser-node-header">
                  <span class="fuser-dot"></span>
                  <span class="fuser-node-title">${card.title}</span>
                </div>
                <div class="cf-art-box">
                  <svg viewBox="0 0 180 220" class="cf-svg">${renderCardArt(card)}</svg>
                </div>
              </div>`
            ).join('')}
          </div>
          <!-- Full-bleed Magenta-to-Violet Pattern Interrupt Wipe -->
          <div class="cf-gradient-wipe"></div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);
      const easeInOut = helpers.resolveEase(params.easePreset, 'inOut', params.overshoot);
      const blurPx = 10 * params.blur;

      const stage3d = stage.querySelector('.cf-stage-3d');
      const cards = Array.from(stage.querySelectorAll('.cf-card'));
      const wipe = stage.querySelector('.cf-gradient-wipe');

      function layoutForActive(activeIdx) {
        return cards.map((_, i) => {
          const offset = i - activeIdx;
          if (offset === 0) {
            return { x: 0, z: 40, rotateY: 0, scale: 1.06, opacity: 1, zIndex: 20 };
          }
          const dir = offset > 0 ? 1 : -1;
          const abs = Math.abs(offset);
          return {
            x: dir * (138 + (abs - 1) * 62),
            z: -45 - abs * 36,
            rotateY: dir * -38,
            scale: Math.max(0.74, 0.92 - abs * 0.05),
            opacity: abs > 3 ? 0 : Math.max(0.45, 1 - abs * 0.16),
            zIndex: 20 - abs,
          };
        });
      }

      // Initial state: only card 0 enters cleanly center; others tucked behind
      gsap.set(stage3d, { filter: 'blur(0px)', x: 0 });
      gsap.set(wipe, { xPercent: 105, opacity: 1 });
      cards.forEach((card, i) => {
        if (i === 0) {
          gsap.set(card, { x: 0, y: 26, z: 40, rotateY: 0, scale: 0.88, opacity: 0, zIndex: 20 });
        } else {
          gsap.set(card, { x: 24, y: 0, z: -80, rotateY: -45, scale: 0.8, opacity: 0, zIndex: 15 - i });
        }
      });

      const tl = gsap.timeline({ paused: true });

      // 1. Hero card pops center
      tl.addLabel('Hero Pop', 0);
      tl.to(cards[0], {
        y: 0,
        scale: 1.06,
        opacity: 1,
        duration: 0.28 * d,
        ease: params.overshoot > 0.05 ? `back.out(${(1 + params.overshoot * 0.85).toFixed(2)})` : easeOut,
      });
      tl.to({}, { duration: 0.35 * d });

      // 2. 3D Fan-out to the right!
      tl.addLabel('3D Fan-Out', '>');
      const fan0 = layoutForActive(0);
      cards.slice(1).forEach((card, k) => {
        const cfg = fan0[k + 1];
        tl.to(
          card,
          {
            x: cfg.x,
            z: cfg.z,
            rotateY: cfg.rotateY,
            scale: cfg.scale,
            opacity: cfg.opacity,
            zIndex: cfg.zIndex,
            duration: 0.34 * d,
            ease: easeOut,
          },
          k === 0 ? '>' : `<+${params.stagger.toFixed(3)}`
        );
      });
      tl.to({}, { duration: 0.22 * d });

      // 3. Beat-locked rapid Cover-Flow flips (accelerating!)
      const flips = [
        { active: 1, dur: 0.32, hold: 0.22, label: 'Beat Flip 1' },
        { active: 2, dur: 0.28, hold: 0.18, label: 'Beat Flip 2' },
        { active: 3, dur: 0.22, hold: 0.12, label: 'Beat Flip 3' },
        { active: 4, dur: 0.16, hold: 0.06, label: 'Speed Blur' },
        { active: 5, dur: 0.14, hold: 0.04 },
      ];

      flips.forEach((step, sIdx) => {
        if (step.label) tl.addLabel(step.label, '>');
        const targets = layoutForActive(step.active);
        const stepDur = step.dur * d;
        const speedBlur = sIdx >= 3 ? blurPx * (0.65 + (sIdx - 2) * 0.55) : blurPx * 0.25;

        tl.to(stage3d, { filter: `blur(${speedBlur.toFixed(1)}px)`, duration: stepDur * 0.4 }, '>');
        cards.forEach((card, i) => {
          const cfg = targets[i];
          tl.to(
            card,
            {
              x: cfg.x,
              z: cfg.z,
              rotateY: cfg.rotateY,
              scale: cfg.scale,
              opacity: cfg.opacity,
              zIndex: cfg.zIndex,
              duration: stepDur,
              ease: easeInOut,
            },
            '<'
          );
        });
        tl.to(
          stage3d,
          { filter: sIdx >= 4 ? `blur(${(blurPx * 1.4).toFixed(1)}px)` : 'blur(0px)', duration: stepDur * 0.55 },
          `<+${(stepDur * 0.45).toFixed(3)}`
        );
        if (step.hold > 0) tl.to({}, { duration: step.hold * d });
      });

      // 4. Magenta-to-Violet Pattern Interrupt Gradient Swipe!
      tl.addLabel('Gradient Wipe', '>');
      tl.to(wipe, {
        xPercent: 0,
        duration: 0.26 * d,
        ease: 'power3.inOut',
      });
      tl.to(wipe, {
        xPercent: -105,
        duration: 0.26 * d,
        ease: 'power3.inOut',
      }, '>+0.12');

      return tl;
    },
  });
})();
