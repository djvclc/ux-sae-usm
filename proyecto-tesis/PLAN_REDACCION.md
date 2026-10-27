# Plan de redacción de la memoria

Estado vivo de la memoria, sección por sección. Lo lee el `writing-agent` **antes** de cada tarea y lo actualiza **al cerrarla**; es la fuente de verdad sobre qué está escrito, qué falta y de dónde sale cada contenido. La definición del agente (`.claude/agents/writing-agent.md`) contiene solo reglas estables; lo que cambia con el proyecto vive aquí.

Leyenda: ✅ vigente · 🔄 escrita, requiere actualización · 🟡 parcial · ⏸ bloqueada (espera datos de la validación) · ❓ espera decisión del autor

Última actualización: 2026-10-27

---

## 1. Orden de escritura

El orden de **lectura** es 0→7. El de **escritura** es otro, porque cada capítulo depende de lo que el anterior fija:

1. **Cap. 3 Metodología**: fija qué se hizo y qué se medirá. Todo lo demás lo cita.
2. **Cap. 4 Propuesta**: el prototipo pantalla por pantalla; se actualiza cuando cambia una pantalla (recapturar con `scripts/capturas_propuesta.mjs`).
3. **Cap. 5 Resultados**: solo lo verificable hoy; los resultados de la validación se agregan cuando existan.
4. **Cap. 2 Marco teórico**: se completa solo si la metodología cita algo que el marco no introduce (p. ej. HAX/PAIR, ❓).
5. **Cap. 1 Introducción**: se ajusta al final a lo que la memoria efectivamente hace (objetivos, estructura).
6. **Caps. 6 y 7**: ⏸ hasta tener datos del estudio comparativo.
7. **Resumen**: al final de cada ronda; resume lo que existe, nunca lo proyectado.

Regla: una sección nunca cita como hecho algo que una sección anterior en este orden todavía no fija.

---

## 2. Índice con estado

Numeración real del PDF (desde el 2026-09-24 el Resumen no lleva número): Introducción = Cap. 1 … Conclusiones = Cap. 7 (desde el 2026-09-28, con la Propuesta como Cap. 4). Las referencias se escriben con `\ref`; etiquetas vigentes: `cap:introduccion|marco|metodologia|propuesta|resultados|discusion|conclusiones`, `sec:que-funciona`, `sec:accesibilidad`, `sec:prop-general|informarse|postular|resultado|control|sintesis`, `fig:prop-inicio|algoritmo|paso1|confirmar|paso2|lista|paso3|resultado|recorrido|control`, `tab:prop-sintesis`, `sec:prototipado-ia`, `sec:fase2`, `sec:fase3-caso`, `sec:fase3-marcos`, `sec:validacion`, `sec:estudio-comparativo`, `sec:res-diagnostico|prototipo|sitio-oficial|pendientes`, `sec:limitaciones`, `tab:iteraciones`, `tab:instrumento`.

### Cap. 0 — Resumen (`00_resumen.tex`)
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| Resumen | ✅ | (2026-10-21: "mayo y octubre", estudio comparativo, menciona la Propuesta) | Caps. 3–4 ya escritos |

### Cap. 1 — Introducción (`01_introduccion.tex`)
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| Contexto y problema | 🟡 | Pregunta de investigación: "mejore **significativamente**" sugiere significancia estadística, pero el plan de análisis (N≈15/condición) es principalmente descriptivo → decisión del autor (sec. 4, n.º 5). Línea 11: "han demostrado, en decenas de estudios empíricos" → atenuar o respaldar con la revisión | Cap. 3 §3.4.1 |
| Objetivos específicos | ❓ | **Obj. 4** dice "primero como maqueta de alta fidelidad y posteriormente como aplicación web", pero el Cap. 3 (`sec:fase2`) declara la maqueta Figma como un estudio **distinto**, no un resultado de esta memoria → contradicción. **Obj. 5** dice "claridad, confianza y utilidad percibida" y el instrumento v11 mide comprensión (principal), satisfacción con la tarea (ASQ) y, exploratorias, confianza y justicia; decidir si se alinea y si se agrega "con énfasis en el flujo de postulación" (`docs/planificacion/plan_cambio_foco_postulacion.md`) | decisión del autor |
| Estructura de la memoria | ✅ | (2026-09-28: presenta la Propuesta y el estudio comparativo) | — |

