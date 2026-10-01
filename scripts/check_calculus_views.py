"""Check Calculus examples, recorded motions, live equations and edge states."""
import sys

from playwright.sync_api import sync_playwright

BASE = next((a for a in sys.argv[1:] if a.startswith('http')), 'http://localhost:4100')


def set_range(control, value):
    control.evaluate("(e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))}", value)


def number(lab, name):
    return float(lab.locator(f'[data-val="{name}"]').first.text_content().replace('−', '-'))


def derivatives(page):
    page.goto(BASE + '/calculus/#m1')
    lab = page.locator('[data-lab="calculus/derivatives"] .lab')
    assert lab.count() == 1, 'The derivatives module needs its own interactive scene'
    lab.scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('[data-lab=\"calculus/derivatives\"]').getAttribute('data-lab-state') === 'ready'")
    assert lab.locator('.xp-guide-n').inner_text() == '1 / 8'
    assert number(lab, 'fx') == 1 and number(lab, 'secant') == 3 and number(lab, 'slope') == 2
    assert float(page.locator('#m1 [data-live="secant"]').text_content()) == 3
    progress = lab.locator('[data-k="progress"]')
    lab.locator('[data-act="play"]').click()
    assert abs(number(lab, 'h') - 0.01) < 1e-8
    set_range(progress, 0)
    assert number(lab, 'h') == 1 and number(lab, 'secant') == 3, 'Rewind must restore the recorded secant'
    set_range(progress, 1)
    assert abs(number(lab, 'secant') - 2.01) < 1e-8
    zoom = lab.locator('[data-k="zoom"]')
    before_zoom = float(zoom.input_value())
    set_range(zoom, 32)
    assert float(progress.input_value()) == 1
    set_range(progress, 0)
    assert float(zoom.input_value()) == before_zoom, 'A manual zoom must record its previous state'
    set_range(progress, 1)
    point = lab.locator('[data-handle="x"]')
    before_x = number(lab, 'x')
    point.focus()
    page.keyboard.press('ArrowRight')
    assert number(lab, 'x') > before_x
    set_range(progress, 0)
    assert number(lab, 'x') == before_x, 'A handle change must record its previous state'
    nxt, prev = lab.locator('[data-guide="1"]'), lab.locator('[data-guide="-1"]')
    for _ in range(5):
        nxt.click()
    assert lab.locator('[data-note]').get_attribute('data-edge') == 'corner'
    assert 'left' in lab.locator('[data-note]').inner_text().lower()
    nxt.click()
    assert lab.locator('[data-note]').get_attribute('data-edge') == 'vertical'
    assert 'finite derivative' in lab.locator('[data-note]').inner_text()
    prev.click()
    assert lab.locator('[data-k="kind"]').input_value() == 'abs'
    assert number(lab, 'x') == 0, 'Previous must restore the corner example'
    while not prev.is_disabled():
        prev.click()
    assert number(lab, 'x') == 1 and number(lab, 'h') == 1
    assert lab.locator('[data-k="kind"]').input_value() == 'square'
    lab.locator('[data-zoom="quotient"]').click()
    dialog = page.locator('dialog[open]')
    assert '3.000000' in dialog.inner_text(), 'Worked arithmetic must use the displayed secant'
    page.keyboard.press('Escape')
    for view in ('local', 'graph'):
        lab.locator(f'[data-zoom="{view}"]').click()
        assert page.locator('dialog[open] svg').count() == 1
        page.keyboard.press('Escape')
    for kind in ('square', 'sine', 'exp', 'abs', 'cube-root'):
        lab.locator('[data-k="kind"]').select_option(kind)
        assert float(page.locator('#m1 [data-live="fx"]').text_content()) == number(lab, 'fx')
    assert 'NaN' not in lab.inner_text() and 'Infinity' not in lab.inner_text()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
    page.emulate_media(reduced_motion='no-preference')
    page.reload()
    lab.scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('[data-lab=\"calculus/derivatives\"]').getAttribute('data-lab-state') === 'ready'")
    lab.locator('[data-reset]').click()
    lab.locator('[data-act="play"]').click()
    assert lab.get_attribute('data-anim') is not None
    set_range(progress, 0.25)
    assert float(progress.input_value()) == 0.25, 'Interrupting playback must preserve the requested fraction'
    assert 0.01 < number(lab, 'h') < 1
    assert lab.get_attribute('data-anim') is None

    lab.locator('[data-reset]').click()
    for _ in range(3): lab.locator('[data-guide="1"]').click()
    assert lab.locator('.xp-guide-n').inner_text() == '4 / 8', 'A rapid press must survive the coincident-point readout'


with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome')
    for width in (1400, 390):
        for theme in ('dark', 'light'):
            page = browser.new_page(viewport={'width': width, 'height': 1000}, reduced_motion='reduce')
            page.add_init_script("localStorage.setItem('theme', '" + theme + "')")
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            derivatives(page)
            assert not errors, errors
            page.close()
    browser.close()
print('Calculus examples, recorded motion, guide navigation and edge states passed.')
