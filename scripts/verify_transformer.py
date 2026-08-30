#!/usr/bin/env python3
"""
Verify the arithmetic behind the /transformers/ architecture explorers.

js/components/transformer.js draws real tensors. Every matrix a reader sees on
that page is computed in the browser from the weights in that file, using the
operations of "Attention Is All You Need" (Vaswani et al., NeurIPS 2017) in the
order the paper runs them. That is the whole claim the page makes about itself,
and a claim like that needs a second opinion.

So this script is an independent NumPy implementation of the same toy model,
written from the paper rather than from the JavaScript. It then loads the
component under Node, pulls out what the component computed, and compares the
two element by element. A disagreement means one of the two is wrong, and the
page should not ship until it is known which.

    toy    d_model 8    h 2   d_k 4    d_ff 32
    paper  d_model 512  h 8   d_k 64   d_ff 2048

The weights are chosen rather than trained, and the page says so. Random
weights give an attention map that is flat to three decimals, which teaches
nothing. These are picked so head 1 resolves `it` to `cat` and head 2 finds the
verb, and scaled so the softmax does not saturate.

Two things about them are load-bearing and easy to break:

  * The projections carry a 1/sqrt(d_model) factor that undoes the paper's
    embedding scaling. Without it every softmax row collapses to one-hot at
    this size, and the figure stops showing a distribution at all.
  * The feed-forward weights are generated, not chosen, and the generator here
    mirrors the LCG and Box-Muller pair in the JavaScript exactly, including
    the order the four blocks are drawn in. Change one side and the FFN
    comparison fails for a reason that has nothing to do with the maths.

Usage:
    pip install numpy
    python3 scripts/verify_transformer.py           # compare, report, exit 0/1
    python3 scripts/verify_transformer.py --dump    # print the reference

Needs `node` on PATH. Exits non-zero on any disagreement, so it is safe to
wire into CI.
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile

try:
    import numpy as np
except ImportError:
    sys.exit("needs numpy: pip install numpy")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMPONENT = os.path.join(ROOT, "js", "components", "transformer.js")

TOKENS = ["the", "cat", "sat", "on", "it"]
D, DK, DFF = 8, 4, 32
T = len(TOKENS)
SCALE = np.sqrt(D)          # section 3.4 multiplies embeddings by sqrt(d_model)
WSCALE = 1.0 / np.sqrt(D)   # keeps the chosen projections off the softmax ceiling

# Feature axes of the eight-dimensional embedding. A trained model has no such
# labels; these exist so a number on the page can be read.
#   0 animate  1 thing  2 action  3 function
#   4 subject  5 place  6 refers  7 const
E = np.array([
    [0.00, 0.00, 0.00, 0.90, 0.00, 0.00, 0.00, 0.20],  # the
    [0.90, 0.30, 0.00, 0.00, 0.70, 0.00, 0.00, 0.20],  # cat
    [0.00, 0.00, 0.90, 0.00, 0.00, 0.30, 0.00, 0.20],  # sat
    [0.00, 0.00, 0.00, 0.80, 0.00, 0.60, 0.00, 0.20],  # on
    [0.20, 0.20, 0.00, 0.30, 0.30, 0.00, 0.90, 0.20],  # it
])


def zeros(*shape):
    return np.zeros(shape)


# head 1 asks "what does this word refer to"
WQ1 = zeros(D, DK); WQ1[6, 0] = 2.4; WQ1[4, 1] = 0.6
WK1 = zeros(D, DK); WK1[0, 0] = 2.0; WK1[4, 0] = 1.2; WK1[1, 1] = 0.8
WV1 = zeros(D, DK); WV1[0, 0] = 1.0; WV1[1, 1] = 1.0; WV1[4, 2] = 1.0; WV1[2, 3] = 1.0
# head 2 asks "where is the action"
WQ2 = zeros(D, DK); WQ2[5, 0] = 2.2; WQ2[3, 1] = 1.0
WK2 = zeros(D, DK); WK2[2, 0] = 2.4; WK2[5, 0] = 1.4; WK2[3, 1] = 1.2
WV2 = zeros(D, DK); WV2[2, 0] = 1.0; WV2[5, 1] = 1.0; WV2[3, 2] = 1.0; WV2[7, 3] = 1.0

for _w in (WQ1, WK1, WQ2, WK2):
    _w *= WSCALE

WO = np.eye(D); WO[0, 4] = 0.3; WO[5, 2] = 0.3


def lcg(seed):
    """The generator in transformer.js, reproduced so both sides agree."""
    st = seed & 0xFFFFFFFF

    def nxt():
        nonlocal st
        st = (st * 1664525 + 1013904223) & 0xFFFFFFFF
        return st / 4294967296

    return nxt


def gaussians(n, sd, rand):
    out = []
    for _ in range(n):
        u = max(1e-9, rand())
        v = rand()
        out.append(round(np.sqrt(-2 * np.log(u)) * np.cos(2 * np.pi * v) * sd, 2))
    return np.array(out)


_r = lcg(11)
B1 = gaussians(DFF, 0.1, _r)
B2 = gaussians(D, 0.1, _r)
W1 = gaussians(D * DFF, 0.5, _r).reshape(D, DFF)
W2 = gaussians(DFF * D, 0.25, _r).reshape(DFF, D)


# ════════════════════════════════════════════════════════════════════
# The paper's operations, section 3
# ════════════════════════════════════════════════════════════════════

def sinusoid(t, d):
    """Section 3.5.
    PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
    PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))"""
    pe = np.zeros((t, d))
    pos = np.arange(t)[:, None]
    i = np.arange(0, d, 2)[None, :]
    pe[:, 0::2] = np.sin(pos / np.power(10000.0, i / d))
    pe[:, 1::2] = np.cos(pos / np.power(10000.0, i / d))
    return pe


def softmax(z, axis=-1):
    e = np.exp(z - z.max(axis=axis, keepdims=True))
    return e / e.sum(axis=axis, keepdims=True)


def layernorm(x, eps=1e-5):
    mu = x.mean(-1, keepdims=True)
    sd = np.sqrt(x.var(-1, keepdims=True) + eps)
    return (x - mu) / sd


def head(xq, xkv, wq, wk, wv, mask=False):
    """Section 3.2.1, Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) V.

    Queries and the key-value pair come from separate sources, which is the
    only difference between the three ways section 3.2.3 uses attention."""
    q, k, v = xq @ wq, xkv @ wk, xkv @ wv
    scaled = (q @ k.T) / np.sqrt(DK)
    if mask:
        cut = np.triu(np.ones((len(xq), len(xkv)), bool), 1)
        scaled = np.where(cut, -np.inf, scaled)
    a = softmax(scaled)
    return dict(attn=a, out=a @ v)


def mha(xq, xkv=None, mask=False):
    """Section 3.2.2, MultiHead(Q,K,V) = Concat(head_1..head_h) W^O."""
    if xkv is None:
        xkv = xq
    hs = [head(xq, xkv, WQ1, WK1, WV1, mask),
          head(xq, xkv, WQ2, WK2, WV2, mask)]
    cat = np.concatenate([h["out"] for h in hs], axis=1)
    return hs, cat @ WO


def ffn(x):
    """Section 3.3, FFN(x) = max(0, x W_1 + b_1) W_2 + b_2."""
    hid = x @ W1 + B1
    return dict(hid=hid, out=np.maximum(0, hid) @ W2 + B2)


def reference():
    pe = sinusoid(T, D)
    x0 = E * SCALE + pe

    # Post-norm, which is what the paper does: "the output of each sub-layer
    # is LayerNorm(x + Sublayer(x))". Pre-norm came later and is a variant.
    enc_h, enc_a = mha(x0)
    res1 = layernorm(x0 + enc_a)
    enc_ff = ffn(res1)
    res2 = layernorm(res1 + enc_ff["out"])

    pre_h, pre_a = mha(layernorm(x0))
    pre1 = x0 + pre_a
    pre2 = pre1 + ffn(layernorm(pre1))["out"]

    msk_h, msk_a = mha(x0, None, True)
    d_self = layernorm(x0 + msk_a)
    cross_h, cross_a = mha(d_self, res2)
    d_res2 = layernorm(d_self + cross_a)
    d_res3 = layernorm(d_res2 + ffn(d_res2)["out"])

    # Full precision on both sides. JSON round-trips a double exactly, so the
    # only difference left is the order in which the two implementations
    # accumulate a dot product, which is what the tolerance allows for and all
    # it allows for.
    return {
        "PE": pe.tolist(),
        "X": x0.tolist(),
        "attn0": enc_h[0]["attn"].tolist(),
        "attn1": enc_h[1]["attn"].tolist(),
        "mout": enc_a.tolist(),
        "ffn_hid": enc_ff["hid"].tolist(),
        "block": res2.tolist(),
        "block_pre": pre2.tolist(),
        "masked0": msk_h[0]["attn"].tolist(),
        "masked1": msk_h[1]["attn"].tolist(),
        "dec_self": d_self.tolist(),
        "cross0": cross_h[0]["attn"].tolist(),
        "cross1": cross_h[1]["attn"].tolist(),
        "dec_res2": d_res2.tolist(),
        "dec_res3": d_res3.tolist(),
    }


# ════════════════════════════════════════════════════════════════════
# What the component computed
#
# The component is a browser IIFE with no exports, so the DOM it touches at
# load time is stubbed and one capture line is injected before the mount
# section. Nothing else about the file is altered.
# ════════════════════════════════════════════════════════════════════

HARNESS = r"""
const fs = require('fs');
/* argv is [node, this harness, the component]. */
let src = fs.readFileSync(process.argv[2], 'utf8');
/* Matched by shape rather than by an exact rule of box-drawing characters,
   so re-flowing that comment does not silently break the check. */
