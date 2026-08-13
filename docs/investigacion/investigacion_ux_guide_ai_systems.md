# Investigación: guías de UX para sistemas de IA aplicadas al flujo de postulación y la visualización de datos del algoritmo SAE

**Fecha:** 2026-08-13
**Método:** Revisión de los dos marcos de referencia más citados en la industria para diseño de interacción humano-IA (Microsoft Guidelines for Human-AI Interaction / HAX Toolkit, y Google People + AI Research Guidebook), complementada con investigación aplicada de Nielsen Norman Group sobre IA explicable, literatura académica y de políticas públicas sobre sistemas de asignación escolar (unified enrollment / deferred acceptance), y principios de comunicación de riesgo y probabilidad para audiencias con alfabetización numérica básica-intermedia.
**Propósito:** Responder al pendiente dejado en `caso_estudio_prueba_usabilidad_postulacion.md` §7 ("instrucciones sobre los estudios que deben regir el diseño de las advertencias/alertas") y aportar fundamento a mejoras futuras del flujo de postulación y de la comunicación de resultados del algoritmo, coherente con los principios ya vigentes del proyecto (divulgación progresiva, explicabilidad contextualizada, controles con retroalimentación — ver `NotasPage.jsx`).

---

## 1. Por qué el SAE es, específicamente, un caso de "IA de alto riesgo" para efectos de diseño

Aunque el algoritmo de Aceptación Diferida (DA) es determinista y auditable —no es un modelo de aprendizaje automático—, desde el punto de vista de la experiencia de usuario cumple todas las condiciones que la literatura de interacción humano-IA trata como de alto riesgo: es un sistema centralizado que decide un resultado consecuente e irreversible por período (dónde estudiará un hijo/a), la lógica interna es opaca para la persona usuaria aunque sea simple para un experto, y las familias no pueden verificar el resultado por sí mismas. Kasman y Valant (Brookings, 2019) lo plantean así para los sistemas de "unified enrollment" (UE) de ciudades de EE.UU. que usan DA, la misma familia de mecanismos que el SAE: *"for all of their technical elegance, these systems' ultimate success will depend on how people interact with them"*. Esto justifica aplicar guías de diseño para IA al SAE, aun cuando técnicamente no sea IA generativa ni predictiva: el problema de fondo —comunicar un proceso algorítmico complejo a personas con baja confianza y alfabetización digital básica-intermedia— es el mismo que estas guías abordan.

Ese mismo artículo de Brookings da recomendaciones directamente aplicables al proyecto:

- Los administradores de sistemas UE deben ser transparentes sobre cómo funciona el algoritmo de asignación, y algunas ciudades ya usan **videos animados** para explicarlo en lenguaje accesible.
- Se debe comunicar explícitamente **qué es lo que el sistema no puede hacer** ("cannot create good schools by themselves, nor can they ensure that all applicants receive a seat in their first-choice school"), para dirigir la frustración de las familias a las causas reales (escasez de cupos) y no al algoritmo.
- El mayor riesgo detectado no es técnico sino de percepción: mientras algunos colegios tengan más demanda que cupos, el sistema **le dirá que no a algunas familias**, y esto erosiona la confianza pública en el sistema si no se gestiona con expectativas claras desde el principio.

Esto respalda directamente el bloque "¿Y si no quedo en ninguna?" ya implementado en S22 y el principio de gestión de expectativas de la persona Daniela.

## 2. Microsoft Guidelines for Human-AI Interaction (18 guías, HAX Toolkit)

Síntesis de más de 20 años de investigación, validada en CHI 2019 con 49 profesionales de diseño contra 20 productos de IA populares. Se organizan en cuatro momentos de la interacción. A continuación, cada guía con su lectura para el flujo de postulación del SAE.

### Al inicio

**G1 — Deja claro qué puede hacer el sistema.** El prototipo ya cumple esto en el modo tutorial y en `/proceso`, pero conviene revisar que la primera pantalla de `/postulacion` explicite, antes de pedir datos, qué hace el algoritmo y qué no decide la familia directamente (orden de prioridad legal, no "puntaje").

