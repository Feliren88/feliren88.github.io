---
layout: page
title: How to Read People
subtitle: A field manual for observing behaviour without inventing certainty
description: Observe behaviour, test competing explanations, and match trust to the evidence.
permalink: /read-people/
date: 2026-08-26
last_modified_at: 2026-08-26
layout-class: page read-people
extra_css: /css/read-people.css
extra_js: /js/components/read-people.js
preload_image: /assets/img/read-people-hero.webp
image: /assets/img/read-people-hero.webp
---

<div class="rp-progress" aria-hidden="true"><span id="rp-progress-fill"></span></div>

<nav class="rp-rail" aria-label="Reading path">
  <a href="#observe"><b>01</b><span>Observe</span></a>
  <a href="#infer"><b>02</b><span>Infer</span></a>
  <a href="#character"><b>03</b><span>Character</span></a>
  <a href="#dynamics"><b>04</b><span>Dynamics</span></a>
  <a href="#verify"><b>05</b><span>Verify</span></a>
  <a href="#train"><b>06</b><span>Train</span></a>
  <a href="#reference"><b>100</b><span>Reference</span></a>
</nav>

<header class="rp-hero" id="observe">
  <div class="rp-hero-copy">
    <p class="rp-kicker">Observation before interpretation</p>
    <h1>See patterns quickly. Believe them slowly.</h1>
    <p>Reading people means making inferences under uncertainty. Notice what changed, keep several explanations alive, and test what each one predicts.</p>
    <div class="rp-hero-rule"><span>First law</span><strong>Inference ≠ mind-reading</strong></div>
  </div>
  <figure class="rp-hero-art">
    <img src="/assets/img/read-people-hero.webp" alt="An observer at a gathering notices the relationships among several conversations." width="1672" height="941">
    <figcaption>One room. Many plausible stories.</figcaption>
  </figure>
</header>

<section class="rp-strip" aria-label="Core reading sequence">
  <span>Behaviour</span><i>+</i><span>Situation</span><i>+</i><span>Incentives</span><i>+</i><span>State</span><i>+</i><span>Relationship</span><i>+</i><span>History</span>
</section>

<section class="rp-part" id="infer">
  <div class="rp-heading"><span>01</span><div><h2>Observe before you explain</h2><p>One gesture tells you little. A repeated change under real stakes tells you more.</p></div></div>

  <div class="rp-evidence">
    <div class="rp-evidence-scale" role="img" aria-label="Evidence grows from a single signal to repeated behaviour under consequence">
      <button data-level="1"><b>1</b><span>Signal</span><small>one gesture</small></button>
      <button data-level="2"><b>2</b><span>Cluster</span><small>several cues</small></button>
      <button data-level="3"><b>3</b><span>Change</span><small>off baseline</small></button>
      <button data-level="4"><b>4</b><span>Pattern</span><small>repeated</small></button>
      <button data-level="5" class="is-on"><b>5</b><span>Cost</span><small>stakes are real</small></button>
    </div>
    <div class="rp-evidence-read" id="rp-evidence-read"><span>Level 5 · strongest</span><p>Watch what happens when honesty, loyalty, competence, or courage costs something.</p></div>
  </div>

  <div class="rp-baseline-grid">
    <article><span>What you see</span><div class="rp-bars"><i style="--v:72%"></i><i style="--v:67%"></i><i style="--v:75%"></i><i class="hot" style="--v:78%"></i></div><p>They speak quickly. That may be normal.</p></article>
    <div class="rp-minus">−</div>
    <article><span>Personal baseline</span><div class="rp-bars base"><i style="--v:70%"></i><i style="--v:68%"></i><i style="--v:71%"></i><i style="--v:69%"></i></div><p>Compare the person with themselves.</p></article>
    <div class="rp-equals">=</div>
    <article class="result"><span>Useful signal</span><strong>+9</strong><p>Change carries more information than style.</p></article>
  </div>

  <div class="rp-rule-grid">
    <article><b>Find the baseline</b><p>Learn the person’s normal pace, posture, humour, gaze, and energy.</p></article>
    <article><b>Account for context</b><p>Ask what the role, room, culture, or immediate pressure already explains.</p></article>
    <article><b>Follow their choices</b><p>Track time, attention, money, sacrifice, and repeated decisions.</p></article>
    <article><b>Ask for specifics</b><p>Move from claims to examples: “What happened the last time?”</p></article>
  </div>
</section>

