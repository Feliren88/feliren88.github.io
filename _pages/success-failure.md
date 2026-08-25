---
layout: page
title: Success & Failure
subtitle: Learn what caused the result, then choose what to do next.
description: How to learn from a win or loss without mistaking luck for skill, repeating a costly mistake, or risking your ability to continue.
permalink: /success-failure/
layout-class: page success-failure
extra_css: /css/success-failure.css
extra_js: /js/components/success-failure.js
---

<div class="sf-progress" aria-hidden="true"><span id="sf-progress-fill"></span></div>
{% include success-failure-icons.html %}

<section class="sf-part sf-prose sf-opening" id="outcome">
  <p class="sf-kicker">What to do after the plan meets reality</p>

  <figure class="sf-fig" id="sfig-luck">
    <figcaption><span class="n">Figure 1</span><b>One result tells you less than you think</b><em>Drag how much of this game is luck.</em></figcaption>
    <div class="sf-fig-body">
      <svg class="sf-fig-svg" viewBox="0 0 560 170" role="img" aria-label="Twenty runs of the same strategy, spread wider as luck increases.">
        <line class="sx-ax" x1="30" y1="132" x2="534" y2="132"/>
        <text class="sx-lab" x="30" y="152">worse</text>
        <text class="sx-lab" x="534" y="152" text-anchor="end">better</text>
        <line class="sx-true" id="sx-true" x1="282" y1="26" x2="282" y2="132"/>
        <text class="sx-lab sx-truelab" id="sx-truelab" x="282" y="20" text-anchor="middle">what the strategy is worth</text>
        <g id="sx-runs"></g>
      </svg>
      <label class="sf-fig-ctl"><span>How much luck is in this game</span>
        <input type="range" id="sx-luck" min="0" max="100" value="20" step="5"></label>
      <label class="sf-fig-ctl"><span>Underlying strategy quality</span>
        <input type="range" id="sx-quality" min="0" max="100" value="56" step="2"></label>
      <button class="sx-rerun" id="sx-rerun" type="button">Run 20 more attempts</button>
      <div class="sf-fig-read">
        <div><b id="sx-spread">0</b><span>spread across 20 runs</span></div>
        <div><b id="sx-runs-needed">1</b><span>runs before you can tell</span></div>
        <div><b id="sx-median">0</b><span>median observed result</span></div>
        <p id="sx-say" role="status"></p>
      </div>
    </div>
  </figure>
  <p class="sf-lead">Treat the outcome as evidence.</p>
  <p>You tried a strategy under specific conditions and got a result. Find out what caused it before
  you call one win brilliance or one loss incompetence.</p>

  <div class="sf-hero-map" aria-label="An outcome passes through diagnosis before one of six responses">
    <div class="sf-node sf-node-origin"><svg class="sf-i"><use href="#sf-outcome"/></svg><span>Outcome</span></div>
    <div class="sf-path" aria-hidden="true"><span></span></div>
    <div class="sf-node sf-node-diagnose"><svg class="sf-i"><use href="#sf-diagnose"/></svg><span>Diagnose</span></div>
    <div class="sf-branches" aria-hidden="true"></div>
    <div class="sf-destinations">
      {% for action in site.data.success_failure.actions %}
      <a href="#router" class="sf-destination"><svg class="sf-i"><use href="#{{ action.icon }}"/></svg><span>{{ action.title }}</span></a>
      {% endfor %}
    </div>
  </div>

  <nav class="sf-story-rail" aria-label="Learning route">
    <a href="#four-outcomes"><span>01</span>Read the result</a><a href="#diagnosis"><span>02</span>Find the cause</a><a href="#lanes"><span>03</span>Choose a lane</a><a href="#guardrails"><span>04</span>Protect the game</a><a href="#review"><span>05</span>Close the loop</a>
  </nav>

  <div class="sf-fan" aria-label="Eight factors feed one observed outcome">
    <div class="sf-fan-inputs">
      <span class="sf-fan-in"><svg class="sf-i" aria-hidden="true"><use href="#sf-learning"/></svg><b>S</b>skill</span>
      <span class="sf-fan-in"><svg class="sf-i" aria-hidden="true"><use href="#sf-strategy"/></svg><b>G</b>strategy</span>
      <span class="sf-fan-in"><svg class="sf-i" aria-hidden="true"><use href="#sf-timing"/></svg><b>T</b>timing</span>
      <span class="sf-fan-in"><svg class="sf-i" aria-hidden="true"><use href="#sf-geography"/></svg><b>E</b>environment</span>
      <span class="sf-fan-in"><svg class="sf-i" aria-hidden="true"><use href="#sf-players"/></svg><b>P</b>other players</span>
      <span class="sf-fan-in"><svg class="sf-i" aria-hidden="true"><use href="#sf-information"/></svg><b>I</b>information</span>
      <span class="sf-fan-in"><svg class="sf-i" aria-hidden="true"><use href="#sf-noise"/></svg><b>L</b>luck</span>
      <span class="sf-fan-in"><svg class="sf-i" aria-hidden="true"><use href="#sf-execution"/></svg><b>X</b>execution</span>
    </div>
    <svg class="sf-fan-wires" viewBox="0 0 120 340" aria-hidden="true" preserveAspectRatio="none">
      <path d="M0 21C60 21 60 170 118 170"/><path d="M0 64C60 64 60 170 118 170"/>
      <path d="M0 107C60 107 60 170 118 170"/><path d="M0 150C60 150 60 170 118 170"/>
      <path d="M0 190C60 190 60 170 118 170"/><path d="M0 233C60 233 60 170 118 170"/>
      <path d="M0 276C60 276 60 170 118 170"/><path d="M0 319C60 319 60 170 118 170"/>
    </svg>
    <div class="sf-fan-out">
      <svg class="sf-i" aria-hidden="true"><use href="#sf-outcome"/></svg>
      <b>O</b><span>the observed outcome</span>
    </div>
  </div>

  <div class="sf-eq">
    <p class="eq">O = f(S, G, T, E, P, I, L, X)</p>
    <dl class="sf-terms">
      <div><dt>O</dt><dd>the observed outcome</dd></div>
      <div><dt>f( )</dt><dd>a causal process, not a claim that these terms can be measured exactly</dd></div>
      <div><dt>S, G</dt><dd>skill and strategy</dd></div>
      <div><dt>T, E</dt><dd>timing and environment</dd></div>
      <div><dt>P, I</dt><dd>other players and available information</dd></div>
      <div><dt>L, X</dt><dd>luck and execution</dd></div>
    </dl>
  </div>
