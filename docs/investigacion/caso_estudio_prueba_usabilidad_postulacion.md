# Caso de estudio para la prueba de usabilidad del flujo de postulación

**Fecha:** 2026-08-08 (actualizado 2026-08-13)
**Estado:** el profesor guía revisó el caso en la reunión del 2026-08-13 y dio el visto bueno general. Pidió tres cosas de seguimiento: (1) un guion de moderador para que Diego lo lea textualmente al presentar la prueba a cada participante — ver `guion_moderador_prueba_usabilidad.md` / el PDF correspondiente; (2) agregar un paso de **resultado inmediato** al final del flujo de postulación para poder observarlo dentro de la misma prueba (implementado el mismo día, ver §6, tarea 6, y la nota de código en `PostulacionPage.jsx`); (3) revisar la encuesta final para que cubra la reacción al resultado (ver §8.2, ítems C5 y F5, nuevos). El diseño de las advertencias/alertas que estaba pendiente en la versión anterior de este documento **ya se resolvió**: `investigacion_ux_guide_ai_systems.md` (2026-08-13) definió el criterio y sus 5 recomendaciones ya se implementaron en `PostulacionPage.jsx` el mismo día (ver §3.1 y §6, tarea 5). Los puntos abiertos que siguen sin resolver están en §9.

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

**Actualización 2026-08-13 — esto ya no es solo un criterio de diseño, es el texto que la prueba va a evaluar.** `investigacion_ux_guide_ai_systems.md` §4 encontró que el paso 3 del prototipo contradecía directamente al paso 2: donde el paso 2 dice correctamente "ordena por tu preferencia real", el texto de probabilidad baja del paso 3 decía "considera ponerlo más abajo en tu lista" — es decir, reforzaba el mito exacto que este caso busca detectar. Las 5 recomendaciones de ese documento (§8) se implementaron el mismo día en `PostulacionPage.jsx` (comentario de trazabilidad `S22-14 (refinamiento)`): se retiró la sugerencia de reordenar, se separó el dato que fundamenta la probabilidad baja (demanda, y postulantes/vacantes cuando hay datos de nivel) de una frase explícita de que reordenar no cambia esa cifra ni las chances en los demás colegios, se extendió el formato de frecuencia ("de cada 100 postulantes...") a los tres niveles de probabilidad, y se agregó la categoría cualitativa "Certeza muy alta" para el caso de mayor certeza que rastrea el prototipo (hermano/a matriculado/a, prob. ≥90 %). **Pendiente de verificar:** el cambio se revisó manualmente pero `npm run lint` y `npm run build` no se ejecutaron (bloqueo de red del sandbox) — antes de correr la prueba con participantes reales hay que confirmar que el build está limpio.

Esto no cierra la necesidad de testear el caso San Martín — al contrario, la prueba es ahora la forma de verificar si el texto corregido efectivamente cambia el comportamiento observado, no solo si el texto es correcto en el papel. Durante la prueba, esto se observa mejor con pensar en voz alta: pedir a la persona que explique por qué ubicó San Martín donde lo ubicó, antes y después de ver la advertencia. Es la evidencia más directa de si el prototipo mejora la comprensión y la confianza frente al sistema real (la pregunta de investigación del Capítulo 1 de la memoria), y no solo la percepción general de la interfaz.

## 4. Nota de alcance: alta exigencia académica

Esta cuota (30–85 % de cupos en colegios preseleccionados por Mineduc, solo 7.º básico/1.º medio, con examen) no está representada porque ningún colegio de `colegios.js` tiene esa modalidad hoy, y la persona Daniela no prioriza ese tipo de establecimiento. Queda como extensión opcional si decides testearla explícitamente — requeriría agregar un colegio con esa modalidad al set de datos.

## 5. Gap detectado en los datos del prototipo

