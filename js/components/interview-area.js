/* A function and its signed area change together in the calculus track. */
(function () {
  'use strict';
  var host = document.querySelector('[data-integral-playground]');
  if (!host) return;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var X0 = -3.5, X1 = 3.5, N = 240;
  var LEFT = 44, RIGHT = 656, TOP = 16, BOTTOM = 292, MID = (TOP + BOTTOM) / 2;
  var FORMS = {
    linear: { label: 'Linear · ax + b', formula: 'ax + b', f: function (x, a, b) { return a * x + b; } },
    quadratic: { label: 'Quadratic · ax² + b', formula: 'ax² + b', f: function (x, a, b) { return a * x * x + b; } },
    cubic: { label: 'Cubic · ax³ + b', formula: 'ax³ + b', f: function (x, a, b) { return a * x * x * x + b; } },
    sine: { label: 'Sine · a sin(x) + b', formula: 'a sin(x) + b', f: function (x, a, b) { return a * Math.sin(x) + b; } },
    exponential: { label: 'Exponential · a exp(x/2) + b', formula: 'a exp(x/2) + b', f: function (x, a, b) { return a * Math.exp(x / 2) + b; } },
    bell: { label: 'Bell · a exp(−x²/2) + b', formula: 'a exp(−x²/2) + b', f: function (x, a, b) { return a * Math.exp(-x * x / 2) + b; } }
  };
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function fmt(x) { return String(Math.round(x * 100) / 100); }
  function svg(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (key) { n.setAttribute(key, attrs[key]); });
    return n;
  }
  function line(g, x1, y1, x2, y2, cls) {
    g.appendChild(svg('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': cls }));
  }
  function text(g, x, y, value, cls) {
    var t = svg('text', { x: x, y: y, 'class': cls }); t.textContent = value; g.appendChild(t);
  }
  function samples(kind, a, b) {
    var result = [];
    for (var i = 0; i <= N; i++) result.push(FORMS[kind].f(X0 + (X1 - X0) * i / N, a, b));
    return result;
  }
  function at(values, x) {
    var index = clamp((x - X0) / (X1 - X0) * N, 0, N);
    var low = Math.floor(index);
    return values[low] + (values[Math.min(N, low + 1)] - values[low]) * (index - low);
  }
  function areas(values, a, b) {
    var positive = 0, negative = 0, steps = 300, dx = (b - a) / steps;
    for (var i = 0; i < steps; i++) {
      var y0 = at(values, a + dx * i), y1 = at(values, a + dx * (i + 1));
      if (y0 >= 0 && y1 >= 0) positive += (y0 + y1) * dx / 2;
      else if (y0 <= 0 && y1 <= 0) negative -= (y0 + y1) * dx / 2;
      else {
        var fraction = Math.abs(y0) / (Math.abs(y0) + Math.abs(y1));
        var first = Math.abs(y0) * dx * fraction / 2;
        var second = Math.abs(y1) * dx * (1 - fraction) / 2;
        if (y0 > 0) { positive += first; negative += second; }
        else { negative += first; positive += second; }
      }
    }
    return [positive, negative];
  }
  function scaleFor(values) {
    return Math.max(1, Math.max.apply(null, values.map(Math.abs)) * 1.12);
  }

  host.innerHTML = '<section class="iva-panel" aria-label="Interactive area under a curve">' +
    '<div class="iva-head"><div><h3>Change the equation, watch the area</h3>' +
    '<p>Move the coefficients or the integration bounds. The curve, shaded area and integral change together.</p></div>' +
    '<label>Function<select class="iva-form"></select></label></div>' +
    '<p class="iva-current-equation"></p>' +
    '<div class="iva-plot"><svg viewBox="0 0 700 326" role="img" aria-label="Function curve and signed area between two bounds"></svg></div>' +
    '<div class="iva-controls">' +
    '<label>Coefficient a <output data-value="a"></output><input data-control="a" type="range" min="-3" max="3" step="0.1" value="0.5"></label>' +
    '<label>Offset b <output data-value="b"></output><input data-control="b" type="range" min="-3" max="3" step="0.1" value="0"></label>' +
    '<label>Lower bound <output data-value="low"></output><input data-control="low" type="range" min="-3.5" max="3.4" step="0.1" value="-2"></label>' +
    '<label>Upper bound <output data-value="high"></output><input data-control="high" type="range" min="-3.4" max="3.5" step="0.1" value="2"></label></div>' +
    '<div class="iva-results"><output class="iva-integral"></output><span class="iva-positive"></span><span class="iva-negative"></span></div>' +
    '<p class="iva-note">Area below the x-axis subtracts from the signed integral. The positive and below-axis amounts are shown separately.</p></section>';
  var select = host.querySelector('.iva-form');
  var chart = host.querySelector('svg');
  var controls = {};
  var equation = host.querySelector('.iva-current-equation');
  var integral = host.querySelector('.iva-integral');
  var positiveText = host.querySelector('.iva-positive');
  var negativeText = host.querySelector('.iva-negative');
  Object.keys(FORMS).forEach(function (key) {
    var option = document.createElement('option'); option.value = key; option.textContent = FORMS[key].label;
    select.appendChild(option);
  });
  select.value = 'quadratic';
  Array.prototype.forEach.call(host.querySelectorAll('[data-control]'), function (input) {
    controls[input.dataset.control] = input;
  });
  function currentState() {
    return { kind: select.value, a: +controls.a.value, b: +controls.b.value,
      low: +controls.low.value, high: +controls.high.value };
  }
  function labels() {
    Object.keys(controls).forEach(function (key) {
      host.querySelector('[data-value="' + key + '"]').textContent = fmt(+controls[key].value);
    });
    var suffix = { linear: 'x', quadratic: 'x²', cubic: 'x³', sine: ' sin(x)',
      exponential: ' exp(x/2)', bell: ' exp(−x²/2)' }[select.value];
    var offset = +controls.b.value;
    equation.textContent = 'f(x) = ' + fmt(+controls.a.value) + suffix +
      (offset < 0 ? ' − ' + fmt(-offset) : ' + ' + fmt(offset));
  }
  function draw(values, low, high, scale, state) {
    chart.textContent = '';
    var g = svg('g'); chart.appendChild(g);
    var sx = function (x) { return LEFT + (x - X0) / (X1 - X0) * (RIGHT - LEFT); };
    var sy = function (y) { return MID - y / scale * (MID - TOP); };
    [-1, -.5, 0, .5, 1].forEach(function (fraction) {
      var y = sy(scale * fraction);
      line(g, LEFT, y, RIGHT, y, fraction === 0 ? 'iva-axis' : 'iva-grid');
      text(g, LEFT - 8, y + 4, fmt(scale * fraction), 'iva-y-tick');
    });
    [-3, -2, -1, 0, 1, 2, 3].forEach(function (x) {
      var px = sx(x);
      line(g, px, TOP, px, BOTTOM, 'iva-grid');
      text(g, px, BOTTOM + 19, x, 'iva-x-tick');
    });
    var positivePath = '', negativePath = '', segments = 180, dx = (high - low) / segments;
    for (var i = 0; i < segments; i++) {
      var x0 = low + i * dx, x1 = x0 + dx;
      var y0 = at(values, x0), y1 = at(values, x1);
      if (y0 * y1 < 0) {
        var root = x0 + dx * Math.abs(y0) / (Math.abs(y0) + Math.abs(y1));
        addPiece(x0, y0, root, 0);
        addPiece(root, 0, x1, y1);
      } else addPiece(x0, y0, x1, y1);
    }
    function addPiece(a, ya, b, yb) {
      var d = 'M' + sx(a) + ',' + MID + 'L' + sx(a) + ',' + sy(ya) + 'L' + sx(b) + ',' + sy(yb) + 'L' + sx(b) + ',' + MID + 'Z';
      if (ya + yb >= 0) positivePath += d; else negativePath += d;
    }
    g.appendChild(svg('path', { d: positivePath, 'class': 'iva-area-positive' }));
    g.appendChild(svg('path', { d: negativePath, 'class': 'iva-area-negative' }));
    line(g, sx(low), TOP, sx(low), BOTTOM, 'iva-bound');
    line(g, sx(high), TOP, sx(high), BOTTOM, 'iva-bound');
    var curve = values.map(function (y, i) {
      return (i ? 'L' : 'M') + sx(X0 + (X1 - X0) * i / N) + ',' + sy(y);
    }).join('');
    g.appendChild(svg('path', { d: curve, 'class': 'iva-curve' }));
    [low, high].forEach(function (x) {
      g.appendChild(svg('circle', { cx: sx(x), cy: MID, r: 5, 'class': 'iva-handle' }));
    });
    var measure = areas(values, low, high);
    integral.textContent = '∫ from ' + fmt(low) + ' to ' + fmt(high) + ' f(x) dx = ' + fmt(measure[0] - measure[1]);
    positiveText.textContent = 'Above axis +' + fmt(measure[0]);
    negativeText.textContent = 'Below axis ' + (measure[1] > .005 ? '−' : '') + fmt(measure[1]);
    chart.setAttribute('aria-label', FORMS[state.kind].label + ' from ' + fmt(low) + ' to ' + fmt(high) + '. Signed area ' + fmt(measure[0] - measure[1]) + '.');
  }
  var state = currentState();
  var shown = samples(state.kind, state.a, state.b);
  var shownLow = state.low, shownHigh = state.high, shownScale = scaleFor(shown), animation = 0;
  function update() {
    var next = currentState();
    var target = samples(next.kind, next.a, next.b);
    var targetScale = scaleFor(target);
    var startValues = shown.slice(), startLow = shownLow, startHigh = shownHigh, startScale = shownScale;
    if (animation) cancelAnimationFrame(animation);
    if (reduced) {
      shown = target; shownLow = next.low; shownHigh = next.high; shownScale = targetScale;
      draw(shown, shownLow, shownHigh, shownScale, next);
      return;
    }
    var start = performance.now();
    function frame(now) {
      var t = clamp((now - start) / 480, 0, 1);
      var ease = 1 - Math.pow(1 - t, 3);
      shown = target.map(function (y, i) { return startValues[i] + (y - startValues[i]) * ease; });
      shownLow = startLow + (next.low - startLow) * ease;
      shownHigh = startHigh + (next.high - startHigh) * ease;
      shownScale = startScale + (targetScale - startScale) * ease;
      draw(shown, shownLow, shownHigh, shownScale, next);
      if (t < 1) animation = requestAnimationFrame(frame); else animation = 0;
    }
    animation = requestAnimationFrame(frame);
  }
  select.addEventListener('change', function () { labels(); update(); });
  Object.keys(controls).forEach(function (key) {
    controls[key].addEventListener('input', function () {
      if (key === 'low' && +controls.low.value >= +controls.high.value) {
        controls.high.value = Math.min(+controls.high.max, +controls.low.value + .1);
      }
      if (key === 'high' && +controls.high.value <= +controls.low.value) {
        controls.low.value = Math.max(+controls.low.min, +controls.high.value - .1);
      }
      controls.low.max = (+controls.high.value - .1).toFixed(1);
      controls.high.min = (+controls.low.value + .1).toFixed(1);
      labels(); update();
    });
  });
  labels(); draw(shown, shownLow, shownHigh, shownScale, state);
}());
