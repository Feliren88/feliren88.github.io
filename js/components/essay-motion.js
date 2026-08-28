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
          '<g class="em-vf-sketch"><g class="em-vf-breathe"><path class="em-vf-line em-vf-body" d="M181.8 389.4C183.4 388.2 190.5 384.4 191.3 382.3C192.1 380.2 186.8 379.8 186.6 376.7C186.3 373.7 188.3 366.7 189.7 364.1C191.2 361.5 193.1 363.8 195.2 360.9C197.3 358.0 198.7 351.3 202.3 346.7C206.0 342.2 205.0 340.6 217.0 333.7C228.9 326.8 261.6 310.3 273.8 305.3C286.0 300.3 284.7 306.1 290.4 303.7C296.1 301.3 304.5 294.8 308.1 290.7C311.8 286.5 311.6 283.0 312.1 278.8C312.6 274.6 313.9 272.2 311.3 265.4C308.7 258.6 299.5 244.6 296.3 237.8C293.1 230.9 295.5 230.1 292.4 224.3C289.2 218.6 281.3 211.4 277.4 203.0C273.4 194.6 269.7 180.0 268.7 173.8C267.6 167.6 269.5 168.0 271.0 165.9C272.6 163.8 277.1 165.4 278.1 161.2C279.2 157.0 278.3 147.2 277.4 140.6C276.4 134.1 273.3 128.1 272.6 121.7C272.0 115.2 271.7 108.1 273.4 102.0C275.1 95.8 278.5 90.8 282.9 84.6C287.3 78.3 291.1 71.1 299.9 64.5C308.6 57.8 325.3 48.7 335.4 44.7C345.5 40.8 355.3 40.8 360.7 40.8C366.1 40.8 364.5 43.9 367.8 44.7C371.1 45.5 375.9 44.2 380.4 45.5C384.9 46.8 388.0 48.1 394.6 52.6C401.3 57.1 414.3 66.8 420.3 72.7C426.3 78.7 428.0 83.7 430.5 88.5C433.0 93.4 434.6 92.1 435.3 102.0C435.9 111.8 432.8 139.2 434.5 147.8C436.2 156.3 443.2 150.0 445.5 153.3C447.9 156.6 448.8 160.6 448.7 167.5C448.6 174.3 446.5 188.0 444.7 194.3C443.0 200.7 440.7 202.6 438.4 205.4C436.2 208.2 433.4 207.9 431.3 210.9C429.2 213.9 427.1 217.1 425.8 223.6C424.5 230.0 423.0 243.6 423.4 249.6C423.8 255.7 425.9 255.3 428.2 259.9C430.5 264.4 433.5 273.5 437.2 276.9C441.0 280.2 445.3 277.2 450.7 280.0C456.1 282.8 464.9 291.5 469.6 293.4C474.4 295.4 469.9 290.4 479.1 291.9C488.3 293.3 513.8 298.3 524.9 302.1C535.9 305.9 540.7 312.4 545.4 314.8C550.2 317.1 549.6 313.6 553.3 316.3C557.1 319.0 563.9 325.6 567.9 330.9C571.9 336.3 575.0 342.1 577.4 348.3C579.8 354.5 581.5 360.2 582.1 368.0C582.8 375.9 581.5 391.1 581.3 395.7"/><path class="em-vf-line em-vf-hair" d="M430.9 164.7C429.5 158.7 426.8 138.9 422.6 128.8C418.5 118.7 410.7 109.7 406.1 104.3C401.4 99.0 401.8 98.9 394.6 96.8C387.4 94.8 369.6 93.9 363.0 92.1C356.4 90.2 357.9 85.1 355.1 85.8C352.4 86.4 353.7 93.8 346.4 96.0C339.2 98.3 318.7 98.3 311.7 99.2C304.7 100.1 307.0 100.0 304.6 101.6C302.2 103.1 299.1 105.4 297.1 108.3C295.1 111.1 293.4 113.7 292.4 118.5C291.3 123.4 291.0 134.3 290.8 137.5"/><path class="em-vf-line em-vf-hair" d="M430.9 164.7C429.5 158.7 427.4 139.5 422.6 128.8C417.9 118.1 412.4 106.9 402.5 100.8C392.6 94.7 373.6 96.7 363.0 92.1C352.5 87.5 346.2 76.2 339.3 73.1C332.5 70.1 325.9 74.6 322.0 73.9C318.0 73.3 316.4 68.9 315.6 69.2C314.9 69.5 317.0 74.5 317.2 75.5"/><path class="em-vf-line em-vf-hair" d="M327.1 59.3C327.6 60.0 328.3 63.3 329.9 63.7C331.4 64.0 332.0 60.0 336.2 61.3C340.4 62.6 350.7 68.1 355.1 71.6C359.6 75.0 355.5 78.6 363.0 81.8C370.6 85.0 394.3 89.4 400.5 90.9"/><path class="em-vf-line em-vf-face" d="M288.9 207.6C289.5 210.8 290.9 220.7 292.8 226.9C294.8 233.1 297.1 239.2 300.4 244.8C303.7 250.3 308.1 255.5 312.7 260.0C317.4 264.5 322.8 268.4 328.3 271.7C333.8 275.0 339.7 278.4 345.6 279.8C351.6 281.2 358.0 280.9 364.1 280.2C370.3 279.5 376.8 277.9 382.7 275.3C388.6 272.7 394.4 268.5 399.8 264.6C405.2 260.7 410.7 256.7 415.0 251.8C419.2 246.9 422.7 241.3 425.3 235.4C427.9 229.5 429.6 222.7 430.8 216.2C431.9 209.7 431.9 199.8 432.1 196.5"/><path class="em-vf-line em-vf-face" d="M293.7 160.2C294.9 158.5 298.0 152.1 301.4 149.8C304.8 147.6 309.8 146.7 314.3 146.7C318.9 146.7 324.1 148.5 328.6 149.8C333.1 151.2 339.3 154.1 341.5 155.0"/><path class="em-vf-line em-vf-face" d="M363.3 151.2C365.4 150.0 371.5 145.9 375.9 143.9C380.3 141.9 385.2 139.7 390.0 139.1C394.7 138.4 400.5 138.3 404.6 140.0C408.7 141.7 413.0 147.7 414.7 149.2"/><path class="em-vf-line em-vf-face" d="M311.5 171.1C311.5 170.0 316.2 167.7 318.7 167.0C321.2 166.3 324.0 166.0 326.7 166.8C329.4 167.6 334.9 170.7 334.9 171.8C334.9 173.0 329.5 173.4 326.8 173.8C324.1 174.1 321.2 174.3 318.6 173.9C316.1 173.4 311.5 172.3 311.5 171.1Z"/><path class="em-vf-line em-vf-face" d="M326.1 170.7C326.1 171.4 325.9 172.1 325.5 172.6C325.1 173.2 324.5 173.6 323.9 173.8C323.3 174.0 322.5 174.0 321.9 173.8C321.3 173.6 320.6 173.2 320.2 172.6C319.9 172.1 319.6 171.4 319.6 170.7C319.6 170.1 319.9 169.3 320.2 168.8C320.6 168.3 321.3 167.8 321.9 167.6C322.5 167.4 323.3 167.4 323.9 167.6C324.5 167.8 325.1 168.3 325.5 168.8C325.9 169.3 326.1 170.1 326.1 170.7Z"/><path class="em-vf-line em-vf-face" d="M373.5 168.9C373.3 167.6 378.4 163.0 381.0 161.5C383.7 160.1 386.9 159.8 389.5 160.1C392.2 160.4 396.8 162.1 397.0 163.3C397.2 164.5 393.1 166.3 390.6 167.3C388.1 168.3 384.9 168.8 382.1 169.1C379.2 169.3 373.7 170.1 373.5 168.9Z"/><path class="em-vf-line em-vf-face" d="M389.6 165.0C389.6 165.8 389.3 166.7 388.9 167.4C388.4 168.0 387.6 168.6 386.9 168.8C386.1 169.1 385.1 169.1 384.4 168.8C383.7 168.6 382.9 168.0 382.4 167.4C381.9 166.7 381.6 165.8 381.6 165.0C381.6 164.2 381.9 163.3 382.4 162.7C382.9 162.0 383.7 161.5 384.4 161.2C385.1 161.0 386.1 161.0 386.9 161.2C387.6 161.5 388.4 162.0 388.9 162.7C389.3 163.3 389.6 164.2 389.6 165.0Z"/><path class="em-vf-line em-vf-face" d="M340.0 206.7C341.4 206.9 345.4 207.4 348.2 207.8C351.0 208.1 353.9 209.1 356.6 208.9C359.3 208.7 361.9 207.2 364.5 206.5C367.2 205.8 371.0 204.8 372.3 204.5"/><path class="em-vf-line em-vf-face" d="M327.9 228.4C328.6 228.4 328.7 229.1 332.3 228.4C335.9 227.7 345.5 224.8 349.5 224.0C353.6 223.2 354.3 224.1 356.6 223.9C359.0 223.6 359.5 222.5 363.8 222.7C368.1 222.9 378.4 224.6 382.3 224.8C386.2 225.0 386.3 224.2 387.1 224.1"/><path class="em-vf-line em-vf-face" d="M327.9 228.4C329.7 230.3 334.9 237.5 338.7 240.0C342.4 242.5 347.1 242.7 350.4 243.2C353.6 243.8 355.6 243.6 358.1 243.4C360.7 243.2 362.7 243.0 365.7 241.9C368.7 240.8 372.7 239.8 376.3 236.8C379.9 233.8 385.3 226.2 387.1 224.1"/></g></g><text x="375" y="428">Vicky leads AI research across industry, public services, and international teams.</text>',
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
