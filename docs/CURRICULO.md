# Currículo en el entrenamiento — especificación

Pedido por Nicolás el 13 de noviembre de 2026. Plan completo y discutido en el documento "Kanjuu — Roadmap del aprendizaje integrado al entrenamiento". Este archivo lo baja al código.

**La idea en una línea:** la Academia desaparece como lugar aparte; todo el japonés se aprende en la pestaña **Entrenar** de cada KANJŪ. Cada ronda mezcla un poco del kanji de esa criatura con la sección del currículo donde está el jugador. Completar una sección puede regalar como mucho un KANJŪ.

Se apoya en lo que ya existe y no lo tira:

| Ya existe | Qué papel tiene ahora |
|---|---|
| `js/lang.js` (LEX, PHRASES, READINGS, PATTERNS) | Banco de palabras y frases de las secciones. Se amplía; los ids no cambian |
| `S.srs` (kanji), `S.lex` (palabras), `S.kana` (kana) | Dominio por ítem. El currículo no crea un registro paralelo |
| Romaji por kana que se apaga a los 3 aciertos (`js/help.js`) | Es la escritura adaptativa del plan. Se mantiene; se le suma lo mismo para la furigana por kanji |
| Juegos de entrenamiento (`js/games.js`, `js/wordgames.js`) | Son los ejercicios del kanji de la criatura dentro de la ronda |
| Diario (`js/diary.js`) | Registro de palabras, frases y criaturas obtenidas (con la frase donde nacieron) |
| Hallazgos de viaje (`js/trips.js`) | Siguen: son otra fuente de encuentros con las palabras ya vistas en las secciones |
| Arena 3v3 (`js/arena.js`) | Motor del combate de examen |
| `S.acad` | No se borra (guardado compatible), pero la Academia sale de la navegación |

---

## 1. Estructura: etapa → sección → ronda

| Nivel | Qué es | Tamaño |
|---|---|---|
| Etapa | Un tramo del idioma (E0 kana, E1 intro, E2 A1, E3 A1+, E4 A2) | 8 a 12 secciones |
| Sección | Una situación de la vida real con su gramática, palabras y kanji | 5 rondas + dorado opcional |
| Ronda | Una sesión en la pestaña Entrenar de un KANJŪ | 12 ejercicios, 3 a 5 minutos |

**Estados de una sección:** bloqueada → en curso (0 a 5 rondas) → completa (se evalúa la recompensa y se abre la siguiente) → dorada (opcional, ganando el combate de examen).

**La ronda se juega con la criatura cuya ficha se abrió** (pestaña Entrenar). Cualquier criatura sirve para avanzar la sección del jugador; lo que cambia según la criatura son sus 2 ejercicios de kanji y su voz.

**Tres niveles separados:**
- Nivel del jugador (rango de guardián): sube con todo lo que aprende, entrene a quien entrene.
- Nivel de la criatura (`c.lv`, `c.know`): sube con las rondas hechas con ella. Habilita evoluciones y fusiones como hoy.
- Dominio por ítem: `S.srs`, `S.lex`, `S.kana`.

**Nivelación inicial:** la conversación del huevo pregunta qué sabe el jugador (ya existe en `docs/APRENDIZAJE.md` §6). Según la respuesta entra en E0, en E1 o, tras una prueba corta, más adelante. Las secciones salteadas quedan completas pero no doradas, y **su KANJŪ no se entrega**: se consigue por evolución, exploración, fusión o boleto de invocación.

## 2. Anatomía de una ronda (12 ejercicios)

| Bloque | Cantidad | Contenido |
|---|---|---|
| Apertura | 1 | La criatura presenta la situación en una frase (su voz) |
| Sección: entrada | 3 | Palabras y estructura nuevas, reconocimiento |
| Kanji de la criatura | 2 | Un juego de `GAMES` (lecturas, palabra, ensamblar, escuchar, trazo) |
| Sección: práctica | 3 | Armar frases con fichas, completar el hueco, escuchar |
| Repaso | 2 | Ítems vencidos de `S.srs` / `S.lex` / `S.kana` |
| Cierre | 1 | Producción: armar la frase entera |

