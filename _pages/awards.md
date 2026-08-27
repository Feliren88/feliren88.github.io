---
layout: page
title: Awards & Recognition
subtitle: Microsoft Azure APAC Champion, Cambridge, UC Berkeley
description: Microsoft Azure Virtual Hackathon APAC Champion, University of Cambridge CamvsCovid Top 3, Cal Hacks UC Berkeley winner, Monash scholarship, and IEEE peer reviewer.
permalink: /recognition/
redirect_to: /
---

<p class="eyebrow">MILESTONES</p>

<div id="awards-grid" class="awards-grid">
  {% for key in site.data.awards %}
  {% assign award = key[1] %}
  {% if award.category %}
  <article class="award-card{% if award.featured %} featured{% endif %}{% if award.category == 'CHAMPION' %} highlight{% endif %}">
    <p class="tag">{{ award.category }}</p>
    <h3>
      {% if award.url %}
      <a href="{{ award.url }}" target="_blank" rel="noreferrer">{{ award.title }}</a>
      {% else %}
      {{ award.title }}
      {% endif %}
    </h3>
    <p class="time-inline">{{ award.year }}</p>
    <p class="desc">{{ award.description }}</p>
  </article>
  {% endif %}
  {% endfor %}
</div>

<div class="service-section">
  <p class="column-title" style="margin-top:2rem">PROFESSIONAL SERVICE</p>
  <div id="service-grid" class="service-grid">
    {% for item in site.data.awards.service %}
    <div class="service-item">
      <strong>{{ item.role }}</strong>
      <p>{{ item.description }}</p>
    </div>
    {% endfor %}
  </div>
</div>

<style>
  .awards-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .award-card.featured {
    grid-column: 1 / -1;
    padding: 1.4rem 1.8rem;
    border-color: rgba(119, 146, 175, 0.52);
  }
  .award-card.featured h3 {
    font-size: 1.25rem;
  }
  .award-card.featured > p.desc {
    font-size: 0.92rem;
    max-width: 56rem;
  }
  .award-card.featured .tag {
    font-size: 0.72rem;
  }
  @media (max-width: 600px) {
    .awards-grid {
      grid-template-columns: 1fr;
    }
    .award-card.featured {
      grid-column: 1;
    }
  }
</style>
