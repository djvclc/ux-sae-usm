# Prompt — pendientes tras la revisión del caso (sin SEP/PIE), 2026-09-03

**Para qué es esto:** el 2026-09-03 se revisó el caso de estudio de la prueba de usabilidad y se cambió el flujo del prototipo. La documentación de `docs/` ya está al día; falta lo de `proyecto-tesis/` (writing-agent) y una regeneración de PDF. Este archivo es un prompt listo para pegar en una sesión nueva.

---

## Contexto del cambio (leer primero)

Fuente de verdad: `docs/planificacion/bitacora_flujo_postulacion_y_resultado.md`, **Bloque O** y **Bloque N** (secciones dentro de "4. Registro de cambios"), y `docs/investigacion/caso_estudio_prueba_usabilidad_postulacion.md` (encabezado con la nota de revisión 2026-09-03).

Qué cambió, en una frase: **la familia Muñoz González del caso de estudio dejó de tener la cuota de estudiante prioritario/a (SEP) y el PIE.** Ahora sus únicas ventajas son tres vínculos legales por establecimiento: hermano/a en Colegio Los Andes, funcionario/a en Colegio Villa del Sol, exalumno/a en Escuela República de Chile. El "colegio en mente" (Colegio San Martín) **no tiene vínculo y pasó a demanda alta**, así que su probabilidad estimada es **28 %** (nivel 5 = sorteo, demanda alta) — muy por debajo de Los Andes (92 %). Si la persona pone San Martín primero, **no queda ahí** y el sistema la asigna a Los Andes en 2.ª preferencia.

Por qué: con la cuota SEP activa, `nivelPrioridadEnColegio` daba nivel ≤ 2 en los seis colegios y `probAsignacion(2, ·)` ≥ 88 % ≥ el umbral de asignación (65 %), así que el colegio N.°1 de la lista **siempre** quedaba asignado y el caso no producía tensión. Además, tratar la cuota SEP como si fuera un rango casi seguro es incorrecto en el mecanismo: es una reserva del 15 % de cupos, modelada como "sub-escuela", y está sobre-suscrita (54,7 % de los postulantes en 2018 para una cuota del 15 % — `docs/investigacion/investigacion_algoritmo_sae.md` §3.2 y §6). **No se recalibró la tabla `probAsignacion`** (núcleo protegido): la solución fue quitar SEP del caso y subir San Martín a demanda alta.

Regla del repo: `proyecto-tesis/` es territorio exclusivo del `writing-agent`. No editar `.tex`/`.bib` desde fuera de ese agente.

---

## Tarea 1 — Sincronizar el Capítulo 3 de la memoria (writing-agent)

Archivo: `proyecto-tesis/capitulos/03_metodologia.tex`.

1. **Descripción del caso de estudio** (párrafo que empieza aprox. "Sobre ese arquetipo se construyó un **caso de estudio** detallado —la familia ficticia Muñoz González—…", ~línea 25). Dice hoy:

   > "…deliberadamente diseñada para que en una sola familia se activen todos los criterios legales de prioridad del SAE: hermano/a matriculado/a en el establecimiento, **condición de estudiante prioritario/a del 15 %**, hijo/a de funcionario/a del colegio y condición de exalumno/a."

   Cambiar a que el caso activa los **tres grupos de prioridad legal por establecimiento** (hermano/a, funcionario/a, exalumno/a), cada uno en un colegio distinto, y que **no** activa las cuotas (ni PIE ni estudiante prioritario/a). Agregar una frase sobre el porqué del diseño: una cuota transversal como la SEP eleva la probabilidad estimada en todos los colegios por igual y borra la tensión que el caso necesita observar; dejar a la familia sin condición transversal hace que el "Colegio San Martín" (sin vínculo, demanda alta) tenga una probabilidad genuinamente baja, que es el punto de observación del *falso riesgo estratégico*.

2. **Frase sobre la estimación de probabilidad** (mismo párrafo, "Cada establecimiento del caso tiene un estado de vacantes y una demanda del año anterior definidos, que alimentan la estimación de probabilidad por colegio."). Menor: el código (`src/utils/probAsignacion`) usa la **categoría de demanda** (alta/media/baja) y el **nivel de prioridad**, no el número de vacantes directamente. Ajustar el texto para que no afirme más de lo que hace el modelo, o dejarlo genérico ("la demanda y la prioridad de la familia en ese colegio").

3. **Cronología (Tabla 3.1)** si corresponde: se puede añadir una fila de septiembre 2026 que resuma la revisión del caso (familia sin cuota SEP; el "colegio en mente" con demanda alta y probabilidad baja para poder observar la reacción a *no* obtenerlo). Redacción a criterio del writing-agent; no adelantar resultados de la prueba (los Cap. 5–6 siguen pendientes por diseño).

4. **Tarea de "predecir el resultado"** (§3.5 / Fase 4, si la memoria la describe): el prototipo ahora muestra la **asignación estimada en el paso 2 y 3** (recuadro "Con este orden, ¿dónde quedarías?"), así que la predicción "a ciegas" antes de ver `/seguimiento` ya no aplica. Reformular como: se pide a la persona que compare el resultado real con lo que la página le venía anticipando — es un mejor indicador de comprensión. Detalle en `bitacora_flujo_postulacion_y_resultado.md` Bloque Q.

Ninguna cifra de la matriz del plan (87/87, 22 categorías) cambia. `asignacion.js` no se tocó. Compilar con `latexmk main.tex` y revisar `build/main.log`/`main.blg` por citas rotas.

## Tarea 2 — Argumentar por escrito de dónde salen los porcentajes de `probAsignacion` (writing-agent)

