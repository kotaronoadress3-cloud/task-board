const CACHE = 'task-board-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.add('/task-board/'))
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

// Stale-while-revalidate: return cache immediately, update in background
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(event.request).then(cached => {
        const networkFetch = fetch(event.request)
          .then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    )
  );
});