</section>

<section class="sf-part sf-prose" id="four-outcomes">
  <h2><span class="n">01</span> Four kinds of outcome <svg class="sf-i"><use href="#sf-capacity"/></svg></h2>
  <p class="sf-deck">Judge a result twice: by what happened and by what it left you able to do.</p>

  <figure class="sf-fig" id="sfig-quad">
    <figcaption><span class="n">Figure 2</span><b>Place your last result</b><em>Move both sliders.</em></figcaption>
    <div class="sf-fig-body">
      <div class="sx-quadwrap">
        <svg class="sf-fig-svg" viewBox="0 0 300 300" role="img" aria-label="A result plotted against visible outcome and future capacity.">
          <rect class="sx-q sx-q-tl" x="20" y="20" width="130" height="130" rx="4"/>
          <rect class="sx-q sx-q-tr" x="150" y="20" width="130" height="130" rx="4"/>
          <rect class="sx-q sx-q-bl" x="20" y="150" width="130" height="130" rx="4"/>
          <rect class="sx-q sx-q-br" x="150" y="150" width="130" height="130" rx="4"/>
          <text class="sx-qlab" x="85" y="88">Productive</text><text class="sx-qlab" x="85" y="104">failure</text>
          <text class="sx-qlab" x="215" y="88">Real</text><text class="sx-qlab" x="215" y="104">success</text>
          <text class="sx-qlab" x="85" y="218">Destructive</text><text class="sx-qlab" x="85" y="234">failure</text>
          <text class="sx-qlab" x="215" y="218">False</text><text class="sx-qlab" x="215" y="234">success</text>
          <line class="sx-ax" x1="150" y1="20" x2="150" y2="280"/>
          <line class="sx-ax" x1="20" y1="150" x2="280" y2="150"/>
          <circle class="sx-you" id="sx-you" cx="150" cy="150" r="9"/>
        </svg>
      </div>
      <label class="sf-fig-ctl"><span>Visible result</span>
        <input type="range" id="sx-visible" min="0" max="100" value="72" step="2"></label>
      <label class="sf-fig-ctl"><span>What it did to your future capacity</span>
        <input type="range" id="sx-capacity" min="0" max="100" value="30" step="2"></label>
      <div class="sf-fig-read">
        <div><b id="sx-quad">False success</b><span>where this lands</span></div>
        <p id="sx-quad-say" role="status"></p>
      </div>
    </div>
  </figure>

  <div class="sf-matrix" aria-label="Outcome matrix comparing visible result with future capacity">
    <div class="sf-axis sf-axis-y"><span>Future capacity falls</span><span>Future capacity rises</span></div>
    <div class="sf-quadrants">
      <article class="sf-quadrant failure" data-sf-explore="Productive failure" tabindex="0" role="button"><span class="sf-code"><svg class="sf-i" aria-hidden="true"><use href="#sf-productive"/></svg>Failure / capacity rises</span><h3>Productive failure</h3><p>A bounded loss buys useful information, preserves options, and improves the next attempt.</p></article>
      <article class="sf-quadrant success" data-sf-explore="Real success" tabindex="0" role="button"><span class="sf-code"><svg class="sf-i" aria-hidden="true"><use href="#sf-real"/></svg>Success / capacity rises</span><h3>Real success</h3><p>Reward arrives with capability, ownership, trust, energy, or stronger future choices.</p></article>
      <article class="sf-quadrant failure" data-sf-explore="Destructive failure" tabindex="0" role="button"><span class="sf-code"><svg class="sf-i" aria-hidden="true"><use href="#sf-destructive"/></svg>Failure / capacity falls</span><h3>Destructive failure</h3><p>The loss damages solvency, integrity, health, reputation, or the ability to continue.</p></article>
      <article class="sf-quadrant success" data-sf-explore="False success" tabindex="0" role="button"><span class="sf-code"><svg class="sf-i" aria-hidden="true"><use href="#sf-false"/></svg>Success / capacity falls</span><h3>False success</h3><p>Visible gain hides depletion, dependency, concentration, identity lock-in, or lost autonomy.</p></article>
    </div>
    <div class="sf-axis sf-axis-x"><span>Visible failure</span><span>Visible success</span></div>
  </div>

  <p class="sf-explore-read" data-sf-read="four-outcomes" role="status">Select a quadrant to isolate the visible result from what the next round inherits.</p>

  <div class="sf-pair-eq">
    <div class="sf-eq compact"><p class="eq">L + O<sub>p</sub> &gt; C<sub>f</sub></p><p class="gloss">A failure is productive when learning and option value exceed its cost.</p></div>
    <div class="sf-eq compact"><p class="eq">H<sub>c</sub> &gt; G<sub>t</sub></p><p class="gloss">A success is false when its hidden long-term cost exceeds its total gain.</p></div>
  </div>
  <dl class="sf-terms sf-shared-terms">
    <div><dt>L</dt><dd>learning value</dd></div><div><dt>O<sub>p</sub></dt><dd>option value preserved or created</dd></div>
    <div><dt>C<sub>f</sub></dt><dd>full cost of the failure</dd></div><div><dt>H<sub>c</sub></dt><dd>hidden long-term cost</dd></div>
    <div><dt>G<sub>t</sub></dt><dd>total gain, including future effects</dd></div><div><dt>&gt;</dt><dd>the left side outweighs the right</dd></div>
  </dl>
