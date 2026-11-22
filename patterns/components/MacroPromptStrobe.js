/**
 * Pattern 07: MacroPromptStrobe (Rebrand MCP 00:02.67 – 00:07.13)
 * ---------------------------------------------------------------------------
 * Wide AI chat bar -> 0-frame hard-cut to 3.2x Macro Typing Punch-In (solves
 * mobile X legibility!) -> MCP Shimmer status -> 3-Beat Full-Bleed Identity
 * Retrieval Strobe with pinned bottom glass counter HUD.
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.05,
    overshoot: 0.2,
    blur: 1.0,
  };

  const AMATEUR = {
    duration: 2.0,
    easePreset: 'linear',
    stagger: 0.2,
    overshoot: 2.1,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'macro-prompt-strobe',
    archetype: 'rebrand',
    name: 'MacroPromptStrobe',
    label: '07 · Macro Prompt + Strobe',
    timestamp: '00:02.67 – 00:07.13',
    tag: 'MCP / Mobile X',
    directorNote:
      'Hard-cutting 3.2x into prompt typing kills tiny-font fatigue on 360px mobile feeds; following with 0.45s full-bleed identity strobes makes MCP database retrieval feel visceral.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      stage.innerHTML = `
        <div class="pat-scene pat-white rb-mps" data-pat="macro-prompt-strobe">
          <!-- Layer 1: Wide AI Chat Prompt Bar -->
          <div class="rb-chat-wide">
            <span class="rb-plus">+</span>
            <span class="rb-wide-text">Show me|</span>
            <span class="rb-submit-btn">↑</span>
          </div>

          <!-- Layer 2: Hard-Cut 3.2x Macro Typing Close-Up -->
          <div class="rb-macro-layer">
            <div class="rb-macro-track">
              <span class="rb-macro-text"></span><span class="rb-macro-caret"></span>
            </div>
          </div>

          <!-- Layer 3: MCP Shimmer Status -->
          <div class="rb-shimmer-layer">
            <div class="rb-user-bubble">Show me the best AI brand identities</div>
            <div class="rb-mcp-row">
              <span class="rb-serif-r">R Rebrand</span>
              <span class="rb-shimmer-text">Searching brand identities...</span>
            </div>
          </div>

          <!-- Layer 4: 3-Beat Full-Bleed Retrieval Strobe + Counter HUD -->
          <div class="rb-strobe-layer">
            <div class="rb-flash rb-flash-1"><span>Ideogram</span></div>
            <div class="rb-flash rb-flash-2">
              <div class="rb-f2-card" style="background:#fde047;color:#1d4ed8">↗</div>
              <div class="rb-f2-card" style="background:#2563eb;color:#fde047">⇄</div>
              <div class="rb-f2-card" style="background:#d97706;color:#fef3c7">◎</div>
            </div>
            <div class="rb-flash rb-flash-3">
              <div class="rb-orb-main"></div>
              <div class="rb-orb-sm"></div>
            </div>

            <div class="rb-hud-pill">
              <span class="rb-hud-dot"></span>
              <span class="rb-hud-label">Searching Rebrand</span>
              <span class="rb-hud-count">4,120 / 34,340</span>
            </div>
          </div>
        </div>
      `;
    },

    buildTimeline(stage, params, helpers) {
      const d = params.duration;
      const easeOut = helpers.resolveEase(params.easePreset, 'out', params.overshoot);

      const chatWide = stage.querySelector('.rb-chat-wide');
      const macroLayer = stage.querySelector('.rb-macro-layer');
      const macroTrack = stage.querySelector('.rb-macro-track');
      const macroText = stage.querySelector('.rb-macro-text');
      const shimmerLayer = stage.querySelector('.rb-shimmer-layer');
      const strobeLayer = stage.querySelector('.rb-strobe-layer');
      const f1 = stage.querySelector('.rb-flash-1');
      const f2 = stage.querySelector('.rb-flash-2');
      const f3 = stage.querySelector('.rb-flash-3');
      const hudDot = stage.querySelector('.rb-hud-dot');
      const hudLabel = stage.querySelector('.rb-hud-label');
      const hudCount = stage.querySelector('.rb-hud-count');

      const promptStr = 'Show me the best AI brand identities';
      const typeProxy = { chars: 7 };
      const countProxy = { val: 4120 };

      gsap.set(chatWide, { opacity: 1, scale: 1 });
      gsap.set(macroLayer, { opacity: 0 });
      gsap.set(macroTrack, { x: 80 });
      gsap.set(shimmerLayer, { opacity: 0, y: 14 });
      gsap.set(strobeLayer, { opacity: 0 });
      gsap.set([f1, f2, f3], { opacity: 0 });
      macroText.textContent = promptStr.slice(0, 7);

      const tl = gsap.timeline({ paused: true });

      // 1. Wide Chat Bar Establish
      tl.addLabel('Wide Bar', 0);
      tl.to({}, { duration: 0.45 * d });

      // 2. 0-Frame Hard-Cut to 3.2x Macro Typing Punch-In
      tl.addLabel('Macro Punch', '>');
      tl.set(chatWide, { opacity: 0 });
      tl.set(macroLayer, { opacity: 1 });
      tl.to(typeProxy, {
        chars: promptStr.length,
        duration: 0.92 * d,
        ease: 'none',
        onUpdate: () => {
          macroText.textContent = promptStr.slice(0, Math.round(typeProxy.chars));
        },
      });
      tl.to(macroTrack, { x: -135, duration: 0.92 * d, ease: 'none' }, '<');

      // 3. Hard-Cut to MCP Shimmer Status
      tl.addLabel('MCP Shimmer', '>+0.10');
      tl.set(macroLayer, { opacity: 0 });
      tl.to(shimmerLayer, { opacity: 1, y: 0, duration: 0.24 * d, ease: easeOut });
      tl.to({}, { duration: 0.50 * d });

      // 4. 3-Beat Full-Bleed Retrieval Strobe + Counter HUD
      tl.addLabel('Strobe 1', '>');
      tl.set(shimmerLayer, { opacity: 0 });
      tl.set(strobeLayer, { opacity: 1 });
      tl.set(f1, { opacity: 1 });
      tl.to(
        countProxy,
        {
          val: 34340,
          duration: 1.15 * d,
          ease: 'power1.inOut',
          onUpdate: () => {
            const v = Math.round(countProxy.val);
            if (v >= 33800) {
              hudDot.style.background = '#10b981';
              hudLabel.textContent = '5 brands found';
              hudCount.textContent = '0.4s';
            } else {
              hudDot.style.background = '#2563eb';
              hudLabel.textContent = 'Searching Rebrand';
              hudCount.textContent = `${v.toLocaleString()} / 34,340`;
            }
          },
        },
        '<'
      );

      tl.to({}, { duration: 0.45 * d });
      tl.addLabel('Strobe 2', '>');
      tl.set(f1, { opacity: 0 });
      tl.set(f2, { opacity: 1 });
      tl.to({}, { duration: 0.40 * d });

      tl.addLabel('Strobe 3', '>');
      tl.set(f2, { opacity: 0 });
      tl.set(f3, { opacity: 1 });
      tl.to({}, { duration: 0.65 * d });

      return tl;
    },
  });
})();
