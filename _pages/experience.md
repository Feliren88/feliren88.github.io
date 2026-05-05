---
layout: page
title: Experience & Education
subtitle: Work History and Background
description: Research Associate at Monash University, Senior Data Scientist at Artefact, ML Engineer at GDP Labs. IEEE Q1 first author, ACL 2025 contributor.
permalink: /work/
---

<p class="eyebrow">TRACK RECORD</p>
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