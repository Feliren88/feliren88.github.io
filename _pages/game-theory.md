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
    <dl class="gt-terms">
      <div class="gt-term"><dt>a</dt><dd>one action available to you</dd></div>
      <div class="gt-term"><dt>max<sub>a</sub></dt><dd>choose the action with the highest resulting value</dd></div>
      <div class="gt-term"><dt>EV(a)</dt><dd>the expected value of action <span class="m">a</span> before anyone responds</dd></div>
      <div class="gt-term"><dt>BR(a)</dt><dd>the cost created by the other players' best response to <span class="m">a</span></dd></div>
      <div class="gt-term"><dt>&minus;</dt><dd>subtract the response cost from the action's expected value</dd></div>
    </dl>
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
    <dl class="gt-terms">
      <div class="gt-term"><dt>u<sub>1</sub></dt><dd>player one's payoff function</dd></div>
      <div class="gt-term"><dt>s<sub>1</sub><sup>*</sup></dt><dd>player one's equilibrium strategy</dd></div>
      <div class="gt-term"><dt>s<sub>2</sub><sup>*</sup></dt><dd>player two's equilibrium strategy, held fixed in this condition</dd></div>
      <div class="gt-term"><dt>s<sub>1</sub></dt><dd>any alternative strategy available to player one</dd></div>
      <div class="gt-term"><dt>&ge;</dt><dd>switching alone cannot give player one a higher payoff</dd></div>
      <div class="gt-term"><dt>for all</dt><dd>the condition must hold for every <span class="m">s<sub>1</sub></span> in player one's strategy set</dd></div>
      <div class="gt-term"><dt>player 2</dt><dd>the same condition also applies with the two players reversed</dd></div>
    </dl>
    <p class="gloss">A Nash equilibrium is stable. It does not have to be good for either player.</p>
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
  games where both players have a <b>dominant strategy</b>. In both cases that strategy leads
  somewhere neither wanted. Matching Pennies is genuinely zero-sum and has no stable pure strategy.</p>

  <p>Salary talks, arguments with a partner and supplier negotiations rarely have a fixed pot. How
  you play can create or destroy value. You can win the argument and leave both sides worse off.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     02 · FIVE AT ONCE
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="five">
  <h2><span class="n">02</span> Five games at once <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-players"/></svg></h2>
  <p class="gt-deck">A major decision affects five games at once. A win on one board can hide
  losses on the others.</p>

  <div class="gt-lab">
    <div class="gt-lab-head">
      <div>
        <p class="t-eyebrow">Layers</p>
        <h5>Same decision, five boards</h5>
      </div>
      <span class="gt-hint">Depth increases downward</span>
    </div>
    <div class="gt-five" id="gt-five">
      {% for f in site.data.game_theory.five %}
      <button class="gt-layer" type="button">
        <span class="ico" aria-hidden="true"><svg class="gt-i" viewBox="0 0 24 24"><use href="#{{ f.icon }}"/></svg></span>
        <span>
          <span class="k">{{ f.key }}</span>
          <span class="vs">{{ f.vs }}</span>
        </span>
        <span class="depth">L{{ forloop.index }}</span>
      </button>
      {% endfor %}
    </div>
    <div class="gt-five-read" id="gt-five-read" role="status"></div>
  </div>

  <p>The intrapersonal layer is easy to overlook. Today you can make commitments that your future
  self cannot reverse. Debt, specialisation, lifestyle and reputation all move on this board.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     02 · THE HORIZON
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="horizon">
  <h2><span class="n">03</span> Why the horizon changes the answer <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-repeat"/></svg></h2>
  <p class="gt-deck">Repeat the Prisoner's Dilemma and cooperation can become rational. The people
  stay the same; the prospect of another round changes their incentives.</p>

  <p>Suppose you cooperate as long as they do, and stop for good if they betray you. Cooperating
  forever is worth <span class="m">R + δR + δ<sup>2</sup>R + …</span>, and betraying once pays
  <span class="m">T</span> now and <span class="m">P</span> forever after. Cooperation survives
  when:</p>

  <div class="gt-eq">
    <p class="eq is-derivation">
      <span class="frac"><span>R</span><span>1 &minus; δ</span></span>
      <span class="rel">&ge;</span>
      <span class="term">T + <span class="frac"><span>δP</span><span>1 &minus; δ</span></span></span>
      <span class="rel">&hArr;</span>
      <span class="term">δ <span class="rel">&ge;</span> <span class="frac"><span>T &minus; R</span><span>T &minus; P</span></span></span>
    </p>
    <dl class="gt-terms">
      <div class="gt-term"><dt>δ</dt><dd>how much the next round is worth relative to this one, so how much the future matters</dd></div>
      <div class="gt-term"><dt>T</dt><dd>temptation, what betraying a cooperator pays</dd></div>
      <div class="gt-term"><dt>R</dt><dd>reward for mutual cooperation</dd></div>
      <div class="gt-term"><dt>P</dt><dd>punishment when both defect</dd></div>
      <div class="gt-term"><dt>1 &minus; δ</dt><dd>the denominator of the infinite discounted stream of future payoffs</dd></div>
      <div class="gt-term"><dt>&hArr;</dt><dd>the expression on the right is the same condition after rearranging the terms</dd></div>
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
  <h2><span class="n">04</span> Change the game itself <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-leverage"/></svg></h2>
  <p class="gt-deck">A better move may still leave you stuck in a bad game. Sometimes the rules,
  players or exit need to change.</p>

  <p>A game is defined by seven things. When you feel stuck, you are usually optimising the move
  while treating the other six as fixed:</p>

  <div class="gt-eq">
    <p class="eq">
      G = (N, S, u, I, &nbsp;&gt;, R, E)
    </p>
    <dl class="gt-terms">
      <div class="gt-term"><dt>G</dt><dd>the complete game being described</dd></div>
      <div class="gt-term"><dt>N</dt><dd>the players involved</dd></div>
      <div class="gt-term"><dt>S</dt><dd>the strategies available to those players</dd></div>
      <div class="gt-term"><dt>u</dt><dd>the payoff assigned to each outcome</dd></div>
      <div class="gt-term"><dt>I</dt><dd>who knows what when a decision is made</dd></div>
      <div class="gt-term"><dt>&gt;</dt><dd>the order in which the players move</dd></div>
      <div class="gt-term"><dt>R</dt><dd>the rules that constrain the players and actions</dd></div>
      <div class="gt-term"><dt>E</dt><dd>the outcome available when you exit or refuse to play</dd></div>
    </dl>
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
    <dl class="gt-terms">
      <div class="gt-term"><dt>max</dt><dd>find the agreement that makes the product as large as possible</dd></div>
      <div class="gt-term"><dt>u<sub>1</sub></dt><dd>player one's payoff under the proposed agreement</dd></div>
      <div class="gt-term"><dt>u<sub>2</sub></dt><dd>player two's payoff under the proposed agreement</dd></div>
      <div class="gt-term"><dt>d<sub>1</sub></dt><dd>player one's payoff if no agreement is reached</dd></div>
      <div class="gt-term"><dt>d<sub>2</sub></dt><dd>player two's payoff if no agreement is reached</dd></div>
      <div class="gt-term"><dt>u<sub>i</sub> &minus; d<sub>i</sub></dt><dd>player <span class="m">i</span>'s gain from reaching an agreement</dd></div>
      <div class="gt-term"><dt>( )( )</dt><dd>the product balances both players' gains over their no-deal outcomes</dd></div>
    </dl>
    <p class="gloss">A better outside option raises <span class="m">d<sub>1</sub></span> before either
    side speaks. Another offer, a second customer or more runway can do this.</p>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     04 · RISK AND RUIN
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="risk">
  <h2><span class="n">05</span> Risk and ruin <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-ruin"/></svg></h2>
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
    <dl class="gt-terms">
      <div class="gt-term"><dt>f<sup>*</sup></dt><dd>the fraction of current wealth that maximises long-run growth</dd></div>
      <div class="gt-term"><dt>p</dt><dd>the probability of winning one round</dd></div>
      <div class="gt-term"><dt>q</dt><dd>the probability of losing, equal to <span class="m">1 &minus; p</span></dd></div>
      <div class="gt-term"><dt>b</dt><dd>the net amount won for each unit staked</dd></div>
      <div class="gt-term"><dt>bp &minus; q</dt><dd>the edge after weighting the win and loss outcomes by their probabilities</dd></div>
    </dl>
    <p class="gloss">Real edges are uncertain, so treat <span class="m">f<sup>*</sup></span> as a
    ceiling. More uncertainty calls for a smaller stake.</p>
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
    <dl class="gt-terms">
      <div class="gt-term"><dt>P(ruin)</dt><dd>the probability that a loss ends your ability to keep playing</dd></div>
      <div class="gt-term"><dt>ε</dt><dd>the maximum ruin probability you are willing to accept</dd></div>
      <div class="gt-term"><dt>&lt;</dt><dd>ruin risk must stay below that chosen limit</dd></div>
      <div class="gt-term"><dt>integrity</dt><dd>a hard constraint that the strategy is not allowed to violate</dd></div>
      <div class="gt-term"><dt>and</dt><dd>both constraints must hold at the same time</dd></div>
    </dl>
    <p class="gloss">Optimisation happens inside these limits. A high expected value does not cancel
    ruin risk or an integrity failure.</p>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     05 · THE CLASSIFIER
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="classifier">
  <h2><span class="n">06</span> Before you decide <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-tree"/></svg></h2>
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
     06 · SEVENTEEN DOMAINS
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="domains">
  <h2><span class="n">07</span> Seventeen domains <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-arena"/></svg></h2>
  <p class="gt-deck">Each part of life has its own players, incentives and risks. All seventeen
  draw from the same limited pool of time, money, energy and attention.</p>

  <div class="gt-dfilters filter-bar" role="group" aria-label="Filter domains">
    <button class="filter-pill is-active" data-filter="all">All</button>
    <button class="filter-pill" data-filter="work">Work</button>
    <button class="filter-pill" data-filter="money">Money</button>
    <button class="filter-pill" data-filter="people">People</button>
    <button class="filter-pill" data-filter="self">Self</button>
  </div>
  <p class="gt-dcount" id="gt-dcount" role="status" aria-live="polite"></p>
  <div class="gt-btn-row" style="margin-top:0;margin-bottom:var(--gap-2)">
    <button class="gt-btn" id="gt-dexpand" type="button" data-open="false">Expand all</button>
  </div>

  <div class="gt-domains" id="gt-domains">
    {% for d in site.data.game_theory.domains %}
    <article class="gt-domain" id="dom-{{ d.key | slugify }}" data-group="{{ d.group }}">
      <button type="button" aria-expanded="false" aria-controls="dbody-{{ d.key | slugify }}">
        <span class="dico" aria-hidden="true"><svg class="gt-i" viewBox="0 0 24 24"><use href="#{{ d.icon }}"/></svg></span>
        <span>
          <span class="dk">{{ d.key }}</span>
          <span class="dg">{{ d.games | join: " · " }}</span>
        </span>
        <span class="chev" aria-hidden="true">&rsaquo;</span>
      </button>
      <div class="gt-domain-body" id="dbody-{{ d.key | slugify }}">
        <div class="gt-drow2">
          <span class="k">What winning looks like</span>
          <p>{{ d.winning }}</p>
        </div>
        <div class="gt-drow2 risk">
          <span class="k">The characteristic failure</span>
          <p>{{ d.risk }}</p>
        </div>
        {% if d.math != "" %}<div class="dmath">{{ d.math }}</div>{% endif %}
        <p class="dask">{{ d.ask }}</p>
        <div class="gt-gtags">
          {% for g in d.games %}<span class="gt-gtag">{{ g }}</span>{% endfor %}
        </div>
      </div>
    </article>
    {% endfor %}
  </div>

  <p>A strong result in one domain may do little for a failing one. Money cannot replace recovery,
  and status cannot supply meaning. Scoring the domains separately makes those gaps harder to
  ignore.</p>

  <h3 id="explore">Explore against exploit</h3>

  <p>Learning, career and creativity share a choice: use what already works or test an option whose
  value is still unknown. The upper-confidence-bound formula gives that choice a shape.</p>

  <div class="gt-eq">
    <p class="eq">
      UCB<sub>i</sub> = μ̂<sub>i</sub> + c &middot;
      <span class="frac"><span>&radic;<span class="op">ln</span> t</span><span>&radic;n<sub>i</sub></span></span>
    </p>
    <dl class="gt-terms">
      <div class="gt-term"><dt>UCB<sub>i</sub></dt><dd>the upper-confidence score assigned to option <span class="m">i</span></dd></div>
      <div class="gt-term"><dt>i</dt><dd>one option or arm being compared</dd></div>
      <div class="gt-term"><dt>μ̂<sub>i</sub></dt><dd>the average result observed so far for option <span class="m">i</span></dd></div>
      <div class="gt-term"><dt>c</dt><dd>how much weight you give to exploring uncertain options</dd></div>
      <div class="gt-term"><dt>t</dt><dd>the total number of trials across all options</dd></div>
      <div class="gt-term"><dt>n<sub>i</sub></dt><dd>the number of times option <span class="m">i</span> has been tried</dd></div>
      <div class="gt-term"><dt>ln</dt><dd>the natural logarithm, which makes the exploration bonus grow slowly over time</dd></div>
      <div class="gt-term"><dt>&radic;</dt><dd>the square root keeps the uncertainty bonus from growing too quickly</dd></div>
    </dl>
    <p class="gloss">The first term rewards observed performance. The second adds a temporary bonus
    when evidence for an option is limited.</p>
  </div>

  <div class="gt-lab">
    <div class="gt-lab-head">
      <div>
        <p class="t-eyebrow">Model</p>
        <h5>Three options, one exploration dial</h5>
      </div>
      <span class="gt-hint">Grey is evidence, blue is uncertainty</span>
    </div>
    <div class="gt-ucb-wrap">
      <svg class="gt-ucb" viewBox="0 0 540 200" role="img"
           aria-label="Three bars showing observed mean plus exploration bonus for each option.">
        <line class="grid" x1="60" y1="26" x2="480" y2="26"/>
        <line class="grid" x1="60" y1="61" x2="480" y2="61"/>
        <line class="grid" x1="60" y1="96" x2="480" y2="96"/>
        <line class="grid" x1="60" y1="131" x2="480" y2="131"/>
        <line class="ax" x1="60" y1="20" x2="60" y2="156"/>
        <line class="ax" x1="60" y1="156" x2="488" y2="156"/>
        <g id="gt-ucb-bars"></g>
      </svg>
      <div class="gt-ucb-read" id="gt-ucb-read" role="status"></div>
    </div>
    <label class="gt-sr" for="gt-ucb-c">Exploration weight</label>
    <input class="gt-range" id="gt-ucb-c" type="range" min="0" max="200" value="60" step="1">
    <p class="gt-hint" style="margin-top:0.5rem">c = <span id="gt-ucb-c-val"></span></p>
  </div>

  <p>Explore early, after the environment changes, or when returns flatten. Use the proven option
  when evidence is strong and the advantage is compounding. Revisit the balance as the evidence
  changes.</p>

  <h3 id="trust">Trust as an asset with asymmetric accounting</h3>

  <div class="gt-eq">
    <p class="eq">
      T<sub>t+1</sub> = (1 &minus; ρ)T<sub>t</sub> + <span class="op">a</span>R<sub>t</sub>
      &minus; <span class="op">b</span>D<sub>t</sub>,
      &nbsp;&nbsp; <span class="op">b</span> &gt; <span class="op">a</span>
    </p>
    <dl class="gt-terms">
      <div class="gt-term"><dt>T<sub>t</sub></dt><dd>trust held at the start of period <span class="m">t</span></dd></div>
      <div class="gt-term"><dt>T<sub>t+1</sub></dt><dd>trust carried into the next period</dd></div>
      <div class="gt-term"><dt>ρ</dt><dd>the fraction of trust that fades during one quiet period</dd></div>
      <div class="gt-term"><dt>R<sub>t</sub></dt><dd>reliable behaviour observed during period <span class="m">t</span></dd></div>
      <div class="gt-term"><dt>D<sub>t</sub></dt><dd>defection or betrayal observed during period <span class="m">t</span></dd></div>
      <div class="gt-term"><dt>a</dt><dd>how much one unit of reliability adds to trust</dd></div>
      <div class="gt-term"><dt>b</dt><dd>how much one unit of defection removes from trust</dd></div>
      <div class="gt-term"><dt>b &gt; a</dt><dd>one defection costs more trust than one reliable act adds</dd></div>
    </dl>
  </div>

  <div class="gt-lab">
    <div class="gt-lab-head">
      <div>
        <p class="t-eyebrow">Model</p>
        <h5>Forty rounds of reliability, then one defection</h5>
      </div>
      <span class="gt-hint">Move the asymmetry</span>
    </div>
    <div class="gt-trust-wrap">
      <svg class="gt-tcap" viewBox="0 0 540 200" role="img"
           aria-label="Trust accumulating slowly then dropping sharply at a single defection.">
        <line class="grid" x1="54" y1="26" x2="500" y2="26"/>
        <line class="grid" x1="54" y1="60" x2="500" y2="60"/>
        <line class="grid" x1="54" y1="94" x2="500" y2="94"/>
        <line class="grid" x1="54" y1="128" x2="500" y2="128"/>
        <line class="ax" x1="54" y1="20" x2="54" y2="160"/>
        <line class="ax" x1="54" y1="160" x2="508" y2="160"/>
        <path class="area" id="gt-trust-area"/>
        <path class="curve" id="gt-trust-curve"/>
        <line class="break" id="gt-trust-break" x1="54" y1="20" x2="54" y2="160"/>
        <text class="tick" x="54" y="180">round 0</text>
        <text class="tick" x="500" y="180" text-anchor="end">round 60</text>
      </svg>
      <div class="gt-trust-read" id="gt-trust-read" role="status"></div>
    </div>
    <label class="gt-sr" for="gt-trust-b">How much worse defection is than reliability is good</label>
    <input class="gt-range" id="gt-trust-b" type="range" min="10" max="60" value="30" step="1">
    <p class="gt-hint" style="margin-top:0.5rem">b / a = <span id="gt-trust-b-val"></span></p>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     06 · THE BOTTLENECK
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="dashboard">
  <h2><span class="n">08</span> Find the binding constraint <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-optionality"/></svg></h2>
  <p class="gt-deck">One collapsed part of life can cap everything else, however good the rest
  looks.</p>

  <div class="gt-eq">
    <p class="eq">
      U &nbsp;&asymp;&nbsp; <span class="op">min</span>(x<sub>1</sub>, x<sub>2</sub>, …, x<sub>n</sub>)
      &nbsp;&nbsp;<span class="op">compared with</span>&nbsp;&nbsp;
      <span class="op">&sum;</span> w<sub>i</sub> x<sub>i</sub>
    </p>
    <dl class="gt-terms">
      <div class="gt-term"><dt>U</dt><dd>overall life utility in this simplified model</dd></div>
      <div class="gt-term"><dt>≈</dt><dd>an approximation, not an exact equality or measured law</dd></div>
      <div class="gt-term"><dt>x<sub>i</sub></dt><dd>the score for life domain <span class="m">i</span></dd></div>
      <div class="gt-term"><dt>n</dt><dd>the number of domains included</dd></div>
      <div class="gt-term"><dt>min</dt><dd>the lowest domain score, treated as the binding constraint</dd></div>
      <div class="gt-term"><dt>Σ</dt><dd>the alternative model that adds all domain scores</dd></div>
      <div class="gt-term"><dt>w<sub>i</sub></dt><dd>the importance weight assigned to domain <span class="m">i</span></dd></div>
    </dl>
    <p class="gloss">If the minimum model is useful, the next hour may matter most in the weakest
    domain. A career at nine does little for a relationship at three.</p>
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
     08 · REGIMES
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="regimes">
  <h2><span class="n">09</span> Which regime are you in <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-sequence"/></svg></h2>
  <p class="gt-deck">Different periods call for different strategies. Expansion rewards scale;
  recovery protects capacity.</p>

  <div class="gt-lab">
    <div class="gt-lab-head">
      <div>
        <p class="t-eyebrow">Periods</p>
        <h5>Six regimes, six different correct answers</h5>
      </div>
      <span class="gt-hint">Tap one</span>
    </div>
    <div class="gt-regimes" id="gt-regimes">
      {% for r in site.data.game_theory.regimes %}
      <button class="gt-regime" type="button">
        <span class="ico" aria-hidden="true"><svg class="gt-i" viewBox="0 0 24 24"><use href="#{{ r.icon }}"/></svg></span>
        <h5>{{ r.key }}</h5>
        <p class="when">{{ r.when }}</p>
        <p class="opt"><b>Optimise:</b> {{ r.opt }}</p>
        <p class="avoid"><b>Avoid:</b> {{ r.avoid }}</p>
      </button>
      {% endfor %}
    </div>
  </div>

  <h3 id="readiness">Readiness against opportunity</h3>

  <p>Two questions help identify the regime. How ready are you, and how good is the opportunity?</p>

  <div class="gt-lab">
    <div class="gt-lab-head">
      <div>
        <p class="t-eyebrow">Sorter</p>
        <h5>Where you are this year</h5>
      </div>
      <span class="gt-hint">Hover a quadrant</span>
    </div>
    <div class="gt-ready-wrap">
      <svg class="gt-ready" id="gt-ready" viewBox="0 0 520 300" role="img"
           aria-label="A two by two of internal readiness against external opportunity.">
        <g class="r" data-r="hr" tabindex="0" role="button" aria-label="High readiness, low opportunity">
          <rect class="cell" x="70" y="50" width="190" height="100"/>
          <text class="rn" x="165" y="98">Position</text>
        </g>
        <g class="r" data-r="ho" tabindex="0" role="button" aria-label="High readiness, high opportunity">
          <rect class="cell" x="260" y="50" width="190" height="100"/>
          <text class="rn" x="355" y="98">Expand</text>
        </g>
        <g class="r" data-r="lr" tabindex="0" role="button" aria-label="Low readiness, low opportunity">
          <rect class="cell" x="70" y="150" width="190" height="100"/>
          <text class="rn" x="165" y="198">Recover</text>
        </g>
        <g class="r" data-r="lo" tabindex="0" role="button" aria-label="Low readiness, high opportunity">
          <rect class="cell" x="260" y="150" width="190" height="100"/>
          <text class="rn" x="355" y="198">Participate</text>
        </g>
        <rect class="field" x="70" y="50" width="380" height="200"/>
        <line class="field" x1="260" y1="50" x2="260" y2="250"/>
        <line class="field" x1="70" y1="150" x2="450" y2="150"/>
        <line class="arrow" x1="70" y1="266" x2="450" y2="266"/>
        <path class="arrow" d="M444 261 L452 266 L444 271"/>
        <text class="axlabel" x="70" y="286">More opportunity outside</text>
        <line class="arrow" x1="56" y1="250" x2="56" y2="50"/>
        <path class="arrow" d="M51 56 L56 48 L61 56"/>
        <text class="axlabel" x="0" y="0" transform="translate(46,250) rotate(-90)">More ready inside</text>
      </svg>
      <div class="gt-ready-read" id="gt-ready-read" role="status"></div>
    </div>
  </div>

  <p>High readiness with little opportunity can feel like failure. It is useful preparation time.
  Openings arrive on their own schedule, and preparation determines what you can do with them.</p>
