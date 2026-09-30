# Module explainers, plan 1 of 6: foundation and Linear Algebra

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared machinery for module explainers, then the 7 Linear Algebra explainers. Each explainer sits inside its module and is checked in maths, bounds, interaction, loading, colour and prose.

**Architecture:**
- Each module gets 1 include (`_includes/labs/<track>/<slug>.html`) and 1 script (`js/labs/<track>/<slug>.js`).
- The script's pure maths is exported for Node and checked against NumPy by `scripts/verify_labs.py`.
- Its browser half calls `XP.lab(id, mount)`, which wires the live values, the term highlighting, the animation interrupt and the fallback.
- `js/components/lab-loader.js` injects each script when its module nears the viewport. A failed load shows the module's old static diagram.

**Tech stack:**
- Jekyll (`github-pages` gem), with Liquid in `_layouts/syllabus.html`.
- ES5-style browser JavaScript with no build step, like `js/components/explainer-core.js`.
- SVG drawn as strings through `XP.svgEl`.
- Python 3 with NumPy 2.5 and SciPy 1.18 from `../venv`.
- Playwright with Chrome for the browser checks, and Node for the pure maths.

**Spec:** `docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md`

## Global Constraints

**Paths and tools**
- Work in `/private/tmp/claude-501/-Users-feliren-Desktop/880860ce-00f7-4042-a3dd-849c9b4d5f44/scratchpad/site`, the "site root". All paths below are relative to it.
- Python with NumPy, SciPy and Playwright is `../venv/bin/python`. Plain `python3` has no NumPy.
- Build with `PAGES_DISABLE_NETWORK=1 make build`. Never run a build that reaches the network: it hangs.
- Serve the built site for the browser checks with `python3 -m http.server 4000 -d _site`, in the background.

**Commits**
- Commit messages carry no attribution lines: no `Co-Authored-By`, and no mention of Claude or Anthropic.
- Never push. The owner pushes on request.

**Prose** (from `CLAUDE.md`)
- British spelling and numerals.
- Sentences of about 14 words.
- No em dashes, no negative contrast ("not X but Y"), no structure announcements, no one-line closers.
- Guide cards have 6 to 10 pages of 1 or 2 sentences each, and each track gets a no-ai-slop pass.

**Behaviour**
- Every explainer opens on page 1 of its guide.
- Transitions take 400 to 900 ms with easing. A pressed Play may run longer.
- Nothing loops unless the reader presses play. A pointer press anywhere in the explainer finishes the running animation.
- Under reduced motion, every change jumps to its end state.

**Access**
- Every handle takes keyboard focus and moves with the arrow keys; Shift moves it 10 times as far.
- A polite live region (`[data-say]`) describes the state in words.

**Colour**
- Use `--xp-q` and `--xp-k` for the 2 inputs or basis vectors, `--xp-o` for the result, `--xp-v` for data, and `--tf-up` and `--tf-down` for sign.
- Text meets 4.5:1 and marks (`.pl-vec`, `.pl-handle`, `.pl-mark`) meet 3:1 against the stage, in both themes. Context drawn with `.is-faint` is exempt.

**Layout and readouts**
- An explainer fits its module's width, and nothing scrolls sideways at 390 px.
- No readout shows NaN or Infinity. Degenerate cases are described in words.
- No invented numbers. Every number shown is computed, or it comes from a cited source.

## Review Focus

These 5 cases are ones the spec implies but no single explainer's own tests exercise. Each has a test in Task 2's `scripts/check_labs.py`, which runs on every explainer.

1. **A handle dragged or keyed past the edge.** It clamps inside the stage, and no mark leaves the frame. Tested by the bounds sweep: Shift+Arrow 60 times in each direction on every handle.
2. **Next pressed 3 times in quick succession, or Play pressed during a transition.** Each earlier animation finishes at once, and after 1 s no animation is running. There are no errors, and the guide shows page 4. Tested by a rapid-click check.
3. **Degenerate input**: parallel vectors, det = 0, or a zero vector. The readouts describe the state in words and never show "NaN" or "Infinity". Tested by scanning the explainer's text after every control and handle action.
4. **Touch at phone width.** Handles take `touch-action: none`, while the plane keeps page scrolling. Tested by reading the computed `touch-action`.
5. **A keyboard-only reader.** Every handle is in the tab order (`tabindex="0"`) and has an `aria-label` that states its position. Tested by the handle sweep, which focuses each handle and checks that the label changes after an arrow key.

---

## File structure

**Create**

| File | Responsibility |
| --- | --- |
| `_data/module_labs.yml` | Maps a track and module index to an explainer slug |
| `js/components/lab-loader.js` | Loads each explainer's script when its module nears the viewport. Shows the fallback when the script fails |
| `css/labs.css` | Explainer layout and plane styles, then 1 section per track |
| `scripts/test_lab_core.js` | Node tests for the new pure helpers in the core |
| `scripts/verify_labs.py` | Checks each explainer's maths against NumPy and SciPy |
| `scripts/check_labs.py` | Browser checks for loading, guide, controls, handles, motion, overflow, colour, fallback and text |
| `_includes/labs/linear-algebra/<slug>.html` | 1 per module: title, equation strip, stage, guide box, controls, live region, source line |
| `js/labs/linear-algebra/<slug>.js` | 1 per module: pure maths, then the mount function |

The 7 slugs are:
- `vectors-and-spaces`
- `matrices-as-transformations`
- `determinant-rank-inverse`
- `eigenvectors`
- `decompositions`
- `least-squares`
- `conditioning`

**Modify**

| File | Change |
| --- | --- |
| `js/components/explainer-core.js` | Add `ease`, `mix`, `tween`, `planeMap`, `gridSegments`, `plane`, `lab` and `labFallback` |
| `_layouts/syllabus.html` | Add the explainer slot and the hidden fallback diagram |
| `_includes/site-head.html` | Load `css/labs.css` on tracks listed in `module_labs.yml` |
| `_includes/site-scripts.html` | Load `lab-loader.js` on tracks listed in `module_labs.yml` |
| `scripts/check_chart_bounds.py` | Load the explainers, then sweep their sliders and handles |
| `Makefile` | Run `scripts/test_lab_core.js` in `make test` |
| `docs/interview.md` | Add a section on module explainers |
| `docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md` | Remove each track's distribution labs in that track's own plan |

---

### Task 0: Remove each track's distribution labs in that track's plan

The spec's delivery section removes every listed distribution lab, and the calculus one-off, in this first plan. That would strip labs from Calculus, Mathematics, Bayesian and Frequentist before their explainers exist. So each track's plan removes its own labs when its explainers land. Linear Algebra has none to remove.

