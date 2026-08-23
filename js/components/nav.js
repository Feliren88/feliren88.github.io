/**
 * Navigation component - Single source of truth for all pages
 */

(function() {
  var NAV_ITEMS = [
    { href: '/', label: 'About', page: '/' },
    { href: '/research/', label: 'Research', page: '/research' },
    { href: '/usecases/', label: 'Use Cases', page: '/usecases' },
    { href: '/writings/', label: 'Writings', page: '/writings' },
    { href: '/contact/', label: 'Work With Me', page: '/contact' },
  ];

  function getCurrentPage() {
    var path = window.location.pathname;
    // Long-form notes live under Writings even though they have their own URLs.
    if (path.indexOf('/essays/') === 0) return '/writings';
    if (path.indexOf('/high-agency') === 0) return '/writings';
    if (path.indexOf('/principles') === 0) return '/writings';
    if (path.indexOf('/stoic') === 0) return '/writings';
    if (path.indexOf('/game-theory') === 0) return '/writings';
    if (path.indexOf('/success-failure') === 0) return '/writings';
    var item = NAV_ITEMS.find(function(n) { return path === n.href || (n.href !== '/' && path.indexOf(n.href) === 0); });
    return item ? item.page : '/';
  }

  function getHrefForPage(page) {
    var item = NAV_ITEMS.find(function(n) { return n.page === page; });
    return item ? item.href : '/';
  }

  function renderNavigation() {
    var currentPage = getCurrentPage();
    var nav = document.querySelector('nav.nav');
    if (!nav) return;

    var existingLinks = nav.querySelectorAll('a');
    if (existingLinks.length > 0) {
      existingLinks.forEach(function(link) {
        var item = NAV_ITEMS.find(function(n) { return n.href === link.getAttribute('href'); });
        link.className = item && currentPage === item.page ? 'is-active' : '';
      });
      return;
    }

    nav.innerHTML = NAV_ITEMS.map(function(item) {
      return '<a href="' + item.href + '" class="' + (currentPage === item.page ? 'is-active' : '') + '">' + item.label + '</a>';
    }).join('');
  }

  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');
    var backdrop = document.getElementById('nav-backdrop');
    if (!toggle || !nav || !backdrop) return;

    function openNav() {
      nav.classList.add('is-open');
      backdrop.classList.add('is-open');
      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
    }

    function closeNav() {
      nav.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }

    toggle.addEventListener('click', function() {
      nav.classList.contains('is-open') ? closeNav() : openNav();
    });

    backdrop.addEventListener('click', closeNav);

    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  function init() {
    renderNavigation();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
