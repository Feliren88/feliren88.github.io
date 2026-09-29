/* ════════════════════════════════════════════════════════
   A GAN you train in the browser, on /image-generation/, after GAN Lab
   (Kahng, Thorat, Chau, Viégas and Wattenberg, IEEE VIS 2018; Apache 2.0).

   Generator and discriminator are small multilayer perceptrons written here
   with their own backpropagation and Adam. Nothing is precomputed: the
   discriminator's heatmap, the generator's warped grid and the arrows on
   each fake sample are read from the networks as they train.
   scripts/verify_explainers.py checks the gradients by finite differences.
   ════════════════════════════════════════════════════════ */
(function () {

  /* ── a tiny MLP with backpropagation ── */
  function mlp(sizes, r) {
    var L = [];
    for (var i = 0; i < sizes.length - 1; i++) {
      var n = sizes[i], m = sizes[i + 1], s = Math.sqrt(2 / (n + m)), W = [];
      for (var a = 0; a < m; a++) { var row = []; for (var b = 0; b < n; b++) row.push((r() * 2 - 1) * s * 1.7); W.push(row); }
      L.push({ W: W, b: new Array(m).fill(0) });
    }
    return L;
  }
  /* Forward pass keeping activations. Hidden layers use tanh; the last is linear. */
  function forward(net, x) {
    var acts = [x];
    net.forEach(function (l, i) {
      var h = l.W.map(function (row, a) { return row.reduce(function (s, w, b) { return s + w * acts[i][b]; }, l.b[a]); });
      acts.push(i < net.length - 1 ? h.map(Math.tanh) : h);
    });
    return acts;
  }
  /* Backward pass from dLoss/dOutput; accumulates into grads, returns dLoss/dInput. */
  function backward(net, acts, gOut, grads) {
    var g = gOut;
    for (var i = net.length - 1; i >= 0; i--) {
      var l = net[i], x = acts[i];
      if (grads) {
        for (var a = 0; a < l.W.length; a++) {
          grads[i].b[a] += g[a];
          for (var b = 0; b < x.length; b++) grads[i].W[a][b] += g[a] * x[b];
        }
      }
      var gx = x.map(function (_, b) { return l.W.reduce(function (s, row, a) { return s + row[b] * g[a]; }, 0); });
      if (i > 0) gx = gx.map(function (v, b) { return v * (1 - x[b] * x[b]); });
      g = gx;
    }
    return g;
  }
  function zeros(net) { return net.map(function (l) { return { W: l.W.map(function (r) { return r.map(function () { return 0; }); }), b: l.b.map(function () { return 0; }) }; }); }
  function adam(net, grads, st, lr, n) {
    var b1 = 0.5, b2 = 0.999, eps = 1e-8;
    st.t = (st.t || 0) + 1;
    if (!st.m) { st.m = zeros(net); st.v = zeros(net); }
    var c1 = 1 - Math.pow(b1, st.t), c2 = 1 - Math.pow(b2, st.t);
    net.forEach(function (l, i) {
      function upd(P, G, M, V, a, b) {
        var g = G / n;
        M[a][b] = b1 * M[a][b] + (1 - b1) * g;
        V[a][b] = b2 * V[a][b] + (1 - b2) * g * g;
        P[a][b] -= lr * (M[a][b] / c1) / (Math.sqrt(V[a][b] / c2) + eps);
      }
      for (var a = 0; a < l.W.length; a++) {
        for (var b = 0; b < l.W[a].length; b++) upd(l.W, grads[i].W[a][b], st.m[i].W, st.v[i].W, a, b);
        upd([l.b], grads[i].b[a], [st.m[i].b], [st.v[i].b], 0, a);
      }
    });
  }
  function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

  /* One training step: the discriminator on a real and a fake batch, then the
     generator with the non-saturating loss, -log D(G(z)). */
  function trainStep(G, D, sG, sD, real, zs, lrD, lrG) {
    var gD = zeros(D), lossD = 0;
    real.forEach(function (x) {
      var a = forward(D, x), p = sigmoid(a[a.length - 1][0]);
      lossD -= Math.log(p + 1e-12);
      backward(D, a, [p - 1], gD);
    });
    zs.forEach(function (z) {
      var f = forward(G, z), x = f[f.length - 1], a = forward(D, x), p = sigmoid(a[a.length - 1][0]);
      lossD -= Math.log(1 - p + 1e-12);
      backward(D, a, [p], gD);
    });
    adam(D, gD, sD, lrD, real.length + zs.length);
    var gG = zeros(G), lossG = 0;
    zs.forEach(function (z) {
      var f = forward(G, z), x = f[f.length - 1], a = forward(D, x), p = sigmoid(a[a.length - 1][0]);
      lossG -= Math.log(p + 1e-12);
      var dx = backward(D, a, [p - 1], null);
      backward(G, f, dx, gG);
    });
    adam(G, gG, sG, lrG, zs.length);
    return { d: lossD / (real.length + zs.length), g: lossG / zs.length };
  }

  var GAN = { mlp: mlp, forward: forward, backward: backward, zeros: zeros, sigmoid: sigmoid, trainStep: trainStep };
  if (typeof module === 'object' && module.exports) { module.exports = GAN; return; }

  var host = document.querySelector('[data-xp="gan"]');
  if (!host || !window.XP) return;
  var esc = XP.esc;

  /* ── data distributions, as in GAN Lab ── */
  var DATA = {
    ring: { t: 'Ring', f: function (r) { var a = r() * 2 * Math.PI, d = 0.62 + XP.gauss(r) * 0.04; return [d * Math.cos(a), d * Math.sin(a)]; } },
    two: { t: 'Two clusters', f: function (r) { var c = r() < 0.5 ? [-0.5, 0.45] : [0.5, -0.4]; return [c[0] + XP.gauss(r) * 0.09, c[1] + XP.gauss(r) * 0.09]; } },
    line: { t: 'Line', f: function (r) { var t = r() * 1.4 - 0.7; return [t, 0.5 * t + XP.gauss(r) * 0.03]; } },
    grid: { t: 'Four corners', f: function (r) { var k = Math.floor(r() * 4); return [(k % 2 ? 0.5 : -0.5) + XP.gauss(r) * 0.06, (k < 2 ? 0.5 : -0.5) + XP.gauss(r) * 0.06]; } }
  };

  var S = { data: 'ring', running: false, epoch: 0, lrD: 0.005, lrG: 0.002, heat: true, grid: true, arrows: true };
  var G, D, sG, sD, r, real, zs, history, timer, tipper;
  var N = 128;

  var PAGES = [
    { t: 'Two networks in a contest', parts: [], body: '<p>The <b>generator</b> turns random noise into points. The <b>discriminator</b> scores each point: is it real data or a fake? Each network trains against the other. Press play and watch the fakes, in purple, move onto the real data, in green.</p>' },
    { t: 'The discriminator’s view', parts: ['heat'], body: '<p>The background is the discriminator’s answer everywhere on the plane. Green regions it calls real, purple regions it calls fake. It is trained to separate the two sets it is shown.</p>' },
    { t: 'The generator’s gradients', parts: ['arrows'], body: '<p>Each arrow shows the direction that would make the discriminator believe that fake point more. The generator follows these arrows, which is the only way it ever learns about the real data.</p>' },
    { t: 'How noise is folded', parts: ['grid'], body: '<p>The mesh is a grid of noise values after the generator has transformed them. Watch it stretch and fold to lay the noise over the shape of the data.</p>' },
    { t: 'Losses do not converge', parts: ['loss'], body: '<p>A GAN has no single loss going down. When one network improves, the other’s loss rises. Balance, not a minimum, is the goal, and the curves keep oscillating even when the samples look right.</p>' },
    { t: 'Break it on purpose', parts: [], body: '<p>Raise the generator’s learning rate far above the discriminator’s, or pick <b>Four corners</b>. Fakes often pile onto one mode and ignore the others. That failure is <b>mode collapse</b>.</p>' }
  ];

  function reset() {
    r = XP.rng(11);
    G = mlp([2, 16, 16, 2], r); D = mlp([2, 16, 16, 1], r);
    sG = {}; sD = {};
    real = []; for (var i = 0; i < 400; i++) real.push(DATA[S.data].f(r));
    zs = []; for (var j = 0; j < N; j++) zs.push([r() * 2 - 1, r() * 2 - 1]);
    S.epoch = 0; history = [];
  }
  function batch(set, n) { var out = []; for (var i = 0; i < n; i++) out.push(set[Math.floor(r() * set.length)]); return out; }

  function train(steps) {
    for (var s = 0; s < steps; s++) {
      var z = []; for (var j = 0; j < 64; j++) z.push([r() * 2 - 1, r() * 2 - 1]);
      var l = trainStep(G, D, sG, sD, batch(real, 64), z, S.lrD, S.lrG);
      S.epoch++;
      if (S.epoch % 5 === 0) history.push(l);
    }
    if (history.length > 240) history = history.slice(-240);
  }

  function colours() {
    var cs = getComputedStyle(host);
    return { real: cs.getPropertyValue('--xp-v').trim(), fake: cs.getPropertyValue('--xp-o').trim(), text: cs.color, muted: cs.getPropertyValue('--muted').trim(), bg: cs.getPropertyValue('--bg').trim() };
  }

  function draw() {
    var cv = host.querySelector('.xp-gan-plane'), W = cv.clientWidth, H = cv.clientHeight, dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr;
    var ctx = cv.getContext('2d'), C = colours();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    function X(v) { return (v + 1) / 2 * W; }
    function Y(v) { return (1 - v) / 2 * H; }
    var dim = host.querySelector('.xp-gan').dataset.focus || '';
    if (S.heat) {
      ctx.globalAlpha = dim && dim !== 'heat' ? 0.15 : 0.55;
      var n = 36;
      for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
        var x = -1 + (i + 0.5) * 2 / n, y = -1 + (j + 0.5) * 2 / n, a = forward(D, [x, y]), p = sigmoid(a[3][0]);
        ctx.fillStyle = p > 0.5 ? C.real : C.fake;
        ctx.globalAlpha = (dim && dim !== 'heat' ? 0.25 : 1) * Math.min(0.45, Math.abs(p - 0.5) * 0.9);
        ctx.fillRect(X(x - 1 / n), Y(y + 1 / n), W / n + 1, H / n + 1);
      }
    }
    if (S.grid) {
      ctx.globalAlpha = dim && dim !== 'grid' ? 0.1 : 0.45;
      ctx.strokeStyle = C.fake; ctx.lineWidth = 1;
      var m = 10;
      for (var gi = 0; gi <= m; gi++) {
        ctx.beginPath();
        for (var gj = 0; gj <= m; gj++) {
          var p1 = forward(G, [-1 + 2 * gi / m, -1 + 2 * gj / m])[3];
          if (gj) ctx.lineTo(X(p1[0]), Y(p1[1])); else ctx.moveTo(X(p1[0]), Y(p1[1]));
        }
        ctx.stroke(); ctx.beginPath();
        for (var gk = 0; gk <= m; gk++) {
          var p2 = forward(G, [-1 + 2 * gk / m, -1 + 2 * gi / m])[3];
          if (gk) ctx.lineTo(X(p2[0]), Y(p2[1])); else ctx.moveTo(X(p2[0]), Y(p2[1]));
        }
        ctx.stroke();
      }
    }
    ctx.globalAlpha = dim && dim !== 'heat' && dim !== 'grid' && dim !== 'arrows' ? 1 : dim ? 0.35 : 0.9;
    ctx.fillStyle = C.real;
    real.forEach(function (p) { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 2.2, 0, 2 * Math.PI); ctx.fill(); });
    zs.forEach(function (z) {
      var f = forward(G, z), x = f[3], a = forward(D, x), p = sigmoid(a[3][0]);
      ctx.globalAlpha = dim && dim !== 'arrows' ? 0.35 : 0.95;
      ctx.fillStyle = C.fake;
      ctx.beginPath(); ctx.arc(X(x[0]), Y(x[1]), 2.6, 0, 2 * Math.PI); ctx.fill();
      if (S.arrows) {
        var g = backward(D, a, [p - 1], null), len = Math.hypot(g[0], g[1]) || 1, k = 0.06 / Math.max(len, 0.5);
        ctx.globalAlpha = dim && dim !== 'arrows' ? 0.08 : 0.6;
        ctx.strokeStyle = C.text; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(X(x[0]), Y(x[1])); ctx.lineTo(X(x[0] - g[0] * k * 10), Y(x[1] - g[1] * k * 10)); ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;
    drawLoss(C, dim);
    host.querySelector('.xp-gan-epoch').textContent = S.epoch.toLocaleString();
  }

  function drawLoss(C, dim) {
    var cv = host.querySelector('.xp-gan-loss'), W = cv.clientWidth, H = cv.clientHeight, dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr;
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (history.length < 2) return;
    var mx = 0;
    history.forEach(function (h) { mx = Math.max(mx, h.d, h.g); });
    ctx.globalAlpha = dim && dim !== 'loss' ? 0.2 : 1;
    [['d', C.real], ['g', C.fake]].forEach(function (s) {
      ctx.strokeStyle = s[1]; ctx.lineWidth = 1.6; ctx.beginPath();
      history.forEach(function (h, i) {
        var x = i / (history.length - 1) * W, y = H - 4 - h[s[0]] / mx * (H - 8);
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      });
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    var last = history[history.length - 1];
    host.querySelector('.xp-gan-lossv').innerHTML = '<span class="is-real">discriminator ' + last.d.toFixed(3) + '</span><span class="is-fake">generator ' + last.g.toFixed(3) + '</span>';
  }

  function loop() {
    if (!S.running) return;
    train(4);
    draw();
    timer = requestAnimationFrame(loop);
  }
  function setRunning(on) {
    S.running = on;
    var b = host.querySelector('[data-play]');
    b.textContent = on ? 'Pause' : 'Train';
    b.setAttribute('aria-pressed', String(on));
    if (on) loop(); else cancelAnimationFrame(timer);
  }

  function mount() {
    host.innerHTML = '<div class="xp-toolbar">' +
      '<button type="button" class="xp-go is-inline" data-play aria-pressed="false">Train</button>' +
      '<button type="button" class="xp-go is-inline" data-step>Step</button>' +
      '<button type="button" class="xp-go is-inline" data-reset>Reset</button>' +
      '<span class="xp-field"><span>Epoch</span><output class="xp-gan-epoch">0</output></span>' +
      '<div class="xp-field"><span>Data</span><div class="xp-seg" role="group" aria-label="Real data distribution">' +
      Object.keys(DATA).map(function (k) { return '<button type="button" data-data="' + k + '" aria-pressed="' + (k === S.data) + '">' + DATA[k].t + '</button>'; }).join('') + '</div></div>' +
      '<label class="xp-field is-stack"><span>Discriminator rate <output>' + S.lrD + '</output></span><input type="range" min="0.001" max="0.05" step="0.001" value="' + S.lrD + '" data-k="lrD"></label>' +
      '<label class="xp-field is-stack"><span>Generator rate <output>' + S.lrG + '</output></span><input type="range" min="0.001" max="0.05" step="0.001" value="' + S.lrG + '" data-k="lrG"></label>' +
      '<div class="xp-toggles"><label><input type="checkbox" data-t="heat" checked> Discriminator view</label><label><input type="checkbox" data-t="grid" checked> Generator grid</label><label><input type="checkbox" data-t="arrows" checked> Gradients</label></div>' +
      '</div>' +
      '<div class="xp-stage"><div class="xp-gan">' +
      '<figure class="xp-gan-graph" aria-label="Model overview">' +
      '<svg viewBox="0 0 300 250" role="img" aria-label="Noise feeds the generator; its fake samples and the real samples both feed the discriminator, which outputs a score">' +
      XP.svgEl('rect', { x: 10, y: 20, width: 70, height: 36, rx: 6, 'class': 'xp-gnode' }) + XP.svgEl('text', { x: 45, y: 43, 'text-anchor': 'middle' }, 'noise z') +
      XP.svgEl('rect', { x: 110, y: 20, width: 80, height: 36, rx: 6, 'class': 'xp-gnode is-g' }) + XP.svgEl('text', { x: 150, y: 43, 'text-anchor': 'middle' }, 'Generator') +
      XP.svgEl('rect', { x: 215, y: 20, width: 75, height: 36, rx: 6, 'class': 'xp-gnode is-fake' }) + XP.svgEl('text', { x: 252, y: 43, 'text-anchor': 'middle' }, 'fake') +
      XP.svgEl('rect', { x: 215, y: 100, width: 75, height: 36, rx: 6, 'class': 'xp-gnode is-real' }) + XP.svgEl('text', { x: 252, y: 123, 'text-anchor': 'middle' }, 'real') +
      XP.svgEl('rect', { x: 110, y: 170, width: 90, height: 36, rx: 6, 'class': 'xp-gnode is-d' }) + XP.svgEl('text', { x: 155, y: 193, 'text-anchor': 'middle' }, 'Discriminator') +
      XP.svgEl('rect', { x: 10, y: 170, width: 70, height: 36, rx: 6, 'class': 'xp-gnode' }) + XP.svgEl('text', { x: 45, y: 193, 'text-anchor': 'middle' }, 'real or fake') +
      XP.svgEl('path', { d: 'M80 38H110M190 38H215M252 56V70C252 150 240 188 200 188M252 136V160C252 185 230 188 200 188M110 188H80', 'class': 'xp-garrow' }) +
      XP.svgEl('path', { d: 'M150 170C150 120 150 90 150 56', 'class': 'xp-garrow is-back' }) +
      XP.svgEl('text', { x: 158, y: 118, 'class': 'xp-gsmall' }, 'gradients') +
      '</svg><figcaption>Generator: 2 → 16 → 16 → 2. Discriminator: 2 → 16 → 16 → 1. Both tanh, trained with Adam.</figcaption></figure>' +
      '<div class="xp-gan-main" data-part="heat grid arrows"><canvas class="xp-gan-plane" role="img" aria-label="Real samples in green, generated samples in purple, over the discriminator’s score"></canvas>' +
      '<p class="xp-gan-key"><span class="is-real">real</span><span class="is-fake">fake</span></p></div>' +
      '<div class="xp-gan-side" data-part="loss"><p class="xp-note">Loss, recent history</p><canvas class="xp-gan-loss" role="img" aria-label="Discriminator and generator loss over training"></canvas><p class="xp-gan-lossv"></p></div>' +
      '</div></div>';
    var st = host.querySelector('.xp-stage');
    tipper = XP.tip(st);
    reset();
    XP.guide(st, PAGES, function (p) {
      host.querySelector('.xp-gan').dataset.focus = p && p.parts.length ? p.parts[0] : '';
      XP.highlight(host.querySelector('.xp-gan'), p ? p.parts : []);
      draw();
    });

    host.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || b.closest('.xp-guide') || b.classList.contains('xp-guide-open')) return;
      if (b.hasAttribute('data-play')) setRunning(!S.running);
      else if (b.hasAttribute('data-step')) { setRunning(false); train(20); draw(); }
      else if (b.hasAttribute('data-reset')) { setRunning(false); reset(); draw(); }
      else if (b.dataset.data) {
        S.data = b.dataset.data;
        Array.prototype.forEach.call(host.querySelectorAll('[data-data]'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        setRunning(false); reset(); draw();
      }
    });
    host.addEventListener('input', function (e) {
      var k = e.target.dataset.k;
      if (!k) return;
      S[k] = +e.target.value;
      e.target.closest('label').querySelector('output').textContent = S[k];
    });
    host.addEventListener('change', function (e) {
      var t = e.target.dataset.t;
      if (!t) return;
      S[t] = e.target.checked; draw();
    });
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('resize', draw);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { if (!en[0].isIntersecting && S.running) setRunning(false); }).observe(host);
    }
  }
  mount();
})();
