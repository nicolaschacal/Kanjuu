// KANJŪ · i18n.js — textos de la interfaz en varios idiomas
// t('clave', { n, ... }) busca en el idioma actual y cae al español neutro si falta.
// Una entrada puede ser un texto o un objeto de plurales ({ one, other, ... }) elegido con Intl.PluralRules según vars.n.
// Español neutro con tú es la base; 'es-rp' (Río de la Plata, voseo) solo trae las claves que cambian.
import { S, save } from './state.js';

// Nombre de cada idioma en su propio idioma, código para Intl y de qué idioma hereda.
// Río de la Plata usa 'es' en Intl para que horas y números se vean igual que en neutro.
export const LANGS = [
  { id: 'es', name: 'Español', intl: 'es', base: null },
  { id: 'es-rp', name: 'Español (Río de la Plata)', intl: 'es', base: 'es' },
  { id: 'en', name: 'English', intl: 'en', base: 'es' },
];
const info = id => LANGS.find(l => l.id === id);
const D = {};
await Promise.all(LANGS.map(async l => {
  try { D[l.id] = await (await fetch(new URL(`../locales/${l.id}.json`, import.meta.url))).json(); } catch { D[l.id] = {}; }
}));

// Idioma del dispositivo: Uruguay y Argentina → Río de la Plata; otro español → neutro; inglés → inglés
export function detect(list = navigator.languages?.length ? navigator.languages : [navigator.language || 'es']) {
  for (const raw of list) {
    const [l, r = ''] = String(raw).split(/[-_]/), reg = r.toUpperCase();
    if (l === 'es') return reg === 'UY' || reg === 'AR' ? 'es-rp' : 'es';
    if (l === 'en') return 'en';
  }
  return 'es';
}
// ?lang=en en la dirección fuerza un idioma sin guardarlo (para probar)
const forced = new URLSearchParams(location.search).get('lang');
export const lang = () => info(forced)?.id || info(S.lang)?.id || detect();
export const locale = () => info(lang()).intl;
export const langName = (id = lang()) => info(id)?.name || id;

const rules = {};
function lookup(key, id) {
  for (let l = id; l; l = info(l)?.base) if (key in (D[l] || {})) return [D[l][key], l];
  return [undefined, id];
}
export function t(key, vars = {}) {
  let [s, from] = lookup(key, lang());
  if (s === undefined) return key;
  if (typeof s === 'object') {
    const pr = rules[from] ??= new Intl.PluralRules(info(from).intl);
    s = s[pr.select(+vars.n || 0)] ?? s.other;
  }
  return String(s).replace(/\{(\w+)\}/g, (m, k) => k in vars ? (typeof vars[k] === 'number' ? vars[k].toLocaleString(locale()) : vars[k]) : m);
}
// Elementos con data-i18n (texto) o data-i18n-aria (aria-label) se traducen solos
export function translate(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
}
const subs = [];
export const onLang = fn => subs.push(fn);
// 'auto' vuelve a seguir al dispositivo
export function setLang(id) {
  S.lang = id === 'auto' || info(id) ? id : 'auto'; save();
  document.documentElement.lang = locale();
  translate(); subs.forEach(fn => fn());
}
document.documentElement.lang = locale();
