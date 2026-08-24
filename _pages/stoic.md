---
layout: page
title: Stoic
subtitle: What Marcus Aurelius and Epictetus are still useful for
description: Notes and exercises from the Meditations and the Enchiridion, organised around the problems that send me back to them.
permalink: /stoic/
layout-class: page stoic
extra_css: /css/stoic.css
extra_js: /js/components/stoic.js
---

<div class="st-progress" aria-hidden="true"><span id="st-progress-fill"></span></div>

<script type="application/json" id="st-data">{{ site.data.stoic | jsonify }}</script>

{% include stoic-icons.html %}

<!-- ═══════════════════════════════════════════════════════
     00 · THE TWO MEN
     ═══════════════════════════════════════════════════════ -->
<section class="st-part st-prose" id="two">
  <p class="st-kicker">Event, judgment, response</p>
  <p class="st-lead">The event arrives once. The mind can replay it all day.</p>
  <div class="st-story-map" aria-label="Stoic visual model from event to character">
    {% assign st_story_labels = "Event,Impression,Assent,Response,Character" | split: "," %}
    {% assign st_story_icons = "si-event,si-impression,si-assent,si-response,si-action" | split: "," %}
    {% for label in st_story_labels %}
    <div class="st-story-node{% if label == 'Assent' %} is-gate{% endif %}"><svg class="st-i" viewBox="0 0 24 24"><use href="#{{ st_story_icons[forloop.index0] }}"/></svg><span>{{ label }}</span>{% if label == 'Assent' %}<small>your move</small>{% endif %}</div>
    {% unless forloop.last %}<span class="st-story-arrow" aria-hidden="true">→</span>{% endunless %}
    {% endfor %}
  </div>
  <nav class="st-story-rail" aria-label="Stoic narrative">
    <a href="#control"><span>01</span>Draw the boundary</a><a href="#judgement"><span>02</span>Find the gap</a><a href="#disciplines"><span>03</span>Train the response</a><a href="#above"><span>04</span>Change the scale</a><a href="#death"><span>05</span>Release the outcome</a>
  </nav>
  <p class="st-deck">An emperor and a former slave left us two of the clearest accounts of Roman
  Stoicism. Much of the advice overlaps.</p>

  <div class="st-two">
    <div class="st-man">
      <span class="ico" aria-hidden="true"><svg class="st-i" viewBox="0 0 24 24"><use href="#si-emperor"/></svg></span>
      <h5>Marcus Aurelius</h5>
      <p class="role">Emperor of Rome</p>
      <dl>
        <div class="row"><dt>Lived</dt><dd>121 to 180</dd></div>
        <div class="row"><dt>Position</dt><dd>Absolute power over the known world</dd></div>
        <div class="row"><dt>The book</dt><dd>A private notebook, never meant to be read</dd></div>
        <div class="row"><dt>Written</dt><dd>Partly on campaign, at the frontier</dd></div>
      </dl>
    </div>

    <div class="st-vs" aria-hidden="true">and</div>

    <div class="st-man">
      <span class="ico" aria-hidden="true"><svg class="st-i" viewBox="0 0 24 24"><use href="#si-slave"/></svg></span>
      <h5>Epictetus</h5>
      <p class="role">Born a slave</p>
      <dl>
        <div class="row"><dt>Lived</dt><dd>about 50 to about 135</dd></div>
        <div class="row"><dt>Position</dt><dd>Property, then freedman, then exiled</dd></div>
        <div class="row"><dt>The book</dt><dd>Lecture notes, taken down by a student</dd></div>
        <div class="row"><dt>Written</dt><dd>Nothing. He taught, Arrian wrote</dd></div>
      </dl>
    </div>
  </div>

  <p class="st-two-note">Marcus had read Epictetus. In the first book of the <b>Meditations</b>, he
  thanks the man who lent him a copy of the lectures. The emperor was privately taking advice from
  a former slave about the limits of his control. I have always liked that detail.</p>

  <p>The <b>Meditations</b> here is George Long's translation and the <b>Enchiridion</b> is Elizabeth
  Carter's, both long out of copyright. I checked each quotation against those texts. Many familiar
  Stoic lines come from another translation, and a few are modern paraphrases with an ancient name
  attached.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     01 · THE ONE IDEA
     ═══════════════════════════════════════════════════════ -->
