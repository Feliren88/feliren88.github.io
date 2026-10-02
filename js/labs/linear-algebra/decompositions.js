/* ════════════════════════════════════════════════════════
   Linear Algebra, module 5: decompositions.
   The SVD of a 2 by 2 matrix plays as rotate, stretch, rotate; a real 64 by
   64 image is rebuilt from its k largest singular values; PCA is the SVD of
   a centred cloud; and Cholesky splits a positive definite matrix as L Lᵀ.
   ════════════════════════════════════════════════════════ */
(function () {

  function mul(B, A) {
    return [B[0] * A[0] + B[1] * A[2], B[0] * A[1] + B[1] * A[3], B[2] * A[0] + B[3] * A[2], B[2] * A[1] + B[3] * A[3]];
  }
  function rot(t) { var c = Math.cos(t), s = Math.sin(t); return [c, -s, s, c]; }

  /* SVD of a 2 by 2 matrix from the eigenvectors of AᵀA. theta is the angle
     of v1; U may be a reflection, and Vt is always a rotation. */
  function svd2(m) {
    var a = m[0], b = m[1], c = m[2], d = m[3];
    var p = a * a + c * c, q = a * b + c * d, r = b * b + d * d;
    var th = 0.5 * Math.atan2(2 * q, p - r), cs = Math.cos(th), sn = Math.sin(th);
    var av1 = [a * cs + b * sn, c * cs + d * sn], av2 = [-a * sn + b * cs, -c * sn + d * cs];
    var s1 = Math.sqrt(av1[0] * av1[0] + av1[1] * av1[1]), s2 = Math.sqrt(av2[0] * av2[0] + av2[1] * av2[1]);
    var u1 = s1 > 1e-12 ? [av1[0] / s1, av1[1] / s1] : [1, 0];
    var u2 = s2 > 1e-12 * Math.max(1, s1) ? [av2[0] / s2, av2[1] / s2] : [-u1[1], u1[0]];
    return { U: [u1[0], u2[0], u1[1], u2[1]], S: [s1, s2], Vt: [cs, sn, -sn, cs], theta: th };
  }

  /* Vᵀ rotates, Σ stretches by non-negative values, then U rotates and
     reflects when needed. The reflection crosses a collapsed intermediate
     state, keeping its sign change out of the singular-value stage. */
  function stageMatrix(dec, f) {
    var U = dec.U, flip = U[0] * U[3] - U[1] * U[2] < 0;
    var Ur = flip ? [U[0], -U[1], U[2], -U[3]] : U;
    var Vt = rot(-dec.theta);
    if (f <= 1) return rot(-dec.theta * f);
    if (f <= 2) {
      var g = f - 1;
      return mul([1 + (dec.S[0] - 1) * g, 0, 0, 1 + (dec.S[1] - 1) * g], Vt);
    }
    var amount = f - 2;
    var turn = rot(Math.atan2(Ur[2], Ur[0]) * amount);
    var reflection = [1, 0, 0, flip ? 1 - 2 * amount : 1];
    return mul(turn, mul(reflection, mul([dec.S[0], 0, 0, dec.S[1]], Vt)));
  }

  /* One-sided Jacobi SVD of an m by n matrix, m ≥ n, as arrays of rows.
     Returns U (m by n), S (descending) and V (n by n). */
  function svd(A) {
    var m = A.length, n = A[0].length, U = A.map(function (r) { return r.slice(); }), V = [], i, j, k, x, y;
    for (i = 0; i < n; i++) { V.push([]); for (j = 0; j < n; j++) V[i].push(i === j ? 1 : 0); }
    for (var sweep = 0; sweep < 60; sweep++) {
      var off = 0;
      for (i = 0; i < n - 1; i++) {
        for (j = i + 1; j < n; j++) {
          var a = 0, b = 0, c = 0;
          for (k = 0; k < m; k++) { a += U[k][i] * U[k][i]; b += U[k][j] * U[k][j]; c += U[k][i] * U[k][j]; }
          if (a === 0 || b === 0 || Math.abs(c) <= 1e-15 * Math.sqrt(a * b)) continue;
          off = Math.max(off, Math.abs(c) / Math.sqrt(a * b));
          var z = (b - a) / (2 * c), t = (z >= 0 ? 1 : -1) / (Math.abs(z) + Math.sqrt(1 + z * z));
          var cs = 1 / Math.sqrt(1 + t * t), sn = cs * t;
          for (k = 0; k < m; k++) { x = U[k][i]; y = U[k][j]; U[k][i] = cs * x - sn * y; U[k][j] = sn * x + cs * y; }
          for (k = 0; k < n; k++) { x = V[k][i]; y = V[k][j]; V[k][i] = cs * x - sn * y; V[k][j] = sn * x + cs * y; }
        }
      }
      if (off < 1e-14) break;
    }
    var S = [];
    for (j = 0; j < n; j++) { var q = 0; for (k = 0; k < m; k++) q += U[k][j] * U[k][j]; S.push(Math.sqrt(q)); }
    var order = S.map(function (v, idx) { return idx; }).sort(function (p, q2) { return S[q2] - S[p]; });
    return {
      S: order.map(function (idx) { return S[idx]; }),
      U: U.map(function (r) { return order.map(function (idx) { return S[idx] > 1e-300 ? r[idx] / S[idx] : 0; }); }),
      V: V.map(function (r) { return order.map(function (idx) { return r[idx]; }); })
    };
  }

  /* The best rank k copy: the first k terms of Σ σ_r u_r v_rᵀ. */
  function lowRank(dec, k) {
    var m = dec.U.length, n = dec.V.length, out = [];
    for (var i = 0; i < m; i++) {
      var row = [];
      for (var j = 0; j < n; j++) {
        var v = 0;
        for (var r = 0; r < k; r++) v += dec.S[r] * dec.U[i][r] * dec.V[j][r];
        row.push(v);
      }
      out.push(row);
    }
    return out;
  }
  function tailError(S, k) { var e = 0; for (var r = k; r < S.length; r++) e += S[r] * S[r]; return Math.sqrt(e); }
  function frob(A, B) {
    var e = 0;
    for (var i = 0; i < A.length; i++) for (var j = 0; j < A[0].length; j++) e += (A[i][j] - B[i][j]) * (A[i][j] - B[i][j]);
    return Math.sqrt(e);
  }

  /* Principal axes of a 2D cloud: the eigenvectors of its covariance, which
     divides by N as in the module's equation. */
  function pca(points) {
    var N = points.length, mx = 0, my = 0, sxx = 0, syy = 0, sxy = 0;
    var anchor = points[0];
    points.forEach(function (p) { mx += (p[0] - anchor[0]) / N; my += (p[1] - anchor[1]) / N; });
    mx += anchor[0]; my += anchor[1];
    points.forEach(function (p) { var dx = p[0] - mx, dy = p[1] - my; sxx += dx * dx / N; syy += dy * dy / N; sxy += dx * dy / N; });
    var th = 0.5 * Math.atan2(2 * sxy, sxx - syy), mid = (sxx + syy) / 2, rad = Math.sqrt((sxx - syy) * (sxx - syy) / 4 + sxy * sxy);
    return { mean: [mx, my], axes: [[Math.cos(th), Math.sin(th)], [-Math.sin(th), Math.cos(th)]], vars: [mid + rad, mid - rad] };
  }

  /* L with A = L Lᵀ for a symmetric positive definite 2 by 2, or null. */
  function chol2(m) {
    if (Math.abs(m[1] - m[2]) > 1e-12 || m[0] <= 0 || m[0] * m[3] - m[1] * m[2] <= 0) return null;
    var l11 = Math.sqrt(m[0]), l21 = m[1] / l11;
    return [l11, 0, l21, Math.sqrt(m[3] - l21 * l21)];
  }

  /* A sample image as gray levels in [0, 1], rows first. */
  function decodeGray(b64, w, h) {
    var bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary'), out = [];
    for (var y = 0; y < h; y++) {
      var row = [];
      for (var x = 0; x < w; x++) {
        var o = 3 * (y * w + x);
        row.push((0.299 * bin.charCodeAt(o) + 0.587 * bin.charCodeAt(o + 1) + 0.114 * bin.charCodeAt(o + 2)) / 255);
      }
      out.push(row);
    }
    return out;
  }

  var M = { mul: mul, rot: rot, svd2: svd2, stageMatrix: stageMatrix, svd: svd, lowRank: lowRank, tailError: tailError,
    frob: frob, pca: pca, chol2: chol2, decodeGray: decodeGray };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  XP.lab('linear-algebra/decompositions', function (root, api) {
    var fmt = XP.fmt, svgEl = XP.svgEl, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var images = root.querySelector('[data-images]'), dlg = XP.dialog(root);
    var DEF = [1.5, 1, 0, 1.2], CHOL = [2, 0.6, 0.6, 1];
    var r = XP.rng(7), CLOUD = [];
    for (var i = 0; i < 10; i++) {
      var g1 = XP.gauss(r), g2 = XP.gauss(r);
      CLOUD.push([Math.round((1.8 * g1 + 0.3 * g2) * 10) / 10, Math.round((0.9 * g1 + 0.5 * g2) * 10) / 10]);
    }
    var START = { m: DEF.slice(), f: 0, mode: 'svd', k: 8, sample: 0, pts: CLOUD.map(function (p) { return p.slice(); }) };
    var s = JSON.parse(JSON.stringify(START)), data = null, cache = {}, pendingImages = null;
    var P = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'The unit circle through the stages of the singular value decomposition' });
    var SP = XP.plane(images, { x: [0, 64], y: [-4, 2], w: 480, h: 120, pad: 4, label: 'Singular values of the image on a log scale, kept ones in colour' });
    stage.insertBefore(images, P.svg.nextSibling);

    ctl.innerHTML =
      '<label>View <select data-k="mode" aria-label="What to show"><option value="svd">Rotate, stretch, rotate</option><option value="image">An image</option><option value="pca">PCA</option><option value="chol">Cholesky</option></select></label>' +
      '<label>Stage <input type="range" data-k="f" min="0" max="3" step="0.01" aria-label="How far through the 3 stages"></label>' +
      '<button type="button" data-act="play">Play</button>' +
      '<label>k <input type="range" data-k="k" min="1" max="64" step="1" aria-label="How many singular values to keep"></label>' +
      '<label>Image <select data-k="sample" aria-label="Sample image"></select></label>' +
      '<button type="button" data-zoom="values">Singular values</button>' +
      '<button type="button" data-zoom="error">Rank k error, worked</button>' +
      '<button type="button" data-reset>Reset</button>';
    var el = {};
    Array.prototype.forEach.call(ctl.querySelectorAll('[data-k]'), function (x) { el[x.getAttribute('data-k')] = x; });

    function col(c, label, cls, part) {
      return P.handle({ x: s.m[c], y: s.m[2 + c], label: label, cls: cls, part: part, onMove: function (x, y, done) {
        s.m[c] = x; s.m[2 + c] = y; s.f = 3; draw(); if (done) report();
      } });
    }
    var hi = col(0, 'Where î lands', 'is-q', 'i'), hj = col(1, 'Where ĵ lands', 'is-k', 'j');
    var hp = CLOUD.map(function (p, j) {
      return P.handle({ x: p[0], y: p[1], label: 'Data point ' + (j + 1), cls: 'is-v', part: 'cloud', onMove: function (x, y, done) {
        s.pts[j] = [x, y]; draw(); if (done) report();
      } });
    });

    /* Load the sample images the first time the image view is shown. */
    function ensureImages(then) {
      if (data) return then();
      if (!pendingImages) {
        pendingImages = fetch('/assets/data/tiny-vgg.json').then(function (res) {
          if (!res.ok) throw new Error('Sample images returned HTTP ' + res.status);
          return res.json();
        }).then(function (j) {
          data = j.samples;
          el.sample.innerHTML = data.map(function (smp, n) {
            return '<option value="' + n + '">' + XP.esc(smp.name.replace(/_/g, ' ')) + '</option>';
          }).join('');
          el.sample.value = s.sample;
        }).catch(function (err) {
          pendingImages = null;
          api.say('The sample images did not load.');
          if (typeof console !== 'undefined') console.error(err);
        });
      }
      pendingImages.then(function () { if (data) then(); });
    }
    function imageSvd(n) {
      if (!cache[n]) { var g = decodeGray(data[n].rgb, 64, 64); cache[n] = { gray: g, dec: svd(g) }; }
      return cache[n];
    }
    function paint(canvas, rows) {
      var ctx = canvas.getContext('2d'), im = ctx.createImageData(64, 64);
      for (var y = 0; y < 64; y++) {
        for (var x = 0; x < 64; x++) {
          var v = Math.max(0, Math.min(255, Math.round(rows[y][x] * 255))), o = 4 * (y * 64 + x);
          im.data[o] = im.data[o + 1] = im.data[o + 2] = v; im.data[o + 3] = 255;
        }
      }
      ctx.putImageData(im, 0, 0);
    }

    function draw() {
      var mode = s.mode;
      root.querySelector('[data-factorisation]').innerHTML = mode === 'chol'
        ? '<i>A</i> = <span class="lab-term is-q" data-term="vt">'+window.InterviewDisplayMath.html("lab/decompositions/cholesky", undefined, true)+'</span>'
        : '<i>A</i> = <span class="lab-term is-o" data-term="u">U</span><span class="lab-term is-k" data-term="sigma">Σ</span><span class="lab-term is-q" data-term="vt">'+window.InterviewDisplayMath.html("lab/decompositions/transpose", undefined, true)+'</span>';
      root.querySelector('[data-singular-values]').hidden = mode === 'chol';
      root.querySelector('[data-chol-values]').hidden = mode !== 'chol';
      root.querySelector('[data-image-error]').hidden = mode !== 'image';
      el.mode.value = mode; el.f.value = s.f; el.k.value = s.k;
      el.f.parentNode.hidden = !(mode === 'svd' || mode === 'chol');
      ctl.querySelector('[data-act="play"]').hidden = el.f.parentNode.hidden;
      el.k.parentNode.hidden = el.sample.parentNode.hidden = mode !== 'image';
      images.hidden = mode !== 'image';
      P.svg.style.display = mode === 'image' ? 'none' : '';
      hi.show(mode === 'svd'); hj.show(mode === 'svd');
      hp.forEach(function (h, j) { h.show(mode === 'pca'); h.set(s.pts[j][0], s.pts[j][1]); });
      if (mode === 'image') { drawImage(); return; }
      P.grid.innerHTML = P.gridMarkup(null, 1, 'pl-std is-faint') + P.axes();
      var h = '', circle = [], a;
      if (mode === 'svd') {
        var dec = svd2(s.m), T = stageMatrix(dec, s.f);
        api.values({ s1: dec.S[0], s2: dec.S[1] });
        for (a = 0; a < 72; a++) circle.push(apply2(T, [Math.cos(a * Math.PI / 36), Math.sin(a * Math.PI / 36)]));
        P.grid.innerHTML += P.gridMarkup(T, 1, 'pl-moved');
        var v1 = apply2(T, [dec.Vt[0], dec.Vt[1]]), v2 = apply2(T, [dec.Vt[2], dec.Vt[3]]);
        h += '<polygon class="pl-circle" data-part="sigma" points="' + P.pts(circle) + '"/>';
        h += P.arrow(0, 0, v1[0], v1[1], 'is-q', 'vt u') + P.arrow(0, 0, v2[0], v2[1], 'is-k', 'vt u');
        hi.set(s.m[0], s.m[2]); hj.set(s.m[1], s.m[3]);
        hi.show(s.f >= 3); hj.show(s.f >= 3);
      } else if (mode === 'pca') {
        var p = pca(s.pts);
        api.values({ s1: Math.sqrt(p.vars[0] * s.pts.length), s2: Math.sqrt(Math.max(0, p.vars[1]) * s.pts.length) });
        [0, 1].forEach(function (j) {
          var len = 2 * Math.sqrt(Math.max(0, p.vars[j])), ax = p.axes[j];
          h += P.arrow(p.mean[0], p.mean[1], p.mean[0] + len * ax[0], p.mean[1] + len * ax[1], j === 0 ? 'is-q' : 'is-k', 'vt');
        });
      } else {
        var L = chol2(CHOL), Lt = [1 + (L[0] - 1) * s.f / 3, 0, L[2] * s.f / 3, 1 + (L[3] - 1) * s.f / 3];
        var ch = svd2(CHOL);
        api.values({ s1: ch.S[0], s2: ch.S[1], l11: L[0], l21: L[2], l22: L[3] });
        for (a = 0; a < 72; a++) circle.push(apply2(Lt, [Math.cos(a * Math.PI / 36), Math.sin(a * Math.PI / 36)]));
        h += '<polygon class="pl-circle" data-part="sigma" points="' + P.pts(circle) + '"/>';
        h += P.arrow(0, 0, Lt[0], Lt[2], 'is-q', 'vt') + P.arrow(0, 0, Lt[1], Lt[3], 'is-k', 'vt');
      }
      P.plot.innerHTML = h;
    }
    function apply2(m, v) { return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]]; }

    function drawImage() {
      ensureImages(function () {
        if (s.mode !== 'image') return;
        var c = imageSvd(s.sample), rec = lowRank(c.dec, s.k), err = tailError(c.dec.S, s.k);
        paint(root.querySelector('[data-img="orig"]'), c.gray);
        paint(root.querySelector('[data-img="rank"]'), rec);
        api.values({ s1: c.dec.S[0], s2: c.dec.S[1], err: err });
        api.values({ k: s.k }, 0);
        var h = '', top = Math.log10(c.dec.S[0]);
        c.dec.S.forEach(function (v, j) {
          var y = Math.max(-4, Math.log10(Math.max(v, 1e-12)) - top + 1);
          h += svgEl('rect', { x: SP.map.sx(j), y: SP.map.sy(y), width: Math.max(1, SP.map.sx(1) - SP.map.sx(0) - 1), height: SP.map.sy(-4) - SP.map.sy(y),
            'class': j < s.k ? 'pl-bar pl-mark' : 'pl-bar is-faint', 'data-part': j < s.k ? 'sigma' : 'tail' });
        });
        SP.plot.innerHTML = h;
        report();
      });
    }

    function report() {
      if (s.mode === 'image' && !data) { api.say('The sample image is loading.'); return; }
      if (s.mode === 'image' && data) {
        var c = imageSvd(s.sample);
        api.say('Keeping ' + s.k + ' of 64 singular values. The error is ' + fmt(tailError(c.dec.S, s.k)) + ', the square root of the dropped squares.');
      } else if (s.mode === 'svd') {
        var d = svd2(s.m);
        api.say('The singular values are ' + fmt(d.S[0]) + ' and ' + fmt(d.S[1]) + '. Stage ' + fmt(s.f, 1) + ' of 3.');
      } else if (s.mode === 'pca') {
        var pc = pca(s.pts), variance = pc.vars[0] + pc.vars[1];
        api.say(variance <= 1e-12 ? 'Every point coincides, so the cloud has 0 variance.' :
          'The first principal axis carries ' + fmt(100 * pc.vars[0] / variance, 0) + ' percent of the variance.');
      } else {
        api.say('L is lower triangular, and L times L transposed rebuilds the matrix.');
      }
    }
    function goTo(target) {
      if ('mode' in target) s.mode = target.mode;
      if ('k' in target) s.k = target.k;
      var from = { f: s.f, m: s.m.slice() }, to = { f: 'f' in target ? target.f : s.f, m: target.m ? target.m.slice() : s.m.slice() };
      api.animate(from, to, 800, function (st) { s.f = st.f; s.m = st.m.slice(); draw(); }, report);
    }

    function table(rows) {
      return '<table class="xp-table lab-table"><tbody>' + rows.map(function (x) {
        return '<tr><th scope="row">' + x[0] + '</th><td>' + x[1] + '</td></tr>';
      }).join('') + '</tbody></table>';
    }
    function zoomValues(btn) {
      if (s.mode === 'image' && data) {
        var S = imageSvd(s.sample).dec.S, total = S.reduce(function (t, v) { return t + v * v; }, 0), acc = 0;
        dlg.open('Singular values', table(S.slice(0, 12).map(function (v, j) {
          acc += v * v;
          return [window.InterviewDisplayMath.html("lab/decompositions/singular-entry", {j:j+1}, true), fmt(v, 3) + ' (the first ' + (j + 1) + ' hold ' + fmt(100 * acc / total, 1) + ('% of '+window.InterviewDisplayMath.html("lab/decompositions/worked-2", undefined, true)+')')];
        })) + '<p>The first 12 of 64. They fall fast, which is why a few of them rebuild most of the picture.</p>', btn);
        return;
      }
      if (s.mode === 'pca') {
        var pc = pca(s.pts);
        dlg.open('Singular values', table([
          [(''+window.InterviewDisplayMath.html("lab/decompositions/worked-4", undefined, true)+''), fmt(Math.sqrt(Math.max(0, pc.vars[0]) * s.pts.length), 3)],
          [(''+window.InterviewDisplayMath.html("lab/decompositions/worked-5", undefined, true)+''), fmt(Math.sqrt(Math.max(0, pc.vars[1]) * s.pts.length), 3)],
          ['Number of centred points', String(s.pts.length)]
        ]) + '<p>Each squared singular value equals its covariance eigenvalue times the point count.</p>', btn);
        return;
      }
      var d = svd2(s.mode === 'chol' ? CHOL : s.m);
      dlg.open('Singular values', table([[(''+window.InterviewDisplayMath.html("lab/decompositions/worked-4", undefined, true)+''), fmt(d.S[0], 3)], [(''+window.InterviewDisplayMath.html("lab/decompositions/worked-5", undefined, true)+''), fmt(d.S[1], 3)], [(''+window.InterviewDisplayMath.html("lab/decompositions/worked-3", undefined, true)+''), fmt(d.S[0] * d.S[1], 3)]]) +
        ('<p>'+window.InterviewDisplayMath.html("lab/decompositions/worked-4", undefined, true)+' and '+window.InterviewDisplayMath.html("lab/decompositions/worked-5", undefined, true)+' are the longest and shortest stretch A applies to any unit arrow.</p>'), btn);
    }
    function zoomError(btn) {
      if (!data) { ensureImages(function () { zoomError(btn); }); return; }
      var c = imageSvd(s.sample), S = c.dec.S, dropped = 0;
      for (var j = s.k; j < S.length; j++) dropped += S[j] * S[j];
      var direct = frob(c.gray, lowRank(c.dec, s.k));
      dlg.open('Rank k error, worked', table([
        ['k, singular values kept', String(s.k)],
        [(''+window.InterviewDisplayMath.html("lab/decompositions/worked-0", undefined, true)+''), fmt(dropped, 4)],
        [(''+window.InterviewDisplayMath.html("lab/decompositions/worked-1", undefined, true)+''), fmt(Math.sqrt(dropped), 4)],
        ['‖image − rank k copy‖, measured', fmt(direct, 4)]
      ]) + '<p>The last 2 rows agree. No other rank ' + s.k + ' matrix gets closer to the image.</p>', btn);
    }

    ctl.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-k');
      if (k === 'f') { s.f = +e.target.value; draw(); }
      if (k === 'k') { s.k = +e.target.value; draw(); }
    });
    ctl.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-k');
      if (k === 'mode') { s.mode = e.target.value; draw(); }
      if (k === 'sample') { s.sample = +e.target.value; draw(); }
      report();
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var z = b.getAttribute('data-zoom');
      if (z === 'values') return zoomValues(b);
      if (z === 'error') return zoomError(b);
      if (b.getAttribute('data-act') === 'play') { s.f = 0; goTo({ f: 3 }); return; }
      if (b.hasAttribute('data-reset')) { api.interrupt(); s = JSON.parse(JSON.stringify(START)); }
      draw(); report();
    });

    var PAGES = [
      { t: 'Rotate, stretch, rotate', parts: ['sigma', 'vt'], state: { mode: 'svd', f: 0, m: DEF },
        body: ('<p>The matrix '+window.InterviewDisplayMath.html("lab/decompositions/extra-0", undefined, true)+' acts through 3 simpler maps. Follow the unit circle and the 2 arrows <b class="is-q">'+window.InterviewDisplayMath.html("lab/decompositions/extra-2", undefined, true)+'</b> and <b class="is-k">'+window.InterviewDisplayMath.html("lab/decompositions/extra-3", undefined, true)+'</b>.</p>') },
      { t: 'Rotate with the transpose of V', parts: ['vt'], state: { f: 1 },
        body: ('<p>First <b class="is-q">'+window.InterviewDisplayMath.html("lab/decompositions/extra-1", undefined, true)+'</b> turns the plane, so '+window.InterviewDisplayMath.html("lab/decompositions/extra-2", undefined, true)+' and '+window.InterviewDisplayMath.html("lab/decompositions/extra-3", undefined, true)+' lie along the axes.</p>') },
      { t: 'Σ stretches', parts: ['sigma'], state: { f: 2 },
        body: ('<p>Then <b class="is-k">Σ</b> stretches along the axes, by '+window.InterviewDisplayMath.html("lab/decompositions/worked-4", undefined, true)+' and '+window.InterviewDisplayMath.html("lab/decompositions/worked-5", undefined, true)+'. Those stretches are the singular values.</p>') },
      { t: 'U turns again', parts: ['sigma', 'u'], state: { f: 3 },
        body: '<p>Finally, <b class="is-o">U</b> places the stretched axes, using a turn and sometimes a reflection. Together, the 3 maps give A; drag î or ĵ to change them.</p>' },
      { t: 'Keep the big ones', parts: ['sigma'], state: { mode: 'image', k: 8 },
        body: '<p>A 64 by 64 image is a matrix too. Rebuilt from its 8 largest singular values, most of the picture survives.</p>' },
      { t: 'What you dropped', parts: ['tail'], state: { mode: 'image', k: 8 },
        body: ('<p>The error of the rank k copy is the square root of the dropped '+window.InterviewDisplayMath.html("lab/decompositions/extra-4", undefined, true)+' added up. No other rank k matrix is closer.</p>') },
      { t: 'PCA is an SVD', parts: ['vt', 'cloud'], state: { mode: 'pca' },
        body: '<p>Principal component analysis (PCA) finds the axes with the most spread in centred data. These are the right singular vectors; drag a point to see them turn.</p>' },
      { t: 'Cholesky', parts: ['vt', 'sigma'], state: { mode: 'chol', f: 3 },
        body: ('<p>A positive definite matrix has positive '+window.InterviewDisplayMath.html("lab/decompositions/worked-7", undefined, true)+' for every non-zero x. Cholesky writes it as '+window.InterviewDisplayMath.html("lab/decompositions/worked-8", undefined, true)+'; L maps the unit circle to the ellipse '+window.InterviewDisplayMath.html("lab/decompositions/worked-6", undefined, true)+'.</p>') }
    ];
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
