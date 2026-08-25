---
layout: page
title: Communication
subtitle: Make the important part easy to receive.
description: How I structure explanations, raise unfinished concerns, listen before solving, handle conflict, negotiate, and close decisions.
permalink: /communication/
layout-class: page communication
extra_css: /css/communication.css
extra_js: /js/components/communication.js
motion_scene: signal
---

<div class="cm-progress" aria-hidden="true"><span id="cm-progress-fill"></span></div>

<nav class="cm-rail" aria-label="Communication learning path">
  <a href="#transfer"><b>01</b><span>Transfer</span></a>
  <a href="#objective"><b>02</b><span>Choose</span></a>
  <a href="#structure"><b>03</b><span>Structure</span></a>
  <a href="#timing"><b>04</b><span>Speak</span></a>
  <a href="#listen"><b>05</b><span>Listen</span></a>
  <a href="#conflict"><b>06</b><span>Repair</span></a>
  <a href="#influence"><b>07</b><span>Influence</span></a>
  <a href="#lead"><b>08</b><span>Lead</span></a>
  <a href="#contexts"><b>09</b><span>Adapt</span></a>
  <a href="#card"><b>10</b><span>Use</span></a>
</nav>

<header class="cm-hero" id="transfer">
  <div class="cm-hero-copy">
    <p class="cm-kicker">A field guide for high-context minds</p>
    <h1>Your listener cannot see your whole map.</h1>
    <p>You may see the history, incentives, contradictions, risks, and long-term effects at once. The other person usually sees only the sentence you give them.</p>
  </div>
  <div class="cm-transfer" aria-label="A dense internal model passing through translation into shared understanding">
    <div class="cm-mind"><span>history</span><span>risk</span><span>incentives</span><span>exceptions</span><span>evidence</span><span>consequences</span><strong>your model</strong></div>
    <div class="cm-channel"><i></i><b>translate</b><small>select · order · simplify</small></div>
    <div class="cm-received"><span></span><span></span><span></span><strong>shared understanding</strong></div>
  </div>
  <blockquote>Start where the other person can enter the problem, then add depth as they need it.</blockquote>
</header>

<figure class="cm-fig" id="fig-transfer">
  <figcaption><span class="n">Figure 1</span><b>Build shared understanding</b><em>Change the message and the channel.</em></figcaption>
  <div class="cm-fig-body">
    <div class="cf-transfer-plot" role="img" aria-label="Forty ideas in your head are compressed into a selected message; only some of that message lands with the listener.">
      <section class="cf-transfer-stage source">
        <header><small>Source</small><b>In your head</b><span>40 connected ideas</span></header>
        <div class="cf-idea-dots" id="cf-mine" aria-hidden="true"></div>
      </section>
      <div class="cf-transfer-arrow" aria-hidden="true"><i></i><span>select</span></div>
      <section class="cf-transfer-stage message">
        <header><small>Message</small><b>What you say</b><span>ordered and compressed</span></header>
        <div class="cf-message-meter"><i id="cf-flow"></i><b id="cf-said">6 ideas</b></div>
      </section>
      <div class="cf-transfer-arrow" aria-hidden="true"><i></i><span>receive</span></div>
      <section class="cf-transfer-stage received">
        <header><small>Result</small><b>What lands</b><span id="cf-landed-label">4 ideas retained</span></header>
        <div class="cf-idea-dots" id="cf-theirs" aria-hidden="true"></div>
      </section>
    </div>
    <label class="cm-fig-ctl">
      <span>How much you say</span>
      <input type="range" id="cf-range" min="1" max="40" value="6" step="1">
    </label>
    <label class="cm-fig-ctl">
      <span>Context you already share</span>
      <input type="range" id="cf-context" min="0" max="100" value="25" step="5">
    </label>
    <button class="cf-check" id="cf-check" type="button" aria-pressed="false">Check what they heard</button>
    <div class="cm-fig-read">
      <div><b id="cf-landed">0</b><span>ideas landed</span></div>
      <div><b id="cf-pct">0%</b><span>of what you said</span></div>
      <div><b id="cf-shared">25%</b><span>shared context</span></div>
      <p id="cf-say" role="status"></p>
    </div>
  </div>
</figure>

<section class="cm-part cm-prose" id="objective">
  <div class="cm-heading"><span>02</span><div><h2>Choose the job before the words</h2><p>A conversation stalls when one person is solving and the other wants to be understood.</p></div></div>

