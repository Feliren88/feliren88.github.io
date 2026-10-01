```yaml
track: information-theory
module_index: 7
module_title: Coding, compression and description length
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
- Prefix codes
- Kraft inequality
- Huffman coding
- Arithmetic coding
- Typical sequences
- Source coding theorem
- Minimum Description Length
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 7
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - For probabilities [1/2, 1/4, 1/8, 1/8], use codewords 0, 10, 110 and 111.
  - Their average length is 0.5 times 1 plus 0.25 times 2 plus 0.25 times 3. Therefore, the mean equals
    1.75 bits.
  - A prefix code ensures no codeword begins another. Huffman coding repeatedly merges the 2 least probable
    symbols.
  - Kraft inequality constrains prefix-code lengths. For a finite discrete source, optimal binary prefix
    codes satisfy entropy at most mean length, below entropy plus 1.
  - For independent identically distributed blocks, longer codes approach entropy per symbol. Arithmetic
    coding uses sequence probability intervals.
  - Minimum Description Length also counts the model description. Therefore, its model cost can offset
    improvements in data compression.
  preserved_claim:
  - H(U)\leq\bar{c}<H(U)+1
  - \sum_a 2^{-c_a}\leq1
  - \operatorname{Cost}=\operatorname{bits}(\operatorname{model})+\operatorname{bits}(\operatorname{data}\mid\operatorname{model})
- location: js/components/information-lessons.js experiment 7
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - Blend the chosen probabilities [1/2, 1/4, 1/8, 1/8] towards [1/4, 1/4, 1/4, 1/4].
  - Rebuild the Huffman tree as probabilities change. Then compare its mean length with entropy.
  - Merge the 2 smallest probability weights, then repeat until 1 root remains.
  - Read the displayed paths as codewords. Their probability-weighted mean length equals 1.7500 bits.
  - The source entropy equals 1.7500 bits. Each codeword is an integer-length binary description.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- scripts/test_information_theory.js verifies relevant identities and independently specified expected
  values.
- scripts/check_information_views.py exercises all 6 experiment modes, endpoints, playback, step and reset.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - Source entropy in bits
    - 1.75
  - - Mean code length in bits
    - 1.75
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
