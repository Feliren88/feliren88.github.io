# Module explainers for the 6 maths tracks

Date: 2026-09-30. Status: design agreed in conversation, awaiting review of this written spec.

## Goal

Every module in the 6 maths tracks gets its own interactive explainer. Each one works at the depth of the GPT-2 and CNN explainers and shows the maths the way 3Blue1Brown does.

- **Tracks:** Mathematics, Linear Algebra, Calculus, Mathematical Proof, Bayesian Statistics and Frequentist Statistics. That is 45 modules.
- **Out of scope:** the other 25 tracks, which get their own specs later.

## Decisions

| Question | Decision |
| --- | --- |
| Scope | The 45 modules of the 6 maths tracks |
| Placement | Inside each module, in place of the static diagram |
| Guide | A floating guide card, written fresh for each explainer |
| Depth | Flagship depth for every module |
| Build | 1 standalone explainer per module: its own include, script and guide |
| Look | The site's light and dark themes and existing colour tokens, with 3Blue1Brown's motion and colour binding. No black stage |

## 1. Where each explainer lives

### Placement

- The explainer sits inside its module, in the slot the static diagram uses today (`.syl-viz` in `_layouts/syllabus.html`).
- It fits the module's width and never overflows at 390 px.
- Detailed views open in the zoom dialog (`XP.dialog`) rather than widening the page.
- Each module keeps its step player (`.syl-scene`), its equations and its equation playgrounds unchanged.

### Files

For each module:

- `_includes/labs/<track>/<slug>.html` holds the markup.
- `js/labs/<track>/<slug>.js` holds the behaviour. Its pure maths is exported through `module.exports` for Node.

For the whole system:

- `css/labs.css` holds the explainer styles, one section per track. It loads on syllabus pages that have explainers.
- `_data/module_labs.yml` maps a track and module index to a slug, for example `linear-algebra: { '3': eigenvectors }`. The layout reads it to decide what to include.

### Loading

`js/components/lab-loader.js` watches each explainer slot with an `IntersectionObserver` whose root margin is 1 screen.

- It injects the module's script when the slot comes near the viewport.
- A reader on the Mathematics page loads only the explainers they scroll to.

### Shared code

Explainers use the existing `XP` core: `guide`, `tip`, `dialog`, `highlight`, `esc`, `fmt`, `rng` and `gauss`. The core gains 3 small helpers:

- `XP.tween(from, to, ms, onFrame)` animates between 2 states with easing.
  - It returns a handle that can scrub to any fraction and can be interrupted.
  - When reduced motion is on, it calls `onFrame` once with the end state.
- `XP.plane(svg, opts)` draws a coordinate plane with a grid, axes and a clip path. It exposes `toScreen`, `toWorld` and `transform(matrix or function)`, so a grid can be bent.
- `XP.lab(slug, mount)` finds the explainer's slots and calls `mount(slot)` inside a `try`. If the mount throws, it shows the fallback described under "Errors and fallbacks".

Each explainer draws its own picture. Nothing else is shared.

### What goes

The distribution labs in `_data/interview_distributions.yml` are removed for these modules:

- Mathematics 6 and 7;
- Calculus 4;
- Bayesian 0, 2, 3 and 4;
- Frequentist 0, 3 and 5.

They stay in these 4 modules, where the lesson is a distribution's shape:

- Mathematics 5, probability from first principles;
- Bayesian 1, priors;
- Frequentist 1, maximum likelihood;
- Frequentist 2, sampling distributions.

In the layout, the Integration explainer replaces the calculus integral one-off (`data-integral-playground`, `interview-area.js`). Distribution labs in other tracks are unchanged.

### Behaviour

- Every explainer opens on page 1 of its guide.
- Its controls write into the module's live equations. It does this by setting the text of the `[data-live]` nodes whose names it publishes, through the same `fmt` the playgrounds use. The last control you touched wins.
- Each track's plan lists which equations gain a live line. A new live line goes through the existing `interview_math.yml` generator.
- An equation playground whose controls repeat its module's explainer is removed when that explainer lands. Its live equation stays, fed by the explainer. The Linear Algebra playgrounds for basis vectors and for fitting a line go this way.

### Errors and fallbacks

- The layout still renders the module's static diagram in a hidden `.syl-viz` beside the explainer slot.
- If the script fails to load or `mount` throws, the loader un-hides the diagram. It also shows the line "The interactive version did not load." The error is logged to the console, where the browser harness catches it.
- The pure functions return explicit states for edge cases, such as `{ singular: true }` or `{ undefined: true }`. The picture shows that state in words. A readout never shows NaN or Infinity unless the module is teaching them: Mathematics 2 and 9.
- Every control clamps to its range.

## 2. The 3Blue1Brown grammar

