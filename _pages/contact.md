---
layout: page
title: Work with Vicky Feliren
description: Contact Vicky Feliren about research, applied scientist roles, speaking, or mentorship in AI safety and reliable AI.
permalink: /contact/
preload_image: /assets/img/profile_2_color.webp
layout-class: page contact-page
hide_title: true
extra_css: /css/contact.css
extra_js: /js/components/contact.js
---

<header class="ct-hero" aria-labelledby="ct-title">
  <div class="ct-hero-copy">
    <p class="ct-status"><i aria-hidden="true"></i> Open to thoughtful work</p>
    <h1 id="ct-title">Let’s make reliable AI more useful.</h1>
    <p class="ct-lead">{{ site.data.contact.intro_sub }}</p>
    <p class="ct-location">Jakarta <span aria-hidden="true">·</span> working internationally</p>
    <div class="ct-actions">
      <a class="ct-button ct-button-primary" href="mailto:vickyfeliren@gmail.com?subject=Working%20with%20Vicky%20Feliren">Email me <span aria-hidden="true">↗</span></a>
      <a class="ct-button" href="https://www.linkedin.com/in/feliren/" target="_blank" rel="noreferrer">LinkedIn</a>
      <button class="ct-copy" id="ct-copy" type="button" data-email="vickyfeliren@gmail.com">Copy email</button>
    </div>
    <p class="ct-copy-status" id="ct-copy-status" role="status" aria-live="polite"></p>
  </div>
  <figure class="ct-portrait">
    <div class="ct-orbit" aria-hidden="true"><i></i><i></i><i></i></div>
    <img src="/assets/img/profile_2_color.webp" alt="Vicky Feliren, AI researcher and applied scientist" draggable="false" fetchpriority="high" width="650" height="650">
    <figcaption>Calibration · safety alignment · multilingual and multimodal AI</figcaption>
  </figure>
</header>

<section class="ct-fit" id="contact-engagements" aria-labelledby="ct-fit-title">
  <div class="ct-section-head">
    <p class="ct-eyebrow">Good reasons to reach out</p>
    <h2 id="ct-fit-title">Start with the kind of conversation.</h2>
    <p>A useful first message does not need to be long. It should make the problem and the next decision visible.</p>
  </div>
  <div class="ct-fit-list">
    {% for item in site.data.contact.engagements %}
    <article class="ct-fit-row">
      <span class="ct-num">0{{ forloop.index }}</span>
      <div class="ct-fit-name"><h3>{{ item.type }}</h3><span>{% if forloop.index == 1 %}Research{% elsif forloop.index == 2 %}Roles{% elsif forloop.index == 3 %}Events{% else %}Guidance{% endif %}</span></div>
      <p>{{ item.description }}</p>
      <div class="ct-include"><small>Include</small><p>{{ item.include }}</p><small class="ct-next">What happens next</small><p>{{ item.response }}</p></div>
    </article>
    {% endfor %}
  </div>
</section>

<section class="ct-reach" aria-labelledby="ct-reach-title">
  <div class="ct-section-head compact">
    <p class="ct-eyebrow">Reach me</p>
    <h2 id="ct-reach-title">Choose the shortest route.</h2>
  </div>
  <div id="contact-grid" class="ct-directory">
    {% for link in site.data.contact.links %}
    <a class="ct-link{% if link.label == 'Email' %} is-primary{% endif %}" href="{{ link.url }}"{% unless link.url contains 'mailto' %} target="_blank" rel="noreferrer"{% endunless %}>
      <img src="/assets/img/{{ link.icon }}" alt="" loading="lazy" width="24" height="24">
      <span><small>{{ link.label }}</small><b>{{ link.value }}</b></span>
      <strong>{% case link.label %}{% when 'Email' %}Write{% when 'LinkedIn' %}Connect{% when 'GitHub' %}View code{% when 'Google Scholar' %}View papers{% when 'Medium' %}Read essays{% endcase %} <i aria-hidden="true">↗</i></strong>
    </a>
    {% endfor %}
  </div>
</section>
{% if site.data.contact.calendly_open and site.data.contact.calendly_url %}
<div class="calendly-block">
  <a href="{{ site.data.contact.calendly_url }}" target="_blank" rel="noreferrer" class="btn btn-primary">Schedule 15-min intro →</a>
  <span class="calendly-label">{{ site.data.contact.calendly_slots_label }}</span>
</div>
{% endif %}
