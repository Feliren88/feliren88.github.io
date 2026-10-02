# Metacognition Field Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `/metacognition/`, the 13th field guide on `/writings/`, with one operable visual per section and a 4-beat scroll scene.

**Architecture:** The established long-form shape: front matter and markup in `_pages/metacognition.md`, a page-scoped stylesheet and component, and a new `metacognition` key in the shared scroll-scene engine. All page logic that decides anything (scoring, the reliance simulation, reply text) is pure and exported for Node, so it is tested without a browser. A Playwright script tests the built page.

**Tech Stack:** Jekyll 3.9 (`make build`), vanilla ES5 in an IIFE, inline SVG, CSS custom properties, Node `assert` for logic tests, Playwright (Python, Chrome channel) for page tests.

**Spec:** `docs/superpowers/specs/2026-10-02-metacognition-field-guide-design.md`

## Global Constraints

- Prose: about 14 words a sentence, nothing over about 17 in body copy; zero em dashes; British spelling; first person; numerals for quantities.
- No negative contrast ("not X but Y"), no structure announcements, no colon reveals, no fake-profound closing lines, none of the `no-ai-slop` banned words.
- Every number traces to a source in the spec, or is labelled illustrative inside an interactive.
- No decorative kickers, no zero-padded counters, no ornamental left rails.
- Interactive borders use `--border-ui`. Colour never carries meaning alone.
- Dark is the default theme; light comes from `html[data-theme="light"]`.
- Scene accent: `#c48ee0` dark, `#6b278e` light (both 7.8:1 against `--em-bg`).
- Class prefix `mc-`. No browser storage.
- New test files are excluded from the Jekyll build.

## Review Focus

1. A keyboard user presses "Next claim": the button they pressed disables, so focus must move to the next answer button rather than fall to the page.
2. A phone at 400px: the 18-dot rows, 20-cell grid and 5-step pipeline must wrap without widening the page.
3. A reader with reduced motion: the hero's SMIL dot must stop as well as the CSS animations.
4. The light theme: the scene accent and page tokens must change with `data-theme`.
5. A reader who finishes the 5 claims and starts again must get a clean round, chart included.

Each line has a check in `scripts/test_metacognition_page.py` (Task 2).

---

### Task 1: Pure logic and its Node tests

**Files:**
- Create: `scripts/test_metacognition.js`
- Create: `js/components/metacognition.js` (logic half only)

**Interfaces:**
- Produces, on `module.exports` under Node: `CLAIMS`, `ASSISTANT`, `PHASES`, `TASKS`, `summarise(rounds)`, `simulate(confidences, correct, threshold)`, `verdictText(summary)`, `checkReply(rating, correct)`, `arbitrationText(kind, result, threshold)`, `offloadReply(task, choice)`.
- `rounds` is `[{ confidence: 50..100, correct: boolean }]`; `summarise` returns `{ n, meanConfidence, hitRate, gap, verdict }` with `verdict` one of `none | over | under | close`.
- `simulate` returns `{ cells: [{ confidence, correct, accepted }], acceptedRight, acceptedWrong, checked }`; an answer is accepted when `confidence >= threshold`.

- [ ] **Step 1: Write the failing test**

```js file=scripts/test_metacognition.js
const assert = require('node:assert/strict');
const mc = require('../js/components/metacognition.js');

// Calibration summary.
assert.deepEqual(mc.summarise([]), { n: 0, meanConfidence: 0, hitRate: 0, gap: 0, verdict: 'none' });
const over = mc.summarise([
  { confidence: 90, correct: true }, { confidence: 90, correct: false }, { confidence: 90, correct: false },
  { confidence: 80, correct: true }, { confidence: 100, correct: false }
]);
assert.deepEqual(over, { n: 5, meanConfidence: 90, hitRate: 40, gap: 50, verdict: 'over' });
const under = mc.summarise([
  { confidence: 60, correct: true }, { confidence: 60, correct: true }, { confidence: 50, correct: true },
  { confidence: 70, correct: true }, { confidence: 60, correct: false }
]);
assert.equal(under.gap, -20);
assert.equal(under.verdict, 'under');
const edge = mc.summarise([
  { confidence: 90, correct: true }, { confidence: 90, correct: true }, { confidence: 90, correct: true },
  { confidence: 90, correct: true }, { confidence: 90, correct: false }
]);
assert.equal(edge.gap, 10, 'a gap of exactly 10 points');
assert.equal(edge.verdict, 'close', 'a gap of exactly 10 points counts as close');

// Calibration copy.
assert.equal(mc.verdictText(mc.summarise([])), 'Your average confidence and hit rate appear here after each claim.');
assert.equal(mc.verdictText({ n: 2, meanConfidence: 90, hitRate: 50, gap: 40, verdict: 'over' }), 'Average confidence 90%. Correct 50%.');
assert.equal(mc.verdictText({ n: 5, meanConfidence: 90, hitRate: 60, gap: 30, verdict: 'over' }),
  'Average confidence 90%. Correct 60%. You were 30 points more confident than accurate. Next round, lower the number on claims you cannot trace.');
assert.equal(mc.verdictText({ n: 5, meanConfidence: 60, hitRate: 80, gap: -20, verdict: 'under' }),
  'Average confidence 60%. Correct 80%. You were 20 points less confident than accurate. You knew more than you claimed.');
assert.equal(mc.verdictText({ n: 5, meanConfidence: 80, hitRate: 80, gap: 0, verdict: 'close' }),
  'Average confidence 80%. Correct 80%. Your confidence and your accuracy were within 10 points of each other.');

// The five claims are checkable and balanced enough to score.
assert.equal(mc.CLAIMS.length, 5);
for (const claim of mc.CLAIMS) {
  assert.equal(typeof claim.answer, 'boolean');
  assert.ok(claim.text.length > 10 && claim.note.length > 10);
}
assert.deepEqual(mc.CLAIMS.map(c => c.answer), [true, false, true, false, true]);

// The reliance simulation: same accuracy, different confidence.
const A = mc.ASSISTANT;
assert.equal(A.correct.length, 20);
assert.equal(A.correct.filter(Boolean).length, 14);
assert.ok(A.tracks.length === 20 && A.flat.length === 20 && A.flat.every(c => c === 95));
const t80 = mc.simulate(A.tracks, A.correct, 80);
assert.deepEqual([t80.acceptedRight, t80.acceptedWrong, t80.checked], [13, 1, 6]);
const t85 = mc.simulate(A.tracks, A.correct, 85);
assert.deepEqual([t85.acceptedRight, t85.acceptedWrong, t85.checked], [12, 1, 7], 'the threshold is inclusive');
const f80 = mc.simulate(A.flat, A.correct, 80);
assert.deepEqual([f80.acceptedRight, f80.acceptedWrong, f80.checked], [14, 6, 0]);
const f100 = mc.simulate(A.flat, A.correct, 100);
assert.deepEqual([f100.acceptedRight, f100.acceptedWrong, f100.checked], [0, 0, 20]);
assert.ok(t80.cells.every(cell => cell.accepted === (cell.confidence >= 80)));

// Reliance copy, including singular and plural.
assert.equal(mc.arbitrationText('tracks', t80, 80), 'Its confidence carries information. At 80%, I check 6 answers and accept 1 wrong answer.');
assert.equal(mc.arbitrationText('tracks', mc.simulate(A.tracks, A.correct, 50), 50), 'Its confidence carries information. At 50%, I check 0 answers and accept 6 wrong answers.');
assert.equal(mc.arbitrationText('flat', f80, 80), 'Its confidence never moves. My threshold can only accept all 20 answers or check all 20. Right now I accept every answer, including 6 wrong ones.');
assert.equal(mc.arbitrationText('flat', f100, 100), 'Its confidence never moves. My threshold can only accept all 20 answers or check all 20. Right now I check every answer myself.');

// The fluency check reply.
assert.equal(mc.checkReply(80, true),
  'Right. The paragraph describes the effect and never gives the reason. You rated your ability to explain it at 80%, so the smooth writing supplied part of that feeling. Molecules are far smaller than light’s wavelength. They act like tiny antennas that re-radiate the light. Shorter waves get re-radiated far more strongly, roughly with the fourth power of frequency.');
assert.ok(mc.checkReply(40, false).startsWith('The paragraph never gives the reason. It only says that short waves scatter more. You rated your ability to explain it at 40%, which matches what the paragraph gave you.'));

// Offload choices.
assert.equal(mc.TASKS.length, 6);
assert.ok(mc.TASKS.every(t => ['hand', 'along', 'keep'].includes(t.pick)));
assert.equal(mc.offloadReply(mc.TASKS[0], 'hand'), 'Same as mine. It needs doing, and I learn little from doing it again.');
assert.equal(mc.offloadReply(mc.TASKS[0], 'keep'), 'I would hand it over. It needs doing, and I learn little from doing it again.');
assert.equal(mc.offloadReply(mc.TASKS[3], 'hand'), 'I would keep it. The struggle is the lesson. I ask it for hints and write the fix myself.');

// Phases.
assert.deepEqual(Object.keys(mc.PHASES), ['before', 'during', 'after']);
assert.deepEqual(Object.values(mc.PHASES).map(p => p.title), ['Plan', 'Monitor', 'Evaluate']);

console.log('Checked the metacognition logic.');
```

- [ ] **Step 2: Run it and watch it fail**

Run: `node scripts/test_metacognition.js`
Expected: FAIL with `Cannot find module '../js/components/metacognition.js'`.

- [ ] **Step 3: Write the logic half of the component**

