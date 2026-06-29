# Vicky Feliren - Personal Website

Personal portfolio website for Vicky Feliren - Applied Scientist working on **AI safety** for trustworthy, multimodal, and multilingual systems: getting models to surface what they know and hold back when they should, reliably, for the languages and contexts they were never trained on. Built with Jekyll static site generator.

## Changelog

### June 2026 — AI-safety-forward profile (latest)
- **Identity → AI safety.** Hero eyebrow + `lead1`, About hero, Person schema (`description` / `disambiguatingDescription` / occupation), `_config.yml` description, and `llms.txt` now lead with AI safety (trustworthy, multimodal, multilingual).
- **Use Cases hierarchy.** Added a leading `AI Safety & Reliability` category (sorts first via the `PRIORITY` map in `usecases.md`); re-tagged the multilingual VLM conflict study and the VLN conformal-prediction thesis into it. Geospatial label → "Multimodal AI · Earth Observation".
- **Bridge essay** (`_pages/essays/knowing-when-you-dont-know.md`): "Knowing when you don't know is the core safety property" — featured atop `/writings/` and leading the homepage Insights.
- **Homepage Insights** now leads with the essay and the safety research notes; **contact engagements** retuned toward AI-safety research collaboration (Research Collaboration first).

### June 2026 — research-agenda repositioning
- **Research-agenda repositioning.** Shifted the site narrative from "what I did" to "what I think matters and why." Remote sensing / earth observation reframed from an identity label to a proof point.
- Homepage "Research Focus" → **"Research Agenda"** (`_data/about.yml`): three open problems with the *why*, stated without metrics
- Added a **Research Notes** stream (`_data/notes.yml`) of short paper distillations at the top of `/writings/`; `/writings/` now defaults to the **Research** filter; `_data/thoughts.yml` reordered so the homepage Insights strip leads with research/judgment pieces
- Added a reusable **Research Note** block to `usecase.html` (`why_this` / `surprise` / `next` fields), authored for the multilingual VLM cross-modal-conflict study
- Reframed identity surfaces: hero eyebrow (`index.yml`), Person schema `knowsAbout`/`skills` (`default.html`), `_config.yml` keywords, `_data/skills.yml` categories, `llms.txt`, and the research filter label (Geospatial → Earth Observation). Journal credentials (IEEE, ACL, Remote Sensing of Environment) retained as evidence.

### May 2026
- Confirmed canonical SEO setup: `url: "https://vickyfeliren.com"` in `_config.yml` + `jekyll-seo-tag` generates correct `<link rel="canonical">` on every page; `robots.txt` sitemap points to `vickyfeliren.com`
- Updated `llms.txt`: added "Quality and Reliability for AI Engineers" article (was missing from Writings section)
- Updated `README.md` and `CLAUDE.md` project structure: added `usecase.html` layout, `_pages/usecases/` directory, `_data/usecases.yml`, `_data/timeline.yml`, `js/components/timeline.js`, `llms.txt`, `robots.txt`

### May 2026
- Added "Quality and Reliability for AI Engineers" article to `_data/thoughts.yml`
- Fixed heading hierarchy: section headings `h3 → h2`, card titles `h4 → h3` (Accessibility 98 → 100)
- Fixed `ServiceWorker` null `Accept` header crash in `sw.js` fetch handler
- Added **Insights** section to homepage: 3-card grid of latest Medium writings with "View all →" link
- Added **Let's Collaborate** section to homepage: eyebrow, heading, engagement type tags, CTA driven by `contact.yml`
- Added **footer banner**: two-column layout (brand + description + social icons left / nav links right) with copyright bottom bar; replaces the former one-liner footer
- Refactored Insights and Let's Collaborate sections to use `border-top` divider pattern consistent with about-sections (removed glass card wrappers)
- Redesigned footer to brand-left / nav-right two-column layout; added brand description line
- `styles.css` bumped to `v=26`

## Lighthouse Scores (May 2026)

Tested on homepage (vickyfeliren.com) · Emulated Moto G Power · Slow 4G · Lighthouse 13.0.2

| Category | Score |
|---|---|
| Performance | 85 |
| Accessibility | 98 → **100** (h3 heading fix) |
| Best Practices | 96 |
| SEO | 100 |

### Performance notes

- **FCP 2.5 s / LCP 2.7 s / TBT 350 ms** — measured on slow 4G emulation with Chrome extensions active; Lighthouse flagged extension interference (Zotero, AdBlock, etc.) as a significant contributor to TBT and JS execution time
- **main.js CPU time 2.6 s** — dominated by the point cloud animation loop; already deferred via `requestIdleCallback` with 1.5 s timeout
- **Render-blocking CSS 180 ms** — styles.css (5.8 KiB) is render-blocking; inlining critical CSS is the path to improvement but not yet applied
- **Cache TTL 10 min** — GitHub Pages sets this; not configurable from Jekyll; versioned query strings (`?v=N`) ensure fresh assets on each deploy

### Accessibility notes

- h3 elements were used as section headings directly under h1 (no h2 in between); fixed by promoting section headings to h2 and card titles to h3

### Best Practices notes

- `ServiceWorker script evaluation failed` console error — likely caused by browser extensions intercepting the sw.js fetch; fixed defensively by guarding `Accept` header null check in the fetch handler
- CSP, HSTS, COOP, X-Frame-Options headers are unscored audit items; GitHub Pages does not support custom HTTP response headers — these require a CDN (Cloudflare) or proxy layer to apply

## Project Structure

