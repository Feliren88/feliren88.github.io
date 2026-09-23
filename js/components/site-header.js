/**
 * Behaviour for the three controls in the top bar: the mobile navigation
 * drawer, the theme toggle, and the point-cloud shape picker's popover.
 *
 * Markup is _includes/site-header.html; the element ids below are the contract
 * between the two files.
 *
 * What this file does NOT do:
 *   - render the navigation links, or decide which one is active. Both come
 *     from _data/navigation.yml at build time, via _includes/site-nav.html.
 *   - set the theme on first paint. That has to happen before the stylesheet
 *     applies or the page flashes, so it is an inline script in site-head.html.
 *   - change the point cloud. The shape buttons themselves are handled by
 *     initPointCloudLab() in js/main.js; only the popover is here.
 */

(function () {
  'use strict';

  /** Slide-out navigation on narrow viewports. */
  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');
    var backdrop = document.getElementById('nav-backdrop');
    if (!toggle || !nav || !backdrop) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    backdrop.addEventListener('click', function () { setOpen(false); });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /**
   * Light/dark toggle. The stored value is read twice: once inline in
   * site-head.html to beat the first paint, and once here to set the button's
   * label. Dark is the default when nothing is stored.
   */
  function initThemeToggle() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }

    var saved;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    setTheme(saved || 'dark');

    btn.addEventListener('click', function () {
      setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
  }

  /** Open and close the shape picker. Choosing a shape is main.js's job. */
  function initShapePopover() {
    var toggle = document.getElementById('shape-toggle');
    var popover = document.getElementById('shape-popover');
    if (!toggle || !popover) return;

    function setOpen(open) {
      popover.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function () { setOpen(popover.hidden); });

    document.addEventListener('click', function (e) {
      if (!popover.hidden && !popover.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !popover.hidden) { setOpen(false); toggle.focus(); }
    });
  }

  function init() {
    initMobileNav();
    initThemeToggle();
    initShapePopover();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
