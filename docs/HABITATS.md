# Hábitats: espacios que amplían la isla

Pedido por Nicolás el 11 de noviembre de 2026. Reemplaza la propuesta anterior del Zoo (la maqueta de la rama `propuesta/zoo-maqueta` queda como referencia visual).

**Idea:** algunos edificios guardan KANJŪ adentro. Ocupan poco lugar en la isla y alojan varias criaturas. Un KANJŪ entra a un hábitat **por lo que significa**, no por las piezas de su kanji: 猫 (gato) entra al Zoo; 特 (especial) no entra, aunque lleve 牛. El jugador lo descubre probando, y cada rechazo le enseña el significado.

Se hace en dos fases:
- **Fase 1 (S1-09, este pull request):** cargar los kanji, sus conceptos y la mascota 獣.
- **Fase 2 (este plan):** construir los hábitats uno por uno, con aprobación visual antes de cada uno.

---

## Fase 1 · Qué se cargó (S1-09)

- **54 kanji nuevos** (de 101 a 155): 3 de N5, 22 de N4, 10 de N3, 11 de N2 y 8 de N1. Hay pocos animales y comidas en N5–N4, así que más de la mitad son N3 o más (ver decisión 3). El nivel JLPT es aproximado: desde 2010 no hay listas oficiales; se usa la lista de kanji-data (basada en las de Jonathan Waller).
- **Recetas verificadas con KanjiVG**, como el resto del árbol (ver docs/NIVELES.md). Los pictogramas (犬, 魚, 貝, 氷…) son nivel 1 aunque KanjiVG los dibuje con partes, porque esas partes no forman su significado.
- **13 piezas 部品 nuevas:** ⺍ 豕 勿 尺 罒 隹 卩 欠 斗 采 匕 巾 弋. 又 entra como KANJŪ (no como pieza) para que 反 y 服 se puedan formar con criaturas.
- **Concepto de cada kanji** (`concept` en `js/data.js`), puesto a mano: animal, comida, ropa, planta, persona o cielo. Un kanji puede tener dos (魚 es animal y comida; 杏 es planta y comida). No tienen efecto en el juego hasta que exista el primer hábitat.
- **Lecturas principales** de los 54 (docs/LECTURAS.md), **trazos** de KanjiVG para la escritura y **32 palabras nuevas** (子犬, 牛肉, 着物, 花火, 文化…).
- **3 regiones de viaje nuevas** para conseguir los fundamentales: Granja 牧場 (犬 牛 馬 羊 鳥 卵), Mercado del puerto 港の市場 (魚 貝 米 肉 食 氷 象) y Bambusal 竹の里 (竹 虫 羽 又). Además: 大 en el Sendero del bosque, 白 en la Colina, 文 en el Pueblo de posta y 革 en la Pradera.
- **La mascota 獣** como KANJŪ jugable (ver más abajo).

Los 54 nuevos se ven todavía con la forma automática de criatura, salvo 獣. Su arte propio va en la fase 2 (tarea H-02).

---

## La mascota 獣 (漢獣)

- **Receta:** ⺍ + 田 + 口 + 犬, igual que el árbol de KanjiVG (la parte izquierda de 獣 es ⺍, 田 y 口; la derecha, 犬). Por eso hacía falta cargar 犬.
- **Cómo se consigue hoy:** fusionando 犬 (Granja), 田 (Valle de fuego), 口 (Manantial del corazón) y la pieza ⺍ (tienda o premios). Es grado 2, así que llega temprano.
- **Arte:** la misma figura del ícono aprobado: cuerpo cuadrado con las líneas de 田, tres chispas ⺍ arriba, el cuerno de 犬, un solo ojo, boca grande con colmillos y saludando. Papel rojo Fuego (el kanji fuerza ese elemento, aunque su primera pieza sea 田).
- **Concepto:** animal (bestia). Entra al Zoo.

**Necesita tu decisión:** ¿la mascota se consigue solo fusionando (como cualquier KANJŪ, una meta temprana) o se regala al empezar como compañera y guía de la Academia (S1-05)? Recomiendo **fusión con misión guiada**: la primera misión larga del juego enseña a fusionar y el premio es 獣. Así el jugador la gana y aprende cuatro kanji en el camino.

---

## Los hábitats

Cada uno tiene su concepto, qué KANJŪ entran hoy y las **trampas**: kanji que rozan el concepto sin pertenecer. Las trampas son el momento de aprendizaje.

