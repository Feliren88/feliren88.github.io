/**
 * Scroll-built explanatory scenes for the eleven featured writings.
 * Scene construction follows Manim's staged-object model; the pinned scrub
 * follows the scroll-linked sequencing used by GSAP and Apple product pages.
 */
(function () {
  'use strict';

  var key = document.documentElement.dataset.motionScene;
  var scenes = {
    repair: { kicker: 'A system can outlive the rescue', title: 'Move upstream.', copy: 'Watch one recurring break become a diagnosis, a method, and finally a structure that no longer depends on heroics.', steps: ['Break', 'Inspect', 'Redesign', 'Release'], nodes: [[95,220,'break','burst'],[270,105,'pattern','circle'],[455,220,'method','square'],[650,105,'system','diamond']] },
    abstain: { kicker: 'Capability needs a stopping rule', title: 'Build the boundary.', copy: 'Evidence moves through the system until weak support changes the correct action from prediction to review.', steps: ['Evidence', 'Measure', 'Abstain', 'Review'], nodes: [[95,110,'evidence','circle'],[275,220,'support','square'],[465,110,'stop','diamond'],[650,220,'review','circle']] },
    agency: { kicker: 'Motion begins before certainty', title: 'Turn intent into evidence.', copy: 'A vague problem becomes tractable when observation leads to one test, then another, then a result the next decision can use.', steps: ['Notice', 'Test', 'Learn', 'Move'], nodes: [[95,220,'notice','circle'],[280,100,'test','diamond'],[465,220,'learn','square'],[650,100,'move','circle']] },
    decision: { kicker: 'Pressure changes the order', title: 'Protect the floor.', copy: 'Classify the decision, slow what cannot be reversed, test what can, and preserve the conditions needed for another round.', steps: ['Classify', 'Protect', 'Test', 'Commit'], nodes: [[95,105,'classify','square'],[275,220,'floor','diamond'],[465,105,'test','circle'],[650,220,'commit','square']] },
    control: { kicker: 'The response still contains a choice', title: 'Find what is yours.', copy: 'Separate the event from the judgment, place attention in the gap, and return the next action to your control.', steps: ['Event', 'Judgment', 'Choice', 'Action'], nodes: [[95,220,'event','circle'],[275,105,'judgment','square'],[465,220,'choice','diamond'],[650,105,'action','circle']] },
    strategy: { kicker: 'Every move changes the next board', title: 'See the response.', copy: 'Your action enters another person’s incentives, returns as a response, and changes which move is rational next.', steps: ['Choose', 'Respond', 'Update', 'Repeat'], nodes: [[95,105,'you','circle'],[275,220,'them','circle'],[465,105,'payoff','square'],[650,220,'next round','diamond']] },
    feedback: { kicker: 'An outcome is evidence, not identity', title: 'Read the result.', copy: 'Separate skill from luck, find the mechanism that produced the outcome, and let the next move inherit the lesson.', steps: ['Outcome', 'Diagnose', 'Update', 'Continue'], nodes: [[95,220,'result','burst'],[275,105,'cause','circle'],[465,220,'update','square'],[650,105,'next','diamond']] },
    uncertainty: { kicker: 'The future stays partly open', title: 'Act without a guarantee.', copy: 'Name the feeling, gather information that can change the decision, and stop when further thought only repeats discomfort.', steps: ['Feel', 'Check', 'Choose', 'Proceed'], nodes: [[95,105,'feeling','circle'],[275,220,'evidence','square'],[465,105,'choice','diamond'],[650,220,'proceed','circle']] },
    signal: { kicker: 'Meaning must survive transmission', title: 'Build the bridge.', copy: 'Compress the whole map into a path the listener can enter, follow, question, and use.', steps: ['Intent', 'Structure', 'Signal', 'Received'], nodes: [[95,220,'intent','circle'],[275,105,'structure','square'],[465,220,'signal','diamond'],[650,105,'received','circle']] },
    consent: { kicker: 'Capacity does not grant permission', title: 'Put consent in the loop.', copy: 'Strength can accept a demand; judgment checks whether the demand deserves a life before endurance takes over.', steps: ['Demand', 'Capacity', 'Consent', 'Boundary'], nodes: [[95,105,'demand','burst'],[275,220,'capacity','circle'],[465,105,'consent','diamond'],[650,220,'boundary','square']] },
    conversion: { kicker: 'Difficulty is raw material', title: 'Choose the conversion.', copy: 'Challenge meets support, recovery, and response. Only then can pressure become judgment that remains useful later.', steps: ['Challenge', 'Support', 'Respond', 'Build'], nodes: [[95,220,'challenge','burst'],[275,105,'support','circle'],[465,220,'response','diamond'],[650,105,'capacity','square']] }
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
  addEventListener('scroll', requestPaint, { passive: true }); addEventListener('resize', requestPaint); paint();
})();
