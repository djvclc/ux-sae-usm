# Investigación y validación de guías UX, explicabilidad y comunicación de riesgo aplicadas al SAE

**Proyecto:** Prototipo UX del Sistema de Admisión Escolar (SAE) + memoria de título  
**Fecha de investigación:** 8 de septiembre de 2026  
**Propósito:** verificar y fortalecer el marco de guías utilizado para fundamentar decisiones de diseño del prototipo, distinguiendo entre evidencia científica, guías profesionales, análisis de política pública y recomendaciones de implementación.

---

## 1. Alcance del documento

Este documento complementa `CONTEXTO_GENERAL_PROYECTO.md` y revisa críticamente las fuentes que allí aparecen agrupadas como:

- **HAX** — Microsoft Guidelines for Human-AI Interaction.
- **PAIR-ET** — Google People + AI Guidebook, capítulo Explainability + Trust.
- **NNG-XAI** — Nielsen Norman Group, Explainable AI in Chat Interfaces.
- **BROOK** — Brookings, algoritmos de asignación escolar K-12.
- **RISK-NUM** — comunicación de riesgo, numeracidad, frecuencias naturales e icon arrays.
- **FORM-MS** — buenas prácticas de formularios multipaso.

Además, se incorporan dos fuentes particularmente relevantes para el caso chileno:

- **Correa et al. (2022)** — *School Choice in Chile*.
- **Arteaga et al. (2022)** — *Smart Matching Platforms and Heterogeneous Beliefs in Centralized School Choice*.

El objetivo no es asumir que las decisiones ya implementadas en el prototipo son correctas por aparecer en una guía, sino determinar:

1. qué afirma realmente cada fuente;
2. qué tipo de evidencia entrega;
3. qué tan legítimo es trasladarla al contexto del SAE;
4. qué decisiones del prototipo puede fundamentar;
5. qué afirmaciones necesitan ser corregidas o debilitadas;
6. qué aspectos siguen requiriendo validación con usuarios.

---

# 2. Conclusión general

La estrategia de diseño actual del prototipo es **defendible**, pero la jerarquía bibliográfica debería ajustarse.

No todas las fuentes utilizadas tienen el mismo peso. Algunas provienen de investigación revisada por pares; otras son guías profesionales; otras son análisis de política pública; y algunas son artículos de buenas prácticas sin evidencia académica suficiente para sostener afirmaciones cuantitativas.

Una jerarquía recomendable es la siguiente:

| Nivel | Fuente | Tipo de evidencia | Relevancia para el SAE |
|---|---|---|---|
| **1** | Correa et al. (2022) | Artículo en *Operations Research* | Directa: diseño e implementación del SAE chileno |
| **1** | Arteaga et al. (2022) | Artículo en *Quarterly Journal of Economics* | Directa: comportamiento de familias dentro del sistema chileno |
| **2** | Amershi et al. / Microsoft HAX | Paper CHI 2019 + validaciones | Alta para interacción humano-sistema automatizado |
| **2** | Galesic et al. + literatura de risk communication | Experimentos y revisiones científicas | Alta para representar probabilidades |
| **3** | Google PAIR | Guía profesional basada en investigación | Muy alta para explicabilidad y confianza calibrada |
| **3** | Brookings | Análisis especializado de school choice | Muy alta por coincidencia de dominio |
| **3** | GOV.UK Design System | Patrones de servicios públicos con investigación de usuarios | Alta para formularios y trámites |
| **4** | Nielsen Norman Group | Recomendaciones profesionales UX | Útil como apoyo secundario |
| **4** | WeWeb / Venture Harbour | Blogs y práctica profesional | Débil como fundamento académico principal |

La recomendación central es estructurar la memoria desde **evidencia específica del SAE chileno**, utilizar después la literatura científica de interacción y comunicación de riesgo, y usar las guías profesionales como soporte de diseño.

---

# 3. Microsoft HAX — Guidelines for Human-AI Interaction

## 3.1 Qué es realmente

La referencia original es:

> Amershi, S., Weld, D., Vorvoreanu, M., et al. (2019). *Guidelines for Human-AI Interaction*. Proceedings of CHI 2019.

Microsoft presenta 18 guías generales para diseñar interacciones con sistemas que incorporan capacidades de IA.

La publicación no corresponde simplemente a una checklist interna. El conjunto fue elaborado mediante múltiples rondas de síntesis y evaluación. Microsoft informa además una validación con **49 profesionales de diseño**, quienes aplicaron las guías a **20 productos con componentes de IA**.

Esto le da un peso considerablemente mayor que una colección informal de buenas prácticas.

Fuente principal:

- https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/

## 3.2 Aplicación al prototipo SAE

Entre las guías utilizadas en el proyecto se encuentran:

| HAX | Principio | Aplicación razonable al prototipo |
|---|---|---|
| **G1** | Dejar claro qué puede hacer el sistema | Explicar antes de postular qué hace el mecanismo y qué no hace |
| **G2** | Dejar claro qué tan bien puede hacer lo que hace | Explicar el carácter estimado de las probabilidades mostradas |
| **G4** | Mostrar información contextual relevante | Mostrar vacantes, demanda y prioridad junto al colegio |
| **G5/G6** | Normas sociales y mitigación de sesgos | Evitar lenguaje estigmatizante sobre SEP, vulnerabilidad o mérito |
| **G10** | Delimitar el servicio cuando existe incertidumbre | Declarar las limitaciones del simulador |
| **G11** | Explicar por qué el sistema produjo un resultado | “Por qué Sofía quedó en Los Andes” |
| **G16** | Comunicar consecuencias de acciones | Mostrar qué cambia al modificar el orden de preferencias |

## 3.3 Precaución metodológica

El SAE utiliza un mecanismo de **Aceptación Diferida (Deferred Acceptance)**. No es un modelo de machine learning y no debería presentarse automáticamente como un sistema de inteligencia artificial.

Por lo tanto, sería metodológicamente excesivo escribir:

> “El SAE es un sistema de IA y por eso se aplicaron las guías HAX.”

Una formulación más segura sería:

> “Las guías HAX se utilizaron como heurísticas adaptadas para diseñar la interacción con un sistema automatizado que produce resultados de asignación y comunica estimaciones, sin asumir que el mecanismo de Aceptación Diferida constituye por sí mismo un modelo de inteligencia artificial.”

Esto permite utilizar el valor de HAX sin forzar una clasificación técnica discutible.

## 3.4 Veredicto

**Mantener HAX.**

Puede funcionar como marco formal en metodología o diseño, pero debe describirse como una **adaptación de heurísticas de interacción humano-IA a un sistema automatizado de alto impacto**, no como prueba de que el SAE sea IA.

---

# 4. Google PAIR — Explainability + Trust

## 4.1 Naturaleza de la fuente

El *People + AI Guidebook* de Google PAIR es una guía profesional de diseño centrado en personas. No es un único experimento académico, pero está construido utilizando investigación, literatura y experiencia de diseño.

Fuente:

- https://pair.withgoogle.com/guidebook/
- https://pair.withgoogle.com/chapter/explainability-trust/

## 4.2 Hallazgo central: confianza calibrada

PAIR no plantea que el objetivo de una interfaz deba ser **maximizar la confianza**.

El objetivo es que el usuario desarrolle un nivel de confianza apropiado de acuerdo con lo que el sistema puede y no puede hacer.

Esto es especialmente pertinente para el prototipo SAE.

El objetivo no debería ser que la familia piense:

> “Si la plataforma dice 26 %, entonces el número es exacto.”

El objetivo debería ser algo como:

> “Entiendo que es una estimación que me orienta y sé qué información se utilizó para producirla.”

Esto es **confianza calibrada**, no persuasión.

## 4.3 Explicación general vs. explicación específica

PAIR distingue explícitamente entre:

### Explicación general del sistema

Responde preguntas como:

> ¿Cómo funciona el mecanismo?

En el prototipo corresponde principalmente a:

- `/algoritmo`
- `AlgoSimuladorPasos`
- explicación de prioridades y cupos.

### Explicación específica del resultado

Responde:

> ¿Por qué ocurrió este resultado particular?

En el prototipo corresponde principalmente a:

- `/seguimiento`
- `generarExplicacion`
- “por qué quedaste en este colegio”.

PAIR destaca el valor de conectar la explicación directamente con la tarea del usuario.

Esta distinción fundamenta muy bien la coexistencia de una sección general del algoritmo y una explicación contextualizada del resultado individual.

## 4.4 Divulgación parcial y progresiva

PAIR sostiene que explicar absolutamente todo puede ser innecesario o contraproducente. Recomienda explicar los elementos que influyen en la confianza y la toma de decisiones y utilizar **partial explanations** junto con **progressive disclosure** cuando corresponda.

Aplicación al SAE:

- mostrar primero lo que la familia necesita para decidir;
- permitir acceder a mayor detalle si desea comprender el mecanismo;
- no convertir cada pantalla de postulación en una exposición técnica de Deferred Acceptance.

## 4.5 Probabilidades y números

PAIR advierte que un indicador numérico presupone que el usuario comprende correctamente la probabilidad.

Un número como:

> 26 %

puede ser interpretado de forma incorrecta si no se entrega contexto.

PAIR propone explorar:

- categorías;
- alternativas;
- números;
- visualizaciones;
- explicaciones contextuales;

y, crucialmente, **probar esas representaciones con usuarios**.

Esto respalda conceptualmente `ProbabilidadVisual`, pero no demuestra que la representación concreta usada en el prototipo sea superior.

## 4.6 Distinción importante para la memoria

En PAIR se habla frecuentemente de **model confidence**, porque su dominio son sistemas de IA.

En el prototipo SAE, el 26 % no corresponde a la “confianza de un modelo”.

