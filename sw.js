const CACHE = 'jccfacturas-v1';
const ASSETS = ['./','./index.html','./manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('graph.microsoft.com') ||
      e.request.url.includes('login.microsoftonline.com') ||
      e.request.url.includes('msauth.net')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
