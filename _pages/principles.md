---
layout: page
title: My Life Principles
subtitle: One rule and a practical system for making decisions under pressure
description: My personal operating manual for difficult decisions, built around six questions, reversibility, and a clear sequence for action.
permalink: /principles/
layout-class: page principles
extra_css: /css/principles.css
extra_js: /js/components/principles.js
---

<div class="pr-progress" aria-hidden="true"><span id="pr-progress-fill"></span></div>

<script type="application/json" id="pr-data">{{ site.data.principles | jsonify }}</script>

<!-- ═══════════════════════════════════════════════════════
     THE CENTRAL RULE
     ═══════════════════════════════════════════════════════ -->
<section class="pr-part pr-prose" id="rule">
  <div class="pr-central">
    <p class="t-eyebrow" style="margin:0 0 0.5rem">The central rule</p>
    <p class="lead-rule">Protect your future ability to choose.</p>
    <p>Pressure narrows attention to immediate relief. When I am angry, afraid, excited, or
    uncertain, I replace the first question in my head with a better one.</p>
    <div class="pr-swap">
      <div class="pr-swap-card weak">
        <span class="k">The question that arrives</span>
        <q>What do I want right now?</q>
      </div>
      <div class="pr-swap-card strong">
        <span class="k">The question to ask instead</span>
        <q>Which decision leaves me stronger, clearer, freer, and with more good options six months from now?</q>
      </div>
    </div>
    <p>Immediate comfort does not tell me whether a decision is sound. I judge a choice by its
    consequences, not by the relief or excitement it creates today.</p>
    <p>My rule is direct: <b>never sacrifice long-term freedom for short-term relief, ego,
    money, approval, anger, excitement or fear.</b></p>
  </div>

  <p class="pr-deck">This is an operating manual, not a universal theory. I wrote it for moments
  when pressure weakens my judgment. Search for the situation you face and start there.</p>
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
  <h2><span class="n">01</span> The six questions</h2>
  <p class="pr-deck">Before any important decision, answer these. The test is not whether you
  have an opinion. It is whether you can answer clearly.</p>

  <div class="pr-console">
    <div class="pr-console-head">
      <div>
        <p class="t-eyebrow">Checklist</p>
        <h5>Can you answer all six?</h5>
      </div>
      <span class="pr-hint">Mark each one honestly</span>
    </div>
    <div class="pr-six" id="pr-six">
      <div class="pr-q" data-q="1">
        <span class="qn">01</span>
        <span class="qt">What are the facts?</span>
        <button class="qtoggle" type="button" aria-pressed="false">Not yet</button>
      </div>
      <div class="pr-q" data-q="2">
        <span class="qn">02</span>
        <span class="qt">What am I assuming?</span>
        <button class="qtoggle" type="button" aria-pressed="false">Not yet</button>
      </div>
      <div class="pr-q" data-q="3">
        <span class="qn">03</span>
        <span class="qt">What could go seriously wrong?</span>
        <button class="qtoggle" type="button" aria-pressed="false">Not yet</button>
      </div>
      <div class="pr-q" data-q="4">
        <span class="qn">04</span>
        <span class="qt">Is this decision reversible?</span>
        <button class="qtoggle" type="button" aria-pressed="false">Not yet</button>
      </div>
      <div class="pr-q" data-q="5">
        <span class="qn">05</span>
        <span class="qt">What am I avoiding saying or doing?</span>
        <button class="qtoggle" type="button" aria-pressed="false">Not yet</button>
      </div>
      <div class="pr-q" data-q="6">
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
  <p class="pr-deck">Most bad decisions are not wrong choices. They are right-speed choices
  applied to the wrong kind of decision.</p>

  <p>Reversible decisions deserve speed, because the information you want is on the other side of
  doing it. Irreversible decisions deserve patience, because the evidence bar should rise with the
  cost of being wrong. Drag the dial, or tap an example.</p>

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
      <div class="pr-dial-read" id="pr-dial-read" role="status"></div>
    </div>
    <label class="pr-sr" for="pr-dial-range">How hard is this decision to undo</label>
    <input class="ha-range pr-range" id="pr-dial-range" type="range" min="0" max="100" value="0" step="1"
           style="width:100%;accent-color:var(--accent);height:1.6rem;cursor:pointer;margin-top:var(--gap-2)">
    <div class="pr-dial-examples" id="pr-dial-chips"></div>
  </div>

  <p>The dial is a rule of thumb rather than a measurement. Its only job is to make you name the
  cost of being wrong before you decide how fast to move.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     THE SITUATIONS
     ═══════════════════════════════════════════════════════ -->
