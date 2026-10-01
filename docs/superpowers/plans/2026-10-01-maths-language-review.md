# Plan for reviewing language in the maths interview modules

The owner requested explanations that help people learning maths and English follow each step.
Therefore, this plan gives future agents the files, decisions, examples, and checks needed for that work.
The writing standard is [Writing maths lessons for people who are learning](../../maths-writing-guide.md).
Read that guide first, then work through this plan 1 module at a time.

## 1. Deliverables and current status

Use [the combined maths and statistics skill](https://github.com/Feliren88/codex-skills/tree/main/skills/math-stats-writing) for precise claims and learner-friendly explanations.
Then apply this repository’s writing rules and module checks.

This document plans a language review across all 45 maths modules.
However, writing this plan does not mean those modules have already passed that review.
The module inventory below starts with every language review marked Pending.
Update an entry only after its text, calculations, and rendered views pass the stated checks.

Each reviewed module produces these deliverables.
Then its track produces a final evidence record.

- A prerequisite list naming the knowledge the reader needs.
- A passage inventory covering every place the learner encounters prose.
- A claim record preserving numbers, assumptions, notation, and sources.
- Revised wording for passages with a specific identified problem.
- Evidence that the revised wording matches the calculation and current interface.
- An updated module status and any unresolved questions.
- A track summary identifying reviewed modules, verification results, and remaining work.

The new guide and plan are documentation deliverables.
Therefore, keep their publication status separate from module implementation and lesson review status.

## 2. Read these files before editing

Read the files in this order.
After that, inspect the selected module’s actual source files.

1. Read `CLAUDE.md` for repository rules and the established English voice.
2. Read `docs/interview.md` for the lesson data and interactive component structure.
3. Read `docs/maths-writing-guide.md` for learner language, examples, and mathematical safeguards.
4. Read `docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md` for the agreed interactive design.
5. Read the latest track handoff and implementation plan for current progress and known issues.
6. Read `docs/accessibility.md` when changing labels, instructions, headings, or live announcements.
7. Read `docs/generated-data.md` before changing any generated equation or distribution data.

The owner’s latest instructions take precedence when these documents disagree.
However, document the disagreement and preserve unrelated edits already present in the working tree.
Do not rewrite another agent’s unfinished text without understanding its purpose and current status.

## 3. Locate the actual wording

The lesson source and interactive source can both contain learner-facing text.
Therefore, inspect both before deciding that a module’s language review is complete.

| File or field | Text to inspect | Editing instruction |
| --- | --- | --- |
| `_data/interview.yml` | Module `name`, `why`, `beats`, `plain`, `covers`, and `check` | Edit the selected module’s authored text. |
| Equation entries in that file | `name`, `read`, `note`, and symbol descriptions in `where` | Preserve equations and definitions while clarifying the explanation. |
| `_includes/labs/<track>/<slug>.html` | Heading, equation readouts, source line, fallback labels, and live region | Check visible text and accessible names. |
| `js/labs/<track>/<slug>.js` | Guide pages, notes, control labels, handle labels, announcements, and worked dialogs | Search generated markup and string literals. |
| `_data/interview_distributions.yml` | Existing authored distribution labels and notes | Confirm ownership and generation rules before editing. |
| `js/components/interview-anim.js` | Track animation captions and instructions | Check whether wording is shared across modules. |
| `js/components/interview-math.js` | Equation playground instructions and readouts | Preserve shared behaviour and mathematical quantities. |
| `_data/module_labs.yml` | Track IDs, module indices, and script slugs | Use this mapping to locate each installed interactive module. |
| `_data/interview_math.yml` | Generated equation output | Regenerate it when required; never hand-edit its mathematical output. |
| `_site/` | Rendered output for inspection | Build it from source; never treat it as authored content. |

Not every module has every field or an installed interactive scene.
Therefore, record absent components as Not present, rather than silently skipping the inventory.
For future scenes, apply the writing guide while implementing them.

Use these searches from the repository root.
Then inspect the surrounding text before changing any match.

```sh
rg -n 'name:|why:|plain:|read:|note:|check:' _data/interview.yml
rg -n 'PAGES|body:|data-note|api.say|dlg.open|label:' js/labs/calculus
rg -n 'lab-head|lab-src|aria-label|data-say' _includes/labs/calculus
rg -n -- '—|delve|pivotal|remarkably|As you can see|trivially' _data/interview.yml js/labs _includes/labs
```

Search matches identify passages to inspect, not automatic replacement instructions.
For example, keep a technical term when the reader needs its established mathematical meaning.

## 4. Choose a small unit of work

Review 1 module before moving to the next.
Then verify that module’s complete lesson, rather than polishing isolated sentences without their context.
Keep language commits separate from unrelated behaviour changes whenever possible.

For existing modules, follow the track order in section 12.
For newly implemented modules, apply these rules during the existing implementation plan.
After that, record their language evidence in the same module checkpoint.

The Calculus handover leaves 31 implementation modules for the next agent.
However, this language review also includes the existing 7 Linear Algebra and 7 Calculus modules.
Keep those 2 counts separate in status reports.

## 5. Record the starting passage and its problem

Read the entire module before editing.
Then record each weak passage using this table.

| Required field | What the agent records |
| --- | --- |
| Location | File path, module title, component, and line number |
| Original passage | The exact text before editing |
| Reader prerequisite | Knowledge required to understand the passage |
| Identified problem | A specific issue such as an undefined term, vague referent, or missing operation |
| Mathematical claim | Inputs, outputs, assumptions, and scope that must survive the edit |
| Proposed revision | The complete replacement passage |
| Verification | The calculation, source, or browser state checked |
| Decision | Keep, Revise, or Needs evidence |

Name the problem instead of labelling the passage “AI” without an explanation.
For example, record “Uses Hessian before explaining what its entries measure”.
If a passage is already clear and correct, choose Keep.
Therefore, review coverage does not require changing every sentence.

Apply edits with a patch scoped to the selected module or passage.
Then preserve YAML quotation rules, HTML escaping, and required JavaScript string syntax.
Keep selectors, `data-*` attributes, control keys, slugs, and function names unchanged during wording edits.
If a calculation needs correction, record that separate mathematical issue before changing its implementation.
After that, verify the correction with an independent calculation and the relevant regression.

## 6. Plan the explanation before writing sentences

Complete the worksheet in the writing guide for the selected module.
Then list the ideas in the order the reader will meet them.

For each passage, answer these questions.
After that, draft the wording.

1. What question does this passage answer?
2. What can the reader already understand from the stated prerequisites?
3. Which new idea or term does this passage introduce?
4. Which concrete input, calculation, or visible mark explains that idea?
5. Which later passage depends on this explanation?
6. Which assumption or edge case limits the claim?

If a passage depends on an unexplained idea, move its introduction earlier.
Alternatively, name an earlier lesson that supplies the required knowledge.
Do not add several dictionary definitions without returning to the example.

## 7. Rewrite through 5 separate passes

Complete these passes in order.
After each pass, compare the result with the mathematical claim record.

### Pass 1. Remove sentences that add no explanation

Delete ceremonial openings, claims of importance, self-praise, and repeated conclusions.
Then start with the quantity, operation, example, or learner question.
Keep factual details even when removing the phrase surrounding them.

### Pass 2. Match the reader’s English

Use common verbs such as add, divide, change, compare, and calculate.
Then introduce necessary mathematical terms through the operation they describe.
Use British spelling and direct instructions suited to adult learners.
Avoid idioms that require cultural knowledge unrelated to the maths.

### Pass 3. Repair individual sentences

Make each sentence state 1 main claim or operation.
Then split tangled conditions while preserving their logical connection.
Check uppercase openings, punctuation, numerals, and the 17-word body sentence limit.
Replace ambiguous “this”, “it”, and “that” with the relevant quantity when needed.

### Pass 4. Repair the order of ideas

Check that each technical name appears with an explanation before another passage relies on it.
Then connect adjacent ideas using their actual sequence, cause, contrast, or comparison.
Prefer familiar links such as “Then” and “So” where they fit.
Avoid giving every paragraph the same sentence pattern or transition.

### Pass 5. Verify meaning and natural reading

Read the passage aloud as an explanation to a learner.
Then check the numbers, assumptions, dimensions, signs, and exact versus approximate claims.
Restore any condition lost while simplifying the English.
Finally, compare the wording with the interface and the source reference.

## 8. Use worked examples to check the rules

Apply the writing guide to these examples before reviewing a whole track.
Then explain why each revision helps the learner and preserves the maths.

### Example A. A vague calculus claim

Original passage.

> The derivative provides profound insight into the underlying local behaviour of the function.

Identified problem.

The sentence names importance without explaining a quantity or operation.
Therefore, replace it with a calculated case.

Revision.

> At x = 1, the function x² has derivative 2.
> Therefore, a small input increase h gives an output increase of approximately 2h.

Verify the derivative 2x at x = 1.
Then retain “small” and “approximately”, because the exact output change is 2h + h².

### Example B. Compressed matrix terminology

Original passage.

> Apply the transposed Jacobian to backpropagate the adjoint through the affine map.

Identified problem.

The sentence assumes several technical ideas without showing the operation.
Therefore, introduce the quantities before using the compact names.

Revision.

> Let x be a column with 2 inputs.
> Meanwhile, W has 3 rows and 2 columns.
> First, multiply each row of W by x and add that row’s products.
> Then add the corresponding offset from b to get each score in z.
> The loss L is 1 number measuring prediction error.
> Next, collect the loss derivative for each score into the 3-entry column δ.
> These derivatives describe how small score changes affect the loss.
> Transposing W swaps its rows and columns, giving Wᵀ shape 2 × 3.
> Therefore, Wᵀδ gives the 2 input derivatives when W and b stay fixed.

Verify the derivative of z = Wx + b with x treated as a column.
Moreover, this example requires the loss derivative for each score to exist.
Then explain the Jacobian name elsewhere if the module’s interview task requires it.

### Example C. An incorrect statistics simplification

Original passage.

> A 95% confidence interval gives the parameter a 95% chance of lying between these endpoints.

Identified problem.

The sentence gives a posterior interpretation to a frequentist confidence interval.
Therefore, describe the sampling procedure instead.

Revision.

> Take repeated samples and calculate an interval from each using the same procedure.
> Under its assumptions, a 95% confidence procedure covers the fixed parameter in about 95% of repetitions.

Check the sampling model and interval method used by the lesson.
Then preserve any approximation or coverage qualification required by that method.
The repeated sampling interpretation follows [NIST’s explanation](https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm).

### Example D. A missing assumption

Original passage.

> More samples always improve the estimate.

Identified problem.

The sentence promises improvement for every realised estimate.
Therefore, distinguish a typical error rate from an individual sample outcome.

Revision.

> Take independent observations from the same distribution, with finite variance σ².
> Then the sample mean has standard error σ/√n.
> However, adding a particular sample can move the current estimate farther from the true value.

Verify the stated estimator, sampling assumptions, and variance calculation.
Then explain n as the sample count before relying on the formula.

### Example E. An existing good sentence

Original passage.

> Transposing the matrix swaps its rows and columns.

Decision.

Keep this sentence when the surrounding passage has already introduced the matrix.
It explains the operation directly, so a stylistic rewrite adds no value.

## 9. Check the rendered interface

Build the site before inspecting rendered wording.
Then review the selected module at 1400px and 390px in both themes.

- Read the lesson opening before touching any controls.
- Open every guide page and check that each page explains 1 learner step.
- Move forward, then use Previous to restore earlier examples.
- Drag handles and use their keyboard controls.
- Change dropdowns and sliders, then read the active note again.
- Scrub a recorded change to both endpoints and an intermediate position.
- Open every worked dialog and compare its arithmetic with the current readouts.
- Check labels and instructions without depending on colour alone.
- Confirm that narrower screens preserve the operation, assumptions, and result.
- Check accessible names and live announcements for the current quantity and value.

Guide examples may describe their own starting state.
However, active notes, readouts, and worked dialogs must describe the reader’s current state.
If the text and calculation disagree, correct the source of that disagreement before recording completion.

## 10. Run only the verification needed for the change

Run these baseline commands for a language checkpoint.
Then inspect each command’s exit status and complete result.

```sh
PAGES_DISABLE_NETWORK=1 make check
PATH="../venv/bin:$PATH" make test
../venv/bin/python scripts/render_math.py --check
git diff --check
```

Use the repository’s configured Python environment if its path differs from this example.
Moreover, use the active preview port rather than starting a server over another process.

If `../venv/bin/python` is absent, inspect the current handoff for the configured environment path.
Then check `.venv/bin/python`, `venv/bin/python`, or the available `python3` installation.
Verify the imports needed by the selected checks before running a long suite.
If a dependency is missing, record its exact name and follow the repository’s environment setup instructions.

```sh
python3 -c "import yaml, numpy, scipy, playwright; print('Maths review dependencies import successfully.')"
```

Use the chosen interpreter in place of `python3` when checking an existing virtual environment.
Similarly, inspect a test script’s accepted arguments before inventing a command for another track.

### Optional Slop or Not checks

Check whether the actual Slop or Not tool or app is available.
Then follow its current skill instructions for text detection, readability, or cleanup.
The Mac app’s CLI path is `/Applications/Slop Or Not.app/Contents/MacOS/slop`.
However, the app’s presence or a status response alone does not prove Pro access.
Use a real Pro-gated text call before reporting measured results.

Run checks on the learner prose being reviewed, rather than the whole implementation file.
Then record the exact passage, tool operation, and returned measurements.
Keep mathematical notation and supported conditions intact when interpreting the result.
Readability formulas can count technical terms without understanding whether the lesson explains them.
Therefore, manually check the reader’s prerequisites even when the measured grade appears low.

If text detection returns a probability between 0 and 1, multiply by 100 for percentage display.
However, readability grades are grade values and must not be converted to percentages.
Use null for unavailable scores, and distinguish unmeasured results from a measured zero.
If tools fail or are absent, complete the manual review without claiming a detector pass.

### Numerical and interactive verification

If equation metadata changed, regenerate equations before checking them.
After that, inspect the generated diff for unintended changes.

```sh
../venv/bin/python scripts/render_math.py
../venv/bin/python scripts/render_math.py --check
```

If a numerical claim changed, verify it independently with Python, NumPy, SciPy, or the cited primary source.
Then record the input, expected result, actual result, and required tolerance.
Do not treat a model’s agreement with a claim as a numerical proof.

If interactive state or behaviour changed, run the focused regression and relevant track gate.
For example, use these commands for Calculus on the established preview.

```sh
../venv/bin/python scripts/verify_labs.py --track calculus
../venv/bin/python scripts/check_calculus_views.py matrix-calculus http://localhost:4100
../venv/bin/python scripts/check_labs.py calculus --base=http://localhost:4100
```

The Matrix Calculus command covers that module only.
Therefore, select the relevant focused check when editing another module.
For other tracks, inspect their current test scripts before assuming a check exists.

At a track milestone, run its implementation plan’s full required gates.
However, do not repeat unrelated long browser sweeps for a reversible wording edit without a concrete reason.

## 11. Record a module’s evidence

Save each record under `docs/reviews/maths-language/<track>/NN-<slug>.md`.
Here, NN is the module’s zero-based index written with 2 digits.
Use the installed slug from `_data/module_labs.yml`, or the agreed design’s slug for an uninstalled module.
For example, use `docs/reviews/maths-language/calculus/06-matrix-calculus.md` for Matrix Calculus.

Save the track summary at `docs/reviews/maths-language/<track>/README.md`.
Then link every module record from that summary and update the inventory in this plan.
Create records when their reviews begin, rather than creating empty records for every module.

Create an evidence record using this template.
Then fill every field before changing the module’s inventory state to Reviewed.

```yaml
track: calculus
module_index: 6
module_title: Matrix calculus
status: Pending
base_commit: Replace with the starting commit
files_reviewed: []
components_not_present: []
reader_prerequisites: []
terms_introduced: []
passages_kept: []
passages_revised:
  - location: Replace with file and component
    original: Replace with the original passage
    problem: Replace with the specific learner difficulty
    revision: Replace with the complete edited passage
    preserved_claim: Replace with values, assumptions, and scope
numerical_evidence: []
source_evidence: []
rendered_checks:
  desktop_dark: Pending
  desktop_light: Pending
  phone_dark: Pending
  phone_light: Pending
tool_checks:
  slop_or_not: Unavailable unless a real tool call succeeds
  detector_score: null
  readability_grade: null
verification_commands: []
unresolved_questions: []
review_commit: Replace after the verified commit exists
```

Use Reviewed only when all relevant checks have passed.
If evidence is missing, use Needs evidence and name the missing calculation or source.
If components remain unchecked, keep Pending and name the next action.
Never mark a track reviewed because its plan or writing guide exists.

## 12. Review every module

The track IDs below match `_data/interview.yml`.
Moreover, module indices start at 0, while rendered module anchors usually start at m1.
Confirm the rendered anchor before using it in a browser check.

Review existing Linear Algebra and Calculus language before their final language milestones.
Then continue the remaining implementation tracks in their agreed order.
For each new module, complete its language review during implementation.

### Linear Algebra

| Track ID | Index | Module | Language review |
| --- | ---: | --- | --- |
| `linear-algebra` | 0 | Vectors and spaces | Pending |
| `linear-algebra` | 1 | Matrices as transformations | Pending |
| `linear-algebra` | 2 | Determinant, rank and inverse | Pending |
| `linear-algebra` | 3 | Eigenvectors and eigenvalues | Pending |
| `linear-algebra` | 4 | Decompositions | Pending |
| `linear-algebra` | 5 | Projections and least squares | Pending |
| `linear-algebra` | 6 | Numerical behaviour | Pending |

### Calculus

| Track ID | Index | Module | Language review |
| --- | ---: | --- | --- |
| `calculus` | 0 | Derivatives and rates | Pending |
| `calculus` | 1 | The chain rule | Pending |
| `calculus` | 2 | Gradients, Jacobians and Hessians | Pending |
| `calculus` | 3 | Optimisation conditions | Pending |
| `calculus` | 4 | Integration and expectation | Pending |
| `calculus` | 5 | Approximation | Pending |
| `calculus` | 6 | Matrix calculus | Pending |

### Mathematics

| Track ID | Index | Module | Language review |
| --- | ---: | --- | --- |
| `math` | 0 | Reading the notation | Pending |
| `math` | 1 | What a number is | Pending |
| `math` | 2 | Dividing by 0 | Pending |
| `math` | 3 | Infinity | Pending |
| `math` | 4 | Counting | Pending |
| `math` | 5 | Probability from first principles | Pending |
| `math` | 6 | Expectation and concentration | Pending |
| `math` | 7 | Information | Pending |
| `math` | 8 | Logs, exponents and scale | Pending |
| `math` | 9 | Numbers on a machine | Pending |

### Mathematical Proof

| Track ID | Index | Module | Language review |
| --- | ---: | --- | --- |
| `math-proof` | 0 | What a claim actually says | Pending |
| `math-proof` | 1 | Direct proof and the contrapositive | Pending |
| `math-proof` | 2 | Proof by contradiction | Pending |
| `math-proof` | 3 | Induction and recursion | Pending |
| `math-proof` | 4 | Counterexamples | Pending |
| `math-proof` | 5 | Inequalities and bounds | Pending |
| `math-proof` | 6 | Existence arguments | Pending |

### Bayesian Statistics

| Track ID | Index | Module | Language review |
| --- | ---: | --- | --- |
| `bayesian-statistics` | 0 | Probability as belief | Pending |
| `bayesian-statistics` | 1 | Priors and what they encode | Pending |
| `bayesian-statistics` | 2 | Computing the posterior | Pending |
| `bayesian-statistics` | 3 | Hierarchical models | Pending |
| `bayesian-statistics` | 4 | Checking and comparing models | Pending |
| `bayesian-statistics` | 5 | Bayesian methods inside machine learning | Pending |

### Frequentist Statistics

| Track ID | Index | Module | Language review |
| --- | ---: | --- | --- |
| `frequentist-statistics` | 0 | Estimators and their properties | Pending |
| `frequentist-statistics` | 1 | Maximum likelihood, worked for each distribution | Pending |
| `frequentist-statistics` | 2 | Sampling distributions and intervals | Pending |
| `frequentist-statistics` | 3 | Hypothesis testing | Pending |
| `frequentist-statistics` | 4 | Multiple comparisons and researcher freedom | Pending |
| `frequentist-statistics` | 5 | Experiment design and A/B testing | Pending |
| `frequentist-statistics` | 6 | Causal inference | Pending |
| `frequentist-statistics` | 7 | Regression in practice | Pending |

## 13. Test whether another agent can use these instructions

Give an agent this guide, this plan, and 1 passage from section 8.
Then ask it to identify the problem, rewrite the passage, and verify the preserved claim.
Use at least a calculus, matrix, and statistics example.

The agent’s answer passes when it includes all these elements.
After that, inspect its rewritten sentences manually.

- It identifies the specific difficulty for the learner.
- It states the prerequisites and introduces missing terms.
- It preserves the numerical values and mathematical conditions.
- It uses readable English within the sentence and punctuation rules.
- It names a real calculation or source supporting the claim.
- It avoids inventing detector scores or claiming a module review is already complete.

If an agent misses a requirement, add the missing instruction near the step it misunderstood.
Then repeat that example before treating the documentation as usable.
Record actual model names only when those models were tested.
Do not claim compatibility with every model from 1 successful review.

## 14. Track completion and handover

At the track milestone, review all evidence records and the final diff.
Then confirm these requirements.

- Every module has a complete passage inventory.
- Every revision names a specific learner problem.
- Every mathematical claim retains its values, conditions, and scope.
- Every unfamiliar term is explained before later text depends on it.
- Every changed interactive label matches the current control and output.
- Every guide and worked dialog has been checked in its relevant rendered states.
- Required verification commands passed on the final tree.
- Unavailable tools and unresolved questions are recorded honestly.
- The module inventory and handoff name completed and remaining work accurately.

Request 1 fresh review of the complete track before its authorised integration.
After that, resolve mathematical errors and unclear learner instructions before merging.
Preserve newer main changes and rerun the required checks on the merged tree.

The owner already authorised reviewed checkpoint pushes, main merges, and deployment for the maths implementation.
Therefore, follow that handoff’s integration instructions for completed implementation tracks.
Keep a language planning commit separate from claims that every lesson has been rewritten.

Use this continuation prompt when handing the language review to another agent.
Then include the latest module evidence records and implementation handoff.

```text
Read CLAUDE.md and docs/interview.md first.
Then read docs/maths-writing-guide.md and docs/superpowers/plans/2026-10-01-maths-language-review.md.
Review the assigned maths interview modules 1 at a time using this plan.
Write for adult learners who may also be learning English.
Inventory every learner-facing passage before editing.
State each passage’s concrete problem and preserve its mathematical claim, assumptions, and numerical evidence.
Introduce new ideas before relying on their technical names.
Use the guide’s examples, 5 review passes, interface checks, and evidence template.
Leave strong existing sentences intact.
Apply the requested writing skills when available, and record unavailable tools without invented scores.
Update the module inventory only after the relevant checks pass.
Preserve unrelated changes and follow the latest implementation handoff for commits, review, merge, and deployment.
Report completed modules, verification evidence, unresolved questions, and the next action.
```
