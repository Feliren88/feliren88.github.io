---
layout: page
title: "Hidden-State Detection of In-Context Goal Hijacking with a Conformal False-Positive Guarantee"
subtitle: "Heron AI Security Research Fellowship — Work-Test Prototype"
description: "A read-only self-probe on Qwen2.5-0.5B-Instruct's residual stream detects in-context goal-hijack attempts with deconfounded AUC 1.000 and a split-conformal false-positive guarantee, with confound controls that caught a shortcut a naive detector would have shipped with."
permalink: /heron/
image: /assets/img/usecases/heron-hijack-self-probe.webp
---

<style>
  .page-header .subtitle { max-width: none; }
  .page-content { max-width: 52rem; }

  .heron-crumbs { margin: 0 0 1.6rem; font-size: var(--fs-xs); color: var(--muted); }
  .heron-crumbs a { color: var(--muted); text-decoration: none; transition: color 0.15s; }
  .heron-crumbs a:hover { color: var(--accent); }
  .heron-crumbs span { margin: 0 0.4rem; }

  .heron-meta { margin: 0 0 1.75rem; font-size: var(--fs-sm); color: var(--muted); line-height: 1.7; }
  .heron-meta b { color: var(--text); font-weight: 600; }
  .heron-meta code {
    font-family: "SF Mono", "JetBrains Mono", Consolas, monospace;
    font-size: 0.82em; background: var(--surface); border: 1px solid var(--line);
    padding: 0.05rem 0.35rem; border-radius: var(--radius-sm); color: var(--text);
  }

  .heron-tiles {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: var(--gap-2); margin: 0 0 var(--gap-4);
  }
  .heron-tile {
    padding: var(--card-pad-sm); border: 1px solid var(--line); border-radius: var(--radius-lg);
    background: var(--surface);
  }
  .heron-tile .num {
    font-family: "Space Grotesk", sans-serif; font-size: 1.4rem; font-weight: 700;
    color: var(--text); letter-spacing: -0.01em;
  }
  .heron-tile .num.accent { color: var(--accent); }
  .heron-tile .lbl { margin-top: 0.3rem; font-size: var(--fs-xs); color: var(--muted); line-height: 1.5; }

  .heron-section { margin: 0 0 var(--gap-4); scroll-margin-top: 90px; }
  .heron-section h2 {
    display: flex; align-items: baseline; gap: 0.6rem;
    font-family: "Space Grotesk", sans-serif; font-size: var(--fs-heading);
    color: var(--text); margin: 0 0 0.9rem;
  }
  .heron-section h2 .n {
    font-family: "Space Grotesk", sans-serif; font-size: var(--fs-sm); font-weight: 700; color: var(--accent);
  }
  .heron-section h3 {
    font-family: "Space Grotesk", sans-serif; font-size: var(--fs-title); color: var(--text);
    margin: 1.6rem 0 0.7rem;
  }
  .heron-section p, .heron-section li { color: var(--muted); line-height: 1.75; font-size: var(--fs-base); }
  .heron-section p { margin: 0 0 0.9rem; }
  .heron-section ul, .heron-section ol { padding-left: 1.3rem; margin: 0 0 0.9rem; }
  .heron-section li { margin: 0.4rem 0; }
  .heron-section li b, .heron-section p b { color: var(--text); }
  .heron-section .soft { color: var(--muted); }

  .heron-table-wrap { overflow-x: auto; margin: 0 0 1.2rem; border: 1px solid var(--line); border-radius: var(--radius-lg); }
  .heron-table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); min-width: 480px; }
  .heron-table th, .heron-table td { text-align: left; padding: 0.55rem 0.8rem; border-bottom: 1px solid var(--line); }
  .heron-table th {
    font-family: "Space Grotesk", sans-serif; font-size: var(--fs-2xs); text-transform: uppercase;
    letter-spacing: 0.06em; color: var(--muted); background: var(--surface);
  }
  .heron-table td { color: var(--muted); }
  .heron-table td b, .heron-table td.id { color: var(--text); }
  .heron-table td.num, .heron-table th.num { text-align: right; font-variant-numeric: tabular-nums; }
  .heron-table tr:last-child td { border-bottom: none; }
  .heron-table tr.hl td { background: color-mix(in srgb, var(--accent) 8%, transparent); }

  .heron-figure { margin: 0 0 1.2rem; }
  .heron-figure .heron-figure-frame {
    background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg);
    padding: 1rem;
  }
  .heron-figure img { display: block; width: 100%; height: auto; border-radius: var(--radius-md); }
  .heron-figure figcaption { margin-top: 0.7rem; font-size: var(--fs-xs); color: var(--muted); line-height: 1.6; }
  .heron-figure figcaption b { color: var(--text); }

  .heron-code {
    background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg);
    padding: 1rem 1.1rem; overflow-x: auto; margin: 0 0 1rem;
  }
  .heron-code code {
    font-family: "SF Mono", "JetBrains Mono", Consolas, monospace; font-size: 0.82rem;
    line-height: 1.7; color: var(--text); white-space: pre;
  }

  .heron-refs { font-size: var(--fs-sm); color: var(--muted); padding-left: 1.3rem; }
  .heron-refs li { margin: 0.5rem 0; }

  .heron-footer {
    margin-top: var(--gap-4); padding-top: 1.2rem; border-top: 1px solid var(--line);
    font-size: var(--fs-xs); color: var(--muted); line-height: 1.6;
  }

  @media (max-width: 600px) { .page-content { max-width: 100%; } }
