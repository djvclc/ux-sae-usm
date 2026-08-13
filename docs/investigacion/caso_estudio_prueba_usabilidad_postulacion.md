# Caso de estudio para la prueba de usabilidad del flujo de postulación

**Fecha:** 2026-08-08
**Estado:** propuesta para discusión — el diseño de las advertencias/alertas en pantalla queda pendiente de los estudios que indicarás. Este documento resuelve la otra mitad: un caso que active todos los criterios legales del SAE dentro de una sola familia ficticia, para poder testear comprensión, confianza y percepción de justicia sobre el flujo real de `/postulacion`.

## 1. Criterios del SAE que el caso debe cubrir

Según `investigacion_algoritmo_sae.md` (§3.2), el orden real de procesamiento es:

1. **PIE** (cuota, hasta 2 cupos por curso, se procesa antes que cualquier prioridad) — solo en colegios con programa validado.
2. **Hermano matriculado o admitido** en el establecimiento (prioridad legal 1).
3. **Estudiante prioritario** (cuota del 15 % por nivel, Registro Social de Hogares, tercio de menores ingresos) — se procesa inmediatamente después de hermanos.
4. **Hijo de funcionario** del establecimiento (prioridad legal 2).
5. **Exalumno** no expulsado (prioridad legal 3).
6. *(Cuota adicional, solo 7.º básico/1.º medio con examen: alta exigencia académica — ver nota de alcance en §4).*

A esto se suman reglas estructurales que el caso debe ejercitar: sin tope de colegios y recomendación de listar al menos 6 (E2); se puede postular fuera de la comuna/región de residencia (E1); desempate aleatorio independiente por colegio (E5); postulación familiar en bloque con reordenamiento automático del hermano menor; y conservación del colegio de origen si no hay asignación en ninguna preferencia.

## 2. La familia ficticia: Muñoz González

Coherente con la persona Daniela González (35 años, RM, alfabetización digital básica-intermedia, acceso por móvil, percibe el SAE como "tómbola").

- **Apoderada:** Daniela González, 35 años.
- **Padre:** Rodrigo Muñoz — trabaja como asistente de aula en **Colegio Villa del Sol** (Peñalolén) → activa prioridad **funcionario** ahí.
- **Daniela** es exalumna de **Escuela República de Chile** (La Florida) → activa prioridad **exalumno** ahí.
- **Hija mayor (no postula este proceso):** Martina, 15 años, matriculada desde 2023 en **Colegio Los Andes** (La Florida) → activa prioridad **hermano** para sus hermanos menores si postulan ahí.
- **Hijos que postulan (Admisión 2027), en bloque familiar:**
  - **Sofía**, 9 años, 3.º básico actual en Escuela Básica Los Quillayes (su colegio de origen — conserva continuidad si no queda en otro). Tiene un Trastorno Específico del Lenguaje con **PIE vigente**: es el caso principal del test.
  - **Mateo**, 12 años, 6.º básico, postula a 7.º básico. Activa el mecanismo de **postulación familiar en bloque** con Sofía (si el mayor procesado —Mateo— es admitido en un colegio, el sistema reordena automáticamente la lista de Sofía poniendo primero ese colegio).
- **Situación socioeconómica:** familia registrada en el tercio de menores ingresos del Registro Social de Hogares → cuota de **estudiante prioritario (15 %)** aplica de forma transversal en cualquier colegio que postulen, no solo en uno.
- **El colegio que tienen en mente:** Daniela y Rodrigo quieren, además, incluir el **Colegio San Martín** (Maipú) — se los recomendó una vecina y les gustó el proyecto educativo cuando lo visitaron, aunque no tienen ningún vínculo con él (ni hermano, ni funcionario, ni exalumno, ni PIE). Es justo el colegio que hoy hace de "control" en la Tabla 1: se mantiene ese rol, pero ahora con una motivación real detrás (preferencia personal, no ventaja algorítmica), que es lo que este caso necesita para poner a prueba las advertencias. Ver §3.1.

## 3. Lista de colegios a postular (usa los 6 colegios reales de `sae-react/src/data/colegios.js`)

| # | Colegio | Comuna | Categoría | Qué activa en el caso |
|---|---|---|---|---|
| 1 | Colegio Los Andes | La Florida | Alto | Hermano (Martina) + PIE (Sofía) + prioritario 15 % — tres criterios apilados en un solo colegio, útil para testear cómo se comunica una probabilidad alta |
| 2 | Colegio Villa del Sol | Peñalolén | Alto | Funcionario (padre) + prioritario 15 % |
| 3 | Escuela República de Chile | La Florida | Medio-Bajo | Exalumno (madre) + prioritario 15 % |
| 4 | Escuela Básica Los Quillayes | La Florida | Medio | Colegio de origen de Sofía (continuidad garantizada) + prioritario 15 % — testea la regla "conserva tu colegio si no quedas en otro" |
| 5 | Liceo Técnico Simón Bolívar | Puente Alto | Medio | Sin prioridad familiar directa, solo prioritario 15 % — **fuera de la comuna de residencia**, testea E1 (no hay restricción regional); nivel básico cubre la transición de Mateo |
| 6 | Colegio San Martín | Maipú | Medio | **El colegio que tienen en mente los padres** (preferencia personal, se lo recomendó una vecina): ninguna prioridad familiar, solo prioritario 15 % transversal — ver §3.1 |

