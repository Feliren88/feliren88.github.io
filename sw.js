---
---
const CACHE = 'feliren88-{{ site.time | date: "%s" }}';
const PRECACHE = [
  '/',
  '/research/',
  '/writings/',
  '/contact/',
  '/css/styles.css?v=16',
  '/js/main.js?v=5',
  '/js/components/nav.js?v=2',
  '/js/components/timeline.js?v=2',
  '/assets/fonts/manrope-latin.woff2',
  '/assets/fonts/manrope-latin-ext.woff2',
  '/assets/fonts/spacegrotesk-latin.woff2',
  '/assets/fonts/spacegrotesk-latin-ext.woff2',
  '/assets/img/profile-450.webp',
  '/assets/img/profile.webp',
  '/assets/img/favicon.webp',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  if (request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          caches.open(CACHE).then(cache => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached ||
      fetch(request).then(response => {
        caches.open(CACHE).then(cache => cache.put(request, response.clone()));
        return response;
      })
    )
  );
});
