/*
  Widgets for /small-talk/.

  All copy comes from _data/small_talk.yml through the #smw-data JSON island, so
  nothing here restates content that lives in the data file. Element ids use the
  `smw-` prefix while the icon sprite uses `sm-`: a <symbol> sits above the page
  in document order, so a shared namespace would make querySelector return the
  symbol and silently kill the widget.
*/
(function () {
  'use strict';

  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function one(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var island = one('#smw-data');
  if (!island) return;
  var D;
  try { D = JSON.parse(island.textContent); } catch (e) { return; }

  /* Reading progress across the whole document. */
  function progress() {
    var bar = one('#smw-progress-fill');
    if (!bar) return;
    var busy = false;
    function paint() {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + '%';
      busy = false;
    }
    addEventListener('scroll', function () {
      if (!busy) { busy = true; requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  }

  /* Light up the rail entry for the section in view. Same observer and margins
     the other eleven writings use, so every rail on the site behaves alike. */
  function rail() {
    var links = all('.sm-rail a');
    if (!('IntersectionObserver' in window) || !links.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-current', a.hash === '#' + entry.target.id); });
      });
    }, { rootMargin: '-22% 0px -65% 0px' });
    links.forEach(function (a) { var s = one(a.hash); if (s) obs.observe(s); });
  }

  /* Six linked scenes turn the reference material into one evening. Text stays
     in the data file so the visual sequence and the detailed manual agree. */
  function story() {
    var wrap = one('#smw-story'), panel = one('#smw-story-panel');
    if (!wrap || !panel || !D.story) return;
    var tabs = all('.sm-scene', wrap);
    function show(i) {
      var s = D.story[i];
      if (!s) return;
      tabs.forEach(function (b, n) {
        b.classList.toggle('is-on', n === i);
        b.setAttribute('aria-selected', n === i ? 'true' : 'false');
      });
      panel.innerHTML =
        '<div class="sm-story-copy"><h3>' + esc(s.title) + '</h3><p>' + esc(s.body) + '</p></div>' +
        '<dl class="sm-story-read">' +
        '<div><dt>He notices</dt><dd>' + esc(s.notice) + '</dd></div>' +
        '<div><dt>He does</dt><dd>' + esc(s.do) + '</dd></div>' +
        '<div><dt>He avoids</dt><dd>' + esc(s.avoid) + '</dd></div></dl>' +
        '<blockquote>“' + esc(s.line) + '”</blockquote>';
    }
    tabs.forEach(function (b, i) {
      b.addEventListener('click', function () { show(i); });
      b.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].focus(); show(next);
      });
    });
    show(0);
  }

  /* The seven moves. Each tab renders its own lines rather than hiding markup. */
  function loop() {
    var wrap = one('#smw-loop'), body = one('#smw-loop-body');
    if (!wrap || !body || !D.loop) return;
    var tabs = all('button', wrap);
    function show(i) {
      var m = D.loop[i];
      if (!m) return;
      tabs.forEach(function (b, n) {
        b.classList.toggle('is-on', n === i);
        b.setAttribute('aria-selected', n === i ? 'true' : 'false');
      });
      body.innerHTML =
        '<p class="sm-loop-claim">' + esc(m.claim) + '</p>' +
        '<p>' + esc(m.body) + '</p>' +
        '<ul class="sm-loop-lines">' + (m.lines || []).map(function (l) {
          return '<li>' + esc(l) + '</li>';
        }).join('') + '</ul>' +
        '<p class="sm-loop-watch">' + esc(m.watch) + '</p>';
    }
    tabs.forEach(function (b, i) { b.addEventListener('click', function () { show(i); }); });
    show(0);
  }

  /* Follow the noun. The point is that the next question is already in their
     last sentence, so the practice is choosing one rather than inventing one. */
  function noun() {
    var said = one('#smw-noun-said'), picks = one('#smw-noun-picks'),
        out = one('#smw-noun-out'), next = one('#smw-noun-next');
    if (!said || !picks || !out || !next || !D.nouns || !D.nouns.length) return;
    var i = 0;
    function render() {
      var n = D.nouns[i];
      said.textContent = '“' + n.said + '”';
      out.textContent = '';
      picks.innerHTML = n.picks.map(function (p, k) {
        return '<button type="button" data-k="' + k + '">' + esc(p.word) + '</button>';
      }).join('');
      all('button', picks).forEach(function (b) {
        b.addEventListener('click', function () {
          all('button', picks).forEach(function (x) { x.classList.remove('is-on'); });
          b.classList.add('is-on');
          out.textContent = n.picks[+b.dataset.k].follow;
        });
      });
    }
    next.addEventListener('click', function () { i = (i + 1) % D.nouns.length; render(); });
    render();
  }

  /* The ladder. Clicking a rung marks everything up to it, because the claim is
     that the lower rungs are how you earn the higher ones. */
  function ladder() {
    var wrap = one('#smw-ladder'), note = one('#smw-ladder-note');
    if (!wrap || !note || !D.ladder) return;
    var rungs = all('.sm-rung', wrap);
    rungs.forEach(function (b) {
      b.addEventListener('click', function () {
        var lvl = +b.dataset.level;
        rungs.forEach(function (x) { x.classList.toggle('is-on', +x.dataset.level <= lvl); });
        var r = D.ladder.filter(function (x) { return +x.level === lvl; })[0];
        if (r) note.textContent = r.note;
      });
    });
  }

  function pewfic() {
    var wrap = one('#smw-pewfic'), out = one('#smw-pewfic-out');
    if (!wrap || !out || !D.topics) return;
    all('button', wrap).forEach(function (b) {
      b.addEventListener('click', function () {
        all('button', wrap).forEach(function (x) { x.classList.remove('is-on'); });
        b.classList.add('is-on');
        var t = D.topics.filter(function (x) { return x.letter === b.dataset.letter; })[0];
        if (t) out.textContent = t.name + ': ' + t.examples + '.';
      });
    });
  }

  /*
    The seven variables. Each slider runs 0 to 4 and the read-out turns the
    settings into instructions, because a dial that only reports its own position
    tells the reader nothing they did not already type in.
  */
  function variables() {
    var wrap = one('#smw-vars'), out = one('#smw-posture');
    if (!wrap || !out || !D.variables) return;
    var advice = {
      formality: ['Use first names straight away and keep the greeting light.',
                  'First names are fine. Stay relaxed but not sloppy.',
                  'Open one notch formal, then follow their lead down.',
                  'Use titles until invited otherwise. Greet carefully.',
                  'Titles and surnames throughout. Let them offer the first name.'],
      hierarchy: ['Speak freely across levels. Formal respect for rank may feel odd here.',
                  'Rank is light. Normal courtesy is enough.',
                  'Notice who follows whose lead before you settle in.',
                  'Let senior people open topics. Avoid casual interruption.',
                  'Address by rank, wait to be brought in, disagree privately if at all.'],
      directness: ['Read the implication. A soft no is still a no.',
                   'Listen past the politeness for the actual answer.',
                   'Check your reading before acting on it.',
                   'Plain answers are likely. Take them at face value.',
                   'Say the thing plainly. Hedging will read as evasion.'],
      expressive: ['Match the calm. Silence is welcome and needs no rescue.',
                   'Keep it measured. Restraint reads as respect here.',
                   'Add a little visible reaction to what you already feel.',
                   'Show more warmth than feels necessary. It is being read as interest.',
                   'React visibly and often. Flat delivery will read as coldness.'],
      space: ['Keep your distance and greet at arm’s length.',
              'Stay a step back and let them close it.',
              'Let them lead entirely on contact and distance.',
              'Contact is likely. Follow their greeting, do not initiate.',
              'Expect closeness and embraces. Pulling away will be noticed.'],
      privacy: ['Personal questions are warmth here. Answer briefly and ask back.',
                'Expect family and home to come up early. It is not intrusion.',
                'Let them share personal details first.',
                'Keep to work and place until they go further.',
                'Stay on neutral ground. Personal questions will land badly.'],
      relationship: ['Get to the agenda. Long preamble reads as time-wasting.',
                     'Brief warm-up, then business.',
                     'Give it a few minutes before turning to the task.',
                     'Build the relationship first. The task can wait.',
                     'The small talk is the work. Reaching for the agenda early costs trust.']
    };
    function paint() {
      var items = D.variables.map(function (v) {
        var input = one('input[data-key="' + v.key + '"]', wrap);
        var val = input ? +input.value : 2;
        var line = (advice[v.key] || [])[val] || '';
        return '<li><b>' + esc(v.name) + '.</b> ' + esc(line) + '</li>';
      }).join('');
      out.innerHTML = '<h4>How to enter this room</h4><ul>' + items + '</ul>';
    }
    all('input.sm-range', wrap).forEach(function (r) { r.addEventListener('input', paint); });
    paint();
  }

  /* Two filter bars, same behaviour, different attribute. */
  function filterBar(barSel, itemSel, attr) {
    var bar = one(barSel);
    if (!bar) return;
    var items = all(itemSel);
    all('button', bar).forEach(function (b) {
      b.addEventListener('click', function () {
        var want = b.dataset[attr];
        all('button', bar).forEach(function (x) { x.classList.remove('is-on'); });
        b.classList.add('is-on');
        items.forEach(function (it) {
          it.hidden = want !== 'all' && it.dataset[attr] !== want;
        });
      });
    });
  }

  /* Pick a room, get the opening, where to take it, how to leave, and the
     mistake that room invites. */
  function settings() {
    var wrap = one('#smw-settings'), out = one('#smw-setting-out');
    if (!wrap || !out || !D.settings) return;
    all('button', wrap).forEach(function (b) {
      b.addEventListener('click', function () {
        all('button', wrap).forEach(function (x) { x.classList.remove('is-on'); });
        b.classList.add('is-on');
        var s = D.settings.filter(function (x) { return x.key === b.dataset.key; })[0];
        if (!s) return;
        out.innerHTML = '<div class="sm-card"><h4>' + esc(s.name) + '</h4><dl>' +
          '<dt>Open</dt><dd class="sm-say">' + esc(s.open) + '</dd>' +
          '<dt>Then</dt><dd>' + esc(s.then) + '</dd>' +
          '<dt>Leave</dt><dd class="sm-say">' + esc(s.exit) + '</dd>' +
          '<dt>Watch</dt><dd class="sm-watch">' + esc(s.watch) + '</dd>' +
          '</dl></div>';
      });
    });
  }

  function repair() {
    var wrap = one('#smw-repair'), out = one('#smw-repair-out');
    if (!wrap || !out || !D.repair) return;
    all('button', wrap).forEach(function (b) {
      b.addEventListener('click', function () {
        all('button', wrap).forEach(function (x) { x.classList.remove('is-on'); });
        b.classList.add('is-on');
        var r = D.repair.filter(function (x) { return x.key === b.dataset.key; })[0];
        if (!r) return;
        out.innerHTML = '<div class="sm-card"><h4>' + esc(r.name) + '</h4><dl>' +
          '<dt>Do</dt><dd>' + esc(r.do) + '</dd>' +
          '<dt>Say</dt><dd class="sm-say">' + esc(r.say) + '</dd>' +
          '<dt>Why</dt><dd class="sm-watch">' + esc(r.note) + '</dd>' +
          '</dl></div>';
      });
    });
  }

  [progress, rail, story, loop, noun, ladder, pewfic, variables, settings, repair,
    function () { filterBar('#smw-atlas-filter', '.sm-place', 'region'); },
    function () { filterBar('#smw-set-filter', '.sm-setting', 'group'); }
  ].forEach(function (fn) {
    try { fn(); } catch (e) { /* one widget must not take the page down */ }
  });
})();