</section>

<section class="sf-part sf-prose" id="diagnosis">
  <h2><span class="n">02</span> Diagnose before reacting <svg class="sf-i"><use href="#sf-diagnose"/></svg></h2>
  <p class="sf-deck">Separate what happened from the verdict you are tempted to draw about yourself.</p>

  <figure class="sf-fig" id="sfig-narrow">
    <figcaption><span class="n">Figure 3</span><b>Each answer removes a cause</b><em>Answer what you can.</em></figcaption>
    <div class="sf-fig-body">
      <div class="sx-qs" id="sx-qs" role="group" aria-label="Rule out what you can"></div>
      <div class="sx-causes" id="sx-causes"></div>
      <p id="sx-narrow-say" role="status"></p>
    </div>
  </figure>

  <div class="sf-cause-orbit">
    <div class="sf-cause-core"><svg class="sf-i"><use href="#sf-outcome"/></svg><span>Result</span></div>
    {% assign causes = "Skill,Strategy,Timing,Environment,Players,Information,Luck,Execution" | split: "," %}
    {% assign cause_icons = "sf-learning,sf-strategy,sf-timing,sf-geography,sf-players,sf-information,sf-noise,sf-execution" | split: "," %}
    {% for cause in causes %}<span class="sf-cause c{{ forloop.index }}"><svg class="sf-i" aria-hidden="true"><use href="#{{ cause_icons[forloop.index0] }}"/></svg>{{ cause }}</span>{% endfor %}
  </div>

  <div class="sf-diagnostic-grid">
    <article><span class="sf-num">01</span><svg class="sf-i" aria-hidden="true"><use href="#sf-objective"/></svg><h3>Objective</h3><p>Was the intended result still worth wanting?</p></article>
    <article><span class="sf-num">02</span><svg class="sf-i" aria-hidden="true"><use href="#sf-strategy"/></svg><h3>Strategy</h3><p>Was the chosen route suited to the objective?</p></article>
    <article><span class="sf-num">03</span><svg class="sf-i" aria-hidden="true"><use href="#sf-execution"/></svg><h3>Execution</h3><p>Was the plan carried out to the required standard?</p></article>
    <article><span class="sf-num">04</span><svg class="sf-i" aria-hidden="true"><use href="#sf-timing"/></svg><h3>Timing</h3><p>Did the move fit the current regime?</p></article>
    <article><span class="sf-num">05</span><svg class="sf-i" aria-hidden="true"><use href="#sf-information"/></svg><h3>Information</h3><p>Which hidden variable changed the result?</p></article>
    <article><span class="sf-num">06</span><svg class="sf-i" aria-hidden="true"><use href="#sf-players"/></svg><h3>Response</h3><p>Did another player react differently than expected?</p></article>
    <article><span class="sf-num">07</span><svg class="sf-i" aria-hidden="true"><use href="#sf-noise"/></svg><h3>Noise</h3><p>Could the result be ordinary randomness?</p></article>
  </div>
  <div class="sf-failure-types" aria-label="Five failure types and their responses">
    <article><span>I</span><svg class="sf-i" aria-hidden="true"><use href="#sf-execution"/></svg><h3>Execution</h3><p>The game and objective fit. Train, practise, and improve the system.</p></article>
    <article><span>II</span><svg class="sf-i" aria-hidden="true"><use href="#sf-strategy"/></svg><h3>Strategy</h3><p>The objective fits; the route does not. Change the method.</p></article>
    <article><span>III</span><svg class="sf-i" aria-hidden="true"><use href="#sf-arena"/></svg><h3>Selection</h3><p>The market, partner, employer, or arena does not fit. Move the game.</p></article>
    <article><span>IV</span><svg class="sf-i" aria-hidden="true"><use href="#sf-timing"/></svg><h3>Timing</h3><p>The strategy may work later. Preserve the option and build readiness.</p></article>
    <article><span>V</span><svg class="sf-i" aria-hidden="true"><use href="#sf-objective"/></svg><h3>Objective</h3><p>Success exposed the wrong goal. Use the new value information to redesign it.</p></article>
  </div>
  <p class="sf-rule"><svg class="sf-i"><use href="#sf-identity"/></svg><span>One result cannot reveal its own cause. Test possible causes instead of drawing conclusions about who you are.</span></p>