```js file=js/components/metacognition.js
/** Metacognition: checks for confidence, reliance, and what to hand over. */
(function () {
  'use strict';

  var CLAIMS = [
    { text: 'Sunlight takes about 8 minutes to reach Earth.', answer: true, note: 'It takes about 8 minutes and 20 seconds on average.' },
    { text: 'The Great Wall of China is visible to the naked eye from the Moon.', answer: false, note: 'At that distance it is far too narrow to see with the naked eye.' },
    { text: 'An octopus has 3 hearts.', answer: true, note: 'One heart pumps blood around the body, and 2 more pump it through the gills.' },
    { text: 'The summit of Mount Everest is the point on Earth farthest from its centre.', answer: false, note: 'That point is the summit of Chimborazo in Ecuador. Earth bulges at the equator, which lifts it further out.' },
    { text: 'Botanically, a banana is a berry.', answer: true, note: 'It grows from a single flower with one ovary, which is how botanists define a berry.' }
  ];

  // 20 made-up answers, 14 right. Both assistants are equally accurate; only
  // what their confidence says about each answer differs.
  var ASSISTANT = {
    correct: [true, true, false, true, true, true, false, true, true, true, false, true, true, true, false, true, false, true, true, false],
    tracks: [95, 90, 60, 88, 97, 85, 70, 92, 70, 93, 55, 91, 86, 99, 85, 89, 65, 94, 80, 60],
    flat: [95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95]
  };

  var PHASES = {
    before: { title: 'Plan', questions: ['What is the goal, and what would a good answer look like?', 'What do I already know about this?', 'Which part must I do myself to learn it?'] },
    during: { title: 'Monitor', questions: ['Can I explain the last step without looking?', 'How sure am I, as a number?', 'Does this read easily because I understand it, or because it is well written?'] },
    after: { title: 'Evaluate', questions: ['Which of my predictions missed?', 'What did the tool do that I want to learn to do?', 'What will I change next time?'] }
  };

  var TASKS = [
    { text: 'Format a reference list', pick: 'hand', why: 'It needs doing, and I learn little from doing it again.' },
    { text: 'Draft a routine status email', pick: 'hand', why: 'The stakes are low, the result is easy to check, and I know what good looks like.' },
    { text: 'Summarise 10 papers I must cite', pick: 'along', why: 'It can find and sort them. I read the passages I will rely on.' },
    { text: 'Debug code in a language I am learning', pick: 'keep', why: 'The struggle is the lesson. I ask it for hints and write the fix myself.' },
    { text: 'Choose between 2 job offers', pick: 'keep', why: 'It can suggest questions. The weighing depends on things only I know.' },
    { text: 'Review a model’s output for errors', pick: 'along', why: 'It can flag candidates. Deciding what counts as an error is the skill I want to keep.' }
  ];
  var VERBS = { hand: 'hand it over', along: 'work alongside it', keep: 'keep it' };

  function round1(x) { return Math.round(x * 10) / 10; }
  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  function summarise(rounds) {
    var n = rounds.length;
    if (!n) return { n: 0, meanConfidence: 0, hitRate: 0, gap: 0, verdict: 'none' };
    var confidence = 0, hits = 0;
    rounds.forEach(function (r) { confidence += r.confidence; if (r.correct) hits++; });
    var meanConfidence = round1(confidence / n), hitRate = round1(hits / n * 100), gap = round1(meanConfidence - hitRate);
    return { n: n, meanConfidence: meanConfidence, hitRate: hitRate, gap: gap, verdict: gap > 10 ? 'over' : gap < -10 ? 'under' : 'close' };
  }

  function verdictText(s) {
    if (!s.n) return 'Your average confidence and hit rate appear here after each claim.';
    var line = 'Average confidence ' + s.meanConfidence + '%. Correct ' + s.hitRate + '%.';
    if (s.n < CLAIMS.length) return line;
    if (s.verdict === 'over') return line + ' You were ' + s.gap + ' points more confident than accurate. Next round, lower the number on claims you cannot trace.';
    if (s.verdict === 'under') return line + ' You were ' + (-s.gap) + ' points less confident than accurate. You knew more than you claimed.';
    return line + ' Your confidence and your accuracy were within 10 points of each other.';
  }

  function simulate(confidences, correct, threshold) {
    var out = { cells: [], acceptedRight: 0, acceptedWrong: 0, checked: 0 };
    confidences.forEach(function (confidence, i) {
      var accepted = confidence >= threshold;
      out.cells.push({ confidence: confidence, correct: correct[i], accepted: accepted });
      if (!accepted) out.checked++;
      else if (correct[i]) out.acceptedRight++;
      else out.acceptedWrong++;
    });
    return out;
  }

  function arbitrationText(kind, r, threshold) {
    if (kind === 'flat') {
      return 'Its confidence never moves. My threshold can only accept all 20 answers or check all 20.' +
        (r.checked ? ' Right now I check every answer myself.' : ' Right now I accept every answer, including ' + plural(r.acceptedWrong, 'wrong one') + '.');
    }
    return 'Its confidence carries information. At ' + threshold + '%, I check ' + plural(r.checked, 'answer') +
      ' and accept ' + plural(r.acceptedWrong, 'wrong answer') + '.';
  }

  function checkReply(rating, correct) {
    return (correct ? 'Right. The paragraph describes the effect and never gives the reason.' :
      'The paragraph never gives the reason. It only says that short waves scatter more.') +
      ' You rated your ability to explain it at ' + rating + '%' +
      (rating >= 70 ? ', so the smooth writing supplied part of that feeling.' : ', which matches what the paragraph gave you.') +
      ' Molecules are far smaller than light’s wavelength. They act like tiny antennas that re-radiate the light.' +
      ' Shorter waves get re-radiated far more strongly, roughly with the fourth power of frequency.';
  }

  function offloadReply(task, choice) {
    return (choice === task.pick ? 'Same as mine. ' : 'I would ' + VERBS[task.pick] + '. ') + task.why;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      CLAIMS: CLAIMS, ASSISTANT: ASSISTANT, PHASES: PHASES, TASKS: TASKS,
      summarise: summarise, simulate: simulate, verdictText: verdictText,
      checkReply: checkReply, arbitrationText: arbitrationText, offloadReply: offloadReply
    };
    return;
  }
  if (typeof document === 'undefined') return;
}());
```

- [ ] **Step 4: Run it and watch it pass**

Run: `node scripts/test_metacognition.js && node scripts/test_interview_distributions.js`
Expected: `Checked the metacognition logic.` and the existing distribution check line, exit 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/test_metacognition.js js/components/metacognition.js
git commit -m "Add the scoring and reply logic for the Metacognition guide"
```

---

### Task 2: Page behaviour test, watched failing

**Files:**
- Create: `scripts/test_metacognition_page.py`

**Interfaces:**
- Consumes: the element ids and classes named in Task 3's markup; `_site/` from `make build`.
- Produces: `/tmp/venv/bin/python3 scripts/test_metacognition_page.py [-k check ...]`, exit 0 only when every selected check passes.

- [ ] **Step 1: Write the failing test**

```python file=scripts/test_metacognition_page.py
#!/usr/bin/env python3
"""Browser checks for /metacognition/.

Build first with `make build`, then run
    /tmp/venv/bin/python3 scripts/test_metacognition_page.py [-k check_name ...]
It serves _site/ on a free local port and drives the installed Chrome.
"""
import functools
import http.server
import re
import socketserver
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

SITE = Path(__file__).resolve().parent.parent / '_site'
CHECKS = []
BANNED = re.compile(r'\b(delve|foster|leverage|utili[sz]e|facilitate|empower|streamline|robust|cutting-edge|tapestry|realm|beacon|multifaceted|meticulous|intricate|paramount|transformative|elevate|embark|supercharge|harness)\w*', re.I)


def check(fn):
    CHECKS.append(fn)
    return fn


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def open_page(browser, base, path='/metacognition/', width=1200, theme=None, reduced=False):
    context = browser.new_context(viewport={'width': width, 'height': 900},
                                  reduced_motion='reduce' if reduced else 'no-preference')
    if theme:
        context.add_init_script("localStorage.setItem('theme', '%s')" % theme)
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda err: errors.append(str(err)))
    page.goto(base + path, wait_until='load')
    return page, errors


def set_range(page, selector, value):
    page.eval_on_selector(selector, '(el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); }', value)


@check
def loads_with_scene(browser, base):
    page, errors = open_page(browser, base)
    assert page.locator('h1#mc-title').count() == 1, 'hero heading missing'
    page.wait_for_selector('.em-story', state='attached', timeout=5000)
    assert not errors, errors


@check
def rail_targets_exist(browser, base):
    page, _ = open_page(browser, base)
    hrefs = page.eval_on_selector_all('.mc-rail a', 'links => links.map(a => a.getAttribute("href"))')
    assert hrefs == ['#layers', '#illusion', '#calibrate', '#arbitrate', '#friction', '#offload', '#practice', '#sources'], hrefs
    for href in hrefs:
        assert page.locator(href).count() == 1, href


@check
def writings_card_and_nav(browser, base):
    page, _ = open_page(browser, base, '/writings/')
    assert page.locator('.writings-guides-grid a[href="/metacognition/"]').count() == 1, 'no card on /writings/'
    page, _ = open_page(browser, base)
    assert page.locator('a.is-active[href="/writings/"]').count() >= 1, 'Writings is not lit on the guide'
    assert '/metacognition/' in (SITE / 'llms.txt').read_text(), 'llms.txt has no entry'


@check
def phases_switch(browser, base):
    page, _ = open_page(browser, base)
    assert 'Plan' in page.inner_text('#mc-phase-read')
    page.click('.mc-phases [data-phase="during"]')
    assert 'Monitor' in page.inner_text('#mc-phase-read')
    assert page.get_attribute('.mc-phases [data-phase="during"]', 'aria-pressed') == 'true'
    assert page.get_attribute('.mc-phases [data-phase="before"]', 'aria-pressed') == 'false'


@check
def people_grid_counts(browser, base):
    page, _ = open_page(browser, base)
    rows = page.eval_on_selector_all('.mc-people-row', 'rows => rows.map(r => [r.querySelectorAll(".mc-dots i").length, r.querySelectorAll(".mc-dots i.is-miss").length])')
    assert rows == [[18, 15], [18, 2], [18, 2]], rows


@check
def fluency_check(browser, base):
    page, _ = open_page(browser, base)
    set_range(page, '#mc-feel', 80)
    assert page.inner_text('#mc-feel-out') == '80%'
    page.click('#mc-hide')
    assert page.is_visible('.mc-check-step[data-step="quiz"]'), 'quiz did not appear'
    assert page.is_hidden('.mc-check-step[data-step="read"]'), 'paragraph still visible'
    assert page.evaluate('!!document.activeElement.closest(".mc-options")'), 'focus did not move to the options'
    page.click('.mc-options button[data-correct="true"]')
    text = page.inner_text('#mc-check-read')
    assert text.startswith('Right.') and '80%' in text, text


@check
def calibration_round_trip(browser, base):
    page, _ = open_page(browser, base)
    assert page.is_disabled('#mc-cal-submit'), 'lock is enabled before an answer'
    for i in range(5):
        page.click('.mc-cal-answer [data-answer="true"]')
        set_range(page, '#mc-cal-conf', 90)
        page.click('#mc-cal-submit')
        assert page.inner_text('#mc-cal-feedback'), 'no feedback after locking in'
        if i < 4:
            page.click('#mc-cal-submit')
            assert page.evaluate('document.activeElement.matches(".mc-cal-answer button")'), 'focus lost after Next claim'
    summary = page.inner_text('#mc-cal-summary')
    assert 'Average confidence 90%. Correct 60%.' in summary and '30 points more confident' in summary, summary
    assert page.locator('#mc-cal-svg circle').count() == 5
    assert page.inner_text('#mc-cal-submit') == 'Start again'
    page.click('#mc-cal-submit')
    assert page.inner_text('#mc-cal-count') == 'Claim 1 of 5'
    assert page.locator('#mc-cal-svg circle').count() == 0, 'chart kept the old round'


@check
def arbitration_stats(browser, base):
    page, _ = open_page(browser, base)
    stats = lambda: [page.inner_text(s) for s in ('#mc-arb-wrong', '#mc-arb-checked', '#mc-arb-right')]
    assert page.locator('#mc-arb-grid .mc-cell').count() == 20
    assert stats() == ['1', '6', '13'], stats()
    page.click('.mc-toggle [data-ai="flat"]')
    assert stats() == ['6', '0', '14'], stats()
    set_range(page, '#mc-arb-th', 100)
    assert stats() == ['0', '20', '0'], stats()
    assert 'check every answer' in page.inner_text('#mc-arb-read')


@check
def prompt_toggle(browser, base):
    page, _ = open_page(browser, base)
    first = page.locator('.mc-prompts button').first
    assert first.get_attribute('aria-pressed') == 'false'
    first.click()
    assert first.get_attribute('aria-pressed') == 'true'


@check
def offload_reply(browser, base):
    page, _ = open_page(browser, base)
    assert page.locator('#mc-sort .mc-task').count() == 6
    page.click('#mc-sort .mc-task:first-child [data-pick="keep"]')
    assert page.inner_text('#mc-sort .mc-task:first-child output').startswith('I would hand it over.')


