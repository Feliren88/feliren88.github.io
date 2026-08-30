/* ══════════════════════════════════════════════════════════════════
   Interactive maths for /interview/
   ══════════════════════════════════════════════════════════════════

   Two jobs.

   1. Colour-link. scripts/render_math.py tags every leaf of an equation
      with the index of the symbol it belongs to. This file makes those
      tags interactive: point at a legend row and the matching term in
      the equation lights while the rest dims, and the other way round.
      That link is the thing MLU-Explain does that a static equation
      cannot, and it costs nothing per module to author.

   2. Playgrounds. A module's equation may declare a `play:` block, and
      this file turns it into a figure the reader drives: sliders that
      redraw the picture and push live numbers back into the equation,
      and step buttons for anything iterative.

   Written against SVG and plain DOM rather than D3 and Svelte, which is
   what MLU-Explain uses. The reasons are the same ones that kept the
   diagrams as SVG rather than rendered images: a figure here has to
   follow the light and dark themes, grow with the reading controls,
   survive a page tint, and stay readable with a screen reader. A
   charting library brings its own colours and its own font sizing, and
   would have to be fought on all four.

   Every playground obeys four rules, matching the animation engine:
   the reader can always take over, every control says what it does,
   the figure is complete before anything is touched, and reduced
   motion removes the animation rather than the content.
   ══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  }

  var REDUCED = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, attrs, kids) {
    var n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {
      if (attrs[k] !== null && attrs[k] !== undefined) {
        n.setAttribute(k, attrs[k]);
      }
    }
    (kids || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  function fmt(v, dp) {
    if (!isFinite(v)) return '—';
    var s = v.toFixed(dp === undefined ? 2 : dp);
    return s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  }

  /* ════════════════════════════════════════════════════════
     1. Colour-linking
     ════════════════════════════════════════════════════════ */

  function linkSymbols(fig) {
    var terms = $$('.ivm-term', fig);
    var marks = $$('.ivm-render [data-s]', fig);
    if (!terms.length || !marks.length) return;

    function lit(idx) {
      if (idx === null) {
        fig.classList.remove('is-lit');
        terms.concat(marks).forEach(function (n) {
          n.classList.remove('is-lit');
        });
        return;
      }
      fig.classList.add('is-lit');
      marks.forEach(function (n) {
        var owns = (n.getAttribute('data-owns') || n.getAttribute('data-s') || '')
          .split(' ');
        n.classList.toggle('is-lit', owns.indexOf(String(idx)) !== -1);
      });
      terms.forEach(function (n, i) {
        n.classList.toggle('is-lit', i === idx);
      });
    }

    terms.forEach(function (t, i) {
      t.setAttribute('data-s', i);
      t.addEventListener('mouseenter', function () { lit(i); });
      t.addEventListener('focusin', function () { lit(i); });
      t.addEventListener('mouseleave', function () { lit(null); });
      t.addEventListener('focusout', function () { lit(null); });
      /* Touch has no hover, so a tap toggles instead. */
      t.addEventListener('click', function () {
        lit(t.classList.contains('is-lit') ? null : i);
      });
      t.tabIndex = 0;
    });

    marks.forEach(function (m) {
      var i = +m.getAttribute('data-s');
      m.addEventListener('mouseenter', function () { lit(i); });
      m.addEventListener('mouseleave', function () { lit(null); });
    });
  }

  /* ════════════════════════════════════════════════════════
     2. Playgrounds

     A `play` block is compiled once into a state object. Knobs
     write into `state`, every archetype reads from it, and one
     redraw path serves them all.
     ════════════════════════════════════════════════════════ */

  var W = 460, H = 260, PAD = { l: 46, r: 14, t: 14, b: 34 };

  function scaler(dom, rng) {
    var a = dom[0], b = dom[1], c = rng[0], d = rng[1];
    var f = function (v) { return c + (v - a) / (b - a || 1) * (d - c); };
    f.invert = function (q) { return a + (q - c) / (d - c || 1) * (b - a); };
    return f;
  }

  /* Expressions are authored in this repository and compiled once. */
  function compile(expr, names) {
    try {
      /* jshint evil:true */
      return new Function(
        names.join(','),
        'with (Math) { return (' + expr + '); }');
    } catch (e) {
      return null;
    }
  }

  function axes(g, sx, sy, spec) {
    var x0 = PAD.l, x1 = W - PAD.r, y0 = H - PAD.b, y1 = PAD.t;
    g.appendChild(el('line', {
      x1: x0, y1: y0, x2: x1, y2: y0, 'class': 'ivmp-axis'
    }));
    g.appendChild(el('line', {
      x1: x0, y1: y0, x2: x0, y2: y1, 'class': 'ivmp-axis'
    }));

    var ticks = 4, i, v, px, py, t;
    for (i = 0; i <= ticks; i++) {
      v = spec.x[0] + (spec.x[1] - spec.x[0]) * i / ticks;
      px = sx(v);
      g.appendChild(el('line', {
        x1: px, y1: y0, x2: px, y2: y1, 'class': 'ivmp-grid'
      }));
      t = el('text', { x: px, y: y0 + 15, 'class': 'ivmp-tick' });
      t.textContent = fmt(v, 1);
      g.appendChild(t);
    }
    for (i = 0; i <= ticks; i++) {
      v = spec.y[0] + (spec.y[1] - spec.y[0]) * i / ticks;
      py = sy(v);
      g.appendChild(el('line', {
        x1: x0, y1: py, x2: x1, y2: py, 'class': 'ivmp-grid'
      }));
      t = el('text', { x: x0 - 7, y: py + 4, 'class': 'ivmp-tick ivmp-tick-y' });
      t.textContent = fmt(v, 1);
      g.appendChild(t);
    }
    if (spec.xlabel) {
      t = el('text', {
        x: (x0 + x1) / 2, y: H - 3, 'class': 'ivmp-axlabel'
      });
      t.textContent = spec.xlabel;
      g.appendChild(t);
    }
    if (spec.ylabel) {
      t = el('text', {
        x: 10, y: (y0 + y1) / 2,
        'class': 'ivmp-axlabel',
        transform: 'rotate(-90 10 ' + ((y0 + y1) / 2) + ')'
      });
      t.textContent = spec.ylabel;
      g.appendChild(t);
    }
  }

  function pathFor(fn, sx, sy, spec, args) {
    var d = '', n = 160, i, x, y, first = true;
    for (i = 0; i <= n; i++) {
      x = spec.x[0] + (spec.x[1] - spec.x[0]) * i / n;
      y = fn.apply(null, [x].concat(args));
      if (!isFinite(y)) { first = true; continue; }
      y = Math.max(spec.y[0] - 99, Math.min(spec.y[1] + 99, y));
      d += (first ? 'M' : 'L') + sx(x).toFixed(1) + ' ' + sy(y).toFixed(1);
      first = false;
    }
    return d;
  }

  /* ── Archetypes ──────────────────────────────────────────
     Each returns a draw(state) that repaints the stage group.
     ────────────────────────────────────────────────────── */

  var KIND = {};

  /* One or more curves of x, controlled by the knobs. */
  KIND.curve = function (spec, stage, names) {
    var sx = scaler(spec.x, [PAD.l, W - PAD.r]);
    var sy = scaler(spec.y, [H - PAD.b, PAD.t]);
    var fns = (spec.curves || []).map(function (c) {
      return { fn: compile(c.fn, ['x'].concat(names)), label: c.label, s: c.s };
    });
    return function (state) {
      stage.textContent = '';
      axes(stage, sx, sy, spec);
      var args = names.map(function (n) { return state[n]; });
      fns.forEach(function (c, i) {
        if (!c.fn) return;
        stage.appendChild(el('path', {
          d: pathFor(c.fn, sx, sy, spec, args),
          'class': 'ivmp-curve',
          'data-s': c.s === undefined ? i : c.s
        }));
      });
    };
  };

  /* Fixed points plus a line the reader moves, with the loss shown. */
  KIND.fit = function (spec, stage, names) {
    var sx = scaler(spec.x, [PAD.l, W - PAD.r]);
    var sy = scaler(spec.y, [H - PAD.b, PAD.t]);
    var line = compile(spec.line || 'w*x + b', ['x'].concat(names));
    var pts = spec.points || [];
    return function (state) {
      stage.textContent = '';
      axes(stage, sx, sy, spec);
      var args = names.map(function (n) { return state[n]; });
      if (line) {
        stage.appendChild(el('path', {
          d: pathFor(line, sx, sy, spec, args), 'class': 'ivmp-curve',
          'data-s': spec.s === undefined ? 0 : spec.s
        }));
      }
      var sse = 0;
      pts.forEach(function (pt) {
        var yh = line ? line.apply(null, [pt[0]].concat(args)) : 0;
        sse += (pt[1] - yh) * (pt[1] - yh);
        if (spec.residuals !== false) {
          stage.appendChild(el('line', {
            x1: sx(pt[0]), y1: sy(pt[1]), x2: sx(pt[0]), y2: sy(yh),
            'class': 'ivmp-resid'
          }));
        }
        stage.appendChild(el('circle', {
          cx: sx(pt[0]), cy: sy(pt[1]), r: 4, 'class': 'ivmp-pt'
        }));
      });
      state.__loss = sse / (pts.length || 1);
    };
  };

  /* Two densities and a threshold the reader drags. */
  KIND.threshold = function (spec, stage, names) {
    var sx = scaler(spec.x, [PAD.l, W - PAD.r]);
    var sy = scaler(spec.y, [H - PAD.b, PAD.t]);
    var neg = compile(spec.neg, ['x'].concat(names));
    var pos = compile(spec.pos, ['x'].concat(names));
    return function (state) {
      stage.textContent = '';
      axes(stage, sx, sy, spec);
      var args = names.map(function (n) { return state[n]; });
      [[neg, 0], [pos, 2]].forEach(function (pair) {
        if (!pair[0]) return;
        stage.appendChild(el('path', {
          d: pathFor(pair[0], sx, sy, spec, args),
          'class': 'ivmp-curve', 'data-s': pair[1]
        }));
      });
      var thr = state[spec.knob || 't'];
      stage.appendChild(el('line', {
        x1: sx(thr), y1: PAD.t, x2: sx(thr), y2: H - PAD.b,
        'class': 'ivmp-thr'
      }));
      /* Numeric readout: the area each side of the cut. */
      var i, x, dx = (spec.x[1] - spec.x[0]) / 400, tp = 0, fp = 0, fn = 0, tn = 0;
      for (i = 0; i < 400; i++) {
        x = spec.x[0] + dx * i;
        var a = pos ? pos.apply(null, [x].concat(args)) * dx : 0;
        var b = neg ? neg.apply(null, [x].concat(args)) * dx : 0;
        if (x >= thr) { tp += a; fp += b; } else { fn += a; tn += b; }
      }
      state.__tp = tp; state.__fp = fp; state.__fn = fn; state.__tn = tn;
    };
  };

  /* A unit grid pushed through a two by two matrix. */
  KIND.grid = function (spec, stage, names) {
    var sx = scaler(spec.x, [PAD.l, W - PAD.r]);
    var sy = scaler(spec.y, [H - PAD.b, PAD.t]);
    return function (state) {
      stage.textContent = '';
      axes(stage, sx, sy, spec);
      var a = state.a, b = state.b, c = state.c, d = state.d;
      var lo = Math.ceil(spec.x[0]), hi = Math.floor(spec.x[1]), i;
      function P(u, v) { return [sx(a * u + b * v), sy(c * u + d * v)]; }
      for (i = lo; i <= hi; i++) {
        var p1 = P(i, spec.y[0]), p2 = P(i, spec.y[1]);
        stage.appendChild(el('line', {
          x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], 'class': 'ivmp-mesh'
        }));
        var q1 = P(spec.x[0], i), q2 = P(spec.x[1], i);
        stage.appendChild(el('line', {
          x1: q1[0], y1: q1[1], x2: q2[0], y2: q2[1], 'class': 'ivmp-mesh'
        }));
      }
      var e1 = P(1, 0), e2 = P(0, 1), o = P(0, 0);
      var unit = [P(0, 0), P(1, 0), P(1, 1), P(0, 1)];
      stage.appendChild(el('polygon', {
        points: unit.map(function (p) { return p.join(','); }).join(' '),
        'class': 'ivmp-area'
      }));
      stage.appendChild(el('line', {
        x1: o[0], y1: o[1], x2: e1[0], y2: e1[1],
        'class': 'ivmp-basis', 'data-s': 0
      }));
      stage.appendChild(el('line', {
        x1: o[0], y1: o[1], x2: e2[0], y2: e2[1],
        'class': 'ivmp-basis', 'data-s': 1
      }));
      state.__det = a * d - b * c;
    };
  };

  /* Bars over categories, each height an expression of the index. */
  KIND.bars = function (spec, stage, names) {
    var fn = compile(spec.height, ['k'].concat(names));
    var labels = spec.labels || [];
    return function (state) {
      stage.textContent = '';
      var args = names.map(function (n) { return state[n]; });
      var vals = labels.map(function (_, k) {
        var v = fn ? fn.apply(null, [k].concat(args)) : 0;
        return isFinite(v) ? Math.max(0, v) : 0;
      });
      var total = vals.reduce(function (s, v) { return s + v; }, 0) || 1;
      var max = spec.normalise === false
        ? Math.max.apply(null, vals.concat([1e-9]))
        : 1;
      var bw = (W - PAD.l - PAD.r) / labels.length;
      vals.forEach(function (v, k) {
        var share = spec.normalise === false ? v / max : v / total;
        var h = share * (H - PAD.t - PAD.b);
        stage.appendChild(el('rect', {
          x: PAD.l + k * bw + bw * 0.16,
          y: H - PAD.b - h,
          width: bw * 0.68, height: Math.max(0, h),
          'class': 'ivmp-bar', 'data-s': k % 8
        }));
        var t = el('text', {
          x: PAD.l + k * bw + bw / 2, y: H - PAD.b + 15, 'class': 'ivmp-tick'
        });
        t.textContent = labels[k];
        stage.appendChild(t);
        var u = el('text', {
          x: PAD.l + k * bw + bw / 2, y: H - PAD.b - h - 5, 'class': 'ivmp-tick'
        });
        u.textContent = fmt(share, 2);
        stage.appendChild(u);
      });
      stage.appendChild(el('line', {
        x1: PAD.l, y1: H - PAD.b, x2: W - PAD.r, y2: H - PAD.b,
        'class': 'ivmp-axis'
      }));
    };
  };

  /* Gradient descent on a curve, advanced by the step buttons. */
  KIND.descent = function (spec, stage, names) {
    var sx = scaler(spec.x, [PAD.l, W - PAD.r]);
    var sy = scaler(spec.y, [H - PAD.b, PAD.t]);
    var loss = compile(spec.loss, ['x'].concat(names));
    var grad = compile(spec.grad, ['x'].concat(names));
    return function (state) {
      stage.textContent = '';
      axes(stage, sx, sy, spec);
      var args = names.map(function (n) { return state[n]; });
      if (loss) {
        stage.appendChild(el('path', {
          d: pathFor(loss, sx, sy, spec, args), 'class': 'ivmp-curve',
          'data-s': 0
        }));
      }
      (state.__trail || []).forEach(function (p, i, arr) {
        stage.appendChild(el('circle', {
          cx: sx(p), cy: sy(loss ? loss.apply(null, [p].concat(args)) : 0),
          r: i === arr.length - 1 ? 5 : 2.5,
          'class': i === arr.length - 1 ? 'ivmp-head' : 'ivmp-trail'
        }));
      });
      state.__grad = grad ? grad.apply(null, [state.__pos].concat(args)) : 0;
      state.__val = loss ? loss.apply(null, [state.__pos].concat(args)) : 0;
    };
  };

  KIND.descent.step = function (spec, state, names) {
    var grad = compile(spec.grad, ['x'].concat(names));
    var args = names.map(function (n) { return state[n]; });
    var g = grad ? grad.apply(null, [state.__pos].concat(args)) : 0;
    if (!isFinite(g)) return;
    state.__pos -= (state.eta === undefined ? 0.1 : state.eta) * g;
    state.__trail.push(state.__pos);
    if (state.__trail.length > 220) state.__trail.shift();
  };

  KIND.descent.reset = function (spec, state) {
    state.__pos = spec.start === undefined ? spec.x[1] * 0.8 : spec.start;
    state.__trail = [state.__pos];
  };

  /* A matrix of cells shaded by a function of row and column. */
  KIND.heat = function (spec, stage, names) {
    var fn = compile(spec.cell, ['i', 'j'].concat(names));
    var n = spec.n || 6;
    return function (state) {
      stage.textContent = '';
      var args = names.map(function (nm) { return state[nm]; });
      var size = Math.min((W - PAD.l - PAD.r), (H - PAD.t - PAD.b)) / n;
      var ox = PAD.l, oy = PAD.t, i, j, v, vals = [], row;
      for (i = 0; i < n; i++) {
        row = [];
        for (j = 0; j < n; j++) {
          v = fn ? fn.apply(null, [i, j].concat(args)) : 0;
          row.push(isFinite(v) ? v : 0);
        }
        if (spec.rowNormalise !== false) {
          var s = row.reduce(function (a, b) { return a + Math.exp(b); }, 0);
          row = row.map(function (u) { return Math.exp(u) / s; });
        }
        vals.push(row);
      }
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          stage.appendChild(el('rect', {
            x: ox + j * size, y: oy + i * size,
            width: size - 1.5, height: size - 1.5,
            'class': 'ivmp-cell',
            style: 'opacity:' + (0.12 + 0.88 * Math.min(1, vals[i][j] * n))
          }));
        }
      }
      if (spec.rowlabel) {
        var t = el('text', { x: ox, y: oy - 3, 'class': 'ivmp-tick' });
        t.textContent = spec.rowlabel;
        stage.appendChild(t);
      }
    };
  };

  /* ── Building one playground ─────────────────────────── */

  function playground(spec, fig) {
    var kind = KIND[spec.kind];
    if (!kind) return null;

    var host = document.createElement('div');
    host.className = 'ivmp-play';

    var head = document.createElement('div');
    head.className = 'ivmp-head-row';
    var kicker = document.createElement('span');
    kicker.className = 'ivmp-kicker';
    kicker.textContent = spec.title || 'Try it yourself';
    head.appendChild(kicker);
    host.appendChild(head);

    var svg = el('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      'class': 'ivmp-svg',
      role: 'img',
      'aria-label': spec.alt || (spec.title || 'Interactive figure')
    });
    var stage = el('g', {});
    svg.appendChild(stage);
    host.appendChild(svg);

    var readout = document.createElement('p');
    readout.className = 'ivmp-readout';
    host.appendChild(readout);

    var knobs = spec.knobs || [];
    var names = knobs.map(function (k) { return k.k; });
    var state = {};
    knobs.forEach(function (k) { state[k.k] = k.v; });

    var draw = kind(spec, stage, names);
    var stepper = KIND[spec.kind].step;
    if (KIND[spec.kind].reset) KIND[spec.kind].reset(spec, state);

    var say = spec.readout ? compile(spec.readout, names.concat(
      ['loss', 'det', 'tp', 'fp', 'fn', 'tn', 'pos', 'grad', 'val'])) : null;

    var liveNodes = [];

    function refresh() {
      draw(state);
      /* Push the reader's own numbers back into the equation. */
      liveNodes.forEach(function (n) {
        var nm = n.getAttribute('data-live');
        var v = state[nm];
        if (v === undefined) {
          v = state['__' + nm];
        }
        n.textContent = v === undefined || v === null ? '?' : fmt(v, 2);
      });
      if (say) {
        var v = say.apply(null, names.map(function (n) { return state[n]; })
          .concat([state.__loss, state.__det, state.__tp, state.__fp,
                   state.__fn, state.__tn, state.__pos, state.__grad,
                   state.__val]));
        readout.textContent = v;
      } else {
        readout.textContent = '';
      }
    }

    var ctl = document.createElement('div');
    ctl.className = 'ivmp-knobs';
    knobs.forEach(function (k, i) {
      var wrap = document.createElement('label');
      wrap.className = 'ivmp-knob';
      if (k.s !== undefined) wrap.setAttribute('data-s', k.s);
      var name = document.createElement('span');
      name.className = 'ivmp-knob-name';
      name.textContent = k.label || k.k;
      var out = document.createElement('output');
      out.className = 'ivmp-knob-val';
      out.textContent = fmt(k.v, k.dp);
      var input = document.createElement('input');
      input.type = 'range';
      input.min = k.min;
      input.max = k.max;
      input.step = k.step || 0.1;
      input.value = k.v;
      input.setAttribute('aria-label', k.label || k.k);
      input.addEventListener('input', function () {
        state[k.k] = parseFloat(input.value);
        out.textContent = fmt(state[k.k], k.dp);
        refresh();
      });
      wrap.appendChild(name);
      wrap.appendChild(input);
      wrap.appendChild(out);
      ctl.appendChild(wrap);
    });
    host.appendChild(ctl);

    if (stepper) {
      var steps = document.createElement('div');
      steps.className = 'ivmp-steps';
      [['1 step', 1], ['25 steps', 25], ['100 steps', 100]].forEach(function (b) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = b[0];
        btn.addEventListener('click', function () {
          for (var i = 0; i < b[1]; i++) stepper(spec, state, names);
          refresh();
        });
        steps.appendChild(btn);
      });
      var rs = document.createElement('button');
      rs.type = 'button';
      rs.className = 'ivmp-reset';
      rs.textContent = 'Reset';
      rs.addEventListener('click', function () {
        KIND[spec.kind].reset(spec, state);
        refresh();
      });
      steps.appendChild(rs);
      host.appendChild(steps);
    }

    /* The live equation sits above the figure, next to the original. */
    var liveBlock = fig ? fig.querySelector('[data-live-eq]') : null;
    if (liveBlock) liveNodes = $$('[data-live]', liveBlock);

    refresh();
    return host;
  }

  /* ════════════════════════════════════════════════════════
     Mount
     ════════════════════════════════════════════════════════ */

  function data() {
    var node = $('#iv-data');
    if (!node) return null;
    try { return JSON.parse(node.textContent); } catch (e) { return null; }
  }

  function init() {
    var d = data();
    $$('.syl-module').forEach(function (mod) {
      var mi = +mod.getAttribute('data-i');
      var spec = d && d.modules && d.modules[mi] ? d.modules[mi].math : null;
      $$('.ivm-eq', mod).forEach(function (fig, ei) {
        linkSymbols(fig);
        var play = spec && spec[ei] ? spec[ei].play : null;
        if (!play) return;
        var built = playground(play, fig);
        if (built) fig.appendChild(built);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
