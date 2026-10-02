---
layout: page
title: Metacognition
subtitle: How I check my thinking when I use AI
description: How I check what I understand when I use AI. Try exercises on confidence, checking answers, asking fair questions, and choosing which tasks to do myself.
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
  <a href="#layers">Thinking</a><a href="#illusion">Understanding</a><a href="#calibrate">Confidence</a><a href="#arbitrate">Trust</a><a href="#friction">Pause</a><a href="#offload">Tasks</a><a href="#practice">Practice</a><a href="#sources">Sources</a>
</nav>

<header class="mc-hero" aria-labelledby="mc-title">
  <div class="mc-hero-copy">
    <h1 id="mc-title">AI answered in seconds. <i>What did I understand?</i></h1>
    <p>Metacognition means noticing how I think and using that knowledge to guide my next step. For example, can I explain an AI answer in my own words?</p>
    <p class="mc-hero-tie">My research asks when an AI model should say it does not know. Here, I ask the same question of myself.</p>
  </div>
  <figure class="mc-loop">
    <svg viewBox="0 0 520 440" role="img" aria-labelledby="mc-loop-title">
      <title id="mc-loop-title">Below, I work on a task with help from an AI draft. Above, I check my confidence and choose whether to act, check, or ask.</title>
      <rect class="mc-band mc-band-meta" x="10" y="14" width="500" height="136" rx="18"/>
      <text class="mc-band-label" x="30" y="40">Checking my thinking</text>
      <rect class="mc-band" x="10" y="270" width="500" height="156" rx="18"/>
      <text class="mc-band-label" x="30" y="296">Doing the task</text>
      <path class="mc-gauge" d="M88 118a52 52 0 0 1 104 0"/>
      <path class="mc-gauge-fill" d="M88 118a52 52 0 0 1 104 0"/>
      <text class="mc-node-text" x="140" y="140">How sure am I?</text>
      <g class="mc-chip mc-chip-act"><rect x="282" y="62" width="64" height="32" rx="16"/><text x="314" y="83">Act</text></g>
      <g class="mc-chip mc-chip-check"><rect x="354" y="62" width="70" height="32" rx="16"/><text x="389" y="83">Check</text></g>
      <g class="mc-chip mc-chip-ask"><rect x="432" y="62" width="62" height="32" rx="16"/><text x="463" y="83">Ask</text></g>
      <text class="mc-node-text" x="388" y="124">What do I do next?</text>
      <path class="mc-arrow" d="M240 330C220 250 150 220 142 156M134 168l8-12 8 12"/>
      <text class="mc-arrow-label" x="200" y="240">Notice</text>
      <path class="mc-arrow" d="M388 150C388 230 300 260 272 328M262 318l10 12 12-8"/>
      <text class="mc-arrow-label" x="352" y="252">Choose</text>
      <rect class="mc-ai" x="402" y="180" width="96" height="44" rx="12"/>
      <text class="mc-node-text" x="450" y="207">AI draft</text>
      <path class="mc-ai-feed" d="M446 224L424 330"/>
      <path class="mc-flow" d="M106 360H225M285 360H386"/>
      <circle class="mc-node" cx="80" cy="360" r="26"/><text class="mc-node-text" x="80" y="404">Task</text>
      <circle class="mc-node" cx="255" cy="360" r="30"/><text class="mc-node-text" x="255" y="408">Thinking</text>
      <circle class="mc-node" cx="414" cy="360" r="28"/><text class="mc-node-text" x="414" y="406">Answer</text>
      <circle class="mc-pulse" cx="106" cy="360" r="6"><animateMotion dur="5s" repeatCount="indefinite" path="M0 0H280"/></circle>
    </svg>
    <figcaption>I notice how the work is going. Then I choose what to do next.</figcaption>
  </figure>
  <a class="mc-scroll" href="#layers">Start with how I check my thinking <span aria-hidden="true">↓</span></a>
</header>

