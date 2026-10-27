# Prueba de usabilidad — material DEFINITIVO

Material para conducir las sesiones con participantes. El texto que se lee en voz alta es el de `docs/investigacion/guion_lectura_prueba.md`, **aprobado por la profesora guía** (2026-10-27); no se cambia sin su visto bueno.

| Archivo | Quién lo usa | Cuándo | Cuántas copias |
|---|---|---|---|
| `1_GUION_MODERADOR.pdf` | Moderador | Toda la sesión. Incluye la preparación, el guion aprobado con lo que hay que hacer en cada momento y el **registro de turnos** (última página) | 1 (el registro de turnos sirve para todo el estudio) |
| `2_PLANILLA_RESPUESTAS.pdf` | Moderador | Durante la sesión, para anotar respuestas y observación | 1 por participante (2 hojas) |
| `3_INFORMACION_Y_CONSENTIMIENTO.pdf` | Participante | Se puede **mandar antes** de la sesión; se firma en la bienvenida | 1 por participante |
| `4_TARJETAS_PARTICIPANTE.pdf` | Participante | Durante la sesión: "La historia" (sección 2) y "Para responder" (secciones 4 y 5). **No mandarlas antes**: revelan el caso | 1 juego, reutilizable |

Las fuentes HTML están en `fuentes/`. Para regenerar un PDF (Chrome en Windows, desde esta carpeta, en git-bash):

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --no-pdf-header-footer --print-to-pdf="$(cygpath -w "$PWD/1_GUION_MODERADOR.pdf")" "file:///$(cygpath -m "$PWD/fuentes/1_GUION_MODERADOR.html")"
```

Documento de respaldo (respuestas esperadas, qué mide cada parte, decisiones): `docs/investigacion/instrucciones_prueba_usabilidad.md` v11.
