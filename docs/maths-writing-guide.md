# Writing maths lessons for people who are learning

The reader is learning the maths while also reading the English.
Therefore, each explanation must make both tasks manageable.
Use this guide for interview lessons, equations, diagrams, interactive guides, and worked calculations.
Then follow [the editing plan](superpowers/plans/2026-10-01-maths-language-review.md) to apply these rules across the repository.

## 1. Start here

Read this section before changing any lesson.
After that, use the relevant examples and checks below.

1. Identify what the reader already knows from earlier lessons.
2. Choose a small example and verify its calculation.
3. Explain what the input, operation, and result mean.
4. Introduce the technical name alongside that example.
5. Explain the general rule and its assumptions.
6. Describe what the reader can change and what they should observe.
7. Check that the edited words still match the maths and interface.

Each paragraph should help the reader calculate, interpret, compare, or use something.
Therefore, remove sentences that only announce importance or praise the subject.

## 2. Audience and scope

Assume the reader can count, compare numbers, and perform basic arithmetic.
However, check each module before assuming familiarity with fractions, graphs, probability, or algebraic notation.
The reader may also be learning English as an additional language.
Therefore, use common words, direct sentences, and examples with stated inputs.

Write for an adult learner preparing for technical interviews.
Explain difficult ideas without childish language, invented stories, or false reassurance.
Moreover, preserve technical terms the reader will encounter in textbooks and interviews.
Introduce their meaning before using them to explain another idea.

This guide covers 45 modules across these tracks.
Therefore, apply the same writing standard to existing lessons and future additions.

| Track | Modules | Starting knowledge to check |
| --- | ---: | --- |
| Mathematics | 10 | Arithmetic, fractions, and reading a simple graph |
| Linear Algebra | 7 | Algebraic expressions, coordinates, and vectors |
| Calculus | 7 | Functions, graphs, and changes in inputs |
| Mathematical Proof | 7 | Statements, examples, and basic logical words |
| Bayesian Statistics | 6 | Probability, conditional probability, and distributions |
| Frequentist Statistics | 8 | Samples, population quantities, and distributions |

These are planning checks, not reasons to skip explanations.
If an earlier lesson introduces an idea, name that lesson when the dependency matters.
Otherwise, introduce the idea in the current module before using it.

## 3. Sentence rules

### State the action or claim directly

Name the quantity, operation, or person responsible for the action.
Then say what changes or what the result means.

| Vague wording | Useful wording |
| --- | --- |
| The result is obtained through multiplication. | Multiply each entry by 2. |
| This provides insight into the function. | The slope tells you how quickly the output changes near this input. |
| The behaviour can be observed in the visualisation. | Drag the point right and watch the slope increase. |
| The dimensions must be taken into consideration. | Check the number of rows and columns before multiplying the matrices. |
| This demonstrates a fundamental relationship. | The 2 paths contribute derivatives 4 and −2, which add to 2. |

### Keep each sentence manageable

Aim for about 14 words per sentence and keep body sentences within 17 words.
However, retain necessary mathematical notation and established technical names.
Count ordinary words after removing markup, rather than counting HTML attributes or equation syntax.

Split a sentence when it asks the reader to follow several operations or assumptions.
Then check that the split preserves the reason linking those operations.
Do not split an explanation into disconnected fragments to meet the length target.

For example, use this pair.

> Multiply the slope of sine by the slope of the square.
> Therefore, the total derivative at x = 1 is 2 × cos(1), about 1.0806.

### Connect ideas with their actual relationship

Use a linking word when moving between related sentences or paragraphs.
Then choose the word according to the relationship, rather than rotating synonyms for variety.

| Relationship | Useful linking words | Example |
| --- | --- | --- |
| Sequence | Then, Next, After that | Then divide the output change by the input change. |
| Cause or deduction | So, Therefore, Because | Therefore, the 2 contributions add to the input derivative. |
| Contrast | But, However, Although | However, this point has no finite derivative. |
| Example | For example | For example, x = 2 gives x² = 4. |
| Addition | Also, Moreover | Also, check the result’s units. |
| Comparison | Similarly, By comparison | Similarly, each output has its own row of derivatives. |

Prefer familiar transitions when they express the relationship accurately.
However, a transition cannot replace a missing calculation or explanation.
If you write “Therefore”, check that the preceding statement supports the conclusion.
If you write “Meanwhile”, check that you describe simultaneous actions or a clear comparison.

