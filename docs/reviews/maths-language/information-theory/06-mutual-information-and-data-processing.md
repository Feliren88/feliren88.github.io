```yaml
track: information-theory
module_index: 6
module_title: Mutual information and data processing
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
- Mutual information
- Data-processing inequality
- Markov chain
- Feature selection
- Contrastive learning
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 6
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - Subtract conditional label entropy from label entropy. The result measures how much the input reveals
    about the label.
  - Equivalently, compare the joint distribution with the product of its marginals using KL divergence.
    Independence gives zero mutual information.
  - A Markov chain U to V to C means C depends on U only through V. Then I(U;C) cannot exceed I(U;V).
  - For a representation C computed from input U, the relevant chain is V to U to C. Therefore, I(V;C)
    cannot exceed I(V;U).
  - Moreover, feature screening can miss interactions. Individually uninformative features can jointly
    predict a label.
  preserved_claim:
  - \operatorname{I}(U;V)=H(V)-H(V\mid U)=\operatorname{D}_{\mathrm{KL}}(p(U,V)\|p(U)p(V))
  - \operatorname{I}(U;V)=H(U)+H(V)-H(U,V)
  - V\rightarrow U\rightarrow C\quad\Rightarrow\quad\operatorname{I}(V;C)\leq\operatorname{I}(V;U)
- location: js/components/information-lessons.js experiment 6
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - Assume a fair input bit and independent flips in each stage. The chain is input to middle to output.
  - Increase second-stage noise. Then watch information about the original input decrease.
  - A final bit flips when exactly 1 stage flips it. Add a(1−b) and (1−a)b.
  - The resulting error probability equals 0.2600. Therefore, output information equals 1 − H₂(error).
  - The final information 0.1733 cannot exceed the first-stage information 0.5310 bits.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- scripts/test_information_theory.js verifies relevant identities and independently specified expected
  values.
- scripts/check_information_views.py exercises all 6 experiment modes, endpoints, playback, step and reset.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - First-stage information in bits
    - 0.5310044064107188
  - - Final information in bits
    - 0.17325362750738216
  - - Combined flip probability
    - 0.26
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
