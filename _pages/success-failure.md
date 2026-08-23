---
layout: page
title: Success & Failure
subtitle: Diagnose the outcome. Protect the larger game. Choose the next move.
description: A visual operating manual for diagnosing wins and losses, scaling repeatable success, recovering from failure, and deciding when to adapt, pause, hedge, or exit.
permalink: /success-failure/
layout-class: page success-failure
extra_css: /css/success-failure.css
extra_js: /js/components/success-failure.js
---

<div class="sf-progress" aria-hidden="true"><span id="sf-progress-fill"></span></div>
{% include success-failure-icons.html %}

<section class="sf-part sf-prose sf-opening" id="outcome">
  <p class="sf-kicker">An operating manual for the result after the plan</p>
  <p class="sf-lead">Treat the outcome as evidence.</p>
  <p>A particular strategy, used under particular conditions, produced a result. The next job is to
  learn what caused it without turning one win into proof of brilliance or one loss into proof of
  incompetence.</p>

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
  <p class="sf-deck">The visible result tells only half the story. The other half is what it does to
  future capacity.</p>

  <div class="sf-matrix" aria-label="Outcome matrix comparing visible result with future capacity">
    <div class="sf-axis sf-axis-y"><span>Future capacity falls</span><span>Future capacity rises</span></div>
    <div class="sf-quadrants">
      <article class="sf-quadrant failure"><span class="sf-code">Failure / capacity rises</span><h3>Productive failure</h3><p>A bounded loss buys useful information, preserves options, and improves the next attempt.</p></article>
      <article class="sf-quadrant success"><span class="sf-code">Success / capacity rises</span><h3>Real success</h3><p>Reward arrives with capability, ownership, trust, energy, or stronger future choices.</p></article>
      <article class="sf-quadrant failure"><span class="sf-code">Failure / capacity falls</span><h3>Destructive failure</h3><p>The loss damages solvency, integrity, health, reputation, or the ability to continue.</p></article>
      <article class="sf-quadrant success"><span class="sf-code">Success / capacity falls</span><h3>False success</h3><p>Visible gain hides depletion, dependency, concentration, identity lock-in, or lost autonomy.</p></article>
    </div>
    <div class="sf-axis sf-axis-x"><span>Visible failure</span><span>Visible success</span></div>
  </div>

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
  <p class="sf-deck">Freeze unnecessary escalation. Separate what happened from the story you are
  tempted to tell about it.</p>

  <div class="sf-cause-orbit">
    <div class="sf-cause-core"><svg class="sf-i"><use href="#sf-outcome"/></svg><span>Result</span></div>
    {% assign causes = "Skill,Strategy,Timing,Environment,Players,Information,Luck,Execution" | split: "," %}
    {% for cause in causes %}<span class="sf-cause c{{ forloop.index }}">{{ cause }}</span>{% endfor %}
  </div>

  <div class="sf-diagnostic-grid">
    <article><span class="sf-num">01</span><h3>Objective</h3><p>Was the intended result still worth wanting?</p></article>
    <article><span class="sf-num">02</span><h3>Strategy</h3><p>Was the chosen route suited to the objective?</p></article>
    <article><span class="sf-num">03</span><h3>Execution</h3><p>Was the plan carried out to the required standard?</p></article>
    <article><span class="sf-num">04</span><h3>Timing</h3><p>Did the move fit the current regime?</p></article>
    <article><span class="sf-num">05</span><h3>Information</h3><p>Which hidden variable changed the result?</p></article>
    <article><span class="sf-num">06</span><h3>Response</h3><p>Did another player react differently than expected?</p></article>
    <article><span class="sf-num">07</span><h3>Noise</h3><p>Could the result be ordinary randomness?</p></article>
  </div>
  <div class="sf-failure-types" aria-label="Five failure types and their responses">
    <article><span>I</span><h3>Execution</h3><p>The game and objective fit. Train, practise, and improve the system.</p></article>
    <article><span>II</span><h3>Strategy</h3><p>The objective fits; the route does not. Change the method.</p></article>
    <article><span>III</span><h3>Selection</h3><p>The market, partner, employer, or arena does not fit. Move the game.</p></article>
    <article><span>IV</span><h3>Timing</h3><p>The strategy may work later. Preserve the option and build readiness.</p></article>
    <article><span>V</span><h3>Objective</h3><p>Success exposed the wrong goal. Use the new value information to redesign it.</p></article>
  </div>
  <p class="sf-rule"><svg class="sf-i"><use href="#sf-identity"/></svg><span>One result cannot identify its own cause. Use hypotheses, not identity conclusions.</span></p>
</section>