<section class="mc-part" id="layers" aria-labelledby="mc-layers-title">
  <header class="mc-head"><h2 id="mc-layers-title">Know how I think, then guide my work</h2><p>First, I learn which ways of thinking help me. Then I use that knowledge to plan, check, and improve my work.</p></header>
  <div class="mc-split">
    <article class="mc-card"><h3>Know what helps me learn</h3><p>I know what I understand, which ways of learning help, and when to use each one.</p><small>For example, I remember a formula better after working out why it works.</small></article>
    <article class="mc-card"><h3>Guide my work</h3><p>I make a plan, check my progress, and change my approach when needed.</p><small>After reading twice, I check whether I can explain it without looking.</small></article>
  </div>
  <div class="mc-phases" role="group" aria-label="Phase of a task">
    <button type="button" data-phase="before" aria-pressed="true">Before</button><button type="button" data-phase="during" aria-pressed="false">During</button><button type="button" data-phase="after" aria-pressed="false">After</button>
  </div>
  <div class="mc-phase-track" aria-hidden="true"><i></i></div>
  <div class="mc-phase-read" id="mc-phase-read" aria-live="polite"></div>
  <h3 class="mc-subhead">Working with AI makes this harder</h3>
  <div class="mc-stakes">
    <article><h3>I expect it to act like a person</h3><p>I may judge AI by habits I learnt from people. However, AI can behave differently.</p></article>
    <article><h3>New problems need more checking</h3><p>AI can struggle when a problem is unfamiliar or unclear. So I check its answer carefully.</p></article>
    <article><h3>It may miss signs of confusion</h3><p>A colleague may notice my confusion. However, an AI assistant may keep answering without noticing.</p></article>
    <article><h3>I must check my own understanding</h3><p>AI can ask me questions, but I must judge what I understand.</p></article>
  </div>
  <p class="mc-cite">CSIRO describes these 4 difficulties in research on people working with AI. The edtechdev wiki explains knowing how I think and guiding my work.</p>
</section>

<section class="mc-part" id="illusion" aria-labelledby="mc-illusion-title">
  <header class="mc-head"><h2 id="mc-illusion-title">An easy read can hide gaps in understanding</h2><p>When an answer reads easily, I can feel that I understand it. However, AI can write clearly while I still struggle to explain its answer.</p></header>
  <figure class="mc-figure">
    <figcaption><b>Could they quote the essay they had just written?</b><span>Each dot is one writer. A filled dot could not quote their own essay.</span></figcaption>
    <div class="mc-people" id="mc-people">
      <div class="mc-people-row" data-miss="15"><span>With an AI writing assistant</span><div class="mc-dots" role="img" aria-label="15 of 18 writers who used an AI writing assistant could not quote their own essay"></div><b>15 of 18</b></div>
      <div class="mc-people-row" data-miss="2"><span>With a search engine</span><div class="mc-dots" role="img" aria-label="2 of 18 writers who used a search engine could not quote their own essay"></div><b>2 of 18</b></div>
      <div class="mc-people-row" data-miss="2"><span>Without a tool</span><div class="mc-dots" role="img" aria-label="2 of 18 writers who used no tool could not quote their own essay"></div><b>2 of 18</b></div>
    </div>
    <p class="mc-cite">Kosmyna et al. (2025), first session. This early research report has not yet been checked through peer review by other researchers.</p>
  </figure>

  <div class="mc-check mc-panel" id="mc-check">
    <div class="mc-check-step" data-step="read">
      <h3>Try it on yourself</h3>
      <p class="mc-check-text">Sunlight contains every visible colour. Light travels in waves, and blue light has shorter waves than red light. Tiny particles in air spread shorter waves more strongly, so blue light spreads across the sky. Violet light spreads even more. However, sunlight contains less violet, and our eyes are more sensitive to blue.</p>
      <label class="mc-range" for="mc-feel">How well could you explain this to a friend? <output id="mc-feel-out">50%</output><input id="mc-feel" type="range" min="0" max="100" step="5" value="50"></label>
      <button class="mc-button" type="button" id="mc-hide">Hide the paragraph and test me</button>
    </div>
    <div class="mc-check-step" data-step="quiz" hidden>
      <h3>Does the paragraph explain why air spreads shorter light waves more strongly?</h3>
      <div class="mc-options" role="group" aria-label="Answer options">
        <button type="button" data-correct="false" aria-pressed="false">Yes. It says blue light has more energy and bounces off air particles harder.</button>
        <button type="button" data-correct="true" aria-pressed="false">No. It says shorter waves spread more, but does not explain why.</button>
        <button type="button" data-correct="false" aria-pressed="false">Yes. It says air absorbs red light before that light can spread.</button>
      </div>
    </div>
    <p class="mc-read" id="mc-check-read" aria-live="polite"></p>
  </div>
  <p class="mc-prose">Singh et al. (2025) describe reflection as noticing a question and taking time before deciding. Therefore, an instant AI answer can leave me less time to think through the question.</p>
</section>

