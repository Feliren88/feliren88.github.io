# Calculus Module Explainers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Give all 7 Calculus modules their own interactive explainers while preserving main’s lesson copy.

**Architecture:** Each module owns its markup, maths exports, interactive scene and guide. The existing lab loader and XP toolkit supply loading, handles, animation, live equations and fallback diagrams. Keep computation in ordinary code and verify numerical claims independently.

**Tech Stack:** Jekyll, Liquid, SVG, JavaScript, Node, NumPy, SciPy and Playwright.

**Spec:** `docs/superpowers/specs/2026-09-30-module-explainers-maths-design.md`, sections 1, 2, 3c, 4 and 5.

## Global Constraints

- Each explainer fits at 390px and 1400px in both site themes.
- Every explainer opens on guide page 1, with 6 to 10 pages and 1 or 2 sentences per page.
- Page 1 uses a specific computed example. Ground each technical term before later pages depend on it.
- Use British spelling, numerals, active verbs and short sentences. Preserve main’s existing lesson prose.
- Keep one colour per quantity across guide, picture and equation. Hover links both directions.
- Drag quantities with natural handles. Use sliders only for quantities without handles or duplicate controls.
- Every motion has Play and scrubbing, lasts 400 to 900ms, and ends immediately under reduced motion.
- Controls capture their requested state before interrupting playback. Backward guide traversal restores the declared example.
- Handles support arrow keys and Shift; all controls clamp their ranges.
- Text meets 4.5:1 and graphics 3:1 contrast in both themes. Explicit edge states replace invalid readouts.
- Keep every module’s static fallback and step player. Remove duplicate equation playgrounds only when their replacement works.
- Add equation-level live metadata and regenerate `_data/interview_math.yml`; never edit that generated file by hand.
- Build with `PAGES_DISABLE_NETWORK=1`. Preview port 4100 belongs to this worktree; ports 4000 and 4011 belong to other processes.
- Commit each explainer separately. The owner has authorised checkpoint pushes and reviewed milestone merges into main.

## Review Focus

- Non-smooth and vertical tangents must distinguish a finite derivative, a corner and an unbounded slope.
- Interrupted playback and manual changes must preserve the requested fraction and allow meaningful rewind.
- Changing views and navigating backwards must restore the correct equations, computed values and visible controls.
- Extreme handles and ill-conditioned arithmetic must remain bounded and describe undefined results accurately.
- Simulation probabilities and standard errors must match their stated sampling assumptions and fixed seeds.

## Interfaces

Each script exports pure functions under Node and calls `XP.lab('calculus/<slug>', mount)` in the browser.
Mount consumes `api.values`, `api.say`, `api.animate`, `api.interrupt`, `XP.plane`, `XP.guide` and `XP.dialog`.
Each include supplies `[data-stage]`, `[data-guide-box]`, `[data-ctl]`, `[data-note]`, `[data-say]` and `[data-val]` nodes.
Use `scripts/verify_labs.py` for NumPy/SciPy comparisons and `scripts/check_calculus_views.py` for focused browser assertions.

### Task 1: Derivatives and rates

**Files:** Create `_includes/labs/calculus/derivatives.html` and `js/labs/calculus/derivatives.js`. Modify `_data/module_labs.yml`, `_data/interview.yml`, `scripts/verify_labs.py`, `scripts/check_calculus_views.py` and `css/labs.css` as needed.

**Interfaces:** Export `value(kind,x), derivative(kind,x), quotient(kind,x,h), samples(kind,x,hs). Kinds are square, sine, exp, abs and cube-root. Derivative returns null at the abs corner and cube-root’s vertical tangent.` No later task depends on these maths functions.

