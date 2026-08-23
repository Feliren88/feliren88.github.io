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
  function init() {
    [progress, sorter, machine, triad, consoleSearch, cards, zoom, premeditate, fame]
      .forEach(function (fn) {
        try { fn(); } catch (e) { /* one broken widget must not take the page down */ }
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
