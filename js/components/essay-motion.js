/**
 * Scroll-built explanatory scenes for the eleven featured writings.
 * Scene construction follows Manim's staged-object model; the pinned scrub
 * follows the scroll-linked sequencing used by GSAP and Apple product pages.
 */
(function () {
  'use strict';

  var key = document.documentElement.dataset.motionScene;
  var scenes = {
    repair: { kicker: 'A good system should not need rescue', title: 'Fix the cause.', copy: 'Trace the break, find the pattern, and change the system so the same problem stops coming back.', steps: ['Break', 'Inspect', 'Redesign', 'Release'], nodes: [[95,220,'break','burst'],[270,105,'pattern','circle'],[455,220,'method','square'],[650,105,'system','diamond']] },
    abstain: { kicker: 'Capability needs a stopping rule', title: 'Build the boundary.', copy: 'Measure the evidence. When support weakens, stop predicting and send the decision for review.', steps: ['Evidence', 'Measure', 'Abstain', 'Review'], nodes: [[95,110,'evidence','circle'],[275,220,'support','square'],[465,110,'stop','diamond'],[650,220,'review','circle']] },
    agency: { kicker: 'You can begin before you are sure', title: 'Turn intent into evidence.', copy: 'Notice what is happening. Run one small test, learn from the result, and use it to choose your next move.', steps: ['Notice', 'Test', 'Learn', 'Move'], nodes: [[95,220,'notice','circle'],[280,100,'test','diamond'],[465,220,'learn','square'],[650,100,'move','circle']] },
    decision: { kicker: 'Pressure changes what comes first', title: 'Protect the floor.', copy: 'Name the kind of decision you face. Slow down what cannot be undone, test what can, and leave yourself room to try again.', steps: ['Classify', 'Protect', 'Test', 'Commit'], nodes: [[95,105,'classify','square'],[275,220,'floor','diamond'],[465,105,'test','circle'],[650,220,'commit','square']] },
    control: { kicker: 'You still choose your response', title: 'Find what is yours.', copy: 'Separate what happened from what you think about it. Then choose the next action that is still in your hands.', steps: ['Event', 'Judgment', 'Choice', 'Action'], nodes: [[95,220,'event','circle'],[275,105,'judgment','square'],[465,220,'choice','diamond'],[650,105,'action','circle']] },
    strategy: { kicker: 'Every move changes what comes next', title: 'Watch the response.', copy: 'Your move changes the other person’s choices. Their response changes what makes sense for you to do next.', steps: ['Choose', 'Respond', 'Update', 'Repeat'], nodes: [[95,105,'you','circle'],[275,220,'them','circle'],[465,105,'payoff','square'],[650,220,'next round','diamond']] },
    feedback: { kicker: 'Read the result without making it your identity', title: 'Find what caused it.', copy: 'Separate skill from luck, trace what produced the outcome, and use that evidence in the next attempt.', steps: ['Outcome', 'Diagnose', 'Update', 'Continue'], nodes: [[95,220,'result','burst'],[275,105,'cause','circle'],[465,220,'update','square'],[650,105,'next','diamond']] },
    uncertainty: { kicker: 'The future is still open', title: 'Act without a guarantee.', copy: 'Name what you feel and gather facts that could change the decision. Stop when more thought only repeats the same fear.', steps: ['Feel', 'Check', 'Choose', 'Proceed'], nodes: [[95,105,'feeling','circle'],[275,220,'evidence','square'],[465,105,'choice','diamond'],[650,220,'proceed','circle']] },
    signal: { kicker: 'The other person needs a clear path', title: 'Make it easy to follow.', copy: 'Give the listener a clear point, enough context, and a next step they can question or use.', steps: ['Intent', 'Structure', 'Signal', 'Received'], nodes: [[95,220,'intent','circle'],[275,105,'structure','square'],[465,220,'signal','diamond'],[650,105,'received','circle']] },
    consent: { kicker: 'Being able to carry it does not make it yours', title: 'Choose before you endure.', copy: 'Before strength accepts another demand, decide whether it deserves your time and what boundary it requires.', steps: ['Demand', 'Capacity', 'Consent', 'Boundary'], nodes: [[95,105,'demand','burst'],[275,220,'capacity','circle'],[465,105,'consent','diamond'],[650,220,'boundary','square']] },
    conversion: { kicker: 'Hard times can leave something useful', title: 'Build from what happened.', copy: 'With support, rest, and honest thought, a hard period can teach lessons that remain useful after it ends.', steps: ['Challenge', 'Support', 'Respond', 'Build'], nodes: [[95,220,'challenge','burst'],[275,105,'support','circle'],[465,220,'response','diamond'],[650,105,'capacity','square']] }
  };
  var scene = scenes[key];
  var root = document.querySelector('.page-content');
  if (!scene || !root) return;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function svgEl(tag, attrs) {
    var node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.keys(attrs || {}).forEach(function (name) { node.setAttribute(name, attrs[name]); });
    return node;
  }
  function shape(group, x, y, kind) {
    var node;
    if (kind === 'square') node = svgEl('rect', { x: x - 39, y: y - 39, width: 78, height: 78, rx: 13, class: 'em-node-shape' });
    else if (kind === 'diamond') node = svgEl('path', { d: 'M' + x + ' ' + (y - 48) + 'L' + (x + 48) + ' ' + y + 'L' + x + ' ' + (y + 48) + 'L' + (x - 48) + ' ' + y + 'Z', class: 'em-node-shape' });
    else if (kind === 'burst') node = svgEl('path', { d: 'M' + x + ' ' + (y - 48) + 'L' + (x + 13) + ' ' + (y - 22) + 'L' + (x + 42) + ' ' + (y - 28) + 'L' + (x + 27) + ' ' + y + 'L' + (x + 46) + ' ' + (y + 25) + 'L' + (x + 15) + ' ' + (y + 21) + 'L' + x + ' ' + (y + 48) + 'L' + (x - 14) + ' ' + (y + 21) + 'L' + (x - 45) + ' ' + (y + 27) + 'L' + (x - 28) + ' ' + y + 'L' + (x - 42) + ' ' + (y - 28) + 'L' + (x - 13) + ' ' + (y - 22) + 'Z', class: 'em-node-shape' });
    else node = svgEl('circle', { cx: x, cy: y, r: 43, class: 'em-node-shape' });
    group.appendChild(node);
  }

  var host = el('section', 'em-story');
  host.setAttribute('aria-label', scene.kicker);
  var pin = el('div', 'em-pin');
  var copy = el('div', 'em-copy');
  copy.appendChild(el('span', 'em-kicker', scene.kicker));
  copy.appendChild(el('h2', '', scene.title));
  copy.appendChild(el('p', '', scene.copy));
  var read = el('div', 'em-stage-read');
  read.appendChild(el('b', '', '01')); read.appendChild(el('i')); read.appendChild(el('span', '', scene.steps[0])); copy.appendChild(read);
  pin.appendChild(copy);

  var canvas = el('div', 'em-canvas');
  var svg = svgEl('svg', { viewBox: '0 0 750 330', role: 'img', 'aria-label': scene.steps.join(' to ') });
  var grid = svgEl('g', { class: 'em-grid', 'aria-hidden': 'true' });
  [55,110,165,220,275].forEach(function (y) { grid.appendChild(svgEl('line', { x1: 25, y1: y, x2: 725, y2: y })); });
  svg.appendChild(grid);
  svg.appendChild(svgEl('circle', { cx: 375, cy: 165, r: 145, class: 'em-orbit' }));
  svg.appendChild(svgEl('circle', { cx: 375, cy: 165, r: 78, class: 'em-pulse' }));
  var edges = [];
  scene.nodes.slice(0, -1).forEach(function (point, index) {
    var next = scene.nodes[index + 1];
    var path = svgEl('path', { d: 'M' + point[0] + ' ' + point[1] + ' C' + (point[0] + 75) + ' ' + point[1] + ' ' + (next[0] - 75) + ' ' + next[1] + ' ' + next[0] + ' ' + next[1], class: 'em-edge', pathLength: '1' });
    edges.push(path); svg.appendChild(path);
  });
  var nodes = [];
  scene.nodes.forEach(function (point) {
    var group = svgEl('g', { class: 'em-node' });
    shape(group, point[0], point[1], point[3]);
    var label = svgEl('text', { x: point[0], y: point[1] + 5 }); label.textContent = point[2]; group.appendChild(label);
    nodes.push(group); svg.appendChild(group);
  });
  canvas.appendChild(svg); pin.appendChild(canvas);

  var steps = el('ol', 'em-steps');
  scene.steps.forEach(function (label, index) { var item = el('li'); item.appendChild(el('b', '', '0' + (index + 1))); item.appendChild(el('span', '', label)); steps.appendChild(item); });
  pin.appendChild(steps);
  var skip = el('button', 'em-skip', 'Skip scene ↓'); skip.type = 'button'; pin.appendChild(skip);
  host.appendChild(pin);

  var anchor = root.querySelector(':scope > [class*="-hero"]') || Array.prototype.find.call(root.children, function (child) { return child.matches && child.matches('header, section'); });
  if (anchor && anchor.nextSibling) root.insertBefore(host, anchor.nextSibling); else root.appendChild(host);

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ticking = false;
  function alignToViewport() {
    host.style.setProperty('--em-gutter', root.getBoundingClientRect().left.toFixed(2) + 'px');
  }
  function paint() {
    var rect = host.getBoundingClientRect();
    var span = Math.max(1, host.offsetHeight - innerHeight);
    var progress = reduced ? 1 : Math.max(0, Math.min(1, -rect.top / span));
    host.style.setProperty('--em-p', progress.toFixed(4));
    host.style.setProperty('--em-x', (20 + progress * 55).toFixed(2) + '%');
    var stage = Math.min(3, Math.floor(progress * 4));
    read.querySelector('b').textContent = '0' + (stage + 1); read.querySelector('span').textContent = scene.steps[stage];
    Array.prototype.forEach.call(steps.children, function (item, index) { item.classList.toggle('is-active', index <= stage); });
    nodes.forEach(function (node, index) { var local = Math.max(0, Math.min(1, (progress - index * .22) * 4)); node.style.opacity = (.12 + local * .88).toFixed(3); node.style.transform = 'scale(' + (.72 + local * .28).toFixed(3) + ')'; });
    edges.forEach(function (edge, index) { var local = Math.max(0, Math.min(1, (progress - index * .24) * 3.2)); edge.style.strokeDashoffset = (1 - local).toFixed(3); });
    ticking = false;
  }
  function requestPaint() { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }
  skip.addEventListener('click', function () { host.scrollIntoView({ block: 'end', behavior: reduced ? 'auto' : 'smooth' }); });
  function resize() { alignToViewport(); requestPaint(); }
  addEventListener('scroll', requestPaint, { passive: true }); addEventListener('resize', resize); alignToViewport(); paint();
})();
