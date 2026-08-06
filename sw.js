/**
 * ConstructOS — PWA Service Worker
 * Enables offline capability & native app loading speed
 */

const CACHE_NAME = 'constructos-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './manifest.json',
  './assets/logo.jpg',
  './js/data.js',
  './js/auth.js',
  './js/ai-engine.js',
  './js/modules/dashboard.js',
  './js/modules/tenders.js',
  './js/modules/boq.js',
  './js/modules/projects.js',
  './js/modules/finance.js',
  './js/modules/inventory.js',
  './js/modules/documents.js',
  './js/modules/crm.js',
  './js/app.js'
];

// Install Event: Cache Core Static Assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ConstructOS PWA] Pre-caching offline assets v2');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event: Clean old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ConstructOS PWA] Purging old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network First with Cache Fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
