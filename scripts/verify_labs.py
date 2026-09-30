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


@check('linear-algebra/matrices-as-transformations')
def check_matrices():
    lab = 'linear-algebra/matrices-as-transformations'
    rng = np.random.default_rng(11)
    Ms, vs = rng.normal(size=(30, 2, 2)), rng.normal(size=(30, 2))
    calls = []
    for M, B, v in zip(Ms, Ms[::-1], vs):
        calls += [['apply', [M.ravel().tolist(), v.tolist()]], ['mul', [B.ravel().tolist(), M.ravel().tolist()]],
                  ['productTerms', [B.ravel().tolist(), M.ravel().tolist()]], ['det', [M.ravel().tolist()]]]
    out = run(lab, calls)
    for i, (M, B, v) in enumerate(zip(Ms, Ms[::-1], vs)):
        close(f'apply {i}', out[4 * i], M @ v)
        close(f'mul {i}', out[4 * i + 1], (B @ M).ravel())
        close(f'terms {i}', np.sum(out[4 * i + 2], axis=1), (B @ M).ravel())
        close(f'det {i}', out[4 * i + 3], np.linalg.det(M))
    deg = [0, 30, 90, 135, -60]
    out = run(lab, [['rotation', [d]] for d in deg] + [['projection', [d]] for d in deg] +
              [['shear', [0.5]], ['scaling', [2, 0.5]]])
    for i, d in enumerate(deg):
        t = np.radians(d)
        close(f'rotation {d}', out[i], [np.cos(t), -np.sin(t), np.sin(t), np.cos(t)])
        u = np.array([np.cos(t), np.sin(t)])
        Pm = np.array(out[len(deg) + i]).reshape(2, 2)
        close(f'projection {d}', Pm, np.outer(u, u))
        close(f'projection twice {d}', Pm @ Pm, Pm)
    close('shear', out[-2], [1, 0.5, 0, 1])
    close('scaling', out[-1], [2, 0, 0, 0.5])
    A, B = [2, -1, 1, 1], [0, -1, 1, 0]
    out = run(lab, [['stageMatrix', [A, B, 'A first', 0]], ['stageMatrix', [A, B, 'A first', 1]],
                    ['stageMatrix', [A, B, 'A first', 2]], ['stageMatrix', [A, B, 'B first', 2]],
                    ['stageMatrix', [A, B, 'A first', 0.5]]])
    Am, Bm = np.array(A, float).reshape(2, 2), np.array(B, float).reshape(2, 2)
    close('stage 0', out[0], [1, 0, 0, 1])
    close('stage 1', out[1], A)
    close('stage 2, A first', out[2], (Bm @ Am).ravel())
    close('stage 2, B first', out[3], (Am @ Bm).ravel())
    close('stage 0.5', out[4], (0.5 * np.eye(2) + 0.5 * Am).ravel())
    # the numbers the guide quotes
    g = run(lab, [['apply', [A, [1, 2]]], ['mul', [B, A]], ['mul', [A, B]]])
    close('guide A v', g[0], [0, 3])
    close('guide BA', g[1], [-1, -1, 2, -1])
    close('guide AB', g[2], [-1, -2, 1, -1])

@check('linear-algebra/determinant-rank-inverse')
def check_determinant():
    lab = 'linear-algebra/determinant-rank-inverse'
    rng = np.random.default_rng(12)
    Ms = rng.integers(-30, 31, size=(80, 2, 2)) / 10.0
    for k in range(20):                       # rank 1: second column a multiple of the first
        Ms[k, :, 1] = Ms[k, :, 0] * rng.choice([-1.5, -0.5, 0.5, 2.0])
    Ms[20] = 0.0                              # rank 0
    ys = rng.integers(-30, 31, size=(80, 2)) / 10.0
    for k in range(10):                       # consistent right-hand sides for some rank 1 systems
        ys[k] = Ms[k, :, 0] * rng.uniform(-2, 2)
    calls = []
    for M, y in zip(Ms, ys):
        m = M.ravel().tolist()
        calls += [['det', [m]], ['rank', [m]], ['inverse', [m]], ['lines', [m]], ['solve', [m, y.tolist()]]]
    out = run(lab, calls)
    for i, (M, y) in enumerate(zip(Ms, ys)):
        d, r, inv, ln, sol = out[5 * i:5 * i + 5]
        close(f'det {i}', d, np.linalg.det(M))
        same(f'rank {i}', r, int(np.linalg.matrix_rank(M)))
        if r == 2:
            close(f'inverse {i}', inv, np.linalg.inv(M).ravel())
            same(f'solve kind {i}', sol['kind'], 'one')
            close(f'solve {i}', sol['x'], np.linalg.solve(M, y))
            continue
        same(f'inverse {i}', inv, None)
        x, res, *_ = np.linalg.lstsq(M, y, rcond=None)
        consistent = np.linalg.norm(M @ x - y) < 1e-9
        if r == 0:
            same(f'solve kind {i}', sol['kind'], 'all' if np.linalg.norm(y) < 1e-12 else 'none')
            continue
        close(f'null {i}', M @ np.array(ln['nul']), [0, 0])
        v = M[:, 0] if np.linalg.norm(M[:, 0]) > 0 else M[:, 1]
        close(f'col {i}', ln['col'][0] * v[1] - ln['col'][1] * v[0], 0)
        same(f'solve kind {i}', sol['kind'], 'line' if consistent else 'none')
        if consistent:
            close(f'solve point {i}', M @ np.array(sol['x']), y)
            close(f'solve direction {i}', M @ np.array(sol['dir']), [0, 0])
    # the numbers the guide quotes
    g = run(lab, [['det', [[2, 1, 0.5, 1.5]]], ['det', [[2, 1, 0.5, -1]]], ['det', [[2, 1, 0.5, 0.25]]], ['rank', [[2, 1, 0.5, 0.25]]]])
    close('guide det', g[0], 2.5)
    close('guide flipped', g[1], -2.5)
    close('guide squashed', g[2], 0)
    same('guide rank', g[3], 1)

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
