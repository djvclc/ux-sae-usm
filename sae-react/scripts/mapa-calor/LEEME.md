# Registro del cursor y mapas de calor (prueba remota)

**Estado (2026-10-31): propuesta, en la rama `feature/registro-cursor`.** No se ha usado con participantes. Antes de usarlo hace falta:

1. la aprobación de la profesora guía, porque es un dato nuevo y el instrumento ya está aprobado;
2. agregar al consentimiento una línea como *"La página registra por dónde mueves el mouse y dónde haces clic, sin tu nombre ni lo que escribes."*;
3. hacer la configuración de Google (abajo) y una sesión piloto.

Mientras no se pegue la URL del Apps Script, el registro no manda nada a ningún lado.

## Qué hace

- Solo se activa con los links de sesión (`/postulacion?sesion=1` = A, `?sesion=2` = B). En una visita normal no registra nada.
- Cada 100 ms anota dónde está el cursor y en qué pantalla está la persona: tu familia, "¿Confirmas estos datos?", lista vacía, catálogo, tu lista, revisa y envía, "Confirma tu postulación", postulación enviada y resultado.
- También anota cada clic. Si el cursor lleva más de 5 s quieto, deja de anotar, para que el tiempo de las preguntas en voz alta no sume calor.
- No guarda nombres, RUN ni lo que se escribe.
- Cada 15 s manda una "parte" a una carpeta de **tu** Google Drive, y al cerrar la pestaña manda lo que quede. Si un envío falla, lo reintenta.
- **Respaldo:** <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> descarga todo lo registrado en esa pestaña como un archivo `..._completo.json`.

Código: `src/utils/registroCursor.js`, que se activa en `src/main.jsx` y `src/utils/sesionRemota.js`.

## Configurar Google (una vez, ≈15 min)

1. **Carpeta.** En Google Drive, crea una carpeta, por ejemplo "Registro cursor SAE". Ábrela y copia de la barra de direcciones lo que va después de `/folders/`: es el **ID de la carpeta**.
2. **Script.**
   - Entra a https://script.google.com → **Nuevo proyecto**.
   - Borra lo que trae y pega todo `apps-script.gs`.
   - Pega el ID de la carpeta en `CARPETA_ID` y guarda.
3. **Probar el script.**
   - En el menú de arriba, elige la función `probar` → **Ejecutar**.
   - La primera vez pide permisos: acepta con tu cuenta. Si aparece "Google no verificó esta app", entra en *Configuración avanzada → Ir a … (no seguro)*: el script es tuyo.
   - En la carpeta debe aparecer `20260101-0000-A-test_parte-000.json`. Bórralo.
4. **Publicar.**
   - Ve a **Implementar → Nueva implementación**, tipo **Aplicación web**.
   - *Ejecutar como:* **Yo**. *Quién tiene acceso:* **Cualquier usuario** (si no, el navegador de la participante no puede enviar).
   - Pulsa **Implementar** y copia la **URL de la aplicación web**, que termina en `/exec`.
   - Abrir esa URL en el navegador debe mostrar "funciona".
5. **Conectar el prototipo.** Pega la URL en `URL_POR_DEFECTO`, en `src/utils/registroCursor.js`. Al subir a `main` se publica en GitHub Pages.

La URL queda a la vista en el repositorio público. Alguien podría mandar datos falsos, pero el script rechaza todo lo que no tenga la forma de una parte, y nadie puede leer tu carpeta.

## Antes de usarlo con participantes: piloto

Desde otro computador, abre el link de sesión de A, haz la tarea completa y cierra la pestaña. Después:

1. Revisa que en la carpeta de Drive aparecieron archivos `AAAAMMDD-HHMM-A-xxxx_parte-000.json`, `..._parte-001.json`, etc.
2. Descarga la carpeta y corre el resumen (abajo). Tiene que decir **✓ completa**.

Repite con B.

## En cada sesión

- **Antes:** confirma que la persona usa computador con mouse o touchpad. En celular no hay cursor.
- **En la planilla de respuestas:** anota la **hora de inicio** y la **versión**. El nombre de cada archivo empieza con la fecha, la hora y la versión (`20261105-1532-A-k3f9`), y así se cruza con la planilla sin usar nombres.
- **Después:** descarga la carpeta de Drive a `scripts/mapa-calor/datos/` y corre

  ```bash
  cd sae-react/scripts/mapa-calor
  node resumen.mjs
  ```

  Para cada sesión muestra los segundos y clics por pantalla. Avisa si faltan partes o pantallas, si hubo 0 clics o si no se usó mouse.
- **Si llegó incompleta**, pídele a la persona, antes de cortar la videollamada, que presione <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> y te mande el archivo que se descarga. Ponlo en la misma carpeta `datos/`.

## Mapas de calor (al final, o cuando quieras)

Con el prototipo servido en local:

```bash
cd sae-react
npm run build && npx vite preview --port 4173 &
cd scripts/mapa-calor
node mapa.mjs datos
```

Genera en `mapas/` una imagen por pantalla con A y B lado a lado y la misma escala. El calor es el promedio por sesión. Para juntar personas con pantallas de distinto tamaño, cada muestra se ubica sobre el mismo elemento de la página en que estaba el cursor, y el título de cada imagen dice qué porcentaje se pudo ubicar.

**Cómo leerlo:** el cursor no es la mirada. Hay gente que lee sin mover el mouse, y el cursor se queda quieto donde se hizo el último clic mientras carga la pantalla siguiente (por eso aparecen manchas en lugares sin interés). Úsalo como dato de exploración, junto con lo que la persona dijo, no como "lo que la persona vio".

**Privacidad:** `datos/`, `mapas/` y `respaldos/` están en `.gitignore`. Los datos de participantes **nunca** se suben al repositorio, que es público.

## Probarlo sin Google (en el propio computador)

```bash
cd sae-react
node scripts/mapa-calor/servidor-prueba.mjs &          # imita al Apps Script → datos/
VITE_URL_REGISTRO=http://localhost:8787 npm run build && npx vite preview --port 4173 &
cd scripts/mapa-calor
node simular-sesion.mjs http://localhost:4173 2 --respaldo   # 2 sesiones simuladas por versión
node resumen.mjs && node mapa.mjs datos --nota "DATOS SIMULADOS"
```

`simular-sesion.mjs` mueve el mouse con un script (no son personas) y sirve solo para verificar que el registro, el envío, el resumen y los mapas funcionan. Requiere `playwright`.

Antes de compilar la versión real, borra `datos/` y `mapas/` de la prueba y vuelve a compilar **sin** `VITE_URL_REGISTRO`.

## Si cambia el prototipo

El nombre de cada pantalla sale de clases de `PostulacionPage.jsx` (`.post-progreso`, `.post-colegio-lista`, `.post-item`, `dialog[open]`). Si cambian, hay que actualizar `pantalla()` en `registroCursor.js`, `nombrePantalla` en `mapa.mjs` y los pasos de `flujo.mjs`.
