# Progresión real del aprendizaje (modelo Duolingo) — propuesta

Pedido por Nicolás el 14 de noviembre de 2026: «Quiero que te bases en cómo lo hace Duolingo. Yo aprendí con ellos. Hubo una progresión de aprendizaje real».

Y el 14 de noviembre, más tarde: «Quiero una experiencia de aprendizaje tan profunda y real como la de Duolingo, pero que no sea igual. Somos Kanjū, no Duolingo. Nos enfocamos en los KANJŪ y en sus kanji: ese es el diferenciador. Pero usamos un modelo educativo que sabemos que funciona».

Esto es la especificación. Se toma de Duolingo la **progresión pedagógica** (cantidad, orden, repetición, dificultad que sube, guía por unidad, saltar con prueba), no su aspecto ni su identidad: el entrenamiento sigue siendo con tu KANJŪ, en el santuario, con el kanji que se pinta con tinta. Lo que Duolingo no tiene —criaturas que *son* kanji— es el centro (ver §2b).

---

## 1. Qué pasa hoy (diagnóstico)

Nicolás llegó a la etapa 4 «con los ojos cerrados» sin dominar el N5. Causas encontradas en el código:

| Problema | Dónde | Efecto |
|---|---|---|
| **Muy poco contenido.** Todo el currículo tiene 54 secciones, **295 palabras**, 173 kanji y 246 frases | `js/curriculum.js` | El N5 pide unas 800 palabras y el N4 unas 1500. Las etapas dicen «N5» y «N4», pero el contenido no llega ni al N5 |
| **Los kanji casi no se ven.** Una palabra se muestra con kanji solo si el jugador tiene la criatura de cada uno de sus kanji | `showsKanji()` en `js/lex.js` | Sin la criatura, 犬 aparece como いぬ |
| **Las frases están en hiragana.** 0 de las 232 frases del currículo llevan kanji | `EXTRA` en `js/curriculum.js` | Se lee hiragana en todas las etapas |
| **Casi todo es elegir 1 de 4 en español**, con distractores al azar de cualquier tema | `wordExercise()` en `js/wordgames.js` | Se responde por descarte |
| **Armar frases con la traducción a la vista** y solo 2 fichas de más | `phraseExercise()` en `js/round.js` | Sale por lógica, sin entender el japonés |
| **Aprobar es fácil.** Cuenta el primer intento (80 %), pero con distractores al azar casi nadie falla | `endRound()`, `runRound()` | Toda ronda cuenta |
| **5 rondas de 12 ejercicios por sección** (60 en total) | `ROUNDS`, `planRound()` | Una unidad de Duolingo tiene 15 a 25 lecciones de ~15 ejercicios (≈300) |

**La cuenta que lo resume:** Duolingo Japonés tiene unas 4800 lecciones y unas 6900 palabras. Kanjuu tiene hoy 270 rondas (54 × 5) y 295 palabras: menos del 5 % del volumen. Por eso las 4 etapas se sienten como la sección 1 de Duolingo.

## 2. Cómo lo hace Duolingo (lo que tomamos)

1. **Secciones → unidades → niveles → lecciones.** En japonés, la sección 1 (Intro) tiene 10 unidades; la 2 (A1) tiene 35; la 3 (A1) sigue; la 4 es A2. Cada unidad es una situación («Pedir comida», «Describir a tu familia», «Moverte en la estación»).
2. **Mucha repetición del mismo material** en lecciones que suben de dificultad: primero reconocer, al final producir sin ayuda.
3. **Ejercicios variados:** traducir con banco de palabras en las dos direcciones, emparejar pares, escuchar y armar lo que oíste, completar el hueco, elegir la imagen, escribir.
4. **Kanji dentro de palabras.** Un kanji se presenta cuando aparece en una palabra nueva, primero emparejándolo con su lectura en kana, y desde ahí se escribe con kanji. Pasa a un apartado de práctica de kanji.
5. **Guía de la unidad (*guidebook*):** frases clave y una explicación corta de gramática. Es opcional y se abre desde la unidad.
6. **«Saltar aquí»:** una prueba corta y exigente para saltar a una unidad o a la siguiente sección. Si no se aprueba, se sigue donde se estaba, sin perder nada.
7. **Repaso personalizado** con lo que más cuesta.

