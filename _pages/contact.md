---
layout: page
title: Work with Vicky Feliren
description: Available for speaking engagements, research collaboration, mentorship, and applied scientist roles internationally. Specializing in trustworthy AI and cultural AI for Southeast Asia.
permalink: /contact/
preload_image: /assets/img/profile_2_color.webp
---

<img src="/assets/img/profile_2_color.webp" alt="Vicky Feliren – AI researcher and applied scientist" class="profile-bg profile-bg--contact" draggable="false" fetchpriority="high">

<p class="eyebrow">LET'S WORK TOGETHER</p>
{% if site.data.contact.availability_headline %}
<p class="availability-hl">{{ site.data.contact.availability_headline }}</p>
{% endif %}
<div class="contact-intro-block">
  <p class="contact-intro">{{ site.data.contact.intro }}</p>
  <p class="contact-intro">{{ site.data.contact.intro_sub }}</p>
</div>

<div id="contact-engagements" class="contact-engagements-grid">
  {% for item in site.data.contact.engagements %}
  <div class="card--mini">
    <h2 class="t-section-title">{{ item.type }}</h2>
    <p class="engagement-desc">{{ item.description }}</p>
  </div>
  {% endfor %}
</div>

<p class="column-title contact-reach-title">REACH ME</p>
{% if site.data.contact.email_scope %}
<p class="contact-scope">{{ site.data.contact.email_scope }}</p>
{% endif %}
<div id="contact-grid" class="contact-grid">
  {% for link in site.data.contact.links %}
  <a class="contact-card" href="{{ link.url }}"{% unless link.url contains 'mailto' %} target="_blank" rel="noreferrer"{% endunless %}>
    <img src="/assets/img/{{ link.icon }}" alt="{{ link.label }}" class="contact-icon" loading="lazy">
    <span>{{ link.label }}</span>
    <strong>{{ link.value }}</strong>
  </a>
  {% endfor %}
</div>
{% if site.data.contact.calendly_open and site.data.contact.calendly_url %}
<div class="calendly-block">
  <a href="{{ site.data.contact.calendly_url }}" target="_blank" rel="noreferrer" class="btn btn-primary">Schedule 15-min intro →</a>
  <span class="calendly-label">{{ site.data.contact.calendly_slots_label }}</span>
</div>
{% endif %}