@check
def light_theme_tokens(browser, base):
    dark, _ = open_page(browser, base)
    light, _ = open_page(browser, base, theme='light')
    accent = 'getComputedStyle(document.documentElement).getPropertyValue("--em-accent").trim()'
    assert dark.evaluate(accent) == '#c48ee0', dark.evaluate(accent)
    assert light.evaluate(accent) == '#6b278e', light.evaluate(accent)
    token = 'getComputedStyle(document.querySelector(".mc-hero")).getPropertyValue("--mc-orchid").trim()'
    assert dark.evaluate(token) != light.evaluate(token), 'page tokens ignore the theme'


@check
def narrow_viewport_fits(browser, base):
    page, _ = open_page(browser, base, width=400)
    overflow = page.evaluate('document.documentElement.scrollWidth - window.innerWidth')
    assert overflow <= 1, 'page is %spx wider than the viewport' % overflow


@check
def reduced_motion_pauses_hero(browser, base):
    page, _ = open_page(browser, base, reduced=True)
    assert page.evaluate('document.querySelector(".mc-loop svg").animationsPaused()'), 'hero SMIL still runs'


@check
def prose_rules(browser, base):
    page, _ = open_page(browser, base)
    text = page.evaluate('[...document.querySelectorAll(".mc-hero p, .mc-part p, .mc-part li, .mc-part h2, .mc-part h3")]'
                         '.filter(n => !n.closest(".mc-sources")).map(n => n.innerText).join("\\n")')
    assert '—' not in text, 'em dash in the page copy'
    banned = BANNED.search(text)
    assert not banned, banned.group(0)
    sentences = [s for s in re.split(r'(?<=[.?!])\s+|\n', text) if len(s.split()) > 2]
    average = sum(len(s.split()) for s in sentences) / len(sentences)
    assert average <= 16, 'average sentence is %.1f words' % average
    long = [s for s in sentences if len(s.split()) > 24]
    assert not long, long


def main(argv):
    only = set(argv[argv.index('-k') + 1:]) if '-k' in argv else None
    handler = functools.partial(Quiet, directory=str(SITE))
    httpd = socketserver.TCPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base = 'http://127.0.0.1:%d' % httpd.server_address[1]
    failures = 0
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chrome')
        for fn in CHECKS:
            if only and fn.__name__ not in only:
                continue
            try:
                fn(browser, base)
                print('PASS', fn.__name__)
            except Exception as err:  # every failure is reported, then counted
                failures += 1
                print('FAIL', fn.__name__, '-', (str(err).splitlines() or [repr(err)])[0][:300])
        browser.close()
    httpd.shutdown()
    print('%d failed' % failures)
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
```

- [ ] **Step 2: Run it and watch every check fail**

Run: `make build && /tmp/venv/bin/python3 scripts/test_metacognition_page.py`
Expected: 14 `FAIL` lines (the page 404s, so every selector is missing), `14 failed`, exit 1.

- [ ] **Step 3: Commit**

```bash
git add scripts/test_metacognition_page.py
git commit -m "Add browser checks for the Metacognition guide"
```

---

### Task 3: The page, its stylesheet and its DOM wiring

**Files:**
- Create: `_pages/metacognition.md`
- Create: `css/metacognition.css`
- Modify: `js/components/metacognition.js` (append the DOM half before the closing `}());`)

**Interfaces:**
- Consumes: Task 1's exports, used directly inside the same IIFE.
- Produces: the ids and classes Task 2 selects.

- [ ] **Step 1: Confirm the page checks are red**

Run: `/tmp/venv/bin/python3 scripts/test_metacognition_page.py -k rail_targets_exist phases_switch people_grid_counts fluency_check calibration_round_trip arbitration_stats prompt_toggle offload_reply narrow_viewport_fits reduced_motion_pauses_hero prose_rules`
Expected: 11 failed.

- [ ] **Step 2: Write the page**

```html file=_pages/metacognition.md
---
layout: page
title: Metacognition
subtitle: A field guide for thinking alongside AI
description: How to notice what you actually understand when AI answers fast. Score your confidence, weigh the machine's, add friction where bias enters, and decide what to hand over.
permalink: /metacognition/
date: 2026-10-02
last_modified_at: 2026-10-02
layout-class: page metacognition
extra_css: /css/metacognition.css
extra_js: /js/components/metacognition.js
motion_scene: metacognition
hide_title: true
---

<div class="mc-progress" aria-hidden="true"><span id="mc-progress-fill"></span></div>

<nav class="mc-rail" aria-label="Metacognition field guide">
  <a href="#layers">Layers</a><a href="#illusion">Illusion</a><a href="#calibrate">Calibrate</a><a href="#arbitrate">Arbitrate</a><a href="#friction">Friction</a><a href="#offload">Offload</a><a href="#practice">Practice</a><a href="#sources">Sources</a>
</nav>

<header class="mc-hero" aria-labelledby="mc-title">
  <div class="mc-hero-copy">
    <h1 id="mc-title">The answer arrived in seconds. <i>Did my understanding?</i></h1>
    <p>Metacognition is thinking about my own thinking. I use it to tell knowing from recognising, and to decide when to act, check, or ask.</p>
    <p class="mc-hero-tie">My research asks when a model should say it does not know. This guide asks the same question of me.</p>
  </div>
  <figure class="mc-loop">
    <svg viewBox="0 0 520 440" role="img" aria-labelledby="mc-loop-title">
      <title id="mc-loop-title">Two levels of thinking. Below, a task becomes an answer while an AI draft feeds answers in. Above, a monitor reads how sure I am and a controller decides whether to act, check, or ask.</title>
      <rect class="mc-band mc-band-meta" x="10" y="14" width="500" height="136" rx="18"/>
      <text class="mc-band-label" x="30" y="40">Meta level</text>
      <path class="mc-gauge" d="M88 118a52 52 0 0 1 104 0"/>
      <path class="mc-gauge-fill" d="M88 118a52 52 0 0 1 104 0"/>
      <text class="mc-node-text" x="140" y="140">How sure am I?</text>
      <g class="mc-chip mc-chip-act"><rect x="282" y="62" width="64" height="32" rx="16"/><text x="314" y="83">act</text></g>
      <g class="mc-chip mc-chip-check"><rect x="354" y="62" width="70" height="32" rx="16"/><text x="389" y="83">check</text></g>
      <g class="mc-chip mc-chip-ask"><rect x="432" y="62" width="62" height="32" rx="16"/><text x="463" y="83">ask</text></g>
      <text class="mc-node-text" x="388" y="124">What do I do next?</text>
      <path class="mc-arrow" d="M240 330C220 250 150 220 142 156M134 168l8-12 8 12"/>
      <text class="mc-arrow-label" x="200" y="240">monitor</text>
      <path class="mc-arrow" d="M388 150C388 230 300 260 272 328M262 318l10 12 12-8"/>
      <text class="mc-arrow-label" x="352" y="252">control</text>
      <rect class="mc-ai" x="402" y="180" width="96" height="44" rx="12"/>
      <text class="mc-node-text" x="450" y="207">AI draft</text>
      <path class="mc-ai-feed" d="M446 224L424 330"/>
      <rect class="mc-band" x="10" y="270" width="500" height="156" rx="18"/>
      <text class="mc-band-label" x="30" y="296">Object level</text>
      <path class="mc-flow" d="M106 360H225M285 360H386"/>
      <circle class="mc-node" cx="80" cy="360" r="26"/><text class="mc-node-text" x="80" y="404">task</text>
      <circle class="mc-node" cx="255" cy="360" r="30"/><text class="mc-node-text" x="255" y="408">thinking</text>
      <circle class="mc-node" cx="414" cy="360" r="28"/><text class="mc-node-text" x="414" y="406">answer</text>
      <circle class="mc-pulse" cx="106" cy="360" r="6"><animateMotion dur="5s" repeatCount="indefinite" path="M0 0H280"/></circle>
    </svg>
    <figcaption>Monitoring reads the work below. Control changes what happens next.</figcaption>
  </figure>
  <a class="mc-scroll" href="#layers">Start with the two layers <span aria-hidden="true">↓</span></a>
</header>

<section class="mc-part" id="layers" aria-labelledby="mc-layers-title">
  <header class="mc-head"><h2 id="mc-layers-title">Metacognition has two parts</h2><p>Knowledge is what I know about how I think. Regulation is what I do with that knowledge while I work.</p></header>
  <div class="mc-split">
    <article class="mc-card"><h3>Knowledge</h3><p>What I know, which strategies I have, and when each one fits.</p><small>I remember a formula better after deriving it once.</small></article>
    <article class="mc-card"><h3>Regulation</h3><p>Planning, monitoring, and checking my own work while it happens.</p><small>I have read this twice. Can I say it without looking?</small></article>
  </div>
  <div class="mc-phases" role="group" aria-label="Phase of a task">
    <button type="button" data-phase="before" aria-pressed="true">Before</button><button type="button" data-phase="during" aria-pressed="false">During</button><button type="button" data-phase="after" aria-pressed="false">After</button>
  </div>
  <div class="mc-phase-track" aria-hidden="true"><i></i></div>
  <div class="mc-phase-read" id="mc-phase-read" aria-live="polite"></div>
  <h3 class="mc-subhead">Working with AI makes this harder</h3>
  <div class="mc-stakes">
    <article><h3>My shortcuts misread it</h3><p>Habits built on people mispredict how an AI behaves.</p></article>
    <article><h3>It struggles with new problems</h3><p>Novel, badly defined problems are where it is weakest and I most need to check.</p></article>
    <article><h3>It gives no natural feedback</h3><p>A colleague frowns when I am wrong. An assistant keeps going.</p></article>
    <article><h3>It cannot do this part for me</h3><p>The monitoring has to happen in my own head.</p></article>
  </div>
  <p class="mc-cite">The 4 difficulties come from CSIRO’s research on skills for collaborative intelligence. The two parts follow the edtechdev AIED wiki.</p>
</section>

<section class="mc-part" id="illusion" aria-labelledby="mc-illusion-title">
  <header class="mc-head"><h2 id="mc-illusion-title">Fluent text feels like understanding</h2><p>Smooth reading gives me a feeling of knowing. An AI writes smoothly whether or not I have understood anything.</p></header>
  <figure class="mc-figure">
    <figcaption><b>Could they quote the essay they had just written?</b><span>Each dot is one writer. A filled dot could not quote their own essay.</span></figcaption>
    <div class="mc-people" id="mc-people">
      <div class="mc-people-row" data-miss="15"><span>With an LLM</span><div class="mc-dots" role="img" aria-label="15 of 18 writers who used an LLM could not quote their own essay"></div><b>15 of 18</b></div>
      <div class="mc-people-row" data-miss="2"><span>With a search engine</span><div class="mc-dots" role="img" aria-label="2 of 18 writers who used a search engine could not quote their own essay"></div><b>2 of 18</b></div>
      <div class="mc-people-row" data-miss="2"><span>Brain only</span><div class="mc-dots" role="img" aria-label="2 of 18 writers who used no tool could not quote their own essay"></div><b>2 of 18</b></div>
    </div>
    <p class="mc-cite">Kosmyna et al. (2025), first session. This is a preprint and has not been peer reviewed.</p>
  </figure>

  <div class="mc-check mc-panel" id="mc-check">
    <div class="mc-check-step" data-step="read">
      <h3>Try it on yourself</h3>
      <p class="mc-check-text">Sunlight contains every visible colour. Air molecules scatter short wavelengths far more strongly than long ones, so blue light is redirected across the whole sky. Violet scatters even more than blue. We still see a blue sky, because sunlight carries less violet and our eyes respond more strongly to blue.</p>
      <label class="mc-range" for="mc-feel">How well could you explain this to a friend? <output id="mc-feel-out">50%</output><input id="mc-feel" type="range" min="0" max="100" step="5" value="50"></label>
      <button class="mc-button" type="button" id="mc-hide">Hide the paragraph and test me</button>
    </div>
    <div class="mc-check-step" data-step="quiz" hidden>
      <h3>From the paragraph, why do air molecules scatter blue light more than red?</h3>
      <div class="mc-options" role="group" aria-label="Answer options">
        <button type="button" data-correct="false" aria-pressed="false">Blue light carries more energy, so it bounces off molecules harder.</button>
        <button type="button" data-correct="true" aria-pressed="false">It does not say. It states that they do, without the reason.</button>
        <button type="button" data-correct="false" aria-pressed="false">Red light is absorbed by the air before it can scatter.</button>
      </div>
    </div>
    <p class="mc-read" id="mc-check-read" aria-live="polite"></p>
  </div>
  <p class="mc-prose">Reflective thought starts with being puzzled and needs time with judgement suspended. An instant, confident answer can skip both steps (Singh et al., 2025).</p>
