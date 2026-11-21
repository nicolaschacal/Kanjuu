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
| P-09a | Mapa de las etapas 3 y 4 hasta el N4 (§15) | documentación (este PR) |
| P-09b · P-09c | Etapa 3, unidades 3.1 a 3.6 y 3.7 a 3.12: de 8 a 20 palabras cada una (6 por PR) | contenido, después de aprobar §15 |
| P-09d | Etapa 3, unidades nuevas 3.13 a 3.18 | contenido, después de P-14 |
| P-09e · P-09f | Etapa 4, unidades 4.1 a 4.6 y 4.7 a 4.12: de 8 a 20 palabras cada una (6 por PR) | contenido, después de aprobar §15 |
| P-09g | Etapa 4, unidades nuevas 4.13 a 4.18 | contenido, después de P-09d |

Cuántas palabras hacen falta (P-09): hoy cada unidad de las etapas 3 y 4 trae solo 8 palabras núcleo y, entre las 24, apenas 66 palabras nuevas. Para llegar a ~1500 al final de la etapa 4 hacen falta **19 a 20 palabras nuevas por unidad** (el tope de 20 sigue vigente, §11) en las 36 unidades: 36 × 19,7 ≈ 710 sobre las ~790 con que cierra la etapa 2 (con 2.25 a 2.27). Cada unidad lleva además 12 a 15 frases, su diálogo (`TALKS`), su guía (`GUIDES`) y 3 rivales. El detalle por corte está en §15.

## Necesita tu decisión (§13)

1. ¿Apruebas el **mapa de 2.13 a 2.30** (situaciones, gramática y kanji)? ¿Cambiarías algún **KANJŪ premio**?
2. ¿Te parece bien **«Leer de corrido»** como está descrito en §12, para preparar la propuesta visual P-11?

## 15. Mapa de las etapas 3 y 4 (hasta el N4) — propuesta para aprobar

Las unidades 3.1 a 3.12 y 4.1 a 4.12 ya existen y **conservan su id**. Se suman 12 unidades nuevas después de cada bloque: **3.13 a 3.18** (etapa 3) y **4.13 a 4.18** (etapa 4). Cada etapa queda en 18 unidades. Con eso, el juego cierra la etapa 4 en **~1500 palabras** y **~296 kanji acumulados**, el N5 completo y la gramática del N4 según el orden de Genki II, Marugoto A2 e Irodori.

Cifras (palabras sin contar repasos; kanji acumulados incluyen 英 字 医 室 de 2.25 a 2.27):

| Corte | Palabras por unidad | Palabras acumuladas | Kanji acumulados |
|---|---|---|---|
| Fin de 2.30 (con 2.25 a 2.27, ~21 palabras cada una) | 18 a 21 | ~790 | 152 |
| Fin de 3.12 (12 unidades existentes ampliadas) | 19 a 20 | ~1020 a 1030 | 192 |
| Fin de 3.18 (6 unidades nuevas) | 20 | ~1140 a 1150 | 233 |
| Fin de 4.12 (12 unidades existentes ampliadas) | 19 a 20 | ~1370 a 1390 | 261 |
| Fin de 4.18 (6 unidades nuevas) | 20 | **~1490 a 1510** | **296** |

### Etapa 3 · Ampliar el mundo

«Hoy» es lo que la unidad ya enseña en `js/curriculum.js`; «Suma» es lo que se agrega al ampliarla; «Cambia» es lo único que se reordena (ver «Cambios declarados»). Un asterisco (*) marca un kanji que hoy se enseña sin estar en el roster (sin criatura). «(nueva)» marca las unidades nuevas.

