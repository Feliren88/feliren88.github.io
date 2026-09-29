const assert = require('node:assert/strict');
const { distributions: D, formulas, betaI, gammaP, normalCdf } = require('../js/components/interview-distributions.js');

function near(actual, expected, tolerance = 1e-5) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} differs from ${expected}`);
}

near(normalCdf(0), 0.5, 1e-7);
near(betaI(0.5, 2, 1), 0.25);
near(gammaP(1, 1), 1 - Math.exp(-1));
near(D['student-t'].cdf(1, { nu: 1, scale: 1 }), 0.75);
near(D.binomial.density(5, { n: 10, p: 0.5 }), 252 / 1024);
near(D.poisson.cdf(0, { lambda: 2 }), Math.exp(-2));
near(D.gamma.density(0, { shape: 1, scale: 2 }), 0.5);
assert.equal(D.gamma.density(0, { shape: 0.6, scale: 1 }), Infinity);
assert.equal(D['chi-square'].density(0, { nu: 1 }), Infinity);
near(D['chi-square'].density(0, { nu: 2 }), 0.5);
assert.equal(D.beta.density(0, { a: 0.6, b: 2 }), Infinity);
near(D.beta.density(0, { a: 1, b: 2 }), 2);
assert.equal(D.beta.density(1, { a: 2, b: 0.6 }), Infinity);
near(D.beta.density(1, { a: 2, b: 1 }), 2);
assert.equal(D.weibull.density(0, { shape: 0.6, scale: 2 }), Infinity);
near(D.weibull.density(0, { shape: 1, scale: 2 }), 0.5);
assert.equal(D.f.density(0, { d1: 1, d2: 12 }), Infinity);
near(D.f.density(0, { d1: 2, d2: 12 }), 1);
assert.deepEqual(Object.keys(formulas).sort(), Object.keys(D).sort());
for (const [name, pair] of Object.entries(formulas)) {
  for (const kind of ['density', 'cdf']) {
    assert.ok(pair[kind].startsWith('<math ') && pair[kind].includes('</math>'),
      `${name} ${kind} is not rendered MathML`);
  }
}
assert.ok(D['negative-binomial'].cdf(D['negative-binomial'].range({ r: 10, p: 0.15 })[1],
  { r: 10, p: 0.15 }) > 0.999);

for (const [name, spec] of Object.entries(D)) {
  const defaults = Object.fromEntries(spec.params.map(p => [p.key, p.value]));
  const states = [defaults];
  for (const parameter of spec.params) {
    states.push({ ...defaults, [parameter.key]: parameter.min });
    states.push({ ...defaults, [parameter.key]: parameter.max });
  }
  for (const state of states) {
    const [lo, hi] = spec.range(state);
    let previous = -1;
    for (let i = 0; i <= 80; i++) {
      const x = lo + (hi - lo) * i / 80;
      const cdf = spec.cdf(x, state);
      assert.ok(Number.isFinite(cdf) && cdf >= -1e-9 && cdf <= 1 + 1e-9, `${name} invalid CDF at ${x}`);
      assert.ok(cdf >= previous - 1e-9, `${name} CDF decreases at ${x}`);
      previous = cdf;
    }
    if (spec.type === 'discrete') {
      let total = 0;
      for (let k = lo; k <= hi; k++) {
        const mass = spec.density(k, state);
        assert.ok(Number.isFinite(mass) && mass >= 0, `${name} invalid PMF at ${k}`);
        near(spec.cdf(k, state) - spec.cdf(k - 1, state), mass, 1e-7);
        total += mass;
      }
      assert.ok(total > 0.99 && total <= 1.000001, `${name} PMF total is ${total}`);
    } else {
      for (let i = 1; i < 20; i++) {
        const x = lo + (hi - lo) * i / 20;
        const h = (hi - lo) / 100000;
        const slope = (spec.cdf(x + h, state) - spec.cdf(x - h, state)) / (2 * h);
        const density = spec.density(x, state);
        assert.ok(Number.isFinite(density) && density >= 0, `${name} invalid PDF at ${x}`);
        assert.ok(Math.abs(slope - density) < Math.max(2e-4, density * 1e-3),
          `${name} CDF slope ${slope} differs from PDF ${density} at ${x}`);
      }
    }
  }
}

console.log(`Checked ${Object.keys(D).length} distribution PDFs or PMFs against their CDFs.`);