</section>

<section class="mc-part" id="calibrate" aria-labelledby="mc-cal-title">
  <header class="mc-head"><h2 id="mc-cal-title">Confidence is a prediction I can score</h2><p>“I’m 80% sure” is a claim about my own accuracy. In 2 experiments, 5 rounds of prediction with feedback were enough to improve it.</p></header>
  <div class="mc-cal">
    <div class="mc-panel">
      <p class="mc-cal-count" id="mc-cal-count">Claim 1 of 5</p>
      <p class="mc-cal-claim" id="mc-cal-claim">Sunlight takes about 8 minutes to reach Earth.</p>
      <div class="mc-cal-answer" role="group" aria-label="Your answer"><button type="button" data-answer="true" aria-pressed="false">True</button><button type="button" data-answer="false" aria-pressed="false">False</button></div>
      <label class="mc-range" for="mc-cal-conf">How sure are you? <output id="mc-cal-conf-out">70%</output><input id="mc-cal-conf" type="range" min="50" max="100" step="5" value="70"></label>
      <button class="mc-button" type="button" id="mc-cal-submit" disabled>Lock in my answer</button>
      <p class="mc-read" id="mc-cal-feedback" aria-live="polite"></p>
    </div>
    <figure class="mc-panel mc-cal-chart">
      <svg id="mc-cal-svg" viewBox="0 0 320 240" role="img" aria-label="Your confidence on each claim against your hit rate"></svg>
      <figcaption id="mc-cal-summary" aria-live="polite">Your average confidence and hit rate appear here after each claim.</figcaption>
    </figure>
  </div>
  <p class="mc-cite">Ngai and Gilbert (2026) found that 5 practice rounds pairing a prediction with feedback improved calibration. Predictions without feedback did not.</p>
</section>

<section class="mc-part" id="arbitrate" aria-labelledby="mc-arb-title">
  <header class="mc-head"><h2 id="mc-arb-title">I weigh my confidence against the machine’s</h2><p>A confident tone raises trust even when the answer is wrong. So I need to know whether its confidence tracks its accuracy.</p></header>
  <div class="mc-panel">
    <div class="mc-arb-controls">
      <div class="mc-toggle" role="group" aria-label="Which assistant"><button type="button" data-ai="tracks" aria-pressed="true">Confidence tracks accuracy</button><button type="button" data-ai="flat" aria-pressed="false">Always says 95%</button></div>
      <label class="mc-range" for="mc-arb-th">Accept its answer when it says at least <output id="mc-arb-th-out">80%</output><input id="mc-arb-th" type="range" min="50" max="100" step="5" value="80"></label>
    </div>
    <div class="mc-arb-grid" id="mc-arb-grid" role="img" aria-label="20 answers"></div>
    <p class="mc-legend">✓ right · ✗ wrong · filled means I accepted it · dashed means I checked it myself</p>
    <dl class="mc-arb-stats"><div><dt>Wrong answers accepted</dt><dd id="mc-arb-wrong">1</dd></div><div><dt>Answers I checked</dt><dd id="mc-arb-checked">6</dd></div><div><dt>Right answers accepted</dt><dd id="mc-arb-right">13</dd></div></dl>
    <p class="mc-read" id="mc-arb-read" aria-live="polite"></p>
    <p class="mc-note">Illustrative data: 20 answers, 14 of them right, from 2 made-up assistants with the same accuracy.</p>
  </div>
  <figure class="mc-figure mc-bars">
    <figcaption><b>How often students accepted wrong ChatGPT advice</b><span>342 undergraduates on reasoning and evaluation tasks.</span></figcaption>
    <div class="mc-bar" style="--v:62.4"><span>Open ChatGPT support</span><i></i><b>62.4%</b></div>
    <div class="mc-bar" style="--v:39.7"><span>Same support with a brief reflection prompt</span><i></i><b>39.7%</b></div>
    <p class="mc-cite">Ren (2026). Reflection made students more selective, and they kept taking the advice that was right.</p>
  </figure>
  <p class="mc-prose">In a survey of 319 knowledge workers, people with more confidence in generative AI reported less critical thinking (Lee et al., CHI 2025). Doyeon Lee and colleagues argue in PNAS Nexus that assistants should report more than confidence. They should say how well that confidence has tracked accuracy before. Pairs who share their confidence can decide better than either person alone (Bahrami et al., Science 2010).</p>
</section>

<section class="mc-part" id="friction" aria-labelledby="mc-fr-title">
  <header class="mc-head"><h2 id="mc-fr-title">Put the pause where bias gets in</h2><p>Bias enters twice: in how I ask, and in how I accept the answer. A small, deliberate pause at each point gives my judgement time to arrive.</p></header>
  <ol class="mc-pipe" aria-label="Two pauses between a question and a decision">
    <li class="mc-pipe-node">I frame a question</li>
    <li class="mc-gate"><b>Pause 1</b><small>Is my prompt leading?</small></li>
    <li class="mc-pipe-node">The AI answers</li>
    <li class="mc-gate"><b>Pause 2</b><small>What would make this wrong?</small></li>
    <li class="mc-pipe-node">I decide</li>
  </ol>
  <h3 class="mc-subhead">Turn a leading prompt into a fair one</h3>
  <p class="mc-note">Press a prompt to rewrite it.</p>
  <div class="mc-prompts" id="mc-prompts">
    <button type="button" aria-pressed="false"><span><small>Leading</small>Explain why remote work boosts productivity.</span><span><small>Fair</small>What does the evidence say about remote work and productivity, for and against?</span></button>
    <button type="button" aria-pressed="false"><span><small>Leading</small>Write a summary that proves my design is the best option.</span><span><small>Fair</small>Compare my design with 2 alternatives. Where does mine lose?</span></button>
    <button type="button" aria-pressed="false"><span><small>Leading</small>Confirm that this bug comes from the cache.</span><span><small>Fair</small>List 3 plausible causes of this bug and a test that separates them.</span></button>
  </div>
  <h3 class="mc-subhead">Answer first, then ask</h3>
  <ol class="mc-order">
    <li><b>Think</b><small>Work the problem alone first.</small></li>
    <li><b>Answer</b><small>Write down my answer and how sure I am.</small></li>
    <li><b>Ask</b><small>Ask pointed questions without revealing my answer.</small></li>
    <li><b>Critique</b><small>Give it my answer and ask where it fails.</small></li>
  </ol>
  <p class="mc-cite">The two pauses follow Lim’s DeBiasMe work (2025). The answer-first order is Michael Gerlich’s advice, reported in the APA Monitor, to stop an early AI answer anchoring my own.</p>
</section>

<section class="mc-part" id="offload" aria-labelledby="mc-off-title">
  <header class="mc-head"><h2 id="mc-off-title">Decide what to hand over</h2><p>Some tasks only need doing. Others are how I build a skill. Handing those over can cost me the skill before I notice.</p></header>
  <p class="mc-note">Choose for each task. My own choice appears beside yours.</p>
  <div class="mc-sort" id="mc-sort"></div>
  <figure class="mc-figure mc-decay">
    <figcaption><b>Detection rate on colonoscopies done without AI</b><span>Endoscopists in Poland, before and after AI arrived in their clinics.</span></figcaption>
    <div class="mc-decay-bars">
      <div style="--v:28.4"><b>28.4%</b><i></i><span>Before</span></div>
      <div class="mc-decay-after" style="--v:22.4"><b>22.4%</b><i></i><span>3 months after</span></div>
    </div>
    <p class="mc-cite">Budzyń et al. (2025), reported in the APA Monitor. The skill being measured is the one the tool had been doing.</p>
  </figure>
  <p class="mc-prose">In a field experiment with 250 employees, ChatGPT access raised rated creativity most for people strong in metacognition (Sun et al., Journal of Applied Psychology, 2025). Mutlu Cukurova suggests sorting each person’s tasks the same way: work that only needs completing, and work that builds essential learning.</p>
</section>

<section class="mc-part" id="practice" aria-labelledby="mc-pr-title">
  <header class="mc-head"><h2 id="mc-pr-title">A 5-minute loop around each AI task</h2><p>Attention can be trained. Clear goals, quick feedback, and a task just beyond my current skill keep the practice honest.</p></header>
  <div class="mc-rhythm">
    <article><span>Before · 1 minute</span><h3>Predict</h3><p>Write my answer or plan, and a number for how sure I am.</p></article>
    <article><span>During · 2 minutes</span><h3>Check</h3><p>Explain one step back without looking. Trace one claim to its source.</p></article>
    <article><span>After · 2 minutes</span><h3>Score</h3><p>Compare my prediction with the result. Note one place my confidence was off.</p></article>
  </div>
  <div class="mc-lead">
    <h3>When I lead a team</h3>
    <ul>
      <li><b>Direct attention with purpose.</b> Say why we use AI on this task and which skills we want to keep.</li>
      <li><b>Model conscious use.</b> Show my own answer-first habit, including the times the tool was right and I was wrong.</li>
      <li><b>Make room for reflection.</b> Ask what people noticed about their own thinking. Keep “I don’t know” safe to say.</li>
    </ul>
    <p class="mc-cite">The 3 moves come from Hyper Island. The practice conditions follow A Human Edge’s account of flow.</p>
  </div>
  <p class="mc-rule">My rule: before I ask, I write my answer and a number for how sure I am. Afterwards I check one claim and score the guess.</p>
</section>