`colegios.js` tiene un campo `prioritarios` con tags (`hermano`, `cercano`, `nee`, `vulnerabilidad`) que **no distingue `funcionario` ni `exalumno`**, y usa `cercano` como si fuera un criterio de prioridad — cosa que el propio análisis de fidelidad (`analisis_flujo_postulacion.md`, error E1) ya identificó como algo que el SAE real no aplica. Antes de que este caso pueda ejecutarse contra el prototipo, `colegios.js` necesita actualizarse para modelar `funcionario` y `exalumno` como tags independientes y revisar si `cercano` debe eliminarse. Esto es trabajo de código (`sae-react/`, code-agent) — lo dejo señalado aquí, no lo modifico desde este documento.

## 6. Tareas dirigidas propuestas para la prueba

1. Identificarse como apoderado/a de Sofía y Mateo (vía ClaveÚnica simulada).
2. Buscar y agregar los 6 colegios de la Tabla 1 a la lista.
3. Ordenar la lista según su propio criterio (sin ayuda) — el moderador observa si el orden refleja comprensión de riesgo o solo preferencia estética/cercanía, y en particular **dónde ubica a Colegio San Martín (el colegio en mente) y por qué**, pidiendo que lo verbalice (pensar en voz alta).
4. Activar la postulación familiar en bloque para ambos hijos.
5. Leer y reaccionar ante las advertencias de consecuencias que muestre la página en cada colegio y en el orden elegido — **este es ahora el texto corregido según `investigacion_ux_guide_ai_systems.md` (ver §3.1), no un diseño pendiente.** Registrar específicamente si, tras leer la advertencia en Colegio San Martín, la persona cambia su orden por miedo a "perder posibilidades" (señal de que el texto corregido no bastó para desactivar el mito) o si mantiene su orden con mejor comprensión del motivo real (baja probabilidad, no riesgo estratégico). Esta tarea es, en la práctica, la prueba empírica de si la corrección de mensajería del 2026-08-13 cumple su objetivo.
6. Confirmar y descargar el comprobante.
7. **Ver el resultado inmediato de la postulación (nuevo, 2026-08-13, por indicación del profesor guía) y reaccionar ante él.** Tras el comprobante, la página ofrece un botón "Ver mi resultado ahora →" que lleva a "Mi postulación", con una nota explícita de que en el proceso real el resultado tarda hasta octubre y que aquí se adelanta solo para la prueba. Pedir a la persona que piense en voz alta: ¿el resultado coincide con lo que esperaba después de leer las probabilidades en el paso 3? ¿La explicación de "por qué te asignaron este colegio" le hace sentido? Si quedó en Colegio San Martín o no quedó en ninguna opción, es el momento de observar si la reacción es de sorpresa, desconfianza o comprensión.
8. Cuestionario post-tarea sobre comprensión, confianza y percepción de justicia — instrumento completo en §8, incluida la pregunta específica sobre el colegio en mente ya definida en la versión anterior de este documento: "¿sentiste que podías postular con confianza a tu colegio preferido aunque no tuvieras ventaja ahí?"

## 7. Metodología de la prueba

Lo que faltaba para que este caso fuera ejecutable, no solo diseñable.

### 7.1 Participantes

- **N objetivo: 8.** El estudio previo del mismo equipo (maqueta Figma del módulo de explicación, Capítulo 3 §3.2 de la memoria) usó 10 personas; 8 mantiene un orden de magnitud comparable dentro de las restricciones de tiempo de una memoria de título, y supera el mínimo de 5 con el que Nielsen documenta que se detecta ~85 % de los problemas de usabilidad en una prueba moderada.
- **Criterios de inclusión**, alineados con la persona Daniela González: (a) madre, padre o apoderado/a legal con al menos un hijo/a en edad de postular a educación parvularia, básica o media en Chile (no es necesario que postule este año — el caso usa datos ficticios); (b) autopercepción de alfabetización digital básica-intermedia, es decir, excluir explícitamente a personas con perfil técnico/UX que puedan evaluar la interfaz en vez de vivir el caso como usuario final; (c) acceso principal a internet vía smartphone.
- **Variable de contraste deseable, no excluyente:** mezclar participantes que ya postularon alguna vez al SAE real con participantes que nunca lo han hecho, para observar si la comprensión previa (o la desconfianza previa, "tómbola") cambia la lectura de las advertencias.
- **Reclutamiento:** por conveniencia/bola de nieve (red personal, no muestreo probabilístico) — limitación metodológica que hay que declarar explícitamente en el Capítulo 3 de la memoria, igual que se declaró para el estudio Figma previo.
- **Consentimiento:** al no manejarse datos sensibles reales (el caso es ficticio) ni intervenciones de riesgo, un consentimiento informado simple (verbal o escrito, con permiso de grabación de pantalla/audio) debería bastar — pero conviene confirmar contigo si UTFSM exige paso por comité de ética para este tipo de prueba de usabilidad dentro de una memoria de pregrado/postgrado.

