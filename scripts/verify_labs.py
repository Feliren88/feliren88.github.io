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

@check('linear-algebra/eigenvectors')
def check_eigen():
    lab = 'linear-algebra/eigenvectors'
    rng = np.random.default_rng(13)
    Ms = list(rng.normal(size=(60, 2, 2)))
    S = rng.normal(size=(10, 2, 2))
    Ms += [a + a.T for a in S]                                   # symmetric
    Ms += [np.array([[2.0, 1.0], [1.0, 2.0]]), np.array([[0.0, -1.0], [1.0, 0.0]]),
           np.array([[1.0, 1.0], [0.0, 1.0]]), 1.5 * np.eye(2)]
    out = run(lab, [['eig', [M.ravel().tolist()]] for M in Ms])
    for i, (M, e) in enumerate(zip(Ms, out)):
        w = np.linalg.eigvals(M)
        if abs(w[0].imag) > 1e-9:
            same(f'complex {i}', e['real'], False)
            close(f're {i}', e['re'], w[0].real)
            close(f'im {i}', e['im'], abs(w[0].imag))
            continue
        same(f'real {i}', e['real'], True)
        close(f'values {i}', e['values'], sorted(w.real, reverse=True), 1e-7)
        for k, v in enumerate(e['vectors']):
            v = np.array(v)
            lam = e['values'][k] if len(e['vectors']) == 2 else e['values'][0]
            close(f'unit {i}.{k}', np.linalg.norm(v), 1)
            close(f'A v = l v {i}.{k}', M @ v, lam * v, 1e-7)
        if np.allclose(M, M.T) and len(e['vectors']) == 2 and abs(e['values'][0] - e['values'][1]) > 1e-6:
            close(f'perpendicular {i}', np.dot(*e['vectors']), 0, 1e-7)
    lams = rng.normal(size=len(Ms)) * 3
    vs = rng.normal(size=(len(Ms), 2))
    calls = []
    for M, l, v in zip(Ms, lams, vs):
        m = M.ravel().tolist()
        calls += [['charPoly', [m, float(l)]], ['power', [m, v.tolist(), 5]], ['spectralRadius', [m]], ['knock', [m, v.tolist()]]]
    out = run(lab, calls)
    for i, (M, l, v) in enumerate(zip(Ms, lams, vs)):
        cp, pw, rho, kn = out[4 * i:4 * i + 4]
        close(f'charPoly {i}', cp, np.linalg.det(M - l * np.eye(2)), 1e-8)
        close(f'power {i}', pw, np.linalg.matrix_power(M, 5) @ v, 1e-8)
        close(f'spectral radius {i}', rho, np.max(np.abs(np.linalg.eigvals(M))), 1e-8)
        w = M @ v
        close(f'knock {i}', kn, np.arccos(min(1, abs(v @ w) / np.linalg.norm(v) / np.linalg.norm(w))), 1e-6)
    # Display iterations retain contraction and bound growing arrows.
    steps = run(lab, [['iterateStep', [[0.5, 0, 0, 0.25], [1, 1]]],
                      ['iterateStep', [[3, 0, 0, 2], [1, 0]]],
                      ['iterateStep', [[0, 0, 0, 0], [1, 1]]]])
    close('shrinking display step', steps[0], [0.5, 0.25])
    close('growing display step', steps[1], [1, 0])
    close('zero display step', steps[2], [0, 0])
    # the numbers the guide quotes
    g = run(lab, [['eig', [[2, 1, 0.5, 1.5]]], ['eig', [[2, 1, 1, 2]]], ['eig', [[0, -1, 1, 0]]]])
    close('guide values', g[0]['values'], [2.5, 1])
    close('guide first vector', abs(np.dot(g[0]['vectors'][0], [2 / 5 ** 0.5, 1 / 5 ** 0.5])), 1)
    close('guide second vector', abs(np.dot(g[0]['vectors'][1], [1 / 2 ** 0.5, -1 / 2 ** 0.5])), 1)
    close('guide symmetric', g[1]['values'], [3, 1])
    same('guide quarter turn', g[2]['real'], False)