<section class="mc-part mc-sources" id="sources" aria-labelledby="mc-src-title">
  <header class="mc-head"><h2 id="mc-src-title">Sources</h2></header>
  <h3>Guides and articles</h3>
  <ol>
    <li>Hyper Island (2026). <a href="https://hyperisland.com/en/blog/emerging-tech-transformation/metacognition-the-essential-ai-leadership-skill-for-2026">Metacognition: the essential AI leadership skill for 2026</a>.</li>
    <li>CSIRO Collaborative Intelligence (IEEE CAI 2024). <a href="https://research.csiro.au/cintel/projects/projects/skills-for-collaborative-intelligence/the-importance-of-metacognitive-thinking-in-an-artificial-intelligence-ai-enabled-workforce/">The importance of metacognitive thinking in an AI-enabled workforce</a>.</li>
    <li>Singh, Taneja, Guan and Ghosh (CHI 2025 Tools for Thought workshop). <a href="https://arxiv.org/abs/2502.12447">Protecting human cognition in the age of AI</a>.</li>
    <li>A Human Edge. <a href="https://www.ahumanedge.com/post/human-capability-ai-era">Human capability in the AI era</a>.</li>
    <li>Mason, Sidra, Reeson and Paris (2023). <a href="https://www.timeshighereducation.com/campus/collaborating-artificial-intelligence-use-your-metacognitive-skills">Collaborating with artificial intelligence? Use your metacognitive skills</a>. Times Higher Education.</li>
    <li>Lee, Pruitt, Zhou, Du and Odegaard (PNAS Nexus 2025). <a href="https://academic.oup.com/pnasnexus/article/4/5/pgaf133/8118889">Metacognitive sensitivity: the key to calibrating trust and optimal decision making with AI</a>.</li>
    <li>Abrams (2026). <a href="https://www.apa.org/monitor/2026/07-08/ai-job-skills-thinking">How AI is reshaping human skills and thinking</a>. Monitor on Psychology 57(5).</li>
    <li>Lim (AIREASONING-2025 workshop). <a href="https://arxiv.org/abs/2504.16770">DeBiasMe: de-biasing human-AI interactions with metacognitive AIED interventions</a>.</li>
    <li>edtechdev AIED wiki. <a href="https://edtechdev.github.io/aied/concepts/metacognition/">Metacognition</a>.</li>
  </ol>
  <h3>Studies behind the numbers</h3>
  <ol>
    <li>Kosmyna et al. (2025). <a href="https://arxiv.org/abs/2506.08872">Your brain on ChatGPT: accumulation of cognitive debt when using an AI assistant for essay writing task</a>. Preprint.</li>
    <li>Ngai and Gilbert (Cognitive Research: Principles and Implications 2026). <a href="https://doi.org/10.1186/s41235-026-00714-0">Metacognitive training facilitates optimal cognitive offloading</a>.</li>
    <li>Ren (Frontiers in Psychology 2026). <a href="https://doi.org/10.3389/fpsyg.2026.1926110">College students’ metacognitive awareness of generative-AI reliance</a>.</li>
    <li>Budzyń et al. (Lancet Gastroenterology &amp; Hepatology 2025). <a href="BUDZYN_DOI_URL">Endoscopist deskilling risk after exposure to artificial intelligence in colonoscopy</a>.</li>
    <li>Sun, Li, Foo, Zhou and Lu (Journal of Applied Psychology 2025). <a href="https://doi.org/10.1037/apl0001296">How and for whom using generative AI affects creativity: a field experiment</a>.</li>
    <li>Lee et al. (CHI 2025). <a href="https://doi.org/10.1145/3706598.3713778">The impact of generative AI on critical thinking</a>.</li>
    <li>Bahrami et al. (Science 2010). <a href="https://doi.org/10.1126/science.1185718">Optimally interacting minds</a>.</li>
  </ol>
</section>
```

`BUDZYN_DOI_URL` is resolved in Step 3 below before the first build; it is the only value not yet confirmed.

- [ ] **Step 3: Resolve the one unconfirmed link**

Run: `curl -sI https://doi.org/10.1016/S2468-1253\(25\)00133-5 | grep -i '^location'` and the same for `S2468-1253(25)00289-4`.
Use whichever DOI's landing page is titled "Endoscopist deskilling risk after exposure to artificial intelligence in colonoscopy", as `https://doi.org/<doi>`, in place of `BUDZYN_DOI_URL`.

- [ ] **Step 4: Write the stylesheet**

