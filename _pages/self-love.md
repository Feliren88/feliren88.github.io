---
layout: page
title: Self-Love
subtitle: Risk control for people who can endure too much.
description: A visual guide to keeping intelligence, discipline, and ambition from turning endurance into self-abandonment.
permalink: /self-love/
layout-class: page self-love
extra_css: /css/self-love.css
extra_js: /js/components/self-love.js
---

<div class="sl-progress" aria-hidden="true"><span id="sl-progress-fill"></span></div>

<section class="sl-section sl-hero" id="control-system">
  <p class="sl-kicker">The person you must not abandon</p>
  <h1>Your strengths need a governor.</h1>
  <p class="sl-hero-deck">Self-love keeps intelligence, discipline, ambition, and resilience from building a life that rewards everyone except the person living it.</p>

  <div class="sl-control-map" role="img" aria-label="Personal strengths pass through self-love and become either self-abandonment or chosen contribution.">
    <div class="sl-power-bank">
      <span>intelligence</span><span>discipline</span><span>ambition</span><span>adaptability</span><span>responsibility</span><span>resilience</span>
    </div>
    <div class="sl-control-core"><i></i><strong>self-love</strong><small>governs the load</small></div>
    <div class="sl-flow-particles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
    <div class="sl-control-outcomes">
      <div class="is-shadow"><small>ungoverned</small><b>successful<br>self-abandonment</b></div>
      <div class="is-safe"><small>governed</small><b>chosen<br>contribution</b></div>
    </div>
  </div>
  <div class="sl-governor">
    <label><span>Self-protection in the system</span><input id="sl-governor" type="range" min="0" max="100" value="52"></label>
    <div><b id="sl-governor-state">negotiated effort</b><p id="sl-governor-copy" role="status"></p></div>
  </div>
  <blockquote>“I expect a lot from you because I believe in what you can become. But I will not destroy you to prove it.”</blockquote>
</section>

<nav class="sl-rail" aria-label="Self-love visual sequence">
  <a href="#consent"><span>01</span>Consent</a><a href="#trial"><span>02</span>Worth</a><a href="#cage"><span>03</span>Freedom</a><a href="#strengths"><span>04</span>Governor</a><a href="#timing"><span>05</span>Speak</a><a href="#trustee"><span>06</span>Choose</a>
</nav>

<section class="sl-section" id="consent">
  <header class="sl-section-head"><span>01 · Set the load by consent</span><h2>Let consent decide your obligations.</h2></header>
  <figure class="sl-figure sl-load-figure">
    <figcaption><b>Capacity / consent control</b><span>Move the load and the protection threshold.</span></figcaption>
    <div class="sl-load-stage" aria-hidden="true">
      <div class="sl-person"><span></span><i></i></div>
      <div class="sl-load" id="sl-load"><b id="sl-load-label">load</b></div>
      <div class="sl-boundary" id="sl-boundary"><span>my consent line</span></div>
    </div>
    <div class="sl-controls">
      <label><span>What the situation demands</span><input id="sl-demand" type="range" min="10" max="100" value="72"></label>
      <label><span>What I am willing to give</span><input id="sl-consent" type="range" min="10" max="100" value="48"></label>
    </div>
    <div class="sl-readout"><strong id="sl-consent-status"></strong><p id="sl-consent-copy" role="status"></p></div>
  </figure>
  <div class="sl-split-rule"><span>I can survive this.</span><i>≠</i><strong>I consent to living this way.</strong></div>
</section>

<section class="sl-section" id="trial">
  <header class="sl-section-head"><span>02 · End the trial</span><h2>Treat achievement as an expression of worth, never its source.</h2></header>
  <figure class="sl-figure sl-trial-figure">
    <figcaption><b>The moving standard</b><span>Add achievements and watch the finish line move.</span></figcaption>
    <div class="sl-trial-stage">
      <svg viewBox="0 0 700 260" role="img" aria-label="Achievement rises while the standard repeatedly moves higher and validation fades.">
        <line class="sl-axis" x1="52" y1="220" x2="655" y2="220"/>
        <g id="sl-trial-bars"></g>
        <line class="sl-standard" id="sl-standard" x1="52" y1="92" x2="655" y2="92"/>
        <text class="sl-svg-label" id="sl-standard-label" x="650" y="82" text-anchor="end">enough</text>
      </svg>
      <div class="sl-validation"><span>felt worthy</span><i id="sl-validation-fill"></i></div>
    </div>
    <div class="sl-button-row"><button type="button" class="sl-action" id="sl-achieve">Complete another achievement</button><button type="button" class="sl-quiet" id="sl-trial-reset">Reset</button></div>
    <p class="sl-figure-answer" id="sl-trial-answer" role="status">The first achievement is still ahead. Notice what the mind promises it will settle.</p>
  </figure>
  <div class="sl-loop" aria-label="The achievement validation treadmill"><span>achievement</span><i>→</i><span>temporary validation</span><i>→</i><span>higher standard</span><i>→</i><span>renewed inadequacy</span><i>↻</i></div>
</section>