</section>

<!-- ═══════════════════════════════════════════════════════
     07 · THE LAWS
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="laws">
  <h2><span class="n">10</span> Fifteen laws</h2>
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
  <h2><span class="n">11</span> Two loops <svg class="gt-i" viewBox="0 0 24 24" aria-hidden="true" style="display:inline-block;width:1em;height:1em;color:var(--accent);vertical-align:-0.1em"><use href="#gt-sunk"/></svg></h2>
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
    <dl class="gt-terms">
      <div class="gt-term"><dt>a</dt><dd>one action available to you</dd></div>
      <div class="gt-term"><dt>arg max<sub>a</sub></dt><dd>the action that gives the highest value of the full ratio</dd></div>
      <div class="gt-term"><dt>LTV</dt><dd>the action's expected long-term value</dd></div>
      <div class="gt-term"><dt>Optionality</dt><dd>the useful future choices the action preserves or creates</dd></div>
      <div class="gt-term"><dt>Alignment</dt><dd>how well the action fits your values and intended direction</dd></div>
      <div class="gt-term"><dt>TailRisk</dt><dd>damage in unusually bad outcomes</dd></div>
      <div class="gt-term"><dt>Irreversibility</dt><dd>the cost or difficulty of undoing the action</dd></div>
      <div class="gt-term"><dt>Depletion</dt><dd>the energy and capacity the action consumes over time</dd></div>
      <div class="gt-term"><dt>&times;</dt><dd>a weak factor can sharply reduce the whole numerator or enlarge the denominator</dd></div>
    </dl>
    <p class="gloss">The action must also keep <span class="m">P(ruin) &lt; ε</span>, preserve
    integrity, and leave every foundational domain above its minimum.</p>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     09 · WHY I KEEP THIS
     ═══════════════════════════════════════════════════════ -->
<section class="gt-part gt-prose" id="why">
  <h2><span class="n">12</span> Why I keep this</h2>

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
    equilibrium. The data file is generated, so every stated equilibrium follows from the displayed
    numbers. Change a payoff and re-run the script.</p>
    <p>The payoffs are ordinal and chosen so each game has its canonical structure. They are not
    measurements. The ruin simulator uses a fixed seed, which keeps the paths stable as you move a
    slider.</p>
    <p>Nothing you type here is transmitted anywhere. The checklist and dashboard live in your
    browser's local storage and clearing browser data removes them.</p>
    <p>The same treatment is applied to <a href="/stoic/">Marcus Aurelius and Epictetus</a>,
    <a href="/high-agency/">George Mack's High Agency</a>, and
    <a href="/principles/">my own operating manual</a>.</p>
  </div>
</section>