<section class="st-part st-prose" id="control">
  <h2><span class="n">01</span> Draw the boundary</h2>
  <p class="st-deck">The <i>Enchiridion</i> begins with the distinction behind the rest of the book.</p>

  <div class="st-quote">
    <p>Some things are in our control and others not. Things in our control are opinion, pursuit,
    desire, aversion, and, in a word, whatever are our own actions.</p>
    <cite>Epictetus, Enchiridion 1, trans. Elizabeth Carter</cite>
  </div>

  <p>Outcomes matter, but they never belong to you in full. Your choices do. Epictetus asks you to
  put your effort there.</p>

  <div class="st-lab" id="st-sorter">
    <div class="st-lab-head">
      <div>
        <p class="t-eyebrow">Exercise</p>
        <h5>Draw the line</h5>
      </div>
      <span class="st-hint">Ten items. Answer fast.</span>
    </div>

    <p class="st-sort-item" id="st-sort-item" role="status"></p>

    <div class="st-bins">
      <button class="st-bin mine" type="button" data-bin="mine">
        <svg class="st-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#si-yes"/></svg>
        <span class="bt">Up to me</span>
        <span class="bs">my own act</span>
      </button>
      <button class="st-bin" type="button" data-bin="not">
        <svg class="st-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#si-no"/></svg>
        <span class="bt">Not up to me</span>
        <span class="bs">borrowed, or someone else's</span>
      </button>
    </div>

    <div class="st-sort-fb" id="st-sort-fb" role="status"></div>
    <p class="st-tally" id="st-sort-tally" role="status"></p>

    <div class="st-sort-meta">
      <div class="st-pips" id="st-sort-pips" aria-hidden="true"></div>
      <div class="st-btn-row" style="margin:0">
        <button class="st-btn is-primary" id="st-sort-next" type="button" disabled>Next</button>
        <button class="st-btn" id="st-sort-again" type="button">Run it again</button>
      </div>
    </div>
  </div>

  <p>The line gets blurry in practice. Habits affect your health. Conduct affects your reputation.
  Epictetus treats the split as absolute; I cannot. I still use the exercise because I keep claiming
  control over things that were never mine to settle.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     02 · THE GAP
     ═══════════════════════════════════════════════════════ -->
<section class="st-part st-prose" id="judgement">
  <h2><span class="n">02</span> Find the lever in the gap</h2>
  <p class="st-deck">Epictetus locates distress in the judgement we add to an event.</p>

  <div class="st-quote">
    <p>Men are disturbed, not by things, but by the principles and notions which they form
    concerning things. Death, for instance, is not terrible, else it would have appeared so to
    Socrates. But the terror consists in our notion of death that it is terrible.</p>
    <cite>Epictetus, Enchiridion 5, trans. Elizabeth Carter</cite>
  </div>

  <p>This can sound like a denial that anything bad happens. I read it more narrowly. An event creates
  an immediate impression. We then decide whether to accept it as true. That is where we can act.</p>

  <div class="st-lab">
    <div class="st-lab-head">
      <div>
        <p class="t-eyebrow">Machine</p>
        <h5>Same event, different judgement</h5>
      </div>
      <span class="st-hint">Only one row is a lever</span>
    </div>

    <div class="st-machine" id="st-machine">
      <div class="st-stage">
        <span class="sico" aria-hidden="true"><svg class="st-i" viewBox="0 0 24 24"><use href="#si-event"/></svg></span>
        <span><span class="sk">Event</span><span class="sv" id="st-m-event"></span>
        <span class="sn">Outside you. Already happened. Not a lever.</span></span>
      </div>
      <div class="st-arrow" aria-hidden="true">&darr;</div>
      <div class="st-stage">
        <span class="sico" aria-hidden="true"><svg class="st-i" viewBox="0 0 24 24"><use href="#si-impression"/></svg></span>
        <span><span class="sk">Impression</span><span class="sv" id="st-m-impression"></span>
        <span class="sn">Arrives uninvited. Marcus does not blame himself for having it.</span></span>
      </div>
      <div class="st-arrow" aria-hidden="true">&darr;</div>
      <div class="st-stage is-lever">
        <span class="sico" aria-hidden="true"><svg class="st-i" viewBox="0 0 24 24"><use href="#si-assent"/></svg></span>
        <span><span class="sk">Judgement</span>
        <span class="sv">Do you agree with the impression?</span>
        <span class="sn">This is the lever. It is also the only part of the chain that is yours.</span>
        <span class="st-judges" id="st-m-judgements"></span></span>
      </div>
      <div class="st-arrow" aria-hidden="true">&darr;</div>
      <div class="st-stage">
        <span class="sico" aria-hidden="true"><svg class="st-i" viewBox="0 0 24 24"><use href="#si-response"/></svg></span>
        <span><span class="sk">What follows</span><span class="sv" id="st-m-response"></span></span>
      </div>
    </div>

    <div class="st-btn-row">
      <button class="st-btn" id="st-m-next" type="button">Try another event</button>
    </div>
  </div>

  <p>Marcus turns the idea into a useful test: stop at what was reported. Someone spoke badly of you.
  That is the report. The report does not say that you were harmed; your mind added that part.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     03 · THREE DISCIPLINES
     ═══════════════════════════════════════════════════════ -->
