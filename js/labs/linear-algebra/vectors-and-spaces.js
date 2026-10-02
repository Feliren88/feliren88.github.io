/* ════════════════════════════════════════════════════════
   Linear Algebra, module 1: vectors and spaces.
   2 arrows, their combinations and their span, coordinates in 2 bases, the
   dot product as a shadow, and a plane spanned by 2 arrows in 3D. The pure
   maths is exported for scripts/verify_labs.py.
   ════════════════════════════════════════════════════════ */
(function () {

  function combo(c1, c2, v1, v2) { return [c1 * v1[0] + c2 * v2[0], c1 * v1[1] + c2 * v2[1]]; }
  function det2(v1, v2) { return v1[0] * v2[1] - v1[1] * v2[0]; }
  function dot(u, v) { return u[0] * v[0] + u[1] * v[1]; }
  function norm(v) { return Math.sqrt(dot(v, v)); }

  /* Rank of the pair: 2 if they point different ways, 1 if they share a
     line, 0 if both are 0. The tolerance scales with their size. */
  function rank2(v1, v2) {
    var s = dot(v1, v1) + dot(v2, v2);
    if (s < 1e-18) return 0;
    return Math.abs(det2(v1, v2)) <= 1e-9 * s ? 1 : 2;
  }

  /* Coordinates of p in the basis v1, v2, by Cramer's rule, or null when
     v1 and v2 are no basis. */
  function coords(p, v1, v2) {
    if (rank2(v1, v2) < 2) return null;
    var d = det2(v1, v2);
    return [det2(p, v2) / d, det2(v1, p) / d];
  }

  function angle(u, v) {
    var nu = norm(u), nv = norm(v);
    if (nu < 1e-12 || nv < 1e-12) return null;
    return Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (nu * nv))));
  }

  /* The shadow of u on the line through v, or null when v is 0. */
  function proj(u, v) {
    var vv = dot(v, v);
    if (vv < 1e-18) return null;
    var k = dot(u, v) / vv;
    return [k * v[0], k * v[1]];
  }

  function cross3(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function rank3(a, b) {
    var s = a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + b[0] * b[0] + b[1] * b[1] + b[2] * b[2];
    if (s < 1e-18) return 0;
    var c = cross3(a, b);
    return Math.sqrt(c[0] * c[0] + c[1] * c[1] + c[2] * c[2]) <= 1e-9 * s ? 1 : 2;
  }

  /* An orthographic view with z up: turn by `yaw` about z, then tilt by
     `pitch` towards the viewer. Returns [x, y] on screen, y up. */
  function project3(p, yaw, pitch) {
    var cy = Math.cos(yaw), sy = Math.sin(yaw), x = cy * p[0] + sy * p[1], d = -sy * p[0] + cy * p[1];
    return [x, Math.cos(pitch) * p[2] - Math.sin(pitch) * d];
  }

  var M = { combo: combo, det2: det2, dot: dot, norm: norm, rank2: rank2, coords: coords, angle: angle,
    proj: proj, cross3: cross3, rank3: rank3, project3: project3 };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  XP.lab('linear-algebra/vectors-and-spaces', function (root, api) {
    var fmt = XP.fmt, svgEl = XP.svgEl, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var START = { v1: [2, 1], v2: [-1, 1.5], c1: 1, c2: 1, u: [1, 2], paint: false, basis: false, showU: false, mode: '2d', yaw: 0.6, pitch: 0.5 };
    var s = JSON.parse(JSON.stringify(START)), trail = [];
    var A3 = [2, 0.5, 1], B3 = [0.5, 2, 1];
    var P = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'The arrows v1 and v2, their combination, and the points they span' });
    var P3 = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: '2 arrows in 3 dimensions and the plane they span' });
    var dlg = XP.dialog(root);

    ctl.innerHTML =
      '<label hidden>turn <input type="range" data-k="yaw" min="-3.1" max="3.1" step="0.02" aria-label="Turn the 3D view"></label>' +
      '<label hidden>tilt <input type="range" data-k="pitch" min="-1.2" max="1.2" step="0.02" aria-label="Tilt the 3D view"></label>' +
      '<button type="button" data-act="paint">Paint the span</button>' +
      '<button type="button" data-act="basis" aria-pressed="false">Basis grid</button>' +
      '<button type="button" data-act="u" aria-pressed="false">Show u</button>' +
      '<button type="button" data-act="3d" aria-pressed="false">3D view</button>' +
      '<button type="button" data-zoom="coords">Coordinates, worked</button>' +
      '<button type="button" data-zoom="dot">Dot product, worked</button>' +
      '<button type="button" data-reset>Reset</button>';
    var sl = {};
    Array.prototype.forEach.call(ctl.querySelectorAll('[data-k]'), function (el) { sl[el.getAttribute('data-k')] = el; });

    var hv1 = P.handle({ x: s.v1[0], y: s.v1[1], label: 'Tip of v1', cls: 'is-q', part: 'v1',
      onMove: function (x, y, done) { s.v1 = [x, y]; trail = []; draw(); if (done) report(); } });
    var hv2 = P.handle({ x: s.v2[0], y: s.v2[1], label: 'Tip of v2', cls: 'is-k', part: 'v2',
      onMove: function (x, y, done) { s.v2 = [x, y]; trail = []; draw(); if (done) report(); } });
    var hu = P.handle({ x: s.u[0], y: s.u[1], label: 'Tip of u', cls: 'is-v', part: 'u',
      onMove: function (x, y, done) { s.u = [x, y]; draw(); if (done) report(); } });
    /* The combination's tip: drag it and c1, c2 are solved for, so no slider is needed. */
    var hs = P.handle({ x: 1, y: 2.5, label: 'Tip of c1 v1 + c2 v2', cls: 'is-o', part: 'sum',
      onMove: function (x, y, done) {
        var c = coords([x, y], s.v1, s.v2);
        if (c) { s.c1 = c[0]; s.c2 = c[1]; trail = []; }
        draw(); if (done) report();
      } });

    function line(d, cls, part) {
      var k = 12 / norm(d);
      return svgEl('line', { x1: P.map.sx(-k * d[0]), y1: P.map.sy(-k * d[1]), x2: P.map.sx(k * d[0]), y2: P.map.sy(k * d[1]), 'class': cls, 'data-part': part });
    }
    function spanMarkup(r) {
      if (r === 2) return svgEl('rect', { x: 0, y: 0, width: P.w, height: P.h, 'class': 'pl-span', 'data-part': 'span' });
      if (r === 0) return P.dot(0, 0, 6, 'pl-span-dot', 'span');
      return line(norm(s.v1) > 1e-9 ? s.v1 : s.v2, 'pl-span-line', 'span');
    }

    function draw() {
      var three = s.mode === '3d';
      P.svg.style.display = three ? 'none' : '';
      P3.svg.style.display = three ? '' : 'none';
      sl.yaw.parentNode.hidden = sl.pitch.parentNode.hidden = !three;
      var r = rank2(s.v1, s.v2), a = [s.c1 * s.v1[0], s.c1 * s.v1[1]], sum = combo(s.c1, s.c2, s.v1, s.v2);
      api.values({ sx: sum[0], sy: sum[1], c1: s.c1, c2: s.c2 });
      hs.set(sum[0], sum[1]);
      hs.show(!three && r === 2);
      if (three) { draw3(); return; }
      var g = P.gridMarkup(null, 1, 'pl-std') + P.axes();
      if (s.basis && r === 2) g += P.gridMarkup([s.v1[0], s.v2[0], s.v1[1], s.v2[1]], 1, 'pl-moved');
      P.grid.innerHTML = g;
      var h = s.paint ? spanMarkup(r) : '';
      h += trail.map(function (q) { return P.dot(q[0], q[1], 2.2, 'pl-trail'); }).join('');
      h += P.arrow(0, 0, s.v1[0], s.v1[1], 'is-q is-faint', 'v1') + P.arrow(0, 0, s.v2[0], s.v2[1], 'is-k is-faint', 'v2');
      h += P.arrow(0, 0, a[0], a[1], 'is-q', 'v1') + P.arrow(a[0], a[1], sum[0], sum[1], 'is-k', 'v2');
      h += P.arrow(0, 0, sum[0], sum[1], 'is-o', 'sum');
      if (s.showU) {
        var pr = proj(s.u, s.v1);
        if (pr) {
          h += line(s.v1, 'pl-line is-q is-faint');
          h += svgEl('line', { x1: P.map.sx(s.u[0]), y1: P.map.sy(s.u[1]), x2: P.map.sx(pr[0]), y2: P.map.sy(pr[1]), 'class': 'pl-dash is-o', 'data-part': 'shadow' });
          h += P.arrow(0, 0, pr[0], pr[1], 'is-o', 'shadow');
        }
        h += P.arrow(0, 0, s.u[0], s.u[1], 'is-v', 'u');
      }
      P.plot.innerHTML = h;
    }

    function draw3() {
      function sp(p) { return project3(p, s.yaw, s.pitch); }
      function at(c1, c2) { return [c1 * A3[0] + c2 * B3[0], c1 * A3[1] + c2 * B3[1], c1 * A3[2] + c2 * B3[2]]; }
      var corners = [[-1.1, -1.1], [1.1, -1.1], [1.1, 1.1], [-1.1, 1.1]].map(function (c) { return sp(at(c[0], c[1])); });
      var h = '<polygon class="pl-plane3" data-part="plane3" points="' + P3.pts(corners) + '"/>';
      [[3, 0, 0], [0, 3, 0], [0, 0, 3]].forEach(function (e) { var q = sp(e); h += P3.arrow(0, 0, q[0], q[1], 'is-faint'); });
      var a = sp(A3), b = sp(B3);
      h += P3.arrow(0, 0, a[0], a[1], 'is-q', 'a3') + P3.arrow(0, 0, b[0], b[1], 'is-k', 'b3');
      P3.plot.innerHTML = h;
    }

    function press(act, on) { ctl.querySelector('[data-act="' + act + '"]').setAttribute('aria-pressed', on ? 'true' : 'false'); }
    function sync() {
      hv1.set(s.v1[0], s.v1[1]); hv2.set(s.v2[0], s.v2[1]); hu.set(s.u[0], s.u[1]);
      hv1.show(s.mode === '2d'); hv2.show(s.mode === '2d'); hu.show(s.mode === '2d' && s.showU);
      sl.yaw.value = s.yaw; sl.pitch.value = s.pitch;
      press('basis', s.basis); press('u', s.showU); press('3d', s.mode === '3d');
    }
    function report() {
      if (s.mode === '3d') {
        api.say('The 2 arrows in 3D ' + (rank3(A3, B3) === 2 ? 'lie on different lines, so they span a plane through the origin.' : 'share a line.'));
        return;
      }
      var r = rank2(s.v1, s.v2), sum = combo(s.c1, s.c2, s.v1, s.v2);
      var span = r === 2 ? 'They lie on different lines, so they span the whole plane.' :
        r === 1 ? 'They lie on 1 line, so they span only that line.' : 'Both are 0, so they span only the origin.';
      api.say('v1 is (' + fmt(s.v1[0], 1) + ', ' + fmt(s.v1[1], 1) + ') and v2 is (' + fmt(s.v2[0], 1) + ', ' + fmt(s.v2[1], 1) + '). ' +
        span + ' The combination lands at (' + fmt(sum[0]) + ', ' + fmt(sum[1]) + ').');
    }

    /* Move to a guide page's state: arrows and stretches glide, switches flip at once. */
    function goTo(target) {
      var keys = ['v1', 'v2', 'c1', 'c2', 'u'], from = {}, to = {};
      keys.forEach(function (k) { from[k] = s[k]; to[k] = k in target ? target[k] : s[k]; });
      ['paint', 'basis', 'showU', 'mode'].forEach(function (k) { if (k in target) s[k] = target[k]; });
      if (!s.paint) trail = [];
      api.animate(from, to, 700, function (st) {
        keys.forEach(function (k) { s[k] = st[k]; });
        sync(); draw();
      }, report);
    }

    /* Sweep many stretches and leave a dot at each tip. */
    function paint() {
      trail = []; s.paint = false; s.mode = '2d';
      api.animate({ f: 0 }, { f: 1 }, 1600, function (st) {
        var n = Math.round(st.f * 180);
        while (trail.length < n) {
          var i = trail.length;
          trail.push(combo(3.2 * Math.sin(i * 0.37), 3.2 * Math.cos(i * 0.23), s.v1, s.v2));
        }
        if (st.f >= 1) s.paint = true;
        sync(); draw();
      }, report);
    }

    function table(rows) {
      return '<table class="xp-table lab-table"><tbody>' + rows.map(function (r) {
        return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>';
      }).join('') + '</tbody></table>';
    }
    function zoomCoords(btn) {
      var p = combo(s.c1, s.c2, s.v1, s.v2), d = det2(s.v1, s.v2), c = coords(p, s.v1, s.v2);
      var rows = [
        ['The point (X, Y) on the square grid', '(' + fmt(p[0]) + ', ' + fmt(p[1]) + ')'],
        [(''+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-0", undefined, true)+''), fmt(s.v1[0]) + ' × ' + fmt(s.v2[1]) + ' − ' + fmt(s.v1[1]) + ' × ' + fmt(s.v2[0]) + ' = ' + fmt(d)]
      ];
      if (c) {
        rows.push([(''+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-1", undefined, true)+''), '(' + fmt(p[0]) + ' × ' + fmt(s.v2[1]) + ' − ' + fmt(p[1]) + ' × ' + fmt(s.v2[0]) + ') ÷ ' + fmt(d) + ' = ' + fmt(c[0])]);
        rows.push([(''+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-2", undefined, true)+''), '(' + fmt(s.v1[0]) + ' × ' + fmt(p[1]) + ' − ' + fmt(s.v1[1]) + ' × ' + fmt(p[0]) + ') ÷ ' + fmt(d) + ' = ' + fmt(c[1])]);
      }
      dlg.open('Coordinates in both bases', ('<p>Here '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+' = ('+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-12", undefined, true)+', '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-14", undefined, true)+') and '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-7", undefined, true)+' = ('+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-13", undefined, true)+', '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-15", undefined, true)+').</p>') + table(rows) + (c ?
        ('<p>In the basis '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+', '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-7", undefined, true)+', the same point is (') + fmt(c[0]) + ', ' + fmt(c[1]) + ').</p>' :
        ('<p>The determinant is 0, so '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+' and '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-7", undefined, true)+' share a line. They are no basis, and coordinates in them are not unique.</p>')), btn);
    }
    function zoomDot(btn) {
      var d = dot(s.u, s.v1), nu = norm(s.u), nv = norm(s.v1), th = angle(s.u, s.v1);
      var rows = [
        [(''+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-3", undefined, true)+''), fmt(s.u[0]) + ' × ' + fmt(s.v1[0]) + ' + ' + fmt(s.u[1]) + ' × ' + fmt(s.v1[1]) + ' = ' + fmt(d)],
        ['|u|', fmt(nu)], [('|'+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+'|'), fmt(nv)]
      ];
      if (th !== null) {
        rows.push([(''+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-4", undefined, true)+''), fmt(d / (nu * nv), 3)]);
        rows.push(['θ', fmt(th * 180 / Math.PI, 1) + '°']);
        rows.push([('Shadow length, '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-5", undefined, true)+''), fmt(d / nv)]);
      }
      dlg.open('Dot product, worked', ('<p>Here u = ('+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-10", undefined, true)+', '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-11", undefined, true)+') and '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+' = ('+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-12", undefined, true)+', '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-14", undefined, true)+').</p>') + table(rows) +
        (th === null ? '<p>One of the arrows has length 0, so it has no direction and no angle.</p>' : ''), btn);
    }

    ctl.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-k');
      if (!k) return;
      s[k] = +e.target.value;
      draw();
    });
    ctl.addEventListener('change', report);
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act'), z = b.getAttribute('data-zoom');
      if (z === 'coords') { zoomCoords(b); return; }
      if (z === 'dot') { zoomDot(b); return; }
      if (act === 'paint') { paint(); return; }
      if (act === 'basis') s.basis = !s.basis;
      else if (act === 'u') { s.showU = !s.showU; s.mode = '2d'; }
      else if (act === '3d') s.mode = s.mode === '3d' ? '2d' : '3d';
      else if (b.hasAttribute('data-reset')) { api.interrupt(); s = JSON.parse(JSON.stringify(START)); trail = []; }
      sync(); draw(); report();
    });

    var PAGES = [
      { t: '2 arrows', parts: ['v1', 'v2'], state: { v1: [2, 1], v2: [-1, 1.5], c1: 1, c2: 1, paint: false, basis: false, showU: false, mode: '2d' },
        body: ('<p>Start with <b class="is-q">'+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+'</b> = (2, 1) and <b class="is-k">'+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-7", undefined, true)+'</b> = (−1, 1.5). Drag either tip to change its direction and length.</p>') },
      { t: 'Add them nose to tail', parts: ['v1', 'v2', 'sum'], state: { c1: 1, c2: 1 },
        body: ('<p>Put the tail of <b class="is-k">'+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-7", undefined, true)+'</b> on the tip of <b class="is-q">'+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+'</b>. The far end is <b class="is-o">'+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+' + '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-7", undefined, true)+'</b> = (1, 2.5).</p>') },
      { t: 'Stretch before you add', parts: ['v1', 'v2', 'sum'], state: { c1: 1.5, c2: -1 },
        body: ('<p>Scale each arrow by '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-8", undefined, true)+' or '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-9", undefined, true)+', then add them to form a linear combination. Drag <b class="is-o">the result</b> to change both weights; a negative weight reverses its arrow.</p>') },
      { t: 'Paint the span', parts: ['span', 'sum'], state: { c1: 1, c2: 1, paint: true },
        body: ('<p>Press <b>Paint the span</b> to sweep many choices of '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-8", undefined, true)+' and '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-9", undefined, true)+'. With 2 arrows on different lines, these combinations reach any point in the plane.</p>') },
      { t: 'Make them parallel', parts: ['span', 'v1', 'v2'], state: { v2: [-2, -1], c1: 1, c2: 0.5, paint: true },
        body: ('<p>Here, <b class="is-k">'+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-7", undefined, true)+'</b> = −<b class="is-q">'+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+'</b>, so 1 arrow is a multiple of the other. Such arrows are dependent, and their weighted sums stay on 1 line.</p>') },
      { t: 'Same point, new coordinates', parts: ['sum', 'v1', 'v2'], state: { v2: [-1, 1.5], c1: 1, c2: 1, paint: false, basis: true },
        body: ('<p>On the square grid, the tip sits at (1, 2.5). On the grid built from <b class="is-q">'+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+'</b> and <b class="is-k">'+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-7", undefined, true)+'</b>, the same point is (1, 1).</p>') },
      { t: 'Length and angle', parts: ['u', 'shadow', 'v1'], state: { basis: false, showU: true },
        body: ('<p>Here, <b class="is-v">u</b> · <b class="is-q">'+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+'</b> = |u| |'+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+'| cos θ. Drag u to change its <b class="is-o">shadow</b> on '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-6", undefined, true)+', whose signed length is '+window.InterviewDisplayMath.html("lab/vectors-and-spaces/worked-5", undefined, true)+'.</p>') },
      { t: 'In 3 dimensions', parts: ['a3', 'b3', 'plane3'], state: { showU: false, mode: '3d' },
        body: '<p>In 3D, 2 arrows on different lines span a flat plane through the origin. Turn and tilt to see it edge on.</p>' }
    ];
    sync(); draw();
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
