#!/usr/bin/env python3
"""Verify decomposition readouts after view changes and delayed image loading."""
import sys
from playwright.sync_api import sync_playwright
base = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4000'
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome')
    context = browser.new_context(service_workers='block', reduced_motion='reduce', viewport={'width':390,'height':900})
    page = context.new_page()
    page.goto(base + '/linear-algebra/#m5')
    lab = page.locator('[data-lab="linear-algebra/decompositions"] .lab')
    lab.scroll_into_view_if_needed()
    select = lab.locator('[data-k="mode"]')
    select.select_option('chol')
    assert 'L L' in lab.locator('.lab-eq').inner_text(), 'Cholesky must label its factorisation as L Lᵀ'
    select.select_option('pca')
    before = lab.locator('[data-val="s1"]').first.inner_text()
    requests = []
    loading_states = []
    def slow_image(route):
        requests.append(route.request.url)
        loading_states.append(lab.locator('[data-say]').inner_text())
        response = route.fetch()
        page.wait_for_timeout(1000)
        route.fulfill(response=response)
    page.route('**/assets/data/tiny-vgg.json', slow_image)
    select.evaluate("""e => {
        e.value = 'image'; e.dispatchEvent(new Event('change', {bubbles:true}));
        setTimeout(() => {e.value='pca'; e.dispatchEvent(new Event('change', {bubbles:true}))}, 200);
    }""")
    page.wait_for_timeout(1400)
    assert lab.locator('[data-val="s1"]').first.inner_text() == before, 'Late image data must preserve the current PCA values'
    assert len(requests) == 1, 'The image view must fetch the sample data once'
    assert all('loading' in state.lower() for state in loading_states), 'The pending image view must describe its loading state'
    lab.locator('[data-k="mode"]').select_option('pca')
    lab.locator('.pl-handle.is-v').evaluate_all("""hs => {
        for (let h of hs) for (let key of ['ArrowRight', 'ArrowUp'])
            for (let i=0; i<20; i++) h.dispatchEvent(new KeyboardEvent('keydown', {key, shiftKey:true, bubbles:true}));
    }""")
    state = lab.locator('[data-say]').inner_text()
    assert '0 variance' in state, 'Coincident points must report zero variance'
    assert 'NaN' not in state and 'Infinity' not in state, 'Degenerate PCA must use a finite description'
    lab.locator('[data-zoom="values"]').click()
    singular = page.locator('dialog[open] tbody td').all_text_contents()
    assert [float(x) for x in singular[:2]] == [0,0], 'PCA zoom values must describe the active cloud'
    page.keyboard.press('Escape')
    lab.locator('[data-k="mode"]').select_option('image')
    rank = lab.locator('[data-k="k"]')
    rank.evaluate("e => {e.value=1; e.dispatchEvent(new Event('input', {bubbles:true}))}")
    coarse = lab.locator('[data-img="rank"]').evaluate("e => Array.from(e.getContext('2d').getImageData(0,0,64,64).data)")
    rank.evaluate("e => {e.value=64; e.dispatchEvent(new Event('input', {bubbles:true}))}")
    original = lab.locator('[data-img="orig"]').evaluate("e => Array.from(e.getContext('2d').getImageData(0,0,64,64).data)")
    rebuilt = lab.locator('[data-img="rank"]').evaluate("e => Array.from(e.getContext('2d').getImageData(0,0,64,64).data)")
    assert coarse != rebuilt, 'Retaining more singular values must change the bitmap'
    assert max(abs(a-b) for a,b in zip(original,rebuilt)) <= 1, 'Full rank must reconstruct the image within one rounding level'
    rank.evaluate("e => {e.value=8; e.dispatchEvent(new Event('input', {bubbles:true}))}")
    lab.locator('[data-zoom="error"]').click()
    values = page.locator('dialog[open] tbody td').all_text_contents()
    assert abs(float(values[-2])-float(values[-1])) <= 0.0001, 'The measured error must agree with the singular-value tail'
    page.keyboard.press('Escape')
    context.close()
    browser.close()
print('Cholesky labels and late image-data isolation passed.')
