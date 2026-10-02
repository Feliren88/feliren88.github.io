#!/usr/bin/env python3
"""Browser checks for /metacognition/.

Build first with `make build`, then run
    /tmp/venv/bin/python3 scripts/check_metacognition_page.py [--site DIR] [-k check_name ...]
It serves _site/ (or DIR) on a free local port and drives the installed Chrome.
"""
import functools
import http.server
import re
import socketserver
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

SITE = Path(__file__).resolve().parent.parent / '_site'
CHECKS = []
BANNED = re.compile(r'\b(delve|foster|leverage|utili[sz]e|facilitate|empower|streamline|robust|cutting-edge|tapestry|realm|beacon|multifaceted|meticulous|intricate|paramount|transformative|elevate|embark|supercharge|harness)\w*', re.I)


def check(fn):
    CHECKS.append(fn)
    return fn


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def open_page(browser, base, path='/metacognition/', width=1200, theme=None, reduced=False):
    context = browser.new_context(viewport={'width': width, 'height': 900},
                                  reduced_motion='reduce' if reduced else 'no-preference')
    if theme:
        context.add_init_script("localStorage.setItem('theme', '%s')" % theme)
    context.set_default_timeout(5000)
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda err: errors.append(str(err)))
    page.goto(base + path, wait_until='load')
    return page, errors


def set_range(page, selector, value):
    page.eval_on_selector(selector, '(el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); }', value)


@check
def loads_with_scene(browser, base):
    page, errors = open_page(browser, base)
    assert page.locator('h1#mc-title').count() == 1, 'hero heading missing'
    page.wait_for_selector('.em-story', state='attached', timeout=5000)
    assert not errors, errors


@check
def rail_targets_exist(browser, base):
    page, _ = open_page(browser, base)
    hrefs = page.eval_on_selector_all('.mc-rail a', 'links => links.map(a => a.getAttribute("href"))')
    assert hrefs == ['#layers', '#illusion', '#calibrate', '#arbitrate', '#friction', '#offload', '#practice', '#sources'], hrefs
    for href in hrefs:
        assert page.locator(href).count() == 1, href


@check
def writings_card_and_nav(browser, base):
    page, _ = open_page(browser, base, '/writings/')
    assert page.locator('.writings-guides-grid a[href="/metacognition/"]').count() == 1, 'no card on /writings/'
    page, _ = open_page(browser, base)
    assert page.locator('a.is-active[href="/writings/"]').count() >= 1, 'Writings is not lit on the guide'
    assert '/metacognition/' in (SITE / 'llms.txt').read_text(), 'llms.txt has no entry'


@check
def phases_switch(browser, base):
    page, _ = open_page(browser, base)
    assert 'Plan' in page.inner_text('#mc-phase-read')
    page.click('.mc-phases [data-phase="during"]')
    assert 'Monitor' in page.inner_text('#mc-phase-read')
    assert page.get_attribute('.mc-phases [data-phase="during"]', 'aria-pressed') == 'true'
    assert page.get_attribute('.mc-phases [data-phase="before"]', 'aria-pressed') == 'false'


@check
def people_grid_counts(browser, base):
    page, _ = open_page(browser, base)
    rows = page.eval_on_selector_all('.mc-people-row', 'rows => rows.map(r => [r.querySelectorAll(".mc-dots i").length, r.querySelectorAll(".mc-dots i.is-miss").length])')
    assert rows == [[18, 15], [18, 2], [18, 2]], rows


@check
def fluency_check(browser, base):
    page, _ = open_page(browser, base)
    set_range(page, '#mc-feel', 80)
    assert page.inner_text('#mc-feel-out') == '80%'
    page.click('#mc-hide')
    assert page.is_visible('.mc-check-step[data-step="quiz"]'), 'quiz did not appear'
    assert page.is_hidden('.mc-check-step[data-step="read"]'), 'paragraph still visible'
    assert page.evaluate('!!document.activeElement.closest(".mc-options")'), 'focus did not move to the options'
    page.click('.mc-options button[data-correct="true"]')
    text = page.inner_text('#mc-check-read')
    assert text.startswith('Right.') and '80%' in text, text


@check
def calibration_round_trip(browser, base):
    page, _ = open_page(browser, base)
    assert page.is_disabled('#mc-cal-submit'), 'lock is enabled before an answer'
    for i in range(5):
        page.click('.mc-cal-answer [data-answer="true"]')
        set_range(page, '#mc-cal-conf', 90)
        page.click('#mc-cal-submit')
        assert page.inner_text('#mc-cal-feedback'), 'no feedback after locking in'
        if i < 4:
            page.click('#mc-cal-submit')
            assert page.evaluate('document.activeElement.matches(".mc-cal-answer button")'), 'focus lost after Next claim'
    summary = page.inner_text('#mc-cal-summary')
    assert 'Average confidence 90%. Correct 60%.' in summary and '30 points more confident' in summary, summary
    assert page.locator('#mc-cal-svg circle').count() == 5
    assert page.inner_text('#mc-cal-submit') == 'Start again'
    page.click('#mc-cal-submit')
    assert page.inner_text('#mc-cal-count') == 'Claim 1 of 5'
    assert page.locator('#mc-cal-svg circle').count() == 0, 'chart kept the old round'


