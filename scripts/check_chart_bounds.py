#!/usr/bin/env python3
"""Push every interview chart's knobs to their extremes and check nothing draws outside its chart.

Covers the equation playgrounds (interview-math.js), the staged animations with
live knobs (interview-anim.js) and the distribution labs. A mark counts as
contained when it sits inside a clipped group or inside the chart's viewBox.

  make serve   # in another terminal, serving _site on port 4000
  python3 scripts/check_chart_bounds.py _data/interview.yml [base_url]

Needs playwright with a Chrome channel. Prints each overflowing chart.
"""
import sys, yaml, itertools
from playwright.sync_api import sync_playwright
topics = [t['id'] for t in yaml.safe_load(open(sys.argv[1]))['topics']]
BASE = sys.argv[2] if len(sys.argv) > 2 else 'http://localhost:4000'
CHECK = """(root) => {
  // For each svg chart under root: every drawn mark that is not inside a clipped
  // group must lie within the svg's viewBox (2px tolerance).
  const bad = [];
  root.querySelectorAll('svg').forEach(svg => {
    const vb = svg.viewBox && svg.viewBox.baseVal; if (!vb || !vb.width) return;
    svg.querySelectorAll('path, line, circle, rect, polygon, polyline').forEach(m => {
      if (m.closest('[clip-path], clipPath, defs, marker')) return;
      let b; try { b = m.getBBox(); } catch (e) { return; }
      if (!b.width && !b.height) return;
      const t = 2;
      if (b.x < vb.x - t || b.y < vb.y - t || b.x + b.width > vb.x + vb.width + t || b.y + b.height > vb.y + vb.height + t)
        bad.push((m.getAttribute('class') || m.tagName) + ' [' + [b.x, b.y, b.width, b.height].map(v => Math.round(v)).join(',') + '] in ' + vb.width + 'x' + vb.height);
    });
  });
  return bad.slice(0, 4);
}"""
problems = 0
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome'); pg = b.new_page(viewport={'width': 1400, 'height': 900})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    for t in topics:
        pg.goto(f'{BASE}/{t}/', wait_until='load'); pg.wait_for_timeout(1200)
        groups = pg.evaluate("""() => {
          const out = []; let n = 0;
          document.querySelectorAll('.ivmp-play, .an-host, .ivd-lab').forEach(g => {
            const r = g.querySelectorAll('input[type=range]'); if (!r.length) return;
            g.setAttribute('data-chk', ++n); out.push([n, r.length, g.className.split(' ')[0]]); });
          return out; }""")
        for gid, nknobs, kind in groups:
            root = f'[data-chk="{gid}"]'
            # every knob alone at min and max, then all at min, all at max
            settings = [(i, e) for i in range(nknobs) for e in ('min', 'max')] + [('all', 'min'), ('all', 'max')]
            for which, end in settings:
                pg.evaluate("""([root, which, end]) => { const g = document.querySelector(root);
                  [...g.querySelectorAll('input[type=range]')].forEach((r, i) => {
                    if (which === 'all' || which === i) { r.value = r[end]; r.dispatchEvent(new Event('input', {bubbles: true})); r.dispatchEvent(new Event('change', {bubbles: true})); } }); }""", [root, which, end])
                pg.wait_for_timeout(60)
                bad = pg.evaluate(f"() => ({CHECK})(document.querySelector('{root}'))")
                if bad:
                    problems += 1
                    title = pg.evaluate(f"() => {{ const g = document.querySelector('{root}'); const h = g.querySelector('.ivmp-title, .an-title, h3'); return h ? h.textContent.slice(0, 50) : ''; }}")
                    print(f'{t} | {kind} | {title} | knob {which}={end} |', '; '.join(bad))
                    break
            # restore defaults by reloading only if needed later
    print('page errors:', errs[:3])
    b.close()
print('charts with overflow:', problems)
