/**
 * Behaviour for mobile navigation and the theme toggle in the top bar.
 *
 * Markup is _includes/site-header.html; the element ids below are the contract
 * between the two files.
 *
 * What this file does NOT do:
 *   - render the navigation links, or decide which one is active. Both come
 *     from _data/navigation.yml at build time, via _includes/site-nav.html.
 *   - set the theme on first paint. That has to happen before the stylesheet
 *     applies or the page flashes, so it is an inline script in site-head.html.
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

  function init() {
    initMobileNav();
    initThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