- La ronda cuenta si se acierta el 80 % o más. Un error no la corta: el ejercicio vuelve al final.
- Rondas 1–2 presentan, 3–4 practican, la 5 mezcla y exige más producción.
- Si el kanji de la criatura ya está dominado, sus 2 ejercicios pasan a sus compuestos o a su evolución.
- Todo funciona sin IA. Audio con el motor de voces que ya usa el juego (`speak`).
- Las secciones son **fijas**: el mismo contenido para todos. El "sabor por familia" (frases con vocabulario de la familia de la criatura) solo llega con la capa de IA (§7).

## 3. Datos (`js/curriculum.js`, archivo nuevo)

```js
export const STAGES = [{ id: 'e0', title: { es, en }, level: 'kana' }, …];
export const SECTIONS = [{
  id: '1.9', stage: 'e1',
  title: { es: 'Mi familia', en: 'My family' },
  cando: { es: 'Puedo presentar a mi familia', en: 'I can introduce my family' },
  words: ['kazoku', 'chichi', …],   // ids de LEX: el núcleo que se evalúa
  phrases: ['p_…', …],             // ids de PHRASES
  pats: ['arimasu'],               // ids de PATTERNS que introduce
  kana: null,                      // E0: los kana que enseña, en orden
  kanji: ['父', '母', '兄', '弟', '姉', '妹'],
  reward: '弟',                     // KANJŪ que puede regalar, o null
  rewardWord: 'otouto',            // palabra de LEX que lo contiene (decide la entrega)
  rival: ['兄', '姉', '妹'],        // los 3 rivales del combate de examen
}, …];
export function checkCurriculum() { … }  // como checkLang(): devuelve la lista de errores
```

Reglas que valida `checkCurriculum()` (y un script `tools/check_curriculo.mjs`):
- Cada palabra, frase y patrón existe en `js/lang.js`; cada kanji y cada recompensa existe en `KANJI`.
- Una frase de una sección solo usa palabras de esa sección o de secciones anteriores.
- Cada sección tiene entre 8 y 20 palabras núcleo y al menos 4 frases.
- `reward` aparece en la forma escrita de `rewardWord`.
- Ningún KANJŪ es recompensa de dos secciones.

## 4. Progreso (`S.cur`, guardado compatible)

```js
S.cur ??= { sec: '0.1', rounds: {}, gold: {}, got: {}, skipped: {}, eggs: {} };
// rounds['1.9'] = 0..5 · gold['1.9'] = true · got['1.9'] = '弟' · skipped['1.3'] = true
// eggs['茶'] = { from: 'ocha', hatched: false }
```

- Partidas existentes: se ubican por lo que ya saben (kana con `S.kana`, palabras con `S.lex`). Ante la duda, un peldaño abajo. Nada se borra.
- La evaluación de aciertos y la entrega de recompensas quedan del lado del cliente por ahora, como el resto del juego. Validarlas en el servidor va con el Sprint 7 (validación de partida).

## 5. Recompensas: el kanji pintado con tinta

Acordado con Nicolás el 13 de noviembre de 2026 (propuesta A-02, `docs/propuestas/A-02-entrenar.html`).
- **Un KANJŪ por sección o ninguno.** Cada entrenamiento que cuenta pinta una parte de los trazos reales (KanjiVG) del kanji escondido de la sección: con 5 entrenamientos queda completo.
- Al completar la sección, el kanji queda **pintado y dormido**, y **cobra vida** en cuanto `rewardWord` llega a la caja 2 de `S.lex` (en la etapa 0, los «huevos», a la caja 3). Si ya estaba dominada, despierta en ese mismo momento; si no, al terminar cualquier entrenamiento posterior en que se cumpla.
- Si el jugador ya tenía esa criatura: +30 墨 en su lugar. Si no hay lugar en el santuario, espera en la puerta.
- Las secciones salteadas por la nivelación no pintan nada.
- Palabras sin kanji (コーヒー, ありがとう): nunca dan criatura.
- Estado en `S.cur.got[sección]`: `asleep` · `alive` · `ink` · `gate`.