Es una **estimación de probabilidad obtenida mediante una simulación Monte Carlo**.

Por lo tanto, en la memoria es preferible utilizar:

> “comunicación de probabilidad e incertidumbre”

en lugar de:

> “confianza del modelo”.

## 4.7 Veredicto

**PAIR debería mantenerse como uno de los marcos centrales de explicabilidad del prototipo.**

Es especialmente útil para:

- confianza calibrada;
- explicaciones parciales;
- divulgación progresiva;
- explicación general vs. local;
- comunicación contextualizada de probabilidades;
- necesidad de validar la visualización con usuarios.

---

# 5. Nielsen Norman Group — Explainable AI in Chat Interfaces

## 5.1 Fuente

El artículo revisado es:

> Megan Chan (2025). *Explainable AI in Chat Interfaces*. Nielsen Norman Group.

Fuente:

- https://www.nngroup.com/articles/explainable-ai/

Publicado el 12 de diciembre de 2025.

## 5.2 Qué aporta

El artículo plantea recomendaciones como:

- mostrar explicaciones y limitaciones en lugares visibles;
- utilizar lenguaje directo;
- hacer los avisos accionables;
- evitar lenguaje que atribuya características humanas a un sistema;
- ayudar al usuario a desarrollar un modelo mental adecuado.

Esto puede apoyar decisiones de microcopy como reemplazar:

> “El sistema intenta dejarlos juntos.”

por:

> “Se aplica la prioridad de hermano/a según los cupos disponibles.”

La segunda forma describe una regla en vez de atribuir intención humana al software.

## 5.3 Limitación de transferencia

El artículo está construido específicamente alrededor de **interfaces conversacionales y LLMs**.

Por ello, no debería usarse como evidencia principal de que una determinada frase mejora la comprensión del SAE.

Es más correcto escribir:

> “En coherencia con recomendaciones profesionales de NN/g sobre interfaces explicables…”

que:

> “NN/g demuestra que…”

## 5.4 Veredicto

**Mantener como fuente profesional secundaria.**

Es útil para microcopy y presentación de explicaciones, pero HAX, PAIR, la literatura de elección escolar y los estudios específicos del SAE deben tener mayor peso.

---

# 6. Brookings — algoritmos de asignación escolar K-12

## 6.1 Relevancia

La publicación es:

> Kasman, M. & Valant, J. (2019). *The opportunities and risks of K-12 student placement algorithms*.

Fuente:

- https://www.brookings.edu/articles/the-opportunities-and-risks-of-k-12-student-placement-algorithms/

Aunque no es un artículo experimental revisado por pares, su valor para esta memoria es elevado porque analiza directamente mecanismos de asignación escolar centralizada.

## 6.2 Strategy-proofness y falso riesgo estratégico

Brookings explica que, bajo Deferred Acceptance, una familia no es castigada por ubicar en primer lugar un colegio cuya admisión considera difícil.

Esto respalda directamente el problema del prototipo denominado:

> **falso riesgo estratégico**

Una familia puede pensar erróneamente:

> “Si es difícil entrar, debería ponerlo más abajo para no perder mis otras posibilidades.”

En un mecanismo strategy-proof de DA, esa lógica puede llevar a una peor expresión de preferencias.

## 6.3 Riesgos de comprensión

Brookings identifica problemas como:

- intentar “jugar” estratégicamente un mecanismo strategy-proof;
- poner colegios de mayor probabilidad por encima de la preferencia real;
- solicitar pocos colegios;
- subestimar el riesgo de quedar sin asignación.

Esto coincide directamente con varios objetivos pedagógicos del flujo de postulación del prototipo.

## 6.4 Gestión de expectativas

Brookings también enfatiza que un mecanismo de asignación no puede solucionar todos los problemas del mercado educativo.

La interfaz debería dejar claro que el mecanismo:

- distribuye cupos existentes;
- no crea vacantes;
- no garantiza la primera preferencia;
- no elimina la escasez de colegios altamente demandados.

Esto fortalece el uso de mensajes tipo:

> “El sistema no puede crear cupos ni garantizar tu primera opción.”

La frustración del usuario puede entonces dirigirse correctamente hacia la escasez o las restricciones del sistema, en lugar de interpretarse automáticamente como arbitrariedad algorítmica.

## 6.5 Videos animados

Brookings menciona experiencias donde sistemas escolares utilizan materiales animados o audiovisuales para explicar la asignación.

Sin embargo, esto **no equivale a demostrar experimentalmente que un video animado mejora la comprensión**.

La afirmación segura es:

> “Los videos animados han sido utilizados como mecanismo de comunicación en sistemas de asignación.”

No:

> “Los videos animados han demostrado aumentar la comprensión.”

## 6.6 Veredicto

**Mantener y aumentar su peso dentro del marco aplicado al SAE.**

Es una fuente especialmente valiosa porque vincula los principios de UX con problemas que aparecen específicamente en sistemas de school choice.

