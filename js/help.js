// Ayuda para principiantes: furigana en la interfaz, romaji, Academia y entrenador de kana.
import { S, save } from './state.js';

// Kanji de la interfaz: [lectura, significado]
export const GLOSS = {
  '漢獣': ['かんじゅう', 'bestia kanji'], '目標': ['もくひょう', 'objetivo'], '進化': ['しんか', 'evolución'],
  '苑': ['えん', 'jardín'], '錬': ['れん', 'forjar'], '旅': ['たび', 'viaje'], '店': ['みせ', 'tienda'], '図': ['ず', 'mapa'],
  '墨': ['すみ', 'tinta'], '任': ['にん', 'deber'], '我': ['われ', 'yo'], '位': ['くらい', 'rango'], '匠': ['たくみ', 'artesano'],
  '蔵': ['くら', 'almacén'], '収': ['しゅう', 'cosechar'], '空': ['くう', 'espacio'], '修': ['しゅう', 'disciplina'],
  '練': ['れん', 'entrenar'], '餅': ['もち', 'mochi'], '輪': ['わ', 'ciclo'], '放': ['ほう', 'soltar'], '召': ['しょう', 'invocar'],
  '札': ['ふだ', 'boleto'], '置': ['ち', 'colocar'], '品': ['ひん', 'artículo'], '巻': ['まき', 'pergamino'], '風': ['かぜ', 'viento'],
  '香': ['こう', 'incienso'], '暦': ['こよみ', 'calendario'], '週': ['しゅう', 'semana'], '章': ['しょう', 'insignia'],
  '門': ['もん', 'puerta'], '広': ['ひろ', 'amplio'], '覚': ['かく', 'despertar'], '熟': ['じゅく', 'maestría'],
  '音': ['おん', 'lectura china'], '訓': ['くん', 'lectura japonesa'], '絆': ['きずな', 'vínculo'], '合': ['ごう', 'unir'],
  '書': ['かく', 'escribir'], '読': ['よむ', 'leer'], '語': ['ご', 'palabra'], '組': ['くみ', 'armar'], '聴': ['きく', 'escuchar'],
  '硯': ['すずり', 'piedra de tinta'], '灯': ['とう', 'farol'], '松': ['まつ', 'pino'], '池': ['いけ', 'estanque'],
  '祠': ['ほこら', 'santuario'], '鐘': ['かね', 'campana'], '炉': ['ろ', 'brasero'], '芽': ['め', 'brote'], '集': ['しゅう', 'reunir'],
  '学': ['がく', 'estudio'], '半': ['はん', 'mitad'], '全': ['ぜん', 'todo'], '富': ['とみ', 'riqueza'], '卵': ['たまご', 'huevo'],
  '仮': ['か', 'kana'], '闘': ['とう', 'combate'], '箱': ['はこ', 'caja'], '道': ['みち', 'camino'], '族': ['ぞく', 'familia'],
  '庭': ['にわ', 'jardín'], '守': ['しゅ', 'guardián'], '復': ['ふく', 'repasar'], '敵': ['てき', 'rival'], '連': ['れん', 'combo'], '目': ['もく', 'objetivo'],
  '勝利': ['しょうり', 'victoria'], '敗北': ['はいぼく', 'derrota'], '必殺': ['ひっさつ', 'golpe especial'], '五行': ['ごぎょう', 'cinco elementos'],
};
const KEYS = Object.keys(GLOSS).sort((a, b) => b.length - a.length);
const RX = new RegExp(KEYS.join('|'), 'g');
const SEL = '.tok i,.fab i,.rk-badge,.collect-pill i,.review-pill i,.rv i,.tabs i,.dk i,.act i,.shop-row>i,.gcard i,.chip,.pill,.ak,.rank span,.sheet h3,.sheet h4,.v-shop h4,.v-dex h4,.v-lab h4,.wallet,.goal i,.mast,.reads span,.bar label,.btn,.story-d summary,.new-tag,.cal-d b i,.ach i,.deco-row>i,.place-bar,.acad-btn';

