# Qué preguntarle a quien hace la prueba: tipo de prueba y banco de preguntas

**Fecha:** 2026-10-01 · **Estado:** propuesta para revisar con la profesora guía · **No modifica** `caso_estudio_prueba_usabilidad_postulacion.md` ni el material del participante: este documento propone cambios y deja la decisión al autor.

**Punto de partida.** El diseño ya está decidido (caso de estudio §6–§8): estudio comparativo **entre-sujetos**, N≈30 (~15 por condición), condición A (con explicaciones) vs. B (sin explicaciones), lista y orden fijos, mismo desenlace (San Martín 1.º, ≈26 % → Colegio Los Andes en 2.ª preferencia), 8 tareas, B1 como covariable, Likert de 13 ítems (C1–C5 / F1–F5 / J1–J3) y 2 preguntas abiertas. **No se propone cambiar el diseño**, sino reforzar *qué* y *cómo* se pregunta para que la comparación A vs. B mida lo que dice medir.

---

## 1. Resumen en una página

| Pregunta | Respuesta corta |
|---|---|
| **¿Qué tipo de prueba es?** | Una **prueba de usabilidad comparativa y moderada** (sumativa, no formativa) con un **test de comprensión** incorporado. No es una prueba de "encontrar problemas" con 5–8 personas: es un experimento pequeño entre dos grupos. |
| **¿Qué falta hoy en el instrumento?** | Todo lo que mide comprensión es **autorreporte** ("entendí…", "puedo explicar…"). Falta medir comprensión **demostrada**: preguntas con respuesta correcta y preguntas de predicción ("¿qué pasaría si…?"). |
| **¿Qué tipos de preguntas usar?** | Seis familias (§3): (1) perfil y covariables, (2) preguntas durante la tarea (pensar en voz alta + probes neutros), (3) **predicción del resultado**, (4) **comprensión objetiva y de transferencia**, (5) escalas de percepción (Likert: comprensión subjetiva, confianza, justicia) + usabilidad/esfuerzo como control, (6) preguntas abiertas y "explícaselo a otra persona". |
| **¿En qué orden?** | Primero lo que no se puede "contaminar": predicción → comprensión objetiva → Likert → usabilidad → abiertas. Hoy los ítems Likert C3 y F2 **dicen la respuesta** (enuncian la regla), así que deben ir *después* del test objetivo. |
| **Cambio más importante** | Agregar un **test de comprensión de 8 preguntas con respuesta correcta** (§4.4). Es la medida más fuerte para H1 y la que la literatura de explicabilidad recomienda. |
| **Segundo más importante** | Usar **los mismos probes en A y en B** durante las tareas. Hoy la tarea 4 tiene probes distintos por condición, lo que mezcla el efecto de la interfaz con el de la pregunta. |

---

## 2. Tipo de prueba

### 2.1 Qué es y qué no es

- **Es sumativa-comparativa.** Responde *"¿la versión A hace que la gente entienda y confíe más que la B?"*, no *"¿qué problemas tiene la interfaz?"*. Por eso necesita medidas **iguales en ambos grupos** y que se puedan comparar con números (U de Mann-Whitney, tamaño de efecto — ya planificado en §8.5 del caso).
- **Tiene un componente cualitativo**, que se mantiene: pensar en voz alta, probes y preguntas abiertas explican el *por qué* de las diferencias (H4, mito del riesgo estratégico).
- **No es una prueba A/B en producción** (no hay tráfico real) ni un experimento de laboratorio de economía (no hay incentivos monetarios por responder bien). Sí toma de esa literatura la forma de medir comprensión (§2.3).

### 2.2 Pensar en voz alta: cuidado con usarlo de forma distinta en A y B

La literatura de usabilidad compara el pensar en voz alta **simultáneo** (mientras se hace la tarea) con el **retrospectivo** (después, viendo la grabación). Ambos encuentran conjuntos parecidos de problemas, pero el simultáneo **puede bajar el desempeño en tareas complejas** y el retrospectivo interfiere menos con la tarea (van den Haak, de Jong y Schellens, 2003).

Para un estudio comparativo esto importa por dos razones:

