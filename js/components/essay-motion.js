/**
 * Scroll-built explanatory scenes for the eleven featured writings.
 * Scene construction follows Manim's staged-object model; the pinned scrub
 * follows the scroll-linked sequencing used by GSAP and Apple product pages.
 */
(function () {
  'use strict';

  var key = document.documentElement.dataset.motionScene;
  var scenes = {
    repair: {
      narrative: true,
      kicker: 'As a boy, he fixed what he could',
      title: 'Being useful made him feel safe.',
      copy: 'A stuck drawer, a missed detail, a problem nobody else saw. Each repair made the room feel steadier.',
      steps: ['Notice', 'Needed', 'Trapped', 'Choose'],
      frames: [
        ['As a boy, he fixed what he could', 'Being useful made him feel safe.', 'A stuck drawer, a missed detail, a problem nobody else saw. Each repair made the room feel steadier.'],
        ['Soon, people came looking for him', 'Every answer brought another request.', 'He liked being trusted. He did not notice how quickly trust became expectation.'],
        ['Years later, the work was nearly done', 'His life had no room left.', 'The project was succeeding. He was still at his desk, tired, needed, and unsure whose life he had built.'],
        ['At twenty-nine, he opened a blank page', 'What is my ability for?', 'He wrote down what he wanted to protect, what he wanted to build, and which burdens were never his.']
      ]
    },
    abstain: { kicker: 'Capability needs a stopping rule', title: 'Build the boundary.', copy: 'Measure the evidence. When support weakens, stop predicting and send the decision for review.', steps: ['Evidence', 'Measure', 'Abstain', 'Review'], nodes: [[95,110,'evidence','circle'],[275,220,'support','square'],[465,110,'stop','diamond'],[650,220,'review','circle']] },
    agency: { kicker: 'You can begin before you are sure', title: 'Turn intent into evidence.', copy: 'Notice what is happening. Run one small test, learn from the result, and use it to choose your next move.', steps: ['Notice', 'Test', 'Learn', 'Move'], nodes: [[95,220,'notice','circle'],[280,100,'test','diamond'],[465,220,'learn','square'],[650,100,'move','circle']] },
    decision: { kicker: 'Pressure changes what comes first', title: 'Protect the floor.', copy: 'Name the kind of decision you face. Slow down what cannot be undone, test what can, and leave yourself room to try again.', steps: ['Classify', 'Protect', 'Test', 'Commit'], nodes: [[95,105,'classify','square'],[275,220,'floor','diamond'],[465,105,'test','circle'],[650,220,'commit','square']] },
    control: { kicker: 'You still choose your response', title: 'Find what is yours.', copy: 'Separate what happened from what you think about it. Then choose the next action that is still in your hands.', steps: ['Event', 'Judgment', 'Choice', 'Action'], nodes: [[95,220,'event','circle'],[275,105,'judgment','square'],[465,220,'choice','diamond'],[650,105,'action','circle']] },
    strategy: { kicker: 'Every move changes what comes next', title: 'Watch the response.', copy: 'Your move changes the other person’s choices. Their response changes what makes sense for you to do next.', steps: ['Choose', 'Respond', 'Update', 'Repeat'], nodes: [[95,105,'you','circle'],[275,220,'them','circle'],[465,105,'payoff','square'],[650,220,'next round','diamond']] },
    feedback: {
      narrative: true,
      kicker: 'The message arrived at 4:17',
      title: 'His stomach dropped before he finished reading.',
      copy: 'Three words on a screen turned months of work into a judgment about who he was.',
      steps: ['Result', 'Feeling', 'Look Back', 'Continue'],
      frames: [
        ['The message arrived at 4:17', 'His stomach dropped before he finished reading.', 'Three words on a screen turned months of work into a judgment about who he was.'],
        ['By dinner, the story had grown', 'He had failed. Maybe he was a failure.', 'Shame filled every gap the message left open. He could no longer separate the result from himself.'],
        ['He did not rewrite his life that night', 'He called someone who knew him.', 'The next morning, he wrote down what he controlled, what he missed, and what nobody could have known.'],
        ['A week later, he tried again', 'The result had become useful.', 'He changed the timing, kept the part that worked, and refused to turn one loss into an identity.']
      ]
    },
    uncertainty: { kicker: 'The future is still open', title: 'Act without a guarantee.', copy: 'Name what you feel and gather facts that could change the decision. Stop when more thought only repeats the same fear.', steps: ['Feel', 'Check', 'Choose', 'Proceed'], nodes: [[95,105,'feeling','circle'],[275,220,'evidence','square'],[465,105,'choice','diamond'],[650,220,'proceed','circle']] },
    signal: { kicker: 'The other person needs a clear path', title: 'Make it easy to follow.', copy: 'Give the listener a clear point, enough context, and a next step they can question or use.', steps: ['Intent', 'Structure', 'Signal', 'Received'], nodes: [[95,220,'intent','circle'],[275,105,'structure','square'],[465,220,'signal','diamond'],[650,105,'received','circle']] },
    consent: {
      narrative: true,
      kicker: 'They always answered',
      title: 'Soon, nobody asked if they could.',
      copy: 'The messages came late. They fixed the missed details, calmed the worried people, and went to bed carrying tomorrow.',
      steps: ['Carry', 'Disappear', 'Ask', 'Return'],
      frames: [
        ['They always answered', 'Soon, nobody asked if they could.', 'The messages came late. They fixed the missed details, calmed the worried people, and went to bed carrying tomorrow.'],
        ['Their calendar was full of other people', 'Their own name barely appeared.', 'They kept every promise except sleep, quiet, and the small plans they had made for themselves.'],
        ['One night, they asked a fair question', 'Would I demand this from someone I love?', 'They would have told that person to rest. Their own exhaustion deserved the same care.'],
        ['The next request received an honest answer', 'I can help tomorrow.', 'Nobody was abandoned. They had finally stopped abandoning themselves.']
      ]
    },
    conversion: {
      narrative: true,
      kicker: 'That night, there was no lesson',
      title: 'There was only hurt.',
      copy: 'They drank water, closed the door, and sat beside someone who did not ask them to explain.',
      steps: ['Hurt', 'Shelter', 'Name', 'Build'],
      frames: [
        ['That night, there was no lesson', 'There was only hurt.', 'They drank water, closed the door, and sat beside someone who did not ask them to explain.'],
        ['A friend warmed a bowl of soup', 'The body softened first.', 'No advice. No demand for meaning. A hand nearby until the shaking stopped.'],
        ['Weeks later, they could name what happened', 'A promise broke. A limit was crossed.', 'Naming the damage showed them what needed repair and what should never be rebuilt.'],
        ['They used what was left', 'The next life had firmer ground.', 'They made one boundary, changed one method, and knew how to sit quietly beside the next person in pain.']
      ]
    }
  };
  var scene = scenes[key];
  var root = document.querySelector('.page-content');
  if (!scene || !root) return;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function svgEl(tag, attrs) {
    var node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.keys(attrs || {}).forEach(function (name) { node.setAttribute(name, attrs[name]); });
    return node;
  }
  function shape(group, x, y, kind) {
    var node;
    if (kind === 'square') node = svgEl('rect', { x: x - 39, y: y - 39, width: 78, height: 78, rx: 13, class: 'em-node-shape' });
    else if (kind === 'diamond') node = svgEl('path', { d: 'M' + x + ' ' + (y - 48) + 'L' + (x + 48) + ' ' + y + 'L' + x + ' ' + (y + 48) + 'L' + (x - 48) + ' ' + y + 'Z', class: 'em-node-shape' });
    else if (kind === 'burst') node = svgEl('path', { d: 'M' + x + ' ' + (y - 48) + 'L' + (x + 13) + ' ' + (y - 22) + 'L' + (x + 42) + ' ' + (y - 28) + 'L' + (x + 27) + ' ' + y + 'L' + (x + 46) + ' ' + (y + 25) + 'L' + (x + 15) + ' ' + (y + 21) + 'L' + x + ' ' + (y + 48) + 'L' + (x - 14) + ' ' + (y + 21) + 'L' + (x - 45) + ' ' + (y + 27) + 'L' + (x - 28) + ' ' + y + 'L' + (x - 42) + ' ' + (y - 28) + 'L' + (x - 13) + ' ' + (y - 22) + 'Z', class: 'em-node-shape' });
    else node = svgEl('circle', { cx: x, cy: y, r: 43, class: 'em-node-shape' });
    group.appendChild(node);
  }

  function buildNarrativeCanvas() {
    var canvas = el('div', 'em-canvas em-narrative-canvas');
    var svg = svgEl('svg', { viewBox: '0 0 750 360', role: 'img', 'aria-label': 'A boy becomes the person everyone relies on, then questions the life his usefulness has built' });
    if (key === 'feedback') return buildFeedbackNarrativeCanvas(canvas, svg);
    if (key === 'consent') return buildConsentNarrativeCanvas(canvas, svg);
    if (key === 'conversion') return buildConversionNarrativeCanvas(canvas, svg);
    var night = svgEl('g', { class: 'em-story-frame em-story-night' });
    night.innerHTML = '<path class="em-room" d="M70 300V72h250v228M70 250h250M118 72v178M70 176h250"/><path class="em-rain" d="M92 92l-18 36m70-48l-26 52m80-42l-22 44m86-50l-24 48"/><circle class="em-head" cx="405" cy="174" r="25"/><path class="em-person" d="M405 199v72m-43 49 43-49 43 49M405 220l-42 34"/><rect class="em-drawer" x="350" y="247" width="88" height="42" rx="4"/><path class="em-drawer-stuck" d="M365 264h48"/><text x="192" y="330">He noticed what others passed by.</text>';
    svg.appendChild(night);

    var needed = svgEl('g', { class: 'em-story-frame em-story-needed' });
    needed.innerHTML = '<circle class="em-head" cx="375" cy="123" r="25"/><path class="em-person" d="M375 148v108m-48 67 48-67 48 67M375 184l-55 42m55-42 55 42"/><g class="em-load"><rect x="95" y="80" width="130" height="48" rx="6"/><text x="160" y="109">problem</text><rect x="525" y="95" width="130" height="48" rx="6"/><text x="590" y="124">urgency</text><rect x="88" y="202" width="150" height="48" rx="6"/><text x="163" y="231">trust</text><rect x="512" y="220" width="155" height="48" rx="6"/><text x="589" y="249">responsibility</text></g><path class="em-pull" d="M225 104C290 110 310 150 350 177M525 119C462 127 445 154 400 177M238 226C295 225 315 215 350 197M512 244C458 237 435 218 400 197"/><text x="375" y="350">“Can you take one more thing?”</text>';
    svg.appendChild(needed);

    var trapped = svgEl('g', { class: 'em-story-frame em-story-trapped' });
    trapped.innerHTML = '<path class="em-office" d="M96 304h558M142 304V126h466v178M142 214h466"/><rect class="em-screen" x="257" y="150" width="236" height="116" rx="8"/><text class="em-screen-label" x="375" y="188">PROJECT</text><text class="em-screen-value" x="375" y="235">99%</text><circle class="em-head" cx="210" cy="244" r="20"/><path class="em-person" d="M210 264l32 40m-32-40-18 40"/><path class="em-clock" d="M565 155a32 32 0 1 1-.1 0M565 166v22l15 9"/><text x="375" y="344">The project was at 99%. He was still there.</text>';
    svg.appendChild(trapped);

    var choice = svgEl('g', { class: 'em-story-frame em-story-choice' });
    choice.innerHTML = '<rect class="em-page" x="170" y="55" width="410" height="260" rx="8"/><circle class="em-page-dot" cx="198" cy="80" r="4"/><circle class="em-page-dot" cx="214" cy="80" r="4"/><circle class="em-page-dot" cx="230" cy="80" r="4"/><text class="em-page-label" x="220" y="145">THINGS I KNOW THAT</text><text class="em-page-label" x="220" y="177">DO NOT BELONG TO ME YET</text><path class="em-cursor" d="M220 215h3v28h-3z"/><path class="em-door" d="M610 282V118h72v164M622 282V132h48v150"/><circle class="em-knob" cx="658" cy="210" r="4"/><text x="375" y="344">For once, the next move belonged to him.</text>';
    svg.appendChild(choice);
    canvas.appendChild(svg);
    return { canvas: canvas, svg: svg, frames: [night, needed, trapped, choice], nodes: [], edges: [] };
  }

  function buildFeedbackNarrativeCanvas(canvas, svg) {
    svg.setAttribute('aria-label', 'A result causes a painful first reaction, then becomes a lesson for the next attempt');
    var result = svgEl('g', { class: 'em-story-frame em-feedback-result' });
    result.innerHTML = '<rect class="em-message" x="150" y="72" width="450" height="210" rx="12"/><text class="em-message-small" x="190" y="112">RESULT</text><path class="em-message-line" d="M190 138h320M190 167h250M190 196h285"/><rect class="em-result-mark" x="190" y="222" width="165" height="34" rx="17"/><text class="em-result-word" x="272" y="244">NOT THIS TIME</text><circle class="em-head" cx="650" cy="240" r="22"/><path class="em-person" d="M650 262v58m-35 28 35-28 35 28M650 282l-32 18"/><text x="375" y="340">The body heard it before the mind understood it.</text>';
    svg.appendChild(result);

    var feeling = svgEl('g', { class: 'em-story-frame em-feedback-feeling' });
    feeling.innerHTML = '<circle class="em-head" cx="375" cy="158" r="30"/><path class="em-person" d="M375 188v78m-44 62 44-62 44 62M375 218l-46 29m46-29 46 29"/><g class="em-thoughts"><text x="205" y="105">I failed.</text><text x="545" y="105">I am a failure.</text><text x="205" y="235">They were right.</text><text x="545" y="235">I should stop.</text></g><path class="em-thought-line" d="M340 145 252 112M410 145l88-33M340 184l-88 40M410 184l88 40"/><text x="375" y="350">Pain wrote a verdict before the facts arrived.</text>';
    svg.appendChild(feeling);

    var review = svgEl('g', { class: 'em-story-frame em-feedback-review' });
    review.innerHTML = '<rect class="em-note" x="130" y="55" width="490" height="250" rx="8"/><text class="em-note-title" x="175" y="98">WHAT HAPPENED?</text><path class="em-note-rule" d="M175 122h400M175 174h400M175 226h400M175 278h400"/><text class="em-note-key" x="190" y="153">skill</text><text class="em-note-value" x="555" y="153">held</text><text class="em-note-key" x="190" y="205">timing</text><text class="em-note-value" x="555" y="205">late</text><text class="em-note-key" x="190" y="257">luck</text><text class="em-note-value" x="555" y="257">unknown</text><text x="375" y="345">The page could hold what his mind kept mixing together.</text>';
    svg.appendChild(review);

    var continueFrame = svgEl('g', { class: 'em-story-frame em-feedback-continue' });
    continueFrame.innerHTML = '<path class="em-road" d="M70 270C220 270 245 115 375 115s155 155 305 155"/><circle class="em-attempt-old" cx="120" cy="270" r="24"/><text class="em-attempt-label" x="120" y="318">one result</text><circle class="em-attempt-next" cx="630" cy="270" r="28"/><text class="em-attempt-label" x="630" y="318">next attempt</text><path class="em-arrow" d="m615 270 13 12 21-27"/><g class="em-carry"><rect x="305" y="86" width="140" height="58" rx="8"/><text x="375" y="111">KEEP</text><text class="em-carry-word" x="375" y="133">what worked</text></g><text x="375" y="350">He changed the next attempt, not his opinion of himself.</text>';
    svg.appendChild(continueFrame);
    canvas.appendChild(svg);
    return { canvas: canvas, svg: svg, frames: [result, feeling, review, continueFrame], nodes: [], edges: [] };
  }

  function buildConsentNarrativeCanvas(canvas, svg) {
    svg.setAttribute('aria-label', 'A capable person carries everyone else’s needs, sees their own absence, and draws a boundary that includes them');
    var carry = svgEl('g', { class: 'em-story-frame em-consent-carry' });
    carry.innerHTML = '<circle class="em-head" cx="375" cy="112" r="24"/><path class="em-person" d="M375 136v108m-48 72 48-72 48 72M375 176l-78 50m78-50 78 50"/><g class="em-requests"><rect x="82" y="72" width="150" height="45" rx="7"/><text x="157" y="100">Can you fix this?</text><rect x="518" y="88" width="145" height="45" rx="7"/><text x="590" y="116">We need you.</text><rect x="74" y="204" width="160" height="45" rx="7"/><text x="154" y="232">One more thing.</text><rect x="520" y="220" width="150" height="45" rx="7"/><text x="595" y="248">It is urgent.</text></g><path class="em-pull" d="M232 95 350 172M518 111 400 172M234 226 350 194M520 242 400 194"/><text x="375" y="348">Every request assumed the answer would be yes.</text>';
    svg.appendChild(carry);

    var disappear = svgEl('g', { class: 'em-story-frame em-consent-disappear' });
    disappear.innerHTML = '<path class="em-calendar" d="M105 72h540v240H105zM105 124h540M185 72v52m380-52v52"/><g class="em-days"><rect x="130" y="148" width="95" height="52"/><rect x="242" y="148" width="95" height="52"/><rect x="354" y="148" width="95" height="52"/><rect x="466" y="148" width="95" height="52"/><rect x="130" y="218" width="95" height="52"/><rect x="242" y="218" width="95" height="52"/><rect x="354" y="218" width="95" height="52"/><rect x="466" y="218" width="95" height="52"/></g><text class="em-calendar-word" x="177" y="179">work</text><text class="em-calendar-word" x="289" y="179">help</text><text class="em-calendar-word" x="401" y="179">fix</text><text class="em-calendar-word" x="513" y="179">cover</text><text class="em-calendar-word" x="177" y="249">reply</text><text class="em-calendar-word" x="289" y="249">stay</text><text class="em-calendar-word" x="401" y="249">solve</text><text class="em-calendar-word em-faded" x="513" y="249">me</text><text x="375" y="348">Their own life was the only request left unanswered.</text>';
    svg.appendChild(disappear);

    var ask = svgEl('g', { class: 'em-story-frame em-consent-ask' });
    ask.innerHTML = '<rect class="em-mirror" x="250" y="48" width="250" height="250" rx="125"/><circle class="em-head" cx="375" cy="125" r="24"/><path class="em-person" d="M375 149v80m-42 58 42-58 42 58M375 178l-39 25m39-25 39 25"/><text class="em-mirror-question" x="375" y="326">Would I ask this of someone I loved?</text>';
    svg.appendChild(ask);

    var returnFrame = svgEl('g', { class: 'em-story-frame em-consent-return' });
    returnFrame.innerHTML = '<path class="em-boundary" d="M375 42v276"/><circle class="em-head" cx="245" cy="126" r="24"/><path class="em-person" d="M245 150v92m-44 70 44-70 44 70M245 184l-44 30m44-30 44 30"/><g class="em-care"><circle cx="505" cy="118" r="26"/><circle cx="565" cy="192" r="26"/><circle cx="490" cy="266" r="26"/></g><path class="em-open-gate" d="M375 180h82v80h-82"/><text class="em-boundary-word" x="415" y="168">consent</text><text x="375" y="348">They still cared. They started answering honestly.</text>';
    svg.appendChild(returnFrame);
    canvas.appendChild(svg);
    return { canvas: canvas, svg: svg, frames: [carry, disappear, ask, returnFrame], nodes: [], edges: [] };
  }

  function buildConversionNarrativeCanvas(canvas, svg) {
    svg.setAttribute('aria-label', 'A person survives a storm, receives care, names what broke, and builds a path from what remains');
    var hurt = svgEl('g', { class: 'em-story-frame em-life-hurt' });
    hurt.innerHTML = '<path class="em-storm" d="M60 75h630M92 38 55 118m110-92-54 116m130-99-48 102m128-115-58 126m138-117-55 118m142-125-53 118m133-112-48 105"/><circle class="em-head" cx="375" cy="188" r="24"/><path class="em-person em-seated" d="M375 212l-34 48 69 1m-35-49 39 38m-73 10-25 48m94-47 28 47"/><path class="em-ground" d="M70 309h610"/><text x="375" y="345">There was no lesson yet. There was only the weather.</text>';
    svg.appendChild(hurt);

    var shelter = svgEl('g', { class: 'em-story-frame em-life-shelter' });
    shelter.innerHTML = '<path class="em-roof" d="M120 172 375 52l255 120M160 154v158m430-158v158"/><circle class="em-head" cx="330" cy="190" r="22"/><path class="em-person" d="M330 212v62m-36 43 36-43 36 43M330 237l-35 23"/><circle class="em-head em-helper" cx="445" cy="178" r="22"/><path class="em-person em-helper" d="M445 200v74m-36 43 36-43 36 43M445 225l-70 34"/><path class="em-cup" d="M248 252h42v36c0 14-42 14-42 0zM290 260h14v18h-14"/><text x="375" y="345">Before meaning, there was shelter.</text>';
    svg.appendChild(shelter);

    var name = svgEl('g', { class: 'em-story-frame em-life-name' });
    name.innerHTML = '<path class="em-broken" d="M95 240 205 110l95 102 88-150 93 168 93-105 80 115"/><g class="em-tags"><rect x="112" y="245" width="116" height="38" rx="6"/><text x="170" y="269">broken promise</text><rect x="314" y="245" width="118" height="38" rx="6"/><text x="373" y="269">crossed limit</text><rect x="518" y="245" width="112" height="38" rx="6"/><text x="574" y="269">wrong path</text></g><text x="375" y="345">Distance gave each broken piece a name.</text>';
    svg.appendChild(name);

    var build = svgEl('g', { class: 'em-story-frame em-life-build' });
    build.innerHTML = '<path class="em-ravine" d="M45 276h170l55 55m435-55H535l-55 55"/><g class="em-bridge"><rect x="205" y="238" width="85" height="24"/><rect x="292" y="222" width="85" height="24"/><rect x="379" y="222" width="85" height="24"/><rect x="466" y="238" width="85" height="24"/></g><text class="em-bridge-word" x="248" y="255">boundary</text><text class="em-bridge-word" x="334" y="239">method</text><text class="em-bridge-word" x="421" y="239">courage</text><text class="em-bridge-word" x="508" y="255">care</text><circle class="em-head" cx="160" cy="185" r="21"/><path class="em-person" d="M160 206v55m-30 42 30-42 30 42M160 225l36 20"/><circle class="em-head em-helper" cx="605" cy="185" r="21"/><path class="em-person em-helper" d="M605 206v55m-30 42 30-42 30 42M605 225l-36 20"/><text x="375" y="345">What they built could carry someone else, too.</text>';
    svg.appendChild(build);
    canvas.appendChild(svg);
    return { canvas: canvas, svg: svg, frames: [hurt, shelter, name, build], nodes: [], edges: [] };
  }

  var host = el('section', 'em-story');
  host.setAttribute('aria-label', scene.kicker);
  var pin = el('div', 'em-pin');
  var copy = el('div', 'em-copy');
  copy.appendChild(el('span', 'em-kicker', scene.kicker));
  copy.appendChild(el('h2', '', scene.title));
  copy.appendChild(el('p', '', scene.copy));
  var read = el('div', 'em-stage-read');
  read.appendChild(el('b', '', '01')); read.appendChild(el('i')); read.appendChild(el('span', '', scene.steps[0])); copy.appendChild(read);
  pin.appendChild(copy);

  var narrative = scene.narrative ? buildNarrativeCanvas() : null;
  var canvas = narrative ? narrative.canvas : el('div', 'em-canvas');
  var svg = narrative ? narrative.svg : svgEl('svg', { viewBox: '0 0 750 330', role: 'img', 'aria-label': scene.steps.join(' to ') });
  var grid = svgEl('g', { class: 'em-grid', 'aria-hidden': 'true' });
  if (!narrative) [55,110,165,220,275].forEach(function (y) { grid.appendChild(svgEl('line', { x1: 25, y1: y, x2: 725, y2: y })); });
  if (!narrative) svg.appendChild(grid);
  if (!narrative) svg.appendChild(svgEl('circle', { cx: 375, cy: 165, r: 145, class: 'em-orbit' }));
  if (!narrative) svg.appendChild(svgEl('circle', { cx: 375, cy: 165, r: 78, class: 'em-pulse' }));
  var edges = narrative ? narrative.edges : [];
  (scene.nodes || []).slice(0, -1).forEach(function (point, index) {
    var next = scene.nodes[index + 1];
    var path = svgEl('path', { d: 'M' + point[0] + ' ' + point[1] + ' C' + (point[0] + 75) + ' ' + point[1] + ' ' + (next[0] - 75) + ' ' + next[1] + ' ' + next[0] + ' ' + next[1], class: 'em-edge', pathLength: '1' });
    edges.push(path); svg.appendChild(path);
  });
  var nodes = narrative ? narrative.nodes : [];
  (scene.nodes || []).forEach(function (point) {
    var group = svgEl('g', { class: 'em-node' });
    shape(group, point[0], point[1], point[3]);
    var label = svgEl('text', { x: point[0], y: point[1] + 5 }); label.textContent = point[2]; group.appendChild(label);
    nodes.push(group); svg.appendChild(group);
  });
  if (!narrative) canvas.appendChild(svg); pin.appendChild(canvas);

  var steps = el('ol', 'em-steps');
  scene.steps.forEach(function (label, index) { var item = el('li'); item.appendChild(el('b', '', '0' + (index + 1))); item.appendChild(el('span', '', label)); steps.appendChild(item); });
  pin.appendChild(steps);
  var skip = el('button', 'em-skip', 'Skip scene ↓'); skip.type = 'button'; pin.appendChild(skip);
  host.appendChild(pin);

  var anchor = root.querySelector(':scope > [class*="-hero"]') || Array.prototype.find.call(root.children, function (child) { return child.matches && child.matches('header, section'); });
  if (anchor && anchor.nextSibling) root.insertBefore(host, anchor.nextSibling); else root.appendChild(host);

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ticking = false;
  function alignToViewport() {
    host.style.setProperty('--em-gutter', root.getBoundingClientRect().left.toFixed(2) + 'px');
  }
  function paint() {
    var rect = host.getBoundingClientRect();
    var span = Math.max(1, host.offsetHeight - innerHeight);
    var progress = reduced ? 1 : Math.max(0, Math.min(1, -rect.top / span));
    host.style.setProperty('--em-p', progress.toFixed(4));
    host.style.setProperty('--em-x', (20 + progress * 55).toFixed(2) + '%');
    var stage = Math.min(3, Math.floor(progress * 4));
    if (scene.frames) {
      copy.querySelector('.em-kicker').textContent = scene.frames[stage][0];
      copy.querySelector('h2').textContent = scene.frames[stage][1];
      copy.querySelector('p').textContent = scene.frames[stage][2];
      narrative.frames.forEach(function (frame, index) { frame.classList.toggle('is-active', index === stage); });
    }
    read.querySelector('b').textContent = '0' + (stage + 1); read.querySelector('span').textContent = scene.steps[stage];
    Array.prototype.forEach.call(steps.children, function (item, index) { item.classList.toggle('is-active', index <= stage); });
    nodes.forEach(function (node, index) { var local = Math.max(0, Math.min(1, (progress - index * .22) * 4)); node.style.opacity = (.12 + local * .88).toFixed(3); node.style.transform = 'scale(' + (.72 + local * .28).toFixed(3) + ')'; });
    edges.forEach(function (edge, index) { var local = Math.max(0, Math.min(1, (progress - index * .24) * 3.2)); edge.style.strokeDashoffset = (1 - local).toFixed(3); });
    ticking = false;
  }
  function requestPaint() { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }
  skip.addEventListener('click', function () { host.scrollIntoView({ block: 'end', behavior: reduced ? 'auto' : 'smooth' }); });
  function resize() { alignToViewport(); requestPaint(); }
  addEventListener('scroll', requestPaint, { passive: true }); addEventListener('resize', resize); alignToViewport(); paint();
})();
