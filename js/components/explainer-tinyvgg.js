/* ════════════════════════════════════════════════════════
   Tiny VGG, the small image classifier trained by CNN Explainer
   (Polo Club of Data Science, MIT), run in plain JavaScript.

   Weights come from assets/data/tiny-vgg.bin through tiny-vgg.json, both
   written by scripts/build_explainer_data.py. The layers follow Keras exactly:
   3x3 cross-correlation with no padding, ReLU, 2x2 max pooling, a flatten in
   height-width-channel order, and a softmax over 10 classes.
   scripts/verify_explainers.py checks every layer against NumPy.

   Used by the CNN explainer on /computer-vision/ and the image-editing
   explainer on /deep-learning/. Defines XP.tinyvgg in the browser and exports
   the same object under Node.
   ════════════════════════════════════════════════════════ */
(function (root) {

  /* A feature map stack is { h, w, c, d } with d a Float32Array in HWC order. */
  function conv(x, kernel, bias) {
    var K = 3, co = bias.length, h = x.h - 2, w = x.w - 2, ci = x.c;
    var out = new Float32Array(h * w * co);
    for (var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        for (var o = 0; o < co; o++) {
          var s = bias[o];
          for (var di = 0; di < K; di++) {
            for (var dj = 0; dj < K; dj++) {
              var xo = ((i + di) * x.w + (j + dj)) * ci, ko = (di * K + dj) * ci * co + o;
              for (var c = 0; c < ci; c++) s += x.d[xo + c] * kernel[ko + c * co];
            }
          }
          out[(i * w + j) * co + o] = s;
        }
      }
    }
    return { h: h, w: w, c: co, d: out };
  }
  function relu(x) {
    var d = new Float32Array(x.d.length);
    for (var i = 0; i < d.length; i++) d[i] = x.d[i] > 0 ? x.d[i] : 0;
    return { h: x.h, w: x.w, c: x.c, d: d };
  }
  function pool(x) {
    var h = Math.floor(x.h / 2), w = Math.floor(x.w / 2), d = new Float32Array(h * w * x.c);
    for (var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        for (var c = 0; c < x.c; c++) {
          var m = -Infinity;
          for (var a = 0; a < 2; a++) {
            for (var b = 0; b < 2; b++) m = Math.max(m, x.d[((2 * i + a) * x.w + 2 * j + b) * x.c + c]);
          }
          d[(i * w + j) * x.c + c] = m;
        }
      }
    }
    return { h: h, w: w, c: x.c, d: d };
  }
  function dense(x, kernel, bias) {
    var n = bias.length, out = new Float32Array(n);
    for (var o = 0; o < n; o++) {
      var s = bias[o];
      for (var i = 0; i < x.d.length; i++) s += x.d[i] * kernel[i * n + o];
      out[o] = s;
    }
    return out;
  }

  /* Build a model object from the manifest and the raw weight bytes. */
  function load(manifest, buffer) {
    var all = new Float32Array(buffer), W = {};
    manifest.weights.forEach(function (t) { W[t.name] = all.subarray(t.offset, t.offset + t.size); });
    return { W: W, classes: manifest.classes, samples: manifest.samples };
  }

  /* Bytes of a 64x64 RGB image, 0 to 255, scaled to 0 to 1 as CNN Explainer does. */
  function input(rgb) {
    var d = new Float32Array(64 * 64 * 3);
    for (var i = 0; i < d.length; i++) d[i] = rgb[i] / 255;
    return { h: 64, w: 64, c: 3, d: d };
  }

  /* The full forward pass, keeping every intermediate stack by layer name. */
  function run(model, rgb) {
    var W = model.W, L = {};
    L.input = input(rgb);
    L.conv_1_1 = conv(L.input, W['conv_1_1/kernel'], W['conv_1_1/bias']);
    L.relu_1_1 = relu(L.conv_1_1);
    L.conv_1_2 = conv(L.relu_1_1, W['conv_1_2/kernel'], W['conv_1_2/bias']);
    L.relu_1_2 = relu(L.conv_1_2);
    L.max_pool_1 = pool(L.relu_1_2);
    L.conv_2_1 = conv(L.max_pool_1, W['conv_2_1/kernel'], W['conv_2_1/bias']);
    L.relu_2_1 = relu(L.conv_2_1);
    L.conv_2_2 = conv(L.relu_2_1, W['conv_2_2/kernel'], W['conv_2_2/bias']);
    L.relu_2_2 = relu(L.conv_2_2);
    L.max_pool_2 = pool(L.relu_2_2);
    L.logits = dense(L.max_pool_2, W['output/kernel'], W['output/bias']);
    var m = Math.max.apply(null, L.logits), e = [], s = 0;
    for (var i = 0; i < L.logits.length; i++) { e.push(Math.exp(L.logits[i] - m)); s += e[i]; }
    L.probs = e.map(function (v) { return v / s; });
    return L;
  }
  /* Only the probabilities, for when many passes are needed. */
  function predict(model, rgb) { return run(model, rgb).probs; }

  /* One channel of a stack, as a row-major array, for drawing a map. */
  function channel(x, c) {
    var out = new Float32Array(x.h * x.w);
    for (var i = 0; i < out.length; i++) out[i] = x.d[i * x.c + c];
    return out;
  }

  function decode(b64) {
    if (typeof atob === 'function') {
      var s = atob(b64), u = new Uint8Array(s.length);
      for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
      return u;
    }
    return new Uint8Array(Buffer.from(b64, 'base64'));
  }

  /* Fetch the manifest and weights once per page. */
  var loading = null;
  function fetchModel(jsonUrl, binUrl) {
    if (!loading) {
      loading = Promise.all([
        fetch(jsonUrl).then(function (r) { return r.json(); }),
        fetch(binUrl).then(function (r) { return r.arrayBuffer(); })
      ]).then(function (res) { return load(res[0], res[1]); });
    }
    return loading;
  }

  var TV = { conv: conv, relu: relu, pool: pool, dense: dense, load: load, input: input,
    run: run, predict: predict, channel: channel, decode: decode, fetchModel: fetchModel,
    LAYERS: ['conv_1_1', 'relu_1_1', 'conv_1_2', 'relu_1_2', 'max_pool_1',
      'conv_2_1', 'relu_2_1', 'conv_2_2', 'relu_2_2', 'max_pool_2'] };
  if (typeof module === 'object' && module.exports) module.exports = TV;
  else { root.XP = root.XP || {}; root.XP.tinyvgg = TV; }
})(this);
