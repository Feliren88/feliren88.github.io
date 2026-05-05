---
layout: page
title: Writings
subtitle: AI Research, Multimodal Systems, Southeast Asia
description: Articles on trustworthy AI, conformal prediction, multimodal systems, Southeast Asian AI, and personal reflections — published on Medium.
permalink: /writings/
---

<p class="eyebrow">WRITING</p>
<h1 class="section-title">Thoughts
  <a class="medium-badge" href="https://medium.com/@feliren" target="_blank" rel="noreferrer">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a2.46 2.46 0 0 1-2.46 2.46 2.46 2.46 0 0 1-2.46-2.46A2.46 2.46 0 0 1 13.54 12a2.46 2.46 0 0 1 .23 1.47l-3.82 1.54a1.54 1.54 0 0 1-1.08-1.08l1.54-3.82A2.46 2.46 0 0 1 13.54 12zm-6.7 3.7a25.46 25.46 0 0 1 8.54-7.7l1.92 1.92a19.7 19.7 0 0 0-7.7 4.08 19.7 19.7 0 0 0-2.76 1.7zm9.9-8.7a22.7 22.7 0 0 1 7.7 7.7l-1.92 1.92a25.46 25.46 0 0 1-5.78-9.62z"/></svg>
    @feliren
  </a>
</h1>
<p class="section-note">Thoughts on life, philosophy, AI, research, and engineering from my Medium articles.</p>

<div id="thoughts-container" class="thoughts-grid">
  {% for thought in site.data.thoughts %}
  <a class="thought-card" href="{{ thought.url }}" target="_blank" rel="noreferrer">
    <h3>{{ thought.title }}</h3>
    <p>{{ thought.description }}</p>
    <span class="read-more">Read on Medium →</span>
  </a>
  {% endfor %}
</div>

<style>
  .thoughts-grid {
    margin-top: 0.95rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem;
  }
  .thought-card {
    display: block;
    text-decoration: none;
    padding: 0.88rem;
    border: 1px solid var(--line);
    border-radius: 1rem;
    background: var(--surface);
    box-shadow: var(--shadow);
    transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }
  .thought-card:hover {
    border-color: rgba(119, 146, 175, 0.48);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  }
  .thought-card h3 {
    margin: 0;
    font-size: 1.08rem;
    line-height: 1.3;
    transition: color 0.2s ease;
  }
  .thought-card:hover h3 {
    color: var(--accent);
  }
  .thought-card p {
    margin: 0.42rem 0 0;
    color: var(--muted);
    font-size: 0.86rem;
    line-height: 1.52;
  }
  .thought-card .read-more {
    display: inline-block;
    margin-top: 0.52rem;
    color: var(--accent);
    font-size: 0.76rem;
    font-weight: 700;
  }
  .medium-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-left: 0.5rem;
    color: var(--accent);
    font-size: 0.72rem;
    font-weight: 600;
    text-decoration: none;
  }
</style>