---

# 7. Comunicación de riesgo y numeracidad — RISK-NUM

Esta sección necesita una corrección importante respecto del agrupamiento actual.

## 7.1 Icon arrays

Una fuente científica sólida es:

> Galesic, M., Garcia-Retamero, R. & Gigerenzer, G. (2009). *Using icon arrays to communicate medical risks: overcoming low numeracy.*

Fuente:

- https://pubmed.ncbi.nlm.nih.gov/19290713/

El estudio concluye que los icon arrays son una forma prometedora de comunicar riesgo, incluyendo a personas con menor numeracidad.

Esto proporciona un fundamento científico razonable para explorar una representación visual como `ProbabilidadVisual`.

### Precaución

La evidencia proviene principalmente del dominio médico.

No demuestra automáticamente que el mismo efecto ocurra en elección escolar.

Por tanto:

> icon arrays = decisión fundamentada;

pero:

> eficacia de icon arrays en familias usuarias del SAE = hipótesis que debe probarse.

---

## 7.2 Frecuencias naturales y formato “X de cada 100”

La literatura de comunicación de riesgo encuentra que el formato de representación cambia la comprensión.

Una revisión reciente sobre comunicación de riesgo recomienda, dentro de su contexto clínico, utilizar frecuencias con denominadores consistentes, por ejemplo:

> “20 de cada 100”

en lugar de depender únicamente del porcentaje.

Fuente:

- https://pmc.ncbi.nlm.nih.gov/articles/PMC11067312/

Una revisión clásica más amplia también muestra que el efecto de porcentajes, frecuencias, gráficos y otras formas depende del contexto:

- https://pubmed.ncbi.nlm.nih.gov/19000070/

Por ello, la afirmación recomendable no es:

> “X de cada 100 siempre es mejor que un porcentaje.”

Sino:

> “Los formatos de frecuencia natural con denominadores consistentes pueden facilitar la interpretación de probabilidades en determinadas tareas, particularmente cuando existen diferencias de numeracidad; su efectividad depende del contexto y debe validarse con la población objetivo.”

Esto encaja mejor con la metodología de la memoria.

---

# 8. Corrección importante: arXiv:2408.12365

El identificador:

> **arXiv:2408.12365**

corresponde a:

> Karagappa, A., et al. (2024). *Enhancing Uncertainty Communication in Time Series Predictions: Insights and Recommendations.*

Fuente:

- https://arxiv.org/abs/2408.12365

El paper estudia visualizaciones de incertidumbre en **predicciones de series temporales**.

No es la fuente primaria adecuada para justificar:

- icon arrays;
- frecuencias naturales;
- “X de cada 100”.

Sí puede utilizarse como fuente complementaria para discutir:

- visualización de incertidumbre;
- carga visual;
- comprensión de predicciones;
- diferencias entre representaciones.

## Recomendación

Separar el actual bloque `RISK-NUM`:

| Aspecto | Fuente recomendada |
|---|---|
| Icon arrays y baja numeracidad | Galesic et al. (2009) |
| Frecuencias naturales | Literatura de risk communication |
| Visualización de incertidumbre | Karagappa et al. (2024) |
| Aplicación al SAE | Validación propia con usuarios |

---

# 9. FORM-MS — formularios multipaso

## 9.1 Evaluación de las fuentes actuales

Las fuentes mencionadas actualmente —por ejemplo WeWeb y Venture Harbour— incluyen recomendaciones plausibles sobre:

- indicadores de progreso;
- división de formularios en pasos;
- volver atrás;
- validación;
- guardado/reanudación.

Sin embargo, son principalmente **fuentes profesionales o comerciales**, no evidencia científica fuerte.

## 9.2 La cifra “20–25 % menos abandono”

Durante esta revisión no se pudo verificar una fuente primaria suficientemente sólida para la afirmación:

> “el indicador de progreso reduce entre 20 y 25 % el abandono”.

Por tanto, esta cifra **no debería utilizarse como hecho en la memoria** mientras no se encuentre su origen primario.

## 9.3 Alternativa más apropiada: GOV.UK Design System

Para una plataforma pública como el SAE resulta más pertinente utilizar patrones del **GOV.UK Design System**.

Fuentes:

- https://design-system.service.gov.uk/patterns/
- https://design-system.service.gov.uk/patterns/question-pages/
- https://design-system.service.gov.uk/patterns/validation/
- https://design-system.service.gov.uk/patterns/check-answers/
- https://design-system.service.gov.uk/patterns/confirmation-pages/

Los patrones incluyen recomendaciones para:

- preguntar solo información necesaria;
- mantener la posibilidad de volver atrás;
- conservar datos cuando existe un error;
- permitir revisar respuestas antes de enviar;
- entregar una página de confirmación;
- mostrar número de referencia;
- explicar qué ocurre después;
- entregar un registro de la transacción.