- [x] Step 1. Add an independent numerical check named `calculus/derivatives` with these assertions. Compare values and exact derivatives at x = −1, 0, 1 and 2. Check the square secant at x=1,h=1 is 3 and at h=0.1 is 2.1. Zero h returns null. Check cbrt on negative inputs and cancellation at small h.
- [x] Step 2. Run `../venv/bin/python scripts/verify_labs.py calculus/derivatives`. Expected failure is a missing explainer or maths export.
- [x] Step 3. Implement the pure exports and run the same check. Expected output names this explainer and reports 1 check passed.
- [x] Step 4. Add focused browser assertions for the concrete guide example, active live equation, scrubbing endpoints, backward guide state and the relevant edge case. Run them before registering the lab and confirm the missing interactive scene.
- [x] Step 5. Build its markup, guide and behaviour. Draw the secant, tangent, local magnification and derivative graph. Drag x and the second point; select the 5 functions. Use a 700ms shrink motion with a recorded starting h. Show shrinking-h arithmetic in a dialog. Page 1 uses x² at x=1,h=1. Publish fx, slope and secant in module 0’s derivative equation; remove its repeated curve playground.
- [x] Step 6. Run the focused assertions, `scripts/check_labs.py calculus --base=http://localhost:4100`, `PAGES_DISABLE_NETWORK=1 make check` and `PATH="../venv/bin:$PATH" make test`. Expected results are zero browser problems, zero audit flags and passing tests. Inspect every guide page at 1400px and 390px in both themes.
- [x] Step 7. Commit the explainer with no attribution, then run task-done with the independent numerical check.

### Task 2: The chain rule

**Files:** Create `_includes/labs/calculus/chain-rule.html` and `js/labs/calculus/chain-rule.js`. Modify `_data/module_labs.yml`, `_data/interview.yml`, `scripts/verify_labs.py`, `scripts/check_calculus_views.py` and `css/labs.css` as needed.

**Interfaces:** Export `chain(x,dx), squaredLoss(w,x,b,y), adjoints(w,x,b,y), passCounts(inputs,outputs). The loss result includes every forward node and derivative contribution.` No later task depends on these maths functions.

- [x] Step 1. Add an independent numerical check named `calculus/chain-rule` with these assertions. Check f(g(x)) with g(x)=x² and f(z)=sin(z) at x=1; compare derivative 2x cos(x²) with central differences. For w=2,x=1,b=−1,y=3, verify loss4 and gradients w=−4,x=−8,b=−4,y=4. Verify shared-input contributions sum and pass counts 4/1.
- [x] Step 2. Run `../venv/bin/python scripts/verify_labs.py calculus/chain-rule`. Expected failure is a missing explainer or maths export.
- [x] Step 3. Implement the pure exports and run the same check. Expected output names this explainer and reports 1 check passed.
- [x] Step 4. Add focused browser assertions for the concrete guide example, active live equation, scrubbing endpoints, backward guide state and the relevant edge case. Run them before registering the lab and confirm the missing interactive scene.
- [x] Step 5. Build its markup, guide and behaviour. Use 3 linked number lines with a draggable x and dx. A second view traces squared-error graph values forward and adjoints backward, including a shared input branch. Scrub the forward/backward pass. Drag model inputs in their graph nodes. Show local derivative and summed adjoint tables plus input/output pass counts. Publish chainRate and lossGradient in module 1.
- [x] Step 6. Run the focused assertions, `scripts/check_labs.py calculus --base=http://localhost:4100`, `PAGES_DISABLE_NETWORK=1 make check` and `PATH="../venv/bin:$PATH" make test`. Expected results are zero browser problems, zero audit flags and passing tests. Inspect every guide page at 1400px and 390px in both themes.
- [x] Step 7. Commit the explainer with no attribution, then run task-done with the independent numerical check.

### Task 3: Gradients, Jacobians and Hessians

**Files:** Create `_includes/labs/calculus/gradients-jacobians-hessians.html` and `js/labs/calculus/gradients-jacobians-hessians.js`. Modify `_data/module_labs.yml`, `_data/interview.yml`, `scripts/verify_labs.py`, `scripts/check_calculus_views.py` and `css/labs.css` as needed.

