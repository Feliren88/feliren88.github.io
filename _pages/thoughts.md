---
layout: page
title: Writings
description: Articles on trustworthy AI, conformal prediction, multimodal systems, Southeast Asian AI, and personal reflections, published on Medium.
permalink: /writings/
layout-class: page writings-page
---

<div class="essay-feature-block">
<a class="essay-feature" href="/story/">
<span class="essay-feature-label">Visual story</span>
<span class="essay-feature-title">A Method for What Breaks</span>
<span class="essay-feature-desc">A life built through difficult systems, the trap of becoming useful, and the long work of deciding what deserves carrying.</span>
<span class="read-more">Enter the story →</span>
</a>
<a class="essay-feature" href="/essays/knowing-when-you-dont-know/">
<span class="essay-feature-label">Essay</span>
<span class="essay-feature-title">Knowing when you don't know is the core safety property</span>
<span class="essay-feature-desc">Why safe deployment depends on models knowing when to abstain.</span>
<span class="read-more">Read the essay →</span>
</a>
<a class="essay-feature" href="/high-agency/">
<span class="essay-feature-label">Interactive note</span>
<span class="essay-feature-title">High Agency</span>
<span class="essay-feature-desc">My notes on George Mack's essay, rebuilt as diagrams you can poke at. Diagnose your own three wheels, walk the flow chart, play the trap game.</span>
<span class="read-more">Open the note →</span>
</a>
<a class="essay-feature" href="/principles/">
<span class="essay-feature-label">Interactive note</span>
<span class="essay-feature-title">The Life Operating Principle</span>
<span class="essay-feature-desc">A personal operating manual for decisions under pressure. Search by how you feel, set the reversibility dial, run the six questions.</span>
<span class="read-more">Open the note →</span>
</a>
<a class="essay-feature" href="/stoic/">
<span class="essay-feature-label">Interactive note</span>
<span class="essay-feature-title">Stoic</span>
<span class="essay-feature-desc">Marcus Aurelius and Epictetus as a working manual. Sort what is actually up to you, and search the passages by the state you are in.</span>
<span class="read-more">Open the note →</span>
</a>
<a class="essay-feature" href="/game-theory/">
<span class="essay-feature-label">Interactive note</span>
<span class="essay-feature-title">Game Theory of Life</span>
<span class="essay-feature-desc">Most decisions are not solo problems. Solve eight payoff matrices, watch cooperation become rational as the horizon lengthens, and run a ruin simulation.</span>
<span class="read-more">Open the note →</span>
</a>
<a class="essay-feature" href="/success-failure/">
<span class="essay-feature-label">Interactive note</span>
<span class="essay-feature-title">Success &amp; Failure</span>
<span class="essay-feature-desc">How to diagnose a result, scale what repeats, recover without escalating, and choose the next move without turning the outcome into identity.</span>
<span class="read-more">Open the manual →</span>
</a>
<a class="essay-feature" href="/uncertainty-and-emotions/">
<span class="essay-feature-label">Interactive manual</span>
<span class="essay-feature-title">The Uncertainty Operating System</span>
<span class="essay-feature-desc">How to spot the certainty trap, manage an intense state, decide under doubt, and keep moving while an answer remains unavailable.</span>
<span class="read-more">Open the manual →</span>
</a>
</div>

<div class="writings-divider"></div>

