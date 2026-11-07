# KANJŪ — Roadmap hacia App Store y Google Play

Estado: ✅ hecho · 🔜 siguiente · ⬜ pendiente. El arte definitivo queda para después de validar el loop.

## 1. Núcleo jugable
- ✅ Santuario vivo, criaturas SVG procedurales, interacción directa
- ✅ Evolución ramificada por EXP, fusión con recetas verificadas, renacimiento con legado
- ✅ Expediciones asíncronas (9 regiones, desbloqueo por colección, huellas y exploraciones diarias por región)
- ✅ Santuario en grilla de tiles: criaturas (1×1, 2×1, 2×2) y objetos ocupan casillas; modo construcción para mover
- ✅ Almacén para criaturas y objetos fuera de juego; puerta como desborde; expandir terreno y almacén
- ✅ Producción idle de tinta por criatura (sube con nivel, maestría, ánimo, estrellas, auras); se acumula hasta 8 h
- ✅ Objetos con aura y mejora hasta Nv5 (puzzle de ubicación), objetos globales
- ✅ Altar de invocación con tinta o boletos, piedad transparente, variantes doradas, despertar con duplicados
- ✅ Rango de guardián que desbloquea terreno y objetos; calendario de 7 días sin reinicios
- 🔜 Habitats por familia (bosque, cielo, agua…) con bonificación al convivir criaturas afines
- 🔜 Rasgos de personalidad (tímido, juguetón…) que cambian animaciones y preferencias de entrenamiento
- ✅ Arena 闘 estilo Clash Royale: duelos 3v3 con desafíos de kanji, tipos 五行, copas, 6 arenas, camino de copas y cofres que se abren estudiando
- ✅ Familias 族 con premio al completarlas
- 🔜 Duelos contra amigos (asíncronos) y temporadas de Arena
- ⬜ Eventos de santuario: visitantes raros que solo aparecen si cumplís condiciones

## 2. Aprendizaje (técnicas con evidencia)
- ✅ Repetición espaciada (cajas de Leitner) en el Dojo con maestría por kanji
- ✅ Recuperación activa: el jugador produce la respuesta, no solo la reconoce
- ✅ Intercalado: cada repaso mezcla significado, lectura, audio y composición
- ✅ Mnemotecnias por kanji y descomposición en componentes (codificación elaborativa)
- ✅ Codificación dual: criatura + glifo + audio japonés
- ✅ Feedback inmediato con historia al fallar y reaprendizaje en la misma sesión
- ✅ Trazo, Lecturas, Palabra, Ensamblar, Escuchar
- ✅ Capa para principiantes: furigana en la interfaz (desactivable), romaji en lecturas
- ✅ Academia estilo Duolingo: 7 unidades (bienvenida, hiragana I y II, katakana, primeras frases, verbos y tiempos, lecturas)
- ✅ 9 tipos de ejercicio: introducción con audio, kana↔romaji, escuchar, unir pares, significado, traducir, armar oraciones, completar partículas, tiempos verbales
- ✅ Errores vuelven al final de la lección, combo, coronas (hasta 3), meta diaria de XP, premio por unidad, repaso espaciado de kana y vocabulario
- ✅ Lecturas graduadas con tus kanji: furigana adaptativa (desaparece al dominar el kanji), traducción por oración, audio y preguntas de comprensión
- ✅ IA propia del jugador (patrón heey.me): detección de proveedor, Gemini/Groq/Claude/OpenAI/OpenRouter; llamadas directas desde el dispositivo, sin costo de servidor
- 🔜 App nativa: guardar la clave en Keychain/Keystore (plugin de almacenamiento seguro)
- ✅ Cuentos generados con tus criaturas como protagonistas, solo con tus kanji, tu vocabulario y tu gramática; validación en servidor; biblioteca
- ✅ "¿Por qué?": la IA explica cada error en la Academia
- 🔜 Conversaciones guiadas con las criaturas (practicar frases en contexto)
- 🔜 Más unidades: て-form, querer/poder, contadores, números, hora y fechas; test para saltar unidades
- ✅ Orden de trazos real con KanjiVG: demostración animada y evaluación trazo por trazo
- 🔜 Mnemotecnias propias del jugador (escribir su historia; las suyas se recuerdan mejor)
- 🔜 Oraciones de contexto con furigana y audio
- ⬜ Pruebas de nivel JLPT N5 → N1 como "torres" desbloqueables
- ⬜ Estadísticas de retención para el jugador (curva del olvido personal)

