#!/usr/bin/env python3
"""Check the maths behind the module explainers (js/labs/) against NumPy and SciPy.

Each check loads one explainer's pure functions under Node, feeds it fixed
inputs, and compares the output with a reference written here from the
definitions, never from the JavaScript.

  python3 scripts/verify_labs.py                          # every check
  python3 scripts/verify_labs.py --track linear-algebra   # one track
  python3 scripts/verify_labs.py linear-algebra/eigenvectors

Needs numpy, scipy and node on PATH. Exits non-zero on the first disagreement.
"""
import json
import os
import subprocess
import sys

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LABS = os.path.join(ROOT, 'js', 'labs')
CHECKS = {}


def check(name):
    def wrap(f):
        CHECKS[name] = f
        return f
    return wrap


def run(lab, calls):
    """Call exported functions of js/labs/<lab>.js. `calls` is a list of
    [name, args]; returns the list of results, decoded from JSON."""
    path = os.path.join(LABS, lab + '.js')
    code = ("const L = require(" + json.dumps(path) + ");"
            "const calls = JSON.parse(require('fs').readFileSync(0, 'utf8'));"
            "process.stdout.write(JSON.stringify(calls.map(c => L[c[0]].apply(null, c[1]))));")
    try:
        out = subprocess.run(['node', '-e', code], input=json.dumps(calls),
                             capture_output=True, text=True, check=True)
    except FileNotFoundError:
        sys.exit('needs node on PATH')
    except subprocess.CalledProcessError as e:
        sys.exit(e.stderr)
    return json.loads(out.stdout)


def close(name, got, want, tol=1e-9):
    got, want = np.asarray(got, float), np.asarray(want, float)
    if got.shape != want.shape or not np.allclose(got, want, rtol=tol, atol=tol):
        diff = np.max(np.abs(got - want)) if got.shape == want.shape else f'shape {got.shape} vs {want.shape}'
        sys.exit(f'MISMATCH {name}: max difference {diff}')


def same(name, got, want):
    if got != want:
        sys.exit(f'MISMATCH {name}: {got!r} != {want!r}')


# ── Linear Algebra ─────────────────────────────────────────────────────────
# One check per explainer is added by the tasks that build them.


@check('linear-algebra/vectors-and-spaces')
def check_vectors():
    lab = 'linear-algebra/vectors-and-spaces'
    rng = np.random.default_rng(10)
    V = rng.integers(-40, 41, size=(60, 3, 2)) / 10.0   # v1, v2, p on the 0.1 grid the handles use
    V[:10, 1] = V[:10, 0] * rng.choice([-2.0, -1.0, 0.5, 2.0], size=(10, 1))   # parallel pairs
    V[10:12, :2] = 0.0                                                        # zero vectors
    calls = []
    for v1, v2, p in V.tolist():
        calls += [['combo', [p[0], p[1], v1, v2]], ['rank2', [v1, v2]], ['coords', [p, v1, v2]],
                  ['angle', [p, v1]], ['proj', [p, v1]]]
    out = run(lab, calls)
    for i, (v1, v2, p) in enumerate(V):
        combo, rank, co, ang, pr = out[5 * i:5 * i + 5]
        close(f'combo {i}', combo, p[0] * v1 + p[1] * v2)
        B = np.column_stack([v1, v2])
        same(f'rank {i}', rank, int(np.linalg.matrix_rank(B)))
        if rank == 2:
            close(f'coords {i}', co, np.linalg.solve(B, p))
        else:
            same(f'coords {i}', co, None)
        if np.linalg.norm(p) > 0 and np.linalg.norm(v1) > 0:
            cosine = np.clip(p @ v1 / np.linalg.norm(p) / np.linalg.norm(v1), -1, 1)
            close(f'angle {i}', ang, np.arccos(cosine), 1e-7)
            close(f'proj {i}', pr, (p @ v1) / (v1 @ v1) * v1)
        elif np.linalg.norm(v1) == 0:
            same(f'proj {i}', pr, None)
    A = rng.normal(size=(20, 2, 3))
    A[:5, 1] = 3 * A[:5, 0]
    turns = rng.uniform(-3, 3, size=(20, 2))
    calls = [['rank3', [a.tolist(), b.tolist()]] for a, b in A]
    calls += [['project3', [a.tolist(), float(y), float(t)]] for (a, _), (y, t) in zip(A, turns)]
    out = run(lab, calls)
    for i, (a, b) in enumerate(A):
        same(f'rank3 {i}', out[i], int(np.linalg.matrix_rank(np.vstack([a, b]))))
    for i, ((a, _), (yaw, pitch)) in enumerate(zip(A, turns)):
        Rz = np.array([[np.cos(yaw), np.sin(yaw), 0], [-np.sin(yaw), np.cos(yaw), 0], [0, 0, 1]])
        q = Rz @ a
        close(f'project3 {i}', out[20 + i], [q[0], np.cos(pitch) * q[2] - np.sin(pitch) * q[1]])
    # the numbers the guide quotes
    g = run(lab, [['combo', [1, 1, [2, 1], [-1, 1.5]]], ['coords', [[1, 2.5], [2, 1], [-1, 1.5]]],
                  ['rank2', [[2, 1], [-2, -1]]]])
    close('guide sum', g[0], [1, 2.5])
    close('guide coords', g[1], [1, 1])
    same('guide parallel', g[2], 1)


def main():
    args = sys.argv[1:]
    if args[:1] == ['--track']:
        names = [n for n in CHECKS if n.startswith(args[1] + '/')]
    else:
        names = args or list(CHECKS)
    for n in names:
        CHECKS[n]()
        print('ok', n)
    print(len(names), 'checks passed')


if __name__ == '__main__':
    main()
