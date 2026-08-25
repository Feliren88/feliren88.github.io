---
layout: page
title: Working with Uncertainty
subtitle: How to decide while some questions remain open
description: How to read emotional signals, stop repeated checking, gather enough information, and act while doubt remains.
permalink: /uncertainty-and-emotions/
layout-class: page uncertainty-emotions
extra_css: /css/uncertainty-and-emotions.css
extra_js: /js/components/uncertainty-and-emotions.js
motion_scene: uncertainty
---

<div class="ue-progress" aria-hidden="true"><span id="ue-progress-fill"></span></div>
<script type="application/json" id="ue-wheel-data">{{ site.data.emotion_wheel | jsonify }}</script>
{% include uncertainty-icons.html %}

<header class="ue-hero" aria-labelledby="ue-hero-title">
  <div>
    <p class="ue-kicker">A field manual for unresolved questions</p>
    <h1 id="ue-hero-title">You can proceed without certainty.</h1>
    <p>Separate what the situation requires from what discomfort demands. Doubt can remain while you move.</p>
  </div>
  <div class="ue-hero-model" aria-label="The operating shift from resolving uncertainty to choosing action">
    <div class="old"><small>The reflex</small><b>Uncertainty</b><i>→</i><b>Resolve it</b><span>life waits</span></div>
    <div class="pivot" aria-hidden="true">↓</div>
    <div class="new"><small>The trained response</small><b>Uncertainty</b><i>→</i><b>Choose action</b><span>life continues</span></div>
  </div>
</header>

<div class="ue-note" role="note">
  <span><svg class="ue-i"><use href="#ue-hand"/></svg>Boundary</span>
  <p>This manual addresses ordinary decisions, emotional pressure, and incomplete information. It cannot tell you whether a specific situation is safe. When there is credible danger, a major health concern, or risk to anyone's safety, get qualified help and respond to the facts.</p>
</div>

<nav class="ue-toc" aria-label="On this page">
  <a href="#trap"><b>01</b><svg class="ue-i"><use href="#ue-trap"/></svg>The trap</a><a href="#moves"><b>02</b><svg class="ue-i"><use href="#ue-cycle"/></svg>Certainty moves</a>
  <a href="#games"><b>03</b><svg class="ue-i"><use href="#ue-dice"/></svg>Two games</a><a href="#training"><b>04</b><svg class="ue-i"><use href="#ue-dumbbell"/></svg>Training</a>
  <a href="#state"><b>05</b><svg class="ue-i"><use href="#ue-brain"/></svg>State skills</a><a href="#budget"><b>06</b><svg class="ue-i"><use href="#ue-wallet"/></svg>Uncertainty budget</a>
  <a href="#decisions"><b>07</b><svg class="ue-i"><use href="#ue-fork"/></svg>Decisions</a><a href="#practice"><b>08</b><svg class="ue-i"><use href="#ue-ladder"/></svg>Practice</a>
  <a href="#support"><b>09</b><svg class="ue-i"><use href="#ue-hands"/></svg>Support</a><a href="#reset"><b>10</b><svg class="ue-i"><use href="#ue-restart"/></svg>Reset</a>
</nav>

<div class="ue-route" aria-label="Learning route through the manual">
  <span><svg class="ue-i"><use href="#ue-notice"/></svg><b>1 · Notice</b>See the loop</span><i>→</i><span><svg class="ue-i"><use href="#ue-evidence"/></svg><b>2 · Read</b>Separate signal from fact</span><i>→</i><span><svg class="ue-i"><use href="#ue-dumbbell"/></svg><b>3 · Practise</b>Make room for doubt</span><i>→</i><span><svg class="ue-i"><use href="#ue-target"/></svg><b>4 · Choose</b>Take the next useful action</span>
</div>

<section class="ue-part ue-prose" id="trap">
  <p class="ue-deck">The mind produces doubt. Trouble starts when life must stop until the doubt is resolved.</p>
  <div class="ue-loop" id="ue-loop" role="group" aria-label="The threat-certainty loop">
    <button data-step="0"><svg class="ue-i"><use href="#ue-alarm"/></svg><b>Uncertainty</b><small>something remains unknown</small></button><i>→</i>
    <button data-step="1"><svg class="ue-i"><use href="#ue-wave"/></svg><b>Threat</b><small>the unknown feels dangerous</small></button><i>→</i>
    <button data-step="2"><svg class="ue-i"><use href="#ue-move"/></svg><b>Urgency</b><small>solve it now</small></button><i>→</i>
    <button data-step="3"><svg class="ue-i"><use href="#ue-cycle"/></svg><b>Certainty move</b><small>check, review, avoid</small></button><i>→</i>
    <button data-step="4"><svg class="ue-i"><use href="#ue-anchor"/></svg><b>Relief</b><small>brief, but persuasive</small></button>
  </div>
  <p class="ue-loop-read" id="ue-loop-read" role="status">Tap a stage. The loop feels useful because relief is real. Its cost arrives in the next round.</p>
  <div class="ue-shift"><span>The reflex</span><b>uncertainty → settle every doubt</b><strong>becomes</strong><span>The practice</span><b>uncertainty → choose the next action</b></div>
  <p>A threat signal may arrive as a thought, image, memory, sensation, urge, doubt, or a feeling that something is wrong. Read it as a prompt to look, not a verdict. Check the available facts, the actual stakes, and whether the situation calls for action now.</p>
</section>

