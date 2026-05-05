---
layout: page
title: Work With Vicky Feliren
subtitle: Speaking, Research Collaboration, Mentorship, Applied Scientist Roles
description: Available for speaking engagements, research collaboration, mentorship, and applied scientist roles internationally. Specializing in trustworthy AI and cultural AI for Southeast Asia.
permalink: /contact/
---

<p class="eyebrow">LET'S WORK TOGETHER</p>
<p class="contact-intro">{{ site.data.contact.intro }}</p>

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
  <a class="contact-card" href="mailto:vickyfeliren@gmail.com" target="_blank" rel="noreferrer">
    <img src="/assets/img/gmail-svgrepo-com.svg" alt="Email" class="contact-icon">
    <span>Email</span>
    <strong>vickyfeliren@gmail.com</strong>
  </a>
  <a class="contact-card" href="https://www.linkedin.com/in/feliren/" target="_blank" rel="noreferrer">
    <img src="/assets/img/linkedin-svgrepo-com.svg" alt="LinkedIn" class="contact-icon">
    <span>LinkedIn</span>
    <strong>feliren</strong>
  </a>
  <a class="contact-card" href="https://github.com/feliren88" target="_blank" rel="noreferrer">
    <img src="/assets/img/github-svgrepo-com.svg" alt="GitHub" class="contact-icon">
    <span>GitHub</span>
    <strong>feliren88</strong>
  </a>
  <a class="contact-card" href="https://scholar.google.com/citations?user=R2LVQ7AAAAAJ&hl=en" target="_blank" rel="noreferrer">
    <img src="/assets/img/google-scholar-svgrepo-com.svg" alt="Google Scholar" class="contact-icon">
    <span>Google Scholar</span>
    <strong>Vicky Feliren</strong>
  </a>
  <a class="contact-card" href="https://medium.com/@feliren" target="_blank" rel="noreferrer">
    <img src="/assets/img/medium-icon-svgrepo-com.svg" alt="Medium" class="contact-icon">
    <span>Medium</span>
    <strong>@feliren</strong>
  </a>
</div>

<style>
  .contact-icon {
    width: 24px;
    height: 24px;
    margin-bottom: 0.5rem;
  }
</style>