**Interfaces:** Export `surface(x,y), gradient(x,y), hessian(x,y), mapping(x,y), jacobian(x,y), directional(x,y,theta), shapes(d,m). Use f=x²+2y²+0.2xy and map [x+0.2y²,y+0.2x²].` No later task depends on these maths functions.

- [x] Step 1. Add an independent numerical check named `calculus/gradients-jacobians-hessians` with these assertions. Check gradient [2x+0.2y,4y+0.2x] and Hessian [[2,0.2],[0.2,4]] against central differences. Check mapping Jacobian entries and directional rates at 0,π/2,π. Check d=3,m=2 shapes.
- [x] Step 2. Run `../venv/bin/python scripts/verify_labs.py calculus/gradients-jacobians-hessians`. Expected failure is a missing explainer or maths export.
- [x] Step 3. Implement the pure exports and run the same check. Expected output names this explainer and reports 1 check passed.
- [x] Step 4. Add focused browser assertions for the concrete guide example, active live equation, scrubbing endpoints, backward guide state and the relevant edge case. Run them before registering the lab and confirm the missing interactive scene.
- [x] Step 5. Build its markup, guide and behaviour. Draw contours, a gradient field and a draggable point and unit direction. Plot directional rate as a cosine. Warp a grid and magnify a local square to compare the nonlinear map with its Jacobian. Show Hessian eigen-directions and quadratic contours. A shapes view uses integer d,m controls. Publish gx,gy and directionalRate in module 2.
- [x] Step 6. Run the focused assertions, `scripts/check_labs.py calculus --base=http://localhost:4100`, `PAGES_DISABLE_NETWORK=1 make check` and `PATH="../venv/bin:$PATH" make test`. Expected results are zero browser problems, zero audit flags and passing tests. Inspect every guide page at 1400px and 390px in both themes.
- [x] Step 7. Commit the explainer with no attribution, then run task-done with the independent numerical check.

### Task 4: Optimisation conditions

**Files:** Create `_includes/labs/calculus/optimisation-conditions.html` and `js/labs/calculus/optimisation-conditions.js`. Modify `_data/module_labs.yml`, `_data/interview.yml`, `scripts/verify_labs.py`, `scripts/check_calculus_views.py` and `css/labs.css` as needed.

**Interfaces:** Export `stationary(kind), classify(eigenvalues), constrained(theta), curvatureSample(d,count,seed), independentSigns(d). Use minimum x²+y², maximum −x²−y² and saddle x²−y². Use constrained x²+2y² with x+y=1.` No later task depends on these maths functions.

- [x] Step 1. Add an independent numerical check named `calculus/optimisation-conditions` with these assertions. Compare Hessian eigenvalues to eigvalsh; label zero curvature inconclusive. Check constrained optimum [2/3,1/3] with SciPy minimise. Reproduce symmetric Gaussian matrices from seeded samples and compare positive-definite counts exactly using NumPy; include 2⁻ᵈ separately.
- [x] Step 2. Run `../venv/bin/python scripts/verify_labs.py calculus/optimisation-conditions`. Expected failure is a missing explainer or maths export.
- [x] Step 3. Implement the pure exports and run the same check. Expected output names this explainer and reports 1 check passed.
- [x] Step 4. Add focused browser assertions for the concrete guide example, active live equation, scrubbing endpoints, backward guide state and the relevant edge case. Run them before registering the lab and confirm the missing interactive scene.
- [x] Step 5. Build its markup, guide and behaviour. Show signed curvature directions, convex chords and a draggable point on the linear constraint. Animate alignment of objective and constraint gradients. Simulate random symmetric matrices for d=1..6 with fixed seed and labelled provenance; distinguish measured fraction from the independent-sign estimate. Publish stationaryGradient and smallestCurvature in module 3. Preserve the latest main caveat; correct any remaining equation only if the simulation contradicts its claim.
- [x] Step 6. Run the focused assertions, `scripts/check_labs.py calculus --base=http://localhost:4100`, `PAGES_DISABLE_NETWORK=1 make check` and `PATH="../venv/bin:$PATH" make test`. Expected results are zero browser problems, zero audit flags and passing tests. Inspect every guide page at 1400px and 390px in both themes.
- [x] Step 7. Commit the explainer with no attribution, then run task-done with the independent numerical check.

