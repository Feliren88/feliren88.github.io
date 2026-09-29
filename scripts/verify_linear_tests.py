#!/usr/bin/env python3
"""Check the statistics in js/components/explainer-linear-tests.js against SciPy.

The component exports its pure functions when loaded under Node, so this script
feeds both sides the same random samples and compares every number the panel
shows: p-values for t and z, pooled t-tests, Pearson and Spearman correlations,
least-squares slopes and their t statistics, average ranks, and Mann-Whitney U.

  python3 scripts/verify_linear_tests.py      # needs numpy, scipy and node

Exits non-zero on the first disagreement.
"""
import json
import os
import subprocess
import sys

import numpy as np
from scipy import stats

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMPONENT = os.path.join(ROOT, 'js', 'components', 'explainer-linear-tests.js')

rng = np.random.default_rng(0)
cases = []
for n in (5, 8, 15, 40):
    a = rng.standard_normal(n)
    b = rng.standard_normal(n) + 0.7
    b[0] += 3
    x = rng.standard_normal(n)
    y = 0.6 * x + rng.standard_normal(n)
    ties = np.round(rng.standard_normal(2 * n), 1)
    cases.append({'a': a.tolist(), 'b': b.tolist(), 'x': x.tolist(), 'y': y.tolist(), 'ties': ties.tolist()})
grid = [[t, df] for t in (0.1, 1.0, 2.2, 4.0, 9.0) for df in (1, 3, 10, 58)]

JS = """
const LT = require(process.argv[1]);
const input = JSON.parse(require('fs').readFileSync(0, 'utf8'));
const out = { pT: input.grid.map(([t, df]) => LT.pT(t, df)), pZ: [0.1, 1, 1.96, 3.5].map(LT.pZ), cases: [] };
for (const c of input.cases) {
  const G = c.a.map(() => 0).concat(c.b.map(() => 1));
  out.cases.push({
    t: LT.tTest(c.a, c.b), lm: LT.ols(G, c.a.concat(c.b)), one: LT.olsMean(c.b),
    r: LT.pearson(c.x, c.y), slope: LT.ols(c.x, c.y), rho: LT.pearson(LT.rank(c.x), LT.rank(c.y)),
    ranks: LT.rank(c.ties), mw: LT.mannWhitney(c.a, c.b)
  });
}
process.stdout.write(JSON.stringify(out));
"""


def close(name, got, want, tol=1e-9):
    if not np.allclose(got, want, rtol=tol, atol=tol):
        sys.exit(f'MISMATCH {name}: page {got} vs scipy {want}')


def main():
    try:
        proc = subprocess.run(['node', '-e', JS, COMPONENT], input=json.dumps({'cases': cases, 'grid': grid}),
                              capture_output=True, text=True, check=True)
    except FileNotFoundError:
        sys.exit('needs node on PATH')
    js = json.loads(proc.stdout)

    close('t p-values', js['pT'], [2 * stats.t.sf(t, df) for t, df in grid], 1e-10)
    close('normal p-values', js['pZ'], [2 * stats.norm.sf(z) for z in (0.1, 1, 1.96, 3.5)], 2e-7)
    for i, (c, r) in enumerate(zip(cases, js['cases'])):
        a, b, x, y = map(np.array, (c['a'], c['b'], c['x'], c['y']))
        tt = stats.ttest_ind(b, a, equal_var=True)
        close(f'case {i} t-test', [r['t']['t'], r['t']['p']], [tt.statistic, tt.pvalue])
        g = np.r_[np.zeros(len(a)), np.ones(len(b))]
        lr = stats.linregress(g, np.r_[a, b])
        close(f'case {i} lm slope', [r['lm']['b1'], r['lm']['se'], r['lm']['p']], [lr.slope, lr.stderr, lr.pvalue])
        close(f'case {i} lm equals t-test', [r['lm']['t'], r['lm']['p']], [r['t']['t'], r['t']['p']], 1e-12)
        one = stats.ttest_1samp(b, 0)
        close(f'case {i} one-sample', [r['one']['t'], r['one']['p']], [one.statistic, one.pvalue])
        pr = stats.pearsonr(x, y)
        close(f'case {i} pearson', [r['r']['r'], r['r']['p']], [pr.statistic, pr.pvalue])
        close(f'case {i} slope t equals r t', r['slope']['t'], r['r']['t'], 1e-12)
        close(f'case {i} spearman rho', r['rho']['r'], stats.spearmanr(x, y).statistic)
        close(f'case {i} ranks', r['ranks'], stats.rankdata(c['ties']))
        mw = stats.mannwhitneyu(a, b, alternative='two-sided', method='asymptotic', use_continuity=True)
        u1 = mw.statistic
        close(f'case {i} mann-whitney', [r['mw']['u'], r['mw']['p']], [u1, mw.pvalue], 2e-7)
    print(f'OK: {len(grid)} t tail probabilities and {len(cases)} samples agree with SciPy')


if __name__ == '__main__':
    main()
