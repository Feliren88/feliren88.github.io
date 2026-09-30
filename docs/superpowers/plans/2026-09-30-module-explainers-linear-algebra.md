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

**Sliders**
- A slider exists only for a quantity with no handle and no other control. Anything with a natural handle is dragged.
- An equation playground whose controls repeat its module's explainer is removed in that explainer's task. Its live equation stays, fed by the explainer.

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

# A module that teaches NaN and Infinity (Mathematics 2 and 9) marks its root data-teaches-nan.
BADTEXT = """(sel) => { const r = document.querySelector(sel); if (r.hasAttribute('data-teaches-nan')) return '';
  const t = r.innerText; return /NaN|Infinity/.test(t) ? t.match(/.{0,30}(NaN|Infinity).{0,10}/)[0] : ''; }"""

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
        # A replay may end where it started, so also look mid-animation.
        pg.wait_for_timeout(150)
        mid = pg.evaluate(SNAP, sel)
        pg.wait_for_timeout(850)
        if pg.evaluate("() => !!document.querySelector('dialog[open]')"):
            pg.keyboard.press('Escape')
            pg.wait_for_timeout(150)
            continue
        if mid == before and pg.evaluate(SNAP, sel) == before:
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
        label, moved = h.get_attribute('aria-label'), False
        # A handle may be locked to 1 axis or sit at an edge, so try each direction.
        for key in ('ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown'):
            h.focus()
            before = pg.evaluate(SNAP, sel)
            for _ in range(3):
                pg.keyboard.press(key)
            pg.wait_for_timeout(120)
            if pg.evaluate(SNAP, sel) != before and h.get_attribute('aria-label') != label:
                moved = True
                break
        if not moved:
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

### Task 3: Linear Algebra 1, vectors and spaces

**Files:**
- Create: `js/labs/linear-algebra/vectors-and-spaces.js` and `_includes/labs/linear-algebra/vectors-and-spaces.html`
- Modify:
  - `scripts/verify_labs.py`, adding a check under the Linear Algebra heading;
  - `_data/module_labs.yml`;
  - `css/labs.css`, adding a Linear Algebra section at the end.

**Interfaces:**
- Consumes: `XP.lab`, `XP.plane`, `XP.guide`, `XP.dialog`, `XP.fmt` and `XP.svgEl` from Task 1; the slot and checks from Task 2.
- Produces:
  - Exports: `combo(c1, c2, v1, v2)`, `det2(v1, v2)`, `dot(u, v)`, `norm(v)`, `rank2(v1, v2) -> 0|1|2`, `coords(p, v1, v2) -> [c1, c2] | null`, `angle(u, v) -> radians | null`, `proj(u, v) -> [x, y] | null`, `cross3(a, b)`, `rank3(a, b)`, `project3(p, yaw, pitch) -> [x, y]`.
  - The lab id `linear-algebra/vectors-and-spaces`.
  - The CSS classes `.pl-line`, `.pl-trail`, `.pl-span`, `.pl-span-line`, `.pl-span-dot` and `.pl-plane3`, which later tasks reuse.
  - There are no c₁ and c₂ sliders. The reader drags the combination's tip, and `coords` solves for c₁ and c₂. The tip handle hides while v₁ and v₂ share a line, because c₁ and c₂ are then not unique.

- [ ] **Step 1: Write the failing maths check**

In `scripts/verify_labs.py`, below the comment `# One check per explainer is added by the tasks that build them.`, add:

```python
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
```

- [ ] **Step 2: Run it to check that it fails**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/vectors-and-spaces`

Expected: it fails with `Cannot find module '.../js/labs/linear-algebra/vectors-and-spaces.js'`.

- [ ] **Step 3: Write the pure maths**

Create `js/labs/linear-algebra/vectors-and-spaces.js`:

```js
/* ════════════════════════════════════════════════════════
   Linear Algebra, module 1: vectors and spaces.
   2 arrows, their combinations and their span, coordinates in 2 bases, the
   dot product as a shadow, and a plane spanned by 2 arrows in 3D. The pure
   maths is exported for scripts/verify_labs.py.
   ════════════════════════════════════════════════════════ */
(function () {

  function combo(c1, c2, v1, v2) { return [c1 * v1[0] + c2 * v2[0], c1 * v1[1] + c2 * v2[1]]; }
  function det2(v1, v2) { return v1[0] * v2[1] - v1[1] * v2[0]; }
  function dot(u, v) { return u[0] * v[0] + u[1] * v[1]; }
  function norm(v) { return Math.sqrt(dot(v, v)); }

  /* Rank of the pair: 2 if they point different ways, 1 if they share a
     line, 0 if both are 0. The tolerance scales with their size. */
  function rank2(v1, v2) {
    var s = dot(v1, v1) + dot(v2, v2);
    if (s < 1e-18) return 0;
    return Math.abs(det2(v1, v2)) <= 1e-9 * s ? 1 : 2;
  }

  /* Coordinates of p in the basis v1, v2, by Cramer's rule, or null when
     v1 and v2 are no basis. */
  function coords(p, v1, v2) {
    if (rank2(v1, v2) < 2) return null;
    var d = det2(v1, v2);
    return [det2(p, v2) / d, det2(v1, p) / d];
  }

  function angle(u, v) {
    var nu = norm(u), nv = norm(v);
    if (nu < 1e-12 || nv < 1e-12) return null;
    return Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (nu * nv))));
  }

  /* The shadow of u on the line through v, or null when v is 0. */
  function proj(u, v) {
    var vv = dot(v, v);
    if (vv < 1e-18) return null;
    var k = dot(u, v) / vv;
    return [k * v[0], k * v[1]];
  }

  function cross3(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function rank3(a, b) {
    var s = a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + b[0] * b[0] + b[1] * b[1] + b[2] * b[2];
    if (s < 1e-18) return 0;
    var c = cross3(a, b);
    return Math.sqrt(c[0] * c[0] + c[1] * c[1] + c[2] * c[2]) <= 1e-9 * s ? 1 : 2;
  }

  /* An orthographic view with z up: turn by `yaw` about z, then tilt by
     `pitch` towards the viewer. Returns [x, y] on screen, y up. */
  function project3(p, yaw, pitch) {
    var cy = Math.cos(yaw), sy = Math.sin(yaw), x = cy * p[0] + sy * p[1], d = -sy * p[0] + cy * p[1];
    return [x, Math.cos(pitch) * p[2] - Math.sin(pitch) * d];
  }

  var M = { combo: combo, det2: det2, dot: dot, norm: norm, rank2: rank2, coords: coords, angle: angle,
    proj: proj, cross3: cross3, rank3: rank3, project3: project3 };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  /* MOUNT */
})();
```

- [ ] **Step 4: Run the check to confirm that it passes**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/vectors-and-spaces`

Expected: it prints `ok linear-algebra/vectors-and-spaces` and `1 checks passed`.

- [ ] **Step 5: Write the include**

Create `_includes/labs/linear-algebra/vectors-and-spaces.html`:

```html
<section class="xp lab" id="lab-linear-algebra-vectors-and-spaces" aria-labelledby="lab-la-vectors-t">
  <header class="lab-head">
    <span class="syl-phase">Explore it</span>
    <h3 id="lab-la-vectors-t">Add, stretch and span 2 arrows</h3>
  </header>
  <p class="lab-eq"><span class="lab-term is-q" data-term="v1"><i>c</i>₁<b>v</b>₁</span> + <span class="lab-term is-k" data-term="v2"><i>c</i>₂<b>v</b>₂</span> = <span class="lab-term is-o" data-term="sum">(<span data-val="sx">1.00</span>, <span data-val="sy">2.50</span>)</span>, with <i>c</i>₁ = <span data-val="c1">1.00</span> and <i>c</i>₂ = <span data-val="c2">1.00</span></p>
  <div class="lab-main">
    <div class="lab-stage" data-stage></div>
    <div data-guide-box></div>
  </div>
  <div class="lab-ctl" data-ctl></div>
  <p class="lab-say" aria-live="polite" data-say></p>
</section>
```

- [ ] **Step 6: Write the explainer**

In `js/labs/linear-algebra/vectors-and-spaces.js`, replace the line `  /* MOUNT */` with:

```js
  XP.lab('linear-algebra/vectors-and-spaces', function (root, api) {
    var fmt = XP.fmt, svgEl = XP.svgEl, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var START = { v1: [2, 1], v2: [-1, 1.5], c1: 1, c2: 1, u: [1, 2], paint: false, basis: false, showU: false, mode: '2d', yaw: 0.6, pitch: 0.5 };
    var s = JSON.parse(JSON.stringify(START)), trail = [];
    var A3 = [2, 0.5, 1], B3 = [0.5, 2, 1];
    var P = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'The arrows v1 and v2, their combination, and the points they span' });
    var P3 = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: '2 arrows in 3 dimensions and the plane they span' });
    var dlg = XP.dialog(root);

    ctl.innerHTML =
      '<label hidden>turn <input type="range" data-k="yaw" min="-3.1" max="3.1" step="0.02" aria-label="Turn the 3D view"></label>' +
      '<label hidden>tilt <input type="range" data-k="pitch" min="-1.2" max="1.2" step="0.02" aria-label="Tilt the 3D view"></label>' +
      '<button type="button" data-act="paint">Paint the span</button>' +
      '<button type="button" data-act="basis" aria-pressed="false">Basis grid</button>' +
      '<button type="button" data-act="u" aria-pressed="false">Show u</button>' +
      '<button type="button" data-act="3d" aria-pressed="false">3D view</button>' +
      '<button type="button" data-zoom="coords">Coordinates, worked</button>' +
      '<button type="button" data-zoom="dot">Dot product, worked</button>' +
      '<button type="button" data-reset>Reset</button>';
    var sl = {};
    Array.prototype.forEach.call(ctl.querySelectorAll('[data-k]'), function (el) { sl[el.getAttribute('data-k')] = el; });

    var hv1 = P.handle({ x: s.v1[0], y: s.v1[1], label: 'Tip of v1', cls: 'is-q', part: 'v1',
      onMove: function (x, y, done) { s.v1 = [x, y]; trail = []; draw(); if (done) report(); } });
    var hv2 = P.handle({ x: s.v2[0], y: s.v2[1], label: 'Tip of v2', cls: 'is-k', part: 'v2',
      onMove: function (x, y, done) { s.v2 = [x, y]; trail = []; draw(); if (done) report(); } });
    var hu = P.handle({ x: s.u[0], y: s.u[1], label: 'Tip of u', cls: 'is-v', part: 'u',
      onMove: function (x, y, done) { s.u = [x, y]; draw(); if (done) report(); } });
    /* The combination's tip: drag it and c1, c2 are solved for, so no slider is needed. */
    var hs = P.handle({ x: 1, y: 2.5, label: 'Tip of c1 v1 + c2 v2', cls: 'is-o', part: 'sum',
      onMove: function (x, y, done) {
        var c = coords([x, y], s.v1, s.v2);
        if (c) { s.c1 = c[0]; s.c2 = c[1]; trail = []; }
        draw(); if (done) report();
      } });

    function line(d, cls, part) {
      var k = 12 / norm(d);
      return svgEl('line', { x1: P.map.sx(-k * d[0]), y1: P.map.sy(-k * d[1]), x2: P.map.sx(k * d[0]), y2: P.map.sy(k * d[1]), 'class': cls, 'data-part': part });
    }
    function spanMarkup(r) {
      if (r === 2) return svgEl('rect', { x: 0, y: 0, width: P.w, height: P.h, 'class': 'pl-span', 'data-part': 'span' });
      if (r === 0) return P.dot(0, 0, 6, 'pl-span-dot', 'span');
      return line(norm(s.v1) > 1e-9 ? s.v1 : s.v2, 'pl-span-line', 'span');
    }

    function draw() {
      var three = s.mode === '3d';
      P.svg.style.display = three ? 'none' : '';
      P3.svg.style.display = three ? '' : 'none';
      sl.yaw.parentNode.hidden = sl.pitch.parentNode.hidden = !three;
      var r = rank2(s.v1, s.v2), a = [s.c1 * s.v1[0], s.c1 * s.v1[1]], sum = combo(s.c1, s.c2, s.v1, s.v2);
      api.values({ sx: sum[0], sy: sum[1], c1: s.c1, c2: s.c2 });
      hs.set(sum[0], sum[1]);
      hs.show(!three && r === 2);
      if (three) { draw3(); return; }
      var g = P.gridMarkup(null, 1, 'pl-std') + P.axes();
      if (s.basis && r === 2) g += P.gridMarkup([s.v1[0], s.v2[0], s.v1[1], s.v2[1]], 1, 'pl-moved');
      P.grid.innerHTML = g;
      var h = s.paint ? spanMarkup(r) : '';
      h += trail.map(function (q) { return P.dot(q[0], q[1], 2.2, 'pl-trail'); }).join('');
      h += P.arrow(0, 0, s.v1[0], s.v1[1], 'is-q is-faint', 'v1') + P.arrow(0, 0, s.v2[0], s.v2[1], 'is-k is-faint', 'v2');
      h += P.arrow(0, 0, a[0], a[1], 'is-q', 'v1') + P.arrow(a[0], a[1], sum[0], sum[1], 'is-k', 'v2');
      h += P.arrow(0, 0, sum[0], sum[1], 'is-o', 'sum');
      if (s.showU) {
        var pr = proj(s.u, s.v1);
        if (pr) {
          h += line(s.v1, 'pl-line is-q is-faint');
          h += svgEl('line', { x1: P.map.sx(s.u[0]), y1: P.map.sy(s.u[1]), x2: P.map.sx(pr[0]), y2: P.map.sy(pr[1]), 'class': 'pl-dash is-o', 'data-part': 'shadow' });
          h += P.arrow(0, 0, pr[0], pr[1], 'is-o', 'shadow');
        }
        h += P.arrow(0, 0, s.u[0], s.u[1], 'is-v', 'u');
      }
      P.plot.innerHTML = h;
    }

    function draw3() {
      function sp(p) { return project3(p, s.yaw, s.pitch); }
      function at(c1, c2) { return [c1 * A3[0] + c2 * B3[0], c1 * A3[1] + c2 * B3[1], c1 * A3[2] + c2 * B3[2]]; }
      var corners = [[-1.1, -1.1], [1.1, -1.1], [1.1, 1.1], [-1.1, 1.1]].map(function (c) { return sp(at(c[0], c[1])); });
      var h = '<polygon class="pl-plane3" data-part="plane3" points="' + P3.pts(corners) + '"/>';
      [[3, 0, 0], [0, 3, 0], [0, 0, 3]].forEach(function (e) { var q = sp(e); h += P3.arrow(0, 0, q[0], q[1], 'is-faint'); });
      var a = sp(A3), b = sp(B3);
      h += P3.arrow(0, 0, a[0], a[1], 'is-q', 'a3') + P3.arrow(0, 0, b[0], b[1], 'is-k', 'b3');
      P3.plot.innerHTML = h;
    }

    function press(act, on) { ctl.querySelector('[data-act="' + act + '"]').setAttribute('aria-pressed', on ? 'true' : 'false'); }
    function sync() {
      hv1.set(s.v1[0], s.v1[1]); hv2.set(s.v2[0], s.v2[1]); hu.set(s.u[0], s.u[1]);
      hv1.show(s.mode === '2d'); hv2.show(s.mode === '2d'); hu.show(s.mode === '2d' && s.showU);
      sl.yaw.value = s.yaw; sl.pitch.value = s.pitch;
      press('basis', s.basis); press('u', s.showU); press('3d', s.mode === '3d');
    }
    function report() {
      if (s.mode === '3d') {
        api.say('The 2 arrows in 3D ' + (rank3(A3, B3) === 2 ? 'point different ways, so they span a plane through the origin.' : 'share a line.'));
        return;
      }
      var r = rank2(s.v1, s.v2), sum = combo(s.c1, s.c2, s.v1, s.v2);
      var span = r === 2 ? 'They point different ways, so they span the whole plane.' :
        r === 1 ? 'They lie on 1 line, so they span only that line.' : 'Both are 0, so they span only the origin.';
      api.say('v1 is (' + fmt(s.v1[0], 1) + ', ' + fmt(s.v1[1], 1) + ') and v2 is (' + fmt(s.v2[0], 1) + ', ' + fmt(s.v2[1], 1) + '). ' +
        span + ' The combination lands at (' + fmt(sum[0]) + ', ' + fmt(sum[1]) + ').');
    }

    /* Move to a guide page's state: arrows and stretches glide, switches flip at once. */
    function goTo(target) {
      var keys = ['v1', 'v2', 'c1', 'c2', 'u'], from = {}, to = {};
      keys.forEach(function (k) { from[k] = s[k]; to[k] = k in target ? target[k] : s[k]; });
      ['paint', 'basis', 'showU', 'mode'].forEach(function (k) { if (k in target) s[k] = target[k]; });
      if (!s.paint) trail = [];
      api.animate(from, to, 700, function (st) {
        keys.forEach(function (k) { s[k] = st[k]; });
        sync(); draw();
      }, report);
    }

    /* Sweep many stretches and leave a dot at each tip. */
    function paint() {
      trail = []; s.paint = false; s.mode = '2d';
      api.animate({ f: 0 }, { f: 1 }, 1600, function (st) {
        var n = Math.round(st.f * 180);
        while (trail.length < n) {
          var i = trail.length;
          trail.push(combo(3.2 * Math.sin(i * 0.37), 3.2 * Math.cos(i * 0.23), s.v1, s.v2));
        }
        if (st.f >= 1) s.paint = true;
        sync(); draw();
      }, report);
    }

    function table(rows) {
      return '<table class="xp-table lab-table"><tbody>' + rows.map(function (r) {
        return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>';
      }).join('') + '</tbody></table>';
    }
    function zoomCoords(btn) {
      var p = combo(s.c1, s.c2, s.v1, s.v2), d = det2(s.v1, s.v2), c = coords(p, s.v1, s.v2);
      var rows = [
        ['The point (X, Y) on the square grid', '(' + fmt(p[0]) + ', ' + fmt(p[1]) + ')'],
        ['det = x₁ y₂ − y₁ x₂', fmt(s.v1[0]) + ' × ' + fmt(s.v2[1]) + ' − ' + fmt(s.v1[1]) + ' × ' + fmt(s.v2[0]) + ' = ' + fmt(d)]
      ];
      if (c) {
        rows.push(['c₁ = (X y₂ − Y x₂) ÷ det', '(' + fmt(p[0]) + ' × ' + fmt(s.v2[1]) + ' − ' + fmt(p[1]) + ' × ' + fmt(s.v2[0]) + ') ÷ ' + fmt(d) + ' = ' + fmt(c[0])]);
        rows.push(['c₂ = (x₁ Y − y₁ X) ÷ det', '(' + fmt(s.v1[0]) + ' × ' + fmt(p[1]) + ' − ' + fmt(s.v1[1]) + ' × ' + fmt(p[0]) + ') ÷ ' + fmt(d) + ' = ' + fmt(c[1])]);
      }
      dlg.open('Coordinates in both bases', '<p>Here v₁ = (x₁, y₁) and v₂ = (x₂, y₂).</p>' + table(rows) + (c ?
        '<p>In the basis v₁, v₂, the same point is (' + fmt(c[0]) + ', ' + fmt(c[1]) + ').</p>' :
        '<p>The determinant is 0, so v₁ and v₂ share a line. They are no basis, and coordinates in them are not unique.</p>'), btn);
    }
    function zoomDot(btn) {
      var d = dot(s.u, s.v1), nu = norm(s.u), nv = norm(s.v1), th = angle(s.u, s.v1);
      var rows = [
        ['u · v₁ = u₁ x₁ + u₂ y₁', fmt(s.u[0]) + ' × ' + fmt(s.v1[0]) + ' + ' + fmt(s.u[1]) + ' × ' + fmt(s.v1[1]) + ' = ' + fmt(d)],
        ['|u|', fmt(nu)], ['|v₁|', fmt(nv)]
      ];
      if (th !== null) {
        rows.push(['cos θ = u · v₁ ÷ (|u| |v₁|)', fmt(d / (nu * nv), 3)]);
        rows.push(['θ', fmt(th * 180 / Math.PI, 1) + '°']);
        rows.push(['Shadow length, u · v₁ ÷ |v₁|', fmt(d / nv)]);
      }
      dlg.open('Dot product, worked', '<p>Here u = (u₁, u₂) and v₁ = (x₁, y₁).</p>' + table(rows) +
        (th === null ? '<p>One of the arrows has length 0, so it has no direction and no angle.</p>' : ''), btn);
    }

    ctl.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-k');
      if (!k) return;
      s[k] = +e.target.value;
      draw();
    });
    ctl.addEventListener('change', report);
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act'), z = b.getAttribute('data-zoom');
      if (z === 'coords') { zoomCoords(b); return; }
      if (z === 'dot') { zoomDot(b); return; }
      if (act === 'paint') { paint(); return; }
      if (act === 'basis') s.basis = !s.basis;
      else if (act === 'u') { s.showU = !s.showU; s.mode = '2d'; }
      else if (act === '3d') s.mode = s.mode === '3d' ? '2d' : '3d';
      else if (b.hasAttribute('data-reset')) { api.interrupt(); s = JSON.parse(JSON.stringify(START)); trail = []; }
      sync(); draw(); report();
    });

    var PAGES = [
      { t: '2 arrows', parts: ['v1', 'v2'], state: { v1: [2, 1], v2: [-1, 1.5], c1: 1, c2: 1, paint: false, basis: false, showU: false, mode: '2d' },
        body: '<p><b class="is-q">v₁</b> = (2, 1) and <b class="is-k">v₂</b> = (−1, 1.5). Each arrow is a direction and a length. Drag either tip.</p>' },
      { t: 'Add them nose to tail', parts: ['v1', 'v2', 'sum'], state: { c1: 1, c2: 1 },
        body: '<p>Put the tail of <b class="is-k">v₂</b> on the tip of <b class="is-q">v₁</b>. The far end is <b class="is-o">v₁ + v₂</b> = (1, 2.5).</p>' },
      { t: 'Stretch before you add', parts: ['v1', 'v2', 'sum'], state: { c1: 1.5, c2: -1 },
        body: '<p>Scale each arrow, then add them: a linear combination. Drag the tip of <b class="is-o">c₁v₁ + c₂v₂</b>, and c₁ and c₂ follow. A negative c flips its arrow.</p>' },
      { t: 'Paint the span', parts: ['span', 'sum'], state: { c1: 1, c2: 1, paint: true },
        body: '<p>Press <b>Paint the span</b> to sweep many choices of c₁ and c₂. 2 arrows that point different ways reach every point of the plane.</p>' },
      { t: 'Make them parallel', parts: ['span', 'v1', 'v2'], state: { v2: [-2, -1], c1: 1, c2: 0.5, paint: true },
        body: '<p>Now <b class="is-k">v₂</b> = −1 × <b class="is-q">v₁</b>. Every combination stays on 1 line, so the span is that line. The pair is dependent.</p>' },
      { t: 'Same point, new coordinates', parts: ['sum', 'v1', 'v2'], state: { v2: [-1, 1.5], c1: 1, c2: 1, paint: false, basis: true },
        body: '<p>On the square grid, the tip sits at (1, 2.5). On the grid built from <b class="is-q">v₁</b> and <b class="is-k">v₂</b>, the same point is (1, 1).</p>' },
      { t: 'Length and angle', parts: ['u', 'shadow', 'v1'], state: { basis: false, showU: true },
        body: '<p><b class="is-v">u</b> · <b class="is-q">v₁</b> = |u| |v₁| cos θ. The <b class="is-o">shadow</b> of u on v₁ has length u · v₁ ÷ |v₁|. Drag u round.</p>' },
      { t: 'In 3 dimensions', parts: ['a3', 'b3', 'plane3'], state: { showU: false, mode: '3d' },
        body: '<p>2 arrows that point different ways in 3D span a flat plane through the origin. Turn and tilt to see it edge on.</p>' }
    ];
    sync(); draw();
    XP.guide(root.querySelector('[data-guide-box]'), PAGES, function (p, i, redraw) {
      if (!p) { api.focus([]); return; }
      if (!redraw) goTo(p.state);
      api.focus(p.parts);
    });
  });
```