### Cap. 2 — Marco teórico (`02_marco_teorico.tex`)
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| 2.1–2.6 | ✅ | — | `referencias.bib` |
| (posible) marcos HAX / PAIR | ❓ | ¿Se citan en el Cap. 2 o solo como insumo en el Cap. 3 §3.3? Hoy: solo Cap. 3, sin clave bib | `docs/investigacion/investigacion_ux_guide_ai_systems.md` |

### Cap. 3 — Metodología (`03_metodologia.tex`)
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| Intro + Fase 1 + Fase 2 | ✅ | — | — |
| 3.3 Caso de estudio y persona | ✅ | (2026-10-21: catálogo de 6 con los 3 vínculos nombrados; grupo familiar, en bloque/por separado, lista única como propuesta, ventana de confirmación; cifras del simulador 99 / 46–50 / 26 y acotamiento [1, 99]) | `caso_estudio…md` §1–§3; bitácora Bloques O/R; `CONTEXTO_CLAUDE_CODE.md` §54–§59; `investigacion_algoritmo_sae.md` |
| 3.3 Marcos de diseño humano-IA | ✅ | — | `investigacion_ux_guide_ai_systems.md` |
| 3.3 Cronología (Tabla 3.1) | ✅ | Mayo–octubre. 2026-10-21: + grupo familiar y legibilidad (sept.), flujo + panel "Te explicamos" (oct. 1–2) y una sola familia de ejemplo (oct. 3). Siguiente iteración → nueva fila | bitácora Bloques S–Z22; `CLAUDE.md` Estado; `estado_rama_refactor_panel_explicativo.md` |
| 3.3 Estado actual del prototipo | ✅ | — | — |
| 3.4 Fase 4 (`sec:validacion`): reevaluación heurística (5 pasos) | ✅ | (Intro reescrita para presentar los dos componentes) | — |
| 3.4.1 Estudio comparativo (`sec:estudio-comparativo`) | ✅ | Reescrita el 2026-10-21 al **instrumento v11**; desde el 2026-10-27 declara el guion **aprobado por la profesora** y el material definitivo (el aviso de lista corta se mantiene; la 2.ª persona ciega clasifica con la planilla o transcripciones anónimas; consentimiento descrito). Si el guion cambia, actualizar aquí. Pendientes que el texto ya declara: pauta de clasificación, respaldo bibliográfico de confianza/justicia de 1 ítem, piloto, comité de ética | `instrucciones_prueba_usabilidad.md` v11; `guion_lectura_prueba.md` (aprobado); `docs/prueba_definitiva/`; `conclusiones_posibles_prueba_usabilidad.md` |

### Cap. 4 — Propuesta (`04_propuesta.tex`)
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| 4.1–4.6 (visión general, informarse, flujo de postulación, resultado, condición de control, síntesis) | ✅ | Creado el 2026-09-28; **reescrito el 2026-10-21** para la interfaz flujo + panel "Te explicamos" con 13 capturas (páginas informativas a 390 px; flujo y resultado a 1280 px, A y B). Si cambia una pantalla del prototipo: recapturar y revisar el texto de esa sección | capturas; bitácora; `sec:res-diagnostico`; `sec:que-funciona`; `sec:fase3-marcos` |

### Cap. 5 — Resultados (`05_resultados.tex`)
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| 5.1 Diagnóstico heurístico | ✅ | — | diagnóstico heurístico (sin identificar) |
| 5.2 Estado de implementación | ✅ | (2026-09-24: condición de control y tests de determinismo/independencia de posición) | bitácora Bloque V; `sae-react/tests/` |
| 5.3 Sitio oficial | ✅ | — | — |
| 5.4 Resultados pendientes | ✅ | (2026-09-24: apunta al estudio comparativo) | `sec:estudio-comparativo` |

