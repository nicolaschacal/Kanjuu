# KANJŪ — Roadmap hacia App Store y Google Play

Estado: ✅ hecho · 🔜 siguiente · ⬜ pendiente. Revisado el 9 de noviembre de 2026 contra el código.

## Orden de trabajo

| # | Fase | Por qué en este orden |
|---|---|---|
| 0 | **Idiomas: base español + inglés** | Hay que montar la infraestructura antes de seguir sumando textos; cada pantalla nueva nace traducida |
| 1 | **Academia** | Es la mitad del juego que menos engancha hoy; sin aprendizaje que retenga no hay producto |
| 2 | **Diseño de criaturas** (con aprobación previa) | El apego a las criaturas es el motor de la retención y de la monetización cosmética |
| 3 | **Economía instrumentada** | Antes de tocar retención o cobrar hay que medir fuentes y sumideros y validar en servidor |
| 4 | **Retención** | Recompensa de regreso, temporadas gratuitas, notificaciones, social liviano |
| 5 | **Empaquetado nativo y tiendas** | Capacitor, requisitos legales, TestFlight / prueba interna |
| 6 | **Monetización** | KANJŪ Plus con tutor IA; recién con retención D7 validada y anti-trampas; se lanza con el soft launch |

Santuario (con su modo editor) y Arenas están **cerrados**: diseño aprobado e implementado. Solo reciben ajustes.

El trabajo se organiza en sprints semanales que ejecuta el equipo de agentes sin supervisión; cada cambio llega como pull request para aprobar. Ver **docs/SPRINTS.md** y **docs/BACKLOG.md**.

---

## 1. Núcleo jugable
- ✅ Santuario vivo, criaturas que deambulan dentro de sus casillas, interacción directa
- ✅ Evolución ramificada por EXP, fusión con recetas verificadas, renacimiento con legado
- ✅ Expediciones asíncronas (9 regiones, desbloqueo por colección, huellas y viajes diarios por región)
- ✅ Grilla de tiles: criaturas (1×1, 2×1, 2×2) y objetos ocupan casillas
- ✅ **Modo editor (Construir):** suelo con 7 tipos de casilla (pasto, musgo, tierra, arena, losa, nieve, agua), relieve 0–3 con rampas, cascadas; la grilla solo se ve en este modo
- ✅ Almacén por categorías: KANJŪ, Objetos, Evolución (piezas) y Consumibles
- ✅ Producción idle de tinta por criatura (nivel, maestría, ánimo, estrellas, auras)
- ✅ Objetos con aura y mejora hasta Nv5, objetos globales, Armonía 和 por decoración
- ✅ Altar de invocación con tinta o boletos, piedad transparente, variantes doradas, despertar con duplicados
- ✅ Rango de guardián, calendario de 7 días sin reinicios
- ✅ **Arena 闘 3v3:** desafíos de kanji, tipos 五行, copas, camino de copas, cofres que se abren estudiando, reloj por turno y bonus 必殺
- ✅ **6 arenas de papel** con mismo tamaño (5×10) y misma cámara: Hanami en Kioto, bambú de Arashiyama, Fushimi Inari, Sapporo nevado, castillo de Osaka, monte Fuji
- ✅ Familias 族 con premio al completarlas
- 🔜 Al dominar una arena se obtienen sus objetos para el santuario
- 🔜 Rasgos de personalidad (tímido, juguetón…) que cambian animaciones y preferencias
- 🔜 Hábitats por familia con bonificación al convivir criaturas afines
- ⬜ Eventos de santuario: visitantes raros que aparecen si cumplís condiciones

## 2. Academia y aprendizaje — FASE 1
Hecho:
- ✅ Repetición espaciada (Leitner) en el Dojo con maestría por kanji
- ✅ Recuperación activa, intercalado, mnemotecnias, codificación dual, feedback con historia al fallar
- ✅ Trazo con orden real (KanjiVG), Lecturas, Palabra, Ensamblar, Escuchar
- ✅ Furigana desactivable, romaji en lecturas
- ✅ Academia con 8 unidades: Bienvenida, Piezas 部品, Hiragana I y II, Katakana, Primeras frases, Verbos y tiempos, Lecturas
- ✅ 9 tipos de ejercicio, coronas, meta diaria de XP, premio por unidad, repaso espaciado de kana y vocabulario
- ✅ Lecturas graduadas con furigana adaptativa; cuentos con IA usando tus criaturas; "¿Por qué?" explica cada error