<section class="ue-part ue-prose" id="moves">
  <h2><span>02</span><svg class="ue-i ue-h2-i"><use href="#ue-cycle"/></svg> Certainty moves</h2>
  <p class="ue-deck">A certainty move is something you do mainly to settle doubt, fear, guilt, or an unwanted possibility.</p>
  <div class="ue-moves">
    <div><svg class="ue-i"><use href="#ue-cycle"/></svg><b>Inside the head</b><p>Reviewing memory, replaying a conversation, analysing motives, checking feelings, suppressing a thought, replacing it with a safe one.</p></div>
    <div><svg class="ue-i"><use href="#ue-evidence"/></svg><b>In the world</b><p>Searching again, checking again, comparing evidence, testing a reaction, delaying, or avoiding the situation.</p></div>
    <div><svg class="ue-i"><use href="#ue-people"/></svg><b>Borrowed certainty</b><p>Asking someone else to confirm that you are safe, good, correct, forgiven, or unlikely to regret the choice.</p></div>
  </div>

  <div class="ue-fig" id="uefig-relief">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-cycle"/></svg> What the move buys, and what it builds</p>
    <svg class="ue-fig-svg" viewBox="0 0 520 170" role="img"
         aria-label="Relief stays flat with each repetition while the urge that follows grows stronger.">
      <text class="axis-title" x="42" y="11">illustrative index</text>
      <line class="ax" x1="42" y1="140" x2="500" y2="140"/>
      <line class="ax" x1="42" y1="14" x2="42" y2="140"/>
      <text class="tick" x="42" y="158">1st time</text>
      <text class="tick" x="500" y="158" text-anchor="end">20th time</text>
      <path class="rl-relief" id="rl-relief"/>
      <path class="rl-urge" id="rl-urge"/>
      <circle class="rl-dot rl-dot-relief" id="rl-dot-relief" r="4.5"/>
      <circle class="rl-dot rl-dot-urge" id="rl-dot-urge" r="4.5"/>
    </svg>
    <label class="ue-sr" for="ue-reps">How many times you have done the move</label>
    <input class="ue-range" id="ue-reps" type="range" min="1" max="20" value="1" step="1">
    <div class="ue-fig-read">
      <div><span class="k">Times</span><b id="rl-n">1</b></div>
      <div class="a"><span class="k">Relief it buys</span><b id="rl-relief-v">100</b></div>
      <div class="b"><span class="k">Next urge</span><b id="rl-urge-v">100</b></div>
      <p id="rl-say" role="status"></p>
    </div>
  </div>
  <p>The behaviour alone does not settle the question. Checking a bill can solve an external problem. Rechecking it until anxiety gives permission to stop serves a different function. Ask: <b>What does the situation require, and what am I doing only to feel sure?</b></p>
  <div class="ue-equation"><span>relief now</span><i>→</i><span>dependence later</span></div>
</section>

<section class="ue-part ue-prose" id="games">
  <h2><span>03</span><svg class="ue-i ue-h2-i"><use href="#ue-dice"/></svg> Count what happens next</h2>
  <p class="ue-deck">A certainty move can make sense now but cost you more over time.</p>
  <div class="ue-payoffs">
    <article class="short"><header><svg class="ue-i"><use href="#ue-cycle"/></svg><div><small>Strategy C</small><h3>Resolve uncertainty</h3></div></header><div class="now"><span>now</span><b>+5</b><p>Distress falls.</p></div><div class="later"><span>next rounds</span><b>−2</b><p>The mind learns that every doubt needs an answer.</p></div></article>
    <div class="ue-vs">versus</div>
    <article class="long"><header><svg class="ue-i"><use href="#ue-open"/></svg><div><small>Strategy U</small><h3>Leave it unresolved</h3></div></header><div class="now"><span>now</span><b>−4</b><p>Discomfort remains.</p></div><div class="later"><span>later rounds</span><b>+8</b><p>Uncertainty loses control over behaviour.</p></div></article>
  </div>
  <div class="ue-rounds">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-dice"/></svg> Running total, round by round</p>
    <svg class="ue-rounds-svg" id="ue-rounds" viewBox="0 0 520 220" role="img" aria-label="Cumulative payoff for resolving uncertainty against leaving it unresolved, over repeated rounds.">
      <text class="axis-title" x="46" y="11">cumulative payoff</text>
      <line class="ax" x1="46" y1="186" x2="500" y2="186"/>
      <line class="ax" x1="46" y1="16" x2="46" y2="186"/>
      <line class="zero" x1="46" y1="120" x2="500" y2="120"/>
      <text class="tick" x="40" y="124" text-anchor="end">0</text>
      <text class="tick" x="46" y="204">round 1</text>
      <text class="tick" x="500" y="204" text-anchor="end">round 8</text>
      <path class="line-c" id="ue-line-c"/>
      <path class="line-u" id="ue-line-u"/>
      <circle class="dot-c" id="ue-dot-c" r="4.5"/>
      <circle class="dot-u" id="ue-dot-u" r="4.5"/>
      <line class="scrub" id="ue-rounds-scrub" x1="46" y1="16" x2="46" y2="186"/>
      <text class="clab" id="ue-lab-c" x="0" y="0">Strategy C</text>
      <text class="clab" id="ue-lab-u" x="0" y="0">Strategy U</text>
    </svg>
    <label class="ue-sr" for="ue-rounds-range">Rounds played</label>
    <input class="ue-range" id="ue-rounds-range" type="range" min="1" max="8" step="1" value="1">
    <div class="ue-rounds-read">
      <div><span class="k">Round</span><b id="ue-rounds-n">1</b></div>
      <div class="c"><span class="k">Resolve uncertainty</span><b id="ue-rounds-c">+5</b></div>
      <div class="u"><span class="k">Leave it unresolved</span><b id="ue-rounds-u">−4</b></div>
      <p id="ue-rounds-say" role="status"></p>
    </div>
  </div>

  <div class="ue-equation big"><span>best move<sub>short</sub></span><b>≠</b><span>best move<sub>long</sub></span></div>
  <p>The numbers show the trade-off, not measured values. Immediate relief can cost more across repeated decisions.</p>
  <div class="ue-tax"><svg class="ue-i"><use href="#ue-scale"/></svg><div><h3>The certainty tax</h3><p>time resolving + opportunities avoided + attention consumed + dependence created</p></div><b>How much am I willing to pay to know for sure?</b></div>
  <div class="ue-taxbars" aria-label="The four costs named above, shown as a stack">
    <span class="ue-taxbar t1"><svg class="ue-i"><use href="#ue-clock"/></svg><em>time resolving</em></span>
    <span class="ue-taxbar t2"><svg class="ue-i"><use href="#ue-fork"/></svg><em>opportunities avoided</em></span>
    <span class="ue-taxbar t3"><svg class="ue-i"><use href="#ue-eye"/></svg><em>attention consumed</em></span>
    <span class="ue-taxbar t4"><svg class="ue-i"><use href="#ue-magnet"/></svg><em>dependence created</em></span>
  </div>