<figure class="cm-fig" id="fig-objective">
  <figcaption><span class="n">Figure 2</span><b>Two people, two jobs</b><em>Pick one on each side.</em></figcaption>
  <div class="cm-fig-body">
    <div class="cf-two">
      <div class="cf-side">
        <span class="cf-who you">You want to</span>
        <div class="cf-opts" id="cf-mine-opts"></div>
      </div>
      <div class="cf-side">
        <span class="cf-who them">They want to</span>
        <div class="cf-opts" id="cf-their-opts"></div>
      </div>
    </div>
    <div class="cf-verdict" id="cf-verdict" role="status"></div>
  </div>
</figure>
  <div class="cm-crossed" aria-label="Two people entering one conversation with different objectives">
    <div><small>Person A</small><b>Solve it</b><i>→</i></div>
    <div class="cm-collision">same words<br><strong>different jobs</strong></div>
    <div><i>←</i><b>Feel understood</b><small>Person B</small></div>
  </div>

  <div class="cm-tool" id="cm-objective-tool">
    <div class="cm-tool-head"><span>Interactive</span><h3>What must this conversation do?</h3><p>Choose one primary objective. The page will give you a starting move.</p></div>
    <div class="cm-objective-grid" role="group" aria-label="Choose a communication objective">
      <button data-objective="inform"><b>Inform</b><small>share knowledge</small></button>
      <button data-objective="understand"><b>Understand</b><small>learn their view</small></button>
      <button data-objective="clarify"><b>Clarify</b><small>name reality</small></button>
      <button data-objective="decide"><b>Decide</b><small>make a choice</small></button>
      <button data-objective="persuade"><b>Persuade</b><small>change belief or action</small></button>
      <button data-objective="negotiate"><b>Negotiate</b><small>reach terms</small></button>
      <button data-objective="coordinate"><b>Coordinate</b><small>set next steps</small></button>
      <button data-objective="support"><b>Support</b><small>help them feel heard</small></button>
      <button data-objective="correct"><b>Correct</b><small>address an error</small></button>
      <button data-objective="protect"><b>Protect</b><small>set a boundary</small></button>
      <button data-objective="repair"><b>Repair</b><small>restore trust</small></button>
      <button data-objective="connect"><b>Connect</b><small>strengthen the relationship</small></button>
    </div>
    <div class="cm-objective-out" id="cm-objective-out" role="status">Choose the job before you choose the script.</div>
  </div>

  <div class="cm-first-question">
    <span>The first question</span>
    <p>What does this person need from me to understand this?</p>
    <small>Start with what they need to receive, not everything you want to say.</small>
  </div>
</section>

<section class="cm-part cm-prose" id="structure">
  <div class="cm-heading"><span>03</span><div><h2>Build a path into the idea</h2><p>Start at the surface. Add depth only when it helps.</p></div></div>

<figure class="cm-fig" id="fig-depth">
  <figcaption><span class="n">Figure 3</span><b>One idea, five depths</b><em>Slide to go deeper.</em></figcaption>
  <div class="cm-fig-body">
    <div class="cf-depth-bars" id="cf-depth-bars" aria-hidden="true"></div>
    <label class="cm-fig-ctl">
      <span>Depth</span>
      <input type="range" id="cf-depth" min="1" max="5" value="1" step="1">
    </label>
    <div class="cf-depth-out">
      <p class="cf-msg" id="cf-depth-msg"></p>
      <p class="cf-for" id="cf-depth-for"></p>
    </div>
  </div>