| Unidad | Situación | Gramática N4 | Kanji nuevos | KANJŪ premio |
|---|---|---|---|---|
| 3.1 | Comparar | Hoy: 〜より, 〜の ほうが, いちばん · Suma: 〜ほど 〜ない, 〜と おなじ | 多* 長 | 長 |
| 3.2 | El café de animales | Hoy: います con animales · Suma: contadores 〜ひき · 〜わ · 〜とう | 犬 猫 鳥 馬 牛 | 鳥 |
| 3.3 | Me siento mal | Cambia: 〜が します / 〜が あります (síntomas) y 〜と いい です (consejo) en lugar de 〜た ほうが いい (2.26) | 体 頭* 足 病 薬 | 体 |
| 3.4 | ¿Alguna vez…? | Hoy: 〜た こと が あります / ありません · Suma: 〜は はじめて です | 旅 外 | 旅 |
| 3.5 | Un día en la naturaleza | Cambia: 〜や 〜など y 〜が みえます / きこえます en lugar de 〜たり 〜たり (2.20) | 山 川 海 空 | 海 |
| 3.6 | Charla casual | Hoy: 〜と おもいます, 〜て います (しって います) · Suma: forma corta + と おもいます, 〜と いいました | 思 知 考* | 思 |
| 3.7 | Lo que quiero | Cambia: 〜がって います (tercera persona) y 〜て ほしい en lugar de 〜たい y ほしい (2.19, 2.28) | 心 物 欲* | sin premio hoy (propuesta: 物) |
| 3.8 | Viajar en tren | Cambia: 〜を おります, 〜に のりかえます y 〜ごとに en lugar de 〜から 〜まで (2.17) | 電 乗* 地 鉄* | 電 |
| 3.9 | Escuela y trabajo | Hoy: 〜ながら, 〜て から (repaso de 2.23) · Suma: 〜し (razones en lista) | 学 校 仕 事 | 学 |
| 3.10 | Dar y recibir | Hoy: あげます / もらいます / くれます · Suma: 〜て あげます / 〜て くれます / 〜て もらいます | 送* 返* 紙 | 紙 |
| 3.11 | Cuando y si… | Hoy: 〜とき, 〜たら, 〜から · Suma: sin gramática nueva; cierra con repaso del bloque | 間 由* | sin premio hoy (propuesta: 間) |
| 3.12 | Fiestas de Japón | Hoy: sin gramática nueva · Suma: 〜と いう (nombrar: 「たなばた」と いう まつり) | 花 祭* 正 | 花 |
| 3.13 (nueva) | Ayudar en una mudanza | 〜て くれませんか, 〜て もらえませんか (pedir), 〜て あげましょうか (ofrecer) | 重 軍 運 連 床 居 戸 | 運 (はこびます) |
| 3.14 (nueva) | Reglas de la escuela y del trabajo | 〜なければ なりません, 〜ないと いけません, 〜なくても いい | 一 同 用 文 作 工 | 作 (つくります) |
| 3.15 (nueva) | En el restaurante | 〜すぎる, 〜だけ, 〜しか 〜ない, 〜ずつ, 〜やすい / 〜にくい | 皿 貝 未 味 品 豆 玉 | 味 (あじ) |
| 3.16 (nueva) | Una ciudad nueva | 〜く / 〜に なります, 〜ように なりました, 〜ことに しました / 〜ことに なりました | 主 住 斤 近 所 市 央 | 住 (すみます) |
| 3.17 (nueva) | Un taller de manualidades | 〜て みます / 〜て みたい, 〜に します (elegir), 〜は どう でしたか | 糸 絵 衣 毛 皮 刀 切 | 絵 (え) |
| 3.18 (nueva) | Campamento en el bosque | 〜て あります (algo ya preparado), 〜が あいて います / あけて あります (transitivo e intransitivo) | 林 森 星 焚 杉 暗 羽 | 星 (ほし) |

### Etapa 4 · Conversación cotidiana

