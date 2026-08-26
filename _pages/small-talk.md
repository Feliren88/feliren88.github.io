---
layout: page
title: Small Talk
subtitle: Reconnaissance with warmth.
description: A field manual for people who prefer depth. What small talk is actually for, a seven-move loop, the ladder from weather to meaning, seven cultural variables to read instead of memorising countries, twenty settings, and the repair lines for when it goes wrong.
permalink: /small-talk/
date: 2026-08-26
last_modified_at: 2026-08-26
layout-class: page small-talk
extra_css: /css/small-talk.css
extra_js: /js/components/small-talk.js
motion_scene: rapport
---

<div class="sm-progress" aria-hidden="true"><span id="smw-progress-fill"></span></div>

<nav class="sm-rail" aria-label="Manual sections">
  <a href="#calibration"><b>01</b><span>Calibration</span></a><a href="#loop"><b>02</b><span>The loop</span></a><a href="#ladder"><b>03</b><span>The ladder</span></a><a href="#topics"><b>04</b><span>Topics</span></a><a href="#variables"><b>05</b><span>Variables</span></a><a href="#atlas"><b>06</b><span>Atlas</span></a><a href="#settings"><b>07</b><span>Settings</span></a><a href="#scripts"><b>08</b><span>Scripts</span></a><a href="#repair"><b>09</b><span>Repair</span></a><a href="#manner"><b>10</b><span>Manner</span></a>
</nav>

<script type="application/json" id="smw-data">{{ site.data.small_talk | jsonify }}</script>
{% include small-talk-icons.html %}

<header class="sm-hero" aria-labelledby="sm-hero-title">
  <div>
    <p class="sm-kicker">Interactive manual</p>
    <h1 id="sm-hero-title">Small talk is not performance. It is calibration.</h1>
    <p class="sm-lead">Long stretches of social performance drain me, and a few good relationships suit me better than a wide network. That is a constraint, not an excuse. This is the manual I wrote so that ordinary conversation stops costing more than it returns.</p>
    <p class="sm-lead sm-lead-2">The aim is not to be fascinating. The aim is to make one other person feel seen, comfortable, respected and slightly known.</p>
  </div>
  <div class="sm-hero-seq" role="img" aria-label="The sequence: seen, then comfortable, then respected, then slightly known">
    <span><b>01</b>Seen</span><i aria-hidden="true">→</i><span><b>02</b>Comfortable</span><i aria-hidden="true">→</i><span><b>03</b>Respected</span><i aria-hidden="true">→</i><span><b>04</b>Slightly known</span>
  </div>
</header>

<section class="sm-part sm-prose" id="calibration">
  <h2><span>01</span><svg class="sm-i sm-h2-i"><use href="#sm-eye"/></svg> What it is actually for</h2>
  <p class="sm-deck">An analytical mind can misread small talk because its information content is close to zero. That is the wrong measurement. The content is not the message.</p>

  <div class="sm-decode">
    <p class="sm-decode-said">Busy week?</p>
    <p class="sm-decode-note">What is actually being asked</p>
    <ul>
      <li>I acknowledge you.</li>
      <li>Are you open to interaction?</li>
      <li>What emotional temperature should I use?</li>
      <li>Can we build a little trust before anything important?</li>
    </ul>
  </div>

  <p>Several things happen at once, and none of them are about the week.</p>

  <table class="sm-table">
    <thead><tr><th>Function</th><th>What is happening</th></tr></thead>
    <tbody>
      <tr><td>Recognition</td><td>I see you.</td></tr>
      <tr><td>Safety</td><td>I am friendly and predictable.</td></tr>
      <tr><td>Calibration</td><td>How formal, open, energetic or private are you?</td></tr>
      <tr><td>Affiliation</td><td>We are temporarily on the same side.</td></tr>
      <tr><td>Information</td><td>What kind of person are you?</td></tr>
      <tr><td>Trust</td><td>Could this become more substantive?</td></tr>
      <tr><td>Transition</td><td>Strangers to acquaintances.</td></tr>
    </tbody>
  </table>

  <p class="sm-rule">Small talk is reconnaissance with warmth.</p>

  <p>My advantage here is observation. I notice what someone emphasises, whether they answer briefly or expansively, which topics produce energy and which make them withdraw. The failure mode is not blindness. It is overprocessing.</p>

  <div class="sm-two">
    <div class="sm-bad">
      <span class="sm-tagline">The trap</span>
      <p>Observe, analyse, predict, optimise, say nothing.</p>
    </div>
    <div class="sm-good">
      <span class="sm-tagline">The move</span>
      <p>Observe, respond simply.</p>
    </div>
  </div>

  <p class="sm-note">The one thing never to signal is that the conversation is beneath me. Coffee is rarely about coffee. Traffic is rarely about traffic. Treat the surface topic as a handshake and answer the real question, which is whether I am someone worth talking to.</p>