### Follow the owner’s punctuation and language rules

Start every prose sentence with an uppercase letter.
Use British spelling, including “behaviour”, “normalise”, “modelling”, and “optimisation”.
Moreover, use numerals for quantities and avoid em dashes in body prose.

Use a prose colon only when introducing an explicit definition.
Otherwise, use a full sentence, a heading, or a separate list.
Code, URLs, mathematical notation, JSON, YAML, and command syntax retain their required punctuation.

Do not repeat the same sentence shape throughout a lesson.
Instead, vary the wording according to the calculation, comparison, or action being explained.

## 4. Plan the reader’s next step

A teaching beat is a passage that helps the reader understand 1 new idea.
Before drafting, list what each beat requires and what it introduces.
Then place the beats in an order that makes those dependencies available.

For example, a derivative lesson can follow this sequence.

| Beat | Reader needs | Passage introduces |
| --- | --- | --- |
| Calculate 2 outputs | Squaring a number | Input change and output change |
| Join the points | Coordinates on a graph | A secant as the line joining 2 points |
| Divide the changes | Division and the 2 changes | The slope of that line |
| Move the points closer | The slope calculation | A limiting slope and the tangent |
| Name the derivative | The limiting slope | The derivative at an input |
| Examine a corner | The derivative idea | Different left and right slopes |

This sequence grounds the idea before later passages rely on its name.
However, other modules need different sequences because they start from different questions.
Do not force every lesson into the derivative example’s structure.

Use this planning worksheet before writing a module.
Then replace every placeholder with information from the actual lesson.

```yaml
track: calculus
module_id: 0
module_title: Derivatives
reader_knows:
  - Squaring a number
  - Coordinates on a graph
reader_will_learn:
  - How a slope calculation approaches a derivative
opening_example:
  inputs: [1, 2]
  operation: Square both inputs
  outputs: [1, 4]
  calculation: (4 - 1) / (2 - 1) = 3
  verification: Direct arithmetic and the independent numerical check
new_terms:
  - term: Secant
    meaning: A line through 2 points on the curve
    introduced_before: The secant slope calculation
beats:
  - purpose: Calculate the changes
    requires: [Squaring a number]
    introduces: [Input change, Output change]
    visible_evidence: Points at (1, 1) and (2, 4)
assumptions:
  - The 2 inputs differ when calculating the secant slope
edge_case:
  input: 0
  function: Absolute value
  explanation: The left and right slopes differ
interview_check:
  task: Explain why the corner has no derivative
```

## 5. Introduce terms without writing a glossary

Begin with the operation or observation the reader can follow.
Then introduce its name and return to the calculation.

| Term | Learner-friendly introduction |
| --- | --- |
| Vector | The arrow moves 2 units right and 1 unit up. We write that vector as (2, 1). |
| Matrix | Arrange the coefficients in rows and columns. This table is a matrix. |
| Norm | This arrow has length 5. Its norm measures that length. |
| Gradient | Collect the output’s rate of change for each input. This vector is the gradient. |
| Jacobian | List each output’s derivatives for every input. This table is the Jacobian. |
| Hessian | Differentiate each first derivative with respect to every input. The resulting table is the Hessian. |
| Eigenvector | This matrix changes the arrow’s length while preserving its line. Such an arrow is an eigenvector. |
| Likelihood | Fix the observed data. Then view their probability or density as a function of the parameter. |
| Prior | Describe plausible parameter values before using the current data. This distribution is the prior. |
| Posterior | Update those parameter probabilities using the observed data. The resulting distribution is the posterior. |
| Estimator | Use a rule to calculate a population quantity from a sample. That rule is an estimator. |
| Estimate | Apply the estimator to these observations. The resulting number is the estimate. |

These introductions need the surrounding module’s assumptions and notation.
Therefore, adapt them to the actual example before copying them.
For example, a norm need not mean ordinary Euclidean length in every module.
Likewise, a likelihood is not a probability distribution over parameter values by itself.

Use the same name for the same quantity throughout the lesson.
Then distinguish related quantities explicitly, such as an estimator and its realised estimate.
Do not replace “vector” with several decorative synonyms to avoid repetition.

## 6. Explain an equation in words

Before showing an equation, identify the question it answers.
Then define each unfamiliar symbol and explain the operations in their reading order.

For example, explain an average this way.