</section>

<section class="sf-part sf-prose" id="lanes">
  <h2><span class="n">03</span> What to do after a win or loss <svg class="sf-i"><use href="#sf-route"/></svg></h2>
  <p class="sf-deck">Success needs restraint before scale. Failure needs stability before another bet.</p>

  <figure class="sf-fig" id="sfig-order">
    <figcaption><span class="n">Figure 4</span><b>Skipping steps changes the result</b><em>Start from a later step and see the cost.</em></figcaption>
    <div class="sf-fig-body">
      <div class="sx-toggle" id="sx-lane" role="group" aria-label="Choose a lane">
        <button type="button" data-lane="win" class="is-on">After a win</button>
        <button type="button" data-lane="loss">After a loss</button>
      </div>
      <ol class="sx-steps" id="sx-steps"></ol>
      <label class="sf-fig-ctl"><span>Where you start</span>
        <input type="range" id="sx-start" min="1" max="5" value="1" step="1"></label>
      <div class="sf-fig-read">
        <div><b id="sx-skipped">0</b><span>steps skipped</span></div>
        <p id="sx-order-say" role="status"></p>
      </div>
    </div>
  </figure>

  <div class="sf-lanes">
    <article class="sf-lane success">
      <header><span><svg class="sf-i" aria-hidden="true"><use href="#sf-win"/></svg>After a win</span><h3>Validate, then scale</h3></header>
      <ol>
        <li><b>Attribute.</b><span>Separate skill, process, timing, network, environment, and luck.</span></li>
        <li><b>Repeat.</b><span>One win is interesting. Independent repetition suggests a mechanism.</span></li>
        <li><b>Stress-test.</b><span>Ask what breaks at ten times the size and what remains if it disappears.</span></li>
        <li><b>Capture.</b><span>Turn the result into skill, capital, ownership, proof, a system, or a relationship.</span></li>
        <li><b>Scale.</b><span>Increase exposure only while fit, survivability, and capacity remain intact.</span></li>
      </ol>
    </article>
    <article class="sf-lane failure">
      <header><span><svg class="sf-i" aria-hidden="true"><use href="#sf-loss"/></svg>After a loss</span><h3>Stabilize, then choose</h3></header>
      <ol>
        <li><b>Stabilize.</b><span>Protect money, health, confidence, relationships, attention, and reputation.</span></li>
        <li><b>Locate.</b><span>Find where reality first diverged from the model.</span></li>
        <li><b>Separate.</b><span>Distinguish signal from noise and arena error from personal inadequacy.</span></li>
        <li><b>Extract.</b><span>Write down the information purchased and the system change it requires.</span></li>
        <li><b>Respond.</b><span>Retry, adapt, pause, hedge, or exit at an appropriate size.</span></li>
      </ol>
    </article>
  </div>

  <div class="sf-eq"><p class="eq">Scale intensity &prop; E &times; R &times; S</p>
    <dl class="sf-terms"><div><dt>&prop;</dt><dd>should rise or fall with the factors on the right</dd></div><div><dt>E</dt><dd>strength of the evidence</dd></div><div><dt>R</dt><dd>repeatability across independent attempts</dd></div><div><dt>S</dt><dd>survivability if the larger bet fails</dd></div><div><dt>&times;</dt><dd>a weak factor should sharply limit scale</dd></div></dl>
  </div>
