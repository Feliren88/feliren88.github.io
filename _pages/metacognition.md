---
layout: page
title: Metacognition
subtitle: A field guide for thinking alongside AI
description: How to notice what you actually understand when AI answers fast. Score your confidence, weigh the machine's, add friction where bias enters, and decide what to hand over.
permalink: /metacognition/
date: 2026-10-02
last_modified_at: 2026-10-02
layout-class: page metacognition
extra_css: /css/metacognition.css
extra_js: /js/components/metacognition.js
motion_scene: metacognition
hide_title: true
---

<div class="mc-progress" aria-hidden="true"><span id="mc-progress-fill"></span></div>

<nav class="mc-rail" aria-label="Metacognition field guide">
  <a href="#layers">Layers</a><a href="#illusion">Illusion</a><a href="#calibrate">Calibrate</a><a href="#arbitrate">Arbitrate</a><a href="#friction">Friction</a><a href="#offload">Offload</a><a href="#practice">Practice</a><a href="#sources">Sources</a>
</nav>

<header class="mc-hero" aria-labelledby="mc-title">
  <div class="mc-hero-copy">
    <h1 id="mc-title">The answer arrived in seconds. <i>Did my understanding?</i></h1>
    <p>Metacognition is thinking about my own thinking. I use it to tell knowing from recognising, and to decide when to act, check, or ask.</p>
    <p class="mc-hero-tie">My research asks when a model should say it does not know. This guide asks the same question of me.</p>
  </div>
  <figure class="mc-loop">
    <svg viewBox="0 0 520 440" role="img" aria-labelledby="mc-loop-title">
      <title id="mc-loop-title">Two levels of thinking. Below, a task becomes an answer while an AI draft feeds answers in. Above, a monitor reads how sure I am and a controller decides whether to act, check, or ask.</title>
      <rect class="mc-band mc-band-meta" x="10" y="14" width="500" height="136" rx="18"/>
      <text class="mc-band-label" x="30" y="40">Meta level</text>
      <rect class="mc-band" x="10" y="270" width="500" height="156" rx="18"/>
      <text class="mc-band-label" x="30" y="296">Object level</text>
      <path class="mc-gauge" d="M88 118a52 52 0 0 1 104 0"/>
      <path class="mc-gauge-fill" d="M88 118a52 52 0 0 1 104 0"/>
      <text class="mc-node-text" x="140" y="140">How sure am I?</text>
      <g class="mc-chip mc-chip-act"><rect x="282" y="62" width="64" height="32" rx="16"/><text x="314" y="83">act</text></g>
      <g class="mc-chip mc-chip-check"><rect x="354" y="62" width="70" height="32" rx="16"/><text x="389" y="83">check</text></g>
      <g class="mc-chip mc-chip-ask"><rect x="432" y="62" width="62" height="32" rx="16"/><text x="463" y="83">ask</text></g>
      <text class="mc-node-text" x="388" y="124">What do I do next?</text>
      <path class="mc-arrow" d="M240 330C220 250 150 220 142 156M134 168l8-12 8 12"/>
      <text class="mc-arrow-label" x="200" y="240">monitor</text>
      <path class="mc-arrow" d="M388 150C388 230 300 260 272 328M262 318l10 12 12-8"/>
      <text class="mc-arrow-label" x="352" y="252">control</text>
      <rect class="mc-ai" x="402" y="180" width="96" height="44" rx="12"/>
      <text class="mc-node-text" x="450" y="207">AI draft</text>
      <path class="mc-ai-feed" d="M446 224L424 330"/>
      <path class="mc-flow" d="M106 360H225M285 360H386"/>
      <circle class="mc-node" cx="80" cy="360" r="26"/><text class="mc-node-text" x="80" y="404">task</text>
      <circle class="mc-node" cx="255" cy="360" r="30"/><text class="mc-node-text" x="255" y="408">thinking</text>
      <circle class="mc-node" cx="414" cy="360" r="28"/><text class="mc-node-text" x="414" y="406">answer</text>
      <circle class="mc-pulse" cx="106" cy="360" r="6"><animateMotion dur="5s" repeatCount="indefinite" path="M0 0H280"/></circle>
    </svg>
    <figcaption>Monitoring reads the work below. Control changes what happens next.</figcaption>
  </figure>
  <a class="mc-scroll" href="#layers">Start with the two layers <span aria-hidden="true">↓</span></a>
</header>