### 1. Zoo 動物園 · animales (13)
犬 perro · 牛 vaca · 馬 caballo · 鳥 ave · 魚 pez · 虫 insecto · 貝 concha · 羊 oveja · 象 elefante · 豚 cerdo · 蚊 mosquito · 猫 gato · 獣 bestia

**Trampas:** partes de un animal (毛 pelo · 尾 cola · 羽 pluma) y kanji que llevan un animal adentro sin serlo (鳴 cantar · 物 cosa · 特 especial · 牧 pastorear · 駅 estación · 買 comprar · 員 miembro · 集 reunir · 習 aprender · 美 belleza · 着 vestirse).

**Afuera:** granero con techo de paja, cartel 動物園, tablilla de plazas y alguien que se asoma por el portón. **Adentro:** corte con fardos, nido y estanque (maqueta ya hecha).

### 2. Heladera 冷蔵庫 · comida y bebida (12)
魚 pez · 肉 carne · 米 arroz · 卵 huevo · 氷 hielo · 食 comida · 豆 poroto · 杏 albaricoque · 茶 té · 菜 verdura · 果 fruto · 飯 arroz cocido

**Trampas:** 飲 beber · 料 tarifa · 皿 plato · 牛 vaca (no es carne: la carne de vaca es 牛肉) · 豚 cerdo (animal vivo).

**Afuera:** refrigerador de papel, alta y angosta (1×1), con imanes que muestran a quién hay adentro. **Adentro:** la puerta abierta con estantes; cada plaza es un estante o un cajón; el 氷 vive en el congelador.

### 3. Invernadero 温室 · plantas (10)
木 árbol · 艸 hierba · 竹 bambú · 林 arboleda · 杏 albaricoque · 杉 cedro · 苗 brote · 森 bosque · 花 flor · 草 pasto

**Trampas:** 本 libro · 枯 marchitarse · 休 descansar · 相 mutuo · 薪 leña (madera cortada) · 果 fruto (va a la Heladera) · 茶 té (bebida).

**Afuera:** casita de papel shōji translúcido con siluetas que se mueven. **Adentro:** macetas y canteros; las plazas son macetas.

### 4. Casa 家 · personas (7)
人 persona · 女 mujer · 子 niño · 男 hombre · 朋 compañero · 兄 hermano mayor · 員 miembro

**Trampas:** 好 gustar · 姓 apellido · 休 descansar · 体 cuerpo · 安 tranquilo (mujer bajo el techo).

**Afuera:** minka con ropa colgada y luz en la ventana. **Adentro:** tatami, kotatsu y futones.

### 5. Guardarropa 箪笥 · ropa y accesorios (5)
衣 ropa · 服 ropa · 靴 zapato · 帽 gorro · 袋 bolsa

**Trampas:** 着 vestirse (verbo) · 糸 hilo · 毛 pelo · 皮 piel · 革 cuero · 襟 cuello (parte de la ropa).

Con 5 kanji es el más chico. Se construye después, cuando haya más ropa (帯 faja, 布 tela, 傘 paraguas…).

### 6. Observatorio 天文台 · cielo (3)
日 sol · 月 luna · 星 estrella

**Trampas:** 明 brillante · 晶 cristal · 旦 amanecer · 早 temprano.

Queda para cuando llegue más cielo (空 雨 雪 雲 風), probablemente con la temporada de invierno.

### Cajas de objetos (no guardan KANJŪ)
**Baúl つづら:** guarda objetos de decoración pequeños y les deja el 25% de su Armonía. Es un contenedor de objetos, no un hábitat; va por su cuenta en la fase 2 (H-09).

### Kanji nuevos sin hábitat
大 grande · 白 blanco · 文 escritura · 羽 pluma · 鳴 cantar · 物 cosa · 特 especial · 牧 pastorear · 駅 estación · 買 comprar · 集 reunir · 習 aprender · 美 belleza · 着 vestirse · 反 al revés · 飲 beber · 料 tarifa · 化 transformar · 冒 arriesgarse · 代 reemplazar · 早 temprano · 革 cuero · 又 otra vez.

Viven en la isla como siempre. Casi todos son trampas de algún hábitat, que es justamente su papel.

---

## Reglas comunes (se construyen una sola vez)