1. **Pensar en voz alta cambia cómo se lee.** Quien narra lee con más atención; eso puede ayudar más a A (que tiene más texto que leer) que a B. Si además el moderador hace probes distintos en cada condición, ya no se sabe si la diferencia vino de la interfaz o de las preguntas.
2. **El costo es desigual:** A tiene más contenido, así que narrar en A cansa más. Esto puede jugar en contra de A en las escalas de esfuerzo.

**Recomendación:** mantener el pensar en voz alta simultáneo (ya está en el guion y es lo que permite H4), pero:
- con **la misma consigna** y **los mismos probes en A y en B** (§4.2);
- sin probes "de ayuda" durante la lectura: solo en los puntos fijos del guion;
- dejar las preguntas de comprensión **para después de las tareas**, por escrito, no como probe oral.

### 2.3 Qué dice la literatura sobre cómo medir si se entendió una explicación

| Fuente | Qué aporta a esta prueba |
|---|---|
| **Hoffman, Mueller, Klein y Litman (2023)**, *Measures for explainable AI* (Frontiers in Computer Science 5). | Separa seis cosas que se suelen mezclar: calidad de la explicación, **satisfacción** con ella, **modelo mental** del usuario, curiosidad, **confianza** y **desempeño**. Propone la *Explanation Satisfaction Scale* (Likert) y métodos para sacar el modelo mental (pedir que la persona explique el sistema, predicciones). → Hoy el instrumento mide satisfacción/confianza, pero casi no mide el modelo mental. |
| **Hase y Bansal (2020)**, *Evaluating Explainable AI: Which Algorithmic Explanations Help Users Predict Model Behavior?* (ACL). | Define **simulabilidad**: entiendes un sistema si puedes **predecir lo que hará** con un caso nuevo (*forward simulation*) o con un cambio al caso (*counterfactual simulation*). → Base de las preguntas de predicción y de "¿qué pasaría si…?" (§4.3–§4.4). |
| **Kulesza et al. (2013)**, *Too much, too little, or just right?* (VL/HCC). | Explicaciones más **completas** mejoraron la fidelidad del modelo mental de usuarios no expertos más que explicaciones más "exactas" pero parciales. Mide el modelo mental con preguntas de comprensión puntuadas. → Justifica puntuar comprensión con preguntas con respuesta correcta. |
| **Gonczarowski, Heffetz, Ishai y Thomas (2024)**, *Describing Deferred Acceptance and Strategyproofness to Participants* (arXiv 2409.18166). | Experimento directo sobre **cómo explicar el algoritmo de Aceptación Diferida**. Hallazgo clave: mucha gente aprende a **calcular** el resultado del algoritmo pero **eso no se traduce** en entender que mentir sobre las preferencias no conviene (*strategyproofness*). Por eso miden las dos cosas por separado, con tests específicos. → Hay que preguntar por separado "¿sabes cómo se asigna?" y "¿entiendes que poner primero lo que quieres no te perjudica?". |
| **Rees-Jones (2018)** (Games and Economic Behavior 108) y **Hassidim, Romm y Shorrer** (match de psicología en Israel). | Incluso con buen consejo, una parte de los postulantes **reporta preferencias distintas a las reales** en mecanismos donde eso no conviene. → El mito del riesgo estratégico (H4) no es exclusivo de Chile; es medible y merece preguntas propias. |
| **Jian, Bisantz y Drury (2000)** y **Körber (2019)**. | Escalas de confianza en sistemas automáticos. La de Körber separa **comprensibilidad/predictibilidad**, **confiabilidad**, **intención de los desarrolladores** y **confianza general**. Gutzwiller et al. (2019) advierten un **sesgo positivo** en la escala de Jian (la gente tiende a responder alto). → Los ítems F1–F5 se pueden ordenar según esas dimensiones y conviene compensar el sesgo con medidas objetivas. |
| **Colquitt (2001)**, escala de justicia organizacional (hay versión en español en *Psicothema*). | Separa justicia **distributiva** (el resultado), **procedimental** (las reglas) e **informacional** (si te explicaron). → J1–J3 hoy mezclan las tres; separarlas ayuda a leer H3 ("explicar no cambia cuán justo se siente el resultado, pero sí las reglas"). |
| **Starke et al. (2022)**, revisión sistemática de percepción de justicia algorítmica; **Binns et al. (2018)**; **Lee et al. (2019)**. | El efecto de explicar sobre la justicia percibida **depende del contexto**: si la explicación muestra igualdad, sube; si muestra un sesgo, baja. → Refuerza que H3 sea exploratoria y no direccional. |
| **McNaughton et al. (2015)**, *Subjective Numeracy Scale* de 3 ítems (Medical Decision Making 35). | Escala corta y validada de **facilidad con los números**. → Covariable útil: A muestra porcentajes y "X de cada 100"; quien maneja peor los números puede beneficiarse más (o menos) de A. |
| **Sauro y Dumas (2009)**, *Single Ease Question* (CHI); **SUS en español** (Sevilla-González et al., 2020, JMIR Human Factors). | Medidas estándar de **facilidad de uso**. → Sirven de **control**: A no debería ser más difícil de usar que B por tener más texto (era la preocupación de la profesora sobre la carga de texto). |

