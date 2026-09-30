/* ════════════════════════════════════════════════════════
   Linear Algebra, module 6: projections and least squares.
   In 3D, y's shadow on the plane of X's columns is the fit, and the
   residual stands at a right angle. In 2D, each residual carries its own
   square. Ridge pulls the weights in along a path. The 2D fit feeds the
   module's live equation (slots w, b and loss).
   ════════════════════════════════════════════════════════ */
(function () {

  /* Solve G w = r for a symmetric positive definite G by Cholesky, or null. */
  function solveSPD(G, r) {
    var n = G.length, L = [], i, j, k;
    for (i = 0; i < n; i++) {
      L.push([]);
      for (j = 0; j <= i; j++) {
        var sum = G[i][j];
        for (k = 0; k < j; k++) sum -= L[i][k] * L[j][k];
        if (i === j) {
          if (!(sum > 1e-12 * Math.max(1, Math.abs(G[i][i])))) return null;
          L[i].push(Math.sqrt(sum));
        } else L[i].push(sum / L[j][j]);
      }
    }
    var z = [];
    for (i = 0; i < n; i++) { var s = r[i]; for (k = 0; k < i; k++) s -= L[i][k] * z[k]; z.push(s / L[i][i]); }
    var w = new Array(n);
    for (i = n - 1; i >= 0; i--) { var t = z[i]; for (k = i + 1; k < n; k++) t -= L[k][i] * w[k]; w[i] = t / L[i][i]; }
    return w;
  }
  function gram(X) {
    var p = X[0].length, G = [];
    for (var i = 0; i < p; i++) { G.push([]); for (var j = 0; j < p; j++) { var s = 0; for (var k = 0; k < X.length; k++) s += X[k][i] * X[k][j]; G[i].push(s); } }
    return G;
  }
  /* Least squares by the normal equations, with ridge penalty lam. */
  function lstsq(X, y, lam) {
    var G = gram(X), r = [], p = G.length, i, k;
    for (i = 0; i < p; i++) { G[i][i] += lam || 0; var s = 0; for (k = 0; k < X.length; k++) s += X[k][i] * y[k]; r.push(s); }
    return solveSPD(G, r);
  }
  function fitLine(points) {
    var w = lstsq(points.map(function (q) { return [q[0], 1]; }), points.map(function (q) { return q[1]; }), 0);
    if (!w) return { w: 0, b: points.reduce(function (sum, q) { return sum + q[1]; }, 0) / points.length, unique: false };
    return { w: w[0], b: w[1], unique: true };
  }
  function mse(points, w, b) {
    return points.reduce(function (s, q) { var r = q[1] - (w * q[0] + b); return s + r * r; }, 0) / points.length;
  }
  /* y's shadow on the plane of columns a and b, or null when they are parallel. */
  function project(a, b, y) {
    var X = [[a[0], b[0]], [a[1], b[1]], [a[2], b[2]]], w = lstsq(X, y, 0);
    if (!w) return null;
    var yhat = [0, 1, 2].map(function (i) { return w[0] * a[i] + w[1] * b[i]; });
    return { w: w, yhat: yhat, r: [y[0] - yhat[0], y[1] - yhat[1], y[2] - yhat[2]] };
  }
  /* The orthographic view used in module 1, and its screen axes in 3D. */
  function view3(p, yaw, pitch) {
    var cy = Math.cos(yaw), sy = Math.sin(yaw);
    return [cy * p[0] + sy * p[1], Math.cos(pitch) * p[2] - Math.sin(pitch) * (-sy * p[0] + cy * p[1])];
  }
  function camera(yaw, pitch) {
    var cy = Math.cos(yaw), sy = Math.sin(yaw), sp = Math.sin(pitch);
    return { right: [cy, sy, 0], up: [sp * sy, -sp * cy, Math.cos(pitch)] };
  }
  function ridgePath(X, y, lams) { return lams.map(function (l) { return lstsq(X, y, l); }); }

  var M = { solveSPD: solveSPD, gram: gram, lstsq: lstsq, fitLine: fitLine, mse: mse, project: project,
    view3: view3, camera: camera, ridgePath: ridgePath };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  XP.lab('linear-algebra/least-squares', function (root, api) {
    var fmt = XP.fmt, svgEl = XP.svgEl, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var dlg = XP.dialog(root);
    var A = [1.6, 0.2, 0.4], B = [0.3, 1.5, 0.5], BNEAR = [1.5, 0.35, 0.45], Y = [1.2, 1.4, 2.4];
    var PTS = [[1, 2.1], [2, 3.4], [3, 3.2], [4, 5.1], [5, 5.6], [6, 7.2], [7, 7.1], [8, 9.4], [9, 9.1]];
    var rr = XP.rng(21), RX = [], RY = [];
    for (var i = 0; i < 30; i++) {
      var g1 = XP.gauss(rr), g2 = XP.gauss(rr), g3 = XP.gauss(rr), x2 = 0.8 * g1 + 0.6 * g2;
      RX.push([g1, x2]); RY.push(1.5 * g1 + x2 + 0.5 * g3);
    }
    var LAMS = [];
    for (i = 0; i <= 60; i++) LAMS.push(Math.pow(10, -3 + i * 0.1));
    var PATH = ridgePath(RX, RY, LAMS);
    var START = { mode: '3d', y: Y.slice(), b: B.slice(), yaw: 0.7, pitch: 0.45, w: 0.4, c: 4, pts: PTS.map(function (p) { return p.slice(); }), lam: -3 };
    var s = JSON.parse(JSON.stringify(START)), motion = null, progress = 0;
    var P3 = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'The target y above the plane of the columns, with its shadow and the residual' });
    var PF = XP.plane(stage, { x: [0, 10], y: [0, 12], w: 480, h: 360, label: '9 points, a line, and a square on each residual' });
    var PR = XP.plane(stage, { x: [-1, 3], y: [-1, 2], w: 480, h: 360, label: 'Loss contours in weight space, the ridge path, and the constraint circle' });

    ctl.innerHTML =
      '<label>View <select data-k="mode" aria-label="What to show"><option value="3d">3D shadow</option><option value="fit">2D fit</option><option value="ridge">Ridge</option></select></label>' +
      '<label>Motion <input type="range" data-k="progress" min="0" max="1" step="0.01" aria-label="Scrub the last motion"></label>' +
      '<button type="button" data-act="play">Play</button>' +
      '<button type="button" data-act="snap">Snap to least squares</button>' +
      '<label>log₁₀ λ <input type="range" data-k="lam" min="-3" max="3" step="0.05" aria-label="Ridge penalty, as a power of 10"></label>' +
      '<button type="button" data-zoom="normal">Normal equations, worked</button>' +
      '<button type="button" data-zoom="residuals">Residuals, worked</button>' +
      '<button type="button" data-reset>Reset</button>';
    var el = {};
    Array.prototype.forEach.call(ctl.querySelectorAll('[data-k], [data-act]'), function (x) { el[x.getAttribute('data-k') || x.getAttribute('data-act')] = x; });

    /* y moves in the screen plane of the 3D view: the camera's right and up axes. */
    var hy = P3.handle({ x: 0, y: 0, label: 'The target y', cls: 'is-v', part: 'y', onMove: function (x, y, done) {
      var at = view3(s.y, s.yaw, s.pitch), cam = camera(s.yaw, s.pitch), dx = x - at[0], dy = y - at[1];
      s.y = [0, 1, 2].map(function (k) { return s.y[k] + dx * cam.right[k] + dy * cam.up[k]; });
      draw(); if (done) report();
    } });
    var hv = P3.handle({ x: 0.84, y: 1.08, label: 'Turn and tilt the view', cls: 'is-o', part: 'view', bounds: [[-3.72, 3.72], [-2.88, 2.88]], onMove: function (x, y, done) {
      s.yaw = x / 1.2; s.pitch = y / 2.4; draw(); if (done) report();
    } });
    function lineEnd(xAt, label) {
      return PF.handle({ x: xAt, y: s.w * xAt + s.c, label: label, cls: 'is-o', part: 'line', bounds: [[xAt, xAt], [0.3, 11.7]], onMove: function (x, y, done) {
        var yl = xAt === 1 ? y : s.w + s.c, yr = xAt === 9 ? y : 9 * s.w + s.c;
        s.w = (yr - yl) / 8; s.c = yl - s.w; draw(); if (done) report();
      } });
    }
    var hl = lineEnd(1, 'Left end of the line'), hr = lineEnd(9, 'Right end of the line');
    var hp = PTS.map(function (p, j) {
      return PF.handle({ x: p[0], y: p[1], label: 'Data point ' + (j + 1), cls: 'is-v', part: 'pts', onMove: function (x, y, done) {
        s.pts[j] = [x, y]; draw(); if (done) report();
      } });
    });

    function add(p, q) { return [p[0] + q[0], p[1] + q[1], p[2] + q[2]]; }
    function sc(p, k) { return [k * p[0], k * p[1], k * p[2]]; }
    function unit3(p) { var n = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]); return n < 1e-12 ? [0, 0, 0] : sc(p, 1 / n); }

    function draw() {
      var fit = project(A, s.b, s.y), loss = mse(s.pts, s.w, s.c), lam = Math.pow(10, s.lam);
      api.values({ w: s.w, b: s.c, loss: loss, lam: lam });
      var X, yv, weights;
      if (s.mode === 'fit') {
        X = s.pts.map(function (q) { return [q[0], 1]; });
        yv = s.pts.map(function (q) { return q[1]; }); weights = [s.w, s.c];
      } else if (s.mode === 'ridge') { X = RX; yv = RY; weights = lstsq(RX, RY, lam); }
      else { X = [[A[0], s.b[0]], [A[1], s.b[1]], [A[2], s.b[2]]]; yv = s.y; weights = fit && fit.w; }
      if (weights) {
        var residuals = X.map(function (row, k) { return yv[k] - row[0] * weights[0] - row[1] * weights[1]; });
        api.values({ w1: weights[0], w2: weights[1], g1: X.reduce(function (t, row, k) { return t + row[0] * residuals[k]; }, 0), g2: X.reduce(function (t, row, k) { return t + row[1] * residuals[k]; }, 0) });
      } else api.values({ w1: 'None', w2: 'None', g1: '–', g2: '–' });
      root.querySelector('[data-fit-equation]').hidden = s.mode !== 'fit';
      root.querySelector('[data-ridge-equation]').hidden = s.mode !== 'ridge';
      ctl.querySelector('[data-zoom="residuals"]').hidden = s.mode !== 'fit';
      el.mode.value = s.mode; el.lam.value = s.lam; el.progress.value = progress;
      el.progress.parentNode.hidden = s.mode === 'ridge';
      hv.set(s.yaw * 1.2, s.pitch * 2.4);
      el.snap.hidden = s.mode !== 'fit';
      var best = fitLine(s.pts);
      el.snap.disabled = Math.abs(best.w - s.w) < 1e-10 && Math.abs(best.b - s.c) < 1e-10;
      el.lam.parentNode.hidden = s.mode !== 'ridge';
      P3.svg.style.display = s.mode === '3d' ? '' : 'none';
      PF.svg.style.display = s.mode === 'fit' ? '' : 'none';
      PR.svg.style.display = s.mode === 'ridge' ? '' : 'none';
      if (s.mode === '3d') draw3(fit);
      if (s.mode === 'fit') drawFit();
      if (s.mode === 'ridge') drawRidge(lam);
    }

    function draw3(fit) {
      function sp(p) { return view3(p, s.yaw, s.pitch); }
      var corners = [[-1.4, -1.4], [1.4, -1.4], [1.4, 1.4], [-1.4, 1.4]].map(function (c) { return sp(add(sc(A, c[0]), sc(s.b, c[1]))); });
      var h = '<polygon class="pl-plane3" data-part="span" points="' + P3.pts(corners) + '"/>';
      [[3, 0, 0], [0, 3, 0], [0, 0, 3]].forEach(function (e) { var q = sp(e); h += P3.arrow(0, 0, q[0], q[1], 'is-faint'); });
      var a2 = sp(A), b2 = sp(s.b), y2 = sp(s.y);
      h += P3.arrow(0, 0, a2[0], a2[1], 'is-q', 'cols') + P3.arrow(0, 0, b2[0], b2[1], 'is-k', 'cols');
      if (fit) {
        var yh = sp(fit.yhat), u = unit3(fit.yhat[0] || fit.yhat[1] || fit.yhat[2] ? fit.yhat : A), rh = unit3(fit.r), e = 0.25;
        var m1 = sp(add(fit.yhat, sc(u, e))), m2 = sp(add(add(fit.yhat, sc(u, e)), sc(rh, e))), m3 = sp(add(fit.yhat, sc(rh, e)));
        h += P3.arrow(0, 0, yh[0], yh[1], 'is-o', 'yhat');
        h += '<g class="is-k" data-part="res">' + svgEl('line', { x1: P3.map.sx(yh[0]), y1: P3.map.sy(yh[1]), x2: P3.map.sx(y2[0]), y2: P3.map.sy(y2[1]), 'class': 'pl-dash' }) +
          '<polyline class="pl-right" points="' + P3.pts([m1, m2, m3]) + '"/></g>';
      }
      h += P3.arrow(0, 0, y2[0], y2[1], 'is-v', 'y');
      P3.plot.innerHTML = h;
      hy.set(y2[0], y2[1]);
    }

    function drawFit() {
      PF.grid.innerHTML = PF.gridMarkup(null, 1, 'pl-std is-faint');
      var h = '';
      s.pts.forEach(function (p) {
        var yh = s.w * p[0] + s.c, y0 = PF.map.sy(p[1]), y1 = PF.map.sy(yh), side = Math.abs(y1 - y0);
        h += svgEl('rect', { x: PF.map.sx(p[0]), y: Math.min(y0, y1), width: side, height: side, 'class': 'pl-sq', 'data-part': 'sq' });
        h += svgEl('line', { x1: PF.map.sx(p[0]), y1: y0, x2: PF.map.sx(p[0]), y2: y1, 'class': 'pl-dash is-k', 'data-part': 'res' });
      });
      h += svgEl('line', { x1: PF.map.sx(0), y1: PF.map.sy(s.c), x2: PF.map.sx(10), y2: PF.map.sy(10 * s.w + s.c), 'class': 'pl-line is-o', 'data-part': 'line' });
      PF.plot.innerHTML = h;
      hl.set(1, s.w + s.c); hr.set(9, 9 * s.w + s.c);
      hp.forEach(function (hd, j) { hd.set(s.pts[j][0], s.pts[j][1]); });
    }

    function drawRidge(lam) {
      var w0 = lstsq(RX, RY, 0), wl = lstsq(RX, RY, lam), G = gram(RX);
      var th = 0.5 * Math.atan2(2 * G[0][1], G[0][0] - G[1][1]), mid = (G[0][0] + G[1][1]) / 2;
      var rad = Math.sqrt((G[0][0] - G[1][1]) * (G[0][0] - G[1][1]) / 4 + G[0][1] * G[0][1]), l1 = mid + rad, l2 = mid - rad;
      var e1 = [Math.cos(th), Math.sin(th)], e2 = [-Math.sin(th), Math.cos(th)];
      PR.grid.innerHTML = PR.gridMarkup(null, 0.5, 'pl-std is-faint') + PR.axes();
      var h = '';
      for (var k = 1; k <= 5; k++) {
        var ring = [];
        for (var a = 0; a <= 72; a++) {
          var ca = Math.cos(a * Math.PI / 36) * 0.25 * k, sa = Math.sin(a * Math.PI / 36) * 0.25 * k * Math.sqrt(l1 / l2);
          ring.push([w0[0] + ca * e1[0] + sa * e2[0], w0[1] + ca * e1[1] + sa * e2[1]]);
        }
        h += '<polyline class="pl-contour" data-part="loss" points="' + PR.pts(ring) + '"/>';
      }
      var R = Math.sqrt(wl[0] * wl[0] + wl[1] * wl[1]), circ = [];
      for (a = 0; a <= 72; a++) circ.push([R * Math.cos(a * Math.PI / 36), R * Math.sin(a * Math.PI / 36)]);
      h += '<polyline class="pl-dash is-k" data-part="circle" points="' + PR.pts(circ) + '"/>';
      h += '<polyline class="pl-curve is-o is-faint" data-part="path" points="' + PR.pts(PATH) + '"/>';
      h += PR.dot(w0[0], w0[1], 5, 'pl-mark pl-ols', 'ols') + PR.dot(wl[0], wl[1], 6, 'pl-mark pl-ridge', 'ridge');
      PR.plot.innerHTML = h;
      api.values({ w1: wl[0], w2: wl[1] });
    }

    function describe(text) { api.say(text); root.querySelector('[data-note]').textContent = text; }
    function report() {
      if (s.mode === 'fit') describe((fitLine(s.pts).unique ? '' : 'All x values coincide, so several lines fit equally well. Snap chooses a horizontal line. ') + 'The line is y = ' + fmt(s.w) + ' x + ' + fmt(s.c) + '. The mean squared error is ' + fmt(mse(s.pts, s.w, s.c), 3) + '.');
      else if (s.mode === 'ridge') { var wl = lstsq(RX, RY, Math.pow(10, s.lam)); describe('With lambda ' + fmt(Math.pow(10, s.lam), 3) + ', the weights are (' + fmt(wl[0]) + ', ' + fmt(wl[1]) + ').'); }
      else {
        var fit = project(A, s.b, s.y);
        describe(fit ? 'The fit uses ' + fmt(fit.w[0]) + ' of a and ' + fmt(fit.w[1]) + ' of b. The residual is at a right angle to both. Drag the target or the view handle to explore.' :
          'The 2 columns are parallel, so they reach only a line, and the weights are not unique.');
      }
    }
    function prepare(target) {
      var from = { b: s.b.slice(), y: s.y.slice(), w: s.w, c: s.c, lam: s.lam };
      var to = { b: target.b ? target.b.slice() : s.b.slice(), y: target.y ? target.y.slice() : s.y.slice(), w: s.w, c: s.c, lam: 'lam' in target ? target.lam : s.lam };
      if (target.snap) { var f = fitLine(s.pts); to.w = f.w; to.c = f.b; }
      motion = { from: from, to: to, wobble: !!target.wobble, mode: s.mode };
      progress = 0;
    }
    function frame(f) {
      progress = f;
      var state = XP.mix(motion.from, motion.to, f);
      s.b = state.b.slice(); s.y = state.y.slice(); s.w = state.w; s.c = state.c; s.lam = state.lam;
      if (motion.wobble) {
        s.y[0] += 0.3 * Math.sin(4 * Math.PI * f);
        s.y[1] += 0.3 * Math.sin(6 * Math.PI * f);
      }
      draw();
    }
    function replay() {
      api.animate({ f: 0 }, { f: 1 }, 800, function (st) { frame(st.f); }, report);
    }
    function goTo(target) {
      if (target.mode) s.mode = target.mode;
      prepare(target); replay();
    }
    function play() {
      if (s.mode === '3d') { prepare({ wobble: true }); replay(); }
      else if (s.mode === 'ridge') { s.lam = -3; prepare({ lam: 3 }); replay(); }
      else {
        if (!motion || motion.mode !== 'fit' || motion.from.w === motion.to.w && motion.from.c === motion.to.c) prepare({ snap: true });
        replay();
      }
    }

    function table(rows, head) {
      return '<table class="xp-table lab-table">' + (head ? '<thead><tr>' + head.map(function (x) { return '<th scope="col">' + x + '</th>'; }).join('') + '</tr></thead>' : '') +
        '<tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (x, k) { return k === 0 && !head ? '<th scope="row">' + x + '</th>' : '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
    }
    ctl.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-k');
      if (k === 'lam') { s.lam = +e.target.value; draw(); }
      if (k === 'progress' && motion) { var requested = +e.target.value; api.interrupt(); frame(requested); report(); }
    });
    ctl.addEventListener('change', function (e) {
      if (e.target.getAttribute('data-k') === 'mode') { s.mode = e.target.value; prepare(s.mode === 'fit' ? { snap: true } : { wobble: s.mode === '3d' }); draw(); }
      report();
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act'), z = b.getAttribute('data-zoom');
      if (z === 'normal') {
        var X = s.mode === 'fit' ? s.pts.map(function (q) { return [q[0], 1]; }) : [[A[0], s.b[0]], [A[1], s.b[1]], [A[2], s.b[2]]];
        if (s.mode === 'ridge') X = RX;
        var yv = s.mode === 'fit' ? s.pts.map(function (q) { return q[1]; }) : s.mode === 'ridge' ? RY : s.y;
        var penalty = s.mode === 'ridge' ? Math.pow(10, s.lam) : 0, G = gram(X), w = lstsq(X, yv, penalty);
        G[0][0] += penalty; G[1][1] += penalty;
        var Xy = [0, 1].map(function (c) { return X.reduce(function (t, row, k) { return t + row[c] * yv[k]; }, 0); });
        dlg.open('Normal equations, worked', table([
          [penalty ? 'XᵀX + λI' : 'XᵀX', '[[' + fmt(G[0][0]) + ', ' + fmt(G[0][1]) + '], [' + fmt(G[1][0]) + ', ' + fmt(G[1][1]) + ']]'],
          ['Xᵀy', '(' + fmt(Xy[0]) + ', ' + fmt(Xy[1]) + ')'],
          [penalty ? 'ŵ, solving (XᵀX + λI) ŵ = Xᵀy' : 'ŵ, solving XᵀX ŵ = Xᵀy', w ? '(' + fmt(w[0]) + ', ' + fmt(w[1]) + ')' : 'The columns are parallel, so several weights fit equally well']
        ]) + '<p>' + (s.mode === 'fit' ? 'Here X has a column of x values and a column of 1s, so ŵ is the slope and the intercept.' : s.mode === 'ridge' ? 'Here X contains the 30 simulated feature pairs, and λ penalises large weights.' : 'Here the columns of X are a and b.') + '</p>', b);
        return;
      }
      if (z === 'residuals') {
        var rows = s.pts.map(function (q) { var yh = s.w * q[0] + s.c, r = q[1] - yh; return [fmt(q[0], 1), fmt(q[1], 1), fmt(yh), fmt(r), fmt(r * r, 3)]; });
        dlg.open('Residuals, worked', table(rows, ['x', 'y', 'ŷ', 'y − ŷ', '(y − ŷ)²']) + '<p>The mean of the last column is ' + fmt(mse(s.pts, s.w, s.c), 3) + ', the mean squared error.</p>', b);
        return;
      }
      if (act === 'play') { play(); return; }
      if (act === 'snap') { goTo({ snap: true }); return; }
      if (b.hasAttribute('data-reset')) { api.interrupt(); s = JSON.parse(JSON.stringify(START)); prepare({ wobble: true }); }
      draw(); report();
    });

    var PAGES = [
      { t: 'A target out of reach', parts: ['y', 'cols'], state: { mode: '3d', b: B, y: Y },
        body: '<p>Take <b class="is-q">a</b> = (1.6, 0.2, 0.4), <b class="is-k">b</b> = (0.3, 1.5, 0.5), and <b class="is-v">y</b> = (1.2, 1.4, 2.4). No weighted sum of a and b reaches y.</p>' },
      { t: 'Everything you can reach', parts: ['span', 'cols'], state: { mode: '3d' },
        body: '<p>Every mix w₁a + w₂b lies on this flat plane through the origin. It is the column space of X.</p>' },
      { t: 'The shadow', parts: ['yhat', 'y'], state: { mode: '3d' },
        body: '<p>The nearest reachable point is the shadow of y on the plane, <b class="is-o">ŷ</b> = Xŵ. That point is the least squares fit.</p>' },
      { t: 'The gap stands straight up', parts: ['res', 'yhat'], state: { mode: '3d' },
        body: '<p>The <b class="is-k">residual</b> y − ŷ is the gap between target and fit, perpendicular to the plane. Therefore, Xᵀ(y − Xŵ) = 0 gives the normal equations.</p>' },
      { t: 'The same idea in 2D', parts: ['sq', 'line'], state: { mode: 'fit' },
        body: '<p>Here, 9 points are fitted with a line, and each vertical gap carries a square. Their total area divided by 9 gives the mean squared error.</p>' },
      { t: 'Snap to least squares', parts: ['line', 'sq'], state: { mode: 'fit', snap: true },
        body: '<p>The line glides to the fit, and no other line has less total area. Drag any point, then press Snap again.</p>' },
      { t: 'Ridge pulls w in', parts: ['ridge', 'circle', 'path'], state: { mode: 'ridge', lam: 0.5 },
        body: '<p>Ridge penalises large weights by adding λ‖w‖² to the squared error. As λ grows, <b class="is-o">ŵ</b> slides along its path towards 0, inside a shrinking circle.</p>' },
      { t: 'Nearly parallel columns', parts: ['cols', 'yhat'], state: { mode: '3d', b: BNEAR, wobble: true },
        body: '<p>Now b nearly lines up with a, and y wobbles. ŷ barely moves, but ŵ swings a long way.</p>' }
    ];
    prepare({ wobble: true });
    draw();
    XP.guide(root.querySelector('[data-guide-box]'), PAGES, function (p, i, redraw) {
      if (!p) { api.focus([]); return; }
      if (!redraw) {
        var target = {};
        PAGES.slice(0, i + 1).forEach(function (page) { Object.assign(target, page.state); });
        target.snap = !!p.state.snap;
        target.wobble = !!p.state.wobble;
        goTo(target);
      }
      api.focus(p.parts);
    });
  });
})();