```css file=css/metacognition.css
/* Metacognition: a field guide for thinking alongside AI. Dark is the default theme. */
.metacognition{--mc-orchid:#c48ee0;--mc-teal:#5fc2b5;--mc-amber:#e6b65d;--mc-red:#e18177;--mc-panel:color-mix(in srgb,var(--bg) 70%,var(--surface));--mc-soft:color-mix(in srgb,var(--mc-orchid) 9%,var(--mc-panel))}
html[data-theme="light"] .metacognition{--mc-orchid:#6b278e;--mc-teal:#1d7a6f;--mc-amber:#8e610e;--mc-red:#a8422c;--mc-panel:#fff}
body:has(.metacognition) #pointcloud-bg,body:has(.metacognition) .shape-toggle-btn{display:none!important}
.metacognition .page-content{max-width:68rem!important}
.metacognition .page-content>*,.metacognition .page-content section{box-sizing:border-box}

.mc-progress{position:fixed;inset:0 0 auto;z-index:70;height:3px;pointer-events:none}
.mc-progress span{display:block;width:0;height:100%;background:linear-gradient(90deg,var(--mc-teal),var(--mc-orchid),var(--mc-amber))}
.mc-rail{position:sticky;top:3.9rem;z-index:20;display:grid;grid-template-columns:repeat(8,1fr);margin:0 auto 1.2rem;padding:.28rem;border:1px solid var(--line);border-radius:999px;background:color-mix(in srgb,var(--surface) 92%,transparent);backdrop-filter:blur(16px)}
.mc-rail a{padding:.58rem .3rem;border-radius:999px;color:var(--muted);font:650 .72rem/1 "Space Grotesk",sans-serif;text-align:center;text-decoration:none}
.mc-rail a:hover{color:var(--text)}
.mc-rail a.is-current{background:var(--text);color:var(--bg)}

.mc-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:clamp(1.5rem,4vw,3.5rem);align-items:center;min-height:min(680px,78vh);margin:0 0 3rem;padding:clamp(1.5rem,4vw,3rem);border:1px solid var(--line);border-radius:2rem;background:radial-gradient(circle at 80% 20%,color-mix(in srgb,var(--mc-orchid) 14%,transparent),transparent 45%),var(--surface)}
.mc-hero h1{margin:0;color:var(--text);font:700 clamp(2.4rem,5.6vw,4.6rem)/.98 "Space Grotesk",sans-serif;letter-spacing:-.06em}
.mc-hero h1 i{display:block;margin-top:.15em;color:var(--mc-orchid);font-family:Georgia,serif;font-weight:400}
.mc-hero-copy p{max-width:36rem;margin:1.2rem 0 0;color:var(--muted);font-size:clamp(1rem,1.6vw,1.15rem);line-height:1.65}
.mc-hero-copy .mc-hero-tie{color:var(--text)}
.mc-scroll{grid-column:1/-1;justify-self:start;color:var(--muted);font:650 .78rem "Space Grotesk",sans-serif;text-decoration:none}
.mc-scroll:hover{color:var(--text)}
.mc-loop{margin:0}
.mc-loop svg{display:block;width:100%;height:auto}
.mc-loop figcaption{margin-top:.6rem;color:var(--muted);font-size:.82rem;text-align:center}
.mc-band{fill:var(--mc-panel);stroke:var(--line);stroke-width:1.2}
.mc-band-meta{stroke:color-mix(in srgb,var(--mc-orchid) 55%,var(--line))}
.mc-band-label{fill:var(--muted);font:650 11px "Space Grotesk",sans-serif;letter-spacing:.1em}
.mc-node{fill:var(--mc-panel);stroke:var(--mc-teal);stroke-width:2}
.mc-node-text{fill:var(--text);font:600 13px "Manrope",sans-serif;text-anchor:middle}
.mc-flow{fill:none;stroke:var(--mc-teal);stroke-width:2;stroke-dasharray:6 6}
.mc-pulse{fill:var(--mc-teal)}
.mc-ai{fill:color-mix(in srgb,var(--mc-amber) 14%,var(--mc-panel));stroke:var(--mc-amber);stroke-width:1.6}
.mc-ai-feed{fill:none;stroke:var(--mc-amber);stroke-width:2;stroke-dasharray:3 7;animation:mcFeed .9s linear infinite}
.mc-gauge{fill:none;stroke:var(--line);stroke-width:10;stroke-linecap:round}
.mc-gauge-fill{fill:none;stroke:var(--mc-orchid);stroke-width:10;stroke-linecap:round;stroke-dasharray:164;stroke-dashoffset:150;animation:mcGauge 6s ease-in-out infinite}
.mc-chip rect{fill:var(--mc-panel);stroke:var(--line);stroke-width:1.2;animation:mcChip 6s infinite}
.mc-chip-check rect{animation-delay:2s}
.mc-chip-ask rect{animation-delay:4s}
.mc-chip text{fill:var(--text);font:650 12px "Space Grotesk",sans-serif;text-anchor:middle}
.mc-arrow{fill:none;stroke:var(--mc-orchid);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.mc-arrow-label{fill:var(--mc-orchid);font:650 11px "Space Grotesk",sans-serif;letter-spacing:.06em}
@keyframes mcFeed{to{stroke-dashoffset:-10}}
@keyframes mcGauge{0%,100%{stroke-dashoffset:150}40%{stroke-dashoffset:40}70%{stroke-dashoffset:95}}
@keyframes mcChip{0%,28%{stroke:var(--mc-orchid);fill:color-mix(in srgb,var(--mc-orchid) 18%,var(--mc-panel))}34%,100%{stroke:var(--line);fill:var(--mc-panel)}}

.mc-part{scroll-margin-top:7rem;margin:0 0 5rem;padding:4rem clamp(0rem,3vw,2rem) 0;border-top:1px solid var(--line)}
.mc-head{max-width:46rem;margin-bottom:2rem}
.mc-head h2{margin:0;color:var(--text);font:650 clamp(2rem,4vw,3.4rem)/1.02 "Space Grotesk",sans-serif;letter-spacing:-.05em}
.mc-head p{max-width:62ch;margin:.9rem 0 0;color:var(--muted);font-size:1.08rem;line-height:1.7}
.mc-part h3{margin:0 0 .5rem;color:var(--text);font:650 1.1rem/1.3 "Space Grotesk",sans-serif}
.mc-part .mc-subhead{margin:2.5rem 0 .8rem;font-size:1.3rem}
.mc-part a{color:var(--text);text-decoration:underline;text-decoration-color:var(--accent);text-underline-offset:.18em}
.mc-prose{max-width:62ch;margin:1.6rem 0 0;color:var(--muted);line-height:1.75}
.mc-cite{margin:.9rem 0 0;color:var(--muted);font-size:.8rem;line-height:1.55}
.mc-note,.mc-legend{margin:.6rem 0 0;color:var(--muted);font-size:.8rem}
.mc-read{min-height:1.5em;margin:1rem 0 0;color:var(--text);line-height:1.65}
.mc-panel,.mc-figure{margin:0;padding:clamp(1rem,2.5vw,1.6rem);border:1px solid var(--line);border-radius:1.2rem;background:var(--mc-panel)}
.mc-button{padding:.78rem 1.15rem;border:0;border-radius:999px;background:var(--text);color:var(--bg);font:700 .78rem "Space Grotesk",sans-serif;cursor:pointer}
.mc-button:disabled{opacity:.45;cursor:default}
.mc-range{display:grid;grid-template-columns:1fr auto;gap:.4rem;align-items:center;margin:0 0 1rem;color:var(--muted);font-size:.86rem;font-weight:600}
.mc-range output{color:var(--text);font-variant-numeric:tabular-nums}
.mc-range input{grid-column:1/-1;width:100%;margin:0;accent-color:var(--mc-orchid)}

.mc-split{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
.mc-card{padding:1.3rem;border:1px solid var(--line);border-radius:1.1rem;background:var(--mc-panel)}
.mc-card p{margin:0;color:var(--muted);line-height:1.6}
.mc-card small{display:block;margin-top:.8rem;color:var(--mc-orchid);font-size:.9rem;font-style:italic}
.mc-phases,.mc-toggle{display:inline-grid;grid-auto-flow:column;gap:.3rem;padding:.3rem;border:1px solid var(--border-ui);border-radius:999px}
.mc-phases{margin:2rem 0 .8rem}
.mc-phases button,.mc-toggle button{padding:.55rem 1rem;border:0;border-radius:999px;background:transparent;color:var(--muted);font:650 .8rem "Space Grotesk",sans-serif;cursor:pointer}
.mc-phases button[aria-pressed="true"],.mc-toggle button[aria-pressed="true"]{background:var(--text);color:var(--bg)}
.mc-phase-track{position:relative;max-width:30rem;height:4px;border-radius:4px;background:var(--line)}
.mc-phase-track i{position:absolute;inset:0 auto 0 0;width:33.34%;border-radius:4px;background:var(--mc-orchid);transform:translateX(calc(var(--at,0) * 100%));transition:transform .35s ease}
.mc-phase-read{margin-top:1rem}
.mc-phase-read ul{display:grid;gap:.5rem;margin:0;padding:0;list-style:none}
.mc-phase-read li{padding:.75rem 1rem;border:1px solid var(--line);border-radius:.8rem;background:var(--mc-panel);color:var(--text)}
.mc-stakes{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.8rem}
.mc-stakes article{padding:1.1rem;border-top:3px solid var(--mc-amber);border-radius:.9rem;background:var(--mc-soft)}
.mc-stakes p{margin:0;color:var(--muted);font-size:.9rem;line-height:1.55}

.mc-figure figcaption{display:grid;gap:.25rem;margin-bottom:1.1rem}
.mc-figure figcaption b{color:var(--text);font:650 1.05rem "Space Grotesk",sans-serif}
.mc-figure figcaption span{color:var(--muted);font-size:.86rem}
.mc-people{display:grid;gap:.85rem}
.mc-people-row{display:grid;grid-template-columns:9.5rem minmax(0,1fr) 4.5rem;gap:.8rem;align-items:center}
.mc-people-row>span{color:var(--text);font-size:.88rem}
.mc-people-row>b{color:var(--text);font:650 .9rem "Space Grotesk",sans-serif;text-align:right}
.mc-dots{display:grid;grid-template-columns:repeat(18,minmax(0,1fr));gap:.3rem}
.mc-dots i{aspect-ratio:1;border:1.5px solid var(--mc-red);border-radius:50%;transition:background .4s ease calc(var(--i) * 60ms)}
.mc-people.is-shown .mc-dots i.is-miss{background:var(--mc-red)}
.mc-check{margin-top:2rem}
.mc-check-text{max-width:62ch;margin:.6rem 0 1.2rem;color:var(--text);font-size:1.02rem;line-height:1.75}
.mc-options{display:grid;gap:.5rem;margin-top:.8rem}
.mc-options button,.mc-cal-answer button{padding:.85rem 1rem;border:1px solid var(--border-ui);border-radius:.8rem;background:transparent;color:var(--text);font:inherit;text-align:left;cursor:pointer}
.mc-options button[aria-pressed="true"],.mc-cal-answer button[aria-pressed="true"]{border-color:var(--mc-orchid);background:var(--mc-soft)}
.mc-options button:disabled,.mc-cal-answer button:disabled{cursor:default}

.mc-cal{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:1rem;align-items:stretch}
.mc-cal-count{margin:0;color:var(--muted);font-size:.82rem}
.mc-cal-claim{margin:.5rem 0 1rem;color:var(--text);font:600 clamp(1.1rem,2vw,1.35rem)/1.4 "Space Grotesk",sans-serif}
.mc-cal-answer{display:flex;gap:.5rem;margin-bottom:1rem}
.mc-cal-answer button{flex:1;text-align:center;font:650 .9rem "Space Grotesk",sans-serif}
.mc-cal-chart svg{display:block;width:100%;height:auto}
.mc-cal-chart figcaption{margin-top:.6rem;color:var(--text);font-size:.9rem;line-height:1.55}
.mc-axis{stroke:var(--line);stroke-width:1}
.mc-axis-text{fill:var(--muted);font:500 10px "Space Grotesk",sans-serif}
.mc-conf-line{stroke:var(--mc-orchid);stroke-width:2;stroke-dasharray:5 4}
.mc-hit-line{stroke:var(--mc-teal);stroke-width:2}
.mc-gap{fill:color-mix(in srgb,var(--mc-red) 18%,transparent)}
.mc-dot-right{fill:var(--mc-teal)}
.mc-dot-wrong{fill:var(--mc-panel);stroke:var(--mc-red);stroke-width:2}
.mc-line-text{font:650 10px "Space Grotesk",sans-serif;text-anchor:end}
.mc-line-text.is-conf{fill:var(--mc-orchid)}
.mc-line-text.is-hit{fill:var(--mc-teal)}

.mc-arb-controls{display:grid;grid-template-columns:auto minmax(14rem,1fr);gap:1rem 2rem;align-items:end;margin-bottom:1.2rem}
.mc-arb-grid{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:.45rem}
.mc-cell{display:grid;place-items:center;aspect-ratio:1;border:1.5px dashed var(--border-ui);border-radius:.6rem;color:var(--muted);font:650 .72rem "Space Grotesk",sans-serif;font-variant-numeric:tabular-nums}
.mc-cell.is-accepted{border-style:solid;color:var(--text)}
.mc-cell.is-accepted.is-right{border-color:var(--mc-teal);background:color-mix(in srgb,var(--mc-teal) 18%,transparent)}
.mc-cell.is-accepted.is-wrong{border-color:var(--mc-red);background:color-mix(in srgb,var(--mc-red) 26%,transparent)}
.mc-arb-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem;margin:1.2rem 0 0}
.mc-arb-stats div{padding:.9rem;border:1px solid var(--line);border-radius:.9rem}
.mc-arb-stats dt{color:var(--muted);font-size:.8rem}
.mc-arb-stats dd{margin:.3rem 0 0;color:var(--text);font:700 1.8rem "Space Grotesk",sans-serif;font-variant-numeric:tabular-nums}
.mc-bars{margin-top:2rem}
.mc-bar{display:grid;grid-template-columns:minmax(10rem,16rem) minmax(0,1fr) 4rem;gap:.8rem;align-items:center;margin-top:.7rem}
.mc-bar span{color:var(--text);font-size:.88rem}
.mc-bar i{display:block;height:1.2rem;border-radius:.4rem;background:linear-gradient(90deg,var(--mc-red) calc(var(--v) * 1%),var(--line) 0)}
.mc-bar b{color:var(--text);font:650 .95rem "Space Grotesk",sans-serif;text-align:right}

.mc-pipe{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.5rem;align-items:center;margin:0 0 1rem;padding:0;list-style:none}
.mc-pipe-node{padding:1rem .8rem;border:1px solid var(--line);border-radius:.9rem;background:var(--mc-panel);color:var(--text);font:600 .9rem "Space Grotesk",sans-serif;text-align:center}
.mc-gate{display:grid;gap:.2rem;padding:.8rem;border:1.5px dashed var(--mc-amber);border-radius:999px;text-align:center}
.mc-gate b{color:var(--mc-amber);font:700 .78rem "Space Grotesk",sans-serif}
.mc-gate small{color:var(--muted);font-size:.78rem}
.mc-prompts{display:grid;gap:.6rem;margin-top:.8rem}
.mc-prompts button{display:grid;padding:1rem 1.1rem;border:1px solid var(--border-ui);border-radius:1rem;background:var(--mc-panel);color:var(--text);font:inherit;text-align:left;cursor:pointer}
.mc-prompts button>span{grid-area:1/1;transition:opacity .3s ease}
.mc-prompts button>span:last-child{opacity:0}
.mc-prompts button[aria-pressed="true"]>span:first-child{opacity:0}
.mc-prompts button[aria-pressed="true"]>span:last-child{opacity:1}
.mc-prompts small{display:block;margin-bottom:.3rem;color:var(--mc-amber);font:650 .72rem "Space Grotesk",sans-serif}
.mc-prompts span:last-child small{color:var(--mc-teal)}
.mc-order{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.6rem;margin:0;padding:0;list-style:none}
.mc-order li{padding:1rem;border:1px solid var(--line);border-radius:.9rem;background:var(--mc-soft)}
.mc-order b{display:block;color:var(--text);font:650 1rem "Space Grotesk",sans-serif}
.mc-order small{color:var(--muted);font-size:.85rem;line-height:1.5}

.mc-sort{display:grid;gap:.6rem;margin-top:.8rem}
.mc-task{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.6rem 1rem;align-items:center;padding:1rem 1.1rem;border:1px solid var(--line);border-radius:1rem;background:var(--mc-panel)}
.mc-task>p{margin:0;color:var(--text);font-weight:600}
.mc-choice{display:inline-flex;flex-wrap:wrap;gap:.3rem}
.mc-choice button{padding:.45rem .75rem;border:1px solid var(--border-ui);border-radius:999px;background:transparent;color:var(--muted);font:650 .75rem "Space Grotesk",sans-serif;cursor:pointer}
.mc-choice button[aria-pressed="true"]{border-color:var(--mc-orchid);background:var(--mc-orchid);color:var(--bg)}
.mc-task output{grid-column:1/-1;color:var(--muted);font-size:.88rem;line-height:1.55}
.mc-task output:empty{display:none}
.mc-decay{margin-top:2rem}
.mc-decay-bars{display:flex;gap:2rem;align-items:flex-end;height:13rem;padding:0 1rem;border-bottom:1px solid var(--line)}
.mc-decay-bars>div{display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:.35rem;width:6rem;height:100%}
.mc-decay-bars i{display:block;width:100%;height:calc(var(--v) * 2.4%);border-radius:.5rem .5rem 0 0;background:var(--mc-teal)}
.mc-decay-after i{background:var(--mc-red)}
.mc-decay-bars b{color:var(--text);font:650 .95rem "Space Grotesk",sans-serif}
.mc-decay-bars span{color:var(--muted);font-size:.8rem;text-align:center}

.mc-rhythm{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem}
.mc-rhythm article{padding:1.2rem;border:1px solid var(--line);border-radius:1rem;background:var(--mc-panel)}
.mc-rhythm span{color:var(--mc-orchid);font:650 .78rem "Space Grotesk",sans-serif}
.mc-rhythm p{margin:0;color:var(--muted);line-height:1.6}
.mc-lead{margin-top:2rem;padding:1.4rem;border-radius:1.2rem;background:var(--mc-soft)}
.mc-lead ul{display:grid;gap:.7rem;margin:.6rem 0 0;padding-left:1.1rem;color:var(--muted);line-height:1.6}
.mc-lead b{color:var(--text)}
.mc-rule{max-width:44rem;margin:2.5rem 0 0;color:var(--text);font:600 clamp(1.15rem,2.3vw,1.5rem)/1.45 "Space Grotesk",sans-serif}
.mc-sources ol{display:grid;gap:.6rem;margin:0 0 2rem;padding-left:1.2rem;color:var(--muted);font-size:.9rem;line-height:1.6}

@media(max-width:900px){.mc-hero,.mc-cal,.mc-arb-controls{grid-template-columns:1fr}.mc-hero{min-height:0}.mc-stakes{grid-template-columns:repeat(2,minmax(0,1fr))}.mc-pipe{grid-template-columns:1fr}.mc-order{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){.mc-rail{position:relative;top:auto;grid-template-columns:repeat(4,1fr);border-radius:1rem}}
@media(max-width:560px){.mc-split,.mc-stakes,.mc-rhythm,.mc-order,.mc-arb-stats{grid-template-columns:1fr}.mc-people-row{grid-template-columns:1fr auto}.mc-people-row .mc-dots{grid-column:1/-1;grid-row:2}.mc-arb-grid{grid-template-columns:repeat(5,minmax(0,1fr))}.mc-task{grid-template-columns:1fr}.mc-bar{grid-template-columns:1fr auto}.mc-bar i{grid-column:1/-1;grid-row:2}.mc-phases,.mc-toggle{display:grid;grid-auto-flow:row;border-radius:1rem}}
@media(prefers-reduced-motion:reduce){.mc-ai-feed,.mc-gauge-fill,.mc-chip rect{animation:none}.mc-gauge-fill{stroke-dashoffset:70}.mc-dots i,.mc-phase-track i,.mc-prompts button>span{transition:none}}
```

