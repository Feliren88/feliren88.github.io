```yaml
track: information-theory
module_index: 2
module_title: Shannon entropy
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
- Shannon entropy
- Binary entropy
- Expected surprise
- Maximum entropy
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 2
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - For a fair coin, each outcome contributes 1 bit of surprise. Therefore, their probability-weighted
    average equals 1 bit.
  - More generally, multiply each event surprise by its probability, then add the products. This average
    is Shannon entropy.
  - A Bernoulli distribution describes 2 outcomes with probabilities u and 1 minus u. Its entropy peaks
    at u equal to 0.5.
  preserved_claim:
  - H(U)=-\sum_a p(a)\log_2 p(a)
  - H(U)=-u\log_2 u-(1-u)\log_2(1-u)
- location: js/components/information-lessons.js experiment 2
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - Assume a binary variable. A zero-probability outcome contributes zero expected surprise.
  - Multiply each outcome surprise by its probability. Then add the 2 contributions.
  - The first weighted contribution equals 0.5000 bits. The second equals 0.5000 bits.
  - Therefore, expected surprise equals their sum, 1.0000 bits.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- scripts/test_information_theory.js verifies relevant identities and independently specified expected
  values.
- scripts/check_information_views.py exercises all 6 experiment modes, endpoints, playback, step and reset.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - First contribution in bits
    - 0.5
  - - Second contribution in bits
    - 0.5
  - - Entropy in bits
    - 1
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
