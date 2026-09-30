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


# ── Operating systems ──────────────────────────────────────────────────────

def ref_schedule(procs, algo, q):
    """A plain event-by-event scheduler, one time unit at a time."""
    left = {p['id']: p['burst'] for p in procs}
    arr = {p['id']: p['arrival'] for p in procs}
    pri = {p['id']: p['priority'] for p in procs}
    burst = {p['id']: p['burst'] for p in procs}
    done, t, cur, queue, slice_used, seen = {}, 0, None, [], 0, set()
    order = sorted(procs, key=lambda p: (p['arrival'], p['id']))
    while len(done) < len(procs):
        for p in order:
            if p['arrival'] == t and p['id'] not in seen:
                queue.append(p['id']); seen.add(p['id'])
        if algo == 'RR':
            if cur is not None and (left[cur] == 0 or slice_used == q):
                if left[cur] > 0:
                    queue.append(cur)
                cur = None
            if cur is None and queue:
                cur = queue.pop(0); slice_used = 0
        else:
            ready = [i for i in queue if left[i] > 0]
            key = {'FCFS': lambda i: (arr[i], i), 'SJF': lambda i: (burst[i], arr[i], i),
                   'SRTF': lambda i: (left[i], arr[i], i), 'PNP': lambda i: (pri[i], arr[i], i),
                   'PP': lambda i: (pri[i], arr[i], i)}[algo]
            if algo in ('SRTF', 'PP') or cur is None or left.get(cur, 0) == 0:
                cur = min(ready, key=key) if ready else None
        if cur is not None:
            left[cur] -= 1; slice_used += 1
            if left[cur] == 0:
                done[cur] = t + 1
                if algo != 'RR':
                    queue.remove(cur)
        t += 1
    return {i: done[i] for i in done}


def ref_replace(refs, n, algo):
    frames, faults, last, loaded = [], 0, {}, {}
    for i, p in enumerate(refs):
        if p not in frames:
            faults += 1
            if len(frames) < n:
                frames.append(p)
            else:
                if algo == 'FIFO':
                    v = min(frames, key=lambda f: loaded[f])
                elif algo == 'LRU':
                    v = min(frames, key=lambda f: last[f])
                else:
                    v = max(frames, key=lambda f: refs.index(f, i + 1) if f in refs[i + 1:] else 10 ** 9)
                frames[frames.index(v)] = p
            loaded[p] = i
        last[p] = i
    return faults


def check_os():
    procs = [{'id': 'P1', 'arrival': 0, 'burst': 7, 'priority': 3}, {'id': 'P2', 'arrival': 2, 'burst': 4, 'priority': 1},
             {'id': 'P3', 'arrival': 4, 'burst': 1, 'priority': 4}, {'id': 'P4', 'arrival': 5, 'burst': 4, 'priority': 2}]
    rng = np.random.default_rng(3)
    cases = [procs] + [[{'id': f'P{k + 1}', 'arrival': int(rng.integers(0, 8)), 'burst': int(rng.integers(1, 9)), 'priority': int(rng.integers(0, 5))}
                        for k in range(5)] for _ in range(25)]
    silber = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1]
    belady = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]
    code = """
    const OS = require(%r);
    const input = JSON.parse(require('fs').readFileSync(0, 'utf8'));
    const out = { sched: input.cases.map(c => Object.fromEntries(['FCFS', 'SJF', 'SRTF', 'PNP', 'PP', 'RR'].map(a =>
      [a, Object.fromEntries(OS.schedule(c, a, 2).stats.map(s => [s.id, s.done]))]))),
      silber: ['FIFO', 'LRU', 'OPT'].map(a => OS.replace(input.silber, 3, a).faults),
      belady: [3, 4].map(n => OS.replace(input.belady, n, 'FIFO').faults),
      rand: input.rand.map(r => ['FIFO', 'LRU', 'OPT'].map(a => OS.replace(r, 3, a).faults)),
      bank: OS.banker([[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]], [[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]], [3,3,2]).seq };
    process.stdout.write(JSON.stringify(out));
    """ % os.path.join(JS, 'explainer-os.js')
    rand = [[int(v) for v in rng.integers(0, 6, 18)] for _ in range(30)]
    js = node(code, {'cases': cases, 'silber': silber, 'belady': belady, 'rand': rand})
    for ci, (c, got) in enumerate(zip(cases, js['sched'])):
        for algo in ('FCFS', 'SJF', 'SRTF', 'PNP', 'PP', 'RR'):
            want = ref_schedule(c, algo, 2)
            if got[algo] != want:
                sys.exit(f'MISMATCH os schedule case {ci} {algo}: page {got[algo]} vs reference {want}')
    if js['silber'] != [15, 12, 9]:
        sys.exit(f"MISMATCH os page faults on Silberschatz's string: {js['silber']}, textbook 15, 12, 9")
    if js['belady'] != [9, 10]:
        sys.exit(f"MISMATCH os Belady's anomaly: {js['belady']}, expected 9 then 10")
    for r, got in zip(rand, js['rand']):
        want = [ref_replace(r, 3, a) for a in ('FIFO', 'LRU', 'OPT')]
        if got != want:
            sys.exit(f'MISMATCH os page faults on {r}: page {got} vs reference {want}')
    if js['bank'] != [1, 3, 4, 0, 2]:
        sys.exit(f"MISMATCH os banker: {js['bank']}, textbook P1 P3 P4 P0 P2")
    print(f"os: 6 schedulers agree on {len(cases)} process sets; page faults 15/12/9 and Belady 9 then 10 match the textbook, and 30 random strings agree; banker finds P1 P3 P4 P0 P2")


