---
layout: page
title: Research & Publications
description: Peer-reviewed work on conformal prediction for vision-language models, cultural AI benchmarks for Southeast Asia, and geospatial deep learning for flood and mining detection.
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
    }
  ]
}
</script>

<article class="modern-portfolio research-modern">
  <header class="mp-hero research-hero">
    <div>
      <p class="eyebrow">RESEARCH · TRUSTWORTHY AI</p>
      <h1>When a model becomes safer, does it still know what it knows?</h1>
      <p class="mp-lead">I study calibration under safety alignment: where confidence stops matching accuracy, who absorbs that cost, and how reliable deference can be recovered.</p>
      <div class="mp-actions"><a class="btn btn-primary" href="#featured-research">Selected research</a><a class="mp-text-link" href="#research-archive">Browse all publications →</a></div>
    </div>
    <aside class="research-thesis" aria-label="Research thesis">
      <span>Research thesis</span>
      <ol><li><b>Measure</b><p>Calibration shifts after alignment.</p></li><li><b>Disaggregate</b><p>Across languages and modalities.</p></li><li><b>Recover</b><p>Deference with a stated guarantee.</p></li></ol>
    </aside>
  </header>

  <section class="research-pillars" aria-label="Research areas">
    <article><span>01</span><h2>Calibration under alignment</h2><p>Measuring whether safety training makes confidence less reliable—and where the loss concentrates.</p></article>
    <article><span>02</span><h2>Multilingual and cultural evaluation</h2><p>Testing claims beyond English with data grounded in Southeast Asian languages and lived context.</p></article>
    <article><span>03</span><h2>Reliable multimodal systems</h2><p>Building uncertainty-aware systems across vision, language, navigation, and earth observation.</p></article>
  </section>

  <section class="mp-section" id="featured-research">
    <header class="mp-section-head"><div><p class="eyebrow">SELECTED WORK</p><h2>Research that defines the direction</h2></div><p>Two projects that connect representation, real-world variation, and measurable reliability.</p></header>
    <div class="research-feature-grid">
      {% assign featured_keys = 'flood-procanet,sea-vl' | split: ',' %}
      {% for featured_key in featured_keys %}{% assign pub = site.data.publications | where: 'key', featured_key | first %}
      <article class="research-feature" data-kind="{{ pub.kind }}">
        <div class="research-feature-top"><span class="mp-number">0{{ forloop.index }}</span><span class="venue">{{ pub.venue }}</span></div>
        <p class="tag">{{ pub.tag }}</p><h3>{{ pub.title }}</h3><p class="research-contribution">{{ pub.description }}</p>
        <dl><div><dt>Contribution</dt><dd>{% if pub.key == 'flood-procanet' %}Designed progressive cross-attention fusion and led the paper.{% else %}Built regional data infrastructure and benchmark quality controls.{% endif %}</dd></div><div><dt>Evidence</dt><dd>{% if pub.key == 'flood-procanet' %}0.815 IoU on Sen1Floods11.{% else %}1.28M images across 11 regional languages.{% endif %}</dd></div></dl>
        <div class="research-feature-actions"><a href="{{ pub.url }}" target="_blank" rel="noreferrer" class="paper-btn">Read paper ↗</a><details><summary>Abstract</summary><p>{{ pub.abstract }}</p></details></div>
      </article>{% endfor %}
    </div>
  </section>

  <section class="mp-section research-archive" id="research-archive">
    <header class="mp-section-head"><div><p class="eyebrow">COMPLETE RECORD</p><h2>Publication archive</h2></div><div class="research-identities"><a href="https://scholar.google.com/citations?user=R2LVQ7AAAAAJ&hl=en" target="_blank" rel="noreferrer">Google Scholar ↗</a><a href="https://orcid.org/0000-0003-3306-8426" target="_blank" rel="me noopener noreferrer">ORCID ↗</a></div></header>
    {% assign geo_count = site.data.publications | where: 'kind','geospatial' | size %}{% assign cultural_count = site.data.publications | where: 'kind','cultural' | size %}{% assign nlp_count = site.data.publications | where: 'kind','nlp' | size %}{% assign applied_count = site.data.publications | where: 'kind','applied' | size %}
    <div class="mp-filter-rail"><div class="filter-bar" role="group" aria-label="Filter publications by research area"><button class="filter-pill is-active" data-filter="all">All <span>{{ site.data.publications | size }}</span></button><button class="filter-pill" data-filter="geospatial">Earth <span>{{ geo_count }}</span></button><button class="filter-pill" data-filter="cultural">Cultural <span>{{ cultural_count }}</span></button><button class="filter-pill" data-filter="nlp">Language <span>{{ nlp_count }}</span></button><button class="filter-pill" data-filter="applied">Applied <span>{{ applied_count }}</span></button></div><p class="project-count" id="project-count" role="status" aria-live="polite"></p></div>
    <div id="publications-container">
      {% assign years = '2026,2025,2021' | split: ',' %}{% for archive_year in years %}<section class="research-year-group"><h3>{{ archive_year }}</h3><div class="research-rows">
        {% assign year_pubs = site.data.publications | where: 'year', archive_year %}{% for pub in year_pubs %}<article class="project-card research-row" data-kind="{{ pub.kind | default:'applied' }}"><div class="research-row-main"><div><span class="tag">{{ pub.tag }}</span><span class="venue">{{ pub.venue }}</span></div><h4>{{ pub.title }}</h4><p>{{ pub.description }}</p></div><div class="research-row-actions"><a href="{{ pub.url }}" target="_blank" rel="noreferrer" aria-label="Read paper: {{ pub.title }}">Paper ↗</a><details><summary>Details</summary><div>{% if pub.authors %}<p><strong>Authors</strong> {{ pub.authors | join:', ' }}</p>{% endif %}{% if pub.abstract %}<p><strong>Abstract</strong> {{ pub.abstract }}</p>{% endif %}{% if pub.doi %}<p><strong>DOI</strong> {{ pub.doi }}</p>{% endif %}</div></details></div></article>{% endfor %}
      </div></section>{% endfor %}
    </div>
  </section>
</article>

<script>document.addEventListener('DOMContentLoaded',function(){var groups=document.querySelectorAll('.research-year-group');document.querySelectorAll('.filter-pill').forEach(function(btn){btn.addEventListener('click',function(){requestAnimationFrame(function(){groups.forEach(function(group){var visible=Array.from(group.querySelectorAll('.project-card')).some(function(card){return !card.classList.contains('is-hidden')});group.hidden=!visible})})})})});</script>