- [ ] **Step 7: Register the explainer and add its styles**

In `_data/module_labs.yml`, replace `linear-algebra: {}` with:

```yaml
linear-algebra:
  '0': vectors-and-spaces
```

At the end of `css/labs.css`, add:

```css
/* ── Linear Algebra ─────────────────────────────────────── */
.lab-plane .pl-line { stroke: currentColor; stroke-width: 2; }
.lab-plane .pl-trail { fill: var(--xp-o); }
.lab-plane .pl-span { fill: color-mix(in srgb, var(--xp-o) 12%, transparent); }
.lab-plane .pl-span-line { stroke: color-mix(in srgb, var(--xp-o) 40%, transparent); stroke-width: 10; stroke-linecap: round; }
.lab-plane .pl-span-dot { fill: var(--xp-o); }
.lab-plane .pl-plane3 { fill: color-mix(in srgb, var(--xp-o) 16%, transparent); stroke: var(--xp-o); stroke-width: 1.5; }
```

- [ ] **Step 8: Build and run every check for this explainer**

Run:

```bash
PAGES_DISABLE_NETWORK=1 make build
(python3 -m http.server 4000 -d _site >/dev/null 2>&1 &) ; sleep 1
../venv/bin/python scripts/verify_labs.py --track linear-algebra
../venv/bin/python scripts/check_labs.py linear-algebra
../venv/bin/python scripts/check_chart_bounds.py _data/interview.yml
```

Expected:
- `verify_labs.py` prints `1 checks passed`.
- `check_labs.py` prints `1 tracks checked, 0 problems`.
- The bounds check prints no line for `linear-algebra`.

If `check_labs.py` reports a control that did nothing, or a contrast failure, fix the explainer rather than the check.

Then open `http://localhost:4000/linear-algebra/#m1` at 1,400 px and at 390 px. Step through all 8 guide pages and confirm each one matches its text.

- [ ] **Step 9: Commit**

```bash
git add js/labs/linear-algebra/vectors-and-spaces.js _includes/labs/linear-algebra/vectors-and-spaces.html \
  scripts/verify_labs.py _data/module_labs.yml css/labs.css
git commit -m "Add the vectors and spaces explainer to Linear Algebra"
```

---

### Task 4: Linear Algebra 2, matrices as transformations

**Files:**
- Create: `js/labs/linear-algebra/matrices-as-transformations.js` and `_includes/labs/linear-algebra/matrices-as-transformations.html`
- Modify: `scripts/verify_labs.py`, `_data/module_labs.yml`, `css/labs.css` and `_data/interview.yml`, removing the playground this explainer replaces

**Interfaces:**
- Consumes: Task 1's helpers, and the CSS from Task 3.
- Produces:
  - Exports: `apply(m, v)`, `mul(B, A)` (which returns BA), `det(m)`, `rotation(deg)`, `scaling(sx, sy)`, `shear(k)`, `projection(deg)`, `productTerms(B, A) -> [[t0, t1] x 4]` and `stageMatrix(A, B, order, t)`.
  - Matrices are `[a, b, c, d]`, given by rows.
  - The CSS class `.lab-mat`.

- [ ] **Step 1: Write the failing maths check**

Add to `scripts/verify_labs.py`:

```python
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
```

- [ ] **Step 2: Run it to check that it fails**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/matrices-as-transformations`

Expected: it fails with `Cannot find module`.

- [ ] **Step 3: Write the pure maths**

Create `js/labs/linear-algebra/matrices-as-transformations.js`:

```js
/* ════════════════════════════════════════════════════════
   Linear Algebra, module 2: matrices as transformations.
   The grid bends from the identity to A; the columns of A are where î and ĵ
   land; a vector rides along as a combination of the columns; 2 matrices in
   a row compose, and the order matters. Matrices are [a, b, c, d] by rows.
   ════════════════════════════════════════════════════════ */
(function () {

  var I = [1, 0, 0, 1];
  function apply(m, v) { return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]]; }
  /* BA: first A, then B. */
  function mul(B, A) {
    return [B[0] * A[0] + B[1] * A[2], B[0] * A[1] + B[1] * A[3], B[2] * A[0] + B[3] * A[2], B[2] * A[1] + B[3] * A[3]];
  }
  function det(m) { return m[0] * m[3] - m[1] * m[2]; }
  function rotation(deg) { var t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return [c, -s, s, c]; }
  function scaling(sx, sy) { return [sx, 0, 0, sy]; }
  function shear(k) { return [1, k, 0, 1]; }
  /* Projection onto the line through the origin at `deg` degrees. */
  function projection(deg) { var t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return [c * c, c * s, c * s, s * s]; }
  /* Each entry of BA as its 2 terms, B_i1 A_1j and B_i2 A_2j, in the order 11, 12, 21, 22. */
  function productTerms(B, A) {
    return [[0, 0], [0, 1], [1, 0], [1, 1]].map(function (ij) {
      var i = ij[0], j = ij[1];
      return [B[2 * i] * A[j], B[2 * i + 1] * A[2 + j]];
    });
  }
  function blend(m, t) { return [1 + (m[0] - 1) * t, m[1] * t, m[2] * t, 1 + (m[3] - 1) * t]; }
  /* The matrix on screen at time t in [0, 2] while composing: the first
     matrix grows in over [0, 1], then the second is applied on top. */
  function stageMatrix(A, B, order, t) {
    var first = order === 'A first' ? A : B, second = order === 'A first' ? B : A;
    return t <= 1 ? blend(first, t) : mul(blend(second, t - 1), first);
  }

  var M = { I: I, apply: apply, mul: mul, det: det, rotation: rotation, scaling: scaling, shear: shear,
    projection: projection, productTerms: productTerms, blend: blend, stageMatrix: stageMatrix };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  /* MOUNT */
})();
```

- [ ] **Step 4: Run the check to confirm that it passes**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/matrices-as-transformations`

Expected: it prints `ok linear-algebra/matrices-as-transformations`.

- [ ] **Step 5: Write the include**

Create `_includes/labs/linear-algebra/matrices-as-transformations.html`:

```html
<section class="xp lab" id="lab-linear-algebra-matrices-as-transformations" aria-labelledby="lab-la-matrices-t">
  <header class="lab-head">
    <span class="syl-phase">Explore it</span>
    <h3 id="lab-la-matrices-t">Bend the grid with a matrix</h3>
  </header>
  <p class="lab-eq"><i>A</i> = <span class="lab-mat"><span class="lab-term is-q" data-term="i"><span data-val="a">1.00</span><span data-val="c">0.00</span></span><span class="lab-term is-k" data-term="j"><span data-val="b">0.00</span><span data-val="d">1.00</span></span></span> &nbsp; <i>A</i><b>v</b> = 1 (<span class="lab-term is-q" data-term="i"><i>A</i>î</span>) + 2 (<span class="lab-term is-k" data-term="j"><i>A</i>ĵ</span>) = <span class="lab-term is-o" data-term="v">(<span data-val="vx">1.00</span>, <span data-val="vy">2.00</span>)</span></p>
  <div class="lab-main">
    <div class="lab-stage" data-stage></div>
    <div data-guide-box></div>
  </div>
  <div class="lab-ctl" data-ctl></div>
  <p class="lab-say" aria-live="polite" data-say></p>
</section>
```

- [ ] **Step 6: Write the explainer**

Replace `  /* MOUNT */` with:

```js
  XP.lab('linear-algebra/matrices-as-transformations', function (root, api) {
    var fmt = XP.fmt, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var DEF = [2, -1, 1, 1], B = rotation(90), V = [1, 2];
    var PRESETS = {
      'Your matrix': DEF, 'Rotate by 30°': rotation(30), 'Stretch across': scaling(2, 0.5),
      'Shear': shear(1), 'Project onto a line': projection(30), 'Identity': I
    };
    var s = { m: DEF.slice(), t: 0, compose: false, order: 'A first' };
    var P = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'The grid before and after the matrix A, with î, ĵ and v' });
    var dlg = XP.dialog(root);

    ctl.innerHTML =
      '<label>apply <input type="range" data-k="t" min="0" max="1" step="0.01" aria-label="How much of the transformation to show"></label>' +
      '<button type="button" data-act="play">Play</button>' +
      '<label>preset <select data-k="preset" aria-label="Preset matrix">' + Object.keys(PRESETS).map(function (k) { return '<option>' + k + '</option>'; }).join('') + '</select></label>' +
      '<button type="button" data-act="compose" aria-pressed="false">A then B</button>' +
      '<button type="button" data-act="swap" hidden>Swap the order</button>' +
      '<button type="button" data-zoom="av">A times v, worked</button>' +
      '<button type="button" data-zoom="ba">Entries of BA, worked</button>' +
      '<button type="button" data-reset>Reset</button>';
    var tIn = ctl.querySelector('[data-k="t"]'), preset = ctl.querySelector('[data-k="preset"]'), swap = ctl.querySelector('[data-act="swap"]');

    function shown() { return s.compose ? stageMatrix(s.m, B, s.order, s.t) : blend(s.m, s.t); }
    function columnHandle(col, label, cls, part) {
      return P.handle({ x: s.m[col], y: s.m[2 + col], label: label, cls: cls, part: part, onMove: function (x, y, done) {
        s.m[col] = x; s.m[2 + col] = y; s.t = 1; s.compose = false; draw(); if (done) report();
      } });
    }
    var hi = columnHandle(0, 'Where î lands', 'is-q', 'i'), hj = columnHandle(1, 'Where ĵ lands', 'is-k', 'j');

    function draw() {
      var m = shown(), av = apply(m, V), a = [V[0] * m[0], V[0] * m[2]];
      tIn.max = s.compose ? 2 : 1;
      tIn.value = s.t;
      swap.hidden = !s.compose;
      api.values({ a: m[0], b: m[1], c: m[2], d: m[3], vx: av[0], vy: av[1] });
      P.grid.innerHTML = P.gridMarkup(null, 1, 'pl-std is-faint') + P.gridMarkup(m, 1, 'pl-moved') + P.axes();
      var h = '';
      if (!s.compose && s.t < 1) {
        h += P.arrow(0, 0, s.m[0], s.m[2], 'is-q is-faint', 'i') + P.arrow(0, 0, s.m[1], s.m[3], 'is-k is-faint', 'j');
      }
      if (s.compose) {
        var other = stageMatrix(s.m, B, s.order === 'A first' ? 'B first' : 'A first', 2);
        h += P.arrow(0, 0, other[0], other[2], 'is-q is-faint', 'i') + P.arrow(0, 0, other[1], other[3], 'is-k is-faint', 'j');
      }
      h += P.arrow(0, 0, a[0], a[1], 'is-q', 'v i') + P.arrow(a[0], a[1], av[0], av[1], 'is-k', 'v j');
      h += P.arrow(0, 0, m[0], m[2], 'is-q', 'i') + P.arrow(0, 0, m[1], m[3], 'is-k', 'j');
      h += P.arrow(0, 0, av[0], av[1], 'is-o', 'v');
      P.plot.innerHTML = h;
      hi.set(m[0], m[2]); hj.set(m[1], m[3]);
      hi.show(!s.compose); hj.show(!s.compose);
    }
    function report() {
      var m = shown(), av = apply(m, V);
      api.say('î lands at (' + fmt(m[0]) + ', ' + fmt(m[2]) + ') and ĵ at (' + fmt(m[1]) + ', ' + fmt(m[3]) + '). ' +
        'v = (1, 2) lands at (' + fmt(av[0]) + ', ' + fmt(av[1]) + ').' +
        (s.compose ? ' Showing ' + (s.order === 'A first' ? 'A, then B' : 'B, then A') + ', where B is a quarter turn.' : ''));
    }
    function goTo(target) {
      var from = { m: s.m.slice(), t: s.t }, to = { m: target.m || s.m.slice(), t: 't' in target ? target.t : s.t };
      if ('compose' in target && target.compose !== s.compose) { s.compose = target.compose; from.t = s.compose ? 0 : from.t; }
      if (target.order) s.order = target.order;
      ctl.querySelector('[data-act="compose"]').setAttribute('aria-pressed', s.compose ? 'true' : 'false');
      api.animate(from, to, 800, function (st) { s.m = st.m.slice(); s.t = st.t; draw(); }, report);
    }

    function table(rows) {
      return '<table class="xp-table lab-table"><tbody>' + rows.map(function (r) {
        return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>';
      }).join('') + '</tbody></table>';
    }
    function zoomAv(btn) {
      var m = s.m, av = apply(m, V);
      dlg.open('A times v, worked', table([
        ['Aî, the first column', '(' + fmt(m[0]) + ', ' + fmt(m[2]) + ')'],
        ['Aĵ, the second column', '(' + fmt(m[1]) + ', ' + fmt(m[3]) + ')'],
        ['1 × Aî + 2 × Aĵ, across', '1 × ' + fmt(m[0]) + ' + 2 × ' + fmt(m[1]) + ' = ' + fmt(av[0])],
        ['1 × Aî + 2 × Aĵ, up', '1 × ' + fmt(m[2]) + ' + 2 × ' + fmt(m[3]) + ' = ' + fmt(av[1])]
      ]) + '<p>v = (1, 2) says: take 1 of the first column and 2 of the second.</p>', btn);
    }
    function zoomBa(btn) {
      var terms = productTerms(B, s.m), ba = mul(B, s.m), names = ['(BA)₁₁', '(BA)₁₂', '(BA)₂₁', '(BA)₂₂'];
      dlg.open('Entries of BA, worked', '<p>B is a quarter turn, [[' + fmt(B[0]) + ', ' + fmt(B[1]) + '], [' + fmt(B[2]) + ', ' + fmt(B[3]) + ']]. Each entry adds 2 products.</p>' +
        table(names.map(function (n, k) { return [n, fmt(terms[k][0]) + ' + ' + fmt(terms[k][1]) + ' = ' + fmt(ba[k])]; })), btn);
    }

    ctl.addEventListener('input', function (e) {
      if (e.target === tIn) { s.t = +tIn.value; draw(); }
    });
    ctl.addEventListener('change', function (e) {
      if (e.target === preset) goTo({ m: PRESETS[preset.value].slice(), t: 1, compose: false });
      else report();
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act'), z = b.getAttribute('data-zoom');
      if (z === 'av') return zoomAv(b);
      if (z === 'ba') return zoomBa(b);
      if (act === 'play') { var end = s.compose ? 2 : 1; s.t = 0; draw(); api.animate({ t: 0 }, { t: end }, s.compose ? 1600 : 900, function (st) { s.t = st.t; draw(); }, report); return; }
      if (act === 'compose') { goTo({ compose: !s.compose, t: s.compose ? 1 : 2 }); return; }
      if (act === 'swap') { s.order = s.order === 'A first' ? 'B first' : 'A first'; s.t = 0; goTo({ t: 2 }); return; }
      if (b.hasAttribute('data-reset')) { api.interrupt(); s = { m: DEF.slice(), t: 0, compose: false, order: 'A first' }; preset.value = 'Your matrix'; }
      ctl.querySelector('[data-act="compose"]').setAttribute('aria-pressed', s.compose ? 'true' : 'false');
      draw(); report();
    });

    var PAGES = [
      { t: 'The plain grid', parts: ['i', 'j'], state: { m: DEF, t: 0, compose: false },
        body: '<p>Every point of the plane sits on this grid. <b class="is-q">î</b> = (1, 0) and <b class="is-k">ĵ</b> = (0, 1) are the 2 starting arrows.</p>' },
      { t: 'Where î and ĵ land', parts: ['i', 'j'], state: { t: 0 },
        body: '<p>The first column of A says where <b class="is-q">î</b> lands, (2, 1). The second column says where <b class="is-k">ĵ</b> lands, (−1, 1).</p>' },
      { t: 'Apply it', parts: ['i', 'j'], state: { t: 1 },
        body: '<p>Every point moves at once. Grid lines stay straight and evenly spaced, and the origin stays put.</p>' },
      { t: 'Follow 1 vector', parts: ['v'], state: { t: 1 },
        body: '<p><b class="is-o">v</b> = (1, 2) means 1 of the first column plus 2 of the second. It lands at 1 × (2, 1) + 2 × (−1, 1) = (0, 3).</p>' },
      { t: 'Drag the columns', parts: ['i', 'j', 'v'], state: { t: 1 },
        body: '<p>Drag the tips of <b class="is-q">Aî</b> and <b class="is-k">Aĵ</b>. The matrix above changes with them, and so does every point.</p>' },
      { t: '4 familiar moves', parts: ['i', 'j'], state: { m: rotation(30), t: 1 },
        body: '<p>This is a rotation by 30°. Try the other presets: a stretch, a shear and a projection. A projection sends the plane onto 1 line.</p>' },
      { t: '2 in a row', parts: ['i', 'j', 'v'], state: { m: DEF, compose: true, order: 'A first', t: 2 },
        body: '<p>Apply A, then B, a quarter turn. The faint arrows show B first, then A. They land elsewhere, so BA and AB differ.</p>' }
    ];
    draw();
    XP.guide(root.querySelector('[data-guide-box]'), PAGES, function (p, i, redraw) {
      if (!p) { api.focus([]); return; }
      if (!redraw) goTo(p.state);
      api.focus(p.parts);
    });
  });
```

- [ ] **Step 7: Register it and add its styles**

In `_data/module_labs.yml`, add under `linear-algebra:`:

```yaml
  '1': matrices-as-transformations
```

In the Linear Algebra section of `css/labs.css`, add:

```css
.lab-mat { display: inline-flex; gap: 0.6em; vertical-align: middle; padding: 0 0.35em; border-left: 2px solid var(--muted); border-right: 2px solid var(--muted); border-radius: 3px; }
.lab-mat > span { display: inline-flex; flex-direction: column; align-items: flex-end; line-height: 1.3; }
```

- [ ] **Step 7a: Remove the playground this explainer replaces**

The playground "Move where the basis vectors land" has 4 sliders for where î and ĵ land. The explainer's 2 handles do the same job directly above it, so the sliders are redundant.

In `_data/interview.yml`, find the `linear-algebra` topic, then the module `Matrices as transformations`, then its equation `A matrix is where the basis vectors land`. Delete that equation's whole `play:` block, from `play:` through its last knob, and keep the equation's `tex`, `read` and `where`. Then run:

```bash
ruby -ryaml -e 'e = YAML.load_file("_data/interview.yml")["topics"].find { |t| t["id"] == "linear-algebra" }["modules"][1]["math"][0]; abort "play still there" if e["play"]; puts "removed"'
```

Expected: it prints `removed`.

- [ ] **Step 8: Build and run every check**

Run the same commands as Task 3, Step 8.

Expected:
- `2 checks passed`.
- `1 tracks checked, 0 problems`.
- No bounds line for `linear-algebra`.

Step through the 7 guide pages at `/linear-algebra/#m2` at both widths.