Con 6 colegios se cumple la recomendación oficial de listar al menos 6 (E2) y se cubren los tres grupos de prioridad legal, las dos cuotas relevantes a la edad de los niños, la regla de comuna/región, la continuidad de colegio de origen y la postulación familiar en bloque.

### 3.1 El colegio en mente: por qué es el punto más importante del caso

Colegio San Martín no es solo el colegio "control" del set: es el que la familia **quiere de verdad**, sin que ese deseo esté respaldado por ninguna prioridad legal. Esta combinación —preferencia personal alta, favorabilidad algorítmica baja— es exactamente donde la desconfianza en el SAE ("tómbola") se vuelve concreta, y por eso es el mejor punto para observar si las advertencias de la página cumplen su función. Tres cosas distintas que la prueba debe distinguir, y que conviene tener claras antes de diseñar el texto de la alerta (aunque el diseño final dependa de los estudios que vas a indicar):

1. **Riesgo real (probabilidad):** San Martín tiene demanda moderada (44 postulantes el año anterior contra 28–32 vacantes en básico) y ningún criterio de prioridad a favor de la familia — su probabilidad de quedar ahí es más baja que en los colegios con hermano, funcionario, exalumno o PIE. Esto sí amerita una advertencia informativa.
2. **Falso riesgo estratégico (mito a corregir):** el Diseño de Aceptación Diferida es esencialmente a prueba de estrategia (`investigacion_algoritmo_sae.md`, §4.2): ubicar el colegio realmente preferido primero en la lista nunca perjudica a la familia frente al sistema, aunque tenga baja probabilidad. Si la familia cree que "es arriesgado ponerlo primero" y por eso lo esconde más abajo en la lista, la página debe corregir esa creencia, no reforzarla — es un matiz que separa a este prototipo de la explicación simplista del sitio oficial.
3. **Consejo complementario (ya implementado, S22):** la orientación estratégica del prototipo debe seguir sugiriendo agregar colegios de mayor probabilidad más abajo en la lista (los que sí tienen match de prioridad) como respaldo, no como reemplazo del colegio soñado.

Durante la prueba, esto se observa mejor con pensar en voz alta: pedir a la persona que explique por qué ubicó San Martín donde lo ubicó, antes y después de ver la advertencia. Es la evidencia más directa de si el prototipo mejora la comprensión y la confianza frente al sistema real (la pregunta de investigación del Capítulo 1 de la memoria), y no solo la percepción general de la interfaz.

## 4. Nota de alcance: alta exigencia académica

Esta cuota (30–85 % de cupos en colegios preseleccionados por Mineduc, solo 7.º básico/1.º medio, con examen) no está representada porque ningún colegio de `colegios.js` tiene esa modalidad hoy, y la persona Daniela no prioriza ese tipo de establecimiento. Queda como extensión opcional si decides testearla explícitamente — requeriría agregar un colegio con esa modalidad al set de datos.

## 5. Gap detectado en los datos del prototipo

`colegios.js` tiene un campo `prioritarios` con tags (`hermano`, `cercano`, `nee`, `vulnerabilidad`) que **no distingue `funcionario` ni `exalumno`**, y usa `cercano` como si fuera un criterio de prioridad — cosa que el propio análisis de fidelidad (`analisis_flujo_postulacion.md`, error E1) ya identificó como algo que el SAE real no aplica. Antes de que este caso pueda ejecutarse contra el prototipo, `colegios.js` necesita actualizarse para modelar `funcionario` y `exalumno` como tags independientes y revisar si `cercano` debe eliminarse. Esto es trabajo de código (`sae-react/`, code-agent) — lo dejo señalado aquí, no lo modifico desde este documento.

## 6. Tareas dirigidas propuestas para la prueba

1. Identificarse como apoderado/a de Sofía y Mateo (vía ClaveÚnica simulada).
2. Buscar y agregar los 6 colegios de la Tabla 1 a la lista.
3. Ordenar la lista según su propio criterio (sin ayuda) — el moderador observa si el orden refleja comprensión de riesgo o solo preferencia estética/cercanía, y en particular **dónde ubica a Colegio San Martín (el colegio en mente) y por qué**, pidiendo que lo verbalice (pensar en voz alta).
4. Activar la postulación familiar en bloque para ambos hijos.
5. Leer y reaccionar ante las advertencias de consecuencias que muestre la página en cada colegio y en el orden elegido — **este es el punto que depende del diseño basado en los estudios que indicarás.** Registrar específicamente si, tras ver la advertencia en Colegio San Martín, la persona cambia su orden por miedo a "perder posibilidades" (señal de que no entendió que el sistema no penaliza poner primero el colegio realmente preferido) o si mantiene su orden con mejor comprensión del motivo real (baja probabilidad, no riesgo estratégico).
6. Confirmar y descargar el comprobante.
7. Cuestionario/entrevista post-tarea sobre comprensión, confianza y percepción de justicia (escala Likert, para mantener comparabilidad con el estudio previo citado en el Capítulo 3 de la memoria), agregando una pregunta específica sobre el colegio en mente: "¿sentiste que podías postular con confianza a tu colegio preferido aunque no tuvieras ventaja ahí?"

## 7. Pendiente de tu parte

- Instrucciones sobre los estudios que deben regir el diseño de las advertencias/alertas (mencionaste que las enviarás en breve).
- Confirmar si el caso se prueba con un solo grupo de participantes o si conviene dividirlo en variantes (p. ej. un subgrupo ve solo el caso de Sofía sin el bloque familiar, para aislar esa variable).
- Decidir si se aborda la alta exigencia académica (§4) o queda fuera de alcance.