**Files:**
- Modify: `docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md`, section 5

- [ ] **Step 1: Edit the delivery list**

In section 5, replace this sub-bullet:

```markdown
   - removing the distribution labs listed in section 1, and replacing the calculus one-off;
```

with:

```markdown
   - each later track's plan removes that track's distribution labs, and the Calculus plan replaces the calculus one-off, so no module loses a lab before its explainer exists;
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md
git commit -m "Remove each track's distribution labs in that track's own plan"
```

---

### Task 1: Motion, planes and the lab wrapper in the core

**Files:**
- Modify: `js/components/explainer-core.js`, adding a section before `var XP = {` and extending the `XP` object
- Create: `scripts/test_lab_core.js`
- Modify: `Makefile`, the `test` target

**Interfaces:**
- Consumes: the existing `esc`, `fmt`, `svgEl`, `r1` and `highlight` in `explainer-core.js`.
- Produces:
  - `XP.ease(t) -> number`: cubic ease in and out on [0, 1].
  - `XP.mix(a, b, t) -> same shape`: blends numbers, arrays and plain objects. Other values switch to `b` only at `t >= 1`.
  - `XP.tween(from, to, ms, onFrame(state, f), onEnd?) -> { stop(), seek(f), running() }`.
    - `stop()` jumps to `to` and calls `onEnd`.
    - `seek(f)` shows fraction `f` and stops.
    - Under `XP.reduced`, or without `requestAnimationFrame`, it calls `onFrame(to, 1)` once, synchronously.
  - `XP.planeMap(xr, yr, w, h, pad) -> { sx(x), sy(y), wx(px), wy(py) }`, with y pointing up.
  - `XP.gridSegments(xr, yr, step, T, ext?) -> [[ [x, y], ... ], ...]`: polylines in world units. `T` is `null`, a matrix `[a, b, c, d]` given by rows, or a function `(x, y) -> [x', y']`. `ext` defaults to 2 spans.
  - `XP.plane(el, { x, y, w, h, pad, label }) -> P`. `P` has these members:
    - `svg`, `map`, `w`, `h`;
    - `grid`, `plot` and `top` (`<g>` elements);
    - `gridMarkup(T, step, cls)`, `axes()`;
    - `arrow(x0, y0, x1, y1, cls, part)`, `dot(x, y, r, cls, part)`;
    - `handle({ x, y, label, cls, part, snap, bounds, onMove(x, y, done) }) -> { el, get(), set(x, y), show(on) }`.
  - `XP.lab(id, mount(root, api))`.
    - `api.values(obj, d?)` writes `[data-val=k]` inside the explainer and `[data-live=k]` in its module.
    - `api.say(text)`, `api.focus(parts)`.
    - `api.animate(from, to, ms, onFrame, onEnd?)` stops any running animation first, and marks the root with `data-anim` while running.
    - `api.interrupt()`.
  - `XP.labFallback(slot, err)`.

- [ ] **Step 1: Write the failing test**

Create `scripts/test_lab_core.js`:

```js
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
```

- [ ] **Step 2: Run it to check that it fails**

Run: `node scripts/test_lab_core.js`

Expected: it fails with `TypeError: XP.ease is not a function`.

- [ ] **Step 3: Add the helpers to the core**

In `js/components/explainer-core.js`, insert this block immediately before the line `var XP = {`:

