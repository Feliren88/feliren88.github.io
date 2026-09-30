const assert = require('node:assert/strict');
const XP = require('../js/components/explainer-core.js');

function near(a, b, tol = 1e-12) {
  assert.ok(Math.abs(a - b) <= tol, `${a} differs from ${b}`);
}

// ease: fixed ends, symmetric about the middle, never decreasing
near(XP.ease(0), 0);
near(XP.ease(1), 1);
near(XP.ease(0.5), 0.5);
near(XP.ease(0.25) + XP.ease(0.75), 1);
for (let t = 0; t < 0.99; t += 0.01) assert.ok(XP.ease(t + 0.01) >= XP.ease(t));

// mix: numbers, nested arrays and objects blend; other values switch at the end
near(XP.mix(2, 4, 0.25), 2.5);
assert.deepEqual(XP.mix([0, [0, 10]], [10, [2, 0]], 0.5), [5, [1, 5]]);
assert.deepEqual(
  XP.mix({ a: 0, m: [1, 0, 0, 1], k: 'x' }, { a: 1, m: [2, 0, 0, 2], k: 'y' }, 0.5),
  { a: 0.5, m: [1.5, 0, 0, 1.5], k: 'x' });
assert.equal(XP.mix('x', 'y', 1), 'y');

// tween without requestAnimationFrame jumps to the exact end state, once
let calls = [];
let ended = false;
const h = XP.tween({ t: 0 }, { t: 1 }, 600, (s, f) => calls.push([s.t, f]), () => { ended = true; });
assert.deepEqual(calls, [[1, 1]]);
assert.ok(ended);
assert.equal(h.running(), false);

// seek shows an eased fraction
calls = [];
h.seek(0.25);
assert.deepEqual(calls, [[XP.ease(0.25), 0.25]]);

// with frames: first frame at f = 0, then eased, stop() finishes at once, late frames do nothing
const queue = [];
global.requestAnimationFrame = (cb) => queue.push(cb);
calls = [];
const h2 = XP.tween({ t: 0 }, { t: 1 }, 600, (s, f) => calls.push([s.t, f]));
queue.shift()(1000);
queue.shift()(1300);
assert.deepEqual(calls, [[0, 0], [0.5, 0.5]]);
assert.equal(h2.running(), true);
h2.stop();
assert.deepEqual(calls[calls.length - 1], [1, 1]);
assert.equal(h2.running(), false);
while (queue.length) queue.shift()(1400);
assert.equal(calls.length, 3);

// reduced motion jumps even when frames are available
XP.reduced = true;
calls = [];
XP.tween({ t: 0 }, { t: 1 }, 600, (s, f) => calls.push([s.t, f]));
assert.deepEqual(calls, [[1, 1]]);
assert.equal(queue.length, 0);
XP.reduced = false;
delete global.requestAnimationFrame;

// planeMap: y points up, round trips are exact
const m = XP.planeMap([-4.5, 4.5], [-3.375, 3.375], 480, 360, 0);
near(m.sx(0), 240); near(m.sy(0), 180); near(m.sx(4.5), 480); near(m.sy(3.375), 0);
near(m.wx(m.sx(1.3)), 1.3); near(m.wy(m.sy(-2.2)), -2.2);
const p = XP.planeMap([0, 10], [0, 5], 200, 120, 10);
near(p.sx(0), 10); near(p.sy(0), 110); near(p.sx(10), 190); near(p.sy(5), 10);

// gridSegments: 3 vertical and 3 horizontal lines, pushed through a matrix
const g = XP.gridSegments([-1, 1], [-1, 1], 1, [2, 0, 0, 1], 0);
assert.equal(g.length, 6);
assert.deepEqual(g[0], [[-2, -1], [-2, 1]]);
assert.deepEqual(g[3], [[-2, -1], [2, -1]]);
// a function is sampled at 25 points per line
const f = XP.gridSegments([-1, 1], [-1, 1], 1, (x, y) => [x, y + x * x], 0);
assert.equal(f[0].length, 25);
near(f[0][0][1], -1 + 1);

console.log('lab core: ok');