## 2b. Lo que nos diferencia: los KANJŪ y sus kanji

Duolingo enseña kanji de costado: aparecen dentro de palabras y casi no se explican. En Kanjū **el kanji es el protagonista** y cada uno es una criatura. Para eso se combinan dos modelos con evidencia:

| Pista | Modelo | Qué se toma |
|---|---|---|
| Idioma (palabras, gramática, frases) | Duolingo: unidades por situación, repetición con dificultad creciente, producción al final, guía, saltar con prueba | §3 a §8 |
| Kanji | Componentes → kanji → vocabulario, con repetición espaciada (el orden de WaniKani y del método de Heisig; el de *Kanji Look and Learn* para la imagen mnemotécnica) | Lo que ya son las fusiones del juego: raíz → con componente → combinación, verificadas con KanjiVG (`docs/NIVELES.md`) |

**Cómo se ve en una unidad:**
1. **Cada unidad tiene su elenco:** los 3 a 6 kanji nuevos de la unidad son KANJŪ. La guía de la unidad la presentan ellos, y la criatura de premio es uno de ellos.
2. **Antes de leer un kanji en una palabra, su KANJŪ se presenta:** su dibujo (que es mnemotécnico: 木→林→森), su significado, su lectura y, si es una fusión, sus componentes («人 + 木 = 休: una persona descansando junto a un árbol»). Después llega la palabra (休みます) y después la frase.
3. **Los componentes se enseñan antes que el kanji compuesto.** El orden de los kanji de cada unidad respeta las recetas: no se presenta 休 antes que 人 y 木.
4. **El kanji vuelve en forma de criatura cuando fallas:** la ayuda de un error de kanji muestra al KANJŪ y su pista visual, no solo el texto.
5. **El kanji tiene su propia escalera de dominio** (`S.srs`, ya existe): reconocer el significado → leerlo → reconocerlo en una palabra nueva → elegirlo entre kanji parecidos → escribirlo con trazos. Esa escalera es la que sube el nivel de la criatura cuando entrenas con ella.
6. **Lo aprendido sigue en el juego:** los kanji de la unidad aparecen en los viajes, el diario, la Arena y el laboratorio. La fusión del laboratorio es repaso de componentes.

Así el jugador sale de cada unidad sabiendo decir algo (Duolingo) **y** sabiendo leer y reconocer los kanji de esa unidad por dentro (Kanjū).

## 3. La nueva estructura en Kanjuu

Se mantienen los nombres del juego: **etapa** (lo que en Duolingo es una sección) → **unidad** (lo que hoy llamamos sección, por ejemplo 1.3) → **nivel** → **ronda**.

| Etapa | Equivale a | Unidades | Palabras acumuladas | Kanji acumulados |
|---|---|---|---|---|
| 0 · Sonidos y kana | Sección 1 (kana) | 8 (las de hoy) | ~60 | 0 a 3 |
| 1 · Primeros pasos | Sección 1 (Intro) | 10 | ~250 | ~40 |
| 2 · Vida diaria | Sección 2 (A1) · **N5 completo** | 25 a 30 | ~800 | ~110 |
| 3 · Ampliar el mundo | Sección 3 (A1+) | 25 a 30 | ~1200 | ~200 |
| 4 · Conversación cotidiana | Sección 4 (A2) · **N4 completo** | 25 a 30 | ~1500 | ~300 |

Las unidades actuales se conservan como esqueleto y se reparten: las etapas 1 a 4 de hoy cubren, en contenido real, lo que debería ser la etapa 1 y el principio de la 2.

**Dentro de cada unidad:**

