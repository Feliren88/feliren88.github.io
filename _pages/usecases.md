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
  <article class="uc-card" data-category="{{ uc.category }}">

    <div class="uc-card-header">
      <div class="uc-tags">
        {% for tag in uc.tags %}<span class="uc-tag">{{ tag }}</span>{% endfor %}
      </div>
      {% if ext_link %}<a class="uc-ext-link" href="{{ ext_link }}" target="_blank" rel="noreferrer" aria-label="View source for {{ uc.title }}">↗</a>{% endif %}
    </div>

    <h3 class="uc-title">{{ uc.title }}</h3>
    <p class="uc-meta"><span class="uc-venue-name">{{ uc.venue }}</span>{% if uc.role %}<span class="uc-role"> · {{ uc.role }}</span>{% endif %}</p>

    {% if uc.situation %}<p class="uc-situation">{{ uc.situation }}</p>{% endif %}

    <details class="uc-details">
      <summary><span class="uc-summary-text">Read full analysis</span></summary>

      {% if uc.complication %}
      <div class="uc-section">
        <span class="uc-section-label">The Challenge</span>
        <p class="uc-section-body">{{ uc.complication }}</p>
      </div>
      {% endif %}

      {% if uc.resolution %}
      <div class="uc-section">
        <span class="uc-section-label">The Approach</span>
        {% for pair in uc.resolution %}
        <p class="uc-section-body">{{ pair[1] }}</p>
        {% endfor %}
      </div>
      {% endif %}

      {% if uc.impact %}
      <div class="uc-impact-block">
        <span class="uc-section-label">Impact</span>
        <p class="uc-impact-body">{{ uc.impact }}</p>
      </div>
      {% endif %}

      {% if uc.metrics %}
      <div class="uc-metrics" aria-label="Key metrics">
        {% for pair in uc.metrics %}
        <span class="uc-metric-pill"><strong>{{ pair[1] }}</strong><span>{{ pair[0] | replace: '_', ' ' }}</span></span>
        {% endfor %}
      </div>
      {% endif %}

      {% if uc.tech_stack %}
      <div class="uc-tech-strip">
        {% for pair in uc.tech_stack %}{% unless pair[0] == 'hyperparams' %}{% for item in pair[1] %}<span class="uc-tech-tag">{{ item }}</span>{% endfor %}{% endunless %}{% endfor %}
      </div>
      {% endif %}

      <div class="uc-detail-links">
        {% if uc.link %}<a href="{{ uc.link }}" target="_blank" rel="noreferrer" class="uc-detail-link">View Publication ↗</a>{% endif %}
        {% if uc.arxiv %}<a href="{{ uc.arxiv }}" target="_blank" rel="noreferrer" class="uc-detail-link">arXiv ↗</a>{% endif %}
        {% unless uc.link %}{% if uc.doi %}<a href="https://doi.org/{{ uc.doi }}" target="_blank" rel="noreferrer" class="uc-detail-link">DOI ↗</a>{% endif %}{% endunless %}
        {% if uc.patent %}<span class="uc-detail-link uc-patent-badge">Patent {{ uc.patent.id }}</span>{% endif %}
        {% if uc.publications %}{% for pub in uc.publications %}{% if pub.link %}<a href="{{ pub.link }}" target="_blank" rel="noreferrer" class="uc-detail-link">Publication ↗</a>{% endif %}{% endfor %}{% endif %}
      </div>
    </details>

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
  .uc-meta { margin: 0 0 1rem; font-size: 0.78rem; line-height: 1.4; }
  .uc-venue-name { color: var(--accent); font-weight: 500; }
  .uc-role { color: var(--muted); }

  /* ── Situation — the narrative hook ─────────────────── */
  .uc-situation {
    margin: 0;
    font-size: 0.88rem;
    color: var(--muted);
    line-height: 1.68;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--line);
  }

  /* ── Details expand ─────────────────────────────────── */
  .uc-details { margin-top: 0; }
  .uc-details summary {
    font-size: 0.78rem;
    color: var(--muted);
    cursor: pointer;
    list-style: none;
    padding: 0.65rem 0;
    display: flex;
    align-items: center;
    gap: 0.45rem;
    transition: color 0.15s;
    user-select: none;
  }
  .uc-details summary::-webkit-details-marker { display: none; }
  .uc-details summary::before { content: '+'; font-size: 0.9rem; flex-shrink: 0; line-height: 1; }
  .uc-details[open] summary::before { content: '−'; }
  .uc-details summary:hover { color: var(--accent); }

  /* ── SCR sections ───────────────────────────────────── */
  .uc-section { margin: 0.25rem 0 1rem; }
  .uc-section:last-of-type { margin-bottom: 0.75rem; }

  .uc-section-label {
    display: block;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.45rem;
  }

  .uc-section-body {
    margin: 0 0 0.65rem;
    font-size: 0.86rem;
    color: var(--muted);
    line-height: 1.68;
  }
  .uc-section-body:last-child { margin-bottom: 0; }

  /* ── Impact block ───────────────────────────────────── */
  .uc-impact-block {
    margin: 0.5rem 0 0.75rem;
    padding: 0.75rem 0.9rem;
    background: var(--surface);
    border-left: 2px solid var(--accent);
    border-radius: 0 6px 6px 0;
  }
  .uc-impact-block .uc-section-label { margin-bottom: 0.35rem; }
  .uc-impact-body { margin: 0; font-size: 0.86rem; color: var(--muted); line-height: 1.65; }

  /* ── Metrics pills ──────────────────────────────────── */
  .uc-metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin: 0.5rem 0 0.75rem;
  }
  .uc-metric-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.35rem 0.6rem;
    background: color-mix(in srgb, var(--accent) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
    border-radius: 6px;
    gap: 0.08rem;
    min-width: 0;
  }
  .uc-metric-pill strong { font-size: 0.88rem; color: var(--text); font-weight: 600; white-space: nowrap; }
  .uc-metric-pill span { font-size: 0.6rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; white-space: nowrap; }

  /* ── Tech strip ─────────────────────────────────────── */
  .uc-tech-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin: 0.25rem 0 0.75rem;
  }
  .uc-tech-tag {
    font-size: 0.67rem;
    padding: 0.1rem 0.38rem;
    border-radius: 3px;
    background: color-mix(in srgb, var(--muted) 10%, transparent);
    color: var(--muted);
    border: 1px solid color-mix(in srgb, var(--muted) 15%, transparent);
  }

  /* ── Detail links ───────────────────────────────────── */
  .uc-detail-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--line);
  }
  a.uc-detail-link {
    font-size: 0.74rem;
    color: var(--muted);
    text-decoration: none;
    padding: 0.2rem 0.5rem;
    border: 1px solid var(--border-ui);
    border-radius: 4px;
    transition: color 0.15s, border-color 0.15s;
  }
  a.uc-detail-link:hover { color: var(--accent); border-color: var(--accent); }
  span.uc-detail-link {
    font-size: 0.74rem;
    color: var(--muted);
    padding: 0.2rem 0.5rem;
    border: 1px solid var(--line);
    border-radius: 4px;
    cursor: default;
  }

  @media (max-width: 600px) {
    .uc-grid { grid-template-columns: 1fr; }
    .uc-filter-bar { gap: 0.4rem; }
  }
</style>

<script>
(function() {
  var btns = document.querySelectorAll('.uc-filter-btn');
  var cards = document.querySelectorAll('.uc-card');
  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var filter = btn.getAttribute('data-filter');
      btns.forEach(function(b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      cards.forEach(function(card) {
        card.hidden = filter !== 'all' && card.getAttribute('data-category') !== filter;
      });
    });
  });
})();
</script>