1. **Motion carries the idea.** A change is shown as the picture moving from before to after, and every motion can be scrubbed.
2. **One colour per quantity, everywhere.** A symbol has the same colour in the picture, the equation strip and the guide text.
   - Hovering a term lights up its part of the picture, and hovering the picture lights up the term.
   - `--xp-q` and `--xp-k` are for the 2 inputs or basis vectors.
   - `--xp-o` is for the result.
   - `--xp-v` is for data.
   - `--tf-up` and `--tf-down` are for sign.
3. **One picture, built up.** Guide pages add layers to one scene. Each page tweens the scene to its state and says 1 or 2 sentences.
4. **Concrete first.** Page 1 is one specific example with real numbers, and the general statement comes after.
5. **You hold the object.** Anything with a natural handle is dragged. A slider exists only for a quantity with no handle and no other control, so no 2 controls ever do the same job.

### Anatomy of each explainer

- An equation strip, with coloured terms and live values.
- A stage: SVG, or canvas above about 1,000 drawn points.
- Controls:
  - a play and scrub bar;
  - 1 to 3 drag handles;
  - up to 3 sliders or selects;
  - Reset.
- A guide card of 6 to 10 pages.
- 2 to 4 zoom views, each showing the arithmetic behind one part of the picture.

### Motion and access

- Transitions take 400 to 900 ms with easing.
- Nothing loops unless the reader presses play, and any click interrupts an animation.
- With reduced motion on, each change jumps to its end state.
- Every handle takes keyboard focus and moves with the arrow keys. Shift moves it 10 times as far.
- A polite live region describes the current state in words.
- Graphics meet 3:1 contrast against the background, and text meets 4.5:1, in both themes.

### Prose

Guide pages follow the house rules in `CLAUDE.md`:

- British spelling and numerals;
- sentences of about 14 words;
- no em dashes;
- no negative contrast.

Each track gets a no-ai-slop pass. The guide text builds on the module's own beats, equations and `read` lines. It adds no claim the module does not make, and no number the explainer does not compute.

## 3. The 45 explainers

Each entry gives what moves, what the reader drags, the zoom views, and the reference the maths is checked against. Unless an entry names a source, all data is either computed or simulated with a fixed seed and labelled as simulated.

### 3a. Mathematics

| # | Module | Slug |
| --- | --- | --- |
| 0 | Reading the notation | `notation` |
| 1 | What a number is | `what-a-number-is` |
| 2 | Dividing by 0 | `dividing-by-zero` |
| 3 | Infinity | `infinity` |
| 4 | Counting | `counting` |
| 5 | Probability from first principles | `probability` |
| 6 | Expectation and concentration | `concentration` |
| 7 | Information | `information` |
| 8 | Logs, exponents and scale | `logs-and-scale` |
| 9 | Numbers on a machine | `floating-point` |

0. **Reading the notation.**
   - **Moves:**
     - A universe of 30 numbers sits in a grid. A predicate sweeps across it, and the matching numbers fly into S.
     - 2 sets are joined by arrows, and an input with 2 arrows is flagged as "not a function".
     - An index pointer walks along a sum while a running-total bar grows.
     - The guide ends by decoding cross entropy, piece by coloured piece.
   - **Drag:** the predicate, the range ends, and n.
   - **Zoom:** the sum as a Python loop beside its running total.
   - **Checked against:** Python.
1. **What a number is.**
   - **Moves:**
     - Tally strokes, then place value, with 205 beside 25.
     - 0 lands on the line.
     - Von Neumann sets nest as circles.
     - Asking for x + 3 = 1 extends the line left. Asking for 3x = 1 fills it with fractions.
   - **Drag:** a, with −a mirrored and the arrows cancelling, and the nesting depth from 0 to 5.
   - **Zoom:** the sets written out, and closure tables for ℕ, ℤ and ℚ.
   - **Checked against:** set cardinality in Python.
2. **Dividing by 0.**
   - **Moves:**
     - Division is drawn as its question: where does y = c × b meet y = a?
     - As b goes to 0, the line flattens. The meeting point leaves for infinity when a ≠ 0. When a = 0, the lines coincide, so every c answers.
     - Then 1/u approaching from each side, and what IEEE 754 returns.
   - **Drag:** b and a.
   - **Zoom:** the bit patterns of inf and NaN.
   - **Checked against:** NumPy.
3. **Infinity.**
   - **Moves:**
     - Arrows pair the naturals with the evens.
     - A zigzag lists the fractions on the p/q grid, skipping duplicates.
     - A list of expansions has its diagonal flipped to build r\*.
   - **Drag:** edit any row, or add r\* to the list and watch a new r\* appear.
   - **Zoom:** the pairing values, and the diagonal table.
   - **Checked against:** an enumeration of the reduced fractions up to N, each appearing once.
4. **Counting.**
   - **Moves:**
     - A choice tree branches.
     - The r! identical leaves merge into sets.
     - Pascal's triangle builds row by row, and hovering a cell lists its subsets.
     - n², 2ⁿ and n! race on a log axis against a line for the reader's operations-per-second setting.
     - Balls drop into m slots.
   - **Drag:** n, r, and operations per second.
   - **Zoom:** the r! grouping, and one Pascal cell's sum.
   - **Checked against:** `math.comb` and `math.factorial`.
