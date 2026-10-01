```yaml
track: information-theory
module_index: 4
module_title: Relative entropy and distribution mismatch
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
- KL divergence
- Gibbs inequality
- Support mismatch
- Jensen inequality
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 4
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - Let P describe the data distribution and Q the model distribution. Compare their probabilities at
    each possible outcome.
  - Then average the logarithm of P divided by Q using probabilities from P. This gives Kullback-Leibler
    divergence.
  - Gibbs inequality makes this divergence nonnegative. However, swapping P and Q can change its value.
  preserved_claim:
  - \operatorname{D}_{\mathrm{KL}}(P\|Q)=\sum_a P(a)\log_2\frac{P(a)}{Q(a)}\geq0
  - \operatorname{D}_{\mathrm{KL}}(P\|Q)=-\mathbb{E}_{P}\log_2\frac{Q(a)}{P(a)}\geq-\log_2\sum_{a:P(a)>0}Q(a)\geq0
- location: js/components/information-lessons.js experiment 4
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - Assume both binary distributions assign positive probability to each outcome.
  - Move either probability. Then compare divergences weighted by P and by Q.
  - The forward divergence weights log probability ratios by P. Its value equals 0.7706 bits.
  - The reverse divergence weights the reversed ratios by Q. Its value equals 0.8406 bits.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- scripts/test_information_theory.js verifies relevant identities and independently specified expected
  values.
- scripts/check_information_views.py exercises all 6 experiment modes, endpoints, playback, step and reset.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - KL(P ∥ Q) in bits
    - 0.7705590150115547
  - - KL(Q ∥ P) in bits
    - 0.8406371956566698
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
