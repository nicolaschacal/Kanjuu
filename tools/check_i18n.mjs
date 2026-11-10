// Chequeo de idiomas: node tools/check_i18n.mjs
// - es.json (español neutro) es la base: en.json debe tener todas sus claves y ninguna de más
// - las variables {n}, {name}… y las formas de plural deben coincidir con la base
// - toda clave usada en el código como t('…') o data-i18n="…" debe existir en es
import { readFileSync, readdirSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const load = l => JSON.parse(readFileSync(new URL(`locales/${l}.json`, root), 'utf8'));
const es = load('es'), errs = [];
const vars = v => [...new Set((typeof v === 'object' ? Object.values(v).join(' ') : String(v)).match(/\{\w+\}/g) || [])].sort().join(',');
function compare(name, d, full) {
  for (const k of Object.keys(d)) {
    if (!(k in es)) { errs.push(`${name}: sobra la clave "${k}" (no está en es)`); continue; }
    if (vars(d[k]) !== vars(es[k])) errs.push(`${name}: "${k}" usa variables ${vars(d[k]) || '—'} y es usa ${vars(es[k]) || '—'}`);
    if ((typeof d[k] === 'object') !== (typeof es[k] === 'object')) errs.push(`${name}: "${k}" debe ${typeof es[k] === 'object' ? '' : 'no '}tener plurales`);
    else if (typeof d[k] === 'object' && !('other' in d[k])) errs.push(`${name}: "${k}" no tiene la forma "other"`);
  }
  if (full) for (const k of Object.keys(es)) if (!(k in d)) errs.push(`${name}: falta la clave "${k}"`);
}
compare('en', load('en'), true);
for (const k of Object.keys(es)) if (typeof es[k] === 'object' && !('other' in es[k])) errs.push(`es: "${k}" no tiene la forma "other"`);
// Claves usadas en el código (solo literales; las claves armadas con variables se listan en DYN)
const DYN = ['hud.wx.sun', 'hud.wx.cloud', 'hud.wx.fog', 'hud.wx.rain', 'hud.wx.snow', 'hud.wx.storm', 'menu.furiSub', 'menu.grainSub'];
const used = new Set(DYN);
const NS = [...new Set(Object.keys(es).map(k => k.split('.')[0]))].join('|');
for (const f of readdirSync(new URL('js/', root)).filter(f => f.endsWith('.js'))) {
  // sin comentarios de línea, para no contar ejemplos como t('clave')
  const src = readFileSync(new URL(`js/${f}`, root), 'utf8').replace(/^\s*\/\/.*$/gm, '');
  for (const m of src.matchAll(/(?<![\w.])t\(\s*'([\w.-]+)'\s*[,)]/g)) used.add(m[1]);
  for (const m of src.matchAll(/data-i18n(?:-aria)?="([\w.-]+)"/g)) used.add(m[1]);
  // claves pasadas como datos (NAV, pestañas, filas de Configuración): cualquier literal con un prefijo de los diccionarios
  for (const m of src.matchAll(new RegExp(`'((?:${NS})\\.[\\w.-]*\\w)'`, 'g'))) used.add(m[1]);
}
for (const k of used) if (!(k in es)) errs.push(`código: la clave "${k}" no está en es.json`);
const unused = Object.keys(es).filter(k => !used.has(k));
if (unused.length) console.log(`Aviso: ${unused.length} clave(s) sin uso: ${unused.join(', ')}`);
if (errs.length) { console.error(errs.join('\n')); console.error(`\n${errs.length} problema(s).`); process.exit(1); }
console.log(`Idiomas OK: ${Object.keys(es).length} claves en es, en completo.`);
