---
layout: page
title: Curriculum Vitae — Vicky Feliren
subtitle: Applied Scientist · AI Safety · Multimodal AI
description: "Curriculum vitae of Vicky Feliren: research, industry experience, education, teaching, speaking, patents, and recognition."
permalink: /cv/
extra_css: /css/about.css
hide_title: true
---

<article class="cv-page">
  <header class="cv-hero">
    <div><h1>Research in uncertainty.<br>Experience in consequence.</h1><p>A complete record of research, production ML, teaching, speaking, education, and service.</p></div>
    <aside><span>Vicky Feliren</span><a href="mailto:vickyfeliren@gmail.com">vickyfeliren@gmail.com</a><span>Jakarta, Indonesia</span><a href="/">Read the personal narrative →</a></aside>
  </header>

  <nav class="cv-nav" aria-label="CV sections"><a href="#skills">Skills</a><a href="#experience">Experience</a><a href="#education">Education</a><a href="#research-service">Research & service</a><a href="#recognition">Recognition</a></nav>

  <section class="cv-section" id="skills"><header><span>01</span><h2>Skills</h2></header><div>
    <div class="filter-bar" role="group" aria-label="Filter skills by group">
      <button type="button" class="filter-pill is-active" data-filter="all">All</button>
      {% for group in site.data.skills %}<button type="button" class="filter-pill" data-filter="{{ group.id }}">{{ group.group }}</button>{% endfor %}
    </div>
    <dl class="cv-skills">
      {% for group in site.data.skills %}<div class="cv-skill-group" data-kind="{{ group.id }}"><dt>{{ group.group }}</dt><dd>{{ group.items }}</dd></div>{% endfor %}
    </dl>
  </div></section>

  <section class="cv-section" id="experience"><header><span>02</span><h2>Experience</h2></header><div class="cv-list">
    {% for item in site.data.experience.work_experience %}<article><time>{{ item.dates }}</time><div><h3>{{ item.title }}</h3><p class="cv-location">{{ item.location }}</p>{% if item.description %}<p>{{ item.description }}</p>{% endif %}</div></article>{% endfor %}
  </div></section>

  <section class="cv-section" id="education"><header><span>03</span><h2>Education</h2></header><div class="cv-list cv-list--compact">
    {% for item in site.data.experience.education %}<article><time>{{ item.dates }}</time><div><h3>{{ item.title }}</h3><p class="cv-location">{{ item.location }}</p>{% if item.description %}<p>{{ item.description }}</p>{% endif %}</div></article>{% endfor %}
  </div></section>

  <section class="cv-section" id="research-service"><header><span>04</span><h2>Research, teaching & service</h2></header><div class="cv-columns">
    <div><p class="column-title">PATENT</p>{% for item in site.data.experience.patents %}<article class="cv-mini"><time>{{ item.dates }}</time><h3>{{ item.title }}</h3><p>{{ item.location }}</p>{% if item.description %}<p>{{ item.description }}</p>{% endif %}</article>{% endfor %}</div>
    <div><p class="column-title">TEACHING</p>{% for item in site.data.experience.teaching %}<article class="cv-mini"><time>{{ item.dates }}</time><h3>{{ item.title }}</h3><p>{{ item.location }}</p>{% if item.description %}<p>{{ item.description }}</p>{% endif %}</article>{% endfor %}</div>
    <div><p class="column-title">SPEAKING</p>{% for item in site.data.experience.talks %}<article class="cv-mini"><time>{{ item.dates }}</time><h3>{% if item.url %}<a href="{{ item.url }}" target="_blank" rel="noreferrer">{{ item.title }}</a>{% else %}{{ item.title }}{% endif %}</h3><p>{{ item.location }}</p></article>{% endfor %}</div>
  </div></section>

  <section class="cv-section" id="recognition"><header><span>05</span><h2>Recognition</h2></header><div class="cv-recognition-body"><div class="cv-awards">
    {% for key in site.data.awards %}{% assign award = key[1] %}{% if award.category %}<article><span>{{ award.year }}</span><div><h3>{% if award.url %}<a href="{{ award.url }}" target="_blank" rel="noreferrer">{{ award.title }}</a>{% else %}{{ award.title }}{% endif %}</h3><small>{{ award.category }}</small></div></article>{% endif %}{% endfor %}
  </div><div class="cv-service"><p class="column-title">PROFESSIONAL SERVICE</p>{% for item in site.data.awards.service %}<article><h3>{{ item.role }}</h3><p>{{ item.description }}</p></article>{% endfor %}</div></div></section>

  <footer class="cv-footer"><p>Looking for the ideas behind the record?</p><a class="btn btn-primary" href="/">Return to About</a><a class="btn btn-secondary" href="/contact/">Contact me</a></footer>
</article>

<script>
/*
  The group label doubles as the filter. main.js already listens for .filter-pill
  clicks, but it only ever toggles .project-card elements and this page has none,
  so the visibility half is done here. Both set is-active, which agree.
*/
(function () {
  var pills = Array.prototype.slice.call(document.querySelectorAll('#skills .filter-pill'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('#skills .cv-skill-group'));
  if (!pills.length || !groups.length) return;
  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var want = pill.getAttribute('data-filter') || 'all';
      pills.forEach(function (p) { p.classList.toggle('is-active', p === pill); });
      groups.forEach(function (g) {
        g.classList.toggle('is-hidden', want !== 'all' && g.getAttribute('data-kind') !== want);
      });
    });
  });
}());
</script>