</section>

<section class="sf-part sf-prose" id="router">
  <h2><span class="n">04</span> Route the next move <svg class="sf-i"><use href="#sf-route"/></svg></h2>
  <p class="sf-deck">Answer from current evidence. The router names a response and shows why it fits.</p>
  <div class="sf-router" id="sf-router">
    <div class="sf-router-progress"><span id="sf-router-step">Question 1 of 5</span><div><i id="sf-router-bar"></i></div></div>
    <div class="sf-router-stage" id="sf-router-stage" aria-live="polite"></div>
    <div class="sf-router-actions" id="sf-router-actions"></div>
    <div class="sf-router-result" id="sf-router-result" hidden></div>
  </div>
  <noscript><p class="sf-rule">JavaScript is off. Use the action cards below as the complete decision key.</p></noscript>
  <div class="sf-action-key">
    {% for action in site.data.success_failure.actions %}
    <article><svg class="sf-i"><use href="#{{ action.icon }}"/></svg><div><h3>{{ action.title }}</h3><p>{{ action.summary }}</p></div></article>
    {% endfor %}
  </div>
</section>

<section class="sf-part sf-prose" id="guardrails">
  <h2><span class="n">05</span> Keep the system playable <svg class="sf-i"><use href="#sf-shield"/></svg></h2>
  <p class="sf-deck">The same idea can be intelligent at five percent exposure and foolish at one hundred percent.</p>
  <div class="sf-exposure">
    <div class="sf-exposure-track"><span class="probe">Probe</span><span class="position">Position</span><span class="commit">Commit</span></div>
    <div class="sf-dial">
      <label class="sf-dial-label" for="sf-exposure">Exposure on this bet</label>
      <input class="sf-range" id="sf-exposure" type="range" min="0" max="100" step="1" value="5">
      <div class="sf-dial-read">
        <span class="pct"><b id="sf-exposure-pct">5</b>%</span>
        <span class="band" id="sf-exposure-band">Probe</span>
        <p id="sf-exposure-say" role="status"></p>
      </div>
    </div>
    <div class="sf-guard-grid">
      <article><svg class="sf-i" aria-hidden="true"><use href="#sf-ruin"/></svg><h3>Ruin</h3><p>Do not risk permanent damage to buy information available through a smaller experiment.</p></article>
      <article><svg class="sf-i" aria-hidden="true"><use href="#sf-sunk"/></svg><h3>Sunk cost</h3><p>Ask whether you would enter today. Past investment matters only when it changed future value.</p></article>
      <article><svg class="sf-i" aria-hidden="true"><use href="#sf-emotion"/></svg><h3>Emotional load</h3><p>As emotional load rises, reduce decision irreversibility and commitment size.</p></article>
      <article><svg class="sf-i" aria-hidden="true"><use href="#sf-concentration"/></svg><h3>Concentration</h3><p>Diversify before one client, institution, person, platform, or identity controls too much value.</p></article>
      <article><svg class="sf-i" aria-hidden="true"><use href="#sf-budget"/></svg><h3>Failure budget</h3><p>Fund bounded losses that buy learning. Do not let experiments threaten the foundation.</p></article>
      <article><svg class="sf-i" aria-hidden="true"><use href="#sf-bandwidth"/></svg><h3>Capacity</h3><p>Every opportunity consumes time, attention, and energy. It can also narrow what others expect you to keep doing.</p></article>
    </div>
  </div>
  <div class="sf-eq"><p class="eq">D<sub>t</sub> = B<sub>f</sub> &minus; C<sub>f</sub></p>
    <dl class="sf-terms"><div><dt>D<sub>t</sub></dt><dd>the decision at the current time</dd></div><div><dt>B<sub>f</sub></dt><dd>future benefits from continuing</dd></div><div><dt>C<sub>f</sub></dt><dd>future costs of continuing</dd></div><div><dt>&minus;</dt><dd>compare forward consequences without adding past investment</dd></div></dl>
  </div>
