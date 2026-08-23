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

  /* ══ Situation diagrams ════════════════════════════════
     One diagram per situation, built from the `viz` block in
     _data/principles.yml. Every label in a spec is lifted from that
     situation's own trigger, ask, rule, steps or body, so a diagram
     restates what the card already says and never asserts anything new.

     Label-heavy shapes are HTML so the text wraps and stays selectable.
     Geometric shapes are SVG. Colour is always a custom property, so
     both themes are handled without a second definition. */

  var VZ = 320;  // SVG user-space width every builder draws into
  var LH = 13;   // line height for wrapped SVG labels

  /* Break a label into lines of roughly `per` characters. */
  function wrap(text, per) {
    var words = String(text).split(/\s+/), lines = [], line = '';
    words.forEach(function (w) {
      if (!line) { line = w; return; }
      if ((line + ' ' + w).length <= per) line += ' ' + w;
      else { lines.push(line); line = w; }
    });
    if (line) lines.push(line);
    return lines;
  }

  /* Wrapped <text>, plus the box it actually occupies, so callers can size
     the diagram from its labels instead of guessing.

     `grow` says which way the extra lines go: "down" from y (the default),
     "up" so the block ends at y, or "mid" so it straddles y. A label sitting
     above a node has to grow upward, or its second line lands on the node. */
  function label(text, x, y, per, cls, anchor, grow) {
    var lines = wrap(text, per), n = lines.length;
    var top = grow === 'up' ? y - (n - 1) * LH
      : grow === 'mid' ? y - (n - 1) * LH / 2
        : y;
    var a = anchor ? ' text-anchor="' + anchor + '"' : '';
    var t = '<text class="pv-t' + (cls ? ' ' + cls : '') + '"' + a + '>' +
      lines.map(function (l, i) {
        return '<tspan x="' + x + '" y="' + (top + i * LH).toFixed(1) + '">' + esc(l) + '</tspan>';
      }).join('') + '</text>';
    return { svg: t, lines: n, top: top - 9, bottom: top + (n - 1) * LH };
  }

  function svg(h, inner) {
    return '<svg class="pv-svg" viewBox="0 0 ' + VZ + ' ' + Math.ceil(h) + '" role="img" aria-hidden="true">' +
      inner + '</svg>';
  }

  /* Radial labels can reach above y=0. Rather than clip them, move the whole
     drawing down by however far it overshot and grow the box to match. */
  function shift(top, h, inner) {
    var dy = top < 2 ? 2 - top : 0;
    return svg(h + dy, dy ? '<g transform="translate(0,' + dy.toFixed(1) + ')">' + inner + '</g>' : inner);
  }

  function maxBottom() {
    return Math.max.apply(null, Array.prototype.slice.call(arguments).map(function (o) { return o.bottom; }));
  }

  var BUILD = {
    /* One input, two or three labelled branches. */
    split: function (v) {
      var outs = (v.out || []).map(function (o) {
        return '<li class="pv-branch' + (o.on ? ' is-on' : '') + '"><span>' + esc(o.k) + '</span></li>';
      }).join('');
      return '<div class="pv pv-split">' +
        '<p class="pv-in">' + esc(v['in']) + '</p>' +
        '<ul class="pv-branches">' + outs + '</ul></div>';
    },

    /* Numbered stages that must run in sequence. */
    order: function (v) {
      var li = (v.items || []).map(function (t, i) {
        return '<li><b>' + (i + 1) + '</b><span>' + esc(t) + '</span></li>';
      }).join('');
      return '<ol class="pv pv-order">' + li + '</ol>';
    },

    /* A priority stack. The last item is the foundation and sits at the bottom. */
    stack: function (v) {
      var items = v.items || [];
      return '<ul class="pv pv-stack">' + items.map(function (t, i) {
        return '<li class="' + (i === items.length - 1 ? 'is-base' : '') + '"><span>' + esc(t) + '</span></li>';
      }).join('') + '</ul>';
    },

    /* Grouped chips, where the source text is genuinely an unordered list. */
    chips: function (v) {
      return '<div class="pv pv-chips">' + (v.groups || []).map(function (grp) {
        var chips = (grp.items || []).map(function (c) {
          return '<span class="pv-chip">' + esc(c) + '</span>';
        }).join('');
        return '<div class="pv-group' + (grp.on ? ' is-on' : '') + '">' +
          '<span class="pv-gk">' + esc(grp.k) + '</span>' +
          '<div class="pv-chiprow">' + chips + '</div></div>';
      }).join('') + '</div>';
    },

    /* Assumption, cheap probe, evidence, and back round again. */
    test: function (v) {
      return '<div class="pv pv-test">' +
        '<div class="pv-tbox">' + esc(v.claim) + '</div>' +
        '<i aria-hidden="true">&rarr;</i>' +
        '<div class="pv-tbox is-on">' + esc(v.probe) + '</div>' +
        '<i aria-hidden="true">&rarr;</i>' +
        '<div class="pv-tbox">' + esc(v.result) + '</div>' +
        '<span class="pv-tloop" aria-hidden="true"></span></div>';
    },

    /* A path that has to stop before it continues. The two end labels sit on
       one row and the stop label drops to the next, so they cannot collide. */
    gate: function (v) {
      var a = label(v.before, 8, 72, 20, 'pv-t-dim', 'start');
      var b = label(v.after, 312, 72, 20, 'pv-t-go', 'end');
      var c = label(v.stop, 160, Math.max(a.bottom, b.bottom) + 20, 34, 'pv-t-stop', 'middle');
      return svg(c.bottom + 12,
        '<line class="pv-line" x1="8" y1="34" x2="120" y2="34"/>' +
        '<line class="pv-stop" x1="132" y1="14" x2="132" y2="54"/>' +
        '<line class="pv-line pv-dash" x1="144" y1="34" x2="196" y2="34"/>' +
        '<line class="pv-line pv-go" x1="208" y1="34" x2="300" y2="34"/>' +
        '<path class="pv-head" d="M298 28 312 34 298 40Z"/>' +
        a.svg + b.svg + c.svg);
    },

    /* A bar with the evidence threshold marked on it. */
    threshold: function (v) {
      var m = clamp(+v.mark || 0.5, 0.04, 0.96), x = 20 + m * 280;
      var lo = label(v.lo, 20, 70, 20, 'pv-t-dim', 'start');
      var hi = label(v.hi, 300, 70, 20, 'pv-t-dim', 'end');
      var lab = label(v.label, 160, maxBottom(lo, hi) + 22, 38, 'pv-t-go', 'middle');
      return svg(lab.bottom + 12,
        '<rect class="pv-track" x="20" y="30" width="280" height="14" rx="7"/>' +
        '<rect class="pv-fill" x="20" y="30" width="' + (m * 280).toFixed(1) + '" height="14" rx="7"/>' +
        '<line class="pv-stop" x1="' + x.toFixed(1) + '" y1="18" x2="' + x.toFixed(1) + '" y2="56"/>' +
        lo.svg + hi.svg + lab.svg);
    },

    /* Two curves: one climbing fast, one climbing slowly. */
    trend: function (v) {
      var f = label(v.fast, 20, 126, 24, 'pv-t-stop', 'start');
      var s = label(v.slow, 304, 126, 24, 'pv-t-go', 'end');
      return svg(maxBottom(f, s) + 12,
        '<line class="pv-axis" x1="20" y1="104" x2="304" y2="104"/>' +
        '<line class="pv-axis" x1="20" y1="8" x2="20" y2="104"/>' +
        '<path class="pv-curve pv-curve-fast" d="M20 104 C90 100 130 66 170 44 S250 16 300 12"/>' +
        '<path class="pv-curve pv-curve-slow" d="M20 104 C100 100 170 92 230 84 S280 78 300 76"/>' +
        '<circle class="pv-dot pv-dot-fast" cx="300" cy="12" r="4"/>' +
        '<circle class="pv-dot pv-dot-slow" cx="300" cy="76" r="4"/>' +
        f.svg + s.svg);
    },

    /* A protected core inside what it makes possible. */
    rings: function (v) {
      var mid = label(v.mid, 182, 50, 17, 'pv-t-go', 'start');
      var out = label(v.outer, 182, Math.max(mid.bottom + 24, 116), 17, 'pv-t-dim', 'start');
      return svg(Math.max(out.bottom + 12, 172),
        '<circle class="pv-ring" cx="84" cy="86" r="72"/>' +
        '<circle class="pv-ring" cx="84" cy="86" r="46"/>' +
        '<circle class="pv-core" cx="84" cy="86" r="24"/>' +
        '<text class="pv-t pv-t-core" x="84" y="90" text-anchor="middle">' + esc(v.core) + '</text>' +
        '<line class="pv-lead" x1="130" y1="58" x2="176" y2="46"/>' +
        '<line class="pv-lead" x1="152" y1="118" x2="176" y2="' + (out.bottom - 8) + '"/>' +
        mid.svg + out.svg);
    },

    /* A balance, left level, because the card asks you to weigh them. */
    scale: function (v) {
      var a = label(v.a, 46, 92, 15, 'pv-t-dim', 'middle');
      var b = label(v.b, 274, 92, 15, 'pv-t-go', 'middle');
      return svg(maxBottom(a, b) + 12,
        '<path class="pv-stand" d="M120 96h80M160 96V44"/>' +
        '<path class="pv-pivot" d="m160 26 10 18h-20Z"/>' +
        '<line class="pv-beam" x1="46" y1="28" x2="274" y2="28"/>' +
        '<line class="pv-cord" x1="46" y1="28" x2="46" y2="52"/>' +
        '<path class="pv-dish" d="M18 52h56l-10 18H28Z"/>' +
        '<line class="pv-cord" x1="274" y1="28" x2="274" y2="52"/>' +
        '<path class="pv-dish pv-dish-on" d="M246 52h56l-10 18h-36Z"/>' +
        a.svg + b.svg);
    },

    /* A cycle. Centred, so the widest label on either side has room, and the
       exit (when the source names one) drops below rather than pushing right. */
    loop: function (v) {
      var nodes = v.nodes || [], n = nodes.length;
      var cx = 160, cy = 88, r = 54, out = '', bottom = cy + r, top = 0;
      out += '<circle class="pv-ring pv-ring-dash" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>';
      nodes.forEach(function (t, i) {
        var a = (-90 + i * 360 / n) * Math.PI / 180;
        var co = Math.cos(a), si = Math.sin(a);
        out += '<circle class="pv-node" cx="' + (cx + r * co).toFixed(1) + '" cy="' + (cy + r * si).toFixed(1) + '" r="7"/>';
        var anchor = Math.abs(co) < 0.35 ? 'middle' : (co > 0 ? 'start' : 'end');
        var grow = si < -0.35 ? 'up' : (Math.abs(si) <= 0.35 ? 'mid' : 'down');
        var l = label(t, +(cx + (r + 16) * co).toFixed(1), +(cy + (r + 16) * si + 4).toFixed(1), 12, '', anchor, grow);
        out += l.svg;
        bottom = Math.max(bottom, l.bottom);
        top = Math.min(top, l.top);
      });
      if (v.exit) {
        var arrowTop = bottom + 16;
        out += '<line class="pv-line pv-go" x1="' + cx + '" y1="' + arrowTop + '" x2="' + cx + '" y2="' + (arrowTop + 22) + '"/>' +
          '<path class="pv-head" d="M' + (cx - 6) + ' ' + (arrowTop + 20) + ' ' + cx + ' ' + (arrowTop + 32) + ' ' + (cx + 6) + ' ' + (arrowTop + 20) + 'Z"/>';
        var ex = label(v.exit, cx, arrowTop + 50, 36, 'pv-t-go', 'middle');
        out += ex.svg;
        bottom = ex.bottom;
      }
      return shift(top, bottom + 14, out);
    },

    /* Many things in, one thing out. */
    funnel: function (v) {
      var a = label(v.wide, 16, 112, 22, 'pv-t-dim', 'start');
      var b = label(v.narrow, 304, 112, 22, 'pv-t-go', 'end');
      return svg(maxBottom(a, b) + 12,
        '<path class="pv-funnel" d="M16 14h288l-96 54v26l-96 16V68Z"/>' + a.svg + b.svg);
    },

    /* One centre, a spoke for each thing to read off it. */
    hub: function (v) {
      var nodes = v.nodes || [], n = nodes.length, cx = 160, cy = 80, r = 50, out = '', bottom = cy + r, top = 0;
      nodes.forEach(function (t, i) {
        var a = (-90 + i * 360 / n) * Math.PI / 180;
        var co = Math.cos(a), si = Math.sin(a);
        var x = cx + r * co, y = cy + r * si;
        out += '<line class="pv-spoke" x1="' + cx + '" y1="' + cy + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '"/>';
        out += '<circle class="pv-node pv-node-on" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="6"/>';
        var anchor = Math.abs(co) < 0.35 ? 'middle' : (co > 0 ? 'start' : 'end');
        var grow = si < -0.35 ? 'up' : (Math.abs(si) <= 0.35 ? 'mid' : 'down');
        var l = label(t, +(cx + (r + 16) * co).toFixed(1), +(cy + (r + 16) * si + 4).toFixed(1), 12, '', anchor, grow);
        out += l.svg;
        bottom = Math.max(bottom, l.bottom);
        top = Math.min(top, l.top);
      });
      out += '<circle class="pv-core" cx="' + cx + '" cy="' + cy + '" r="22"/>' +
        '<text class="pv-t pv-t-core" x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle">' + esc(v.center) + '</text>';
      return shift(top, bottom + 14, out);
    },

    /* Scattered days, the two outliers greyed, the pattern drawn through. */
    pattern: function (v) {
      var pts = [0.52, 0.34, 0.61, 0.10, 0.58, 0.44, 0.66, 0.40, 0.93, 0.49, 0.38, 0.57];
      var hiI = pts.indexOf(0.93), loI = pts.indexOf(0.10);
      var out = '<line class="pv-axis" x1="20" y1="92" x2="304" y2="92"/>';
      pts.forEach(function (p, i) {
        var x = 28 + i * 24, y = 88 - p * 68;
        out += '<circle class="pv-dot' + (i === hiI || i === loI ? ' pv-dot-out' : '') +
          '" cx="' + x + '" cy="' + y.toFixed(1) + '" r="4"/>';
      });
      out += '<line class="pv-curve pv-curve-slow" x1="26" y1="58" x2="306" y2="52"/>';
      var hi = label(v.hi, clamp(28 + hiI * 24, 60, 260), 14, 22, 'pv-t-dim', 'middle');
      var lo = label(v.lo, clamp(28 + loI * 24, 60, 260), 110, 22, 'pv-t-dim', 'middle');
      return svg(lo.bottom + 12, out + hi.svg + lo.svg);
    },

    /* A strip of named bands, with one marked when the source names one.
       HTML rather than SVG: at six bands the names are wider than the bands
       are, and only real text flow keeps them off each other. */
    bands: function (v) {
      var mark = +v.mark;
      return '<div class="pv pv-bandrow">' + (v.items || []).map(function (t, i) {
        return '<div class="pv-band' + (i === mark ? ' is-on' : '') + '">' +
          '<i aria-hidden="true"></i><span>' + esc(t) + '</span></div>';
      }).join('') + '</div>';
    }
  };

  function situationViz() {
    var byId = {};
    (DATA.situations || []).forEach(function (s) { byId[s.id] = s; });

    $$('.pr-card').forEach(function (card) {
      var s = byId[(card.id || '').replace(/^sit-/, '')];
      if (!s || !s.viz || !BUILD[s.viz.type]) return;
      var body = $('.pr-card-body', card);
      if (!body || $('.pr-viz', body)) return;

      var block = document.createElement('div');
      block.className = 'pr-block pr-viz pv-' + s.viz.type;
      var html = '<span class="k">The shape of it</span>' + BUILD[s.viz.type](s.viz);
      if (s.viz.cap) html += '<p class="pv-cap">' + esc(s.viz.cap) + '</p>';
      block.innerHTML = html;
      body.insertBefore(block, body.firstChild);
    });
  }

  /* ══ Situations explored ═══════════════════════════════
     A card counts as explored once it has been opened. The record is local
     storage only, and it drives the counter above the grid, a tick on the
     matching glyph, and a quiet marker on the card itself. */
  function explored() {
    var wrap = $('#pr-cards');
    if (!wrap) return;

    var total = (DATA.situations || []).length;
    var seen = load('seen', {}) || {};
    var fill = $('#pr-seen-fill');
    var num = $('#pr-seen-n');
    var say = $('#pr-seen-say');
    var reset = $('#pr-seen-reset');

    function paint() {
      var ids = Object.keys(seen).filter(function (k) { return seen[k]; });
      var n = ids.length;
      if (num) num.textContent = n;
      if (fill) fill.style.width = (total ? n / total * 100 : 0) + '%';
      $$('.pr-card', wrap).forEach(function (c) {
        c.classList.toggle('is-seen', !!seen[(c.id || '').replace(/^sit-/, '')]);
      });
      $$('.pr-map-cell').forEach(function (c) {
        c.classList.toggle('is-seen', !!seen[c.dataset.go]);
      });
      if (say) {
        say.textContent = n === 0
          ? 'Nothing opened yet. Open the one you are actually in.'
          : n < total
            ? 'Opened so far. The rest are here when you need them.'
            : 'All of them opened. The eight-step sequence covers what is left.';
      }
    }

    /* Watch the cards rather than the controls. A card opens from a click, from
       Expand all, from a search result and from a #sit- deep link, and only the
       class tells you it happened whichever route was taken. */
    function sweep() {
      var added = false;
      $$('.pr-card', wrap).forEach(function (c) {
        if (!c.classList.contains('is-open')) return;
        var id = (c.id || '').replace(/^sit-/, '');
        if (id && !seen[id]) { seen[id] = true; added = true; }
      });
      if (added) { save('seen', seen); paint(); }
    }

    if (window.MutationObserver) {
      new MutationObserver(sweep).observe(wrap, {
        subtree: true, attributes: true, attributeFilter: ['class']
      });
    } else {
      wrap.addEventListener('click', function () { setTimeout(sweep, 0); });
    }

    if (reset) {
      reset.addEventListener('click', function () {
        seen = {};
        save('seen', seen);
        paint();
      });
    }

    paint();
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
    [progress, narrativeRail, consoleSearch, situationViz, cards, explored, sixQuestions,
      dial, sequence, doors, situationMap, orbit, fork].forEach(function (fn) {
        try { fn(); } catch (e) { /* one broken widget must not take the page down */ }
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
