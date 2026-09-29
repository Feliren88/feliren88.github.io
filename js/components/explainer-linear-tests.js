/* ════════════════════════════════════════════════════════
   "Common tests are linear models", on /frequentist-statistics/.
   After Jonas Kristoffer Lindeløv, Common statistical tests are linear models
   (https://lindeloev.github.io/tests-as-linear/).

   The panel runs each named test and the equivalent linear model on the same
   seeded sample and shows both outputs. The arithmetic is plain least squares
   and exact t and normal tail probabilities; scripts/verify_linear_tests.py
   checks every function below against SciPy.
   ════════════════════════════════════════════════════════ */
(function () {

  /* ── exact distribution functions ─────────────────────── */

  function lgamma(x) {
    var c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
      -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    var y = x, t = x + 5.5, s = 1.000000000190015;
    t -= (x + 0.5) * Math.log(t);
    for (var j = 0; j < 6; j++) s += c[j] / ++y;
    return -t + Math.log(2.5066282746310005 * s / x);
  }
  /* Regularised incomplete beta, by Lentz's continued fraction. */
  function betacf(a, b, x) {
    var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    d = 1 / d;
    var h = d;
    for (var m = 1; m <= 300; m++) {
      var m2 = 2 * m, aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d;
      var del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  /* Two-sided p-value for Student's t. */
  function pT(t, df) { return ibeta(df / (df + t * t), df / 2, 0.5); }
  /* Complementary error function, Numerical Recipes' erfcc: fractional
     error below 1.2e-7 everywhere, which is far below the 4 decimals shown. */
  function erfc(x) {
    var z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 +
      t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
      t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  }
  function pZ(z) { return erfc(Math.abs(z) / Math.SQRT2); }

  /* ── the tests ────────────────────────────────────────── */

  function mean(a) { return a.reduce(function (s, x) { return s + x; }, 0) / a.length; }
  function ss(a, m) { return a.reduce(function (s, x) { return s + (x - m) * (x - m); }, 0); }

  /* Ordinary least squares for y = b0 + b1 x, with the classical standard error. */
  function ols(x, y) {
    var n = x.length, mx = mean(x), my = mean(y), sxx = ss(x, mx), sxy = 0;
    for (var i = 0; i < n; i++) sxy += (x[i] - mx) * (y[i] - my);
    var b1 = sxy / sxx, b0 = my - b1 * mx, rss = 0;
    for (var j = 0; j < n; j++) { var e = y[j] - b0 - b1 * x[j]; rss += e * e; }
    var df = n - 2, se = Math.sqrt(rss / df / sxx), t = b1 / se;
    return { b0: b0, b1: b1, se: se, t: t, df: df, p: pT(t, df) };
  }
  /* The intercept-only model y = b0: a one-sample t-test. */
  function olsMean(y) {
    var n = y.length, m = mean(y), se = Math.sqrt(ss(y, m) / (n - 1) / n), t = m / se;
    return { b0: m, se: se, t: t, df: n - 1, p: pT(t, n - 1) };
  }
  /* Student's two-sample t-test with pooled variance, written the textbook way. */
  function tTest(a, b) {
    var ma = mean(a), mb = mean(b), df = a.length + b.length - 2;
    var sp = Math.sqrt((ss(a, ma) + ss(b, mb)) / df);
    var t = (mb - ma) / (sp * Math.sqrt(1 / a.length + 1 / b.length));
    return { diff: mb - ma, t: t, df: df, p: pT(t, df) };
  }
  /* Pearson's r and its t statistic, written the textbook way. */
  function pearson(x, y) {
    var mx = mean(x), my = mean(y), sxy = 0;
    for (var i = 0; i < x.length; i++) sxy += (x[i] - mx) * (y[i] - my);
    var r = sxy / Math.sqrt(ss(x, mx) * ss(y, my)), df = x.length - 2;
    var t = r * Math.sqrt(df / (1 - r * r));
    return { r: r, t: t, df: df, p: pT(t, df) };
  }
  /* Average ranks, ties sharing the mean of the ranks they span. */
  function rank(v) {
    var idx = v.map(function (x, i) { return i; }).sort(function (i, j) { return v[i] - v[j]; });
    var r = new Array(v.length), k = 0;
    while (k < idx.length) {
      var e = k;
      while (e + 1 < idx.length && v[idx[e + 1]] === v[idx[k]]) e++;
      for (var q = k; q <= e; q++) r[idx[q]] = (k + e) / 2 + 1;
      k = e + 1;
    }
    return r;
  }
  /* Mann-Whitney U with the normal approximation and continuity correction. */
  function mannWhitney(a, b) {
    var r = rank(a.concat(b)), n1 = a.length, n2 = b.length, r1 = 0;
    for (var i = 0; i < n1; i++) r1 += r[i];
    var u = r1 - n1 * (n1 + 1) / 2, mu = n1 * n2 / 2;
    var sd = Math.sqrt(n1 * n2 * (n1 + n2 + 1) / 12);
    var z = (Math.abs(u - mu) - 0.5) / sd;
    return { u: u, z: z, p: pZ(z) };
  }

  var LT = { lgamma: lgamma, ibeta: ibeta, pT: pT, pZ: pZ, ols: ols, olsMean: olsMean,
    tTest: tTest, pearson: pearson, rank: rank, mannWhitney: mannWhitney };
  if (typeof module === 'object' && module.exports) { module.exports = LT; return; }

  var host = document.querySelector('[data-xp="lintests"]');
  if (!host) return;

  /* ── the panel ────────────────────────────────────────── */

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function gauss(r) {
    var u = Math.max(r(), 1e-12), v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function f(x, d) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(d === undefined ? 3 : d); }
  function fp(p) { return p < 0.0001 ? '< 0.0001' : p.toFixed(4); }

  var S = { mode: 'two', n: 15, effect: 0.8, rankIt: false, seed: 1 };

  function sample() {
    var r = rng(S.seed), out = { a: [], b: [], x: [], y: [] };
    for (var i = 0; i < S.n; i++) {
      out.a.push(gauss(r));
      out.b.push(S.effect + gauss(r));
      var x = gauss(r);
      out.x.push(x);
      out.y.push(S.effect * x + gauss(r));
    }
    /* Skew one draw so the rank version has something to disagree with. */
    out.b[0] += 3;
    return out;
  }

  function plot(pts, line, xlab, ylab) {
    var W = 360, H = 220, pad = 30;
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    if (x1 - x0 < 1e-9) { x0 -= 1; x1 += 1; }
    var X = function (v) { return pad + (v - x0) / (x1 - x0) * (W - 2 * pad); };
    var Y = function (v) { return H - pad - (v - y0) / (y1 - y0) * (H - 2 * pad); };
    var s = '<line class="xp-ax" x1="' + pad + '" y1="' + (H - pad) + '" x2="' + (W - pad) + '" y2="' + (H - pad) + '"/>' +
      '<line class="xp-ax" x1="' + pad + '" y1="' + pad + '" x2="' + pad + '" y2="' + (H - pad) + '"/>';
    pts.forEach(function (p) {
      s += '<circle class="xp-pt' + (p[2] ? ' is-b' : '') + '" cx="' + X(p[0]).toFixed(1) + '" cy="' + Y(p[1]).toFixed(1) + '" r="3.2"/>';
    });
    if (line) {
      s += '<line class="xp-fit" x1="' + X(line[0][0]).toFixed(1) + '" y1="' + Y(line[0][1]).toFixed(1) +
        '" x2="' + X(line[1][0]).toFixed(1) + '" y2="' + Y(line[1][1]).toFixed(1) + '"/>';
    }
    s += '<text class="xp-axl" x="' + (W / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + xlab + '</text>' +
      '<text class="xp-axl" x="12" y="' + (H / 2) + '" text-anchor="middle" transform="rotate(-90 12 ' + (H / 2) + ')">' + ylab + '</text>';
    return '<svg class="xp-plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Scatter plot of the sample with the fitted line">' + s + '</svg>';
  }

  function card(title, rows, cls) {
    return '<div class="xp-res' + (cls ? ' ' + cls : '') + '"><code>' + title + '</code><dl>' +
      rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd' + (r[2] ? ' class="is-same"' : '') + '>' + r[1] + '</dd>'; }).join('') +
      '</dl></div>';
  }

  function render() {
    var D = sample(), html = '', viz = '', left = '', right = '', note = '';
    if (S.mode === 'two') {
      var G = D.a.map(function () { return 0; }).concat(D.b.map(function () { return 1; }));
      var Y = D.a.concat(D.b);
      if (S.rankIt) {
        var R = rank(Y), mw = mannWhitney(D.a, D.b), fitR = ols(G, R);
        left = card('wilcox.test(y ~ group)', [['U', f(mw.u, 1)], ['z', f(mw.z)], ['p', fp(mw.p), true]]);
        right = card('lm(rank(y) ~ 1 + group)', [['β₁, rank difference', f(fitR.b1)], ['t', f(fitR.t)], ['df', fitR.df], ['p', fp(fitR.p), true]], 'is-lm');
        note = 'The Mann-Whitney test is close to a t-test on the ranks. The two p-values are near each other but not equal, because one uses a normal approximation and the other a t distribution.';
        viz = plot(G.map(function (g, i) { return [g + (i % 7 - 3) * 0.018, R[i], g]; }), [[0, fitR.b0], [1, fitR.b0 + fitR.b1]], 'group (0 or 1)', 'rank of y');
      } else {
        var tt = tTest(D.a, D.b), fit = ols(G, Y);
        left = card('t.test(y ~ group, var.equal = TRUE)', [['mean difference', f(tt.diff), true], ['t', f(tt.t), true], ['df', tt.df, true], ['p', fp(tt.p), true]]);
        right = card('lm(y ~ 1 + group)', [['β₀, mean of group 0', f(fit.b0)], ['β₁, slope', f(fit.b1), true], ['t for β₁', f(fit.t), true], ['df', fit.df, true], ['p', fp(fit.p), true]], 'is-lm');
        note = 'Code the groups as 0 and 1. The fitted line runs through both group means, so its slope is the difference in means and its t-test is the t-test. The numbers are the same to every decimal.';
        viz = plot(G.map(function (g, i) { return [g + (i % 7 - 3) * 0.018, Y[i], g]; }), [[0, fit.b0], [1, fit.b0 + fit.b1]], 'group (0 or 1)', 'y');
      }
    } else if (S.mode === 'cor') {
      var xx = S.rankIt ? rank(D.x) : D.x, yy = S.rankIt ? rank(D.y) : D.y;
      var pr = pearson(xx, yy), fc = ols(xx, yy);
      left = card(S.rankIt ? 'cor.test(x, y, method = "spearman")' : 'cor.test(x, y)', [[S.rankIt ? 'ρ' : 'r', f(pr.r)], ['t', f(pr.t), true], ['df', pr.df, true], ['p', fp(pr.p), true]]);
      right = card(S.rankIt ? 'lm(rank(y) ~ 1 + rank(x))' : 'lm(y ~ 1 + x)', [['β₁, slope', f(fc.b1)], ['t for β₁', f(fc.t), true], ['df', fc.df, true], ['p', fp(fc.p), true]], 'is-lm');
      note = (S.rankIt ? 'Spearman’s ρ is Pearson’s r computed on ranks, so its test is the slope test on ranked data. R and SciPy use an exact null for ρ in small samples, so their p can differ slightly from this one. ' : '') +
        'The slope and r differ by a scale factor, standard deviation of y over standard deviation of x, but their t statistics are identical. Standardise both variables and the slope becomes r.';
      viz = plot(xx.map(function (v, i) { return [v, yy[i], 0]; }), [[Math.min.apply(null, xx), fc.b0 + fc.b1 * Math.min.apply(null, xx)], [Math.max.apply(null, xx), fc.b0 + fc.b1 * Math.max.apply(null, xx)]], S.rankIt ? 'rank of x' : 'x', S.rankIt ? 'rank of y' : 'y');
    } else {
      var d = D.b, om = olsMean(d), m = mean(d);
      left = card('t.test(y, mu = 0)', [['mean', f(m), true], ['t', f(om.t), true], ['df', om.df, true], ['p', fp(om.p), true]]);
      right = card('lm(y ~ 1)', [['β₀, intercept', f(om.b0), true], ['t', f(om.t), true], ['df', om.df, true], ['p', fp(om.p), true]], 'is-lm');
      note = 'A model with only an intercept predicts the same number for everyone. The best such number is the mean, and testing β₀ = 0 is the one-sample t-test. A paired t-test is the same model fitted to the differences.';
      viz = plot(d.map(function (v, i) { return [i % 9 * 0.1 - 0.4, v, 1]; }), [[-0.5, m], [0.5, m]], 'observations', 'y');
    }

    html += '<div class="xp-bar"><div class="xp-seg" role="group" aria-label="Which test">' +
      [['one', 'One-sample t'], ['two', 'Two-sample t'], ['cor', 'Correlation']].map(function (m) {
        return '<button type="button" data-mode="' + m[0] + '" aria-pressed="' + (S.mode === m[0]) + '">' + m[1] + '</button>';
      }).join('') + '</div>' +
      '<label class="xp-field"><span>n per group</span><input type="range" min="5" max="60" value="' + S.n + '" data-k="n"><output>' + S.n + '</output></label>' +
      '<label class="xp-field"><span>True effect</span><input type="range" min="-1.5" max="1.5" step="0.1" value="' + S.effect + '" data-k="effect"><output>' + S.effect.toFixed(1) + '</output></label>' +
      (S.mode === 'one' ? '' : '<label class="xp-toggles"><input type="checkbox" data-rank' + (S.rankIt ? ' checked' : '') + '> Rank the data</label>') +
      '<button type="button" class="xp-go is-inline" data-new>New sample</button></div>' +
      '<div class="xp-lt">' + viz + '<div class="xp-lt-res">' + left + '<span class="xp-eq" aria-hidden="true">' + (S.rankIt && S.mode === 'two' ? '≈' : '=') + '</span>' + right + '</div></div>' +
      '<p class="xp-note">' + note + ' Highlighted values agree.</p>';
    host.innerHTML = html;
  }

  host.addEventListener('input', function (e) {
    var k = e.target.dataset.k;
    if (!k) return;
    S[k] = parseFloat(e.target.value);
    render();
    host.querySelector('[data-k="' + k + '"]').focus();
  });
  host.addEventListener('change', function (e) {
    if (!e.target.hasAttribute('data-rank')) return;
    S.rankIt = e.target.checked;
    render();
    host.querySelector('[data-rank]').focus();
  });
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var sel;
    if (b.dataset.mode) { S.mode = b.dataset.mode; if (S.mode === 'one') S.rankIt = false; sel = '[data-mode="' + S.mode + '"]'; }
    if (b.hasAttribute('data-new')) { S.seed += 1; sel = '[data-new]'; }
    render();
    if (sel) host.querySelector(sel).focus();
  });
  render();
})();
