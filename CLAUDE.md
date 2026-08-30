# CLAUDE.md - Project Guidelines

## Project Overview

Personal portfolio website for Vicky Feliren - Applied Scientist working on **calibration under safety alignment**: safety training costs a model some of its sense of what it knows, that cost has an unmeasured shape, and measuring it is the work. The framing is constructive (make safe models more useful) rather than adversarial (audit other people's systems). Earth observation (remote sensing) is framed as a proof point, not an identity. Built with Jekyll static site generator.

**Narrative spine (apply to all copy):** identity = **AI safety · calibration & alignment**. The claim: the alignment tax is reported as one averaged number but is better understood as a distribution over inputs whose shape nobody has measured, largest where the safety training data was thinnest (non-English, non-text). Multilingual and multimodal are the *method*, not the mission — they are where the cost is measurable, never an inclusion argument. Remote sensing / geospatial / production ML are *evidence* the agenda survives messy data, never top-level identity labels. Conformal prediction is the recovery *tool*, not a topic to lead with. Landing and agenda surfaces lead with *why a problem matters* (taste), not metrics; numbers live on evidence/detail pages. Long-form essays live in `_pages/essays/`, featured atop `/writings/` and on the homepage.

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

Prose links use text colour with an accent underline, never browser-default blue:

```css
.about-hero a, .section-prose a, .about-card a {
  color: var(--text);
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-underline-offset: 3px;
}
```

Any new prose container needs adding to that selector list, or its links fall through to
default blue and ignore the light/dark theme.

### Private notes

`notes/` is gitignored **and** in the `_config.yml` exclude list. Both are required:
Jekyll copies unrecognised files into `_site/` and would publish them. `notes/research-agenda.md`
holds credences, kill criteria, and career motives — never link it, never commit it.

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
│   ├── syllabus.html  # Interview syllabus template (extends default); reads from _data/interview.yml via topic_id front matter; renders the module list, the "answer cold" question per module, the traps/drills panels, and prev/next paging across the 18 topics in file order
│   └── usecase.html   # Use case detail template (extends default); reads from _data/usecases.yml via uc_id front matter; auto-generates sticky TOC from .uc-section-label elements (≥3 sections). Optional reflective fields why_this / surprise / next render a "Research Note" block (taste framing: why I chose this, what surprised me, what I'd do next)
├── scripts/
│   ├── solve_games.py          # Solves every 2x2 game on /game-theory/ and regenerates _data/game_theory.yml
│   ├── games.json              # Source payoff matrices and copy for solve_games.py
│   ├── verify_stoic_quotes.py  # Checks every quote in _data/stoic.yml is verbatim in its public-domain source
│   ├── trace_portrait.py       # Draws the line-art portrait on the record scene's opening beat from assets/img/profile.webp: silhouette traced, face from a 68-point landmark fit. `--write` patches it into essay-motion.js. Needs opencv-contrib-python; caches its model in scripts/.portrait-cache/
│   ├── generate_icons.py       # Single source of truth for the /interview/ icon set; one ICONS list emits icons/*.svg, icons/preview.html, icons/style-spec.json and _includes/interview-icons.html
│   └── generate_uc_banners.py  # Renders the consulting-style pipeline diagrams (WebP, 1320x600) for /usecases/ cards into assets/img/usecases/; run after editing its SPECS
├── _includes/
│   ├── principles-icons.html  # SVG <symbol> sprite for /principles/ (83 icons) — see "Icon sprite" below
│   ├── small-talk-icons.html  # SVG <symbol> sprite for /small-talk/ (53 icons, `sm-` prefixed ids)
│   ├── stoic-icons.html       # SVG <symbol> sprite for /stoic/ (23 icons)
│   ├── game-theory-icons.html # SVG <symbol> sprite for /game-theory/ (18 icons)
│   ├── high-agency-icons.html # SVG <symbol> sprite for /high-agency/ (63 icons, `hai-` prefixed ids) — see "Icon sprite" below
│   └── interview-icons.html   # SVG <symbol> sprite for /interview/ (24 icons, `ivi-` prefixed ids) — GENERATED by scripts/generate_icons.py, never hand-edited; see "Icon set (/interview/)" below
├── _pages/         # Jekyll pages (Markdown)
│   ├── high-agency.md    # Interactive personal note on George Mack's High Agency essay (/high-agency/) — loads css/high-agency.css + js/components/high-agency.js via the `extra_css` / `extra_js` front matter hooks; ~20 self-contained widgets (quiz, trap game, flow chart, worksheet) that persist to localStorage under the `ha:` prefix; icons come from `_includes/high-agency-icons.html`, and a twelve-badge progress board (`#badges`, floating `.ha-hud` pill) unlocks as the reader uses each widget, stored under `ha:badges`
│   ├── game-theory.md    # Interactive personal note on strategic decision-making (/game-theory/) — content in `_data/game_theory.yml`, icons in `_includes/game-theory-icons.html`, localStorage prefix `gt:`
│   ├── small-talk.md     # Interactive manual on small talk as calibration (/small-talk/) — content in `_data/small_talk.yml`, icons in `_includes/small-talk-icons.html`; widget element ids use the `smw-` prefix because the sprite owns `sm-`
│   ├── stoic.md          # Interactive personal note on Stoicism (/stoic/) — Marcus Aurelius and Epictetus; content in `_data/stoic.yml`, icons in `_includes/stoic-icons.html`, localStorage prefix `st:`
│   ├── principles.md     # Interactive personal note, The Life Operating Principle (/principles/) — content lives in `_data/principles.yml`, rendered by Liquid AND emitted as a JSON island (`#pr-data`) that js/components/principles.js searches; localStorage prefix `pr:`; every situation also carries a `viz:` block that principles.js turns into a diagram inside its card (see "Situation diagrams" below), and opening a card records it under `pr:seen` for the explored counter
│   ├── about.md
│   ├── skills.md
│   ├── experience.md
│   ├── publications.md   # Research page — includes filter bar (Earth Observation/Cultural AI/Language/Applied)
│   ├── awards.md
│   ├── thoughts.md       # Writings page — uses unified .filter-pill filter bar
│   ├── contact.md
│   ├── usecases.md       # Use cases listing page — uses unified .filter-pill filter bar
│   ├── usecases/         # Individual use case detail pages (20 files) — each sets layout: usecase and uc_id
│   ├── essays/           # Long-form essays (layout: page) — e.g. knowing-when-you-dont-know.md; featured atop /writings/ and homepage
│   ├── interview.md      # UNLISTED revision hub (/interview/) — see "Unlisted pages" below
│   └── interview/        # UNLISTED syllabus pages (18 files) — each sets layout: syllabus, topic_id, and a top-level permalink (/transformers/, /ai-safety/, …). Content lives in _data/interview.yml; these files hold front matter only
├── _data/          # YAML data files
│   ├── index.yml
│   ├── about.yml         # hero copy, stats, and the /about/ section blocks
│   ├── skills.yml        # technical skills, grouped, mirrors the sent CV; rendered on /cv
│   ├── experience.yml
│   ├── publications.yml  # Each entry requires a `kind` field for filter routing
│   ├── awards.yml
│   ├── features.yml      # Press features / media coverage — rendered at top of /writings/ above Medium articles
│   ├── notes.yml         # Research notes — short paper distillations with own take; rendered at top of /writings/ (newest first)
│   ├── thoughts.yml      # Medium articles — ORDERED for homepage "Insights" strip (first 3 surface there); /writings/ defaults to the All filter
│   ├── contact.yml
│   ├── game_theory.yml   # All /game-theory/ content — GENERATED by scripts/solve_games.py; the `solved:` blocks are computed equilibria, never hand-written
│   ├── small_talk.yml    # All /small-talk/ content — hand-written, not generated; note the underscore, since Liquid parses a hyphen as subtraction
│   ├── stoic.yml         # All /stoic/ passages — GENERATED, quotes are verbatim from the public-domain sources; verify with scripts/verify_stoic_quotes.py
│   ├── principles.yml    # All /principles/ content — situations, 8-step sequence, what to protect, the trades
│   ├── usecases.yml      # All use case content (88 KB) — keyed by id, consumed by usecase.html
│   ├── interview.yml     # All /interview/ syllabus content — 23 topics, hand-written; every module carries `plain:` (two short paragraphs in plain English), `viz:` (a diagram) and optionally `scene:` (a concrete illustration); field contract in the file header
│   └── timeline.yml      # Project timeline entries (loaded by timeline.js on /project/)
├── assets/
│   ├── fonts/      # Manrope + Space Grotesk — latin and latin-ext subsets only
│   └── img/
│       ├── profile.webp          # Full-size WebP (109KB) — hero + OG image
│       ├── profile-450.webp      # 450px WebP (34KB) — served to most devices
│       ├── profile_2_bg.webp     # About page background (82KB, white-on-transparent silhouette)
│       ├── profile_3_bg.webp     # Contact page background (220KB, white-on-transparent silhouette)
│       ├── favicon.webp / favicon_black.webp
│       ├── github-color-svgrepo-com.webp / gmail-svgrepo-com.webp / google-scholar-svgrepo-com.webp / linkedin-svgrepo-com.webp / medium-svgrepo-com.webp
│       └── usecases/            # Generated pipeline diagrams (20 WebP, 1320x600) — one per use case card; regenerate via scripts/generate_uc_banners.py, do not hand-edit
├── css/
│   ├── styles.css       # @font-face, custom properties, all component styles
│   ├── high-agency.css  # Page-scoped styles for /high-agency/ only
│   ├── principles.css   # Page-scoped styles for /principles/ only
│   ├── small-talk.css   # Page-scoped styles for /small-talk/ only
│   ├── stoic.css        # Page-scoped styles for /stoic/ only
│   ├── game-theory.css  # Page-scoped styles for /game-theory/ only
│   └── interview.css    # Page-scoped styles for /interview/ and the 18 syllabus pages
└── js/
    ├── main.js          # Core JavaScript (point cloud, filters, tilt, reveal, reveal-group stagger)
    └── components/
        ├── nav.js          # Navigation — single source of truth (NAV_ITEMS array)
        ├── timeline.js     # Project timeline (loaded only on /project/ page)
        ├── high-agency.js  # Widgets for /high-agency/ (loaded only on that page)
        ├── principles.js   # Widgets for /principles/ (loaded only on that page)
        ├── interview.js    # Module diagrams, revision progress, reading controls and the hub map for /interview/
        └── interview-anim.js # One staged animation per track: 3Blue1Brown visuals in a VisuAlgo shell, with live controls on the two maths tracks
```

### Page-scoped CSS and JS

A page can pull in its own stylesheet or script without touching every other page:

```yaml
extra_css: /css/high-agency.css
extra_js: /js/components/high-agency.js
```

`default.html` emits a `<link>` after `styles.css` and a deferred `<script>` after `nav.js`
when those keys are present. Use this for one-off pages heavy enough that their CSS would
bloat the global stylesheet. Cache-busting is automatic: every asset URL is emitted through
`{% include asset.html path='...' %}`, which appends the file's own modified time. There is no
version number to bump, and no way to bust one file by editing another.

Page-scoped CSS should shadow the global type-scale tokens rather than hard-code sizes.
`/high-agency/` is a long-form reading page, so it re-declares `--fs-base` and friends on
`.high-agency` (set via `layout-class` front matter). Every token-driven size on that page
grows together and no other page moves.

### The scroll scene shared by the writings and `/about/` (`css/essay-motion.css`)

Fourteen pages carry a pinned, scroll-scrubbed interlude. A page opts in with one
front matter key:

```yaml
motion_scene: repair    # one of the fourteen keys below
```

`default.html` then sets `data-motion-scene` on `<html>` and loads
`css/essay-motion.css` + `js/components/essay-motion.js`. The JS holds the copy and
the SVG geometry; the CSS holds every colour. The keys are `repair` (/story/),
`abstain` (the essay), `agency`, `decision`, `control`, `strategy`, `feedback`,
`uncertainty`, `signal`, `consent`, `conversion`, `rapport` (/small-talk/),
`curiosity` (/curious/), and `record`, which is on the homepage: `_pages/about.md`
takes `permalink: /` and `/about/` is a `redirect_from` alias for it.

**A key with no scene fails silently.** `js/components/essay-motion.js` looks the key
up and returns early when it misses, so the page loads both assets and renders
nothing. `/curious/` shipped that way. After adding a `motion_scene` to a page, load
it and confirm `.em-story` exists.

Two of the fourteen colour hooks are easy to forget, and both are per-key: an
`--em-accent` under `html[data-motion-scene="…"]` **and** one under
`html[data-theme="light"][data-motion-scene="…"]`. Without them the scene falls back
to the placeholder accent declared at the top of the file.

Three things about `record` generalise to any scene added later:

- **Beat count is not fixed at four.** `record` has seven. `scene.steps.length` is the
  count, the JS writes it to `--em-beats` on the host, and every `.em-story` height in
  the stylesheet is `calc(var(--em-beats) * Nvh)`. Do not hard-code a `vh` height; a
  wrong one desynchronises the scrub. N is well over 100 on purpose, see below.
- **A page can choose where the scene lands.** The default is after the page's own
  hero, found by two lookups in the JS. `/about/` needs it deeper than that, so it
  marks the spot with an empty `<div data-scene-slot></div>` and the scene replaces
  that node. On `/about/` the slot sits between the hero and `.about-story-nav`,
  because a sticky nav placed above the scene stays pinned across the whole interlude.
- **Every claim in `record` is traceable** to Vicky's published personal writing,
  `_data/experience.yml`, `_data/publications.yml` or `_data/awards.yml`. The scene
  follows the motive behind the work instead of repeating the CV chronology.
  Text inside a drawing is a label, never a claim the copy has not already made.

A scene can opt into extra choreography with `cinematic: true`. Only `record` does.
The per-beat rules in `essay-motion.css` are time loops that idle while a beat is on
screen; the cinematic branch in `render()` adds the arrival, the draw-on and the act.

**Scroll picks the beat. The beat plays itself.** Everything inside a beat used to be
a function of scroll position, which meant a reader who stopped to read stopped the
drawing with them, and a beat only performed while the wheel was turning. `BEAT_SECONDS`
of wall clock now walks the beat shape, started when the beat arrives and reset every
time it is arrived at again, so returning to a beat replays it. Scroll still chooses
the stage, cross-fades the pair, and carries the copy out on the boundary.

Two consequences to keep in mind:

- **Acts are no longer scrubbable.** Dragging backwards inside a beat does not run its
  act backwards, because the act is no longer a function of the scrollbar. Going back
  to a beat restarts it instead. This was a deliberate trade for autoplay.
- **The clock only runs while the pin is holding.** An `IntersectionObserver` is a
  coarse gate that stops the loop when the scene is nowhere near, but it is *not* the
  test for whether a beat may advance: the host is a dozen screens tall and fires at
  `threshold: 0`, so it turns true a full viewport before the pin engages. Gated on
  that alone the opening beat played itself out while the reader was still scrolling
  towards it and arrived already finished — the empty-room problem the observer was
  meant to prevent. `tick()` therefore requires `top <= 0 && bottom >= innerHeight`,
  and resets `beatT` when the pin takes hold. `tick()` keeps the rAF loop alive while either the scroll is still
  settling or the beat is still performing, and lets it stop for the hold, so a
  stationary read costs no frames.

**Distance paces the sequence, not interception.** The scene once swallowed every
gesture while the pin held and glided the page to the next beat's anchor. It did stop
the skipping, but it turned the interlude into a slideshow, each beat arriving by
teleport, and the lock that made it work could outlast the reader and trap them: quiet
was the only thing that released it, and a reader who keeps scrolling never gives you
any. That shipped, and the scene ate 241 wheel events over twelve seconds without
moving a pixel.

Nothing is intercepted now. A beat is simply given more scroll to cross, which is why
the `vh` multipliers in the stylesheet are all well over 100: at roughly one screen a
beat the browser could spend a single flick on three of them, and at ~2300px a hard
flick buys about one. Wheel, trackpad, touch, keyboard, scrollbar, find-in-page and the
back button all behave as they do everywhere else on the site, because none of them is
being listened to.

Two things follow, and both are worth keeping:

- **Raising the multipliers is the only lever on pacing.** If beats feel too easy to
  cross, they need more distance, not a lock. Measure it rather than guessing: divide
  the host's scroll reach by `--em-beats` and compare against how far a hard flick
  actually travels, which is ~2000-3000px on a 900px viewport.
- **The clock is what keeps it fast.** Because the drawing no longer rations itself
  across the scroll it was given, `BEAT_SECONDS` can be short while the beat itself is
  long: the icons finish in well under a second and then hold for as long as the reader
  takes to cross the rest of the beat.

`prefers-reduced-motion` collapses the pin to a static block, as it always did.

The eases are anime.js's, solved rather than imported. What the scene needs from
anime.js is the maths, not the timeline. `spring()` integrates the damped harmonic
oscillator the way `createSpring` does, finds its settling time numerically, and
maps the beat onto it, which is why arrivals overshoot to about
1.09 and decay rather than easing flatly to rest. `rippleFrom()` is anime.js's grid
stagger with the grid assumption removed: it takes each element's real coordinates,
measures distance to an origin, and normalises, so a cluster lands as a ring
spreading outward instead of in document order.

It drives five things, all scoped to `html[data-motion-scene="record"]`:

- **Frame depth.** The arriving beat rises from slightly below at 0.93 scale, the
  leaving beat keeps rising past 1.05. A cross-fade alone reads as two pictures
  swapping; a shared direction of travel reads as one story moving.
- **Per-element stagger.** Each frame's direct children get `--em-in` (their own
  arrival, eased with a small overshoot) and `--em-ty` (how far below rest they
  still are). `.em-fig` is excluded from the transform on purpose: the per-beat
  keyframes animate its transform, and an animation beats a normal declaration, so
  the rule would be silently dropped there and kept everywhere else.
- **Stroke draw-on** for solid paths only. Dashed ones are skipped because
  overwriting `stroke-dasharray` to draw them deletes the dashes.
- **Copy lines** arrive in reading order rather than as one block, on the beat's own
  clock, so the column composes itself while the pin settles.
- **An act per beat**, in `ACTS`. A beat that only assembles itself is a slide with
  a transition on it. Each act resolves its parts once and returns a function of
  that beat's own second half, so the drawing performs the sentence: the connection
  that reaches out and never completes, the forecast that crosses the room, the run
  of confident answers that meets a barrier and stops.

  **A beat is arrive, act, then hold**, set by `ARRIVE_END`, `ACT_START` and
  `ACT_END` as fractions of `BEAT_SECONDS`. The hold used to be the part that was
  easy to lose, because it was the tail of a scroll distance and `XFADE` dropped a
  frame below full opacity after 0.83 of it; an act running past that finished
  while already dissolving, so the payoff was never seen whole. On the clock the
  hold is however long the reader stays, so only the performance needs budgeting.

  **The opening beat is a drawn portrait, not a stat card.** It used to show four
  cards reading 7 papers, 1 patent, 12 awards and 5+ years, every one of which is in
  the stat strip immediately above the scene, so the scene opened by repeating what
  the reader had just read. `scripts/trace_portrait.py` builds it from
  `assets/img/profile.webp` and `--write` patches it in; it needs
  `opencv-contrib-python` and downloads a landmark model into
  `scripts/.portrait-cache/` on first run.

  **The face is drawn from landmarks. Do not go back to tracing it.** Contour tracing
  finds the boundary of a dark region, so an eye becomes a closed loop around its
  shadow — on screen that is a hollow socket, not an eye — a nose becomes a ring, and
  a cheek shadow becomes a rim. Two rounds of threshold tuning produced faces that
  were accurate and frightening, because outline drawing cannot say "slightly darker":
  a line is a line, so every soft shadow becomes hard anatomy. Adding *more* lines
  makes it worse, not better.

  A person sketching a face puts down one stroke per feature. So the features come
  from a 68-point fit and each is emitted as the stroke a person would draw: the jaw
  as one line, a brow as one arc, an eye as an almond, the nose base only, the lip
  seam. Twelve strokes for the whole portrait. Two corrections are deliberate — the
  fitter under-opens lids, so the eye lens is stretched about its centre line to the
  aspect the photograph actually shows, and an iris ring is added, because a lens
  alone is a *closed* eye however wide it is drawn.

  **Where tracing is still right: the silhouette, the hairline, and the hair's
  interior.** Those are real edges. A shadow on a cheek is not one — outlining it
  invents a rim that is not there — but a ridge in hair is a boundary between one mass
  of hair and the next, and hair has direction a person sketching it would put down.
  So the hair carries a few traced sweeps and the face carries none; that split is
  what makes the drawing rich without making it frightening. Three filters keep the
  hair to sweeps rather than scribble: long contours only, opened along the silhouette
  so they do not double the head's edge, and a tortuosity cut, since a sweep is nearly
  as long as the distance it covers while a scribble is several times longer. Nothing in the stylesheet may set `stroke-dasharray` on
  `.em-vf-line`, or `measurePath()`'s length stops describing the path.

  Two details carry the finish. Every path is emitted as a **Catmull-Rom Bézier, not a
  polyline**: `find_contours` walks the pixel grid and the raw result is short straight
  segments whose corners are plainly visible at 2x, which reads as plotted rather than
  drawn. The spline passes through every original point, so nothing moves. And the
  ambient breath is on an **inner** group, `.em-vf-breathe`, because `.em-vf-sketch` is
  a direct child of the frame and takes `transform: translateY(var(--em-ty))` for its
  arrival; animating that element would beat the declaration and delete the arrival.

  **It draws outside its own viewBox on purpose, and its position is set by the copy.**
  The canvas sits in a 706px grid row but the SVG is width-constrained, so at 680:322
  it renders about 386px and the row carries ~320px of unused slack;
  `.em-narrative-canvas svg` sets `overflow: visible`, so the portrait uses it. The
  vertical placement lines the drawing's centre up with the centre of the headline
  column beside it, because the two are read as a pair. That is also why this beat
  alone sets `CAPTION_Y` instead of the 344 the other six use — checked that the two
  captions never overlap through the handover, since `--em-cap` zeroes each before
  the other appears.

  **`record` crops its own viewBox** to `40 54 680 322`, and only `record` may. The
  `750 360` box is shared with nine other narrative scenes, four of which position
  animations with `transform-box: view-box`, whose origin moves with it; `record`'s
  one transform rule is `fill-box` and does not care. The crop is a camera move, not
  a content move, so `getBBox()`, the acts and `rippleFrom()`'s origin all still
  refer to the same points. It exists because the rendered width is fixed, so a
  narrower box is the only way to make the drawings bigger — which is what the
  removed progress thread and the dead margin around the frames paid for.

  Measured on the current values, a beat assembles in about a quarter of a second
  and stops moving about 1.25s after it starts. Lengthening `BEAT_SECONDS` does not
  buy the reader more time to look, since the hold runs until they scroll; it only
  makes the beat slower to say what it came to say. Arrival gets the smallest share
  on purpose — parts sliding into place is the least interesting thing a beat does.

  Because an act writes inline styles, **no CSS animation may touch a property an
  act writes**. A running animation beats an inline style, so the loop would
  silently take the story back. The per-beat rules in the stylesheet were cut down
  to ambience for exactly this reason; keep them off transform, opacity and
  stroke-dashoffset for any acted element.

Two things to preserve when editing it. Frames whose opacity is 0 are skipped, so
six of the eight beats cost nothing per frame; and `prefers-reduced-motion` is
asserted in CSS as well as branched on in JS, because the preference can change
mid-session after the variables have been written.

**Never write a hex literal into this file.** Every colour resolves through a token
declared twice at the top, once under `html[data-motion-scene]` and once under
`html[data-theme="light"][data-motion-scene]`. A raw hex is invisible in whichever
theme it was not chosen for, which is exactly the bug this structure exists to stop.
Tokens are tiered, and the tier is the meaning: `--em-ink` through `--em-ink-faint`
for text, `--em-hair` through `--em-line-4` for strokes, plus `--em-bg`, `--em-panel`,
`--em-warm` (the human figure) and `--em-helper` (a second person).

Light values were **solved, not chosen**: each one lands on the same contrast ratio
against `--em-bg` that its dark counterpart has, holding hue and saturation constant.
If you add a token, solve it the same way rather than eyeballing it, or that stroke
will read at a different weight in one theme than the other.

`--em-accent` is per-scene and is declared on the **root element, not `.em-story`**.
The page-callout rules in the lower half of the file style elements that sit beside
the scene rather than inside it. Scoped to `.em-story` the variable never reached
them and those declarations silently dropped out of the cascade.

### Computing a claim rather than asserting it (`/game-theory/`)

`_data/game_theory.yml` is **generated**. Do not hand-edit the `solved:` blocks.

Every Nash equilibrium, dominant strategy and Pareto-efficient cell shown on
that page is computed by `scripts/solve_games.py` from the payoff matrix
displayed next to it. Edit `scripts/games.json`, then:

```bash
python3 scripts/solve_games.py           # regenerate the data file
python3 scripts/solve_games.py --check   # fail if the data file is stale
```

The reason is the same as the Stoic page. Recalling that Chicken has two pure
equilibria off the diagonal, or that Stag Hunt has none off it, is easy to get
backwards, and a wrong equilibrium is a wrong claim about how a real situation
resolves. Deriving it from the numbers on screen makes the two impossible to
disagree.

Everything in the data file comes from `games.json`, not only the games:
`levers`, `laws`, `dashboard`, `classifier`, `five`, `domains`, `regimes` and
`readiness` are all emitted by the same script. **A hand edit to
`_data/game_theory.yml` is lost on the next run.** To add a field, add it to
`games.json` *and* to the matching `L.append(...)` in `solve_games.py`, then
re-run. Every section now carries a distinct `icon:` per row on that route.

`/game-theory/` also draws each game as a 2x2 shape map (`shapes()` in
`js/components/game-theory.js`). It reads only the computed `solved` block, so
the picture cannot disagree with the matrix beside it. Check it against the
solver's own summary table after changing a payoff:

```bash
python3 scripts/solve_games.py --check
```

Note the **underscore** in the filename. Liquid parses `site.data.game-theory`
as a subtraction, so a hyphenated data file is read unpredictably. Data files
consumed by Liquid need underscores.

Maths on the page is hand-marked-up HTML rather than a rendering library:
`.gt-eq` for display equations, `.m` for inline symbols, `.frac` for stacked
fractions. Keep variables italic and operators upright, which is what
`.m .op` handles.

### Quoting a primary source (`/stoic/`)

`_data/stoic.yml` is **generated**. Do not hand-write or hand-edit a `quote`.

Every quotation is a contiguous verbatim span lifted programmatically from a
public-domain source text:

| Work | Translation | Source |
|---|---|---|
| Meditations | George Long | `classics.mit.edu/Antoninus/meditations.mb.txt` |
| Enchiridion | Elizabeth Carter | `classics.mit.edu/Epictetus/epicench.1b.txt` |

This matters because the best-known Stoic lines in circulation are usually a
different translator's wording, a paraphrase, or an invention. Writing them from
memory produces confident misattribution. Two examples caught during the build:
"the impediment to action advances action" is Hays and appears nowhere in Long,
and the closing passage of Meditations book 12 is absent from the MIT edition
entirely, so the entry citing it was dropped rather than sourced elsewhere.

`situation`, `take` and `search` are original commentary or derived keywords and
are safe to edit. After any change to the data file, run:

```bash
python3 scripts/verify_stoic_quotes.py
```

It fetches both sources, rebuilds the index, and fails on any quote that is not
a verbatim span of the stated book or chapter. It allows exactly two
normalisations, neither of which changes a word: translator apparatus removed
(bracketed Greek, footnote markers, editorial parentheses), and truncation
punctuation, where a span cut at a clause boundary may end in a full stop and
capitalise its first letter. Source texts cache to `scripts/.stoic-cache/`,
which is gitignored.

Refs are `book.section` for the Meditations and a bare chapter number for the
Enchiridion.

### Icon sprite (`/principles/`)

`_includes/principles-icons.html` holds one `<symbol id="pi-…" viewBox="0 0 24 24">` per icon,
pulled in with `{% include principles-icons.html %}` and referenced as
`<svg class="pr-i"><use href="#pi-angry"/></svg>`.

- **Ids are derived, not stored.** A situation uses `pi-{{ s.id }}` and a sequence step uses
  `pi-{{ step.key | downcase }}`, so adding an entry to `_data/principles.yml` only needs a
  matching symbol. `protect` entries carry an explicit `icon:` (plus a short `short:` label
  used by the orbit diagram, which has no room for the full name).
- **Symbols carry geometry only.** Stroke width, caps, joins and `fill: none` are set once on
  `.pr-i` in `principles.css`; colour is always `currentColor`. Shapes that need a solid fill
  use `class="pr-i-fill"`. Never put presentation attributes on a symbol.
- **Diagram labels are placed by measurement, not by hand.** The orbit and the reversibility
  axis position their text by reading `getBBox()` and pushing outward until nothing collides
  with a node, the hub, an axis caption or another label. Renaming an entry cannot reintroduce
  an overlap, so do not replace this with fixed coordinates.

Check every reference resolves before committing:

```bash
python3 - <<'EOF'
import re
s=open('_includes/principles-icons.html').read()
syms=set(re.findall(r'<symbol id="pi-([\w-]+)"',s))
y=open('_data/principles.yml').read()
need=set(re.findall(r'^  - id: (\S+)',y,re.M)) | set(re.findall(r'^    icon: (\S+)',y,re.M))
need|={k.lower() for k in re.findall(r'^  - key: ([A-Z]+)$',y,re.M)}
print('missing symbols:', sorted(need-syms) or 'none')
EOF
```

### Icon sprite (`/high-agency/`)

Same rules as `/principles/` above: `_includes/high-agency-icons.html` holds one
`<symbol id="hai-..." viewBox="0 0 24 24">` per icon, presentation lives once on `.ha-i` in
`high-agency.css`, and symbols carry geometry only.

Ids are prefixed **`hai-`**, not `ha-`. The page already owns element ids in the `ha-`
namespace, and two of them (`#ha-flow`, `#ha-loop`) collide with the obvious symbol names.
A sprite `<symbol>` sits above the page in document order, so a collision makes
`document.querySelector('#ha-flow')` return the symbol and silently kills the widget.

Every referencing `<svg>` carries its own `viewBox="0 0 24 24"`.

Check every reference resolves, and that nothing collides, before committing:

```bash
python3 - <<'PYEOF'
import re
sprite = open('_includes/high-agency-icons.html').read()
page   = open('_pages/high-agency.md').read()
js     = open('js/components/high-agency.js').read()
syms = set(re.findall(r'<symbol id="([\w-]+)"', sprite))
refs = set(re.findall(r'href="#(hai-[\w-]+)"', page + js))
refs |= set(re.findall(r"icon: '([\w-]+)'", js)) | {'hai-lock'}
ids  = re.findall(r'\sid="([^"]+)"', page) + list(syms)
print('unresolved:', sorted(refs - syms) or 'none')
print('unused    :', sorted(syms - refs) or 'none')
print('id clashes:', sorted(i for i in set(ids) if ids.count(i) > 1) or 'none')
PYEOF
```

### Progress badges (`/high-agency/`)

`badges()` in `js/components/high-agency.js` runs **first** in `init()`, before any widget can
call `award()`. It loads `ha:badges` from local storage, and a widget that awarded into an
empty object first would overwrite the reader's record.

It also wires itself to the existing widgets from the outside, using delegated listeners and
two `MutationObserver`s, rather than editing each widget to report in. Adding a badge means
adding one entry to `BADGES` and one listener, and leaves the twenty existing widgets alone.

### Situation diagrams (`/principles/`)

Every situation in `_data/principles.yml` carries a `viz:` block, and `situationViz()` in
`js/components/principles.js` renders it into the top of that situation's card body.

**Labels are quoted, never invented.** Each label must be lifted from that situation's own
`trigger`, `ask`, `rule`, `steps` or `body`. A diagram restates what the card already says.
It is not a place to add a claim, and there are no numbers in any of them.

Fifteen archetypes. Label-heavy ones are HTML so the text wraps and stays selectable;
geometric ones are SVG:

| HTML | SVG |
|---|---|
| `split` `order` `stack` `chips` `test` `bands` | `gate` `threshold` `trend` `rings` `scale` `loop` `funnel` `hub` `pattern` |

`bands` started as SVG and had to move. At six categories the names are wider than the
bands are, and only real text flow keeps them off each other.

Two rules the SVG builders exist to enforce, both of which produced visible bugs first:

- **Size the box from the labels, not from a guess.** `label()` returns the box it actually
  occupied; builders add up `bottom` and pass the result to `svg()`. A fixed height clips
  any label that wraps to three lines.
- **A label above a node grows upward.** `label(..., grow)` takes `up`, `mid` or `down`.
  Without it the second line of a top label lands on the node it belongs to. `shift()` then
  drops the whole drawing if a top label still overshoots `y=0`.

There is no browser in this environment, so check the geometry by script. The three
harnesses under the session scratchpad build all 51 diagrams, assert every label and shape
sits inside its viewBox, and assert no two labels overlap each other or a node:

```bash
# extract the builders, dump the data, then run the three checks
python3 -c "s=open('js/components/principles.js').read();\
a=s.index('  var VZ = 320;');b=s.index('  function situationViz()');\
open('/tmp/builders.js','w').write(s[a:b])"
```

The checkers stub `esc` and `clamp`, `eval` that slice, and run every `viz` block through
`BUILD`. Re-create them if they are gone; a diagram that overflows or overlaps is invisible
to every other test in the repo.

## Jekyll Configuration

### SEO
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
- **A `robots:` front matter key does nothing on its own.** `default.html` emits it
  explicitly. An absent robots meta means indexable, which is what every page but
  `/project/` wants.
- **`sitemap: false` also emits noindex.** Use it to withhold a page. `_config.yml` uses
  it via `defaults` to keep the two search-console ownership tokens out of the sitemap,
  which works because Jekyll's StaticFile does read front matter defaults.

Never pair a `robots.txt` `Disallow` with a `noindex` meta on the same URL. The disallow
stops Google fetching the page, so it never reads the noindex, and the URL can stay in
the index with no description. Let it be crawled and serve the noindex.

### Icon set (`/interview/`)

24 icons, all generated by `scripts/generate_icons.py` from one `ICONS` list. That list
is the only place to edit. Running the script rewrites four outputs at once:

| Output | Consumed by |
|---|---|
| `icons/*.svg` | nothing on the site; portable copies for reuse elsewhere |
| `icons/preview.html` | you, at 1x, 2x and on dark, before shipping a change |
| `icons/style-spec.json` | the style contract |
| `_includes/interview-icons.html` | the site |

`icons/` is in the `_config.yml` exclude list. Left in, Jekyll would copy it into `_site/`
and `jekyll-sitemap` would list `preview.html` as if it were a page.

Style is the Clean preset: 24px grid, 1.5px stroke, round caps and joins, 2px padding,
so every path lives inside coordinates 2–22. The standalone files carry those three
stroke attributes on each root `<svg>`. The sprite cannot: a `<symbol>` has no root, so
`.ivi` in `css/interview.css` declares them once instead. Both routes must agree.

The eighteen track icons are named after the topic ids in `_data/interview.yml`, not
after their shapes. That breaks the usual "name it for what it depicts" rule on purpose,
because it lets a template resolve one with `#ivi-{{ topic.id }}` and no lookup table.

`check()` in the script is a tripwire, not a proof. It catches coordinates outside the
box, precision past two decimals, hard-coded colour, transforms, and stray ids. Note
that SVG lets numbers run together with no separator, so `4.38.94` is two numbers: the
regex has a leading-dot alternative or it reads that as `4.38` and `94` and false-flags.

What the script cannot check is whether an icon reads. Three from the first pass had to
be redrawn after looking at `preview.html`: `nlp` had ticks through text lines and read
as slider controls, `mechanistic-interpretability` had three dots in a triangle inside a
circle and read as a face, and `agentic-ai` had an arrowhead that was not on its arc's
tangent and read as a stray tick. Always open the preview.

### Reading for dyslexia (`/interview/`)

These pages are built for a reader who learns by picture and by doing, and who
may be dyslexic. Four things are defaults rather than options, because they
carry most of the benefit:

- line height at least 1.5 on every body element
- a measure that stops around 66 characters
- left aligned, never justified, and `hyphens: none`
- no all-caps in anything longer than a short label

Capitals are the subtle one. They flatten every word into the same rectangle,
and word shape is a large part of how a dyslexic reader recognises a word
without decoding it letter by letter. No label carries a literal
`text-transform: uppercase`. They all read `var(--rd-caps)` so the reader can
switch the page to sentence case in one click, and the wide tracking that makes
caps legible switches off with it.

On top of that, `readingControls()` in `js/components/interview.js` writes five
custom properties onto the page section: text scale, line height, letter
spacing, caps, and a page tint. Every size on the page is `calc(… * var(--rd-scale))`,
so one number moves the whole layout together. Settings persist under `iv:read`.

Do not add a second "dyslexia mode" stylesheet. Everything is a custom property
precisely so there is only one set of rules to keep correct.

### Module players (`/interview/`)

Every module carries `beats:` — one caption per part of its own `viz`. The
diagram then becomes a narrated walkthrough rather than a picture, using the
same VisuAlgo shell as the track animations: a numbered caption list marking
the line currently running, clickable to jump, plus play and speed.

The key constraint is that **the caption count must equal the part count**. The
inserter in the session scratchpad refuses to write a mismatch, because a player
narrating a step the drawing does not have is worse than no player. Part counts
per archetype: flow `steps`, compare `cols`, stack `layers`, matrix `cells`,
scale `stops`, parts `1 + around`, tree `1 + branches`, curve `2`.

Beats reveal cumulatively, so scrubbing backwards lands in the same state as
stepping forwards. A caption should say why its part matters rather than repeat
its label; the label is already on screen.

Two layout traps, both found by rendering rather than by reading:

- Several archetypes are grid or flex containers, so an appended player becomes
  a layout item and lands in a column of its own. `.ivz > .ivp` claims the full
  width whatever the parent's display is.
- `.an-fade.is-on` sets `transform: none`, and a CSS transform beats the SVG
  `transform` attribute. Putting both on one element silently stacks every
  positioned group at the origin. Keep the translate on an outer group.

### Staged animations (`/interview/`)

`js/components/interview-anim.js` gives every track one animation. The format
combines two references the site owner named: 3Blue1Brown's visual idiom and
VisuAlgo's interactive shell.

From 3Blue1Brown (via Manim, which the animations imitate rather than use):

- **The easing.** Manim's default rate function is a quintic smoothstep,
  `s(t) = t^3(10 - 15t + 6t^2)`. Both its first and second derivatives vanish at
  each end, so motion starts and stops with no kick. `--an-smooth` is the closest
  cubic-bezier. Standard CSS `ease` looks nothing like it.
- **The timing.** One second per animation with an explicit pause between, so one
  idea finishes before the next starts. `--an-run`.
- **Write.** Curves are drawn along their own length, so the reader watches the
  shape being made. `.an-write` plus a `--len` measured at mount.

From VisuAlgo:

- A numbered **step list** beside the stage, marking the line currently running.
  Any line can be clicked to jump. It doubles as a table of contents.
- A **status line** under the stage carrying the caption for the current beat.
- **Speed control**, four settings. The gap is reading time for the caption, so
  slow is genuinely slower.

And the part neither reference has on its own: **live controls**. A scene may
declare `live: { knobs, redraw }`, and the reader drags a number while the maths
responds. `/linear-algebra/` lets you move where the basis vectors land and
watch the determinant go negative when the grid turns inside out. `/calculus/`
lets you shrink the gap between two points and watch the secant slope converge
on the derivative. Touching a knob pauses playback, because the reader has taken
over.

Rendering with real Manim was considered and rejected, for the same reason the
scenes are SVG rather than generated images: video cannot follow the light and
dark themes or the reading tints, cannot resize with the reading controls, and
cannot be read by a screen reader.

Four rules the engine enforces. The reader can always take over. Every beat has
a caption. The last beat is the finished picture, so someone who never presses
play still sees the whole thing. Reduced motion means no timer, never no content.

Adding a track's animation means one entry in `SCENES` and one line in
`BY_TOPIC`. Verify with the harness in the session scratchpad: it loads all
twenty pages and asserts each has an animation with a caption, at least four
steps, and no overflow.

### Scenes: concrete illustrations (`/interview/`)

`SCENE` in `js/components/interview.js` draws small concrete pictures: real
tokens being cut, a kernel on a pixel grid, a cache growing a row per token.
The eight diagram archetypes show the *shape* of an idea; a scene shows the
thing. A module opts in with a `scene:` block and gets it above its diagram.

Each scene is specified before it is drawn, using the five-part discipline from
the `ai-image-generator` skill (type, subject, environment, technical,
constraints). Those notes live in the comment above each builder. The output is
SVG built from the spec, never a generated raster.

That distinction is deliberate and should hold. A raster image cannot resize
with the reading controls, cannot follow the light/dark themes or the page
tints, cannot be read by a screen reader, and cannot be corrected when one
detail is wrong. Text baked into pixels is the one thing a dyslexic reader most
needs to resize. Use the image skill to *specify* a picture, then codify it.

The same rule as the diagrams applies: labels come from the module's own
content, and no scene carries a number.

### Module diagrams (`/interview/`)

Every module in `_data/interview.yml` carries a `viz:` block, and `BUILD` in
`js/components/interview.js` renders it into that module's card. Eight archetypes:

| HTML | SVG |
|---|---|
| `flow` `compare` `stack` `matrix` `scale` `parts` `tree` | `curve` |

**Labels are lifted, never invented.** Each label comes from that module's own `covers`,
`why` or `check`. A diagram restates the module. It is not a place to add a claim, and
there are no numbers in any of them.

Only `curve` is SVG, because there the shape carries the meaning. Its labels all sit
outside the plot box in HTML, so no geometry harness is needed to prove they do not
collide, and it must not carry `preserveAspectRatio="none"` — stretching the box to the
column width flattens every curve into the straight line the archetype exists to disprove.

The page ships its topic as a JSON island (`#iv-data`), so the script never reads content
back out of the DOM. Revision state lives in `localStorage` under `iv:done:<topic-id>`,
and the same key feeds the ring on the syllabus page and the ring on its hub card.

The hub map draws each topic's `links:` as curves between cards. Edges are measured from
the boxes the browser actually laid out, after layout, so the map survives any reflow or
column count. Adding a topic needs no map change.

Check the result with a browser rather than by eye. The harness under the session
scratchpad loads all eighteen pages and asserts every module got a diagram, no `.ivz`
overflows its box, the page never scrolls sideways, and no page logs a console error.

### Unlisted pages
`/interview/` and its eighteen syllabus pages are reachable only by typing the URL.
Four things keep them that way, and all four are required:

1. `robots: noindex, nofollow` in front matter, emitted by `default.html`
2. `sitemap: false`, so `jekyll-sitemap` skips them
3. No entry in `NAV_ITEMS` in `js/components/nav.js`. Adding one would also publish
   every unlisted URL inside a file any visitor can read
4. No inbound link from `/writings/`, the homepage, or `llms.txt`

`scripts/audit_seo.py` understands this: a page carrying a noindex meta is exempt from
its NOT-IN-SITEMAP and NO-INBOUND-LINK checks, so the audit still reports zero flags.
It does count them in `live indexable pages`, which is a naming quirk in the summary line.

This hides the pages from search and from site navigation. It does not make them secret.
The repository is public, so the Markdown and YAML are readable on GitHub by anyone who
looks. Never put anything in here that could not be published.

### Structured Data (JSON-LD)
Four sources, three hand-written and one from the plugin:

**1. Person schema** — in `_layouts/default.html` (appears on every page). Properties:
- Identity: `name`, `alternateName`, `gender`, `description` (includes he/him), `disambiguatingDescription`, `image`
- Role: `jobTitle`, `alumniOf`, `worksFor` (both Monash University)
- Knowledge: `knowsAbout` (8 domains, led by Trustworthy AI / Multimodal AI / AI Safety / Interpretability / Multilingual AI; Earth Observation last), `knowsLanguage` (English, Indonesian)
- Recognition: `award` (11 entries), `memberOf` (SEACrowd, ACL, IEEE)
- Network: `colleague` (Risqi Saputra, Taufiq Asyhari), `sameAs` (12 profiles)
- Works: `author` array — **auto-generated from `_data/publications.yml`** via Liquid

**2. CollectionPage + ScholarlyArticle schema** — in `_pages/publications.md` (research page only). Also auto-generated from `_data/publications.yml`.

When adding new publications, **only update `_data/publications.yml`** — both JSON-LD blocks update automatically. Required fields: `key`, `kind`, `tag`, `title`, `description`, `venue`, `year` (string), `url`, `abstract`, `keywords` (array), `authors` (array). Optional: `publisher`, `doi`, `date` (ISO, from the bibtex/Crossref record — used as `datePublished`, falls back to `year`), `pages`, `volume`, `issue`, `issn`, `isbn`.

Valid `kind` values: `geospatial`, `cultural`, `nlp`, `applied`.

**3. BreadcrumbList** — in `_layouts/default.html`, emitted for any page with a `date`,
which in practice is the twelve writings. Home → Writings → this page.

**4. BlogPosting** — emitted by `jekyll-seo-tag` itself, also keyed on `page.date`. It is
not in the layout and must not be added there.

### Sitemap
Auto-generated by `jekyll-sitemap` into `/sitemap.xml`. It lists every `.html` static
file, not only pages, so anything dropped into the repo root shows up as if it were a
page. Withhold one with a scoped `sitemap: false` in `_config.yml` `defaults`.

After changing anything in this section, re-run the audit in `CONTRIBUTING.md` and
confirm it still reports zero flags.

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
- Asset URLs are cache-busted automatically; see `_includes/asset.html`

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

### Known: the document outline skips ranks on five pages

`/game-theory/`, `/high-agency/`, `/principles/`, `/stoic/` and `/small-talk/` jump
from h2 straight to h5 (h4 on small-talk), 53 headings in total. Screen-reader users
navigating by heading lose the nesting. It is a best-practice failure rather than a
2.1 AA one, which is why it is recorded rather than patched.

It is not a one-line fix, and a retag was attempted and reverted. Three things bite:

- `styles.css` resets `h1, h2, h3, strong` but not h4 to h6, so a heading promoted
  into that list silently gains `margin: 0`, Space Grotesk and `line-height: 1.1`.
- each page has a section-wide prose rule (`.gt-part h3`, `.ha-part h3`, `.sm-part h3`,
  `.ha-part h4`) that captures every component heading once the ranks move. Scoping
  those to `> h3` fixes it, and is a prerequisite for any retag.
- the stylesheets select these headings by element inside a class scope, roughly 15
  selectors, and `high-agency.js`, `small-talk.js` and `communication.js` emit some
  of them, so tag, rule and template have to move together.

Doing it properly means scoping the prose rules first, then renaming, then pinning
`line-height` and `font-family` per component, checking each against a baseline build
rather than by eye. A partial attempt left 226 headings rendering differently.

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