</figure>

  <div class="cm-ladder-wrap">
    <div class="cm-ladder" id="cm-ladder" aria-label="Five levels of explanation">
      <button data-level="1"><b>1</b><span>Headline</span><small>one sentence</small></button>
      <button data-level="2"><b>2</b><span>Reason</span><small>one or two</small></button>
      <button data-level="3"><b>3</b><span>Evidence</span><small>strongest proof</small></button>
      <button data-level="4"><b>4</b><span>Implication</span><small>what follows</small></button>
      <button data-level="5"><b>5</b><span>Detail</span><small>technical depth</small></button>
    </div>
    <div class="cm-ladder-read" id="cm-ladder-read" role="status">
      <small>Level 1 · Headline</small><p>“I think we should postpone the launch by two weeks.”</p>
    </div>
  </div>

  <div class="cm-rule"><b>Most people need levels 1–3.</b><span>Do not start at level 5 because that is where your mind lives.</span></div>

  <div class="cm-frameworks">
    <article class="cm-framework is-wide">
      <header><span>30 seconds</span><h3>Conclusion → reason → implication</h3></header>
      <p>“I would not do the deal yet. The economics look good, but we do not know why the seller is exiting. I want that answered before we commit.”</p>
      <strong>Then stop. Let them ask for depth.</strong>
    </article>
    <article class="cm-framework">
      <header><span>BLUF</span><h3>For busy decision-makers</h3></header>
      <ol><li>Bottom line</li><li>Two reasons</li><li>Need from you</li></ol>
    </article>
    <article class="cm-framework">
      <header><span>Pyramid</span><h3>For structured explanation</h3></header>
      <div class="cm-pyramid"><b>answer</b><span>reason</span><span>reason</span><span>reason</span><i>evidence under each</i></div>
    </article>
    <article class="cm-framework">
      <header><span>SCQA</span><h3>For a complicated problem</h3></header>
      <ol><li>Situation</li><li>Complication</li><li>Question</li><li>Answer</li></ol>
    </article>
    <article class="cm-framework">
      <header><span>PREP</span><h3>For speaking without notes</h3></header>
      <ol><li>Point</li><li>Reason</li><li>Example</li><li>Point again</li></ol>
    </article>
  </div>

  <div class="cm-compress cm-tool">
    <div class="cm-tool-head"><span>Practice</span><h3>Compress before you explain</h3><p>Paste a long explanation. Find the one sentence that must survive.</p></div>
    <label for="cm-long">Your full thought</label>
    <textarea id="cm-long" rows="5" placeholder="Write the detailed version here…"></textarea>
    <div class="cm-meter"><span><b id="cm-word-count">0</b> words</span><i><em id="cm-meter-fill"></em></i><span id="cm-time">0 sec</span></div>
    <label for="cm-headline">Ten-second headline</label>
    <input id="cm-headline" type="text" maxlength="180" placeholder="My view is…">
    <div class="cm-compress-checks"><span>Can they find your position?</span><span>Can they name why it matters?</span><span>Can they act next?</span></div>
  </div>

  <div class="cm-triad">
    <article><span>Fact</span><p>Revenue declined 12%.</p></article>
    <article><span>Interpretation</span><p>Churn appears to be the main cause.</p></article>
    <article><span>Recommendation</span><p>Fix retention before spending more on acquisition.</p></article>
  </div>
  <p>Separate these layers in sensitive discussions. Someone can disagree with your interpretation without rejecting the fact or the recommendation.</p>

  <div class="cm-confidence">
    <div><span>High</span><b>“I am confident that…”</b></div>
    <div><span>Moderate</span><b>“My current view is…”</b></div>
    <div><span>Low</span><b>“My working hypothesis is…”</b></div>
    <p>Use one qualifier, then say what would change your mind. Do not hedge until your position disappears.</p>
  </div>

  <div class="cm-mini-grid">
    <article><b>Rule of three</b><p>Turn seven reasons into three groups.</p></article>
    <article><b>“So what?”</b><p>Add the consequence after the data.</p></article>
    <article><b>Ask the depth</b><p>“Conclusion, reasoning, or numbers?”</p></article>
    <article><b>Example first</b><p>Example → pattern → principle.</p></article>
    <article><b>Four lengths</b><p>Prepare 10 sec, 30 sec, 2 min, and 10 min.</p></article>
    <article><b>Stop</b><p>End at the first complete answer.</p></article>
  </div>
</section>

<section class="cm-part cm-prose" id="timing">
  <div class="cm-heading"><span>04</span><div><h2>Make the middle visible</h2><p>Silence can look like agreement while your concern grows in private.</p></div></div>

<figure class="cm-fig" id="fig-silence">
  <figcaption><span class="n">Figure 4</span><b>What silence costs</b><em>Drag the days.</em></figcaption>
  <div class="cm-fig-body">
    <svg class="cm-fig-svg" viewBox="0 0 560 190" role="img" aria-label="A small unsaid concern growing over time until it becomes a sudden rejection.">
      <line class="cf-ax" x1="40" y1="150" x2="530" y2="150"/>
      <path class="cf-grow" id="cf-grow"/>
      <line class="cf-thresh" x1="40" y1="52" x2="530" y2="52"/>
      <text class="cf-lab" x="46" y="46">it comes out all at once</text>
      <circle class="cf-head" id="cf-head" cx="40" cy="150" r="7"/>
      <text class="cf-lab" x="40" y="170">day 0</text>
      <text class="cf-lab" x="530" y="170" text-anchor="end">day 30</text>
    </svg>
    <label class="cm-fig-ctl">
      <span>Days you stay quiet</span>
      <input type="range" id="cf-days" min="0" max="30" value="0" step="1">
    </label>
    <div class="cm-fig-read">
      <div><b id="cf-day-n">0</b><span>days</span></div>
      <div><b id="cf-cost">1 min</b><span>to say it now</span></div>
      <p id="cf-silence-say" role="status"></p>
    </div>
  </div>
