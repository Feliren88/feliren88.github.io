#!/usr/bin/env python3
"""Exercise the built Research page using local Chrome and Playwright."""
from check_about_page import open_page
from playwright.sync_api import sync_playwright, expect


def selected_project(page, key, question):
    buttons = page.locator('[data-research-choice][aria-pressed="true"]')
    assert buttons.count() == 1
    assert buttons.get_attribute('data-research-choice') == key
    panels = page.locator('[data-research-connection]:visible')
    assert panels.count() == 1
    assert panels.get_attribute('data-research-connection') == key
    assert panels.locator('[data-next-question]').get_attribute('href') == question
    assert panels.locator('[data-contribution]').inner_text().strip()
    assert panels.locator('[data-connection-reason]').inner_text().strip()
    assert page.locator('.rd-card.is-connected').count() == 1
    assert page.locator('.rd-card.is-connected').get_attribute('id') == question[1:]


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel='chrome', headless=True)
        try:
            for width in [1280, 768, 390, 320]:
                for theme in ['light', 'dark']:
                    context, page, errors = open_page(browser, width, theme)
                    try:
                        page.goto('http://about.test/research/', wait_until='load')
                        assert page.locator('[data-research-choice]').count() == 3, 'The connection explorer is missing.'
                        selected_project(page, 'encp-vln', '#d-traj')
                        for key, question in [('sea-vl', '#d-shift'), ('flood-procanet', '#d-shift')]:
                            page.locator(f'[data-research-trace="{key}"]').click()
                            selected_project(page, key, question)
                        for key, question in [('sea-vl', '#d-shift'), ('flood-procanet', '#d-shift'), ('encp-vln', '#d-traj')]:
                            page.locator(f'[data-research-choice="{key}"]').click()
                            selected_project(page, key, question)
                        button = page.locator('[data-research-choice="sea-vl"]')
                        button.focus()
                        page.keyboard.press('Space')
                        selected_project(page, 'sea-vl', '#d-shift')
                        button = page.locator('[data-research-choice="flood-procanet"]')
                        button.focus()
                        page.keyboard.press('Enter')
                        selected_project(page, 'flood-procanet', '#d-shift')
                        page.locator('[data-next-question]:visible').click()
                        assert page.url.endswith('#d-shift')
                        assert page.locator('#d-shift').is_visible()
                        assert page.locator('[data-research-results]').get_attribute('aria-live') == 'polite'
                        page.locator('[data-filter="geospatial"]').click()
                        expect(page.locator('#publications-container .project-card:visible')).to_have_count(3)
                        page.locator('[data-filter="all"]').click()
                        expect(page.locator('#publications-container .project-card:visible')).to_have_count(8)
                        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Horizontal overflow.'
                        for link in page.locator('.research-modern a[href^="/"]').all():
                            from check_about_page import SITE
                            target = SITE / link.get_attribute('href').split('#')[0].lstrip('/')
                            assert target.exists(), f'Missing project link: {target}'
                        assert not errors, errors
                        page.locator('#research-landscape').scroll_into_view_if_needed()
                        page.screenshot(path=f'/tmp/research-design-{width}-{theme}.png', full_page=True)
                        print(f'PASS Research selections, keyboard and archive, {width}px, {theme}.', flush=True)
                    finally:
                        context.close()
            context, page, _ = open_page(browser, 390, 'light', javascript=False)
            try:
                page.goto('http://about.test/research/', wait_until='load')
                assert page.locator('[data-research-connection]:visible').count() == 3
                assert page.locator('[data-research-choice]:visible').count() == 0
                assert page.locator('[data-next-question]:visible').count() == 3
                expect(page.locator('#publications-container .project-card:visible')).to_have_count(8)
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                print('PASS All connections and archive readable without JavaScript.', flush=True)
            finally:
                context.close()
        finally:
            browser.close()


if __name__ == '__main__':
    main()
