#!/usr/bin/env python3
"""Check that every built page can be indexed, and that nothing leaks into the index.

Run `bundle exec jekyll build` first, then:

    python3 scripts/audit_seo.py

Exits non-zero on any flag, so it works as a pre-push gate. It reads only `_site/`,
which means it checks what actually ships rather than what the source appears to say.

The checks exist because each one caught a real bug:

  NOT-IN-SITEMAP      a live page Google has no direct pointer to
  NO-INBOUND-LINK     an orphan; a sitemap entry alone is a weak crawl signal
  NOINDEX-IN-SITEMAP  the contradiction that produces "indexed, though blocked"
  NO-CANONICAL        duplicate-URL risk once a page is reachable two ways
  NO-DESC             Google writes its own snippet, usually badly
  NO-OG-IMAGE         also silently downgrades the Twitter card to `summary`
  BAD-JSONLD          one malformed block discards the whole page's structured data
"""

import glob
import json
import os
import re
import sys

SITE = "_site"

# Search-console ownership tokens. Real files at fixed paths, but not pages: they
# are expected to have no metadata and are expected to stay out of the sitemap.
VERIFICATION = {
    "/google41769159a82c477f.html",
    "/yandex_3f8f613ab592ef84.html",
}


def url_for(path):
    rel = os.path.relpath(path, SITE).replace("index.html", "")
    return ("/" + rel).replace("//", "/")


def main():
    if not os.path.isdir(SITE):
        sys.exit(f"{SITE}/ not found. Run `bundle exec jekyll build` first.")

    sitemap_path = os.path.join(SITE, "sitemap.xml")
    sitemap = {
        u.replace("https://vickyfeliren.com", "")
        for u in re.findall(r"<loc>([^<]+)</loc>", open(sitemap_path, encoding="utf-8").read())
    }

    pages = sorted(glob.glob(f"{SITE}/**/*.html", recursive=True))

    # Every internal href anywhere in the site, used to spot orphans.
    linked = set()
    for f in pages:
        body = open(f, encoding="utf-8", errors="ignore").read()
        linked.update(re.findall(r'href="(/[^"#?]*)"', body))

    flagged = live = redirects = 0

    for f in pages:
        url = url_for(f)
        html = open(f, encoding="utf-8", errors="ignore").read()

        # jekyll-redirect-from stubs are meant to be noindex and unlisted.
        if 'http-equiv="refresh"' in html:
            redirects += 1
            problems = []
            if "noindex" not in html:
                problems.append("REDIRECT-NOT-NOINDEX")
            if url in sitemap:
                problems.append("REDIRECT-IN-SITEMAP")
            if problems:
                flagged += 1
                print(f"  {url:48s} {' '.join(problems)}")
            continue

        if url == "/404.html":
            continue

        problems = []

        if url in VERIFICATION:
            if url in sitemap:
                problems.append("STILL-IN-SITEMAP")
        else:
            live += 1
            noindex = re.search(r'<meta name="robots" content="[^"]*noindex', html)
            if noindex:
                if url in sitemap:
                    problems.append("NOINDEX-IN-SITEMAP")
            else:
                if url not in sitemap:
                    problems.append("NOT-IN-SITEMAP")
                if url != "/" and url not in linked:
                    problems.append("NO-INBOUND-LINK")
            if not re.search(r'<link rel="canonical"', html):
                problems.append("NO-CANONICAL")
            if not re.search(r'<meta name="description"', html):
                problems.append("NO-DESC")
            if "og:image" not in html:
                problems.append("NO-OG-IMAGE")
            if not re.search(r"<title>\s*[^<\s]", html):
                problems.append("NO-TITLE")

        for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
            try:
                json.loads(block)
            except ValueError:
                problems.append("BAD-JSONLD")
                break

        if problems:
            flagged += 1
            print(f"  {url:48s} {' '.join(problems)}")

    print(f"\nsitemap URLs        : {len(sitemap)}")
    print(f"live indexable pages: {live}")
    print(f"redirect stubs      : {redirects}")
    print(f"pages with any flag : {flagged}")

    return 1 if flagged else 0


if __name__ == "__main__":
    sys.exit(main())
