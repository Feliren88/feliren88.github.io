/* ════════════════════════════════════════════════════════
   Network labs on /computer-networks/: Dijkstra's algorithm building a
   forwarding table, TCP's congestion window over time, and a subnet
   calculator. Each is implemented here and checked by
   scripts/verify_explainers.py (the subnets against Python's ipaddress).
   ════════════════════════════════════════════════════════ */
(function () {

  /* ── Dijkstra from `src`. Returns distances, predecessors and the order in
     which nodes were settled, one entry per step. ── */
  function dijkstra(nodes, edges, src) {
    var dist = {}, prev = {}, done = {}, steps = [];
    nodes.forEach(function (n) { dist[n] = Infinity; prev[n] = null; });
    dist[src] = 0;
    for (var k = 0; k < nodes.length; k++) {
      var u = null;
      nodes.forEach(function (n) { if (!done[n] && (u === null || dist[n] < dist[u] || (dist[n] === dist[u] && n < u))) u = n; });
      if (u === null || dist[u] === Infinity) break;
      done[u] = true;
      edges.forEach(function (e) {
        var v = e[0] === u ? e[1] : e[1] === u ? e[0] : null;
        if (v !== null && !done[v] && dist[u] + e[2] < dist[v]) { dist[v] = dist[u] + e[2]; prev[v] = u; }
      });
      steps.push({ settled: u, dist: Object.assign({}, dist), prev: Object.assign({}, prev) });
    }
    return { dist: dist, prev: prev, steps: steps };
  }
  /* The first hop on the shortest path from src to each node. */
  function nextHops(prev, src) {
    var hops = {};
    Object.keys(prev).forEach(function (n) {
      if (n === src || prev[n] === null) return;
      var h = n;
      while (prev[h] !== src) h = prev[h];
      hops[n] = h;
    });
    return hops;
  }

  /* ── TCP Reno congestion window by round. `losses` are rounds with a
     triple duplicate ACK; `timeouts` are rounds with a timeout. ── */
  function reno(rounds, losses, timeouts, initSsthresh) {
    var cwnd = 1, ssthresh = initSsthresh, out = [];
    for (var r = 1; r <= rounds; r++) {
      var phase = cwnd < ssthresh ? 'slow start' : 'congestion avoidance';
      out.push({ round: r, cwnd: cwnd, ssthresh: ssthresh, phase: phase, event: timeouts.indexOf(r) >= 0 ? 'timeout' : losses.indexOf(r) >= 0 ? 'loss' : null });
      if (timeouts.indexOf(r) >= 0) { ssthresh = Math.max(2, Math.floor(cwnd / 2)); cwnd = 1; }
      else if (losses.indexOf(r) >= 0) { ssthresh = Math.max(2, Math.floor(cwnd / 2)); cwnd = ssthresh; }
      else if (cwnd < ssthresh) cwnd = Math.min(cwnd * 2, ssthresh);
      else cwnd += 1;
    }
    return out;
  }

  /* ── IPv4 subnet arithmetic on 32-bit unsigned integers. ── */
  function ip2n(s) {
    var p = s.trim().split('.').map(Number);
    if (p.length !== 4 || p.some(function (x) { return !(x >= 0 && x <= 255) || isNaN(x); })) return null;
    return ((p[0] << 24) >>> 0) + (p[1] << 16) + (p[2] << 8) + p[3];
  }
  function n2ip(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  function subnet(ip, prefix) {
    var n = ip2n(ip);
    if (n === null || !(prefix >= 0 && prefix <= 32)) return null;
    var mask = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
    var net = (n & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0, size = Math.pow(2, 32 - prefix);
    var usable = prefix >= 31 ? size : size - 2;
    return {
      network: n2ip(net), broadcast: n2ip(bc), mask: n2ip(mask), size: size, usable: usable,
      first: n2ip(prefix >= 31 ? net : net + 1), last: n2ip(prefix >= 31 ? bc : bc - 1),
      bits: ('00000000000000000000000000000000' + n.toString(2)).slice(-32)
    };
  }

  var NET = { dijkstra: dijkstra, nextHops: nextHops, reno: reno, subnet: subnet, ip2n: ip2n };
  if (typeof module === 'object' && module.exports) { module.exports = NET; return; }

  var host = document.querySelector('[data-xp="net"]');
  if (!host || !window.XP) return;
  var esc = XP.esc;

  var NODES = ['A', 'B', 'C', 'D', 'E', 'F'];
  var XY = { A: [80, 140], B: [240, 50], C: [240, 230], D: [420, 50], E: [420, 230], F: [560, 140] };
  var S = {
    tab: 'route', src: 'A', step: 0,
    edges: [['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5], ['C', 'E', 8], ['C', 'D', 8], ['D', 'E', 2], ['D', 'F', 6], ['E', 'F', 3]],
    rounds: 24, losses: [12], timeouts: [19], ssthresh: 16,
    ip: '10.1.37.200', prefix: 22
  };

  var PAGES = [
    { t: 'Every router runs the same search', tab: 'route', parts: ['graph'], body: '<p>Each router knows the whole map and its link costs. It runs <b>Dijkstra’s algorithm</b>. At each step it settles the closest unsettled router, then checks whether going through that router shortens the path to its neighbours.</p>' },
    { t: 'Only the first hop is stored', tab: 'route', parts: ['table'], body: '<p>A router’s forwarding table keeps only the next hop for each destination. The next router makes its own choice.</p>' },
    { t: 'TCP probes for capacity', tab: 'tcp', parts: ['cwnd'], body: '<p>TCP cannot see the network’s capacity, so it probes. In <b>slow start</b> the window doubles every round trip. Above the threshold it grows by 1 per round trip.</p>' },
    { t: 'Loss is the signal', tab: 'tcp', parts: ['cwnd'], body: '<p>A <b>triple duplicate ACK</b> halves the window. A <b>timeout</b> is worse news and resets it to 1. The sawtooth is how many connections share one link fairly.</p>' },
    { t: 'Network bits and host bits', tab: 'ip', parts: ['bits'], body: '<p>The prefix length says how many leading bits name the network. Change the prefix and watch the split between network and host bits move, and the range of usable addresses change with it.</p>' }
  ];

  function routeView() {
    var R = dijkstra(NODES, S.edges, S.src), steps = R.steps, k = Math.min(S.step, steps.length);
    var st = k ? steps[k - 1] : { settled: null, dist: (function () { var d = {}; NODES.forEach(function (n) { d[n] = n === S.src ? 0 : Infinity; }); return d; })(), prev: {} };
    var settled = steps.slice(0, k).map(function (x) { return x.settled; });
    var s = '';
    S.edges.forEach(function (e, i) {
      var a = XY[e[0]], b = XY[e[1]], tree = k && (st.prev[e[1]] === e[0] || st.prev[e[0]] === e[1]);
      s += XP.svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], 'class': 'xp-net-edge' + (tree ? ' is-tree' : '') }) +
        XP.svgEl('g', { 'class': 'xp-net-cost' },
          XP.svgEl('rect', { x: (a[0] + b[0]) / 2 - 11, y: (a[1] + b[1]) / 2 - 10, width: 22, height: 18, rx: 4 }) +
          XP.svgEl('text', { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 + 4, 'text-anchor': 'middle' }, String(e[2])));
    });
    NODES.forEach(function (n) {
      var p = XY[n], isS = settled.indexOf(n) >= 0, cur = st.settled === n;
      s += XP.svgEl('g', { 'class': 'xp-net-node' + (isS ? ' is-done' : '') + (cur ? ' is-cur' : '') + (n === S.src ? ' is-src' : '') },
        XP.svgEl('circle', { cx: p[0], cy: p[1], r: 24 }) + XP.svgEl('text', { x: p[0], y: p[1] + 5, 'text-anchor': 'middle' }, n) +
        XP.svgEl('text', { x: p[0], y: p[1] - 32, 'text-anchor': 'middle', 'class': 'xp-net-dist' }, st.dist[n] === Infinity ? '∞' : String(st.dist[n])));
    });
    var hops = nextHops(R.prev, S.src);
    return '<div class="xp-ctl"><div class="xp-seg" role="group" aria-label="Source router">' + NODES.map(function (n) {
      return '<button type="button" data-src="' + n + '" aria-pressed="' + (S.src === n) + '">' + n + '</button>';
    }).join('') + '</div><button type="button" class="xp-go is-inline" data-rstep="-1"' + (k === 0 ? ' disabled' : '') + '>Back</button>' +
      '<button type="button" class="xp-go is-inline" data-rstep="1"' + (k >= steps.length ? ' disabled' : '') + '>Settle next</button>' +
      '<button type="button" class="xp-go is-inline" data-rstep="99">Finish</button>' +
      '<label class="xp-field"><span>Cost of D–E</span><input type="range" min="1" max="12" value="' + S.edges[6][2] + '" data-de><output>' + S.edges[6][2] + '</output></label></div>' +
      '<div class="xp-net-route"><svg viewBox="0 0 640 280" data-part="graph" role="img" aria-label="Network of 6 routers with link costs; numbers above each router are its current distance from ' + S.src + '">' + s + '</svg>' +
      '<div data-part="table"><table class="xp-table is-compact"><caption>' + S.src + '’s forwarding table' + (k < steps.length ? ', when finished' : '') + '</caption><thead><tr><th scope="col">Destination</th><th scope="col">Next hop</th><th scope="col">Cost</th></tr></thead><tbody>' +
      NODES.filter(function (n) { return n !== S.src; }).map(function (n) { return '<tr><th scope="row">' + n + '</th><td>' + (hops[n] || '–') + '</td><td>' + R.dist[n] + '</td></tr>'; }).join('') + '</tbody></table>' +
      '<p class="xp-os-sum" aria-live="polite">' + (k === 0 ? 'Start: only ' + S.src + ' has a known distance, 0.' : 'Step ' + k + ': settled <b>' + st.settled + '</b> at distance ' + st.dist[st.settled] + ', then relaxed its links.') + '</p></div></div>';
  }

  function tcpView() {
    var R = reno(S.rounds, S.losses, S.timeouts, S.ssthresh), W = 900, H = 260, mx = Math.max.apply(null, R.map(function (r) { return r.cwnd; })) + 4;
    var X = function (r) { return 40 + (r - 1) / (S.rounds - 1) * (W - 60); }, Y = function (v) { return H - 30 - v / mx * (H - 50); };
    var s = XP.svgEl('line', { x1: 40, y1: H - 30, x2: W - 20, y2: H - 30, 'class': 'xp-os-tick' });
    s += XP.svgEl('path', { d: R.map(function (r, i) { return (i ? 'L' : 'M') + X(r.round).toFixed(1) + ' ' + Y(r.ssthresh).toFixed(1); }).join(''), 'class': 'xp-net-ss' });
    s += XP.svgEl('path', { d: R.map(function (r, i) { return (i ? 'L' : 'M') + X(r.round).toFixed(1) + ' ' + Y(r.cwnd).toFixed(1); }).join(''), 'class': 'xp-net-cwnd' });
    R.forEach(function (r) {
      s += XP.svgEl('circle', { cx: X(r.round), cy: Y(r.cwnd), r: r.event ? 6 : 4.5, 'class': 'xp-net-pt' + (r.event ? ' is-' + r.event : ''), 'data-round': r.round,
        tabindex: 0, role: 'button', 'aria-label': 'Round ' + r.round + ', window ' + r.cwnd + (r.event ? ', ' + (r.event === 'loss' ? 'triple duplicate ACK' : 'timeout') : '') + '. Enter toggles a loss, Shift and Enter a timeout.' });
      s += XP.svgEl('text', { x: X(r.round), y: H - 12, 'text-anchor': 'middle', 'class': 'xp-cv-small' }, String(r.round));
    });
    return '<div class="xp-ctl"><span class="xp-note">Select a round on the chart, or focus it and press Enter, to toggle a loss there; hold Shift for a timeout.</span>' +
      '<label class="xp-field"><span>Initial threshold</span><input type="range" min="4" max="32" value="' + S.ssthresh + '" data-ss><output>' + S.ssthresh + '</output></label></div>' +
      '<div class="xp-net-tcp"><ol class="xp-net-hs" aria-label="TCP handshake"><li><b>SYN</b> client → server, seq = x</li><li><b>SYN-ACK</b> server → client, seq = y, ack = x + 1</li><li><b>ACK</b> client → server, ack = y + 1</li><li>Data flows, sending at most <b>cwnd</b> segments per round trip</li></ol>' +
      '<figure data-part="cwnd"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Congestion window over ' + S.rounds + ' round trips">' + s + '</svg>' +
      '<figcaption class="xp-net-key"><span class="is-cwnd">congestion window (segments)</span><span class="is-ss">slow-start threshold</span><span class="is-loss">triple duplicate ACK</span><span class="is-timeout">timeout</span></figcaption></figure></div>';
  }

  function ipView() {
    var R = subnet(S.ip, S.prefix);
    return '<div class="xp-ctl"><label class="xp-field"><span>Address</span><input type="text" size="15" data-ip value="' + esc(S.ip) + '" aria-label="IPv4 address"></label>' +
      '<label class="xp-field"><span>Prefix /<output>' + S.prefix + '</output></span><input type="range" min="8" max="32" value="' + S.prefix + '" data-prefix></label></div>' +
      (R ? '<div class="xp-net-bits" data-part="bits" aria-label="Address in binary, network bits first">' + R.bits.split('').map(function (b, i) {
        return (i && i % 8 === 0 ? '<span class="xp-net-dot">.</span>' : '') + '<i class="' + (i < S.prefix ? 'is-net' : 'is-host') + '">' + b + '</i>';
      }).join('') + '</div>' +
        '<table class="xp-table is-compact xp-net-sub"><tbody>' +
        [['Network', R.network + '/' + S.prefix], ['Mask', R.mask], ['Broadcast', R.broadcast], ['Usable hosts', R.first + ' to ' + R.last],
          ['Count', R.usable.toLocaleString() + ' usable of ' + R.size.toLocaleString() + (S.prefix >= 31 ? ' (point-to-point links use all)' : '')]].map(function (r) {
          return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>';
        }).join('') + '</tbody></table>'
        : '<p class="xp-os-sum">Enter an address as 4 numbers from 0 to 255, separated by dots.</p>');
  }

  function render(sel) {
    host.querySelector('.xp-os-body').innerHTML = S.tab === 'route' ? routeView() : S.tab === 'tcp' ? tcpView() : ipView();
    Array.prototype.forEach.call(host.querySelectorAll('[data-tab]'), function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === S.tab)); });
    if (sel) { var e = host.querySelector(sel); if (e && !e.disabled) e.focus(); }
  }

  host.innerHTML = '<div class="xp-toolbar"><div class="xp-tabs" role="tablist" aria-label="Lab">' +
    [['route', 'Routing'], ['tcp', 'TCP'], ['ip', 'Subnets']].map(function (t) {
      return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (S.tab === t[0]) + '">' + t[1] + '</button>';
    }).join('') + '</div></div><div class="xp-stage"><div class="xp-os-body"></div></div>';
  render();
  XP.guide(host.querySelector('.xp-stage'), PAGES, function (p, i, isRedraw) {
    if (!isRedraw && p && p.tab && p.tab !== S.tab) { S.tab = p.tab; render(); }
    XP.highlight(host.querySelector('.xp-os-body'), p ? p.parts : []);
  });

  function toggleRound(pt, shift) {
    var r = +pt.dataset.round, list = shift ? S.timeouts : S.losses, other = shift ? S.losses : S.timeouts;
    var i = list.indexOf(r);
    if (i >= 0) list.splice(i, 1); else { list.push(r); var j = other.indexOf(r); if (j >= 0) other.splice(j, 1); }
    render('[data-round="' + r + '"]');
  }
  host.addEventListener('keydown', function (e) {
    var pt = e.target.closest && e.target.closest('[data-round]');
    if (pt && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggleRound(pt, e.shiftKey); }
  });
  host.addEventListener('click', function (e) {
    var pt = e.target.closest('[data-round]');
    if (pt) { toggleRound(pt, e.shiftKey); return; }
    var b = e.target.closest('button');
    if (!b || b.closest('.xp-guide') || b.classList.contains('xp-guide-open')) return;
    if (b.dataset.tab) { S.tab = b.dataset.tab; render(); return; }
    if (b.dataset.src) { S.src = b.dataset.src; S.step = 0; render('[data-src="' + S.src + '"]'); }
    if (b.dataset.rstep) {
      var d = +b.dataset.rstep, total = dijkstra(NODES, S.edges, S.src).steps.length;
      S.step = d === 99 ? total : Math.max(0, Math.min(total, S.step + d));
      render('[data-rstep="' + b.dataset.rstep + '"]');
    }
  });
  host.addEventListener('input', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-de')) { S.edges[6][2] = +t.value; render('[data-de]'); }
    if (t.hasAttribute('data-ss')) { S.ssthresh = +t.value; render('[data-ss]'); }
    if (t.hasAttribute('data-prefix')) { S.prefix = +t.value; render('[data-prefix]'); }
  });
  host.addEventListener('change', function (e) {
    if (e.target.hasAttribute('data-ip')) { S.ip = e.target.value; render('[data-ip]'); }
  });
})();