5. **Probability from first principles.**
   - **Moves:**
     - The sample space is the 6 × 6 grid of 2 dice, and events E and F are regions of it.
     - Conditioning on F zooms F out to fill the frame.
     - A random variable sends each cell flying to its histogram bar.
   - **Drag:** choose E and F, or drag rectangles on a continuous square.
   - **Zoom:** the joint and marginal count tables.
   - **Distribution lab:** kept.
   - **Checked against:** a full enumeration of the grid.
6. **Expectation and concentration.**
   - **Moves:**
     - Draws fall, and a running mean traces a path.
     - Many runs overlay into a funnel that narrows as 1/√n.
     - The histogram of means carries the Chebyshev and Hoeffding bounds.
   - **Drag:** n, ε on the histogram, and a bounded distribution.
   - **Zoom:** the simulated tail against both bounds.
   - **Checked against:** the simulated tail never exceeds either bound, within binomial tolerance, and Var(x̄) equals σ²/n.
7. **Information.**
   - **Moves:**
     - Each bar of p carries its surprise −log p as a stack, and entropy is the weighted level.
     - Overlaying q shows cross entropy as the entropy floor plus the KL extra.
     - "Swap p and q" shows the asymmetry.
   - **Drag:** the bar heights of p and q, and the unit, bits or nats.
   - **Zoom:** the per-outcome table.
   - **Checked against:** `scipy.stats.entropy`.
8. **Logs, exponents and scale.**
   - **Moves:**
     - A product of probabilities falls to the float floor and becomes 0.
     - In log space, the same chain walks down a line.
     - The axes morph from linear to log-y to log-log, and a power law straightens as they do.
   - **Drag:** κ, c, the chain length, and each axis's morph.
   - **Zoom:** the product against the sum of logs, row by row, up to the underflow point.
   - **Checked against:** NumPy's float64 underflow point.
9. **Numbers on a machine.**
   - **Moves:**
     - A float line has a tick at every representable value. The gaps double at each power of 2, and the line can be zoomed anywhere.
     - Clicking the sign, exponent and mantissa bits places the value on the line.
     - The 3 NaN repairs are animated: the shift by the max in softmax, cancellation in a − b, and small terms vanishing into a large sum until a wider accumulator keeps them.
   - **Drag:** the format (float16, bfloat16 or float32), the bits, and x.
   - **Zoom:** the bit decode, and logsumexp step by step.
   - **Checked against:** `np.spacing` and `scipy.special.logsumexp`.

### 3b. Linear Algebra

| # | Module | Slug |
| --- | --- | --- |
| 0 | Vectors and spaces | `vectors-and-spaces` |
| 1 | Matrices as transformations | `matrices-as-transformations` |
| 2 | Determinant, rank and inverse | `determinant-rank-inverse` |
| 3 | Eigenvectors and eigenvalues | `eigenvectors` |
| 4 | Decompositions | `decompositions` |
| 5 | Projections and least squares | `least-squares` |
| 6 | Numerical behaviour | `conditioning` |

0. **Vectors and spaces.**
   - **Moves:**
     - 2 arrows add nose to tail.
     - c₁ and c₂ sweep the tip of c₁v₁ + c₂v₂.
     - "Paint the span" fills the plane. It collapses to a line, flagged as dependent, when v₂ is parallel to v₁.
     - One point gets coordinates in the standard basis and in the v₁, v₂ basis.
     - u casts a shadow on v for the dot product.
     - A rotatable 3D view shows 2 vectors spanning a plane in ℝ³.
   - **Drag:** the tips of v₁, v₂ and u, and the tip of c₁v₁ + c₂v₂, which solves for c₁ and c₂.
   - **Zoom:** the coordinate solve in both bases, and the dot product arithmetic.
   - **Checked against:** `numpy.linalg.solve` and `matrix_rank`.
1. **Matrices as transformations.**
   - **Moves:**
     - The grid morphs from the identity to A.
     - A vector rides along, split into v₁(Ae₁) + v₂(Ae₂).
     - Presets: rotation, scaling, shear and projection.
     - Composition shows A then B beside B then A.
   - **Drag:** where î and ĵ land. The matrix columns update as you drag.
   - **Zoom:** matrix times vector, and each entry of BA.
   - **Checked against:** NumPy.
2. **Determinant, rank and inverse.**
   - **Moves:**
     - The unit square and a letter F transform, and the square's area is the determinant.
     - Crossing det = 0 squashes the square to a line, then mirrors the F.
     - At det = 0 the null-space line appears. A point dragged along it leaves its output fixed.
     - "Undo" plays A⁻¹. It is disabled, with the reason given, when A is singular.
     - Dragging y shows Av = y with 1 solution, none, or a line of them.
   - **Drag:** î, ĵ, and y.
   - **Zoom:** the determinant arithmetic, and the rank-nullity count.
   - **Checked against:** NumPy's `det` and `matrix_rank`, and the null space from `svd`.
