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

  function init() {
    try { initRouter(); } catch (error) { /* The static action key remains usable. */ }
    try { initProgress(); } catch (error) { /* Reading remains unaffected. */ }
    try { initStoryRail(); } catch (error) { /* Navigation remains usable. */ }
    try { initExposure(); } catch (error) { /* The static track still reads. */ }
    try { initScorecard(); } catch (error) { /* The domains still open and read. */ }
    try { domainViz(); } catch (error) { /* The domain text still reads without its diagram. */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
