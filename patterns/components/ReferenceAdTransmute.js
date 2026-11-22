/**
 * Pattern 17: ReferenceAdTransmute (Hera Canvas 00:25.50 – 00:29.00)
 * ---------------------------------------------------------------------------
 * 3 disparate competitor reference ads fan onto the dot-grid canvas -> cursor
 * taps -> staggered pink shimmer sweep transmutes all 3 cards IN-PLACE into
 * the user's brand kit while preserving exact 1:1 layout geometry.
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.08,
    overshoot: 0.25,
    blur: 1.0,
  };

  const AMATEUR = {
    duration: 2.1,
    easePreset: 'linear',
    stagger: 0.24,
    overshoot: 2.3,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'reference-ad-transmute',
    archetype: 'hera',
    name: 'ReferenceAdTransmute',
    label: '17 · Reference Ad Transmute',
    timestamp: '00:25.50 – 00:29.00',
    tag: 'In-Place Swap',
    directorNote:
      'Unlike Rebrand’s Z-scatter blast, Hera keeps all 3 reference ad skeletons locked at exact canvas coordinates and sweeps a localized pink shimmer across each card—making 1:1 layout preservation effortless to read.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene hc-ref-stage" data-pat="reference-ad-transmute" style="position:relative;width:100%;height:100%;overflow:hidden;background-color:#f6f6f5;background-image:radial-gradient(#d4d4d8 1.25px,transparent 1.25px);background-size:18px 18px;font-family:Inter,sans-serif;">
          <div class="hc-ref-badge" style="position:absolute;top:16px;left:50%;transform:translateX(-50%);padding:5px 14px;border-radius:999px;background:#fff;border:1px solid #e4e4e7;font-size:10px;font-weight:700;color:#27272a;box-shadow:0 8px 20px rgba(15,15,22,0.06);white-space:nowrap;">
            3 Reference Ads · Click to Restyle In-Place
          </div>

          <!-- Card 1: 9:16 Comparison Layout -->
          <div class="hc-ref-slot hc-rs1" style="position:absolute;left:108px;top:64px;width:166px;height:274px;border-radius:12px;overflow:hidden;box-shadow:0 14px 32px rgba(15,15,22,0.14);">
            <div style="position:absolute;inset:0;background:linear-gradient(180deg,#6d28d9,#4c1d95);padding:12px;color:#fff;display:flex;flex-direction:column;justify-content:space-between;">
              <div style="text-align:center;"><div style="font-size:8px;color:#fde047;font-weight:800;">REFERENCE · 9:16</div><div style="font-size:13px;font-weight:800;margin-top:3px;">Half the Price,<br/>Better Ingredients</div></div>
              <div style="background:rgba(0,0,0,0.25);border-radius:8px;padding:7px;font-size:9px;display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:3px;">
                <span>Spec</span><b style="color:#fde047;text-align:center;">$27</b><span style="text-align:center;">$49</span>
                <span>L-Theanine</span><b style="color:#fde047;text-align:center;">✓</b><span style="text-align:center;">✕</span>
                <span>Chaga</span><b style="color:#fde047;text-align:center;">✓</b><span style="text-align:center;">✕</span>
              </div>
              <div style="background:#111;padding:5px;border-radius:5px;font-size:8px;text-align:center;font-weight:700;">35% OFF TODAY</div>
            </div>
            <div class="hc-brand-layer" style="position:absolute;inset:0;clip-path:inset(0 0 100% 0);background:linear-gradient(180deg,#e11d48,#fb7185 38%,#4c0549 38%,#3b0764);padding:12px;color:#fff;display:flex;flex-direction:column;justify-content:space-between;">
              <div style="text-align:center;"><div style="font-size:9px;font-weight:900;">Daily</div><div style="font-family:Georgia,serif;font-size:15px;font-weight:800;margin-top:2px;">Water with<br/>Benefits.</div></div>
              <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:7px;font-size:9px;display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:3px;">
                <span>Spec</span><b style="text-align:center;">Daily</b><span style="text-align:center;">Plain</span>
                <span>Collagen</span><b style="color:#34d399;text-align:center;">✓</b><span style="color:#f43f5e;text-align:center;">✕</span>
                <span>0g Sugar</span><b style="color:#34d399;text-align:center;">✓</b><span style="color:#f43f5e;text-align:center;">✕</span>
              </div>
              <div style="background:#fdf2f8;color:#4c0549;padding:5px;border-radius:99px;font-size:8px;text-align:center;font-weight:800;">Try Daily Glow</div>
            </div>
            <div class="hc-shimmer" style="position:absolute;left:0;right:0;top:-24px;height:24px;background:linear-gradient(180deg,transparent,rgba(244,63,94,0.8),transparent);pointer-events:none;"></div>
          </div>

          <!-- Card 2: 4:5 Callout Hero -->
          <div class="hc-ref-slot hc-rs2" style="position:absolute;left:316px;top:98px;width:168px;height:244px;border-radius:12px;overflow:hidden;box-shadow:0 14px 32px rgba(15,15,22,0.14);">
            <div style="position:absolute;inset:0;background:radial-gradient(circle,#f472b6,#db2777 65%,#831843);padding:12px;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:space-between;">
              <div style="font-size:8px;font-weight:700;">REFERENCE · 1:1</div>
              <div style="font-size:20px;font-weight:900;font-style:italic;text-align:center;line-height:0.98;">Shirley<br/>TEMPLE</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;width:100%;font-size:7px;font-weight:800;text-align:center;">
                <span style="background:rgba(255,255,255,0.22);padding:4px;border-radius:4px;">PREBIOTIC</span>
                <span style="background:rgba(255,255,255,0.22);padding:4px;border-radius:4px;">20 CAL</span>
              </div>
            </div>
            <div class="hc-brand-layer" style="position:absolute;inset:0;clip-path:inset(0 0 100% 0);background:radial-gradient(circle at 50% 25%,#fda4af,#f43f5e 52%,#9d174d);padding:12px;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:space-between;">
              <div style="font-size:10px;font-weight:900;">Daily</div>
              <div style="font-family:Georgia,serif;font-size:28px;font-weight:800;line-height:0.95;">GLOW</div>
              <div style="display:flex;gap:4px;font-size:7px;font-weight:800;">
                <span style="background:#fff;color:#881337;padding:3px 6px;border-radius:4px;">COLLAGEN</span>
                <span style="background:#fff;color:#881337;padding:3px 6px;border-radius:4px;">BIOTIN</span>
              </div>
              <div style="background:#4c0549;padding:4px 12px;border-radius:99px;font-size:8px;font-weight:700;">Discover Glow</div>
            </div>
            <div class="hc-shimmer" style="position:absolute;left:0;right:0;top:-24px;height:24px;background:linear-gradient(180deg,transparent,rgba(244,63,94,0.8),transparent);pointer-events:none;"></div>
          </div>

          <!-- Card 3: 4:5 Dual-Pour -->
          <div class="hc-ref-slot hc-rs3" style="position:absolute;left:526px;top:128px;width:166px;height:252px;border-radius:12px;overflow:hidden;box-shadow:0 14px 32px rgba(15,15,22,0.14);">
            <div style="position:absolute;inset:0;background:linear-gradient(180deg,#dbeafe,#c7d2fe 55%,#818cf8);padding:12px;color:#1e1b4b;display:flex;flex-direction:column;align-items:center;justify-content:space-between;">
              <div style="text-align:center;"><div style="font-size:8px;font-weight:800;color:#4338ca;">MIX + MAKE</div><div style="font-size:14px;font-weight:900;margin-top:3px;">PURPLE CRISPY<br/>WATER</div></div>
              <div style="display:flex;gap:6px;"><span style="background:#1e3a8a;color:#fff;padding:4px 8px;border-radius:4px;font-size:7px;font-weight:800;transform:rotate(22deg);">BLUE RAZ</span><span style="background:#0369a1;color:#fff;padding:4px 8px;border-radius:4px;font-size:7px;font-weight:800;transform:rotate(-22deg);">COTTON</span></div>
              <div style="background:#1e1b4b;color:#fff;padding:4px 10px;border-radius:99px;font-size:8px;font-weight:700;">TRY IT NOW</div>
            </div>
            <div class="hc-brand-layer" style="position:absolute;inset:0;clip-path:inset(0 0 100% 0);background:linear-gradient(180deg,#fff7ed,#fbcfe8 62%,#e11d48);padding:12px;color:#4c0549;display:flex;flex-direction:column;align-items:center;justify-content:space-between;">
              <div style="text-align:center;"><div style="font-size:10px;font-weight:900;color:#e11d48;">Daily</div><div style="font-family:Georgia,serif;font-size:16px;font-weight:800;margin-top:3px;">Water with<br/>Benefits.</div></div>
              <div style="display:flex;gap:6px;"><span style="background:#db2777;color:#fff;padding:4px 8px;border-radius:4px;font-size:7px;font-weight:800;transform:rotate(22deg);">GLOW</span><span style="background:#7c3aed;color:#fff;padding:4px 8px;border-radius:4px;font-size:7px;font-weight:800;transform:rotate(-22deg);">FOCUS</span></div>
              <div style="background:#4c0549;color:#fff;padding:4px 10px;border-radius:99px;font-size:8px;font-weight:700;">Glow + Hydration</div>
            </div>
            <div class="hc-shimmer" style="position:absolute;left:0;right:0;top:-24px;height:24px;background:linear-gradient(180deg,transparent,rgba(244,63,94,0.8),transparent);pointer-events:none;"></div>
          </div>

          <!-- Tactile Click Pointer -->
          <div class="hc-ref-cursor" style="position:absolute;left:0;top:0;font-size:20px;color:#111116;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.22));z-index:40;">➤</div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);
      const easeInOut = helpers.resolveEase(params.easePreset, 'inOut', params.overshoot);

      const slots = Array.from(stage.querySelectorAll('.hc-ref-slot'));
      const layers = Array.from(stage.querySelectorAll('.hc-brand-layer'));
      const shimmers = Array.from(stage.querySelectorAll('.hc-shimmer'));
      const cursor = stage.querySelector('.hc-ref-cursor');
      const badge = stage.querySelector('.hc-ref-badge');

      gsap.set(slots[0], { x: 205, y: 20, rotation: -8, scale: 0.78, opacity: 0 });
      gsap.set(slots[1], { x: 0, y: 0, rotation: 0, scale: 0.78, opacity: 0 });
      gsap.set(slots[2], { x: -205, y: -20, rotation: 8, scale: 0.78, opacity: 0 });
      gsap.set(layers, { clipPath: 'inset(0 0 100% 0)' });
      gsap.set(shimmers, { y: 0, opacity: 0 });
      gsap.set(cursor, { x: 520, y: 340, opacity: 0, scale: 1 });

      const tl = gsap.timeline({ paused: true });

      // 1. Fan Out Reference Ads
      tl.addLabel('Drop References', 0);
      tl.to(slots, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.42 * d, stagger: 0.04 * d, ease: easeOut }, 0);

      // 2. Cursor Sweeps & Clicks
      const tClick = 0.56 * d;
      tl.addLabel('Click Trigger', tClick);
      tl.to(cursor, { opacity: 1, duration: 0.14 * d }, tClick - 0.12 * d);
      tl.to(cursor, { x: 405, y: 222, duration: 0.32 * d, ease: easeInOut }, tClick - 0.1 * d);
      tl.to(cursor, { scale: 0.78, duration: 0.08 * d }, tClick + 0.22 * d);
      tl.to(cursor, { scale: 1, opacity: 0, duration: 0.2 * d }, tClick + 0.3 * d);

      // 3. Staggered In-Place Shimmer Transmutation
      const tSwap = tClick + 0.32 * d;
      const stg = Math.max(0.08, params.stagger * 1.6);
      tl.addLabel('In-Place Transmute', tSwap);
      layers.forEach((layer, idx) => {
        const at = tSwap + idx * stg;
        tl.to(layer, { clipPath: 'inset(0 0 0% 0)', duration: 0.4 * d, ease: easeOut }, at);
        tl.fromTo(
          shimmers[idx],
          { y: 0, opacity: 0.95 },
          { y: 295, opacity: 0, duration: 0.42 * d, ease: easeOut },
          at
        );
        tl.fromTo(slots[idx], { scale: 1 }, { scale: 1.03, yoyo: true, repeat: 1, duration: 0.16 * d }, at);
      });

      tl.to(
        badge,
        {
          backgroundColor: '#141418',
          color: '#ffffff',
          borderColor: '#e11d48',
          duration: 0.2 * d,
          onStart: () => {
            badge.textContent = '✓ 3/3 Transmuted to Daily Brand Kit · 1:1 Layout Preserved';
          },
          onReverseComplete: () => {
            badge.textContent = '3 Reference Ads · Click to Restyle In-Place';
          },
        },
        tSwap + stg * 2 + 0.15 * d
      );

      tl.addLabel('Comparison Hold', tSwap + stg * 2 + 0.48 * d);
      tl.to({}, { duration: 1.05 * d }, tSwap + stg * 2 + 0.48 * d);

      return tl;
    },
  });
})();
