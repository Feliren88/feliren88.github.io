---
layout: page
title: Vicky Feliren
subtitle: Applied Scientist · Sequential decision making under uncertainty
description: Vicky Feliren's research direction is sequential decision making under uncertainty. He studies when agents should act, defer, or gather more evidence as conditions change.
permalink: /
redirect_from:
  - /about/
extra_css: /css/about.css
extra_js: /js/components/about-decisions.js
hide_title: true
motion_scene: record
---
<article class="about-story">
  <header class="about-story-hero">
    <div class="about-story-copy">
      <h1>When should an agent <em>ask for help?</em></h1>
      <p class="about-story-lead">I’m Vicky Feliren, an applied scientist interested in decisions under uncertainty. I study when an agent should act, gather more evidence, or ask for help.</p>
      <div class="about-story-actions">
        <a class="btn btn-primary" href="/research/">Read the research</a>
        <a class="about-text-link" href="/cv/">View the CV <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <figure class="about-portrait">
      <div class="about-portrait-frame">
        <picture>
          <source type="image/webp" srcset="/assets/img/profile-450.webp 450w, /assets/img/profile.webp 880w" sizes="(max-width: 760px) 55vw, 390px">
          <img src="/assets/img/profile.webp" alt="Vicky Feliren" width="880" height="880" fetchpriority="high">
        </picture>
      </div>
      <figcaption>Vicky Feliren</figcaption>
    </figure>
  </header>

  {% if site.data.about.stats %}
  <div id="stat-strip" class="stat-strip reveal-group" role="list" aria-label="Research and work record">
    {% for stat in site.data.about.stats %}
    <div class="stat-item reveal" role="listitem">
      <span class="stat-value">{% if stat.count == 'publications' %}{{ site.data.publications | size }}{% else %}{{ stat.value }}{% endif %}</span>
      <span class="stat-label">{{ stat.label }}</span>
      <span class="stat-detail">{{ stat.detail }}</span>
    </div>
    {% endfor %}
  </div>
  {% endif %}

  <!-- The record slideshow introduces the background below. -->
  <div data-scene-slot></div>

  <section class="about-overview-section" id="background" aria-labelledby="about-background-title">
    <header><h2 id="about-background-title">Background</h2></header>
    <div class="about-overview-copy">
      <p>At Jakarta Smart City, I forecast municipal waste. Later, at GDP Labs, I built banking models. At Monash, I studied flood and mining maps from satellite images. Alongside this work, I help build Southeast Asian datasets with SEACrowd.</p>
      <p>These settings shaped my interest in how uncertainty should influence a decision.</p>
      <a class="about-inline-cta" href="/cv/">View the full CV <span aria-hidden="true">→</span></a>
    </div>
  </section>

  <section class="about-overview-section about-research" id="research-interests" aria-labelledby="about-research-title">
    <header><h2 id="about-research-title">Research interests</h2></header>
    <div class="about-research-content">
      <div class="about-overview-copy">
        <p>Each choice an agent makes changes what it encounters next. Therefore, I want to study whether uncertainty estimates remain reliable across a whole task.</p>
        <p>I’m interested in how changes in inputs, models, and error costs affect these decisions. I also want to test whether internal model signals help identify when an answer needs review.</p>
        <a class="about-inline-cta" href="/research/">See my work and next questions <span aria-hidden="true">→</span></a>
      </div>

      <figure class="about-decision-example" data-about-decisions aria-labelledby="about-example-title">
        <figcaption>
          <h3 id="about-example-title">Each choice changes the next decision.</h3>
          <p>A navigation agent reaches an unfamiliar junction.</p>
        </figcaption>
        <svg class="about-decision-diagram about-decision-diagram--wide" viewBox="0 0 760 245" role="img" aria-labelledby="about-diagram-title about-diagram-desc">
          <title id="about-diagram-title">Evidence and decisions form a sequence</title>
          <desc id="about-diagram-desc">Available evidence informs the next step. That step changes later evidence, which informs the next decision.</desc>
          <defs><marker id="about-arrow-wide" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
          <g class="about-diagram-nodes">
            <rect x="20" y="35" width="205" height="76" rx="5" />
            <rect x="280" y="35" width="190" height="76" rx="5" />
            <rect x="525" y="35" width="215" height="76" rx="5" />
          </g>
          <g class="about-diagram-labels" text-anchor="middle">
            <text x="122" y="78">Available evidence</text>
            <text x="375" y="78">Choose the next step</text>
            <text x="632" y="78" data-about-next>Later evidence</text>
          </g>
          <g class="about-diagram-arrows" marker-end="url(#about-arrow-wide)">
            <path d="M 230 73 H 271" />
            <path d="M 475 73 H 516" />
            <path class="about-diagram-feedback" d="M 632 119 V 178 H 122 V 119" />
          </g>
          <text class="about-diagram-note" x="380" y="222" text-anchor="middle">Later evidence informs the next decision.</text>
        </svg>
        <svg class="about-decision-diagram about-decision-diagram--narrow" viewBox="0 0 320 295" role="img" aria-labelledby="about-diagram-mobile-title about-diagram-mobile-desc">
          <title id="about-diagram-mobile-title">Evidence and decisions form a sequence</title>
          <desc id="about-diagram-mobile-desc">Available evidence informs the next step. That step changes later evidence, which informs the next decision.</desc>
          <defs><marker id="about-arrow-narrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
          <g class="about-diagram-nodes">
            <rect x="25" y="10" width="245" height="62" rx="5" />
            <rect x="25" y="110" width="245" height="62" rx="5" />
            <rect x="25" y="210" width="245" height="62" rx="5" />
          </g>
          <g class="about-diagram-labels" text-anchor="middle">
            <text x="147" y="47">Available evidence</text>
            <text x="147" y="147">Choose the next step</text>
            <text x="147" y="247" data-about-next>Later evidence</text>
          </g>
          <g class="about-diagram-arrows" marker-end="url(#about-arrow-narrow)">
            <path d="M 147 78 V 101" />
            <path d="M 147 178 V 201" />
            <path class="about-diagram-feedback" d="M 276 241 H 306 V 41 H 279" />
          </g>
        </svg>
        <div class="about-decision-controls" data-about-controls hidden>
          <p id="about-choice-instruction">Choose the agent’s next step.</p>
          <div class="about-decision-buttons" role="group" aria-labelledby="about-choice-instruction">
            <button type="button" data-about-choice="act" aria-pressed="false" aria-controls="about-decision-outcomes">Act</button>
            <button type="button" data-about-choice="gather" aria-pressed="false" aria-controls="about-decision-outcomes">Gather evidence</button>
            <button type="button" data-about-choice="help" aria-pressed="false" aria-controls="about-decision-outcomes">Ask for help</button>
          </div>
        </div>
        <div id="about-decision-outcomes" data-about-outcomes aria-live="polite" aria-atomic="true">
          <ul class="about-decision-outcomes">
            <li data-about-outcome="act" data-next-label="The corridor ahead"><strong>Act</strong><p>The agent enters a corridor. Its next decision depends on what it sees there.</p></li>
            <li data-about-outcome="gather" data-next-label="More observations"><strong>Gather evidence</strong><p>The agent inspects its surroundings. It gains more observations before choosing a corridor.</p></li>
            <li data-about-outcome="help" data-next-label="Additional guidance"><strong>Ask for help</strong><p>The agent pauses for guidance. Its next decision uses the additional instruction.</p></li>
          </ul>
        </div>
      </figure>
    </div>
  </section>
