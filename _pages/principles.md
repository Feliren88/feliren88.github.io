---
layout: page
title: My Life Principles
subtitle: The questions I use when pressure weakens my judgment
description: My rules for slowing irreversible choices, testing reversible ones, protecting the essentials, and deciding under pressure.
permalink: /principles/
layout-class: page principles
extra_css: /css/principles.css
extra_js: /js/components/principles.js
motion_scene: decision
---

<div class="pr-progress" aria-hidden="true"><span id="pr-progress-fill"></span></div>

<script type="application/json" id="pr-data">{{ site.data.principles | jsonify }}</script>

{% include principles-icons.html %}

<!-- ═══════════════════════════════════════════════════════
     THE CENTRAL RULE
     ═══════════════════════════════════════════════════════ -->
<section class="pr-part pr-prose" id="rule">
  <div class="pr-central">
    <p class="t-eyebrow" style="margin:0 0 0.5rem">The central rule</p>
    <p class="lead-rule">Protect your future ability to choose.</p>
    <div class="pr-story-path" aria-label="Decision path from pressure to deliberate scale">
      {% assign pr_story_labels = "Pressure,Stop,Test,Protect,Scale" | split: "," %}
      {% assign pr_story_icons = "pi-now,pi-stop,pi-see,pi-horizon,pi-scale" | split: "," %}
      {% for label in pr_story_labels %}
      <div class="pr-story-node{% if label == 'Test' %} is-gate{% endif %}"><svg class="pr-i" viewBox="0 0 24 24"><use href="#{{ pr_story_icons[forloop.index0] }}"/></svg><span>{{ label }}</span>{% if label == 'Test' %}<small>six questions</small>{% endif %}</div>
      {% unless forloop.last %}<span class="pr-story-arrow" aria-hidden="true">→</span>{% endunless %}
      {% endfor %}
    </div>
    <nav class="pr-story-rail" aria-label="Principles narrative">
      <a href="#six"><span>01</span>Interrogate the choice</a><a href="#reversibility"><span>02</span>Set the speed</a><a href="#situations"><span>03</span>Name the situation</a><a href="#sequence"><span>04</span>Recover the process</a><a href="#protect"><span>05</span>Protect the base</a>
    </nav>
    <p>Pressure narrows attention to immediate relief. When I am angry, afraid, excited, or
    uncertain, I replace the first question in my head with a better one.</p>
    <div class="pr-swap">
      <button class="pr-swap-card weak" type="button" data-q="relief" aria-pressed="false">
        <span class="k"><svg class="pr-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#pi-now"/></svg> The question that arrives</span>
        <q>What do I want right now?</q>
      </button>
      <button class="pr-swap-card strong" type="button" data-q="protect" aria-pressed="true">
        <span class="k"><svg class="pr-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#pi-horizon"/></svg> The better question</span>
        <q>Which decision leaves me stronger, clearer, freer, and with more good options six months from now?</q>
      </button>
    </div>

    <!-- Options as doors. Answering the first question shuts most of them,
         which is the whole rule stated without a sentence. -->
    <div class="pr-doors-wrap">
      <p class="pr-doors-cap" id="pr-doors-cap" role="status"></p>
      <div class="pr-doors" id="pr-doors" aria-hidden="true">
        <span class="door is-open"><svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-door-open"/></svg></span>
        <span class="door is-open"><svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-door-open"/></svg></span>
        <span class="door is-open"><svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-door-open"/></svg></span>
        <span class="door is-open"><svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-door-open"/></svg></span>
        <span class="door is-open"><svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-door-open"/></svg></span>
        <span class="door is-open"><svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-door-open"/></svg></span>
      </div>
      <p class="pr-doors-hint">Six months from now. Tap either question above.</p>
    </div>
    <p>I judge a choice by its consequences. Relief and excitement tell me how the choice feels
    today; they cannot tell me what it will cost six months from now.</p>
    <p>I protect long-term freedom when relief, ego, money, approval, anger, excitement or fear
    pushes me towards a quick answer.</p>
  </div>

  <p class="pr-deck">I wrote this guide for moments when pressure weakens my judgment.
  Search for the situation you face and start there.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     THE CONSOLE
     ═══════════════════════════════════════════════════════ -->
