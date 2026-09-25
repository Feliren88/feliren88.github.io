"""Tests for audit_seo.py. Run: python3 -m unittest discover scripts"""

import contextlib
import io
import os
import tempfile
import unittest

import audit_seo

HEAD = (
    '<title>{t}</title><link rel="canonical" href="https://vickyfeliren.com{u}">'
    '<meta name="description" content="d"><meta property="og:image" content="i">'
)


class OrphanCheck(unittest.TestCase):
    def audit(self, pages):
        """Build a fake _site from {url: body}, run the audit, return (exit, output)."""
        with tempfile.TemporaryDirectory() as site:
            for url, body in pages.items():
                path = os.path.join(site, url.strip("/"), "index.html")
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, "w", encoding="utf-8") as f:
                    f.write(HEAD.format(t=url, u=url) + body)
            locs = "".join(f"<loc>https://vickyfeliren.com{u}</loc>" for u in pages)
            with open(os.path.join(site, "sitemap.xml"), "w", encoding="utf-8") as f:
                f.write(locs)

            out = io.StringIO()
            old, audit_seo.SITE = audit_seo.SITE, site
            try:
                with contextlib.redirect_stdout(out):
                    code = audit_seo.main()
            finally:
                audit_seo.SITE = old
            return code, out.getvalue()

    def test_page_linked_from_another_page_passes(self):
        code, out = self.audit({"/": '<a href="/notes/">n</a>', "/notes/": ""})
        self.assertEqual(code, 0, out)

    def test_page_linked_only_from_itself_is_an_orphan(self):
        code, out = self.audit({"/": "", "/notes/": '<a href="/notes/">top</a>'})
        self.assertEqual(code, 1, out)
        self.assertRegex(out, r"/notes/\s+NO-INBOUND-LINK")


if __name__ == "__main__":
    unittest.main()
