---
layout: page
title: Research & Publications
description: Peer-reviewed work on conformal prediction for vision-language models, cultural AI benchmarks for Southeast Asia, and geospatial deep learning for flood and mining detection.
permalink: /research/
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://vickyfeliren.com/research/",
      "name": "Research & Publications, Vicky Feliren",
      "description": "Peer-reviewed work on conformal prediction for vision-language models, cultural AI benchmarks for Southeast Asia, and geospatial deep learning for flood and mining detection. Published in IEEE, ACL, and Remote Sensing of Environment.",
      "url": "https://vickyfeliren.com/research/",
      "author": { "@id": "https://vickyfeliren.com/#person" },
      "hasPart": [
        {% for pub in site.data.publications %}
        {% if pub.doi %}
        "https://doi.org/{{ pub.doi }}"{% else %}"{{ pub.url }}"{% endif %}{% unless forloop.last %}, {% endunless %}
        {% endfor %}
      ]
    },

    {% comment %} ScholarlyArticle nodes: each is a distinct node with its own @id (DOI preferred) and references the Person by @id for the author relationship. {% endcomment %}
    {% for pub in site.data.publications %}
    {
      "@type": "ScholarlyArticle"{% if pub.doi %},
      "@id": "https://doi.org/{{ pub.doi }}"{% endif %},
      "headline": {{ pub.title | jsonify }},{% if pub.url %}
      "url": {{ pub.url | jsonify }},{% endif %}
      {% if pub.abstract %}"description": {{ pub.abstract | jsonify }},{% endif %}
      "datePublished": "{{ pub.date | default: pub.year }}", 
      {% if pub.publisher %}"publisher": { "@type": "Organization", "name": {{ pub.publisher | jsonify }} },{% endif %}
      {% if pub.keywords %}"keywords": {{ pub.keywords | jsonify }},{% endif %}
      "author": { "@id": "https://vickyfeliren.com/#person" }{% unless forloop.last %}, {% endunless %}
    }
    {% endfor %}
  ]
}
</script>

<p class="eyebrow">
  <a class="eyebrow-link" href="https://scholar.google.com/citations?user=R2LVQ7AAAAAJ&hl=en" target="_blank" rel="noreferrer">
    <img src="/assets/img/google-scholar-svgrepo-com.webp" alt="Google Scholar" width="18" height="18" loading="lazy">
    RESEARCH ARCHIVE
  </a>
  <span class="eyebrow-sep">·</span>
  <a id="cy-effective-orcid-url" class="eyebrow-link eyebrow-link--orcid" href="https://orcid.org/0000-0003-3306-8426" target="orcid.widget" rel="me noopener noreferrer">
    <img src="https://orcid.org/sites/default/files/images/orcid_16x16.png" alt="ORCID iD icon" width="16" height="16" loading="lazy">ORCID
  </a>
</p>
<p class="section-note">Peer-reviewed work on conformal prediction for vision-language models, cultural AI benchmarks for Southeast Asia, and geospatial deep learning for flood and mining detection. Published in IEEE, ACL, and Remote Sensing of Environment.</p>

<div class="filter-bar" role="group" aria-label="Filter publications by research area">
  <button class="filter-pill is-active" data-filter="all">All</button>
  <button class="filter-pill" data-filter="geospatial">Earth Observation</button>
  <button class="filter-pill" data-filter="cultural">Cultural AI</button>
  <button class="filter-pill" data-filter="nlp">Language</button>
  <button class="filter-pill" data-filter="applied">Applied</button>
</div>
<p class="project-count" id="project-count" role="status" aria-live="polite" aria-atomic="true"></p>

<div id="publications-container" class="project-grid">
  {% for pub in site.data.publications %}
  <article class="project-card reveal" data-kind="{{ pub.kind | default: 'applied' }}">
    <p class="tag">{{ pub.tag }}</p>
    <h3>{{ pub.title }}</h3>
    <p>{{ pub.description }}</p>
    <span class="venue">{{ pub.venue }}</span>
    {% if pub.authors %}
    {% assign _preview = pub.authors | slice: 0, 4 | join: ", " %}
    {% assign _total = pub.authors | size %}
    {% assign _remaining = _total | minus: 4 %}
    <details class="card-authors">
      <summary>{{ _preview }}{% if _remaining > 0 %} and {{ _remaining }} more{% endif %}</summary>
      <p class="authors-full">{{ pub.authors | join: ", " }}</p>
    </details>
    {% endif %}
    {% if pub.url %}
    <a href="{{ pub.url }}" target="_blank" rel="noreferrer" class="paper-btn" aria-label="Read paper: {{ pub.title }}">Read Paper</a>
    {% endif %}
    {% if pub.abstract %}
    <button class="card-toggle card-toggle--text" type="button" aria-expanded="false">Abstract ↓</button>
    <div class="card-expand"><p>{{ pub.abstract }}</p></div>
    {% endif %}
  </article>
  {% endfor %}
</div>