<section class="pr-part pr-prose" id="console">
  <div class="pr-console">
    <div class="pr-console-head">
      <div>
        <p class="t-eyebrow">Start here</p>
        <h5>What is happening right now?</h5>
      </div>
      <span class="pr-hint">Plain words. No categories to learn.</span>
    </div>
    <label class="pr-sr" for="pr-search">Describe what is happening</label>
    <input class="pr-search" id="pr-search" type="text" autocomplete="off"
           placeholder="angry · should I quit · they lied to me · everyone agrees with me">
    <div class="pr-results" id="pr-results" role="status" aria-live="polite"></div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     THE SIX QUESTIONS
     ═══════════════════════════════════════════════════════ -->
<section class="pr-part pr-prose" id="six">
  <h2><span class="n">01</span> Read reality through six questions</h2>
  <p class="pr-deck">Before any important decision, answer these. A clear answer matters more
  than a strong opinion.</p>

  <div class="pr-console">
    <div class="pr-console-head">
      <div>
        <p class="t-eyebrow">Checklist</p>
        <h5>Can you answer all six?</h5>
      </div>
      <span class="pr-hint">Mark each one honestly</span>
    </div>

    <!-- Six segments, one per question. Fills as you mark them clear. -->
    <div class="pr-sixring-wrap">
      <svg class="pr-sixring" id="pr-sixring" viewBox="0 0 120 120" role="img"
           aria-label="Progress ring showing how many of the six questions you can answer.">
        <g id="pr-sixring-segs"></g>
        <text class="rnum" id="pr-sixring-num" x="60" y="63">0</text>
        <text class="rcap" x="60" y="79">of six</text>
      </svg>
      <p class="pr-sixring-note" id="pr-sixring-note"></p>
    </div>

    <div class="pr-six" id="pr-six">
      <div class="pr-q" data-q="1">
        <span class="qico" aria-hidden="true"><svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-q-facts"/></svg></span>
        <span class="qn">01</span>
        <span class="qt">What are the facts?</span>
        <button class="qtoggle" type="button" aria-pressed="false">Not yet</button>
      </div>
      <div class="pr-q" data-q="2">
        <span class="qico" aria-hidden="true"><svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-q-assume"/></svg></span>
        <span class="qn">02</span>
        <span class="qt">What am I assuming?</span>
        <button class="qtoggle" type="button" aria-pressed="false">Not yet</button>
      </div>
      <div class="pr-q" data-q="3">
        <span class="qico" aria-hidden="true"><svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-q-risk"/></svg></span>
        <span class="qn">03</span>
        <span class="qt">What could go seriously wrong?</span>
        <button class="qtoggle" type="button" aria-pressed="false">Not yet</button>
      </div>
      <div class="pr-q" data-q="4">
        <span class="qico" aria-hidden="true"><svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-reversible"/></svg></span>
        <span class="qn">04</span>
        <span class="qt">Is this decision reversible?</span>
        <button class="qtoggle" type="button" aria-pressed="false">Not yet</button>
      </div>
      <div class="pr-q" data-q="5">
        <span class="qico" aria-hidden="true"><svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-q-avoiding"/></svg></span>
        <span class="qn">05</span>
        <span class="qt">What am I avoiding saying or doing?</span>
        <button class="qtoggle" type="button" aria-pressed="false">Not yet</button>
      </div>
      <div class="pr-q" data-q="6">
        <span class="qico" aria-hidden="true"><svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-q-options"/></svg></span>
        <span class="qn">06</span>
        <span class="qt">Will this increase or reduce my future options?</span>
        <button class="qtoggle" type="button" aria-pressed="false">Not yet</button>
      </div>
    </div>
    <div class="pr-verdict" id="pr-six-verdict" role="status"></div>
    <div class="pr-btn-row"><button class="pr-btn" id="pr-six-reset" type="button">Clear</button></div>
  </div>

  <p>I pay special attention to question five. Avoiding a necessary conversation often keeps a
  solvable problem in place.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     REVERSIBILITY
     ═══════════════════════════════════════════════════════ -->
