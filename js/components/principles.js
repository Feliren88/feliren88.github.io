/**
 * The Life Operating Principle — interactive layer for /principles/
 *
 * Widgets are independent and fail quietly if their markup is absent,
 * so the page still reads as a plain document with JavaScript off.
 * Situation data is read from a JSON island the Liquid template emits,
 * which keeps _data/principles.yml the single source of truth.
 */
(function () {
  'use strict';

  var STORE = 'pr:';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function save(k, v) { try { localStorage.setItem(STORE + k, JSON.stringify(v)); } catch (e) {} }
  function load(k, d) {
    try { var r = localStorage.getItem(STORE + k); return r === null ? d : JSON.parse(r); } catch (e) { return d; }
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  var DATA = (function () {
    var el = document.getElementById('pr-data');
    if (!el) return { situations: [] };
    try { return JSON.parse(el.textContent); } catch (e) { return { situations: [] }; }
  })();

  /* ══ Reading progress ══════════════════════════════════ */
  function progress() {
    var bar = $('#pr-progress-fill');
    if (!bar) return;
    var t = false;
    function up() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? clamp(window.scrollY / h, 0, 1) * 100 : 0) + '%';
      t = false;
    }
    window.addEventListener('scroll', function () { if (!t) { t = true; requestAnimationFrame(up); } }, { passive: true });
    up();
  }

  /* ══ The console: search every situation ═══════════════ */

  // Filler words carry no signal and, left in, match nearly every card.
  var STOP = ('the and for with that this what how when where why who was were are ' +
    'you your yours she her his they them their our its being been have has had ' +
    'should could would about into from than then there here just only very much more ' +
    'get got some any all not but out off now can did does doing done ' +
    'feel feels feeling felt think thinks thinking thought want wants wanted ' +
    'know knows knew make makes making made take takes taking took ' +
    'something someone anything everything').split(' ');

  // Extra words that should match a situation without appearing in its text.
  var ALIASES = {
    angry: 'furious rage mad livid annoyed pissed off resent',
    afraid: 'fear scared anxious anxiety worried panic dread terrified',
    confused: 'unclear stuck lost muddled uncertain unsure',
    overwhelmed: 'too much drowning burnt out burnout swamped cannot cope',
    exhausted: 'tired burnout depleted drained no energy',
    emergency: 'crisis disaster went wrong urgent shock bad news',
    career: 'job offer new role move jobs promotion salary title work',
    'unbearable-work': 'hate my job quit quitting resign resigning leave toxic manager boss miserable dread work',
    promotion: 'promoted raise senior lead title authority',
    business: 'startup founder company venture side project entrepreneur',
    partners: 'cofounder partner business partner equity split',
    invest: 'investing stocks crypto shares portfolio market bet',
    'money-up': 'raise bonus richer earning more windfall payrise',
    'money-down': 'broke redundancy laid off pay cut lost income poor debt',
    purchase: 'buy buying purchase car house watch expensive spend splurge afford',
    negotiate: 'negotiation salary talk deal contract terms leverage',
    'relationship-start': 'dating new partner girlfriend boyfriend love commit relationship',
    infatuated: 'crush obsessed in love smitten infatuation',
    conflict: 'argument fight fighting arguing disagreement upset tension row partner',
    'stay-or-leave': 'breakup break up divorce leave him leave her end it split separate',
    family: 'parents mother father siblings relatives in laws',
    friends: 'friendship mates social circle',
    power: 'boss executive authority hierarchy politics senior leader',
    criticised: 'criticism feedback attacked blamed judged',
    embarrassed: 'humiliated shame public mistake scandal reputation',
    lie: 'lying lied lies dishonest cover up hide truth deceive',
    betrayed: 'betrayal betrayed cheated stolen backstabbed lied trust broken deceived',
    relocate: 'move city move country emigrate relocation abroad',
    mentors: 'role model mentor idol who to follow',
    learning: 'study skill course learn practice master',
    procrastinating: 'putting off avoiding delay lazy cannot start',
    perfectionism: 'perfect good enough polish over engineering',
    health: 'sick ill unwell body doctor pain sleep',
    lonely: 'alone isolated no friends loneliness',
    bored: 'boredom restless stagnant unstimulated',
    jealous: 'jealousy envy envious resentful of',
    comparing: 'comparison behind peers everyone else ahead',
    praised: 'praise compliment recognition applause validation',
    succeeding: 'success winning going well thriving',
    failing: 'failure lost failed rejected did not work',
    repeating: 'again pattern keeps happening same mistake third time',
    opportunities: 'options offers too many choices saying yes',
    'two-goods': 'two options both good torn between choose',
    irreversible: 'permanent marriage children debt sell guarantee cannot undo',
    reversible: 'test trial experiment pilot try small',
    changed: 'changed plan new information surprise pivot',
    wrong: 'i was wrong mistaken admit error',
    'everyone-agrees': 'consensus groupthink agreement everyone thinks',
    'everyone-disagrees': 'nobody agrees alone contrarian dissent',
    'going-well': 'good times prosperity abundance thriving',
    'going-badly': 'rock bottom terrible collapse spiral worst'
  };

  // Crude stemmer. Good enough to bridge "buying"/"buy" without a real one.
  function variants(t) {
    var v = [t];
    if (t.length > 5 && /ing$/.test(t)) { v.push(t.slice(0, -3)); v.push(t.slice(0, -3) + 'e'); }
    if (t.length > 4 && /ed$/.test(t)) { v.push(t.slice(0, -2)); v.push(t.slice(0, -1)); }
    if (t.length > 4 && /ies$/.test(t)) v.push(t.slice(0, -3) + 'y');
    if (t.length > 3 && /s$/.test(t) && !/ss$/.test(t)) v.push(t.slice(0, -1));
    return v;
  }

  function haystack(s) {
    return [
      s.trigger, s.ask, s.rule,
      (s.donts || []).join(' '),
      (s.steps || []).join(' '),
      (s.body || []).join(' '),
      ALIASES[s.id] || ''
    ].join(' ').toLowerCase();
  }

  function consoleSearch() {
    var input = $('#pr-search');
    var out = $('#pr-results');
    if (!input || !out) return;

    var index = DATA.situations.map(function (s) { return { s: s, hay: haystack(s) }; });

    function highlight(text, terms) {
      var html = esc(text);
      terms.forEach(function (t) {
        if (t.length < 2) return;
        html = html.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
      });
      return html;
    }

    function render(q) {
      var query = q.trim().toLowerCase();
      out.innerHTML = '';
      if (!query) {
        out.innerHTML = '<p class="pr-empty">Type how you feel or what is happening. ' +
          'Plain words work: <b>angry</b>, <b>broke</b>, <b>should I quit</b>, <b>they lied to me</b>, ' +
          '<b>everyone agrees with me</b>.</p>';
        return;
      }
      var raw = query.split(/\s+/).filter(Boolean);
      // Strip filler, or "should i quit" scores every card that contains "to".
      var terms = raw.filter(function (t) { return t.length > 2 && STOP.indexOf(t) === -1; });
      if (!terms.length) terms = raw;

      // "buying" should find "buy", "fighting" should find "fight".
      var forms = terms.map(variants);

      var hits = index
        .map(function (r) {
          var trig = r.s.trigger.toLowerCase();
          var alias = ALIASES[r.s.id] || '';
          var score = 0, matched = 0;
          forms.forEach(function (vs) {
            var w = 0;
            for (var i = 0; i < vs.length && !w; i++) {
              if (trig.indexOf(vs[i]) !== -1) w = 5;
              else if (alias.indexOf(vs[i]) !== -1) w = 4;
              else if (r.hay.indexOf(vs[i]) !== -1) w = 1;
            }
            if (w) { matched++; score += w; }
          });
          return { s: r.s, score: score, matched: matched };
        })
        .filter(function (r) { return r.matched > 0; });

      // A card matching more of the distinct terms always outranks a card that
      // merely mentions one of them a lot.
      var best = hits.reduce(function (m, r) { return Math.max(m, r.matched); }, 0);
      hits = hits
        .filter(function (r) { return r.matched === best; })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, 6);

      if (!hits.length) {
        out.innerHTML = '<p class="pr-empty">Nothing matched. When nothing fits, the page has a fallback: ' +
          '<a href="#sequence">run the eight steps</a>. It works on situations that have no name yet.</p>';
        return;
      }

      hits.forEach(function (h) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'pr-result';
        b.dataset.go = h.s.id;
        b.innerHTML = '<span class="rt">' + highlight(h.s.trigger, terms) + '</span>' +
          '<span class="rq">' + highlight(h.s.ask, terms) + '</span>';
        out.appendChild(b);
      });
    }

    var debounce;
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () { render(input.value); }, 90);
    });

    out.addEventListener('click', function (e) {
      var b = e.target.closest('[data-go]');
      if (!b) return;
      openSituation(b.dataset.go, true);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var first = $('[data-go]', out);
      if (first) openSituation(first.dataset.go, true);
    });

    render('');
  }

  function openSituation(id, scroll) {
    var card = document.getElementById('sit-' + id);
    if (!card) return;
    // Clear any filter that would keep the target hidden.
    var all = $('.pr-filters .filter-pill[data-filter="all"]');
    if (card.hidden && all) all.click();
    card.classList.add('is-open');
    var btn = $('button', card);
    if (btn) btn.setAttribute('aria-expanded', 'true');
    $$('.pr-card.is-hit').forEach(function (c) { c.classList.remove('is-hit'); });
    card.classList.add('is-hit');
    setTimeout(function () { card.classList.remove('is-hit'); }, 2400);
    if (scroll) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ══ Situation cards: expand and filter ════════════════ */
  function cards() {
    var wrap = $('#pr-cards');
    if (!wrap) return;

    $$('.pr-card', wrap).forEach(function (c) {
      var btn = $('button', c);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = c.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    var pills = $$('.pr-filters .filter-pill');
    var count = $('#pr-count');

    var mapCells = $$('.pr-map-cell');

    function apply(kind) {
      var n = 0;
      $$('.pr-card', wrap).forEach(function (c) {
        var match = kind === 'all' || c.dataset.group === kind;
        c.hidden = !match;
        if (match) n++;
      });
      // The glyph map is the same list, so it filters with it.
      mapCells.forEach(function (c) {
        c.hidden = !(kind === 'all' || c.dataset.group === kind);
      });
      if (count) count.textContent = n + (n === 1 ? ' situation' : ' situations');
    }

    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        pills.forEach(function (o) { o.classList.remove('is-active'); });
        p.classList.add('is-active');
        apply(p.dataset.filter || 'all');
      });
    });

    var expand = $('#pr-expand');
    if (expand) {
      expand.addEventListener('click', function () {
        var open = expand.dataset.open === 'true';
        $$('.pr-card', wrap).forEach(function (c) {
          c.classList.toggle('is-open', !open);
          var b = $('button', c);
          if (b) b.setAttribute('aria-expanded', !open ? 'true' : 'false');
        });
        expand.dataset.open = open ? 'false' : 'true';
        expand.textContent = open ? 'Expand all' : 'Collapse all';
      });
    }

    apply('all');

    // Deep link support: /principles/#sit-angry opens that card.
    if (location.hash.indexOf('#sit-') === 0) {
      openSituation(location.hash.slice(5), true);
    }
  }

  /* ══ Central rule: options as doors ════════════════════ */
  function doors() {
    var wrap = $('#pr-doors');
    var cards = $$('.pr-swap-card');
    if (!wrap || !cards.length) return;
    var cap = $('#pr-doors-cap');
    var all = $$('.door', wrap);

    var STATE = {
      relief: {
        open: 2,
        cap: 'The discomfort is gone. So are most of the routes you had.'
      },
      protect: {
        open: 6,
        cap: 'Nothing is resolved yet. Everything is still available to you.'
      }
    };

    function show(key) {
      var s = STATE[key];
      if (!s) return;
      cards.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.q === key ? 'true' : 'false'); });
      all.forEach(function (d, i) {
        var open = i < s.open;
        d.classList.toggle('is-shut', !open);
        var use = $('use', d);
        if (use) use.setAttribute('href', open ? '#pi-door-open' : '#pi-door-shut');
      });
      if (cap) cap.textContent = s.cap;
    }

    cards.forEach(function (c) {
      c.addEventListener('click', function () { show(c.dataset.q); });
      c.addEventListener('mouseenter', function () { show(c.dataset.q); });
    });

    show('protect');
  }

  /* ══ The six questions ═════════════════════════════════ */
  function sixQuestions() {
    var wrap = $('#pr-six');
    var out = $('#pr-six-verdict');
    if (!wrap || !out) return;

    var state = load('six', {});
    var rows = $$('.pr-q', wrap);

    // Six arc segments, one per question, drawn once.
    var segHost = $('#pr-sixring-segs');
    var segs = [];
    if (segHost) {
      var CX = 60, CY = 60, RR = 46, GAPD = 5;
      for (var s = 0; s < 6; s++) {
        var a0 = (-90 + s * 60 + GAPD) * Math.PI / 180;
        var a1 = (-90 + (s + 1) * 60 - GAPD) * Math.PI / 180;
        var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('class', 'seg');
        p.setAttribute('d',
          'M' + (CX + RR * Math.cos(a0)).toFixed(1) + ' ' + (CY + RR * Math.sin(a0)).toFixed(1) +
          ' A' + RR + ' ' + RR + ' 0 0 1 ' +
          (CX + RR * Math.cos(a1)).toFixed(1) + ' ' + (CY + RR * Math.sin(a1)).toFixed(1));
        segHost.appendChild(p);
        segs.push(p);
      }
    }
    var ringNum = $('#pr-sixring-num');
    var ringNote = $('#pr-sixring-note');

    var RING_NOTE = [
      'Nothing answered yet. The result is clear: <b>slow down.</b>',
      'One down. Five of these are still guesses.',
      'Two down. Still more unknown than known.',
      'Halfway. The remaining three are usually the uncomfortable ones.',
      'Four. Close enough that the last two start to feel skippable. They are not.',
      'Five. One left, and it is the one you have been avoiding.',
      '<b>All six.</b> You have done the thinking this decision needs. Check the dial and move at that speed.'
    ];

    function render() {
      var clear = 0;
      rows.forEach(function (r) {
        var on = !!state[r.dataset.q];
        r.classList.toggle('is-clear', on);
        var t = $('.qtoggle', r);
        if (t) {
          t.textContent = on ? 'Clear' : 'Not yet';
          t.setAttribute('aria-pressed', on ? 'true' : 'false');
        }
        if (on) clear++;
      });

      segs.forEach(function (p, i) { p.classList.toggle('is-on', i < clear); });
      if (ringNum) ringNum.textContent = clear;
      if (ringNote) ringNote.innerHTML = RING_NOTE[clear] || '';

      var unclear = rows.length - clear;
      if (clear === rows.length) {
        out.className = 'pr-verdict';
        out.innerHTML = '<b>All six answered.</b> You have done the thinking this decision needs. ' +
          'Check whether it is reversible, then move at the speed that suits.';
      } else if (unclear === 1) {
        var missing = rows.filter(function (r) { return !state[r.dataset.q]; })[0];
        out.className = 'pr-verdict warn';
        out.innerHTML = 'One left: <b>' + esc($('.qt', missing).textContent) + '</b> ' +
          'That is the one worth sitting with before you commit.';
      } else {
        out.className = 'pr-verdict warn';
        out.innerHTML = '<b>' + unclear + ' of ' + rows.length + '</b> still unanswered. ' +
          'Slow down and give the unanswered questions proper attention.';
      }
      save('six', state);
    }

    wrap.addEventListener('click', function (e) {
      var t = e.target.closest('.qtoggle');
      if (!t) return;
      var row = t.closest('.pr-q');
      state[row.dataset.q] = !state[row.dataset.q];
      render();
    });

    var reset = $('#pr-six-reset');
    if (reset) reset.addEventListener('click', function () { state = {}; render(); });

    render();
  }

  /* ══ Reversibility dial ════════════════════════════════ */
  var DIAL_BANDS = [
    {
      max: 20,
      title: 'Freely reversible',
      body: 'Undoing this costs an afternoon and some mild awkwardness. Excessive deliberation costs more than a mistake here.',
      advice: 'Move now. Pick the version you can start today and let the result tell you what you could not work out in advance.'
    },
    {
      max: 45,
      title: 'Reversible with friction',
      body: 'You can undo it, but you will pay in time, money or a slightly bruised reputation. That price is usually smaller than another month of speculation.',
      advice: 'Run it as an experiment with an end date. Decide in advance what result would make you stop.'
    },
    {
      max: 70,
      title: 'Hard to undo',
      body: 'Reversing this means unwinding commitments other people have made around your decision. The cost is real and it lands on more than just you.',
      advice: 'Get one independent perspective from someone with no stake in the answer. Write down the downside case before you commit.'
    },
    {
      max: 90,
      title: 'Nearly permanent',
      body: 'There is a path back and you would not enjoy it. Assume the version of you who regrets this will have fewer options than the version deciding now.',
      advice: 'Raise the evidence bar. Name any urgency created by another person when the facts do not support it.'
    },
    {
      max: 100,
      title: 'Permanent',
      body: 'This does not come back. Marriage, children, a personal guarantee, selling the thing you built, ending something that mattered.',
      advice: 'Slow all the way down. Seek perspectives that can afford to disagree with you. Never let another person\'s deadline become your evidence.'
    }
  ];

  var DIAL_EXAMPLES = [
    { label: 'Trying a new tool', v: 5 },
    { label: 'A short contract', v: 22 },
    { label: 'Moving city', v: 48 },
    { label: 'Taking the promotion', v: 40 },
    { label: 'Leaving the job', v: 62 },
    { label: 'Personal guarantee', v: 88 },
    { label: 'Having children', v: 100 }
  ];

  function dial() {
    var range = $('#pr-dial-range');
    if (!range) return;

    var arc = $('#pr-dial-arc');
    var knob = $('#pr-dial-knob');
    var valEl = $('#pr-dial-val');
    var read = $('#pr-dial-read');
    var chipWrap = $('#pr-dial-chips');

    // Semicircle from 180deg to 360deg, radius 110, centre (160,150)
    var LEN = Math.PI * 110;
    if (arc) { arc.setAttribute('stroke-dasharray', LEN.toFixed(1)); }

    function band(v) {
      for (var i = 0; i < DIAL_BANDS.length; i++) if (v <= DIAL_BANDS[i].max) return DIAL_BANDS[i];
      return DIAL_BANDS[DIAL_BANDS.length - 1];
    }

    function paint() {
      var v = +range.value;
      if (arc) arc.setAttribute('stroke-dashoffset', (LEN * (1 - v / 100)).toFixed(1));
      if (knob) {
        // Ride the arc itself rather than sweeping a needle across the readout.
        var th = (180 + v * 1.8) * Math.PI / 180;
        knob.setAttribute('cx', (160 + 110 * Math.cos(th)).toFixed(1));
        knob.setAttribute('cy', (150 + 110 * Math.sin(th)).toFixed(1));
      }
      if (valEl) valEl.textContent = v;

      var b = band(v);
      var slow = v > 45;
      if (read) {
        read.innerHTML = '<p class="t">' + b.title + '</p><p>' + b.body + '</p><p><b style="color:var(--text)">' +
          (slow ? 'Patience.' : 'Speed.') + '</b> ' + b.advice + '</p>' +
          '<span class="pr-speed' + (slow ? ' is-slow' : '') + '">' +
          '<svg class="pr-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#pi-speed-' +
          (slow ? 'slow' : 'fast') + '"/></svg><b>' + (slow ? 'Wait' : 'Move') + '</b></span>';
      }
      if (chipWrap) {
        $$('.pr-chip', chipWrap).forEach(function (c) { c.classList.toggle('is-on', +c.dataset.v === v); });
      }
      if (lineYou) {
        lineYou.setAttribute('transform', 'translate(' + (24 + (v / 100) * 512).toFixed(1) + ',62)');
      }
      $$('.mark', $('#pr-line') || document).forEach(function (m) {
        m.classList.toggle('is-on', Math.abs(+m.dataset.v - v) <= 1);
      });
      save('dial', v);
    }

    if (chipWrap) {
      DIAL_EXAMPLES.forEach(function (ex) {
        var c = document.createElement('button');
        c.type = 'button';
        c.className = 'pr-chip';
        c.dataset.v = ex.v;
        c.textContent = ex.label;
        c.addEventListener('click', function () { range.value = ex.v; paint(); });
        chipWrap.appendChild(c);
      });
    }

    // Plot the same examples on the axis so the dial reading has a scale.
    // Lanes are resolved by measurement rather than fixed, so relabelling or
    // renumbering an example can never silently collide with its neighbour.
    var markHost = $('#pr-line-marks');
    if (markHost) {
      var LANES = [
        { y: 34, stem: 40 }, { y: 90, stem: 78 },
        { y: 20, stem: 40 }, { y: 104, stem: 78 }
      ];
      // Seed with the axis end captions so a lane can never land on them.
      var taken = $$('.lend', $('#pr-line')).map(function (t) {
        var b = t.getBBox();
        return { x1: b.x - 4, x2: b.x + b.width + 4, y1: b.y, y2: b.y + b.height };
      });

      DIAL_EXAMPLES.forEach(function (ex) {
        var x = 24 + (ex.v / 100) * 512;
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'mark');
        g.dataset.v = ex.v;
        g.innerHTML =
          '<line class="mstem" x1="' + x.toFixed(1) + '" y1="62" x2="' + x.toFixed(1) + '" y2="40"/>' +
          '<circle class="mdot" cx="' + x.toFixed(1) + '" cy="62" r="5"/>' +
          '<text class="mlab" x="' + x.toFixed(1) + '" y="34" text-anchor="middle">' + esc(ex.label) + '</text>';
        markHost.appendChild(g);

        var t = $('.mlab', g), stem = $('.mstem', g), chosen = null;

        for (var li = 0; li < LANES.length && !chosen; li++) {
          t.setAttribute('y', LANES[li].y);
          t.setAttribute('text-anchor', 'middle');
          t.setAttribute('x', x.toFixed(1));

          var b = t.getBBox();
          // Pull ends inward rather than letting them run off the axis.
          if (b.x < 2) { t.setAttribute('text-anchor', 'start'); t.setAttribute('x', 4); b = t.getBBox(); }
          else if (b.x + b.width > 558) { t.setAttribute('text-anchor', 'end'); t.setAttribute('x', 556); b = t.getBBox(); }

          var box = { x1: b.x - 4, x2: b.x + b.width + 4, y1: b.y, y2: b.y + b.height };
          var clash = taken.some(function (o) {
            return !(box.x2 < o.x1 || o.x2 < box.x1 || box.y2 < o.y1 || o.y2 < box.y1);
          });
          if (!clash) chosen = LANES[li];
        }

        if (!chosen) chosen = LANES[LANES.length - 1];
        stem.setAttribute('y2', chosen.stem);
        var fb = t.getBBox();
        taken.push({ x1: fb.x - 4, x2: fb.x + fb.width + 4, y1: fb.y, y2: fb.y + fb.height });

        g.addEventListener('click', function () { range.value = ex.v; paint(); });
      });
    }
    var lineYou = $('#pr-line-you');

    range.addEventListener('input', paint);
    var saved = load('dial', null);
    if (saved !== null) range.value = saved;
    paint();
  }

  /* ══ The eight-step sequence ═══════════════════════════ */
  function sequence() {
    var wrap = $('#pr-seq');
    if (!wrap) return;
    var steps = $$('.pr-step', wrap);
    var next = $('#pr-seq-next');
    var reset = $('#pr-seq-reset');
    var note = $('#pr-seq-note');

    var i = -1;

    var nodes = $$('.pr-track-node');
    var railFill = $('#pr-track-fill');

    function render() {
      steps.forEach(function (s, k) {
        s.classList.toggle('is-on', k <= i);
        s.classList.toggle('is-current', k === i);
      });
      // The track mirrors the list, so either one can drive the other.
      nodes.forEach(function (n, k) {
        n.classList.toggle('is-on', k <= i);
        n.classList.toggle('is-current', k === i);
        n.setAttribute('aria-current', k === i ? 'step' : 'false');
      });
      if (railFill) {
        var span = steps.length > 1 ? (Math.max(i, 0) / (steps.length - 1)) * 100 : 0;
        railFill.style.width = (i < 0 ? 0 : span) + '%';
      }
      if (next) {
        next.textContent = i < 0 ? 'Start the sequence' : (i >= steps.length - 1 ? 'Start again' : 'Next step');
      }
      if (note) {
        if (i < 0) {
          note.textContent = 'Follow the steps in order. Protect the essentials before choosing a direction.';
        } else if (i >= steps.length - 1) {
          note.textContent = 'Sequence complete. If you started with a decision, return to the earlier steps and check the evidence behind it.';
        } else {
          note.textContent = 'Finish this step before moving on. Each later decision depends on the work completed here.';
        }
      }
    }

    if (next) {
      next.addEventListener('click', function () {
        i = i >= steps.length - 1 ? -1 : i + 1;
        render();
      });
    }
    if (reset) reset.addEventListener('click', function () { i = -1; render(); });

    steps.forEach(function (s, k) {
      s.addEventListener('click', function () { i = k; render(); });
      s.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); i = k; render(); }
      });
    });
    nodes.forEach(function (n, k) {
      n.addEventListener('click', function () { i = k; render(); });
    });

    render();
  }

  /* ══ Situation map ═════════════════════════════════════ */
  function situationMap() {
    var map = $('#pr-map');
    var read = $('#pr-map-read');
    if (!map) return;

    var byId = {};
    DATA.situations.forEach(function (s) { byId[s.id] = s; });

    var GROUP_LABEL = {
      pressure: 'Under pressure', decide: 'Deciding', work: 'Work',
      money: 'Money', people: 'People', self: 'Yourself'
    };

    function describe(cell) {
      if (!read) return;
      var s = byId[cell.dataset.go];
      if (!s) return;
      read.innerHTML = '<b>' + esc(s.trigger) + '</b> &middot; ' + esc(s.ask) +
        ' <span style="opacity:.7">(' + (GROUP_LABEL[s.group] || s.group) + ')</span>';
    }

    $$('.pr-map-cell', map).forEach(function (cell) {
      cell.addEventListener('mouseenter', function () { describe(cell); });
      cell.addEventListener('focus', function () { describe(cell); });
      cell.addEventListener('click', function () { openSituation(cell.dataset.go, true); });
    });

    map.addEventListener('mouseleave', function () {
      if (read) read.textContent = 'Hover a glyph to name it. Tap to open it.';
    });
  }

  /* ══ Orbit: the five things to protect ═════════════════ */
  function orbit() {
    var svg = $('#pr-orbit');
    if (!svg) return;
    var read = $('#pr-orbit-read');
    var labelHost = $('#pr-orbit-labels');
    var nodes = $$('.node', svg);
    var cards = $$('.pr-protect-card');
    var items = (DATA.protect || []);

    var CX = 190, CY = 150, R = 96, BUB = 26, HUB = 46;
    var VB_W = 380, VB_H = 310, PAD = 4, GAP = 7;
    var ANGLES = [-90, -18, 54, 126, 198];

    var placed = [];
    nodes.forEach(function (n, i) {
      var a = (ANGLES[i] || 0) * Math.PI / 180;
      var x = CX + R * Math.cos(a);
      var y = CY + R * Math.sin(a);
      n.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')');
      placed.push({ cx: x, cy: y });
    });

    // Labels are pushed radially outward until they clear every bubble, the
    // hub and each other. Solving it here rather than by hand means the layout
    // survives someone renaming an item in principles.yml.
    function hitsCircle(b, cx, cy, r) {
      var nx = Math.max(b.x1, Math.min(cx, b.x2));
      var ny = Math.max(b.y1, Math.min(cy, b.y2));
      return Math.hypot(cx - nx, cy - ny) < r + GAP;
    }
    function overlapsBox(a, b) {
      return !(a.x2 < b.x1 - GAP || b.x2 < a.x1 - GAP || a.y2 < b.y1 - GAP || b.y2 < a.y1 - GAP);
    }

    var boxes = [];
    if (labelHost) {
      nodes.forEach(function (n, i) {
        if (!items[i]) return;
        var a = (ANGLES[i] || 0) * Math.PI / 180;
        var ca = Math.cos(a), sa = Math.sin(a);

        var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('class', 'olab');
        t.setAttribute('data-i', i);
        // Anchor away from the ring so the text grows outward, never inward.
        var anchor = ca > 0.45 ? 'start' : (ca < -0.45 ? 'end' : 'middle');
        t.setAttribute('text-anchor', anchor);
        t.textContent = items[i].short || items[i].key;
        labelHost.appendChild(t);

        var placedOk = false, box = null;

        // Measure what the browser actually painted instead of estimating from
        // font metrics, which is what let a label sit on a bubble before.
        for (var rad = R + BUB; rad <= R + BUB + 90 && !placedOk; rad += 3) {
          var lx = CX + rad * ca;
          var ly = CY + rad * sa + (sa > 0.5 ? 12 : (sa < -0.5 ? -2 : 4));
          t.setAttribute('x', lx.toFixed(1));
          t.setAttribute('y', ly.toFixed(1));

          var bb = t.getBBox();
          box = { x1: bb.x, x2: bb.x + bb.width, y1: bb.y, y2: bb.y + bb.height };

          if (box.x1 < PAD || box.x2 > VB_W - PAD || box.y1 < PAD || box.y2 > VB_H - PAD) continue;
          if (hitsCircle(box, CX, CY, HUB)) continue;
          if (placed.some(function (p) { return hitsCircle(box, p.cx, p.cy, BUB); })) continue;
          if (boxes.some(function (b) { return overlapsBox(box, b); })) continue;

          boxes.push(box);
          placedOk = true;
        }
        if (!placedOk) t.remove();
      });
    }

    function focus(i) {
      svg.classList.toggle('has-focus', i !== null);
      nodes.forEach(function (n, k) { n.classList.toggle('is-on', k === i); });
      $$('.olab', svg).forEach(function (l) { l.classList.toggle('is-on', +l.dataset.i === i); });
      cards.forEach(function (c, k) { c.classList.toggle('is-on', k === i); });
      if (!read) return;
      if (i === null) {
        read.innerHTML = '<p class="t">Five spokes, one hub</p><p>Each of these exists to keep the ' +
          'centre intact. Lose one and the others get harder to hold. Hover a spoke.</p>';
      } else if (items[i]) {
        read.innerHTML = '<p class="t">' + esc(items[i].key) + '</p><p>' + esc(items[i].line) + '</p>';
      }
    }

    nodes.forEach(function (n, i) {
      n.addEventListener('mouseenter', function () { focus(i); });
      n.addEventListener('focus', function () { focus(i); });
      n.addEventListener('click', function () { focus(i); });
      n.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focus(i); }
      });
    });
    svg.addEventListener('mouseleave', function () { focus(null); });
    cards.forEach(function (c, i) {
      c.addEventListener('mouseenter', function () { focus(i); });
      c.addEventListener('mouseleave', function () { focus(null); });
    });

    focus(null);
  }

  /* ══ Closing fork ══════════════════════════════════════ */
  var FORK = {
    relief: {
      t: 'The relief question',
      body: 'It works. The discomfort goes, usually within the hour. What goes with it is the ' +
        'conversation you were avoiding, the evidence you had not gathered, and about half the ' +
        'routes you could still have taken.'
    },
    protect: {
      t: 'The protection question',
      body: 'It is slower and it does not feel as good today. It keeps the downside covered, the ' +
        'truth on the table, and the routes open. Six months later you are the one with choices.'
    }
  };

  function fork() {
    var svg = $('#pr-fork');
    var read = $('#pr-fork-read');
    if (!svg || !read) return;

    function show(key) {
      $$('.branch', svg).forEach(function (b) { b.classList.toggle('is-on', b.dataset.branch === key); });
      var f = FORK[key];
      if (f) read.innerHTML = '<b>' + f.t + '.</b> ' + f.body;
    }

    $$('.branch', svg).forEach(function (b) {
      b.addEventListener('mouseenter', function () { show(b.dataset.branch); });
      b.addEventListener('focus', function () { show(b.dataset.branch); });
      b.addEventListener('click', function () { show(b.dataset.branch); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(b.dataset.branch); }
      });
    });

    show('protect');
  }

  /* ══ Boot ══════════════════════════════════════════════ */
  function narrativeRail() {
    var links = $$('.pr-story-rail a');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var sections = links.map(function (link) { return $(link.getAttribute('href')); }).filter(Boolean);
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id); });
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  function init() {
    [progress, narrativeRail, consoleSearch, cards, sixQuestions, dial, sequence,
      doors, situationMap, orbit, fork].forEach(function (fn) {
        try { fn(); } catch (e) { /* one broken widget must not take the page down */ }
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