</section>

<section class="ue-part ue-prose" id="training">
  <h2><span>04</span><svg class="ue-i ue-h2-i"><use href="#ue-dumbbell"/></svg> Practise the gap</h2>
  <p class="ue-deck">Create a gap between the urge for relief and your response. That gap gives judgment time to return.</p>
  <div class="ue-formula"><div><svg class="ue-i"><use href="#ue-alarm"/></svg><b>Uncertainty</b></div><i>+</i><div><svg class="ue-i"><use href="#ue-open"/></svg><b>An open question</b></div><i>+</i><div><svg class="ue-i"><use href="#ue-move"/></svg><b>Chosen action</b></div><i>=</i><strong>Practice</strong></div>

  <div class="ue-curveviz">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-curveline"/></svg> What the feeling does when you do not act on it</p>
    <div class="ue-curve-modes" id="ue-curve-modes" role="group" aria-label="Choose a response">
      <button data-mode="relieve" class="is-on"><svg class="ue-i"><use href="#ue-cycle"/></svg><b>Do the relief move</b><small>each time the urge arrives</small></button>
      <button data-mode="stay"><svg class="ue-i"><use href="#ue-surf"/></svg><b>Stay with it</b><small>and keep doing what you were doing</small></button>
    </div>
    <svg class="ue-curve-svg" id="ue-curve" viewBox="0 0 520 230" role="img"
         aria-label="Distress over time, with and without the relief move.">
      <line class="ax" x1="46" y1="188" x2="502" y2="188"/>
      <line class="ax" x1="46" y1="14" x2="46" y2="188"/>
      <text class="tick" x="40" y="24" text-anchor="end">high</text>
      <text class="tick" x="40" y="188" text-anchor="end">low</text>
      <text class="tick" x="46" y="208">the urge arrives</text>
      <text class="tick" x="502" y="208" text-anchor="end">time passes</text>
      <path class="band" id="ue-curve-band"/>
      <path class="ln" id="ue-curve-line"/>
      <g id="ue-curve-marks"></g>
      <line class="scrub" id="ue-curve-scrub" x1="46" y1="14" x2="46" y2="188"/>
      <circle class="dot" id="ue-curve-dot" r="5"/>
    </svg>
    <label class="ue-sr" for="ue-curve-range">Time since the urge arrived</label>
    <input class="ue-range" id="ue-curve-range" type="range" min="0" max="100" step="1" value="0">
    <div class="ue-curve-read">
      <div><span class="k"><svg class="ue-i"><use href="#ue-timer"/></svg>Elapsed</span><b id="ue-curve-t">0 min</b></div>
      <div><span class="k">Level</span><b id="ue-curve-v">rising</b></div>
      <p id="ue-curve-say" role="status"></p>
    </div>
  </div>

  <div class="ue-gapviz" aria-label="The gap between the urge for relief and the response">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-dumbbell"/></svg> Where the training happens</p>
    <div class="ue-gaptrack">
      <span class="ue-gapnode urge"><svg class="ue-i"><use href="#ue-magnet"/></svg><b>Urge</b><small>relief now</small></span>
      <span class="ue-gapspan"><i></i><em>the gap</em></span>
      <span class="ue-gapnode act"><svg class="ue-i"><use href="#ue-target"/></svg><b>Chosen action</b><small>judgment returns</small></span>
    </div>
    <div class="ue-gaptrack is-old">
      <span class="ue-gapnode urge"><svg class="ue-i"><use href="#ue-magnet"/></svg><b>Urge</b></span>
      <span class="ue-gapspan is-none"><i></i><em>no gap</em></span>
      <span class="ue-gapnode auto"><svg class="ue-i"><use href="#ue-cycle"/></svg><b>Automatic relief move</b></span>
    </div>
  </div>

  <ol class="ue-protocol">
    <li data-step="1"><svg class="ue-i ue-step-i"><use href="#ue-signal"/></svg><b>Identify the signal.</b><span>“My alarm is active.”</span></li>
    <li data-step="2"><svg class="ue-i ue-step-i"><use href="#ue-label"/></svg><b>Name the uncertainty.</b><span>What if I am wrong? What if I regret this? What if this feeling means something?</span></li>
    <li data-step="3"><svg class="ue-i ue-step-i"><use href="#ue-magnet"/></svg><b>Find the relief move.</b><span>What would I do now mainly to make this feeling stop?</span></li>
    <li data-step="4"><svg class="ue-i ue-step-i"><use href="#ue-openq"/></svg><b>Leave the question open.</b><span>Maybe. Maybe not. I do not currently know.</span></li>
    <li data-step="5"><svg class="ue-i ue-step-i"><use href="#ue-allow"/></svg><b>Allow the feeling.</b><span>Let doubt, discomfort, fear, or guilt be present without arguing with it.</span></li>
    <li data-step="6"><svg class="ue-i ue-step-i"><use href="#ue-step"/></svg><b>Return to chosen action.</b><span>What would I be doing if I did not need to solve this first?</span></li>
  </ol>
  <div class="ue-runbar">
    <span class="k"><svg class="ue-i"><use href="#ue-medal"/></svg> Steps run</span>
    <span class="num"><b id="ue-step-n">0</b> of 6</span>
    <div class="ue-runbar-track" aria-hidden="true"><i id="ue-step-fill"></i></div>
    <button class="ue-btn" id="ue-step-reset" type="button">Clear</button>
  </div>
  <div class="ue-delay" aria-label="Three ways to interrupt an automatic response">
    <div><svg class="ue-i"><use href="#ue-clock"/></svg><b>Delay</b><span>Wait a little before checking, asking, or reviewing.</span></div>
    <div><svg class="ue-i"><use href="#ue-reduce"/></svg><b>Reduce</b><span>Do one review instead of five, or gather only decision-relevant facts.</span></div>
    <div><svg class="ue-i"><use href="#ue-target"/></svg><b>Choose</b><span>Return attention to the task, person, or commitment that matters now.</span></div>
  </div>

  <div class="ue-wave-block">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-surf"/></svg> One wave, start to finish</p>
    <div class="ue-wavesteps">
      <span class="w1"><svg class="ue-i"><use href="#ue-urgency"/></svg><b>It rises</b><small>faster than you expected</small></span>
      <span class="w2"><svg class="ue-i"><use href="#ue-distress"/></svg><b>It peaks</b><small>the part that feels unbearable while it lasts</small></span>
      <span class="w3"><svg class="ue-i"><use href="#ue-allow"/></svg><b>It falls</b><small>on its own, without being solved</small></span>
      <span class="w4"><svg class="ue-i"><use href="#ue-steady"/></svg><b>You are still here</b><small>and the next one arrives smaller</small></span>
    </div>
    <p class="ue-wave-note">This line asks you to keep doing what you chose while the feeling runs.</p>
  </div>

  <div class="ue-success"><svg class="ue-i"><use href="#ue-gauge"/></svg><span>Success is measured here</span><b>chosen action despite uncertainty</b><small>Anxiety may fall, stay, or rise. Its level does not grade the exercise.</small></div>
