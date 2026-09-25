# CLAUDE.md - Project Guidelines

## Project Overview

Personal portfolio website for Vicky Feliren - Applied Scientist working on **calibration under safety alignment**: safety training costs a model some of its sense of what it knows, that cost has an unmeasured shape, and measuring it is the work. The framing is constructive (make safe models more useful) rather than adversarial (audit other people's systems). Earth observation (remote sensing) is framed as a proof point, not an identity. Built with Jekyll static site generator.

**Narrative spine (apply to all copy):** identity = **AI safety · calibration & alignment**. The claim: the alignment tax is reported as one averaged number but is better understood as a distribution over inputs whose shape nobody has measured, largest where the safety training data was thinnest (non-English, non-text). Multilingual and multimodal are the *method*, not the mission — they are where the cost is measurable, never an inclusion argument. Remote sensing / geospatial / production ML are *evidence* the agenda survives messy data, never top-level identity labels. Conformal prediction is the recovery *tool*, not a topic to lead with. Landing and agenda surfaces lead with *why a problem matters* (taste), not metrics; numbers live on evidence/detail pages. Long-form essays live in `_pages/essays/`, featured atop `/writings/` and on the homepage.

## Where to read further

This file holds what applies everywhere. Detail about one subsystem lives in
`docs/`, because most of it is irrelevant to most changes. Open the row that
matches what you are about to touch.

| Working on | Read first |
|---|---|
| A pinned scroll scene, or a page with `motion_scene:` | `docs/essay-motion.md` |
| `/interview/`, any syllabus page, `/transformers/` | `docs/interview.md` |
| `_data/game_theory.yml`, `_data/stoic.yml`, any generated file | `docs/generated-data.md` |
| Icons on `/principles/` or `/high-agency/`, situation diagrams | `docs/icon-sprites.md` |
| Meta tags, JSON-LD, the sitemap, robots, permalinks | `docs/seo.md` |
| Headings, focus, contrast, screen-reader behaviour | `docs/accessibility.md` |

`CONTRIBUTING.md` covers the review checklist and the audits to run before
committing. `README.md` is the reader-facing description of the site.

## Build and verify

`make` on its own lists every target.

```bash
make install   # bundle install
make build     # build into _site/
make serve     # http://localhost:4000, live reload
make diff      # prove a refactor changed no output (REF=<base> once committed)
make check     # build, then run the SEO and link audit
```

Run everything through `make`. A bare `bundle exec jekyll build` fails on any
current Ruby: liquid 4.0.3, pinned exactly by the `github-pages` gem, calls the
taint API that Ruby 3.2 deleted. `_dev/ruby-compat.rb` restores it as a no-op and
the Makefile loads it via `RUBYOPT`. GitHub Pages builds with the same gem pin on
its own Ruby, so the shim is local-only and cannot affect what ships.

**`make diff` is the tool for any structural change.** It builds the committed
tree and the working tree and compares the two `_site/` directories, ignoring
only what is derived from file timestamps. Moving markup into an include or
replacing a hardcoded list with a data file should report no output changes.

It compares against `HEAD` by default, so run it before committing. Afterwards
`HEAD` is your own work and the comparison would be vacuous, so name the ref you
started from instead: `make diff REF=<base>`. The script refuses to run rather
than report a pass it has not earned.

`make check` reports zero flags. Any flag it raises is a real problem to fix
before committing.

## Writing Rules (apply to ALL site copy)

The voice is set by `_pages/essays/knowing-when-you-dont-know.md` and `_data/notes.yml`.
Read one of those before writing copy. Match them; do not invent a new register.

### Measurable targets

| Rule | Target | How to check |
|---|---|---|
| Sentence length | **~14 words average**, nothing over ~17 | count before shipping |
| Em dashes | **zero** in body prose | `grep -c '—' _data/*.yml` |
| Hero length | 5 sentences / ~65 words max | it is a hook, not a summary |
| Long words | avoid 11+ characters where a short word works | plain English wins |

Vary sentence length deliberately: short sentences (≤8 words) are ~22% of the essay,
often in consecutive pairs for emphasis. Uniform 20-word sentences read as AI-generated.

### Never write these

- **Negative contrast.** "More useful, not less", "not X but Y", "isn't about X, it's about Y".
  State the positive and stop. The reader should process one idea, not two.
- **Structure announcements.** "One claim, three ways in", "Two halves", "Here's the thing".
  Lead with the claim itself. Never name the shape of the section before saying it.
- **Invented numbers.** No statistic that cannot be traced to a source or to the CV.
  ("ten thousand agent trajectories", "94% catch rate" — both were fabricated and removed.)
- **Unverifiable capability boasts.** "I can run experiments without the infrastructure
  being the bottleneck" is false — there is no standing GPU access. State facts
  (employers, shipped systems), let the reader infer capability.
- **Phrasing that points at other organisations.** "When a lab reports…", "nobody has
  asked…", "as if they were stable numbers". Frame gaps as open questions the field
  shares, not as somebody's error. He wants these labs to hire him.
- **Glossary asides.** Do not stop mid-pitch to define a term. Pick phrasing that carries
  its own meaning ("its sense of what it knows" beats defining "calibration").

### Always do these

- **State limits as the work, not as caveats.** "I do not treat that as a flaw in the
  approach. I treat it as the work." Concede honestly, then keep going.
- **Design claims so either result is publishable.** "Finding out is useful either way"
  signals research taste and defuses the adversarial reading.
- **British spelling** (characterise, behaviour, modelling).
- **First person, direct.** "I think", "My worry is", "My starting position is".
- Hedge to match the actual credence in `notes/research-agenda.md`. If the private note
  says 0.65, the site should not read as certainty.

### Citations

Cite a **published venue** when one exists, and verify it — do not trust a citation
chain. Check the arXiv comments field, the ACL Anthology, PMLR, or the conference
proceedings directly.

- Label the venue inline: `Lin et al. (EMNLP 2024)`, `Mohri and Hashimoto (ICML 2024)`.
- Link to the proceedings (aclanthology.org, proceedings.mlr.press) over the arXiv
  preprint when the paper is published.
- If no acceptance is found, cite it **without** a venue label rather than guessing.
- Never cite a claim sourced from a news aggregator or secondhand summary.
- Verify every URL returns 200 before committing.

Cautionary example: Askell et al. (2021) is often cited as establishing the alignment
tax. It reports the opposite — no significant tax from those prompting interventions.

### Inline link styling

Prose links use text colour with an accent underline. Add that styling to the
relevant page stylesheet when adding inline links to new prose containers.

### Private notes

`notes/` is gitignored **and** in the `_config.yml` exclude list. Both are required:
Jekyll copies unrecognised files into `_site/` and would publish them. `notes/research-agenda.md`
holds credences, kill criteria, and career motives — never link it, never commit it.

## Architecture

```
feliren88.github.io/
├── CLAUDE.md          # This file: site-wide rules, and where to read further
├── docs/              # Per-subsystem detail, read on demand (see the table above)
├── Makefile           # Every local task. `make` lists them
├── _config.yml        # Jekyll configuration
├── _dev/              # Local build shim, not part of the site
├── _layouts/
│   ├── default.html   # Page skeleton; every part of it is an include
│   ├── page.html      # Generic page (extends default)
│   ├── syllabus.html  # One /interview/ syllabus page, driven by topic_id
│   └── usecase.html   # One use case detail page, driven by uc_id
├── _includes/
│   ├── site-head.html          # <head>: resource hints, stylesheets, analytics, meta
│   ├── site-header.html        # Top bar: nav, theme toggle, shape picker
│   ├── site-nav.html           # Nav links + active state, used by header and footer
│   ├── site-footer.html        # Footer: brand, social links, nav
│   ├── site-scripts.html       # Script loading at the end of <body>
│   ├── asset.html              # Cache-busted asset URL; read its header before use
│   ├── seo/                    # One file per schema; all driven by _data
│   └── *-icons.html            # SVG <symbol> sprites, one per page that uses icons
├── _data/             # All site content. See "The data layer" below
├── _pages/            # Pages (Markdown). Content lives in _data; these are mostly front matter
├── assets/            # Fonts and WebP images
├── css/               # styles.css is global; every other file is page-scoped
├── js/
│   ├── main.js        # Point cloud, filters, tilt, reveal, reveal-group stagger
│   └── components/    # One file per page that needs behaviour
└── scripts/           # Generators, verifiers and audits. Not published
```

### The data layer

Reusable records live in `_data/`. The About narrative lives in `_pages/about.md`,
while `_data/about.yml` holds the record strip.

| File | Holds | Notes |
|---|---|---|
| `identity.yml` | Who the site says its author is | Drives the Person JSON-LD |
| `navigation.yml` | The nav, for header and footer | Single source of truth |
| `media.yml` | Press coverage of the author | Coverage *of*; `thoughts.yml` is *by* |
| `events.yml` | Talks and panels | |
| `about.yml`, `now.yml`, `contact.yml` | Homepage record, recent work, and contact copy | |
| `publications.yml` | Papers | Each entry needs a `kind` for filter routing |
| `experience.yml`, `awards.yml`, `skills.yml` | CV surfaces | `skills.yml` renders on /cv only |
| `features.yml`, `notes.yml`, `thoughts.yml` | The three strips on /writings/ | `thoughts.yml` order drives the homepage |
| `usecases.yml` | All use case content (88 KB) | Keyed by id, consumed by `usecase.html` |
| `uc_banners.yml` | Use case banner alt text | GENERATED by `scripts/generate_uc_banners.py` |
| `interview.yml` | All 26 syllabus topics | Field contract in the file header |
| `interview_math.yml` | MathML for the syllabus | GENERATED by `scripts/render_math.py` |
| `game_theory.yml` | All /game-theory/ content | GENERATED by `scripts/solve_games.py` |
| `stoic.yml` | All /stoic/ passages | GENERATED; quotes are verbatim |
| `principles.yml`, `small_talk.yml`, `success_failure.yml` | Long-form note content | Hand-written |
| `timeline.yml` | Project timeline | Loaded by `timeline.js` on /project/ |
| `emotion_wheel.yml` | Emotion wheel data | |

Four of these are generated and a hand edit to any of them is lost on the next
run: `game_theory.yml`, `stoic.yml`, `interview_math.yml`, `uc_banners.yml`.
See `docs/generated-data.md`.

Note the **underscores** in `game_theory.yml` and `small_talk.yml`. Liquid parses
`site.data.game-theory` as a subtraction, so a hyphenated data file is read
unpredictably. Data files consumed by Liquid need underscores.

### The long-form interactive notes

Sixteen pages follow the same shape: front matter only in `_pages/`, content in
a data file or an include, icons in a sprite, behaviour in one component, styles
in one page-scoped stylesheet, and reader state under a short `localStorage`
prefix. Changing one means changing its content source, not its template. Each
loads its own CSS and JS through the `extra_css` / `extra_js` front matter keys.

| Page | Content | Sprite | Component | State |
|---|---|---|---|---|
| `/high-agency/` | in the page | `high-agency-icons.html` (`hai-`) | `high-agency.js` | `ha:` |
| `/principles/` | `principles.yml` | `principles-icons.html` (`pi-`) | `principles.js` | `pr:` |
| `/game-theory/` | `game_theory.yml` | `game-theory-icons.html` (`gt-`) | `game-theory.js` | `gt:` |
| `/stoic/` | `stoic.yml` | `stoic-icons.html` (`si-`) | `stoic.js` | `st:` |
| `/small-talk/` | `small_talk.yml` | `small-talk-icons.html` (`sm-`) | `small-talk.js` | — |
| `/success-failure/` | `success_failure.yml` | `success-failure-icons.html` (`sf-`) | `success-failure.js` | `sf:` |
| `/uncertainty-and-emotions/` | `emotion_wheel.yml` | `uncertainty-icons.html` (`ue-`) | `uncertainty-and-emotions.js` | `ue:` |
| `/communication/` | `communication-manual.html` | `communication-icons.html` (`cmi-`) | `communication.js` | — |
| `/read-people/` | `read-people-reference.html` | — | `read-people.js` | `rp:` |
| `/curious/`, `/life-challenges/`, `/self-love/`, `/story/` | in the page | — | one each, same name | — |
| `/interview/` + 26 syllabus pages | `interview.yml` | `interview-icons.html` (`ivi-`) | `interview.js`, `interview-anim.js`, `interview-math.js` | `iv:` |

Icon counts are deliberately not listed here; they drift and the sprite file is
the answer. `grep -c '<symbol id=' _includes/<name>-icons.html`.

Two sprites use a different prefix from their page's element ids: `/high-agency/`
widgets use `ha-` against the `hai-` sprite, and `/small-talk/` uses `smw-`
against `sm-`. A `<symbol>` sits above the page in document order, so a shared id
makes `querySelector` return the symbol and silently kill the widget. See
`docs/icon-sprites.md`.

`_includes/interview-icons.html` is generated by `scripts/generate_icons.py` and
must never be hand-edited.

### Scripts

None of these are published; `_config.yml` excludes them. Several own a data
file outright, and a hand edit to a generated file is lost on the next run.

| Script | Does | Owns |
|---|---|---|
| `diff-build.sh` | Diffs this build against a git ref's; the refactor proof | — |
| `audit_seo.py` | Checks sitemap coverage, inbound links, noindex conflicts | — |
| `solve_games.py` | Solves every 2x2 game on `/game-theory/`; `--check` fails if stale | `_data/game_theory.yml` |
| `verify_stoic_quotes.py` | Asserts every quote is verbatim in its public-domain source | — |
| `render_math.py` | Converts `math:` blocks to MathML; `--check` fails on a notation clash | `_data/interview_math.yml` |
| `generate_icons.py` | One `ICONS` list emits the svgs, the preview, the spec and the sprite | `_includes/interview-icons.html` |
| `generate_uc_banners.py` | Renders the use case pipeline diagrams | `assets/img/usecases/`, `_data/uc_banners.yml` |
| `verify_transformer.py` | Independent NumPy check of `transformer.js`, tensor by tensor | — |
| `trace_portrait.py` | Draws the line-art portrait for the `record` scene's opening beat | — |
| `normalise_interview_numbers.rb`, `audit_interview_prose.rb` | Prose and number consistency across the syllabus | — |

### Other root files

`llms.txt` is an LLM-readable summary of the site's pages and must be updated
when a page is added or removed. `robots.txt` carries the crawler directives and
the sitemap pointer. `sw.js` is the service worker, a Liquid template despite the
extension, and needs `layout: null` or the page layout wraps it and it stops
parsing. `index.html` is the homepage template; `_pages/about.md` takes
`permalink: /` and `/about/` is a `redirect_from` alias for it.

### Page-scoped CSS and JS

A page can pull in its own stylesheet or script without touching every other page:

```yaml
extra_css: /css/high-agency.css
extra_js: /js/components/high-agency.js
```

Both keys take one path or a list of them, so a page carrying a component nobody else
loads can keep that component's stylesheet and script off every other page.
`/transformers/` uses the list form for `css/transformer.css`, which would otherwise be
downloaded by all twenty-six syllabus pages to be used by one.

`_includes/site-head.html` emits a `<link>` after `styles.css`, and
`_includes/site-scripts.html` a deferred `<script>` after `site-header.js`, when
those keys are present. Use this for one-off pages heavy enough that their CSS would
bloat the global stylesheet. Cache-busting is automatic: every asset URL is emitted through
`{% include asset.html path='...' %}`, which appends the file's own modified time. There is no
version number to bump, and no way to bust one file by editing another.

Page-scoped CSS should shadow the global type-scale tokens rather than hard-code sizes.
`/high-agency/` is a long-form reading page, so it re-declares `--fs-base` and friends on
`.high-agency` (set via `layout-class` front matter). Every token-driven size on that page
grows together and no other page moves.

## Shared Navigation

All navigation is defined in `_data/navigation.yml`. `_includes/site-nav.html`
renders it, and both the header and the footer call that include, so adding an
entry puts the link in both places. There is no second list.

Active state is resolved at build time by the same include. An item owns its own
href exactly, anything beneath it (so `/usecases/some-project/` lights up Use
Cases), and any extra prefix listed under `owns:`. That last one is how a
long-form note at its own top-level URL still lights up Writings.

`js/components/site-header.js` holds no navigation content. It handles the
mobile drawer, the theme toggle and the shape popover, and nothing else.

## Design System (Gestalt-based)

The site follows Gestalt perceptual principles to minimise cognitive load. Key patterns:

### Visual restraint: no ornamental left rails

- Do **not** add a vertical accent line at the left of headings, metadata, cards,
  callouts, status messages, or ordinary prose merely for decoration. This includes
  `border-left`, a narrow coloured pseudo-element, and a dot stretched into a bar.
- A vertical line is allowed only when it carries established meaning, such as a
  blockquote edge, a timeline axis, or an active/focus state. Use an existing shared
  component for that meaning and do not rely on colour alone.
- Research and project mastheads should follow document hierarchy. Keep the title,
  authors, affiliations, and paper/arXiv/code links together and centred when the
  page is modelled on a research paper. Never place that metadata beside a coloured
  rail or turn the resource links into a decorative dashboard stack.
- Keep project-status copy as plain prose or use the shared `.note-block` component.
  Do not mark it with a one-off coloured vertical bar.
- Before shipping page-scoped CSS, review every new `border-left` declaration. If
  removing it would not change the meaning or interaction, remove it.

### No decorative kickers

- Do **not** add an eyebrow or kicker above a page or section heading merely to set
  a mood, announce the page type, or fill space. Avoid invented labels such as
  "Research preview", "Featured work", "Selected insight", or category pairs joined
  with a centred dot.
- Do not style generic pre-title text as small uppercase, widely letter-spaced accent
  copy. This pattern reads as template decoration and weakens the real heading.
- Keep genuine metadata only when it helps the reader, for example a publication
  venue, date, or document state. Place it in the normal metadata line near the title;
  do not turn it into a decorative pre-heading.
- Do not revive legacy `kicker`, `eyebrow`, or equivalent pre-title classes. If text
  is real metadata, keep it in the ordinary metadata flow instead of above a heading.
- Avoid decorative, zero-padded counters such as `01`, especially as faint oversized
  card backgrounds or ornaments beside headings. Use an ordered list with ordinary
  numbers only when the sequence itself helps the reader.

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
.t-section-title /* 1.08rem bold, accent colour — section sub-heading */
.t-display       /* clamp(1.6rem, 4vw, 2.4rem) — page display title */
.t-meta          /* 0.78rem muted — dates, venues, supplementary */
```

### Skills (`_data/skills.yml`)
There is **one** skills list on the site and it lives on `/cv`. The tiered
`tech_stack` tag cloud that used to sit on the homepage was a second, shorter list
that drifted from the real CV, so it and its `.tech-tag` styles were deleted rather
than kept in sync by hand. Do not reintroduce a summary version somewhere else.

`_data/skills.yml` holds eleven groups. The first seven are technical and follow the
*Technical skills* section of the CV Vicky actually sends; update those from that
document, not from memory. The CV's single "Computer vision & geospatial" line is
split in two, because the page has room the CV does not and they are two toolchains;
both lists are drawn from the `tech_stack` blocks in `_data/usecases.yml`, so grep
there before adding to either. The last four are the non-technical half — research
and writing, leadership and mentorship, governance and assurance, spoken languages —
and every line is a capability the CV already evidences somewhere.

```yaml
- id: safety                       # what the filter matches on
  group: 'AI Safety & Reliability' # Title Case; also the filter's own label
  items: 'Conformal prediction, Uncertainty quantification, …'
```

Group labels are Title Case and every entry starts with a capital, which is the one
place this departs from the CV's sentence-case prose. `vLLM`, `dbt` and `rasterio`
are lowercase on purpose.

`items` is one plain string per group, not a list. These are clusters to be read, so
prose keeps the order the CV chose; chopping them into chips doubles the ink and
loses that order. The group label doubles as the filter pill on `/cv`.

The filter's visibility logic is inline in `_pages/cv.md`, because `main.js` routes
`.filter-pill` clicks only to `.project-card` elements and that page has none. Both
set `is-active` and agree on it.

### Reveal Group Stagger (Common Fate)
Wrap card grids in `.reveal-group` so children animate together with 80ms stagger:

```html
<div class="insights-grid reveal-group">
  <div class="insight-card reveal">…</div>
  <div class="insight-card reveal">…</div>
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
- One IIFE per component file, so nothing leaks onto `window`
- A component guards on its own elements and returns early when they are absent,
  because every file in `js/components/` is loaded by some pages and not others
- Asset URLs are cache-busted automatically; see `_includes/asset.html`


## Accessibility

Full detail, and the one known outstanding defect, in `docs/accessibility.md`.
The rules that apply to every change:

- Interactive borders use `--border-ui`, never `--line`. That token is the 3:1 minimum.
- Every filter bar carries `role="group"` and an `aria-label`; every `.note-block` carries `role="note"`.
- Decorative images get `alt=""` plus `aria-hidden="true"`; everything else gets real alt text.
- Never remove the skip link or the global `:focus-visible` outline.

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
Edit `_data/navigation.yml`. The header and the footer both render from it.

### Add New Content
Edit the appropriate file in `_data/`. For publications, only edit `_data/publications.yml` — the JSON-LD on both the research page and the global Person schema auto-update.

### Add a New Publication
1. Add entry to `_data/publications.yml`
2. Required fields: `key`, `kind` (geospatial/cultural/nlp/applied), `tag`, `title`, `description`, `venue`, `year`, `url`, `abstract`, `keywords`
3. The filter bar on `/research/` and both JSON-LD blocks update automatically
4. If the paper has its own page on this site, set `project_page: /<slug>/`. `/research/` links to it from the paper's card, which is also what keeps that page from being an orphan

### Add New Page
1. Create `_pages/newpage.md` with front matter
2. Add it to `_data/navigation.yml` if it belongs in the nav. A long-form note
   linked from `/writings/` goes under the Writings item's `owns:` list, or its
   page falls back to highlighting About
3. Link to it from at least one other page, or `make check` flags it as an orphan

### Add a Filterable List Page
1. Add `.filter-bar` / `.filter-pill` markup (see Design System above)
2. Add `data-kind="<value>"` to each card/item element
3. `main.js` handles clicks on `.filter-pill, .filter` automatically for `.project-card` items; for other card types, add inline JS that reads `.filter-pill` clicks and toggles visibility

### Add or Edit a Use Case Pipeline Banner
Cards on `/usecases/` and the top of each use case detail page show a pre-rendered pipeline diagram whenever `_data/uc_banners.yml` has an entry for the use case id. Each diagram exists in both themes — `assets/img/usecases/<id>.webp` (dark, the default and also each detail page's `image:` front matter for og:image social cards) and `<id>-light.webp` (swapped in by `syncFlowBanners()` in `js/main.js` whenever `data-theme` changes, on both the listing and detail pages), 1320x600 lossy WebP (quality 90). Both the WebPs and that data file (which holds the image `alt` text) are AUTO-GENERATED from the `SPECS` list inside `scripts/generate_uc_banners.py` — the single source of truth for nodes, lanes, edges, and outcome chips. Style rules: every claim faithful to the entry's `resolution:` content; NO numeric wording anywhere in the diagram (no metrics, counts, percentages, sizes, or years) — qualitative outcome chips only; product nomenclature containing digits (Sentinel-2, INT8, V100, ZeRO-2…) is allowed. To add or change a banner:
1. Edit the spec in `scripts/generate_uc_banners.py`
2. Run `python3 scripts/generate_uc_banners.py [--only <id>]` (needs `pip install playwright pillow` + a Chromium binary) — regenerates the WebP(s) and `_data/uc_banners.yml`
3. Commit both. Use cases without a spec (e.g. `vln-conformal-prediction`) render no banner. New use cases also need `image: /assets/img/usecases/<id>.webp` in their detail page front matter for the og:image.

### Update Styles
Edit `css/styles.css` and stop. Cache-busting and the `sw.js` PRECACHE entry both derive from
the file's modified time via `_includes/asset.html`. Do not add a `?v=` by hand: a literal
version in a URL will not match the one the service worker precaches, and the browser ends up
holding two copies of the same file.

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

## Deploying

```bash
git add -A
git commit -m "description"
git push origin main
```

GitHub Pages builds the site itself from `main`. There is no workflow file, which
is why the `github-pages` gem pin in the `Gemfile` is what production runs:
changing it changes the deploy.

For local commands see "Build and verify" at the top of this file.

## Contact

- Email: vickyfeliren@gmail.com
- LinkedIn: @feliren
- GitHub: @feliren88
- Medium: @feliren
