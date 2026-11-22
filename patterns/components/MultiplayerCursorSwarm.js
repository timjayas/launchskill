/**
 * Pattern 14: MultiplayerCursorSwarm (Motionfly MCP 00:21.50 – 00:28.50 Upgrade)
 * ---------------------------------------------------------------------------
 * Centered two-tone thesis with live caret type-over orbited by 4 Figma-style
 * color-coded agent role cursors -> crisp 0.38s inward convergence match-cut ->
 * fast <=0.85s inline mark-to-wordmark reflow & calm CTA hold.
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.05,
    overshoot: 0.25,
    blur: 1.0,
  };

  const AMATEUR = {
    duration: 2.1,
    easePreset: 'linear',
    stagger: 0.22,
    overshoot: 2.4,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'multiplayer-cursor-swarm',
    archetype: 'motionfly',
    name: 'MultiplayerCursorSwarm',
    label: '14 · Agent Cursor Swarm',
    timestamp: '00:21.50 – 00:28.50',
    tag: 'Swarm → CTA',
    directorNote:
      'Replaces static feature grids with 4 multiplayer agent role cursors drifting smoothly around a caret type-over thesis, converging briskly into an inline mark→wordmark lockup (<= 0.85s).',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      const roles = [
        { name: 'Script', c: '#7c3aed', x: 135, y: 84 },
        { name: '3D Stage', c: '#db2777', x: 585, y: 88 },
        { name: 'Voice', c: '#ea580c', x: 165, y: 325 },
        { name: 'Audio Mix', c: '#059669', x: 555, y: 320 },
      ];
      stage.innerHTML = `
        <div class="pat-scene pat-white mf-swarm-stage" data-pat="multiplayer-cursor-swarm" style="position:relative;width:100%;height:100%;overflow:hidden;background:#ffffff;font-family:Inter,sans-serif;">
          <!-- 4 Multiplayer Agent Cursors -->
          ${roles
            .map(
              (r) => `
            <div class="mf-cursor-pill" data-bx="${r.x}" data-by="${r.y}" style="position:absolute;left:0;top:0;display:flex;align-items:flex-start;gap:4px;z-index:20;">
              <span style="font-size:15px;color:${r.c};line-height:1;">➤</span>
              <span style="margin-top:8px;padding:5px 11px;border-radius:999px;background:${r.c};color:#fff;font-size:11px;font-weight:700;box-shadow:0 6px 16px rgba(10,10,12,0.14);white-space:nowrap;">${r.name}</span>
            </div>`
            )
            .join('')}

          <!-- Layer 1: Caret Type-Over Thesis -->
          <div class="mf-thesis" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;">
            <div style="font-size:40px;font-weight:800;letter-spacing:-0.04em;color:#0b0b0f;">Studio launch films.</div>
            <div style="font-size:40px;font-weight:700;letter-spacing:-0.04em;color:#71717a;display:flex;align-items:center;min-height:48px;">
              <span class="mf-type-line"></span><span style="display:inline-block;width:3px;height:36px;margin-left:4px;border-radius:2px;background:#7c3aed;"></span>
            </div>
          </div>

          <!-- Layer 2: Fast Inline Mark -> Wordmark Reflow + CTA -->
          <div class="mf-finale" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;opacity:0;">
            <div style="display:flex;align-items:center;justify-content:center;">
              <div class="mf-mark" style="width:46px;height:46px;border-radius:12px;background:#0b0b0f;color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">❖</div>
              <div class="mf-word-wrap" style="width:0px;margin-left:0px;overflow:hidden;white-space:nowrap;">
                <span style="font-size:44px;font-weight:800;letter-spacing:-0.045em;color:#0b0b0f;">Motionfly</span>
              </div>
            </div>
            <div class="mf-cta" style="padding:10px 22px;border-radius:999px;background:#0b0b0f;color:#fff;font-size:13px;font-weight:700;">Get Started Free →</div>
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);

      const cursors = Array.from(stage.querySelectorAll('.mf-cursor-pill'));
      const thesis = stage.querySelector('.mf-thesis');
      const typeLine = stage.querySelector('.mf-type-line');
      const finale = stage.querySelector('.mf-finale');
      const mark = stage.querySelector('.mf-mark');
      const wordWrap = stage.querySelector('.mf-word-wrap');
      const cta = stage.querySelector('.mf-cta');

      const line2 = 'In minutes, not weeks.';
      const typeProxy = { chars: 0 };

      cursors.forEach((el) => {
        gsap.set(el, { x: Number(el.dataset.bx), y: Number(el.dataset.by), scale: 0.4, opacity: 0 });
      });
      gsap.set(thesis, { opacity: 0, y: 14, scale: 0.96, rotation: 0 });
      gsap.set(finale, { opacity: 0 });
      gsap.set(mark, { scale: 0.65, rotation: -32 });
      gsap.set(wordWrap, { width: 0, marginLeft: 0 });
      gsap.set(cta, { opacity: 0, y: 12 });
      typeLine.textContent = '';

      const tl = gsap.timeline({ paused: true });

      // 1. Swarm + Live Caret Type-Over
      tl.addLabel('Swarm Enter', 0);
      tl.to(thesis, { opacity: 1, y: 0, scale: 1, duration: 0.28 * d, ease: easeOut }, 0);
      tl.to(
        cursors,
        {
          scale: 1,
          opacity: 1,
          duration: 0.32 * d,
          stagger: Math.max(0.03, params.stagger),
          ease: easeOut,
        },
        0.06 * d
      );

      tl.addLabel('Caret Type-Over', 0.2 * d);
      tl.to(
        typeProxy,
        {
          chars: line2.length,
          duration: 1.05 * d,
          ease: 'none',
          onUpdate: () => {
            typeLine.textContent = line2.slice(0, Math.round(typeProxy.chars));
          },
        },
        0.2 * d
      );

      // Gentle alive drift while typing (zero dead freeze!)
      cursors.forEach((el, i) => {
        const bx = Number(el.dataset.bx);
        const by = Number(el.dataset.by);
        tl.to(
          el,
          {
            x: bx + (i % 2 === 0 ? 18 : -18),
            y: by + (i < 2 ? 12 : -12),
            duration: 1.15 * d,
            ease: 'sine.inOut',
          },
          0.32 * d
        );
      });

      // 2. Brisk Convergence Match-Cut
      tl.addLabel('Converge', 1.55 * d);
      tl.to(cursors, { x: 392, y: 215, scale: 0.3, opacity: 0, duration: 0.36 * d, ease: 'expo.in' }, 1.55 * d);
      tl.to(thesis, { scale: 0.65, rotation: -4, opacity: 0, duration: 0.36 * d, ease: 'expo.in' }, 1.55 * d);

      // 3. Fast <=0.85s Inline Mark -> Wordmark Reflow + Calm CTA Hold
      tl.addLabel('Mark Reflow', 1.91 * d);
      tl.set(finale, { opacity: 1 }, 1.91 * d);
      tl.to(mark, { scale: 1, rotation: 0, duration: 0.28 * d, ease: easeOut }, 1.91 * d);
      tl.to(wordWrap, { width: 212, marginLeft: 12, duration: 0.38 * d, ease: easeOut }, 2.15 * d);
      tl.to(cta, { opacity: 1, y: 0, duration: 0.28 * d, ease: easeOut }, 2.38 * d);
      tl.to({}, { duration: 1.05 * d });

      return tl;
    },
  });
})();