## 3. Contenido
- ✅ 101 kanji en los 5 niveles KANJŪ (24 fundamentales; recetas verificadas con KanjiVG, ver docs/NIVELES.md)
- ✅ 16 piezas 部品 como accesorios (宀 儿 攵 辶 广 亠 冖 疒 彳 尸 厂 冂 勹 彡 癶 廴): se equipan para evolucionar o se suman en la fusión; se consiguen en Tienda, viajes y Academia
- 🔜 Más piezas y los kanji comunes que habilitan (objetivo: N5 completo)
- 🔜 Pipeline de datos: kanji + componentes + lecturas desde KANJIDIC2 / KanjiVG, revisión humana de recetas
- 🔜 Llevar a 100 kanji (todo N5) con niveles KANJŪ 4–5
- ⬜ Temporadas temáticas (estaciones del año, festivales) con regiones nuevas

## 4. Retención y economía
- ✅ Misiones diarias y semanales sin castigo, logros cobrables, objetivo guiado
- ✅ Primera sesión guiada (6 pasos con recompensa) y repaso del día unificado (kanji + kana + vocabulario)
- ✅ Tinta 墨 como moneda blanda; tienda con ampliaciones, objetos y decoraciones
- 🔜 Recompensa de regreso ("mientras no estabas…") en vez de rachas punitivas
- 🔜 Pase de temporada gratuito con recompensas cosméticas
- 🔜 Notificaciones locales: expedición lista, kanji para repasar (opt-in)
- ⬜ Amigos: visitar santuarios, intercambiar huevos, ranking semanal del Dojo
- ✅ Balance de economía con simulación de 30 días (docs/ECONOMIA.md); el Atlas exige maestría
- 🔜 Validar con telemetría real (fuentes y sumideros de tinta)

## 5. Monetización ética (no en el MVP)
- ⬜ Moneda premium 玉 solo para cosméticos, decoraciones y ampliaciones extra
- ⬜ Pase de temporada premium (cosmético + regiones extra)
- ⬜ Paquetes de expansión (regiones, familias de kanji)
- ⬜ Sin vender evoluciones ni progreso lingüístico; sin energía que bloquee jugar

## 6. Cuenta y backend
- ✅ Cuenta email/contraseña, guardado en la nube (Vercel + Neon)
- ✅ Límite de intentos de login (por email e IP), código de recuperación, cambiar contraseña
- 🔜 Recuperación por email (Resend) como alternativa al código
- 🔜 Validación de partida en servidor (anti-trampas en economía)
- ⬜ Sign in with Apple (obligatorio en iOS si hay otros logins sociales) y Google
- ✅ Borrado de cuenta desde la app (requisito de App Store y Google Play)

## 7. Empaquetado nativo
- 🔜 Capacitor: proyecto iOS y Android desde esta misma web
- 🔜 Haptics, audio y notificaciones con plugins nativos
- ⬜ Íconos, splash, capturas, video de vista previa para las tiendas
- ⬜ Compras in-app con StoreKit / Google Play Billing (RevenueCat)
- ⬜ Analítica (eventos del loop, embudo de onboarding) y reporte de errores (Sentry)

## 8. Requisitos de publicación
- ⬜ Política de privacidad y términos; etiquetas de privacidad de App Store; formulario de seguridad de datos de Play
- ⬜ Clasificación por edad (IARC); revisar si apunta a menores (COPPA / Families)
- ⬜ Accesibilidad: tamaños de texto, contraste, modo sin animaciones (ya respeta "reducir movimiento")
- ⬜ Localización: español, inglés, portugués
- ⬜ TestFlight y prueba interna de Play con 20–50 jugadores; iterar retención D1/D7

## 9. Arte y audio (fase gráfica)
- ⬜ Criaturas ilustradas por familia con 3 etapas visuales y animaciones idle/feliz/triste
- ⬜ Fondos del santuario por hábitat, día/noche según la hora real
- ⬜ Música ambiental y efectos por acción (tocar, evolucionar, fusionar)