<section class="pr-part pr-prose" id="reversibility">
  <h2><span class="n">02</span> Reversibility sets the speed</h2>
  <p class="pr-deck">Many bad decisions begin at the wrong pace. Even the right choice can go badly
  when made too quickly or too slowly.</p>

  <p>Make reversible decisions quickly because acting gives you the information you need.
  Take more time with irreversible decisions because the evidence bar should rise with the cost
  of being wrong. Drag the dial, or tap an example.</p>

  <div class="pr-console">
    <div class="pr-console-head">
      <div>
        <p class="t-eyebrow">Tool</p>
        <h5>How hard is this to undo?</h5>
      </div>
      <span class="pr-hint">The dial sets your speed</span>
    </div>
    <div class="pr-dial-wrap">
      <svg class="pr-dial" viewBox="0 0 320 200" role="img" aria-label="A dial from freely reversible to permanent.">
        <path class="arc-bg" d="M50 150 A110 110 0 0 1 270 150"/>
        <path class="arc-fill" id="pr-dial-arc" d="M50 150 A110 110 0 0 1 270 150" stroke-dashoffset="345.6"/>
        <circle class="knob" id="pr-dial-knob" cx="50" cy="150" r="9"/>
        <text class="dval" id="pr-dial-val" x="160" y="126">0</text>
        <text class="dunit" x="160" y="146">difficulty of undoing</text>
        <text class="dlab" x="30" y="176">Reversible</text>
        <text class="dlab" x="228" y="176">Permanent</text>
      </svg>
      <div class="pr-dial-read" id="pr-dial-read" role="status">
        <span class="pr-speed" id="pr-speed">
          <svg class="pr-i" viewBox="0 0 24 24" aria-hidden="true"><use id="pr-speed-icon" href="#pi-speed-fast"/></svg>
          <b id="pr-speed-word">Move</b>
        </span>
      </div>
    </div>
    <label class="pr-sr" for="pr-dial-range">How hard is this decision to undo</label>
    <input class="ha-range pr-range" id="pr-dial-range" type="range" min="0" max="100" value="0" step="1"
           style="width:100%;accent-color:var(--accent);height:1.6rem;cursor:pointer;margin-top:var(--gap-2)">

    <!-- Ordinary decisions plotted on the same axis, so the dial has a scale. -->
    <div class="pr-line-wrap">
      <svg class="pr-line" id="pr-line" viewBox="0 0 560 118" role="img"
           aria-label="Common decisions plotted from freely reversible to permanent.">
        <path class="axis" d="M24 62h512"/>
        <path class="axis-cap" d="M24 56v12M536 56v12"/>
        <text class="lend" x="24" y="114">reversible</text>
        <text class="lend" x="536" y="114" text-anchor="end">permanent</text>
        <g id="pr-line-marks"></g>
        <g class="you" id="pr-line-you">
          <path d="M0 -16 L6 -6 L-6 -6 Z"/>
          <text y="-22">you</text>
        </g>
      </svg>
    </div>

    <div class="pr-dial-examples" id="pr-dial-chips"></div>
  </div>

  <p>The dial is a rule of thumb. Its only job is to make you name the
  cost of being wrong before you decide how fast to move.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     THE SITUATIONS
     ═══════════════════════════════════════════════════════ -->