```js
  /* ── motion and planes for the module explainers (js/labs/) ──────────── */

  /* Cubic ease in and out on [0, 1]. */
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /* Blend 2 states of the same shape: numbers, arrays and plain objects.
     Anything else, such as a string or a boolean, switches to `b` at the end. */
  function mix(a, b, t) {
    if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * t;
    if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
      return a.map(function (v, i) { return mix(v, b[i], t); });
    }
    if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
      var o = {};
      for (var k in b) {
        if (Object.prototype.hasOwnProperty.call(b, k)) o[k] = k in a ? mix(a[k], b[k], t) : b[k];
      }
      return o;
    }
    return t < 1 ? a : b;
  }

  /* Animate from one state to another. onFrame(state, f) runs every frame
     with the raw fraction f; the last call always carries `to` exactly.
     Under reduced motion, or with no requestAnimationFrame, it jumps to the
     end at once. stop() finishes at once; seek(f) shows fraction f. */
  function tween(from, to, ms, onFrame, onEnd) {
    var raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null;
    var live = true, start = null;
    function finish() {
      if (!live) return;
      live = false;
      onFrame(to, 1);
      if (onEnd) onEnd();
    }
    var h = {
      stop: finish,
      seek: function (f) {
        live = false;
        f = Math.max(0, Math.min(1, f));
        onFrame(f >= 1 ? to : mix(from, to, ease(f)), f);
      },
      running: function () { return live; }
    };
    if (XP.reduced || !raf || !(ms > 0)) { finish(); return h; }
    function step(now) {
      if (!live) return;
      if (start === null) start = now;
      var f = Math.min(1, (now - start) / ms);
      if (f >= 1) { finish(); return; }
      onFrame(mix(from, to, ease(f)), f);
      raf(step);
    }
    raf(step);
    return h;
  }

  /* World-to-screen mapping for a plane `w` by `h` pixels with `pad` pixels
     of margin. y points up. */
  function planeMap(xr, yr, w, h, pad) {
    var p = pad || 0, kx = (w - 2 * p) / (xr[1] - xr[0]), ky = (h - 2 * p) / (yr[1] - yr[0]);
    return {
      sx: function (x) { return p + (x - xr[0]) * kx; },
      sy: function (y) { return h - p - (y - yr[0]) * ky; },
      wx: function (px) { return xr[0] + (px - p) / kx; },
      wy: function (py) { return yr[0] + (h - p - py) / ky; }
    };
  }

  /* The lines of a grid, as polylines in world units, pushed through `T`: a
     2 by 2 matrix [a, b, c, d] given by rows, or a function (x, y) -> [x', y'].
     A matrix keeps lines straight, so 2 points per line are enough; a function
     is sampled at 25. `ext` widens the grid by that many spans on each side,
     so a transformed grid still fills the view. */
  function gridSegments(xr, yr, step, T, ext) {
    var e = ext === undefined ? 2 : ext, sx = xr[1] - xr[0], sy = yr[1] - yr[0];
    var x0 = xr[0] - e * sx, x1 = xr[1] + e * sx, y0 = yr[0] - e * sy, y1 = yr[1] + e * sy;
    var fn = typeof T === 'function' ? T : T ? function (x, y) { return [T[0] * x + T[1] * y, T[2] * x + T[3] * y]; } :
      function (x, y) { return [x, y]; };
    var n = typeof T === 'function' ? 24 : 1, out = [], k;
    function line(ax, ay, bx, by) {
      var pts = [];
      for (var i = 0; i <= n; i++) pts.push(fn(ax + (bx - ax) * i / n, ay + (by - ay) * i / n));
      out.push(pts);
    }
    for (k = Math.ceil(x0 / step - 1e-9); k <= Math.floor(x1 / step + 1e-9); k++) line(k * step, y0, k * step, y1);
    for (k = Math.ceil(y0 / step - 1e-9); k <= Math.floor(y1 / step + 1e-9); k++) line(x0, k * step, x1, k * step);
    return out;
  }

  /* An SVG coordinate plane appended to `el`: a clipped grid layer and plot
     layer, then an unclipped top layer for handles, which clamp to the view. */
  var planeCount = 0;
  function plane(el, opts) {
    var id = 'lab-pl' + (++planeCount), w = opts.w || 480, h = opts.h || 360, pad = opts.pad || 0;
    var map = planeMap(opts.x, opts.y, w, h, pad), NS = 'http://www.w3.org/2000/svg';
    el.insertAdjacentHTML('beforeend',
      '<svg class="lab-plane" viewBox="0 0 ' + w + ' ' + h + '" role="group" aria-label="' + esc(opts.label || '') + '">' +
      '<defs><clipPath id="' + id + '-clip"><rect x="' + pad + '" y="' + pad + '" width="' + (w - 2 * pad) + '" height="' + (h - 2 * pad) + '"/></clipPath></defs>' +
      '<g class="pl-grid" clip-path="url(#' + id + '-clip)"></g>' +
      '<g class="pl-plot" clip-path="url(#' + id + '-clip)"></g>' +
      '<g class="pl-top"></g></svg>');
    var svg = el.lastElementChild;
    function pts(list) {
      return list.map(function (q) { return r1(map.sx(q[0])) + ',' + r1(map.sy(q[1])); }).join(' ');
    }
    var P = {
      svg: svg, map: map, w: w, h: h, pts: pts,
      grid: svg.querySelector('.pl-grid'), plot: svg.querySelector('.pl-plot'), top: svg.querySelector('.pl-top'),
      gridMarkup: function (T, step, cls) {
        return '<g class="' + (cls || '') + '">' + gridSegments(opts.x, opts.y, step || 1, T).map(function (line) {
          return '<polyline points="' + pts(line) + '"/>';
        }).join('') + '</g>';
      },
      axes: function () {
        return svgEl('line', { x1: 0, y1: map.sy(0), x2: w, y2: map.sy(0), 'class': 'pl-axis' }) +
          svgEl('line', { x1: map.sx(0), y1: 0, x2: map.sx(0), y2: h, 'class': 'pl-axis' });
      },
      arrow: function (x0, y0, x1, y1, cls, part) {
        var ax = map.sx(x0), ay = map.sy(y0), bx = map.sx(x1), by = map.sy(y1);
        var dx = bx - ax, dy = by - ay, L = Math.sqrt(dx * dx + dy * dy);
        var g = '<g class="pl-vec ' + (cls || '') + '"' + (part ? ' data-part="' + esc(part) + '"' : '') + '>';
        if (L < 0.5) return g + svgEl('circle', { cx: ax, cy: ay, r: 3 }) + '</g>';
        var ux = dx / L, uy = dy / L, hl = Math.min(11, L * 0.45), hw = hl * 0.55, sx = bx - ux * hl, sy = by - uy * hl;
        return g + svgEl('line', { x1: ax, y1: ay, x2: sx, y2: sy }) +
          svgEl('polygon', { points: r1(bx) + ',' + r1(by) + ' ' + r1(sx - uy * hw) + ',' + r1(sy + ux * hw) + ' ' + r1(sx + uy * hw) + ',' + r1(sy - ux * hw) }) + '</g>';
      },
      dot: function (x, y, r, cls, part) {
        return svgEl('circle', { cx: map.sx(x), cy: map.sy(y), r: r || 4, 'class': cls, 'data-part': part });
      },
      /* A draggable, focusable point. Arrow keys move it by `snap` (0.1 by
         default), and Shift moves it 10 times as far. onMove(x, y, done) runs on
         every move; done is true when a drag ends or a key moves it. */
      handle: function (o) {
        var snap = o.snap || 0.1, mx = (opts.x[1] - opts.x[0]) * 0.03, my = (opts.y[1] - opts.y[0]) * 0.03;
        var bx = o.bounds ? o.bounds[0] : [opts.x[0] + mx, opts.x[1] - mx];
        var by = o.bounds ? o.bounds[1] : [opts.y[0] + my, opts.y[1] - my];
        var c = document.createElementNS(NS, 'circle'), x = o.x, y = o.y, dragging = false;
        c.setAttribute('r', 9);
        c.setAttribute('class', 'pl-handle ' + (o.cls || ''));
        c.setAttribute('tabindex', '0');
        c.setAttribute('role', 'button');
        c.setAttribute('aria-roledescription', 'draggable point');
        if (o.part) c.setAttribute('data-part', o.part);
        P.top.appendChild(c);
        function q(v) { return parseFloat((Math.round(v / snap) * snap).toFixed(6)); }
        function clamp(v, r) { return Math.max(r[0], Math.min(r[1], v)); }
        function place() {
          c.setAttribute('cx', r1(map.sx(x)));
          c.setAttribute('cy', r1(map.sy(y)));
          c.setAttribute('aria-label', o.label + ' at ' + fmt(x, 1) + ', ' + fmt(y, 1) + '. Arrow keys move it.');
        }
        function to(nx, ny, done) {
          x = clamp(q(nx), bx); y = clamp(q(ny), by);
          place();
          if (o.onMove) o.onMove(x, y, done);
        }
        function world(e) {
          var pt = svg.createSVGPoint();
          pt.x = e.clientX; pt.y = e.clientY;
          var s = pt.matrixTransform(svg.getScreenCTM().inverse());
          return [map.wx(s.x), map.wy(s.y)];
        }
        c.addEventListener('pointerdown', function (e) {
          dragging = true; c.setPointerCapture(e.pointerId); c.classList.add('is-drag'); e.preventDefault();
        });
        c.addEventListener('pointermove', function (e) {
          if (!dragging) return;
          var w0 = world(e); to(w0[0], w0[1], false);
        });
        c.addEventListener('pointerup', function (e) {
          if (!dragging) return;
          dragging = false; c.classList.remove('is-drag');
          var w0 = world(e); to(w0[0], w0[1], true);
        });
        c.addEventListener('pointercancel', function () {
          if (!dragging) return;
          dragging = false; c.classList.remove('is-drag'); to(x, y, true);
        });
        c.addEventListener('keydown', function (e) {
          var k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
          if (!k) return;
          e.preventDefault();
          var s = snap * (e.shiftKey ? 10 : 1);
          to(x + k[0] * s, y + k[1] * s, true);
        });
        place();
        return {
          el: c,
          get: function () { return [x, y]; },
          set: function (nx, ny) { x = clamp(nx, bx); y = clamp(ny, by); place(); },
          show: function (on) { c.style.display = on ? '' : 'none'; }
        };
      }
    };
    return P;
  }

  /* When an explainer cannot run, show the module's static diagram instead. */
  function labFallback(slot, err) {
    slot.setAttribute('data-lab-state', 'failed');
    var fb = slot.nextElementSibling;
    if (fb && fb.hasAttribute('data-lab-fallback')) fb.hidden = false;
    var root = slot.querySelector('.lab');
    if (root) root.hidden = true;
    if (!slot.querySelector('.lab-fail')) {
      var note = document.createElement('p');
      note.className = 'lab-fail';
      note.textContent = 'The interactive version did not load.';
      slot.appendChild(note);
    }
    if (typeof console !== 'undefined') console.error('Module explainer ' + slot.getAttribute('data-lab') + ' failed', err);
  }

  /* Mount a module explainer into every slot that names `id`. mount(root, api)
     gets the explainer's section and a small api: values, say, focus,
     animate and interrupt. A throw inside mount shows the fallback. */
  function lab(id, mount) {
    Array.prototype.forEach.call(document.querySelectorAll('.lab-slot[data-lab="' + id + '"]'), function (slot) {
      if (slot.getAttribute('data-lab-state') === 'ready') return;
      var root = slot.querySelector('.lab'), mod = slot.closest('.syl-module');
      var stage = root.querySelector('[data-stage]'), say = root.querySelector('[data-say]');
      var current = null, focused = [];
      var api = {
        values: function (vals, d) {
          Object.keys(vals).forEach(function (k) {
            var v = vals[k], text = typeof v === 'number' ? (isFinite(v) ? fmt(v, d === undefined ? 2 : d) : '?') : String(v);
            Array.prototype.forEach.call(root.querySelectorAll('[data-val="' + k + '"]'), function (n) { n.textContent = text; });
            if (mod) Array.prototype.forEach.call(mod.querySelectorAll('[data-live="' + k + '"]'), function (n) { n.textContent = text; });
          });
        },
        say: function (text) { if (say) say.textContent = text; },
        focus: function (parts) { focused = parts || []; highlight(stage, focused); },
        animate: function (from, to, ms, onFrame, onEnd) {
          if (current) current.stop();
          root.setAttribute('data-anim', '');
          current = tween(from, to, ms, onFrame, function () {
            root.removeAttribute('data-anim');
            if (onEnd) onEnd();
          });
          return current;
        },
        interrupt: function () { if (current) current.stop(); }
      };
      /* A press anywhere in the explainer finishes the running animation. */
      root.addEventListener('pointerdown', function () { api.interrupt(); }, true);
      /* Hovering a term lights its part of the picture, and the other way round. */
      Array.prototype.forEach.call(root.querySelectorAll('[data-term]'), function (t) {
        t.addEventListener('mouseenter', function () { highlight(stage, [t.getAttribute('data-term')]); });
        t.addEventListener('mouseleave', function () { highlight(stage, focused); });
      });
      stage.addEventListener('mouseover', function (e) {
        var part = e.target.closest && e.target.closest('[data-part]');
        var names = part ? part.getAttribute('data-part').split(' ') : [];
        Array.prototype.forEach.call(root.querySelectorAll('[data-term]'), function (t) {
          t.classList.toggle('is-hl', names.indexOf(t.getAttribute('data-term')) >= 0);
        });
      });
      stage.addEventListener('mouseleave', function () {
        Array.prototype.forEach.call(root.querySelectorAll('[data-term].is-hl'), function (t) { t.classList.remove('is-hl'); });
      });
      try {
        mount(root, api);
        slot.setAttribute('data-lab-state', 'ready');
      } catch (e) {
        labFallback(slot, e);
      }
    });
  }
```

