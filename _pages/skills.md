---
layout: page
title: How I Work
subtitle: Research and Engineering Practice
description: Methods behind Vicky Feliren's research direction in sequential decision making under uncertainty, including conformal prediction, calibration, model evaluation, and production ML.
permalink: /expertise/
redirect_to: /
---


<div id="skills-grid" class="skill-grid">
  {% for group in site.data.skills %}
  <article class="skill-card reveal">
    <h3>{{ group.group }}</h3>
    <p>{{ group.items }}</p>
  </article>
  {% endfor %}
</div>