Pedido del usuario (2026-09-03), registrado en la bitácora sec. 6 nº 9. Hoy la tabla `probAsignacion` (15 valores, en `sae-react/src/utils/asignacion.js`) **no tiene una justificación empírica**: se rastreó su origen a `archivo/CLAUDE_v2.md` §3, donde se definieron rangos aproximados a ojo ("alta demanda + nivel 1-2: 90 %", "media + nivel 5: 60 %", "baja: 95-99 %") etiquetados como "Gale-Shapley simplificado"; esos rangos se concretaron en 15 valores finos en `archivo/prototipo_SAE_v2.html` y se copiaron al port React sin cambios.

Redactar, en el Capítulo 3 (o donde el writing-agent lo estime), un párrafo que:

- Aclare que la cifra que muestra el prototipo es un **proxy didáctico de los resultados de la Aceptación Diferida**, no un modelo probabilístico ni una corrida del algoritmo real. Responde: "dado tu nivel de prioridad legal en este colegio y qué tan disputado está, ¿qué tan probable es que el mecanismo te siente acá?".
- Explicite las **restricciones de construcción**: la tabla decrece de nivel 1→5 (más prioridad, más probabilidad) y de demanda baja→alta (menos disputa, más probabilidad). Eso codifica lo que el SAE sí recompensa.
- Ancle el orden de magnitud a las **cifras reales del proceso 2018** (`investigacion_algoritmo_sae.md` §6): 59,2 % asignado a su 1.ª preferencia, 82,5 % a alguna preferencia de su lista, 8,9 % sin asignar en la ronda principal. El centro de masa de un caso típico (prioridad media, demanda media) cae en la banda 55–75; las colas hacia ~28 (sin prioridad, muy disputado) y ~98 (prioridad fuerte, holgado).
- Nombre explícitamente lo que el modelo **no** representa: la cercanía territorial (no es criterio de prioridad en el SAE real — `investigacion_algoritmo_sae.md` §3.3), el apilamiento de varias prioridades (el prototipo aplica solo la mejor), el conteo real de asientos y las listas de los demás postulantes, y la ronda complementaria.
- Si el writing-agent lo cree necesario, dejar como limitación declarada que los valores exactos son estimaciones de diseño, no medidos, y que una calibración con microdatos del SAE queda fuera del alcance de la memoria.

## Tarea 3 — Regenerar `material_prueba_usabilidad_postulacion.pdf`

Archivo: `docs/investigacion/material_prueba_usabilidad_postulacion.pdf` (versión del 2026-08-13, ~45 KB). Dos cosas desactualizadas:
1. La **tarjeta de familia** y las instrucciones al participante todavía dicen que la familia es prioritaria por ingresos y que Sofía tiene PIE — eso ya no aplica.
2. La **postulación familiar en bloque**: el prototipo ahora aclara que en la sesión se completa **solo la postulación de Sofía** (la de Mateo iría por separado). Si el material dice "postula a tus dos hijos" a secas, alinearlo con `guion_participante_prueba_postulacion.md` v2 (ya actualizado): la tarea es hacer la lista de Sofía e *indicar* que Mateo también postula, para que el sistema intente dejarlos juntos.

Su fuente probable es `docs/investigacion/guion_participante_prueba_postulacion.md`, que **ya está actualizado** (v2, sin SEP/PIE) y del que se generó `docs/investigacion/guion_participante_prueba_postulacion.pdf`. Si `material_prueba_usabilidad_postulacion.pdf` se armó solo desde ese `.md`, basta con regenerarlo (pandoc). Si combina otras fuentes (portada, consentimiento, cuestionario impreso), revisar cada parte contra la revisión 2026-09-03 antes de regenerar.

## Tarea 4 (fuera del repo) — Bloque de contexto de sesión

El bloque "Caso de la familia Muñoz González (el que se testea con usuarios)" que aparece como contexto de sesión (no es un archivo del repositorio; está en la configuración del harness/Claude Code) todavía dice *"San Martín → nivel 2 (SEP), 90 %"* y describe a la familia como prioritaria. Actualizarlo a: familia sin SEP/PIE; San Martín demanda alta → nivel 5 (sorteo) → 28 %; con San Martín 1.º la asignación cae en Colegio Los Andes (2.ª opción, por hermano/a, 92 %).

---

## Estado del código (referencia, ya hecho — no re-hacer)

- `sae-react/src/data/colegios.js`: Colegio San Martín `demanda: 'alta'` (+ `postulantesAnterior` y vacantes ajustados).
- `sae-react/src/pages/PostulacionPage.jsx`: `CASO_EJEMPLO` con `prioritario: false, pie: false`; `CASO_EJEMPLO_SIN_SEP` y el doble botón eliminados; `useEffect` de scroll-al-tope al cambiar `paso`/`alumnoOk`/`confirmado`.
- `sae-react/tests/flujo-postulacion.test.js`: reescrito al caso sin SEP; el guardarraíl "núcleo protegido: la tabla probAsignacion mantiene sus valores" quedó **idéntico** (la tabla no se tocó).
- `npm run lint`, `npm run build`, `npm test` (12/12) limpios.
- `docs/`: `caso_estudio_prueba_usabilidad_postulacion.md` (+ PDF), `guion_moderador_prueba_usabilidad.md` (+ PDF), `guion_participante_prueba_postulacion.md` (+ PDF), `bitacora_flujo_postulacion_y_resultado.md` (Bloques O, P, Q), `CONTEXTO_CLAUDE_CODE.md` (§26), `CLAUDE.md` — todos al día.
- `docs/planificacion/mapa_resultados_caso_munoz_gonzalez.md` — mapa del espacio de resultados según el orden de la lista + aclaración de que describe el modelo del prototipo (`calcularResultado`), no la Aceptación Diferida real. Insumo para la Tarea 2 (argumentar los porcentajes) y para el diseño de tareas de la prueba.
