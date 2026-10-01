# Calculus milestone handover

All 7 Calculus modules have passed the numerical and browser gates.
Therefore, this handover passes the remaining 31 maths implementation modules to the next agent.

## Scope

The owner requested handover after all 7 Calculus explainers finish, followed by merging and deployment.
After that, the next agent continues the remaining 31 maths modules.

| Track | Remaining modules | Next action |
| --- | ---: | --- |
| Mathematics | 10 | Write and execute its track plan |
| Mathematical Proof | 7 | Follow Mathematics |
| Bayesian Statistics | 6 | Follow Mathematical Proof |
| Frequentist Statistics | 8 | Follow Bayesian Statistics |

The original selected batch contains 38 modules, excluding the already completed Linear Algebra track.
Therefore, completing Calculus leaves 31 modules from that batch.

## Calculus checkpoints

| Module | Commit | State |
| --- | --- | --- |
| Derivatives | `ce54e2b`, `42f8caa` | Verified |
| Chain rule | `c6c085c` | Verified |
| Gradients, Jacobians and Hessians | `f022bd0` | Verified |
| Optimisation conditions | `6daa6de` | Verified |
| Integration and expectation | `4277565` | Verified |
| Approximation | `b669b91` | Verified |
| Matrix calculus | `4fcc979` | Verified |

## Milestone verification

The final full browser gate reports 2 tracks checked and 0 problems.
Moreover, all 14 independent module maths checks pass, and make test passes.
The site build and audit report 0 flags, and generated equations are consistent.
Every interview page passes the desktop and phone checks.
Furthermore, the chart gate reports no page errors and 0 overflowing charts.
All Calculus guides were captured and inspected at both widths and themes.
The Matrix Calculus animation regressions pass under normal and reduced motion.

## Maths language instructions

The reusable skill is `math-stats-writing` in [Feliren88/codex-skills](https://github.com/Feliren88/codex-skills).
Use its mathematical, equation, and statistical references alongside the website writing guide.
The public repository checkpoint is `3f3229e`, with five inspected baseline and guided application cases.
However, those checks did not independently test Luna, GPT-4, or Claude Haiku.

Read `AGENTS.md`, `docs/maths-writing-guide.md`, and `docs/superpowers/plans/2026-10-01-maths-language-review.md` before writing learner copy.
The writing guide and comprehensive plan were reviewed and committed at `cc59520`.
They include all 45 language checkpoints, file locations, examples, editing passes, and evidence templates.
However, those language checkpoints remain Pending until their actual reviews run.
The original implementation batch still has 31 remaining modules.

Save language evidence under `docs/reviews/maths-language/<track>/NN-<slug>.md`.
Then link each record from the corresponding track README and update the language inventory.
Slop or Not was unavailable, so no detector scores or measured readability grades are claimed.

## Verification commands

Run these commands from the repository root with the preview serving `_site` on port `4100`.
After that, review each command’s exit status and complete output.

```sh
PAGES_DISABLE_NETWORK=1 make check
PATH="../venv/bin:$PATH" make test
../venv/bin/python scripts/render_math.py --check
../venv/bin/python scripts/verify_labs.py
../venv/bin/python scripts/check_calculus_views.py http://localhost:4100
../venv/bin/python scripts/check_labs.py linear-algebra calculus --base=http://localhost:4100
../venv/bin/python scripts/check_chart_bounds.py _data/interview.yml http://localhost:4100
```

The existing page checker uses port `4011` directly.
Therefore, adapt an ignored local copy to `4100` without disturbing the process on `4011`.

## Working environment

The owner checkout is `/Users/feliren/Desktop/personal-website/feliren88.github.io`.
However, iCloud can stall reads there, so implement through a normal clone or isolated worktree.
The current worktree is `/private/tmp/module-explainers-la`, on `module-explainers-calculus`.
Its normal clone is `/private/tmp/interview-push-checkout`.
Moreover, `../venv/bin/python` resolves to `/private/tmp/venv/bin/python`.

The preview uses port `4100`; ports `4000` and `4011` belong to other processes.
The ignored ledger lives under `.superpowers/sdd/2026-09-30-module-explainers-calculus/`.
Therefore, preserve that directory when switching worktrees.

## Instructions for the next agent

Read `CLAUDE.md`, `docs/interview.md`, and the maths design before changing files.
The binding design is `docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md`.
After that, write a separate Mathematics plan using its 10 agreed modules.
Execute each track inline and request one fresh whole-branch review at its milestone.

Preserve the latest lesson copy from main and newer user edits.
Give each module its own include, script, computed opening example, and 6–10 short guide pages.
Moreover, retain static fallbacks and step players until each replacement works.
Verify numerical claims independently with Python, NumPy, or SciPy.
Then check live equations, recorded rewinds, Previous restoration, keyboard handles, and explicit edge states.
Inspect every guide at 1400px and 390px in both themes.

Apply Academic Writing, Humanizer, No AI Slop, TypeSafe guidance, and Writing Beats.
Known calculations belong in code; no runtime AI service is required.
Moreover, do not invent detector scores when Slop or Not is unavailable.
Start prose sentences uppercase and reserve prose colons for explicit definitions.

The owner authorised checkpoint pushes, reviewed milestone merges into main, and deployment.
Moreover, the latest instruction requires a GitHub push at every verified milestone.
Therefore, fetch main, preserve newer copy, merge verified work, recheck the merged tree, and push without force.
Sync the owner checkout only when it remains clean.

## Review evidence

One fresh reviewer examined all 7 Calculus scenes against the original main baseline `ca2b648`.
Moreover, the reviewer independently ran all 7 Calculus numerical checks.
The review found no Critical or Important issues.

Main subsequently advanced to `26025fe`, merging the first 6 verified Calculus commits.
Therefore, the final integration must preserve that merge and the original remaining-maths handoff.

## Deferred observations

Linear Algebra decomposition redraws still lose directly attached equation hover listeners.
Keep that recorded Minor issue visible while completing the selected maths batch.
The Calculus review found no Critical or Important issues.
However, these Minor observations remain for the next agent.

- Integration sample count, Optimisation dimension, and Approximation exponent each have duplicate slider and handle controls.
- Matrix Calculus labels its recorded bias transition “Recorded pass”, although it keeps all calculation blocks visible.
- Integration and Approximation contain trailing whitespace in their committed scripts.

Moreover, occasional browser navigation timeouts require exact reproduction before any product fix.
Successful reruns establish passing gates; they do not establish a defect was fixed.

## Pasteable continuation prompt

```text
Continue the remaining 31 maths explainers from the verified Calculus milestone on main.
Read docs/superpowers/handoffs/2026-10-01-calculus-milestone-handoff.md first.
Then follow docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md.
Start Mathematics with its 10 modules and write a separate implementation plan.
After that, complete Mathematical Proof, Bayesian Statistics, and Frequentist Statistics in that order.
Preserve main’s latest lesson copy and all completed Linear Algebra and Calculus explainers.
Use independent maths checks, focused browser regressions, and full track milestone verification.
Read docs/maths-writing-guide.md and docs/superpowers/plans/2026-10-01-maths-language-review.md before drafting any learner copy.
Use $math-stats-writing from Feliren88/codex-skills alongside the requested writing skills.
Apply the owner’s AGENTS.md prose rules.
Keep the 45-module language review status separate from the remaining 31 implementation modules.
Commit each verified module separately and request one fresh whole-branch review per completed track.
The owner authorised checkpoint pushes, verified merges to main, and deployment.
Proceed through those steps after review and recheck the merged tree before pushing.
Sync the owner checkout only if clean, then report verification and deployment evidence.
```