Además, GOV.UK declara investigación con usuarios para diversos patrones, incluyendo personas con baja alfabetización digital y personas con discapacidad.

## 9.4 Relación con el prototipo

El proyecto eliminó deliberadamente la persistencia del borrador entre visitas para evitar contaminación entre participantes de la prueba comparativa.

Esto es metodológicamente coherente.

Una buena práctica identificada en otra fuente no tiene por qué implementarse cuando existe una razón experimental explícita para excluirla.

## 9.5 Veredicto

- reducir el peso de WeWeb/Venture Harbour;
- eliminar la cifra 20–25 % salvo verificación posterior;
- utilizar GOV.UK como marco más pertinente para trámites públicos;
- mantener la decisión del prototipo de no persistir el borrador durante el estudio comparativo.

---

# 10. Correa et al. — School Choice in Chile

## 10.1 Importancia

Referencia:

> Correa, J., Epstein, R., Escobar, J., Ríos, I., et al. (2022). *School Choice in Chile*. Operations Research, 70(2), 1066–1087.

Fuentes:

- https://pubsonline.informs.org/doi/abs/10.1287/opre.2021.2184
- https://www.dii.uchile.cl/~jcorrea/papers/Journals/2022CEER.pdf

Es una de las fuentes más importantes del proyecto porque describe directamente el diseño e implementación del sistema chileno.

## 10.2 Hallazgo especialmente relevante para la tesis

Los diseñadores estudiaron dos alternativas principales:

- Deferred Acceptance (DA);
- Top Trading Cycles (TTC).

El paper señala que optaron por DA, entre otras razones, porque **comunicar el resultado de la asignación —especialmente a familias insatisfechas con su resultado— era mucho más simple bajo DA**.

Este hallazgo es extremadamente relevante.

Implica que la comunicabilidad no es simplemente una preocupación UX añadida después del desarrollo del SAE.

Fue una consideración explícita al escoger el mecanismo.

## 10.3 Implicación conceptual

La tesis puede sostener que el prototipo no intenta “hacer explicable” un mecanismo diseñado sin preocupación por la comunicación.

Más bien intenta recuperar y materializar en la interfaz una propiedad de comunicabilidad que los propios diseñadores consideraron importante.

Una formulación posible para la memoria sería:

> “La transparencia de la interfaz no constituye una capa completamente ajena al diseño del mecanismo. Correa et al. señalan que una de las razones para adoptar Aceptación Diferida frente a Top Trading Cycles fue la mayor facilidad para comunicar los resultados de asignación, particularmente a familias descontentas con el resultado obtenido.”

## 10.4 Veredicto

**Correa et al. debería ocupar un lugar central tanto en la explicación matemática como en la fundamentación del problema de transparencia.**

---

# 11. Arteaga et al. — evidencia empírica directamente sobre familias chilenas

## 11.1 Referencia

> Arteaga, F., Kapor, A. J., Neilson, C. A. & Zimmerman, S. D. (2022). *Smart Matching Platforms and Heterogeneous Beliefs in Centralized School Choice*. The Quarterly Journal of Economics, 137(3), 1791–1848.

Fuente:

- https://academic.oup.com/qje/article/137/3/1791/6544686
- https://www.nber.org/papers/w28946

Esta fuente es especialmente importante porque analiza el **sistema chileno de elección escolar** y el comportamiento real de sus participantes.

---

## 11.2 Encuesta a 48.929 participantes

Durante el proceso de elección 2020, el gobierno chileno realizó una encuesta a las familias después de que enviaran sus postulaciones pero antes de conocer los resultados.

**48.929 postulantes/familias** respondieron.

Esto ofrece evidencia directamente relacionada con:

- búsqueda de colegios;
- preferencias;
- creencias sobre posibilidades de asignación;
- decisión de seguir o dejar de buscar alternativas.

---

## 11.3 Sobreoptimismo

Entre postulantes con riesgo no nulo de quedar sin asignación, las creencias subjetivas fueron considerablemente más optimistas que las probabilidades objetivas estimadas.

El estudio reporta:

- probabilidad subjetiva promedio: aproximadamente **76 %**;
- probabilidad objetiva promedio: aproximadamente **44 %**;
- diferencia: **32 puntos porcentuales**.

Esto demuestra que incluso cuando el mecanismo es strategy-proof, las creencias sobre posibilidades de admisión siguen influyendo en cómo las familias construyen su lista.

---

## 11.4 Por qué las familias dejan de agregar colegios

El estudio pregunta por qué no se agregaron más establecimientos.

La respuesta más frecuente fue:

> creer que serían asignados a alguno de los colegios que ya estaban en la lista.

**35 %** de los encuestados entregó esa respuesta.

Otro **17 %** señaló que era difícil encontrar más colegios.

En conjunto, estos resultados muestran que la búsqueda de alternativas tiene un costo real para las familias y que la percepción de riesgo influye en la longitud de la lista.

---

## 11.5 Smart matching platform y advertencias personalizadas

