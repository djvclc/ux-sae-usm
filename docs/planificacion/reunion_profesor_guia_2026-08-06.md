# Preparación de reunión con profesor guía

**Fecha de la reunión:** jueves 6 de agosto de 2026
**Duración estimada:** 30–60 minutos, con demo del prototipo
**Objetivo:** mostrar el cierre del plan de mejora (87/87, 100 %), decidir los próximos pasos (validación y capítulos 5–6) y resolver qué falta integrar en la página.

---

## 1. Contexto de oportunidad (mencionar al inicio)

Dos hechos de esta misma semana refuerzan la relevancia de la memoria:

- **Ayer (4 de agosto) abrió la postulación del Periodo Principal Admisión 2027** (hasta el 27 de agosto, 14:00). El prototipo refleja fielmente ese proceso vigente.
- **Hoy (5 de agosto) la Cámara despachó al Senado la reforma al SAE** (111 a favor, 28 en contra, 1 abstención): crea los mecanismos de Elección Mutua (EM) y Asignación Aleatoria (AA). El sistema que analizamos está en pleno debate legislativo — la transparencia algorítmica que propone la memoria es más pertinente que nunca.

## 2. Agenda propuesta (45 min de referencia)

| Bloque | Tiempo | Contenido |
|---|---|---|
| 1. Estado de avance | 5 min | Plan de mejora cerrado: 87/87 puntos, 22 categorías; lint y build limpios; memoria sincronizada (caps. 0–4) |
| 2. Demo del prototipo | 15–20 min | Recorrido guiado (ver §3) |
| 3. Contexto reforma SAE | 5 min | Voto de hoy en la Cámara; preguntar cómo tratarla (ver §4.2) |
| 4. Preguntas y decisiones | 10–15 min | Validación, contenidos faltantes, caps. 5–6 (ver §4) |
| 5. Acuerdos y próximos pasos | 5 min | Registrar compromisos con fechas |

## 3. Flujo de la demo (orden recomendado)

Hilo conductor: *el viaje de Daniela González* — de la desconfianza ("tómbola") a la comprensión.

1. **`/inicio` (vitrina)** — 2 min. Buscador, orden por SIMCE/vacantes/distancia/demanda, datos v2 (postulantes año anterior, rangos de vacantes).
2. **Ficha de colegio** — 2 min. Identidad institucional, categoría de desempeño con escala, comparación SIMCE por GSE, CTA "Agregar a mi lista".
3. **`/postulacion` (estrella de la demo, S22)** — 6 min. Mostrar: fidelidad corregida (sin tope de 8, región como filtro, prioridades en orden real PIE → hermanos → 15 % → funcionario → exalumno), drag-and-drop accesible, borrador visible, postulación familiar en bloque, consejo estratégico DA, "¿y si no quedo en ninguna?", comprobante descargable.
4. **`/proceso` (S21)** — 3 min. Línea de tiempo de 5 etapas con estado por fecha (hoy aparece activa la etapa Postulación — efecto demo potente), reglas de alto riesgo, calendario accesible.
5. **`/algoritmo`** — 3 min. Simulador de Aceptación Diferida: la capa profunda de la transparencia.
6. **Cierre con páginas internas** — 2 min. `/cumplimiento` (matriz 87/87), `/notas` (respaldo en literatura), `/roadmap`.

**Checklist previo:** `npm run build` y servidor corriendo antes de la reunión; viewport móvil 375 px preparado; PDF de la memoria recompilado a mano por si pide verla; tener abierto el sitio oficial para contrastar en vivo si surge.

## 4. Preguntas para el profesor guía

### 4.1 Validación (la decisión más urgente — habilita caps. 5 y 6)

1. El plan de mejora quedó al 100 %: ¿congelamos funcionalidades y pasamos a la validación (Sección 3.5)?
2. ¿Validación con evaluadores expertos (heurística), con usuarios reales del perfil de Daniela, o ambas? ¿Cuántos participantes considera suficientes para la memoria?
3. ¿Usamos el mismo instrumento del informe Fondecyt N.º 1250492 para comparar contra el baseline (51 % sitio informativo, 61 % plataforma, 0 % transparencia e inclusión)?
4. ¿Se requiere consentimiento informado o aprobación de algún comité para pruebas con usuarios? ¿Plazos administrativos UTFSM?

### 4.2 Reforma SAE (aprobada hoy en la Cámara)

5. ¿Cómo tratamos la reforma en la memoria: solo en limitaciones/trabajo futuro, o como sección de discusión (la explicabilidad del DA fue argumento de diseño y el debate la pone a prueba)?
6. ¿El prototipo debe mencionarla (p. ej., aviso contextual "sistema en discusión legislativa") o mantenerse estrictamente en el sistema vigente para no especular?

### 4.3 Qué falta integrar en la página (priorizar con el profesor)

7. ¿Simular la etapa de **Resultados/listas de espera** de forma interactiva (aceptar / aceptar + lista de espera / rechazar con consecuencias visibles)? Hoy `/seguimiento` la cubre parcialmente.
8. ¿Simular el **Periodo Complementario** como flujo propio (hoy solo se explica en `/proceso`)?
9. ¿**Notificaciones simuladas** (correo/SMS) para completar el ciclo de gestión de expectativas?
10. ¿**Auditoría formal de accesibilidad** (lector de pantalla, axe/Lighthouse) como anexo de la memoria, además del cumplimiento WCAG AA ya aplicado?
11. ¿Soporte **multiidioma** (p. ej., creole haitiano) dado el perfil de familias migrantes, o queda como trabajo futuro?
12. De lo anterior, ¿qué aporta más a la validación y qué es alcance excesivo a esta altura?

### 4.4 Memoria y calendario académico

13. Caps. 0–4 redactados y sincronizados; 5 y 6 esperan datos de validación: ¿de acuerdo con esa secuencia?
14. Fechas objetivo: ¿cuándo debería estar ejecutada la validación y cuándo el borrador completo para revisión? ¿Fecha tentativa de defensa?
15. ¿Quiere revisar algún capítulo ahora (sugerencia: cap. 3, metodología, que fundamenta la validación)?

## 5. Cierre: acuerdos a registrar

Anotar en la reunión: (a) decisión sobre validación (método, N, instrumento, fechas); (b) tratamiento de la reforma; (c) funcionalidades aprobadas/descartadas de §4.3; (d) próxima reunión.

---

**Fuentes de contexto:** `docs/planificacion/plan_mejora_sae.md` (87/87), `docs/investigacion/investigacion_algoritmo_sae.md`, `investigacion_paso_a_paso_sae.md`, `analisis_flujo_postulacion.md`; reforma: [Radio U. de Chile, 2026-08-05](https://radio.uchile.cl/2026/08/05/reforma-al-sae-avanza-al-senado-ministra-arzola-valora-volver-a-reconocer-el-merito/), [Mineduc — inicio postulaciones 2027](https://www.mineduc.cl/sistema-de-admision-escolar-sae-comienzan-las-postulaciones-a-establecimientos-para-2027/).