> Add the 4 observations, 2, 4, 6, and 8, to get 20.
> Then divide by 4, giving an average of 5.
> We write the general calculation as x̄ = (x₁ + ⋯ + xₙ)/n.
> Here, n counts the observations, and xᵢ names observation i.

After that, explain what the answer means in the example.
If the observations measure seconds, the average also measures seconds.

### State shapes and orientation

For a vector or matrix, name its number of entries, rows, or columns.
Then show how those dimensions fit the operation.

> W has 3 rows and 2 columns.
> Meanwhile, x is a column with 2 entries.
> Therefore, Wx produces 3 output entries, with 1 dot product for each row.

When using a transpose, explain its effect before relying on the symbol.

> Transposing W swaps its rows and columns, giving Wᵀ shape 2 × 3.
> Therefore, Wᵀ can multiply a column containing 3 score derivatives.

### State approximation and uncertainty honestly

Label rounded answers with “about”, “approximately”, or the approximation symbol.
Then keep exact equalities separate from rounded display values.

> The exact integral is 1/3.
> By comparison, these 4 midpoint rectangles give 0.328125.

State the interval, distribution, parameter, or condition that makes a claim true.
If a result holds locally, name the point or neighbourhood being discussed.
If a result is estimated from samples, name the sample count and sampling assumptions.

### Keep unavailable results explicit

Explain why an answer is unavailable in the current state.
Then describe what the reader can change or check next.

> The slope is 1, but the curvature is 0.
> Therefore, Newton’s update would divide by 0 and remains unavailable.

Do not replace an undefined derivative, missing estimate, or incompatible product with 0.
Moreover, distinguish a value outside the displayed interval from a value outside the mathematical domain.

## 7. Write each interface element for its job

| Element | What it should say | Example |
| --- | --- | --- |
| Module opening | The question and a concrete starting case | What happens to the output when this input increases? |
| Guide heading | The calculation or observation on this page | Add the 2 derivative contributions |
| Guide body | The current worked example and its explanation | The paths contribute 4 and −2. Therefore, their sum is 2. |
| Control label | The quantity the reader changes | Number of samples |
| Handle label | The quantity and current value | Input x, currently 1 |
| Readout | The quantity, value, and relevant unit | Estimated mean, 0.2732 |
| Active note | The reason or boundary relevant to the current state | With 1 sample, the estimated standard error is unavailable. |
| Dialog title | The calculation expanded in the dialog | Weight gradient, worked |
| Dialog body | Inputs, operations, and the computed answer | Multiply −0.334759 by input 2 to get approximately −0.669518. |
| Source line | The source and the claim it supports | The quadratic derivative follows section 2.4 of the cited reference. |
| Interview check | A question the learner can answer using the lesson | Why do matching dimensions alone fail to prove this derivative correct? |

Keep code implementation details in developer documentation.
Instead, tell learners what the control changes and how that affects the maths.
For example, “Change the step size” usually helps more than explaining an animation callback.

Use colour as an additional cue, and also name the quantities in words.
Moreover, describe directions, positions, and values when the reader needs to locate a mark.
Replace “Watch this” with “Move x right and watch the tangent become steeper”.

Distinguish a fixed worked example from readouts that respond to the reader’s changes.
Then check that active notes and dialogs describe the current values and view.
When a view does not evaluate a quantity, show “Not evaluated” instead of an unrelated value.

## 8. Recognise phrases that make learners work harder

Use the examples below to identify the problem, then rewrite the surrounding explanation.
However, avoid replacing words mechanically without checking their mathematical meaning.

| Pattern | Wording to revise | A clearer direction |
| --- | --- | --- |
| Generic opening | Let us delve into the fascinating world of derivatives. | Start with the 2 inputs and calculate their outputs. |
| Inflated importance | The Hessian plays a pivotal role in optimisation. | Explain how its curvatures classify a stationary point. |
| Vague abstraction | This reveals the underlying structure of the transformation. | State which directions, lengths, or angles change. |
| Self-praise | This elegant result beautifully captures the relationship. | State the relationship and calculate a case. |
| Empty reassurance | Clearly, the result follows trivially. | Show the missing operation. |
| Reader judgement | As you can see, this is remarkably intuitive. | Describe the mark and the conclusion it supports. |
| Staged contrast | This is not about numbers. It is about relationships. | Explain which quantities the equation relates. |
| Repeated transition | Accordingly, therefore, consequently, accordingly. | Choose a plain link that expresses the actual connection. |
| Decorative synonym | The vector, the directional entity, the mathematical object. | Keep “vector” and explain what happens to it. |
| Empty closing | And that is the power of calculus. | End with the calculation or a useful learner check. |
| Unsupported claim | More samples always give a better estimate. | State the sampling assumptions and distinguish typical error from a realised estimate. |
| Compressed jargon | Apply the Jacobian adjoint to propagate sensitivity. | Name the score derivatives, matrix transpose, and resulting input derivatives. |