3. **Eigenvectors and eigenvalues.**
   - **Moves:**
     - A fan of 24 arrows transforms, each drawn with its line through the origin.
     - The eigenvectors stay on their lines and light up.
     - The unit circle becomes an ellipse.
     - "Apply again" pulls points onto the dominant eigenvector, or shrinks them when the spectral radius is below 1.
     - A rotation shows no real eigenvector. A symmetric matrix shows perpendicular ones.
     - det(A − λI) is plotted as a parabola, with the eigenvalues as its roots.
   - **Drag:** î and ĵ.
   - **Zoom:** the characteristic polynomial, and QΛQ⁻¹.
   - **Checked against:** `numpy.linalg.eig`.
4. **Decompositions.**
   - **Moves:**
     - The SVD plays as 3 scrubbable stages: Vᵀ rotates the circle, Σ stretches it along the axes, and U rotates it again.
     - A Tiny VGG sample image already on the site is rebuilt from its first k singular values, with the error beside it.
     - Dragging points in a PCA cloud turns the principal axes.
     - Cholesky is shown as the square root of a positive definite matrix.
   - **Drag:** the matrix, k, and the cloud's points.
   - **Zoom:** the singular values, and the rank-k error.
   - **Checked against:** `numpy.linalg.svd`. The Frobenius error must equal the square root of the sum of the dropped σ².
5. **Projections and least squares.**
   - **Moves:**
     - In 3D, the columns of X span a plane and y floats above it.
     - ŷ drops as y's shadow, and the residual meets the plane at a right-angle marker.
     - In a 2D fit, each residual carries its square, and the squares' total area is the loss.
     - "Snap to least squares" tweens the line to the fit.
     - Ridge's λ pulls w along its path, drawn over the loss contours and the constraint circle.
   - **Drag:** y, the view, the line, the points, and λ.
   - **Zoom:** the normal equations with numbers.
   - **Checked against:** `numpy.linalg.lstsq`, and the closed-form ridge solution.
6. **Numerical behaviour.**
   - **Moves:**
     - A 2 × 2 system is drawn as 2 crossing lines.
     - Tilting them towards parallel and jittering y makes the solution cloud stretch into a streak that tracks κ.
     - Beside it, the unit circle's ellipse labels σ_max and σ_min.
     - "Invert then multiply" is compared with "solve" on Hilbert matrices, with the errors as bars on a log axis.
     - The loss contours before and after feature scaling carry gradient descent paths.
   - **Drag:** the second line's end, which tilts it; plus a δ slider, a Hilbert size slider, and a scaling toggle.
   - **Zoom:** κ from the singular values, and the error table.
   - **Checked against:** NumPy's `cond`, `solve` and `inv` on the same matrices.

### 3c. Calculus

| # | Module | Slug |
| --- | --- | --- |
| 0 | Derivatives and rates | `derivatives` |
| 1 | The chain rule | `chain-rule` |
| 2 | Gradients, Jacobians and Hessians | `gradients-jacobians-hessians` |
| 3 | Optimisation conditions | `optimisation-conditions` |
| 4 | Integration and expectation | `integration` |
| 5 | Approximation | `approximation` |
| 6 | Matrix calculus | `matrix-calculus` |

0. **Derivatives and rates.**
   - **Moves:**
     - A secant slides into the tangent as h shrinks, while the slope readout settles.
     - "Zoom in on the point" magnifies the curve until it looks straight.
     - Dragging x traces f′ underneath as a height.
     - On |x|, the zoom never straightens the corner.
   - **Drag:** x, h, and the function: x², sin x, eˣ, |x| or x^(1/3).
   - **Zoom:** the difference quotient as h shrinks, including where float error takes over.
   - **Checked against:** the exact derivatives.
1. **The chain rule.**
   - **Moves:**
     - 3 stacked number lines for x, g(x) and f(g(x)).
     - A nudge dx scales by g′ on the middle line, then by f′ on the top line.
     - A graph for L = (wx + b − y)² runs values forward and adjoints back. Every edge shows its local derivative, and a node with 2 children sums what comes back.
     - Forward and reverse mode passes are counted on a graph with many inputs and 1 output.
   - **Drag:** x, the nudge, and the graph's inputs.
   - **Zoom:** the adjoint table, node by node.
   - **Checked against:** finite differences.
2. **Gradients, Jacobians and Hessians.**
   - **Moves:**
     - A contour map carries a field of gradient arrows, each perpendicular to its contour.
     - A unit direction u circles the point, and the directional derivative is plotted as a cosine.
     - A nonlinear map warps a grid. Zooming into one small square shows the parallelogram given by the Jacobian.
     - The Hessian appears as the local quadratic's contours, with its eigen-directions.
     - A shapes panel shows ∇f, J and H for the reader's d and m.
   - **Drag:** the point, u, d and m.
   - **Zoom:** the partials, and J checked entry by entry.
   - **Checked against:** finite differences.