| Nivel | Qué se practica | Ayudas |
|---|---|---|
| 1 | Presentación de los KANJŪ de la unidad (dibujo, componentes, significado, lectura) y palabras nuevas: escuchar, emparejar, kanji ↔ lectura | Furigana y romaji |
| 2 | Las mismas palabras en frases cortas; traducir japonés → español con banco de palabras | Furigana |
| 3 | Gramática de la unidad; traducir español → japonés con banco | Furigana que se apaga por kanji |
| 4 | Escuchar y armar lo que oíste; completar el hueco; la situación con diálogo | Sin traducción a la vista |
| 5 | Producción: frases enteras sin ayudas, mezcla con unidades anteriores | Nada |

- Cada nivel tiene **3 rondas de 15 ejercicios** (propuesta): 15 rondas por unidad, unos 225 ejercicios. Una ronda sigue durando de 3 a 5 minutos.
- **El kanji de tinta se pinta por nivel:** 5 niveles, 5 partes del dibujo, igual que hoy con las rondas. La recompensa no cambia.
- La ronda se sigue jugando con la criatura de la ficha; sus 2 ejercicios de kanji siguen.

## 4. Ejercicios

| Tipo | Cómo es | Nuevo |
|---|---|---|
| Emparejar pares | 5 palabras con 5 significados, o 5 kanji con 5 lecturas | Sí |
| Japonés → español | Frase en japonés real; se arma la traducción con un banco de palabras en español | Sí |
| Español → japonés | Se arma la frase con fichas japonesas, con 3 a 5 fichas de más **plausibles** (partículas y palabras de la misma unidad) | Mejora |
| Escuchar y armar | Se oye la frase sin verla y se arma | Sí |
| Completar el hueco | Falta una partícula o una forma del verbo | Sí |
| Escribir la lectura | Se escribe en kana con un teclado de fichas kana (sin depender del teclado japonés del teléfono) | Sí |
| Kanji parecido | Elegir entre 人 / 入 / 大, o 土 / 士 | Sí |
| Armar el kanji | Elegir sus componentes (como una fusión del laboratorio) | Mejora (ya existe «ensamblar» en `GAMES`) |
| Kanji en palabra nueva | Leer una palabra no vista que usa kanji ya conocidos (日 + 本 → 日本) | Sí |
| Situación | Lo que ya existe (`talkExercise`) | No |
| Trazo | Lo que ya existe (`js/strokes.js`) | No |

**Distractores:** siempre del mismo tipo de palabra y de la misma unidad o de las anteriores (nunca «perro / martes / rojo / ventana» mezclados).

## 5. Kanji y escritura real

- Una palabra se escribe con kanji **desde la unidad que lo enseña**, tenga o no el jugador la criatura. Se cambia `showsKanji()` para que mire el kanji enseñado (`S.srs` o la unidad cursada), no `S.dex[c].owned`.
- Las frases se reescriben en **japonés real** (犬は猫より大きいです), con furigana que se apaga kanji por kanji según el dominio (ya está pensado así en `docs/CURRICULO.md` §2). La furigana se puede apagar siempre.
- Antes de usar un kanji por primera vez, se presenta con un ejercicio de emparejar kanji ↔ lectura.
- Tener la criatura sigue dando lo suyo (lecturas completas, evoluciones, Arena), pero no decide qué se puede leer.

## 6. Para que cueste de verdad

- **Cuenta el primer intento** (ya era así en el motor). El ejercicio fallado vuelve al final para aprender, sin sumar.
- Una ronda cuenta con el 80 % de aciertos al primer intento.
- Sin corazones ni energía: nunca se bloquea jugar (regla del juego). Si una ronda no cuenta, se repite cuando quieras.
- El nivel 5 de cada unidad mezcla un 30 % de las unidades anteriores.

## 7. Guía de la unidad

- Al entrar a una unidad aparece una **tarjeta «Guía»**: frases clave con audio, una explicación corta de la gramática (2 o 3 pantallas) y los kanji de la unidad con sus lecturas. La presenta tu KANJŪ.
- Opcional, como en Duolingo; se puede volver a abrir desde el cuaderno.
- Necesita propuesta visual aprobada antes de implementarse (regla 3).