<section class="mc-part" id="layers" aria-labelledby="mc-layers-title">
  <header class="mc-head"><h2 id="mc-layers-title">Metacognition has two parts</h2><p>Knowledge is what I know about how I think. Regulation is what I do with that knowledge while I work.</p></header>
  <div class="mc-split">
    <article class="mc-card"><h3>Knowledge</h3><p>What I know, which strategies I have, and when each one fits.</p><small>I remember a formula better after deriving it once.</small></article>
    <article class="mc-card"><h3>Regulation</h3><p>Planning, monitoring, and checking my own work while it happens.</p><small>I have read this twice. Can I say it without looking?</small></article>
  </div>
  <div class="mc-phases" role="group" aria-label="Phase of a task">
    <button type="button" data-phase="before" aria-pressed="true">Before</button><button type="button" data-phase="during" aria-pressed="false">During</button><button type="button" data-phase="after" aria-pressed="false">After</button>
  </div>
  <div class="mc-phase-track" aria-hidden="true"><i></i></div>
  <div class="mc-phase-read" id="mc-phase-read" aria-live="polite"></div>
  <h3 class="mc-subhead">Working with AI makes this harder</h3>
  <div class="mc-stakes">
    <article><h3>My shortcuts misread it</h3><p>Habits built on people mispredict how an AI behaves.</p></article>
    <article><h3>It struggles with new problems</h3><p>Novel, badly defined problems are where it is weakest and I most need to check.</p></article>
    <article><h3>It gives no natural feedback</h3><p>A colleague frowns when I am wrong. An assistant keeps going.</p></article>
    <article><h3>It cannot do this part for me</h3><p>The monitoring has to happen in my own head.</p></article>
  </div>
  <p class="mc-cite">The 4 difficulties come from CSIRO’s research on skills for collaborative intelligence. The two parts follow the edtechdev AIED wiki.</p>
</section>

<section class="mc-part" id="illusion" aria-labelledby="mc-illusion-title">
  <header class="mc-head"><h2 id="mc-illusion-title">Fluent text feels like understanding</h2><p>Smooth reading gives me a feeling of knowing. An AI writes smoothly whether or not I have understood anything.</p></header>
  <figure class="mc-figure">
    <figcaption><b>Could they quote the essay they had just written?</b><span>Each dot is one writer. A filled dot could not quote their own essay.</span></figcaption>
    <div class="mc-people" id="mc-people">
      <div class="mc-people-row" data-miss="15"><span>With an LLM</span><div class="mc-dots" role="img" aria-label="15 of 18 writers who used an LLM could not quote their own essay"></div><b>15 of 18</b></div>
      <div class="mc-people-row" data-miss="2"><span>With a search engine</span><div class="mc-dots" role="img" aria-label="2 of 18 writers who used a search engine could not quote their own essay"></div><b>2 of 18</b></div>
      <div class="mc-people-row" data-miss="2"><span>Brain only</span><div class="mc-dots" role="img" aria-label="2 of 18 writers who used no tool could not quote their own essay"></div><b>2 of 18</b></div>
    </div>
    <p class="mc-cite">Kosmyna et al. (2025), first session. This is a preprint and has not been peer reviewed.</p>
  </figure>

  <div class="mc-check mc-panel" id="mc-check">
    <div class="mc-check-step" data-step="read">
      <h3>Try it on yourself</h3>
      <p class="mc-check-text">Sunlight contains every visible colour. Air molecules scatter short wavelengths far more than long ones. Blue light gets spread across the whole sky. Violet scatters even more than blue. We see blue anyway, because sunlight carries less violet and our eyes favour blue.</p>
      <label class="mc-range" for="mc-feel">How well could you explain this to a friend? <output id="mc-feel-out">50%</output><input id="mc-feel" type="range" min="0" max="100" step="5" value="50"></label>
      <button class="mc-button" type="button" id="mc-hide">Hide the paragraph and test me</button>
    </div>
    <div class="mc-check-step" data-step="quiz" hidden>
      <h3>From the paragraph, why do air molecules scatter blue light more than red?</h3>
      <div class="mc-options" role="group" aria-label="Answer options">
        <button type="button" data-correct="false" aria-pressed="false">Blue light carries more energy, so it bounces off molecules harder.</button>
        <button type="button" data-correct="true" aria-pressed="false">It does not say. It states that they do, without the reason.</button>
        <button type="button" data-correct="false" aria-pressed="false">Red light is absorbed by the air before it can scatter.</button>
      </div>
    </div>
    <p class="mc-read" id="mc-check-read" aria-live="polite"></p>
  </div>
  <p class="mc-prose">Reflective thought starts with being puzzled and needs time with judgement suspended. An instant, confident answer can skip both steps (Singh et al., 2025).</p>
