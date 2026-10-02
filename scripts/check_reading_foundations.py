"""Check equation-reading examples, live controls, narration, and static fallbacks."""
import sys
import yaml
from pathlib import Path
from playwright.sync_api import sync_playwright

base = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4187'
repo = Path(__file__).resolve().parents[1]
bridges = yaml.safe_load((repo / '_data/interview_foundations.yml').read_text())['bridges']
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    for width in ([390] if '--phone' in sys.argv else [1400, 390]):
        for theme in ['dark', 'light']:
            for bridge in bridges:
                page = browser.new_page(viewport={'width': width, 'height': 1000}, reduced_motion='reduce')
                page.route('**/*', lambda route: route.continue_() if route.request.url.startswith(base) else route.abort())
                errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                assert page.goto(base + '/' + bridge['track'] + '/').status == 200
                page.evaluate('(theme)=>document.documentElement.dataset.theme=theme', theme)
                root = page.locator('[data-foundation]')
                assert root.count() == 1
                assert root.locator('.ivf-interactive').is_visible()
                assert root.locator('..').get_attribute('id') == 'm' + str(bridge['module'] + 1)
                assert root.locator('.ivf-derivation li').count() == 4
                diagram = root.locator('.ivf-diagram')
                first = diagram.inner_html()
                steps = root.locator('.ivn-steps button')
                for i in range(4):
                    steps.nth(i).click()
                    assert diagram.get_attribute('aria-label').endswith(root.locator('.ivn-say').inner_text())
                    assert root.locator('.ivf-derivation li.is-current').count() == 1
                control = root.locator('[data-value]')
                if bridge.get('options'):
                    control.select_option(bridge['options'][1])
                else:
                    control.evaluate('(el)=>{el.value=el.max;el.dispatchEvent(new Event("input"))}')
                changed = diagram.inner_html()
                assert changed
                assert diagram.get_attribute('aria-label').endswith(root.locator('.ivn-say').inner_text())
                if bridge['kind'] in ['normalise', 'normaliser-gradient']:
                    assert '0.881' in diagram.inner_text()
                if bridge['kind'] == 'likelihood':
                    assert '1.992' in diagram.inner_text()
                if bridge['kind'] == 'notation':
                    steps.nth(1).click()
                    assert 'u² du' in diagram.inner_text()
                if bridge['kind'] == 'langevin':
                    assert '2.000' in diagram.inner_text()
                if bridge['kind'] == 'tensor':
                    assert '16' in diagram.inner_text()
                if bridge['kind'] == 'autograd':
                    assert '1.820' in diagram.inner_text()
                    steps.nth(2).click()
                    assert 'w.requires_grad_(True)' in diagram.inner_text()
                    assert 'x.requires_grad_(False)' in diagram.inner_text()
                    code = diagram.locator('code').inner_text()
                    assert '\n' in code and '\\n' not in code
                    compile(code, '<example>', 'exec')
                if bridge.get('options'):
                    control.select_option(bridge['options'][0])
                else:
                    for value in [bridge['min'], bridge['max'], bridge['value']]:
                        control.evaluate('(el,v)=>{el.value=v;el.dispatchEvent(new Event("input"))}', str(value))
                root.locator('[data-reset]').click()
                assert diagram.inner_html() == first
                scrub = root.locator('[data-scrub]')
                scrub.focus()
                scrub.press('ArrowRight')
                assert root.locator('[data-count]').inner_text() == '2 / 4'
                root.locator('[data-speed]').select_option('1200')
                root.locator('[data-play]').click()
                page.wait_for_timeout(1350)
                assert root.locator('[data-count]').inner_text() == '3 / 4'
                root.locator('[data-play]').click()
                root.locator('[data-reset]').click()
                root.locator('summary').click()
                assert root.locator('.ivf-recall p').is_visible()
                page.evaluate('document.querySelector(".syl-page").style.setProperty("--rd-scale","1.6")')
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), (bridge['track'], width, 'Overflow')
                assert not errors, errors
                print(f"Passed {bridge['track']}, {width}px, {theme}.", flush=True)
                page.close()
    for bridge in bridges:
        page = browser.new_page(java_script_enabled=False)
        page.goto(base + '/' + bridge['track'] + '/')
        assert page.locator('.ivf-derivation li').count() == 4
        assert page.locator('.ivf-interactive').is_hidden()
        page.locator('.ivf-recall summary').click()
        assert page.locator('.ivf-recall p').is_visible()
        page.close()
    page = browser.new_page()
    page.goto(base + '/interview/')
    assert page.locator('.iv-foundation-route a').count() == 7
    for link in page.locator('.iv-foundation-route a').all():
        href = link.get_attribute('href')
        assert href.split('#')[0].strip('/') in [b['track'] for b in bridges]
        destination, fragment = href.split('#')
        response = page.request.get(base + destination)
        assert response.status == 200
        assert 'id="' + fragment + '"' in response.text()
    browser.close()
print('All reading foundations passed, including static fallbacks and hub links.')