## 8. Saltar

- **Saltar a una unidad:** en cualquier unidad de la etapa actual o de la siguiente, «Saltar aquí» abre una prueba de 15 ejercicios de producción sobre todo lo anterior. Se aprueba con hasta 3 errores.
- **Saltar la etapa:** al principio de cada etapa, una prueba de 20 ejercicios lleva al inicio de la siguiente (de 1.x a 2.1, de 2.x a 3.1).
- Si no se aprueba, se sigue donde se estaba, sin perder nada, y se puede reintentar.
- Las unidades saltadas no entregan su KANJŪ (ya decidido).

## 9. Partidas existentes

Guardado compatible: `S.cur` gana campos con `??=` (`level`, `rounds` por nivel). Una partida en la unidad X de hoy se ubica en la unidad equivalente del nuevo mapa, en el nivel 1. Lo ya pintado se conserva.

## 10. Plan de trabajo

| ID | Tarea | Tipo |
|---|---|---|
| P-01 | Kanji desde que se enseñan (`showsKanji`) y frases reescritas en japonés real | código + contenido |
| P-02 | Primer intento cuenta, distractores de la misma unidad, más fichas de más | código |
| P-03 | Propuesta visual: ejercicios nuevos, guía de la unidad, «Saltar aquí» | diseño (propuesta) |
| P-04 | Niveles dentro de la unidad (5 × 3 rondas) y tinta por nivel | código |
| P-05 | Ejercicios nuevos (pares, ja → es, escuchar y armar, hueco, teclado kana, kanji parecido) | código, después de P-03 |
| P-06 | Guía de la unidad y pruebas para saltar | código, después de P-03 |
| P-07 · P-08 · P-09 | Contenido: etapa 1 completa (~250 palabras), etapa 2 hasta el N5 (~800), etapas 3 y 4 hasta el N4 (~1500). Revisado por Claude con frases de manual | contenido |

P-01 y P-02 se notan enseguida y no necesitan diseño nuevo: se pueden hacer primero.

## Valores provisorios

Nicolás pidió el 14 de noviembre de 2026 «preparar todo» y avanzar. Para no frenar, se arranca con los valores propuestos en este documento: etapa → unidad → nivel → ronda; 3 rondas por nivel; saltar con hasta 3 errores; guía opcional; P-01 y P-02 primero. **Cada uno se puede cambiar** respondiendo en el pull request; están juntos en `js/curriculum.js` (`ROUNDS_PER_LEVEL`, `JUMP_ERRORS`) para que cambiarlos sea una línea.

## Necesita tu decisión

1. ¿Los nombres quedan **etapa → unidad → nivel → ronda**, o prefieres otros?
2. ¿**3 rondas por nivel** (15 por unidad) te parece bien, o prefieres menos rondas y más largas?
3. ¿Saltar con **hasta 3 errores** de margen, o más estricto?
4. ¿La guía de la unidad **opcional** (como Duolingo) u **obligatoria** la primera vez?
5. ¿Empezamos por **P-01 y P-02**, que no necesitan diseño, mientras se prepara la propuesta visual P-03?

---

## 11. Decisiones de Nicolás (15 de noviembre de 2026)

Respondidas en el chat sobre #47 (P-08a):