</section>

<section class="sm-part sm-prose" id="loop">
  <h2><span>02</span><svg class="sm-i sm-h2-i"><use href="#sm-thread"/></svg> The loop</h2>
  <p class="sm-deck">Seven moves that work in most rooms. Walk through them and each one shows what to actually say.</p>

  <div class="sm-loop" id="smw-loop" role="group" aria-label="The seven-move small-talk loop">
    <div class="sm-loop-steps" role="tablist" aria-label="Moves">
      {% for m in site.data.small_talk.loop %}<button type="button" role="tab" data-step="{{ forloop.index0 }}"{% if forloop.first %} class="is-on" aria-selected="true"{% else %} aria-selected="false"{% endif %}><svg class="sm-i"><use href="#{{ m.icon }}"/></svg><b>{{ m.verb }}</b></button>{% endfor %}
    </div>
    <div class="sm-loop-body" id="smw-loop-body" role="tabpanel" aria-live="polite"></div>
  </div>

  <h3>Follow the noun</h3>
  <p>This is the single most useful habit. When stuck, take the most interesting noun from their last sentence and ask about that. Their answer hands you the next noun, and the conversation sustains itself.</p>

  <div class="sm-noun" id="smw-noun" role="group" aria-label="Follow the noun practice">
    <p class="sm-noun-said" id="smw-noun-said"></p>
    <p class="sm-noun-prompt">Pick a noun.</p>
    <div class="sm-noun-picks" id="smw-noun-picks"></div>
    <p class="sm-noun-out" id="smw-noun-out" role="status"></p>
    <button type="button" class="sm-btn" id="smw-noun-next">Another sentence</button>
  </div>

  <h3>The three-question limit</h3>
  <p>After two or three questions in a row, say something myself. Otherwise it stops being a conversation and becomes an interview, and people can feel the difference immediately.</p>

  <div class="sm-two">
    <div class="sm-bad">
      <span class="sm-tagline">Interview</span>
      <p>Where are you from? How long have you lived here? What brought you over?</p>
    </div>
    <div class="sm-good">
      <span class="sm-tagline">Conversation</span>
      <p>Where are you from? How long have you lived here? I have noticed people who move for work end up knowing a city differently from locals.</p>
    </div>
  </div>

  <p class="sm-rule">Curiosity plus reciprocity. Roughly two thirds them, one third me, never counted at the time.</p>
</section>

<section class="sm-part sm-prose" id="ladder">
  <h2><span>03</span><svg class="sm-i sm-h2-i"><use href="#sm-steps"/></svg> The ladder</h2>
  <p class="sm-deck">Seven rungs from the room to what matters. I will always prefer the top three. That is exactly why the bottom four need respecting.</p>

  <div class="sm-ladder" id="smw-ladder" role="group" aria-label="The conversation ladder">
    {% for r in site.data.small_talk.ladder %}
    <button type="button" class="sm-rung" data-level="{{ r.level }}"><b>{{ r.level }}</b><span class="sm-rung-kind">{{ r.kind }}</span><span class="sm-rung-ask">{{ r.ask }}</span></button>
    {% endfor %}
    <p class="sm-rung-note" id="smw-ladder-note" role="status">Choose a rung.</p>
  </div>

  <p class="sm-rule">Depth is earned through pacing. Small talk is the bridge to it.</p>

  <h3>How long any of this should last</h3>
  <table class="sm-table">
    <thead><tr><th>Band</th><th>Span</th><th>Note</th></tr></thead>
    <tbody>
      {% for d in site.data.small_talk.durations %}<tr><td>{{ d.band }}</td><td class="sm-span">{{ d.span }}</td><td>{{ d.note }}</td></tr>{% endfor %}
    </tbody>
  </table>

  <p class="sm-note">The question is never how to make small talk last longer. It is how quickly we can find out whether there is a deeper conversation worth having.</p>