El sistema chileno implementó mensajes personalizados cuando una postulación presentaba un riesgo elevado de no asignación.

El estudio reporta que la advertencia llevó a:

- **21,6 %** de los postulantes tratados a agregar al menos un colegio;
- la gran mayoría de los cambios fueron **adiciones**, no eliminación de colegios;
- los estudiantes que respondieron a la intervención agregaron en promedio aproximadamente **1,6 colegios**;
- estos participantes redujeron su riesgo de no asignación en aproximadamente **15,5 puntos porcentuales**.

La mayoría de las nuevas opciones se agregó hacia la parte inferior de la lista.

Muy pocos usuarios agregaron nuevas opciones en la parte superior.

---

## 11.6 Por qué este hallazgo es tan importante para el prototipo

El patrón observado coincide directamente con el consejo de diseño:

> “Mantén primero el colegio que realmente prefieres y agrega alternativas de respaldo más abajo.”

La intervención no necesita convencer a la familia de mover su colegio preferido hacia abajo.

Debe ayudarla a comprender el riesgo y explorar alternativas.

Esto fortalece considerablemente el fundamento del prototipo.

---

## 11.7 Información personalizada vs. nudges genéricos

Arteaga et al. también encuentran que la información personalizada de riesgo es una parte crítica de la intervención.

Nudges genéricos que simplemente incentivaban a agregar colegios, sin comunicar información de riesgo, tuvieron efectos mucho menores o nulos.

Además, imponer mecánicamente una lista más larga sin explicar por qué agregar opciones es importante puede producir peores resultados de aceptación.

Esto es muy relevante para la UX del prototipo:

> una advertencia no debería limitarse a “agrega más colegios”.

Debería explicar:

- por qué existe riesgo;
- qué significa;
- qué acción puede tomar la familia;
- por qué esa acción no implica sacrificar su preferencia real.

---

# 12. Nueva cadena de evidencia recomendada para la tesis

La fundamentación de diseño puede estructurarse de la siguiente manera:

## 12.1 Problema observado en Chile

**Arteaga et al.**

Las familias:

- tienen creencias incorrectas sobre sus posibilidades;
- pueden sobreestimar sus chances;
- pueden detener la búsqueda demasiado pronto;
- reaccionan a información personalizada de riesgo.

↓

## 12.2 Propiedad del mecanismo

**Correa et al. + literatura DA**

- Deferred Acceptance es estratégicamente simple;
- el orden debería reflejar preferencias reales;
- la comunicabilidad fue considerada en el propio diseño chileno.

↓

## 12.3 Cómo diseñar la explicación

**HAX + PAIR**

- explicar capacidades y límites;
- proporcionar contexto;
- explicar resultados específicos;
- usar divulgación progresiva;
- calibrar confianza.

↓

## 12.4 Cómo presentar probabilidades

**Galesic et al. + risk communication**

- explorar frecuencias naturales;
- utilizar representaciones visuales;
- considerar baja numeracidad;
- evitar asumir que un porcentaje se interpreta correctamente.

↓

## 12.5 Cómo implementar el flujo

**GOV.UK + NN/g**

- formularios claros;
- navegación y recuperación de errores;
- revisión antes de confirmar;
- microcopy accionable;
- lenguaje no antropomórfico.

↓

## 12.6 Validación propia

**Estudio comparativo de la memoria**

Determinar si esta implementación concreta mejora:

- comprensión;
- confianza;
- percepción de justicia.

---

# 13. Matriz guía → decisión → fuerza de evidencia

| Decisión del prototipo | Fundamento | Fuerza actual |
|---|---|---|
| Explicar qué hace y qué no hace el mecanismo antes de postular | HAX G1 + Brookings | **Fuerte** |
| Explicar por qué ocurrió un resultado concreto | HAX G11 + PAIR | **Fuerte** |
| Separar explicación general y explicación del resultado | PAIR | **Fuerte** |
| No recomendar bajar el colegio verdaderamente preferido | DA + Brookings + Arteaga et al. | **Muy fuerte** |
| Recomendar agregar respaldos más abajo | Arteaga et al. | **Muy fuerte y directamente chilena** |
| Mostrar información personalizada de riesgo | Arteaga et al. + PAIR | **Muy fuerte** |
| Mostrar “26 de cada 100” | Risk communication | **Fundamentado, requiere validación local** |
| Utilizar icon array | Galesic et al. | **Fundamentado, transferencia desde salud** |
| Acompañar porcentaje con fundamento visible | PAIR | **Fuerte** |
| Evitar lenguaje estigmatizante | HAX G5/G6 | **Fuerte como heurística** |
| Evitar antropomorfismo | NN/g | **Apoyo profesional** |
| Explicar que el sistema no crea cupos | Brookings | **Fuerte por dominio** |
| Mostrar pasos y permitir revisar respuestas | GOV.UK | **Fuerte como patrón de servicio público** |
| Indicador de progreso reduce 20–25 % abandono | FORM-MS | **No verificado; retirar cifra** |
| Persistir borrador entre visitas | Guías de formularios | **Buena práctica, pero excluida justificadamente por diseño experimental** |

