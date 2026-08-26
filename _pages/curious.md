---
layout: page
title: Stay Curious
subtitle: A field guide for staying in touch with reality
description: Notice what does not fit, ask better questions, test your explanations, change your mind, and act before research becomes avoidance.
permalink: /curious/
date: 2026-08-26
last_modified_at: 2026-08-26
layout-class: page curious
extra_css: /css/curious.css
extra_js: /js/components/curious.js
preload_image: /assets/img/curious-field.webp
motion_scene: curiosity
hide_title: true
---

<div class="cq-progress" aria-hidden="true"><span id="cq-progress-fill"></span></div>

<nav class="cq-rail" aria-label="Curiosity operating system">
  <a href="#map"><span>01</span>Map</a>
  <a href="#questions"><span>02</span>Question</a>
  <a href="#test"><span>03</span>Test</a>
  <a href="#apply"><span>04</span>Apply</a>
  <a href="#limits"><span>05</span>Stop</a>
  <a href="#practice"><span>06</span>Practice</a>
</nav>

<header class="cq-hero" aria-labelledby="cq-title">
  <img src="{{ '/assets/img/curious-field.webp' | relative_url }}" alt="" width="1920" height="1280">
  <div class="cq-hero-copy">
    <p class="cq-kicker">A field manual for things you do not understand yet</p>
    <h1 id="cq-title">Reality may contain something<br><i>I have missed.</i></h1>
    <p>Spot the gap. Look into it. Change your mind when the evidence says you should.</p>
  </div>
  <a class="cq-scroll" href="#map">Enter the loop <span aria-hidden="true">↓</span></a>
</header>

<section class="cq-intro cq-prose">
  <p class="cq-lead">Curiosity gives a conclusion one more look before you trust it.</p>
  <div class="cq-reframes">
    <p><s>This failed.</s><strong>What did it show me?</strong></p>
    <p><s>This person is difficult.</s><strong>What would make their behaviour make sense?</strong></p>
    <p><s>I am bad at this.</s><strong>Which part can I practise?</strong></p>
    <p><s>This is impossible.</s><strong>What would have to be true for it to work?</strong></p>
  </div>
</section>

<section class="cq-part cq-prose" id="map">
  <div class="cq-section-head"><span>01</span><div><p class="cq-kicker">The map</p><h2>Curiosity has five working parts</h2></div></div>
  <p class="cq-deck">Questions are easy to ask. Curiosity also spots the anomaly, stays with uncertainty, tests an idea, and changes course after the result.</p>

  <div class="cq-equation" aria-label="Curiosity equals attention plus questions plus uncertainty tolerance plus experimentation plus updating">
    <div><b>Attention</b><small>See what does not fit</small></div><i>+</i>
    <div><b>Questions</b><small>Open the explanation</small></div><i>+</i>
    <div><b>Uncertainty</b><small>Stay without freezing</small></div><i>+</i>
    <div><b>Experiments</b><small>Let reality answer</small></div><i>+</i>
    <div><b>Updating</b><small>Change the model</small></div>
  </div>

  <div class="cq-loop-wrap">
    <div class="cq-loop-copy"><p class="cq-kicker">The loop</p><h3>Let each answer sharpen the next question.</h3><p>Notice something. Make a model and write down what it predicts. Then compare the prediction with what actually happens.</p></div>
    <svg class="cq-loop" viewBox="0 0 500 500" role="img" aria-label="A loop from notice to question, investigate, model, test, observe, update, and question again">
      <circle class="cq-orbit" cx="250" cy="250" r="178"/>
      <g data-loop="0"><circle cx="250" cy="72" r="28"/><text x="250" y="76">Notice</text></g>
      <g data-loop="1"><circle cx="376" cy="124" r="28"/><text x="376" y="128">Question</text></g>
      <g data-loop="2"><circle cx="428" cy="250" r="28"/><text x="428" y="254">Explore</text></g>
      <g data-loop="3"><circle cx="376" cy="376" r="28"/><text x="376" y="380">Model</text></g>
      <g data-loop="4"><circle cx="250" cy="428" r="28"/><text x="250" y="432">Test</text></g>
      <g data-loop="5"><circle cx="124" cy="376" r="28"/><text x="124" y="380">Observe</text></g>
      <g data-loop="6"><circle cx="72" cy="250" r="28"/><text x="72" y="254">Update</text></g>
      <g data-loop="7"><circle cx="124" cy="124" r="28"/><text x="124" y="128">Again</text></g>
      <text class="cq-loop-core" x="250" y="242">STRONG OPINION</text><text class="cq-loop-core accent" x="250" y="268">WEAK ATTACHMENT</text>
    </svg>
  </div>

  <div class="cq-modes">
    <article><span>01</span><h3>Explore</h3><p>What else is out there?</p><small>Look around before you settle on an answer.</small></article>
    <article><span>02</span><h3>Understand</h3><p>Why might this happen?</p><small>Find the structure behind the event.</small></article>
    <article><span>03</span><h3>Apply</h3><p>What can I do with it?</p><small>Use the idea and see what reality does with it.</small></article>
  </div>