<section class="mc-part" id="calibrate" aria-labelledby="mc-cal-title">
  <header class="mc-head"><h2 id="mc-cal-title">Check how often my confident answers are right</h2><p>If I often say “80% sure”, about 8 in 10 of those answers should be right. This match between confidence and results is called calibration. Ngai and Gilbert improved it through 5 practice rounds with feedback in 2 experiments.</p></header>
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
      <svg id="mc-cal-svg" viewBox="0 0 320 240" role="img" aria-label="How sure you were on each claim, compared with the percentage you answered correctly"></svg>
      <figcaption id="mc-cal-summary" aria-live="polite">Your average confidence and percentage of correct answers appear here after each claim.</figcaption>
      <p class="mc-note">Each dot shows how sure you were. Filled dots mark correct answers; outlined dots mark wrong answers.</p>
    </figure>
  </div>
  <p class="mc-cite">Ngai and Gilbert (2026) found that predictions with feedback helped confidence match results. However, predictions without feedback did not help. This short quiz lets you try that habit.</p>
</section>

<section class="mc-part" id="arbitrate" aria-labelledby="mc-arb-title">
  <header class="mc-head"><h2 id="mc-arb-title">Check whether the AI’s confidence deserves my trust</h2><p>I can trust a confident answer too easily, even when it is wrong. Therefore, I check whether the AI’s more confident answers are more often right.</p></header>
  <div class="mc-panel">
    <div class="mc-arb-controls">
      <div class="mc-toggle" role="group" aria-label="Which assistant"><button type="button" data-ai="tracks" aria-pressed="true">More confident answers are usually right</button><button type="button" data-ai="flat" aria-pressed="false">Always says 95%</button></div>
      <label class="mc-range" for="mc-arb-th">Trust its answer without checking when its confidence is at least <output id="mc-arb-th-out">80%</output><input id="mc-arb-th" type="range" min="50" max="100" step="5" value="80"></label>
    </div>
    <div class="mc-arb-grid" id="mc-arb-grid" role="img" aria-label="20 answers"></div>
    <p class="mc-legend">✓ Right · ✗ Wrong. Filled boxes mean I trusted the answer. Dashed boxes mean I checked it.</p>
    <dl class="mc-arb-stats"><div><dt>Wrong answers accepted</dt><dd id="mc-arb-wrong">1</dd></div><div><dt>Answers I checked</dt><dd id="mc-arb-checked">6</dd></div><div><dt>Right answers accepted</dt><dd id="mc-arb-right">13</dd></div></dl>
    <p class="mc-read" id="mc-arb-read" aria-live="polite"></p>
    <p class="mc-note">These are made-up examples. Each assistant gets 14 of 20 answers right. Try both assistants, then move the slider to see which answers I check.</p>
  </div>
  <figure class="mc-figure mc-bars">
    <figcaption><b>How often students accepted wrong ChatGPT advice</b><span>342 university students answered questions that tested reasoning and judgement.</span></figcaption>
    <div class="mc-bar" style="--v:62.4"><span>ChatGPT help without a reflection prompt</span><i></i><b>62.4%</b></div>
    <div class="mc-bar" style="--v:39.7"><span>ChatGPT help with a short reflection prompt</span><i></i><b>39.7%</b></div>
    <p class="mc-cite">Ren (2026). A short prompt to reflect reduced students’ acceptance of wrong advice. Meanwhile, they kept accepting advice that was right.</p>
  </figure>
  <p class="mc-prose">Lee et al. surveyed 319 people who work with information (CHI 2025). Those who trusted AI more reported less effort questioning and checking answers. This survey describes what people reported, rather than proving what caused the difference. Doyeon Lee and colleagues (PNAS Nexus 2025) argue that assistants should explain how reliable their confidence is. For example, how often have their highly confident answers been right? Bahrami et al. (Science 2010) found that people who shared confidence could decide better together.</p>
</section>

