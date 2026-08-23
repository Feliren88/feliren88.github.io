/**
 * High Agency — interactive layer for /high-agency/
 *
 * Every widget is independent and fails quietly if its markup is absent,
 * so the page still reads as a plain essay with JavaScript switched off.
 * Colour comes entirely from CSS custom properties, so both themes work
 * without any work here.
 */
(function () {
  'use strict';

  var STORE = 'ha:';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function save(key, val) {
    try { localStorage.setItem(STORE + key, JSON.stringify(val)); } catch (e) { /* private mode */ }
  }
  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(STORE + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }

  function svgEl(name, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  /* ══ Reading progress ══════════════════════════════════ */
  function progress() {
    var bar = $('#ha-progress-fill');
    if (!bar) return;
    var ticking = false;
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? clamp(window.scrollY / h, 0, 1) * 100 : 0) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ══ The jail cell question ════════════════════════════ */
  function jailCell() {
    var input = $('#ha-anchor-input');
    var btn = $('#ha-anchor-btn');
    var out = $('#ha-anchor-out');
    if (!input || !btn || !out) return;

    function broadcast(name) {
      $$('.ha-echo-name').forEach(function (n) { n.textContent = name || 'that person'; });
    }

    function commit() {
      var name = input.value.trim();
      if (!name) {
        out.innerHTML = 'Put a real name in. The exercise only works when it is a specific person.';
        return;
      }
      save('anchor', name);
      broadcast(name);
      out.innerHTML = 'You picked <b>' + escapeHtml(name) + '</b>. Now the harder question. ' +
        'What did <b>' + escapeHtml(name) + '</b> do that made you trust them with a problem this bad? ' +
        'Whatever you just thought of is the thing this page is about.';
    }

    btn.addEventListener('click', commit);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') commit(); });

    var saved = load('anchor', '');
    if (saved) { input.value = saved; broadcast(saved); }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ══ Ten signals checklist ═════════════════════════════ */
  function signals() {
    var wrap = $('#ha-signals');
    var tally = $('#ha-signal-tally');
    if (!wrap || !tally) return;

    var btns = $$('.ha-signal', wrap);
    var state = load('signals', {});

    var READ = [
      'Nothing ticked. Treat this result as a starting point. You can change how you act.',
      'One signal. The seed is there.',
      'Two signals. You break the pattern sometimes.',
      'Three signals. You have a habit of going your own way.',
      'Four signals. Most people who know you would call you independent.',
      'Five signals. You are past the halfway line.',
      'Six signals. You are the person some friends already ring first.',
      'Seven signals. You are unusual, and you probably know it.',
      'Eight signals. You are the phone call.',
      'Nine signals. Be honest with yourself on the re-read.',
      'Ten out of ten. Either you are Wilbur Wright, or you were generous. Both are worth checking.'
    ];

    function render() {
      var n = 0;
      btns.forEach(function (b) {
        var on = !!state[b.dataset.sig];
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) n++;
      });
      tally.innerHTML = '<b>' + n + ' / ' + btns.length + '</b> &nbsp;' + READ[n];
      save('signals', state);
    }

    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        state[b.dataset.sig] = !state[b.dataset.sig];
        render();
      });
    });
    render();
  }

  /* ══ The tricycle ══════════════════════════════════════ */
  var TRIKE = {
    think: {
      label: 'Clear thinking',
      flat: 'Without clear thinking',
      text: 'You charge at the first plan that enters your head. It is a bad plan, and you will not find out for six months.'
    },
    act: {
      label: 'Bias to action',
      flat: 'Without a bias to action',
      text: 'The plan is excellent and it stays in your head. Nobody has ever been broken out of a cell by an idea.'
    },
    disagree: {
      label: 'Disagreeability',
      flat: 'Without disagreeability',
      text: 'The first person in a uniform says no, and you go home. The plan was fine. You just needed to not stop.'
    }
  };

  function tricycle() {
    var svg = $('#ha-trike');
    var out = $('#ha-trike-verdict');
    if (!svg || !out) return;

    var flat = {};
    var groups = $$('g[data-wheel]', svg);

    function render() {
      var down = Object.keys(flat).filter(function (k) { return flat[k]; });
      groups.forEach(function (g) {
        g.classList.toggle('is-flat', !!flat[g.dataset.wheel]);
        g.setAttribute('aria-pressed', flat[g.dataset.wheel] ? 'true' : 'false');
      });

      if (down.length === 0) {
        out.innerHTML = '<p class="t">Three wheels. It rolls.</p><p>This is the combination the essay calls high agency. ' +
          'It is rare because the three traits pull against each other. Clear thinkers tend to keep thinking. ' +
          'People with a bias to action tend to skip the thinking. Take a wheel off and see what breaks.</p>';
      } else if (down.length === 1) {
        var k = TRIKE[down[0]];
        out.innerHTML = '<p class="t">' + k.flat + '</p><p>' + k.text + '</p>';
      } else if (down.length === 2) {
        out.innerHTML = '<p class="t">Two wheels down.</p><p>' +
          down.map(function (d) { return TRIKE[d].label.toLowerCase(); }).join(' and ') +
          ' are both gone. The remaining vehicle cannot move, however hard you push it.</p>';
      } else {
        out.innerHTML = '<p class="t">No wheels.</p><p>This is the default setting. ' +
          'A brain built for a small tribe and a school system built for a factory can produce it. ' +
          'Put the wheels back on and read the rest.</p>';
      }
    }

    groups.forEach(function (g) {
      g.addEventListener('click', function () {
        flat[g.dataset.wheel] = !flat[g.dataset.wheel];
        render();
      });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); g.click(); }
      });
    });

    var reset = $('#ha-trike-reset');
    if (reset) reset.addEventListener('click', function () { flat = {}; render(); });

    render();
  }

  /* ══ The diagnostic quiz ═══════════════════════════════ */
  var QUESTIONS = [
    { axis: 'think', q: 'When I am stuck, I write the problem down before I try to solve it.' },
    { axis: 'act', q: 'I run a rough test this week when a month of planning would add little value.' },
    { axis: 'disagree', q: 'I hold at least one view that most people around me think is wrong.' },
    { axis: 'think', q: 'I can say my biggest current problem in one plain sentence.' },
    { axis: 'act', q: 'When I decide something, the first step happens the same day.' },
    { axis: 'disagree', q: 'When someone in authority says no, I look for another route.' },
    { axis: 'think', q: 'Before I answer a question, I check whether it is the right question.' },
    { axis: 'act', q: 'I contact people I do not know when I need something from them.' },
    { axis: 'disagree', q: 'I give honest feedback even when it costs me socially.' },
    { axis: 'think', q: 'When someone says the research shows something, I go and read it.' },
    { axis: 'act', q: 'In the last month I made something a stranger could look at.' },
    { axis: 'disagree', q: 'I have quit something other people thought I should keep.' }
  ];

  var AXIS_META = {
    think: { name: 'Clear thinking', short: 'Think' },
    act: { name: 'Bias to action', short: 'Act' },
    disagree: { name: 'Disagreeability', short: 'Refuse' }
  };

  var QUADRANTS = {
    drift: {
      name: 'Drift',
      text: 'Things happen and you explain them afterwards. The story of your life is written by other people, and you read it once a year and feel odd about it.'
    },
    commentator: {
      name: 'The commentator',
      text: 'You see the problem clearly and watch from the stands. Diagnosis alone leaves the problem unchanged.'
    },
    blur: {
      name: 'The blur',
      text: 'You act quickly, but you often start before defining the problem. Name the target first, then move.'
    },
    live: {
      name: 'Live player',
      text: 'You name the problem, you move on it, and you keep going when someone tells you no. This is the person your friends ring from the cell.'
    }
  };

  function quiz() {
    var form = $('#ha-quiz');
    if (!form) return;

    var answers = load('quiz', {});
    var result = $('#ha-quiz-result');
    var scoreBtn = $('#ha-quiz-score');
    var resetBtn = $('#ha-quiz-reset');
    var counter = $('#ha-quiz-progress');

    QUESTIONS.forEach(function (item, i) {
      var row = document.createElement('div');
      row.className = 'ha-q';
      var stem = document.createElement('p');
      stem.className = 'ha-q-stem';
      stem.innerHTML = '<span class="qn">Q' + (i + 1) + '</span>' + escapeHtml(item.q);
      row.appendChild(stem);

      var scale = document.createElement('div');
      scale.className = 'ha-scale';
      scale.setAttribute('role', 'group');
      scale.setAttribute('aria-label', item.q);
      for (var v = 1; v <= 5; v++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = v;
        b.dataset.q = i;
        b.dataset.v = v;
        b.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-label', 'Question ' + (i + 1) + ', rating ' + v + ' of 5');
        scale.appendChild(b);
      }
      row.appendChild(scale);

      if (i === 0) {
        var legend = document.createElement('div');
        legend.className = 'ha-scale-legend';
        legend.innerHTML = '<span>Never true</span><span>Always true</span>';
        row.appendChild(legend);
      }
      form.appendChild(row);
    });

    function paint() {
      $$('button[data-q]', form).forEach(function (b) {
        b.setAttribute('aria-pressed', answers[b.dataset.q] === +b.dataset.v ? 'true' : 'false');
      });
      var n = Object.keys(answers).length;
      if (counter) counter.textContent = n + ' of ' + QUESTIONS.length + ' answered';
      if (scoreBtn) scoreBtn.disabled = n < QUESTIONS.length;
    }

    form.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-q]');
      if (!b) return;
      answers[b.dataset.q] = +b.dataset.v;
      save('quiz', answers);
      paint();
    });

    function scores() {
      var sums = { think: 0, act: 0, disagree: 0 };
      var counts = { think: 0, act: 0, disagree: 0 };
      QUESTIONS.forEach(function (item, i) {
        var v = answers[i];
        if (!v) return;
        sums[item.axis] += v;
        counts[item.axis] += 1;
      });
      var out = {};
      Object.keys(sums).forEach(function (k) {
        out[k] = counts[k] ? Math.round(((sums[k] / counts[k]) - 1) / 4 * 100) : 0;
      });
      return out;
    }

    if (scoreBtn) {
      scoreBtn.addEventListener('click', function () {
        var s = scores();
        renderResult(s);
        if (result) {
          result.classList.add('is-on');
          result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        answers = {};
        save('quiz', answers);
        paint();
        if (result) result.classList.remove('is-on');
      });
    }

    paint();
    if (Object.keys(answers).length === QUESTIONS.length) {
      renderResult(scores());
      if (result) result.classList.add('is-on');
    }
  }

  function renderResult(s) {
    // Bars
    Object.keys(s).forEach(function (k) {
      var fill = $('#ha-bar-' + k);
      var num = $('#ha-num-' + k);
      if (fill) fill.style.width = s[k] + '%';
      if (num) num.textContent = s[k];
    });

    // Radar triangle
    var blob = $('#ha-radar-blob');
    if (blob) {
      var cx = 160, cy = 152, R = 96;
      var order = ['think', 'act', 'disagree'];
      var pts = order.map(function (k, i) {
        var a = (-90 + i * 120) * Math.PI / 180;
        var r = Math.max(6, R * (s[k] / 100));
        return (cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1);
      });
      blob.setAttribute('points', pts.join(' '));
    }

    // Spectrum placement
    var will = (s.act + s.disagree) / 2;
    var clarity = s.think;
    var dot = $('#ha-you');
    if (dot) {
      var x = 70 + (will / 100) * 380;
      var y = 250 - (clarity / 100) * 200;
      dot.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')');
      dot.style.opacity = '1';
    }

    var qkey = will >= 50
      ? (clarity >= 50 ? 'live' : 'blur')
      : (clarity >= 50 ? 'commentator' : 'drift');
    $$('.qcell').forEach(function (c) { c.classList.toggle('is-on', c.dataset.quad === qkey); });

    // Verdict
    var box = $('#ha-quiz-verdict');
    if (!box) return;
    var lowest = Object.keys(s).sort(function (a, b) { return s[a] - s[b]; })[0];
    var q = QUADRANTS[qkey];
    var lines = [];
    lines.push('<h6>' + q.name + '</h6>');
    lines.push('<p>' + q.text + '</p>');

    if (Math.min(s.think, s.act, s.disagree) >= 70) {
      lines.push('<p>All three wheels are inflated. The useful question for you is no longer whether you have agency. ' +
        'It is what you are pointing it at. Part four is where that gets decided.</p>');
    } else {
      lines.push('<p>Your flattest wheel is <b>' + AXIS_META[lowest].name.toLowerCase() + '</b>. ' +
        TRIKE[lowest].text + '</p>');
      lines.push('<p class="ha-verdict-cta">' + FIX_HINT[lowest] + '</p>');
    }
    lines.push('<p style="font-size:var(--fs-2xs);opacity:0.75">These twelve self-rated questions offer a prompt for reflection. They do not provide an objective measurement. ' +
      'Treat the number as a prompt to argue with.</p>');
    box.innerHTML = lines.join('');
  }

  var FIX_HINT = {
    think: 'Start with <a href="#trap-vague">the vague trap</a>. The fix is mechanical: get the problem out of your head and onto a surface you can point at.',
    act: 'Start with <a href="#trap-rumination">the rumination trap</a> and <a href="#trap-overwhelm">the overwhelm trap</a>. Both are cured by shrinking the first step until it is embarrassingly small.',
    disagree: 'Start with <a href="#soft-3">there are no adults</a>. Disagreeability is usually blocked by a belief that someone more qualified is handling it.'
  };

  /* ══ Spectrum quadrants ════════════════════════════════ */
  function spectrum() {
    var svg = $('#ha-spectrum');
    var out = $('#ha-spectrum-say');
    if (!svg || !out) return;
    $$('.qcell', svg).forEach(function (c) {
      function show() {
        var q = QUADRANTS[c.dataset.quad];
        out.innerHTML = '<b>' + q.name + '.</b> ' + q.text;
      }
      c.addEventListener('mouseenter', show);
      c.addEventListener('focus', show);
      c.addEventListener('click', show);
    });
  }

  /* ══ The physics gate ══════════════════════════════════ */
  function physicsGate() {
    var input = $('#ha-gate-input');
    var btn = $('#ha-gate-btn');
    var steps = $$('.ha-gate-step');
    if (!input || !btn || !steps.length) return;

    var i = -1;
    function advance() {
      if (i >= steps.length - 1) {
        i = -1;
        steps.forEach(function (s) { s.classList.remove('is-on'); });
        btn.textContent = 'Run the gate';
        input.value = '';
        input.focus();
        return;
      }
      var text = input.value.trim();
      if (!text) { input.focus(); return; }
      $$('.ha-gate-echo').forEach(function (n) { n.textContent = text; });
      i++;
      steps.forEach(function (s, k) { s.classList.toggle('is-on', k <= i); });
      btn.textContent = i >= steps.length - 1 ? 'Start again' : 'Next question';
    }
    btn.addEventListener('click', advance);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); btn.click(); } });
  }

  /* ══ Asteroid odds ═════════════════════════════════════ */
  function asteroid() {
    var range = $('#ha-asteroid');
    if (!range) return;
    var humanVal = $('#ha-odds-human');
    var humanBar = $('#ha-odds-human-bar');
    var say = $('#ha-odds-say');

    var NOTES = [
      'Nobody acts. The rock arrives on schedule and the physics does the rest.',
      'A few people write papers. No budget, no hardware, no launch.',
      'A serious study happens. Nothing gets built in time.',
      'One programme is funded late. It might work.',
      'Several nations build and launch. The rock probably moves.',
      'Every capable person on the planet is pointed at it. The rock moves.'
    ];

    function paint() {
      var a = +range.value;
      var risk = Math.round(100 - a * 0.97);
      if (humanVal) humanVal.textContent = risk + '%';
      if (humanBar) humanBar.style.width = risk + '%';
      if (say) say.textContent = NOTES[clamp(Math.floor(a / 20), 0, 5)];
    }
    range.addEventListener('input', paint);
    paint();
  }

  /* ══ Duration bars (Cohen and Dylan) ═══════════════════ */
  function durations() {
    var bars = $$('.ha-dur-bar[data-minutes]');
    if (!bars.length) return;
    var max = Math.max.apply(null, bars.map(function (b) { return Math.log10(+b.dataset.minutes + 1); }));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var b = e.target;
        b.style.width = (Math.log10(+b.dataset.minutes + 1) / max * 100) + '%';
        io.unobserve(b);
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { io.observe(b); });
  }

  /* ══ Pedestal cards ════════════════════════════════════ */
  function pedestal() {
    var wrap = $('#ha-pedestal');
    if (!wrap) return;
    $$('.ha-hero-card', wrap).forEach(function (c) {
      c.addEventListener('click', function () {
        c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      });
    });
    var all = $('#ha-pedestal-all');
    if (all) {
      all.addEventListener('click', function () {
        var open = all.dataset.open === 'true';
        $$('.ha-hero-card', wrap).forEach(function (c) { c.setAttribute('aria-pressed', open ? 'false' : 'true'); });
        all.dataset.open = open ? 'false' : 'true';
        all.textContent = open ? 'Kill your gurus' : 'Put them back';
      });
    }
  }

  /* ══ Memory decay ══════════════════════════════════════ */
  function decay() {
    var range = $('#ha-decay-range');
    if (!range) return;
    var X0 = 54, X1 = 470, Y0 = 40, Y1 = 210;

    // normal fades fast, weird persists and is re-told
    function normalAt(t) { return Math.exp(-t / 0.22); }
    function weirdAt(t) { return 0.28 + 0.72 * Math.exp(-t / 6); }

    function px(t) { return X0 + t * (X1 - X0); }
    function py(v) { return Y1 - v * (Y1 - Y0); }

    function path(fn) {
      var d = '';
      for (var i = 0; i <= 100; i++) {
        var t = i / 100;
        d += (i ? 'L' : 'M') + px(t).toFixed(1) + ' ' + py(fn(t)).toFixed(1);
      }
      return d;
    }

    var pn = $('#ha-curve-normal');
    var pw = $('#ha-curve-weird');
    if (pn) pn.setAttribute('d', path(normalAt));
    if (pw) pw.setAttribute('d', path(weirdAt));

    var scrub = $('#ha-decay-scrub');
    var dn = $('#ha-decay-dot-normal');
    var dw = $('#ha-decay-dot-weird');
    var vn = $('#ha-decay-val-normal');
    var vw = $('#ha-decay-val-weird');
    var lbl = $('#ha-decay-when');

    var WHEN = ['that evening', 'a week later', 'a month later', 'a year later', 'five years later', 'at your funeral'];

    function paint() {
      var t = +range.value / 100;
      var x = px(t);
      if (scrub) { scrub.setAttribute('x1', x); scrub.setAttribute('x2', x); }
      if (dn) { dn.setAttribute('cx', x); dn.setAttribute('cy', py(normalAt(t))); }
      if (dw) { dw.setAttribute('cx', x); dw.setAttribute('cy', py(weirdAt(t))); }
      if (vn) vn.textContent = Math.round(normalAt(t) * 100) + '%';
      if (vw) vw.textContent = Math.round(weirdAt(t) * 100) + '%';
      if (lbl) lbl.textContent = WHEN[clamp(Math.round(t * 5), 0, 5)];
    }
    range.addEventListener('input', paint);
    paint();
  }

  /* ══ Life in nows ══════════════════════════════════════ */
  function nows() {
    var input = $('#ha-age');
    var grid = $('#ha-nows');
    var stat = $('#ha-nows-stat');
    if (!input || !grid) return;

    var CEILING = 90; // stated assumption, not a prediction

    function paint() {
      var age = clamp(+input.value || 0, 0, CEILING);
      var total = CEILING * 12;
      var spent = Math.round(age * 12);
      grid.innerHTML = '';
      var frag = document.createDocumentFragment();
      for (var i = 0; i < total; i++) {
        var d = document.createElement('span');
        d.className = 'ha-now' + (i < spent ? ' spent' : '') + (i === spent ? ' now' : '');
        frag.appendChild(d);
      }
      grid.appendChild(frag);
      save('age', age);

      var left = total - spent;
      if (stat) {
        stat.innerHTML = 'If you get to ninety, you have <b>' + left.toLocaleString() + '</b> months left. ' +
          'That is <b>' + Math.round(left / 12) + '</b> more summers, and roughly <b>' +
          (left * 30).toLocaleString() + '</b> more days. ' +
          'The bright square is the only one you can act in.';
      }
    }
    input.addEventListener('input', paint);
    var saved = load('age', null);
    if (saved !== null) input.value = saved;
    paint();
  }

  /* ══ Wilbur: problems and syllogism ════════════════════ */
  function wilbur() {
    $$('.ha-problem').forEach(function (p) {
      var btn = $('button', p);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = p.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    var syl = $('#ha-syllogism');
    if (!syl) return;
    var steps = $$('.ha-syl-step', syl);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        steps.forEach(function (s, i) {
          setTimeout(function () { s.classList.add('is-on'); }, i * 320);
        });
        io.disconnect();
      });
    }, { threshold: 0.5 });
    io.observe(syl);
  }

  /* ══ Midwit curve ══════════════════════════════════════ */
  var MIDWIT = {
    left: {
      who: 'The person on the left',
      say: 'Write often about what holds your attention. They did not bury the simple move under extra analysis.'
    },
    mid: {
      who: 'The midwit',
      say: 'Researches the daily routines of famous writers. Compares mechanical keyboards. Builds a tagging system for notes they have not written yet. Every step is defensible and none of them is writing.'
    },
    right: {
      who: 'The person on the right',
      say: 'Write often about what holds your attention. They considered the alternatives, then chose the simple move deliberately.'
    }
  };

  function midwit() {
    var svg = $('#ha-midwit');
    var out = $('#ha-midwit-say');
    if (!svg || !out) return;
    $$('g.mw', svg).forEach(function (g) {
      function show() {
        $$('g.mw', svg).forEach(function (o) { o.classList.toggle('is-on', o === g); });
        var m = MIDWIT[g.dataset.mw];
        out.innerHTML = '<p class="who">' + m.who + '</p><p>' + m.say + '</p>';
      }
      g.addEventListener('mouseenter', show);
      g.addEventListener('click', show);
      g.addEventListener('focus', show);
    });
  }

  /* ══ Inversion tool ════════════════════════════════════ */
  function inversion() {
    var input = $('#ha-invert-input');
    var btn = $('#ha-invert-btn');
    var out = $('#ha-invert-out');
    if (!input || !btn || !out) return;

    btn.addEventListener('click', function () {
      var goal = input.value.trim();
      if (!goal) { input.focus(); return; }
      $$('.ha-invert-goal').forEach(function (n) { n.textContent = goal; });
      out.classList.add('is-on');
      var bad = $('#ha-invert-bad');
      if (bad) bad.focus({ preventScroll: true });
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); btn.click(); } });
  }

  /* ══ Rumination loop ═══════════════════════════════════ */
  function loopBreak() {
    var svg = $('#ha-loop');
    var btn = $('#ha-loop-btn');
    var say = $('#ha-loop-say');
    if (!svg || !btn) return;
    btn.addEventListener('click', function () {
      var broken = svg.classList.toggle('is-broken');
      btn.textContent = broken ? 'Put me back in the loop' : 'Take one action now';
      if (say) {
        say.textContent = broken
          ? 'The loop did not resolve. It got interrupted. That is the only way it ever ends.'
          : 'Round and round. Each lap feels like progress because it uses the same energy as thinking.';
      }
    });
  }

  /* ══ Level ladder ══════════════════════════════════════ */
  function levels() {
    var input = $('#ha-level-input');
    var btn = $('#ha-level-btn');
    var out = $('#ha-levels');
    if (!input || !btn || !out) return;

    var TEMPLATE = [
      'Write down every single thing you could possibly do to start on <b>%G</b>. Do not filter. Fifteen minutes.',
      'Read that list and use it to write out levels three, four and five. This step builds the plan; action comes next.',
      'Find the three most recommended starting resources for <b>%G</b> and get hold of one of them today.',
      'Spend twenty minutes with it. Note every point where you got lost. The notes matter more than the progress.',
      'Take one thing you did not understand and get it explained until you do. Then go back to level four.'
    ];

    function paint(goal) {
      out.innerHTML = '';
      TEMPLATE.forEach(function (t, i) {
        var row = document.createElement('div');
        row.className = 'ha-level' + (i > 1 ? ' is-far' : '');
        row.innerHTML = '<span class="lv">L' + (i + 1) + '</span><p>' + t.replace(/%G/g, escapeHtml(goal)) + '</p>';
        out.appendChild(row);
      });
      var tail = document.createElement('div');
      tail.className = 'ha-level is-far';
      tail.innerHTML = '<span class="lv">L100</span><p>' + escapeHtml(goal) +
        '. You will get here by playing levels, and you will not remember feeling overwhelmed.</p>';
      out.appendChild(tail);
    }

    btn.addEventListener('click', function () {
      var goal = input.value.trim();
      if (!goal) { input.focus(); return; }
      paint(goal);
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); btn.click(); } });
  }

  /* ══ The trap diagnostic game ══════════════════════════ */
  var TRAPS = {
    vague: { name: 'The vague trap', ask: 'Define the problem in simple words, out of your head.', href: '#trap-vague' },
    midwit: { name: 'The midwit trap', ask: 'What would the person on the left do? Find it by inverting.', href: '#trap-midwit' },
    attachment: { name: 'The attachment trap', ask: 'What would I do if I had ten times the agency?', href: '#trap-attachment' },
    rumination: { name: 'The rumination trap', ask: 'How can I take action on this now?', href: '#trap-rumination' },
    overwhelm: { name: 'The overwhelm trap', ask: 'What is the smallest first step I can take?', href: '#trap-overwhelm' }
  };

  var SCENES = [
    {
      setup: 'The role',
      text: 'A job you badly want opens up. You meet four of the six requirements.',
      opts: [
        { t: 'Wait until a version of the role appears that fits you exactly.', k: 'rumination',
          why: 'The perfect opening is a story your mind tells to avoid the awkward one in front of you.' },
        { t: 'Spend the weekend building the thing the role does, then send it with the application.', k: 'high',
          why: 'Clear thinking picked the real signal. A bias to action produced it in two days. Nobody gave you permission.' },
        { t: 'Decide hiring is rigged for people with the right background, and close the tab.', k: 'attachment',
          why: 'An untested assumption is doing all the work here. It feels like realism because it arrived early.' },
        { t: 'Start a six month plan to become properly qualified first.', k: 'overwhelm',
          why: 'You turned a two day problem into a six month one, which is a comfortable way to not begin.' }
      ]
    },
    {
      setup: 'The hard field',
      text: 'You want to learn something technical and genuinely difficult from scratch.',
      opts: [
        { t: 'Buy nine books and read reviews of all of them first.', k: 'midwit',
          why: 'Every step here is defensible. None of them is learning. Sophistication is the most respectable form of avoidance.' },
        { t: 'Feel the size of it and quietly put it off again.', k: 'overwhelm',
          why: 'You compared level zero to level one hundred and skipped the only part you can act on.' },
        { t: 'Read ten pages tonight and write down every bit you did not follow.', k: 'high',
          why: 'That is level one, and it is small enough to be undeniable. The confusion list becomes level two.' },
        { t: 'Tell a few people it is something you are getting into.', k: 'vague',
          why: 'Saying it out loud feels like a commitment. It is a description of a feeling.' }
      ]
    },
    {
      setup: 'The unnamed thing',
      text: 'Something in your life is wrong and you cannot say what it is.',
      opts: [
        { t: 'Turn it over in your head on the commute for another few weeks.', k: 'vague',
          why: 'Thoughts feel solid while they are happening and leave nothing behind. Your head is a bad whiteboard.' },
        { t: 'Write one page tonight. Force it into a single sentence at the end.', k: 'high',
          why: 'Moving a thought into another medium filters it. The sentence you end up with is usually not the one you started with.' },
        { t: 'Give it time and see whether it resolves on its own.', k: 'rumination',
          why: 'Waiting is a decision with the accountability removed.' },
        { t: 'Read about other people who describe the same feeling.', k: 'midwit',
          why: 'Better vocabulary has made the problem easier to describe. It has not moved you closer to a solution.' }
      ]
    },
    {
      setup: 'The silence',
      text: 'You need a decision from someone who has not replied to two emails.',
      opts: [
        { t: 'Send the same email again next week.', k: 'attachment',
          why: 'The channel is the assumption you never questioned. You are running the failed move at a lower frequency.' },
        { t: 'Find one person who can reach them in a different way, and ask.', k: 'high',
          why: 'The bouncer said no. You went round the side of the building.' },
        { t: 'Rewrite it into a longer and more polished email.', k: 'midwit',
          why: 'Craft applied to a channel that is already dead.' },
        { t: 'Draft three versions and send none of them.', k: 'rumination',
          why: 'Three drafts is the same as zero drafts, with more of your evening spent.' }
      ]
    },
    {
      setup: 'The move',
      text: 'You have wanted to move city for three years.',
      opts: [
        { t: 'Wait until the finances and the timing are right.', k: 'rumination',
          why: 'Three years of theoretical data. You could have had practical data on four cities by now.' },
        { t: 'Build a spreadsheet weighting fourteen factors across five cities.', k: 'midwit',
          why: 'The weights are guesses wearing a suit. You will trust the output because it has decimal places.' },
        { t: 'Book two weeks there next month and follow an ordinary weekday routine throughout the visit.', k: 'high',
          why: 'You reframed a decision as an experiment. Success is that you ran it, whatever the answer turns out to be.' },
        { t: 'Accept that people from where you are from do not really do that.', k: 'attachment',
          why: 'A belief inherited from people who also never tested it.' }
      ]
    },
    {
      setup: 'The old friend',
      text: 'Someone you have not spoken to in four years crosses your mind.',
      opts: [
        { t: 'Think warmly about them and carry on with your day.', k: 'vague',
          why: 'Warm feeling, zero transmission. They will never know it happened.' },
        { t: 'Wait for a natural reason to get back in touch.', k: 'rumination',
          why: 'The natural reason is usually a funeral.' },
        { t: 'Message them right now, badly worded, from your phone.', k: 'high',
          why: 'Weird beats normal and the awkward message is the one they remember. There is only now.' },
        { t: 'Plan a proper catch-up for when things calm down.', k: 'overwhelm',
          why: 'You upgraded a thirty second act into an event, and events need a calm month that never arrives.' }
      ]
    }
  ];

  function trapGame() {
    var stage = $('#ha-game-stage');
    if (!stage) return;
    var pips = $('#ha-game-pips');
    var summary = $('#ha-game-summary');
    var nextBtn = $('#ha-game-next');
    var restart = $('#ha-game-restart');

    var idx = 0;
    var tally = {};
    var wins = 0;
    var answered = false;

    function pipRow() {
      if (!pips) return;
      pips.innerHTML = '';
      SCENES.forEach(function (_, i) {
        var p = document.createElement('span');
        p.className = 'ha-pip' + (i < idx ? ' done' : i === idx ? ' current' : '');
        pips.appendChild(p);
      });
    }

    function renderScene() {
      answered = false;
      var s = SCENES[idx];
      stage.innerHTML = '';

      var scene = document.createElement('p');
      scene.className = 'ha-game-scene';
      scene.innerHTML = '<span class="setup">Situation ' + (idx + 1) + ' &middot; ' + escapeHtml(s.setup) + '</span>' + escapeHtml(s.text);
      stage.appendChild(scene);

      var choices = document.createElement('div');
      choices.className = 'ha-choices';
      s.opts.forEach(function (o, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ha-choice';
        b.textContent = o.t;
        b.dataset.i = i;
        choices.appendChild(b);
      });
      stage.appendChild(choices);

      var fb = document.createElement('div');
      fb.className = 'ha-feedback';
      fb.id = 'ha-game-feedback';
      fb.setAttribute('role', 'status');
      stage.appendChild(fb);

      choices.addEventListener('click', function (e) {
        var b = e.target.closest('.ha-choice');
        if (!b || answered) return;
        answered = true;
        var o = s.opts[+b.dataset.i];
        $$('.ha-choice', choices).forEach(function (x) {
          x.classList.add(x === b ? 'is-picked' : 'is-dim');
        });

        if (o.k === 'high') {
          wins++;
          fb.innerHTML = '<p class="verdict-name">High agency.</p><p>' + o.why + '</p>';
        } else {
          tally[o.k] = (tally[o.k] || 0) + 1;
          var t = TRAPS[o.k];
          fb.innerHTML = '<p class="verdict-name">' + t.name + '</p><p>' + o.why + '</p>' +
            '<p class="escape-line">Escape route: ' + t.ask + '</p>';
        }
        fb.classList.add('is-on');
        if (nextBtn) {
          nextBtn.disabled = false;
          nextBtn.textContent = idx === SCENES.length - 1 ? 'See the pattern' : 'Next situation';
        }
      });

      if (nextBtn) { nextBtn.disabled = true; nextBtn.textContent = 'Next situation'; }
      pipRow();
    }

    function renderSummary() {
      if (!summary) return;
      stage.innerHTML = '';
      if (nextBtn) nextBtn.style.display = 'none';

      var keys = Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; });
      var html = '<h6 style="font-family:\'Space Grotesk\',sans-serif;font-size:var(--fs-title);color:var(--text);margin:0 0 0.5rem">' +
        'You took the high agency route ' + wins + ' time' + (wins === 1 ? '' : 's') + ' out of ' + SCENES.length + '.</h6>';

      if (!keys.length) {
        html += '<p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7">No trap dominated. Either you already act with agency, ' +
          'or you spotted which answer the page wanted. Both are worth knowing about yourself. ' +
          'The real test comes when nobody writes the high-agency option out for you.</p>';
      } else {
        html += '<div class="ha-trap-tally">';
        keys.forEach(function (k) {
          var t = TRAPS[k];
          html += '<div class="ha-card"><span class="tag">' + tally[k] + '&times;</span>' +
            '<h5>' + t.name + '</h5><p>' + t.ask + ' <a href="' + t.href + '" style="color:var(--text);text-decoration:underline;text-decoration-color:var(--accent);text-underline-offset:3px">Read the escape route</a></p></div>';
        });
        html += '</div>';
        html += '<p style="font-size:var(--fs-sm);color:var(--muted);line-height:1.7">Your most common trap is <b style="color:var(--text)">' +
          TRAPS[keys[0]].name.toLowerCase() + '</b>. It will not feel like a trap from the inside. ' +
          'It will feel like being sensible.</p>';
      }
      summary.innerHTML = html;
      summary.classList.add('is-on');
      if (restart) restart.style.display = '';
      pipRow();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        idx++;
        if (idx >= SCENES.length) { renderSummary(); return; }
        renderScene();
      });
    }
    if (restart) {
      restart.style.display = 'none';
      restart.addEventListener('click', function () {
        idx = 0; tally = {}; wins = 0;
        if (summary) { summary.classList.remove('is-on'); summary.innerHTML = ''; }
        if (nextBtn) nextBtn.style.display = '';
        restart.style.display = 'none';
        renderScene();
      });
    }

    renderScene();
  }

  /* ══ The flow chart ════════════════════════════════════ */
  var FLOW = {
    n0: { say: 'Something is not moving. Before you do anything else, run it through the chart.', yes: null, no: null, next: 'n1' },
    n1: {
      say: 'Say the problem out loud in one sentence, with no hedging and no background.',
      q: 'Can you say the problem in one plain sentence?',
      yes: 'n2', no: 'o1'
    },
    n2: {
      say: 'Not hard. Not expensive. Not unlikely. Does the solution require breaking a law of physics?',
      q: 'Does the fix defy the laws of physics?',
      yes: 'o2', no: 'n3'
    },
    n3: {
      say: 'List the constraints you are treating as fixed. Ask which one you have actually tested.',
      q: 'Are you assuming a limit you never tested?',
      yes: 'o3', no: 'n4'
    },
    n4: {
      say: 'Compare the size of the plan to the size of the goal. If the plan is bigger, something is wrong.',
      q: 'Is the plan more complicated than the goal?',
      yes: 'o4', no: 'n5'
    },
    n5: {
      say: 'Not the strategy. The first physical action, small enough to do before dinner.',
      q: 'Do you know what level one is?',
      yes: 'n6', no: 'o5'
    },
    n6: {
      say: 'Not planned. Not scheduled. Done.',
      q: 'Have you done level one today?',
      yes: 'n7', no: 'o6'
    },
    n7: { say: 'You have agency on this problem. Nothing left to diagnose. Run the chart again tomorrow.', term: true },
    o1: { say: 'The vague trap. Get it onto a surface outside your head. Paper, whiteboard, a walk with one question, a person who will interrupt you.', term: true, trap: '#trap-vague' },
    o2: { say: 'Then you have found a genuine limit. This is the rarest outcome on the chart. Spend your agency somewhere else.', term: true },
    o3: { say: 'The attachment trap. Ask what you would do with ten times the agency, and take the first three answers seriously.', term: true, trap: '#trap-attachment' },
    o4: { say: 'The midwit trap. Invert it. Ask how you would guarantee failure, then flip each answer.', term: true, trap: '#trap-midwit' },
    o5: { say: 'The overwhelm trap. Write down everything you could possibly do. That list is level one, and you can do it now.', term: true, trap: '#trap-overwhelm' },
    o6: { say: 'The rumination trap. The thinking is finished. Reframe it as an experiment and run it badly today.', term: true, trap: '#trap-rumination' }
  };

  function flowChart() {
    var svg = $('#ha-flow');
    var say = $('#ha-flow-say');
    if (!svg || !say) return;

    var at = 'n0';
    var path = ['n0'];

    function light() {
      $$('.fnode', svg).forEach(function (n) {
        n.classList.toggle('is-lit', path.indexOf(n.dataset.node) !== -1);
      });
      $$('.fedge', svg).forEach(function (e) {
        var f = e.dataset.from, t = e.dataset.to;
        var i = path.indexOf(f);
        e.classList.toggle('is-lit', i !== -1 && path[i + 1] === t);
      });
      $$('.elabel', svg).forEach(function (l) {
        var i = path.indexOf(l.dataset.from);
        l.classList.toggle('is-lit', i !== -1 && path[i + 1] === l.dataset.to);
      });
    }

    function step(to) {
      at = to;
      path.push(to);
      render();
    }

    function render() {
      var node = FLOW[at];
      light();
      var html = '';
      if (node.q) html += '<p class="step-q">' + node.q + '</p>';
      html += '<div class="ha-btn-row" id="ha-flow-btns"></div>';
      html += '<p class="note">' + node.say + '</p>';
      if (node.trap) {
        html += '<p class="note"><a href="' + node.trap + '" style="color:var(--text);text-decoration:underline;text-decoration-color:var(--accent);text-underline-offset:3px">Go to the escape route</a></p>';
      }
      say.innerHTML = html;

      var row = $('#ha-flow-btns');
      function add(label, fn, primary) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ha-btn' + (primary ? ' is-primary' : '');
        b.textContent = label;
        b.addEventListener('click', fn);
        row.appendChild(b);
      }

      if (node.term) {
        add('Start again', reset, true);
      } else if (node.next) {
        add('Begin', function () { step(node.next); }, true);
      } else {
        add('Yes', function () { step(node.yes); }, true);
        add('No', function () { step(node.no); });
      }
      if (!node.term && path.length > 1) {
        add('Back', function () { path.pop(); at = path[path.length - 1]; render(); });
      }
    }

    function reset() { at = 'n0'; path = ['n0']; render(); }

    $$('.fnode', svg).forEach(function (n) {
      n.addEventListener('click', function () {
        var k = n.dataset.node;
        if (!FLOW[k]) return;
        var i = path.indexOf(k);
        if (i !== -1) { path = path.slice(0, i + 1); at = k; render(); }
      });
    });

    render();
  }

  /* ══ The worksheet ═════════════════════════════════════ */
  function worksheet() {
    var root = $('#ha-worksheet');
    if (!root) return;

    var state = load('worksheet', { value: '', dump: [], pick: -1, micro: [], done: {} });
    if (!Array.isArray(state.dump)) state.dump = [];
    if (!Array.isArray(state.micro)) state.micro = [];
    if (!state.done) state.done = {};

    var valueInput = $('#ha-ws-value', root);
    var dumpList = $('#ha-ws-dump', root);
    var microList = $('#ha-ws-micro', root);
    var status = $('#ha-ws-status', root);
    var exportBtn = $('#ha-ws-export', root);
    var clearBtn = $('#ha-ws-clear', root);

    function flash() {
      if (!status) return;
      status.textContent = 'Saved to this browser only';
      status.classList.add('saved');
      clearTimeout(flash._t);
      flash._t = setTimeout(function () { status.classList.remove('saved'); }, 1200);
    }

    function persist() { save('worksheet', state); flash(); }

    function buildDump() {
      dumpList.innerHTML = '';
      for (var i = 0; i < 10; i++) {
        (function (i) {
          var row = document.createElement('div');
          row.className = 'ha-dump-row';

          var ix = document.createElement('span');
          ix.className = 'ix';
          ix.textContent = (i + 1) + '.';

          var inp = document.createElement('input');
          inp.type = 'text';
          inp.className = 'ha-input';
          inp.value = state.dump[i] || '';
          inp.placeholder = i === 0 ? 'A specific action another person could observe' : '';
          inp.setAttribute('aria-label', 'Action ' + (i + 1));
          inp.addEventListener('input', function () { state.dump[i] = inp.value; persist(); });

          var pick = document.createElement('button');
          pick.type = 'button';
          pick.className = 'ha-pick' + (state.pick === i ? ' is-on' : '');
          pick.textContent = state.pick === i ? 'Chosen' : 'Pick';
          pick.setAttribute('aria-label', 'Choose action ' + (i + 1));
          pick.addEventListener('click', function () {
            state.pick = state.pick === i ? -1 : i;
            persist();
            buildDump();
            paintPick();
          });

          row.appendChild(ix);
          row.appendChild(inp);
          row.appendChild(pick);
          dumpList.appendChild(row);
        })(i);
      }
    }

    function paintPick() {
      var el = $('#ha-ws-chosen', root);
      if (!el) return;
      var v = state.pick >= 0 ? (state.dump[state.pick] || '').trim() : '';
      el.textContent = v || 'Nothing chosen yet. Pick the one that gives you the strongest flicker of fear.';
      el.style.color = v ? 'var(--text)' : 'var(--muted)';
    }

    function buildMicro() {
      microList.innerHTML = '';
      for (var i = 0; i < 5; i++) {
        (function (i) {
          var row = document.createElement('div');
          row.className = 'ha-micro-row' + (state.done[i] ? ' done' : '');

          var cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.checked = !!state.done[i];
          cb.setAttribute('aria-label', 'Mark micro step ' + (i + 1) + ' done');
          cb.addEventListener('change', function () {
            state.done[i] = cb.checked;
            row.classList.toggle('done', cb.checked);
            persist();
          });

          var inp = document.createElement('input');
          inp.type = 'text';
          inp.className = 'ha-input';
          inp.value = state.micro[i] || '';
          inp.placeholder = i === 0 ? 'The first physical thing. Something you could do in five minutes.' : '';
          inp.setAttribute('aria-label', 'Micro step ' + (i + 1));
          inp.addEventListener('input', function () { state.micro[i] = inp.value; persist(); });

          row.appendChild(cb);
          row.appendChild(inp);
          microList.appendChild(row);
        })(i);
      }
    }

    if (valueInput) {
      valueInput.value = state.value || '';
      valueInput.addEventListener('input', function () { state.value = valueInput.value; persist(); });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        var lines = [];
        lines.push('TURNING BULLSHIT INTO REALITY');
        lines.push('');
        lines.push('Value: ' + (state.value || '(none)'));
        lines.push('');
        lines.push('Ten ways to make it real:');
        state.dump.forEach(function (d, i) { if (d && d.trim()) lines.push('  ' + (i + 1) + '. ' + d); });
        lines.push('');
        lines.push('Chosen: ' + (state.pick >= 0 ? state.dump[state.pick] || '(blank)' : '(none)'));
        lines.push('');
        lines.push('Micro steps:');
        state.micro.forEach(function (m, i) {
          if (m && m.trim()) lines.push('  [' + (state.done[i] ? 'x' : ' ') + '] ' + m);
        });
        lines.push('');
        lines.push('There is only now.');
        var text = lines.join('\n');

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            exportBtn.textContent = 'Copied';
            setTimeout(function () { exportBtn.textContent = 'Copy my sheet'; }, 1600);
          });
        } else {
          window.prompt('Copy your sheet', text);
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        state = { value: '', dump: [], pick: -1, micro: [], done: {} };
        save('worksheet', state);
        if (valueInput) valueInput.value = '';
        buildDump();
        buildMicro();
        paintPick();
      });
    }

    buildDump();
    buildMicro();
    paintPick();
  }

  /* ══ Story razor ═══════════════════════════════════════ */
  function razor() {
    var a = $('#ha-razor-a');
    var b = $('#ha-razor-b');
    var out = $('#ha-razor-out');
    if (!a || !b || !out) return;

    $$('[data-razor]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pickA = btn.dataset.razor === 'a';
        var chosen = (pickA ? a.value : b.value).trim();
        var other = (pickA ? b.value : a.value).trim();
        if (!chosen) { (pickA ? a : b).focus(); return; }
        out.innerHTML = 'At a dinner in five years, <b>' + escapeHtml(chosen) + '</b> is the one you tell. ' +
          (other ? 'Nobody is ever going to ask about ' + escapeHtml(other) + '. ' : '') +
          'If it turns out to be the wrong call, you still end up with the story. That is the whole razor.';
      });
    });
  }

  /* ══ The tap ═══════════════════════════════════════════ */
  function tapFigure() {
    var fig = $('#ha-tapfig');
    var btn = $('#ha-tap-btn');
    var say = $('#ha-tap-say');
    if (!fig || !btn) return;

    var OFF = 'Two of these are opinions about the water. The third one changes how much there is.';
    var ON = 'Same glass, more water. That is the whole difference between reading a situation and moving it.';

    btn.addEventListener('click', function () {
      var on = fig.classList.toggle('is-on');
      btn.textContent = on ? 'Turn it off again' : 'Turn the tap';
      if (say) say.textContent = on ? ON : OFF;
      if (on) award('tap');
    });
  }

  /* ══ Five lines of software, as an install panel ═══════ */
  function softwareOS() {
    var wrap = $('#ha-os');
    if (!wrap) return;
    var rows = $$('.ha-os-row', wrap);
    var hint = $('#ha-os-hint');
    var fill = $('#ha-os-fill');
    var state = load('os', {});

    function paint() {
      var n = 0;
      rows.forEach(function (r) {
        var on = !!state[r.dataset.line];
        r.classList.toggle('is-on', on);
        var b = $('.ha-os-btn', r);
        if (b) {
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          b.textContent = on ? 'Installed' : 'Install';
        }
        if (on) n++;
      });
      if (hint) hint.textContent = n + ' of ' + rows.length + ' installed';
      if (fill) fill.style.width = (n / rows.length * 100) + '%';
      save('os', state);
      if (n === rows.length) award('os');
    }

    rows.forEach(function (r) {
      var b = $('.ha-os-btn', r);
      if (!b) return;
      b.addEventListener('click', function () {
        state[r.dataset.line] = !state[r.dataset.line];
        paint();
      });
    });
    paint();
  }

  /* ══ The razor, as a balance ═══════════════════════════ */
  function razorScale() {
    var scale = $('#ha-scale');
    if (!scale) return;
    $$('[data-razor]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pickA = btn.dataset.razor === 'a';
        var input = $(pickA ? '#ha-razor-a' : '#ha-razor-b');
        if (input && !input.value.trim()) return;
        scale.classList.toggle('is-a', pickA);
        scale.classList.toggle('is-b', !pickA);
      });
    });
  }

  /* ══ Badges ════════════════════════════════════════════
     Twelve marks, one per widget that asks for a real action.
     Nothing is sent anywhere; the record is local storage. */
  var BADGES = [
    { k: 'call', icon: 'hai-phone', name: 'The phone call', how: 'Name the person you would ring.' },
    { k: 'signals', icon: 'hai-checklist', name: 'Ten signals', how: 'Work through the checklist honestly.' },
    { k: 'wheels', icon: 'hai-wheel', name: 'Flat tyre', how: 'Take a wheel off the tricycle.' },
    { k: 'quiz', icon: 'hai-triangle', name: 'Three wheels', how: 'Answer twelve questions and score them.' },
    { k: 'tap', icon: 'hai-tap', name: 'The tap', how: 'Fill the third glass yourself.' },
    { k: 'os', icon: 'hai-chip', name: 'Five lines', how: 'Install all five beliefs.' },
    { k: 'gate', icon: 'hai-unlock', name: 'The physics gate', how: 'Run one impossible problem through it.' },
    { k: 'gurus', icon: 'hai-spiral', name: 'No adults', how: 'Turn every card on the pedestal over.' },
    { k: 'ladder', icon: 'hai-ladder', name: 'Level one', how: 'Break something too big into five levels.' },
    { k: 'game', icon: 'hai-gamepad', name: 'Six situations', how: 'Play the trap diagnostic to the end.' },
    { k: 'flow', icon: 'hai-flow', name: 'Walked the chart', how: 'Follow the flow chart to a terminal node.' },
    { k: 'sheet', icon: 'hai-pen', name: 'Done, not planned', how: 'Tick off one micro step on the worksheet.' }
  ];

  var earned = {};

  function badgeToast(b) {
    var el = $('#ha-toast');
    if (!el) return;
    el.innerHTML = '<svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#' + b.icon + '"></use></svg>' +
      '<span>Unlocked. <b>' + escapeHtml(b.name) + '</b></span>';
    el.classList.add('is-on');
    clearTimeout(badgeToast._t);
    badgeToast._t = setTimeout(function () { el.classList.remove('is-on'); }, 2600);
  }

  function award(key) {
    if (earned[key]) return;
    earned[key] = true;
    save('badges', earned);
    var b = BADGES.filter(function (x) { return x.k === key; })[0];
    if (b) badgeToast(b);
    paintBadges(key);
  }

  function paintBadges(fresh) {
    var n = BADGES.filter(function (b) { return earned[b.k]; }).length;
    var pct = n / BADGES.length * 100;

    var grid = $('#ha-badge-grid');
    if (grid) {
      grid.innerHTML = '';
      BADGES.forEach(function (b) {
        var on = !!earned[b.k];
        var d = document.createElement('div');
        d.className = 'ha-badge' + (on ? ' is-on' : '') + (b.k === fresh ? ' is-new' : '');
        d.setAttribute('role', 'listitem');
        d.innerHTML = '<svg class="ha-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#' + (on ? b.icon : 'hai-lock') + '"></use></svg>' +
          '<span class="state" aria-hidden="true">' + (on ? '&#10003;' : '&middot;') + '</span>' +
          '<b>' + escapeHtml(b.name) + '<span class="ha-sr">. ' + (on ? 'Done.' : 'Not done yet.') + '</span></b>' +
          '<small>' + escapeHtml(b.how) + '</small>';
        grid.appendChild(d);
      });
    }

    var num = $('#ha-badge-n');
    if (num) num.textContent = n;
    var bar = $('#ha-badge-fill');
    if (bar) bar.style.width = pct + '%';

    var hud = $('#ha-hud');
    if (hud) {
      hud.hidden = false;
      hud.classList.toggle('is-full', n === BADGES.length);
      hud.setAttribute('aria-label', n + ' of ' + BADGES.length + ' done. Jump to your progress.');
    }
    var hn = $('#ha-hud-n');
    if (hn) hn.textContent = n;
    var hf = $('#ha-hud-fill');
    if (hf) hf.style.width = pct + '%';

    var foot = $('#ha-badge-foot');
    if (foot) {
      foot.innerHTML = n === 0
        ? 'Nothing done yet. Every mark below needs one small action on this page.'
        : n < BADGES.length
          ? 'You have done <b>' + n + '</b> of the twelve. The ones still locked are the ones that ask for something.'
          : 'All twelve. Reading is finished. The worksheet is the part that touches the world.';
    }
  }

  function badges() {
    earned = load('badges', {}) || {};
    paintBadges();

    var reset = $('#ha-badge-reset');
    if (reset) {
      reset.addEventListener('click', function () {
        earned = {};
        save('badges', earned);
        paintBadges();
      });
    }

    /* Watch the existing widgets rather than editing each one. */
    function on(sel, ev, key, guard) {
      var el = $(sel);
      if (!el) return;
      el.addEventListener(ev, function () { if (!guard || guard()) award(key); });
    }
    function within(sel, key) {
      var el = $(sel);
      if (!el) return;
      el.addEventListener('click', function () { award(key); });
    }

    on('#ha-anchor-btn', 'click', 'call', function () {
      var i = $('#ha-anchor-input');
      return !!(i && i.value.trim());
    });
    within('#ha-signals', 'signals');
    within('#ha-trike', 'wheels');
    on('#ha-quiz-score', 'click', 'quiz');
    on('#ha-gate-btn', 'click', 'gate', function () {
      var i = $('#ha-gate-input');
      return !!(i && i.value.trim());
    });
    on('#ha-pedestal-all', 'click', 'gurus');
    on('#ha-level-btn', 'click', 'ladder', function () {
      var i = $('#ha-level-input');
      return !!(i && i.value.trim());
    });

    var micro = $('#ha-ws-micro');
    if (micro) {
      micro.addEventListener('change', function (e) {
        if (e.target && e.target.type === 'checkbox' && e.target.checked) award('sheet');
      });
    }

    /* Two widgets signal completion by rewriting their own output. */
    var summary = $('#ha-game-summary');
    if (summary && window.MutationObserver) {
      new MutationObserver(function () {
        if (summary.classList.contains('is-on')) award('game');
      }).observe(summary, { attributes: true, attributeFilter: ['class'] });
    }
    var flowSay = $('#ha-flow-say');
    if (flowSay && window.MutationObserver) {
      new MutationObserver(function () {
        var row = $('#ha-flow-btns', flowSay);
        if (!row) return;
        var done = $$('button', row).some(function (b) { return b.textContent === 'Start again'; });
        if (done) award('flow');
      }).observe(flowSay, { childList: true, subtree: true });
    }

    /* Anything already stored from an earlier visit counts. */
    if (Object.keys(load('signals', {})).length) award('signals');
    if (Object.keys(load('quiz', {})).length === QUESTIONS.length) award('quiz');
    if (load('anchor', '')) award('call');
  }

  /* ══ Boot ══════════════════════════════════════════════ */
  function storyRail() {
    var rail = $('#ha-story-rail');
    if (!rail) return;
    var links = $$('a', rail);
    var anchors = [$('#see-it'), $('#software'), $('#tools')].filter(Boolean);
    var ticking = false;
    function paint() {
      var line = window.innerHeight * 0.38;
      var current = anchors[0];
      anchors.forEach(function (anchor) { if (anchor.getBoundingClientRect().top <= line) current = anchor; });
      var active = String(anchors.indexOf(current) + 1);
      links.forEach(function (link) {
        var on = link.dataset.haAct === active;
        link.classList.toggle('is-on', on);
        if (on) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current');
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
    paint();
  }

  function init() {
    try { badges(); } catch (e) { /* the board is optional; the page is not */ }
    [progress, storyRail, jailCell, signals, tricycle, quiz, spectrum, physicsGate, asteroid,
      durations, pedestal, decay, nows, wilbur, midwit, inversion, loopBreak,
      levels, trapGame, flowChart, worksheet, razor,
      tapFigure, softwareOS, razorScale].forEach(function (fn) {
        try { fn(); } catch (e) { /* one broken widget must not take the page down */ }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
