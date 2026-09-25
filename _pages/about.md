---
layout: page
title: Vicky Feliren
subtitle: Applied Scientist · AI safety and calibration
description: Vicky Feliren studies how safety training changes model calibration across languages and image-based tasks. His work includes vision-language navigation and Southeast Asian AI research.
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
      <h1>What happens to uncertainty when we make a model <em>safer?</em></h1>
      <p class="about-story-lead">I’m Vicky Feliren, an applied scientist studying whether safety training changes how well a model recognises its own limits. My work on uncertainty in vision-language navigation and Southeast Asian benchmarks gives me a way to examine that question beyond familiar English text.</p>
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
      <h2>A safer answer is useful only if we can still judge when to trust it.</h2>
      <div class="about-prose-columns">
        <p>Calibration describes how closely a model’s confidence matches its accuracy. In reinforcement learning from human feedback, people’s preferences help shape a model’s answers. <a href="https://proceedings.iclr.cc/paper_files/paper/2025/hash/29fb6e1456b3d8b57ede5c45aa2c6537-Abstract-Conference.html" target="_blank" rel="noreferrer">A study of this training method</a> finds that it can increase expressed confidence even when the answer is wrong. Such overconfidence weakens the signal people use to decide when a model should answer, defer, or seek review.</p>
        <p>My research question is how that change is distributed. An overall score may conceal a larger cost in languages or visual tasks poorly represented in safety data. This is a hypothesis to test, with consequences for whose interactions a safety evaluation actually describes.</p>
      </div>
      <div class="about-equation" role="img" aria-label="Research question connecting safety training, reliable confidence, and the decision to defer">
        <span>Safety training</span><i>→</i><span>Reliable confidence?</span><i>→</i><strong>When to defer</strong>
      </div>
    </div>
  </section>

  <section class="about-chapter" id="path">
    <div class="about-chapter-index"><span>02</span><p>The path</p></div>
    <div class="about-chapter-body">
      <h2>Work on consequential decisions brought me to this question.</h2>
      <div class="about-path" role="list">
        <article role="listitem"><time>2021</time><div><h3>Jakarta Smart City</h3><p>I forecast municipal waste to help plan city resources. A useful model had to inform an actual decision.</p></div></article>
        <article role="listitem"><time>2021–23</time><div><h3>Banking systems</h3><p>I built biometric, credit, and fraud models for Indonesian banks. Their errors carried costs that a test score alone could not explain.</p></div></article>
        <article role="listitem"><time>2022–25</time><div><h3>Earth observation</h3><p>At Monash, I studied flood and mining maps from satellite images. Different sensors and regions made each model’s limits visible.</p></div></article>
        <article role="listitem"><time>2024–present</time><div><h3>SEACrowd</h3><p>I help build datasets and benchmarks for Southeast Asian languages and images. SEA-VL was published at ACL 2025.</p></div></article>
        <article role="listitem" class="is-current"><time>2026</time><div><h3>Navigation and uncertainty</h3><p>My Monash thesis asks how an agent can carry a reliability guarantee across an entire route. The resulting preprint gives a coverage guarantee for proposed actions under stated assumptions about the routes used for calibration and testing.</p></div></article>
      </div>
      <a class="about-inline-cta" href="/cv/">Read the full CV <span aria-hidden="true">→</span></a>
    </div>
  </section>

  <section class="about-chapter" id="method">
    <div class="about-chapter-index"><span>03</span><p>The agenda</p></div>
    <div class="about-chapter-body">
      <h2>The question links safety, representation, and reliable deferral.</h2>
      <div class="about-method-grid">
        <article><span>01</span><h3>What does alignment cost?</h3><p>Safety training can affect capability and confidence in different ways. The first question is whether a model’s expressed uncertainty still tracks its errors after training.</p></article>
        <article><span>02</span><h3>Where does the cost fall?</h3><p>Languages and visual inputs do not appear equally in training or evaluation. A group-level view can show whether one aggregate score conceals uneven changes.</p></article>
        <article><span>03</span><h3>When should a model defer?</h3><p>Abstention means withholding an answer when evidence is weak. A useful rule must reduce consequential errors while preserving answers the model can support.</p></article>
        <article><span>04</span><h3>What can a guarantee cover?</h3><p>My navigation work studies reliability across a whole sequence of actions. It also makes the assumptions behind that guarantee explicit, which matters before carrying it into a different setting.</p></article>
      </div>
    </div>
  </section>

  <section class="about-chapter" id="direction">
    <div class="about-chapter-index"><span>04</span><p>The open question</p></div>
    <div class="about-chapter-body">
      <h2>The distribution of the cost determines the next research question.</h2>
      <div class="about-direction-panel">
        <div>
          <span class="about-status"><i></i> An open hypothesis</span>
          <p>If safety training changes calibration unevenly, the field needs evaluations that reveal which inputs and users face the greater loss of reliable confidence. If the change is broadly shared, a general account of the mechanism becomes more plausible. Either finding would shape how abstention should be studied.</p>
        </div>
        <dl>
          <div><dt>Evidence so far</dt><dd>Safety-related training can increase expressed overconfidence.</dd></div>
          <div><dt>Working hypothesis</dt><dd>The effect may vary by language and input type.</dd></div>
          <div><dt>What would change the view</dt><dd>A similar effect across groups would favour a more general explanation.</dd></div>
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
    <p class="section-note">I write about calibration, safety training, and evaluation. The notes below include papers I am thinking through and an essay on abstention.</p>

    <a class="insight-essay reveal" href="/essays/knowing-when-you-dont-know/">
      <h3>Knowing when you don't know is the core safety property</h3>
      <p>Why safe deployment depends on models knowing when to abstain.</p>
      <span class="insight-read">Read the essay →</span>
    </a>

    {% if site.data.notes %}
    <div class="insights-notes reveal-group">
      {% for note in site.data.notes limit:2 %}
      <a class="insight-note reveal" href="{{ note.link }}" target="_blank" rel="noreferrer">
        <h3>{{ note.title }}</h3>
        <p class="insight-note-paper">On {{ note.paper }}{% if note.authors %} · {{ note.authors }}{% endif %}</p>
        <span class="insight-read">Read the paper →</span>
      </a>
      {% endfor %}
    </div>
    {% endif %}

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
