/* ════════════════════════════════════════════════════════
   Linear Algebra, module 4: eigenvectors and eigenvalues.
   A fan of arrows transforms; most leave their line and the eigenvectors
   stay on theirs. The unit circle becomes an ellipse, det(A − λI) is drawn
   as a parabola whose roots are the eigenvalues, and repeated application
   swings every direction towards the dominant eigenvector.
   ════════════════════════════════════════════════════════ */
(function () {

  function det(m) { return m[0] * m[3] - m[1] * m[2]; }
  function tr(m) { return m[0] + m[3]; }
  function charPoly(m, l) { return l * l - tr(m) * l + det(m); }
  function apply(m, v) { return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]]; }
  function blend(m, t) { return [1 + (m[0] - 1) * t, m[1] * t, m[2] * t, 1 + (m[3] - 1) * t]; }

  /* Eigenvalues, largest first, and unit eigenvectors. A complex pair is
     returned as re ± im i. A defective matrix returns 1 vector; a multiple
     of the identity returns the 2 axes, since every direction qualifies. */
  function eig(m) {
    var t = tr(m), d = det(m), disc = t * t / 4 - d;
    var sc = Math.max(1, Math.abs(t), Math.sqrt(Math.abs(d)));
    if (disc < -1e-12 * sc * sc) return { real: false, re: t / 2, im: Math.sqrt(-disc) };
    var r = Math.sqrt(Math.max(0, disc)), l1 = t / 2 + r, l2 = t / 2 - r;
    function vec(l) {
      var a = m[0] - l, b = m[1], c = m[2], dd = m[3] - l;
      var v = a * a + b * b >= c * c + dd * dd ? [-b, a] : [-dd, c], n = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
      return n < 1e-9 * sc ? null : [v[0] / n, v[1] / n];
    }
    if (r < 1e-9 * sc) {
      var v = vec(l1);
      return { real: true, values: [l1, l1], vectors: v ? [v] : [[1, 0], [0, 1]] };
    }
    return { real: true, values: [l1, l2], vectors: [vec(l1), vec(l2)] };
  }

  function power(m, v, n) { for (var i = 0; i < n; i++) v = apply(m, v); return v; }
  function spectralRadius(m) {
    var e = eig(m);
    return e.real ? Math.max(Math.abs(e.values[0]), Math.abs(e.values[1])) : Math.sqrt(e.re * e.re + e.im * e.im);
  }
  /* How far A knocks v off its own line, in radians from 0 to π/2. */
  function knock(m, v) {
    var w = apply(m, v), nv = Math.sqrt(v[0] * v[0] + v[1] * v[1]), nw = Math.sqrt(w[0] * w[0] + w[1] * w[1]);
    if (nv < 1e-12 || nw < 1e-12) return 0;
    return Math.acos(Math.min(1, Math.abs(v[0] * w[0] + v[1] * w[1]) / (nv * nw)));
  }

  function iterateStep(m, v) {
    var w = apply(m, v), n = Math.hypot(w[0], w[1]);
    return n > 1 ? [w[0] / n, w[1] / n] : w;
  }

  var M = { iterateStep: iterateStep, det: det, tr: tr, charPoly: charPoly, apply: apply, blend: blend, eig: eig, power: power,
    spectralRadius: spectralRadius, knock: knock };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  XP.lab('linear-algebra/eigenvectors', function (root, api) {
    var fmt = XP.fmt, svgEl = XP.svgEl, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var DEF = [2, 1, 0.5, 1.5];
    var PRESETS = { 'Your matrix': DEF, 'Symmetric': [2, 1, 1, 2], 'Quarter turn': [0, -1, 1, 0], 'Shear': [1, 1, 0, 1], 'Shrinking': [0.6, 0.2, 0.1, 0.5] };
    var R = 1.2, FAN = [], CLOUD = [], k;
    for (k = 0; k < 24; k++) FAN.push([R * Math.cos(k * Math.PI / 12), R * Math.sin(k * Math.PI / 12)]);
    for (k = 0; k < 12; k++) CLOUD.push([Math.cos((k + 0.5) * Math.PI / 12), Math.sin((k + 0.5) * Math.PI / 12)]);
    var START = { m: DEF.slice(), t: 0, mode: 'fan', n: 0, dirs: CLOUD.map(function (d) { return d.slice(); }) };
    var s = JSON.parse(JSON.stringify(START));
    var P = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'A fan of arrows under A, with the eigenvectors on their own lines' });
    var Q = XP.plane(stage, { x: [-3, 5], y: [-3, 6], w: 480, h: 150, label: 'The characteristic polynomial against lambda, crossing 0 at the eigenvalues' });
    var dlg = XP.dialog(root);

    ctl.innerHTML =
      '<label>Apply <input type="range" data-k="t" min="0" max="1" step="0.01" aria-label="How much of A to show"></label>' +
      '<button type="button" data-act="play">Play</button>' +
      '<button type="button" data-act="again">Apply again</button>' +
      '<label>Preset <select data-k="preset" aria-label="Preset matrix">' + Object.keys(PRESETS).map(function (n) { return '<option>' + n + '</option>'; }).join('') + '</select></label>' +
      '<button type="button" data-zoom="poly">Characteristic polynomial, worked</button>' +
      '<button type="button" data-zoom="diag">Diagonalisation, worked</button>' +
      '<button type="button" data-reset>Reset</button>';
    var tIn = ctl.querySelector('[data-k="t"]'), preset = ctl.querySelector('[data-k="preset"]');

    function col(c, label, cls, part) {
      return P.handle({ x: s.m[c], y: s.m[2 + c], label: label, cls: cls, part: part, onMove: function (x, y, done) {
        s.m[c] = x; s.m[2 + c] = y; s.t = 1; s.mode = 'fan'; draw(); if (done) report();
      } });
    }
    var hi = col(0, 'Where î lands', 'is-q', 'i'), hj = col(1, 'Where ĵ lands', 'is-k', 'j');

    function unit(v) { var n = Math.sqrt(v[0] * v[0] + v[1] * v[1]); return n < 1e-12 ? [1, 0] : [v[0] / n, v[1] / n]; }
    function lineThrough(d, cls, part) {
      return svgEl('line', { x1: P.map.sx(-12 * d[0]), y1: P.map.sy(-12 * d[1]), x2: P.map.sx(12 * d[0]), y2: P.map.sy(12 * d[1]), 'class': cls, 'data-part': part });
    }

    function drawPoly(e) {
      var pts = [];
      for (var x = -3; x <= 5.001; x += 0.1) pts.push([x, charPoly(s.m, x)]);
      var h = svgEl('line', { x1: 0, y1: Q.map.sy(0), x2: Q.w, y2: Q.map.sy(0), 'class': 'pl-axis' }) +
        '<polyline class="pl-curve is-o" data-part="poly" points="' + Q.pts(pts) + '"/>';
      if (e.real) {
        h += Q.dot(e.values[0], 0, 5, 'pl-mark pl-root is-q', 'e1 poly');
        if (e.vectors.length === 2) h += Q.dot(e.values[1], 0, 5, 'pl-mark pl-root is-k', 'e2 poly');
      }
      Q.plot.innerHTML = h;
    }

    function draw() {
      var m = s.m, e = eig(m), mt = blend(m, s.t), tv = tr(m), dv = det(m);
      tIn.value = s.t;
      if (s.mode === 'iterate' && s.path) {
        var at = Math.max(0, Math.min(s.path.length - 1, s.t * (s.path.length - 1)));
        var lowIndex = Math.floor(at), highIndex = Math.min(lowIndex + 1, s.path.length - 1);
        s.dirs = XP.mix(s.path[lowIndex], s.path[highIndex], at - lowIndex);
        s.n = s.baseN + Math.floor(at);
      }
      api.values({
        l1: e.real ? fmt(e.values[0]) : fmt(e.re) + ' + ' + fmt(e.im) + 'i',
        l2: e.real ? fmt(e.values[1]) : fmt(e.re) + ' − ' + fmt(e.im) + 'i',
        trs: (tv >= 0 ? '− ' : '+ ') + fmt(Math.abs(tv)), dets: (dv >= 0 ? '+ ' : '− ') + fmt(Math.abs(dv))
      });
      P.grid.innerHTML = P.gridMarkup(null, 1, 'pl-std is-faint') + P.axes();
      var h = '';
      if (s.mode === 'fan') {
        var circle = [];
        for (var a = 0; a < 72; a++) {
          var p = [Math.cos(a * Math.PI / 36), Math.sin(a * Math.PI / 36)];
          circle.push(apply(mt, p));
        }
        h += '<polygon class="pl-circle" data-part="circle" points="' + P.pts(circle) + '"/>';
        FAN.forEach(function (v) {
          h += lineThrough(unit(v), 'pl-fanline is-faint', 'fan');
          var w = apply(mt, v);
          h += P.arrow(0, 0, w[0], w[1], knock(m, v) < 0.02 ? 'is-o' : 'is-muted', 'fan');
        });
      } else {
        CLOUD.forEach(function (d, j) {
          var q = s.dirs[j];
          h += P.arrow(0, 0, 2.2 * q[0], 2.2 * q[1], 'is-muted', 'cloud');
        });
      }
      if (e.real) {
        e.vectors.forEach(function (v, j) {
          var cls = j === 0 ? 'is-q' : 'is-k', part = j === 0 ? 'e1' : 'e2', lam = e.vectors.length === 2 ? e.values[j] : e.values[0];
          var len = s.mode === 'fan' ? R * (1 + (lam - 1) * s.t) : 2.4;
          h += lineThrough(v, 'pl-line ' + cls + ' is-faint', part);
          h += P.arrow(0, 0, len * v[0], len * v[1], cls, part);
        });
      }
      P.plot.innerHTML = h;
      drawPoly(e);
      hi.set(mt[0], mt[2]); hj.set(mt[1], mt[3]);
      hi.show(s.mode === 'fan'); hj.show(s.mode === 'fan');
    }

    function report() {
      var e = eig(s.m);
      if (!e.real) {
        api.say('This matrix turns every line, so it has no real eigenvector. Its eigenvalues are ' + fmt(e.re) + ' plus or minus ' + fmt(e.im) + 'i.');
        return;
      }
      var words = e.vectors.length === 1 ? 'Only 1 direction stays on its line, with eigenvalue ' + fmt(e.values[0]) + '.' :
        'The eigenvalues are ' + fmt(e.values[0]) + ' and ' + fmt(e.values[1]) + '.';
      api.say(words + (s.mode === 'iterate' ? ' The picture shows ' + s.n + ' applications. Growing arrows use a fixed display length; contracting arrows shorten.' : ''));
    }
    function goTo(target) {
      var from = { m: s.m.slice(), t: s.t }, to = { m: target.m ? target.m.slice() : s.m.slice(), t: 't' in target ? target.t : s.t };
      if ('mode' in target && (target.mode !== s.mode || target.n)) {
        s.mode = target.mode; s.n = 0; s.path = null; s.dirs = CLOUD.map(function (d) { return d.slice(); });
      }
      api.animate(from, to, 800, function (st) { s.m = st.m.slice(); s.t = st.t; draw(); }, function () {
        report();
        if (target.n) iterate(target.n);
      });
    }
    /* Scrub each application while retaining the length of contracting arrows.
       Growing arrows use a fixed display length to keep the stage bounded. */
    function iterate(times) {
      if (!times) return;
      s.mode = 'iterate';
      s.path = [s.dirs.map(function (d) { return d.slice(); })];
      for (var i = 0; i < times; i++) {
        s.path.push(s.path[i].map(function (d) { return iterateStep(s.m, d); }));
      }
      s.baseN = s.n;
      s.t = 0;
      api.animate({ t: 0 }, { t: 1 }, times === 1 ? 450 : 800,
        function (st) { s.t = st.t; draw(); }, report);
    }

    function table(rows) {
      return '<table class="xp-table lab-table"><tbody>' + rows.map(function (r) {
        return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>';
      }).join('') + '</tbody></table>';
    }
    function zoomPoly(btn) {
      var m = s.m, tv = tr(m), dv = det(m), disc = tv * tv / 4 - dv, e = eig(m);
      var rows = [['trace = a + d', fmt(m[0]) + ' + ' + fmt(m[3]) + ' = ' + fmt(tv)], ['det = a d − b c', fmt(dv)],
        [(''+window.InterviewDisplayMath.html("lab/eigenvectors/worked-2", undefined, true)+''), fmt(disc)]];
      rows.push(e.real ? [(''+window.InterviewDisplayMath.html("lab/eigenvectors/worked-0", undefined, true)+''), fmt(e.values[0]) + ' and ' + fmt(e.values[1])] :
        [(''+window.InterviewDisplayMath.html("lab/eigenvectors/worked-1", undefined, true)+''), fmt(e.re) + ' ± ' + fmt(e.im) + 'i']);
      dlg.open('Characteristic polynomial, worked', table(rows) + '<p>A nonzero vector satisfies Av = λv exactly when A − λI collapses a direction. Therefore, det(A − λI) = 0.</p>', btn);
    }
    function zoomDiag(btn) {
      var e = eig(s.m), n = Math.max(1, s.n || 5);
      if (!e.real || e.vectors.length < 2) {
        dlg.open('Diagonalisation, worked', '<p>' + (e.real ? 'This matrix has only 1 eigenvector direction, so there is no Q to build.' :
          'The eigenvalues are complex, so Q and Λ need complex numbers.') + ' Repeated multiplication still works.</p>', btn);
        return;
      }
      var q = e.vectors, Qm = [q[0][0], q[1][0], q[0][1], q[1][1]], dq = Qm[0] * Qm[3] - Qm[1] * Qm[2];
      var Qi = [Qm[3] / dq, -Qm[1] / dq, -Qm[2] / dq, Qm[0] / dq];
      var ln = [Math.pow(e.values[0], n), Math.pow(e.values[1], n)];
      var viaQ = [Qm[0] * ln[0] * Qi[0] + Qm[1] * ln[1] * Qi[2], Qm[0] * ln[0] * Qi[1] + Qm[1] * ln[1] * Qi[3],
        Qm[2] * ln[0] * Qi[0] + Qm[3] * ln[1] * Qi[2], Qm[2] * ln[0] * Qi[1] + Qm[3] * ln[1] * Qi[3]];
      var byHand = power(s.m, [1, 0], n).concat(power(s.m, [0, 1], n));
      function mat(x) { return window.InterviewDisplayMath.html("lab/eigenvectors/matrix", {a:fmt(x[0]),b:fmt(x[1]),c:fmt(x[2]),d:fmt(x[3])}, true); }
      dlg.open('Diagonalisation, worked', table([
        ['Q, the eigenvectors as columns', mat(Qm)],
        ['Λ, the eigenvalues', 'diag(' + fmt(e.values[0]) + ', ' + fmt(e.values[1]) + ')'],
        [window.InterviewDisplayMath.html("lab/eigenvectors/power", {n:n}, true), mat(viaQ)],
        ['The same, multiplying ' + n + ' times', mat([byHand[0], byHand[2], byHand[1], byHand[3]])]
      ]) + '<p>Raising Λ to a power only raises each eigenvalue, which is why repetition is easy in this basis.</p>', btn);
    }

    ctl.addEventListener('input', function (e) { if (e.target === tIn) { var requested = +tIn.value; api.interrupt(); s.t = requested; draw(); } });
    ctl.addEventListener('change', function (e) {
      if (e.target === preset) goTo({ m: PRESETS[preset.value], t: 1, mode: 'fan' });
      else report();
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act'), z = b.getAttribute('data-zoom');
      if (z === 'poly') return zoomPoly(b);
      if (z === 'diag') return zoomDiag(b);
      if (act === 'play') { s.t = 0; goTo({ t: 1, mode: 'fan' }); return; }
      if (act === 'again') { iterate(1); return; }
      if (b.hasAttribute('data-reset')) { api.interrupt(); s = JSON.parse(JSON.stringify(START)); preset.value = 'Your matrix'; }
      draw(); report();
    });

    var PAGES = [
      { t: 'A fan of arrows', parts: ['fan'], state: { m: DEF, t: 0, mode: 'fan' },
        body: '<p>The 24 arrows point every way round the circle. Each one sits on its own faint line through the origin.</p>' },
      { t: 'Apply A', parts: ['fan'], state: { t: 1 },
        body: '<p>Almost every arrow is knocked off its line. The faint lines still show where each one started.</p>' },
      { t: 'The arrows that stay', parts: ['e1', 'e2'], state: { t: 1 },
        body: '<p>The arrows along <b class="is-q">(2, 1)</b> and <b class="is-k">(1, −1)</b> stay on their lines. These are eigenvectors. Their eigenvalues give scale factors 2.5 and 1.</p>' },
      { t: 'The circle becomes an ellipse', parts: ['circle', 'e1', 'e2'], state: { t: 1 },
        body: '<p>Push the whole unit circle through A and it becomes an ellipse. The eigenvectors land on their own lines.</p>' },
      { t: 'Where they come from', parts: ['poly', 'e1', 'e2'], state: { t: 1 },
        body: '<p>Av = λv means (A − λI)v = 0, so det(A − λI) = 0. The <b class="is-o">parabola</b> below crosses 0 at λ = 2.5 and λ = 1.</p>' },
      { t: 'Apply again and again', parts: ['cloud', 'e1'], state: { mode: 'iterate', n: 6 },
        body: '<p>Apply A 6 times to 12 directions. The arrows approach the line through <b class="is-q">(2, 1)</b>, whose eigenvalue is 2.5.</p>' },
      { t: 'Turns and symmetry', parts: ['fan', 'e1', 'e2'], state: { m: [0, -1, 1, 0], t: 1, mode: 'fan' },
        body: '<p>A quarter turn moves every line, so it has no real eigenvector. Pick <b>Symmetric</b> and its 2 eigenvectors meet at a right angle.</p>' }
    ];
    draw();
    XP.guide(root.querySelector('[data-guide-box]'), PAGES, function (p, i, redraw) {
      if (!p) { api.focus([]); return; }
      if (!redraw) {
        var target = {};
        PAGES.slice(0, i + 1).forEach(function (page) { Object.assign(target, page.state); });
        if (target.mode !== 'iterate') target.n = 0;
        goTo(target);
      }
      api.focus(p.parts);
    });
  });

})();