### 7.2 Modalidad y duración

Sesión moderada individual, ~50–60 minutos:

| Bloque | Duración | Contenido |
|---|---|---|
| Bienvenida y consentimiento | 5 min | Explicar el propósito sin adelantar el caso San Martín (evitar sesgo de expectativa) |
| Cuestionario pre-tarea | 5 min | Perfil breve + ítem de línea base B1 (§8.1) |
| Tareas dirigidas 1–6 (§6) | 25–30 min | Pensar en voz alta; el moderador no ayuda salvo bloqueo total |
| Cuestionario post-tarea | 10 min | Batería Likert C/F/J + pregunta abierta sobre San Martín (§8.2) |
| Cierre | 5–10 min | Preguntas abiertas de cierre, agradecimiento |

Presencial es preferible a remoto: permite observar mejor el uso real en mobile (persona Daniela) y el pensar en voz alta durante el reordenamiento por arrastre. Remoto con pantalla compartida es la alternativa si la logística no lo permite.

### 7.3 Guion del moderador (esqueleto)

1. Contexto neutro: "Vas a simular la postulación de dos hijos al sistema de admisión escolar. No hay respuestas correctas, nos interesa cómo lo interpretas tú." (Sin mencionar San Martín, prioridades ni el objetivo de detectar el mito del riesgo estratégico.)
2. Entregar el perfil de la familia Muñoz González (§2) como tarjeta física o pantalla aparte, no dictado — que la persona lo lea a su ritmo.
3. Ejecutar tareas 1–7 de §6, con probes de pensar en voz alta ya definidos ahí (en particular tarea 3, tarea 5 y la nueva tarea 7 sobre el resultado).
4. Probe obligatorio si la persona reordena San Martín después de leer su advertencia: "¿Por qué lo moviste?" / "¿Qué crees que pasa si lo dejas donde estaba?" — sin corregir la respuesta en el momento.
5. Probe obligatorio al ver el resultado (tarea 7): "¿Esperabas este resultado? ¿Por qué crees que pasó esto?" — antes de que la persona lea la explicación contextualizada de la página, para comparar su hipótesis con el texto.
6. Cuestionario post-tarea (§8.2) y cierre.

**El texto completo, palabra por palabra, que Diego lee en cada sesión está en `docs/investigacion/guion_moderador_prueba_usabilidad.md` (y su versión en PDF) — este esqueleto queda como referencia de estructura, no como texto de lectura.**

## 8. Instrumento de medición

### 8.1 Línea base (pre-tarea)

Un solo ítem, para poder leer el resto de los resultados en contexto sin alargar la sesión:

> **B1.** Antes de usar esta plataforma, ¿qué tan de acuerdo estás con esta frase? *"El sistema de admisión escolar es como una tómbola: no se entienden bien sus reglas."* (1 = Totalmente en desacuerdo — 5 = Totalmente de acuerdo)

### 8.2 Post-tarea (escala Likert 1–5, Totalmente en desacuerdo a Totalmente de acuerdo)

Tres constructos, alineados con la pregunta de investigación del Capítulo 1 de la memoria (comprensión, confianza, percepción de justicia) y pensados para mantener comparabilidad temática con el estudio Figma previo (comprensión y confianza percibida), aunque ese estudio no dejó registrados los ítems exactos que usó.

