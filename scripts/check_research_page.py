#!/usr/bin/env python3
"""Exercise the built Research page using local Chrome and Playwright."""
from check_about_page import open_page, SITE
from pathlib import Path
import re
from playwright.sync_api import sync_playwright, expect


def check_cached_map(browser):
    # Cached HTML can request assets after their contents change on the server.
    # Use the historical rendered map with the current page's assets.
    current = (SITE / 'research/index.html').read_text()
    head = current.split('<head>', 1)[1].split('</head>', 1)[0]
    scripts = ''.join(re.findall(r'<script[^>]+src="[^"]+"[^>]*></script>', current))
    fixture = (Path(__file__).parent / 'fixtures/research-legacy-map.html').read_text()
    html = '<!doctype html><html><head>' + head + '</head><body><main><article class="modern-portfolio research-modern">' + fixture + '</article></main>' + scripts + '</body></html>'
    for width in [1280, 390]:
        for theme in ['light', 'dark']:
            context, page, errors = open_page(browser, width, theme)
            try:
                context.route('http://about.test/cached-research/', lambda route: route.fulfill(body=html, content_type='text/html'))
                page.goto('http://about.test/cached-research/', wait_until='load')
                region = page.locator('.rl-region').first
                fill = region.evaluate('node => getComputedStyle(node).fill')
                assert fill not in ['rgb(0, 0, 0)', 'black'], 'Cached map regions lost their fill styles.'
                assert page.locator('.rl-svg').evaluate('node => getComputedStyle(node).position') == 'absolute', 'Cached map geometry lost its positioning.'
                node = page.locator('.rl-work[data-id="encp-vln"]')
                assert node.evaluate('node => getComputedStyle(node).position') == 'absolute'
                node.focus()
                expect(page.locator('.rl-preview')).to_be_visible()
                expect(page.locator('.rl-preview-title')).to_contain_text('ENCP')
                assert page.locator('.rl-edge.is-active').count() > 0
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                assert not errors, errors
                page.screenshot(path=f'/tmp/research-cached-map-{width}-{theme}.png')
                print(f'PASS Cached map styles and keyboard preview, {width}px, {theme}.', flush=True)
            finally:
                context.close()


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel='chrome', headless=True)
        try:
            check_cached_map(browser)
            for width in [1280, 768, 390, 320]:
                for theme in ['light', 'dark']:
                    context, page, errors = open_page(browser, width, theme)
                    try:
                        page.goto('http://about.test/research/', wait_until='load')
                        assert page.locator('#research-landscape .rl-stage').count() == 1, 'The research direction and past-work diagram is missing.'
                        expect(page.locator('.rl-work')).to_have_count(11)
                        expect(page.locator('.rl-dir')).to_have_count(3)
                        encp = page.locator('.rl-work[data-id="encp-vln"]')
                        encp.focus()
                        expect(page.locator('.rl-preview')).to_be_visible()
                        expect(page.locator('.rl-dir[data-id="d-traj"]')).to_have_class(re.compile(r'is-active'))
                        direction = page.locator('.rl-dir[data-id="d-traj"]')
                        expect(direction).to_have_accessible_description(re.compile('exchangeable'))
                        direction.focus()
                        expect(page.locator('.rl-preview-desc')).not_to_contain_text('<a')
                        assert direction.get_attribute('href') == '/encp-vln/'
                        page.keyboard.press('Enter')
                        expect(page).to_have_url(re.compile(r'/encp-vln/$'))
                        page.go_back()
                        expect(page.locator('.rl-stage')).to_be_visible()
                        for topic in page.locator('.rl-topic').all():
                            assert topic.get_attribute('href'), 'A map term needs a linked explanation.'
                            topic.focus()
                            expect(page.locator('.rl-preview')).to_be_visible()
                            assert page.locator('.rl-preview-desc').inner_text().strip()
                        for edge in page.locator('.rl-edge').all():
                            for coordinate in ['x1', 'y1', 'x2', 'y2']:
                                float(edge.get_attribute(coordinate))
                        page.locator('[data-filter="geospatial"]').click()
                        expect(page.locator('#publications-container .project-card:visible')).to_have_count(3)
                        page.locator('[data-filter="all"]').click()
                        expect(page.locator('#publications-container .project-card:visible')).to_have_count(8)
                        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Horizontal overflow.'
                        for link in page.locator('.research-modern a[href^="/"]').all():
                            target = SITE / link.get_attribute('href').split('#')[0].lstrip('/')
                            assert target.exists(), f'Missing project link: {target}'
                        assert not errors, errors
                        page.locator('#research-landscape').scroll_into_view_if_needed()
                        page.screenshot(path=f'/tmp/research-design-{width}-{theme}.png', full_page=True)
                        print(f'PASS Research map, keyboard and archive, {width}px, {theme}.', flush=True)
                    finally:
                        context.close()
            context, page, _ = open_page(browser, 390, 'light', javascript=False)
            try:
                page.goto('http://about.test/research/', wait_until='load')
                assert page.locator('.rl-work:visible').count() == 11
                assert page.locator('.rl-dir:visible').count() == 3
                expect(page.locator('.rl-dir[data-id="d-traj"]')).to_have_accessible_description(re.compile('exchangeable'))
                expect(page.locator('#publications-container .project-card:visible')).to_have_count(8)
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                print('PASS Diagram links and archive readable without JavaScript.', flush=True)
            finally:
                context.close()
        finally:
            browser.close()


if __name__ == '__main__':
    main()
