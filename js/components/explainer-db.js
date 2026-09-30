/* ════════════════════════════════════════════════════════
   Database labs on /databases/: a B+ tree that grows as you insert, the 4
   joins on 2 small tables, and a schedule checked for conflict
   serializability with its precedence graph. Each algorithm is implemented
   here and checked by scripts/verify_explainers.py.
   ════════════════════════════════════════════════════════ */
(function () {

  /* ── B+ tree with at most `order - 1` keys per node. ── */
  function bptree(order) {
    var root = { leaf: true, keys: [], next: null };
    function insert(key) {
      var split = ins(root, key);
      if (split) root = { leaf: false, keys: [split.key], kids: [root, split.node] };
      return split;
    }
    function ins(node, key) {
      if (node.leaf) {
        if (node.keys.indexOf(key) >= 0) return null;
        var i = 0;
        while (i < node.keys.length && node.keys[i] < key) i++;
        node.keys.splice(i, 0, key);
        if (node.keys.length < order) return null;
        /* Split the leaf: the right half moves out, its first key is copied up. */
        var mid = Math.ceil(node.keys.length / 2), right = { leaf: true, keys: node.keys.slice(mid), next: node.next };
        node.keys = node.keys.slice(0, mid); node.next = right;
        return { key: right.keys[0], node: right };
      }
      var j = 0;
      while (j < node.keys.length && key >= node.keys[j]) j++;
      var s = ins(node.kids[j], key);
      if (!s) return null;
      node.keys.splice(j, 0, s.key); node.kids.splice(j + 1, 0, s.node);
      if (node.keys.length < order) return null;
      /* Split an internal node: the middle key moves up and leaves this level. */
      var m = Math.floor(node.keys.length / 2), up = node.keys[m];
      var r = { leaf: false, keys: node.keys.slice(m + 1), kids: node.kids.slice(m + 1) };
      node.keys = node.keys.slice(0, m); node.kids = node.kids.slice(0, m + 1);
      return { key: up, node: r };
    }
    return { insert: insert, root: function () { return root; } };
  }
  /* Levels of the tree, top to bottom, for drawing and for checks. */
  function levels(root) {
    var out = [], lvl = [root];
    while (lvl.length) {
      out.push(lvl);
      lvl = lvl[0].leaf ? [] : [].concat.apply([], lvl.map(function (n) { return n.kids; }));
    }
    return out;
  }

  /* ── joins, returning rows and how many comparisons a nested loop makes ── */
  function join(L, R, type) {
    var rows = [], matchedR = {};
    L.forEach(function (l) {
      var any = false;
      R.forEach(function (r, j) {
        if (l.k === r.k) { rows.push([l, r]); any = true; matchedR[j] = true; }
      });
      if (!any && (type === 'left' || type === 'full')) rows.push([l, null]);
    });
    if (type === 'right' || type === 'full') R.forEach(function (r, j) { if (!matchedR[j]) rows.push([null, r]); });
    if (type === 'right') rows = rows.filter(function (p) { return p[1]; });
    return { rows: rows, comparisons: L.length * R.length };
  }

  /* ── conflict serializability. A schedule is [{ t, op: 'R'|'W', x }]. ── */
  function precedence(schedule) {
    var edges = {}, txs = [];
    schedule.forEach(function (a, i) {
      if (txs.indexOf(a.t) < 0) txs.push(a.t);
      for (var j = i + 1; j < schedule.length; j++) {
        var b = schedule[j];
        if (a.t !== b.t && a.x === b.x && (a.op === 'W' || b.op === 'W')) edges[a.t + '>' + b.t] = true;
      }
    });
    var E = Object.keys(edges).map(function (e) { return e.split('>'); });
    /* Topological order by repeatedly removing a transaction with no incoming edge. */
    var left = txs.slice(), order = [];
    while (left.length) {
      var free = left.filter(function (t) { return !E.some(function (e) { return e[1] === t && left.indexOf(e[0]) >= 0; }); });
      if (!free.length) break;
      order.push(free[0]); left.splice(left.indexOf(free[0]), 1);
    }
    return { txs: txs, edges: E, serializable: order.length === txs.length, order: order };
  }

  var DB = { bptree: bptree, levels: levels, join: join, precedence: precedence };
  if (typeof module === 'object' && module.exports) { module.exports = DB; return; }

  var host = document.querySelector('[data-xp="db"]');
  if (!host || !window.XP) return;
  var esc = XP.esc;

  var S = {
    tab: 'tree', order: 4, keys: [], lastSplit: false,
    jtype: 'inner',
    L: [{ k: 1, v: 'Ana' }, { k: 2, v: 'Budi' }, { k: 3, v: 'Chen' }, { k: 5, v: 'Dewi' }],
    R: [{ k: 1, v: 'Physics' }, { k: 3, v: 'Maths' }, { k: 3, v: 'Biology' }, { k: 4, v: 'History' }],
    sched: 'R1(A) W2(A) R2(B) W1(B) C1 C2'
  };
  var tree = bptree(S.order);

  var PAGES = [
    { t: 'Why a B+ tree', tab: 'tree', parts: ['tree'], body: '<p>A database index must find one key among millions while reading few disk pages. A B+ tree keeps keys sorted in wide nodes, so it stays only a few levels deep.</p><p>Insert keys and watch it grow.</p>' },
    { t: 'Splits keep it balanced', tab: 'tree', parts: ['tree'], body: '<p>When a leaf overflows it splits in two, and the first key of the new leaf is copied up. A full internal node splits too, moving its middle key up. The tree only grows at the root, so every leaf stays at the same depth.</p>' },
    { t: 'Joins match rows', tab: 'join', parts: ['join'], body: '<p>A join pairs rows whose keys match. Switch between inner, left, right and full to see which unmatched rows survive, padded with nulls. Key 3 matches twice on the right, so its row appears twice.</p>' },
    { t: 'The cost of matching', tab: 'join', parts: ['cost'], body: '<p>A nested loop compares every pair, so its cost is the rows on the left times the rows on the right. A hash join builds a table on one side and probes it once per row on the other, which is why engines prefer it for large equality joins.</p>' },
    { t: 'Conflicts form a graph', tab: 'txn', parts: ['graph'], body: '<p>2 transactions interleave reads and writes. Every pair of conflicting operations on the same item draws an edge. A cycle means no serial order gives the same result, so the schedule is not conflict serializable.</p>' }
  ];

  function treeView() {
    var L = levels(tree.root()), W = 1000, lh = 76, H = L.length * lh + 20, s = '';
    var pos = new Map();
    L.forEach(function (lvl, d) {
      var widths = lvl.map(function (n) { return Math.max(1, n.keys.length) * 34 + 12; }), total = widths.reduce(function (a, b) { return a + b + 16; }, -16);
      var x = (W - total) / 2;
      lvl.forEach(function (n, i) {
        pos.set(n, { x: x, y: 10 + d * lh, w: widths[i] });
        x += widths[i] + 16;
      });
    });
    L.forEach(function (lvl, d) {
      lvl.forEach(function (n) {
        var p = pos.get(n);
        if (!n.leaf) n.kids.forEach(function (k, i) {
          var c = pos.get(k), px = p.x + 6 + i * 34;
          s += XP.svgEl('path', { d: XP.curve(px, p.y + 30, c.x + c.w / 2, c.y), 'class': 'xp-db-edge' });
        });
        if (n.leaf && n.next && pos.get(n.next)) {
          var q = pos.get(n.next);
          s += XP.svgEl('path', { d: 'M' + (p.x + p.w) + ' ' + (p.y + 15) + ' L' + q.x + ' ' + (q.y + 15), 'class': 'xp-db-link' });
        }
        s += XP.svgEl('rect', { x: p.x, y: p.y, width: p.w, height: 30, rx: 5, 'class': 'xp-db-node' + (n.leaf ? ' is-leaf' : '') });
        n.keys.forEach(function (k, i) {
          var fresh = k === S.keys[S.keys.length - 1];
          s += XP.svgEl('text', { x: p.x + 6 + i * 34 + 17, y: p.y + 20, 'text-anchor': 'middle', 'class': 'xp-db-key' + (fresh ? ' is-new' : '') }, String(k));
        });
      });
    });
    return '<div class="xp-ctl"><label class="xp-field"><span>Insert key</span><input type="number" min="1" max="999" data-key aria-label="Key to insert"></label>' +
      '<button type="button" class="xp-go is-inline" data-insert>Insert</button><button type="button" class="xp-go is-inline" data-random>Insert 5 random</button>' +
      '<button type="button" class="xp-go is-inline" data-clear>Clear</button>' +
      '<label class="xp-field"><span>Max keys per node</span><input type="range" min="3" max="6" value="' + (S.order - 1) + '" data-order><output>' + (S.order - 1) + '</output></label></div>' +
      '<figure class="xp-db-tree" data-part="tree"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="B+ tree with ' + S.keys.length + ' keys and ' + L.length + ' levels">' + s + '</svg>' +
      '<figcaption class="xp-note" aria-live="polite">' + (S.keys.length ? S.keys.length + ' keys, ' + L.length + (L.length === 1 ? ' level' : ' levels') + '. ' + (S.lastSplit ? 'The last insert split a node.' : 'The last insert fitted without a split.') + ' Leaves are linked left to right for range scans.' : 'Empty. Insert a key to begin.') + '</figcaption></figure>';
  }

  function joinView() {
    var J = join(S.L, S.R, S.jtype);
    function tbl(rows, name) {
      return '<table class="xp-table is-compact"><caption>' + name + '</caption><thead><tr><th scope="col">key</th><th scope="col">value</th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><td>' + r.k + '</td><td>' + esc(r.v) + '</td></tr>'; }).join('') + '</tbody></table>';
    }
    return '<div class="xp-ctl"><div class="xp-seg" role="group" aria-label="Join type">' + ['inner', 'left', 'right', 'full'].map(function (t) {
      return '<button type="button" data-jtype="' + t + '" aria-pressed="' + (S.jtype === t) + '">' + t + '</button>';
    }).join('') + '</div></div>' +
      '<div class="xp-db-join" data-part="join">' + tbl(S.L, 'students') + tbl(S.R, 'enrolments') +
      '<table class="xp-table is-compact"><caption>students ' + S.jtype.toUpperCase() + ' JOIN enrolments ON key</caption><thead><tr><th scope="col">key</th><th scope="col">student</th><th scope="col">course</th></tr></thead><tbody>' +
      J.rows.map(function (p) {
        return '<tr><td>' + (p[0] || p[1]).k + '</td><td' + (p[0] ? '' : ' class="is-null"') + '>' + (p[0] ? esc(p[0].v) : 'null') + '</td><td' + (p[1] ? '' : ' class="is-null"') + '>' + (p[1] ? esc(p[1].v) : 'null') + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="xp-os-sum" data-part="cost">' + J.rows.length + ' rows. A nested loop makes ' + J.comparisons + ' comparisons, one for every pair; a hash join builds a table of ' + S.R.length + ' rows and probes it ' + S.L.length + ' times.</p>';
  }

  function parse(str) {
    return str.trim().split(/\s+/).map(function (tok) {
      var m = tok.match(/^([RW])(\d+)\(([A-Za-z])\)$/);
      return m ? { t: 'T' + m[2], op: m[1], x: m[3], raw: tok } : null;
    }).filter(Boolean);
  }
  function txnView() {
    var sch = parse(S.sched), P = precedence(sch), txs = P.txs, W = 300, H = 160, s = '';
    var cx = function (i) { return txs.length === 1 ? W / 2 : 60 + i * (W - 120) / (txs.length - 1); };
    P.edges.forEach(function (e) {
      var a = txs.indexOf(e[0]), b = txs.indexOf(e[1]), back = P.edges.some(function (f) { return f[0] === e[1] && f[1] === e[0]; });
      var bend = back ? (a < b ? -40 : 40) : 0;
      s += XP.svgEl('path', { d: 'M' + cx(a) + ' 80 Q' + (cx(a) + cx(b)) / 2 + ' ' + (80 + bend) + ' ' + cx(b) + ' 80', 'class': 'xp-db-arc', 'marker-end': 'url(#xp-db-arrow)' });
    });
    txs.forEach(function (t, i) {
      s += XP.svgEl('circle', { cx: cx(i), cy: 80, r: 22, 'class': 'xp-db-tx' }) + XP.svgEl('text', { x: cx(i), y: 85, 'text-anchor': 'middle', 'class': 'xp-db-key' }, t);
    });
    return '<div class="xp-ctl"><label class="xp-field"><span>Schedule</span><input type="text" size="42" data-sched value="' + esc(S.sched) + '" aria-label="Schedule, for example R1(A) W2(A)"></label>' +
      '<div class="xp-seg" role="group" aria-label="Example schedules">' +
      '<button type="button" data-ex="R1(A) W1(A) R2(A) W2(A) R1(B) W1(B)">Serializable</button>' +
      '<button type="button" data-ex="R1(A) W2(A) R2(B) W1(B)">Cycle</button>' +
      '<button type="button" data-ex="R1(A) R2(A) W1(A) W2(A)">Lost update</button></div></div>' +
      '<div class="xp-db-txn" data-part="graph"><ol class="xp-db-steps">' + sch.map(function (a) { return '<li class="is-' + a.t + '"><b>' + a.t + '</b> ' + (a.op === 'R' ? 'reads' : 'writes') + ' ' + a.x + '</li>'; }).join('') + '</ol>' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Precedence graph"><defs><marker id="xp-db-arrow" viewBox="0 0 10 10" refX="30" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="xp-db-head"/></marker></defs>' + s + '</svg>' +
      '<p class="xp-os-sum" aria-live="polite">' + (P.serializable
        ? '<b>Conflict serializable.</b> Equivalent to running ' + P.order.join(' then ') + ' one after the other.'
        : '<b>Not conflict serializable.</b> The edges form a cycle, so no serial order produces the same conflicts.') +
      ' Write operations as R1(A) for "transaction 1 reads A".</p></div>';
  }

  function render(sel) {
    host.querySelector('.xp-os-body').innerHTML = S.tab === 'tree' ? treeView() : S.tab === 'join' ? joinView() : txnView();
    Array.prototype.forEach.call(host.querySelectorAll('[data-tab]'), function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === S.tab)); });
    if (sel) { var e = host.querySelector(sel); if (e) e.focus(); }
  }
  function add(k) {
    if (!(k > 0) || S.keys.indexOf(k) >= 0) return;
    var before = levels(tree.root()).reduce(function (a, l) { return a + l.length; }, 0);
    tree.insert(k); S.keys.push(k);
    S.lastSplit = levels(tree.root()).reduce(function (a, l) { return a + l.length; }, 0) > before;
  }
  function rebuild() { tree = bptree(S.order); var ks = S.keys; S.keys = []; ks.forEach(add); }

  host.innerHTML = '<div class="xp-toolbar"><div class="xp-tabs" role="tablist" aria-label="Lab">' +
    [['tree', 'B+ tree'], ['join', 'Joins'], ['txn', 'Serializability']].map(function (t) {
      return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (S.tab === t[0]) + '">' + t[1] + '</button>';
    }).join('') + '</div></div><div class="xp-stage"><div class="xp-os-body"></div></div>';
  [12, 5, 30, 18, 7, 25, 40, 3, 21].forEach(add);
  render();
  XP.guide(host.querySelector('.xp-stage'), PAGES, function (p, i, isRedraw) {
    if (!isRedraw && p && p.tab && p.tab !== S.tab) { S.tab = p.tab; render(); }
    XP.highlight(host.querySelector('.xp-os-body'), p ? p.parts : []);
  });

  host.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || b.closest('.xp-guide') || b.classList.contains('xp-guide-open')) return;
    if (b.dataset.tab) { S.tab = b.dataset.tab; render(); return; }
    if (b.hasAttribute('data-insert')) { add(parseInt(host.querySelector('[data-key]').value, 10)); render('[data-key]'); }
    if (b.hasAttribute('data-random')) { for (var i = 0; i < 5; i++) add(1 + Math.floor(Math.random() * 99)); render('[data-random]'); }
    if (b.hasAttribute('data-clear')) { S.keys = []; tree = bptree(S.order); render('[data-clear]'); }
    if (b.dataset.jtype) { S.jtype = b.dataset.jtype; render('[data-jtype="' + S.jtype + '"]'); }
    if (b.dataset.ex) { S.sched = b.dataset.ex; render('[data-ex="' + b.dataset.ex + '"]'); }
  });
  host.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.hasAttribute('data-key')) { add(parseInt(e.target.value, 10)); render('[data-key]'); }
  });
  host.addEventListener('input', function (e) {
    if (e.target.hasAttribute('data-order')) { S.order = +e.target.value + 1; rebuild(); render('[data-order]'); }
  });
  host.addEventListener('change', function (e) {
    if (e.target.hasAttribute('data-sched')) { S.sched = e.target.value; render('[data-sched]'); }
  });
})();