</section>

<section class="ue-part ue-prose" id="state">
  <h2><span>05</span><svg class="ue-i ue-h2-i"><use href="#ue-brain"/></svg> Read the emotion before acting</h2>
  <p class="ue-deck">An emotion carries information, an action urge, and physical energy. Separate those parts before choosing what to do.</p>

  <div class="ue-primer">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-brain"/></svg> Start here if you have never taken one apart</p>

    <div class="ue-primer-what">
      <p><b>An emotion is a signal with a body attached.</b> Something happens. Your mind interprets it,
      your body responds, and you feel an urge to act. These four parts arrive together and feel like
      one thing, but you can separate them.</p>
    </div>

    <div class="ue-primer-parts">
      <div class="s1"><svg class="ue-i"><use href="#ue-notice"/></svg><b>1. Something happens</b><span>An event, a thought, a memory, a sensation. It can come from outside or from nowhere obvious.</span></div>
      <i aria-hidden="true">→</i>
      <div class="s2"><svg class="ue-i"><use href="#ue-label"/></svg><b>2. You read it</b><span>Your mind decides what it means. This step is fast, invisible, and often wrong.</span></div>
      <i aria-hidden="true">→</i>
      <div class="s3"><svg class="ue-i"><use href="#ue-battery"/></svg><b>3. The body answers</b><span>Heart, breath, gut, jaw, temperature. The bodily alarm makes the interpretation feel factual.</span></div>
      <i aria-hidden="true">→</i>
      <div class="s4"><svg class="ue-i"><use href="#ue-magnet"/></svg><b>4. An urge appears</b><span>Do something, or stop doing something. You can answer an urge instead of obeying it.</span></div>
    </div>

    <div class="ue-primer-note">
      <p><b>You can question your interpretation.</b> The event already happened and your body is already
      responding. You can still question the story your mind attached to it.</p>
    </div>

    <div class="ue-primer-facts">
      <div><svg class="ue-i"><use href="#ue-curveline"/></svg><b>Emotions change</b><span>Intensity rises and falls, even when a feeling seems fixed while you are inside it.</span></div>
      <div><svg class="ue-i"><use href="#ue-allow"/></svg><b>Feeling it is not agreeing with it</b><span>You can notice fear without treating the danger as real, and notice guilt without being guilty.</span></div>
      <div><svg class="ue-i"><use href="#ue-label"/></svg><b>Name it before you act</b><span>A precise word gives you something specific to inspect. Use the wheel below when “bad” is all you have.</span></div>
      <div><svg class="ue-i"><use href="#ue-openq"/></svg><b>None of them are forbidden</b><span>Every emotion is allowed. Actions are the part worth choosing carefully.</span></div>
    </div>

    <div class="ue-primer-vs">
      <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-venn"/></svg> Four words people mix up</p>
      <div class="ue-vsgrid">
        <div><span class="a">A feeling</span><span class="b">arrives on its own, cannot be ordered, and passes</span></div>
        <div><span class="a">A mood</span><span class="b">lasts longer, has no single trigger, and colours everything you read</span></div>
        <div><span class="a">A thought</span><span class="b">is a sentence in your head; it can be true, false, or loud</span></div>
        <div><span class="a">An action</span><span class="b">is the only one of the four you choose, and the only one anyone else can see</span></div>
      </div>
    </div>
  </div>


  <div class="ue-wheel-block" id="ue-wheel-block">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-wheelmark"/></svg> Find the word before you decide what to do</p>
    <div class="ue-wheel-views" id="ue-wheel-views" role="group" aria-label="Choose a wheel">
      <button type="button" data-view="cats" class="is-on" aria-pressed="true">27 categories<small>Cowen &amp; Keltner, 2017</small></button>
      <button type="button" data-view="axes" aria-pressed="false">Valence and control<small>Geneva Emotion Wheel</small></button>
      <button type="button" data-view="mine" aria-pressed="false">My wheel<small>written for this page</small></button>
    </div>
    <div class="ue-wheel-wrap">
      <div class="ue-wheel-scroll">
      <div class="ue-wheel-stage">
      <div class="ue-wheel-zones" id="ue-wheel-zones" aria-hidden="true" hidden></div>
      <svg class="ue-wheel" id="ue-wheel" viewBox="0 0 638 638" role="img"
           aria-label="A wheel of emotion words in three rings. Select any segment to read what it points at, what it urges, and one action that does not require the feeling to stop.">
      </svg>
      </div>
      </div>
      <p class="ue-wheel-swipe" aria-hidden="true">Swipe the wheel sideways</p>
      <div class="ue-wheel-read" id="ue-wheel-read" role="status">
        <p class="ue-wheel-hint"><svg class="ue-i"><use href="#ue-eye"/></svg> Select any word. The centre keeps whatever you chose last.</p>
      </div>
    </div>
    <div class="ue-btn-row"><button class="ue-btn" id="ue-wheel-clear" type="button">Clear selection</button></div>
    <div class="ue-wheel-cite" id="ue-wheel-cite" data-view="cats">
      <p class="for-cats"><b>27 categories.</b> Cowen, A. S., &amp; Keltner, D. (2017). Self-report
      captures 27 distinct categories of emotion bridged by continuous gradients.
      <i>PNAS</i>, 114(38), E7900&ndash;E7909, from 2,185 videos rated by 853 participants.
      <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5617253/" target="_blank" rel="noreferrer">Read it</a>.
      The paper's own finding is that these categories are bridged by continuous gradients, with
      fuzzy boundaries between many of them. A ring of separate wedges simplifies a
      high-dimensional space.</p>
      <p class="for-axes"><b>Valence and control.</b> The Geneva Emotion Wheel. Scherer, K. R. (2005).
      What are emotions? And how can they be measured? <i>Social Science Information</i>, 44(4),
      693&ndash;727; instrument version 3.0 in Scherer, Shuman, Fontaine &amp; Soriano (2013),
      <i>Components of Emotional Meaning</i>, Oxford University Press, 281&ndash;298.
      <a href="https://www.unige.ch/cisa/gew" target="_blank" rel="noreferrer">Instrument</a>.
      The twenty families and their order are the instrument's. The two axes and the four quadrants
      are Scherer's; the short quadrant names are my own shorthand.</p>
      <p class="for-mine"><b>My wheel.</b> Eight families, twenty-four broader words and seventy-three
      finer ones, with every definition written for this page. I wrote it for this page, and it stands
      apart from the two wheels above. The four zones use the same axes the Geneva wheel uses,
      but they are arcs sized to the families rather than four equal quarters, and which family sits
      where is my judgement. Fear sits on the low-control side here and on the high-control side on
      the Geneva instrument. Both are shown rather than reconciled.</p>
      <p class="always">Definitions describe each published category in plain English. The lines
      about urges and about what to do are my reading and are not findings from either paper.
      The main opposing account holds that emotions are constructed in the moment rather than read
      off fixed categories: Barrett, L. F. (2017),
      <a href="https://academic.oup.com/scan/article/12/1/1/2823712" target="_blank" rel="noreferrer">The theory of constructed emotion</a>,
      <i>Social Cognitive and Affective Neuroscience</i>, 12(1), 1&ndash;23.</p>
    </div>
  </div>

  <div class="ue-anatomy" aria-label="One emotion separated into information, an action urge, and physical energy">
    <div class="ue-anatomy-src"><svg class="ue-i"><use href="#ue-heart"/></svg><b>One emotion</b></div>
    <div class="ue-anatomy-fan" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="ue-anatomy-parts">
      <span class="p1"><svg class="ue-i"><use href="#ue-evidence"/></svg><b>Information</b><small>what it is pointing at</small></span>
      <span class="p2"><svg class="ue-i"><use href="#ue-magnet"/></svg><b>Action urge</b><small>what it wants you to do</small></span>
      <span class="p3"><svg class="ue-i"><use href="#ue-battery"/></svg><b>Physical energy</b><small>what the body is doing</small></span>
    </div>
  </div>

  <div class="ue-oern" id="ue-oern">
    <button data-copy="Name the event, your interpretation, the emotion, the body response, and the urge. Do not blend them into one fact."><svg class="ue-i"><use href="#ue-eye"/></svg><b>Observe</b><span>Separate the parts.</span></button>
    <button data-copy="Ask what the available evidence supports. An emotion can be valid even when its first interpretation is incomplete."><svg class="ue-i"><use href="#ue-evidence"/></svg><b>Check</b><span>Read the facts.</span></button>
    <button data-copy="Slow the body enough to choose. Unclench, lengthen the exhale, feel the floor, and widen your view."><svg class="ue-i"><use href="#ue-wave"/></svg><b>Settle</b><span>Lower the speed.</span></button>
    <button data-copy="Follow the urge when it fits the facts. When it does not, take one small action in the more useful direction."><svg class="ue-i"><use href="#ue-move"/></svg><b>Choose</b><span>Act deliberately.</span></button>
  </div>

  <div class="ue-overlap">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-venn"/></svg> Two readings, and the place you can act from</p>
    <svg class="ue-overlap-svg" viewBox="0 0 460 240" role="img"
         aria-label="Two overlapping circles: what the facts support, and what the feeling says. The overlap is where a choice is available.">
      <circle class="c-fact" cx="175" cy="118" r="94"/>
      <circle class="c-feel" cx="285" cy="118" r="94"/>
      <text class="lab fact" x="104" y="112" text-anchor="middle">What the facts</text>
      <text class="lab fact" x="104" y="130" text-anchor="middle">support</text>
      <text class="lab feel" x="356" y="112" text-anchor="middle">What the feeling</text>
      <text class="lab feel" x="356" y="130" text-anchor="middle">says</text>
      <text class="lab mid" x="230" y="112" text-anchor="middle">Where you</text>
      <text class="lab mid" x="230" y="130" text-anchor="middle">can choose</text>
      <text class="cap" x="230" y="232" text-anchor="middle">Neither circle alone tells you what to do next.</text>
    </svg>
  </div>

  <p class="ue-oern-read" id="ue-oern-read" role="status">Choose a state skill to see its operating instruction.</p>

  <div class="ue-band-block">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-window"/></svg> Which band are you in right now?</p>
    <div class="ue-bands" id="ue-bands" role="group" aria-label="Choose your current band">
      <button data-band="over"><svg class="ue-i"><use href="#ue-urgency"/></svg><b>Too switched on</b><small>racing, urgent, unable to sit still</small></button>
      <button data-band="mid" class="is-on"><svg class="ue-i"><use href="#ue-target"/></svg><b>Able to choose</b><small>feeling something, still steering</small></button>
      <button data-band="under"><svg class="ue-i"><use href="#ue-battery"/></svg><b>Switched off</b><small>flat, foggy, far away</small></button>
    </div>
    <div class="ue-band-strip" id="ue-band-strip" aria-hidden="true"><i class="over"></i><i class="mid"></i><i class="under"></i><span id="ue-band-mark"></span></div>
    <div class="ue-band-read" id="ue-band-read" role="status"></div>
  </div>

  <div class="ue-three"><p><svg class="ue-i"><use href="#ue-distress"/></svg>Check <b>danger</b> against the facts.</p><p><svg class="ue-i"><use href="#ue-urgency"/></svg>Check <b>importance</b> against the stakes.</p><p><svg class="ue-i"><use href="#ue-signal"/></svg>Check <b>action</b> against your judgment.</p></div>

  <div class="ue-levers">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-release"/></svg> Four ways to lower the speed in under two minutes</p>
    <div class="ue-lever-grid">
      <div><svg class="ue-i"><use href="#ue-cold"/></svg><b>Cold</b><span>Cold water on the face or wrists. The body slows before the mind agrees to.</span></div>
      <div><svg class="ue-i"><use href="#ue-run"/></svg><b>Move</b><span>Two minutes of hard movement burns off what the alarm just released.</span></div>
      <div><svg class="ue-i"><use href="#ue-breathe"/></svg><b>Longer out-breath</b><span>Make the exhale longer than the inhale for one minute.</span></div>
      <div><svg class="ue-i"><use href="#ue-release"/></svg><b>Release</b><span>Tense a muscle group hard, hold, then let go. Repeat once.</span></div>
    </div>
    <p class="ue-lever-note">These buy a few minutes of steadier judgment. They will not remove the feeling, and you can carry on before they work.</p>
  </div>


  <div class="ue-opp">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-opposite"/></svg> When a feeling's instruction does not match the situation</p>
    <p class="ue-opp-intro">Every feeling comes with an urge to act. First ask whether the facts support that urge. If they do, act on the problem. If they do not, choose a small action in the other direction. The aim is not to deny the feeling. It is to stop the feeling from deciding for you.</p>
    <div class="ue-opp-rows">
      <div class="ue-opp-head" aria-hidden="true"><span>Feeling</span><span>What it urges you to do</span><i></i><span>If the facts do not support that urge</span></div>
      <div><span class="f">Fear</span><span class="u"><svg class="ue-i"><use href="#ue-magnet"/></svg> avoid it entirely</span><i aria-hidden="true"><svg class="ue-i"><use href="#ue-opposite"/></svg></i><span class="o">approach it in a small step you can repeat</span></div>
      <div><span class="f">Anger</span><span class="u"><svg class="ue-i"><use href="#ue-magnet"/></svg> strike back now</span><i aria-hidden="true"><svg class="ue-i"><use href="#ue-opposite"/></svg></i><span class="o">step away, then state the boundary once</span></div>
      <div><span class="f">Sadness</span><span class="u"><svg class="ue-i"><use href="#ue-magnet"/></svg> withdraw and stop</span><i aria-hidden="true"><svg class="ue-i"><use href="#ue-opposite"/></svg></i><span class="o">keep one small commitment to another person</span></div>
      <div><span class="f">Shame</span><span class="u"><svg class="ue-i"><use href="#ue-magnet"/></svg> hide or over-explain</span><i aria-hidden="true"><svg class="ue-i"><use href="#ue-opposite"/></svg></i><span class="o">say what happened once, repair what you can, and carry on</span></div>
      <div><span class="f">Doubt</span><span class="u"><svg class="ue-i"><use href="#ue-magnet"/></svg> keep checking until you feel certain</span><i aria-hidden="true"><svg class="ue-i"><use href="#ue-opposite"/></svg></i><span class="o">allow the uncertainty to remain and return to the task</span></div>
    </div>
    <p class="ue-opp-note"><b>Follow emotion when it fits the facts.</b> Fear should move you away from real danger. Anger may identify a real violation. Sadness may show that rest is needed. Use the opposite action only when the urge is stronger than the facts justify or keeps you trapped after the immediate problem has passed.</p>
  </div>

  <div class="ue-warning"><svg class="ue-i"><use href="#ue-pause"/></svg><b>Slow down enough to choose.</b><p>Use breathing, movement, or sensory grounding to regain choice. You can continue while still upset.</p></div>
