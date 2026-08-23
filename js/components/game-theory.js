/**
 * Game theory — interactive layer for /game-theory/
 *
 * Widgets are independent and fail quietly if their markup is absent, so the
 * page still reads as a plain document with JavaScript off. Game data comes
 * from a JSON island the Liquid template emits, which keeps _data/game-theory.yml
 * the single source of truth. localStorage prefix: gt:
 *
 * Nothing here decides an equilibrium. Equilibria are solved offline by
 * scripts/solve_games.py and arrive precomputed in the data.
 */
(function () {
  'use strict';

  var STORE = 'gt:';

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
    var el = document.getElementById('gt-data');
    if (!el) return { games: [], levers: [], laws: [], dashboard: [], classifier: [] };
    try { return JSON.parse(el.textContent); } catch (e) { return { games: [], levers: [], laws: [], dashboard: [], classifier: [] }; }
  })();

  /* ══ Reading progress ══════════════════════════════════ */
  function progress() {
    var bar = $('#gt-progress-fill');
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

  /* ══ Payoff matrix explorer ════════════════════════════ */
  function matrix() {
    var host = $('#gt-matrix-host');
    if (!host || !DATA.games.length) return;
    var tabs = $('#gt-game-tabs');
    var read = $('#gt-game-read');
    var cap = $('#gt-matrix-cap');
    var gi = 0;

    function cellIn(list, i, j) {
      return (list || []).some(function (c) { return c[0] === i && c[1] === j; });
    }

    function render() {
      var g = DATA.games[gi];
      var s = g.solved || {};

      $$('.gt-btn', tabs).forEach(function (b, k) {
        b.classList.toggle('is-primary', k === gi);
      });

      if (cap) cap.textContent = 'Row player picks a row, column player picks a column. Each cell shows (row payoff, column payoff).';

      var html = '<table class="gt-matrix"><thead><tr>' +
        '<th class="corner">you \\ them</th>' +
        '<th>' + esc(g.cols[0]) + '</th><th>' + esc(g.cols[1]) + '</th></tr></thead><tbody>';
      for (var i = 0; i < 2; i++) {
        html += '<tr><th class="rowh">' + esc(g.rows[i]) + '</th>';
        for (var j = 0; j < 2; j++) {
          var p = g.payoffs[i][j];
          var cls = [];
          if (cellIn(s.pure, i, j)) cls.push('is-ne');
          if (cellIn(s.pareto, i, j)) cls.push('is-pareto');
          html += '<td class="' + cls.join(' ') + '" data-i="' + i + '" data-j="' + j + '" tabindex="0">' +
            '<span class="pr">' + p[0] + '</span>, <span class="pc">' + p[1] + '</span></td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      host.innerHTML = html;

      // facts, all from the solver
      var facts = [];
      var nPure = (s.pure || []).length;
      facts.push({ t: nPure === 0 ? 'no pure equilibrium' : nPure + ' pure equilibri' + (nPure === 1 ? 'um' : 'a'), on: true });
      if (s.mixed) facts.push({ t: 'mixed equilibrium exists', on: true });
      if (s.dominant_row !== null && s.dominant_row !== undefined) {
        facts.push({ t: 'dominant strategy: ' + g.rows[s.dominant_row], on: true });
      }
      facts.push({ t: s.zero_sum ? 'zero-sum' : 'not zero-sum', on: !!s.zero_sum });

      // does any equilibrium fail Pareto efficiency?
      var trap = (s.pure || []).some(function (c) { return !cellIn(s.pareto, c[0], c[1]); });
      if (trap) facts.push({ t: 'equilibrium is not efficient', on: true });

      if (read) {
        read.innerHTML =
          '<span class="lab">' + esc(g.life) + '</span>' +
          '<p class="t">' + esc(g.name) + '</p>' +
          '<p>' + esc(g.reading) + '</p>' +
          '<div class="gt-facts">' + facts.map(function (f) {
            return '<span class="gt-fact' + (f.on ? ' on' : '') + '">' + esc(f.t) + '</span>';
          }).join('') + '</div>' +
          '<div class="move"><b>Try this.</b> ' + esc(g.move) + '</div>';
      }

      $$('td', host).forEach(function (td) {
        function show() {
          $$('td', host).forEach(function (o) { o.classList.remove('is-sel'); });
          td.classList.add('is-sel');
          var i = +td.dataset.i, j = +td.dataset.j;
          var p = g.payoffs[i][j];
          var bits = [];
          bits.push('You play <b>' + esc(g.rows[i]) + '</b>, they play <b>' + esc(g.cols[j]) + '</b>. ' +
            'You get ' + p[0] + ', they get ' + p[1] + '.');
          if (cellIn(s.pure, i, j)) {
            bits.push('This is a Nash equilibrium: neither of you gains by changing alone.');
          } else {
            // name who would deviate and to what
            var rowAlt = g.payoffs[1 - i][j][0], colAlt = g.payoffs[i][1 - j][1];
            var who = [];
            if (rowAlt > p[0]) who.push('you would switch to ' + esc(g.rows[1 - i]) + ' for ' + rowAlt);
            if (colAlt > p[1]) who.push('they would switch to ' + esc(g.cols[1 - j]) + ' for ' + colAlt);
            bits.push('Not stable: ' + who.join(', and ') + '.');
          }
          if (cellIn(s.pareto, i, j)) bits.push('It is Pareto efficient, so no other cell is better for one of you without being worse for the other.');
          var el = $('.cell-read', read);
          if (el) el.innerHTML = bits.join(' ');
          else if (read) {
            var d = document.createElement('p');
            d.className = 'cell-read';
            d.style.borderTop = '1px solid var(--line)';
            d.style.paddingTop = '0.7rem';
            d.innerHTML = bits.join(' ');
            read.appendChild(d);
          }
        }
        td.addEventListener('click', show);
        td.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); }
        });
      });
    }

    if (tabs) {
      DATA.games.forEach(function (g, k) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'gt-btn';
        b.textContent = g.name;
        b.addEventListener('click', function () { gi = k; render(); });
        tabs.appendChild(b);
      });
    }
    render();
  }

  /* ══ Shadow of the future ══════════════════════════════ */
  /*
   * Repeated Prisoner's Dilemma with grim trigger. Cooperating forever pays
   * R/(1-d). Defecting once pays T then P forever. Cooperation survives when
   *   R/(1-d) >= T + dP/(1-d)   which rearranges to   d >= (T-R)/(T-P).
   * The payoffs are read from the solved PD so the two stay consistent.
   */
  function shadow() {
    var range = $('#gt-delta-range');
    if (!range) return;
    var read = $('#gt-delta-read');
    var scrub = $('#gt-delta-scrub');
    var dotC = $('#gt-delta-dot-coop');
    var dotD = $('#gt-delta-dot-defect');

    var pd = DATA.games.filter(function (g) { return g.id === 'prisoners-dilemma'; })[0];
    // T = temptation, R = reward, P = punishment, from the matrix itself
    var T = pd ? pd.payoffs[1][0][0] : 5;
    var R = pd ? pd.payoffs[0][0][0] : 3;
    var P = pd ? pd.payoffs[1][1][0] : 1;
    var dStar = (T - R) / (T - P);

    var X0 = 56, X1 = 500, Y0 = 30, Y1 = 190;
    // cap the vertical scale at the payoff when d is at the largest slider value
    var dMax = 0.95;
    var vMax = R / (1 - dMax);

    function px(d) { return X0 + (d / dMax) * (X1 - X0); }
    function py(v) { return Y1 - clamp(v / vMax, 0, 1) * (Y1 - Y0); }
    function vCoop(d) { return R / (1 - d); }
    function vDefect(d) { return T + d * P / (1 - d); }

    function path(fn) {
      var out = '';
      for (var k = 0; k <= 160; k++) {
        var d = (k / 160) * dMax;
        out += (k ? 'L' : 'M') + px(d).toFixed(1) + ' ' + py(fn(d)).toFixed(1);
      }
      return out;
    }
    var pc = $('#gt-delta-coop'), pdd = $('#gt-delta-defect');
    if (pc) pc.setAttribute('d', path(vCoop));
    if (pdd) pdd.setAttribute('d', path(vDefect));

    var tl = $('#gt-delta-thresh');
    if (tl) { tl.setAttribute('x1', px(dStar)); tl.setAttribute('x2', px(dStar)); }
    var tlab = $('#gt-delta-thresh-lab');
    if (tlab) {
      tlab.setAttribute('x', clamp(px(dStar), X0 + 4, X1 - 60));
      tlab.textContent = 'δ* = ' + dStar.toFixed(2);
    }

    function paint() {
      var d = +range.value / 100;
      var vc = vCoop(d), vd = vDefect(d);
      var x = px(d);
      if (scrub) { scrub.setAttribute('x1', x); scrub.setAttribute('x2', x); }
      if (dotC) { dotC.setAttribute('cx', x); dotC.setAttribute('cy', py(vc)); }
      if (dotD) { dotD.setAttribute('cx', x); dotD.setAttribute('cy', py(vd)); }

      var holds = d >= dStar;
      if (read) {
        read.innerHTML =
          '<p class="verdict ' + (holds ? 'coop' : 'defect') + '">' +
          (holds ? 'Cooperation is rational here.' : 'Defection pays here.') + '</p>' +
          '<div class="calc">' +
          '<span class="op">V</span><sub class="op">coop</sub> = <span class="frac"><span>R</span><span>1 &minus; δ</span></span> = ' +
          '<span class="frac"><span class="num">' + R + '</span><span class="num">' + (1 - d).toFixed(2) + '</span></span> = ' +
          '<span class="num">' + vc.toFixed(2) + '</span>' +
          '</div>' +
          '<div class="calc">' +
          '<span class="op">V</span><sub class="op">defect</sub> = T + <span class="frac"><span>δP</span><span>1 &minus; δ</span></span> = ' +
          '<span class="num">' + vd.toFixed(2) + '</span>' +
          '</div>' +
          '<p>' + (holds
            ? 'At δ = ' + d.toFixed(2) + ', one betrayal costs more than it gains because future rounds carry enough weight.'
            : 'At δ = ' + d.toFixed(2) + ', the relationship is too short for future losses to outweigh the gain from defecting.') +
          '</p>' +
          '<p>The threshold is δ* = (T &minus; R) / (T &minus; P) = ' + dStar.toFixed(2) +
          ', so cooperation holds exactly when the future carries at least that much weight.</p>';
      }
      save('delta', +range.value);
    }
    range.addEventListener('input', paint);
    var saved = load('delta', null);
    if (saved !== null) range.value = saved;
    paint();
  }

  /* ══ Seven levers ══════════════════════════════════════ */
  function levers() {
    var host = $('#gt-levers');
    if (!host) return;
    $$('.gt-lever', host).forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.classList.contains('is-on');
        $$('.gt-lever', host).forEach(function (o) { o.classList.remove('is-on'); });
        if (!on) b.classList.add('is-on');
      });
    });
  }

  /* ══ Risk quadrants ════════════════════════════════════ */
  var QUAD = {
    a: {
      t: 'Reversible, bounded downside',
      body: 'Sending the email, publishing the piece, taking the meeting. The worst case is embarrassment and an afternoon.',
      rule: 'Act now. Deliberation costs more than the mistake would.'
    },
    b: {
      t: 'Reversible, meaningful downside',
      body: 'A contract you can exit, a move you could undo, a role you could leave. Real cost, but you get out.',
      rule: 'Pilot it. Buy information at small size before committing at full size.'
    },
    c: {
      t: 'Irreversible, bounded downside',
      body: 'You cannot take it back, but it will not sink you. A public position, a specialisation, a burned bridge.',
      rule: 'Slow down and model the second order. Ask who responds and how.'
    },
    d: {
      t: 'Irreversible and ruinous',
      body: 'Extreme borrowing, one concentrated bet, or any choice whose bad case ends your ability to keep playing.',
      rule: 'Require overwhelming evidence, or decline. Expected value stops being the right test here.'
    }
  };

  function quadrants() {
    var svg = $('#gt-quad');
    if (!svg) return;
    var read = $('#gt-quad-read');
    function show(k) {
      $$('g.q', svg).forEach(function (g) { g.classList.toggle('is-on', g.dataset.q === k); });
      var q = QUAD[k];
      if (q && read) {
        read.innerHTML = '<p class="t">' + esc(q.t) + '</p><p>' + esc(q.body) + '</p>' +
          '<p class="rule">' + esc(q.rule) + '</p>';
      }
    }
    $$('g.q', svg).forEach(function (g) {
      g.addEventListener('mouseenter', function () { show(g.dataset.q); });
      g.addEventListener('focus', function () { show(g.dataset.q); });
      g.addEventListener('click', function () { show(g.dataset.q); });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(g.dataset.q); }
      });
    });
    show('a');
  }

  /* ══ Ruin simulator ════════════════════════════════════ */
  /*
   * Repeated favourable bet with a ruin barrier. Each round stakes a fraction f
   * of current wealth, winning b times the stake with probability p. Positive
   * expected value does not prevent ruin, and that is the whole point.
   */
  function ruin() {
    var host = $('#gt-ruin');
    if (!host) return;
    var fEl = $('#gt-ruin-f'), pEl = $('#gt-ruin-p'), bEl = $('#gt-ruin-b');
    var fV = $('#gt-ruin-f-val'), pV = $('#gt-ruin-p-val'), bV = $('#gt-ruin-b-val');
    var paths = $('#gt-ruin-paths');
    var out = { ev: $('#gt-ruin-ev'), kelly: $('#gt-ruin-kelly'), ruined: $('#gt-ruin-ruined'), median: $('#gt-ruin-median') };
    var note = $('#gt-ruin-note');

    var X0 = 50, X1 = 500, Y0 = 26, Y1 = 178;
    var ROUNDS = 60, RUNS = 60, RUIN_AT = 0.15;

    // deterministic pseudo-random so the picture is stable across redraws
    function rng(seed) {
      var s = seed >>> 0;
      return function () {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
      };
    }

    function paint() {
      var f = +fEl.value / 100;
      var p = +pEl.value / 100;
      var b = +bEl.value / 10;
      if (fV) fV.textContent = f.toFixed(2);
      if (pV) pV.textContent = p.toFixed(2);
      if (bV) bV.textContent = b.toFixed(1) + '×';

      var q = 1 - p;
      var ev = p * b - q;                    // per unit staked
      var kelly = b > 0 ? (b * p - q) / b : 0;

      var rand = rng(20260823);
      var d = '', dead = '', ruined = 0, finals = [];
      for (var r = 0; r < RUNS; r++) {
        var w = 1, seg = '', isDead = false;
        for (var t = 0; t <= ROUNDS; t++) {
          var x = X0 + (t / ROUNDS) * (X1 - X0);
          // log scale so both growth and collapse stay visible
          var y = Y1 - clamp((Math.log(w) / Math.log(8) + 1) / 2, 0, 1) * (Y1 - Y0);
          seg += (t ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
          if (w <= RUIN_AT) { isDead = true; break; }
          w = rand() < p ? w * (1 + f * b) : w * (1 - f);
        }
        if (isDead) { ruined++; dead += seg; } else { d += seg; }
        finals.push(w);
      }
      finals.sort(function (a, c) { return a - c; });
      var median = finals[Math.floor(finals.length / 2)];

      if (paths) {
        paths.innerHTML =
          '<path class="path-live" d="' + d + '"/>' +
          '<path class="path-dead" d="' + dead + '"/>';
      }
      if (out.ev) {
        out.ev.textContent = (ev >= 0 ? '+' : '') + ev.toFixed(2);
        out.ev.classList.toggle('bad', ev < 0);
      }
      if (out.kelly) out.kelly.textContent = (kelly * 100).toFixed(0) + '%';
      if (out.ruined) {
        var pct = Math.round(ruined / RUNS * 100);
        out.ruined.textContent = pct + '%';
        out.ruined.classList.toggle('bad', pct > 0);
      }
      if (out.median) out.median.textContent = median >= 100 ? '>100×' : median.toFixed(2) + '×';

      if (note) {
        var msg;
        if (ev <= 0) {
          msg = 'The edge is gone. With <b>E[X] ≤ 0</b> no bet size saves this, and sizing up only reaches ruin faster.';
        } else if (f > kelly * 1.6 && kelly > 0) {
          msg = 'The edge is positive, but the stake is too large. You are betting <b>' + (f * 100).toFixed(0) +
            '%</b> where the growth-optimal fraction is <b>' + (kelly * 100).toFixed(0) +
            '%</b>. A winning game can still ruin you when the stake is too large.';
        } else if (ruined > 0) {
          msg = 'The expected value is positive, yet <b>' + Math.round(ruined / RUNS * 100) +
            '%</b> of paths still hit the floor. In practice, you experience one path through the distribution.';
        } else {
          msg = 'The edge, stake and survival rate are compatible here, so compounding has room to work.';
        }
        note.innerHTML = msg;
      }
      save('ruin', { f: fEl.value, p: pEl.value, b: bEl.value });
    }

    [fEl, pEl, bEl].forEach(function (el) { if (el) el.addEventListener('input', paint); });
    var s = load('ruin', null);
    if (s) { if (fEl) fEl.value = s.f; if (pEl) pEl.value = s.p; if (bEl) bEl.value = s.b; }
    paint();
  }

  /* ══ Classifier ════════════════════════════════════════ */
  function classifier() {
    var wrap = $('#gt-classifier');
    if (!wrap) return;
    var out = $('#gt-cverdict');
    var reset = $('#gt-creset');
    var state = load('classifier', {});
    var rows = $$('.gt-cq', wrap);

    var NOTE = [
      'Nothing checked. Work through the list before deciding which move fits this game.',
      'One down. Eight assumptions still unexamined.',
      'Two checked. Seven assumptions remain.',
      'Three of nine.',
      'Four. Past halfway.',
      'Five checked. Four remain.',
      'Six of nine.',
      'Seven checked. Two remain.',
      'Eight. One question stands between you and a decision you can defend.',
      '<b>All nine.</b> You know the game, the players, the order, the information and the exits. Now decide, and size the bet to how reversible it is.'
    ];

    function render() {
      var n = 0;
      rows.forEach(function (r) {
        var on = !!state[r.dataset.q];
        r.classList.toggle('is-done', on);
        var t = $('.qtog', r);
        if (t) { t.textContent = on ? 'Answered' : 'Not yet'; t.setAttribute('aria-pressed', on ? 'true' : 'false'); }
        if (on) n++;
      });
      if (out) out.innerHTML = '<b>' + n + ' / ' + rows.length + '</b> &nbsp;' + NOTE[n];
      save('classifier', state);
    }

    wrap.addEventListener('click', function (e) {
      var t = e.target.closest('.qtog');
      if (!t) return;
      var row = t.closest('.gt-cq');
      state[row.dataset.q] = !state[row.dataset.q];
      render();
    });
    if (reset) reset.addEventListener('click', function () { state = {}; render(); });
    render();
  }

  /* ══ Dashboard ═════════════════════════════════════════ */
  function dashboard() {
    var wrap = $('#gt-dash');
    if (!wrap) return;
    var out = $('#gt-dash-out');
    var reset = $('#gt-dash-reset');
    var scores = load('dash', {});

    function render() {
      var vals = [];
      $$('.gt-drow', wrap).forEach(function (row) {
        var k = row.dataset.k;
        var v = scores[k];
        $$('button', row).forEach(function (b) {
          b.setAttribute('aria-pressed', +b.dataset.v === v ? 'true' : 'false');
        });
        row.classList.toggle('is-low', v !== undefined && v <= 4);
        if (v !== undefined) vals.push({ k: k, v: v, floor: row.dataset.floor === 'true' });
      });

      if (!out) return;
      if (vals.length < 5) {
        out.innerHTML = '<p class="t">Score at least five</p><p>The dashboard looks for the domain ' +
          'currently limiting the rest of the system.</p>';
        save('dash', scores);
        return;
      }

      vals.sort(function (a, b) { return a.v - b.v; });
      var worst = vals[0];
      var brokenFloor = vals.filter(function (x) { return x.floor && x.v <= 4; });
      var mean = vals.reduce(function (a, x) { return a + x.v; }, 0) / vals.length;

      var html = '<p class="t">Bottleneck: <span class="bottleneck">' + esc(worst.k) + '</span> at ' + worst.v + '</p>';
      html += '<p>Mean score ' + mean.toFixed(1) + ', minimum ' + worst.v + '. ' +
        'If life utility behaves anything like <span class="m">min(<span class="op">x</span><sub>1</sub>, …, <span class="op">x</span><sub>n</sub>)</span> ' +
        'then raising ' + esc(worst.k) + ' may matter more than improving an area that is already strong.</p>';
      if (brokenFloor.length) {
        html += '<p><b>' + brokenFloor.map(function (x) { return esc(x.k); }).join(', ') +
          '</b> ' + (brokenFloor.length === 1 ? 'is' : 'are') + ' below the floor. ' +
          'A domain marked floor has no direct substitute. Money cannot restore recovery, and status cannot provide meaning.</p>';
      }
      out.innerHTML = html;
      save('dash', scores);
    }

    $$('.gt-drow', wrap).forEach(function (row) {
      var host = $('.gt-scale', row);
      if (!host) return;
      for (var v = 1; v <= 10; v++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.dataset.v = v;
        b.textContent = v;
        b.setAttribute('aria-label', row.dataset.k + ' score ' + v);
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () {
          scores[row.dataset.k] = +this.dataset.v;
          render();
        });
        host.appendChild(b);
      }
    });
    if (reset) reset.addEventListener('click', function () { scores = {}; render(); });
    render();
  }


  /* ══ Five simultaneous games ═══════════════════════════ */
  function five() {
    var host = $('#gt-five');
    if (!host) return;
    var read = $('#gt-five-read');
    var items = DATA.five || [];
    function show(i) {
      $$('.gt-layer', host).forEach(function (b, k) { b.classList.toggle('is-on', k === i); });
      var f = items[i];
      if (f && read) read.innerHTML = '<p class="ask">' + esc(f.ask) + '</p><p>' + esc(f.note) + '</p>';
    }
    $$('.gt-layer', host).forEach(function (b, i) {
      b.addEventListener('click', function () { show(i); });
      b.addEventListener('mouseenter', function () { show(i); });
    });
    show(0);
  }

  /* ══ The 17 domains ════════════════════════════════════ */
  function domains() {
    var wrap = $('#gt-domains');
    if (!wrap) return;
    var count = $('#gt-dcount');
    var pills = $$('.gt-dfilters .filter-pill');
    var expand = $('#gt-dexpand');

    $$('.gt-domain', wrap).forEach(function (c) {
      var btn = $('button', c);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = c.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    function apply(kind) {
      var n = 0;
      $$('.gt-domain', wrap).forEach(function (c) {
        var match = kind === 'all' || c.dataset.group === kind;
        c.hidden = !match;
        if (match) n++;
      });
      if (count) count.textContent = n + (n === 1 ? ' domain' : ' domains');
    }
    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        pills.forEach(function (o) { o.classList.remove('is-active'); });
        p.classList.add('is-active');
        apply(p.dataset.filter || 'all');
      });
    });
    if (expand) {
      expand.addEventListener('click', function () {
        var open = expand.dataset.open === 'true';
        $$('.gt-domain', wrap).forEach(function (c) {
          c.classList.toggle('is-open', !open);
          var b = $('button', c);
          if (b) b.setAttribute('aria-expanded', !open ? 'true' : 'false');
        });
        expand.dataset.open = open ? 'false' : 'true';
        expand.textContent = open ? 'Expand all' : 'Collapse all';
      });
    }
    apply('all');
  }

  /* ══ Explore versus exploit ════════════════════════════ */
  /*
   * UCB1. Each arm scores mean plus an exploration bonus that grows with total
   * time and shrinks with how often that arm has been tried. Raising c is
   * literally choosing to explore more.
   */
  function ucb() {
    var range = $('#gt-ucb-c');
    if (!range) return;
    var host = $('#gt-ucb-bars');
    var read = $('#gt-ucb-read');
    var cVal = $('#gt-ucb-c-val');

    // three options: a proven path, a promising one, and a barely-tried one
    var ARMS = [
      { name: 'Current path', mu: 0.72, n: 380 },
      { name: 'Adjacent bet', mu: 0.58, n: 40 },
      { name: 'Untested idea', mu: 0.45, n: 4 }
    ];
    var t = ARMS.reduce(function (a, x) { return a + x.n; }, 0);
    var X0 = 60, X1 = 480, Y0 = 26, Y1 = 156;

    function paint() {
      var c = +range.value / 100;
      if (cVal) cVal.textContent = c.toFixed(2);

      var scored = ARMS.map(function (a) {
        var bonus = c * Math.sqrt(Math.log(t) / a.n);
        return { name: a.name, mu: a.mu, n: a.n, bonus: bonus, score: a.mu + bonus };
      });
      var best = scored.reduce(function (m, x) { return x.score > m.score ? x : m; }, scored[0]);
      var vMax = Math.max(1.4, Math.max.apply(null, scored.map(function (x) { return x.score; })) * 1.1);

      var w = (X1 - X0) / scored.length;
      var html = '';
      scored.forEach(function (a, i) {
        var cx = X0 + i * w + w * 0.5;
        var bw = w * 0.46;
        var hMu = (a.mu / vMax) * (Y1 - Y0);
        var hTot = (a.score / vMax) * (Y1 - Y0);
        html +=
          '<rect class="bar-bonus" x="' + (cx - bw / 2).toFixed(1) + '" y="' + (Y1 - hTot).toFixed(1) +
          '" width="' + bw.toFixed(1) + '" height="' + (hTot - hMu).toFixed(1) + '"/>' +
          '<rect class="bar-mean" x="' + (cx - bw / 2).toFixed(1) + '" y="' + (Y1 - hMu).toFixed(1) +
          '" width="' + bw.toFixed(1) + '" height="' + hMu.toFixed(1) + '"/>';
        if (a.name === best.name) {
          html += '<rect class="bar-pick" x="' + (cx - bw / 2 - 3).toFixed(1) + '" y="' + (Y1 - hTot - 3).toFixed(1) +
            '" width="' + (bw + 6).toFixed(1) + '" height="' + (hTot + 3).toFixed(1) + '" rx="3"/>';
        }
        html += '<text class="blab' + (a.name === best.name ? ' pick' : '') + '" x="' + cx.toFixed(1) +
          '" y="' + (Y1 + 16) + '">' + esc(a.name) + '</text>';
        html += '<text class="blab" x="' + cx.toFixed(1) + '" y="' + (Y1 + 30) + '" style="font-size:9.5px">n = ' + a.n + '</text>';
      });
      if (host) host.innerHTML = html;

      if (read) {
        read.innerHTML =
          '<p class="t">Pick: ' + esc(best.name) + '</p>' +
          '<p>At <span class="m">c = ' + c.toFixed(2) + '</span> the bonus on the untested idea is ' +
          scored[2].bonus.toFixed(2) + ', against ' + scored[0].bonus.toFixed(2) + ' for the path you already know. ' +
          'Grey is the observed mean. Blue shows the extra weight given to limited evidence.</p>' +
          '<p>' + (c < 0.35
            ? 'Low c exploits. Sensible when the environment is stable and your advantage is compounding.'
            : c < 0.9
              ? 'At moderate c, the adjacent option starts to lead. It combines some evidence with room to learn.'
              : 'High c explores. Correct when you are early, when the environment just changed, or when returns have flattened.') +
          '</p>';
      }
      save('ucb', +range.value);
    }
    range.addEventListener('input', paint);
    var saved = load('ucb', null);
    if (saved !== null) range.value = saved;
    paint();
  }

  /* ══ Trust as capital ══════════════════════════════════ */
  /*
   * T(t+1) = (1-rho)T + a*R - b*D with b > a. Reliability accrues slowly and
   * a single defection subtracts far more than one round of good behaviour adds.
   */
  function trustCapital() {
    var range = $('#gt-trust-b');
    if (!range) return;
    var read = $('#gt-trust-read');
    var curve = $('#gt-trust-curve');
    var area = $('#gt-trust-area');
    var brk = $('#gt-trust-break');
    var bVal = $('#gt-trust-b-val');

    var X0 = 54, X1 = 500, Y0 = 26, Y1 = 160;
    var N = 60, BREAK = 40;
    var rho = 0.01, a = 0.05;

    function paint() {
      var b = +range.value / 10;
      if (bVal) bVal.textContent = b.toFixed(1) + '×';

      var T = 0, pts = [], recovered = null;
      var peak = 0;
      for (var i = 0; i <= N; i++) {
        pts.push(T);
        if (T > peak && i <= BREAK) peak = T;
        var D = (i === BREAK) ? 1 : 0;
        T = (1 - rho) * T + a * 1 - (a * b) * D * 10;
        if (T < 0) T = 0;
        if (i > BREAK && recovered === null && T >= peak) recovered = i - BREAK;
      }
      var vMax = Math.max(1, Math.max.apply(null, pts) * 1.15);
      function px(i) { return X0 + (i / N) * (X1 - X0); }
      function py(v) { return Y1 - clamp(v / vMax, 0, 1) * (Y1 - Y0); }

      var d = pts.map(function (v, i) { return (i ? 'L' : 'M') + px(i).toFixed(1) + ' ' + py(v).toFixed(1); }).join('');
      if (curve) curve.setAttribute('d', d);
      if (area) area.setAttribute('d', d + 'L' + px(N).toFixed(1) + ' ' + Y1 + 'L' + X0 + ' ' + Y1 + 'Z');
      if (brk) { brk.setAttribute('x1', px(BREAK)); brk.setAttribute('x2', px(BREAK)); }

      var lost = peak > 0 ? Math.min(100, Math.round((1 - pts[BREAK + 1] / peak) * 100)) : 0;
      if (read) {
        read.innerHTML =
          '<p class="t">One defection at round ' + BREAK + '</p>' +
          '<p><span class="big">' + lost + '%</span> of the trust built over ' + BREAK +
          ' rounds of reliability, gone in one.</p>' +
          '<p>' + (recovered === null
            ? 'It does not return to its previous level within the window shown. That is what <span class="m">b &gt; a</span> means in practice.'
            : 'Recovery to the previous level takes another <b>' + recovered + '</b> rounds, against the one round it took to lose.') +
          '</p>' +
          '<p>Reputation grows slowly and can fall quickly. Compare any one-off gain with the years spent building the trust it would use.</p>';
      }
      save('trustb', +range.value);
    }
    range.addEventListener('input', paint);
    var saved = load('trustb', null);
    if (saved !== null) range.value = saved;
    paint();
  }

  /* ══ Regimes ═══════════════════════════════════════════ */
  function regimes() {
    var host = $('#gt-regimes');
    if (!host) return;
    $$('.gt-regime', host).forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.classList.contains('is-on');
        $$('.gt-regime', host).forEach(function (o) { o.classList.remove('is-on'); });
        if (!on) b.classList.add('is-on');
      });
    });
  }

  /* ══ Readiness against opportunity ═════════════════════ */
  function readiness() {
    var svg = $('#gt-ready');
    if (!svg) return;
    var read = $('#gt-ready-read');
    var items = {};
    (DATA.readiness || []).forEach(function (r) { items[r.q] = r; });
    function show(k) {
      $$('g.r', svg).forEach(function (g) { g.classList.toggle('is-on', g.dataset.r === k); });
      var r = items[k];
      if (r && read) {
        read.innerHTML = '<p class="t">' + esc(r.t) + '</p><p>' + esc(r.body) + '</p>' +
          '<p class="rule">' + esc(r.rule) + '</p>';
      }
    }
    $$('g.r', svg).forEach(function (g) {
      g.addEventListener('mouseenter', function () { show(g.dataset.r); });
      g.addEventListener('focus', function () { show(g.dataset.r); });
      g.addEventListener('click', function () { show(g.dataset.r); });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(g.dataset.r); }
      });
    });
    show('ho');
  }

  /* ══ Boot ══════════════════════════════════════════════ */
  function init() {
    [progress, matrix, shadow, levers, quadrants, ruin, classifier, dashboard,
      five, domains, ucb, trustCapital, regimes, readiness]
      .forEach(function (fn) {
        try { fn(); } catch (e) { /* one broken widget must not take the page down */ }
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
