/**
 * Navigation component - Single source of truth for all pages
 * Include this script in every page to render consistent navigation
 */

(function() {
  var NAV_ITEMS = [
    { href: 'index.html', label: 'Home', page: '/' },
    { href: 'about.html', label: 'About', page: '/about' },
    { href: 'skills.html', label: 'Expertise', page: '/expertise' },
    { href: 'experience.html', label: 'Work', page: '/work' },
    { href: 'publications.html', label: 'Research', page: '/research' },
    { href: 'awards.html', label: 'Recognition', page: '/recognition' },
    { href: 'thoughts.html', label: 'Writings', page: '/writings' },
    { href: 'contact.html', label: 'Contact', page: '/contact' },
  ];

  function getCurrentPage() {
    var path = window.location.pathname;
    var filename = path.split('/').pop() || 'index.html';
    
    var item = NAV_ITEMS.find(function(n) { return n.href === filename; });
    return item ? item.page : '/';
  }

  function getBasePath() {
    var path = window.location.pathname;
    if (path.includes('/pages/')) {
      return '../';
    }
    return '';
  }

  function renderNavigation() {
    var currentPage = getCurrentPage();
    var basePath = getBasePath();
    var nav = document.querySelector('nav.nav');
    if (!nav) return;

    nav.innerHTML = NAV_ITEMS.map(function(item) {
      var isActive = currentPage === item.page ? ' is-active' : '';
      return '<a href="' + basePath + item.href + '" class="' + (currentPage === item.page ? 'is-active' : '') + '">' + item.label + '</a>';
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNavigation);
  } else {
    renderNavigation();
  }
})();