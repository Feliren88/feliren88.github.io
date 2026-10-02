/* ════════════════════════════════════════════════════════
   Linear Algebra, module 2: matrices as transformations.
   The grid bends from the identity to A; the columns of A are where î and ĵ
   land; a vector rides along as a combination of the columns; 2 matrices in
   a row compose, and the order matters. Matrices are [a, b, c, d] by rows.
   ════════════════════════════════════════════════════════ */
(function () {

  var I = [1, 0, 0, 1];
  function apply(m, v) { return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]]; }
  /* BA: first A, then B. */
  function mul(B, A) {
    return [B[0] * A[0] + B[1] * A[2], B[0] * A[1] + B[1] * A[3], B[2] * A[0] + B[3] * A[2], B[2] * A[1] + B[3] * A[3]];
  }
  function det(m) { return m[0] * m[3] - m[1] * m[2]; }
  function rotation(deg) { var t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return [c, -s, s, c]; }
  function scaling(sx, sy) { return [sx, 0, 0, sy]; }
  function shear(k) { return [1, k, 0, 1]; }
  /* Projection onto the line through the origin at `deg` degrees. */
  function projection(deg) { var t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return [c * c, c * s, c * s, s * s]; }
  /* Each entry of BA as its 2 terms, B_i1 A_1j and B_i2 A_2j, in the order 11, 12, 21, 22. */
  function productTerms(B, A) {
    return [[0, 0], [0, 1], [1, 0], [1, 1]].map(function (ij) {
      var i = ij[0], j = ij[1];
      return [B[2 * i] * A[j], B[2 * i + 1] * A[2 + j]];
    });
  }
  function blend(m, t) { return [1 + (m[0] - 1) * t, m[1] * t, m[2] * t, 1 + (m[3] - 1) * t]; }
  /* The matrix on screen at time t in [0, 2] while composing: the first
     matrix grows in over [0, 1], then the second is applied on top. */
  function stageMatrix(A, B, order, t) {
    var first = order === 'A first' ? A : B, second = order === 'A first' ? B : A;
    return t <= 1 ? blend(first, t) : mul(blend(second, t - 1), first);
  }

  var M = { I: I, apply: apply, mul: mul, det: det, rotation: rotation, scaling: scaling, shear: shear,
    projection: projection, productTerms: productTerms, blend: blend, stageMatrix: stageMatrix };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  XP.lab('linear-algebra/matrices-as-transformations', function (root, api) {
    var fmt = XP.fmt, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var DEF = [2, -1, 1, 1], B = rotation(90), V = [1, 2];
    var PRESETS = {
      'Your matrix': DEF, 'Rotate by 30°': rotation(30), 'Stretch across': scaling(2, 0.5),
      'Shear': shear(1), 'Project onto a line': projection(30), 'Identity': I
    };
    var s = { m: DEF.slice(), t: 0, compose: false, order: 'A first' };
    var P = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'The grid before and after the matrix A, with î, ĵ and v' });
    var dlg = XP.dialog(root);

    ctl.innerHTML =
      '<label>Apply <input type="range" data-k="t" min="0" max="1" step="0.01" aria-label="How much of the transformation to show"></label>' +
      '<button type="button" data-act="play">Play</button>' +
      '<label>Preset <select data-k="preset" aria-label="Preset matrix">' + Object.keys(PRESETS).map(function (k) { return '<option>' + k + '</option>'; }).join('') + '</select></label>' +
      '<button type="button" data-act="compose" aria-pressed="false">A then B</button>' +
      '<button type="button" data-act="swap" hidden>Swap the order</button>' +
      '<button type="button" data-zoom="av">A times v, worked</button>' +
      '<button type="button" data-zoom="ba">Entries of BA, worked</button>' +
      '<button type="button" data-reset>Reset</button>';
    var tIn = ctl.querySelector('[data-k="t"]'), preset = ctl.querySelector('[data-k="preset"]'), swap = ctl.querySelector('[data-act="swap"]');

    function shown() { return s.compose ? stageMatrix(s.m, B, s.order, s.t) : blend(s.m, s.t); }
    function columnHandle(col, label, cls, part) {
      return P.handle({ x: s.m[col], y: s.m[2 + col], label: label, cls: cls, part: part, onMove: function (x, y, done) {
        s.m[col] = x; s.m[2 + col] = y; s.t = 1; s.compose = false; draw(); if (done) report();
      } });
    }
    var hi = columnHandle(0, 'Where î lands', 'is-q', 'i'), hj = columnHandle(1, 'Where ĵ lands', 'is-k', 'j');

    function draw() {
      var m = shown(), av = apply(m, V), a = [V[0] * m[0], V[0] * m[2]];
      tIn.max = s.compose ? 2 : 1;
      tIn.value = s.t;
      swap.hidden = !s.compose;
      api.values({ a: m[0], b: m[1], c: m[2], d: m[3], vx: av[0], vy: av[1] });
      P.grid.innerHTML = P.gridMarkup(null, 1, 'pl-std is-faint') + P.gridMarkup(m, 1, 'pl-moved') + P.axes();
      var h = '';
      if (!s.compose && s.t < 1) {
        h += P.arrow(0, 0, s.m[0], s.m[2], 'is-q is-faint', 'i') + P.arrow(0, 0, s.m[1], s.m[3], 'is-k is-faint', 'j');
      }
      if (s.compose) {
        var other = stageMatrix(s.m, B, s.order === 'A first' ? 'B first' : 'A first', 2);
        h += P.arrow(0, 0, other[0], other[2], 'is-q is-faint', 'i') + P.arrow(0, 0, other[1], other[3], 'is-k is-faint', 'j');
      }
      h += P.arrow(0, 0, a[0], a[1], 'is-q', 'v i') + P.arrow(a[0], a[1], av[0], av[1], 'is-k', 'v j');
      h += P.arrow(0, 0, m[0], m[2], 'is-q', 'i') + P.arrow(0, 0, m[1], m[3], 'is-k', 'j');
      h += P.arrow(0, 0, av[0], av[1], 'is-o', 'v');
      P.plot.innerHTML = h;
      hi.set(m[0], m[2]); hj.set(m[1], m[3]);
      hi.show(!s.compose); hj.show(!s.compose);
    }
    function report() {
      var m = shown(), av = apply(m, V);
      api.say('î lands at (' + fmt(m[0]) + ', ' + fmt(m[2]) + ') and ĵ at (' + fmt(m[1]) + ', ' + fmt(m[3]) + '). ' +
        'v = (1, 2) lands at (' + fmt(av[0]) + ', ' + fmt(av[1]) + ').' +
        (s.compose ? ' Showing ' + (s.order === 'A first' ? 'A, then B' : 'B, then A') + ', where B is a quarter turn.' : ''));
    }
    function goTo(target) {
      var from = { m: s.m.slice(), t: s.t }, to = { m: target.m || s.m.slice(), t: 't' in target ? target.t : s.t };
      if ('compose' in target && target.compose !== s.compose) { s.compose = target.compose; from.t = s.compose ? 0 : from.t; }
      if (target.order) s.order = target.order;
      ctl.querySelector('[data-act="compose"]').setAttribute('aria-pressed', s.compose ? 'true' : 'false');
      api.animate(from, to, 800, function (st) { s.m = st.m.slice(); s.t = st.t; draw(); }, report);
    }

    function table(rows) {
      return '<table class="xp-table lab-table"><tbody>' + rows.map(function (r) {
        return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>';
      }).join('') + '</tbody></table>';
    }
    function zoomAv(btn) {
      var m = shown(), av = apply(m, V);
      dlg.open('A times v, worked', table([
        ['Aî, the first column', '(' + fmt(m[0]) + ', ' + fmt(m[2]) + ')'],
        ['Aĵ, the second column', '(' + fmt(m[1]) + ', ' + fmt(m[3]) + ')'],
        ['1 × Aî + 2 × Aĵ, across', '1 × ' + fmt(m[0]) + ' + 2 × ' + fmt(m[1]) + ' = ' + fmt(av[0])],
        ['1 × Aî + 2 × Aĵ, up', '1 × ' + fmt(m[2]) + ' + 2 × ' + fmt(m[3]) + ' = ' + fmt(av[1])]
      ]) + '<p>The vector (1, 2) uses 1 of the first column and 2 of the second.</p>', btn);
    }
    function zoomBa(btn) {
      var terms = productTerms(B, s.m), ba = mul(B, s.m), names = [window.InterviewDisplayMath.html("lab/matrices-as-transformations/entry-0", undefined, true), window.InterviewDisplayMath.html("lab/matrices-as-transformations/entry-1", undefined, true), window.InterviewDisplayMath.html("lab/matrices-as-transformations/entry-2", undefined, true), window.InterviewDisplayMath.html("lab/matrices-as-transformations/entry-3", undefined, true)];
      dlg.open('Final product BA, worked', '<p>B is a quarter turn, [[' + fmt(B[0]) + ', ' + fmt(B[1]) + '], [' + fmt(B[2]) + ', ' + fmt(B[3]) + ']]. Each entry adds 2 products.</p>' +
        table(names.map(function (n, k) { return [n, fmt(terms[k][0]) + ' + ' + fmt(terms[k][1]) + ' = ' + fmt(ba[k])]; })), btn);
    }

    ctl.addEventListener('input', function (e) {
      if (e.target === tIn) { s.t = +tIn.value; draw(); }
    });
    ctl.addEventListener('change', function (e) {
      if (e.target === preset) goTo({ m: PRESETS[preset.value].slice(), t: 1, compose: false });
      else report();
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act'), z = b.getAttribute('data-zoom');
      if (z === 'av') return zoomAv(b);
      if (z === 'ba') return zoomBa(b);
      if (act === 'play') { var end = s.compose ? 2 : 1; s.t = 0; draw(); api.animate({ t: 0 }, { t: end }, s.compose ? 1600 : 900, function (st) { s.t = st.t; draw(); }, report); return; }
      if (act === 'compose') { goTo({ compose: !s.compose, t: s.compose ? 1 : 2 }); return; }
      if (act === 'swap') { s.order = s.order === 'A first' ? 'B first' : 'A first'; s.t = 0; goTo({ t: 2 }); return; }
      if (b.hasAttribute('data-reset')) { api.interrupt(); s = { m: DEF.slice(), t: 0, compose: false, order: 'A first' }; preset.value = 'Your matrix'; }
      ctl.querySelector('[data-act="compose"]').setAttribute('aria-pressed', s.compose ? 'true' : 'false');
      draw(); report();
    });

    var PAGES = [
      { t: 'The plain grid', parts: ['i', 'j'], state: { m: DEF, t: 0, compose: false },
        body: '<p>Every point of the plane sits on this grid. <b class="is-q">î</b> = (1, 0) and <b class="is-k">ĵ</b> = (0, 1) are the 2 starting arrows.</p>' },
      { t: 'Where î and ĵ land', parts: ['i', 'j'], state: { t: 0 },
        body: '<p>The first column of A says where <b class="is-q">î</b> lands, (2, 1). The second column says where <b class="is-k">ĵ</b> lands, (−1, 1).</p>' },
      { t: 'Apply it', parts: ['i', 'j'], state: { t: 1 },
        body: '<p>Every point moves at once. Grid lines stay straight and evenly spaced, and the origin stays put.</p>' },
      { t: 'Follow 1 vector', parts: ['v'], state: { t: 1 },
        body: '<p><b class="is-o">v</b> = (1, 2) means 1 of the first column plus 2 of the second. It lands at 1 × (2, 1) + 2 × (−1, 1) = (0, 3).</p>' },
      { t: 'Drag the columns', parts: ['i', 'j', 'v'], state: { t: 1 },
        body: '<p>Drag the tips of <b class="is-q">Aî</b> and <b class="is-k">Aĵ</b>. The matrix above changes with them, and so does every point.</p>' },
      { t: '4 familiar moves', parts: ['i', 'j'], state: { m: rotation(30), t: 1 },
        body: '<p>This matrix rotates the grid by 30°. Try stretching, shearing, or projecting the plane onto 1 line.</p>' },
      { t: '2 in a row', parts: ['i', 'j', 'v'], state: { m: DEF, compose: true, order: 'A first', t: 2 },
        body: '<p>Apply A, then B, a quarter turn. The faint arrows show the reverse order, which lands elsewhere, so BA and AB differ.</p>' }
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
