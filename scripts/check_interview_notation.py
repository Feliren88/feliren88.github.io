"""Audit rendered formula structure, operator limits, and all track boot paths."""
import sys
from pathlib import Path
import yaml
from playwright.sync_api import sync_playwright

base = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:4188'
topics = yaml.safe_load((Path(__file__).resolve().parents[1] / '_data/interview.yml').read_text())['topics']
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    for width in ([390] if '--phone' in sys.argv else [1400, 390]):
        page = browser.new_page(viewport={'width': width, 'height': 1000}, reduced_motion='reduce')
        page.route('**/*', lambda route: route.continue_() if route.request.url.startswith(base) else route.abort())
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        for topic in topics:
            track = topic['id']
            assert page.goto(base + '/' + track + '/').status == 200
            assert not errors, (track, errors)
            assert page.locator('math').count() > 0, track
            if track in ['math', 'math-proof']:
                roots = page.locator('.maths-animation')
                assert roots.count() == len(topic['modules'])
                for root in roots.all():
                    root.locator('.ivn-steps button').nth(3).click()
                    assert root.locator('foreignObject math').count() == 4
                    assert root.locator('foreignObject').evaluate_all('''nodes => nodes.every(n => {
                        const math=n.querySelector('math'),bounds=math.getBoundingClientRect(),box=n.getBoundingClientRect();
                        return bounds.width<=box.width+1 && bounds.height<=box.height+1;
                    })'''), (track, root.locator('h3').inner_text(), 'Clipped formula')
                if track == 'math':
                    sum_node = roots.first.locator('munderover')
                    centres = sum_node.evaluate('''node => [...node.children].map(e => {
                      const r=e.getBoundingClientRect();return r.x+r.width/2;
                    })''')
                    assert len(centres) == 3 and max(centres)-min(centres) < 2, centres
                    assert page.locator('#foundation-notation').count() == 1
                    assert page.locator('[data-foundation="notation"] .ivf-derivation mfrac').count() >= 3
            for root in page.locator('[data-foundation]').all():
                assert root.locator('.ivf-derivation math').count() == 4
                assert root.locator('.ivf-derivation').inner_text().find('E_{') == -1
            assert page.locator('body').inner_text().find('SLOT_') == -1, track
            page.evaluate('document.querySelector(".syl-page").style.setProperty("--rd-scale","1.6")')
            if track in ['math', 'math-proof', 'calculus', 'linear-algebra', 'information-theory', 'bayesian-statistics', 'frequentist-statistics', 'uncertainty-estimation', 'transformers', 'image-generation', 'deep-learning', 'computer-vision']:
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), (track, width, 'Overflow')
            assert not errors, (track, errors)
            print(f'Notation passed on {track}, {width}px.', flush=True)
        page.close()
    browser.close()
print('All track notation boot paths and structured diagram equations passed.')
