#!/usr/bin/env python3
"""Check the maths behind the interview explainers against independent NumPy code.

Each check loads a component's pure functions under Node, feeds it fixed
inputs, and compares its output with a reference written here from the source
paper or library semantics, never from the JavaScript.

  python3 scripts/verify_explainers.py           # every check
  python3 scripts/verify_explainers.py tinyvgg   # one check by name

Needs numpy and node on PATH. Exits non-zero on the first disagreement.
"""
import base64
import json
import os
import subprocess
import sys

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = os.path.join(ROOT, 'js', 'components')
DATA = os.path.join(ROOT, 'assets', 'data')


def node(code, payload=None):
    try:
        out = subprocess.run(['node', '-e', code], input=json.dumps(payload or {}),
                             capture_output=True, text=True, check=True)
    except FileNotFoundError:
        sys.exit('needs node on PATH')
    except subprocess.CalledProcessError as e:
        sys.exit(e.stderr)
    return json.loads(out.stdout)


def close(name, got, want, tol):
    got, want = np.asarray(got, float), np.asarray(want, float)
    if got.shape != want.shape or not np.allclose(got, want, rtol=tol, atol=tol):
        diff = np.max(np.abs(got - want)) if got.shape == want.shape else 'shape ' + str(got.shape) + ' vs ' + str(want.shape)
        sys.exit(f'MISMATCH {name}: max difference {diff}')


# ── Tiny VGG ───────────────────────────────────────────────────────────────

def check_tinyvgg():
    """Keras semantics: valid 3x3 cross-correlation, ReLU, 2x2 max pool,
    flatten in HWC order, dense, softmax."""
    man = json.load(open(os.path.join(DATA, 'tiny-vgg.json')))
    flat = np.fromfile(os.path.join(DATA, 'tiny-vgg.bin'), dtype='<f4')
    W = {t['name']: flat[t['offset']:t['offset'] + t['size']].reshape(t['shape']) for t in man['weights']}

    def conv(x, k, b):
        h, w = x.shape[0] - 2, x.shape[1] - 2
        out = np.zeros((h, w, k.shape[3]), np.float64)
        for di in range(3):
            for dj in range(3):
                out += np.tensordot(x[di:di + h, dj:dj + w, :], k[di, dj], axes=([2], [0]))
        return out + b

    def pool(x):
        h, w = x.shape[0] // 2, x.shape[1] // 2
        return x[:2 * h, :2 * w].reshape(h, 2, w, 2, -1).max(axis=(1, 3))

    code = """
    const TV = require(%r);
    const fs = require('fs');
    const man = JSON.parse(fs.readFileSync(%r, 'utf8'));
    const buf = fs.readFileSync(%r);
    const model = TV.load(man, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
    const out = man.samples.map(s => {
      const L = TV.run(model, TV.decode(s.rgb));
      return { conv_1_1: Array.from(L.conv_1_1.d.slice(0, 2000)), max_pool_2: Array.from(L.max_pool_2.d), logits: Array.from(L.logits), probs: L.probs };
    });
    process.stdout.write(JSON.stringify(out));
    """ % (os.path.join(JS, 'explainer-tinyvgg.js'), os.path.join(DATA, 'tiny-vgg.json'), os.path.join(DATA, 'tiny-vgg.bin'))
    js = node(code)
    right = 0
    for s, r in zip(man['samples'], js):
        x = np.frombuffer(base64.b64decode(s['rgb']), np.uint8).reshape(64, 64, 3) / 255.0
        c11 = conv(x, W['conv_1_1/kernel'], W['conv_1_1/bias'])
        a = np.maximum(c11, 0)
        a = np.maximum(conv(a, W['conv_1_2/kernel'], W['conv_1_2/bias']), 0)
        a = pool(a)
        a = np.maximum(conv(a, W['conv_2_1/kernel'], W['conv_2_1/bias']), 0)
        a = np.maximum(conv(a, W['conv_2_2/kernel'], W['conv_2_2/bias']), 0)
        p2 = pool(a)
        logits = p2.reshape(-1) @ W['output/kernel'] + W['output/bias']
        probs = np.exp(logits - logits.max()); probs /= probs.sum()
        close(f"{s['name']} conv_1_1", r['conv_1_1'], c11.reshape(-1)[:2000], 1e-4)
        close(f"{s['name']} max_pool_2", r['max_pool_2'], p2.reshape(-1), 1e-4)
        close(f"{s['name']} logits", r['logits'], logits, 1e-3)
        close(f"{s['name']} probs", r['probs'], probs, 1e-5)
        right += man['classes'][int(np.argmax(probs))].split()[0] in s['name'].replace('boat', 'lifeboat').replace('bug', 'ladybug').replace('pepper', 'bell pepper').replace('bus', 'school bus').replace('panda', 'red panda').replace('car', 'sport car')
    print(f'tinyvgg: every layer matches NumPy on {len(js)} images; {right} of {len(js)} predicted as their file label')


