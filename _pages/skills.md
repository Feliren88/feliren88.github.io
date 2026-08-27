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
  {% for skill in site.data.skills %}
  <article class="skill-card reveal">
    <h3>{{ skill.category }}</h3>
    <p>{{ skill.description }}</p>
    <ul>
      {% for s in skill.skills %}
      <li>{{ s }}</li>
      {% endfor %}
    </ul>
  </article>
  {% endfor %}
</div>
