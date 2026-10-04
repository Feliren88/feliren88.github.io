/* ════════════════════════════════════════════════════════
   "What if I remove this?" on /deep-learning/, after Interactive
   Classification for Deep Learning Interpretation (Cabrera, Hohman, Lin and
   Chau, CVPR 2018 demo; Polo Club of Data Science, MIT).

   The original runs SqueezeNet with PatchMatch inpainting. This runs the
   trained Tiny VGG from CNN Explainer (XP.tinyvgg) and fills erased pixels by
   harmonic inpainting: each erased pixel is repeatedly replaced by the mean of
   its 4 neighbours until the fill settles, which is the classical diffusion
   method. The occlusion map slides a grey patch over the image and records
   how much the chosen class loses (Zeiler and Fergus, 2014).
   ════════════════════════════════════════════════════════ */
(function () {
  var host = document.querySelector('[data-xp="edit"]');
  if (!host || !window.XP || !XP.tinyvgg) return;
  var TV = XP.tinyvgg, esc = XP.esc;

  var model, orig, cur, mask, history = [], S = { sample: 5, brush: 5, target: null, occ: null };
  var tipper, busy = false;

  var PAGES = [
    { t: 'Ask the model a what-if question', parts: [], body: '<p>A trained network labels this image. Paint over a region to fill it with values from surrounding pixels. Then the network labels the edited image. A changed label shows sensitivity to that edit.</p>' },
    { t: 'Erase and compare', parts: ['image', 'scores'], body: '<p>Drag across the image to erase. The table compares the top 5 classes before and after. A large drop from a small edit means the model leaned on that region.</p>' },
    { t: 'Find the regions it relies on', parts: ['occ'], body: '<p><b>Find what matters</b> hides one 8 by 8 patch at a time, 225 positions in all, and records how much the chosen class loses. Red areas are the ones the model depends on for that class.</p>' },
    { t: 'What this can and cannot show', parts: [], body: '<p>Occlusion hides a patch and measures how much the class score falls. The patch may contain the object. Alternatively, the replacement grey square may resemble something else to the model. Compare several classes before interpreting the result.</p>' }
  ];

  function top5(probs) {
    return probs.map(function (p, i) { return i; }).sort(function (a, b) { return probs[b] - probs[a]; }).slice(0, 5);
  }

  /* Harmonic fill: erased pixels relax toward the mean of their 4 neighbours. */
  function inpaint(px, m) {
    var out = new Float32Array(px.length);
    for (var i = 0; i < px.length; i++) out[i] = px[i];
    var holes = [];
    for (var p = 0; p < 4096; p++) if (m[p]) holes.push(p);
    if (!holes.length) return px;
    /* start each hole at the mean of the known pixels, then relax */
    var mean = [0, 0, 0], n = 0;
    for (var q = 0; q < 4096; q++) if (!m[q]) { mean[0] += px[q * 3]; mean[1] += px[q * 3 + 1]; mean[2] += px[q * 3 + 2]; n++; }
    holes.forEach(function (h) { for (var c = 0; c < 3; c++) out[h * 3 + c] = n ? mean[c] / n : 128; });
    for (var it = 0; it < 400; it++) {
      holes.forEach(function (h) {
        var y = Math.floor(h / 64), x = h % 64, nb = [];
        if (y > 0) nb.push(h - 64); if (y < 63) nb.push(h + 64); if (x > 0) nb.push(h - 1); if (x < 63) nb.push(h + 1);
        for (var c = 0; c < 3; c++) {
          var s = 0;
          nb.forEach(function (k) { s += out[k * 3 + c]; });
          out[h * 3 + c] = s / nb.length;
        }
      });
    }
    var bytes = new Uint8Array(px.length);
    for (var b = 0; b < px.length; b++) bytes[b] = Math.round(out[b]);
    return bytes;
  }

  function draw(cv, px, scale, heat) {
    var ctx = cv.getContext('2d'), img = ctx.createImageData(64, 64);
    for (var p = 0; p < 4096; p++) {
      var r = px[p * 3], g = px[p * 3 + 1], b = px[p * 3 + 2];
      if (heat) {
        var a = Math.max(0, Math.min(1, heat[p])) * 0.7;
        r = r * (1 - a) + 220 * a; g = g * (1 - a) + 50 * a; b = b * (1 - a) + 40 * a;
      }
      img.data[p * 4] = r; img.data[p * 4 + 1] = g; img.data[p * 4 + 2] = b; img.data[p * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  function table(pOrig, pCur) {
    var ids = top5(pOrig), idsCur = top5(pCur);
    ids = ids.concat(idsCur.filter(function (i) { return ids.indexOf(i) < 0; })).slice(0, 6);
    return '<table class="xp-table is-compact xp-edit-t"><thead><tr><th scope="col">Class</th><th scope="col">Original</th><th scope="col">Edited</th><th scope="col">Change</th></tr></thead><tbody>' +
      ids.map(function (i) {
        var d = pCur[i] - pOrig[i];
        return '<tr' + (i === S.target ? ' class="is-target"' : '') + '><th scope="row"><button type="button" data-target="' + i + '">' + esc(model.classes[i]) + '</button></th>' +
          '<td>' + (pOrig[i] * 100).toFixed(1) + '%</td><td>' + (pCur[i] * 100).toFixed(1) + '%</td>' +
          '<td class="' + (d < -0.005 ? 'is-down' : d > 0.005 ? 'is-up' : '') + '">' + (d >= 0 ? '+' : '−') + Math.abs(d * 100).toFixed(1) + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function refresh() {
    var pO = TV.predict(model, orig), pC = TV.predict(model, cur);
    if (S.target === null) S.target = top5(pO)[0];
    draw(host.querySelector('[data-cv="orig"]'), orig);
    draw(host.querySelector('[data-cv="cur"]'), cur, 1, S.occ);
    var bestO = top5(pO)[0], bestC = top5(pC)[0];
    host.querySelector('.xp-edit-labels').innerHTML =
      '<span>Original: <b>' + esc(model.classes[bestO]) + '</b> ' + (pO[bestO] * 100).toFixed(1) + '%</span>' +
      '<span class="' + (bestC !== bestO ? 'is-changed' : '') + '">Edited: <b>' + esc(model.classes[bestC]) + '</b> ' + (pC[bestC] * 100).toFixed(1) + '%' + (bestC !== bestO ? ', the label changed' : '') + '</span>';
    host.querySelector('[data-undo]').disabled = !history.length;
    host.querySelector('[data-reset]').disabled = !history.length && !S.occ;
    host.querySelector('.xp-edit-scores').innerHTML = table(pO, pC) +
      '<p class="xp-note">Select a class to make it the target of <b>Find what matters</b>. Target: <b>' + esc(model.classes[S.target]) + '</b>.</p>';
  }

  /* Occlusion sensitivity, computed in slices so the page stays responsive. */
  function occlusion() {
    if (busy) return;
    busy = true;
    var btn = host.querySelector('[data-occ]'), P = 8, STR = 4, pos = [], base = TV.predict(model, cur)[S.target];
    for (var y = 0; y + P <= 64; y += STR) for (var x = 0; x + P <= 64; x += STR) pos.push([y, x]);
    var drop = new Float32Array(4096), hits = new Float32Array(4096), k = 0;
    function slice() {
      var stop = Math.min(pos.length, k + 12);
      for (; k < stop; k++) {
        var y = pos[k][0], x = pos[k][1], px = new Uint8Array(cur);
        for (var dy = 0; dy < P; dy++) for (var dx = 0; dx < P; dx++) {
          var q = ((y + dy) * 64 + x + dx) * 3;
          px[q] = px[q + 1] = px[q + 2] = 128;
        }
        var d = base - TV.predict(model, px)[S.target];
        for (var dy2 = 0; dy2 < P; dy2++) for (var dx2 = 0; dx2 < P; dx2++) {
          var q2 = (y + dy2) * 64 + x + dx2;
          drop[q2] += d; hits[q2] += 1;
        }
      }
      btn.textContent = 'Finding… ' + Math.round(k / pos.length * 100) + '%';
      if (k < pos.length) { setTimeout(slice, 0); return; }
      var mx = 0;
      for (var i = 0; i < 4096; i++) { drop[i] = hits[i] ? drop[i] / hits[i] : 0; mx = Math.max(mx, drop[i]); }
      S.occ = drop.map(function (v) { return mx > 0 ? Math.max(0, v) / mx : 0; });
      busy = false;
      btn.textContent = 'Find what matters';
      host.querySelector('.xp-edit-occ').textContent = mx > 0
        ? 'Red marks where hiding an 8 by 8 patch costs ' + esc(model.classes[S.target]) + ' the most, up to ' + (mx * 100).toFixed(1) + ' points.'
        : 'No patch lowers ' + esc(model.classes[S.target]) + '; hiding parts only helps it.';
      refresh();
    }
    slice();
  }

  function mount() {
    host.innerHTML = '<div class="xp-toolbar"><div class="xp-thumbs" role="group" aria-label="Sample images">' + model.samples.map(function (s, i) {
      return '<button type="button" data-sample="' + i + '" aria-pressed="' + (i === S.sample) + '" aria-label="' + esc(model.classes[i]) + '"><canvas width="64" height="64"></canvas></button>';
    }).join('') + '</div>' +
      '<label class="xp-field"><span>Brush</span><input type="range" min="2" max="12" value="' + S.brush + '" data-brush><output>' + S.brush + ' px</output></label>' +
      '<button type="button" class="xp-go is-inline" data-undo>Undo</button><button type="button" class="xp-go is-inline" data-reset>Reset</button>' +
      '<button type="button" class="xp-go is-inline" data-occ>Find what matters</button></div>' +
      '<div class="xp-stage"><div class="xp-edit">' +
      '<figure class="xp-edit-img" data-part="image"><figcaption>Original</figcaption><canvas data-cv="orig" width="64" height="64"></canvas></figure>' +
      '<figure class="xp-edit-img is-main" data-part="image occ"><figcaption>Edited image. Drag to erase</figcaption><canvas data-cv="cur" width="64" height="64" tabindex="0" aria-label="Edited image; drag with the mouse or a finger to erase part of it"></canvas><p class="xp-note xp-edit-occ" aria-live="polite"></p></figure>' +
      '<div class="xp-edit-side" data-part="scores"><p class="xp-edit-labels" aria-live="polite"></p><div class="xp-edit-scores" tabindex="0" role="region" aria-label="Class probabilities. Scroll sideways if needed."></div></div>' +
      '</div></div>';
    Array.prototype.forEach.call(host.querySelectorAll('.xp-thumbs canvas'), function (cv, i) { draw(cv, TV.decode(model.samples[i].rgb)); });
    var st = host.querySelector('.xp-stage');
    tipper = XP.tip(st);
    XP.guide(st, PAGES, function (p) { XP.highlight(host.querySelector('.xp-edit'), p ? p.parts : []); });
    choose(S.sample);

    var cv = host.querySelector('[data-cv="cur"]'), down = false;
    function paintAt(e) {
      var r = cv.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / r.width * 64), y = Math.floor((e.clientY - r.top) / r.height * 64);
      for (var dy = -S.brush; dy <= S.brush; dy++) for (var dx = -S.brush; dx <= S.brush; dx++) {
        var yy = y + dy, xx = x + dx;
        if (yy >= 0 && yy < 64 && xx >= 0 && xx < 64 && dx * dx + dy * dy <= S.brush * S.brush) mask[yy * 64 + xx] = 1;
      }
      var ctx = cv.getContext('2d');
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath(); ctx.arc(x + 0.5, y + 0.5, S.brush, 0, 2 * Math.PI); ctx.fill();
    }
    cv.addEventListener('pointerdown', function (e) {
      if (busy) return;
      down = true; cv.setPointerCapture(e.pointerId);
      history.push({ cur: cur, mask: mask });
      mask = new Uint8Array(mask);
      paintAt(e);
    });
    cv.addEventListener('pointermove', function (e) { if (down) paintAt(e); });
    cv.addEventListener('pointerup', function () {
      if (!down) return;
      down = false; S.occ = null;
      cur = inpaint(orig, mask);
      host.querySelector('.xp-edit-occ').textContent = '';
      refresh();
    });

    host.addEventListener('input', function (e) {
      if (!e.target.hasAttribute('data-brush')) return;
      S.brush = +e.target.value;
      e.target.nextElementSibling.textContent = S.brush + ' px';
    });
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || busy || b.closest('.xp-guide')) return;
      if (b.dataset.sample !== undefined) {
        Array.prototype.forEach.call(host.querySelectorAll('[data-sample]'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        choose(+b.dataset.sample);
      } else if (b.hasAttribute('data-undo') && history.length) {
        var h = history.pop(); cur = h.cur; mask = h.mask; S.occ = null; refresh();
      } else if (b.hasAttribute('data-reset')) choose(S.sample);
      else if (b.hasAttribute('data-occ')) occlusion();
      else if (b.dataset.target !== undefined) { S.target = +b.dataset.target; S.occ = null; host.querySelector('.xp-edit-occ').textContent = ''; refresh(); }
    });
  }

  function choose(i) {
    S.sample = i; S.target = null; S.occ = null; history = [];
    orig = TV.decode(model.samples[i].rgb);
    cur = orig; mask = new Uint8Array(4096);
    var o = host.querySelector('.xp-edit-occ'); if (o) o.textContent = '';
    refresh();
  }

  host.innerHTML = '<p class="xp-note">Loading Tiny VGG…</p>';
  TV.fetchModel(host.dataset.model, host.dataset.weights).then(function (m) { model = m; mount(); })
    .catch(function () { host.innerHTML = '<p class="xp-note">The network could not be loaded. The rest of the page still works.</p>'; });
})();
