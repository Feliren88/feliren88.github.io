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

<article class="modern-portfolio research-modern research-current">
  <header class="mp-hero research-hero">
    <div>
      <h1>Research and selected work</h1>
      <p class="mp-lead">My work spans navigation, Southeast Asian datasets, and satellite image analysis. Across these settings, I examine how models support decisions and where their assumptions fail. The projects below show my contributions and the questions I want to pursue next.</p>
      <div class="mp-actions"><a class="btn btn-primary" href="#featured-research">Selected work</a><a class="mp-text-link" href="#research-landscape">Past work and research direction →</a></div>
    </div>
  </header>

  {%- assign rl = site.data.research_landscape %}
  <section class="mp-section research-landscape" id="research-landscape">
    <header class="mp-section-head"><div><h2>Past work and research direction</h2></div><p>Filled shapes link to past papers and projects. Dashed shapes show open questions and link to their starting points. Hover over a shape or focus it to read more.</p></header>
    {% include research-landscape.html %}
  </section>

  <section class="mp-section" id="featured-research">
    <header class="mp-section-head"><div><h2>Selected work</h2></div><p>In navigation, I developed a method for choosing which actions an agent should consider. Alongside this work, I contributed regional data systems and designed a model for flood mapping.</p></header>
    <div class="research-feature-grid">
      {% for profile in rl.profiles %}
      {% assign pub = site.data.publications | where: 'key', profile.key | first %}
      <article class="research-feature" id="work-{{ profile.key }}" aria-labelledby="title-{{ profile.key }}">
        <div>
          <p class="research-feature-name">{{ profile.name }}</p>
          <h3 id="title-{{ profile.key }}">{{ profile.title }}</h3>
          <p class="research-feature-meta"><span>{{ pub.tag }}</span><span>{{ pub.venue }}</span></p>
          <p class="research-contribution">{{ profile.problem }}</p>
        </div>
        <div>
          <dl>
            <div><dt>My contribution</dt><dd>{{ profile.contribution }}</dd></div>
            <div><dt>Evidence</dt><dd>{{ profile.finding }}</dd></div>
            <div><dt>Scope</dt><dd>{{ profile.limit }}</dd></div>
          </dl>
          <div class="research-feature-actions">
            {% assign project_page = pub.project_page | default: profile.case_page %}
            {% if project_page %}<a href="{{ project_page }}" class="mp-text-link">Project page</a>{% endif %}
            <a href="{{ pub.url }}" target="_blank" rel="noreferrer" class="paper-btn">Read paper ↗</a>
          </div>
        </div>
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