</style>

<p class="heron-crumbs">
  <a href="/usecases/">Use Cases</a><span>/</span><a href="/usecases/heron-hijack-self-probe/">Structured Summary</a><span>/</span>Full Report
</p>

<p class="heron-meta">
  <b>Vicky Feliren</b> · Heron AI Security Research Fellowship, work-test prototype (computation-aware security project, project lead Yossi Gandelsman) · Model: Qwen2.5-0.5B-Instruct ·
  Code: <code>self_probe_hijack_detection.py</code>, <code>ablations.py</code>, <code>ablations_extended.py</code>, <code>behavioral_check.py</code>
</p>

<div class="heron-tiles reveal-group">
  <div class="heron-tile reveal"><div class="num">1.000 &plusmn; 0.000</div><div class="lbl">Deconfounded AUC (benign-prefix vs. attacked), 10 seeds, layer 12</div></div>
  <div class="heron-tile reveal"><div class="num accent">0.031 &plusmn; 0.033</div><div class="lbl">Empirical false-positive rate at the conformal threshold, target &alpha; = 0.05</div></div>
  <div class="heron-tile reveal"><div class="num">1.000 &plusmn; 0.000</div><div class="lbl">True-positive rate on held-out phrasings, disjoint-vocabulary paraphrases, and suffix-position attacks</div></div>
  <div class="heron-tile reveal"><div class="num">24&ndash;58%</div><div class="lbl">Output-level hijack success rate; the probe flags &asymp;100% of attempts</div></div>
</div>

<nav class="heron-crumbs" aria-label="Report sections">
  <a href="#problem">Problem</a><span>·</span>
  <a href="#literature">Literature</a><span>·</span>
  <a href="#gap">Gap</a><span>·</span>
  <a href="#methodology">Methodology</a><span>·</span>
  <a href="#results">Results</a><span>·</span>
  <a href="#discussion">Discussion</a><span>·</span>
  <a href="#conclusion">Conclusion</a>
</nav>

