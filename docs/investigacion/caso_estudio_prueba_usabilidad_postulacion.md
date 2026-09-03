# Caso de estudio para la prueba de usabilidad del flujo de postulación

**Fecha:** 2026-08-08 (actualizado 2026-08-13; **revisión mayor 2026-09-03**)
**Estado:** el profesor guía revisó el caso en la reunión del 2026-08-13 y dio el visto bueno general. Pidió tres cosas de seguimiento: (1) un guion de moderador para que Diego lo lea textualmente al presentar la prueba a cada participante — ver `guion_moderador_prueba_usabilidad.md` / el PDF correspondiente; (2) agregar un paso de **resultado inmediato** al final del flujo de postulación para poder observarlo dentro de la misma prueba (implementado el mismo día, ver §6, tarea 6, y la nota de código en `PostulacionPage.jsx`); (3) revisar la encuesta final para que cubra la reacción al resultado (ver §8.2, ítems C5 y F5, nuevos). El diseño de las advertencias/alertas que estaba pendiente en la versión anterior de este documento **ya se resolvió**: `investigacion_ux_guide_ai_systems.md` (2026-08-13) definió el criterio y sus 5 recomendaciones ya se implementaron en `PostulacionPage.jsx` el mismo día (ver §3.1 y §6, tarea 5). Los puntos abiertos que siguen sin resolver están en §9.

> **Revisión 2026-09-03 (bitácora `bitacora_flujo_postulacion_y_resultado.md`, Bloque O).** El caso **deja de usar la cuota de estudiante prioritario/a (SEP) y el PIE**: la familia Muñoz González ya no es prioritaria. Motivo: con la cuota SEP activa, `nivelPrioridadEnColegio` resolvía nivel ≤ 2 en los seis colegios y `probAsignacion(2, ·)` ≥ 88 % ≥ el umbral de asignación (65 %) → el colegio N.°1 de la lista **siempre** quedaba asignado, y el "colegio en mente" no producía ninguna tensión. Además, tratar la cuota SEP como si fuera un rango casi seguro es incorrecto en el mecanismo: es una reserva del 15 % de cupos, modelada como "sub-escuela", y está sobre-suscrita (54,7 % de los postulantes en 2018 para una cuota del 15 % — `investigacion_algoritmo_sae.md` §3.2 y §6). **No se recalibró la tabla `probAsignacion`** (núcleo protegido): la solución fue quitar SEP del caso y **subir Colegio San Martín a demanda alta**, con lo que el colegio en mente resuelve a nivel 5 (sorteo) y da **28 %** — incertidumbre genuina. Este documento refleja la revisión; los materiales para participantes (`material_prueba_usabilidad_postulacion.pdf`) y el guion del moderador deben re-sincronizarse en consecuencia, y el Cap. 3 de la memoria (`03_metodologia.tex`, que menciona "condición de estudiante prioritario/a del 15 %" en la descripción del caso) requiere actualización por el `writing-agent`.

## 1. Criterios del SAE que el caso debe cubrir

Según `investigacion_algoritmo_sae.md` (§3.2), el orden real de procesamiento es:

1. **PIE** (cuota, hasta 2 cupos por curso, se procesa antes que cualquier prioridad) — solo en colegios con programa validado.
2. **Hermano matriculado o admitido** en el establecimiento (prioridad legal 1).
3. **Estudiante prioritario** (cuota del 15 % por nivel, Registro Social de Hogares, tercio de menores ingresos) — se procesa inmediatamente después de hermanos.
4. **Hijo de funcionario** del establecimiento (prioridad legal 2).
5. **Exalumno** no expulsado (prioridad legal 3).
6. *(Cuota adicional, solo 7.º básico/1.º medio con examen: alta exigencia académica — ver nota de alcance en §4).*

**Qué activa este caso (revisión 2026-09-03):** los **tres grupos de prioridad legal por establecimiento** — hermano/a (Los Andes), funcionario/a (Villa del Sol), exalumno/a (República de Chile) —, cada uno en un colegio distinto, para mostrar que un vínculo vale **solo en el colegio donde existe**. El caso **no activa** las cuotas: ni PIE ni estudiante prioritario/a (15 %). La razón es de diseño de la prueba: una cuota transversal como la SEP eleva la probabilidad estimada en todos los colegios por igual y borra la tensión que el caso necesita (ver §3.1); dejar a la familia sin ninguna condición transversal hace que el "colegio en mente" (San Martín, sin vínculo y con demanda alta) tenga una probabilidad genuinamente baja. La distinción prioridad-legal / cuota se explica igual en el flujo, pero el caso ya no la ejercita en primera persona.

