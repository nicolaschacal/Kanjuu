// Analítica de la Academia (S1-02): eventos en lotes a /api/events.
// Sin datos personales: el servidor guarda solo un hash de la cuenta o de un id de dispositivo al azar.
// Nada de esto puede romper el juego: todo va dentro de try/catch y los fallos se ignoran.
const KEY = 'kanjuu.ev', DEV = 'kanjuu.dev', MAX_Q = 200, BATCH = 50, WAIT = 15000;
let q = [], timer = null, busy = false;

function load() { try { q = JSON.parse(localStorage.getItem(KEY) || '[]'); if (!Array.isArray(q)) q = []; } catch { q = []; } }
function keep() { try { q.length ? localStorage.setItem(KEY, JSON.stringify(q)) : localStorage.removeItem(KEY); } catch {} }
function device() {
  try {
    let d = localStorage.getItem(DEV);
    if (!d) { d = (crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36)); localStorage.setItem(DEV, d); }
    return d;
  } catch { return 'sin-almacenamiento'; }
}

// Lección abierta: se anota en cada pantalla. Si la app se cierra a mitad de una lección,
// al volver a abrirla se registra como abandonada en la pantalla donde quedó.
const OPEN = 'kanjuu.ev.open';
export function openLesson(info) { try { info ? localStorage.setItem(OPEN, JSON.stringify(info)) : localStorage.removeItem(OPEN); } catch {} }
function closedLast() {
  try {
    const o = JSON.parse(localStorage.getItem(OPEN) || 'null'); localStorage.removeItem(OPEN);
    if (o?.lesson) { const { seen, ...rest } = o; q.push({ n: 'lesson_quit', at: seen || Date.now(), how: 'app', ...rest }); keep(); }
  } catch {}
}

load();
closedLast();

// Registra un evento. name: lesson_start · lesson_end · lesson_quit · ex_error
export function track(name, data = {}) {
  try {
    q.push({ n: name, at: Date.now(), ...data });
    if (q.length > MAX_Q) q.splice(0, q.length - MAX_Q);
    keep();
    if (q.length >= BATCH) flush(); else { clearTimeout(timer); timer = setTimeout(flush, WAIT); }
  } catch {}
}

const body = batch => JSON.stringify({ dev: device(), events: batch });

// Envía lo pendiente. Si falla, los eventos quedan para el próximo intento.
export async function flush() {
  clearTimeout(timer);
  if (busy || !q.length) return;
  busy = true;
  const batch = q.slice(0, BATCH);
  try {
    const r = await fetch('/api/events', { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: body(batch) });
    // 4xx: el lote es inválido y reintentarlo no sirve; se descarta
    if (r.ok || (r.status >= 400 && r.status < 500 && r.status !== 404 && r.status !== 429)) { q.splice(0, batch.length); keep(); }
  } catch {}
  busy = false;
  if (q.length >= BATCH) setTimeout(flush, 1000);
}

// Al salir de la app se usa sendBeacon, que sobrevive al cierre de la página
function beacon() {
  try {
    if (!q.length || !navigator.sendBeacon) return;
    const batch = q.slice(0, BATCH);
    if (navigator.sendBeacon('/api/events', new Blob([body(batch)], { type: 'application/json' }))) { q.splice(0, batch.length); keep(); }
  } catch {}
}
try {
  addEventListener('visibilitychange', () => { if (document.hidden) beacon(); });
  addEventListener('pagehide', beacon);
  // Lo que quedó de una sesión anterior
  if (q.length) setTimeout(flush, 5000);
} catch {}
