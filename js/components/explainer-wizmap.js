/* ════════════════════════════════════════════════════════
   An embedding map on /embedding/, after WizMap (Wang, Hohman and Chau,
   ACL 2023 demo; Polo Club of Data Science, MIT).

   The data is WizMap's own ACL Abstracts map: a sample of the papers at their
   UMAP positions, the density WizMap estimated from all 63,213 of them, and
   the topic labels it summarised for each tile at 2 zoom levels. This file
   draws it: contours by marching squares, labels placed without overlap for
   the current zoom, search and a year filter.
   ════════════════════════════════════════════════════════ */
(function () {
  var host = document.querySelector('[data-xp="wizmap"]');
  if (!host || !window.XP) return;
  var esc = XP.esc;

  var D, cv, ctx, tipper, W = 0, H = 0;
  var V = { k: 1, tx: 0, ty: 0 };
  var S = { q: '', year: 2022, fromYear: 1957, contours: true, points: true, labels: true, focus: '' };
  var iso = [];

  var PAGES = [
    { t: 'Every dot is a paper', parts: [], focus: '', body: '<p>Each paper’s abstract was turned into an embedding, then UMAP squeezed those vectors onto 2 dimensions. Papers about similar things land near each other. This is a sample of 6,000 of the 63,213 abstracts WizMap mapped.</p>' },
    { t: 'Where papers crowd', parts: [], focus: 'contours', body: '<p>The contours trace the density of all 63,213 papers. Peaks are areas with many papers; the gaps between them hold few.</p>' },
    { t: 'Labels that change with zoom', parts: [], focus: 'labels', body: '<p>Each label summarises the papers in one tile of the map by its most distinctive words. Scroll or pinch to zoom in, and labels for smaller tiles appear.</p>' },
    { t: 'Search the map', parts: ['search'], focus: 'search', body: '<p>Type a word into <b>Search</b>. Matching papers light up, and you can see whether a word belongs to one region or is spread across many.</p>' },
    { t: 'Watch the field move', parts: ['time'], focus: 'time', body: '<p>Drag the <b>year</b> slider. Early papers cluster in a few regions; new regions appear as the field changes. Positions stay fixed because the map was built once from all years.</p>' },
    { t: 'What a map like this hides', parts: [], focus: '', body: '<p>UMAP keeps neighbours close but distorts large distances. 2 clusters far apart on the map may be close in the embedding, so compare papers within a neighbourhood.</p>' }
  ];

  /* Data to screen: one uniform scale fits the map in the canvas, centred,
     then the pan and zoom of the view apply on top. */
  function fit() {
    var B = D.view, xr = B[1] - B[0], yr = B[3] - B[2], s0 = Math.min(W / xr, H / yr);
    return { s0: s0, ox: (W - xr * s0) / 2 - (B[0] - D.xRange[0]) * s0, oy: (H - yr * s0) / 2 - (D.yRange[1] - B[3]) * s0 };
  }
  function sx(x) { var F = fit(); return (F.ox + (x - D.xRange[0]) * F.s0) * V.k + V.tx; }
  function sy(y) { var F = fit(); return (F.oy + (D.yRange[1] - y) * F.s0) * V.k + V.ty; }
  function invx(px) { var F = fit(); return D.xRange[0] + ((px - V.tx) / V.k - F.ox) / F.s0; }
  function invy(py) { var F = fit(); return D.yRange[1] - ((py - V.ty) / V.k - F.oy) / F.s0; }

  /* Marching squares on the density grid: line segments in data units for
     one iso level. Grid rows run along y from yRange[0], columns along x. */
  function contour(level) {
    var G = D.density, n = G.length, m = G[0].length, segs = [];
    var dx = (D.xRange[1] - D.xRange[0]) / m, dy = (D.yRange[1] - D.yRange[0]) / n;
    function P(i, j) { return [D.xRange[0] + (j + 0.5) * dx, D.yRange[0] + (i + 0.5) * dy]; }
    function lerp(a, b, va, vb) { var t = (level - va) / (vb - va); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
    for (var i = 0; i < n - 1; i++) {
      for (var j = 0; j < m - 1; j++) {
        var v0 = G[i][j], v1 = G[i][j + 1], v2 = G[i + 1][j + 1], v3 = G[i + 1][j];
        var c = (v0 > level ? 1 : 0) | (v1 > level ? 2 : 0) | (v2 > level ? 4 : 0) | (v3 > level ? 8 : 0);
        if (c === 0 || c === 15) continue;
        var p0 = P(i, j), p1 = P(i, j + 1), p2 = P(i + 1, j + 1), p3 = P(i + 1, j);
        var e = { b: function () { return lerp(p0, p1, v0, v1); }, r: function () { return lerp(p1, p2, v1, v2); },
          t: function () { return lerp(p3, p2, v3, v2); }, l: function () { return lerp(p0, p3, v0, v3); } };
        var CASES = { 1: ['l', 'b'], 2: ['b', 'r'], 3: ['l', 'r'], 4: ['r', 't'], 5: ['l', 't', 'b', 'r'], 6: ['b', 't'], 7: ['l', 't'],
          8: ['t', 'l'], 9: ['t', 'b'], 10: ['t', 'r', 'b', 'l'], 11: ['t', 'r'], 12: ['r', 'l'], 13: ['r', 'b'], 14: ['b', 'l'] };
        var cs = CASES[c];
        for (var k = 0; k < cs.length; k += 2) segs.push([e[cs[k]](), e[cs[k + 1]]()]);
      }
    }
    return segs;
  }

  function colours() {
    var cs = getComputedStyle(host);
    return { dot: cs.getPropertyValue('--tf-up').trim(), hit: cs.getPropertyValue('--tf-down').trim(), text: cs.color, muted: cs.getPropertyValue('--muted').trim(), bg: cs.getPropertyValue('--bg').trim() };
  }

  function visible(p) { return p[2] >= S.fromYear && p[2] <= S.year; }
  function match(p) { return S.q && p[3].indexOf(S.q) >= 0; }

  function draw() {
    if (!cv) return;
    W = cv.clientWidth; H = cv.clientHeight;
    var dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var C = colours(), f = S.focus;

    if (S.contours) {
      ctx.strokeStyle = C.muted;
      iso.forEach(function (lv, li) {
        ctx.globalAlpha = (f && f !== 'contours' ? 0.12 : 0.28) + li * 0.06;
        ctx.lineWidth = f === 'contours' ? 1.4 : 1;
        ctx.beginPath();
        lv.segs.forEach(function (s) { ctx.moveTo(sx(s[0][0]), sy(s[0][1])); ctx.lineTo(sx(s[1][0]), sy(s[1][1])); });
        ctx.stroke();
      });
    }

    if (S.points) {
      var r = Math.min(3.4, 1.8 + V.k * 0.3), hits = 0;
      D.points.forEach(function (p) {
        if (!visible(p)) return;
        var hit = match(p);
        if (hit) { hits++; return; }
        ctx.globalAlpha = (S.q || f === 'labels' || f === 'contours' ? 0.2 : 0.7);
        ctx.fillStyle = C.dot;
        ctx.fillRect(sx(p[0]) - r / 2, sy(p[1]) - r / 2, r, r);
      });
      if (S.q) {
        ctx.globalAlpha = 0.95; ctx.fillStyle = C.hit;
        D.points.forEach(function (p) {
          if (visible(p) && match(p)) { ctx.beginPath(); ctx.arc(sx(p[0]), sy(p[1]), r + 2, 0, 2 * Math.PI); ctx.fill(); }
        });
      }
      host.querySelector('.xp-map-count').textContent = S.q
        ? hits.toLocaleString() + ' of the sampled papers mention “' + S.q + '”'
        : D.points.filter(visible).length.toLocaleString() + ' sampled papers from ' + S.fromYear + ' to ' + S.year;
    }

    if (S.labels) {
      /* Coarse labels when zoomed out, finer ones zoomed in; greedy placement
         skips any label that would collide with one already drawn. */
      var lvl = V.k < 2.2 ? '6' : '7', placed = [];
      ctx.globalAlpha = f && f !== 'labels' ? 0.35 : 1;
      ctx.font = '650 ' + (lvl === '6' ? 13 : 12) + 'px system-ui, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var dens = D.topics[lvl].map(function (t) {
        var gi = Math.floor((t[1] - D.yRange[0]) / (D.yRange[1] - D.yRange[0]) * D.density.length);
        var gj = Math.floor((t[0] - D.xRange[0]) / (D.xRange[1] - D.xRange[0]) * D.density[0].length);
        var v = (D.density[gi] || [])[gj] || 0;
        return { t: t, v: v };
      }).sort(function (a, b) { return b.v - a.v; });
      var cap = Math.round(16 * V.k * V.k), pad = 12;
      dens.forEach(function (o) {
        if (placed.length >= cap) return;
        var t = o.t, x = sx(t[0]), y = sy(t[1]);
        if (x < 20 || x > W - 20 || y < 12 || y > H - 12) return;
        var words = t[2].split('-').slice(0, 2).join(' '), w = ctx.measureText(words).width + 8, h = 16;
        var box = [x - w / 2, y - h / 2, x + w / 2, y + h / 2];
        if (placed.some(function (b) { return !(box[2] + pad < b[0] || box[0] - pad > b[2] || box[3] + pad < b[1] || box[1] - pad > b[3]); })) return;
        placed.push(box);
        ctx.fillStyle = C.bg; ctx.globalAlpha = f && f !== 'labels' ? 0.3 : 0.75;
        ctx.fillRect(box[0], box[1], w, h);
        ctx.globalAlpha = f && f !== 'labels' ? 0.35 : 1;
        ctx.fillStyle = C.text;
        ctx.fillText(words, x, y + 0.5);
      });
    }
    ctx.globalAlpha = 1;
  }

  function nearest(px, py) {
    var best = null, bd = 64;
    D.points.forEach(function (p) {
      if (!visible(p)) return;
      var d = (sx(p[0]) - px) * (sx(p[0]) - px) + (sy(p[1]) - py) * (sy(p[1]) - py);
      if (d < bd) { bd = d; best = p; }
    });
    return best;
  }

  function zoomAt(px, py, f) {
    var k = Math.max(1, Math.min(14, V.k * f));
    var x = invx(px), y = invy(py);
    V.k = k;
    V.tx += px - sx(x);
    V.ty += py - sy(y);
    draw();
  }

  function mount() {
    /* WizMap pads its ranges; open on where the papers actually are. */
    function pct(a, q) { var b = a.slice().sort(function (x, y) { return x - y; }); return b[Math.floor(q * (b.length - 1))]; }
    var xs = D.points.map(function (p) { return p[0]; }), ys = D.points.map(function (p) { return p[1]; });
    var bx = [pct(xs, 0.005), pct(xs, 0.995)], by = [pct(ys, 0.005), pct(ys, 0.995)], mx = (bx[1] - bx[0]) * 0.05, my = (by[1] - by[0]) * 0.05;
    D.view = [bx[0] - mx, bx[1] + mx, by[0] - my, by[1] + my];
    var years = D.points.map(function (p) { return p[2]; });
    S.fromYear = Math.min.apply(null, years); S.year = Math.max.apply(null, years);
    var levels = [];
    D.density.forEach(function (row) { row.forEach(function (v) { if (v > 0) levels.push(v); }); });
    levels.sort(function (a, b) { return a - b; });
    iso = [0.55, 0.75, 0.88, 0.95].map(function (q) { return { segs: contour(levels[Math.floor(q * (levels.length - 1))]) }; });

    host.innerHTML = '<div class="xp-toolbar">' +
      '<label class="xp-field" data-part="search"><span>Search</span><input type="search" data-q placeholder="e.g. translation, parsing, bias" aria-label="Search paper titles"></label>' +
      '<label class="xp-field is-stack" data-part="time"><span>Up to year <output>' + S.year + '</output></span><input type="range" min="' + S.fromYear + '" max="' + S.year + '" value="' + S.year + '" data-year></label>' +
      '<div class="xp-toggles"><label><input type="checkbox" data-t="contours" checked> Contours</label><label><input type="checkbox" data-t="points" checked> Papers</label><label><input type="checkbox" data-t="labels" checked> Topics</label></div>' +
      '<div class="xp-map-zoom"><button type="button" data-zoom="1.5" aria-label="Zoom in">+</button><button type="button" data-zoom="0.66" aria-label="Zoom out">−</button><button type="button" data-zoom="0" aria-label="Reset the view">↺</button></div>' +
      '</div>' +
      '<div class="xp-stage"><canvas class="xp-map" tabindex="0" role="img" aria-label="Map of ACL paper abstracts; drag to pan, scroll to zoom, arrow keys to pan, plus and minus to zoom"></canvas>' +
      '<p class="xp-note xp-map-count" aria-live="polite"></p></div>';
    cv = host.querySelector('.xp-map');
    var st = host.querySelector('.xp-stage');
    tipper = XP.tip(st);
    XP.guide(st, PAGES, function (p) {
      S.focus = p ? p.focus : '';
      XP.highlight(host.querySelector('.xp-toolbar'), p ? p.parts : []);
      draw();
    });

    var drag = null;
    cv.addEventListener('wheel', function (e) {
      e.preventDefault();
      var r = cv.getBoundingClientRect();
      zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.15 : 1 / 1.15);
    }, { passive: false });
    cv.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY, tx: V.tx, ty: V.ty }; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect();
      if (drag) { V.tx = drag.tx + e.clientX - drag.x; V.ty = drag.ty + e.clientY - drag.y; draw(); tipper.hide(); return; }
      var p = nearest(e.clientX - r.left, e.clientY - r.top);
      if (p) tipper.show('<b>' + esc(p[3]) + '</b><br>' + p[2], e); else tipper.hide();
    });
    cv.addEventListener('pointerup', function () { drag = null; });
    cv.addEventListener('pointerleave', function () { tipper.hide(); });
    cv.addEventListener('keydown', function (e) {
      var step = 40, done = true;
      if (e.key === 'ArrowLeft') V.tx += step; else if (e.key === 'ArrowRight') V.tx -= step;
      else if (e.key === 'ArrowUp') V.ty += step; else if (e.key === 'ArrowDown') V.ty -= step;
      else if (e.key === '+' || e.key === '=') zoomAt(W / 2, H / 2, 1.3);
      else if (e.key === '-') zoomAt(W / 2, H / 2, 1 / 1.3);
      else done = false;
      if (done) { e.preventDefault(); draw(); }
    });
    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-zoom]');
      if (!b) return;
      var f = +b.dataset.zoom;
      if (!f) { V = { k: 1, tx: 0, ty: 0 }; draw(); } else zoomAt(W / 2, H / 2, f);
    });
    host.addEventListener('input', function (e) {
      if (e.target.hasAttribute('data-q')) { S.q = e.target.value.trim().toLowerCase(); draw(); }
      if (e.target.hasAttribute('data-year')) { S.year = +e.target.value; e.target.closest('label').querySelector('output').textContent = S.year; draw(); }
    });
    host.addEventListener('change', function (e) {
      var t = e.target.dataset.t;
      if (t) { S[t] = e.target.checked; draw(); }
    });
    window.addEventListener('resize', draw);
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    draw();
  }

  host.innerHTML = '<p class="xp-note">Loading the map…</p>';
  fetch(host.dataset.src).then(function (r) { return r.json(); }).then(function (d) { D = d; mount(); })
    .catch(function () { host.innerHTML = '<p class="xp-note">The map could not be loaded. The rest of the page still works.</p>'; });
})();