---

# 14. Correcciones recomendadas en la documentación actual

## 14.1 HAX

### Evitar

> “El SAE es un sistema de IA y se aplicaron las guías HAX.”

### Preferir

> “Las guías HAX se adaptaron como heurísticas de interacción para un sistema automatizado de asignación y apoyo a la decisión.”

---

## 14.2 PAIR

No llamar al porcentaje Monte Carlo:

> “confianza del modelo”.

Usar:

> “probabilidad estimada”  
> “estimación de probabilidad”  
> “comunicación de incertidumbre”.

---

## 14.3 NN/g

Usarlo como:

> recomendación profesional complementaria.

No como:

> evidencia experimental primaria del comportamiento de familias SAE.

---

## 14.4 Brookings

Aumentar su peso en:

- falso riesgo estratégico;
- gestión de expectativas;
- diferencia entre escasez de cupos y funcionamiento del algoritmo.

---

## 14.5 RISK-NUM

Dividir las fuentes:

- Galesic → icon arrays;
- revisiones de risk communication → frecuencias naturales;
- Karagappa → visualización de incertidumbre;
- estudio propio → validación en SAE.

---

## 14.6 FORM-MS

Eliminar, mientras no se identifique una fuente primaria:

> “−20–25 % de abandono”.

Reemplazar WeWeb/Venture Harbour por GOV.UK cuando exista un patrón equivalente.

---

## 14.7 Arteaga et al.

Incorporar como una fuente central del marco y de la metodología.

Es particularmente adecuada para justificar:

- `ColegioAnalisis`;
- comunicación de riesgo;
- recomendaciones de respaldo;
- advertencias personalizadas;
- estrategia de no alterar la preferencia real.

---

## 14.8 Correa et al.

Además de explicar el algoritmo, utilizarlo para fundamentar que **la comunicabilidad fue un criterio explícito de diseño del mecanismo chileno**.

---

# 15. Qué NO puede demostrarse solo mediante estas fuentes

Incluso con esta fundamentación, no debería afirmarse antes de la prueba con usuarios que:

- `ProbabilidadVisual` mejora la comprensión de familias chilenas;
- “26 de cada 100” es superior a 26 % específicamente en el SAE;
- el prototipo aumenta la confianza;
- el prototipo aumenta la percepción de justicia;
- explicar el resultado reduce automáticamente la percepción de “tómbola”;
- un icon array es necesariamente la mejor representación;
- la divulgación progresiva elegida es óptima para este público.

Esas son **hipótesis de diseño** que el estudio comparativo debe evaluar.

La cadena correcta es:

> literatura → decisión fundamentada → implementación → prueba con usuarios → evidencia propia.

No:

> literatura → decisión → “funciona”.

---

# 16. Relevancia para el estudio comparativo A/B

La nueva jerarquía de fuentes fortalece especialmente el diseño experimental previsto.

## Condición A — explicativa

Puede justificarse mediante:

- HAX;
- PAIR;
- risk communication;
- Brookings;
- Arteaga et al.;
- Correa et al.

## Condición B — control

Debe conservar el funcionamiento básico del flujo real y retirar la capa explicativa sin convertir la condición control en una interfaz artificialmente mala.

La comparación puede entonces responder:

> “Dado el mismo caso, el mismo orden de colegios y el mismo resultado, ¿la capa de explicación basada en estas guías mejora la comprensión, confianza y percepción de justicia?”

Esto es metodológicamente mucho más claro que comparar dos flujos que cambien simultáneamente contenido, orden, resultado o dificultad.

---

# 17. Recomendación de estructura para la memoria

Una organización posible sería:

## Marco teórico

### 1. Sistema de Admisión Escolar y Deferred Acceptance

- Correa et al.
- propiedades del mecanismo;
- prioridades;
- comunicabilidad.

### 2. Comportamiento y creencias de familias en school choice

- Arteaga et al.;
- riesgo percibido;
- búsqueda de colegios;
- información personalizada.

### 3. Transparencia y explicabilidad centrada en usuarios

- revisión sistemática propia;
- HAX;
- PAIR.

### 4. Comunicación de probabilidad e incertidumbre

- Galesic;
- revisiones de risk communication;
- visualizaciones;
- numeracidad.

### 5. Diseño de servicios públicos digitales

- GOV.UK;
- accesibilidad;
- formularios;
- prevención de errores.

### 6. Apoyo profesional de microcopy

- NN/g;
- otras fuentes secundarias.

Esto produce una jerarquía más académicamente sólida que presentar todas las guías con el mismo nivel de autoridad.

---

# 18. Referencias principales verificadas

## Microsoft HAX

