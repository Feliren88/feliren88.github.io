/* ════════════════════════════════════════════════════════
   Explainers on /transformers/.

   [data-xp="gpt2"]  follows real GPT-2 (small) activations through the model on
                     one canvas, after Transformer Explainer (Polo Club of Data
                     Science, MIT): ribbons carry each token left to right, hover
                     reads a value, ⊕ opens the numbers, a guide card walks
                     through the parts.
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

  var esc = XP.esc, fmt = XP.fmt, tint = XP.tint;
  /* GPT-2 marks a leading space with a byte; show it as a visible dot. */
  function tok(s) { return esc(s).replace(/^ /, '\u00b7'); }

  /* ════════════════════════════════════════════════════════
     GPT-2, traced
     ════════════════════════════════════════════════════════ */

  function gpt2(host) {
    var W = 1400, H = 640;
    var data, tipper, dlg, guideCard;
    var S = { ex: 0, block: 0, head: 0, temp: 0.8, mode: 'k', k: 5, p: 0.9, sampled: null, focusTok: null, stage: 3 };
    var STAGES = ['Query-key product', 'Scale scores', 'Mask', 'Softmax'];
    var STAGE_MATH = ['gpt/score', 'gpt/scale'];
    function stageLabel(at) { return at < 2 ? window.InterviewDisplayMath.html(STAGE_MATH[at], {}, true) : STAGES[at]; }
    var svgEl = XP.svgEl, ribbon = XP.ribbon, curve = XP.curve;

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
    var softmaxRow = XP.softmax;
    function weights(b, h) { return matrix(b, h).map(softmaxRow); }
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
        tail += bc[1] * Math.exp((E.rest.lo + (bc[0] + 0.5) * E.rest.w - m) / T);
      });
      Z += tail;
      var probs = num.map(function (x) { return x / Z; });
      var keep = probs.map(function () { return false; }), covered = 0, reachedTail = false;
      if (S.mode === 'k') {
        for (var i = 0; i < Math.min(S.k, probs.length); i++) keep[i] = true;
      } else {
        for (var j = 0; j < probs.length; j++) {
          keep[j] = true; covered += probs[j];
          if (covered >= S.p) break;
        }
        if (covered < S.p) reachedTail = true;
      }
      var ks = 0;
      probs.forEach(function (p, i) { if (keep[i]) ks += p; });
      return { probs: probs, tail: tail / Z, keep: keep, reachedTail: reachedTail,
        kept: probs.map(function (p, i) { return keep[i] ? p / ks : 0; }) };
    }

    /* ── geometry ── */
    function geo() {
      var N = n(), row = Math.min(46, 290 / (N - 1));
      var g = { N: N, rowY: [], qkvY: [], slot: 0, key: [], qry: [], val: [], MX: 610, MY: 330, CS: 21 };
      for (var i = 0; i < N; i++) g.rowY.push(96 + i * row);
      var band = 470 / N;
      g.slot = (band - 8) / 3;
      for (var j = 0; j < N; j++) {
        var top = 88 + j * band;
        g.qkvY.push([top + g.slot / 2, top + g.slot * 1.5, top + g.slot * 2.5]);
        g.key.push(206 + j * 13);
        g.qry.push(g.MY + j * g.CS);
        g.val.push(516 + j * 13);
      }
      return g;
    }

    function drawCanvas() {
      var E = Ex(), g = geo(), N = g.N, A = weights(S.block, S.head), D = dist();
      var s = '';
      var tok = function (t) { return t.replace(/^ /, ''); };

      /* Residual stream: the arcs that skip around attention and the MLP. */
      s += svgEl('g', { 'data-part': 'residual', 'class': 'xp-res' },
        svgEl('path', { d: 'M150 70 C150 52 170 50 190 50 L900 50 C920 50 930 52 930 70' }) +
        svgEl('path', { d: 'M990 70 C990 52 1000 50 1020 50 L1110 50 C1125 50 1130 52 1130 70' }) +
        svgEl('text', { x: 540, y: 44, 'text-anchor': 'middle', 'class': 'xp-cv-lab' }, 'residual') +
        svgEl('text', { x: 1060, y: 44, 'text-anchor': 'middle', 'class': 'xp-cv-lab' }, 'residual'));

      /* Head card and the stack of 11 more heads behind it. */
      for (var k = 3; k >= 1; k--) {
        s += svgEl('rect', { x: 452 + k * 7, y: 176 + k * 7, width: 410, height: 440, rx: 6, 'class': 'xp-card is-back', 'data-part': 'heads' });
      }
      s += svgEl('rect', { x: 452, y: 176, width: 410, height: 440, rx: 6, 'class': 'xp-card', 'data-part': 'heads attn key query value out' });

      /* Rows: token label, embedding bar, ribbon into its Q, K and V. */
      E.tokens.forEach(function (t, i) {
        var y = g.rowY[i], q = g.qkvY[i], cls = S.sampled !== null && i === N - 1 ? '' : '';
        s += svgEl('g', { 'data-tok': i, 'class': 'xp-row' + cls },
          svgEl('text', { x: 124, y: y + 5, 'text-anchor': 'end', 'class': 'xp-cv-tok', 'data-part': 'tokens' }, tok(t)) +
          svgEl('rect', { x: 132, y: y - 11, width: 16, height: 22, rx: 2, 'class': 'xp-emb', 'data-part': 'emb' }) +
          svgEl('path', { d: ribbon(148, y, 214, (q[0] + q[2]) / 2, 22, g.slot * 3), 'class': 'xp-rib', 'data-part': 'emb qkv' }) +
          svgEl('rect', { x: 214, y: q[0] - g.slot / 2, width: 16, height: g.slot, 'class': 'xp-q', 'data-part': 'qkv query' }) +
          svgEl('rect', { x: 214, y: q[1] - g.slot / 2, width: 16, height: g.slot, 'class': 'xp-k', 'data-part': 'qkv key' }) +
          svgEl('rect', { x: 214, y: q[2] - g.slot / 2, width: 16, height: g.slot, 'class': 'xp-v', 'data-part': 'qkv value' }) +
          svgEl('path', { d: curve(230, q[1], 566, g.key[i]), 'class': 'xp-line is-k', 'data-part': 'key' }) +
          svgEl('path', { d: curve(230, q[0], 566, g.qry[i]), 'class': 'xp-line is-q', 'data-part': 'query' }) +
          svgEl('path', { d: curve(230, q[2], 566, g.val[i]), 'class': 'xp-line is-v', 'data-part': 'value' }) +
          svgEl('text', { x: 562, y: g.key[i] + 3, 'text-anchor': 'end', 'class': 'xp-cv-small', 'data-part': 'key' }, tok(t)) +
          svgEl('text', { x: 562, y: g.qry[i] + 3, 'text-anchor': 'end', 'class': 'xp-cv-small', 'data-part': 'query' }, tok(t)) +
          svgEl('text', { x: 562, y: g.val[i] + 3, 'text-anchor': 'end', 'class': 'xp-cv-small', 'data-part': 'value' }, tok(t)) +
          /* each key's line turns down into its column of the matrix */
          svgEl('path', { d: 'M568 ' + g.key[i] + ' L' + (g.MX + i * g.CS - 8) + ' ' + g.key[i] + ' Q' + (g.MX + i * g.CS) + ' ' + g.key[i] + ' ' + (g.MX + i * g.CS) + ' ' + (g.key[i] + 8) + ' L' + (g.MX + i * g.CS) + ' ' + (g.MY - 12), 'class': 'xp-line is-k', 'data-part': 'key' }) +
          svgEl('path', { d: 'M568 ' + g.qry[i] + ' L' + (g.MX - 12) + ' ' + g.qry[i], 'class': 'xp-line is-q', 'data-part': 'query' }));
      });
      s += svgEl('text', { x: 562, y: 190, 'text-anchor': 'end', 'class': 'xp-cv-head is-k', 'data-part': 'key' }, 'Key');
      s += svgEl('text', { x: 562, y: g.MY - 14, 'text-anchor': 'end', 'class': 'xp-cv-head is-q', 'data-part': 'query' }, 'Query');
      s += svgEl('text', { x: 562, y: 500, 'text-anchor': 'end', 'class': 'xp-cv-head is-v', 'data-part': 'value' }, 'Value');

      /* The attention weights as dots: size and depth of colour are the weight. */
      var dots = '';
      A.forEach(function (row, i) {
        row.forEach(function (w, j) {
          var cx = g.MX + j * g.CS, cy = g.MY + i * g.CS;
          dots += j > i
            ? svgEl('circle', { cx: cx, cy: cy, r: 2.2, 'class': 'xp-dot is-masked', 'data-tok': i + ' ' + j, 'data-q': i, 'data-k': j })
            : svgEl('circle', { cx: cx, cy: cy, r: 3 + 6.5 * Math.sqrt(w), 'class': 'xp-dot', style: 'fill-opacity:' + (0.18 + 0.82 * w).toFixed(2), 'data-tok': i + ' ' + j, 'data-q': i, 'data-k': j });
        });
      });
      s += svgEl('g', { 'data-part': 'attn' }, dots);

      /* Out: each row of weights mixes the values into one vector per token. */
      var outX = 812, out = '';
      E.tokens.forEach(function (t, i) {
        var y = g.qry[i];
        out += svgEl('path', { d: curve(g.MX + (N - 1) * g.CS + 12, y, outX - 6, y), 'class': 'xp-line is-o', 'data-tok': i }) +
          svgEl('rect', { x: outX - 6, y: y - 2, width: 14, height: 4, 'class': 'xp-o', 'data-tok': i });
      });
      out += svgEl('path', { d: ribbon(570, (g.val[0] + g.val[N - 1]) / 2, outX - 6, (g.qry[0] + g.qry[N - 1]) / 2, g.val[N - 1] - g.val[0] + 10, g.qry[N - 1] - g.qry[0] + 6), 'class': 'xp-rib is-v' });
      out += svgEl('text', { x: outX + 2, y: g.MY - 14, 'text-anchor': 'middle', 'class': 'xp-cv-head is-o' }, 'Out');
      s += svgEl('g', { 'data-part': 'out value' }, out);

      /* MLP: back to one row per token, widen to 3,072 and narrow again. */
      var mlp = '';
      E.tokens.forEach(function (t, i) {
        var y = g.rowY[i];
        mlp += svgEl('g', { 'data-tok': i },
          svgEl('path', { d: ribbon(outX + 8, g.qry[i], 922, y, 4, 22), 'class': 'xp-rib is-o', 'data-part': 'out mlp' }) +
          svgEl('rect', { x: 922, y: y - 11, width: 16, height: 22, rx: 2, 'class': 'xp-emb is-o', 'data-part': 'mlp' }) +
          svgEl('path', { d: ribbon(938, y, 1010, 330, 22, 440 / N), 'class': 'xp-rib is-m', 'data-part': 'mlp' }) +
          svgEl('path', { d: ribbon(1034, 330, 1106, y, 440 / N, 22), 'class': 'xp-rib is-m', 'data-part': 'mlp' }) +
          svgEl('rect', { x: 1106, y: y - 11, width: 16, height: 22, rx: 2, 'class': 'xp-emb is-o', 'data-part': 'mlp blocks' }));
      });
      mlp += svgEl('rect', { x: 1010, y: 100, width: 24, height: 460, rx: 3, 'class': 'xp-mlp-h', 'data-part': 'mlp' });
      s += mlp;

      /* 11 more identical blocks. */
      var more = '';
      for (var b2 = 0; b2 < 6; b2++) more += svgEl('rect', { x: 1134 + b2 * 4, y: g.rowY[0] - 11, width: 3, height: g.rowY[N - 1] - g.rowY[0] + 22, 'class': 'xp-more' });
      s += svgEl('g', { 'data-part': 'blocks' }, more +
        svgEl('text', { x: 1146, y: g.rowY[N - 1] + 34, 'text-anchor': 'middle', 'class': 'xp-cv-lab' }, '× 11 more'));

      /* Probabilities: the last token's vector becomes a score for every token. */
      var shown = 8, maxP = D.probs[0], py0 = 92, pdy = 29, pr = '';
      pr += svgEl('path', { d: ribbon(1162, g.rowY[N - 1], 1192, py0 + (shown - 1) * pdy / 2, 22, shown * pdy - 10), 'class': 'xp-rib is-p' });
      E.top.slice(0, shown).forEach(function (c, i) {
        var y = py0 + i * pdy, cut = !D.keep[i];
        pr += svgEl('g', { 'class': 'xp-prob' + (cut ? ' is-cut' : '') + (S.sampled === i ? ' is-picked' : ''), 'data-p': i },
          svgEl('rect', { x: 1196, y: y - 12, width: 200, height: 24, rx: 4, 'class': 'xp-prob-bg' }) +
          svgEl('text', { x: 1204, y: y + 5, 'class': 'xp-cv-tok' }, c.t.replace(/^ /, '·')) +
          svgEl('rect', { x: 1300, y: y - 6, width: Math.max(1, 56 * D.probs[i] / maxP), height: 12, rx: 2, 'class': 'xp-bar-full' }) +
          svgEl('rect', { x: 1300, y: y - 6, width: Math.max(cut ? 0 : 1, 56 * D.kept[i] / Math.max.apply(null, D.kept)), height: 12, rx: 2, 'class': 'xp-bar-kept' }) +
          svgEl('text', { x: 1394, y: y + 4, 'text-anchor': 'end', 'class': 'xp-cv-small' }, (D.kept[i] * 100).toFixed(1) + '%'));
      });
      s += svgEl('g', { 'data-part': 'probs' }, pr);

      /* Column titles. The zoom and stepper buttons sit over these as HTML. */
      s += svgEl('text', { x: 124, y: 26, 'text-anchor': 'end', 'class': 'xp-cv-title', 'data-part': 'emb tokens' }, 'Embedding');
      s += svgEl('text', { x: 656, y: 26, 'text-anchor': 'middle', 'class': 'xp-cv-title', 'data-part': 'attn heads' }, 'Multi-head self-attention');
      s += svgEl('text', { x: 1022, y: 26, 'text-anchor': 'middle', 'class': 'xp-cv-title', 'data-part': 'mlp' }, 'MLP');
      s += svgEl('text', { x: 1280, y: 26, 'text-anchor': 'middle', 'class': 'xp-cv-title', 'data-part': 'probs' }, 'Probabilities');

      return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="GPT-2 processing the prompt ' + XP.esc(E.prompt) +
        ': embedding, block ' + (S.block + 1) + ' head ' + (S.head + 1) + ' attention, MLP and next-token probabilities">' + s + '</svg>';
    }

    /* HTML controls placed over the canvas, positioned in viewBox units. */
    function at(x, y) { return 'left:' + (x / W * 100) + '%;top:' + (y / H * 100) + '%'; }
    function overlays() {
      return '<button type="button" class="xp-zoom" style="' + at(142, 26) + '" data-zoom="emb" aria-label="Zoom into the embedding">⊕</button>' +
        '<div class="xp-step" style="' + at(300, 26) + '"><span>Block ' + (S.block + 1) + '</span>' +
        '<button type="button" data-block="-1" aria-label="Previous block"' + (S.block === 0 ? ' disabled' : '') + '>‹</button>' +
        '<button type="button" data-block="1" aria-label="Next block"' + (S.block === 11 ? ' disabled' : '') + '>›</button></div>' +
        '<div class="xp-step" style="' + at(760, 596) + '"><span>Head ' + (S.head + 1) + ' of 12</span>' +
        '<button type="button" data-head="-1" aria-label="Previous head"' + (S.head === 0 ? ' disabled' : '') + '>‹</button>' +
        '<button type="button" data-head="1" aria-label="Next head"' + (S.head === 11 ? ' disabled' : '') + '>›</button></div>' +
        '<button type="button" class="xp-zoom is-label" style="' + at(683, 494) + '" data-zoom="attn">Attention ⊕</button>' +
        '<button type="button" class="xp-zoom" style="' + at(1356, 26) + '" data-zoom="probs" aria-label="Zoom into the probabilities">⊕</button>';
    }

    function toolbar() {
      var E = Ex();
      return '<div class="xp-toolbar">' +
        '<label class="xp-field"><span>Examples</span><select data-k="ex">' + data.examples.map(function (e, i) {
          return '<option value="' + i + '"' + (i === S.ex ? ' selected' : '') + '>' + XP.esc(e.prompt) + '</option>';
        }).join('') + '</select></label>' +
        '<p class="xp-prompt" aria-live="polite">' + XP.esc(E.prompt) +
        (S.sampled !== null ? '<mark>' + XP.esc(E.top[S.sampled].t) + '</mark>' : '<span class="xp-cursor">…</span>') + '</p>' +
        '<button type="button" class="xp-go is-inline" data-sample>Generate</button>' +
        '<label class="xp-field is-stack"><span>Temperature <output>' + S.temp.toFixed(2) + '</output></span>' +
        '<input type="range" min="0.05" max="2" step="0.05" value="' + S.temp + '" data-k="temp"></label>' +
        '<div class="xp-field is-stack"><span><label><input type="radio" name="xp-samp" value="k"' + (S.mode === 'k' ? ' checked' : '') + ' data-mode> Top-k</label>' +
        ' <label><input type="radio" name="xp-samp" value="p"' + (S.mode === 'p' ? ' checked' : '') + ' data-mode> Top-p</label> <output>' +
        (S.mode === 'k' ? 'k = ' + S.k : 'p = ' + S.p.toFixed(2)) + '</output></span>' +
        (S.mode === 'k'
          ? '<input type="range" min="1" max="50" value="' + S.k + '" data-k="k" aria-label="k">'
          : '<input type="range" min="0.05" max="1" step="0.05" value="' + S.p + '" data-k="p" aria-label="p">') + '</div>' +
        '</div>';
    }

    var PAGES = [
      { t: 'What you are looking at', parts: [], body: '<p>This is GPT-2 (small) reading a prompt and scoring every possible next token. Text enters on the left and flows right. Every attention weight and probability here was recorded from the real model.</p><p>Hover over anything for its value. The ⊕ buttons open a closer view.</p>' },
      { t: 'Text becomes tokens', parts: ['tokens'], body: '<p>The prompt is split into <b>tokens</b>, pieces of text with numeric identifiers. GPT-2 has 50,257 possible tokens. A leading space belongs to the token.</p>' },
      { t: 'Tokens become vectors', parts: ['emb', 'tokens'], body: '<p>Each token identifier selects one row from a 50,257 by 768 table. This row is its <b>token embedding</b>. Then add a learned <b>position embedding</b> to represent its position. Each grey bar contains 768 numbers.</p>' },
      { t: 'Query, key and value', parts: ['qkv'], body: '<p>In each head, every token’s vector is projected 3 ways. The <b class="is-q">query</b> is what the token looks for, the <b class="is-k">key</b> is what it offers, and the <b class="is-v">value</b> is what it passes on. Each is 64 numbers.</p>' },
      { t: 'Scores, then the mask', parts: ['key', 'query', 'attn'], body: '<p>A dot product multiplies corresponding query and key entries, then adds the products. Divide each score by 8, the square root of 64. Mask later keys so tokens cannot use future positions. Empty rings show masked scores.</p>' },
      { t: 'Softmax turns scores into weights', parts: ['attn'], body: '<p>Each row of scores goes through softmax. The bigger and darker a dot, the more of its information a token takes from that key. Every row sums to 1. Hover over a dot to read its weight.</p>' },
      { t: 'Values are mixed', parts: ['value', 'out'], body: '<p>Each token’s output is the weighted average of the <b class="is-v">values</b>, using its row of weights. Attention is the only step in a block that moves information between tokens.</p>' },
      { t: '12 heads, then 12 blocks', parts: ['heads', 'blocks'], body: '<p>12 heads run side by side with their own weights, each free to track a different relation. Step through them with the arrows under the matrix. Their outputs are joined back into 768 numbers and added to the <b>residual</b> stream.</p>' },
      { t: 'The MLP works on each token alone', parts: ['mlp', 'residual'], body: '<p>A 2-layer network widens each token vector to 3,072 numbers. Then GELU applies a nonlinear transformation before the network narrows the vector to 768 numbers. Each token is processed separately. The whole block repeats 11 more times.</p>' },
      { t: 'Choosing the next token', parts: ['probs'], body: '<p>The last token’s final vector is scored against all 50,257 token embeddings. Dividing by the <b>temperature</b> sharpens or flattens the softmax, and top-k or top-p keeps only the likeliest. Press <b>Generate</b> to sample one.</p>' }
    ];

    function render() {
      host.innerHTML = toolbar() +
        '<div class="xp-stage"><div class="xp-scroll"><div class="xp-canvas" style="aspect-ratio:' + W + '/' + H + '">' +
        drawCanvas() + overlays() + '</div></div></div>';
      var stage = host.querySelector('.xp-stage');
      tipper = XP.tip(stage);
      dlg = XP.dialog(stage);
      guideCard = XP.guide(stage, PAGES, function (p) {
        XP.highlight(host.querySelector('.xp-canvas'), p ? p.parts : []);
      });
      bind();
    }
    /* Redraw the canvas, keeping the guide page. The toolbar is rebuilt only
       when asked, never while a slider in it is being dragged. */
    function refresh(withToolbar) {
      var focusSel = document.activeElement && host.contains(document.activeElement) ? XP.selectorFor(document.activeElement) : null;
      host.querySelector('.xp-canvas').innerHTML = drawCanvas() + overlays();
      if (withToolbar) host.querySelector('.xp-toolbar').outerHTML = toolbar();
      guideCard.redraw();
      if (focusSel) { var again = host.querySelector(focusSel); if (again && !again.disabled && again !== document.activeElement) again.focus(); }
    }

    function zoom(which, from) {
      var E = Ex(), html = '';
      if (which === 'emb') {
        html = '<p class="xp-note">Each token id selects a row of the 50,257 × 768 token table. The row for its position, from a 1,024 × 768 table, is added.</p>' +
          '<table class="xp-table is-compact"><thead><tr><th scope="col">Position</th><th scope="col">Token</th><th scope="col">Id</th><th scope="col">Vector</th></tr></thead><tbody>' +
          E.tokens.map(function (t, i) {
            return '<tr><td>' + i + '</td><th scope="row">' + XP.esc(t).replace(/^ /, '·') + '</th><td>' + E.ids[i] + '</td><td>token row ' + E.ids[i] + ' + position row ' + i + ' → 768 numbers</td></tr>';
          }).join('') + '</tbody></table>';
      }
      if (which === 'attn') {
        var M = stageMatrix(S.block, S.head, S.stage), mx = 0;
        M.forEach(function (row) { row.forEach(function (v) { if (v !== null && isFinite(v)) mx = Math.max(mx, Math.abs(v)); }); });
        html = '<div class="xp-seg" role="group" aria-label="Stage">' + STAGES.map(function (st, i) {
          return '<button type="button" data-stage="' + i + '" aria-pressed="' + (i === S.stage) + '">' + stageLabel(i) + '</button>';
        }).join('') + '</div>' +
          '<div class="xp-attn"><table class="xp-mat"><caption>Block ' + (S.block + 1) + ', head ' + (S.head + 1) + ', ' + stageLabel(S.stage) +
          (S.stage === 3 ? ' (each row sums to 1)' : '') + '</caption><thead><tr><th scope="col"><span class="xp-axis">query ↓ key →</span></th>' +
          E.tokens.map(function (t) { return '<th scope="col">' + XP.esc(t).replace(/^ /, '·') + '</th>'; }).join('') + '</tr></thead><tbody>' +
          M.map(function (row, r) {
            return '<tr><th scope="row">' + XP.esc(E.tokens[r]).replace(/^ /, '·') + '</th>' + row.map(function (v) {
              if (v === null) return '<td class="is-hid" title="computed, then removed by the mask">·</td>';
              if (v === -Infinity) return '<td class="is-mask">−∞</td>';
              return '<td style="' + XP.tint(v, S.stage === 3 ? 1 : mx, S.stage === 3) + '">' + XP.fmt(v, 2) + '</td>';
            }).join('') + '</tr>';
          }).join('') + '</tbody></table></div>' +
          '<p class="xp-note">' + window.InterviewDisplayMath.html('gpt/score', {}, true) + ' is the raw dot product; dividing by ' + window.InterviewDisplayMath.html('gpt/scale-equality', {}, true) + ' keeps it from growing with head size; the mask removes later keys; softmax turns each row into weights. Scores above the diagonal are not kept in the trace, so they show as dots.</p>';
      }
      if (which === 'probs') {
        var D = dist();
        html = '<p class="xp-note">Logits divided by the temperature T = ' + S.temp.toFixed(2) + ', then softmax over all 50,257 tokens, then ' +
          (S.mode === 'k' ? 'top-k with k = ' + S.k : 'top-p with p = ' + S.p.toFixed(2)) + ' and renormalised. The tokens outside the top 50 hold ' +
          (D.tail * 100).toFixed(D.tail < 0.001 ? 3 : 1) + '% of the mass.' + (D.reachedTail ? ' This nucleus reaches past the 50 tokens stored, so sampling uses those 50 only.' : '') + '</p>' +
          '<table class="xp-table is-compact"><thead><tr><th scope="col">Token</th><th scope="col">Logit</th><th scope="col">÷ T</th><th scope="col">Softmax</th><th scope="col">Kept</th></tr></thead><tbody>' +
          E.top.slice(0, 15).map(function (c, i) {
            return '<tr' + (D.keep[i] ? '' : ' class="is-cut"') + '><th scope="row">' + XP.esc(c.t).replace(/^ /, '·') + '</th><td>' + XP.fmt(c.l, 2) + '</td><td>' + XP.fmt(c.l / S.temp, 2) +
              '</td><td>' + (D.probs[i] * 100).toFixed(2) + '%</td><td>' + (D.kept[i] * 100).toFixed(2) + '%</td></tr>';
          }).join('') + '</tbody></table>';
      }
      dlg.open(which === 'emb' ? 'Embedding' : which === 'attn' ? 'Attention, block ' + (S.block + 1) + ' head ' + (S.head + 1) : 'From logits to probabilities', html, from);
    }

    function bind() {
      var cv = host.querySelector('.xp-canvas');
      cv.addEventListener('mouseover', function (e) {
        var t = e.target.closest('[data-tok], [data-p]');
        if (!t) return;
        var E = Ex(), html = '';
        if (t.dataset.p !== undefined) {
          var D = dist(), i = +t.dataset.p;
          html = '<b>' + XP.esc(E.top[i].t) + '</b><br>logit ' + XP.fmt(E.top[i].l, 2) + ', softmax ' + (D.probs[i] * 100).toFixed(2) + '%' + (D.keep[i] ? ', kept ' + (D.kept[i] * 100).toFixed(2) + '%' : ', cut');
        } else if (t.dataset.q !== undefined) {
          var q = +t.dataset.q, k = +t.dataset.k;
          html = k > q ? '<b>' + XP.esc(E.tokens[q].trim()) + '</b> cannot read <b>' + XP.esc(E.tokens[k].trim()) + '</b>, which comes later'
            : '<b>' + XP.esc(E.tokens[q].trim()) + '</b> takes <b>' + (weights(S.block, S.head)[q][k] * 100).toFixed(1) + '%</b> from <b>' + XP.esc(E.tokens[k].trim()) + '</b>';
          focusTokens([q, k]);
        } else {
          var r = +t.dataset.tok.split(' ')[0];
          html = '<b>' + XP.esc(E.tokens[r]).replace(/^ /, '·') + '</b> id ' + E.ids[r] + ', position ' + r;
          focusTokens([r]);
        }
        tipper.show(html, e);
      });
      cv.addEventListener('mousemove', function (e) {
        if (!e.target.closest('[data-tok], [data-p]')) { tipper.hide(); focusTokens(null); }
      });
      cv.addEventListener('mouseleave', function () { tipper.hide(); focusTokens(null); });
    }
    /* Hovering a token lights its whole path through the canvas. */
    function focusTokens(list) {
      Array.prototype.forEach.call(host.querySelectorAll('.xp-canvas [data-tok]'), function (el) {
        var mine = el.getAttribute('data-tok').split(' ').map(Number);
        el.classList.toggle('is-tokdim', !!list && !mine.every(function (m) { return list.indexOf(m) >= 0; }) &&
          !(mine.length === 1 && list.indexOf(mine[0]) >= 0));
      });
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
      if (k === 'temp') S.temp = v;
      if (k === 'k') S.k = v;
      if (k === 'p') S.p = v;
      if (k === 'ex') { S.ex = v; S.sampled = null; render(); host.querySelector('[data-k="ex"]').focus(); return; }
      var out = e.target.closest('.xp-field').querySelector('output');
      if (out) out.textContent = k === 'temp' ? v.toFixed(2) : k === 'k' ? 'k = ' + v : 'p = ' + v.toFixed(2);
      if (S.sampled !== null) { S.sampled = null; var pr = host.querySelector('.xp-prompt'); pr.innerHTML = XP.esc(Ex().prompt) + '<span class="xp-cursor">\u2026</span>'; }
      refresh(false);
    });
    host.addEventListener('change', function (e) {
      if (!e.target.hasAttribute('data-mode')) return;
      S.mode = e.target.value; S.sampled = null;
      refresh(true);
    });
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || b.closest('.xp-guide') || b.classList.contains('xp-close') || b.classList.contains('xp-guide-open')) return;
      if (b.dataset.block) { S.block = Math.max(0, Math.min(11, S.block + +b.dataset.block)); refresh(); }
      else if (b.dataset.head) { S.head = Math.max(0, Math.min(11, S.head + +b.dataset.head)); refresh(); }
      else if (b.dataset.zoom) zoom(b.dataset.zoom, b);
      else if (b.dataset.stage) { S.stage = +b.dataset.stage; zoom('attn', b); dlg.body.querySelector('[data-stage="' + S.stage + '"]').focus(); }
      else if (b.hasAttribute('data-sample')) { sample(); refresh(true); }
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

    /* Seeded, so the numbers never change between visits. They will not match
       the article's PyTorch output, which uses a different generator. */
    function normals(r, rows, cols) {
      var M = [];
      for (var i = 0; i < rows; i++) {
        var row = [];
        for (var j = 0; j < cols; j++) row.push(XP.gauss(r));
        M.push(row);
      }
      return M;
    }
    function matvec(W, x) { return W.map(function (row) { return row.reduce(function (s, w, j) { return s + w * x[j]; }, 0); }); }
    function dot(a, b) { return a.reduce(function (s, x, i) { return s + x * b[i]; }, 0); }

    var r = XP.rng(123);
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
          say: 'Three matrices project each embedding into a query, a key and a value. Queries compare with keys to calculate weights for combining values. W_query and W_key are 24 by 16, while W_value is 28 by 16.' +
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
            ? 'Dividing by ' + window.InterviewDisplayMath.html('gpt/scratch-scale', {}, true) + ' keeps the scores in a range where softmax still spreads weight around. Turn the division off and watch the weights collapse onto one word.'
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
