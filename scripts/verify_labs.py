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