@check
def arbitration_stats(browser, base):
    page, _ = open_page(browser, base)
    stats = lambda: [page.inner_text(s) for s in ('#mc-arb-wrong', '#mc-arb-checked', '#mc-arb-right')]
    assert page.locator('#mc-arb-grid .mc-cell').count() == 20
    assert stats() == ['1', '6', '13'], stats()
    page.click('.mc-toggle [data-ai="flat"]')
    assert stats() == ['6', '0', '14'], stats()
    set_range(page, '#mc-arb-th', 100)
    assert stats() == ['0', '20', '0'], stats()
    assert 'check every answer' in page.inner_text('#mc-arb-read')


@check
def prompt_toggle(browser, base):
    page, _ = open_page(browser, base)
    first = page.locator('.mc-prompts button').first
    assert first.get_attribute('aria-pressed') == 'false'
    first.click()
    assert first.get_attribute('aria-pressed') == 'true'


@check
def offload_reply(browser, base):
    page, _ = open_page(browser, base)
    assert page.locator('#mc-sort .mc-task').count() == 6
    page.click('#mc-sort .mc-task:first-child [data-pick="keep"]')
    assert page.inner_text('#mc-sort .mc-task:first-child output').startswith('I would hand it over.')


@check
def light_theme_tokens(browser, base):
    dark, _ = open_page(browser, base)
    light, _ = open_page(browser, base, theme='light')
    accent = 'getComputedStyle(document.documentElement).getPropertyValue("--em-accent").trim()'
    assert dark.evaluate(accent) == '#c48ee0', dark.evaluate(accent)
    assert light.evaluate(accent) == '#6b278e', light.evaluate(accent)
    token = 'getComputedStyle(document.querySelector(".mc-hero")).getPropertyValue("--mc-orchid").trim()'
    assert dark.evaluate(token) != light.evaluate(token), 'page tokens ignore the theme'


@check
def narrow_viewport_fits(browser, base):
    page, _ = open_page(browser, base, width=400)
    assert page.locator('.mc-hero').count() == 1, 'the guide did not load'
    overflow = page.evaluate('document.documentElement.scrollWidth - window.innerWidth')
    assert overflow <= 1, 'page is %spx wider than the viewport' % overflow


@check
def reduced_motion_pauses_hero(browser, base):
    page, _ = open_page(browser, base, reduced=True)
    assert page.evaluate('document.querySelector(".mc-loop svg").animationsPaused()'), 'hero SMIL still runs'


@check
def prose_rules(browser, base):
    page, _ = open_page(browser, base)
    text = page.evaluate('[...document.querySelectorAll(".mc-hero p, .mc-part p, .mc-part li, .mc-part h2, .mc-part h3")]'
                         '.filter(n => !n.closest(".mc-sources")).map(n => n.innerText).join("\\n")')
    assert '—' not in text, 'em dash in the page copy'
    banned = BANNED.search(text)
    assert not banned, banned.group(0)
    sentences = [s for s in re.split(r'(?<=[.?!])\s+|\n', text) if len(s.split()) > 2]
    assert sentences, 'no page copy found'
    average = sum(len(s.split()) for s in sentences) / len(sentences)
    assert average <= 16, 'average sentence is %.1f words' % average
    long = [s for s in sentences if len(s.split()) > 24]
    assert not long, long


def main(argv):
    only = set(argv[argv.index('-k') + 1:]) if '-k' in argv else None
    global SITE
    if '--site' in argv:
        SITE = Path(argv[argv.index('--site') + 1]).resolve()
    handler = functools.partial(Quiet, directory=str(SITE))
    httpd = socketserver.TCPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base = 'http://127.0.0.1:%d' % httpd.server_address[1]
    failures = 0
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chrome')
        for fn in CHECKS:
            if only and fn.__name__ not in only:
                continue
            try:
                fn(browser, base)
                print('PASS', fn.__name__)
            except Exception as err:  # every failure is reported, then counted
                failures += 1
                print('FAIL', fn.__name__, '-', (str(err).splitlines() or [repr(err)])[0][:300])
        browser.close()
    httpd.shutdown()
    print('%d failed' % failures)
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