</section>

<section class="ue-part ue-prose" id="budget">
  <h2><span>06</span><svg class="ue-i ue-h2-i"><use href="#ue-wallet"/></svg> Give uncertainty a budget</h2>
  <p class="ue-deck">Let the external stakes decide how much checking the problem deserves.</p>
  <div class="ue-budget" id="ue-budget">
    <button data-answer="Check the account or receipt once. The answer is a finite external fact."><b>A</b><svg class="ue-i"><use href="#ue-fact"/></svg><span>Actionable</span><small>Did I pay the electricity bill?</small></button>
    <button data-answer="Gather decision-relevant evidence, set a deadline, then choose."><b>B</b><svg class="ue-i"><use href="#ue-search"/></svg><span>Researchable</span><small>Which job has better economics?</small></button>
    <button data-answer="No useful amount of analysis can buy this guarantee. Accept residual uncertainty."><b>C</b><svg class="ue-i"><use href="#ue-infinity"/></svg><span>Unresolvable</span><small>Can I know I will never regret this?</small></button>
  </div>
  <p class="ue-budget-read" id="ue-budget-read" role="status">Select a category.</p>
  <p>No fixed number of checks fits every problem. Use the amount of evidence the stakes require. Stop when another round would mainly answer discomfort rather than improve the decision.</p>
