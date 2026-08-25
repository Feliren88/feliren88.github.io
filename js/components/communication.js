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
    var range = one('#cf-range'), context = one('#cf-context'), check = one('#cf-check');
    if (!range || !context) return;
    var TOTAL = 40;
    var mine = one('#cf-mine'), theirs = one('#cf-theirs');
    var checked = false;

    function dots(host, n, cls) {
      host.innerHTML = '';
      for (var i = 0; i < n; i++) {
        var dot=document.createElement('i');dot.className=cls;host.appendChild(dot);
      }
    }
    function landed(said, shared) {
      /* A share of what you said survives, and that share shrinks as you add
         more. Never more than you said, and the absolute number peaks in the
         middle: that peak is the whole point of the figure. */
      var kept = said * Math.exp(-(said - 1) / (10 + shared * .14));
      if (checked) kept += Math.min(said - kept, 2 + shared * .04);
      return Math.max(0, Math.round(kept));
    }

    function paint() {
      var said = +range.value, shared = +context.value, got = landed(said, shared);
      dots(mine, TOTAL, 'mine');
      dots(theirs, got, 'theirs');
      one('#cf-flow').style.width = (said / TOTAL * 100).toFixed(1)+'%';
      one('#cf-said').textContent = said+(said===1?' idea':' ideas');
      one('#cf-landed-label').textContent=got+(got===1?' idea retained':' ideas retained');
      one('#cf-landed').textContent = got;
      one('#cf-pct').textContent = said ? Math.round(got / said * 100) + '%' : '0%';
      one('#cf-shared').textContent = shared + '%';
      if (check) { check.setAttribute('aria-pressed', checked ? 'true' : 'false'); check.textContent = checked ? 'Understanding checked' : 'Check what they heard'; }
      var say = one('#cf-say');
      if (!say) return;
      say.textContent = checked
        ? 'Their summary exposed the gap and recovered part of the message. Correct the missing piece instead of repeating everything.'
        : said <= 3 && shared < 40
          ? 'The message is short, but the listener lacks the context needed to enter it.'
          : said > 18 && shared < 55
            ? 'Detail has outrun the channel. They are dropping ideas before the message ends.'
            : shared > 70
              ? 'Shared context carries part of the explanation. Say the decision and the difference.'
              : 'The message fits the channel. Ask them to summarize before you add more.';
    }
    range.addEventListener('input', paint); context.addEventListener('input', paint);
    if (check) check.addEventListener('click', function () { checked = !checked; paint(); });
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
    var stress = one('#cf-stress'), current = 'observe';
    function paint(k) {
      current = k;
      all('#cf-frame button').forEach(function (b) { b.classList.toggle('is-on', b.dataset.frame === k); });
      var chain = one('#cf-chain');
      chain.className = 'cf-chain is-' + k;
      chain.innerHTML = CM_FRAME[k].map(function (s, i) {
        return '<span>' + esc(s) + '</span>' + (i < 3 ? '<i aria-hidden="true">&rarr;</i>' : '');
      }).join('');
      var pressure = stress ? +stress.value : 45;
      var defense = Math.min(96, Math.round(k === 'judge' ? 52 + pressure * .44 : 8 + pressure * .3));
      var attention = 100 - defense;
      one('#cf-defense-fill').style.width = attention + '%';
      one('#cf-defense-value').textContent = attention + '%';
      one('#cf-defense-copy').textContent = k === 'judge'
        ? 'The character verdict spends attention on self-defense. Higher pressure leaves less room to examine the event.'
        : pressure > 70
          ? 'A concrete observation preserves some attention, though the room is already strained. Slow down and ask what they heard.'
          : 'The event stays visible. Both people have enough attention left to explain, correct, and agree on a change.';
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-frame]');
      if (b) paint(b.dataset.frame);
    });
    if (stress) stress.addEventListener('input', function () { paint(current); });
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

    function lessonVisual(n, title) {
      var art;
      var established = {
        6: { label: 'BLUF · U.S. Army', url: 'https://www.armyupress.army.mil/Journals/Military-Review/English-Edition-Archives/January-February-2021/McNitt-Military-Writing/', art: '<rect class="va" x="16" y="15" width="112" height="22" rx="4"/><text class="vl" x="72" y="29">BOTTOM LINE</text><path class="vg" d="M28 49H116M28 61H107M28 73H98M28 85H84"/><path class="vb" d="M20 10V91"/>' },
        7: { label: 'Minto Pyramid', url: 'https://www.barbaraminto.com/', art: '<path class="vg" d="M80 29L43 53M80 29L80 53M80 29L117 53M43 69L27 88M43 69L57 88M80 69L72 88M80 69L88 88M117 69L103 88M117 69L133 88"/><rect class="va" x="54" y="12" width="52" height="18" rx="4"/><text class="vl" x="80" y="24">ANSWER</text><rect class="vb" x="25" y="52" width="36" height="17" rx="4"/><rect class="vb" x="62" y="52" width="36" height="17" rx="4"/><rect class="vb" x="99" y="52" width="36" height="17" rx="4"/><text class="vs" x="80" y="63">KEY LINE</text><text class="vs" x="80" y="102">SUPPORTING EVIDENCE</text>' },
        8: { label: 'Minto SCQ', url: 'https://www.barbaraminto.com/', art: '<path class="vg" d="M34 55H126"/><path class="vg" d="M53 50L59 55 53 60M83 50L89 55 83 60M113 50L119 55 113 60"/><circle class="vc" cx="25" cy="55" r="15"/><circle class="vd" cx="65" cy="55" r="15"/><circle class="vb" cx="95" cy="55" r="15"/><circle class="va" cx="135" cy="55" r="15"/><text class="vl" x="25" y="58">S</text><text class="vl" x="65" y="58">C</text><text class="vl" x="95" y="58">Q</text><text class="vl" x="135" y="58">A</text><text class="vs" x="25" y="79">SITUATION</text><text class="vs" x="65" y="79">COMPLICATION</text><text class="vs" x="95" y="79">QUESTION</text><text class="vs" x="135" y="79">ANSWER</text>' },
        9: { label: 'PREP', url: 'https://www.random-topic-generator.com/frameworks/prep', art: '<path class="vg" d="M40 55H119M113 49L120 55 113 61"/><rect class="va" x="14" y="38" width="32" height="34" rx="6"/><rect class="vb" x="48" y="38" width="32" height="34" rx="6"/><rect class="vc" x="82" y="38" width="32" height="34" rx="6"/><rect class="va" x="116" y="38" width="32" height="34" rx="6"/><text class="vl" x="30" y="58">POINT</text><text class="vl" x="64" y="58">REASON</text><text class="vl" x="98" y="58">EXAMPLE</text><text class="vl" x="132" y="58">POINT</text><path class="va" d="M132 34C113 12 48 12 30 34"/>' },
        27: { label: 'LARA · dialogue', url: 'https://bpb-us-e1.wpmucdn.com/blogs.cornell.edu/dist/8/6767/files/2016/05/LARA_UPDATED-24wzz94.pdf', art: '<path class="vg" d="M48 28H109M121 40V70M109 82H48M36 70V40"/><path class="va" d="M102 23L111 28 102 33M126 63L121 72 116 63M56 87L47 82 56 77M31 47L36 38 41 47"/><circle class="va" cx="36" cy="28" r="16"/><circle class="vb" cx="121" cy="28" r="16"/><circle class="vc" cx="121" cy="82" r="16"/><circle class="vd" cx="36" cy="82" r="16"/><text class="vl" x="36" y="30">LISTEN</text><text class="vl" x="121" y="30">AFFIRM</text><text class="vl" x="121" y="84">RESPOND</text><text class="vl" x="36" y="80">ADD</text><text class="vs" x="36" y="88">INFORMATION</text>' },
        30: { label: 'SBI · CCL', url: 'https://www.ccl.org/articles/leading-effectively-articles/closing-the-gap-between-intent-vs-impact-sbii/', art: '<path class="vg" d="M45 55H62M98 55H115"/><path class="vg" d="M56 50L63 55 56 60M109 50L116 55 109 60"/><rect class="vc" x="10" y="35" width="36" height="40" rx="7"/><rect class="vb" x="63" y="35" width="36" height="40" rx="7"/><rect class="va" x="116" y="35" width="36" height="40" rx="7"/><text class="vl" x="28" y="54">SITUATION</text><text class="vs" x="28" y="64">WHEN / WHERE</text><text class="vl" x="81" y="54">BEHAVIOR</text><text class="vs" x="81" y="64">OBSERVED</text><text class="vl" x="134" y="54">IMPACT</text><text class="vs" x="134" y="64">RESULT</text>' },
        31: { label: 'DESC · Bower & Bower', url: 'https://archive.org/details/assertingyoursel00bowe', art: '<path class="vg" d="M38 55H124"/><rect class="vc" x="7" y="39" width="34" height="32" rx="16"/><rect class="vb" x="44" y="39" width="34" height="32" rx="16"/><rect class="va" x="81" y="39" width="34" height="32" rx="16"/><rect class="vd" x="118" y="39" width="34" height="32" rx="16"/><text class="vl" x="24" y="57">DESCRIBE</text><text class="vl" x="61" y="57">EXPRESS</text><text class="vl" x="98" y="57">SPECIFY</text><text class="vl" x="135" y="57">CONSEQUENCE</text>' },
        32: { label: 'NVC · Rosenberg', url: 'https://www.nonviolentcommunication.com/pdf_files/nvc2-chapter-one.html', art: '<path class="vg" d="M39 55H123"/><circle class="vc" cx="22" cy="55" r="17"/><circle class="vd" cx="61" cy="55" r="17"/><circle class="vb" cx="100" cy="55" r="17"/><circle class="va" cx="139" cy="55" r="17"/><text class="vl" x="22" y="53">OBSERVE</text><text class="vs" x="22" y="62">NO JUDGMENT</text><text class="vl" x="61" y="58">FEEL</text><text class="vl" x="100" y="58">NEED</text><text class="vl" x="139" y="58">REQUEST</text>' },
        40: { label: 'BATNA · Getting to Yes', url: 'https://www.pon.harvard.edu/daily/batna/translate-your-batna-to-the-current-deal/', art: '<path class="vg" d="M18 88H145M31 88V22"/><rect class="vc" x="48" y="55" width="28" height="33" rx="4"/><rect class="va" x="96" y="31" width="28" height="57" rx="4"/><path class="vd" d="M31 48H140"/><text class="vl" x="62" y="50">DEAL</text><text class="vl" x="110" y="26">BATNA</text><text class="vs" x="137" y="45">WALK AWAY</text>' },
        43: { label: 'Interests · Getting to Yes', url: 'https://www.pon.harvard.edu/daily/negotiation-skills-daily/types-of-negotiation-skills/', art: '<path class="va" d="M10 43H150"/><path class="vc" d="M23 43L47 15 71 43ZM89 43L113 13 140 43Z"/><path class="vb" d="M23 43L36 92H136L140 43Z"/><text class="vl" x="47" y="32">POSITION</text><text class="vl" x="114" y="31">POSITION</text><text class="vl" x="81" y="63">UNDERLYING INTERESTS</text><text class="vs" x="81" y="75">SHARED · DIFFERENT · COMPATIBLE</text>' },
        86: { label: 'Teach-back · AHRQ', url: 'https://www.ahrq.gov/patient-safety/reports/engage/teachback.html', art: '<path class="vg" d="M48 35H111M118 45V70M109 79H50M41 70V45"/><path class="va" d="M103 30L112 35 103 40M123 62L118 71 113 62M57 84L48 79 57 74M36 53L41 44 46 53"/><text class="vl" x="80" y="22">EXPLAIN CLEARLY</text><text class="vl" x="132" y="57">ASK</text><text class="vl" x="80" y="95">OWN WORDS</text><text class="vl" x="27" y="57">CHECK</text><circle class="vb" cx="80" cy="55" r="18"/><text class="vl" x="80" y="53">CLARIFY</text><text class="vs" x="80" y="62">AND RETEACH</text>' },
        88: { label: 'Pareto · 80/20', url: 'https://en.wikipedia.org/wiki/Pareto_principle', art: '<path class="vg" d="M18 91H146M18 16V91"/><path class="va" d="M18 91C30 48 41 31 50 26C68 17 101 15 146 15"/><path class="vb" d="M44 91V27H18"/><path class="vg" d="M44 27H146" stroke-dasharray="3 3"/><text class="vl" x="44" y="103">20% INPUT</text><text class="vl" x="18" y="22">80%</text><text class="vs" x="104" y="40">VITAL FEW</text>' }
      }[n];
      var structured = {
        4:['Headline','Reason','Evidence','Implication','Detail'],5:['Conclusion','Reason','Implication'],
        6:['Bottom line','Why','Need from you'],7:['Answer','Key-line reasons','Supporting evidence'],
        8:['Situation','Complication','Question','Answer'],9:['Point','Reason','Example','Point restated'],
        10:['First point','Second point','Third point'],14:['High confidence','Moderate confidence','Working hypothesis'],
        16:['Fact','Interpretation','Recommendation'],17:['View','Why','Uncertainty','Recommendation','Need'],
        19:['Silence','Analysis','Certainty','Strong rejection'],22:['Prior knowledge','What they care about','Hidden worry','Usable action'],
        25:['Example','Pattern','Principle'],26:['10 seconds','30 seconds','2 minutes','10 minutes'],
        27:['Listen','Affirm','Respond','Add information'],30:['Situation','Observable behavior','Impact'],
        31:['Describe','Express','Specify','Consequences'],32:['Observation','Feeling','Need','Request'],
        33:['Small problem','Mention it','Observe response','Clarify','Decide'],37:['Ask','Find assumption','Confirm objective','Add evidence','Offer alternative','Invite correction'],
        38:['Their objective','Their obstacle','Your proposal','Evidence','Cost','Next step'],40:['Negotiated deal','Compare with BATNA','Accept or walk away'],43:['Position','Underlying interest','Generate options'],
        41:['Ideal','Target','Minimum acceptable','Walk-away'],48:['Name the error','Name the impact','Correct it'],
        50:['Direction','Meaning','Priorities'],51:['Why','What','What not','Who','When','Decision rights','Success'],
        53:['Objective','Constraints','Authority','Deadline','Quality bar','Check-in'],54:['Continue','Change','Why','Next'],
        56:['Question','Answer','Three reasons','Evidence','Risk','Recommendation','Next action'],58:['They must know','You must learn','Decision wanted','Expected objection','Sentence to say'],
        60:['Decision','Owner','Deadline','Open issue','Next checkpoint'],61:['Subject','Conclusion','Reason','Action'],
        62:['Status','What changed','Why it matters','Next','Need'],67:['Notice','Connect','Ask','Exit'],
        68:['5 sec: identity','20 sec: problem','60 sec: why and difference'],71:['Acknowledge concern','Repeat decision','Repeat without new reasons'],
        75:['Explain','Responsibility','Regret','Repair','Prevent repeat','Request forgiveness'],76:['Acknowledgment','Repair','Changed behavior'],
        77:['Known','Unknown','What we are doing','What people should do','Next information','Consistent updates','Trusted messenger','Information may change'],78:['Known','Unknown','Recommendation','Downside if wrong','Change trigger'],
        86:['Explain clearly','Ask for own words','Check understanding','Clarify and reteach'],87:['What is it?','Why it matters','How it works','Example','Exception'],
        89:['Answer','Stop at complete'],96:['Recommendation','Business consequence','Risk','Ask'],
        97:['Why','Good outcome','Decision freedom','Escalation point'],100:['Term','Plain definition','Example'],
        105:['Your outcome','Their outcome','Must understand','Need to learn','Sentence to say'],
        106:['Listen','Headline','Three reasons','Check understanding','Invite view','Surface disagreement','Decision','Next step'],
        107:['Decision','Unresolved','Owner','Deadline','Intent matched?','Written recap'],
        108:['Thinking','Disagreement','Emotional','Strategic'],115:['Unknown','Current guess','Needed information','Return time'],
        116:['Recommendation','Reasons','Largest risk','Change condition'],117:['Shared objective','Disputed assumption','Concern','Test instead'],
        118:['Situation','Result','Needed change'],119:['Listen','Think together','Solve'],120:['Capacity','Trade-off','Choose priority'],
        121:['Outcome','Audience','Headline','Three reasons','Concern','Ask'],122:['Right part','Right order','Right depth','Implication','Room to respond','Next right action']
      }[n];
      var sources = {
        10:{label:'Rule of three · Toastmasters',url:'https://content.toastmasters.org/image/upload/toastmaster-magazine-april-2011.pdf'},
        71:{label:'Broken record · CCI',url:'https://www.cci.health.wa.gov.au/-/media/CCI/Consumer-Modules/Assert-Yourself/Assert-Yourself---04---How-to-Behave-More-Assertively.pdf'},
        75:{label:'Effective apology · Berkeley',url:'https://ggia.berkeley.edu/practice/making_an_effective_apology'},
        77:{label:'Crisis communication · GCS',url:'https://www.communications.gov.uk/publication/crisis-comms-planning-guide/'}
      }[n];
      function numberedFlow(steps, cycle) {
        var count=steps.length, points=[];
        if(cycle){points=[[80,18],[128,55],[80,92],[32,55]];}
        else if(count<=4){for(var i=0;i<count;i++)points.push([24+(count===1?56:i*112/(count-1)),55]);}
        else {var top=Math.ceil(count/2), bottom=count-top, j;for(j=0;j<top;j++)points.push([22+(top===1?58:j*116/(top-1)),30]);for(j=0;j<bottom;j++)points.push([138-(bottom===1?58:j*116/(bottom-1)),80]);}
        var paths='';for(var p=0;p<points.length-1;p++)paths+='<path class="vg" d="M'+points[p][0]+' '+points[p][1]+'L'+points[p+1][0]+' '+points[p+1][1]+'"/>';
        if(cycle)paths+='<path class="vg" d="M32 55Q32 18 70 18"/>';
        return paths+points.map(function(pt,i){return '<circle class="'+(['va','vb','vc','vd'][i%4])+'" cx="'+pt[0]+'" cy="'+pt[1]+'" r="11"/><text class="vn" x="'+pt[0]+'" y="'+(pt[1]+3)+'">'+(i+1)+'</text>';}).join('');
      }
      if(structured && (!established || [8,9,27,30,31,32,86].indexOf(n)>-1)) art=numberedFlow(structured,n===27||n===86);
      if (established) {
        if(!art) art = established.art;
      } else if (!art) {
        /* Every non-framework lesson has its own hand-drawn semantic symbol.
           It is the illustration—not a badge pasted onto a category chart. */
        art = '<circle class="vhalo" cx="80" cy="52" r="39"/>' +
          '<path class="vorbit" d="M24 72C47 94 111 98 139 65"/>' +
          '<circle class="vdot" cx="26" cy="72" r="3"/><circle class="vdot" cx="138" cy="65" r="3"/>' +
          '<svg class="vlesson" x="48" y="20" width="64" height="64"><use href="#cmi-' + n + '"/></svg>';
      }
      var credit=established||sources;
      var caption = credit ? '<a href="' + credit.url + '" target="_blank" rel="noopener">' + esc(credit.label) + '</a>' : esc(title);
      var key=structured?'<ol class="cm-viz-key">'+structured.map(function(step,i){return '<li><b>'+(i+1)+'</b><span>'+esc(step)+'</span></li>';}).join('')+'</ol>':'';
      return '<figure class="cm-lesson-viz'+(structured?' has-key':'')+'" role="img" aria-label="' + esc(title + ': lesson illustration') + '"><svg viewBox="0 0 160 110" aria-hidden="true">' + art + '</svg>'+key+'<figcaption>' + caption + ' · ' + String(n).padStart(3, '0') + '</figcaption></figure>';
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
      summary.insertAdjacentHTML('beforeend', lessonVisual(n, title));
      var tagRow = document.createElement('div');
      tagRow.className = 'cm-lesson-tags';
      tagRow.innerHTML = tags.map(function (tag) { return '<span>' + esc(tag) + '</span>'; }).join('');
      var body = document.createElement('div');
      body.className = 'cm-lesson-body';
      Array.prototype.slice.call(article.children).forEach(function (child) {
        if (child !== oldHeader) body.appendChild(child);
      });
      card.appendChild(summary);
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