**G2 — Deja claro qué tan bien puede hacerlo.** Aplica directamente a la comunicación de probabilidad por colegio: el usuario necesita saber que la cifra es una **estimación**, no una promesa, y de qué está hecha (postulantes año anterior, vacantes, prioridades activadas). Es el fundamento de por qué mostrar el dato crudo (`postulantesAnterior` / vacantes) junto al porcentaje, no solo el porcentaje aislado.

### Durante la interacción

**G3 — Sincroniza el servicio según el contexto** y **G4 — Muestra información contextualmente relevante.** El análisis por colegio (`ColegioAnalisis`) ya hace esto al mostrar datos junto a cada opción en el momento de decidir, siguiendo el patrón de NYC MySchools citado en `analisis_flujo_postulacion.md`.

**G5 — Respeta las normas sociales relevantes** y **G6 — Mitiga sesgos sociales.** Relevante para el lenguaje de las advertencias: evitar que el aviso sobre un colegio de alta demanda suene a juicio sobre la familia (p. ej., insinuar que "apuntó muy alto"), y revisar que ningún ejemplo o dato mostrado refuerce estigmas socioeconómicos entre colegios de distinta categoría.

### Cuando el sistema se equivoca o hay incertidumbre

**G10 — Delimita el servicio cuando hay duda** y **G11 — Deja claro por qué el sistema hizo lo que hizo.** Estas dos son el núcleo del pendiente sobre advertencias. G11 exige que, frente a una probabilidad baja, el sistema explique **la razón real** (alta demanda relativa a cupos y prioridades) y no una explicación genérica. G10 sugiere que, ante incertidumbre, el sistema ayude al usuario a completar la tarea por sí mismo en vez de decidir por él — es decir, la página puede mostrar el dato y el contexto, pero la decisión de dónde poner un colegio en la lista debe quedar explícitamente en manos de la familia, sin literalmente decirle "muévelo".

### A lo largo del tiempo

**G16 — Comunica las consecuencias de las acciones del usuario.** Aplica de lleno al problema central del caso de estudio de Colegio San Martín: antes de que la familia reordene su lista, el sistema debería poder anticipar qué significa (o no significa) ese cambio de orden, sin usar la palabra "riesgo" de forma que sugiera que hay una jugada estratégica de por medio.