</section>

<section class="ue-part ue-prose" id="decisions">
  <h2><span>07</span><svg class="ue-i ue-h2-i"><use href="#ue-fork"/></svg> Reopen decisions for new information</h2>
  <p class="ue-deck">Reopen a decision when the world changes. If only your anxiety rose, pause before reviewing it again.</p>
  <div class="ue-decision" id="ue-decision">
    <p><svg class="ue-i"><use href="#ue-fork"/></svg> After deciding, what changed?</p>
    <div><button data-decision="evidence"><svg class="ue-i"><use href="#ue-newevidence"/></svg>New external evidence</button><button data-decision="anxiety"><svg class="ue-i"><use href="#ue-wave"/></svg>Only anxiety rose</button></div>
    <output id="ue-decision-out">Choose the closest answer.</output>
  </div>
  <div class="ue-voiviz">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-fork"/></svg> Where the lines cross</p>
    <svg class="ue-voi-svg" id="ue-voi" viewBox="0 0 520 220" role="img" aria-label="Value of more information falls as you gather more, while the cost of delay rises. Decide where they cross.">
      <line class="ax" x1="46" y1="180" x2="500" y2="180"/>
      <line class="ax" x1="46" y1="16" x2="46" y2="180"/>
      <path class="v-info" id="ue-voi-info"/>
      <path class="v-cost" id="ue-voi-cost"/>
      <line class="cross" id="ue-voi-cross"/>
      <circle class="cross-dot" id="ue-voi-dot" r="5"/>
      <text class="clab info" id="ue-voi-lab-i" x="0" y="0">value of more information</text>
      <text class="clab cost" id="ue-voi-lab-c" x="0" y="0">cost of delay</text>
      <text class="tick" x="46" y="200">start</text>
      <text class="tick" x="500" y="200" text-anchor="end">more gathering</text>
      <text class="decide" id="ue-voi-decide" x="0" y="0">decide here</text>
    </svg>
  </div>

  <div class="ue-voi"><span>keep researching while</span><b>value of more information &gt; cost of delay</b><span>decide when</span><b>value of more information &lt; cost of delay</b></div>
  <p>After deciding, do not reopen the case solely because discomfort remains. Reconsider when genuinely new evidence changes the decision.</p>
