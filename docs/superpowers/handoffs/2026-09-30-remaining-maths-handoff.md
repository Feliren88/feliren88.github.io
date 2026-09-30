# Remaining maths explainers handover

Updated on 2026-09-30. The owner chose to finish the remaining 38 maths explainers and asked for this handover so another coding agent can complete the work. The owner has already authorised checkpoint pushes and direct merges into `main`.

## Scope and current checkpoint

The seven Linear Algebra explainers are complete, merged, and pushed in `main` at `a5fb782`. Preserve their implementation and the latest copywriting from `main`.

| Track | Modules remaining | State |
| --- | ---: | --- |
| Calculus | 7 | Plan committed; Task 1 numerical test is red |
| Mathematics | 10 | Awaiting a track plan |
| Mathematical Proof | 7 | Awaiting a track plan |
| Bayesian Statistics | 6 | Awaiting a track plan |
| Frequentist Statistics | 8 | Awaiting a track plan |

The agreed order is Calculus, Mathematics, Mathematical Proof, Bayesian Statistics, then Frequentist Statistics. Complete all 38 modules. The broader interview roadmap extends beyond this selected maths batch.

## Repositories and unfinished work

The owner's checkout is `/Users/feliren/Desktop/personal-website/feliren88.github.io`. It was clean on `main` at `a5fb782` when this handover was written. Check its status again before changing or syncing it. iCloud can evict Git files from that checkout and stall builds, so use a normal local clone or linked worktree for implementation.

The active worktree is `/private/tmp/module-explainers-la` on branch `module-explainers-calculus` at `94d0702`. The worktree name reflects its earlier Linear Algebra use; the current branch is Calculus. The Calculus plan exists on this branch and has not reached `main` yet. Its only uncommitted change is `scripts/verify_labs.py`. That change adds the independent `calculus/derivatives` check. The check already failed because `js/labs/calculus/derivatives.js` does not exist. Keep this red test and continue Task 1 from that point.

The normal clone is `/private/tmp/interview-push-checkout`. The Python environment used by the worktree is `../venv/bin/python`, which resolves to `/private/tmp/venv/bin/python`. The Calculus task ledger and brief are under `.superpowers/sdd/2026-09-30-module-explainers-calculus/` in the active worktree. That directory is ignored by Git, so preserve it when changing worktrees.

Read these files from the active worktree before editing.

1. `CLAUDE.md`
2. `docs/superpowers/handoffs/2026-09-30-module-explainers-handoff.md`
3. `docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md`
4. `docs/superpowers/plans/2026-09-30-module-explainers-calculus.md`
5. `.superpowers/sdd/2026-09-30-module-explainers-calculus/progress.md`
6. `.superpowers/sdd/2026-09-30-module-explainers-calculus/task-1-brief.md`

The maths design is the binding specification. The roadmap at `docs/superpowers/specs/2026-09-30-module-explainers-roadmap.md` supplies broader context. The existing Calculus plan has seven module tasks and one milestone task. Use it task by task. Write a separate plan for each later track, then implement that plan before starting the next track.

## Immediate next action

Implement the pure functions for `calculus/derivatives` and make its existing independent check pass. The check expects `value(kind, x)`, `derivative(kind, x)`, `quotient(kind, x, h)`, `derivativeState(kind, x)`, and `samples(kind, x, hs)`. The five function kinds are `square`, `sine`, `exp`, `abs`, and `cube-root`. The origin has a corner for `abs` and a vertical tangent for `cube-root`; neither has a finite derivative there, and the displayed states must distinguish them.

After the numerical check passes, add browser assertions before registering the explainer and confirm that the missing interactive scene fails those assertions. Then build `_includes/labs/calculus/derivatives.html` and `js/labs/calculus/derivatives.js` according to the Task 1 brief. Its first page uses the square function at `x = 1` with `h = 1`. Readers should be able to drag both secant points, shrink `h`, scrub the motion, inspect the tangent and derivative graph, and see worked arithmetic. Publish `fx`, `slope`, and `secant` to the live equation. Remove the existing curve playground only after the replacement works.

## Implementation rules

Give every module its own include and JavaScript file. Register each in `_data/module_labs.yml`. Export pure maths functions for checks against independent Python, NumPy, or SciPy calculations. Use the existing `XP.lab` loader and the `XP.plane`, `XP.guide`, and `XP.dialog` helpers in `js/components/explainer-core.js`.

Each explainer needs a concrete first example, 6–10 short guide pages, natural drag handles, keyboard controls, live equation values, a scrubbable 400–900 ms motion, reduced-motion behavior, accurate edge states, and legible contrast in both themes. Keep the static diagram fallback and step player. Update equation metadata in `_data/interview.yml`, then regenerate `_data/interview_math.yml` with `scripts/render_math.py`. Do not edit generated MathML by hand.

Manual control changes should record their previous and next states and leave motion at its endpoint so a reader can scrub backward. Capture a slider's requested value before calling `api.interrupt()`, because interrupting an animation can update the control. Moving backward through guide pages must restore the declared example. Worked dialogs should calculate the values currently on screen or clearly label a final target calculation. Earlier browser checks found and fixed these problems in Linear Algebra.

Preserve the latest interview lesson copy from `main` and any newer user edits. New guide pages, labels, dialogs, and documentation should use plain English for human readers. Apply the requested writing guides where available, including `$academic-writing`, `$humanizer:humanizer`, `$no-ai-slop`, `$typesafe-ai`, `$writing-beats`, `$slopornot:slop-check`, and `$slopornot:agentic-humanizer`. Keep the site's research persona consistent with “sequential decision making under uncertainty” where that framing fits the content. Follow the supplied `AGENTS.md` prose rules, including uppercase sentence openings and prose colons only for explicit definitions.

## Verification and integration

Commit each explainer separately and maintain the checkpoint and milestone table. Run the focused numerical and browser checks before each commit. At each track milestone, run the complete relevant gate, inspect every guide page at desktop and phone widths in both themes, and request one fresh whole-branch review. Fix important findings with a regression check. Then merge the verified track into `main`, verify the merged tree, and push without force. Fetch and inspect `main` first so newer copy survives. Sync the owner's Desktop checkout only if it remains clean. Commit messages carry no attribution.

Useful commands from the active worktree follow.

```bash
../venv/bin/python scripts/verify_labs.py calculus/derivatives
PAGES_DISABLE_NETWORK=1 make check
PATH="../venv/bin:$PATH" make test
../venv/bin/python scripts/verify_labs.py --track calculus
../venv/bin/python scripts/check_labs.py calculus --base=http://localhost:4100
../venv/bin/python scripts/check_chart_bounds.py _data/interview.yml http://localhost:4100
../venv/bin/python scripts/render_math.py --check
```

Adapt the track argument as work advances. The project preview uses port `4100`; ports `4000` and `4011` belong to other processes. Run browser sweeps serially and inspect their exit codes and logs. A completed Calculus milestone should have 14 independent maths checks across Linear Algebra and Calculus, two installed tracks with no explainer problems, and no page errors or chart overflows.

One Minor Linear Algebra issue remains recorded in the earlier handover. Decomposition redraws replace equation terms and lose their directly attached hover listeners. Keep that issue visible, but let the selected maths batch drive the remaining work.

Report checkpoint commits and verification results to the owner as each track lands. At the end, report the completed module count, final `main` commit and push state, and any unresolved issues.
