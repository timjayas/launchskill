/**
 * Pattern 05: NodeConnectionDataflow (Fuser 00:41.75 – 00:45.00)
 * ---------------------------------------------------------------------------
 * Fuser's burgundy audio-pipeline chapter: an animated Audio Waveform pill node
 * connects via a precision bezier SVG wire (drawn with stroke-dashoffset +
 * traveling signal pulse) into a Synced Lyrics output card on the right.
 *
 * Try breaking it:
 * - Increase Stagger > 0.18s so the wire & output card feel disconnected.
 * - Switch to Linear easing to lose the snap on the signal pulse & lyric lines.
 */
(function () {
  window.MotionPatterns = window.MotionPatterns || [];

  const DEFAULTS = {
    duration: 1.0,
    easePreset: 'expo',
    stagger: 0.08,
    overshoot: 0.3,
    blur: 1.0,
  };

  const AMATEUR = {
    duration: 2.0,
    easePreset: 'linear',
    stagger: 0.24,
    overshoot: 2.2,
    blur: 0.0,
  };

  window.MotionPatterns.push({
    id: 'node-connection-dataflow',
    name: 'NodeConnectionDataflow',
    label: '05 · Node Wire Dataflow',
    timestamp: '00:41.75 – 00:45.00',
    tag: 'Node Graph / Bezier',
    directorNote:
      'Restricts wired close-ups to a clean 1-to-1 left-to-right pair (Input -> Wire -> Output). Zero spaghetti graphs—Western reading order explains causality instantly.',
    defaults: DEFAULTS,
    amateurPreset: AMATEUR,

    render(stage) {
      const bars = [14, 24, 34, 18, 42, 30, 48, 22, 36, 44, 26, 16, 32, 20];
      stage.innerHTML = `
        <div class="pat-scene ncd-burgundy" data-pat="node-wire">
          <div class="ncd-rig">
            <!-- Left Input Node: Audio Waveform Pill -->
            <div class="ncd-audio-node">
              <div class="ncd-bars">
                ${bars
                  .map(
                    (h, i) =>
                      `<span class="ncd-bar" style="height:${h}px" data-i="${i}"></span>`
                  )
                  .join('')}
              </div>
              <span class="ncd-port ncd-port-out"></span>
            </div>

            <!-- SVG Bezier Connector Wire + Traveling Signal Pulse -->
            <svg class="ncd-wire-svg" viewBox="0 0 140 80" width="140" height="80">
              <path
                class="ncd-wire-bg"
                d="M 4 40 C 52 40, 88 40, 136 40"
                fill="none"
                stroke="rgba(255,255,255,0.22)"
                stroke-width="2"
              />
              <path
                class="ncd-wire-active"
                d="M 4 40 C 52 40, 88 40, 136 40"
                fill="none"
                stroke="#f9a8d4"
                stroke-width="2.6"
                stroke-linecap="round"
              />
              <circle class="ncd-pulse-dot" cx="4" cy="40" r="4.5" fill="#ffffff" />
            </svg>

            <!-- Right Output Node: Synced Lyrics Card -->
            <div class="fuser-node ncd-lyrics-node">
              <span class="ncd-port ncd-port-in"></span>
              <div class="fuser-node-header ncd-dark-header">
                <span class="fuser-dot"></span>
                <span class="fuser-node-title">Synced Lyrics</span>
              </div>
              <div class="ncd-lyrics-body">
                <div class="ncd-line ncd-line-1">Wake me up inside</div>
                <div class="ncd-line ncd-line-2">Call my name and save</div>
                <div class="ncd-line ncd-line-3">me from the dark</div>
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
      const blurPx = 11 * params.blur;

      const rig = stage.querySelector('.ncd-rig');
      const audioNode = stage.querySelector('.ncd-audio-node');
      const bars = Array.from(stage.querySelectorAll('.ncd-bar'));
      const wireActive = stage.querySelector('.ncd-wire-active');
      const pulseDot = stage.querySelector('.ncd-pulse-dot');
      const lyricsNode = stage.querySelector('.ncd-lyrics-node');
      const lines = Array.from(stage.querySelectorAll('.ncd-line'));

      const wireLen = 136;

      gsap.set(rig, { x: 140, opacity: 0, filter: `blur(${blurPx}px)` });
      gsap.set(audioNode, { scale: 0.9, opacity: 0 });
      gsap.set(wireActive, { strokeDasharray: wireLen, strokeDashoffset: wireLen });
      gsap.set(pulseDot, { attr: { cx: 4 }, opacity: 0 });
      gsap.set(lyricsNode, { x: 24, scale: 0.92, opacity: 0 });
      gsap.set(lines, { opacity: 0.22, y: 6, color: '#fda4af' });

      const tl = gsap.timeline({ paused: true });

      // 1. Whip-pan onto burgundy chapter & spawn Input Node
      tl.addLabel('Whip In', 0);
      tl.to(rig, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.28 * d, ease: easeOut });
      tl.to(
        audioNode,
        {
          scale: 1,
          opacity: 1,
          duration: 0.30 * d,
          ease: params.overshoot > 0.05 ? `back.out(${(1 + params.overshoot * 0.85).toFixed(2)})` : easeOut,
        },
        '<+0.04'
      );

      // 2. Bezier Wire Draws Left -> Right
      tl.addLabel('Wire Draw', 0.34 * d);
      tl.to(
        wireActive,
        {
          strokeDashoffset: 0,
          duration: 0.34 * d,
          ease: easeInOut,
        },
        0.34 * d
      );

      // 3. Output Lyrics Node springs into existence on wire arrival
      const spawnAt = (0.62 + params.stagger * 0.3) * d;
      tl.addLabel('Output Spawn', spawnAt);
      tl.to(
        lyricsNode,
        {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 0.36 * d,
          ease: params.overshoot > 0.05 ? `back.out(${(1 + params.overshoot * 0.9).toFixed(2)})` : easeOut,
        },
        spawnAt
      );

      // 4. Signal Pulse Fires Across Wire -> Triggers Karaoke Lyric Sync!
      let beatCursor = spawnAt + 0.38 * d;
      tl.addLabel('Signal Pulse', beatCursor);
      lines.forEach((line) => {
        tl.set(pulseDot, { attr: { cx: 4 }, opacity: 1 }, beatCursor);
        tl.to(
          pulseDot,
          {
            attr: { cx: 136 },
            duration: 0.24 * d,
            ease: easeInOut,
          },
          beatCursor
        );
        tl.to(pulseDot, { opacity: 0, duration: 0.08 * d }, beatCursor + 0.22 * d);

        tl.to(
          line,
          {
            opacity: 1,
            y: 0,
            color: '#fef08a',
            duration: 0.22 * d,
            ease: easeOut,
          },
          beatCursor + (0.14 + params.stagger * 0.5) * d
        );
        beatCursor += 0.50 * d;
      });

      // Clean hold
      tl.addLabel('Hold', beatCursor);
      tl.to({}, { duration: 0.55 * d }, beatCursor);

      // Live audio waveform breathing layered smoothly across the full shot
      const totalMain = tl.duration();
      bars.forEach((bar, i) => {
        const startT = (0.16 + (i % 4) * 0.04) * d;
        const stepDur = 0.17 * d;
        const reps = Math.max(2, Math.floor((totalMain - startT) / stepDur) - 1);
        tl.to(
          bar,
          {
            scaleY: 0.38 + ((i * 37) % 10) * 0.09,
            duration: stepDur,
            repeat: reps,
            yoyo: true,
            ease: 'sine.inOut',
          },
          startT
        );
      });

      return tl;
    },
  });
})();