@check('linear-algebra/decompositions')
def check_decompositions():
    import base64
    lab = 'linear-algebra/decompositions'
    rng = np.random.default_rng(14)
    Ms = list(rng.normal(size=(40, 2, 2))) + [np.array([[1.5, 1.0], [0.0, 1.2]]), np.array([[1.0, 2.0], [0.5, 1.0]]), np.zeros((2, 2))]
    # stageMatrix takes the decomposition, so it is called in a second pass
    decs = run(lab, [['svd2', [M.ravel().tolist()]] for M in Ms])
    for i, (M, d) in enumerate(zip(Ms, decs)):
        close(f'singular values {i}', d['S'], np.linalg.svd(M, compute_uv=False), 1e-9)
        U, Vt = np.array(d['U']).reshape(2, 2), np.array(d['Vt']).reshape(2, 2)
        close(f'U S Vt {i}', U @ np.diag(d['S']) @ Vt, M, 1e-9)
        close(f'U orthogonal {i}', U.T @ U, np.eye(2), 1e-9)
        close(f'V orthogonal {i}', Vt @ Vt.T, np.eye(2), 1e-9)
    stages = run(lab, [['stageMatrix', [d, f]] for d in decs for f in (0, 1, 2, 3)])
    for i, M in enumerate(Ms):
        close(f'stage 0 {i}', stages[4 * i], np.eye(2).ravel())
        close(f'stage 3 {i}', stages[4 * i + 3], M.ravel(), 1e-9)
        close(f'stage 2 is Sigma Vt {i}', stages[4 * i + 2], (np.diag(decs[i]['S']) @ np.array(decs[i]['Vt']).reshape(2, 2)).ravel(), 1e-9)
        close(f'stage 1 is a rotation {i}', np.linalg.det(np.array(stages[4 * i + 1]).reshape(2, 2)), 1, 1e-9)
    # Jacobi SVD against LAPACK, and Eckart-Young on a real sample image
    A = rng.normal(size=(20, 15))
    man = json.load(open(os.path.join(ROOT, 'assets', 'data', 'tiny-vgg.json')))
    raw = np.frombuffer(base64.b64decode(man['samples'][0]['rgb']), dtype=np.uint8)
    same('sample size', raw.size, 64 * 64 * 3)
    img = raw.reshape(64, 64, 3).astype(float) @ np.array([0.299, 0.587, 0.114]) / 255
    out = run(lab, [['svd', [A.tolist()]], ['decodeGray', [man['samples'][0]['rgb'], 64, 64]], ['svd', [img.tolist()]]])
    close('jacobi values', out[0]['S'], np.linalg.svd(A, compute_uv=False), 1e-9)
    Uj, Vj = np.array(out[0]['U']), np.array(out[0]['V'])
    close('jacobi rebuild', Uj @ np.diag(out[0]['S']) @ Vj.T, A, 1e-9)
    close('gray image', out[1], img, 1e-12)
    S_img = np.linalg.svd(img, compute_uv=False)
    close('image values', out[2]['S'], S_img, 1e-8)
    for kk in (1, 4, 8, 20):
        rec, tail = run(lab, [['lowRank', [out[2], kk]], ['tailError', [out[2]['S'], kk]]])
        err = np.linalg.norm(img - np.array(rec))
        close(f'Eckart-Young k={kk}', err, np.sqrt(np.sum(S_img[kk:] ** 2)), 1e-8)
        close(f'tail k={kk}', tail, err, 1e-8)
    fixed = run(lab, [['pca', [[[4.5, 3.375]] * 10]]])[0]
    same('coincident mean', fixed['mean'], [4.5, 3.375])
    same('coincident variance', fixed['vars'], [0, 0])
    # PCA and Cholesky
    pts = rng.normal(size=(10, 2)) @ np.array([[1.8, 0.9], [0.3, 0.5]])
    p, c, c_bad = run(lab, [['pca', [pts.tolist()]], ['chol2', [[2, 0.6, 0.6, 1]]], ['chol2', [[1, 2, 2, 1]]]])
    X = pts - pts.mean(0)
    w, V = np.linalg.eigh(X.T @ X / len(pts))
    close('pca mean', p['mean'], pts.mean(0))
    close('pca variances', p['vars'], w[::-1], 1e-9)
    close('pca first axis', abs(np.dot(p['axes'][0], V[:, 1])), 1, 1e-9)
    L = np.array(c).reshape(2, 2)
    close('cholesky', L @ L.T, [[2, 0.6], [0.6, 1]])
    close('cholesky matches numpy', L, np.linalg.cholesky([[2, 0.6], [0.6, 1]]))
    same('not positive definite', c_bad, None)

