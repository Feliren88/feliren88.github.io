"""Check live fit values, scrubbing and degenerate data in a real browser."""
import sys
from playwright.sync_api import sync_playwright
base = sys.argv[1] if len(sys.argv)>1 else 'http://localhost:4000'
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome')
    page=browser.new_page(viewport={'width':390,'height':900}, reduced_motion='reduce')
    page.goto(base+'/linear-algebra/#m6')
    lab=page.locator('[data-lab="linear-algebra/least-squares"] .lab')
    lab.scroll_into_view_if_needed()
    module=page.locator('#m6')
    assert module.locator('.ivmp-play, .ivmp[data-kind="fit"], .ivmp-fit').count()==0, 'Remove the duplicate line-fit playground'
    lab.locator('[data-k="mode"]').select_option('fit')
    live=module.locator('[data-live-eq] [data-live="w"]')
    before=live.text_content()
    line=lab.locator('svg.lab-plane').nth(1).locator('.pl-handle.is-o').first
    line.focus();page.keyboard.press('ArrowUp')
    assert live.text_content()!=before, 'Dragging the line must update the module equation'
    lab.locator('[data-act="snap"]').click()
    scrub=lab.locator('[data-k="progress"]')
    assert scrub.count()==1, 'The Snap motion needs a scrub control'
    assert abs(float(lab.locator('[data-val="w1"]').text_content())-float(live.text_content()))<0.01, 'The active fit weight must match the fitted slope'
    final=live.text_content()
    scrub.evaluate("e=>{e.value=0;e.dispatchEvent(new Event('input',{bubbles:true}))}")
    assert live.text_content()!=final, 'Scrubbing Snap back must restore the starting line'
    scrub.evaluate("e=>{e.value=1;e.dispatchEvent(new Event('input',{bubbles:true}))}")
    assert live.text_content()==final, 'Scrubbing forward must restore the fitted line'
    lab.locator('svg.lab-plane').nth(1).locator('.pl-handle.is-v').evaluate_all("""hs=>{
        for(let h of hs) for(let i=0;i<20;i++) h.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',shiftKey:true,bubbles:true}));
    }""")
    lab.locator('[data-act="snap"]').click()
    assert 'several lines fit' in lab.locator('[data-say]').inner_text(), 'Coincident x values need an explicit non-unique state'
    assert lab.locator('[data-note]').is_visible() and 'several lines fit' in lab.locator('[data-note]').inner_text(), 'The non-unique fit must be visible as well as announced'
    assert 'NaN' not in lab.inner_text() and 'Infinity' not in lab.inner_text()
    lab.locator('[data-k="mode"]').select_option('ridge')
    lab.locator('[data-zoom="normal"]').click()
    assert 'XᵀX + λI' in page.locator('dialog[open]').inner_text(), 'The ridge zoom must use its penalised system'
    page.keyboard.press('Escape')
    lab.locator('[data-reset]').click()
    page.emulate_media(reduced_motion='no-preference')
    nxt=lab.locator('[data-guide="1"]')
    while not nxt.is_disabled(): nxt.click()
    page.wait_for_timeout(920)
    assert lab.get_attribute('data-anim') is None, 'The last guide page must finish its transition within 900ms'
    browser.close()
print('Live line fit, scrubbing, degenerate points and guide timing passed.')