<section class="heron-section" id="problem">
  <h2><span class="n">01</span> Problem</h2>
  <p>
    Most deployed security monitoring for large language models analyzes inputs and outputs.
    An in-context goal-hijack attack places an injected instruction in the prompt that attempts
    to override the user's task. The attack modifies the model's internal computation whether
    or not the final output changes. When the model resists the injection at the output level,
    input/output monitoring records nothing unusual, and the attempt goes unlogged.
  </p>
  <p>This prototype tests two precise questions on a small instruction-tuned model:</p>
  <ol>
    <li>Do residual-stream hidden states contain a linearly separable signal that distinguishes
      hijack attempts from benign traffic, including benign traffic that superficially resembles
      an attack?</li>
    <li>Can the resulting detector's false-positive rate be bounded in advance, with finite-sample
      validity, using split conformal prediction?</li>
  </ol>
  <p class="soft">
    The threat model is deliberately benign. Injections request harmless outputs such as a fixed
    word or number. The detected condition is the presence of a goal-override attempt in context.
    No harmful content is generated at any point.
  </p>
</section>

<section class="heron-section" id="literature">
  <h2><span class="n">02</span> Existing literature</h2>
  <p>
    Four results motivate reading internal states for security, and one line of statistical work
    supplies the guarantee mechanism.
  </p>
  <ul>
    <li><b>Arditi et al. (NeurIPS 2024)</b> showed that refusal behavior is mediated by a small
      number of identifiable directions in activation space. Safety-relevant state is therefore
      linearly represented and readable with simple probes.</li>
    <li><b>Yona et al. (2025, preprint)</b> introduced in-context representation hijacking:
      adversarial context alters internal representations and induces unsafe behavior. Internal
      representations are an attack surface.</li>
    <li><b>Lindsey (2025)</b> reported a functional and unreliable form of introspective awareness
      in large language models.</li>
    <li><b>Plunkett et al. (2025, preprint)</b> showed that models can describe internal processes
      behind their decisions when given access to those processes.</li>
    <li><b>Split conformal prediction</b> (Vovk et al. 2005; Angelopoulos and Bates 2023) converts
      any anomaly score into a decision rule with a finite-sample marginal guarantee under
      exchangeability. Bates et al. (2023) formalized outlier detection with conformal p-values.</li>
  </ul>
</section>

<section class="heron-section" id="gap">
  <h2><span class="n">03</span> Gap</h2>
  <p>
    Activation-based attack detectors typically report accuracy or AUC. Two elements are usually
    absent, and this prototype supplies both.
  </p>
  <p>
    <b>A false-positive budget with a guarantee.</b> A security operator needs to set an acceptable
    false-alarm rate before deployment. A raw probe score does not support this. A split-conformal
    threshold does: under exchangeability of calibration and deployment benign traffic, the flag
    rule satisfies P(flag | benign) &le; &alpha; with finite-sample validity.
  </p>
  <p>
    <b>Confound controls in the benchmark itself.</b> A detector trained on clean prompts versus
    prompts with an injected prefix can reach perfect AUC by encoding the feature "extra text
    precedes the task". That feature also matches harmless prefixed prompts, so the perfect AUC
    misstates deployment performance. The benchmark here includes a benign-prefix control condition
    designed to expose exactly this failure. Section 5 shows that it did.
  </p>
</section>

