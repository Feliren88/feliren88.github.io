/* ════════════════════════════════════════════════════════
   Explainers on /image-generation/.

   [data-xp="sd"]   steps through real Stable Diffusion frames, after Diffusion
                    Explainer (Polo Club of Data Science, MIT). The sprites are
                    built by scripts/build_explainer_data.py.
   [data-xp="toy"]  runs diffusion on a 2D mixture of Gaussians, where the noise
                    a perfect denoiser would predict has a closed form. Nothing
                    is learned, so every arrow and every particle is exact.
   ════════════════════════════════════════════════════════ */
(function () {
  var sdHost = document.querySelector('[data-xp="sd"]');
  var toyHost = document.querySelector('[data-xp="toy"]');
  if (!sdHost && !toyHost) return;

  var esc = XP.esc;
  var reduced = XP.reduced;

  /* ════════════════════════════════════════════════════════
     Stable Diffusion, frame by frame
     ════════════════════════════════════════════════════════ */

  function sd(host) {
    var data, timer = null;
    var S = { p: 0, g: 2, k: 0, compare: false, step: 0 };
    var TOUR = [
      { col: 'txt', t: 'The prompt becomes numbers', say: 'A tokeniser splits the prompt into text pieces called tokens and pads the list to 77. CLIP’s text encoder represents each token using its surrounding words. In Stable Diffusion v1, each vector contains 768 numbers.' },
      { col: 'ref', t: 'Start from noise', k: 0, say: 'Generation starts from noise in a compressed representation with 4 channels of 64 by 64 values. The seed fixes the starting noise. With other settings unchanged, the same seed and prompt reproduce the image.' },
      { col: 'ref', t: 'Predict the noise twice', k: 6, say: 'At each step, the U-Net predicts noise in the compressed representation twice. One prediction uses the prompt, while the other uses an empty prompt. Guidance scales their difference.' },
      { col: 'ref', t: 'Remove a little, 50 times', k: 25, say: 'The scheduler sets how much predicted noise to subtract at each step. Repeating this 50 times refines the compressed representation into a layout and then adds detail.' },
      { col: 'up', t: 'Decode to pixels', k: 25, say: 'The variational autoencoder (VAE) decoder turns the 64 by 64 representation into a 512 by 512 image. It generates fine detail. Therefore, some small artefacts originate in the decoder.' }
    ];

    function sprite(slug, g, z) {
      return host.dataset.img + slug + '-' + String(data.guidance[g]).split('.')[0] + (z ? '-z' : '') + '.webp';
    }
    function frame(slug, g, z, cls) {
      var n = data.steps.length;
      return '<span class="xp-frame' + (z ? ' is-latent' : '') + (cls ? ' ' + cls : '') + '" role="img" aria-label="' +
        (z ? 'Latent' : 'Image') + ' after ' + data.steps[S.k] + ' of 50 steps" style="background-image:url(' + sprite(slug, g, z) +
        ');background-size:' + n * 100 + '% 100%;background-position:' + (S.k / (n - 1) * 100) + '% 0"></span>';
    }
    function promptHtml(i) {
      var base = data.prompts[0].text, t = data.prompts[i].text;
      return i === 1 ? esc(base) + '<mark>' + esc(t.slice(base.length)) + '</mark>' : esc(t);
    }

    function render() {
      var tour = TOUR[S.step], P = data.prompts[S.p], g = data.guidance[S.g], t = data.steps[S.k];
      var words = P.text.replace(/,/g, ' ,').split(/\s+/);
      var html = '<div class="xp-bar">' +
        '<div class="xp-field"><span>Prompt</span><div class="xp-chips" role="group" aria-label="Prompt">' +
        data.prompts.map(function (p, i) {
          return '<button type="button" data-p="' + i + '" aria-pressed="' + (i === S.p) + '">' + promptHtml(i) + '</button>';
        }).join('') + '</div></div>' +
        XP.tourBar(TOUR, S.step) + '</div>' + XP.caption(TOUR, S.step);

      html += '<div class="xp-flow xp-sd">';

      html += '<section class="xp-col' + (tour.col === 'txt' ? ' is-lit' : '') + '" aria-label="Text representation">' +
        '<h3 class="xp-col-t"><span>1</span>Text representation</h3>' +
        '<p class="xp-shape">prompt → [77, d]</p>' +
        '<ol class="xp-chipline"><li class="is-special">&lt;start&gt;</li>' +
        words.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') +
        '<li class="is-special">&lt;end&gt;</li><li class="is-pad">… padded to 77</li></ol>' +
        '<p class="xp-note">The display shows one token per word for readability. However, CLIP’s tokeniser splits rarer words into several pieces. The vector width d is 768 in Stable Diffusion v1.</p>' +
        '</section>';

      html += '<section class="xp-col is-wide' + (tour.col === 'ref' ? ' is-lit' : '') + '" aria-label="Refining the image representation">' +
        '<h3 class="xp-col-t"><span>2</span>Refine the image representation</h3>' +
        '<p class="xp-shape">[4, 64, 64] → [4, 64, 64], ' + t + ' of 50 steps</p>' +
        '<div class="xp-ctl"><label class="xp-field"><span>Step</span><input type="range" min="0" max="' + (data.steps.length - 1) +
        '" value="' + S.k + '" data-k="k"><output>' + t + '</output></label>' +
        '<button type="button" class="xp-go is-inline" data-play>' + (timer ? 'Pause' : 'Play') + '</button>' +
        '<div class="xp-field"><span>Guidance</span><div class="xp-seg" role="group" aria-label="Guidance scale">' +
        data.guidance.map(function (v, i) {
          return '<button type="button" data-g="' + i + '" aria-pressed="' + (i === S.g) + '">' + v + '</button>';
        }).join('') + '</div></div></div>' +
        '<div class="xp-sd-ref">' + frame(P.slug, S.g, true) +
        '<div class="xp-cfg"><p class="xp-shape">' + window.InterviewDisplayMath.html('diffusion/guidance', {guidance: g}) + '</p>' +
        '<div class="xp-noises"><figure><img src="' + host.dataset.img + 'noise-pred-text.webp" alt="" width="64" height="64" loading="lazy"><figcaption>' + window.InterviewDisplayMath.html('diffusion/conditional', {}, true) + ', with the prompt</figcaption></figure>' +
        '<figure><img src="' + host.dataset.img + 'noise-pred-empty.webp" alt="" width="64" height="64" loading="lazy"><figcaption>' + window.InterviewDisplayMath.html('diffusion/unconditional', {}, true) + ', empty prompt</figcaption></figure>' +
        '<figure><img src="' + host.dataset.img + 'noise-pred-final.webp" alt="" width="64" height="64" loading="lazy"><figcaption>' + window.InterviewDisplayMath.html('diffusion/guided', {}, true) + ', what is removed</figcaption></figure></div>' +
        '<p class="xp-note">' + (g === 0
          ? 'At w = 0 the prompt is ignored entirely, so both prompts give the same picture.'
          : g === 1 ? 'At w = 1 the model follows its prompted prediction as trained, with no extra push.'
          : g === 7 ? 'At w = 7, a common default, the prompt’s effect is exaggerated sevenfold.'
          : 'At w = 20 the push is so strong that colours saturate and detail breaks up.') +
        ' The 3 noise predictions above are from one step of this pipeline.</p></div></div></section>';

      html += '<section class="xp-col' + (tour.col === 'up' ? ' is-lit' : '') + '" aria-label="Upscaling">' +
        '<h3 class="xp-col-t"><span>3</span>Upscale</h3>' +
        '<p class="xp-shape">[4, 64, 64] → [3, 512, 512]</p>' +
        frame(P.slug, S.g, false) +
        '<label class="xp-toggles"><input type="checkbox" data-compare' + (S.compare ? ' checked' : '') + '> Compare with the other prompt</label>' +
        (S.compare ? frame(data.prompts[1 - S.p].slug, S.g, false, 'is-other') +
          '<p class="xp-note">Compare with prompt “' + esc(data.prompts[1 - S.p].text) + '”, same seed and guidance.</p>' : '') +
        '</section></div>';

      host.innerHTML = html;
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function play() {
      if (timer) { stop(); render(); return; }
      if (S.k >= data.steps.length - 1) S.k = 0;
      if (reduced) { S.k = data.steps.length - 1; render(); return; }
      timer = setInterval(function () {
        S.k += 1;
        if (S.k >= data.steps.length - 1) { S.k = data.steps.length - 1; stop(); }
        render();
      }, 160);
      render();
    }

    host.addEventListener('input', function (e) {
      if (e.target.dataset.k !== 'k') return;
      stop();
      S.k = parseInt(e.target.value, 10);
      render();
      host.querySelector('[data-k="k"]').focus();
    });
    host.addEventListener('change', function (e) {
      if (!e.target.hasAttribute('data-compare')) return;
      S.compare = e.target.checked;
      render();
      host.querySelector('[data-compare]').focus();
    });
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var sel = null;
      if (b.dataset.tour) {
        stop();
        S.step = Math.max(0, Math.min(TOUR.length - 1, S.step + parseInt(b.dataset.tour, 10)));
        if (TOUR[S.step].k !== undefined) S.k = TOUR[S.step].k;
        sel = '[data-tour="' + b.dataset.tour + '"]';
      }
      if (b.dataset.p) { S.p = parseInt(b.dataset.p, 10); sel = '[data-p="' + S.p + '"]'; }
      if (b.dataset.g) { S.g = parseInt(b.dataset.g, 10); sel = '[data-g="' + S.g + '"]'; }
      if (b.hasAttribute('data-play')) { play(); sel = '[data-play]'; }
      else render();
      var again = sel && host.querySelector(sel);
      if (again && !again.disabled) again.focus();
    });

    fetch(host.dataset.src).then(function (r) { return r.json(); }).then(function (d) {
      data = d;
      render();
    }).catch(function () {
      host.innerHTML = '<p class="xp-note">The Stable Diffusion frames could not be loaded.</p>';
    });
  }

  /* ════════════════════════════════════════════════════════
     Diffusion you can compute exactly
     ════════════════════════════════════════════════════════ */

  /* Two classes, three Gaussian bumps each, all with the same spread. */
  var SIG = 0.16;
  var COMP = [
    { m: [-1.05, 0.8], c: 0 }, { m: [-1.35, 0], c: 0 }, { m: [-1.05, -0.8], c: 0 },
    { m: [1.05, 0.8], c: 1 }, { m: [1.35, 0], c: 1 }, { m: [1.05, -0.8], c: 1 }
  ];
  var CLASSES = ['Left', 'Right'];

  /* DDPM's linear schedule over 1,000 steps, sampled with 50 DDIM steps. */
  var T = 1000, ABAR = [];
  (function () {
    var a = 1;
    for (var t = 0; t < T; t++) { a *= 1 - (1e-4 + (0.02 - 1e-4) * t / (T - 1)); ABAR.push(a); }
  })();
  var STEPS = 50, TAU = [];
  for (var i = 0; i < STEPS; i++) TAU.push(Math.round(i * (T - 1) / (STEPS - 1)));

  /* The noise a perfect denoiser predicts at x, if the data were only the
     components in `set`. The noised mixture is again a mixture: each bump
     keeps its weight, its mean shrinks by sqrt(abar) and its variance becomes
     abar * SIG^2 + 1 - abar. The noise prediction is -sqrt(1 - abar) times
     the score of that mixture. */
  function epsHat(x, y, abar, set) {
    var sa = Math.sqrt(abar), v = abar * SIG * SIG + 1 - abar;
    var logs = [], mx = -Infinity;
    set.forEach(function (k) {
      var dx = x - sa * COMP[k].m[0], dy = y - sa * COMP[k].m[1];
      var l = -(dx * dx + dy * dy) / (2 * v);
      logs.push(l);
      if (l > mx) mx = l;
    });
    var w = logs.map(function (l) { return Math.exp(l - mx); });
    var s = w.reduce(function (a, b) { return a + b; }, 0), gx = 0, gy = 0;
    set.forEach(function (k, j) {
      gx += w[j] / s * (sa * COMP[k].m[0] - x) / v;
      gy += w[j] / s * (sa * COMP[k].m[1] - y) / v;
    });
    var f = -Math.sqrt(1 - abar);
    return [f * gx, f * gy];
  }

  var rng = XP.rng, gauss = XP.gauss;

  function toy(host) {
    var N = 500, ALL = COMP.map(function (_, k) { return k; });
    var S = { mode: 'rev', cls: 0, w: 3, i: STEPS - 1, seed: 7, running: null };
    var noise, pts, x0, eps;

    function reset() {
      var r = rng(S.seed);
      noise = [];
      x0 = []; eps = [];
      for (var n = 0; n < N; n++) {
        noise.push([gauss(r), gauss(r)]);
        var k = Math.floor(r() * COMP.length);
        x0.push([COMP[k].m[0] + SIG * gauss(r), COMP[k].m[1] + SIG * gauss(r), COMP[k].c]);
        eps.push([gauss(r), gauss(r)]);
      }
      pts = noise.map(function (p) { return p.slice(); });
      S.i = STEPS - 1;
    }

    /* One DDIM step (eta = 0) from TAU[i] to TAU[i - 1], with classifier-free
       guidance mixing the class-conditional and unconditional predictions. */
    function step() {
      if (S.i <= 0) return false;
      var t = TAU[S.i], tp = TAU[S.i - 1], a = ABAR[t], ap = ABAR[tp];
      var set = COMP.map(function (c, k) { return c.c === S.cls ? k : -1; }).filter(function (k) { return k >= 0; });
      pts = pts.map(function (p) {
        var eu = epsHat(p[0], p[1], a, ALL), e = eu;
        if (S.cls >= 0) {
          var ec = epsHat(p[0], p[1], a, set);
          e = [eu[0] + S.w * (ec[0] - eu[0]), eu[1] + S.w * (ec[1] - eu[1])];
        }
        var hx = (p[0] - Math.sqrt(1 - a) * e[0]) / Math.sqrt(a);
        var hy = (p[1] - Math.sqrt(1 - a) * e[1]) / Math.sqrt(a);
        return [Math.sqrt(ap) * hx + Math.sqrt(1 - ap) * e[0], Math.sqrt(ap) * hy + Math.sqrt(1 - ap) * e[1]];
      });
      S.i -= 1;
      return true;
    }

    /* Forward mode: the noised data at the chosen step, in one jump. */
    function forward() {
      var a = ABAR[TAU[S.i]];
      return x0.map(function (p, n) {
        return [Math.sqrt(a) * p[0] + Math.sqrt(1 - a) * eps[n][0], Math.sqrt(a) * p[1] + Math.sqrt(1 - a) * eps[n][1], p[2]];
      });
    }

    function stats(P) {
      var hit = 0, dist = 0;
      P.forEach(function (p) {
        var best = Infinity, bc = 0;
        COMP.forEach(function (c) {
          var d = Math.hypot(p[0] - c.m[0], p[1] - c.m[1]);
          if (d < best) { best = d; bc = c.c; }
        });
        if (bc === S.cls) hit++;
        dist += best;
      });
      return { hit: hit / P.length, dist: dist / P.length };
    }

    function colours() {
      var cs = getComputedStyle(host);
      return { a: cs.getPropertyValue('--tf-up').trim(), b: cs.getPropertyValue('--tf-down').trim(), text: cs.color, muted: cs.getPropertyValue('--muted').trim() };
    }

    function draw() {
      var cv = host.querySelector('canvas');
      if (!cv) return;
      var W = cv.clientWidth, H = cv.clientHeight, dpr = window.devicePixelRatio || 1;
      cv.width = W * dpr; cv.height = H * dpr;
      var ctx = cv.getContext('2d'), C = colours();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var sc = Math.min(W, H) / 5.2;
      function X(v) { return W / 2 + v * sc; }
      function Y(v) { return H / 2 - v * sc; }
      ctx.strokeStyle = C.muted; ctx.globalAlpha = 0.25; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      COMP.forEach(function (c) {
        ctx.globalAlpha = 0.18; ctx.fillStyle = c.c ? C.b : C.a;
        ctx.beginPath(); ctx.arc(X(c.m[0]), Y(c.m[1]), 2 * SIG * sc, 0, 2 * Math.PI); ctx.fill();
      });
      var P = S.mode === 'fwd' ? forward() : pts;
      ctx.globalAlpha = 0.85;
      P.forEach(function (p) {
        ctx.fillStyle = S.mode === 'fwd' ? (p[2] ? C.b : C.a) : C.text;
        ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 1.8, 0, 2 * Math.PI); ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function readout() {
      var a = ABAR[TAU[S.i]], out = host.querySelector('.xp-toy-read');
      if (!out) return;
      var html = '<dt>Step</dt><dd>' + (S.mode === 'fwd' ? S.i + 1 : STEPS - S.i) + ' / ' + STEPS + '</dd>' +
        '<dt>ā<sub>t</sub>, clean share of the variance</dt><dd>' + a.toFixed(4) + '</dd>';
      if (S.mode === 'rev' && S.i === 0 && S.cls >= 0) {
        var st = stats(pts);
        html += '<dt>Samples in the ' + CLASSES[S.cls].toLowerCase() + ' class</dt><dd>' + (st.hit * 100).toFixed(1) + '%</dd>' +
          '<dt>Mean distance to the nearest bump centre</dt><dd>' + st.dist.toFixed(3) + '</dd>';
      }
      out.innerHTML = html;
    }

    function shell() {
      host.innerHTML = '<div class="xp-bar">' +
        '<div class="xp-seg" role="group" aria-label="Direction">' +
        '<button type="button" data-mode="fwd" aria-pressed="' + (S.mode === 'fwd') + '">Add noise</button>' +
        '<button type="button" data-mode="rev" aria-pressed="' + (S.mode === 'rev') + '">Remove noise</button></div>' +
        '<div class="xp-field"><span>Prompt</span><div class="xp-seg" role="group" aria-label="Class to generate">' +
        '<button type="button" data-cls="0" aria-pressed="' + (S.cls === 0) + '">Left</button>' +
        '<button type="button" data-cls="1" aria-pressed="' + (S.cls === 1) + '">Right</button>' +
        '<button type="button" data-cls="-1" aria-pressed="' + (S.cls === -1) + '">No prompt</button></div></div>' +
        '<label class="xp-field"><span>Guidance w</span><input type="range" min="0" max="8" step="0.5" value="' + S.w + '" data-k="w"' + (S.cls < 0 ? ' disabled' : '') + '><output>' + S.w + '</output></label>' +
        '</div>' +
        '<div class="xp-toy"><canvas role="img" aria-label="Particles in two dimensions moving between noise and two clusters of data"></canvas>' +
        '<div class="xp-toy-side">' +
        (S.mode === 'fwd'
          ? '<label class="xp-field is-stack"><span>Noise step</span><input type="range" min="0" max="' + (STEPS - 1) + '" value="' + S.i + '" data-k="i"></label>' +
            '<p class="xp-note">Data from both classes, coloured by class, jumped straight to the chosen noise level with ' + window.InterviewDisplayMath.html('diffusion/forward', {}, true) + '. No chain is simulated; this is why training is cheap.</p>'
          : '<button type="button" class="xp-go" data-run>' + (S.i === 0 ? 'Generate again' : 'Generate') + '</button>' +
            '<p class="xp-note">500 points start as pure noise. At each of 50 steps, the exact noise prediction for this data is guided towards the chosen class and a DDIM step removes part of it.</p>') +
        '<dl class="xp-toy-read"></dl>' +
        '<p class="xp-note">' + (S.cls < 0
          ? 'With no prompt the points split between both classes.'
          : 'At w = 1 the points land in the chosen class, spread as the data is. Near w = 1.5 they sit slightly closer to the bump centres. Beyond about 2 they are pushed past the centres and the mean distance grows. Below 1, some land between the classes.') + '</p>' +
        '</div></div>';
      draw();
      readout();
    }

    /* A click during generation interrupts it rather than being ignored. */
    function halt() { if (S.running) { clearInterval(S.running); S.running = null; } }
    function run() {
      halt();
      reset();
      if (reduced) { while (step()) {} shell(); return; }
      shell();
      S.running = setInterval(function () {
        if (!step()) { clearInterval(S.running); S.running = null; shell(); return; }
        draw();
        readout();
      }, 45);
    }

    host.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      halt();
      var sel = null;
      if (b.dataset.mode) { S.mode = b.dataset.mode; reset(); if (S.mode === 'fwd') S.i = 20; sel = '[data-mode="' + S.mode + '"]'; }
      if (b.dataset.cls) {
        S.cls = parseInt(b.dataset.cls, 10);
        if (S.mode === 'rev') { run(); return; }
        reset(); sel = '[data-cls="' + S.cls + '"]';
      }
      if (b.hasAttribute('data-run')) { run(); return; }
      shell();
      var again = sel && host.querySelector(sel);
      if (again) again.focus();
    });
    host.addEventListener('input', function (e) {
      var k = e.target.dataset.k;
      if (k === 'w') {
        S.w = parseFloat(e.target.value);
        e.target.nextElementSibling.textContent = S.w;
        if (S.mode === 'rev' && S.i === 0) { reset(); while (step()) {} draw(); readout(); }
      }
      if (k === 'i') { S.i = parseInt(e.target.value, 10); draw(); readout(); }
    });
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('resize', draw);

    /* Open on pure noise, the first step; Generate runs the rest. */
    reset();
    shell();
  }

  if (sdHost) sd(sdHost);
  if (toyHost) toy(toyHost);
})();
