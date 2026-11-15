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

## Decisiones de Nicolás (15 de noviembre de 2026)

Nicolás aprobó por chat todo lo propuesto hasta P-08b y pidió mergear los PR #41 a #48. Queda decidido:

1. **Valores provisorios aprobados:** etapa → unidad → nivel → ronda; 3 rondas por nivel (15 por unidad); saltar con hasta 3 errores; guía de la unidad opcional.
2. **Los límites de contenido se pueden superar** cuando sea razonable y siga métodos de enseñanza comprobados (Duolingo y manuales como Genki, Marugoto e Irodori). Esto vale para el tope de palabras por unidad y para el máximo de frases de viaje por situación. Para llegar a ~800 palabras (etapa 2) y ~1500 (etapas 3 y 4) se puede subir el tope por unidad o sumar unidades nuevas, con el mismo criterio.
3. **Cobertura de frases de viaje (mínimo 30 %):** se mide solo sobre las palabras que no tienen frase propia en el currículo (lo que propuso el revisor en #46). La cobertura total del 70 % (frases de viaje, frases del currículo y diálogos) se mantiene.
4. **Forma de diccionario y 〜のが 好き:** van en la unidad 2.12 con 1 o 2 frases de manual (p. ej. 「うた を うたう の が すき です」).
5. **Tú y usted:** todo el texto del juego en español va con tú, también las frases viejas de 2.8 y el mesero de 2.9 («¿Qué vas a tomar?»), como pide la regla de idioma de `CLAUDE.md`.
