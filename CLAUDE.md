# CLAUDE.md - Project Guidelines

## Project Overview

Personal portfolio website for Vicky Feliren - Applied Scientist working on **AI safety** for trustworthy, multimodal, and multilingual systems: getting models to surface what they know and hold back when they should, reliably, for the languages and contexts they were never trained on. Earth observation (remote sensing) is framed as a proof point, not an identity. Built with Jekyll static site generator.

**Narrative spine (apply to all copy):** identity = **AI safety** for trustworthy · multimodal · multilingual systems. Remote sensing / geospatial / production ML are *evidence* the agenda survives messy data, never top-level identity labels. Landing and agenda surfaces lead with *why a problem matters* (taste), not metrics; numbers live on evidence/detail pages. The hero, Person schema, contact engagements, and the Use Cases hierarchy (an `AI Safety & Reliability` category sorts first) all lead with safety. Long-form essays live in `_pages/essays/` (e.g. the bridge essay `knowing-when-you-dont-know`), featured atop `/writings/` and on the homepage.

## Architecture

```
feliren88.github.io/
├── README.md       # Project documentation
├── CLAUDE.md       # This file
├── llms.txt        # LLM-readable site summary (pages, use cases, research, writings)
├── robots.txt      # Crawler directives + sitemap pointer (Sitemap: https://vickyfeliren.com/sitemap.xml)
├── _config.yml     # Jekyll configuration
├── Gemfile         # Ruby dependencies
├── index.html      # Homepage (Jekyll template)
├── sw.js           # Service worker (Jekyll-processed Liquid template)
├── _layouts/
│   ├── default.html   # Base layout with SEO, skip link, font preloads
│   ├── page.html      # Generic page template (extends default)
│   └── usecase.html   # Use case detail template (extends default); reads from _data/usecases.yml via uc_id front matter; auto-generates sticky TOC from .uc-section-label elements (≥3 sections). Optional reflective fields why_this / surprise / next render a "Research Note" block (taste framing: why I chose this, what surprised me, what I'd do next)
├── _pages/         # Jekyll pages (Markdown)
│   ├── about.md
│   ├── skills.md
│   ├── experience.md
│   ├── publications.md   # Research page — includes filter bar (Earth Observation/Cultural AI/Language/Applied)
│   ├── awards.md
│   ├── thoughts.md       # Writings page — uses unified .filter-pill filter bar
│   ├── contact.md
│   ├── usecases.md       # Use cases listing page — uses unified .filter-pill filter bar
│   ├── usecases/         # Individual use case detail pages (20 files) — each sets layout: usecase and uc_id
│   └── essays/           # Long-form essays (layout: page) — e.g. knowing-when-you-dont-know.md; featured atop /writings/ and homepage
├── _data/          # YAML data files
│   ├── index.yml
│   ├── about.yml         # tech_stack is now tiered: primary / framework / tool
│   ├── skills.yml
│   ├── experience.yml
│   ├── publications.yml  # Each entry requires a `kind` field for filter routing
│   ├── awards.yml
│   ├── features.yml      # Press features / media coverage — rendered at top of /writings/ above Medium articles
│   ├── notes.yml         # Research notes — short paper distillations with own take; rendered at top of /writings/ (newest first)
│   ├── thoughts.yml      # Medium articles — ORDERED for homepage "Insights" strip (first 3 surface there); /writings/ defaults to the All filter
│   ├── contact.yml
│   ├── usecases.yml      # All use case content (88 KB) — keyed by id, consumed by usecase.html
│   └── timeline.yml      # Project timeline entries (loaded by timeline.js on /project/)
├── assets/
│   ├── fonts/      # Manrope + Space Grotesk — latin and latin-ext subsets only
│   └── img/
│       ├── profile.webp          # Full-size WebP (109KB) — hero + OG image
│       ├── profile-450.webp      # 450px WebP (34KB) — served to most devices
│       ├── profile_2_bg.webp     # About page background (82KB, white-on-transparent silhouette)
│       ├── profile_3_bg.webp     # Contact page background (220KB, white-on-transparent silhouette)
│       ├── favicon.webp / favicon_black.webp
│       └── github-color-svgrepo-com.webp / gmail-svgrepo-com.webp / google-scholar-svgrepo-com.webp / linkedin-svgrepo-com.webp / medium-svgrepo-com.webp
├── css/
│   └── styles.css  # @font-face, custom properties, all component styles (current: v28)
└── js/
    ├── main.js          # Core JavaScript (point cloud, filters, tilt, reveal, reveal-group stagger)
    └── components/
        ├── nav.js       # Navigation — single source of truth (NAV_ITEMS array)
        └── timeline.js  # Project timeline (loaded only on /project/ page)
```

## Jekyll Configuration

### SEO
Uses `jekyll-seo-tag` plugin for automatic meta tags via `{% seo %}`. Configure in `_config.yml`.

### Structured Data (JSON-LD)
Two JSON-LD blocks exist:

**1. Person schema** — in `_layouts/default.html` (appears on every page). Properties:
- Identity: `name`, `alternateName`, `gender`, `description` (includes he/him), `disambiguatingDescription`, `image`
- Role: `jobTitle`, `alumniOf`, `worksFor` (both Monash University)
- Knowledge: `knowsAbout` (8 domains, led by Trustworthy AI / Multimodal AI / AI Safety / Interpretability / Multilingual AI; Earth Observation last), `knowsLanguage` (English, Indonesian)
- Recognition: `award` (10 entries), `memberOf` (SEACrowd, ACL, IEEE)
- Network: `colleague` (Risqi Saputra, Taufiq Asyhari), `sameAs` (12 profiles)
- Works: `author` array — **auto-generated from `_data/publications.yml`** via Liquid

**2. CollectionPage + ScholarlyArticle schema** — in `_pages/publications.md` (research page only). Also auto-generated from `_data/publications.yml`.

When adding new publications, **only update `_data/publications.yml`** — both JSON-LD blocks update automatically. Required fields: `key`, `kind`, `tag`, `title`, `description`, `venue`, `year` (string), `url`, `abstract`, `keywords` (array). Optional: `publisher`, `doi`.

Valid `kind` values: `geospatial`, `cultural`, `nlp`, `applied`.

### Sitemap
Auto-generated by `jekyll-sitemap` plugin into `/sitemap.xml`.

### Permalinks
Clean URLs without `.html`:
- `/about/` instead of `/pages/about.html`
- `/research/` instead of `/pages/publications.html`

## Shared Navigation

All navigation is defined in `js/components/nav.js` via the `NAV_ITEMS` array. This is the **single source of truth** — modification here updates all pages automatically. The hardcoded `<nav>` in `default.html` is a no-JS fallback.

## Design System (Gestalt-based)

The site follows Gestalt perceptual principles to minimise cognitive load. Key patterns:

### Spacing Scale
```css
--gap-1: 0.5rem    /* tight — tag clusters */
--gap-2: 1rem      /* standard — between list items */
--gap-3: 1.5rem    /* section gap */
--gap-4: 2.5rem    /* section separator */
```

### Card Padding Tokens
```css
--card-pad-lg: 1.5rem   /* .card--feature — use cases, research */
--card-pad-sm: 1rem     /* .card--list — insights, thoughts, contact links */
```
Rule: **grid gap must be larger than card padding** to signal separate groups (Proximity law).

### Card Role System
Three semantic card roles — always use these, never raw padding inline:

| Class | Padding | Use for |
|---|---|---|
| `.card--feature` | `--card-pad-lg` | Use cases, research |
| `.card--list` | `--card-pad-sm` | Insights, thoughts, contact links |
| `.card--mini` | `1.2rem` | About-cards, contact engagement boxes |

### Filter Bar (Unified Component)
Every filterable list page uses the same two classes. Do **not** create page-specific filter classes.

```html
<div class="filter-bar" role="group" aria-label="Filter by …">
  <button class="filter-pill is-active" data-filter="all">All</button>
  <button class="filter-pill" data-filter="geospatial">Geospatial</button>
</div>
```

`main.js` listens for `.filter-pill, .filter` clicks and routes them via `data-filter` to `data-kind` on `.project-card` elements. Inline page JS (usecases, thoughts) also selects `.filter-pill`.

### Note Block (Info / WIP notices)
Use `.note-block` + `.note-badge` instead of one-off alert styles:

```html
<div class="note-block" role="note">
  <span class="note-badge">Work in Progress</span>
  <p>Body text here.</p>
</div>
```

### Typography Tokens
```css
.t-eyebrow       /* 0.76rem uppercase, letter-spaced, accent colour */
.t-section-title /* 1.08rem bold, accent colour — section sub-heading */
.t-display       /* clamp(1.6rem, 4vw, 2.4rem) — page display title */
.t-meta          /* 0.78rem muted — dates, venues, supplementary */
```

### Tech Stack Tiers (`_data/about.yml`)
`tech_stack` is structured as three YAML keys. Render all three in order — primary tags are visually larger:

```yaml
tech_stack:
  primary:   [...] # .tech-tag--primary — largest, bold
  framework: [...] # .tech-tag--framework — standard
  tool:      [...] # .tech-tag--tool — smallest, muted
```

### Reveal Group Stagger (Common Fate)
Wrap card grids in `.reveal-group` so children animate together with 80ms stagger:

```html
<div class="about-grid reveal-group">
  <div class="about-card reveal">…</div>
  <div class="about-card reveal">…</div>
</div>
```

`main.js` observes `.reveal-group` elements and marks both the group and its children `.in-view` together.

### Point Cloud (Background — Decorative)
The `#pointcloud-bg` canvas is **decorative only**. Current CSS opacity: `0.22` (desktop), `0.18` (≤1020px), hidden on coarse pointer (mobile). Do not raise above `0.30` — it competes with foreground content (Figure-Ground law).

## Code Conventions

### Front Matter
All pages use YAML front matter:
```yaml
---
layout: page
title: Page Title
description: SEO description
permalink: /slug/
---
```