**Vías para obtener KANJŪ** (el entrenamiento es una más): huevo inicial · entrenamiento (sección completa) · exploración y viajes · Arena · laboratorio (evolución y fusión) · boleto de invocación.

## 6. Combate de examen (dorado)

Decidido con Nicolás el 13 de noviembre de 2026: **sigue la misma lógica de la Arena** (`js/arena.js`, `startDuel` con opciones; el duelo normal no cambia).
- Opcional, para secciones completas (no salteadas), y se puede reintentar sin perder nada. Se abre desde el cuaderno o desde el resultado al completar la sección.
- 3 contra 3: la criatura que entrenó la sección más 2 que elige el jugador, contra las 3 sombras de la sección (`rival`), al nivel promedio del equipo.
- Cada ataque es una pregunta de las palabras de la sección (qué significa, en kana y sin romaji), con el reloj, los tipos 五行, el combo y el 必殺 de la Arena. Se gana derrotando a las 3 sombras.
- No se juegan copas ni cofres. Dorar da el sello 金 en el cuaderno y +40 墨 la primera vez.

## 7. Capa de IA (plan pago o clave propia)

Encima del juego base, nunca requisito:
- Frases de sabor según la familia de la criatura.
- Misiones y cuentos armados con los kanji y palabras que el jugador ya domina (caja 3 o más), protagonizados por sus KANJŪ. Esto amplía lo que ya hace `js/ai.js` con los cuentos.
- Charla libre con la criatura y corrección de lo que escribe.

**Salvaguarda i+1:** todo texto generado pasa por un control contra `S.lex`/`S.srs` antes de mostrarse; como mucho 5 % de palabras nuevas, y solo de la sección actual o la siguiente. Si se pasa, se regenera o se usa el contenido fijo.

**Se hace después** (decidido por Nicolás el 13 de noviembre de 2026, con la tarea A-11): hoy la clave propia vive en el dispositivo (`js/ai.js`, localStorage) y la app habla directo con el proveedor. El plan pide que la clave nunca viva en el navegador: guardarla cifrada en el servidor y llamar al proveedor desde `api/`. Eso necesita una variable de entorno nueva (clave de cifrado) en Vercel, que los agentes no pueden crear (CLAUDE.md, regla 6). El plan pago necesita además una clave del juego y un precio (a definir).

## 8. Revisión del japonés

Claude revisa el japonés de cada etapa antes de publicarla, con frases de manual (Genki, Irodori, Marugoto) y sin japonés inventado. Conviene sumar un hablante nativo antes del lanzamiento en tiendas.

---

## 9. Las 54 secciones

Las palabras concretas de cada sección se cargan en `js/curriculum.js` etapa por etapa (tareas A-01, A-08, A-09, A-10). Columnas: situación · gramática · kanji nuevos · KANJŪ de recompensa.

### Etapa 0 · Sonidos y kana (romaji → hiragana y katakana)

| # | Situación | Contenido | Kana | Recompensa |
|---|---|---|---|---|
| 0.1 | Saludar a tu KANJŪ | こんにちは, ありがとう, さようなら | あ行, か行 | — |
| 0.2 | Pedir algo para tomar | 〇〇 を ください; おちゃ, みず | さ行, た行 | huevo de 茶 |
| 0.3 | Decir tu nombre | わたしは 〇〇 です | な行, は行 | huevo de 名 |
| 0.4 | Contar del 1 al 10 | いち … じゅう | ま行, や行, ら行, わ, を, ん | huevo de 一 |
| 0.5 | Comida de casa | ごはん, ぎゅうにゅう | dakuten, ゃゅょ, っ, vocales largas | — |
| 0.6 | El café del pueblo | コーヒー, パン, ジュース | katakana ア–ナ | — (sellos) |
| 0.7 | Países y nombres | ウルグアイ, アメリカ, tu nombre | katakana ハ–ン, ー | — (sellos) |
| 0.8 | Tu KANJŪ lee su primer cartel | repaso: carteles solo en kana | todo | — |

