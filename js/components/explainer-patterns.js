/* ════════════════════════════════════════════════════════
   Pattern catalogue and smell explorer on /design-patterns/.
   Content is rendered from _data/design_patterns.yml by the includes, so the
   page reads fully without this file. This adds the filter, the search, one
   open pattern at a time, and the smell picker.
   ════════════════════════════════════════════════════════ */
(function () {
  var cat = document.querySelector('[data-xp="patterns"]');
  var smells = document.querySelector('[data-xp="smells"]');
  if (!cat && !smells) return;

  function all(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

  /* ── catalogue ── */
  function open(id) {
    if (!cat) return;
    all(cat, '.xp-pdetail').forEach(function (d) { d.hidden = d.id !== 'pat-' + id; });
    all(cat, '.xp-pcard').forEach(function (c) {
      c.setAttribute('aria-expanded', String(c.getAttribute('aria-controls') === 'pat-' + id));
    });
    var d = document.getElementById('pat-' + id);
    if (d) {
      /* Make sure the pattern is not hidden by a filter before showing it. */
      var group = d.closest('.xp-pgroup');
      group.hidden = false;
      d.closest('.xp-pgroup').querySelector('[data-id="' + id + '"]').hidden = false;
      d.focus({ preventScroll: true });
      d.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }
  function close() {
    all(cat, '.xp-pdetail').forEach(function (d) { d.hidden = true; });
    all(cat, '.xp-pcard').forEach(function (c) { c.setAttribute('aria-expanded', 'false'); });
  }

  if (cat) {
    var group = 'all', query = '';
    var search = cat.querySelector('[data-search]');
    var empty = cat.querySelector('.xp-empty');

    function filter() {
      var shown = 0;
      all(cat, '.xp-pgroup').forEach(function (g) {
        var inGroup = group === 'all' || g.dataset.group === group, any = false;
        all(g, '.xp-pgrid li').forEach(function (li) {
          var ok = inGroup && (!query || li.dataset.text.indexOf(query) >= 0);
          li.hidden = !ok;
          if (ok) { any = true; shown++; }
        });
        g.hidden = !any;
      });
      empty.hidden = shown > 0;
    }

    cat.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.group) {
        group = b.dataset.group;
        all(cat, '[data-group]').forEach(function (x) {
          if (x.tagName === 'BUTTON') x.setAttribute('aria-pressed', String(x === b));
        });
        close();
        filter();
      } else if (b.classList.contains('xp-pcard')) {
        var id = b.getAttribute('aria-controls').slice(4);
        if (b.getAttribute('aria-expanded') === 'true') { close(); b.focus(); } else open(id);
      } else if (b.hasAttribute('data-close')) {
        var det = b.closest('.xp-pdetail');
        close();
        var card = cat.querySelector('[aria-controls="' + det.id + '"]');
        if (card) card.focus();
      } else if (b.dataset.open) {
        open(b.dataset.open);
      }
    });
    search.addEventListener('input', function () {
      query = search.value.trim().toLowerCase();
      close();
      filter();
    });
    cat.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var det = e.target.closest('.xp-pdetail');
      if (!det) return;
      close();
      var card = cat.querySelector('[aria-controls="' + det.id + '"]');
      if (card) card.focus();
    });
  }

  /* ── smells ── */
  if (smells) {
    smells.addEventListener('click', function (e) {
      var link = e.target.closest('[data-open]');
      if (link && cat) { e.preventDefault(); open(link.dataset.open); return; }
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.smell) {
        all(smells, '[data-smell]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        all(smells, '.xp-smell').forEach(function (a) { a.hidden = a.dataset.for !== b.dataset.smell; });
      } else if (b.dataset.view) {
        var box = b.closest('.xp-rf');
        all(box, '[data-view]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        box.querySelector('.xp-rf-code').dataset.show = b.dataset.view;
      }
    });
  }
})();
