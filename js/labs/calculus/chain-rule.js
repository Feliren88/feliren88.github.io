(function () {
  function chain(x, dx) {
    var g = x * x, f = Math.sin(g), inner = 2 * x, outer = Math.cos(g);
    return { x: x, dx: dx, g: g, f: f, dg: (x + dx) ** 2 - g,
      df: Math.sin((x + dx) ** 2) - f, inner: inner, outer: outer, rate: inner * outer,
      contributions: [x * outer, x * outer] };
  }
  function squaredLoss(w, x, b, y, shared) {
    var target = shared ? x : y, product = w * x, prediction = product + b, residual = prediction - target;
    return { w: w, x: x, b: b, y: target, product: product, prediction: prediction,
      residual: residual, loss: residual * residual,
      local: { productW: x, productX: w, predictionProduct: 1, predictionB: 1,
        residualPrediction: 1, residualY: -1, lossResidual: 2 * residual } };
  }
  function adjoints(w, x, b, y, shared) {
    var f = squaredLoss(w, x, b, y, shared), r = 2 * f.residual;
    var contributions = shared ? [r * w, -r] : [r * w];
    return { loss: 1, residual: r, prediction: r, product: r,
      w: r * x, x: contributions.reduce(function (a, v) { return a + v; }, 0), b: r,
      y: shared ? 0 : -r, xContributions: contributions };
  }
  function passCounts(inputs, outputs) { return { forward: inputs, reverse: outputs }; }
  var M = { chain: chain, squaredLoss: squaredLoss, adjoints: adjoints, passCounts: passCounts };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  XP.lab('calculus/chain-rule', function (root, api) {
    var el = XP.svgEl, fmt = XP.fmt, stage = root.querySelector('[data-stage]');
    var ctl = root.querySelector('[data-ctl]'), note = root.querySelector('[data-note]');
    var initial = { view: 'lines', x: 1, dx: 0.1, w: 2, b: -1, y: 3, pass: 0, inputs: 4, outputs: 1, parameter: 'x' };
    var s = Object.assign({}, initial), fraction = 1, dragStart = null;
    var motion = { from: Object.assign({}, s), to: Object.assign({}, s) };
    stage.innerHTML = '<div data-lines></div><div data-graph hidden></div>';
    var lines = stage.querySelector('[data-lines]'), graph = stage.querySelector('[data-graph]');
    var P = XP.plane(lines, { x: [-2.2, 2.2], y: [0, 6.6], w: 480, h: 360, pad: 16,
      label: 'Input, square and sine on 3 linked number lines' });
    var G = XP.plane(graph, { x: [0, 7.6], y: [0, 10.6], w: 400, h: 610, pad: 14,
      label: 'Forward values and reverse derivatives of squared error' });
    var dlg = XP.dialog(root);
    ctl.innerHTML = '<button type="button" data-act="play">Play the pass</button>' +
      '<label>Motion <input type="range" data-k="progress" min="0" max="1" step="0.01" value="1" aria-label="Scrub the forward and reverse pass"></label>' +
      '<label>View <select data-k="view"><option value="lines">Linked number lines</option><option value="loss">Squared error</option><option value="shared">Squared error with y = x</option></select></label>' +
      '<label data-parameter-label hidden>Move <select data-k="parameter" aria-label="Model input to drag"><option value="x">Input x</option><option value="w">Weight w</option><option value="b">Offset b</option><option value="y">Target y</option></select></label>' +
      '<label data-shape-label hidden>Compare graph sizes <select data-k="shape" aria-label="Inputs and outputs"><option value="4,1">4 inputs, 1 output</option><option value="1,4">1 input, 4 outputs</option><option value="8,1">8 inputs, 1 output</option><option value="4,4">4 inputs, 4 outputs</option></select></label>' +
      '<button type="button" data-zoom="local">Local rates, worked</button><button type="button" data-zoom="adjoints" hidden>Reverse derivatives, worked</button>' +
      '<button type="button" data-zoom="passes" hidden>Pass counts, worked</button><button type="button" data-reset>Reset</button>';
    var progress = ctl.querySelector('[data-k="progress"]'), viewInput = ctl.querySelector('[data-k="view"]');
    var parameterInput = ctl.querySelector('[data-k="parameter"]'), shapeInput = ctl.querySelector('[data-k="shape"]');
    function snapshot() { return Object.assign({}, s); }
    function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
    function normalise(next) {
      var t = Object.assign(snapshot(), next);
      t.x = clamp(t.x, -1.8, 1.8); t.dx = clamp(t.x + t.dx, -2, 2) - t.x;
      ['w', 'b', 'y'].forEach(function (key) { t[key] = clamp(t[key], -3, 3); });
      if (t.view === 'shared' && t.parameter === 'y') t.parameter = 'x';
      return t;
    }
    function record(from, to, play) {
      api.interrupt(); motion = { from: from, to: to };
      if (play) api.animate(from, to, 800, function (st, f) { s = Object.assign({}, st); fraction = f; draw(); }, report);
      else { s = Object.assign({}, to); fraction = 1; draw(); report(); }
    }
    function change(next) { api.interrupt(); record(snapshot(), normalise(next), false); }
    function lineHandle(which, cls, label) {
      var h = P.handle({ x: which === 'x' ? s.x : s.x + s.dx, y: 5.3, snap: 0.05,
        bounds: [[-2, 2], [5.3, 5.3]], cls: cls, part: 'chain', label: label,
        onMove: function (x, y, done) {
          api.interrupt(); var from = dragStart || snapshot();
          record(from, normalise(which === 'x' ? { x: x } : { dx: x - s.x }), false);
          if (done) dragStart = null;
        } });
      h.el.setAttribute('data-handle', which);
      h.el.addEventListener('pointerdown', function () { dragStart = snapshot(); });
      return h;
    }
    var hx = lineHandle('x', 'is-q', 'Input x'), hdx = lineHandle('dx', 'is-k', 'Nudged input x plus dx');
    var nodes = { w: [1.3, 8.3], x: [1.3, 6.6], b: [1.3, 4.7], y: [1.3, 2.8],
      product: [5.5, 7.7], prediction: [5.5, 5.8], residual: [5.5, 3.9], loss: [5.5, 1.6] };
    var hp = G.handle({ x: 1.55, y: 6.6, snap: 0.025, bounds: [[0.1, 7.5], [0.2, 10.4]], cls: 'is-q', part: 'inputs', label: 'Model input',
      onMove: function (x, y, done) {
        api.interrupt(); var from = dragStart || snapshot(), next = {};
        next[s.parameter] = Math.round((x - nodes[s.parameter][0]) * 4 * 10) / 10;
        record(from, normalise(next), false);
        if (done) dragStart = null;
      } });
    hp.el.setAttribute('data-handle', 'parameter');
    hp.el.addEventListener('pointerdown', function () { dragStart = snapshot(); });
    function text(plane, x, y, words, part) {
      return el('text', { x: plane.map.sx(x), y: plane.map.sy(y), 'text-anchor': 'middle', 'data-part': part }, XP.esc(words));
    }
    function lineMarkup() {
      var c = chain(s.x, s.dx), rows = [
        { y: 5.3, label: 'x', a: s.x, b: s.x + s.dx, rate: 'dx = ' + fmt(s.dx, 3), part: 'chain', cls: 'is-q' },
        { y: 3.2, label: 'g(x) = x²', a: -2 + (c.g + 1) * 2 / 3, b: -2 + (c.g + c.dg + 1) * 2 / 3, rate: 'g′ = ' + fmt(c.inner, 4), part: 'inner', cls: 'is-k' },
        { y: 1.1, label: 'f(g) = sin(g)', a: c.f * 1.8, b: (c.f + c.df) * 1.8, rate: 'f′ = ' + fmt(c.outer, 4), part: 'outer', cls: 'is-o' }
      ];
      var h = '';
      rows.forEach(function (r, i) {
        h += el('line', { x1: P.map.sx(-2), y1: P.map.sy(r.y), x2: P.map.sx(2), y2: P.map.sy(r.y), 'class': 'pl-axis' });
        h += text(P, -0.8, r.y + 0.5, r.label, r.part) + text(P, 1.25, r.y + 0.5, r.rate, r.part);
        h += P.dot(r.a, r.y, 5, 'pl-mark pl-point ' + r.cls, r.part);
        if (s.pass >= i / 3) h += P.arrow(r.a, r.y - 0.2, r.b, r.y - 0.2, r.cls, r.part) +
          P.dot(r.b, r.y, 4, 'pl-mark pl-open ' + r.cls, r.part);
        if (i > 0) {
          h += el('line', { x1: P.map.sx(rows[i - 1].a), y1: P.map.sy(rows[i - 1].y), x2: P.map.sx(r.a), y2: P.map.sy(r.y),
            'class': 'pl-dash pl-mark ' + r.cls, 'data-part': r.part });
        }
      });
      h += text(P, 0, 0.25, 'Total rate = ' + fmt(c.inner, 4) + ' × ' + fmt(c.outer, 4) + ' = ' + fmt(c.rate, 4), 'outer');
      return h;
    }
    function graphMarkup() {
      var shared = s.view === 'shared', f = squaredLoss(s.w, s.x, s.b, s.y, shared), a = adjoints(s.w, s.x, s.b, s.y, shared);
      var edges = [['w','product',f.local.productW], ['x','product',f.local.productX], ['product','prediction',1], ['b','prediction',1],
        ['prediction','residual',1], [shared ? 'x' : 'y','residual',-1], ['residual','loss',2*f.residual]];
      var h = '', forward = s.pass <= 0.5, step = forward ? s.pass * 8 : (1 - s.pass) * 8;
      edges.forEach(function (edge, i) {
        var u = nodes[edge[0]], v = nodes[edge[1]], colour = edge[0] === 'x' ? 'is-q' : edge[0] === 'b' ? 'is-k' : 'is-o';
        var dx = v[0] - u[0], dy = v[1] - u[1];
        var inset = Math.min(dx ? 1.1 / Math.abs(dx) : 1, dy ? 0.42 / Math.abs(dy) : 1);
        var start = [u[0] + dx * inset, u[1] + dy * inset], end = [v[0] - dx * inset, v[1] - dy * inset];
        var labelY = (u[1] + v[1]) / 2 + (i === 5 && shared ? -0.55 : 0.35);
        h += G.arrow(forward ? start[0] : end[0], forward ? start[1] : end[1], forward ? end[0] : start[0], forward ? end[1] : start[1], colour, 'graph');
        h += text(G, (u[0] + v[0]) / 2 - (dx === 0 ? 0.95 : 0), labelY, '×' + fmt(edge[2], 1), 'graph');
      });
      Object.keys(nodes).forEach(function (key) {
        var p = nodes[key], input = ['w','x','b','y'].indexOf(key) >= 0;
        if (key === 'y' && shared) return;
        var label = key === 'prediction' ? 'p = wx + b' : key === 'residual' ? 'r = p − y' : key === 'product' ? 'wx' : key === 'loss' ? 'L = r²' :
          key === 'w' ? 'Weight w' : key === 'x' ? 'Input x' : key === 'b' ? 'Offset b' : 'Target y';
        h += el('rect', { x: G.map.sx(p[0] - 1.1), y: G.map.sy(p[1] + 0.42), width: G.map.sx(2.2) - G.map.sx(0),
          height: G.map.sy(0) - G.map.sy(0.84), 'class': 'pl-node pl-mark ' + (key === 'x' ? 'is-q' : key === 'b' ? 'is-k' : 'is-o'),
          'data-part': input ? 'inputs' : 'graph' });
        h += text(G, p[0], p[1] + 0.05, label, input ? 'inputs' : 'graph');
        h += text(G, p[0], p[1] - 0.3, fmt(f[key], 2), input ? 'inputs' : 'graph');
        if (!forward) h += text(G, p[0], p[1] + 0.8, '∂L/∂' + (key === 'prediction' ? 'p' : key === 'residual' ? 'r' : key === 'product' ? '(wx)' : key === 'loss' ? 'L' : key) + ' = ' + fmt(a[key], 1), 'reverse');
      });
      var path = [nodes.x, nodes.product, nodes.prediction, nodes.residual, nodes.loss];
      var at = clamp(step, 0, path.length - 1), index = Math.min(path.length - 2, Math.floor(at)), t = at - index;
      var point = XP.mix(path[index], path[index+1], t);
      h += G.dot(point[0], point[1], 7, 'pl-mark pl-point is-v', forward ? 'graph' : 'reverse');
      h += text(G, 3.8, 10, forward ? 'Values move forward' : 'Loss derivatives move backward', forward ? 'graph' : 'reverse');
      if (shared) h += text(G, 3.8, 0.85, 'y = x     ' + fmt(a.xContributions[0], 1) + ' + (' + fmt(a.xContributions[1], 1) + ') = ' + fmt(a.x, 1), 'reverse');
      var count = passCounts(s.inputs, s.outputs);
      h += text(G, 3.8, 0.4, 'Compared graph has ' + s.inputs + ' inputs and ' + s.outputs + (s.outputs === 1 ? ' output' : ' outputs'), 'counts');
      h += text(G, 3.8, 0.05, 'Forward passes = ' + count.forward + '     Reverse passes = ' + count.reverse, 'counts');
      return h;
    }
    function draw() {
      var c = chain(s.x, s.dx), f = squaredLoss(s.w, s.x, s.b, s.y, s.view === 'shared');
      var a = adjoints(s.w, s.x, s.b, s.y, s.view === 'shared');
      api.values({ x: s.x, g: c.g, f: c.f, chainRate: c.rate, loss: f.loss, lossGradient: a.x,
        viewLabel: s.view === 'lines' ? 'Linked number lines' : s.view === 'shared' ? 'Squared error with y = x' : 'Squared error' }, 4);
      lines.hidden = s.view !== 'lines'; graph.hidden = s.view === 'lines';
      root.querySelector('[data-line-eq]').hidden = s.view !== 'lines';
      root.querySelector('[data-loss-eq]').hidden = s.view === 'lines';
      ctl.querySelector('[data-zoom="local"]').hidden = s.view !== 'lines';
      ctl.querySelector('[data-zoom="adjoints"]').hidden = s.view === 'lines';
      ctl.querySelector('[data-zoom="passes"]').hidden = s.view === 'lines';
      ctl.querySelector('[data-parameter-label]').hidden = s.view === 'lines';
      ctl.querySelector('[data-shape-label]').hidden = s.view === 'lines';
      parameterInput.querySelector('[value="y"]').disabled = s.view === 'shared';
      viewInput.value = s.view; parameterInput.value = s.parameter; shapeInput.value = s.inputs + ',' + s.outputs; progress.value = fraction;
      P.plot.innerHTML = lineMarkup(); G.plot.innerHTML = graphMarkup();
      hx.set(s.x, 5.3); hdx.set(s.x + s.dx, 5.3);
      var p = nodes[s.parameter]; hp.set(p[0] + 0.25 * s[s.parameter], p[1] - 0.55);
      hp.el.setAttribute('aria-label', 'Move ' + s.parameter + ', currently ' + fmt(s[s.parameter], 2) + '. Left and right arrows change it.');
      note.textContent = s.view === 'lines' ? 'The square scales a small input change by ' + fmt(c.inner, 4) + '. After that, sine scales it by ' + fmt(c.outer, 4) + '.' :
        s.view === 'shared' ? 'Here, x also supplies the target y. Therefore, its reverse derivative adds both paths to the loss.' :
        'The residual r is the prediction minus the target. After squaring r for the loss, follow derivatives backward to each input.';
    }
    function report() { api.say(note.textContent); }
    function precise(x) { return x < 0 ? '−' + (-x).toFixed(4) : x.toFixed(4); }
    function table(head, rows) {
      return '<div class="lab-calculus-table"><table class="xp-table lab-table"><thead><tr>' + head.map(function (h) { return '<th scope="col">'+h+'</th>'; }).join('') +
        '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+'</tbody></table></div>';
    }
    function zoom(which, button) {
      var c = chain(s.x, s.dx), shared = s.view === 'shared';
      var f = squaredLoss(s.w,s.x,s.b,s.y,shared), a = adjoints(s.w,s.x,s.b,s.y,shared);
      if (which === 'local') dlg.open('Local rates, worked', '<p>This calculation uses the current input and its small change dx.</p>' + table(['Quantity','Value'], [
        ['x, dx',precise(s.x)+', '+precise(s.dx)], ['g(x) = x²',precise(c.g)], ['sin(g(x))',precise(c.f)],
        ['g′(x), cos(g(x))',precise(c.inner)+', '+precise(c.outer)], ['Their product',precise(c.rate)],
        ['Actual output change',precise(c.df)], ['Local predicted change',precise(c.rate*s.dx)],
        ['The 2 paths through x × x',c.contributions.map(precise).join(' + ')+' = '+precise(c.rate)]
      ]), button);
      else if (which === 'adjoints') dlg.open('Reverse derivatives, worked', '<p>Each reverse derivative measures the loss change per small change at that node. Accordingly, this table uses the current inputs’ final loss.</p>' +
        table(['Node','Forward value','Loss derivative'], Object.keys(nodes).filter(function(k){return !shared || k!=='y';}).map(function(k){return [k,precise(f[k]),precise(a[k])];})) +
        '<p>The paths to x contribute ' + a.xContributions.map(precise).join(' + ') + ' = ' + precise(a.x) + '.</p>', button);
      else {
        var counts = passCounts(s.inputs,s.outputs);
        dlg.open('Pass counts, worked', '<p>One forward derivative pass tracks one input’s effect on every output. Conversely, one reverse pass tracks one output’s dependence on every input.</p>' +
          table(['Graph size','Pass count'], [[s.inputs+' inputs',counts.forward+' forward passes'],[s.outputs+' outputs',counts.reverse+' reverse passes']]) +
          '<p>These counts assume each pass traverses the same graph. Moreover, reverse mode stores values for its backward calculation.</p>', button);
      }
    }
    ctl.addEventListener('input', function (e) {
      if (e.target !== progress) return;
      var requested = +progress.value; api.interrupt(); fraction = requested;
      s = XP.mix(motion.from,motion.to,XP.ease(requested));
      s.inputs = requested < 0.5 ? motion.from.inputs : motion.to.inputs;
      s.outputs = requested < 0.5 ? motion.from.outputs : motion.to.outputs;
      draw(); report();
    });
    ctl.addEventListener('change', function (e) {
      if (e.target === viewInput) { var view = viewInput.value; change({view:view, pass:1}); }
      if (e.target === parameterInput) { var parameter = parameterInput.value; change({parameter:parameter}); }
      if (e.target === shapeInput) { var shape = shapeInput.value.split(',').map(Number); change({inputs:shape[0],outputs:shape[1]}); }
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      api.interrupt();
      if (b.hasAttribute('data-zoom')) return zoom(b.getAttribute('data-zoom'),b);
      if (b.hasAttribute('data-reset')) return record(snapshot(),Object.assign({},initial),false);
      if (b.getAttribute('data-act') === 'play') {
        var from = Object.assign(snapshot(),{pass:0}); record(from,Object.assign({},from,{pass:1}),true);
      }
    });
    var PAGES = [
      {t:'Start with 1 input',parts:['chain','inner','outer'],state:{view:'lines',pass:0},body:'<p>At x = 1, squaring gives 1 and sine gives about 0.8415. Next, drag the second point to make a small input change.</p>'},
      {t:'Scale the input change',parts:['chain','inner'],state:{view:'lines',pass:0.5},body:'<p>At x = 1, the square’s derivative is 2. Therefore, it roughly doubles a small input change on the middle line.</p>'},
      {t:'Multiply the local rates',parts:['inner','outer'],state:{view:'lines',dx:0.01,pass:1},body:'<p>Sine has derivative cos(1), about 0.5403, at the middle value. Therefore, the total rate is 2 × cos(1), about 1.0806.</p>'},
      {t:'Calculate the error forward',parts:['inputs','graph'],state:{view:'loss',pass:0.5},body:'<p>The model predicts 1 from input 1, weight 2 and offset −1. After subtracting target 3, squaring error −2 gives loss 4.</p>'},
      {t:'Send loss derivatives backward',parts:['inputs','reverse','graph'],state:{view:'loss',pass:1},body:'<p>At error −2, the loss changes at rate −4. Therefore, multiplying by weight 2 gives input derivative −8.</p>'},
      {t:'Add the paths that meet',parts:['inputs','reverse','graph'],state:{view:'shared',b:0,pass:1},body:'<p>Now x also supplies target y, reaching loss along 2 paths. Therefore, its derivative adds their contributions, 4 and −2, to give 2.</p>'},
      {t:'A perfect prediction',parts:['inputs','reverse','graph'],state:{view:'loss',y:1,pass:1},body:'<p>The prediction and target now both equal 1, giving loss 0. Therefore, every first derivative of this squared loss is also 0.</p>'},
      {t:'Choose a direction by the graph',parts:['graph','counts'],state:{view:'loss',pass:1},body:'<p>With 4 inputs and 1 output, tracking each input forward takes 4 passes. Conversely, tracing that output backward gives all input derivatives in 1 pass.</p>'}
    ];
    draw(); report();
    XP.guide(root.querySelector('[data-guide-box]'),PAGES,function(p,i,redraw){
      if(!p){api.focus([]);return;}
      if(!redraw){api.interrupt();record(snapshot(),Object.assign({},initial,p.state),true);}
      api.focus(p.parts);
    });
  });
})();
