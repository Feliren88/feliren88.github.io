---
layout: page
title: Research and publications
description: Vicky Feliren's research direction is sequential decision making under uncertainty, building on work in conformal navigation, multilingual benchmarks, and Earth observation.
permalink: /research/
hide_title: true
extra_css:
  - /css/portfolio-modern.css
  - /css/research-landscape.css
extra_js: /js/components/research-landscape.js
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://vickyfeliren.com/research/",
      "name": "Research and publications, Vicky Feliren",
      "description": "Research direction in sequential decision making under uncertainty, with past work on conformal prediction for vision-language navigation, Southeast Asian benchmarks, flood mapping, and mining detection.",
      "url": "https://vickyfeliren.com/research/",
      "author": { "@id": "https://vickyfeliren.com/#person" },
      "hasPart": [
        {% for pub in site.data.publications %}
        {% if pub.doi %}
        "https://doi.org/{{ pub.doi }}"{% else %}"{{ pub.url }}"{% endif %}{% unless forloop.last %}, {% endunless %}
        {% endfor %}
      ]
    }
  ]
}
</script>

<article class="modern-portfolio research-modern">
  <header class="mp-hero research-hero">
    <div>
      <h1>When should an agent act, defer, or ask for help?</h1>
      <p class="mp-lead">My research direction is sequential decision making under uncertainty. Each choice an agent makes changes what it meets next. I want uncertainty estimates that stay reliable across that sequence and in deployed systems. My past work in navigation, multilingual evaluation, and applied machine learning supplies the starting points.</p>
      <div class="mp-actions"><a class="btn btn-primary" href="#research-direction">Research direction</a><a class="mp-text-link" href="#research-landscape">How past work connects →</a></div>
    </div>
    <aside class="research-thesis" aria-label="Research position">
      <strong>Research position</strong>
      <p>An uncertainty claim should name the decision it supports and the conditions it holds under. I want to find when such claims survive a change in policy, data, or costs.</p>
    </aside>
  </header>

  {%- assign rl = site.data.research_landscape %}
  {%- assign rl_from = rl.work | concat: rl.topics %}
  <section class="mp-section research-direction" id="research-direction">
    <header class="mp-section-head"><div><h2>Research direction</h2></div><p>An agent's choice to act, defer, or ask changes what it sees next. Confidence in one answer is then a weak guide to the whole task. These questions come from a survey I am writing on how uncertainty estimates support decisions.</p></header>
    <div class="rd-grid">
      {%- for d in rl.directions %}
      <article class="rd-card" id="{{ d.id }}">
        <h3>{{ d.title }}</h3>
        <p>{{ d.desc }}</p>
        <p class="rd-builds"><span>Builds on</span> {% for f_id in d.from %}{% assign f = rl_from | where: 'id', f_id | first %}{% assign f_name = f.label | replace: '<br>', ' ' %}{% if f.pub %}{% assign f_pub = site.data.publications | where: 'key', f.pub | first %}{% assign f_url = f_pub.project_page | default: f_pub.url %}{% else %}{% assign f_url = f.url %}{% endif %}{% if f_url %}<a href="{{ f_url }}"{% if f_url contains '://' %} target="_blank" rel="noreferrer"{% endif %}>{{ f_name }}</a>{% else %}{{ f_name }}{% endif %}{% unless forloop.last %}, {% endunless %}{% endfor %}</p>
      </article>
      {%- endfor %}
    </div>
  </section>

  <section class="mp-section research-landscape" id="research-landscape">
    <header class="mp-section-head"><div><h2>From past work to research direction</h2></div><p>Filled pills are papers and projects I have completed. The dashed centre holds the questions I want to pursue. Hover over a pill to preview it, and select it to open its page.</p></header>
    {% include research-landscape.html %}
  </section>

  <section class="mp-section" id="featured-research">
    <header class="mp-section-head"><div><h2>Selected past work</h2></div><p>ENCP studies coverage across whole navigation routes. SEA-VL builds a regional vision-language dataset.</p></header>
    <div class="research-feature-grid">
      {% assign featured_keys = 'encp-vln,sea-vl' | split: ',' %}
      {% for featured_key in featured_keys %}{% assign pub = site.data.publications | where: 'key', featured_key | first %}
      <article class="research-feature{% if pub.key == 'encp-vln' %} is-primary{% endif %}" data-kind="{{ pub.kind }}">
        <h3>{{ pub.title }}</h3><p class="research-feature-meta"><span>{{ pub.tag }}</span><span>{{ pub.venue }}</span></p><p class="research-contribution">{{ pub.description }}</p>
        <dl><div><dt>Contribution</dt><dd>{% if pub.key == 'encp-vln' %}Developed episode-normalized calibration and led the paper.{% else %}Built regional data infrastructure and benchmark quality controls.{% endif %}</dd></div><div><dt>Evidence</dt><dd>{% if pub.key == 'encp-vln' %}Met reported empirical step-coverage targets across 4 policies, 3 scores, and 2 benchmarks.{% else %}1.28M images across 11 regional languages.{% endif %}</dd></div></dl>
        <div class="research-feature-actions">{% if pub.project_page %}<a href="{{ pub.project_page }}" class="mp-text-link">Project page</a>{% endif %}<a href="{{ pub.url }}" target="_blank" rel="noreferrer" class="paper-btn">Read paper ↗</a><details><summary>Abstract</summary><p>{{ pub.abstract }}</p></details></div>
      </article>{% endfor %}
    </div>
  </section>

  <section class="mp-section research-archive" id="research-archive">
    <header class="mp-section-head"><div><h2>Publication archive</h2></div><div class="research-identities"><a href="https://scholar.google.com/citations?user=R2LVQ7AAAAAJ&hl=en" target="_blank" rel="noreferrer">Google Scholar ↗</a><a href="https://orcid.org/0000-0003-3306-8426" target="_blank" rel="me noopener noreferrer">ORCID ↗</a></div></header>
    {% assign geo_count = site.data.publications | where: 'kind','geospatial' | size %}{% assign cultural_count = site.data.publications | where: 'kind','cultural' | size %}{% assign nlp_count = site.data.publications | where: 'kind','nlp' | size %}{% assign applied_count = site.data.publications | where: 'kind','applied' | size %}
    <div class="mp-filter-rail"><div class="filter-bar" role="group" aria-label="Filter publications by research area"><button class="filter-pill is-active" data-filter="all">All <span>{{ site.data.publications | size }}</span></button><button class="filter-pill" data-filter="geospatial">Earth <span>{{ geo_count }}</span></button><button class="filter-pill" data-filter="cultural">Cultural <span>{{ cultural_count }}</span></button><button class="filter-pill" data-filter="nlp">Language <span>{{ nlp_count }}</span></button><button class="filter-pill" data-filter="applied">Applied <span>{{ applied_count }}</span></button></div><p class="project-count" id="project-count" role="status" aria-live="polite"></p></div>
    <div id="publications-container">
      {% assign years = '2026,2025,2021' | split: ',' %}{% for archive_year in years %}<section class="research-year-group"><h3>{{ archive_year }}</h3><div class="research-rows">
        {% assign year_pubs = site.data.publications | where: 'year', archive_year %}{% for pub in year_pubs %}<article class="project-card research-row" data-kind="{{ pub.kind | default:'applied' }}">{% assign tag_key = pub.tag | upcase %}{% assign venue_key = pub.venue | upcase %}<div class="research-row-main"><div><span class="tag">{{ pub.tag }}</span>{% unless tag_key contains venue_key %}<span class="venue">{{ pub.venue }}</span>{% endunless %}</div><h4>{{ pub.title }}</h4><p>{{ pub.description }}</p></div><div class="research-row-actions">{% if pub.project_page %}<a href="{{ pub.project_page }}" aria-label="Project page: {{ pub.title }}">Project page</a>{% endif %}<a href="{{ pub.url }}" target="_blank" rel="noreferrer" aria-label="Read paper: {{ pub.title }}">Paper ↗</a><details><summary>Details</summary><div>{% if pub.authors %}<p><strong>Authors</strong> {{ pub.authors | join:', ' }}</p>{% endif %}{% if pub.abstract %}<p><strong>Abstract</strong> {{ pub.abstract }}</p>{% endif %}{% if pub.doi %}<p><strong>DOI</strong> {{ pub.doi }}</p>{% endif %}</div></details></div></article>{% endfor %}
      </div></section>{% endfor %}
    </div>
  </section>
</article>

<script>document.addEventListener('DOMContentLoaded',function(){var groups=document.querySelectorAll('.research-year-group');document.querySelectorAll('.filter-pill').forEach(function(btn){btn.addEventListener('click',function(){requestAnimationFrame(function(){groups.forEach(function(group){var visible=Array.from(group.querySelectorAll('.project-card')).some(function(card){return !card.classList.contains('is-hidden')});group.hidden=!visible})})})})});</script>