**Comprensión**
- C1. Entendí para qué sirve cada uno de los tres pasos de la postulación.
- C2. Entendí por qué el sistema mostró una probabilidad distinta en cada colegio de mi lista.
- C3. Entendí la diferencia entre las prioridades legales (hermano, funcionario/a, exalumno/a, PIE) y la cuota de estudiante prioritario.
- C4. Pude explicar con mis propias palabras por qué Colegio San Martín mostró la probabilidad que mostró. *(se valida también por observación directa en la tarea 5, no solo por autorreporte)*
- C5. **(Nuevo, 2026-08-13)** Entendí por qué el resultado que vi fue ese, y no otro. *(mide si la explicación contextualizada de "Mi postulación" — reutilizada de `SeguimientoPage.jsx` — cumple su función en la tarea 7)*

**Confianza**
- F1. Confío en que el sistema asignará a mis hijos siguiendo las reglas que me mostró, no al azar.
- F2. **¿Sentiste que podías postular con confianza a tu colegio preferido (Colegio San Martín) aunque no tuvieras ninguna ventaja ahí?** *(ítem original de §6, tarea 8 — es el que más directamente mide si la corrección de §3.1 cumplió su objetivo)*
- F3. El orden en que puse mis colegios no me generó miedo de "perder posibilidades" en los demás.
- F4. Si el sistema no asigna a mis hijos en ningún colegio de mi lista, confío en que la plataforma me explica qué pasa después.
- F5. **(Nuevo, 2026-08-13)** El resultado que vi fue coherente con las probabilidades y explicaciones que había leído en el paso 3, antes de confirmar.

**Percepción de justicia**
- J1. Me pareció justo que el sistema use un sorteo aleatorio para desempatar entre postulantes con la misma prioridad.
- J2. Me pareció justa la razón por la que un colegio mostró probabilidad baja para mi caso.
- J3. Sentí que todas las familias juegan con las mismas reglas, tengan o no una prioridad legal.

Cierre abierto (no Likert): "¿Hubo algo que te generó desconfianza o que no entendiste, aunque no te lo haya preguntado recién?" — para capturar hallazgos fuera del instrumento.

## 9. Pendiente de tu parte

- Confirmar si el caso se prueba con un solo grupo de 8 participantes (§7.1) o si conviene dividirlo en variantes (p. ej. un subgrupo ve solo el caso de Sofía sin el bloque familiar, para aislar esa variable) — mi recomendación es un solo grupo por restricción de tiempo, dejando la variante como extensión si sobran recursos.
- Decidir si se aborda la alta exigencia académica (§4) o queda fuera de alcance.
- Confirmar si UTFSM requiere paso por comité de ética para esta prueba (§7.1).
- Antes de reclutar participantes: verificar que `npm run lint` y `npm run build` corren limpios tras el cambio de mensajería del 2026-08-13 (pendiente señalado en §3.1) **y** tras el paso de resultado inmediato agregado el mismo día (§6, tarea 6-7) — ninguno de los dos se pudo correr en el sandbox de esta sesión (el registro de npm está bloqueado ahí; ver nota en `CONTEXTO_CLAUDE_CODE.md`). Hazlo en tu máquina con `npm install && npm run lint && npm run build` antes de reclutar — de lo contrario la prueba se ejecutaría contra un build no validado.
- Decidir si el paso de resultado inmediato (nuevo, §6 tarea 7) debe entrar formalmente a la matriz de `plan_mejora_sae.md` como una sección nueva (p. ej. S23) o si queda fuera de la matriz por ser una funcionalidad exclusiva para la prueba de usabilidad, no para el prototipo "en producción". Mientras no lo definas, el código quedó comentado como "extensión fuera de la matriz" y **no** se tocó la cifra 87/87 citada en la memoria.
- Recordatorio heredado de la versión anterior de este documento, todavía sin resolver: `colegios.js` no distingue tags `funcionario`/`exalumno` (§5) — es trabajo de `sae-react/` (code-agent), no de este documento, pero bloquea que el caso se ejecute contra el prototipo real tal como está descrito en §2–§3.
