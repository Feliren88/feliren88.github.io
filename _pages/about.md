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
      <p class="about-story-lead">I’m Vicky Feliren. My research direction is sequential decision making under uncertainty. Each choice an agent makes changes what it encounters next. So I study when uncertainty estimates support decisions across that sequence and under changing conditions. My work in navigation, multilingual evaluation, and production ML provides starting points.</p>
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
      <span class="stat-value">{{ stat.value }}</span>
      <span class="stat-label">{{ stat.label }}</span>
      <span class="stat-detail">{{ stat.detail }}</span>
    </div>
    {% endfor %}
  </div>
  {% endif %}

  <!-- essay-motion.js replaces this with the record scene. It sits above the sticky
       nav on purpose: the nav would otherwise stay pinned across the whole
       interlude. See the [data-scene-slot] note in js/components/essay-motion.js. -->
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
      <h2>A reliability claim has to name the conditions it covers.</h2>
      <div class="about-prose-columns">
        <p>In navigation, a threshold calibrated on single steps cannot promise coverage for a whole route. My ENCP work calibrates complete episodes and states the assumption its guarantee needs. When the test environment differs from calibration, that assumption needs to be examined again.</p>
        <p>I have seen the same problem in multilingual image tasks and prompt-injection detection. A probe can identify whether a model followed an image or a conflicting caption, while a detector can miss its false-alarm target on a harmless input format absent from calibration. These findings motivate a general question about which uncertainty claims survive changes in models and data.</p>
      </div>
      <div class="about-equation" role="img" aria-label="Research question connecting an uncertainty estimate, its validity conditions, and a decision">
        <span>Uncertainty estimate</span><i>→</i><span>Validity conditions</span><i>→</i><strong>Decision</strong>
      </div>
    </div>
  </section>

  <section class="about-chapter" id="path">
    <div class="about-chapter-index"><span>02</span><p>The path</p></div>
    <div class="about-chapter-body">
      <h2>Work on consequential decisions brought me to this question.</h2>
      <div class="about-path" role="list">
        <article role="listitem"><time>2021</time><div><h3>Jakarta Smart City</h3><p>I forecast municipal waste to help plan city resources. A useful model had to inform an actual decision.</p></div></article>
        <article role="listitem"><time>2021–23</time><div><h3>Banking systems</h3><p>I built biometric, credit, and fraud models for Indonesian banks. Their errors carried costs that an evaluation score alone could not explain.</p></div></article>
        <article role="listitem"><time>2022–25</time><div><h3>Earth observation</h3><p>At Monash, I studied flood and mining maps from satellite images. Different sensors and regions made each model’s limits visible.</p></div></article>
        <article role="listitem"><time>2024–present</time><div><h3>SEACrowd</h3><p>I help build datasets and benchmarks for Southeast Asian languages and images. SEA-VL was published at ACL 2025.</p></div></article>
        <article role="listitem" class="is-current"><time>2026</time><div><h3>Navigation and uncertainty</h3><p>I proposed my Monash thesis to study how an agent can carry a reliability guarantee across an entire route. The resulting preprint gives a coverage guarantee for proposed actions under stated assumptions about the routes used for calibration and testing.</p></div></article>
      </div>
      <a class="about-inline-cta" href="/cv/">Read the full CV <span aria-hidden="true">→</span></a>
    </div>
  </section>

  <section class="about-chapter" id="method">
    <div class="about-chapter-index"><span>03</span><p>The agenda</p></div>
    <div class="about-chapter-body">
      <h2>I investigate the validity of uncertainty under change.</h2>
      <div class="about-method-grid">
        <article><span>01</span><h3>What can a guarantee cover?</h3><p>My navigation work calibrates whole routes. The guarantee allows dependence between steps when calibration and evaluation episodes are exchangeable.</p></article>
        <article><span>02</span><h3>Which guarantees survive change?</h3><p>A threshold can meet its target overall and fail on a new language, visual task, or harmless input format. I want to identify the assumptions that separate those cases.</p></article>
        <article><span>03</span><h3>Can internal evidence help?</h3><p>In multilingual image evaluations, a probe classified whether a model followed the image or a false caption with 0.92 accuracy in Telugu. I want to examine when such a signal estimates error after a model changes.</p></article>
        <article><span>04</span><h3>When should a model defer?</h3><p>A useful uncertainty estimate should inform action, abstention, or review under explicit error and review costs.</p></article>
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
          <p>An agent changes what it sees next when it acts or asks for help. So I want to test whether its decision rule stays reliable across that sequence. Model adaptation, including safety fine-tuning, offers another way to test how the rule responds to change.</p>
        </div>
        <dl>
          <div><dt>Evidence so far</dt><dd><a href="/encp-vln/">ENCP</a> calibrates complete routes under stated assumptions about calibration and evaluation episodes.</dd></div>
          <div><dt>Working hypothesis</dt><dd>A change in when the agent asks for help may require a new calibration rule.</dd></div>
          <div><dt>What would change the view</dt><dd>Evidence that the existing rule still meets its target across the changed routes.</dd></div>
        </dl>
      </div>
      <div class="about-closing">
        <p>The research page sets this agenda beside the published work and preprint that inform it.</p>
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
    <p class="section-note">I write about how uncertainty estimates support decisions and when their assumptions fail. The selection below begins with an essay on when a model should abstain.</p>

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