{% if site.data.notes %}
<div class="notes-section">
  <p class="t-eyebrow" style="margin-bottom:0.5rem">Research Notes</p>
  <p class="section-note" style="margin-top:0">Short notes on what research papers show, where their limits lie, and why those limits matter.</p>
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
  <button class="filter-pill is-active" data-filter="all">All</button>
  <button class="filter-pill" data-filter="Research">Research</button>
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

  /* ── Featured Essay ──────────────────────────────────── */
  .essay-feature-block {
    counter-reset: feature;
    position: relative;
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-auto-flow: dense;
    grid-auto-rows: minmax(11rem, auto);
    gap: clamp(0.65rem, 1.2vw, 1rem);
    width: min(92rem, calc(100vw - 2rem));
    margin-inline: 50%;
    transform: translateX(-50%);
    padding: clamp(0.4rem, 1.5vw, 1.1rem);
  }
  .essay-feature {
    counter-increment: feature;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-width: 0;
    min-height: 14rem;
    text-decoration: none;
    padding: clamp(1.15rem, 2.4vw, 2rem);
    border: 1px solid var(--line);
    border-radius: clamp(0.8rem, 1.4vw, 1.3rem);
    background:
      radial-gradient(circle at 88% 12%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 34%),
      var(--surface);
    overflow: hidden;
    isolation: isolate;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .essay-feature::before {
    content: counter(feature, decimal-leading-zero);
    position: absolute;
    z-index: -1;
    top: -0.12em;
    right: 0.08em;
    color: color-mix(in srgb, var(--accent) 9%, transparent);
    font: 600 clamp(5rem, 10vw, 10rem)/1 "Space Grotesk", sans-serif;
    letter-spacing: -0.08em;
    pointer-events: none;
  }
  .essay-feature::after {
    content: "";
    position: absolute;
    z-index: -1;
    inset: auto 1.5rem 1.2rem auto;
    width: 2.2rem;
    height: 1px;
    background: var(--accent);
    transform-origin: right;
    transition: width 0.25s ease;
  }
  .essay-feature:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 14px 32px color-mix(in srgb, #000 22%, transparent); }
  .essay-feature:hover::after { width: 4.5rem; }
  .essay-feature:nth-child(1) { grid-column: span 8; grid-row: span 2; min-height: 30rem; background: linear-gradient(145deg, #101723, #182637 58%, #2c2928); }
  .essay-feature:nth-child(1) .essay-feature-title { max-width: 10ch; color: #f2eee6; font-size: clamp(2.4rem, 5vw, 5.2rem); line-height: 0.94; letter-spacing: -0.055em; }
  .essay-feature:nth-child(1) .essay-feature-desc { max-width: 42rem; color: #b9c0c8; font-size: 1rem; }
  .essay-feature:nth-child(1) .essay-feature-label,.essay-feature:nth-child(1) .read-more { color: #d6a642; }
  .essay-feature:nth-child(2) { grid-column: span 4; grid-row: span 2; min-height: 30rem; background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 14%, var(--surface)), var(--surface)); }
  .essay-feature:nth-child(2) .essay-feature-title { font-size: clamp(1.65rem, 2.8vw, 2.7rem); }
  .essay-feature:nth-child(3), .essay-feature:nth-child(4) { grid-column: span 6; min-height: 19rem; }
  .essay-feature:nth-child(5) { grid-column: span 4; min-height: 22rem; }
  .essay-feature:nth-child(6) { grid-column: span 8; min-height: 22rem; background: linear-gradient(115deg, color-mix(in srgb, var(--accent) 7%, var(--surface)), var(--surface) 58%); }
  .essay-feature:nth-child(7), .essay-feature:nth-child(8) { grid-column: span 6; min-height: 19rem; }
  .essay-feature:nth-child(3n+4) { background: linear-gradient(155deg, color-mix(in srgb, var(--cta) 8%, var(--surface)), var(--surface)); }
  .essay-feature-label {
    display: block;
    font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 0.4rem;
  }
  .essay-feature-title { display: block; max-width: 18ch; font-family: "Space Grotesk", var(--font-display, sans-serif); font-size: clamp(1.35rem, 2.3vw, 2.15rem); font-weight: 650; line-height: 1.08; letter-spacing: -0.035em; color: var(--text); margin-bottom: 0.65rem; }
  .essay-feature-desc { display: block; max-width: 58ch; color: var(--muted); font-size: 0.92rem; line-height: 1.62; }
  .essay-feature .read-more { display: inline-block; width: max-content; margin-top: 1rem; color: var(--accent); font-size: 0.76rem; font-weight: 700; }

  @media (max-width: 900px) {
    .essay-feature-block { grid-template-columns: repeat(2, minmax(0, 1fr)); width: min(100%, calc(100vw - 1.5rem)); padding: 0; }
    .essay-feature:nth-child(n) { grid-column: span 1; grid-row: span 1; min-height: 18rem; }
    .essay-feature:nth-child(1) { grid-column: 1 / -1; min-height: 25rem; }
    .essay-feature:nth-child(1) .essay-feature-title { font-size: clamp(2.6rem, 8vw, 4.4rem); }
  }
  @media (max-width: 580px) {
    .essay-feature-block { grid-template-columns: 1fr; width: 100%; transform: none; margin-inline: 0; }
    .essay-feature:nth-child(n) { grid-column: 1; min-height: 15rem; }
    .essay-feature:nth-child(1) { min-height: 23rem; }
  }

  /* ── Research Notes ──────────────────────────────────── */
  .notes-section { margin-bottom: 0.5rem; }
  .notes-list { display: grid; gap: 1rem; margin-top: 1rem; }
  .note-item {
    padding: var(--card-pad-sm);
    border: 1px solid var(--line);
    border-radius: 8px;
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
    max-width: 75ch;
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