const MARK = /( {2}\/\* ═+\r?\n {5}4\. Mount)/;
if (!MARK.test(src)) { console.error('MOUNT_MARKER_MISSING'); process.exit(2); }
src = src.replace(MARK, '  globalThis.__M = M;\n\n$1');
const stub = () => ({
  style: {}, classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
  setAttribute(){}, appendChild(){}, addEventListener(){}, replaceChild(){},
  get firstChild(){ return null; }, set textContent(v){}, get textContent(){ return ''; },
});
global.document = {
  readyState: 'complete', addEventListener(){}, querySelector(){ return null; },
  querySelectorAll(){ return []; }, createElement: stub, createElementNS: stub,
  createTextNode: stub,
};
global.window = { console };
new Function(src)();
const M = globalThis.__M;
process.stdout.write(JSON.stringify({
  PE: M.pe, X: M.x0,
  attn0: M.mh.per[0].attn, attn1: M.mh.per[1].attn,
  mout: M.mh.out, ffn_hid: M.ff.hid,
  block: M.res2, block_pre: M.pre.res2,
  masked0: M.mhMasked.per[0].attn, masked1: M.mhMasked.per[1].attn,
  dec_self: M.dec.self,
  cross0: M.dec.cross.per[0].attn, cross1: M.dec.cross.per[1].attn,
  dec_res2: M.dec.res2, dec_res3: M.dec.res3,
}));
"""


def from_component():
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as fh:
        fh.write(HARNESS)
        harness = fh.name
    try:
        proc = subprocess.run(["node", harness, COMPONENT],
                              capture_output=True, text=True)
    except FileNotFoundError:
        sys.exit("needs node on PATH")
    finally:
        os.unlink(harness)
    if proc.returncode != 0:
        sys.exit("could not run the component:\n" + (proc.stderr or proc.stdout))
    return json.loads(proc.stdout)


LABELS = {
    "PE": "positional encoding",
    "X": "embedding x sqrt(d) + PE",
    "attn0": "encoder attention, head 1",
    "attn1": "encoder attention, head 2",
    "mout": "multi-head output",
    "ffn_hid": "feed-forward hidden layer",
    "block": "encoder block, post-norm",
    "block_pre": "encoder block, pre-norm",
    "masked0": "masked attention, head 1",
    "masked1": "masked attention, head 2",
    "dec_self": "decoder after masked self-attention",
    "cross0": "cross-attention, head 1",
    "cross1": "cross-attention, head 2",
    "dec_res2": "decoder after cross-attention",
    "dec_res3": "decoder block output",
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dump", action="store_true",
                    help="print the NumPy reference and stop")
    ap.add_argument("--tol", type=float, default=1e-12,
                    help="largest allowed absolute difference")
    args = ap.parse_args()

    ref = reference()
    if args.dump:
        print(json.dumps(ref, indent=1))
        return 0

    got = from_component()
    bad = 0

    for key, label in LABELS.items():
        a = np.array(got[key], dtype=float)
        b = np.array(ref[key], dtype=float)
        if a.shape != b.shape:
            print("SHAPE  %-38s component %s, reference %s"
                  % (label, a.shape, b.shape))
            bad += 1
            continue
        worst = float(np.max(np.abs(a - b)))
        ok = worst <= args.tol
        print("%s %-38s max abs diff %.2e" % ("ok    " if ok else "DIFFER", label, worst))
        if not ok:
            i, j = np.unravel_index(int(np.argmax(np.abs(a - b))), a.shape)
            print("       at [%d][%d]: component %.10f, reference %.10f"
                  % (i, j, a[i][j], b[i][j]))
            bad += 1

    # Two properties the numbers must have whatever the weights are.
    for key in ("attn0", "attn1", "masked0", "masked1", "cross0", "cross1"):
        rows = np.array(got[key], dtype=float)
        sums = rows.sum(axis=1)
        if not np.allclose(sums, 1.0, atol=1e-12):
            print("DIFFER %-38s a softmax row does not add to one: %s"
                  % (LABELS[key], sums))
            bad += 1
    for key in ("masked0", "masked1"):
        rows = np.array(got[key], dtype=float)
        if np.any(np.triu(rows, 1) != 0):
            print("DIFFER %-38s the causal mask leaks into the future"
                  % LABELS[key])
            bad += 1

    if bad:
        print("\n%d disagreement(s). One of the two implementations is wrong."
              % bad)
        return 1
    print("\nok: the component agrees with the paper, %d tensors checked"
          % len(LABELS))
    return 0


if __name__ == "__main__":
    sys.exit(main())
