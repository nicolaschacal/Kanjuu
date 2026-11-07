// Cuenta y guardado en la nube. El juego funciona igual sin conexión.
export let user = null;
// No se sube nada hasta haber comparado con la partida de la nube
let ready = false;
export const setReady = v => ready = v;
let timer = null, pending = null;

async function api(path, opts = {}) {
  const r = await fetch(path, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, ...opts });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Sin conexión');
  return j;
}
const LAST = 'kanjuu.user';
// null = sin sesión; undefined = sin conexión (no se sabe)
export async function me() {
  try { user = (await api('/api/auth')).user; } catch { return undefined; }
  try { user ? localStorage.setItem(LAST, user.email) : localStorage.removeItem(LAST); } catch {}
  return user;
}
export const lastUser = () => { try { return localStorage.getItem(LAST); } catch { return null; } };
export async function auth(action, email, password, extra = {}) {
  const r = await api('/api/auth', { method: 'POST', body: JSON.stringify({ action, email, password, ...extra }) });
  user = r.user;
  try { localStorage.setItem(LAST, user.email); } catch {}
  return r;
}
// Acciones con sesión: cambiar contraseña, nuevo código, borrar cuenta
export const account = (action, data) => api('/api/auth', { method: 'POST', body: JSON.stringify({ action, ...data }) });
export async function logout() { ready = false; try { localStorage.removeItem(LAST); } catch {} await api('/api/auth', { method: 'POST', body: '{"action":"logout"}' }).catch(() => {}); user = null; }
export async function pull() { return (await api('/api/save')).data; }
export async function pushNow(data) { if (user) await api('/api/save', { method: 'PUT', body: JSON.stringify({ data }) }); }
// Agrupa los guardados para no hacer una petición por cada toque
export function pushSoon(data) {
  if (!user || !ready) return;
  pending = data; clearTimeout(timer);
  timer = setTimeout(() => { pushNow(pending).catch(() => {}); pending = null; }, 4000);
}
addEventListener('visibilitychange', () => {
  if (document.hidden && pending) { clearTimeout(timer); pushNow(pending).catch(() => {}); pending = null; }
});