</section>

<section class="cq-part cq-prose" id="questions">
  <div class="cq-section-head"><span>02</span><div><p class="cq-kicker">The question ladder</p><h2>Climb past the first explanation</h2></div></div>
  <p class="cq-deck">Start with what you can see. Save the interpretation for after that.</p>

  <div class="cq-ladder" id="cq-ladder">
    <button type="button" data-step="0"><span>01</span><b>What is happening?</b><small>Describe behaviour before naming motive.</small></button>
    <button type="button" data-step="1"><span>02</span><b>Compared with what?</b><small>Find the baseline before you call it unusual.</small></button>
    <button type="button" data-step="2"><span>03</span><b>What else could explain it?</b><small>Force at least three hypotheses.</small></button>
    <button type="button" data-step="3"><span>04</span><b>What would change my mind?</b><small>Name the evidence before you go looking for it.</small></button>
    <button type="button" data-step="4"><span>05</span><b>What am I missing?</b><small>Look for absent people, data, and costs.</small></button>
    <button type="button" data-step="5"><span>06</span><b>What can I test cheaply?</b><small>Replace speculation with a small piece of evidence.</small></button>
  </div>
  <div class="cq-ladder-read" id="cq-ladder-read" role="status"><b>Start with observation.</b><p>“He is angry” is an interpretation. “His answers became shorter and his voice got louder” is something another person could verify.</p></div>

  <div class="cq-assumption">
    <div><p class="cq-kicker">Assumption inverter</p><h3>Try the opposite for a minute.</h3><p>A reversed claim can show you what the first claim was taking for granted.</p></div>
    <div class="cq-inverter" id="cq-inverter">
      <button type="button" aria-pressed="false"><span>People need more motivation.</span><span>People are motivated; the environment blocks them.</span></button>
      <button type="button" aria-pressed="false"><span>We need more customers.</span><span>We need fewer, better customers.</span></button>
      <button type="button" aria-pressed="false"><span>I need more discipline.</span><span>The system is badly designed.</span></button>
    </div>
  </div>
</section>

<section class="cq-part cq-prose" id="test">
  <div class="cq-section-head"><span>03</span><div><p class="cq-kicker">The lab</p><h2>Make the explanation earn your confidence</h2></div></div>
  <p class="cq-deck">A useful model makes a prediction. Write the guess down, then find a small test for it.</p>

  <div class="cq-lab">
    <label for="cq-hypothesis">I think this is happening because…</label>
    <textarea id="cq-hypothesis" rows="2" placeholder="Customers leave because the price is too high."></textarea>
    <div class="cq-lab-grid">
      <div><span>IF TRUE, I EXPECT</span><p id="cq-expect">Write a hypothesis to expose its prediction.</p></div>
      <div><span>IT MAY BE WRONG IF</span><p id="cq-falsify">Name the result that would force an update.</p></div>
      <div><span>CHEAPEST TEST</span><p id="cq-cheap">Choose one action that creates new information.</p></div>
    </div>
    <button class="cq-button" id="cq-build-test" type="button">Build the test</button>
  </div>

  <div class="cq-zoom">
    <div><p class="cq-kicker">Change the resolution</p><h3>Zoom in, then zoom out.</h3><p>An event can look like one person's choice, a team pattern, or a system effect. Check all three before you decide where to act.</p></div>
    <div class="cq-zoom-chart" id="cq-zoom-chart">
      <button type="button" data-zoom="micro" aria-pressed="true"><b>Micro</b><small>person</small></button>
      <button type="button" data-zoom="meso" aria-pressed="false"><b>Meso</b><small>team / network</small></button>
      <button type="button" data-zoom="macro" aria-pressed="false"><b>Macro</b><small>market / culture</small></button>
      <p id="cq-zoom-read">What did one person do, feel, expect, or avoid?</p>
    </div>
  </div>
</section>