Keep necessary technical distinctions even when they contain negative words.
For example, “This matrix is not invertible” states a mathematical property.
However, remove staged contrasts that introduce an irrelevant alternative for emphasis.

Do not infer that a person or model wrote a sentence from its wording alone.
Instead, name the visible problem, such as a missing definition or vague conclusion.

## 9. Use different explanations for different tracks

### Mathematics

Begin with quantities the reader can count, compare, or calculate.
Then introduce the notation that compresses those operations.
For infinity, distinguish an unbounded process from an ordinary number.
For division by 0, explain the equation that division would need to satisfy.
Moreover, separate mathematical real numbers from values a computer can represent.

> Dividing 6 by 2 asks which number gives 6 when multiplied by 2.
> However, multiplying any ordinary number by 0 gives 0.
> Therefore, that question has no answer for 6/0.

### Linear Algebra

Start with a vector, matrix, or transformation whose entries the reader can inspect.
Then link the entries to a movement or calculation.
For matrix multiplication, explain the dot products before relying on compact notation.
For eigenvectors, distinguish preserving a line from preserving an arrow’s direction when the multiplier is negative.
Moreover, distinguish singular matrices, unstable calculations, and poorly conditioned problems.

> This matrix doubles the horizontal coordinate and keeps the vertical coordinate unchanged.
> Therefore, the vector (1, 1) becomes (2, 1).

### Calculus

State which input changes and which other inputs remain fixed.
Then explain the output change, limiting rate, or accumulated quantity.
Distinguish an exact derivative from a numerical approximation.
Moreover, state the assumptions behind local approximations and curvature tests.

> At x = 1, the function x² has derivative 2.
> Therefore, increasing x by a small amount h changes the output by approximately 2h.

For optimisation, check stationarity before classifying the point using its Hessian.
Also, explain why a zero curvature can leave that test inconclusive.

### Mathematical Proof

State what the claim quantifies over and what must be shown.
Then name the assumption or earlier result used at each step.
Distinguish an example that illustrates a claim from an argument proving every allowed case.
Moreover, explain why 1 counterexample defeats a universal claim.

> The claim says every even integer has an even square.
> Write an even integer as 2k, where k is an integer.
> Then its square is 4k² = 2(2k²), which is even.

For induction, separate the starting case from the argument connecting consecutive cases.
Then identify exactly where the induction assumption enters that argument.

### Bayesian Statistics

State the parameter, observed data, prior, and likelihood before introducing the posterior calculation.
Then explain what changes after conditioning on those data.
Distinguish a probability over possible parameter values from the likelihood of fixed observations.
Moreover, name the model assumptions that support the update.

> Begin with a Beta(1, 1) prior for the coin’s heads probability.
> After observing 3 heads and 1 tail, the posterior is Beta(4, 2).
> Therefore, its mean is 4/6, or 2/3, under this model.

Introduce the Beta distribution before using this example in a lesson.
Also, explain that the model assumes independent tosses with 1 fixed heads probability.

### Frequentist Statistics

Distinguish the population quantity, random sampling procedure, and estimate calculated from the observed sample.
Then explain uncertainty by describing what changes across repeated samples.
State the assumptions behind standard errors, confidence intervals, and hypothesis tests.
Moreover, distinguish statistical evidence from a practical effect size.

> Different random samples usually give different sample means.
> Therefore, the standard error describes variation in the mean across repeated samples under the model.

The confidence interval distinction follows [NIST’s repeated sampling explanation](https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm).
After that, check these common interpretation errors.
Then explain the relevant distinction through the module’s actual example.

