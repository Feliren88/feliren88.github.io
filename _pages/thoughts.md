---
layout: page
title: Writings
subtitle: AI Research, Multimodal Systems, Southeast Asia
description: Articles on trustworthy AI, conformal prediction, multimodal systems, Southeast Asian AI, and personal reflections — published on Medium.
permalink: /writings/
---

<h1 class="section-title">
  <a href="https://medium.com/@feliren" target="_blank" rel="noreferrer" style="text-decoration:none;color:inherit">Thoughts</a>
  <a href="https://medium.com/@feliren" target="_blank" rel="noreferrer" style="text-decoration:none">
    <img src="/assets/img/medium-svgrepo-com.svg" alt="Medium" style="width:24px;height:24px;vertical-align:middle;margin-right:0.3rem">
    <span class="medium-badge" style="margin-left:0">@feliren</span>
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
    color: var(--accent);
    font-size: 0.82rem;
    font-weight: 600;
    text-decoration: none;
    vertical-align: middle;
  }
</style>