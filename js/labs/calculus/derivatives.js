(function () {
  function value(kind, x) {
    if (kind === 'square') return x * x;
    if (kind === 'sine') return Math.sin(x);
    if (kind === 'exp') return Math.exp(x);
    if (kind === 'abs') return Math.abs(x);
    if (kind === 'cube-root') return Math.cbrt(x);
    return null;
  }

  function derivative(kind, x) {
    if (kind === 'square') return 2 * x;
    if (kind === 'sine') return Math.cos(x);
    if (kind === 'exp') return Math.exp(x);
    if (kind === 'abs') return x === 0 ? null : Math.sign(x);
    if (kind === 'cube-root') return x === 0 ? null : 1 / (3 * Math.cbrt(x) ** 2);
    return null;
  }

  function derivativeState(kind, x) {
    if (kind === 'abs' && x === 0) return { kind: 'corner', slope: null, left: -1, right: 1 };
    if (kind === 'cube-root' && x === 0) return { kind: 'vertical', slope: null };
    return { kind: 'finite', slope: derivative(kind, x) };
  }

  // Keep the rounded subtraction visible so readers can inspect cancellation.
  function quotient(kind, x, h) {
    return h === 0 ? null : (value(kind, x + h) - value(kind, x)) / h;
  }

  function samples(kind, x, hs) {
    return hs.map(function (h) {
      var slope = quotient(kind, x, h), exact = derivative(kind, x);
      return { h: h, fx: value(kind, x), fxh: value(kind, x + h), slope: slope,
        error: slope === null || exact === null ? null : Math.abs(slope - exact) };
    });
  }

  var M = { value: value, derivative: derivative, derivativeState: derivativeState, quotient: quotient, samples: samples };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  XP.lab('calculus/derivatives', function (root, api) {
    var fmt = XP.fmt, el = XP.svgEl, stage = root.querySelector('[data-stage]');
    var ctl = root.querySelector('[data-ctl]'), note = root.querySelector('[data-note]');
    var names = { square: 'Square function', sine: 'Sine function', exp: 'Exponential function', abs: '|x|', 'cube-root': 'Cube root of x' };
    var initial = { kind: 'square', x: 1, h: 1, zoom: 1 };
    var s = Object.assign({}, initial), motion = { from: Object.assign({}, s), to: Object.assign({}, s) };
    var fraction = 1, dragStart = null;
    function figure(caption) {
      var f = document.createElement('figure');
      f.className = 'lab-calculus-figure';
      f.innerHTML = '<figcaption>' + caption + '</figcaption>';
      stage.appendChild(f);
      return f;
    }
    var P = XP.plane(figure('The curve, secant and tangent'), {
      x: [-2.5, 2.5], y: [-2, 10], w: 480, h: 300, pad: 14,
      label: 'Drag the 2 points horizontally along the curve'
    });
    var Z = XP.plane(figure('A closer view around the first point'), {
      x: [-2, 2], y: [-1, 1], w: 480, h: 240, pad: 14,
      label: 'Magnified changes in input and output around the first point'
    });
    var D = XP.plane(figure('The derivative gives a height for each input'), {
      x: [-2.5, 2.5], y: [-4, 8], w: 480, h: 160, pad: 14,
      label: 'The derivative graph and the current slope'
    });
    var dlg = XP.dialog(root);
    ctl.innerHTML = '<button type="button" data-act="play">Shrink h</button>' +
      '<label>Motion <input type="range" data-k="progress" min="0" max="1" step="0.01" value="1" aria-label="Scrub the recorded change"></label>' +
      '<label>Function <select data-k="kind" aria-label="Function">' + Object.keys(names).map(function (k) {
        return '<option value="' + k + '">' + names[k] + '</option>';
      }).join('') + '</select></label>' +
      '<label>Magnification <input type="range" data-k="zoom" min="1" max="64" step="1" value="1" aria-label="Local magnification"></label>' +
      '<button type="button" data-zoom="quotient">Slopes, worked</button>' +
      '<button type="button" data-zoom="local">Local line, worked</button>' +
      '<button type="button" data-zoom="graph">Derivative graph, worked</button>' +
      '<button type="button" data-reset>Reset</button>';
    var progress = ctl.querySelector('[data-k="progress"]'), kindInput = ctl.querySelector('[data-k="kind"]');
    var zoomInput = ctl.querySelector('[data-k="zoom"]');

    function snapshot() { return Object.assign({}, s); }
    function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
    function target(next) {
      var t = Object.assign(snapshot(), next);
      t.x = clamp(t.x, -2, 2);
      t.h = clamp(t.x + t.h, -2, 2) - t.x;
      t.zoom = clamp(t.zoom, 1, 64);
      return t;
    }
    function record(from, to, play) {
      api.interrupt();
      motion = { from: from, to: to };
      if (play) {
        fraction = 0;
        api.animate(from, to, 700, function (st, f) {
          s = Object.assign({}, st); fraction = f; draw();
        }, report);
      } else {
        s = Object.assign({}, to); fraction = 1; draw(); report();
      }
    }
    function change(next) {
      api.interrupt();
      record(snapshot(), target(next), false);
    }
    function handle(which, cls, part, label) {
      var h = P.handle({ x: which === 'x' ? s.x : s.x + s.h, y: value(s.kind, which === 'x' ? s.x : s.x + s.h),
        bounds: [[-2, 2], [-1.5, 8]], snap: 0.05, cls: cls, part: part, label: label,
        onMove: function (x, y, done) {
          api.interrupt();
          var from = dragStart || snapshot();
          var to = target(which === 'x' ? { x: x } : { h: x - s.x });
          record(from, to, false);
          if (done) dragStart = null;
        }
      });
      h.el.setAttribute('data-handle', which);
      h.el.addEventListener('pointerdown', function () { dragStart = snapshot(); });
      return h;
    }
    var first = handle('x', 'is-q', 'point', 'First point, x');
    var second = handle('h', 'is-k', 'secant', 'Second point, x plus h');
    function curve(plane, points, cls, part) {
      return '<polyline class="pl-curve pl-mark ' + cls + '" data-part="' + part + '" points="' + plane.pts(points) + '"/>';
    }
    function sample(fn, lo, hi) {
      var pts = [];
      for (var i = 0; i <= 240; i++) {
        var x = lo + (hi - lo) * i / 240;
        pts.push([x, fn(x)]);
      }
      return pts;
    }
    function tangent(plane, baseX, baseY, slope, lo, hi) {
      return curve(plane, [[lo, baseY + slope * (lo - baseX)], [hi, baseY + slope * (hi - baseX)]], 'is-o', 'tangent');
    }
    function localPlot(plane) {
      var exact = derivative(s.kind, s.x);
      var h = curve(plane, sample(function (u) {
        return s.zoom * (value(s.kind, s.x + u / s.zoom) - value(s.kind, s.x));
      }, -2, 2), 'is-v', 'curve');
      if (exact !== null) h += tangent(plane, 0, 0, exact, -2, 2);
      else if (s.kind === 'cube-root') h += el('line', { x1: plane.map.sx(0), y1: 14,
        x2: plane.map.sx(0), y2: plane.h - 14, 'class': 'pl-line pl-mark is-o', 'data-part': 'tangent' });
      return h + plane.dot(0, 0, 4, 'pl-mark pl-point is-q', 'point');
    }
    function derivativePlot(plane) {
      var h = '', groups = [[]];
      for (var i = 0; i <= 240; i++) {
        var x = -2.5 + 5 * i / 240, d = derivative(s.kind, x);
        if (d === null) { groups.push([]); continue; }
        groups[groups.length - 1].push([x, d]);
      }
      groups.forEach(function (g) { if (g.length) h += curve(plane, g, 'is-o', 'tangent'); });
      if (s.kind === 'abs') {
        [-1, 1].forEach(function (d) { h += plane.dot(0, d, 4, 'pl-mark pl-open is-o', 'tangent'); });
      }
      var exact = derivative(s.kind, s.x);
      if (exact !== null) h += plane.arrow(s.x, 0, s.x, exact, 'is-o', 'tangent') +
        plane.dot(s.x, exact, 5, 'pl-mark pl-point is-o', 'tangent');
      return h;
    }
    function draw() {
      var fx = value(s.kind, s.x), q = quotient(s.kind, s.x, s.h), edge = derivativeState(s.kind, s.x);
      kindInput.value = s.kind; zoomInput.value = s.zoom; progress.value = fraction;
      api.values({ x: s.x, h: s.h, fx: fx, slope: edge.slope === null ? (edge.kind === 'corner' ? 'Corner' : 'Vertical tangent') : edge.slope,
        secant: q === null ? 'Coincident points' : q });
      P.grid.innerHTML = P.gridMarkup(null, 1) + P.axes();
      var picture = curve(P, sample(function (x) { return value(s.kind, x); }, -2.5, 2.5), 'is-v', 'curve');
      if (q !== null) picture += curve(P, [[-2.5, fx + q * (-2.5 - s.x)], [2.5, fx + q * (2.5 - s.x)]], 'is-k', 'secant');
      if (edge.slope !== null) picture += tangent(P, s.x, fx, edge.slope, -2.5, 2.5);
      else if (edge.kind === 'vertical') picture += el('line', { x1: P.map.sx(s.x), y1: 14,
        x2: P.map.sx(s.x), y2: P.h - 14, 'class': 'pl-line pl-mark is-o', 'data-part': 'tangent' });
      picture += P.arrow(s.x, -1.6, s.x + s.h, -1.6, 'is-k', 'secant');
      picture += el('text', { x: 20, y: 30 }, 'f(x)') + el('text', { x: 450, y: P.map.sy(0) - 7 }, 'x');
      P.plot.innerHTML = picture;
      first.set(s.x, fx); second.set(s.x + s.h, value(s.kind, s.x + s.h));
      Z.grid.innerHTML = Z.axes();
      Z.plot.innerHTML = localPlot(Z) + el('text', { x: 20, y: 30 }, '×' + fmt(s.zoom, 0));
      D.grid.innerHTML = D.axes();
      D.plot.innerHTML = derivativePlot(D) + el('text', { x: 20, y: 30 }, 'f′(x)');
      note.setAttribute('data-edge', edge.kind);
      note.textContent = edge.kind === 'corner' ? 'The left slope is −1, while the right slope is 1. Therefore, this corner has no derivative.' :
        edge.kind === 'vertical' ? 'The slopes grow without bound from both sides. Therefore, this vertical tangent has no finite derivative.' :
        'The tangent slope is ' + fmt(edge.slope) + '. ' + (q === null ? 'The points coincide, so the difference quotient is undefined.' :
          'Meanwhile, the secant slope is ' + fmt(q) + ', using h = ' + fmt(s.h) + '.');
    }
    function report() { api.say(names[s.kind] + ' at x = ' + fmt(s.x) + '. ' + note.textContent); }
    function table(head, rows) {
      return '<div class="lab-calculus-table"><table class="xp-table lab-table"><thead><tr>' + head.map(function (h) {
        return '<th scope="col">' + h + '</th>';
      }).join('') + '</tr></thead><tbody>' + rows.map(function (r) {
        return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
    }
    function precise(x) { return x === null ? 'Undefined' : Math.abs(x) < 0.00001 && x !== 0 ? x.toExponential(6) : x.toFixed(6); }
    function zoom(view, button) {
      var fx = value(s.kind, s.x), exact = derivative(s.kind, s.x);
      if (view === 'quotient') {
        var hs = [s.h, 0.1, 0.001, 1e-8, 1e-12, 1e-16];
        var rows = samples(s.kind, s.x, hs).map(function (r) {
          return [precise(r.h), precise(r.fx), precise(r.fxh), precise(r.slope), precise(r.error)];
        });
        dlg.open('The difference quotient, worked', '<p>The first row uses the points currently on screen. After that, the rows shrink h.</p>' +
          '<p>Subtract f(x) from f(x + h), then divide by h. Very small steps expose rounding error.</p>' +
          table(['h', 'f(x)', 'f(x + h)', 'Slope', 'Absolute error'], rows), button);
      } else if (view === 'local') {
        dlg.open('The local line, worked', '<p>Magnification scales both input and output changes by ' + fmt(s.zoom, 0) + '.</p>' +
          '<div data-detail-plane></div>' + table(['Quantity', 'Current value'], [
            ['x', precise(s.x)], ['f(x)', precise(fx)], ['f′(x)', exact === null ? note.textContent : precise(exact)],
            ['f(x + h)', precise(value(s.kind, s.x + s.h))],
            ['f(x) + f′(x)h', exact === null ? 'No finite local line' : precise(fx + exact * s.h)]
          ]), button);
        var close = XP.plane(dlg.body.querySelector('[data-detail-plane]'), { x: [-2, 2], y: [-1, 1], w: 640, h: 320, pad: 14 });
        close.grid.innerHTML = close.axes(); close.plot.innerHTML = localPlot(close);
      } else {
        dlg.open('The derivative graph, worked', '<p>Each height records the curve’s local slope at that input. A missing height marks an undefined derivative.</p>' +
          '<div data-detail-plane></div>' + table(['Input', 'Derivative'], [-1, 0, s.x, 1, 2].map(function (x) {
            var edge = derivativeState(s.kind, x);
            return [precise(x), edge.slope === null ? (edge.kind === 'corner' ? 'Corner' : 'Vertical tangent') : precise(edge.slope)];
          })), button);
        var graph = XP.plane(dlg.body.querySelector('[data-detail-plane]'), { x: [-2.5, 2.5], y: [-4, 8], w: 640, h: 280, pad: 14 });
        graph.grid.innerHTML = graph.axes(); graph.plot.innerHTML = derivativePlot(graph);
      }
    }
    ctl.addEventListener('input', function (e) {
      if (e.target === progress) {
        var requested = +progress.value;
        api.interrupt(); fraction = requested;
        s = XP.mix(motion.from, motion.to, XP.ease(requested)); draw(); report();
      } else if (e.target === zoomInput) {
        var magnification = +zoomInput.value;
        change({ zoom: magnification });
      }
    });
    ctl.addEventListener('change', function (e) {
      if (e.target === kindInput) { var kind = kindInput.value; change({ kind: kind }); }
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      api.interrupt();
      if (b.hasAttribute('data-zoom')) return zoom(b.getAttribute('data-zoom'), b);
      if (b.hasAttribute('data-reset')) return record(snapshot(), Object.assign({}, initial), false);
      if (b.getAttribute('data-act') === 'play') {
        var from = snapshot();
        if (Math.abs(from.h) < 0.02) from.h = from.x < 1.5 ? 0.5 : -0.5;
        record(from, Object.assign({}, from, { h: Math.sign(from.h) * 0.01 }), true);
      }
    });
    var PAGES = [
      { t: 'A slope between 2 points', parts: ['point', 'secant', 'curve'], state: { kind: 'square', x: 1, h: 1, zoom: 1 },
        body: ('<p>The line through (1, 1) and (2, 4) is a <b class="is-k">secant</b> of '+window.InterviewDisplayMath.html("lab/derivatives/worked-0", undefined, true)+'. Therefore, its slope is (4 − 1) ÷ (2 − 1) = 3.</p>') },
      { t: 'Move the second point closer', parts: ['secant', 'tangent'], state: { kind: 'square', x: 1, h: 0.1, zoom: 1 },
        body: '<p>Now h = 0.1 gives a <b class="is-k">secant slope</b> of 2.1. After that, shrinking h brings this slope towards 2.</p>' },
      { t: 'The limiting slope', parts: ['point', 'tangent'], state: { kind: 'square', x: 1, h: 0, zoom: 1 },
        body: '<p>The limiting line is the <b class="is-o">tangent</b>, whose slope 2 is the derivative here. However, setting h = 0 makes the quotient undefined.</p>' },
      { t: 'Look close to the point', parts: ['curve', 'tangent', 'point'], state: { kind: 'square', x: 1, h: 0.1, zoom: 32 },
        body: '<p>Magnification shows a smaller range around x = 1. Within that range, the <b class="is-o">tangent</b> closely follows the curve.</p>' },
      { t: 'Trace the slope', parts: ['tangent', 'point'], state: { kind: 'square', x: 1.5, h: 0.1, zoom: 16 },
        body: '<p>At x = 1.5, the square curve has slope 3. Moreover, dragging the first point moves its height on the <b class="is-o">derivative graph</b>.</p>' },
      { t: 'A corner has 2 slopes', parts: ['curve', 'tangent', 'point'], state: { kind: 'abs', x: 0, h: 0.5, zoom: 32 },
        body: '<p>For |x|, the left slope is −1 and the right slope is 1. Therefore, magnifying this corner cannot produce 1 tangent slope.</p>' },
      { t: 'A vertical tangent', parts: ['curve', 'tangent', 'point'], state: { kind: 'cube-root', x: 0, h: 0.1, zoom: 16 },
        body: '<p>Near 0, the cube root’s secant slopes grow without bound. Therefore, its vertical tangent gives no finite derivative there.</p>' },
      { t: 'Small steps meet machine limits', parts: ['curve', 'secant', 'tangent'], state: { kind: 'exp', x: 1, h: 0.01, zoom: 16 },
        body: '<p>For eˣ at 1, the exact slope is e, about 2.71828. However, the worked table shows rounding error when h becomes too small.</p>' }
    ];
    draw(); report();
    XP.guide(root.querySelector('[data-guide-box]'), PAGES, function (p, i, redraw) {
      if (!p) { api.focus([]); return; }
      if (!redraw) { api.interrupt(); record(snapshot(), Object.assign({}, p.state), true); }
      api.focus(p.parts);
    });
  });
})();
