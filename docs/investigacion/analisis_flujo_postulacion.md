# Análisis profundo: flujo de Postulación (la etapa donde el prototipo debe destacar)

**Fecha:** 2026-08-04
**Método:** Auditoría del código actual (`PostulacionPage.jsx`, 843 líneas) contrastada con: (a) las reglas oficiales del proceso (páginas "Paso a paso" y "Postulación en bloque" del sitio oficial, ver `investigacion_paso_a_paso_sae.md`), (b) problemas de usabilidad reportados en prensa sobre la plataforma real, y (c) referentes internacionales de elección escolar (NYC MySchools) y buenas prácticas de formularios multipaso.
**Propósito:** Definir el plan para que la postulación sea la sección más destacada del prototipo. Incluye al final el prompt de implementación para Claude Code (VS Code).

---

## 1. Estado actual del prototipo: qué ya hace bien

El flujo actual de `/postulacion` (3 pasos: Identifícate → Tus colegios → Confirma) ya supera al sitio real en varios frentes, todos verificados en el código:

1. **Modo tutorial conmutable** con explicaciones contextuales en cada decisión (divulgación progresiva).
2. **ClaveÚnica simulada como vía principal** y RUT como alternativa colapsada, con validación y formateo en vivo del RUT.
3. **Vinculación explícita del estudiante** (RUN, nombre, nivel) con tarjeta editable.
4. **Prioridades explicadas en profundidad** (qué es, qué implica, ejemplo con cifras, advertencia) en lugar de un checkbox mudo.
5. **Análisis de probabilidad por colegio y por orden en la lista** — el diferencial más valioso frente al sitio real, que no interpreta nada.
6. **Borrador persistente** de la lista (localStorage) compartido con la CTA "Agregar a mi lista" de las fichas de colegios.
7. **Stepper accesible** con `aria-current`, estados hecho/activo y botones deshabilitados con explicación (`title`).

## 2. Errores factuales detectados (corregir antes que cualquier mejora)

La auditoría contra las reglas oficiales detectó afirmaciones del prototipo que **contradicen al SAE real**. En una herramienta cuyo argumento es la transparencia, esto es lo primero a corregir:

| # | El prototipo dice | La regla oficial dice | Fuente |
|---|---|---|---|
| E1 | "Solo puedes postular a colegios de la región donde vive el/la estudiante" | Se puede postular a establecimientos "de distintas comunas y regiones, si así lo deseas" | Paso a paso para postular |
| E2 | Límite de 8 colegios ("{lista.length}/8 seleccionados", tope duro en el código) | "No existe límite en el número de colegios a postular"; la recomendación es incluir **al menos 6** | Paso a paso para postular |
| E3 | "Puedes modificar tu lista antes del 30 de agosto" | El Periodo Principal 2027 cierra el **27 de agosto a las 14:00** | Calendario oficial 2027 |
| E4 | "Tendrás 5 días hábiles para aceptar o rechazar" | El plazo es el rango de la etapa de Resultados del calendario (15–21 de octubre de 2026); no se documenta "5 días hábiles" | Resultados / Calendario |
| E5 | "El sorteo es certificado por el MINEDUC y completamente transparente" | El desempate aleatorio existe, pero la "certificación" con ese tenor no está documentada; mejor explicar cómo opera (lotería por colegio) | investigacion_algoritmo_sae.md §3.2 |
| E6 | Prioridades numeradas 1–4 como ranking simple | El orden real de procesamiento es: PIE → hermanos → prioritarios (15 %) → funcionario → exalumno, con cuotas como reserva de asientos | investigacion_algoritmo_sae.md §3.2 |

Además, el comprobante actual es solo un número en pantalla: el sitio oficial exige **descargar el comprobante** para que la postulación sea válida — nuestro flujo debería simular ese descargable.

## 3. Benchmark: qué hacen otros y qué falla en el SAE real

### 3.1 Plataforma oficial del SAE (problemas reportados)

- Apoderados reportan **excesivos captchas, mensajes de alerta, redirecciones erróneas y validaciones incorrectas**; intermitencias por alta demanda el primer día de postulación (agosto 2025).
- Críticas históricas: sistema "no amigable", implementación sin marcha blanca, y desvinculación del SIGE que permitía **postular a un curso incorrecto** — el error de curso es también la advertencia principal de la página oficial de Postulación.
- Persisten apoderados haciendo **filas presenciales** por desconfianza o falta de acceso digital — señal de que el flujo digital no genera suficiente confianza ni autonomía.

Implicación: nuestro flujo debe demostrar lo contrario — validación amable, cero fricción artificial, y verificación temprana del dato más riesgoso (el nivel/curso).

### 3.2 NYC MySchools (referente internacional del mismo tipo de algoritmo)

El sistema de Nueva York usa la misma familia de mecanismos (Aceptación Diferida) y su plataforma es el referente de UX más citado:

- **Favoritos con estrella durante la exploración que reaparecen al armar el ranking** — une exploración y postulación (nosotros ya tenemos el borrador compartido; falta hacerlo visible y consistente).
- **Ranking por arrastrar y soltar (drag-and-drop)** además de controles alternativos.
- **Información de contexto en el punto de decisión:** al pasar sobre un programa muestra la prioridad del estudiante y los **postulantes por cupo del año anterior** — exactamente el dato que nuestra vitrina v2 ya tiene (`postulantesAnterior`) y que el flujo de postulación aún no usa.
- **Sin límite de opciones** desde la admisión 2024-25 (antes 12) — consistente con corregir nuestro E2.
- **WCAG 2.1 AA+ y soporte multilingüe** como requisitos de base.

### 3.3 Buenas prácticas de formularios multipaso (síntesis)

- **Guardar y reanudar** explícito: el usuario debe *saber* que su avance se guarda (nuestro borrador existe pero es invisible).
- **Revisar y editar sin perder progreso:** desde el paso de confirmación se debe poder saltar a corregir cualquier sección (hoy solo hay "← Atrás" secuencial).
- Indicadores de progreso claros, menos campos, orden lógico de preguntas, y objetivos táctiles cómodos en móvil.
- En formularios multipaso accesibles: anunciar cambios de paso a lectores de pantalla y mantener el foco al navegar.

### 3.4 Postulación familiar en bloque (regla oficial ausente en el prototipo)

Si se postula a dos o más hermanos, la familia puede elegir **postulación en bloque**: el sistema prioriza asignarlos juntos y, si el mayor es admitido, **reordena automáticamente las preferencias del menor** poniendo primero el colegio del mayor. El prototipo hoy dice "un solo estudiante por postulación" sin mencionar esta opción — es una de las reglas más determinantes para familias como la de nuestra persona (Daniela, con más de un hijo).

## 4. Brechas y oportunidades (síntesis)

**Corregir (fidelidad al sistema real):** E1–E6 y comprobante descargable (§2).

**Adoptar de los referentes:**

1. Reordenamiento **drag-and-drop** con alternativa por botones y anuncio `aria-live` (MySchools + accesibilidad).
2. **Postulantes del año anterior y vacantes reales por nivel** (datos v2 de `colegios.js`) dentro del análisis de cada opción, reemplazando la probabilidad "mágica" por una explicación con el dato que la origina.
3. **Guardado visible**: indicador "Borrador guardado" + reanudación al volver ("Tienes una postulación a medio hacer, ¿continuar?").
4. **Edición desde la confirmación**: enlaces "Editar" por sección en el paso 3.
5. **Simulación de postulación en bloque**: opción al vincular estudiante ("¿Postulas a hermanos?") con explicación del reordenamiento automático.
6. **Verificación temprana del nivel/curso** con confirmación explícita (el error más dañino según la página oficial y la prensa).

**Diferenciales propios a reforzar (nuestra tesis):**

7. **Consejo estratégico honesto en el punto de decisión:** con Aceptación Diferida conviene ordenar por preferencia real (no "apostar"); explicar la advertencia de lista corta con el caso simulado (gestión de expectativas + explicabilidad contextualizada).
8. **Simulación de escenarios desde la lista:** "¿qué pasa si no quedo en ninguna?" → conexión con colegio de origen, listas de espera y Periodo Complementario (`/proceso`), cerrando el ciclo postulación→proceso.
9. **Comprobante simulado descargable** con resumen de la lista, fechas siguientes y número de folio — convierte el fin del flujo en el inicio del seguimiento.

## 5. Recomendaciones priorizadas

- **P1 — Fidelidad (obligatorio):** corregir E1–E6; comprobante descargable; texto de cierre con fecha real (27 de agosto, 14:00) y calendario 2027.
- **P2 — Flujo (alto impacto):** drag-and-drop accesible; guardado/reanudación visible; edición desde confirmación; postulantes año anterior en el análisis por opción; verificación de nivel.
- **P3 — Diferenciales:** postulación en bloque simulada; consejo estratégico DA; simulador de escenarios "¿y si no quedo?"; enlaces al `/proceso` por etapa.

## 6. Prompt para Claude Code (VS Code)

