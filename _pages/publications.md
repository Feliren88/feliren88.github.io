---
layout: page
title: Research & Publications
subtitle: IEEE Q1, ACL 2025, Remote Sensing of Environment
description: Peer-reviewed work on conformal prediction for vision-language models, cultural AI benchmarks for Southeast Asia, and geospatial deep learning for flood and mining detection.
permalink: /research/
---

<p class="eyebrow">RESEARCH ARCHIVE</p>
<h1 class="section-title">Research <a href="https://scholar.google.com/citations?user=R2LVQ7AAAAAJ&hl=en" target="_blank" rel="noreferrer" style="margin-left:0.75rem;font-size:0.82rem;color:var(--accent);text-decoration:none;font-weight:500;font-family:'Manrope',sans-serif">Google Scholar →</a></h1>
<p class="section-note">Peer-reviewed work on conformal prediction for vision-language models, cultural AI benchmarks for Southeast Asia, and geospatial deep learning for flood and mining detection. Published in IEEE, ACL, and Remote Sensing of Environment.</p>

<div id="publications-container" class="project-grid">
  {% assign sorted_pubs = site.data.publications | sort: 'venue' %}
  {% for key in site.data.publications %}
  {% assign pub = key[1] %}
  <article class="project-card reveal">
    <p class="tag">{{ pub.tag }}</p>
    <h3>{{ pub.title }}</h3>
    <p>{{ pub.description }}</p>
    <span class="venue">{{ pub.venue }}</span>
    {% if pub.url %}
    <a href="{{ pub.url }}" target="_blank" rel="noreferrer" class="paper-btn">Read Paper</a>
    {% endif %}
    {% if pub.abstract %}
    <button class="card-toggle" type="button" aria-expanded="false">Abstract</button>
    <div class="card-expand"><p>{{ pub.abstract }}</p></div>
    {% endif %}
  </article>
  {% endfor %}
</div>