| Unidad | Situación | Gramática N4 | Kanji nuevos | KANJŪ premio |
|---|---|---|---|---|
| 4.1 | Lo que puedo hacer | Hoy: forma potencial (できます, 〜れます) · Suma: 〜こと が できます, 〜こと も できます | ninguno | 力 |
| 4.2 | Mis planes | Hoy: 〜(よ)う と おもいます, 〜つもり · Suma: 〜(よ)う か (proponer) | 予* 定* 約* | sin kanji del roster |
| 4.3 | Parece que… | Hoy: 〜そう (aspecto), 〜みたい · Suma: 〜なさそう, 〜そうな / 〜そうに | 風 光* 色 | 風 |
| 4.4 | Se me rompió | Hoy: 〜て しまう, 〜て おく · Suma: forma coloquial 〜ちゃう / 〜とく | 壊* 落* 忘* | sin kanji del roster |
| 4.5 | Si hace sol, vamos | Hoy: 〜ば, 〜と (condición) · Suma: 〜ば いい, 〜ば 〜ほど | 晴 暑* 寒* | 晴 |
| 4.6 | Hablar con respeto | Hoy: frases de tienda · Suma: かしこまりました, 〜でございます, お〜ください (los verbos de respeto pasan a 4.16) | 社 員 客 | 客 |
| 4.7 | Me pasó algo | Hoy: pasiva de molestia · Suma: pasiva neutra (〜で つくられて います, 〜が ひらかれます) | 取* | sin kanji del roster |
| 4.8 | Hacer que alguien haga | Hoy: 〜(さ)せる · Suma: 〜させて ください, 〜させて いただけませんか | 教 習* | 教 |
| 4.9 | Para que… | Hoy: 〜ように, 〜ために · Suma: 〜ように して います, 〜ように いいます | 的* 願* | sin premio hoy (propuesta: 目) |
| 4.10 | Contar una historia | Cambia: conectores (それから, そして, しかし, だから, すると) y 〜はじめる / 〜おわる / 〜つづける en lugar de 〜まえに / 〜あとで (2.27) | 語 始 終 | 始 |
| 4.11 | Quejarse y disculparse | Hoy: 〜ので, 〜のに · Suma: 〜けど, 〜ば よかった | 遅* 困* | sin kanji del roster |
| 4.12 | Gran viaje por Japón | Hoy: 〜でしょう · Suma: 〜に ついて y repaso del viaje | 京 都 県 | 京 |
| 4.13 (nueva) | Esperando a un amigo | 〜かも しれません, 〜はず です / 〜はず が ありません, まだ 〜て いません | 彼 相 想 意 交 走 酒 | 想 (よそう) |
| 4.14 (nueva) | Lo que dicen en la oficina | 〜そう です (lo oí), 〜よう です, 〜らしい, 〜に よると | 化 全 内 案 占 | 化 (ぶんか) |
| 4.15 (nueva) | En el hospital | 〜なら, 〜たら どうですか, 〜ても (aunque), 〜なくて (causa) | 元 完 院 疲 者 舌 | 院 (びょういん) |
| 4.16 (nueva) | Entrevista para un trabajo | Respeto 2: いらっしゃる, めしあがる, おっしゃる; humilde: いたします, まいります, もうします, うかがいます; お〜に なります, お〜します, 〜て いただけませんか | 自 親 孝 夫 姓 億 | 親 (おや) |
| 4.17 (nueva) | En la biblioteca | 〜んです (explicar), 〜か どうか / 〜か 〜か (preguntas dentro de la frase), 〜の / 〜こと (nominalizar) | 艸 漢 若 厚 | 漢 (かんじ) |
| 4.18 (nueva) | Una llamada y la despedida | 〜ところ です (a punto, en medio, recién), 〜た ばかり です, 〜までに, 〜あいだに, 〜と つたえて ください; repaso del N4 | 矢 短 登 旬 首 旦 池 | 登 (のぼります) |

### Notas del mapa

