```yaml
track: information-theory
module_index: 5
module_title: Cross-entropy, likelihood and fitting
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
- Cross-entropy
- Negative log-likelihood
- Maximum likelihood
- One-hot labels
- Knowledge distillation
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 5
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - For P equal to [0.5, 0.5] and Q equal to [0.25, 0.75], cross-entropy is approximately 1.208 bits.
  - The data entropy is 1 bit. Therefore, approximately 0.208 bits of this loss come from distribution
    mismatch.
  - For independent observations, negative log-likelihood adds the observed negative log probabilities.
    Its sample average equals empirical cross-entropy.
  - Moreover, a one-hot class label selects the predicted probability of the observed class. Minimising
    its negative logarithm fits a classifier.
  preserved_claim:
  - H(P,Q)=H(P)+\operatorname{D}_{\mathrm{KL}}(P\|Q)
  - -\frac1n\log\prod_{i=1}^{n}q(x_i)=-\frac1n\sum_{i=1}^{n}\log q(x_i)
- location: js/components/information-lessons.js experiment 5
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - Assume independent tosses with a shared unknown heads probability. Both observed counts are positive.
  - Move the model probability along the loss curve. Its minimum follows the observed heads fraction.
  - The sequence negative log-likelihood equals −7 log₂(q) − 3 log₂(1−q).
  - Divide its current value 13.7025 by 10 tosses to obtain 1.3702 bits.
  - Differentiating this loss gives its minimum at the observed heads fraction 0.7000.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- scripts/test_information_theory.js verifies relevant identities and independently specified expected
  values.
- scripts/check_information_views.py exercises all 6 experiment modes, endpoints, playback, step and reset.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - Fitted heads probability
    - 0.7
  - - Mean log-loss in bits
    - 1.370247867765272
  - - Minimum mean loss in bits
    - 0.8812908992306927
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