| | En la isla | En un hábitat |
|---|---|---|
| Ocupa casillas | Sí | No (solo el edificio) |
| Auras de objetos y Armonía 和 | Sí | No |
| Bonus de afinidad | No | +5% por cada vecino, tope +15% |
| Lluvia | Se moja si no tiene techo | Siempre resguardado (docs/ESTADOS.md) |
| Mimar, mochi, entrenar, Arena, viajes | Sí | Sí, desde la vista interior |

- **Entrar:** el jugador arrastra o toca un KANJŪ. Si su concepto coincide, entra con un sello (動物, 食べ物…) y suma a la colección del hábitat; la primera vez da +10 墨. Si no coincide, vuelve a la isla y el juego explica el significado. **Equivocarse nunca cuesta nada.**
- **Colección:** cada hábitat muestra "Descubiertos 4 / 13" con siluetas "?" para los que faltan.
- **Plazas por nivel:** Nv1 / Nv2 / Nv3 = 3 / 5 / 8 en Zoo, Heladera e Invernadero; 3 / 4 / 6 en los chicos.
- **Precio orientativo en tinta:** Nv1 400–600, Nv2 ×2, Nv3 ×3,5. Se ajusta con `tools/sim_economia.py`: cada hábitat debe recuperar su costo en 7–10 días de juego normal. **Las plazas nunca se venden con dinero real.**
- **Desbloqueo por rango:** Zoo rango 4, Heladera rango 5, Invernadero rango 6, Casa rango 7, Guardarropa y Observatorio más adelante.
- **Guardado compatible:** `S.habitats ??= {}`; las partidas viejas cargan sin hábitats.

---

## Plan de la fase 2

Orden: el sistema común primero con el Zoo (es el que más KANJŪ tiene y ya tiene maqueta), después los demás reutilizando todo.

| ID | Tarea | Tipo | Depende de |
|---|---|---|---|
| H-01 | **Propuesta: Zoo afuera y adentro** sobre la maqueta de `propuesta/zoo-maqueta`, más los momentos de acierto y rechazo | Diseño (aprobar) | — |
| H-02 | **Propuesta: arte de los 53 KANJŪ nuevos** con el estilo aprobado (una forma por kanji); piloto con 犬 牛 鳥 魚 猫 | Diseño (aprobar) | — |
| H-03 | **Sistema de hábitats:** plazas, admisión por concepto, producción con afinidad y sin auras, techo, colección, guardado | Código | — |
| H-04 | **Zoo en el juego**, igual a lo aprobado en H-01 | Código | H-01, H-03 |
| H-05 | **Misión de la mascota:** guía para fusionar 獣 (si eliges esa opción) | Código | decisión |
| H-06 | **Propuesta + implementación: Heladera** | Diseño → código | H-03 |
| H-07 | **Propuesta + implementación: Invernadero** | Diseño → código | H-03 |
| H-08 | **Propuesta + implementación: Casa** | Diseño → código | H-03 |
| H-09 | **Baúl de objetos** | Diseño → código | — |
| H-10 | **Simulación de economía** con hábitats y los 155 kanji | Código | H-03 |
| — | Guardarropa y Observatorio | Más adelante | más kanji |

Sugerencia de sprints: H-01, H-02 y H-03 en paralelo en el sprint siguiente al de estados y clima; H-04 y H-05 después; un hábitat nuevo por sprint a partir de ahí.

---

## Decisiones pendientes

1. **Mascota:** ¿solo por fusión (recomendado, con misión guiada) o regalo inicial?
2. **Doble concepto:** 魚 entra al Zoo y a la Heladera; 杏 al Invernadero y a la Heladera. ¿Te parece bien o prefieres un solo hogar por kanji?
3. **Fuera de N5–N4:** de los 54 nuevos, 25 son N5–N4 y 29 no: N3 馬 米 鳴 美 反 果 化 猫 靴 草 · N2 虫 貝 象 羽 卵 氷 革 竹 菜 帽 袋 · N1 羊 又 苗 豚 牧 蚊 獣 冒. Hay pocos animales y comidas en N5–N4, y muchos de estos son pasos de una receta (反 para 飯, 化 para 花 y 靴). ¿Los dejamos (recomendado) o recortamos a N5–N3?
4. **Guardarropa y Observatorio:** ¿esperamos a tener más kanji (recomendado) o los hacemos chicos ahora?
