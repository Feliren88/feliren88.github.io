---
layout: default
permalink: /encp-vln/
title: "ENCP: Episode-Normalized Conformal Prediction for Vision-and-Language Navigation"
description: "ENCP calibrates complete navigation episodes to provide actionable uncertainty estimates for vision-and-language navigation agents."
image: /assets/img/encp-vln/fig-teaser.png
extra_css: /css/encp-vln.css
---

<article class="encp-page">
  <header class="encp-hero" aria-labelledby="encp-title">
    <div class="encp-title-block">
      <h1 id="encp-title"><span>ENCP:</span> Episode-Normalized Conformal Prediction for Vision-and-Language Navigation</h1>
    </div>

    <div class="encp-meta">
      <div class="encp-authors" aria-label="Authors">
        <a href="/">Vicky Feliren<sup>1,2</sup></a>
        <span aria-hidden="true">,</span>
        <a href="https://research.monash.edu/en/persons/taufiq-asyhari/" target="_blank" rel="noreferrer">A. Taufiq Asyhari<sup>1</sup></a>
        <span aria-hidden="true">,</span>
        <a href="https://research.monash.edu/en/persons/risqi-saputra/" target="_blank" rel="noreferrer">Muhamad Risqi U. Saputra<sup>1</sup></a>
      </div>
      <p class="encp-affiliations">
        <span><sup>1</sup>Monash University, Indonesia</span>
        <span><sup>2</sup>SEACrowd</span>
      </p>

      <div class="encp-resources" aria-label="Project resources">
        <span class="encp-resource" aria-disabled="true">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l4 4v16H6zM14 2v5h5M9 12h6M9 16h6"/></svg>
          <span>Paper</span><small>TBD</small>
        </span>
        <span class="encp-resource" aria-disabled="true">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17 8.5 6h2L15 17M6 13h7M15 6h5M17.5 3.5v5"/></svg>
          <span>arXiv</span><small>TBD</small>
        </span>
        <span class="encp-resource" aria-disabled="true">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg>
          <span>Code</span><small>TBD</small>
        </span>
      </div>
    </div>
  </header>

  <figure class="encp-figure encp-teaser">
    <div class="encp-figure-frame">
      <a class="encp-figure-link" href="/assets/img/encp-vln/fig-teaser.png" target="_blank" aria-label="Open the teaser figure at full resolution">
        <img src="/assets/img/encp-vln/fig-teaser.png" width="2367" height="827" alt="Three-panel ENCP overview: a wrong action changes observations; episode calibration provides route-level coverage; prediction-set size triggers acting or asking for help.">
      </a>
    </div>
    <figcaption>ENCP identifies when a navigation agent should ask for help before an error compounds. It calibrates complete episodes and triggers a query when the action set exceeds a chosen size budget.</figcaption>
  </figure>

  <section class="encp-section encp-abstract" aria-labelledby="encp-abstract-title">
    <h2 id="encp-abstract-title">Abstract</h2>
    <div class="encp-section-body">
      <p>Uncertainty estimation for Vision-Language-Navigation (VLN) models is a critical task since it can help identify ambiguous and unreliable predictions, enabling agents to make safer navigation decisions. As one of the most advanced uncertainty estimation frameworks, conformal prediction (CP) offers a promising approach for uncertainty estimation in VLN. However, as CP is not specifically designed for sequential prediction problems like VLN, it often fails to provide the coverage guarantees it promises.</p>
      <p>To address this issue, we propose Episode-Normalized Conformal Prediction (ENCP), which repairs the coverage guarantee of standard CP by rescaling any base nonconformity score using the policy's residual confidence and calibrating the maximum score over entire episodes rather than individual steps. This episode-level construction provides coverage across all steps of a variable-length trajectory while allowing arbitrary dependence within each episode. Across 4 VLN models and 3 nonconformity scores, ENCP achieves the target coverage on the R2R and REVERIE datasets, while other baselines fail to do so. These results demonstrate that ENCP can provide actionable, model-agnostic uncertainty estimates for determining when a VLN agent should defer to a more capable predictor, including human assistance.</p>
    </div>
  </section>

  <section class="encp-section encp-method" aria-labelledby="encp-method-title">
    <h2 id="encp-method-title">From uncertainty to intervention</h2>
    <div class="encp-section-body">
      <p>ENCP leaves the navigation policy fixed. Score normalization adjusts each action score to the current policy confidence; episode calibration then replaces dependent steps with one maximum per episode. The parameter-free variant uses recorded policy probabilities, whereas the learning-based variant fits a weight before conformal calibration.</p>

      <figure class="encp-figure encp-pipeline">
        <div class="encp-figure-frame">
          <a class="encp-figure-link" href="/assets/img/encp-vln/fig-pipeline.png" target="_blank" aria-label="Open the ENCP pipeline figure at full resolution">
            <img src="/assets/img/encp-vln/fig-pipeline.png" width="2356" height="1261" loading="lazy" alt="Detailed ENCP pipeline showing offline calibration records, parameter-free and learning-based weights, shared episode-level calibration, and deployment with act-or-ask decisions.">
          </a>
        </div>
        <figcaption>ENCP calibrates one worst-step score per episode, then asks for help when the deployed set exceeds τ.</figcaption>
      </figure>
    </div>
  </section>

  <aside class="encp-status" aria-label="Project status">
    <p><strong>Project in progress.</strong> Paper, arXiv preprint, and code will be linked here when available.</p>
  </aside>
</article>
