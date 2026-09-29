/* Interactive probability distributions for the interview notebook. */
(function () {
  'use strict';

  var PI = Math.PI;
  var SQRT2 = Math.SQRT2;
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function logGamma(z) {
    var p = [0.9999999999998099, 676.5203681218851, -1259.1392167224028,
      771.3234287776531, -176.6150291621406, 12.507343278686905,
      -0.1385710952657201, 9.984369578019572e-6, 1.5056327351493116e-7];
    if (z < 0.5) return Math.log(PI) - Math.log(Math.sin(PI * z)) - logGamma(1 - z);
    z -= 1;
    var sum = p[0];
    for (var i = 1; i < p.length; i++) sum += p[i] / (z + i);
    var t = z + 7.5;
    return 0.5 * Math.log(2 * PI) + (z + 0.5) * Math.log(t) - t + Math.log(sum);
  }
  function logChoose(n, k) {
    return k < 0 || k > n ? -Infinity : logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
  }
  function betaFraction(a, b, x) {
    var c = 1, d = 1 - (a + b) * x / (a + 1);
    if (Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d;
    var h = d;
    for (var m = 1; m <= 300; m++) {
      var m2 = 2 * m;
      var aa = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30;
      c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30;
      c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      var delta = d * c; h *= delta;
      if (Math.abs(delta - 1) < 1e-12) break;
    }
    return h;
  }
  function betaI(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var front = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log1p(-x));
    return clamp(x < (a + 1) / (a + b + 2)
      ? front * betaFraction(a, b, x) / a
      : 1 - front * betaFraction(b, a, 1 - x) / b, 0, 1);
  }
  function gammaP(a, x) {
    if (x <= 0) return 0;
    var front = Math.exp(a * Math.log(x) - x - logGamma(a));
    if (x < a + 1) {
      var sum = 1 / a, term = sum;
      for (var n = 1; n <= 400; n++) {
        term *= x / (a + n); sum += term;
        if (Math.abs(term) < Math.abs(sum) * 1e-12) break;
      }
      return clamp(sum * front, 0, 1);
    }
    var b = x + 1 - a, c = 1e30, d = 1 / b, h = d;
    for (var i = 1; i <= 400; i++) {
      var an = -i * (i - a);
      b += 2;
      d = an * d + b; if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + an / c; if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      var delta = d * c; h *= delta;
      if (Math.abs(delta - 1) < 1e-12) break;
    }
    return clamp(1 - front * h, 0, 1);
  }
  function normalCdf(z) {
    var x = Math.abs(z) / SQRT2, t = 1 / (1 + 0.3275911 * x);
    var poly = (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
    var erf = 1 - poly * Math.exp(-x * x);
    return clamp(0.5 * (1 + (z < 0 ? -erf : erf)), 0, 1);
  }
  function gammaDensity(x, shape, scale) {
    if (x < 0) return 0;
    if (x === 0) return shape < 1 ? Infinity : shape === 1 ? 1 / scale : 0;
    return Math.exp((shape - 1) * Math.log(x) - x / scale - logGamma(shape) - shape * Math.log(scale));
  }
  function sumTo(k, fn) {
    var result = 0;
    for (var i = 0; i <= Math.floor(k); i++) result += fn(i);
    return clamp(result, 0, 1);
  }
  function knob(key, label, min, max, step, value) {
    return { key: key, label: label, min: min, max: max, step: step, value: value };
  }
  function probs(s) { return [s.a, (1 - s.a) * s.b, (1 - s.a) * (1 - s.b)]; }
  function discrete(name, params, range, mass, cdf, note) {
    return { name: name, type: 'discrete', params: params, range: range, density: mass, cdf: cdf, note: note || '' };
  }
  function continuous(name, params, range, density, cdf, note) {
    return { name: name, type: 'continuous', params: params, range: range, density: density, cdf: cdf, note: note || '' };
  }

  var D = {
    bernoulli: discrete('Bernoulli', [knob('p', 'Success probability p', .01, .99, .01, .5)],
      function () { return [0, 1]; },
      function (k, s) { return k === 0 ? 1 - s.p : k === 1 ? s.p : 0; },
      function (x, s) { return x < 0 ? 0 : x < 1 ? 1 - s.p : 1; }),
    binomial: discrete('Binomial', [knob('n', 'Trials n', 1, 30, 1, 12), knob('p', 'Success probability p', .01, .99, .01, .5)],
      function (s) { return [0, s.n]; },
      function (k, s) { return k < 0 || k > s.n ? 0 : Math.exp(logChoose(s.n, k) + k * Math.log(s.p) + (s.n - k) * Math.log1p(-s.p)); },
      function (x, s) { return sumTo(Math.min(x, s.n), function (k) { return D.binomial.density(k, s); }); }),
    geometric: discrete('Geometric', [knob('p', 'Success probability p', .1, .95, .01, .35)],
      function (s) { return [1, Math.min(70, Math.ceil(Math.log(.001) / Math.log1p(-s.p)))]; },
      function (k, s) { return k < 1 ? 0 : Math.pow(1 - s.p, k - 1) * s.p; },
      function (x, s) { return x < 1 ? 0 : 1 - Math.pow(1 - s.p, Math.floor(x)); },
      'X counts trials up to and including the first success.'),
    'negative-binomial': discrete('Negative binomial', [knob('r', 'Successes r', 1, 10, 1, 4), knob('p', 'Success probability p', .15, .9, .01, .5)],
      function (s) { var mean = s.r * (1 - s.p) / s.p; return [0, Math.ceil(mean + 6 * Math.sqrt(mean / s.p))]; },
      function (k, s) { return k < 0 ? 0 : Math.exp(logChoose(k + s.r - 1, k) + s.r * Math.log(s.p) + k * Math.log1p(-s.p)); },
      function (x, s) { return sumTo(x, function (k) { return D['negative-binomial'].density(k, s); }); },
      'X counts failures before the rth success.'),
    hypergeometric: discrete('Hypergeometric', [knob('K', 'Successes in 50 items', 1, 49, 1, 20), knob('n', 'Items drawn', 1, 49, 1, 12)],
      function (s) { return [Math.max(0, s.n - (50 - s.K)), Math.min(s.n, s.K)]; },
      function (k, s) { return Math.exp(logChoose(s.K, k) + logChoose(50 - s.K, s.n - k) - logChoose(50, s.n)); },
      function (x, s) { var lo = D.hypergeometric.range(s)[0], total = 0; for (var k = lo; k <= Math.floor(x); k++) total += D.hypergeometric.density(k, s); return clamp(total, 0, 1); },
      'Sampling is without replacement from 50 items.'),
    categorical: discrete('Categorical', [knob('a', 'P(A)', .05, .9, .01, .35), knob('b', 'Share of the remainder for B', .05, .95, .01, .5)],
      function () { return [0, 2]; },
      function (k, s) { return probs(s)[k] || 0; },
      function (x, s) { var p = probs(s); return x < 0 ? 0 : x < 1 ? p[0] : x < 2 ? p[0] + p[1] : 1; },
      'A, B and C are ordered only for this CDF. Category order has no inherent meaning.'),
    'discrete-uniform': discrete('Discrete uniform', [knob('a', 'First integer', -5, 5, 1, 0), knob('n', 'Number of values', 2, 16, 1, 6)],
      function (s) { return [s.a, s.a + s.n - 1]; },
      function (k, s) { return k >= s.a && k < s.a + s.n ? 1 / s.n : 0; },
      function (x, s) { return clamp((Math.floor(x) - s.a + 1) / s.n, 0, 1); }),
    poisson: discrete('Poisson', [knob('lambda', 'Mean rate λ', .2, 20, .1, 5)],
      function (s) { return [0, Math.ceil(s.lambda + 5 * Math.sqrt(s.lambda))]; },
      function (k, s) { return k < 0 ? 0 : Math.exp(-s.lambda + k * Math.log(s.lambda) - logGamma(k + 1)); },
      function (x, s) { return sumTo(x, function (k) { return D.poisson.density(k, s); }); }),
    uniform: continuous('Uniform', [knob('a', 'Lower bound a', -3, 2, .1, -1), knob('width', 'Width b − a', .5, 7, .1, 4)],
      function (s) { return [s.a - .6, s.a + s.width + .6]; },
      function (x, s) { return x >= s.a && x <= s.a + s.width ? 1 / s.width : 0; },
      function (x, s) { return clamp((x - s.a) / s.width, 0, 1); }),
    normal: continuous('Normal', [knob('mu', 'Mean μ', -3, 3, .1, 0), knob('sigma', 'Standard deviation σ', .3, 3, .1, 1)],
      function (s) { return [s.mu - 4 * s.sigma, s.mu + 4 * s.sigma]; },
      function (x, s) { var z = (x - s.mu) / s.sigma; return Math.exp(-z * z / 2) / (s.sigma * Math.sqrt(2 * PI)); },
      function (x, s) { return normalCdf((x - s.mu) / s.sigma); }),
    'student-t': continuous('Student t', [knob('nu', 'Degrees of freedom ν', 1, 30, 1, 5), knob('scale', 'Scale', .4, 3, .1, 1)],
      function (s) { return [-6 * s.scale, 6 * s.scale]; },
      function (x, s) { var z = x / s.scale; return Math.exp(logGamma((s.nu + 1) / 2) - logGamma(s.nu / 2)) / (Math.sqrt(s.nu * PI) * s.scale) * Math.pow(1 + z * z / s.nu, -(s.nu + 1) / 2); },
      function (x, s) { var z = x / s.scale, tail = .5 * betaI(s.nu / (s.nu + z * z), s.nu / 2, .5); return z < 0 ? tail : 1 - tail; },
      'The plot shows a finite window of an unbounded distribution.'),
    exponential: continuous('Exponential', [knob('lambda', 'Rate λ', .2, 3, .1, 1)],
      function (s) { return [0, 7 / s.lambda]; },
      function (x, s) { return x < 0 ? 0 : s.lambda * Math.exp(-s.lambda * x); },
      function (x, s) { return x < 0 ? 0 : 1 - Math.exp(-s.lambda * x); }),
    gamma: continuous('Gamma', [knob('shape', 'Shape k', .6, 9, .1, 3), knob('scale', 'Scale θ', .3, 3, .1, 1)],
      function (s) { return [0, (s.shape + 5 * Math.sqrt(s.shape)) * s.scale]; },
      function (x, s) { return gammaDensity(x, s.shape, s.scale); },
      function (x, s) { return gammaP(s.shape, x / s.scale); }),
    'chi-square': continuous('Chi square', [knob('nu', 'Degrees of freedom ν', 1, 24, 1, 5)],
      function (s) { return [0, s.nu + 6 * Math.sqrt(2 * s.nu)]; },
      function (x, s) { return gammaDensity(x, s.nu / 2, 2); },
      function (x, s) { return gammaP(s.nu / 2, x / 2); }),
    beta: continuous('Beta', [knob('a', 'Shape α', .6, 9, .1, 2), knob('b', 'Shape β', .6, 9, .1, 4)],
      function () { return [0, 1]; },
      function (x, s) {
        var logB = logGamma(s.a) + logGamma(s.b) - logGamma(s.a + s.b);
        if (x < 0 || x > 1) return 0;
        if (x === 0) return s.a < 1 ? Infinity : s.a === 1 ? Math.exp(-logB) : 0;
        if (x === 1) return s.b < 1 ? Infinity : s.b === 1 ? Math.exp(-logB) : 0;
        return Math.exp((s.a - 1) * Math.log(x) + (s.b - 1) * Math.log1p(-x) - logB);
      },
      function (x, s) { return betaI(x, s.a, s.b); },
      'Shapes below 1 rise steeply at an endpoint.'),
    lognormal: continuous('Lognormal', [knob('mu', 'Log mean μ', -1, 1, .1, 0), knob('sigma', 'Log standard deviation σ', .3, 1.5, .1, .6)],
      function (s) { return [0, Math.exp(s.mu + 3.5 * s.sigma)]; },
      function (x, s) { if (x <= 0) return 0; var z = (Math.log(x) - s.mu) / s.sigma; return Math.exp(-z * z / 2) / (x * s.sigma * Math.sqrt(2 * PI)); },
      function (x, s) { return x <= 0 ? 0 : normalCdf((Math.log(x) - s.mu) / s.sigma); }),
    weibull: continuous('Weibull', [knob('shape', 'Shape k', .6, 5, .1, 1.8), knob('scale', 'Scale λ', .4, 5, .1, 2)],
      function (s) { return [0, s.scale * Math.pow(8, 1 / s.shape)]; },
      function (x, s) { return x < 0 ? 0 : x === 0 ? (s.shape < 1 ? Infinity : s.shape === 1 ? 1 / s.scale : 0) : s.shape / s.scale * Math.pow(x / s.scale, s.shape - 1) * Math.exp(-Math.pow(x / s.scale, s.shape)); },
      function (x, s) { return x <= 0 ? 0 : 1 - Math.exp(-Math.pow(x / s.scale, s.shape)); }),
    logistic: continuous('Logistic', [knob('mu', 'Centre μ', -3, 3, .1, 0), knob('scale', 'Scale s', .3, 3, .1, 1)],
      function (s) { return [s.mu - 8 * s.scale, s.mu + 8 * s.scale]; },
      function (x, s) { var z = Math.exp(-(x - s.mu) / s.scale); return z / (s.scale * Math.pow(1 + z, 2)); },
      function (x, s) { return 1 / (1 + Math.exp(-(x - s.mu) / s.scale)); }),
    laplace: continuous('Laplace', [knob('mu', 'Centre μ', -3, 3, .1, 0), knob('scale', 'Scale b', .3, 3, .1, 1)],
      function (s) { return [s.mu - 7 * s.scale, s.mu + 7 * s.scale]; },
      function (x, s) { return Math.exp(-Math.abs(x - s.mu) / s.scale) / (2 * s.scale); },
      function (x, s) { return x < s.mu ? .5 * Math.exp((x - s.mu) / s.scale) : 1 - .5 * Math.exp(-(x - s.mu) / s.scale); }),
    cauchy: continuous('Cauchy', [knob('mu', 'Centre x₀', -3, 3, .1, 0), knob('scale', 'Scale γ', .3, 3, .1, 1)],
      function (s) { return [s.mu - 8 * s.scale, s.mu + 8 * s.scale]; },
      function (x, s) { var z = (x - s.mu) / s.scale; return 1 / (PI * s.scale * (1 + z * z)); },
      function (x, s) { return .5 + Math.atan((x - s.mu) / s.scale) / PI; },
      'The Cauchy distribution has no finite mean.'),
    rayleigh: continuous('Rayleigh', [knob('sigma', 'Scale σ', .3, 4, .1, 1.5)],
      function (s) { return [0, 4.5 * s.sigma]; },
      function (x, s) { return x < 0 ? 0 : x / (s.sigma * s.sigma) * Math.exp(-x * x / (2 * s.sigma * s.sigma)); },
      function (x, s) { return x < 0 ? 0 : 1 - Math.exp(-x * x / (2 * s.sigma * s.sigma)); }),
    pareto: continuous('Pareto', [knob('alpha', 'Shape α', 1.1, 5, .1, 2)],
      function () { return [1, 12]; },
      function (x, s) { return x < 1 ? 0 : s.alpha / Math.pow(x, s.alpha + 1); },
      function (x, s) { return x < 1 ? 0 : 1 - Math.pow(x, -s.alpha); },
      'The minimum value is 1. The right tail continues beyond the plot.'),
    triangular: continuous('Triangular', [knob('mode', 'Peak c, with bounds 0 and 10', .2, 9.8, .1, 4)],
      function () { return [-1, 11]; },
      function (x, s) { return x < 0 || x > 10 ? 0 : x <= s.mode ? x / (5 * s.mode) : (10 - x) / (5 * (10 - s.mode)); },
      function (x, s) { return x <= 0 ? 0 : x >= 10 ? 1 : x <= s.mode ? x * x / (10 * s.mode) : 1 - (10 - x) * (10 - x) / (10 * (10 - s.mode)); }),
    f: continuous('F', [knob('d1', 'Numerator degrees of freedom', 1, 20, 1, 5), knob('d2', 'Denominator degrees of freedom', 4, 40, 1, 12)],
      function (s) { return [0, Math.max(7, 4 * s.d2 / (s.d2 - 2))]; },
      function (x, s) {
        var a = s.d1 / 2, b = s.d2 / 2, z = s.d1 * x / s.d2;
        if (x < 0) return 0;
        if (x === 0) return a < 1 ? Infinity : a === 1 ? Math.exp(a * Math.log(s.d1 / s.d2) - logGamma(a) - logGamma(b) + logGamma(a + b)) : 0;
        return Math.exp(a * Math.log(s.d1 / s.d2) + (a - 1) * Math.log(x) - (a + b) * Math.log1p(z) - logGamma(a) - logGamma(b) + logGamma(a + b));
      },
      function (x, s) { return x <= 0 ? 0 : betaI(s.d1 * x / (s.d1 * x + s.d2), s.d1 / 2, s.d2 / 2); })
  };

  var FORMULAS = {
    bernoulli: ['P(X=0)=1−p, P(X=1)=p', 'F(x)=0 below 0, 1−p from 0 to 1, and 1 from 1 onward'],
    binomial: ['P(X=k)=C(n,k)p^k(1−p)^(n−k)', 'F(x)=Σ P(X=j), for j=0 to ⌊x⌋'],
    geometric: ['P(X=k)=p(1−p)^(k−1), k≥1', 'F(x)=1−(1−p)^⌊x⌋, x≥1'],
    'negative-binomial': ['P(X=k)=C(k+r−1,k)p^r(1−p)^k, k≥0', 'F(x)=Σ P(X=j), for j=0 to ⌊x⌋'],
    hypergeometric: ['P(X=k)=C(K,k)C(50−K,n−k)/C(50,n)', 'F(x)=Σ P(X=j), over allowed j≤x'],
    categorical: ['P(A)=a, P(B)=(1−a)b, P(C)=(1−a)(1−b)', 'F(A)=P(A), F(B)=P(A)+P(B), F(C)=1'],
    'discrete-uniform': ['P(X=k)=1/n for k=a,…,a+n−1', 'F(x)=clamp((⌊x⌋−a+1)/n, 0, 1)'],
    poisson: ['P(X=k)=e^(−λ)λ^k/k!', 'F(x)=Σ P(X=j), for j=0 to ⌊x⌋'],
    uniform: ['f(x)=1/(b−a) for a≤x≤b', 'F(x)=clamp((x−a)/(b−a), 0, 1)'],
    normal: ['f(x)=exp(−(x−μ)²/(2σ²))/(σ√(2π))', 'F(x)=Φ((x−μ)/σ), where Φ is the standard normal CDF'],
    'student-t': ['f(x)=Γ((ν+1)/2)[1+(x/s)²/ν]^(-(ν+1)/2)/(s√(νπ)Γ(ν/2))', 'F(x)=∫ from −∞ to x of f(t)dt'],
    exponential: ['f(x)=λe^(−λx) for x≥0', 'F(x)=1−e^(−λx) for x≥0'],
    gamma: ['f(x)=x^(k−1)e^(−x/θ)/(Γ(k)θ^k) for x>0', 'F(x)=∫ from 0 to x of f(t)dt'],
    'chi-square': ['f(x)=x^(ν/2−1)e^(−x/2)/(2^(ν/2)Γ(ν/2)) for x>0', 'F(x)=∫ from 0 to x of f(t)dt'],
    beta: ['f(x)=x^(α−1)(1−x)^(β−1)/B(α,β) for 0<x<1', 'F(x)=∫ from 0 to x of f(t)dt'],
    lognormal: ['f(x)=exp(−(ln x−μ)²/(2σ²))/(xσ√(2π)) for x>0', 'F(x)=Φ((ln x−μ)/σ) for x>0'],
    weibull: ['f(x)=(k/λ)(x/λ)^(k−1)e^(−(x/λ)^k) for x>0', 'F(x)=1−e^(−(x/λ)^k) for x≥0'],
    logistic: ['f(x)=e^(−(x−μ)/s)/(s(1+e^(−(x−μ)/s))²)', 'F(x)=1/(1+e^(−(x−μ)/s))'],
    laplace: ['f(x)=e^(−|x−μ|/b)/(2b)', 'F(x)=½e^((x−μ)/b) below μ; 1−½e^(−(x−μ)/b) from μ onward'],
    cauchy: ['f(x)=1/(πγ(1+((x−x₀)/γ)²))', 'F(x)=½+arctan((x−x₀)/γ)/π'],
    rayleigh: ['f(x)=xe^(−x²/(2σ²))/σ² for x≥0', 'F(x)=1−e^(−x²/(2σ²)) for x≥0'],
    pareto: ['f(x)=α/x^(α+1) for x≥1', 'F(x)=1−x^(−α) for x≥1'],
    triangular: ['f(x)=x/(5c) for 0≤x≤c; (10−x)/(5(10−c)) for c<x≤10', 'F(x)=x²/(10c) for x≤c; 1−(10−x)²/(10(10−c)) for x>c'],
    f: ['f(x)=(d₁/d₂)^(d₁/2)x^(d₁/2−1)/[B(d₁/2,d₂/2)(1+d₁x/d₂)^((d₁+d₂)/2)]', 'F(x)=∫ from 0 to x of f(t)dt']
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { distributions: D, formulas: FORMULAS, betaI: betaI, gammaP: gammaP, normalCdf: normalCdf };
    return;
  }
  if (typeof document === 'undefined') return;

  var NS = 'http://www.w3.org/2000/svg';
  var L = 42, R = 464, T = 16, B = 214, VW = 480, VH = 246;
  function node(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (key) { n.setAttribute(key, attrs[key]); });
    return n;
  }
  function fmt(x) {
    if (x === Infinity) return '∞';
    if (x === -Infinity) return '−∞';
    if (!isFinite(x)) return '—';
    if (x !== 0 && Math.abs(x) < .0001) return x.toExponential(2);
    return String(Math.round(x * 10000) / 10000);
  }
  function svgLine(g, x1, y1, x2, y2, className) {
    g.appendChild(node('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': className }));
  }
  function svgText(g, x, y, value, className) {
    var t = node('text', { x: x, y: y, 'class': className });
    t.textContent = value;
    g.appendChild(t);
  }
  function path(g, d, className) { g.appendChild(node('path', { d: d, 'class': className })); }
  function base(g, yMax, lo, hi, label, discreteTicks) {
    for (var i = 0; i <= 4; i++) {
      var y = B - (B - T) * i / 4;
      svgLine(g, L, y, R, y, i ? 'ivd-grid' : 'ivd-axis');
      svgText(g, L - 7, y + 3, fmt(yMax * i / 4), 'ivd-y-tick');
    }
    if (!discreteTicks) for (var j = 0; j <= 4; j++) {
      var x = L + (R - L) * j / 4;
      svgText(g, x, B + 19, fmt(lo + (hi - lo) * j / 4), 'ivd-x-tick');
    }
    svgText(g, (L + R) / 2, VH - 3, label, 'ivd-x-label');
  }
  function drawContinuous(svg, spec, state, cutoff, cumulative) {
    svg.textContent = '';
    var g = node('g'); svg.appendChild(g);
    var bounds = spec.range(state), lo = bounds[0], hi = bounds[1];
    var samples = [], max = 0;
    for (var i = 0; i <= 200; i++) {
      var x = lo + (hi - lo) * i / 200;
      var safe = i === 0 ? x + (hi - lo) / 2000 : i === 200 ? x - (hi - lo) / 2000 : x;
      var value = cumulative ? spec.cdf(x, state) : spec.density(safe, state);
      value = isFinite(value) ? Math.max(0, value) : 0;
      samples.push([x, value]);
      max = Math.max(max, value);
    }
    var ymax = cumulative ? 1 : Math.max(.01, max * 1.08);
    var sx = function (x) { return L + (x - lo) / (hi - lo) * (R - L); };
    var sy = function (y) { return B - clamp(y / ymax, 0, 1) * (B - T); };
    base(g, ymax, lo, hi, 'Value x');
    if (!cumulative) {
      var filled = samples.filter(function (pt) { return pt[0] <= cutoff; });
      filled.push([cutoff, spec.density(cutoff, state)]);
      var shade = 'M' + sx(lo) + ',' + B + 'L' + filled.map(function (pt) { return sx(pt[0]) + ',' + sy(pt[1]); }).join('L') + 'L' + sx(cutoff) + ',' + B + 'Z';
      path(g, shade, 'ivd-area');
    }
    path(g, samples.map(function (pt, i) { return (i ? 'L' : 'M') + sx(pt[0]) + ',' + sy(pt[1]); }).join(''), cumulative ? 'ivd-curve ivd-cdf-curve' : 'ivd-curve');
    var ycut = cumulative ? spec.cdf(cutoff, state) : spec.density(cutoff, state);
    svgLine(g, sx(cutoff), B, sx(cutoff), cumulative ? sy(ycut) : T, 'ivd-cut');
    if (cumulative) svgLine(g, L, sy(ycut), sx(cutoff), sy(ycut), 'ivd-guide');
    g.appendChild(node('circle', { cx: sx(cutoff), cy: sy(ycut), r: 4, 'class': cumulative ? 'ivd-dot ivd-cdf-dot' : 'ivd-dot' }));
  }
  function drawDiscrete(svg, spec, state, cutoff, cumulative) {
    svg.textContent = '';
    var g = node('g'); svg.appendChild(g);
    var bounds = spec.range(state), low = bounds[0], high = bounds[1];
    var lo = low - .6, hi = high + .6;
    var sx = function (x) { return L + (x - lo) / (hi - lo) * (R - L); };
    var values = [], max = 0;
    for (var k = low; k <= high; k++) {
      var v = spec.density(k, state);
      values.push(v); max = Math.max(max, v);
    }
    var ymax = cumulative ? 1 : Math.max(.01, max * 1.08);
    var sy = function (y) { return B - clamp(y / ymax, 0, 1) * (B - T); };
    base(g, ymax, lo, hi, 'Value x', true);
    var tickCount = Math.min(5, high - low + 1), seen = {};
    for (var tick = 0; tick < tickCount; tick++) {
      var value = Math.round(low + (high - low) * tick / Math.max(1, tickCount - 1));
      if (seen[value]) continue;
      seen[value] = true;
      var label = spec === D.categorical ? ['A', 'B', 'C'][value] : String(value);
      svgText(g, sx(value), B + 19, label, 'ivd-x-tick' + (spec === D.categorical ? ' ivd-category' : ''));
    }
    if (cumulative) {
      var d = 'M' + sx(lo) + ',' + sy(spec.cdf(lo, state));
      for (var n = low; n <= high; n++) {
        d += 'L' + sx(n) + ',' + sy(spec.cdf(n - 1, state)) + 'L' + sx(n) + ',' + sy(spec.cdf(n, state));
      }
      d += 'L' + sx(hi) + ',' + sy(spec.cdf(high, state));
      path(g, d, 'ivd-curve ivd-cdf-curve');
      svgLine(g, L, sy(spec.cdf(cutoff, state)), sx(cutoff), sy(spec.cdf(cutoff, state)), 'ivd-guide');
      g.appendChild(node('circle', { cx: sx(cutoff), cy: sy(spec.cdf(cutoff, state)), r: 4, 'class': 'ivd-dot ivd-cdf-dot' }));
    } else {
      var barWidth = Math.max(2, (R - L) / (high - low + 1.2) * .68);
      values.forEach(function (v, index) {
        var x = sx(low + index), y = sy(v);
        g.appendChild(node('rect', { x: x - barWidth / 2, y: y, width: barWidth, height: B - y,
          'class': low + index <= cutoff ? 'ivd-bar ivd-bar-selected' : 'ivd-bar' }));
      });
    }
    svgLine(g, sx(cutoff), B, sx(cutoff), cumulative ? sy(spec.cdf(cutoff, state)) : T, 'ivd-cut');
  }
  function median(spec, state) {
    var r = spec.range(state);
    if (spec.type === 'discrete') {
      for (var k = r[0]; k <= r[1]; k++) if (spec.cdf(k, state) >= .5) return k;
      return r[1];
    }
    var a = r[0], b = r[1];
    for (var i = 0; i < 50; i++) {
      var m = (a + b) / 2;
      if (spec.cdf(m, state) < .5) a = m; else b = m;
    }
    return (a + b) / 2;
  }
  function init(host) {
    var allowed = (host.dataset.distributions || '').split(',').filter(function (id) { return !!D[id]; });
    if (!allowed.length) return;
    host.innerHTML = '<section class="ivd-panel" aria-label="Interactive distribution explorer">' +
      '<div class="ivd-head"><div><h3>Explore a probability distribution</h3>' +
      '<p>A PDF shows density for continuous values, while a PMF shows point probabilities for discrete values. A CDF shows the probability at or below a selected value.</p></div>' +
      '<label class="ivd-select">Distribution<select></select></label></div>' +
      '<div class="ivd-charts"><figure><figcaption class="ivd-left-title"></figcaption><svg class="ivd-density" viewBox="0 0 480 246" role="img"></svg></figure>' +
      '<figure><figcaption>CDF · cumulative probability</figcaption><svg class="ivd-cdf" viewBox="0 0 480 246" role="img"></svg></figure></div>' +
      '<div class="ivd-controls"><div class="ivd-params"></div><label class="ivd-cut-label"><span>Selected value <output></output></span><input type="range"></label></div>' +
      '<output class="ivd-result" aria-live="polite"></output><p class="ivd-note"></p>' +
      '<details class="ivd-formulas"><summary>Show the probability formulas</summary><dl>' +
      '<div><dt class="ivd-formula-density-label"></dt><dd><code class="ivd-formula-density"></code></dd></div>' +
      '<div><dt>CDF</dt><dd><code class="ivd-formula-cdf"></code></dd></div></dl>' +
      '<p>Here C(n,k) counts combinations, Γ is the gamma function, B is the beta function, and Φ is the standard normal CDF. The brackets ⌊x⌋ mean round down, and clamp limits a value to the stated interval.</p></details></section>';
    var select = host.querySelector('select');
    var paramsHost = host.querySelector('.ivd-params');
    var cut = host.querySelector('.ivd-cut-label input');
    var cutValue = host.querySelector('.ivd-cut-label output');
    var result = host.querySelector('.ivd-result');
    var note = host.querySelector('.ivd-note');
    var density = host.querySelector('.ivd-density');
    var cdf = host.querySelector('.ivd-cdf');
    var leftTitle = host.querySelector('.ivd-left-title');
    var densityFormulaLabel = host.querySelector('.ivd-formula-density-label');
    var densityFormula = host.querySelector('.ivd-formula-density');
    var cdfFormula = host.querySelector('.ivd-formula-cdf');
    var state = {}, id = '';
    ['discrete', 'continuous'].forEach(function (type) {
      var group = document.createElement('optgroup'); group.label = type === 'discrete' ? 'Discrete' : 'Continuous';
      allowed.forEach(function (name) {
        if (D[name].type !== type) return;
        var option = document.createElement('option'); option.value = name; option.textContent = D[name].name;
        group.appendChild(option);
      });
      if (group.children.length) select.appendChild(group);
    });
    function domain() { return D[id].range(state); }
    function setCutRange(reset) {
      var r = domain(), step = D[id].type === 'discrete' ? 1 : (r[1] - r[0]) / 400;
      var value = reset ? median(D[id], state) : clamp(+cut.value, r[0], r[1]);
      cut.min = r[0]; cut.max = r[1]; cut.step = step; cut.value = value;
    }
    function paint() {
      var spec = D[id], value = +cut.value, discreteValue = spec.type === 'discrete';
      cutValue.textContent = fmt(value);
      leftTitle.textContent = discreteValue ? 'PMF · point probabilities' : 'PDF · probability density';
      drawDiscreteOrContinuous(density, spec, state, value, false);
      drawDiscreteOrContinuous(cdf, spec, state, value, true);
      var probability = spec.cdf(value, state), ordinate = spec.density(value, state);
      result.textContent = 'P(X ≤ ' + fmt(value) + ') = ' + fmt(probability) +
        (discreteValue ? '   ·   P(X = ' + fmt(value) + ') = ' : '   ·   f(' + fmt(value) + ') = ') + fmt(ordinate);
      density.setAttribute('aria-label', spec.name + ' ' + (discreteValue ? 'PMF' : 'PDF') + ' at ' + fmt(value) + '. ' + (discreteValue ? 'Point probability ' : 'Density ') + fmt(ordinate) + '. Values at or below the marker are highlighted.');
      cdf.setAttribute('aria-label', spec.name + ' CDF at ' + fmt(value) + '. Cumulative probability ' + fmt(probability) + '.');
      note.textContent = spec.note || (discreteValue ? 'Move the marker to sum point probabilities.' : 'The shaded PDF area to the left of the marker equals the CDF value.');
    }
    function drawDiscreteOrContinuous(target, spec, values, value, cumulative) {
      if (spec.type === 'discrete') drawDiscrete(target, spec, values, value, cumulative);
      else drawContinuous(target, spec, values, value, cumulative);
    }
    function setup(name) {
      id = name; state = {};
      densityFormulaLabel.textContent = D[id].type === 'discrete' ? 'PMF' : 'PDF';
      densityFormula.textContent = FORMULAS[id][0];
      cdfFormula.textContent = FORMULAS[id][1];
      D[id].params.forEach(function (p) { state[p.key] = p.value; });
      paramsHost.textContent = '';
      D[id].params.forEach(function (p) {
        var label = document.createElement('label');
        var line = document.createElement('span'); line.textContent = p.label;
        var output = document.createElement('output'); output.textContent = fmt(p.value);
        var slider = document.createElement('input'); slider.type = 'range';
        slider.min = p.min; slider.max = p.max; slider.step = p.step; slider.value = p.value;
        slider.setAttribute('aria-label', p.label);
        slider.addEventListener('input', function () {
          state[p.key] = +slider.value; output.textContent = fmt(state[p.key]);
          setCutRange(false); paint();
        });
        label.appendChild(line); label.appendChild(output); label.appendChild(slider);
        paramsHost.appendChild(label);
      });
      setCutRange(true); paint();
    }
    function moveCut(event, target) {
      var rect = target.getBoundingClientRect();
      var px = (event.clientX - rect.left) / rect.width * VW;
      var range = domain(), lo = D[id].type === 'discrete' ? range[0] - .6 : range[0];
      var hi = D[id].type === 'discrete' ? range[1] + .6 : range[1];
      var value = lo + clamp((px - L) / (R - L), 0, 1) * (hi - lo);
      cut.value = D[id].type === 'discrete' ? Math.round(value) : value;
      paint();
    }
    [density, cdf].forEach(function (chart) {
      chart.addEventListener('pointerdown', function (event) {
        chart.setPointerCapture(event.pointerId); moveCut(event, chart);
      });
      chart.addEventListener('pointermove', function (event) {
        if (chart.hasPointerCapture(event.pointerId)) moveCut(event, chart);
      });
    });
    select.addEventListener('change', function () { setup(select.value); });
    cut.addEventListener('input', paint);
    select.value = allowed.indexOf(host.dataset.default) >= 0 ? host.dataset.default : allowed[0];
    setup(select.value);
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-distributions]'), init);
}());
