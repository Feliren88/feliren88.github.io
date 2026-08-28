---
layout: page
title: How I Work
subtitle: Research and Engineering Practice
description: AI safety, conformal prediction, interpretability and activation steering, vision-language models, multilingual AI, earth observation, LLM evaluation, and production ML on GCP and AWS.
permalink: /expertise/
redirect_to: /
---

<p class="eyebrow">RESEARCH & ENGINEERING</p>

<div id="skills-grid" class="skill-grid">
  {% for group in site.data.skills %}
  <article class="skill-card reveal">
    <h3>{{ group.group }}</h3>
    <p>{{ group.items }}</p>
  </article>
  {% endfor %}
</div>
