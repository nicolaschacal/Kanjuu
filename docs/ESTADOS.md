# Estados de los KANJŪ y clima

Pedido por Nicolás el 9 de noviembre de 2026. Objetivo: que los KANJŪ se sientan vivos y que cuidarlos importe. Cuando llueve, tienen que resguardarse; los que quedan a la intemperie se mojan, se ponen de mal humor y casi no producen tinta. Los objetos con techo pasan a tener una función real.

## Lo que ya existe (punto de partida)
- **Ánimo** `c.mood` de 0 a 1. Multiplica la producción de tinta por `0,5 + 0,5 × ánimo` (como mucho, la baja a la mitad). Baja con las horas de ausencia, salvo junto a un estanque (`calm`). Sube al mimar o al dar mochi; entrenar lo baja un poco.
- **Inspirado** `c.insp`: produce el doble por un rato.
- **Lluvia** `rainAt()`: misma para todos ese día; en cada bloque de 3 horas hay un 30% de chance de un chaparrón de 25 a 55 minutos (≈7% del tiempo). Hoy es solo visual.
- **Refugio** 庵 (1×1, 110 墨, rango 3): su descripción promete que "tus KANJŪ se cubren aquí cuando llueve", pero no hace nada.

## Estados
Un KANJŪ tiene siempre un **estado de ánimo** y, a veces, un **estado de clima** encima.

| Estado | Cuándo | Efecto en la tinta | Cómo se ve | Cómo se resuelve |
|---|---|---|---|---|
| **Contento** 嬉 | ánimo ≥ 0,7 | ×1 | Ojos normales o felices | — |
| **Tranquilo** 静 | ánimo 0,4 a 0,7 | ×0,85 | Ojos normales | Mimar, entrenar, estanque cerca |
| **De mal humor** 怒 | ánimo < 0,4 | ×0,6 | Ceño, nubecita oscura | Mimar, mochi, sacarlo de la lluvia |
| **Mojado** 濡 | Llueve y está a la intemperie | **×0,2** mientras llueve | Expresión triste, gotas que caen, papel más oscuro | Moverlo bajo techo, o esperar a que pare |
| **Resguardado** 庇 | Llueve y está bajo techo | ×1 y **+10%** (acogedor) | Ícono de techito, ojos tranquilos | — |
| **Secándose** | Hasta 30 min después de mojarse | ×0,6 | Vapor que sube | Se pasa solo; más rápido junto a un brasero o farol |
| **Inspirado** 閃 | Ya existe (`insp`) | ×2 | Destello | — |
| **Dormido** 眠 | De noche (ciclo día/noche) | ×0,9 | Ojos cerrados y zz | Se despierta al tocarlo o de día |

Reglas del ánimo con lluvia:
- Mojado baja el ánimo 0,15 por cada chaparrón entero a la intemperie (proporcional a los minutos), con piso de 0,25.
- Resguardado no baja el ánimo; los resguardados juntos bajo el mismo techo suben 0,05 (compañía).

## Techos
Cada objeto con techo cubre un **área** alrededor y tiene **plazas** (cuántos KANJŪ caben). Un KANJŪ está resguardado si toda su huella cae dentro del área de un techo con plaza libre.

| Objeto | Área cubierta | Plazas | Nota |
|---|---|---|---|
| Refugio 庵 | su casilla y las 8 vecinas | 2 | El techo barato, pensado para esto |
| Casa / minka | su huella + 1 casilla alrededor | 3 | |
| Templo, pagoda, casa de té | su huella + 1 alrededor | 4 | |
| Cerezo, árbol grande | su huella + 1 alrededor | 1 | Techo parcial: tinta ×0,6 en vez de ×0,2 |
| Puente | debajo del puente | 1 | Solo KANJŪ de agua |

Los KANJŪ de **agua** 水 no se mojan: disfrutan la lluvia (×1,1) y no ocupan plazas.

## Cómo se juega
- **Al empezar la lluvia**, cada KANJŪ con plaza disponible camina a su techo más cercano (animación) y vuelve a su casilla cuando para. Los que no tienen plaza quedan mojados.
- **Pronóstico** en el reloj del HUD: "Lluvia en 40 min" desde una hora antes, para que el jugador prepare techos. Es un motivo para volver sin castigar.
- **Ausencia:** al volver, el juego calcula los chaparrones que pasaron (`rainAt` es determinista) y aplica el efecto solo a quienes estaban sin techo. El resumen de regreso lo cuenta: "Llovió dos veces; 林 y 男 se mojaron".
- **Primera lluvia:** misión guiada "Primer chaparrón" que regala un Refugio, para que el jugador aprenda la mecánica sin perder tinta.
- **Ficha del KANJŪ:** muestra su estado con ícono, qué le pasa y cómo arreglarlo ("Está mojado: ponelo cerca de un techo").
- **Modo editor:** al elegir un objeto con techo se ve en celeste el área que cubre y sus plazas.

## Límites (para no castigar)
- Ningún estado baja la tinta a cero ni hace perder criaturas, niveles o maestría.
- El ánimo nunca baja de 0,25.
- La lluvia sigue ocupando ≈7% del tiempo; si con datos resulta molesta, se baja la frecuencia antes que el efecto.

## Balance a simular (antes de publicar)
- Isla sin techos: la producción diaria baja ≈10–12%. Con techos para todos: sube ≈1%.
- Un Refugio debe recuperar su costo en unos 5–7 días de juego normal.
- Agregar el escenario a `tools/sim_economia.py`.