# ── GAN ────────────────────────────────────────────────────────────────────

def check_gan():
    """Backpropagation against central finite differences computed in NumPy
    from the same weights, then a short training run on the ring data."""
    code = """
    const GAN = require(%r), XP = require(%r);
    const r = XP.rng(5), net = GAN.mlp([2, 16, 16, 1], r), x = [0.3, -0.7];
    const acts = GAN.forward(net, x), grads = GAN.zeros(net);
    const gx = GAN.backward(net, acts, [1], grads);
    // training on a ring: radius of fakes before and after
    const rr = XP.rng(11), G = GAN.mlp([2, 16, 16, 2], rr), D = GAN.mlp([2, 16, 16, 1], rr), sG = {}, sD = {};
    const ring = () => { const a = rr() * 2 * Math.PI, d = 0.62 + XP.gauss(rr) * 0.04; return [d * Math.cos(a), d * Math.sin(a)]; };
    const real = Array.from({length: 400}, ring);
    const stat = () => { let s = 0; const oct = new Array(8).fill(0); for (let i = 0; i < 400; i++) { const o = GAN.forward(G, [rr() * 2 - 1, rr() * 2 - 1]); const p = o[o.length - 1]; s += Math.abs(Math.hypot(p[0], p[1]) - 0.62); oct[Math.floor((Math.atan2(p[1], p[0]) + Math.PI) / (2 * Math.PI) * 8) %% 8]++; } return [s / 400, Math.min(...oct) / 400]; };
    const radius = () => stat()[0];
    const before = radius();
    for (let s = 0; s < 4000; s++) {
      const z = Array.from({length: 64}, () => [rr() * 2 - 1, rr() * 2 - 1]);
      const b = Array.from({length: 64}, () => real[Math.floor(rr() * real.length)]);
      GAN.trainStep(G, D, sG, sD, b, z, 0.005, 0.002);
    }
    process.stdout.write(JSON.stringify({ net: net.map(l => ({W: l.W, b: l.b})), x, out: acts[acts.length - 1][0], gx, gW0: grads[0].W, gb2: grads[2].b, before, after: radius(), cover: stat()[1] }));
    """ % (os.path.join(JS, 'explainer-gan.js'), os.path.join(JS, 'explainer-core.js'))
    js = node(code)
    Ws = [np.array(l['W'], float) for l in js['net']]; bs = [np.array(l['b'], float) for l in js['net']]

    def f(x, Ws, bs):
        h = np.array(x, float)
        for i, (W, b) in enumerate(zip(Ws, bs)):
            h = W @ h + b
            if i < len(Ws) - 1:
                h = np.tanh(h)
        return h[0]

    x = np.array(js['x']); eps = 1e-6
    close('gan forward', js['out'], f(x, Ws, bs), 1e-10)
    fd_x = [(f(x + eps * e, Ws, bs) - f(x - eps * e, Ws, bs)) / (2 * eps) for e in np.eye(2)]
    close('gan input gradient', js['gx'], fd_x, 1e-6)
    fd_W = np.zeros_like(Ws[0])
    for a in range(Ws[0].shape[0]):
        for b in range(Ws[0].shape[1]):
            P = [W.copy() for W in Ws]; P[0][a, b] += eps; up = f(x, P, bs)
            P[0][a, b] -= 2 * eps; fd_W[a, b] = (up - f(x, P, bs)) / (2 * eps)
    close('gan first-layer weight gradient', js['gW0'], fd_W, 1e-6)
    fd_b = []
    for a in range(len(bs[2])):
        P = [b.copy() for b in bs]; P[2][a] += eps; up = f(x, Ws, P); P[2][a] -= 2 * eps
        fd_b.append((up - f(x, Ws, P)) / (2 * eps))
    close('gan output bias gradient', js['gb2'], fd_b, 1e-6)
    if not (js['after'] < 0.1 and js['cover'] > 0.03):
        sys.exit(f"MISMATCH gan training with the page defaults: distance {js['before']:.3f} -> {js['after']:.3f}, emptiest eighth of the ring {js['cover']:.3f}")
    print(f"gan: gradients match finite differences; with the page's defaults the fakes' distance from the ring fell from {js['before']:.3f} to {js['after']:.3f}, and every eighth of the ring holds at least {js['cover']:.0%} of them")


CHECKS = {'tinyvgg': check_tinyvgg, 'gan': check_gan}

if __name__ == '__main__':
    names = sys.argv[1:] or list(CHECKS)
    for n in names:
        CHECKS[n]()
    print('OK')
