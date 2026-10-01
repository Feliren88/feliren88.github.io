```yaml
track: information-theory
module_index: 10
module_title: Information bottleneck and sufficient representations
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
- Information bottleneck
- Sufficient statistics
- Stochastic encoders
- Representation learning
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 10
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - Let U be the input and V the target. Then sample representation C from an encoder given U.
  - Then V to U to C forms the relevant Markov chain. Penalise retained input information while rewarding
    target information.
  - A sufficient representation preserves the input information needed to predict the target. Its conditional
    target distribution matches the original conditional distribution.
  - For continuous deterministic encoders, input-representation mutual information can be infinite. Noise,
    quantisation or other explicit assumptions make the objective usable.
  - The objective follows the information bottleneck method of Tishby, Pereira and Bialek.
  preserved_claim:
  - \min_{p(C\mid U)} \operatorname{I}(U;C)-\rho \operatorname{I}(C;V)
- location: js/components/information-lessons.js experiment 10
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - The input contains independent fair target and nuisance bits. The encoder flips target bits and randomly
    erases nuisance.
  - Reduce nuisance retention while holding target noise fixed. Then watch input information decrease
    without losing target information.
  - The noisy target contributes 1 − H₂(0.1000) = 0.5310 bits.
  - The independent nuisance bit contributes 0.8000 bits through its erasure channel.
  - Therefore, total input information equals 1.3310 bits. Subtract the weighted target reward to obtain
    0.2690.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- No additional numerical claim beyond the explicitly stated formulas or examples requiring a separate
  evaluator.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - Input information in bits
    - 1.331004406410719
  - - Target information in bits
    - 0.5310044064107188
  - - Bottleneck objective
    - 0.2689955935892814
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
