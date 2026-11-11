// Reporte de la Academia (S1-02): abandono por lección y errores por tipo de ejercicio.
//
// Uso:
//   DATABASE_URL=… node tools/reporte_academia.mjs [--dias 30]   lee la tabla academy_events (solo lectura)
//   node tools/reporte_academia.mjs --archivo eventos.json        lee un JSON exportado (lista de filas)
//
// Solo hace SELECT: no cambia nada en la base.
import { readFileSync } from 'node:fs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const file = arg('--archivo'), days = +arg('--dias', 30);

async function rows() {
  if (file) {
    // Acepta filas de la tabla o eventos tal como los manda el juego ({ n, lesson, … })
    return JSON.parse(readFileSync(file, 'utf8')).map(r => ({
      name: r.name ?? r.n, lesson: r.lesson, unit: r.unit, ex: r.ex, step: r.step, ms: r.ms, acct: r.acct ?? 'local',
      data: r.data ?? r,
    }));
  }
  if (!process.env.DATABASE_URL) {
    console.error('Falta DATABASE_URL (o usá --archivo eventos.json)');
    process.exit(1);
  }
  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(process.env.DATABASE_URL);
  const [t] = await sql`SELECT to_regclass('academy_events') AS t`;
  if (!t.t) { console.log('Todavía no hay eventos: la tabla se crea con el primer envío.'); process.exit(0); }
  return sql`SELECT name, lesson, unit, ex, step, ms, acct, data FROM academy_events
    WHERE at > now() - make_interval(days => ${days}) ORDER BY at`;
}

const pct = (a, b) => b ? `${Math.round(a / b * 100)}%` : '—';
const med = a => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[s.length >> 1]; };
const mmss = ms => ms == null ? '—' : `${Math.floor(ms / 60000)}:${String(Math.round(ms / 1000) % 60).padStart(2, '0')}`;
const top = (m, n = 2) => [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k} (${v})`).join(', ') || '—';
const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

const R = await rows();
const L = new Map(), E = new Map();
const lesson = id => L.get(id) ?? L.set(id, { unit: '', start: 0, end: 0, quit: 0, ms: [], at: new Map(), players: new Set() }).get(id);
for (const r of R) {
  if (!r.lesson) continue;
  const l = lesson(r.lesson); l.unit ||= r.unit || '';
  if (r.name === 'lesson_start') { l.start++; l.players.add(r.acct); }
  else if (r.name === 'lesson_end') { l.end++; if (r.ms != null) l.ms.push(+r.ms); }
  else if (r.name === 'lesson_quit') { l.quit++; const k = `${r.ex || '?'} #${r.step ?? '?'}`; l.at.set(k, (l.at.get(k) || 0) + 1); }
  else if (r.name === 'ex_error') E.set(r.ex || '?', (E.get(r.ex || '?') || 0) + 1);
}

console.log(`\nAcademia · ${R.length} eventos${file ? ` de ${file}` : ` de los últimos ${days} días`}\n`);
console.log('ABANDONO POR LECCIÓN (ordenado de mayor a menor)');
console.log(`${pad('lección', 9)}${pad('unidad', 8)}${padL('jug.', 5)}${padL('inicios', 8)}${padL('termina', 8)}${padL('abandona', 9)}${padL('% aband.', 9)}${padL('tiempo', 8)}  dónde abandonan (pantalla #n)`);
[...L].map(([id, l]) => ({ id, ...l, rate: l.start ? l.quit / l.start : 0 })).sort((a, b) => b.rate - a.rate || b.start - a.start).forEach(l =>
  console.log(`${pad(l.id, 9)}${pad(l.unit, 8)}${padL(l.players.size, 5)}${padL(l.start, 8)}${padL(l.end, 8)}${padL(l.quit, 9)}${padL(pct(l.quit, l.start), 9)}${padL(mmss(med(l.ms)), 8)}  ${top(l.at)}`));
if (!L.size) console.log('  (sin lecciones)');

const totalErr = [...E.values()].reduce((a, b) => a + b, 0);
console.log('\nERRORES POR TIPO DE EJERCICIO');
[...E].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`${pad(k, 10)}${padL(v, 6)}  ${padL(pct(v, totalErr), 4)}`));
if (!E.size) console.log('  (sin errores)');
console.log('\n"tiempo" es la mediana de las lecciones terminadas. "abandona" suma las salidas con ✕ y las apps cerradas a mitad de lección.\n');
