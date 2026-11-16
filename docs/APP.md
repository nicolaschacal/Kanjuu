# KANJŪ como app (iOS y Android) — tarea B-03

El proyecto nativo vive en `app/` y usa Capacitor 8. El juego no cambia: `app/build.mjs` copia los archivos de la web a `app/www/` y Capacitor los mete dentro de la app. La API sigue en Vercel (`js/env.js`).

**Estado:** los proyectos `app/ios` y `app/android` se generaron y sincronizan sin errores, pero **todavía no se compilaron ni se probaron en un teléfono** (compilar necesita Xcode o Android Studio).

## Qué necesitas
| Para | Necesitas |
|---|---|
| Android | Cualquier computadora con [Android Studio](https://developer.android.com/studio) y Node 20 o más |
| iOS | Una Mac con Xcode 16 o más y Node 20 o más. No se puede compilar para iPhone desde Windows ni Linux |
| Publicar | Cuenta de Apple Developer (USD 99 por año) y de Google Play Console (USD 25, una vez) |

## Probar en tu teléfono
```bash
git clone https://github.com/nicolaschacal/Kanjuu.git && cd Kanjuu/app
npm install
npm run android   # arma www, sincroniza y abre Android Studio
npm run ios       # lo mismo con Xcode (solo en Mac)
```
- **Android Studio:** conecta el teléfono con la depuración USB activada y toca ▶.
- **Xcode:** en *Signing & Capabilities* elige tu equipo (tu Apple ID sirve para probar), conecta el iPhone y toca ▶.

Cada vez que cambie el juego: `git pull` y de nuevo `npm run android` o `npm run ios`.

## Qué revisar en la primera prueba
1. **Entrar con tu cuenta y que la sesión se mantenga** al cerrar y abrir la app. Es el punto más delicado: en la app, la API está en otro sitio y las cookies pasan por `CapacitorHttp` y `CapacitorCookies` (`app/capacitor.config.json`).
2. Que la partida se guarde y vuelva (cambia algo, cierra la app, ábrela).
3. Vibración, botón «atrás» de Android y gestos.
4. La zona de la barra de estado y del borde inferior (muesca, barra de gestos).
5. El audio (voz japonesa) y la escena 3D.

Si el punto 1 falla, hay un plan B de una línea: en `app/capacitor.config.json` agrega `"server": { "url": "https://kanjuu.vercel.app" }`. La app pasa a mostrar el sitio en vivo (la sesión funciona igual que en el navegador). Sirve para probar, pero para publicar conviene el modo con archivos adentro: Apple suele rechazar apps que solo muestran un sitio.

## Íconos y pantalla de arranque
Salen de `app/assets/` (`icon-only.png`, `icon-foreground.png`, `icon-background.png`, `splash.png`, `splash-dark.png`). Para regenerarlos después de cambiar esos archivos: `npm run assets`. El ícono adaptable de Android es un borrador hecho a partir del ícono actual.

## Decisiones pendientes (de Nicolás)
- **Identificador de la app:** hoy `com.kanjuu.app` (`appId` en `app/capacitor.config.json`). No se puede cambiar después de publicar. Si se cambia antes, hay que borrar `app/ios` y `app/android` y volver a generarlos con `npx cap add ios` y `npx cap add android`.
- **Dominio:** la app apunta a `https://kanjuu.vercel.app` (`js/env.js`). Si KANJŪ pasa a un dominio propio, se cambia ahí y hay que publicar una versión nueva de la app.

## Lo que falta para las tiendas (ROADMAP §7)
- Política de privacidad y términos (enlazados desde la pantalla de inicio), y borrar cuenta dentro de la app (ya existe en Cuenta).
- Sign in with Apple: Apple lo exige solo si se ofrece entrar con Google u otra red; con email y contraseña no hace falta.
- Compras: KANJŪ Plus dentro de la app tiene que cobrarse con las compras de Apple y Google, no con una pasarela web.
- Etiquetas de privacidad, clasificación por edad, capturas y ficha de cada tienda.
- Notificaciones, si se quieren (plugin aparte).
