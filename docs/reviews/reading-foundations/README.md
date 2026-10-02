# Equation-reading preparation

This review covers 7 new worked examples within existing interview modules.
It does not certify a learner's readiness for every paper or review all existing track prose.
The external energy-model notebook informed the gap analysis but remains outside learner content.

| Example and prerequisites | Claim and conditions |
| --- | --- |
| Mathematics, module 1, after functions and sums | Consistent dummy-variable renaming preserves an integral. For Fθ(x)=θx³/3, the partial derivatives fix the other argument. |
| Information Theory, module 1, after sums and exponentials | Scores [0,θ] normalise to masses [1,exp(θ)]/[1+exp(θ)]. Continuous normalisation requires a finite positive integral. |
| Calculus, module 5, after the chain rule and score normalisation | The derivative of log Z equals a model expectation. Differentiating continuous integrals requires conditions, and moving support can add boundary terms. |
| Frequentist Statistics, module 2, after likelihood and the normaliser derivative | The empirical loss gradient equals the model feature average minus the observed average 0.8. Finite chain estimates can introduce bias. |
| Bayesian Statistics, module 3, after gradients and normal variables | The standard-normal Langevin discretisation has stationary variance 1/(1−h/2) for 0<h<2. The display uses a reproducible illustrative path. |
| Deep Learning, module 4, after the chain rule | For L=(wx)²/2 at w=2,x=3, the input gradient is 12 and the weight gradient is 18. Freezing weights preserves input derivatives; detachment cuts graph history. |
| Computer Vision, module 1, after convolution arithmetic | The stated convolution maps [B,1,28,28] to [B,4,14,14]. Flattening preserves B. Sum and mean scale gradients differently. |

The passage inventory includes introductions, prerequisites, symbols, derivations, live diagrams, captions, controls, notes, and recall answers.
The equations are authored Unicode expressions rather than entries in the generated MathML table.
Therefore, the static derivation remains available when JavaScript is disabled.
The hub route and shared readiness statement explain the observable reading goal.

The numerical checks independently compare analytic gradients with finite differences.
The browser checks verify module placement, control changes, caption alignment, backward scrubbing, playback, and reset.
Moreover, they cover desktop and phone layouts, both themes, enlarged text, reduced motion, and static recall answers.
The independent reviewer confirmed the derivatives, update signs, stationary variance, convolution dimensions, and gradient-tracking semantics.
The review also improved tensor initialisation, output-height definitions, expectation notation, and changed-value assertions.

The phone check exposed an existing Calculus view selector overflowing at enlarged text sizes.
Its label now wraps the selector within the available width.
Moreover, the sampling diagram scrolls horizontally so its axis labels remain readable on phones.
The same check found an existing image-editing comparison table extending beyond the phone viewport.
Its container now permits keyboard-accessible horizontal scrolling.

| Check | Result |
| --- | --- |
| `make check` | The final build passed and the SEO audit reported 0 flags. |
| `make test` | All tooling, distribution, lab, Information Theory, and new calculation checks passed. |
| New calculation checks | Analytic derivatives agreed with independent finite differences. |
| Prose audit | The existing audit passed. A separate scan checked all new authored sentence openings and prose colons. |
| Browser walkthroughs | All 7 examples passed at 1400px and 390px, in light and dark themes. |
| Interaction | Live values, caption alignment, backwards scrubbing, keyboard controls, playback, reset, and recall answers passed. |
| Accessible reading | Enlarged text at scale 1.6 and reduced motion passed. The displayed Python code compiled. |
| Static fallback | All 7 complete derivations and recall answers remained available without JavaScript. |
| Hub route | Every route reached an existing fragment on its destination page. |

Implementation and review are complete for these new examples.
No detector score or measured readability grade is claimed.