Then extend the `XP` object literal by adding this line after `fitCanvases: fitCanvases, highlight: highlight, ...`:

```js
    ease: ease, mix: mix, tween: tween, planeMap: planeMap, gridSegments: gridSegments, plane: plane, lab: lab, labFallback: labFallback,
```

- [ ] **Step 4: Run the test to check that it passes**

Run: `node scripts/test_lab_core.js`

Expected: it prints `lab core: ok`.

- [ ] **Step 5: Wire it into `make test`**

In `Makefile`, add this line at the end of the `test` recipe, after `node scripts/test_interview_distributions.js`:

```make
	node scripts/test_lab_core.js
```

Run: `make test`

Expected: all tests pass, and the output ends with `lab core: ok`.

- [ ] **Step 6: Commit**

```bash
git add js/components/explainer-core.js scripts/test_lab_core.js Makefile
git commit -m "Add motion, coordinate planes and the explainer wrapper to the core"
```

---

### Task 2: The explainer slot, loader, styles and checks

With no explainer registered yet, this task changes nothing visible. The site must build and pass its existing checks unchanged, and every new check must run cleanly with 0 explainers.

**Files:**
- Create: `_data/module_labs.yml`, `js/components/lab-loader.js`, `css/labs.css`, `scripts/verify_labs.py` and `scripts/check_labs.py`
- Modify:
  - `_layouts/syllabus.html`, around lines 169 to 177 (the `syl-viz` div and the `lab_track` block);
  - `_includes/site-head.html`, line 36;
  - `_includes/site-scripts.html`, after the explainer-core line;
  - `scripts/check_chart_bounds.py`

**Interfaces:**
- Consumes:
  - `XP.labFallback(slot, err)` from Task 1;
  - `site.data.module_labs[track][index]`, which is a slug.
- Produces:
  - **Slot markup:** `<div class="lab-slot" data-lab="<track>/<slug>" data-lab-src="<url>">`, holding the include. It is followed by `<div class="syl-viz" data-lab-fallback hidden>`.
  - **`data-lab-state` on the slot:**
    - `loading` when the script is injected;
    - `ready` after the mount;
    - `failed` when the fallback shows.
  - **Include contract for every explainer:**
    - a root `<section class="xp lab" id="lab-<track>-<slug>">`;
    - inside it, `[data-stage]`, `[data-guide-box]`, `[data-ctl]` and `[data-say]`;
    - an optional `.lab-eq` holding `[data-term]` and `[data-val]` nodes.
  - **Control contract for the checks:**
    - the Reset button carries `data-reset`;
    - zoom buttons carry `data-zoom` and open `XP.dialog`;
    - context marks carry `is-faint`.
  - **`scripts/verify_labs.py`:**
    - `run(lab, calls)` returns the results of `[name, args]` calls into the explainer's exports;
    - `close(name, got, want, tol)`;
    - a `@check('<track>/<slug>')` decorator.

