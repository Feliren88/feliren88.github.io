---
layout: page
title: Research & Publications
subtitle: IEEE Q1, ACL 2025, Remote Sensing of Environment
description: Peer-reviewed work on conformal prediction for vision-language models, cultural AI benchmarks for Southeast Asia, and geospatial deep learning for flood and mining detection.
permalink: /research/
---

<p class="eyebrow">
  <a href="https://scholar.google.com/citations?user=R2LVQ7AAAAAJ&hl=en" target="_blank" rel="noreferrer" style="text-decoration:none;color:inherit">
    <img src="/assets/img/google-scholar-svgrepo-com.webp" alt="Google Scholar" style="width:18px;height:18px;vertical-align:middle;margin-right:0.4rem" loading="lazy">
    RESEARCH ARCHIVE
  </a>
</p>
<p class="section-note">Peer-reviewed work on conformal prediction for vision-language models, cultural AI benchmarks for Southeast Asia, and geospatial deep learning for flood and mining detection. Published in IEEE, ACL, and Remote Sensing of Environment.</p>

<p class="project-count" id="project-count" role="status" aria-live="polite" aria-atomic="true"></p>

<div id="publications-container" class="project-grid">
  {% for pub in site.data.publications %}
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