<section class="heron-section" id="methodology">
  <h2><span class="n">04</span> Methodology</h2>

  <figure class="heron-figure">
    <div class="heron-figure-frame">
      <img class="uc-flow-img" src="/assets/img/usecases/heron-hijack-self-probe.webp" data-src-dark="/assets/img/usecases/heron-hijack-self-probe.webp" data-src-light="/assets/img/usecases/heron-hijack-self-probe-light.webp" alt="End-to-end pipeline: four dataset conditions feed one read-only hidden-state capture, a control-aware logistic regression probe, and a split-conformal false-positive gate." width="1320" height="600" loading="lazy" decoding="async">
    </div>
    <figcaption><b>Figure 1.</b> End-to-end pipeline. Four dataset conditions feed one cached
      forward pass; a logistic-regression probe on layer 12 scores each prompt; a split-conformal
      threshold on benign calibration scores sets the decision rule at &alpha; = 0.05.
      When benign traffic of a new form appears (Section 5), the calibration set is extended and
      the threshold recomputed, with detector weights unchanged (A8b).</figcaption>
  </figure>

  <h3>Dataset (384 prompts, four conditions)</h3>
  <p>We generated 96 instances of each condition from 16 benign base tasks (short factual and instruction-following questions):</p>
  <div class="heron-table-wrap">
    <table class="heron-table">
      <tr><th>Condition</th><th>Construction</th><th class="num">Label</th><th>Role</th></tr>
      <tr><td class="id">Clean</td><td>base task only</td><td class="num">0</td><td>benign reference</td></tr>
      <tr><td class="id">Attacked</td><td>one of 4 goal-hijack templates + task</td><td class="num">1</td><td>training attacks</td></tr>
      <tr><td class="id">Benign-prefix control</td><td>one of 4 harmless prefixes + task</td><td class="num">0</td><td>confound control</td></tr>
      <tr><td class="id">Held-out family</td><td>one of 4 unseen hijack templates + task</td><td class="num">1</td><td>generalization test, excluded from all training</td></tr>
    </table>
  </div>

  <h3>Feature extraction (read-only)</h3>
  <p>
    We ran one forward pass per prompt through Qwen2.5-0.5B-Instruct with its chat template and
    recorded residual-stream hidden states at all 25 positions (embeddings plus 24 transformer
    blocks), with last-token and mean pooling. Features are cached, so the entire ablation suite
    reuses a single model pass. The extraction reads activations and modifies nothing.
  </p>

  <h3>Probe and two training protocols</h3>
  <p>
    The detector is a logistic regression on standardized features from one layer (layer 12 in the
    main experiment). Every condition is split 50/50 into training and evaluation pools. We trained
    two variants:
  </p>
  <ul>
    <li><b>Naive:</b> clean vs. attacked, the protocol of the original scaffold.</li>
    <li><b>Control-aware:</b> {clean + benign-prefix} vs. attacked, which requires the decision
      boundary to separate goal-override prefixes from harmless prefixes.</li>
  </ul>

  <h3>Conformal calibration</h3>
  <p>
    We computed a one-sided split-conformal threshold &tau; on benign-only calibration scores at
    the corrected level &lceil;(n+1)(1&minus;&alpha;)&rceil;/n, so the marginal bound
    P(score &gt; &tau; | benign) &le; &alpha; is valid at finite sample sizes. The calibration pool
    mixes clean and benign-prefix scores, matching deployment traffic that contains harmless
    prefixed prompts. We set &alpha; = 0.05.
  </p>

  <h3>Ablations and controls</h3>
  <div class="heron-table-wrap">
    <table class="heron-table">
      <tr><th class="num">ID</th><th>Ablation</th><th>Failure mode it tests for</th></tr>
      <tr><td class="num id">A1</td><td>Layer sweep (all 25 layers)</td><td>dependence on one arbitrary layer choice</td></tr>
      <tr><td class="num id">A2</td><td>Last-token vs. mean pooling</td><td>dependence on the aggregation point</td></tr>
      <tr><td class="num id">A3</td><td>Shuffled-label control</td><td>pipeline leakage; AUC must return to &asymp;0.5</td></tr>
      <tr><td class="num id">A4</td><td>Leave-one-injection-out</td><td>memorization of surface strings</td></tr>
      <tr><td class="num id">A5</td><td>Benign-prefix control + held-out family</td><td>detection of prefix presence instead of goal override</td></tr>
      <tr><td class="num id">A6</td><td>10-seed repetition of the full protocol</td><td>results specific to one lucky split</td></tr>
      <tr><td class="num id">A7</td><td>200 random calibration/test splits</td><td>violation of the conformal FPR bound</td></tr>
      <tr><td class="num id">B</td><td>Behavioral check (greedy decoding, 192 attacked prompts)</td><td>labels with no behavioral grounding</td></tr>
      <tr><td class="num id">A8</td><td>Suffix-position attacks + benign-suffix controls (288 new prompts)</td><td>detection restricted to the trained prefix position</td></tr>
      <tr><td class="num id">A9</td><td>Paraphrase attack set with disjoint vocabulary</td><td>keyword matching instead of semantic detection</td></tr>
      <tr><td class="num id">A10</td><td>20 independent label shuffles</td><td>ambiguity of a single-shuffle null</td></tr>
    </table>
  </div>
  <p>
    The A9 paraphrases express the same goal-override intent while avoiding every command word of
    the training templates: none of them use <i>ignore, disregard, override, forget, skip, cancel,
    system, admin, directive, instruction, developer, task,</i> or <i>request</i>. The A8 conditions
    reuse the four training templates and the four harmless prefixes, appended after the task
    instead of before it. A8/A9 evaluate the prefix-trained detector at its original conformal
    threshold, with no retraining.
  </p>
  <p class="soft">
    Five unit tests cover the conformal math, including Monte-Carlo validation of the p-value
    calibration and of the threshold rule. All five pass.
  </p>
