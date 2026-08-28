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
        ['He asked for 48 hours', 'He tested the weakest assumption.', 'One customer call exposed the number everyone else had treated as certain.'],
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
      title: 'The room was already mid-conversation.',
      copy: 'He had rehearsed something clever on the way over. Standing there, none of it seemed worth saying out loud.',
      steps: ['Edge', 'Open', 'Land', 'Leave'],
      frames: [
        ['He stood at the edge of the room', 'The room was already mid-conversation.', 'He had rehearsed something clever on the way over. Standing there, none of it seemed worth saying out loud.'],
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
      cinematic: true,
      kicker: 'Vicky Feliren',
      title: 'I build AI systems and lead research beyond the lab.',
      copy: 'I have published 7 peer-reviewed papers, hold 1 patent, and received 12 awards and scholarships. For 5+ years, I have built AI across finance, retail, public services, agriculture, and energy, including work for Fortune 500 companies and international research teams.',
      steps: ['Record', 'Built from zero', 'Banking AI systems', 'Published research', 'Southeast Asian data', 'Recognition', 'Leadership'],
      highlights: [
        // The four figures here are already stated in the stat strip directly above
        // the scene, and at six marks the emphasis stopped sorting the sentence.
        // What is left is the part the strip does not say.
        ['finance, retail, public services, agriculture, and energy', 'Fortune 500 companies'],
        ['forecasts and shared tools'],
        ['more than 1M logins', '99.99%'],
        ['top-ranked journal', '7 papers', '109 languages'],
        ['11 languages', 'More than 50 researchers across 5 countries'],
        ['12 awards and scholarships'],
        ['review scientific papers', 'more than 50 technical projects']],
      frames: [
        ['Vicky Feliren', 'I build AI systems and lead research beyond the lab.', 'I have published 7 peer-reviewed papers, hold 1 patent, and received 12 awards and scholarships. For 5+ years, I have built AI across finance, retail, public services, agriculture, and energy, including work for Fortune 500 companies and international research teams.'],
        ['Built from zero', 'I built the AI systems behind work in 6 Asia-Pacific markets.', 'I handled the technical work alone at first. I built the forecasts and shared tools that later hires could keep using.'],
        ['Banking AI systems', 'I led engineering for banking AI handling 1M+ checks a day.', 'On the busiest days, the AI systems checked more than 1M logins. I kept them available 99.99% of the time and made sure staff could trace every decision during an audit.'],
        ['Published research', 'A flood AI model I designed beat 6 established AI systems.', 'I led the paper in a top-ranked journal. My 7 papers study floods, mining, how AI represents culture, and how computers identify 109 languages online.'],
        ['Southeast Asian data', 'I built the AI system that cleaned 1.28M images for research.', 'The finished collection covers 11 languages. More than 50 researchers across 5 countries contributed images, and my AI system removed duplicates and unusable files.'],
        ['Recognition', 'My work has won twice in Asia-Pacific and placed in the global top 3.', 'Judges have recognised my work in ride demand, remote health, climate research, community access, and AI safety. These projects received 12 awards and scholarships.'],
        ['Leadership', 'I hold 1 patent and have taught or reviewed work from 1,000+ students.', 'I also review scientific papers and have evaluated more than 50 technical projects. I look for sound methods, clear evidence, and decisions the team can defend.']]
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
  function setHighlightedText(node, value, terms) {
    node.textContent = '';
    var rest = value;
    var matches = terms || [];
    while (rest) {
      var nextTerm = '';
      var nextIndex = rest.length;
      matches.forEach(function (term) {
        var index = rest.indexOf(term);
        if (index !== -1 && index < nextIndex) {
          nextTerm = term;
          nextIndex = index;
        }
      });
      if (!nextTerm) {
        node.appendChild(document.createTextNode(rest));
        break;
      }
      if (nextIndex) node.appendChild(document.createTextNode(rest.slice(0, nextIndex)));
      node.appendChild(el('span', 'em-highlight', nextTerm));
      rest = rest.slice(nextIndex + nextTerm.length);
    }
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
    build.innerHTML = '<path class="em-ravine" d="M45 276h170l55 35m435-35H535l-55 35"/><g class="em-bridge"><g class="em-plank"><rect x="205" y="238" width="85" height="24"/><text class="em-bridge-word" x="248" y="255">boundary</text></g><g class="em-plank"><rect x="292" y="222" width="85" height="24"/><text class="em-bridge-word" x="334" y="239">method</text></g><g class="em-plank"><rect x="379" y="222" width="85" height="24"/><text class="em-bridge-word" x="421" y="239">courage</text></g><g class="em-plank"><rect x="466" y="238" width="85" height="24"/><text class="em-bridge-word" x="508" y="255">care</text></g></g><g class="em-fig em-fig-builder"><circle class="em-head" cx="160" cy="185" r="21"/><path class="em-person" d="M160 206v55m-30 42 30-42 30 42M160 225l36 20"/></g><g class="em-fig em-fig-crosser"><circle class="em-head em-helper" cx="605" cy="185" r="21"/><path class="em-person em-helper" d="M605 206v55m-30 42 30-42 30 42M605 225l-36 20"/></g><text x="375" y="345">What they built could carry someone else, too.</text>';
    svg.appendChild(build);
    canvas.appendChild(svg);
    return { canvas: canvas, svg: svg, frames: [hurt, shelter, name, build], nodes: [], edges: [] };
  }

  function buildEmotionalNarrativeCanvas(canvas, svg, sceneKey) {
    var stories = {
      agency: {
        label: 'A woman stops waiting to feel ready, sends her work, learns from the reply, and tries again',
        frames: [
          '<rect class="em-screen" x="145" y="58" width="460" height="238" rx="12"/><text class="em-screen-label" x="270" y="96">APPLICATION · DRAFT 11</text><path class="em-message-line" d="M190 128h330M190 158h280M190 188h350M190 218h245"/><rect class="em-result-mark" x="444" y="244" width="116" height="34" rx="17"/><text class="em-result-word" x="502" y="266">NOT SENT</text><g class="em-fig em-fig-hesitate"><circle class="em-head" cx="92" cy="228" r="21"/><path class="em-person" d="M92 249v55m-30 36 30-36 30 36"/><path class="em-person em-arm" d="M92 269l38 14"/></g><text x="375" y="345">Eleven nights. Eleven versions. Nothing sent.</text>',
          '<rect class="em-screen" x="155" y="62" width="440" height="230" rx="12"/><text class="em-screen-label" x="245" y="100">READY TO SEND</text><path class="em-message-line" d="M195 132h320M195 162h270M195 192h340"/><rect class="em-result-mark" x="425" y="226" width="130" height="42" rx="21"/><text class="em-result-word" x="490" y="252">SEND</text><path class="em-arrow" d="m356 260 42-22-11 18 18 8-7 13-18-9-6 20z"/><text x="375" y="345">Her hand shook. She sent it anyway.</text>',
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
          '<g class="em-fig em-fig-say"><circle class="em-head" cx="270" cy="176" r="22"/><path class="em-person" d="M270 198v62m-32 46 32-46 32 46"/><path class="em-person em-arm" d="M270 220l40 16"/></g><g class="em-fig em-fig-hear"><circle class="em-head em-helper" cx="480" cy="176" r="22"/><path class="em-person em-helper" d="M480 198v62m-32 46 32-46 32 46"/><path class="em-person em-helper em-arm" d="M480 220l-40 16"/></g><rect class="em-message" x="255" y="72" width="240" height="52" rx="12"/><text class="em-result-word" x="375" y="104">HOW DO YOU KNOW THE HOST?</text><path class="em-thought-line" d="M330 128 292 152"/><text x="375" y="345">Unremarkable, and she answered it gladly.</text>',
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
        label: 'Vicky’s record across published research, production systems, regional collaboration, awards, patents, and teaching',
        frames: [
          '<g class="em-vf-sketch"><g class="em-vf-breathe"><path class="em-vf-line em-vf-body" d="M239.5 315.0C240.6 314.2 245.7 311.5 246.2 310.0C246.8 308.5 243.1 308.2 242.9 306.1C242.7 303.9 244.1 299.0 245.1 297.1C246.1 295.3 247.5 297.0 249.0 294.9C250.5 292.8 251.5 288.0 254.1 284.8C256.6 281.6 256.0 280.5 264.4 275.6C272.9 270.7 296.1 259.0 304.7 255.4C313.4 251.9 312.4 256.0 316.5 254.3C320.5 252.6 326.5 248.0 329.1 245.1C331.6 242.2 331.5 239.7 331.9 236.7C332.2 233.7 333.2 232.0 331.3 227.2C329.4 222.3 322.9 212.4 320.7 207.6C318.4 202.7 320.1 202.2 317.9 198.1C315.6 194.0 310.0 188.9 307.2 183.0C304.4 177.0 301.8 166.6 301.1 162.3C300.3 157.9 301.6 158.2 302.8 156.7C303.9 155.2 307.1 156.3 307.8 153.3C308.6 150.3 307.9 143.4 307.2 138.8C306.6 134.1 304.4 129.9 303.9 125.3C303.4 120.8 303.2 115.7 304.4 111.3C305.7 106.9 308.0 103.5 311.2 99.0C314.3 94.6 317.0 89.5 323.2 84.7C329.4 80.0 341.2 73.6 348.4 70.8C355.6 68.0 362.5 68.0 366.3 68.0C370.1 68.0 369.0 70.2 371.3 70.8C373.7 71.3 377.1 70.4 380.3 71.3C383.5 72.2 385.6 73.1 390.4 76.4C395.1 79.6 404.3 86.4 408.5 90.6C412.8 94.9 414.0 98.4 415.8 101.8C417.6 105.3 418.7 104.3 419.2 111.3C419.6 118.3 417.4 137.7 418.6 143.8C419.8 149.9 424.8 145.4 426.5 147.7C428.1 150.0 428.8 152.9 428.7 157.8C428.6 162.6 427.1 172.3 425.9 176.8C424.7 181.3 423.0 182.7 421.4 184.6C419.8 186.6 417.9 186.4 416.4 188.6C414.9 190.7 413.4 192.9 412.5 197.5C411.5 202.1 410.5 211.7 410.8 216.0C411.1 220.3 412.5 220.0 414.1 223.3C415.8 226.5 417.9 232.9 420.6 235.3C423.2 237.7 426.3 235.6 430.1 237.5C433.9 239.5 440.2 245.6 443.5 247.0C446.9 248.4 443.7 244.9 450.2 245.9C456.8 247.0 474.9 250.5 482.7 253.2C490.5 255.9 493.9 260.5 497.2 262.2C500.6 263.8 500.2 261.4 502.8 263.3C505.5 265.2 510.4 269.9 513.2 273.6C516.0 277.4 518.2 281.6 519.9 285.9C521.6 290.3 522.8 294.3 523.3 299.9C523.7 305.5 522.8 316.3 522.7 319.5"/><path class="em-vf-line em-vf-hair" d="M416.1 155.8C415.1 151.6 413.2 137.5 410.2 130.4C407.3 123.2 401.8 116.8 398.5 113.0C395.2 109.2 395.4 109.1 390.4 107.7C385.3 106.2 372.6 105.6 368.0 104.3C363.3 103.0 364.3 99.4 362.4 99.9C360.4 100.3 361.3 105.5 356.2 107.1C351.1 108.7 336.5 108.7 331.6 109.4C326.6 110.0 328.3 110.0 326.6 111.1C324.8 112.1 322.7 113.8 321.2 115.8C319.8 117.8 318.6 119.6 317.9 123.1C317.1 126.5 316.9 134.3 316.8 136.5"/><path class="em-vf-line em-vf-face" d="M366.3 244.8C364.9 244.5 360.3 243.3 357.9 243.1C355.5 242.9 354.7 244.5 351.7 243.7C348.8 242.9 343.4 240.8 340.0 238.1C336.6 235.4 334.2 232.2 331.3 227.7C328.4 223.3 324.6 216.5 322.4 211.5C320.1 206.6 319.6 201.4 317.9 198.1C316.2 194.7 313.0 193.0 312.3 191.4C311.5 189.7 313.5 188.9 313.4 188.0C313.3 187.1 311.9 186.4 311.7 185.8C311.5 185.1 312.6 185.7 312.3 184.1C312.0 182.5 310.5 180.1 310.0 176.3C309.6 172.4 309.9 164.2 309.5 161.1C309.1 158.1 308.2 159.3 307.8 157.8C307.4 156.3 307.3 155.5 307.2 152.2C307.2 148.8 307.7 141.8 307.2 137.6C306.8 133.4 304.9 130.9 304.4 127.0C304.0 123.1 304.1 117.4 304.4 114.1C304.8 110.9 305.6 109.7 306.7 107.4C307.8 105.1 310.0 101.5 310.9 100.4C311.7 99.3 312.5 98.9 311.7 100.7C310.9 102.5 307.2 108.5 306.1 111.3C305.1 114.1 305.7 115.0 305.6 117.5C305.5 120.0 305.1 122.9 305.6 126.4C306.0 130.0 307.9 134.4 308.4 138.8C308.8 143.1 308.2 149.5 308.4 152.7C308.6 156.0 309.1 157.2 309.5 158.3C309.9 159.5 310.3 160.0 310.9 159.7C311.4 159.5 312.5 158.7 312.8 156.7C313.2 154.7 312.2 151.1 312.8 147.7C313.5 144.4 316.1 139.4 316.8 136.5C317.4 133.6 316.4 132.9 316.8 130.4C317.1 127.8 318.4 120.2 318.7 121.1C319.0 122.1 319.2 131.6 318.4 136.0C317.6 140.3 314.8 142.2 314.0 147.1C313.1 152.1 313.4 161.7 313.4 165.6C313.4 169.5 313.3 169.1 314.0 170.7C314.6 172.2 316.9 173.9 317.3 175.1C317.8 176.3 316.5 175.7 316.8 177.9C317.0 180.2 317.8 185.9 319.0 188.6C320.2 191.2 322.6 192.9 323.8 193.9C324.9 194.8 325.1 192.2 325.7 194.2C326.3 196.1 326.6 202.9 327.4 205.4C328.1 207.8 329.7 207.9 330.2 208.7C330.7 209.6 330.3 210.1 330.2 210.4C330.1 210.7 330.2 211.6 329.4 210.7C328.5 209.8 325.9 205.8 324.9 205.1C323.8 204.4 323.1 206.0 322.9 206.5C322.7 207.0 322.9 207.2 323.5 208.2C324.1 209.1 325.2 211.3 326.6 212.3C327.9 213.4 330.6 214.3 331.6 214.6C332.6 214.9 332.3 213.9 332.7 214.0C333.1 214.2 334.3 214.6 334.1 215.4C333.9 216.2 330.7 216.7 331.3 218.8C331.9 220.9 336.3 226.3 337.7 228.0C339.2 229.7 339.1 229.2 340.0 229.1C340.9 229.0 341.3 226.8 343.3 227.5C345.4 228.1 350.5 232.2 352.3 233.1C354.1 233.9 352.9 232.2 354.0 232.5C355.1 232.8 356.8 234.3 359.0 234.7C361.3 235.2 363.9 235.7 367.4 235.3C371.0 234.9 376.5 233.9 380.3 232.5C384.0 231.1 387.7 227.8 389.8 226.9C391.8 226.0 390.1 228.7 392.6 226.9C395.1 225.1 402.2 218.6 404.6 216.0C407.1 213.3 406.3 213.7 407.4 211.0C408.5 208.2 410.7 202.1 411.3 199.2C412.0 196.3 411.2 194.9 411.3 193.6C411.5 192.3 412.5 192.9 412.5 191.4C412.5 189.9 410.9 188.2 411.3 184.6C411.8 181.1 414.6 173.6 415.3 170.1C415.9 166.6 416.1 168.8 415.3 163.4C414.4 158.0 412.5 144.1 410.2 137.6C408.0 131.2 403.5 128.3 401.8 124.8C400.1 121.2 399.6 116.4 400.1 116.4C400.7 116.4 403.5 122.4 405.2 124.8C406.9 127.1 408.9 128.0 410.2 130.4C411.5 132.7 412.4 135.7 413.0 138.8C413.7 141.8 413.6 146.7 414.1 148.8C414.7 150.9 415.4 151.3 416.1 151.3C416.8 151.3 417.7 154.0 418.1 148.8C418.4 143.7 418.2 125.6 418.1 120.3C417.9 115.0 416.9 118.6 416.9 116.9C416.9 115.2 418.7 113.0 418.1 110.2C417.5 107.5 413.8 101.8 413.3 100.4C412.8 99.0 414.5 100.7 415.3 101.8C416.1 102.9 417.6 104.1 418.1 106.9C418.5 109.6 417.9 115.4 418.1 118.0C418.2 120.7 419.1 118.2 419.2 122.5C419.3 126.8 418.5 139.8 418.6 143.8C418.7 147.8 419.8 144.7 419.7 146.6C419.6 148.5 418.2 152.7 418.1 155.0C417.9 157.2 417.8 158.1 418.6 160.0C419.5 162.0 422.3 165.1 423.1 166.7C423.9 168.4 424.4 168.5 423.7 170.1C422.9 171.7 419.7 173.3 418.6 176.3C417.5 179.2 417.6 184.9 416.9 188.0C416.3 191.1 415.4 193.1 414.7 194.7C414.0 196.3 412.7 196.5 412.5 197.5C412.2 198.5 413.3 198.5 413.0 200.9C412.7 203.2 411.9 208.4 410.8 211.5C409.7 214.6 410.1 215.2 406.3 219.3C402.5 223.5 392.2 233.1 388.1 236.4C384.1 239.7 384.0 238.6 382.0 239.2C379.9 239.9 378.4 239.4 375.8 240.3C373.2 241.3 367.9 244.1 366.3 244.8C364.7 245.6 367.7 245.1 366.3 244.8Z"/><path class="em-vf-line em-vf-face" d="M432.9 262.7C432.0 262.3 429.1 260.5 427.9 260.5C426.6 260.5 426.6 262.3 425.6 262.7C424.6 263.1 422.2 264.4 421.7 262.7C421.2 261.1 424.1 255.3 422.5 252.9C421.0 250.5 414.0 249.8 412.5 248.4C411.0 247.1 413.8 246.8 413.6 245.1C413.4 243.4 412.6 240.1 411.3 238.4C410.1 236.7 406.6 236.6 406.3 235.0C406.0 233.4 408.9 231.7 409.7 228.9C410.5 226.0 410.6 219.6 411.1 217.9C411.5 216.3 410.9 215.8 412.5 218.8C414.0 221.8 418.3 233.0 420.6 235.9C422.9 238.7 424.8 235.7 426.2 235.9C427.6 236.0 427.9 236.3 429.0 237.0C430.0 237.6 431.3 239.2 432.3 239.8C433.4 240.3 434.4 239.9 435.1 240.3C435.8 240.8 436.6 241.5 436.5 242.3C436.4 243.1 436.0 245.2 434.6 245.4C433.1 245.5 429.5 243.2 427.9 243.1C426.2 243.1 425.1 244.1 424.8 245.1C424.4 246.1 425.8 247.6 425.9 249.0C426.0 250.4 425.2 252.5 425.3 253.5C425.4 254.5 426.5 254.2 426.5 255.2C426.4 256.1 424.8 258.2 424.8 259.1C424.7 260.0 424.5 260.7 426.2 260.5C427.8 260.2 433.0 258.0 434.6 257.7C436.1 257.4 435.4 257.8 435.4 258.5C435.5 259.2 435.3 261.2 434.8 261.9C434.4 262.6 433.2 262.6 432.9 262.7C432.6 262.9 433.7 263.1 432.9 262.7Z"/><path class="em-vf-line em-vf-face" d="M497.8 262.7C494.4 262.7 482.1 263.7 477.7 262.7C473.2 261.8 473.1 258.0 470.9 257.1C468.8 256.3 466.5 256.7 464.8 257.7C463.1 258.6 461.8 261.9 460.9 262.7C459.9 263.6 459.6 263.0 459.2 262.7C458.8 262.5 458.0 262.0 458.4 261.3C458.7 260.6 461.1 259.3 461.1 258.5C461.2 257.7 459.5 256.5 458.6 256.6C457.7 256.6 456.8 258.4 455.8 258.8C454.9 259.2 454.4 258.1 453.0 258.8C451.6 259.5 449.5 262.1 447.4 262.7C445.4 263.4 441.7 263.1 440.7 262.7C439.7 262.3 441.6 260.8 441.6 260.2C441.5 259.6 440.3 259.7 440.4 259.1C440.6 258.5 441.4 256.9 442.4 256.6C443.4 256.2 444.9 257.6 446.3 257.1C447.7 256.7 449.7 254.6 450.8 253.8C451.9 252.9 452.5 252.8 452.8 251.8C453.0 250.8 451.9 248.7 452.2 247.9C452.5 247.1 453.7 246.9 454.7 247.0C455.7 247.2 456.7 248.4 458.1 248.7C459.5 249.0 459.0 248.0 463.1 248.7C467.2 249.5 476.9 250.9 482.7 253.2C488.5 255.5 495.3 261.1 497.8 262.7C500.3 264.3 501.2 262.7 497.8 262.7Z"/><path class="em-vf-line em-vf-face" d="M389.2 187.2C388.7 187.0 387.3 187.1 385.9 186.0C384.5 185.0 382.0 181.8 380.8 181.0C379.7 180.2 380.3 180.4 379.2 181.0C378.0 181.6 376.5 183.4 374.1 184.4C371.7 185.3 368.2 186.2 364.6 186.6C361.1 187.0 355.7 187.3 352.9 186.6C350.0 186.0 348.7 183.1 347.3 182.7C345.9 182.3 345.1 184.6 344.5 184.4C343.9 184.1 343.5 182.4 343.6 181.3C343.8 180.2 344.5 178.8 345.3 177.9C346.1 177.0 347.8 175.8 348.4 176.0C348.9 176.2 348.3 178.2 348.7 179.0C349.0 179.9 349.2 180.8 350.6 181.0C352.1 181.2 355.6 180.2 357.3 180.4C359.1 180.7 359.9 182.3 361.3 182.7C362.6 183.1 363.9 183.0 365.2 182.7C366.5 182.4 367.5 181.3 369.1 181.0C370.7 180.7 373.5 181.2 374.7 181.0C375.8 180.8 375.8 180.5 376.1 179.6C376.4 178.7 376.3 176.4 376.6 175.7C377.0 175.0 375.9 173.9 378.0 175.4C380.2 176.9 387.5 182.8 389.5 184.6C391.5 186.5 390.1 185.9 390.1 186.3C390.0 186.7 389.4 187.0 389.2 187.2C389.1 187.3 389.8 187.4 389.2 187.2Z"/><path class="em-vf-line em-vf-face" d="M361.8 215.7C361.1 215.1 358.9 213.1 357.3 212.3C355.7 211.6 354.4 212.9 352.3 211.2C350.2 209.6 346.4 204.1 344.5 202.3C342.5 200.5 341.4 201.3 340.8 200.3C340.2 199.3 339.5 197.0 340.8 196.4C342.2 195.8 346.7 197.1 348.9 196.7C351.2 196.3 352.1 194.3 354.5 193.9C357.0 193.5 361.4 194.6 363.5 194.4C365.5 194.3 365.2 193.0 366.8 192.8C368.5 192.5 371.6 192.5 373.6 192.8C375.5 193.0 377.3 194.3 378.6 194.4C379.9 194.6 380.0 193.6 381.4 193.9C382.8 194.1 385.7 195.1 386.7 195.8C387.7 196.5 388.0 197.4 387.3 198.1C386.6 198.8 384.3 198.5 382.5 200.0C380.7 201.6 378.7 205.4 376.4 207.3C374.0 209.2 370.3 210.0 368.5 211.2C366.8 212.4 366.8 213.8 365.7 214.6C364.6 215.3 362.5 215.5 361.8 215.7C361.2 215.9 362.6 216.3 361.8 215.7Z"/><path class="em-vf-line em-vf-face" d="M339.4 262.7C338.8 262.5 336.4 261.9 335.8 261.3C335.2 260.7 336.4 260.2 335.8 259.1C335.2 258.0 333.2 255.1 332.1 254.9C331.1 254.7 330.1 256.8 329.6 258.0C329.2 259.1 329.5 261.1 329.4 261.6C329.2 262.1 329.2 260.9 328.8 261.0C328.4 261.2 328.8 262.5 327.1 262.7C325.4 263.0 319.6 262.8 318.4 262.4C317.3 262.1 319.7 261.9 320.1 260.8C320.5 259.6 320.0 256.9 320.7 255.7C321.3 254.5 323.2 254.6 324.0 253.5C324.9 252.4 324.9 250.3 325.7 249.0C326.6 247.7 328.3 247.2 329.1 245.6C329.8 244.1 329.7 240.8 330.2 239.5C330.7 238.1 331.6 237.3 332.1 237.5C332.7 237.7 333.1 238.5 333.5 240.6C334.0 242.7 333.7 246.4 334.7 250.1C335.6 253.8 338.6 260.6 339.4 262.7C340.2 264.8 340.0 263.0 339.4 262.7Z"/><path class="em-vf-line em-vf-face" d="M354.5 158.1C354.1 157.9 353.0 158.1 351.7 156.9C350.4 155.8 348.3 152.6 346.7 151.3C345.1 150.1 345.0 150.1 342.2 149.7C339.4 149.2 332.4 148.3 329.9 148.5C327.4 148.8 328.3 150.7 327.1 151.3C325.9 152.0 323.5 152.9 322.6 152.5C321.7 152.0 320.8 150.6 321.8 148.8C322.8 147.1 326.9 143.0 328.8 141.8C330.7 140.7 332.0 141.6 333.3 141.8C334.6 142.1 334.6 143.0 336.6 143.5C338.7 144.0 343.0 143.5 345.6 144.6C348.2 145.8 350.5 149.0 352.3 150.2C354.1 151.5 355.7 151.6 356.5 152.2C357.3 152.8 357.4 152.9 357.1 153.9C356.7 154.8 355.0 157.4 354.5 158.1C354.1 158.8 355.0 158.2 354.5 158.1Z"/><path class="em-vf-line em-vf-face" d="M373.6 148.5C372.9 148.5 370.4 148.8 369.6 148.5C368.9 148.3 368.6 148.1 368.8 147.1C369.0 146.2 367.6 144.8 370.8 143.0C373.9 141.1 384.1 137.4 387.6 136.2C391.0 135.1 390.1 136.0 391.5 136.2C392.9 136.5 394.6 137.4 396.0 137.9C397.3 138.5 398.4 138.9 399.3 139.6C400.2 140.3 401.1 141.2 401.3 142.1C401.5 143.0 402.1 145.2 400.4 145.2C398.8 145.1 394.1 142.2 391.5 141.8C388.9 141.5 387.7 141.8 384.8 143.0C381.8 144.1 375.4 147.6 373.6 148.5C371.7 149.5 374.2 148.5 373.6 148.5Z"/><path class="em-vf-line em-vf-face" d="M398.2 113.9C397.1 113.0 394.0 109.7 391.5 108.8C389.0 108.0 385.5 109.2 383.1 108.8C380.7 108.4 379.7 107.1 376.9 106.6C374.1 106.0 368.2 106.2 366.3 105.5C364.4 104.8 364.8 102.5 365.4 102.4C366.1 102.3 365.8 103.9 370.2 104.9C374.6 105.9 387.7 107.3 392.0 108.3C396.3 109.2 394.9 109.6 396.0 110.5C397.0 111.4 397.8 113.3 398.2 113.9C398.6 114.4 399.3 114.7 398.2 113.9Z"/><path class="em-vf-line em-vf-face" d="M342.2 110.5C340.4 110.4 329.3 110.1 331.3 109.7C333.4 109.2 350.4 108.1 354.5 107.7C358.7 107.3 355.4 108.0 356.2 107.1C357.1 106.3 358.6 103.1 359.6 102.7C360.6 102.2 362.2 103.6 362.1 104.6C362.0 105.6 360.0 107.9 359.0 108.8C358.0 109.7 358.5 109.8 356.2 109.9C354.0 110.0 347.9 109.3 345.6 109.4C343.2 109.5 342.8 110.3 342.2 110.5C341.7 110.7 344.0 110.6 342.2 110.5Z"/><path class="em-vf-line em-vf-face" d="M371.6 208.2C372.0 208.0 373.4 207.9 374.1 207.3C374.9 206.8 375.9 205.8 376.1 204.8C376.2 203.8 374.9 202.4 375.0 201.4C375.1 200.5 376.9 200.0 376.6 199.2C376.4 198.4 374.8 197.3 373.6 196.7C372.3 196.1 370.4 195.6 369.1 195.6C367.8 195.6 367.0 196.6 365.7 196.7C364.4 196.8 363.0 195.8 361.3 196.1C359.5 196.4 356.5 197.6 355.1 198.4C353.6 199.2 353.1 200.1 352.6 200.9C352.1 201.7 351.1 201.9 352.0 203.1C352.9 204.3 355.3 207.2 357.9 207.9C360.5 208.6 365.1 207.3 367.4 207.3C369.7 207.4 370.9 208.0 371.6 208.2C372.3 208.3 371.2 208.3 371.6 208.2Z"/><path class="em-vf-line em-vf-face" d="M328.2 162.5C327.7 162.5 325.5 163.0 324.9 162.5C324.3 162.1 323.8 161.0 324.6 160.0C325.3 159.1 325.7 157.5 329.4 156.9C333.0 156.3 343.4 156.2 346.7 156.4C350.0 156.6 349.0 157.5 349.2 158.3C349.4 159.2 348.3 160.9 347.8 161.4C347.3 161.9 346.8 161.8 346.1 161.4C345.5 161.0 344.8 159.1 343.9 159.2C343.0 159.3 342.6 161.6 340.5 162.0C338.5 162.4 333.6 161.3 331.6 161.4C329.5 161.5 328.8 162.4 328.2 162.5C327.7 162.7 328.8 162.5 328.2 162.5Z"/><path class="em-vf-line em-vf-face" d="M380.3 159.2C379.3 159.2 375.8 159.4 374.7 159.2C373.5 158.9 373.5 158.5 373.3 157.8C373.1 157.1 372.6 155.9 373.3 155.0C374.0 154.1 375.5 153.1 377.5 152.5C379.5 151.9 382.4 151.4 385.3 151.3C388.2 151.3 392.8 151.5 394.8 151.9C396.8 152.3 397.3 153.1 397.3 153.9C397.4 154.6 396.6 156.0 395.4 156.4C394.2 156.8 391.4 156.6 390.4 156.4C389.3 156.2 389.9 155.0 389.2 155.3C388.6 155.5 387.3 157.5 386.4 158.1C385.6 158.6 384.9 158.7 384.2 158.6C383.5 158.5 382.6 157.4 382.0 157.5C381.3 157.6 380.6 158.9 380.3 159.2C380.0 159.5 381.2 159.2 380.3 159.2Z"/><path class="em-vf-line em-vf-face" d="M390.9 256.0C390.5 255.9 388.6 255.8 388.4 255.2C388.2 254.6 386.8 255.5 389.5 252.4C392.3 249.2 402.7 238.3 404.9 236.4C407.1 234.5 404.0 239.6 402.9 241.2C401.9 242.7 400.0 243.6 398.5 245.6C397.0 247.7 395.3 251.8 394.0 253.5C392.7 255.2 391.4 255.6 390.9 256.0C390.4 256.4 391.3 256.1 390.9 256.0Z"/></g></g><text x="375" y="344">Vicky leads AI research across industry, public services, and international teams.</text>',
          '<rect class="em-note" x="58" y="72" width="214" height="202" rx="10"/><text class="em-note-title" x="88" y="108">BUILT FROM ZERO</text><path class="em-note-rule" d="M88 136h154M88 172h126M88 208h144"/><text class="em-result-word" x="165" y="246">ENGINEERING BASE</text><path class="em-arrow" d="M300 172h70m-16-14 16 14-16 14"/><rect class="em-screen" x="398" y="72" width="290" height="202" rx="12"/><text class="em-screen-label" x="543" y="108">DELIVERY SCOPE</text><text class="em-screen-value" x="543" y="162">6</text><text class="em-result-word" x="543" y="194">ASIA-PACIFIC MARKETS</text><text x="375" y="344">Later hires inherited the AI systems and practices Vicky built.</text>',
          '<g class="em-load"><rect x="62" y="74" width="214" height="52" rx="8"/><text x="169" y="106">BANK IDENTITY AI SYSTEMS</text><rect x="62" y="144" width="214" height="52" rx="8"/><text x="169" y="176">DECISIONS STAFF CAN CHECK</text><rect x="62" y="214" width="214" height="52" rx="8"/><text x="169" y="246">BUSY LOGIN PERIODS</text></g><path class="em-arrow" d="M304 170h72m-18-14 18 14-18 14"/><rect class="em-screen" x="406" y="72" width="282" height="194" rx="12"/><text class="em-screen-label" x="547" y="108">AI SYSTEM AVAILABILITY</text><text class="em-screen-value" x="547" y="168">99.99%</text><text class="em-result-word" x="547" y="205">1M+ CHECKS / DAY</text><text x="375" y="344">More than 1M identity checks passed through on the busiest days.</text>',
          '<g class="em-papers"><rect class="em-note" x="62" y="92" width="176" height="170" rx="8"/><text class="em-note-title" x="90" y="124">COMPUTER VISION</text><path class="em-note-rule" d="M90 148h118M90 178h92M90 208h108"/><rect class="em-note" x="262" y="64" width="226" height="198" rx="9"/><text class="em-note-title em-note-mid" x="375" y="100">FIRST AUTHOR · TOP VENUE</text><text class="em-screen-value" x="375" y="158">6</text><text class="em-result-word" x="375" y="190">AI SYSTEMS BEATEN</text><path class="em-road" d="M296 232c34-36 58 10 90-20s54 18 76-30"/><rect class="em-note" x="512" y="92" width="176" height="170" rx="8"/><text class="em-note-title" x="540" y="124">LANGUAGE</text><path class="em-note-rule" d="M540 148h118M540 178h92M540 208h108"/></g><rect class="em-result-mark" x="282" y="280" width="188" height="38" rx="19"/><text class="em-result-word" x="376" y="304">7 PEER-REVIEWED</text><text x="375" y="344">Vicky designed the flood AI model and led the paper.</text>',
          '<g class="em-clusters"><circle cx="96" cy="104" r="13"/><circle cx="142" cy="82" r="13"/><circle cx="184" cy="120" r="13"/><circle cx="112" cy="164" r="13"/><circle cx="168" cy="188" r="13"/><circle cx="118" cy="232" r="13"/><circle cx="204" cy="246" r="13"/></g><path class="em-pull" d="M228 112C286 126 312 144 340 164M228 202C286 194 312 182 340 172"/><rect class="em-screen" x="362" y="68" width="326" height="204" rx="12"/><text class="em-screen-label" x="525" y="104">SOUTHEAST ASIA</text><text class="em-screen-value" x="525" y="156">1.28M</text><text class="em-result-word" x="525" y="190">IMAGES · 11 LANGUAGES</text><text class="em-result-word" x="525" y="222">50+ RESEARCHERS · 5 COUNTRIES</text><text x="375" y="344">Vicky built the AI system that cleaned 1.28M images for research.</text>',
          '<path class="em-road" d="M76 258h598"/><g class="em-podium"><rect x="96" y="190" width="146" height="68" rx="8"/><text class="em-result-word" x="169" y="204">GLOBAL</text><text class="em-screen-value" x="169" y="244">TOP 3</text><rect x="276" y="104" width="198" height="154" rx="10"/><text class="em-result-word" x="375" y="138">REGIONAL</text><text class="em-screen-value" x="375" y="196">2× APAC</text><text class="em-result-word" x="375" y="226">WINNER</text><rect x="508" y="166" width="146" height="92" rx="8"/><text class="em-screen-value" x="581" y="206">12</text><text class="em-result-word" x="581" y="232">AWARDS &amp;</text><text class="em-result-word" x="581" y="248">SCHOLARSHIPS</text></g><text x="375" y="344">Judges recognised Vicky’s work in 5 fields.</text>',
          '<rect class="em-note" x="58" y="70" width="248" height="214" rx="10"/><text class="em-note-title" x="92" y="106">ISSUED PATENT</text><path class="em-note-rule" d="M92 132h180M92 168h146M92 204h170"/><rect class="em-result-mark" x="92" y="232" width="144" height="34" rx="17"/><text class="em-result-word" x="164" y="254">FORMALLY EXAMINED</text><path class="em-arrow" d="M330 174h64m-16-14 16 14-16 14"/><g class="em-review"><circle class="em-head" cx="516" cy="132" r="20"/><path class="em-person" d="M516 152v54m-30 42 30-42 30 42"/><rect class="em-screen" x="576" y="86" width="134" height="132" rx="8"/><text class="em-screen-value" x="643" y="140">1,000+</text><text class="em-result-word" x="643" y="172">STUDENTS</text></g><text x="375" y="344">Vicky teaches, reviews research, and judges technical work.</text>']
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
    /*
      `record` used to carry a progress thread here: a rule across the top of the
      canvas at y=30, with a stop per beat and a runner sliding along it. It was
      removed for being a second progress indicator sitting directly above the
      drawing, competing with it for the eye. `.em-track` under the pin already
      reports how far through the scene the reader is.

      Cropping the camera to what is left is what gives the drawings their size
      back. The eight frames occupy x 50..710 and y 64..364 of the shared 750x360
      box, so most of the top band was the thread's and the rest is margin. The
      rendered width does not change, which means a narrower viewBox is a bigger
      picture rather than a smaller one.

      Only `record` may do this. The box is shared with nine other narrative scenes,
      and `control`, `agency`, `consent` and `rapport` all position animations with
      `transform-box: view-box`, whose origin would move with it. Nothing in
      `record` does: its one transform rule is `fill-box`, which is element-relative
      and does not care. Content coordinates are untouched either way, so the acts,
      `getBBox()` and rippleFrom's origin all still refer to the same points.
    */
    if (sceneKey === 'record') svg.setAttribute('viewBox', '40 54 680 322');
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
  setHighlightedText(copy.querySelector('p'), scene.copy, scene.highlights && scene.highlights[0]);
  // scene.steps sets how many beats there are, and nothing on screen prints it.
  // A labelled four-up rail and then a bare "01 / 04" counter both used to sit
  // here, and each gave away the shape or the length of the story on arrival.
  var count = scene.steps.length;
  pin.appendChild(copy);

  // The three copy lines, animated individually on cinematic scenes and left alone
  // everywhere else, where .em-copy still fades as one block.
  var lines = scene.cinematic
    ? [copy.querySelector('.em-kicker'), copy.querySelector('h2'), copy.querySelector('p')]
    : null;

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
  var LEAD = 0.05, TAIL = 0.05;

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
  /*
    These are fractions of a beat, so they are also distances: a beat is about 2300px
    of scroll, and at 0.34 the handover took 660px of scrolling to bring a drawing up
    to full. That is what made the icons feel slow to appear. It is not the clock,
    which has them assembled in about a tenth of a second; it is that the fade they
    arrive behind was sized when a beat was a single screen. Cut to roughly a third,
    the drawing is up in ~300px and the beat still crosses at 0.5 opacity on the
    boundary, so the canvas never blinks empty between beats.
  */
  var XFADE = 0.15, WORDS = 0.08, CAPTION = 0.07;

  /*
    The shape of one beat, as fractions of it.

      0            arrive   the parts stagger in on the spring
      ARRIVE_END   act      the drawing performs its sentence
      ACT_END      hold     finished, full opacity, nothing moving but ambience
      0.83         dissolve handover to the next beat

    The hold no longer has to be budgeted for. It used to be the tail of a scroll
    distance, so an act that ran past 0.83 finished while the frame was already
    dissolving and the drawing was never seen whole. On the clock the hold is
    simply however long the reader stays, and the fractions below only have to
    divide the performance itself.

    Arrival is deliberately the smallest share. A drawing that takes its time
    assembling reads as slow rather than considered, and the parts arriving is the
    least interesting thing a beat does; the act is the part worth watching.
  */
  var ARRIVE_END = 0.22, ACT_START = 0.20, ACT_END = 0.66;
  var lastStage = -1, target = 0, eased = 0, queued = false, last = 0;

  /*
    The beat plays on a clock. The scroll only chooses which beat.

    Every move inside a beat used to be a function of scroll position, so a reader
    who stopped to read stopped the drawing with them: the only way to see a beat
    perform was to keep the wheel turning, and standing still left a half-built
    picture on screen. The beat shape above is now walked by BEAT_SECONDS of wall
    clock, started when the beat arrives. Scroll still picks the beat, cross-fades
    the pair and carries the copy out on the boundary, which is the part a reader
    expects to control.

    What this trades away is scrubbing. An act is no longer reversible by dragging
    backwards, because it is no longer a function of the scrollbar. Going back to a
    beat replays it from the start instead.

    The clock only runs while the scene is on screen, or the beats play out to an
    empty room and are over before anyone reaches them.

    It covers the performance, not the reading. Measured on these values a beat
    reads as assembled about a quarter of a second in, because the spring crosses
    full on its overshoot well before it settles, and stops moving about 1.25s
    after it starts; everything past ACT_END is idle time the loop winds down
    through. Lengthening this does not give the reader longer to look, because the
    hold runs until they scroll. It only makes the beat slower to say what it came
    to say.
  */
  var BEAT_SECONDS = 1.2;
  var beatT = 0, clockStage = -1, onScreen = true, pinHeld = false;
  // A beat already passed holds its finished state; one not yet reached shows
  // nothing, so the frame fading in underneath the current one is not a spoiler.
  function beatLocal(index, stage, auto) { return index < stage ? 1 : index > stage ? 0 : auto; }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(v) { return v * v * (3 - 2 * v); }
  /*
    Two eases the cinematic branch needs that smoothstep cannot give.

    outCubic decelerates hard at the end, which is what makes a line of copy look
    like it is arriving rather than sliding. outBack overshoots by about 6% before
    settling, the small elastic landing that reads as weight. Both are the standard
    curves; they are here rather than in a library because the scene has to stay
    self-contained.
  */
  function outCubic(v) { var f = 1 - v; return 1 - f * f * f; }
  function span(v, from, to) { return clamp01((v - from) / (to - from)); }

  /*
    anime.js's spring, solved rather than approximated.

    We cannot load the library: this scene is driven by scroll position, not by a
    clock, so what we need from anime.js is its maths rather than its timeline. Its
    createSpring integrates the damped harmonic oscillator, which is what gives the
    library its recognisable landing: a real overshoot that decays over two or three
    diminishing bounces, instead of the single fixed rebound a back ease produces.

      underdamped (zeta < 1):  x(t) = 1 - e^(-t·zeta·w0) · (cos(wd·t) + b·sin(wd·t))
      otherwise             :  x(t) = 1 - (1 + b·t) · e^(-t·w0)

    with w0 = sqrt(stiffness/mass), zeta = damping / 2·sqrt(stiffness·mass) and
    wd = w0·sqrt(1 - zeta²). anime.js then finds the settling time numerically and
    uses it as the tween's duration; here that same time is what the input 0..1 is
    scaled onto, so one full spring plays out across the scroll distance the beat
    is given. Scrubbing back runs the bounce backwards, which a timed tween cannot.
  */
  function spring(mass, stiffness, damping, velocity) {
    var w0 = Math.sqrt(stiffness / mass);
    var zeta = damping / (2 * Math.sqrt(stiffness * mass));
    var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
    var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;
    function solve(t) {
      if (zeta < 1) return 1 - Math.exp(-t * zeta * w0) * (Math.cos(wd * t) + b * Math.sin(wd * t));
      return 1 - (1 + b * t) * Math.exp(-t * w0);
    }
    // anime.js walks the solver forward until the value stays inside a rest
    // threshold, and calls that the duration. Same here, with a hard ceiling so a
    // badly chosen stiffness cannot spin.
    var rest = 0.0005, step = 1 / 60, settled = 0, t = 0;
    while (t < 40) {
      if (Math.abs(1 - solve(t)) < rest) { settled = t; break; }
      t += step;
    }
    if (!settled) settled = t;
    return function (u) { return u >= 1 ? 1 : solve(clamp01(u) * settled); };
  }

  /*
    anime.js's stagger, in the one mode that matters here.

    Its grid option turns a flat list into rows and columns, measures each cell's
    distance from an origin cell, and scales the delay by that distance, which is
    what makes an effect leave one point as a ring rather than sweeping in DOM
    order. These drawings are not grids; their parts sit at arbitrary coordinates.
    So the same rule is applied to the coordinates the elements actually have:
    Euclidean distance from an origin, normalised across the group.
  */
  function rippleFrom(nodes, ox, oy) {
    var far = 0;
    var reach = nodes.map(function (node) {
      var box;
      try { box = node.getBBox(); } catch (err) { box = { x: 0, y: 0, width: 0, height: 0 }; }
      var dx = (box.x + box.width / 2) - ox;
      var dy = (box.y + box.height / 2) - oy;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d > far) far = d;
      return d;
    });
    return reach.map(function (d) { return far ? d / far : 0; });
  }

  // Tuned to sit where anime.js's own demos sit: enough overshoot to read as
  // weight, settled before the beat is halfway through.
  var ARRIVE = spring(1, 118, 13, 0);
  var SETTLE = spring(1, 90, 16, 0);

  /*
    The eight acts.

    A beat that only assembles itself is a slide with a transition on it. These
    make the drawing carry the sentence: the connection that never completes, the
    forecast that travels, the run of confident answers that hits a barrier. Each
    one resolves its parts once and returns a function of that beat's own progress,
    so the action is scrubbed rather than played.

    Everything below is a function of q, which runs 0 to 1 across the second half
    of the beat. The first half belongs to the arrival.
  */
  function has(frame, sel) { return frame.querySelector(sel); }
  function all(frame, sel) { return Array.prototype.slice.call(frame.querySelectorAll(sel)); }
  function measurePath(node) {
    var length = 0;
    try { length = node.getTotalLength(); } catch (err) { length = 0; }
    if (length) { node.style.strokeDasharray = length.toFixed(1); }
    return length;
  }
  function drawTo(entry, k) {
    if (!entry || !entry.length) return;
    entry.node.style.strokeDashoffset = (entry.length * (1 - clamp01(k))).toFixed(1);
  }
  function slide(node, x, y) {
    if (node) node.style.transform = 'translate(' + (x || 0).toFixed(2) + 'px,' + (y || 0).toFixed(2) + 'px)';
  }
  function landing(node, k) {
    if (!node) return;
    var e = ARRIVE(clamp01(k));
    node.style.opacity = clamp01(k * 2.2).toFixed(3);
    node.style.transform = 'scale(' + (0.72 + 0.28 * e).toFixed(4) + ')';
  }
  function reveal(node, k) { if (node) node.style.opacity = clamp01(k).toFixed(3); }

  var ACTS = {
    // The work never leaves the screen: the line to the person reaches out and
    // is drawn back in, over and over, never completing.
    0: function (frame) {
      var road = { node: has(frame, '.em-road'), length: 0 };
      var pull = { node: has(frame, '.em-pull'), length: 0 };
      if (road.node) road.length = measurePath(road.node);
      if (pull.node) pull.length = measurePath(pull.node);
      var arm = has(frame, '.em-arm');
      return function (q) {
        drawTo(road, span(q, 0, 0.45));
        // out to two thirds, then back. The reach is real; the delivery is not.
        var reach = Math.sin(clamp01(span(q, 0.3, 1)) * Math.PI) * 0.66;
        drawTo(pull, reach);
        slide(arm, -reach * 7, 0);
      };
    },
    // Three weekend builds arrive, converge on one node, and drop into public use.
    1: function (frame) {
      var road = { node: has(frame, '.em-road'), length: 0 };
      if (road.node) road.length = measurePath(road.node);
      var hub = has(frame, '.em-attempt-next');
      var arrow = has(frame, '.em-arrow');
      var mark = has(frame, '.em-result-mark');
      var word = has(frame, '.em-result-word');
      return function (q) {
        drawTo(road, span(q, 0, 0.4));
        landing(hub, span(q, 0.3, 0.62));
        slide(arrow, 0, SETTLE(span(q, 0.5, 0.8)) * 16);
        reveal(arrow, span(q, 0.5, 0.62));
        landing(mark, span(q, 0.68, 1));
        reveal(word, span(q, 0.74, 0.92));
      };
    },
    // The forecast crosses the room: it leaves the desk and lands on the city board.
    2: function (frame) {
      var arrow = has(frame, '.em-arrow');
      var road = { node: has(frame, '.em-road'), length: 0 };
      if (road.node) road.length = measurePath(road.node);
      var value = has(frame, '.em-screen-value');
      var screen = has(frame, '.em-screen');
      return function (q) {
        var travel = SETTLE(span(q, 0, 0.5));
        slide(arrow, -70 + travel * 70, 0);
        reveal(arrow, span(q, 0, 0.2));
        reveal(screen, 0.35 + span(q, 0.3, 0.6) * 0.65);
        drawTo(road, span(q, 0.42, 0.82));
        landing(value, span(q, 0.55, 0.95));
      };
    },
    // Volume: the rules sweep through as checks clear, and the count lands.
    3: function (frame) {
      var rule = { node: has(frame, '.em-note-rule'), length: 0 };
      if (rule.node) rule.length = measurePath(rule.node);
      var value = has(frame, '.em-screen-value');
      var arrow = has(frame, '.em-arrow');
      var keep = { node: has(frame, '.em-keep'), length: 0 };
      if (keep.node) keep.length = measurePath(keep.node);
      return function (q) {
        drawTo(rule, span(q, 0, 0.35));
        landing(value, span(q, 0.25, 0.62));
        slide(arrow, SETTLE(span(q, 0.45, 0.75)) * 14, 0);
        reveal(arrow, span(q, 0.45, 0.6));
        drawTo(keep, span(q, 0.6, 0.95));
      };
    },
    // A sharper source is fed in, and the boundary the tool found still holds.
    4: function (frame) {
      var feeds = all(frame, '.em-load > *');
      var pull = { node: has(frame, '.em-pull'), length: 0 };
      if (pull.node) pull.length = measurePath(pull.node);
      var road = { node: has(frame, '.em-road'), length: 0 };
      if (road.node) road.length = measurePath(road.node);
      var edge = has(frame, '.em-boundary');
      return function (q) {
        feeds.forEach(function (node, i) {
          var k = SETTLE(span(q, i * 0.08, 0.42 + i * 0.08));
          slide(node, -26 + k * 26, 0);
          reveal(node, span(q, i * 0.08, 0.2 + i * 0.08));
        });
        drawTo(pull, span(q, 0.3, 0.6));
        slide(edge, span(q, 0.45, 0.8) * 96, 0);
        reveal(edge, span(q, 0.45, 0.55));
        drawTo(road, span(q, 0.58, 0.95));
      };
    },
    // Scattered contributions ripple in from across the region and gather.
    5: function (frame) {
      var dots = all(frame, '.em-clusters > *');
      var delays = rippleFrom(dots, 375, 170);
      var pull = { node: has(frame, '.em-pull'), length: 0 };
      if (pull.node) pull.length = measurePath(pull.node);
      var road = { node: has(frame, '.em-road'), length: 0 };
      if (road.node) road.length = measurePath(road.node);
      var mark = has(frame, '.em-result-mark');
      var word = has(frame, '.em-result-word');
      return function (q) {
        dots.forEach(function (node, i) {
          var from = delays[i] * 0.42;
          landing(node, span(q, from, from + 0.42));
        });
        drawTo(pull, span(q, 0.4, 0.7));
        drawTo(road, span(q, 0.5, 0.8));
        landing(mark, span(q, 0.66, 1));
        reveal(word, span(q, 0.74, 0.94));
      };
    },
    // The image is read correctly, the link to the answer is cut, and the caption
    // wins anyway. The severed route is the whole point of the beat.
    6: function (frame) {
      var road = { node: has(frame, '.em-road'), length: 0 };
      if (road.node) road.length = measurePath(road.node);
      var broken = has(frame, '.em-broken');
      var arrow = has(frame, '.em-arrow');
      var note = has(frame, '.em-note');
      var value = has(frame, '.em-screen-value');
      var words = all(frame, '.em-note ~ .em-result-word, .em-result-word');
      return function (q) {
        drawTo(road, span(q, 0, 0.3));
        landing(broken, span(q, 0.28, 0.5));
        slide(arrow, -14 + SETTLE(span(q, 0.44, 0.72)) * 14, 0);
        reveal(arrow, span(q, 0.44, 0.56));
        reveal(note, 0.3 + span(q, 0.5, 0.75) * 0.7);
        landing(value, span(q, 0.62, 0.95));
        words.forEach(function (node, i) { reveal(node, span(q, 0.7 + i * 0.06, 0.86 + i * 0.06)); });
      };
    },
    // A run of confident answers meets a barrier and stops, and the alternative
    // opens underneath it.
    7: function (frame) {
      var road = { node: has(frame, '.em-road'), length: 0 };
      if (road.node) road.length = measurePath(road.node);
      var dots = all(frame, '.em-attempt-old');
      var barrier = has(frame, '.em-broken');
      var mark = has(frame, '.em-result-mark');
      var word = has(frame, '.em-result-word');
      var gate = { node: has(frame, '.em-open-gate'), length: 0 };
      if (gate.node) gate.length = measurePath(gate.node);
      return function (q) {
        drawTo(road, span(q, 0, 0.32));
        dots.forEach(function (node, i) {
          var k = span(q, 0.1 + i * 0.07, 0.55 + i * 0.07);
          // they advance, then stop dead where the barrier is
          slide(node, SETTLE(k) * (62 - i * 6), 0);
          reveal(node, span(q, 0.1 + i * 0.07, 0.26 + i * 0.07));
        });
        landing(barrier, span(q, 0.5, 0.72));
        landing(mark, span(q, 0.62, 0.92));
        reveal(word, span(q, 0.7, 0.9));
        drawTo(gate, span(q, 0.74, 1));
      };
    }
  };

  /* /about/ uses achievement-specific actions. Each transition completes the
     evidence in the drawing instead of replaying the older chronological story. */
  if (key === 'record') ACTS = {
    /*
      The opening beat draws Vicky rather than restating the stat strip.

      It used to show four cards reading 7 papers, 1 patent, 12 awards and 5+ years.
      Every one of those numbers is already in the stat strip immediately above the
      scene, so the beat opened by repeating what the reader had just read. The
      portrait is traced from assets/img/profile.webp; see the note in
      _includes/ for how it was produced.

      The act is the sketch drawing itself, in the order a person would draw it:
      the head and shoulders first, then the hairline, then the face, feature by
      feature. Each path is a stroke with its own dash length, so drawTo() walks it
      on exactly as it does the arrows elsewhere in the scene.
    */
    0: function (frame) {
      function pen(node) { return { node: node, length: measurePath(node) }; }
      var body = all(frame, '.em-vf-body').map(pen);
      var hair = all(frame, '.em-vf-hair').map(pen);
      // Features are drawn in reading order down the face rather than in the order
      // the tracer happened to emit them, or the mouth can appear before the eyes.
      var face = all(frame, '.em-vf-face').map(pen).sort(function (a, b) {
        var ab = a.node.getBBox(), bb = b.node.getBBox();
        return (ab.y + ab.height / 2) - (bb.y + bb.height / 2);
      });
      // A stagger that leaves each stroke enough of the beat to be seen being drawn.
      function walk(list, from, to, q) {
        var n = list.length || 1, hold = (to - from) / (n + 2);
        list.forEach(function (entry, i) {
          drawTo(entry, span(q, from + i * hold, from + i * hold + hold * 3));
        });
      }
      return function (q) {
        walk(body, 0, .34, q);
        walk(hair, .22, .46, q);
        walk(face, .34, .96, q);
      };
    },
    1: function (frame) {
      var note = has(frame, '.em-note');
      var rules = all(frame, '.em-note-rule');
      var arrow = has(frame, '.em-arrow');
      var screen = has(frame, '.em-screen');
      var value = has(frame, '.em-screen-value');
      var road = { node: has(frame, '.em-road'), length: 0 };
      road.length = measurePath(road.node);
      return function (q) {
        landing(note, span(q, 0, .3));
        rules.forEach(function (node, i) { reveal(node, span(q, .14 + i * .06, .34 + i * .06)); });
        slide(arrow, -24 + SETTLE(span(q, .3, .58)) * 24, 0);
        reveal(arrow, span(q, .28, .42));
        landing(screen, span(q, .4, .7));
        landing(value, span(q, .56, .82));
        drawTo(road, span(q, .64, .97));
      };
    },
    2: function (frame) {
      var loads = all(frame, '.em-load > *');
      var road = { node: has(frame, '.em-road'), length: 0 };
      road.length = measurePath(road.node);
      var arrow = has(frame, '.em-arrow');
      var screen = has(frame, '.em-screen');
      var value = has(frame, '.em-screen-value');
      return function (q) {
        loads.forEach(function (node, i) {
          var k = SETTLE(span(q, i * .08, .38 + i * .08));
          slide(node, -22 + k * 22, 0);
          reveal(node, span(q, i * .08, .2 + i * .08));
        });
        slide(arrow, -18 + SETTLE(span(q, .3, .58)) * 18, 0);
        reveal(arrow, span(q, .28, .42));
        landing(screen, span(q, .38, .68));
        landing(value, span(q, .54, .8));
        drawTo(road, span(q, .62, .96));
      };
    },
    3: function (frame) {
      var papers = all(frame, '.em-papers .em-note');
      var rules = all(frame, '.em-note-rule');
      var value = has(frame, '.em-screen-value');
      var road = { node: has(frame, '.em-road'), length: 0 };
      road.length = measurePath(road.node);
      var mark = has(frame, '.em-result-mark');
      return function (q) {
        papers.forEach(function (node, i) { landing(node, span(q, i * .08, .34 + i * .08)); });
        rules.forEach(function (node, i) { reveal(node, span(q, .18 + i * .05, .38 + i * .05)); });
        landing(value, span(q, .34, .6));
        drawTo(road, span(q, .48, .74));
        landing(mark, span(q, .66, .96));
      };
    },
    4: function (frame) {
      var dots = all(frame, '.em-clusters > *');
      var delays = rippleFrom(dots, 150, 170);
      var pull = { node: has(frame, '.em-pull'), length: 0 };
      pull.length = measurePath(pull.node);
      var screen = has(frame, '.em-screen');
      var value = has(frame, '.em-screen-value');
      var words = all(frame, '.em-result-word');
      return function (q) {
        dots.forEach(function (node, i) { landing(node, span(q, delays[i] * .22, .34 + delays[i] * .22)); });
        drawTo(pull, span(q, .28, .56));
        landing(screen, span(q, .42, .7));
        landing(value, span(q, .56, .8));
        words.forEach(function (node, i) { reveal(node, span(q, .68 + i * .07, .84 + i * .07)); });
      };
    },
    5: function (frame) {
      var blocks = all(frame, '.em-podium rect');
      var values = all(frame, '.em-podium .em-screen-value');
      var road = { node: has(frame, '.em-road'), length: 0 };
      road.length = measurePath(road.node);
      return function (q) {
        drawTo(road, span(q, 0, .28));
        [1, 0, 2].forEach(function (index, order) {
          landing(blocks[index], span(q, .18 + order * .12, .5 + order * .12));
          landing(values[index], span(q, .32 + order * .12, .62 + order * .12));
        });
      };
    },
    6: function (frame) {
      var note = has(frame, '.em-note');
      var rules = all(frame, '.em-note-rule');
      var mark = has(frame, '.em-result-mark');
      var arrow = has(frame, '.em-arrow');
      var review = has(frame, '.em-review');
      var value = has(frame, '.em-screen-value');
      return function (q) {
        landing(note, span(q, 0, .3));
        rules.forEach(function (node, i) { reveal(node, span(q, .12 + i * .06, .32 + i * .06)); });
        landing(mark, span(q, .3, .54));
        slide(arrow, -20 + SETTLE(span(q, .42, .66)) * 20, 0);
        reveal(arrow, span(q, .4, .52));
        landing(review, span(q, .52, .8));
        landing(value, span(q, .68, .94));
      };
    }
  };

  /*
    Cinematic scenes animate every part of a beat against the scroll rather than
    letting the drawing cross-fade as one block. Each frame's direct children are
    the things that stagger in, so they are collected once here instead of being
    queried on every frame of the scrub.

    Paths that carry no dash pattern can also be drawn on. The dashed ones are
    skipped: overwriting stroke-dasharray to draw them would delete the dashes
    that make them read as a connection rather than a solid edge.
  */
  var shots = [];
  if (scene.cinematic && narrative) {
    var frames = narrative.frames;
    shots = frames.map(function (frame) {
      var kids = Array.prototype.filter.call(frame.children, function (node) {
        return node.nodeType === 1;
      });
      var strokes = [];
      Array.prototype.forEach.call(frame.querySelectorAll('path.em-arrow, path.em-road, path.em-broken, path.em-open-gate'), function (path) {
        if (getComputedStyle(path).strokeDasharray !== 'none') return;
        var length = 0;
        try { length = path.getTotalLength(); } catch (err) { length = 0; }
        if (!length) return;
        path.style.strokeDasharray = length.toFixed(1);
        strokes.push({ node: path, length: length });
      });
      return {
        frame: frame,
        kids: kids,
        strokes: strokes,
        // Ripple members are animated individually so a cluster can arrive as a
        // ring from its centre rather than in document order.
        ripple: (function () {
          var group = frame.querySelector('.em-clusters, .em-load');
          if (!group) return null;
          var parts = Array.prototype.slice.call(group.children);
          if (parts.length < 3) return null;
          return { parts: parts, delays: rippleFrom(parts, 375, 176) };
        }()),
        act: ACTS[frames.indexOf(frame)] ? ACTS[frames.indexOf(frame)](frame) : null
      };
    });
  }


  // The scene is 100vw and pulls itself back out to the left edge, so it has to
  // measure the column it actually sits in. That is .page-content on the writings
  // and the narrower .about-story article on /about/.
  function alignToViewport() {
    var column = host.parentElement || root;
    host.style.setProperty('--em-gutter', column.getBoundingClientRect().left.toFixed(2) + 'px');
  }
  // The lead-in holds p at 0 for most of a screen. The opening beat no longer
  // takes its cue from that, because its clock is already running by then.
  function measure() {
    var rect = host.getBoundingClientRect();
    var reach = Math.max(1, host.offsetHeight - innerHeight);
    var raw = reduced ? 1 : clamp01(-rect.top / reach);
    target = clamp01((raw - LEAD) / (1 - LEAD - TAIL));
  }
  function render(p) {
    host.style.setProperty('--em-p', p.toFixed(4));
    host.style.setProperty('--em-x', (20 + p * 55).toFixed(2) + '%');
    // One slow push across the whole sequence, under the per-beat moves. Three
    // percent over eight screens is not consciously visible; stopping it is.
    if (scene.cinematic && !reduced) {
      canvas.style.transform = 'scale(' + (1 + p * 0.03).toFixed(4) + ')';
    }

    var scaled = p * count;
    var stage = Math.min(count - 1, Math.floor(scaled));

    // Arriving at a beat restarts its clock, on the way back up as well as down,
    // so a beat returned to performs again rather than sitting there finished.
    if (stage !== clockStage) { clockStage = stage; beatT = 0; }
    var auto = reduced ? 1 : clamp01(beatT / BEAT_SECONDS);

    if (narrative) {
      var reach = 0.5 + XFADE / 2;
      narrative.frames.forEach(function (frame, index) {
        var centre = index + 0.5;
        // The outer half of the first and last beats has nothing to dissolve with,
        // so those two hold at full instead of opening and closing on a half fade.
        var away = (index === 0 && scaled < centre) || (index === count - 1 && scaled > centre)
          ? 0 : Math.abs(scaled - centre);
        var shown = smooth(clamp01((reach - away) / XFADE));
        frame.style.opacity = shown.toFixed(4);

        /*
          Depth, for the cinematic scenes only.

          A cross-fade alone reads as two pictures swapping. Giving the pair a
          shared direction of travel reads as one story moving: the beat arriving
          rises into place from slightly below and slightly small, the beat leaving
          keeps rising and grows very slightly past full size as it dissolves. The
          sign of `lead` is the whole trick, and it is a function of scroll, so
          scrubbing backwards runs it backwards.
        */
        // Six of the eight beats are invisible at any moment. Their children do not
        // need writing to sixty times a second, and the first frame on which one
        // starts to show is early enough because it starts from nothing anyway.
        if (shots.length && !reduced && shown > 0) {
          // Eased rather than linear: near the centre of its beat the drawing is
          // almost still, which is when it is being read, and it does most of its
          // travelling during the dissolve, when it is on its way out anyway. A
          // linear ramp drifts the whole time and reads as restlessness.
          var away2 = clamp01(Math.abs(scaled - centre) / reach);
          var lead = smooth(away2) * (scaled < centre ? -1 : 1);
          var depth = 1 + (lead < 0 ? lead * 0.075 : lead * 0.045);
          frame.style.transform = 'translate(0,' + (-lead * 26).toFixed(2) + 'px) scale(' + depth.toFixed(4) + ')';

          /*
            Then each part of that beat arrives on its own beat. The stagger runs
            over the first third of the beat and the last child waits about a third
            of that, which is slow enough to be read as a sequence and quick enough
            to be finished well inside the hold.
          */
          var shot = shots[index];
          var local = beatLocal(index, stage, auto);
          var open = span(local, 0, ARRIVE_END);
          shot.kids.forEach(function (kid, order) {
            var delay = Math.min(0.34, order * 0.045);
            var k = ARRIVE(span(open, delay, 1));
            kid.style.setProperty('--em-in', clamp01(k).toFixed(3));
            kid.style.setProperty('--em-ty', ((1 - k) * 16).toFixed(2) + 'px');
          });
          if (shot.ripple) {
            shot.ripple.parts.forEach(function (part, order) {
              var from = shot.ripple.delays[order] * 0.5;
              var k = ARRIVE(span(open, from, from + 0.5));
              part.style.setProperty('--em-in', clamp01(k).toFixed(3));
              part.style.setProperty('--em-rs', k.toFixed(3));
            });
          }
          // Solid strokes draw themselves rather than fading in.
          shot.strokes.forEach(function (stroke, order) {
            var k = outCubic(span(open, Math.min(0.4, 0.12 + order * 0.08), 1));
            stroke.node.style.strokeDashoffset = (stroke.length * (1 - k)).toFixed(1);
          });
          /*
            Then the beat performs, and then it stops and lets you look at it.

            The act used to run to the beat boundary, which put its final state at
            the same moment as the dissolve: the drawing reached completion at half
            opacity, on its way out, so the payoff was never once visible whole.
            That is what made a beat feel like it finished and was snatched away.
            It now ends at ACT_END, which leaves a hold of about a sixth of a beat
            with the finished picture at full opacity and nothing moving on it.
          */
          if (shot.act) shot.act(span(local, ACT_START, ACT_END));
        }
        // Drawings may overlap through the handover; their captions may not. Two
        // sentences at half opacity on top of each other are unreadable, and since
        // this fade tracks scroll rather than time, stopping on a boundary used to
        // leave them stacked indefinitely. Text is gone by the boundary instead.
        frame.style.setProperty('--em-cap', smooth(clamp01((0.5 - away) / CAPTION)).toFixed(4));
      });
    }

    // Hold the opening beat's words in place instead of fading them up from nothing:
    // the lead-in keeps p at 0 for most of a screen, and the column would sit empty.
    var into = stage === 0 ? 1 : clamp01((scaled - stage) / WORDS);
    var out = stage === count - 1 ? 1 : clamp01((stage + 1 - scaled) / WORDS);
    var k = smooth(Math.min(into, out));

    if (lines && !reduced) {
      /*
        The three lines arrive in reading order rather than as one block, on the
        beat's own clock, so the column composes itself while the pin is still
        settling. The exit fade stays on the scroll and stays shared, so the whole
        column leaves together on the boundary the reader is driving towards.
      */
      var enter = span(auto, 0, ARRIVE_END);
      var leaving = smooth(out);
      lines.forEach(function (line, order) {
        var k2 = outCubic(span(enter, order * 0.13, 1));
        line.style.opacity = (k2 * leaving).toFixed(3);
        line.style.transform = 'translateY(' + ((1 - k2) * 1.35).toFixed(3) + 'rem)';
      });
      copy.style.opacity = '';
      copy.style.transform = '';
    } else {
      copy.style.opacity = k.toFixed(3);
      copy.style.transform = 'translateY(' + ((1 - k) * 0.8).toFixed(3) + 'rem)';
    }

    if (stage !== lastStage) {
      lastStage = stage;
      if (scene.frames) {
        copy.querySelector('.em-kicker').textContent = scene.frames[stage][0];
        copy.querySelector('h2').textContent = scene.frames[stage][1];
        setHighlightedText(copy.querySelector('p'), scene.frames[stage][2], scene.highlights && scene.highlights[stage]);
      }
      // The class no longer carries the fade, only which figure animations run.
      if (narrative) narrative.frames.forEach(function (frame, index) { frame.classList.toggle('is-active', index === stage); });
    }
    /*
      The three node scenes carry one node and one outgoing edge per beat, so each
      pair belongs to a beat and rides that beat's clock: the node lands while the
      beat arrives, then its edge reaches forward during the act towards the node
      the next beat will bring. Passed nodes stay lit, which is the diagram
      accumulating rather than replaying.
    */
    nodes.forEach(function (node, index) {
      var k3 = smooth(span(beatLocal(index, stage, auto), 0, ARRIVE_END));
      node.style.opacity = (.12 + k3 * .88).toFixed(3);
      node.style.transform = 'scale(' + (.72 + k3 * .28).toFixed(3) + ')';
    });
    edges.forEach(function (edge, index) {
      var k4 = smooth(span(beatLocal(index, stage, auto), ACT_START, ACT_END));
      edge.style.strokeDashoffset = (1 - k4).toFixed(3);
    });
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
    /*
      The clock is the second reason to keep drawing, and it runs only while the
      scene is actually held under the pin.

      `onScreen` alone is not that test. The host is a dozen screens tall and the
      observer fires at `threshold: 0`, so it turns true the moment the scene's top
      edge appears — a whole viewport before the pin engages. The first beat then
      played itself out while the reader was still scrolling towards it, and arrived
      already finished, which is exactly the empty-room problem the observer exists
      to prevent. Requiring the pin to be holding costs one rect read per frame and
      makes the opening beat perform on arrival.

      dt is capped, so a tab returning to the foreground resumes the beat rather
      than jumping to the end of it.
    */
    var r = host.getBoundingClientRect();
    var held = r.top <= 0 && r.bottom >= innerHeight;
    if (held !== pinHeld) { pinHeld = held; if (held) beatT = 0; }
    if (onScreen && held) beatT += dt;
    eased += (target - eased) * (1 - Math.pow(0.0016, dt));
    if (Math.abs(target - eased) < 0.00008) eased = target;
    render(eased);
    // Two things can still be moving: the scroll settling into its target, and the
    // beat performing. Keep the loop alive for either, and let it stop once the
    // beat has finished and is being held, so a read stays at zero frames.
    if (eased !== target || (onScreen && held && beatT < BEAT_SECONDS)) { request(); return; }
    last = 0;
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(tick); } }

  /*
    A coarse gate only: it stops the loop running at all when the scene is nowhere
    near, and wakes it when the scene comes back. Whether a beat's clock advances is
    decided in tick() by whether the pin is actually holding, because on a host this
    tall `isIntersecting` turns true far too early to mean "the reader is here".
  */
  if ('IntersectionObserver' in window) {
    onScreen = false;
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) { last = 0; request(); }
    }, { threshold: 0 }).observe(host);
  }

  /*
    Scroll is the reader's again.

    This used to swallow every gesture while the pin held and glide the page to the
    next beat's anchor, which stopped the skipping but turned the scene into a
    slideshow: each beat arrived by teleport, and a reader who kept scrolling was
    held out by a lock they had not asked for. Worse, the lock could outlast them
    entirely, and the scene became a pit.

    A beat is simply given more scroll to cross instead. At `--em-beats` screens
    each the browser could spend one flick on three beats; at the height the
    stylesheet now uses a hard flick moves well under one, so nothing is skipped
    and nothing is intercepted. Wheel, trackpad, touch, keyboard, scrollbar, find
    in page and the back button all behave exactly as they do everywhere else,
    because none of them is being listened to.

    Distance is what paces the sequence now, and BEAT_SECONDS is free to be short:
    the drawing performs as soon as its beat arrives rather than rationing itself
    across the scroll it was given.
  */

  skip.addEventListener('click', function () {
    host.scrollIntoView({ block: 'end', behavior: reduced ? 'auto' : 'smooth' });
  });
  function resize() { alignToViewport(); measure(); eased = target; last = 0; render(eased); }
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', resize);
  alignToViewport(); measure(); eased = target; render(eased);
})();
