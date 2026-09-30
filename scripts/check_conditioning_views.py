"""Check numerical-behaviour guide state, scrubbing and view readouts."""
import sys
from playwright.sync_api import sync_playwright
base=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:4000'
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome')
    page=browser.new_page(viewport={'width':390,'height':900}, reduced_motion='reduce')
    page.goto(base+'/linear-algebra/#m7')
    lab=page.locator('[data-lab="linear-algebra/conditioning"] .lab')
    lab.scroll_into_view_if_needed()
    assert lab.locator('svg.lab-plane:visible').count()==1, 'Only the active chart may be visible'
    nxt=lab.locator('[data-guide="1"]')
    nxt.click();nxt.click()
    kappa=float(lab.locator('[data-val="kappa"]').first.text_content())
    ratio=float(lab.locator('[data-val="ratio"]').text_content())
    assert abs(ratio/kappa-1)<0.2, 'The simulated streak must approximate the condition number'
    assert lab.locator('[data-k="progress"]').count()==1, 'The numerical motions need a scrub control'
    lab.locator('[data-k="mode"]').select_option('hilbert')
    assert page.locator('#m7 [data-live="resSolve"]').count()==1, 'The Hilbert view must publish its measured residual to the module equation'
    lab.locator('[data-k="mode"]').select_option('scale')
    lab.locator('[data-act="play"]').click()
    scrub=lab.locator('[data-k="progress"]')
    finished=lab.locator('svg.lab-plane').nth(2).inner_html()
    scrub.evaluate("e=>{e.value=0;e.dispatchEvent(new Event('input',{bubbles:true}))}")
    assert lab.locator('svg.lab-plane').nth(2).inner_html()!=finished, 'Descent must scrub back to its starting point'
    scrub.evaluate("e=>{e.value=1;e.dispatchEvent(new Event('input',{bubbles:true}))}")
    assert lab.locator('svg.lab-plane').nth(2).inner_html()==finished, 'Descent must scrub forward to its final path'
    before=lab.locator('[data-note]').inner_text()
    lab.locator('[data-act="scaled"]').click()
    after=lab.locator('[data-note]').inner_text()
    assert float(page.locator('#m7 [data-live="kappa"]').text_content())==1, 'Scaling must update the live condition number from its quadratic loss matrix'
    import re
    assert int(re.search(r'needs (\d+) steps',after).group(1)) < int(re.search(r'needs (\d+) steps',before).group(1)), 'Scaling must require fewer steps'
    while not nxt.is_disabled(): nxt.click()
    previous=lab.locator('[data-guide="-1"]')
    previous.click()
    assert lab.locator('[data-act="scaled"]').get_attribute('aria-pressed')=='false', 'Previous must restore the unscaled example'
    assert 'simulated' in lab.locator('.lab-src').inner_text(), 'Label simulated nudges'
    assert 'NaN' not in lab.inner_text() and 'Infinity' not in lab.inner_text()
    browser.close()
print('Conditioning cloud, scrubbing, scaling, guide state and provenance passed.')