</figure>
  <div class="cm-timeline" aria-label="A hidden concern becoming a sudden rejection">
    <div class="cm-private"><span>silence</span><span>analysis</span><span>certainty</span><b>sudden rejection</b></div>
    <div class="cm-public"><span>early concern</span><span>test it</span><span>update</span><b>clear decision</b></div>
  </div>
  <blockquote>“I am not ready to give a final view, but I do have a concern.”</blockquote>
  <div class="cm-clarity-gauge">
    <div><span>forming</span><i></i><strong style="--p:75%">Speak here</strong><i></i><span>settled</span></div>
    <p>In a reversible discussion, speak once you can name the concern and how you will test it. Demand much stronger evidence for legal, public, financial, or irreversible claims.</p>
  </div>
  <div class="cm-script-row">
    <article><small>Concern is 20% formed</small><p>“I cannot fully explain it yet, but I am uncomfortable with the dependency we are creating. I will test the concern and come back tomorrow.”</p></article>
    <article><small>You are exploring</small><p>“I am thinking out loud rather than making a recommendation.”</p></article>
    <article><small>You need time</small><p>“I do not want to answer too quickly. I will come back by 3 PM tomorrow.”</p></article>
    <article><small>You do not know</small><p>“I do not know yet. Here is how I will find out, and when I will return.”</p></article>
  </div>
  <div class="cm-silences">
    <article><b>Thinking</b><span>“Give me a moment.”</span></article>
    <article><b>Disagreement</b><span>“I have a concern.”</span></article>
    <article><b>Emotional</b><span>“I need time before we discuss this.”</span></article>
    <article><b>Strategic</b><span>Ask or negotiate, then stop.</span></article>
  </div>
</section>

<section class="cm-part cm-prose" id="listen">
  <div class="cm-heading"><span>05</span><div><h2>Receive before you respond</h2><p>Your fastest solution can still be the wrong response.</p></div></div>

<figure class="cm-fig" id="fig-listen">
  <figcaption><span class="n">Figure 5</span><b>The point comes last</b><em>Drag where you cut in.</em></figcaption>
  <div class="cm-fig-body">
    <div class="cf-track" id="cf-track" aria-hidden="true"></div>
    <label class="cm-fig-ctl">
      <span>Where you interrupt</span>
      <input type="range" id="cf-cut" min="10" max="100" value="35" step="5">
    </label>
    <div class="cm-fig-read">
      <div><b id="cf-heard">0%</b><span>of what they said</span></div>
      <div><b id="cf-point">Missed</b><span>their actual point</span></div>
      <p id="cf-listen-say" role="status"></p>
    </div>
  </div>
</figure>
  <div class="cm-lara">
    <div><b>L</b><span>Listen</span><small>Do not prepare your answer.</small></div>
    <i>→</i><div><b>A</b><span>Acknowledge</span><small>Name why it makes sense.</small></div>
    <i>→</i><div><b>R</b><span>Reflect</span><small>Say back the real issue.</small></div>
    <i>→</i><div><b>A</b><span>Ask</span><small>Find what resolution means.</small></div>
  </div>

  <div class="cm-support-tool cm-tool" id="cm-support-tool">
    <div class="cm-tool-head"><span>One question</span><h3>What kind of help do you want?</h3></div>
    <div class="cm-support-buttons">
      <button data-support="listen"><b>Listen</b><small>Stay with me</small></button>
      <button data-support="think"><b>Think together</b><small>Help me understand</small></button>
      <button data-support="solve"><b>Solve</b><small>Help me act</small></button>
    </div>
    <div id="cm-support-out" class="cm-support-out" role="status">Ask before giving analysis, advice, counterexamples, solutions, or perspective.</div>
  </div>

  <div class="cm-validation">
    <div><span>Validation is</span><b>“I understand why you saw it that way.”</b><small>acknowledging their experience</small></div>
    <div><span>Validation is not</span><b>“Your interpretation is correct.”</b><small>surrendering your judgment</small></div>
  </div>

  <div class="cm-listener-map">
    <article><b>Know</b><p>What do they already understand?</p></article>
    <article><b>Care</b><p>What outcome matters to them?</p></article>
    <article><b>Fear</b><p>What hidden concern are they protecting?</p></article>
    <article><b>Do</b><p>What action can they take?</p></article>
  </div>
  <div class="cm-doors">
    <p><b>CEO</b><span>speed and organisational risk</span></p>
    <p><b>Finance</b><span>exposure and payback</span></p>
    <p><b>Engineering</b><span>reliability and dependencies</span></p>
    <p><b>Employee</b><span>ownership and duplicated work</span></p>
    <p><b>Partner</b><span>trust and reciprocity</span></p>
    <p><b>Customer</b><span>their practical consequence</span></p>
  </div>
  <p>The idea stays the same. The doorway changes. Use concrete language: “Sales gets rewarded for deals operations cannot deliver” is clearer than “We have an incentive-alignment problem.”</p>