</section>

<section class="heron-section" id="results">
  <h2><span class="n">05</span> Results</h2>

  <h3>Headline metrics (10 seeds, mean &plusmn; sd, layer 12, &alpha; = 0.05)</h3>
  <div class="heron-table-wrap">
    <table class="heron-table">
      <tr><th>Metric</th><th class="num">Naive probe</th><th class="num">Control-aware probe</th></tr>
      <tr><td>AUC, clean vs. attacked</td><td class="num">1.000 &plusmn; 0.000</td><td class="num">1.000 &plusmn; 0.000</td></tr>
      <tr class="hl"><td>AUC, benign-prefix vs. attacked (deconfounded)</td><td class="num">0.983 &plusmn; 0.007</td><td class="num">1.000 &plusmn; 0.000</td></tr>
      <tr><td>FPR on benign pool at conformal &tau;</td><td class="num">0.021 &plusmn; 0.026</td><td class="num">0.031 &plusmn; 0.033</td></tr>
      <tr><td>TPR, training injection family</td><td class="num">0.856 &plusmn; 0.072</td><td class="num">1.000 &plusmn; 0.000</td></tr>
      <tr class="hl"><td>TPR, held-out injection family</td><td class="num">0.711 &plusmn; 0.075</td><td class="num">1.000 &plusmn; 0.000</td></tr>
    </table>
  </div>

  <h3>The confound, quantified</h3>
  <p>
    Both probes reach AUC 1.000 on clean vs. attacked. The clean-vs-attacked metric therefore
    cannot distinguish them. The control conditions can. In the first run, with the threshold
    calibrated on clean scores only, the naive probe flagged <b>96 of 96 benign-prefix controls
    (100%)</b> as attacks. The naive decision boundary encodes the feature "extra text precedes the
    task". Calibrating on a mixed benign pool lowers the naive false alarms to
    0.021 &plusmn; 0.026, and this correction reduces held-out-family TPR to 0.711 &plusmn; 0.075.
    Control-aware training restores held-out-family TPR to 1.000 &plusmn; 0.000 and raises the
    deconfounded AUC from 0.983 to 1.000.
  </p>
  <div class="note-block" role="note">
    <span class="note-badge">Finding</span>
    <p>Without the benign-prefix control, this benchmark would report a perfect detector while the
      deployed system flagged every harmless prefixed prompt. The control changed the conclusion,
      and the corrected training protocol removed the failure.</p>
  </div>

  <figure class="heron-figure">
    <div class="heron-figure-frame">
      <img src="/assets/img/heron/hijack-detection-scores.webp" alt="Histogram of control-aware probe scores at layer 12: clean and benign-prefix scores concentrate left of the conformal threshold, train-family and held-out-family attacked scores concentrate right of it." width="980" height="588" loading="lazy" decoding="async">
    </div>
    <figcaption><b>Figure 2.</b> Control-aware probe scores at layer 12. Both benign conditions
      concentrate left of the conformal threshold &tau; (dashed line, &alpha; = 0.05); both attack
      families concentrate right of it, including the family excluded from training. Empirical FPR
      on this split: 0.042. TPR: 1.000 on both families.</figcaption>
  </figure>

  <h3>Ablation outcomes</h3>
  <ul>
    <li><b>A1/A2 layer and pooling sweep.</b> Deconfounded AUC equals 1.0 at every layer from 1
      through 24, for last-token and mean pooling. Layer 0 (raw embeddings at the final position)
      gives chance performance, as expected, because the final template token is identical across
      prompts. The separation task is linearly easy at every depth for these injections.</li>
    <li><b>A3/A10 shuffled labels.</b> A single shuffle gives AUC 0.582. Twenty independent
      shuffles give 0.501 &plusmn; 0.082 (range 0.361&ndash;0.679), so the single-shuffle value is
      an unremarkable draw from a null centered on chance. No pipeline leakage.</li>
    <li><b>A4 leave-one-injection-out.</b> AUC 1.000 for each of the four held-out templates. The
      probe does not memorize template strings.</li>
    <li><b>A7 conformal validity.</b> Mean empirical FPR over 200 random calibration/test splits:
      0.017, below the target &alpha; = 0.05. The 99th-percentile single-split FPR is 0.125; the
      guarantee bounds the expectation, and individual splits may exceed &alpha;.</li>
  </ul>

  <figure class="heron-figure">
    <div class="heron-figure-frame">
      <img src="/assets/img/heron/ablation-layer-sweep.webp" alt="Held-out AUC per layer, last-token and mean pooling: all curves saturate at 1.0 from layer 1 onward, with layer 0 at chance." width="980" height="560" loading="lazy" decoding="async">
    </div>
    <figcaption><b>Figure 3.</b> Held-out AUC per layer. All curves saturate at 1.0 from layer 1
      onward. The saturation indicates that these template injections are lexically distinctive
      enough for early layers to separate. Layer-localization questions require a harder attack
      suite (Discussion).</figcaption>
  </figure>

  <h3>Extended ablations: paraphrase, position, and a second calibration finding</h3>
  <div class="heron-table-wrap">
    <table class="heron-table">
      <tr><th>Evaluation (prefix-trained detector, 10 seeds)</th><th class="num">Value</th></tr>
      <tr class="hl"><td>TPR on paraphrase attacks with disjoint vocabulary (A9), fixed &tau;</td><td class="num">1.000 &plusmn; 0.000</td></tr>
      <tr><td>TPR on suffix-position attacks (A8), fixed &tau;</td><td class="num">1.000 &plusmn; 0.000</td></tr>
      <tr><td>AUC, benign-suffix vs. suffix-attack</td><td class="num">1.000 &plusmn; 0.000</td></tr>
      <tr class="hl"><td>FPR on benign-suffix controls at the prefix-calibrated &tau;</td><td class="num">0.526 &plusmn; 0.070</td></tr>
      <tr><td>FPR on benign-suffix after recalibration with suffix-form benign traffic (A8b)</td><td class="num">0.060 &plusmn; 0.044</td></tr>
      <tr><td>FPR on the combined benign pool after recalibration (the quantity the bound covers)</td><td class="num">0.030 &plusmn; 0.022</td></tr>
      <tr><td>All TPRs after recalibration (train, suffix, paraphrase families)</td><td class="num">1.000 &plusmn; 0.000</td></tr>
    </table>
  </div>
  <p>
    The paraphrase result rules out keyword matching: the detector reaches TPR 1.000 on hijack
    phrasings that share no command vocabulary with its training set. The suffix result adds
    position generalization for attacks.
  </p>
  <p>
    The benign side produced the second calibration finding. The prefix-calibrated threshold
    misclassifies 52.6% of harmless suffixed prompts, although the score ranking between
    benign-suffix and suffix-attack remains perfect (AUC 1.000). Benign traffic of a form absent
    from the calibration set violates the exchangeability assumption, and the FPR bound becomes
    vacuous for that traffic. Adding suffix-form benign scores to the calibration pool, with
    detector weights unchanged, reduces the combined benign-pool FPR to 0.030 &plusmn; 0.022,
    within the &alpha; = 0.05 target, at unchanged TPR. The bound is marginal over the calibration
    mixture; the suffix subgroup alone measures 0.060 &plusmn; 0.044, and per-subgroup validity
    requires group-conditional (Mondrian) calibration.
  </p>
  <div class="note-block" role="note">
    <span class="note-badge">Finding</span>
    <p>Both calibration findings follow the same pattern: the probe's ranking is robust, and the
      decision threshold is only as valid as the coverage of the benign calibration set. Detection
      quality and calibration coverage are separate failure surfaces, and a security benchmark
      should measure both.</p>
  </div>

  <h3>Behavioral grounding</h3>
  <p>
    Greedy decoding on all 192 attacked prompts measures how often the injection changes the
    model's output. The injected instruction succeeds in <b>24.0%</b> of training-family prompts
    and <b>58.3%</b> of held-out-family prompts. The internal probe flags essentially all attempts
    in both families. The attacked label therefore means a hijack attempt is present in context. It
    does not mean the hijack succeeded.
  </p>
