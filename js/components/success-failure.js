/** Success & Failure: interactive decision router and reading progress. */
(function () {
  'use strict';

  var actions = {
    scale: { title: 'Scale', icon: 'sf-scale', reason: 'The objective still matters, the strategy has repeated evidence, and the larger bet remains survivable and sustainable.' },
    maintain: { title: 'Maintain', icon: 'sf-maintain', reason: 'The current exposure remains useful, but the evidence or available capacity does not support a larger commitment yet.' },
    adapt: { title: 'Adapt', icon: 'sf-adapt', reason: 'Keep the objective. Change the strategy, channel, timing, partner, positioning, or arena before spending another attempt.' },
    pause: { title: 'Pause', icon: 'sf-pause', reason: 'The objective may still be sound, but readiness or external conditions are weak. Preserve the option and build what is missing.' },
    hedge: { title: 'Hedge', icon: 'sf-hedge', reason: 'Useful exposure remains, but uncertainty and downside are both meaningful. Limit concentration while evidence develops.' },
    exit: { title: 'Exit', icon: 'sf-exit', reason: 'The future result is no longer worth wanting. Past investment does not create a claim on future time, money, or identity.' }
  };

  var questions = {
    goal: { title: 'If this works as designed, do you still want the result?', note: 'Judge the life and obligations created by success, not the status attached to it.', yes: 'conditions', no: 'exit' },
    conditions: { title: 'Do current conditions and your readiness support another move?', note: 'Consider energy, timing, information, resources, and the surrounding environment.', yes: 'strategy', no: 'pause' },
    strategy: { title: 'Is there evidence that the present strategy is sound?', note: 'A valuable objective does not make its current route correct.', yes: 'repeatable', no: 'adapt' },
    repeatable: { title: 'Has the result repeated under meaningfully independent conditions?', note: 'One result is data. Repetition is stronger evidence of a mechanism.', yes: 'capacity', no: 'downside' },
    capacity: { title: 'Can a larger version survive failure and fit available capacity?', note: 'Check concentration, fixed obligations, energy, reversibility, and what scale displaces.', yes: 'scale', no: 'maintain' },
    downside: { title: 'Would another attempt create meaningful downside or concentration?', note: 'Uncertainty alone does not require delay. Uncertainty combined with damage requires protection.', yes: 'hedge', no: 'maintain' }
  };

  function icon(id) {
    return '<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }

  function initRouter() {
    var host = document.getElementById('sf-router');
    if (!host) return;
    var stage = document.getElementById('sf-router-stage');
    var controls = document.getElementById('sf-router-actions');
    var result = document.getElementById('sf-router-result');
    var stepLabel = document.getElementById('sf-router-step');
    var bar = document.getElementById('sf-router-bar');
    var history = [];

    function showQuestion(key) {
      var q = questions[key];
      history.push(key);
      result.hidden = true;
      stage.hidden = false;
      controls.hidden = false;
      stepLabel.textContent = 'Question ' + history.length + ' of 5';
      bar.style.width = Math.min(100, history.length * 20) + '%';
      stage.innerHTML = '<h3>' + q.title + '</h3><p>' + q.note + '</p>';
      controls.innerHTML = '<button class="sf-choice" type="button" data-next="' + q.yes + '">Yes</button>' +
        '<button class="sf-choice" type="button" data-next="' + q.no + '">No</button>' +
        (history.length > 1 ? '<button class="sf-choice" type="button" data-back="true">Back</button>' : '');
    }

    function showResult(key) {
      var a = actions[key];
      stage.hidden = true;
      controls.hidden = true;
      result.hidden = false;
      stepLabel.textContent = 'Recommended response';
      bar.style.width = '100%';
      result.innerHTML = '<div class="sf-result-head">' + icon(a.icon) + '<h3>' + a.title + '</h3></div>' +
        '<p class="sf-result-reason">' + a.reason + '</p>' +
        '<button class="sf-restart" type="button">Start again</button>';
    }

    controls.addEventListener('click', function (event) {
      var button = event.target.closest('button');
      if (!button) return;
      if (button.hasAttribute('data-back')) {
        history.pop();
        var previous = history.pop() || 'goal';
        showQuestion(previous);
        return;
      }
      var next = button.getAttribute('data-next');
      if (questions[next]) showQuestion(next);
      else showResult(next);
    });
    result.addEventListener('click', function (event) {
      if (!event.target.closest('.sf-restart')) return;
      history = [];
      showQuestion('goal');
    });
    showQuestion('goal');
  }

  function initProgress() {
    var fill = document.getElementById('sf-progress-fill');
    if (!fill) return;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%';
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function initStoryRail() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.sf-story-rail a'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var sections = links.map(function (link) { return document.querySelector(link.getAttribute('href')); }).filter(Boolean);
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id); });
      });
    }, { rootMargin: '-18% 0px -65% 0px', threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ── Exposure dial ───────────────────────────────────────
     The same idea at 5% and at 100% is two different decisions, so the
     track above it becomes something you can actually move. */
  function initExposure() {
    var range = document.getElementById('sf-exposure');
    if (!range) return;
    var pct = document.getElementById('sf-exposure-pct');
    var band = document.getElementById('sf-exposure-band');
    var say = document.getElementById('sf-exposure-say');
    var track = document.querySelector('.sf-exposure-track');

    var BANDS = [
      { max: 15, key: 'probe', name: 'Probe', line: 'Small enough that being wrong costs information and nothing else.' },
      { max: 45, key: 'position', name: 'Position', line: 'Large enough to matter, small enough that a bad outcome stays survivable.' },
      { max: 100, key: 'commit', name: 'Commit', line: 'Only with repeated evidence, and only while the downside stays inside what you can absorb.' }
    ];

    function paint() {
      var v = +range.value;
      var b = BANDS.filter(function (x) { return v <= x.max; })[0] || BANDS[2];
      if (pct) pct.textContent = v;
      if (band) { band.textContent = b.name; band.dataset.band = b.key; }
      if (say) say.textContent = b.line;
      if (track) track.dataset.band = b.key;
      range.style.setProperty('--sf-pos', v + '%');
      range.setAttribute('aria-valuetext', v + ' percent, ' + b.name);
    }
    range.addEventListener('input', paint);
    paint();
  }

  /* ── The eighteen-domain scorecard ───────────────────────
     A win in one domain can hide damage in another, which you only see by
     putting all eighteen on one axis. Ratings are local storage only. */
  function initScorecard() {
    var groups = Array.prototype.slice.call(document.querySelectorAll('.sf-rate'));
    if (!groups.length) return;

    var bars = document.getElementById('sf-bars');
    var count = document.getElementById('sf-rated-n');
    var say = document.getElementById('sf-scorecard-say');
    var reset = document.getElementById('sf-rate-reset');
    var KEY = 'sf:ratings';

    var scores = {};
    try { scores = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { scores = {}; }

    function titleOf(group) {
      var card = group.closest('details');
      var label = card && card.querySelector('summary span:not(.ico)');
      return label ? label.textContent.trim() : group.dataset.domain;
    }

    var domains = groups.map(function (g) {
      return { id: g.dataset.domain, title: titleOf(g), group: g };
    });

    function paint() {
      var rated = domains.filter(function (d) { return scores[d.id] !== undefined; });
      if (count) count.textContent = rated.length;

      groups.forEach(function (g) {
        var v = scores[g.dataset.domain];
        Array.prototype.slice.call(g.querySelectorAll('button')).forEach(function (b) {
          var on = v !== undefined && +b.dataset.v === v;
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          b.classList.toggle('is-on', on);
        });
        g.classList.toggle('is-set', v !== undefined);
      });

      if (bars) {
        bars.innerHTML = '';
        domains.forEach(function (d) {
          var v = scores[d.id];
          var state = v === undefined ? 'none' : v > 0 ? 'up' : v < 0 ? 'down' : 'mid';
          var cell = document.createElement('span');
          cell.className = 'sf-bar is-' + state;
          cell.title = d.title + (v === undefined ? ': not rated' :
            v > 0 ? ': rising' : v < 0 ? ': falling' : ': flat');
          cell.innerHTML = '<i></i><em>' + d.title + '</em>';
          bars.appendChild(cell);
        });
      }

      if (!say) return;
      if (!rated.length) {
        say.textContent = 'Nothing rated yet. Open a domain above and say where it is heading.';
        return;
      }
      var up = rated.filter(function (d) { return scores[d.id] > 0; });
      var down = rated.filter(function (d) { return scores[d.id] < 0; });
      var parts = [];
      parts.push('<b>' + up.length + '</b> rising, <b>' +
        (rated.length - up.length - down.length) + '</b> flat, <b>' + down.length + '</b> falling.');
      if (down.length && up.length) {
        parts.push('Something is climbing while <b>' + down[0].title.toLowerCase() +
          '</b> falls. That is the pattern this section exists to catch.');
      } else if (down.length) {
        parts.push('<b>' + down[0].title.toLowerCase() + '</b> is the one constraining the rest.');
      } else if (rated.length === domains.length) {
        parts.push('Nothing falling across all eighteen. Check the review cadence below rather than trusting one reading.');
      }
      say.innerHTML = parts.join(' ');
    }

    groups.forEach(function (g) {
      g.addEventListener('click', function (event) {
        var btn = event.target.closest('button[data-v]');
        if (!btn) return;
        var id = g.dataset.domain, v = +btn.dataset.v;
        if (scores[id] === v) delete scores[id]; else scores[id] = v;
        try { localStorage.setItem(KEY, JSON.stringify(scores)); } catch (e) { /* private mode */ }
        paint();
      });
    });

    if (reset) {
      reset.addEventListener('click', function () {
        scores = {};
        try { localStorage.removeItem(KEY); } catch (e) { /* private mode */ }
        paint();
      });
    }

    paint();
  }


  /* ── A diagram inside each domain ────────────────────────
     Six shapes, chosen per domain from the `viz` block in
     _data/success_failure.yml. Every label is lifted from that domain's own
     good signal, false signal or response, so a diagram restates the row
     rather than adding a claim to it. Drawn once, when the row first opens. */
  function domainViz() {
    var rows = Array.prototype.slice.call(document.querySelectorAll('.sf-domains details'));
    if (!rows.length) return;

    var W = 300, H = 132;
    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function svg(inner) {
      return '<svg class="sf-viz-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-hidden="true">' + inner + '</svg>';
    }
    function key(items) {
      return '<div class="sf-viz-key">' + items.map(function (i) {
        return '<span class="' + i[0] + '"><i></i>' + esc(i[1]) + '</span>';
      }).join('') + '</div>';
    }

    var BUILD = {
      /* one origin, two directions */
      diverge: function (v) {
        return svg(
          '<line class="ax" x1="16" y1="116" x2="290" y2="116"/>' +
          '<path class="up" d="M20 92 C110 88 190 52 286 18"/>' +
          '<path class="down" d="M20 92 C110 96 190 104 286 112"/>' +
          '<circle class="dot-up" cx="286" cy="18" r="4"/>' +
          '<circle class="dot-down" cx="286" cy="112" r="4"/>' +
          '<circle class="dot-o" cx="20" cy="92" r="3.5"/>') +
          key([['up', v.up], ['down', v.down]]);
      },
      /* a calm top layer resting on a strained one */
      surface: function (v) {
        return svg(
          '<rect class="top" x="18" y="22" width="264" height="34" rx="4"/>' +
          '<path class="crack" d="M60 56 74 74 58 92 78 110"/>' +
          '<path class="crack" d="M170 56 156 76 176 94 160 110"/>' +
          '<rect class="under" x="18" y="76" width="264" height="38" rx="4"/>' +
          '<text class="lab-t" x="150" y="44" text-anchor="middle">holds</text>' +
          '<text class="lab-u" x="150" y="100" text-anchor="middle">carries it</text>') +
          key([['top', v.top], ['under', v.under]]);
      },
      /* two quantities meant to stay level */
      balance: function (v) {
        var t = v.tip === 'b' ? 8 : -8;
        return svg(
          '<path class="stand" d="M120 112h60M150 112V52"/>' +
          '<path class="pivot" d="m150 36 9 16h-18Z"/>' +
          '<g transform="rotate(' + t + ' 150 40)">' +
            '<line class="beam" x1="40" y1="40" x2="260" y2="40"/>' +
            '<path class="dish heavy" d="M16 40h48l-9 16H25Z"/>' +
            '<path class="dish" d="M236 40h48l-9 16h-30Z"/>' +
          '</g>') +
          key([['heavy', v.a], ['light', v.b]]);
      },
      /* borrowed now, larger later */
      debt: function (v) {
        return svg(
          '<line class="ax" x1="16" y1="70" x2="290" y2="70"/>' +
          '<rect class="now" x="34" y="46" width="70" height="24" rx="3"/>' +
          '<rect class="later" x="150" y="70" width="120" height="44" rx="3"/>' +
          '<path class="arrow" d="M104 58h38"/><path class="head" d="M140 53l10 5-10 5Z"/>' +
          '<text class="lab-t" x="69" y="38" text-anchor="middle">borrowed</text>' +
          '<text class="lab-u" x="210" y="128" text-anchor="middle">repaid, with interest</text>') +
          key([['now', v.now], ['later', v.later]]);
      },
      /* the target moves each time it is reached */
      ratchet: function (v) {
        var out = '<line class="ax" x1="16" y1="104" x2="290" y2="104"/>';
        [[52, 76], [124, 58], [196, 40], [268, 24]].forEach(function (p, i) {
          out += '<circle class="step" cx="' + p[0] + '" cy="' + p[1] + '" r="5"/>';
          if (i) out += '<line class="hop" x1="' + (p[0] - 72) + '" y1="' + (p[1] + 18) + '" x2="' + p[0] + '" y2="' + p[1] + '"/>';
          out += '<line class="goal" x1="' + (p[0] - 16) + '" y1="' + (p[1] - 16) + '" x2="' + (p[0] + 16) + '" y2="' + (p[1] - 16) + '"/>';
        });
        return svg(out) + key([['step', v.reach], ['goal', v.goal]]);
      },
      /* postponed to a condition that keeps receding */
      defer: function (v) {
        return svg(
          '<line class="ax" x1="16" y1="90" x2="290" y2="90"/>' +
          '<circle class="dot-o" cx="34" cy="90" r="5"/>' +
          '<path class="hop2" d="M34 90q30-34 60 0" /><path class="hop2" d="M94 90q30-34 60 0"/>' +
          '<path class="hop2" d="M154 90q30-34 60 0"/><path class="hop2" d="M214 90q30-34 60 0"/>' +
          '<line class="never" x1="282" y1="46" x2="282" y2="112" />' +
          '<text class="lab-u" x="276" y="36" text-anchor="end">never arrives</text>') +
          key([['step', v.thing], ['goal', v.until]]);
      },
      /* many thin against few thick */
      spread: function (v) {
        var out = '<line class="ax" x1="16" y1="112" x2="290" y2="112"/>';
        for (var i = 0; i < 11; i++) {
          out += '<rect class="thin" x="' + (22 + i * 11) + '" y="' + (92 - (i % 3) * 4) + '" width="5" height="' + (20 + (i % 3) * 4) + '" rx="1.5"/>';
        }
        [[178, 44], [214, 30], [250, 56]].forEach(function (b) {
          out += '<rect class="thick" x="' + b[0] + '" y="' + (112 - b[1]) + '" width="26" height="' + b[1] + '" rx="2.5"/>';
        });
        return svg(out) + key([['thin', v.many], ['thick', v.few]]);
      }
    };

    function draw(row) {
      if (row.dataset.viz === 'done') return;
      var raw = row.getAttribute('data-viz');
      if (!raw) { row.dataset.viz = 'done'; return; }
      var v;
      try { v = JSON.parse(raw); } catch (e) { row.dataset.viz = 'done'; return; }
      var build = BUILD[v.type];
      var body = row.querySelector('.sf-domain-body');
      if (!build || !body) { row.dataset.viz = 'done'; return; }
      var box = document.createElement('div');
      box.className = 'sf-viz sf-viz-' + v.type;
      box.innerHTML = build(v) + (v.cap ? '<p class="sf-viz-cap">' + esc(v.cap) + '</p>' : '');
      body.insertBefore(box, body.firstChild);
      row.dataset.viz = 'done';
    }

    rows.forEach(function (row) {
      if (row.open) draw(row);
      row.addEventListener('toggle', function () { if (row.open) draw(row); });
    });
  }

  function reviewLens() {
    var host=document.getElementById('sf-review-switch'); if(!host)return;
    var cards=Array.prototype.slice.call(document.querySelectorAll('.sf-review article')),warnings=document.querySelector('.sf-warnings');
    var copy={monthly:'Monthly: inspect individual wins and losses while the causes are still recoverable. Ask what worked, what diverged, and what the result built or cost.',quarterly:'Quarterly: step above individual outcomes. Look for compounding, deterioration, bottlenecks, concentration, and an over-optimized score.',alarms:'Alarm review: repeated patterns matter more than one mood. Look for identity lock-in, rising stakes, unlearned lessons, or a system that cannot function without you.'};
    Array.prototype.slice.call(host.querySelectorAll('button')).forEach(function(button){button.addEventListener('click',function(){var mode=button.dataset.sfReview;Array.prototype.slice.call(host.querySelectorAll('button')).forEach(function(b){b.classList.toggle('is-on',b===button);});cards.forEach(function(card,i){card.classList.toggle('is-focus',mode==='monthly'?i<2:mode==='quarterly'?i>=2:false);});document.querySelector('.sf-review').classList.toggle('has-focus',mode!=='alarms');warnings.classList.toggle('is-focus',mode==='alarms');document.getElementById('sf-review-read').textContent=copy[mode];});});
  }

  function exploreStatics() {
    var configs=[{root:'.sf-quadrants',items:'.sf-quadrant',read:'[data-sf-read="four-outcomes"]',copy:function(i){return i.querySelector('h3').textContent+': '+i.querySelector('p').textContent}},{root:'.sf-diagnostic-grid',items:'article',prompt:'Select a diagnostic question. One result cannot reveal its own cause.',copy:function(i){return i.querySelector('h3').textContent+' test: '+i.querySelector('p').textContent}},{root:'.sf-lanes',items:'.sf-lane',prompt:'Select the observed result. A win and a loss require different first moves.',copy:function(i){return i.classList.contains('success')?'After a win, attribution and independent repetition come before scale.':'After a loss, stabilize the resources needed to continue before choosing another bet.'}},{root:'.sf-loops-chain',items:'article',prompt:'Select a chain to see what the next round inherits.',copy:function(i){return i.querySelector('h3').textContent+': '+i.querySelector('small').textContent}}];
    configs.forEach(function(cfg){var root=document.querySelector(cfg.root);if(!root)return;var read=cfg.read?document.querySelector(cfg.read):null;if(!read){read=document.createElement('p');read.className='sf-explore-read';read.setAttribute('role','status');read.textContent=cfg.prompt;root.insertAdjacentElement('afterend',read);}var items=Array.prototype.slice.call(root.querySelectorAll(cfg.items));root.classList.add('sf-explore-set');items.forEach(function(item){item.classList.add('sf-explore-item');item.tabIndex=0;item.setAttribute('role','button');function choose(){items.forEach(function(x){x.classList.toggle('is-pick',x===item);});root.classList.add('has-pick');read.textContent=cfg.copy(item);}item.addEventListener('click',choose);item.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});});});
  }


  /* ── Five working figures ────────────────────────────────
     Each takes one control and answers immediately, so the claim in the text
     beside it demonstrates itself rather than being illustrated. Numbers are
     shaped to make one point and are not measurements. */

  function sxEl(n, a) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', n);
    Object.keys(a || {}).forEach(function (k) { e.setAttribute(k, a[k]); });
    return e;
  }
  function sxOne(s) { return document.querySelector(s); }
  function sxAll(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  /* 1 · One result tells you less than you think.
     Twenty runs of the same strategy. The strategy's real worth never moves;
     only the noise around it does. At high luck a single run says nothing. */
  function sxLuck() {
    var r = sxOne('#sx-luck');
    if (!r) return;
    var X0 = 40, X1 = 524, TRUE_X = 0.56;
    /* a fixed pseudo-random set, so dragging changes spread and not the seed */
    var SEED = [0.42, -0.71, 0.13, 0.88, -0.36, 0.64, -0.92, 0.27, 0.55, -0.18,
                0.76, -0.49, 0.05, -0.83, 0.31, 0.69, -0.24, 0.94, -0.61, 0.09];
    function paint() {
      var luck = +r.value / 100;
      var host = sxOne('#sx-runs');
      host.innerHTML = '';
      var xs = SEED.map(function (n) {
        return Math.max(0.02, Math.min(0.98, TRUE_X + n * luck * 0.44));
      });
      xs.forEach(function (p, i) {
        host.appendChild(sxEl('circle', {
          cx: (X0 + p * (X1 - X0)).toFixed(1),
          cy: (44 + (i % 5) * 18).toFixed(1), r: 5, class: 'sx-run'
        }));
      });
      var tx = X0 + TRUE_X * (X1 - X0);
      sxOne('#sx-true').setAttribute('x1', tx); sxOne('#sx-true').setAttribute('x2', tx);
      sxOne('#sx-truelab').setAttribute('x', tx);
      var lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs);
      sxOne('#sx-spread').textContent = Math.round((hi - lo) * 100);
      /* runs needed rises with the square of the noise */
      var need = Math.max(1, Math.round(1 + Math.pow(luck * 10, 2) / 3.2));
      sxOne('#sx-runs-needed').textContent = need;
      sxOne('#sx-say').textContent = luck <= 0.1
        ? 'Almost no luck here. One result is close to the truth about the strategy.'
        : luck >= 0.6
          ? 'Any single run lands almost anywhere. A win here is not evidence yet.'
          : 'The result carries signal and noise together. Repeat it before scaling.';
    }
    r.addEventListener('input', paint);
    paint();
  }

  /* 2 · Place your last result. Two axes, four names. */
  function sxQuad() {
    var v = sxOne('#sx-visible'), c = sxOne('#sx-capacity');
    if (!v || !c) return;
    var NAME = {
      tr: ['Real success', 'Reward arrived with capability. This is the one worth scaling.'],
      tl: ['Productive failure', 'It cost you, and you can do more than before. Keep the information.'],
      br: ['False success', 'It looks like a win and left you with less room. Check what it depleted.'],
      bl: ['Destructive failure', 'It cost you and took capacity with it. Stabilise before deciding anything.']
    };
    function paint() {
      var x = +v.value / 100, y = +c.value / 100;
      var cx = 20 + x * 260, cy = 280 - y * 260;
      var you = sxOne('#sx-you');
      you.setAttribute('cx', cx.toFixed(1)); you.setAttribute('cy', cy.toFixed(1));
      var key = (y >= 0.5 ? 't' : 'b') + (x >= 0.5 ? 'r' : 'l');
      sxAll('.sx-q').forEach(function (q) { q.classList.remove('is-on'); });
      var lit = sxOne('.sx-q-' + key);
      if (lit) lit.classList.add('is-on');
      sxOne('#sx-quad').textContent = NAME[key][0];
      sxOne('#sx-quad-say').textContent = NAME[key][1];
    }
    v.addEventListener('input', paint); c.addEventListener('input', paint);
    paint();
  }

  /* 3 · Each answer removes a cause. */
  var SX_Q = [
    ['Was the objective still worth wanting?', 'Objective'],
    ['Was the route suited to the objective?', 'Strategy'],
    ['Was the plan carried out to standard?', 'Execution'],
    ['Did the move fit the current regime?', 'Timing'],
    ['Did a hidden variable change it?', 'Information'],
    ['Did another player react unexpectedly?', 'Response'],
    ['Could this be ordinary randomness?', 'Noise']
  ];
  function sxNarrow() {
    var host = sxOne('#sx-qs');
    if (!host) return;
    var ruled = {};
    host.innerHTML = SX_Q.map(function (q, i) {
      return '<button type="button" data-i="' + i + '"><span>' + q[0] + '</span><em>rule out</em></button>';
    }).join('');
    function paint() {
      sxAll('#sx-qs button').forEach(function (b) { b.classList.toggle('is-off', !!ruled[b.dataset.i]); });
      var left = SX_Q.filter(function (_, i) { return !ruled[i]; });
      sxOne('#sx-causes').innerHTML = SX_Q.map(function (q, i) {
        return '<span class="' + (ruled[i] ? 'is-out' : '') + '">' + q[1] + '</span>';
      }).join('');
      var say = sxOne('#sx-narrow-say');
      say.textContent = left.length === SX_Q.length
        ? 'Seven causes are still open. One result cannot tell you which.'
        : left.length > 1
          ? left.length + ' causes still fit what you know.'
          : left.length === 1
            ? 'One cause left: ' + left[0][1].toLowerCase() + '. Now you have something to fix.'
            : 'You have ruled out everything. One of them was wrong.';
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]');
      if (!b) return;
      ruled[b.dataset.i] = !ruled[b.dataset.i];
      paint();
    });
    paint();
  }

  /* 4 · The order is the method. */
  var SX_LANE = {
    win: [['Attribute', 'you do not know what caused it'],
          ['Repeat', 'one win is still one win'],
          ['Stress-test', 'you have not asked what breaks'],
          ['Capture', 'nothing was turned into an asset'],
          ['Scale', '']],
    loss: [['Stabilize', 'you are deciding while still bleeding'],
           ['Locate', 'you do not know where it diverged'],
           ['Separate', 'signal and noise are still mixed'],
           ['Extract', 'the information is unrecorded'],
           ['Respond', '']]
  };
  function sxOrder() {
    var r = sxOne('#sx-start');
    if (!r) return;
    var lane = 'win';
    function paint() {
      var start = +r.value, steps = SX_LANE[lane];
      sxOne('#sx-steps').innerHTML = steps.map(function (s, i) {
        var skipped = i < start - 1;
        return '<li class="' + (skipped ? 'is-skipped' : '') + '"><b>' + (i + 1) + '</b>' +
          '<span>' + s[0] + '</span></li>';
      }).join('');
      sxOne('#sx-skipped').textContent = start - 1;
      var missing = steps.slice(0, start - 1).map(function (s) { return s[1]; }).filter(Boolean);
      sxOne('#sx-order-say').textContent = start === 1
        ? 'Full sequence. Each step gives the next one something to work with.'
        : 'Starting here means ' + missing.join(', and ') + '.';
    }
    sxOne('#sx-lane').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-lane]');
      if (!b) return;
      lane = b.dataset.lane;
      sxAll('#sx-lane button').forEach(function (x) { x.classList.toggle('is-on', x === b); });
      paint();
    });
    r.addEventListener('input', paint);
    paint();
  }

  /* 5 · Both loops compound. */
  function sxCompound() {
    var r = sxOne('#sx-rounds');
    if (!r) return;
    var X0 = 40, X1 = 528, Y0 = 20, Y1 = 150, N = 12;
    function good(k) { return 100 * Math.pow(1.13, k - 1); }
    function recov(k) { return 100 * Math.pow(1.05, k - 1); }
    function bad(k) { return 100 * Math.pow(0.83, k - 1); }
    var TOP = good(N);
    function px(k) { return X0 + (k - 1) / (N - 1) * (X1 - X0); }
    function py(v) { return Y1 - Math.min(1, v / TOP) * (Y1 - Y0); }
    function path(fn, upto) {
      var d = '';
      for (var k = 1; k <= upto; k++) d += (k > 1 ? 'L' : 'M') + px(k).toFixed(1) + ' ' + py(fn(k)).toFixed(1);
      return d;
    }
    function paint() {
      var k = +r.value;
      [['#sx-good', good], ['#sx-recover', recov], ['#sx-bad', bad]].forEach(function (p) {
        sxOne(p[0]).setAttribute('d', path(p[1], k));
      });
      [['#sx-dot-good', good], ['#sx-dot-recover', recov], ['#sx-dot-bad', bad]].forEach(function (p) {
        var el = sxOne(p[0]);
        el.setAttribute('cx', px(k).toFixed(1)); el.setAttribute('cy', py(p[1](k)).toFixed(1));
      });
      sxOne('#sx-v-good').textContent = Math.round(good(k));
      sxOne('#sx-v-recover').textContent = Math.round(recov(k));
      sxOne('#sx-v-bad').textContent = Math.round(bad(k));
      sxOne('#sx-loops-say').textContent = k === 1
        ? 'All three start in the same place. The difference is only what happens next.'
        : 'After ' + k + ' rounds the gap is ' + Math.round(good(k) - bad(k)) +
          '. Nothing dramatic happened in any single round.';
    }
    r.addEventListener('input', paint);
    paint();
  }

  [sxLuck, sxQuad, sxNarrow, sxOrder, sxCompound].forEach(function (fn) {
    try { fn(); } catch (e) { /* one figure must not take the page down */ }
  });

  function initMilestones() {
    var path = document.getElementById('sf-phase-path');
    if (!path) return;
    var buttons = Array.prototype.slice.call(path.querySelectorAll('button[data-phase]'));
    var detail = document.getElementById('sf-phase-detail');
    var committed = '';
    var phase = {
      proving: {
        number: 'Milestone 01', title: 'Proving capability',
        explanation: 'This phase turns potential into evidence. Difficult, real work reveals which skills transfer, which environments sharpen performance, and which problems are worth solving repeatedly.',
        order: 'Direction chosen before evidence is mostly guesswork. Capability comes first because it creates the self-knowledge and credibility needed to make a serious commitment.',
        gate: 'Name one valuable problem you solve unusually well.',
        legend: [['read', 'Capability built'], ['win', 'Evidence validated'], ['line', 'Fit becomes clearer']],
        prerequisites: ['A stable practice routine', 'Access to real problems and feedback', 'Baseline literacy in the chosen domain'],
        hard: ['Domain fundamentals', 'Structured research and problem solving', 'Fluency with the field’s core tools', 'End-to-end project delivery'],
        soft: ['Reliability under ordinary pressure', 'Receiving correction without defensiveness', 'Deliberate practice and curiosity', 'Frustration tolerance'],
        requirements: ['Completed work, not coursework alone', 'External feedback from competent people', 'A record of errors and lessons', 'A repeatable baseline standard'],
        readiness: ['You solve familiar problems without step-by-step supervision', 'Your skill transfers across more than one project', 'Others trust you to finish important work', 'You can name the problem class where you are strongest'],
        art: '<svg viewBox="0 0 320 190"><path class="axis" d="M38 158H286"/><rect class="a" x="52" y="126" width="48" height="32" rx="4"/><rect class="b" x="116" y="92" width="48" height="66" rx="4"/><rect class="c" x="180" y="52" width="48" height="106" rx="4"/><path class="arrow" d="M68 112L132 76L196 36L270 22"/><path class="head" d="M258 18L274 20L265 34"/><circle class="proof" cx="76" cy="110" r="6"/><circle class="proof" cx="140" cy="74" r="6"/><circle class="proof" cx="204" cy="34" r="6"/><text x="76" y="177">SKILL</text><text x="140" y="177">PROOF</text><text x="204" y="177">FIT</text></svg>'
      },
      choosing: {
        number: 'Milestone 02', title: 'Choosing direction',
        explanation: 'This phase converts broad capability into deliberate commitment. The field, problem class, collaborators, and unwanted tradeoffs become explicit enough to guide the next stretch of work.',
        order: 'Commitment becomes intelligent only after capability produces evidence. It must precede leverage because a system that compounds the wrong direction creates faster drift, not progress.',
        gate: 'Become the person competent people associate with one difficult problem.',
        legend: [['line', 'Explored routes'], ['read', 'Committed route'], ['win', 'Target problem']],
        prerequisites: ['Evidence from the proving phase', 'A credible body of work', 'Exposure to several environments', 'Enough runway to reject a clearly bad fit'],
        hard: ['Market and problem research', 'Opportunity comparison', 'Professional positioning', 'Network and stakeholder mapping'],
        soft: ['Accurate self-assessment', 'Boundary setting', 'Decision-making under uncertainty', 'Commitment without premature certainty'],
        requirements: ['One chosen problem class', 'A field worth sustained commitment', 'A deliberate stop-doing list', 'Peers who raise your standard'],
        readiness: ['People say “talk to them about this problem”', 'You reject impressive but misaligned work', 'New learning compounds in one direction', 'The first ownership opportunity becomes visible'],
        art: '<svg viewBox="0 0 320 190"><circle class="origin" cx="52" cy="95" r="9"/><path class="dim" d="M62 95C122 95 135 38 205 38H270M62 95C122 95 135 152 205 152H270"/><path class="main" d="M62 95H270"/><path class="head" d="M257 86L274 95L257 104"/><circle class="target" cx="218" cy="95" r="22"/><circle class="target" cx="218" cy="95" r="8"/><text x="52" y="122">OPTIONS</text><text x="218" y="132">CHOSEN GAME</text></svg>'
      },
      leverage: {
        number: 'Milestone 03', title: 'Building leverage',
        explanation: 'This phase makes expertise reusable. A method becomes a product, system, team, distribution channel, recurring asset, or body of intellectual property instead of disappearing when the workday ends.',
        order: 'Leverage follows direction because compounding needs a stable target. It comes before ownership because there must first be a repeatable value engine worth capturing.',
        gate: 'Make one part of your contribution scale beyond your own hours.',
        legend: [['read', 'Expertise source'], ['win', 'Reusable channels'], ['line', 'One-to-many reach']],
        prerequisites: ['A clear direction', 'Repeated demand for the same expertise', 'A method that works more than once', 'Access to users and feedback'],
        hard: ['Process and system design', 'Documentation and knowledge architecture', 'Productization or automation', 'Delegation and quality control'],
        soft: ['Abstracting patterns from cases', 'Teaching clearly', 'Patience with iteration', 'Maintaining standards through others'],
        requirements: ['A named repeatable method', 'A reusable asset or workflow', 'A distribution channel', 'A measure of output beyond hours worked'],
        readiness: ['Someone else can use your method successfully', 'Useful output continues without your constant presence', 'Marginal effort falls as value repeats', 'Demand becomes recurring rather than accidental'],
        art: '<svg viewBox="0 0 320 190"><circle class="core" cx="78" cy="95" r="28"/><text class="inside" x="78" y="99">EXPERTISE</text><path class="main" d="M108 95H160"/><path class="head" d="M149 87L164 95L149 103"/><path class="branch" d="M164 95L218 36M164 95H218M164 95L218 154"/><circle class="out" cx="220" cy="34" r="10"/><circle class="out" cx="220" cy="95" r="10"/><circle class="out" cx="220" cy="156" r="10"/><text class="outside" x="241" y="38">IP</text><text class="outside" x="241" y="99">SYSTEM</text><text class="outside" x="241" y="160">TEAM</text></svg>'
      },
      ownership: {
        number: 'Milestone 04', title: 'Expanding ownership',
        explanation: 'This phase changes value from compensation into participation. Equity, assets, reusable work, and aligned terms allow successful outcomes to build optionality beyond the next payment.',
        order: 'Ownership follows leverage because repeatable value makes upside identifiable and negotiable. It precedes authority because bearing consequences improves incentives and decision quality.',
        gate: 'Know exactly how you participate when the work succeeds dramatically.',
        legend: [['read', 'Total value created'], ['win', 'Upside owned'], ['line', 'Participation flow']],
        prerequisites: ['A working leverage engine', 'Evidence of value created', 'Basic financial runway', 'Clear understanding of the value chain'],
        hard: ['Contract, equity, and incentive mechanics', 'Unit economics and cash-flow reading', 'Asset valuation and risk analysis', 'Capital-allocation fundamentals'],
        soft: ['Negotiating without apology or entitlement', 'Thinking like an owner', 'Downside discipline', 'Patience for compounding'],
        requirements: ['Explicit rights to economic upside', 'Defined accountability and decision rights', 'Liquidity outside the main bet', 'Protection against destructive concentration'],
        readiness: ['Some income or wealth grows through ownership', 'You know your upside in a dramatic success', 'You evaluate decisions as allocations of capital', 'You can say no without immediate financial panic'],
        art: '<svg viewBox="0 0 320 190"><circle class="ring" cx="112" cy="94" r="62"/><path class="slice" d="M112 94V32A62 62 0 0 1 166 126Z"/><circle class="hole" cx="112" cy="94" r="29"/><path class="main" d="M178 94H272"/><path class="head" d="M259 85L276 94L259 103"/><text x="112" y="98">VALUE</text><text x="227" y="78">UPSIDE</text><text x="227" y="112">PARTICIPATION</text></svg>'
      },
      authority: {
        number: 'Milestone 05', title: 'Establishing authority',
        explanation: 'This phase shifts the work from production to selection. People seek judgment before committing resources because previous decisions have repeatedly survived contact with reality.',
        order: 'Authority should follow demonstrated value and ownership, not title alone. Judgment must first operate with evidence, incentives, and consequences before others safely defer to it.',
        gate: 'Be trusted to decide which problems deserve attention.',
        legend: [['win', 'Candidate options'], ['read', 'Judgment filter'], ['line', 'Selected decision']],
        prerequisites: ['Consequences tied to prior decisions', 'A record of sound calls', 'Deep domain expertise', 'Trust from capable peers'],
        hard: ['Decision and prioritization frameworks', 'Scenario and risk analysis', 'Resource allocation', 'Incentive and organizational design'],
        soft: ['Calibrated judgment', 'Communicating uncertainty', 'Constructive conflict and courage', 'Visible accountability for outcomes'],
        requirements: ['Decision rights matched by resources', 'Ownership of ambiguous problems', 'A decision journal with outcomes', 'Access to relevant information before choices'],
        readiness: ['People consult you before committing resources', 'Your decisions survive changing conditions', 'Others execute from your direction without micromanagement', 'You consistently identify the problem behind the request'],
        art: '<svg viewBox="0 0 320 190"><path class="funnel" d="M38 34H282L205 100V152H115V100Z"/><circle class="option" cx="78" cy="58" r="8"/><circle class="option" cx="126" cy="58" r="8"/><circle class="option" cx="174" cy="58" r="8"/><circle class="option" cx="222" cy="58" r="8"/><circle class="option" cx="258" cy="58" r="8"/><path class="main" d="M160 112V170"/><path class="head" d="M151 158L160 174L169 158"/><text x="160" y="91">SELECT</text><text x="160" y="187">DECISION</text></svg>'
      },
      scaling: {
        number: 'Milestone 06', title: 'Scaling judgment',
        explanation: 'This phase multiplies sound judgment through people, systems, information, and capital. Results no longer require personal intervention in every operational detail.',
        order: 'Scale amplifies both wisdom and error. It belongs after authority because judgment must prove reliable in bounded decisions before a larger system carries it outward.',
        gate: 'Build a system that works without making you its permanent bottleneck.',
        legend: [['read', 'Judgment hub'], ['win', 'Multiplier nodes'], ['line', 'Delegated reach']],
        prerequisites: ['Trusted judgment', 'Principles that can be explained', 'Capable lieutenants or partners', 'Resources worth multiplying'],
        hard: ['Operating-system design', 'Organizational design and delegation', 'Portfolio or program management', 'Information and performance dashboards'],
        soft: ['Trusting without abandoning oversight', 'Selecting and developing talent', 'Setting context instead of prescribing tasks', 'Letting go of personal indispensability'],
        requirements: ['Clear decision architecture', 'Fast feedback and correction loops', 'Explicit ownership across the system', 'Redundancy for critical roles'],
        readiness: ['The system performs during your absence', 'Judgment travels across teams, assets, or products', 'You are no longer the routine bottleneck', 'Most time moves from firefighting to selection'],
        art: '<svg viewBox="0 0 320 190"><circle class="core" cx="160" cy="95" r="30"/><text class="inside" x="160" y="99">JUDGMENT</text><path class="branch" d="M160 65V26M186 78L244 45M190 104L258 122M174 123L198 168M145 124L112 164M132 106L62 132M132 80L68 48"/><circle class="out" cx="160" cy="20" r="11"/><circle class="out" cx="254" cy="39" r="11"/><circle class="out" cx="270" cy="126" r="11"/><circle class="out" cx="202" cy="174" r="11"/><circle class="out" cx="106" cy="170" r="11"/><circle class="out" cx="50" cy="136" r="11"/><circle class="out" cx="57" cy="42" r="11"/></svg>'
      },
      transmitting: {
        number: 'Milestone 07', title: 'Allocating & transmitting',
        explanation: 'This phase turns accumulated discernment into durable benefit beyond direct work. Capital, mentorship, governance, teaching, writing, and institutions carry useful judgment into other lives and future decisions.',
        order: 'Transmission comes last because discernment requires a long record of learning, choosing, owning, and scaling. What is passed onward should be tested knowledge rather than borrowed certainty.',
        gate: 'Make what you learned useful beyond your own direct involvement.', final: true,
        legend: [['read', 'Tested discernment'], ['line', 'Transmission waves'], ['win', 'People and systems reached']],
        prerequisites: ['Systems that operate without constant intervention', 'Financial and professional optionality', 'A long record of decisions and consequences', 'An identity larger than one operating role'],
        hard: ['Capital allocation', 'Governance and fiduciary thinking', 'Mentorship and knowledge design', 'Portfolio, institution, or succession building'],
        soft: ['Discernment about people and opportunities', 'Stewardship', 'Humility about what cannot be known', 'Generativity and patience'],
        requirements: ['Explicit investment and selection principles', 'Successor and mentorship pathways', 'Protected attention for high-leverage decisions', 'Vehicles that carry knowledge or capital forward'],
        readiness: ['Other people make better decisions because of your guidance', 'Institutions or assets endure beyond your involvement', 'Capital reaches worthy problems with discipline', 'Your knowledge is transferable rather than trapped in reputation'],
        art: '<svg viewBox="0 0 320 190"><circle class="core" cx="92" cy="95" r="22"/><circle class="wave" cx="92" cy="95" r="45"/><circle class="wave" cx="92" cy="95" r="70"/><path class="main" d="M164 95H276"/><path class="head" d="M263 86L280 95L263 104"/><circle class="seed" cx="224" cy="58" r="8"/><circle class="seed" cx="252" cy="95" r="8"/><circle class="seed" cx="224" cy="132" r="8"/><text x="92" y="99">DISCERN</text><text x="238" y="157">BEYOND SELF</text></svg>'
      }
    };
    var criteriaTabs = Array.prototype.slice.call(document.querySelectorAll('.sf-phase-criteria-tabs button[data-criterion]'));
    var criteriaList = document.getElementById('sf-phase-criteria-list');
    var criteriaLabel = document.getElementById('sf-phase-criteria-label');
    var criterion = 'readiness';
    var currentContent = null;
    var criterionLabels = {
      prerequisites: 'What must already be true',
      hard: 'Technical and operational mastery',
      soft: 'Behavioral mastery',
      requirements: 'What this phase must contain',
      readiness: 'Observable upgrade signals'
    };
    function renderCriterion() {
      if (!currentContent || !criteriaList || !criteriaLabel) return;
      criteriaLabel.textContent = criterionLabels[criterion];
      criteriaList.innerHTML = currentContent[criterion].map(function (item) { return '<li>' + item + '</li>'; }).join('');
      criteriaTabs.forEach(function (tab) {
        var selected = tab.dataset.criterion === criterion;
        tab.classList.toggle('is-on', selected);
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.tabIndex = selected ? 0 : -1;
      });
    }
    function choose(key, remember) {
      var button = buttons.find(function (item) { return item.dataset.phase === key; });
      var content = phase[key];
      if (!button || !content || !detail) return;
      var currentIndex = buttons.indexOf(button);
      path.style.setProperty('--phase-progress', (currentIndex / (buttons.length - 1) * 100) + '%');
      buttons.forEach(function (item, index) {
        var current = item === button;
        item.classList.toggle('is-current', current);
        item.classList.toggle('is-past', index < currentIndex);
        item.setAttribute('aria-pressed', current ? 'true' : 'false');
      });
      document.getElementById('sf-phase-detail-number').textContent = content.number;
      document.getElementById('sf-phase-detail-title').textContent = content.title;
      document.getElementById('sf-phase-detail-explanation').textContent = content.explanation;
      document.getElementById('sf-phase-detail-order').textContent = content.order;
      document.getElementById('sf-phase-detail-gate').textContent = content.gate;
      document.getElementById('sf-phase-detail-gate-label').textContent = content.final ? 'Completion signal' : 'Gate to the next milestone';
      document.getElementById('sf-phase-detail-visual').innerHTML = content.art + '<div class="sf-phase-legend">' + content.legend.map(function (item) { return '<span><i class="' + item[0] + '"></i>' + item[1] + '</span>'; }).join('') + '</div>';
      currentContent = content;
      renderCriterion();
      detail.hidden = false;
      if (remember) {
        committed = key;
        try { localStorage.setItem('sf-life-phase', key); } catch (error) { /* Selection still works. */ }
      }
    }
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', function () { choose(button.dataset.phase, true); });
      button.addEventListener('mouseenter', function () { choose(button.dataset.phase, false); });
      button.addEventListener('focus', function () { choose(button.dataset.phase, false); });
      button.addEventListener('mouseleave', function () { if (committed) choose(committed, false); });
      button.addEventListener('blur', function () { if (committed) choose(committed, false); });
    });
    criteriaTabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { criterion = tab.dataset.criterion; renderCriterion(); });
      tab.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        var next = (index + (event.key === 'ArrowRight' ? 1 : -1) + criteriaTabs.length) % criteriaTabs.length;
        criterion = criteriaTabs[next].dataset.criterion;
        renderCriterion();
        criteriaTabs[next].focus();
      });
    });
    var saved = '';
    try { saved = localStorage.getItem('sf-life-phase') || ''; } catch (error) { /* Start unselected. */ }
    if (saved) { committed = saved; choose(saved, false); }
  }

  function init() {
    try { initRouter(); } catch (error) { /* The static action key remains usable. */ }
    try { initProgress(); } catch (error) { /* Reading remains unaffected. */ }
    try { initStoryRail(); } catch (error) { /* Navigation remains usable. */ }
    try { initExposure(); } catch (error) { /* The static track still reads. */ }
    try { initScorecard(); } catch (error) { /* The domains still open and read. */ }
    try { domainViz(); } catch (error) { /* The domain text still reads without its diagram. */ }
    try { reviewLens(); } catch (error) { /* The review cards remain readable. */ }
    try { exploreStatics(); } catch (error) { /* Static explanations remain available. */ }
    try { initMilestones(); } catch (error) { /* The milestone chart remains readable. */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
