const C = 'kanjuu-v4';
const FILES = ['./', 'index.html', 'css/style.css', 'js/main.js', 'js/data.js', 'js/state.js', 'js/creature.js', 'js/games.js', 'js/cloud.js', 'js/world.js', 'manifest.json', 'icon.svg'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => e.request.method === 'GET' && !e.request.url.includes('/api/') && e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request))));
