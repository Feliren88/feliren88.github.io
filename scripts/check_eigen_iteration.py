#!/usr/bin/env python3
"""Check shrinking eigenvector iterations and scrubbing in the real browser."""
import sys
from playwright.sync_api import sync_playwright
base = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4000'
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome')
    page = browser.new_page(viewport={'width': 390, 'height': 900}, reduced_motion='reduce')
    page.goto(base + '/linear-algebra/#m4')
    lab = page.locator('[data-lab="linear-algebra/eigenvectors"] .lab')
    lab.scroll_into_view_if_needed()
    lab.locator('[data-k="preset"]').select_option(label='Shrinking')
    lab.locator('[data-act="again"]').click()
    lengths = "e => [...e.querySelectorAll('.pl-vec[data-part=cloud]')].map(g => {let b=g.getBBox(); return Math.hypot(b.width,b.height)})"
    before = lab.evaluate(lengths)
    assert len(before) == 12, 'The iteration must display 12 arrows'
    lab.locator('[data-act="again"]').click()
    after = lab.evaluate(lengths)
    assert sum(after) < 0.85 * sum(before), 'A contraction must visibly shorten the arrows'
    slider = lab.locator('[data-k="t"]')
    slider.evaluate("e => {e.value=0; e.dispatchEvent(new Event('input', {bubbles:true}))}")
    rewound = lab.evaluate(lengths)
    assert len(rewound) == 12, 'Scrubbing must retain the 12 iteration arrows'
    assert all(abs(a-b)<1e-9 for a,b in zip(before, rewound)), 'The scrub start must match the previous iteration'
    start = lab.locator('[data-stage]').inner_html()
    slider.evaluate("e => {e.value=1; e.dispatchEvent(new Event('input', {bubbles:true}))}")
    assert start != lab.locator('[data-stage]').inner_html(), 'The iteration must be scrubbable'
    replayed = lab.evaluate(lengths)
    assert len(replayed) == 12 and all(abs(a-b)<1e-9 for a,b in zip(after, replayed)), 'The scrub end must match the recorded iteration'
    next_page = lab.locator('[data-guide="1"]')
    while not next_page.is_disabled(): next_page.click()
    lab.locator('[data-guide="-1"]').click()
    eigenvalue = lab.locator('[data-val="l1"]').inner_text()
    assert 'i' not in eigenvalue and abs(float(eigenvalue)-2.5)<1e-9, 'Moving backwards must restore the guide example matrix'
    page.close()
    page = browser.new_page(viewport={'width': 390, 'height': 900})
    page.goto(base + '/linear-algebra/#m4')
    lab = page.locator('[data-lab="linear-algebra/eigenvectors"] .lab')
    lab.scroll_into_view_if_needed()
    lab.locator('[data-act="again"]').click()
    assert lab.get_attribute('data-anim') is not None, 'The interruption test needs an active animation'
    slider = lab.locator('[data-k="t"]')
    slider.evaluate("e => {e.value=0.25; e.dispatchEvent(new Event('input', {bubbles:true}))}")
    assert abs(float(slider.input_value())-0.25)<1e-9, 'Interrupting playback must retain the requested scrub position'
    assert lab.get_attribute('data-anim') is None and len(lab.evaluate(lengths))==12
    browser.close()
print('Shrinking iterations and scrubbing passed at phone width.')