<section class="pr-part pr-prose" id="situations">
  <h2><span class="n">03</span> Find the situation you are in</h2>
  <p class="pr-deck">These are situations worth preparing for. Use the filters or describe
  the situation in your own words with the search box above.</p>

  <div class="pr-filters filter-bar" role="group" aria-label="Filter situations by kind">
    <button class="filter-pill is-active" data-filter="all">All</button>
    <button class="filter-pill" data-filter="pressure">Under pressure</button>
    <button class="filter-pill" data-filter="decide">Deciding</button>
    <button class="filter-pill" data-filter="work">Work</button>
    <button class="filter-pill" data-filter="money">Money</button>
    <button class="filter-pill" data-filter="people">People</button>
    <button class="filter-pill" data-filter="self">Yourself</button>
  </div>
  <p class="pr-count" id="pr-count" role="status" aria-live="polite"></p>

  <!-- Every situation as one glyph. Faster to scan than 51 headings, and it
       doubles as the jump index into the list below. -->
  <div class="pr-map" id="pr-map" role="group" aria-label="Jump to a situation">
    {% for s in site.data.principles.situations %}
    <button class="pr-map-cell" type="button" data-go="{{ s.id }}" data-group="{{ s.group }}"
            title="{{ s.trigger }}" aria-label="{{ s.trigger }}">
      <svg class="pr-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#pi-{{ s.id }}"/></svg>
    </button>
    {% endfor %}
  </div>
  <p class="pr-map-read" id="pr-map-read" role="status">Hover a glyph to name it. Tap to open it.</p>

  <div class="pr-seen">
    <div class="pr-seen-head">
      <span class="pr-seen-k">Explored</span>
      <span class="pr-seen-num"><b id="pr-seen-n">0</b> of {{ site.data.principles.situations | size }}</span>
      <p class="pr-seen-say" id="pr-seen-say" role="status"></p>
    </div>
    <div class="pr-seen-track" aria-hidden="true"><i id="pr-seen-fill"></i></div>
  </div>

  <div class="pr-btn-row" style="margin-top:0;margin-bottom:var(--gap-2)">
    <button class="pr-btn" id="pr-expand" type="button" data-open="false">Expand all</button>
    <button class="pr-btn" id="pr-seen-reset" type="button">Reset explored</button>
  </div>

  <div class="pr-cards" id="pr-cards">
    {% for s in site.data.principles.situations %}
    <article class="pr-card" id="sit-{{ s.id }}" data-group="{{ s.group }}">
      <button type="button" aria-expanded="false" aria-controls="body-{{ s.id }}">
        <span class="pr-card-icon" aria-hidden="true">
          <svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-{{ s.id }}"/></svg>
        </span>
        <span>
          <span class="trg">{{ s.trigger }}</span>
          <span class="ask">{{ s.ask }}</span>
        </span>
        <span class="chev" aria-hidden="true">&rsaquo;</span>
      </button>
      <div class="pr-card-body" id="body-{{ s.id }}">
        {% if s.donts %}
        <div class="pr-block donts">
          <span class="k">Do not</span>
          <ul>{% for d in s.donts %}<li>{{ d }}</li>{% endfor %}</ul>
        </div>
        {% endif %}
        {% if s.steps %}
        <div class="pr-block">
          <span class="k">{% if s.donts %}Do this{% else %}In order{% endif %}</span>
          <ol>{% for t in s.steps %}<li>{{ t }}</li>{% endfor %}</ol>
        </div>
        {% endif %}
        {% if s.body %}
        <div class="pr-block">
          {% for p in s.body %}<p>{{ p }}</p>{% endfor %}
        </div>
        {% endif %}
        <p class="pr-rule">{{ s.rule }}</p>
        <div class="pr-tags">
          <span class="pr-tag">{{ s.group }}</span>
          {% if s.reversible == false %}<span class="pr-tag rev-no">hard to undo</span>{% endif %}
          {% if s.reversible == true %}<span class="pr-tag">reversible</span>{% endif %}
        </div>
      </div>
    </article>
    {% endfor %}
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     THE SEQUENCE
     ═══════════════════════════════════════════════════════ -->