3. **Optimisation conditions.**
   - **Moves:**
     - A surface holds a minimum, a maximum and a saddle.
     - At a zero-gradient point, the 2 curvature directions appear, coloured up or down, with the point's classification.
     - A chord test shows convexity.
     - A Lagrange point dragged along the constraint lines up the 2 gradients, with ϖ as their ratio.
     - A simulation of random symmetric matrices plots the positive-definite fraction against d, beside 2⁻ᵈ.
   - **Drag:** the point, the constraint point, and d.
   - **Zoom:** the Hessian's eigenvalues at the point.
   - **Checked against:** `numpy.linalg.eigvalsh`, and a numerical solve for the constrained optimum.
   - **Content check:** if the simulated fraction falls faster than 2⁻ᵈ, the module's equation is reworded to call 2⁻ᵈ the estimate from independent signs. The explainer shows both curves.
4. **Integration and expectation.**
   - **Moves:**
     - Rectangles fill the area under a curve and refine.
     - The accumulated area A(x) is traced below. A sliver of width dx adds f(x)dx, so A's slope equals f.
     - g(x)p(x) is shaded, and its area is E[g].
     - Monte Carlo samples fall, and the estimate settles inside a ±SE band that narrows as 1/√n.
     - A change of variables stretches a density strip while its area stays fixed.
   - **Replaces:** the calculus integral one-off, and this module's distribution lab.
   - **Drag:** x, n, the sample count, and the distribution.
   - **Zoom:** the Riemann table, and the Monte Carlo estimate against the exact value.
   - **Checked against:** `scipy.integrate.quad`.
5. **Approximation.**
   - **Moves:**
     - Taylor polynomials of rising order hug the curve around a, with the remainder shaded.
     - On ln(1 + x), orders past the radius of convergence get worse outside it.
     - Newton fits a parabola at x_t and jumps to its vertex. Gradient descent runs beside it, with both step counts shown.
     - Where f″ < 0, Newton heads uphill.
     - The numerical derivative's error against h forms a V on log-log axes.
   - **Drag:** a, the order, the start point, the step size, and h.
   - **Zoom:** the Taylor coefficients, and the Newton iteration table.
   - **Checked against:** NumPy and the exact derivatives.
6. **Matrix calculus.**
   - **Moves:**
     - A layer ŷ = softmax(Wx + b) with its loss is drawn as blocks sized by shape, so a legal product lines up.
     - Gradient blocks flow back, each matching its parameter's shape. A "transpose mistake" toggle flashes the mismatch.
     - Raising a logit moves the bars for p̂ and for p̂ − y.
     - wᵀAw appears as a surface with gradient arrows. A non-symmetric A shows why Aᵀ appears.
     - A layout toggle flips between the numerator and denominator conventions.
   - **Drag:** the logits, W and A.
   - **Zoom:** δxᵀ, entry by entry.
   - **Checked against:** finite differences for every entry.

### 3d. Mathematical Proof

| # | Module | Slug |
| --- | --- | --- |
| 0 | What a claim actually says | `quantifiers` |
| 1 | Direct proof and the contrapositive | `contrapositive` |
| 2 | Proof by contradiction | `contradiction` |
| 3 | Induction and recursion | `induction` |
| 4 | Counterexamples | `counterexamples` |
| 5 | Inequalities and bounds | `inequalities` |
| 6 | Existence arguments | `existence` |

0. **What a claim actually says.**
   - **Moves:**
     - A board has x as rows and y as columns, with a cell lit where P(x, y) holds.
     - ∀x ∃y needs a lit cell in every row. ∃y ∀x needs 1 full column.
     - Negation pushes ¬ through the formula, flipping each quantifier.
     - ε and n₀ on 1/n, with the reader as the adversary picking ε.
     - Vacuous truth is shown on an empty row set, and necessary against sufficient as regions.
   - **Drag:** paint cells, ε, and the quantifier order.
   - **Zoom:** the parse tree, evaluated on the board.
   - **Checked against:** brute force over the board.
1. **Direct proof and the contrapositive.**
   - **Moves:**
     - P sits inside Q. The contrapositive is the same picture with the complements shaded.
     - A point in Q but outside P is the converse's counterexample.
     - A 4-row truth table covers the implication, contrapositive, converse and inverse.
     - "n² even ⇒ n even" is worked on 1 to 30.
     - If and only if lights both arrows when the regions coincide.
     - Proof by cases flashes any gap the cases leave.
   - **Drag:** both regions, and the point.
   - **Zoom:** the full truth table.
   - **Checked against:** truth tables, and parity in Python.
