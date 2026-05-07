---
layout: page
title: About Vicky Feliren
subtitle: Multimodal AI Researcher & Applied Scientist
description: Bio, research focus, expertise, track record, and recognition. Applied Scientist on trustworthy multimodal AI and cultural inclusion — published in IEEE, ACL, and Remote Sensing of Environment.
permalink: /about/
preload_image: /assets/img/profile_2_bg.webp
---

<p class="eyebrow">WHO I AM</p>

<img src="/assets/img/profile_2_bg.webp" alt="" class="profile-bg" aria-hidden="true" draggable="false" fetchpriority="high">

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

<div id="how-i-work" class="about-section">
  <h3>How I Work</h3>
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
</div>

<div id="track-record" class="about-section">
  <h3>Track Record</h3>
  <p class="section-note">Five years spanning academic research, AI consulting, and production ML engineering — published in IEEE, ACL, and Remote Sensing of Environment, with systems deployed at scale across Southeast Asia and APAC.</p>
  <div class="split-grid">
    <div>
      <p class="column-title">WORK EXPERIENCE</p>
      <ol id="work-experience-list" class="timeline">
        {% for item in site.data.experience.work_experience %}
        <li>
          <p class="time">{{ item.dates }}</p>
          <h3>{{ item.title }}</h3>
          <p class="loc">{{ item.location }}</p>
          <p>{{ item.description }}</p>
        </li>
        {% endfor %}
      </ol>
    </div>
    <div>
      <p class="column-title">EDUCATION</p>
      <ol id="education-list" class="timeline short">
        {% for item in site.data.experience.education %}
        <li>
          <p class="time">{{ item.dates }}</p>
          <h3>{{ item.title }}</h3>
          <p class="loc">{{ item.location }}</p>
          <p>{{ item.description }}</p>
        </li>
        {% endfor %}
      </ol>
      <p class="column-title" style="margin-top:1.2rem">PATENT</p>
      <ol id="patents-list" class="timeline short">
        {% for item in site.data.experience.patents %}
        <li>
          <p class="time">{{ item.dates }}</p>
          <h3>{{ item.title }}</h3>
          <p class="loc">{{ item.location }}</p>
          <p>{{ item.description }}</p>
        </li>
        {% endfor %}
      </ol>
      <p class="column-title" style="margin-top:1.2rem">TEACHING</p>
      <ol id="teaching-list" class="timeline short">
        {% for item in site.data.experience.teaching %}
        <li>
          <p class="time">{{ item.dates }}</p>
          <h3>{{ item.title }}</h3>
          <p class="loc">{{ item.location }}</p>
          <p>{{ item.description }}</p>
        </li>
        {% endfor %}
      </ol>
    </div>
  </div>
</div>

<div id="recognition" class="about-section">
  <h3>Recognition</h3>
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
</div>

<style>
  .profile-bg { position: absolute; right: -80px; top: 80px; width: 720px; z-index: -1; user-select: none; -webkit-user-drag: none; border-radius: 0; }
  @media (max-width: 1200px) { .profile-bg { position: static; width: 100%; max-width: 500px; margin: 2rem auto; opacity: 1; } }
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
  .awards-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .award-card.featured { grid-column: 1 / -1; padding: 1.4rem 1.8rem; border-color: rgba(119, 146, 175, 0.52); }
  .award-card.featured h3 { font-size: 1.25rem; }
  .award-card.featured > p.desc { font-size: 0.92rem; max-width: 56rem; }
  .award-card.featured .tag { font-size: 0.72rem; }
  @media (max-width: 600px) { .awards-grid { grid-template-columns: 1fr; } .award-card.featured { grid-column: 1; } }
</style>
