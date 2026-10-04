/* ════════════════════════════════════════════════════════
   Operating system simulators on /operating-systems/.

   3 labs on one canvas: CPU scheduling drawn as a Gantt chart, page
   replacement drawn as the frames over time, and the Banker's algorithm
   searching for a safe sequence. Each algorithm is implemented here in full
   and checked against the textbook's worked answers by
   scripts/verify_explainers.py.
   ════════════════════════════════════════════════════════ */
(function () {

  /* ── CPU scheduling. Processes are { id, arrival, burst, priority }. ──
     Returns the timeline as segments { id, start, end } (id null for idle)
     and per-process completion, turnaround and waiting times. */
  function schedule(procs, algo, quantum) {
    var ps = procs.map(function (p) { return { id: p.id, arrival: p.arrival, burst: p.burst, priority: p.priority, left: p.burst, done: null }; });
    var t = 0, segs = [], ready = [], queue = [], finished = 0, last = null;
    function push(id, a, b) {
      if (b <= a) return;
      var s = segs[segs.length - 1];
      if (s && s.id === id && s.end === a) s.end = b; else segs.push({ id: id, start: a, end: b });
    }
    function arrived(time) { return ps.filter(function (p) { return p.arrival <= time && p.left > 0; }); }
    if (algo === 'RR') {
      var order = ps.slice().sort(function (a, b) { return a.arrival - b.arrival || a.id.localeCompare(b.id); }), next = 0;
      function admit(time) { while (next < order.length && order[next].arrival <= time) queue.push(order[next++]); }
      admit(0);
      while (finished < ps.length) {
        if (!queue.length) { var nt = order[next].arrival; push(null, t, nt); t = nt; admit(t); continue; }
        var p = queue.shift(), run = Math.min(quantum, p.left);
        push(p.id, t, t + run); t += run; p.left -= run;
        admit(t);
        if (p.left > 0) queue.push(p); else { p.done = t; finished++; }
      }
    } else {
      var preemptive = algo === 'SRTF' || algo === 'PP';
      while (finished < ps.length) {
        var avail = arrived(t);
        if (!avail.length) {
          var na = Math.min.apply(null, ps.filter(function (p) { return p.left > 0; }).map(function (p) { return p.arrival; }));
          push(null, t, na); t = na; continue;
        }
        avail.sort(function (a, b) {
          var k = algo === 'FCFS' ? a.arrival - b.arrival
            : algo === 'SJF' || algo === 'SRTF' ? (algo === 'SJF' ? a.burst - b.burst : a.left - b.left)
            : a.priority - b.priority;
          return k || a.arrival - b.arrival || a.id.localeCompare(b.id);
        });
        var q = avail[0];
        /* Non-preemptive keeps whoever is already running. */
        if (!preemptive && last && last.left > 0 && last.left < last.burst) q = last;
        var until = q.left;
        if (preemptive) {
          var future = ps.filter(function (p) { return p.arrival > t && p.left > 0; }).map(function (p) { return p.arrival - t; });
          if (future.length) until = Math.min(until, Math.min.apply(null, future));
        }
        push(q.id, t, t + until); t += until; q.left -= until; last = q;
        if (q.left === 0) { q.done = t; finished++; last = null; }
      }
    }
    var stats = ps.map(function (p) { return { id: p.id, done: p.done, turnaround: p.done - p.arrival, waiting: p.done - p.arrival - p.burst }; });
    return { segs: segs, stats: stats };
  }

  /* ── Page replacement. Returns one column per reference: the frames after
     it, whether it hit, and which page was evicted. ── */
  function replace(refs, nFrames, algo) {
    var frames = [], lastUse = {}, loadedAt = {}, cols = [], faults = 0;
    refs.forEach(function (pg, i) {
      var hit = frames.indexOf(pg) >= 0, evicted = null;
      if (!hit) {
        faults++;
        if (frames.length < nFrames) frames.push(pg);
        else {
          var victim;
          if (algo === 'FIFO') victim = frames.reduce(function (a, b) { return loadedAt[a] <= loadedAt[b] ? a : b; });
          else if (algo === 'LRU') victim = frames.reduce(function (a, b) { return lastUse[a] <= lastUse[b] ? a : b; });
          else {
            /* Optimal: evict the page used furthest in the future, or never again. */
            victim = frames.reduce(function (a, b) {
              var na = refs.indexOf(a, i + 1), nb = refs.indexOf(b, i + 1);
              na = na < 0 ? Infinity : na; nb = nb < 0 ? Infinity : nb;
              return na >= nb ? a : b;
            });
          }
          evicted = victim;
          frames[frames.indexOf(victim)] = pg;
        }
        loadedAt[pg] = i;
      }
      lastUse[pg] = i;
      cols.push({ page: pg, frames: frames.slice(), hit: hit, evicted: evicted });
    });
    return { cols: cols, faults: faults };
  }

  /* ── Banker's algorithm. Returns the safe sequence, or null, and the
     steps: which process could finish and the work vector after it. ── */
  function banker(alloc, max, avail) {
    var n = alloc.length, m = avail.length, work = avail.slice(), fin = new Array(n).fill(false), seq = [], steps = [];
    var need = max.map(function (row, i) { return row.map(function (v, j) { return v - alloc[i][j]; }); });
    var progress = true;
    while (progress) {
      progress = false;
      for (var i = 0; i < n; i++) {
        if (fin[i]) continue;
        if (need[i].every(function (v, j) { return v <= work[j]; })) {
          for (var j = 0; j < m; j++) work[j] += alloc[i][j];
          fin[i] = true; seq.push(i); steps.push({ p: i, work: work.slice() }); progress = true;
        }
      }
    }
    return { safe: fin.every(Boolean), seq: seq, steps: steps, need: need };
  }

  var OS = { schedule: schedule, replace: replace, banker: banker };
  if (typeof module === 'object' && module.exports) { module.exports = OS; return; }

  var host = document.querySelector('[data-xp="os"]');
  if (!host || !window.XP) return;
  var esc = XP.esc;

  var S = {
    tab: 'cpu', algo: 'RR', quantum: 2,
    procs: [
      { id: 'P1', arrival: 0, burst: 7, priority: 3 },
      { id: 'P2', arrival: 2, burst: 4, priority: 1 },
      { id: 'P3', arrival: 4, burst: 1, priority: 4 },
      { id: 'P4', arrival: 5, burst: 4, priority: 2 }
    ],
    refs: '7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1', frames: 3, palgo: 'LRU',
    bank: { alloc: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]], max: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]], avail: [3, 3, 2] },
    bstep: 99
  };
  var HUES = ['--xp-q', '--xp-k', '--xp-v', '--xp-o', '--tf-down', '--tf-up'];

  var PAGES = [
    { t: 'The scheduler picks who runs', tab: 'cpu', parts: ['gantt'], body: '<p>4 processes arrive over time, each needing CPU time. A <b>scheduler</b> chooses which process runs. The Gantt chart, a timeline of process execution, shows these decisions with one colour per process.</p>' },
    { t: 'Waiting is the cost', tab: 'cpu', parts: ['stats'], body: '<p>Turnaround time runs from arrival to completion. Waiting time excludes time spent running. When jobs arrive together, shortest job first minimises average waiting time. However, round robin gives each ready process regular turns.</p>' },
    { t: 'Memory is smaller than the program', tab: 'mem', parts: ['frames'], body: '<p>Only a few pages fit in physical memory frames. A <b>page fault</b> occurs when a needed page is absent. Loading it replaces another page if every frame is occupied. Each column shows the frames after one page reference.</p>' },
    { t: 'Choosing what to evict', tab: 'mem', parts: ['frames', 'faults'], body: '<p>FIFO replaces the page loaded earliest. LRU replaces the least recently used page. OPT replaces the page needed furthest in the future. It requires future knowledge, so it provides a lower bound for comparison.</p>' },
    { t: 'Belady’s anomaly', tab: 'mem', parts: ['faults'], body: '<p>Press <b>Belady’s anomaly</b>. With FIFO, this string faults more with 4 frames than with 3. LRU and OPT never do this, because the pages they keep with n frames are always kept with n + 1.</p>' },
    { t: 'Checking for a safe order', tab: 'bank', parts: ['bank'], body: '<p>The <b>Banker’s algorithm</b> grants resources only if some order exists in which every process can still get its maximum and finish. Step through it. Each finished process returns what it held.</p>' }
  ];

  function hue(i) { return 'var(' + HUES[i % HUES.length] + ')'; }

  function cpuView() {
    var R = schedule(S.procs, S.algo, S.quantum), end = R.segs[R.segs.length - 1].end;
    var ids = S.procs.map(function (p) { return p.id; });
    var W = 1000, rowH = 34, top = 20, h = top + 40 + 40;
    var s = '';
    for (var t = 0; t <= end; t++) {
      var x = 20 + t / end * (W - 40);
      s += XP.svgEl('line', { x1: x, y1: top, x2: x, y2: top + 48, 'class': 'xp-os-tick' }) + XP.svgEl('text', { x: x, y: top + 64, 'text-anchor': 'middle', 'class': 'xp-cv-small' }, String(t));
    }
    R.segs.forEach(function (g) {
      var x1 = 20 + g.start / end * (W - 40), x2 = 20 + g.end / end * (W - 40);
      s += XP.svgEl('g', { 'data-seg': g.id || '' },
        XP.svgEl('rect', { x: x1, y: top, width: Math.max(1, x2 - x1 - 1), height: 44, rx: 4, 'class': g.id ? 'xp-os-seg' : 'xp-os-idle', style: g.id ? 'fill:' + hue(ids.indexOf(g.id)) : null }) +
        (x2 - x1 > 22 ? XP.svgEl('text', { x: (x1 + x2) / 2, y: top + 27, 'text-anchor': 'middle', 'class': 'xp-os-lab' }, g.id || 'idle') : ''));
    });
    var avgT = R.stats.reduce(function (a, b) { return a + b.turnaround; }, 0) / R.stats.length;
    var avgW = R.stats.reduce(function (a, b) { return a + b.waiting; }, 0) / R.stats.length;
    return '<div class="xp-ctl"><div class="xp-seg" role="group" aria-label="Scheduling algorithm">' +
      [['FCFS', 'First come'], ['SJF', 'Shortest job'], ['SRTF', 'Shortest remaining'], ['PNP', 'Priority'], ['PP', 'Preemptive priority'], ['RR', 'Round robin']].map(function (a) {
        return '<button type="button" data-algo="' + a[0] + '" aria-pressed="' + (S.algo === a[0]) + '">' + a[1] + '</button>';
      }).join('') + '</div>' +
      (S.algo === 'RR' ? '<label class="xp-field"><span>Quantum</span><input type="range" min="1" max="6" value="' + S.quantum + '" data-k="quantum"><output>' + S.quantum + '</output></label>' : '') + '</div>' +
      '<figure class="xp-os-gantt" data-part="gantt"><svg viewBox="0 0 ' + W + ' ' + h + '" role="img" aria-label="Gantt chart of the schedule">' + s + '</svg></figure>' +
      '<div class="xp-os-grid"><table class="xp-table is-compact xp-os-procs" data-part="procs"><caption>Processes. Edit any number</caption><thead><tr><th scope="col">Process</th><th scope="col">Arrival</th><th scope="col">Burst</th><th scope="col">Priority</th></tr></thead><tbody>' +
      S.procs.map(function (p, i) {
        return '<tr><th scope="row"><span class="xp-swatch" style="background:' + hue(i) + '"></span>' + p.id + '</th>' +
          ['arrival', 'burst', 'priority'].map(function (k) {
            return '<td><input type="number" min="' + (k === 'burst' ? 1 : 0) + '" max="20" value="' + p[k] + '" data-proc="' + i + '" data-field="' + k + '" aria-label="' + p.id + ' ' + k + '"></td>';
          }).join('') + '</tr>';
      }).join('') + '</tbody></table>' +
      '<table class="xp-table is-compact" data-part="stats"><caption>Result, lower priority number runs first</caption><thead><tr><th scope="col">Process</th><th scope="col">Finish</th><th scope="col">Turnaround</th><th scope="col">Waiting</th></tr></thead><tbody>' +
      R.stats.map(function (st) { return '<tr><th scope="row">' + st.id + '</th><td>' + st.done + '</td><td>' + st.turnaround + '</td><td>' + st.waiting + '</td></tr>'; }).join('') +
      '<tr class="is-sum"><th scope="row">Average</th><td></td><td>' + avgT.toFixed(2) + '</td><td>' + avgW.toFixed(2) + '</td></tr></tbody></table></div>';
  }

  function memView() {
    var refs = S.refs.trim().split(/[\s,]+/).filter(Boolean).map(Number).filter(function (v) { return !isNaN(v); });
    var R = replace(refs, S.frames, S.palgo);
    var others = ['FIFO', 'LRU', 'OPT'].map(function (a) { return a + ' ' + replace(refs, S.frames, a).faults; }).join(', ');
    return '<div class="xp-ctl"><label class="xp-field"><span>Reference string</span><input type="text" data-refs value="' + esc(S.refs) + '" size="40" aria-label="Page reference string, numbers separated by spaces"></label>' +
      '<label class="xp-field"><span>Frames</span><input type="range" min="1" max="7" value="' + S.frames + '" data-k="frames"><output>' + S.frames + '</output></label>' +
      '<div class="xp-seg" role="group" aria-label="Replacement policy">' + ['FIFO', 'LRU', 'OPT'].map(function (a) {
        return '<button type="button" data-palgo="' + a + '" aria-pressed="' + (S.palgo === a) + '">' + a + '</button>';
      }).join('') + '</div><button type="button" class="xp-go is-inline" data-belady>Belady’s anomaly</button></div>' +
      '<div class="xp-scroll" data-part="frames"><table class="xp-os-frames"><thead><tr><th scope="col">Reference</th>' +
      R.cols.map(function (c) { return '<th scope="col">' + c.page + '</th>'; }).join('') + '</tr></thead><tbody>' +
      Array.apply(null, Array(S.frames)).map(function (_, f) {
        return '<tr><th scope="row">Frame ' + (f + 1) + '</th>' + R.cols.map(function (c, i) {
          var v = c.frames[f], isNew = !c.hit && v === c.page;
          return '<td class="' + (v === undefined ? 'is-empty' : isNew ? 'is-new' : '') + '">' + (v === undefined ? '' : v) + '</td>';
        }).join('') + '</tr>';
      }).join('') +
      '<tr class="xp-os-hit"><th scope="row">Result</th>' + R.cols.map(function (c) {
        return '<td title="' + (c.hit ? 'hit' : 'fault' + (c.evicted !== null ? ', evicted ' + c.evicted : '')) + '">' + (c.hit ? '✓' : '✗') + '</td>';
      }).join('') + '</tr></tbody></table></div>' +
      '<p class="xp-os-sum" data-part="faults" aria-live="polite"><b>' + R.faults + ' faults</b> in ' + refs.length + ' references with ' + S.palgo + '. With ' + S.frames + ' frames, ' + others + '.</p>';
  }

  function bankView() {
    var B = S.bank, R = banker(B.alloc, B.max, B.avail), shown = Math.min(S.bstep, R.steps.length);
    var done = R.seq.slice(0, shown), work = shown ? R.steps[shown - 1].work : B.avail;
    function row(v) { return v.map(function (x) { return '<td>' + x + '</td>'; }).join(''); }
    return '<div class="xp-ctl"><button type="button" class="xp-go is-inline" data-bstep="-1"' + (shown === 0 ? ' disabled' : '') + '>Back</button>' +
      '<button type="button" class="xp-go is-inline" data-bstep="1"' + (shown >= R.steps.length ? ' disabled' : '') + '>Next process</button>' +
      '<button type="button" class="xp-go is-inline" data-bstep="0">Start again</button>' +
      '<label class="xp-field"><span>Available A B C</span><input type="text" data-avail value="' + B.avail.join(' ') + '" size="8" aria-label="Available resources A B C"></label></div>' +
      '<div class="xp-os-grid" data-part="bank"><table class="xp-table is-compact"><thead><tr><th scope="col">Process</th><th scope="col" colspan="3">Allocated</th><th scope="col" colspan="3">Maximum</th><th scope="col" colspan="3">Still needs</th></tr></thead><tbody>' +
      B.alloc.map(function (a, i) {
        var st = done.indexOf(i) >= 0 ? ' class="is-done"' : '';
        return '<tr' + st + '><th scope="row">P' + i + (done.indexOf(i) >= 0 ? ' ✓' : '') + '</th>' + row(a) + row(B.max[i]) + row(R.need[i]) + '</tr>';
      }).join('') + '</tbody></table>' +
      '<div class="xp-os-bank"><p><b>Work</b> ' + work.join(' ') + '</p><p><b>Order so far</b> ' + (done.length ? done.map(function (i) { return 'P' + i; }).join(' → ') : 'none') + '</p>' +
      '<p class="xp-os-sum" aria-live="polite">' + (shown < R.steps.length
        ? 'Next, find an unfinished process whose remaining need fits within Work.'
        : R.safe ? '<b>Safe.</b> Every process can finish in this order, so the state is safe.' : '<b>Unsafe.</b> No remaining process fits in Work, so granting this state could deadlock.') + '</p></div></div>';
  }

  function render(focusSel) {
    var body = S.tab === 'cpu' ? cpuView() : S.tab === 'mem' ? memView() : bankView();
    host.querySelector('.xp-os-body').innerHTML = body;
    if (focusSel) { var el = host.querySelector(focusSel); if (el) el.focus(); }
    if (guideApi) guideApi.redraw();
  }
  var guideApi;

  function setTab(t) {
    S.tab = t;
    Array.prototype.forEach.call(host.querySelectorAll('[data-tab]'), function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === t)); });
    render();
  }

  host.innerHTML = '<div class="xp-toolbar"><div class="xp-tabs" role="tablist" aria-label="Simulator">' +
    [['cpu', 'CPU scheduling'], ['mem', 'Page replacement'], ['bank', 'Deadlock avoidance']].map(function (t) {
      return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (S.tab === t[0]) + '">' + t[1] + '</button>';
    }).join('') + '</div></div><div class="xp-stage"><div class="xp-os-body"></div></div>';
  var stage = host.querySelector('.xp-stage');
  render();
  guideApi = XP.guide(stage, PAGES, function (p, i, isRedraw) {
    if (!isRedraw && p && p.tab && p.tab !== S.tab) { S.tab = p.tab; setTabSilently(); }
    XP.highlight(host.querySelector('.xp-os-body'), p ? p.parts : []);
  });
  function setTabSilently() {
    Array.prototype.forEach.call(host.querySelectorAll('[data-tab]'), function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === S.tab)); });
    host.querySelector('.xp-os-body').innerHTML = S.tab === 'cpu' ? cpuView() : S.tab === 'mem' ? memView() : bankView();
  }

  host.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || b.closest('.xp-guide') || b.classList.contains('xp-guide-open')) return;
    if (b.dataset.tab) { setTab(b.dataset.tab); return; }
    if (b.dataset.algo) { S.algo = b.dataset.algo; render('[data-algo="' + S.algo + '"]'); }
    if (b.dataset.palgo) { S.palgo = b.dataset.palgo; render('[data-palgo="' + S.palgo + '"]'); }
    if (b.hasAttribute('data-belady')) {
      var refs = '1 2 3 4 1 2 5 1 2 3 4 5';
      var f3 = replace(refs.split(' ').map(Number), 3, 'FIFO').faults, f4 = replace(refs.split(' ').map(Number), 4, 'FIFO').faults;
      S.refs = refs; S.palgo = 'FIFO'; S.frames = S.frames === 3 ? 4 : 3;
      render('[data-belady]');
      host.querySelector('.xp-os-sum').innerHTML += ' <b>FIFO faults ' + f3 + ' times with 3 frames and ' + f4 + ' times with 4.</b> Press again to switch.';
    }
    if (b.dataset.bstep !== undefined) {
      var d = +b.dataset.bstep, total = banker(S.bank.alloc, S.bank.max, S.bank.avail).steps.length;
      S.bstep = d === 0 ? 0 : Math.max(0, Math.min(total, Math.min(S.bstep, total) + d));
      render('[data-bstep="' + b.dataset.bstep + '"]');
    }
  });
  host.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset.proc !== undefined) {
      var v = Math.max(t.dataset.field === 'burst' ? 1 : 0, Math.min(20, parseInt(t.value, 10) || 0));
      S.procs[+t.dataset.proc][t.dataset.field] = v;
      render('[data-proc="' + t.dataset.proc + '"][data-field="' + t.dataset.field + '"]');
    }
    if (t.hasAttribute('data-refs')) { S.refs = t.value; render('[data-refs]'); }
    if (t.hasAttribute('data-avail')) {
      var a = t.value.trim().split(/\s+/).map(Number);
      var ok = a.length === 3 && a.every(function (x) { return Number.isInteger(x) && x >= 0; });
      if (ok) { S.bank.avail = a; S.bstep = 0; }
      render('[data-avail]');
      /* Say why the value was not taken, rather than silently restoring it. */
      if (!ok) host.querySelector('.xp-os-sum').innerHTML = '<b>Not changed.</b> Enter 3 whole numbers for A, B and C, separated by spaces, for example 3 3 2.';
    }
  });
  host.addEventListener('input', function (e) {
    var k = e.target.dataset.k;
    if (!k) return;
    S[k] = +e.target.value;
    render('[data-k="' + k + '"]');
  });
  S.bstep = 0;
})();
