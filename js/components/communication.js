/** Communication 101 — progressive disclosure and practice tools. */
(function () {
  'use strict';
  var one = function (s, root) { return (root || document).querySelector(s); };
  var all = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };

  var objectives = {
    inform: ['Inform', 'State the headline, give the minimum context, then check what they understood.'],
    understand: ['Understand', 'Ask how they see the situation. Reflect their answer before adding your view.'],
    clarify: ['Clarify', 'Separate facts, interpretations, and unknowns. Name the exact question that remains.'],
    decide: ['Decide', 'State the choice, criteria, deadline, and who has the decision right.'],
    persuade: ['Persuade', 'Begin with their objective and obstacle. Offer evidence, cost, and one small next step.'],
    negotiate: ['Negotiate', 'Know your alternative and four numbers. State your position, give one reason, then stop.'],
    coordinate: ['Coordinate', 'Close with the decision, owner, deadline, unresolved issue, and next checkpoint.'],
    support: ['Support', 'Ask whether they want you to listen, think with them, or help solve it.'],
    correct: ['Correct', 'Describe the situation, behavior, and impact. State what must change next.'],
    protect: ['Protect', 'State the boundary plainly. Explain the consequence only if it helps clarify the boundary.'],
    repair: ['Repair', 'Name what happened, acknowledge the impact, take responsibility, and make a concrete correction.'],
    connect: ['Connect', 'Give attention, curiosity, and relational context. The relationship is the outcome.']
  };
  all('[data-objective]').forEach(function (button) {
    button.addEventListener('click', function () {
      all('[data-objective]').forEach(function (b) { b.classList.remove('is-on'); });
      button.classList.add('is-on');
      var x = objectives[button.dataset.objective];
      one('#cm-objective-out').innerHTML = '<b>' + x[0] + ':</b> ' + x[1];
    });
  });

  var levels = {
    1: ['Level 1 · Headline', '“I think we should postpone the launch by two weeks.”'],
    2: ['Level 2 · Reason', '“The product is ready, but monitoring and customer support are not.”'],
    3: ['Level 3 · Evidence', '“Three unresolved failures can cause customer-facing outages, and support coverage is incomplete.”'],
    4: ['Level 4 · Implication', '“Launching now saves two weeks but creates a much larger reputational risk.”'],
    5: ['Level 5 · Detail', 'Now show the failure modes, monitoring thresholds, staffing gaps, owners, and dates.']
  };
  all('#cm-ladder button').forEach(function (button, index) {
    if (index === 0) button.classList.add('is-on');
    button.addEventListener('click', function () {
      all('#cm-ladder button').forEach(function (b) { b.classList.remove('is-on'); });
      button.classList.add('is-on');
      var x = levels[button.dataset.level];
      one('#cm-ladder-read').innerHTML = '<small>' + x[0] + '</small><p>' + x[1] + '</p>';
    });
  });

  var longText = one('#cm-long');
  if (longText) {
    function count() {
      var words = longText.value.trim() ? longText.value.trim().split(/\s+/).length : 0;
      one('#cm-word-count').textContent = words;
      one('#cm-time').textContent = Math.ceil(words / 2.4) + ' sec';
      one('#cm-meter-fill').style.width = Math.min(100, words / 180 * 100) + '%';
    }
    longText.addEventListener('input', count);
    count();
  }

  var support = {
    listen: 'Listen: stay present, acknowledge, and reflect. Do not turn their experience into a problem to fix.',
    think: 'Think together: ask what they have considered, what feels unclear, and what would change the picture.',
    solve: 'Solve: define the problem, constraints, options, and next useful action together.'
  };
  all('[data-support]').forEach(function (button) {
    button.addEventListener('click', function () {
      all('[data-support]').forEach(function (b) { b.classList.remove('is-on'); });
      button.classList.add('is-on');
      one('#cm-support-out').textContent = support[button.dataset.support];
    });
  });

  var contexts = {
    digital: ['Digital communication', [
      ['Tone needs help', 'Short messages sound colder when conflict, hierarchy, or sensitive timing is present. Add one sentence of intent.'],
      ['Personal text', 'Keep the boundary and add connection: “I cannot tonight. I do want to see you. Saturday?”'],
      ['Serious conflict', 'Name the issue by text, then move the conversation to voice or in person.'],
      ['Written update', 'Subject → conclusion → reason → action. Put the request near the top.']]],
    relationship: ['Relationships and family', [
      ['Family pressure', 'Use a broken record: “I understand your concern. My decision is still X.”'],
      ['Make the internal external', '“I am stressed and quieter than usual. It is not about you.”'],
      ['Needs, not tests', 'Ask for initiative, memory, reassurance, or space directly. Tests create ambiguity.'],
      ['Request or boundary', 'A request asks willingness. A boundary says what you cannot continue. Know which you mean.']]],
    network: ['Networking', [
      ['Notice', 'Name something specific about their work.'],
      ['Connect', 'Explain why it matters to you.'],
      ['Ask and exit', 'Ask one real question without trapping them.'],
      ['5–20–60', 'Prepare three introductions: who you are, the problem you work on, and why your approach matters. Follow up within 48 hours.']]],
    crisis: ['Crisis and high stakes', [
      ['What happened?', 'State facts without drama.'],
      ['What is safe?', 'Name what has been stabilised.'],
      ['What is unknown?', 'Do not speculate.'],
      ['What next?', 'State the immediate action and the time of the next update. Slow certainty, not clarity.']]],
    audience: ['Adapt to the audience', [
      ['Senior', 'Recommendation → business consequence → risk → ask.'],
      ['Junior', 'Give context, define good work, state their authority, and say when to escalate.'],
      ['Peer', 'Make reciprocity explicit: “I can own A. Can you own B?”'],
      ['Expert / non-expert', 'Align definitions with experts. For non-experts use term → plain definition → example.']]]
  };
  function showContext(key) {
    var x = contexts[key];
    one('#cm-context-panel').innerHTML = '<h3>' + x[0] + '</h3><div class="cm-context-grid">' + x[1].map(function (item) { return '<article><b>' + item[0] + '</b><p>' + item[1] + '</p></article>'; }).join('') + '</div>';
  }
  all('[data-context]').forEach(function (button) {
    button.addEventListener('click', function () {
      all('[data-context]').forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
      button.setAttribute('aria-selected', 'true');
      showContext(button.dataset.context);
    });
  });
  if (one('#cm-context-panel')) showContext('digital');

  var progress = one('#cm-progress-fill');
  function paintProgress() {
    if (!progress) return;
    var max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? Math.min(100, scrollY / max * 100) : 0) + '%';
  }
  addEventListener('scroll', paintProgress, { passive: true });
  addEventListener('resize', paintProgress);
  paintProgress();

  var links = all('.cm-rail a');
  if ('IntersectionObserver' in window && links.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.classList.toggle('is-current', link.hash === '#' + entry.target.id); });
      });
    }, { rootMargin: '-22% 0px -65% 0px' });
    links.forEach(function (link) { var section = one(link.hash); if (section) observer.observe(section); });
  }
})();