- [ ] **Step 9: Commit**

```bash
git add js/labs/linear-algebra/matrices-as-transformations.js _includes/labs/linear-algebra/matrices-as-transformations.html \
  scripts/verify_labs.py _data/module_labs.yml css/labs.css _data/interview.yml
git commit -m "Add the matrices as transformations explainer to Linear Algebra, replacing the basis-vector sliders"
```

---

### Task 5: Linear Algebra 3, determinant, rank and inverse

**Files:**
- Create: `js/labs/linear-algebra/determinant-rank-inverse.js` and `_includes/labs/linear-algebra/determinant-rank-inverse.html`
- Modify: `scripts/verify_labs.py`, `_data/module_labs.yml` and `css/labs.css`

**Interfaces:**
- Consumes: Task 1's helpers, and the CSS from Tasks 3 and 4.
- Produces these exports:
  - `det(m)`, `rank(m) -> 0|1|2`, `inverse(m) -> m | null`, `lines(m) -> { col, nul } | null` (unit vectors, for rank 1);
  - `solve(m, y)`, which returns one of:
    - `{ kind: 'one', x }`;
    - `{ kind: 'none' }`;
    - `{ kind: 'line', x, dir }`;
    - `{ kind: 'all' }`;
  - `apply(m, v)` and `blend(m, t)`.

- [ ] **Step 1: Write the failing maths check**

Add to `scripts/verify_labs.py`:

```python
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
```

- [ ] **Step 2: Run it to check that it fails**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/determinant-rank-inverse`

Expected: it fails with `Cannot find module`.

- [ ] **Step 3: Write the pure maths**

Create `js/labs/linear-algebra/determinant-rank-inverse.js`:

```js
/* ════════════════════════════════════════════════════════
   Linear Algebra, module 3: determinant, rank and inverse.
   The unit square's area is the determinant, a mirrored F shows a flip, a
   squashed plane has a null line whose points share 1 output, and A x = y
   has 1 answer, none, or a line of them. Matrices are [a, b, c, d] by rows.
   ════════════════════════════════════════════════════════ */
(function () {

  function det(m) { return m[0] * m[3] - m[1] * m[2]; }
  function size(m) { return Math.abs(m[0]) + Math.abs(m[1]) + Math.abs(m[2]) + Math.abs(m[3]); }
  /* 2, 1 or 0, with a tolerance scaled to the entries. */
  function rank(m) {
    var s = size(m);
    if (s < 1e-12) return 0;
    return Math.abs(det(m)) <= 1e-9 * s * s ? 1 : 2;
  }
  function inverse(m) {
    if (rank(m) < 2) return null;
    var d = det(m);
    return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d];
  }
  function apply(m, v) { return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]]; }
  function blend(m, t) { return [1 + (m[0] - 1) * t, m[1] * t, m[2] * t, 1 + (m[3] - 1) * t]; }
  function unit(v) { var n = Math.sqrt(v[0] * v[0] + v[1] * v[1]); return n < 1e-12 ? null : [v[0] / n, v[1] / n]; }
  function longer(p, q) { return p[0] * p[0] + p[1] * p[1] >= q[0] * q[0] + q[1] * q[1] ? p : q; }

  /* For a rank 1 matrix: the direction of the line every output lands on
     (col), and the direction of inputs that land on 0 (nul). */
  function lines(m) {
    if (rank(m) !== 1) return null;
    var col = longer([m[0], m[2]], [m[1], m[3]]), row = longer([m[0], m[1]], [m[2], m[3]]);
    return { col: unit(col), nul: unit([-row[1], row[0]]) };
  }

  /* Solve A x = y. */
  function solve(m, y) {
    var r = rank(m), s = Math.max(1, size(m) + Math.abs(y[0]) + Math.abs(y[1]));
    if (r === 2) return { kind: 'one', x: apply(inverse(m), y) };
    if (r === 0) return Math.abs(y[0]) + Math.abs(y[1]) <= 1e-9 * s ? { kind: 'all' } : { kind: 'none' };
    var L = lines(m);
    if (Math.abs(L.col[0] * y[1] - L.col[1] * y[0]) > 1e-9 * s) return { kind: 'none' };
    var i = m[0] * m[0] + m[1] * m[1] >= m[2] * m[2] + m[3] * m[3] ? 0 : 1;
    var ra = m[2 * i], rb = m[2 * i + 1], rn = ra * ra + rb * rb;
    return { kind: 'line', x: [ra * y[i] / rn, rb * y[i] / rn], dir: L.nul };
  }

  var M = { det: det, rank: rank, inverse: inverse, apply: apply, blend: blend, lines: lines, solve: solve };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  /* MOUNT */
})();
```

- [ ] **Step 4: Run the check to confirm that it passes**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/determinant-rank-inverse`

Expected: it prints `ok linear-algebra/determinant-rank-inverse`.

- [ ] **Step 5: Write the include**

Create `_includes/labs/linear-algebra/determinant-rank-inverse.html`:

```html
<section class="xp lab" id="lab-linear-algebra-determinant-rank-inverse" aria-labelledby="lab-la-det-t">
  <header class="lab-head">
    <span class="syl-phase">Explore it</span>
    <h3 id="lab-la-det-t">Watch area, orientation and dimensions survive or vanish</h3>
  </header>
  <p class="lab-eq"><span class="lab-term is-o" data-term="area">det <i>A</i></span> = <span class="lab-term is-q" data-term="i"><span data-val="a">2.00</span></span> × <span class="lab-term is-k" data-term="j"><span data-val="d">1.50</span></span> − <span class="lab-term is-k" data-term="j"><span data-val="b">1.00</span></span> × <span class="lab-term is-q" data-term="i"><span data-val="c">0.50</span></span> = <span data-val="det">2.50</span>, &nbsp; rank <span data-val="rank">2</span></p>
  <div class="lab-main">
    <div class="lab-stage" data-stage><p class="lab-note" data-note></p></div>
    <div data-guide-box></div>
  </div>
  <div class="lab-ctl" data-ctl></div>
  <p class="lab-say" aria-live="polite" data-say></p>
</section>
```

- [ ] **Step 6: Write the explainer**

Replace `  /* MOUNT */` with:

```js
  XP.lab('linear-algebra/determinant-rank-inverse', function (root, api) {
    var fmt = XP.fmt, svgEl = XP.svgEl, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var note = root.querySelector('[data-note]');
    var DEF = [2, 1, 0.5, 1.5], FLIP = [2, 1, 0.5, -1], SING = [2, 1, 0.5, 0.25];
    var PRESETS = { 'Your matrix': DEF, 'Flip it': FLIP, 'Squash it': SING, 'Scale by 2': [2, 0, 0, 2], 'Quarter turn': [0, -1, 1, 0] };
    /* A letter F inside the unit square: its reflection shows a flip. */
    var F = [[0.2, 0.1], [0.35, 0.1], [0.35, 0.45], [0.65, 0.45], [0.65, 0.58], [0.35, 0.58], [0.35, 0.78], [0.8, 0.78], [0.8, 0.9], [0.2, 0.9]];
    var START = { m: DEF.slice(), t: 0, mode: 'area', showNull: false, y: [1, 1], sweep: 0 };
    var s = JSON.parse(JSON.stringify(START));
    var P = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'The unit square and a letter F under the matrix A' });
    stage.appendChild(note);
    var dlg = XP.dialog(root);

    ctl.innerHTML =
      '<label>apply <input type="range" data-k="t" min="0" max="1" step="0.01" aria-label="How much of A to show"></label>' +
      '<button type="button" data-act="play">Apply A</button>' +
      '<button type="button" data-act="undo">Undo with A⁻¹</button>' +
      '<label>preset <select data-k="preset" aria-label="Preset matrix">' + Object.keys(PRESETS).map(function (k) { return '<option>' + k + '</option>'; }).join('') + '</select></label>' +
      '<button type="button" data-act="solve" aria-pressed="false">Solve Av = y</button>' +
      '<button type="button" data-zoom="det">Determinant, worked</button>' +
      '<button type="button" data-zoom="rank">Rank and nullity</button>' +
      '<button type="button" data-reset>Reset</button>';
    var tIn = ctl.querySelector('[data-k="t"]'), preset = ctl.querySelector('[data-k="preset"]'), undo = ctl.querySelector('[data-act="undo"]');

    function col(c, label, cls, part) {
      return P.handle({ x: s.m[c], y: s.m[2 + c], label: label, cls: cls, part: part, onMove: function (x, y, done) {
        s.m[c] = x; s.m[2 + c] = y; s.t = 1; draw(); if (done) report();
      } });
    }
    var hi = col(0, 'Where î lands', 'is-q', 'i'), hj = col(1, 'Where ĵ lands', 'is-k', 'j');
    var hy = P.handle({ x: s.y[0], y: s.y[1], label: 'The target y', cls: 'is-o', part: 'y', onMove: function (x, y, done) {
      s.y = [x, y]; draw(); if (done) report();
    } });

    function poly(points, m, cls, part) {
      return '<polygon class="' + cls + '" data-part="' + part + '" points="' + P.pts(points.map(function (q) { return apply(m, q); })) + '"/>';
    }
    function describeSolve(m) {
      var sol = solve(m, s.y);
      if (sol.kind === 'one') return 'Exactly 1 x lands on y: x = (' + fmt(sol.x[0]) + ', ' + fmt(sol.x[1]) + ').';
      if (sol.kind === 'line') return 'y sits on the squashed line, so a whole line of x lands on it.';
      if (sol.kind === 'all') return 'A sends everything to 0, and y is 0, so every x works.';
      return 'No x lands on y: A only reaches ' + (rank(m) === 1 ? 'the squashed line' : 'the origin') + ', and y is off it.';
    }

    function draw() {
      var m = blend(s.m, s.t), d = det(m), r = rank(m);
      tIn.value = s.t;
      undo.disabled = rank(s.m) < 2;
      undo.title = undo.disabled ? 'A squashes the plane, so it has no inverse' : '';
      api.values({ a: m[0], b: m[1], c: m[2], d: m[3], det: d });
      api.values({ rank: r }, 0);
      P.grid.innerHTML = P.gridMarkup(null, 1, 'pl-std is-faint') + P.gridMarkup(m, 1, 'pl-moved') + P.axes();
      var h = poly([[0, 0], [1, 0], [1, 1], [0, 1]], m, 'pl-square' + (d < 0 ? ' is-flipped' : ''), 'area') + poly(F, m, 'pl-f', 'f');
      var L = lines(m);
      if (L && s.t >= 1) {
        h += svgEl('line', { x1: P.map.sx(-12 * L.col[0]), y1: P.map.sy(-12 * L.col[1]), x2: P.map.sx(12 * L.col[0]), y2: P.map.sy(12 * L.col[1]), 'class': 'pl-line is-o is-faint', 'data-part': 'col' });
        if (s.showNull) {
          var p0 = [1, 0.5], out = apply(m, p0);
          h += svgEl('line', { x1: P.map.sx(p0[0] - 12 * L.nul[0]), y1: P.map.sy(p0[1] - 12 * L.nul[1]), x2: P.map.sx(p0[0] + 12 * L.nul[0]), y2: P.map.sy(p0[1] + 12 * L.nul[1]), 'class': 'pl-dash is-k', 'data-part': 'null' });
          [-2, -1, 0, 1, 2].forEach(function (k) {
            var q = [p0[0] + (k + s.sweep) * L.nul[0], p0[1] + (k + s.sweep) * L.nul[1]];
            h += '<g class="is-v" data-part="null">' + svgEl('line', { x1: P.map.sx(q[0]), y1: P.map.sy(q[1]), x2: P.map.sx(out[0]), y2: P.map.sy(out[1]), 'class': 'pl-dash' }) + '</g>';
            h += P.dot(q[0], q[1], 4, 'pl-mark pl-in', 'null');
          });
          h += P.dot(out[0], out[1], 7, 'pl-mark pl-out', 'out');
        }
      }
      h += P.arrow(0, 0, m[0], m[2], 'is-q', 'i') + P.arrow(0, 0, m[1], m[3], 'is-k', 'j');
      if (s.mode === 'solve') {
        var sol = solve(s.m, s.y);
        if (sol.kind === 'one') h += P.arrow(0, 0, sol.x[0], sol.x[1], 'is-v', 'x');
        if (sol.kind === 'line') {
          h += svgEl('line', { x1: P.map.sx(sol.x[0] - 12 * sol.dir[0]), y1: P.map.sy(sol.x[1] - 12 * sol.dir[1]), x2: P.map.sx(sol.x[0] + 12 * sol.dir[0]), y2: P.map.sy(sol.x[1] + 12 * sol.dir[1]), 'class': 'pl-line is-v', 'data-part': 'x' });
        }
        note.textContent = describeSolve(s.m);
      } else {
        note.textContent = r === 2 ? 'Area scales by |det A| = ' + fmt(Math.abs(d)) + (d < 0 ? ', and the plane is flipped.' : '.') :
          r === 1 ? 'The plane is squashed onto a line. The area is 0.' : 'Everything lands on the origin.';
      }
      P.plot.innerHTML = h;
      hi.set(m[0], m[2]); hj.set(m[1], m[3]); hy.set(s.y[0], s.y[1]);
      hy.show(s.mode === 'solve');
    }
    function report() { api.say(note.textContent); }
    function goTo(target) {
      var from = { m: s.m.slice(), t: s.t }, to = { m: target.m ? target.m.slice() : s.m.slice(), t: 't' in target ? target.t : s.t };
      if ('mode' in target) s.mode = target.mode;
      if ('showNull' in target) s.showNull = target.showNull;
      ctl.querySelector('[data-act="solve"]').setAttribute('aria-pressed', s.mode === 'solve' ? 'true' : 'false');
      api.animate(from, to, 800, function (st) { s.m = st.m.slice(); s.t = st.t; draw(); }, function () {
        report();
        if (s.showNull) api.animate({ sweep: -1 }, { sweep: 1 }, 1500, function (st) { s.sweep = st.sweep; draw(); });
      });
    }

    function table(rows) {
      return '<table class="xp-table lab-table"><tbody>' + rows.map(function (r) {
        return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>';
      }).join('') + '</tbody></table>';
    }

    ctl.addEventListener('input', function (e) { if (e.target === tIn) { s.t = +tIn.value; draw(); } });
    ctl.addEventListener('change', function (e) {
      if (e.target === preset) goTo({ m: PRESETS[preset.value], t: 1 });
      else report();
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act'), z = b.getAttribute('data-zoom');
      if (z === 'det') {
        var m = s.m;
        dlg.open('Determinant, worked', table([
          ['a d', fmt(m[0]) + ' × ' + fmt(m[3]) + ' = ' + fmt(m[0] * m[3])],
          ['b c', fmt(m[1]) + ' × ' + fmt(m[2]) + ' = ' + fmt(m[1] * m[2])],
          ['det A = a d − b c', fmt(det(m))]
        ]) + '<p>The parallelogram built on the columns has area |det A|. A negative sign means the plane was flipped over.</p>', b);
        return;
      }
      if (z === 'rank') {
        var rk = rank(s.m);
        dlg.open('Rank and nullity', table([
          ['rank A, dimensions that survive', String(rk)],
          ['dim ker A, dimensions squashed to 0', String(2 - rk)],
          ['rank + nullity', rk + ' + ' + (2 - rk) + ' = 2']
        ]) + '<p>Every input dimension either survives or is squashed. The 2 counts always add up to 2 here.</p>', b);
        return;
      }
      if (act === 'play') { s.t = 0; goTo({ t: 1 }); return; }
      if (act === 'undo') { if (!undo.disabled) goTo({ t: 0 }); return; }
      if (act === 'solve') { goTo({ mode: s.mode === 'solve' ? 'area' : 'solve', t: 1 }); return; }
      if (b.hasAttribute('data-reset')) { api.interrupt(); s = JSON.parse(JSON.stringify(START)); preset.value = 'Your matrix'; }
      draw(); report();
    });

    var PAGES = [
      { t: 'The unit square', parts: ['area', 'f'], state: { m: DEF, t: 0, mode: 'area', showNull: false },
        body: '<p>Start with the unit square. Its area is 1, and the letter F inside it shows which way round the plane is.</p>' },
      { t: 'Apply A', parts: ['area'], state: { t: 1 },
        body: '<p>A turns the square into a parallelogram. Its area is the <b class="is-o">determinant</b>, 2.5 here.</p>' },
      { t: 'The formula', parts: ['i', 'j', 'area'], state: { t: 1 },
        body: '<p>det A = a d − b c. With columns <b class="is-q">(2, 0.5)</b> and <b class="is-k">(1, 1.5)</b>, that is 2 × 1.5 − 1 × 0.5 = 2.5.</p>' },
      { t: 'Turn it over', parts: ['area', 'f'], state: { m: FLIP, t: 1 },
        body: '<p>Move <b class="is-k">ĵ</b> to the other side of <b class="is-q">î</b> and the determinant turns negative, −2.5. The F comes out mirrored.</p>' },
      { t: 'Squash it', parts: ['area', 'col'], state: { m: SING, t: 1 },
        body: '<p>Now <b class="is-k">ĵ</b> sits on the line of <b class="is-q">î</b>. The square flattens, the determinant is 0, and the rank drops to 1.</p>' },
      { t: 'Many inputs, 1 output', parts: ['null', 'out'], state: { m: SING, t: 1, showNull: true },
        body: '<p>Every point on the dashed line lands on the same spot. Once inputs share an output, nothing can tell them apart again.</p>' },
      { t: 'Undo, when you can', parts: ['area', 'f'], state: { m: DEF, t: 1, showNull: false },
        body: '<p>Press <b>Undo with A⁻¹</b> to send every point back. Undo is switched off whenever the determinant is 0.</p>' },
      { t: 'Solve Av = y', parts: ['y', 'x'], state: { mode: 'solve', t: 1 },
        body: '<p>Drag <b class="is-o">y</b>. With det A ≠ 0 there is exactly 1 answer <b class="is-v">x</b>. Squash A and there is none, or a whole line.</p>' }
    ];
    draw();
    XP.guide(root.querySelector('[data-guide-box]'), PAGES, function (p, i, redraw) {
      if (!p) { api.focus([]); return; }
      if (!redraw) goTo(p.state);
      api.focus(p.parts);
    });
  });
```

- [ ] **Step 7: Register it and add its styles**

In `_data/module_labs.yml`, add:

```yaml
  '2': determinant-rank-inverse
```

In the Linear Algebra section of `css/labs.css`, add:

```css
.lab-plane .pl-square { fill: color-mix(in srgb, var(--xp-o) 22%, transparent); stroke: var(--xp-o); stroke-width: 2; }
.lab-plane .pl-square.is-flipped { fill: color-mix(in srgb, var(--tf-down) 24%, transparent); stroke: var(--tf-down); }
.lab-plane .pl-f { fill: var(--text); fill-opacity: 0.75; }
.lab-plane .pl-in { fill: var(--xp-v); }
.lab-plane .pl-out { fill: var(--xp-o); stroke: var(--bg); stroke-width: 2; }
```

- [ ] **Step 8: Build and run every check**

Run the same commands as Task 3, Step 8.

Expected:
- `3 checks passed`.
- `1 tracks checked, 0 problems`.
- No bounds line.

At `/linear-algebra/#m3`, confirm these 4 behaviours:
- Undo is disabled on the Squash page.
- The F mirrors on the Turn it over page.
- The 5 dots on the null line all land on 1 point.
- Solve Av = y shows 1 answer, none, or a line as you drag y with the Squash preset.

- [ ] **Step 9: Commit**

```bash
git add js/labs/linear-algebra/determinant-rank-inverse.js _includes/labs/linear-algebra/determinant-rank-inverse.html \
  scripts/verify_labs.py _data/module_labs.yml css/labs.css
git commit -m "Add the determinant, rank and inverse explainer to Linear Algebra"
```

---

### Task 6: Linear Algebra 4, eigenvectors and eigenvalues

**Files:**
- Create: `js/labs/linear-algebra/eigenvectors.js` and `_includes/labs/linear-algebra/eigenvectors.html`
- Modify: `scripts/verify_labs.py`, `_data/module_labs.yml` and `css/labs.css`

**Interfaces:**
- Consumes: Task 1's helpers, and the CSS from Tasks 3 to 5.
- Produces these exports:
  - `det(m)`, `tr(m)`, `charPoly(m, l)`;
  - `eig(m)`, which returns either `{ real: true, values: [l1, l2], vectors: [[x, y], ...] }`, with l1 ≥ l2 and 1 vector when the matrix is defective, or `{ real: false, re, im }`;
  - `apply(m, v)`, `power(m, v, n)`, `spectralRadius(m)`, `knock(m, v)` (in radians, folded to [0, π/2]) and `blend(m, t)`.

- [ ] **Step 1: Write the failing maths check**

Add to `scripts/verify_labs.py`:

```python
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
    # the numbers the guide quotes
    g = run(lab, [['eig', [[2, 1, 0.5, 1.5]]], ['eig', [[2, 1, 1, 2]]], ['eig', [[0, -1, 1, 0]]]])
    close('guide values', g[0]['values'], [2.5, 1])
    close('guide first vector', abs(np.dot(g[0]['vectors'][0], [2 / 5 ** 0.5, 1 / 5 ** 0.5])), 1)
    close('guide second vector', abs(np.dot(g[0]['vectors'][1], [1 / 2 ** 0.5, -1 / 2 ** 0.5])), 1)
    close('guide symmetric', g[1]['values'], [3, 1])
    same('guide quarter turn', g[2]['real'], False)
```