<section class="pr-part pr-prose" id="situations">
  <h2><span class="n">03</span> The situations</h2>
  <p class="pr-deck">Every state worth having a prepared answer for. Filter, or use the
  search box above if you would rather describe it in your own words.</p>

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
  <div class="pr-btn-row" style="margin-top:0;margin-bottom:var(--gap-2)">
    <button class="pr-btn" id="pr-expand" type="button" data-open="false">Expand all</button>
  </div>

  <div class="pr-cards" id="pr-cards">
    {% for s in site.data.principles.situations %}
    <article class="pr-card" id="sit-{{ s.id }}" data-group="{{ s.group }}">
      <button type="button" aria-expanded="false" aria-controls="body-{{ s.id }}">
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
          <span class="k">{% if s.donts %}Instead{% else %}In order{% endif %}</span>
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
  <h2><span class="n">04</span> When nothing above fits</h2>
  <p class="pr-deck">When no specific rule fits, I use this sequence. The order prevents me from
  making a large decision before I have stabilized the situation and gathered evidence.</p>

  <div class="pr-console">
    <div class="pr-console-head">
      <div>
        <p class="t-eyebrow">Sequence</p>
        <h5>Eight steps, in order</h5>
      </div>
      <span class="pr-hint">Tap any step</span>
    </div>
    <div class="pr-seq" id="pr-seq">
      {% for step in site.data.principles.sequence %}
      <div class="pr-step" tabindex="0" role="button" aria-label="{{ step.key }}: {{ step.line }}">
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

  <p>The critical mistake is selecting a direction before securing the basics. Stabilize health,
  money, legal position, reputation, and key relationships before making a major choice.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     WHAT TO PROTECT
     ═══════════════════════════════════════════════════════ -->
<section class="pr-part pr-prose" id="protect">
  <h2><span class="n">05</span> The five things to protect</h2>
  <p class="pr-deck">When several problems arrive at once, I protect these five first.</p>

  <div class="pr-protect">
    {% for p in site.data.principles.protect %}
    <div class="pr-protect-card">
      <span class="n">{{ forloop.index | prepend: '0' | slice: -2, 2 }}</span>
      <h5>{{ p.key }}</h5>
      <p>{{ p.line }}</p>
    </div>
    {% endfor %}
  </div>

  <h3>The five trades not to make permanently</h3>
  <p>A temporary trade may be necessary. I require strong evidence before making any of these
  trades permanent.</p>

  <div class="pr-trades">
    {% for t in site.data.principles.trades %}
    <div class="pr-trade">
      <span class="give">{{ t.give }}</span>
      <span class="arrow" aria-hidden="true">traded for</span>
      <span class="get">{{ t.get }}</span>
    </div>
    {% endfor %}
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     CLOSING
     ═══════════════════════════════════════════════════════ -->
<section class="pr-part pr-prose" id="closing">
  <h2><span class="n">06</span> One principle for every obstacle</h2>

  <div class="pr-final">
    <p>When something difficult happens, do not ask <b>how do I make this discomfort disappear.</b>
    Ask <b>what action protects the future while dealing honestly with the present.</b></p>
    <p>When uncertainty remains, protect the downside. Tell the truth early. Keep good
    options open. Test before committing. Leave when the structure is fundamentally wrong. Commit
    deeply when reality repeatedly proves that it is right.</p>
  </div>

  <div class="pr-note">
    <p><b>On this page.</b> This is a personal operating manual rather than advice for anyone else.
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