### Data Files
Content stored in `_data/*.yml` — accessed via `site.data.<filename>.<key>`

### CSS
- CSS custom properties in `:root`
- Mobile-first responsive design
- Grid for layouts, Flexbox for components
- Key variables: `--text`, `--muted`, `--accent`, `--accent-2`, `--border-ui`, `--line`, `--surface`
- Spacing scale: `--gap-1` through `--gap-4`
- Card padding: `--card-pad-lg`, `--card-pad-sm`
- `--border-ui: rgba(119, 146, 175, 0.7)` — minimum 3:1 contrast; use for all interactive element borders (buttons, links styled as cards)

### JavaScript
- ES6+ syntax
- IIFE wrapper in nav.js
- Current versions: `main.js?v=7`, `nav.js?v=3`

## Accessibility (WCAG 2.1 AA)

The site targets WCAG 2.1 AA compliance. Key implementations:

- **Skip link**: `.skip-link` in `default.html` — first focusable element, links to `#main-content` on `<main>`
- **Focus indicator**: Global `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px }` in `styles.css`
- **Button borders**: All interactive element borders use `--border-ui` (≥ 3:1 contrast ratio) not `--line`
- **Text contrast**: `--text` = 13.6:1, `--muted` = 6.75:1, `--accent` = 5.81:1 against `--bg`
- **Status messages**: `#project-count` uses `role="status" aria-live="polite"` in `publications.md`
- **Decorative images**: `aria-hidden="true"` on SVG backgrounds and canvas
- **Alt text**: All meaningful images have descriptive alt text
- **Filter groups**: All filter bars use `role="group"` + `aria-label`
- **Note blocks**: Use `role="note"` on `.note-block`

## Performance

- **All-WebP images**: No PNG/JPG/SVG originals remain. Hero uses `<picture>` with `profile-450.webp 450w` / `profile.webp 880w` srcset.
- **Hero image**: `fetchpriority="high"` + explicit `width`/`height` to prevent layout shift.
- **Page-specific preload**: Pages declare `preload_image:` in front matter; `default.html` emits `<link rel="preload" as="image">` for that path. Used on `/about/` (`profile_2_bg.webp`) and `/contact/` (`profile_3_bg.webp`) to eliminate visible load delay.
- **Lazy loading**: `loading="lazy"` on all off-screen images (contact icons, inline icons).
- **Font preload**: `<link rel="preload">` for `manrope-latin.woff2` and `spacegrotesk-latin.woff2` in `<head>`.
- **Font subsets**: Only latin and latin-ext `@font-face` blocks declared (cyrillic/greek/vietnamese removed — not used in English content).
- **Service worker** (`sw.js`): Cache-first for static assets, network-first for HTML. Cache name is versioned by build timestamp via `{{ site.time | date: "%s" }}`. Registered via inline script at bottom of `default.html`.

## Common Tasks

### Change Navigation
Edit the `NAV_ITEMS` array in `js/components/nav.js`.

### Add New Content
Edit the appropriate file in `_data/`. For publications, only edit `_data/publications.yml` — the JSON-LD on both the research page and the global Person schema auto-update.

### Add a New Publication
1. Add entry to `_data/publications.yml`
2. Required fields: `key`, `kind` (geospatial/cultural/nlp/applied), `tag`, `title`, `description`, `venue`, `year`, `url`, `abstract`, `keywords`
3. The filter bar on `/research/` and both JSON-LD blocks update automatically

### Add New Page
1. Create `_pages/newpage.md` with front matter
2. Add to `NAV_ITEMS` in `js/components/nav.js`

### Add a Filterable List Page
1. Add `.filter-bar` / `.filter-pill` markup (see Design System above)
2. Add `data-kind="<value>"` to each card/item element
3. `main.js` handles clicks on `.filter-pill, .filter` automatically for `.project-card` items; for other card types, add inline JS that reads `.filter-pill` clicks and toggles visibility

### Update Styles
Edit `css/styles.css`, bump the version query string in `_layouts/default.html` (`?v=28` → `?v=29`), and update the matching entry in `sw.js` PRECACHE array.

### Add a New Button or Interactive Link
Use `border: 1px solid var(--border-ui)` — not `--line` or `--line-strong` — to maintain 3:1 non-text contrast (WCAG 1.4.11).

### Add a Card Component
Pick the correct semantic role: `.card--feature` (1.5rem pad, for primary content), `.card--list` (1rem pad, for secondary listings), or `.card--mini` (for compact info boxes). Do not create new one-off padding values.

### Add New Images
- All images must be WebP — no PNG/JPG/SVG source files are retained in `assets/img/`
- Add `loading="lazy"` unless the image is above the fold
- For above-fold background images: set `preload_image: /assets/img/<file>.webp` in the page's front matter instead of `loading="lazy"`; add `fetchpriority="high"` to the `<img>` tag
- Add `width` and `height` attributes to prevent layout shift
- Decorative images: `alt=""` + `aria-hidden="true"`

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
