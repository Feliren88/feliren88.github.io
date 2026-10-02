/* ════════════════════════════════════════════════════════
   Linear Algebra, module 7: numerical behaviour.
   2 lines cross at the solution; as they turn parallel, a small nudge to y
   swings the crossing along a streak whose shape is set by κ. Solving
   beats inverting on Hilbert matrices, and feature scaling turns a
   zigzag descent into a straight one.
   ════════════════════════════════════════════════════════ */
(function () {

  /* 2 lines through the plane: y = c₁ (horizontal) and a line at angle
     theta degrees. Each row is a line's normal. */
  function system(theta) {
    var t = theta * Math.PI / 180;
    return [0, 1, -Math.sin(t), Math.cos(t)];
  }
  function det(m) { return m[0] * m[3] - m[1] * m[2]; }
  function solve2(m, y) {
    var d = det(m), s = Math.abs(m[0]) + Math.abs(m[1]) + Math.abs(m[2]) + Math.abs(m[3]);
    if (Math.abs(d) <= 1e-12 * s * s) return null;
    return [(m[3] * y[0] - m[1] * y[1]) / d, (m[0] * y[1] - m[2] * y[0]) / d];
  }
  function svals(m) {
    var p = m[0] * m[0] + m[2] * m[2], q = m[0] * m[1] + m[2] * m[3], r = m[1] * m[1] + m[3] * m[3];
    var mid = (p + r) / 2, rad = Math.sqrt((p - r) * (p - r) / 4 + q * q);
    return [Math.sqrt(mid + rad), Math.sqrt(Math.max(0, mid - rad))];
  }
  function cond(m) { var s = svals(m); return s[1] <= 1e-12 * s[0] ? null : s[0] / s[1]; }

  function hilbert(n) {
    var H = [];
    for (var i = 0; i < n; i++) { H.push([]); for (var j = 0; j < n; j++) H[i].push(1 / (i + j + 1)); }
    return H;
  }
  function matvec(A, x) { return A.map(function (row) { return row.reduce(function (s, v, j) { return s + v * x[j]; }, 0); }); }
  function norm(v) { return Math.sqrt(v.reduce(function (s, x) { return s + x * x; }, 0)); }
  /* Gaussian elimination with partial pivoting. */
  function gaussSolve(A, b) {
    var n = A.length, M = A.map(function (r, i) { return r.concat([b[i]]); }), i, j, k;
    for (k = 0; k < n; k++) {
      var p = k;
      for (i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
      var tmp = M[k]; M[k] = M[p]; M[p] = tmp;
      if (!Number.isFinite(M[k][k]) || M[k][k] === 0) return null;
      for (i = k + 1; i < n; i++) { var f = M[i][k] / M[k][k]; for (j = k; j <= n; j++) M[i][j] -= f * M[k][j]; }
    }
    var x = new Array(n);
    for (i = n - 1; i >= 0; i--) { var s = M[i][n]; for (j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; }
    return x;
  }
  /* Gauss-Jordan inversion with partial pivoting. */
  function invert(A) {
    var n = A.length, M = A.map(function (r, i) { return r.concat(A.map(function (_, j) { return i === j ? 1 : 0; })); }), i, j, k;
    for (k = 0; k < n; k++) {
      var p = k;
      for (i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
      var tmp = M[k]; M[k] = M[p]; M[p] = tmp;
      if (!Number.isFinite(M[k][k]) || M[k][k] === 0) return null;
      var d = M[k][k];
      for (j = 0; j < 2 * n; j++) M[k][j] /= d;
      for (i = 0; i < n; i++) if (i !== k) { var f = M[i][k]; for (j = 0; j < 2 * n; j++) M[i][j] -= f * M[k][j]; }
    }
    return M.map(function (r) { return r.slice(n); });
  }
  /* Solve H x = b with x = 1s, 2 ways, and report the relative errors. */
  function hilbertErrors(n) {
    var H = hilbert(n), x = H.map(function () { return 1; }), b = matvec(H, x);
    var xs = gaussSolve(H, b), xi = matvec(invert(H), b);
    function fwd(v) { return norm(v.map(function (e, i) { return e - x[i]; })) / norm(x); }
    function res(v) { return norm(matvec(H, v).map(function (e, i) { return e - b[i]; })) / norm(b); }
    return { fwdSolve: fwd(xs), fwdInv: fwd(xi), resSolve: res(xs), resInv: res(xi) };
  }

  /* Gradient descent on ½(w₁² + 25 w₂²), or, after scaling the second
     feature by 5, on ½(w₁² + w₂²). The stated step sizes keep both iterations stable. */
  function gdPath(scaled, start, steps) {
    var h = scaled ? [1, 1] : [1, 25], lr = scaled ? 0.5 : 0.075, w = start.slice(), out = [w.slice()];
    for (var k = 0; k < steps; k++) { w = [w[0] - lr * h[0] * w[0], w[1] - lr * h[1] * w[1]]; out.push(w.slice()); }
    return out;
  }
  function stepsTo(scaled, start, tol) {
    var p = gdPath(scaled, start, 500);
    for (var k = 0; k < p.length; k++) if (Math.sqrt(p[k][0] * p[k][0] + p[k][1] * p[k][1]) < tol) return k;
    return null;
  }

  var M = { system: system, det: det, solve2: solve2, svals: svals, cond: cond, hilbert: hilbert, gaussSolve: gaussSolve,
    invert: invert, hilbertErrors: hilbertErrors, gdPath: gdPath, stepsTo: stepsTo };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  XP.lab('linear-algebra/conditioning', function (root, api) {
    var fmt = XP.fmt, svgEl = XP.svgEl, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var dlg = XP.dialog(root), X0 = [0, 0.3], REACH = 3;
    var rr = XP.rng(5), DISC = [];
    for (var i = 0; i < 80; i++) { var a = 2 * Math.PI * rr(), rad = Math.sqrt(rr()); DISC.push([rad * Math.cos(a), rad * Math.sin(a)]); }
    var START = { mode: 'lines', theta: 70, delta: 0, n: 10, scaled: false, gstep: 60 };
    var s = JSON.parse(JSON.stringify(START)), motion = null, progress = 0;
    var P = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: '2 lines crossing at the solution, with the crossing points for nudged right-hand sides' });
    var PH = XP.plane(stage, { x: [1.5, 12.5], y: [-17, 1], w: 480, h: 240, pad: 6, label: 'Residuals of solving and of inverting, for Hilbert matrices of growing size, on a log scale' });
    var PG = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'Loss contours and a gradient descent path, before or after scaling' });

    ctl.innerHTML =
      '<label>View <select data-k="mode" aria-label="What to show"><option value="lines">2 lines</option><option value="hilbert">Hilbert matrices</option><option value="scale">Feature scaling</option></select></label>' +
      '<label>Nudge δ <input type="range" data-k="delta" min="0" max="0.3" step="0.01" aria-label="Size of the nudge to y"></label>' +
      '<label>Size n <input type="range" data-k="n" min="2" max="12" step="1" aria-label="Size of the Hilbert matrix"></label>' +
      '<label>Motion <input type="range" data-k="progress" min="0" max="1" step="0.01" aria-label="Scrub the last motion"></label>' +
      '<button type="button" data-act="play">Play</button>' +
      '<button type="button" data-act="scaled" aria-pressed="false">Scale the features</button>' +
      '<button type="button" data-zoom="kappa">κ, worked</button>' +
      '<button type="button" data-zoom="errors">Errors table</button>' +
      '<button type="button" data-reset>Reset</button>';
    var el = {};
    Array.prototype.forEach.call(ctl.querySelectorAll('[data-k], [data-act]'), function (x) { el[x.getAttribute('data-k') || x.getAttribute('data-act')] = x; });

    /* The end of the second line: drag it round the crossing to tilt the line. */
    var ht = P.handle({ x: 0, y: 0, label: 'End of the tilting line', cls: 'is-k', part: 'line2', snap: 0.05, onMove: function (x, y, done) {
      var t = Math.atan2(y - X0[1], x - X0[0]) * 180 / Math.PI;
      if (t < 0) t += 180;
      s.theta = Math.max(0.5, Math.min(179.5, t)); draw(); if (done) report();
    } });

    function lineMarkup(theta, off, cls, part) {
      var t = theta * Math.PI / 180, d = [Math.cos(t), Math.sin(t)], p = [X0[0] + off[0], X0[1] + off[1]];
      return svgEl('line', { x1: P.map.sx(p[0] - 12 * d[0]), y1: P.map.sy(p[1] - 12 * d[1]), x2: P.map.sx(p[0] + 12 * d[0]), y2: P.map.sy(p[1] + 12 * d[1]), 'class': cls, 'data-part': part });
    }
    function cloud(m) {
      var y0 = [m[0] * X0[0] + m[1] * X0[1], m[2] * X0[0] + m[3] * X0[1]];
      return DISC.map(function (q) { return solve2(m, [y0[0] + s.delta * q[0], y0[1] + s.delta * q[1]]); }).filter(Boolean);
    }
    function ratioOf(pts) {
      if (pts.length < 3) return null;
      var mx = 0, my = 0, n = pts.length, sxx = 0, syy = 0, sxy = 0;
      pts.forEach(function (p) { mx += p[0] / n; my += p[1] / n; });
      pts.forEach(function (p) { var dx = p[0] - mx, dy = p[1] - my; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; });
      var mid = (sxx + syy) / 2, rad = Math.sqrt((sxx - syy) * (sxx - syy) / 4 + sxy * sxy);
      return mid - rad <= 1e-18 ? null : Math.sqrt((mid + rad) / (mid - rad));
    }

    function draw() {
      el.mode.value = s.mode; el.delta.value = s.delta; el.n.value = s.n; el.progress.value = progress;
      el.scaled.setAttribute('aria-pressed', s.scaled ? 'true' : 'false');
      el.delta.parentNode.hidden = s.mode !== 'lines';
      el.n.parentNode.hidden = s.mode !== 'hilbert';
      el.scaled.hidden = s.mode !== 'scale';
      P.svg.style.display = s.mode === 'lines' ? '' : 'none';
      PH.svg.style.display = s.mode === 'hilbert' ? '' : 'none';
      PG.svg.style.display = s.mode === 'scale' ? '' : 'none';
      var m = system(s.theta), k = cond(m);
      api.values({ kappa: k === null ? 'Undefined' : fmt(k), angle: fmt(s.theta, 0) });
      root.querySelector('[data-line-equation]').hidden = s.mode !== 'lines';
      root.querySelector('[data-scale-equation]').hidden = s.mode !== 'scale';
      root.querySelector('[data-hilbert-equation]').hidden = s.mode !== 'hilbert';
      ctl.querySelector('[data-zoom="kappa"]').hidden = s.mode === 'hilbert';
      ctl.querySelector('[data-zoom="errors"]').hidden = s.mode !== 'hilbert';
      if (s.mode === 'lines') drawLines(m, k);
      if (s.mode === 'hilbert') drawHilbert();
      if (s.mode === 'scale') drawScale();
    }
    function drawLines(m, k) {
      P.grid.innerHTML = P.gridMarkup(null, 1, 'pl-std is-faint');
      var h = lineMarkup(0, [0, 0], 'pl-line is-q', 'line1') + lineMarkup(s.theta, [0, 0], 'pl-line is-k', 'line2');
      if (s.delta > 0) {
        var pts = cloud(m), inv = solve2(m, [1, 0]) && [solve2(m, [1, 0]), solve2(m, [0, 1])];
        if (inv) {
          var ell = [];
          for (var a = 0; a <= 72; a++) {
            var c = Math.cos(a * Math.PI / 36) * s.delta, sn = Math.sin(a * Math.PI / 36) * s.delta;
            ell.push([X0[0] + c * inv[0][0] + sn * inv[1][0], X0[1] + c * inv[0][1] + sn * inv[1][1]]);
          }
          h += '<polyline class="pl-ellipse" data-part="ellipse" points="' + P.pts(ell) + '"/>';
        }
        pts.forEach(function (p) { h += P.dot(p[0], p[1], 2.4, 'pl-mark pl-cloud', 'cloud'); });
        var rt = ratioOf(pts);
        api.values({ ratio: rt === null ? '–' : fmt(rt) });
      } else api.values({ ratio: '–' });
      h += P.dot(X0[0], X0[1], 5, 'pl-mark pl-cross', 'cross');
      P.plot.innerHTML = h;
      var t = s.theta * Math.PI / 180;
      ht.set(X0[0] + REACH * Math.cos(t), X0[1] + REACH * Math.sin(t));
    }
    function drawHilbert() {
      PH.grid.innerHTML = [-15, -10, -5, 0].map(function (y) {
        return svgEl('line', { x1: 0, y1: PH.map.sy(y), x2: PH.w, y2: PH.map.sy(y), 'class': 'pl-axis is-faint' }) +
          svgEl('text', { x: 8, y: PH.map.sy(y) - 3 }, '1e' + y);
      }).join('');
      var h = '';
      for (var n = 2; n <= 12; n++) {
        var e = hilbertErrors(n), on = n === s.n ? '' : ' is-faint';
        [['resSolve', -0.32, 'pl-bar-solve'], ['resInv', 0.02, 'pl-bar-inv']].forEach(function (b) {
          var v = Math.max(-17, Math.log10(Math.max(e[b[0]], 1e-17)));
          h += svgEl('rect', { x: PH.map.sx(n + b[1]), y: PH.map.sy(v), width: PH.map.sx(n + 0.3) - PH.map.sx(n), height: PH.map.sy(-17) - PH.map.sy(v), 'class': 'pl-mark ' + b[2] + on, 'data-part': b[0] });
        });
      }
      PH.plot.innerHTML = h;
      var cur = hilbertErrors(s.n);
      api.values({ ratio: '–', resSolve: cur.resSolve.toExponential(1), resInv: cur.resInv.toExponential(1), size: s.n });
      describe('For n = ' + s.n + ', solving leaves a residual of ' + cur.resSolve.toExponential(1) + ', and inverting first leaves ' + cur.resInv.toExponential(1) + '.');
    }
    function drawScale() {
      var start = s.scaled ? [-2.5, 2.5] : [-2.5, 0.5], path = gdPath(s.scaled, start, s.gstep);
      PG.grid.innerHTML = PG.axes();
      var h = '';
      for (var k = 1; k <= 6; k++) {
        var ring = [];
        for (var a = 0; a <= 72; a++) ring.push([0.5 * k * Math.cos(a * Math.PI / 36), 0.5 * k * Math.sin(a * Math.PI / 36) / (s.scaled ? 1 : 5)]);
        h += '<polyline class="pl-contour" data-part="loss" points="' + PG.pts(ring) + '"/>';
      }
      h += '<polyline class="pl-curve is-o" data-part="path" points="' + PG.pts(path) + '"/>';
      path.forEach(function (p) { h += PG.dot(p[0], p[1], 2.2, 'pl-mark pl-step', 'path'); });
      PG.plot.innerHTML = h;
      api.values({ kappa: s.scaled ? 1 : 25, curvature: s.scaled ? 1 : 25 });
      var n = stepsTo(s.scaled, start, 0.05);
      describe((s.scaled ? 'After scaling' : 'Before scaling') + ', descent needs ' + n + ' steps to get within 0.05 of the minimum.');
    }

    function report() {
      if (s.mode !== 'lines') return;
      var k = cond(system(s.theta));
      describe('The lines meet at ' + fmt(s.theta, 0) + ' degrees. ' + (k === null ? 'They are parallel, so there is no single crossing.' : 'The condition number is ' + fmt(k) + '.'));
    }
    function describe(text) { api.say(text); root.querySelector('[data-note]').textContent = text; }
    function prepare(target) {
      motion = {
        from: { theta: s.theta, delta: s.delta, gstep: s.gstep, n: s.n },
        to: { theta: 'theta' in target ? target.theta : s.theta, delta: 'delta' in target ? target.delta : s.delta,
          gstep: s.mode === 'scale' ? 60 : s.gstep, n: 'n' in target ? target.n : s.n }
      };
      progress = 0;
    }
    function frame(f) {
      progress = f;
      var st = XP.mix(motion.from, motion.to, f);
      s.theta = st.theta; s.delta = st.delta; s.gstep = Math.round(st.gstep); s.n = Math.round(st.n); draw();
    }
    function replay() { api.animate({ f: 0 }, { f: 1 }, 800, function (st) { frame(st.f); }, report); }
    function goTo(target) {
      if (target.mode) s.mode = target.mode;
      if ('scaled' in target) { s.scaled = target.scaled; s.gstep = 0; }
      prepare(target); replay();
    }
    function play() {
      if (s.mode === 'scale') { s.gstep = 0; prepare({}); }
      else if (s.mode === 'hilbert') { s.n = 2; prepare({ n: 12 }); }
      else { var end = s.delta || 0.15; s.delta = 0; prepare({ delta: end }); }
      replay();
    }

    function table(rows, head) {
      return '<table class="xp-table lab-table"><thead><tr>' + head.map(function (x) { return '<th scope="col">' + x + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
    }
    ctl.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-k');
      if (k === 'progress' && motion) { var requested = +e.target.value; api.interrupt(); frame(requested); report(); }
      if (k === 'delta' || k === 'n') { var target = {}; target[k] = +e.target.value; api.interrupt(); prepare(target); frame(1); }
    });
    ctl.addEventListener('change', function (e) {
      if (e.target.getAttribute('data-k') === 'mode') { s.mode = e.target.value; if (s.mode === 'scale') s.gstep = 0; prepare(s.mode === 'hilbert' ? { n: 12 } : s.mode === 'lines' ? { delta: 0.15 } : {}); draw(); }
      report();
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act'), z = b.getAttribute('data-zoom');
      if (z === 'kappa') {
        var scaling = s.mode === 'scale';
        var m = scaling ? [1, 0, 0, s.scaled ? 1 : 25] : system(s.theta), sv = svals(m), k = cond(m);
        dlg.open('κ, worked', table([[scaling ? 'Loss matrix diag(1, ' + (s.scaled ? 1 : 25) + ')' : fmt(s.theta, 0) + '°', fmt(sv[0], 3), fmt(sv[1], 3), k === null ? 'Undefined' : fmt(k)]], ['Example', 'σmax', 'σmin', 'κ = σmax ÷ σmin']) +
          '<p>' + (scaling ? 'The ratio compares the steepest and shallowest directions in this quadratic loss.' : 'A nudge of size δ to y can move the answer by up to δ ÷ σmin. The relative change in the answer is bounded by κ times the relative input nudge.') + '</p>', b);
        return;
      }
      if (z === 'errors') {
        var rows = [];
        for (var n = 2; n <= 12; n++) { var er = hilbertErrors(n); rows.push([n, er.resSolve.toExponential(1), er.resInv.toExponential(1), er.fwdSolve.toExponential(1), er.fwdInv.toExponential(1)]); }
        dlg.open('Errors table', table(rows, ['n', 'residual, solve', 'residual, invert', 'error in x, solve', 'error in x, invert']) +
          '<p>Every value is relative and computed in your browser in 64-bit floats, with x set to all 1s.</p>', b);
        return;
      }
      if (act === 'play') { play(); return; }
      if (act === 'scaled') { goTo({ scaled: !s.scaled }); return; }
      if (b.hasAttribute('data-reset')) { api.interrupt(); s = JSON.parse(JSON.stringify(START)); prepare({ delta: 0.15 }); }
      draw(); report();
    });

    var PAGES = [
      { t: '2 lines, 1 crossing', parts: ['line1', 'line2', 'cross'], state: { mode: 'lines', theta: 70, delta: 0 },
        body: '<p>These lines meet at (0, 0.3), with an angle of 70° between them. Drag the second line’s end to change that angle.</p>' },
      { t: 'Nudge y', parts: ['cloud', 'cross'], state: { theta: 70, delta: 0.15 },
        body: '<p>The 80 simulated input nudges have lengths up to 0.15. Therefore, the dots show where each new crossing lands.</p>' },
      { t: 'Tilt towards parallel', parts: ['cloud', 'line2'], state: { theta: 8, delta: 0.15 },
        body: '<p>With the lines 8° apart, the same nudges scatter the crossing along a long streak. The condition number κ measures sensitivity; the cloud’s width ratio gives an estimate.</p>' },
      { t: 'Where κ comes from', parts: ['ellipse'], state: { theta: 8, delta: 0.15 },
        body: '<p>The <b class="is-o">ellipse</b> marks all solutions produced by input nudges of exactly δ. Its long-to-short radius ratio is κ = σmax ÷ σmin.</p>' },
      { t: 'Solving beats inverting', parts: ['resSolve', 'resInv'], state: { mode: 'hilbert', n: 10 },
        body: ('<p>Hilbert matrices have entries '+window.InterviewDisplayMath.html("lab/conditioning/worked-0", undefined, true)+', making large systems sensitive to rounding. At n = 10, forming an inverse leaves a larger residual than a direct solve.</p>') },
      { t: 'Unscaled features', parts: ['path', 'loss'], state: { mode: 'scale', scaled: false },
        body: '<p>Gradient descent takes steps downhill on the loss surface. Here, a feature 5 times larger than the other produces thin contours and a zigzag path.</p>' },
      { t: 'After scaling', parts: ['path', 'loss'], state: { mode: 'scale', scaled: true },
        body: '<p>Rescale that feature and the contours turn round. Descent heads straight for the minimum in far fewer steps.</p>' }
    ];
    prepare({ delta: 0.15 });
    draw();
    XP.guide(root.querySelector('[data-guide-box]'), PAGES, function (p, i, redraw) {
      if (!p) { api.focus([]); return; }
      if (!redraw) {
        var target = {};
        PAGES.slice(0, i + 1).forEach(function (page) { Object.assign(target, page.state); });
        goTo(target);
      }
      api.focus(p.parts);
    });
  });
})();
