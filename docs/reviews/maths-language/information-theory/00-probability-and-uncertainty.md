```yaml
track: information-theory
module_index: 0
module_title: Probability and uncertainty
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
- Joint distribution
- Marginal distribution
- Conditional probability
- Independence
- Expectation
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 0
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - Suppose a coin lands heads with probability 0.9. Its 2 possible outcomes still have probabilities
    summing to 1.
  - However, a fair coin gives each outcome probability 0.5. A probability describes an event; a distribution
    describes all outcomes.
  - For jointly observed variables, add joint probabilities to obtain a marginal distribution. Then divide
    by a positive marginal to obtain a conditional probability.
  preserved_claim:
  - p(a\mid b)=\frac{p(a,b)}{p(b)}
- location: js/components/information-lessons.js experiment 0
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - Assume 2 outcomes, rain and dry. Their probabilities must sum to 1.
  - Change the rain probability. Then compare the 2 outcome weights and their entropy.
  - Assign rain weight 0.9000. Then assign the remaining weight 0.1000 to dry.
  - The 2 probabilities sum to 1. Their entropy equals 0.4690 bits.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- The illustrative binary probabilities 0.9 and 0.1, and 0.5 and 0.5, sum to 1.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - Rain probability
    - 0.9
  - - Dry probability
    - 0.09999999999999998
  - - Entropy in bits
    - 0.4689955935892811
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