<section class="sl-section" id="cage">
  <header class="sl-section-head"><span>03 · The golden cage</span><h2>A life can become more impressive while becoming less inhabitable.</h2></header>
  <figure class="sl-figure sl-cage-figure">
    <figcaption><b>External reward / internal freedom</b><span>Increase the visible success. Then protect freedom.</span></figcaption>
    <div class="sl-cage-stage">
      <div class="sl-cage-person"><span></span><b>you</b></div>
      <div class="sl-cage-bars" id="sl-cage-bars" aria-hidden="true"></div>
      <div class="sl-cage-metrics">
        <div><span>salary · title · prestige</span><i><b id="sl-reward-bar"></b></i></div>
        <div><span>choice · energy · exit power</span><i><b id="sl-freedom-bar"></b></i></div>
      </div>
    </div>
    <label class="sl-range"><span>Visible success</span><input id="sl-reward" type="range" min="0" max="100" value="58"></label>
    <button type="button" class="sl-protect" id="sl-protect" aria-pressed="false"><i></i><span>Protect freedom as success rises</span></button>
    <p class="sl-figure-answer" id="sl-cage-answer" role="status"></p>
  </figure>
  <p class="sl-question">Track what success costs the person living it.</p>
</section>

<section class="sl-section" id="strengths">
  <header class="sl-section-head"><span>04 · Govern the strengths</span><h2>Every strength carries a failure mode.</h2></header>
  <div class="sl-strength-system">
    <div class="sl-strength-list" id="sl-strength-list" role="listbox" aria-label="Choose a strength"></div>
    <div class="sl-strength-viz" aria-live="polite">
      <div class="sl-strength-source"><span>strength</span><strong id="sl-strength-name"></strong></div>
      <div class="sl-strength-fork" aria-hidden="true"><i></i><i></i></div>
      <div class="sl-strength-result is-shadow"><span>without self-love</span><strong id="sl-strength-shadow"></strong></div>
      <div class="sl-strength-result is-safe"><span>with self-love</span><strong id="sl-strength-safe"></strong></div>
    </div>
  </div>
</section>

<section class="sl-section" id="timing">
  <header class="sl-section-head"><span>05 · Speak earlier</span><h2>Discomfort deserves attention before it becomes certainty.</h2></header>
  <figure class="sl-figure sl-timing-figure">
    <figcaption><b>The cost of delayed communication</b><span>Move the moment when the issue is spoken.</span></figcaption>
    <div class="sl-timing-stage">
      <svg viewBox="0 0 720 260" role="img" aria-label="Unspoken damage accelerates over time while an earlier conversation limits accumulated cost.">
        <path class="sl-damage-area" id="sl-damage-area"></path>
        <path class="sl-damage-line" id="sl-damage-line"></path>
        <line class="sl-speak-line" id="sl-speak-line" y1="26" y2="224"></line>
        <circle class="sl-speak-dot" id="sl-speak-dot" r="7"></circle>
        <text class="sl-svg-label" x="42" y="244">first discomfort</text><text class="sl-svg-label" x="684" y="244" text-anchor="end">private certainty</text>
      </svg>
      <div class="sl-timing-cost"><b id="sl-timing-cost">0</b><span>accumulated repair cost</span></div>
    </div>
    <label class="sl-range"><span>When I speak</span><input id="sl-speak" type="range" min="5" max="95" value="74"></label>
    <p class="sl-figure-answer" id="sl-timing-answer" role="status"></p>
  </figure>
</section>

<section class="sl-section" id="trustee">
  <header class="sl-section-head"><span>06 · Lead the future self</span><h2>Every decision has a stakeholder who cannot vote yet.</h2></header>
  <div class="sl-trustee-map">
    <div class="sl-now"><span>present self</span><b>chooses</b></div>
    <div class="sl-inheritance" aria-hidden="true"><i></i><small>inherits</small></div>
    <div class="sl-future"><span>future self</span><b id="sl-future-inherits">the consequence</b></div>
  </div>
  <div class="sl-scenarios" id="sl-scenarios" role="group" aria-label="Choose a decision pressure">
    <button type="button" data-scenario="work">Unhealthy work</button><button type="button" data-scenario="relationship">Unreciprocated relationship</button><button type="button" data-scenario="approval">Approval pressure</button><button type="button" data-scenario="sunk">Sunk cost</button>
  </div>
  <div class="sl-compass" id="sl-compass">
    <button type="button" data-direction="refuse"><span>refuse</span><b>What must stop?</b></button>
    <button type="button" data-direction="protect"><span>protect</span><b>What must remain intact?</b></button>
    <button type="button" data-direction="say"><span>say</span><b>What truth is overdue?</b></button>
    <button type="button" data-direction="choose"><span>choose</span><b>What serves the life?</b></button>
    <div class="sl-compass-core"><span>self-respect</span><i></i></div>
  </div>
  <p class="sl-compass-answer" id="sl-compass-answer" role="status">Choose a pressure, then ask from one direction.</p>
</section>

<section class="sl-section sl-closing">
  <div class="sl-final-system">
    <span>extraordinary life</span><i>+</i><span>protected person</span><strong>both are your responsibility</strong>
  </div>
  <blockquote>“If I genuinely loved and respected myself, what would I refuse, what would I protect, what would I say, and what would I choose now?”</blockquote>
</section>
