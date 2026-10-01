```yaml
track: information-theory
module_index: 15
module_title: Fisher information, geometry and final projects
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
- Fisher information
- Score
- Information geometry
- Cramér-Rao bound
- Natural gradient
- Project design
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 15
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - For a differentiable parametric model, differentiate log density with respect to its parameters. This
    derivative is the score.
  - The expected outer product of the score gives the Fisher information matrix. It measures local distinguishability
    of parameter settings.
  - Under regularity conditions, small parameter changes make KL approximately half a quadratic form in
    this matrix.
  - Natural gradient rescales a loss gradient using Fisher information. It needs an invertible matrix
    or a specified regularised alternative.
  - The Cramér-Rao bound constrains unbiased estimator variance under its own regularity assumptions.
    It does not apply to every estimator.
  - For a final project, compare uncertainty methods, build a compressor, or investigate calibration under
    distribution shift.
  - Alternatively, study active learning, bottleneck representations, PAC-Bayes, or token perplexity.
    Report assumptions, calculations and evaluation results.
  preserved_claim:
  - F(\theta)=\mathbb{E}\left[\left[\nabla_{\theta}\log p(x\mid\theta)\right]\left[\nabla_{\theta}\log
    p(x\mid\theta)\right]^{\top}\right]
  - \operatorname{D}_{\mathrm{KL}}(p_{\theta}\|p_{\theta+\delta})=\frac12\delta^{\top}F(\theta)\delta+o(\|\delta\|^2)
- location: js/components/information-lessons.js experiment 15
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - Assume a Bernoulli model with interior probabilities. This experiment uses natural logarithms and
    reports KL in nats.
  - Reduce the displacement towards zero. Then compare exact KL with the quadratic Fisher approximation.
  - The starting probability is 0.5000. The comparison model probability is 0.5500.
  - The heads score equals 1/θ. Meanwhile, the tails score equals −1/(1−θ). Their expected squares sum
    to 4.0000.
  - Exact KL equals 0.0050 nats. Its quadratic approximation equals 0.0050 nats.
  - The absolute approximation error is 0.0000 nats. The approximation concerns small displacements.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- No additional numerical claim beyond the explicitly stated formulas or examples requiring a separate
  evaluator.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - Fisher information
    - 4
  - - Exact KL in nats
    - 0.005025167926750659
  - - Quadratic approximation in nats
    - 0.005000000000000001
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