- [ ] **Step 1: Write the checks first**

Create `scripts/verify_labs.py`:

```python
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
```

Create `scripts/check_labs.py`:

```python
#!/usr/bin/env python3
"""Check every module explainer (js/labs/) in a real browser.

For each track page, at 1,400 px and at 390 px, it checks that:
  - explainers far down the page do not load until the reader nears them;
  - each explainer reaches data-lab-state="ready";
  - the guide opens on page 1, has 6 to 10 pages, and every page is reachable;
  - quick repeated clicks on Next leave no animation running and no error;
  - every visible control and every handle changes the picture;
  - handles are in the tab order, move with the arrow keys and relabel themselves;
  - handles take touch-action none, and the plane does not;
  - no text in an explainer reads NaN or Infinity;
  - under reduced motion, a guide page change finishes at once;
  - nothing scrolls sideways, and nothing logs an error;
  - text meets 4.5:1 and marks meet 3:1 against the stage, in both themes;
  - a script that fails to load shows the static diagram instead.

  PAGES_DISABLE_NETWORK=1 make build
  python3 -m http.server 4000 -d _site          # in another terminal
  python3 scripts/check_labs.py [track ...] [--base=http://localhost:4000]

Needs playwright with a Chrome channel. Exits non-zero if anything fails.
"""
import os
import sys

import yaml
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LABS = yaml.safe_load(open(os.path.join(ROOT, '_data', 'module_labs.yml'))) or {}
BASE = next((a.split('=', 1)[1] for a in sys.argv[1:] if a.startswith('--base=')), 'http://localhost:4000')
TRACKS = [a for a in sys.argv[1:] if not a.startswith('--')] or [t for t in LABS if LABS[t]]
problems = []


def fail(*parts):
    problems.append(' | '.join(str(p) for p in parts))
    print('FAIL', *parts)


# A fingerprint of everything a control can change inside one explainer.
SNAP = """(sel) => { const x = document.querySelector(sel); if (!x) return '';
  let s = '';
  x.querySelectorAll('svg').forEach(v => { s += v.innerHTML.length + ':' + v.innerHTML.slice(0, 4000); });
  x.querySelectorAll('canvas').forEach(c => { try { s += c.toDataURL().slice(-400); } catch (e) {} });
  x.querySelectorAll('[data-val], [aria-pressed], input, select').forEach(e => { s += '|' + (e.value || '') + (e.getAttribute('aria-pressed') || '') + e.textContent; });
  x.querySelectorAll('[data-say]').forEach(e => { s += '|' + e.textContent; });
  return s; }"""

BADTEXT = """(sel) => { const t = document.querySelector(sel).innerText; return /NaN|Infinity/.test(t) ? t.match(/.{0,30}(NaN|Infinity).{0,10}/)[0] : ''; }"""

CONTRAST = """(sel) => { const root = document.querySelector(sel);
  function rgb(s) {
    let m = s && s.match(/rgba?\\(([^)]+)\\)/);
    if (m) { const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]; }
    m = s && s.match(/color\\(srgb ([^)]+)\\)/);
    if (m) { const p = m[1].split(/[ \\/]+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p[3] === undefined ? 1 : p[3]]; }
    return null;
  }
  function lum(c) { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); }
  function over(fg, bg) { const a = fg[3]; return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1]; }
  function ratio(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  const bg = rgb(getComputedStyle(root).backgroundColor), out = [];
  root.querySelectorAll('svg text, .lab-eq, .lab-ctl label, .lab-note').forEach(el => {
    if (el.closest('.is-dim, .is-faint') || !el.getClientRects().length) return;
    const cs = getComputedStyle(el), c = rgb(el instanceof SVGElement ? cs.fill : cs.color);
    if (c && ratio(over(c, bg), bg) < 4.5) out.push('text "' + el.textContent.trim().slice(0, 20) + '" ' + ratio(over(c, bg), bg).toFixed(2));
  });
  root.querySelectorAll('.pl-vec, .pl-handle, .pl-mark').forEach(el => {
    if (el.closest('.is-dim, .is-faint') || !el.getClientRects().length) return;
    const cs = getComputedStyle(el);
    const c = rgb(el.classList.contains('pl-handle') ? cs.stroke : el.classList.contains('pl-vec') ? cs.color : (cs.stroke && cs.stroke !== 'none' ? cs.stroke : cs.fill));
    if (c && c[3] > 0 && ratio(over(c, bg), bg) < 3) out.push('mark ' + el.getAttribute('class') + ' ' + ratio(over(c, bg), bg).toFixed(2));
  });
  return out.slice(0, 6); }"""


def ready(pg, i):
    pg.evaluate(f"() => document.querySelectorAll('.lab-slot')[{i}].scrollIntoView({{block: 'center'}})")
    pg.wait_for_function(f"() => /ready|failed/.test(document.querySelectorAll('.lab-slot')[{i}].getAttribute('data-lab-state') || '')", timeout=8000)
    return pg.evaluate(f"() => document.querySelectorAll('.lab-slot')[{i}].getAttribute('data-lab-state')")


def guide_n(pg, sel):
    return pg.evaluate(f"() => (document.querySelector('{sel} .xp-guide-n') || {{}}).textContent || ''")


def sweep_controls(pg, sel, where, seen):
    ctl = pg.locator(f'{sel} :is(.lab-ctl, .lab-stage) :is(button, input, select)')
    n = ctl.count()
    idx = list(range(n))
    resets = [i for i in idx if ctl.nth(i).get_attribute('data-reset') is not None]
    for i in [i for i in idx if i not in resets] + resets:
        c = ctl.nth(i)
        if not c.is_visible() or c.is_disabled():
            continue
        label = c.evaluate("e => (e.getAttribute('aria-label') || e.getAttribute('data-k') || e.textContent || '').trim().slice(0, 40)")
        if label in seen:
            continue
        seen.add(label)
        before = pg.evaluate(SNAP, sel)
        tag = c.evaluate("e => e.tagName + ':' + (e.type || '')")
        if tag == 'INPUT:range':
            c.evaluate("e => { e.value = (+e.value === +e.max) ? e.min : e.max; e.dispatchEvent(new Event('input', {bubbles: true})); e.dispatchEvent(new Event('change', {bubbles: true})); }")
        elif tag.startswith('SELECT'):
            c.evaluate("e => { e.selectedIndex = (e.selectedIndex + 1) % e.options.length; e.dispatchEvent(new Event('change', {bubbles: true})); }")
        else:
            c.click()
        pg.wait_for_timeout(1000)
        if pg.evaluate("() => !!document.querySelector('dialog[open]')"):
            pg.keyboard.press('Escape')
            pg.wait_for_timeout(150)
            continue
        if pg.evaluate(SNAP, sel) == before:
            fail(where, 'control did nothing', label)
        bad = pg.evaluate(BADTEXT, sel)
        if bad:
            fail(where, 'shows', bad, 'after', label)


def sweep_handles(pg, sel, where):
    hs = pg.locator(f'{sel} .pl-handle')
    for j in range(hs.count()):
        h = hs.nth(j)
        if not h.is_visible():
            continue
        if h.get_attribute('tabindex') != '0':
            fail(where, 'handle not in the tab order', j)
        if h.evaluate("e => getComputedStyle(e).touchAction") != 'none':
            fail(where, 'handle lets touch scroll the page', j)
        h.focus()
        before, label = pg.evaluate(SNAP, sel), h.get_attribute('aria-label')
        for _ in range(3):
            pg.keyboard.press('ArrowRight')
        pg.wait_for_timeout(120)
        if pg.evaluate(SNAP, sel) == before or h.get_attribute('aria-label') == label:
            for _ in range(6):
                pg.keyboard.press('ArrowLeft')
            pg.wait_for_timeout(120)
            if pg.evaluate(SNAP, sel) == before or h.get_attribute('aria-label') == label:
                fail(where, 'handle did not move with the arrow keys', label)
        bad = pg.evaluate(BADTEXT, sel)
        if bad:
            fail(where, 'shows', bad, 'after moving', label)


def check_page(b, track, width):
    pg = b.new_page(viewport={'width': width, 'height': 900})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto(f'{BASE}/{track}/', wait_until='load')
    pg.wait_for_timeout(600)
    # Lazy loading: a slot more than 3 screens down must not have started.
    early = pg.evaluate("""() => [...document.querySelectorAll('.lab-slot')].filter(s =>
        s.getBoundingClientRect().top > 3 * innerHeight && s.hasAttribute('data-lab-state')).length""")
    if early:
        fail(track, width, f'{early} explainers loaded before the reader reached them')
    n = pg.evaluate("() => document.querySelectorAll('.lab-slot').length")
    for i in range(n):
        lab = pg.evaluate(f"() => document.querySelectorAll('.lab-slot')[{i}].getAttribute('data-lab')")
        where = f'{track} {width} {lab}'
        if ready(pg, i) != 'ready':
            fail(where, 'did not mount')
            continue
        sel = f'.lab-slot[data-lab="{lab}"] .lab'
        g = guide_n(pg, sel)
        total = int(g.split('/')[1]) if '/' in g else 0
        if not g.startswith('1 /'):
            fail(where, 'guide opens on', g)
        if not 6 <= total <= 10:
            fail(where, 'guide has', total, 'pages')
        seen = set()
        sweep_controls(pg, sel, where, seen)
        sweep_handles(pg, sel, where)
        # Every page reachable, then 3 quick clicks leave nothing running.
        nxt = pg.locator(f'{sel} [data-guide="1"]')
        prv = pg.locator(f'{sel} [data-guide="-1"]')
        while not nxt.is_disabled():
            nxt.click()
        if guide_n(pg, sel) != f'{total} / {total}':
            fail(where, 'last guide page unreachable', guide_n(pg, sel))
        sweep_controls(pg, sel, where, seen)
        sweep_handles(pg, sel, where)
        while not prv.is_disabled():
            prv.click()
        for _ in range(3):
            nxt.click()
        pg.wait_for_timeout(1000)
        if guide_n(pg, sel) != f'4 / {total}':
            fail(where, 'rapid clicks landed on', guide_n(pg, sel))
        if pg.evaluate(f"() => document.querySelector('{sel}').hasAttribute('data-anim')"):
            fail(where, 'an animation is still running after rapid clicks')
        while not prv.is_disabled():
            prv.click()
        for theme in ('dark', 'light'):
            pg.evaluate(f"() => document.documentElement.setAttribute('data-theme', '{theme}')")
            pg.wait_for_timeout(100)
            for c in pg.evaluate(CONTRAST, sel):
                fail(where, theme, 'contrast', c)
        wide = pg.evaluate(f"() => {{ const r = document.querySelector('{sel}'); return r.scrollWidth - r.clientWidth; }}")
        if wide > 1:
            fail(where, f'scrolls sideways inside by {wide}px')
    if pg.evaluate('() => document.documentElement.scrollWidth') > width:
        fail(track, width, 'page scrolls sideways')
    for e in errs:
        fail(track, width, 'error', e[:160])
    pg.close()


def check_reduced(b, track):
    ctx = b.new_context(reduced_motion='reduce', viewport={'width': 1400, 'height': 900})
    pg = ctx.new_page()
    pg.goto(f'{BASE}/{track}/', wait_until='load')
    for i in range(pg.evaluate("() => document.querySelectorAll('.lab-slot').length")):
        lab = pg.evaluate(f"() => document.querySelectorAll('.lab-slot')[{i}].getAttribute('data-lab')")
        if ready(pg, i) != 'ready':
            continue
        sel = f'.lab-slot[data-lab="{lab}"] .lab'
        pg.locator(f'{sel} [data-guide="1"]').click()
        if pg.evaluate(f"() => document.querySelector('{sel}').hasAttribute('data-anim')"):
            fail(track, lab, 'animates under reduced motion')
    ctx.close()


def check_fallback(b, track):
    first = LABS[track][sorted(LABS[track], key=int)[0]]
    pg = b.new_page(viewport={'width': 1400, 'height': 900})
    pg.route(f'**/js/labs/{track}/{first}.js*', lambda r: r.abort())
    pg.goto(f'{BASE}/{track}/', wait_until='load')
    i = pg.evaluate(f"() => [...document.querySelectorAll('.lab-slot')].findIndex(s => s.getAttribute('data-lab') === '{track}/{first}')")
    if ready(pg, i) != 'failed':
        fail(track, first, 'a failed script did not show the fallback')
    else:
        ok = pg.evaluate(f"""() => {{ const s = document.querySelectorAll('.lab-slot')[{i}], fb = s.nextElementSibling;
            return !!fb && !fb.hidden && fb.children.length > 0 && !!s.querySelector('.lab-fail'); }}""")
        if not ok:
            fail(track, first, 'fallback diagram is missing or empty')
    pg.close()


with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome')
    for track in TRACKS:
        for width in (1400, 390):
            check_page(b, track, width)
        check_reduced(b, track)
        check_fallback(b, track)
    b.close()
print(f'{len(TRACKS)} tracks checked,', len(problems), 'problems')
sys.exit(1 if problems else 0)
```

