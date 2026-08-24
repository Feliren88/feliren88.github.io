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

  /* ══ Nine working figures ══════════════════════════════
     Each one takes a single control and shows the consequence immediately.
     The picture is the argument, not an illustration of it: move the control
     and the claim in the surrounding text demonstrates itself. Numbers are
     illustrative and shaped to make one point, not measurements.

     Written for a reader who gets there faster by moving something than by
     reading a paragraph first. Every figure works in one glance, has one
     control, and labels in two or three words. */

  function svgNS(n, a, t) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', n);
    Object.keys(a || {}).forEach(function (k) { e.setAttribute(k, a[k]); });
    if (t != null) e.textContent = t;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ── 1 · Saying more transfers less ──
     Forty things sit in your head. Say too few and they cannot follow. Say too
     many and they keep a shrinking share. The curve peaks in between. */
  function figTransfer() {
    var range = one('#cf-range');
    if (!range) return;
    var TOTAL = 40;
    var mine = one('#cf-mine'), theirs = one('#cf-theirs');

    function dots(host, n, cls, x0, y0) {
      host.innerHTML = '';
      for (var i = 0; i < n; i++) {
        host.appendChild(svgNS('circle', {
          cx: x0 + (i % 5) * 15, cy: y0 + Math.floor(i / 5) * 15, r: 5, class: cls
        }));
      }
    }
    function landed(said) {
      /* A share of what you said survives, and that share shrinks as you add
         more. Never more than you said, and the absolute number peaks in the
         middle: that peak is the whole point of the figure. */
      return Math.max(0, Math.round(said * Math.exp(-(said - 1) / 14)));
    }

    function paint() {
      var said = +range.value, got = landed(said);
      dots(mine, TOTAL, 'cf-dot mine', 28, 32);
      dots(theirs, got, 'cf-dot theirs', 456, 32);
      one('#cf-flow').setAttribute('width', (said / TOTAL * 260).toFixed(1));
      one('#cf-said').textContent = said;
      one('#cf-landed').textContent = got;
      one('#cf-pct').textContent = said ? Math.round(got / said * 100) + '%' : '0%';
      var say = one('#cf-say');
      if (!say) return;
      say.textContent = said <= 3
        ? 'Too little. They cannot reach the idea from here.'
        : got >= landed(said - 1) && got >= landed(said + 1)
          ? 'About right. This is as much as gets through.'
          : said > 14
            ? 'You are saying more and they are keeping less.'
            : 'Still climbing. A little more would land.';
    }
    range.addEventListener('input', paint);
    paint();
  }

  /* ── 2 · Two people, two jobs ── */
  var CM_OBJ = [
    ['Inform', 'know something'], ['Understand', 'learn how they see it'],
    ['Clarify', 'establish what is happening'], ['Decide', 'make a choice'],
    ['Persuade', 'change a belief'], ['Negotiate', 'reach terms'],
    ['Coordinate', 'agree what happens next'], ['Support', 'feel understood'],
    ['Correct', 'address an error'], ['Protect', 'set a boundary'],
    ['Repair', 'mend something'], ['Connect', 'be closer']
  ];
  var CM_CLASH = {
    'Decide|Support': 'You are solving. They want to be understood.',
    'Persuade|Support': 'You are pushing. They want to be heard.',
    'Correct|Support': 'You are correcting. They came to be understood.',
    'Inform|Decide': 'You are explaining. They are waiting for a choice.',
    'Understand|Decide': 'You are exploring. They want it settled.',
    'Clarify|Decide': 'You are still defining it. They want to move.',
    'Support|Decide': 'You are comforting. They need a decision.',
    'Negotiate|Connect': 'You are trading. They wanted closeness.',
    'Correct|Connect': 'You are correcting. They wanted closeness.',
    'Decide|Understand': 'You are closing it. They are still opening it.',
    'Persuade|Understand': 'You are arguing. They are still looking.',
    'Protect|Connect': 'You are drawing a line. They are reaching for you.',
    'Repair|Decide': 'You are mending. They want the outcome.'
  };
  function figObjective() {
    var a = one('#cf-mine-opts'), b = one('#cf-their-opts');
    if (!a || !b) return;
    var mine = 'Decide', theirs = 'Support';

    function fill(host, side) {
      host.innerHTML = CM_OBJ.map(function (o) {
        return '<button type="button" data-o="' + o[0] + '">' + o[0] + '</button>';
      }).join('');
      host.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-o]');
        if (!btn) return;
        if (side === 'mine') mine = btn.dataset.o; else theirs = btn.dataset.o;
        paint();
      });
    }
    function paint() {
      all('#cf-mine-opts button').forEach(function (x) { x.classList.toggle('is-on', x.dataset.o === mine); });
      all('#cf-their-opts button').forEach(function (x) { x.classList.toggle('is-on', x.dataset.o === theirs); });
      var v = one('#cf-verdict');
      if (!v) return;
      var clash = CM_CLASH[mine + '|' + theirs];
      var same = mine === theirs;
      v.className = 'cf-verdict ' + (same ? 'is-ok' : clash ? 'is-bad' : 'is-warn');
      v.innerHTML = same
        ? '<b>Same job.</b> You both want to ' + esc(CM_OBJ.filter(function (o) { return o[0] === mine; })[0][1]) + '.'
        : clash
          ? '<b>Collision.</b> ' + esc(clash)
          : '<b>Different jobs.</b> You want to ' + esc(mine.toLowerCase()) + '. They want to ' +
            esc(theirs.toLowerCase()) + '. Name that out loud before you continue.';
    }
    fill(a, 'mine'); fill(b, 'theirs'); paint();
  }

  /* ── 3 · One idea, five depths ── */
  var CM_DEPTH = [
    ['We should delay the launch by two weeks.', 'Anyone. This is the headline.'],
    ['We should delay two weeks, because the payment path still fails for some users.', 'Someone who needs the reason.'],
    ['Delay two weeks. Payments fail for about one in twenty at checkout, and we cannot yet reproduce it reliably.', 'Someone who will act on it.'],
    ['Delay two weeks. Payment failures cluster on one provider and one card type. We can ship behind a flag, but support load would rise before we have the fix.', 'Someone weighing the trade-off.'],
    ['Delay two weeks. The failure is in the retry path: a timeout is treated as a decline, so the charge succeeds and the order does not. Rolling forward means manual reconciliation for every affected order.', 'Someone who will fix it.']
  ];
  function figDepth() {
    var r = one('#cf-depth');
    if (!r) return;
    var bars = one('#cf-depth-bars');
    if (bars) bars.innerHTML = CM_DEPTH.map(function (_, i) { return '<i data-d="' + (i + 1) + '"></i>'; }).join('');
    function paint() {
      var d = +r.value;
      all('#cf-depth-bars i').forEach(function (x, i) { x.classList.toggle('is-on', i < d); });
      one('#cf-depth-msg').textContent = CM_DEPTH[d - 1][0];
      one('#cf-depth-for').textContent = CM_DEPTH[d - 1][1];
    }
    r.addEventListener('input', paint);
    paint();
  }

  /* ── 4 · What silence costs ── */
  function figSilence() {
    var r = one('#cf-days');
    if (!r) return;
    var X0 = 40, X1 = 520, Y0 = 52, Y1 = 150;
    function h(d) { return Math.min(1, Math.pow(d / 30, 1.7) * 1.25); }
    function px(d) { return X0 + d / 30 * (X1 - X0); }
    function py(v) { return Y1 - v * (Y1 - Y0); }
    function paint() {
      var d = +r.value, v = h(d), path = '';
      for (var i = 0; i <= d; i++) path += (i ? 'L' : 'M') + px(i).toFixed(1) + ' ' + py(h(i)).toFixed(1);
      if (!d) path = 'M' + px(0) + ' ' + py(0);
      one('#cf-grow').setAttribute('d', path);
      var head = one('#cf-head');
      head.setAttribute('cx', px(d)); head.setAttribute('cy', py(v));
      head.classList.toggle('is-over', v >= 1);
      one('#cf-day-n').textContent = d;
      var mins = Math.round(1 + Math.pow(d, 1.6) * 1.6);
      one('#cf-cost').textContent = v >= 1 ? 'too late' : (mins < 60 ? mins + ' min' : (mins / 60).toFixed(1) + ' hr');
      one('#cf-silence-say').textContent = d === 0
        ? 'One minute now. This is the cheapest it will ever be.'
        : v >= 1
          ? 'It arrives as a rejection, and the reasons look sudden to them.'
          : 'Still sayable, and it costs more than it did yesterday.';
    }
    r.addEventListener('input', paint);
    paint();
  }

  /* ── 5 · The point comes last ── */
  var CM_SPEECH = [
    'the background', 'what we tried', 'what went wrong', 'how I feel about it',
    'what I actually need'
  ];
  function figListen() {
    var r = one('#cf-cut');
    if (!r) return;
    var track = one('#cf-track');
    if (track) track.innerHTML = CM_SPEECH.map(function (s, i) {
      return '<span data-i="' + i + '"><em>' + esc(s) + '</em></span>';
    }).join('');
    function paint() {
      var cut = +r.value, segs = CM_SPEECH.length;
      var reached = Math.floor(cut / 100 * segs);
      all('#cf-track span').forEach(function (x, i) {
        x.classList.toggle('is-heard', i < reached);
        x.classList.toggle('is-point', i === segs - 1);
      });
      one('#cf-heard').textContent = cut + '%';
      var got = reached >= segs;
      one('#cf-point').textContent = got ? 'Heard' : 'Missed';
      one('#cf-point').className = got ? 'is-ok' : 'is-bad';
      one('#cf-listen-say').textContent = got
        ? 'You waited. What they needed was in the last part.'
        : 'You have their setup and not their request.';
    }
    r.addEventListener('input', paint);
    paint();
  }

  /* ── 6 · Same event, two sentences ── */
  var CM_FRAME = {
    judge: ['You never reply to anything', 'They defend themselves', 'The event is now in dispute', 'Nothing changes'],
    observe: ['Three messages, no reply, four days', 'They explain what happened', 'You both see the same event', 'You can agree a fix']
  };
  function figConflict() {
    var host = one('#cf-frame');
    if (!host) return;
    function paint(k) {
      all('#cf-frame button').forEach(function (b) { b.classList.toggle('is-on', b.dataset.frame === k); });
      var chain = one('#cf-chain');
      chain.className = 'cf-chain is-' + k;
      chain.innerHTML = CM_FRAME[k].map(function (s, i) {
        return '<span>' + esc(s) + '</span>' + (i < 3 ? '<i aria-hidden="true">&rarr;</i>' : '');
      }).join('');
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-frame]');
      if (b) paint(b.dataset.frame);
    });
    paint('observe');
  }

  /* ── 7 · One bridge at a time ── */
  function figInfluence() {
    var r = one('#cf-dist');
    if (!r) return;
    var X0 = 40, X1 = 500;
    function paint() {
      var d = +r.value, x = X0 + d / 10 * (X1 - X0);
      one('#cf-ask').setAttribute('cx', x.toFixed(1));
      one('#cf-ask-lab').setAttribute('x', x.toFixed(1));
      var steps = Math.max(1, Math.ceil(d / 3));
      var g = one('#cf-bridges');
      g.innerHTML = '';
      for (var i = 1; i < steps; i++) {
        var bx = X0 + (x - X0) * (i / steps);
        g.appendChild(svgNS('circle', { cx: bx.toFixed(1), cy: 96, r: 5, class: 'cf-bridge' }));
      }
      one('#cf-steps').textContent = steps;
      var far = d > 6;
      one('#cf-odds').textContent = far ? 'Low' : d > 3 ? 'Fair' : 'High';
      one('#cf-odds').className = far ? 'is-bad' : d > 3 ? 'is-warn' : 'is-ok';
      one('#cf-inf-say').textContent = far
        ? 'Too far in one move. Ask for the first stop instead.'
        : steps > 1
          ? 'Reachable in ' + steps + ' steps. Name the first one only.'
          : 'Close enough to ask directly.';
    }
    r.addEventListener('input', paint);
    paint();
  }

  /* ── 8 · Every unsaid thing costs ── */
  var CM_SW = {
    priority: 'which one matters most', owner: 'who is doing it',
    standard: 'what good looks like', tradeoff: 'what we are giving up'
  };
  function figLead() {
    var host = one('#cf-switches');
    if (!host) return;
    var on = {};
    function paint() {
      var keys = Object.keys(CM_SW);
      var left = keys.filter(function (k) { return !on[k]; });
      all('#cf-switches button').forEach(function (b) { b.classList.toggle('is-on', !!on[b.dataset.sw]); });
      one('#cf-cost-fill').style.width = (left.length / keys.length * 100) + '%';
      one('#cf-cost-lab').textContent = left.length
        ? left.length + (left.length === 1 ? ' thing left to guess' : ' things left to guess')
        : 'Nothing left to guess';
      one('#cf-lead-say').textContent = left.length
        ? 'They are still guessing ' + left.map(function (k) { return CM_SW[k]; }).join(', ') + '.'
        : 'Every one of them is stated. This is what removes the guessing.';
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-sw]');
      if (!b) return;
      on[b.dataset.sw] = !on[b.dataset.sw];
      paint();
    });
    paint();
  }

  /* ── 9 · Same truth, four formats ── */
  var CM_CTX = {
    work:   { d: [70, 80, 55, 85], m: 'The launch slips two weeks. Payments fail at checkout. I own the fix and will update on Friday.' },
    close:  { d: [95, 40, 30, 30], m: 'I need to move the launch. I know you rearranged things for it, and I am sorry. Can we talk tonight?' },
    crisis: { d: [40, 35, 95, 70], m: 'Launch is on hold. Payments are failing. Stop the announcement. I will have detail in an hour.' },
    public: { d: [65, 45, 50, 90], m: 'We are taking two more weeks before launch to fix a payment issue. New date on Friday.' }
  };
  var CM_DIAL = ['Warmth', 'Detail', 'Speed', 'Structure'];
  function figContext() {
    var host = one('#cf-ctx');
    if (!host) return;
    function paint(k) {
      all('#cf-ctx button').forEach(function (b) { b.classList.toggle('is-on', b.dataset.ctx === k); });
      var c = CM_CTX[k];
      one('#cf-dials').innerHTML = CM_DIAL.map(function (name, i) {
        return '<div class="cf-dial"><span>' + name + '</span>' +
          '<i><em style="width:' + c.d[i] + '%"></em></i></div>';
      }).join('');
      one('#cf-ctx-msg').textContent = c.m;
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-ctx]');
      if (b) paint(b.dataset.ctx);
    });
    paint('work');
  }

  /* ── Complete reference · independent, filterable lesson cards ── */
  function manualLibrary() {
    var manual = one('#complete-manual');
    var filters = one('#cm-manual-filters');
    if (!manual || !filters) return;

    var topics = {
      Foundations: [1, 2, 3, 11, 12, 13, 16, 17, 24, 25, 26, 52, 88, 89, 104, 121, 122],
      Structure: [4, 5, 6, 7, 8, 9, 10, 11, 13, 16, 17, 24, 25, 26, 56, 57, 61, 62, 63, 87, 88, 89, 116, 121],
      Confidence: [14, 15, 18, 19, 20, 21, 46, 47, 78, 82, 83, 90, 102, 103, 108, 115],
      Listening: [3, 12, 22, 23, 27, 28, 29, 34, 36, 37, 49, 55, 76, 85, 86, 91, 94, 95, 100, 119],
      Conflict: [19, 30, 31, 33, 34, 35, 36, 37, 48, 49, 54, 75, 76, 79, 80, 81, 83, 84, 85, 90, 109, 110, 117, 118],
      Influence: [23, 35, 36, 37, 38, 39, 43, 44, 67, 68, 69, 93, 94, 96, 99, 100, 117],
      Negotiation: [31, 40, 41, 42, 43, 44, 45, 46, 71, 74, 81, 111, 112, 120],
      Leadership: [6, 16, 45, 48, 49, 50, 51, 53, 54, 55, 56, 57, 58, 59, 60, 62, 63, 77, 78, 96, 97, 98, 105, 106, 107, 113, 118, 120],
      Relationships: [28, 29, 32, 33, 34, 64, 65, 66, 70, 71, 72, 73, 74, 75, 76, 79, 80, 81, 91, 92, 93, 95, 110, 114, 119],
      Writing: [6, 7, 8, 11, 16, 24, 25, 56, 57, 61, 62, 63, 64, 65, 66, 77, 78, 87, 88],
      'High stakes': [20, 31, 40, 41, 42, 46, 47, 77, 78, 79, 80, 81, 82, 96, 101, 111, 112, 115],
      Scripts: [5, 6, 9, 17, 21, 27, 30, 31, 32, 45, 47, 51, 53, 54, 60, 62, 68, 75, 77, 78, 105, 106, 107, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121]
    };
    var tagByRule = {};
    Object.keys(topics).forEach(function (topic) {
      topics[topic].forEach(function (n) {
        (tagByRule[n] || (tagByRule[n] = [])).push(topic);
      });
    });

    function lessonVisual(n, title, tags) {
      var topic = tags[0], k = n % 5, art;
      if (topic === 'Structure' || topic === 'Writing') {
        art = '<path class="vg" d="M16 24H144M16 55H144M16 86H144"/><rect class="va" x="16" y="16" width="' + (106-k*7) + '" height="16" rx="8"/><rect class="vb" x="16" y="47" width="' + (82-k*5) + '" height="16" rx="8"/><rect class="vc" x="16" y="78" width="' + (54-k*3) + '" height="16" rx="8"/>';
      } else if (topic === 'Confidence' || topic === 'High stakes') {
        art = '<path class="vg" d="M22 88A58 58 0 0 1 138 88"/><path class="vb" d="M22 88A58 58 0 0 1 80 30"/><path class="va" d="M80 30A58 58 0 0 1 138 88"/><path class="vi" d="M80 88L' + (45+k*14) + ' ' + (42+k*3) + '"/><circle class="va" cx="80" cy="88" r="6"/>';
      } else if (topic === 'Listening' || topic === 'Relationships') {
        art = '<circle class="vb" cx="47" cy="55" r="31"/><circle class="va" cx="113" cy="55" r="31"/><path class="vg" d="M70 55C78 ' + (28+k*4) + ' 85 ' + (82-k*3) + ' 92 55"/><circle class="vc" cx="80" cy="55" r="' + (7+k*2) + '"/>';
      } else if (topic === 'Conflict' || topic === 'Influence' || topic === 'Negotiation') {
        art = '<circle class="vi" cx="20" cy="55" r="7"/><path class="vd" d="M27 55C56 55 58 22 84 22H140"/><path class="va" d="M27 55C56 55 58 88 84 88H140"/><circle class="vd" cx="140" cy="22" r="7"/><circle class="va" cx="140" cy="88" r="7"/><path class="vg" d="M78 14V97"/>';
      } else if (topic === 'Leadership') {
        art = '<circle class="va" cx="80" cy="22" r="11"/><path class="vg" d="M80 33V51M80 51L35 78M80 51L80 84M80 51L125 78"/><circle class="vc" cx="35" cy="80" r="12"/><circle class="vc" cx="80" cy="86" r="12"/><circle class="vc" cx="125" cy="80" r="12"/>';
      } else if (topic === 'Scripts') {
        art = '<rect class="vc" x="12" y="18" width="38" height="28" rx="6"/><rect class="vb" x="61" y="18" width="38" height="28" rx="6"/><rect class="va" x="110" y="66" width="38" height="28" rx="6"/><path class="vg" d="M50 32H61M80 46V80H110"/>';
      } else {
        art = '<circle class="vb" cx="28" cy="55" r="21"/><circle class="va" cx="132" cy="55" r="21"/><path class="vg" d="M49 55H111"/><path class="va" d="M76 42L90 55 76 68"/><circle class="vc" cx="80" cy="55" r="' + (5+k*2) + '"/>';
      }
      return '<figure class="cm-lesson-viz" role="img" aria-label="' + esc(title + ': ' + topic + ' diagram') + '"><svg viewBox="0 0 160 110" aria-hidden="true">' + art + '</svg><figcaption>' + esc(topic) + '</figcaption></figure>';
    }

    var grid = document.createElement('div');
    grid.className = 'cm-manual-grid';
    var cards = [];
    all('.cm-chapter-body>article', manual).forEach(function (article) {
      var n = +(article.id.match(/\d+/) || [0])[0];
      var oldHeader = article.querySelector(':scope>header');
      if (!oldHeader) return;
      var title = oldHeader.querySelector('h3').textContent;
      var tags = tagByRule[n] || ['Foundations'];
      var card = document.createElement('details');
      card.className = 'cm-lesson-card';
      card.id = article.id;
      card.dataset.tags = tags.join('|');
      var summary = document.createElement('summary');
      summary.innerHTML = '<span class="cm-lesson-number">' + String(n).padStart(2, '0') + '</span>' +
        '<span class="cm-lesson-title">' + esc(title) + '</span><i aria-hidden="true"></i>';
      var tagRow = document.createElement('div');
      tagRow.className = 'cm-lesson-tags';
      tagRow.innerHTML = tags.map(function (tag) { return '<span>' + esc(tag) + '</span>'; }).join('');
      var body = document.createElement('div');
      body.className = 'cm-lesson-body';
      Array.prototype.slice.call(article.children).forEach(function (child) {
        if (child !== oldHeader) body.appendChild(child);
      });
      card.appendChild(summary);
      card.insertAdjacentHTML('beforeend', lessonVisual(n, title, tags));
      card.appendChild(tagRow);
      card.appendChild(body);
      grid.appendChild(card);
      cards.push(card);
    });
    all('.cm-chapter', manual).forEach(function (chapter) { chapter.remove(); });
    var finalRules = one('.cm-final-rules', manual);
    manual.insertBefore(grid, finalRules);

    var active = 'All';
    var names = ['All'].concat(Object.keys(topics));
    filters.innerHTML = names.map(function (name) {
      return '<button type="button" data-topic="' + esc(name) + '" aria-pressed="' + (name === 'All') + '">' + esc(name) + '</button>';
    }).join('');
    function paint() {
      var shown = 0;
      cards.forEach(function (card) {
        var visible = active === 'All' || card.dataset.tags.split('|').indexOf(active) > -1;
        card.hidden = !visible;
        if (visible) shown++;
      });
      all('button', filters).forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.dataset.topic === active));
      });
      one('#cm-manual-count').textContent = shown + (shown === 1 ? ' lesson' : ' lessons');
    }
    filters.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-topic]');
      if (!button) return;
      active = button.dataset.topic;
      paint();
    });
    paint();
    if (/^#cm-rule-\d+$/.test(window.location.hash)) {
      var linkedCard = one(window.location.hash, grid);
      if (linkedCard) {
        linkedCard.open = true;
        window.requestAnimationFrame(function () { linkedCard.scrollIntoView(); });
      }
    }
  }

  [manualLibrary, figTransfer, figObjective, figDepth, figSilence, figListen,
   figConflict, figInfluence, figLead, figContext].forEach(function (fn) {
    try { fn(); } catch (e) { /* one figure must not take the page down */ }
  });

})();