A esto se suman reglas estructurales que el caso debe ejercitar: sin tope de colegios y recomendación de listar al menos 6 (E2); se puede postular fuera de la comuna/región de residencia (E1); desempate aleatorio independiente por colegio (E5); postulación familiar en bloque con reordenamiento automático del hermano menor; y conservación del colegio de origen si no hay asignación en ninguna preferencia.

## 2. La familia ficticia: Muñoz González

Coherente con la persona Daniela González (35 años, RM, alfabetización digital básica-intermedia, acceso por móvil, percibe el SAE como "tómbola").

- **Apoderada:** Daniela González, 35 años.
- **Padre:** Rodrigo Muñoz — trabaja como asistente de aula en **Colegio Villa del Sol** (Peñalolén) → activa prioridad **funcionario** ahí.
- **Daniela** es exalumna de **Escuela República de Chile** (La Florida) → activa prioridad **exalumno** ahí.
- **Hija mayor (no postula este proceso):** Martina, 15 años, matriculada desde 2023 en **Colegio Los Andes** (La Florida) → activa prioridad **hermano** para sus hermanos menores si postulan ahí.
- **Hijos que postulan (Admisión 2027), en bloque familiar:**
  - **Sofía**, 9 años, 3.º básico actual en Escuela Básica Los Quillayes (su colegio de origen — conserva continuidad si no queda en otro). Es la estudiante que la persona vincula y sigue en el flujo.
  - **Mateo**, 12 años, 6.º básico, postula a 7.º básico. Activa el mecanismo de **postulación familiar en bloque** con Sofía (si el mayor procesado —Mateo— es admitido en un colegio, el sistema reordena automáticamente la lista de Sofía poniendo primero ese colegio).
- **Condiciones transversales:** ninguna. La familia **no** está en el tercio de menores ingresos del Registro Social de Hogares (no tiene cuota SEP) y Sofía **no** tiene PIE vigente. Sus únicas ventajas son los **vínculos por establecimiento** de arriba (hermano/a → Los Andes, funcionario/a → Villa del Sol, exalumno/a → República de Chile). Ver la nota de revisión 2026-09-03 en el encabezado.
- **El colegio que tienen en mente:** Daniela y Rodrigo quieren, además, incluir el **Colegio San Martín** (Maipú) — se los recomendó una vecina y les gustó el proyecto educativo cuando lo visitaron, aunque **no tienen ningún vínculo con él** (ni hermano, ni funcionario, ni exalumno) **y es un colegio de demanda alta** (muchos apoderados lo piden). Esa combinación —preferencia personal alta + cero prioridad + demanda alta— hace que su probabilidad estimada sea **baja (28 %)**, muy por debajo de la de Los Andes (92 %, por el hermano). Es el punto donde el caso pone a prueba las advertencias. Ver §3.1.

## 3. Lista de colegios a postular (usa los 6 colegios reales de `sae-react/src/data/colegios.js`)

`prob.` = probabilidad estimada que muestra el prototipo para el/la estudiante de este caso (`probAsignacion(nivel, demanda)`; umbral de asignación 65 %). La tabla `probAsignacion` **no se tocó** en la revisión 2026-09-03.

| # | Colegio | Comuna | Demanda | Vínculo de la familia | prob. |
|---|---|---|---|---|---|
| 1 | Colegio Los Andes | La Florida | Alta | **Hermano/a** (Martina matriculada ahí) → nivel 1 | **92 %** — el "seguro" |
| 2 | Colegio Villa del Sol | Peñalolén | Alta | **Funcionario/a** (el padre trabaja ahí) → nivel 3 | 65 % — justo en el umbral: "trabajo ahí pero es peleado" |
| 3 | Escuela República de Chile | La Florida | Baja | **Exalumno/a** (la madre) → nivel 4 | 96 % |
| 4 | Escuela Básica Los Quillayes | La Florida | Media | Colegio de origen de Sofía — la continuidad **no** se modela como prioridad → nivel 5 | 60 % — bajo umbral |
| 5 | Liceo Técnico Simón Bolívar | Puente Alto | Media | Sin vínculo; **fuera de la comuna de residencia** (testea E1: no hay restricción regional) → nivel 5 | 60 % — bajo umbral |
| 6 | **Colegio San Martín** | Maipú | **Alta** | **Ninguno** — el "colegio en mente" → nivel 5 (sorteo) | **28 %** — resultado incierto (ver §3.1) |

