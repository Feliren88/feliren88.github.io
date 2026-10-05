/* Research landscape on /research/: preview a paper, project or direction on
   hover or focus, and highlight the lines to everything it connects to. The
   map itself is static markup from _includes/research-landscape.html, so this
   file only adds the preview. */
(function () {
  var stage = document.querySelector('.rl-stage');
  if (!stage) return;

  var preview = stage.querySelector('.rl-preview');
  var venue = preview.querySelector('.rl-preview-venue');
  var title = preview.querySelector('.rl-preview-title');
  var desc = preview.querySelector('.rl-preview-desc');
  var edges = stage.querySelectorAll('.rl-edge');
  var nodes = stage.querySelectorAll('.rl-node');

  function show(node) {
    var id = node.dataset.id;
    venue.textContent = node.dataset.venue;
    title.textContent = node.dataset.title;
    desc.textContent = node.dataset.desc;

    var linked = {};
    linked[id] = true;
    edges.forEach(function (e) {
      var on = e.dataset.a === id || e.dataset.b === id;
      e.classList.toggle('is-active', on);
      if (on) { linked[e.dataset.a] = true; linked[e.dataset.b] = true; }
    });
    nodes.forEach(function (n) { n.classList.toggle('is-active', !!linked[n.dataset.id]); });
    stage.classList.add('is-focused');

    // Place the card beside the node, flipping above it in the lower half
    // and clamping it inside the stage horizontally.
    preview.hidden = false;
    var s = stage.getBoundingClientRect();
    var n = node.getBoundingClientRect();
    var w = preview.offsetWidth;
    var left = Math.min(Math.max(n.left + n.width / 2 - s.left - w / 2, 8), s.width - w - 8);
    preview.style.left = left + 'px';
    if (n.top - s.top > s.height / 2) {
      preview.style.top = (n.top - s.top - preview.offsetHeight - 10) + 'px';
    } else {
      preview.style.top = (n.bottom - s.top + 10) + 'px';
    }
  }

  function hide() {
    preview.hidden = true;
    stage.classList.remove('is-focused');
    edges.forEach(function (e) { e.classList.remove('is-active'); });
    nodes.forEach(function (n) { n.classList.remove('is-active'); });
  }

  stage.querySelectorAll('.rl-work, .rl-dir').forEach(function (node) {
    node.addEventListener('mouseenter', function () { show(node); });
    node.addEventListener('mouseleave', hide);
    node.addEventListener('focus', function () { show(node); });
    node.addEventListener('blur', hide);
  });
})();

/* Select a project's contribution and the open question it motivates. */
(function () {
  var explorer = document.querySelector('[data-research-connections]');
  if (!explorer) return;
  var controls = explorer.querySelector('[data-research-controls]');
  var buttons = explorer.querySelectorAll('[data-research-choice]');
  var panels = explorer.querySelectorAll('[data-research-connection]');
  var questions = document.querySelectorAll('.rd-card');

  function select(key) {
    var panel = Array.from(panels).find(function (item) {
      return item.dataset.researchConnection === key;
    });
    if (!panel) return;
    panels.forEach(function (item) { item.hidden = item !== panel; });
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.researchChoice === key));
    });
    questions.forEach(function (question) {
      question.classList.toggle('is-connected', question.id === panel.dataset.question);
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () { select(button.dataset.researchChoice); });
  });
  document.querySelectorAll('[data-research-trace]').forEach(function (link) {
    link.addEventListener('click', function () { select(link.dataset.researchTrace); });
  });
  function selectHash() {
    var prefix = '#connection-';
    if (window.location.hash.indexOf(prefix) === 0) {
      select(window.location.hash.slice(prefix.length));
    }
  }
  window.addEventListener('hashchange', selectHash);
  if (buttons.length) {
    select(buttons[0].dataset.researchChoice);
    selectHash();
    controls.hidden = false;
  }
})();
