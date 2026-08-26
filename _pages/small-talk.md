---
layout: page
title: Small Talk
subtitle: A practical way into better conversations
description: A guide for people who prefer deeper conversations but still need an easy place to start.
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
  <a href="#story"><b>00</b><span>Story</span></a><a href="#calibration"><b>01</b><span>Purpose</span></a><a href="#loop"><b>02</b><span>The loop</span></a><a href="#ladder"><b>03</b><span>The ladder</span></a><a href="#topics"><b>04</b><span>Topics</span></a><a href="#variables"><b>05</b><span>Cues</span></a><a href="#atlas"><b>06</b><span>Atlas</span></a><a href="#settings"><b>07</b><span>Settings</span></a><a href="#scripts"><b>08</b><span>Scripts</span></a><a href="#repair"><b>09</b><span>Repair</span></a><a href="#manner"><b>10</b><span>Manner</span></a>
</nav>

<script type="application/json" id="smw-data">{{ site.data.small_talk | jsonify }}</script>
{% include small-talk-icons.html %}

<header class="sm-hero" aria-labelledby="sm-hero-title">
  <div>
    <p class="sm-kicker">Interactive manual</p>
    <h1 id="sm-hero-title">Small talk helps two people find their footing.</h1>
    <p class="sm-lead">Long stretches of socialising drain me. A few good relationships suit me better than a wide network. I wrote this manual to make ordinary conversation feel less costly and more worthwhile.</p>
    <p class="sm-lead sm-lead-2">I want the other person to feel seen, comfortable, respected and slightly known.</p>
  </div>
  <div class="sm-hero-seq" role="img" aria-label="The sequence: seen, then comfortable, then respected, then slightly known">
    <span><b>01</b>Seen</span><i aria-hidden="true">→</i><span><b>02</b>Comfortable</span><i aria-hidden="true">→</i><span><b>03</b>Respected</span><i aria-hidden="true">→</i><span><b>04</b>Slightly known</span>
  </div>
</header>

<section class="sm-part sm-story" id="story" aria-labelledby="sm-story-title">
  <div class="sm-story-head">
    <div>
      <p class="sm-kicker">One evening, six decisions</p>
      <h2 id="sm-story-title">Watch the conversation change</h2>
    </div>
    <p>Arun does not become the loudest person in the room. He notices, responds and gives the conversation somewhere to go. Choose a scene to see what he is reading beneath the words.</p>
  </div>

  <div class="sm-story-stage" id="smw-story">
    <div class="sm-story-scenes" role="tablist" aria-label="Six moments in a conversation">
      <button type="button" class="sm-scene is-on" role="tab" aria-selected="true" data-story="0">
        <span class="sm-scene-no">01</span><span class="sm-scene-art sm-art-arrive" aria-hidden="true"><i class="sm-person sm-arun"></i><i class="sm-crowd sm-crowd-a"></i><i class="sm-lamp"></i></span><b>Arrive</b><small>Lower the target</small>
      </button>
      <button type="button" class="sm-scene" role="tab" aria-selected="false" data-story="1">
        <span class="sm-scene-no">02</span><span class="sm-scene-art sm-art-notice" aria-hidden="true"><i class="sm-person sm-arun"></i><i class="sm-person sm-other"></i><i class="sm-cup"></i></span><b>Notice</b><small>Use what is shared</small>
      </button>
      <button type="button" class="sm-scene" role="tab" aria-selected="false" data-story="2">
        <span class="sm-scene-no">03</span><span class="sm-scene-art sm-art-follow" aria-hidden="true"><i class="sm-person sm-arun"></i><i class="sm-person sm-other"></i><i class="sm-thread-line"></i></span><b>Follow</b><small>Stay with one thread</small>
      </button>
      <button type="button" class="sm-scene" role="tab" aria-selected="false" data-story="3">
        <span class="sm-scene-no">04</span><span class="sm-scene-art sm-art-bridge" aria-hidden="true"><i class="sm-person sm-arun"></i><i class="sm-person sm-other"></i><i class="sm-depth"></i></span><b>Bridge</b><small>Earn the depth</small>
      </button>
      <button type="button" class="sm-scene" role="tab" aria-selected="false" data-story="4">
        <span class="sm-scene-no">05</span><span class="sm-scene-art sm-art-pause" aria-hidden="true"><i class="sm-person sm-arun"></i><i class="sm-person sm-other"></i><i class="sm-pause-dots"></i></span><b>Pause</b><small>Do not rescue it</small>
      </button>
      <button type="button" class="sm-scene" role="tab" aria-selected="false" data-story="5">
        <span class="sm-scene-no">06</span><span class="sm-scene-art sm-art-exit" aria-hidden="true"><i class="sm-person sm-arun"></i><i class="sm-person sm-other"></i><i class="sm-door-line"></i></span><b>Leave</b><small>Close it cleanly</small>
      </button>
    </div>

    <div class="sm-story-panel" id="smw-story-panel" role="tabpanel" aria-live="polite">
      <div class="sm-story-copy">
        <p class="sm-story-beat">Before the first word</p>
        <h3>Three good conversations are enough.</h3>
        <p>Arun enters a room full of people and feels the familiar pressure to perform. He changes the assignment: find one easy person, have two conversations worth continuing, take a break, then decide whether he wants one more.</p>
      </div>
      <dl class="sm-story-read">
        <div><dt>He notices</dt><dd>Who is standing alone, who has an open posture and where the room feels least intense.</dd></div>
        <div><dt>He does</dt><dd>Puts his phone away, relaxes his face and warms up with someone easy.</dd></div>
        <div><dt>He avoids</dt><dd>Scanning for the most important person before acknowledging anyone nearby.</dd></div>
      </dl>
      <blockquote>“I only need to make the next interaction easy.”</blockquote>
    </div>
  </div>

  <noscript><p class="sm-note">The six scenes show a simple progression: arrive with a small target, open from shared context, follow one detail, share enough to reach depth, let pauses breathe, and leave with appreciation.</p></noscript>