- [ ] **Step 2: Run it to check that it fails**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/eigenvectors`

Expected: it fails with `Cannot find module`.

- [ ] **Step 3: Write the pure maths**

Create `js/labs/linear-algebra/eigenvectors.js`:

```js
/* ════════════════════════════════════════════════════════
   Linear Algebra, module 4: eigenvectors and eigenvalues.
   A fan of arrows transforms; most leave their line and the eigenvectors
   stay on theirs. The unit circle becomes an ellipse, det(A − λI) is drawn
   as a parabola whose roots are the eigenvalues, and repeated application
   swings every direction towards the dominant eigenvector.
   ════════════════════════════════════════════════════════ */
(function () {

  function det(m) { return m[0] * m[3] - m[1] * m[2]; }
  function tr(m) { return m[0] + m[3]; }
  function charPoly(m, l) { return l * l - tr(m) * l + det(m); }
  function apply(m, v) { return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]]; }
  function blend(m, t) { return [1 + (m[0] - 1) * t, m[1] * t, m[2] * t, 1 + (m[3] - 1) * t]; }

  /* Eigenvalues, largest first, and unit eigenvectors. A complex pair is
     returned as re ± im i. A defective matrix returns 1 vector; a multiple
     of the identity returns the 2 axes, since every direction qualifies. */
  function eig(m) {
    var t = tr(m), d = det(m), disc = t * t / 4 - d;
    var sc = Math.max(1, Math.abs(t), Math.sqrt(Math.abs(d)));
    if (disc < -1e-12 * sc * sc) return { real: false, re: t / 2, im: Math.sqrt(-disc) };
    var r = Math.sqrt(Math.max(0, disc)), l1 = t / 2 + r, l2 = t / 2 - r;
    function vec(l) {
      var a = m[0] - l, b = m[1], c = m[2], dd = m[3] - l;
      var v = a * a + b * b >= c * c + dd * dd ? [-b, a] : [-dd, c], n = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
      return n < 1e-9 * sc ? null : [v[0] / n, v[1] / n];
    }
    if (r < 1e-9 * sc) {
      var v = vec(l1);
      return { real: true, values: [l1, l1], vectors: v ? [v] : [[1, 0], [0, 1]] };
    }
    return { real: true, values: [l1, l2], vectors: [vec(l1), vec(l2)] };
  }

  function power(m, v, n) { for (var i = 0; i < n; i++) v = apply(m, v); return v; }
  function spectralRadius(m) {
    var e = eig(m);
    return e.real ? Math.max(Math.abs(e.values[0]), Math.abs(e.values[1])) : Math.sqrt(e.re * e.re + e.im * e.im);
  }
  /* How far A knocks v off its own line, in radians from 0 to π/2. */
  function knock(m, v) {
    var w = apply(m, v), nv = Math.sqrt(v[0] * v[0] + v[1] * v[1]), nw = Math.sqrt(w[0] * w[0] + w[1] * w[1]);
    if (nv < 1e-12 || nw < 1e-12) return 0;
    return Math.acos(Math.min(1, Math.abs(v[0] * w[0] + v[1] * w[1]) / (nv * nw)));
  }

  var M = { det: det, tr: tr, charPoly: charPoly, apply: apply, blend: blend, eig: eig, power: power,
    spectralRadius: spectralRadius, knock: knock };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  /* MOUNT */
})();
```

- [ ] **Step 4: Run the check to confirm that it passes**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/eigenvectors`

Expected: it prints `ok linear-algebra/eigenvectors`.

- [ ] **Step 5: Write the include**

Create `_includes/labs/linear-algebra/eigenvectors.html`:

```html
<section class="xp lab" id="lab-linear-algebra-eigenvectors" aria-labelledby="lab-la-eig-t">
  <header class="lab-head">
    <span class="syl-phase">Explore it</span>
    <h3 id="lab-la-eig-t">Find the arrows that keep their line</h3>
  </header>
  <p class="lab-eq"><i>A</i><b>v</b> = <i>λ</i><b>v</b> &nbsp; <span class="lab-term is-q" data-term="e1"><i>λ</i>₁ = <span data-val="l1">2.50</span></span>, <span class="lab-term is-k" data-term="e2"><i>λ</i>₂ = <span data-val="l2">1.00</span></span> &nbsp; <span class="lab-term is-o" data-term="poly">det(<i>A</i> − <i>λI</i>) = <i>λ</i>² <span data-val="trs">− 3.50</span><i>λ</i> <span data-val="dets">+ 2.50</span></span></p>
  <div class="lab-main">
    <div class="lab-stage" data-stage></div>
    <div data-guide-box></div>
  </div>
  <div class="lab-ctl" data-ctl></div>
  <p class="lab-say" aria-live="polite" data-say></p>
</section>
```

- [ ] **Step 6: Write the explainer**

Replace `  /* MOUNT */` with:

```js
  XP.lab('linear-algebra/eigenvectors', function (root, api) {
    var fmt = XP.fmt, svgEl = XP.svgEl, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var DEF = [2, 1, 0.5, 1.5];
    var PRESETS = { 'Your matrix': DEF, 'Symmetric': [2, 1, 1, 2], 'Quarter turn': [0, -1, 1, 0], 'Shear': [1, 1, 0, 1], 'Shrinking': [0.6, 0.2, 0.1, 0.5] };
    var R = 1.2, FAN = [], CLOUD = [], k;
    for (k = 0; k < 24; k++) FAN.push([R * Math.cos(k * Math.PI / 12), R * Math.sin(k * Math.PI / 12)]);
    for (k = 0; k < 12; k++) CLOUD.push([Math.cos((k + 0.5) * Math.PI / 12), Math.sin((k + 0.5) * Math.PI / 12)]);
    var START = { m: DEF.slice(), t: 0, mode: 'fan', n: 0, dirs: CLOUD.map(function (d) { return d.slice(); }) };
    var s = JSON.parse(JSON.stringify(START));
    var P = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'A fan of arrows under A, with the eigenvectors on their own lines' });
    var Q = XP.plane(stage, { x: [-3, 5], y: [-3, 6], w: 480, h: 150, label: 'The characteristic polynomial against lambda, crossing 0 at the eigenvalues' });
    var dlg = XP.dialog(root);

    ctl.innerHTML =
      '<label>apply <input type="range" data-k="t" min="0" max="1" step="0.01" aria-label="How much of A to show"></label>' +
      '<button type="button" data-act="play">Play</button>' +
      '<button type="button" data-act="again">Apply again</button>' +
      '<label>preset <select data-k="preset" aria-label="Preset matrix">' + Object.keys(PRESETS).map(function (n) { return '<option>' + n + '</option>'; }).join('') + '</select></label>' +
      '<button type="button" data-zoom="poly">Characteristic polynomial, worked</button>' +
      '<button type="button" data-zoom="diag">A = QΛQ⁻¹, worked</button>' +
      '<button type="button" data-reset>Reset</button>';
    var tIn = ctl.querySelector('[data-k="t"]'), preset = ctl.querySelector('[data-k="preset"]');

    function col(c, label, cls, part) {
      return P.handle({ x: s.m[c], y: s.m[2 + c], label: label, cls: cls, part: part, onMove: function (x, y, done) {
        s.m[c] = x; s.m[2 + c] = y; s.t = 1; s.mode = 'fan'; draw(); if (done) report();
      } });
    }
    var hi = col(0, 'Where î lands', 'is-q', 'i'), hj = col(1, 'Where ĵ lands', 'is-k', 'j');

    function unit(v) { var n = Math.sqrt(v[0] * v[0] + v[1] * v[1]); return n < 1e-12 ? [1, 0] : [v[0] / n, v[1] / n]; }
    function lineThrough(d, cls, part) {
      return svgEl('line', { x1: P.map.sx(-12 * d[0]), y1: P.map.sy(-12 * d[1]), x2: P.map.sx(12 * d[0]), y2: P.map.sy(12 * d[1]), 'class': cls, 'data-part': part });
    }

    function drawPoly(e) {
      var pts = [];
      for (var x = -3; x <= 5.001; x += 0.1) pts.push([x, charPoly(s.m, x)]);
      var h = svgEl('line', { x1: 0, y1: Q.map.sy(0), x2: Q.w, y2: Q.map.sy(0), 'class': 'pl-axis' }) +
        '<polyline class="pl-curve is-o" data-part="poly" points="' + Q.pts(pts) + '"/>';
      if (e.real) {
        h += Q.dot(e.values[0], 0, 5, 'pl-mark pl-root is-q', 'e1 poly');
        if (e.vectors.length === 2) h += Q.dot(e.values[1], 0, 5, 'pl-mark pl-root is-k', 'e2 poly');
      }
      Q.plot.innerHTML = h;
    }

    function draw() {
      var m = s.m, e = eig(m), mt = blend(m, s.t), tv = tr(m), dv = det(m);
      tIn.value = s.t;
      api.values({
        l1: e.real ? fmt(e.values[0]) : fmt(e.re) + ' + ' + fmt(e.im) + 'i',
        l2: e.real ? fmt(e.values[1]) : fmt(e.re) + ' − ' + fmt(e.im) + 'i',
        trs: (tv >= 0 ? '− ' : '+ ') + fmt(Math.abs(tv)), dets: (dv >= 0 ? '+ ' : '− ') + fmt(Math.abs(dv))
      });
      P.grid.innerHTML = P.gridMarkup(null, 1, 'pl-std is-faint') + P.axes();
      var h = '';
      if (s.mode === 'fan') {
        var circle = [];
        for (var a = 0; a < 72; a++) {
          var p = [Math.cos(a * Math.PI / 36), Math.sin(a * Math.PI / 36)];
          circle.push(apply(mt, p));
        }
        h += '<polygon class="pl-circle" data-part="circle" points="' + P.pts(circle) + '"/>';
        FAN.forEach(function (v) {
          h += lineThrough(unit(v), 'pl-fanline is-faint', 'fan');
          var w = apply(mt, v);
          h += P.arrow(0, 0, w[0], w[1], knock(m, v) < 0.02 ? 'is-o' : 'is-muted', 'fan');
        });
      } else {
        CLOUD.forEach(function (d, j) {
          var q = s.dirs[j];
          h += P.arrow(0, 0, 2.2 * q[0], 2.2 * q[1], 'is-muted', 'cloud');
        });
      }
      if (e.real) {
        e.vectors.forEach(function (v, j) {
          var cls = j === 0 ? 'is-q' : 'is-k', part = j === 0 ? 'e1' : 'e2', lam = e.vectors.length === 2 ? e.values[j] : e.values[0];
          var len = s.mode === 'fan' ? R * (1 + (lam - 1) * s.t) : 2.4;
          h += lineThrough(v, 'pl-line ' + cls + ' is-faint', part);
          h += P.arrow(0, 0, len * v[0], len * v[1], cls, part);
        });
      }
      P.plot.innerHTML = h;
      drawPoly(e);
      hi.set(mt[0], mt[2]); hj.set(mt[1], mt[3]);
      hi.show(s.mode === 'fan'); hj.show(s.mode === 'fan');
    }

    function report() {
      var e = eig(s.m);
      if (!e.real) {
        api.say('This matrix turns every line, so it has no real eigenvector. Its eigenvalues are ' + fmt(e.re) + ' plus or minus ' + fmt(e.im) + 'i.');
        return;
      }
      var words = e.vectors.length === 1 ? 'Only 1 direction stays on its line, with eigenvalue ' + fmt(e.values[0]) + '.' :
        'The eigenvalues are ' + fmt(e.values[0]) + ' and ' + fmt(e.values[1]) + '.';
      api.say(words + (s.mode === 'iterate' ? ' After ' + s.n + ' applications, the directions have swung towards the eigenvector with the largest size of eigenvalue.' : ''));
    }
    function goTo(target) {
      var from = { m: s.m.slice(), t: s.t }, to = { m: target.m ? target.m.slice() : s.m.slice(), t: 't' in target ? target.t : s.t };
      if ('mode' in target && target.mode !== s.mode) {
        s.mode = target.mode; s.n = 0; s.dirs = CLOUD.map(function (d) { return d.slice(); });
      }
      api.animate(from, to, 800, function (st) { s.m = st.m.slice(); s.t = st.t; draw(); }, function () {
        report();
        if (target.n) iterate(target.n);
      });
    }
    /* Apply A to every direction `times` more times, each step animated. */
    function iterate(times) {
      if (!times) return;
      s.mode = 'iterate';
      var next = s.dirs.map(function (d) { return unit(apply(s.m, d)); });
      api.animate({ dirs: s.dirs }, { dirs: next }, 450, function (st) { s.dirs = st.dirs.map(unit); draw(); }, function () {
        s.n += 1; report();
        if (times > 1) iterate(times - 1);
      });
    }

    function table(rows) {
      return '<table class="xp-table lab-table"><tbody>' + rows.map(function (r) {
        return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>';
      }).join('') + '</tbody></table>';
    }
    function zoomPoly(btn) {
      var m = s.m, tv = tr(m), dv = det(m), disc = tv * tv / 4 - dv, e = eig(m);
      var rows = [['trace = a + d', fmt(m[0]) + ' + ' + fmt(m[3]) + ' = ' + fmt(tv)], ['det = a d − b c', fmt(dv)],
        ['(trace ÷ 2)² − det', fmt(disc)]];
      rows.push(e.real ? ['λ = trace ÷ 2 ± √((trace ÷ 2)² − det)', fmt(e.values[0]) + ' and ' + fmt(e.values[1])] :
        ['λ = trace ÷ 2 ± i √(det − (trace ÷ 2)²)', fmt(e.re) + ' ± ' + fmt(e.im) + 'i']);
      dlg.open('Characteristic polynomial, worked', table(rows) + '<p>Av = λv has a nonzero answer exactly when A − λI squashes the plane, so det(A − λI) = 0.</p>', btn);
    }
    function zoomDiag(btn) {
      var e = eig(s.m), n = Math.max(1, s.n || 5);
      if (!e.real || e.vectors.length < 2) {
        dlg.open('A = QΛQ⁻¹, worked', '<p>' + (e.real ? 'This matrix has only 1 eigenvector direction, so there is no Q to build.' :
          'The eigenvalues are complex, so Q and Λ need complex numbers.') + ' Repeated multiplication still works.</p>', btn);
        return;
      }
      var q = e.vectors, Qm = [q[0][0], q[1][0], q[0][1], q[1][1]], dq = Qm[0] * Qm[3] - Qm[1] * Qm[2];
      var Qi = [Qm[3] / dq, -Qm[1] / dq, -Qm[2] / dq, Qm[0] / dq];
      var ln = [Math.pow(e.values[0], n), Math.pow(e.values[1], n)];
      var viaQ = [Qm[0] * ln[0] * Qi[0] + Qm[1] * ln[1] * Qi[2], Qm[0] * ln[0] * Qi[1] + Qm[1] * ln[1] * Qi[3],
        Qm[2] * ln[0] * Qi[0] + Qm[3] * ln[1] * Qi[2], Qm[2] * ln[0] * Qi[1] + Qm[3] * ln[1] * Qi[3]];
      var byHand = power(s.m, [1, 0], n).concat(power(s.m, [0, 1], n));
      function mat(x) { return '[[' + fmt(x[0]) + ', ' + fmt(x[1]) + '], [' + fmt(x[2]) + ', ' + fmt(x[3]) + ']]'; }
      dlg.open('A = QΛQ⁻¹, worked', table([
        ['Q, the eigenvectors as columns', mat(Qm)],
        ['Λ, the eigenvalues', 'diag(' + fmt(e.values[0]) + ', ' + fmt(e.values[1]) + ')'],
        ['A to the power ' + n + ' = Q Λ^' + n + ' Q⁻¹', mat(viaQ)],
        ['The same, multiplying ' + n + ' times', mat([byHand[0], byHand[2], byHand[1], byHand[3]])]
      ]) + '<p>Raising Λ to a power only raises each eigenvalue, which is why repetition is easy in this basis.</p>', btn);
    }

    ctl.addEventListener('input', function (e) { if (e.target === tIn) { s.t = +tIn.value; s.mode = 'fan'; draw(); } });
    ctl.addEventListener('change', function (e) {
      if (e.target === preset) goTo({ m: PRESETS[preset.value], t: 1, mode: 'fan' });
      else report();
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act'), z = b.getAttribute('data-zoom');
      if (z === 'poly') return zoomPoly(b);
      if (z === 'diag') return zoomDiag(b);
      if (act === 'play') { s.t = 0; goTo({ t: 1, mode: 'fan' }); return; }
      if (act === 'again') { iterate(1); return; }
      if (b.hasAttribute('data-reset')) { api.interrupt(); s = JSON.parse(JSON.stringify(START)); preset.value = 'Your matrix'; }
      draw(); report();
    });

    var PAGES = [
      { t: 'A fan of arrows', parts: ['fan'], state: { m: DEF, t: 0, mode: 'fan' },
        body: '<p>24 arrows point every way round the circle. Each one sits on its own faint line through the origin.</p>' },
      { t: 'Apply A', parts: ['fan'], state: { t: 1 },
        body: '<p>Almost every arrow is knocked off its line. The faint lines still show where each one started.</p>' },
      { t: 'The arrows that stay', parts: ['e1', 'e2'], state: { t: 1 },
        body: '<p>2 directions stay on their lines and only stretch: by 2.5 along <b class="is-q">(2, 1)</b> and by 1 along <b class="is-k">(1, −1)</b>. Those are the eigenvectors, and the stretches are the eigenvalues.</p>' },
      { t: 'The circle becomes an ellipse', parts: ['circle', 'e1', 'e2'], state: { t: 1 },
        body: '<p>Push the whole unit circle through A and it becomes an ellipse. The eigenvectors land on their own lines.</p>' },
      { t: 'Where they come from', parts: ['poly', 'e1', 'e2'], state: { t: 1 },
        body: '<p>Av = λv means (A − λI)v = 0, so det(A − λI) = 0. The <b class="is-o">parabola</b> below crosses 0 at λ = 2.5 and λ = 1.</p>' },
      { t: 'Apply again and again', parts: ['cloud', 'e1'], state: { mode: 'iterate', n: 6 },
        body: '<p>Apply A 6 times to 12 directions. Each one swings towards <b class="is-q">(2, 1)</b>, the eigenvector with the largest eigenvalue.</p>' },
      { t: 'Turns and symmetry', parts: ['fan', 'e1', 'e2'], state: { m: [0, -1, 1, 0], t: 1, mode: 'fan' },
        body: '<p>A quarter turn moves every line, so it has no real eigenvector. Pick <b>Symmetric</b> and its 2 eigenvectors meet at a right angle.</p>' }
    ];
    draw();
    XP.guide(root.querySelector('[data-guide-box]'), PAGES, function (p, i, redraw) {
      if (!p) { api.focus([]); return; }
      if (!redraw) goTo(p.state);
      api.focus(p.parts);
    });
  });
```

- [ ] **Step 7: Register it and add its styles**

In `_data/module_labs.yml`, add:

```yaml
  '3': eigenvectors
```

In the Linear Algebra section of `css/labs.css`, add:

```css
.lab-plane .is-muted { color: var(--muted); }
.lab-plane .pl-fanline { stroke: var(--muted); stroke-width: 1; }
.lab-plane .pl-circle { fill: color-mix(in srgb, var(--xp-o) 10%, transparent); stroke: var(--xp-o); stroke-width: 1.5; }
.lab-plane .pl-curve { fill: none; stroke: currentColor; stroke-width: 2.5; }
.lab-plane .pl-root.is-q { fill: var(--xp-q); } .lab-plane .pl-root.is-k { fill: var(--xp-k); }
.lab-stage .lab-plane + .lab-plane { margin-top: 0.5rem; }
```

- [ ] **Step 8: Build and run every check**

Run the same commands as Task 3, Step 8.

Expected:
- `4 checks passed`.
- `1 tracks checked, 0 problems`.
- No bounds line.

At `/linear-algebra/#m4`, confirm these 3 behaviours:
- Page 3 lights 2 arrows that stay on their lines.
- Page 6 swings all 12 directions towards (2, 1).
- The quarter-turn preset draws no eigenvector.

- [ ] **Step 9: Commit**

```bash
git add js/labs/linear-algebra/eigenvectors.js _includes/labs/linear-algebra/eigenvectors.html \
  scripts/verify_labs.py _data/module_labs.yml css/labs.css
git commit -m "Add the eigenvectors explainer to Linear Algebra"
```

---

### Task 7: Linear Algebra 5, decompositions

**Files:**
- Create: `js/labs/linear-algebra/decompositions.js` and `_includes/labs/linear-algebra/decompositions.html`
- Modify: `scripts/verify_labs.py`, `_data/module_labs.yml` and `css/labs.css`

**Interfaces:**
- Consumes:
  - Task 1's helpers;
  - `assets/data/tiny-vgg.json`, whose `samples` hold 10 entries of `{ name, rgb }`. `rgb` is the base64 of 64 × 64 × 3 bytes, row by row. Step 1 confirms this layout.
- Produces these exports:
  - `svd2(m) -> { U, S: [s1, s2], Vt, theta }`, with `U` and `Vt` as `[a, b, c, d]` by rows and s1 ≥ s2 ≥ 0;
  - `stageMatrix(dec, f)` for f in [0, 3];
  - `svd(A) -> { U, S, V }`, a one-sided Jacobi SVD with arrays of rows and S descending;
  - `lowRank(dec, k)`, `tailError(S, k)` and `frob(A, B)`;
  - `pca(points) -> { mean, axes: [[x, y], [x, y]], vars: [l1, l2] }`, where the covariance divides by N;
  - `chol2(m) -> [l11, 0, l21, l22] | null`;
  - `decodeGray(b64, w, h)`, which returns an array of rows with values in [0, 1].

