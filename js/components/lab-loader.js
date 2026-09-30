/* ════════════════════════════════════════════════════════
   Loads each module explainer's script (js/labs/<track>/<slug>.js) when its
   module comes within 1 screen of the viewport, so a track page only fetches
   the explainers a reader reaches. A script that fails to load, or loads
   without mounting, shows the module's static diagram instead.
   ════════════════════════════════════════════════════════ */
(function () {
  var slots = document.querySelectorAll('.lab-slot[data-lab-src]');
  if (!slots.length) return;
  if (!window.XP) {
    Array.prototype.forEach.call(slots, function (slot) {
      var fb = slot.nextElementSibling;
      if (fb && fb.hasAttribute('data-lab-fallback')) fb.hidden = false;
    });
    return;
  }
  function load(slot) {
    if (slot.hasAttribute('data-lab-state')) return;
    slot.setAttribute('data-lab-state', 'loading');
    var s = document.createElement('script');
    s.src = slot.getAttribute('data-lab-src');
    s.onerror = function () { XP.labFallback(slot, new Error('did not load: ' + s.src)); };
    s.onload = function () {
      if (slot.getAttribute('data-lab-state') === 'loading') XP.labFallback(slot, new Error('loaded without mounting: ' + s.src));
    };
    document.head.appendChild(s);
  }
  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(slots, load);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { io.unobserve(e.target); load(e.target); }
    });
  }, { rootMargin: '100% 0px' });
  Array.prototype.forEach.call(slots, function (slot) { io.observe(slot); });
})();
