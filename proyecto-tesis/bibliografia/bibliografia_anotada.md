# Bibliografía anotada

Una ficha por cada clave de `referencias.bib`. Sirve para controlar que la memoria no le atribuya a una fuente algo que la fuente no dice. La generó el asistente el 2026-09-27 a partir del `.bib` y de las oraciones donde cada clave se cita en `capitulos/`.

**Cómo se usa:**
- Antes de citar una clave en texto nuevo, revisa su ficha: si el uso nuevo afirma algo distinto de lo que ya se le atribuye, verifícalo contra la fuente original.
- El campo **Verificación** lo completa una persona que leyó la fuente, con fecha: `✅ verificado (AAAA-MM-DD)` si la fuente respalda cada afirmación atribuida, o `⚠️` con la discrepancia. Nadie marca ✅ sin haber leído la fuente.
- Si se agrega o elimina una cita en los `.tex`, se actualiza la ficha correspondiente (el `writing-agent` lo hace al cerrar su tarea; el `revisor-memoria` lo comprueba).

**Bloques de origen** (según la cabecera del propio `.bib`):
- **A**: referencias tomadas de la bibliografía del artículo base (Álvarez, Pérez, Villegas), con datos verificados por sus autores.
- **B**: referencias de la revisión sistemática de 96 papers. **Solo tienen autor y año confiables; el título es descriptivo, no literal**, y venue y páginas no están verificados. Antes de la entrega, cada una debe verificarse contra la fuente original (título, revista, año) **y** contra lo que la memoria le atribuye.

## Resumen

| Clave | Bloque | Tipo | Veces citada | Verificación |
|---|---|---|---|---|
| `keepcoding2024etica` | A | misc | 2 | ⏳ |
| `checkealos2024etica` | A | misc | 3 | ⏳ |
| `transparenciaalgoritmica` | A | misc | 1 | ⏳ |
| `ibm2024transparencia` | A | misc | 2 | ⏳ |
| `strobel2019aspects` | A | inproceedings | 1 | ⏳ |
| `masciari2024systematic` | A | article | 1 | ⏳ |
| `rivas2024transparency` | A | article | 2 | ⏳ |
| `nist2023airmf` | A | techreport | 1 | ⏳ |
| `iso2023aims` | A | techreport | 1 | ⏳ |
| `unir2024sesgo` | A | misc | 2 | ⏳ |
| `legalprod` | A | misc | 1 | ⏳ |
| `wikipedia_transparencia` | A | misc | 1 | ⏳ |
| `ibm_iaresponsable` | A | misc | 1 | ⏳ |
| `skillnest_sesgo` | A | misc | 2 | ⏳ |
| `agoro2019case` | A | misc | 1 | ⏳ |
| `galeshapley1962` | A | article | 2 | ⏳ |
| `mineduc_sae` | A | misc | 2 | ⏳ |
| `epstein2017mecanismos` | A | mastersthesis | 3 | ⏳ |
| `moralesvargas2026informe` | A | misc | 3 | ⏳ |
| `springerwhittaker2019` | B | misc | 3 | ⏳ |
| `springerwhittaker2020` | B | misc | 2 | ⏳ |
| `lu2020goodexplanation` | B | misc | 0 | ⏳ |
| `nefedov2022` | B | misc | 2 | ⏳ |
| `kim2021recommender` | B | misc | 2 | ⏳ |
| `feddersen2024forecasting` | B | misc | 3 | ⏳ |
| `glazerman2018multidim` | B | misc | 1 | ⏳ |
| `graefe2022vehicles` | B | misc | 0 | ⏳ |
| `peng2023codesign` | B | misc | 1 | ⏳ |
| `bobek2024xai` | B | misc | 1 | ⏳ |
| `dawoud2023comparative` | B | misc | 1 | ⏳ |
| `inel2020video` | B | misc | 0 | ⏳ |
| `shin_fate` | B | misc | 0 | ⏳ |

## Fichas

