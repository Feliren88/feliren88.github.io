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
    agency: {
      narrative: true,
      kicker: 'The application sat open for eleven days',
      title: 'She kept waiting to feel ready.',
      copy: 'Each night she changed one sentence, closed the laptop, and promised herself she would send it tomorrow.',
      steps: ['Wait', 'Send', 'Learn', 'Move'],
      frames: [
        ['The application sat open for eleven days', 'She kept waiting to feel ready.', 'Each night she changed one sentence, closed the laptop, and promised herself she would send it tomorrow.'],
        ['On the twelfth night, she stopped editing', 'Her hand shook when she pressed send.', 'Nothing inside her felt certain. The application left anyway.'],
        ['The reply was kind and specific', 'They wanted a stronger sample.', 'The answer hurt. It also told her which piece of work to rebuild.'],
        ['Six weeks later, she sent it again', 'This time, they said yes.', 'She read the reply twice, covered her mouth with one hand, and let herself believe it.']
      ]
    },
    decision: {
      narrative: true,
      kicker: 'The call came while he was still at dinner',
      title: 'They needed an answer tonight.',
      copy: 'The room went quiet. Urgency made every option feel final.',
      steps: ['Pressure', 'Protect', 'Test', 'Decide'],
      frames: [
        ['The call came while he was still at dinner', 'They needed an answer tonight.', 'The room went quiet. Urgency made every option feel final.'],
        ['He wrote down what could not be lost', 'Payroll. Trust. The ability to try again.', 'He would not risk those three things. The price, timing, and scope could change.'],
        ['He asked for forty-eight hours', 'Then he tested the weakest assumption.', 'One customer call exposed the number everyone else had treated as certain.'],
        ['He gave the answer the next evening', 'He spoke slowly enough to mean every word.', 'He named what the decision protected, what it risked, and the number that would make him change course.']
      ]
    },
    control: {
      narrative: true,
      kicker: 'At 6:40, the hospital called',
      title: 'There was nothing he could fix from the hallway.',
      copy: 'He refreshed the same message, paced between two chairs, and tried to think his way into a different outcome.',
      steps: ['Receive', 'Separate', 'Choose', 'Stay'],
      frames: [
        ['At 6:40, the hospital called', 'There was nothing he could fix from the hallway.', 'He refreshed the same message, paced between two chairs, and tried to think his way into a different outcome.'],
        ['He opened his notebook', 'One page became two columns.', 'On the left: the diagnosis, the wait, the doctor’s decision. On the right: who to call, what to bring, where to sit.'],
        ['He was still afraid when he stood up', 'He knew what to do for the next ten minutes.', 'He called his sister, bought two coffees, and returned to the chair beside the door.'],
        ['When the doctor came out, he was still afraid', 'He listened to every word.', 'Then he went inside, pulled the chair closer, and held his father’s hand.']
      ]
    },
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
    uncertainty: {
      narrative: true,
      kicker: 'At 2:13 a.m., she checked again',
      title: 'The answer had not changed.',
      copy: 'She reread the message, searched the same question, and felt relief for less than a minute.',
      steps: ['Check', 'Loop', 'Stop', 'Live'],
      frames: [
        ['At 2:13 a.m., she checked again', 'The answer had not changed.', 'She reread the message, searched the same question, and felt relief for less than a minute.'],
        ['By 2:46, she had opened fourteen tabs', 'Each answer created another question.', 'Her body wanted certainty. The screen could only offer more words.'],
        ['She put the phone in the kitchen', 'The doubt came with her to bed.', 'She felt her feet against the floor, counted ten slow breaths, and eventually slept.'],
        ['At nine, she made the call', 'Her voice shook on the first word.', 'She asked the one question that could change her decision, wrote down the answer, and went to work.']
      ]
    },
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
    if (key === 'agency' || key === 'decision' || key === 'control' || key === 'uncertainty') return buildEmotionalNarrativeCanvas(canvas, svg, key);
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

  function buildEmotionalNarrativeCanvas(canvas, svg, sceneKey) {
    var stories = {
      agency: {
        label: 'A woman stops waiting to feel ready, sends her work, learns from the reply, and tries again',
        frames: [
          '<rect class="em-screen" x="145" y="58" width="460" height="238" rx="12"/><text class="em-screen-label" x="190" y="96">APPLICATION · DRAFT 11</text><path class="em-message-line" d="M190 128h330M190 158h280M190 188h350M190 218h245"/><rect class="em-result-mark" x="444" y="244" width="116" height="34" rx="17"/><text class="em-result-word" x="502" y="266">NOT SENT</text><circle class="em-head" cx="92" cy="228" r="21"/><path class="em-person" d="M92 249v55m-30 36 30-36 30 36M92 269l38 14"/><text x="375" y="345">Eleven nights. Eleven versions. Nothing sent.</text>',
          '<rect class="em-screen" x="155" y="62" width="440" height="230" rx="12"/><text class="em-screen-label" x="195" y="100">READY TO SEND</text><path class="em-message-line" d="M195 132h320M195 162h270M195 192h340"/><rect class="em-result-mark" x="425" y="226" width="130" height="42" rx="21"/><text class="em-result-word" x="490" y="252">SEND</text><path class="em-arrow" d="m356 260 42-22-11 18 18 8-7 13-18-9-6 20z"/><text x="375" y="345">Her hand shook. She sent it anyway.</text>',
          '<rect class="em-message" x="135" y="66" width="480" height="225" rx="12"/><text class="em-message-small" x="180" y="108">REPLY</text><path class="em-message-line" d="M180 138h355M180 170h310M180 202h350"/><rect class="em-result-mark" x="180" y="230" width="220" height="36" rx="18"/><text class="em-result-word" x="290" y="253">STRENGTHEN THE SAMPLE</text><text x="375" y="345">The no came with one useful sentence.</text>',
          '<path class="em-road" d="M80 270C210 270 255 110 375 110s165 160 295 160"/><circle class="em-attempt-old" cx="112" cy="270" r="24"/><circle class="em-attempt-next" cx="640" cy="270" r="30"/><path class="em-arrow" d="m624 270 13 12 22-28"/><g class="em-carry"><rect x="304" y="82" width="142" height="58" rx="8"/><text x="375" y="108">SAMPLE</text><text class="em-carry-word" x="375" y="131">rebuilt</text></g><text x="375" y="345">Six weeks later, the second application went through.</text>'
        ]
      },
      decision: {
        label: 'An urgent call interrupts dinner; a man protects the essentials, checks an assumption, and answers the next day',
        frames: [
          '<path class="em-message-line" d="M100 270h550M185 270v-98h380v98"/><circle class="em-head" cx="300" cy="202" r="21"/><path class="em-person" d="M300 223v47m-30 47 30-47 30 47M300 244l45 15"/><path class="em-clock" d="M500 118a42 42 0 1 1-.1 0M500 130v27l20 12"/><rect class="em-result-mark" x="365" y="184" width="126" height="42" rx="21"/><text class="em-result-word" x="428" y="210">ANSWER TONIGHT</text><text x="375" y="345">Dinner went cold while the room waited.</text>',
          '<rect class="em-note" x="155" y="48" width="440" height="262" rx="9"/><text class="em-note-title" x="195" y="88">WHAT MUST SURVIVE</text><path class="em-note-rule" d="M195 112h355M195 170h355M195 228h355M195 286h355"/><text class="em-note-key" x="210" y="148">payroll</text><text class="em-note-value" x="535" y="148">protect</text><text class="em-note-key" x="210" y="206">trust</text><text class="em-note-value" x="535" y="206">protect</text><text class="em-note-key" x="210" y="264">another attempt</text><text class="em-note-value" x="535" y="264">protect</text><text x="375" y="345">He read the three lines aloud before answering.</text>',
          '<rect class="em-message" x="108" y="85" width="210" height="150" rx="10"/><rect class="em-message" x="432" y="85" width="210" height="150" rx="10"/><text class="em-message-small" x="148" y="122">THE FORECAST</text><text class="em-screen-value" x="213" y="183">82%</text><text class="em-message-small" x="472" y="122">CUSTOMER SAID</text><text class="em-screen-value" x="537" y="183">31%</text><path class="em-arrow" d="M335 159h78m-17-15 17 15-17 15"/><text x="375" y="345">One call changed the number everyone had trusted.</text>',
          '<rect class="em-page" x="170" y="58" width="410" height="248" rx="9"/><text class="em-page-label" x="215" y="114">DECISION</text><path class="em-note-rule" d="M215 140h320M215 184h320M215 228h240"/><path class="em-arrow" d="m474 252 15 14 26-34"/><text x="375" y="345">He answered the next evening and named the risk aloud.</text>'
        ]
      },
      control: {
        label: 'A man waits in a hospital hallway, separates what he controls, and stays beside his father',
        frames: [
          '<path class="em-office" d="M70 296h610M110 296V70h530v226M110 150h530"/><rect class="em-message" x="265" y="92" width="220" height="58" rx="8"/><text class="em-result-word" x="375" y="127">PLEASE WAIT HERE</text><circle class="em-head" cx="220" cy="230" r="22"/><path class="em-person" d="M220 252l35 44m-35-44-20 44"/><path class="em-clock" d="M558 190a34 34 0 1 1-.1 0M558 201v21l14 9"/><text x="375" y="345">He walked the same twelve steps again and again.</text>',
          '<rect class="em-note" x="120" y="55" width="510" height="245" rx="8"/><path class="em-note-rule" d="M375 55v245M155 108h185M410 108h185"/><text class="em-note-title" x="170" y="89">NOT MINE</text><text class="em-note-title" x="425" y="89">MINE</text><text class="em-note-key" x="170" y="145">the diagnosis</text><text class="em-note-key" x="425" y="145">call my sister</text><text class="em-note-key" x="170" y="190">the wait</text><text class="em-note-key" x="425" y="190">bring coffee</text><text class="em-note-key" x="170" y="235">the doctor’s choice</text><text class="em-note-key" x="425" y="235">stay nearby</text><text x="375" y="345">The right column was short enough to do.</text>',
          '<path class="em-office" d="M115 295h520M165 295v-70h140v70M445 295v-70h140v70"/><path class="em-cup" d="M336 208h38v33c0 13-38 13-38 0zM374 216h13v16h-13"/><path class="em-cup" d="M392 208h38v33c0 13-38 13-38 0zM430 216h13v16h-13"/><circle class="em-head" cx="275" cy="166" r="22"/><path class="em-person" d="M275 188v60m-35 47 35-47 35 47M275 210l48 20"/><text x="375" y="345">He made the call and came back with two coffees.</text>',
          '<circle class="em-head" cx="300" cy="160" r="23"/><path class="em-person" d="M300 183v78m-42 58 42-58 42 58M300 210l62 35"/><circle class="em-head em-helper" cx="450" cy="175" r="23"/><path class="em-person em-helper" d="M450 198v63m-42 58 42-58 42 58M450 220l-88 25"/><path class="em-open-gate" d="M570 75v225h82"/><text x="375" y="345">He pulled the chair closer and took his father’s hand.</text>'
        ]
      },
      uncertainty: {
        label: 'A woman checks the same message through the night, puts down her phone, and asks one useful question in the morning',
        frames: [
          '<rect class="em-screen" x="260" y="48" width="230" height="270" rx="24"/><text class="em-screen-label" x="375" y="84">2:13 AM</text><rect class="em-message" x="285" y="112" width="180" height="82" rx="10"/><path class="em-message-line" d="M307 137h136M307 162h102"/><circle class="em-head" cx="152" cy="226" r="22"/><path class="em-person" d="M152 248v53m-32 39 32-39 32 39M152 266l73 4"/><text x="375" y="345">She opened the same message again.</text>',
          '<g class="em-requests"><rect x="82" y="62" width="180" height="42" rx="7"/><rect x="486" y="65" width="180" height="42" rx="7"/><rect x="62" y="145" width="180" height="42" rx="7"/><rect x="508" y="150" width="180" height="42" rx="7"/><rect x="96" y="235" width="180" height="42" rx="7"/><rect x="474" y="238" width="180" height="42" rx="7"/></g><circle class="em-head" cx="375" cy="170" r="25"/><path class="em-person" d="M375 195v72m-40 58 40-58 40 58M375 220l-50 30m50-30 50 30"/><text class="em-screen-value" x="375" y="115">14</text><text x="375" y="345">Fourteen tabs gave her fourteen ways to worry.</text>',
          '<rect class="em-screen" x="90" y="90" width="116" height="160" rx="18"/><text class="em-screen-label" x="148" y="128">KITCHEN</text><path class="em-message-line" d="M112 160h72M112 188h72"/><path class="em-room" d="M320 285V105h330v180M320 214h330"/><circle class="em-head" cx="468" cy="220" r="21"/><path class="em-person" d="M468 242l35 43m-35-43-20 43"/><path class="em-thought-line" d="M206 171C285 171 310 212 430 220"/><text x="375" y="345">The doubt followed her. The phone stayed in the kitchen.</text>',
          '<rect class="em-message" x="145" y="74" width="460" height="205" rx="12"/><text class="em-message-small" x="190" y="116">9:00 AM · CALL</text><path class="em-message-line" d="M190 146h330M190 178h280"/><rect class="em-result-mark" x="190" y="212" width="320" height="42" rx="21"/><text class="em-result-word" x="350" y="238">ONE QUESTION THAT CHANGES THE DECISION</text><text x="375" y="345">She asked it once, wrote down the answer, and went to work.</text>'
        ]
      }
    };
    var story = stories[sceneKey];
    svg.setAttribute('aria-label', story.label);
    var frames = story.frames.map(function (markup, index) {
      var frame = svgEl('g', { class: 'em-story-frame em-deep-' + sceneKey + '-' + index });
      frame.innerHTML = markup;
      svg.appendChild(frame);
      return frame;
    });
    canvas.appendChild(svg);
    return { canvas: canvas, svg: svg, frames: frames, nodes: [], edges: [] };
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
