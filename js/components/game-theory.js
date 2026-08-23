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
          '<div class="move"><b>The move.</b> ' + esc(g.move) + '</div>';
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
            ? 'At δ = ' + d.toFixed(2) + ' the future is worth enough that one betrayal costs more than it gains. Nothing about either person has changed. Only the horizon has.'
            : 'At δ = ' + d.toFixed(2) + ' the relationship is too short to discipline anyone. Appeals to decency will not fix this, because the arithmetic favours defecting.') +
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
      body: 'Extreme leverage, one concentrated bet, anything where the bad case ends your ability to keep playing.',
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
          msg = 'The edge is real and the sizing is not. You are betting <b>' + (f * 100).toFixed(0) +
            '%</b> where the growth-optimal fraction is <b>' + (kelly * 100).toFixed(0) +
            '%</b>. Overbetting a winning game is the most common way to lose it.';
        } else if (ruined > 0) {
          msg = 'Positive expected value, and <b>' + Math.round(ruined / RUNS * 100) +
            '%</b> of paths still hit the floor. Average outcomes are not what you experience. You experience one path.';
        } else {
          msg = 'Edge, sizing and survival are all in order. This is the only configuration where compounding does the work for you.';
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
      'Nothing checked. Before deciding, work through the list. Most bad calls are made without knowing which game is being played.',
      'One down. Eight assumptions still unexamined.',
      'Two. Keep going, the awkward ones are usually further down.',
      'Three of nine.',
      'Four. Past halfway.',
      'Five. The remaining questions are the ones people skip.',
      'Six of nine.',
      'Seven. Two left, and they are usually irreversibility and the response you are ignoring.',
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
        out.innerHTML = '<p class="t">Score at least five</p><p>The reading is not the average. ' +
          'It is which domain is currently holding the rest of the system down.</p>';
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
        'rather than an average, then raising ' + esc(worst.k) + ' is worth more than improving anything already strong.</p>';
      if (brokenFloor.length) {
        html += '<p><b>' + brokenFloor.map(function (x) { return esc(x.k); }).join(', ') +
          '</b> ' + (brokenFloor.length === 1 ? 'is' : 'are') + ' below the floor. ' +
          'A domain marked floor is one no other score compensates for. Money does not fix recovery, and status does not fix meaning.</p>';
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

  /* ══ Boot ══════════════════════════════════════════════ */
  function init() {
    [progress, matrix, shadow, levers, quadrants, ruin, classifier, dashboard]
      .forEach(function (fn) {
        try { fn(); } catch (e) { /* one broken widget must not take the page down */ }
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