# ── Databases ──────────────────────────────────────────────────────────────

def check_db():
    rng = np.random.default_rng(9)
    seqs = [[int(v) for v in rng.permutation(200)[:int(rng.integers(5, 120))] + 1] for _ in range(40)]
    orders = [int(rng.integers(3, 8)) for _ in seqs]
    tables = [([{'k': int(k), 'v': f'l{i}'} for i, k in enumerate(rng.integers(0, 6, 5))],
               [{'k': int(k), 'v': f'r{i}'} for i, k in enumerate(rng.integers(0, 6, 5))]) for _ in range(30)]
    scheds = []
    for _ in range(60):
        n = int(rng.integers(2, 9))
        scheds.append([{'t': 'T' + str(int(rng.integers(1, 4))), 'op': 'RW'[int(rng.integers(0, 2))], 'x': 'AB'[int(rng.integers(0, 2))]} for _ in range(n)])
    code = """
    const DB = require(%r);
    const input = JSON.parse(require('fs').readFileSync(0, 'utf8'));
    function dump(n) { return n.leaf ? { leaf: true, keys: n.keys } : { leaf: false, keys: n.keys, kids: n.kids.map(dump) }; }
    const trees = input.seqs.map((s, i) => { const t = DB.bptree(input.orders[i]); s.forEach(k => t.insert(k));
      const L = DB.levels(t.root()), leaves = L[L.length - 1]; const chain = []; let n = leaves[0]; while (n) { chain.push(...n.keys); n = n.next; }
      return { tree: dump(t.root()), chain, leafCount: leaves.length }; });
    const joins = input.tables.map(([l, r]) => Object.fromEntries(['inner', 'left', 'right', 'full'].map(t => [t, DB.join(l, r, t).rows.map(p => [p[0] ? p[0].v : null, p[1] ? p[1].v : null])])));
    const prec = input.scheds.map(s => DB.precedence(s).serializable);
    process.stdout.write(JSON.stringify({ trees, joins, prec }));
    """ % os.path.join(JS, 'explainer-db.js')
    js = node(code, {'seqs': seqs, 'orders': orders, 'tables': tables, 'scheds': scheds})

    def walk(n, lo, hi, depth, order, leaves, is_root):
        if len(n['keys']) >= order:
            sys.exit('MISMATCH db b+ tree: a node holds too many keys')
        if not is_root and len(n['keys']) < (order - 1) // 2:
            sys.exit('MISMATCH db b+ tree: a node is under half full')
        for k in n['keys']:
            if not (lo is None or k >= lo) or not (hi is None or k < hi):
                sys.exit('MISMATCH db b+ tree: a key sits outside its separator range')
        if n['leaf']:
            leaves.append(depth); return
        bounds = [lo] + n['keys'] + [hi]
        if len(n['kids']) != len(n['keys']) + 1:
            sys.exit('MISMATCH db b+ tree: child count is not keys + 1')
        for i, c in enumerate(n['kids']):
            walk(c, bounds[i], bounds[i + 1], depth + 1, order, leaves, False)

    for s, o, t in zip(seqs, orders, js['trees']):
        depths = []
        walk(t['tree'], None, None, 0, o, depths, True)
        if len(set(depths)) != 1:
            sys.exit('MISMATCH db b+ tree: leaves at different depths')
        if t['chain'] != sorted(set(s)):
            sys.exit('MISMATCH db b+ tree: the leaf chain is not every key in order')

    for (l, r), got in zip(tables, js['joins']):
        inner = [(a['v'], b['v']) for a in l for b in r if a['k'] == b['k']]
        lu = [(a['v'], None) for a in l if not any(a['k'] == b['k'] for b in r)]
        ru = [(None, b['v']) for b in r if not any(a['k'] == b['k'] for a in l)]
        want = {'inner': inner, 'left': inner + lu, 'right': inner + ru, 'full': inner + lu + ru}
        for t in want:
            if sorted(map(tuple, got[t]), key=str) != sorted(want[t], key=str):
                sys.exit(f'MISMATCH db {t} join: page {got[t]} vs reference {want[t]}')

    for sch, got in zip(scheds, js['prec']):
        edges = {(a['t'], b['t']) for i, a in enumerate(sch) for b in sch[i + 1:]
                 if a['t'] != b['t'] and a['x'] == b['x'] and 'W' in (a['op'], b['op'])}
        nodes = {a['t'] for a in sch}
        state = {}

        def cyc(u):
            state[u] = 1
            for (a, b) in edges:
                if a == u and (state.get(b) == 1 or (state.get(b) is None and cyc(b))):
                    return True
            state[u] = 2
            return False
        want = not any(state.get(u) is None and cyc(u) for u in sorted(nodes))
        if got != want:
            sys.exit(f'MISMATCH db serializability on {sch}: page {got} vs reference {want}')
    print(f'db: B+ tree invariants hold for {len(seqs)} random insert orders; 4 joins agree on {len(tables)} table pairs; serializability agrees on {len(scheds)} schedules')


