---
layout: page
title: Use Cases
subtitle: Applied Machine Learning Across Research, Industry, and the Field
description: A practitioner's view of ML use cases across geospatial AI, cultural NLP, production fintech, and applied projects, from satellite imagery to hackathon prototypes.
permalink: /usecases/
---

<div class="note-block" role="note">
  <span class="note-badge">Work in Progress</span>
  <p>{{ site.data.usecases.wip_notice }}</p>
</div>

<div class="filter-bar" role="group" aria-label="Filter use cases by category">
  <button class="filter-pill is-active" data-filter="all">All</button>
  {% for cat in site.data.usecases.categories %}
  <button class="filter-pill" data-filter="{{ cat.id }}">{{ cat.label }}</button>
  {% endfor %}
</div>

<div class="uc-grid" id="uc-grid">
  {% for uc in site.data.usecases.usecases %}
  {% assign ext_link = uc.link | default: uc.arxiv %}
  {% unless ext_link %}{% if uc.doi %}{% assign ext_link = "https://doi.org/" | append: uc.doi %}{% endif %}{% endunless %}
  <article class="uc-card" data-category="{{ uc.category }}" data-index="{{ forloop.index }}">

    <div class="uc-card-header">
      <div class="uc-tags">
        {% for tag in uc.tags %}<span class="uc-tag">{{ tag }}</span>{% endfor %}
      </div>
      {% if ext_link %}<a class="uc-ext-link" href="{{ ext_link }}" target="_blank" rel="noreferrer" aria-label="View source for {{ uc.title }}">↗</a>{% endif %}
    </div>

    <h3 class="uc-title"><a href="/usecases/{{ uc.id }}/" class="uc-title-link">{{ uc.title }}</a></h3>
    <p class="uc-meta"><span class="uc-venue-name">{{ uc.venue }}</span>{% if uc.role %}<span class="uc-role"> · {{ uc.role }}</span>{% endif %}</p>

    {% if uc.hook %}<p class="uc-situation">{{ uc.hook }}</p>{% endif %}

    {% if uc.tech_stack %}
    {% assign tech_total = 0 %}
    {% for pair in uc.tech_stack %}{% unless pair[0] == 'hyperparams' %}{% assign pair_size = pair[1] | size %}{% assign tech_total = tech_total | plus: pair_size %}{% endunless %}{% endfor %}
    {% assign tech_shown = 0 %}
    <div class="uc-tech-strip">
      {% for pair in uc.tech_stack %}{% unless pair[0] == 'hyperparams' %}{% for item in pair[1] %}{% if tech_shown < 5 %}<span class="uc-tech-tag">{{ item }}</span>{% assign tech_shown = tech_shown | plus: 1 %}{% endif %}{% endfor %}{% endunless %}{% endfor %}
      {% if tech_total > 5 %}<span class="uc-tech-tag uc-tech-tag--more" title="{{ tech_total }} technologies total">+{{ tech_total | minus: 5 }}</span>{% endif %}
    </div>
    {% endif %}

    <a href="/usecases/{{ uc.id }}/" class="uc-card-cta">Read writeup →</a>

  </article>
  {% endfor %}
</div>


<script>
(function() {
  var PRIORITY = { ongoing: 1, cultural: 2, geospatial: 3, production: 4, applied: 5 };
  var btns = document.querySelectorAll('.filter-pill');
  var grid = document.getElementById('uc-grid');
  var cards = document.querySelectorAll('.uc-card');

  function applyFilter(filter) {
    var arr = Array.from(cards);
    arr.sort(function(a, b) {
      if (filter === 'all') {
        var pa = PRIORITY[a.getAttribute('data-category')] || 99;
        var pb = PRIORITY[b.getAttribute('data-category')] || 99;
        if (pa !== pb) return pa - pb;
      }
      return parseInt(a.getAttribute('data-index')) - parseInt(b.getAttribute('data-index'));
    });
    arr.forEach(function(card) { grid.appendChild(card); });
    cards.forEach(function(card) {
      card.hidden = filter !== 'all' && card.getAttribute('data-category') !== filter;
    });
  }

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      btns.forEach(function(b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  applyFilter('all');
})();
</script>
