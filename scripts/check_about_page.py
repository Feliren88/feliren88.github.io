#!/usr/bin/env python3
"""Check the About example with installed Chrome after `make build`.

Run with a Python environment containing Playwright. All requests are served
from _site through interception, so no HTTP server or internet access is needed.
"""
import mimetypes
import re
from pathlib import Path
from urllib.parse import unquote, urlparse

from playwright.sync_api import sync_playwright

SITE = Path(__file__).resolve().parent.parent / '_site'


def local_files(route):
    path = SITE / unquote(urlparse(route.request.url).path).lstrip('/')
    if path.is_dir():
        path /= 'index.html'
    if path.is_file():
        route.fulfill(body=path.read_bytes(), content_type=mimetypes.guess_type(str(path))[0] or 'application/octet-stream')
    else:
        route.fulfill(status=404, body='Missing local file')


def open_page(browser, width, theme, javascript=True):
    context = browser.new_context(viewport={'width': width, 'height': 900},
                                  java_script_enabled=javascript,
                                  reduced_motion='reduce', service_workers='block')
    context.route('http://about.test/**', local_files)
    context.route(re.compile(r'https://.*'), lambda route: route.abort())
    if javascript:
        context.add_init_script(f"localStorage.setItem('theme', '{theme}')")
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto('http://about.test/', wait_until='load')
    if javascript:
        page.add_style_tag(content='html{scroll-behavior:auto!important}')
    return context, page, errors


def selected_choice(page, choice):
    selected = page.locator('[data-about-choice][aria-pressed="true"]')
    assert selected.count() == 1, 'The example must select exactly one choice.'
    assert selected.get_attribute('data-about-choice') == choice
    visible = page.locator('[data-about-outcome]:visible')
    assert visible.count() == 1, 'The example must reveal exactly one outcome.'
    assert visible.get_attribute('data-about-outcome') == choice
    assert visible.inner_text().strip(), 'The selected outcome needs an explanation.'
    assert page.locator('[data-about-next]:visible').text_content().strip(), 'The diagram needs the next evidence.'


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel='chrome', headless=True)
        try:
            for width in [320, 390, 521, 768, 901, 1024, 1280]:
                for theme in ['dark', 'light']:
                    context, page, errors = open_page(browser, width, theme)
                    try:
                        assert page.locator('[data-about-decisions]').count() == 1, 'The navigation example is missing.'
                        selected_choice(page, 'act')
                        diagram = page.locator('[data-about-decisions] svg:visible')
                        sizes = diagram.locator('text').evaluate_all('nodes => nodes.map(node => parseFloat(getComputedStyle(node).fontSize) * node.getScreenCTM().a)')
                        assert min(sizes) >= 14, f'Diagram text is too small at {width}px: {sizes}'
                        labels = []
                        for choice in ['gather', 'help', 'act']:
                            button = page.locator(f'[data-about-choice="{choice}"]')
                            button.click()
                            selected_choice(page, choice)
                            labels.append(page.locator('[data-about-next]:visible').text_content())
                        assert len(set(labels)) == 3, 'Each choice must change the diagram’s next evidence.'
                        # Native buttons must activate with the keyboard as well as clicks.
                        gather = page.locator('[data-about-choice="gather"]')
                        gather.focus()
                        page.keyboard.press('Space')
                        selected_choice(page, 'gather')
                        help_button = page.locator('[data-about-choice="help"]')
                        help_button.focus()
                        page.keyboard.press('Enter')
                        selected_choice(page, 'help')
                        assert page.locator('[data-about-outcomes]').get_attribute('aria-live') == 'polite'
                        assert page.locator('.em-story').count() == 1, 'The existing record must still load.'
                        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'The page overflows horizontally.'
                        assert not errors, errors
                        page.locator('#research-interests').scroll_into_view_if_needed()
                        page.screenshot(path=f'/tmp/about-overview-{width}-{theme}.png')
                        print(f'PASS Interaction and keyboard, {width}px, {theme}.', flush=True)
                    finally:
                        context.close()
            context, page, _ = open_page(browser, 390, 'light', javascript=False)
            try:
                outcomes = page.locator('[data-about-outcome]:visible')
                assert outcomes.count() == 3, 'Without JavaScript, all explanations must remain readable.'
                assert page.locator('[data-about-choice]:visible').count() == 0, 'Inactive controls must stay hidden.'
                assert page.locator('[data-about-decisions] svg:visible').is_visible(), 'The diagram must remain visible without JavaScript.'
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                print('PASS Static explanation without JavaScript.', flush=True)
            finally:
                context.close()
        finally:
            browser.close()


if __name__ == '__main__':
    main()