- [ ] **Step 1: Write the failing maths check**

Add to `scripts/verify_labs.py`:

```python
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
```

The function uses `json` and `os`, which `verify_labs.py` already imports.

- [ ] **Step 2: Run it to check that it fails**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/decompositions`

Expected: it fails with `Cannot find module`.

- [ ] **Step 3: Write the pure maths**

Create `js/labs/linear-algebra/decompositions.js`:

```js
/* ════════════════════════════════════════════════════════
   Linear Algebra, module 5: decompositions.
   The SVD of a 2 by 2 matrix plays as rotate, stretch, rotate; a real 64 by
   64 image is rebuilt from its k largest singular values; PCA is the SVD of
   a centred cloud; and Cholesky splits a positive definite matrix as L Lᵀ.
   ════════════════════════════════════════════════════════ */
(function () {

  function mul(B, A) {
    return [B[0] * A[0] + B[1] * A[2], B[0] * A[1] + B[1] * A[3], B[2] * A[0] + B[3] * A[2], B[2] * A[1] + B[3] * A[3]];
  }
  function rot(t) { var c = Math.cos(t), s = Math.sin(t); return [c, -s, s, c]; }

  /* SVD of a 2 by 2 matrix from the eigenvectors of AᵀA. theta is the angle
     of v1; U may be a reflection, and Vt is always a rotation. */
  function svd2(m) {
    var a = m[0], b = m[1], c = m[2], d = m[3];
    var p = a * a + c * c, q = a * b + c * d, r = b * b + d * d;
    var th = 0.5 * Math.atan2(2 * q, p - r), cs = Math.cos(th), sn = Math.sin(th);
    var av1 = [a * cs + b * sn, c * cs + d * sn], av2 = [-a * sn + b * cs, -c * sn + d * cs];
    var s1 = Math.sqrt(av1[0] * av1[0] + av1[1] * av1[1]), s2 = Math.sqrt(av2[0] * av2[0] + av2[1] * av2[1]);
    var u1 = s1 > 1e-12 ? [av1[0] / s1, av1[1] / s1] : [1, 0];
    var u2 = s2 > 1e-12 * Math.max(1, s1) ? [av2[0] / s2, av2[1] / s2] : [-u1[1], u1[0]];
    return { U: [u1[0], u2[0], u1[1], u2[1]], S: [s1, s2], Vt: [cs, sn, -sn, cs], theta: th };
  }

  /* The matrix on screen at f in [0, 3]: Vᵀ turns in over [0, 1], Σ
     stretches over [1, 2], U turns over [2, 3]. A reflection in U is folded
     into the stretch as a negative σ₂, so every stage is a smooth motion. */
  function stageMatrix(dec, f) {
    var U = dec.U, flip = U[0] * U[3] - U[1] * U[2] < 0;
    var s2 = flip ? -dec.S[1] : dec.S[1], Ur = flip ? [U[0], -U[1], U[2], -U[3]] : U;
    var Vt = rot(-dec.theta);
    if (f <= 1) return rot(-dec.theta * f);
    if (f <= 2) { var g = f - 1; return mul([1 + (dec.S[0] - 1) * g, 0, 0, 1 + (s2 - 1) * g], Vt); }
    return mul(rot(Math.atan2(Ur[2], Ur[0]) * (f - 2)), mul([dec.S[0], 0, 0, s2], Vt));
  }

  /* One-sided Jacobi SVD of an m by n matrix, m ≥ n, as arrays of rows.
     Returns U (m by n), S (descending) and V (n by n). */
  function svd(A) {
    var m = A.length, n = A[0].length, U = A.map(function (r) { return r.slice(); }), V = [], i, j, k, x, y;
    for (i = 0; i < n; i++) { V.push([]); for (j = 0; j < n; j++) V[i].push(i === j ? 1 : 0); }
    for (var sweep = 0; sweep < 60; sweep++) {
      var off = 0;
      for (i = 0; i < n - 1; i++) {
        for (j = i + 1; j < n; j++) {
          var a = 0, b = 0, c = 0;
          for (k = 0; k < m; k++) { a += U[k][i] * U[k][i]; b += U[k][j] * U[k][j]; c += U[k][i] * U[k][j]; }
          if (a === 0 || b === 0 || Math.abs(c) <= 1e-15 * Math.sqrt(a * b)) continue;
          off = Math.max(off, Math.abs(c) / Math.sqrt(a * b));
          var z = (b - a) / (2 * c), t = (z >= 0 ? 1 : -1) / (Math.abs(z) + Math.sqrt(1 + z * z));
          var cs = 1 / Math.sqrt(1 + t * t), sn = cs * t;
          for (k = 0; k < m; k++) { x = U[k][i]; y = U[k][j]; U[k][i] = cs * x - sn * y; U[k][j] = sn * x + cs * y; }
          for (k = 0; k < n; k++) { x = V[k][i]; y = V[k][j]; V[k][i] = cs * x - sn * y; V[k][j] = sn * x + cs * y; }
        }
      }
      if (off < 1e-14) break;
    }
    var S = [];
    for (j = 0; j < n; j++) { var q = 0; for (k = 0; k < m; k++) q += U[k][j] * U[k][j]; S.push(Math.sqrt(q)); }
    var order = S.map(function (v, idx) { return idx; }).sort(function (p, q2) { return S[q2] - S[p]; });
    return {
      S: order.map(function (idx) { return S[idx]; }),
      U: U.map(function (r) { return order.map(function (idx) { return S[idx] > 1e-300 ? r[idx] / S[idx] : 0; }); }),
      V: V.map(function (r) { return order.map(function (idx) { return r[idx]; }); })
    };
  }

  /* The best rank k copy: the first k terms of Σ σ_r u_r v_rᵀ. */
  function lowRank(dec, k) {
    var m = dec.U.length, n = dec.V.length, out = [];
    for (var i = 0; i < m; i++) {
      var row = [];
      for (var j = 0; j < n; j++) {
        var v = 0;
        for (var r = 0; r < k; r++) v += dec.S[r] * dec.U[i][r] * dec.V[j][r];
        row.push(v);
      }
      out.push(row);
    }
    return out;
  }
  function tailError(S, k) { var e = 0; for (var r = k; r < S.length; r++) e += S[r] * S[r]; return Math.sqrt(e); }
  function frob(A, B) {
    var e = 0;
    for (var i = 0; i < A.length; i++) for (var j = 0; j < A[0].length; j++) e += (A[i][j] - B[i][j]) * (A[i][j] - B[i][j]);
    return Math.sqrt(e);
  }

  /* Principal axes of a 2D cloud: the eigenvectors of its covariance, which
     divides by N as in the module's equation. */
  function pca(points) {
    var N = points.length, mx = 0, my = 0, sxx = 0, syy = 0, sxy = 0;
    points.forEach(function (p) { mx += p[0] / N; my += p[1] / N; });
    points.forEach(function (p) { var dx = p[0] - mx, dy = p[1] - my; sxx += dx * dx / N; syy += dy * dy / N; sxy += dx * dy / N; });
    var th = 0.5 * Math.atan2(2 * sxy, sxx - syy), mid = (sxx + syy) / 2, rad = Math.sqrt((sxx - syy) * (sxx - syy) / 4 + sxy * sxy);
    return { mean: [mx, my], axes: [[Math.cos(th), Math.sin(th)], [-Math.sin(th), Math.cos(th)]], vars: [mid + rad, mid - rad] };
  }

  /* L with A = L Lᵀ for a symmetric positive definite 2 by 2, or null. */
  function chol2(m) {
    if (Math.abs(m[1] - m[2]) > 1e-12 || m[0] <= 0 || m[0] * m[3] - m[1] * m[2] <= 0) return null;
    var l11 = Math.sqrt(m[0]), l21 = m[1] / l11;
    return [l11, 0, l21, Math.sqrt(m[3] - l21 * l21)];
  }

  /* A sample image as gray levels in [0, 1], rows first. */
  function decodeGray(b64, w, h) {
    var bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary'), out = [];
    for (var y = 0; y < h; y++) {
      var row = [];
      for (var x = 0; x < w; x++) {
        var o = 3 * (y * w + x);
        row.push((0.299 * bin.charCodeAt(o) + 0.587 * bin.charCodeAt(o + 1) + 0.114 * bin.charCodeAt(o + 2)) / 255);
      }
      out.push(row);
    }
    return out;
  }

  var M = { mul: mul, rot: rot, svd2: svd2, stageMatrix: stageMatrix, svd: svd, lowRank: lowRank, tailError: tailError,
    frob: frob, pca: pca, chol2: chol2, decodeGray: decodeGray };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  /* MOUNT */
})();
```

- [ ] **Step 4: Run the check to confirm that it passes**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/decompositions`

Expected: it prints `ok linear-algebra/decompositions`.

If `gray image` fails on the byte layout, print `raw[:6]` in Python and `bin.charCodeAt(0..5)` in Node, then fix `decodeGray` to match the file. Never loosen the check.

- [ ] **Step 5: Write the include**

Create `_includes/labs/linear-algebra/decompositions.html`:

```html
<section class="xp lab" id="lab-linear-algebra-decompositions" aria-labelledby="lab-la-svd-t">
  <header class="lab-head">
    <span class="syl-phase">Explore it</span>
    <h3 id="lab-la-svd-t">Split a matrix into rotate, stretch, rotate</h3>
  </header>
  <p class="lab-eq"><i>A</i> = <span class="lab-term is-o" data-term="u">U</span><span class="lab-term is-k" data-term="sigma">Σ</span><span class="lab-term is-q" data-term="vt">Vᵀ</span> &nbsp; <i>σ</i>₁ = <span data-val="s1">1.96</span>, <i>σ</i>₂ = <span data-val="s2">0.92</span> &nbsp; <span class="lab-term" data-term="tail">rank <span data-val="k">8</span> error <span data-val="err">–</span></span></p>
  <div class="lab-main">
    <div class="lab-stage" data-stage>
      <div class="lab-images" data-images hidden>
        <figure><canvas width="64" height="64" data-img="orig" role="img" aria-label="The original sample image"></canvas><figcaption>original</figcaption></figure>
        <figure><canvas width="64" height="64" data-img="rank" role="img" aria-label="The image rebuilt from its largest singular values"></canvas><figcaption>rank <span data-val="k">8</span> copy</figcaption></figure>
      </div>
    </div>
    <div data-guide-box></div>
  </div>
  <div class="lab-ctl" data-ctl></div>
  <p class="lab-say" aria-live="polite" data-say></p>
  <p class="lab-src">The sample images are the Tiny VGG samples from <a href="https://poloclub.github.io/cnn-explainer/" rel="noopener noreferrer">CNN Explainer</a> (<a href="https://github.com/poloclub/cnn-explainer" rel="noopener noreferrer">code</a>, MIT licence) by the Polo Club of Data Science. <code>scripts/verify_labs.py</code> checks every singular value against NumPy. <a href="/third-party-notices/">Licences</a>.</p>
</section>
```

- [ ] **Step 6: Write the explainer**

Replace `  /* MOUNT */` with:

```js
  XP.lab('linear-algebra/decompositions', function (root, api) {
    var fmt = XP.fmt, svgEl = XP.svgEl, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var images = root.querySelector('[data-images]'), dlg = XP.dialog(root);
    var DEF = [1.5, 1, 0, 1.2], CHOL = [2, 0.6, 0.6, 1];
    var r = XP.rng(7), CLOUD = [];
    for (var i = 0; i < 10; i++) {
      var g1 = XP.gauss(r), g2 = XP.gauss(r);
      CLOUD.push([Math.round((1.8 * g1 + 0.3 * g2) * 10) / 10, Math.round((0.9 * g1 + 0.5 * g2) * 10) / 10]);
    }
    var START = { m: DEF.slice(), f: 0, mode: 'svd', k: 8, sample: 0, pts: CLOUD.map(function (p) { return p.slice(); }) };
    var s = JSON.parse(JSON.stringify(START)), data = null, cache = {};
    var P = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'The unit circle through the stages of the singular value decomposition' });
    var SP = XP.plane(images, { x: [0, 64], y: [-4, 2], w: 480, h: 120, pad: 4, label: 'Singular values of the image on a log scale, kept ones in colour' });
    stage.insertBefore(images, P.svg.nextSibling);

    ctl.innerHTML =
      '<label>view <select data-k="mode" aria-label="What to show"><option value="svd">Rotate, stretch, rotate</option><option value="image">An image</option><option value="pca">PCA</option><option value="chol">Cholesky</option></select></label>' +
      '<label>stage <input type="range" data-k="f" min="0" max="3" step="0.01" aria-label="How far through the 3 stages"></label>' +
      '<button type="button" data-act="play">Play</button>' +
      '<label>k <input type="range" data-k="k" min="1" max="64" step="1" aria-label="How many singular values to keep"></label>' +
      '<label>image <select data-k="sample" aria-label="Sample image"></select></label>' +
      '<button type="button" data-zoom="values">Singular values</button>' +
      '<button type="button" data-zoom="error">Rank k error, worked</button>' +
      '<button type="button" data-reset>Reset</button>';
    var el = {};
    Array.prototype.forEach.call(ctl.querySelectorAll('[data-k]'), function (x) { el[x.getAttribute('data-k')] = x; });

    function col(c, label, cls, part) {
      return P.handle({ x: s.m[c], y: s.m[2 + c], label: label, cls: cls, part: part, onMove: function (x, y, done) {
        s.m[c] = x; s.m[2 + c] = y; s.f = 3; draw(); if (done) report();
      } });
    }
    var hi = col(0, 'Where î lands', 'is-q', 'i'), hj = col(1, 'Where ĵ lands', 'is-k', 'j');
    var hp = CLOUD.map(function (p, j) {
      return P.handle({ x: p[0], y: p[1], label: 'Data point ' + (j + 1), cls: 'is-v', part: 'cloud', onMove: function (x, y, done) {
        s.pts[j] = [x, y]; draw(); if (done) report();
      } });
    });

    /* Load the sample images the first time the image view is shown. */
    function ensureImages(then) {
      if (data) return then();
      fetch('/assets/data/tiny-vgg.json').then(function (res) { return res.json(); }).then(function (j) {
        data = j.samples;
        el.sample.innerHTML = data.map(function (smp, n) { return '<option value="' + n + '">' + XP.esc(smp.name.replace(/_/g, ' ')) + '</option>'; }).join('');
        el.sample.value = s.sample;
        then();
      }).catch(function (err) { api.say('The sample images did not load.'); if (typeof console !== 'undefined') console.error(err); });
    }
    function imageSvd(n) {
      if (!cache[n]) { var g = decodeGray(data[n].rgb, 64, 64); cache[n] = { gray: g, dec: svd(g) }; }
      return cache[n];
    }
    function paint(canvas, rows) {
      var ctx = canvas.getContext('2d'), im = ctx.createImageData(64, 64);
      for (var y = 0; y < 64; y++) {
        for (var x = 0; x < 64; x++) {
          var v = Math.max(0, Math.min(255, Math.round(rows[y][x] * 255))), o = 4 * (y * 64 + x);
          im.data[o] = im.data[o + 1] = im.data[o + 2] = v; im.data[o + 3] = 255;
        }
      }
      ctx.putImageData(im, 0, 0);
    }

    function draw() {
      var mode = s.mode;
      el.mode.value = mode; el.f.value = s.f; el.k.value = s.k;
      el.f.parentNode.hidden = !(mode === 'svd' || mode === 'chol');
      ctl.querySelector('[data-act="play"]').hidden = el.f.parentNode.hidden;
      el.k.parentNode.hidden = el.sample.parentNode.hidden = mode !== 'image';
      images.hidden = mode !== 'image';
      P.svg.style.display = mode === 'image' ? 'none' : '';
      hi.show(mode === 'svd'); hj.show(mode === 'svd');
      hp.forEach(function (h, j) { h.show(mode === 'pca'); h.set(s.pts[j][0], s.pts[j][1]); });
      if (mode === 'image') { drawImage(); return; }
      P.grid.innerHTML = P.gridMarkup(null, 1, 'pl-std is-faint') + P.axes();
      var h = '', circle = [], a;
      if (mode === 'svd') {
        var dec = svd2(s.m), T = stageMatrix(dec, s.f);
        api.values({ s1: dec.S[0], s2: dec.S[1] });
        for (a = 0; a < 72; a++) circle.push(apply2(T, [Math.cos(a * Math.PI / 36), Math.sin(a * Math.PI / 36)]));
        P.grid.innerHTML += P.gridMarkup(T, 1, 'pl-moved');
        var v1 = apply2(T, [dec.Vt[0], dec.Vt[1]]), v2 = apply2(T, [dec.Vt[2], dec.Vt[3]]);
        h += '<polygon class="pl-circle" data-part="sigma" points="' + P.pts(circle) + '"/>';
        h += P.arrow(0, 0, v1[0], v1[1], 'is-q', 'vt u') + P.arrow(0, 0, v2[0], v2[1], 'is-k', 'vt u');
        hi.set(s.m[0], s.m[2]); hj.set(s.m[1], s.m[3]);
        hi.show(s.f >= 3); hj.show(s.f >= 3);
      } else if (mode === 'pca') {
        var p = pca(s.pts);
        api.values({ s1: Math.sqrt(p.vars[0] * s.pts.length), s2: Math.sqrt(Math.max(0, p.vars[1]) * s.pts.length) });
        [0, 1].forEach(function (j) {
          var len = 2 * Math.sqrt(Math.max(0, p.vars[j])), ax = p.axes[j];
          h += P.arrow(p.mean[0], p.mean[1], p.mean[0] + len * ax[0], p.mean[1] + len * ax[1], j === 0 ? 'is-q' : 'is-k', 'vt');
        });
      } else {
        var L = chol2(CHOL), Lt = [1 + (L[0] - 1) * s.f / 3, 0, L[2] * s.f / 3, 1 + (L[3] - 1) * s.f / 3];
        api.values({ s1: L[0], s2: L[3] });
        for (a = 0; a < 72; a++) circle.push(apply2(Lt, [Math.cos(a * Math.PI / 36), Math.sin(a * Math.PI / 36)]));
        h += '<polygon class="pl-circle" data-part="sigma" points="' + P.pts(circle) + '"/>';
        h += P.arrow(0, 0, Lt[0], Lt[2], 'is-q', 'vt') + P.arrow(0, 0, Lt[1], Lt[3], 'is-k', 'vt');
      }
      P.plot.innerHTML = h;
    }
    function apply2(m, v) { return [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]]; }

    function drawImage() {
      ensureImages(function () {
        var c = imageSvd(s.sample), rec = lowRank(c.dec, s.k), err = tailError(c.dec.S, s.k);
        paint(root.querySelector('[data-img="orig"]'), c.gray);
        paint(root.querySelector('[data-img="rank"]'), rec);
        api.values({ s1: c.dec.S[0], s2: c.dec.S[1], err: err });
        api.values({ k: s.k }, 0);
        var h = '', top = Math.log10(c.dec.S[0]);
        c.dec.S.forEach(function (v, j) {
          var y = Math.max(-4, Math.log10(Math.max(v, 1e-12)) - top + 1);
          h += svgEl('rect', { x: SP.map.sx(j), y: SP.map.sy(y), width: Math.max(1, SP.map.sx(1) - SP.map.sx(0) - 1), height: SP.map.sy(-4) - SP.map.sy(y),
            'class': j < s.k ? 'pl-bar pl-mark' : 'pl-bar is-faint', 'data-part': j < s.k ? 'sigma' : 'tail' });
        });
        SP.plot.innerHTML = h;
      });
    }

    function report() {
      if (s.mode === 'image' && data) {
        var c = imageSvd(s.sample);
        api.say('Keeping ' + s.k + ' of 64 singular values. The error is ' + fmt(tailError(c.dec.S, s.k)) + ', the square root of the dropped squares.');
      } else if (s.mode === 'svd') {
        var d = svd2(s.m);
        api.say('The singular values are ' + fmt(d.S[0]) + ' and ' + fmt(d.S[1]) + '. Stage ' + fmt(s.f, 1) + ' of 3.');
      } else if (s.mode === 'pca') {
        api.say('The first principal axis carries ' + fmt(100 * pca(s.pts).vars[0] / (pca(s.pts).vars[0] + pca(s.pts).vars[1]), 0) + ' percent of the variance.');
      } else {
        api.say('L is lower triangular, and L times L transposed rebuilds the matrix.');
      }
    }
    function goTo(target) {
      if ('mode' in target) s.mode = target.mode;
      if ('k' in target) s.k = target.k;
      var from = { f: s.f, m: s.m.slice() }, to = { f: 'f' in target ? target.f : s.f, m: target.m ? target.m.slice() : s.m.slice() };
      api.animate(from, to, 800, function (st) { s.f = st.f; s.m = st.m.slice(); draw(); }, report);
    }

    function table(rows) {
      return '<table class="xp-table lab-table"><tbody>' + rows.map(function (x) {
        return '<tr><th scope="row">' + x[0] + '</th><td>' + x[1] + '</td></tr>';
      }).join('') + '</tbody></table>';
    }
    function zoomValues(btn) {
      if (s.mode === 'image' && data) {
        var S = imageSvd(s.sample).dec.S, total = S.reduce(function (t, v) { return t + v * v; }, 0), acc = 0;
        dlg.open('Singular values', table(S.slice(0, 12).map(function (v, j) {
          acc += v * v;
          return ['σ' + (j + 1), fmt(v, 3) + ' (the first ' + (j + 1) + ' hold ' + fmt(100 * acc / total, 1) + '% of Σ σ²)'];
        })) + '<p>The first 12 of 64. They fall fast, which is why a few of them rebuild most of the picture.</p>', btn);
        return;
      }
      var d = svd2(s.m);
      dlg.open('Singular values', table([['σ₁', fmt(d.S[0], 3)], ['σ₂', fmt(d.S[1], 3)], ['σ₁ σ₂ = |det A|', fmt(d.S[0] * d.S[1], 3)]]) +
        '<p>σ₁ and σ₂ are the longest and shortest stretch A applies to any unit arrow.</p>', btn);
    }
    function zoomError(btn) {
      if (!data) { ensureImages(function () { zoomError(btn); }); return; }
      var c = imageSvd(s.sample), S = c.dec.S, dropped = 0;
      for (var j = s.k; j < S.length; j++) dropped += S[j] * S[j];
      var direct = frob(c.gray, lowRank(c.dec, s.k));
      dlg.open('Rank k error, worked', table([
        ['k, singular values kept', String(s.k)],
        ['Σ σ² over the dropped values', fmt(dropped, 4)],
        ['√ of that sum', fmt(Math.sqrt(dropped), 4)],
        ['‖image − rank k copy‖, measured', fmt(direct, 4)]
      ]) + '<p>The last 2 rows agree. No other rank ' + s.k + ' matrix gets closer to the image.</p>', btn);
    }

    ctl.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-k');
      if (k === 'f') { s.f = +e.target.value; draw(); }
      if (k === 'k') { s.k = +e.target.value; draw(); }
    });
    ctl.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-k');
      if (k === 'mode') { s.mode = e.target.value; draw(); }
      if (k === 'sample') { s.sample = +e.target.value; draw(); }
      report();
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var z = b.getAttribute('data-zoom');
      if (z === 'values') return zoomValues(b);
      if (z === 'error') return zoomError(b);
      if (b.getAttribute('data-act') === 'play') { s.f = 0; goTo({ f: 3 }); return; }
      if (b.hasAttribute('data-reset')) { api.interrupt(); s = JSON.parse(JSON.stringify(START)); }
      draw(); report();
    });

    var PAGES = [
      { t: 'Rotate, stretch, rotate', parts: ['sigma', 'vt'], state: { mode: 'svd', f: 0, m: DEF },
        body: '<p>Every matrix is 3 simple moves in a row. Watch the unit circle and the 2 arrows <b class="is-q">v₁</b> and <b class="is-k">v₂</b>.</p>' },
      { t: 'Vᵀ turns', parts: ['vt'], state: { f: 1 },
        body: '<p>First <b class="is-q">Vᵀ</b> turns the plane, so v₁ and v₂ lie along the axes.</p>' },
      { t: 'Σ stretches', parts: ['sigma'], state: { f: 2 },
        body: '<p>Then <b class="is-k">Σ</b> stretches along the axes, by σ₁ and σ₂. Those stretches are the singular values.</p>' },
      { t: 'U turns again', parts: ['sigma', 'u'], state: { f: 3 },
        body: '<p>Last, <b class="is-o">U</b> turns the result into place. The 3 moves together are exactly A. Drag î or ĵ and all 3 change.</p>' },
      { t: 'Keep the big ones', parts: ['sigma'], state: { mode: 'image', k: 8 },
        body: '<p>A 64 by 64 image is a matrix too. Rebuilt from its 8 largest singular values, most of the picture survives.</p>' },
      { t: 'What you dropped', parts: ['tail'], state: { mode: 'image', k: 8 },
        body: '<p>The error of the rank k copy is the square root of the dropped σ² added up. No other rank k matrix is closer.</p>' },
      { t: 'PCA is an SVD', parts: ['vt', 'cloud'], state: { mode: 'pca' },
        body: '<p>Centre a cloud of points. Its principal axes are the right singular vectors, and they turn as you drag the points.</p>' },
      { t: 'Cholesky', parts: ['vt', 'sigma'], state: { mode: 'chol', f: 3 },
        body: '<p>A positive definite matrix splits as L Lᵀ, with L lower triangular. L carries the unit circle onto the ellipse xᵀA⁻¹x = 1.</p>' }
    ];
    draw();
    XP.guide(root.querySelector('[data-guide-box]'), PAGES, function (p, i, redraw) {
      if (!p) { api.focus([]); return; }
      if (!redraw) goTo(p.state);
      api.focus(p.parts);
    });
  });
```