<section class="cq-part cq-prose" id="apply">
  <div class="cq-section-head"><span>04</span><div><p class="cq-kicker">The field</p><h2>Use curiosity where judgment hardens</h2></div></div>
  <p class="cq-deck">When a judgment hardens, replace the label with something you can actually investigate.</p>

  <div class="cq-domains" id="cq-domains">
    <button type="button" data-domain="self" aria-pressed="true">Self</button><button type="button" data-domain="people">People</button><button type="button" data-domain="work">Work</button><button type="button" data-domain="world">World</button>
  </div>
  <div class="cq-domain-stage" id="cq-domain-stage">
    <p class="cq-domain-label">SELF</p><h3>Break identity claims into trainable parts.</h3>
    <div class="cq-before-after"><p><span>CLOSED</span>“I am terrible at networking.”</p><p><span>OPEN</span>“Is the hard part initiating, entering a group, remembering names, or following up?”</p></div>
    <div class="cq-prompt-grid"><p>What happens immediately before the pattern?</p><p>What need am I trying to meet?</p><p>Which conditions make this easier?</p></div>
  </div>

  <div class="cq-pipeline" aria-label="The end-to-end curiosity pipeline">
    <p class="cq-kicker">The full pipeline</p>
    <ol><li>Attention</li><li>Anomaly</li><li>Question</li><li>Hypotheses</li><li>Information</li><li>Experiment</li><li>Feedback</li><li>Model update</li><li>Action</li><li>New questions</li></ol>
  </div>
</section>

<section class="cq-part cq-prose" id="limits">
  <div class="cq-section-head"><span>05</span><div><p class="cq-kicker">The guardrails</p><h2>Curiosity needs an exit</h2></div></div>
  <p class="cq-deck">Curiosity needs a commitment, a boundary, and a point where you stop. Without them, it scatters your attention, crosses lines, or gives anxiety more words.</p>

  <div class="cq-balance">
    <div class="cq-balance-copy"><p class="cq-kicker">Explore / exploit</p><h3 id="cq-balance-title">Balanced inquiry</h3><p id="cq-balance-text">Keep enough range to discover, then stay long enough for the work to compound.</p></div>
    <div class="cq-balance-control"><div class="cq-balance-bar"><i id="cq-explore-bar"></i><i id="cq-exploit-bar"></i></div><label for="cq-balance">Exploration <span id="cq-balance-value">40 / 60</span> execution</label><input id="cq-balance" type="range" min="0" max="100" value="40"></div>
  </div>

  <div class="cq-dark-grid">
    <article><span>01</span><h3>Novelty addiction</h3><p>You keep collecting tabs, books, and beginnings, but never build anything.</p><b>Pick one thread and make something.</b></article>
    <article><span>02</span><h3>Research as avoidance</h3><p>Finding another expert feels safer than making the call.</p><b>Ask whether new evidence could change the decision.</b></article>
    <article><span>03</span><h3>Permanent doubt</h3><p>Scepticism hardens until every claim feels impossible to trust.</p><b>Keep your confidence in proportion to the evidence.</b></article>
    <article><span>04</span><h3>Intrusion</h3><p>Interest pushes past privacy, consent, or timing.</p><b>People do not owe you access.</b></article>
  </div>

  <div class="cq-stopping"><p class="cq-kicker">The stopping rule</p><h3>Will more information change the decision?</h3><div class="cq-stop-choice"><button type="button" data-stop="yes">Yes, probably</button><button type="button" data-stop="no">No, probably not</button></div><p id="cq-stop-read">Compare the value of new information with the cost of delay.</p></div>
</section>

<section class="cq-part cq-prose" id="practice">
  <div class="cq-section-head"><span>06</span><div><p class="cq-kicker">The practice</p><h2>Keep one live question</h2></div></div>
  <p class="cq-deck">Investigate selectively. Save what matters, choose one thread, and let the rest wait.</p>

  <div class="cq-queue">
    <div class="cq-queue-head"><div><p class="cq-kicker">Private question queue</p><h3>What are you trying to understand?</h3></div><span>Saved only in this browser</span></div>
    <form id="cq-question-form"><label class="cq-sr" for="cq-question">Your question</label><input id="cq-question" type="text" maxlength="180" placeholder="What pattern am I not seeing?"><select id="cq-priority" aria-label="Question priority"><option value="now">Now</option><option value="later">Later</option><option value="maybe">Maybe</option></select><button class="cq-button" type="submit">Add question</button></form>
    <div class="cq-queue-list" id="cq-queue-list" aria-live="polite"></div>
  </div>

  <div class="cq-rhythm">
    <article><span>Daily · 5 min</span><h3>Notice</h3><p>What surprised me? What confused me? Which prediction missed?</p></article>
    <article><span>Weekly · 20 min</span><h3>Review</h3><p>Which belief changed? Which question deserves a proper test?</p></article>
    <article><span>Monthly · 1 field trip</span><h3>Explore</h3><p>Spend time with one unfamiliar subject, place, or conversation.</p></article>
    <article><span>Yearly · 1 audit</span><h3>Update</h3><p>What did I stop asking? Which assumption no longer fits?</p></article>
  </div>

  <blockquote class="cq-doctrine">I know enough to act, and remain open enough to learn.</blockquote>
  <div class="cq-final-loop"><span>Observe carefully</span><i>→</i><span>Ask better questions</span><i>→</i><span>Test cheaply</span><i>→</i><span>Update quickly</span><i>→</i><span>Act decisively</span></div>
</section>
