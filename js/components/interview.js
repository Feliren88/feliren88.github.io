/**
 * Interview revision — /interview/ and the eighteen syllabus pages.
 *
 * Three jobs:
 *   1. Turn each module's `viz` block into a diagram (BUILD, eight archetypes)
 *   2. Track which modules have been revised (localStorage, `iv:` prefix)
 *   3. Draw the handoff edges on the hub map, measured from the real layout
 *
 * The page ships its content as a JSON island (`#iv-data`) so this file never
 * parses the DOM to find out what to draw. Colour is always a custom property,
 * so both themes work without a second definition.
 */
(function () {
  'use strict';

  var STORE = 'iv:';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function save(k, v) { try { localStorage.setItem(STORE + k, JSON.stringify(v)); } catch (e) {} }
  function load(k, d) {
    try { var v = localStorage.getItem(STORE + k); return v === null ? d : JSON.parse(v); }
    catch (e) { return d; }
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function data() {
    var el = $('#iv-data');
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  }

  /* ════════════════════════════════════════════════════════
     Diagrams

     Label-heavy archetypes are HTML, so the text wraps, stays
     selectable and never needs geometry maths. `curve` is the
     one place the shape itself carries the meaning, so it is
     SVG with the labels placed outside the plot.
     ════════════════════════════════════════════════════════ */

  var BUILD = {

    /* Ordered stages. `loop` closes the last back to the first. */
    flow: function (v) {
      var steps = v.steps || [];
      var li = steps.map(function (s, i) {
        return '<li class="ivz-step"><b>' + (i + 1) + '</b><span>' + esc(s) + '</span></li>';
      }).join('');
      return '<div class="ivz ivz-flow' + (v.loop ? ' is-loop' : '') + '">' +
        '<ol>' + li + '</ol>' +
        (v.loop ? '<span class="ivz-flow-loop" aria-hidden="true">and round again</span>' : '') +
        '</div>';
    },

    /* Two or three columns held side by side. */
    compare: function (v) {
      var cols = (v.cols || []).map(function (c) {
        var items = (c.items || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
        return '<div class="ivz-col"><span class="ivz-col-k">' + esc(c.k) + '</span>' +
          '<ul>' + items + '</ul></div>';
      }).join('');
      return '<div class="ivz ivz-compare" data-n="' + (v.cols || []).length + '">' + cols + '</div>';
    },

    /* Layers. The last entry is the foundation and sits at the bottom. */
    stack: function (v) {
      var ls = v.layers || [];
      return '<ul class="ivz ivz-stack">' + ls.map(function (t, i) {
        return '<li' + (i === ls.length - 1 ? ' class="is-base"' : '') + '><span>' + esc(t) + '</span></li>';
      }).join('') + '</ul>';
    },

    /* Two by two. `cells` reads across the top row, then the bottom row. */
    matrix: function (v) {
      var c = v.cells || [], x = v.x || [], y = v.y || [];
      return '<div class="ivz ivz-matrix">' +
        '<span class="ivz-mx ivz-mx-a">' + esc(x[0]) + '</span>' +
        '<span class="ivz-mx ivz-mx-b">' + esc(x[1]) + '</span>' +
        '<span class="ivz-my ivz-my-a">' + esc(y[0]) + '</span>' +
        '<span class="ivz-my ivz-my-b">' + esc(y[1]) + '</span>' +
        '<div class="ivz-cells">' + c.map(function (t) {
          return '<div class="ivz-cell">' + esc(t) + '</div>';
        }).join('') + '</div></div>';
    },

    /* A spectrum with labelled stops. `on` marks the one that matters. */
    scale: function (v) {
      var stops = v.stops || [], on = typeof v.on === 'number' ? v.on : -1;
      return '<div class="ivz ivz-scale">' +
        '<div class="ivz-ends"><span>' + esc(v.lo) + '</span><span>' + esc(v.hi) + '</span></div>' +
        '<ol class="ivz-stops">' + stops.map(function (s, i) {
          return '<li' + (i === on ? ' class="is-on"' : '') + '><i aria-hidden="true"></i>' +
            '<span>' + esc(s) + '</span></li>';
        }).join('') + '</ol></div>';
    },

    /* A centre with its parts around it. */
    parts: function (v) {
      var around = (v.around || []).map(function (t) {
        return '<li>' + esc(t) + '</li>';
      }).join('');
      return '<div class="ivz ivz-parts">' +
        '<div class="ivz-centre">' + esc(v.centre) + '</div>' +
        '<ul class="ivz-around">' + around + '</ul></div>';
    },

    /* A root question with branches, each holding its own leaves. */
    tree: function (v) {
      var br = (v.branches || []).map(function (b) {
        var items = (b.items || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
        return '<div class="ivz-branch"><span class="ivz-branch-k">' + esc(b.k) + '</span>' +
          (items ? '<ul>' + items + '</ul>' : '') + '</div>';
      }).join('');
      return '<div class="ivz ivz-tree">' +
        '<div class="ivz-root">' + esc(v.root) + '</div>' +
        '<div class="ivz-branches">' + br + '</div></div>';
    },

    /* Two curves on shared axes. The shape is the point, so this one is SVG.
       Every label sits outside the plot box, which is why nothing can collide
       with a curve or with another label. */
    curve: function (v) {
      var PATHS = {
        /* Training error falls; test error falls then climbs. */
        u: ['M34 22 C70 78 120 104 266 110', 'M34 34 C90 96 150 96 266 30'],
        /* Both fall, one keeps going. */
        diverge: ['M34 20 C90 74 150 84 266 86', 'M34 26 C96 78 160 100 266 108'],
        /* The diagonal, and a line that sags below it. */
        diag: ['M34 112 L266 20', 'M34 112 C110 100 180 84 266 62'],
        /* Both climb, one stays lower. */
        rise: ['M34 112 C110 104 180 88 266 34', 'M34 112 C110 84 180 52 266 20']
      };
      var p = PATHS[v.shape] || PATHS.u;
      return '<div class="ivz ivz-curve">' +
        /* No preserveAspectRatio override here on purpose: stretching the box
           to the column width flattens every curve into a near-straight line,
           which is the one thing this archetype exists to show. */
        '<svg viewBox="0 0 300 132" role="img" aria-hidden="true">' +
        '<line class="ivz-axis" x1="30" y1="118" x2="278" y2="118"/>' +
        '<line class="ivz-axis" x1="30" y1="12" x2="30" y2="118"/>' +
        '<path class="ivz-line ivz-line-a" d="' + p[0] + '"/>' +
        '<path class="ivz-line ivz-line-b" d="' + p[1] + '"/>' +
        '</svg>' +
        '<span class="ivz-ax-y">' + esc(v.y) + '</span>' +
        '<span class="ivz-ax-x">' + esc(v.x) + '</span>' +
        '<ul class="ivz-key">' +
        '<li class="is-a">' + esc(v.a) + '</li>' +
        '<li class="is-b">' + esc(v.b) + '</li>' +
        '</ul></div>';
    }
  };

  function diagram(viz) {
    if (!viz || !BUILD[viz.type]) return '';
    return BUILD[viz.type](viz);
  }

  /* Render one diagram into the slot each module already left for it. */
  function diagrams(d) {
    $$('.syl-module').forEach(function (el) {
      var slot = $('.syl-viz', el);
      var i = +el.getAttribute('data-i');
      if (!slot || !d.modules[i]) return;
      slot.innerHTML = diagram(d.modules[i].viz);
    });
  }

  /* ════════════════════════════════════════════════════════
     Revision progress

     One key per topic holding the module indexes marked done.
     The ring on the page and the ring on each hub card read the
     same key, so the hub is always current without extra state.
     ════════════════════════════════════════════════════════ */

  function doneSet(topic) {
    var a = load('done:' + topic, []);
    return Array.isArray(a) ? a : [];
  }

  function ring(el, done, total) {
    var pct = total ? done / total : 0;
    var C = 2 * Math.PI * 15;
    el.innerHTML =
      '<svg viewBox="0 0 36 36" role="img" aria-hidden="true">' +
      '<circle class="iv-ring-track" cx="18" cy="18" r="15"/>' +
      '<circle class="iv-ring-fill" cx="18" cy="18" r="15" ' +
      'stroke-dasharray="' + C.toFixed(1) + '" ' +
      'stroke-dashoffset="' + (C * (1 - pct)).toFixed(1) + '"/>' +
      '</svg><b>' + done + '<span>/' + total + '</span></b>';
    el.setAttribute('aria-label', done + ' of ' + total + ' modules marked revised');
  }

  function progress(d) {
    var mounts = $$('.syl-module');
    if (!mounts.length) return;
    var total = mounts.length;
    var ringEl = $('#iv-ring');

    function paint() {
      var done = doneSet(d.id);
      mounts.forEach(function (el) {
        var i = +el.getAttribute('data-i');
        var on = done.indexOf(i) > -1;
        el.classList.toggle('is-done', on);
        var btn = $('.syl-done', el);
        if (btn) {
          btn.setAttribute('aria-pressed', on ? 'true' : 'false');
          $('span', btn).textContent = on ? 'Revised' : 'Mark revised';
        }
        var t = $('.syl-toc-item[href="#m' + (i + 1) + '"]');
        if (t) t.classList.toggle('is-done', on);
      });
      if (ringEl) ring(ringEl, done.length, total);
    }

    mounts.forEach(function (el) {
      var btn = $('.syl-done', el);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var i = +el.getAttribute('data-i');
        var done = doneSet(d.id);
        var at = done.indexOf(i);
        if (at > -1) done.splice(at, 1); else done.push(i);
        save('done:' + d.id, done);
        paint();
      });
    });

    var reset = $('#iv-reset');
    if (reset) reset.addEventListener('click', function () {
      save('done:' + d.id, []);
      paint();
    });

    paint();
  }

  /* ════════════════════════════════════════════════════════
     Flashcards

     The `check` questions, one at a time, hidden answer side.
     There is no stored answer to reveal, so the back of the card
     is the module it came from and its covers list.
     ════════════════════════════════════════════════════════ */

  function cards(d) {
    var mount = $('#iv-cards');
    if (!mount || !d.modules.length) return;
    var order = d.modules.map(function (_, i) { return i; });
    var at = 0, flipped = false;

    function paint() {
      var m = d.modules[order[at]];
      mount.innerHTML =
        '<div class="ivc-card' + (flipped ? ' is-flipped' : '') + '">' +
        '<div class="ivc-face ivc-front">' +
        '<span class="ivc-kicker">Question ' + (at + 1) + ' of ' + order.length + '</span>' +
        '<p class="ivc-q">' + esc(m.check) + '</p>' +
        '<span class="ivc-hint">Click to see what it is testing</span>' +
        '</div>' +
        '<div class="ivc-face ivc-back">' +
        '<span class="ivc-kicker">' + esc(m.name) + '</span>' +
        '<ul class="ivc-covers">' + (m.covers || []).map(function (c) {
          return '<li>' + esc(c) + '</li>';
        }).join('') + '</ul>' +
        '<a class="ivc-jump" href="#m' + (order[at] + 1) + '">Go to the module</a>' +
        '</div></div>';
    }

    mount.addEventListener('click', function (e) {
      if (e.target.closest('.ivc-jump')) { flipped = false; return; }
      flipped = !flipped;
      paint();
    });

    var prev = $('#iv-card-prev'), next = $('#iv-card-next'), shuf = $('#iv-card-shuffle');
    if (prev) prev.addEventListener('click', function () {
      at = (at - 1 + order.length) % order.length; flipped = false; paint();
    });
    if (next) next.addEventListener('click', function () {
      at = (at + 1) % order.length; flipped = false; paint();
    });
    if (shuf) shuf.addEventListener('click', function () {
      for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = order[i]; order[i] = order[j]; order[j] = t;
      }
      at = 0; flipped = false; paint();
    });

    paint();
  }

  /* ════════════════════════════════════════════════════════
     Hub map

     The cards lay themselves out with CSS grid. Edges are drawn
     afterwards from the boxes the browser actually produced, so
     the map survives any reflow, any font and any column count.
     ════════════════════════════════════════════════════════ */

  function hubMap() {
    var wrap = $('#iv-map');
    if (!wrap) return;
    var svg = $('.iv-map-svg', wrap);
    var cards = $$('.ivh-card', wrap);
    if (!svg || !cards.length) return;

    var byId = {};
    cards.forEach(function (c) { byId[c.getAttribute('data-topic')] = c; });

    function draw() {
      var box = wrap.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + Math.round(box.width) + ' ' + Math.round(box.height));
      var seen = {}, paths = [];

      cards.forEach(function (c) {
        var from = c.getAttribute('data-topic');
        var links = (c.getAttribute('data-links') || '').split(' ').filter(Boolean);
        links.forEach(function (to) {
          var pair = [from, to].sort().join('~');
          if (seen[pair] || !byId[to]) return;
          seen[pair] = 1;

          var a = c.getBoundingClientRect(), b = byId[to].getBoundingClientRect();
          var ax = a.left - box.left + a.width / 2, ay = a.top - box.top + a.height / 2;
          var bx = b.left - box.left + b.width / 2, by = b.top - box.top + b.height / 2;
          // Bow the curve sideways so two edges between the same rows stay apart.
          var mx = (ax + bx) / 2, my = (ay + by) / 2;
          var dx = bx - ax, dy = by - ay;
          var len = Math.sqrt(dx * dx + dy * dy) || 1;
          var bow = Math.min(46, len * 0.16);
          var cx = mx - (dy / len) * bow, cy = my + (dx / len) * bow;
          paths.push('<path d="M' + ax.toFixed(0) + ' ' + ay.toFixed(0) +
            ' Q' + cx.toFixed(0) + ' ' + cy.toFixed(0) + ' ' + bx.toFixed(0) + ' ' + by.toFixed(0) + '"/>');
        });
      });

      svg.innerHTML = paths.join('');
    }

    draw();
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(draw, 120);
    });

    // Light up a card's own edges on hover.
    cards.forEach(function (c) {
      c.addEventListener('mouseenter', function () {
        var links = (c.getAttribute('data-links') || '').split(' ').filter(Boolean);
        wrap.classList.add('is-focused');
        c.classList.add('is-lit');
        links.forEach(function (id) { if (byId[id]) byId[id].classList.add('is-lit'); });
      });
      c.addEventListener('mouseleave', function () {
        wrap.classList.remove('is-focused');
        cards.forEach(function (x) { x.classList.remove('is-lit'); });
      });
    });
  }

  /* Progress rings on the hub cards, read from the same store. */
  function hubProgress() {
    $$('.ivh-card').forEach(function (c) {
      var el = $('.iv-ring', c);
      if (!el) return;
      var total = +c.getAttribute('data-modules') || 0;
      ring(el, Math.min(doneSet(c.getAttribute('data-topic')).length, total), total);
    });
  }

  function init() {
    var d = data();
    if (d) { diagrams(d); progress(d); cards(d); }
    hubMap();
    hubProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
