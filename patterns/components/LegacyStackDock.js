/**
 * Pattern 11: LegacyStackDock (Motionfly MCP 00:02.50 – 00:06.00)
 * ---------------------------------------------------------------------------
 * Rack-focus warm editorial backdrop plate -> horizontal whipped legacy tool
 * carousel (Pr -> Ae -> FC -> DR) with velocity-coupled blur -> snaps sharply
 * to Hero Emblem dead-center -> crisp iris expansion into white.
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
    stagger: 0.2,
    overshoot: 2.2,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'legacy-stack-dock',
    archetype: 'motionfly',
    name: 'LegacyStackDock',
    label: '11 · Legacy Stack Dock',
    timestamp: '00:02.50 – 00:06.00',
    tag: 'Replacement Dock',
    directorNote:
      'Rack-focusing the backdrop plate while whipping legacy icons (Pr, Ae, FCP, Resolve) past a centered focus underline compresses "skip the old software" into 2.6s with zero bullet points.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene mf-dock-stage" data-pat="legacy-stack-dock" style="position:relative;width:100%;height:100%;overflow:hidden;background:#0d0e14;">
          <div class="mf-plate" style="position:absolute;inset:-16px;background:linear-gradient(160deg,#fde68a 0%,#fca5a5 35%,#6366f1 70%,#0f172a 100%);"></div>
          <div style="position:absolute;top:36px;left:0;right:0;text-align:center;font:600 11px/1 ui-monospace,monospace;letter-spacing:0.12em;color:rgba(255,255,255,0.88);z-index:5;">SKIP THE EDITING SOFTWARE</div>
          <div class="mf-track" style="position:absolute;top:50%;left:50%;display:flex;align-items:center;gap:48px;transform:translate(-50%,-50%);z-index:10;">
            <div class="mf-icon" style="width:74px;height:74px;border-radius:18px;background:#1e1b4b;border:1.5px solid rgba(255,255,255,0.22);color:#c4b5fd;display:flex;align-items:center;justify-content:center;font:800 28px/1 Inter,sans-serif;box-shadow:0 14px 30px rgba(0,0,0,0.35);">Pr</div>
            <div class="mf-icon" style="width:74px;height:74px;border-radius:18px;background:#17153b;border:1.5px solid rgba(255,255,255,0.22);color:#a78bfa;display:flex;align-items:center;justify-content:center;font:800 28px/1 Inter,sans-serif;box-shadow:0 14px 30px rgba(0,0,0,0.35);">Ae</div>
            <div class="mf-icon" style="width:74px;height:74px;border-radius:18px;background:#18181b;border:1.5px solid rgba(255,255,255,0.22);color:#f4f4f5;display:flex;align-items:center;justify-content:center;font:800 26px/1 Inter,sans-serif;box-shadow:0 14px 30px rgba(0,0,0,0.35);">FC</div>
            <div class="mf-icon" style="width:74px;height:74px;border-radius:18px;background:#1e293b;border:1.5px solid rgba(255,255,255,0.22);color:#38bdf8;display:flex;align-items:center;justify-content:center;font:800 26px/1 Inter,sans-serif;box-shadow:0 14px 30px rgba(0,0,0,0.35);">DR</div>
            <div class="mf-icon mf-hero" style="width:82px;height:82px;border-radius:20px;background:#0b0b0f;border:2px solid #ffffff;color:#ffffff;display:flex;align-items:center;justify-content:center;font:800 26px/1 Inter,sans-serif;box-shadow:0 18px 40px rgba(0,0,0,0.48);">❖</div>
          </div>
          <div class="mf-underline" style="position:absolute;left:50%;top:calc(50% + 60px);width:86px;height:3px;border-radius:99px;background:#fff;transform:translateX(-50%);z-index:12;"></div>
          <div class="mf-iris" style="position:absolute;left:50%;top:50%;width:64px;height:64px;border-radius:999px;background:#ffffff;border:4px solid #7c3aed;transform:translate(-50%,-50%) scale(0);z-index:30;pointer-events:none;"></div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeInOut = helpers.resolveEase(params.easePreset, 'inOut', params.overshoot);
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);

      const plate = stage.querySelector('.mf-plate');
      const track = stage.querySelector('.mf-track');
      const hero = stage.querySelector('.mf-hero');
      const iris = stage.querySelector('.mf-iris');

      const blurProxy = { px: 0 };
      const maxBlur = 9 * params.blur;

      gsap.set(plate, { filter: 'blur(0px)', scale: 1.02 });
      gsap.set(track, { x: 244, filter: 'blur(0px)' });
      gsap.set(hero, { scale: 0.88 });
      gsap.set(iris, { scale: 0, opacity: 0 });

      const tl = gsap.timeline({ paused: true });

      // 1. Rack-focus plate + Whip icons across centered focus underline
      tl.addLabel('Rack Focus', 0);
      tl.to(plate, { filter: 'blur(10px)', scale: 1.08, duration: 0.65 * d, ease: easeOut }, 0);

      tl.addLabel('Legacy Whip', 0.15 * d);
      tl.to(track, { x: -248, duration: 1.25 * d, ease: easeInOut }, 0.15 * d);
      tl.to(
        blurProxy,
        {
          px: maxBlur,
          duration: 0.55 * d,
          ease: 'power2.in',
          onUpdate: () => {
            track.style.filter = blurProxy.px > 0.2 ? `blur(${blurProxy.px.toFixed(1)}px)` : 'none';
          },
        },
        0.2 * d
      );
      tl.to(
        blurProxy,
        {
          px: 0,
          duration: 0.5 * d,
          ease: 'power2.out',
          onUpdate: () => {
            track.style.filter = blurProxy.px > 0.2 ? `blur(${blurProxy.px.toFixed(1)}px)` : 'none';
          },
        },
        0.85 * d
      );

      // 2. Hero emblem detent pop & crisp hold
      tl.addLabel('Hero Lock', '>');
      tl.to(hero, { scale: 1.14, duration: 0.28 * d, ease: easeOut });
      tl.to({}, { duration: 0.42 * d });

      // 3. Circular iris expansion into next scene
      tl.addLabel('Iris Expand', '>');
      tl.set(iris, { opacity: 1 });
      tl.to(iris, { scale: 18, duration: 0.42 * d, ease: 'expo.in' });
      tl.to({}, { duration: 0.25 * d });

      return tl;
    },
  });
})();