Siguiente, en orden:
1. 🔜 **Analítica de la Academia:** abandono por lección, tasa de error por tipo de ejercicio, tiempo por pantalla
2. 🔜 **Test de ubicación** para saltar unidades (kana ya conocido, etc.)
3. 🔜 **Mapa de unidades** con camino y una criatura guía que avanza con el jugador
4. 🔜 **Cada unidad termina desbloqueando un kanji o una pieza del juego** (la Academia alimenta el santuario)
5. 🔜 **Ejercicios no basados en elegir:** escribir kana con el dedo, armar frases tocando tarjetas, dictado corto, completar con teclado kana
6. 🔜 **Más unidades:** て-form, querer/poder, contadores, números, hora y fechas
7. 🔜 Conversaciones guiadas con las criaturas (frases en contexto, con IA propia)
8. 🔜 Mnemotecnias propias del jugador
9. ⬜ Torres JLPT N5 → N1 desbloqueables
10. ⬜ Curva del olvido personal (estadísticas de retención para el jugador)

## 2b. Idiomas — español e inglés desde el lanzamiento
El juego sale en **español e inglés**; portugués queda para después del lanzamiento. El idioma elegido es el de la interfaz y también el idioma desde el que se aprende japonés (significados, mnemotecnias, explicaciones y cursos).

1. 🔜 **Infraestructura:** módulo `js/i18n.js` con `t('clave', vars)`, diccionarios `locales/es.json` y `locales/en.json`, plurales con `Intl.PluralRules`, números y fechas con `Intl`
2. 🔜 **Idioma automático** según el dispositivo, con selector en Configuración; se guarda en la cuenta
3. 🔜 **Interfaz traducida:** HUD, menús, hojas, Tienda, Arena, tutorial, ayudas y errores
4. 🔜 **Datos de kanji en dos idiomas:** significado, mnemotecnia, historia al fallar y descripción de piezas (`meaning: { es, en }`)
5. 🔜 **Academia en inglés:** consignas, traducciones de frases, explicaciones de gramática; los ejercicios de traducir y armar oraciones usan el idioma del jugador
6. 🔜 **IA en el idioma del jugador:** cuentos, "¿Por qué?" y conversaciones reciben el idioma como parámetro
7. 🔜 **Control de calidad:** script que detecta claves faltantes entre `es` y `en` y textos escritos directamente en el código; corre antes de cada pull request
8. ⬜ Ficha de las tiendas, capturas, política de privacidad y términos en ambos idiomas
9. ⬜ Revisión del inglés por un hablante nativo antes del lanzamiento
10. ⬜ Portugués (Brasil) después del lanzamiento

**Decidido (9 de noviembre de 2026):** el español base es **neutro, con tú** (toca, responde, elige). El voseo actual pasa a ser la variante **"Español (Río de la Plata)"** (`es-419-rp`), seleccionable en Configuración y elegida automáticamente en Uruguay y Argentina. Inglés base: `en`.

## 3. Diseño de criaturas — FASE 2 (aprobar antes de producir)
- 🔜 **Propuesta de sistema visual:** silueta por tipo 五行 (木 vertical y orgánica, 火 puntiaguda, 土 baja y pesada, 金 angular, 水 fluida), kanji a pincel sobre el cuerpo, ojos grandes, sombra cel, textura de papel
- 🔜 **Piloto: familia 木** (木 林 森 本 休 杏) × 3 etapas = 18 sprites
- 🔜 **Biblia de estilo:** paleta, prompt base, ejemplos aprobados; pipeline IA gratuita → quitar fondo → limpieza → exportación
- 🔜 Criterio de aceptación: reconocible a 64 px y coherente con el papel del santuario
- ⬜ Animaciones idle / feliz / triste; secuencia de evolución
- ⬜ Escalar al resto de familias (101 kanji + 16 piezas)
- ⬜ Ficha de criatura con escena 3D
- ⬜ Música ambiental y efectos por acción (tocar, evolucionar, fusionar)

## 4. Contenido
- ✅ 101 kanji en los 5 niveles KANJŪ (recetas verificadas con KanjiVG, ver docs/NIVELES.md)
- ✅ 16 piezas 部品 como accesorios
- 🔜 Pipeline de datos desde KANJIDIC2 / KanjiVG con revisión humana de recetas
- 🔜 N5 completo y más piezas
- ⬜ Contenido de temporada (ver §6)

---

## 5. Economía del juego — FASE 3

