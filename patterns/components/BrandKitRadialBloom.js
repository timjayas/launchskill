/**
 * Pattern 16: BrandKitRadialBloom (Hera Canvas 00:17.00 – 00:20.75)
 * ---------------------------------------------------------------------------
 * Centered URL prompt card ("Set up our brand for drink-daily.com") emits a
 * soft radial pink dot-grid wave as 4 modular Brand System artboards (Colors,
 * Logo, Type specimen, Starter set) spring radially into the 4 quadrants.
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
    duration: 2.0,
    easePreset: 'linear',
    stagger: 0.22,
    overshoot: 2.35,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'brand-kit-radial-bloom',
    archetype: 'hera',
    name: 'BrandKitRadialBloom',
    label: '16 · Brand-Kit Radial Bloom',
    timestamp: '00:17.00 – 00:20.75',
    tag: 'URL → Brand Kit',
    directorNote:
      'Turns boring brand-onboarding forms into a 2.5s spatial explosion: a single centered URL prompt radiates Colors, Logo, Type, and Starter Set artboards into balanced quadrants on the dot-grid canvas.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      const swatches = ['#fff7ed', '#4c0549', '#e11d48', '#fb7185', '#f472b6'];
      stage.innerHTML = `
        <div class="pat-scene hc-brandkit-stage" data-pat="brand-kit-radial-bloom" style="position:relative;width:100%;height:100%;overflow:hidden;background-color:#f6f6f5;background-image:radial-gradient(#d4d4d8 1.25px,transparent 1.25px);background-size:18px 18px;font-family:Inter,sans-serif;">
          <!-- Central Radial Wave -->
          <div class="hc-bk-wave" style="position:absolute;left:400px;top:225px;width:460px;height:460px;margin:-230px 0 0 -230px;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,0.3) 0%,rgba(236,72,153,0) 70%);border:1.5px solid rgba(236,72,153,0.3);pointer-events:none;"></div>

          <!-- Q1 Top-Center: Colors -->
          <div class="hc-bk-card hc-bk-colors" style="position:absolute;left:184px;top:28px;">
            <div style="font-size:9px;font-weight:700;color:#71717a;margin-bottom:4px;">Colors</div>
            <div style="background:#fff;border-radius:12px;padding:10px 14px;border:1px solid #e4e4e7;box-shadow:0 12px 26px rgba(15,15,22,0.08);display:flex;gap:10px;">
              ${swatches
                .map(
                  (c, i) =>
                    `<span style="width:34px;height:34px;border-radius:50%;background:${c};border:${
                      i === 0 ? '1px solid #e4e4e7' : 'none'
                    };"></span>`
                )
                .join('')}
            </div>
          </div>

          <!-- Q2 Top-Right: Logo -->
          <div class="hc-bk-card hc-bk-logo" style="position:absolute;left:584px;top:58px;">
            <div style="font-size:9px;font-weight:700;color:#71717a;margin-bottom:4px;">Logo</div>
            <div style="width:170px;height:94px;background:#fff;border-radius:12px;border:1.5px solid #e11d48;box-shadow:0 12px 28px rgba(225,29,72,0.12);display:flex;align-items:center;justify-content:center;">
              <span style="font-size:40px;font-weight:900;letter-spacing:-0.05em;background:linear-gradient(110deg,#f97316,#e11d48 55%,#be123c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Daily</span>
            </div>
          </div>

          <!-- Q3 Bottom-Left: Type -->
          <div class="hc-bk-card hc-bk-type" style="position:absolute;left:56px;top:292px;">
            <div style="font-size:9px;font-weight:700;color:#71717a;margin-bottom:4px;">Type</div>
            <div style="width:230px;background:#fff;border-radius:12px;padding:12px 16px;border:1px solid #e4e4e7;box-shadow:0 12px 26px rgba(15,15,22,0.08);">
              <div style="font-family:Georgia,serif;font-size:32px;font-weight:800;color:#4c0549;line-height:0.98;">Forrest</div>
              <div style="font-size:10px;color:#52525b;margin-top:5px;">DM Sans for copy, labels &amp; buttons</div>
            </div>
          </div>

          <!-- Q4 Bottom-Right: Starter Set -->
          <div class="hc-bk-card hc-bk-starter" style="position:absolute;left:436px;top:308px;">
            <div style="font-size:9px;font-weight:700;color:#71717a;margin-bottom:4px;">Starter set</div>
            <div style="width:262px;height:88px;border-radius:12px;background:#fff;padding:7px;border:1px solid #e4e4e7;box-shadow:0 12px 26px rgba(15,15,22,0.08);">
              <div style="width:100%;height:100%;border-radius:8px;background:linear-gradient(108deg,#fde047,#fb7185 48%,#db2777);display:flex;align-items:center;justify-content:space-around;">
                <div style="padding:5px 14px;border-radius:5px;background:#db2777;color:#fff;font-size:11px;font-weight:900;transform:rotate(-12deg);">Daily GLOW</div>
                <div style="padding:5px 12px;border-radius:5px;background:#ea580c;color:#fff;font-size:10px;font-weight:800;transform:rotate(10deg);">MIXED BOX</div>
              </div>
            </div>
          </div>

          <!-- Center Anchor Prompt Card -->
          <div class="hc-bk-prompt" style="position:absolute;left:50%;top:50%;width:316px;margin:-48px 0 0 -158px;background:#fff;border-radius:16px;padding:12px 16px;border:1.5px solid #e4e4e7;box-shadow:0 18px 40px rgba(15,15,22,0.1);">
            <div style="display:flex;gap:6px;margin-bottom:8px;">
              <span style="padding:2px 8px;border-radius:6px;background:#f4f4f5;font-size:9px;font-weight:700;color:#18181b;">Brand Kit</span>
            </div>
            <div style="font-size:13px;font-weight:600;color:#18181b;min-height:18px;display:flex;align-items:center;">
              <span class="hc-bk-text"></span><span class="hc-bk-caret" style="display:inline-block;width:2px;height:14px;margin-left:2px;background:#e11d48;"></span>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">
              <span style="font-size:10px;color:#71717a;">+ &nbsp; Auto ⌄ &nbsp; Count Auto ⌄</span>
              <span class="hc-bk-submit" style="width:22px;height:22px;border-radius:99px;background:#111116;color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;">↑</span>
            </div>
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);

      const prompt = stage.querySelector('.hc-bk-prompt');
      const textEl = stage.querySelector('.hc-bk-text');
      const caret = stage.querySelector('.hc-bk-caret');
      const submitBtn = stage.querySelector('.hc-bk-submit');
      const wave = stage.querySelector('.hc-bk-wave');

      const logo = stage.querySelector('.hc-bk-logo');
      const type = stage.querySelector('.hc-bk-type');
      const colors = stage.querySelector('.hc-bk-colors');
      const starter = stage.querySelector('.hc-bk-starter');

      const urlStr = 'Set up our brand for drink-daily.com';
      const proxy = { chars: 0 };

      gsap.set(prompt, { scale: 1.06 });
      gsap.set(wave, { scale: 0.15, opacity: 0 });
      gsap.set(logo, { opacity: 0, x: -130, y: 95, scale: 0.68 });
      gsap.set(type, { opacity: 0, x: 140, y: -70, scale: 0.68 });
      gsap.set(colors, { opacity: 0, x: 65, y: 110, scale: 0.68 });
      gsap.set(starter, { opacity: 0, x: -90, y: -75, scale: 0.68 });
      textEl.textContent = '';

      const tl = gsap.timeline({ paused: true });

      // 1. Type URL
      tl.addLabel('URL Type', 0);
      tl.to(
        proxy,
        {
          chars: urlStr.length,
          duration: 0.72 * d,
          ease: 'none',
          onUpdate: () => {
            textEl.textContent = urlStr.slice(0, Math.round(proxy.chars));
          },
        },
        0.06 * d
      );

      // 2. Submit Click & Radial Wave
      const tSub = 0.84 * d;
      tl.addLabel('Submit + Bloom', tSub);
      tl.to(caret, { opacity: 0, duration: 0.08 * d }, tSub);
      tl.to(submitBtn, { scale: 0.86, backgroundColor: '#e11d48', duration: 0.12 * d, ease: easeOut }, tSub);
      tl.to(prompt, { scale: 0.96, borderColor: '#e11d48', duration: 0.28 * d, ease: easeOut }, tSub);
      tl.to(wave, { scale: 1.05, opacity: 0.6, duration: 0.32 * d, ease: easeOut }, tSub + 0.04 * d);
      tl.to(wave, { scale: 1.55, opacity: 0, duration: 0.45 * d, ease: 'power2.out' }, tSub + 0.34 * d);

      // 3. Four Brand System Quadrants Spring Outward
      const stg = Math.max(0.05, params.stagger);
      tl.to(logo, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.36 * d, ease: easeOut }, tSub + 0.08 * d);
      tl.to(type, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.36 * d, ease: easeOut }, tSub + 0.08 * d + stg);
      tl.to(colors, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.36 * d, ease: easeOut }, tSub + 0.08 * d + stg * 2);
      tl.to(starter, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.36 * d, ease: easeOut }, tSub + 0.08 * d + stg * 3);

      // 4. Cognitive Readability Hold
      tl.addLabel('Brand Kit Hold', tSub + 0.56 * d);
      tl.to({}, { duration: 1.05 * d }, tSub + 0.56 * d);

      return tl;
    },
  });
})();