# ── Networks ───────────────────────────────────────────────────────────────

def check_net():
    import heapq
    import ipaddress
    rng = np.random.default_rng(4)
    graphs = []
    for _ in range(40):
        nodes = [chr(65 + i) for i in range(int(rng.integers(3, 9)))]
        edges = [[nodes[i - 1], nodes[i], int(rng.integers(1, 10))] for i in range(1, len(nodes))]
        for _ in range(int(rng.integers(0, 8))):
            a, b = rng.choice(len(nodes), 2, replace=False)
            edges.append([nodes[a], nodes[b], int(rng.integers(1, 10))])
        graphs.append({'nodes': nodes, 'edges': edges})
    addrs = [[f'{int(rng.integers(1, 224))}.{int(rng.integers(0, 256))}.{int(rng.integers(0, 256))}.{int(rng.integers(0, 256))}', int(rng.integers(8, 33))] for _ in range(200)]
    code = """
    const NET = require(%r);
    const input = JSON.parse(require('fs').readFileSync(0, 'utf8'));
    const out = { dist: input.graphs.map(g => { const r = NET.dijkstra(g.nodes, g.edges, g.nodes[0]); return { dist: r.dist, hops: NET.nextHops(r.prev, g.nodes[0]), prev: r.prev }; }),
      sub: input.addrs.map(([ip, p]) => NET.subnet(ip, p)),
      reno: NET.reno(24, [12], [19], 16).map(r => r.cwnd) };
    process.stdout.write(JSON.stringify(out));
    """ % os.path.join(JS, 'explainer-net.js')
    js = node(code, {'graphs': graphs, 'addrs': addrs})
    for g, got in zip(graphs, js['dist']):
        adj = {n: [] for n in g['nodes']}
        for a, b, w in g['edges']:
            adj[a].append((b, w)); adj[b].append((a, w))

        def sp(src):
            dist = {n: float('inf') for n in g['nodes']}; dist[src] = 0; pq = [(0, src)]
            while pq:
                d, u = heapq.heappop(pq)
                if d > dist[u]:
                    continue
                for v, w in adj[u]:
                    if d + w < dist[v]:
                        dist[v] = d + w; heapq.heappush(pq, (d + w, v))
            return dist
        src = g['nodes'][0]; dist = sp(src)
        if got['dist'] != dist:
            sys.exit(f"MISMATCH net dijkstra: page {got['dist']} vs reference {dist}")
        for dest, hop in got['hops'].items():
            via = sp(hop)
            if not any(v == hop and w + via[dest] == dist[dest] for v, w in adj[src]):
                sys.exit(f'MISMATCH net next hop for {dest}: {hop} is not the first hop of a shortest path')
    for (ip, p), got in zip(addrs, js['sub']):
        net = ipaddress.ip_network(f'{ip}/{p}', strict=False)
        hosts = net.num_addresses if p >= 31 else net.num_addresses - 2
        want = [str(net.network_address), str(net.broadcast_address), str(net.netmask), hosts]
        if [got['network'], got['broadcast'], got['mask'], got['usable']] != want:
            sys.exit(f'MISMATCH net subnet {ip}/{p}: page {got} vs ipaddress {want}')
    cw, ss, want = 1, 16, []
    for r in range(1, 25):
        want.append(cw)
        if r == 19:
            ss = max(2, cw // 2); cw = 1
        elif r == 12:
            ss = max(2, cw // 2); cw = ss
        elif cw < ss:
            cw = min(2 * cw, ss)
        else:
            cw += 1
    if js['reno'] != want:
        sys.exit(f"MISMATCH net reno: page {js['reno']} vs reference {want}")
    print(f'net: Dijkstra agrees with a heap implementation on {len(graphs)} random graphs; {len(addrs)} subnets agree with Python ipaddress; TCP Reno trace matches')


# ── Self-attention from scratch, and the 2D diffusion toy ──────────────────
# Both components render straight into the page, so these checks load them
# with a stub document and read the numbers back out of the markup.

STUB = """
const fs = require('fs');
let html = '';
const read = { innerHTML: '' };
const host = { dataset: {}, addEventListener() {}, querySelector(s) { return s === '.xp-toy-read' ? read : null; },
  set innerHTML(v) { html = v; }, get innerHTML() { return html; } };
global.window = { matchMedia: () => ({ matches: false }), addEventListener() {} };
global.MutationObserver = function () { this.observe = () => {}; };
global.getComputedStyle = () => ({ getPropertyValue: () => '' });
global.XP = require(%r);
"""


def mulberry(seed):
    M = 0xFFFFFFFF
    def imul(a, b): return ((a & M) * (b & M)) & M
    def s32(x):
        x &= M
        return x - (1 << 32) if x & 0x80000000 else x
    st = [seed]
    def f():
        st[0] = s32(st[0] + 0x6D2B79F5); sd = st[0] & M
        t = imul(sd ^ (sd >> 15), 1 | sd)
        t = (s32(t + imul(t ^ (t >> 7), 61 | t)) ^ t) & M
        return ((t ^ (t >> 14)) & M) / 4294967296
    return f


def check_scratch():
    """The page's seeded weights, rebuilt here from the same generator, must
    give the same scores and weights for the default query word."""
    code = STUB % os.path.join(JS, 'explainer-core.js') + """
    global.document = { querySelector: s => s === '[data-xp="scratch"]' ? host : null, documentElement: {} };
    eval(fs.readFileSync(%r, 'utf8'));
    const pick = (cls) => html.split('<ol class="' + cls + '">')[1].split('</ol>')[0].split('<b>').slice(1).map(x => +x.split('</b>')[0].replace('\u2212', '-'));
    process.stdout.write(JSON.stringify({ alpha: pick('xp-alpha'), omega: pick('xp-omega') }));
    """ % os.path.join(JS, 'explainer-transformer.js')
    js = node(code)
    r = mulberry(123)
    def normals(rows, cols):
        out = np.zeros((rows, cols))
        for i in range(rows):
            for j in range(cols):
                u = max(r(), 1e-12); v = r()
                out[i, j] = np.sqrt(-2 * np.log(u)) * np.cos(2 * np.pi * v)
        return out
    X = 0.4 * normals(6, 16); normals(8, 16)
    WQ = np.zeros((24, 16)); WK = np.zeros((24, 16))
    for i in range(24):
        for j in range(16):
            WQ[i, j] = r(); WK[i, j] = r()
    q = WQ @ X[1]; omega = (X @ WK.T) @ q
    a = np.exp(omega / np.sqrt(24) - (omega / np.sqrt(24)).max()); a /= a.sum()
    close('scratch attention scores', js['omega'], np.round(omega, 1), 0.11)
    close('scratch attention weights', js['alpha'], np.round(a, 3), 1.1e-3)
    print('scratch: scores and softmax weights match a NumPy rebuild from the same seeded generator')


def check_toy():
    """The toy's exact denoiser and DDIM sampler, against the same sampler in
    NumPy: with the page's defaults (left class, guidance 3) both must land
    every sample in the left class at the same mean distance to the bumps."""
    code = STUB % os.path.join(JS, 'explainer-core.js') + """
    global.document = { querySelector: s => s === '[data-xp="toy"]' ? host : null, documentElement: {} };
    eval(fs.readFileSync(%r, 'utf8'));
    process.stdout.write(JSON.stringify(read.innerHTML.split('<').map(x => x.split('>').slice(1).join('>')).join(' ')));
    """ % os.path.join(JS, 'explainer-diffusion.js')
    text = node(code)
    import re
    m = re.search(r'left class\s+([0-9.]+)%', text)
    if not m:
        sys.exit('MISMATCH toy diffusion: no readout found in ' + text[:300])
    hit = float(m.group(1)) / 100
    dist = float(re.search(r'bump centre\s+([0-9.]+)', text).group(1))
    SIG = 0.16
    M = np.array([[-1.05, .8], [-1.35, 0], [-1.05, -.8], [1.05, .8], [1.35, 0], [1.05, -.8]]); C = np.array([0, 0, 0, 1, 1, 1])
    T = 1000; abar = np.cumprod(1 - (1e-4 + (0.02 - 1e-4) * np.arange(T) / (T - 1)))
    tau = np.round(np.arange(50) * (T - 1) / 49).astype(int)
    def eps(x, a, idx):
        v = a * SIG ** 2 + 1 - a; mu = np.sqrt(a) * M[idx]
        d = x[:, None, :] - mu[None]; l = -(d ** 2).sum(-1) / (2 * v)
        w = np.exp(l - l.max(1, keepdims=True)); w /= w.sum(1, keepdims=True)
        return -np.sqrt(1 - a) * (w[..., None] * (mu[None] - x[:, None, :])).sum(1) / v
    x = np.random.default_rng(0).standard_normal((20000, 2))
    for i in range(49, 0, -1):
        a, ap = abar[tau[i]], abar[tau[i - 1]]
        e = eps(x, a, np.arange(6)); e = e + 3 * (eps(x, a, np.where(C == 0)[0]) - e)
        x = np.sqrt(ap) * (x - np.sqrt(1 - a) * e) / np.sqrt(a) + np.sqrt(1 - ap) * e
    d = np.linalg.norm(x[:, None] - M[None], axis=-1)
    want_hit, want_dist = (C[d.argmin(1)] == 0).mean(), d.min(1).mean()
    if abs(hit - want_hit) > 0.01 or abs(dist - want_dist) > 0.02:
        sys.exit(f'MISMATCH toy diffusion: page {hit:.3f}, {dist:.3f} vs NumPy {want_hit:.3f}, {want_dist:.3f}')
    print(f'toy: page and NumPy both put {hit:.0%} of samples in the left class, mean distance {dist:.3f} vs {want_dist:.3f}')


CHECKS = {'tinyvgg': check_tinyvgg, 'gan': check_gan, 'os': check_os, 'db': check_db, 'net': check_net, 'scratch': check_scratch, 'toy': check_toy}

if __name__ == '__main__':
    names = sys.argv[1:] or list(CHECKS)
    for n in names:
        CHECKS[n]()
    print('OK')