</section>

<section class="cm-part cm-prose" id="conflict">
  <div class="cm-heading"><span>06</span><div><h2>Turn conflict into usable information</h2><p>Describe what happened. Do not put the person on trial.</p></div></div>

<figure class="cm-fig" id="fig-conflict">
  <figcaption><span class="n">Figure 6</span><b>Same event, two sentences</b><em>Switch the framing.</em></figcaption>
  <div class="cm-fig-body">
    <div class="cf-toggle" id="cf-frame" role="group" aria-label="Choose a framing">
      <button type="button" data-frame="judge">Put them on trial</button>
      <button type="button" data-frame="observe" class="is-on">Describe what happened</button>
    </div>
    <div class="cf-chain" id="cf-chain"></div>
    <label class="cm-fig-ctl">
      <span>Pressure already in the room</span>
      <input type="range" id="cf-stress" min="0" max="100" value="45" step="5">
    </label>
    <div class="cf-defense"><span>attention available for the issue</span><i><b id="cf-defense-fill"></b></i><strong id="cf-defense-value">0%</strong></div>
    <p class="cf-defense-copy" id="cf-defense-copy" role="status"></p>
  </div>
</figure>
  <div class="cm-before-after">
    <div class="bad"><small>Character verdict</small><p>“You are unreliable.”</p></div>
    <i>→</i>
    <div class="good"><small>Situation · behavior · impact</small><p>“The report arrived two days late without warning, so I had to delay the client review. I need earlier notice.”</p></div>
  </div>

  <div class="cm-conflict-models">
    <article><header><b>SBI</b><span>Feedback</span></header><ol><li>Situation</li><li>Behavior</li><li>Impact</li></ol></article>
    <article><header><b>DESC</b><span>Firm boundary</span></header><ol><li>Describe</li><li>Express</li><li>Specify</li><li>Consequence</li></ol></article>
    <article><header><b>OFNR</b><span>Personal conflict</span></header><ol><li>Observation</li><li>Feeling</li><li>Need</li><li>Request</li></ol></article>
    <article><header><b>Steelman</b><span>Disagreement</span></header><ol><li>Summarise</li><li>Ask “Is that fair?”</li><li>Then challenge</li></ol></article>
  </div>

  <div class="cm-48">
    <div class="cm-48-clock"><b>48</b><span>hours</span></div>
    <div><h3>Never store complaints</h3><p>If it still bothers you after 48 hours, address it.</p><div class="cm-arrow-seq"><span>mention</span><i>→</i><span>observe</span><i>→</i><span>clarify</span><i>→</i><span>decide</span></div></div>
  </div>

  <div class="cm-repair-grid">
    <article><b>Impact before intent</b><p>“That was not my intention, but I understand that was the effect.”</p></article>
    <article><b>Disagree with the mechanism</b><p>“I agree with the objective. I am less convinced by the mechanism.”</p></article>
    <article><b>Ask before accusing</b><p>“What happened?” before “Why did you do that?”</p></article>
    <article><b>Check the transmission</b><p>“What are you hearing me say?”</p></article>
    <article><b>Teach back</b><p>“Can you tell me how you plan to approach it?”</p></article>
    <article><b>Do not defend the reasoning first</b><p>Ask what outcome your approach created.</p></article>
  </div>

  <div class="cm-apology">
    <span>1 · What I did</span><span>2 · The impact</span><span>3 · Responsibility</span><span>4 · The correction</span>
    <p>Do not add “but you also.” That belongs in another conversation. Judge an apology by acknowledgment → repair → changed behavior.</p>
  </div>