### Etapa 1 · Primeros pasos (N5)

| # | Situación | Gramática | Kanji nuevos | Recompensa |
|---|---|---|---|---|
| 1.1 | De dónde soy | X は Y です, の, 〜じん | 私 人 日 本 国 | 本 |
| 1.2 | ¿Qué es esto? | これ / それ / あれ, 何ですか | 何 口 目 | 口 |
| 1.3 | Decir la hora | 〜時, 〜分, 何時 | 時 分 半 二–十 | 時 |
| 1.4 | Precios en el mercado | いくら, 百 / 千 / 万 | 百 千 万 円 | 円 |
| 1.5 | Comer y beber | 〜ます, を | 食 飲 水 | 食 |
| 1.6 | Los días de la semana | 〜曜日, に (tiempo) | 月 火 木 金 土 曜 | — |
| 1.7 | Ir y volver | 行きます / 来ます / 帰ります, へ, で | 行 来 帰 車 | 車 |
| 1.8 | Lo que me gusta | 〜が 好きです, adjetivos básicos | 好 大 小 | 好 |
| 1.9 | Mi familia | 〜が います, お〜さん | 父 母 兄 弟 姉 妹 | 弟 o 妹 |
| 1.10 | ¿Dónde está? | あります / います, に (lugar) | 上 下 中 前 後 | 中 |

### Etapa 2 · Vida diaria (A1, N5)

| # | Situación | Gramática | Kanji nuevos | Recompensa |
|---|---|---|---|---|
| 2.1 | Mi rutina | 〜ます / 〜ません, 毎〜 | 毎 朝 昼 夜 起 | 朝 |
| 2.2 | Lo que hice ayer | 〜ました / 〜ませんでした | 今 先 週 年 | 今 |
| 2.3 | Comprar ropa | 〜を ください, colores | 買 赤 白 黒 青 | 買 |
| 2.4 | Describir cosas | adjetivos い / な, pasado | 新 古 高 安 | 新 |
| 2.5 | Planes para el finde (futuro) | presente con valor futuro, 〜ませんか, 〜ましょう | 明 来週 末 | 明 |
| 2.6 | El clima | 〜でしょう, estaciones | 天 気 雨 雪 春 夏 秋 冬 | 雨 |
| 2.7 | Mi casa | 〜が あります, contadores | 家 門 窓 | 家 |
| 2.8 | Pedir direcciones | forma て, 〜てください | 道 駅 右 左 | 道 |
| 2.9 | En el restaurante | 〜に します, 〜と 〜 | 肉 魚 卵 米 | 魚 |
| 2.10 | Pedir permiso | 〜てもいいですか, 〜てはいけません | 入 出 休 | 休 |
| 2.11 | Lo que estoy haciendo | 〜ています | 話 聞 読 書 | 話 |
| 2.12 | Mis hobbies | 〜のが 好き, forma de diccionario | 音 楽 歌 見 | 音 |

### Etapa 3 · Ampliar el mundo (A1+ a A2)

