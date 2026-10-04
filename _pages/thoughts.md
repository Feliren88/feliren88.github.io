---
layout: page
title: Writings
description: Vicky Feliren writes about decisions under uncertainty, model evaluation, and production ML. This page also collects field guides, press coverage, and personal essays.
permalink: /writings/
layout-class: page writings-page
---

<nav class="writings-index" aria-label="On this page">
  <a href="#essays">Essays</a>
  <a href="#field-guides">Field guides</a>
  <a href="#press-coverage">Coverage</a>
  <a href="#medium-articles">Medium articles</a>
</nav>

<section class="writings-lead" id="essays" aria-labelledby="writings-essays-title">
  <h2 id="writings-essays-title">Essays</h2>
  <p class="section-note">My research direction is sequential decision making under uncertainty. I write about when models should act or ask for help. Then I examine how those choices affect what follows.</p>
  <div class="essay-feature-block">
<a class="essay-feature" href="/essays/knowing-when-you-dont-know/">
<span class="essay-feature-title">Knowing when you don't know is the core safety property</span>
<span class="essay-feature-desc">When uncertainty warrants declining an answer or handing a decision back to a person.</span>
<span class="read-more">Read the essay →</span>
</a>
<a class="essay-feature" href="/story/">
<span class="essay-feature-title">A Method for What Breaks</span>
<span class="essay-feature-desc">On becoming useful to others, and learning where that responsibility should end.</span>
<span class="read-more">Enter the story →</span>
</a>
  </div>
</section>

<section class="writings-guides" id="field-guides" aria-labelledby="writings-guides-title">
  <h2 id="writings-guides-title">Field guides and personal notes</h2>
  <p class="section-note">Longer pieces on decisions, relationships, and the habits I keep testing in my own life.</p>
  <div class="writings-guides-grid">
<a class="essay-feature" href="/taufiq/">
<span class="essay-feature-title">Taufiq</span>
<span class="essay-feature-desc">Lessons from a mentor on fundamental research, depth before breadth, research taste, and leadership. Includes visual notes, working questions, and related research lives.</span>
<span class="read-more">Open the field note →</span>
</a>
<a class="essay-feature" href="/metacognition/">
<span class="essay-feature-title">Metacognition</span>
<span class="essay-feature-desc">Check what you understand when you use AI. Then practise judging your confidence, checking answers, and choosing which tasks to do yourself.</span>
<span class="read-more">Open the field guide →</span>
</a>
<a class="essay-feature" href="/high-agency/">
<span class="essay-feature-title">High Agency</span>
<span class="essay-feature-desc">A visual reading of George Mack’s essay, with exercises for examining agency in your own decisions.</span>
<span class="read-more">Open the note →</span>
</a>
<a class="essay-feature" href="/principles/">
<span class="essay-feature-title">The Life Operating Principle</span>
<span class="essay-feature-desc">A personal manual for decisions under pressure, including a test of whether the choice can be reversed.</span>
<span class="read-more">Open the note →</span>
</a>
<a class="essay-feature" href="/curious/">
<span class="essay-feature-title">Stay Curious</span>
<span class="essay-feature-desc">Notice what does not fit, test the explanation, and update when the evidence earns it. Keep one live question without turning research into avoidance.</span>
<span class="read-more">Open the field guide →</span>
</a>
<a class="essay-feature" href="/stoic/">
<span class="essay-feature-title">Stoic</span>
<span class="essay-feature-desc">Marcus Aurelius and Epictetus as a working manual. Sort what is actually up to you, and search the passages by the state you are in.</span>
<span class="read-more">Open the note →</span>
</a>
<a class="essay-feature" href="/game-theory/">
<span class="essay-feature-title">Game Theory of Life</span>
<span class="essay-feature-desc">Most decisions are not solo problems. Solve eight payoff matrices, watch cooperation become rational as the horizon lengthens, and run a ruin simulation.</span>
<span class="read-more">Open the note →</span>
</a>
<a class="essay-feature" href="/read-people/">
<span class="essay-feature-title">How to Read People</span>
<span class="essay-feature-desc">Observe change, build three plausible explanations, and test what each one predicts. Read behaviour without pretending you can read minds.</span>
<span class="read-more">Open the field manual →</span>
</a>
<a class="essay-feature" href="/success-failure/">
<span class="essay-feature-title">Success &amp; Failure</span>
<span class="essay-feature-desc">How to diagnose a result, scale what repeats, recover without escalating, and choose the next move without turning the outcome into identity.</span>
<span class="read-more">Open the manual →</span>
</a>
<a class="essay-feature" href="/uncertainty-and-emotions/">
<span class="essay-feature-title">The Uncertainty Operating System</span>
<span class="essay-feature-desc">How to spot the certainty trap, manage an intense state, decide under doubt, and keep moving while an answer remains unavailable.</span>
<span class="read-more">Open the manual →</span>
</a>
<a class="essay-feature" href="/life-challenges/">
<span class="essay-feature-title">The Silver Lining of a Difficult Life</span>
<span class="essay-feature-desc">An examination of when difficulty develops capacity, when it only causes harm, and how to tell the difference.</span>
<span class="read-more">Enter the field guide →</span>
</a>
<a class="essay-feature" href="/small-talk/">
<span class="essay-feature-title">Small Talk as Calibration</span>
<span class="essay-feature-desc">A practical guide to beginning conversations, reading the room, and moving toward depth without forcing it.</span>
<span class="read-more">Open the manual →</span>
</a>
<a class="essay-feature" href="/communication/">
<span class="essay-feature-title">Communication 101</span>
<span class="essay-feature-desc">Nine visual exercises on making an explanation clear and noticing where a conversation has gone astray.</span>
<span class="read-more">Open the manual →</span>
</a>
<a class="essay-feature" href="/self-love/">
<span class="essay-feature-title">Self-Love as Risk Control</span>
<span class="essay-feature-desc">On the costs of being capable, and the choices that protect a life beyond achievement.</span>
<span class="read-more">Open the visual essay →</span>
</a>
  </div>
