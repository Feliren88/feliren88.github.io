---
layout: page
title: Research and publications
description: Vicky Feliren's research includes a preprint on conformal prediction for vision-language navigation and peer-reviewed work on Southeast Asian benchmarks, flood mapping, and mining detection.
permalink: /research/
hide_title: true
extra_css: /css/portfolio-modern.css
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://vickyfeliren.com/research/",
      "name": "Research and publications, Vicky Feliren",
      "description": "A preprint on conformal prediction for vision-language navigation and peer-reviewed work on Southeast Asian benchmarks, flood mapping, and mining detection.",
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
      <h1>Can a safer model still recognise when it may be wrong?</h1>
      <p class="mp-lead">I study whether safety training changes calibration, the match between a model’s confidence and its accuracy. The deeper question is whether that change is shared across users and tasks, or concentrated where existing evaluations see least.</p>
      <div class="mp-actions"><a class="btn btn-primary" href="#featured-research">Selected research</a><a class="mp-text-link" href="#research-archive">Browse all publications →</a></div>
    </div>
    <aside class="research-thesis" aria-label="Research position">
      <strong>Research position</strong>
      <p>A model’s safety depends partly on whether its uncertainty gives people a sound reason to trust an answer or request review. That property should hold beyond the languages and inputs used most often to evaluate it.</p>
    </aside>
  </header>

  <section class="research-pillars" aria-label="Research agenda">
    <article><h2>Safety and uncertainty</h2><p><a href="https://proceedings.iclr.cc/paper_files/paper/2025/hash/29fb6e1456b3d8b57ede5c45aa2c6537-Abstract-Conference.html" target="_blank" rel="noreferrer">Published evidence</a> links safety-related training to expressed overconfidence. The open question is how that change affects decisions to answer or defer.</p></article>
    <article><h2>Whose uncertainty?</h2><p>SEA-VL and CommonLID expose gaps in standard language and vision evaluation. I suspect calibration costs may also vary across the inputs these benchmarks bring into view.</p></article>
    <article><h2>Reliability across decisions</h2><p>My navigation preprint studies coverage across an entire route under stated assumptions. It motivates a broader question about when uncertainty estimates remain useful as a system keeps acting.</p></article>
  </section>

  <section class="mp-section" id="featured-research">
    <header class="mp-section-head"><div><h2>Selected research</h2></div><p>ENCP studies coverage across whole navigation routes. SEA-VL builds a regional vision-language dataset.</p></header>
    <div class="research-feature-grid">
      {% assign featured_keys = 'encp-vln,sea-vl' | split: ',' %}
      {% for featured_key in featured_keys %}{% assign pub = site.data.publications | where: 'key', featured_key | first %}
      <article class="research-feature{% if pub.key == 'encp-vln' %} is-primary{% endif %}" data-kind="{{ pub.kind }}">
        <h3>{{ pub.title }}</h3><p class="research-feature-meta"><span>{{ pub.tag }}</span><span>{{ pub.venue }}</span></p><p class="research-contribution">{{ pub.description }}</p>
        <dl><div><dt>Contribution</dt><dd>{% if pub.key == 'encp-vln' %}Developed episode-normalized calibration and led the paper.{% else %}Built regional data infrastructure and benchmark quality controls.{% endif %}</dd></div><div><dt>Evidence</dt><dd>{% if pub.key == 'encp-vln' %}Met every reported coverage target across four policies, three scores, and two benchmarks.{% else %}1.28M images across 11 regional languages.{% endif %}</dd></div></dl>
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
