// Guarda somente os arquivos da interface, dentro da pasta de publicação.
const PREFIX = 'antena-livre:' + self.registration.scope + ':';
const CACHE = PREFIX + 'v2';
const asset = path => new URL(path, self.registration.scope).href;
const SHELL = ['./', 'index.html', 'catalogo.js', 'manifest.webmanifest',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'].map(asset);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  url.search = '';
  if (!SHELL.includes(url.href)) return;

  event.respondWith(fetch(request).catch(async () => {
    const cache = await caches.open(CACHE);
    return await cache.match(url.href) || Response.error();
  }));
});
