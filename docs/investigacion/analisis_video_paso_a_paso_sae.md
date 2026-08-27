# Análisis del video oficial "Paso a paso de Sistema de Admisión Escolar"

**Fecha:** 2026-08-27
**Fuente:** Video del canal oficial del Ministerio de Educación de Chile ([@mineducchile](https://www.youtube.com/@mineducchile)), título *"Paso a paso de Sistema de Admisión Escolar 2025"* (`youtube.com/watch?v=beu4FjEJY2Y`). Narradora: Francisca Vázquez, Coordinadora Nacional de Reconocimiento y Admisión Escolar, MINEDUC. Duración ~6:33.
**Método:** transcripción de los subtítulos automáticos del video (obtenida en la sesión del 2026-08-27) y contraste con el flujo del prototipo (`sae-react/src/pages/PostulacionPage.jsx`), `investigacion_paso_a_paso_sae.md` y `analisis_flujo_postulacion.md`.
**Propósito:** obtener el **inventario estructural** del flujo real de postulación (pantallas, campos que se rellenan, información en pantalla, aceptaciones obligatorias) para usarlo como **checklist de fidelidad** del prototipo, no como guía de diseño. Complementa —no reemplaza— al informe heurístico Fondecyt, que evalúa defectos de UX y no levanta este inventario.

> Nota de vigencia: el video corresponde a Admisión **2025**. El procedimiento (pasos, campos, aceptaciones) es estable año a año; **las fechas no** — el prototipo usa el calendario de Admisión 2027 (cierre 27 de agosto de 2026, 14:00; resultados 15–21 de octubre de 2026), correcto según `investigacion_paso_a_paso_sae.md`. La discrepancia de fechas con el video (2–30 de agosto de 2025) es esperada.

---

## 1. Inventario del flujo real (según el video)

### Paso 1 — Registro como apoderado/a (cuenta, previo al flujo)
- El apoderado/a debe estar **registrado** en la plataforma (enlace en el extremo superior derecho del sitio).
- Usuario nuevo: ingresa datos personales y **crea una contraseña**. El **correo electrónico es crítico**: por ahí se envía toda la información durante el proceso.
- Quien participó en años anteriores **ya tiene usuario** y no vuelve a registrarse.

### Paso 2 — Ingreso e identificación del postulante
- Login del apoderado/a con **RUT o IPA** (identificador provisorio, para quienes no tienen RUT) **+ contraseña**.
- Recuperación de contraseña por el botón "recuperar contraseña" → instrucciones al correo.
- Ya dentro, se ingresan **los datos del postulante: su RUN y su dirección**.
- Se despliega una pantalla para seleccionar **región, comuna y dirección de residencia del estudiante**.
- El paso se cierra marcando la casilla **"declaro ser apoderado del postulante"** y haciendo clic en **"agregar postulante"**.

### Paso 3 — Elección del establecimiento
- **Advertencia inicial (alto riesgo):** postular **solo si se necesita o se desea cambiar** de establecimiento. Si el estudiante postula a un nuevo establecimiento y **queda asignado, pierde de inmediato el cupo en su colegio actual, independiente de si acepta o rechaza** la asignación.
- Estudiantes cuyo establecimiento **no tiene continuidad** para el año siguiente (ej.: 8° básico en un colegio sin enseñanza media) **deben** postular por el SAE.
- **Búsqueda de establecimientos:** se despliegan las escuelas/liceos de la comuna y región seleccionadas y **del nivel** al que postula el estudiante. Se puede cambiar región y comuna para postular a otros colegios.
- Visualización **en lista o en mapa**.
- **Botón "filtros":** tipo de jornada · establecimientos mixtos o de un solo género · públicos o particulares subvencionados · con Programa de Integración Escolar (PIE) · con internado · con Subvención Escolar Preferencial (SEP) · técnico-profesional · con continuidad hasta enseñanza media.
- Al seleccionar un colegio se muestra: **proyecto educativo, infraestructura, desempeño** (según aprendizajes), **convivencia**, **vacantes referenciales por curso**, **número de postulantes del año anterior** (para saber si el curso tiene alta demanda), **programas extracurriculares** y **galería de fotos**.
- Si se elige un colegio de alta demanda y pocas vacantes referenciales, la plataforma sugiere **agregar más establecimientos** a la lista.
- **Agregar establecimiento:** al agregar una escuela/liceo hay que **aceptar el tipo de jornada** y **aceptar la adhesión al proyecto educativo y al reglamento interno**.
- Sugerencia: **agregar al menos 6 establecimientos** en orden de preferencia para aumentar las posibilidades de cupo.
- "Este proceso requiere que tengas toda la información. Tómate el tiempo que necesites. **No hay diferencia entre postular el primer o el último día** del proceso."
- **Reordenar:** con las **flechas** ubicadas bajo la leyenda "preferencias"; se ve el número de preferencia y se sube/baja cada colegio. En la misma pantalla se pueden **eliminar** establecimientos y seguir agregando. **No hay límite** de escuelas/liceos.
- **Enviar:** cuando la lista está completa y ordenada, **"enviar postulación"** → **"aceptar"** → **descargar el comprobante** del proceso.
- **Modificación:** durante todo el período de postulación se puede modificar cuantas veces se quiera, pero **siempre hay que reenviar la postulación y obtener el comprobante actualizado**.

---

## 2. Cruce con el prototipo — brechas detectadas

Estado del prototipo verificado en `sae-react/src/pages/PostulacionPage.jsx` al 2026-08-27.

| # | En el flujo real | En el prototipo hoy | Clasificación |
|---|---|---|---|
| **A** | Casilla **"declaro ser apoderado del postulante"** antes de "agregar postulante" | No existe. Solo el texto "ClaveÚnica verifica que eres el/la apoderado/a legal" | **Indispensable** — declaración legal explícita, bajo costo |
| **B** | **Dirección de residencia del estudiante**: región + comuna + calle | Solo región, y como *filtro de exploración* (S22-1). No se captura comuna ni dirección | **Indispensable** — dato que el sistema real pide y que acota la búsqueda. Más grande (capturar y posiblemente usar). **Queda como decisión aparte.** |
| **C** | Al agregar un colegio: **aceptar la jornada** + **aceptar la adhesión al proyecto educativo y al reglamento interno** | No hay gates de aceptación al agregar (solo confirmación de nivel al vincular estudiante, S22-12) | **Indispensable** — interacción concreta y consecuente ausente |
| **D** | Advertencia **"si quedas asignado pierdes tu cupo actual, aceptes o rechaces"** + obligación de postular sin continuidad, al inicio de la elección de colegios | `/proceso` tiene "reglas de alto riesgo"; el flujo de postulación **no** muestra esto antes de armar la lista | **Indispensable** — información de mayor riesgo del proceso |
| **E** | Al **modificar**: reenviar la postulación y **descargar el comprobante actualizado** (el anterior queda obsoleto) | Dice "puedes modificar hasta el cierre" pero no que hay que reenviar ni que el comprobante previo se invalida | **Deseable-alto** |
| **F** | Obligación de postular si el colegio **no tiene continuidad** de nivel | `/proceso` lo menciona; el flujo no | **Deseable** (se cubre parcialmente con D) |
| **G** | **IPA** como alternativa al RUT en el login | Solo RUT | **Deseable** — menor para un prototipo pedagógico |
| **H** | Vista **mapa** de establecimientos | Solo lista + comparador | **Fuera de alcance** — mobile-first, catálogo de 6 colegios |
| **I** | **Filtros**: jornada, género, internado, técnico-profesional, público/particular, continuidad hasta media | InicioPage filtra por texto/comuna/nivel + "ordenar por" (SIMCE/vacantes/distancia/demanda) + "PIE incluido" | **Deseable** (S5 encontrabilidad) — varios existen como campos del colegio (`jornada`, `dependencia`, `orientacion`), no como filtros |

### Ya cubierto / correcto en el prototipo
- Comprobante descargable (S22-7), sin límite de colegios (S22-2), recomendación de al menos 6 (S22-2), reordenamiento con flechas + arrastrar (S22-8), "no hay diferencia entre postular temprano o tarde" (implícito en la orientación estratégica S22-14), vacantes referenciales + postulantes del año anterior en la ficha y en `ColegioAnalisis` (S22-11), el correo como canal de resultados (línea ~1367: "Recibirás una notificación en el correo que registraste").
- Ficha de colegio (`ColegioPage`): proyecto educativo, desempeño/categoría, SIMCE, extracurriculares. Sin galería de fotos por decisión de diseño (S18 — ilustraciones SVG en vez de fotos externas). "Infraestructura" y "convivencia" como dimensiones explícitas: parciales.

---

## 3. ¿Basta con el informe heurístico?

No para este propósito. El informe heurístico Fondecyt evalúa **defectos de UX contra heurísticas** (y da el 61 % de la plataforma), pero no levanta un **inventario de pantallas, campos y aceptaciones obligatorias**. Son artefactos distintos:
- Informe heurístico → *qué está mal en la UX* (defectos, con puntaje).
- Este documento + `investigacion_paso_a_paso_sae.md` → *qué contiene el flujo* (estructura, línea base de fidelidad).

La transcripción del video cubre ~80 % del inventario a nivel narrativo. Un **PDF con pantallazos** aún agregaría: rótulos exactos de campos, microcopy en pantalla, mensajes de validación/error y la **redacción exacta de las casillas de aceptación** (brecha C). No es bloqueante para implementar A, C y D; conviene tenerlo antes de afinar el texto de esas casillas.

---

## 4. Recomendación

**Ciclo actual (fidelidad, sin tocar la lógica de asignación, sin sumar puntos al plan):**
- **A** — casilla "declaro ser apoderado/a del postulante" en el paso 1, obligatoria para continuar.
- **C** — al agregar un colegio en el paso 2, aceptar la jornada + la adhesión al proyecto educativo y al reglamento interno.
- **D** — aviso prominente al inicio del paso 2: postular solo si se necesita; si queda asignado pierde el cupo actual (acepte o rechace); obligación de postular sin continuidad.

**Decisión aparte:** **B** (capturar comuna + dirección de residencia del estudiante) — es más grande porque implica capturar el dato y decidir si se usa (proximidad). No entra en este ciclo salvo indicación explícita.

**Seguimiento menor:** E (reenvío + comprobante actualizado al modificar), F, G, I. H fuera de alcance.

Fuente de origen para la bitácora de trazabilidad: este documento (`analisis_video_paso_a_paso_sae.md`), fidelidad al SAE real.
