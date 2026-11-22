/**
 * Pattern 12: AgentExecutionTree (Motionfly MCP 00:10.50 – 00:17.25)
 * ---------------------------------------------------------------------------
 * Style-chip prompt bar -> crisp submit click (no rubbery border warp!) ->
 * Prompt docks top-right as chat bubble while a 5-step vertical connected MCP
 * execution spine draws hairline connectors and completes EVERY step cleanly.
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.055,
    overshoot: 0.3,
    blur: 1.0,
  };

  const AMATEUR = {
    duration: 1.95,
    easePreset: 'linear',
    stagger: 0.22,
    overshoot: 2.3,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'agent-execution-tree',
    archetype: 'motionfly',
    name: 'AgentExecutionTree',
    label: '12 · Agent Execution Tree',
    timestamp: '00:10.50 – 00:17.25',
    tag: 'MCP Pipeline',
    directorNote:
      'Turns multi-step autonomous agent orchestration into a clean connected vertical spine. Unlike Motionfly\'s frozen unfinished hold, every step checks off cleanly into a teal Ready badge.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      const steps = [
        'Writing the launch script',
        'Building 3D device stage',
        'Animating kinetic typography',
        'Synthesizing studio voiceover',
        'Mixing 120 BPM music & SFX',
      ];
      stage.innerHTML = `
        <div class="pat-scene pat-white mf-tree-stage" data-pat="agent-execution-tree" style="position:relative;width:100%;height:100%;overflow:hidden;background:#ffffff;padding:34px 54px;box-sizing:border-box;font-family:Inter,sans-serif;">
          <!-- User Prompt Bubble (Top Right) -->
          <div class="mf-bubble" style="margin-left:auto;max-width:470px;padding:12px 18px;border-radius:16px 16px 4px 16px;background:#f4f4f6;border:1px solid #e4e4e7;font-size:13px;font-weight:600;color:#18181b;">
            A 30-second launch video for my habit app, upbeat &amp; modern
          </div>

          <!-- Agent Header -->
          <div style="display:flex;align-items:center;gap:10px;margin:22px 0 18px;">
            <span style="width:24px;height:24px;border-radius:7px;background:#0b0b0f;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:12px;">❖</span>
            <span class="mf-status-title" style="font-size:15px;font-weight:700;color:#7c3aed;">Motionfly MCP · Generating...</span>
            <span class="mf-ready-pill" style="margin-left:8px;padding:4px 10px;border-radius:999px;background:#ccfbf1;border:1px solid #0d9488;color:#0f766e;font:700 10px/1 ui-monospace,monospace;">✓ READY · 0:30</span>
          </div>

          <!-- 5-Step Vertical Connected Pipeline -->
          <div style="display:flex;flex-direction:column;padding-left:8px;">
            ${steps
              .map(
                (label, i) => `
              <div class="mf-step-row" style="display:flex;align-items:stretch;gap:14px;">
                <div style="display:flex;flex-direction:column;align-items:center;width:20px;">
                  <div class="mf-dot" style="width:18px;height:18px;border-radius:999px;border:2px dashed #7c3aed;background:#f5f3ff;display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:800;flex-shrink:0;"></div>
                  ${
                    i < steps.length - 1
                      ? `<div style="width:2px;height:24px;background:#e4e4e7;overflow:hidden;"><div class="mf-line" style="width:100%;height:0%;background:#0d9488;"></div></div>`
                      : ''
                  }
                </div>
                <div style="padding-bottom:${i < steps.length - 1 ? 14 : 0}px;display:flex;align-items:center;gap:10px;">
                  <span class="mf-step-label" style="font-size:15px;font-weight:650;color:#18181b;">${label}</span>
                  <span class="mf-step-tag" style="font:600 10px/1 ui-monospace,monospace;color:#a1a1aa;">WAIT</span>
                </div>
              </div>`
              )
              .join('')}
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);

      const bubble = stage.querySelector('.mf-bubble');
      const statusTitle = stage.querySelector('.mf-status-title');
      const readyPill = stage.querySelector('.mf-ready-pill');
      const rows = Array.from(stage.querySelectorAll('.mf-step-row'));
      const dots = Array.from(stage.querySelectorAll('.mf-dot'));
      const lines = Array.from(stage.querySelectorAll('.mf-line'));
      const tags = Array.from(stage.querySelectorAll('.mf-step-tag'));

      gsap.set(bubble, { opacity: 0, y: 14 });
      gsap.set(rows, { opacity: 0, y: 10 });
      gsap.set(readyPill, { opacity: 0, scale: 0.78 });

      const tl = gsap.timeline({ paused: true });

      tl.addLabel('Prompt Dock', 0);
      tl.to(bubble, { opacity: 1, y: 0, duration: 0.28 * d, ease: easeOut });

      tl.addLabel('Pipeline Run', '>+0.08');
      const stepGap = Math.max(0.22, (0.34 + params.stagger * 1.4) * d);

      rows.forEach((row, i) => {
        const at = 0.34 * d + i * stepGap;
        tl.to(row, { opacity: 1, y: 0, duration: 0.22 * d, ease: easeOut }, at);
        tl.call(() => {
          tags[i].textContent = 'RUNNING';
          tags[i].style.color = '#7c3aed';
        }, null, at);

        const doneAt = at + 0.24 * d;
        tl.to(
          dots[i],
          {
            backgroundColor: '#0d9488',
            borderColor: '#0d9488',
            borderStyle: 'solid',
            scale: 1.12,
            duration: 0.14 * d,
            ease: easeOut,
          },
          doneAt
        );
        tl.to(dots[i], { scale: 1, duration: 0.12 * d, ease: easeOut }, doneAt + 0.14 * d);
        tl.call(() => {
          dots[i].textContent = '✓';
          tags[i].textContent = 'DONE';
          tags[i].style.color = '#0d9488';
        }, null, doneAt);

        if (lines[i]) {
          tl.to(lines[i], { height: '100%', duration: 0.22 * d, ease: easeOut }, doneAt + 0.04 * d);
        }
      });

      const finishAt = 0.34 * d + rows.length * stepGap + 0.16 * d;
      tl.addLabel('All Ready', finishAt);
      tl.call(() => {
        statusTitle.textContent = 'Film built in one shot';
        statusTitle.style.color = '#0d9488';
      }, null, finishAt);
      tl.to(readyPill, { opacity: 1, scale: 1, duration: 0.26 * d, ease: easeOut }, finishAt);
      tl.to({}, { duration: 0.85 * d });

      return tl;
    },
  });
})();