---

## 3. Las seis familias de preguntas

| # | Familia | Para qué sirve | Cuándo | Hoy existe |
|---|---|---|---|---|
| 1 | **Perfil y covariables** | Describir la muestra y leer los resultados en contexto | Antes de las tareas | Parcial (experiencia SAE + B1) |
| 2 | **Durante la tarea** (pensar en voz alta + probes) | Ver qué se lee, qué se entiende, dónde hay dudas | Tareas 1–7 | Sí, pero con probes distintos en A y B |
| 3 | **Predicción** | Comprensión demostrada: ¿puede anticipar lo que hará el sistema? | Tarea 6 (antes de ver el resultado) | Sí (oral); falta registrarla con respuesta y seguridad |
| 4 | **Comprensión objetiva y transferencia** | Medir H1 sin depender del autorreporte | Justo después de la tarea 7, **antes** del Likert | **No** |
| 5 | **Escalas de percepción y control** | Comprensión subjetiva, confianza, justicia + facilidad de uso y esfuerzo | Después del test objetivo | Comprensión/confianza/justicia sí; usabilidad/esfuerzo no |
| 6 | **Abiertas y "explícaselo a otra persona"** | Modelo mental en palabras propias; hallazgos no previstos | Al final | Sí (A1, A2); falta la de explicar |

---

## 4. Banco de preguntas propuesto

Todo en tuteo, lenguaje de 6.º básico, frases cortas y sin dobles negaciones (persona Daniela). Lo marcado **[igual]** es idéntico en A y B.

### 4.1 Antes de las tareas (≈5 min) [igual]

**Perfil**
- P1. ¿Has postulado alguna vez a un hijo o hija en el Sistema de Admisión Escolar? *(Sí, una vez / Sí, más de una vez / Nunca)* — ya existe.
- P2. ¿Cuál es el último nivel de estudios que terminaste? *(Básica / Media / Técnico / Universitaria)*
- P3. ¿Desde dónde haces la mayoría de tus trámites por internet? *(Celular / Computador / Los dos por igual / Le pido ayuda a otra persona)*

**Covariables**
- B1. *"El sistema de admisión escolar es como una tómbola: no se entienden bien sus reglas."* (1–5) — ya existe, se mantiene igual.
- **N1–N3. Facilidad con los números** (SNS-3, McNaughton et al., 2015; escala 1–6). Traducción propuesta, a cotejar con el artículo original y probar en el piloto: *N1. ¿Qué tan bueno/a eres para trabajar con fracciones?* · *N2. ¿Qué tan bueno/a eres para calcular cuánto cuesta una polera con 25 % de descuento?* · *N3. ¿Qué tan seguido te sirve la información con números?* No inventar ítems distintos a los originales.

> **Por qué agregar numeracidad:** la condición A comunica con porcentajes y "X de cada 100". Si el efecto de A se concentra en quienes manejan mejor los números, es un hallazgo importante para la memoria (y para el diseño). Ocupa menos de 1 minuto.

### 4.2 Durante las tareas: probes iguales en A y B

**Consigna inicial [igual]:** *"Mientras usas la página, dime en voz alta lo que vas pensando: lo que lees, lo que esperas que pase y lo que te confunde. Si te quedas en silencio, te voy a recordar que sigas hablando."*

**Recordatorio neutro [igual]:** *"¿Qué estás pensando ahora?"* — nunca *"¿entiendes eso?"* ni *"¿viste el recuadro…?"*.

