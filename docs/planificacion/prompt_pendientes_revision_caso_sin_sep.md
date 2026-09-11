# Prompt — pendientes tras la revisión del caso (sin SEP/PIE) + reescritura del simulador, 2026-09-03

**Para qué es esto:** el 2026-09-03 se revisó el caso de estudio de la prueba de usabilidad (Bloque O) y, la misma fecha, se **reemplazó el motor de probabilidad del prototipo** por una simulación DA-por-colegio con Monte Carlo (Bloque R). Este archivo es un prompt listo para pegar en una sesión nueva.

> **Estado 2026-09-09.** Ya hecho: (a) la documentación de `docs/` está al día; (b) `03_metodologia.tex` recibió las correcciones puntuales de la **Tarea 1 puntos 1 y 3** (descripción del caso sin la cuota del 15 %; fila de septiembre en la Tabla 3.1 + descripción del modelo Monte Carlo, limitaciones y anclas 2018) y el conteo "87/87" → "98 aplicables" (2026-09-08, bitácora Bloque T6); (c) la **Tarea 2** (regenerar `material_prueba_usabilidad_postulacion.pdf`) — hecho, ahora hay `material_prueba_usabilidad_postulacion.md` como fuente regenerable (cuadernillo completo del participante). **Falta (writing-agent):** la reescritura **grande** de la **§3.5** de "prueba formativa N=8" a "estudio comparativo entre-sujetos N≈30", usando §6–§10 de `caso_estudio_prueba_usabilidad_postulacion.md` (que ya incluye hipótesis §8.4, plan de análisis §8.5 y amenazas a la validez §10) y el guion del moderador A/B. **Nota:** la condición B (modo control) **ya está implementada en código** (2026-09-09, bitácora Bloque V — contexto `ModoEstudioContext` + pantalla `/estudio`); §3.5 debe describirla como construida, no como planificada. La **Tarea 3** (bloque de contexto de sesión) también sigue pendiente si aplica.

---

## Contexto del cambio (leer primero)

Fuente de verdad: `docs/planificacion/bitacora_flujo_postulacion_y_resultado.md`, **Bloque O** (revisión del caso) y **Bloque R** (reescritura del simulador), dentro de "4. Registro de cambios"; y `docs/investigacion/caso_estudio_prueba_usabilidad_postulacion.md` (encabezado con las notas de revisión 2026-09-03).

Qué cambió, en dos frases:

1. **El caso (Bloque O):** la familia Muñoz González dejó de tener la cuota de estudiante prioritario/a (SEP) y el PIE. Sus únicas ventajas son tres vínculos legales por establecimiento: hermano/a en Colegio Los Andes, funcionario/a en Colegio Villa del Sol, exalumno/a en Escuela República de Chile. El "colegio en mente" (Colegio San Martín) **no tiene vínculo y pasó a demanda alta**.

2. **El motor (Bloque R):** se eliminó la tabla `probAsignacion` (15 valores escritos a mano, sin base empírica — se rastreó su origen a `archivo/CLAUDE_v2.md` §3) y el umbral de asignación fijo de 65 %. En su lugar, `sae-react/src/utils/simulacionSae.js`: para cada colegio se simula la competencia real por sus cupos (`vacantes` y `postulantesAnterior` reales de `colegios.js`, una multitud sintética con tramos de prioridad muestreados de `PARAMS_POBLACION`, la cuota SEP del 15 % como sub-escuela reservada, y un sorteo aleatorio por colegio); el `%` es Monte Carlo con 1000 iteraciones y semilla fija. El colegio asignado sale de **un** recorrido determinista de la lista con `SEED_CASO`. **El usuario autorizó explícitamente tocar el núcleo para esto.**

Números del caso con el modelo nuevo (4° básico): Los Andes **99 %**, Villa del Sol **99 %**, República **99 %**, Simón Bolívar **50 %**, Los Quillayes **46 %**, **San Martín 26 %**. Si la persona pone San Martín primero, **no queda ahí** y el sistema la asigna a Los Andes en 2.ª preferencia (por el hermano). Diferencia con el modelo viejo: Simón Bolívar / Los Quillayes (antes 60 % < umbral 65 → nunca se asignaban) ahora tienen ~48 % de chance real y **sí pueden quedar** si van arriba en la lista.

Parámetros de población (decisión del usuario, Bloque R): `pSep = 0.55` (anclado al 54,7 % de postulantes prioritarios de 2018), `pHermano = 0.10`, `pFuncionario = 0.02`, `pExalumno = 0.03` (estimaciones). `cuotaSep = 0.15` (ley). Vacantes fijadas en el punto medio de `[min, max]`. Se aplicó un recorte del `%` a `[1, 99]` (un sorteo nunca garantiza ni prohíbe del todo) y se subió `postulantesAnterior` de Simón Bolívar y Los Quillayes a ~1,7× para que no quedaran casi asegurados.

Regla del repo: `proyecto-tesis/` es territorio exclusivo del `writing-agent`. No editar `.tex`/`.bib` desde fuera de ese agente.

