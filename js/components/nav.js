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
    var item = NAV_ITEMS.find(function(n) { return path === n.href || path.startsWith(n.href + '/'); });
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNavigation);
  } else {
    renderNavigation();
  }
})();