### `keepcoding2024etica`

- **Referencia:** {KeepCoding} (2024). *Ética en Diseño UX/UI: Análisis Profundo*.  Disponible en: \url{https://keepcoding.io/blog/etica-en-el-diseno-ux-ui/}
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `01_introduccion.tex:3` — «Esta integración generalizada eleva el diseño ético de la experiencia de usuario (UX) de una característica deseable a una necesidad fundamental: la ética en UX implica tomar decisiones de diseño conscientes para beneficiar a los usuarios y actuar con responsabilidad social [cita], evitando activamente los llamados ``patrones oscuros'' —elementos de interfaz que inducen a los usuarios a tomar decisiones que no los be»
  - `02_marco_teorico.tex:5` — «El diseño ético de UX se entiende como la práctica de tomar decisiones de diseño de manera consciente, con el objetivo de beneficiar a los usuarios y actuar con responsabilidad social [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `checkealos2024etica`

- **Referencia:** {Checkealos} (2024). *Ética diseño UX: Crear Experiencias Positivas*.  Disponible en: \url{https://checkealos.com/es/etica-en-el-diseno-ux/}
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `01_introduccion.tex:3` — «Esta integración generalizada eleva el diseño ético de la experiencia de usuario (UX) de una característica deseable a una necesidad fundamental: la ética en UX implica tomar decisiones de diseño conscientes para beneficiar a los usuarios y actuar con responsabilidad social [cita], evitando activamente los llamados ``patrones oscuros'' —elementos de interfaz que inducen a los usuarios a tomar decisiones que no los be»
  - `02_marco_teorico.tex:5` — «Un aspecto central de esta práctica es la prevención activa de los patrones oscuros (dark patterns): elementos de diseño implementados deliberadamente para inducir a los usuarios a realizar acciones no deseadas o tomar decisiones que no los benefician [cita].»
  - `02_marco_teorico.tex:5` — «Estas prácticas no solo erosionan la confianza del usuario, sino que han motivado respuestas regulatorias concretas, como las multas de la Federal Trade Commission de Estados Unidos a empresas como Epic Games y Amazon por el uso indebido de patrones oscuros [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `transparenciaalgoritmica`

- **Referencia:** {Transparencia Algorítmica} (s/f). *Transparencia Algorítmica*.  Disponible en: \url{https://www.transparenciaalgoritmica.es/}
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `01_introduccion.tex:5` — «Un componente central de ese diseño ético es la transparencia algorítmica: la capacidad de un sistema de IA para que su proceso de toma de decisiones, la lógica subyacente y los resultados generados sean interpretables y comprensibles para las personas [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `ibm2024transparencia`

- **Referencia:** {IBM} (2024). *¿Qué es la transparencia de la IA?*.  Disponible en: \url{https://www.ibm.com/mx-es/think/topics/ai-transparency}
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `01_introduccion.tex:5` — «Un componente central de ese diseño ético es la transparencia algorítmica: la capacidad de un sistema de IA para que su proceso de toma de decisiones, la lógica subyacente y los resultados generados sean interpretables y comprensibles para las personas [cita].»
  - `02_marco_teorico.tex:11` — «La literatura distingue tres conceptos que suelen usarse de manera intercambiable pero que tienen alcances distintos [cita]:»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `strobel2019aspects`

- **Referencia:** Strobel, Martin (2019). *Aspects of Transparency in Machine Learning*. Proceedings of the 18th International Conference on Autonomous Agents and Multiagent Systems (AAMAS 2019)
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `01_introduccion.tex:3` — «El avance acelerado y la creciente integración de la inteligencia artificial (IA) en diversos sectores han transformado el diseño y la experiencia de productos y servicios digitales, desde la salud y las finanzas hasta la logística y la atención ciudadana [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `masciari2024systematic`

- **Referencia:** Masciari, E. and Umair, A. and Ullah, M. H. (2024). *A Systematic Literature Review on AI-Based Recommendation Systems and Their Ethical Considerations*. IEEE Access
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:67` — «Esto convierte el diseño orientado a la transparencia en un requisito funcional, no en un elemento cosmético, y confirma la pertinencia de aplicar al SAE los mismos principios (divulgación progresiva, explicabilidad contextualizada, controles interactivos) que la literatura identifica como efectivos en otros dominios de alto impacto, como la administración pública [cita], la salud [cita] y los sistemas de recomendaci»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `rivas2024transparency`

- **Referencia:** Rivas, V. and others (2024). *Transparency and Accountability in AI Systems*. Frontiers in Human Dynamics
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:31` — «En el ámbito de la salud, por ejemplo, se ha documentado cómo sistemas de IA han reproducido sistemáticamente desigualdades de acceso y tratamiento médico, lo que subraya una responsabilidad ética compartida entre quienes diseñan y quienes regulan estos sistemas [cita].»
  - `02_marco_teorico.tex:67` — «Esto convierte el diseño orientado a la transparencia en un requisito funcional, no en un elemento cosmético, y confirma la pertinencia de aplicar al SAE los mismos principios (divulgación progresiva, explicabilidad contextualizada, controles interactivos) que la literatura identifica como efectivos en otros dominios de alto impacto, como la administración pública [cita], la salud [cita] y los sistemas de recomendaci»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `nist2023airmf`

- **Referencia:** {NIST} (2023). *AI Risk Management Framework 1.0*. National Institute of Standards and Technology
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:35` — «Entre los más relevantes destacan el NIST AI Risk Management Framework 1.0, que define prácticas de gestión de riesgo mediante cuatro funciones —gobernar, mapear, medir y gestionar— [cita]; la norma ISO/IEC 42001:2023, que propone un sistema integral de gestión de IA centrado en gobernanza, gestión de riesgos y trazabilidad de las decisiones algorítmicas [cita]; y los principios actualizados de la OCDE, que recalcan »
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `iso2023aims`

- **Referencia:** {ISO} (2023). *ISO/IEC 42001:2023 Artificial Intelligence Management System*. International Organization for Standardization
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:35` — «Entre los más relevantes destacan el NIST AI Risk Management Framework 1.0, que define prácticas de gestión de riesgo mediante cuatro funciones —gobernar, mapear, medir y gestionar— [cita]; la norma ISO/IEC 42001:2023, que propone un sistema integral de gestión de IA centrado en gobernanza, gestión de riesgos y trazabilidad de las decisiones algorítmicas [cita]; y los principios actualizados de la OCDE, que recalcan »
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `unir2024sesgo`

- **Referencia:** {Universidad Internacional de La Rioja (UNIR)} (s/f). *El impacto del sesgo algorítmico en la empresa: desafíos y soluciones éticas*.  Disponible en: \url{https://www.ui1.es/blog-ui1/el-impacto-del-sesgo-algoritmico-en-la-empresa-desafios-y-soluciones-eticas}
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `01_introduccion.tex:5` — «La ausencia de transparencia no es un problema meramente estético; puede derivar en decisiones incorrectas, filtraciones de información, discriminación por raza o género, y una pérdida generalizada de confianza institucional [cita].»
  - `02_marco_teorico.tex:19` — «El incumplimiento de estos tres aspectos intensifica desigualdades sociales existentes, al reforzar y amplificar sesgos previos: puede derivar en decisiones incorrectas, exposición de información sensible, y discriminación por raza o género [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `legalprod`

- **Referencia:** {LegalProd} (s/f). *Transparencia del algoritmo*.  Disponible en: \url{https://www.legalprod.com/es/transparencia-del-algoritmo/}
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:19` — «Casos ampliamente documentados ilustran esta consecuencia: el sistema COMPAS en Estados Unidos, criticado por predicciones judiciales sesgadas, o el algoritmo BOSCO en España, que enfrentó desafíos legales al denegar beneficios sociales de forma no transparente [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `wikipedia_transparencia`

- **Referencia:** {Wikipedia} (s/f). *Transparencia algorítmica*.  Disponible en: \url{https://es.wikipedia.org/wiki/Transparencia_algor\%C3\%ADtmica}
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:19` — «Casos ampliamente documentados ilustran esta consecuencia: el sistema COMPAS en Estados Unidos, criticado por predicciones judiciales sesgadas, o el algoritmo BOSCO en España, que enfrentó desafíos legales al denegar beneficios sociales de forma no transparente [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `ibm_iaresponsable`

- **Referencia:** {IBM} (s/f). *¿Qué es la IA responsable?*.  Disponible en: \url{https://www.ibm.com/mx-es/think/topics/responsible-ai}
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:23` — «La literatura distingue al menos tres mecanismos de origen [cita]:»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `skillnest_sesgo`

- **Referencia:** {Skillnest} (s/f). *Sesgo en la IA: cómo evitar la discriminación en los modelos*.  Disponible en: \url{https://www.skillnest.com/blog/sesgo-en-la-ia-como-evitar-la-discriminacion-en-los-modelos/}
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `01_introduccion.tex:5` — «La ausencia de transparencia no es un problema meramente estético; puede derivar en decisiones incorrectas, filtraciones de información, discriminación por raza o género, y una pérdida generalizada de confianza institucional [cita].»
  - `02_marco_teorico.tex:23` — «La literatura distingue al menos tres mecanismos de origen [cita]:»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `agoro2019case`

- **Referencia:** Agoro, H. and Owen, A. and Gray, R. (2019). *Case Studies in Ethical AI*.  Disponible en: \url{https://www.researchgate.net/publication/389441365_Case_Studies_in_Ethical_AI}
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `01_introduccion.tex:5` — «La ausencia de transparencia no es un problema meramente estético; puede derivar en decisiones incorrectas, filtraciones de información, discriminación por raza o género, y una pérdida generalizada de confianza institucional [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `galeshapley1962`

- **Referencia:** Gale, D. and Shapley, L. S. (1962). *College Admissions and the Stability of Marriage*. The American Mathematical Monthly
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `01_introduccion.tex:7` — «El SAE es la plataforma del Ministerio de Educación que asigna estudiantes a establecimientos públicos y particulares subvencionados mediante un algoritmo basado en el mecanismo de Aceptación Diferida (Deferred Acceptance), formulado originalmente por [cita] y adaptado al problema de asignación ``muchos a uno'' que caracteriza la admisión escolar.»
  - `02_marco_teorico.tex:71` — «El SAE utiliza un algoritmo basado en el mecanismo de Aceptación Diferida (Deferred Acceptance, DA), propuesto originalmente por [cita] para el problema del emparejamiento estable entre dos conjuntos de agentes.»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `mineduc_sae`

- **Referencia:** {Ministerio de Educación de Chile} (s/f). *Sistema de Admisión Escolar (SAE)*.  Disponible en: \url{https://www.sistemadeadmisionescolar.cl}, consultado en junio de 2024
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `01_introduccion.tex:7` — «En Chile, este mecanismo está regido por la Ley de Inclusión Escolar N.\textsuperscript{o} 20.845 y considera criterios de prioridad definidos legalmente: hermanos matriculados en el establecimiento, pertenencia al 15% de estudiantes prioritarios, hijos de funcionarios del colegio y condición de exalumno [cita].»
  - `02_marco_teorico.tex:82` — «En Chile, este mecanismo está regido por la Ley de Inclusión Escolar N.\textsuperscript{o} 20.845 y considera cuatro criterios de prioridad: tener un hermano matriculado en el establecimiento, pertenecer al 15% de estudiantes prioritarios, ser hijo o hija de un funcionario del colegio, y ser exalumno que no haya sido expulsado [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `epstein2017mecanismos`

- **Referencia:** Epstein Rosenberg, N. (2017). *Mecanismos de admisión escolar en Chile*. Departamento de Ingeniería Industrial, Universidad de Chile
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `01_introduccion.tex:7` — «En Chile, este mecanismo está regido por la Ley de Inclusión Escolar N.\textsuperscript{o} 20.845 y considera criterios de prioridad definidos legalmente: hermanos matriculados en el establecimiento, pertenencia al 15% de estudiantes prioritarios, hijos de funcionarios del colegio y condición de exalumno [cita].»
  - `02_marco_teorico.tex:73` — «El mecanismo opera de forma iterativa [cita]:»
  - `02_marco_teorico.tex:82` — «Es importante notar que, si bien el SAE no tiene su código fuente públicamente disponible, existe documentación oficial y trabajos académicos —como la tesis de [cita]— que permiten reconstruir su lógica interna y sus criterios de priorización.»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `moralesvargas2026informe`

- **Referencia:** Morales-Vargas, {et al.} (2026). *Informe de Evaluación de Calidad Web del Sistema de Admisión Escolar (SAE)*. Universidad de Chile, Proyecto Fondecyt N.\textsuperscript{o} 1250492 Instrumento de evaluación heurística SISIB aplicado al sitio informativo y a la plataforma de postulación del SAE
- **Bloque:** A
- **Lo que la memoria le atribuye:**
  - `01_introduccion.tex:9` — «Esta brecha fue confirmada empíricamente por la evaluación heurística de calidad web realizada por el equipo del proyecto Fondecyt N.\textsuperscript{o} 1250492 de la Universidad de Chile en marzo de 2026 [cita], que encontró un cumplimiento de apenas 51% en el sitio informativo del SAE y 61% en su plataforma de postulación, con la dimensión de transparencia y apertura entre las peor evaluadas del sitio informativo (»
  - `03_metodologia.tex:7` — «La primera fase consistió en diagnosticar el estado real del SAE mediante el instrumento de evaluación heurística de calidad web desarrollado por SISIB (Universidad de Chile), aplicado en marzo de 2026 por el equipo del proyecto Fondecyt N.\textsuperscript{o} 1250492 [cita] sobre dos componentes del sistema: el sitio web informativo (sistemadeadmisionescolar.cl) y la plataforma transaccional de postulación.»
  - `04_resultados.tex:7` — «La evaluación heurística de calidad web aplicada al SAE real [cita] arrojó un cumplimiento de 51% en el sitio informativo y de 61% en la plataforma de postulación, ambos con un desglose de 55% en indicadores imprescindibles, 57% en esperables y 22% en deseables.»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `springerwhittaker2019`

- **Referencia:** Springer, Aaron and Whittaker, Steve (2019). *Progressive disclosure and user reactions to algorithmic transparency ({VERIFICAR} título y venue exactos)*. 
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:46` — «\item Divulgación progresiva: mostrar primero información esencial y revelar el detalle técnico solo si el usuario lo solicita, evitando la fijación temprana en errores o detalles irrelevantes [cita].»
  - `02_marco_teorico.tex:58` — «\item La transparencia técnica sin filtro —mostrar código, ecuaciones o el detalle interno completo del algoritmo— reduce la confianza en usuarios no técnicos en lugar de aumentarla [cita].»
  - `05_discusion.tex:17` — «\item Si los resultados de la prueba de usabilidad sobre el prototipo completo son consistentes con los del estudio previo mencionado en la Sección \ref{sec:fase2} —realizado sobre un artefacto más acotado—, en particular respecto de si la explicabilidad contextualizada mejora la comprensión y la confianza sin necesariamente resolver la percepción de justicia del resultado, tal como sugiere la literatura sobre gestió»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Nota del revisor (2026-09-27):** el uso en `05_discusion.tex:17` le atribuye un hallazgo sobre la **percepción de justicia** (explicar mejora comprensión y confianza sin cambiar la justicia percibida) que no está registrado para esta fuente; el mismo uso se quitó de H3 en el Cap. 3. Verificar antes de mantenerlo en la reescritura de la Sec. 5.2.
- **Verificación:** ⏳ pendiente

### `springerwhittaker2020`

- **Referencia:** Springer, Aaron and Whittaker, Steve (2020). *Staged transparency and error exposure in algorithmic systems ({VERIFICAR} título y venue exactos)*. 
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:46` — «\item Divulgación progresiva: mostrar primero información esencial y revelar el detalle técnico solo si el usuario lo solicita, evitando la fijación temprana en errores o detalles irrelevantes [cita].»
  - `05_discusion.tex:17` — «\item Si los resultados de la prueba de usabilidad sobre el prototipo completo son consistentes con los del estudio previo mencionado en la Sección \ref{sec:fase2} —realizado sobre un artefacto más acotado—, en particular respecto de si la explicabilidad contextualizada mejora la comprensión y la confianza sin necesariamente resolver la percepción de justicia del resultado, tal como sugiere la literatura sobre gestió»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Nota del revisor (2026-09-27):** el uso en `05_discusion.tex:17` le atribuye un hallazgo sobre la **percepción de justicia** (explicar mejora comprensión y confianza sin cambiar la justicia percibida) que no está registrado para esta fuente; el mismo uso se quitó de H3 en el Cap. 3. Verificar antes de mantenerlo en la reescritura de la Sec. 5.2.
- **Verificación:** ⏳ pendiente

### `lu2020goodexplanation`

- **Referencia:** Lu, Joy and others (2020). *A framework for good explanations in algorithmic decision contexts ({VERIFICAR} título y venue exactos)*. 
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:** no se cita en ningún capítulo (candidata a eliminar del `.bib` o a citar donde corresponda).
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `nefedov2022`

- **Referencia:** Nefedov, N. N. (2022). *Accessibility versus explainability: effects on perceived trustworthiness in public administration decisions ({VERIFICAR} título y venue exactos)*. 
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:47` — «\item Explicabilidad contextualizada: explicaciones ligadas a la situación específica del usuario son más efectivas que las descripciones abstractas del funcionamiento general del sistema, especialmente en contextos de decisión pública como trámites de visado o beneficios sociales [cita].»
  - `02_marco_teorico.tex:67` — «Esto convierte el diseño orientado a la transparencia en un requisito funcional, no en un elemento cosmético, y confirma la pertinencia de aplicar al SAE los mismos principios (divulgación progresiva, explicabilidad contextualizada, controles interactivos) que la literatura identifica como efectivos en otros dominios de alto impacto, como la administración pública [cita], la salud [cita] y los sistemas de recomendaci»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `kim2021recommender`

- **Referencia:** Kim, {(nombre no verificado)} (2021). *Revealing exploratory recommendations: effects on feedback and trust ({VERIFICAR} título, iniciales de autor y venue exactos)*. 
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:48` — «\item Controles interactivos con retroalimentación: permitir que el usuario explore el sistema (simuladores, ajustes, comparadores) aumenta la sensación de agencia y reduce la percepción de arbitrariedad, siempre que existan etiquetas claras y retroalimentación inmediata [cita].»
  - `05_discusion.tex:9` — «La comparación entre el prototipo y el estado actual del sitio oficial del SAE (Sección \ref{sec:res-sitio-oficial}) muestra un patrón que vale la pena anotar como hipótesis a discutir con más evidencia una vez completada la validación: las brechas que el sitio oficial cerró de forma independiente —búsqueda y encontrabilidad, e inclusión parcial mediante el indicador de Programa de Integración Escolar— corresponden a»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `feddersen2024forecasting`

- **Referencia:** Feddersen, {(nombre no verificado)} (2024). *Transparency and adjustable control in forecasting support systems ({VERIFICAR} título, iniciales de autor y venue exactos)*. 
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:48` — «\item Controles interactivos con retroalimentación: permitir que el usuario explore el sistema (simuladores, ajustes, comparadores) aumenta la sensación de agencia y reduce la percepción de arbitrariedad, siempre que existan etiquetas claras y retroalimentación inmediata [cita].»
  - `02_marco_teorico.tex:61` — «\item Otorgar a usuarios sin entrenamiento control de grano fino sobre componentes complejos del sistema puede producir ajustes peores que los del sistema automático [cita].»
  - `05_discusion.tex:9` — «La comparación entre el prototipo y el estado actual del sitio oficial del SAE (Sección \ref{sec:res-sitio-oficial}) muestra un patrón que vale la pena anotar como hipótesis a discutir con más evidencia una vez completada la validación: las brechas que el sitio oficial cerró de forma independiente —búsqueda y encontrabilidad, e inclusión parcial mediante el indicador de Programa de Integración Escolar— corresponden a»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `glazerman2018multidim`

- **Referencia:** Glazerman, S. and others (2018). *Multi-dimensional presentation of information in family school-choice decisions ({VERIFICAR} título y venue exactos)*. 
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:49` — «\item Presentación multidimensional: combinar gráficos con cifras mejora la comprensión y la calidad de la decisión del usuario, frente a la presentación de un único indicador agregado [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `graefe2022vehicles`

- **Referencia:** Graefe, Julia and others (2022). *User-centered explainability in intelligent vehicle comfort and infotainment features ({VERIFICAR} título y venue exactos)*. 
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:** no se cita en ningún capítulo (candidata a eliminar del `.bib` o a citar donde corresponda).
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `peng2023codesign`

- **Referencia:** Peng, {(nombre no verificado)} and others (2023). *Co-designed algorithmic recommendation reports for non-expert users ({VERIFICAR} título, iniciales de autor y venue exactos)*. 
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:50` — «\item Reportes y explicaciones co-diseñadas con usuarios no expertos: los formatos de explicación diseñados junto a los propios usuarios finales —en lugar de derivados solo de consideraciones técnicas— se ajustan mejor a sus necesidades reales de información [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `bobek2024xai`

- **Referencia:** Bobek, Szymon and others (2024). *Comprehensive human-centered evaluation of explainable AI methods ({VERIFICAR} título y venue exactos)*. 
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:50` — «\item Reportes y explicaciones co-diseñadas con usuarios no expertos: los formatos de explicación diseñados junto a los propios usuarios finales —en lugar de derivados solo de consideraciones técnicas— se ajustan mejor a sus necesidades reales de información [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `dawoud2023comparative`

- **Referencia:** Dawoud, {(nombre no verificado)} and others (2023). *Comparative human-centered evaluation of local explanation methods ({VERIFICAR} título, iniciales de autor y venue exactos)*. 
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:**
  - `02_marco_teorico.tex:62` — «\item Distintos métodos técnicos de explicación (por ejemplo, mapas de saliencia o atribuciones locales) pueden producir niveles de comprensión humana similares entre sí, lo que sugiere que la evaluación debería centrarse en el ajuste a la tarea del usuario y no solo en la novedad del método [cita].»
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `inel2020video`

- **Referencia:** Inel, Oana and others (2020). *Multi-type visual explanations for video summarization ({VERIFICAR} título y venue exactos)*. 
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:** no se cita en ningún capítulo (candidata a eliminar del `.bib` o a citar donde corresponda).
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

### `shin_fate`

- **Referencia:** Shin, D. (s/f). *User perceptions of fairness, accountability, transparency and explainability in personalized AI ({VERIFICAR} título y venue exactos)*.  Año no verificado
- **Bloque:** B — título descriptivo, **verificar título, venue y año contra la fuente original**
- **Lo que la memoria le atribuye:** no se cita en ningún capítulo (candidata a eliminar del `.bib` o a citar donde corresponda).
- **Aporte a la memoria:** _(completar al verificar: qué problema, método y hallazgo de la fuente sostienen las afirmaciones de arriba)_
- **Verificación:** ⏳ pendiente