- [ ] **Step 7: Register it and add its styles**

In `_data/module_labs.yml`, add:

```yaml
  '4': decompositions
```

In the Linear Algebra section of `css/labs.css`, add:

```css
.lab-images { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
.lab-images figure { margin: 0; }
.lab-images canvas { display: block; width: 100%; height: auto; image-rendering: pixelated; border-radius: var(--radius-sm); }
.lab-images figcaption { font-size: var(--fs-2xs); color: var(--text); text-align: center; }
.lab-images .lab-plane { grid-column: 1 / -1; }
.lab-plane .pl-bar { fill: var(--xp-o); }
```

- [ ] **Step 8: Build and run every check**

Run the same commands as Task 3, Step 8.

Expected:
- `5 checks passed`.
- `1 tracks checked, 0 problems`.
- No bounds line.

At `/linear-algebra/#m5`, confirm these 3 behaviours:
- Play runs the 3 stages and ends exactly on A's grid.
- In the image view, k = 1 looks like stripes and k = 64 matches the original.
- The "Rank k error, worked" dialog's last 2 rows agree.

- [ ] **Step 9: Commit**

```bash
git add js/labs/linear-algebra/decompositions.js _includes/labs/linear-algebra/decompositions.html \
  scripts/verify_labs.py _data/module_labs.yml css/labs.css
git commit -m "Add the decompositions explainer to Linear Algebra"
```

---

### Task 8: Linear Algebra 6, projections and least squares

This explainer's 2D fit repeats the playground under "The normal equations": same 9 points, same line, same mean squared error. So this task also removes that playground. The playground's live equation moves to the equation itself, and the explainer feeds it.

**Files:**
- Create: `js/labs/linear-algebra/least-squares.js` and `_includes/labs/linear-algebra/least-squares.html`
- Modify:
  - `scripts/verify_labs.py`, `_data/module_labs.yml` and `css/labs.css`;
  - `scripts/render_math.py`, around line 488, so it reads an equation-level `live:`;
  - `_data/interview.yml`, replacing the `play:` block with `live:`;
  - `_data/interview_math.yml`, by regenerating it.

**Interfaces:**
- Consumes: Task 1's helpers, and `.pl-plane3` and `.pl-line` from Task 3.
- Produces:
  - Exports:
    - `lstsq(X, y, lam) -> w | null`, where `X` is an array of rows;
    - `fitLine(points) -> { w, b }` and `mse(points, w, b)`;
    - `project(a, b, y) -> { w, yhat, r } | null`;
    - `view3(p, yaw, pitch)` and `camera(yaw, pitch) -> { right, up }`;
    - `gram(X)` and `ridgePath(X, y, lams)`.
  - The live slots `w`, `b` and `loss`.
  - Equations may now carry `live: { tex, slots }` in `_data/interview.yml`.

- [ ] **Step 1: Write the failing maths check**

Add to `scripts/verify_labs.py`:

```python
@check('linear-algebra/least-squares')
def check_least_squares():
    lab = 'linear-algebra/least-squares'
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
```

- [ ] **Step 2: Run it to check that it fails**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/least-squares`

Expected: it fails with `Cannot find module`.

- [ ] **Step 3: Write the pure maths**

Create `js/labs/linear-algebra/least-squares.js`:

```js
/* ════════════════════════════════════════════════════════
   Linear Algebra, module 6: projections and least squares.
   In 3D, y's shadow on the plane of X's columns is the fit, and the
   residual stands at a right angle. In 2D, each residual carries its own
   square. Ridge pulls the weights in along a path. The 2D fit feeds the
   module's live equation (slots w, b and loss).
   ════════════════════════════════════════════════════════ */
(function () {

  /* Solve G w = r for a symmetric positive definite G by Cholesky, or null. */
  function solveSPD(G, r) {
    var n = G.length, L = [], i, j, k;
    for (i = 0; i < n; i++) {
      L.push([]);
      for (j = 0; j <= i; j++) {
        var sum = G[i][j];
        for (k = 0; k < j; k++) sum -= L[i][k] * L[j][k];
        if (i === j) {
          if (!(sum > 1e-12 * Math.max(1, Math.abs(G[i][i])))) return null;
          L[i].push(Math.sqrt(sum));
        } else L[i].push(sum / L[j][j]);
      }
    }
    var z = [];
    for (i = 0; i < n; i++) { var s = r[i]; for (k = 0; k < i; k++) s -= L[i][k] * z[k]; z.push(s / L[i][i]); }
    var w = new Array(n);
    for (i = n - 1; i >= 0; i--) { var t = z[i]; for (k = i + 1; k < n; k++) t -= L[k][i] * w[k]; w[i] = t / L[i][i]; }
    return w;
  }
  function gram(X) {
    var p = X[0].length, G = [];
    for (var i = 0; i < p; i++) { G.push([]); for (var j = 0; j < p; j++) { var s = 0; for (var k = 0; k < X.length; k++) s += X[k][i] * X[k][j]; G[i].push(s); } }
    return G;
  }
  /* Least squares by the normal equations, with ridge penalty lam. */
  function lstsq(X, y, lam) {
    var G = gram(X), r = [], p = G.length, i, k;
    for (i = 0; i < p; i++) { G[i][i] += lam || 0; var s = 0; for (k = 0; k < X.length; k++) s += X[k][i] * y[k]; r.push(s); }
    return solveSPD(G, r);
  }
  function fitLine(points) {
    var w = lstsq(points.map(function (q) { return [q[0], 1]; }), points.map(function (q) { return q[1]; }), 0);
    return { w: w[0], b: w[1] };
  }
  function mse(points, w, b) {
    return points.reduce(function (s, q) { var r = q[1] - (w * q[0] + b); return s + r * r; }, 0) / points.length;
  }
  /* y's shadow on the plane of columns a and b, or null when they are parallel. */
  function project(a, b, y) {
    var X = [[a[0], b[0]], [a[1], b[1]], [a[2], b[2]]], w = lstsq(X, y, 0);
    if (!w) return null;
    var yhat = [0, 1, 2].map(function (i) { return w[0] * a[i] + w[1] * b[i]; });
    return { w: w, yhat: yhat, r: [y[0] - yhat[0], y[1] - yhat[1], y[2] - yhat[2]] };
  }
  /* The orthographic view used in module 1, and its screen axes in 3D. */
  function view3(p, yaw, pitch) {
    var cy = Math.cos(yaw), sy = Math.sin(yaw);
    return [cy * p[0] + sy * p[1], Math.cos(pitch) * p[2] - Math.sin(pitch) * (-sy * p[0] + cy * p[1])];
  }
  function camera(yaw, pitch) {
    var cy = Math.cos(yaw), sy = Math.sin(yaw), sp = Math.sin(pitch);
    return { right: [cy, sy, 0], up: [sp * sy, -sp * cy, Math.cos(pitch)] };
  }
  function ridgePath(X, y, lams) { return lams.map(function (l) { return lstsq(X, y, l); }); }

  var M = { solveSPD: solveSPD, gram: gram, lstsq: lstsq, fitLine: fitLine, mse: mse, project: project,
    view3: view3, camera: camera, ridgePath: ridgePath };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  /* MOUNT */
})();
```

- [ ] **Step 4: Run the check to confirm that it passes**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/least-squares`

Expected: it prints `ok linear-algebra/least-squares`.

- [ ] **Step 5: Move the live equation off the playground, then remove the playground**

In `scripts/render_math.py`, replace:

```python
                play = eq.get("play") or {}
                if play.get("livetex"):
                    try:
                        live = mathml(play["livetex"], display=True)
                    except Exception as exc:
                        errors.append("BAD LIVETEX: %s [%d] %s" % (where, ei, exc))
                        continue
                    slots = play.get("liveslots") or []
```

with:

```python
                # The live line belongs to the equation. It may sit on the
                # equation itself (`live: {tex, slots}`), fed by a module
                # explainer, or on its playground (`livetex`, `liveslots`).
                play = eq.get("play") or {}
                src = eq.get("live") or {"tex": play.get("livetex"), "slots": play.get("liveslots")}
                if src.get("tex"):
                    try:
                        live = mathml(src["tex"], display=True)
                    except Exception as exc:
                        errors.append("BAD LIVETEX: %s [%d] %s" % (where, ei, exc))
                        continue
                    slots = src.get("slots") or []
```

In `_data/interview.yml`, find the `linear-algebra` topic, then the module `Projections and least squares`, then its equation `The normal equations`. Replace its whole `play:` block with the lines below, indented to match the equation's other keys:

```yaml
            live:
              tex: '\hat{y} \;=\; 9001\,x \;+\; 9002, \qquad \hat{R} \;=\; 9003'
              slots: [w, b, loss]
```

Copy the `tex` string exactly from the old `livetex`. `9001`, `9002` and `9003` are the slot markers.

Run `python3 scripts/render_math.py`, then `python3 scripts/render_math.py --check`. If your `python3` lacks `latex2mathml`, use an interpreter that has it.

Expected:
- Both commands pass.
- `git diff _data/interview_math.yml` shows no change to `linear-algebra/5/1/live`, because the same tex renders to the same MathML.

- [ ] **Step 6: Write the include**

Create `_includes/labs/linear-algebra/least-squares.html`:

```html
<section class="xp lab" id="lab-linear-algebra-least-squares" aria-labelledby="lab-la-ls-t">
  <header class="lab-head">
    <span class="syl-phase">Explore it</span>
    <h3 id="lab-la-ls-t">Find the nearest point you can reach</h3>
  </header>
  <p class="lab-eq"><span class="lab-term is-k" data-term="res"><i>X</i>ᵀ(<b>y</b> − <i>X</i>ŵ) = (<span data-val="g1">0.00</span>, <span data-val="g2">0.00</span>)</span>, &nbsp; <span class="lab-term is-o" data-term="yhat">ŵ = (<span data-val="w1">0.00</span>, <span data-val="w2">0.00</span>)</span><br><span class="lab-term is-o" data-term="line"><i>ŷ</i> = <span data-val="w">0.40</span> <i>x</i> + <span data-val="b">4.00</span></span>, &nbsp; <span class="lab-term" data-term="sq">mean squared error <span data-val="loss">0.00</span></span>, &nbsp; <i>λ</i> = <span data-val="lam">0.00</span></p>
  <div class="lab-main">
    <div class="lab-stage" data-stage></div>
    <div data-guide-box></div>
  </div>
  <div class="lab-ctl" data-ctl></div>
  <p class="lab-say" aria-live="polite" data-say></p>
  <p class="lab-src">The ridge view uses 30 simulated points, generated with a fixed seed. The 9 points in the 2D fit are the ones in the playground this explainer replaced.</p>
</section>
```

- [ ] **Step 7: Write the explainer**

Replace `  /* MOUNT */` with:

```js
  XP.lab('linear-algebra/least-squares', function (root, api) {
    var fmt = XP.fmt, svgEl = XP.svgEl, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var dlg = XP.dialog(root);
    var A = [1.6, 0.2, 0.4], B = [0.3, 1.5, 0.5], BNEAR = [1.5, 0.35, 0.45], Y = [1.2, 1.4, 2.4];
    var PTS = [[1, 2.1], [2, 3.4], [3, 3.2], [4, 5.1], [5, 5.6], [6, 7.2], [7, 7.1], [8, 9.4], [9, 9.1]];
    var rr = XP.rng(21), RX = [], RY = [];
    for (var i = 0; i < 30; i++) {
      var g1 = XP.gauss(rr), g2 = XP.gauss(rr), g3 = XP.gauss(rr), x2 = 0.8 * g1 + 0.6 * g2;
      RX.push([g1, x2]); RY.push(1.5 * g1 + x2 + 0.5 * g3);
    }
    var LAMS = [];
    for (i = 0; i <= 60; i++) LAMS.push(Math.pow(10, -3 + i * 0.1));
    var PATH = ridgePath(RX, RY, LAMS);
    var START = { mode: '3d', y: Y.slice(), b: B.slice(), yaw: 0.7, pitch: 0.45, w: 0.4, c: 4, pts: PTS.map(function (p) { return p.slice(); }), lam: -3 };
    var s = JSON.parse(JSON.stringify(START));
    var P3 = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: 'The target y above the plane of the columns, with its shadow and the residual' });
    var PF = XP.plane(stage, { x: [0, 10], y: [0, 12], w: 480, h: 360, label: '9 points, a line, and a square on each residual' });
    var PR = XP.plane(stage, { x: [-1, 3], y: [-1, 2], w: 480, h: 360, label: 'Loss contours in weight space, the ridge path, and the constraint circle' });

    ctl.innerHTML =
      '<label>view <select data-k="mode" aria-label="What to show"><option value="3d">3D shadow</option><option value="fit">2D fit</option><option value="ridge">Ridge</option></select></label>' +
      '<label>turn <input type="range" data-k="yaw" min="-3.1" max="3.1" step="0.02" aria-label="Turn the 3D view"></label>' +
      '<label>tilt <input type="range" data-k="pitch" min="-1.2" max="1.2" step="0.02" aria-label="Tilt the 3D view"></label>' +
      '<button type="button" data-act="wobble">Wobble y</button>' +
      '<button type="button" data-act="snap">Snap to least squares</button>' +
      '<label>log₁₀ λ <input type="range" data-k="lam" min="-3" max="3" step="0.05" aria-label="Ridge penalty, as a power of 10"></label>' +
      '<button type="button" data-zoom="normal">Normal equations, worked</button>' +
      '<button type="button" data-zoom="residuals">Residuals, worked</button>' +
      '<button type="button" data-reset>Reset</button>';
    var el = {};
    Array.prototype.forEach.call(ctl.querySelectorAll('[data-k], [data-act]'), function (x) { el[x.getAttribute('data-k') || x.getAttribute('data-act')] = x; });

    /* y moves in the screen plane of the 3D view: the camera's right and up axes. */
    var hy = P3.handle({ x: 0, y: 0, label: 'The target y', cls: 'is-v', part: 'y', onMove: function (x, y, done) {
      var at = view3(s.y, s.yaw, s.pitch), cam = camera(s.yaw, s.pitch), dx = x - at[0], dy = y - at[1];
      s.y = [0, 1, 2].map(function (k) { return s.y[k] + dx * cam.right[k] + dy * cam.up[k]; });
      draw(); if (done) report();
    } });
    function lineEnd(xAt, label) {
      return PF.handle({ x: xAt, y: s.w * xAt + s.c, label: label, cls: 'is-o', part: 'line', bounds: [[xAt, xAt], [0.3, 11.7]], onMove: function (x, y, done) {
        var yl = xAt === 1 ? y : s.w + s.c, yr = xAt === 9 ? y : 9 * s.w + s.c;
        s.w = (yr - yl) / 8; s.c = yl - s.w; draw(); if (done) report();
      } });
    }
    var hl = lineEnd(1, 'Left end of the line'), hr = lineEnd(9, 'Right end of the line');
    var hp = PTS.map(function (p, j) {
      return PF.handle({ x: p[0], y: p[1], label: 'Data point ' + (j + 1), cls: 'is-v', part: 'pts', onMove: function (x, y, done) {
        s.pts[j] = [x, y]; draw(); if (done) report();
      } });
    });

    function add(p, q) { return [p[0] + q[0], p[1] + q[1], p[2] + q[2]]; }
    function sc(p, k) { return [k * p[0], k * p[1], k * p[2]]; }
    function unit3(p) { var n = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]); return n < 1e-12 ? [0, 0, 0] : sc(p, 1 / n); }

    function draw() {
      var fit = project(A, s.b, s.y), loss = mse(s.pts, s.w, s.c), lam = Math.pow(10, s.lam);
      api.values({ w: s.w, b: s.c, loss: loss, lam: lam });
      if (fit) {
        var X = [[A[0], s.b[0]], [A[1], s.b[1]], [A[2], s.b[2]]];
        api.values({ w1: fit.w[0], w2: fit.w[1], g1: X.reduce(function (t, row, k) { return t + row[0] * fit.r[k]; }, 0), g2: X.reduce(function (t, row, k) { return t + row[1] * fit.r[k]; }, 0) });
      } else api.values({ w1: 'none', w2: 'none', g1: '–', g2: '–' });
      el.mode.value = s.mode; el.yaw.value = s.yaw; el.pitch.value = s.pitch; el.lam.value = s.lam;
      el.yaw.parentNode.hidden = el.pitch.parentNode.hidden = el.wobble.hidden = s.mode !== '3d';
      el.snap.hidden = s.mode !== 'fit';
      el.lam.parentNode.hidden = s.mode !== 'ridge';
      P3.svg.style.display = s.mode === '3d' ? '' : 'none';
      PF.svg.style.display = s.mode === 'fit' ? '' : 'none';
      PR.svg.style.display = s.mode === 'ridge' ? '' : 'none';
      if (s.mode === '3d') draw3(fit);
      if (s.mode === 'fit') drawFit();
      if (s.mode === 'ridge') drawRidge(lam);
    }

    function draw3(fit) {
      function sp(p) { return view3(p, s.yaw, s.pitch); }
      var corners = [[-1.4, -1.4], [1.4, -1.4], [1.4, 1.4], [-1.4, 1.4]].map(function (c) { return sp(add(sc(A, c[0]), sc(s.b, c[1]))); });
      var h = '<polygon class="pl-plane3" data-part="span" points="' + P3.pts(corners) + '"/>';
      [[3, 0, 0], [0, 3, 0], [0, 0, 3]].forEach(function (e) { var q = sp(e); h += P3.arrow(0, 0, q[0], q[1], 'is-faint'); });
      var a2 = sp(A), b2 = sp(s.b), y2 = sp(s.y);
      h += P3.arrow(0, 0, a2[0], a2[1], 'is-q', 'cols') + P3.arrow(0, 0, b2[0], b2[1], 'is-k', 'cols');
      if (fit) {
        var yh = sp(fit.yhat), u = unit3(fit.yhat[0] || fit.yhat[1] || fit.yhat[2] ? fit.yhat : A), rh = unit3(fit.r), e = 0.25;
        var m1 = sp(add(fit.yhat, sc(u, e))), m2 = sp(add(add(fit.yhat, sc(u, e)), sc(rh, e))), m3 = sp(add(fit.yhat, sc(rh, e)));
        h += P3.arrow(0, 0, yh[0], yh[1], 'is-o', 'yhat');
        h += '<g class="is-k" data-part="res">' + svgEl('line', { x1: P3.map.sx(yh[0]), y1: P3.map.sy(yh[1]), x2: P3.map.sx(y2[0]), y2: P3.map.sy(y2[1]), 'class': 'pl-dash' }) +
          '<polyline class="pl-right" points="' + P3.pts([m1, m2, m3]) + '"/></g>';
      }
      h += P3.arrow(0, 0, y2[0], y2[1], 'is-v', 'y');
      P3.plot.innerHTML = h;
      hy.set(y2[0], y2[1]);
    }

    function drawFit() {
      PF.grid.innerHTML = PF.gridMarkup(null, 1, 'pl-std is-faint');
      var h = '';
      s.pts.forEach(function (p) {
        var yh = s.w * p[0] + s.c, y0 = PF.map.sy(p[1]), y1 = PF.map.sy(yh), side = Math.abs(y1 - y0);
        h += svgEl('rect', { x: PF.map.sx(p[0]), y: Math.min(y0, y1), width: side, height: side, 'class': 'pl-sq', 'data-part': 'sq' });
        h += svgEl('line', { x1: PF.map.sx(p[0]), y1: y0, x2: PF.map.sx(p[0]), y2: y1, 'class': 'pl-dash is-k', 'data-part': 'res' });
      });
      h += svgEl('line', { x1: PF.map.sx(0), y1: PF.map.sy(s.c), x2: PF.map.sx(10), y2: PF.map.sy(10 * s.w + s.c), 'class': 'pl-line is-o', 'data-part': 'line' });
      PF.plot.innerHTML = h;
      hl.set(1, s.w + s.c); hr.set(9, 9 * s.w + s.c);
      hp.forEach(function (hd, j) { hd.set(s.pts[j][0], s.pts[j][1]); });
    }

    function drawRidge(lam) {
      var w0 = lstsq(RX, RY, 0), wl = lstsq(RX, RY, lam), G = gram(RX);
      var th = 0.5 * Math.atan2(2 * G[0][1], G[0][0] - G[1][1]), mid = (G[0][0] + G[1][1]) / 2;
      var rad = Math.sqrt((G[0][0] - G[1][1]) * (G[0][0] - G[1][1]) / 4 + G[0][1] * G[0][1]), l1 = mid + rad, l2 = mid - rad;
      var e1 = [Math.cos(th), Math.sin(th)], e2 = [-Math.sin(th), Math.cos(th)];
      PR.grid.innerHTML = PR.gridMarkup(null, 0.5, 'pl-std is-faint') + PR.axes();
      var h = '';
      for (var k = 1; k <= 5; k++) {
        var ring = [];
        for (var a = 0; a <= 72; a++) {
          var ca = Math.cos(a * Math.PI / 36) * 0.25 * k, sa = Math.sin(a * Math.PI / 36) * 0.25 * k * Math.sqrt(l1 / l2);
          ring.push([w0[0] + ca * e1[0] + sa * e2[0], w0[1] + ca * e1[1] + sa * e2[1]]);
        }
        h += '<polyline class="pl-contour" data-part="loss" points="' + PR.pts(ring) + '"/>';
      }
      var R = Math.sqrt(wl[0] * wl[0] + wl[1] * wl[1]), circ = [];
      for (a = 0; a <= 72; a++) circ.push([R * Math.cos(a * Math.PI / 36), R * Math.sin(a * Math.PI / 36)]);
      h += '<polyline class="pl-dash is-k" data-part="circle" points="' + PR.pts(circ) + '"/>';
      h += '<polyline class="pl-curve is-o is-faint" data-part="path" points="' + PR.pts(PATH) + '"/>';
      h += PR.dot(w0[0], w0[1], 5, 'pl-mark pl-ols', 'ols') + PR.dot(wl[0], wl[1], 6, 'pl-mark pl-ridge', 'ridge');
      PR.plot.innerHTML = h;
      api.values({ w1: wl[0], w2: wl[1] });
    }

    function report() {
      if (s.mode === 'fit') api.say('The line is y = ' + fmt(s.w) + ' x + ' + fmt(s.c) + '. The mean squared error is ' + fmt(mse(s.pts, s.w, s.c), 3) + '.');
      else if (s.mode === 'ridge') { var wl = lstsq(RX, RY, Math.pow(10, s.lam)); api.say('With lambda ' + fmt(Math.pow(10, s.lam), 3) + ', the weights are (' + fmt(wl[0]) + ', ' + fmt(wl[1]) + ').'); }
      else {
        var fit = project(A, s.b, s.y);
        api.say(fit ? 'The fit uses ' + fmt(fit.w[0]) + ' of a and ' + fmt(fit.w[1]) + ' of b. The residual is at a right angle to both.' :
          'The 2 columns are parallel, so they reach only a line, and the weights are not unique.');
      }
    }
    function goTo(target) {
      if (target.mode) s.mode = target.mode;
      var from = { b: s.b.slice(), w: s.w, c: s.c, lam: s.lam }, to = { b: target.b ? target.b.slice() : s.b.slice(), w: s.w, c: s.c, lam: 'lam' in target ? target.lam : s.lam };
      if (target.snap) { var f = fitLine(s.pts); to.w = f.w; to.c = f.b; }
      api.animate(from, to, 800, function (st) { s.b = st.b.slice(); s.w = st.w; s.c = st.c; s.lam = st.lam; draw(); }, function () {
        report();
        if (target.wobble) wobble();
      });
    }
    /* Circle y a little and watch the weights: the fit is stable, the weights may not be. */
    function wobble() {
      var y0 = s.y.slice();
      s.mode = '3d';
      api.animate({ f: 0 }, { f: 1 }, 1500, function (st) {
        s.y = [y0[0] + 0.3 * Math.sin(4 * Math.PI * st.f), y0[1] + 0.3 * Math.sin(6 * Math.PI * st.f), y0[2]];
        draw();
      }, report);
    }

    function table(rows, head) {
      return '<table class="xp-table lab-table">' + (head ? '<thead><tr>' + head.map(function (x) { return '<th scope="col">' + x + '</th>'; }).join('') + '</tr></thead>' : '') +
        '<tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (x, k) { return k === 0 && !head ? '<th scope="row">' + x + '</th>' : '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
    }
    ctl.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-k');
      if (k === 'yaw' || k === 'pitch' || k === 'lam') { s[k] = +e.target.value; draw(); }
    });
    ctl.addEventListener('change', function (e) {
      if (e.target.getAttribute('data-k') === 'mode') { s.mode = e.target.value; draw(); }
      report();
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act'), z = b.getAttribute('data-zoom');
      if (z === 'normal') {
        var X = s.mode === 'fit' ? s.pts.map(function (q) { return [q[0], 1]; }) : [[A[0], s.b[0]], [A[1], s.b[1]], [A[2], s.b[2]]];
        var yv = s.mode === 'fit' ? s.pts.map(function (q) { return q[1]; }) : s.y, G = gram(X), w = lstsq(X, yv, 0);
        var Xy = [0, 1].map(function (c) { return X.reduce(function (t, row, k) { return t + row[c] * yv[k]; }, 0); });
        dlg.open('Normal equations, worked', table([
          ['XᵀX', '[[' + fmt(G[0][0]) + ', ' + fmt(G[0][1]) + '], [' + fmt(G[1][0]) + ', ' + fmt(G[1][1]) + ']]'],
          ['Xᵀy', '(' + fmt(Xy[0]) + ', ' + fmt(Xy[1]) + ')'],
          ['ŵ, solving XᵀX ŵ = Xᵀy', w ? '(' + fmt(w[0]) + ', ' + fmt(w[1]) + ')' : 'no unique answer: the columns are parallel']
        ]) + '<p>' + (s.mode === 'fit' ? 'Here X has a column of x values and a column of 1s, so ŵ is the slope and the intercept.' : 'Here the columns of X are a and b.') + '</p>', b);
        return;
      }
      if (z === 'residuals') {
        var rows = s.pts.map(function (q) { var yh = s.w * q[0] + s.c, r = q[1] - yh; return [fmt(q[0], 1), fmt(q[1], 1), fmt(yh), fmt(r), fmt(r * r, 3)]; });
        dlg.open('Residuals, worked', table(rows, ['x', 'y', 'ŷ', 'y − ŷ', '(y − ŷ)²']) + '<p>The mean of the last column is ' + fmt(mse(s.pts, s.w, s.c), 3) + ', the mean squared error.</p>', b);
        return;
      }
      if (act === 'wobble') { wobble(); return; }
      if (act === 'snap') { goTo({ snap: true }); return; }
      if (b.hasAttribute('data-reset')) { api.interrupt(); s = JSON.parse(JSON.stringify(START)); }
      draw(); report();
    });

    var PAGES = [
      { t: 'A target out of reach', parts: ['y', 'cols'], state: { mode: '3d', b: B },
        body: '<p>The columns <b class="is-q">a</b> and <b class="is-k">b</b> point into 3D space. No mix of them lands exactly on the target <b class="is-v">y</b>.</p>' },
      { t: 'Everything you can reach', parts: ['span', 'cols'], state: { mode: '3d' },
        body: '<p>Every mix w₁a + w₂b lies on this flat plane through the origin. It is the column space of X.</p>' },
      { t: 'The shadow', parts: ['yhat', 'y'], state: { mode: '3d' },
        body: '<p>The nearest reachable point is the shadow of y on the plane, <b class="is-o">ŷ</b> = Xŵ. That point is the least squares fit.</p>' },
      { t: 'The gap stands straight up', parts: ['res', 'yhat'], state: { mode: '3d' },
        body: '<p>The <b class="is-k">residual</b> y − ŷ meets the plane at a right angle. So Xᵀ(y − Xŵ) = 0, the normal equations.</p>' },
      { t: 'The same idea in 2D', parts: ['sq', 'line'], state: { mode: 'fit' },
        body: '<p>Now 9 points and a line. Each residual carries its own square. The squares’ total area, divided by 9, is the mean squared error.</p>' },
      { t: 'Snap to least squares', parts: ['line', 'sq'], state: { mode: 'fit', snap: true },
        body: '<p>The line glides to the fit, and no other line has less total area. Drag any point, then press Snap again.</p>' },
      { t: 'Ridge pulls w in', parts: ['ridge', 'circle', 'path'], state: { mode: 'ridge', lam: 0.5 },
        body: '<p>Ridge adds λ‖w‖² to the loss. As λ grows, <b class="is-o">ŵ</b> slides along its path towards 0, inside a shrinking circle.</p>' },
      { t: 'Nearly parallel columns', parts: ['cols', 'yhat'], state: { mode: '3d', b: BNEAR, wobble: true },
        body: '<p>Now b nearly lines up with a, and y wobbles. ŷ barely moves, but ŵ swings a long way. Module 7 measures this.</p>' }
    ];
    draw();
    XP.guide(root.querySelector('[data-guide-box]'), PAGES, function (p, i, redraw) {
      if (!p) { api.focus([]); return; }
      if (!redraw) goTo(p.state);
      api.focus(p.parts);
    });
  });
```

- [ ] **Step 8: Register it and add its styles**

In `_data/module_labs.yml`, add:

```yaml
  '5': least-squares
```

In the Linear Algebra section of `css/labs.css`, add:

```css
.lab-plane .pl-sq { fill: color-mix(in srgb, var(--xp-k) 18%, transparent); stroke: var(--xp-k); stroke-width: 1; }
.lab-plane .pl-right { fill: none; stroke: currentColor; stroke-width: 1.5; }
.lab-plane .pl-contour { fill: none; stroke: var(--muted); stroke-width: 1.2; }
.lab-plane .pl-ols { fill: var(--xp-v); }
.lab-plane .pl-ridge { fill: var(--xp-o); stroke: var(--bg); stroke-width: 2; }
```

- [ ] **Step 9: Build and run every check**

Run the same commands as Task 3, Step 8, adding `python3 scripts/render_math.py --check`.

Expected:
- `6 checks passed`.
- `1 tracks checked, 0 problems`.
- No bounds line.
- The render check passes.

At `/linear-algebra/#m6`, confirm these 3 behaviours:
- The equation "The normal equations" still shows its "with your numbers" line.
- That line updates as you drag the fit line in the 2D view.
- No playground remains under it.

- [ ] **Step 10: Commit**

```bash
git add js/labs/linear-algebra/least-squares.js _includes/labs/linear-algebra/least-squares.html scripts/verify_labs.py \
  _data/module_labs.yml css/labs.css scripts/render_math.py _data/interview.yml _data/interview_math.yml
git commit -m "Add the least squares explainer to Linear Algebra, replacing the line-fit sliders"
```

---

### Task 9: Linear Algebra 7, numerical behaviour

**Files:**
- Create: `js/labs/linear-algebra/conditioning.js` and `_includes/labs/linear-algebra/conditioning.html`
- Modify: `scripts/verify_labs.py`, `_data/module_labs.yml` and `css/labs.css`

**Interfaces:**
- Consumes: Task 1's helpers.
- Produces these exports:
  - `system(theta) -> m`: 2 lines, 1 horizontal and 1 at angle `theta`, written as `[a, b, c, d]` by rows;
  - `solve2(m, y) -> x | null`, `svals(m) -> [s1, s2]` and `cond(m) -> number | null`;
  - `hilbert(n)`, `gaussSolve(A, b)` and `invert(A)`;
  - `hilbertErrors(n) -> { fwdSolve, fwdInv, resSolve, resInv }`;
  - `gdPath(scaled, start, steps)` and `stepsTo(scaled, start, tol)`.

- [ ] **Step 1: Write the failing maths check**

Add to `scripts/verify_labs.py`:

```python
@check('linear-algebra/conditioning')
def check_conditioning():
    from scipy.linalg import hilbert
    lab = 'linear-algebra/conditioning'
    rng = np.random.default_rng(16)
    Ms = rng.normal(size=(30, 2, 2))
    ys = rng.normal(size=(30, 2))
    out = run(lab, [c for M, y in zip(Ms, ys) for c in (['svals', [M.ravel().tolist()]], ['cond', [M.ravel().tolist()]], ['solve2', [M.ravel().tolist(), y.tolist()]])])
    for i, (M, y) in enumerate(zip(Ms, ys)):
        close(f'svals {i}', out[3 * i], np.linalg.svd(M, compute_uv=False), 1e-9)
        close(f'cond {i}', out[3 * i + 1], np.linalg.cond(M), 1e-7)
        close(f'solve {i}', out[3 * i + 2], np.linalg.solve(M, y), 1e-9)
    thetas = [70, 20, 8, 2]
    sys_ = run(lab, [['system', [t]] for t in thetas] + [['cond', [[0, 1, 0, 1]]]])
    conds = [np.linalg.cond(np.array(m).reshape(2, 2)) for m in sys_[:4]]
    same('flatter lines are worse conditioned', conds == sorted(conds), True)
    same('singular system has no condition number', sys_[4], None)
    for n in range(2, 13):
        H = hilbert(n)
        h, e = run(lab, [['hilbert', [n]], ['hilbertErrors', [n]]])
        close(f'hilbert {n}', h, H, 1e-15)
        x = np.ones(n)
        b = H @ x
        ref = np.linalg.norm(np.linalg.solve(H, b) - x) / np.linalg.norm(x)
        if ref > 1e-12:
            same(f'forward error within 1000x of numpy, n={n}', 1e-3 < e['fwdSolve'] / ref < 1e3, True)
        same(f'solve residual is tiny, n={n}', e['resSolve'] < 1e-13, True)
        if n >= 8:
            # The guide says inverting leaves a far larger residual. This checks it.
            same(f'inverting is worse, n={n}', e['resInv'] > 100 * e['resSolve'], True)
    path_u, path_s, n_u, n_s = run(lab, [['gdPath', [False, [-2.5, 0.5], 60]], ['gdPath', [True, [-2.5, 2.5], 60]],
                                         ['stepsTo', [False, [-2.5, 0.5], 0.05]], ['stepsTo', [True, [-2.5, 2.5], 0.05]]])
    w = np.array([-2.5, 0.5])
    for k in range(5):
        w = w - 0.075 * np.array([1.0, 25.0]) * w
    close('unscaled descent', path_u[5], w)
    close('scaled descent', path_s[1], [-1.25, 1.25])
    same('scaling needs fewer steps', n_s < n_u, True)
```

- [ ] **Step 2: Run it to check that it fails**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/conditioning`

Expected: it fails with `Cannot find module`.

- [ ] **Step 3: Write the pure maths**

Create `js/labs/linear-algebra/conditioning.js`:

```js
/* ════════════════════════════════════════════════════════
   Linear Algebra, module 7: numerical behaviour.
   2 lines cross at the solution; as they turn parallel, a small nudge to y
   swings the crossing along a streak whose shape is set by κ. Solving
   beats inverting on Hilbert matrices, and feature scaling turns a
   zigzag descent into a straight one.
   ════════════════════════════════════════════════════════ */