### Cap. 6 — Discusión (`06_discusion.tex`) ⏸
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| 6.1 Brechas cerradas por el sitio oficial | ✅ (preliminar) | — | — |
| 6.2 Preguntas de la discusión completa | 🔄 | Pregunta 2 → formular en términos de H1–H5 del estudio comparativo (v11); dice "prueba de usabilidad" y atribuye a `springerwhittaker2019/2020` un hallazgo sobre justicia percibida no verificado (ver ficha en `bibliografia_anotada.md`) | `caso_estudio…md` §8.4 |
| 6.3 Limitaciones (`sec:limitaciones`) | ✅ | (2026-09-27: + moderador no ciego, un solo desenlace, muestra por conveniencia, simulador y control como aproximaciones; 2026-10-21: moderador no ciego según v11, + escritorio y no móvil) | `caso_estudio…md` §10; `instrucciones_prueba_usabilidad.md` v11 |
| Discusión completa | ⏸ | Requiere datos | — |

### Cap. 7 — Conclusiones (`07_conclusiones.tex`) ⏸

**Formato fijado (2026-09-27):** la versión final responde objetivo específico por objetivo específico (OE1…OE6 del Cap. 1), y cierra con aportes, limitaciones y trabajo futuro.

| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| Lo que puede afirmarse | ✅ | — | — |
| Lo que falta | 🔄 | Punto 2 → "ejecutar el estudio comparativo A/B (N≈30)" | Cap. 3 §3.4 |
| Líneas de trabajo futuro | ⏸ | Roadmap R1–R6 disponible | `comparativa_flujo_postulacion_v_final.md` §6 |

---

## 3. Hechos canónicos (verificar aquí antes de escribir una cifra)

| Hecho | Valor | Fuente |
|---|---|---|
| Diagnóstico heurístico | 51 % sitio informativo · 61 % plataforma · 0 % transparencia y apertura · 0 % inclusión · desglose 55/57/22 | diagnóstico heurístico (marzo 2026). **Confidencial:** en la memoria no se identifica (ver `CLAUDE.md` regla 7) |
| Revisión de literatura | 96 publicaciones, 2017–2025 | `docs/investigacion/` |
| Matriz del plan | 102 filas, 4 no aplican → **98 aplicables**; se escribe "la totalidad de los puntos aplicables fue abordada a nivel de código". **No usar** 87/87, 62/62, 72/72 como vigentes | `plan_mejora_sae.md` (nota 2026-09-08) |
| Iteraciones del prototipo | mayo–octubre 2026 | historial git |
| Caso canónico | Familia Muñoz González: Martina (16, 3.º medio, Colegio Los Andes, no postula), Mateo (postula a 7.º básico) y Sofía (postula a 4.º básico, la menor: el resultado se simula solo para ella); en bloque, una sola lista. Catálogo de 6 (vínculos: hermana → Los Andes; pareja funcionario → Villa del Sol; madre exalumna → República de Chile). **Lista del estudio (v11): 1. San Martín · 2. Los Andes**; San Martín ≈26 % (no queda) → **Colegio Los Andes, 2.ª preferencia** (≈99 %). Cifras de 4.º básico: con vínculo 99 · Simón Bolívar/Los Quillayes 46–50 · San Martín 26; acotado a [1, 99]. Sin Martina, Los Andes baja a 17 % | `instrucciones_prueba_usabilidad.md` v11; `npm test` 16/16 |
| Simulador | Monte Carlo 1000 iteraciones, semilla fija, DA por colegio; `pSep = 0.55` único parámetro anclado (2018: 54,7 % prioritarios); 2018: 59,2 % 1.ª preferencia, 82,5 % alguna, 8,9 % sin asignación | `investigacion_algoritmo_sae.md` §6; bitácora R |
| Estudio comparativo (instrumento **v11**; guion aprobado por la profesora el 2026-10-27) | entre-sujetos, N≈30 (~15/condición); A = con panel "Te explicamos" y resto de la capa de explicación, B = sin ella (interruptor en "Herramientas de la prueba"); experiencia previa (sí/no) en la bienvenida → dos turnos alternando A/B; escritorio; sin pensar en voz alta; nada escrito; 7 momentos; ASQ de Lewis (3 ítems, 1–7 **invertida**: 7 = de acuerdo) + predicción (colegio, seguridad 5 niveles, por qué) antes del resultado; confianza y justicia (1 ítem c/u, exploratorias) al verlo; 3 preguntas sobre el resultado + 3 "¿qué habría pasado si…?" (+1 condicional); H1 comprensión · H2 ASQ · H3 confianza · H4 justicia · H5 falso riesgo estratégico; clasificación correcta/parcial/incorrecta con pauta + 2.ª persona ciega; U de Mann-Whitney como apoyo; ≈34 min (sin piloto). **No usar** como vigentes: Likert 1–5 de 13 ítems, "tómbola" como covariable, impares/pares, 6 colegios en el estudio, 8 tareas, pensar en voz alta | `instrucciones_prueba_usabilidad.md` v11; `conclusiones_posibles_prueba_usabilidad.md` |
| Estudio previo (otro artefacto) | maqueta Figma del módulo de explicación, 10 personas | Cap. 3 Fase 2 |