**Probes por tarea (propuesta: los mismos en ambas condiciones)**

| Tarea | Probe hoy | Propuesta [igual] | Motivo |
|---|---|---|---|
| 1. Grupo familiar | ¿Qué entiendes que pasa con Martina? · ¿Qué significa postular en bloque? | Se mantienen. | Ya son abiertos e iguales. |
| 2. Confirmar datos | ¿Qué te dice la página que ya sabe? ¿Te calza con la tarjeta? | Se mantiene. | Igual en A y B. |
| 3. Agregar colegios | — | *"¿Qué te llamó la atención de estos colegios?"* (solo si comenta algo; si no, nada). | Abierto, no sugiere el %. |
| 4. Revisar la lista | A: *"¿Qué entiendes de lo que muestra la página aquí?"* · B: *"¿Qué esperas que pase con esta lista?"* | **Los dos probes, en el mismo orden, a todas las personas:** *"¿Qué esperas que pase con esta lista?"* y luego *"¿Hay algo en esta pantalla que te ayude a saberlo?"* | Hoy A y B reciben preguntas distintas: no se puede separar el efecto de la interfaz del de la pregunta. |
| 4. (intento de reordenar) | Registrar si intenta reordenar y por qué. | Se mantiene. Si lo intenta: *"¿Por qué lo querías mover?"* | Señal directa de H4. |
| 6. Predicción | ¿En qué colegio crees que va a quedar Sofía, y por qué? | Ver §4.3 (se registra por escrito). | |
| 7. Resultado | ¿Era lo que esperabas? ¿Por qué crees que pasó? **¿Te queda claro** por qué no quedó en San Martín? | *"¿Era lo que esperabas?"* · *"¿Por qué crees que pasó?"* · *"Con tus palabras, ¿por qué no quedó en San Martín?"* | "¿Te queda claro…?" invita a decir que sí. Pedir la explicación en palabras propias permite **codificarla como correcta o incorrecta**. |

**Reglas para el moderador (Nielsen Norman Group, práctica estándar de entrevista):** no confirmar ni corregir ("¡exacto!", "mmm, no"); devolver la pregunta si la persona pregunta *"¿está bien así?"* → *"¿Tú qué crees?"*; no nombrar elementos de la interfaz que la persona no nombró.

### 4.3 Predicción antes de ver el resultado (tarea 6) [igual]

Registrar **por escrito** (en el cuadernillo o en la planilla del moderador), no solo oral:

- **PR1.** ¿En qué colegio crees que va a quedar Sofía? *(los 6 colegios + "En ninguno" + "No sé")*
- **PR2.** ¿Qué tan seguro/a estás? *(1 = Nada seguro/a … 5 = Muy seguro/a)*
- **PR3.** ¿Por qué? *(abierta, una o dos frases)*

**Cómo se usa:** PR1 se puntúa como **acierto/no acierto** (respuesta correcta: Colegio Los Andes). Con ~15 por grupo, se compara la proporción de aciertos A vs. B con **prueba exacta de Fisher**. PR2 permite ver **calibración**: ¿quien acierta está más seguro? En B se espera más "No sé" o más "San Martín" (porque es la 1.ª opción), que es justamente lo que el estudio busca mostrar. PR3 alimenta la codificación de H4.

### 4.4 Test de comprensión objetiva (≈5 min, por escrito) [igual] — **nuevo**

Va **inmediatamente después de la tarea 7 y antes del Likert**. Formato: **Verdadero / Falso / No sé**. Incluir "No sé" baja el adivinar al azar (con V/F puro, adivinar da 50 %). Puntaje = número de respuestas correctas (0–8); "No sé" cuenta como incorrecta.

Las preguntas se dividen en tres tipos, siguiendo la separación de Gonczarowski et al. (2024) entre **saber cómo se asigna** y **entender que no conviene esconder lo que se prefiere**, y la noción de simulabilidad de Hase y Bansal (2020).

**a) Reglas del sistema (cómo se asigna)**

