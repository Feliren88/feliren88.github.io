/**
 * Interview revision: /interview/ and the twenty-six syllabus pages.
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
  function drop(k) { try { localStorage.removeItem(STORE + k); } catch (e) {} }
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

    /* type: one ball taking four steps down one loss curve
       subject: gradient descent as repeated local moves
       environment: a wide valley, with positions ordered left to right
       technical: every position lies on the same curve and moves downhill
       constraints: no second optimiser, no formula, no local-minimum claim */
    descent: function (v) {
      return '<div class="ivs ivs-descent">' +
        '<svg viewBox="0 0 320 126" role="img" aria-hidden="true">' +
        '<path class="ivs-loss" d="M14 20C68 32 79 103 170 104C246 105 269 48 306 18"/>' +
        '<path class="ivs-step" d="M56 50L91 78M104 85L137 99M151 102L178 104"/>' +
        '<path class="ivs-arrowhead" d="M91 78l-9-2 5-7zM137 99l-9-1 4-8zM178 104l-8 3 1-9z"/>' +
        '<circle class="ivs-ball is-past" cx="50" cy="46" r="6"/>' +
        '<circle class="ivs-ball is-past" cx="98" cy="82" r="6"/>' +
        '<circle class="ivs-ball is-past" cx="144" cy="101" r="6"/>' +
        '<circle class="ivs-ball" cx="185" cy="104" r="7"/>' +
        '</svg><span class="ivs-cap">' + esc(v.cap || '') + '</span></div>';
    },

    /* type: a batch-by-feature table with one row and one column marked
       subject: the different axes used by batch norm and layer norm
       environment: two copies of the same activation table
       technical: batch norm marks one feature across examples; layer norm
                  marks all features inside one example
       constraints: no claim about which method is better */
    normaxis: function (v) {
      var grid = function (kind, label) {
        var cells = '';
        for (var y = 0; y < 4; y++) {
          for (var x = 0; x < 5; x++) {
            var on = kind === 'batch' ? x === 2 : y === 1;
            cells += '<i' + (on ? ' class="is-on"' : '') + '></i>';
          }
        }
        return '<div class="ivs-normcase"><span>' + esc(label) + '</span>' +
          '<div class="ivs-normgrid">' + cells + '</div></div>';
      };
      return '<div class="ivs ivs-normaxis">' +
        grid('batch', v.batch || 'Batch norm') +
        grid('layer', v.layer || 'Layer norm') + '</div>';
    },

    /* type: the same observations with a smooth and a memorised path
       subject: fitting the pattern versus fitting every training point
       environment: two small plots sharing the same observations
       technical: both paths touch the data; only one keeps a smooth shape
       constraints: no accuracy values and no claim that smooth always wins */
    fitpaths: function (v) {
      var dots = '<circle cx="24" cy="54" r="3"/><circle cx="47" cy="39" r="3"/>' +
        '<circle cx="72" cy="45" r="3"/><circle cx="96" cy="22" r="3"/>' +
        '<circle cx="119" cy="29" r="3"/>';
      return '<div class="ivs ivs-fitpaths">' +
        '<div><svg viewBox="0 0 140 72" role="img" aria-hidden="true">' + dots +
        '<path class="ivs-fit-good" d="M14 58C44 47 74 39 128 23"/></svg>' +
        '<span>' + esc(v.pattern || 'Learns the pattern') + '</span></div>' +
        '<div><svg viewBox="0 0 140 72" role="img" aria-hidden="true">' + dots +
        '<path class="ivs-fit-hard" d="M14 61C26 49 29 58 47 39S61 53 72 45S84 23 96 22S108 38 119 29S127 25 132 20"/></svg>' +
        '<span>' + esc(v.memory || 'Learns every point') + '</span></div></div>';
    },

    /* type: a forward chain whose middle states occupy memory
       subject: activation checkpointing trading memory for recomputation
       environment: forward blocks above, backward arrow below
       technical: discarded states use dashed outlines and point back to the
                  exact block that must be run again
       constraints: no byte estimate, no hardware-specific claim */
    checkpoint: function (v) {
      var labels = v.blocks || ['Input', 'Layer 1', 'Layer 2', 'Loss'];
      return '<div class="ivs ivs-checkpoint"><div class="ivs-checkrow">' +
        labels.map(function (t, i) {
          return '<span' + (i === 1 || i === 2 ? ' class="is-drop"' : '') + '>' + esc(t) + '</span>';
        }).join('<b aria-hidden="true">&rarr;</b>') +
        '</div><div class="ivs-checkback"><span>&larr; ' + esc(v.back || 'Backward pass') +
        '</span><i>' + esc(v.cap || 'Recompute discarded activations') + '</i></div></div>';
    },

    /* type: three literal input shapes
       subject: architecture choice following the structure of the input
       environment: a grid, an ordered row and a connected graph
       technical: each object exposes only the relation its model can reuse
       constraints: no model ranking and no exhaustive taxonomy */
    inputshape: function (v) {
      var pixels = new Array(17).join('<i></i>');
      return '<div class="ivs ivs-inputshape">' +
        '<div><span class="ivs-pixelmini">' + pixels + '</span><b>' + esc(v.grid || 'Grid') + '</b></div>' +
        '<div><span class="ivs-seqmini"><i></i><i></i><i></i><i></i></span><b>' + esc(v.sequence || 'Sequence') + '</b></div>' +
        '<div><svg viewBox="0 0 72 52" role="img" aria-hidden="true"><path d="M12 38L31 13L58 21L51 43L12 38M31 13L51 43"/><circle cx="12" cy="38" r="5"/><circle cx="31" cy="13" r="5"/><circle cx="58" cy="21" r="5"/><circle cx="51" cy="43" r="5"/></svg><b>' + esc(v.graph || 'Graph') + '</b></div></div>';
    },

    /* type: identical model copies fed different data shards
       subject: data parallel training
       environment: one data row above four matching devices
       technical: every device holds the same model mark; each gets one shard
       constraints: no device count recommendation and no speed-up claim */
    replicas: function (v) {
      var devices = '';
      for (var i = 0; i < 4; i++) {
        devices += '<div><i class="ivs-shard"></i><span class="ivs-device">M</span></div>';
      }
      return '<div class="ivs ivs-replicas"><div class="ivs-replicarow">' + devices + '</div>' +
        '<span class="ivs-cap">' + esc(v.cap || '') + '</span></div>';
    },

    /* type: a pipeline inspected from its first stage onward
       subject: finding the earliest point where a training run becomes wrong
       environment: four stages left to right, with one marked as the failure
       technical: later stages are dimmed because their output is downstream
       constraints: no claim that every failure starts in the data */
    trace: function (v) {
      var steps = v.steps || ['Batch', 'Loss', 'Gradients', 'Update'];
      var bad = typeof v.bad === 'number' ? v.bad : 1;
      return '<div class="ivs ivs-trace">' + steps.map(function (t, i) {
        return '<div class="' + (i === bad ? 'is-bad' : i > bad ? 'is-after' : '') + '">' +
          '<i aria-hidden="true"></i><span>' + esc(t) + '</span></div>';
      }).join('') + '</div>';
    },

    /* type: one point dropped onto one line
       subject: projection as the nearest point in a subspace
       environment: source point above, dashed right-angle path, result on line
       technical: the drop is perpendicular to the line
       constraints: no second subspace and no normal-equation derivation */
    projection: function (v) {
      return '<div class="ivs ivs-projection"><svg viewBox="0 0 280 118" role="img" aria-hidden="true">' +
        '<path class="ivs-proj-line" d="M20 96L260 34"/>' +
        '<path class="ivs-proj-drop" d="M124 24L141 65"/>' +
        '<circle class="ivs-proj-source" cx="124" cy="24" r="7"/>' +
        '<circle class="ivs-proj-result" cx="141" cy="65" r="7"/>' +
        '<path class="ivs-proj-angle" d="M136 55l10-4 4 10"/>' +
        '</svg><span class="ivs-cap">' + esc(v.cap || '') + '</span></div>';
    },

    /* type: one query point among near and far neighbours
       subject: similarity becoming distance in an embedding space
       environment: a small two-dimensional field with one marked query
       technical: the near pair is visibly closer than every far point
       constraints: no axes, dimensions or numeric score */
    points: function (v) {
      return '<div class="ivs ivs-points"><svg viewBox="0 0 300 120" role="img" aria-hidden="true">' +
        '<circle class="ivs-point is-query" cx="92" cy="60" r="8"/>' +
        '<circle class="ivs-point is-near" cx="120" cy="48" r="6"/>' +
        '<circle class="ivs-point" cx="226" cy="28" r="5"/>' +
        '<circle class="ivs-point" cx="245" cy="86" r="5"/>' +
        '<circle class="ivs-point" cx="188" cy="96" r="5"/>' +
        '<path class="ivs-near-link" d="M100 57L114 51"/>' +
        '</svg><div class="ivs-pointkey"><span>' + esc(v.query || 'Query') + '</span><span>' +
        esc(v.near || 'Closest meaning') + '</span></div></div>';
    },

    /* type: one model shrinking until it fits a fixed device
       subject: compression as a sequence of smaller representations
       environment: three blocks approaching a dashed device budget
       technical: each block is strictly smaller than the last
       constraints: no compression ratio and no quality claim */
    shrink: function (v) {
      var labels = v.steps || ['Full model', 'Smaller model', 'Fits device'];
      return '<div class="ivs ivs-shrink"><div class="ivs-budget" aria-hidden="true"></div>' +
        labels.map(function (label, i) {
          return '<div class="ivs-shrinkstep" style="--shrink:' + (100 - i * 24) + '%"><i></i><span>' + esc(label) + '</span></div>';
        }).join('') + '<span class="ivs-cap">' + esc(v.cap || '') + '</span></div>';
    },

    /* type: four pixel grids moving from static to a simple shape
       subject: diffusion sampling as repeated partial denoising
       environment: grids ordered left to right
       technical: random pixels decrease while one coherent shape emerges
       constraints: no prompt, sampler or latent-space claim */
    denoise: function (v) {
      var patterns = [
        [1,0,1,1,0,1,0,1,1,0,1,0,0,1,1,0],
        [0,0,1,0,0,1,1,1,1,1,0,0,0,1,0,0],
        [0,0,1,0,0,1,1,0,0,1,1,0,0,0,1,0],
        [0,0,1,0,0,1,1,0,0,1,1,0,0,0,1,0]
      ];
      return '<div class="ivs ivs-denoise">' + patterns.map(function (pattern, i) {
        return '<div class="ivs-denoisestep"><span>' + pattern.map(function (on, j) {
          return '<i class="' + (on ? 'is-on' : '') + (i < 2 && j % 3 === 0 ? ' is-noise' : '') + '"></i>';
        }).join('') + '</span><b>' + esc((v.labels || ['Noise', 'Less noise', 'Shape', 'Image'])[i]) + '</b></div>';
      }).join('<em aria-hidden="true">&rarr;</em>') + '</div>';
    },

    /* type: untrusted input crossing one explicit validation boundary
       subject: application security as validate, then encode
       environment: hostile zone, gate, application zone
       technical: all traffic passes through the gate
       constraints: no list of attacks and no claim that validation is enough */
    boundary: function (v) {
      return '<div class="ivs ivs-boundary"><div class="ivs-zone is-untrusted"><span>' +
        esc(v.input || 'Untrusted input') + '</span></div><div class="ivs-gate"><i aria-hidden="true"></i><span>' +
        esc(v.gate || 'Validate and encode') + '</span></div><div class="ivs-zone is-trusted"><span>' +
        esc(v.app || 'Application') + '</span></div></div>';
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
    if (!m.scene) return '';
    var picture = diagram({ type: 'scene', kind: m.scene.kind, ...m.scene });
    if (!picture) return '';
    var label = m.scene.alt || ('Illustration for ' + m.name);
    return picture.replace('<div class="ivs ', '<div role="img" aria-label="' + esc(label) + '" class="ivs ');
  }

  /* Render one diagram into the slot each module already left for it. */
  function diagrams(d) {
    $$('.syl-module').forEach(function (el) {
      var slot = $('.syl-viz', el);
      var sceneSlot = $('.syl-scene', el);
      var i = +el.getAttribute('data-i');
      if (!slot || !d.modules[i]) return;
      if (sceneSlot) sceneSlot.innerHTML = sceneFor(d.modules[i]);
      slot.innerHTML = diagram(d.modules[i].viz);
      var scene = sceneSlot ? $('.ivs', sceneSlot) : null;
      if (scene) animateScene(scene);
      var viz = $('.ivz', slot);
      if (viz) animate(viz, d.modules[i].beats);
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

  /* Concrete scenes use the same four ideas as the track players: a timeline,
     a draw-on path, a short stagger and one viewport trigger. The implementation
     stays native so the pictures remain complete when a motion library or a CDN
     is unavailable. */
  var SCENE_PARTS = {
    'ivs-tokens': '.ivs-tokrow',
    'ivs-kernel': '.ivs-px, .ivs-win, .ivs-arrow, .ivs-out, .ivs-cap',
    'ivs-growing': '.ivs-col, .ivs-cap',
    'ivs-split': '.ivs-seg, .ivs-leak',
    'ivs-narrowing': '.ivs-wide, .ivs-narrow, .ivs-key li',
    'ivs-crowded': '.ivs-slot, .ivs-cap',
    'ivs-sets': '.ivs-case',
    'ivs-defer': '.ivs-in, .ivs-out-a, .ivs-out-b',
    'ivs-descent': '.ivs-loss, .ivs-ball, .ivs-step, .ivs-arrowhead, .ivs-cap',
    'ivs-normaxis': '.ivs-normcase',
    'ivs-fitpaths': ':scope > div',
    'ivs-checkpoint': '.ivs-checkrow span, .ivs-checkback',
    'ivs-inputshape': ':scope > div',
    'ivs-replicas': '.ivs-replicarow > div, .ivs-cap',
    'ivs-trace': ':scope > div',
    'ivs-projection': '.ivs-proj-line, .ivs-proj-source, .ivs-proj-drop, .ivs-proj-result, .ivs-cap',
    'ivs-points': '.ivs-point, .ivs-near-link, .ivs-pointkey',
    'ivs-shrink': '.ivs-shrinkstep, .ivs-cap',
    'ivs-denoise': '.ivs-denoisestep',
    'ivs-boundary': '.ivs-zone, .ivs-gate'
  };

  function animateScene(scene) {
    var selector = '';
    for (var cls in SCENE_PARTS) {
      if (scene.classList.contains(cls)) { selector = SCENE_PARTS[cls]; break; }
    }
    if (!selector) return;
    var parts = $$(selector, scene);
    if (!parts.length || reduced) return;

    parts.forEach(function (part, i) {
      part.setAttribute('data-scene-step', i);
      part.style.setProperty('--scene-step', i);
    });

    /* Draw the explanatory curve before the states on it appear. */
    $$('.ivs-loss, .ivs-wide, .ivs-narrow', scene).forEach(function (path) {
      try { path.style.setProperty('--scene-len', path.getTotalLength().toFixed(1)); }
      catch (e) {}
    });

    scene.classList.add('is-scene-anim');
    if (!('IntersectionObserver' in window)) {
      scene.classList.add('is-scene-playing');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-scene-playing');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    io.observe(scene);
  }

  function animate(viz, beats) {
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

    /* With narration the diagram becomes a player. Without it, the reader
       still gets the plainer step-through. */
    if (beats && beats.length) player(viz, parts, beats);
    else if (parts.length >= 3) walkable(viz, parts);
  }

  /* ════════════════════════════════════════════════════════
     Module player

     Every module's diagram is already a sequence of parts. Given one
     caption per part, it becomes a narrated walkthrough in the same
     shell the track animations use: a numbered step list marking the
     current line, a status caption, play and speed.

     The parts are revealed cumulatively, so beat n shows parts 0..n
     with n highlighted. Scrubbing backwards lands in the same state
     as stepping forwards.
     ════════════════════════════════════════════════════════ */

  var SPEEDS = [4200, 2600, 1700, 1100];

  function player(viz, parts, beats) {
    var n = Math.min(parts.length, beats.length);
    if (n < 2) return;

    var at = 0, timer = null, playing = false, speed = SPEEDS[1];
    var last = n - 1;

    var bar = document.createElement('div');
    bar.className = 'ivp';
    bar.innerHTML =
      '<ol class="ivp-steps">' + beats.map(function (b, i) {
        return '<li><button type="button" class="ivp-step" data-i="' + i + '">' +
          '<span class="ivp-n">' + (i + 1) + '</span>' +
          '<span class="ivp-t">' + esc(b) + '</span></button></li>';
      }).slice(0, n).join('') + '</ol>' +
      '<div class="ivp-ctl">' +
      '<button type="button" class="ivp-play"><svg class="ivi" viewBox="0 0 24 24" aria-hidden="true">' +
      '<use href="#ivi-arrow-right"/></svg><span>Play</span></button>' +
      '<button type="button" class="ivp-prev" aria-label="Previous step">' +
      '<svg class="ivi" viewBox="0 0 24 24" aria-hidden="true"><use href="#ivi-arrow-left"/></svg></button>' +
      '<input class="ivp-scrub" type="range" min="0" max="' + last + '" value="0" aria-label="Step through">' +
      '<button type="button" class="ivp-next" aria-label="Next step">' +
      '<svg class="ivi" viewBox="0 0 24 24" aria-hidden="true"><use href="#ivi-arrow-right"/></svg></button>' +
      '<span class="ivp-count"></span>' +
      '<label class="ivp-speed"><span>Speed</span>' +
      '<input type="range" min="0" max="3" step="1" value="1" aria-label="Playback speed"></label>' +
      '</div>';
    viz.appendChild(bar);

    var stepBtns = $$('.ivp-step', bar);
    var scrub = $('.ivp-scrub', bar);
    var count = $('.ivp-count', bar);
    var playBtn = $('.ivp-play', bar);

    function go(i) {
      at = Math.max(0, Math.min(last, i));
      viz.classList.add('is-walking');
      parts.forEach(function (p, k) {
        p.classList.toggle('is-at', k === at);
        p.classList.toggle('is-seen', k < at);
      });
      stepBtns.forEach(function (b, k) {
        b.classList.toggle('is-at', k === at);
        b.classList.toggle('is-done', k < at);
        b.setAttribute('aria-current', k === at ? 'step' : 'false');
      });
      scrub.value = at;
      count.textContent = (at + 1) + ' / ' + n;
    }

    function stop() {
      playing = false;
      clearTimeout(timer);
      playBtn.classList.remove('is-playing');
      $('span', playBtn).textContent = at >= last ? 'Again' : 'Play';
    }
    function tick() {
      if (at >= last) { stop(); return; }
      go(at + 1);
      timer = setTimeout(tick, speed);
    }
    function play() {
      if (at >= last) go(0);
      playing = true;
      playBtn.classList.add('is-playing');
      $('span', playBtn).textContent = 'Pause';
      timer = setTimeout(tick, Math.min(600, speed));
    }

    playBtn.addEventListener('click', function () { playing ? stop() : play(); });
    $('.ivp-next', bar).addEventListener('click', function () { stop(); go(at + 1); });
    $('.ivp-prev', bar).addEventListener('click', function () { stop(); go(at - 1); });
    scrub.addEventListener('input', function () { stop(); go(+this.value); });
    $('.ivp-speed input', bar).addEventListener('input', function () { speed = SPEEDS[+this.value]; });
    $('.ivp-steps', bar).addEventListener('click', function (e) {
      var b = e.target.closest('.ivp-step');
      if (!b) return;
      stop();
      go(+b.getAttribute('data-i'));
    });

    go(0);
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
      btn.next.disabled = at >= parts.length - 1;
      at_label.textContent = on ? 'Part ' + (at + 1) + ' of ' + parts.length : '';
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

  var RD_DEFAULT = { scale: 1, lead: 1.65, track: 0.01, caps: 0, tint: 'none' };

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

    var readingAnchor = $('.syl-method', page) || $('.ivh-header', page);
    if (readingAnchor) readingAnchor.insertAdjacentElement('afterend', open);
    else page.appendChild(open);
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
     Learning tools

     These controls turn the page structure into a study loop. A short
     timer lowers the cost of starting. Focus mode removes the other
     modules. Read-aloud changes the input channel. The scratchpad keeps
     working memory outside the reader's head. None is required to read
     the page, and every note stays in this browser.
     ════════════════════════════════════════════════════════ */

  function learningTools(d) {
    var page = $('.syl-page');
    if (!page || !d) return;

    var timer = $('#iv-timer');
    if (timer) {
      var timerId = null, endAt = 0, timerKind = 'focus';
      var out = $('output', timer);
      var stop = $('[data-timer-stop]', timer);
      var choices = $$('[data-minutes]', timer);

      function clearTimer(resetButtons) {
        clearInterval(timerId);
        timerId = null;
        stop.hidden = true;
        if (resetButtons) choices.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      }

      function paintTimer() {
        var left = Math.max(0, endAt - Date.now());
        var seconds = Math.ceil(left / 1000);
        var minutes = Math.floor(seconds / 60);
        var rest = String(seconds % 60).padStart(2, '0');
        out.textContent = (timerKind === 'break' ? 'Break' : 'Focus') + ' · ' + minutes + ':' + rest + ' left';
        if (left > 0) return;
        clearTimer(true);
        out.textContent = timerKind === 'break'
          ? 'Break finished. Pick a different module and recall one idea.'
          : 'Round finished. Take a real break before you continue.';
      }

      choices.forEach(function (button) {
        button.addEventListener('click', function () {
          clearTimer(true);
          timerKind = button.getAttribute('data-kind') || 'focus';
          endAt = Date.now() + (+button.getAttribute('data-minutes') * 60000);
          button.setAttribute('aria-pressed', 'true');
          stop.hidden = false;
          paintTimer();
          timerId = setInterval(paintTimer, 250);
        });
      });
      stop.addEventListener('click', function () {
        clearTimer(true);
        out.textContent = 'Timer stopped. Pick a round when you are ready.';
      });
    }

    var modules = $$('.syl-module', page);
    modules.forEach(function (module) {
      var focus = $('.syl-focus', module);
      if (focus) focus.addEventListener('click', function () {
        var active = module.classList.contains('is-focus-target');
        modules.forEach(function (item) {
          item.classList.remove('is-focus-target');
          var button = $('.syl-focus', item);
          if (button) {
            button.setAttribute('aria-pressed', 'false');
            $('span', button).textContent = 'Focus';
          }
        });
        page.classList.toggle('is-module-focus', !active);
        if (!active) {
          module.classList.add('is-focus-target');
          focus.setAttribute('aria-pressed', 'true');
          $('span', focus).textContent = 'Show all';
          module.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        }
      });

      var listen = $('.syl-listen', module);
      if (listen) {
        if (!('speechSynthesis' in window)) listen.hidden = true;
        else listen.addEventListener('click', function () {
          var speaking = listen.getAttribute('aria-pressed') === 'true';
          window.speechSynthesis.cancel();
          $$('.syl-listen', page).forEach(function (button) {
            button.setAttribute('aria-pressed', 'false');
            $('span', button).textContent = 'Listen';
          });
          if (speaking) return;
          var pieces = [$('.syl-module-name', module)].concat($$('.syl-plain p', module), [$('.syl-check', module)]);
          var words = pieces.filter(Boolean).map(function (node) { return node.textContent.trim(); }).join('. ');
          var speech = new SpeechSynthesisUtterance(words);
          speech.rate = 0.9;
          speech.onend = speech.onerror = function () {
            listen.setAttribute('aria-pressed', 'false');
            $('span', listen).textContent = 'Listen';
          };
          listen.setAttribute('aria-pressed', 'true');
          $('span', listen).textContent = 'Stop';
          window.speechSynthesis.speak(speech);
        });
      }

      var note = $('textarea', module);
      if (note) {
        var index = +module.getAttribute('data-i');
        var key = 'note:' + d.id + ':' + index;
        note.value = load(key, '');
        var noteTimer;
        note.addEventListener('input', function () {
          clearTimeout(noteTimer);
          noteTimer = setTimeout(function () { save(key, note.value); }, 180);
        });
      }
    });
  }

  /* ════════════════════════════════════════════════════════
     Retrieval schedule

     Reading a fluent answer is not evidence that it will be available later.
     After each cold question, the reader judges the attempt against explicit
     criteria and schedules another retrieval. The three intervals are modest
     on purpose: this is interview preparation, not a permanent flashcard deck.
     ════════════════════════════════════════════════════════ */

  var REVIEW_DAYS = { again: 1, hard: 3, ready: 7 };

  function reviewRecord(topic, index) {
    var value = load('review:' + topic + ':' + index, null);
    return value && typeof value.due === 'number' ? value : null;
  }

  function reviewSchedule(d) {
    var modules = $$('.syl-module');
    if (!modules.length) return;

    modules.forEach(function (module) {
      var index = +module.getAttribute('data-i');
      var status = $('.syl-review-status', module);
      var buttons = $$('.syl-review button', module);
      if (!status || !buttons.length) return;

      function paint() {
        var record = reviewRecord(d.id, index);
        buttons.forEach(function (button) {
          button.setAttribute('aria-pressed', record && record.level === button.getAttribute('data-review') ? 'true' : 'false');
        });
        if (!record) {
          status.textContent = 'No next review scheduled.';
          return;
        }
        if (record.due <= Date.now()) {
          status.textContent = 'Review due now. Answer once before reopening the notes.';
          return;
        }
        var date = new Date(record.due).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
        status.textContent = 'Next review: ' + date + '.';
      }

      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          var level = button.getAttribute('data-review');
          var days = REVIEW_DAYS[level];
          if (!days) return;
          save('review:' + d.id + ':' + index, {
            level: level,
            due: Date.now() + days * 86400000,
            updated: Date.now()
          });
          paint();
        });
      });

      paint();
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
    var all = d.modules.map(function (_, i) { return i; });
    var order = all.slice();
    var at = 0, flipped = false;

    function paint() {
      var m = d.modules[order[at]];
      mount.innerHTML =
        '<div class="ivc-card' + (flipped ? ' is-flipped' : '') + '">' +
        '<div class="ivc-face ivc-front">' +
        '<span class="ivc-context">Question ' + (at + 1) + ' of ' + order.length + '</span>' +
        '<p class="ivc-q">' + esc(m.check) + '</p>' +
        '<span class="ivc-hint">Click to see the terms to use</span>' +
        '</div>' +
        '<div class="ivc-face ivc-back">' +
        '<span class="ivc-context">' + esc(m.name) + '</span>' +
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

    var prev = $('#iv-card-prev'), next = $('#iv-card-next'), shuf = $('#iv-card-shuffle'), due = $('#iv-card-due');
    if (prev) prev.addEventListener('click', function () {
      at = (at - 1 + order.length) % order.length; flipped = false; paint();
    });
    if (next) next.addEventListener('click', function () {
      at = (at + 1) % order.length; flipped = false; paint();
    });
    if (shuf) shuf.addEventListener('click', function () {
      order = all.slice();
      for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = order[i]; order[i] = order[j]; order[j] = t;
      }
      at = 0; flipped = false; paint();
    });
    if (due) due.addEventListener('click', function () {
      var now = Date.now();
      var dueOrder = all.filter(function (index) {
        var record = reviewRecord(d.id, index);
        return record && record.due <= now;
      });
      if (!dueOrder.length) {
        due.textContent = 'Nothing due';
        setTimeout(function () { due.textContent = 'Due today'; }, 1600);
        return;
      }
      order = dueOrder;
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
      var topic = c.getAttribute('data-topic');
      var due = 0;
      for (var i = 0; i < total; i++) {
        var record = reviewRecord(topic, i);
        if (record && record.due <= Date.now()) due++;
      }
      if (due) {
        var badge = document.createElement('span');
        badge.className = 'ivh-card-due';
        badge.textContent = due + (due === 1 ? ' review due' : ' reviews due');
        c.appendChild(badge);
      }
    });
  }

  function init() {
    var d = data();
    if (d) { diagrams(d); progress(d); cards(d); learningTools(d); reviewSchedule(d); }
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