---

## 4. Decisiones abiertas del autor (no resolver al redactar)

1. Subtítulo y objetivos 4–5 del Cap. 1 con foco en el flujo de postulación.
2. HAX / PAIR citados en el Cap. 2 o solo en el Cap. 3.
3. Comité de ética UTFSM (el Cap. 3 lo declara como trámite por confirmar).
4. Placeholders de portada: `\carreraTesis`, `\gradoTesis`, `\directorTesis`.
5. **Coherencia problema → objetivos → método** (detectado el 2026-09-27 con la revisión en cadena): (a) Obj. 4 menciona la maqueta Figma como parte del trabajo, mientras el Cap. 3 la declara un estudio distinto; (b) Obj. 5 mide "claridad, confianza y utilidad percibida", pero la pregunta y el instrumento miden comprensión, confianza y percepción de justicia; (c) "significativamente" en la pregunta de investigación frente a un análisis principalmente descriptivo. Propuesta mínima, para aprobar: Obj. 4 → "Construir un prototipo funcional de aplicación web…"; Obj. 5 → "Evaluar, mediante un estudio comparativo con usuarios, si la explicación del algoritmo mejora la comprensión, la confianza y la percepción de justicia"; pregunta → quitar "significativamente".
6. **Abstract en inglés y Anexos** (cuestionario, guion de moderador, consentimiento): confirmar el formato exigido por la UTFSM antes de agregarlos.
8. **¿El SAE real usa ClaveÚnica?** Las fuentes del proyecto se contradicen: `05_resultados.tex` (`sec:res-sitio-oficial`) dice que la plataforma sigue exigiendo una cuenta propia con RUT/IPA y contraseña, mientras la bitácora (Bloque S) dice que el SAE real precarga los datos tras ingresar con ClaveÚnica. Afecta cómo se describe la brecha de interoperabilidad y qué tan fiel es la condición B (que ingresa con ClaveÚnica). El Cap. 4 quedó redactado de forma neutral hasta resolverlo; verificar en el sitio oficial vigente.
9. **Instrumento v11: guion aprobado por la profesora (2026-10-27).** La profesora aprobó `docs/investigacion/guion_lectura_prueba.md` (el texto que se lee en voz alta, incluida la redacción de las preguntas de confianza y justicia), y el material definitivo de las sesiones quedó en `docs/prueba_definitiva/`. El Cap. 3 §3.4.1 ya lo declara aprobado. El guion no se cambia sin su visto bueno; si cambia, reescribir la sección. Resuelto: el aviso de lista corta se mantiene y la planilla registra las reacciones. Siguen abiertos: la pauta de clasificación de las respuestas en voz alta, el respaldo bibliográfico de las preguntas de confianza y justicia, el piloto (duración) y el contacto en la hoja de consentimiento. Detectado por el `revisor-memoria` (2026-10-22), declarado en el texto pero sin resolver: (a) la condición B conserva el desplegable "¿Cómo funcionan las prioridades acá?" (incluye que el vínculo vale solo en ese colegio, la regla de la pregunta hipotética 2) y la prioridad aplicada en el resultado; (b) B no muestra las consecuencias de aceptar/rechazar ni "Qué sigue ahora" (aviso de aceptación automática), que son información del proceso; (c) el panel del resultado de A dice la respuesta de la pregunta hipotética 1; (d) las vacantes de la lista (suma de niveles) no coinciden con los cupos del recorrido (nivel de Sofía). Cambiar (a), (b) o (d) es trabajo del code-agent y obliga a recapturar el Cap. 4.
7. **Referencias del Bloque B con título no verificado:** 9 entradas citadas imprimen "(VERIFICAR…)" en la bibliografía del PDF. Hay que conseguir el título, venue y año reales de cada paper; ver `bibliografia/bibliografia_anotada.md`.

---

## 5. Versión web de lectura (para leer desde el celular)

