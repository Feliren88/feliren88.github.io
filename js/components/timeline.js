(function () {
  'use strict';

  var raw = document.getElementById('timeline-data');
  if (!raw) return;
  var data;
  try { data = JSON.parse(raw.textContent); } catch (e) { return; }

  var mount = document.getElementById('career-timeline');
  if (!mount) return;

  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Colors ────────────────────────────────────────────────────
  function getColors() {
    var dark = document.documentElement.getAttribute('data-theme') !== 'light';
    return dark ? {
      research: '#7792af', industry: '#6e89a8', community: '#4f8579',
      muted: '#8b9db5', text: '#d3dceb',
      highlightFill: '#eef3fb', highlightRing: '#c9d8f0',
      axis: 'rgba(119,146,175,0.2)', trail: 'rgba(119,146,175,0.22)',
    } : {
      research: '#3f6490', industry: '#2e5070', community: '#1e6e5a',
      muted: '#3d506b', text: '#141c28',
      highlightFill: '#0a1f3a', highlightRing: '#1a3a5c',
      axis: 'rgba(63,100,144,0.18)', trail: 'rgba(63,100,144,0.18)',
    };
  }

  // ── Layout ────────────────────────────────────────────────────
  var YEAR_START = 2021, YEAR_END = 2026.5;

  function makeLayout() {
    var w = mount.clientWidth || 800;
    var h = 260, pl = 18, pr = 20, pt = 52, pb = 52;
    var iw = w - pl - pr, ih = h - pt - pb;
    var midY = pt + ih * 0.5;
    return {
      w: w, h: h, pt: pt, pb: pb, pl: pl, pr: pr,
      midY: midY,
      xFor: function (yr) { return pl + (yr - YEAR_START) / (YEAR_END - YEAR_START) * iw; },
      yFor: function () { return midY; },
      rFor: function (mo) { return Math.min(30, Math.max(12, Math.sqrt(mo) * 4.8)); },
    };
  }

  // ── State ─────────────────────────────────────────────────────
  var L = makeLayout();
  var C = getColors();
  var nodes = data.nodes.map(function (nd) {
    var midYr = nd.start_year + (nd.end_year - nd.start_year) / 2;
    var tx = L.xFor(midYr), ty = L.yFor(nd.track), r = L.rFor(nd.duration_months);
    return { id: nd.id, data: nd, x: tx, y: ty, vx: 0, vy: 0, tx: tx, ty: ty, r: r, visible: false, dragging: false };
  });
  var beatIndex = 0, playing = false, beatTimeouts = [], rafId = null;
  var dragNode = null, dragStartX = 0, dragStartY = 0;
  var orbitAngle = 0;
  var BEATS = data.beats;

  function getNode(id) { return nodes.find(function (n) { return n.id === id; }); }
  function trackColor(t) { return ({ research: C.research, industry: C.industry, community: C.community })[t] || C.research; }

  // ── SVG helpers ───────────────────────────────────────────────
  var NS = 'http://www.w3.org/2000/svg';
  function mkEl(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  // ── Build DOM ─────────────────────────────────────────────────
  var svgRoot = mkEl('svg', { 'class': 'tl-svg', 'aria-hidden': 'true', width: L.w, height: L.h });
  mount.appendChild(svgRoot);

  var overlay = document.createElement('div');
  overlay.className = 'tl-overlay';
  mount.appendChild(overlay);

  var beatTitleEl = document.createElement('h3');
  beatTitleEl.className = 'tl-beat-title';
  overlay.appendChild(beatTitleEl);

  var beatCaptEl = document.createElement('p');
  beatCaptEl.className = 'tl-beat-capt';
  overlay.appendChild(beatCaptEl);

  var panel = document.createElement('div');
  panel.className = 'tl-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.innerHTML = '<button class="tl-panel-close" aria-label="Close detail">✕</button><div class="tl-panel-body"></div>';
  mount.appendChild(panel);
  panel.querySelector('.tl-panel-close').addEventListener('click', closePanel);

  var controls = document.createElement('div');
  controls.className = 'tl-controls';
  mount.appendChild(controls);

  var scrubberEl = document.createElement('input');
  scrubberEl.type = 'range'; scrubberEl.min = '0'; scrubberEl.max = String(BEATS.length - 1); scrubberEl.value = '0';
  scrubberEl.className = 'tl-scrubber';
  scrubberEl.setAttribute('role', 'slider');
  scrubberEl.setAttribute('aria-label', 'Timeline chapter');
  scrubberEl.setAttribute('aria-valuemin', '0');
  scrubberEl.setAttribute('aria-valuemax', String(BEATS.length - 1));
  scrubberEl.setAttribute('aria-valuenow', '0');
  controls.appendChild(scrubberEl);

  var replayEl = document.createElement('button');
  replayEl.className = 'tl-replay tl-replay--hidden';
  replayEl.type = 'button'; replayEl.textContent = '✦ Replay';
  controls.appendChild(replayEl);
  replayEl.addEventListener('click', play);
  scrubberEl.addEventListener('input', function () { jumpToBeat(parseInt(scrubberEl.value, 10)); });

  // ── SVG layers ────────────────────────────────────────────────
  var axisG = mkEl('g', { id: 'tl-axis' });
  var nodesG = mkEl('g', { id: 'tl-nodes' });
  svgRoot.appendChild(axisG);
  svgRoot.appendChild(nodesG);

  var nodeElems = {};

  function drawAxis() {
    axisG.innerHTML = '';
    var iw = L.w - L.pl - L.pr;
    var ay = L.h - L.pb + 14;

    // Single horizontal guide through the midpoint (the timeline spine)
    axisG.appendChild(mkEl('line', {
      x1: L.pl, y1: L.midY, x2: L.pl + iw, y2: L.midY,
      stroke: C.trail, 'stroke-width': '0.5',
    }));

    // Year axis at bottom
    axisG.appendChild(mkEl('line', { x1: L.pl, y1: ay, x2: L.pl + iw, y2: ay, stroke: C.axis, 'stroke-width': '1' }));
    for (var yr = 2021; yr <= 2026; yr++) {
      var x = L.xFor(yr);
      axisG.appendChild(mkEl('line', { x1: x, y1: ay, x2: x, y2: ay + 5, stroke: C.axis, 'stroke-width': '1' }));
      // Vertical tick from year mark up to the spine
      axisG.appendChild(mkEl('line', { x1: x, y1: L.midY, x2: x, y2: ay, stroke: C.trail, 'stroke-width': '0.3', 'stroke-dasharray': '2,6' }));
      var t = mkEl('text', { x: x, y: ay + 17, 'text-anchor': 'middle', 'font-size': '10', 'font-family': 'Manrope, sans-serif', fill: C.muted, opacity: '0.65' });
      t.textContent = yr;
      axisG.appendChild(t);
    }
  }

  function buildNodeElems() {
    nodes.forEach(function (n) {
      var g = mkEl('g', {
        'class': 'tl-node', 'id': 'tln-' + n.id,
        'role': 'button', 'tabindex': '0',
        'aria-label': n.data.dates + ' · ' + n.data.label + ', click for detail',
      });
      g.style.cursor = 'pointer';
      // CSS sets initial opacity: 0 on .tl-node

      // Orbit rings
      g.appendChild(mkEl('circle', { r: n.r + 14, fill: 'none', stroke: C.trail, 'stroke-width': '0.5' }));
      g.appendChild(mkEl('circle', { r: n.r + 26, fill: 'none', stroke: C.trail, 'stroke-width': '0.4' }));

      // Satellite dots (position updated in physics loop)
      var satA = mkEl('circle', { r: '3.5', fill: trackColor(n.data.track), opacity: '0.55', 'class': 'tl-sat-a' });
      var satB = mkEl('circle', { r: '2.5', fill: trackColor(n.data.track), opacity: '0.4', 'class': 'tl-sat-b' });
      g.appendChild(satA); g.appendChild(satB);

      // Highlight rings (hidden until activated)
      var ring = mkEl('circle', { r: n.r * 1.45, fill: 'none', stroke: C.highlightRing, 'stroke-width': '1', 'class': 'tl-hring' });
      ring.style.opacity = '0';
      var ring2 = mkEl('circle', { r: n.r * 1.9, fill: 'none', stroke: C.highlightRing, 'stroke-width': '0.5', 'class': 'tl-hring2' });
      ring2.style.opacity = '0';
      g.appendChild(ring); g.appendChild(ring2);

      // Node body
      var circle = mkEl('circle', { r: n.r, fill: trackColor(n.data.track), 'fill-opacity': '0.13', stroke: trackColor(n.data.track), 'stroke-width': '1.5' });
      g.appendChild(circle);

      // Highlight fill
      var hfill = mkEl('circle', { r: n.r * 0.36, fill: C.highlightFill, 'class': 'tl-hfill' });
      hfill.style.opacity = '0';
      g.appendChild(hfill);

      // Center dot
      var dot = mkEl('circle', { r: Math.max(3, n.r * 0.28), fill: trackColor(n.data.track) });
      g.appendChild(dot);

      // Label
      var label = mkEl('text', { y: -(n.r + 9), 'text-anchor': 'middle', 'font-size': '11.5', 'font-family': 'Space Grotesk, sans-serif', 'font-weight': '500', fill: C.text });
      label.textContent = n.data.label;
      g.appendChild(label);

      // Interactions
      g.addEventListener('click', function () { togglePanel(n); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePanel(n); } });
      g.addEventListener('mouseenter', function () { if (!dragNode) dimAll(n.id); });
      g.addEventListener('mouseleave', function () { if (!dragNode) dimAll(null); });
      g.addEventListener('pointerdown', function (e) { startDrag(e, n); });

      nodesG.appendChild(g);
      nodeElems[n.id] = { g: g, circle: circle, ring: ring, ring2: ring2, hfill: hfill, dot: dot, label: label, satA: satA, satB: satB };
    });
  }

  // ── Physics loop ──────────────────────────────────────────────
  function physicsStep() {
    orbitAngle += 0.007;

    nodes.forEach(function (n) {
      if (!n.visible || n.dragging) return;
      n.vx += (n.tx - n.x) * 0.055;
      n.vy += (n.ty - n.y) * 0.055;
      n.vx *= 0.82; n.vy *= 0.82;
      n.x += n.vx; n.y += n.vy;
    });

    for (var i = 0; i < nodes.length; i++) {
      if (!nodes[i].visible) continue;
      for (var j = i + 1; j < nodes.length; j++) {
        if (!nodes[j].visible) continue;
        var dx = nodes[j].x - nodes[i].x;
        var dy = nodes[j].y - nodes[i].y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var minD = nodes[i].r + nodes[j].r + 14;
        if (dist < minD) {
          var f = (minD - dist) / dist * 0.22;
          if (!nodes[i].dragging) { nodes[i].vx -= dx * f; nodes[i].vy -= dy * f; }
          if (!nodes[j].dragging) { nodes[j].vx += dx * f; nodes[j].vy += dy * f; }
        }
      }
    }

    nodes.forEach(function (n) {
      if (!n.visible) return;
      var e = nodeElems[n.id];
      if (!e) return;
      e.g.setAttribute('transform', 'translate(' + n.x.toFixed(1) + ',' + n.y.toFixed(1) + ')');
      var r1 = n.r + 14, r2 = n.r + 26;
      var ang = orbitAngle + n.r * 0.05;
      e.satA.setAttribute('cx', (Math.cos(ang) * r1).toFixed(1));
      e.satA.setAttribute('cy', (Math.sin(ang) * r1).toFixed(1));
      e.satB.setAttribute('cx', (Math.cos(ang * 0.65 + 2.1) * r2).toFixed(1));
      e.satB.setAttribute('cy', (Math.sin(ang * 0.65 + 2.1) * r2).toFixed(1));
    });

    rafId = requestAnimationFrame(physicsStep);
  }

  // ── Drag ──────────────────────────────────────────────────────
  function startDrag(e, n) {
    if (!n.visible) return;
    var rect = svgRoot.getBoundingClientRect();
    dragStartX = e.clientX - rect.left - n.x;
    dragStartY = e.clientY - rect.top - n.y;
    dragNode = n; n.dragging = true;
    window.addEventListener('pointermove', onDrag);
    window.addEventListener('pointerup', endDrag);
    e.preventDefault();
  }

  function onDrag(e) {
    if (!dragNode) return;
    var rect = svgRoot.getBoundingClientRect();
    dragNode.x = Math.max(dragNode.r + 5, Math.min(L.w - dragNode.r - 5, e.clientX - rect.left - dragStartX));
    dragNode.y = Math.max(dragNode.r + 5, Math.min(L.h - L.pb - 8, e.clientY - rect.top - dragStartY));
  }

  function endDrag() {
    if (!dragNode) return;
    dragNode.dragging = false; dragNode.vx = 0; dragNode.vy = 0;
    dragNode = null;
    window.removeEventListener('pointermove', onDrag);
    window.removeEventListener('pointerup', endDrag);
  }

  // ── Panel ─────────────────────────────────────────────────────
  var activeNodeId = null;

  function togglePanel(n) {
    if (!panel.hidden && activeNodeId === n.id) { closePanel(); return; }
    activeNodeId = n.id;
    var hl = data.highlights.find(function (h) { return h.node === n.id; });
    panel.querySelector('.tl-panel-body').innerHTML =
      '<p class="tl-panel-dates">' + escHtml(n.data.dates) + '</p>' +
      '<strong class="tl-panel-org">' + escHtml(n.data.org) + '</strong>' +
      '<p class="tl-panel-impact">' + escHtml(n.data.impact) + '</p>' +
      (hl ? '<a class="tl-panel-link" href="' + hl.url + '" target="_blank" rel="noreferrer">' + escHtml(hl.label) + ' ↗</a>' : '');
    panel.hidden = false;
  }

  function closePanel() { panel.hidden = true; activeNodeId = null; dimAll(null); }

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
    if (e.key === 'r' || e.key === 'R') { if (document.activeElement && mount.contains(document.activeElement)) play(); }
  });

  // ── Hover dim ─────────────────────────────────────────────────
  function dimAll(activeId) {
    nodes.forEach(function (n) {
      var e = nodeElems[n.id];
      if (!e || !n.visible) return;
      e.g.style.transition = 'opacity 220ms cubic-bezier(0.4,0,0.2,1)';
      e.g.style.opacity = (!activeId || n.id === activeId) ? '1' : '0.28';
    });
  }

  // ── Beat text ─────────────────────────────────────────────────
  var beatTextTid;
  function showBeatText(title, caption) {
    beatTitleEl.style.opacity = '0';
    beatCaptEl.style.opacity = '0';
    clearTimeout(beatTextTid);
    beatTextTid = setTimeout(function () {
      beatTitleEl.textContent = title;
      beatCaptEl.textContent = caption;
      beatTitleEl.style.opacity = title ? '1' : '0';
      beatCaptEl.style.opacity = caption ? '1' : '0';
    }, 150);
  }

  // ── Enter node ────────────────────────────────────────────────
  function enterNode(id) {
    var n = getNode(id), e = nodeElems[id];
    if (!n || !e) return;
    n.visible = true;
    n.x = n.tx; n.y = n.ty + 55; n.vx = 0; n.vy = -1.5;
    e.g.setAttribute('transform', 'translate(' + n.x.toFixed(1) + ',' + n.y.toFixed(1) + ')');
    e.g.style.transition = 'opacity 600ms cubic-bezier(0.22,1,0.36,1)';
    e.g.style.opacity = '1';
  }

  // ── Highlight mark ────────────────────────────────────────────
  function activateHighlight(hid, delay) {
    if (!hid) return;
    var hl = data.highlights.find(function (h) { return h.id === hid; });
    if (!hl) return;
    var e = nodeElems[hl.node];
    if (!e) return;
    setTimeout(function () {
      e.ring.style.transition = 'opacity 800ms cubic-bezier(0.22,1,0.36,1)';
      e.ring.style.opacity = '1';
      e.ring2.style.transition = 'opacity 1100ms cubic-bezier(0.22,1,0.36,1)';
      e.ring2.style.opacity = '0.55';
      e.hfill.style.transition = 'opacity 600ms cubic-bezier(0.22,1,0.36,1)';
      e.hfill.style.opacity = '1';
      e.ring.classList.add('tl-hring--active');
      e.ring2.classList.add('tl-hring2--active');
    }, delay);
  }

  function deactivateAllHighlights() {
    Object.keys(nodeElems).forEach(function (id) {
      var e = nodeElems[id];
      e.ring.style.transition = ''; e.ring.style.opacity = '0'; e.ring.classList.remove('tl-hring--active');
      e.ring2.style.transition = ''; e.ring2.style.opacity = '0'; e.ring2.classList.remove('tl-hring2--active');
      e.hfill.style.transition = ''; e.hfill.style.opacity = '0';
    });
  }

  // ── Beat sequencer ────────────────────────────────────────────
  function cancelBeatTimeouts() {
    beatTimeouts.forEach(clearTimeout); beatTimeouts = []; playing = false;
  }

  function setScrubber(idx) {
    scrubberEl.value = String(idx);
    scrubberEl.setAttribute('aria-valuenow', String(idx));
    var beat = BEATS[Math.min(idx, BEATS.length - 1)];
    scrubberEl.setAttribute('aria-valuetext', beat ? (beat.title || 'Chapter ' + idx) : '');
  }

  function playBeat(idx) {
    if (idx >= BEATS.length) {
      playing = false;
      replayEl.classList.remove('tl-replay--hidden');
      setScrubber(BEATS.length - 1);
      return;
    }
    beatIndex = idx;
    setScrubber(idx);
    var beat = BEATS[idx];
    showBeatText(beat.title || '', beat.caption || '');
    var enters = beat.enters || [];
    enters.forEach(function (nid, i) { setTimeout(function () { enterNode(nid); }, i * 280); });
    if (beat.highlight_mark) activateHighlight(beat.highlight_mark, 600);

    // Auto-show panel for first entering node
    if (enters.length > 0) {
      beatTimeouts.push(setTimeout(function () {
        panel.hidden = true; activeNodeId = null;
        var n = getNode(enters[0]);
        if (n && n.visible) togglePanel(n);
      }, 520));
    }

    var dur = (beat.end_ms || 3000) - (beat.start_ms || 0);
    beatTimeouts.push(setTimeout(function () { playBeat(idx + 1); }, dur));
  }

  function play() {
    cancelBeatTimeouts();
    nodes.forEach(function (n) { n.visible = false; n.x = n.tx; n.y = n.ty; n.vx = 0; n.vy = 0; });
    Object.keys(nodeElems).forEach(function (id) {
      var e = nodeElems[id];
      e.g.style.transition = '';
      e.g.style.opacity = '0';
    });
    deactivateAllHighlights();
    panel.hidden = true; activeNodeId = null;
    replayEl.classList.add('tl-replay--hidden');
    playing = true;
    axisG.style.opacity = '0';
    axisG.style.transition = 'opacity 1200ms cubic-bezier(0.22,1,0.36,1)';
    requestAnimationFrame(function () { axisG.style.opacity = '1'; });
    setTimeout(function () { playBeat(0); }, 80);
  }

  function jumpToBeat(idx) {
    cancelBeatTimeouts();
    var entered = {};
    for (var i = 0; i <= idx && i < BEATS.length; i++) {
      (BEATS[i].enters || []).forEach(function (nid) { entered[nid] = true; });
    }
    nodes.forEach(function (n) {
      var e = nodeElems[n.id];
      if (!e) return;
      n.visible = !!entered[n.id];
      e.g.style.transition = 'opacity 400ms cubic-bezier(0.4,0,0.2,1)';
      e.g.style.opacity = n.visible ? '1' : '0';
    });
    deactivateAllHighlights();
    for (var i = 0; i <= idx && i < BEATS.length; i++) {
      if (BEATS[i].highlight_mark) activateHighlight(BEATS[i].highlight_mark, 0);
    }
    var beat = BEATS[Math.min(idx, BEATS.length - 1)];
    showBeatText(beat.title || '', beat.caption || '');
    beatIndex = idx;
    setScrubber(idx);
    if (idx >= BEATS.length - 1) replayEl.classList.remove('tl-replay--hidden');
    else replayEl.classList.add('tl-replay--hidden');
  }

  function skipToCoda() {
    nodes.forEach(function (n) {
      var e = nodeElems[n.id];
      n.visible = true;
      if (e) e.g.style.opacity = '1';
    });
    data.highlights.forEach(function (hl) { activateHighlight(hl.id, 0); });
    var last = BEATS[BEATS.length - 1];
    showBeatText(last.title || '', last.caption || '');
    setScrubber(BEATS.length - 1);
    replayEl.classList.remove('tl-replay--hidden');
    // Auto-show last entering node panel
    var lastEnters = (last.enters || []);
    if (lastEnters.length > 0) {
      var n = getNode(lastEnters[0]);
      if (n) togglePanel(n);
    }
  }

  // ── Theme ─────────────────────────────────────────────────────
  new MutationObserver(function () {
    C = getColors();
    drawAxis();
    nodes.forEach(function (n) {
      var e = nodeElems[n.id];
      if (!e) return;
      var tc = trackColor(n.data.track);
      e.circle.setAttribute('fill', tc); e.circle.setAttribute('stroke', tc);
      e.dot.setAttribute('fill', tc);
      e.satA.setAttribute('fill', tc); e.satB.setAttribute('fill', tc);
      e.label.setAttribute('fill', C.text);
      e.ring.setAttribute('stroke', C.highlightRing); e.ring2.setAttribute('stroke', C.highlightRing);
      e.hfill.setAttribute('fill', C.highlightFill);
    });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ── Resize ────────────────────────────────────────────────────
  var resizeTid;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTid);
    resizeTid = setTimeout(function () {
      L = makeLayout();
      svgRoot.setAttribute('width', L.w); svgRoot.setAttribute('height', L.h);
      drawAxis();
      nodes.forEach(function (n) {
        var midYr = n.data.start_year + (n.data.end_year - n.data.start_year) / 2;
        n.tx = L.xFor(midYr); n.ty = L.yFor(n.data.track); n.r = L.rFor(n.data.duration_months);
      });
    }, 180);
  });

  // ── Init ──────────────────────────────────────────────────────
  drawAxis();
  buildNodeElems();

  // Hide fallback (sibling inside #track-record)
  var trackRecord = document.getElementById('track-record');
  if (trackRecord) {
    var fallback = trackRecord.querySelector('.timeline-fallback');
    if (fallback) fallback.hidden = true;
  }

  rafId = requestAnimationFrame(physicsStep);
  if (reducedMotion) skipToCoda();
  else play();

})();