</section>

<section class="sf-part sf-prose" id="domains">
  <h2><span class="n">06</span> Read the signal across 18 domains <svg class="sf-i"><use href="#sf-repeat"/></svg></h2>
  <p class="sf-deck">A win in one area can hide damage in another. Review the whole system before calling the direction successful.</p>
  <div class="sf-domains">
    {% for domain in site.data.success_failure.domains %}
    <details {% if forloop.first %}open{% endif %}{% if domain.viz %} data-viz="{{ domain.viz | jsonify | escape }}"{% endif %}>
      <summary><span class="ico"><svg class="sf-i"><use href="#{{ domain.icon }}"/></svg></span><span>{{ domain.title }}</span><i aria-hidden="true"></i></summary>
      <div class="sf-domain-body">
        <p class="sig is-good"><b><svg class="sf-i" aria-hidden="true"><use href="#sf-rising"/></svg>Good signal</b>{{ domain.good }}</p>
        <p class="sig is-false"><b><svg class="sf-i" aria-hidden="true"><use href="#sf-false"/></svg>False signal</b>{{ domain.false_signal }}</p>
        <p class="sig is-next"><b><svg class="sf-i" aria-hidden="true"><use href="#sf-route"/></svg>Next response</b>{{ domain.response }}</p>
        <div class="sf-rate" data-domain="{{ domain.title | slugify }}" role="group" aria-label="Rate {{ domain.title }}">
          <span class="k">Where is this one heading?</span>
          <div class="sf-rate-btns">
            <button type="button" data-v="-1" aria-pressed="false"><svg class="sf-i" aria-hidden="true"><use href="#sf-falling"/></svg>Falling</button>
            <button type="button" data-v="0" aria-pressed="false"><svg class="sf-i" aria-hidden="true"><use href="#sf-flat"/></svg>Flat</button>
            <button type="button" data-v="1" aria-pressed="false"><svg class="sf-i" aria-hidden="true"><use href="#sf-rising"/></svg>Rising</button>
          </div>
        </div>
      </div>
    </details>
    {% endfor %}
  </div>

  <div class="sf-scorecard" id="sf-scorecard">
    <div class="sf-scorecard-head">
      <div>
        <p class="sf-card-k"><svg class="sf-i" aria-hidden="true"><use href="#sf-trajectory"/></svg>Whole-system read</p>
        <h3>Your eighteen, at a glance</h3>
      </div>
      <span class="sf-scorecard-count"><b id="sf-rated-n">0</b> of 18 rated</span>
    </div>
    <div class="sf-bars" id="sf-bars" role="img" aria-label="Bar for each domain you have rated"></div>
    <div class="sf-scorecard-legend" aria-hidden="true">
      <span class="up"><svg class="sf-i"><use href="#sf-rising"/></svg>rising</span>
      <span class="mid"><svg class="sf-i"><use href="#sf-flat"/></svg>flat</span>
      <span class="down"><svg class="sf-i"><use href="#sf-falling"/></svg>falling</span>
      <span class="none"><svg class="sf-i"><use href="#sf-lock"/></svg>not rated</span>
    </div>
    <p class="sf-scorecard-say" id="sf-scorecard-say" role="status"></p>
    <div class="sf-btn-row"><button class="sf-choice" id="sf-rate-reset" type="button">Clear my ratings</button></div>
  </div>
</section>