- [ ] **Step 5: Append the DOM half to the component**

Insert this block in `js/components/metacognition.js` directly before the final `}());`, after the `if (typeof document === 'undefined') return;` line:

```js insert=js/components/metacognition.js
  if (!document.querySelector('.mc-hero')) return;

  var $ = function (id) { return document.getElementById(id); };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVG = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, text) {
    var node = document.createElementNS(SVG, tag);
    Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text) node.textContent = text;
    return node;
  }
  function press(buttons, active) {
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === active)); });
  }
  function bindRange(input, output, onChange) {
    function update() { output.textContent = input.value + '%'; if (onChange) onChange(+input.value); }
    input.addEventListener('input', update);
    update();
  }

  function initProgress() {
    var fill = $('mc-progress-fill');
    var links = Array.prototype.slice.call(document.querySelectorAll('.mc-rail a'));
    var sections = links.map(function (link) { return document.querySelector(link.getAttribute('href')); });
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (fill) fill.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
      var active = -1;
      sections.forEach(function (section, i) { if (section && section.getBoundingClientRect().top < window.innerHeight * 0.45) active = i; });
      links.forEach(function (link, i) { link.classList.toggle('is-current', i === active); });
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function initHero() {
    var svg = document.querySelector('.mc-loop svg');
    if (svg && reduced && svg.pauseAnimations) svg.pauseAnimations();
  }

  function initPhases() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.mc-phases button'));
    var read = $('mc-phase-read'), track = document.querySelector('.mc-phase-track');
    function show(button) {
      var phase = PHASES[button.dataset.phase];
      press(buttons, button);
      track.style.setProperty('--at', buttons.indexOf(button));
      read.textContent = '';
      var title = document.createElement('h3'); title.textContent = phase.title;
      var list = document.createElement('ul');
      phase.questions.forEach(function (q) { var li = document.createElement('li'); li.textContent = q; list.appendChild(li); });
      read.appendChild(title); read.appendChild(list);
    }
    buttons.forEach(function (b) { b.addEventListener('click', function () { show(b); }); });
    show(buttons[0]);
  }

  function initPeople() {
    var host = $('mc-people');
    Array.prototype.forEach.call(host.querySelectorAll('.mc-people-row'), function (row) {
      var dots = row.querySelector('.mc-dots'), miss = +row.dataset.miss;
      for (var i = 0; i < 18; i++) {
        var dot = document.createElement('i');
        dot.style.setProperty('--i', i);
        if (i < miss) dot.className = 'is-miss';
        dots.appendChild(dot);
      }
    });
    if (reduced || !('IntersectionObserver' in window)) { host.classList.add('is-shown'); return; }
    var seen = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      host.classList.add('is-shown');
      seen.disconnect();
    }, { threshold: 0.4 });
    seen.observe(host);
  }

  function initCheck() {
    var feel = $('mc-feel'), readStep = document.querySelector('.mc-check-step[data-step="read"]');
    var quizStep = document.querySelector('.mc-check-step[data-step="quiz"]');
    var options = Array.prototype.slice.call(quizStep.querySelectorAll('button'));
    bindRange(feel, $('mc-feel-out'));
    $('mc-hide').addEventListener('click', function () {
      readStep.hidden = true;
      quizStep.hidden = false;
      options[0].focus();
    });
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        press(options, option);
        options.forEach(function (b) { b.disabled = true; });
        $('mc-check-read').textContent = checkReply(+feel.value, option.dataset.correct === 'true');
      });
    });
  }

  function drawCalibration(svg, rounds) {
    svg.textContent = '';
    var L = 40, R = 300, T = 20, B = 200;
    var y = function (pct) { return B - pct / 100 * (B - T); };
    [0, 50, 100].forEach(function (pct) {
      svg.appendChild(svgEl('line', { x1: L, x2: R, y1: y(pct), y2: y(pct), class: 'mc-axis' }));
      svg.appendChild(svgEl('text', { x: L - 6, y: y(pct) + 3, 'text-anchor': 'end', class: 'mc-axis-text' }, pct + '%'));
    });
    for (var i = 0; i < CLAIMS.length; i++) {
      svg.appendChild(svgEl('text', { x: L + (i + 0.5) * 52, y: B + 18, 'text-anchor': 'middle', class: 'mc-axis-text' }, 'claim ' + (i + 1)));
    }
    if (!rounds.length) return;
    var s = summarise(rounds);
    var top = Math.min(y(s.meanConfidence), y(s.hitRate)), bottom = Math.max(y(s.meanConfidence), y(s.hitRate));
    svg.appendChild(svgEl('rect', { x: L, y: top, width: R - L, height: Math.max(0, bottom - top), class: 'mc-gap' }));
    svg.appendChild(svgEl('line', { x1: L, x2: R, y1: y(s.meanConfidence), y2: y(s.meanConfidence), class: 'mc-conf-line' }));
    svg.appendChild(svgEl('line', { x1: L, x2: R, y1: y(s.hitRate), y2: y(s.hitRate), class: 'mc-hit-line' }));
    svg.appendChild(svgEl('text', { x: R, y: y(s.meanConfidence) - 5, class: 'mc-line-text is-conf' }, 'said ' + s.meanConfidence + '%'));
    svg.appendChild(svgEl('text', { x: R, y: y(s.hitRate) + 13, class: 'mc-line-text is-hit' }, 'got ' + s.hitRate + '%'));
    rounds.forEach(function (r, i) {
      svg.appendChild(svgEl('circle', { cx: L + (i + 0.5) * 52, cy: y(r.confidence), r: 7, class: r.correct ? 'mc-dot-right' : 'mc-dot-wrong' }));
    });
  }

  function initCalibration() {
    var answers = Array.prototype.slice.call(document.querySelectorAll('.mc-cal-answer button'));
    var conf = $('mc-cal-conf'), submit = $('mc-cal-submit'), svg = $('mc-cal-svg');
    var index = 0, rounds = [], picked = null, locked = false;
    bindRange(conf, $('mc-cal-conf-out'));
    function render() {
      $('mc-cal-count').textContent = 'Claim ' + (index + 1) + ' of ' + CLAIMS.length;
      $('mc-cal-claim').textContent = CLAIMS[index].text;
      $('mc-cal-feedback').textContent = '';
      picked = null; locked = false;
      answers.forEach(function (b) { b.disabled = false; b.setAttribute('aria-pressed', 'false'); });
      conf.disabled = false;
      submit.disabled = true;
      submit.textContent = 'Lock in my answer';
    }
    answers.forEach(function (b) {
      b.addEventListener('click', function () {
        if (locked) return;
        picked = b.dataset.answer === 'true';
        press(answers, b);
        submit.disabled = false;
      });
    });
    submit.addEventListener('click', function () {
      if (!locked) {
        var claim = CLAIMS[index], correct = picked === claim.answer;
        rounds.push({ confidence: +conf.value, correct: correct });
        $('mc-cal-feedback').textContent = (correct ? 'Correct. ' : 'Incorrect. ') + claim.note;
        answers.forEach(function (b) { b.disabled = true; });
        conf.disabled = true;
        locked = true;
        submit.textContent = index < CLAIMS.length - 1 ? 'Next claim' : 'Start again';
      } else {
        if (index < CLAIMS.length - 1) index++;
        else { index = 0; rounds = []; }
        render();
        answers[0].focus();
      }
      drawCalibration(svg, rounds);
      $('mc-cal-summary').textContent = verdictText(summarise(rounds));
    });
    render();
    drawCalibration(svg, rounds);
  }

  function initArbitration() {
    var toggles = Array.prototype.slice.call(document.querySelectorAll('.mc-toggle button'));
    var th = $('mc-arb-th'), grid = $('mc-arb-grid'), kind = 'tracks';
    function render(threshold) {
      var r = simulate(ASSISTANT[kind], ASSISTANT.correct, threshold);
      grid.textContent = '';
      r.cells.forEach(function (cell) {
        var div = document.createElement('div');
        div.className = 'mc-cell ' + (cell.accepted ? 'is-accepted' : 'is-checked') + ' ' + (cell.correct ? 'is-right' : 'is-wrong');
        div.textContent = cell.confidence + '% ' + (cell.correct ? '✓' : '✗');
        grid.appendChild(div);
      });
      grid.setAttribute('aria-label', 'Of 20 answers, I accept ' + (r.acceptedRight + r.acceptedWrong) + ', including ' + r.acceptedWrong + ' wrong, and check ' + r.checked + ' myself.');
      $('mc-arb-wrong').textContent = r.acceptedWrong;
      $('mc-arb-checked').textContent = r.checked;
      $('mc-arb-right').textContent = r.acceptedRight;
      $('mc-arb-read').textContent = arbitrationText(kind, r, threshold);
    }
    toggles.forEach(function (b) {
      b.addEventListener('click', function () { kind = b.dataset.ai; press(toggles, b); render(+th.value); });
    });
    bindRange(th, $('mc-arb-th-out'), render);
  }

  function initPrompts() {
    Array.prototype.forEach.call(document.querySelectorAll('.mc-prompts button'), function (b) {
      b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); });
    });
  }

  function initOffload() {
    var host = $('mc-sort'), labels = { hand: 'Hand over', along: 'Work alongside', keep: 'Keep' };
    TASKS.forEach(function (task) {
      var row = document.createElement('div'); row.className = 'mc-task';
      var text = document.createElement('p'); text.textContent = task.text;
      var choice = document.createElement('div'); choice.className = 'mc-choice';
      choice.setAttribute('role', 'group'); choice.setAttribute('aria-label', task.text);
      var reply = document.createElement('output');
      var buttons = Object.keys(labels).map(function (pick) {
        var b = document.createElement('button');
        b.type = 'button'; b.dataset.pick = pick; b.textContent = labels[pick]; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () { press(buttons, b); reply.textContent = offloadReply(task, pick); });
        choice.appendChild(b);
        return b;
      });
      row.appendChild(text); row.appendChild(choice); row.appendChild(reply);
      host.appendChild(row);
    });
  }

  initProgress();
  initHero();
  initPhases();
  initPeople();
  initCheck();
  initCalibration();
  initArbitration();
  initPrompts();
  initOffload();
```

- [ ] **Step 6: Build and run the page checks**

Run: `node scripts/test_metacognition.js && make build && /tmp/venv/bin/python3 scripts/test_metacognition_page.py`
Expected: the 11 page checks from Step 1 PASS. `loads_with_scene`, `writings_card_and_nav` and `light_theme_tokens` still FAIL (Tasks 4 and 5 own them).

- [ ] **Step 7: Look at it**

Screenshot `/metacognition/` at 1200px dark, 1200px light and 400px dark with Playwright, and read each image. Fix any overlap in the hero SVG, the people grid, the calibration chart labels and the decay bars before committing.

- [ ] **Step 8: Commit**

```bash
git add _pages/metacognition.md css/metacognition.css js/components/metacognition.js
git commit -m "Build the Metacognition field guide page"
```

---

### Task 4: The `metacognition` scroll scene

**Files:**
- Modify: `js/components/essay-motion.js` (scene copy in `scenes`, drawings in `stories`, the dispatch list)
- Modify: `css/essay-motion.css:353-354` (accent in both themes)