1. **Aumentar el contenido de la etapa 2:** sí. Se suman unidades nuevas hasta llegar a ~30 en la etapa 2 (§13), con el tope de 20 palabras por unidad.
2. **早 y 夕** (kanji del N4) se quedan, porque ordenan los componentes de 朝 y 夜.
3. **Pasado y negativo:** «Tenemos que enseñar pasado y negativo». Los adjetivos い y な en positivo, negativo, presente y pasado, y です / でした / じゃないです. Es la tarea P-10 (#50).
4. **«Planes para el finde»** queda así.
5. **Frases de viaje:** la cobertura mínima del 30 % se mide solo sobre las palabras que no tienen frase propia del currículo (EXTRA); la cobertura total del 70 % se mantiene. Está en `checkCurriculum()` desde P-08c (#56).

Además, pidió: «Es muy importante que el juego enseñe muchas más palabras, frases y cómo armar diálogos en general». Las secciones 1 y 2 de Duolingo le enseñaron lo básico, verbos, forma て, presente, pasado y futuro, y adjetivos な e い en todas sus formas. **Lo que no le enseñó Duolingo fue a leer de corrido.** Podía leer frases sueltas, pero no un texto real en japonés, por la cantidad de kanji y porque Duolingo repite siempre los mismos kanji. Eso es §12.

Referencia: el índice del curso de japonés de Duolingo (duolingodata.com, jafen1030), que Nicolás compartió.
- La sección 1 tiene 10 unidades y la sección 2 tiene 30 unidades del A1.
- La sección 2 trata situaciones como presentarse y presentar a otros, hábitos, comer, comprar ropa, rutina, detalles de viaje, fin de semana, clima, pastelería, direcciones, casa, familia, emergencias, lugares nuevos, una cita, planes de viaje, alrededores, horarios de trabajo, ir a una fiesta, eventos, vida universitaria, hábitos sanos, clases, hobbies, hotel y supermercado.
- La etapa 2 de Kanjū toma esa progresión de situaciones (no sus textos) y le suma los KANJŪ y la lectura.

## 12. Leer de corrido (lo que Duolingo no da)

Es el segundo diferenciador de Kanjū, junto con los KANJŪ: **salir de cada etapa leyendo un texto real**, no solo frases sueltas.

- **Una lectura por unidad.** Es un texto corto en japonés real, con kanji y **sin espacios entre palabras**, como se escribe de verdad. Las fichas de las rondas van separadas; la lectura no.
- **El largo crece con la etapa:**

  | Etapa | Largo de la lectura | Qué es |
  |---|---|---|
  | 1 | 2 a 4 líneas | Una nota o un mensaje |
  | 2 | 5 a 10 líneas | Un diario o un correo |
  | 3 | Un párrafo | Un aviso o un blog |
  | 4 | Una página corta | Un cuento o una noticia sencilla |
- **Usa todos los kanji ya enseñados, no solo los de la unidad.** Así se rompe la «burbuja» de los mismos kanji de siempre. La furigana aparece solo sobre los kanji que el jugador todavía no domina (`S.srs`) y se puede apagar.
- **Tocar una palabra** muestra su lectura y su significado. Se puede escuchar entera con el motor de voces del juego.
- **Al final, 2 o 3 preguntas de comprensión** en español.
- **Kanji en palabra nueva:** cada lectura trae 1 o 2 palabras no vistas que se pueden leer con kanji conocidos (日 + 本 → 日本), como en §4.
- **El KANJŪ lee contigo:** la lectura la presenta tu criatura, y los kanji de su familia se resaltan en el texto.
- **Base técnica:** ya existen `READINGS` (18 lecturas de 3 a 5 líneas en kana) en `js/lang.js`. Se amplían al formato de arriba.
- **Necesita propuesta visual aprobada** antes de implementarse (regla 3): es P-11.

## 13. Mapa de la etapa 2 (30 unidades) — propuesta para aprobar

Las unidades 2.1 a 2.12 ya existen (P-08a #47, P-08b #48 o #49). Se suman 2.13 a 2.30, después de las actuales: los ids viejos no cambian y el guardado sigue compatible. Cada unidad nueva trae 18 a 20 palabras y 12 a 15 frases. Con eso, la etapa 2 cierra en **~780 a 800 palabras** y **~130 kanji acumulados**, todo el N5 más algunos del N4.

| Unidad | Situación (Duolingo sección 2) | Gramática nueva | Kanji nuevos | KANJŪ premio (candidato) |
|---|---|---|---|---|
| 2.13 | Presentar a otros | 〜と (y), 〜と いっしょに | 友 男 名 会 | 友 |
| 2.14 | Mis costumbres | Frecuencia con ます / ません (よく, あまり, ぜんぜん) | 午 分 | 午 |
| 2.15 | Lo que comemos | Pasado de adjetivos (おいしかった) con P-10 | 飯 茶 | 飯 |
| 2.16 | En la pastelería | Contadores つ · こ · まい · ほん; 〜を 〜つ ください | 枚 売 | 売 |
| 2.17 | Detalles del viaje | 〜から 〜まで, どのくらい かかりますか | 東 西 南 北 | 東 |
| 2.18 | Lugares nuevos | どんな, ちかい / とおい, 〜に 〜が あります | 町 村 | 町 |
| 2.19 | Una cita | 〜たい です, 〜に いきます (para qué) | 待 持 | 待 |
| 2.20 | Planes de viaje | 〜たり 〜たり します, 〜ましょう | 歩 方 | 歩 |
| 2.21 | Mi barrio | Lugares y tiendas: 〜の となり / まえ | 店 屋 | 店 |
| 2.22 | Horarios de trabajo | 〜時から 〜時まで, 〜ごろ, 〜曜日 | 働 | 働 |
| 2.23 | Rumbo a una fiesta | 〜て、〜て (secuencia), 〜て から | 番 | 番 |
| 2.24 | Eventos | Fechas: 〜月 〜日, 〜は いつ ですか | 回 | 回 |
| 2.25 | Vida en la universidad | Forma ない: 〜ないで ください | 英 字 | 英 |
| 2.26 | Hábitos sanos | 〜た ほうが いい, 〜ない ほうが いい | 医 | 医 |
| 2.27 | Mis clases | 〜まえに, 〜た あとで | 室 | 室 |
| 2.28 | Comprar ropa (2) | 〜が ほしい, 〜は どう ですか | 服 | 服 |
| 2.29 | Reservar un hotel | Días y noches, 〜を おねがいします, 〜で (precio) | 洗 (屋 ya se enseña en 2.21) | 屋 (palabra 屋上) |
| 2.30 | En el supermercado | 〜は どこ ですか, 〜と 〜と, repaso de la etapa | 王 里 理 (componentes antes) | 理 (palabra 無理) |

Notas del mapa:
- **Componentes antes que compuestos:** si un kanji de la tabla necesita un componente no enseñado, la tarea de contenido lo adelanta o cambia el kanji, y lo anota en su PR.
- **Premios:** todos están en el roster (`KANJI`) y hoy no son premio de ninguna unidad. Los que no tengan arte final se dibujan como borrador simple (igual que 旅, 風, 晴 y 客). Elegir el premio es tu decisión: la columna es solo una propuesta.
- **Cada unidad nueva trae** su intro, su «Puedo…», su diálogo (`TALKS`) y sus 3 rivales, igual que las de hoy. Desde que se apruebe P-11, también su lectura.

## 14. Plan de trabajo actualizado

| ID | Tarea | Tipo |
|---|---|---|
| P-08a · P-08b | Etapa 2, unidades 2.1 a 2.12 a 18–20 palabras | contenido (#47; #48 o #49) |
| P-08c · P-08d · P-08e | Unidades 2.13 a 2.18, 2.19 a 2.24 y 2.25 a 2.30 del mapa §13 (6 por PR) | contenido, después de aprobar §13 |
| P-10 | Pasado y negativo de los adjetivos い y な, y de です | código + contenido (#50) |
| P-11 | Propuesta visual de «Leer de corrido» (§12) | diseño (propuesta) |
| P-12 | Implementación de la lectura por unidad | código, después de P-11 |
| P-13 | Lecturas de las etapas 1 y 2 (una por unidad) | contenido, después de P-12 |
| P-14 | Forma ない y forma た (corta) en el motor, para 2.25 y la etapa 3 | código |

## Necesita tu decisión (§13)

1. ¿Apruebas el **mapa de 2.13 a 2.30** (situaciones, gramática y kanji)? ¿Cambiarías algún **KANJŪ premio**?
2. ¿Te parece bien **«Leer de corrido»** como está descrito en §12, para preparar la propuesta visual P-11?