- **Link fijo (privado):** https://claude.ai/artifact/Mh5i39RR2g7rC8scU4iXE2
- **Cómo se actualiza** (lo hace la sesión principal, no el `writing-agent`, que no tiene la herramienta de publicación), después de cerrar y verificar una sección:
  1. `cd proyecto-tesis && latexmk main.tex` (los números de sección y tabla salen de `build/main.aux`).
  2. `python3 scripts/publicar_web.py` → `build/web/memoria.html` (requiere `pandoc`; si falta, `apt-get install -y pandoc`).
  3. Publicar ese archivo como Artifact **con `url` = el link de arriba** (en una sesión nueva, leerlo primero con `action: read`). Publicar sin `url` crea otro link. Las figuras van en el parámetro `files`, con clave `imagenes/propuesta/<archivo>.png` y la **ruta absoluta** como fuente; solo hace falta volver a subirlas si cambian (los archivos omitidos se conservan).
- La página muestra el estado de cada capítulo leído de este archivo (sec. 2): ⏸ en el título → "Espera datos"; alguna fila 🔄/🟡/❓ → "En revisión"; si no, "Vigente". Mantener esas marcas al día cambia lo que ve el autor.
- El PDF sigue siendo el documento oficial; la web es una vista de lectura (Pandoc, citas autor-año desde `referencias.bib`).

## 6. Registro de sesiones de redacción