<section class="rp-part" id="character">
  <div class="rp-heading"><span>02</span><div><h2>Ask what could produce the behaviour</h2><p>Different motives can produce the same action. Keep those explanations separate.</p></div></div>

  <div class="rp-hypothesis-tool">
    <header><span>Three-hypothesis rule</span><h3>Why did they cancel?</h3><p>Choose the next piece of evidence. Watch the probabilities move.</p></header>
    <div class="rp-hypotheses">
      <article><span>A</span><b>Low interest</b><em id="rp-ha">34%</em><i><u id="rp-ba"></u></i></article>
      <article><span>B</span><b>Overloaded</b><em id="rp-hb">33%</em><i><u id="rp-bb"></u></i></article>
      <article><span>C</span><b>Unreliable</b><em id="rp-hc">33%</em><i><u id="rp-bc"></u></i></article>
    </div>
    <div class="rp-evidence-buttons">
      <button data-evidence="reschedule">They reschedule with a firm time</button>
      <button data-evidence="vague">A third vague cancellation</button>
      <button data-evidence="pressure">A family emergency is confirmed</button>
      <button data-evidence="reset">Reset</button>
    </div>
  </div>

  <div class="rp-motive-map">
    <article class="toward"><small>Moving toward</small><h3>Desired outcome</h3><ul><li>status</li><li>security</li><li>belonging</li><li>mastery</li><li>freedom</li></ul></article>
    <div class="rp-person"><span>Observed<br>behaviour</span></div>
    <article class="away"><small>Moving away from</small><h3>Feared outcome</h3><ul><li>rejection</li><li>dependence</li><li>shame</li><li>loss</li><li>insignificance</li></ul></article>
  </div>

  <div class="rp-dimensions">
    <header><h3>Keep dimensions separate</h3><p>A warm person can be unreliable. A difficult person can be honest.</p></header>
    <div><span>Confidence</span><i style="--v:82%"></i><b>82</b></div>
    <div><span>Competence</span><i style="--v:54%"></i><b>54</b></div>
    <div><span>Kindness</span><i style="--v:68%"></i><b>68</b></div>
    <div><span>Reliability</span><i style="--v:36%"></i><b>36</b></div>
    <div><span>Integrity</span><i style="--v:61%"></i><b>61</b></div>
  </div>

  <div class="rp-signal-cards">
    <article><span>Protect</span><h3>Where does defensiveness spike?</h3><p>It may mark identity investment: status, intelligence, morality, independence, or belonging.</p></article>
    <article><span>Spend</span><h3>Where do resources go?</h3><p>Time, attention, money, and sacrifice reveal priorities better than declarations.</p></article>
    <article><span>Trade</span><h3>What wins under conflict?</h3><p>Repeated trade-offs expose the person’s real value hierarchy.</p></article>
    <article><span>Admire</span><h3>What earns their respect?</h3><p>The trait they name may be one they want to develop.</p></article>
    <article><span>Envy</span><h3>What draws excess criticism?</h3><p>Repetition may reveal aspiration, threat, or conflict. It never proves projection.</p></article>
    <article><span>Brag</span><h3>What image do they sell?</h3><p>Repeated boasts show what they want others to notice and reward.</p></article>
  </div>
</section>

<section class="rp-part" id="dynamics">
  <div class="rp-heading"><span>03</span><div><h2>Watch people when the social cost changes</h2><p>Power, stress, failure, success, and boundaries make stable patterns easier to see.</p></div></div>

  <div class="rp-state-tabs" role="tablist" aria-label="High-information situations">
    <button role="tab" aria-selected="true" data-state="power">Power</button>
    <button role="tab" aria-selected="false" data-state="stress">Stress</button>
    <button role="tab" aria-selected="false" data-state="failure">Failure</button>
    <button role="tab" aria-selected="false" data-state="success">Success</button>
    <button role="tab" aria-selected="false" data-state="boundary">Boundary</button>
  </div>
  <div class="rp-state-panel" id="rp-state-panel"></div>

  <figure class="rp-room-map">
    <figcaption><span>Social architecture</span><b>Who looks at whom?</b><em>Click a person after the remark.</em></figcaption>
    <div class="rp-room" id="rp-room">
      <button style="--x:12%;--y:20%" data-role="formal"><i>A</i><span>formal lead</span></button>
      <button style="--x:72%;--y:14%" data-role="expert"><i>B</i><span>expert</span></button>
      <button style="--x:42%;--y:38%" data-role="informal"><i>C</i><span>quiet influence</span></button>
      <button style="--x:18%;--y:70%" data-role="connector"><i>D</i><span>connector</span></button>
      <button style="--x:78%;--y:68%" data-role="performer"><i>E</i><span>performer</span></button>
      <svg viewBox="0 0 600 300" aria-hidden="true"><path d="M90 75 Q280 25 450 60 M450 60 Q355 115 260 130 M110 220 Q180 170 260 130 M470 215 Q365 195 260 130"/></svg>
    </div>
    <p id="rp-room-read">A controversial joke lands. The room checks C before it reacts.</p>
  </figure>

  <div class="rp-trust">
    <header><span>Trust ladder</span><h3>Increase exposure as evidence grows</h3><p>Charisma does not count as follow-through.</p></header>
    <ol><li><b>Conversation</b><span>low exposure</span></li><li><b>Small commitment</b><span>test follow-through</span></li><li><b>Modest responsibility</b><span>observe repair</span></li><li><b>Meaningful dependence</b><span>verify consistency</span></li><li><b>High-stakes trust</b><span>earned over time</span></li></ol>
  </div>

  <div class="rp-warning"><strong>Healthy influence preserves agency.</strong><span>Repeated guilt, urgency, fear, confusion, isolation, and moving goalposts reduce it.</span></div>
