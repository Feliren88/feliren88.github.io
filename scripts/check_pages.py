#!/usr/bin/env python3
"""Load every syllabus page at 1,400 px and 390 px: diagrams, the track animation,
explainers, page errors, sideways scrolling and the track icon.

  python3 -m http.server 4011 -d _site   # in another terminal
  python3 scripts/check_pages.py _data/interview.yml

Needs playwright with a Chrome channel. Ends with "pages with problems: N".
"""
import yaml, sys
from playwright.sync_api import sync_playwright
topics = yaml.safe_load(open(sys.argv[1]))['topics']
bad = 0
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome')
    for width in (1400, 390):
        pg = b.new_page(viewport={'width': width, 'height': 900})
        for t in topics:
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto(f"http://localhost:4011/{t['id']}/", wait_until='load'); pg.wait_for_timeout(700)
            r = pg.evaluate("""() => ({
              mods: document.querySelectorAll('.syl-module').length,
              viz: [...document.querySelectorAll('.syl-module')].filter(m => m.querySelector('.ivz, .ivs')).length,
              anim: document.querySelectorAll('.an-host').length,
              steps: document.querySelectorAll('.an-host .an-steps li, .an-host [class*=step] li').length,
              xp: document.querySelectorAll('.xp').length,
              xpEmpty: [...document.querySelectorAll('.xp-body')].filter(x => !x.children.length).length,
              sw: document.documentElement.scrollWidth, icon: !!document.querySelector('#ivi-' + location.pathname.split('/')[1])
            })""")
            pg.remove_listener('pageerror', pg.listeners('pageerror')[0]) if hasattr(pg, 'listeners') else None
            problems = []
            if r['viz'] != r['mods']: problems.append(f"diagrams {r['viz']}/{r['mods']}")
            if r['anim'] != 1: problems.append('no animation')
            if r['xpEmpty']: problems.append('empty explainer')
            if r['sw'] > width: problems.append(f"scrolls sideways {r['sw']}")
            if not r['icon']: problems.append('no icon')
            if errs: problems.append('errors ' + '; '.join(errs[:2]))
            if problems:
                bad += 1; print(width, t['id'], problems)
            elif r['xp']: print(width, t['id'], f"ok, {r['xp']} explainers")
        pg.close()
    b.close()
print('pages with problems:', bad)
