# Module explainer checkpoints and milestones

Updated on 2026-09-30. The owner asked to merge this branch directly into main and push to GitHub.

## Current checkpoint

All 7 Linear Algebra modules have interactive explainers.
The branch includes main’s latest copywriting from `f892a6e`.
Only 8 equation metadata fields changed to connect the new explainers.
Therefore, the existing interview lessons retain main’s wording.
The new guide pages use concrete examples and plain English.

| Milestone | State | Commit |
| --- | --- | --- |
| Shared core, lazy loader and fallback diagrams | Complete | `f03ac88`, `51d7166` |
| Vectors and spaces | Complete | `ffff409` |
| Matrices as transformations | Complete | `4673f8b` |
| Determinant, rank and inverse | Complete | `eaedfc1` |
| Eigenvectors | Complete | `4a7eeb9` |
| Decompositions | Complete | `14af49b` |
| Least squares | Complete | `5e6afb6` |
| Conditioning | Complete | `c2a2b44` |
| Preserve main’s latest copy | Complete | `f53f669` |
| Documentation and plain-English guide review | Complete | `3f03058` |
| Independent review and final browser checks | Complete | `8f57a7e` |
| Direct main integration | Authorised after passing checks | |

## Verification

The build and SEO audit pass with 0 flags.
Unit tests, distribution checks, lab-core tests and all 7 independent maths checks pass.
The generated equation check also passes.
The first full browser run found 0 explainer problems, page problems or chart overflows.

The independent reviewer found 2 Important issues and no Critical issues.
Worked dialogs now use the matrix currently displayed.
Moreover, eigenvector scrubbing retains its 12 iteration arrows and recorded endpoints.
Focused browser checks reproduced both issues before the fixes and passed afterwards.
The reviewer also confirmed that interrupting playback preserves the requested scrub position.
The final full browser suite passes on the corrected tree.
It reports 0 explainer problems, 0 page problems and 0 overflowing charts.
Moreover, all 53 guide pages were reviewed at desktop and phone widths in both themes.
The conditioning regression also checks that manual size changes can be scrubbed back.

One Minor issue remains for a later pass.
Decomposition redraws replace equation terms, which lose their hover listeners.
Event delegation would preserve this optional highlighting.
Guide highlighting and the mathematical controls remain covered by browser checks.

## Next milestone

Continue the maths batch with Calculus, Mathematics, Mathematical Proof, Bayesian Statistics and Frequentist Statistics.
Each track needs its own implementation plan and module explainers.
The Linear Algebra milestone completes 7 of the maths batch’s planned 45 explainers.

Read the binding design and the roadmap before writing the next plan.

- `docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md`
- `docs/superpowers/specs/2026-09-30-module-explainers-roadmap.md`
- `docs/superpowers/plans/2026-09-30-module-explainers-linear-algebra.md`

## Working environment

Use a regular local clone because iCloud can evict repository files and stall builds.
Run builds with `PAGES_DISABLE_NETWORK=1`.
The verification environment needs NumPy, SciPy, PyYAML, latex2mathml and Playwright with Google Chrome.
During this milestone, the venv sits beside the checkout at `../venv`.
The preview uses port 4100 because other servers occupy ports 4000 and 4011.
Therefore, browser checks must use the owned preview’s address.

Commit messages carry no attribution.
Follow `CLAUDE.md` for site copy, and preserve user edits before continuing.
