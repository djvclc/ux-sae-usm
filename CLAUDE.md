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
- `docs/planificacion/plan_mejora_sae.md` — matriz de 22 secciones e incisos a–t del plan de mejora; origen de los códigos de trazabilidad `S<sección>-<inciso>` usados en comentarios del código. Estado: 100 % (87/87 puntos aplicables; S22 cerrada el 2026-08-04).
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

- Prototipo: v4.5, todas las rutas implementadas (incluido `/comparador`, `/proceso` y tour guiado) y plan al 100 % (87/87 aplicables tras añadir y cerrar S22 el 2026-08-04). Páginas internas: `/cumplimiento`, `/roadmap`, `/notas`.
- Sincronización código↔memoria S22 (2026-08-04, completa): cifras del plan actualizadas a **87/87 (100 %) y 22 categorías** en cap. 03 (nueva fila agosto semana 1 en la cronología —rediseño del flujo de postulación: 6 errores de fidelidad corregidos, comprobante descargable, reordenamiento por arrastre, borrador, postulación familiar en bloque, orientación estratégica— y "Estado actual" con 87/87), cap. 04 (22 categorías/87 puntos; dos categorías añadidas en agosto) y cap. 06 (matriz de 87 puntos). Cap. 00 no citaba cifras de la matriz (sin cambios). Se conservan como historia la fila de junio (62 puntos) y la ampliación intermedia a 21 categorías/72 puntos en la cronología. PDF recompilado sin errores (`latexmk main.tex`, 0 citas indefinidas; solo warnings preexistentes de `empty year` en el .blg) — queda resuelto el pendiente de recompilación de la sincronización anterior. Nota: en shell externo bibtex requirió `BIBINPUTS` explícito hacia `bibliografia/`; desde VS Code el `.latexmkrc` lo resuelve solo.
- Sincronización código↔memoria (2026-08-04, completa): cifra de trazabilidad 72/72 (100 %) y estado actual reflejados en toda la memoria — cap. 00 (iteraciones "mayo y agosto de 2026"), cap. 03 (cronología ampliada con filas julio semana 5 —refactor vitrina v2— y agosto semana 1 —/proceso y ampliación de la matriz a 21 categorías/72 puntos—; "Estado actual" con cuatro funcionalidades adicionales y 72/72; nota de commits generalizada), cap. 04 (21 categorías, 72/72, lista incluye /proceso) y cap. 06 (matriz de 72 puntos). Referencias históricas a 62 puntos en cap. 03 (fila de junio) se conservan deliberadamente. (El pendiente de recompilación de esta entrada quedó resuelto el 2026-08-04, ver entrada S22.)
- Memoria: Capítulos 0–4 redactados; Capítulos 5 y 6 **pendientes por diseño** hasta ejecutar la validación (Sección 3.5). No completarlos sin datos de validación.
- Detalle histórico de especificaciones del prototipo HTML v1: `archivo/CLAUDE_v2.md` (solo referencia).
- Refactor vitrina colegios (2026-07-30): `colegios.js` migrado a esquema v2 (vacantes como array con rango min/max, postulantesAnterior, jornada, copago por nivel; nuevos campos rbd, director, dependencia, orientacion, categoriaDesempeno, categoriaAnio, simceAnio, gseComparacion, gseNumColegios). `ColegioPage.jsx` actualizado con identidad institucional en hero, tabla de vacantes rica, sección "Categoría de desempeño" con escala 4 pasos, comparación SIMCE GSE con badge, nota de procedencia + descargables simbólicos. `InicioPage` añade selector "Ordenar por" (SIMCE/vacantes/distancia/demanda). `ComparadorPage` y `SeguimientoPage` actualizados para schema v2. Build limpio post-refactor.
- Nueva investigación (2026-07-30): `docs/investigacion/investigacion_vitrina_sae.md` — recorrido en vivo de la vitrina oficial (Admisión 2027): flujos, inventario de información de la ficha y feedback accionable para `InicioPage`/`ColegioPage` (adoptar: postulantes año anterior, rangos de vacantes, categoría de desempeño, pago por nivel; conservar: CTA integrada, comparador, secciones simultáneas).
- Nueva investigación (2026-07-30): `docs/investigacion/investigacion_algoritmo_sae.md` — funcionamiento detallado del algoritmo DA del SAE (paper Correa et al.), argumentos de implementación, cifras 2018 y debate/reforma 2026. Fuente de respaldo para memoria y prototipo.
- Nueva investigación (2026-08-04): `docs/investigacion/investigacion_paso_a_paso_sae.md` — recorrido de las 5 etapas del menú "Paso a paso" del sitio oficial (Postulación, Asignación, Resultados, Periodo Complementario, Matrícula), calendario Admisión 2027 verificado, hallazgos UX y 7 recomendaciones de implementación.
- Nueva investigación (2026-08-04): `docs/investigacion/analisis_flujo_postulacion.md` — análisis profundo del flujo de postulación: auditoría de `PostulacionPage.jsx` (6 errores factuales detectados E1–E6, p. ej. restricción regional y tope de 8 colegios inexistentes en el SAE real), benchmark (plataforma oficial, NYC MySchools, buenas prácticas multipaso, postulación en bloque) y plan en 3 fases con prompt de implementación incluido (§6, propuesta de sección S22 en el plan de mejora). Implementado el 2026-08-04 (ver entrada S22 más abajo).
- Vista "El proceso paso a paso" (2026-08-04): nueva ruta `/proceso` con `ProcesoPage.jsx` — línea de tiempo de 5 etapas (Postulación, Asignación, Resultados, Periodo Complementario, Matrícula) con estado calculado por fecha, divulgación progresiva, 5 reglas de alto riesgo como avisos prominentes, tabla comparativa Principal vs. Complementario, checklist de matrícula, calendario Admisión 2027 como tabla HTML accesible. Enlace en Navbar y paso en tour guiado. Build limpio. (S21, 10 puntos)
- Rediseño del flujo de postulación (2026-08-04, S22, 15 puntos): `PostulacionPage.jsx` reescrita según `analisis_flujo_postulacion.md` — Fase 1 fidelidad: E1 región como filtro (no restricción), E2 sin tope de 8 colegios (recomendación de al menos 6, corregido también en `InicioPage`, `ColegioPage`, `ComparadorPage`, `AlgoritmoPage`, `CalendarioPage`, `ChatAyuda`, `TourContext`), E3 cierre 27 de agosto 14:00, E4 resultados 15–21 de octubre de 2026, E5 desempate aleatorio por colegio, E6 orden real de prioridades (PIE → hermanos → 15 % reserva → funcionario → exalumno), comprobante .txt descargable con folio/lista/fechas. Fase 2: drag-and-drop nativo + botones ↑↓ con anuncio `aria-live`, borrador visible ("Borrador guardado" + aviso de reanudación), enlaces "Editar" por sección en paso 3, ColegioAnalisis con postulantes año anterior y vacantes por nivel (esquema v2), confirmación explícita del nivel al vincular. Fase 3: opción "¿Postulas a hermanos?" (postulación en bloque simulada), consejo estratégico DA + aviso lista corta/alta demanda, bloque "¿Y si no quedo en ninguna?" con enlaces a `/proceso`. CSS S22 en `index.css`. Lint y build limpios.
- Saneamiento de lint (2026-08-04): la base tenía 15 errores preexistentes de ESLint (react-hooks v6: `set-state-in-effect`, `refs`; `no-unused-vars`; `no-undef` en `vite.config.js`; regla `react/no-danger` inexistente). Corregidos sin cambios de comportamiento: cargas de localStorage movidas a inicializadores perezosos de `useState` (`InicioPage`, `ColegioPage`, `PerfilPage`, `PostulacionPage`), supresiones justificadas en `GuidedTour`/contextos (react-refresh), limpieza de variables sin uso y `import.meta.dirname` en `vite.config.js`. `npm run lint` queda en 0 errores / 0 warnings.