</article>

<div class="home-tail">

  {% if site.data.now %}
  <div id="now-block" class="about-section now-block">
    <h2>Recent work <span class="now-updated">· Updated {{ site.data.now.last_updated }}</span></h2>
    <ul class="now-list">
      {% for item in site.data.now.items %}
      <li>{{ item }}</li>
      {% endfor %}
    </ul>
  </div>
  {% endif %}

  <section class="section insights-section reveal">
    <div class="insights-hd">
      <h2>Insights</h2>
      <a href="/writings/" class="insights-view-all">View all writings →</a>
    </div>
    <p class="section-note">I write about how uncertainty estimates support decisions and when their assumptions fail. For example, the essay below asks when a model should withhold an answer.</p>

    <a class="insight-essay reveal" href="/essays/knowing-when-you-dont-know/">
      <h3>Knowing when you don't know is the core safety property</h3>
      <p>When an agent should stop, gather evidence, or hand a decision back to a person.</p>
      <span class="insight-read">Read the essay →</span>
    </a>

    {% assign feature = site.data.features | first %}
    {% if feature %}
    {% assign feat_src = feature.sources | where: "publication", "The Business Times" | first | default: feature.sources.first %}
    <a class="insight-feature reveal" href="{{ feat_src.url }}" target="_blank" rel="noreferrer">
      {% if feature.image %}<img class="insight-feature-img" src="{{ feature.image }}" alt="" loading="lazy" width="640" height="360">{% endif %}
      <div class="insight-feature-body">
        <span class="insight-feature-badge">Featured in {{ feat_src.publication }}</span>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
        <span class="insight-read">Read in {{ feat_src.publication }} →</span>
      </div>
    </a>
    {% endif %}
    <div class="insights-grid reveal-group">
      {% for thought in site.data.thoughts limit:3 %}
      <a class="insight-card reveal{% if thought.image %} insight-card--has-img{% endif %}" href="{{ thought.url }}" target="_blank" rel="noreferrer">
        {% if thought.image %}<img class="card-cover" src="{{ thought.image }}" alt="" loading="lazy" width="640" height="360">{% endif %}
        <div class="insight-card-body">
          <h3>{{ thought.title }}</h3>
          <p>{{ thought.description }}</p>
          <span class="insight-read">Read on Medium →</span>
        </div>
      </a>
      {% endfor %}
    </div>
  </section>

  <section class="section collab-section reveal">
    <h2 class="collab-heading">Contact</h2>
    <p class="collab-sub">{{ site.data.contact.intro_sub }}</p>
    <div class="collab-tags">
      {% for eng in site.data.contact.engagements %}
      <span class="collab-tag">{{ eng.type }}</span>
      {% endfor %}
    </div>
    <a href="/contact/" class="btn btn-primary collab-cta">Get in touch →</a>
  </section>

</div>