- [ ] **Step 2: Run the checks to confirm they run cleanly with nothing registered**

Run: `../venv/bin/python scripts/verify_labs.py`

Expected: it prints `0 checks passed`.

Running `check_labs.py` needs `_data/module_labs.yml`, which Step 3 creates.

- [ ] **Step 3: Create the registry and the loader**

Create `_data/module_labs.yml`:

```yaml
# Module explainers: track id, then zero-based module index, then slug.
# Each slug has _includes/labs/<track>/<slug>.html and js/labs/<track>/<slug>.js.
# See docs/interview.md, "Module explainers".
linear-algebra: {}
```

Create `js/components/lab-loader.js`:

```js
/* ════════════════════════════════════════════════════════
   Loads each module explainer's script (js/labs/<track>/<slug>.js) when its
   module comes within 1 screen of the viewport, so a track page only fetches
   the explainers a reader reaches. A script that fails to load, or loads
   without mounting, shows the module's static diagram instead.
   ════════════════════════════════════════════════════════ */
(function () {
  var slots = document.querySelectorAll('.lab-slot[data-lab-src]');
  if (!slots.length) return;
  if (!window.XP) {
    Array.prototype.forEach.call(slots, function (slot) {
      var fb = slot.nextElementSibling;
      if (fb && fb.hasAttribute('data-lab-fallback')) fb.hidden = false;
    });
    return;
  }
  function load(slot) {
    if (slot.hasAttribute('data-lab-state')) return;
    slot.setAttribute('data-lab-state', 'loading');
    var s = document.createElement('script');
    s.src = slot.getAttribute('data-lab-src');
    s.onerror = function () { XP.labFallback(slot, new Error('did not load: ' + s.src)); };
    s.onload = function () {
      if (slot.getAttribute('data-lab-state') === 'loading') XP.labFallback(slot, new Error('loaded without mounting: ' + s.src));
    };
    document.head.appendChild(s);
  }
  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(slots, load);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { io.unobserve(e.target); load(e.target); }
    });
  }, { rootMargin: '100% 0px' });
  Array.prototype.forEach.call(slots, function (slot) { io.observe(slot); });
})();
```