### Estado actual
- Monedas: **tinta 墨** (blanda), **boletos** (invocación), **piezas 部品** (material de evolución)
- Fuentes: producción idle (tope 6 h), repasos, entrenar, misiones, viajes, cofres de Arena, premios de unidad
- Sumideros: invocación, tienda (ampliaciones, objetos +50% por copia, decoración), mejoras de objetos, niveles de isla
- Simulación de 30 días en docs/ECONOMIA.md (hecha con 40 kanji)

### Principios
- **Estudiar rinde más que esperar:** la tinta por aprendizaje debe superar a la idle en todo perfil de jugador
- **Máximo 3 monedas visibles** al principio (tinta, boletos y, más adelante, jade 玉); el resto se muestra al desbloquearse
- **Todo kanji del currículo central (JLPT N5 → N1) y toda evolución se consiguen gratis**; el dinero nunca acelera el aprendizaje (las expansiones suman kanji temáticos fuera de ese currículo, ver §8)

### Tareas
1. 🔜 **Telemetría de economía:** cada evento de tinta/boletos/piezas con fuente y sumidero; panel de saldo medio por día de juego
2. 🔜 **Validación de partida en servidor** (anti-trampas): el servidor recalcula producción idle, premios y compras; requisito para cualquier monetización
3. 🔜 **Re-simular con 101 kanji y la Arena** (hoy la simulación no incluye cofres ni copas)
4. 🔜 **Sumideros de largo plazo** para que la tinta no se acumule sin sentido: decoración por niveles, variantes de suelo del editor, mejoras de objetos más caras en Nv4–5, coste de renacimiento que devuelve legado
5. 🔜 **Precios de la Tienda que rotan a diario** (3 ofertas en tinta) para dar un motivo de visita sin castigar
6. ⬜ **Objetivos de balance** a validar con datos: primera evolución en el día 1, primera fusión en el día 2, 50% del Atlas en la semana 3, Atlas completo en 2–3 meses para jugador normal
7. ⬜ Intercambio limitado entre amigos (regalos diarios de tinta, no de criaturas) para no romper la economía

---

## 6. Retención — FASE 4

### Ritmo de visitas (sin rachas punitivas)
| Ciclo | Qué ofrece | Estado |
|---|---|---|
| **Cada sesión (2–5 min)** | Recoger tinta, repaso del día, abrir cofre, mandar viajes | ✅ |
| **Diario** | Misiones diarias, meta de XP, viajes renovados, ofertas de tienda | ✅ / 🔜 ofertas |
| **Semanal** | Misiones semanales, **familia de la semana** (bonus al entrenar esos kanji), torneo de Arena de fin de semana | ✅ / 🔜 |
| **Temporada (4–6 semanas)** | Tema estacional, pase gratuito, arena y objetos temporales, región nueva | 🔜 |
| **Largo plazo** | Atlas, familias, camino de copas, torres JLPT, renacimiento, embellecer el santuario | ✅ / ⬜ |

### Tareas
1. 🔜 **Desbloqueo progresivo de sistemas:** día 1 solo santuario, entrenar y Academia; Arena, Altar, editor y expediciones se abren con hitos (resuelve la sobrecarga inicial)
2. 🔜 **Recompensa de regreso** ("mientras no estabas…"): resumen de lo que hicieron tus KANJŪ, tinta extra escalonada por días de ausencia (con tope), nunca pérdida
3. 🔜 **Constancia semanal en vez de racha:** premio por estudiar 4 de 7 días; perderse un día no reinicia nada
4. 🔜 **Notificaciones locales opt-in:** expedición lista, kanji para repasar, cofre abierto; máximo 1 por día, con horario elegido por el jugador, sin tono culposo
5. 🔜 **Primera temporada: Otoño de momiji 紅葉** (objetos de arce, arena temática, misiones con kanji de la estación); luego Invierno, Sakura, Verano/festivales
6. 🔜 **Pase de temporada gratuito:** pista de recompensas que se llena estudiando y jugando (cosméticos, boletos, decoración)
7. 🔜 **Eventos de santuario:** visitantes raros que aparecen si cumplís condiciones (por ejemplo, un lago y 3 KANJŪ de tipo 水)
8. ⬜ **Social liviano:** visitar santuarios de amigos, dejar un regalo diario, ranking semanal del Dojo por ligas (como las ligas de Duolingo), duelos asíncronos contra amigos
9. ⬜ **Temporadas de Arena** con reinicio parcial de copas y premio cosmético por la mejor arena alcanzada
10. ⬜ Medir D1/D7/D30, sesiones por día y duración; objetivos iniciales: D1 ≥ 40%, D7 ≥ 15%, D30 ≥ 7%, 2–3 sesiones por día