<section class="st-part st-prose" id="disciplines">
  <h2><span class="n">03</span> Train the whole response</h2>
  <p class="st-deck">Marcus returns to three jobs: see clearly, act well, and accept what follows.
  They often happen at once.</p>

  <div class="st-lab">
    <div class="st-lab-head">
      <div>
        <p class="t-eyebrow">Diagram</p>
        <h5>Judge, act, want</h5>
      </div>
      <span class="st-hint">Hover a corner</span>
    </div>
    <div class="st-triad-wrap">
      <svg class="st-triad" id="st-triad" viewBox="0 0 340 300" role="img"
           aria-label="A triangle of the three Stoic disciplines: perception, action and will.">
        <path class="edge" d="M170 60 L265 215 L75 215 Z"/>
        <g class="node" tabindex="0" role="button" aria-label="Perception">
          <circle class="bub" cx="170" cy="60" r="32"/>
          <svg class="st-i" viewBox="0 0 24 24" width="26" height="26" x="157" y="47" style="overflow:visible"><use href="#si-perception"/></svg>
        </g>
        <g class="node" tabindex="0" role="button" aria-label="Action">
          <circle class="bub" cx="265" cy="215" r="32"/>
          <svg class="st-i" viewBox="0 0 24 24" width="26" height="26" x="252" y="202" style="overflow:visible"><use href="#si-impulse"/></svg>
        </g>
        <g class="node" tabindex="0" role="button" aria-label="Will">
          <circle class="bub" cx="75" cy="215" r="32"/>
          <svg class="st-i" viewBox="0 0 24 24" width="26" height="26" x="62" y="202" style="overflow:visible"><use href="#si-will"/></svg>
        </g>
        <text class="tlab" x="170" y="20">Perception</text>
        <text class="tlab" x="265" y="266">Action</text>
        <text class="tlab" x="75" y="266">Will</text>
      </svg>
      <div class="st-triad-read" id="st-triad-read" role="status"></div>
    </div>
  </div>

  <p>These jobs can pull against each other. The wish to accept an event can make you soften what you
  see. Neither writer says enough about that risk, and it is one reason I distrust neat readings of
  Stoicism.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     04 · THE PASSAGES
     ═══════════════════════════════════════════════════════ -->
