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


def gradients(page):
    page.goto(BASE + '/calculus/#m3')
    lab = page.locator('[data-lab="calculus/gradients-jacobians-hessians"] .lab')
    assert lab.count() == 1, 'The gradient module needs contours, a local mapping and curvature'
    lab.scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('[data-lab=\"calculus/gradients-jacobians-hessians\"]').getAttribute('data-lab-state') === 'ready'")
    assert lab.locator('.xp-guide-n').inner_text() == '1 / 9'
    assert number(lab, 'fx') == 1.6 and number(lab, 'gx') == 2.1 and number(lab, 'gy') == 2.2
    labels_fit = lab.locator('[data-cosine] svg').evaluate("e=>{const c=e.querySelector('clipPath rect').getBBox();return [...e.querySelectorAll('text')].every(t=>{const r=t.getBBox();return r.x>=c.x&&r.x+r.width<=c.x+c.width;});}")
    assert labels_fit, 'Cosine angle labels must fit inside the clipped plot'
    assert float(page.locator('#m3 [data-live="directionalRate"]').text_content()) == 2.1
    progress = lab.locator('[data-k="progress"]')
    lab.locator('[data-act="play"]').click()
    set_range(progress, 0.5)
    assert abs(number(lab, 'directionalRate') + 2.1) < 0.001
    set_range(progress, 0)
    assert number(lab, 'directionalRate') == 2.1
    handle = lab.locator('[data-contours] [data-handle="point"]')
    handle.focus(); page.keyboard.press('ArrowRight')
    assert number(lab, 'gx') != 2.1
    set_range(progress, 0)
    assert number(lab, 'gx') == 2.1, 'A point drag must record its starting position'
    nxt,prev = lab.locator('[data-guide="1"]'), lab.locator('[data-guide="-1"]')
    nxt.click(); nxt.click()
    assert abs(number(lab, 'directionalRate') - (2.1**2+2.2**2)**0.5) < 0.001
    nxt.click()
    assert abs(number(lab, 'directionalRate')) < 0.001, 'A perpendicular direction has zero rate'
    nxt.click()
    assert lab.locator('[data-k="view"]').input_value() == 'mapping'
    assert number(lab, 'mapX') == 1.05 and number(lab, 'mapY') == 0.7
    error = number(lab,'patchError')
    nxt.click()
    assert number(lab,'patchError') < error/5, 'A smaller square improves the local linear approximation'
    lab.locator('[data-zoom="jacobian"]').click()
    worked = page.locator('dialog[open]').inner_text()
    assert '0.2000' in worked and '0.4000' in worked
    page.keyboard.press('Escape')
    nxt.click()
    assert lab.locator('[data-k="view"]').input_value() == 'curvature'
    assert abs(number(lab,'curvatureLow') - 1.9802) < 0.001
    nxt.click()
    assert number(lab,'gx') == number(lab,'gy') == number(lab,'directionalRate') == 0
    assert 'Every direction' in lab.locator('[data-note]').inner_text()
    prev.click()
    assert number(lab,'gx') == 2.1, 'Previous must restore the declared point'
    nxt.click(); nxt.click()
    assert lab.locator('[data-k="view"]').input_value() == 'shapes'
    set_range(lab.locator('[data-k="d"]'),6)
    set_range(lab.locator('[data-k="m"]'),4)
    assert lab.locator('[data-shape="jacobian"]').get_attribute('data-rows') == '4'
    assert lab.locator('[data-shape="jacobian"]').get_attribute('data-cols') == '6'
    set_range(progress,0.5)
    assert float(lab.locator('[data-k="d"]').input_value()).is_integer()
    assert float(lab.locator('[data-k="m"]').input_value()).is_integer()
    while not prev.is_disabled(): prev.click()
    assert number(lab,'fx') == 1.6 and lab.locator('[data-k="view"]').input_value() == 'contours'
    assert 'NaN' not in lab.inner_text() and 'Infinity' not in lab.inner_text()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
    page.emulate_media(reduced_motion='no-preference'); page.reload()
    lab.scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('[data-lab=\"calculus/gradients-jacobians-hessians\"]').getAttribute('data-lab-state') === 'ready'")
    lab.locator('[data-act="play"]').click()
    assert lab.get_attribute('data-anim') is not None
    set_range(progress,0.25)
    assert float(progress.input_value()) == 0.25 and lab.get_attribute('data-anim') is None