Amershi, S., Weld, D., Vorvoreanu, M., Fourney, A., Nushi, B., Collisson, P., et al. (2019).  
**Guidelines for Human-AI Interaction.** CHI 2019.

- https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/

## Google PAIR

Google People + AI Research.  
**People + AI Guidebook — Explainability + Trust.**

- https://pair.withgoogle.com/guidebook/
- https://pair.withgoogle.com/chapter/explainability-trust/

## Nielsen Norman Group

Chan, M. (2025).  
**Explainable AI in Chat Interfaces.**

- https://www.nngroup.com/articles/explainable-ai/

## Brookings

Kasman, M. & Valant, J. (2019).  
**The opportunities and risks of K-12 student placement algorithms.**

- https://www.brookings.edu/articles/the-opportunities-and-risks-of-k-12-student-placement-algorithms/

## Icon arrays

Galesic, M., Garcia-Retamero, R. & Gigerenzer, G. (2009).  
**Using icon arrays to communicate medical risks: overcoming low numeracy.**

- https://pubmed.ncbi.nlm.nih.gov/19290713/

## Probability / risk communication

Visschers, V. H. M., Meertens, R. M., Passchier, W. W. F. & de Vries, N. N. K. (2009).  
**Probability information in risk communication: a review of the research literature.**

- https://pubmed.ncbi.nlm.nih.gov/19000070/

Systematic review on verbal and numeric risk communication:

- https://pmc.ncbi.nlm.nih.gov/articles/PMC11067312/

## Uncertainty visualization

Karagappa, A., Kaur Betz, P., Gilg, J., Zeumer, M., Gerndt, A. & Preim, B. (2024).  
**Enhancing Uncertainty Communication in Time Series Predictions: Insights and Recommendations.**

- https://arxiv.org/abs/2408.12365

## GOV.UK Design System

- https://design-system.service.gov.uk/patterns/
- https://design-system.service.gov.uk/patterns/question-pages/
- https://design-system.service.gov.uk/patterns/validation/
- https://design-system.service.gov.uk/patterns/check-answers/
- https://design-system.service.gov.uk/patterns/confirmation-pages/

## SAE chileno

Correa, J., Epstein, R., Escobar, J., Ríos, I., et al. (2022).  
**School Choice in Chile. Operations Research, 70(2), 1066–1087.**

- https://pubsonline.informs.org/doi/abs/10.1287/opre.2021.2184
- https://www.dii.uchile.cl/~jcorrea/papers/Journals/2022CEER.pdf

## Smart matching / comportamiento en Chile

Arteaga, F., Kapor, A. J., Neilson, C. A. & Zimmerman, S. D. (2022).  
**Smart Matching Platforms and Heterogeneous Beliefs in Centralized School Choice. The Quarterly Journal of Economics, 137(3), 1791–1848.**

- https://academic.oup.com/qje/article/137/3/1791/6544686
- https://www.nber.org/papers/w28946

---

# 19. Conclusión final

La revisión externa fortalece la dirección general del prototipo, pero exige mejorar la disciplina bibliográfica.

Los principales resultados son:

1. **HAX es un marco serio y validado**, pero debe presentarse como adaptación a un sistema automatizado y no como prueba de que DA sea IA.
2. **PAIR es muy adecuado** para confianza calibrada, divulgación progresiva y explicación contextual.
3. **NN/g sirve como apoyo de microcopy**, pero no debería sostener por sí solo afirmaciones causales sobre usuarios del SAE.
4. **Brookings es especialmente relevante** para falso riesgo estratégico, listas cortas y gestión de expectativas.
5. **RISK-NUM debe separarse en fuentes distintas**; arXiv:2408.12365 no es la fuente de icon arrays ni de frecuencias naturales.
6. **La cifra de 20–25 % de reducción de abandono en FORM-MS no quedó verificada** y debería retirarse mientras no exista fuente primaria.
7. **GOV.UK es una alternativa más sólida y pertinente** para diseño de trámites públicos multipaso.
8. **Correa et al. demuestra que la comunicabilidad fue una consideración explícita en la selección de DA para Chile.**
9. **Arteaga et al. aporta evidencia directamente chilena de que las familias sobreestiman sus posibilidades y responden a información personalizada de riesgo.**
10. La combinación **preferencia real primero + información de riesgo + respaldos más abajo** tiene ahora un fundamento particularmente fuerte en evidencia del propio sistema chileno.
11. Ninguna de estas fuentes reemplaza la necesidad de validar `ProbabilidadVisual`, los mensajes y las explicaciones con los participantes del estudio.
12. La memoria debería distinguir siempre entre **decisión fundamentada** y **efectividad empíricamente demostrada en el prototipo**.

---

> **Nota metodológica:** este documento es una síntesis de investigación y verificación bibliográfica. Para citas académicas finales se recomienda incorporar las referencias primarias directamente en `referencias.bib` y comprobar DOI, autores, volumen, páginas y formato bibliográfico antes de la entrega de la memoria.