</section>

<section class="mc-part" id="calibrate" aria-labelledby="mc-cal-title">
  <header class="mc-head"><h2 id="mc-cal-title">Confidence is a prediction I can score</h2><p>“I’m 80% sure” is a claim about my own accuracy. In 2 experiments, 5 rounds of prediction with feedback were enough to improve it.</p></header>
  <div class="mc-cal">
    <div class="mc-panel">
      <p class="mc-cal-count" id="mc-cal-count">Claim 1 of 5</p>
      <p class="mc-cal-claim" id="mc-cal-claim">Sunlight takes about 8 minutes to reach Earth.</p>
      <div class="mc-cal-answer" role="group" aria-label="Your answer"><button type="button" data-answer="true" aria-pressed="false">True</button><button type="button" data-answer="false" aria-pressed="false">False</button></div>
      <label class="mc-range" for="mc-cal-conf">How sure are you? <output id="mc-cal-conf-out">70%</output><input id="mc-cal-conf" type="range" min="50" max="100" step="5" value="70"></label>
      <button class="mc-button" type="button" id="mc-cal-submit" disabled>Lock in my answer</button>
      <p class="mc-read" id="mc-cal-feedback" aria-live="polite"></p>
    </div>
    <figure class="mc-panel mc-cal-chart">
      <svg id="mc-cal-svg" viewBox="0 0 320 240" role="img" aria-label="Your confidence on each claim against your hit rate"></svg>
      <figcaption id="mc-cal-summary" aria-live="polite">Your average confidence and hit rate appear here after each claim.</figcaption>
    </figure>
  </div>
  <p class="mc-cite">Ngai and Gilbert (2026) found that 5 practice rounds pairing a prediction with feedback improved calibration. Predictions without feedback did not.</p>
</section>

<section class="mc-part" id="arbitrate" aria-labelledby="mc-arb-title">
  <header class="mc-head"><h2 id="mc-arb-title">I weigh my confidence against the machine’s</h2><p>A confident tone raises trust even when the answer is wrong. So I need to know whether its confidence tracks its accuracy.</p></header>
  <div class="mc-panel">
    <div class="mc-arb-controls">
      <div class="mc-toggle" role="group" aria-label="Which assistant"><button type="button" data-ai="tracks" aria-pressed="true">Confidence tracks accuracy</button><button type="button" data-ai="flat" aria-pressed="false">Always says 95%</button></div>
      <label class="mc-range" for="mc-arb-th">Accept its answer when it says at least <output id="mc-arb-th-out">80%</output><input id="mc-arb-th" type="range" min="50" max="100" step="5" value="80"></label>
    </div>
    <div class="mc-arb-grid" id="mc-arb-grid" role="img" aria-label="20 answers"></div>
    <p class="mc-legend">✓ right · ✗ wrong · filled means I accepted it · dashed means I checked it myself</p>
    <dl class="mc-arb-stats"><div><dt>Wrong answers accepted</dt><dd id="mc-arb-wrong">1</dd></div><div><dt>Answers I checked</dt><dd id="mc-arb-checked">6</dd></div><div><dt>Right answers accepted</dt><dd id="mc-arb-right">13</dd></div></dl>
    <p class="mc-read" id="mc-arb-read" aria-live="polite"></p>
    <p class="mc-note">Illustrative data: 20 answers, 14 of them right, from 2 made-up assistants with the same accuracy.</p>
  </div>
  <figure class="mc-figure mc-bars">
    <figcaption><b>How often students accepted wrong ChatGPT advice</b><span>342 undergraduates on reasoning and evaluation tasks.</span></figcaption>
    <div class="mc-bar" style="--v:62.4"><span>Open ChatGPT support</span><i></i><b>62.4%</b></div>
    <div class="mc-bar" style="--v:39.7"><span>Same support with a brief reflection prompt</span><i></i><b>39.7%</b></div>
    <p class="mc-cite">Ren (2026). Reflection made students more selective, and they kept taking the advice that was right.</p>
  </figure>
  <p class="mc-prose">Lee et al. surveyed 319 knowledge workers (CHI 2025). Those more confident in generative AI reported less critical thinking. Doyeon Lee and colleagues argue in PNAS Nexus that assistants should report more than confidence. They should say how well that confidence has tracked accuracy before. Pairs who share their confidence can decide better than either person alone (Bahrami et al., Science 2010).</p>
</section>

