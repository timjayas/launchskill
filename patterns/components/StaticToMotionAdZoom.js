/**
 * Pattern 18: StaticToMotionAdZoom (Hera Canvas 00:30.25 – 00:36.75 Upgrade)
 * ---------------------------------------------------------------------------
 * Static 4:5 source ad sits left beside a docked "Animation" prompt -> glowing
 * companion artboard blooms right playing live staggered typography + tumbling
 * product stick -> focal-locked Canvas-to-Full-Bleed Ad Zoom ("Showing Output
 * Inside the Tool") with zero jarring cut.
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
    duration: 2.15,
    easePreset: 'linear',
    stagger: 0.24,
    overshoot: 2.35,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'static-to-motion-ad-zoom',
    archetype: 'hera',
    name: 'StaticToMotionAdZoom',
    label: '18 · Static→Motion Ad Zoom',
    timestamp: '00:30.25 – 00:36.75',
    tag: 'Canvas → Full-Bleed',
    directorNote:
      'Demonstrates the "Showing Output Inside the Tool" law: prove static→motion causality side-by-side on the dot-grid first, then zoom the camera straight into the live artboard center while fading tool chrome so it becomes a full-bleed commercial.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene hc-s2m-stage" data-pat="static-to-motion-ad-zoom" style="position:relative;width:100%;height:100%;overflow:hidden;background-color:#f6f6f5;background-image:radial-gradient(#d4d4d8 1.25px,transparent 1.25px);background-size:18px 18px;font-family:Inter,sans-serif;">
          <div class="hc-s2m-cream-wash" style="position:absolute;inset:0;background:#fdf8f4;opacity:0;pointer-events:none;"></div>

          <div class="hc-s2m-rig" style="position:absolute;inset:0;transform-origin:0 0;">
            <!-- Left Static Source Ad -->
            <div class="hc-s2m-left" style="position:absolute;left:188px;top:66px;width:176px;height:212px;">
              <div style="font-size:8px;font-weight:700;color:#71717a;font-family:monospace;margin-bottom:4px;">STATIC · JPG</div>
              <div style="width:100%;height:100%;border-radius:11px;background:#fdf8f4;border:1px solid #e4e4e7;padding:13px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 12px 28px rgba(15,15,22,0.1);">
                <div style="font-size:9px;font-weight:900;color:#e11d48;">Daily</div>
                <div style="font-family:Georgia,serif;font-size:21px;font-weight:800;color:#4c0549;line-height:0.96;">No added<br/>sugar.<br/>All Daily.</div>
                <div style="height:22px;border-radius:4px;background:linear-gradient(90deg,#db2777,#fb7185);color:#fff;font-size:9px;font-weight:900;display:flex;align-items:center;justify-content:center;transform:rotate(-3deg);">Daily GLOW</div>
              </div>
            </div>

            <!-- Right Animated Companion Artboard (Center at x=520, y=166) -->
            <div class="hc-s2m-right" style="position:absolute;left:414px;top:40px;width:212px;height:254px;">
              <div class="hc-s2m-livepill" style="position:absolute;top:-20px;left:0;padding:2px 8px;border-radius:99px;background:#141418;color:#fff;font-size:8px;font-weight:700;font-family:monospace;">● LIVE MOTION · 60 FPS</div>
              <div class="hc-s2m-card" style="width:100%;height:100%;border-radius:12px;background:#fdf8f4;border:2px solid #f43f5e;padding:15px 18px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 16px 36px rgba(225,29,72,0.18);overflow:hidden;">
                <div class="hc-m-brand" style="font-size:10px;font-weight:900;color:#e11d48;">Daily</div>
                <div style="font-family:Georgia,serif;font-size:27px;font-weight:800;color:#4c0549;line-height:0.95;">
                  <div class="hc-m-l1">No added</div>
                  <div class="hc-m-l2">sugar.</div>
                  <div class="hc-m-l3">All Daily.</div>
                </div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:7px;">
                  <div class="hc-m-stick" style="width:154px;height:26px;border-radius:5px;background:linear-gradient(90deg,#db2777,#fb7185);color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:space-between;padding:0 10px;box-shadow:0 8px 16px rgba(76,5,73,0.2);">
                    <span>Daily</span><span style="font-size:7px;background:rgba(255,255,255,0.75);color:#4c0549;padding:1px 5px;border-radius:99px;">GLOW</span>
                  </div>
                  <div class="hc-m-cta" style="padding:4px 11px;border-radius:99px;background:#4c0549;color:#fff;font-size:8px;font-weight:700;">Discover Daily →</div>
                </div>
              </div>
            </div>

            <!-- Docked Animation Prompt Bar -->
            <div class="hc-s2m-prompt" style="position:absolute;left:244px;top:334px;width:312px;background:#fff;border-radius:14px;padding:10px 14px;border:1.5px solid #e4e4e7;box-shadow:0 14px 32px rgba(15,15,22,0.09);">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <span style="padding:2px 7px;border-radius:6px;background:#f4f4f5;font-size:9px;font-weight:700;color:#18181b;">Animation</span>
                <span style="padding:2px 7px;border-radius:6px;background:#fff1f2;color:#9f1239;font-size:8px;font-family:monospace;">daily-sugar-v2.jpg</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span class="hc-s2m-text" style="font-size:11px;font-weight:600;color:#18181b;min-height:15px;"></span>
                <span class="hc-s2m-submit" style="width:20px;height:20px;border-radius:99px;background:#111116;color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;">↑</span>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);
      const easeInOut = helpers.resolveEase(params.easePreset, 'inOut', params.overshoot);

      const rig = stage.querySelector('.hc-s2m-rig');
      const creamWash = stage.querySelector('.hc-s2m-cream-wash');
      const leftAd = stage.querySelector('.hc-s2m-left');
      const rightWrap = stage.querySelector('.hc-s2m-right');
      const livePill = stage.querySelector('.hc-s2m-livepill');
      const card = stage.querySelector('.hc-s2m-card');
      const prompt = stage.querySelector('.hc-s2m-prompt');
      const textEl = stage.querySelector('.hc-s2m-text');
      const submitBtn = stage.querySelector('.hc-s2m-submit');

      const lines = [
        stage.querySelector('.hc-m-l1'),
        stage.querySelector('.hc-m-l2'),
        stage.querySelector('.hc-m-l3'),
      ];
      const stick = stage.querySelector('.hc-m-stick');
      const cta = stage.querySelector('.hc-m-cta');

      const promptStr = 'Animate this ad';
      const proxy = { chars: 0 };

      gsap.set(rig, { x: 0, y: 0, scale: 1 });
      gsap.set(creamWash, { opacity: 0 });
      gsap.set(leftAd, { x: 96, opacity: 1 });
      gsap.set(rightWrap, { opacity: 0, scale: 0.78 });
      gsap.set(lines, { opacity: 0, y: 16 });
      gsap.set(stick, { opacity: 0, y: -22, rotation: -20, scale: 0.85 });
      gsap.set(cta, { opacity: 0, scale: 0.8 });
      textEl.textContent = '';

      const tl = gsap.timeline({ paused: true });

      // 1. Type Animation Prompt
      tl.addLabel('Prompt', 0);
      tl.to(
        proxy,
        {
          chars: promptStr.length,
          duration: 0.48 * d,
          ease: 'none',
          onUpdate: () => {
            textEl.textContent = promptStr.slice(0, Math.round(proxy.chars));
          },
        },
        0.04 * d
      );

      // 2. Submit -> Side-by-Side Companion Bloom + Live Motion
      const tBloom = 0.58 * d;
      tl.addLabel('Static → Motion', tBloom);
      tl.to(submitBtn, { backgroundColor: '#e11d48', scale: 0.86, duration: 0.1 * d }, tBloom);
      tl.to(leftAd, { x: 0, duration: 0.36 * d, ease: easeOut }, tBloom);
      tl.to(rightWrap, { opacity: 1, scale: 1, duration: 0.34 * d, ease: easeOut }, tBloom + 0.04 * d);
      tl.to(lines, { opacity: 1, y: 0, duration: 0.28 * d, stagger: Math.max(0.05, params.stagger), ease: easeOut }, tBloom + 0.18 * d);
      tl.to(stick, { opacity: 1, y: 0, rotation: -3, scale: 1, duration: 0.38 * d, ease: easeOut }, tBloom + 0.36 * d);
      tl.to(cta, { opacity: 1, scale: 1, duration: 0.24 * d, ease: easeOut }, tBloom + 0.52 * d);

      // 3. Focal-Locked Canvas-to-Full-Bleed Ad Zoom (center of right artboard is x=520, y=167 -> maps to 400,225 at z=1.82)
      const tZoom = tBloom + 1.05 * d;
      const z = 1.82;
      const targetX = 400 - 520 * z;
      const targetY = 225 - 167 * z;
      tl.addLabel('Full-Bleed Zoom', tZoom);
      tl.to(rig, { x: targetX, y: targetY, scale: z, duration: 0.62 * d, ease: easeInOut }, tZoom);
      tl.to([leftAd, prompt, livePill], { opacity: 0, duration: 0.28 * d, ease: easeOut }, tZoom);
      tl.to(card, { borderColor: 'rgba(244,63,94,0)', borderRadius: 0, boxShadow: 'none', duration: 0.36 * d }, tZoom + 0.14 * d);
      tl.to(creamWash, { opacity: 1, duration: 0.34 * d }, tZoom + 0.22 * d);
      tl.to(stick, { rotation: 2, duration: 0.5 * d, ease: easeInOut }, tZoom + 0.2 * d);

      tl.addLabel('Full-Bleed Hold', tZoom + 0.65 * d);
      tl.to({}, { duration: 0.85 * d }, tZoom + 0.65 * d);

      return tl;
    },
  });
})();
