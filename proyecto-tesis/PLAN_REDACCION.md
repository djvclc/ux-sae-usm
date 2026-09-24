# Plan de redacción de la memoria

Estado vivo de la memoria, sección por sección. Lo lee el `writing-agent` **antes** de cada tarea y lo actualiza **al cerrarla**; es la fuente de verdad sobre qué está escrito, qué falta y de dónde sale cada contenido. La definición del agente (`.claude/agents/writing-agent.md`) contiene solo reglas estables; lo que cambia con el proyecto vive aquí.

Leyenda: ✅ vigente · 🔄 escrita, requiere actualización · 🟡 parcial · ⏸ bloqueada (espera datos de la validación) · ❓ espera decisión del autor

Última actualización: 2026-09-24

---

## 1. Orden de escritura

El orden de **lectura** es 0→6. El de **escritura** es otro, porque cada capítulo depende de lo que el anterior fija:

1. **Cap. 3 Metodología**: fija qué se hizo y qué se medirá. Todo lo demás lo cita.
2. **Cap. 4 Resultados**: solo lo verificable hoy; los resultados de la validación se agregan cuando existan.
3. **Cap. 2 Marco teórico**: se completa solo si la metodología cita algo que el marco no introduce (p. ej. HAX/PAIR, ❓).
4. **Cap. 1 Introducción**: se ajusta al final a lo que la memoria efectivamente hace (objetivos, estructura).
5. **Cap. 5 y 6**: ⏸ hasta tener datos del estudio comparativo.
6. **Resumen**: al final de cada ronda; resume lo que existe, nunca lo proyectado.

Regla: una sección nunca cita como hecho algo que una sección anterior en este orden todavía no fija.

---

## 2. Índice con estado

Numeración real del PDF (desde el 2026-09-24 el Resumen no lleva número): Introducción = Cap. 1 … Conclusiones = Cap. 6. Las referencias se escriben con `\ref`; etiquetas vigentes: `cap:introduccion|marco|metodologia|resultados|discusion|conclusiones`, `sec:prototipado-ia`, `sec:fase2`, `sec:fase3-caso`, `sec:fase3-marcos`, `sec:validacion`, `sec:estudio-comparativo`, `sec:res-diagnostico|prototipo|sitio-oficial|pendientes`, `sec:limitaciones`, `tab:iteraciones`, `tab:instrumento`.

### Cap. 0 — Resumen (`00_resumen.tex`)
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| Resumen | 🔄 | "entre mayo y agosto de 2026" → septiembre; "prueba de usabilidad" → estudio comparativo A/B | Caps. 3–4 ya escritos |

### Cap. 1 — Introducción (`01_introduccion.tex`)
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| Contexto y problema | ✅ | — | — |
| Objetivos específicos | ❓ | Obj. 5 dice "claridad, confianza y utilidad percibida" y el instrumento mide comprensión/confianza/justicia; decidir si se alinea y si se agrega "con énfasis en el flujo de postulación" (`docs/planificacion/plan_cambio_foco_postulacion.md`) | decisión del autor |
| Estructura de la memoria | 🟡 | Título corregido (2026-09-24); el párrafo aún dice "pruebas de usabilidad" → estudio comparativo | — |

### Cap. 2 — Marco teórico (`02_marco_teorico.tex`)
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| 2.1–2.6 | ✅ | — | `referencias.bib` |
| (posible) marcos HAX / PAIR | ❓ | ¿Se citan en el Cap. 2 o solo como insumo en el Cap. 3 §3.3? Hoy: solo Cap. 3, sin clave bib | `docs/investigacion/investigacion_ux_guide_ai_systems.md` |

### Cap. 3 — Metodología (`03_metodologia.tex`)
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| Intro + Fase 1 + Fase 2 | ✅ | — | — |
| 3.3 Caso de estudio y persona | ✅ | (Actualizado 2026-09-08: sin SEP/PIE, simulador Monte Carlo) | `caso_estudio…md` §1–§3; bitácora Bloques O/R |
| 3.3 Marcos de diseño humano-IA | ✅ | — | `investigacion_ux_guide_ai_systems.md` |
| 3.3 Cronología (Tabla 3.1) | ✅ | Filas de sept. añadidas el 2026-09-24 (F3, verificación del grupo familiar, reducción de carga). Siguiente iteración → nueva fila | bitácora Bloques S–Z22; `CLAUDE.md` Estado |
| 3.3 Estado actual del prototipo | ✅ | — | — |
| 3.4 Fase 4 (`sec:validacion`): reevaluación heurística (5 pasos) | ✅ | (Intro reescrita para presentar los dos componentes) | — |
| 3.4.1 Estudio comparativo (`sec:estudio-comparativo`) | ✅ | Reescrita el 2026-09-24 (antes era la prueba formativa N=8). Si el diseño cambia tras la revisión de la profesora, actualizar aquí | `caso_estudio…md` §6–§10; bitácora §7 |

### Cap. 4 — Resultados (`04_resultados.tex`)
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| 4.1 Diagnóstico heurístico | ✅ | — | informe Fondecyt |
| 4.2 Estado de implementación | ✅ | (2026-09-24: condición de control y tests de determinismo/independencia de posición) | bitácora Bloque V; `sae-react/tests/` |
| 4.3 Sitio oficial | ✅ | — | — |
| 4.4 Resultados pendientes | ✅ | (2026-09-24: apunta al estudio comparativo) | `sec:estudio-comparativo` |