<section class="pr-part pr-prose" id="sequence">
  <h2><span class="n">04</span> Move through the operating sequence</h2>
  <p class="pr-deck">These steps stop me from making a major decision before I understand the problem,
  protect the essentials, and test an option.</p>

  <div class="pr-console">
    <div class="pr-console-head">
      <div>
        <p class="t-eyebrow">Sequence</p>
        <h5>Eight steps, in order</h5>
      </div>
      <span class="pr-hint">Tap any step</span>
    </div>

    <!-- The track carries the one thing that matters here: the order. -->
    <div class="pr-track-wrap">
      <div class="pr-track" id="pr-track" role="group" aria-label="The eight steps in order">
        {% for step in site.data.principles.sequence %}
        <button class="pr-track-node" type="button" data-step="{{ forloop.index0 }}"
                aria-label="Step {{ forloop.index }}, {{ step.key }}">
          <span class="dot">
            <svg class="pr-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#pi-{{ step.key | downcase }}"/></svg>
          </span>
          <span class="cap">{{ step.key }}</span>
        </button>
        {% endfor %}
        <span class="pr-track-rail" aria-hidden="true"><i id="pr-track-fill"></i></span>
      </div>
    </div>

    <div class="pr-seq" id="pr-seq">
      {% for step in site.data.principles.sequence %}
      <div class="pr-step" tabindex="0" role="button" aria-label="{{ step.key }}: {{ step.line }}">
        <span class="sicon" aria-hidden="true">
          <svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-{{ step.key | downcase }}"/></svg>
        </span>
        <span class="sk">{{ step.key }}</span>
        <span>
          <span class="sl">{{ step.line }}</span>
          <p class="sd">{{ step.detail }}</p>
        </span>
      </div>
      {% endfor %}
    </div>
    <p class="pr-seq-note" id="pr-seq-note" role="status"></p>
    <div class="pr-btn-row">
      <button class="pr-btn is-primary" id="pr-seq-next" type="button">Start the sequence</button>
      <button class="pr-btn" id="pr-seq-reset" type="button">Reset</button>
    </div>
  </div>

  <p>Do not choose a direction while the basics remain at risk. Protect your health, money, legal
  position, reputation and key relationships first.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     WHAT TO PROTECT
     ═══════════════════════════════════════════════════════ -->
<section class="pr-part pr-prose" id="protect">
  <h2><span class="n">05</span> Protect the floor</h2>
  <p class="pr-deck">When several problems arrive at once, I protect these five first.</p>

  <!-- Five nodes orbiting the thing they exist to protect. Hovering one dims
       the rest, which is the whole argument: lose any spoke and the centre goes. -->
  <div class="pr-orbit-wrap">
    <svg class="pr-orbit" id="pr-orbit" viewBox="0 0 380 310" role="img"
         aria-label="Five protected things arranged around your ability to choose.">
      <circle class="ring" cx="190" cy="150" r="96"/>
      <g class="hub">
        <circle cx="190" cy="150" r="46"/>
        <text x="190" y="144">Your ability</text>
        <text x="190" y="159">to choose</text>
      </g>
      {%- comment -%} JS places each node on the ring and drops its label. {%- endcomment -%}
      {% for p in site.data.principles.protect %}
      <g class="node" data-i="{{ forloop.index0 }}" tabindex="0" role="button" aria-label="{{ p.key }}">
        <circle class="spoke-hit" r="30"/>
        <circle class="bub" r="26"/>
        <svg class="pi" viewBox="0 0 24 24" width="24" height="24" x="-12" y="-12"><use href="#pi-{{ p.icon }}"/></svg>
      </g>
      {% endfor %}
      <g id="pr-orbit-labels"></g>
    </svg>
    <div class="pr-orbit-read" id="pr-orbit-read" role="status"></div>
  </div>

  <div class="pr-protect">
    {% for p in site.data.principles.protect %}
    <div class="pr-protect-card" data-i="{{ forloop.index0 }}">
      <span class="pico" aria-hidden="true">
        <svg class="pr-i" viewBox="0 0 24 24"><use href="#pi-{{ p.icon }}"/></svg>
      </span>
      <span class="n">{{ forloop.index | prepend: '0' | slice: -2, 2 }}</span>
      <h5>{{ p.key }}</h5>
      <p>{{ p.line }}</p>
    </div>
    {% endfor %}
  </div>

  <h3 id="trades">Five trades that should remain temporary</h3>
  <p>A temporary trade may be necessary. I require strong evidence before making any of these
  trades permanent.</p>

  <div class="pr-trades">
    {% for t in site.data.principles.trades %}
    <button class="pr-trade" type="button" data-pr-trade="{{ forloop.index0 }}" aria-pressed="false">
      <span class="give">{{ t.give }}</span>
      <span class="arrow" aria-hidden="true">traded for</span>
      <span class="get">{{ t.get }}</span>
    </button>
    {% endfor %}
  </div>
  <div class="pr-trade-clock" id="pr-trade-clock" aria-live="polite"><span>Temporary trade</span><i><b id="pr-trade-fill"></b></i><strong id="pr-trade-read">Select a trade to inspect what must be restored.</strong></div>
