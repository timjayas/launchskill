/**
 * Fuser Motion Lab — Interactive Frame-by-Frame Scrubbing Engine
 * ---------------------------------------------------------------------------
 * Powers pattern switching, 24fps / 60fps frame stepping, 0.25x / 0.5x / 1x
 * playback speeds, live GSAP timeline rebuilding on slider change, live SVG
 * easing curve visualization, and real-time Creative Director diagnostics.
 */
(function () {
  const patterns = window.MotionPatterns || [];
  if (!patterns.length) return;

  // DOM References
  const patternListEl = document.getElementById('pattern-list');
  const directorNoteEl = document.getElementById('director-note');
  const stageScalerEl = document.getElementById('stage-scaler');
  const stageRootEl = document.getElementById('stage-root');
  const stageWrapEl = document.getElementById('stage-viewport-wrap');
  const guideOverlayEl = document.getElementById('guide-overlay');
  const toggleGuidesBtn = document.getElementById('btn-guides');

  const scrubberEl = document.getElementById('scrubber');
  const markerRailEl = document.getElementById('marker-rail');
  const playBtn = document.getElementById('btn-play');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const resetBtn = document.getElementById('btn-reset');
  const loopBtn = document.getElementById('btn-loop');
  const timecodeEl = document.getElementById('timecode');
  const speedBtns = Array.from(document.querySelectorAll('[data-speed]'));
  const fpsBtns = Array.from(document.querySelectorAll('[data-fps]'));

  const presetSeniorBtn = document.getElementById('preset-senior');
  const presetAmateurBtn = document.getElementById('preset-amateur');
  const easeBtns = Array.from(document.querySelectorAll('[data-ease]'));
  const durationSlider = document.getElementById('slider-duration');
  const staggerSlider = document.getElementById('slider-stagger');
  const overshootSlider = document.getElementById('slider-overshoot');
  const blurSlider = document.getElementById('slider-blur');

  const valDuration = document.getElementById('val-duration');
  const valStagger = document.getElementById('val-stagger');
  const valOvershoot = document.getElementById('val-overshoot');
  const valBlur = document.getElementById('val-blur');

  const curveCodeEl = document.getElementById('curve-code');
  const curvePathEl = document.getElementById('curve-path');
  const curveDotEl = document.getElementById('curve-dot');
  const diagListEl = document.getElementById('diagnostic-list');

  // Lab State
  let activePattern = patterns[0];
  let tl = null;
  let isPlaying = false;
  let isLooping = true;
  let fps = 24; // Native Fuser frame rate by default
  let speed = 1.0;
  let params = { ...activePattern.defaults };
  let activePreset = 'senior';

  // Helper passed into each isolated pattern component
  const helpers = {
    resolveEase(preset, dir, overshoot) {
      if (preset === 'linear') return 'none';
      if (preset === 'back') {
        const amt = (1.1 + overshoot * 1.1).toFixed(2);
        return dir === 'inOut' ? `back.inOut(${amt})` : `back.out(${amt})`;
      }
      if (preset === 'power3') return dir === 'inOut' ? 'power3.inOut' : 'power3.out';
      return dir === 'inOut' ? 'expo.inOut' : 'expo.out';
    },
  };

  // Responsive 800x450 logical stage scaling
  function fitStage() {
    const rect = stageWrapEl.getBoundingClientRect();
    const availW = Math.max(320, rect.width - 40);
    const availH = Math.max(200, rect.height - 32);
    const scale = Math.min(availW / 800, availH / 450, 1.15);
    stageScalerEl.style.transform = `scale(${scale.toFixed(4)})`;
  }
  window.addEventListener('resize', fitStage);

  // Plot the active easing curve on the Inspector SVG
  function renderEaseCurve(progressSample) {
    const easeStr = helpers.resolveEase(params.easePreset, 'out', params.overshoot);
    const easeFn = gsap.parseEase(easeStr) || ((t) => t);
    curveCodeEl.textContent = easeStr;

    const W = 240;
    const H = 76;
    const padX = 12;
    const padY = 14;
    const pts = [];
    const N = 48;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const v = easeFn(t);
      const x = padX + t * (W - padX * 2);
      const y = H - padY - v * (H - padY * 2);
      pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    curvePathEl.setAttribute('d', pts.join(' '));

    const p = typeof progressSample === 'number' ? progressSample : 0;
    const dotX = padX + p * (W - padX * 2);
    const dotY = H - padY - easeFn(p) * (H - padY * 2);
    curveDotEl.setAttribute('cx', dotX.toFixed(1));
    curveDotEl.setAttribute('cy', dotY.toFixed(1));
  }

  // Real-time Creative Director Diagnostic Feedback
  function updateDiagnostics() {
    const items = [];
    if (params.easePreset === 'linear') {
      items.push({
        warn: true,
        text: 'Linear easing destroys physical inertia — UI slides feel robotic and cheap.',
      });
    }
    if (params.duration > 1.45) {
      items.push({
        warn: true,
        text: `Duration ${params.duration.toFixed(2)}× drags transitions out; senior SaaS snaps in 0.18–0.32s.`,
      });
    } else if (params.duration < 0.55) {
      items.push({
        warn: true,
        text: `Duration ${params.duration.toFixed(2)}× compresses readability holds below the 0.65s cognitive floor.`,
      });
    }
    if (params.overshoot > 1.4) {
      items.push({
        warn: true,
        text: `Overshoot ${params.overshoot.toFixed(2)} looks cartoony — Fuser uses critically damped springs (< 0.45).`,
      });
    }
    if (params.stagger > 0.13) {
      items.push({
        warn: true,
        text: `Stagger ${Math.round(params.stagger * 1000)}ms fractures group cohesion; keep tight (30–80ms).`,
      });
    }
    if (params.blur < 0.2) {
      items.push({
        warn: true,
        text: '0× Motion Blur exposes 24fps frame judder on fast whip-pans and vertical drum acceleration.',
      });
    }

    if (!items.length) {
      items.push({
        warn: false,
        text: 'Senior-grade calibration: crisp exponential settle, cohesive stagger, optical velocity blur.',
      });
    }

    diagListEl.innerHTML = items
      .map(
        (it) =>
          `<li class="${it.warn ? 'diag-warn' : 'diag-ok'}">${it.warn ? '⚠ ' : '✓ '}${it.text}</li>`
      )
      .join('');
  }

  function syncInspectorUI() {
    durationSlider.value = params.duration;
    staggerSlider.value = Math.round(params.stagger * 1000);
    overshootSlider.value = params.overshoot;
    blurSlider.value = params.blur;

    valDuration.textContent = `${params.duration.toFixed(2)}×`;
    valStagger.textContent = `${Math.round(params.stagger * 1000)} ms`;
    valOvershoot.textContent = params.overshoot.toFixed(2);
    valBlur.textContent = `${params.blur.toFixed(1)}×`;

    easeBtns.forEach((b) => b.classList.toggle('active', b.dataset.ease === params.easePreset));
    presetSeniorBtn.classList.toggle('active', activePreset === 'senior');
    presetAmateurBtn.classList.toggle('active', activePreset === 'amateur');

    renderEaseCurve(tl ? tl.progress() : 0);
    updateDiagnostics();
  }

  function renderTimelineMarkers() {
    markerRailEl.innerHTML = '';
    if (!tl) return;
    const total = tl.duration() || 1;
    const labels = tl.labels || {};
    Object.keys(labels).forEach((name) => {
      const t = labels[name];
      const pct = Math.max(2, Math.min(98, (t / total) * 100));
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'timeline-marker';
      el.style.left = `${pct.toFixed(2)}%`;
      el.textContent = name;
      el.title = `Jump to "${name}" (${t.toFixed(2)}s)`;
      el.addEventListener('click', () => {
        pausePlayback();
        tl.time(t);
        updateTransportUI();
      });
      markerRailEl.appendChild(el);
    });
  }

  function updateTransportUI() {
    if (!tl) return;
    const dur = tl.duration() || 0.001;
    const cur = tl.time();
    const prog = cur / dur;
    scrubberEl.value = Math.round(prog * 1000);

    const curFrame = Math.round(cur * fps);
    const totalFrames = Math.max(1, Math.round(dur * fps));
    timecodeEl.innerHTML = `<strong>f${String(curFrame).padStart(3, '0')}</strong> / ${String(
      totalFrames
    ).padStart(3, '0')} · ${cur.toFixed(2)}s / ${dur.toFixed(2)}s`;

    // Animate bead smoothly on curve preview
    renderEaseCurve((prog * 2.5) % 1);
  }

  function rebuildTimeline(preserveProgress) {
    const prevProg = preserveProgress && tl ? tl.progress() : 0;
    const wasPlaying = isPlaying;

    if (tl) {
      tl.kill();
      tl = null;
    }

    activePattern.render(stageRootEl);
    tl = activePattern.buildTimeline(stageRootEl, params, helpers);
    tl.timeScale(speed);
    tl.eventCallback('onUpdate', updateTransportUI);
    tl.eventCallback('onComplete', () => {
      if (isLooping) {
        tl.restart();
      } else {
        pausePlayback();
      }
    });

    renderTimelineMarkers();
    tl.progress(preserveProgress ? prevProg : 0);
    if (wasPlaying) {
      tl.play();
    } else {
      tl.pause();
    }
    updateTransportUI();
  }

  function selectPattern(patternId) {
    const found = patterns.find((p) => p.id === patternId) || patterns[0];
    activePattern = found;
    params = { ...found.defaults };
    activePreset = 'senior';

    Array.from(patternListEl.querySelectorAll('.pattern-btn')).forEach((btn) =>
      btn.classList.toggle('active', btn.dataset.id === found.id)
    );
    directorNoteEl.textContent = found.directorNote;

    syncInspectorUI();
    rebuildTimeline(false);
    startPlayback();
  }

  function startPlayback() {
    if (!tl) return;
    if (tl.progress() >= 0.995) tl.progress(0);
    isPlaying = true;
    tl.timeScale(speed);
    tl.play();
    playBtn.textContent = '⏸ Pause';
  }

  function pausePlayback() {
    if (!tl) return;
    isPlaying = false;
    tl.pause();
    playBtn.textContent = '▶ Play';
  }

  function stepFrames(delta) {
    if (!tl) return;
    pausePlayback();
    const stepSec = 1 / fps;
    const nextTime = Math.max(0, Math.min(tl.duration(), tl.time() + delta * stepSec));
    tl.time(nextTime);
    updateTransportUI();
  }

  // Build Grouped Multi-Archetype Sidebar Pattern List
  const fuserPats = patterns.filter((p) => (p.archetype || 'fuser') === 'fuser');
  const rebrandPats = patterns.filter((p) => p.archetype === 'rebrand');
  const motionflyPats = patterns.filter((p) => p.archetype === 'motionfly');
  const heraPats = patterns.filter((p) => p.archetype === 'hera');

  const renderBtn = (p) => `
      <button type="button" class="pattern-btn" data-id="${p.id}">
        <span class="pattern-btn-title">${p.label}</span>
        <span class="pattern-btn-meta">
          <span>${p.timestamp}</span>
          <span class="pattern-tag">${p.tag}</span>
        </span>
      </button>`;

  patternListEl.innerHTML = `
    <div class="sidebar-group-title"><span>Spatial Creative Tool</span><span class="arch-pill fuser">Fuser · 24p</span></div>
    ${fuserPats.map(renderBtn).join('')}
    ${
      rebrandPats.length
        ? `<div class="sidebar-group-title" style="margin-top:8px;"><span>Editorial Brand Punch</span><span class="arch-pill">Rebrand · 30p</span></div>
           ${rebrandPats.map(renderBtn).join('')}`
        : ''
    }
    ${
      motionflyPats.length
        ? `<div class="sidebar-group-title" style="margin-top:8px;"><span>Chat-to-Cinema / Agentic</span><span class="arch-pill" style="color:#a78bfa;border-color:rgba(167,139,250,0.35);">Motionfly · 30p</span></div>
           ${motionflyPats.map(renderBtn).join('')}`
        : ''
    }
    ${
      heraPats.length
        ? `<div class="sidebar-group-title" style="margin-top:8px;"><span>Creative Ad Canvas</span><span class="arch-pill" style="color:#fb7185;border-color:rgba(251,113,133,0.4);">Hera · 60p</span></div>
           ${heraPats.map(renderBtn).join('')}`
        : ''
    }
  `;

  patternListEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.pattern-btn');
    if (btn) selectPattern(btn.dataset.id);
  });

  // Transport Listeners
  playBtn.addEventListener('click', () => (isPlaying ? pausePlayback() : startPlayback()));
  prevBtn.addEventListener('click', () => stepFrames(-1));
  nextBtn.addEventListener('click', () => stepFrames(1));
  resetBtn.addEventListener('click', () => {
    if (!tl) return;
    tl.progress(0);
    updateTransportUI();
  });
  loopBtn.addEventListener('click', () => {
    isLooping = !isLooping;
    loopBtn.classList.toggle('active', isLooping);
  });

  scrubberEl.addEventListener('input', () => {
    if (!tl) return;
    pausePlayback();
    tl.progress(Number(scrubberEl.value) / 1000);
    updateTransportUI();
  });

  speedBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      speed = Number(btn.dataset.speed);
      speedBtns.forEach((b) => b.classList.toggle('active', b === btn));
      if (tl) tl.timeScale(speed);
    });
  });

  fpsBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      fps = Number(btn.dataset.fps);
      fpsBtns.forEach((b) => b.classList.toggle('active', b === btn));
      updateTransportUI();
    });
  });

  toggleGuidesBtn.addEventListener('click', () => {
    const on = guideOverlayEl.classList.toggle('visible');
    toggleGuidesBtn.classList.toggle('active', on);
  });

  // Inspector Listeners
  presetSeniorBtn.addEventListener('click', () => {
    params = { ...activePattern.defaults };
    activePreset = 'senior';
    syncInspectorUI();
    rebuildTimeline(false);
    startPlayback();
  });

  presetAmateurBtn.addEventListener('click', () => {
    params = { ...activePattern.amateurPreset };
    activePreset = 'amateur';
    syncInspectorUI();
    rebuildTimeline(false);
    startPlayback();
  });

  function onParamChange() {
    activePreset = 'custom';
    syncInspectorUI();
    rebuildTimeline(true);
  }

  durationSlider.addEventListener('input', () => {
    params.duration = Number(durationSlider.value);
    onParamChange();
  });

  staggerSlider.addEventListener('input', () => {
    params.stagger = Number(staggerSlider.value) / 1000;
    onParamChange();
  });

  overshootSlider.addEventListener('input', () => {
    params.overshoot = Number(overshootSlider.value);
    onParamChange();
  });

  blurSlider.addEventListener('input', () => {
    params.blur = Number(blurSlider.value);
    onParamChange();
  });

  easeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      params.easePreset = btn.dataset.ease;
      onParamChange();
    });
  });

  // Keyboard Shortcuts: Space (play/pause), Left/Right (-1f/+1f), R (reset)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') {
      e.preventDefault();
      isPlaying ? pausePlayback() : startPlayback();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      stepFrames(-1);
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      stepFrames(1);
    } else if (e.key.toLowerCase() === 'r') {
      e.preventDefault();
      if (tl) {
        tl.progress(0);
        updateTransportUI();
      }
    }
  });

  // Boot
  fitStage();
  selectPattern(patterns[0].id);
})();