### Task 5: Integration and expectation

**Files:** Create `_includes/labs/calculus/integration.html` and `js/labs/calculus/integration.js`. Modify `_data/module_labs.yml`, `_data/interview.yml`, `scripts/verify_labs.py`, `scripts/check_calculus_views.py` and `css/labs.css` as needed.

**Interfaces:** Export `riemann(kind,a,b,n), integral(kind,a,b), accumulation(kind,x), expectation(kind), monteCarlo(kind,n,seed), transformedDensity(y,scale). Use square, sine, uniform and exponential examples with explicit density support.` No later task depends on these maths functions.

- [ ] Step 1. Add an independent numerical check named `calculus/integration` with these assertions. Compare Riemann sums and exact accumulated areas to scipy.integrate.quad. Verify uniform E[X²]=1/3 and exponential E[X]=1. Check seeded Monte Carlo sample means and estimated standard errors independently. Check scaled density integral remains1.
- [ ] Step 2. Run `../venv/bin/python scripts/verify_labs.py calculus/integration`. Expected failure is a missing explainer or maths export.
- [ ] Step 3. Implement the pure exports and run the same check. Expected output names this explainer and reports 1 check passed.
- [ ] Step 4. Add focused browser assertions for the concrete guide example, active live equation, scrubbing endpoints, backward guide state and the relevant edge case. Run them before registering the lab and confirm the missing interactive scene.
- [ ] Step 5. Build its markup, guide and behaviour. Animate refining rectangles and accumulated area, then shade g(x)p(x). Sample Monte Carlo estimates with an SE band and sample-count progression. Stretch a density strip under a scale change while retaining unit area. Drag integration endpoint and density scale; use integer rectangle/sample counts. Replace only this module’s integral one-off and distribution lab when this explainer lands. Publish area,estimate,se in module 4.
- [ ] Step 6. Run the focused assertions, `scripts/check_labs.py calculus --base=http://localhost:4100`, `PAGES_DISABLE_NETWORK=1 make check` and `PATH="../venv/bin:$PATH" make test`. Expected results are zero browser problems, zero audit flags and passing tests. Inspect every guide page at 1400px and 390px in both themes.
- [ ] Step 7. Commit the explainer with no attribution, then run task-done with the independent numerical check.

### Task 6: Approximation

**Files:** Create `_includes/labs/calculus/approximation.html` and `js/labs/calculus/approximation.js`. Modify `_data/module_labs.yml`, `_data/interview.yml`, `scripts/verify_labs.py`, `scripts/check_calculus_views.py` and `css/labs.css` as needed.

**Interfaces:** Export `taylor(kind,a,x,order), coefficients(kind,a,order), newton(kind,x,count), descent(kind,x,step,count), differenceError(kind,x,h). Use exp and log1p Taylor expansions, convex x²+x⁴/4 and concave −x² examples.` No later task depends on these maths functions.

- [ ] Step 1. Add an independent numerical check named `calculus/approximation` with these assertions. Compare Taylor coefficients and approximation errors with exact derivatives and NumPy polynomial evaluation. Verify log1p outside its convergence radius can worsen with order. Check Newton/descent paths and step counts; return explicit stalled state at zero curvature. Verify central difference error against the exact derivative over h=10⁻¹..10⁻¹⁶.
- [ ] Step 2. Run `../venv/bin/python scripts/verify_labs.py calculus/approximation`. Expected failure is a missing explainer or maths export.
- [ ] Step 3. Implement the pure exports and run the same check. Expected output names this explainer and reports 1 check passed.
- [ ] Step 4. Add focused browser assertions for the concrete guide example, active live equation, scrubbing endpoints, backward guide state and the relevant edge case. Run them before registering the lab and confirm the missing interactive scene.
- [ ] Step 5. Build its markup, guide and behaviour. Draw curve, Taylor polynomial and error shading around a draggable expansion point. Scrub rising order, and compare Newton’s local parabola with gradient descent. Show concave curvature causing an uphill Newton step. Plot the finite-difference error on logarithmic axes. Publish approximation,error,newtonNext in module 5 and remove the repeated Taylor playground.
- [ ] Step 6. Run the focused assertions, `scripts/check_labs.py calculus --base=http://localhost:4100`, `PAGES_DISABLE_NETWORK=1 make check` and `PATH="../venv/bin:$PATH" make test`. Expected results are zero browser problems, zero audit flags and passing tests. Inspect every guide page at 1400px and 390px in both themes.
- [ ] Step 7. Commit the explainer with no attribution, then run task-done with the independent numerical check.

