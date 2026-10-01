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


def chain_rule(page):
    page.goto(BASE + '/calculus/#m2')
    lab = page.locator('[data-lab="calculus/chain-rule"] .lab')
    assert lab.count() == 1, 'The chain rule needs linked number lines and a computation graph'
    lab.scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('[data-lab=\"calculus/chain-rule\"]').getAttribute('data-lab-state') === 'ready'")
    assert lab.locator('.xp-guide-n').inner_text() == '1 / 8'
    assert abs(number(lab, 'g') - 1) < 1e-8 and abs(number(lab, 'f') - 0.8415) < 0.001
    assert abs(float(page.locator('#m2 [data-live="chainRate"]').text_content()) - 1.0806) < 0.001
    assert not lab.locator('[data-k="shape"]').is_visible(), 'Graph size belongs to the computation graph view'
    assert not lab.locator('[data-loss-eq]').is_visible(), 'The number lines show their own equation'
    progress = lab.locator('[data-k="progress"]')
    lab.locator('[data-act="play"]').click()
    finished = lab.locator('[data-stage]').inner_html()
    set_range(progress, 0)
    assert lab.locator('[data-stage]').inner_html() != finished, 'The forward pass must rewind'
    set_range(progress, 1)
    assert lab.locator('[data-stage]').inner_html() == finished
    nxt, prev = lab.locator('[data-guide="1"]'), lab.locator('[data-guide="-1"]')
    for _ in range(3): nxt.click()
    smallest_label = lab.locator('[data-graph] svg').evaluate("e=>Math.min(...[...e.querySelectorAll('text')].map(t=>parseFloat(getComputedStyle(t).fontSize)*t.getScreenCTM().a))")
    assert smallest_label >= 10, 'The computation graph needs readable labels on a phone'
    wave = lab.locator('[data-graph] circle[r="7"]')
    loss_node = lab.locator('[data-graph] .pl-node').last
    loss_centre = float(loss_node.get_attribute('x')) + float(loss_node.get_attribute('width')) / 2
    assert abs(float(wave.get_attribute('cx')) - loss_centre) < 0.1, 'The forward pass must reach the loss before reversing'
    nxt.click()
    assert number(lab, 'loss') == 4 and number(lab, 'lossGradient') == -8
    assert not lab.locator('[data-line-eq]').is_visible(), 'The computation graph shows its own equation'
    lab.locator('[data-term="graph"]').dispatch_event('mouseenter')
    assert lab.locator('[data-graph] [data-part="graph"]:not(.is-dim)').count() > 0, 'Hovering loss must highlight its graph'
    lab.locator('[data-term="graph"]').dispatch_event('mouseleave')
    lab.locator('[data-k="shape"]').select_option('1,4')
    set_range(progress, 0.5)
    assert lab.locator('[data-k="shape"]').input_value() == '1,4', 'Pass counts must stay whole while scrubbing'
    set_range(progress, 0)
    assert lab.locator('[data-k="shape"]').input_value() == '4,1'
    lab.locator('[data-k="shape"]').select_option('4,1')
    assert float(page.locator('#m2 [data-live="lossGradient"]').text_content().replace('−', '-')) == -8
    lab.locator('[data-k="parameter"]').select_option('w')
    handle = lab.locator('[data-handle="parameter"]')
    handle.focus(); page.keyboard.press('ArrowRight')
    assert abs(number(lab, 'loss') - 3.61) < 1e-8, 'Dragging w must change the computed loss'
    set_range(progress, 0)
    assert number(lab, 'loss') == 4, 'Rewind must restore the model input before a manual change'
    nxt.click()
    assert number(lab, 'loss') == 1 and number(lab, 'lossGradient') == 2
    lab.locator('[data-zoom="adjoints"]').click()
    worked = page.locator('dialog[open]').inner_text()
    assert '4.0000' in worked and '−2.0000' in worked and '2.0000' in worked, 'Shared-input adjoints must add every branch'
    page.keyboard.press('Escape')
    nxt.click()
    assert number(lab, 'loss') == 0 and number(lab, 'lossGradient') == 0
    prev.click()
    assert lab.locator('[data-k="view"]').input_value() == 'shared'
    assert number(lab, 'lossGradient') == 2, 'Previous must restore the shared-input example'
    while not prev.is_disabled(): prev.click()
    assert lab.locator('[data-k="view"]').input_value() == 'lines'
    assert number(lab, 'g') == 1
    assert 'NaN' not in lab.inner_text() and 'Infinity' not in lab.inner_text()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
    page.emulate_media(reduced_motion='no-preference'); page.reload()
    lab.scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('[data-lab=\"calculus/chain-rule\"]').getAttribute('data-lab-state') === 'ready'")
    lab.locator('[data-act="play"]').click()
    assert lab.get_attribute('data-anim') is not None
    set_range(progress, 0.25)
    assert float(progress.input_value()) == 0.25 and lab.get_attribute('data-anim') is None


TESTS = {'derivatives': derivatives, 'chain-rule': chain_rule}
SELECTED = [a for a in sys.argv[1:] if a in TESTS] or list(TESTS)

with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome')
    for width in (1400, 390):
        for theme in ('dark', 'light'):
            for name in SELECTED:
                page = browser.new_page(viewport={'width': width, 'height': 1000}, reduced_motion='reduce')
                page.add_init_script("localStorage.setItem('theme', '" + theme + "')")
                errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                TESTS[name](page)
                assert not errors, errors
                page.close()
    browser.close()
print('Calculus examples, recorded motion, guide navigation and edge states passed.')
