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
        /* The diagonal, and a line that sags below it. Drawn inside a square
           box so the first path really is at forty-five degrees. */
        diag: ['M32 116 L136 12', 'M32 116 C64 108 96 88 136 12'],
        /* Both climb, one stays lower. */
        rise: ['M34 112 C110 104 180 88 266 34', 'M34 112 C110 84 180 52 266 20']
      };
      var p = PATHS[v.shape] || PATHS.u;
      /* A reliability diagram has to be square, or the line the reader is told
         to look for is not at forty-five degrees and the picture contradicts
         the words. Every other shape reads fine in a wide box. */
      var square = v.shape === 'diag';
      return '<div class="ivz ivz-curve' + (square ? ' is-square' : '') + '">' +
        /* No preserveAspectRatio override here on purpose: stretching the box
           to the column width flattens every curve into a near-straight line,
           which is the one thing this archetype exists to show. */
        '<svg viewBox="0 0 ' + (square ? '150 132' : '300 132') + '" role="img" aria-hidden="true">' +
        '<line class="ivz-axis" x1="30" y1="118" x2="' + (square ? 140 : 278) + '" y2="118"/>' +
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

  /* ════════════════════════════════════════════════════════
     Scenes: concrete illustrations

     The eight archetypes above are abstract. Boxes and arrows show
     the *shape* of an idea. A scene shows the thing itself: real
     tokens being cut, a kernel sliding over pixels, a cache growing
     one row per token.

     Each scene below is specified before it is drawn, using the
     five-part discipline from the image-generation skill:

       type        what kind of picture it is
       subject     what is actually depicted
       environment where the parts sit relative to each other
       technical   the geometry that makes it accurate
       constraints what must never appear

     The output is SVG built from those notes rather than a generated
     raster. That keeps it theme-aware, resizable with the reading
     controls, selectable by a screen reader, and correctable when a
     detail is wrong. A picture in a study aid has to be right.
     ════════════════════════════════════════════════════════ */

  var SCENE = {

    /* type: side-by-side comparison of one sentence cut two ways
       subject: the same words, cheap in one language, expensive in another
       environment: two stacked rows, each a run of token chips
       technical: chip width follows text length, so the cost difference is
                  visible as total row width rather than stated as a number
       constraints: no counts, no percentages, no language ranking */
    tokens: function (v) {
      var row = function (r) {
        return '<div class="ivs-tokrow"><span class="ivs-tokk">' + esc(r.k) + '</span>' +
          '<span class="ivs-toks">' + (r.parts || []).map(function (t) {
            return '<i>' + esc(t) + '</i>';
          }).join('') + '</span></div>';
      };
      return '<div class="ivs ivs-tokens">' + (v.rows || []).map(row).join('') + '</div>';
    },

    /* type: pixel grid with a kernel window on it
       subject: a convolution reading one patch at a time
       environment: kernel sits over the top-left of the grid, arrow to output
       technical: grid squares are uniform; the kernel outlines exactly n by n
                  squares so the receptive-field claim is literally true
       constraints: no stride numbers, no channel depth, nothing coloured */
    kernel: function (v) {
      var n = v.grid || 6, k = v.k || 3, cells = '';
      for (var y = 0; y < n; y++) {
        for (var x = 0; x < n; x++) {
          cells += '<rect class="ivs-px" x="' + (x * 14 + 2) + '" y="' + (y * 14 + 2) +
            '" width="12" height="12" rx="1.5"/>';
        }
      }
      var kw = k * 14;
      return '<div class="ivs ivs-kernel">' +
        '<svg viewBox="0 0 ' + (n * 14 + 4) + ' ' + (n * 14 + 4) + '" role="img" aria-hidden="true">' +
        cells + '<rect class="ivs-win" x="1" y="1" width="' + kw + '" height="' + kw + '" rx="2"/></svg>' +
        '<span class="ivs-arrow" aria-hidden="true">&rarr;</span>' +
        '<svg viewBox="0 0 18 18" class="ivs-out" role="img" aria-hidden="true">' +
        '<rect class="ivs-px is-on" x="2" y="2" width="14" height="14" rx="2"/></svg>' +
        '<span class="ivs-cap">' + esc(v.cap || '') + '</span></div>';
    },

    /* type: stacked bars that grow left to right
       subject: the key-value cache adding one row per generated token
       environment: four snapshots in a row, each taller than the last
       technical: bar count rises by one each snapshot, so growth is linear
                  and visibly unbounded, which is the serving problem
       constraints: no megabyte figures, no model names */
    growing: function (v) {
      var steps = v.steps || 4, out = '';
      for (var i = 1; i <= steps; i++) {
        var rows = '';
        for (var r = 0; r < i; r++) {
          rows += '<span class="ivs-cell"></span>';
        }
        out += '<div class="ivs-col"><div class="ivs-stackcol">' + rows + '</div>' +
          '<span class="ivs-tick">' + (v.tick || 'token') + ' ' + i + '</span></div>';
      }
      return '<div class="ivs ivs-growing">' + out +
        '<span class="ivs-cap">' + esc(v.cap || '') + '</span></div>';
    },

    /* type: one horizontal bar cut into labelled parts
       subject: a dataset split, with the leak drawn crossing the boundary
       environment: parts sized by share; the leak arrow spans two parts
       technical: the leak arrow starts inside test and points into train,
                  which is the direction information actually travels
       constraints: no percentages on the parts */
    split: function (v) {
      var parts = v.parts || [];
      var total = parts.reduce(function (a, p) { return a + (p.w || 1); }, 0);
      return '<div class="ivs ivs-split">' +
        '<div class="ivs-bar">' + parts.map(function (p) {
          return '<span class="ivs-seg' + (p.on ? ' is-on' : '') +
            '" style="flex:' + (p.w || 1) / total + '">' + esc(p.k) + '</span>';
        }).join('') + '</div>' +
        (v.leak ? '<span class="ivs-leak">' + esc(v.leak) + '</span>' : '') +
        '</div>';
    },

    /* type: two bell shapes on one axis, one inside the other
       subject: a belief narrowing as data arrives
       environment: wide shape behind, narrow shape in front, shared baseline
       technical: both curves are symmetric about the same centre, so the only
                  visible difference is width, which is the whole point
       constraints: no axis numbers, no parameter names */
    narrowing: function (v) {
      return '<div class="ivs ivs-narrowing">' +
        '<svg viewBox="0 0 260 96" role="img" aria-hidden="true">' +
        '<line class="ivs-axis" x1="8" y1="86" x2="252" y2="86"/>' +
        '<path class="ivs-wide" d="M12 86C60 86 48 30 130 30C212 30 200 86 248 86"/>' +
        '<path class="ivs-narrow" d="M78 86C112 86 108 12 130 12C152 12 148 86 182 86"/>' +
        '</svg>' +
        '<ul class="ivs-key"><li class="is-a">' + esc(v.before) + '</li>' +
        '<li class="is-b">' + esc(v.after) + '</li></ul></div>';
    },

    /* type: grid of slots with more labels than slots
       subject: superposition, where concepts outnumber neurons
       environment: a row of slots, with labels stacked two deep on some
       technical: label count strictly exceeds slot count, so the crowding is
                  a fact of the drawing rather than a caption
       constraints: no neuron indices, no layer names */
    crowded: function (v) {
      var slots = v.slots || 5;
      var labels = v.labels || [];
      var out = '';
      for (var i = 0; i < slots; i++) {
        var mine = labels.filter(function (_, j) { return j % slots === i; });
        out += '<div class="ivs-slot"><span class="ivs-neuron"></span>' +
          mine.map(function (t) { return '<i>' + esc(t) + '</i>'; }).join('') + '</div>';
      }
      return '<div class="ivs ivs-crowded">' + out +
        '<span class="ivs-cap">' + esc(v.cap || '') + '</span></div>';
    },

    /* type: three answer sets of increasing size
       subject: a prediction set widening as the model grows less certain
       environment: left to right, easy case to hard case
       technical: set size is the number of chips shown, so "wider set" is
                  something the reader counts rather than reads
       constraints: no confidence levels printed as numbers */
    sets: function (v) {
      return '<div class="ivs ivs-sets">' + (v.cases || []).map(function (c) {
        return '<div class="ivs-case"><span class="ivs-casek">' + esc(c.k) + '</span>' +
          '<span class="ivs-chips">' + (c.set || []).map(function (t) {
            return '<i>' + esc(t) + '</i>';
          }).join('') + '</span></div>';
      }).join('') + '</div>';
    },

    /* type: a funnel with a side exit
       subject: abstention, where low-confidence cases leave the pipeline
       environment: inflow at the top, answered out the bottom, deferred aside
       technical: the two outflows are drawn to different destinations, which
                  is the design decision the module is about
       constraints: no rates, no thresholds as numbers */
    defer: function (v) {
      return '<div class="ivs ivs-defer">' +
        '<div class="ivs-in">' + esc(v.inflow) + '</div>' +
        '<div class="ivs-fork"><span class="ivs-out-a">' + esc(v.answer) + '</span>' +
        '<span class="ivs-out-b">' + esc(v.aside) + '</span></div></div>';
    }
  };

  function diagram(viz) {
    if (!viz) return '';
    if (viz.type === 'scene') {
      var kind = SCENE[viz.kind];
      return kind ? kind(viz) : '';
    }
    return BUILD[viz.type] ? BUILD[viz.type](viz) : '';
  }

  /* A module may carry a scene alongside its diagram. The scene comes first,
     because a concrete picture is the easier way in. */
  function sceneFor(m) {
    return m.scene ? diagram({ type: 'scene', kind: m.scene.kind, ...m.scene }) : '';
  }

  /* Render one diagram into the slot each module already left for it. */
  function diagrams(d) {
    $$('.syl-module').forEach(function (el) {
      var slot = $('.syl-viz', el);
      var i = +el.getAttribute('data-i');
      if (!slot || !d.modules[i]) return;
      slot.innerHTML = sceneFor(d.modules[i]) + diagram(d.modules[i].viz);
      var viz = $('.ivz', slot);
      if (viz) animate(viz);
    });
  }

  /* ════════════════════════════════════════════════════════
     Diagram animation and walk-through

     Two things happen to every diagram after it is built.

     First it is marked up for a staged reveal: each part gets a
     `data-step` and an index, so CSS can bring them in one at a time
     when the diagram scrolls into view. Seeing a flow arrive in order
     carries the sequence better than seeing it already finished.

     Second, any diagram with three or more parts gets a "walk it"
     control. That turns the picture into something the reader drives,
     which is the difference between reading a diagram and using one.

     Both degrade cleanly. With JavaScript off the diagram renders
     complete and static, and `prefers-reduced-motion` disables the
     reveal while keeping the walk-through.
     ════════════════════════════════════════════════════════ */

  /* Which children of each archetype are the meaningful parts. Order here
     is reading order, which is what the reveal follows. */
  var PARTS = {
    'ivz-flow': '.ivz-step',
    'ivz-compare': '.ivz-col',
    'ivz-stack': 'li',
    'ivz-matrix': '.ivz-cell',
    'ivz-scale': '.ivz-stops li',
    'ivz-parts': '.ivz-centre, .ivz-around li',
    'ivz-tree': '.ivz-root, .ivz-branch',
    'ivz-curve': '.ivz-key li'
  };

  function partsOf(viz) {
    for (var cls in PARTS) {
      if (viz.classList.contains(cls)) return $$(PARTS[cls], viz);
    }
    return [];
  }

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(viz) {
    var parts = partsOf(viz);
    if (!parts.length) return;

    parts.forEach(function (p, i) {
      p.setAttribute('data-step', i);
      p.style.setProperty('--step', i);
    });

    /* A curve draws along its own length, so each path needs to know how
       long it is before CSS can dash it. */
    $$('.ivz-line', viz).forEach(function (path) {
      try { path.style.setProperty('--len', path.getTotalLength().toFixed(1)); }
      catch (e) {}
    });

    viz.classList.add('is-anim');

    if (reduced || !('IntersectionObserver' in window)) {
      viz.classList.add('is-playing');
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-playing');
          io.unobserve(e.target);
        });
      }, { threshold: 0.25 });
      io.observe(viz);
    }

    if (parts.length >= 3) walkable(viz, parts);
  }

  /* Step through the parts one at a time, dimming the rest. */
  function walkable(viz, parts) {
    var at = -1;
    var bar = document.createElement('div');
    bar.className = 'ivz-walk';
    bar.innerHTML =
      '<button type="button" data-go="start">' +
      '<svg class="ivi" viewBox="0 0 24 24" aria-hidden="true"><use href="#ivi-arrow-right"/></svg>Walk it</button>' +
      '<button type="button" data-go="prev" hidden aria-label="Previous part">' +
      '<svg class="ivi" viewBox="0 0 24 24" aria-hidden="true"><use href="#ivi-arrow-left"/></svg></button>' +
      '<button type="button" data-go="next" hidden aria-label="Next part">' +
      '<svg class="ivi" viewBox="0 0 24 24" aria-hidden="true"><use href="#ivi-arrow-right"/></svg></button>' +
      '<button type="button" data-go="stop" hidden>Show all</button>' +
      '<span class="ivz-walk-at" role="status"></span>';
    viz.appendChild(bar);

    var btn = {};
    $$('button', bar).forEach(function (b) { btn[b.getAttribute('data-go')] = b; });
    var at_label = $('.ivz-walk-at', bar);

    function paint() {
      var on = at >= 0;
      viz.classList.toggle('is-walking', on);
      parts.forEach(function (p, i) { p.classList.toggle('is-at', on && i === at); });
      btn.start.hidden = on;
      btn.prev.hidden = !on;
      btn.next.hidden = !on;
      btn.stop.hidden = !on;
      btn.prev.disabled = at <= 0;
      at_label.textContent = on ? 'Part ' + (at + 1) + ' of ' + parts.length : '';
      if (on && at === parts.length - 1) btn.next.textContent = '';
    }

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var go = b.getAttribute('data-go');
      if (go === 'start') at = 0;
      else if (go === 'next') at = Math.min(at + 1, parts.length - 1);
      else if (go === 'prev') at = Math.max(at - 1, 0);
      else at = -1;
      paint();
    });

    paint();
  }

  /* ════════════════════════════════════════════════════════
     Reading controls

     Writes the --rd-* tokens onto the page section. Four settings,
     each one a known lever for dyslexic reading: text size, line
     spacing, letter spacing, and whether labels are shouted in
     capitals. Plus a page tint, since full contrast is tiring for
     some readers. Saved under iv:read.
     ════════════════════════════════════════════════════════ */

  var RD_DEFAULT = { scale: 1, lead: 1.6, track: 0, caps: 1, tint: 'none' };

  function readingControls() {
    var page = $('.syl-page') || $('.interview-hub');
    if (!page) return;

    var rd = load('read', {});
    Object.keys(RD_DEFAULT).forEach(function (k) {
      if (typeof rd[k] === 'undefined') rd[k] = RD_DEFAULT[k];
    });

    function apply() {
      page.style.setProperty('--rd-scale', rd.scale);
      page.style.setProperty('--rd-lead', rd.lead);
      page.style.setProperty('--rd-track', rd.track + 'em');
      page.style.setProperty('--rd-caps', rd.caps ? 'uppercase' : 'none');
      page.style.setProperty('--rd-caps-track', rd.caps ? '0.12em' : (rd.track + 0.01) + 'em');
      if (rd.tint === 'none') document.documentElement.removeAttribute('data-reading-tint');
      else document.documentElement.setAttribute('data-reading-tint', rd.tint);
      save('read', rd);
    }

    var open = document.createElement('button');
    open.type = 'button';
    open.className = 'rd-open';
    open.setAttribute('aria-expanded', 'false');
    open.innerHTML = '<svg class="ivi" viewBox="0 0 24 24" aria-hidden="true">' +
      '<use href="#ivi-layers"/></svg>Reading';

    var panel = document.createElement('section');
    panel.className = 'rd-panel';
    panel.hidden = true;
    panel.setAttribute('aria-label', 'Reading settings');
    panel.innerHTML =
      '<h2>Reading</h2>' +
      '<p>Set this page up so it is comfortable to read. Your choices are remembered.</p>' +
      '<div class="rd-row"><label for="rd-scale">Text size</label>' +
      '<input type="range" id="rd-scale" min="0.9" max="1.6" step="0.05"></div>' +
      '<div class="rd-row"><label for="rd-lead">Space between lines</label>' +
      '<input type="range" id="rd-lead" min="1.5" max="2.4" step="0.05"></div>' +
      '<div class="rd-row"><label for="rd-track">Space between letters</label>' +
      '<input type="range" id="rd-track" min="0" max="0.12" step="0.01"></div>' +
      '<div class="rd-row"><label>Small headings</label>' +
      '<div class="rd-seg" data-set="caps">' +
      '<button type="button" data-v="1">CAPITALS</button>' +
      '<button type="button" data-v="0">Normal case</button></div></div>' +
      '<div class="rd-row"><label>Page colour</label>' +
      '<div class="rd-seg" data-set="tint">' +
      '<button type="button" data-v="none">Default</button>' +
      '<button type="button" data-v="warm">Warm</button>' +
      '<button type="button" data-v="cool">Cool</button></div></div>' +
      '<div class="rd-actions"><button type="button" data-act="reset">Reset</button>' +
      '<button type="button" data-act="close">Done</button></div>';

    document.body.appendChild(open);
    document.body.appendChild(panel);

    var slider = {
      scale: $('#rd-scale', panel),
      lead: $('#rd-lead', panel),
      track: $('#rd-track', panel)
    };

    function sync() {
      Object.keys(slider).forEach(function (k) { slider[k].value = rd[k]; });
      $$('.rd-seg', panel).forEach(function (seg) {
        var key = seg.getAttribute('data-set');
        $$('button', seg).forEach(function (b) {
          b.setAttribute('aria-pressed', String(rd[key]) === b.getAttribute('data-v') ? 'true' : 'false');
        });
      });
    }

    Object.keys(slider).forEach(function (k) {
      slider[k].addEventListener('input', function () {
        rd[k] = parseFloat(this.value);
        apply();
      });
    });

    panel.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var seg = b.closest('.rd-seg');
      if (seg) {
        var key = seg.getAttribute('data-set');
        var v = b.getAttribute('data-v');
        rd[key] = key === 'tint' ? v : +v;
        apply(); sync();
        return;
      }
      var act = b.getAttribute('data-act');
      if (act === 'reset') { rd = Object.assign({}, RD_DEFAULT); apply(); sync(); }
      if (act === 'close') { panel.hidden = true; open.setAttribute('aria-expanded', 'false'); open.focus(); }
    });

    open.addEventListener('click', function () {
      panel.hidden = !panel.hidden;
      open.setAttribute('aria-expanded', panel.hidden ? 'false' : 'true');
      if (!panel.hidden) slider.scale.focus();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        panel.hidden = true;
        open.setAttribute('aria-expanded', 'false');
      }
    });

    apply();
    sync();
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
    readingControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