```text
Lee primero CLAUDE.md, docs/investigacion/analisis_flujo_postulacion.md (completo),
docs/investigacion/investigacion_paso_a_paso_sae.md (§2.1 y §3) y
docs/planificacion/plan_mejora_sae.md antes de escribir código.

Tarea (code-agent, solo en sae-react/): rediseñar el flujo de /postulacion
(PostulacionPage.jsx) según el análisis, en este orden:

FASE 1 — Correcciones de fidelidad (P1, sección 2 del análisis):
1. E1: eliminar la afirmación de que solo se puede postular en la región de
   residencia; el selector de región pasa a ser un filtro de exploración con
   nota "puedes postular a colegios de otras comunas y regiones".
2. E2: eliminar el tope duro de 8 colegios; sin límite, con recomendación
   visible de incluir al menos 6 y refuerzo positivo al alcanzarlos.
3. E3: fecha límite real del Periodo Principal 2027: 27 de agosto, 14:00.
4. E4: reemplazar "5 días hábiles" por el rango real de la etapa de
   Resultados (15–21 de octubre de 2026).
5. E5: reescribir la nota del sorteo: desempate aleatorio por colegio
   (lotería independiente en cada establecimiento), sin "certificado por
   MINEDUC".
6. E6: presentar prioridades según el procesamiento real (PIE → hermanos →
   15 % prioritarios → funcionario → exalumno), aclarando que el 15 % es
   reserva de asientos, en lenguaje simple.
7. Comprobante descargable simulado (botón "Descargar comprobante", genera
   un archivo de texto/JSON con folio, lista ordenada, fechas siguientes) y
   aviso "tu postulación es válida cuando descargas el comprobante".

FASE 2 — Flujo (P2, sección 4 del análisis):
8. Reordenamiento drag-and-drop de la lista con alternativa por botones ↑↓
   (mantenerlos) y anuncio aria-live del nuevo orden. Sin librerías nuevas:
   HTML drag and drop nativo o pointer events.
9. Guardado visible del borrador: indicador "Borrador guardado" al cambiar
   la lista y aviso de reanudación al volver a la página con borrador.
10. Paso 3 con enlaces "Editar" por sección (identificación, prioridades,
    lista) que llevan al paso correspondiente sin perder estado.
11. En el análisis por colegio (ColegioAnalisis), mostrar postulantes del
    año anterior y vacantes por nivel desde el esquema v2 de colegios.js
    como fundamento del porcentaje estimado.
12. Confirmación explícita del nivel al vincular estudiante ("Verifica el
    curso: es el error más frecuente y puede afectar tu asignación").

FASE 3 — Diferenciales (P3, sección 4 del análisis):
13. Opción "¿Postulas a hermanos?" al vincular estudiante, que explica la
    postulación familiar en bloque y simula el reordenamiento automático.
14. Consejo estratégico en el paso 2: ordenar por preferencia real; aviso
    si la lista tiene menos de 6 opciones y todas de alta demanda.
15. Bloque "¿Y si no quedo en ninguna?" en el paso 3, con los dos casos
    (con/sin colegio de origen) y enlaces a /proceso.

Restricciones: seguir la UI vigente (español chileno con tuteo, nivel 6°
básico, mobile-first 375px, WCAG AA, paleta Mineduc). No cambiar stack ni
agregar dependencias. No inventar cifras: fechas y reglas salen de los dos
documentos de investigación citados. Comentarios en español con código de
trazabilidad: registrar la tarea como sección nueva S22 en
plan_mejora_sae.md y usar códigos S22-<inciso>.

Validación: npm run lint y npm run build limpios; probar el flujo completo
en viewport 375px, incluida navegación por teclado del reordenamiento.

Cierre: actualizar CLAUDE.md (Estado del proyecto), plan_mejora_sae.md y
avisar si algún cambio altera cifras citadas en la memoria (proyecto-tesis).
```

## 7. Fuentes

**Reglas oficiales del SAE:**

- [Paso a paso para postular](https://www.sistemadeadmisionescolar.cl/paso_a_paso_para_postular.html), [Postulación](https://www.sistemadeadmisionescolar.cl/postulacion.html), [Postulación familiar en bloque](https://www.sistemadeadmisionescolar.cl/postulacion_hermanos.html) — sitio oficial, consultados 2026-08-04.
- Calendario 2027 y etapas: `investigacion_paso_a_paso_sae.md`; algoritmo y prioridades: `investigacion_algoritmo_sae.md`.

**Problemas de la plataforma real:**

- [Reportan problemas en sitio del SAE en primer día para postular — Cooperativa](https://cooperativa.cl/noticias/pais/educacion/colegios/reportan-problemas-en-sitio-del-sae-en-primer-dia-para-postular-a-colegios/2025-08-05/112702.html)
- [Cómo funciona el SAE y por qué hay apoderados haciendo filas — La Tercera](https://www.latercera.com/servicios/noticia/como-funciona-el-sistema-de-admision-escolar-sae-y-por-que-hay-apoderados-haciendo-filas/QBLMM4JK2NHCTDB6NEYEMIDD7Y/)
- [Mitos y verdades de la plataforma — Subsecretaría de Educación](https://subeduc.mineduc.cl/sistema-de-admision-escolar-sae-los-mitos-y-verdades-de-la-plataforma-de-postulacion-a-colegios/)

**Referentes de diseño:**

- [MySchools NYC — caso de diseño (Blenderbox)](https://blenderbox.com/work/myschools-nyc/); [Submitting a High School Application in MySchools](https://enrollmentsupport.schools.nyc/app/answers/detail/a_id/3652/~/submitting-a-high-school-application-in-myschools)
- Buenas prácticas multipaso: [Growform](https://www.growform.co/must-follow-ux-best-practices-when-designing-a-multi-step-form/), [FormAssembly](https://www.formassembly.com/blog/multi-step-form-best-practices/), [Accesibilidad en formularios multipaso](https://www.accessibility.chat/articles/multi-step-forms-where-user-experience-and-accessibility-collide)