Con 6 colegios se cumple la recomendación oficial de listar al menos 6 (E2) y se cubren los tres grupos de prioridad legal (cada uno en su propio establecimiento), la regla de comuna/región, la continuidad de colegio de origen y la postulación familiar en bloque. **Escenario clave:** si la persona pone San Martín como 1.ª opción, 28 % < 65 % → no queda ahí → `calcularResultado` cae a Los Andes (2.ª opción, por el hermano, 92 %) y la página explica *"no quedaste en tu primera opción porque…"*.

### 3.1 El colegio en mente: por qué es el punto más importante del caso

Colegio San Martín no es solo el colegio "control" del set: es el que la familia **quiere de verdad**, sin que ese deseo esté respaldado por ninguna prioridad legal. Esta combinación —preferencia personal alta, favorabilidad algorítmica baja— es exactamente donde la desconfianza en el SAE ("tómbola") se vuelve concreta, y por eso es el mejor punto para observar si las advertencias de la página cumplen su función. Tres cosas distintas que la prueba debe distinguir, y que conviene tener claras antes de diseñar el texto de la alerta (aunque el diseño final dependa de los estudios que vas a indicar):

1. **Riesgo real (probabilidad):** San Martín tiene **demanda alta** (≈71 postulantes el año anterior contra 24–28 vacantes en básico) y ningún criterio de prioridad a favor de la familia → entra solo por el sorteo → probabilidad estimada **28 %**, muy por debajo de Los Andes (92 %, hermano) o República de Chile (96 %, exalumna). Esto sí amerita una advertencia informativa, y el 28 % debe mostrarse con su fundamento visible (postulantes año anterior, vacantes), no como cifra aislada (HAX G2).
2. **Falso riesgo estratégico (mito a corregir):** el Diseño de Aceptación Diferida es esencialmente a prueba de estrategia (`investigacion_algoritmo_sae.md`, §4.2): ubicar el colegio realmente preferido primero en la lista nunca perjudica a la familia frente al sistema, aunque tenga baja probabilidad. Si la familia cree que "es arriesgado ponerlo primero" y por eso lo esconde más abajo en la lista, la página debe corregir esa creencia, no reforzarla — es un matiz que separa a este prototipo de la explicación simplista del sitio oficial.
3. **Consejo complementario (ya implementado, S22):** la orientación estratégica del prototipo debe seguir sugiriendo agregar colegios de mayor probabilidad más abajo en la lista (los que sí tienen match de prioridad) como respaldo, no como reemplazo del colegio soñado.

**Actualización 2026-08-13 — esto ya no es solo un criterio de diseño, es el texto que la prueba va a evaluar.** `investigacion_ux_guide_ai_systems.md` §4 encontró que el paso 3 del prototipo contradecía directamente al paso 2: donde el paso 2 dice correctamente "ordena por tu preferencia real", el texto de probabilidad baja del paso 3 decía "considera ponerlo más abajo en tu lista" — es decir, reforzaba el mito exacto que este caso busca detectar. Las 5 recomendaciones de ese documento (§8) se implementaron el mismo día en `PostulacionPage.jsx` (comentario de trazabilidad `S22-14 (refinamiento)`): se retiró la sugerencia de reordenar, se separó el dato que fundamenta la probabilidad baja (demanda, y postulantes/vacantes cuando hay datos de nivel) de una frase explícita de que reordenar no cambia esa cifra ni las chances en los demás colegios, se extendió el formato de frecuencia ("de cada 100 postulantes...") a los tres niveles de probabilidad, y se agregó la categoría cualitativa "Certeza muy alta" para el caso de mayor certeza que rastrea el prototipo (hermano/a matriculado/a, prob. ≥90 %). **Pendiente de verificar:** el cambio se revisó manualmente pero `npm run lint` y `npm run build` no se ejecutaron (bloqueo de red del sandbox) — antes de correr la prueba con participantes reales hay que confirmar que el build está limpio.

Esto no cierra la necesidad de testear el caso San Martín — al contrario, la prueba es ahora la forma de verificar si el texto corregido efectivamente cambia el comportamiento observado, no solo si el texto es correcto en el papel. Durante la prueba, esto se observa mejor con pensar en voz alta: pedir a la persona que explique por qué ubicó San Martín donde lo ubicó, antes y después de ver la advertencia. Es la evidencia más directa de si el prototipo mejora la comprensión y la confianza frente al sistema real (la pregunta de investigación del Capítulo 1 de la memoria), y no solo la percepción general de la interfaz.