<section class="sf-part sf-prose" id="review">
  <h2><span class="n">07</span> Review the trajectory <svg class="sf-i"><use href="#sf-asset"/></svg></h2>
  <p class="sf-deck">Review outcomes often enough to catch a trap before it becomes an identity.</p>
  <div class="sf-review-switch" id="sf-review-switch" role="group" aria-label="Choose a review cadence"><button type="button" data-sf-review="monthly">Run monthly review</button><button type="button" data-sf-review="quarterly">Run quarterly review</button><button type="button" data-sf-review="alarms">Check alarm signals</button></div>
  <p class="sf-review-read" id="sf-review-read" role="status">Choose the review that matches the evidence you need.</p>
  <div class="sf-review">
    <article><span>Monthly</span><svg class="sf-i" aria-hidden="true"><use href="#sf-win"/></svg><h3>Wins</h3><p>What worked? Why? What became easier? Which durable asset resulted? What should remain small?</p></article>
    <article><span>Monthly</span><svg class="sf-i" aria-hidden="true"><use href="#sf-loss"/></svg><h3>Losses</h3><p>What failed? Where did reality diverge? What did it cost and teach? Retry, adapt, pause, hedge, or exit?</p></article>
    <article><span>Quarterly</span><svg class="sf-i" aria-hidden="true"><use href="#sf-system"/></svg><h3>System</h3><p>What compounds? What deteriorates? Which domain is the bottleneck? Where is risk concentrating?</p></article>
    <article><span>Quarterly</span><svg class="sf-i" aria-hidden="true"><use href="#sf-trajectory"/></svg><h3>Trajectory</h3><p>Does the highest score matter, or is it over-optimized? Does the lowest score constrain everything else?</p></article>
  </div>
  <div class="sf-warnings">
    <article><svg class="sf-i" aria-hidden="true"><use href="#sf-alarm"/></svg><h3>Success-trap alarms</h3><ul><li>I cannot leave because I make too much money.</li><li>The system cannot function without me.</li><li>I hate the lifestyle, but I am good at it.</li><li>One more achievement will let me live properly.</li></ul></article>
    <article><svg class="sf-i" aria-hidden="true"><use href="#sf-alarm"/></svg><h3>Failure alarms</h3><ul><li>The same error keeps returning.</li><li>Stakes rise after losses.</li><li>No one can state what the loss taught.</li><li>One noisy result triggers a permanent exit.</li></ul></article>
  </div>
</section>

<section class="sf-part sf-prose sf-closing" id="loops">
  <h2><span class="n">08</span> What the next round inherits <svg class="sf-i"><use href="#sf-repeat"/></svg></h2>
  <div class="sf-loops sf-loops-chain">
    <article class="good"><svg class="sf-i" aria-hidden="true"><use href="#sf-compound"/></svg><h3>Success that compounds</h3><p>Competence <span>&rarr;</span> value <span>&rarr;</span> evidence <span>&rarr;</span> reputation <span>&rarr;</span> ownership <span>&rarr;</span> better choices</p><small>while relationships, integrity, energy, and agency remain intact</small></article>
    <article class="recover"><svg class="sf-i" aria-hidden="true"><use href="#sf-repeat"/></svg><h3>Failure that teaches</h3><p>Failure <span>&rarr;</span> information <span>&rarr;</span> updated model <span>&rarr;</span> better strategy <span>&rarr;</span> smarter bet <span>&rarr;</span> capability</p><small>without paying twice for the same lesson</small></article>
    <article class="bad"><svg class="sf-i" aria-hidden="true"><use href="#sf-fragile"/></svg><h3>Failure that escalates</h3><p>Failure <span>&rarr;</span> ego threat <span>&rarr;</span> denial <span>&rarr;</span> larger bad bet <span>&rarr;</span> more failure</p><small>break this loop before sunk cost becomes identity</small></article>
  </div>
  <div class="sf-final-choice"><span><svg class="sf-i" aria-hidden="true"><use href="#sf-medal"/></svg>Choose</span><strong>Scale · Maintain · Adapt · Pause · Hedge · Exit</strong></div>
  <p class="sf-final">After each round, keep what improved your next attempt and stop what made the next mistake harder to survive.</p>

  <figure class="sf-fig" id="sfig-compound">
    <figcaption><span class="n">Figure 5</span><b>Both loops compound</b><em>Run the rounds.</em></figcaption>
    <div class="sf-fig-body">
      <svg class="sf-fig-svg" viewBox="0 0 560 180" role="img" aria-label="Three loops over repeated rounds: one opening options, one recovering, one closing them.">
        <line class="sx-ax" x1="34" y1="150" x2="534" y2="150"/>
        <line class="sx-ax" x1="34" y1="14" x2="34" y2="150"/>
        <text class="sx-lab" x="34" y="168">round 1</text>
        <text class="sx-lab sx-yl" x="0" y="0" text-anchor="middle" transform="translate(14 82) rotate(-90)">options open</text>
        <text class="sx-lab" x="534" y="168" text-anchor="end">round 12</text>
        <path class="sx-good" id="sx-good"/>
        <path class="sx-recover" id="sx-recover"/>
        <path class="sx-bad" id="sx-bad"/>
        <circle class="sx-dot-good" id="sx-dot-good" r="4.5"/>
        <circle class="sx-dot-recover" id="sx-dot-recover" r="4.5"/>
        <circle class="sx-dot-bad" id="sx-dot-bad" r="4.5"/>
      </svg>
      <label class="sf-fig-ctl"><span>Rounds played</span>
        <input type="range" id="sx-rounds" min="1" max="12" value="1" step="1"></label>
      <div class="sx-legend">
        <span class="lg-good"><i></i><span><b>Success that compounds</b><small>competence creates more credible choices</small></span></span>
        <span class="lg-recover"><i></i><span><b>Failure that teaches</b><small>the loss is paid once and becomes a better bet</small></span></span>
        <span class="lg-bad"><i></i><span><b>Failure that escalates</b><small>denial funds a larger bad bet</small></span></span>
      </div>
      <p class="sx-explain">The line is the options you still have. All three begin at
      100. No single round changes much, which is why the loop you are in is hard to feel
      from inside it.</p>
      <div class="sf-fig-read">
        <div class="is-ok"><b id="sx-v-good">100</b><span>compounds</span></div>
        <div class="is-warn"><b id="sx-v-recover">100</b><span>teaches</span></div>
        <div class="is-bad"><b id="sx-v-bad">100</b><span>escalates</span></div>
        <p id="sx-loops-say" role="status"></p>
      </div>
    </div>
  </figure>
