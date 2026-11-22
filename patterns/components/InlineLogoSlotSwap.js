/**
 * Pattern 10: InlineLogoSlotSwap (Rebrand MCP 00:22.75 – 00:28.97)
 * ---------------------------------------------------------------------------
 * High-contrast Display Serif thesis: "The first brand-identity / library your
 * [SLOT] can browse" — fixed-width baseline-locked inline slot cycles
 * AI -> OpenAI -> Claude -> Cursor with zero horizontal jitter, then wipes
 * cleanly into the Serif Brand Wordmark + URL end-card.
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.06,
    overshoot: 0.25,
    blur: 0.8,
  };

  const AMATEUR = {
    duration: 1.9,
    easePreset: 'linear',
    stagger: 0.22,
    overshoot: 2.2,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'inline-logo-slot-swap',
    archetype: 'rebrand',
    name: 'InlineLogoSlotSwap',
    label: '10 · Inline Logo Slot-Swap',
    timestamp: '00:22.75 – 00:28.97',
    tag: 'Editorial Finale',
    directorNote:
      'Delivers positioning AND ecosystem compatibility inside one anchored sentence. Locking the inline slot width prevents centered text from jittering horizontally when partner icons swap.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene pat-white rb-ils" data-pat="inline-logo-slot">
          <!-- Act A: Editorial Serif Headline + Inline Logo Slot -->
          <div class="rb-ils-thesis">
            <div class="rb-ils-mask"><div class="rb-ils-l1">The first brand-identity</div></div>
            <div class="rb-ils-mask">
              <div class="rb-ils-l2">
                <span>library your</span>
                <span class="rb-ils-slot">
                  <span class="rb-slot-item rb-slot-0">AI</span>
                  <span class="rb-slot-item rb-slot-1">
                    <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="32" r="24" stroke="#111114" stroke-width="5"/>
                      <ellipse cx="32" cy="22" rx="8" ry="14" stroke="#111114" stroke-width="3.5"/>
                      <ellipse cx="32" cy="22" rx="8" ry="14" stroke="#111114" stroke-width="3.5" transform="rotate(60 32 32)"/>
                      <ellipse cx="32" cy="22" rx="8" ry="14" stroke="#111114" stroke-width="3.5" transform="rotate(120 32 32)"/>
                    </svg>
                  </span>
                  <span class="rb-slot-item rb-slot-2">
                    <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
                      ${[0, 30, 60, 90, 120, 150]
                        .map(
                          (deg) =>
                            `<rect x="29" y="8" width="6" height="48" rx="3" fill="#d97757" transform="rotate(${deg} 32 32)"/>`
                        )
                        .join('')}
                    </svg>
                  </span>
                  <span class="rb-slot-item rb-slot-3">
                    <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
                      <polygon points="32,6 56,20 32,34 8,20" fill="#18181b"/>
                      <polygon points="8,20 32,34 32,58 8,44" fill="#52525b"/>
                      <polygon points="56,20 32,34 32,58 56,44" fill="#a1a1aa"/>
                    </svg>
                  </span>
                </span>
                <span>can browse</span>
              </div>
            </div>
          </div>

          <!-- Act B: Serif Brand Wordmark + Micro URL End-Card -->
          <div class="rb-ils-endcard">
            <div class="rb-ils-mask"><div class="rb-ils-mark">Rebrand</div></div>
            <div class="rb-ils-url">rebrand.gallery/mcp</div>
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);

      const thesis = stage.querySelector('.rb-ils-thesis');
      const l1 = stage.querySelector('.rb-ils-l1');
      const l2 = stage.querySelector('.rb-ils-l2');
      const slots = [0, 1, 2, 3].map((i) => stage.querySelector(`.rb-slot-${i}`));
      const endcard = stage.querySelector('.rb-ils-endcard');
      const mark = stage.querySelector('.rb-ils-mark');
      const url = stage.querySelector('.rb-ils-url');

      gsap.set(thesis, { opacity: 1 });
      gsap.set([l1, l2], { y: 46, opacity: 0 });
      gsap.set(slots, { y: 26, opacity: 0, scale: 0.72 });
      gsap.set(slots[0], { y: 0, opacity: 1, scale: 1 });
      gsap.set(endcard, { opacity: 0 });
      gsap.set(mark, { y: 56, opacity: 0 });
      gsap.set(url, { y: 12, opacity: 0 });

      const tl = gsap.timeline({ paused: true });

      // 1. Editorial Serif Thesis Masked Entrance
      tl.addLabel('Serif Reveal', 0);
      tl.to([l1, l2], {
        y: 0,
        opacity: 1,
        duration: 0.36 * d,
        stagger: params.stagger,
        ease: easeOut,
      });
      tl.to({}, { duration: 0.55 * d });

      // 2. Baseline-Locked Inline Logo Swaps (AI -> OpenAI -> Claude -> Cursor)
      const names = ['OpenAI', 'Claude', 'Cursor'];
      names.forEach((lbl, idx) => {
        const prev = slots[idx];
        const next = slots[idx + 1];
        tl.addLabel(lbl, '>');
        tl.to(prev, { y: -26, opacity: 0, scale: 0.72, duration: 0.18 * d, ease: 'power2.in' });
        tl.to(
          next,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.26 * d,
            ease: params.overshoot > 0.05 ? `back.out(${(1 + params.overshoot * 0.9).toFixed(2)})` : easeOut,
          },
          '<+0.06'
        );
        tl.to({}, { duration: 0.44 * d });
      });

      // 3. Calm Serif Brand Wordmark + URL End-Card Hold
      tl.addLabel('End-Card Hold', '>');
      tl.to(thesis, { opacity: 0, y: -16, duration: 0.20 * d, ease: 'power2.in' });
      tl.set(endcard, { opacity: 1 });
      tl.to(mark, { y: 0, opacity: 1, duration: 0.36 * d, ease: easeOut });
      tl.to(url, { y: 0, opacity: 1, duration: 0.28 * d, ease: easeOut }, `<+${(params.stagger * 1.2).toFixed(3)}`);
      tl.to({}, { duration: 1.05 * d });

      return tl;
    },
  });
})();
