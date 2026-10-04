/* ══════════════════════════════════════════════════════════════════
   The architecture of "Attention Is All You Need", part by part
   /transformers/ only
   ══════════════════════════════════════════════════════════════════

   Vaswani et al. (NeurIPS 2017), arXiv:1706.03762. Every operation,
   every formula and every hyperparameter below is the paper's. Only
   the sizes are small:

       here   d_model 8    h 2   d_k 4    d_ff 32    N 2
       paper  d_model 512  h 8   d_k 64   d_ff 2048  N 6

   Each panel states the paper's shape beside its own, so the reader
   is never learning a size that is not real.

   Two decisions worth keeping.

   The weights are chosen rather than trained, and the page says so.
   Random weights give an attention map that is flat to three
   decimals, which teaches nothing: the reader sees a grey square and
   takes it on faith. These are picked so head 1 resolves `it` to
   `cat` and head 2 finds the verb, which are both real head types,
   and sized so the softmax does not saturate. A row reading 1.00,
   0.00, 0.00 hides the very thing the figure exists to show.

   The arithmetic is real. Every matrix on screen is computed in this
   file from those weights, so a reader who checks one cell by hand
   finds it correct. The oracle it was written against is
   toy_full.py in the session scratchpad, an independent NumPy
   implementation; keep the two in agreement.

   Built with plain DOM and SVG rather than D3 and Svelte, which is
   what MLU-Explain uses, for the reasons already recorded for the
   diagrams and the playgrounds: a figure here follows the light and
   dark themes, grows with the reading controls, survives a page tint,
   and reads to a screen reader. A charting library brings its own
   colours and its own font sizing and would have to be fought on all
   four.
   ══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  }

  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    apply(n, attrs);
    append(n, kids);
    return n;
  }

  var SVGNS = 'http://www.w3.org/2000/svg';

  function svg(tag, attrs, kids) {
    var n = document.createElementNS(SVGNS, tag);
    apply(n, attrs);
    append(n, kids);
    return n;
  }

  function apply(n, attrs) {
    for (var k in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
      var v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === 'text') { n.textContent = v; }
      else if (k === 'on') { for (var e in v) n.addEventListener(e, v[e]); }
      else { n.setAttribute(k, v === true ? '' : v); }
    }
  }

  function append(n, kids) {
    if (kids === null || kids === undefined) return;
    (Array.isArray(kids) ? kids : [kids]).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
  }

  function fmt(v, dp) {
    if (!isFinite(v)) return v > 0 ? '∞' : '−∞';
    var t = v.toFixed(dp === undefined ? 2 : dp);
    if (/^-0(\.0+)?$/.test(t)) t = t.slice(1);
    return t.replace('-', '−');
  }

  function commas(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /* Bytes at the sizes a serving engineer actually quotes. */
  function bytes(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + ' GB';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + ' MB';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + ' kB';
    return commas(n) + ' B';
  }

  /* ════════════════════════════════════════════════════════
     1. The model

     Sizes, then weights, then the operations of section 3 of
     the paper in the order the paper runs them.
     ════════════════════════════════════════════════════════ */

  var TOY = { d: 8, h: 2, dk: 4, dv: 4, dff: 32, N: 2 };
  var PAPER = { d: 512, h: 8, dk: 64, dv: 64, dff: 2048, N: 6 };

  var TOKENS = ['the', 'cat', 'sat', 'on', 'it'];
  var T = TOKENS.length;

  /* What each of the eight dimensions was given to mean. A trained
     model has no such labels; these exist so a number can be read. */
  var AXES = ['animate', 'thing', 'action', 'function',
              'subject', 'place', 'refers', 'const'];

  var E = [
    [0.00, 0.00, 0.00, 0.90, 0.00, 0.00, 0.00, 0.20],
    [0.90, 0.30, 0.00, 0.00, 0.70, 0.00, 0.00, 0.20],
    [0.00, 0.00, 0.90, 0.00, 0.00, 0.30, 0.00, 0.20],
    [0.00, 0.00, 0.00, 0.80, 0.00, 0.60, 0.00, 0.20],
    [0.20, 0.20, 0.00, 0.30, 0.30, 0.00, 0.90, 0.20]
  ];

  function zeros(r, c) {
    var m = [], i, j;
    for (i = 0; i < r; i++) { m.push([]); for (j = 0; j < c; j++) m[i].push(0); }
    return m;
  }

  function put(m, cells) {
    cells.forEach(function (c) { m[c[0]][c[1]] = c[2]; });
    return m;
  }

  /* The projections are scaled by 1/sqrt(d_model) to undo the paper's
     embedding scaling, which at this size would drive every softmax
     row to a one-hot vector. */
  var WSC = 1 / Math.sqrt(TOY.d);

  function scaleMat(m, k) {
    return m.map(function (row) {
      return row.map(function (v) { return v * k; });
    });
  }

  /* head 1 asks "what does this word refer to" */
  var WQ1 = scaleMat(put(zeros(8, 4), [[6, 0, 2.4], [4, 1, 0.6]]), WSC);
  var WK1 = scaleMat(put(zeros(8, 4), [[0, 0, 2.0], [4, 0, 1.2], [1, 1, 0.8]]), WSC);
  var WV1 = put(zeros(8, 4), [[0, 0, 1], [1, 1, 1], [4, 2, 1], [2, 3, 1]]);
  /* head 2 asks "where is the action" */
  var WQ2 = scaleMat(put(zeros(8, 4), [[5, 0, 2.2], [3, 1, 1.0]]), WSC);
  var WK2 = scaleMat(put(zeros(8, 4), [[2, 0, 2.4], [5, 0, 1.4], [3, 1, 1.2]]), WSC);
  var WV2 = put(zeros(8, 4), [[2, 0, 1], [5, 1, 1], [3, 2, 1], [7, 3, 1]]);

  var HEADS = [
    { name: 'Head 1', asks: 'a pronoun referring to a noun',
      wq: WQ1, wk: WK1, wv: WV1 },
    { name: 'Head 2', asks: 'tokens attending to a verb',
      wq: WQ2, wk: WK2, wv: WV2 }
  ];

  var WO = (function () {
    var m = zeros(8, 8), i;
    for (i = 0; i < 8; i++) m[i][i] = 1;
    m[0][4] = 0.3; m[5][2] = 0.3;
    return m;
  }());

  /* The feed-forward weights carry no story, so they are generated
     rather than chosen. Seeded, so they are the same on every reload,
     which matters when a reader compares two states of the page. */
  function lcg(seed) {
    var st = seed >>> 0;
    return function () {
      st = (st * 1664525 + 1013904223) >>> 0;
      return st / 4294967296;
    };
  }

  function gaussians(n, sd, rand) {
    var out = [], i, u, v;
    for (i = 0; i < n; i++) {
      u = Math.max(1e-9, rand());
      v = rand();
      out.push(Math.round(Math.sqrt(-2 * Math.log(u)) *
        Math.cos(2 * Math.PI * v) * sd * 100) / 100);
    }
    return out;
  }

  var FF = (function () {
    var rand = lcg(11), i, j;
    var b1 = gaussians(TOY.dff, 0.1, rand);
    var b2 = gaussians(TOY.d, 0.1, rand);
    var a = gaussians(TOY.d * TOY.dff, 0.5, rand);
    var b = gaussians(TOY.dff * TOY.d, 0.25, rand);
    var w1 = zeros(TOY.d, TOY.dff), w2 = zeros(TOY.dff, TOY.d);
    for (i = 0; i < TOY.d; i++)
      for (j = 0; j < TOY.dff; j++) w1[i][j] = a[i * TOY.dff + j];
    for (i = 0; i < TOY.dff; i++)
      for (j = 0; j < TOY.d; j++) w2[i][j] = b[i * TOY.d + j];
    return { w1: w1, b1: b1, w2: w2, b2: b2 };
  }());

  /* ── linear algebra ─────────────────────────────────── */

  function matmul(a, b) {
    var n = a.length, m = b[0].length, k = b.length, out = zeros(n, m);
    var i, j, p, sum;
    for (i = 0; i < n; i++)
      for (j = 0; j < m; j++) {
        sum = 0;
        for (p = 0; p < k; p++) sum += a[i][p] * b[p][j];
        out[i][j] = sum;
      }
    return out;
  }

  function transpose(a) {
    return a[0].map(function (_, j) {
      return a.map(function (row) { return row[j]; });
    });
  }

  function mapMat(a, f) {
    return a.map(function (row, i) {
      return row.map(function (v, j) { return f(v, i, j); });
    });
  }

  function addMat(a, b) {
    return mapMat(a, function (v, i, j) { return v + b[i][j]; });
  }

  function addRow(a, r) {
    return mapMat(a, function (v, i, j) { return v + r[j]; });
  }

  function concatCols(mats) {
    return mats[0].map(function (_, i) {
      return mats.reduce(function (acc, m) { return acc.concat(m[i]); }, []);
    });
  }

  function softmaxRows(a) {
    return a.map(function (row) {
      var mx = Math.max.apply(null, row.filter(isFinite));
      var ex = row.map(function (v) { return isFinite(v) ? Math.exp(v - mx) : 0; });
      var tot = ex.reduce(function (p, q) { return p + q; }, 0) || 1;
      return ex.map(function (v) { return v / tot; });
    });
  }

  function layernorm(a, eps) {
    eps = eps === undefined ? 1e-5 : eps;
    return a.map(function (row) {
      var n = row.length;
      var mu = row.reduce(function (p, q) { return p + q; }, 0) / n;
      var vr = row.reduce(function (p, q) { return p + (q - mu) * (q - mu); }, 0) / n;
      var sd = Math.sqrt(vr + eps);
      return row.map(function (v) { return (v - mu) / sd; });
    });
  }

  function relu(a) { return mapMat(a, function (v) { return Math.max(0, v); }); }

  /* ── the paper's operations ─────────────────────────── */

  /* Section 3.5. PE(pos,2i)   = sin(pos / 10000^(2i/d_model))
                  PE(pos,2i+1) = cos(pos / 10000^(2i/d_model)) */
  function sinusoid(len, d) {
    var m = zeros(len, d), pos, i, denom;
    for (pos = 0; pos < len; pos++)
      for (i = 0; i < d; i += 2) {
        denom = Math.pow(10000, i / d);
        m[pos][i] = Math.sin(pos / denom);
        if (i + 1 < d) m[pos][i + 1] = Math.cos(pos / denom);
      }
    return m;
  }

  /* Section 3.2.1. Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) V

     Queries and the key-value pair are taken from separate sources,
     because that is the only difference between the three ways the
     paper uses attention. Self-attention passes the same matrix twice.
     Cross-attention passes the decoder stream for the queries and the
     encoder output for the keys and values. */
  function attendKV(Xq, Xkv, wq, wk, wv, masked) {
    var q = matmul(Xq, wq), k = matmul(Xkv, wk), v = matmul(Xkv, wv);
    var raw = matmul(q, transpose(k));
    var sc = mapMat(raw, function (val) { return val / Math.sqrt(TOY.dk); });
    var cut = masked
      ? mapMat(sc, function (val, i, j) { return j > i ? -Infinity : val; })
      : sc;
    var attn = softmaxRows(cut);
    return { q: q, k: k, v: v, raw: raw, scaled: sc, masked: cut,
             attn: attn, out: matmul(attn, v) };
  }

  /* Section 3.2.2. MultiHead(Q,K,V) = Concat(head_1..head_h) W^O */
  function multihead(Xq, Xkv, masked) {
    var per = HEADS.map(function (hd) {
      return attendKV(Xq, Xkv, hd.wq, hd.wk, hd.wv, masked);
    });
    var cat = concatCols(per.map(function (p) { return p.out; }));
    return { per: per, cat: cat, out: matmul(cat, WO) };
  }

  /* Section 3.3. FFN(x) = max(0, x W_1 + b_1) W_2 + b_2 */
  function feedforward(X) {
    var hid = addRow(matmul(X, FF.w1), FF.b1);
    var act = relu(hid);
    return { hid: hid, act: act, out: addRow(matmul(act, FF.w2), FF.b2) };
  }

  /* Everything the panels draw, computed once. */
  var M = (function () {
    var pe = sinusoid(T, TOY.d);
    var scale = Math.sqrt(TOY.d);
    var emb = mapMat(E, function (v) { return v * scale; });
    var x0 = addMat(emb, pe);

    /* Post-norm, which is what the paper does: "the output of each
       sub-layer is LayerNorm(x + Sublayer(x))". The sub-layer sees x
       unnormalised. Module 1 offers the pre-norm variant that came
       later, and it is a variant, not the original. */
    var mh = multihead(x0, x0, false);
    var mhMasked = multihead(x0, x0, true);
    var res1 = layernorm(addMat(x0, mh.out));
    var ff = feedforward(res1);
    var res2 = layernorm(addMat(res1, ff.out));

    var preMh = multihead(layernorm(x0), layernorm(x0), false);
    var preRes1 = addMat(x0, preMh.out);
    var preFf = feedforward(layernorm(preRes1));
    var preRes2 = addMat(preRes1, preFf.out);

    /* The decoder's three sub-layers, in the paper's order. Masked
       self-attention first, then attention whose keys and values come
       from the encoder output, then the feed-forward network. */
    var dSelf = layernorm(addMat(x0, mhMasked.out));
    var dCross = multihead(dSelf, res2, false);
    var dRes2 = layernorm(addMat(dSelf, dCross.out));
    var dFf = feedforward(dRes2);
    var dRes3 = layernorm(addMat(dRes2, dFf.out));

    return {
      pe: pe, emb: emb, x0: x0, scale: scale,
      mh: mh, mhMasked: mhMasked, res1: res1, ff: ff, res2: res2,
      pre: { mh: preMh, res1: preRes1, ff: preFf, res2: preRes2 },
      dec: { self: dSelf, cross: dCross, res2: dRes2, ff: dFf, res3: dRes3 }
    };
  }());

  /* ════════════════════════════════════════════════════════
     2. Drawing a tensor

     A matrix is drawn as a grid of numbers rather than a
     picture of a grid, because the reader has to be able to
     check one against the formula above it. Anything wider
     than the column scrolls inside its own box.
     ════════════════════════════════════════════════════════ */

  function absMax(m) {
    var mx = 0;
    m.forEach(function (row) {
      row.forEach(function (v) {
        if (isFinite(v) && Math.abs(v) > mx) mx = Math.abs(v);
      });
    });
    return mx || 1;
  }

  function grid(m, opt) {
    opt = opt || {};
    var mx = opt.max === undefined ? absMax(m) : opt.max;
    var dp = opt.dp === undefined ? 2 : opt.dp;
    var dense = opt.dense || m[0].length > 12;
    var cols = opt.cols || null;
    var rows = opt.rows || null;

    var table = h('div', {
      'class': 'tf-grid' + (dense ? ' is-dense' : ''),
      style: '--tf-cols:' + m[0].length
    });

    if (cols) {
      table.appendChild(h('span', { 'class': 'tf-corner' }));
      cols.forEach(function (c) {
        table.appendChild(h('span', { 'class': 'tf-colhead', text: c }));
      });
    }

    m.forEach(function (row, i) {
      if (rows) {
        table.appendChild(h('span', {
          'class': 'tf-rowhead' + (opt.markRow === i ? ' is-on' : ''),
          text: rows[i]
        }));
      } else if (cols) {
        table.appendChild(h('span', { 'class': 'tf-rowhead' }));
      }
      row.forEach(function (v, j) {
        var a = isFinite(v) ? Math.min(1, Math.abs(v) / mx) : 1;
        var cls = 'tf-cell';
        if (v < 0) cls += ' is-neg';
        if (opt.markRow === i) cls += ' is-row';
        if (opt.markCol === j) cls += ' is-col';
        table.appendChild(h('span', {
          'class': cls,
          style: '--a:' + a.toFixed(3),
          title: (rows ? rows[i] + ' ' : '') + (cols ? cols[j] + ' ' : '') +
            (isFinite(v) ? v.toFixed(4) : 'masked'),
          text: dense ? '' : fmt(v, dp)
        }));
      });
    });

    var wrap = h('div', { 'class': 'tf-gridwrap' }, table);
    if (opt.caption) {
      wrap.appendChild(h('p', { 'class': 'tf-gridcap', text: opt.caption }));
    }
    return wrap;
  }

  /* What went in and what came out, which is the question the reader
     arrived with, so it heads every step. The paper's own shape sits
     underneath, so nobody learns a size that is not real. */
  function trans(a, b, pa, pb) {
    return h('div', { 'class': 'tf-trans' }, [
      h('div', { 'class': 'tf-trans-line' }, [
        h('span', { text: a }),
        h('span', { 'class': 'tf-trans-arrow', 'aria-label': 'becomes', text: '──▶' }),
        h('span', { text: b })
      ]),
      pa ? h('span', {
        'class': 'tf-trans-paper',
        text: 'in the paper   ' + pa + '   ──▶   ' + pb
      }) : null
    ]);
  }

  /* An operation, written the way the paper writes it. */
  function op(formula, said) {
    var equation = h('div', { 'class': 'tf-formula' });
    if (formula.indexOf('transformer/') === 0) {
      window.InterviewDisplayMath.set(equation, formula);
    } else { equation.textContent = formula; }
    return h('div', { 'class': 'tf-op' }, [
      equation,
      said ? h('p', { 'class': 'tf-op-said', text: said }) : null
    ]);
  }

  function stage(kids) { return h('div', { 'class': 'tf-stage' }, kids); }

  function note(text) { return h('p', { 'class': 'tf-note', text: text }); }

  /* ── controls ───────────────────────────────────────── */

  function chips(items, current, onPick, label) {
    var wrap = h('div', { 'class': 'tf-chips', role: 'group', 'aria-label': label });
    items.forEach(function (it, i) {
      wrap.appendChild(h('button', {
        type: 'button',
        'class': 'tf-chip' + (i === current ? ' is-on' : ''),
        'aria-pressed': i === current ? 'true' : 'false',
        text: it,
        on: { click: function () { onPick(i); } }
      }));
    });
    return wrap;
  }

  function toggle(label, on, onChange) {
    return h('label', { 'class': 'tf-toggle' }, [
      h('input', {
        type: 'checkbox', checked: on ? 'checked' : null,
        on: { change: function (e) { onChange(e.target.checked); } }
      }),
      h('span', { text: label })
    ]);
  }

  function slider(cfg, onChange) {
    var out = h('output', { 'class': 'tf-slider-val', text: cfg.format(cfg.value) });
    return h('label', { 'class': 'tf-slider' }, [
      h('span', { 'class': 'tf-slider-k', text: cfg.label }),
      h('input', {
        type: 'range', min: cfg.min, max: cfg.max, step: cfg.step || 1,
        value: cfg.value, 'aria-label': cfg.label,
        on: {
          input: function (e) {
            var v = parseFloat(e.target.value);
            out.textContent = cfg.format(v);
            onChange(v);
          }
        }
      }),
      out
    ]);
  }

  /* A row of name and value, for the places where the answer is a
     number rather than a tensor. */
  function readout(rows) {
    return h('dl', { 'class': 'tf-readout' },
      rows.reduce(function (acc, r) {
        acc.push(h('dt', { text: r[0] }));
        var value = h('dd');
        if (r[1] && typeof r[1] === 'object') window.InterviewDisplayMath.set(value, r[1].math, r[1].values);
        else value.textContent = r[1];
        acc.push(value);
        return acc;
      }, []));
  }

  /* ── panel chrome ───────────────────────────────────── */

  function panel(cfg) {
    var host = h('section', { 'class': 'tf', 'aria-label': cfg.title });
    var controls = h('div', { 'class': 'tf-controls' });
    host.appendChild(h('header', { 'class': 'tf-head' }, [
      h('div', {}, [
        h('h3', { 'class': 'tf-title', text: cfg.title })
      ]),
      controls
    ]));
    var body = h('div', { 'class': 'tf-body' });
    host.appendChild(body);
    if (cfg.source) {
      host.appendChild(h('p', { 'class': 'tf-source', text: cfg.source }));
    }
    return { host: host, body: body, controls: controls };
  }

  /* A numbered step list beside the stage, the same shell the track
     animations use, so the two read as one page. The list is a real
     sequence: it is the order the forward pass runs in, and the
     number is what the reader uses to say where they are. */
  function stepped(body, steps, render) {
    var list = h('ol', { 'class': 'tf-steps' });
    var out = h('div', { 'class': 'tf-out' });
    var at = 0;

    var count = h('span', { 'class': 'tf-count', role: 'status' });
    var back = h('button', {
      type: 'button', text: 'Back',
      on: { click: function () { go(at - 1); } }
    });
    var next = h('button', {
      type: 'button', text: 'Next',
      on: { click: function () { go(at + 1); } }
    });

    function go(i) {
      at = Math.max(0, Math.min(steps.length - 1, i));
      $$('li', list).forEach(function (li, k) {
        li.classList.toggle('is-on', k === at);
        li.classList.toggle('is-done', k < at);
        li.setAttribute('aria-current', k === at ? 'step' : 'false');
      });
      out.textContent = '';
      render(at, out);
      count.textContent = 'Step ' + (at + 1) + ' of ' + steps.length;
      back.disabled = at === 0;
      next.disabled = at === steps.length - 1;
    }

    steps.forEach(function (st, i) {
      list.appendChild(h('li', {
        'class': 'tf-step',
        tabindex: '0',
        role: 'button',
        text: st,
        on: {
          click: function () { go(i); },
          keydown: function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i); }
          }
        }
      }));
    });

    body.appendChild(h('div', { 'class': 'tf-split' }, [
      h('div', { 'class': 'tf-rail' }, [
        list,
        h('div', { 'class': 'tf-nav' }, [back, count, next])
      ]),
      out
    ]));
    go(0);
    /* `redraw` repeats the current step, which is what a control that
       changes the model rather than the position needs. */
    return { go: go, redraw: function () { go(at); } };
  }

  /* ════════════════════════════════════════════════════════
     3. Panels, one per module
     ════════════════════════════════════════════════════════ */

  var PANEL = {};

  /* ── Module 0: attention mechanics ──────────────────────
     Q, K and V through to the output of one multi-head
     layer, one step at a time, with the head and the mask in
     the reader's hands.

     Each step declares the shape it takes and the shape it
     returns, so the heading writes itself and cannot drift
     from what the step actually draws. */
  PANEL.attention = function () {
    var p = panel({
      title: 'Calculate one attention layer',
      source: 'The operations follow section 3.2 of Vaswani et al. (2017). These example weights were chosen to make the pattern visible, rather than learnt through training. This page supplies the column names.'
    });

    var st = { head: 0, masked: false };
    var api = null;
    var d = TOY.d, dk = TOY.dk;

    function headChips() {
      return chips(HEADS.map(function (hd) { return hd.name; }), st.head,
        function (i) {
          st.head = i;
          p.controls.replaceChild(headChips(), p.controls.firstChild);
          api.redraw();
        }, 'Attention head');
    }

    p.controls.appendChild(headChips());
    p.controls.appendChild(toggle('Mask later positions', st.masked, function (v) {
      st.masked = v;
      api.redraw();
    }));

    function ctx() {
      var res = st.masked ? M.mhMasked : M.mh;
      return { hd: HEADS[st.head], res: res, per: res.per[st.head] };
    }

    var STEPS = [
      {
        label: 'Embed the tokens',
        from: '(5 tokens)', to: '(5, 8)',
        pfrom: '(B, T)', pto: '(B, T, 512)',
        draw: function (out) {
          out.appendChild(op(
            'transformer/embedding',
            'Each token starts as an embedding, a vector of numbers. Section 3.4 scales it by the square root of the model width. Then the model adds a vector that represents position.'));
          out.appendChild(stage(grid(M.x0, {
            rows: TOKENS, cols: AXES,
            caption: 'Each row represents a token. Each column is one vector component.'
          })));
        }
      },
      {
        label: 'Project to Q, K and V',
        from: '(5, 8)', to: '3 × (5, 4)',
        pfrom: '(B, T, 512)', pto: '3 × (B, h, T, 64)',
        draw: function (out, c) {
          out.appendChild(op(
            'transformer/head',
            c.hd.name + ' illustrates ' + c.hd.asks + '. Each projection uses all ' +
            d + ' input dimensions to calculate ' + dk + ' output dimensions.'));
          out.appendChild(stage([
            grid(c.per.q, { rows: TOKENS, caption: 'Q, vectors used to compare with keys' }),
            grid(c.per.k, { rows: TOKENS, caption: 'K, vectors compared with queries' }),
            grid(c.per.v, { rows: TOKENS, caption: 'V, vectors combined using attention weights' })
          ]));
        }
      },
      {
        label: 'Score every pair',
        from: '2 × (5, 4)', to: '(5, 5)',
        pfrom: '2 × (B, h, T, 64)', pto: '(B, h, T, T)',
        draw: function (out, c) {
          out.appendChild(op('transformer/score',
            'Multiply each query by each key to obtain a score. Entry i, j measures the match between the query at position i and the key at position j.'));
          out.appendChild(stage(grid(c.per.raw, {
            rows: TOKENS, cols: TOKENS,
            caption: 'Rows are query positions. Columns are key positions.'
          })));
          out.appendChild(note(
            'The score matrix has T² entries, where T is the sequence length. Thus, doubling T quadruples its size. Windowed, sparse, and linear attention reduce or replace these pairwise calculations.'));
        }
      },
      {
        label: 'Divide by √d_k',
        from: '(5, 5)', to: '(5, 5)',
        pfrom: '(B, h, T, T)', pto: '(B, h, T, T)',
        draw: function (out, c) {
          out.appendChild(op('transformer/scaled-score',
            'With d_k = ' + dk + ' the divisor is ' + Math.sqrt(dk).toFixed(0) +
            '. Dividing by this value controls the score scale. Otherwise, larger vectors can produce extreme probabilities with very small gradients.'));
          out.appendChild(stage([
            grid(c.per.raw, { rows: TOKENS, cols: TOKENS, caption: 'Before' }),
            grid(c.per.scaled, { rows: TOKENS, cols: TOKENS, caption: 'After' })
          ]));
          out.appendChild(note('In the paper d_k is ' + PAPER.dk +
            ', so the divisor is ' + Math.sqrt(PAPER.dk).toFixed(0) + '.'));
        }
      },
      {
        label: 'Mask the future',
        from: '(5, 5)', to: '(5, 5)',
        pfrom: '(B, h, T, T)', pto: '(B, h, T, T)',
        draw: function (out, c) {
          out.appendChild(op('transformer/mask',
            st.masked
              ? 'The model sets scores for later positions to minus infinity. The softmax operation then gives those positions zero weight.'
              : 'The encoder can use the whole input sequence. Turn on Mask later positions to see causal attention, which blocks later tokens.'));
          out.appendChild(stage(grid(c.per.masked, {
            rows: TOKENS, cols: TOKENS,
            caption: st.masked ? 'Later positions have zero attention weight.'
              : 'Every token can attend to every input position.'
          })));
          out.appendChild(note(
            'Encoder attention uses the whole input sentence. Decoder self-attention blocks later input positions. With shifted training targets, this prevents access to the token being predicted.'));
        }
      },
      {
        label: 'Softmax each row',
        from: '(5, 5)', to: '(5, 5)',
        pfrom: '(B, h, T, T)', pto: '(B, h, T, T)',
        draw: function (out, c) {
          out.appendChild(op('transformer/weights',
            'Softmax converts each score row into non-negative weights that add up to one.'));
          out.appendChild(stage(grid(c.per.attn, {
            rows: TOKENS, cols: TOKENS, max: 1,
            caption: 'Every row adds to 1.00'
          })));
          out.appendChild(note(st.head === 0
            ? 'Read the bottom row. The chosen weights make the representation of “it” depend mostly on “cat”. Other rows distribute their weights more evenly.'
            : 'Read down the “sat” column. This example head gives the verb a high weight in each row, illustrating a different pattern from head 1.'));
        }
      },
      {
        label: 'Weight the values',
        from: '(5, 5) × (5, 4)', to: '(5, 4)',
        pfrom: '(B, h, T, T)', pto: '(B, h, T, 64)',
        draw: function (out, c) {
          out.appendChild(op('transformer/mix',
            'For each token, multiply the value vectors by its attention weights and add the results.'));
          out.appendChild(stage([
            grid(c.per.attn, { rows: TOKENS, cols: TOKENS, max: 1, caption: 'A' }),
            grid(c.per.v, { rows: TOKENS, caption: 'V' }),
            grid(c.per.out, { rows: TOKENS, caption: 'A V, this head’s output' })
          ]));
        }
      },
      {
        label: 'Concatenate the heads',
        from: '2 × (5, 4)', to: '(5, 8)',
        pfrom: '8 × (B, T, 64)', pto: '(B, T, 512)',
        draw: function (out, c) {
          out.appendChild(op('transformer/concat',
            'Join the head outputs along their feature dimension. In this example, h × d_v equals the model width d_model.'));
          out.appendChild(stage(grid(c.res.cat, {
            rows: TOKENS,
            caption: 'Columns 1 to ' + TOY.dk + ' are head 1. Columns ' +
              (TOY.dk + 1) + ' to ' + TOY.d + ' are head 2.'
          })));
          out.appendChild(note('In the paper h = ' + PAPER.h + ' and d_v = ' +
            PAPER.dv + ', and ' + PAPER.h + ' × ' + PAPER.dv + ' is ' +
            PAPER.h * PAPER.dv + ', which is d_model. That is why multi-head attention costs about the same as single-head attention.'));
        }
      },
      {
        label: 'Project with W^O',
        from: '(5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        draw: function (out, c) {
          out.appendChild(op(
            'transformer/multihead',
            'The output matrix combines the head outputs into one vector for each token.'));
          out.appendChild(stage(grid(c.res.out, {
            rows: TOKENS, cols: AXES, caption: 'The layer’s output'
          })));
          out.appendChild(note('The output has the same shape as the input. Therefore, the block can stack ' + PAPER.N + ' layers deep without changing the vector width.'));
        }
      }
    ];

    api = stepped(p.body, STEPS.map(function (x) { return x.label; }),
      function (i, out) {
        var step = STEPS[i], c = ctx();
        out.appendChild(trans(step.from, step.to, step.pfrom, step.pto));
        step.draw(out, c);
      });

    return p.host;
  };

  /* ── Module 1: block anatomy ────────────────────────────
     One encoder layer end to end, with the residual stream
     as the thing that never changes shape. The norm switch
     is the one real choice: the paper is post-norm, and
     pre-norm is what almost everything since has used. */
  PANEL.block = function () {
    var p = panel({
      title: 'The operations and parameters in one block',
      source: 'Sub-layer order and the residual rule from section 3.1, the feed-forward network from section 3.3, and the base model sizes from table 3 of Vaswani et al. (2017).'
    });

    var st = { pre: false };
    var api = null;

    function normChips() {
      return chips(['post-norm', 'pre-norm'], st.pre ? 1 : 0, function (i) {
        st.pre = i === 1;
        p.controls.replaceChild(normChips(), p.controls.firstChild);
        api.redraw();
      }, 'Position of layer normalisation');
    }
    p.controls.appendChild(normChips());

    /* Parameters per sub-layer, from the shapes the paper gives.
       Four d by d projections for attention, two d by d_ff for the
       feed-forward network. Biases and norms are a rounding error at
       this size and are left out, which the panel says. */
    var d = PAPER.d, dff = PAPER.dff, N = PAPER.N;
    var attnP = 4 * d * d;
    var ffP = 2 * d * dff;
    var encP = N * (attnP + ffP);
    var decP = N * (2 * attnP + ffP);

    var STEPS = [
      {
        label: 'Start with the input vectors',
        from: '(5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        draw: function (out) {
          out.appendChild(op('transformer/input',
            'These vectors form the residual stream, the representation passed between sub-layers. Each sub-layer adds an update of the same width. Therefore, the blocks can be repeated.'));
          out.appendChild(stage(grid(M.x0, {
            rows: TOKENS, cols: AXES, caption: 'The input residual stream'
          })));
        }
      },
      {
        label: 'Attention sub-layer',
        from: '(5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        draw: function (out) {
          out.appendChild(op(
            st.pre ? 'transformer/pre-attention' : 'transformer/attention',
            st.pre
              ? 'Pre-norm normalises the input before attention. The residual connection also keeps a direct copy of the input.'
              : 'In the original paper, attention uses the input directly. Layer normalisation follows the residual addition.'));
          out.appendChild(stage(grid(st.pre ? M.pre.mh.out : M.mh.out, {
            rows: TOKENS, cols: AXES, caption: 'The attention output added to the input'
          })));
        }
      },
      {
        label: 'Add and norm',
        from: '(5, 8) + (5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        draw: function (out) {
          out.appendChild(op(
            st.pre ? 'transformer/pre-residual'
              : 'transformer/post-residual',
            st.pre
              ? 'Pre-norm adds the attention output directly to the residual input. This arrangement can improve gradient behaviour. Whether training needs a warm-up schedule depends on the setup.'
              : 'Section 3.1 adds the sub-layer output to its input, then applies layer normalisation.'));
          out.appendChild(stage(grid(st.pre ? M.pre.res1 : M.res1, {
            rows: TOKENS, cols: AXES, caption: 'The residual stream after attention'
          })));
          if (!st.pre) {
            out.appendChild(note('With the example normalisation settings, each row has mean approximately 0 and variance approximately 1 across its ' + TOY.d + ' dimensions. Check any row by hand.'));
          }
        }
      },
      {
        label: 'Widen to d_ff',
        from: '(5, 8)', to: '(5, 32)',
        pfrom: '(B, T, 512)', pto: '(B, T, 2048)',
        draw: function (out) {
          out.appendChild(op('transformer/relu',
            'The same feed-forward network processes each token separately. This is called position-wise processing. Its hidden layer is four times wider than its input here.'));
          out.appendChild(stage(grid(st.pre ? M.pre.ff.act : M.ff.act, {
            rows: TOKENS, dense: true,
            caption: 'Each hidden-layer column is one unit. Hover over a cell to read its value.'
          })));
          var dead = 0, tot = 0;
          (st.pre ? M.pre.ff.act : M.ff.act).forEach(function (r) {
            r.forEach(function (v) { tot++; if (v === 0) dead++; });
          });
          out.appendChild(note('ReLU has zeroed ' + dead + ' of ' + tot +
            ' activations here. Blank cells show those zero values.'));
        }
      },
      {
        label: 'Narrow back to d_model',
        from: '(5, 32)', to: '(5, 8)',
        pfrom: '(B, T, 2048)', pto: '(B, T, 512)',
        draw: function (out) {
          out.appendChild(op('transformer/ffn',
            'The second matrix restores the original width. This lets the model add the result to the residual stream.'));
          out.appendChild(stage(grid(st.pre ? M.pre.ff.out : M.ff.out, {
            rows: TOKENS, cols: AXES, caption: 'The feed-forward output added to the input'
          })));
        }
      },
      {
        label: 'Add and norm again',
        from: '(5, 8) + (5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        draw: function (out) {
          out.appendChild(op(
            st.pre ? 'transformer/pre-ffn' : 'transformer/post-ffn',
            'This completes one block. Its output becomes the input to the next block.'));
          out.appendChild(stage(grid(st.pre ? M.pre.res2 : M.res2, {
            rows: TOKENS, cols: AXES, caption: 'The block output'
          })));
        }
      },
      {
        label: 'Count the parameters',
        from: 'shapes', to: 'a number',
        pfrom: null, pto: null,
        draw: function (out) {
          out.appendChild(op('transformer/parameter-count',
            'Attention uses four square weight matrices, W^Q, W^K, W^V, and W^O. The feed-forward network uses two rectangular weight matrices.'));
          out.appendChild(readout([
            ['one attention sub-layer', commas(attnP)],
            ['one feed-forward sub-layer', commas(ffP)],
            ['encoder, ' + N + ' layers', commas(encP)],
            ['decoder, ' + N + ' layers, two attention sub-layers each',
              commas(decP)],
            ['both stacks', commas(encP + decP)]
          ]));
          out.appendChild(note('The paper reports 65 million parameters for the base model. This count omits the shared embedding matrix, biases, and normalisation parameters. Therefore, it is smaller than the reported total.'));
        }
      }
    ];

    api = stepped(p.body, STEPS.map(function (x) { return x.label; }),
      function (i, out) {
        var step = STEPS[i];
        out.appendChild(trans(step.from, step.to, step.pfrom, step.pto));
        step.draw(out);
      });

    return p.host;
  };

  /* ── Module 2: position ─────────────────────────────────
     The sinusoid, computed rather than described, and the
     property the paper picked it for. */
  PANEL.position = function () {
    var p = panel({
      title: 'Adding token position information',
      source: 'Formulas and the reasoning for choosing sinusoids from Vaswani et al. (2017), section 3.5.'
    });

    var LEN = 16;
    var PE16 = sinusoid(LEN, TOY.d);
    var st = { pos: 3 };
    var api = null;

    p.controls.appendChild(slider({
      label: 'Position', min: 0, max: LEN - 1, value: st.pos, step: 1,
      format: function (v) { return String(v); }
    }, function (v) { st.pos = v; api.redraw(); }));

    var STEPS = [
      {
        label: 'Attention has no order',
        from: '(5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        draw: function (out) {
          out.appendChild(op('transformer/attention-output',
            'Without a mask or position information, attention alone does not represent order. Rearranging the input rows rearranges its output rows in the same way. Therefore, this model adds position information to the input vectors.'));
          out.appendChild(stage(grid(M.emb, {
            rows: TOKENS, cols: AXES,
            caption: 'Embeddings alone, scaled by √d_model'
          })));
        }
      },
      {
        label: 'One row per position',
        from: 'position', to: '(1, 8)',
        pfrom: 'pos', pto: '(1, 512)',
        draw: function (out) {
          out.appendChild(op(
            'transformer/position-pair',
            'Even dimensions take the sine, odd ones the cosine, and i is the index of the pair.'));
          out.appendChild(stage(grid([PE16[st.pos]], {
            rows: ['pos ' + st.pos], max: 1,
            caption: 'The encoding for position ' + st.pos
          })));
        }
      },
      {
        label: 'Each pair has its own wavelength',
        from: 'positions 0…15', to: '(16, 8)',
        pfrom: null, pto: null,
        draw: function (out) {
          out.appendChild(op('transformer/wavelength',
            'The first sine and cosine pair changes rapidly with position. Later pairs change more slowly. Together, these values distinguish positions in the displayed range.'));
          out.appendChild(stage(grid(PE16, {
            rows: PE16.map(function (_, i) { return String(i); }),
            max: 1, markRow: st.pos,
            caption: 'Rows show sixteen positions. Columns show eight dimensions.'
          })));
          var w = [0, 2, 4, 6].map(function (i) {
            return ['dims ' + i + ' and ' + (i + 1),
              (2 * Math.PI * Math.pow(10000, i / TOY.d)).toFixed(1) + ' positions'];
          });
          out.appendChild(readout(w));
          out.appendChild(note('At d_model = ' + PAPER.d + ' the paper has ' +
            PAPER.d / 2 + ' pairs, and the wavelengths run from 2π up to 10000 · 2π.'));
        }
      },
      {
        label: 'Add it to the embedding',
        from: '(5, 8) + (5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        draw: function (out) {
          out.appendChild(op('transformer/embedding',
            'First, scale the token embedding. Then add its position vector. The result contains information about both token identity and position.'));
          out.appendChild(stage([
            grid(M.emb, { rows: TOKENS, caption: 'embedding × √8' }),
            grid(M.pe, { rows: TOKENS, max: 1, caption: 'Position' }),
            grid(M.x0, { rows: TOKENS, caption: 'The sum passed into attention' })
          ]));
        }
      },
      {
        label: 'Why sinusoids',
        from: 'pos', to: 'pos + k',
        pfrom: null, pto: null,
        draw: function (out) {
          out.appendChild(op('transformer/position-offset',
            'For a fixed offset k, a linear transformation maps the encoding at pos to the encoding at pos + k. This property can help attention learn relationships between relative positions.'));
          var k = 2, a = st.pos, b = Math.min(LEN - 1, st.pos + k);
          out.appendChild(stage([
            grid([PE16[a]], { rows: ['pos ' + a], max: 1 }),
            grid([PE16[b]], { rows: ['pos ' + b], max: 1 })
          ]));
          out.appendChild(note('The paper also tried learned position embeddings and reports nearly identical results. It kept the sinusoid because it may let the model handle sequences longer than any it saw in training.'));
        }
      }
    ];

    api = stepped(p.body, STEPS.map(function (x) { return x.label; }),
      function (i, out) {
        var step = STEPS[i];
        out.appendChild(trans(step.from, step.to, step.pfrom, step.pto));
        step.draw(out);
      });

    return p.host;
  };

  /* ── Module 3: what the architecture costs ──────────────
     Table 1 of the paper, evaluated rather than quoted, plus
     the two numbers a serving engineer actually needs. */
  PANEL.cost = function () {
    var p = panel({
      title: 'What it costs, at a length you choose',
      source: 'Complexity, sequential operations and maximum path length are table 1 of Vaswani et al. (2017). The restricted row uses the neighbourhood size r the paper defines.'
    });

    var st = { n: 1024, d: 512, r: 64, k: 3 };
    var api = null;

    p.controls.appendChild(slider({
      label: 'Sequence length', min: 6, max: 17, value: 10, step: 1,
      format: function (v) { return commas(Math.pow(2, v)); }
    }, function (v) { st.n = Math.pow(2, v); api.redraw(); }));

    var STEPS = [
      {
        label: 'Table 1, evaluated',
        from: 'n and d', to: 'operations',
        pfrom: null, pto: null,
        draw: function (out) {
          var n = st.n, d = st.d, r = st.r, k = st.k;
          out.appendChild(op('transformer/operation-count',
            'Compare the approximate operation counts for four types of layer. Move the slider to see how sequence length affects each count.'));
          out.appendChild(readout([
            ['self-attention, per layer', commas(n * n * d)],
            ['recurrent, per layer', commas(n * d * d)],
            ['convolutional, per layer, k = ' + k, commas(k * n * d * d)],
            ['restricted self-attention, r = ' + r, commas(r * n * d)]
          ]));
          out.appendChild(note(n < d
            ? 'At n = ' + commas(n) + ', shorter than d = ' + d +
              ', self-attention is the cheaper layer. The paper notes this is the case for most sentence representations used in translation.'
            : 'At n = ' + commas(n) + ', at least as large as d = ' + d +
              ', the displayed self-attention count is at least as large as the recurrent count. These formulas are equal at n = d.'));
        }
      },
      {
        label: 'Compare paths between positions',
        from: 'n positions', to: 'path length',
        pfrom: null, pto: null,
        draw: function (out) {
          out.appendChild(op('maximum path length between any two positions',
            'Path length counts the processing steps connecting two positions. The paper argues that shorter paths can make relationships between distant tokens easier to learn.'));
          out.appendChild(readout([
            ['self-attention', {math: 'transformer/path-constant'}],
            ['recurrent', {math: 'transformer/path-recurrent', values: {count: commas(st.n)}}],
            ['convolutional, dilated', {math: 'transformer/path-convolution', values: {count: Math.ceil(Math.log(st.n) / Math.log(st.k))}}],
            ['restricted self-attention', {math: 'transformer/path-restricted', values: {count: Math.ceil(st.n / st.r)}}]
          ]));
          out.appendChild(note('Sequential operations must wait for earlier steps. A self-attention layer has O(1) sequential steps across positions, while a recurrent layer has O(n). Thus, recurrence limits parallel processing.'));
        }
      },
      {
        label: 'The key-value cache',
        from: 'one token', to: 'bytes held',
        pfrom: null, pto: null,
        draw: function (out) {
          var N = PAPER.N, hh = PAPER.h, dh = PAPER.dk, B = 2;
          var per = 2 * N * hh * dh * B;
          out.appendChild(op('transformer/cache',
            'The factor two counts both keys and values. A full-context cache stores another row for each generated token, so its memory use grows with sequence length.'));
          out.appendChild(readout([
            ['per token, base model, 16-bit', bytes(per)],
            ['at ' + commas(st.n) + ' tokens', bytes(per * st.n)],
            ['at ' + commas(st.n) + ' tokens, batch of 32', bytes(per * st.n * 32)]
          ]));
          out.appendChild(note('Grouped-query attention shares keys and values across several query heads. In this calculation, use the number of key-value heads instead of the number of query heads.'));
        }
      },
      {
        label: 'What FlashAttention changes',
        from: '(n, n) in memory', to: 'tiles',
        pfrom: null, pto: null,
        draw: function (out) {
          out.appendChild(op('transformer/tiled-attention',
            'FlashAttention computes the same attention operation in small blocks. It avoids storing the full n by n score matrix in main GPU memory. Each block is used as part of the calculation, then discarded.'));
          out.appendChild(stage(grid(M.mh.per[0].attn, {
            rows: TOKENS, cols: TOKENS, max: 1,
            caption: 'The full matrix stored by a basic implementation'
          })));
          out.appendChild(readout([
            ['scores held, naive, at ' + commas(st.n) + ' tokens, 16-bit',
              bytes(st.n * st.n * 2)],
            ['scores held, tiled', 'one tile at a time']
          ]));
          out.appendChild(note('FlashAttention reduces data transfers between GPU memory levels. It preserves the attention operation, subject to normal floating-point differences.'));
        }
      }
    ];

    api = stepped(p.body, STEPS.map(function (x) { return x.label; }),
      function (i, out) {
        var step = STEPS[i];
        out.appendChild(trans(step.from, step.to, step.pfrom, step.pto));
        step.draw(out);
      });

    return p.host;
  };

  /* ── Module 5: inference ────────────────────────────────
     Prefill against decode, and a real sampling step taken
     against real logits. The logits come from the tied
     embedding of section 3.4, so the last arrow of the
     architecture is drawn from the same weights as the
     first. */
  PANEL.decode = function () {
    var p = panel({
      title: 'Calculating the next-token probabilities',
      source: 'Weight tying between the embedding and the output projection is section 3.4 of Vaswani et al. (2017). The vocabulary here is the five words on this page.'
    });

    var st = { temp: 1 };
    var api = null;

    p.controls.appendChild(slider({
      label: 'Temperature', min: 0.1, max: 2, value: 1, step: 0.05,
      format: function (v) { return v.toFixed(2); }
    }, function (v) { st.temp = v; api.redraw(); }));

    /* Section 3.4 shares one matrix between the embedding layers and the
       pre-softmax projection, so the logits are the final hidden state
       read back against the same vectors the input was built from. */
    var last = [M.res2[T - 1]];
    var logits = matmul(last, transpose(E))[0];

    function probs(temp) {
      return softmaxRows([logits.map(function (v) { return v / temp; })])[0];
    }

    var STEPS = [
      {
        label: 'Prefill the prompt',
        from: '(5, 8)', to: '(5, 8) + cache',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        draw: function (out) {
          out.appendChild(op('one forward pass over all T positions',
            'Prefill processes the prompt positions together. For sufficiently large prompts or batches, the main limit is often computation rather than moving weights from memory.'));
          out.appendChild(stage(grid(M.res2, {
            rows: TOKENS, cols: AXES, caption: 'The model output for all prompt positions'
          })));
        }
      },
      {
        label: 'Decode one token at a time',
        from: '(1, 8)', to: '(1, 8)',
        pfrom: '(B, 1, 512)', pto: '(B, 1, 512)',
        draw: function (out) {
          out.appendChild(op('one forward pass over a single position',
            'After prefill, each decoding step computes the next position. At small batch sizes, reading model weights and cached values often limits speed more than computation.'));
          out.appendChild(stage(grid(last, {
            rows: [TOKENS[T - 1]], cols: AXES,
            caption: 'The new row computed during this step'
          })));
          out.appendChild(note('Processing several requests together can reuse weights across more calculations. This can improve decoding throughput, although it also affects latency and memory use.'));
        }
      },
      {
        label: 'Project to the vocabulary',
        from: '(1, 8)', to: '(1, 5)',
        pfrom: '(B, 1, 512)', pto: '(B, 1, 37000)',
        draw: function (out) {
          out.appendChild(op('transformer/logits',
            'Section 3.4 shares the embedding weights with the output projection. The dot product between the final hidden vector and each token embedding gives that token a score, called a logit.'));
          out.appendChild(stage(grid([logits], {
            rows: ['logit'], cols: TOKENS,
            caption: 'One score per token in the vocabulary'
          })));
        }
      },
      {
        label: 'Turn scores into a choice',
        from: '(1, 5)', to: 'one token',
        pfrom: '(B, 1, 37000)', pto: '(B, 1)',
        draw: function (out) {
          var pr = probs(st.temp);
          var top = pr.indexOf(Math.max.apply(null, pr));
          out.appendChild(op('transformer/temperature',
            'A temperature below one increases the probability of higher-scoring tokens. A temperature above one spreads probability more evenly, making lower-scoring tokens more likely to be sampled.'));
          out.appendChild(stage(grid([pr], {
            rows: ['p'], cols: TOKENS, max: 1,
            caption: 'At temperature ' + st.temp.toFixed(2)
          })));
          out.appendChild(readout([
            ['greedy pick', TOKENS[top]],
            ['its probability', (100 * pr[top]).toFixed(1) + '%'],
            ['probability of the least likely word',
              (100 * Math.min.apply(null, pr)).toFixed(1) + '%']
          ]));
          out.appendChild(note('The example weights were chosen to illustrate attention. They were not trained for text prediction, so the highest-scoring token need not be a sensible continuation.'));
        }
      }
    ];

    api = stepped(p.body, STEPS.map(function (x) { return x.label; }),
      function (i, out) {
        var step = STEPS[i];
        out.appendChild(trans(step.from, step.to, step.pfrom, step.pto));
        step.draw(out);
      });

    return p.host;
  };

  /* ── Module 4: the whole architecture ───────────────────
     Figure 1 of the paper, redrawn so every box can be
     opened. Picking a box says what goes in, what the box
     does, and what comes out, with the tensor where one
     exists.

     The three variants are not three diagrams. They are the
     same diagram with parts switched off, which is the point
     the module is making: one block, used three ways. */
  PANEL.figure1 = function () {
    var p = panel({
      title: 'Explore the complete architecture',
      source: 'Redrawn from figure 1 of Vaswani et al. (2017). The three ways attention is used are section 3.2.3.'
    });

    /* The viewBox is cropped to what the drawing actually occupies. The
       figure gets a fixed column, so every unit of unused width shrinks
       the labels; at the full 560 they rendered at about four pixels. */
    var VX = 28, VW = 482, HH = 660;
    var st = { mode: 0, node: 'enc-mha' };
    /* Which boxes each variant keeps. A decoder-only model drops the
       cross-attention sub-layer and the Add & Norm that follows it,
       because there is no encoder for it to read. */
    var MODES = [
      { name: 'encoder–decoder', keeps: null },
      { name: 'encoder only', keeps: /^(in|enc)/ },
      { name: 'decoder only', keeps: /^(out|dec|head)/, drops: /^dec-(cross|an2)$/ }
    ];

    /* The forward pass down each column. Wires are drawn between
       consecutive *visible* entries, so switching variant reconnects
       the chain instead of leaving a gap where a box used to be. */
    var ENC_ORDER = ['in-tokens', 'in-embed', 'in-pe',
                     'enc-mha', 'enc-an1', 'enc-ff', 'enc-an2'];
    var DEC_ORDER = ['out-tokens', 'out-embed', 'out-pe',
                     'dec-mmha', 'dec-an1', 'dec-cross', 'dec-an2',
                     'dec-ff', 'dec-an3',
                     'head-linear', 'head-softmax', 'head-probs'];

    /* x centres for the two stacks. */
    var EX = 155, DX = 400;

    var NODES = [
      { id: 'in-tokens', x: EX, y: 618, w: 150, h: 26, label: 'Inputs', soft: true,
        from: 'text', to: '(5 tokens)', pfrom: 'text', pto: '(B, T)',
        formula: 'the source sentence',
        said: 'The input sentence contains the five example tokens shown on this page.' },
      { id: 'in-embed', x: EX, y: 566, w: 150, h: 30, label: 'Input Embedding',
        from: '(5 tokens)', to: '(5, 8)', pfrom: '(B, T)', pto: '(B, T, 512)',
        formula: 'transformer/lookup',
        said: 'Each token has an embedding vector. Scale that vector before adding its position encoding.',
        tensor: function () { return { m: M.emb, cols: AXES }; } },
      { id: 'in-pe', x: EX, y: 514, w: 150, h: 30, label: '⊕  Positional Encoding',
        from: '(5, 8) + (5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        formula: 'transformer/position',
        said: 'Add a position vector to each token embedding. This supplies order information that unmasked attention alone does not contain.',
        tensor: function () { return { m: M.x0, cols: AXES }; } },
      { id: 'enc-mha', x: EX, y: 440, w: 150, h: 34, label: 'Multi-Head Attention',
        from: '(5, 8)', to: '(5, 8)', pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        formula: 'transformer/encoder-heads',
        said: 'Encoder self-attention computes queries, keys, and values from the same input. Each position can use information from every input position.',
        tensor: function () { return { m: M.mh.out, cols: AXES }; } },
      { id: 'enc-an1', x: EX, y: 392, w: 150, h: 28, label: 'Add & Norm',
        from: '(5, 8) + (5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        formula: 'transformer/sublayer',
        said: 'Add the sub-layer output to its input. Then normalise the sum.',
        tensor: function () { return { m: M.res1, cols: AXES }; } },
      { id: 'enc-ff', x: EX, y: 330, w: 150, h: 34, label: 'Feed Forward',
        from: '(5, 8)', to: '(5, 8)', pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        formula: 'transformer/ffn',
        said: 'The first matrix increases the width to d_ff. ReLU sets negative activations to zero. The second matrix restores the input width. Apply these operations separately at every position.',
        tensor: function () { return { m: M.ff.out, cols: AXES }; } },
      { id: 'enc-an2', x: EX, y: 282, w: 150, h: 28, label: 'Add & Norm',
        from: '(5, 8) + (5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        formula: 'transformer/post-ffn',
        said: 'This completes an encoder layer. The paper uses six such layers, and the decoder uses the final encoder output.',
        tensor: function () { return { m: M.res2, cols: AXES }; } },

      { id: 'out-tokens', x: DX, y: 618, w: 186, h: 26,
        label: 'Outputs (shifted right)', soft: true,
        from: 'text', to: '(5 tokens)', pfrom: 'text', pto: '(B, T)',
        formula: 'the answer so far, moved one place right',
        said: 'Shift the target sequence one position to the right before giving it to the decoder. Together with the causal mask, this hides the token each position must predict.' },
      { id: 'out-embed', x: DX, y: 566, w: 186, h: 30, label: 'Output Embedding',
        from: '(5 tokens)', to: '(5, 8)', pfrom: '(B, T)', pto: '(B, T, 512)',
        formula: 'the same matrix as the input embedding',
        said: 'Section 3.4 shares one matrix between both embedding layers and the projection before the softmax.',
        tensor: function () { return { m: M.emb, cols: AXES }; } },
      { id: 'out-pe', x: DX, y: 514, w: 186, h: 30, label: '⊕  Positional Encoding',
        from: '(5, 8) + (5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        formula: 'the same sinusoid as the encoder side',
        said: 'The decoder uses the same position-encoding formula and wavelengths as the encoder.',
        tensor: function () { return { m: M.x0, cols: AXES }; } },
      { id: 'dec-mmha', x: DX, y: 440, w: 186, h: 34,
        label: 'Masked Multi-Head Attention',
        from: '(5, 8)', to: '(5, 8)', pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        formula: 'transformer/decoder-mask',
        said: 'Decoder self-attention blocks later positions. With shifted targets, this prevents the model from reading the answer during training.',
        tensor: function () {
          return { m: M.mhMasked.per[0].attn, rows: TOKENS, cols: TOKENS, max: 1 };
        } },
      { id: 'dec-an1', x: DX, y: 392, w: 186, h: 28, label: 'Add & Norm',
        from: '(5, 8) + (5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        formula: 'transformer/masked-residual',
        said: 'The updated decoder vectors now provide the queries for attention over the encoder output.',
        tensor: function () { return { m: M.dec.self, cols: AXES }; } },
      { id: 'dec-cross', x: DX, y: 330, w: 186, h: 34, label: 'Multi-Head Attention',
        from: 'Q (5, 8), K V (5, 8)', to: '(5, 8)',
        pfrom: 'Q (B, T, 512), K V (B, S, 512)', pto: '(B, T, 512)',
        formula: 'transformer/cross-attention',
        said: 'Cross-attention connects the decoder to the encoder. Queries come from the decoder representation, while keys and values come from the encoder output. Thus, each decoder position can use the whole source sequence.',
        tensor: function () {
          return { m: M.dec.cross.per[0].attn, rows: TOKENS, cols: TOKENS, max: 1,
                   cap: 'Rows are decoder positions. Columns are source positions.' };
        } },
      { id: 'dec-an2', x: DX, y: 282, w: 186, h: 28, label: 'Add & Norm',
        from: '(5, 8) + (5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        formula: 'transformer/cross-residual',
        said: 'Add the cross-attention output to the decoder input, then normalise the sum.',
        tensor: function () { return { m: M.dec.res2, cols: AXES }; } },
      { id: 'dec-ff', x: DX, y: 222, w: 186, h: 34, label: 'Feed Forward',
        from: '(5, 8)', to: '(5, 8)', pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        formula: 'transformer/ffn',
        said: 'The decoder feed-forward network has the same input and output widths as the encoder feed-forward network.',
        tensor: function () { return { m: M.dec.ff.out, cols: AXES }; } },
      { id: 'dec-an3', x: DX, y: 174, w: 186, h: 28, label: 'Add & Norm',
        from: '(5, 8) + (5, 8)', to: '(5, 8)',
        pfrom: '(B, T, 512)', pto: '(B, T, 512)',
        formula: 'transformer/post-ffn',
        said: 'This completes one decoder layer. The paper uses six layers.',
        tensor: function () { return { m: M.dec.res3, cols: AXES }; } },
      { id: 'head-linear', x: DX, y: 118, w: 186, h: 30, label: 'Linear',
        from: '(5, 8)', to: '(5, 5)', pfrom: '(B, T, 512)', pto: '(B, T, 37000)',
        formula: 'transformer/logits',
        said: 'Multiply by the transpose of the shared embedding matrix to obtain one score per vocabulary token.' },
      { id: 'head-softmax', x: DX, y: 70, w: 186, h: 30, label: 'Softmax',
        from: '(5, 5)', to: '(5, 5)', pfrom: '(B, T, 37000)', pto: '(B, T, 37000)',
        formula: 'transformer/softmax',
        said: 'Softmax converts the token scores into probabilities that add up to one.' },
      { id: 'head-probs', x: DX, y: 24, w: 186, h: 26,
        label: 'Output Probabilities', soft: true,
        from: '(5, 5)', to: 'one token', pfrom: '(B, T, 37000)', pto: '(B, T)',
        formula: 'pick, or sample',
        said: 'During training, the loss uses the probability of the observed target token. During generation, the model selects a token and appends it to the decoder input.' }
    ];

    var byId = {};
    NODES.forEach(function (n) { byId[n.id] = n; });

    function shown(n) {
      var m = MODES[st.mode];
      if (m.drops && m.drops.test(n.id)) return false;
      return !m.keeps || m.keeps.test(n.id);
    }

    function modeChips() {
      return chips(MODES.map(function (m) { return m.name; }), st.mode,
        function (i) {
          st.mode = i;
          p.controls.replaceChild(modeChips(), p.controls.firstChild);
          if (!shown(byId[st.node])) {
            st.node = i === 1 ? 'enc-mha' : 'dec-mmha';
          }
          draw();
        }, 'Which stack');
    }
    p.controls.appendChild(modeChips());

    var figure = h('div', { 'class': 'tf-fig' });
    var detail = h('div', { 'class': 'tf-detail' });
    p.body.appendChild(h('div', { 'class': 'tf-figsplit' }, [figure, detail]));

    function box(n) {
      var on = n.id === st.node;
      var cls = 'tf-node' + (on ? ' is-on' : '') + (n.soft ? ' is-soft' : '') +
        (shown(n) ? '' : ' is-off');
      var g = svg('g', {
        'class': cls, tabindex: '0', role: 'button',
        'aria-pressed': on ? 'true' : 'false',
        'aria-label': n.label,
        on: {
          click: function () { st.node = n.id; draw(); },
          keydown: function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault(); st.node = n.id; draw();
            }
          }
        }
      });
      g.appendChild(svg('rect', {
        x: n.x - n.w / 2, y: n.y - n.h / 2, width: n.w, height: n.h, rx: 4
      }));
      g.appendChild(svg('text', {
        x: n.x, y: n.y + 4, 'text-anchor': 'middle', text: n.label
      }));
      return g;
    }

    function arrow(x1, y1, x2, y2, cls) {
      return svg('path', {
        'class': 'tf-wire' + (cls ? ' ' + cls : ''),
        d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2,
        'marker-end': 'url(#tf-arrow)'
      });
    }

    function drawFigure() {
      figure.textContent = '';
      var root = svg('svg', {
        viewBox: VX + ' 0 ' + VW + ' ' + HH, 'class': 'tf-svg',
        role: 'group', 'aria-label': 'The transformer architecture, figure 1'
      });
      var defs = svg('defs', {}, svg('marker', {
        id: 'tf-arrow', viewBox: '0 0 8 8', refX: 7, refY: 4,
        markerWidth: 5, markerHeight: 5, orient: 'auto-start-reverse'
      }, svg('path', { d: 'M0 0 L8 4 L0 8 z', 'class': 'tf-arrowhead' })));
      root.appendChild(defs);

      /* The Nx frames, drawn first so the boxes sit on top. */
      [['enc', EX, 262, 200], ['dec', DX, 154, 320]].forEach(function (f) {
        var vis = f[0] === 'enc' ? MODES[st.mode].keeps !== MODES[2].keeps
          : MODES[st.mode].keeps !== MODES[1].keeps;
        root.appendChild(svg('rect', {
          'class': 'tf-frame' + (vis ? '' : ' is-off'),
          x: f[1] - (f[0] === 'enc' ? 92 : 104), y: f[2],
          width: f[0] === 'enc' ? 184 : 208, height: f[3], rx: 8
        }));
        root.appendChild(svg('text', {
          'class': 'tf-frame-k' + (vis ? '' : ' is-off'),
          x: f[1] - (f[0] === 'enc' ? 98 : 112), y: f[2] + 16,
          'text-anchor': 'end', text: 'N×'
        }));
      });

      /* One wire between each pair of consecutive visible boxes. */
      [ENC_ORDER, DEC_ORDER].forEach(function (order) {
        var live = order.map(function (id) { return byId[id]; }).filter(shown);
        live.forEach(function (a, i) {
          var b = live[i + 1];
          if (!b) return;
          root.appendChild(arrow(a.x, a.y - a.h / 2, b.x, b.y + b.h / 2 + 4));
        });
      });

      /* The one wire that is not a straight line: the encoder output
         crossing to the decoder's keys and values. */
      if (shown(byId['enc-an2']) && shown(byId['dec-cross'])) {
        root.appendChild(svg('path', {
          'class': 'tf-wire tf-wire-cross',
          d: 'M' + (EX + 92) + ' 282 L' + (DX - 116) + ' 282 L' +
            (DX - 116) + ' 330 L' + (DX - 95) + ' 330',
          'marker-end': 'url(#tf-arrow)'
        }));
        root.appendChild(svg('text', {
          'class': 'tf-wire-k', x: (EX + DX) / 2 - 10, y: 274,
          'text-anchor': 'middle', text: 'K, V'
        }));
      }

      NODES.forEach(function (n) { root.appendChild(box(n)); });
      figure.appendChild(root);
    }

    function drawDetail() {
      detail.textContent = '';
      var n = byId[st.node];
      if (!n) return;
      detail.appendChild(h('h4', { 'class': 'tf-detail-k', text: n.label }));
      detail.appendChild(trans(n.from, n.to, n.pfrom, n.pto));
      detail.appendChild(op(n.formula, n.said));
      if (n.tensor && shown(n)) {
        var t = n.tensor();
        detail.appendChild(stage(grid(t.m, {
          rows: t.rows || TOKENS, cols: t.cols, max: t.max,
          caption: t.cap || 'What leaves this box'
        })));
      }
      if (!shown(n)) {
        detail.appendChild(note('This box is not used in the ' +
          MODES[st.mode].name + ' variant.'));
      }
    }

    function draw() { drawFigure(); drawDetail(); }
    draw();

    p.body.appendChild(h('p', { 'class': 'tf-hint' },
      'Pick any box to see what goes in and what comes out.'));

    return p.host;
  };

  /* ════════════════════════════════════════════════════════
     4. Mount
     ════════════════════════════════════════════════════════ */

  /* One panel per module of the transformers track, matching the
     module order in _data/interview.yml. */
  var BY_MODULE = {
    0: PANEL.attention,
    1: PANEL.block,
    2: PANEL.position,
    3: PANEL.cost,
    4: PANEL.figure1,
    5: PANEL.decode
  };

  function init() {
    var page = $('.syl-page[data-topic="transformers"]');
    if (!page) return;
    $$('.syl-module', page).forEach(function (mod) {
      var i = +mod.getAttribute('data-i');
      var make = BY_MODULE[i];
      if (!make) return;
      var slot = $('[data-tf]', mod);
      if (!slot) return;
      try {
        slot.appendChild(make());
        slot.hidden = false;
      } catch (err) {
        /* A broken panel must not take the rest of the page with it. */
        if (window.console) window.console.error('transformer panel ' + i, err);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