</section>

<!-- ═══════════════════════════════════════════════════════
     CLOSING
     ═══════════════════════════════════════════════════════ -->
<section class="pr-part pr-prose" id="closing">
  <h2><span class="n">06</span> Use the rule under pressure</h2>

  <!-- Same obstacle, two questions. The width of each path is the number of
       options you still have afterwards, which is the argument in one picture. -->
  <div class="pr-fork-wrap">
    <svg class="pr-fork" id="pr-fork" viewBox="0 0 560 320" role="img"
         aria-label="One obstacle, two questions. Relief narrows your options, protection widens them.">
      <g class="obstacle">
        <path class="rock" d="M80 160 44 126l18-44 48-10 36 32-8 48-32 30-26-22Z"/>
        <text x="82" y="238">The obstacle</text>
      </g>

      <g class="branch relief" data-branch="relief" tabindex="0" role="button"
         aria-label="Asking how to make the discomfort disappear">
        <path class="flow" d="M138 140C272 112 392 76 516 58L516 72C392 100 272 148 138 176Z"/>
        <text class="q" x="322" y="30">“How do I make this discomfort disappear?”</text>
        <text class="out" x="516" y="92" text-anchor="end">fewer options</text>
      </g>

      <g class="branch protect is-good" data-branch="protect" tabindex="0" role="button"
         aria-label="Asking what protects the future">
        <path class="flow" d="M138 142C272 168 392 186 516 196L516 288C392 268 272 212 138 180Z"/>
        <text class="q" x="322" y="312">“What protects the future while dealing honestly with the present?”</text>
        <text class="out" x="516" y="184" text-anchor="end">more options</text>
      </g>
    </svg>
    <p class="pr-fork-read" id="pr-fork-read" role="status"></p>
  </div>

  <div class="pr-final">
    <p>When something difficult happens, do not ask <b>how do I make this discomfort disappear.</b>
    Ask <b>what action protects the future while dealing honestly with the present.</b></p>
    <p>When uncertainty remains, protect the downside. Tell the truth early. Keep good
    options open. Test before committing. Leave when the structure is wrong. Commit
    deeply when reality repeatedly proves that it is right.</p>
  </div>

  <div class="pr-note">
    <p><b>On this page.</b> This guide records the standards I set for myself.
    I keep it because the states it covers are exactly the states in which I reason worst, and a
    written answer beats an improvised one when I am angry or tired.</p>
    <p>This manual also reflects my research on calibration. In both models and people, sound
    decisions require an honest account of uncertainty. Questions three and four apply that idea
    directly: what could go wrong, and how much evidence do I need before the choice becomes hard
    to reverse?</p>
    <p>Nothing you type here is transmitted anywhere. The checklist and the dial are held in your
    browser's local storage and clearing your browser data removes them.</p>
    <p>If you find the interactive format useful, the same treatment is applied to
    <a href="/high-agency/">my notes on George Mack's High Agency</a>.</p>
  </div>
</section>