### Task 7: Matrix calculus

**Files:** Create `_includes/labs/calculus/matrix-calculus.html` and `js/labs/calculus/matrix-calculus.js`. Modify `_data/module_labs.yml`, `_data/interview.yml`, `scripts/verify_labs.py`, `scripts/check_calculus_views.py` and `css/labs.css` as needed.

**Interfaces:** Export `softmax(logits), layer(W,x,b,label), quadratic(A,w), shapes(inputs,outputs,layout,mistake). Layer returns logits,p,loss,delta,dW,dx,db with stable log-sum-exp.` No later task depends on these maths functions.

- [ ] Step 1. Add an independent numerical check named `calculus/matrix-calculus` with these assertions. Check logits [1,2,3] against scipy.special.softmax and stable loss for large logits. Compare every dW,dx,db entry with central differences. Verify non-symmetric quadratic gradient (A+Aᵀ)w. Verify both layout conventions and deliberate transpose mismatch dimensions.
- [ ] Step 2. Run `../venv/bin/python scripts/verify_labs.py calculus/matrix-calculus`. Expected failure is a missing explainer or maths export.
- [ ] Step 3. Implement the pure exports and run the same check. Expected output names this explainer and reports 1 check passed.
- [ ] Step 4. Add focused browser assertions for the concrete guide example, active live equation, scrubbing endpoints, backward guide state and the relevant edge case. Run them before registering the lab and confirm the missing interactive scene.
- [ ] Step 5. Build its markup, guide and behaviour. Draw shape-sized layer blocks and reverse gradient blocks. Drag logits and selected W/A entries, with bars for probability and predicted-minus-label. Show the non-symmetric quadratic surface and gradient arrows. Switch layout convention and flag a transpose error with an explicit mismatch. Zoom into delta xᵀ entry arithmetic. Publish probability,delta and loss in module 6; remove its duplicate softmax controls.
- [ ] Step 6. Run the focused assertions, `scripts/check_labs.py calculus --base=http://localhost:4100`, `PAGES_DISABLE_NETWORK=1 make check` and `PATH="../venv/bin:$PATH" make test`. Expected results are zero browser problems, zero audit flags and passing tests. Inspect every guide page at 1400px and 390px in both themes.
- [ ] Step 7. Commit the explainer with no attribution, then run task-done with the independent numerical check.

### Task 8: Calculus milestone

**Files:** Update `docs/interview.md` and the milestone handoff. Preserve all other lesson copy.

- [ ] Step 1. Review every new guide, heading, dialog and source line with the requested writing guides. Fix imprecise claims and ungrounded terms.
- [ ] Step 2. Run the full site, numerical, generated-equation, explainer, page and chart-bounds checks. Expected results are 14 total maths checks, 2 tracks checked with 0 problems, and zero page errors or overflowing charts.
- [ ] Step 3. Record the 7 Calculus checkpoints, verification evidence and next maths track in the handoff. Commit the milestone.
- [ ] Step 4. Request one fresh whole-branch review against main. Fix Important/Critical findings with failing regressions and a green suite. Record Minor findings for later.
- [ ] Step 5. Publish the checkpoint, merge the verified milestone into main, recheck the merged tree, push and safely update the owner’s clean Desktop checkout.