### Cap. 5 — Discusión (`05_discusion.tex`) ⏸
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| 5.1 Brechas cerradas por el sitio oficial | ✅ (preliminar) | — | — |
| 5.2 Preguntas de la discusión completa | 🔄 | Pregunta 2 → formular en términos de H1–H4 del estudio comparativo | `caso_estudio…md` §8.4 |
| 5.3 Limitaciones | 🔄 | Sumar las amenazas a la validez del estudio (moderador no ciego, un solo desenlace, muestra por conveniencia, simulador didáctico) | `caso_estudio…md` §10 |
| Discusión completa | ⏸ | Requiere datos | — |

### Cap. 6 — Conclusiones (`06_conclusiones.tex`) ⏸
| Sección | Estado | Qué falta | Fuentes |
|---|---|---|---|
| Lo que puede afirmarse | ✅ | — | — |
| Lo que falta | 🔄 | Punto 2 → "ejecutar el estudio comparativo A/B (N≈30)" | Cap. 3 §3.4 |
| Líneas de trabajo futuro | ⏸ | Roadmap R1–R6 disponible | `comparativa_flujo_postulacion_v_final.md` §6 |

---

## 3. Hechos canónicos (verificar aquí antes de escribir una cifra)

| Hecho | Valor | Fuente |
|---|---|---|
| Diagnóstico heurístico | 51 % sitio informativo · 61 % plataforma · 0 % transparencia y apertura · 0 % inclusión · desglose 55/57/22 | informe Fondecyt N.º 1250492 |
| Revisión de literatura | 96 publicaciones, 2017–2025 | `docs/investigacion/` |
| Matriz del plan | 102 filas, 4 no aplican → **98 aplicables**; se escribe "la totalidad de los puntos aplicables fue abordada a nivel de código". **No usar** 87/87, 62/62, 72/72 como vigentes | `plan_mejora_sae.md` (nota 2026-09-08) |
| Iteraciones del prototipo | mayo–septiembre 2026 | historial git |
| Caso canónico | Sofía (3.º básico, la menor) postula en bloque con Mateo; lista fija de 6: San Martín · Los Andes · República de Chile · Villa del Sol · Simón Bolívar · Los Quillayes; San Martín 1.º ≈26 % (no queda) → **Colegio Los Andes, 2.ª preferencia** (≈99 %, hermana matriculada) | `caso_estudio…md` §3; `npm test` 16/16 |
| Simulador | Monte Carlo 1000 iteraciones, semilla fija, DA por colegio; `pSep = 0.55` único parámetro anclado (2018: 54,7 % prioritarios); 2018: 59,2 % 1.ª preferencia, 82,5 % alguna, 8,9 % sin asignación | `investigacion_algoritmo_sae.md` §6; bitácora R |
| Estudio comparativo | entre-sujetos, N≈30 (~15/condición); A = con capa de explicación, B = control sin ella (proxy del SAE real, implementado 2026-09-09); asignación impares→A pares→B; 8 tareas; B1 "tómbola" + experiencia SAE como covariables; Likert 1–5 de **13 ítems** (C1–C5, F1–F5, J1–J3) + abiertas A1/A2; H1–H4; U de Mann-Whitney + r; sesión 45–55 min | `caso_estudio…md` §6–§10 |
| Estudio previo (otro artefacto) | maqueta Figma del módulo de explicación, 10 personas | Cap. 3 Fase 2 |

---

## 4. Decisiones abiertas del autor (no resolver al redactar)

1. Subtítulo y objetivos 4–5 del Cap. 1 con foco en el flujo de postulación.
2. HAX / PAIR citados en el Cap. 2 o solo en el Cap. 3.
3. Comité de ética UTFSM (el Cap. 3 lo declara como trámite por confirmar).
4. Placeholders de portada: `\carreraTesis`, `\gradoTesis`, `\directorTesis`.

---

## 5. Registro de sesiones de redacción

| Fecha | Sección | Cambio | Verificación |
|---|---|---|---|
| 2026-09-24 | Cap. 3 §3.4.1 | Reescrita: prueba formativa N=8 → estudio comparativo entre-sujetos N≈30 (condiciones, participantes, tareas, instrumento, hipótesis, análisis, amenazas, ética) | `verificar_memoria.py` 0 errores; `latexmk` OK (TeX Live instalado vía apt en la sesión) |
| 2026-09-24 | Cap. 3 Tabla 3.1 | + filas de septiembre (preparación del estudio y condición de control; carga de texto y grupo familiar) | ídem |
| 2026-09-24 | Todo el documento | El Resumen pasa a `\chapter*`: antes corría la numeración un capítulo (Metodología salía como Cap. 4 y la validación como 4.4, mientras el texto decía "Capítulo 3" y "Sección 3.5"). 56 referencias escritas a mano → `\label`/`\ref`; "Sección 3.5" → `sec:validacion` (= 3.4) | `latexmk` sin errores ni referencias indefinidas |
| 2026-09-24 | Cap. 4 §4.2, §4.4 | Condición de control + tests; el pendiente (b) pasa al estudio comparativo | ídem |
