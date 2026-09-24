# SEO, structured data and crawling


## SEO
Uses `jekyll-seo-tag` for meta tags via `{% seo %}`. Four of its behaviours are not
obvious and each one caused a real gap on this site:

- **`site.image` is ignored.** The plugin reads `og:image` from `page.image` only. A
  `defaults` entry in `_config.yml` supplies it site-wide; page front matter overrides
  it, which is how each use case gets its own banner. Without a resolved image the card
  also degrades from `summary_large_image` to plain `summary`.
- **`page.date` is the switch for article markup.** Setting it emits `og:type=article`,
  `article:published_time`, *and* a full `BlogPosting` JSON-LD block. That is why the
  twelve writings carry `date` and `last_modified_at`, and why nothing else does. Do not
  hand-write a second `BlogPosting`; it will duplicate the one the plugin already emits.
- **A `robots:` front matter key does nothing on its own.** `_includes/site-head.html` emits it
  explicitly. An absent robots meta means indexable, which is what every page but
  `/project/` wants.
- **`sitemap: false` also emits noindex.** Use it to withhold a page. `_config.yml` uses
  it via `defaults` to keep the two search-console ownership tokens out of the sitemap,
  which works because Jekyll's StaticFile does read front matter defaults.

Never pair a `robots.txt` `Disallow` with a `noindex` meta on the same URL. The disallow
stops Google fetching the page, so it never reads the noindex, and the URL can stay in
the index with no description. Let it be crawled and serve the noindex.


## Structured Data (JSON-LD)

Everything hand-written is under `_includes/seo/`, pulled in by one call to
`seo/structured-data.html` from `_includes/site-head.html`. Every block is
driven by a data file, so in almost every case the include is not what you edit:

| Include | Emits | Edit instead |
|---|---|---|
| `seo/person.html` | `Person` | `_data/identity.yml` |
| `seo/site-entities.html` | `WebSite`, `ContactPoint`, `ProfilePage`, employer | `_data/identity.yml`; the `WebSite` description is `description` in `_config.yml` |
| `seo/publications.html` | one `ScholarlyArticle` per paper | `_data/publications.yml` |
| `seo/media-and-events.html` | one `Article` per press item, one `Event` per talk | `_data/media.yml`, `_data/events.yml` |
| `seo/structured-data.html` | `BreadcrumbList` on dated pages | — |

The homepage carries a second `WebSite` block, emitted by `jekyll-seo-tag` from the
homepage's own front matter `description` in `_pages/about.md`. That one is the
homepage's search snippet, so it is edited there and may word things differently.

Everything points at the author by `@id` (`#person`) rather than repeating them.
The ids are shared across files, so `#person`, `#website`, `#image`, `#contact`
and `#profilepage` have to agree between `person.html` and `site-entities.html`.

**1. Person schema** — `_includes/seo/person.html`, built from `_data/identity.yml`; appears on every page. Edit the data file, not the include. Properties:
- Identity: `name`, `alternateName`, `gender`, `description` (includes he/him), `disambiguatingDescription`, `image`
- Role: `jobTitle`, `alumniOf`, `worksFor` (both Monash University)
- Knowledge: `knowsAbout` (8 domains, led by Trustworthy AI / Multimodal AI / AI Safety / Interpretability / Multilingual AI; Earth Observation last), `knowsLanguage` (English, Indonesian)
- Recognition: `award` (11 entries), `memberOf` (SEACrowd, ACL, IEEE)
- Network: `colleague` (Risqi Saputra, Taufiq Asyhari), `sameAs` (12 profiles)
- Works: `author` array — **auto-generated from `_data/publications.yml`** via Liquid

**2. CollectionPage + ScholarlyArticle schema** — in `_pages/publications.md` (research page only). Also auto-generated from `_data/publications.yml`.

When adding new publications, **only update `_data/publications.yml`** — both JSON-LD blocks update automatically. Required fields: `key`, `kind`, `tag`, `title`, `description`, `venue`, `year` (string), `url`, `abstract`, `keywords` (array), `authors` (array). Optional: `publisher`, `doi`, `date` (ISO, from the bibtex/Crossref record — used as `datePublished`, falls back to `year`), `pages`, `volume`, `issue`, `issn`, `isbn`, `project_page` (a site path such as `/encp-vln/`; `/research/` then links to it from the paper's card and archive row).

Valid `kind` values: `geospatial`, `cultural`, `nlp`, `applied`.

**3. BreadcrumbList** — in `_includes/seo/structured-data.html`, emitted for any page with a `date`,
which in practice is the twelve writings. Home → Writings → this page.

**4. BlogPosting** — emitted by `jekyll-seo-tag` itself, also keyed on `page.date`. It is
not in `_includes/seo/` and must not be added there; a second one would duplicate it.

**5. Article and Event** — one block per entry in `_data/media.yml` (press coverage
of the author) and `_data/events.yml` (talks and panels). Separate blocks rather
than nested arrays, so each is its own entity in rich results. An event is either
`online: true` with a `url`, giving it a `VirtualLocation`, or has a `place:`,
giving it a `Place`. `start_date` carries whatever precision is actually known —
a year, a year-month, or a full ISO date — and should not be padded out to look
more precise than it is.

## Sitemap
Auto-generated by `jekyll-sitemap` into `/sitemap.xml`. It lists every `.html` static
file, not only pages, so anything dropped into the repo root shows up as if it were a
page. Withhold one with a scoped `sitemap: false` in `_config.yml` `defaults`.

After changing anything in this section, re-run the audit in `CONTRIBUTING.md` and
confirm it still reports zero flags.

## Permalinks
Clean URLs without `.html`:
- `/about/` instead of `/pages/about.html`
- `/research/` instead of `/pages/publications.html`