| # | Afirmación | Respuesta | Qué mide |
|---|---|---|---|
| K1 | El sistema usa las notas de Sofía para decidir en qué colegio queda. | **Falso** | No hay mérito ni puntaje |
| K2 | Que Martina estudie en el Colegio Los Andes le da a Sofía ventaja **solo** en ese colegio, no en los demás. | **Verdadero** | Prioridad por colegio (hoy en C3 como autorreporte) |
| K3 | Cuando un colegio tiene más postulantes que vacantes, entre familias sin ventaja se decide por sorteo. | **Verdadero** | Desempate |

**b) No conviene esconder lo que se prefiere (*strategyproofness*, H4)**

| # | Afirmación | Respuesta | Qué mide |
|---|---|---|---|
| K4 | Poner el Colegio San Martín en primer lugar le **quitó** posibilidades a Sofía en el Colegio Los Andes. | **Falso** | Núcleo del mito estratégico |
| K5 | Si la familia hubiera puesto San Martín al **final** de la lista, Sofía habría tenido **más** posibilidades de quedar en San Martín. | **Falso** | La posición no cambia la probabilidad en ese colegio |

**c) Transferencia / "¿qué pasaría si…?" (simulabilidad)**

| # | Afirmación | Respuesta | Qué mide |
|---|---|---|---|
| K6 | Si la familia hubiera puesto Los Andes en primer lugar, Sofía igual habría quedado en Los Andes. | **Verdadero** | Predicción con un cambio al caso |
| K7 | Si Sofía no hubiera quedado en ningún colegio de la lista, habría perdido su matrícula actual. | **Falso** | Qué pasa si no quedas (fidelidad SAE: mantiene su colegio) |
| K8 | Si **otra** familia, sin hermanos en Los Andes, pusiera Los Andes primero, tendría las mismas posibilidades que Sofía de quedar ahí. | **Falso** | Aplicar la regla de prioridad a un caso nuevo |

> **Verificación de las respuestas contra el prototipo (obligatoria antes del piloto).** K4–K6 dependen de que cada colegio tenga su propio sorteo y de que la posición en la lista no cambie el % de un colegio. Eso es lo que hace el simulador desde el bloque T1 (semilla por colegio) y lo que comprueban los tests de *strategy-proofness* de `sae-react/tests/`. K7 depende del aviso "si no quedas en ninguna preferencia mantienes tu colegio" (brecha D, ya en el prototipo, visible en A y B). Si alguna regla del prototipo cambia, hay que revisar esta clave.

> **¿No es injusto con B?** No más que los ítems Likert C2/C4/C5 que el caso ya declara como deliberados (§10). Todas estas reglas son del **SAE real**: una familia en B podría saberlas por experiencia previa (por eso P1 es covariable). Lo que se mide es si la capa de explicación de A **agrega** comprensión sobre lo que ya trae la gente.

### 4.5 Escalas de percepción (Likert 1–5) — ajustes a lo que ya existe

Se mantienen los tres constructos y la mayoría de los ítems (ya están en el material del participante), con estos ajustes:

| Ítem actual | Problema | Propuesta |
|---|---|---|
| **C1** Entendí para qué sirve cada uno de los pasos. | Mide usabilidad del flujo, no comprensión del algoritmo; no debería diferir entre A y B. | Moverlo al bloque de control (4.6) o eliminarlo; lo cubre la SEQ/SUS. |
| **C3** Entendí que tener un vínculo… da prioridad **solo en ese colegio**. | **Enuncia la regla**: quien lo lee aprende la respuesta de K2. | Queda cubierto por K2. Si se quiere conservar el autorreporte: *"Entendí qué ventajas tenía Sofía en cada colegio."* (y siempre **después** del test objetivo). |
| **F2** Sentí que se podía postular con confianza al colegio preferido (San Martín) **aunque** la familia no tuviera ninguna ventaja ahí. | Frase larga con "aunque" (dos ideas); además sugiere la respuesta. | *"Me sentiría tranquilo/a poniendo primero el colegio que más quiero."* |
| **F3** Si yo hubiera armado la lista, **no** me habría dado miedo poner primero… **aunque** tuviera pocas posibilidades. | Negación + "aunque"; se superpone con F2. | *"Si yo armara la lista, pondría primero el colegio que más quiero, aunque tenga pocas posibilidades."* (F2 = sentimiento; F3 = intención). |
| **F4** Si el sistema no asignara al estudiante en ningún colegio, confío en que la plataforma explica qué pasa después. | Pregunta por una pantalla que nadie vio en la prueba. | Eliminar, o reemplazar por un ítem sobre algo visto: *"La página me dijo lo que necesitaba saber antes de enviar."* |
| **J1–J3** | Mezclan tres tipos de justicia (Colquitt, 2001). | Dejar uno por tipo: **Procedimental** *"Las reglas para asignar colegios son las mismas para todas las familias."* · **Informacional** *"La página me explicó con claridad cómo se decidió el resultado."* · **Distributiva** *"El resultado de Sofía me parece justo."* |

