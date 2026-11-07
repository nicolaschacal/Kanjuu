import { sql, userId, send } from './_lib.js';
import { PROVIDERS, detectProvider, encrypt, decrypt, hint, generate, parseJSON, AIError } from './_ai.js';

const DAILY_LIMIT = 40;
const KANJI_RX = /[㐀-鿿々]/g;

export default async function handler(req, res) {
  const uid = userId(req);
  if (!uid) return send(res, 401, { error: 'Iniciá sesión para usar la IA' });
  try {
    if (req.method === 'GET') {
      const [k] = await sql`SELECT provider, model, hint FROM ai_keys WHERE user_id = ${uid}`;
      return send(res, 200, { key: k || null, providers: Object.fromEntries(Object.entries(PROVIDERS).map(([id, p]) => [id, { label: p.label, models: p.models, keyUrl: p.keyUrl }])) });
    }
    if (req.method === 'DELETE') { await sql`DELETE FROM ai_keys WHERE user_id = ${uid}`; return send(res, 200, { ok: true }); }
    if (req.method === 'PUT') {
      const apiKey = String(req.body?.apiKey || '').trim();
      const provider = req.body?.provider || detectProvider(apiKey);
      if (!PROVIDERS[provider]) return send(res, 400, { error: 'No reconocimos el proveedor. Elegilo de la lista.' });
      const model = PROVIDERS[provider].models.includes(req.body?.model) ? req.body.model : PROVIDERS[provider].model;
      if (apiKey.length < 20) return send(res, 400, { error: 'Esa clave parece incompleta' });
      try { await generate({ provider, apiKey, model }, { system: 'Respondé solo: ok', user: 'ok', maxTokens: 20, timeoutMs: 15000 }); }
      catch (e) { return send(res, 400, { error: `La clave no funcionó: ${e.message}` }); }
      await sql`INSERT INTO ai_keys (user_id, provider, model, key_enc, hint) VALUES (${uid}, ${provider}, ${model}, ${encrypt(apiKey)}, ${hint(apiKey)})
        ON CONFLICT (user_id) DO UPDATE SET provider = EXCLUDED.provider, model = EXCLUDED.model, key_enc = EXCLUDED.key_enc, hint = EXCLUDED.hint, updated_at = now()`;
      return send(res, 200, { key: { provider, model, hint: hint(apiKey) } });
    }
    if (req.method !== 'POST') return send(res, 405, { error: 'Método no permitido' });

    const [row] = await sql`SELECT * FROM ai_keys WHERE user_id = ${uid}`;
    if (!row) return send(res, 400, { error: 'Conectá tu IA primero' });
    const today = new Date().toISOString().slice(0, 10);
    const uses = String(row.day).slice(0, 10) === today ? row.uses : 0;
    if (uses >= DAILY_LIMIT) return send(res, 429, { error: 'Llegaste al límite diario de historias. Mañana hay más.' });
    await sql`UPDATE ai_keys SET day = CURRENT_DATE, uses = ${uses + 1} WHERE user_id = ${uid}`;
    const target = { provider: row.provider, model: row.model, apiKey: decrypt(row.key_enc) };
    const b = req.body || {};

    if (b.action === 'explain') {
      const text = await generate(target, {
        system: 'Sos un profesor de japonés paciente para hispanohablantes principiantes. Explicá en español rioplatense, en máximo 3 oraciones cortas y simples, por qué la respuesta del alumno es incorrecta y cómo recordar la correcta. Sin markdown.',
        user: `Ejercicio: ${String(b.question).slice(0, 300)}\nRespuesta del alumno: ${String(b.given).slice(0, 100)}\nRespuesta correcta: ${String(b.correct).slice(0, 100)}`,
        maxTokens: 300,
      });
      return send(res, 200, { text: text.replace(/\*\*/g, '') });
    }

    if (b.action === 'story') {
      const kanji = [...new Set((b.kanji || []).filter(k => typeof k === 'string' && k.length === 1))].slice(0, 60);
      const creatures = (b.creatures || []).slice(0, 4).map(c => `${c.k} (${String(c.m).slice(0, 30)})`);
      const vocab = (b.vocab || []).slice(0, 60).map(v => String(v).slice(0, 30));
      const grammar = (b.grammar || []).slice(0, 15).map(g => String(g).slice(0, 80));
      const theme = String(b.theme || '').slice(0, 80);
      const system = `Sos autor de lecturas graduadas de japonés para hispanohablantes principiantes en el juego KANJŪ, donde cada kanji es una criatura.
Reglas estrictas:
- Escribí entre 4 y 7 oraciones cortas en japonés natural y correcto, forma cortés (です/ます).
- Usá SOLO estos kanji: ${kanji.join(' ') || '(ninguno)'}. Cualquier otra palabra va en hiragana o katakana. Nunca uses otros kanji.
- Escribí cada kanji o grupo de kanji seguido de su lectura entre llaves: 木{き}, 森{もり}, 明日{あした}.
- Separá las palabras y partículas con un espacio para principiantes: 木{き} の した で 休{やす}みます。
- Usá preferentemente este vocabulario conocido: ${vocab.join(', ') || 'básico'}.
- Gramática que el alumno ya vio (no uses estructuras mucho más avanzadas): ${grammar.join('; ') || 'A は B です, あります/います'}.
- Las criaturas protagonistas son personajes: ${creatures.join(', ')}. Llamalas por su kanji con lectura (por ejemplo 木{き}さん).
- Incluí como máximo 2 palabras nuevas útiles, y listalas.
Respondé SOLO con JSON válido con esta forma:
{"title":"título corto en español","lines":[{"jp":"oración con kanji{lectura}","es":"traducción"}],"questions":[{"q":"pregunta de comprensión en español","a":"respuesta correcta","wrong":["incorrecta 1","incorrecta 2"]}],"new_words":[{"jp":"palabra en kana","es":"significado"}]}
Incluí 2 o 3 preguntas.`;
      const text = await generate(target, { system, user: `Escribí una historia nueva${theme ? ` sobre: ${theme}` : ''}.`, json: true, maxTokens: 1600 });
      const st = parseJSON(text);
      const allowed = new Set(kanji);
      // Validación: se descartan oraciones con kanji no permitidos o sin lectura
      st.lines = (st.lines || []).filter(l => l?.jp && l?.es).map(l => ({ jp: String(l.jp).slice(0, 200), es: String(l.es).slice(0, 200) }))
        .filter(l => { const bare = l.jp.replace(/\{[^}]*\}/g, ''); const ks = bare.match(KANJI_RX) || []; return ks.every(k => allowed.has(k)) && !/[㐀-鿿々](?![㐀-鿿々]*\{)/.test(l.jp); });
      if (st.lines.length < 3) throw new AIError('La IA no respetó tus kanji. Probá de nuevo.', 502);
      st.questions = (st.questions || []).filter(q => q?.q && q?.a && Array.isArray(q.wrong)).slice(0, 3).map(q => ({ q: String(q.q).slice(0, 160), a: String(q.a).slice(0, 80), wrong: q.wrong.slice(0, 2).map(w => String(w).slice(0, 80)) }));
      st.new_words = (st.new_words || []).filter(w => w?.jp && w?.es).slice(0, 2).map(w => ({ jp: String(w.jp).slice(0, 20), es: String(w.es).slice(0, 40) }));
      st.title = String(st.title || 'Historia').slice(0, 60);
      return send(res, 200, { story: st });
    }
    return send(res, 400, { error: 'Acción desconocida' });
  } catch (e) {
    console.error(e);
    return send(res, e instanceof AIError ? (e.status && e.status < 600 ? 502 : 502) : 500, { error: e instanceof AIError ? e.message : 'Error del servidor' });
  }
}
