const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/Stopwatch/',
  '/Stopwatch/index.html',
  '/Stopwatch/styles.css',
  '/Stopwatch/main.js',
  '/Stopwatch/images/icon-192x192.png',
  '/Stopwatch/images/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Listen for the 'message' event to trigger an update check
self.addEventListener('message', event => {
  if (event.data === 'checkForUpdate') {
    self.skipWaiting();
  }
});
