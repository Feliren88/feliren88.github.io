---
layout: page
title: Experience & Education
subtitle: Work History and Background
permalink: /work/
redirect_to: /
---

<p class="eyebrow">TRACK RECORD</p>
<p class="section-note">Five years across academic research, AI consulting, and production ML. My work appears in IEEE, ACL, and Remote Sensing of Environment, with deployed systems across Southeast Asia and APAC.</p>

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

    <p class="column-title" style="margin-top:1.2rem">SPEAKING</p>
    <ol id="talks-list" class="timeline short">
      {% for item in site.data.experience.talks %}
      <li>
        <p class="time">{{ item.dates }}</p>
        <h3>{% if item.url %}<a href="{{ item.url }}" target="_blank" rel="noreferrer">{{ item.title }}</a>{% else %}{{ item.title }}{% endif %}</h3>
        <p class="loc">{{ item.location }}</p>
        {% if item.description %}<p>{{ item.description }}</p>{% endif %}
      </li>
      {% endfor %}
    </ol>
  </div>
</div>
