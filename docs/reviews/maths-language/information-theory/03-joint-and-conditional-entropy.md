```yaml
track: information-theory
module_index: 3
module_title: Joint and conditional entropy
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
- Joint entropy
- Conditional entropy
- Chain rule
- Feature uncertainty
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 3
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - Let U describe an input and V its label. Calculate label entropy separately for each input value.
  - Then average these conditional entropies using the input probabilities. The result is H(V given U).
  - The chain rule splits joint uncertainty into input uncertainty and remaining label uncertainty. Conditioning
    reduces discrete entropy on average.
  preserved_claim:
  - H(U,V)=H(U)+H(V\mid U)
  - H(V\mid U)=-\sum_{a,b}p(a,b)\log_2 p(b\mid a)
- location: js/components/information-lessons.js experiment 3
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - Choose an input probability and a label probability within each input group.
  - Reweight the groups. Then compare overall label uncertainty with uncertainty remaining inside each
    group.
  - Multiply each conditional label probability by the corresponding input probability to fill the joint
    table.
  - Then average group entropies. The conditional entropy equals 0.5000 × 0.4690 + 0.5000 × 0.7219.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- No additional numerical claim beyond the explicitly stated formulas or examples requiring a separate
  evaluator.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - Label entropy in bits
    - 0.9927744539878083
  - - Conditional entropy in bits
    - 0.5954618442383217
  - - Joint entropy in bits
    - 1.5954618442383217
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