---

## 7. Empaquetado nativo y publicación — FASE 5
- 🔜 Capacitor: proyecto iOS y Android desde esta misma web
- 🔜 Clave de IA en Keychain/Keystore (almacenamiento seguro)
- 🔜 Haptics, audio y notificaciones con plugins nativos
- 🔜 Recuperación de cuenta por email (Resend)
- ⬜ Sign in with Apple y Google
- ⬜ Analítica de producto (embudo de onboarding, eventos del loop) y reporte de errores (Sentry)
- ⬜ Íconos, splash, capturas y video para las tiendas
- ⬜ Política de privacidad y términos; etiquetas de privacidad (App Store) y seguridad de datos (Play)
- ⬜ Clasificación por edad (IARC) y flujo de audiencia mixta: pantalla de edad y consentimiento parental (ver §9)
- ⬜ Accesibilidad: tamaño de texto, contraste, sin animaciones
- ⬜ TestFlight y prueba interna de Play con 20–50 jugadores; soft launch en 1–2 países antes del lanzamiento global

---

## 8. Monetización — FASE 6 (ética, después de validar retención)

### El mecanismo central: KANJŪ Plus (como Duolingo Super)
Duolingo no cobra por avanzar: cobra por **aprender mejor y con menos fricción** dentro de un hábito que el jugador ya valora. KANJŪ hace lo mismo. El juego gratis es completo; **Plus es el tutor**.

La palanca más fuerte que tenemos: hoy la IA (cuentos, "¿Por qué?", conversaciones) exige que el jugador traiga su propia clave, algo que casi nadie hace. **Plus incluye la IA lista para usar**, con nuestro servidor pagando un modelo económico. Es lo mismo que Duolingo Max hace con "Explicá mi respuesta" y "Roleplay".

**Qué incluye Plus**
- **Tutor IA sin clave:** explicación de cada error, conversaciones con tus KANJŪ, cuentos con tus criaturas (con topes diarios generosos)
- **Taller de errores:** repaso personalizado de lo que más fallás
- **Curva del olvido personal** y estadísticas de retención
- **Test de ubicación ilimitados** para saltar unidades
- **Todas las expansiones** mientras dure la suscripción (lo obtenido se conserva al cancelar)
- **Pase de temporada premium** incluido
- **Comodidad, nunca poder:** producción acumula 12 h en vez de 6, una cola extra de viajes, un espacio más de cofre
- Un estilo de papel exclusivo por mes para una criatura (se conserva)

**Cómo convierte (sin presión)**
- **Prueba gratis de 7 días**, ofrecida solo en momentos de valor: al terminar una unidad, al fallar y querer la explicación, al terminar un cuento
- Aviso propio el día 5 de la prueba antes del cobro
- **Plan anual como opción destacada** (es el que más retiene) y **plan familiar** hasta 6 cuentas
- El paywall muestra lo logrado ("aprendiste 48 kanji, dominás 12") y lo que Plus suma, nunca lo que el jugador "pierde"
- Quien prefiera, sigue usando su propia clave de IA gratis (solo adultos, ver §9)

### Líneas rojas
- Nunca vender kanji del **currículo central** (JLPT N5 → N1 y sus piezas), evoluciones, maestría ni progreso lingüístico
- Nunca vender ventaja de combate en la Arena (estadísticas, criaturas exclusivas)
- Sin energía que bloquee jugar ni esperas que solo se saltan pagando
- **No vender boletos de invocación con dinero real** (regulaciones de cajas de botín, y la invocación da criaturas, que son progreso)
- **Sin anuncios** de ningún tipo (decisión por ser para todo público, ver §9)
- Ningún tipo de compra presionada: sin contadores falsos ni ofertas que aparecen al perder

### Expansiones con kanji nuevos
Agregan kanji, pero **fuera del currículo central**: kanji temáticos y culturales que no exige ningún nivel JLPT. Así el camino para aprender japonés sigue siendo gratis y la expansión vende algo que da ganas de tener.

