const C = 'kanjuu-v52';
const FILES = ['./', 'index.html', 'css/style.css', 'css/ui.css', 'css/art.css', 'js/icons.js', 'js/main.js', 'js/sanctuary.js', 'js/sheet.js', 'js/lab.js', 'js/trips.js', 'js/atlas.js', 'js/shop.js', 'js/dojo.js', 'js/account.js', 'js/arena.js', 'js/data.js', 'js/state.js', 'js/creature.js', 'js/art.js', 'js/games.js', 'js/cloud.js', 'js/world.js', 'js/help.js', 'js/academy.js', 'js/course.js', 'js/ai.js', 'js/tutorial.js', 'js/trainer.js', 'js/strokes.js', 'js/scene3d.js', 'js/paper.js', 'js/vendor/three.module.min.js', 'manifest.json', 'icon.svg', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => e.request.method === 'GET' && !e.request.url.includes('/api/') && e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request))));
// Idiomas (S1-01): se suman aparte para no chocar con otros cambios de la lista
FILES.push('js/i18n.js', 'locales/es.json', 'locales/en.json');
// Analítica de la Academia (S1-02)
FILES.push('js/analytics.js');
// Favicon de la cara en PNG (para navegadores sin SVG)
FILES.push('icons/favicon-32.png', 'icons/favicon-48.png');
