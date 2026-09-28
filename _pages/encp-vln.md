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
        <a class="encp-resource" href="https://arxiv.org/pdf/2609.17499" target="_blank" rel="noreferrer" aria-label="Read the ENCP preprint PDF">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l4 4v16H6zM14 2v5h5M9 12h6M9 16h6"/></svg>
          <span>PDF</span><small>Preprint</small>
        </a>
        <a class="encp-resource" href="https://arxiv.org/abs/2609.17499" target="_blank" rel="noreferrer" aria-label="Read the ENCP arXiv record">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17 8.5 6h2L15 17M6 13h7M15 6h5M17.5 3.5v5"/></svg>
          <span>arXiv</span><small>Available</small>
        </a>
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
        <img src="/assets/img/encp-vln/fig-teaser.png" width="2367" height="827" alt="3-panel ENCP overview showing how a wrong action changes observations, episode calibration provides route-level coverage, and prediction-set size triggers acting or asking for help.">
      </a>
    </div>
    <figcaption>ENCP identifies when a navigation agent should ask for help before an error compounds. It calibrates complete episodes and triggers a query when the action set exceeds a chosen size budget.</figcaption>
  </figure>

  <section class="encp-section encp-abstract" aria-labelledby="encp-abstract-title">
    <h2 id="encp-abstract-title">Research summary</h2>
    <div class="encp-section-body">
      <p>A navigation agent makes a sequence of dependent decisions. Calibrating each action separately does not establish that a prediction set will contain the correct action throughout a complete route. ENCP addresses that gap by rescaling each action's nonconformity score, which measures how poorly an action agrees with the policy's prediction, using the policy's residual confidence. It then calibrates the maximum score over each episode.</p>
      <p>When calibration and evaluation episodes are exchangeable, ENCP's prediction sets cover the correct action at every step of a route with probability at least the chosen coverage level. The construction allows dependence between steps and variable route lengths. Across 4 navigation policies and 3 scores on R2R and REVERIE, it met the reported empirical step-coverage targets, including on seen-to-unseen evaluations. Those empirical results do not extend the formal guarantee to a new distribution of buildings. The prediction-set size can also indicate when the agent should request help; the paper evaluates that decision with an error-free simulated assistant.</p>
    </div>
  </section>

  <section class="encp-section encp-method" aria-labelledby="encp-method-title">
    <h2 id="encp-method-title">From uncertainty to intervention</h2>
    <div class="encp-section-body">
      <p>ENCP leaves the navigation policy fixed. Score normalization adjusts each action score to the current policy confidence; episode calibration then summarizes dependent steps with the maximum score for each episode. The parameter-free variant uses recorded policy probabilities, whereas the learning-based variant fits a weight before conformal calibration.</p>

      <figure class="encp-figure encp-pipeline">
        <div class="encp-figure-frame">
          <a class="encp-figure-link" href="/assets/img/encp-vln/fig-pipeline.png" target="_blank" aria-label="Open the ENCP pipeline figure at full resolution">
            <img src="/assets/img/encp-vln/fig-pipeline.png" width="2356" height="1261" loading="lazy" alt="Detailed ENCP pipeline showing offline calibration records, parameter-free and learning-based weights, shared episode-level calibration, and deployment with act-or-ask decisions.">
          </a>
        </div>
        <figcaption>ENCP calibrates the worst-step score for each episode, then asks for help when the deployed set exceeds τ.</figcaption>
      </figure>
    </div>
  </section>

  <aside class="encp-status" aria-label="Project status">
    <p><strong>Preprint available.</strong> The paper is on arXiv. Code has not yet been linked.</p>
  </aside>
</article>