<section class="st-part st-prose" id="passages">
  <h2><span class="n">04</span> Retrieve the right passage</h2>
  <p class="st-deck">Neither book is organised around the moment when you need it. This index is.
  Start with what is happening.</p>

  <div class="st-lab">
    <div class="st-lab-head">
      <div>
        <p class="t-eyebrow">Start here</p>
        <h5>What is happening?</h5>
      </div>
      <span class="st-hint">Plain words. No Greek required.</span>
    </div>
    <label class="st-sr" for="st-search">Describe what is happening</label>
    <input class="st-input" id="st-search" type="text" autocomplete="off"
           placeholder="insulted · anxious · lost my job · someone died · cannot start">
    <div class="st-results" id="st-results" role="status" aria-live="polite"></div>
  </div>

  <div class="st-corpus" id="st-corpus">
    <p class="st-viz-k">Where these passages come from</p>

    <div class="st-split-wrap">
      <div class="st-split" id="st-split" aria-hidden="true"></div>
      <p class="st-cap" id="st-split-cap"></p>
    </div>

    <div class="st-charts">
      <div class="st-chart">
        <h4>Meditations, by book</h4>
        <svg id="st-books" viewBox="0 0 520 160" role="img"
             aria-label="How many passages come from each of the twelve books of the Meditations."></svg>
        <p class="st-cap" id="st-books-cap"></p>
      </div>
      <div class="st-chart">
        <h4>Encheiridion, by chapter</h4>
        <svg id="st-chapters" viewBox="0 0 520 70" role="img"
             aria-label="Which of the fifty-three chapters of the Encheiridion are drawn on."></svg>
        <p class="st-cap" id="st-chapters-cap"></p>
      </div>
    </div>

    <div class="st-chart">
      <h4>By theme</h4>
      <div class="st-themes" id="st-themes" role="group" aria-label="Filter the passages by theme"></div>
      <p class="st-cap">Select a theme to filter the list below.</p>
    </div>
  </div>

  <div class="st-filters filter-bar" role="group" aria-label="Filter passages by kind">
    <button class="filter-pill is-active" data-filter="all">All</button>
    <button class="filter-pill" data-filter="control">Control</button>
    <button class="filter-pill" data-filter="judgement">Judgement</button>
    <button class="filter-pill" data-filter="adversity">Adversity</button>
    <button class="filter-pill" data-filter="others">Other people</button>
    <button class="filter-pill" data-filter="desire">Desire</button>
    <button class="filter-pill" data-filter="death">Death</button>
    <button class="filter-pill" data-filter="action">Action</button>
  </div>
  <p class="st-count" id="st-count" role="status" aria-live="polite"></p>
  <div class="st-btn-row" style="margin-top:0;margin-bottom:var(--gap-2)">
    <button class="st-btn" id="st-expand" type="button" data-open="false">Expand all</button>
  </div>

  <div class="st-cards" id="st-cards">
    {% for p in site.data.stoic.passages %}
    <article class="st-card" id="pas-{{ p.id }}" data-group="{{ p.group }}">
      <button type="button" aria-expanded="false" aria-controls="pbody-{{ p.id }}">
        <span class="cico" aria-hidden="true">
          <svg class="st-i" viewBox="0 0 24 24"><use href="#si-{{ p.group }}"/></svg>
        </span>
        <span>
          <span class="sit">{{ p.situation }}</span>
          <span class="who">{% if p.source == 'meditations' %}Marcus Aurelius, Meditations {{ p.ref }}{% else %}Epictetus, Enchiridion {{ p.ref }}{% endif %}</span>
        </span>
        <span class="chev" aria-hidden="true">&rsaquo;</span>
      </button>
      <div class="st-card-body" id="pbody-{{ p.id }}">
        <blockquote class="st-quote">
          <p>{{ p.quote }}</p>
          <cite>{% if p.source == 'meditations' %}Marcus Aurelius, Meditations {{ p.ref }}, trans. George Long{% else %}Epictetus, Enchiridion {{ p.ref }}, trans. Elizabeth Carter{% endif %}</cite>
        </blockquote>
        <p class="st-take">{{ p.take }}</p>
        <div class="st-tags">
          <span class="st-tag">{{ p.group }}</span>
          <span class="st-tag">{% if p.source == 'meditations' %}Marcus{% else %}Epictetus{% endif %}</span>
        </div>
      </div>
    </article>
    {% endfor %}
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     05 · THE VIEW FROM ABOVE
     ═══════════════════════════════════════════════════════ -->