**Sobre el sesgo de responder "de acuerdo".** Todos los ítems están en positivo, y las escalas de confianza tienden a recibir respuestas altas (Gutzwiller et al., 2019). Invertir ítems (*"No entendí…"*) suele confundir a personas con menos práctica lectora — un estudio de la SUS en español encontró efectos de los ítems redactados en negativo (Castilla et al.). **Recomendación:** no invertir ítems; compensar el sesgo con las medidas objetivas (PR1, K1–K8), que son las que deberían sostener H1.

**Formato visual:** mantener 5 puntos con **todas** las opciones rotuladas en palabras (no solo los extremos), que es más fácil de leer para la persona objetivo.

### 4.6 Medidas de control: facilidad de uso y esfuerzo [igual] — **nuevo**

La pregunta que hizo la profesora sobre la carga de texto tiene una versión medible: **¿A se entiende mejor a costa de ser más pesada de usar?**

- **SEQ** (Sauro y Dumas, 2009), después de las tareas 3 y 7: *"En general, ¿qué tan fácil o difícil fue esta tarea?"* (1 = Muy difícil … 7 = Muy fácil). Una pregunta, segundos.
- **Esfuerzo mental** (un ítem, después de la tarea 7): *"¿Cuánto esfuerzo mental te costó entender lo que mostraba la página?"* (1 = Muy poco … 5 = Mucho).
- **Opcional: SUS en español** (10 ítems, ~2 min; versión validada de Sevilla-González et al., 2020) al final. Solo si el tiempo alcanza; si no, basta con la SEQ.

**Cómo se lee:** lo ideal para la memoria es *"A mejora la comprensión sin empeorar la facilidad de uso"* (SEQ igual o mejor en A). Si A sale más difícil, es un hallazgo honesto sobre el costo de explicar, coherente con el trabajo de reducción de texto de septiembre.

### 4.7 Preguntas abiertas (≈5 min) [igual]

- **A1** (ya existe, se mantiene): *"Si tú hubieras armado esta lista, ¿la habrías ordenado distinto? En particular, ¿dónde habrías puesto el Colegio San Martín, y por qué?"*
- **A3 — Explícaselo a otra persona (nueva, va antes de A2):** *"Imagina que una amiga va a postular a su hijo por primera vez. ¿Cómo le explicarías, con tus palabras, cómo decide el sistema en qué colegio queda?"*
  Es la técnica de *teach-back* que se usa en alfabetización en salud y una forma directa de obtener el **modelo mental** (Hoffman et al., 2023). Se codifica con una pauta simple: menciona (sí/no) **orden de preferencias**, **prioridades**, **vacantes**, **sorteo**, **"poner primero lo que quieres no perjudica"**; y si dice algo incorrecto (notas, cercanía, "el primero que llega").
- **A2** (ya existe, al final): *"¿Hubo algo que te generó desconfianza o que no entendiste, aunque no te lo haya preguntado?"*

---

## 5. Orden y tiempos de la sesión

| Bloque | Qué se pregunta | Tiempo |
|---|---|---|
| Bienvenida y consentimiento | — | 5 min |
| Pre-tarea | P1–P3, B1, N1–N3 | 5 min |
| Tareas 1–5 | Pensar en voz alta + probes iguales (§4.2); SEQ tras la tarea 3 | 15–18 min |
| Tarea 6 | **PR1–PR3** por escrito | 2 min |
| Tarea 7 | Probes de resultado (§4.2); SEQ + esfuerzo mental | 4 min |
| **Test objetivo** | **K1–K8** | 5 min |
| Likert | Comprensión / confianza / justicia ajustados (§4.5) | 5 min |
| Abiertas | A1 → A3 → A2 | 5 min |
| (Opcional) SUS | 10 ítems | 2 min |
| Cierre | Agradecer; **no** explicar todavía las dos condiciones ni las respuestas | 2 min |