2. **Proof by contradiction.**
   - **Moves:**
     - a² = 2b² is drawn as 1 a-square with the same area as 2 b-squares. Placing the b-squares in opposite corners leaves a smaller whole-number solution, (2b − a, a − b), so the descent never ends.
     - The near misses 7/5, 17/12 and 41/29 give a² − 2b² = ±1.
     - Euclid: multiply a chosen list of primes, add 1, and factor the result.
     - The diagonal set C is missed by every row of f: S → 𝒫(S).
   - **Drag:** a and b, the prime list, and the table cells.
   - **Zoom:** the descent arithmetic, and the factorisation.
   - **Checked against:** exact integer arithmetic.
3. **Induction and recursion.**
   - **Moves:**
     - A row of dominoes has a base and links. Breaking the link at k stops the fall there, and removing the base stops everything.
     - 1 + … + n is a staircase that doubles into an n × (n + 1) rectangle, and the step adds a column.
     - Strong induction is shown on merge sort's split tree.
     - A loop invariant box is checked before and after each pass.
     - T(n) = 2T(n/2) + n unfolds as a tree, with the work summed per level.
   - **Drag:** n, the broken link k, the base, and the recurrence's a and b.
   - **Zoom:** P(k) ⇒ P(k + 1) for the reader's k, and the work per level.
   - **Checked against:** Python.
4. **Counterexamples.**
   - **Moves:**
     - A scanner walks n² + n + 41. It stays green through n = 39 and turns red at n = 40, which gives 41².
     - A confirmation counter climbs the whole way.
     - Other claims to pick: 2ᵖ − 1 fails at p = 11, where 2047 = 23 × 89, and "continuous means differentiable" fails at |x|.
     - "Repair" adds the missing hypothesis.
   - **Drag:** the scan position and the claim.
   - **Zoom:** the counterexample's factorisation.
   - **Checked against:** trial division.
5. **Inequalities and bounds.**
   - **Moves:**
     - The triangle inequality, with equality when a and b are aligned.
     - Cauchy–Schwarz as the projection's shadow.
     - Jensen with draggable samples, reversing on a concave curve.
     - AM–GM as a rectangle against a square with the same perimeter.
     - The union bound, with the double-counted overlap shaded.
     - A chain of ≤ broken by multiplying through by a negative.
   - **Drag:** the vectors, samples, sides and circles.
   - **Zoom:** both sides of each inequality, with numbers.
   - **Checked against:** Python.
6. **Existence arguments.**
   - **Moves:**
     - n items drop into m slots, and the fullest slot holds at least ⌈n/m⌉.
     - Random 2-colourings of the edges of K₆ are sampled. The expected count of 1-colour K₄s is C(6, 4) × 2^(1−6) = 15/32, so sampling finds a colouring with none.
     - The comparison tree for n = 3 has 6 leaves. For larger n, the leaf count is shown against log₂ n!.
   - **Drag:** n and m, "resample", and the sort's n.
   - **Zoom:** the expectation arithmetic, and log₂ n! against n log n.
   - **Checked against:** brute force over all 2¹⁵ colourings of K₆.

### 3e. Bayesian Statistics

| # | Module | Slug |
| --- | --- | --- |
| 0 | Probability as belief | `belief` |
| 1 | Priors and what they encode | `priors` |
| 2 | Computing the posterior | `posterior-computation` |
| 3 | Hierarchical models | `hierarchical` |
| 4 | Checking and comparing models | `model-checking` |
| 5 | Bayesian methods inside machine learning | `bayes-in-ml` |

0. **Probability as belief.**
   - **Moves:**
     - A square of 1,000 people is split by the base rate, then by the test.
     - "Test positive" zooms the positive region out to fill the frame.
     - A prior over a coin's bias is multiplied by θ or 1 − θ with each flip.
     - Today's posterior slides left to become tomorrow's prior.
   - **Drag:** the base rate, the true positive rate, the true negative rate, and the flips.
   - **Zoom:** the 2 × 2 counts, and prior × likelihood ÷ evidence on the grid.
   - **Checked against:** exact arithmetic, and the Beta update.
1. **Priors and what they encode.**
   - **Moves:**
     - A Beta prior has handles for a and b.
     - The data's s of n tokens sit beside a + b pseudo-count tokens.
     - The posterior mean slides from the prior mean towards s/n.
     - Presets: flat, weakly informative and Jeffreys.
     - A prior predictive histogram builds from draws.
     - Posteriors under 3 priors are overlaid.
     - The normal log-prior's parabola shifts the peak, so MAP is ridge.
   - **Drag:** a, b, s, n, and the preset.
   - **Zoom:** the conjugate update arithmetic.
   - **Distribution lab:** kept.
   - **Checked against:** `scipy.stats.beta`.
