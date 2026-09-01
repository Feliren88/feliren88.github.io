---
layout: default
title: Interview
description: Twenty-six technical interview tracks with diagrams, plain explanations, equations, and recall questions.
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
    <h1 class="ivh-title">Interview</h1>
    <p class="ivh-lede">Choose a track. Each module explains one technical idea with a diagram, plain English, the required maths, and a question to answer without notes.</p>
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
      <h2 id="ivh-contract-title">Practise for an answer you can defend</h2>
      <p>{{ site.data.interview_learning.mission.outcome }}</p>
    </div>
    <ol>
      <li><strong>Learn</strong><span>Follow one module's grounded beats.</span></li>
      <li><strong>Retrieve</strong><span>Answer its question without notes.</span></li>
      <li><strong>Check</strong><span>Name the mechanism, evidence, and limit.</span></li>
      <li><strong>Return</strong><span>Schedule it, then mix in another track.</span></li>
    </ol>
  </section>

  <p class="ivh-maplede">Lines show related tracks. Hover over a card to see what to study next.</p>

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