</section>

<section class="sm-part sm-prose" id="calibration">
  <h2><span>01</span><svg class="sm-i sm-h2-i"><use href="#sm-eye"/></svg> What small talk is for</h2>
  <p class="sm-deck">Small talk may carry little information, but it helps two people feel safe enough to continue.</p>

  <div class="sm-decode">
    <p class="sm-decode-said">Busy week?</p>
    <p class="sm-decode-note">What the question may mean</p>
    <ul>
      <li>I acknowledge you.</li>
      <li>Are you open to interaction?</li>
      <li>What mood should I match?</li>
      <li>Can we build a little trust before anything important?</li>
    </ul>
  </div>

  <p>Several things happen at once. The week is only the opening.</p>

  <table class="sm-table">
    <thead><tr><th>Function</th><th>What is happening</th></tr></thead>
    <tbody>
      <tr><td>Recognition</td><td>I see you.</td></tr>
      <tr><td>Safety</td><td>I am friendly and predictable.</td></tr>
      <tr><td>Reading the room</td><td>How formal, open, energetic or private are you?</td></tr>
      <tr><td>Connection</td><td>We are on the same side for now.</td></tr>
      <tr><td>Information</td><td>What kind of person are you?</td></tr>
      <tr><td>Trust</td><td>Could this become a deeper conversation?</td></tr>
      <tr><td>Transition</td><td>Strangers to acquaintances.</td></tr>
    </tbody>
  </table>

  <p class="sm-rule">Small talk lets two people read each other without much risk.</p>

  <p>Observation helps me here. I notice what someone stresses, whether they give a short or long answer, and which topics bring energy or make them pull back. My problem is that I can think too much about all of it.</p>

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

  <p class="sm-note">I never want to signal that the conversation is beneath me. Coffee and traffic are easy ways to ask whether I am open, friendly and worth talking to.</p>
</section>

