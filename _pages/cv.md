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
    <div><p class="eyebrow">CURRICULUM VITAE</p><h1>Research in uncertainty.<br>Experience in consequence.</h1><p>A complete record of research, production ML, teaching, speaking, education, and service.</p></div>
    <aside><span>Vicky Feliren</span><a href="mailto:vickyfeliren@gmail.com">vickyfeliren@gmail.com</a><span>Jakarta, Indonesia</span><a href="/about/">Read the personal narrative →</a></aside>
  </header>

  <nav class="cv-nav" aria-label="CV sections"><a href="#experience">Experience</a><a href="#education">Education</a><a href="#research-service">Research & service</a><a href="#recognition">Recognition</a></nav>

  <section class="cv-section" id="experience"><header><span>01</span><h2>Experience</h2></header><div class="cv-list">
    {% for item in site.data.experience.work_experience %}<article><time>{{ item.dates }}</time><div><h3>{{ item.title }}</h3><p class="cv-location">{{ item.location }}</p>{% if item.description %}<p>{{ item.description }}</p>{% endif %}</div></article>{% endfor %}
  </div></section>

  <section class="cv-section" id="education"><header><span>02</span><h2>Education</h2></header><div class="cv-list cv-list--compact">
    {% for item in site.data.experience.education %}<article><time>{{ item.dates }}</time><div><h3>{{ item.title }}</h3><p class="cv-location">{{ item.location }}</p>{% if item.description %}<p>{{ item.description }}</p>{% endif %}</div></article>{% endfor %}
  </div></section>

  <section class="cv-section" id="research-service"><header><span>03</span><h2>Research, teaching & service</h2></header><div class="cv-columns">
    <div><p class="column-title">PATENT</p>{% for item in site.data.experience.patents %}<article class="cv-mini"><time>{{ item.dates }}</time><h3>{{ item.title }}</h3><p>{{ item.location }}</p>{% if item.description %}<p>{{ item.description }}</p>{% endif %}</article>{% endfor %}</div>
    <div><p class="column-title">TEACHING</p>{% for item in site.data.experience.teaching %}<article class="cv-mini"><time>{{ item.dates }}</time><h3>{{ item.title }}</h3><p>{{ item.location }}</p>{% if item.description %}<p>{{ item.description }}</p>{% endif %}</article>{% endfor %}</div>
    <div><p class="column-title">SPEAKING</p>{% for item in site.data.experience.talks %}<article class="cv-mini"><time>{{ item.dates }}</time><h3>{% if item.url %}<a href="{{ item.url }}" target="_blank" rel="noreferrer">{{ item.title }}</a>{% else %}{{ item.title }}{% endif %}</h3><p>{{ item.location }}</p></article>{% endfor %}</div>
  </div></section>

  <section class="cv-section" id="recognition"><header><span>04</span><h2>Recognition</h2></header><div class="cv-recognition-body"><div class="cv-awards">
    {% for key in site.data.awards %}{% assign award = key[1] %}{% if award.category %}<article><span>{{ award.year }}</span><div><small>{{ award.category }}</small><h3>{% if award.url %}<a href="{{ award.url }}" target="_blank" rel="noreferrer">{{ award.title }}</a>{% else %}{{ award.title }}{% endif %}</h3></div></article>{% endif %}{% endfor %}
  </div><div class="cv-service"><p class="column-title">PROFESSIONAL SERVICE</p>{% for item in site.data.awards.service %}<article><h3>{{ item.role }}</h3><p>{{ item.description }}</p></article>{% endfor %}</div></div></section>

  <footer class="cv-footer"><p>Looking for the ideas behind the record?</p><a class="btn btn-primary" href="/about/">Return to About</a><a class="btn btn-secondary" href="/contact/">Contact me</a></footer>
</article>
