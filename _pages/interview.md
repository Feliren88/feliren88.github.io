---
layout: default
title: Interview
description: Private revision hub. Eighteen syllabi for interview preparation.
permalink: /interview/
robots: noindex, nofollow
sitemap: false
extra_css: /css/interview.css
extra_js: /js/components/interview.js
---

<section class="section page reveal interview-hub">

  <header class="ivh-header">
    <span class="ivh-eyebrow">Private</span>
    <h1 class="ivh-title">Interview</h1>
    <p class="ivh-lede">Eighteen tracks I revise from. Each one is a separate page with its own syllabus, a diagram for every module, the questions I should answer cold, and the drills that beat reading.</p>
    {% assign topics = site.data.interview.topics %}
    {% assign mod_n = 0 %}{% assign cov_n = 0 %}
    {% for t in topics %}{% assign mod_n = mod_n | plus: t.modules.size %}{% for m in t.modules %}{% assign cov_n = cov_n | plus: m.covers.size %}{% endfor %}{% endfor %}
    <ul class="ivh-stats">
      <li><strong>{{ topics | size }}</strong><span>tracks</span></li>
      <li><strong>{{ mod_n }}</strong><span>modules</span></li>
      <li><strong>{{ cov_n }}</strong><span>items</span></li>
    </ul>
  </header>

  <p class="ivh-maplede">The lines are handoffs. Where two tracks share a topic, one owns it and the other points here. Hover a card to see what it leans on.</p>

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
            <h3 class="ivh-card-title">{{ t.name }}</h3>
            <div class="iv-ring" role="img"></div>
          </div>
          <p class="ivh-card-blurb">{{ t.blurb }}</p>
          <ul class="ivh-card-mods">
            {% for m in t.modules %}<li>{{ m.name }}</li>{% endfor %}
          </ul>
          <span class="ivh-card-meta">{{ t.modules | size }} modules · {{ tc }} items</span>
        </a>
        {% endfor %}
      </div>
    </div>
    {% endfor %}
  </div>

</section>
