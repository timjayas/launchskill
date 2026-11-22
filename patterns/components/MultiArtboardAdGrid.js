/**
 * Pattern 15: MultiArtboardAdGrid (Hera Canvas 00:09.00 – 00:15.75)
 * ---------------------------------------------------------------------------
 * Freeform #F6F6F5 infinite dot-grid canvas (zero node-wire spaghetti):
 * 3 stacked parallel prompts pull back as 3 dark-pill AI agent cursors fan out
 * to spawn mixed-aspect commercial ad artboards (4:5, 16:9, 9:16, 1:1) with
 * localized pink radial dot-grid spawn ripples.
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.06,
    overshoot: 0.25,
    blur: 1.0,
  };

  const AMATEUR = {
    duration: 2.05,
    easePreset: 'linear',
    stagger: 0.22,
    overshoot: 2.4,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'multi-artboard-ad-grid',
    archetype: 'hera',
    name: 'MultiArtboardAdGrid',
    label: '15 · Multi-Artboard Ad Grid',
    timestamp: '00:09.00 – 00:15.75',
    tag: 'Freeform Canvas',
    directorNote:
      'Unlike Fuser’s wired node graph, Hera uses an open dot-grid canvas: 3 stacked prompts collapse smoothly as parallel dark-pill agent cursors spawn mixed-aspect ads (16:9, 9:16, 4:5, 1:1) with soft radial spawn ripples.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene hc-adgrid-stage" data-pat="multi-artboard-ad-grid" style="position:relative;width:100%;height:100%;overflow:hidden;background-color:#f6f6f5;background-image:radial-gradient(#d4d4d8 1.25px,transparent 1.25px);background-size:18px 18px;font-family:Inter,sans-serif;">
          <div class="hc-cam" style="position:absolute;inset:0;transform-origin:50% 50%;">
            <!-- Radial Spawn Ripples -->
            <div class="hc-ripple hc-r1" style="position:absolute;left:135px;top:118px;width:160px;height:160px;margin:-80px 0 0 -80px;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,0.34) 0%,rgba(236,72,153,0) 70%);border:1px solid rgba(236,72,153,0.35);pointer-events:none;"></div>
            <div class="hc-ripple hc-r2" style="position:absolute;left:470px;top:185px;width:210px;height:210px;margin:-105px 0 0 -105px;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,0.34) 0%,rgba(236,72,153,0) 70%);border:1px solid rgba(236,72,153,0.35);pointer-events:none;"></div>
            <div class="hc-ripple hc-r3" style="position:absolute;left:675px;top:175px;width:180px;height:180px;margin:-90px 0 0 -90px;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,0.34) 0%,rgba(236,72,153,0) 70%);border:1px solid rgba(236,72,153,0.35);pointer-events:none;"></div>
            <div class="hc-ripple hc-r4" style="position:absolute;left:195px;top:335px;width:170px;height:170px;margin:-85px 0 0 -85px;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,0.34) 0%,rgba(236,72,153,0) 70%);border:1px solid rgba(236,72,153,0.35);pointer-events:none;"></div>

            <!-- Mixed-Aspect Commercial Artboards -->
            <div class="hc-ab hc-ab1" style="position:absolute;left:56px;top:36px;width:116px;height:182px;border-radius:10px;background:radial-gradient(circle at 50% 25%,#fda4af,#f43f5e 52%,#9d174d);padding:10px;color:#fff;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 12px 28px rgba(15,15,22,0.14);">
              <div style="font-size:8px;font-weight:800;opacity:0.9;">Daily · 4:5</div>
              <div style="font-family:Georgia,serif;font-size:24px;font-weight:800;line-height:0.95;text-align:center;">GLOW</div>
              <div style="height:18px;border-radius:5px;background:linear-gradient(90deg,#db2777,#fb7185);display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;">Daily GLOW</div>
            </div>

            <div class="hc-ab hc-ab2" style="position:absolute;left:188px;top:30px;width:120px;height:188px;border-radius:10px;background:linear-gradient(155deg,#e11d48,#be185d 60%,#4c0549);padding:10px;color:#fff;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 12px 28px rgba(225,29,72,0.2);border:1.5px solid #f43f5e;">
              <div style="font-size:8px;font-weight:800;">Brand Font · 4:5</div>
              <div style="font-family:Georgia,serif;font-size:18px;font-weight:800;line-height:1.0;">Berry love.<br/>On the go.</div>
              <div style="padding:3px 7px;border-radius:99px;background:#fff;color:#4c0549;font-size:7px;font-weight:800;align-self:center;">Discover Glow</div>
            </div>

            <div class="hc-ab hc-ab3" style="position:absolute;left:362px;top:112px;width:214px;height:118px;border-radius:10px;background:linear-gradient(115deg,#db2777,#f472b6 42%,#fce7f3 75%,#fdba74);padding:12px 14px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 12px 28px rgba(15,15,22,0.14);">
              <div style="width:22px;height:82px;border-radius:5px;background:linear-gradient(180deg,#db2777,#fb7185);color:#fff;font-size:8px;font-weight:900;display:flex;align-items:center;justify-content:center;writing-mode:vertical-rl;">Daily</div>
              <div style="text-align:right;font-family:Georgia,serif;font-size:18px;font-weight:800;color:#4c0549;line-height:1.05;">One stick.<br/>Your moment.<div style="font-family:Inter,sans-serif;font-size:8px;font-weight:700;color:#9f1239;margin-top:4px;">16:9 Banner</div></div>
            </div>

            <div class="hc-ab hc-ab4" style="position:absolute;left:608px;top:42px;width:126px;height:216px;border-radius:10px;background:radial-gradient(circle at 50% 62%,#fff1f2,#f9a8d4 48%,#db2777);padding:12px 10px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;box-shadow:0 12px 28px rgba(15,15,22,0.15);">
              <div style="align-self:flex-start;font-size:8px;font-weight:800;color:#fff;">9:16 Story</div>
              <div style="font-family:Georgia,serif;font-size:15px;font-weight:800;color:#4c0549;text-align:center;line-height:1.05;">One stick.<br/>Your moment.</div>
              <div style="width:22px;height:88px;border-radius:5px;background:linear-gradient(180deg,#db2777,#fb7185);color:#fff;font-size:8px;font-weight:900;display:flex;align-items:center;justify-content:center;writing-mode:vertical-rl;">Daily</div>
            </div>

            <div class="hc-ab hc-ab5" style="position:absolute;left:118px;top:250px;width:132px;height:160px;border-radius:10px;background:#fdf8f4;padding:12px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 12px 28px rgba(15,15,22,0.12);border:1px solid #f4e8df;">
              <div style="font-size:8px;font-weight:900;color:#e11d48;">Daily · Editable</div>
              <div style="font-family:Georgia,serif;font-size:17px;font-weight:800;color:#4c0549;line-height:0.98;">No added<br/>sugar.<br/>All Daily.</div>
              <div style="height:18px;border-radius:4px;background:linear-gradient(90deg,#db2777,#fb7185);color:#fff;font-size:8px;font-weight:900;display:flex;align-items:center;justify-content:center;">Daily GLOW</div>
            </div>

            <div class="hc-ab hc-ab6" style="position:absolute;left:596px;top:276px;width:136px;height:136px;border-radius:10px;background:linear-gradient(145deg,#fde047,#fb923c 55%,#ea580c);padding:12px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 12px 28px rgba(15,15,22,0.14);">
              <div style="font-size:8px;font-weight:900;color:#4c0549;">1:1 Feed</div>
              <div style="font-family:Georgia,serif;font-size:18px;font-weight:800;color:#4c0549;line-height:1.0;">Hello,<br/>zesty side.</div>
              <div style="height:16px;border-radius:4px;background:#4c0549;color:#fff;font-size:7px;font-weight:800;display:flex;align-items:center;justify-content:center;">Shop Citrus</div>
            </div>

            <!-- 3 Stacked Parallel Prompt Cards -->
            <div class="hc-stack" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;">
              ${[
                { file: 'daily-glow-v11.jpg', cls: 'hc-p1' },
                { file: 'daily-moment-v6.jpg', cls: 'hc-p2' },
                { file: 'daily-hero-v11.jpg', cls: 'hc-p3' },
              ]
                .map(
                  (p) => `
                <div class="hc-prompt-card" style="width:340px;background:#fff;border-radius:14px;padding:10px 14px;border:1.5px solid #e4e4e7;box-shadow:0 14px 32px rgba(15,15,22,0.08);">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                    <span style="padding:2px 7px;border-radius:6px;background:#f4f4f5;font-size:9px;font-weight:700;color:#18181b;">Image</span>
                    <span style="padding:2px 7px;border-radius:6px;background:#fff1f2;color:#9f1239;font-size:9px;font-weight:600;font-family:monospace;">${p.file}</span>
                  </div>
                  <div style="display:flex;align-items:center;justify-content:space-between;">
                    <span class="${p.cls}" style="font-size:11px;font-weight:500;color:#18181b;min-height:15px;"></span>
                    <span style="width:20px;height:20px;border-radius:99px;background:#111116;color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;">↑</span>
                  </div>
                </div>`
                )
                .join('')}
            </div>

            <!-- 3 Parallel Dark-Pill AI Agent Cursors -->
            ${[
              { cls: 'hc-c1', label: 'Brand font' },
              { cls: 'hc-c2', label: 'Social formats' },
              { cls: 'hc-c3', label: 'Editable ad' },
            ]
              .map(
                (c) => `
              <div class="hc-agent ${c.cls}" style="position:absolute;left:0;top:0;display:flex;align-items:flex-start;gap:3px;z-index:30;">
                <span style="font-size:14px;color:#111116;line-height:1;">➤</span>
                <span style="margin-top:8px;padding:4px 10px;border-radius:999px;background:#141418;color:#fff;font-size:10px;font-weight:700;box-shadow:0 8px 18px rgba(10,10,16,0.22);white-space:nowrap;"><span style="color:#f43f5e;margin-right:4px;">✦</span>${c.label}</span>
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
      const easeInOut = helpers.resolveEase(params.easePreset, 'inOut', params.overshoot);

      const cam = stage.querySelector('.hc-cam');
      const stack = stage.querySelector('.hc-stack');
      const cards = Array.from(stage.querySelectorAll('.hc-prompt-card'));
      const abs = Array.from(stage.querySelectorAll('.hc-ab'));
      const ripples = Array.from(stage.querySelectorAll('.hc-ripple'));
      const c1 = stage.querySelector('.hc-c1');
      const c2 = stage.querySelector('.hc-c2');
      const c3 = stage.querySelector('.hc-c3');

      const pEls = [
        { el: stage.querySelector('.hc-p1'), txt: 'Use our brand font in the title' },
        { el: stage.querySelector('.hc-p2'), txt: 'Create 1:1 and 9:16 social formats' },
        { el: stage.querySelector('.hc-p3'), txt: 'Make this ad editable' },
      ];
      const proxy = { t: 0 };

      gsap.set(cam, { scale: 1.08 });
      gsap.set(cards, { opacity: 0, y: 18, scale: 0.94 });
      gsap.set(abs, { opacity: 0, scale: 0.78, y: 16 });
      gsap.set(ripples, { opacity: 0, scale: 0.2 });
      gsap.set([c1, c2, c3], { opacity: 0, scale: 0.6 });
      gsap.set(c1, { x: 340, y: 120 });
      gsap.set(c2, { x: 420, y: 200 });
      gsap.set(c3, { x: 360, y: 310 });
      pEls.forEach((p) => (p.el.textContent = ''));

      const tl = gsap.timeline({ paused: true });

      // 1. Stacked Parallel Prompts Enter & Type
      tl.addLabel('3 Prompts', 0);
      tl.to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.26 * d, stagger: Math.max(0.03, params.stagger), ease: easeOut }, 0);
      tl.to(
        proxy,
        {
          t: 1,
          duration: 0.75 * d,
          ease: 'none',
          onUpdate: () => {
            pEls.forEach((p) => {
              const n = Math.floor(proxy.t * p.txt.length);
              p.el.textContent = p.txt.slice(0, n);
            });
          },
        },
        0.12 * d
      );

      // 2. Pull Out & Fan Out 3 Parallel Agent Cursors
      const tFan = 0.96 * d;
      tl.addLabel('Agent Fan-Out', tFan);
      tl.to(stack, { opacity: 0, scale: 0.76, duration: 0.28 * d, ease: easeInOut }, tFan);
      tl.to(cam, { scale: 0.98, duration: 0.55 * d, ease: easeOut }, tFan);
      tl.to([c1, c2, c3], { opacity: 1, scale: 1, duration: 0.24 * d, stagger: params.stagger, ease: easeOut }, tFan + 0.06 * d);
      tl.to(c1, { x: 245, y: 196, duration: 0.52 * d, ease: easeInOut }, tFan + 0.08 * d);
      tl.to(c2, { x: 562, y: 210, duration: 0.55 * d, ease: easeInOut }, tFan + 0.1 * d);
      tl.to(c3, { x: 215, y: 374, duration: 0.52 * d, ease: easeInOut }, tFan + 0.12 * d);

      // 3. Staggered Multi-Aspect Artboard Spawns + Radial Pink Ripples
      const tSpawn = tFan + 0.18 * d;
      tl.addLabel('Multi-Aspect Spawn', tSpawn);
      tl.to(
        ripples,
        {
          scale: 1.25,
          opacity: 0.55,
          duration: 0.28 * d,
          stagger: Math.max(0.05, params.stagger),
          ease: easeOut,
        },
        tSpawn
      );
      tl.to(
        ripples,
        {
          scale: 1.6,
          opacity: 0,
          duration: 0.36 * d,
          stagger: Math.max(0.05, params.stagger),
          ease: 'power2.out',
        },
        tSpawn + 0.24 * d
      );
      tl.to(
        abs,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.34 * d,
          stagger: Math.max(0.05, params.stagger),
          ease: easeOut,
        },
        tSpawn + 0.06 * d
      );

      // 4. Second wave cursor glide to 1:1 square
      const tGlide = tSpawn + 0.65 * d;
      tl.addLabel('Canvas Hold', tGlide);
      tl.to(c2, { x: 642, y: 370, duration: 0.46 * d, ease: easeInOut }, tGlide);
      tl.to({}, { duration: 0.9 * d }, tGlide + 0.46 * d);

      return tl;
    },
  });
})();
