```yaml
track: information-theory
module_index: 12
module_title: Information and generalisation
status: Reviewed
base_commit: 05a893ab0bb041d00149299ce32677b20ab34b48
files_reviewed:
- _data/interview.yml
- _data/interview_math.yml
- _pages/interview/information-theory.md
- js/components/information-lessons.js
- css/information-theory.css
- scripts/test_information_lessons.js
- scripts/check_information_lessons.py
components_not_present:
- Modal calculation dialog; worked calculations are inline.
reader_prerequisites:
- The track prerequisite list
- Earlier modules in the 16-week sequence
terms_introduced:
- Expected generalisation gap
- Mutual-information bounds
- PAC-Bayes
- Stability
- Compression bounds
- Stochastic learning
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 12
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - Let S contain independent identically distributed training examples. Let W denote the output of a
    learning algorithm.
  - The generalisation gap equals population loss minus training loss. The displayed bound concerns its
    expectation over data and algorithm randomness.
  - Mutual information I(S;W) measures dependence between the particular training sample and the fitted
    model.
  - For uniformly sub-Gaussian losses, an expected generalisation gap is bounded using that information
    and sample size.
  - Sub-Gaussian means centred loss tails obey a Gaussian-style exponential bound. The scale must hold
    uniformly across fixed models.
  - PAC-Bayes instead compares distributions over hypotheses using posterior-to-prior KL. A conventional
    prior is independent of the current training sample.
  - These bounds can be loose or infinite. Deterministic algorithms on continuous data need particular
    care.
  - Xu and Raginsky prove the displayed expected-gap bound in Theorem 1 of their NeurIPS 2017 paper.
  preserved_claim:
  - '|\mathbb{E}[\operatorname{gap}]|\leq\sqrt{\frac{2\tau^2 \operatorname{I}(S;W)}{n}}'
- location: js/components/information-lessons.js experiment 12
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - Assume independent identically distributed examples and loss in [0,1]. Its uniform sub-Gaussian scale
    can be 1/2.
  - Increase sample size or reduce assumed information. Then compare the resulting upper bound on the
    absolute expected gap.
  - Convert the assumed information 16 bits to 11.0904 nats.
  - Substitute this value and sample size 128 into the theorem to obtain 0.2081.
  - This is an assumed-information calculation. It does not estimate dataset-model information or measure
    a trained model’s actual gap.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- No additional numerical claim beyond the explicitly stated formulas or examples requiring a separate
  evaluator.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - Assumed information in nats
    - 11.090354888959125
  - - Absolute expected-gap bound
    - 0.20813865278942442
  - - Training examples
    - 128
  checks: Known numerical cases, ELBO and uncertainty identities, noisy cascade inequalities, expected
    gain, JS, bounds, Fisher geometry and all model endpoints passed.
source_evidence:
- Xu and Raginsky, NeurIPS 2017, Theorem 1. The displayed bound uses a uniform tail scale and information
  in nats.
rendered_checks:
  desktop_dark: Passed
  desktop_light: Passed
  phone_dark: Passed
  phone_light: Passed
  lesson_playback: Passed
  lesson_reset: Passed
  lesson_scrub_both_directions: Passed
  guide_preserves_inputs: Passed
  curve_drag_and_keyboard: Passed where a curve handle is present
  phone_active_point_visibility: Passed after correcting the Fisher-point viewport issue
tool_checks:
  manual_language_review: Completed with the requested writing skills
  slop_or_not: Not used
  detector_score: null
  readability_grade: null
verification_commands:
- PAGES_DISABLE_NETWORK=1 make check
- make test
- python scripts/render_math.py --check
- ruby scripts/audit_interview_prose.rb
- python scripts/check_information_views.py http://localhost:4186
- git diff --check
- node scripts/test_information_lessons.js
- python scripts/check_information_lessons.py http://localhost:4186
unresolved_questions: []
review_commit: The commit containing this review record.
```
