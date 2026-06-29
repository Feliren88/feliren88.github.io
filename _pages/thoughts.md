---
layout: page
title: Writings
description: Articles on trustworthy AI, conformal prediction, multimodal systems, Southeast Asian AI, and personal reflections, published on Medium.
permalink: /writings/
---

{% if site.data.notes %}
<div class="notes-section">
  <p class="t-eyebrow" style="margin-bottom:0.5rem">Research Notes</p>
  <p class="section-note" style="margin-top:0">Short distillations of papers I have an opinion about — what the work shows, and what I think it misses.</p>
  <div class="notes-list">
    {% for note in site.data.notes %}
    <div class="note-item">
      <div class="note-item-top">
        <span class="note-item-paper">{{ note.paper }}{% if note.authors %} · {{ note.authors }}{% endif %}{% if note.venue %} · {{ note.venue }} {{ note.year }}{% endif %}</span>
        {% if note.date %}<span class="note-item-date">{{ note.date }}</span>{% endif %}
      </div>
      <h3 class="note-item-title">{{ note.title }}</h3>
      <p class="note-item-take">{{ note.take }}</p>
      {% if note.link %}<a class="note-item-link" href="{{ note.link }}" target="_blank" rel="noreferrer">Read the paper →</a>{% endif %}
    </div>
    {% endfor %}
  </div>
</div>
<div class="writings-divider"></div>
{% endif %}

{% if site.data.features %}
<div class="features-section">
  <p class="t-eyebrow" style="margin-bottom:0.75rem">Featured In</p>
  <div class="features-grid">
    {% for feature in site.data.features %}
    <div class="feature-card{% if feature.image %} feature-card--has-img{% endif %}">
      {% if feature.image %}<img class="feature-card-img" src="{{ feature.image }}" alt="{{ feature.title }}" loading="lazy">{% endif %}
      <div class="feature-card-body">
        <div class="feature-card-top">
          {% if feature.sources %}
          <span class="feature-publication">{% for source in feature.sources %}{{ source.publication }}{% unless forloop.last %} · {% endunless %}{% endfor %}</span>
          {% else %}
          <span class="feature-publication">{{ feature.publication }}</span>
          {% endif %}
          <span class="feature-date">{{ feature.date }}</span>
        </div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
        {% if feature.sources %}
        <div class="feature-source-buttons">
          {% for source in feature.sources %}
          <a class="feature-source-btn{% if source.paywalled %} feature-source-btn--paywalled{% endif %}" href="{{ source.url }}" target="_blank" rel="noreferrer">
            Read on {{ source.publication }}{% if source.paywalled %}&thinsp;<span class="paywall-badge">Paywalled</span>{% endif %} →
          </a>
          {% endfor %}
        </div>
        {% else %}
        <a class="feature-read" href="{{ feature.url }}" target="_blank" rel="noreferrer">Read on {{ feature.publication }} →</a>
        {% endif %}
      </div>
    </div>
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
  <button class="filter-pill" data-filter="all">All</button>
  <button class="filter-pill is-active" data-filter="Research">Research</button>
  <button class="filter-pill" data-filter="Engineering">Engineering</button>
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

  applyFilter('Research');
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
  .feature-source-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.65rem;
  }
  .feature-source-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.75rem;
    border: 1px solid var(--border-ui);
    border-radius: 999px;
    color: var(--accent);
    font-size: 0.76rem;
    font-weight: 700;
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .feature-source-btn:hover {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }
  .feature-source-btn--paywalled {
    opacity: 0.75;
  }
  .paywall-badge {
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    background: color-mix(in srgb, var(--muted) 18%, transparent);
    color: var(--muted);
  }
  .writings-divider {
    margin: 1.75rem 0 1.5rem;
    border-top: 1px solid var(--line);
  }

  /* ── Research Notes ──────────────────────────────────── */
  .notes-section { margin-bottom: 0.5rem; }
  .notes-list { display: grid; gap: 1rem; margin-top: 1rem; }
  .note-item {
    padding: var(--card-pad-sm);
    border: 1px solid var(--line);
    border-left: 2px solid var(--accent);
    border-radius: 0 8px 8px 0;
    background: var(--surface);
  }
  .note-item-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.4rem;
  }
  .note-item-paper {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--accent);
  }
  .note-item-date {
    font-size: 0.72rem;
    color: var(--muted);
    font-family: var(--font-mono, ui-monospace, monospace);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .note-item-title {
    margin: 0 0 0.5rem;
    font-size: 1.02rem;
    line-height: 1.35;
    color: var(--text);
  }
  .note-item-take {
    margin: 0;
    color: var(--muted);
    font-size: 0.88rem;
    line-height: 1.6;
  }
  .note-item-link {
    display: inline-block;
    margin-top: 0.6rem;
    color: var(--accent);
    font-size: 0.76rem;
    font-weight: 700;
    text-decoration: none;
  }
  .note-item-link:hover { text-decoration: underline; }

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
