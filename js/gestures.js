// KANJŪ · gestures.js — gestos de app (tarea B-02).
// - Deslizar hacia abajo cierra la hoja o ventana de arriba (si se puede cerrar).
// - Deslizar desde el borde izquierdo vuelve atrás, igual que el botón «atrás» de Android.
// - Deslizar a los lados cambia de pestaña dentro de una hoja con pestañas.
// Solo escucha: no toca el mapa del Santuario ni la Arena, que tienen sus propios controles.
import { t } from './i18n.js';

const $ = (s, r = document) => r.querySelector(s);
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EDGE = 24, BACK_DX = 70, TAB_DX = 64, CLOSE_DY = 110, FLICK = .55; // px y px/ms
// Dónde un gesto no debe empezar: campos, trazado de kanji (svg), 3D (canvas) y controles deslizantes
const BUSY = 'input,textarea,select,canvas,svg,[data-nogesture],.rcode';

// ---------- Atrás ----------
// Lo que está arriba de todo, de más cerca a más lejos. Devuelve cómo cerrarlo, o null si no hay nada abierto.
function top() {
  const ts = $('.title-scr'); if (ts) { const b = $('#stBack', ts); return { fixed: !b, close: () => b?.click() }; }
  const layer = $('#layer'), el = layer?.lastElementChild;
  if (el) {
    if (el.classList.contains('modal')) return el.onclick ? { el, sheet: $('.sheet', el), close: () => el.onclick({ target: el }) } : { fixed: true };
    const x = $('.x', el); return x ? { el, close: () => x.click() } : { fixed: true };
  }
  const p = $('#panel.open:not(.out)');
  if (p) return { el: p, sheet: $('.pn-card', p), close: () => $('#pnX', p)?.click() };
  return null;
}
// true si se consumió (algo se cerró o hay una ventana obligatoria abierta)
export function back() {
  const x = top(); if (!x) return false;
  if (!x.fixed) x.close();
  return true;
}

// ---------- Toques ----------
let g = null; // gesto en curso
const scrolled = (from, until) => { for (let n = from; n && n !== until.parentElement; n = n.parentElement) if (n.scrollTop > 0) return true; return false; };
const sideScroll = (from, until) => { for (let n = from; n && n !== until.parentElement; n = n.parentElement) if (n.scrollWidth > n.clientWidth + 4 && /auto|scroll/.test(getComputedStyle(n).overflowX)) return true; return false; };

function onStart(e) {
  g = null;
  if (e.touches.length !== 1) return;
  const p = e.touches[0], tg = e.target, x = top();
  if (!x || x.fixed && !$('.title-scr')) return;
  const base = { x0: p.clientX, y0: p.clientY, t0: e.timeStamp, kind: null, x };
  if (p.clientX <= EDGE) { g = { ...base, edge: true }; return; }
  if (tg.closest?.(BUSY)) return;
  if (x.sheet && x.sheet.contains(tg)) g = { ...base, sheet: x.sheet, canDown: !scrolled(tg, x.sheet), canSide: !!$('.pn-tabs', x.sheet) && !sideScroll(tg, x.sheet) };
}
function onMove(e) {
  if (!g) return;
  const p = e.touches[0], dx = p.clientX - g.x0, dy = p.clientY - g.y0;
  if (!g.kind) {
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    if (g.edge) g.kind = dx > 0 && Math.abs(dx) > Math.abs(dy) ? 'back' : 'none';
    else if (g.canDown && dy > 0 && dy > Math.abs(dx) * 1.5) g.kind = 'down';
    else if (g.canSide && Math.abs(dx) > Math.abs(dy) * 2) g.kind = 'side';
    else g.kind = 'none';
    if (g.kind === 'back') { g.tip = document.createElement('div'); g.tip.className = 'gs-back'; g.tip.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>'; document.body.append(g.tip); }
    if (g.kind === 'down') g.sheet.classList.add('gs-drag');
  }
  if (g.kind === 'none') return;
  if (e.cancelable) e.preventDefault();
  if (g.kind === 'down') g.sheet.style.transform = `translateY(${Math.max(0, dy)}px)`;
  if (g.kind === 'back') { const k = Math.min(1, Math.max(0, dx) / BACK_DX); g.tip.style.transform = `translate(${-44 + k * 56}px,${p.clientY - 22}px)`; g.tip.classList.toggle('on', k >= 1); }
}
function onEnd(e) {
  const s = g; g = null;
  if (!s?.kind || s.kind === 'none') return;
  const p = e.changedTouches[0], dx = p.clientX - s.x0, dy = p.clientY - s.y0, ms = Math.max(1, e.timeStamp - s.t0);
  if (s.kind === 'back') { s.tip.remove(); if (e.type === 'touchend' && dx >= BACK_DX) { haptic(); back(); } return; }
  if (s.kind === 'side') {
    if (e.type !== 'touchend' || Math.abs(dx) < TAB_DX) return;
    const on = $('.pn-tabs button.on', s.sheet), next = dx < 0 ? on?.nextElementSibling : on?.previousElementSibling;
    if (next) next.click();
    return;
  }
  // down
  const sheet = s.sheet, shut = e.type === 'touchend' && (dy > CLOSE_DY || (dy > 40 && dy / ms > FLICK));
  sheet.classList.remove('gs-drag');
  if (!shut) { sheet.style.transition = calm() ? '' : 'transform .2s cubic-bezier(.2,1.2,.4,1)'; sheet.style.transform = ''; setTimeout(() => sheet.style.transition = '', 220); return; }
  haptic();
  if (calm()) { sheet.style.transform = ''; return s.x.close(); }
  // Sale hacia abajo desde donde está el dedo, y recién entonces se cierra de verdad
  sheet.style.transition = 'transform .18s ease-in'; sheet.style.transform = 'translateY(105%)';
  s.x.el.classList.add('gs-gone');
  setTimeout(() => { s.x.close(); if (sheet.isConnected) setTimeout(() => { sheet.style.transition = sheet.style.transform = ''; s.x.el.classList.remove('gs-gone'); }, 260); }, 170);
}

// ---------- Vibración y botón «atrás» ----------
const cap = () => window.Capacitor?.Plugins;
export function haptic(n = 8) {
  const H = cap()?.Haptics;
  if (H) return void H.impact({ style: (Array.isArray(n) ? 30 : n) > 20 ? 'MEDIUM' : 'LIGHT' }).catch(() => {});
  navigator.vibrate?.(n);
}
let lastBack = 0;
// Nada que cerrar: la primera vez avisa; la segunda, sale
function atHome(toast, exit) {
  if (Date.now() - lastBack < 2000) return exit();
  lastBack = Date.now(); toast(t('gs.exit'));
}
export function startGestures(toast) {
  addEventListener('touchstart', onStart, { passive: true });
  addEventListener('touchmove', onMove, { passive: false });
  addEventListener('touchend', onEnd); addEventListener('touchcancel', onEnd);
  const App = cap()?.App;
  if (App) { App.addListener('backButton', () => { if (!back()) atHome(toast, () => App.exitApp()); }); return; }
  // En el navegador y como app instalada en Android: el botón «atrás» pasa por el historial
  if (!/Android/i.test(navigator.userAgent)) return;
  history.pushState({ kj: 1 }, '');
  addEventListener('popstate', () => {
    if (back()) return history.pushState({ kj: 1 }, '');
    let out = false; atHome(toast, () => { out = true; history.back(); });
    if (!out) history.pushState({ kj: 1 }, '');
  });
}
