---
layout: default
title: Research interview notebook
description: A study notebook for research interviews, with technical tracks, visual explanations, and questions to answer without notes.
permalink: /interview/
robots: noindex, nofollow
sitemap: false
extra_css: /css/interview.css
extra_js:
  - /js/components/interview.js
  - /js/components/interview-anim.js
---

<section class="section page reveal interview-hub">

  {% include interview-icons.html %}

  <header class="ivh-header">
    <h1 class="ivh-title">Research interview notebook</h1>
    <p class="ivh-lede">I use this notebook to prepare for PhD and research interviews. Its tracks ask me to defend a claim, examine the evidence, and identify where an assumption may fail. Begin with a question below; each track names the foundations it needs. Basic algebra and coding are enough to enter.</p>
    {% assign topics = site.data.interview.topics %}
    {% assign mod_n = 0 %}{% assign cov_n = 0 %}
    {% for t in topics %}{% assign mod_n = mod_n | plus: t.modules.size %}{% for m in t.modules %}{% assign cov_n = cov_n | plus: m.covers.size %}{% endfor %}{% endfor %}
    <ul class="ivh-stats">
      <li><strong>{{ topics | size }}</strong><span>tracks</span></li>
      <li><strong>{{ mod_n }}</strong><span>modules</span></li>
      <li><strong>{{ cov_n }}</strong><span>terms</span></li>
    </ul>
  </header>

  <section class="ivh-contract" aria-labelledby="ivh-contract-title">
    <div>
      <h2 id="ivh-contract-title">What makes an answer defensible</h2>
      <p>A claim about a model needs a comparison and a boundary. Calibration asks whether a model's stated confidence matches how often it is right. If I say a method improves calibration, I need to name the comparison model, the data used to test both models, and a setting where the result may not carry over.</p>
    </div>
    <ol>
      <li><strong>Explain</strong><span>State the idea and its assumptions in your own words.</span></li>
      <li><strong>Support</strong><span>Name the comparison and the evidence behind the claim.</span></li>
      <li><strong>Challenge</strong><span>Change one assumption and see what survives.</span></li>
      <li><strong>Recall</strong><span>Answer later without notes, then check the source.</span></li>
    </ol>
  </section>

  <nav class="ivh-start" aria-labelledby="ivh-start-title">
    <h2 id="ivh-start-title">Choose a question you cannot yet answer well</h2>
    <p>The starting tracks lead into the larger map. Begin where your explanation is weakest, then move to a related track when you find a gap.</p>
    <div class="ivh-start-grid">
      <a href="/machine-learning-research/">
        <span class="ivh-start-question">What result would change your mind?</span>
        <strong>Design a study</strong>
        <span>Turn a research question into a comparison that could challenge your explanation.</span>
        <span class="ivh-start-track">Start with Machine Learning Research</span>
      </a>
      <a href="/deep-learning/">
        <span class="ivh-start-question">How does the model produce an answer?</span>
        <strong>Explain a model</strong>
        <span>Trace the computation, the training signal, and a failure the architecture makes possible.</span>
        <span class="ivh-start-track">Start with Deep Learning</span>
      </a>
      <a href="/frequentist-statistics/">
        <span class="ivh-start-question">Does the result support the claim?</span>
        <strong>Evaluate a result</strong>
        <span>Examine the estimate, its uncertainty, and what else could explain it.</span>
        <span class="ivh-start-track">Start with Frequentist Statistics</span>
      </a>
      <a href="/uncertainty-estimation/">
        <span class="ivh-start-question">When should a model defer?</span>
        <strong>Judge uncertainty</strong>
        <span>Ask whether confidence tracks errors and when the model should stop or seek review.</span>
        <span class="ivh-start-track">Start with Uncertainty Estimation</span>
      </a>
    </div>
  </nav>

  <p class="ivh-maplede">Each card opens a track with modules, practice questions, and related topics. On wider screens, the lines show how tracks connect.</p>

  <div class="ivh-map" id="iv-map">
    <svg class="iv-map-svg" aria-hidden="true" preserveAspectRatio="none"></svg>

    {% assign groups = "foundations,models,systems,judgement" | split: "," %}
    {% for g in groups %}
    {% assign in_group = topics | where: "group", g %}
    <div class="ivh-group">
      <div class="ivh-group-head">
        <h2 class="ivh-group-title">{{ g | capitalize }}</h2>
        <span class="ivh-group-count">{{ in_group | size }} tracks</span>
      </div>
      <div class="ivh-grid">
        {% for t in in_group %}
        {% assign tc = 0 %}{% for m in t.modules %}{% assign tc = tc | plus: m.covers.size %}{% endfor %}
        <a class="ivh-card" href="/{{ t.id }}/"
           data-topic="{{ t.id }}"
           data-modules="{{ t.modules | size }}"
           data-links="{{ t.links | join: ' ' }}">
          <div class="ivh-card-top">
            <svg class="ivi ivh-card-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#ivi-{{ t.id }}"/></svg>
            <h3 class="ivh-card-title">{{ t.name }}</h3>
            <div class="iv-ring" role="img"></div>
          </div>
          <p class="ivh-card-blurb">{{ t.blurb }}</p>
          <ul class="ivh-card-mods">
            {% for m in t.modules %}<li>{{ m.name }}</li>{% endfor %}
          </ul>
          <span class="ivh-card-meta">{{ t.modules | size }} modules · {{ tc }} terms</span>
        </a>
        {% endfor %}
      </div>
    </div>
    {% endfor %}
  </div>

</section>
