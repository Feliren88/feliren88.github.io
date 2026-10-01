```yaml
track: information-theory
module_index: 14
module_title: Generative models and distribution objectives
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
- Autoregressive likelihood
- Perplexity
- VAEs
- Jensen-Shannon divergence
- GANs
- Diffusion models
passages_kept: []
passages_revised:
- location: _data/interview.yml information-theory module 14
  original: New course material adapted from the supplied syllabus.
  problem: The course needs concise explanations, stated assumptions and narrated diagrams.
  revision:
  - An autoregressive model predicts each token given earlier tokens. Its sequence negative log-likelihood
    adds token losses.
  - Perplexity exponentiates mean token loss. Use exponentiation base e for nats or base 2 for bits.
  - A variational autoencoder maximises the ELBO. Its reconstruction term is a log likelihood, so its
    form depends on the observation model.
  - Jensen-Shannon divergence averages KL divergences to the mixture distribution. It is symmetric and
    bounded by 1 bit.
  - The original idealised GAN minimax objective relates to Jensen-Shannon divergence with an optimal
    discriminator. Practical GAN losses can differ.
  - Diffusion models use noisy observations, score estimation and variational bounds. Common denoising
    objectives depend on their weighting and parameterisation.
  - Goodfellow and colleagues derive this relationship in Equation 6 of their NeurIPS 2014 paper.
  preserved_claim:
  - \operatorname{PPL}=\exp\left(-\frac1T\sum_{t=1}^{T}\log p(x_t\mid x_{<t})\right)
  - \operatorname{D}_{\mathrm{JS}}(P\|Q)=\frac12\operatorname{D}_{\mathrm{KL}}(P\|M)+\frac12\operatorname{D}_{\mathrm{KL}}(Q\|M),\quad
    M=\frac{P+Q}{2}
- location: js/components/information-lessons.js experiment 14
  original: The lesson originally had a narrated diagram without its own editable numerical model.
  problem: The reader could not explore this calculation within the lesson.
  revision:
  - Assume 2 tokens with fixed data frequencies P. The model uses the same probabilities at every position.
  - Move model probabilities towards data frequencies. Then compare token cross-entropy, perplexity and
    distribution divergence.
  - Data-weighted negative log model probabilities give mean token loss 1.3702 bits.
  - Exponentiate with base 2 because the loss uses bits. The result is 2.5851.
  - Compare each distribution with the equal mixture and average both KL values. JS divergence equals
    0.1187 bits.
  preserved_claim: The stated finite model, units and calculation assumptions.
numerical_evidence:
- No additional numerical claim beyond the explicitly stated formulas or examples requiring a separate
  evaluator.
- suite: scripts/test_information_lessons.js
  default_display_readouts:
  - - Mean token loss in bits
    - 1.3702478677652719
  - - Perplexity
    - 2.585149774713454
  - - JS divergence in bits
    - 0.1187091007693073
  checks: Known numerical cases, ELBO and uncertainty identities, noisy cascade inequalities, expected
    gain, JS, bounds, Fisher geometry and all model endpoints passed.
source_evidence:
- Goodfellow and colleagues, NeurIPS 2014, Equation 6. The divergence relationship assumes an optimal
  discriminator.
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