</section>

<section class="cm-part cm-prose" id="influence">
  <div class="cm-heading"><span>07</span><div><h2>Influence without unnecessary threat</h2><p>Begin in their world. Move one bridge at a time.</p></div></div>

<figure class="cm-fig" id="fig-influence">
  <figcaption><span class="n">Figure 7</span><b>One bridge at a time</b><em>Drag how far you ask them to move.</em></figcaption>
  <div class="cm-fig-body">
    <svg class="cm-fig-svg" viewBox="0 0 560 150" role="img" aria-label="The distance between where they stand and what you are asking, crossed in one leap or in stages.">
      <line class="cf-ax" x1="40" y1="96" x2="520" y2="96"/>
      <circle class="cf-them" cx="40" cy="96" r="9"/>
      <text class="cf-lab" x="40" y="122" text-anchor="middle">them</text>
      <circle class="cf-ask" id="cf-ask" cx="200" cy="96" r="9"/>
      <text class="cf-lab" id="cf-ask-lab" x="200" y="122" text-anchor="middle">your ask</text>
      <g id="cf-bridges"></g>
    </svg>
    <label class="cm-fig-ctl">
      <span>Distance of the ask</span>
      <input type="range" id="cf-dist" min="1" max="10" value="2" step="1">
    </label>
    <div class="cm-fig-read">
      <div><b id="cf-steps">1</b><span>step needed</span></div>
      <div><b id="cf-odds">High</b><span>chance they move</span></div>
      <p id="cf-inf-say" role="status"></p>
    </div>
  </div>
</figure>

  <div class="cm-persuasion">
    <span>Their objective</span><i>→</i><span>Their obstacle</span><i>→</i><span>Your proposal</span><i>→</i><span>Evidence</span><i>→</i><span>Cost</span><i>→</i><span>Next step</span>
  </div>
  <p>Do not ask someone to accept the whole strategy at once. First ask whether an assumption should be tested. Then agree on how the result will change the decision.</p>

  <div class="cm-disagree-order">
    <article><b>1</b><span>Ask how they arrived there.</span></article>
    <article><b>2</b><span>Find the assumption.</span></article>
    <article><b>3</b><span>Confirm the shared objective.</span></article>
    <article><b>4</b><span>Show contradictory evidence.</span></article>
    <article><b>5</b><span>Offer an alternative.</span></article>
    <article><b>6</b><span>Invite correction.</span></article>
  </div>

  <div class="cm-negotiation">
    <div class="cm-batna"><small>Before the room</small><b>BATNA</b><span>What will I do if we do not agree?</span></div>
    <div class="cm-four-numbers"><span><small>best</small>Ideal</span><span><small>aim</small>Target</span><span><small>floor</small>Minimum</span><span><small>exit</small>Walk-away</span></div>
  </div>
  <blockquote>Say your position. Give one reason. Stop.</blockquote>

  <div class="cm-tradeoffs">
    <article><h3>Position → interest</h3><p>“I need Friday” may mean “I need it before Monday’s board meeting.” Ask what the date allows them to do.</p></article>
    <article><h3>No → options</h3><p>“I can do A by Friday or A+B by Tuesday. Which matters more?”</p></article>
    <article><h3>Capacity</h3><p>“I can take that on if we move X. Which should have priority?”</p></article>
    <article><h3>Pressure</h3><p>“I understand what you are asking. I am not agreeing yet.”</p></article>
  </div>
</section>

<section class="cm-part cm-prose" id="lead">
  <div class="cm-heading"><span>08</span><div><h2>Make work easier to coordinate</h2><p>Authority increases the need for explicit priorities, ownership, standards, and trade-offs.</p></div></div>

<figure class="cm-fig" id="fig-lead">
  <figcaption><span class="n">Figure 8</span><b>Every unsaid thing costs</b><em>Turn each one on.</em></figcaption>
  <div class="cm-fig-body">
    <div class="cf-switches" id="cf-switches" role="group" aria-label="What has been made explicit">
      <button type="button" data-sw="priority">Priority</button>
      <button type="button" data-sw="owner">Owner</button>
      <button type="button" data-sw="standard">Standard</button>
      <button type="button" data-sw="tradeoff">Trade-off</button>
    </div>
    <div class="cf-cost"><i id="cf-cost-fill"></i><span id="cf-cost-lab">4 things left to guess</span></div>
    <p id="cf-lead-say" role="status"></p>
  </div>