</section>

<section class="heron-section" id="discussion">
  <h2><span class="n">06</span> Discussion</h2>

  <h3>What the evidence supports</h3>
  <ul>
    <li>Hidden states of Qwen2.5-0.5B-Instruct contain a linearly separable signal for this class
      of in-context goal hijack (deconfounded AUC 1.000 &plusmn; 0.000 across 10 splits).</li>
    <li>The detected feature is semantic. TPR is 1.000 &plusmn; 0.000 on an unseen phrasing family,
      on paraphrases that share no command vocabulary with the training templates, and on attacks
      moved from prefix to suffix position. The detector does not activate on harmless prefixes
      when the training protocol includes the control condition (FPR 0.031 &plusmn; 0.033 at
      &alpha; = 0.05).</li>
    <li>The conformal threshold satisfies its finite-sample marginal FPR bound empirically (mean
      FPR 0.017 over 200 splits, target 0.05).</li>
    <li>The internal signal is informative in the regime where output monitoring records nothing:
      injections change the output in 24.0&ndash;58.3% of cases, and the probe flags &asymp;100% of
      attempts.</li>
  </ul>

  <h3>What the evidence does not support</h3>
  <ul>
    <li>The probe is an external read of activations by a separate classifier. It is the baseline
      that model self-use methods, the target of the fellowship project, must exceed. No claim of
      model introspection follows from this work.</li>
    <li>Results cover one 0.5B model and one template-generated attack style. The saturated layer
      sweep (AUC 1.0 from layer 1) shows the injections are lexically distinctive, so the current
      suite cannot answer where in the network the hijack signal becomes available. Extension to
      paraphrase-diverse and semantic hijacks in the style of Yona et al. is required.</li>
    <li>The conformal bound assumes exchangeability between calibration and deployment benign
      traffic, and A8 measures the cost of violating it: benign prompts in an uncalibrated form
      (suffix position) produced a 52.6% false-alarm rate against a 5% target. Recalibration with
      representative benign traffic restored validity (combined-pool FPR 0.030 &plusmn; 0.022). The
      guarantee is also marginal in two senses: single calibration splits reached FPR 0.125 at the
      99th percentile while the mean measured 0.017, and subgroup FPR (0.060 on suffix-benign)
      exceeds the mixture-level bound. Group-conditional calibration addresses the latter.</li>
  </ul>

  <h3>Implication for benchmark design</h3>
  <p>
    The methodological findings are quantitative. A benchmark with only clean and attacked
    conditions certified a detector at AUC 1.000 that misclassified 100% of harmless prefixed
    prompts. A calibration set restricted to one benign format certified a 5% false-alarm budget
    that measured 52.6% on another benign format. Confound controls belong inside the attack
    benchmarks the project plans to release, detector training should include them as negative
    examples, and calibration sets should be audited for coverage of deployment benign traffic.
  </p>
