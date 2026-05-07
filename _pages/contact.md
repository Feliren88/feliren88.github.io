---
layout: page
title: Work with Vicky Feliren
subtitle: Speaking, Research Collaboration, Mentorship, Applied Scientist Roles
description: Available for speaking engagements, research collaboration, mentorship, and applied scientist roles internationally. Specializing in trustworthy AI and cultural AI for Southeast Asia.
permalink: /contact/
preload_image: /assets/img/profile_3_bg.webp
---

<img src="/assets/img/profile_3_bg.webp" alt="" class="profile-bg" aria-hidden="true" draggable="false" fetchpriority="high">

<p class="eyebrow">LET'S WORK TOGETHER</p>
<p class="contact-intro">{{ site.data.contact.intro }}</p>
<p class="contact-intro" style="font-size:1rem;margin-top:0.6rem;color:var(--muted)">{{ site.data.contact.intro_sub }}</p>

<div id="contact-engagements" style="margin:2rem 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.2rem;max-width:56rem">
  {% for item in site.data.contact.engagements %}
  <div style="padding:1.2rem;border:1px solid var(--line);border-radius:8px">
    <h4 style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--accent);margin-bottom:0.5rem">{{ item.type }}</h4>
    <p style="font-size:0.95rem;line-height:1.55;color:var(--muted)">{{ item.description }}</p>
  </div>
  {% endfor %}
</div>

<p class="column-title" style="margin-top:2.5rem;margin-bottom:1rem">REACH ME</p>
<div id="contact-grid" class="contact-grid">
  {% for link in site.data.contact.links %}
  <a class="contact-card" href="{{ link.url }}" target="_blank" rel="noreferrer">
    <img src="/assets/img/{{ link.icon }}" alt="{{ link.label }}" class="contact-icon" loading="lazy">
    <span>{{ link.label }}</span>
    <strong>{{ link.value }}</strong>
  </a>
  {% endfor %}
</div>

<style>
  .profile-bg { position: absolute; right: -160px; top: 40px; width: 650px; z-index: -1; user-select: none; -webkit-user-drag: none; border-radius: 0; }
  @media (max-width: 1200px) { .profile-bg { position: static; width: 100%; max-width: 500px; margin: 2rem auto; opacity: 1; } }
  .contact-icon {
    width: 24px;
    height: 24px;
    margin-bottom: 0.5rem;
  }
</style>