**Total ≈ 50–55 min**, dentro de lo previsto en el caso (§7.2: 45–55 min). Si no alcanza, lo primero que se saca es la SUS; lo último, el test objetivo.

**Por qué este orden:**
1. **Predicción antes de ver el resultado** (ya decidido en el caso).
2. **Test objetivo antes del Likert**, porque algunos ítems Likert contienen la respuesta.
3. **Abiertas al final**, para que la persona ya haya pensado el tema, pero A3 antes de A2 para que la explicación libre no se contagie de las dudas que se nombren en A2.
4. **No revelar las condiciones al cierre** (para no contaminar a futuros participantes de la misma red de bola de nieve); avisar que se enviará un resumen al terminar el estudio.

---

## 6. Cómo se conectan las preguntas con las hipótesis

| Hipótesis | Medida principal | Medidas de apoyo |
|---|---|---|
| **H1 — comprensión A > B** | **Puntaje K1–K8** + **acierto en PR1** | Likert de comprensión; codificación de A3 y del probe "con tus palabras, ¿por qué no quedó en San Martín?" |
| **H2 — confianza A > B** | Likert de confianza (F1, F2 ajustado, F3, F5) | Calibración PR1 vs. PR2 |
| **H3 — justicia, diferencia menor o nula** | Los tres ítems J separados por tipo | Se espera más diferencia en **informacional** que en **distributiva** |
| **H4 — mito estratégico (cualitativa)** | **K4–K5** (cuantitativo, nuevo) + A1 | Intentos de reordenar (tarea 4), PR3 |
| **Control — costo de explicar** | SEQ + esfuerzo mental | SUS opcional |
| **Covariables** | B1, P1, **numeracidad (SNS-3)** | P2, P3 |

**Análisis (sin cambios al plan del caso §8.5, solo se suma):** puntaje K y Likert → U de Mann-Whitney + r; PR1 (acierta / no acierta) → prueba exacta de Fisher; estratificar también por numeracidad (alta/baja). Mantener el criterio de "resultado positivo" del caso: la misma dirección en lo descriptivo, la prueba no paramétrica y lo cualitativo.

---

## 7. Antes de usarlo: piloto del cuestionario

1. **Entrevista cognitiva con 2–3 personas tipo Daniela** (no del círculo técnico): leer cada pregunta en voz alta y preguntar *"¿con tus palabras, qué te está preguntando?"*. Ajustar las que se entiendan distinto. Es especialmente importante para K5, K8 y los ítems de numeracidad traducidos.
2. **Una sesión piloto completa por condición** (A y B) con la planilla, para medir el tiempo real y comprobar que nadie se queda sin poder responder K1–K8 por cansancio.
3. **Revisar la clave de respuestas K1–K8 contra el prototipo** (nota de §4.4).
4. **Congelar el instrumento** antes de la primera sesión real: en un estudio comparativo no se puede cambiar a mitad de camino.

---

## 8. Qué habría que actualizar si se aprueba

Esto **no está hecho**; es la lista para la sesión que implemente la decisión:

- `caso_estudio_prueba_usabilidad_postulacion.md` §6.2 (probes iguales en tarea 4 y 7), §7.2 (tiempos), §8 (nuevas secciones: numeracidad, PR1–PR3, K1–K8, SEQ/esfuerzo, A3; ajustes a C1/C3/F2/F4/J1–J3), §8.4–§8.5 (medidas de H1/H4, Fisher, estratificación por numeracidad), §10 (amenaza de constructo: "solo autorreporte" queda mitigada).
- `guion_moderador_prueba_usabilidad.md` (probes y orden) y `material_prueba_usabilidad_postulacion.md` (cuadernillo), y regenerar sus PDF.
- `proyecto-tesis/capitulos/03_metodologia.tex` (instrumento de la Fase 4) — **writing-agent**.
- Ningún cambio en `sae-react/`.

---

## Fuentes