</section>

<section class="heron-section" id="conclusion">
  <h2><span class="n">07</span> Conclusion</h2>
  <p>
    We built a reproducible prototype that reads a model's residual-stream hidden states during
    inference, trains a linear probe to detect in-context goal-hijack attempts, and calibrates the
    decision threshold with split conformal prediction. On Qwen2.5-0.5B-Instruct the control-aware
    detector reaches deconfounded AUC 1.000 &plusmn; 0.000, holds the empirical false-positive rate
    to 0.031 &plusmn; 0.033 against a target of 0.05, and transfers with TPR 1.000 &plusmn; 0.000 to
    an injection family excluded from training. The detector achieves TPR 1.000 &plusmn; 0.000 on
    an unseen phrasing family, on paraphrases with disjoint vocabulary, and on suffix-position
    attacks, so the detected feature is the goal-override semantics. Two findings came from the
    controls. The benign-prefix control exposed a confound that inverted the naive benchmark's
    conclusion. The suffix-position control measured the cost of a calibration set that
    under-covers benign traffic (52.6% false alarms against a 5% budget), and recalibration with
    representative traffic restored validity. The behavioral check showed that the internal signal
    detects attempts that output monitoring misses. Next steps within the fellowship:
    representation-level attacks, larger models, weight-space tampering, group-conditional
    calibration, and the transition from external probes to detectors the model itself can use.
  </p>

  <h3>Reproduction</h3>
  <div class="heron-code"><code>python -m venv .venv &amp;&amp; .venv/bin/pip install -r requirements.txt
