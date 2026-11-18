const CACHE_NAME = 'kai-ai-lab-v1';

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (!url.pathname.includes('/ai-lab/_app/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request, { ignoreSearch: true });
    if (cached) return cached;
    if (event.request.mode === 'navigate') {
      return Response.redirect(new URL('/ai-lab/', url.origin), 302);
    }
    return new Response('AI Lab asset is not unlocked.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  })());
});