---

## Tarea 1 — Sincronizar el Capítulo 3 de la memoria (writing-agent)

Archivo: `proyecto-tesis/capitulos/03_metodologia.tex`.

1. **Descripción del caso de estudio** (párrafo que empieza aprox. "Sobre ese arquetipo se construyó un **caso de estudio** detallado —la familia ficticia Muñoz González—…", ~línea 25). Dice hoy:

   > "…deliberadamente diseñada para que en una sola familia se activen todos los criterios legales de prioridad del SAE: hermano/a matriculado/a en el establecimiento, **condición de estudiante prioritario/a del 15 %**, hijo/a de funcionario/a del colegio y condición de exalumno/a."

   Cambiar a que el caso activa los **tres grupos de prioridad legal por establecimiento** (hermano/a, funcionario/a, exalumno/a), cada uno en un colegio distinto, y que **no** activa las cuotas (ni PIE ni estudiante prioritario/a). Agregar una frase sobre el porqué del diseño: una cuota transversal como la SEP eleva la probabilidad estimada en todos los colegios por igual y borra la tensión que el caso necesita observar; dejar a la familia sin condición transversal hace que el "Colegio San Martín" (sin vínculo, demanda alta) tenga una probabilidad genuinamente baja, que es el punto de observación del *falso riesgo estratégico*.

2. **Reescribir la descripción del simulador** (subsección/párrafo que hoy lo describe como *"lógica Gale-Shapley simplificada"* o *"Gale-Shapley simplificado"* con una **tabla** de probabilidades por nivel y demanda, y que menciona un **umbral de 65 %** para decidir la asignación). Todo eso ya no existe en el código. Reemplazar por la descripción del modelo de Bloque R:

   - Para cada establecimiento de la lista, el prototipo simula la competencia por sus cupos: toma sus vacantes reales y su número de postulantes del año anterior (`colegios.js`), genera esa cantidad de postulantes sintéticos con un tramo de prioridad muestreado de una distribución poblacional documentada, reserva el 15 % de los cupos para la cuota de estudiantes prioritarios/as (modelada como "sub-escuela", siguiendo *matching with contracts*) y adjudica el resto por orden de prioridad legal y un número de sorteo aleatorio independiente por colegio.
   - La cifra que se muestra al usuario es el resultado de repetir esa simulación **1000 veces** (Monte Carlo con semilla fija): la fracción de veces en que la familia obtiene cupo. **No depende del orden de la lista** (propiedad de *strategy-proofness*, verificada por test).
   - El colegio finalmente asignado sale de **una** pasada determinista de la lista en el orden elegido por la persona: propone a su 1.ª opción; si ese sorteo no la sienta, propone a la 2.ª; y así.
   - **Limitaciones declaradas** (ya listadas en el encabezado del archivo `simulacionSae.js` y en `mapa_resultados_caso_munoz_gonzalez.md`): no es la Aceptación Diferida multi-colegio completa (los demás postulantes se modelan como demanda fija de cada colegio, no como agentes con listas propias que se desplazan); no modela la cuota PIE ni la de alta exigencia académica; no modela la ronda complementaria. Los parámetros `pHermano`, `pFuncionario`, `pExalumno` son estimaciones de diseño; solo `pSep` está anclado a cifras reales (54,7 % de postulantes prioritarios en 2018, `investigacion_algoritmo_sae.md` §6). Una calibración con microdatos del SAE queda fuera del alcance de la memoria.
   - Anclar el orden de magnitud a las cifras reales del proceso 2018 (`investigacion_algoritmo_sae.md` §6): 59,2 % asignado a su 1.ª preferencia, 82,5 % a alguna preferencia de su lista, 8,9 % sin asignar en la ronda principal.

   Encuadre: es un **modelo del prototipo con fines didácticos**, contrastado explícitamente con la Aceptación Diferida real descrita en `investigacion_algoritmo_sae.md` §3.1. Los parámetros de población son un supuesto metodológico documentado.

3. **Cronología (Tabla 3.1)** si corresponde: se puede añadir una fila de septiembre 2026 que resuma (a) la revisión del caso (familia sin cuota SEP; el "colegio en mente" con demanda alta y probabilidad baja) y (b) el reemplazo del proxy tabular por la simulación DA-por-colegio con Monte Carlo. Redacción a criterio del writing-agent; no adelantar resultados de la prueba (los Cap. 5–6 siguen pendientes por diseño).

4. **Tarea de "predecir el resultado"** (§3.5 / Fase 4, si la memoria la describe): el prototipo ahora muestra la **asignación estimada en el paso 2 y 3** (recuadro "Con este orden, ¿dónde quedarías?"), así que la predicción "a ciegas" antes de ver `/seguimiento` ya no aplica. Reformular como: se pide a la persona que compare el resultado real con lo que la página le venía anticipando. Detalle en `bitacora_flujo_postulacion_y_resultado.md` Bloque Q.

