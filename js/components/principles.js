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

    function apply(kind) {
      var n = 0;
      $$('.pr-card', wrap).forEach(function (c) {
        var match = kind === 'all' || c.dataset.group === kind;
        c.hidden = !match;
        if (match) n++;
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

  /* ══ The six questions ═════════════════════════════════ */
  function sixQuestions() {
    var wrap = $('#pr-six');
    var out = $('#pr-six-verdict');
    if (!wrap || !out) return;

    var state = load('six', {});
    var rows = $$('.pr-q', wrap);

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
          'The instruction here is not to try harder. It is to slow down.';
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
      body: 'Undoing this costs an afternoon and some mild awkwardness. Deliberation is the expensive part here, not the mistake.',
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
      advice: 'Raise the evidence bar. If urgency is coming from someone else rather than from the facts, that is worth naming out loud.'
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
      if (read) {
        read.innerHTML = '<p class="t">' + b.title + '</p><p>' + b.body + '</p><p><b style="color:var(--text)">' +
          (v > 45 ? 'Patience.' : 'Speed.') + '</b> ' + b.advice + '</p>';
      }
      if (chipWrap) {
        $$('.pr-chip', chipWrap).forEach(function (c) { c.classList.toggle('is-on', +c.dataset.v === v); });
      }
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

    function render() {
      steps.forEach(function (s, k) {
        s.classList.toggle('is-on', k <= i);
        s.classList.toggle('is-current', k === i);
      });
      if (next) {
        next.textContent = i < 0 ? 'Start the sequence' : (i >= steps.length - 1 ? 'Start again' : 'Next step');
      }
      if (note) {
        if (i < 0) {
          note.textContent = 'Use all eight steps in order. Secure the basics before you select a direction.';
        } else if (i >= steps.length - 1) {
          note.textContent = 'That is the sequence. Most people start at SELECT, which is step seven, and wonder why it keeps going wrong.';
        } else {
          note.textContent = 'Do not skip ahead. If you cannot finish this step honestly, the next one will be built on it anyway.';
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

    render();
  }

  /* ══ Boot ══════════════════════════════════════════════ */
  function init() {
    [progress, consoleSearch, cards, sixQuestions, dial, sequence].forEach(function (fn) {
      try { fn(); } catch (e) { /* one broken widget must not take the page down */ }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