</section>

<section class="sf-part sf-milestones" id="milestones" aria-label="Life phase milestones">
  <figure class="sf-phase-map sf-milestone-visual">
    <figcaption><span>Milestone graph</span><b>Life phases</b></figcaption>
    <ol class="sf-phase-path" id="sf-phase-path">
      <li><button type="button" data-phase="proving"><span>01</span><b>Proving capability</b><small>skill · proof · fit</small></button></li>
      <li><button type="button" data-phase="choosing"><span>02</span><b>Choosing direction</b><small>field · people · focus</small></button></li>
      <li><button type="button" data-phase="leverage"><span>03</span><b>Building an advantage</b><small>method · system · IP</small></button></li>
      <li><button type="button" data-phase="ownership"><span>04</span><b>Expanding ownership</b><small>equity · assets · upside</small></button></li>
      <li><button type="button" data-phase="authority"><span>05</span><b>Establishing authority</b><small>trust · selection · decisions</small></button></li>
      <li><button type="button" data-phase="scaling"><span>06</span><b>Scaling judgment</b><small>teams · systems · capital</small></button></li>
      <li><button type="button" data-phase="transmitting"><span>07</span><b>Allocating &amp; transmitting</b><small>guide · govern · teach</small></button></li>
    </ol>
    <div class="sf-phase-detail" id="sf-phase-detail" aria-live="polite" hidden>
      <div class="sf-phase-detail-visual" id="sf-phase-detail-visual" aria-hidden="true"></div>
      <div class="sf-phase-detail-copy">
        <header><span id="sf-phase-detail-number"></span><h3 id="sf-phase-detail-title"></h3></header>
        <p id="sf-phase-detail-explanation"></p>
        <div class="sf-phase-order"><span>Why this position</span><p id="sf-phase-detail-order"></p></div>
        <div class="sf-phase-criteria">
          <div class="sf-phase-criteria-tabs" role="tablist" aria-label="Milestone readiness categories">
            <button type="button" role="tab" data-criterion="prerequisites">Prerequisites</button>
            <button type="button" role="tab" data-criterion="hard">Hard skills</button>
            <button type="button" role="tab" data-criterion="soft">Soft skills</button>
            <button type="button" role="tab" data-criterion="requirements">Requirements</button>
            <button type="button" role="tab" data-criterion="readiness">Ready when</button>
          </div>
          <div class="sf-phase-criteria-panel" role="tabpanel">
            <span id="sf-phase-criteria-label"></span>
            <ul id="sf-phase-criteria-list"></ul>
          </div>
        </div>
        <div class="sf-phase-gate"><span id="sf-phase-detail-gate-label">Gate to the next milestone</span><strong id="sf-phase-detail-gate"></strong></div>
      </div>
    </div>
  </figure>

  <figure class="sf-architecture-visual">
    <figcaption><span>Success architecture</span><b>Value + freedom</b></figcaption>
    <div class="sf-architecture-map" role="img" aria-label="Mastery, autonomy, ownership, judgment, strong relationships, and sustainable energy converge into value and freedom.">
      <span class="sf-arch-node sf-arch-1">Mastery</span>
      <span class="sf-arch-node sf-arch-2">Autonomy</span>
      <span class="sf-arch-node sf-arch-3">Ownership</span>
      <span class="sf-arch-node sf-arch-4">Judgment</span>
      <span class="sf-arch-node sf-arch-5">Strong<br>relationships</span>
      <span class="sf-arch-node sf-arch-6">Sustainable<br>energy</span>
      <span class="sf-arch-core">Value<br><i>+</i><br>freedom</span>
      <svg viewBox="0 0 600 360" aria-hidden="true" preserveAspectRatio="none">
        <path d="M300 180L300 44M300 180L485 86M300 180L485 274M300 180L300 316M300 180L115 274M300 180L115 86"/>
      </svg>
    </div>
  </figure>
</section>
