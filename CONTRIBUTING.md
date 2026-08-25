# Contributing

This is a personal site for Vicky Feliren, built with Jekyll and deployed by GitHub
Pages from `main`. It is largely maintained by LLM agents, so this document is written
for one: it covers how to build, what to check before you claim something works, and the
rules that are load-bearing rather than stylistic.

Read `CLAUDE.md` alongside this. The split is deliberate:

- **`CONTRIBUTING.md`** (this file) is process. How to build, how to verify, what to
  never do, how to land a change.
- **`CLAUDE.md`** is subject matter. Writing voice, per-page architecture, the data
  files that are generated rather than authored, design tokens.

If the two ever disagree, the code is the tiebreaker, and whichever document was wrong
should be fixed in the same change.

---

## The one rule

**Do not claim a change works until you have built the site and looked at the result.**

This repo has no test suite. Every guarantee comes from the build succeeding, the audit
passing, and someone actually loading the page. An agent that edits CSS and reports
success without rendering it has reported nothing. Three of the checks below exist
specifically because a plausible-looking edit shipped broken.

---

## Build

```bash
bundle install
bundle exec jekyll build      # output lands in _site/
bundle exec jekyll serve      # http://localhost:4000
```

### If the build fails on a modern Ruby

`github-pages` pins Jekyll 3.9 / Liquid 4.0.3, which predate two Ruby removals: `csv`
left the default gems in 3.4, and `Object#tainted?` was removed in 3.2. On Ruby 3.4+ the
build dies with `cannot load such file -- csv` or `undefined method 'tainted?'`.

**Do not fix this by editing the committed `Gemfile`.** GitHub Pages builds this site
with its own native builder and there is no workflow file in the repo, so the `Gemfile`
exists only for local development. Widening it to satisfy one machine's Ruby is churn
that helps nobody else. Work around it outside the repo instead:

```bash
# a scratch Gemfile: github-pages, plus csv base64 bigdecimal logger ostruct
# a scratch shim.rb: class Object; def tainted?; false; end; def untaint; self; end; end
RUBYOPT="-r/tmp/shim.rb" BUNDLE_GEMFILE=/tmp/Gemfile bundle exec jekyll build
```

---

## Before you push

Run all three. They are fast and they catch different classes of failure.

**1. The build succeeds.** A Liquid error fails the whole page, and Jekyll will happily
report success on a build that produced a page containing a rendered error string.

**2. The indexability audit is clean.**

```bash
python3 scripts/audit_seo.py     # exits non-zero on any flag
```

Search visibility is an explicit goal of this site, so this is a gate, not advice. It
reads `_site/`, so build first.

**3. The page renders, in both themes.** The site has a light and a dark mode and they
are not symmetric. Load the page you touched with `data-theme` unset and set to `light`.
If you changed anything visual on the eleven writings, look at the scroll scene in both.

There is no browser in most agent environments. Playwright against the already-installed
Chrome works and skips the Chromium download:

```bash
python3 -m venv /tmp/venv && /tmp/venv/bin/pip install playwright
# then launch with channel="chrome"
```

Watch your working directory when doing this. Serving with `cd _site && python3 -m
http.server` leaves the shell inside the build output, and a later relative-path edit
silently lands on a generated file that the next build overwrites. **Use absolute paths
for edits.**

---

## Things that will silently break

Each of these has actually happened here. None of them fail the build.

### Never hand-write a `?v=` on an asset URL

Every stylesheet and script URL is emitted through one include:

```liquid
<link rel="stylesheet" href="{% include asset.html path='/css/styles.css' %}">
```

It appends the file's own modified time. `sw.js` builds its `PRECACHE` entries through
the same include so the two byte-match. A literal version number breaks that match, and
the browser then holds two copies of one file and serves the stale one. There is no
version to bump anywhere; if you find an instruction saying otherwise, it is stale.

### Never write a hex colour into `css/essay-motion.css`

Every colour there resolves through a token declared twice, once for dark and once for
light. A raw hex is invisible in whichever theme it was not picked for. New tokens should
be *solved* to match the contrast ratio of their dark counterpart against `--em-bg`, not
eyeballed. See the scroll-scene section in `CLAUDE.md`.

### Never hand-edit a generated data file

`_data/game_theory.yml`, `_data/stoic.yml` and `_data/uc_banners.yml` are outputs. Edits
survive until the next generator run and then vanish. Change the source and re-run:

| File | Source | Command |
|---|---|---|
| `_data/game_theory.yml` | `scripts/games.json` | `python3 scripts/solve_games.py` |
| `_data/stoic.yml` | public-domain source texts | `python3 scripts/verify_stoic_quotes.py` |
| `_data/uc_banners.yml` | `SPECS` in `scripts/generate_uc_banners.py` | `python3 scripts/generate_uc_banners.py` |

The reason is not tidiness. Every equilibrium on `/game-theory/` is computed from the
payoff matrix shown beside it, and every Stoic quotation is a verbatim span lifted from
the source. Hand-editing either turns a checked claim into an unchecked one.

### Never add a second `BlogPosting`

`jekyll-seo-tag` already emits one for any page with a `date`. A hand-written block gives
the same URL two competing article entities.

### Never pair `Disallow` with `noindex`

A `robots.txt` disallow stops Google fetching the page, so it never reads the noindex
meta, and the URL can sit in the index with no description. Let it be crawled and serve
the noindex. `/project/` is the worked example.

### Never commit `notes/`

It is gitignored *and* in the `_config.yml` exclude list, and needs both: Jekyll copies
unrecognised files into `_site/` and would publish it. It holds private credences and
career motives.

---

## How to make common changes

### Add a page

1. Create `_pages/<slug>.md` with `layout`, `title`, `description`, `permalink`.
2. Add it to `NAV_ITEMS` in `js/components/nav.js` if it belongs in the nav, and to the
   hardcoded `<nav>` fallback in `_layouts/default.html` if so.
3. Link to it from somewhere. A sitemap entry alone is a weak crawl signal, and
   `audit_seo.py` will flag the orphan.
4. Build, audit, look at it in both themes.

### Add a writing

A "writing" is one of the long-form pages listed on `/writings/`. Beyond the steps above:

- Set `date` and `last_modified_at`. `date` is what turns on `og:type=article`,
  `article:published_time`, the `BlogPosting` block and the breadcrumb trail. Use the
  real first-published date.
- Add `motion_scene: <key>` only if the page gets a scroll scene, and add the copy and
  geometry to `js/components/essay-motion.js` plus an accent pair to
  `css/essay-motion.css`. Both themes need the accent.
- Add an entry to `llms.txt` under `## Writings`. It is hand-maintained and drifts; five
  of eleven writings were missing from it at one point.
- Follow the writing rules in `CLAUDE.md`. They are measurable: ~14 word average
  sentences, zero em dashes in body prose, British spelling, first person.

### Add a publication

Edit `_data/publications.yml` only. The research page, its `CollectionPage` schema and
the global `Person` schema all regenerate from it. Verify every URL returns 200 and cite
the published venue rather than the preprint where one exists.

### Change styles

Edit the stylesheet. Nothing else. Cache-busting and the service-worker precache both
follow automatically.

Use the existing tokens rather than new literals: `--gap-1..4` for spacing, the
`--card-pad-*` and `--fs-*` scales, `--border-ui` for any interactive border (it is the
one that holds 3:1 non-text contrast). Page-scoped CSS should shadow the global tokens,
not hard-code sizes.

---

## Code conventions

**CSS.** Custom properties in `:root`, light overrides under `html[data-theme="light"]`.
Mobile-first. Grid for layout, flexbox for components. Both themes, always.

**JavaScript.** ES6+, no build step, no dependencies. Page-scoped scripts live in
`js/components/` and load only on their page via the `extra_js` front matter key. Wrap in
an IIFE. Persist widget state to `localStorage` under the page's prefix (`ha:`, `pr:`,
`st:`, `gt:`).

**Liquid.** Data files consumed by Liquid need underscores in their names:
`site.data.game-theory` parses as a subtraction.

**Accessibility.** The site targets WCAG 2.1 AA and currently meets it. Interactive
borders use `--border-ui`. Decorative SVG and canvas get `aria-hidden="true"`. Filter
groups get `role="group"` and a label. Do not regress this for a visual preference.

**Comments.** Explain why, not what. The valuable comments in this repo record a
constraint that is invisible from the code: why `hai-` prefixes exist, why `bands` moved
from SVG to HTML, why `layout: null` is required in `sw.js`. Write those. Do not narrate
syntax.

---

## Landing a change

Commit messages here explain the reasoning, not the file list. Say what was wrong, why it
was wrong, and what changed as a result. `git log` is the design record for a codebase
with no tests.

The site deploys from `main` on push, so a push is a deploy. Build, audit, and render
before you push.