2. **Computing the posterior.**
   - **Moves:**
     - A curved 2D posterior is drawn as contours.
     - Grid cells show k^d exploding with the dimension.
     - Laplace fits a Gaussian at the mode.
     - Metropolis–Hastings proposes inside a circle and flashes each accept or reject with its ratio. A trace and a histogram build.
     - Gibbs moves along the axes.
     - HMC's leapfrog arcs follow the contours.
     - Variational inference fits a Gaussian q that comes out too narrow on the correlated posterior.
   - **Drag:** the proposal scale, ε, L, and the target.
   - **Zoom:** one Metropolis–Hastings step and one leapfrog step, with numbers.
   - **Checked against:** the samplers' moments against the exact target, in Python with the same seed.
3. **Hierarchical models.**
   - **Data:** the 8 schools study: Rubin, D. B. (1981), "Estimation in parallel randomized experiments", *Journal of Educational Statistics* 6(4), 377–401, as used in Gelman et al., *Bayesian Data Analysis*, 3rd edition, section 5.5. It is cited on the page.
   - **Moves:**
     - Each school is a dot with its standard-error bar.
     - The pooling slider runs τ from no pooling to complete pooling. Schools with wide bars move furthest.
     - Neal's funnel in (log τ, θ) traps a sampler in the neck. It becomes a round blob under the non-centred form.
   - **Drag:** τ and the parameterisation.
   - **Zoom:** w_j for each school.
   - **Checked against:** the weighted-average formula against the exact conditional posterior.
4. **Checking and comparing models.**
   - **Moves:**
     - A Poisson fit to overdispersed counts gives replications that come out too narrow.
     - The variance, as test quantity, sits in the replicated tail, with its posterior predictive p-value.
     - A negative binomial fits.
     - Leave-one-out gives each point its predictive density, and an influential point lowers elpd.
     - A prior-width slider swings the Bayes factor while leave-one-out barely moves.
   - **Drag:** the model, the prior width, and one point.
   - **Zoom:** the per-point log predictive table.
   - **Checked against:** the conjugate marginal likelihoods and exact leave-one-out refits in SciPy.
5. **Bayesian methods inside machine learning.**
   - **Moves:**
     - MLE and MAP appear as 2 peaks on 1 curve.
     - Clicking adds observations to a Gaussian process, with its mean, a ±2σ band and posterior samples.
     - An acquisition curve picks the next point by EI, UCB or a Thompson sample.
     - Predictive averaging is shown against a single MAP fit.
   - **Drag:** click to add points, plus the length-scale, the noise, and the acquisition rule.
   - **Zoom:** the kernel matrix K and its Cholesky solve.
   - **Checked against:** the GP formulas in NumPy.

### 3f. Frequentist Statistics

| # | Module | Slug |
| --- | --- | --- |
| 0 | Estimators and their properties | `estimators` |
| 1 | Maximum likelihood, worked for each distribution | `maximum-likelihood` |
| 2 | Sampling distributions and intervals | `sampling-distributions` |
| 3 | Hypothesis testing | `hypothesis-testing` |
| 4 | Multiple comparisons and researcher freedom | `multiple-comparisons` |
| 5 | Experiment design and A/B testing | `ab-testing` |
| 6 | Causal inference | `causal-inference` |
| 7 | Regression in practice | `regression` |

0. **Estimators and their properties.**
   - **Moves:**
     - Repeated estimates pile into a histogram around the truth θ.
     - Bias is the gap and variance is the spread. MSE = bias² + variance appears as stacked bars.
     - Estimators to pick: the mean, the median, a shrunk mean λx̄, and the variance divided by n or by n − 1.
     - The λ slider traces the MSE curve.
     - The Cramér–Rao floor is touched by the normal mean, while the median stays above it.
   - **Drag:** the estimator, λ and N.
   - **Zoom:** the MSE split.
   - **Checked against:** simulation against the formulas.
1. **Maximum likelihood, worked for each distribution.**
   - **Moves:**
     - Each point raises a density bar at θ, and the bars multiply into the likelihood.
     - Dragging θ traces the log-likelihood. The score reads 0 at the peak, and the curvature is shown as the second-order check.
     - The area under L(θ) fails to equal 1.
     - Distributions: Bernoulli, Poisson, exponential and normal, with their closed forms.
   - **Drag:** θ, the points, and the distribution.
   - **Zoom:** the per-point log terms, and the score equation.
   - **Distribution lab:** kept.
   - **Checked against:** `scipy.optimize` against the closed forms.
2. **Sampling distributions and intervals.**
   - **Moves:**
     - The CLT machine draws from a skewed population, and the means pile up.
     - 100 intervals stack across the truth line, with the misses coloured and a coverage counter.
     - The bootstrap resamples, one draw at a time.
     - For the delta method, θ̂'s distribution passes through g, and its width scales by |g′|.
   - **Drag:** N, the population, known or unknown σ, and g.
   - **Zoom:** the interval arithmetic.
   - **Distribution lab:** kept.
   - **Checked against:** simulated coverage within binomial tolerance, and `scipy.stats.t`.