<section class="sf-part sf-prose" id="lanes">
  <h2><span class="n">03</span> Two operating lanes <svg class="sf-i"><use href="#sf-route"/></svg></h2>
  <p class="sf-deck">Success needs restraint before scale. Failure needs stability before another bet.</p>

  <div class="sf-lanes">
    <article class="sf-lane success">
      <header><span>After a win</span><h3>Validate, then scale</h3></header>
      <ol>
        <li><b>Attribute.</b><span>Separate skill, process, timing, network, environment, and luck.</span></li>
        <li><b>Repeat.</b><span>One win is interesting. Independent repetition suggests a mechanism.</span></li>
        <li><b>Stress-test.</b><span>Ask what breaks at ten times the size and what remains if it disappears.</span></li>
        <li><b>Capture.</b><span>Turn the result into skill, capital, ownership, proof, a system, or a relationship.</span></li>
        <li><b>Scale.</b><span>Increase exposure only while fit, survivability, and capacity remain intact.</span></li>
      </ol>
    </article>
    <article class="sf-lane failure">
      <header><span>After a loss</span><h3>Stabilize, then choose</h3></header>
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
    <div class="sf-exposure-track" aria-hidden="true"><span class="probe">Probe</span><span class="position">Position</span><span class="commit">Commit</span></div>
    <div class="sf-guard-grid">
      <article><h3>Ruin</h3><p>Do not risk permanent damage to buy information available through a smaller experiment.</p></article>
      <article><h3>Sunk cost</h3><p>Ask whether you would enter today. Past investment matters only when it changed future value.</p></article>
      <article><h3>Emotional load</h3><p>As emotional load rises, reduce decision irreversibility and commitment size.</p></article>
      <article><h3>Concentration</h3><p>Diversify before one client, institution, person, platform, or identity controls too much value.</p></article>
      <article><h3>Failure budget</h3><p>Fund bounded losses that buy learning. Do not let experiments threaten the foundation.</p></article>
      <article><h3>Success capacity</h3><p>Every opportunity displaces time, attention, energy, reputation, and identity bandwidth.</p></article>
    </div>
  </div>
  <div class="sf-eq"><p class="eq">D<sub>t</sub> = B<sub>f</sub> &minus; C<sub>f</sub></p>
    <dl class="sf-terms"><div><dt>D<sub>t</sub></dt><dd>the decision at the current time</dd></div><div><dt>B<sub>f</sub></dt><dd>future benefits from continuing</dd></div><div><dt>C<sub>f</sub></dt><dd>future costs of continuing</dd></div><div><dt>&minus;</dt><dd>compare forward consequences without adding past investment</dd></div></dl>
  </div>
</section>

<section class="sf-part sf-prose" id="domains">
  <h2><span class="n">06</span> Read the signal across 18 domains <svg class="sf-i"><use href="#sf-repeat"/></svg></h2>
  <p class="sf-deck">A win in one domain can conceal damage in another. Review the whole system before calling the trajectory successful.</p>
  <div class="sf-domains">
    {% for domain in site.data.success_failure.domains %}
    <details {% if forloop.first %}open{% endif %}>
      <summary><span class="ico"><svg class="sf-i"><use href="#{{ domain.icon }}"/></svg></span><span>{{ domain.title }}</span><i aria-hidden="true"></i></summary>
      <div class="sf-domain-body"><p><b>Good signal</b>{{ domain.good }}</p><p><b>False signal</b>{{ domain.false }}</p><p><b>Next response</b>{{ domain.response }}</p></div>
    </details>
    {% endfor %}
  </div>
</section>

<section class="sf-part sf-prose" id="review">
  <h2><span class="n">07</span> Review the trajectory <svg class="sf-i"><use href="#sf-asset"/></svg></h2>
  <p class="sf-deck">Review outcomes often enough to catch a trap before it becomes an identity.</p>
  <div class="sf-review">
    <article><span>Monthly</span><h3>Wins</h3><p>What worked? Why? What became easier? Which durable asset resulted? What should remain small?</p></article>
    <article><span>Monthly</span><h3>Losses</h3><p>What failed? Where did reality diverge? What did it cost and teach? Retry, adapt, pause, hedge, or exit?</p></article>
    <article><span>Quarterly</span><h3>System</h3><p>What compounds? What deteriorates? Which domain is the bottleneck? Where is risk concentrating?</p></article>
    <article><span>Quarterly</span><h3>Trajectory</h3><p>Does the highest score matter, or is it over-optimized? Does the lowest score constrain everything else?</p></article>
  </div>
  <div class="sf-warnings">
    <article><h3>Success-trap alarms</h3><ul><li>I cannot leave because I make too much money.</li><li>The system cannot function without me.</li><li>I hate the lifestyle, but I am good at it.</li><li>One more achievement will let me live properly.</li></ul></article>
    <article><h3>Failure alarms</h3><ul><li>The same error keeps returning.</li><li>Stakes rise after losses.</li><li>No one can state what the loss taught.</li><li>One noisy result triggers a permanent exit.</li></ul></article>
  </div>
</section>

<section class="sf-part sf-prose sf-closing" id="loops">
  <h2><span class="n">08</span> What the next round inherits <svg class="sf-i"><use href="#sf-repeat"/></svg></h2>
  <div class="sf-loops">
    <article class="good"><h3>Success that compounds</h3><p>Competence <span>&rarr;</span> value <span>&rarr;</span> evidence <span>&rarr;</span> reputation <span>&rarr;</span> ownership <span>&rarr;</span> better choices</p><small>while relationships, integrity, energy, and agency remain intact</small></article>
    <article class="recover"><h3>Failure that teaches</h3><p>Failure <span>&rarr;</span> information <span>&rarr;</span> updated model <span>&rarr;</span> better strategy <span>&rarr;</span> smarter bet <span>&rarr;</span> capability</p><small>without paying twice for the same lesson</small></article>
    <article class="bad"><h3>Failure that escalates</h3><p>Failure <span>&rarr;</span> ego threat <span>&rarr;</span> denial <span>&rarr;</span> larger bad bet <span>&rarr;</span> more failure</p><small>break this loop before sunk cost becomes identity</small></article>
  </div>
  <div class="sf-final-choice"><span>Choose</span><strong>Scale · Maintain · Adapt · Pause · Hedge · Exit</strong></div>
  <p class="sf-final">Success should make future success easier without making the person more fragile; failure should make future failure less likely without destroying the resources required to continue playing.</p>
</section>