</section>

<section class="sm-part sm-prose" id="topics">
  <h2><span>04</span><svg class="sm-i sm-h2-i"><use href="#sm-pin"/></svg> Topics</h2>
  <p class="sm-deck">Six families instead of a hundred memorised scripts. The mnemonic is PEWFIC.</p>

  <div class="sm-pewfic" id="smw-pewfic" role="group" aria-label="Six safe topic families">
    {% for t in site.data.small_talk.topics %}
    <button type="button" data-letter="{{ t.letter }}"><b>{{ t.letter }}</b><svg class="sm-i"><use href="#{{ t.icon }}"/></svg><span>{{ t.name }}</span></button>
    {% endfor %}
  </div>
  <p class="sm-pewfic-out" id="smw-pewfic-out" role="status">Pick a letter for openings.</p>

  <h3>Topics that need calibration</h3>
  <p>None of these are forbidden. Their meaning simply changes enormously with culture, setting and relationship, so I let the other person set the depth first.</p>

  <div class="sm-calibrate">
    {% for c in site.data.small_talk.calibrate %}
    <div class="sm-cal-row"><b>{{ c.topic }}</b><span>{{ c.why }}</span></div>
    {% endfor %}
  </div>

  <p class="sm-rule">Let locals raise the intimacy before I do.</p>

  <h3>When I have nothing at all</h3>
  <p>FORD is the usual recovery device: family, occupation, recreation, dreams. It works, but family is the one that varies most across cultures. With strangers I prefer a safer order.</p>
  <p class="sm-chain"><span>Place</span><i aria-hidden="true">→</i><span>Work</span><i aria-hidden="true">→</i><span>Interest</span><i aria-hidden="true">→</i><span>Story</span></p>
</section>

<section class="sm-part sm-prose" id="variables">
  <h2><span>05</span><svg class="sm-i sm-h2-i"><use href="#sm-globe"/></svg> Seven variables</h2>
  <p class="sm-deck">Memorising two hundred countries does not work and produces stereotypes anyway. Reading seven variables in the room does work. Set them and the manual tells you the posture.</p>

  <div class="sm-vars" id="smw-vars" role="group" aria-label="Cultural variable calibration">
    {% for v in site.data.small_talk.variables %}
    <div class="sm-var" data-key="{{ v.key }}">
      <div class="sm-var-head"><svg class="sm-i"><use href="#{{ v.icon }}"/></svg><b>{{ v.n }} &middot; {{ v.name }}</b></div>
      <p class="sm-var-read">{{ v.read }}</p>
      <div class="sm-var-scale" role="group" aria-label="{{ v.name }} setting">
        <span class="sm-var-pole">{{ v.low }}</span>
        <input class="sm-range" type="range" min="0" max="4" step="1" value="2" data-key="{{ v.key }}" aria-label="{{ v.name }}">
        <span class="sm-var-pole">{{ v.high }}</span>
      </div>
      <p class="sm-var-move">{{ v.move }}</p>
    </div>
    {% endfor %}
  </div>

  <div class="sm-posture" id="smw-posture" role="status" aria-live="polite"></div>

  <p class="sm-rule">Mirror formality, pace, disclosure, energy and distance. Never mirror an accent.</p>

  <p class="sm-note">When the rule is genuinely unknown, observe first, then move one step more conservative than the local maximum. That single habit prevents most serious mistakes.</p>
</section>