- Hoffman, R. R., Mueller, S. T., Klein, G. y Litman, J. (2023). *Measures for explainable AI: Explanation goodness, user satisfaction, mental models, curiosity, trust, and human-AI performance.* Frontiers in Computer Science, 5. https://digitalcommons.mtu.edu/michigantech-p/16886/
- Hase, P. y Bansal, M. (2020). *Evaluating Explainable AI: Which Algorithmic Explanations Help Users Predict Model Behavior?* ACL. https://aclanthology.org/2020.acl-main.491.pdf
- Kulesza, T., Stumpf, S., Burnett, M., Yang, S., Kwan, I. y Wong, W.-K. (2013). *Too much, too little, or just right? Ways explanations impact end users' mental models.* VL/HCC. https://openaccess.city.ac.uk/id/eprint/6344/
- Gonczarowski, Y. A., Heffetz, O., Ishai, G. y Thomas, C. (2024). *Describing Deferred Acceptance and Strategyproofness to Participants: Experimental Analysis.* arXiv:2409.18166. https://arxiv.org/abs/2409.18166
- Gonczarowski, Y. A., Heffetz, O. y Thomas, C. *Strategyproofness-Exposing Mechanism Descriptions.* NBER WP 31506. https://www.nber.org/system/files/working_papers/w31506/w31506.pdf
- Rees-Jones, A. (2018). *Suboptimal behavior in strategy-proof mechanisms: Evidence from the residency match.* Games and Economic Behavior, 108, 317–330.
- Hassidim, A., Romm, A. y Shorrer, R. I. *Redesigning the Israeli Psychology Master's Match.* https://dl.acm.org/doi/10.1145/3033274.3085124
- Jian, J.-Y., Bisantz, A. M. y Drury, C. G. (2000). *Foundations for an empirically determined scale of trust in automated systems.* International Journal of Cognitive Ergonomics.
- Körber, M. (2019). *Theoretical considerations and development of a questionnaire to measure trust in automation.* https://link.springer.com/chapter/10.1007/978-3-319-96074-6_2 · repositorio: https://github.com/moritzkoerber/TiA_Trust_in_Automation_Questionnaire
- Gutzwiller, R. S. et al. (2019). *Positive bias in the 'Trust in Automated Systems Survey'?* https://journals.sagepub.com/doi/10.1177/1071181319631201
- Colquitt, J. A. (2001). *On the dimensionality of organizational justice: A construct validation of a measure.* https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Justice/Colquitt_Dimensionality_of_Organizational_Justice.pdf · versión en español: https://www.psicothema.com/pdf/4226.pdf
- Starke, C., Baleis, J., Keller, B. y Marcinkowski, F. (2022). *Fairness perceptions of algorithmic decision-making: A systematic review of the empirical literature.* Big Data & Society. https://journals.sagepub.com/doi/10.1177/20539517221115189
- McNaughton, C. D. et al. (2015). *Validation of a Short, 3-Item Version of the Subjective Numeracy Scale.* Medical Decision Making, 35(8). https://doi.org/10.1177/0272989X15581800
- Sauro, J. y Dumas, J. S. (2009). *Comparison of three one-question, post-task usability questionnaires.* CHI. https://measuringu.com/papers/Sauro_Dumas_CHI2009.pdf
- Sevilla-González, M. R. et al. (2020). *Spanish Version of the System Usability Scale for the Assessment of Electronic Tools.* JMIR Human Factors. https://humanfactors.jmir.org/2020/4/e21161/
- Castilla, D. et al. *Psychometric Properties of the Spanish Full and Short Forms of the SUS: Detecting the Effect of Negatively Worded Items.* https://www.researchgate.net/profile/Diana-Castilla/publication/370659267
- van den Haak, M., de Jong, M. y Schellens, P. J. (2003). *Retrospective vs. concurrent think-aloud protocols: Testing the usability of an online library catalogue.* Behaviour & Information Technology. https://www.researchgate.net/publication/220208560
- Nielsen Norman Group. *Beyond NPS: SUS, NASA-TLX, and the Single Ease Question.* https://www.nngroup.com/articles/measuring-perceived-usability/

*Las referencias internas (Arteaga et al. 2022, HAX, PAIR, Brookings) están en `investigacion_ux_guide_ai_systems.md` y en el caso de estudio. Ninguna cifra de este documento es nueva: los números del caso (≈26 %, ≈99 %, N≈30) vienen del caso de estudio y del prototipo.*