</section>

<section class="ue-part ue-prose" id="practice">
  <h2><span>08</span><svg class="ue-i ue-h2-i"><use href="#ue-ladder"/></svg> Build capacity gradually</h2>
  <p class="ue-deck">Start with a manageable uncertainty, repeat it, and increase the difficulty when you can keep choosing your response.</p>
  <div class="ue-ladder" aria-label="Example uncertainty ladder">
    <div class="ue-rung" style="--w:24%"><button class="ue-rung-tick" type="button" aria-pressed="false"><svg class="ue-i"><use href="#ue-check"/></svg></button><b>2/10</b><span>Leave a minor message imperfect</span></div>
    <div class="ue-rung" style="--w:36%"><button class="ue-rung-tick" type="button" aria-pressed="false"><svg class="ue-i"><use href="#ue-check"/></svg></button><b>3/10</b><span>Do not reread a routine email</span></div>
    <div class="ue-rung" style="--w:52%"><button class="ue-rung-tick" type="button" aria-pressed="false"><svg class="ue-i"><use href="#ue-check"/></svg></button><b>4–5/10</b><span>Make a small decision without extra research</span></div>
    <div class="ue-rung" style="--w:70%"><button class="ue-rung-tick" type="button" aria-pressed="false"><svg class="ue-i"><use href="#ue-check"/></svg></button><b>6/10</b><span>Enter a consequential situation without trying to settle every doubt</span></div>
    <div class="ue-rung" style="--w:90%"><button class="ue-rung-tick" type="button" aria-pressed="false"><svg class="ue-i"><use href="#ue-check"/></svg></button><b>7–8/10</b><span>Tolerate personally difficult ambiguity</span></div>
  </div>
  <div class="ue-runbar">
    <span class="k"><svg class="ue-i"><use href="#ue-ladder"/></svg> Rungs held</span>
    <span class="num"><b id="ue-rung-n">0</b> of 5</span>
    <div class="ue-runbar-track" aria-hidden="true"><i id="ue-rung-fill"></i></div>
    <button class="ue-btn" id="ue-rung-reset" type="button">Clear</button>
  </div>


  <div class="ue-planner" id="ue-planner">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-plan"/></svg> Plan one rung, then run it</p>
    <div class="ue-plan-grid">
      <label class="p1"><span>The uncertainty I am practising</span>
        <input class="ue-input" id="ue-plan-what" type="text" placeholder="Name it in one line" autocomplete="off"></label>
      <label class="p2"><span><svg class="ue-i"><use href="#ue-nocheck"/></svg>The relief move I am not doing</span>
        <input class="ue-input" id="ue-plan-skip" type="text" placeholder="What I would normally do to feel sure" autocomplete="off"></label>
      <div class="p3"><span>Difficulty before</span>
        <input class="ue-range" id="ue-plan-before" type="range" min="0" max="10" step="1" value="5">
        <b id="ue-plan-before-v">5</b></div>
      <div class="p4"><span>Difficulty after</span>
        <input class="ue-range" id="ue-plan-after" type="range" min="0" max="10" step="1" value="5">
        <b id="ue-plan-after-v">5</b></div>
    </div>
    <div class="ue-plan-out" id="ue-plan-out" role="status"></div>
    <div class="ue-btn-row">
      <button class="ue-btn is-primary" id="ue-plan-add" type="button">Log this round</button>
      <button class="ue-btn" id="ue-plan-clear" type="button">Clear the log</button>
    </div>
    <div class="ue-plan-log" id="ue-plan-log"></div>
  </div>

  <div class="ue-courage"><div><svg class="ue-i"><use href="#ue-shield"/></svg><span>Courage</span><b>chosen action despite fear</b></div><div><svg class="ue-i"><use href="#ue-steady"/></svg><span>Confidence</span><b>trust in your ability to respond</b></div></div>
  <p>Act from a reasonable reading of the situation, a proportionate response, and enough trust that you can handle what follows.</p>
  <div class="ue-practice-log" aria-label="Practice review">
    <div><svg class="ue-i"><use href="#ue-openq"/></svg><small>Before</small><b>What am I unsure about?</b><span>Name one unresolved question.</span></div>
    <div><svg class="ue-i"><use href="#ue-magnet"/></svg><small>During</small><b>What is the urge?</b><span>Notice what promises immediate relief.</span></div>
    <div><svg class="ue-i"><use href="#ue-check"/></svg><small>After</small><b>What did I choose?</b><span>Record behaviour, not whether you felt calm.</span></div>
  </div>
</section>