</figure>

  <div class="cm-leader-message">
    <article><b>Why</b><span>Why are we doing this?</span></article>
    <article><b>What</b><span>What outcome are we pursuing?</span></article>
    <article><b>What not</b><span>What are we excluding?</span></article>
    <article><b>Who</b><span>Who owns each part?</span></article>
    <article><b>When</b><span>What are the deadlines?</span></article>
    <article><b>Decision</b><span>Who decides if we disagree?</span></article>
    <article><b>Success</b><span>How will we know it worked?</span></article>
  </div>

  <div class="cm-work-grid">
    <article><span>Delegate</span><p><b>Objective · constraints · authority · deadline · quality · check-in</b></p></article>
    <article><span>Feedback</span><p><b>Continue · change · why · next</b></p></article>
    <article><span>Presentation</span><p><b>Question · answer · three reasons · evidence · risk · recommendation · action</b></p></article>
    <article><span>Slide</span><p><b>One slide, one job. Put the conclusion in the title.</b></p></article>
  </div>

  <div class="cm-meeting">
    <div class="cm-meeting-before"><h3>Before</h3><ul><li>Three things they must know</li><li>Three things you must learn</li><li>One decision you want</li><li>One objection you expect</li><li>One sentence you must say</li></ul></div>
    <div class="cm-meeting-room"><h3>During</h3><p>What decision are we making?</p><p>Where exactly do we disagree?</p><p>What information would settle it?</p><p>What is the strongest argument against this?</p></div>
    <div class="cm-meeting-close"><h3>Close</h3><div><b>Decision</b><b>Owner</b><b>Deadline</b><b>Unresolved</b><b>Checkpoint</b></div></div>
  </div>

  <div class="cm-writing">
    <div><span>Subject</span><b>What this is about</b></div><i>→</i>
    <div><span>Conclusion</span><b>What matters</b></div><i>→</i>
    <div><span>Reason</span><b>Why</b></div><i>→</i>
    <div><span>Action</span><b>What happens next</b></div>
  </div>
  <div class="cm-five-update"><b>Five-sentence update</b><span>status</span><i>→</i><span>change</span><i>→</i><span>importance</span><i>→</i><span>next</span><i>→</i><span>ask</span></div>
  <p>Put the request early: “I need approval for X by Thursday. Context below.” Your research process and your presentation order should not be the same.</p>
</section>

<section class="cm-part cm-prose" id="contexts">
  <div class="cm-heading"><span>09</span><div><h2>Change the format, not the truth</h2><p>Different contexts need different amounts of warmth, detail, speed, and structure.</p></div></div>

<figure class="cm-fig" id="fig-context">
  <figcaption><span class="n">Figure 9</span><b>Same truth, four formats</b><em>Pick where you are.</em></figcaption>
  <div class="cm-fig-body">
    <div class="cf-toggle wide" id="cf-ctx" role="group" aria-label="Choose a context">
      <button type="button" data-ctx="work" class="is-on">At work</button>
      <button type="button" data-ctx="close">With someone close</button>
      <button type="button" data-ctx="crisis">In a crisis</button>
      <button type="button" data-ctx="public">In public</button>
    </div>
    <div class="cf-dials" id="cf-dials"></div>
    <p class="cf-msg" id="cf-ctx-msg"></p>
  </div>