**Interfaces:**
- Consumes: `motion_scene: metacognition` from the page's front matter.
- Produces: `.em-story` on `/metacognition/`; `--em-accent` on `<html>`.

- [ ] **Step 1: Confirm red**

Run: `/tmp/venv/bin/python3 scripts/test_metacognition_page.py -k loads_with_scene light_theme_tokens`
Expected: both FAIL (`.em-story` never attaches; `--em-accent` is the placeholder).

- [ ] **Step 2: Add the scene copy** after the `curiosity` entry in `scenes`:

```js
    /*
      /metacognition/: a fluent draft, one question it cannot survive, an answer
      and a confidence written down before asking again, and the check that shows
      the confident sentence was the wrong one.
    */
    metacognition: {
      narrative: true,
      title: 'The draft read beautifully.',
      copy: 'She skimmed it, liked how sure it sounded, and sent it on.',
      steps: ['Fluent', 'Asked', 'Predict', 'Check'],
      frames: [
        ['The report took under a minute', 'The draft read beautifully.', 'She skimmed it, liked how sure it sounded, and sent it on.'],
        ['Her manager asked one question', 'Where does this number come from?', 'She read the paragraph again. It still sounded right, and she could not explain it.'],
        ['Before asking again, she wrote her own answer', 'Her guess, and how sure she was.', 'About 3%, and 60% sure, on a sticky note. Then she traced the number to its source.'],
        ['The source said 3.1%', 'Her guess was closer than the confident draft.', 'Now she writes her answer and confidence before she asks. The assistant drafts, and she decides what stays.']
      ]
    },
```

- [ ] **Step 3: Add the drawings** after the `curiosity` entry in `stories`:

```js
      metacognition: {
        label: 'A fluent AI draft is sent unchecked, fails one question, and is checked against her own written guess and the source',
        frames: [
          '<rect class="em-screen" x="214" y="44" width="400" height="236" rx="12"/><text class="em-screen-label" x="414" y="80">QUARTERLY REPORT</text><path class="em-message-line" d="M250 112h328M250 140h300M250 168h318M250 196h260"/><rect class="em-result-mark" x="250" y="222" width="200" height="34" rx="17"/><text class="em-result-word" x="350" y="244">SOUNDS CERTAIN</text><g class="em-fig em-fig-skim"><circle class="em-head" cx="110" cy="150" r="22"/><path class="em-person" d="M110 172v62m-30 46 30-46 30 46M110 196l58-6"/></g><path class="em-arrow" d="M630 162h70m-16-14 16 14-16 14"/><text x="375" y="344">She sent it on without checking a single number.</text>',
          '<rect class="em-note" x="96" y="132" width="330" height="150" rx="9"/><path class="em-note-rule" d="M126 168h270M126 204h270M126 240h200"/><rect class="em-result-mark" x="228" y="188" width="70" height="30" rx="15"/><text class="em-result-word" x="263" y="208">4.2%</text><rect class="em-message" x="380" y="52" width="300" height="58" rx="10"/><text class="em-result-word" x="530" y="86">WHERE DOES THIS COME FROM?</text><path class="em-thought-line" d="M298 196C340 150 380 126 420 110"/><g class="em-fig em-fig-ask"><circle class="em-head em-helper" cx="604" cy="168" r="22"/><path class="em-person em-helper" d="M604 190v62m-30 46 30-46 30 46M604 214l-50-10"/></g><text x="375" y="344">She could not say where the number came from.</text>',
          '<rect class="em-note" x="88" y="70" width="240" height="190" rx="8"/><text class="em-note-title" x="116" y="104">BEFORE I ASK AGAIN</text><text class="em-note-key" x="116" y="146">my answer</text><text class="em-note-value" x="302" y="146">about 3%</text><path class="em-note-rule" d="M116 162h186M116 206h186"/><text class="em-note-key" x="116" y="190">how sure</text><text class="em-note-value" x="302" y="190">60%</text><path class="em-arrow" d="M350 166h70m-16-14 16 14-16 14"/><rect class="em-screen" x="440" y="70" width="230" height="190" rx="12"/><text class="em-screen-label" x="555" y="104">SOURCE TABLE</text><path class="em-message-line" d="M470 134h170M470 164h150M470 194h170M470 224h120"/><text x="375" y="344">Her answer and her confidence went on paper first.</text>',
          '<g class="em-load"><rect x="70" y="70" width="300" height="52" rx="7"/><text x="220" y="102">draft · 4.2% · certain</text><rect x="70" y="146" width="300" height="52" rx="7"/><text x="220" y="178">her guess · about 3% · 60% sure</text></g><path class="em-arrow" d="M390 172h56m-16-14 16 14-16 14"/><rect class="em-screen" x="466" y="70" width="214" height="128" rx="12"/><text class="em-screen-label" x="573" y="104">THE SOURCE SAID</text><text class="em-screen-value" x="573" y="160">3.1%</text><g class="em-carry"><rect x="200" y="226" width="350" height="58" rx="8"/><text x="375" y="252">KEPT</text><text class="em-carry-word" x="375" y="274">answer first, then ask</text></g><text x="375" y="344">The confident sentence was wrong. Her 60% guess was closer.</text>'
        ]
      },
```

- [ ] **Step 4: Route the key** by adding `|| key === 'metacognition'` to the `buildEmotionalNarrativeCanvas` dispatch condition in `buildNarrativeCanvas`.

- [ ] **Step 5: Add the accent**, appending to line 353 `html[data-motion-scene="metacognition"]{--em-accent:#c48ee0}` and to line 354 `html[data-theme="light"][data-motion-scene="metacognition"]{--em-accent:#6b278e}`.

- [ ] **Step 6: Build and run**

Run: `make build && /tmp/venv/bin/python3 scripts/test_metacognition_page.py -k loads_with_scene light_theme_tokens`
Expected: both PASS. Then screenshot each of the 4 beats (scroll the pinned scene) in both themes and read them; fix label overlap before committing.

- [ ] **Step 7: Commit**

```bash
git add js/components/essay-motion.js css/essay-motion.css
git commit -m "Add the metacognition scroll scene"
```

---

### Task 5: Wire the guide into the site

**Files:**
- Modify: `_pages/thoughts.md` (card first in `.writings-guides-grid`)
- Modify: `_data/navigation.yml` (Writings `owns`)
- Modify: `llms.txt` (Writings list, after the essay)
- Modify: `_config.yml` (`exclude`)

- [ ] **Step 1: Confirm red**

Run: `/tmp/venv/bin/python3 scripts/test_metacognition_page.py -k writings_card_and_nav`
Expected: FAIL `no card on /writings/`.

- [ ] **Step 2: Add the card** as the first child of `.writings-guides-grid`:

```html
<a class="essay-feature" href="/metacognition/">
<span class="essay-feature-title">Metacognition</span>
<span class="essay-feature-desc">A visual guide to checking what you actually understand when AI answers fast. Score your confidence, weigh the machine’s, and decide what to hand over.</span>
<span class="read-more">Open the field guide →</span>
</a>
```

- [ ] **Step 3: Light the nav** by adding `      - /metacognition` under the Writings `owns` list.

- [ ] **Step 4: Add the llms.txt entry** directly after the essay line in `## Writings`:

```
- [Metacognition](https://vickyfeliren.com/metacognition/) (Oct 2026, Interactive note): A field guide for thinking alongside AI. Covers the two parts of metacognition, the fluency illusion behind AI-written text, a 5-claim calibration exercise with feedback, a simulation of trusting an assistant whose confidence does or does not track its accuracy, two pauses where bias enters a prompt and its answer, and a sorter for which tasks to hand over. Built from 9 named sources and 4 primary studies.
```

- [ ] **Step 5: Keep the new tests out of the build** by adding `  - scripts/test_metacognition.js` and `  - scripts/test_metacognition_page.py` to `exclude` in `_config.yml`.

- [ ] **Step 6: Build and run every check**

Run: `make build && /tmp/venv/bin/python3 scripts/test_metacognition_page.py && test ! -e _site/scripts/test_metacognition.js`
Expected: 14 PASS, `0 failed`, and the excluded test file absent from `_site/`.

- [ ] **Step 7: Commit**

```bash
git add _pages/thoughts.md _data/navigation.yml llms.txt _config.yml
git commit -m "Link the Metacognition guide from Writings, the nav and llms.txt"
```

---

### Task 6: Docs, full verification, and the push

**Files:**
- Modify: `docs/essay-motion.md` (scene count and key list)
- Modify: `CLAUDE.md` (the long-form notes table and its count)

- [ ] **Step 1: Update the docs.** In `docs/essay-motion.md`, "Fourteen pages" becomes "Fifteen pages", "one of the fourteen keys below" becomes "one of the fifteen keys below", "Two of the fourteen colour hooks" becomes "Two of the fifteen colour hooks", and the key list gains `metacognition` (/metacognition/) before `record`. In `CLAUDE.md`, "Sixteen pages follow the same shape" becomes "Seventeen pages follow the same shape", and the table gains the row ``| `/metacognition/` | in the page | — | `metacognition.js` | — |``.

- [ ] **Step 2: Run the full gate**

Run: `node scripts/test_metacognition.js && node scripts/test_interview_distributions.js && make check && /tmp/venv/bin/python3 scripts/test_metacognition_page.py`
Expected: both Node checks print their line, `pages with any flag : 0`, `0 failed`.

- [ ] **Step 3: Check every source link returns 200**

Run a `curl -sL -o /dev/null -w '%{http_code}'` over each `href` in `#sources` with a browser user agent. Expected: 200 for each, except `apa.org` which blocks scripted requests; open that one in the Playwright browser instead and confirm the title.

- [ ] **Step 4: Copy review against `no-ai-slop`**

Read the page copy, the scene copy, the card and the llms.txt entry against the skill's `eval.md`. Fix any binary contrast, colon reveal, kicker or synonym cycling, then re-run Step 2.

- [ ] **Step 5: Commit and push**

```bash
git add docs/essay-motion.md CLAUDE.md
git commit -m "Document the metacognition scene and note"
git push origin main
```

---

### Task 7: Capture the recipe as a project skill

**Files:**
- Create: `.claude/skills/field-guide/SKILL.md`

- [ ] **Step 1:** Invoke `superpowers:writing-skills` and follow its RED step: record what an agent without the skill gets wrong when asked to add a field guide (the missing nav `owns` entry, the scene key that fails silently, the accent in one theme only, unexcluded test scripts, unverified statistics).
- [ ] **Step 2:** Write `SKILL.md` covering exactly those failures, with the file list from this plan and the verification gate from Task 6.
- [ ] **Step 3:** Run the skill's GREEN check, commit it, and push.

---

## Self-review

- Spec coverage: hero (Task 3), scene (Task 4), 8 sections with one operable visual each (Task 3), sources (Task 3), integration list (Task 5), docs (Task 6), tests (Tasks 1, 2, 6). No gaps.
- Placeholders: `BUDZYN_DOI_URL` is deliberate and resolved in Task 3 Step 3 before the first build.
- Names: `summarise`, `simulate`, `verdictText`, `checkReply`, `arbitrationText`, `offloadReply`, `CLAIMS`, `ASSISTANT`, `PHASES`, `TASKS` match between Tasks 1 and 3. Ids in Task 2 match Task 3's markup.
- Review Focus: lines 1 to 5 map to `calibration_round_trip`, `narrow_viewport_fits`, `reduced_motion_pauses_hero`, `light_theme_tokens`, and the restart half of `calibration_round_trip`.
