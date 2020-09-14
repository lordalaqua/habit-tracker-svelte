const CACHE_NAME = '__HABIT_TRACKER_0.1__';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/global.css',
  '/build/bundle.js',
  '/build/bundle.css'
];

// Cache files in install event
self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Pre-caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  //console.log('[ServiceWorker] Fetch', event.request.url);
  // if (event.request.mode !== 'navigate') {
  //   // Not a page navigation, bail.
  //   return;
  // }
  event.respondWith(
    fetch(event.request).catch(() => {
      console.log(event.request.url);
      return caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request.url);
      });
    })
  );
});