</figure>
  <div class="cm-context-tabs" role="tablist" aria-label="Communication contexts">
    <button role="tab" aria-selected="true" data-context="digital">Digital</button>
    <button role="tab" aria-selected="false" data-context="relationship">Relationships</button>
    <button role="tab" aria-selected="false" data-context="network">Networking</button>
    <button role="tab" aria-selected="false" data-context="crisis">Crisis</button>
    <button role="tab" aria-selected="false" data-context="audience">Audience</button>
  </div>
  <div class="cm-context-panel" id="cm-context-panel"></div>

  <div class="cm-situation-grid">
    <article><b>Very angry</b><p>Pause the conclusion, name a return time, and return.</p></article>
    <article><b>Disrespected</b><p>Check intent, incompetence, culture, misunderstanding, and pattern before responding.</p></article>
    <article><b>Manipulated</b><p>Reduce explanation: “No.” “That does not work for me.”</p></article>
    <article><b>Outpaced</b><p>“I want to answer the substance, not the pace. Give me a moment.”</p></article>
    <article><b>Interrupted</b><p>“Let me finish this point, then I want your response.”</p></article>
    <article><b>You interrupt</b><p>“Sorry, I cut you off. Finish your thought.”</p></article>
    <article><b>Technical material</b><p>What · why · how · example · exception. Do not lead with the edge case.</p></article>
    <article><b>Someone’s problem</b><p>Ask “Do you want an idea?” before solving.</p></article>
    <article><b>Care is invisible</b><p>Name it: “I handled this because I wanted to take something off your plate.”</p></article>
    <article><b>Praise</b><p>Name the exact behavior so the person knows what you value.</p></article>
    <article><b>Cross-cultural</b><p>Do not infer agreement, hostility, honesty, confidence, or weakness from style alone.</p></article>
    <article><b>Serious text conflict</b><p>Use text to name the issue and arrange the conversation, not prosecute the case.</p></article>
  </div>
</section>

<section class="cm-part cm-prose" id="card">
  <div class="cm-heading"><span>10</span><div><h2>Your operating card</h2><p>Use this before, during, and after any important conversation.</p></div></div>

  <div class="cm-card">
    <section><header><span>Before</span><b>Prepare the transfer</b></header><ol><li>What outcome do I want?</li><li>What do they probably want?</li><li>What must they understand?</li><li>What must I understand?</li><li>What sentence must I say?</li><li>What is my headline and ask?</li></ol></section>
    <section><header><span>During</span><b>Keep it shared</b></header><ol><li>Listen first.</li><li>State the headline.</li><li>Give no more than three reasons.</li><li>Check what they heard.</li><li>Surface disagreement early.</li><li>Name decision, owner, and next step.</li></ol></section>
    <section><header><span>After</span><b>Close the loop</b></header><ol><li>What did we decide?</li><li>What remains unresolved?</li><li>Who owns what?</li><li>By when?</li><li>Did I say what I meant?</li><li>Did they understand the same thing?</li></ol></section>
  </div>

  <div class="cm-failures">
    <h3>Ten failure modes and counters</h3>
    <div><span>Private processing</span><b>“I have an early concern.”</b></div>
    <div><span>Too much context</span><b>Conclusion first.</b></div>
    <div><span>Hedging away the view</span><b>“My current recommendation is…”</b></div>
    <div><span>Solving an emotion</span><b>“Listen or solve?”</b></div>
    <div><span>Stored conflict</span><b>Address it within 48 hours.</b></div>
    <div><span>Too much responsibility</span><b>“If I take X, what moves?”</b></div>
    <div><span>Irrelevant correction</span><b>Does it change a decision?</b></div>
    <div><span>Assumed implication</span><b>State what follows.</b></div>
    <div><span>Invisible intention</span><b>Say why you acted.</b></div>
    <div><span>Precision without clarity</span><b>Simplify without falsifying.</b></div>
  </div>

  <div class="cm-resets">
    <article><small>Conversation</small><p>“Can we reset? What are we actually trying to decide?”</p></article>
    <article><small>Emotion</small><p>“Can I tell you what I heard, then you tell me what I missed?”</p></article>
    <article><small>Boundary</small><p>“I understand what you are asking. I am not agreeing yet.”</p></article>
    <article><small>Negotiation</small><p>“Before I answer, I need to understand the trade-off.”</p></article>
    <article><small>Leadership</small><p>“Let me restate the priority, owner, and deadline.”</p></article>
    <article><small>Relationship</small><p>“There is something small I want to say before it becomes big.”</p></article>
    <article><small>Recommendation</small><p>“I recommend X because A and B. The risk is C. I would change my mind if D.”</p></article>
    <article><small>Support</small><p>“Do you want me to listen, help you think, or help you solve it?”</p></article>
  </div>

  <div class="cm-final-model">
    <p>the part that matters</p><i>+</i><p>the right order</p><i>+</i><p>the right depth</p><i>+</i><p>the implication</p><i>+</i><p>room to respond</p>
    <strong>shared understanding sufficient for the next right action</strong>
  </div>
  <blockquote class="cm-final-quote">Before you speak, decide what must land. Say it early, give the reason, and leave room for a response.</blockquote>
</section>

{% include communication-icons.html %}
{% include communication-manual.html %}