<section class="sm-part sm-prose" id="loop">
  <h2><span>02</span><svg class="sm-i sm-h2-i"><use href="#sm-thread"/></svg> The loop</h2>
  <p class="sm-deck">Seven moves that work in most rooms, with examples of what to say.</p>

  <div class="sm-loop" id="smw-loop" role="group" aria-label="The seven-move small-talk loop">
    <div class="sm-loop-steps" role="tablist" aria-label="Moves">
      {% for m in site.data.small_talk.loop %}<button type="button" role="tab" data-step="{{ forloop.index0 }}"{% if forloop.first %} class="is-on" aria-selected="true"{% else %} aria-selected="false"{% endif %}><svg class="sm-i"><use href="#{{ m.icon }}"/></svg><b>{{ m.verb }}</b></button>{% endfor %}
    </div>
    <div class="sm-loop-body" id="smw-loop-body" role="tabpanel" aria-live="polite"></div>
  </div>

  <h3>Follow the noun</h3>
  <p>When I get stuck, I take the most interesting noun from their last sentence and ask about it. Their answer usually supplies the next thread.</p>

  <div class="sm-noun" id="smw-noun" role="group" aria-label="Follow the noun practice">
    <p class="sm-noun-said" id="smw-noun-said"></p>
    <p class="sm-noun-prompt">Pick a noun.</p>
    <div class="sm-noun-picks" id="smw-noun-picks"></div>
    <p class="sm-noun-out" id="smw-noun-out" role="status"></p>
    <button type="button" class="sm-btn" id="smw-noun-next">Another sentence</button>
  </div>

  <h3>The three-question limit</h3>
  <p>After two or three questions, I share something too. If I only ask questions, the conversation starts to feel like an interview.</p>

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

  <p class="sm-rule">Stay curious and reciprocate. Roughly two thirds them and one third me, though I never count in the moment.</p>
</section>

<section class="sm-part sm-prose" id="ladder">
  <h2><span>03</span><svg class="sm-i sm-h2-i"><use href="#sm-steps"/></svg> The ladder</h2>
  <p class="sm-deck">Seven rungs lead from the room to what matters. I prefer the top three, so I have to give the first four enough time.</p>

  <div class="sm-ladder" id="smw-ladder" role="group" aria-label="The conversation ladder">
    {% for r in site.data.small_talk.ladder %}
    <button type="button" class="sm-rung" data-level="{{ r.level }}"><b>{{ r.level }}</b><span class="sm-rung-kind">{{ r.kind }}</span><span class="sm-rung-ask">{{ r.ask }}</span></button>
    {% endfor %}
    <p class="sm-rung-note" id="smw-ladder-note" role="status">Choose a rung.</p>
  </div>

  <p class="sm-rule">Pacing is what makes depth possible.</p>

  <h3>How long any of this should last</h3>
  <table class="sm-table">
    <thead><tr><th>Band</th><th>Span</th><th>Note</th></tr></thead>
    <tbody>
      {% for d in site.data.small_talk.durations %}<tr><td>{{ d.band }}</td><td class="sm-span">{{ d.span }}</td><td>{{ d.note }}</td></tr>{% endfor %}
    </tbody>
  </table>

  <p class="sm-note">I use small talk to find out whether there is a deeper conversation worth having.</p>
</section>

<section class="sm-part sm-prose" id="topics">
  <h2><span>04</span><svg class="sm-i sm-h2-i"><use href="#sm-pin"/></svg> Topics</h2>
  <p class="sm-deck">Six topic groups are easier to remember than a hundred scripts. I use PEWFIC.</p>

  <div class="sm-pewfic" id="smw-pewfic" role="group" aria-label="Six safe topic families">
    {% for t in site.data.small_talk.topics %}
    <button type="button" data-letter="{{ t.letter }}"><b>{{ t.letter }}</b><svg class="sm-i"><use href="#{{ t.icon }}"/></svg><span>{{ t.name }}</span></button>
    {% endfor %}
  </div>
  <p class="sm-pewfic-out" id="smw-pewfic-out" role="status">Pick a letter for openings.</p>

  <h3>Topics that need more care</h3>
  <p>None of these are forbidden. Their meaning changes enormously with culture, setting and relationship, so I let the other person set the depth first.</p>

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
  <p class="sm-deck">Country-by-country rules are hard to remember and can create stereotypes. These seven cues help me read the room in front of me.</p>

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

  <p class="sm-rule">Match their formality, pace, openness, energy and distance. Never copy an accent.</p>

  <p class="sm-note">When I do not know the rule, I watch first and begin a little more formally than the people around me.</p>
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
  <p>This one matters most to me. A good starting point is warm, respectful and modest. Talk about food often shows care, and <span class="sm-lang">sudah makan?</span> can be a greeting rather than a real question about lunch.</p>
  <p>Questions about home, family, school and work can arrive earlier than they do in some Western offices. American ideas about privacy do not explain every question. Multinational workplaces in Jakarta may follow global office norms more closely.</p>
  <p class="sm-rule">Observe the subculture, not only the nationality.</p>
</section>