3. **Hypothesis testing.**
   - **Moves:**
     - Null and alternative curves share an axis with a draggable critical line. α, β and power are shaded.
     - z_obs marks the 2-sided p-value.
     - p-values pile flat under the null and near 0 under the alternative.
     - The sample-size equation updates live.
   - **Drag:** Δ, N, α and z_obs.
   - **Zoom:** the power and N arithmetic.
   - **Checked against:** `scipy.stats.norm` and simulation.
4. **Multiple comparisons and researcher freedom.**
   - **Moves:**
     - m null tests light red as the threshold sweeps.
     - P(at least 1) is plotted against m.
     - The sorted p-values carry the Bonferroni, Holm and Benjamini–Hochberg lines.
     - A tree of forking analysis paths reports its smallest p-value.
     - A peeking p-value path crosses 0.05, and a confidence sequence stays valid.
   - **Drag:** m, the share of true effects, α, and the number of peeks.
   - **Zoom:** each method's decisions, row by row.
   - **Checked against:** NumPy, and `scipy.stats.false_discovery_control`.
5. **Experiment design and A/B testing.**
   - **Moves:**
     - Coin flips assign users to 2 arms, and Δ̂ appears with its standard error.
     - N is plotted against the MDE.
     - CUPED slides points onto their residuals, and the variance drops by 1 − ρ².
     - Spillover on a network, fixed by cluster randomisation.
     - A novelty effect decays over time.
   - **Drag:** the MDE, ρ, N and the spillover.
   - **Zoom:** the standard-error and CUPED arithmetic.
   - **Checked against:** the simulated variance cut against 1 − ρ².
6. **Causal inference.**
   - **Moves:**
     - A potential-outcomes table reveals 1 outcome per unit.
     - A DAG has draggable edges.
     - A Simpson's paradox scatter morphs from the pooled line to the within-group lines.
     - Selecting on a collider creates a slope.
     - Propensity weights grow the dots to 1/e(x).
     - Difference in differences draws its dashed counterfactual.
   - **Drag:** the edges, the confounding strength, the collider threshold, and the overlap.
   - **Zoom:** the adjustment formula, stratum by stratum.
   - **Checked against:** simulations with a known τ, which each estimator must recover within tolerance.
7. **Regression in practice.**
   - **Moves:**
     - An OLS fit fans out under heteroskedasticity. The classic and sandwich standard errors are compared by repeated sampling.
     - Correlated predictors stretch the coefficient ellipse, with a VIF readout.
     - A dragged high-leverage point moves the line and Cook's distance.
     - The log model is read as ×e^{w₁}.
     - The logistic link is shown last.
   - **Drag:** the points, the fan strength, and ρ.
   - **Zoom:** the sandwich matrix.
   - **Checked against:** HC0 in NumPy.

## 4. Testing

Each explainer passes all 7 checks before its track is done.

1. **Maths.**
   - `scripts/verify_labs.py --track <id>` loads each explainer's pure functions under Node, runs them on fixed inputs, and compares the results with the reference named in section 3.
   - Each check states its tolerance.
   - Simulation checks use a fixed seed and a binomial tolerance.
2. **Bounds.** `scripts/check_chart_bounds.py` sets every control of every explainer to its extremes and asserts that every mark stays inside its stage.
3. **Interaction.** The browser harness asserts all of the following, at 1,400 px and 390 px:
   - every control changes the picture;
   - every guide page is reachable, and the guide opens on page 1;
   - every handle takes focus and moves with the arrow keys;
   - reduced motion jumps to the end state;
   - no console errors, and no horizontal overflow.
4. **Loading.** Scrolling each track page, the harness asserts that each explainer's script loads only when its module nears the viewport. It also forces a load failure and asserts that the static diagram appears.
5. **Colour.** A script checks every colour pair each explainer uses, in both themes: 3:1 for graphics and 4.5:1 for text.
6. **Prose.** The guide pages meet the house rules and pass no-ai-slop.
7. **Site.** `PAGES_DISABLE_NETWORK=1 make build` succeeds and `make check` reports 0 flags.

## 5. Delivery

There are 6 implementation plans, one per track, run in this order:

1. **Linear Algebra.** It also builds the shared pieces:
   - `lab-loader.js`, `XP.tween`, `XP.plane` and `XP.lab`;
   - `css/labs.css` and `_data/module_labs.yml`;
   - the layout slot and fallback;
   - each later track's plan removes that track's distribution labs, and the Calculus plan replaces the calculus one-off, so no module loses a lab before its explainer exists;
   - `verify_labs.py`, and the extensions to the bounds check and the harness.
2. Calculus.
3. Mathematics.
4. Mathematical Proof.
5. Bayesian Statistics.
6. Frequentist Statistics.

- Each track passes section 4 before the next starts.
- Each explainer is its own commit.
- Nothing is pushed until the owner asks. A push carries no Claude or Anthropic attribution.
- `docs/interview.md` gains a section on module explainers when the Linear Algebra plan lands.