<section class="st-part st-prose" id="above">
  <h2><span class="n">05</span> Change the scale</h2>
  <p class="st-deck">Marcus repeatedly looks at his troubles from farther away. Distance puts them back
  in proportion. Then he returns to the work in front of him.</p>

  <div class="st-lab">
    <div class="st-lab-head">
      <div>
        <p class="t-eyebrow">Exercise</p>
        <h5>Pull back</h5>
      </div>
      <span class="st-hint">Drag to zoom out</span>
    </div>
    <div class="st-zoom-wrap">
      <svg class="st-zoom" id="st-zoom" viewBox="0 0 340 340" role="img"
           aria-label="Concentric rings from you outward to all of time.">
        <circle class="ring" cx="170" cy="170" r="150"/>
        <circle class="ring" cx="170" cy="170" r="128"/>
        <circle class="ring" cx="170" cy="170" r="104"/>
        <circle class="ring" cx="170" cy="170" r="78"/>
        <circle class="ring" cx="170" cy="170" r="52"/>
        <circle class="ring" cx="170" cy="170" r="30"/>
        <circle class="ring" cx="170" cy="170" r="14"/>
        <circle class="dot" cx="170" cy="170" r="5"/>
        <text class="zlab" x="170" y="150">you</text>
        <text class="zlab" x="170" y="134">the room</text>
        <text class="zlab" x="170" y="112">the city</text>
        <text class="zlab" x="170" y="86">the country</text>
        <text class="zlab" x="170" y="60">the Earth</text>
        <text class="zlab" x="170" y="36">all of it</text>
        <text class="zlab" x="170" y="14">all time</text>
      </svg>
      <div class="st-zoom-read" id="st-zoom-read" role="status"></div>
    </div>
    <label class="st-sr" for="st-zoom-range">How far to pull back</label>
    <input class="st-range" id="st-zoom-range" type="range" min="0" max="6" value="0" step="1">
  </div>

  <p>This exercise can become an excuse to stop caring. Marcus always comes back down and resumes his
  work. I use the distance to recover proportion, then deal with the thing at its real size.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     06 · THE PRACTICES
     ═══════════════════════════════════════════════════════ -->
