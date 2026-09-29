/* ════════════════════════════════════════════════════════
   Explainers on /transformers/.

   [data-xp="gpt2"]  follows real GPT-2 (small) activations through the model,
                     after Transformer Explainer (Polo Club of Data Science, MIT).
                     The traces are built by scripts/build_explainer_data.py.
   [data-xp="scratch"] computes self-attention from scratch for one sentence,
                     after Sebastian Raschka's walkthrough. Every number on screen
                     is computed here from a seeded generator.

   Nothing here is trained or approximated except where the panel says so: the
   next-token distribution sums the ~50k logits not listed by value through a
   histogram of width 0.05. Against the full softmax that moves any of the top 10 probabilities by less than 0.2% of its value, for temperatures from 0.1 to 2.
   ════════════════════════════════════════════════════════ */
(function () {
  var gptHost = document.querySelector('[data-xp="gpt2"]');
  var scratchHost = document.querySelector('[data-xp="scratch"]');
  if (!gptHost && !scratchHost) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  /* GPT-2 marks a leading space with a byte; show it as a visible dot. */
  function tok(s) { return esc(s).replace(/^ /, '·'); }
  function fmt(x, d) { return x === -Infinity ? '−∞' : (x < 0 ? '−' : '') + Math.abs(x).toFixed(d); }

  /* Tint a cell by sign and size, the same rule as the architecture panels. */
  function tint(v, max, seq) {
    var a = Math.min(1, Math.abs(v) / (max || 1));
    var c = seq || v >= 0 ? 'var(--tf-up)' : 'var(--tf-down)';
    return 'background:color-mix(in srgb,' + c + ' ' + Math.round(a * 88) + '%,transparent)';
  }

  /* ════════════════════════════════════════════════════════
     GPT-2, traced
     ════════════════════════════════════════════════════════ */

  function gpt2(host) {
    var data, ex, S = {
      ex: 0, block: 0, head: 0, stage: 3, query: -1,
      temp: 0.8, mode: 'k', k: 5, p: 0.9, sampled: null, step: 0
    };
    var STAGES = ['Q·Kᵀ', '÷ √64', 'Mask', 'Softmax'];

    var TOUR = [
      { col: 'emb', t: 'Text becomes tokens', say: 'The prompt is cut into tokens, pieces of words GPT-2 has a number for. A leading space is part of the token, shown here as a dot.' },
      { col: 'emb', t: 'Tokens become vectors', say: 'Each token id picks one row of a 50,257 by 768 table. A learned vector for its position is added, so the same word early and late in the prompt starts differently.' },
      { col: 'blk', t: 'Every token scores every other', stage: 1, say: 'In each head, a token’s query is compared with every key. The raw dot products are divided by 8, the square root of the head size, so the scores do not grow with dimension.' },
      { col: 'blk', t: 'No looking ahead', stage: 3, say: 'Scores for later tokens are set to minus infinity, then each row goes through softmax. Every row now sums to 1 and says where that token takes its information from.' },
      { col: 'blk', t: 'Twelve times over', stage: 3, say: 'The heads are concatenated and projected back to 768 numbers. An MLP then works on each token alone, widening to 3,072 and back. The block repeats 12 times, each adding to the same residual stream.' },
      { col: 'out', t: 'One vector, 50,257 scores', say: 'The last token’s vector is multiplied by the embedding table again, giving one score per token in the vocabulary. Temperature and sampling decide which one is written next.' }
    ];

    function Ex() { return data.examples[S.ex]; }
    function n() { return Ex().tokens.length; }

    /* Scaled scores for one head as a full matrix, -Infinity above the diagonal. */
    function matrix(b, h) {
      var flat = Ex().att[b][h], N = n(), M = [], k = 0;
      for (var r = 0; r < N; r++) {
        var row = [];
        for (var c = 0; c < N; c++) row.push(c <= r ? flat[k + c] : -Infinity);
        k += r + 1;
        M.push(row);
      }
      return M;
    }
    function softmaxRow(row) {
      var m = Math.max.apply(null, row), e = row.map(function (x) { return x === -Infinity ? 0 : Math.exp(x - m); });
      var s = e.reduce(function (a, b) { return a + b; }, 0);
      return e.map(function (x) { return x / s; });
    }
    /* Stages 0 and 1 are the scores before the mask. The trace keeps only the
       entries the mask lets through, so those above the diagonal are shown as
       hidden rather than invented. */
    function stageMatrix(b, h, st) {
      return matrix(b, h).map(function (row, r) {
        if (st === 3) return softmaxRow(row);
        return row.map(function (x, c) {
          if (st === 2 || c <= r) return st === 0 && c <= r ? x * 8 : x;
          return null;
        });
      });
    }

    /* The exact next-token distribution at temperature T. */
    function dist() {
      var E = Ex(), T = S.temp, top = E.top, m = top[0].l;
      var num = top.map(function (c) { return Math.exp((c.l - m) / T); });
      var Z = num.reduce(function (a, b) { return a + b; }, 0), tail = 0;
      E.rest.bins.forEach(function (bc) {
        var v = E.rest.lo + (bc[0] + 0.5) * E.rest.w;
        tail += bc[1] * Math.exp((v - m) / T);
      });
      Z += tail;
      var probs = num.map(function (x) { return x / Z; });
      /* Truncate, then renormalise over what survives. */
      var keep = probs.map(function () { return false; });
      var covered = 0, reachedTail = false;
      if (S.mode === 'k') {
        for (var i = 0; i < Math.min(S.k, probs.length); i++) keep[i] = true;
      } else {
        for (var j = 0; j < probs.length; j++) {
          keep[j] = true;
          covered += probs[j];
          if (covered >= S.p) break;
        }
        if (covered < S.p) reachedTail = true;
      }
      var ks = 0;
      probs.forEach(function (p, i) { if (keep[i]) ks += p; });
      return {
        probs: probs, tail: tail / Z, keep: keep, reachedTail: reachedTail,
        kept: probs.map(function (p, i) { return keep[i] ? p / ks : 0; })
      };
    }

    function render() {
      var E = Ex(), N = n(), tour = TOUR[S.step];
      var html = '';

      /* ── controls and tour ── */
      html += '<div class="xp-bar">' +
        '<label class="xp-field"><span>Prompt</span><select data-k="ex">' +
        data.examples.map(function (e, i) {
          return '<option value="' + i + '"' + (i === S.ex ? ' selected' : '') + '>' + esc(e.prompt) + '</option>';
        }).join('') + '</select></label>' +
        '<div class="xp-tour" role="group" aria-label="Guided tour">' +
        '<button type="button" data-tour="-1" aria-label="Previous step"' + (S.step === 0 ? ' disabled' : '') + '>←</button>' +
        '<span class="xp-tour-n">' + (S.step + 1) + ' / ' + TOUR.length + '</span>' +
        '<button type="button" data-tour="1" aria-label="Next step"' + (S.step === TOUR.length - 1 ? ' disabled' : '') + '>→</button>' +
        '</div></div>' +
        '<p class="xp-caption" aria-live="polite"><strong>' + esc(tour.t) + '.</strong> ' + esc(tour.say) + '</p>';

      html += '<div class="xp-flow xp-gpt">';

      /* ── 1. embedding ── */
      html += '<section class="xp-col' + (tour.col === 'emb' ? ' is-lit' : '') + '" aria-label="Embedding">' +
        '<h3 class="xp-col-t"><span>1</span>Embedding</h3>' +
        '<p class="xp-shape">text → [' + N + ', 768]</p><ol class="xp-toks">' +
        E.tokens.map(function (t, i) {
          return '<li><span class="xp-tok">' + tok(t) + '</span><span class="xp-id">' + E.ids[i] + '</span>' +
            '<span class="xp-vec" title="token embedding, 768 numbers"></span><span class="xp-op">+</span>' +
            '<span class="xp-vec is-pos" title="position ' + i + ' embedding, 768 numbers"></span></li>';
        }).join('') + '</ol>' +
        '<p class="xp-note">Row ' + E.ids[0] + ' of a 50,257 × 768 table, plus a learned vector for position 0. The same happens for every token.</p>' +
        '</section>';

      /* ── 2. blocks ── */
      var st = S.stage, M = stageMatrix(S.block, S.head, st);
      var maxAbs = 0;
      M.forEach(function (row) { row.forEach(function (v) { if (v !== null && isFinite(v)) maxAbs = Math.max(maxAbs, Math.abs(v)); }); });
      html += '<section class="xp-col is-wide' + (tour.col === 'blk' ? ' is-lit' : '') + '" aria-label="Transformer blocks">' +
        '<h3 class="xp-col-t"><span>2</span>Transformer block ' + (S.block + 1) + ' of 12</h3>' +
        '<p class="xp-shape">[' + N + ', 768] → [' + N + ', 768]</p>' +
        '<div class="xp-ctl">' +
        '<label class="xp-field"><span>Block</span><input type="range" min="1" max="12" value="' + (S.block + 1) + '" data-k="block"><output>' + (S.block + 1) + '</output></label>' +
        '<div class="xp-seg" role="group" aria-label="Stage">' + STAGES.map(function (s, i) {
          return '<button type="button" data-stage="' + i + '" aria-pressed="' + (i === st) + '">' + s + '</button>';
        }).join('') + '</div></div>';

      /* All 12 heads of this block, as thumbnails. */
      html += '<div class="xp-heads" role="group" aria-label="Attention head">' +
        Array.apply(null, Array(12)).map(function (_, h) {
          var A = stageMatrix(S.block, h, 3), cells = '';
          A.forEach(function (row) {
            row.forEach(function (v, c) { cells += '<i style="' + tint(v, 1, true) + '"></i>'; });
          });
          return '<button type="button" class="xp-thumb" data-head="' + h + '" aria-pressed="' + (h === S.head) +
            '" aria-label="Head ' + (h + 1) + '" style="--n:' + N + '"><span class="xp-thumb-grid">' + cells +
            '</span><span class="xp-thumb-n">' + (h + 1) + '</span></button>';
        }).join('') + '</div>';

      /* The chosen head, in full. */
      html += '<div class="xp-attn"><table class="xp-mat" style="--n:' + N + '">' +
        '<caption>Head ' + (S.head + 1) + ', ' + STAGES[st] + (st === 3 ? ' (each row sums to 1)' : '') +
        '</caption><thead><tr><th scope="col"><span class="xp-axis">query ↓ key →</span></th>' +
        E.tokens.map(function (t) { return '<th scope="col">' + tok(t) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        M.map(function (row, r) {
          return '<tr' + (r === S.query ? ' class="is-q"' : '') + '><th scope="row"><button type="button" data-q="' + r + '">' + tok(E.tokens[r]) + '</button></th>' +
            row.map(function (v, c) {
              if (v === null) return '<td class="is-hid" title="computed, then removed by the mask">·</td>';
              if (v === -Infinity) return '<td class="is-mask">−∞</td>';
              return '<td style="' + tint(v, st === 3 ? 1 : maxAbs, st === 3) + '">' + fmt(v, 2) + '</td>';
            }).join('') + '</tr>';
        }).join('') + '</tbody></table>';

      /* Arcs from the chosen query token back to what it reads. */
      var q = S.query >= 0 ? S.query : N - 1, W = softmaxRow(matrix(S.block, S.head)[q]);
      var gap = 520 / N, arcs = '';
      W.forEach(function (w, c) {
        if (c > q || w < 0.005) return;
        var x1 = gap * (q + 0.5), x2 = gap * (c + 0.5), hgt = Math.min(56, 10 + Math.abs(x1 - x2) * 0.3);
        arcs += c === q
          ? '<circle cx="' + x1 + '" cy="58" r="' + (3 + w * 12) + '" class="xp-self" style="opacity:' + (0.25 + w * 0.75) + '"/>'
          : '<path d="M' + x1 + ' 64 C' + x1 + ' ' + (64 - hgt) + ' ' + x2 + ' ' + (64 - hgt) + ' ' + x2 + ' 64" ' +
            'style="stroke-width:' + (1 + w * 9).toFixed(1) + ';opacity:' + (0.25 + w * 0.75).toFixed(2) + '"/>';
      });
      html += '<figure class="xp-arcs"><svg viewBox="0 0 520 70" role="img" aria-label="Where ' +
        esc(E.tokens[q].trim()) + ' takes its information from">' + arcs + '</svg>' +
        '<div class="xp-arc-toks" style="--n:' + N + '">' + E.tokens.map(function (t, i) {
          return '<span' + (i === q ? ' class="is-q"' : '') + '>' + tok(t) + '<em>' + (i <= q ? Math.round(W[i] * 100) + '%' : '') + '</em></span>';
        }).join('') + '</div><figcaption>Choose a row to see where that token looks. Thicker lines carry more weight.</figcaption></figure></div>';

      html += '<ol class="xp-mlp">' +
        '<li><b>Concatenate heads</b><span class="xp-shape">12 × [' + N + ', 64] → [' + N + ', 768]</span></li>' +
        '<li><b>Add to the residual stream, then normalise</b><span class="xp-shape">[' + N + ', 768]</span></li>' +
        '<li><b>MLP, each token alone</b><span class="xp-shape">768 → 3,072 (GELU) → 768</span></li>' +
        '<li><b>Repeat for blocks 2 to 12</b><span class="xp-shape">× 12</span></li></ol>' +
        '</section>';

      /* ── 3. probabilities ── */
      var D = dist(), shown = 10, maxP = D.probs[0];
      html += '<section class="xp-col' + (tour.col === 'out' ? ' is-lit' : '') + '" aria-label="Next-token probabilities">' +
        '<h3 class="xp-col-t"><span>3</span>Next token</h3>' +
        '<p class="xp-shape">[768] → [50,257]</p>' +
        '<label class="xp-field is-stack"><span>Temperature <output>' + S.temp.toFixed(2) + '</output></span>' +
        '<input type="range" min="0.05" max="2" step="0.05" value="' + S.temp + '" data-k="temp"></label>' +
        '<div class="xp-seg" role="group" aria-label="Sampling rule">' +
        '<button type="button" data-mode="k" aria-pressed="' + (S.mode === 'k') + '">Top-k</button>' +
        '<button type="button" data-mode="p" aria-pressed="' + (S.mode === 'p') + '">Top-p</button></div>' +
        (S.mode === 'k'
          ? '<label class="xp-field is-stack"><span>k <output>' + S.k + '</output></span><input type="range" min="1" max="50" value="' + S.k + '" data-k="k"></label>'
          : '<label class="xp-field is-stack"><span>p <output>' + S.p.toFixed(2) + '</output></span><input type="range" min="0.05" max="1" step="0.05" value="' + S.p + '" data-k="p"></label>') +
        '<ol class="xp-bars">' + E.top.slice(0, shown).map(function (c, i) {
          return '<li class="' + (D.keep[i] ? '' : 'is-cut') + (S.sampled === i ? ' is-picked' : '') + '">' +
            '<span class="xp-bar-t">' + tok(c.t) + '</span>' +
            '<span class="xp-bar-track"><i class="is-full" style="width:' + (D.probs[i] / maxP * 100).toFixed(1) + '%"></i>' +
            '<i style="width:' + (D.kept[i] / Math.max.apply(null, D.kept) * 100).toFixed(1) + '%"></i></span>' +
            '<span class="xp-bar-v">' + (D.kept[i] * 100).toFixed(1) + '%</span></li>';
        }).join('') + '</ol>' +
        '<p class="xp-note">Pale bars: the full softmax at this temperature. Solid bars: what is left after ' +
        (S.mode === 'k' ? 'keeping the top ' + S.k : 'keeping the smallest set reaching ' + S.p.toFixed(2)) +
        ', renormalised. The ' + (50257 - 50).toLocaleString() + ' tokens outside the top 50 hold ' +
        (D.tail * 100).toFixed(D.tail < 0.001 ? 3 : 1) + '% of the mass.' +
        (D.reachedTail ? ' This nucleus reaches past the 50 tokens stored, so sampling here uses those 50 only.' : '') + '</p>' +
        '<button type="button" class="xp-go" data-sample>Sample a token</button>' +
        '<p class="xp-out" aria-live="polite">' + esc(E.prompt) +
        (S.sampled !== null ? '<mark>' + esc(E.top[S.sampled].t) + '</mark>' : '<span class="xp-cursor">_</span>') + '</p>' +
        '</section></div>';

      host.innerHTML = html;
    }

    function sample() {
      var D = dist(), r = Math.random(), acc = 0;
      for (var i = 0; i < D.kept.length; i++) {
        acc += D.kept[i];
        if (r <= acc) { S.sampled = i; return; }
      }
      S.sampled = 0;
    }

    host.addEventListener('input', function (e) {
      var k = e.target.dataset.k;
      if (!k) return;
      var v = parseFloat(e.target.value);
      if (k === 'block') S.block = v - 1;
      if (k === 'temp') S.temp = v;
      if (k === 'k') S.k = v;
      if (k === 'p') S.p = v;
      if (k === 'ex') { S.ex = v; S.query = -1; }
      S.sampled = null;
      var focus = e.target.dataset.k;
      render();
      var again = host.querySelector('[data-k="' + focus + '"]');
      if (again) again.focus();
    });
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.tour) {
        S.step = Math.max(0, Math.min(TOUR.length - 1, S.step + parseInt(b.dataset.tour, 10)));
        if (TOUR[S.step].stage !== undefined) S.stage = TOUR[S.step].stage;
      }
      if (b.dataset.stage) S.stage = parseInt(b.dataset.stage, 10);
      if (b.dataset.head) S.head = parseInt(b.dataset.head, 10);
      if (b.dataset.q) S.query = parseInt(b.dataset.q, 10);
      if (b.dataset.mode) { S.mode = b.dataset.mode; S.sampled = null; }
      if (b.hasAttribute('data-sample')) sample();
      var sel = b.dataset.tour ? '[data-tour="' + b.dataset.tour + '"]' : null;
      render();
      if (sel) { var again = host.querySelector(sel); if (again && !again.disabled) again.focus(); }
    });

    host.innerHTML = '<p class="xp-note">Loading the GPT-2 traces…</p>';
    fetch(host.dataset.src).then(function (r) { return r.json(); }).then(function (d) {
      data = d;
      render();
    }).catch(function () {
      host.innerHTML = '<p class="xp-note">The GPT-2 traces could not be loaded. The rest of the page still works.</p>';
    });
  }

  /* ════════════════════════════════════════════════════════
     Self-attention from scratch
     ════════════════════════════════════════════════════════ */

  function scratch(host) {
    var WORDS = ['Life', 'is', 'short,', 'eat', 'dessert', 'first'];
    var OTHER = ['The', 'menu', 'lists', 'cake', 'before', 'the', 'main', 'course'];
    var D = 16, DQ = 24, DV = 28, H = 3;

    /* Mulberry32 plus Box-Muller: seeded, so the numbers never change between
       visits. They will not match the article's PyTorch output, which uses a
       different generator. */
    function rng(seed) {
      return function () {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    function normals(r, rows, cols) {
      var M = [];
      for (var i = 0; i < rows; i++) {
        var row = [];
        for (var j = 0; j < cols; j++) {
          var u = Math.max(r(), 1e-12), v = r();
          row.push(Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v));
        }
        M.push(row);
      }
      return M;
    }
    function matvec(W, x) { return W.map(function (row) { return row.reduce(function (s, w, j) { return s + w * x[j]; }, 0); }); }
    function dot(a, b) { return a.reduce(function (s, x, i) { return s + x * b[i]; }, 0); }

    var r = rng(123);
    /* Embeddings drawn from N(0, 0.4^2). Standard-normal draws against
       uniform weights give scores so large that softmax is one-hot with or
       without the scaling, which would hide the point of step 4. */
    function scaled(M) { return M.map(function (row) { return row.map(function (x) { return 0.4 * x; }); }); }
    var X = scaled(normals(r, WORDS.length, D));    /* embedded sentence, [6, 16] */
    var X2 = scaled(normals(r, OTHER.length, D));   /* a second sentence, [8, 16] */
    var WQ = [], WK = [], WV = [];
    for (var h = 0; h < H; h++) {
      /* Uniform in [0, 1), the torch.rand initialisation the article uses. */
      WQ[h] = []; WK[h] = []; WV[h] = [];
      for (var i = 0; i < DQ; i++) { WQ[h].push([]); WK[h].push([]); for (var j = 0; j < D; j++) { WQ[h][i].push(r()); WK[h][i].push(r()); } }
      for (var i2 = 0; i2 < DV; i2++) { WV[h].push([]); for (var j2 = 0; j2 < D; j2++) WV[h][i2].push(r()); }
    }

    var S = { q: 1, scale: true, causal: false, heads: 1, cross: false };

    function compute(hd) {
      var src = S.cross ? X2 : X;
      var q = matvec(WQ[hd], X[S.q]);
      var K = src.map(function (x) { return matvec(WK[hd], x); });
      var V = src.map(function (x) { return matvec(WV[hd], x); });
      var omega = K.map(function (k) { return dot(q, k); });
      var masked = omega.map(function (w, j) { return S.causal && !S.cross && j > S.q ? -Infinity : w; });
      var scaled = masked.map(function (w) { return S.scale ? w / Math.sqrt(DQ) : w; });
      var m = Math.max.apply(null, scaled);
      var e = scaled.map(function (w) { return w === -Infinity ? 0 : Math.exp(w - m); });
      var s = e.reduce(function (a, b) { return a + b; }, 0);
      var alpha = e.map(function (x) { return x / s; });
      var z = [];
      for (var d = 0; d < DV; d++) z.push(alpha.reduce(function (acc, a, j) { return acc + a * V[j][d]; }, 0));
      return { q: q, K: K, V: V, omega: masked, alpha: alpha, z: z };
    }

    function strip(v, cls) {
      var mx = Math.max.apply(null, v.map(Math.abs)) || 1;
      return '<span class="xp-strip ' + (cls || '') + '" style="--n:' + v.length + '">' + v.map(function (x) {
        return '<i style="' + tint(x, mx) + '" title="' + x.toFixed(3) + '"></i>';
      }).join('') + '</span>';
    }

    function render() {
      var src = S.cross ? OTHER : WORDS, res = [];
      for (var hd = 0; hd < S.heads; hd++) res.push(compute(hd));
      var R = res[0], L = src.length;
      var hs = S.heads > 1 ? S.heads + ', ' : '';
      var html = '<div class="xp-bar">' +
        '<div class="xp-field"><span>Query word</span><div class="xp-chips" role="group" aria-label="Query word">' +
        WORDS.map(function (w, i) { return '<button type="button" data-q="' + i + '" aria-pressed="' + (i === S.q) + '">' + esc(w) + '</button>'; }).join('') +
        '</div></div>' +
        '<div class="xp-toggles">' +
        '<label><input type="checkbox" data-t="scale"' + (S.scale ? ' checked' : '') + '> Divide by √d<sub>k</sub></label>' +
        '<label><input type="checkbox" data-t="causal"' + (S.causal ? ' checked' : '') + (S.cross ? ' disabled' : '') + '> Causal mask</label>' +
        '<label><input type="checkbox" data-t="cross"' + (S.cross ? ' checked' : '') + '> Cross-attention</label>' +
        '<label><input type="checkbox" data-t="heads"' + (S.heads > 1 ? ' checked' : '') + '> 3 heads</label>' +
        '</div></div>';

      var steps = [
        {
          t: 'Embed the sentence', code: 'embedded = embed(sentence_int)', shape: '[6, 16]',
          body: '<div class="xp-embed">' + WORDS.map(function (w, i) {
            return '<span class="xp-embed-r' + (i === S.q ? ' is-q' : '') + '"><b>' + esc(w) + '</b>' + strip(X[i]) + '</span>';
          }).join('') + '</div>',
          say: 'Each of the 6 words becomes 16 numbers. In a trained model these are learned; here they are seeded draws from a normal distribution with standard deviation 0.4.'
        },
        {
          t: 'Project to query, keys and values',
          code: S.heads > 1 ? 'keys = torch.bmm(W_key, stacked_inputs)' : 'query_2 = W_query @ x_2',
          shape: 'q [' + hs + '24] · K [' + hs + L + ', 24] · V [' + hs + L + ', 28]',
          body: '<div class="xp-qkv"><span><b>q</b> from “' + esc(WORDS[S.q]) + '”' + strip(R.q) + '</span>' +
            '<span><b>K</b> from ' + (S.cross ? 'the second sentence' : 'every word') + '<span class="xp-stack">' + R.K.map(function (k) { return strip(k); }).join('') + '</span></span>' +
            '<span><b>V</b><span class="xp-stack">' + R.V.map(function (v) { return strip(v, 'is-v'); }).join('') + '</span></span></div>',
          say: 'Three weight matrices turn each embedding into a query (what this word looks for), a key (what it offers) and a value (what it passes on). W_query and W_key are 24 by 16; W_value is 28 by 16.' +
            (S.cross ? ' With cross-attention, keys and values come from a second sequence of ' + L + ' tokens. Only the query stays with the first.' : '')
        },
        {
          t: 'Score every key', code: 'omega_2 = query_2 @ keys.T', shape: '[' + hs + L + ']',
          body: '<ol class="xp-omega">' + src.map(function (w, j) {
            return '<li><span>' + esc(w) + '</span><b>' + fmt(R.omega[j], 1) + '</b></li>';
          }).join('') + '</ol>',
          say: 'One dot product per key gives the unnormalised attention scores ω. They are large, because 24 products of this size add up.' +
            (S.causal ? ' The causal mask sets later words to minus infinity so they cannot be read.' : '')
        },
        {
          t: 'Normalise the scores', code: S.scale ? 'attention_weights_2 = F.softmax(omega_2 / d_k**0.5, dim=0)' : 'attention_weights_2 = F.softmax(omega_2, dim=0)',
          shape: '[' + hs + L + '], sums to 1',
          body: res.map(function (rr, hd) {
            return '<ol class="xp-alpha">' + (S.heads > 1 ? '<li class="xp-alpha-h">head ' + (hd + 1) + '</li>' : '') + src.map(function (w, j) {
              return '<li><span>' + esc(w) + '</span><span class="xp-bar-track"><i style="width:' + (rr.alpha[j] * 100).toFixed(1) + '%"></i></span><b>' + rr.alpha[j].toFixed(3) + '</b></li>';
            }).join('') + '</ol>';
          }).join(''),
          say: S.scale
            ? 'Dividing by √24 keeps the scores in a range where softmax still spreads weight around. Turn the division off and watch the weights collapse onto one word.'
            : 'Without the division, the largest score dominates and softmax puts almost all the weight on one word. The gradient through the others nearly vanishes.'
        },
        {
          t: 'Mix the values', code: 'context_vector_2 = attention_weights_2 @ values', shape: '[' + hs + '28]',
          body: res.map(function (rr, hd) { return '<span class="xp-ctx">' + (S.heads > 1 ? '<b>head ' + (hd + 1) + '</b>' : '<b>z</b>') + strip(rr.z, 'is-v') + '</span>'; }).join(''),
          say: 'The context vector is the weighted average of the values. It is the new representation of “' + WORDS[S.q] + '”, now carrying information from the words it attended to.' +
            (S.heads > 1 ? ' With 3 heads, each head has its own weights and its own context vector. They are concatenated into one vector of 3 × 28 = 84 numbers.' : '')
        }
      ];

      html += '<ol class="xp-steps">' + steps.map(function (s, i) {
        return '<li><div class="xp-step-h"><span class="xp-step-n">' + (i + 1) + '</span><b>' + esc(s.t) +
          '</b><span class="xp-shape">' + s.shape + '</span></div>' +
          '<code class="xp-code">' + esc(s.code) + '</code>' + s.body + '<p class="xp-note">' + s.say + '</p></li>';
      }).join('') + '</ol>';
      host.innerHTML = html;
    }

    host.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-q]');
      if (!b) return;
      S.q = parseInt(b.dataset.q, 10);
      render();
      host.querySelector('[data-q="' + S.q + '"]').focus();
    });
    host.addEventListener('change', function (e) {
      var t = e.target.dataset.t;
      if (!t) return;
      if (t === 'heads') S.heads = e.target.checked ? H : 1;
      else S[t] = e.target.checked;
      render();
      host.querySelector('[data-t="' + t + '"]').focus();
    });
    render();
  }

  if (gptHost) gpt2(gptHost);
  if (scratchHost) scratch(scratchHost);
})();
