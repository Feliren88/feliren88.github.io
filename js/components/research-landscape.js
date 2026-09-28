/* Research landscape on /research/: preview a paper on hover or focus and
   highlight the lines to its topics. The map itself is static markup from
   _includes/research-landscape.html, so this file only adds the preview. */
(function () {
  var stage = document.querySelector('.rl-stage');
  if (!stage) return;

  var preview = stage.querySelector('.rl-preview');
  var venue = preview.querySelector('.rl-preview-venue');
  var title = preview.querySelector('.rl-preview-title');
  var desc = preview.querySelector('.rl-preview-desc');
  var edges = stage.querySelectorAll('.rl-edge');
  var topics = stage.querySelectorAll('.rl-topic');

  function show(node) {
    var key = node.dataset.paper;
    venue.textContent = node.dataset.venue;
    title.textContent = node.dataset.title;
    desc.textContent = node.dataset.desc;
    stage.classList.add('is-focused');
    node.classList.add('is-active');
    var linked = {};
    edges.forEach(function (e) {
      var on = e.dataset.paper === key;
      e.classList.toggle('is-active', on);
      if (on) linked[e.dataset.topic] = true;
    });
    topics.forEach(function (t) { t.classList.toggle('is-active', !!linked[t.dataset.topic]); });

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

  function hide(node) {
    preview.hidden = true;
    stage.classList.remove('is-focused');
    node.classList.remove('is-active');
    edges.forEach(function (e) { e.classList.remove('is-active'); });
    topics.forEach(function (t) { t.classList.remove('is-active'); });
  }

  stage.querySelectorAll('.rl-paper').forEach(function (node) {
    node.addEventListener('mouseenter', function () { show(node); });
    node.addEventListener('mouseleave', function () { hide(node); });
    node.addEventListener('focus', function () { show(node); });
    node.addEventListener('blur', function () { hide(node); });
  });
})();