<section class="sm-part sm-prose" id="settings">
  <h2><span>07</span><svg class="sm-i sm-h2-i"><use href="#sm-event"/></svg> Twenty rooms</h2>
  <p class="sm-deck">Pick the room for an opening, a direction, an exit and a common mistake.</p>

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
  <p>Continuous socialising depletes me. At an event, I would rather have three good conversations than make thirty introductions.</p>

  <ol class="sm-budget">
    <li><b>Arrive</b><span>Warm up on someone easy. The first conversation is a rehearsal.</span></li>
    <li><b>Two</b><span>Find two conversations worth continuing. That is the target.</span></li>
    <li><b>Break</b><span>Step outside. Taking a break is not rude, and nobody is counting.</span></li>
    <li><b>One more</b><span>Have a third conversation if you still have the energy.</span></li>
    <li><b>Leave</b><span>Go before resentment sets in. Leaving early is a strategy.</span></li>
  </ol>
</section>

<section class="sm-part sm-prose" id="scripts">
  <h2><span>08</span><svg class="sm-i sm-h2-i"><use href="#sm-clipboard"/></svg> Scripts</h2>
  <p class="sm-deck">I keep four answers ready for moments when hesitation gets in the way.</p>

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

  <p class="sm-note">At high-status events, give one sentence and stop. Let them choose whether to ask more. Starting with credentials invites a comparison nobody enjoys.</p>
</section>

<section class="sm-part sm-prose" id="repair">
  <h2><span>09</span><svg class="sm-i sm-h2-i"><use href="#sm-wrench"/></svg> Repair</h2>
  <p class="sm-deck">Conversations tend to stall in familiar ways. A prepared line can help me recover.</p>

  <div class="sm-repair" id="smw-repair" role="group" aria-label="Repair situations">
    {% for r in site.data.small_talk.repair %}
    <button type="button" data-key="{{ r.key }}"><svg class="sm-i"><use href="#{{ r.icon }}"/></svg><span>{{ r.name }}</span></button>
    {% endfor %}
  </div>
  <div class="sm-repair-out" id="smw-repair-out" role="status" aria-live="polite"></div>

  <h3>Show care before giving advice</h3>
  <p>I get this one wrong often. Someone describes a problem and I reach for a diagnosis when they wanted sympathy.</p>
  <p class="sm-chain"><span>Acknowledge</span><i aria-hidden="true">→</i><span>Clarify</span><i aria-hidden="true">→</i><span>Analyse only if invited</span></p>

  <div class="sm-two">
    <div class="sm-bad">
      <span class="sm-tagline">Too soon</span>
      <p>You need stronger boundaries.</p>
    </div>
    <div class="sm-good">
      <span class="sm-tagline">Better</span>
      <p>That sounds draining. Has it been the workload or more the people side?</p>
    </div>
  </div>

  <p class="sm-note">The advice may still be useful later. The mistake is giving it before I have listened.</p>
</section>

<section class="sm-part sm-prose" id="manner">
  <h2><span>10</span><svg class="sm-i sm-h2-i"><use href="#sm-hand"/></svg> Manner</h2>
  <p class="sm-deck">I want to look available.</p>

  <table class="sm-table sm-body-table">
    <thead><tr><th>Signal</th><th>Target</th></tr></thead>
    <tbody>
      {% for b in site.data.small_talk.manner.body %}<tr><td>{{ b.signal }}</td><td>{{ b.target }}</td></tr>{% endfor %}
    </tbody>
  </table>

  <h3>Show that you are listening</h3>
  <p>I listen closely but do not always show it. The other person cannot see attention, so I need to respond out loud.</p>
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

  <p class="sm-rule">Be more careful with humour around strangers.</p>

  <h3>The mode</h3>
  <p>The mode that fits me is calm, observant, curious, lightly funny, specific, respectful and selectively open.</p>
  <p class="sm-chain sm-chain-lg"><span>Warmth</span><i aria-hidden="true">→</i><span>Curiosity</span><i aria-hidden="true">→</i><span>Specificity</span><i aria-hidden="true">→</i><span>Depth</span></p>
</section>

<footer class="sm-coda">
  <p class="sm-coda-kicker">Keep this in mind</p>
  <h2>Make the interaction easy for the other person.</h2>
  <p>Recognise them. Give them an easy opening. Listen. Follow something they care about. Reveal a little. Respect the boundary. Leave cleanly.</p>
  <p class="sm-coda-last">During small talk, I try to be interested instead of interesting. If there is room for depth, it can come later.</p>
</footer>
