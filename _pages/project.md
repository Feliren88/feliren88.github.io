---
layout: page
title: Career Timeline
permalink: /project/
robots: noindex, nofollow
---

<div id="career-timeline" class="timeline-mount" role="region" aria-label="Career timeline visualization"></div>

<div class="timeline-fallback" id="track-record">
  <div class="split-grid">
    <div>
      <p class="column-title">WORK EXPERIENCE</p>
      <ol class="timeline">
        {% for item in site.data.experience.work_experience %}
        <li>
          <p class="time">{{ item.dates }}</p>
          <h3>{{ item.title }}</h3>
          <p class="loc">{{ item.location }}</p>
        </li>
        {% endfor %}
      </ol>
    </div>
    <div>
      <p class="column-title">EDUCATION</p>
      <ol class="timeline short">
        {% for item in site.data.experience.education %}
        <li>
          <p class="time">{{ item.dates }}</p>
          <h3>{{ item.title }}</h3>
          <p class="loc">{{ item.location }}</p>
        </li>
        {% endfor %}
      </ol>
    </div>
  </div>
</div>

<script type="application/json" id="timeline-data">{{ site.data.timeline | jsonify }}</script>
