---
layout: page
title: Work with Vicky Feliren
description: Available for speaking engagements, research collaboration, mentorship, and applied scientist roles internationally. Specializing in trustworthy AI and cultural AI for Southeast Asia.
permalink: /contact/
preload_image: /assets/img/profile_2_color.webp
---

<img src="/assets/img/profile_2_color.webp" alt="Vicky Feliren – AI researcher and applied scientist" class="profile-bg" draggable="false" fetchpriority="high">

<p class="eyebrow">LET'S WORK TOGETHER</p>
{% if site.data.contact.availability_headline %}
<p class="availability-hl">{{ site.data.contact.availability_headline }}</p>
{% endif %}
<div class="contact-intro-block">
  <p class="contact-intro">{{ site.data.contact.intro }}</p>
  <p class="contact-intro" style="font-size:0.97rem;margin-top:0.5rem;color:var(--muted)">{{ site.data.contact.intro_sub }}</p>
</div>

<div id="contact-engagements" class="contact-engagements-grid">
  {% for item in site.data.contact.engagements %}
  <div class="card--mini">
    <h2 class="t-section-title">{{ item.type }}</h2>
    <p style="font-size:0.95rem;line-height:1.55;color:var(--muted);margin:0">{{ item.description }}</p>
  </div>
  {% endfor %}
</div>

<p class="column-title" style="margin-top:2.5rem;margin-bottom:1rem">REACH ME</p>
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

<style>
  .profile-bg { position: absolute; right: -160px; top: 40px; width: 650px; z-index: -1; user-select: none; -webkit-user-drag: none; border-radius: 0; }
  @media (max-width: 1200px) { .profile-bg { position: static; width: 100%; max-width: 500px; margin: 2rem auto; opacity: 1; } }
  .contact-engagements-grid {
    margin: 0 0 var(--gap-4);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--gap-2);
    max-width: 56rem;
  }
  .contact-icon { width: 24px; height: 24px; margin-bottom: 0.5rem; }
  .availability-hl {
    font-size: 0.95rem;
    color: var(--muted);
    border-left: 2px solid var(--accent);
    padding-left: 0.75rem;
    margin: 0.4rem 0 1.5rem;
    line-height: 1.5;
  }
  .contact-scope {
    font-size: 0.88rem;
    color: var(--muted);
    margin: 0 0 1rem;
    line-height: 1.6;
    max-width: 44rem;
  }
  .calendly-block {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1.25rem;
  }
  .calendly-label {
    font-size: 0.82rem;
    color: var(--muted);
  }
</style>