export const helpOn = () => S.help !== false;
// Íconos y glifos de navegación no llevan furigana: ya tienen su etiqueta y la ruby los desalinea
// (los íconos SÍ llevan furigana; sólo se excluyen la respuesta de los desafíos y números flotantes)
const NOFURI = 'rt,ruby,svg,.ck,.dmg,.dmg3d,.no-furi';
function annotate(root) {
  if (!helpOn()) return;
  const els = root.matches?.(SEL) ? [root, ...root.querySelectorAll(SEL)] : root.querySelectorAll?.(SEL) || [];
  for (const el of els) {
    if (el.dataset.ann) continue; el.dataset.ann = 1;
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
    while (walk.nextNode()) if (!walk.currentNode.parentElement.closest(NOFURI)) nodes.push(walk.currentNode);
    for (const n of nodes) {
      if (!RX.test(n.data)) continue; RX.lastIndex = 0;
      const span = document.createElement('span');
      span.innerHTML = n.data.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])
        .replace(RX, m => `<ruby class="gl" data-g="${m}">${m}<rt>${GLOSS[m][0]}</rt></ruby>`);
      n.replaceWith(...span.childNodes);
    }
  }
}
// Prender/apagar sin recargar: quita o vuelve a poner la furigana en toda la pantalla
export function setHelp(on) {
  S.help = on; save();
  document.querySelectorAll('ruby.gl').forEach(r => r.replaceWith(document.createTextNode(r.dataset.g)));
  document.querySelectorAll('[data-ann]').forEach(e => { delete e.dataset.ann; e.normalize(); });
  if (on) annotate(document.body);
}
export function startHelp(toast) {
  annotate(document.body);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && annotate(n))))
    .observe(document.body, { childList: true, subtree: true });
  // Mantener presionado un ícono muestra su significado
  let t;
  document.addEventListener('pointerdown', e => {
    const r = e.target.closest?.('ruby.gl'); if (!r) return;
    t = setTimeout(() => { const [rd, m] = GLOSS[r.dataset.g]; toast(`<b>${r.dataset.g}</b> ${rd} (${romaji(rd)}) · ${m}`); }, 450);
  });
  ['pointerup', 'pointercancel', 'pointermove'].forEach(ev => document.addEventListener(ev, () => clearTimeout(t)));
}

// --- Kana → romaji (Hepburn simplificado) ---
const H = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ';
const R = 'a i u e o ka ki ku ke ko sa shi su se so ta chi tsu te to na ni nu ne no ha hi fu he ho ma mi mu me mo ya yu yo ra ri ru re ro wa o n ga gi gu ge go za ji zu ze zo da ji zu de do ba bi bu be bo pa pi pu pe po'.split(' ');
const MAP = {}; [...H].forEach((c, i) => MAP[c] = R[i]);
const toHira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
export function romaji(s) {
  s = toHira(s.replace(/[()]/g, '')); let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i], nx = s[i + 1];
    if ('ゃゅょ'.includes(nx) && MAP[c]) { const base = MAP[c].slice(0, -1), y = { 'ゃ': 'a', 'ゅ': 'u', 'ょ': 'o' }[nx]; out += /^(sh|ch|j)$/.test(base) ? base + y : base + 'y' + y; i++; continue; }
    if (c === 'っ') { const n = MAP[nx] || ''; out += n[0] === 'c' ? 't' : n[0] || ''; continue; }
    if (c === 'ー') { out += out.slice(-1); continue; }
    out += MAP[c] ?? (c === '・' ? ' · ' : c);
  }
  return out;
}
// Lectura con romaji si la ayuda está activa
export const rr = r => helpOn() && r ? `${r}<i class="rmj">${romaji(r)}</i>` : r;