<section class="mc-part" id="friction" aria-labelledby="mc-fr-title">
  <header class="mc-head"><h2 id="mc-fr-title">Put the pause where bias gets in</h2><p>Bias enters twice: in how I ask, and in how I accept the answer. A small, deliberate pause at each point gives my judgement time to arrive.</p></header>
  <ol class="mc-pipe" aria-label="Two pauses between a question and a decision">
    <li class="mc-pipe-node">I frame a question</li>
    <li class="mc-gate"><b>Pause 1</b><small>Is my prompt leading?</small></li>
    <li class="mc-pipe-node">The AI answers</li>
    <li class="mc-gate"><b>Pause 2</b><small>What would make this wrong?</small></li>
    <li class="mc-pipe-node">I decide</li>
  </ol>
  <h3 class="mc-subhead">Turn a leading prompt into a fair one</h3>
  <p class="mc-note">Press a prompt to rewrite it.</p>
  <div class="mc-prompts" id="mc-prompts">
    <button type="button" aria-pressed="false"><span><small>Leading</small>Explain why remote work boosts productivity.</span><span><small>Fair</small>What does the evidence say about remote work and productivity, for and against?</span></button>
    <button type="button" aria-pressed="false"><span><small>Leading</small>Write a summary that proves my design is the best option.</span><span><small>Fair</small>Compare my design with 2 alternatives. Where does mine lose?</span></button>
    <button type="button" aria-pressed="false"><span><small>Leading</small>Confirm that this bug comes from the cache.</span><span><small>Fair</small>List 3 plausible causes of this bug and a test that separates them.</span></button>
  </div>
  <h3 class="mc-subhead">Answer first, then ask</h3>
  <ol class="mc-order">
    <li><b>Think</b><small>Work the problem alone first.</small></li>
    <li><b>Answer</b><small>Write down my answer and how sure I am.</small></li>
    <li><b>Ask</b><small>Ask pointed questions without revealing my answer.</small></li>
    <li><b>Critique</b><small>Give it my answer and ask where it fails.</small></li>
  </ol>
  <p class="mc-cite">The two pauses follow Lim’s DeBiasMe work (2025). The answer-first order is Michael Gerlich’s advice in the APA Monitor. It stops an early AI answer from anchoring my own.</p>
</section>

<section class="mc-part" id="offload" aria-labelledby="mc-off-title">
  <header class="mc-head"><h2 id="mc-off-title">Decide what to hand over</h2><p>Some tasks only need doing. Others are how I build a skill. Handing those over can cost me the skill before I notice.</p></header>
  <p class="mc-note">Choose for each task. My own choice appears beside yours.</p>
  <div class="mc-sort" id="mc-sort"></div>
  <figure class="mc-figure mc-decay">
    <figcaption><b>Detection rate on colonoscopies done without AI</b><span>Endoscopists in Poland, before and after AI arrived in their clinics.</span></figcaption>
    <div class="mc-decay-bars">
      <div style="--v:28.4"><b>28.4%</b><i></i><span>Before</span></div>
      <div class="mc-decay-after" style="--v:22.4"><b>22.4%</b><i></i><span>3 months after</span></div>
    </div>
    <p class="mc-cite">Budzyń et al. (2025), reported in the APA Monitor. The rate measures the same skill the AI had been helping with.</p>
  </figure>
  <p class="mc-prose">Sun et al. ran a field experiment with 250 employees (Journal of Applied Psychology, 2025). ChatGPT access raised rated creativity most for those strong in metacognition. Mutlu Cukurova suggests the same sort for each person’s tasks. Some only need completing, and some build essential learning.</p>
</section>

<section class="mc-part" id="practice" aria-labelledby="mc-pr-title">
  <header class="mc-head"><h2 id="mc-pr-title">A 5-minute loop around each AI task</h2><p>Attention can be trained. Clear goals, quick feedback, and a task just beyond my current skill keep the practice honest.</p></header>
  <div class="mc-rhythm">
    <article><span>Before · 1 minute</span><h3>Predict</h3><p>Write my answer or plan, and a number for how sure I am.</p></article>
    <article><span>During · 2 minutes</span><h3>Check</h3><p>Explain one step back without looking. Trace one claim to its source.</p></article>
    <article><span>After · 2 minutes</span><h3>Score</h3><p>Compare my prediction with the result. Note one place my confidence was off.</p></article>
  </div>
  <div class="mc-lead">
    <h3>When I lead a team</h3>
    <ul>
      <li><b>Direct attention with purpose.</b> Say why we use AI on this task and which skills we want to keep.</li>
      <li><b>Model conscious use.</b> Show my own answer-first habit, including the times the AI was right and I was wrong.</li>
      <li><b>Make room for reflection.</b> Ask what people noticed about their own thinking. Keep “I don’t know” safe to say.</li>
    </ul>
    <p class="mc-cite">The 3 moves come from Hyper Island. The practice conditions follow A Human Edge’s account of flow.</p>
  </div>
  <p class="mc-rule">My rule: Before I ask, I write my answer and a number for how sure I am. Afterwards I check one claim and score the guess.</p>