.venv/bin/python self_probe_hijack_detection.py   # main experiment + Figure 1
.venv/bin/python ablations.py                     # A1-A7 + Figure 2
.venv/bin/python ablations_extended.py            # A8-A10 + recalibration
.venv/bin/python behavioral_check.py              # hijack success rates
.venv/bin/pytest self_probe_hijack_detection.py   # 5 unit tests</code></div>
  <p class="soft">
    Outputs: <code>results_main.json</code>, <code>results_ablations.json</code>,
    <code>results_ablations_extended.json</code>, <code>results_behavioral.json</code>, both
    figures. Two model passes (384 base prompts, 288 extended prompts) populate the feature caches;
    every ablation runs from the caches in seconds.
  </p>

  <h3>References</h3>
  <ol class="heron-refs">
    <li>Arditi et al. Refusal in Language Models Is Mediated by a Single Direction. NeurIPS 2024.</li>
    <li>Yona et al. In-Context Representation Hijacking. 2025. Preprint.</li>
    <li>Lindsey. Emergent Introspective Awareness in Large Language Models. 2025.</li>
    <li>Plunkett et al. Self-Interpretability: LLMs Can Describe Complex Internal Processes That Drive Their Decisions. 2025. Preprint.</li>
    <li>Vovk, Gammerman, Shafer. Algorithmic Learning in a Random World. Springer, 2005.</li>
    <li>Angelopoulos, Bates. Conformal Prediction: A Gentle Introduction. Foundations and Trends in Machine Learning, 2023.</li>
    <li>Bates et al. Testing for Outliers with Conformal p-values. Annals of Statistics, 2023.</li>
  </ol>
</section>

<p class="heron-footer">
  Work-test prototype for the Heron AI Security Research Fellowship, computation-aware security
  project (project lead: Yossi Gandelsman). All experiments are read-only with respect to the model
  and generate no harmful content. <a href="/usecases/heron-hijack-self-probe/">View the structured
  use case summary →</a>
</p>
