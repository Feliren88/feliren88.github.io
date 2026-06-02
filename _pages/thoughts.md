---
layout: page
title: Writings
description: Articles on trustworthy AI, conformal prediction, multimodal systems, Southeast Asian AI, and personal reflections — published on Medium.
permalink: /writings/
---

{% if site.data.features %}
<div class="features-section">
  <p class="t-eyebrow" style="margin-bottom:0.75rem">Featured In</p>
  <div class="features-grid">
    {% for feature in site.data.features %}
    <a class="feature-card{% if feature.image %} feature-card--has-img{% endif %}" href="{{ feature.url }}" target="_blank" rel="noreferrer">
      {% if feature.image %}<img class="feature-card-img" src="{{ feature.image }}" alt="{{ feature.title }}" loading="lazy">{% endif %}
      <div class="feature-card-body">
        <div class="feature-card-top">
          <span class="feature-publication">{{ feature.publication }}</span>
          <span class="feature-date">{{ feature.date }}</span>
        </div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
        <span class="feature-read">Read on {{ feature.publication }} →</span>
      </div>
    </a>
    {% endfor %}
  </div>
</div>
{% endif %}

<div class="writings-divider"></div>

<h2 class="section-title">
  <a href="https://medium.com/@feliren" target="_blank" rel="noreferrer" style="text-decoration:none">
    <img src="/assets/img/medium-svgrepo-com.webp" alt="Medium" style="width:24px;height:24px;vertical-align:middle;margin-right:0.3rem" loading="lazy">
    <span class="medium-badge" style="margin-left:0">@feliren</span>
  </a>
</h2>
<p class="section-note">Thoughts on life, philosophy, AI, research, and engineering from my Medium articles.</p>

<div class="filter-bar" role="group" aria-label="Filter writings by category">
  <button class="filter-pill is-active" data-filter="all">All</button>
  <button class="filter-pill" data-filter="Engineering">Engineering</button>
  <button class="filter-pill" data-filter="Research">Research</button>
  <button class="filter-pill" data-filter="Personal">Personal</button>
</div>
<p class="th-count" id="thought-count" role="status" aria-live="polite" aria-atomic="true"></p>

<div id="thoughts-container" class="thoughts-grid">
  {% for thought in site.data.thoughts %}
  <a class="thought-card{% if thought.image %} thought-card--has-img{% endif %}" href="{{ thought.url }}" target="_blank" rel="noreferrer" data-tag="{{ thought.tag }}">
    {% if thought.image %}<img class="thought-card-img" src="{{ thought.image }}" alt="" loading="lazy">{% endif %}
    <div class="thought-body">
      <div class="thought-meta">
        {% if thought.tag %}<span class="thought-tag-pill thought-tag-{{ thought.tag | downcase }}">{{ thought.tag }}</span>{% endif %}
        {% if thought.date %}<span class="thought-date">{{ thought.date }}</span>{% endif %}
      </div>
      <h3>{{ thought.title }}</h3>
      <p>{{ thought.description }}</p>
      <span class="read-more">Read on Medium →</span>
    </div>
  </a>
  {% endfor %}
</div>

<script>
(function () {
  var filters = document.querySelectorAll('.filter-pill');
  var cards = document.querySelectorAll('.thought-card');
  var countEl = document.getElementById('thought-count');

  function applyFilter(kind) {
    var visible = 0;
    cards.forEach(function (card) {
      var match = kind === 'all' || card.getAttribute('data-tag') === kind;
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    if (countEl) countEl.textContent = visible + (visible === 1 ? ' article' : ' articles');
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      applyFilter(btn.getAttribute('data-filter') || 'all');
    });
  });

  applyFilter('all');
})();
</script>

<style>
  /* ── Featured In ─────────────────────────────────────── */
  .features-section { margin-bottom: 0.5rem; }
  .features-grid { display: grid; gap: 1rem; }
  .feature-card {
    display: block;
    text-decoration: none;
    padding: var(--card-pad-lg);
    border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
    border-radius: 1rem;
    background: color-mix(in srgb, var(--accent) 4%, var(--surface));
    box-shadow: var(--shadow);
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    overflow: hidden;
  }
  .feature-card--has-img { padding-top: 0; }
  .feature-card-img {
    display: block;
    width: calc(100% + 2 * var(--card-pad-lg));
    margin: 0 calc(-1 * var(--card-pad-lg)) var(--card-pad-lg);
    height: 220px;
    object-fit: cover;
  }
  .feature-card-body { display: flex; flex-direction: column; }
  .feature-card:hover {
    border-color: var(--accent);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.28);
  }
  .feature-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.55rem;
  }
  .feature-publication {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
  }
  .feature-date {
    font-size: 0.72rem;
    color: var(--muted);
    font-family: var(--font-mono, ui-monospace, monospace);
  }
  .feature-card h3 {
    margin: 0 0 0.4rem;
    font-size: 1.12rem;
    line-height: 1.3;
    color: var(--text);
  }
  .feature-card p {
    margin: 0;
    color: var(--muted);
    font-size: 0.86rem;
    line-height: 1.52;
  }
  .feature-read {
    display: inline-block;
    margin-top: 0.65rem;
    color: var(--accent);
    font-size: 0.76rem;
    font-weight: 700;
  }
  .writings-divider {
    margin: 1.75rem 0 1.5rem;
    border-top: 1px solid var(--line);
  }

  .th-count {
    margin: 0 0 0.7rem;
    color: var(--muted);
    font-size: 0.77rem;
  }
  .thoughts-grid {
    margin-top: 0.1rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }
  .thought-card {
    display: block;
    text-decoration: none;
    padding: var(--card-pad-sm);
    border: 1px solid var(--line);
    border-radius: 1rem;
    background: var(--surface);
    box-shadow: var(--shadow);
    transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    overflow: hidden;
  }
  .thought-card--has-img { padding-top: 0; }
  .thought-card-img {
    display: block;
    width: calc(100% + 2rem);
    margin: 0 -1rem 0.85rem;
    height: 160px;
    object-fit: cover;
  }
  .thought-body { padding: 0; }
  .thought-card:hover {
    border-color: rgba(119, 146, 175, 0.48);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  }
  .thought-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.45rem;
  }
  .thought-tag-pill {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
  .thought-tag-engineering { background: rgba(59, 130, 246, 0.15); color: #93c5fd; }
  .thought-tag-research    { background: rgba(139, 92, 246, 0.15); color: #c4b5fd; }
  .thought-tag-personal    { background: rgba(20, 184, 166, 0.15); color: #5eead4; }
  [data-theme="light"] .thought-tag-engineering { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
  [data-theme="light"] .thought-tag-research    { background: rgba(139, 92, 246, 0.12); color: #7c3aed; }
  [data-theme="light"] .thought-tag-personal    { background: rgba(20, 184, 166, 0.12); color: #0f766e; }
  .thought-date {
    font-size: 0.72rem;
    color: var(--muted);
    font-family: var(--font-mono, ui-monospace, monospace);
    margin-left: auto;
  }
  .thought-card h3 {
    margin: 0;
    font-size: 1.08rem;
    line-height: 1.3;
    color: var(--text);
  }
  .thought-card:hover h3 { color: var(--muted); }
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
  @media (max-width: 600px) {
    .thoughts-grid { grid-template-columns: 1fr; }
  }
</style>
