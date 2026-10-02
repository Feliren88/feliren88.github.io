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
    <p class="ivh-lede">I use this notebook to prepare for PhD and research interviews. Each track helps me explain an idea, support it with evidence, and recognise its limits. To begin, choose a question below. Each track lists what you need to know first. Start with basic algebra and programming, then follow the related tracks as you need them.</p>
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
      <h2 id="ivh-contract-title">How to support your answer</h2>
      <p>Explain what you compared and what the evidence shows. For example, calibration measures whether a model's confidence matches how often it is correct. To claim that a method improves calibration, name the other method and the data used to test both. Then explain when that result might change.</p>
    </div>
    <ol>
      <li><strong>Explain</strong><span>State the idea and its assumptions in your own words.</span></li>
      <li><strong>Support</strong><span>Name the comparison and the evidence behind the claim.</span></li>
      <li><strong>Challenge</strong><span>Change one assumption and explain how your answer changes.</span></li>
      <li><strong>Recall</strong><span>Answer later without notes, then check the source.</span></li>
    </ol>
  </section>

  <nav class="ivh-start" aria-labelledby="ivh-start-title">
    <h2 id="ivh-start-title">Choose a question you cannot yet answer well</h2>
    <p>Choose a question you find difficult to explain. Then use the related tracks to study any ideas you need.</p>
    <div class="ivh-start-grid">
      <a href="/machine-learning-research/">
        <span class="ivh-start-question">What result would change your mind?</span>
        <strong>Design a study</strong>
        <span>Design an experiment whose result could support or challenge your explanation.</span>
        <span class="ivh-start-track">Start with Machine Learning Research</span>
      </a>
      <a href="/deep-learning/">
        <span class="ivh-start-question">How does the model produce an answer?</span>
        <strong>Explain a model</strong>
        <span>Explain how the model calculates an answer, how it learns, and where it can fail.</span>
        <span class="ivh-start-track">Start with Deep Learning</span>
      </a>
      <a href="/frequentist-statistics/">
        <span class="ivh-start-question">Does the result support the claim?</span>
        <strong>Evaluate a result</strong>
        <span>Check the result, how uncertain it is, and whether another explanation fits.</span>
        <span class="ivh-start-track">Start with Frequentist Statistics</span>
      </a>
      <a href="/uncertainty-estimation/">
        <span class="ivh-start-question">When should a model defer?</span>
        <strong>Judge uncertainty</strong>
        <span>Compare confidence with errors. Then decide when the model should ask for human review.</span>
        <span class="ivh-start-track">Start with Uncertainty Estimation</span>
      </a>
    </div>
  </nav>

  <section class="iv-foundation-route" aria-labelledby="iv-foundation-title">
    <h2 id="iv-foundation-title">Prepare to read equations and implementations</h2>
    <p>Use these worked examples to practise reading unfamiliar technical material. Each connects notation, a calculation, and its interpretation.</p>
    <ol>
      {% for bridge in site.data.interview_foundations.bridges %}
      {% assign module_number = bridge.module | plus: 1 %}
      {% assign bridge_track = site.data.interview.topics | where: 'id', bridge.track | first %}
      <li><a href="/{{ bridge.track }}/#foundation-{{ bridge.kind }}">{{ bridge.title }}</a> in {{ bridge_track.name }}, module {{ module_number }}.</li>
      {% endfor %}
    </ol>
    <p>Then choose an unfamiliar equation and explain every object's role. Justify each transformation, name its assumptions, and connect it to code.</p>
    <p>Finally, distinguish exact results from approximations and predict what changes when an assumption changes.</p>
  </section>

  <p class="ivh-maplede">Each card opens a track with modules, practice questions, and related topics. On wider screens, the lines show how tracks connect.</p>
  <p class="ivh-maplede">For interactive practice, explore the <a href="/math/#m6">probability distributions</a> or <a href="/calculus/#m5">area under a curve</a>.</p>

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
