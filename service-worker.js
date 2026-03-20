const CACHE_VERSION = 'v2';
const CACHE_NAME = `fincore-cache-${CACHE_VERSION}`;
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/assets/css/reset.css',
  '/assets/css/variables.css',
  '/assets/css/base.css',
  '/assets/css/layout.css',
  '/assets/css/components.css',
  '/assets/css/screens.css',
  '/assets/css/responsive.css',
  '/assets/js/app.js',
  '/assets/js/utils.js',
  '/assets/js/theme.js',
  '/assets/js/store.js',
  '/assets/js/db.js',
  '/assets/js/auth.js',
  '/assets/js/router.js',
  '/assets/js/modules/dashboard.js',
  '/assets/js/modules/transactions.js',
  '/assets/js/modules/accounts.js',
  '/assets/icons/favicon.svg',
  '/assets/IMAGENS/bg-login.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
