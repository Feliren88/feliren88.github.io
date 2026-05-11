---
layout: page
title: Use Cases
subtitle: Applied Machine Learning Across Research, Industry, and the Field
description: A practitioner's view of ML use cases across geospatial AI, cultural NLP, production fintech, and applied projects — from satellite imagery to hackathon prototypes.
permalink: /usecases/
---

<div class="wip-notice" role="note">
  <span class="wip-badge">Work in Progress</span>
  <p>{{ site.data.usecases.wip_notice }}</p>
</div>

<div class="uc-filter-bar" role="group" aria-label="Filter use cases by category">
  <button class="uc-filter-btn is-active" data-filter="all">All</button>
  {% for cat in site.data.usecases.categories %}
  <button class="uc-filter-btn" data-filter="{{ cat.id }}">{{ cat.label }}</button>
  {% endfor %}
</div>

<div class="uc-grid" id="uc-grid">
  {% for uc in site.data.usecases.usecases %}
  {% assign ext_link = uc.link | default: uc.arxiv %}
  {% unless ext_link %}{% if uc.doi %}{% assign ext_link = "https://doi.org/" | append: uc.doi %}{% endif %}{% endunless %}
  <article class="uc-card" data-category="{{ uc.category }}" data-index="{{ forloop.index }}">

    <div class="uc-card-header">
      <div class="uc-tags">
        {% for tag in uc.tags %}<span class="uc-tag">{{ tag }}</span>{% endfor %}
      </div>
      {% if ext_link %}<a class="uc-ext-link" href="{{ ext_link }}" target="_blank" rel="noreferrer" aria-label="View source for {{ uc.title }}">↗</a>{% endif %}
    </div>

    <h3 class="uc-title"><a href="/usecases/{{ uc.id }}/" class="uc-title-link">{{ uc.title }}</a></h3>
    <p class="uc-meta"><span class="uc-venue-name">{{ uc.venue }}</span>{% if uc.role %}<span class="uc-role"> · {{ uc.role }}</span>{% endif %}</p>

    {% if uc.hook %}<p class="uc-situation">{{ uc.hook }}</p>{% endif %}

    {% if uc.tech_stack %}
    <div class="uc-tech-strip">
      {% for pair in uc.tech_stack %}{% unless pair[0] == 'hyperparams' %}{% for item in pair[1] %}<span class="uc-tech-tag">{{ item }}</span>{% endfor %}{% endunless %}{% endfor %}
    </div>
    {% endif %}

    <a href="/usecases/{{ uc.id }}/" class="uc-card-cta">Read writeup →</a>

  </article>
  {% endfor %}
</div>

<style>
  .page-title { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 700; margin: 0.2rem 0 0.5rem; line-height: 1.1; }
  .page-subtitle { font-size: 1.05rem; color: var(--muted); margin-bottom: 2rem; }

  /* ── WIP notice ─────────────────────────────────────── */
  .wip-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border: 1px solid var(--border-ui);
    border-radius: 8px;
    margin-bottom: 2.5rem;
    background: var(--surface);
  }
  .wip-notice p { margin: 0; font-size: 0.9rem; color: var(--muted); line-height: 1.55; }
  .wip-badge {
    flex-shrink: 0;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    background: color-mix(in srgb, var(--accent) 15%, transparent);
    color: var(--accent);
    border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
    margin-top: 0.1rem;
  }

  /* ── Filter bar ─────────────────────────────────────── */
  .uc-filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }
  .uc-filter-btn {
    padding: 0.35rem 0.85rem;
    font-size: 0.82rem;
    font-family: inherit;
    border: 1px solid var(--border-ui);
    border-radius: 20px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .uc-filter-btn:hover { color: var(--text); border-color: var(--accent); }
  .uc-filter-btn.is-active { color: var(--accent); border-color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); }

  /* ── Grid ───────────────────────────────────────────── */
  .uc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.25rem;
    align-items: start;
  }

  /* ── Card ───────────────────────────────────────────── */
  .uc-card {
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    transition: border-color 0.2s;
  }
  .uc-card:hover { border-color: var(--border-ui); }
  .uc-card[hidden] { display: none; }

  /* ── Card header: tags + external link ──────────────── */
  .uc-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.8rem;
  }
  .uc-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .uc-tag {
    font-size: 0.68rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.15rem 0.45rem;
    border-radius: 3px;
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: var(--accent);
  }
  .uc-ext-link {
    flex-shrink: 0;
    font-size: 1rem;
    color: var(--muted);
    text-decoration: none;
    line-height: 1;
    padding: 0.2rem 0.3rem;
    border-radius: 4px;
    transition: color 0.15s;
  }
  .uc-ext-link:hover { color: var(--accent); }

  /* ── Title + meta ───────────────────────────────────── */
  .uc-title { font-size: 1rem; font-weight: 600; margin: 0 0 0.3rem; line-height: 1.35; }
  .uc-title-link { color: var(--text); text-decoration: none; transition: color 0.15s; }
  .uc-title-link:hover { color: var(--accent); }
  .uc-meta { margin: 0 0 1rem; font-size: 0.78rem; line-height: 1.4; }
  .uc-venue-name { color: var(--accent); font-weight: 500; }
  .uc-role { color: var(--muted); }

  /* ── Hook — short card teaser ───────────────────────── */
  .uc-situation {
    margin: 0 0 1rem;
    font-size: 0.88rem;
    color: var(--muted);
    line-height: 1.68;
    flex: 1;
  }

  /* ── Tech strip ─────────────────────────────────────── */
  .uc-tech-strip { display: flex; flex-wrap: wrap; gap: 0.3rem; margin: 0.65rem 0 0; }
  .uc-tech-tag {
    font-size: 0.67rem;
    padding: 0.1rem 0.38rem;
    border-radius: 3px;
    background: color-mix(in srgb, var(--muted) 10%, transparent);
    color: var(--muted);
    border: 1px solid color-mix(in srgb, var(--muted) 15%, transparent);
  }

  /* ── CTA ─────────────────────────────────────────────── */
  .uc-card-cta {
    display: inline-block;
    margin-top: auto;
    padding-top: 0.85rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--accent);
    text-decoration: none;
    border-top: 1px solid var(--line);
    transition: opacity 0.15s;
  }
  .uc-card-cta:hover { opacity: 0.75; }

  @media (max-width: 600px) {
    .uc-grid { grid-template-columns: 1fr; }
    .uc-filter-bar { gap: 0.4rem; }
  }
</style>

<script>
(function() {
  var PRIORITY = { ongoing: 1, cultural: 2, geospatial: 3, production: 4, applied: 5 };
  var btns = document.querySelectorAll('.uc-filter-btn');
  var grid = document.getElementById('uc-grid');
  var cards = document.querySelectorAll('.uc-card');

  function applyFilter(filter) {
    var arr = Array.from(cards);
    arr.sort(function(a, b) {
      if (filter === 'all') {
        var pa = PRIORITY[a.getAttribute('data-category')] || 99;
        var pb = PRIORITY[b.getAttribute('data-category')] || 99;
        if (pa !== pb) return pa - pb;
      }
      return parseInt(a.getAttribute('data-index')) - parseInt(b.getAttribute('data-index'));
    });
    arr.forEach(function(card) { grid.appendChild(card); });
    cards.forEach(function(card) {
      card.hidden = filter !== 'all' && card.getAttribute('data-category') !== filter;
    });
  }

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      btns.forEach(function(b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  applyFilter('all');
})();
</script>
