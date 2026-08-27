/**
 * Scroll-built explanatory scenes for the twelve featured writings and /about/.
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
    rapport: {
      narrative: true,
      kicker: 'He stood at the edge of the room',
      title: 'Everyone else was already mid-conversation.',
      copy: 'He had rehearsed something clever on the way over. Standing there, none of it seemed worth saying out loud.',
      steps: ['Edge', 'Open', 'Land', 'Leave'],
      frames: [
        ['He stood at the edge of the room', 'Everyone else was already mid-conversation.', 'He had rehearsed something clever on the way over. Standing there, none of it seemed worth saying out loud.'],
        ['He said something ordinary instead', 'It turned out to be enough.', 'He asked how they knew the host. The question was unremarkable, and the person answered it gladly.'],
        ['The third question found something real', 'They both stopped performing.', 'He followed one word from her answer, and the conversation stopped being about the room.'],
        ['He left after three conversations', 'One of them was worth keeping.', 'He went home earlier than everyone else, with one name he actually wanted to write to.']
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
    },
    /*
      /curious/ has carried motion_scene: curiosity since it shipped, but the scene
      was never written, so the page loaded the engine and rendered nothing. Four
      beats, following the page's own loop: notice the thing that does not fit,
      distrust the first tidy explanation, find a check the explanations disagree
      about, and say what the result did to your own guess.
    */
    curiosity: {
      narrative: true,
      kicker: 'The number was three points off',
      title: 'Everyone had already moved on.',
      copy: 'The meeting closed the item in under a minute. She wrote the number down and kept looking at it.',
      steps: ['Notice', 'Explain', 'Test', 'Update'],
      frames: [
        ['The number was three points off', 'Everyone had already moved on.', 'The meeting closed the item in under a minute. She wrote the number down and kept looking at it.'],
        ['The first explanation arrived within a minute', 'It was tidy and probably wrong.', 'A neat story closes a question before anyone has opened it. She wrote down two more that fit the same number.'],
        ['So she looked for something that would disagree', 'One check could separate them.', 'Each story predicted a different answer to the same small question. Finding out took an afternoon.'],
        ['The result ruled out her own guess', 'She said so in the meeting.', 'Her favourite explanation was the one the evidence removed. She reported it that way, and the team stopped defending the tidy story.']
      ]
    },
    /*
      The only eight-beat scene, and the only one on a page rather than a writing.
      Every claim is traceable to Vicky's published personal writing,
      _data/experience.yml, publications.yml or awards.yml.
    */
    record: {
      narrative: true,
      kicker: 'Jakarta, 2020. Working from home',
      title: 'Everything I built stayed on my laptop.',
      copy: 'I had just graduated into a pandemic. I could build models, but they were still private experiments. I wanted to know whether my work could help someone outside my room.',
      steps: ['At home', 'Weekend builds', 'Public work', 'Higher stakes', 'A harder test', 'Closer to home', 'A troubling result', 'What I do now'],
      frames: [
        ['Jakarta, 2020. Working from home', 'Everything I built stayed on my laptop.', 'I knew how to make a model give me an answer. I did not yet know whether that answer could help anyone. I wanted my work to leave the room.'],
        ['I started building over weekends', 'We had 48 hours to make something people could use.', 'Small teams taught me how quickly an idea meets reality. We made a phone service for poor internet, remote health checks, and a tool that predicted where people would need rides.'],
        ['A city team picked up one of my forecasts', 'Their decisions affected more than 10M people.', 'The forecast helped them decide where to send public resources. For the first time, people I would never meet could feel the effect of a number I produced.'],
        ['The next systems checked people’s identities', 'On busy days, they handled more than 1M checks.', 'Getting one wrong could keep someone out of an account. I kept the systems running and made sure staff could see why they had made each decision. After 12 months, I was given greater responsibility.'],
        ['I wanted to see where my work would fail', 'Could it handle images it had never seen?', 'I had built a tool that found floods in satellite images. I fed it images from another satellite with 6× more detail. It found the water there too.'],
        ['I began looking closer to home', 'Southeast Asia was hard to find in the data used to build AI.', 'I cleaned and sorted 1.28M images from the region. More than 50 researchers across 5 countries contributed, so other people could study the places and languages we knew firsthand.'],
        ['Then I watched an AI ignore its own eyes', 'It saw the image correctly and followed a false caption anyway.', 'One model did this 81% of the time. It recognised the image correctly but answered from the caption. That result changed what I wanted to work on.'],
        ['This is the problem I work on now', 'AI needs a way to admit that it may be wrong.', 'I test whether training meant to make AI safer improves that judgment. When the evidence is poor, the system should say that it is unsure and leave the final decision to a person.']
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
    if (key === 'agency' || key === 'decision' || key === 'control' || key === 'uncertainty' || key === 'rapport' || key === 'record' || key === 'curiosity') return buildEmotionalNarrativeCanvas(canvas, svg, key);
    var night = svgEl('g', { class: 'em-story-frame em-story-night' });
    night.innerHTML = '<path class="em-room" d="M70 300V72h250v228M70 250h250M118 72v178M70 176h250"/><path class="em-rain" d="M92 92l-18 36m70-48l-26 52m80-42l-22 44m86-50l-24 48"/><g class="em-fig em-fig-boy"><circle class="em-head" cx="405" cy="174" r="25"/><path class="em-person" d="M405 199v72m-43 49 43-49 43 49"/><path class="em-person em-arm" d="M405 220l-42 34"/></g><rect class="em-drawer" x="350" y="247" width="88" height="42" rx="4"/><path class="em-drawer-stuck" d="M365 264h48"/><text x="192" y="330">He noticed what others passed by.</text>';
    svg.appendChild(night);

    var needed = svgEl('g', { class: 'em-story-frame em-story-needed' });
    needed.innerHTML = '<g class="em-fig em-fig-pulled"><circle class="em-head" cx="375" cy="123" r="25"/><path class="em-person" d="M375 148v108m-48 67 48-67 48 67"/><path class="em-person em-arm em-arm-l" d="M375 184l-55 42"/><path class="em-person em-arm em-arm-r" d="M375 184l55 42"/></g><g class="em-load"><rect x="95" y="80" width="130" height="48" rx="6"/><text x="160" y="109">problem</text><rect x="525" y="95" width="130" height="48" rx="6"/><text x="590" y="124">urgency</text><rect x="88" y="202" width="150" height="48" rx="6"/><text x="163" y="231">trust</text><rect x="512" y="220" width="155" height="48" rx="6"/><text x="589" y="249">responsibility</text></g><path class="em-pull" d="M225 104C290 110 310 150 350 177M525 119C462 127 445 154 400 177M238 226C295 225 315 215 350 197M512 244C458 237 435 218 400 197"/><text x="375" y="350">“Can you take one more thing?”</text>';
    svg.appendChild(needed);

    var trapped = svgEl('g', { class: 'em-story-frame em-story-trapped' });
    trapped.innerHTML = '<path class="em-office" d="M96 304h558M142 304V126h466v178M142 214h466"/><rect class="em-screen" x="257" y="150" width="236" height="116" rx="8"/><text class="em-screen-label" x="375" y="188">PROJECT</text><text class="em-screen-value" x="375" y="235">99%</text><g class="em-fig em-fig-spent"><circle class="em-head" cx="210" cy="244" r="20"/><path class="em-person" d="M210 264l32 40m-32-40-18 40"/></g><path class="em-clock" d="M565 155a32 32 0 1 1-.1 0M565 166v22l15 9"/><text x="375" y="344">The project was at 99%. He was still there.</text>';
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
    result.innerHTML = '<rect class="em-message" x="150" y="72" width="450" height="210" rx="12"/><text class="em-message-small" x="190" y="112">RESULT</text><path class="em-message-line" d="M190 138h320M190 167h250M190 196h285"/><rect class="em-result-mark" x="190" y="222" width="165" height="34" rx="17"/><text class="em-result-word" x="272" y="244">NOT THIS TIME</text><g class="em-fig em-fig-drop"><circle class="em-head" cx="650" cy="240" r="22"/><path class="em-person" d="M650 262v58m-35 28 35-28 35 28"/><path class="em-person em-arm" d="M650 282l-32 18"/></g><text x="375" y="340">The body heard it before the mind understood it.</text>';
    svg.appendChild(result);

    var feeling = svgEl('g', { class: 'em-story-frame em-feedback-feeling' });
    feeling.innerHTML = '<g class="em-fig em-fig-curl"><circle class="em-head" cx="375" cy="158" r="30"/><path class="em-person" d="M375 188v78m-44 62 44-62 44 62M375 218l-46 29m46-29 46 29"/></g><g class="em-thoughts"><text x="205" y="105">I failed.</text><text x="545" y="105">I am a failure.</text><text x="205" y="235">They were right.</text><text x="545" y="235">I should stop.</text></g><path class="em-thought-line" d="M340 145 252 112M410 145l88-33M340 184l-88 40M410 184l88 40"/><text x="375" y="350">Pain wrote a verdict before the facts arrived.</text>';
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
    carry.innerHTML = '<g class="em-fig em-fig-laden"><circle class="em-head" cx="375" cy="112" r="24"/><path class="em-person" d="M375 136v108m-48 72 48-72 48 72"/><path class="em-person em-arm em-arm-l" d="M375 176l-78 50"/><path class="em-person em-arm em-arm-r" d="M375 176l78 50"/></g><g class="em-requests"><rect x="82" y="72" width="150" height="45" rx="7"/><text x="157" y="100">Can you fix this?</text><rect x="518" y="88" width="145" height="45" rx="7"/><text x="590" y="116">We need you.</text><rect x="74" y="204" width="160" height="45" rx="7"/><text x="154" y="232">One more thing.</text><rect x="520" y="220" width="150" height="45" rx="7"/><text x="595" y="248">It is urgent.</text></g><path class="em-pull" d="M232 95 350 172M518 111 400 172M234 226 350 194M520 242 400 194"/><text x="375" y="348">Every request assumed the answer would be yes.</text>';
    svg.appendChild(carry);

    var disappear = svgEl('g', { class: 'em-story-frame em-consent-disappear' });
    disappear.innerHTML = '<path class="em-calendar" d="M105 72h540v240H105zM105 124h540M185 72v52m380-52v52"/><g class="em-days"><rect x="130" y="148" width="95" height="52"/><rect x="242" y="148" width="95" height="52"/><rect x="354" y="148" width="95" height="52"/><rect x="466" y="148" width="95" height="52"/><rect x="130" y="218" width="95" height="52"/><rect x="242" y="218" width="95" height="52"/><rect x="354" y="218" width="95" height="52"/><rect x="466" y="218" width="95" height="52"/></g><text class="em-calendar-word" x="177" y="179">work</text><text class="em-calendar-word" x="289" y="179">help</text><text class="em-calendar-word" x="401" y="179">fix</text><text class="em-calendar-word" x="513" y="179">cover</text><text class="em-calendar-word" x="177" y="249">reply</text><text class="em-calendar-word" x="289" y="249">stay</text><text class="em-calendar-word" x="401" y="249">solve</text><text class="em-calendar-word em-faded" x="513" y="249">me</text><text x="375" y="348">Their own life was the only request left unanswered.</text>';
    svg.appendChild(disappear);

    var ask = svgEl('g', { class: 'em-story-frame em-consent-ask' });
    ask.innerHTML = '<rect class="em-mirror" x="250" y="48" width="250" height="250" rx="125"/><g class="em-fig em-fig-mirror"><circle class="em-head" cx="375" cy="125" r="24"/><path class="em-person" d="M375 149v80m-42 58 42-58 42 58M375 178l-39 25m39-25 39 25"/></g><text class="em-mirror-question" x="375" y="326">Would I ask this of someone I loved?</text>';
    svg.appendChild(ask);

    var returnFrame = svgEl('g', { class: 'em-story-frame em-consent-return' });
    returnFrame.innerHTML = '<path class="em-boundary" d="M375 42v276"/><g class="em-fig em-fig-upright"><circle class="em-head" cx="245" cy="126" r="24"/><path class="em-person" d="M245 150v92m-44 70 44-70 44 70M245 184l-44 30m44-30 44 30"/></g><g class="em-care"><circle cx="505" cy="118" r="26"/><circle cx="565" cy="192" r="26"/><circle cx="490" cy="266" r="26"/></g><path class="em-open-gate" d="M375 180h82v80h-82"/><text class="em-boundary-word" x="415" y="168">consent</text><text x="375" y="348">They still cared. They started answering honestly.</text>';
    svg.appendChild(returnFrame);
    canvas.appendChild(svg);
    return { canvas: canvas, svg: svg, frames: [carry, disappear, ask, returnFrame], nodes: [], edges: [] };
  }

  function buildConversionNarrativeCanvas(canvas, svg) {
    svg.setAttribute('aria-label', 'A person survives a storm, receives care, names what broke, and builds a path from what remains');
    var hurt = svgEl('g', { class: 'em-story-frame em-life-hurt' });
    hurt.innerHTML = '<path class="em-storm" d="M60 75h630M92 38 55 118m110-92-54 116m130-99-48 102m128-115-58 126m138-117-55 118m142-125-53 118m133-112-48 105"/><g class="em-fig em-fig-rock"><circle class="em-head" cx="375" cy="188" r="24"/><path class="em-person em-seated" d="M375 212l-34 48 69 1m-35-49 39 38m-73 10-25 48m94-47 28 47"/></g><path class="em-ground" d="M70 309h610"/><text x="375" y="345">There was no lesson yet. There was only the weather.</text>';
    svg.appendChild(hurt);

    var shelter = svgEl('g', { class: 'em-story-frame em-life-shelter' });
    shelter.innerHTML = '<path class="em-roof" d="M120 172 375 52l255 120M160 154v158m430-158v158"/><g class="em-fig em-fig-soften"><circle class="em-head" cx="330" cy="190" r="22"/><path class="em-person" d="M330 212v62m-36 43 36-43 36 43"/><path class="em-person em-arm" d="M330 237l-35 23"/></g><g class="em-fig em-fig-nearby"><circle class="em-head em-helper" cx="445" cy="178" r="22"/><path class="em-person em-helper" d="M445 200v74m-36 43 36-43 36 43"/><path class="em-person em-helper em-arm" d="M445 225l-70 34"/></g><path class="em-cup" d="M248 252h42v36c0 14-42 14-42 0zM290 260h14v18h-14"/><text x="375" y="345">Before meaning, there was shelter.</text>';
    svg.appendChild(shelter);

    var name = svgEl('g', { class: 'em-story-frame em-life-name' });
    name.innerHTML = '<path class="em-broken" d="M95 240 205 110l95 102 88-150 93 168 93-105 80 115"/><g class="em-tags"><rect x="112" y="245" width="116" height="38" rx="6"/><text x="170" y="269">broken promise</text><rect x="314" y="245" width="118" height="38" rx="6"/><text x="373" y="269">crossed limit</text><rect x="518" y="245" width="112" height="38" rx="6"/><text x="574" y="269">wrong path</text></g><text x="375" y="345">Distance gave each broken piece a name.</text>';
    svg.appendChild(name);

    var build = svgEl('g', { class: 'em-story-frame em-life-build' });
    build.innerHTML = '<path class="em-ravine" d="M45 276h170l55 55m435-55H535l-55 55"/><g class="em-bridge"><g class="em-plank"><rect x="205" y="238" width="85" height="24"/><text class="em-bridge-word" x="248" y="255">boundary</text></g><g class="em-plank"><rect x="292" y="222" width="85" height="24"/><text class="em-bridge-word" x="334" y="239">method</text></g><g class="em-plank"><rect x="379" y="222" width="85" height="24"/><text class="em-bridge-word" x="421" y="239">courage</text></g><g class="em-plank"><rect x="466" y="238" width="85" height="24"/><text class="em-bridge-word" x="508" y="255">care</text></g></g><g class="em-fig em-fig-builder"><circle class="em-head" cx="160" cy="185" r="21"/><path class="em-person" d="M160 206v55m-30 42 30-42 30 42M160 225l36 20"/></g><g class="em-fig em-fig-crosser"><circle class="em-head em-helper" cx="605" cy="185" r="21"/><path class="em-person em-helper" d="M605 206v55m-30 42 30-42 30 42M605 225l-36 20"/></g><text x="375" y="345">What they built could carry someone else, too.</text>';
    svg.appendChild(build);
    canvas.appendChild(svg);
    return { canvas: canvas, svg: svg, frames: [hurt, shelter, name, build], nodes: [], edges: [] };
  }

  function buildEmotionalNarrativeCanvas(canvas, svg, sceneKey) {
    var stories = {
      agency: {
        label: 'A woman stops waiting to feel ready, sends her work, learns from the reply, and tries again',
        frames: [
          '<rect class="em-screen" x="145" y="58" width="460" height="238" rx="12"/><text class="em-screen-label" x="190" y="96">APPLICATION · DRAFT 11</text><path class="em-message-line" d="M190 128h330M190 158h280M190 188h350M190 218h245"/><rect class="em-result-mark" x="444" y="244" width="116" height="34" rx="17"/><text class="em-result-word" x="502" y="266">NOT SENT</text><g class="em-fig em-fig-hesitate"><circle class="em-head" cx="92" cy="228" r="21"/><path class="em-person" d="M92 249v55m-30 36 30-36 30 36"/><path class="em-person em-arm" d="M92 269l38 14"/></g><text x="375" y="345">Eleven nights. Eleven versions. Nothing sent.</text>',
          '<rect class="em-screen" x="155" y="62" width="440" height="230" rx="12"/><text class="em-screen-label" x="195" y="100">READY TO SEND</text><path class="em-message-line" d="M195 132h320M195 162h270M195 192h340"/><rect class="em-result-mark" x="425" y="226" width="130" height="42" rx="21"/><text class="em-result-word" x="490" y="252">SEND</text><path class="em-arrow" d="m356 260 42-22-11 18 18 8-7 13-18-9-6 20z"/><text x="375" y="345">Her hand shook. She sent it anyway.</text>',
          '<rect class="em-message" x="135" y="66" width="480" height="225" rx="12"/><text class="em-message-small" x="180" y="108">REPLY</text><path class="em-message-line" d="M180 138h355M180 170h310M180 202h350"/><rect class="em-result-mark" x="180" y="230" width="220" height="36" rx="18"/><text class="em-result-word" x="290" y="253">STRENGTHEN THE SAMPLE</text><text x="375" y="345">The no came with one useful sentence.</text>',
          '<path class="em-road" d="M80 270C210 270 255 110 375 110s165 160 295 160"/><circle class="em-attempt-old" cx="112" cy="270" r="24"/><circle class="em-attempt-next" cx="640" cy="270" r="30"/><path class="em-arrow" d="m624 270 13 12 22-28"/><g class="em-carry"><rect x="304" y="82" width="142" height="58" rx="8"/><text x="375" y="108">SAMPLE</text><text class="em-carry-word" x="375" y="131">rebuilt</text></g><text x="375" y="345">Six weeks later, the second application went through.</text>'
        ]
      },
      decision: {
        label: 'An urgent call interrupts dinner; a man protects the essentials, checks an assumption, and answers the next day',
        frames: [
          '<path class="em-message-line" d="M100 270h550M185 270v-98h380v98"/><g class="em-fig em-fig-held"><circle class="em-head" cx="300" cy="202" r="21"/><path class="em-person" d="M300 223v47m-30 47 30-47 30 47"/><path class="em-person em-arm" d="M300 244l45 15"/></g><path class="em-clock" d="M500 118a42 42 0 1 1-.1 0M500 130v27l20 12"/><rect class="em-result-mark" x="365" y="184" width="126" height="42" rx="21"/><text class="em-result-word" x="428" y="210">ANSWER TONIGHT</text><text x="375" y="345">Dinner went cold while the room waited.</text>',
          '<rect class="em-note" x="155" y="48" width="440" height="262" rx="9"/><text class="em-note-title" x="195" y="88">WHAT MUST SURVIVE</text><path class="em-note-rule" d="M195 112h355M195 170h355M195 228h355M195 286h355"/><text class="em-note-key" x="210" y="148">payroll</text><text class="em-note-value" x="535" y="148">protect</text><text class="em-note-key" x="210" y="206">trust</text><text class="em-note-value" x="535" y="206">protect</text><text class="em-note-key" x="210" y="264">another attempt</text><text class="em-note-value" x="535" y="264">protect</text><text x="375" y="345">He read the three lines aloud before answering.</text>',
          '<rect class="em-message" x="108" y="85" width="210" height="150" rx="10"/><rect class="em-message" x="432" y="85" width="210" height="150" rx="10"/><text class="em-message-small" x="148" y="122">THE FORECAST</text><text class="em-screen-value" x="213" y="183">82%</text><text class="em-message-small" x="472" y="122">CUSTOMER SAID</text><text class="em-screen-value" x="537" y="183">31%</text><path class="em-arrow" d="M335 159h78m-17-15 17 15-17 15"/><text x="375" y="345">One call changed the number everyone had trusted.</text>',
          '<rect class="em-page" x="170" y="58" width="410" height="248" rx="9"/><text class="em-page-label" x="215" y="114">DECISION</text><path class="em-note-rule" d="M215 140h320M215 184h320M215 228h240"/><path class="em-arrow" d="m474 252 15 14 26-34"/><text x="375" y="345">He answered the next evening and named the risk aloud.</text>'
        ]
      },
      control: {
        label: 'A man waits in a hospital hallway, separates what he controls, and stays beside his father',
        frames: [
          '<path class="em-office" d="M70 296h610M110 296V70h530v226M110 150h530"/><rect class="em-message" x="265" y="92" width="220" height="58" rx="8"/><text class="em-result-word" x="375" y="127">PLEASE WAIT HERE</text><g class="em-fig em-fig-pace"><circle class="em-head" cx="220" cy="230" r="22"/><path class="em-person" d="M220 252l35 44m-35-44-20 44"/></g><path class="em-clock" d="M558 190a34 34 0 1 1-.1 0M558 201v21l14 9"/><text x="375" y="345">He walked the same twelve steps again and again.</text>',
          '<rect class="em-note" x="120" y="55" width="510" height="245" rx="8"/><path class="em-note-rule" d="M375 55v245M155 108h185M410 108h185"/><text class="em-note-title" x="170" y="89">NOT MINE</text><text class="em-note-title" x="425" y="89">MINE</text><text class="em-note-key" x="170" y="145">the diagnosis</text><text class="em-note-key" x="425" y="145">call my sister</text><text class="em-note-key" x="170" y="190">the wait</text><text class="em-note-key" x="425" y="190">bring coffee</text><text class="em-note-key" x="170" y="235">the doctor’s choice</text><text class="em-note-key" x="425" y="235">stay nearby</text><text x="375" y="345">The right column was short enough to do.</text>',
          '<path class="em-office" d="M115 295h520M165 295v-70h140v70M445 295v-70h140v70"/><path class="em-cup" d="M336 208h38v33c0 13-38 13-38 0zM374 216h13v16h-13"/><path class="em-cup" d="M392 208h38v33c0 13-38 13-38 0zM430 216h13v16h-13"/><g class="em-fig em-fig-stand"><circle class="em-head" cx="275" cy="166" r="22"/><path class="em-person" d="M275 188v60m-35 47 35-47 35 47"/><path class="em-person em-arm" d="M275 210l48 20"/></g><text x="375" y="345">He made the call and came back with two coffees.</text>',
          '<g class="em-fig em-fig-son"><circle class="em-head" cx="300" cy="160" r="23"/><path class="em-person" d="M300 183v78m-42 58 42-58 42 58"/><path class="em-person em-arm" d="M300 210l62 35"/></g><g class="em-fig em-fig-father"><circle class="em-head em-helper" cx="450" cy="175" r="23"/><path class="em-person em-helper" d="M450 198v63m-42 58 42-58 42 58"/><path class="em-person em-helper em-arm" d="M450 220l-88 25"/></g><path class="em-open-gate" d="M570 75v225h82"/><text x="375" y="345">He pulled the chair closer and took his father’s hand.</text>'
        ]
      },
      rapport: {
        label: 'A man stands apart at a crowded event, opens with something ordinary, finds a real conversation, and leaves early with one worth keeping',
        frames: [
          '<path class="em-room" d="M60 300h630M100 300V70h550v230M100 150h550"/><g class="em-clusters"><circle cx="300" cy="196" r="17"/><circle cx="346" cy="188" r="17"/><circle cx="324" cy="232" r="17"/><circle cx="470" cy="184" r="17"/><circle cx="516" cy="196" r="17"/><circle cx="498" cy="236" r="17"/><circle cx="600" cy="200" r="17"/><circle cx="642" cy="214" r="17"/></g><g class="em-fig em-fig-edge"><circle class="em-head" cx="150" cy="196" r="21"/><path class="em-person" d="M150 217v56m-28 40 28-40 28 40"/><path class="em-person em-arm" d="M150 236l-22 26"/></g><text x="375" y="345">The clever opening he rehearsed stayed in his pocket.</text>',
          '<g class="em-fig em-fig-say"><circle class="em-head" cx="270" cy="176" r="22"/><path class="em-person" d="M270 198v62m-32 46 32-46 32 46"/><path class="em-person em-arm" d="M270 220l40 16"/></g><g class="em-fig em-fig-hear"><circle class="em-head em-helper" cx="480" cy="176" r="22"/><path class="em-person em-helper" d="M480 198v62m-32 46 32-46 32 46"/><path class="em-person em-helper em-arm" d="M480 220l-40 16"/></g><rect class="em-message" x="298" y="72" width="154" height="52" rx="12"/><text class="em-result-word" x="375" y="104">HOW DO YOU KNOW THE HOST?</text><path class="em-thought-line" d="M330 128 292 152"/><text x="375" y="345">Unremarkable, and she answered it gladly.</text>',
          '<g class="em-fig em-fig-lean"><circle class="em-head" cx="300" cy="170" r="23"/><path class="em-person" d="M300 193v64m-34 50 34-50 34 50"/><path class="em-person em-arm" d="M300 216l58 22"/></g><g class="em-fig em-fig-lean2"><circle class="em-head em-helper" cx="452" cy="170" r="23"/><path class="em-person em-helper" d="M452 193v64m-34 50 34-50 34 50"/><path class="em-person em-helper em-arm" d="M452 216l-58 22"/></g><circle class="em-shared" cx="376" cy="238" r="15"/><rect class="em-result-mark" x="286" y="76" width="180" height="38" rx="19"/><text class="em-result-word" x="376" y="100">THE THIRD QUESTION</text><text x="375" y="345">Neither of them was performing any more.</text>',
          '<path class="em-open-gate" d="M604 78v224h74"/><g class="em-fig em-fig-away"><circle class="em-head" cx="512" cy="180" r="21"/><path class="em-person" d="M512 201v58m-26 44 26-44 30 44"/><path class="em-person em-arm" d="M512 222l34 12"/></g><g class="em-fig em-fig-kept"><circle class="em-head em-helper" cx="196" cy="184" r="21"/><path class="em-person em-helper" d="M196 205v58m-26 44 26-44 26 44"/><path class="em-person em-helper em-arm" d="M196 226l30 14"/></g><path class="em-keep" d="M232 236C300 250 400 246 478 224"/><g class="em-carry"><rect x="300" y="86" width="152" height="56" rx="8"/><text x="376" y="111">KEEP</text><text class="em-carry-word" x="376" y="133">one name</text></g><text x="375" y="345">Home early, with someone he actually wanted to write to.</text>'
        ]
      },
      /* Eight drawings for /about/. A single signal line changes meaning across the
         story: route, model trace, missing boundary, and finally a deliberate stop. */
      curiosity: {
        label: 'A result that does not fit is explained away, then checked against three rival explanations until one survives',
        frames: [
          '<rect class="em-screen" x="140" y="52" width="470" height="212" rx="10"/><text class="em-screen-label" x="375" y="88">WEEKLY RESULT</text><path class="em-note-rule" d="M176 232h398"/><path class="em-road" d="M176 200h398"/><circle class="em-attempt-old" cx="232" cy="200" r="9"/><circle class="em-attempt-old" cx="310" cy="200" r="9"/><circle class="em-attempt-next" cx="388" cy="134" r="13"/><circle class="em-attempt-old" cx="466" cy="200" r="9"/><circle class="em-attempt-old" cx="544" cy="200" r="9"/><path class="em-thought-line" d="M388 149v40"/><text class="em-attempt-label" x="388" y="116">this one</text><g class="em-fig em-fig-notice"><circle class="em-head" cx="70" cy="152" r="21"/><path class="em-person" d="M70 173v58m-26 42 26-42 26 42M70 194l46 8"/></g><text x="375" y="344">She wrote it down instead of moving on.</text>',
          '<circle class="em-attempt-next" cx="118" cy="176" r="32"/><text class="em-attempt-label" x="118" y="244">the number</text><path class="em-pull" d="M156 158c78-28 108-44 166-52M156 176h166M156 194c78 28 108 44 166 52"/><g class="em-load"><rect x="326" y="80" width="330" height="52" rx="7"/><text x="491" y="112">the tidy story</text><rect x="326" y="150" width="330" height="52" rx="7"/><text x="491" y="182">a second story</text><rect x="326" y="220" width="330" height="52" rx="7"/><text x="491" y="252">a third story</text></g><text x="375" y="344">Three explanations fitted the number equally well.</text>',
          '<rect class="em-note" x="96" y="46" width="558" height="240" rx="9"/><text class="em-note-title" x="136" y="84">IF I CHECK LAST MONTH</text><path class="em-note-rule" d="M136 106h478M136 166h478M136 226h478"/><text class="em-note-key" x="150" y="142">the tidy story</text><text class="em-note-value" x="600" y="142">says higher</text><text class="em-note-key" x="150" y="202">a second story</text><text class="em-note-value" x="600" y="202">says flat</text><text class="em-note-key" x="150" y="262">a third story</text><text class="em-note-value" x="600" y="262">says lower</text><text x="375" y="344">One question the three could not agree on.</text>',
          '<g class="em-fig em-fig-report"><circle class="em-head" cx="148" cy="158" r="23"/><path class="em-person" d="M148 181v70m-34 54 34-54 34 54M148 206l52 20"/></g><rect class="em-message" x="252" y="62" width="426" height="152" rx="12"/><text class="em-message-small" x="465" y="102">WHAT SHE SAID</text><rect class="em-result-mark" x="292" y="128" width="346" height="48" rx="20"/><text class="em-result-word" x="465" y="158">MY EXPLANATION WAS THE WRONG ONE</text><path class="em-thought-line" d="M252 146 202 174"/><g class="em-carry"><rect x="292" y="236" width="346" height="58" rx="8"/><text x="465" y="262">KEPT</text><text class="em-carry-word" x="465" y="284">the one that survived the check</text></g><text x="375" y="344">She reported the result that ruled out her guess.</text>'
        ]
      },
      record: {
        label: 'Vicky begins with experiments at home, builds systems that affect millions of people, and decides to work on AI that can admit uncertainty',
        frames: [
          '<rect class="em-screen" x="98" y="56" width="410" height="242" rx="14"/><text class="em-screen-label" x="303" y="92">MODEL OUTPUT</text><path class="em-note-rule" d="M136 116h334M136 154h260M136 192h304"/><path class="em-road" d="M136 260l52-42 44 22 56-74 58 38 62-56"/><g class="em-fig em-fig-edge"><circle class="em-head" cx="612" cy="176" r="23"/><path class="em-person" d="M612 199v68m-36 52 36-52 36 52"/><path class="em-person em-arm" d="M612 224l-62 12"/></g><path class="em-pull" d="M508 188C548 192 560 214 574 228"/><text x="375" y="344">At first, his work never left the screen.</text>',
          '<g class="em-load"><rect x="52" y="60" width="178" height="48" rx="7"/><text x="141" y="89">phone service</text><rect x="286" y="60" width="178" height="48" rx="7"/><text x="375" y="89">remote health</text><rect x="520" y="60" width="178" height="48" rx="7"/><text x="609" y="89">ride demand</text></g><path class="em-road" d="M141 108C188 204 278 216 375 108C472 216 562 204 609 108"/><circle class="em-attempt-next" cx="375" cy="194" r="18"/><path class="em-arrow" d="M375 212v72m-14-18 14 18 14-18"/><rect class="em-result-mark" x="264" y="284" width="222" height="38" rx="19"/><text class="em-result-word" x="375" y="308">PUBLIC PLANNING</text><text x="375" y="344">A weekend project reached a city planning team.</text>',
          '<path class="em-door" d="M104 292V68h210v224M104 68h210"/><circle class="em-knob" cx="278" cy="184" r="5"/><g class="em-fig em-fig-stand"><circle class="em-head" cx="208" cy="170" r="22"/><path class="em-person" d="M208 192v66m-34 50 34-50 34 50M208 216l48 10"/></g><path class="em-arrow" d="M336 180h84m-18-14 18 14-18 14"/><rect class="em-screen" x="446" y="82" width="236" height="176" rx="10"/><text class="em-screen-label" x="564" y="116">CITY FORECAST</text><text class="em-screen-value" x="564" y="170">10M+</text><path class="em-road" d="M478 224l42-36 34 18 38-56 58 40"/><text x="375" y="344">More than 10M people lived with those decisions.</text>',
          '<rect class="em-note" x="70" y="58" width="330" height="232" rx="10"/><text class="em-note-title" x="108" y="94">IDENTITY CHECK</text><path class="em-note-rule" d="M108 120h254M108 174h254M108 228h254"/><text class="em-screen-value" x="235" y="212">1M+</text><path class="em-arrow" d="M420 170h74m-18-14 18 14-18 14"/><g class="em-fig em-fig-holder"><circle class="em-head" cx="608" cy="126" r="23"/><path class="em-person" d="M608 149v74m-38 56 38-56 38 56M608 176l-46 18"/></g><path class="em-keep" d="M494 194C530 210 558 210 584 194"/><text x="375" y="344">Busy days brought more than 1M identity checks.</text>',
          '<g class="em-load"><rect x="56" y="70" width="158" height="44" rx="7"/><text x="135" y="98">familiar pictures</text><rect x="56" y="138" width="158" height="44" rx="7"/><text x="135" y="166">new satellite</text><rect x="56" y="206" width="158" height="44" rx="7"/><text x="135" y="234">6× sharper</text></g><path class="em-pull" d="M214 92C284 106 306 132 338 154M214 160h124M214 228C284 214 306 188 338 166"/><rect class="em-screen" x="356" y="76" width="330" height="202" rx="10"/><text class="em-screen-label" x="521" y="110">FLOOD MAP</text><path class="em-road" d="M386 240c48-48 80 12 126-28s86 24 144-34"/><path class="em-boundary" d="M564 130v128"/><text x="375" y="344">The tool found floods in pictures it had never seen.</text>',
          '<g class="em-clusters"><circle cx="94" cy="104" r="14"/><circle cx="142" cy="82" r="14"/><circle cx="186" cy="120" r="14"/><circle cx="114" cy="166" r="14"/><circle cx="174" cy="188" r="14"/><circle cx="118" cy="236" r="14"/><circle cx="208" cy="248" r="14"/></g><path class="em-pull" d="M228 112C290 128 316 146 344 166M228 202C290 196 316 184 344 174"/><path class="em-road" d="M366 94c34 22 62-14 94 8s54-8 90 14 72-10 120 14M366 166c44-18 70 14 110-2s74 18 112 0 52 8 82 0M366 238c38-20 70 12 108-4s68 16 106-2 58 12 90-2"/><rect class="em-result-mark" x="276" y="282" width="284" height="40" rx="20"/><text class="em-result-word" x="418" y="307">1.28M IMAGES CHECKED</text><text x="375" y="344">Vicky worked through 1.28M images from the region.</text>',
          '<rect class="em-screen" x="62" y="58" width="220" height="154" rx="9"/><text class="em-screen-label" x="172" y="90">IMAGE</text><path class="em-road" d="M86 184l46-44 34 28 38-54 52 70"/><rect class="em-message" x="62" y="232" width="220" height="64" rx="9"/><text class="em-result-word" x="172" y="270">FALSE CAPTION</text><path class="em-broken" d="M302 150l54 54m0-54-54 54"/><path class="em-arrow" d="M380 178h70m-18-14 18 14-18 14"/><rect class="em-note" x="472" y="96" width="226" height="158" rx="12"/><text class="em-screen-value" x="585" y="158">81%</text><text class="em-result-word" x="585" y="192">WRONG CAPTION</text><text class="em-result-word" x="585" y="216">CHOSEN</text><text x="375" y="344">The model saw the image and repeated the false caption.</text>',
          '<path class="em-road" d="M62 180h250"/><circle class="em-attempt-old" cx="112" cy="180" r="13"/><circle class="em-attempt-old" cx="182" cy="180" r="13"/><circle class="em-attempt-old" cx="252" cy="180" r="13"/><path class="em-broken" d="M336 112v136"/><rect class="em-result-mark" x="384" y="72" width="292" height="68" rx="18"/><text class="em-result-word" x="530" y="113">STOP · ASK · REVIEW</text><path class="em-open-gate" d="M384 166h292M530 166v116"/><g class="em-fig em-fig-stand"><circle class="em-head" cx="530" cy="224" r="20"/><path class="em-person" d="M530 244v52m-30 38 30-38 30 38"/></g><g class="em-clusters"><circle cx="420" cy="252" r="12"/><circle cx="640" cy="252" r="12"/></g><text x="375" y="344">If the answer is uncertain, a person should decide.</text>'
        ]
      },
      uncertainty: {
        label: 'A woman checks the same message through the night, puts down her phone, and asks one useful question in the morning',
        frames: [
          '<rect class="em-screen" x="260" y="48" width="230" height="270" rx="24"/><text class="em-screen-label" x="375" y="84">2:13 AM</text><rect class="em-message" x="285" y="112" width="180" height="82" rx="10"/><path class="em-message-line" d="M307 137h136M307 162h102"/><g class="em-fig em-fig-check"><circle class="em-head" cx="152" cy="226" r="22"/><path class="em-person" d="M152 248v53m-32 39 32-39 32 39"/><path class="em-person em-arm" d="M152 266l73 4"/></g><text x="375" y="345">She opened the same message again.</text>',
          '<g class="em-requests"><rect x="82" y="62" width="180" height="42" rx="7"/><rect x="486" y="65" width="180" height="42" rx="7"/><rect x="62" y="145" width="180" height="42" rx="7"/><rect x="508" y="150" width="180" height="42" rx="7"/><rect x="96" y="235" width="180" height="42" rx="7"/><rect x="474" y="238" width="180" height="42" rx="7"/></g><g class="em-fig em-fig-swamped"><circle class="em-head" cx="375" cy="170" r="25"/><path class="em-person" d="M375 195v72m-40 58 40-58 40 58"/><path class="em-person em-arm em-arm-l" d="M375 220l-50 30"/><path class="em-person em-arm em-arm-r" d="M375 220l50 30"/></g><text class="em-screen-value" x="375" y="115">14</text><text x="375" y="345">Fourteen tabs gave her fourteen ways to worry.</text>',
          '<rect class="em-screen" x="90" y="90" width="116" height="160" rx="18"/><text class="em-screen-label" x="148" y="128">KITCHEN</text><path class="em-message-line" d="M112 160h72M112 188h72"/><path class="em-room" d="M320 285V105h330v180M320 214h330"/><g class="em-fig em-fig-restless"><circle class="em-head" cx="468" cy="220" r="21"/><path class="em-person" d="M468 242l35 43m-35-43-20 43"/></g><path class="em-thought-line" d="M206 171C285 171 310 212 430 220"/><text x="375" y="345">The doubt followed her. The phone stayed in the kitchen.</text>',
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
    var thread = null;
    if (sceneKey === 'record') {
      var threadGroup = svgEl('g', { class: 'em-record-thread', 'aria-hidden': 'true' });
      var threadBase = svgEl('path', { class: 'em-record-thread-base', d: 'M54 30H696', pathLength: '1' });
      var threadProgress = svgEl('path', { class: 'em-record-thread-progress', d: 'M54 30H696', pathLength: '1' });
      threadGroup.appendChild(threadBase);
      threadGroup.appendChild(threadProgress);
      var threadStops = [];
      for (var stopIndex = 0; stopIndex < 8; stopIndex += 1) {
        var stop = svgEl('circle', { class: 'em-record-thread-stop', cx: 54 + stopIndex * (642 / 7), cy: 30, r: 4.5 });
        threadStops.push(stop);
        threadGroup.appendChild(stop);
      }
      var threadRunner = svgEl('circle', { class: 'em-record-thread-runner', cx: 54, cy: 30, r: 7 });
      threadGroup.appendChild(threadRunner);
      svg.appendChild(threadGroup);
      thread = { progress: threadProgress, runner: threadRunner, stops: threadStops };
    }
    canvas.appendChild(svg);
    return { canvas: canvas, svg: svg, frames: frames, nodes: [], edges: [], thread: thread };
  }

  var host = el('section', 'em-story');
  host.setAttribute('aria-label', scene.kicker);
  var pin = el('div', 'em-pin');
  var copy = el('div', 'em-copy');
  copy.appendChild(el('span', 'em-kicker', scene.kicker));
  copy.appendChild(el('h2', '', scene.title));
  copy.appendChild(el('p', '', scene.copy));
  // scene.steps sets how many beats there are, and nothing on screen prints it.
  // A labelled four-up rail and then a bare "01 / 04" counter both used to sit
  // here, and each gave away the shape or the length of the story on arrival.
  var count = scene.steps.length;
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

  // An unlabelled scrubber replaces that rail. The reader still needs to know how
  // much of a four-screen pinned section is left; they do not need it spoiled.
  var track = el('div', 'em-track'); track.appendChild(el('i')); pin.appendChild(track);
  var skip = el('button', 'em-skip', 'Skip scene ↓'); skip.type = 'button'; pin.appendChild(skip);
  host.appendChild(pin);

  /*
    Twelve writings put the scene after their own hero, which the two lookups below
    find on their own. /about/ needs it deeper than that: the hero is nested inside
    <article class="about-story">, and the scene has to land before that article's
    sticky section nav, or the nav stays pinned over the whole interlude. A page can
    therefore mark the spot itself with an empty [data-scene-slot], and the scene
    takes its place.
  */
  var slot = document.querySelector('[data-scene-slot]');
  if (slot && slot.parentNode) {
    slot.parentNode.replaceChild(host, slot);
  } else {
    var anchor = root.querySelector(':scope > [class*="-hero"]') || Array.prototype.find.call(root.children, function (child) { return child.matches && child.matches('header, section'); });
    if (anchor && anchor.nextSibling) root.insertBefore(host, anchor.nextSibling); else root.appendChild(host);
  }

  // The pin holds for one screen per beat, so the section has to be as tall as the
  // story is long. Every height in the stylesheet is a multiple of this.
  host.style.setProperty('--em-beats', count);

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll spent settling into the pin before the first beat, and holding the last
  // beat before the scene releases. Without these the sequence opened already in
  // motion and cut away mid-beat, which is most of why it read as hurried.
  var LEAD = 0.09, TAIL = 0.09;

  /*
    Two numbers, both in beats rather than seconds, because everything here is a
    position on the scroll rather than a moment in time.

    XFADE is how long a pair of frames overlaps. Each frame's opacity is a ramp
    centred on its own beat and half a beat wider on each side, so on a boundary
    both land on exactly 0.5 and the canvas never blinks empty between beats. The
    old code toggled a class and let a CSS transition run, which meant the dissolve
    played at its own speed regardless of how fast you were scrolling, and reversed
    into itself if you scrubbed back.

    WORDS is the same idea for the copy. It dips to nothing exactly on the boundary,
    which is the frame where the text is swapped, so the swap happens behind a fade
    it is already committed to rather than as a visible jump.
  */
  var XFADE = 0.34, WORDS = 0.17, CAPTION = 0.13;
  var lastStage = -1, target = 0, eased = 0, queued = false, last = 0;

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(v) { return v * v * (3 - 2 * v); }

  // The scene is 100vw and pulls itself back out to the left edge, so it has to
  // measure the column it actually sits in. That is .page-content on the writings
  // and the narrower .about-story article on /about/.
  function alignToViewport() {
    var column = host.parentElement || root;
    host.style.setProperty('--em-gutter', column.getBoundingClientRect().left.toFixed(2) + 'px');
  }
  function measure() {
    var rect = host.getBoundingClientRect();
    var span = Math.max(1, host.offsetHeight - innerHeight);
    var raw = reduced ? 1 : clamp01(-rect.top / span);
    target = clamp01((raw - LEAD) / (1 - LEAD - TAIL));
  }
  function render(p) {
    host.style.setProperty('--em-p', p.toFixed(4));
    host.style.setProperty('--em-x', (20 + p * 55).toFixed(2) + '%');

    var scaled = p * count;
    var stage = Math.min(count - 1, Math.floor(scaled));

    if (narrative) {
      var reach = 0.5 + XFADE / 2;
      narrative.frames.forEach(function (frame, index) {
        var centre = index + 0.5;
        // The outer half of the first and last beats has nothing to dissolve with,
        // so those two hold at full instead of opening and closing on a half fade.
        var away = (index === 0 && scaled < centre) || (index === count - 1 && scaled > centre)
          ? 0 : Math.abs(scaled - centre);
        frame.style.opacity = smooth(clamp01((reach - away) / XFADE)).toFixed(4);
        // Drawings may overlap through the handover; their captions may not. Two
        // sentences at half opacity on top of each other are unreadable, and since
        // this fade tracks scroll rather than time, stopping on a boundary used to
        // leave them stacked indefinitely. Text is gone by the boundary instead.
        frame.style.setProperty('--em-cap', smooth(clamp01((0.5 - away) / CAPTION)).toFixed(4));
      });
      if (narrative.thread) {
        narrative.thread.progress.style.strokeDashoffset = (1 - p).toFixed(4);
        narrative.thread.runner.setAttribute('cx', (54 + p * 642).toFixed(2));
        narrative.thread.stops.forEach(function (stop, index) {
          var reached = p >= index / (narrative.thread.stops.length - 1);
          stop.classList.toggle('is-reached', reached);
        });
      }
    }

    // Hold the opening beat's words in place instead of fading them up from nothing:
    // the lead-in keeps p at 0 for most of a screen, and the column would sit empty.
    var into = stage === 0 ? 1 : clamp01((scaled - stage) / WORDS);
    var out = stage === count - 1 ? 1 : clamp01((stage + 1 - scaled) / WORDS);
    var k = smooth(Math.min(into, out));
    copy.style.opacity = k.toFixed(3);
    copy.style.transform = 'translateY(' + ((1 - k) * 0.8).toFixed(3) + 'rem)';

    if (stage !== lastStage) {
      lastStage = stage;
      if (scene.frames) {
        copy.querySelector('.em-kicker').textContent = scene.frames[stage][0];
        copy.querySelector('h2').textContent = scene.frames[stage][1];
        copy.querySelector('p').textContent = scene.frames[stage][2];
      }
      // The class no longer carries the fade, only which figure animations run.
      if (narrative) narrative.frames.forEach(function (frame, index) { frame.classList.toggle('is-active', index === stage); });
    }
    nodes.forEach(function (node, index) { var local = smooth(clamp01((p - index * .22) * 4)); node.style.opacity = (.12 + local * .88).toFixed(3); node.style.transform = 'scale(' + (.72 + local * .28).toFixed(3) + ')'; });
    edges.forEach(function (edge, index) { var local = smooth(clamp01((p - index * .24) * 3.2)); edge.style.strokeDashoffset = (1 - local).toFixed(3); });
  }

  /*
    The scene follows the scroll rather than snapping to it. A wheel notch moves the
    target instantly; the value actually drawn chases it down, so a flick reads as
    one continuous move and a scrub back reverses without a seam.

    The follow is exponential and framed as "fraction of the gap still left after a
    full second", so it settles in the same wall-clock time at 60Hz and at 120Hz
    instead of running twice as fast on a ProMotion display. dt is capped so a
    backgrounded tab does not resume with a single enormous jump.
  */
  function tick(now) {
    queued = false;
    measure();
    if (reduced) { eased = target; render(eased); return; }
    var dt = last ? Math.min(0.064, (now - last) / 1000) : 0.016;
    last = now;
    eased += (target - eased) * (1 - Math.pow(0.0016, dt));
    if (Math.abs(target - eased) < 0.00008) { eased = target; last = 0; render(eased); return; }
    render(eased);
    request();
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(tick); } }

  skip.addEventListener('click', function () { host.scrollIntoView({ block: 'end', behavior: reduced ? 'auto' : 'smooth' }); });
  function resize() { alignToViewport(); measure(); eased = target; last = 0; render(eased); }
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', resize);
  alignToViewport(); measure(); eased = target; render(eased);
})();
