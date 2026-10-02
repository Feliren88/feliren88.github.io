# Statistics animation review

This review covers the 6 new Bayesian and 8 new Frequentist worked examples.
Their original lesson prose and source lists remain outside this review.
The learner needs the prerequisites already listed by each track.
Each example states its inputs and conditions before explaining the operation.

| Bayesian example | Preserved calculation and conditions |
| --- | --- |
| Evidence update | Prior [0.3, 0.7], likelihood [0.8, 0.2], weights [0.24, 0.14], posterior [12/19, 7/19]. |
| Prior sensitivity | Conditional independence given shared probability; Beta(1,1), Beta(2,2), Beta(8,2) update after 8 successes and 2 failures. |
| Finite posterior | Equal prior masses at [0.2, 0.5, 0.8]; conditionally independent ordered observations give likelihoods [0.032, 0.125, 0.128]. |
| Partial pooling | Known normal prior mean 10, prior variance 1, observation variance 4; posterior weight 0.2 gives means [9.2, 10, 10.8]. |
| Posterior prediction | Beta(5,2) yields 2-toss predictive masses [6/56, 20/56, 30/56]; conditional independence differs from marginal dependence. |
| Variational approximation | KL in bits to posterior [0.8, 0.2] decreases from 0.321928 to 0.040637, then 0; ELBO equals log evidence minus posterior KL. |

| Frequentist example | Preserved calculation and conditions |
| --- | --- |
| Sampling distribution | Two independent Bernoulli(0.5) observations give mean masses [0.25, 0.5, 0.25], expectation 0.5 and variance 0.125. |
| Likelihood | Three successes and 1 failure give ordered-sample likelihood p³(1−p), maximised at 3/4. |
| Interval | Independent normal data, known deviation 2, sample size 16, sample mean 10, standard error 0.5, normal interval [9.02, 10.98]. |
| Test | The same known-variance assumptions give z = 2 and two-sided null tail probability approximately 0.0455003. |
| Multiplicity | Twenty independent true-null tests at 0.05 give probability 1−0.95²⁰ of at least 1 false rejection; Bonferroni also allows dependence. |
| Experiment | Independent randomised groups with 20/100 and 30/100 successes give difference 0.1 and unpooled standard error approximately 0.0608276. |
| Adjustment | Severity weighting yields crude rates [0.48, 0.62] and equal-weight adjusted rates [0.6, 0.5]; causal interpretation requires stated assumptions. |
| Regression | Points [(1,2), (2,2), (3,5)] give slope 1.5, intercept 0, residuals [0.5, −1, 0.5] and squared-residual sum 1.5. |

Displayed decimals are rounded, and the narrator identifies illustrative inputs.
An independent reviewer checked the arithmetic and requested the conditional-independence clarification.
The implementation incorporated that clarification before publication.
Moreover, manual humanisation preserved the assumptions and removed unnecessary framing.
No detector score or measured readability grade is claimed.