<section class="st-part st-prose" id="practices">
  <h2><span class="n">06</span> Return to the day</h2>
  <p class="st-deck">These books ask for practice. A few drills appear again and again.</p>


  <div class="st-lab">
    <div class="st-lab-head">
      <div><p class="t-eyebrow">Diagram</p><h5>The shape of a day</h5></div>
      <span class="st-hint">Select a point on the arc</span>
    </div>
    <svg class="st-day" id="st-day" viewBox="0 0 520 190" role="img"
         aria-label="An arc across one day, marked before the day, during it, and after it.">
      <path class="st-day-arc" d="M40 150 C130 40 390 40 480 150"/>
      <line class="st-day-ground" x1="20" y1="150" x2="500" y2="150"/>
      <g class="st-day-node" data-part="dawn" tabindex="0" role="button" aria-label="Before the day">
        <circle cx="40" cy="150" r="11"/><text x="40" y="176" text-anchor="middle">before</text>
      </g>
      <g class="st-day-node" data-part="noon" tabindex="0" role="button" aria-label="During the day">
        <circle cx="260" cy="72" r="11"/><text x="260" y="52" text-anchor="middle">during</text>
      </g>
      <g class="st-day-node" data-part="dusk" tabindex="0" role="button" aria-label="After the day">
        <circle cx="480" cy="150" r="11"/><text x="480" y="176" text-anchor="middle">after</text>
      </g>
    </svg>
    <div class="st-day-read" id="st-day-read" role="status">
      <p class="t">The shape of a day</p>
      <p>Two of the practices on this page sit at the ends of a day. Select a point to see what belongs there.</p>
    </div>
  </div>

  <div class="st-practices">
    <div class="st-practice">
      <span class="pico" aria-hidden="true"><svg class="st-i" viewBox="0 0 24 24"><use href="#si-morning"/></svg></span>
      <span class="when">On waking</span>
      <h5>The morning brief</h5>
      <p>Expect the busybody, the ungrateful person and the arrogant one. The rehearsal keeps their
      behaviour from surprising you and gives you time to choose your own.</p>
      <p class="src">Meditations 2</p>
    </div>
    <div class="st-practice">
      <span class="pico" aria-hidden="true"><svg class="st-i" viewBox="0 0 24 24"><use href="#si-reserve"/></svg></span>
      <span class="when">Before anything</span>
      <h5>The reserve clause</h5>
      <p>Picture what the activity involves before you begin. At the public baths, people splash,
      push and steal. Expecting the nuisance makes it easier to keep your temper when it arrives.</p>
      <p class="src">Enchiridion 4</p>
    </div>
    <div class="st-practice">
      <span class="pico" aria-hidden="true"><svg class="st-i" viewBox="0 0 24 24"><use href="#si-role"/></svg></span>
      <span class="when">In any position</span>
      <h5>The part you were given</h5>
      <p>Epictetus compares life to a play whose length and casting you do not choose. Your job is
      to play the given part well.</p>
      <p class="src">Enchiridion 17</p>
    </div>
    <div class="st-practice">
      <span class="pico" aria-hidden="true"><svg class="st-i" viewBox="0 0 24 24"><use href="#si-above"/></svg></span>
      <span class="when">When it feels enormous</span>
      <h5>The view from above</h5>
      <p>Look at the trouble from a height. Marcus calls the sea a drop and the present a point in
      eternity. He uses distance to check the scale of what is bothering him.</p>
      <p class="src">Meditations 6 and 9</p>
    </div>
  </div>

  <h3 id="premeditation">Rehearsing the loss</h3>
  <p>Epictetus asks you to name the things you love in plain terms. A cup is a cup, and cups break.
  Then he applies the same thought to a wife and child. I understand why many readers stop there.</p>

  <div class="st-lab">
    <div class="st-lab-head">
      <div>
        <p class="t-eyebrow">Exercise</p>
        <h5><svg class="st-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;vertical-align:-0.15em;margin-right:0.35rem"><use href="#si-premeditate"/></svg>Name it now, so it cannot ambush you</h5>
      </div>
      <span class="st-hint">Nothing leaves your browser</span>
    </div>
    <label class="st-label" for="st-pm-input">Something you would hate to lose</label>
    <input class="st-input" id="st-pm-input" type="text" autocomplete="off"
           placeholder="a person, a position, your health, a place">
    <div class="st-btn-row"><button class="st-btn is-primary" id="st-pm-btn" type="button">Begin</button></div>
    <div class="st-pm-steps">
      <div class="st-pm-step">
        <p class="q">Say what <span class="st-pm-echo st-echo">it</span> is.</p>
        <p class="a">Describe the thing itself before describing what it means to you. Epictetus
        begins with a cup because the exercise is easier with something replaceable.</p>
      </div>
      <div class="st-pm-step">
        <p class="q">Now say that <span class="st-pm-echo st-echo">it</span> was lent, not given.</p>
        <p class="a">He tells you to say that you returned a thing instead of losing it. The wording
        feels contrived, but it exposes how much possession was packed into the word <i>lost</i>.</p>
      </div>
      <div class="st-pm-step">
        <p class="q">Picture the day <span class="st-pm-echo st-echo">it</span> is returned.</p>
        <p class="a">Do this once, in detail, while nothing is wrong. You are preparing for the day,
        not trying to suffer through it early.</p>
      </div>
      <div class="st-pm-step">
        <p class="q">Now go and be with <span class="st-pm-echo st-echo">it</span> today.</p>
        <p class="a">Let the rehearsal send you back to the person or thing with more attention.
        Withdrawal in advance would waste the time you still have.</p>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     07 · ON DEATH
     ═══════════════════════════════════════════════════════ -->