<section class="sm-part sm-prose" id="atlas">
  <h2><span>06</span><svg class="sm-i sm-h2-i"><use href="#sm-plane"/></svg> Atlas</h2>
  <p class="sm-deck">Broad tendencies, never rules about a person in front of me. Age, class, city, profession and international exposure often matter more than nationality.</p>

  <div class="sm-filter" id="smw-atlas-filter" role="group" aria-label="Filter by region">
    <button type="button" class="sm-pill is-on" data-region="all">All</button>
    <button type="button" class="sm-pill" data-region="apac">Asia Pacific</button>
    <button type="button" class="sm-pill" data-region="europe">Europe</button>
    <button type="button" class="sm-pill" data-region="americas">Americas</button>
    <button type="button" class="sm-pill" data-region="mena">Middle East</button>
    <button type="button" class="sm-pill" data-region="africa">Africa</button>
    <button type="button" class="sm-pill" data-region="global">Global</button>
  </div>

  <div class="sm-atlas" id="smw-atlas">
    {% for a in site.data.small_talk.atlas %}
    <article class="sm-place" data-region="{{ a.region }}">
      <h4>{{ a.place }}</h4>
      <p class="sm-place-style">{{ a.style }}</p>
      <p class="sm-place-note"><span>Watch</span>{{ a.note }}</p>
    </article>
    {% endfor %}
  </div>

  <h3>Indonesia, specifically</h3>
  <p>This one matters most to me. The working default is warm, respectful, non-boastful and context-aware. Food-oriented conversation often works socially rather than literally, and <span class="sm-lang">sudah makan?</span> is a greeting more than a question about lunch.</p>
  <p>Questions about where someone lives, where they are from, family, school, work and hometown can arrive earlier than in some Western professional settings. Reading every one of them through American privacy norms is a mistake. At the same time, multinational Jakarta in technology, finance and consulting often runs closer to global corporate convention.</p>
  <p class="sm-rule">Observe the subculture, not only the nationality.</p>
</section>

<section class="sm-part sm-prose" id="settings">
  <h2><span>07</span><svg class="sm-i sm-h2-i"><use href="#sm-event"/></svg> Twenty rooms</h2>
  <p class="sm-deck">Pick the room. Each one gives an opening, where to take it, how to leave, and the mistake that room invites.</p>

  <div class="sm-filter" id="smw-set-filter" role="group" aria-label="Filter settings">
    <button type="button" class="sm-pill is-on" data-group="all">All</button>
    <button type="button" class="sm-pill" data-group="Professional">Professional</button>
    <button type="button" class="sm-pill" data-group="Passing">Passing</button>
    <button type="button" class="sm-pill" data-group="Social">Social</button>
  </div>

  <div class="sm-settings" id="smw-settings">
    {% for s in site.data.small_talk.settings %}
    <button type="button" class="sm-setting" data-key="{{ s.key }}" data-group="{{ s.group }}"><svg class="sm-i"><use href="#{{ s.icon }}"/></svg><span>{{ s.name }}</span></button>
    {% endfor %}
  </div>
  <div class="sm-setting-out" id="smw-setting-out" role="status" aria-live="polite"></div>

  <h3>The energy budget</h3>
  <p>Continuous social performance depletes me, so treating competence as endless networking would be a category error. At an event, three good conversations beat thirty introductions.</p>

  <ol class="sm-budget">
    <li><b>Arrive</b><span>Warm up on someone easy. The first conversation is a rehearsal.</span></li>
    <li><b>Two</b><span>Find two conversations worth continuing. That is the actual target.</span></li>
    <li><b>Break</b><span>Step outside. Refilling is not rude, and nobody is counting.</span></li>
    <li><b>One more</b><span>Then a third, if the energy is genuinely there.</span></li>
    <li><b>Leave</b><span>Go before resentment sets in. Leaving early is a strategy.</span></li>
  </ol>
</section>

<section class="sm-part sm-prose" id="scripts">
  <h2><span>08</span><svg class="sm-i sm-h2-i"><use href="#sm-clipboard"/></svg> Scripts</h2>
  <p class="sm-deck">Four things worth having ready, because these are the moments where hesitation costs the most.</p>

  <div class="sm-scripts" id="smw-scripts">
    {% for s in site.data.small_talk.scripts %}
    <article class="sm-script">
      <h4>{{ s.name }}</h4>
      <p class="sm-script-formula">{{ s.formula }}</p>
      <p class="sm-script-body">{{ s.body }}</p>
      <blockquote class="sm-script-eg">{{ s.example }}</blockquote>
      <p class="sm-script-fail"><span>Fails as</span>{{ s.fail }}</p>
    </article>
    {% endfor %}
  </div>

  <p class="sm-note">The two-layer answer matters most at high-status events. Give one sentence, then stop and let them choose whether to go deeper. Leading with credentials invites a comparison nobody enjoys.</p>
</section>