**Actualización 2026-09-03 — el escenario ahora ocurre de verdad en el simulador.** Antes, con la familia marcada como prioritaria (SEP), San Martín daba ~90 % y la persona quedaba asignada ahí aunque lo pusiera primero: el "riesgo" del que hablaba la advertencia no se materializaba nunca, y la lección de strategy-proofness quedaba abstracta. Tras quitar la cuota SEP del caso y subir San Martín a demanda alta, la probabilidad estimada es **28 %** y, si la persona lo pone 1.º, **no queda ahí** y el sistema la asigna a Los Andes en 2.ª preferencia. Así la prueba puede observar las tres reacciones posibles al resultado de la tarea 7 (sorpresa / desconfianza / comprensión) *sobre un desenlace real*, no hipotético. La lección sigue siendo la misma: ponerlo primero no le quitó nada en los demás colegios; solo reflejó que ahí no tenía ninguna ventaja.

## 4. Nota de alcance: alta exigencia académica

Esta cuota (30–85 % de cupos en colegios preseleccionados por Mineduc, solo 7.º básico/1.º medio, con examen) no está representada porque ningún colegio de `colegios.js` tiene esa modalidad hoy, y la persona Daniela no prioriza ese tipo de establecimiento. Queda como extensión opcional si decides testearla explícitamente — requeriría agregar un colegio con esa modalidad al set de datos.

## 5. Gap detectado en los datos del prototipo — RESUELTO

El gap original: `colegios.js` no distinguía `funcionario` ni `exalumno` como prioridades independientes. **Resuelto** (bitácora Bloque G, 2026-08-26): `colegios.js` ahora tiene el campo `casoPrioridades` por colegio (Los Andes → `['hermano']`, Villa del Sol → `['funcionario']`, República de Chile → `['exalumno']`, el resto `[]`), y `asignacion.js` resuelve el nivel de prioridad **por establecimiento** (`nivelPrioridadEnColegio`). En el flujo, al agregar cada colegio, la prioridad de la familia se **pre-siembra y se muestra de solo lectura** ("el sistema lo detecta, no lo pregunta", bitácora Bloque N4): San Martín, Simón Bolívar y Los Quillayes muestran *"No detectamos ningún vínculo… entras solo por el sorteo"*. El campo antiguo `prioritarios` (`hermano`/`cercano`/`nee`/`vulnerabilidad`) solo alimenta la ficha del colegio y **no** se cablea al algoritmo; `cercano` nunca fue un criterio de asignación en el prototipo.

## 6. Tareas dirigidas propuestas para la prueba

**Nota de preparación (2026-09-03).** El paso 1 del flujo gana varios elementos desde la versión anterior de este documento: un panel *"Esto es lo que el sistema ya sabe de tu hijo/a"* (lista los vínculos por establecimiento apenas se ingresa), campos para los **datos básicos del hermano/a** al marcar la postulación en bloque, y un atajo colapsado *"⚙️ Cargar caso de ejemplo"*. El moderador **puede usar ese botón antes de la sesión** para dejar precargados el nombre/RUN/nivel de Sofía, la dirección y los datos de Mateo — así la persona no pierde tiempo tipeando, pero **igual debe** leer el panel de condiciones detectadas, marcar la casilla "declaro ser apoderado/a legal" y pulsar "Vincular estudiante". En el paso 2, las prioridades por colegio ya salen resueltas de solo lectura (no hay que declararlas): San Martín, Simón Bolívar y Los Quillayes muestran *"No detectamos ningún vínculo… entras solo por el sorteo"*.

