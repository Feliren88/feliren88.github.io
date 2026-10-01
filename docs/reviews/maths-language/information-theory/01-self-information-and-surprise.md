```yaml
track: information-theory
module_index: 1
module_title: Self-information and surprise
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
- Self-information
- Bits
- Nats
- Logarithms
- Log-loss
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 1
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - An event with probability 1/8 contributes 3 bits because minus log base 2 of 1/8 equals 3.
  - Meanwhile, an event with probability 1 contributes 0 bits. Less probable observations contribute more
    information.
  - For independent events, multiply probabilities. Therefore, their negative logarithms add. Natural
    logarithms measure information in nats.
  preserved_claim:
  - \operatorname{Info}(a)=-\log_2 p(a)
- location: js/components/information-lessons.js experiment 1
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - Assume the event has a positive probability. Logarithms use base 2.
  - Reduce the event probability. Then watch its surprise increase along the logarithmic curve.
  - Read the assigned event probability 0.2500.
  - Then take its base-2 logarithm and change its sign. The result equals 2.0000 bits.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- scripts/test_information_theory.js verifies relevant identities and independently specified expected
  values.
- scripts/check_information_views.py exercises all 6 experiment modes, endpoints, playback, step and reset.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - Event probability
    - 0.25
  - - Surprise in bits
    - 2
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