<section class="mc-part" id="friction" aria-labelledby="mc-fr-title">
  <header class="mc-head"><h2 id="mc-fr-title">Pause before asking and before trusting the answer</h2><p>I can steer AI towards the answer I already want. Then I may accept its reply too easily. Therefore, I pause before asking and before deciding.</p></header>
  <ol class="mc-pipe" aria-label="Two pauses between a question and a decision">
    <li class="mc-pipe-node">I write a question</li>
    <li class="mc-gate"><b>Pause 1</b><small>Does my question suggest the answer I want?</small></li>
    <li class="mc-pipe-node">The AI answers</li>
    <li class="mc-gate"><b>Pause 2</b><small>What would make this wrong?</small></li>
    <li class="mc-pipe-node">I decide</li>
  </ol>
  <h3 class="mc-subhead">Ask a question that leaves room for disagreement</h3>
  <p class="mc-note">Select a question to see a version that leaves room for other answers.</p>
  <div class="mc-prompts" id="mc-prompts">
    <button type="button" aria-pressed="false"><span><small>Suggests the answer</small>Explain why remote work boosts productivity.</span><span><small>Leaves room for disagreement</small>What does the evidence say about remote work and productivity, for and against?</span></button>
    <button type="button" aria-pressed="false"><span><small>Suggests the answer</small>Write a summary that proves my design is the best option.</span><span><small>Leaves room for disagreement</small>Compare my design with 2 alternatives. Where do the others work better?</span></button>
    <button type="button" aria-pressed="false"><span><small>Suggests the answer</small>Confirm that this bug comes from the cache.</span><span><small>Leaves room for disagreement</small>List 3 possible causes of this bug. Which test would tell them apart?</span></button>
  </div>
  <h3 class="mc-subhead">Answer first, then ask</h3>
  <ol class="mc-order">
    <li><b>Think</b><small>Work the problem alone first.</small></li>
    <li><b>Answer</b><small>Write down my answer and how sure I am.</small></li>
    <li><b>Ask</b><small>Ask specific questions without sharing my answer yet.</small></li>
    <li><b>Critique</b><small>Then share my answer and ask it to find errors.</small></li>
  </ol>
  <p class="mc-cite">Lim’s DeBiasMe work (2025) suggests pausing before asking and before accepting an answer. Michael Gerlich recommends answering first in the APA Monitor. This helps me avoid basing my thinking on the AI’s first suggestion.</p>
</section>

<section class="mc-part" id="offload" aria-labelledby="mc-off-title">
  <header class="mc-head"><h2 id="mc-off-title">Decide what to hand over</h2><p>Some tasks only need completing. However, doing other tasks helps me learn. If AI does all that practice, I may lose chances to build or maintain the skill.</p></header>
  <p class="mc-note">Choose how much help you would use for each task. Then compare your choice with mine.</p>
  <div class="mc-sort" id="mc-sort"></div>
  <figure class="mc-figure mc-decay">
    <figcaption><b>Bowel examinations that found growths called adenomas, without AI help</b><span>Doctors use a camera to examine the bowel. Adenomas are growths that can develop into cancer.</span></figcaption>
    <div class="mc-decay-bars">
      <div style="--v:28.4"><b>28.4%</b><i></i><span>Before</span></div>
      <div class="mc-decay-after" style="--v:22.4"><b>22.4%</b><i></i><span>3 months after</span></div>
    </div>
    <p class="mc-cite">Budzyń et al. (2025) compared examinations without AI help before and after doctors used AI. These examinations took place in Poland. The study observed a drop; it does not prove that AI caused it.</p>
  </figure>
  <p class="mc-prose">Sun et al. studied 250 employees at work (Journal of Applied Psychology, 2025). ChatGPT helped most with creativity ratings when employees were better at checking and guiding their thinking. Similarly, Mutlu Cukurova recommends separating tasks I need to finish from tasks I need to learn through.</p>
</section>

<section class="mc-part" id="practice" aria-labelledby="mc-pr-title">
  <header class="mc-head"><h2 id="mc-pr-title">Try 5 minutes of checking around an AI task</h2><p>I practise by choosing a clear goal and a task slightly beyond my current skill. Then I check the result soon enough to learn from it.</p></header>
  <div class="mc-rhythm">
    <article><span>Before · 1 minute</span><h3>Predict</h3><p>Write my answer or plan, and a number for how sure I am.</p></article>
    <article><span>During · 2 minutes</span><h3>Check</h3><p>Explain one step in my own words without looking. Then find the source of one claim.</p></article>
    <article><span>After · 2 minutes</span><h3>Score</h3><p>Compare my prediction with the result. Note where I was more or less sure than the result justified.</p></article>
  </div>
  <div class="mc-lead">
    <h3>When I lead a team</h3>
    <ul>
      <li>I explain why we use AI for this task and which skills we want to keep.</li>
      <li>Then I show how I answer first, including when AI was right and I was wrong.</li>
      <li>I also ask what people noticed about their thinking. I make it safe to say “I don’t know”.</li>
    </ul>
    <p class="mc-cite">These team habits come from Hyper Island. The practice advice follows A Human Edge’s description of sustained focus during a task.</p>
  </div>
  <p class="mc-rule">Before I ask AI, I write my answer and a number for how sure I am. Afterwards, I check one claim and compare my guess with the result.</p>
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
  <h3>Studies cited</h3>
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
