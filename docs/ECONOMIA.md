# Economía de KANJŪ

Simulación de 30 días (20 partidas por perfil) con el árbol real de kanji, regiones, repetición espaciada y compuertas de aprendizaje.
Reproducir: `node tools/exportar_kanji.mjs && python3 tools/sim_economia.py normal '{"gplus":2,"newp":0.15,"pull":120,"expnew":0.3,"dojo":4,"train":2,"base":0.8,"lvk":0.15,"mk":0.5}'`

## Problema detectado (valores anteriores)
- Atlas al 80% en 3 días; los 16 fundamentales en 2 días.
- La producción idle era ~78–95% de la tinta: el juego premiaba esperar, no estudiar.
- Fusionar no exigía saber nada: se podía llenar el Atlas sin aprender.

## Decisiones
| Palanca | Antes | Ahora | Por qué |
|---|---|---|---|
| Producción por criatura | 3 + 0.6·nivel + 1.5·maestría | 0.8 + 0.15·nivel + 0.5·maestría | Un kanji dominado produce ~2.5× más: estudiar rinde |
| Acumulación máxima | 8 h | 6 h | Invita a 2–3 visitas al día sin castigar |
| Invocación | 60 / ×10 540 | 120 / ×10 1080 | Evita la avalancha de duplicados |
| Probabilidad de kanji nuevo | 25% | 15% (piedad a las 10) | Ritmo de descubrimiento |
| Viajes con hallazgo | 45% + 1.º de cada región garantizado | Huellas 足跡: 6% + 3% por huella; 6 huellas = seguro (~1 cada 5 viajes; regiones lejanas ~1 cada 3,5) | Hallazgos más raros pero con progreso visible; los viajes sin compañero dan tinta extra u objetos |
| Tinta por repaso acertado | 2 | 4 | Más peso al aprendizaje |
| Tinta por entrenar | estrellas | estrellas × 2 | Ídem |
| Evolución | nivel 7/10/13 | nivel 5/8/11 | Primer gran logro más cercano |
| Maestría para evolucionar/fusionar | 1 | 2 (nivel 2) · profundidad+2 (nivel 3+) | **El Atlas exige repasar en días distintos** |
| Objetos repetidos | precio fijo | +50% por copia | Sumidero de tinta a largo plazo |

## Resultado (jugador normal: 3 sesiones/día)
| Día | Kanji | Rango |
|---|---|---|
| 2 | ~10/40 | 3 |
| 5 | ~23/40 | 5 |
| 7 | ~28/40 | 6 |
| 14 | ~36/40 | 8 |

Jugador casual (1 sesión/día): ~19/40 al día 7 y ~30/40 al día 14.

Con más contenido (100+ kanji) la curva se alarga sola, porque los compuestos dependen de la maestría.