def optimisation(page):
    page.goto(BASE+'/calculus/#m4')
    lab=page.locator('[data-lab="calculus/optimisation-conditions"] .lab')
    assert lab.count()==1, 'The optimisation module needs its own interactive scene'
    lab.scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('[data-lab=\"calculus/optimisation-conditions\"]').getAttribute('data-lab-state')==='ready'")
    assert lab.locator('.xp-guide-n').inner_text()=='1 / 9'
    assert number(lab,'stationaryGradient')==0 and number(lab,'smallestCurvature')==2
    assert lab.locator('[data-classification]').inner_text()=='Minimum'
    assert float(page.locator('#m4 [data-live="smallestCurvature"]').text_content())==2
    progress=lab.locator('[data-k="progress"]')
    handle=lab.locator('[data-handle="point"]');handle.focus();page.keyboard.press('ArrowRight')
    assert number(lab,'stationaryGradient')>0 and lab.locator('[data-classification]').inner_text()=='Not stationary'
    set_range(progress,0)
    assert number(lab,'stationaryGradient')==0, 'A manual point change must rewind'
    lab.locator('[data-reset]').click()
    nxt,prev=lab.locator('[data-guide="1"]'),lab.locator('[data-guide="-1"]')
    nxt.click();assert lab.locator('[data-classification]').inner_text()=='Maximum'
    nxt.click();assert lab.locator('[data-classification]').inner_text()=='Saddle'
    nxt.click();assert lab.locator('[data-classification]').inner_text()=='Inconclusive'
    assert lab.locator('[data-part="curvature"].is-zero').count()==2, 'Zero curvature needs a neutral section and direction'
    assert 'scaled normal' in ' '.join(lab.locator('[data-constraint] text').all_text_contents()), 'Use a legible constraint legend'
    lab.locator('[data-zoom="hessian"]').click()
    assert '0.0000' in page.locator('dialog[open]').inner_text()
    assert 'fourth power' in page.locator('dialog[open]').inner_text()
    page.keyboard.press('Escape')
    nxt.click();assert number(lab,'chordGap')==1
    lab.locator('[data-k="axis"]').select_option('y')
    assert 'Slice along y' in ' '.join(lab.locator('[data-chord] text').all_text_contents()), 'Identical slices still need the chosen axis named'
    nxt.click();assert number(lab,'chordGap')==-1
    nxt.click();assert abs(number(lab,'tangentRate')+1)<1e-8
    assert abs(float(page.locator('#m4 [data-live="stationaryGradient"]').text_content())-5**.5)<.0001, 'The live gradient must belong to the visible constrained objective'
    lab.locator('[data-act="play"]').click()
    assert abs(number(lab,'theta')-2/3)<.0001 and number(lab,'tangentRate')==0
    set_range(progress,0);assert number(lab,'theta')==.5
    set_range(progress,1)
    lab.locator('[data-zoom="constraint"]').click()
    assert '1.3333' in page.locator('dialog[open]').inner_text()
    assert 'ϖ' not in page.locator('dialog[open] table').inner_text(), 'Table labels must use supported glyphs'
    page.keyboard.press('Escape')
    nxt.click();assert number(lab,'tangentRate')==0
    prev.click();assert number(lab,'theta')==.5, 'Previous must restore the declared constraint point'
    nxt.click();nxt.click()
    assert lab.locator('[data-k="view"]').input_value()=='experiment'
    assert number(lab,'positiveCount')==16 and number(lab,'sampleFraction')==.0313
    assert number(lab,'signEstimate')==.125
    assert page.locator('#m4 [data-live="stationaryGradient"]').text_content()=='Not evaluated'
    assert page.locator('#m4 [data-live="smallestCurvature"]').text_content()=='Not evaluated'
    set_range(lab.locator('[data-k="d"]'),6)
    assert number(lab,'positiveCount')==0 and 'does not prove' in lab.locator('[data-note]').inner_text()
    set_range(progress,.5)
    assert float(lab.locator('[data-k="d"]').input_value()).is_integer()
    lab.locator('[data-zoom="experiment"]').click()
    assert '512' in page.locator('dialog[open]').inner_text() and '41' in page.locator('dialog[open]').inner_text()
    page.keyboard.press('Escape')
    while not prev.is_disabled():prev.click()
    assert lab.locator('[data-classification]').inner_text()=='Minimum' and number(lab,'stationaryGradient')==0
    assert 'NaN' not in lab.inner_text() and 'Infinity' not in lab.inner_text()
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
    page.emulate_media(reduced_motion='no-preference');page.reload();lab.scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('[data-lab=\"calculus/optimisation-conditions\"]').getAttribute('data-lab-state')==='ready'")
    lab.locator('[data-act="play"]').click();assert lab.get_attribute('data-anim') is not None
    set_range(lab.locator('[data-k="progress"]'),.25)
    assert float(lab.locator('[data-k="progress"]').input_value())==.25 and lab.get_attribute('data-anim') is None


TESTS = {'derivatives': derivatives, 'chain-rule': chain_rule, 'gradients-jacobians-hessians': gradients, 'optimisation-conditions': optimisation}
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
