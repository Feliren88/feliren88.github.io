/* ════════════════════════════════════════════════════════
   Linear Algebra, module 3: determinant, rank and inverse.
   The unit square's area is the determinant, a mirrored F shows a flip, a
   squashed plane has a null line whose points share 1 output, and A x = y
   has 1 answer, none, or a line of them. Matrices are [a, b, c, d] by rows.
   ════════════════════════════════════════════════════════ */
(function () {

  function det(m) { return m[0] * m[3] - m[1] * m[2]; }
  function size(m) { return Math.abs(m[0]) + Math.abs(m[1]) + Math.abs(m[2]) + Math.abs(m[3]); }
  /* 2, 1 or 0, with a tolerance scaled to the entries. */
  function rank(m) {
    var s = size(m);
    if (s < 1e-12) return 0;
    return Math.abs(det(m)) <= 1e-9 * s * s ? 1 : 2;
  }
  function inverse(m) {
    if (rank(m) < 2) return null;
    var d = det(m);
    return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d];
  }
  function apply(m, v) { return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]]; }
  function blend(m, t) { return [1 + (m[0] - 1) * t, m[1] * t, m[2] * t, 1 + (m[3] - 1) * t]; }
  function unit(v) { var n = Math.sqrt(v[0] * v[0] + v[1] * v[1]); return n < 1e-12 ? null : [v[0] / n, v[1] / n]; }
  function longer(p, q) { return p[0] * p[0] + p[1] * p[1] >= q[0] * q[0] + q[1] * q[1] ? p : q; }

  /* For a rank 1 matrix: the direction of the line every output lands on
     (col), and the direction of inputs that land on 0 (nul). */
  function lines(m) {
    if (rank(m) !== 1) return null;
    var col = longer([m[0], m[2]], [m[1], m[3]]), row = longer([m[0], m[1]], [m[2], m[3]]);
    return { col: unit(col), nul: unit([-row[1], row[0]]) };
  }

  /* Solve A x = y. */
  function solve(m, y) {
    var r = rank(m), s = Math.max(1, size(m) + Math.abs(y[0]) + Math.abs(y[1]));
    if (r === 2) return { kind: 'one', x: apply(inverse(m), y) };
    if (r === 0) return Math.abs(y[0]) + Math.abs(y[1]) <= 1e-9 * s ? { kind: 'all' } : { kind: 'none' };
    var L = lines(m);
    if (Math.abs(L.col[0] * y[1] - L.col[1] * y[0]) > 1e-9 * s) return { kind: 'none' };
    var i = m[0] * m[0] + m[1] * m[1] >= m[2] * m[2] + m[3] * m[3] ? 0 : 1;
    var ra = m[2 * i], rb = m[2 * i + 1], rn = ra * ra + rb * rb;
    return { kind: 'line', x: [ra * y[i] / rn, rb * y[i] / rn], dir: L.nul };
  }

  var M = { det: det, rank: rank, inverse: inverse, apply: apply, blend: blend, lines: lines, solve: solve };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  XP.lab('linear-algebra/determinant-rank-inverse', function (root, api) {
    var fmt = XP.fmt, svgEl = XP.svgEl, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var note = root.querySelector('[data-note]');
    var DEF = [2, 1, 0.5, 1.5], FLIP = [2, 1, 0.5, -1], SING = [2, 1, 0.5, 0.25];
    var PRESETS = { 'Your matrix': DEF, 'Flip it': FLIP, 'Squash it': SING, 'Scale by 2': [2, 0, 0, 2], 'Quarter turn': [0, -1, 1, 0] };
    /* A letter F inside the unit square: its reflection shows a flip. */
    var F = [[0.2, 0.1], [0.35, 0.1], [0.35, 0.45], [0.65, 0.45], [0.65, 0.58], [0.35, 0.58], [0.35, 0.78], [0.8, 0.78], [0.8, 0.9], [0.2, 0.9]];
    var START = { m: DEF.slice(), t: 0, mode: 'area', showNull: false, y: [1, 1], sweep: 0 };
    var s = JSON.parse(JSON.stringify(START));
    var P = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'The unit square and a letter F under the matrix A' });
    stage.appendChild(note);
    var dlg = XP.dialog(root);

    ctl.innerHTML =
      '<label>apply <input type="range" data-k="t" min="0" max="1" step="0.01" aria-label="How much of A to show"></label>' +
      '<button type="button" data-act="play">Apply A</button>' +
      '<button type="button" data-act="undo">Undo with A⁻¹</button>' +
      '<label>preset <select data-k="preset" aria-label="Preset matrix">' + Object.keys(PRESETS).map(function (k) { return '<option>' + k + '</option>'; }).join('') + '</select></label>' +
      '<button type="button" data-act="solve" aria-pressed="false">Solve Av = y</button>' +
      '<button type="button" data-zoom="det">Determinant, worked</button>' +
      '<button type="button" data-zoom="rank">Rank and nullity</button>' +
      '<button type="button" data-reset>Reset</button>';
    var tIn = ctl.querySelector('[data-k="t"]'), preset = ctl.querySelector('[data-k="preset"]'), undo = ctl.querySelector('[data-act="undo"]');

    function col(c, label, cls, part) {
      return P.handle({ x: s.m[c], y: s.m[2 + c], label: label, cls: cls, part: part, onMove: function (x, y, done) {
        s.m[c] = x; s.m[2 + c] = y; s.t = 1; draw(); if (done) report();
      } });
    }
    var hi = col(0, 'Where î lands', 'is-q', 'i'), hj = col(1, 'Where ĵ lands', 'is-k', 'j');
    var hy = P.handle({ x: s.y[0], y: s.y[1], label: 'The target y', cls: 'is-o', part: 'y', onMove: function (x, y, done) {
      s.y = [x, y]; draw(); if (done) report();
    } });

    function poly(points, m, cls, part) {
      return '<polygon class="' + cls + '" data-part="' + part + '" points="' + P.pts(points.map(function (q) { return apply(m, q); })) + '"/>';
    }
    function describeSolve(m) {
      var sol = solve(m, s.y);
      if (sol.kind === 'one') return 'Exactly 1 x lands on y: x = (' + fmt(sol.x[0]) + ', ' + fmt(sol.x[1]) + ').';
      if (sol.kind === 'line') return 'y sits on the squashed line, so a whole line of x lands on it.';
      if (sol.kind === 'all') return 'A sends everything to 0, and y is 0, so every x works.';
      return 'No x lands on y: A only reaches ' + (rank(m) === 1 ? 'the squashed line' : 'the origin') + ', and y is off it.';
    }

    function draw() {
      var m = blend(s.m, s.t), d = det(m), r = rank(m);
      tIn.value = s.t;
      undo.disabled = rank(s.m) < 2;
      undo.title = undo.disabled ? 'A squashes the plane, so it has no inverse' : '';
      api.values({ a: m[0], b: m[1], c: m[2], d: m[3], det: d });
      api.values({ rank: r }, 0);
      P.grid.innerHTML = P.gridMarkup(null, 1, 'pl-std is-faint') + P.gridMarkup(m, 1, 'pl-moved') + P.axes();
      var h = poly([[0, 0], [1, 0], [1, 1], [0, 1]], m, 'pl-square' + (d < 0 ? ' is-flipped' : ''), 'area') + poly(F, m, 'pl-f', 'f');
      var L = lines(m);
      if (L && s.t >= 1) {
        h += svgEl('line', { x1: P.map.sx(-12 * L.col[0]), y1: P.map.sy(-12 * L.col[1]), x2: P.map.sx(12 * L.col[0]), y2: P.map.sy(12 * L.col[1]), 'class': 'pl-line is-o is-faint', 'data-part': 'col' });
        if (s.showNull) {
          var p0 = [1, 0.5], out = apply(m, p0);
          h += svgEl('line', { x1: P.map.sx(p0[0] - 12 * L.nul[0]), y1: P.map.sy(p0[1] - 12 * L.nul[1]), x2: P.map.sx(p0[0] + 12 * L.nul[0]), y2: P.map.sy(p0[1] + 12 * L.nul[1]), 'class': 'pl-dash is-k', 'data-part': 'null' });
          [-2, -1, 0, 1, 2].forEach(function (k) {
            var q = [p0[0] + (k + s.sweep) * L.nul[0], p0[1] + (k + s.sweep) * L.nul[1]];
            h += '<g class="is-v" data-part="null">' + svgEl('line', { x1: P.map.sx(q[0]), y1: P.map.sy(q[1]), x2: P.map.sx(out[0]), y2: P.map.sy(out[1]), 'class': 'pl-dash' }) + '</g>';
            h += P.dot(q[0], q[1], 4, 'pl-mark pl-in', 'null');
          });
          h += P.dot(out[0], out[1], 7, 'pl-mark pl-out', 'out');
        }
      }
      h += P.arrow(0, 0, m[0], m[2], 'is-q', 'i') + P.arrow(0, 0, m[1], m[3], 'is-k', 'j');
      if (s.mode === 'solve') {
        var sol = solve(s.m, s.y);
        if (sol.kind === 'one') h += P.arrow(0, 0, sol.x[0], sol.x[1], 'is-v', 'x');
        if (sol.kind === 'line') {
          h += svgEl('line', { x1: P.map.sx(sol.x[0] - 12 * sol.dir[0]), y1: P.map.sy(sol.x[1] - 12 * sol.dir[1]), x2: P.map.sx(sol.x[0] + 12 * sol.dir[0]), y2: P.map.sy(sol.x[1] + 12 * sol.dir[1]), 'class': 'pl-line is-v', 'data-part': 'x' });
        }
        note.textContent = describeSolve(s.m);
      } else {
        note.textContent = r === 2 ? 'Area scales by |det A| = ' + fmt(Math.abs(d)) + (d < 0 ? ', and the plane is flipped.' : '.') :
          r === 1 ? 'The plane is squashed onto a line. The area is 0.' : 'Everything lands on the origin.';
      }
      P.plot.innerHTML = h;
      hi.set(m[0], m[2]); hj.set(m[1], m[3]); hy.set(s.y[0], s.y[1]);
      hy.show(s.mode === 'solve');
    }
    function report() { api.say(note.textContent); }
    function goTo(target) {
      var from = { m: s.m.slice(), t: s.t }, to = { m: target.m ? target.m.slice() : s.m.slice(), t: 't' in target ? target.t : s.t };
      if ('mode' in target) s.mode = target.mode;
      if ('showNull' in target) s.showNull = target.showNull;
      ctl.querySelector('[data-act="solve"]').setAttribute('aria-pressed', s.mode === 'solve' ? 'true' : 'false');
      api.animate(from, to, 800, function (st) { s.m = st.m.slice(); s.t = st.t; draw(); }, function () {
        report();
        if (s.showNull) api.animate({ sweep: -1 }, { sweep: 1 }, 1500, function (st) { s.sweep = st.sweep; draw(); });
      });
    }

    function table(rows) {
      return '<table class="xp-table lab-table"><tbody>' + rows.map(function (r) {
        return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>';
      }).join('') + '</tbody></table>';
    }

    ctl.addEventListener('input', function (e) { if (e.target === tIn) { s.t = +tIn.value; draw(); } });
    ctl.addEventListener('change', function (e) {
      if (e.target === preset) goTo({ m: PRESETS[preset.value], t: 1 });
      else report();
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act'), z = b.getAttribute('data-zoom');
      if (z === 'det') {
        var m = s.m;
        dlg.open('Determinant, worked', table([
          ['a d', fmt(m[0]) + ' × ' + fmt(m[3]) + ' = ' + fmt(m[0] * m[3])],
          ['b c', fmt(m[1]) + ' × ' + fmt(m[2]) + ' = ' + fmt(m[1] * m[2])],
          ['det A = a d − b c', fmt(det(m))]
        ]) + '<p>The parallelogram built on the columns has area |det A|. A negative sign means the plane was flipped over.</p>', b);
        return;
      }
      if (z === 'rank') {
        var rk = rank(s.m);
        dlg.open('Rank and nullity', table([
          ['rank A, dimensions that survive', String(rk)],
          ['dim ker A, dimensions squashed to 0', String(2 - rk)],
          ['rank + nullity', rk + ' + ' + (2 - rk) + ' = 2']
        ]) + '<p>Every input dimension either survives or is squashed. The 2 counts always add up to 2 here.</p>', b);
        return;
      }
      if (act === 'play') { s.t = 0; goTo({ t: 1 }); return; }
      if (act === 'undo') { if (!undo.disabled) goTo({ t: 0 }); return; }
      if (act === 'solve') { goTo({ mode: s.mode === 'solve' ? 'area' : 'solve', t: 1 }); return; }
      if (b.hasAttribute('data-reset')) { api.interrupt(); s = JSON.parse(JSON.stringify(START)); preset.value = 'Your matrix'; }
      draw(); report();
    });

    var PAGES = [
      { t: 'The unit square', parts: ['area', 'f'], state: { m: DEF, t: 0, mode: 'area', showNull: false },
        body: '<p>Start with the unit square. Its area is 1, and the letter F inside it shows which way round the plane is.</p>' },
      { t: 'Apply A', parts: ['area'], state: { t: 1 },
        body: '<p>A turns the square into a parallelogram. Its area is the <b class="is-o">determinant</b>, 2.5 here.</p>' },
      { t: 'The formula', parts: ['i', 'j', 'area'], state: { t: 1 },
        body: '<p>det A = a d − b c. With columns <b class="is-q">(2, 0.5)</b> and <b class="is-k">(1, 1.5)</b>, that is 2 × 1.5 − 1 × 0.5 = 2.5.</p>' },
      { t: 'Turn it over', parts: ['area', 'f'], state: { m: FLIP, t: 1 },
        body: '<p>Move <b class="is-k">ĵ</b> to the other side of <b class="is-q">î</b> and the determinant turns negative, −2.5. The F comes out mirrored.</p>' },
      { t: 'Squash it', parts: ['area', 'col'], state: { m: SING, t: 1 },
        body: '<p>Now <b class="is-k">ĵ</b> sits on the line of <b class="is-q">î</b>. The square flattens, the determinant is 0, and the rank drops to 1.</p>' },
      { t: 'Many inputs, 1 output', parts: ['null', 'out'], state: { m: SING, t: 1, showNull: true },
        body: '<p>Every point on the dashed line lands on the same spot. Once inputs share an output, nothing can tell them apart again.</p>' },
      { t: 'Undo, when you can', parts: ['area', 'f'], state: { m: DEF, t: 1, showNull: false },
        body: '<p>Press <b>Undo with A⁻¹</b> to send every point back. Undo is switched off whenever the determinant is 0.</p>' },
      { t: 'Solve Av = y', parts: ['y', 'x'], state: { mode: 'solve', t: 1 },
        body: '<p>Drag <b class="is-o">y</b>. With det A ≠ 0 there is exactly 1 answer <b class="is-v">x</b>. Squash A and there is none, or a whole line.</p>' }
    ];
    draw();
    XP.guide(root.querySelector('[data-guide-box]'), PAGES, function (p, i, redraw) {
      if (!p) { api.focus([]); return; }
      if (!redraw) goTo(p.state);
      api.focus(p.parts);
    });
  });

})();
