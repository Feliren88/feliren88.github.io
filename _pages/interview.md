---
layout: default
title: Research interview preparation
description: Prepare for PhD, research fellowship, and research scientist interviews with technical tracks, diagrams, and questions to answer without notes.
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
    <h1 class="ivh-title">Research interview preparation</h1>
    <p class="ivh-lede">Prepare for a PhD, research fellowship, or research scientist interview by practising claims you can defend. Choose a track, explain how an idea works, and name the evidence and limits of the claim. Then answer a question without notes. This guide assumes basic algebra and coding; each track lists any further foundations it needs.</p>
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
      <h2 id="ivh-contract-title">Practise an answer you can defend</h2>
      <p>Study an idea, then test your answer. For example, if you claim a model improves accuracy, compare it with a simpler model on data neither model trained on. Then name a case where the result may fail.</p>
    </div>
    <ol>
      <li><strong>Learn</strong><span>Read the explanation and inspect the diagram.</span></li>
      <li><strong>Recall</strong><span>Answer the module question without notes.</span></li>
      <li><strong>Challenge</strong><span>Change 1 assumption and explain whether the answer still holds.</span></li>
      <li><strong>Return</strong><span>Check the source and try again later.</span></li>
    </ol>
  </section>

  <nav class="ivh-start" aria-labelledby="ivh-start-title">
    <h2 id="ivh-start-title">Start with the answer you need to practise</h2>
    <p>Choose the question closest to your interview. Each starting track links to related topics. For research scientist roles at <a href="https://deepmind.google/careers/">Google DeepMind</a>, <a href="https://openai.com/careers/">OpenAI</a>, <a href="https://www.anthropic.com/careers">Anthropic</a>, or another lab, use the team's current role description to choose where to begin.</p>
    <div class="ivh-start-grid">
      <a href="/machine-learning-research/">
        <span class="ivh-start-question">How would you test a research claim?</span>
        <strong>Design a study</strong>
        <span>Choose a question and a comparison. Then identify a result that would challenge your claim.</span>
        <span class="ivh-start-track">Start with Machine Learning Research</span>
      </a>
      <a href="/deep-learning/">
        <span class="ivh-start-question">How does the model work?</span>
        <strong>Explain a model</strong>
        <span>Trace what it learns, how it is trained, and where it can fail.</span>
        <span class="ivh-start-track">Start with Deep Learning</span>
      </a>
      <a href="/frequentist-statistics/">
        <span class="ivh-start-question">Does the evidence support the result?</span>
        <strong>Evaluate a result</strong>
        <span>Check the comparison, the uncertainty, and other possible explanations.</span>
        <span class="ivh-start-track">Start with Frequentist Statistics</span>
      </a>
    </div>
  </nav>

  <p class="ivh-maplede">On wider screens, lines connect related tracks. Open a card to see its modules and links to other topics.</p>

  <div class="ivh-map" id="iv-map">
    <svg class="iv-map-svg" aria-hidden="true" preserveAspectRatio="none"></svg>

    {% assign groups = "foundations,models,systems,judgement" | split: "," %}
    {% for g in groups %}
    {% assign in_group = topics | where: "group", g %}
    <div class="ivh-group">
      <div class="ivh-group-head">
        <h2 class="ivh-group-title">{{ g }}</h2>
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
