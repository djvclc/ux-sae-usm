# Preparación de reunión con profesor guía

**Fecha de la reunión:** jueves 13 de agosto de 2026
**Objetivo:** presentar los dos avances de esta semana (guía UX para IA aplicada al SAE, metodología del caso de estudio de usabilidad) y dejar registrado el pendiente de la prueba con caso real.

---

## 1. Investigación: guías de UX para IA aplicadas al flujo de postulación

Documento: `docs/investigacion/investigacion_ux_guide_ai_systems.md`.

- Resuelve el pendiente que quedaba abierto sobre qué estudios debían fundamentar el diseño de las advertencias/alertas (Microsoft HAX Toolkit, Google PAIR "Explainability + Trust", NN/g, Brookings, literatura de comunicación de riesgo).
- **Hallazgo central:** el paso 2 de `PostulacionPage.jsx` decía "ordena por tu preferencia real" (correcto, refleja strategy-proofness del algoritmo DA) mientras el paso 3 decía "considera ponerlo más abajo en tu lista" ante probabilidad baja — contradicción que reforzaba el mito de riesgo estratégico que el caso Muñoz González busca corregir.
- **Ya implementado el mismo día** (comentario `S22-14 (refinamiento)`): se retiró la sugerencia de reordenar, se separó el dato que fundamenta la probabilidad baja de una frase explícita de que reordenar no cambia las chances, se extendió el formato de frecuencia a los tres niveles de probabilidad, y se agregó categoría cualitativa "Certeza muy alta" para hermano/a matriculado con prob. ≥90%.
- **Pendiente real:** el sandbox no pudo correr `npm install` (bloqueo de red), así que `npm run lint` y `npm run build` no se ejecutaron sobre el cambio. Falta confirmarlos en un entorno local antes de dar el ajuste por cerrado.

**Para conversar con el profesor:** validar que la lectura de "riesgo real vs. falso riesgo estratégico" es el encuadre correcto para el capítulo de metodología, y si vale la pena citar Microsoft HAX / Google PAIR directamente en la memoria (cap. 2 o 3) o dejarlos solo como respaldo de diseño.

## 2. Caso de estudio: metodología de la prueba de usabilidad del flujo de postulación

Documento: `docs/investigacion/caso_estudio_prueba_usabilidad_postulacion.md` (v2).

Ya definido esta semana:

- Familia ficticia Muñoz González (coherente con persona Daniela), 6 colegios que cubren las 5 prioridades legales/cuotas relevantes y el caso de "colegio en mente" (Colegio San Martín) sin ventaja algorítmica.
- Metodología completa: N=8, criterios de inclusión/exclusión, reclutamiento por conveniencia (limitación a declarar), modalidad presencial ~50-60 min, guion de moderador, instrumento Likert de 11 ítems (comprensión, confianza, justicia) + línea base pre-tarea sobre percepción "tómbola".

**Puntos abiertos para decidir con el profesor (§9 del documento):**

1. ¿Un solo grupo de 8 participantes, o dividir en variantes (p. ej. aislar el bloque familiar)? Recomendación propia: un solo grupo por tiempo.
2. ¿Se aborda la cuota de alta exigencia académica o queda fuera de alcance? (Hoy ningún colegio del prototipo tiene esa modalidad.)
3. ¿UTFSM exige paso por comité de ética para esta prueba, aunque los datos sean ficticios?
4. Confirmar `npm run lint` / `npm run build` limpios antes de reclutar (mismo pendiente del punto 1).
5. Gap de datos en `colegios.js`: no distingue tags `funcionario` / `exalumno` — bloquea ejecutar el caso contra el prototipo tal como está descrito. Es trabajo de código, pendiente de agendar.

## 3. Pendiente propio: revisión del flujo real en la página oficial

No se pudo coordinar con mi tía esta semana para observar un caso real de postulación en la plataforma oficial del SAE, así que ese contraste directo (prototipo vs. sitio oficial con un postulante real) sigue sin hacerse. Mencionarlo como tarea abierta y ver si el profesor prefiere que se resuelva antes de avanzar con el reclutamiento de los 8 participantes del caso de estudio, o si puede correr en paralelo.

## 4. Cierre: acuerdos a registrar

Anotar en la reunión: (a) encuadre riesgo real/falso riesgo estratégico aprobado o ajustado; (b) decisión sobre variantes de grupo, alcance de alta exigencia académica y comité de ética; (c) fecha para resolver el gap `funcionario`/`exalumno` en `colegios.js`; (d) plazo para la revisión pendiente del flujo real con mi tía; (e) próxima reunión.

---

**Fuentes de contexto:** `docs/investigacion/investigacion_ux_guide_ai_systems.md`, `docs/investigacion/caso_estudio_prueba_usabilidad_postulacion.md`, `docs/investigacion/analisis_flujo_postulacion.md`, `docs/investigacion/investigacion_algoritmo_sae.md`.