</section>

<section class="rp-part" id="verify">
  <div class="rp-heading"><span>04</span><div><h2>Turn intuition into a test</h2><p>A useful interpretation predicts what should happen next.</p></div></div>

  <div class="rp-algorithm" aria-label="The people-reading algorithm">
    <span>Observe</span><i>→</i><span>Context</span><i>→</i><span>Baseline</span><i>→</i><span>Change</span><i>→</i><span>Cluster</span><i>→</i><span>Incentives</span><i>→</i><span>3 hypotheses</span><i>→</i><span>Question</span><i>→</i><span>Prediction</span><i>→</i><span>Verify</span><i>→</i><span>Update</span>
  </div>

  <div class="rp-separations">
    <article><span>State</span><i>≠</i><span>Trait</span><p>One tense meeting does not prove a tense personality.</p></article>
    <article><span>Capacity</span><i>≠</i><span>Character</span><p>Someone may care and still lack the skill to deliver.</p></article>
    <article><span>Intent</span><i>≠</i><span>Impact</span><p>Sincere motives do not make repeated harm safe.</p></article>
    <article><span>Explanation</span><i>≠</i><span>Excuse</span><p>Context can explain failure while responsibility remains.</p></article>
    <article><span>Confidence</span><i>≠</i><span>Accuracy</span><p>Specifics, track record, and error correction carry more weight.</p></article>
    <article><span>Incongruence</span><i>≠</i><span>Proof</span><p>A mismatch gives you a question, not a verdict.</p></article>
  </div>

  <div class="rp-decision-card">
    <div><small>Decision</small><h3>How much evidence do you need?</h3></div>
    <label><span>Stakes</span><input id="rp-stakes" type="range" min="1" max="5" value="3"></label>
    <div class="rp-threshold"><i id="rp-threshold-fill"></i></div>
    <p id="rp-threshold-copy">Meaningful responsibility needs repeated evidence across contexts.</p>
  </div>

  <blockquote class="rp-quote">Independent evidence beats any supposed lie-detection gesture.</blockquote>
</section>

<section class="rp-part" id="train">
  <div class="rp-heading"><span>05</span><div><h2>Train calibrated judgment</h2><p>Record predictions before the outcome. Hindsight can make any story feel obvious.</p></div></div>

  <div class="rp-calendar">
    <article><b>01–05</b><span>Observe facts only</span><p>Separate what happened from what you inferred.</p></article>
    <article><b>06–10</b><span>Build baselines</span><p>Learn normal pace, gaze, posture, humour, and energy.</p></article>
    <article><b>11–15</b><span>Predict</span><p>Write a confidence score before the result.</p></article>
    <article><b>16–20</b><span>Compete</span><p>Force three explanations for each important reading.</p></article>
    <article><b>21–24</b><span>Ask</span><p>Use questions that reveal motives and mechanisms.</p></article>
    <article><b>25–27</b><span>Map groups</span><p>Track attention, authority, repair, and coalitions.</p></article>
    <article><b>28–30</b><span>Review errors</span><p>Name the bias behind each miss.</p></article>
  </div>

  <div class="rp-journal">
    <header><span>10-minute drill</span><h3>Review one interaction in six fields</h3></header>
    <div><label>Observed<textarea placeholder="Only visible or audible facts"></textarea></label><label>Changed<textarea placeholder="What differed from baseline?"></textarea></label><label>Hypotheses<textarea placeholder="H1, benign H2, different H3"></textarea></label><label>Incentives<textarea placeholder="What did each person want or fear?"></textarea></label><label>Prediction<textarea placeholder="What should happen next?"></textarea></label><label>Confidence<input type="range" min="0" max="100" value="50"><output>50%</output></label></div>
    <p>Saved in this browser.</p>
  </div>

  <div class="rp-biases">
    <h3>Audit the reader</h3>
    <span>halo effect</span><span>confirmation bias</span><span>attribution error</span><span>projection</span><span>status bias</span><span>similarity bias</span><span>negativity bias</span>
  </div>

  <div class="rp-final">
    <div><span>Accuracy</span><i>+</i><span>Empathy</span><i>+</i><span>Boundaries</span></div>
    <p>Understand the person’s internal logic while keeping enough distance to protect your choices.</p>
    <strong>Match trust to repeated evidence.</strong>
  </div>
</section>

{% include read-people-reference.html %}
