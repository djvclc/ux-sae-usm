# CLAUDE.md — Proyecto USM: Prototipo UX del SAE + Memoria de título

## Qué es este proyecto

Repositorio con dos subproyectos activos y su documentación de respaldo:

| Carpeta | Contenido | Agente responsable |
|---|---|---|
| `sae-react/` | Aplicación React funcional: prototipo de mejora UX del Sistema de Admisión Escolar (SAE) del Mineduc Chile | `code-agent` |
| `proyecto-tesis/` | Memoria de título en LaTeX: "Mitigación de Sesgos en IA: Análisis del Sistema de Admisión Escolar en Chile" (UTFSM) | `writing-agent` |
| `docs/` | Investigación y planificación que fundamentan ambos | — |
| `archivo/` | Versiones superadas (prototipos HTML v1/v2, docs antiguos). No modificar | — |

El prototipo demuestra cómo aplicar transparencia algorítmica al SAE; la memoria documenta el proceso. Ambos comparten cifras y terminología: **mantenerlos sincronizados es la regla más importante del repo.**

## Documentos de referencia (leer antes de tareas grandes)

- `docs/CONTEXTO_CLAUDE_CODE.md` — contexto técnico del prototipo React (parcialmente desactualizado: `/comparador` ya está implementado).
- `docs/planificacion/plan_mejora_sae.md` — matriz de 20 secciones e incisos a–t del plan de mejora; origen de los códigos de trazabilidad `S<sección>-<inciso>` usados en comentarios del código. Estado: 100 % (62/62 puntos aplicables; 15.2 cerrado el 2026-07-21).
- `docs/investigacion/` — informe heurístico Fondecyt N.º 1250492 (baseline: 51 % sitio informativo, 61 % plataforma, 0 % en transparencia e inclusión), revisión de 96 papers sobre transparencia algorítmica y resumen ejecutivo.

## Reglas globales

1. **No cambiar el rumbo.** Stack, arquitectura, estructura de capítulos y estilo de citas ya están decididos. Los agentes implementan y mejoran dentro de lo definido; no proponen migraciones ni rediseños.
2. **Separación estricta:** el trabajo de código va en `sae-react/` (code-agent), el de redacción en `proyecto-tesis/` (writing-agent). Ninguno toca el territorio del otro.
3. **No inventar cifras.** Todo número citado debe provenir del informe heurístico, la revisión de literatura, el plan de mejora o el código. Si un cambio de código altera un número citado en la memoria, avisar al usuario.
4. **Trazabilidad:** cambios funcionales en el prototipo llevan comentario en español con su código `S<sección>-<inciso>` del plan.
5. `archivo/` es historia del proyecto: se conserva, no se edita.
6. **Cierre de tarea:** todo agente termina su trabajo actualizando los archivos de contexto afectados — este `CLAUDE.md` (sección "Estado del proyecto"), `docs/CONTEXTO_CLAUDE_CODE.md` y/o `docs/planificacion/plan_mejora_sae.md` — para que la siguiente sesión retome sin re-explorar el repo. Solo se registra lo efectivamente hecho y validado, con fecha; nunca avances proyectados.

## Persona y principios de diseño (vigentes para el prototipo)

- **Persona objetivo:** Daniela González, 35 años, RM/Valparaíso, acceso principal por móvil, alfabetización digital básica-intermedia, percibe el SAE como "tómbola". Necesita que le expliquen la asignación antes de postular.
- **Principios (respaldados por la literatura, ver `NotasPage.jsx`):** divulgación progresiva (Springer & Whittaker), explicabilidad contextualizada (Nefedov), controles interactivos con retroalimentación (Kim; Feddersen), gestión de expectativas, información multidimensional con gráficos (Glazerman).
- **UI:** español chileno con tuteo, lenguaje claro nivel 6° básico, mobile-first 375px, contraste WCAG AA mínimo, paleta institucional Mineduc (azul `#0057B7`, azul claro `#E8F1FB`, verde `#1A7F37`, naranja `#E07B00`, rojo `#C0392B`).

## Comandos de validación

- Prototipo (`sae-react/`): `npm run lint` y `npm run build`. No hay suite de tests; no agregar frameworks de test sin petición explícita.
- Memoria (`proyecto-tesis/`): `latexmk main.tex` (salida en `build/`); revisar `build/main.log` y `main.blg` por citas o referencias rotas.

## Estado del proyecto (julio 2026)

- Prototipo: v4.3, todas las rutas implementadas (incluido `/comparador` y tour guiado) y plan al 100 % (62/62 aplicables). Páginas internas: `/cumplimiento`, `/roadmap`, `/notas`.
- Sincronización código↔memoria: cifra de trazabilidad actualizada a 100 % (62/62) en capítulos 00, 04 y 06 el 2026-07-29; PDF compilado y verificado.
- Memoria: Capítulos 0–4 redactados; Capítulos 5 y 6 **pendientes por diseño** hasta ejecutar la validación (Sección 3.5). No completarlos sin datos de validación.
- Detalle histórico de especificaciones del prototipo HTML v1: `archivo/CLAUDE_v2.md` (solo referencia).
- Refactor vitrina colegios (2026-07-30): `colegios.js` migrado a esquema v2 (vacantes como array con rango min/max, postulantesAnterior, jornada, copago por nivel; nuevos campos rbd, director, dependencia, orientacion, categoriaDesempeno, categoriaAnio, simceAnio, gseComparacion, gseNumColegios). `ColegioPage.jsx` actualizado con identidad institucional en hero, tabla de vacantes rica, sección "Categoría de desempeño" con escala 4 pasos, comparación SIMCE GSE con badge, nota de procedencia + descargables simbólicos. `InicioPage` añade selector "Ordenar por" (SIMCE/vacantes/distancia/demanda). `ComparadorPage` y `SeguimientoPage` actualizados para schema v2. Build limpio post-refactor.
- Nueva investigación (2026-07-30): `docs/investigacion/investigacion_vitrina_sae.md` — recorrido en vivo de la vitrina oficial (Admisión 2027): flujos, inventario de información de la ficha y feedback accionable para `InicioPage`/`ColegioPage` (adoptar: postulantes año anterior, rangos de vacantes, categoría de desempeño, pago por nivel; conservar: CTA integrada, comparador, secciones simultáneas).
- Nueva investigación (2026-07-30): `docs/investigacion/investigacion_algoritmo_sae.md` — funcionamiento detallado del algoritmo DA del SAE (paper Correa et al.), argumentos de implementación, cifras 2018 y debate/reforma 2026. Fuente de respaldo para memoria y prototipo.
