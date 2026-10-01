```yaml
track: information-theory
module_index: 8
module_title: Bayesian information and active learning
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
- Prior
- Posterior
- Likelihood
- Information gain
- Active learning
- Experimental design
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 8
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - Assume a coin has heads probability 1/2 or 3/4, with equal prior weights. Observe 3 heads followed
    by 1 tail.
  - The sequence likelihoods are 16/256 and 27/256. Therefore, the posterior weights become 16/43 and
    27/43.
  - Posterior-to-prior KL measures realised information gain. However, a particular observation need not
    reduce posterior entropy.
  - Averaging this KL over possible observations gives mutual information between parameters and data.
    Active learning chooses observations with large expected gain.
  preserved_claim:
  - p(\theta\mid D)=\frac{p(D\mid\theta)p(\theta)}{p(D)}
  - \mathbb{E}_{D}\operatorname{D}_{\mathrm{KL}}(p(\theta\mid D)\|p(\theta))=\operatorname{I}(\theta;D)
- location: js/components/information-lessons.js experiment 8
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - The 2 candidate coins have heads probabilities 1/2 and 3/4. Tosses are independent given the candidate.
  - Add observed heads or tails. Then compare realised information gain with expected gain from 1 further
    toss.
  - Multiply the 2 prior weights by their sequence likelihoods. Then divide by the total weight.
  - The posterior weight for coin 3/4 equals 0.6279. Posterior-to-prior KL equals 0.0477 bits.
  - For the next toss, average its possible posterior KL values using posterior-predictive heads and tails
    probabilities.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- scripts/test_information_theory.js verifies relevant identities and independently specified expected
  values.
- scripts/check_information_views.py exercises all 6 experiment modes, endpoints, playback, step and reset.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - Posterior weight for 3/4
    - 0.627906976744186
  - - Realised gain in bits
    - 0.047734374563335846
  - - Next-toss expected gain in bits
    - 0.04618219594133505
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