// --- Academia: lecciones cortas para quien empieza desde cero ---
export const LESSONS = [
  { k: '字', t: '¿Qué es un kanji?', ink: 15, body: `<p>El japonés mezcla tres escrituras:</p>
    <ul><li><b>Kanji</b> (漢字): signos con significado, como <b>木</b> = árbol.</li><li><b>Hiragana</b> (ひらがな): sonidos para gramática y lecturas.</li><li><b>Katakana</b> (カタカナ): sonidos para palabras extranjeras… ¡y para las lecturas 音!</li></ul>
    <p>En KANJŪ cada kanji es una criatura. No hace falta saber japonés: aprendés jugando.</p>` },
  { k: '音', t: 'Las dos lecturas: 音 y 訓', ink: 20, body: `<p>Casi todo kanji tiene dos tipos de lectura:</p>
    <ul><li><b>音 on</b>: lectura de origen chino, escrita en katakana. 木 → モク (<i>moku</i>).</li><li><b>訓 kun</b>: lectura japonesa, escrita en hiragana. 木 → き (<i>ki</i>).</li></ul>
    <p>Truco: solo, un kanji suele usar 訓 (木 = <i>ki</i>, árbol). En palabras compuestas suele usar 音 (森林 = <i>shinrin</i>, bosque).</p>` },
  { k: '仮', t: 'Kana: los sonidos', ink: 20, body: `<p>El hiragana y el katakana son silabarios: cada signo es una sílaba.</p>
    <div class="kana-row"><span>か<i>ka</i></span><span>き<i>ki</i></span><span>く<i>ku</i></span><span>け<i>ke</i></span><span>こ<i>ko</i></span></div>
    <div class="kana-row"><span>カ<i>ka</i></span><span>キ<i>ki</i></span><span>ク<i>ku</i></span><span>ケ<i>ke</i></span><span>コ<i>ko</i></span></div>
    <p>Arriba hiragana, abajo katakana: mismo sonido, distinta forma. En el Dojo vas a encontrar el <b>entrenador de kana</b> con los sonidos de tus criaturas.</p>` },
  { k: '組', t: 'Los kanji se arman con piezas', ink: 20, body: `<p>Muchos kanji combinan otros más simples. Por eso podés <b>fusionar</b> criaturas:</p>
    <div class="kana-row"><span>木</span><em>+</em><span>木</span><em>=</em><span>林</span><em>+</em><span>木</span><em>=</em><span>森</span></div>
    <p>Árbol + árbol = arboleda. Arboleda + árbol = bosque. Si reconocés las piezas, adivinás el significado de kanji nuevos.</p>` },
  { k: '部', t: 'Kanji con piezas', ink: 15, body: `<p>Muchos kanji llevan <b>piezas</b> (部品) que casi nunca aparecen solas, como 宀 <i>techo</i> o 儿 <i>piernas</i>.</p>
    <div class="kana-row"><span>宀</span><em>+</em><span>子</span><em>=</em><span>字</span></div>
    <p>Techo + niño = <b>letra</b>: un niño estudiando bajo techo. En KANJŪ las piezas son <b>accesorios</b>: se los equipás a una criatura para que evolucione, o los sumás en el laboratorio de fusión.</p>
    <p>Las conseguís en la Tienda, en los viajes y completando estas lecciones.</p>` },
  { k: '語', t: 'Palabras con dos kanji', ink: 25, body: `<p>Juntando kanji se forman palabras: <b>日</b> (sol) + <b>本</b> (origen) = <b>日本</b> <i>nihon</i>, Japón: "el origen del sol".</p>
    <p>El juego Palabra 語 te entrena en esto. Leer las piezas te da una pista del significado.</p>
    <p>Para recordar mejor: escribí tu propia historia en la ficha de cada criatura (💡).</p>` },
];
export const lessonsNew = () => LESSONS.filter((_, i) => !(S.lessons || []).includes(i)).length;
export function openAcademy(modal, toast, hud, kana) {
  const done = S.lessons || [];
  const m = modal(`<h3>学 Academia</h3><p class="muted">Lecciones de 1 minuto para quien empieza de cero.</p>
    <div class="acad">${LESSONS.map((l, i) => `<button class="lesson ${done.includes(i) ? 'done' : ''}" data-l="${i}"><i>${l.k}</i><div><b>${l.t}</b><small>${done.includes(i) ? '✓ Leída' : `+${l.ink} 墨`}</small></div></button>`).join('')}</div>
    <button class="btn ok wide" id="kanaBtn">仮 Entrenar kana (los sonidos de tus criaturas)</button>
    <label class="toggle"><input type="checkbox" id="helpT" ${helpOn() ? 'checked' : ''}> Mostrar lecturas sobre los íconos y romaji</label>`);
  m.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
    const i = +b.dataset.l, l = LESSONS[i];
    const v = modal(`<div class="lesson-view"><span class="lk">${l.k}</span><h3>${l.t}</h3>${l.body}<button class="btn ok wide">Entendido</button></div>`);
    v.querySelector('.btn').onclick = () => {
      if (!done.includes(i)) { S.lessons = [...done, i]; S.ink += l.ink; toast(`学 Lección completada · +${l.ink} 墨`); }
      save(); v.close(); m.close(); hud(); openAcademy(modal, toast, hud, kana);
    };
  });
  m.querySelector('#kanaBtn').onclick = () => { m.close(); kana(); };
  m.querySelector('#helpT').onchange = e => { setHelp(e.target.checked); };
}

// --- Entrenador de kana: sonidos que aparecen en las lecturas de tus criaturas ---
export function kanaPool(readsOf) {
  const set = new Set();
  Object.keys(S.dex).filter(k => S.dex[k].owned).forEach(k => readsOf(k).forEach(r => [...r.replace(/[()・]/g, '')].forEach(c => MAP[toHira(c)] && !'ゃゅょっ'.includes(toHira(c)) && set.add(c))));
  return [...set];
}
export function kanaDrill(pool, root) {
  return new Promise(done => {
    const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
    const q = shuffle(pool).slice(0, 10); let i = 0, ok = 0;
    const w = document.createElement('div'); w.className = 'game';
    w.innerHTML = `<div class="game-head"><span class="chip">仮 Kana</span><div class="prog"><i></i></div><button class="x">✕</button></div><div class="game-body"></div>`;
    root.append(w);
    const body = w.querySelector('.game-body'), bar = w.querySelector('.prog i');
    const end = () => { w.remove(); done({ right: ok, total: q.length }); };
    w.querySelector('.x').onclick = end;
    const next = () => {
      bar.style.width = i / q.length * 100 + '%';
      if (i >= q.length) return end();
      const c = q[i++], ans = romaji(c);
      const opts = shuffle([ans, ...shuffle([...new Set(R)].filter(x => x !== ans)).slice(0, 3)]);
      body.innerHTML = `<p class="hint">¿Cómo suena?</p><div class="qk">${c}</div><p class="muted" style="color:#8fa3bd">${/[ァ-ヶ]/.test(c) ? 'katakana' : 'hiragana'}</p><div class="opts txt">${opts.map(o => `<button class="opt">${o}</button>`).join('')}</div>`;
      body.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        body.querySelectorAll('.opt').forEach(x => x.disabled = true);
        if (b.textContent === ans) { ok++; b.classList.add('right'); navigator.vibrate?.(8); }
        else { b.classList.add('wrong'); [...body.querySelectorAll('.opt')].find(x => x.textContent === ans).classList.add('right'); }
        setTimeout(next, 650);
      });
    };
    next();
  });
}
