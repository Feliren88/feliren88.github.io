/* ════════════════════════════════════════════════════════
   CNN explainer on /computer-vision/, after CNN Explainer (Wang et al., 2020;
   Polo Club of Data Science, MIT).

   Every feature map is computed on the page by XP.tinyvgg from the trained
   weights, so the picture is the real network's activations. Layout follows
   the original overview: one column per layer, one tile per channel, lines
   for what feeds what, a guide card, hover for values and a zoom dialog that
   shows how one map is made.
   ════════════════════════════════════════════════════════ */
(function () {
  var host = document.querySelector('[data-xp="cnn"]');
  if (!host || !window.XP || !XP.tinyvgg) return;
  var TV = XP.tinyvgg, esc = XP.esc;

  var COLS = [
    { k: 'input', t: 'Input', kind: 'input' },
    { k: 'conv_1_1', t: 'conv_1_1', kind: 'conv' },
    { k: 'relu_1_1', t: 'relu_1_1', kind: 'relu' },
    { k: 'conv_1_2', t: 'conv_1_2', kind: 'conv' },
    { k: 'relu_1_2', t: 'relu_1_2', kind: 'relu' },
    { k: 'max_pool_1', t: 'max_pool_1', kind: 'pool' },
    { k: 'conv_2_1', t: 'conv_2_1', kind: 'conv' },
    { k: 'relu_2_1', t: 'relu_2_1', kind: 'relu' },
    { k: 'conv_2_2', t: 'conv_2_2', kind: 'conv' },
    { k: 'relu_2_2', t: 'relu_2_2', kind: 'relu' },
    { k: 'max_pool_2', t: 'max_pool_2', kind: 'pool' },
    { k: 'output', t: 'Output', kind: 'output' }
  ];
  var PARTS = { input: 'input', conv: 'conv', relu: 'relu', pool: 'pool', output: 'output' };

  var PAGES = [
    { t: 'What you are looking at', parts: [], body: '<p>A small convolutional network, Tiny VGG, classifying a 64 by 64 image into 10 classes. Each column is a layer and each square is one feature map, computed on this page from the trained weights.</p><p>Hover over a map to trace what feeds it. Select a map to see how it is made.</p>' },
    { t: 'The input is 3 grids of numbers', parts: ['input'], body: '<p>A colour image is 3 channels, red, green and blue, each a 64 by 64 grid of values from 0 to 1.</p>' },
    { t: 'A convolution slides small filters', parts: ['conv'], body: '<p>Each map in a convolution layer comes from 1 filter per input channel. A 3 by 3 filter slides across its channel, the products are summed across all channels, and a bias is added. 10 filters give 10 maps.</p><p>Blue is positive, orange is negative.</p>' },
    { t: 'ReLU keeps the positive part', parts: ['relu'], body: '<p>ReLU replaces every negative value with 0. Without it, stacked convolutions would collapse into one linear filter, and the network could not learn curved decision boundaries.</p>' },
    { t: 'Deeper maps see more', parts: ['conv', 'relu'], body: '<p>Each layer reads 3 by 3 patches of the one before, so a map deep in the network responds to a larger area of the image. Early maps respond to edges and colours; later maps combine them into larger patterns.</p>' },
    { t: 'Max pooling shrinks the maps', parts: ['pool'], body: '<p>Pooling keeps the largest value in each 2 by 2 block, halving the width and height. It cuts the computation and makes the response less sensitive to exactly where a feature sits.</p>' },
    { t: 'From maps to a class', parts: ['output'], body: '<p>The last 10 maps of 13 by 13 are flattened into 1,690 numbers. A dense layer turns them into 10 scores, and softmax turns the scores into probabilities that sum to 1.</p>' },
    { t: 'Try another image', parts: ['input', 'output'], body: '<p>Pick another sample above, or upload your own. It is shrunk to 64 by 64 and every map recomputes. An image outside the 10 classes still gets one of the 10 labels, because softmax always chooses among them.</p>' }
  ];

  var model, L, rgb, S = { sample: 6, hover: null };
  var tipper, dlg, colours;

  function readColours() {
    var probe = document.createElement('span');
    host.appendChild(probe);
    function rgbOf(v) { probe.style.color = 'var(' + v + ')'; return getComputedStyle(probe).color.match(/\d+/g).slice(0, 3).map(Number); }
    colours = { up: rgbOf('--tf-up'), down: rgbOf('--tf-down'), bg: rgbOf('--bg') };
    probe.remove();
  }

  /* Paint one channel into a canvas: diverging around 0, scaled by `max`. */
  function paint(cv, vals, w, h, max, channelRGB) {
    cv.width = w; cv.height = h;
    var ctx = cv.getContext('2d'), img = ctx.createImageData(w, h), bg = colours.bg;
    for (var i = 0; i < vals.length; i++) {
      var v = vals[i], a, c;
      if (channelRGB) { a = v; c = channelRGB; }
      else { a = Math.min(1, Math.abs(v) / (max || 1)); c = v >= 0 ? colours.up : colours.down; }
      img.data[i * 4] = bg[0] + (c[0] - bg[0]) * a;
      img.data[i * 4 + 1] = bg[1] + (c[1] - bg[1]) * a;
      img.data[i * 4 + 2] = bg[2] + (c[2] - bg[2]) * a;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }
  function layerMax(x) {
    var m = 0;
    for (var i = 0; i < x.d.length; i++) m = Math.max(m, Math.abs(x.d[i]));
    return m;
  }

  function toolbar() {
    return '<div class="xp-toolbar">' +
      '<div class="xp-thumbs" role="group" aria-label="Sample images">' + model.samples.map(function (s, i) {
        return '<button type="button" data-sample="' + i + '" aria-pressed="' + (i === S.sample) + '" aria-label="' + esc(model.classes[i]) + '"><canvas width="64" height="64"></canvas></button>';
      }).join('') + '</div>' +
      '<label class="xp-upload"><input type="file" accept="image/*" data-upload> Upload an image</label>' +
      '</div>';
  }

  function stage() {
    var cols = COLS.map(function (col, ci) {
      var inner;
      if (col.kind === 'output') {
        inner = model.classes.map(function (c, k) {
          return '<div class="xp-cnn-out" data-out="' + k + '"><span>' + esc(c) + '</span><i><b></b></i><em></em></div>';
        }).join('');
      } else {
        var n = col.kind === 'input' ? 3 : 10;
        inner = Array.apply(null, Array(n)).map(function (_, k) {
          return '<button type="button" class="xp-map" data-col="' + ci + '" data-ch="' + k + '" aria-label="' + esc(col.t) + ' map ' + (k + 1) + '"><canvas></canvas></button>';
        }).join('');
      }
      return '<div class="xp-cnn-col is-' + col.kind + '" data-part="' + PARTS[col.kind] + '" data-colidx="' + ci + '">' +
        '<p class="xp-cnn-t">' + esc(col.t) + '</p><p class="xp-cnn-s"></p>' + inner + '</div>';
    }).join('');
    return '<div class="xp-stage"><div class="xp-scroll"><div class="xp-cnn"><svg class="xp-cnn-edges" aria-hidden="true"></svg>' + cols +
      '</div></div></div>';
  }

  function shapeOf(ci) {
    var col = COLS[ci];
    if (col.kind === 'output') return '[10]';
    var x = L[col.k];
    return '[' + x.h + ', ' + x.w + ', ' + x.c + ']';
  }

  function drawMaps() {
    COLS.forEach(function (col, ci) {
      var el = host.querySelector('[data-colidx="' + ci + '"]');
      el.querySelector('.xp-cnn-s').textContent = shapeOf(ci);
      if (col.kind === 'output') {
        var best = L.probs.indexOf(Math.max.apply(null, L.probs));
        Array.prototype.forEach.call(el.querySelectorAll('.xp-cnn-out'), function (row, k) {
          row.classList.toggle('is-top', k === best);
          row.querySelector('b').style.width = (L.probs[k] * 100).toFixed(1) + '%';
          row.querySelector('em').textContent = (L.probs[k] * 100).toFixed(1) + '%';
        });
        return;
      }
      var x = L[col.k], max = layerMax(x);
      Array.prototype.forEach.call(el.querySelectorAll('canvas'), function (cv, k) {
        var chRGB = col.kind === 'input' ? [[220, 60, 60], [60, 170, 90], [60, 110, 220]][k] : null;
        paint(cv, TV.channel(x, k), x.w, x.h, max, chRGB);
      });
    });
    drawEdges();
  }

  /* Lines from every map to the maps it feeds: all pairs into a convolution,
     one to one into ReLU and pooling, all to all into the output. */
  function drawEdges(focus) {
    var box = host.querySelector('.xp-cnn'), svg = box.querySelector('.xp-cnn-edges');
    var B = box.getBoundingClientRect(), s = '';
    svg.setAttribute('viewBox', '0 0 ' + B.width + ' ' + B.height);
    svg.style.width = B.width + 'px'; svg.style.height = B.height + 'px';
    function pts(ci) {
      return Array.prototype.map.call(host.querySelectorAll('[data-colidx="' + ci + '"] .xp-map, [data-colidx="' + ci + '"] .xp-cnn-out'), function (el) {
        var r = el.getBoundingClientRect();
        return { l: r.left - B.left, r: r.right - B.left, y: r.top - B.top + r.height / 2 };
      });
    }
    for (var ci = 1; ci < COLS.length; ci++) {
      var a = pts(ci - 1), b = pts(ci), kind = COLS[ci].kind, pairs = [];
      if (kind === 'relu' || kind === 'pool') a.forEach(function (_, k) { pairs.push([k, k]); });
      else if (kind === 'output') a.forEach(function (_, i) { pairs.push([i, -1]); });
      else a.forEach(function (_, i) { b.forEach(function (__, j) { pairs.push([i, j]); }); });
      pairs.forEach(function (p) {
        var from = a[p[0]], to = p[1] < 0 ? { l: b[0].l, y: (b[0].y + b[b.length - 1].y) / 2 } : b[p[1]];
        var on = focus && ((focus.col === ci && (p[1] === focus.ch || p[1] < 0)) || (focus.col === ci - 1 && p[0] === focus.ch));
        var mx = (from.r + to.l) / 2;
        s += '<path class="xp-edge' + (on ? ' is-on' : '') + '" data-part="' + PARTS[kind] + '" d="M' + from.r.toFixed(1) + ' ' + from.y.toFixed(1) +
          'C' + mx.toFixed(1) + ' ' + from.y.toFixed(1) + ' ' + mx.toFixed(1) + ' ' + to.y.toFixed(1) + ' ' + to.l.toFixed(1) + ' ' + to.y.toFixed(1) + '"/>';
      });
    }
    svg.innerHTML = s;
    box.classList.toggle('has-focus', !!focus);
  }

  function recompute() {
    L = TV.run(model, rgb);
    drawMaps();
  }

  function thumbs() {
    Array.prototype.forEach.call(host.querySelectorAll('.xp-thumbs canvas'), function (cv, i) {
      var px = TV.decode(model.samples[i].rgb), ctx = cv.getContext('2d'), img = ctx.createImageData(64, 64);
      for (var p = 0; p < 4096; p++) { img.data[p * 4] = px[p * 3]; img.data[p * 4 + 1] = px[p * 3 + 1]; img.data[p * 4 + 2] = px[p * 3 + 2]; img.data[p * 4 + 3] = 255; }
      ctx.putImageData(img, 0, 0);
    });
  }

  /* The zoom view of one map: which inputs and which kernels make it. */
  function explainMap(ci, ch, from) {
    var col = COLS[ci], x = L[col.k], html = '';
    var srcKey = COLS[ci - 1] ? COLS[ci - 1].k : null;
    if (col.kind === 'input') {
      html = '<p>The ' + ['red', 'green', 'blue'][ch] + ' channel: 64 × 64 pixel values divided by 255, so they run from 0 to 1.</p>';
    } else if (col.kind === 'conv') {
      var src = L[srcKey], k = model.W[col.k + '/kernel'], bias = model.W[col.k + '/bias'][ch], ci2 = src.c;
      html = '<p>Map ' + (ch + 1) + ' of ' + esc(col.t) + ' = the sum over ' + ci2 + ' input maps of (input map ★ its own 3 × 3 kernel), plus a bias of ' + XP.fmt(bias, 3) + '. Each kernel is shown beside its input; blue weights add, orange weights subtract.</p><div class="xp-kgrid">' +
        Array.apply(null, Array(ci2)).map(function (_, c) {
          var cells = '', km = 0;
          for (var t = 0; t < 9; t++) km = Math.max(km, Math.abs(k[t * ci2 * x.c + c * x.c + ch]));
          for (var t2 = 0; t2 < 9; t2++) {
            var v = k[t2 * ci2 * x.c + c * x.c + ch];
            cells += '<i style="' + XP.tint(v, km) + '" title="' + v.toFixed(3) + '"></i>';
          }
          return '<figure><canvas data-src="' + c + '"></canvas><span class="xp-op">★</span><span class="xp-kern">' + cells + '</span></figure>';
        }).join('') + '</div><p class="xp-note">Output ' + x.h + ' × ' + x.w + ': each 3 × 3 window without padding loses 1 pixel on every side.</p><canvas class="xp-big" data-out></canvas>';
    } else if (col.kind === 'relu') {
      html = '<p>ReLU(x) = max(0, x), applied to every value of map ' + (ch + 1) + ' of ' + esc(srcKey) + '. The orange, negative parts on the left become 0 on the right.</p><div class="xp-pair"><canvas data-before></canvas><span class="xp-op">→</span><canvas class="xp-big" data-out></canvas></div>';
    } else if (col.kind === 'pool') {
      html = '<p>Each value is the largest of a 2 × 2 block of map ' + (ch + 1) + ' of ' + esc(srcKey) + ', so ' + L[srcKey].h + ' × ' + L[srcKey].w + ' becomes ' + x.h + ' × ' + x.w + '.</p><div class="xp-pair"><canvas data-before></canvas><span class="xp-op">→</span><canvas class="xp-big" data-out></canvas></div>';
    }
    dlg.open(col.t + ', map ' + (ch + 1), html, from);
    var body = dlg.body, max = layerMax(x);
    var out = body.querySelector('[data-out]');
    if (out) paint(out, TV.channel(x, ch), x.w, x.h, max);
    var before = body.querySelector('[data-before]');
    if (before) { var s2 = L[srcKey]; paint(before, TV.channel(s2, ch), s2.w, s2.h, layerMax(s2)); }
    Array.prototype.forEach.call(body.querySelectorAll('[data-src]'), function (cv) {
      var s3 = L[srcKey], c3 = +cv.dataset.src;
      paint(cv, TV.channel(s3, c3), s3.w, s3.h, layerMax(s3), srcKey === 'input' ? [[220, 60, 60], [60, 170, 90], [60, 110, 220]][c3] : null);
    });
  }
  function explainOutput(from) {
    var order = L.probs.map(function (p, i) { return i; }).sort(function (a, b) { return L.probs[b] - L.probs[a]; });
    dlg.open('From 1,690 numbers to 10 probabilities', '<p>max_pool_2 is flattened to 1,690 numbers. The dense layer gives each class a score, its logit; softmax turns logits into probabilities.</p>' +
      '<table class="xp-table is-compact"><thead><tr><th scope="col">Class</th><th scope="col">Logit</th><th scope="col">Softmax</th></tr></thead><tbody>' +
      order.map(function (i) { return '<tr><th scope="row">' + esc(model.classes[i]) + '</th><td>' + XP.fmt(L.logits[i], 3) + '</td><td>' + (L.probs[i] * 100).toFixed(2) + '%</td></tr>'; }).join('') +
      '</tbody></table>', from);
  }

  function describe(ci, ch) {
    var col = COLS[ci];
    if (col.kind === 'output') return '<b>' + esc(model.classes[ch]) + '</b> ' + (L.probs[ch] * 100).toFixed(2) + '%';
    var x = L[col.k], v = TV.channel(x, ch), lo = Infinity, hi = -Infinity;
    for (var i = 0; i < v.length; i++) { lo = Math.min(lo, v[i]); hi = Math.max(hi, v[i]); }
    return '<b>' + esc(col.t) + '</b> map ' + (ch + 1) + '<br>' + x.h + ' × ' + x.w + ', from ' + XP.fmt(lo, 2) + ' to ' + XP.fmt(hi, 2);
  }

  function useImage(bytes) { rgb = bytes; recompute(); }

  function upload(file) {
    var img = new Image(), url = URL.createObjectURL(file);
    img.onload = function () {
      /* Centre-crop to a square, then scale to 64 x 64, as CNN Explainer does. */
      var cv = document.createElement('canvas'), ctx = cv.getContext('2d'), s = Math.min(img.width, img.height);
      cv.width = cv.height = 64;
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 64, 64);
      var d = ctx.getImageData(0, 0, 64, 64).data, bytes = new Uint8Array(64 * 64 * 3);
      for (var p = 0; p < 4096; p++) { bytes[p * 3] = d[p * 4]; bytes[p * 3 + 1] = d[p * 4 + 1]; bytes[p * 3 + 2] = d[p * 4 + 2]; }
      URL.revokeObjectURL(url);
      S.sample = -1;
      Array.prototype.forEach.call(host.querySelectorAll('[data-sample]'), function (b) { b.setAttribute('aria-pressed', 'false'); });
      useImage(bytes);
    };
    img.src = url;
  }

  function mount() {
    readColours();
    host.innerHTML = toolbar() + stage();
    thumbs();
    var st = host.querySelector('.xp-stage');
    tipper = XP.tip(st);
    dlg = XP.dialog(st);
    XP.guide(st, PAGES, function (p) { XP.highlight(host.querySelector('.xp-cnn'), p ? p.parts : []); });
    useImage(TV.decode(model.samples[S.sample].rgb));

    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-sample], .xp-map, .xp-cnn-out');
      if (!b) return;
      if (b.dataset.sample !== undefined) {
        S.sample = +b.dataset.sample;
        Array.prototype.forEach.call(host.querySelectorAll('[data-sample]'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        useImage(TV.decode(model.samples[S.sample].rgb));
      } else if (b.classList.contains('xp-map')) explainMap(+b.dataset.col, +b.dataset.ch, b);
      else explainOutput(b);
    });
    host.addEventListener('change', function (e) { if (e.target.hasAttribute('data-upload') && e.target.files[0]) upload(e.target.files[0]); });
    var box = host.querySelector('.xp-cnn');
    box.addEventListener('mouseover', function (e) {
      var m = e.target.closest('.xp-map, .xp-cnn-out');
      if (!m) return;
      var ci = m.classList.contains('xp-cnn-out') ? COLS.length - 1 : +m.dataset.col;
      var ch = m.classList.contains('xp-cnn-out') ? +m.dataset.out : +m.dataset.ch;
      drawEdges({ col: ci, ch: ch });
      tipper.show(describe(ci, ch), e);
    });
    box.addEventListener('mouseleave', function () { drawEdges(); tipper.hide(); });
    box.addEventListener('focusin', function (e) {
      var m = e.target.closest('.xp-map');
      if (m) drawEdges({ col: +m.dataset.col, ch: +m.dataset.ch });
    });
    window.addEventListener('resize', function () { drawEdges(); });
    new MutationObserver(function () { readColours(); drawMaps(); thumbs(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  host.innerHTML = '<p class="xp-note">Loading Tiny VGG…</p>';
  TV.fetchModel(host.dataset.model, host.dataset.weights).then(function (m) { model = m; mount(); })
    .catch(function () { host.innerHTML = '<p class="xp-note">The network could not be loaded. The rest of the page still works.</p>'; });
})();
