---
layout: page
title: About Vicky Feliren
subtitle: AI Safety & Applied Scientist
description: Vicky Feliren is an Applied Scientist studying AI safety, calibration, and reliable multimodal and multilingual systems.
permalink: /about/
extra_css: /css/about.css
hide_title: true
motion_scene: record
---
<article class="about-story">
  <header class="about-story-hero">
    <div class="about-story-copy">
      <p class="eyebrow">ABOUT VICKY FELIREN</p>
      <h1>I learned to move without <em>certainty.</em> Now I teach machines when to stop.</h1>
      <p class="about-story-lead">I’m Vicky Feliren. In 2020, I had no job, no clear route in, and a growing folder of rejection emails. Small experiments gave me a way forward. Today I study whether AI can recognise its own limits before a confident answer becomes someone else’s problem.</p>
      <div class="about-story-actions">
        <a class="btn btn-primary" href="/research/">Explore the research</a>
        <a class="about-text-link" href="/cv/">View curriculum vitae <span aria-hidden="true">↗</span></a>
      </div>
      <ul class="about-proof-strip" aria-label="Selected credentials">
        <li><strong>7</strong><span>peer-reviewed papers</span></li>
        <li><strong>1</strong><span>issued patent</span></li>
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
      <figcaption>Vicky Feliren · Applied scientist in Jakarta</figcaption>
    </figure>
  </header>

  <!-- essay-motion.js replaces this with the six-beat scene. It sits above the
       sticky nav on purpose: the nav would otherwise stay pinned across the whole
       interlude. See the [data-scene-slot] note in js/components/essay-motion.js. -->
  <div data-scene-slot></div>

  <nav class="about-story-nav" aria-label="On this page">
    <span>Follow the thread</span>
    <a href="#question">01 Origin</a>
    <a href="#path">02 Work</a>
    <a href="#method">03 Thread</a>
    <a href="#direction">04 Now</a>
  </nav>

  <section class="about-chapter" id="question">
    <div class="about-chapter-index"><span>01</span><p>The origin</p></div>
    <div class="about-chapter-body">
      <p class="about-kicker">For a year, every obvious door stayed shut.</p>
      <h2>I stopped waiting for one perfect way in.</h2>
      <div class="about-prose-columns">
        <p>I graduated into the first year of the pandemic. I had no internship, weak interview skills, and no useful network. Rejection made each new application feel like a verdict. I kept trying to solve my whole future at once.</p>
        <p>Then I made the problem smaller. I built one project, joined technical communities, and entered weekend hackathons. The work was rough and the routes were uncertain. They created movement. One small project eventually led to my first job.</p>
      </div>
      <div class="about-equation" role="img" aria-label="Rejection led to small experiments, which created evidence, movement, and a first job">
        <span>Rejection</span><i>→</i><span>Small experiments</span><i>→</i><span>Evidence</span><i>→</i><strong>First job</strong>
      </div>
    </div>
  </section>

  <section class="about-chapter" id="path">
    <div class="about-chapter-index"><span>02</span><p>The work</p></div>
    <div class="about-chapter-body">
      <p class="about-kicker">The first job changed what accuracy meant to me.</p>
      <h2>Every model output lands somewhere.</h2>
      <div class="about-path" role="list">
        <article role="listitem"><time>City</time><div><small>Jakarta Smart City</small><h3>A forecast moved trucks</h3><p>Municipal waste forecasts guided where Jakarta planned resources. A score mattered because people acted on it.</p></div></article>
        <article role="listitem"><time>Bank</time><div><small>GDP Labs</small><h3>A score reached an account</h3><p>I built biometric, fraud, and credit systems for Indonesian banks. A confident mistake could block a real person.</p></div></article>
        <article role="listitem"><time>Map</time><div><small>Monash research</small><h3>A model met unfamiliar ground</h3><p>Satellite sensors disagreed across bands and regions. I learned to ask where a result would stop holding.</p></div></article>
        <article role="listitem"><time>Region</time><div><small>SEACrowd</small><h3>The benchmark had blank spaces</h3><p>We built Southeast Asian datasets that mainstream evaluations had missed. Missing data became visible people and places.</p></div></article>
        <article role="listitem" class="is-current"><time>Now</time><div><small>AI safety</small><h3>The system needs a stopping rule</h3><p>I measure when safety training damages calibration, then test whether reliable abstention can recover useful judgment.</p></div></article>
      </div>
      <a class="about-inline-cta" href="/cv/">The complete chronology lives in the CV <span>→</span></a>
    </div>
  </section>

  <section class="about-chapter" id="method">
    <div class="about-chapter-index"><span>03</span><p>The method</p></div>
    <div class="about-chapter-body">
      <p class="about-kicker">The same question kept returning in different forms.</p>
      <h2>What should happen when confidence outruns evidence?</h2>
      <div class="about-method-grid">
        <article><span>01</span><h3>Look beneath the average</h3><p>A good mean can hide the language, input, or person carrying the failure.</p></article>
        <article><span>02</span><h3>Make doubt usable</h3><p>Confidence should change a decision. It should trigger action, review, or a deliberate stop.</p></article>
        <article><span>03</span><h3>Test the unfamiliar case</h3><p>Southeast Asian languages and multimodal inputs expose assumptions that easy benchmarks leave intact.</p></article>
        <article><span>04</span><h3>Name the boundary</h3><p>A guarantee earns trust only when people can see where it ends.</p></article>
      </div>
    </div>
  </section>

  <section class="about-chapter" id="direction">
    <div class="about-chapter-index"><span>04</span><p>The direction</p></div>
    <div class="about-chapter-body">
      <p class="about-kicker">I still work with uncertainty. I no longer ask it to disappear.</p>
      <h2>Can a safer model keep an honest view of what it knows?</h2>
      <div class="about-direction-panel">
        <div>
          <span class="about-status"><i></i> Current research direction</span>
          <p>I am measuring how safety training changes calibration across languages and input types. Then I will test whether abstention can restore reliable deference. A flat result would still teach us something. It would show that the cost is more uniform than I expect.</p>
        </div>
        <dl>
          <div><dt>Measure</dt><dd>Calibration change by input group</dd></div>
          <div><dt>Test</dt><dd>Languages and modalities</dd></div>
          <div><dt>Recover</dt><dd>Abstention with a clear bound</dd></div>
        </dl>
      </div>
      <div class="about-closing">
        <p>I am looking for research teams working on alignment, calibration, honesty, or reliable evaluation.</p>
        <div><a class="btn btn-primary" href="/research/">Read the research</a><a class="btn btn-secondary" href="/cv/">Open the CV</a><a class="about-text-link" href="/contact/">Start a conversation →</a></div>
      </div>
    </div>
  </section>
</article>
