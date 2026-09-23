# The scroll scene (`css/essay-motion.css`)

Read this before editing `css/essay-motion.css`, `js/components/essay-motion.js`,
or any page carrying a `motion_scene:` key. Nothing else needs it.

## How a page opts in

Fourteen pages carry a pinned, scroll-scrubbed interlude. A page opts in with one
front matter key:

```yaml
motion_scene: repair    # one of the fourteen keys below
```

`_includes/site-scripts.html` then sets `data-motion-scene` on `<html>` and loads
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

