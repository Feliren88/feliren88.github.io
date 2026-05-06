---
layout: page
title: About Vicky Feliren
subtitle: Multimodal AI Researcher & Applied Scientist. Philosopher.
description: Research on conformal prediction for vision-language models, AI for Southeast Asia, and production ML at scale. M.Sc. candidate at Monash University.
permalink: /about/
---

<p class="eyebrow">WHO I AM</p>

<div class="about-layout">
  <div class="about-main">
    <div id="about-hero" class="about-hero">
      {% for paragraph in site.data.about.hero %}
      <p>{{ paragraph }}</p>
      {% endfor %}
    </div>

    <div id="about-sections">
      {% for section in site.data.about.sections %}
      <div class="about-section">
        <h3>{{ section.title }}</h3>
        
        {% if section.content %}
        <p style="line-height:1.7;max-width:44rem">{{ section.content }}</p>
        {% endif %}
        
        {% if section.cards %}
        <div class="about-grid">
          {% for card in section.cards %}
          <div class="about-card">
            <h4>{{ card.title }}</h4>
            <p>{{ card.description }}</p>
          </div>
          {% endfor %}
        </div>
        {% endif %}
        
        {% if section.engage %}
        <div class="about-grid">
          {% for item in section.engage %}
          <div class="about-card">
            <h4>{{ item.type }}</h4>
            <p>{{ item.description }}</p>
          </div>
          {% endfor %}
        </div>
        {% endif %}
      </div>
      {% endfor %}
    </div>
  </div>

  <div class="about-sidebar">
    <img src="/assets/img/profile_2.svg" alt="Vicky Feliren" class="profile-image" draggable="false">
  </div>
</div>

<style>
  .about-layout { display: grid; grid-template-columns: 1fr 450px; gap: 3rem; align-items: start; }
  .profile-image { width: 100%; height: auto; border-radius: 12px; user-select: none; -webkit-user-drag: none; }
  @media (max-width: 900px) { .about-layout { grid-template-columns: 1fr; } .profile-image { max-width: 350px; } }
  .about-hero { font-size: 1.25rem; line-height: 1.7; max-width: 44rem; }
  .about-hero p { margin-bottom: 1.2rem; }
  .about-hero strong { color: var(--accent); }
  .about-hero a { color: var(--text); text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: 3px; }
  .about-hero a:hover { color: var(--accent); }
  .about-section { margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--line); }
  .about-section h3 { font-size: 1.1rem; color: var(--accent); margin-bottom: 0.8rem; }
  .about-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
  .about-card { padding: 1.2rem; border: 1px solid var(--line); border-radius: 8px; }
  .about-card h4 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 0.5rem; }
  .about-card p { font-size: 0.95rem; line-height: 1.5; }
</style>