<section class="st-part st-prose" id="death">
  <h2><span class="n">07</span> Test the problem against time</h2>
  <p class="st-deck">Marcus writes about death constantly. Remembering it is how he brings his
  attention back to the afternoon he still has.</p>

  <p>He dwells on posthumous fame and how quickly it fades. The most powerful man alive kept reminding
  himself that his name would soon mean very little.</p>

  <div class="st-lab">
    <div class="st-lab-head">
      <div>
        <p class="t-eyebrow">Model</p>
        <h5>How long a name lasts</h5>
      </div>
      <span class="st-hint">Illustrative shape, not a measurement</span>
    </div>
    <svg class="st-fame" viewBox="0 0 540 230" role="img"
         aria-label="A curve showing how quickly a name is forgotten after death.">
      <line class="grid" x1="54" y1="34" x2="500" y2="34"/>
      <line class="grid" x1="54" y1="73" x2="500" y2="73"/>
      <line class="grid" x1="54" y1="112" x2="500" y2="112"/>
      <line class="grid" x1="54" y1="151" x2="500" y2="151"/>
      <line class="ax" x1="54" y1="24" x2="54" y2="190"/>
      <line class="ax" x1="54" y1="190" x2="508" y2="190"/>
      <text class="tick" x="47" y="38" text-anchor="end">all</text>
      <text class="tick" x="47" y="194" text-anchor="end">none</text>
      <text class="tick" x="54" y="212">you die</text>
      <text class="tick" x="500" y="212" text-anchor="end">deep time</text>
      <path class="area" id="st-fame-area"/>
      <path class="curve" id="st-fame-curve"/>
      <line class="scrub" id="st-fame-scrub" x1="54" y1="24" x2="54" y2="190"/>
      <circle class="head" id="st-fame-head" cx="54" cy="34" r="5"/>
    </svg>
    <label class="st-sr" for="st-fame-range">How far after your death</label>
    <input class="st-range" id="st-fame-range" type="range" min="0" max="100" value="0" step="1">
    <div class="st-fame-read">
      <div><div class="k">Looking from</div><div class="v" id="st-fame-when">the week you die</div></div>
      <div><div class="k">Who still knows</div><div class="v" id="st-fame-val">100%</div></div>
    </div>
  </div>

  <p>Marcus lists dead emperors and philosophers, then places himself among them. Their vanished fame
  brings him back to a smaller question: is the present act just? He can answer that while he is
  alive. Other people's memory has no bearing on it.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     08 · WHY I KEEP THIS
     ═══════════════════════════════════════════════════════ -->
<section class="st-part st-prose" id="why">
  <h2><span class="n">08</span> Why I keep this</h2>

  <p>My work measures the gap between what a system believes and what turns out to be true. Epictetus
  often sounds as if he is studying the same gap in people.</p>

  <p>In <i>Enchiridion</i> 5, the event provides the data and the first impression makes a prediction.
  We suffer when we accept that prediction without checking it. I recognise this as a calibration
  problem described eighteen centuries before the term existed.</p>

  <p>I distrust tidy readings of Stoicism. Modern retellings sell composure and often hide its cost.
  Epictetus asks you to think of a person much as you think of a cup: human, breakable and held on
  loan. I do not know how to square that distance with loving someone fully. I keep the passages
  that help and leave this one unresolved.</p>

  <div class="st-lab st-verdict-lab" id="st-verdict-lab">
    <div class="st-lab-head"><div><p class="t-eyebrow">Reading test</p><h5>Keep the tool without forcing a tidy conclusion</h5></div><span class="st-lab-hint">Select both sides</span></div>
    <div class="st-verdict-grid"><button type="button" data-st-verdict="keep"><b>Keep</b><span>Examine the judgment added to an event.</span></button><button type="button" data-st-verdict="open"><b>Leave unresolved</b><span>Whether distance from loss can coexist with loving fully.</span></button></div>
    <p class="st-verdict-read" id="st-verdict-read" role="status">A useful text does not require agreement with every claim.</p>
  </div>

  <div class="st-final">
    <p><b>An event may be outside your control. The judgement you add to it is still yours to
    examine.</b></p>
  </div>

  <div class="st-note">
    <p><b>On the text.</b> The <i>Meditations</i> is quoted in <b>George Long</b>'s translation and
    the <i>Enchiridion</i> in <b>Elizabeth Carter</b>'s, both long out of copyright. Every quotation
    was extracted from the source and checked character by character. Many popular versions use
    another translator; others are paraphrases or inventions. That is why some familiar lines do
    not appear here.</p>
    <p>A reference like <i>6.36</i> is Meditations book six, section thirty-six. Enchiridion
    references are chapter numbers, which are the same across editions.</p>
    <p>Nothing you type here is transmitted anywhere. The exercises are held in your browser's local
    storage and clearing your browser data removes them.</p>
    <p>The same interactive treatment is applied to
    <a href="/high-agency/">my notes on George Mack's High Agency</a> and to
    <a href="/principles/">my own operating manual</a>.</p>
  </div>
</section>
