# KANJŪ — Roadmap hacia App Store y Google Play

Estado: ✅ hecho · 🔜 siguiente · ⬜ pendiente. Revisado el 9 de noviembre de 2026 contra el código.

## Orden de trabajo

| # | Fase | Por qué en este orden |
|---|---|---|
| 1 | **Academia** | Es la mitad del juego que menos engancha hoy; sin aprendizaje que retenga no hay producto |
| 2 | **Diseño de criaturas** (con aprobación previa) | El apego a las criaturas es el motor de la retención y de la monetización cosmética |
| 3 | **Economía instrumentada** | Antes de tocar retención o cobrar hay que medir fuentes y sumideros y validar en servidor |
| 4 | **Retención** | Recompensa de regreso, temporadas gratuitas, notificaciones, social liviano |
| 5 | **Empaquetado nativo y tiendas** | Capacitor, requisitos legales, TestFlight / prueba interna |
| 6 | **Monetización** | Recién con retención D7 validada y anti-trampas; se lanza con el soft launch |

Santuario (con su modo editor) y Arenas están **cerrados**: diseño aprobado e implementado. Solo reciben ajustes.

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
- **Todo kanji y toda evolución se consiguen gratis**; el dinero nunca acelera el aprendizaje

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
- ⬜ Clasificación por edad (IARC); decidir si apunta a menores (afecta anuncios y COPPA / Families)
- ⬜ Accesibilidad: tamaño de texto, contraste, sin animaciones
- ⬜ Localización: español, inglés, portugués
- ⬜ TestFlight y prueba interna de Play con 20–50 jugadores; soft launch en 1–2 países antes del lanzamiento global

---

## 8. Monetización — FASE 6 (ética, después de validar retención)

### Líneas rojas
- Nunca vender kanji, evoluciones, maestría ni progreso lingüístico
- Nunca vender ventaja de combate en la Arena (estadísticas, criaturas exclusivas)
- Sin energía que bloquee jugar ni esperas que solo se saltan pagando
- **No vender boletos de invocación con dinero real** (evita las regulaciones de cajas de botín, y la invocación da criaturas, que son progreso)
- Ningún tipo de compra presionada: sin contadores falsos ni ofertas que aparecen al perder

### Productos, por prioridad
| Producto | Qué da | Precio de referencia |
|---|---|---|
| **Pase de temporada premium** | Segunda pista del pase: estilos de papel para criaturas (washi, origami, sumi-e), decoración temática, marco de perfil | USD 4,99 por temporada |
| **Jade 玉 (moneda premium)** | Cosméticos: estilos de criaturas, temas de isla, tipos de suelo especiales, decoración premium, efectos de ataque en la Arena | Paquetes desde USD 0,99 |
| **Mecenas del santuario** (suscripción) | Comodidad, nunca poder: producción acumula 12 h en vez de 6, una cola extra de viajes, un espacio más de cofre, tema de isla exclusivo | USD 2,99–3,99 por mes |
| **Paquetes de expansión** | Regiones con historia, decoración y misiones extra; los kanji que contengan también se consiguen gratis por otra vía | USD 2,99–4,99 |
| **Paquete de bienvenida** (una sola vez) | Decoración y jade con descuento, disponible la primera semana | USD 1,99 |
| *Anuncios con recompensa* (decisión pendiente) | Opcionales, máx. 3 por día (duplicar tinta de un viaje); se descartan si el juego apunta a menores | — |

### Tareas
1. ⬜ Requisitos previos: validación en servidor (§5), cuentas con Apple/Google, política de privacidad
2. ⬜ Compras in-app con StoreKit / Google Play Billing vía RevenueCat, validación de recibos en servidor
3. ⬜ Tienda de jade separada de la tienda de tinta, con precios regionales (Uruguay y LatAm)
4. ⬜ Primer pase de temporada premium junto con la segunda temporada
5. ⬜ Medir conversión (objetivo 2–4% de pagadores) y que la retención de no pagadores no caiga

---

## Decisiones pendientes del director
- ¿El juego apunta a menores? Define anuncios, clasificación y datos que se pueden pedir
- Precio exacto del pase y la suscripción tras ver retención en el soft launch
- Si los paquetes de expansión agregan kanji nuevos o solo historia y cosméticos