| # | Situación | Gramática | Kanji nuevos | Recompensa |
|---|---|---|---|---|
| 3.1 | Comparar | 〜より 〜のほうが, いちばん | 多 少 早 長 | 長 |
| 3.2 | El café de animales | contadores 〜匹 / 〜羽 / 〜頭 | 犬 猫 鳥 馬 牛 | 鳥 o 猫 |
| 3.3 | Me siento mal | 〜が 痛い, 〜たほうがいい | 体 頭 手 足 病 薬 | 体 |
| 3.4 | ¿Alguna vez...? | 〜たことがあります | 旅 外 言 | 旅 * |
| 3.5 | Un día en la naturaleza | 〜たり 〜たり | 山 川 海 空 | 海 |
| 3.6 | Charla casual | forma corta, 〜と思います | 思 知 考 | 思 |
| 3.7 | Lo que quiero | 〜たい, 〜が ほしい | 心 物 欲 | — |
| 3.8 | Viajar en tren | 〜から 〜まで, 乗ります | 電 乗 地 鉄 | 電 |
| 3.9 | Escuela y trabajo | 〜てから, 〜ながら | 学 校 仕 事 生 | 学 |
| 3.10 | Dar y recibir | あげます / もらいます / くれます | 送 返 紙 | 紙 |
| 3.11 | Cuando y si... | 〜とき, 〜たら, 〜から | 間 由 | — |
| 3.12 | Fiestas de Japón | repaso de la etapa | 花 祭 正 | 花 |

### Etapa 4 · Conversación cotidiana (A2, N4)

| # | Situación | Gramática | Kanji nuevos | Recompensa |
|---|---|---|---|---|
| 4.1 | Lo que puedo hacer | potencial | 力 上手 | 力 |
| 4.2 | Mis planes | volitivo, つもり, 予定 | 予 定 約 | — |
| 4.3 | Parece que... | 〜そうです, 〜みたい | 風 光 色 | 風 * |
| 4.4 | Se me rompió | 〜てしまう, 〜ておく | 壊 落 忘 | — |
| 4.5 | Si hace sol, vamos | 〜ば, 〜と | 晴 暑 寒 | 晴 * |
| 4.6 | Hablar con respeto | keigo básico | 社 員 客 | 客 * |
| 4.7 | Me pasó algo | pasiva | (a definir, N4) | — |
| 4.8 | Hacer que alguien haga | causativa | 教 習 勉 | 教 |
| 4.9 | Para que... | 〜ように, 〜ために | 目的 願 | — |
| 4.10 | Contar una historia | 〜たあとで, 〜るまえに | 語 始 終 | 始 |
| 4.11 | Quejarse y disculparse | 〜ので, 〜のに | (a definir, N4) | — |
| 4.12 | Gran viaje por Japón | repaso de las etapas 1 a 4 | 京 都 県 | 京 |

\* No está en el roster actual (294 kanji). De los 42 KANJŪ de recompensa, 38 ya existen. Faltan **旅, 風, 晴 y 客**: decidido por Nicolás el 13 de noviembre de 2026, entran como dibujo borrador simple y se diseñan después (tarea A-04b). Además, 38 kanji que se enseñan en las secciones no son criatura (帰, 雪, 窓, 卵, 歌…); está bien: se enseñan dentro de palabras aunque no tengan KANJŪ.

---

## 10. Tareas (orden propuesto)

| ID | Tarea | Tipo |
|---|---|---|
| A-01 | Datos del currículo E0–E1 en `js/curriculum.js` + `checkCurriculum()` + script de chequeo. Amplía LEX y PHRASES donde haga falta | contenido |
| A-02 | Propuesta: pantalla de ronda, mapa de secciones en la pestaña Entrenar y escena de "materialización" | diseño (propuesta) |
| A-03 | Motor de rondas: arma la ronda (8 + 2 + 2), corrige, actualiza dominios, `S.cur`. Interfaz provisoria hasta que se apruebe A-02 | código |
| A-04 | Recompensas: entrega al completar la quinta ronda, huevos de E0, silueta en el diario | código |
| A-05 | Nivelación: prueba corta para saltar secciones; ubicación de partidas existentes | código |
| A-06 | Implementar lo aprobado en A-02 | diseño (implementación) |
| A-07 | Combate de examen 3v3 con el motor de la Arena y estado dorado | código |
| A-08 · A-09 · A-10 | Contenido de E2, E3 y E4, revisado antes de publicar | contenido |
| A-11 | Capa de IA: sabor por familia, misiones y cuentos con el perfil, validador i+1 (después de la decisión sobre la clave) | código |
