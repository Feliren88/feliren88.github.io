---
layout: page
title: About Vicky Feliren
subtitle: AI Safety & Applied Scientist
description: Vicky Feliren is an Applied Scientist studying AI safety, calibration, and reliable multimodal and multilingual systems.
permalink: /about/
extra_css: /css/about.css
hide_title: true
---
<article class="about-story">
  <header class="about-story-hero">
    <div class="about-story-copy">
      <p class="eyebrow">ABOUT VICKY FELIREN</p>
      <h1>I look for what breaks <em>before</em> a system is trusted.</h1>
      <p class="about-story-lead">I’m Vicky Feliren, an applied scientist working where AI safety, uncertainty, and underrepresented data meet. My work asks a practical question: when a model becomes safer, does it remain useful for the people and inputs its training represented least?</p>
      <div class="about-story-actions">
        <a class="btn btn-primary" href="/research/">Explore the research</a>
        <a class="about-text-link" href="/cv/">View curriculum vitae <span aria-hidden="true">↗</span></a>
      </div>
      <ul class="about-proof-strip" aria-label="Selected credentials">
        <li><strong>7</strong><span>peer-reviewed papers</span></li>
        <li><strong>5+ yrs</strong><span>production ML</span></li>
        <li><strong>IEEE · ACL · RSE</strong><span>publication venues</span></li>
      </ul>
    </div>
    <figure class="about-portrait">
      <div class="about-portrait-frame">
        <picture>
          <source type="image/webp" srcset="/assets/img/profile-450.webp 450w, /assets/img/profile.webp 880w" sizes="(max-width: 760px) 55vw, 390px">
          <img src="/assets/img/profile.webp" alt="Vicky Feliren" width="880" height="880" fetchpriority="high">
        </picture>
      </div>
      <figcaption>Applied Scientist · AI safety and reliable multimodal systems</figcaption>
    </figure>
  </header>

  <nav class="about-story-nav" aria-label="On this page">
    <span>Follow the thread</span>
    <a href="#question">01 Question</a>
    <a href="#path">02 Path</a>
    <a href="#method">03 Method</a>
    <a href="#direction">04 Direction</a>
  </nav>

  <section class="about-chapter" id="question">
    <div class="about-chapter-index"><span>01</span><p>The question</p></div>
    <div class="about-chapter-body">
      <p class="about-kicker">Safety is not only about changing an answer.</p>
      <h2>It is also about knowing when that answer should be trusted.</h2>
      <div class="about-prose-columns">
        <p>Safety training can change how well a model’s confidence matches its accuracy. Once that calibration slips, the model may continue when it should defer—or abstain so often that it is no longer useful. Average benchmark scores can hide where that trade-off is being paid.</p>
        <p>I study the distribution beneath the average: which languages, input types, and communities absorb the largest cost. I am especially interested in Southeast Asia, where the world’s linguistic and visual variety is still poorly represented in mainstream datasets and evaluations.</p>
      </div>
      <div class="about-equation" role="img" aria-label="Safety alignment leads to changed confidence, which affects deference and ultimately determines trustworthy use">
        <span>Safety alignment</span><i>→</i><span>Changed confidence</span><i>→</i><span>Deference</span><i>→</i><strong>Trustworthy use</strong>
      </div>
    </div>
  </section>

  <section class="about-chapter" id="path">
    <div class="about-chapter-index"><span>02</span><p>The path</p></div>
    <div class="about-chapter-body">
      <p class="about-kicker">Research shaped by systems that had consequences.</p>
      <h2>From production constraints to research guarantees.</h2>
      <div class="about-path" role="list">
        <article role="listitem"><time>2021</time><div><small>Public systems</small><h3>Jakarta Smart City</h3><p>Forecasting municipal waste taught me that model quality matters only when it changes a real allocation decision.</p></div></article>
        <article role="listitem"><time>2021—23</time><div><small>Production ML</small><h3>Finance and identity</h3><p>Biometrics, credit, and fraud systems made calibration, auditability, and failure costs operational—not theoretical.</p></div></article>
        <article role="listitem"><time>2022—25</time><div><small>Multimodal research</small><h3>Earth observation</h3><p>Satellite systems across sensors and regions made distribution shift visible in every map.</p></div></article>
        <article role="listitem"><time>2024—now</time><div><small>Open science</small><h3>Southeast Asian AI</h3><p>SEACrowd connected the technical problem to the missing languages, cultures, and visual worlds behind it.</p></div></article>
        <article role="listitem" class="is-current"><time>Now</time><div><small>AI safety</small><h3>Calibration under alignment</h3><p>I bring those threads together: measure the hidden cost, then recover useful deference with guarantees.</p></div></article>
      </div>
      <a class="about-inline-cta" href="/cv/">The complete chronology lives in the CV <span>→</span></a>
    </div>
  </section>

  <section class="about-chapter" id="method">
    <div class="about-chapter-index"><span>03</span><p>The method</p></div>
    <div class="about-chapter-body">
      <p class="about-kicker">How I decide what deserves attention.</p>
      <h2>Start with the failure boundary, then build back toward use.</h2>
      <div class="about-method-grid">
        <article><span>01</span><h3>Find the hidden average</h3><p>Disaggregate the result until the users and inputs carrying the cost become visible.</p></article>
        <article><span>02</span><h3>Make uncertainty legible</h3><p>Turn confidence into a measurable decision variable—not a decorative score.</p></article>
        <article><span>03</span><h3>Test outside the comfortable case</h3><p>Use multilingual, multicultural, and multimodal inputs that expose brittle assumptions.</p></article>
        <article><span>04</span><h3>Recover with a bound</h3><p>Prefer interventions whose limits can be stated clearly enough for someone else to trust.</p></article>
      </div>
    </div>
  </section>

  <section class="about-chapter" id="direction">
    <div class="about-chapter-index"><span>04</span><p>The direction</p></div>
    <div class="about-chapter-body">
      <p class="about-kicker">The next question is already in motion.</p>
      <h2>Can aligned models keep calibrated judgment beyond English and beyond text?</h2>
      <div class="about-direction-panel">
        <div>
          <span class="about-status"><i></i> Current research direction</span>
          <p>I am measuring how alignment changes calibration across languages and modalities, then testing whether distribution-free abstention can recover reliable deference without erasing usefulness.</p>
        </div>
        <dl>
          <div><dt>Measure</dt><dd>Calibration tax by input group</dd></div>
          <div><dt>Intervene</dt><dd>Bounded abstention after alignment</dd></div>
          <div><dt>Evaluate</dt><dd>Multilingual + multimodal systems</dd></div>
        </dl>
      </div>
      <div class="about-closing">
        <p>The work is public. The complete record is separate. Choose the depth you need.</p>
        <div><a class="btn btn-primary" href="/research/">Read the research</a><a class="btn btn-secondary" href="/cv/">Open the CV</a><a class="about-text-link" href="/contact/">Start a conversation →</a></div>
      </div>
    </div>
  </section>
</article>