@check('linear-algebra/least-squares')
def check_least_squares():
    lab = 'linear-algebra/least-squares'
    collapsed = run(lab, [['fitLine', [[[4, 3], [4, 5], [4, 7]]]]])[0]
    close('constant-x fit', [collapsed['w'], collapsed['b']], [0, 5])
    same('constant-x non-unique fit', collapsed['unique'], False)
    rng = np.random.default_rng(15)
    Xs = [rng.normal(size=(n, p)) for n, p in [(9, 2), (30, 2), (6, 3), (3, 2)]]
    ys = [rng.normal(size=X.shape[0]) for X in Xs]
    lams = [0, 0.1, 3.0]
    out = run(lab, [['lstsq', [X.tolist(), y.tolist(), l]] for X, y in zip(Xs, ys) for l in lams] +
              [['gram', [X.tolist()]] for X in Xs])
    k = 0
    for i, (X, y) in enumerate(zip(Xs, ys)):
        for l in lams:
            want = np.linalg.solve(X.T @ X + l * np.eye(X.shape[1]), X.T @ y)
            close(f'lstsq {i} lambda {l}', out[k], want, 1e-9)
            if l == 0:
                close(f'lstsq {i} against lstsq', out[k], np.linalg.lstsq(X, y, rcond=None)[0], 1e-9)
            k += 1
    for i, X in enumerate(Xs):
        close(f'gram {i}', out[k + i], X.T @ X)
    pts = [[1, 2.1], [2, 3.4], [3, 3.2], [4, 5.1], [5, 5.6], [6, 7.2], [7, 7.1], [8, 9.4], [9, 9.1]]
    P = np.array(pts)
    fit, m1, m2 = run(lab, [['fitLine', [pts]], ['mse', [pts, 0.4, 4]], ['mse', [pts, 1.1, 0.5]]])
    slope, icept = np.polyfit(P[:, 0], P[:, 1], 1)
    close('fitLine', [fit['w'], fit['b']], [slope, icept], 1e-9)
    close('mse', m1, np.mean((P[:, 1] - (0.4 * P[:, 0] + 4)) ** 2))
    close('mse 2', m2, np.mean((P[:, 1] - (1.1 * P[:, 0] + 0.5)) ** 2))
    a, b, y = [1.6, 0.2, 0.4], [0.3, 1.5, 0.5], [1.2, 1.4, 2.4]
    pr, par = run(lab, [['project', [a, b, y]], ['project', [a, [3.2, 0.4, 0.8], y]]])
    X = np.column_stack([a, b])
    close('project w', pr['w'], np.linalg.lstsq(X, y, rcond=None)[0], 1e-9)
    close('project yhat', pr['yhat'], X @ np.array(pr['w']), 1e-9)
    close('residual is perpendicular', X.T @ np.array(pr['r']), [0, 0], 1e-9)
    same('parallel columns', par, None)
    yaw, pitch = 0.7, 0.45
    cam, v = run(lab, [['camera', [yaw, pitch]], ['view3', [[0.3, -1.2, 2.0], yaw, pitch]]])
    R, U = np.array(cam['right']), np.array(cam['up'])
    close('camera orthonormal', [R @ R, U @ U, R @ U], [1, 1, 0])
    close('camera matches view', v, [R @ [0.3, -1.2, 2.0], U @ [0.3, -1.2, 2.0]])
    path = run(lab, [['ridgePath', [Xs[1].tolist(), ys[1].tolist(), [0.01, 1, 100]]]])[0]
    norms = [np.linalg.norm(w) for w in path]
    same('ridge path shrinks', norms == sorted(norms, reverse=True), True)


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