| Fecha | Sección | Cambio | Verificación |
|---|---|---|---|
| 2026-09-24 | Cap. 3 §3.4.1 | Reescrita: prueba formativa N=8 → estudio comparativo entre-sujetos N≈30 (condiciones, participantes, tareas, instrumento, hipótesis, análisis, amenazas, ética) | `verificar_memoria.py` 0 errores; `latexmk` OK (TeX Live instalado vía apt en la sesión) |
| 2026-09-24 | Cap. 3 Tabla 3.1 | + filas de septiembre (preparación del estudio y condición de control; carga de texto y grupo familiar) | ídem |
| 2026-09-24 | Todo el documento | El Resumen pasa a `\chapter*`: antes corría la numeración un capítulo (Metodología salía como Cap. 4 y la validación como 4.4, mientras el texto decía "Capítulo 3" y "Sección 3.5"). 56 referencias escritas a mano → `\label`/`\ref`; "Sección 3.5" → `sec:validacion` (= 3.4) | `latexmk` sin errores ni referencias indefinidas |
| 2026-09-24 | Cap. 4 §4.2, §4.4 | Condición de control + tests; el pendiente (b) pasa al estudio comparativo | ídem |
| 2026-09-27 | Cap. 3 §3.4.1 | + párrafo **Variables** (independiente: condición; dependientes: 3 constructos; constantes: caso/lista/orden/desenlace/tareas/instrumento; covariables) | `verificar_memoria.py` 0 errores; `latexmk` OK |
| 2026-09-27 | Herramientas | `bibliografia/bibliografia_anotada.md` (32 fichas generadas del `.bib` y de las citas reales; verificación ⏳); verificador + avisos de afirmaciones absolutas y de marcadores VERIFICAR citados; `writing-agent` + cadena de coherencia; nuevo agente `revisor-memoria` | — |
| 2026-09-27 | Cap. 3 §3.3, §3.4.1; Cap. 5 §5.3 | Primera prueba del `revisor-memoria` (1 🔴, 7 🟡), todo aplicado: nombres de 3 establecimientos corregidos según `colegios.js`; 8 tareas (identificarse y seleccionar el grupo familiar separadas); H3 sin la atribución no verificada a Springer & Whittaker; variables (sondeos por rama, predicción codificada); asignación y estratificación; comparaciones por ítem exploratorias; "prueba de usabilidad" → estudio comparativo en §3.3; Sec. 5.3 con las amenazas a la validez | verificador 0 errores; `latexmk` OK |
| 2026-09-28 | Cap. 4 Propuesta (nuevo) | Capítulo con 14 capturas; capítulos siguientes renumerados (5–7). Primera revisión del `revisor-memoria` como agente propio (2 🔴, 16 🟡), todo aplicado salvo lo que depende del autor: Inicio no calcula la etapa por fecha (sí `/proceso`); ClaveÚnica redactado neutral (decisión n.º 8); chip = porcentaje, "X de cada 100" solo en ficha/lector de pantalla; sin restricción regional (no "filtro"); simplificación de jornada/proyecto declarada; fechas del calendario oficial; "una de las dos brechas con 0 %"; tabla síntesis sin "gestión de expectativas" ni principio forzado para el buscador; audiovisualidad parcial; recuadro "cómo se decide" en paso 1 y en lo que oculta B; condición A/B; `sec:fase3`; brechas anticipadas en la intro. Prototipo: "Estás en", "Tamaño de texto", "¿Es tu primera vez…?" (lint/build/test 16/16); capturas con fecha simulada 20-08-2026. **Tabla 3.1 pasa a `longtable`**: desbordaba la página y se cortaban filas (el PDF crece de 54 a 58 páginas) | verificador 0 errores; `latexmk` OK sin "Float too large"; web republicada con figuras |
| 2026-09-30 | Todo el documento | **Confidencialidad del diagnóstico** (decisión del autor): se quitaron de la memoria el proyecto Fondecyt y su número, la Universidad de Chile como autora, la sigla SISIB y la cita `moralesvargas2026informe` (eliminada del `.bib` y de `bibliografia_anotada.md`); se mantienen las cifras y la descripción del instrumento, sin calificar el documento de "no publicado". 13 pasajes en Resumen y Caps. 1, 2, 3, 5, 6, 7. `verificar_memoria.py` los trata como error. De paso: Resumen "mayo y agosto" → "mayo y septiembre" | verificador 0 errores; `latexmk` OK; web republicada |
| 2026-10-21 | Caps. 3, 4, 6, Resumen | **Se retoma desde `refactor/panel-explicativo`** (código de esa rama; de `claude/wizardly-euler-e9zrok` solo la redacción). Cap. 3: caso de estudio con grupo familiar, en bloque/por separado y lista única como propuesta (contenido del Cap. 3 de la otra rama, verificado contra el código), cifras del simulador, Tabla 3.1 hasta octubre (panel "Te explicamos", una sola familia), §3.4.1 reescrita al instrumento v11 (2 colegios, turnos por experiencia previa, ASQ invertida, predicción, confianza/justicia exploratorias, preguntas hipotéticas, H1–H5, clasificación con pauta, amenazas nuevas). Cap. 4 reescrito para la interfaz flujo + panel con 13 capturas nuevas (`capturas_propuesta.mjs` adaptado al flujo nuevo). Cap. 6: limitaciones según v11. Resumen al día. Nueva clave `lewis1991asq` (de `docs/`). Verificador: patrones obsoletos del instrumento anterior | verificador 0 errores; `latexmk` OK (67 páginas, sin referencias ni citas indefinidas) |
| 2026-10-22 | Caps. 3, 4, 6 | `revisor-memoria` sobre lo reescrito (2 🔴, 9 🟡), todo aplicado en el texto: el aviso "Postula solo si…" va en el panel de ingreso en A (no en el flujo) y el estudio no pasa por esa pantalla; qué conserva y qué no muestra la condición B (desplegable de prioridades, prioridad aplicada; sin consecuencias ni pasos siguientes), con "diferencia sistemática" matizada; lista corta = aviso del prototipo basado en la recomendación oficial; amenaza nueva "respuesta presente en el panel"; predicción = única medida de **comprensión** antes del resultado; H4 como expectativa propia; "las principales" amenazas se retoman; "pregunta del estudio, derivada de"; vacantes de la lista vs. cupos del recorrido aclaradas; Cap. 6 "estudio comparativo". Lo que requiere código queda en la decisión n.º 9 | verificador 0 errores; `latexmk` OK (67 páginas) |
| 2026-10-27 | Cap. 3 §3.4.1 | El guion de la prueba pasa de "propuesta pendiente de aprobación" a **aprobado por la profesora (2026-10-27)**, con el material definitivo (`docs/prueba_definitiva/`); el aviso de lista corta se mantiene (ya no "por confirmar"); la segunda persona ciega clasifica con la planilla o transcripciones anónimas (el consentimiento dice que solo el autor ve las grabaciones); "Aspectos éticos" describe el consentimiento real. Decisión n.º 9 actualizada | Chequeo manual de `\ref`/cifras; `verificar_memoria.py` y `latexmk` no disponibles en este equipo (sin Python ni LaTeX) |