- [ ] **Step 4: Add the slot to the layout**

In `_layouts/syllabus.html`, replace this block:

```liquid
      <div class="syl-viz"></div>

      {% assign lab_track = site.data.interview_distributions[topic.id] %}
      {% assign module_key = forloop.index0 | append: '' %}
      {% assign lab = lab_track[module_key] %}
```

with:

```liquid
      {% assign module_key = forloop.index0 | append: '' %}
      {% assign lab_slug = site.data.module_labs[topic.id][module_key] %}
      {% if lab_slug %}
      {% capture lab_src %}/js/labs/{{ topic.id }}/{{ lab_slug }}.js{% endcapture %}
      {% capture lab_include %}labs/{{ topic.id }}/{{ lab_slug }}.html{% endcapture %}
      <div class="lab-slot" data-lab="{{ topic.id }}/{{ lab_slug }}" data-lab-src="{% include asset.html path=lab_src %}">
        {% include {{ lab_include }} %}
      </div>
      <div class="syl-viz" data-lab-fallback hidden></div>
      {% else %}
      <div class="syl-viz"></div>
      {% endif %}

      {% assign lab_track = site.data.interview_distributions[topic.id] %}
      {% assign lab = lab_track[module_key] %}
```

- [ ] **Step 5: Load the styles and the loader on tracks that have explainers**

In `_includes/site-head.html`, add this after the `explainer.css` line (line 36):

```liquid
{% if page.topic_id and site.data.module_labs[page.topic_id] %}<link rel="stylesheet" href="{% include asset.html path='/css/labs.css' %}">{% endif %}
```

In `_includes/site-scripts.html`, add this after the `explainer-core.js` line:

```liquid
{% if page.topic_id and site.data.module_labs[page.topic_id] %}<script src="{% include asset.html path='/js/components/lab-loader.js' %}" defer></script>{% endif %}
```

- [ ] **Step 6: Create the shared styles**

Create `css/labs.css`:

```css
/* ════════════════════════════════════════════════════════
   Module explainers (js/labs/). Shared layout and plane styles first, then
   one section per track. Colours come from the .xp tokens in explainer.css:
   --xp-q and --xp-k for the 2 inputs, --xp-o for the result, --xp-v for
   data, --tf-up and --tf-down for sign. See docs/interview.md.
   ════════════════════════════════════════════════════════ */

.lab-slot { margin: 1.2rem 0 1.8rem; }
.lab-slot .xp.lab { margin: 0; }
.lab { position: relative; container-type: inline-size; }
.lab-head h3 { margin: 0.2rem 0 0.7rem; font: 650 var(--fs-md) / 1.3 "Space Grotesk", sans-serif; }

.lab-eq { margin: 0 0 0.9rem; overflow-x: auto; font: 500 var(--fs-md) / 1.6 "STIX Two Text", "Cambria", Georgia, serif; }
.lab-eq i { font-style: italic; }
.lab-term { padding: 0 0.12em; border-radius: 3px; transition: background 0.15s ease; }
.lab-term.is-q { color: var(--xp-q); } .lab-term.is-k { color: var(--xp-k); }
.lab-term.is-v { color: var(--xp-v); } .lab-term.is-o { color: var(--xp-o); }
.lab-term.is-hl { background: var(--xp-soft); outline: 1px solid currentColor; }
.lab-eq [data-val] { font-family: var(--xp-mono); font-size: 0.85em; }

.lab-main { display: grid; gap: 0.9rem; min-width: 0; }
@container (min-width: 44rem) { .lab-main { grid-template-columns: minmax(0, 1fr) 16rem; align-items: start; } }
.lab-stage { position: relative; min-width: 0; }
.lab .xp-guide { position: static; width: auto; }
.lab .xp-guide-open { position: static; display: block; margin: 0 0 0 auto; }
.lab .xp-guide-b b.is-o { color: var(--xp-o); }
.lab-note { margin: 0.5rem 0 0; font-size: var(--fs-xs); color: var(--text); }

.lab-ctl { display: flex; flex-wrap: wrap; gap: 0.5rem 0.9rem; align-items: center; margin-top: 0.9rem; font-size: var(--fs-xs); }
.lab-ctl label { display: inline-flex; gap: 0.4rem; align-items: center; color: var(--text); }
.lab-ctl input[type="range"] { width: min(9rem, 36vw); accent-color: var(--accent); }
.lab-ctl select { max-width: 100%; font: inherit; color: var(--text); background: var(--bg); border: 1px solid var(--border-ui); border-radius: var(--radius-sm); padding: 0.25rem 0.4rem; }
.lab-ctl button { padding: 0.35rem 0.8rem; font: 600 var(--fs-xs) inherit; color: var(--text); background: var(--bg); border: 1px solid var(--border-ui); border-radius: 999px; cursor: pointer; }
.lab-ctl button[aria-pressed="true"] { color: var(--bg); background: var(--accent); border-color: var(--accent); }
.lab-ctl button:disabled { opacity: 0.45; cursor: default; }
.lab-say { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.lab-src { margin: 0.9rem 0 0; font-size: var(--fs-2xs); color: var(--muted); }
.lab-fail { margin: 0.4rem 0; font-size: var(--fs-xs); color: var(--muted); }
.lab-table { min-width: 0; }
.lab-table td, .lab-table th { padding: 0.3rem 0.5rem; text-align: left; font-family: var(--xp-mono); }

/* The plane (XP.plane) */
.lab-plane { display: block; width: 100%; height: auto; touch-action: pan-y; }
.lab-plane .pl-grid polyline { fill: none; stroke: var(--line); stroke-width: 1; }
.lab-plane .pl-grid .pl-moved polyline { stroke: color-mix(in srgb, var(--xp-q) 55%, transparent); stroke-width: 1.2; }
.lab-plane .pl-axis { stroke: var(--muted); stroke-width: 1.4; }
.lab-plane .pl-vec { color: var(--text); }
.lab-plane .pl-vec line { stroke: currentColor; stroke-width: 3; stroke-linecap: round; }
.lab-plane .pl-vec polygon, .lab-plane .pl-vec circle { fill: currentColor; }
.lab-plane .is-q { color: var(--xp-q); } .lab-plane .is-k { color: var(--xp-k); }
.lab-plane .is-v { color: var(--xp-v); } .lab-plane .is-o { color: var(--xp-o); }
.lab-plane .is-faint { opacity: 0.35; }
.lab-plane .pl-handle { fill: var(--bg); stroke: currentColor; stroke-width: 3; cursor: grab; touch-action: none; }
.lab-plane .pl-handle.is-drag { cursor: grabbing; }
.lab-plane .pl-handle:focus { outline: none; }
.lab-plane .pl-handle:focus-visible { stroke: var(--accent); stroke-width: 5; }
.lab-plane text { font: 600 13px var(--xp-mono); fill: var(--text); }
.lab-plane .is-dim { opacity: 0.18; }
.lab-plane .pl-dash { fill: none; stroke: currentColor; stroke-width: 1.6; stroke-dasharray: 5 4; }
```

- [ ] **Step 7: Teach the bounds check to load explainers and sweep their handles**

In `scripts/check_chart_bounds.py`, make these 4 changes.

**1. Load the explainers first.** Immediately after the line `pg.goto(f'{BASE}/{t}/', wait_until='load'); pg.wait_for_timeout(1200)`, insert:

```python
        # Module explainers load lazily: bring each into view and wait for it.
        for i in range(pg.evaluate("() => document.querySelectorAll('.lab-slot').length")):
            pg.evaluate(f"() => document.querySelectorAll('.lab-slot')[{i}].scrollIntoView({{block: 'center'}})")
            pg.wait_for_function(f"() => /ready|failed/.test(document.querySelectorAll('.lab-slot')[{i}].getAttribute('data-lab-state') || '')", timeout=8000)
```

**2. Collect explainers with handles as well as sliders.** Replace the `groups = pg.evaluate(...)` call with:

```python
        groups = pg.evaluate("""() => {
          const out = []; let n = 0;
          document.querySelectorAll('.ivmp-play, .an-host, .ivd-lab, .lab').forEach(g => {
            const r = g.querySelectorAll('input[type=range]'), h = g.querySelectorAll('.pl-handle');
            if (!r.length && !h.length) return;
            g.setAttribute('data-chk', ++n); out.push([n, r.length, g.className.split(' ')[0], h.length]); });
          return out; }""")
```

**3. Unpack the handle count.** Change the loop header to:

```python
        for gid, nknobs, kind, nhandles in groups:
```

**4. Sweep the handles.** After the existing `for which, end in settings:` loop, still inside the group loop, add:

```python
            # Push every handle to each edge with the keyboard.
            for j in range(nhandles):
                h = pg.locator(f'{root} .pl-handle').nth(j)
                if not h.is_visible():
                    continue
                for key in ('ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'):
                    h.focus()
                    for _ in range(60):
                        pg.keyboard.press('Shift+' + key)
                    pg.wait_for_timeout(60)
                    bad = pg.evaluate(f"() => ({CHECK})(document.querySelector('{root}'))")
                    if bad:
                        problems += 1
                        print(f'{t} | {kind} | handle {j} {key} |', '; '.join(bad))
                        break
```

Update the docstring's first paragraph so it mentions the module explainers as well as the playgrounds, the animations and the distribution labs.

- [ ] **Step 8: Build, then confirm nothing changed for readers**

Run:

```bash
PAGES_DISABLE_NETWORK=1 make build && make check
(python3 -m http.server 4000 -d _site >/dev/null 2>&1 &) ; (python3 -m http.server 4011 -d _site >/dev/null 2>&1 &) ; sleep 1
../venv/bin/python scripts/check_labs.py
../venv/bin/python scripts/check_chart_bounds.py _data/interview.yml
../venv/bin/python ../harness.py _data/interview.yml
```

Expected:
- The build succeeds, and `make check` reports 0 flags.
- `check_labs.py` prints `0 tracks checked, 0 problems`, because the only track entry is empty.
- The bounds check prints no overflowing chart.
- The harness ends with `pages with problems: 0`. The harness reads port 4011, which is why 2 servers are started.

- [ ] **Step 9: Commit**

```bash
git add _data/module_labs.yml js/components/lab-loader.js css/labs.css _layouts/syllabus.html \
  _includes/site-head.html _includes/site-scripts.html scripts/verify_labs.py scripts/check_labs.py \
  scripts/check_chart_bounds.py
git commit -m "Add the module explainer slot, lazy loader, styles and checks"
```

---
