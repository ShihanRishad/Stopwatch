const CACHE_NAME = 'stopwatch-cache-1';
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
