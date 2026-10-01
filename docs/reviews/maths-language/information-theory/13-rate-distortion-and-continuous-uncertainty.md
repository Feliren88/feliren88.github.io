```yaml
track: information-theory
module_index: 13
module_title: Rate-distortion and continuous uncertainty
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
- Rate-distortion function
- Hamming distortion
- Quantisation
- Neural compression
- Differential entropy
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 13
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - Choose a distortion function measuring the cost of reconstructing an input incorrectly. Then constrain
    its expected value.
  - Among reconstruction channels satisfying that constraint, minimise input-reconstruction mutual information.
    This defines the rate-distortion function.
  - For a fair binary source and Hamming distortion, the rate equals 1 minus binary entropy for D between
    0 and 0.5.
  - Hamming distortion counts unequal bits. At D equal to 0.5, zero transmitted bits suffice under average
    distortion.
  - For continuous variables, differential entropy integrates negative log density. It can be negative
    and changes when units change.
  - For a nonzero scale a, differential entropy of aU equals entropy of U plus log absolute a.
  - However, KL and mutual information remain invariant under suitable invertible coordinate changes.
    Lossy representations still require a specified distortion.
  preserved_claim:
  - \mathcal{R}(\Delta)=\inf_{p(\hat U\mid U):\mathbb{E}[d(U,\hat U)]\leq\Delta}\operatorname{I}(U;\hat
    U)
  - \mathcal{R}(\Delta)=1-H_2(\Delta),\quad 0\leq\Delta\leq\frac12
  - h(U)=-\int p(a)\log p(a)\,da
  - h(aU)=h(U)+\log|a|
- location: js/components/information-lessons.js experiment 13
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - The rate curve uses independent fair bits with Hamming distortion. The separate density is uniform
    on [0, scale].
  - Increase tolerated bit errors to reduce rate. Then change the continuous scale to see its effect on
    differential entropy.
  - For distortion 0.1000, error entropy equals 0.4690 bits. Subtract it from 1.
  - The continuous uniform density has height 1.0000 and width 1.0000. Their product equals 1.
  - Its differential entropy equals log₂(width). Therefore, shrinking width below 1 makes this quantity
    negative.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- scripts/test_information_theory.js verifies relevant identities and independently specified expected
  values.
- scripts/check_information_views.py exercises all 6 experiment modes, endpoints, playback, step and reset.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - Minimum rate in bits
    - 0.5310044064107188
  - - Density height
    - 1
  - - Differential entropy in bits
    - 0
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
