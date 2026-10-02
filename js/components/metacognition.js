/** Metacognition: checks for confidence, reliance, and what to hand over. */
(function () {
  'use strict';

  var CLAIMS = [
    { text: 'Sunlight takes about 8 minutes to reach Earth.', answer: true, note: 'It takes about 8 minutes and 20 seconds on average.' },
    { text: 'The Great Wall of China is visible to the naked eye from the Moon.', answer: false, note: 'At that distance it is far too narrow to see with the naked eye.' },
    { text: 'An octopus has 3 hearts.', answer: true, note: 'One heart pumps blood around the body. The other 2 pump it through the gills, where oxygen enters.' },
    { text: 'The summit of Mount Everest is the point on Earth farthest from its centre.', answer: false, note: 'That point is the summit of Chimborazo in Ecuador. Earth bulges at the equator, which lifts it further out.' },
    { text: 'In plant science, a banana is a berry.', answer: true, note: 'In plant science, a berry grows from one flower’s ovary, which holds the seeds. A banana fits this definition.' }
  ];

  // 20 made-up answers, 14 right. Both assistants are equally accurate; only
  // what their confidence says about each answer differs.
  var ASSISTANT = {
    correct: [true, true, false, true, true, true, false, true, true, true, false, true, true, true, false, true, false, true, true, false],
    tracks: [95, 90, 60, 88, 97, 85, 70, 92, 70, 93, 55, 91, 86, 99, 85, 89, 65, 94, 80, 60],
    flat: [95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95]
  };

  var PHASES = {
    before: { title: 'Plan', questions: ['What is the goal, and what would a good answer look like?', 'What do I already know about this?', 'Which part must I do myself to learn it?'] },
    during: { title: 'Check my progress', questions: ['Can I explain the last step without looking?', 'What percentage describes how sure I am?', 'Does this read easily because I understand it, or because it is well written?'] },
    after: { title: 'Review the result', questions: ['Which answers or predictions were wrong?', 'What did the AI do that I want to learn to do?', 'What will I change next time?'] }
  };

  var TASKS = [
    { text: 'Format a reference list', pick: 'hand', why: 'It needs doing, and I learn little from doing it again.' },
    { text: 'Draft a routine status email', pick: 'hand', why: 'I know what the email needs to say, so I can check the draft easily.' },
    { text: 'Summarise 10 papers I must cite', pick: 'along', why: 'AI can help me sort the papers. Then I read the passages I need and check each summary.' },
    { text: 'Debug code in a language I am learning', pick: 'keep', why: 'Working through the bug helps me learn. So I ask AI for hints and write the fix myself.' },
    { text: 'Choose between 2 job offers', pick: 'keep', why: 'AI can suggest questions. However, I decide which offer fits my needs and priorities.' },
    { text: 'Review a model’s output for errors', pick: 'along', why: 'AI can point out possible errors. Then I check them myself to practise spotting mistakes.' }
  ];
  var VERBS = { hand: 'hand it over', along: 'work with AI', keep: 'do it myself' };

  function round1(x) { return Math.round(x * 10) / 10; }
  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  function summarise(rounds) {
    var n = rounds.length;
    if (!n) return { n: 0, meanConfidence: 0, hitRate: 0, gap: 0, verdict: 'none' };
    var confidence = 0, hits = 0;
    rounds.forEach(function (r) { confidence += r.confidence; if (r.correct) hits++; });
    var meanConfidence = round1(confidence / n), hitRate = round1(hits / n * 100), gap = round1(meanConfidence - hitRate);
    return { n: n, meanConfidence: meanConfidence, hitRate: hitRate, gap: gap, verdict: gap > 10 ? 'over' : gap < -10 ? 'under' : 'close' };
  }

  function verdictText(s) {
    if (!s.n) return 'Your average confidence and percentage of correct answers appear here after each claim.';
    var line = 'Average confidence ' + s.meanConfidence + '%. Correct ' + s.hitRate + '%.';
    if (s.n < CLAIMS.length) return line;
    if (s.verdict === 'over') return line + ' You were ' + s.gap + ' points more confident than accurate. Next time, check the evidence before choosing how sure you are.';
    if (s.verdict === 'under') return line + ' You were ' + (-s.gap) + ' points less confident than accurate. You got more answers right than your confidence suggested.';
    return line + ' Your confidence and your accuracy were within 10 points of each other.';
  }

  function simulate(confidences, correct, threshold) {
    var out = { cells: [], acceptedRight: 0, acceptedWrong: 0, checked: 0 };
    confidences.forEach(function (confidence, i) {
      var accepted = confidence >= threshold;
      out.cells.push({ confidence: confidence, correct: correct[i], accepted: accepted });
      if (!accepted) out.checked++;
      else if (correct[i]) out.acceptedRight++;
      else out.acceptedWrong++;
    });
    return out;
  }

  function arbitrationText(kind, r, threshold) {
    if (kind === 'flat') {
      return 'It always says 95% sure. So the slider makes me trust all 20 answers or check all 20.' +
        (r.checked ? ' Right now I check every answer myself.' : ' Right now I accept every answer, including ' + plural(r.acceptedWrong, 'wrong one') + '.');
    }
    return 'Its more confident answers are more often right. At ' + threshold + '%, I check ' + plural(r.checked, 'answer') +
      ' and accept ' + plural(r.acceptedWrong, 'wrong answer') + '.';
  }

  function checkReply(rating, correct) {
    return (correct ? 'Right. The paragraph says what happens, but leaves out why.' :
      'The paragraph leaves out why. It only says that shorter waves spread more strongly.') +
      ' You rated your ability to explain it at ' + rating + '%.' +
      (rating >= 70 ? ' If that felt easy, check whether you could explain the missing step.' :
        ' Now compare that rating with what you could explain without looking.') +
      ' Air particles respond to light and send it out again in different directions.' +
      ' This is called scattering. They scatter shorter light waves more strongly.' +
      ' Wavelength means the distance between neighbouring peaks of a wave.' +
      ' For these tiny particles, halving the wavelength makes scattering roughly 16 times stronger.';
  }

  function offloadReply(task, choice) {
    return (choice === task.pick ? 'Same as mine. ' : 'I would ' + VERBS[task.pick] + '. ') + task.why;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      CLAIMS: CLAIMS, ASSISTANT: ASSISTANT, PHASES: PHASES, TASKS: TASKS,
      summarise: summarise, simulate: simulate, verdictText: verdictText,
      checkReply: checkReply, arbitrationText: arbitrationText, offloadReply: offloadReply
    };
    return;
  }
  if (typeof document === 'undefined') return;

  if (!document.querySelector('.mc-hero')) return;

  var $ = function (id) { return document.getElementById(id); };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVG = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, text) {
    var node = document.createElementNS(SVG, tag);
    Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text) node.textContent = text;
    return node;
  }
  function press(buttons, active) {
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === active)); });
  }
  function bindRange(input, output, onChange) {
    function update() { output.textContent = input.value + '%'; if (onChange) onChange(+input.value); }
    input.addEventListener('input', update);
    update();
  }

  function initProgress() {
    var fill = $('mc-progress-fill');
    var links = Array.prototype.slice.call(document.querySelectorAll('.mc-rail a'));
    var sections = links.map(function (link) { return document.querySelector(link.getAttribute('href')); });
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (fill) fill.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
      var active = -1;
      sections.forEach(function (section, i) { if (section && section.getBoundingClientRect().top < window.innerHeight * 0.45) active = i; });
      links.forEach(function (link, i) { link.classList.toggle('is-current', i === active); });
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function initHero() {
    var svg = document.querySelector('.mc-loop svg');
    if (svg && reduced && svg.pauseAnimations) svg.pauseAnimations();
  }

  function initPhases() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.mc-phases button'));
    var read = $('mc-phase-read'), track = document.querySelector('.mc-phase-track');
    function show(button) {
      var phase = PHASES[button.dataset.phase];
      press(buttons, button);
      track.style.setProperty('--at', buttons.indexOf(button));
      read.textContent = '';
      var title = document.createElement('h3'); title.textContent = phase.title;
      var list = document.createElement('ul');
      phase.questions.forEach(function (q) { var li = document.createElement('li'); li.textContent = q; list.appendChild(li); });
      read.appendChild(title); read.appendChild(list);
    }
    buttons.forEach(function (b) { b.addEventListener('click', function () { show(b); }); });
    show(buttons[0]);
  }

  function initPeople() {
    var host = $('mc-people');
    Array.prototype.forEach.call(host.querySelectorAll('.mc-people-row'), function (row) {
      var dots = row.querySelector('.mc-dots'), miss = +row.dataset.miss;
      for (var i = 0; i < 18; i++) {
        var dot = document.createElement('i');
        dot.style.setProperty('--i', i);
        if (i < miss) dot.className = 'is-miss';
        dots.appendChild(dot);
      }
    });
    if (reduced || !('IntersectionObserver' in window)) { host.classList.add('is-shown'); return; }
    var seen = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      host.classList.add('is-shown');
      seen.disconnect();
    }, { threshold: 0.4 });
    seen.observe(host);
  }

  function initCheck() {
    var feel = $('mc-feel'), readStep = document.querySelector('.mc-check-step[data-step="read"]');
    var quizStep = document.querySelector('.mc-check-step[data-step="quiz"]');
    var options = Array.prototype.slice.call(quizStep.querySelectorAll('button'));
    bindRange(feel, $('mc-feel-out'));
    $('mc-hide').addEventListener('click', function () {
      readStep.hidden = true;
      quizStep.hidden = false;
      options[0].focus();
    });
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        press(options, option);
        options.forEach(function (b) { b.disabled = true; });
        $('mc-check-read').textContent = checkReply(+feel.value, option.dataset.correct === 'true');
      });
    });
  }

  function drawCalibration(svg, rounds) {
    svg.textContent = '';
    var L = 40, R = 300, T = 20, B = 200;
    var y = function (pct) { return B - pct / 100 * (B - T); };
    [0, 50, 100].forEach(function (pct) {
      svg.appendChild(svgEl('line', { x1: L, x2: R, y1: y(pct), y2: y(pct), class: 'mc-axis' }));
      svg.appendChild(svgEl('text', { x: L - 6, y: y(pct) + 3, 'text-anchor': 'end', class: 'mc-axis-text' }, pct + '%'));
    });
    for (var i = 0; i < CLAIMS.length; i++) {
      svg.appendChild(svgEl('text', { x: L + (i + 0.5) * 52, y: B + 18, 'text-anchor': 'middle', class: 'mc-axis-text' }, 'Claim ' + (i + 1)));
    }
    if (!rounds.length) return;
    var s = summarise(rounds);
    var top = Math.min(y(s.meanConfidence), y(s.hitRate)), bottom = Math.max(y(s.meanConfidence), y(s.hitRate));
    svg.appendChild(svgEl('rect', { x: L, y: top, width: R - L, height: Math.max(0, bottom - top), class: 'mc-gap' }));
    svg.appendChild(svgEl('line', { x1: L, x2: R, y1: y(s.meanConfidence), y2: y(s.meanConfidence), class: 'mc-conf-line' }));
    svg.appendChild(svgEl('line', { x1: L, x2: R, y1: y(s.hitRate), y2: y(s.hitRate), class: 'mc-hit-line' }));
    svg.appendChild(svgEl('text', { x: R, y: y(s.meanConfidence) - 5, class: 'mc-line-text is-conf' }, 'Confidence ' + s.meanConfidence + '%'));
    svg.appendChild(svgEl('text', { x: R, y: y(s.hitRate) + 13, class: 'mc-line-text is-hit' }, 'Correct ' + s.hitRate + '%'));
    rounds.forEach(function (r, i) {
      svg.appendChild(svgEl('circle', { cx: L + (i + 0.5) * 52, cy: y(r.confidence), r: 7, class: r.correct ? 'mc-dot-right' : 'mc-dot-wrong' }));
    });
  }

  function initCalibration() {
    var answers = Array.prototype.slice.call(document.querySelectorAll('.mc-cal-answer button'));
    var conf = $('mc-cal-conf'), submit = $('mc-cal-submit'), svg = $('mc-cal-svg');
    var index = 0, rounds = [], picked = null, locked = false;
    bindRange(conf, $('mc-cal-conf-out'));
    function render() {
      $('mc-cal-count').textContent = 'Claim ' + (index + 1) + ' of ' + CLAIMS.length;
      $('mc-cal-claim').textContent = CLAIMS[index].text;
      $('mc-cal-feedback').textContent = '';
      picked = null; locked = false;
      answers.forEach(function (b) { b.disabled = false; b.setAttribute('aria-pressed', 'false'); });
      conf.disabled = false;
      submit.disabled = true;
      submit.textContent = 'Lock in my answer';
    }
    answers.forEach(function (b) {
      b.addEventListener('click', function () {
        if (locked) return;
        picked = b.dataset.answer === 'true';
        press(answers, b);
        submit.disabled = false;
      });
    });
    submit.addEventListener('click', function () {
      if (!locked) {
        var claim = CLAIMS[index], correct = picked === claim.answer;
        rounds.push({ confidence: +conf.value, correct: correct });
        $('mc-cal-feedback').textContent = (correct ? 'Correct. ' : 'Incorrect. ') + claim.note;
        answers.forEach(function (b) { b.disabled = true; });
        conf.disabled = true;
        locked = true;
        submit.textContent = index < CLAIMS.length - 1 ? 'Next claim' : 'Start again';
      } else {
        if (index < CLAIMS.length - 1) index++;
        else { index = 0; rounds = []; }
        render();
        answers[0].focus();
      }
      drawCalibration(svg, rounds);
      $('mc-cal-summary').textContent = verdictText(summarise(rounds));
    });
    render();
    drawCalibration(svg, rounds);
  }

  function initArbitration() {
    var toggles = Array.prototype.slice.call(document.querySelectorAll('.mc-toggle button'));
    var th = $('mc-arb-th'), grid = $('mc-arb-grid'), kind = 'tracks';
    function render(threshold) {
      var r = simulate(ASSISTANT[kind], ASSISTANT.correct, threshold);
      grid.textContent = '';
      r.cells.forEach(function (cell) {
        var div = document.createElement('div');
        div.className = 'mc-cell ' + (cell.accepted ? 'is-accepted' : 'is-checked') + ' ' + (cell.correct ? 'is-right' : 'is-wrong');
        div.textContent = cell.confidence + '% ' + (cell.correct ? '✓' : '✗');
        grid.appendChild(div);
      });
      grid.setAttribute('aria-label', 'Of 20 answers, I accept ' + (r.acceptedRight + r.acceptedWrong) + ', including ' + r.acceptedWrong + ' wrong, and check ' + r.checked + ' myself.');
      $('mc-arb-wrong').textContent = r.acceptedWrong;
      $('mc-arb-checked').textContent = r.checked;
      $('mc-arb-right').textContent = r.acceptedRight;
      $('mc-arb-read').textContent = arbitrationText(kind, r, threshold);
    }
    toggles.forEach(function (b) {
      b.addEventListener('click', function () { kind = b.dataset.ai; press(toggles, b); render(+th.value); });
    });
    bindRange(th, $('mc-arb-th-out'), render);
  }

  function initPrompts() {
    Array.prototype.forEach.call(document.querySelectorAll('.mc-prompts button'), function (b) {
      b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); });
    });
  }

  function initOffload() {
    var host = $('mc-sort'), labels = { hand: 'Let AI do it', along: 'Work with AI', keep: 'Do it myself' };
    TASKS.forEach(function (task) {
      var row = document.createElement('div'); row.className = 'mc-task';
      var text = document.createElement('p'); text.textContent = task.text;
      var choice = document.createElement('div'); choice.className = 'mc-choice';
      choice.setAttribute('role', 'group'); choice.setAttribute('aria-label', task.text);
      var reply = document.createElement('output');
      var buttons = Object.keys(labels).map(function (pick) {
        var b = document.createElement('button');
        b.type = 'button'; b.dataset.pick = pick; b.textContent = labels[pick]; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () { press(buttons, b); reply.textContent = offloadReply(task, pick); });
        choice.appendChild(b);
        return b;
      });
      row.appendChild(text); row.appendChild(choice); row.appendChild(reply);
      host.appendChild(row);
    });
  }

  initProgress();
  initHero();
  initPhases();
  initPeople();
  initCheck();
  initCalibration();
  initArbitration();
  initPrompts();
  initOffload();
}());
