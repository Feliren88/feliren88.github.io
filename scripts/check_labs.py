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
  x.querySelectorAll('svg').forEach(v => { s += v.innerHTML; });
  x.querySelectorAll('canvas').forEach(c => { try { s += c.toDataURL().slice(-400); } catch (e) {} });
  x.querySelectorAll('[data-val]').forEach(e => { s += '|' + e.textContent; });
  x.querySelectorAll('[data-say]').forEach(e => { s += '|' + e.textContent; });
  return s; }"""

# Capture visible intermediate frames locally, so a slow test client cannot
# miss a real replay that finishes at its starting picture.
RECORD = """sel => { const snap = """ + SNAP + """;
  const state = {before: snap(sel), changed: false, token: null};
  function sample() {
    if (snap(sel) !== state.before) state.changed = true;
    state.token = requestAnimationFrame(sample);
  }
  state.token = requestAnimationFrame(sample);
  window.__labCheckCapture = state;
}"""
STOP_RECORD = """() => {
  const state = window.__labCheckCapture;
  cancelAnimationFrame(state.token);
  delete window.__labCheckCapture;
  return state.changed;
}"""

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
  root.querySelectorAll('svg text, .lab-eq, .lab-eq span, .lab-ctl label, .lab-note, .lab-src, .lab-src a, .xp-guide header b, .xp-guide-b, .xp-guide-b b, .xp-guide-n, button').forEach(el => {
    if (el.matches(':disabled') || el.closest('.is-dim, .is-faint') || !el.getClientRects().length) return;
    const cs = getComputedStyle(el), c = rgb(el instanceof SVGElement ? cs.fill : cs.color);
    if (c && ratio(over(c, bg), bg) < 4.5) out.push('text "' + el.textContent.trim().slice(0, 20) + '" ' + ratio(over(c, bg), bg).toFixed(2));
  });
  root.querySelectorAll('.pl-vec, .pl-handle, .pl-mark').forEach(el => {
    if (el.matches(':disabled') || el.closest('.is-dim, .is-faint') || !el.getClientRects().length) return;
    const cs = getComputedStyle(el);
    const c = rgb(el.classList.contains('pl-handle') ? cs.stroke : el.classList.contains('pl-vec') ? cs.color : (cs.stroke && cs.stroke !== 'none' ? cs.stroke : cs.fill));
    if (c && c[3] > 0 && ratio(over(c, bg), bg) < 3) out.push('mark ' + el.getAttribute('class') + ' ' + ratio(over(c, bg), bg).toFixed(2));
  });
  return out.slice(0, 6); }"""


# Marks that share 1 part must share its highlight: a redraw must not undo the guide's dimming.
MIXED = """(sel) => { const st = document.querySelector(sel + ' [data-stage]'), by = {};
  st.querySelectorAll('[data-part]').forEach(e => { const p = e.getAttribute('data-part');
    if (p.indexOf(' ') >= 0 || !e.getClientRects().length) return;
    (by[p] = by[p] || new Set()).add(e.classList.contains('is-dim')); });
  return Object.keys(by).filter(p => by[p].size > 1); }"""


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
        pg.evaluate(RECORD, sel)
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
        observed = pg.evaluate(STOP_RECORD)
        if pg.evaluate("() => !!document.querySelector('dialog[open]')"):
            pg.keyboard.press('Escape')
            pg.wait_for_timeout(150)
            continue
        if not observed and mid == before and pg.evaluate(SNAP, sel) == before:
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
        print('Checking', where, flush=True)
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
            print('Guide', where, guide_n(pg, sel), flush=True)
            nxt.click()
            pg.wait_for_timeout(1000)
            mixed = pg.evaluate(MIXED, sel)
            if mixed:
                fail(where, 'page', guide_n(pg, sel), 'dims only some marks of', ', '.join(mixed))
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
    # The site's service worker fetches scripts itself, out of reach of page
    # routes, so block it for this test.
    ctx = b.new_context(service_workers='block', viewport={'width': 1400, 'height': 900})
    pg = ctx.new_page()
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
    ctx.close()


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