</section>

<div class="writings-divider"></div>

{% if site.data.features %}
<section class="features-section" id="press-coverage">
  <h2>Press coverage</h2>
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
</section>
{% endif %}

<div class="writings-divider"></div>

<h2 class="section-title" id="medium-articles">Medium articles
  <a href="https://medium.com/@feliren" target="_blank" rel="noreferrer" style="text-decoration:none">
    <img src="/assets/img/medium-svgrepo-com.webp" alt="Medium" style="width:24px;height:24px;vertical-align:middle;margin-right:0.3rem" loading="lazy">
    <span class="medium-badge" style="margin-left:0">@feliren</span>
  </a>
</h2>
<p class="section-note">Published pieces on research, engineering, and personal experience.</p>

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
  .writings-index {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1.25rem;
    margin: 0 0 2rem;
    padding: 0.9rem 0;
    border-block: 1px solid var(--line);
  }
  .writings-index a { color: var(--muted); font-size: 0.82rem; text-decoration: none; }
  .writings-index a:hover, .writings-index a:focus-visible { color: var(--accent); text-decoration: underline; }
  .writings-page section[id], .writings-page h2[id] { scroll-margin-top: 6rem; }
  .writings-lead { margin-bottom: 2rem; }
  .writings-guides-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem 2rem; margin-top: 1rem; }
  .writings-guides-grid .essay-feature { padding: 1.4rem 0; }
  .writings-guides-grid .essay-feature-title { font-size: clamp(1.3rem, 1.8vw, 1.65rem); }
  /* ── Featured In ─────────────────────────────────────── */
  .features-section { margin-bottom: 0.5rem; }
  .features-grid { display: grid; gap: 1rem; }
  .feature-card {
    display: block;
    text-decoration: none;
    padding: var(--card-pad-lg);
    border: 1px solid var(--border-ui);
    border-radius: var(--radius-sm);
    background: var(--surface);
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
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
    margin: 1rem 0 2rem;
  }
  .essay-feature {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    padding: 1.5rem 0;
    border-top: 1px solid var(--line);
    color: var(--text);
    text-decoration: none;
  }
  .essay-feature:hover .essay-feature-title {
    text-decoration: underline;
    text-decoration-color: var(--accent);
    text-underline-offset: .18em;
  }
  .essay-feature-title {
    display: block;
    max-width: 28ch;
    margin-bottom: .75rem;
    font-family: "Space Grotesk", sans-serif;
    font-size: clamp(1.35rem, 2.5vw, 2rem);
    font-weight: 650;
    line-height: 1.3;
    letter-spacing: -.025em;
    color: var(--text);
  }
  .essay-feature-desc { display: block; max-width: 58ch; color: var(--muted); font-size: 1rem; line-height: 1.7; }
  .essay-feature .read-more { display: inline-block; margin-top: 1rem; color: var(--accent); font-size: var(--fs-sm); font-weight: 650; }
  @media (max-width: 680px) {
    .essay-feature-block, .writings-guides-grid { grid-template-columns: 1fr; gap: 0; }
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
