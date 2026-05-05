/**
 * Navigation component - Single source of truth for all pages
 */

(function() {
  var NAV_ITEMS = [
    { href: '/', label: 'Home', page: '/' },
    { href: '/about/', label: 'About', page: '/about' },
    { href: '/expertise/', label: 'Expertise', page: '/expertise' },
    { href: '/work/', label: 'Work', page: '/work' },
    { href: '/research/', label: 'Research', page: '/research' },
    { href: '/recognition/', label: 'Recognition', page: '/recognition' },
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
