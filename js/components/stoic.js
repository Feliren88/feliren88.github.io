/**
 * Stoic — interactive layer for /stoic/
 *
 * Widgets are independent and fail quietly if their markup is absent, so the
 * page still reads as a plain document with JavaScript off. Passage data comes
 * from a JSON island the Liquid template emits, which keeps _data/stoic.yml the
 * single source of truth. localStorage prefix: st:
 */
(function () {
  'use strict';

  var STORE = 'st:';

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
    var el = document.getElementById('st-data');
    if (!el) return { passages: [] };
    try { return JSON.parse(el.textContent); } catch (e) { return { passages: [] }; }
  })();

  var SOURCE_LABEL = {
    meditations: 'Meditations',
    encheiridion: 'Enchiridion'
  };
  var SOURCE_AUTHOR = {
    meditations: 'Marcus Aurelius',
    encheiridion: 'Epictetus'
  };

  function cite(p) {
    return SOURCE_AUTHOR[p.source] + ', ' + SOURCE_LABEL[p.source] + ' ' + p.ref;
  }

  /* ══ Reading progress ══════════════════════════════════ */
  function progress() {
    var bar = $('#st-progress-fill');
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

  /* ══ The dichotomy sorter ══════════════════════════════ */
  // Epictetus draws the line at "whatever are our own acts". Each item is
  // written so the honest answer is the one the Enchiridion would give.
  var SORT_ITEMS = [
    { t: 'Whether your flight is cancelled', mine: false,
      why: 'Weather, crews and airlines are not your acts. Wanting it otherwise adds a second problem to the first.' },
    { t: 'Whether you take it out on the person at the desk', mine: true,
      why: 'They did not ground the plane. What you do in the queue is entirely yours, and it is the only part anyone will remember.' },
    { t: 'Whether your work is well thought of', mine: false,
      why: 'Reputation lives in other people. Epictetus files it with property and office, under things that can be taken.' },
    { t: 'Whether the work is actually good', mine: true,
      why: 'This one is yours end to end. It is also the only one of the pair you can act on this morning.' },
    { t: 'Whether you fall ill', mine: false,
      why: 'The body is on the borrowed list. Sickness hinders the body, Epictetus says, and not your ability to choose, unless that is your choice.' },
    { t: 'Whether you keep your word while ill', mine: true,
      why: 'Illness changes what you can do. It does not touch how you conduct yourself while doing less.' },
    { t: 'Whether someone lies about you', mine: false,
      why: 'Their tongue, their act. You get no vote in it, and pretending otherwise is where the suffering starts.' },
    { t: 'Whether you become the thing they accused you of', mine: true,
      why: 'This is the whole of your exposure. Marcus says the best revenge is not to become like the wrongdoer.' },
    { t: 'How long you live', mine: false,
      why: 'Not yours, and Marcus returns to it constantly. The length was never the variable worth arguing about.' },
    { t: 'What you do with this afternoon', mine: true,
      why: 'Yours, and the only unit either man thinks you actually own.' }
  ];

  function sorter() {
    var wrap = $('#st-sorter');
    if (!wrap) return;
    var itemEl = $('#st-sort-item');
    var fb = $('#st-sort-fb');
    var pips = $('#st-sort-pips');
    var nextBtn = $('#st-sort-next');
    var again = $('#st-sort-again');
    var tally = $('#st-sort-tally');
    var bins = $$('.st-bin', wrap);

    var i = 0, right = 0, answered = false, marks = [];

    function drawPips() {
      if (!pips) return;
      pips.innerHTML = '';
      SORT_ITEMS.forEach(function (_, k) {
        var p = document.createElement('span');
        p.className = 'st-pip' + (marks[k] === true ? ' ok' : marks[k] === false ? ' no' : k === i ? ' current' : '');
        pips.appendChild(p);
      });
    }

    function render() {
      answered = false;
      var it = SORT_ITEMS[i];
      if (itemEl) itemEl.textContent = it.t;
      if (fb) { fb.classList.remove('is-on'); fb.innerHTML = ''; }
      if (nextBtn) { nextBtn.disabled = true; nextBtn.textContent = i === SORT_ITEMS.length - 1 ? 'See the tally' : 'Next'; }
      bins.forEach(function (b) { b.disabled = false; });
      drawPips();
    }

    function answer(mine) {
      if (answered) return;
      answered = true;
      var it = SORT_ITEMS[i];
      var ok = (mine === it.mine);
      marks[i] = ok;
      if (ok) right++;
      bins.forEach(function (b) { b.disabled = true; });
      if (fb) {
        fb.innerHTML = '<p class="v">' + (ok ? 'Yes.' : 'Epictetus would say no.') + ' ' +
          (it.mine ? 'This one is up to you.' : 'This one is not up to you.') + '</p><p>' + it.why + '</p>';
        fb.classList.add('is-on');
      }
      if (nextBtn) nextBtn.disabled = false;
      drawPips();
    }

    bins.forEach(function (b) {
      b.addEventListener('click', function () { answer(b.dataset.bin === 'mine'); });
    });

    function finish() {
      if (itemEl) itemEl.textContent = 'That is the whole exercise.';
      if (fb) { fb.classList.remove('is-on'); fb.innerHTML = ''; }
      bins.forEach(function (b) { b.disabled = true; });
      if (nextBtn) nextBtn.style.display = 'none';
      if (again) again.style.display = '';
      if (tally) {
        var msg = right === SORT_ITEMS.length
          ? 'Ten out of ten. The line is easy to draw on paper. The test is whether you can still find it while angry.'
          : right >= 7
            ? 'Most of them. The ones people miss are usually the ones they most want to control.'
            : 'Worth a second pass. Notice which way you erred: nearly everyone claims more than they hold.';
        tally.innerHTML = '<b>' + right + ' / ' + SORT_ITEMS.length + '</b> &nbsp;' + msg;
      }
      save('sorter', right);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        i++;
        if (i >= SORT_ITEMS.length) { finish(); return; }
        render();
      });
    }
    if (again) {
      again.style.display = 'none';
      again.addEventListener('click', function () {
        i = 0; right = 0; marks = [];
        if (nextBtn) nextBtn.style.display = '';
        again.style.display = 'none';
        if (tally) tally.innerHTML = '';
        render();
      });
    }

    render();
  }

  /* ══ The judgement machine ═════════════════════════════ */
  // Enchiridion 5: the event is fixed, the judgement is the lever, and the
  // response follows from the judgement rather than from the event.
  var SCENES = [
    {
      event: 'Someone talks about you behind your back.',
      impression: 'I have been wronged. This has to be answered.',
      judgements: [
        { t: 'They have damaged me.', r: 'Anger. You rehearse the reply for two days and sleep badly.', good: false },
        { t: 'They have said a thing. Whether it harms me is a separate question.', r: 'Interest. You check whether any of it is true, and use the part that is.', good: true },
        { t: 'They acted on what seemed right to them, and were wrong.', r: 'Something close to pity. You stop treating it as an attack on you.', good: true }
      ]
    },
    {
      event: 'A plan you spent months on is cancelled.',
      impression: 'The work is wasted. I have lost it.',
      judgements: [
        { t: 'It was mine and it was taken.', r: 'Grievance. You spend the next month litigating the decision.', good: false },
        { t: 'It was lent, and it has been returned.', r: 'Steadiness. You keep the capability you built and stop guarding the corpse.', good: true },
        { t: 'The outcome was never the part I held.', r: 'Release. You look at what the work made you able to do next.', good: true }
      ]
    },
    {
      event: 'You are stuck in traffic and will be late.',
      impression: 'This is intolerable. Everything is going wrong.',
      judgements: [
        { t: 'This should not be happening to me.', r: 'Fury at strangers in other cars, which moves no traffic at all.', good: false },
        { t: 'This is what roads do. I did not price it in.', r: 'Calm. You send one honest message and stop paying twice.', good: true }
      ]
    }
  ];

  function machine() {
    var wrap = $('#st-machine');
    if (!wrap) return;
    var evEl = $('#st-m-event');
    var imEl = $('#st-m-impression');
    var jWrap = $('#st-m-judgements');
    var reEl = $('#st-m-response');
    var nextBtn = $('#st-m-next');

    var si = 0, ji = -1;

    function render() {
      var s = SCENES[si];
      if (evEl) evEl.textContent = s.event;
      if (imEl) imEl.textContent = s.impression;
      if (jWrap) {
        jWrap.innerHTML = '';
        s.judgements.forEach(function (j, k) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'st-judge' + (k === ji ? ' is-on' : '');
          b.textContent = j.t;
          b.addEventListener('click', function () { ji = k; render(); });
          jWrap.appendChild(b);
        });
      }
      if (reEl) {
        reEl.innerHTML = ji < 0
          ? '<span style="opacity:.7">Pick a judgement above. The event will not change.</span>'
          : esc(s.judgements[ji].r);
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        si = (si + 1) % SCENES.length;
        ji = -1;
        render();
      });
    }

    render();
  }

  /* ══ The three disciplines ═════════════════════════════ */
  var TRIAD = [
    {
      key: 'perception',
      label: 'Perception',
      greek: 'the discipline of assent',
      body: 'Stop at what actually happened. Marcus tells himself to say nothing beyond what the first appearance reports: it was said, not I was injured. The addition is where suffering enters.',
      cue: 'Say only what a camera saw.'
    },
    {
      key: 'action',
      label: 'Action',
      greek: 'the discipline of impulse',
      body: 'Act for the common good, and act with a reservation. You commit to the effort, not to the outcome, because the outcome was never the part you held.',
      cue: 'Do the just thing, hold the result loosely.'
    },
    {
      key: 'will',
      label: 'Will',
      greek: 'the discipline of desire',
      body: 'Want what happens. This is the hardest of the three and the one that decides the other two, because desire aimed at things outside your control guarantees the disturbance.',
      cue: 'Confine desire to what is yours.'
    }
  ];

  function triad() {
    var svg = $('#st-triad');
    if (!svg) return;
    var read = $('#st-triad-read');
    var nodes = $$('.node', svg);
    var labels = $$('.tlab', svg);

    function focus(i) {
      svg.classList.toggle('has-focus', i !== null);
      nodes.forEach(function (n, k) { n.classList.toggle('is-on', k === i); });
      labels.forEach(function (l, k) { l.classList.toggle('is-on', k === i); });
      if (!read) return;
      if (i === null) {
        read.innerHTML = '<p class="t">Three disciplines, one life</p>' +
          '<p>Marcus keeps returning to the same three moves: judge accurately, act justly, and want what you get. ' +
          'They are not stages. They run at once, on the same moment. Hover one.</p>';
      } else {
        var t = TRIAD[i];
        read.innerHTML = '<p class="who">' + esc(t.greek) + '</p><p class="t">' + esc(t.label) + '</p>' +
          '<p>' + esc(t.body) + '</p><p><b style="color:var(--text)">' + esc(t.cue) + '</b></p>';
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

    focus(null);
  }

  /* ══ Passage console ═══════════════════════════════════ */
  var STOP = ('the and for with that this what how when where why who was were are ' +
    'you your yours she her his they them their our its being been have has had ' +
    'should could would about into from than then there here just only very much more ' +
    'get got some any all not but out off now can did does doing done ' +
    'feel feels feeling felt think thinks thinking thought want wants wanted ' +
    'know knows knew make makes making made take takes taking took ' +
    'something someone anything everything').split(' ');

  var GROUP_ALIAS = {
    control: 'control power mine not up to me dichotomy choose choice',
    judgement: 'judgement opinion impression assent upset disturbed offended interpret',
    adversity: 'adversity obstacle setback hardship illness pain loss failure ruin',
    others: 'others people insult rude annoying family colleague enemy blame crowd',
    desire: 'desire want craving envy jealousy money status pleasure appetite',
    death: 'death dying mortality grief bereavement funeral loss time short',
    action: 'action duty work procrastinate start effort role job task'
  };

  // Both translations are centuries old, so the words a reader reaches for are
  // rarely the words on the page. Expanding the query is more honest than
  // rewriting the sources.
  var SYNONYMS = {
    died: ['dead', 'dies', 'death'], die: ['dead', 'dies', 'death'],
    dying: ['dead', 'dies', 'death'], dead: ['dies', 'death'],
    grief: ['dead', 'dies', 'weeping', 'death'], grieving: ['dead', 'weeping', 'death'],
    bereaved: ['dead', 'dies', 'death'], bereavement: ['dead', 'dies', 'death'],
    mourning: ['weeping', 'dead', 'death'], funeral: ['dead', 'death'],
    anxious: ['terrible', 'disturbed', 'appearance', 'fear'],
    anxiety: ['terrible', 'disturbed', 'appearance', 'fear'],
    worried: ['terrible', 'disturbed', 'fear'], worry: ['terrible', 'disturbed', 'fear'],
    panic: ['disturbed', 'terrible'], dread: ['terrible', 'fear'],
    betrayed: ['reviles', 'harms', 'deceived', 'ill'],
    betrayal: ['reviles', 'harms', 'deceived'],
    gossip: ['speaks', 'ill', 'faults'], slander: ['speaks', 'ill', 'reviles'],
    procrastinate: ['procrastination', 'delay'], procrastinating: ['procrastination', 'delay'],
    lazy: ['slothful', 'negligent'], stuck: ['delay', 'hindrance'],
    sacked: ['dishonor', 'nobody'], fired: ['dishonor', 'nobody'],
    redundancy: ['dishonor', 'estate', 'nobody'],
    tempted: ['pleasure', 'desire'], temptation: ['pleasure', 'desire'],
    craving: ['desire', 'pleasure'], urge: ['pleasure', 'desire'],
    jealous: ['richer', 'preferred', 'better'], jealousy: ['richer', 'preferred'],
    compare: ['richer', 'eloquent', 'better'], comparison: ['richer', 'eloquent'],
    lonely: ['alone'], insult: ['insults', 'insulting', 'reviles'],
    rejected: ['preferred', 'dishonor'], criticised: ['reviles', 'speaks', 'blame'],
    criticized: ['reviles', 'speaks', 'blame'], embarrassed: ['dishonor', 'ridiculed']
  };

  function variants(t) {
    var v = [t];
    if (t.length > 5 && /ing$/.test(t)) { v.push(t.slice(0, -3)); v.push(t.slice(0, -3) + 'e'); }
    if (t.length > 4 && /ed$/.test(t)) { v.push(t.slice(0, -2)); v.push(t.slice(0, -1)); }
    if (t.length > 4 && /ies$/.test(t)) v.push(t.slice(0, -3) + 'y');
    if (t.length > 3 && /s$/.test(t) && !/ss$/.test(t)) v.push(t.slice(0, -1));
    (SYNONYMS[t] || []).forEach(function (x) { if (v.indexOf(x) === -1) v.push(x); });
    return v;
  }

  function hay(p) {
    // p.search holds keywords from the surrounding source unit, so a passage is
    // findable by a word its pull quote happens not to contain.
    return [p.situation, p.quote, p.take, p.group, p.search || '',
      GROUP_ALIAS[p.group] || ''].join(' ').toLowerCase();
  }

  function consoleSearch() {
    var input = $('#st-search');
    var out = $('#st-results');
    if (!input || !out) return;

    var index = (DATA.passages || []).map(function (p) { return { p: p, hay: hay(p) }; });

    function highlight(text, terms) {
      var html = esc(text);
      terms.forEach(function (t) {
        if (t.length < 3) return;
        html = html.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
      });
      return html;
    }

    function render(q) {
      var query = q.trim().toLowerCase();
      out.innerHTML = '';
      if (!query) {
        out.innerHTML = '<p class="st-empty">Type what is happening. Plain words work: ' +
          '<b>insulted</b>, <b>anxious</b>, <b>lost my job</b>, <b>someone died</b>, <b>cannot start</b>.</p>';
        return;
      }
      var raw = query.split(/\s+/).filter(Boolean);
      var terms = raw.filter(function (t) { return t.length > 2 && STOP.indexOf(t) === -1; });
      if (!terms.length) terms = raw;
      var forms = terms.map(variants);

      var hits = index.map(function (r) {
        var score = 0, matched = 0;
        forms.forEach(function (vs) {
          var w = 0;
          for (var i = 0; i < vs.length && !w; i++) {
            if (r.p.situation.toLowerCase().indexOf(vs[i]) !== -1) w = 6;
            else if (r.p.quote.toLowerCase().indexOf(vs[i]) !== -1) w = 4;
            else if ((r.p.search || '').indexOf(vs[i]) !== -1) w = 3;
            else if ((GROUP_ALIAS[r.p.group] || '').indexOf(vs[i]) !== -1) w = 2;
            else if (r.hay.indexOf(vs[i]) !== -1) w = 1;
          }
          if (w) { matched++; score += w; }
        });
        return { p: r.p, score: score, matched: matched };
      }).filter(function (r) { return r.matched > 0; });

      var best = hits.reduce(function (m, r) { return Math.max(m, r.matched); }, 0);
      hits = hits.filter(function (r) { return r.matched === best; })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, 6);

      if (!hits.length) {
        out.innerHTML = '<p class="st-empty">Nothing matched. Try a feeling rather than a situation, ' +
          'or browse the list below.</p>';
        return;
      }
      hits.forEach(function (h) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'st-result';
        b.dataset.go = h.p.id;
        b.innerHTML = '<span class="rt">' + highlight(h.p.situation, terms) + '</span>' +
          '<span class="rq">' + esc(cite(h.p)) + '</span>';
        out.appendChild(b);
      });
    }

    var deb;
    input.addEventListener('input', function () {
      clearTimeout(deb);
      deb = setTimeout(function () { render(input.value); }, 90);
    });
    out.addEventListener('click', function (e) {
      var b = e.target.closest('[data-go]');
      if (b) openPassage(b.dataset.go, true);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var f = $('[data-go]', out);
      if (f) openPassage(f.dataset.go, true);
    });

    render('');
  }

  function openPassage(id, scroll) {
    var card = document.getElementById('pas-' + id);
    if (!card) return;
    var all = $('.st-filters .filter-pill[data-filter="all"]');
    if (card.hidden && all) all.click();
    card.classList.add('is-open');
    var btn = $('button', card);
    if (btn) btn.setAttribute('aria-expanded', 'true');
    $$('.st-card.is-hit').forEach(function (c) { c.classList.remove('is-hit'); });
    card.classList.add('is-hit');
    setTimeout(function () { card.classList.remove('is-hit'); }, 2400);
    if (scroll) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function cards() {
    var wrap = $('#st-cards');
    if (!wrap) return;

    $$('.st-card', wrap).forEach(function (c) {
      var btn = $('button', c);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = c.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    var pills = $$('.st-filters .filter-pill');
    var count = $('#st-count');

    function apply(kind) {
      var n = 0;
      $$('.st-card', wrap).forEach(function (c) {
        var match = kind === 'all' || c.dataset.group === kind;
        c.hidden = !match;
        if (match) n++;
      });
      if (count) count.textContent = n + (n === 1 ? ' passage' : ' passages');
    }

    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        pills.forEach(function (o) { o.classList.remove('is-active'); });
        p.classList.add('is-active');
        apply(p.dataset.filter || 'all');
      });
    });

    var expand = $('#st-expand');
    if (expand) {
      expand.addEventListener('click', function () {
        var open = expand.dataset.open === 'true';
        $$('.st-card', wrap).forEach(function (c) {
          c.classList.toggle('is-open', !open);
          var b = $('button', c);
          if (b) b.setAttribute('aria-expanded', !open ? 'true' : 'false');
        });
        expand.dataset.open = open ? 'false' : 'true';
        expand.textContent = open ? 'Expand all' : 'Collapse all';
      });
    }

    apply('all');
    if (location.hash.indexOf('#pas-') === 0) openPassage(location.hash.slice(5), true);
  }

  /* ══ View from above ═══════════════════════════════════ */
  var ZOOM = [
    { r: 14, label: 'you', t: 'You, right now',
      b: 'The thing that feels enormous is currently the size of one person in one room.' },
    { r: 30, label: 'the room', t: 'The building',
      b: 'Everyone else here has a problem they think is the largest in the room. None of them is thinking about yours.' },
    { r: 52, label: 'the city', t: 'The city',
      b: 'A few million people, most of whom will never hear your name, all conducting their own emergencies.' },
    { r: 78, label: 'the country', t: 'The country',
      b: 'Marcus ran one. He still wrote to himself at night about not losing his temper with a colleague.' },
    { r: 104, label: 'the Earth', t: 'The Earth',
      b: 'Marcus calls the whole sea a drop and Athos a little clod. He is not consoling you. He is measuring.' },
    { r: 128, label: 'all of it', t: 'All of it',
      b: 'Asia and Europe are corners of the universe. Set the thing that is bothering you against that, and then go and deal with it anyway.' },
    { r: 150, label: 'all time', t: 'All of time',
      b: 'Before you, a boundless space. After you, another. Your whole life is a point between two infinities, which is exactly why the afternoon matters.' }
  ];

  function zoom() {
    var range = $('#st-zoom-range');
    if (!range) return;
    var svg = $('#st-zoom');
    var read = $('#st-zoom-read');
    var rings = $$('.ring', svg || document);
    var labels = $$('.zlab', svg || document);

    function paint() {
      var v = clamp(+range.value, 0, ZOOM.length - 1);
      rings.forEach(function (c, k) {
        c.classList.toggle('is-on', k <= v);
        c.style.opacity = k <= v ? '1' : '0.18';
      });
      labels.forEach(function (l, k) {
        l.classList.toggle('is-on', k === v);
        l.style.opacity = k <= v ? '1' : '0.18';
      });
      var z = ZOOM[v];
      if (read) read.innerHTML = '<p class="t">' + esc(z.t) + '</p><p>' + esc(z.b) + '</p>';
      save('zoom', v);
    }
    range.addEventListener('input', paint);
    paint();
  }

  /* ══ Premeditation ═════════════════════════════════════ */
  function premeditate() {
    var input = $('#st-pm-input');
    var btn = $('#st-pm-btn');
    var steps = $$('.st-pm-step');
    if (!input || !btn || !steps.length) return;

    var i = -1;
    btn.addEventListener('click', function () {
      if (i >= steps.length - 1) {
        i = -1;
        steps.forEach(function (s) { s.classList.remove('is-on'); });
        btn.textContent = 'Begin';
        input.value = '';
        input.focus();
        return;
      }
      var v = input.value.trim();
      if (!v) { input.focus(); return; }
      $$('.st-pm-echo').forEach(function (n) { n.textContent = v; });
      i++;
      steps.forEach(function (s, k) { s.classList.toggle('is-on', k <= i); });
      btn.textContent = i >= steps.length - 1 ? 'Start again' : 'Next';
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); btn.click(); }
    });
  }

  /* ══ How long a name lasts ═════════════════════════════ */
  function fame() {
    var range = $('#st-fame-range');
    if (!range) return;
    var X0 = 54, X1 = 500, Y0 = 34, Y1 = 190;

    // Not a measurement. A shape: recall collapses fast, then trails to nothing,
    // which is the point Marcus keeps making about posthumous fame.
    function at(t) { return Math.exp(-Math.pow(t, 0.4) * 7); }
    function px(t) { return X0 + t * (X1 - X0); }
    function py(v) { return Y1 - v * (Y1 - Y0); }

    var d = '', area = '';
    for (var k = 0; k <= 120; k++) {
      var t = k / 120;
      d += (k ? 'L' : 'M') + px(t).toFixed(1) + ' ' + py(at(t)).toFixed(1);
    }
    area = d + 'L' + X1 + ' ' + Y1 + 'L' + X0 + ' ' + Y1 + 'Z';
    var cur = $('#st-fame-curve');
    var ar = $('#st-fame-area');
    if (cur) cur.setAttribute('d', d);
    if (ar) ar.setAttribute('d', area);

    var scrub = $('#st-fame-scrub');
    var head = $('#st-fame-head');
    var whenEl = $('#st-fame-when');
    var valEl = $('#st-fame-val');

    var WHEN = ['the week you die', 'a year later', 'ten years later',
      'fifty years later', 'a century later', 'five centuries later', 'all of recorded time'];

    function paint() {
      var v = +range.value / 100;
      var x = px(v), y = py(at(v));
      if (scrub) { scrub.setAttribute('x1', x); scrub.setAttribute('x2', x); }
      if (head) { head.setAttribute('cx', x); head.setAttribute('cy', y); }
      if (whenEl) whenEl.textContent = WHEN[clamp(Math.round(v * 6), 0, 6)];
      if (valEl) {
        var pct = at(v) * 100;
        valEl.textContent = pct >= 1 ? Math.round(pct) + '%' : pct >= 0.1 ? pct.toFixed(1) + '%' : 'about nil';
      }
    }
    range.addEventListener('input', paint);
    paint();
  }

  /* ══ Boot ══════════════════════════════════════════════ */

  /* ══ Where the 59 passages come from ═══════════════════
     Three charts, all counted from _data/stoic.yml at run time rather than
     written down, so they cannot drift from the passages below them. The
     theme bars drive the same filter as the pills. */
  function corpus() {
    var host = $('#st-corpus');
    if (!host) return;
    var P = DATA.passages || [];
    if (!P.length) return;

    var NS = 'http://www.w3.org/2000/svg';
    function mk(n, a, t) {
      var e = document.createElementNS(NS, n);
      Object.keys(a || {}).forEach(function (k) { e.setAttribute(k, a[k]); });
      if (t != null) e.textContent = t;
      return e;
    }

    var med = P.filter(function (p) { return p.source === 'meditations'; });
    var enc = P.filter(function (p) { return p.source === 'encheiridion'; });

    /* ── Meditations, by book ── */
    (function () {
      var svg = $('#st-books');
      if (!svg) return;
      var BOOKS = 12, W = 520, H = 150, L = 26, B = 118;
      var counts = [];
      for (var b = 1; b <= BOOKS; b++) {
        counts.push(med.filter(function (p) { return parseInt(String(p.ref), 10) === b; }).length);
      }
      var max = Math.max.apply(null, counts) || 1;
      var bw = (W - L - 14) / BOOKS;
      svg.appendChild(mk('line', { x1: L, y1: B, x2: W - 8, y2: B, class: 'st-ax' }));
      counts.forEach(function (c, i) {
        var x = L + i * bw, h = c / max * 84;
        svg.appendChild(mk('rect', {
          x: (x + 3).toFixed(1), y: (B - h).toFixed(1), width: (bw - 6).toFixed(1),
          height: h.toFixed(1), rx: 2, class: 'st-bar' + (c ? '' : ' is-empty')
        }));
        if (c) svg.appendChild(mk('text', {
          x: (x + bw / 2).toFixed(1), y: (B - h - 5).toFixed(1),
          'text-anchor': 'middle', class: 'st-barn'
        }, c));
        svg.appendChild(mk('text', {
          x: (x + bw / 2).toFixed(1), y: B + 15, 'text-anchor': 'middle', class: 'st-tick'
        }, i + 1));
      });
      svg.appendChild(mk('text', { x: L, y: B + 34, class: 'st-tick' }, 'book'));
      var cap = $('#st-books-cap');
      if (cap) {
        var used = counts.filter(Boolean).length;
        cap.textContent = med.length + ' passages, drawn from ' + used + ' of the twelve books.';
      }
    })();

    /* ── Encheiridion, by chapter ── */
    (function () {
      var svg = $('#st-chapters');
      if (!svg) return;
      var N = 53, W = 520, L = 10, Y = 30;
      var have = {};
      enc.forEach(function (p) { have[parseInt(String(p.ref), 10)] = true; });
      var cw = (W - L * 2) / N;
      for (var c = 1; c <= N; c++) {
        svg.appendChild(mk('rect', {
          x: (L + (c - 1) * cw + 0.6).toFixed(2), y: have[c] ? Y - 14 : Y - 5,
          width: (cw - 1.2).toFixed(2), height: have[c] ? 28 : 10, rx: 1.5,
          class: 'st-chap' + (have[c] ? ' is-on' : '')
        }));
      }
      [1, 10, 20, 30, 40, 53].forEach(function (c) {
        svg.appendChild(mk('text', {
          x: (L + (c - 0.5) * cw).toFixed(1), y: Y + 30, 'text-anchor': 'middle', class: 'st-tick'
        }, c));
      });
      var cap = $('#st-chapters-cap');
      if (cap) cap.textContent = enc.length + ' passages, spread across ' +
        Object.keys(have).length + ' of the fifty-three chapters.';
    })();

    /* ── Themes, and a way into the list ── */
    (function () {
      var wrap = $('#st-themes');
      if (!wrap) return;
      var LABEL = {
        control: 'What is up to you', judgement: 'Judgement', action: 'Action',
        desire: 'Desire', others: 'Other people', adversity: 'Adversity', death: 'Death'
      };
      var counts = {};
      P.forEach(function (p) { counts[p.group] = (counts[p.group] || 0) + 1; });
      var keys = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
      var max = Math.max.apply(null, keys.map(function (k) { return counts[k]; })) || 1;
      wrap.innerHTML = keys.map(function (k) {
        var n = counts[k];
        return '<button class="st-theme" type="button" data-theme="' + k + '">' +
          '<span class="k">' + esc(LABEL[k] || k) + '</span>' +
          '<span class="track"><i style="width:' + (n / max * 100).toFixed(1) + '%"></i></span>' +
          '<span class="n">' + n + '</span></button>';
      }).join('');
      wrap.addEventListener('click', function (e) {
        var b = e.target.closest('.st-theme');
        if (!b) return;
        var pill = $('.filter-pill[data-filter="' + b.dataset.theme + '"]');
        if (pill) {
          pill.click();
          var list = $('#st-cards');
          if (list && list.scrollIntoView) list.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    })();

    /* ── The split between the two books ── */
    (function () {
      var el = $('#st-split');
      if (!el) return;
      var m = med.length, e2 = enc.length, t = m + e2;
      el.innerHTML =
        '<span class="med" style="flex:' + m + '"><b>' + m + '</b>Meditations</span>' +
        '<span class="enc" style="flex:' + e2 + '"><b>' + e2 + '</b>Encheiridion</span>';
      var cap = $('#st-split-cap');
      if (cap) cap.textContent = t + ' passages in total, verified word for word against the two source texts.';
    })();
  }

  /* ══ The shape of a Stoic day ══════════════════════════
     Morning rehearsal, the day itself, evening review. The two ends are the
     practices this page already describes; the middle is where they are spent. */
  function dayArc() {
    var svg = $('#st-day');
    if (!svg) return;
    var read = $('#st-day-read');
    var COPY = {
      dawn: { t: 'Before the day', p: 'Name what may go wrong and who may behave badly. Decide now what your own conduct will be, so the day cannot supply the answer for you.' },
      noon: { t: 'During the day', p: 'Impressions arrive faster than judgement. The work is the pause between what happens and what you call it.' },
      dusk: { t: 'After the day', p: 'Go back over it without a verdict on yourself. What was in your control, how did you use it, and what will you do differently.' }
    };
    $$('.st-day-node', svg).forEach(function (n) {
      function show() {
        $$('.st-day-node', svg).forEach(function (o) { o.classList.toggle('is-on', o === n); });
        var c = COPY[n.dataset.part];
        if (c && read) read.innerHTML = '<p class="t">' + esc(c.t) + '</p><p>' + esc(c.p) + '</p>';
      }
      n.addEventListener('mouseenter', show);
      n.addEventListener('focus', show);
      n.addEventListener('click', show);
      n.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); }
      });
    });
  }


  /* ══ A diagram inside every passage ════════════════════
     Eleven shapes, chosen per passage from the `viz` block in
     _data/stoic.yml. Every label is lifted from that passage's own situation
     or take, never from the quote, which that file forbids editing. A diagram
     restates the passage for a reader who takes a picture faster than a
     paragraph; the paragraph stays exactly where it was.

     Label-heavy shapes are HTML so the words wrap and stay selectable.
     Only the two geometric ones are SVG. */
  function passageViz() {
    var byId = {};
    (DATA.passages || []).forEach(function (p) { byId[p.id] = p; });

    var BUILD = {
      /* what is yours, and what is not */
      dichotomy: function (v) {
        return '<div class="sv sv-dich">' +
          '<div class="mine"><span class="k">Up to you</span><b>' + esc(v.mine) + '</b></div>' +
          '<div class="theirs"><span class="k">Not up to you</span><b>' + esc(v.theirs) + '</b></div></div>';
      },
      /* a pause wedged between the event and the answer */
      gate: function (v) {
        return '<div class="sv sv-gate">' +
          '<span class="a">' + esc(v.before) + '</span>' +
          '<span class="pause"><i></i>' + esc(v.pause) + '</span>' +
          '<span class="b">' + esc(v.after) + '</span></div>';
      },
      /* two things weighed, one heavier */
      scale: function (v) {
        var hb = v.heavy === 'b';
        return '<div class="sv sv-scale">' +
          '<div class="pan' + (hb ? '' : ' is-heavy') + '"><b>' + esc(v.a) + '</b></div>' +
          '<span class="fulcrum" aria-hidden="true"></span>' +
          '<div class="pan' + (hb ? ' is-heavy' : '') + '"><b>' + esc(v.b) + '</b></div></div>';
      },
      /* the same thing, relabelled */
      swap: function (v) {
        return '<div class="sv sv-swap">' +
          '<span class="from">' + esc(v.before) + '</span>' +
          '<i aria-hidden="true">&rarr;</i>' +
          '<span class="to">' + esc(v.after) + '</span></div>';
      },
      /* one input, two or three readings */
      split: function (v) {
        return '<div class="sv sv-split"><p class="in">' + esc(v['in']) + '</p><ul>' +
          (v.out || []).map(function (o) {
            return '<li class="' + (o.sel ? 'is-on' : '') + '">' + esc(o.k) + '</li>';
          }).join('') + '</ul></div>';
      },
      /* steps in an order that matters */
      order: function (v) {
        var mark = typeof v.mark === 'number' ? v.mark : -1;
        return '<ol class="sv sv-order">' + (v.items || []).map(function (t, i) {
          return '<li class="' + (i === mark ? 'is-on' : '') + '"><b>' + (i + 1) + '</b><span>' + esc(t) + '</span></li>';
        }).join('') + '</ol>';
      },
      /* rungs, with the one you are on marked */
      ladder: function (v) {
        var rungs = v.rungs || [], mark = typeof v.mark === 'number' ? v.mark : -1;
        return '<ul class="sv sv-ladder">' + rungs.map(function (t, i) {
          return '<li class="' + (i === mark ? 'is-on' : '') + '">' + esc(t) +
            (i === mark ? '<em>you are here</em>' : '') + '</li>';
        }).reverse().join('') + '</ul>';
      },
      /* a large thing set beside the small one you can actually hold */
      shrink: function (v) {
        return '<div class="sv sv-shrink">' +
          '<span class="big">' + esc(v.big) + '</span>' +
          '<span class="small">' + esc(v.small) + '</span></div>';
      },
      /* a natural limit, and what lies past it */
      measure: function (v) {
        return '<div class="sv sv-measure">' +
          '<span class="lim"><i></i>' + esc(v.limit) + '</span>' +
          '<span class="beyond">' + esc(v.beyond) + '</span></div>';
      },
      /* something small at the centre of something larger */
      rings: function (v) {
        return '<div class="sv sv-rings">' +
          '<span class="outer">' + esc(v.outer) + '</span>' +
          '<span class="core">' + esc(v.core) + '</span></div>';
      },
      /* a cycle that keeps returning */
      loop: function (v) {
        var n = (v.nodes || []).length, cx = 74, cy = 74, r = 46, out = '';
        out += '<circle class="ring" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>';
        (v.nodes || []).forEach(function (t, i) {
          var a = (-90 + i * 360 / n) * Math.PI / 180;
          out += '<circle class="node" cx="' + (cx + r * Math.cos(a)).toFixed(1) +
            '" cy="' + (cy + r * Math.sin(a)).toFixed(1) + '" r="5"/>';
        });
        return '<div class="sv sv-loop">' +
          '<svg viewBox="0 0 148 148" aria-hidden="true">' + out + '</svg>' +
          '<ul>' + (v.nodes || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
      }
    };

    $$('.st-card').forEach(function (card) {
      var p = byId[(card.id || '').replace(/^pas-/, '')];
      if (!p || !p.viz || !BUILD[p.viz.type]) return;
      var body = $('.st-card-body', card);
      if (!body || $('.st-viz', body)) return;
      var box = document.createElement('div');
      box.className = 'st-viz st-viz-' + p.viz.type;
      box.innerHTML = '<span class="k">The shape of it</span>' + BUILD[p.viz.type](p.viz) +
        (p.viz.cap ? '<p class="st-viz-cap">' + esc(p.viz.cap) + '</p>' : '');
      body.insertBefore(box, body.firstChild);
    });
  }


  /* ══ What your peace is resting on ═════════════════════
     The split is the whole doctrine, so it should be movable. Put more of your
     footing on things you do not control, then let the news go badly and watch
     what is left standing. */
  function restFigure() {
    var share = $('#sy-share');
    if (!share) return;
    var shocked = false;
    function paint() {
      var out = +share.value, inn = 100 - out;
      $('#sy-out').style.width = out + '%';
      $('#sy-in').style.width = inn + '%';
      var left = shocked ? inn : 100;
      var fill = $('#sy-gauge-fill');
      if (fill) fill.style.width = left + '%';
      var lab = $('#sy-gauge-lab');
      if (lab) lab.textContent = shocked ? left + ' left standing' : 'steady';
      var say = $('#sy-say');
      if (!say) return;
      say.textContent = !shocked
        ? (out >= 70 ? 'Most of your footing is on things another person decides.'
           : out >= 35 ? 'Some of it is outside your hands.'
           : 'Almost all of it is on your own conduct.')
        : (left <= 30 ? 'The news took most of it, because most of it was never yours.'
           : left >= 70 ? 'The news landed and the footing held.'
           : 'Part of it went with the news.');
    }
    share.addEventListener('input', function () { paint(); });
    var btn = $('#sy-shock');
    if (btn) btn.addEventListener('click', function () {
      shocked = !shocked;
      btn.textContent = shocked ? 'Reset' : 'The news arrives badly';
      paint();
    });
    paint();
  }

  function narrativeRail() {
    var links = $$('.st-story-rail a');
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
  function verdict() {
    var lab = $('#st-verdict-lab'); if (!lab) return;
    var chosen = {}, read = $('#st-verdict-read');
    var copy = {keep:'Keep the calibration move: separate the event from the prediction your first impression adds.',open:'Leave the moral tension open: the text does not establish that emotional distance is compatible with loving someone fully.'};
    $$('[data-st-verdict]', lab).forEach(function (button) { button.addEventListener('click', function () { var key=button.dataset.stVerdict; chosen[key]=!chosen[key]; button.classList.toggle('is-on',chosen[key]); button.setAttribute('aria-pressed',chosen[key]?'true':'false'); if(chosen.keep&&chosen.open) read.textContent='Both can remain true: use the passage that improves judgment, and refuse to manufacture agreement where the text leaves a real cost.'; else if(chosen[key]) read.textContent=copy[key]; else read.textContent='A useful text does not require agreement with every claim.'; }); });
  }

  function init() {
    [progress, narrativeRail, sorter, machine, triad, consoleSearch, cards, zoom, premeditate, fame, corpus, dayArc, passageViz, verdict, restFigure]
      .forEach(function (fn) {
        try { fn(); } catch (e) { /* one broken widget must not take the page down */ }
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