</section>

<section class="mc-part mc-sources" id="sources" aria-labelledby="mc-src-title">
  <header class="mc-head"><h2 id="mc-src-title">Sources</h2></header>
  <h3>Guides and articles</h3>
  <ol>
    <li>Hyper Island (2026). <a href="https://hyperisland.com/en/blog/emerging-tech-transformation/metacognition-the-essential-ai-leadership-skill-for-2026">Metacognition: the essential AI leadership skill for 2026</a>.</li>
    <li>CSIRO Collaborative Intelligence (IEEE CAI 2024). <a href="https://research.csiro.au/cintel/projects/projects/skills-for-collaborative-intelligence/the-importance-of-metacognitive-thinking-in-an-artificial-intelligence-ai-enabled-workforce/">The importance of metacognitive thinking in an AI-enabled workforce</a>.</li>
    <li>Singh, Taneja, Guan and Ghosh (CHI 2025 Tools for Thought workshop). <a href="https://arxiv.org/abs/2502.12447">Protecting human cognition in the age of AI</a>.</li>
    <li>A Human Edge. <a href="https://www.ahumanedge.com/post/human-capability-ai-era">Human capability in the AI era</a>.</li>
    <li>Mason, Sidra, Reeson and Paris (2023). <a href="https://www.timeshighereducation.com/campus/collaborating-artificial-intelligence-use-your-metacognitive-skills">Collaborating with artificial intelligence? Use your metacognitive skills</a>. Times Higher Education.</li>
    <li>Lee, Pruitt, Zhou, Du and Odegaard (PNAS Nexus 2025). <a href="https://academic.oup.com/pnasnexus/article/4/5/pgaf133/8118889">Metacognitive sensitivity: the key to calibrating trust and optimal decision making with AI</a>.</li>
    <li>Abrams (2026). <a href="https://www.apa.org/monitor/2026/07-08/ai-job-skills-thinking">How AI is reshaping human skills and thinking</a>. Monitor on Psychology 57(5).</li>
    <li>Lim (AIREASONING-2025 workshop). <a href="https://arxiv.org/abs/2504.16770">DeBiasMe: de-biasing human-AI interactions with metacognitive AIED interventions</a>.</li>
    <li>edtechdev AIED wiki. <a href="https://edtechdev.github.io/aied/concepts/metacognition/">Metacognition</a>.</li>
  </ol>
  <h3>Studies behind the numbers</h3>
  <ol>
    <li>Kosmyna et al. (2025). <a href="https://arxiv.org/abs/2506.08872">Your brain on ChatGPT: accumulation of cognitive debt when using an AI assistant for essay writing task</a>. Preprint.</li>
    <li>Ngai and Gilbert (Cognitive Research: Principles and Implications 2026). <a href="https://doi.org/10.1186/s41235-026-00714-0">Metacognitive training facilitates optimal cognitive offloading</a>.</li>
    <li>Ren (Frontiers in Psychology 2026). <a href="https://doi.org/10.3389/fpsyg.2026.1926110">College students’ metacognitive awareness of generative-AI reliance</a>.</li>
    <li>Budzyń et al. (Lancet Gastroenterology &amp; Hepatology 2025). <a href="https://doi.org/10.1016/S2468-1253(25)00133-5">Endoscopist deskilling risk after exposure to artificial intelligence in colonoscopy: a multicentre, observational study</a>.</li>
    <li>Sun, Li, Foo, Zhou and Lu (Journal of Applied Psychology 2025). <a href="https://doi.org/10.1037/apl0001296">How and for whom using generative AI affects creativity: a field experiment</a>.</li>
    <li>Lee et al. (CHI 2025). <a href="https://doi.org/10.1145/3706598.3713778">The impact of generative AI on critical thinking</a>.</li>
    <li>Bahrami et al. (Science 2010). <a href="https://doi.org/10.1126/science.1185718">Optimally interacting minds</a>.</li>
  </ol>
</section>
