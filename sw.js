const CACHE = 'skedee-v3';
const ASSETS = [
  '/index.html',
  '/about.html',
  '/faq.html',
  '/signup.html',
  '/manifest.json',
  '/markets/10000001.html',
  '/markets/10000002.html',
  '/assets/skedee-1.png',
  '/assets/skedee-full-1.png',
  '/assets/skedee-squ-1.png',
  '/assets/skedee-squ-2.png',
  '/assets/skedee-squ-3.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