<section class="ue-part ue-prose" id="support">
  <h2><span>09</span><svg class="ue-i ue-h2-i"><use href="#ue-hands"/></svg> Support without borrowed certainty</h2>
  <p class="ue-deck">Good support keeps a person present long enough to decide without answering the same fear forever.</p>
  <div class="ue-support">
    <article><header><svg class="ue-i"><use href="#ue-ask"/></svg><div><small>When asking for help</small><h3>Ask for company or perspective</h3></div></header><ul aria-label="Examples of asking for help"><li>“Sit with me while I make the call.”</li><li>“What fact do you think I am missing?”</li><li>“Help me return to the plan I already chose.”</li></ul></article>
    <article><header><svg class="ue-i"><use href="#ue-steady"/></svg><div><small>When helping someone</small><h3>Offer steadiness, not guarantees</h3></div></header><ul aria-label="Examples of helping someone"><li>“I can see this is hard.”</li><li>“I do not have a guarantee, but I can stay with you.”</li><li>“What did you decide before the worry rose?”</li></ul></article>
  </div>
  <div class="ue-support-lab" id="ue-support-lab">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-hands"/></svg> What does this request need?</p>
    <div><button type="button" data-ue-support="fact">“Did the payment go through?”</button><button type="button" data-ue-support="company">“Stay with me while I make the call.”</button><button type="button" data-ue-support="guarantee">“Tell me again that I chose correctly.”</button></div>
    <p id="ue-support-read" role="status">Choose a request. The useful response depends on whether it seeks a fact, company, or borrowed certainty.</p>
  </div>
  <p>Agree on the boundary before the pressure peaks. Decide which questions deserve a factual answer, which decisions belong to the person making them, and how support will respond when the same request returns.</p>
</section>

<section class="ue-part ue-prose" id="reset">
  <h2><span>10</span><svg class="ue-i ue-h2-i"><use href="#ue-restart"/></svg> Recover without a trial</h2>
  <p class="ue-deck">After a difficult round, skip the trial. Ask what you can adjust next.</p>

  <div class="ue-stopseq">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-stop"/></svg> Before any of that, four beats</p>
    <div class="ue-stopgrid">
      <span><svg class="ue-i"><use href="#ue-stop"/></svg><b>Stop</b><small>no message, no decision, no review</small></span>
      <span><svg class="ue-i"><use href="#ue-pause"/></svg><b>Step back</b><small>put one metre and one minute between you and it</small></span>
      <span><svg class="ue-i"><use href="#ue-notice"/></svg><b>Look</b><small>what happened, in plain words</small></span>
      <span><svg class="ue-i"><use href="#ue-smallstep"/></svg><b>Go on</b><small>the next useful action, at a size you can repeat</small></span>
    </div>
  </div>

  <div class="ue-reset">
    <div><b>1</b><svg class="ue-i"><use href="#ue-notice"/></svg><span><strong>Notice</strong>You went back to checking, avoidance, or repeated review.</span></div>
    <div><b>2</b><svg class="ue-i"><use href="#ue-nojudge"/></svg><span><strong>Drop the verdict</strong>Describe what happened without turning it into a character judgment.</span></div>
    <div><b>3</b><svg class="ue-i"><use href="#ue-pressure"/></svg><span><strong>Find the pressure point</strong>Was the step too large, the stakes unclear, or your capacity already low?</span></div>
    <div><b>4</b><svg class="ue-i"><use href="#ue-smallstep"/></svg><span><strong>Resume smaller</strong>Take the next useful action at a size you can repeat.</span></div>
  </div>

  <div class="ue-fig" id="uefig-resume">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-restart"/></svg> After a setback: judge yourself or adjust the next step</p>
    <p class="ue-resume-intro">Suppose you returned to checking, avoidance, or repeated review. Self-judgment turns the setback into a verdict about you. Review identifies what made the step hard and what to change before the next attempt. Only review produces a usable restart.</p>
    <div class="rs-pick" id="rs-pick" role="group" aria-label="Choose a response">
      <button type="button" data-rs="trial">Judge yourself and plan a perfect restart</button>
      <button type="button" data-rs="curious" class="is-on">Find what made it hard and restart smaller</button>
    </div>
    <p class="rs-track-label">Illustrative delay before restarting</p>
    <div class="rs-track" id="rs-track" aria-hidden="true"></div>
    <div class="ue-fig-read">
      <div><span class="k">Illustrative wait</span><b id="rs-days-n">1 day</b></div>
      <div><span class="k">Next attempt</span><b id="rs-size">Smaller and repeatable</b></div>
      <p id="rs-say" role="status"></p>
    </div>
  </div>

  <div class="ue-accept">
    <p class="ue-viz-k"><svg class="ue-i"><use href="#ue-accept"/></svg> The part that stays open</p>
    <div class="ue-accept-two">
      <div class="closed"><svg class="ue-i"><use href="#ue-fact"/></svg><b>What can be settled</b><span>Facts you can check once. Actions you can take. Repairs you can make.</span></div>
      <div class="open"><svg class="ue-i"><use href="#ue-infinity"/></svg><b>What stays open</b><span>Whether you will feel this again. Whether you were understood. Whether it was the best possible choice.</span></div>
    </div>
    <p class="ue-accept-note">Arguing with the second column does not shrink it. It matters less each time you act while it stays open.</p>
  </div>

  <p class="ue-compassion">Speak to yourself as you would to someone you respect: accurately, without humiliation, and without inventing a guarantee. Kindness helps you return to the work. It does not require pretending the work is easy.</p>
  <div class="ue-coda" aria-label="The complete uncertainty operating sequence">
    <p>When uncertainty appears</p>
    <div><span><svg class="ue-i"><use href="#ue-notice"/></svg><b>Ask the world</b>What does the situation objectively require?</span><i>→</i><span><svg class="ue-i"><use href="#ue-brain"/></svg><b>Ask the mind</b>What am I being urged to do only for relief?</span><i>→</i><span><svg class="ue-i"><use href="#ue-target"/></svg><b>Choose the larger game</b>What action serves the life I am building?</span></div>
    <strong>Make the next decision from the facts you have, at a size you can carry.</strong>
  </div>
</section>