Fuente: [Guidelines for Human-AI Interaction — Microsoft HAX Toolkit](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/); listado completo con ejemplos: [Guidelines for Human-AI Interaction, Microsoft Design / Medium](https://medium.com/microsoft-design/guidelines-for-human-ai-interaction-9aa1535d72b9).

## 3. Google People + AI Research (PAIR) Guidebook — capítulo "Explainability + Trust"

Este capítulo es el más directamente aplicable al problema pendiente del proyecto. Su marco central es que el objetivo de una explicación no es maximizar la confianza, sino **calibrarla**: la persona debe saber cuándo confiar en el sistema y cuándo aplicar su propio juicio, ni desconfiar por completo ni sobreconfiar. Aporta cuatro conceptos operativos:

**Explicaciones parciales.** No es necesario ni conveniente explicar todo el funcionamiento del algoritmo DA en cada punto de la interfaz. Conviene explicar solo el fragmento que afecta la decisión de la familia en ese momento (p. ej., "este colegio tiene alta demanda para tu nivel de prioridad" en vez de reexplicar el algoritmo completo), dejando el detalle completo disponible por divulgación progresiva (ya implementado como patrón en el proyecto, p. ej. `PrioridadModal`).

**Explicación general del sistema vs. explicación específica del resultado.** El PAIR distingue explícitamente entre "así funciona el sistema en general" (p. ej. lo que ya cubre `/algoritmo` y `/proceso`) y "por qué este colegio en particular te muestra este número" (lo que falta reforzar en `ColegioAnalisis` y en el resumen de confirmación). Las explicaciones específicas por resultado son las que más ayudan a resolver la confusión en el punto de decisión.

**Visualización de confianza/certeza.** El PAIR advierte que los indicadores numéricos de confianza (p. ej. "93%") **presuponen que el usuario tiene una base de comprensión de probabilidad**, y recomienda probar alternativas: categorías (alta/media/baja, que el prototipo ya usa), N-mejores alternativas, o visualizaciones gráficas. También señala un riesgo puntual y verificable en el prototipo: mostrar un número exacto de probabilidad puede confundir cuando el usuario espera certeza total (p. ej. si tiene prioridad de hermano y ve "92%" en vez de "asegurado", puede interpretar que hay riesgo real donde no lo hay). Vale la pena revisar si los casos de alta certeza (PIE, continuidad del colegio de origen) deberían comunicarse como categoría cualitativa ("muy alta / prácticamente asegurada") en vez de porcentaje puntual.

**Gestionar la influencia en las decisiones del usuario — el punto más relevante para el caso San Martín.** El PAIR es explícito: mostrar confianza puede *inducir una acción no deseada* si no se diseña con cuidado, y advierte contra confianza "engañosamente alta" o displays que llevan a decisiones equivocadas. Esto es exactamente el riesgo que describe `caso_estudio_prueba_usabilidad_postulacion.md` §3.1: si la advertencia de probabilidad baja no distingue entre "riesgo real" (poca probabilidad de asignación) y "riesgo estratégico" (falsa creencia de que el orden en la lista afecta las chances), el usuario puede tomar la acción equivocada — bajar de posición el colegio que realmente prefiere.

Fuente: [Explainability + Trust — People + AI Guidebook](https://pair.withgoogle.com/guidebook-v2/chapter/explainability-trust/); listado de patrones: [People + AI Guidebook, Patterns](https://pair.withgoogle.com/guidebook-v2/patterns); resumen y contexto: [Updating the People + AI Guidebook in the age of generative AI](https://medium.com/people-ai-research/updating-the-people-ai-guidebook-in-the-age-of-generative-ai-cace6c846db4).

## 4. Hallazgo concreto en el código actual: una inconsistencia que refuerza el mito que el proyecto busca corregir

Al revisar `PostulacionPage.jsx` contra este marco, aparece una contradicción interna real, no hipotética, entre dos piezas de texto del mismo flujo:

- **Paso 2 (armar la lista), línea 960-961:** *"Consejo: ordena por tu preferencia real — El sistema está hecho para que te convenga poner primero el colegio que **más quieres**. Poner primero uno 'más fácil' no mejora tus opciones y puedes perder el que preferías."* Este texto es correcto: refleja la propiedad de prueba de estrategia (strategy-proofness) del algoritmo DA.

- **Paso 3 (confirmación), línea 1078:** en la explicación de probabilidad baja por colegio, el texto dice: *"🔴 Probabilidad baja... Considera ponerlo más abajo en tu lista o agregar colegios con menos demanda."* Esta frase **contradice directamente** el consejo del paso 2: sugiere mover un colegio de baja probabilidad hacia abajo en el orden, lo que reproduce exactamente el "falso riesgo estratégico" que `caso_estudio_prueba_usabilidad_postulacion.md` §3.1 identifica como el punto más importante a testear con el caso Muñoz González / Colegio San Martín.

Este hallazgo no depende de estudios externos que aún falten: es una inconsistencia de mensajería verificable en el código hoy, y su corrección (retirar la sugerencia de reordenar y reemplazarla por una recomendación de *agregar* colegios de respaldo, que es lo que S22 sí implementó correctamente en el paso 2) es el ajuste de mayor impacto y menor esfuerzo que surge de esta investigación. Queda señalado aquí como hallazgo de investigación; su aplicación es trabajo de código (`sae-react/`, code-agent) y no se modifica desde este documento.

## 5. Nielsen Norman Group — honestidad y transparencia sobre limitaciones (aplicable más allá de chatbots)

El artículo "Explainable AI in Chat Interfaces" (NN/g, diciembre 2025) trata sobre LLMs conversacionales, pero sus principios de diseño de explicaciones y disclaimers son transferibles a cualquier sistema algorítmico que afecte decisiones:

- **Ubicación y visibilidad:** los avisos deben estar en el área principal de atención del usuario, no en pie de página ni detrás de un ícono de ayuda — coherente con cómo S22 ya ubica el aviso de "lista corta y de alta demanda" en el flujo principal, no oculto.
- **Lenguaje claro y accionable, no genérico:** un disclaimer vago ("esto es una estimación") es menos útil que uno que dice qué hacer ("agrega al menos un colegio de demanda media o baja"). El prototipo ya sigue este patrón en el aviso de S22-14; conviene auditar que todos los textos de advertencia en `ColegioAnalisis` cumplan el mismo estándar.
- **Evitar lenguaje antropomórfico** al describir cómo "decide" el sistema — relevante para el texto del `AlgoSimuladorPasos`, que debe describir el procesamiento en términos de reglas y datos, no de "elección" del sistema.

Fuente: [Explainable AI in Chat Interfaces — NN/g](https://www.nngroup.com/articles/explainable-ai/).

## 6. Comunicación de probabilidad e incertidumbre para audiencias con baja-media alfabetización numérica

La persona objetivo del proyecto (Daniela, alfabetización digital básica-intermedia) coincide con el perfil que la literatura de comunicación de riesgo trata como prioritario. Los hallazgos son consistentes en un punto: **el formato de frecuencia (p. ej. "28 de cada 100 postulantes con tu misma condición quedaron asignados") es más comprensible que la probabilidad porcentual pura para personas con numeracidad baja**, porque coincide con cómo la gente piensa naturalmente en proporciones parte-todo, en vez de en probabilidades de un solo evento. Los arreglos icónicos (icon arrays: una cuadrícula de figuras donde algunas están resaltadas) son la técnica más recomendada en comunicación de riesgo médico y son directamente trasladables a mostrar cupos y postulantes.

Es interesante notar que el prototipo, en su explicación de probabilidad alta (línea 1075), **ya usa formato de frecuencia** ("de cada 100 postulantes con tu misma condición, aproximadamente X quedan asignados") — coherente con la evidencia. Vale la pena extender ese mismo formato de frecuencia a los tres niveles de probabilidad (alta, media, baja), no solo al primero, y considerar una versión visual simple (mini icon array o barra proporcional) en vez de solo texto, especialmente en la ficha de colegio y en `ColegioAnalisis`, donde ya existen los datos crudos (`postulantesAnterior`, vacantes por nivel) para construirlo sin inventar cifras.

Fuentes: [Using Icon Arrays to Communicate Medical Risks: Overcoming Low Numeracy (Max Planck Institute)](https://pure.mpg.de/rest/items/item_2099767_4/component/file_2562291/content); síntesis sobre diseño para baja numeracidad en visualización de incertidumbre: [Enhancing Uncertainty Communication in Time Series Predictions](https://arxiv.org/html/2408.12365).

## 7. Formularios multipaso — evidencia 2026 que respalda decisiones ya tomadas en S22

La revisión de prácticas de formularios de decisión multipaso confirma, con datos, varias decisiones que S22 ya implementó, y sugiere un ajuste pendiente:

- Indicador de progreso visible: reduce el abandono entre 20-25% en promedio en formularios de más de tres pasos. El stepper accesible del prototipo ya cumple esto.
- Guardado y reanudación explícitos ("Borrador guardado" + aviso de reanudación): confirmado como buena práctica; ya implementado en S22.
- Permitir volver a cualquier paso anterior sin perder datos: uno de los fallos más comunes de formularios multipaso es no preservar los datos hacia adelante al retroceder. Vale la pena una verificación puntual (no una auditoría completa) de que editar desde el paso 3 y volver no descarta selecciones ya hechas en el paso 2.
- Validación en tiempo real con mensajes de corrección claros: reduce frustración y abandono; aplica al RUT y a la selección de nivel.

Fuentes: [Multi-Step Form Design: Best Practices, Examples and How to Build One (2026)](https://www.weweb.io/blog/multi-step-form-design); [58 Form Design Best Practices & UX (2026)](https://ventureharbour.com/form-design-best-practices/).

## 8. Recomendaciones priorizadas

De mayor a menor impacto/esfuerzo, para discusión con el usuario antes de convertir esto en tareas de código:

1. **Corregir la inconsistencia de mensajería del §4** (paso 3, línea ~1078): eliminar "considera ponerlo más abajo en tu lista" y reemplazar por una explicación que refuerce el strategy-proofness ya explicado en el paso 2, siguiendo la guía G16 de Microsoft (comunicar consecuencias reales, no sugerir una acción basada en un mito). Es el ajuste de mayor impacto porque corrige exactamente el problema que motivó el caso de estudio Muñoz González.
2. **Diseñar la advertencia del "colegio en mente" (Colegio San Martín) distinguiendo explícitamente riesgo real de falso riesgo estratégico**, aplicando el patrón de explicación específica por resultado del PAIR (§3) y evitando confianza engañosa: mostrar el dato (demanda vs. cupos, sin prioridad familiar) como razón del porcentaje, y una frase separada y explícita del tipo "poner este colegio primero no reduce tus chances en los demás" — no implícita, no dependiente de que la familia infiera la propiedad por sí misma.
3. **Extender el formato de frecuencia (icon array o "X de cada 100") a los tres niveles de probabilidad**, no solo al de probabilidad alta, aprovechando que los datos crudos ya existen en el esquema v2 de `colegios.js` (§6).
4. **Revisar si los casos de certeza muy alta (PIE, continuidad de colegio de origen) deben mostrarse como categoría cualitativa en vez de porcentaje puntual**, siguiendo la advertencia del PAIR sobre confianza numérica engañosa cuando el resultado es, en la práctica, casi seguro (§3).
5. **Verificación puntual de preservación de datos al editar desde el paso 3** (§7) — bajo costo, cierra un riesgo de abandono conocido en la literatura de formularios multipaso.

## 9. Fuentes consultadas

- [Guidelines for Human-AI Interaction — Microsoft HAX Toolkit](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/)
- [Guidelines for Human-AI Interaction, por Mihaela Vorvoreanu, Saleema Amershi y Penny Collisson — Microsoft Design / Medium](https://medium.com/microsoft-design/guidelines-for-human-ai-interaction-9aa1535d72b9)
- [Explainability + Trust — People + AI Guidebook (Google PAIR)](https://pair.withgoogle.com/guidebook-v2/chapter/explainability-trust/)
- [People + AI Guidebook — Patterns](https://pair.withgoogle.com/guidebook-v2/patterns)
- [Updating the People + AI Guidebook in the age of generative AI — People + AI Research Blog](https://medium.com/people-ai-research/updating-the-people-ai-guidebook-in-the-age-of-generative-ai-cace6c846db4)
- [Explainable AI in Chat Interfaces — Nielsen Norman Group](https://www.nngroup.com/articles/explainable-ai/)
- [The opportunities and risks of K-12 student placement algorithms — Brookings Institution (Kasman & Valant)](https://www.brookings.edu/articles/the-opportunities-and-risks-of-k-12-student-placement-algorithms/)
- [Using Icon Arrays to Communicate Medical Risks: Overcoming Low Numeracy — Max Planck Institute](https://pure.mpg.de/rest/items/item_2099767_4/component/file_2562291/content)
- [Enhancing Uncertainty Communication in Time Series Predictions: Insights and Recommendations](https://arxiv.org/html/2408.12365)
- [Multi-Step Form Design in 2026: Best Practices, Examples and How to Build One — WeWeb](https://www.weweb.io/blog/multi-step-form-design)
- [58 Form Design Best Practices & UX (2026) — Ventureharbour](https://ventureharbour.com/form-design-best-practices/)

## 10. Relación con documentos previos del proyecto

Este documento resuelve el pendiente de `caso_estudio_prueba_usabilidad_postulacion.md` §7 ("instrucciones sobre los estudios que deben regir el diseño de las advertencias/alertas"). No reemplaza `analisis_flujo_postulacion.md` ni `investigacion_algoritmo_sae.md`; los complementa aportando el marco de diseño de interacción humano-IA que faltaba para decidir *cómo* comunicar los datos que esos documentos ya identificaron como necesarios (postulantes año anterior, vacantes, prioridades). El hallazgo del §4 (inconsistencia de mensajería en `PostulacionPage.jsx`) es nuevo y no estaba documentado en el análisis de fidelidad E1-E6 previo.
