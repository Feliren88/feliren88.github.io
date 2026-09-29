/* ════════════════════════════════════════════════════════
   North star explainer on /north-star-metrics/.
   Content is rendered from _data/north_star.yml by the include, so the page
   reads without this file. This adds the business model picker and the live
   verdict for the reader's own metric.
   ════════════════════════════════════════════════════════ */
(function () {
  var host = document.querySelector('[data-xp="nsm"]');
  if (!host) return;

  function all(sel) { return Array.prototype.slice.call(host.querySelectorAll(sel)); }

  host.addEventListener('click', function (e) {
    var b = e.target.closest('[data-model]');
    if (!b) return;
    all('[data-model]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    all('.xp-nsm').forEach(function (a) { a.hidden = a.dataset.for !== b.dataset.model; });
  });

  var form = host.querySelector('[data-check]');
  var out = form.querySelector('.xp-verdict');
  var name = form.querySelector('[data-metric]');
  var ADVICE = {
    value: 'Count an outcome customers get, such as rides completed, not an effort such as emails sent.',
    leading: 'Check the history: does a rise in this metric come before a rise in revenue?',
    movable: 'Break it into inputs. If no team can move any input within a quarter, it will not steer work.',
    frequent: 'A metric you can only read yearly cannot guide weekly decisions. Find a faster proxy.',
    guarded: 'Name a guardrail, such as retention or complaints, that must not fall while this rises.',
    simple: 'If it needs a paragraph to explain, teams will each read it differently.'
  };

  function verdict() {
    var boxes = Array.prototype.slice.call(form.querySelectorAll('input[type="checkbox"]'));
    var missing = boxes.filter(function (b) { return !b.checked; });
    var ticked = boxes.length - missing.length;
    var label = name.value.trim() ? '“' + name.value.trim() + '”' : 'This metric';
    var head = ticked === boxes.length ? label + ' passes all 6. Pair it with a guardrail and write down its inputs.'
      : ticked >= 4 ? label + ' is close. Fix what is left before the whole company steers by it.'
      : ticked > 0 ? label + ' is more of an input or a health metric than a north star.'
      : 'Tick what is true of your metric to see what it still needs.';
    out.innerHTML = '<p><b>' + ticked + ' of ' + boxes.length + '.</b> ' + head.replace(/</g, '&lt;') + '</p>' +
      (ticked > 0 && missing.length ? '<ul>' + missing.map(function (b) { return '<li>' + ADVICE[b.value] + '</li>'; }).join('') + '</ul>' : '');
  }
  form.addEventListener('change', verdict);
  form.addEventListener('input', verdict);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  verdict();
})();