<section class="sm-part sm-prose" id="repair">
  <h2><span>09</span><svg class="sm-i sm-h2-i"><use href="#sm-wrench"/></svg> Repair</h2>
  <p class="sm-deck">Conversation fails in a small number of predictable ways. Each has a line that works.</p>

  <div class="sm-repair" id="smw-repair" role="group" aria-label="Repair situations">
    {% for r in site.data.small_talk.repair %}
    <button type="button" data-key="{{ r.key }}"><svg class="sm-i"><use href="#{{ r.icon }}"/></svg><span>{{ r.name }}</span></button>
    {% endfor %}
  </div>
  <div class="sm-repair-out" id="smw-repair-out" role="status" aria-live="polite"></div>

  <h3>Validation before analysis</h3>
  <p>This is the one I get wrong most often. Someone describes a problem and I reach for the diagnosis, when what was on offer was a moment of sympathy.</p>
  <p class="sm-chain"><span>Acknowledge</span><i aria-hidden="true">→</i><span>Clarify</span><i aria-hidden="true">→</i><span>Analyse only if invited</span></p>

  <div class="sm-two">
    <div class="sm-bad">
      <span class="sm-tagline">Premature</span>
      <p>You need stronger boundaries.</p>
    </div>
    <div class="sm-good">
      <span class="sm-tagline">Better</span>
      <p>That sounds draining. Has it been the workload or more the people side?</p>
    </div>
  </div>

  <p class="sm-note">The second answer may eventually be the first one. It is the sequencing that is wrong, not the content.</p>
</section>

<section class="sm-part sm-prose" id="manner">
  <h2><span>10</span><svg class="sm-i sm-h2-i"><use href="#sm-hand"/></svg> Manner</h2>
  <p class="sm-deck">The goal is not to look charismatic. The goal is to look available.</p>

  <table class="sm-table sm-body-table">
    <thead><tr><th>Signal</th><th>Target</th></tr></thead>
    <tbody>
      {% for b in site.data.small_talk.manner.body %}<tr><td>{{ b.signal }}</td><td>{{ b.target }}</td></tr>{% endfor %}
    </tbody>
  </table>

  <h3>Make the listening legible</h3>
  <p>I process intensely and show almost none of it. Internal attention is invisible, so it has to be said out loud even when I already understand.</p>
  <p class="sm-chips">{% for l in site.data.small_talk.manner.listening %}<span>{{ l }}</span>{% endfor %}</p>

  <h3>Compliments and humour</h3>
  <div class="sm-two-col">
    <div>
      <span class="sm-tagline">Compliments that work</span>
      <ul>{% for c in site.data.small_talk.manner.compliments.good %}<li>{{ c }}</li>{% endfor %}</ul>
      <span class="sm-tagline sm-tagline-risk">Needs context first</span>
      <ul class="sm-risk">{% for c in site.data.small_talk.manner.compliments.risky %}<li>{{ c }}</li>{% endfor %}</ul>
    </div>
    <div>
      <span class="sm-tagline">Humour that builds</span>
      <ul>{% for h in site.data.small_talk.manner.humour.safe %}<li>{{ h }}</li>{% endfor %}</ul>
      <span class="sm-tagline sm-tagline-risk">Costs more than it returns</span>
      <ul class="sm-risk">{% for h in site.data.small_talk.manner.humour.risky %}<li>{{ h }}</li>{% endfor %}</ul>
    </div>
  </div>

  <p class="sm-rule">Underestimate your humour privileges with strangers.</p>

  <h3>The mode</h3>
  <p>Not the charismatic networker, and not the silent genius either. The mode that actually fits is calm, observant, curious, lightly funny, specific, respectful and selectively open.</p>
  <p class="sm-chain sm-chain-lg"><span>Warmth</span><i aria-hidden="true">→</i><span>Curiosity</span><i aria-hidden="true">→</i><span>Specificity</span><i aria-hidden="true">→</i><span>Depth</span></p>
</section>

<footer class="sm-coda">
  <p class="sm-coda-kicker">The whole manual, compressed</p>
  <h2>Make the interaction easy for the other person.</h2>
  <p>Recognise them. Give them an easy opening. Listen. Follow something they care about. Reveal a little. Respect the boundary. Leave cleanly.</p>
  <p class="sm-coda-last">The rule I actually need is the shortest one. Stop trying to be interesting during small talk and be interested instead. The depth can arrive later, and with the right people it will.</p>
</footer>
