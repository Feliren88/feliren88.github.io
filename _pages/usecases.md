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
  <article class="uc-card" data-category="{{ uc.category }}">
    <div class="uc-card-header">
      <div class="uc-tags">
        {% for tag in uc.tags %}<span class="uc-tag">{{ tag }}</span>{% endfor %}
      </div>
      {% if uc.link %}<a class="uc-link" href="{{ uc.link }}" target="_blank" rel="noreferrer" aria-label="View publication for {{ uc.title }}">↗</a>{% endif %}
    </div>
    <h3 class="uc-title">{{ uc.title }}</h3>
    <p class="uc-venue">{{ uc.venue }}</p>
    <p class="uc-outcome">{{ uc.outcome }}</p>
    <details class="uc-details">
      <summary>Read more</summary>
      <p class="uc-desc">{{ uc.description }}</p>
      <p class="uc-impact"><strong>Impact:</strong> {{ uc.impact }}</p>
    </details>
  </article>
  {% endfor %}
</div>

<style>
  .page-title { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 700; margin: 0.2rem 0 0.5rem; line-height: 1.1; }
  .page-subtitle { font-size: 1.05rem; color: var(--muted); margin-bottom: 2rem; }

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

  .uc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.25rem;
  }

  .uc-card {
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: border-color 0.2s;
  }
  .uc-card:hover { border-color: var(--border-ui); }
  .uc-card[hidden] { display: none; }

  .uc-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .uc-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .uc-tag {
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.15rem 0.45rem;
    border-radius: 3px;
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: var(--accent);
  }
  .uc-link {
    flex-shrink: 0;
    font-size: 1rem;
    color: var(--muted);
    text-decoration: none;
    line-height: 1;
    padding: 0.2rem 0.3rem;
    border-radius: 4px;
    transition: color 0.15s;
  }
  .uc-link:hover { color: var(--accent); }

  .uc-title { font-size: 1rem; font-weight: 600; margin: 0.2rem 0 0; line-height: 1.35; }
  .uc-venue { font-size: 0.8rem; color: var(--accent); margin: 0; font-weight: 500; }
  .uc-outcome { font-size: 0.88rem; color: var(--muted); margin: 0.3rem 0 0; line-height: 1.55; }

  .uc-details { margin-top: 0.5rem; }
  .uc-details summary {
    font-size: 0.8rem;
    color: var(--muted);
    cursor: pointer;
    user-select: none;
    list-style: none;
    padding: 0.3rem 0;
    border-top: 1px solid var(--line);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: color 0.15s;
  }
  .uc-details summary::-webkit-details-marker { display: none; }
  .uc-details summary::before { content: '+'; font-size: 0.9rem; }
  .uc-details[open] summary::before { content: '−'; }
  .uc-details summary:hover { color: var(--text); }
  .uc-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.6; margin: 0.75rem 0 0.5rem; }
  .uc-impact { font-size: 0.85rem; color: var(--muted); line-height: 1.55; margin: 0; padding: 0.6rem 0.8rem; background: var(--surface); border-left: 2px solid var(--accent); border-radius: 0 4px 4px 0; }
  .uc-impact strong { color: var(--text); }

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
