/**
 * Pattern 13: TimelineAssemblyReveal (Motionfly MCP 00:17.25 – 00:19.25 Upgrade)
 * ---------------------------------------------------------------------------
 * Meta "Film-Inside-a-Film" studio reveal: multi-track NLE timeline clips snap
 * under a live playhead while the generated app preview genuinely animates
 * inside its device frame (real habit checkoffs + progress bar — zero dead square).
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
    duration: 2.0,
    easePreset: 'linear',
    stagger: 0.2,
    overshoot: 2.2,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'timeline-assembly-reveal',
    archetype: 'motionfly',
    name: 'TimelineAssemblyReveal',
    label: '13 · Timeline Assembly',
    timestamp: '00:17.25 – 00:19.25',
    tag: 'Film-in-Film',
    directorNote:
      'Upgrades Motionfly\'s static angled phone into a live multi-track timeline assembly paired with real interactive state changes synced 1:1 to the sweeping playhead.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene mf-tl-stage" data-pat="timeline-assembly-reveal" style="position:relative;width:100%;height:100%;background:#0d0e14;padding:24px 36px;box-sizing:border-box;display:flex;flex-direction:column;gap:14px;font-family:Inter,sans-serif;color:#fafafa;">
          <div style="display:flex;justify-content:space-between;align-items:center;font:600 10px/1 ui-monospace,monospace;color:#a1a1aa;">
            <span><span style="color:#10b981;">●</span> LIVE GENERATED FILM · HABITFLOW</span>
            <span class="mf-tc" style="color:#fafafa;">00:00:00:00 / 00:00:30:00</span>
          </div>

          <!-- Top Live Preview Monitor -->
          <div style="flex:1;border-radius:14px;background:#14151e;border:1px solid rgba(255,255,255,0.1);padding:16px 26px;display:flex;align-items:center;gap:28px;">
            <div style="width:265px;border-radius:16px;background:#ffffff;border:4px solid #27272a;padding:12px 14px;color:#0b0b0f;flex-shrink:0;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <div>
                  <div style="font:700 8px/1 ui-monospace,monospace;color:#7c3aed;">HABITFLOW · TODAY</div>
                  <div style="font:800 15px/1.1 Inter,sans-serif;margin-top:2px;">Build better habits</div>
                </div>
                <div class="mf-pct" style="font:700 14px/1 ui-monospace,monospace;color:#7c3aed;">15%</div>
              </div>
              <div style="display:flex;flex-direction:column;gap:6px;">
                <div class="mf-hab" style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;background:#f8fafc;border:1px solid #e4e4e7;font:600 11px/1 Inter,sans-serif;"><span class="mf-hdot" style="width:13px;height:13px;border-radius:99px;border:1.5px solid #d4d4d8;display:inline-flex;align-items:center;justify-content:center;font-size:8px;color:#fff;"></span>Drink 2L water</div>
                <div class="mf-hab" style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;background:#f8fafc;border:1px solid #e4e4e7;font:600 11px/1 Inter,sans-serif;"><span class="mf-hdot" style="width:13px;height:13px;border-radius:99px;border:1.5px solid #d4d4d8;display:inline-flex;align-items:center;justify-content:center;font-size:8px;color:#fff;"></span>Morning 5K run</div>
                <div class="mf-hab" style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;background:#f8fafc;border:1px solid #e4e4e7;font:600 11px/1 Inter,sans-serif;"><span class="mf-hdot" style="width:13px;height:13px;border-radius:99px;border:1.5px solid #d4d4d8;display:inline-flex;align-items:center;justify-content:center;font-size:8px;color:#fff;"></span>Deep work · 90m</div>
              </div>
            </div>

            <div style="flex:1;">
              <div style="font:600 9px/1 ui-monospace,monospace;letter-spacing:0.08em;color:#7c3aed;margin-bottom:8px;">AUTO-ASSEMBLED SCENE</div>
              <div style="font:800 26px/1.08 Inter,sans-serif;letter-spacing:-0.03em;">Real UI motion,<br/><span style="color:#a1a1aa;">synced to every beat.</span></div>
            </div>
          </div>

          <!-- Bottom Multi-Track Timeline -->
          <div style="height:122px;border-radius:12px;background:#12131b;border:1px solid rgba(255,255,255,0.1);padding:10px 14px;position:relative;display:flex;flex-direction:column;justify-content:space-between;">
            ${[
              { name: 'VIDEO', c: '#7c3aed', clips: [[2, 24], [28, 34], [64, 32]] },
              { name: 'MOTION', c: '#db2777', clips: [[5, 22], [30, 30], [64, 30]] },
              { name: 'VOICE', c: '#ea580c', clips: [[3, 44], [50, 44]] },
              { name: 'AUDIO', c: '#0d9488', clips: [[0, 98]] },
            ]
              .map(
                (t) => `
              <div style="display:flex;align-items:center;gap:10px;height:20px;">
                <span style="width:48px;font:700 8px/1 ui-monospace,monospace;color:#a1a1aa;">${t.name}</span>
                <div style="flex:1;height:16px;position:relative;background:rgba(255,255,255,0.03);border-radius:4px;">
                  ${t.clips
                    .map(
                      ([l, w]) =>
                        `<div class="mf-clip" style="position:absolute;left:${l}%;width:${w}%;top:1px;bottom:1px;border-radius:4px;background:${t.c}38;border:1px solid ${t.c};transform-origin:left center;"></div>`
                    )
                    .join('')}
                </div>
              </div>`
              )
              .join('')}
            <div class="mf-playhead" style="position:absolute;left:72px;top:6px;bottom:6px;width:2px;background:#fff;box-shadow:0 0 10px #7c3aed;"></div>
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);

      const clips = Array.from(stage.querySelectorAll('.mf-clip'));
      const playhead = stage.querySelector('.mf-playhead');
      const habs = Array.from(stage.querySelectorAll('.mf-hab'));
      const hdots = Array.from(stage.querySelectorAll('.mf-hdot'));
      const pctEl = stage.querySelector('.mf-pct');
      const tcEl = stage.querySelector('.mf-tc');

      const playProxy = { sec: 0, pct: 15 };
      gsap.set(clips, { scaleX: 0, opacity: 0 });
      gsap.set(playhead, { x: 0 });

      const tl = gsap.timeline({ paused: true });

      // 1. Snap timeline clips into tracks
      tl.addLabel('Clips Snap', 0);
      tl.to(clips, {
        scaleX: 1,
        opacity: 1,
        duration: 0.32 * d,
        stagger: Math.max(0.02, params.stagger),
        ease: easeOut,
      });

      // 2. Sweep live playhead & check off real app habits in sync
      tl.addLabel('Playhead Sweep', 0.22 * d);
      tl.to(
        playhead,
        {
          x: 610,
          duration: 2.1 * d,
          ease: 'none',
        },
        0.22 * d
      );
      tl.to(
        playProxy,
        {
          sec: 28,
          pct: 100,
          duration: 2.1 * d,
          ease: 'none',
          onUpdate: () => {
            const s = Math.floor(playProxy.sec);
            const f = Math.floor((playProxy.sec - s) * 30);
            tcEl.textContent = `00:00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')} / 00:00:30:00`;
            pctEl.textContent = `${Math.round(playProxy.pct)}%`;
          },
        },
        0.22 * d
      );

      [0.65, 1.2, 1.75].forEach((atBase, idx) => {
        const at = atBase * d;
        tl.to(habs[idx], { backgroundColor: '#ecfdf5', borderColor: '#10b981', scale: 1.02, duration: 0.16 * d, ease: easeOut }, at);
        tl.to(habs[idx], { scale: 1, duration: 0.14 * d, ease: easeOut }, at + 0.16 * d);
        tl.call(() => {
          hdots[idx].style.background = '#10b981';
          hdots[idx].style.borderColor = '#10b981';
          hdots[idx].textContent = '✓';
        }, null, at);
      });

      tl.addLabel('Hold Proof', '>');
      tl.to({}, { duration: 0.55 * d });

      return tl;
    },
  });
})();