- **Gramática del N4 cubierta, sin repetir:** potencial 4.1; volitiva 4.2; 〜そう (aspecto) 4.3 y 〜そう (oído) 4.14; 〜てしまう y 〜ておく 4.4; 〜と y 〜ば 4.5; 〜たら 3.11; 〜なら 4.15; pasiva 4.7; causativa 4.8; 〜てみる 3.17; 〜てあげる / くれる / もらう 3.10 y 3.13; keigo básico 4.6 y avanzado 4.16; obligación 3.14; 〜すぎる 3.15; cambios 3.16; 〜かもしれない 4.13; 〜んです 4.17; 〜ところです 4.18. Lo que ya enseñan 2.1 a 2.30 (〜て もいい, 〜ては いけません, 〜ないで ください, 〜た ほうが いい, 〜たり, 〜たい, ほしい, 〜まえに, 〜あとで, 〜て から, 〜から 〜まで) no se vuelve a enseñar: solo se repasa.
- **Cambios declarados en unidades existentes (conservan id, título, kanji y premio):** 3.3, 3.5, 3.7, 3.8 y 4.10 hoy repiten gramática que 2.x ya enseña (2.26, 2.20, 2.19 y 2.28, 2.17, 2.27). Su gramática pasa a la de la tabla. Es lo único que se reordena; las frases actuales que repiten gramática vieja se reemplazan por frases nuevas con el mismo vocabulario.
- **Sin repetir kanji:** los 76 kanji nuevos (41 en la etapa 3 y 35 en la etapa 4) están en el roster (`KANJI`), no se enseñan antes en `js/curriculum.js` ni en §13 y no se repiten entre unidades. Cada compuesto llega después de sus componentes según `recipes` (o en la misma unidad, listado después): 斤 → 近 · 所; 戸 → 所; 軍 → 運; 車 → 連 (ya enseñado); 糸 → 絵; 刀 → 切; 主 → 住; 豆 → 短 · 登; 矢 → 短; 皮 → 彼 · 疲; 音 y 心 → 意 → 億; 相 → 想; 一 → 同 · 首 · 旦; 元 → 完 → 院; 自 → 首; 夫 → 漢; 艸 → 漢 · 若; 未 → 味. Las piezas (部品) no cuentan como kanji.
- **Kanji del roster que quedan fuera del curso (33):** 示 寸 炎 晶 杏 朋 加 享 圧 句 盟 枯 視 故 症 延 喿 禁 薪 操 燥 繰 澡 襟 憶 藻 士 欠 周 可 獣 至 尾 (no tienen una palabra cotidiana del N5 o N4 que los use; siguen siendo criaturas de fusión). De los 296 kanji acumulados, 31 (los que llevan *) no están en el roster y no tienen criatura; es la situación de hoy y no se toca aquí.
- **Kanji sin palabra propia:** 斤 (一斤 いっきん, el pan de molde), 軍 (軍手 ぐんて), 艸 (solo componente) y 士 / 周 (fuera) son los casos dudosos; ver «Necesita tu decisión (§15)».
- **Premios:** los 12 premios nuevos están en el roster, pertenecen a los kanji de su propia unidad, no coinciden con ningún premio de §13 ni de las etapas 0 a 4 (茶 名 一 本 口 時 円 食 車 好 弟 中 朝 今 買 新 明 雨 家 道 魚 休 話 音 友 午 飯 売 東 町 待 歩 店 働 番 回 服 屋 理 長 鳥 体 旅 海 思 電 学 紙 花 力 風 晴 客 教 始 京, más 英 医 室 de 2.25 a 2.27) y no se repiten entre sí. Los que no tengan arte final se dibujan como borrador simple. Elegirlos es decisión tuya: la columna es una propuesta. Las tres propuestas «sin premio hoy» (物, 間, 目) también cumplen esas reglas; 4.2, 4.4, 4.7 y 4.11 siguen sin premio porque sus kanji no están en el roster.
- **Situaciones variadas de la vida real:** mudanza, escuela y trabajo, restaurante, ciudad nueva, taller, campamento, cita, oficina, hospital, entrevista, biblioteca y llamada. Ninguna repite una situación de 2.1 a 2.30 con el mismo vocabulario (el hospital de 4.15 va por el lado de la consulta y las recetas; 3.3 es el síntoma).
- **Cada unidad nueva trae** intro, «Puedo…», diálogo (`TALKS`), guía (`GUIDES`), 3 rivales, 19 a 20 palabras y 12 a 15 frases. Las lecturas (§12) de la etapa 3 son un párrafo; las de la etapa 4, una página corta.
- **Motor:** las unidades nuevas dependen de P-14 (forma ない y た) y pueden pedir formas nuevas en `verbForms` (〜なければ, 〜すぎ, 〜ば, raíz de 〜ます para 〜ながら y 〜やすい). Si falta alguna, el integrador abre una tarea de código antes de P-09d y P-09g.

## Necesita tu decisión (§15)

1. ¿Apruebas el **mapa de 3.13 a 3.18 y de 4.13 a 4.18** (situaciones, gramática y kanji) y la meta de **~1500 palabras y ~296 kanji**? ¿Cambiarías algún **KANJŪ premio**?
2. ¿Aceptas los **cambios declarados** en 3.3, 3.5, 3.7, 3.8 y 4.10 (cambiar gramática repetida por gramática nueva)?
3. ¿Quieres **premio** en 3.7 (物), 3.11 (間) y 4.9 (目), que hoy no lo tienen?
4. Kanji sin vocabulario cotidiano: ¿enseñamos **斤 (一斤), 軍 (軍手) y 艸 (componente)** para poder llegar a 近, 運 y 漢, o preferimos dejarlos fuera con esos tres?
