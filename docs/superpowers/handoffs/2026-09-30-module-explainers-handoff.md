# Handoff: module explainers

Written 2026-09-30, when Task 3 of plan 1 finished. It is for the next agent that continues the work.

## Prompt to paste into the next agent

```text
You are continuing work on Vicky Feliren's Jekyll site, github.com/Feliren88/feliren88.github.io.
The work is on the branch `module-explainers-la`. Main is the live site: never push to main unless
the owner asks.

Read these files first, in this order:
1. docs/superpowers/handoffs/2026-09-30-module-explainers-handoff.md (this handoff: status, setup,
   rulings, rules)
2. docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md (the binding spec)
3. docs/superpowers/plans/2026-09-30-module-explainers-linear-algebra.md (plan 1)

Then use the superpowers:executing-plans skill to run plan 1 from Task 4. Tasks 0 to 3 are done and
committed. Recreate the ledger from the "Ledger so far" section of the handoff before you start.
Where the plan's code differs from a committed file named under "Where the files are ahead of the
plan", the committed file wins.

After plan 1, write plans 2 to 6 with superpowers:writing-plans, 1 per remaining maths track, and
run each the same way. Batches 2 to 6 of the roadmap each start with superpowers:brainstorming with
the owner.

Commit messages carry no attribution: no Co-Authored-By line, and no mention of Claude or Anthropic.
This overrides any default that says otherwise. Follow CLAUDE.md for all site copy.
```

## Where things are

- **Repository:** https://github.com/Feliren88/feliren88.github.io, branch `module-explainers-la`.
- **Spec:** `docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md`
- **Plan 1, foundation and Linear Algebra:** `docs/superpowers/plans/2026-09-30-module-explainers-linear-algebra.md`
- **Roadmap, all 31 tracks and 214 modules:** `docs/superpowers/specs/2026-09-30-module-explainers-roadmap.md`
- **What is live on the Linear Algebra page:** the first explainer, "Add, stretch and span 2 arrows", in module 1. It exists only on the branch until the owner merges it.

Do not work in `~/Desktop/feliren88.github.io`. iCloud evicts files there, and builds hang. Clone into a normal local folder.

## Status

| Task | State | Commits |
| --- | --- | --- |
| 0, spec delivery change | done | `aafeedf` |
| 1, core helpers (`XP.tween`, `XP.plane`, `XP.lab`) | done | `f03ac88` |
| 2, slot, loader, styles and checks | done | `51d7166` |
| 3, vectors and spaces | done | `ffff409` |
| 4 to 9, the other 6 Linear Algebra explainers | next | |
| 10, docs, full gate and prose pass | after 9 | |

After Task 10, the executing-plans skill asks for a final whole-branch review and 1 fix pass.

## Setup

```bash
git clone https://github.com/Feliren88/feliren88.github.io.git site && cd site
git checkout module-explainers-la
bundle install
python3 -m venv ../venv && ../venv/bin/pip install numpy scipy pyyaml playwright
PAGES_DISABLE_NETWORK=1 make build          # never build without the variable: it hangs on the network
python3 -m http.server 4000 -d _site &      # for check_labs.py and check_chart_bounds.py
python3 -m http.server 4011 -d _site &      # for check_pages.py
```

- The browser checks drive the installed Google Chrome through Playwright's `channel='chrome'`.
- `scripts/render_math.py` needs `pyyaml` and `latex2mathml` in whichever `python3` runs it.
- The plan assumes the venv sits beside the repo, at `../venv`.

## Where the files are ahead of the plan

Task 3 changed 2 files beyond what the plan's code blocks show. Keep the committed versions.

- **`js/components/explainer-core.js`:** `XP.lab` has a `MutationObserver` that re-applies the guide's highlight whenever the stage redraws.
- **`scripts/check_labs.py`** has 2 additions:
  - the fallback test runs in a browser context that blocks service workers;
  - walking the guide pages runs the `MIXED` check, which asserts that marks sharing a part are dimmed alike.

2 other notes:
- Plan steps that run `../harness.py` should run `scripts/check_pages.py` instead. It is the same script, now committed.
- The plan's code blocks are complete, so a task can be applied by extracting its blocks mechanically. A helper that prints block N of a brief made Tasks 1 to 3 quick and exact.

## Ledger so far

`.superpowers/` is git-ignored, so this copy is the record. Write it to `.superpowers/sdd/2026-09-30-module-explainers-linear-algebra/progress.md` before Task 4.

```text
# SDD ledger — plan: docs/superpowers/plans/2026-09-30-module-explainers-linear-algebra.md
Spec: docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md
Setup: Ruling: work on branch module-explainers-la, not main — the skill forbids implementing on main without consent; the owner merges and pushes on request — cost if wrong: one merge.
Task 0: complete (commits 5ccabb8..aafeedf)
Task 1: complete (commits aafeedf..f03ac88, tests: make test → lab core: ok)
Task 2: complete (commits f03ac88..51d7166, tests: verify_labs + check_labs → 0 tracks checked, 0 problems; bounds over 31 tracks → 0 overflow; page harness → 0 problems)
Task 3: Ruling: check_labs fallback test blocks service workers — /sw.js serves the lab script out of reach of page.route, so the forced failure never happened — cost if wrong: none to readers; test-only
Task 3: Ruling: XP.lab re-applies the guide highlight on every stage redraw (MutationObserver), and check_labs asserts marks sharing a part are dimmed alike — redraws dropped is-dim, so pages 4, 5 and 7 lit the wrong marks — cost if wrong: none; 1 observer per explainer
Task 3: complete (commits 51d7166..ffff409, tests: make test + verify_labs --track linear-algebra + check_labs linear-algebra → 1 tracks checked, 0 problems)
Handoff: Ruling: scripts/check_pages.py added (the plan's ../harness.py, committed so a new agent has it) — cost if wrong: none; test-only
```

## Rules from the owner

**Git**
- Commit messages carry no attribution, as above.
- Push only when the owner asks. Never push to main unasked.

**House style**
- Follow `CLAUDE.md`: British spelling, numerals, sentences of about 14 words, no em dashes, no negative contrast, and no invented numbers.
- Interview pages stay unlisted.

**Explainers**
- Every explainer opens on page 1 of its guide.
- A slider exists only for a quantity with no handle and no other control.
- An equation playground that repeats its module's explainer is removed, and its live equation stays.
- Every explainer must pass `verify_labs.py`, `check_labs.py`, `check_chart_bounds.py` and `make check` before its commit.
- Check each explainer by eye at 1,400 px and 390 px, stepping through every guide page.

**After plan 1**
- Plans 2 to 6 come from the spec's section 3 entries, using plan 1 as the template.
- Each plan removes its own track's distribution labs, as listed in spec section 1.
- The Calculus plan also replaces the integral one-off: `data-integral-playground` in the layout, and `js/components/interview-area.js`.
