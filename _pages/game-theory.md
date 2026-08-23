---
layout: page
title: Game Theory of Life
subtitle: Other people respond to your decisions. Plan for what they do next.
description: A practical note on strategic decisions, with eight payoff matrices, a cooperation model, a ruin simulation, and a bottleneck check.
permalink: /game-theory/
layout-class: page game-theory
extra_css: /css/game-theory.css
extra_js: /js/components/game-theory.js
---

<div class="gt-progress" aria-hidden="true"><span id="gt-progress-fill"></span></div>

<script type="application/json" id="gt-data">{{ site.data.game_theory | jsonify }}</script>

{% include game-theory-icons.html %}

<!-- ═══════════════════════════════════════════════════════
     00 · THE SHIFT
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="shift">
  <p class="gt-deck">Most important decisions involve other people. They respond to your move, and
  their response changes what your move was worth.</p>

  <p>Ask whether a choice still works after everyone responds. A good first move can produce a bad
  final position.</p>

  <p>I use this as a working note. A script computes every equilibrium because Chicken and Stag Hunt
  are easy to remember backwards. Bad maths quickly becomes bad advice.</p>

  <div class="gt-eq">
    <p class="eq">
      <span class="op">max</span><sub>a</sub> &nbsp; EV(<span class="op">a</span>)
      &nbsp;&minus;&nbsp; BR(<span class="op">a</span>)
    </p>
    <p class="gloss"><b>EV</b> is the value of an action before anyone responds. <b>BR</b> is the cost
    of the other players' best response. Leaving out that second term makes predictable outcomes
    look surprising.</p>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     01 · EIGHT GAMES
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="games">
  <h2><span class="n">01</span> Eight games you are already in <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-equilibrium"/></svg></h2>
  <p class="gt-deck">Recurring problems often share the same structure. Once you recognise it, the
  available moves become clearer.</p>

  <p>Read a matrix like this. You pick a row, the other player picks a column, and the cell shows
  what each of you gets as <span class="m">(u<sub>you</sub>, u<sub>them</sub>)</span>. A cell is a
  <b>Nash equilibrium</b> when neither of you improves by changing alone:</p>

  <div class="gt-eq">
    <p class="eq">
      u<sub>1</sub>(<span class="op">s</span><sub>1</sub><sup>*</sup>, <span class="op">s</span><sub>2</sub><sup>*</sup>)
      &nbsp;&ge;&nbsp;
      u<sub>1</sub>(<span class="op">s</span><sub>1</sub>, <span class="op">s</span><sub>2</sub><sup>*</sup>)
      &nbsp;&nbsp;<span class="op">for all</span> <span class="op">s</span><sub>1</sub>
    </p>
    <p class="gloss">And symmetrically for player two. Equilibrium means <b>stable</b>, not
    <b>good</b>. The Prisoner's Dilemma has exactly one equilibrium and both players would rather
    be somewhere else.</p>
  </div>

  <div class="gt-lab">
    <div class="gt-lab-head">
      <div>
        <p class="t-eyebrow">Solver</p>
        <h5>Pick a game, then click a cell</h5>
      </div>
      <span class="gt-hint">NE marked by the solver, not by hand</span>
    </div>
    <div class="gt-game-tabs" id="gt-game-tabs" role="group" aria-label="Choose a game"></div>
    <div class="gt-game-wrap">
      <div>
        <div class="gt-matrix-scroll" id="gt-matrix-host"></div>
        <p class="gt-hint" id="gt-matrix-cap" style="margin-top:0.6rem"></p>
      </div>
      <div class="gt-game-read" id="gt-game-read" role="status"></div>
    </div>
  </div>

  <p>Two things worth noticing as you click through. The Prisoner's Dilemma and Public Goods are the
  only games where both players have a <b>dominant strategy</b>, and in both the dominant strategy
  leads somewhere neither wanted. Matching Pennies is the only genuinely zero-sum game here, and the
  only one with no stable pure strategy at all.</p>

  <p>Salary talks, arguments with a partner and supplier negotiations rarely have a fixed pot. How
  you play can create or destroy value. You can win the argument and leave both sides worse off.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     02 · THE HORIZON
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="horizon">
  <h2><span class="n">02</span> Why the horizon changes the answer <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-repeat"/></svg></h2>
  <p class="gt-deck">Repeat the Prisoner's Dilemma and cooperation can become rational. The people
  stay the same; the prospect of another round changes their incentives.</p>

  <p>Suppose you cooperate as long as they do, and stop for good if they betray you. Cooperating
  forever is worth <span class="m">R + δR + δ<sup>2</sup>R + …</span>, and betraying once pays
  <span class="m">T</span> now and <span class="m">P</span> forever after. Cooperation survives
  when:</p>

  <div class="gt-eq">
    <p class="eq">
      <span class="frac"><span>R</span><span>1 &minus; δ</span></span>
      &nbsp;&ge;&nbsp;
      T + <span class="frac"><span>δP</span><span>1 &minus; δ</span></span>
      &nbsp;&nbsp;&hArr;&nbsp;&nbsp;
      δ &nbsp;&ge;&nbsp; <span class="frac"><span>T &minus; R</span><span>T &minus; P</span></span>
    </p>
    <dl class="gt-terms">
      <div class="gt-term"><dt>δ</dt><dd>how much the next round is worth relative to this one, so how much the future matters</dd></div>
      <div class="gt-term"><dt>T</dt><dd>temptation, what betraying a cooperator pays</dd></div>
      <div class="gt-term"><dt>R</dt><dd>reward for mutual cooperation</dd></div>
      <div class="gt-term"><dt>P</dt><dd>punishment when both defect</dd></div>
    </dl>
  </div>

  <div class="gt-lab">
    <div class="gt-lab-head">
      <div>
        <p class="t-eyebrow">Model</p>
        <h5>Move the horizon</h5>
      </div>
      <span class="gt-hint">Values read from the matrix above</span>
    </div>
    <div class="gt-delta-wrap">
      <svg class="gt-delta" viewBox="0 0 540 226" role="img"
           aria-label="Two curves showing the value of cooperating versus defecting as the discount factor rises.">
        <line class="grid" x1="56" y1="30" x2="500" y2="30"/>
        <line class="grid" x1="56" y1="70" x2="500" y2="70"/>
        <line class="grid" x1="56" y1="110" x2="500" y2="110"/>
        <line class="grid" x1="56" y1="150" x2="500" y2="150"/>
        <line class="ax" x1="56" y1="20" x2="56" y2="190"/>
        <line class="ax" x1="56" y1="190" x2="508" y2="190"/>
        <path class="curve-defect" id="gt-delta-defect"/>
        <path class="curve-coop" id="gt-delta-coop"/>
        <line class="thresh" id="gt-delta-thresh" x1="56" y1="20" x2="56" y2="190"/>
        <text class="clab" id="gt-delta-thresh-lab" x="56" y="14" fill="var(--accent)">δ*</text>
        <line class="scrub" id="gt-delta-scrub" x1="56" y1="20" x2="56" y2="190"/>
        <circle class="dot-coop" id="gt-delta-dot-coop" cx="56" cy="150" r="4.5"/>
        <circle class="dot-defect" id="gt-delta-dot-defect" cx="56" cy="150" r="4.5"/>
        <text class="clab" x="330" y="52" fill="var(--cta)">keep cooperating</text>
        <text class="clab" x="330" y="176" fill="var(--muted)">betray once, then nothing</text>
        <text class="tick" x="56" y="210">δ = 0 &nbsp;no future</text>
        <text class="tick" x="500" y="210" text-anchor="end">δ → 1 &nbsp;future dominates</text>
      </svg>
      <div class="gt-delta-read" id="gt-delta-read" role="status"></div>
    </div>
    <label class="gt-sr" for="gt-delta-range">How much the future matters</label>
    <input class="gt-range" id="gt-delta-range" type="range" min="0" max="94" value="30" step="1">
  </div>

  <p>Trustworthiness depends partly on the situation. A
  contractor who will never see you again, a colleague in their notice period, a counterparty in a
  one-off deal: each is in a low <span class="m">δ</span> game whatever their character. If you want
  cooperation, lengthen the relationship or add a stake that outlives it. Changing the incentive
  may be easier than replacing the person.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     03 · SEVEN LEVERS
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="levers">
  <h2><span class="n">03</span> Change the game itself <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-leverage"/></svg></h2>
  <p class="gt-deck">A better move may still leave you stuck in a bad game. Sometimes the rules,
  players or exit need to change.</p>

  <p>A game is defined by seven things. When you feel stuck, you are usually optimising the move
  while treating the other six as fixed:</p>

  <div class="gt-eq">
    <p class="eq">
      G = (N, S, u, I, &nbsp;&gt;, R, E)
    </p>
    <p class="gloss">Players, strategies, payoffs, information, order of play, rules, and exit.
    Each can change. It is easy to spend all your effort on <span class="m">S</span>, the strategy,
    while leaving the rest untouched.</p>
  </div>

  <div class="gt-lab">
    <div class="gt-lab-head">
      <div>
        <p class="t-eyebrow">Diagnostic</p>
        <h5>Seven things you can change</h5>
      </div>
      <span class="gt-hint">Tap one</span>
    </div>
    <div class="gt-levers" id="gt-levers">
      {% for l in site.data.game_theory.levers %}
      <button class="gt-lever" type="button">
        <span class="ico" aria-hidden="true"><svg class="gt-i" viewBox="0 0 24 24"><use href="#{{ l.icon }}"/></svg></span>
        <h5>{{ l.key }}</h5>
        <p class="ask">{{ l.ask }}</p>
        <p class="ex">{{ l.example }}</p>
      </button>
      {% endfor %}
    </div>
  </div>

  <p>I use the last lever most often. Your bargaining power is largely set before you walk in by how
  survivable no-deal is. In the Nash bargaining solution the split
  depends on the disagreement point <span class="m">(d<sub>1</sub>, d<sub>2</sub>)</span>:</p>

  <div class="gt-eq">
    <p class="eq">
      <span class="op">max</span> &nbsp;(u<sub>1</sub> &minus; d<sub>1</sub>)(u<sub>2</sub> &minus; d<sub>2</sub>)
    </p>
    <p class="gloss">Raising <span class="m">d<sub>1</sub></span> moves the whole solution your way
    before either side speaks. Another offer, a second customer or six months of runway can improve
    your position.</p>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     04 · RISK AND RUIN
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="risk">
  <h2><span class="n">04</span> Risk and ruin <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-trust"/></svg></h2>
  <p class="gt-deck">Some risks deserve a chance. A loss that ends the game needs a hard limit.</p>

  <p>Sort any decision on two axes: can you undo it, and how bad is the bad case. The four
  quadrants want genuinely different behaviour.</p>

  <div class="gt-lab">
    <div class="gt-lab-head">
      <div>
        <p class="t-eyebrow">Sorter</p>
        <h5>Reversibility against downside</h5>
      </div>
      <span class="gt-hint">Hover a quadrant</span>
    </div>
    <div class="gt-quad-wrap">
      <svg class="gt-quad" id="gt-quad" viewBox="0 0 520 300" role="img"
           aria-label="A two by two of reversibility against size of downside.">
        <g class="q" data-q="a" tabindex="0" role="button" aria-label="Reversible with bounded downside">
          <rect class="cell" x="70" y="50" width="190" height="100"/>
          <svg class="gt-i" viewBox="0 0 24 24" width="22" height="22" x="154" y="57" style="overflow:visible;color:var(--accent)"><use href="#gt-fast"/></svg>
          <text class="qn" x="165" y="92">Act now</text>
          <text class="qd" x="165" y="110">reversible, small downside</text>
        </g>
        <g class="q" data-q="c" tabindex="0" role="button" aria-label="Irreversible with bounded downside">
          <rect class="cell" x="260" y="50" width="190" height="100"/>
          <svg class="gt-i" viewBox="0 0 24 24" width="22" height="22" x="344" y="57" style="overflow:visible;color:var(--accent)"><use href="#gt-slow"/></svg>
          <text class="qn" x="355" y="92">Slow down</text>
          <text class="qd" x="355" y="110">irreversible, survivable</text>
        </g>
        <g class="q" data-q="b" tabindex="0" role="button" aria-label="Reversible with meaningful downside">
          <rect class="cell" x="70" y="150" width="190" height="100"/>
          <svg class="gt-i" viewBox="0 0 24 24" width="22" height="22" x="154" y="157" style="overflow:visible;color:var(--accent)"><use href="#gt-pilot"/></svg>
          <text class="qn" x="165" y="192">Pilot it</text>
          <text class="qd" x="165" y="210">reversible, real cost</text>
        </g>
        <g class="q danger" data-q="d" tabindex="0" role="button" aria-label="Irreversible and ruinous">
          <rect class="cell" x="260" y="150" width="190" height="100"/>
          <svg class="gt-i" viewBox="0 0 24 24" width="22" height="22" x="344" y="157" style="overflow:visible;color:var(--accent)"><use href="#gt-ruin"/></svg>
          <text class="qn" x="355" y="192">Refuse</text>
          <text class="qd" x="355" y="210">irreversible and ruinous</text>
        </g>

        <rect class="field" x="70" y="50" width="380" height="200"/>
        <line class="field" x1="260" y1="50" x2="260" y2="250"/>
        <line class="field" x1="70" y1="150" x2="450" y2="150"/>

        <line class="arrow" x1="70" y1="266" x2="450" y2="266"/>
        <path class="arrow" d="M444 261 L452 266 L444 271"/>
        <text class="axlabel" x="70" y="286">Harder to undo</text>

        <line class="arrow" x1="56" y1="250" x2="56" y2="50"/>
        <path class="arrow" d="M51 56 L56 48 L61 56"/>
        <text class="axlabel" x="0" y="0" transform="translate(46,250) rotate(-90)">Smaller downside</text>
      </svg>
      <div class="gt-quad-read" id="gt-quad-read" role="status"></div>
    </div>
  </div>

  <h3 id="ruin">Positive expected value is not enough</h3>

  <p>A bet can have a genuine edge and still ruin you. You never experience the average across every
  possible future. You experience one path, in order, and a path that touches zero stops.</p>

  <p>For a repeated favourable bet, the growth-optimal stake is the Kelly fraction:</p>

  <div class="gt-eq">
    <p class="eq">
      <span class="op">f</span><sup>*</sup> =
      <span class="frac"><span>bp &minus; q</span><span>b</span></span>
    </p>
    <p class="gloss"><span class="m">p</span> is the win probability, <span class="m">q = 1 &minus; p</span>,
    and <span class="m">b</span> is what you win per unit staked. Real edges are uncertain, so treat
    this as a ceiling. Uncertainty about the edge is a reason to bet less than the formula says.</p>
  </div>

  <div class="gt-lab">
    <div class="gt-lab-head">
      <div>
        <p class="t-eyebrow">Simulation</p>
        <h5>Sixty paths through the same favourable bet</h5>
      </div>
      <span class="gt-hint">Red paths hit the floor</span>
    </div>
    <div class="gt-ruin-controls">
      <div class="gt-ruin-ctl">
        <label for="gt-ruin-f">Fraction staked <span class="val" id="gt-ruin-f-val"></span></label>
        <input class="gt-range" id="gt-ruin-f" type="range" min="1" max="90" value="40" step="1">
      </div>
      <div class="gt-ruin-ctl">
        <label for="gt-ruin-p">Win probability <span class="val" id="gt-ruin-p-val"></span></label>
        <input class="gt-range" id="gt-ruin-p" type="range" min="20" max="80" value="55" step="1">
      </div>
      <div class="gt-ruin-ctl">
        <label for="gt-ruin-b">Payoff per unit <span class="val" id="gt-ruin-b-val"></span></label>
        <input class="gt-range" id="gt-ruin-b" type="range" min="5" max="30" value="15" step="1">
      </div>
    </div>
    <svg class="gt-ruin" viewBox="0 0 540 200" role="img"
         aria-label="Sixty simulated wealth paths, with those that hit the ruin floor drawn separately.">
      <line class="grid" x1="50" y1="26" x2="500" y2="26"/>
      <line class="grid" x1="50" y1="64" x2="500" y2="64"/>
      <line class="grid" x1="50" y1="102" x2="500" y2="102"/>
      <line class="grid" x1="50" y1="140" x2="500" y2="140"/>
      <line class="ax" x1="50" y1="18" x2="50" y2="178"/>
      <line class="ax" x1="50" y1="178" x2="508" y2="178"/>
      <g id="gt-ruin-paths"></g>
      <line class="ruin-line" x1="50" y1="170" x2="500" y2="170"/>
      <text class="tick" x="54" y="166" fill="var(--accent)">ruin</text>
      <text class="tick" x="50" y="194">round 0</text>
      <text class="tick" x="500" y="194" text-anchor="end">round 60</text>
    </svg>
    <div class="gt-ruin-read">
      <div><div class="k">Edge per unit</div><div class="v" id="gt-ruin-ev">0</div></div>
      <div><div class="k">Kelly fraction</div><div class="v" id="gt-ruin-kelly">0%</div></div>
      <div><div class="k">Paths ruined</div><div class="v" id="gt-ruin-ruined">0%</div></div>
      <div><div class="k">Median outcome</div><div class="v" id="gt-ruin-median">1×</div></div>
    </div>
    <p class="gt-ruin-note" id="gt-ruin-note" role="status"></p>
  </div>

  <p>Set the edge positive and the stake high and watch what happens. A favourable game, played too
  large, still kills a good fraction of the paths. Ruin needs a hard constraint:</p>

  <div class="gt-eq is-boxed">
    <p class="eq">
      P(ruin) &lt; ε &nbsp;&nbsp;<span class="op">and</span>&nbsp;&nbsp;
      integrity <span class="op">intact</span>
    </p>
    <p class="gloss">Optimise anything you like <b>subject to these</b>. A strategy that maximises
    expected value while carrying real ruin risk is not aggressive. It is a strategy that has
    misunderstood what the objective was.</p>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     05 · THE CLASSIFIER
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="classifier">
  <h2><span class="n">05</span> Before you decide <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-tree"/></svg></h2>
  <p class="gt-deck">These nine questions expose the assumptions hidden inside a decision.</p>

  <div class="gt-lab">
    <div class="gt-lab-head">
      <div>
        <p class="t-eyebrow">Checklist</p>
        <h5>Name the game first</h5>
      </div>
      <span class="gt-hint">Mark each one honestly</span>
    </div>
    <div class="gt-classifier" id="gt-classifier">
      {% for c in site.data.game_theory.classifier %}
      <div class="gt-cq" data-q="{{ forloop.index }}">
        <span class="qn">{{ forloop.index }}</span>
        <span class="qt">{{ c.q }}<span class="qw">{{ c.why }}</span></span>
        <button class="qtog" type="button" aria-pressed="false">Not yet</button>
      </div>
      {% endfor %}
    </div>
    <div class="gt-cverdict" id="gt-cverdict" role="status"></div>
    <div class="gt-btn-row"><button class="gt-btn" id="gt-creset" type="button">Clear</button></div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     06 · THE BOTTLENECK
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="dashboard">
  <h2><span class="n">06</span> Find the binding constraint <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-optionality"/></svg></h2>
  <p class="gt-deck">One collapsed part of life can cap everything else, however good the rest
  looks.</p>

  <div class="gt-eq">
    <p class="eq">
      U &nbsp;&asymp;&nbsp; <span class="op">min</span>(x<sub>1</sub>, x<sub>2</sub>, …, x<sub>n</sub>)
      &nbsp;&nbsp;<span class="op">rather than</span>&nbsp;&nbsp;
      <span class="op">&sum;</span> w<sub>i</sub> x<sub>i</sub>
    </p>
    <p class="gloss">If this is roughly right, the next hour may matter most where the score is
    <b>lowest</b>. A career at nine does little for a relationship at three.</p>
  </div>

  <div class="gt-lab">
    <div class="gt-lab-head">
      <div>
        <p class="t-eyebrow">Dashboard</p>
        <h5>Score at least five, honestly</h5>
      </div>
      <span class="gt-hint">Stays in this browser</span>
    </div>
    <div class="gt-dash" id="gt-dash">
      {% for d in site.data.game_theory.dashboard %}
      <div class="gt-drow" data-k="{{ d.key }}" data-floor="{{ d.floor }}">
        <span class="dk">{{ d.key }}{% if d.floor %}<span class="fl">floor</span>{% endif %}</span>
        <span class="dq">{{ d.ask }}</span>
        <span class="gt-scale" role="group" aria-label="{{ d.key }} score"></span>
      </div>
      {% endfor %}
    </div>
    <div class="gt-dash-out" id="gt-dash-out" role="status"></div>
    <div class="gt-btn-row"><button class="gt-btn" id="gt-dash-reset" type="button">Clear</button></div>
  </div>

  <p>Nothing else substitutes for a domain marked <b>floor</b>. Money cannot buy back recovery, and
  status cannot supply meaning. A broken floor deserves attention even when everything else looks
  good.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     07 · THE LAWS
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="laws">
  <h2><span class="n">07</span> Fifteen laws</h2>
  <p class="gt-deck">These are the rules I take from the models above.</p>

  <div class="gt-laws">
    {% for l in site.data.game_theory.laws %}
    <div class="gt-law">
      <span class="n">{{ l.n }}</span>
      <span>
        <h5>{{ l.law }}</h5>
        <p>{{ l.why }}</p>
      </span>
    </div>
    {% endfor %}
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     08 · TWO LOOPS
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="loops">
  <h2><span class="n">08</span> Two loops <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-sunk"/></svg></h2>
  <p class="gt-deck">Both loops compound. One opens future choices. The other makes leaving harder,
  even while the rewards grow.</p>

  <div class="gt-loops">
    <div class="gt-loop good">
      <h5>The loop that opens doors</h5>
      <ol>
        <li>Mastery produces something people will pay for</li>
        <li>Economic value buys optionality</li>
        <li>Optionality improves the choices available</li>
        <li>Better choices put you in better environments</li>
        <li>Better environments improve judgement</li>
        <li>Better judgement deepens mastery</li>
      </ol>
      <p class="out"><b>Each round widens the set of games you can enter.</b></p>
    </div>
    <div class="gt-loop bad">
      <h5>The loop that closes them</h5>
      <ol>
        <li>Status arrives, and with it commitments</li>
        <li>Commitments raise fixed costs</li>
        <li>Higher costs create dependency</li>
        <li>Dependency makes leaving expensive</li>
        <li>Expensive exit produces conformity</li>
        <li>Conformity is rewarded with more status</li>
      </ol>
      <p class="out"><b>Each round narrows it, and the narrowing is what the reward pays for.</b></p>
    </div>
  </div>

  <p>The tell is the direction of your exit costs. If leaving got harder this year while the reward
  got larger, you are in the second loop regardless of how the first one felt.</p>

  <div class="gt-eq is-boxed">
    <p class="eq">
      <span class="op">arg max</span><sub>a</sub>
      <span class="frac">
        <span>LTV &times; Optionality &times; Alignment</span>
        <span>TailRisk &times; Irreversibility &times; Depletion</span>
      </span>
    </p>
    <p class="gloss">Keep <span class="m">P(ruin) &lt; ε</span>, integrity intact, and every floor
    above its minimum. The constraints do more work here than the objective.</p>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     09 · WHY I KEEP THIS
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="why">
  <h2><span class="n">09</span> Why I keep this</h2>

  <p>I work on calibration: the gap between what a system believes and what is true. Game theory
  adds an environment that watches the system and responds.</p>

  <p>This is also how I think about safety work. A model may optimise its stated objective and ignore
  how people respond. That is the same error as evaluating a decision without the
  <span class="m">BR</span> term. More intelligence does not repair a badly specified game.</p>

  <p>I do not treat the formalism as a prediction engine. Real payoffs are unknown, people are
  inconsistent, and the model assumes you can rank outcomes you have never experienced. I use it
  to ask three questions: who else moves, what happens next, and does the bad case leave me able to
  keep playing?</p>

  <p>Treating relationships as games has a cost. Run this analysis on someone you love and you will
  get an answer. You may dislike who you became to get it. I use game theory on structures and
  incentives, and try to leave people out of it.</p>

  <div class="gt-final">
    <p><b>Protect the downside. Keep the ability to walk. Test cheaply before committing heavily.
    Leave games whose rewards cost you your agency or integrity.</b></p>
  </div>

  <div class="gt-note">
    <p><b>On the maths.</b> Every equilibrium shown on this page is computed by
    <code>scripts/solve_games.py</code> from the payoff matrix displayed beside it, then checked
    against the standard properties: dominance, Pareto efficiency, and indifference at any mixed
    equilibrium. The data file is generated, so the stated equilibria always follow from the numbers
    actually shown. Change a payoff and re-run the script.</p>
    <p>The payoffs are ordinal and chosen so each game has its canonical structure. They are not
    measurements of anything. The ruin simulator uses a fixed seed, so the picture is stable across
    redraws rather than reshuffling every time you move a slider.</p>
    <p>Nothing you type here is transmitted anywhere. The checklist and dashboard live in your
    browser's local storage and clearing browser data removes them.</p>
    <p>The same treatment is applied to <a href="/stoic/">Marcus Aurelius and Epictetus</a>,
    <a href="/high-agency/">George Mack's High Agency</a>, and
    <a href="/principles/">my own operating manual</a>.</p>
  </div>
</section>
