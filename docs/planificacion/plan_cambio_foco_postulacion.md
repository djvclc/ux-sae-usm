# Plan: cambio de foco de la memoria hacia el flujo de postulación

**Fecha:** 2026-08-08
**Estado:** propuesta para discusión — no ejecutada. Ningún capítulo ha sido modificado.

## 1. Qué cambia y qué no

La memoria pasa de tratar el SAE completo (vitrina, ficha de colegio, algoritmo, postulación, seguimiento, proceso) con precisión pareja, a usar el **flujo de postulación como caso de estudio central**: el resto del prototipo se mantiene como contexto de apoyo, pero el análisis, la validación y la discusión profundizan específicamente ahí.

Esto es coherente con el estado real del proyecto, no un giro artificial: S22 (rediseño del flujo de postulación) es la categoría más grande del plan de mejora (15 de 87 puntos), tiene detrás el documento de análisis más profundo (`analisis_flujo_postulacion.md`, con 6 errores de fidelidad corregidos y benchmark contra NYC MySchools), y la propia preparación de la reunión con el profesor guía ya la señala como "la estrella de la demo".

**No cambia:** stack, arquitectura del prototipo, estructura de capítulos (6), estilo de citas, ni las cifras ya validadas del plan de mejora (87/87, 22 categorías). Se respeta la regla del proyecto de no migrar ni rediseñar lo ya decidido.

## 2. Impacto capítulo por capítulo

### Capítulo 1 — Introducción
- **Problema de investigación:** acotar de "el proceso de admisión escolar" a "el flujo de postulación" como instancia crítica de decisión (es el único paso donde la familia actúa, no solo consulta información).
- **Objetivo general:** mantener transparencia/UX del SAE, pero especificar que el prototipo y su validación se centran en el flujo de postulación.
- **Objetivos específicos:** el objetivo 4 (construcción del prototipo) y el 5 (validación con usuarios) deben decir explícitamente "con énfasis en el flujo de postulación" en vez de "el prototipo" en general.
- **Título tentativo:** el título actual ("Mitigación de Sesgos en IA: Análisis del Sistema de Admisión Escolar en Chile") sigue siendo válido a nivel de tesis, pero conviene decidir si el subtítulo se ajusta (ej. "...: Rediseño del Flujo de Postulación en el Sistema de Admisión Escolar en Chile"). **Requiere tu decisión** — no es un cambio menor.

### Capítulo 2 — Marco teórico
- Sin reestructuración. Revisar si conviene reordenar/destacar (no eliminar) los estudios de la revisión de 96 papers que tratan específicamente formularios multipaso, puntos de decisión y compromisos irreversibles (vs. los que tratan paneles informativos pasivos), para que el marco teórico anticipe mejor el foco del capítulo 4.

### Capítulo 3 — Metodología (el impacto real está aquí)
- Fases 1–3: sin cambios de fondo: el diagnóstico heurístico y la revisión de literatura siguen siendo generales por diseño (evalúan el sitio completo).
- **Fase 4 (validación, aún no ejecutada — es el momento correcto para redirigir):**
  - El instrumento heurístico SISIB se aplica igual, sobre el sitio completo (no se puede acotar, es una réplica del baseline).
  - La **prueba de usabilidad con usuarios reales** sí se redefine: las tareas dirigidas deben concentrarse en completar una postulación real de principio a fin (identificación, armado de lista con reordenamiento, prioridades, confirmación, comprobante), en vez de un recorrido general del prototipo. Esto da datos de validación mucho más profundos sobre la sección que más se trabajó, y responde directamente a la pregunta de si el rediseño S22 corrige la percepción de "tómbola".
  - Considerar agregar una comparación específica de tareas contra el flujo oficial (los 6 errores de fidelidad E1–E6 corregidos son medibles: ¿el usuario ahora entiende correctamente el tope de colegios, el desempate, el orden de prioridades?).

### Capítulo 4 — Resultados
- Sin tocar ahora (depende de la validación). Cuando se ejecute, la sección de resultados de usabilidad reportará con detalle el flujo de postulación y de forma resumida el resto.

### Capítulos 5–6 — Discusión y Conclusiones
- Siguen pendientes por diseño hasta tener datos de validación. El cambio de foco los afecta indirectamente: la discusión deberá comparar los hallazgos de postulación contra la literatura de formularios de decisión multipaso (no solo transparencia algorítmica general), y las conclusiones deberán ser explícitas sobre qué queda fuera de alcance (vitrina, seguimiento) como líneas de trabajo futuro.

## 3. Qué no requiere cambios
- Cifras del plan de mejora (87/87, 22 categorías) — siguen documentando el trabajo completo del prototipo, no solo la postulación. No hay que "inflar" el peso de S22 artificialmente en esas cifras.
- El prototipo en `sae-react/` no requiere cambios de código para este plan; es un cambio de énfasis de investigación, no de producto.

## 4. Riesgos
- Si el subtítulo/título cambia, hay que verificar que no quede desalineado con el objetivo general del capítulo 1 ni con cómo se presenta el trabajo en el resumen (cap. 00).
- La reunión con el profesor guía (2026-08-06) preguntaba justamente por el diseño de la validación (sección 4.1 de `reunion_profesor_guia_2026-08-06.md`). Si ya hubo respuesta del profesor sobre método/N/instrumento, ese acuerdo debe primar sobre este plan y hay que conciliarlos antes de tocar el capítulo 3.

## 5. Próximos pasos sugeridos
1. Confirmar contigo: ¿se ajusta el título/subtítulo (cap. 1) o se mantiene el actual? (pendiente de decisión)
2. Redactar las tareas dirigidas de la prueba de usabilidad centradas en postulación (Fase 4, cap. 3) — listas para ejecutar la validación.
3. Ajustar objetivos específicos 4 y 5 del capítulo 1 con la mención explícita al flujo de postulación.
4. Recién con datos de validación: escribir resultados (cap. 4), discusión (cap. 5) y conclusiones (cap. 6) con el nuevo foco.
5. Actualizar `CLAUDE.md` (Estado del proyecto) cuando cualquiera de estos pasos se ejecute.