```
feliren88.github.io/
├── README.md       # Project documentation
├── CLAUDE.md       # Development guidelines
├── llms.txt        # LLM-readable site summary (pages, use cases, research, writings)
├── robots.txt      # Crawler directives + sitemap pointer
├── _config.yml     # Jekyll configuration
├── Gemfile         # Ruby dependencies
├── index.html      # Homepage — hero, about, Insights, Let's Collaborate sections
├── sw.js           # Service worker (Jekyll-processed Liquid template)
├── _layouts/
│   ├── default.html   # Base layout with SEO, skip link, font preloads
│   ├── page.html      # Generic page template (extends default)
│   └── usecase.html   # Use case detail template (extends default); optional why_this/surprise/next fields render a "Research Note" block
├── _pages/         # Jekyll pages (Markdown)
│   ├── about.md
│   ├── skills.md
│   ├── experience.md
│   ├── publications.md
│   ├── awards.md
│   ├── thoughts.md
│   ├── contact.md
│   ├── usecases.md    # Use cases listing page
│   ├── usecases/      # Individual use case detail pages (20 files)
│   └── essays/        # Long-form essays (e.g. knowing-when-you-dont-know.md)
├── _data/          # YAML data files
│   ├── index.yml
│   ├── about.yml
│   ├── skills.yml
│   ├── experience.yml
│   ├── publications.yml
│   ├── awards.yml
│   ├── thoughts.yml   # Medium articles — ordered to drive the homepage Insights strip
│   ├── notes.yml      # Research notes — short paper distillations with own take
│   ├── features.yml   # Press features / media coverage
│   ├── contact.yml
│   ├── usecases.yml   # All use case content
│   └── timeline.yml   # Project timeline entries
├── assets/
│   ├── fonts/      # Manrope + Space Grotesk — latin/latin-ext subsets only
│   └── img/        # All WebP — profile.webp, profile-450.webp, profile_2_bg.webp, profile_3_bg.webp, favicons, icons
├── css/
│   └── styles.css
└── js/
    ├── main.js          # Core JavaScript (point cloud, filters, tilt, reveal)
    └── components/
        ├── nav.js       # Navigation — single source of truth (NAV_ITEMS array)
        └── timeline.js  # Project timeline (loaded only on /project/ page)
```

## Technology Stack

- **Jekyll**: Static site generator with Liquid templating
- **HTML5**: Semantic markup with accessibility
- **CSS3**: Custom properties, Grid/Flexbox, responsive design
- **JavaScript (ES6+)**: Vanilla JS, no frameworks
- **jekyll-seo-tag**: Automatic meta tags
- **jekyll-sitemap**: Auto-generated sitemap

## Performance

- All-WebP image assets — no PNG/JPG/SVG originals retained
- Hero uses `<picture>` with `profile-450.webp 450w` / `profile.webp 880w` srcset
- `fetchpriority="high"` on above-fold images; page-specific `<link rel="preload">` via `preload_image:` front matter
- `loading="lazy"` on all off-screen images
- `<link rel="preload">` for critical font files; `@font-face` limited to latin and latin-ext subsets
- Service worker (`sw.js`) for offline access — cache-first for assets, network-first for HTML
- Point cloud animation deferred via `requestIdleCallback` (1.5 s timeout)

## Accessibility

Targets **WCAG 2.1 AA** compliance:

- Skip-to-content link as first focusable element
- `:focus-visible` keyboard focus indicator on all interactive elements
- Interactive element borders use `--border-ui` (≥ 3:1 contrast ratio)
- `--text` / `--muted` / `--accent` all meet contrast requirements against dark background
- `aria-live="polite"` on dynamic status regions
- Decorative images marked `aria-hidden="true"`
- Heading hierarchy: h1 (name) → h2 (section) → h3 (subsection/card/timeline item)

## Structured Data (JSON-LD)

Person schema in `_layouts/default.html` covers:

| Property | Value |
|----------|-------|
| `@type` | Person |
| `@id` | `https://vickyfeliren.com/` |
| `jobTitle`, `alumniOf`, `worksFor` | Applied Scientist, Monash University |
| `knowsAbout` | 8 AI/ML domains (Trustworthy AI, Multimodal AI, AI Safety, Interpretability, Multilingual AI … Earth Observation last) |
| `knowsLanguage` | English, Indonesian |
| `award` | 10 awards (2015–2024) |
| `memberOf` | SEACrowd, ACL, IEEE |
| `colleague` | Risqi Saputra, Taufiq Asyhari |
| `author` | ScholarlyArticle entries auto-generated from `_data/publications.yml` |
| `sameAs` | 12 academic/social profiles |

## Navigation

All navigation is defined in `js/components/nav.js` via the `NAV_ITEMS` array — modification here updates all pages automatically.

## Content Management

Content is managed through YAML data files in `_data/`. Each page corresponds to a data file:

- `_data/about.yml` — About page content
- `_data/skills.yml` — Expertise skills
- `_data/experience.yml` — Work experience, education, patents, teaching
- `_data/publications.yml` — Research publications
- `_data/awards.yml` — Awards and service
- `_data/thoughts.yml` — Medium writings; ordered so the first three drive the homepage Insights strip
- `_data/notes.yml` — Research notes (short paper distillations with own take); rendered atop `/writings/`
- `_data/features.yml` — Press features / media coverage
- `_data/contact.yml` — Contact information
- `_data/usecases.yml` — All use case content, keyed by `id`; consumed by `usecase.html` layout
- `_data/timeline.yml` — Project timeline entries; loaded by `timeline.js` on `/project/`

## Local Development

```bash
bundle install
bundle exec jekyll serve --livereload
```

Site available at `http://localhost:4000`

## Building

```bash
bundle exec jekyll build
```

Output goes to `_site/` directory.

## Deploying

```bash
git add -A
git commit -m "description"
git push origin main
```

GitHub Actions handles Jekyll build automatically.

## Contact

- Email: vickyfeliren@gmail.com
- LinkedIn: @feliren
- GitHub: @feliren88
- Medium: @feliren