(function () {

  /* 2 lines through the plane: y = c₁ (horizontal) and a line at angle
     theta degrees. Each row is a line's normal. */
  function system(theta) {
    var t = theta * Math.PI / 180;
    return [0, 1, -Math.sin(t), Math.cos(t)];
  }
  function det(m) { return m[0] * m[3] - m[1] * m[2]; }
  function solve2(m, y) {
    var d = det(m), s = Math.abs(m[0]) + Math.abs(m[1]) + Math.abs(m[2]) + Math.abs(m[3]);
    if (Math.abs(d) <= 1e-12 * s * s) return null;
    return [(m[3] * y[0] - m[1] * y[1]) / d, (m[0] * y[1] - m[2] * y[0]) / d];
  }
  function svals(m) {
    var p = m[0] * m[0] + m[2] * m[2], q = m[0] * m[1] + m[2] * m[3], r = m[1] * m[1] + m[3] * m[3];
    var mid = (p + r) / 2, rad = Math.sqrt((p - r) * (p - r) / 4 + q * q);
    return [Math.sqrt(mid + rad), Math.sqrt(Math.max(0, mid - rad))];
  }
  function cond(m) { var s = svals(m); return s[1] <= 1e-12 * s[0] ? null : s[0] / s[1]; }

  function hilbert(n) {
    var H = [];
    for (var i = 0; i < n; i++) { H.push([]); for (var j = 0; j < n; j++) H[i].push(1 / (i + j + 1)); }
    return H;
  }
  function matvec(A, x) { return A.map(function (row) { return row.reduce(function (s, v, j) { return s + v * x[j]; }, 0); }); }
  function norm(v) { return Math.sqrt(v.reduce(function (s, x) { return s + x * x; }, 0)); }
  /* Gaussian elimination with partial pivoting. */
  function gaussSolve(A, b) {
    var n = A.length, M = A.map(function (r, i) { return r.concat([b[i]]); }), i, j, k;
    for (k = 0; k < n; k++) {
      var p = k;
      for (i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
      var tmp = M[k]; M[k] = M[p]; M[p] = tmp;
      for (i = k + 1; i < n; i++) { var f = M[i][k] / M[k][k]; for (j = k; j <= n; j++) M[i][j] -= f * M[k][j]; }
    }
    var x = new Array(n);
    for (i = n - 1; i >= 0; i--) { var s = M[i][n]; for (j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; }
    return x;
  }
  /* Gauss-Jordan inversion with partial pivoting. */
  function invert(A) {
    var n = A.length, M = A.map(function (r, i) { return r.concat(A.map(function (_, j) { return i === j ? 1 : 0; })); }), i, j, k;
    for (k = 0; k < n; k++) {
      var p = k;
      for (i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
      var tmp = M[k]; M[k] = M[p]; M[p] = tmp;
      var d = M[k][k];
      for (j = 0; j < 2 * n; j++) M[k][j] /= d;
      for (i = 0; i < n; i++) if (i !== k) { var f = M[i][k]; for (j = 0; j < 2 * n; j++) M[i][j] -= f * M[k][j]; }
    }
    return M.map(function (r) { return r.slice(n); });
  }
  /* Solve H x = b with x = 1s, 2 ways, and report the relative errors. */
  function hilbertErrors(n) {
    var H = hilbert(n), x = H.map(function () { return 1; }), b = matvec(H, x);
    var xs = gaussSolve(H, b), xi = matvec(invert(H), b);
    function fwd(v) { return norm(v.map(function (e, i) { return e - x[i]; })) / norm(x); }
    function res(v) { return norm(matvec(H, v).map(function (e, i) { return e - b[i]; })) / norm(b); }
    return { fwdSolve: fwd(xs), fwdInv: fwd(xi), resSolve: res(xs), resInv: res(xi) };
  }

  /* Gradient descent on ½(w₁² + 25 w₂²), or, after scaling the second
     feature by 5, on ½(w₁² + w₂²). The step sizes are the largest round
     values that stay stable. */
  function gdPath(scaled, start, steps) {
    var h = scaled ? [1, 1] : [1, 25], lr = scaled ? 0.5 : 0.075, w = start.slice(), out = [w.slice()];
    for (var k = 0; k < steps; k++) { w = [w[0] - lr * h[0] * w[0], w[1] - lr * h[1] * w[1]]; out.push(w.slice()); }
    return out;
  }
  function stepsTo(scaled, start, tol) {
    var p = gdPath(scaled, start, 500);
    for (var k = 0; k < p.length; k++) if (Math.sqrt(p[k][0] * p[k][0] + p[k][1] * p[k][1]) < tol) return k;
    return null;
  }

  var M = { system: system, det: det, solve2: solve2, svals: svals, cond: cond, hilbert: hilbert, gaussSolve: gaussSolve,
    invert: invert, hilbertErrors: hilbertErrors, gdPath: gdPath, stepsTo: stepsTo };
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }

  /* MOUNT */
})();
```

- [ ] **Step 4: Run the check to confirm that it passes**

Run: `../venv/bin/python scripts/verify_labs.py linear-algebra/conditioning`

Expected: it prints `ok linear-algebra/conditioning`.

If `inverting is worse` fails for some n, do not loosen it. Change page 5's text and the zoom note to say what the numbers show instead, then make the check assert that.

- [ ] **Step 5: Write the include**

Create `_includes/labs/linear-algebra/conditioning.html`:

```html
<section class="xp lab" id="lab-linear-algebra-conditioning" aria-labelledby="lab-la-cond-t">
  <header class="lab-head">
    <span class="syl-phase">Explore it</span>
    <h3 id="lab-la-cond-t">See when a small nudge swings the answer</h3>
  </header>
  <p class="lab-eq"><span class="lab-term is-o" data-term="ellipse"><i>κ</i>(<i>A</i>) = <i>σ</i>ₘₐₓ ÷ <i>σ</i>ₘᵢₙ = <span data-val="kappa">1.06</span></span>, &nbsp; <span class="lab-term is-v" data-term="cloud">streak ratio <span data-val="ratio">–</span></span>, &nbsp; angle between the lines <span data-val="angle">70</span>°</p>
  <div class="lab-main">
    <div class="lab-stage" data-stage></div>
    <div data-guide-box></div>
  </div>
  <div class="lab-ctl" data-ctl></div>
  <p class="lab-say" aria-live="polite" data-say></p>
</section>
```

- [ ] **Step 6: Write the explainer**

Replace `  /* MOUNT */` with:

```js
  XP.lab('linear-algebra/conditioning', function (root, api) {
    var fmt = XP.fmt, svgEl = XP.svgEl, stage = root.querySelector('[data-stage]'), ctl = root.querySelector('[data-ctl]');
    var dlg = XP.dialog(root), X0 = [0, 0.3], REACH = 3;
    var rr = XP.rng(5), DISC = [];
    for (var i = 0; i < 80; i++) { var a = 2 * Math.PI * rr(), rad = Math.sqrt(rr()); DISC.push([rad * Math.cos(a), rad * Math.sin(a)]); }
    var START = { mode: 'lines', theta: 70, delta: 0, n: 10, scaled: false, gstep: 60 };
    var s = JSON.parse(JSON.stringify(START));
    var P = XP.plane(stage, { x: [-4.5, 4.5], y: [-3.375, 3.375], w: 480, h: 360, label: '2 lines crossing at the solution, with the crossing points for nudged right-hand sides' });
    var PH = XP.plane(stage, { x: [1.5, 12.5], y: [-17, 1], w: 480, h: 240, pad: 6, label: 'Residuals of solving and of inverting, for Hilbert matrices of growing size, on a log scale' });
    var PG = XP.plane(stage, { x: [-3, 3], y: [-2.25, 2.25], w: 480, h: 360, label: 'Loss contours and a gradient descent path, before or after scaling' });

    ctl.innerHTML =
      '<label>view <select data-k="mode" aria-label="What to show"><option value="lines">2 lines</option><option value="hilbert">Hilbert matrices</option><option value="scale">Feature scaling</option></select></label>' +
      '<label>nudge δ <input type="range" data-k="delta" min="0" max="0.3" step="0.01" aria-label="Size of the nudge to y"></label>' +
      '<label>size n <input type="range" data-k="n" min="2" max="12" step="1" aria-label="Size of the Hilbert matrix"></label>' +
      '<button type="button" data-act="scaled" aria-pressed="false">Scale the features</button>' +
      '<button type="button" data-zoom="kappa">κ, worked</button>' +
      '<button type="button" data-zoom="errors">Errors table</button>' +
      '<button type="button" data-reset>Reset</button>';
    var el = {};
    Array.prototype.forEach.call(ctl.querySelectorAll('[data-k], [data-act]'), function (x) { el[x.getAttribute('data-k') || x.getAttribute('data-act')] = x; });

    /* The end of the second line: drag it round the crossing to tilt the line. */
    var ht = P.handle({ x: 0, y: 0, label: 'End of the tilting line', cls: 'is-k', part: 'line2', snap: 0.05, onMove: function (x, y, done) {
      var t = Math.atan2(y - X0[1], x - X0[0]) * 180 / Math.PI;
      if (t < 0) t += 180;
      s.theta = Math.max(0.5, Math.min(179.5, t)); draw(); if (done) report();
    } });

    function lineMarkup(theta, off, cls, part) {
      var t = theta * Math.PI / 180, d = [Math.cos(t), Math.sin(t)], p = [X0[0] + off[0], X0[1] + off[1]];
      return svgEl('line', { x1: P.map.sx(p[0] - 12 * d[0]), y1: P.map.sy(p[1] - 12 * d[1]), x2: P.map.sx(p[0] + 12 * d[0]), y2: P.map.sy(p[1] + 12 * d[1]), 'class': cls, 'data-part': part });
    }
    function cloud(m) {
      var y0 = [m[0] * X0[0] + m[1] * X0[1], m[2] * X0[0] + m[3] * X0[1]];
      return DISC.map(function (q) { return solve2(m, [y0[0] + s.delta * q[0], y0[1] + s.delta * q[1]]); }).filter(Boolean);
    }
    function ratioOf(pts) {
      if (pts.length < 3) return null;
      var mx = 0, my = 0, n = pts.length, sxx = 0, syy = 0, sxy = 0;
      pts.forEach(function (p) { mx += p[0] / n; my += p[1] / n; });
      pts.forEach(function (p) { var dx = p[0] - mx, dy = p[1] - my; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; });
      var mid = (sxx + syy) / 2, rad = Math.sqrt((sxx - syy) * (sxx - syy) / 4 + sxy * sxy);
      return mid - rad <= 1e-18 ? null : Math.sqrt((mid + rad) / (mid - rad));
    }

    function draw() {
      el.mode.value = s.mode; el.delta.value = s.delta; el.n.value = s.n;
      el.scaled.setAttribute('aria-pressed', s.scaled ? 'true' : 'false');
      el.delta.parentNode.hidden = s.mode !== 'lines';
      el.n.parentNode.hidden = s.mode !== 'hilbert';
      el.scaled.hidden = s.mode !== 'scale';
      P.svg.style.display = s.mode === 'lines' ? '' : 'none';
      PH.svg.style.display = s.mode === 'hilbert' ? '' : 'none';
      PG.svg.style.display = s.mode === 'scale' ? '' : 'none';
      var m = system(s.theta), k = cond(m);
      api.values({ kappa: k === null ? 'none' : fmt(k), angle: fmt(s.theta, 0) });
      if (s.mode === 'lines') drawLines(m, k);
      if (s.mode === 'hilbert') drawHilbert();
      if (s.mode === 'scale') drawScale();
    }
    function drawLines(m, k) {
      P.grid.innerHTML = P.gridMarkup(null, 1, 'pl-std is-faint');
      var h = lineMarkup(0, [0, 0], 'pl-line is-q', 'line1') + lineMarkup(s.theta, [0, 0], 'pl-line is-k', 'line2');
      if (s.delta > 0) {
        var pts = cloud(m), inv = solve2(m, [1, 0]) && [solve2(m, [1, 0]), solve2(m, [0, 1])];
        if (inv) {
          var ell = [];
          for (var a = 0; a <= 72; a++) {
            var c = Math.cos(a * Math.PI / 36) * s.delta, sn = Math.sin(a * Math.PI / 36) * s.delta;
            ell.push([X0[0] + c * inv[0][0] + sn * inv[1][0], X0[1] + c * inv[0][1] + sn * inv[1][1]]);
          }
          h += '<polyline class="pl-ellipse" data-part="ellipse" points="' + P.pts(ell) + '"/>';
        }
        pts.forEach(function (p) { h += P.dot(p[0], p[1], 2.4, 'pl-mark pl-cloud', 'cloud'); });
        var rt = ratioOf(pts);
        api.values({ ratio: rt === null ? '–' : fmt(rt) });
      } else api.values({ ratio: '–' });
      h += P.dot(X0[0], X0[1], 5, 'pl-mark pl-cross', 'cross');
      P.plot.innerHTML = h;
      var t = s.theta * Math.PI / 180;
      ht.set(X0[0] + REACH * Math.cos(t), X0[1] + REACH * Math.sin(t));
    }
    function drawHilbert() {
      PH.grid.innerHTML = [-15, -10, -5, 0].map(function (y) {
        return svgEl('line', { x1: 0, y1: PH.map.sy(y), x2: PH.w, y2: PH.map.sy(y), 'class': 'pl-axis is-faint' }) +
          svgEl('text', { x: 8, y: PH.map.sy(y) - 3 }, '1e' + y);
      }).join('');
      var h = '';
      for (var n = 2; n <= 12; n++) {
        var e = hilbertErrors(n), on = n === s.n ? '' : ' is-faint';
        [['resSolve', -0.32, 'pl-bar-solve'], ['resInv', 0.02, 'pl-bar-inv']].forEach(function (b) {
          var v = Math.max(-17, Math.log10(Math.max(e[b[0]], 1e-17)));
          h += svgEl('rect', { x: PH.map.sx(n + b[1]), y: PH.map.sy(v), width: PH.map.sx(n + 0.3) - PH.map.sx(n), height: PH.map.sy(-17) - PH.map.sy(v), 'class': 'pl-mark ' + b[2] + on, 'data-part': b[0] });
        });
      }
      PH.plot.innerHTML = h;
      var cur = hilbertErrors(s.n);
      api.values({ ratio: '–' });
      api.say('For n = ' + s.n + ', solving leaves a residual of ' + cur.resSolve.toExponential(1) + ', and inverting first leaves ' + cur.resInv.toExponential(1) + '.');
    }
    function drawScale() {
      var start = s.scaled ? [-2.5, 2.5] : [-2.5, 0.5], path = gdPath(s.scaled, start, s.gstep);
      PG.grid.innerHTML = PG.axes();
      var h = '';
      for (var k = 1; k <= 6; k++) {
        var ring = [];
        for (var a = 0; a <= 72; a++) ring.push([0.5 * k * Math.cos(a * Math.PI / 36), 0.5 * k * Math.sin(a * Math.PI / 36) / (s.scaled ? 1 : 5)]);
        h += '<polyline class="pl-contour" data-part="loss" points="' + PG.pts(ring) + '"/>';
      }
      h += '<polyline class="pl-curve is-o" data-part="path" points="' + PG.pts(path) + '"/>';
      path.forEach(function (p) { h += PG.dot(p[0], p[1], 2.2, 'pl-mark pl-step', 'path'); });
      PG.plot.innerHTML = h;
      var n = stepsTo(s.scaled, start, 0.05);
      api.say((s.scaled ? 'After scaling' : 'Before scaling') + ', descent needs ' + n + ' steps to get within 0.05 of the minimum.');
    }

    function report() {
      if (s.mode !== 'lines') return;
      var k = cond(system(s.theta));
      api.say('The lines meet at ' + fmt(s.theta, 0) + ' degrees. ' + (k === null ? 'They are parallel, so there is no single crossing.' : 'The condition number is ' + fmt(k) + '.'));
    }
    function goTo(target) {
      if (target.mode) s.mode = target.mode;
      if ('scaled' in target) { s.scaled = target.scaled; s.gstep = 0; }
      var from = { theta: s.theta, delta: s.delta, gstep: s.gstep };
      var to = { theta: 'theta' in target ? target.theta : s.theta, delta: 'delta' in target ? target.delta : s.delta, gstep: s.mode === 'scale' ? 60 : s.gstep };
      api.animate(from, to, 900, function (st) { s.theta = st.theta; s.delta = st.delta; s.gstep = Math.round(st.gstep); draw(); }, report);
    }

    function table(rows, head) {
      return '<table class="xp-table lab-table"><thead><tr>' + head.map(function (x) { return '<th scope="col">' + x + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
    }
    ctl.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-k');
      if (k === 'delta' || k === 'n') { s[k] = +e.target.value; draw(); }
    });
    ctl.addEventListener('change', function (e) {
      if (e.target.getAttribute('data-k') === 'mode') { s.mode = e.target.value; if (s.mode === 'scale') s.gstep = 60; draw(); }
      report();
    });
    ctl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act'), z = b.getAttribute('data-zoom');
      if (z === 'kappa') {
        var m = system(s.theta), sv = svals(m), k = cond(m);
        dlg.open('κ, worked', table([[fmt(s.theta, 0) + '°', fmt(sv[0], 3), fmt(sv[1], 3), k === null ? 'none' : fmt(k)]], ['angle', 'σmax', 'σmin', 'κ = σmax ÷ σmin']) +
          '<p>A nudge of size δ to y can move the answer by up to δ ÷ σmin. Relative to the answer, the worst case is κ times the relative nudge.</p>', b);
        return;
      }
      if (z === 'errors') {
        var rows = [];
        for (var n = 2; n <= 12; n++) { var er = hilbertErrors(n); rows.push([n, er.resSolve.toExponential(1), er.resInv.toExponential(1), er.fwdSolve.toExponential(1), er.fwdInv.toExponential(1)]); }
        dlg.open('Errors table', table(rows, ['n', 'residual, solve', 'residual, invert', 'error in x, solve', 'error in x, invert']) +
          '<p>Every value is relative and computed in your browser in 64-bit floats, with x set to all 1s.</p>', b);
        return;
      }
      if (act === 'scaled') { goTo({ scaled: !s.scaled }); return; }
      if (b.hasAttribute('data-reset')) { api.interrupt(); s = JSON.parse(JSON.stringify(START)); }
      draw(); report();
    });

    var PAGES = [
      { t: '2 lines, 1 crossing', parts: ['line1', 'line2', 'cross'], state: { mode: 'lines', theta: 70, delta: 0 },
        body: '<p>Each equation of a 2 by 2 system is a line. The solution is the point where the 2 lines cross. Drag the end of the second line.</p>' },
      { t: 'Nudge y', parts: ['cloud', 'cross'], state: { theta: 70, delta: 0.15 },
        body: '<p>Now jitter the right-hand side by up to 0.15, 80 times. Each nudge moves the crossing a little, and the dots show where it lands.</p>' },
      { t: 'Tilt towards parallel', parts: ['cloud', 'line2'], state: { theta: 8, delta: 0.15 },
        body: '<p>With the lines 8° apart, the same nudges scatter the crossing along a long streak. The streak ratio matches κ.</p>' },
      { t: 'Where κ comes from', parts: ['ellipse'], state: { theta: 8, delta: 0.15 },
        body: '<p>The <b class="is-o">ellipse</b> is every answer a nudge of exactly δ can produce. κ = σmax ÷ σmin is the ratio of its long and short radius.</p>' },
      { t: 'Solving beats inverting', parts: ['resSolve', 'resInv'], state: { mode: 'hilbert' },
        body: '<p>Hilbert matrices are badly conditioned. Solving directly keeps the residual tiny, and inverting first leaves a far larger one. The bars show how much larger.</p>' },
      { t: 'Unscaled features', parts: ['path', 'loss'], state: { mode: 'scale', scaled: false },
        body: '<p>One feature is 5 times the scale of the other, so the loss is a thin valley. Gradient descent zigzags across it and crawls along it.</p>' },
      { t: 'After scaling', parts: ['path', 'loss'], state: { mode: 'scale', scaled: true },
        body: '<p>Rescale that feature and the contours turn round. Descent heads straight for the minimum in far fewer steps.</p>' }
    ];
    draw();
    XP.guide(root.querySelector('[data-guide-box]'), PAGES, function (p, i, redraw) {
      if (!p) { api.focus([]); return; }
      if (!redraw) goTo(p.state);
      api.focus(p.parts);
    });
  });
```

- [ ] **Step 7: Register it and add its styles**

In `_data/module_labs.yml`, add:

```yaml
  '6': conditioning
```

In the Linear Algebra section of `css/labs.css`, add:

```css
.lab-plane .pl-ellipse { fill: none; stroke: var(--xp-o); stroke-width: 2; }
.lab-plane .pl-cloud { fill: var(--xp-v); }
.lab-plane .pl-cross { fill: var(--text); }
.lab-plane .pl-bar-solve { fill: var(--xp-v); }
.lab-plane .pl-bar-inv { fill: var(--tf-down); }
.lab-plane .pl-step { fill: var(--xp-o); }
```

- [ ] **Step 8: Build and run every check**

Run the same commands as Task 3, Step 8.

Expected:
- `7 checks passed`.
- `1 tracks checked, 0 problems`.
- No bounds line.

At `/linear-algebra/#m7`, confirm these 3 behaviours:
- On page 3, the streak ratio sits close to κ.
- The Hilbert bars grow with n, the inverting bar more so.
- The scaled descent reaches the minimum in fewer steps than the unscaled one.

- [ ] **Step 9: Commit**

```bash
git add js/labs/linear-algebra/conditioning.js _includes/labs/linear-algebra/conditioning.html \
  scripts/verify_labs.py _data/module_labs.yml css/labs.css
git commit -m "Add the numerical behaviour explainer to Linear Algebra"
```

---

### Task 10: The Linear Algebra gate

**Files:**
- Modify: `docs/interview.md`, adding a "Module explainers" section, plus any explainer that a check below fails.

- [ ] **Step 1: Document the system**

Add this section to `docs/interview.md`, after the section on the canvas explainers:

```markdown
## Module explainers

A track listed in `_data/module_labs.yml` gives each of its modules its own
explainer, in place of the static diagram. Each explainer has 2 files: markup in
`_includes/labs/<track>/<slug>.html` and behaviour in `js/labs/<track>/<slug>.js`.

The first half of each script is pure maths, exported for Node, and
`scripts/verify_labs.py` checks it against NumPy and SciPy. The second half
calls `XP.lab(id, mount)` from `explainer-core.js`, which provides:

- `api.values(obj)`, which fills `[data-val]` in the explainer and `[data-live]`
  in its module;
- `api.say(text)` for the live region, and `api.focus(parts)` for highlighting;
- `api.animate(from, to, ms, onFrame)`, which finishes any running animation first
  and marks the root with `data-anim` while it runs.

`js/components/lab-loader.js` injects a script when its module comes within 1
screen of the viewport. If the script fails, the module shows its old static
diagram instead.

The rules:

- Every explainer opens on page 1 of its guide.
- A quantity keeps 1 colour everywhere.
- Anything with a natural handle is dragged. A slider exists only for a quantity
  that has no handle and no other control.
- An equation playground whose controls repeat its module's explainer is removed.
  Its live line moves to the equation as `live: { tex, slots }`, and the
  explainer feeds it.

Check an explainer with `scripts/verify_labs.py --track <id>`,
`scripts/check_labs.py <id>` and `scripts/check_chart_bounds.py`.
```

- [ ] **Step 2: Run the full gate**

Run:

```bash
PAGES_DISABLE_NETWORK=1 make build && make check && make test
(python3 -m http.server 4000 -d _site >/dev/null 2>&1 &) ; (python3 -m http.server 4011 -d _site >/dev/null 2>&1 &) ; sleep 1
../venv/bin/python scripts/verify_labs.py
../venv/bin/python scripts/check_labs.py
../venv/bin/python scripts/check_chart_bounds.py _data/interview.yml
../venv/bin/python ../harness.py _data/interview.yml
python3 scripts/render_math.py --check
```

Expected:
- `make check` reports 0 flags, and `make test` passes.
- `7 checks passed`.
- `1 tracks checked, 0 problems`.
- No overflowing chart on any track.
- `pages with problems: 0`.
- The render check passes.

- [ ] **Step 3: Prose pass**

Collect every guide page body, heading and `lab-src` line from the 7 explainers into `../prose-la.txt`. Invoke the `no-ai-slop` skill on it, apply its edits back into the explainers, and rerun `check_labs.py linear-algebra`.

- [ ] **Step 4: Check by eye at both widths**

At 1,400 px and at 390 px, in both themes, open each of the 7 modules. Confirm each explainer:
- fits its module;
- opens on guide page 1;
- matches its guide text on every page.

- [ ] **Step 5: Commit**

```bash
git add docs/interview.md js/labs/linear-algebra _includes/labs/linear-algebra css/labs.css
git commit -m "Document module explainers and finish the Linear Algebra track"
```
