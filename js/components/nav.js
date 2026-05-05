/**
 * Navigation component - Single source of truth for all pages
 */

(function() {
  var NAV_ITEMS = [
    { href: 'index.html', label: 'Home', page: '/' },
    { href: 'pages/about.html', label: 'About', page: '/about' },
    { href: 'pages/skills.html', label: 'Expertise', page: '/expertise' },
    { href: 'pages/experience.html', label: 'Work', page: '/work' },
    { href: 'pages/publications.html', label: 'Research', page: '/research' },
    { href: 'pages/awards.html', label: 'Recognition', page: '/recognition' },
    { href: 'pages/thoughts.html', label: 'Writings', page: '/writings' },
    { href: 'pages/contact.html', label: 'Contact', page: '/contact' },
  ];

  function getCurrentPage() {
    var path = window.location.pathname;
    var filename = path.split('/').pop() || 'index.html';
    
    var item = NAV_ITEMS.find(function(n) { return n.href === filename || n.href === path; });
    return item ? item.page : '/';
  }

  function getHrefForPage(page) {
    var item = NAV_ITEMS.find(function(n) { return n.page === page; });
    return item ? item.href : 'index.html';
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