| Quantity | Required distinction |
| --- | --- |
| P-value | It is calculated under the null model, not the probability that the null hypothesis is true. |
| Confidence interval | Its coverage describes the repeated sampling procedure, not a posterior probability for the fixed parameter. |
| Standard deviation | It measures spread in observations or a specified distribution. |
| Standard error | It measures variation in an estimator under a stated sampling model. |
| Statistical significance | It does not establish a large effect, useful decision, or causal explanation. |
| Correlation | It does not establish causation without further assumptions or design. |
| Monte Carlo estimate | For independent draws from 1 finite-variance distribution, the mean’s standard error scales as 1/√n. However, realised error can increase. |

## 10. Review maths before polishing English

Record every mathematical claim in the passage before editing.
Then check the rewrite against that record.

| Claim detail | What to preserve |
| --- | --- |
| Inputs and outputs | The actual values used in the calculation |
| Assumptions | Independence, smoothness, symmetry, support, or other required conditions |
| Scope | The point, interval, distribution, or allowed cases |
| Exactness | Exact identities versus approximations and estimates |
| Dimensions | Vector length and matrix row and column counts |
| Signs | Positive, negative, zero, and direction-dependent behaviour |
| Uncertainty | What is random, what is fixed, and what the reported quantity measures |
| Source | The reference supporting the claim and any required section or page |

If a shorter sentence changes one of these details, repair it before continuing.
Similarly, retain words such as “local”, “approximately”, and “independent” when they carry mathematical conditions.
Do not turn a conditional guarantee into an unconditional claim to make the English smoother.

## 11. Apply the requested writing skills

Use the named skills for their relevant jobs.
Then record unavailable tools honestly in the review evidence.

| Skill | Job in this repository |
| --- | --- |
| `no-ai-slop` | Find vague claims, filler, staged contrasts, and sentences that add no explanation. |
| `writing-beats` | Check that each passage introduces ideas before later passages depend on them. |
| `typesafe-ai` | Keep exact maths and validation in code while separating language judgements from numerical evidence. |
| `slopornot:slop-check` | Measure readability or run text checks when its actual local tools are available. |
| `slopornot:agentic-humanizer` | Review wording, English register, sentence rhythm, structure, and factual fidelity in separate passes. |
| `superpowers:writing-skills` | Make instructions concrete and test whether another agent can apply them. |
| `humanizer:humanizer` | Remove recurring AI writing patterns while preserving meaning and useful technical details. |

Read each skill’s current instructions when applying it.
However, the owner’s audience, scope, and writing requirements remain authoritative.
If a named skill is unavailable, record its name.
Then follow this guide’s corresponding instructions without claiming that the skill ran.
Use Writing Beats’ dependency method for lesson planning without inserting its planning language into learner copy.

TypeSafe is a software tool for structured AI judgements.
Therefore, naming its skill does not require adding an AI service to these lessons.
Exact calculations remain in ordinary code and independent numerical checks.
If a future editorial tool uses TypeSafe, give it the sentence, audience, prior definitions, and claim evidence.
Then evaluate specific questions separately, such as whether a term appears before its explanation.
Consult [the official documentation index](https://docs.typesafe.ai/llms.txt) before designing any integration.

For manual humanisation, review these 5 concerns separately.
After each pass, compare the edited passage with the mathematical claim record.

1. Remove filler, inflated claims, and staged openings.
2. Match British English and the adult learner’s reading needs.
3. Split tangled sentences and explain unfamiliar words.
4. Repair the order of ideas and replace vague references.
5. Check natural rhythm, preserved meaning, assumptions, and numbers.

Slop or Not was unavailable when this guide was written.
Therefore, no detector probability or measured readability grade is reported here.
If its tools remain unavailable, complete the manual review and record that limitation.
If its tools work, report actual measurements and keep them separate from mathematical verification.
Moreover, a detector score cannot establish authorship or prove that a lesson teaches well.

## 12. Complete a learner check

Read the passage as someone who has only completed its stated prerequisite lessons.
Then answer these questions without guessing what the writer meant.

- What are the inputs, and what operation uses them?
- What does each unfamiliar term or symbol mean here?
- What result should I expect, and why?
- What can I change, and what should change after that?
- Which condition makes the claim valid?
- What happens in the stated edge case?
- Can I explain the result without repeating the formula word for word?

If any answer requires unstated knowledge, add the missing explanation or identify the prerequisite.
After that, check the rendered passage at desktop and phone widths in both themes.

For implementation steps, evidence records, and track checklists, continue with [the editing plan](superpowers/plans/2026-10-01-maths-language-review.md).