1. Identificarse como apoderado/a de Sofía y Mateo (vía ClaveÚnica simulada) y **leer el panel de condiciones detectadas** — probe: "¿Qué te dice la página que ya sabe de tu hijo/a? ¿Te calza con la tarjeta de familia?".
2. Buscar y agregar los 6 colegios de la Tabla del §3 a la lista.
3. Ordenar la lista según su propio criterio (sin ayuda) — el moderador observa si el orden refleja comprensión de riesgo o solo preferencia estética/cercanía, y en particular **dónde ubica a Colegio San Martín (el colegio en mente) y por qué**, pidiendo que lo verbalice (pensar en voz alta).
4. Activar la postulación familiar en bloque para ambos hijos (y completar los datos de Mateo si no vienen precargados).
5. Leer y reaccionar ante las advertencias de consecuencias que muestre la página en cada colegio y en el orden elegido — **texto corregido según `investigacion_ux_guide_ai_systems.md` (ver §3.1).** En Colegio San Martín la página muestra **28 % estimado** con *"entras solo por el sorteo: no tienes ninguna prioridad en este colegio"*. Además, un recuadro *"Con este orden, ¿dónde quedarías?"* (paso 2 y paso 3, actualizado 2026-09-03) anticipa la asignación estimada y aclara que **reordenar no cambia los porcentajes, pero sí en cuál colegio se queda**. Registrar específicamente si, tras leer todo esto, la persona cambia su orden por miedo a "perder posibilidades" (señal de que el texto no bastó para desactivar el mito del riesgo estratégico) o si mantiene su orden con mejor comprensión del motivo real (probabilidad baja porque no hay vínculo + demanda alta, no un castigo por ponerlo primero).
6. Confirmar y descargar el comprobante.
7. **Ver el resultado inmediato de la postulación (nuevo, 2026-08-13, por indicación del profesor guía) y reaccionar ante él.** Tras el comprobante, la página ofrece un botón "Ver mi resultado ahora →" que lleva a "Mi postulación". **Nota (2026-09-03):** desde el paso 2 la página ya muestra la **asignación estimada** con el orden actual (recuadro "Con este orden, ¿dónde quedarías?"), así que la predicción "a ciegas" ya no aplica. El probe pasa a ser: *"¿el resultado que ves aquí coincide con lo que la página te venía adelantando?"*. Preguntar también si la explicación de "por qué te asignaron este colegio" le hace sentido. **Desenlace más probable con este caso:** si puso San Martín primero, **no queda ahí** (28 %) y el sistema la asigna a **Colegio Los Andes en 2.ª preferencia** (por el hermano), con la explicación *"no quedaste en tu primera opción porque…"*. Observar si la reacción a *no* haber obtenido el colegio en mente es de sorpresa, desconfianza o comprensión — y si conecta ese desenlace con lo que la página ya le había mostrado (28 % + el recuadro del paso 2/3).
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
- C3. Entendí que tener un vínculo con un colegio (hermano/a matriculado/a, ser hijo/a de funcionario/a o exalumno/a) me da prioridad **solo en ese colegio**, no en todos. *(revisión 2026-09-03: antes el ítem preguntaba por la diferencia entre prioridades legales y la cuota de estudiante prioritario; el caso ya no ejercita la cuota SEP, así que el ítem se centra en lo que la persona sí ve — la prioridad por establecimiento).*
- C4. Pude explicar con mis propias palabras por qué Colegio San Martín mostró la probabilidad que mostró (28 %). *(se valida también por observación directa en la tarea 5, no solo por autorreporte)*
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
- Decidir si el paso de resultado inmediato (§6, tarea 7) debe entrar formalmente a la matriz de `plan_mejora_sae.md` como sección nueva (p. ej. S23) o queda fuera por ser funcionalidad exclusiva de la prueba. Mientras no lo definas, el código quedó comentado como "extensión fuera de la matriz" y **no** se tocó la cifra 87/87.

**Re-sincronización pendiente tras la revisión 2026-09-03 (caso ya no SEP/PIE, San Martín demanda alta):**
- `material_prueba_usabilidad_postulacion.pdf` — la **tarjeta de familia** y las instrucciones al participante todavía asumen familia prioritaria (SEP) con PIE. Regenerar.
- `guion_moderador_prueba_usabilidad.md` (y su PDF) — actualizado en lo esencial el 2026-09-03 (Tarea 1 con el atajo y el panel; nota de que San Martín muestra 28 %). Revisar de nuevo al regenerar el PDF.
- `proyecto-tesis/capitulos/03_metodologia.tex` — la descripción del caso menciona *"condición de estudiante prioritario/a del 15 %"* entre los criterios que la familia activa; ya no aplica. **Trabajo del `writing-agent`.**
- Este `.md` — regenerar su PDF (`caso_estudio_prueba_usabilidad_postulacion.pdf`).

**Ya resuelto (antes bloqueaba):**
- ~~`colegios.js` no distingue `funcionario`/`exalumno`~~ → resuelto, ver §5.
- ~~verificar `npm run lint`/`npm run build`~~ → la validación está automatizada: `npm run lint`, `npm run build` y `npm test` (12 tests que ejercitan `asignacion.js` + `colegios.js` con este caso) corren limpios; el guardarraíl "núcleo protegido" avisa si alguien toca la tabla `probAsignacion` o el umbral 65.
