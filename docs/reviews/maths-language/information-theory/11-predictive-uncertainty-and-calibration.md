```yaml
track: information-theory
module_index: 11
module_title: Predictive uncertainty and calibration
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
- Aleatoric uncertainty
- Epistemic uncertainty
- Predictive entropy
- Calibration
- Brier score
- Expected calibration error
- Temperature scaling
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 11
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - Average model predictions using posterior parameter weights. Then compute the entropy of that averaged
    predictive distribution.
  - The average of individual model entropies describes uncertainty remaining when parameters are specified.
    This is aleatoric uncertainty under the model.
  - The difference is mutual information between the prediction and parameters. This measures epistemic
    uncertainty under the posterior.
  - However, low predictive entropy can accompany incorrect predictions. Calibration compares stated probabilities
    with observed frequencies.
  - Reliability diagrams group predictions by confidence. The Brier score and negative log-likelihood
    evaluate probabilistic predictions.
  - Expected calibration error depends on binning. Temperature scaling fits a positive logit scale on
    held-out data.
  - Moreover, distribution shift can invalidate calibration measured on the original population. Compare
    ensemble uncertainty with single-model uncertainty.
  preserved_claim:
  - H(V\mid x,D)=\mathbb{E}_{p(\theta\mid D)}H(V\mid x,\theta)+\operatorname{I}(V;\theta\mid x,D)
- location: js/components/information-lessons.js experiment 11
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - Assume 2 candidate classifiers with posterior weights w and 1−w at a fixed input.
  - Compare their average prediction with their individual uncertainties. Then compare predicted and observed
    positive-label frequencies.
  - The weighted positive-label probability equals 0.5000 × 0.1000 + 0.5000 × 0.9000 = 0.5000.
  - Average individual model entropies to obtain 0.4690 bits. Subtract this from predictive entropy to
    obtain 0.5310 bits.
  - The chosen observed frequency 0.8000 differs from predicted frequency by 0.3000.
  - This single group illustrates a calibration comparison. It cannot establish calibration across inputs
    or quantify sampling error.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- No additional numerical claim beyond the explicitly stated formulas or examples requiring a separate
  evaluator.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - Predictive entropy in bits
    - 1
  - - Aleatoric term in bits
    - 0.46899559358928117
  - - Epistemic term in bits
    - 0.5310044064107189
  - - Predicted positive-label probability
    - 0.5
  - - Observed-minus-predicted frequency
    - 0.30000000000000004
  checks: Known numerical cases, ELBO and uncertainty identities, noisy cascade inequalities, expected
    gain, JS, bounds, Fisher geometry and all model endpoints passed.
source_evidence:
- Cover and Thomas for classical information quantities
- The learner source list links the relevant books and original research papers
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