Ninguna cifra de la matriz del plan (87/87, 22 categorías) cambia; no se creó sección nueva. Compilar con `latexmk main.tex` y revisar `build/main.log`/`main.blg` por citas rotas.

## Tarea 2 — Regenerar `material_prueba_usabilidad_postulacion.pdf`

Archivo: `docs/investigacion/material_prueba_usabilidad_postulacion.pdf` (versión del 2026-08-13, ~45 KB). Desactualizado en:
1. La **tarjeta de familia** y las instrucciones al participante todavía dicen que la familia es prioritaria por ingresos y que Sofía tiene PIE — ya no aplica.
2. La **postulación familiar en bloque**: el prototipo ahora aclara que en la sesión se completa **solo la postulación de Sofía** (la de Mateo iría por separado). Alinear con `guion_participante_prueba_postulacion.md` v2 (ya actualizado): la tarea es hacer la lista de Sofía e *indicar* que Mateo también postula.
3. Cualquier número: San Martín ahora muestra **≈26 %**, no 28 % ni 90 %.

Su fuente probable es `docs/investigacion/guion_participante_prueba_postulacion.md`, que **ya está actualizado** (v2, sin SEP/PIE) y del que se generó `docs/investigacion/guion_participante_prueba_postulacion.pdf`. Si el material se armó solo desde ese `.md`, basta con regenerarlo. Si combina otras fuentes (portada, consentimiento, cuestionario impreso), revisar cada parte contra la revisión 2026-09-03 antes de regenerar.

## Tarea 3 (fuera del repo) — Bloque de contexto de sesión

El bloque "Caso de la familia Muñoz González (el que se testea con usuarios)" que aparece como contexto de sesión (no es un archivo del repositorio; está en la configuración del harness/Claude Code) todavía dice *"San Martín → nivel 2 (SEP), 90 %"* y describe a la familia como prioritaria. Actualizarlo a: familia sin SEP/PIE; el prototipo ya no usa la tabla `probAsignacion` sino una simulación DA-por-colegio con Monte Carlo (`simulacionSae.js`); San Martín demanda alta → **≈26 %**; con San Martín 1.º la asignación cae en Colegio Los Andes (2.ª opción, por hermano/a, **≈99 %**).

---

## Estado del código (referencia, ya hecho — no re-hacer)

- `sae-react/src/utils/simulacionSae.js` (**nuevo**): motor de simulación DA-por-colegio + Monte Carlo. Exporta `PARAMS_POBLACION`, `ITERACIONES_MONTE_CARLO` (1000), `SEED_CASO` (20260903), `mulberry32`, `vacantesDeNivel`, `tramoFamiliaEnColegio`, `simularCupo`, `probabilidadCupo`, `TRAMO_SIN_PRIORIDAD`.
- `sae-react/src/utils/asignacion.js` (**reescrito — cambio de núcleo, autorizado por el usuario**): se eliminó `probAsignacion` y el umbral 65. `calcularResultado` ahora usa `probabilidadCupo` (para el `%` por colegio) y `simularCupo` en una pasada determinista con `SEED_CASO` (para elegir el colegio asignado). Nuevo helper `probPorcentaje(pRaw)` con recorte a `[1, 99]`. `nivelPrioridadEnColegio` / `prioridadLabels` sin cambios.
- `sae-react/src/pages/PostulacionPage.jsx` y `ColegioPage.jsx`: consumidores migrados a `probabilidadCupo` / `probPorcentaje` / `tramoFamiliaEnColegio` / `TRAMO_SIN_PRIORIDAD`.
- `sae-react/src/data/colegios.js`: Colegio San Martín `demanda: 'alta'` (+ `postulantesAnterior` y vacantes ajustados, Bloque O); `postulantesAnterior` de Simón Bolívar y Los Quillayes subido a ~1,7× la vacante (Bloque R).
- `sae-react/tests/flujo-postulacion.test.js`: reescrito (14 tests). Snapshots de `%` (99/99/99/50/46/26), tests de propiedad (prioridad ≥ 90; San Martín < 40; media 30–65), strategy-proofness, determinismo, escenario clave (San Martín 1.º → Los Andes idx 2), y guardarraíl de regresión sobre `PARAMS_POBLACION` / `ITERACIONES_MONTE_CARLO` / `SEED_CASO`.
- `npm run lint` (0/0), `npm run build` (limpio), `npm test` (14/14) — verificado 2026-09-03. Verificado end-to-end en navegador.
- `docs/` al día: `caso_estudio_prueba_usabilidad_postulacion.md` (+ PDF), `guion_moderador_prueba_usabilidad.md` (+ PDF), `guion_participante_prueba_postulacion.md` (+ PDF), `bitacora_flujo_postulacion_y_resultado.md` (Bloques O, P, Q, R; sec. 6 nº 9 resuelta), `mapa_resultados_caso_munoz_gonzalez.md` (reescrito para el modelo probabilístico), `CONTEXTO_CLAUDE_CODE.md` (§8 reescrita + §27), `CLAUDE.md`.