- Ejemplos: **Yōkai 妖** (鬼 狐 狸 妖 魅…), **Cocina 食** (鮨 鰻 麺 餅…), **Mar 海** (鯨 鮫 蛸 鯛…), **Mitos y dioses 神**
- Cada una trae región con historia, familia de criaturas nueva con su cadena de fusión, misiones, una arena temática y decoración
- Si un kanji de expansión aparece más tarde en el currículo central, pasa a ser gratis para todos (regla escrita, sin excepciones)
- Se compran sueltas o vienen incluidas en Plus

### Precios (USD; el resto de países con los precios regionales de cada tienda)
| Producto | Precio |
|---|---|
| **KANJŪ Plus mensual** | USD 6,99 |
| **KANJŪ Plus anual** (destacado) | USD 47,99 (≈ USD 4 al mes, 43% menos) |
| **KANJŪ Plus familiar anual** (hasta 6) | USD 79,99 |
| **Pase de temporada premium** (suelto, 6 semanas) | USD 4,99 |
| **Expansión** (suelta, permanente) | USD 3,99 |
| **Paquete de bienvenida** (una vez, primera semana) | USD 1,99: 600 jade + decoración |
| **Jade 玉** | 100 = 0,99 · 550 = 4,99 · 1.200 = 9,99 · 2.600 = 19,99 |

Referencias de diseño: los cosméticos cuestan entre 80 y 600 jade; el pase gratuito regala un poco de jade cada temporada para que todos prueben la tienda.

Por qué estos números: Duolingo Super ronda los USD 13 al mes; KANJŪ es más chico y nuevo, así que va a la mitad. Con la comisión reducida de las tiendas para desarrolladores chicos (15%), el plan anual deja unos USD 3,40 por mes por suscriptor, y el tutor IA con un modelo económico y topes diarios debería costar bastante menos de USD 1 por mes por usuario. **Se revisan tras el soft launch** con datos de conversión y costo real de IA.

### Tareas
1. ⬜ Requisitos previos: validación en servidor (§5), Sign in with Apple/Google, política de privacidad
2. ⬜ Proxy de IA en el servidor para Plus: modelo económico, topes diarios, filtro de contenido, medición de costo por usuario
3. ⬜ Compras y suscripciones con StoreKit / Google Play Billing vía RevenueCat, recibos validados en servidor
4. ⬜ Paywall de Plus con prueba de 7 días, plan anual destacado y familiar
5. ⬜ Tienda de jade separada de la tienda de tinta
6. ⬜ Primera expansión (Yōkai 妖) junto con la segunda temporada
7. ⬜ Métricas: inicio de prueba → pago (objetivo ≥ 35%), suscriptores sobre activos mensuales (objetivo 3–5%), costo de IA por suscriptor, retención de no pagadores sin caídas

---

## 9. Público: todo público (decidido)
"Todo público" significa que habrá menores, así que el juego se diseña como **audiencia mixta**. Hay que confirmar los detalles con un abogado antes de publicar.

- **Clasificación:** apuntar a 4+ en App Store y PEGI 3 / Everyone en Play, completando con cuidado el cuestionario (la IA debe quedar acotada al contenido del juego)
- **No entrar en la categoría Niños de Apple** (exige restricciones que no aportan); sí cumplir la política de Familias de Google Play porque el público incluye menores
- **Sin anuncios** y sin identificadores publicitarios: no hace falta pedir permiso de rastreo y se simplifica todo
- **Pantalla de edad neutral** al crear la cuenta (pedir año de nacimiento sin sugerir respuesta)
- **Menores de 13:** cuenta creada con el email de un adulto responsable que da su consentimiento (requisito de COPPA en EE. UU.); sin chat libre con IA (sí explicaciones y cuentos con filtro); sin clave de IA propia (los proveedores suelen exigir mayoría de edad); sin funciones sociales abiertas, solo regalos y visitas entre amigos aprobados
- **Compras de menores:** las controla la tienda (Pedir permiso de Apple, controles parentales de Google); el paywall nunca se muestra en medio de una lección a cuentas de menores
- **Analítica sin datos personales** para todas las edades

---

## Decisiones del director (9 de noviembre de 2026)
- **Público:** todo público, diseñado como audiencia mixta y sin anuncios (§9)
- **Modelo principal:** suscripción KANJŪ Plus centrada en el tutor IA; pase, expansiones y jade como complementos (§8)
- **Expansiones:** agregan kanji nuevos, temáticos y fuera del currículo JLPT; el camino para aprender japonés sigue siendo gratis (§8)
- **Precios:** fijados en §8, a revisar tras el soft launch
- **Idiomas:** español neutro con tú como base, voseo como variante Río de la Plata, e inglés (§2b)
