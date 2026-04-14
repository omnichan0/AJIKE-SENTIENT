const CACHE_NAME = 'ajike-os-v3';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  
  // Bypass service worker for cross-origin requests (APIs, Firebase, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Bypass for specific paths if needed (e.g., /api)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request).catch(() => {
        // Offline fallback logic could go here
        return new Response('AJIKE is currently operating in offline mode. Neural link severed, but local kernel is active.', {
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});
