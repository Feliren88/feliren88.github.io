---
layout: page
title: Vicky Feliren
subtitle: Applied Scientist · Sequential decision making under uncertainty
description: Vicky Feliren's research direction is sequential decision making under uncertainty. He studies when agents should act, defer, or gather more evidence as conditions change.
permalink: /
redirect_from:
  - /about/
extra_css: /css/about.css
hide_title: true
motion_scene: record
---
<article class="about-story">
  <header class="about-story-hero">
    <div class="about-story-copy">
      <h1>When does a model’s uncertainty <em>remain valid?</em></h1>
      <p class="about-story-lead">I’m Vicky Feliren. I study how agents make a sequence of decisions with incomplete evidence. Each choice changes what the agent encounters next. Therefore, I ask when it should act, wait, or seek help. My work in navigation, multilingual evaluation, and deployed machine learning informs these questions.</p>
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

  <!-- The record slideshow sits above the sticky section navigation. -->
  <div data-scene-slot></div>

  <nav class="about-story-nav" aria-label="On this page">
    <span>About</span>
    <a href="#question">Question</a>
    <a href="#path">Experience</a>
    <a href="#method">Research agenda</a>
    <a href="#direction">Open question</a>
  </nav>

  <section class="about-chapter" id="question">
    <div class="about-chapter-index"><span>01</span><p>The question</p></div>
    <div class="about-chapter-body">
      <h2>A reliability claim needs clear conditions.</h2>
      <div class="about-prose-columns">
        <p>A navigation agent can make a confident wrong turn. Moreover, a rule tested on individual steps may fail across a whole route. My ENCP method sets its threshold using complete routes. Its guarantee concerns whether proposed action sets contain the correct action throughout a route. However, the guarantee depends on how calibration and test routes are sampled. Therefore, a new environment requires checking that assumption again.</p>
        <p>I also study models that receive images and conflicting text. In these tests, an internal signal reveals which source the model follows. Meanwhile, my security detector can exceed its false-alarm target when harmless input formats change. Together, these findings motivate a broader question. Which uncertainty claims survive changes in models and data?</p>
      </div>
      <div class="about-equation" role="img" aria-label="Research question connecting an uncertainty estimate, its validity conditions, and a decision">
        <span>Uncertainty estimate</span><i>→</i><span>Validity conditions</span><i>→</i><strong>Decision</strong>
      </div>
    </div>
  </section>

  <section class="about-chapter" id="path">
    <div class="about-chapter-index"><span>02</span><p>The path</p></div>
    <div class="about-chapter-body">
      <h2>Decisions in practice shaped my research question.</h2>
      <div class="about-path" role="list">
        <article role="listitem"><time>2021</time><div><h3>Jakarta Smart City</h3><p>I forecast municipal waste to help plan city resources. Therefore, I judged the model by the decisions it could inform.</p></div></article>
        <article role="listitem"><time>2021–23</time><div><h3>Banking systems</h3><p>I built biometric, credit, and fraud models for Indonesian banks. In that work, I had to consider what each error would cost.</p></div></article>
        <article role="listitem"><time>2022–25</time><div><h3>Earth observation</h3><p>At Monash, I studied flood and mining maps from satellite images. In those studies, different sensors and regions exposed each model’s limits.</p></div></article>
        <article role="listitem"><time>2024–present</time><div><h3>SEACrowd</h3><p>I help build datasets and benchmarks for Southeast Asian languages and images. Through this work, I contributed to SEA-VL, published at ACL 2025.</p></div></article>
        <article role="listitem" class="is-current"><time>2026</time><div><h3>Navigation and uncertainty</h3><p>I proposed my Monash thesis on reliability guarantees across entire navigation routes. The resulting preprint covers proposed action sets throughout a route. However, that guarantee requires stated assumptions about calibration and test routes.</p></div></article>
      </div>
      <a class="about-inline-cta" href="/cv/">Read the full CV <span aria-hidden="true">→</span></a>
    </div>
  </section>

  <section class="about-chapter" id="method">
    <div class="about-chapter-index"><span>03</span><p>The agenda</p></div>
    <div class="about-chapter-body">
      <h2>I study when uncertainty estimates remain reliable.</h2>
      <div class="about-method-grid">
        <article><span>01</span><h3>What can a guarantee cover?</h3><p>My navigation work sets thresholds using whole routes, allowing steps to depend on each other. However, the guarantee requires exchangeability. This means reordering calibration and test routes must leave their probabilities unchanged.</p></article>
        <article><span>02</span><h3>Which guarantees survive change?</h3><p>A threshold can meet its overall target yet fail when inputs change. Therefore, I want to identify which assumptions matter for each language, task, or input format.</p></article>
        <article><span>03</span><h3>Can internal evidence help?</h3><p>In Telugu tests, an internal classifier identified whether a model followed the image or caption. Its accuracy was 0.92. Building on that result, I want to test whether the signal predicts errors after model changes.</p></article>
        <article><span>04</span><h3>When should a model defer?</h3><p>A model can act, withhold an answer, or ask for review. Therefore, I want decision rules that account for the costs of errors and review.</p></article>
      </div>
    </div>
  </section>

  <section class="about-chapter" id="direction">
    <div class="about-chapter-index"><span>04</span><p>The open question</p></div>
    <div class="about-chapter-body">
      <h2>Can a decision rule stay reliable after the agent changes its course?</h2>
      <div class="about-direction-panel">
        <div>
          <span class="about-status"><i></i> An open hypothesis</span>
          <p>An agent changes what it sees next when it acts or asks for help. Therefore, I want to test whether its decision rule stays reliable across that sequence. Further tests could change the model through training, including training for safer behaviour.</p>
        </div>
        <dl>
          <div><dt>Evidence so far</dt><dd><a href="/encp-vln/">ENCP</a> sets thresholds using complete routes under stated assumptions about calibration and test routes.</dd></div>
          <div><dt>Working hypothesis</dt><dd>A change in when the agent asks for help may require a new calibration rule.</dd></div>
          <div><dt>What would change the view</dt><dd>Evidence that the existing rule still meets its target across the changed routes.</dd></div>
        </dl>
      </div>
      <div class="about-closing">
        <p>For the evidence behind these questions, see my published work and preprint on the research page.</p>
        <div><a class="btn btn-primary" href="/research/">Read the research</a><a class="btn btn-secondary" href="/contact/">Contact me</a></div>
      </div>
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
