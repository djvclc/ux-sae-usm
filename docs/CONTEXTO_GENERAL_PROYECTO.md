# Contexto general del proyecto USM — Prototipo UX del SAE + Memoria de título

**Documento de síntesis. Fecha de compilación: 2026-09-07.**
**Propósito:** dar una visión completa y autocontenida del proyecto para trabajo de investigación que pueda aportarle: qué se estudió, qué se hizo, en qué estado está y hacia dónde va. Consolida `CLAUDE.md`, `docs/CONTEXTO_CLAUDE_CODE.md`, `docs/planificacion/*` y `docs/investigacion/*` a la fecha. Ninguna cifra es inventada: todas provienen del informe heurístico Fondecyt, la revisión de literatura, el plan de mejora, el paper del algoritmo o el código (regla 3 de `CLAUDE.md`).

> Este archivo es documentación de contexto. No reemplaza a las fuentes primarias; cuando haya que citar, hágase contra ellas. Si el prototipo o la memoria cambian, este documento queda desactualizado y hay que reconciliarlo.

---

## 0. Índice

1. Panorama del proyecto
2. El problema: el SAE y su brecha de transparencia
3. Diagnóstico: la evaluación heurística Fondecyt
4. Persona objetivo, caso de estudio y principios de diseño
5. Textos y fuentes estudiadas (marco de conocimiento)
6. El prototipo: arquitectura y trabajo realizado
7. La memoria de título: estado por capítulo
8. Validación: el plan y su reorientación a estudio comparativo
9. Estado actual (septiembre 2026) — resumen ejecutivo
10. Proyecciones, trabajo pendiente y decisiones abiertas
11. Dónde puede aportar investigación nueva
12. Glosario de siglas y términos
13. Cifras clave (no inventar)
14. Mapa de archivos del repositorio

---

## 1. Panorama del proyecto

### 1.1 Los dos subproyectos

El repositorio `ux-sae-usm/` contiene **dos entregables activos** que comparten cifras y terminología y deben mantenerse sincronizados (regla más importante del repo):

| Carpeta | Contenido | Rol |
|---|---|---|
| `sae-react/` | Aplicación React funcional: prototipo de mejora UX del **Sistema de Admisión Escolar (SAE)** del Mineduc de Chile. Navegable, no es una maqueta. | Artefacto de la investigación (*research through design*). |
| `proyecto-tesis/` | Memoria de título en LaTeX: **"Mitigación de Sesgos en IA: Análisis del Sistema de Admisión Escolar en Chile"** (UTFSM, Depto. de Informática). Español, `natbib` author-year, `pdflatex` + `latexmk`. | Documento académico que fundamenta y reporta el trabajo. |
| `docs/` | Investigación y planificación que fundamentan ambos (heurística, literatura, análisis del sistema real, bitácoras, planes). | Insumo. |
| `archivo/` | Versiones superadas (prototipos HTML v1/v2, docs antiguos). **No se edita**; es historia del proyecto. | — |

**Autor:** Diego Villegas Cisternas (usuario). En la memoria y en algunos documentos aparece también como parte del equipo autor del artículo base ("Álvarez, Pérez, Villegas"). Git user: `djvclc`.

**Separación estricta:** el trabajo de código va en `sae-react/`, el de redacción en `proyecto-tesis/`. Existen agentes dedicados (`code-agent`, `writing-agent`, `bitacora-agent`) para no cruzar territorios.

### 1.2 Pregunta de investigación y objetivos

**Pregunta de investigación (Cap. 1 de la memoria):**
> ¿Es posible diseñar una interfaz de usuario que, sin alterar el algoritmo de asignación del SAE, mejore significativamente la **comprensión**, la **confianza** y la **percepción de justicia** de las familias respecto del proceso de admisión escolar, aplicando principios de transparencia algorítmica validados por la literatura científica?

**Objetivo general:** diseñar, construir y evaluar un prototipo de interfaz que mejore la transparencia y la UX del SAE, fundamentado en literatura sobre transparencia algorítmica y en un diagnóstico heurístico del sistema real.

**Objetivos específicos:**
1. Sistematizar la evidencia sobre transparencia algorítmica con evaluación de usuarios finales (qué funciona, qué no).
2. Diagnosticar, con un instrumento heurístico de calidad web, las brechas del sitio informativo y de la plataforma de postulación del SAE.
3. Diseñar un caso de estudio representativo y una persona objetivo.
4. Construir un prototipo (maqueta de alta fidelidad → aplicación web funcional) que aborde las brechas prioritarias, con énfasis en el módulo explicativo del algoritmo.
5. Evaluar el prototipo con pruebas de usabilidad con usuarios reales (claridad, confianza, utilidad percibida).
6. Discutir los resultados a la luz de la literatura y proponer recomendaciones para una eventual implementación institucional.

> **Cambio de foco propuesto (2026-08-08, `plan_cambio_foco_postulacion.md`, no ejecutado formalmente):** usar el **flujo de postulación** como caso de estudio central (es el único paso donde la familia *actúa*, no solo consulta). El objetivo general amplio se mantiene; los objetivos 4 y 5 dirían explícitamente "con énfasis en el flujo de postulación". Decisión de título/subtítulo pendiente del autor.

### 1.3 Enfoque metodológico

Metodología de **diseño aplicado (*research through design*)**: diseñar, construir y refinar el artefacto es la forma de generar conocimiento sobre el problema. Cuatro fases:

1. **Diagnóstico heurístico del SAE real** (instrumento SISIB-UChile, proyecto Fondecyt N.º 1250492).
2. **Revisión sistemática de literatura** (96 publicaciones, 2017–2025).
3. **Diseño y construcción iterativa del prototipo** (mayo–septiembre 2026, iteraciones documentadas).
4. **Plan de validación** (reevaluación heurística + prueba de usabilidad) — **en diseño, ejecución pendiente**.

Rasgo metodológico propio: el prototipo se construyó con apoyo de un **agente de IA generativa** (Claude / Claude Code) como herramienta de programación asistida, a partir de documentos de especificación redactados por el autor; cada iteración fue revisada y redirigida. La memoria documenta este uso explícitamente, en coherencia con el principio de transparencia que defiende para el SAE.

---

## 2. El problema: el SAE y su brecha de transparencia

### 2.1 Qué es el SAE

El **Sistema de Admisión Escolar** es la plataforma del Ministerio de Educación de Chile que asigna estudiantes a establecimientos con financiamiento público (municipales y particulares subvencionados). Creado por la **Ley de Inclusión Escolar N.º 20.845 (2015)**, que: (i) eliminó el copago en subvencionados; (ii) **prohibió la selección** por criterios sociales, religiosos, económicos o académicos; (iii) definió prioridades legales de asignación.

Diseñado e implementado por investigadores de Ingeniería Industrial de la Universidad de Chile (José Correa, Rafael Epstein, Juan Escobar, Ignacio Ríos). Piloto en Magallanes 2016; cobertura nacional completa en Admisión 2020. Uno de los sistemas de elección escolar más grandes del mundo: proceso 2018 → **274.990 estudiantes**, **6.421 establecimientos**, 522.859 vacantes.

### 2.2 El algoritmo de Aceptación Diferida

Usa una adaptación del mecanismo de **Aceptación Diferida (*Deferred Acceptance*, DA)** de Gale–Shapley (1962), versión *student-proposing*, extendido al problema "muchos a uno" (cada colegio recibe varios estudiantes). Opera por rondas:

1. Cada estudiante "propone" a su colegio más preferido entre los que aún no lo rechazan.
2. Cada colegio ordena a sus postulantes por prioridades legales + desempate aleatorio y **retiene tentativamente** a los mejores hasta llenar vacantes; rechaza al resto.
3. Los rechazados proponen a su siguiente preferencia; un retenido puede ser desplazado por otro de mejor prioridad (por eso "diferida": nada es definitivo hasta el final).
4. Si los postulantes a un colegio son menos que sus vacantes, la ley obliga a admitirlos a todos.

**Criterios de prioridad (grupos, orden estricto):** (1) hermano/a matriculado/a o admitido/a en el establecimiento; (2) padre/madre funcionario/a del colegio; (3) exalumno/a no expulsado/a.
**Cuotas (reservas de asientos, modeladas como "sub-escuelas" — *matching with contracts*):** (1) **PIE / NEE**: hasta 2 cupos por curso, procesada **antes** que cualquier prioridad, solo en colegios con programa validado; (2) **alta exigencia académica**: 30–85 % de cupos en colegios preseleccionados, solo 7.º básico y 1.º medio, con examen; (3) **estudiantes prioritarios**: **15 %** de cupos por nivel para el tercio de menores ingresos según el **Registro Social de Hogares**, procesada inmediatamente después de hermanos.

**Orden real de procesamiento (usado en el prototipo, E6):** PIE → hermanos → 15 % prioritarios → funcionario → exalumno.

**Reglas adicionales:** el desempate se sortea **de forma independiente en cada colegio** (regla *Multiple Tie-Breaking*, no una lotería nacional única); quien postula para cambiarse conserva garantizado su cupo actual si no mejora (variante DA\*); los no asignados tras la ronda complementaria se asignan al colegio gratuito más cercano (≤ 17 km) sin categoría Insuficiente.

**Adaptación chilena — postulación familiar:** para favorecer que hermanos queden juntos (objetivo con Mineduc; la ley excluyó deliberadamente la prioridad por cercanía por la alta segregación urbana), se procesa por grados en orden decreciente (4.º medio → prekínder), actualizando prioridades (los menores adquieren prioridad de hermano donde quedó el mayor) y con **lotería por familia**. Los autores demuestran que la asignación resultante es estable; en simulación, las postulaciones familiares totalmente exitosas suben de 52,9 % a 65,5 %.

**Propiedades teóricas:** estabilidad / ausencia de envidia justificada; no desperdicio de vacantes; **strategy-proofness** (declarar preferencias verdaderas es óptimo). Con las adaptaciones chilenas el mecanismo **no es strategy-proof en sentido estricto** (familias con varios hijos podrían en teoría manipular), pero las desviaciones rentables son muy limitadas y en mercados grandes es **esencialmente strategy-proof**.

**Por qué DA y no otro mecanismo:** frente a *Top Trading Cycles*, se eligió DA porque **comunicar y justificar los resultados es más simple** (relevante para el eje de transparencia de este proyecto). Frente al Mecanismo de Boston (aceptación inmediata), DA elimina el incentivo a la postulación estratégica.

**Resultados empíricos 2018:** 3,18 colegios postulados en promedio; **59,2 %** asignados a su 1.ª preferencia; **82,5 %** a alguna preferencia; 8,6 % mantienen su colegio actual; **8,9 %** no asignados en ronda principal; **54,7 % de los postulantes eran prioritarios** (cuota de solo 15 %).

### 2.3 La percepción de "tómbola"

El algoritmo es formalmente correcto, pero **el sistema no comunica su lógica a las familias**. Resultado: percepción extendida de arbitrariedad — el SAE es descrito coloquialmente como una **"tómbola"** —, que erosiona la confianza pública aunque los resultados sean justos según los criterios legales. Los defensores responden que el azar solo opera como último desempate tras preferencias y prioridades. Esta percepción es exactamente la que manifiesta la persona objetivo del prototipo (Daniela González) y la que el trabajo busca revertir mediante transparencia — **sin modificar el algoritmo ni la ley**, solo la capa de presentación e interacción.

### 2.4 Contexto 2026: reforma legislativa

En junio 2026 el Gobierno presentó un proyecto de ley que introduce un sistema mixto de **"elección mutua"**: colegios de alta demanda podrían aplicar criterios propios (rendimiento desde 7.º básico, asistencia, entrevistas), manteniendo reservas para prioritarios y NEE. El 5 de agosto de 2026 la Cámara lo despachó al Senado (111 a favor, 28 en contra). Académicos advierten riesgo de reinstalar discriminaciones arbitrarias. El SAE vigente sigue operando con el algoritmo descrito. La memoria trata la reforma en limitaciones / trabajo futuro; el prototipo se mantiene en el sistema vigente.

---

## 3. Diagnóstico: la evaluación heurística Fondecyt

**Fuente:** *Informe de Evaluación de Calidad Web del SAE* — Morales-Vargas et al., Universidad de Chile, proyecto **Fondecyt N.º 1250492**, marzo 2026 (`docs/investigacion/Informe Evaluación de calidad web SAE (1).pdf`; extracto en `feedback_sae_problemas.md`). Instrumento heurístico **SISIB-UChile**: ~20 dimensiones generales de calidad web + un bloque de 14 factores específicos de plataformas de selección escolar. Cada dimensión se descompone en indicadores de tres niveles (imprescindible / esperable / deseable); el puntaje es el % de indicadores cumplidos sobre aplicables, ponderado.

### 3.1 Puntajes baseline

| Componente | Imprescindible | Esperable | Deseable | **Total** |
|---|---|---|---|---|
| Sitio informativo (`sistemadeadmisionescolar.cl`) | 55 % | 57 % | 22 % | **51 %** |
| Plataforma de postulación (`admision.mineduc.cl`) | 55 % | 57 % | 22 % | **61 %** |

### 3.2 Brechas más críticas

- **Transparencia y apertura: 0 %** en el sitio informativo — no existe ninguna sección que explique el algoritmo, sus criterios ni sus resultados agregados.
- **Inclusión: 0 %** — sin opciones para NEE ni lenguaje simplificado en el sitio informativo; sin multiidioma (creole, inglés, mapudungun).
- **Búsqueda y encontrabilidad** — sin buscador interno ni mapa del sitio.
- **Audiovisualidad** — ausencia total de videotutoriales o infografías.
- **Interoperabilidad** — la contraseña de apoderado se crea aparte, sin integrar ClaveÚnica, que ya tiene los datos del registro.
- **Legibilidad** — sitio informativo con índice **Spaulding 120,43** ("difícil"); plataforma con Spaulding 95,26 ("moderadamente difícil"). Objetivo: nivel 6.º básico.
- **Contraste** — gris `#c7c8c7` sobre blanco = ratio **1,68:1** (falla A, AA y AAA).
- **Accesibilidad** — secciones no navegables por teclado; PDF del proceso reprueba MAUVE++ (5/6); galería de colegios sin `alt`; paginación no accesible.
- **Rendimiento** — portada de la plataforma **pesa 7,7 MB**; PageSpeed móvil **14 %**; carga > 7 s en gama baja; la plataforma **colapsó** el primer día de postulación 2025 (captchas excesivos, redirecciones, validaciones incorrectas).
- **Seguridad** — plataforma con calificación **F** en cabeceras HTTP; sin redirección HTTP→HTTPS.
- **Enfoque de género** — textos solo en masculino ("el apoderado", "el postulante").
- **Prevención de errores** — mensajes de error sin solución; campo RUT sin validación; no se explica qué pasa al eliminar la postulación.

### 3.3 Revisión del estado actual del sitio oficial (resultado propio de la memoria)

Revisión no sistemática (julio 2026) para ver si el Mineduc cerró brechas por su cuenta desde marzo 2026:

- **Búsqueda:** mejoró — hay "Vitrina de Establecimientos" con filtros y vistas lista/mapa. ✅ parcial
- **Inclusión:** avanzó parcialmente — la vitrina indica si un colegio tiene PIE con un ícono. ✅ parcial
- **Transparencia del algoritmo:** solo incremental — FAQ que describen los 4 criterios y desmienten mitos, pero **explicación genérica, no contextualizada, sin simulador**. ❌
- **Interoperabilidad con ClaveÚnica:** no resuelta — sigue requiriendo cuenta separada. ❌
- **Audiovisualidad:** no resuelta — sin videos ni infografías embebidas. ❌

**Conclusión:** de las 6 brechas prioritarias, el sitio oficial cerró parcialmente 2 (búsqueda, inclusión) y no resolvió 4. El problema de investigación sigue vigente.

---

## 4. Persona objetivo, caso de estudio y principios de diseño

### 4.1 Persona objetivo: Daniela González

35 años, Región Metropolitana / Valparaíso. Educación media completa, **alfabetización digital básica-intermedia**. Acceso a internet **principalmente por teléfono móvil**. Apoderada de **más de un hijo/a** en edad de postular. Valora seguridad, cercanía y prestigio del establecimiento. **Percibe el SAE como "tómbola"** y necesita que le expliquen las reglas antes de postular. Usa WhatsApp, Facebook, Instagram; no usa Twitter ni YouTube.

**Implicancias de diseño:** mobile-first con **375 px** como referencia primaria; nivel de lectura **6.º básico**; sin jerga técnica; frases ≤ 20 palabras; explicaciones del algoritmo **concretas y personalizadas al caso** del usuario.

### 4.2 Caso de estudio: familia ficticia Muñoz González

Diseñado para que en una sola familia se activen los tres grupos de prioridad legal, cada uno en un colegio distinto, y para que exista un **"colegio en mente"** sin ninguna ventaja algorítmica.

- **Apoderada:** Daniela González, 35 años.
- **Padre:** Rodrigo Muñoz — asistente de aula en **Colegio Villa del Sol** (Peñalolén) → prioridad **funcionario/a** ahí.
- **Madre:** exalumna de **Escuela República de Chile** (La Florida) → prioridad **exalumno/a** ahí.
- **Hija mayor (no postula):** Martina, 15, matriculada en **Colegio Los Andes** (La Florida) → prioridad **hermano/a** para los menores si postulan ahí.
- **Postulan en bloque (Admisión 2027):** **Sofía**, 9 años, postula a **4.º básico** (su colegio de origen es Escuela Básica Los Quillayes; conserva continuidad si no queda en otro) — es la estudiante que el/la participante completa en el flujo; **Mateo**, 12, postula a 7.º básico — su postulación "va aparte" y no se completa en la sesión.
- **Condiciones transversales:** **ninguna** (revisión Bloque O, 2026-09-03). La familia **ya no** es SEP ni PIE. Antes lo era, pero con SEP activa el colegio N.º 1 quedaba asignado **siempre** y el caso perdía tensión; además tratar la cuota SEP como rango casi seguro es incorrecto en el mecanismo (es una reserva del 15 % sobre-suscrita).
- **El colegio en mente:** **Colegio San Martín** (Maipú) — se lo recomendó una vecina, les gustó el proyecto educativo, **sin ningún vínculo** y **demanda alta**. Probabilidad estimada ≈ **26 %** (vs. ≈ 99 % en Los Andes por el hermano). Es el punto de observación central del caso.

**Lista y orden de postulación (fijo, para el estudio comparativo):**

| Orden | Colegio | Comuna | Demanda | Vínculo | prob. estimada |
|---|---|---|---|---|---|
| 1 | **Colegio San Martín** | Maipú | Alta | Ninguno (el "colegio en mente") | **≈ 26 %** — probable que NO quede |
| 2 | **Colegio Los Andes** | La Florida | Alta | Hermano/a | ≈ 99 % — casi seguro |
| 3 | Escuela República de Chile | La Florida | Baja | Exalumno/a | ≈ 99 % (colegio no sobredemandado) |
| 4 | Colegio Villa del Sol | Peñalolén | Alta | Funcionario/a | ≈ 99 % |
| 5 | Liceo Técnico Simón Bolívar | Puente Alto | Media | Sin vínculo; fuera de la comuna (E1) | ≈ 50 % — moneda al aire |
| 6 | Escuela Básica Los Quillayes | La Florida | Media | Colegio de origen (continuidad no modelada como prioridad) | ≈ 46 % — moneda al aire |

**Resultado canónico (verificado contra el código, `SEED_CASO = 20260903`, 4.º básico, sin SEP):**
San Martín 1.º → el sorteo **no** la sienta (26 %) → cae a **Colegio Los Andes**, **2.ª preferencia**, por el vínculo de hermano/a (99 %). `sinAsignacionEnPreferencias: false`. Todos los participantes, en ambas condiciones del estudio, terminan asignados a Los Andes en su 2.ª preferencia.

**Distinción central del caso (§3.1 del caso de estudio):**
1. **Riesgo real (probabilidad):** San Martín tiene ~71 postulantes vs. 24–28 vacantes y ninguna prioridad → ≈ 26 %. Se muestra con su fundamento visible (postulantes año anterior, vacantes), no como cifra aislada.
2. **Falso riesgo estratégico (mito a corregir):** el DA es esencialmente a prueba de estrategia — poner primero el colegio realmente preferido **nunca** perjudica. Con lista fija, esto se observa por preguntas abiertas, no por dónde ubica la persona el colegio.
3. **Consejo complementario:** agregar colegios de mayor probabilidad más abajo como respaldo, **no** como reemplazo del colegio soñado.

### 4.3 Principios de diseño (respaldados por literatura; ver `NotasPage.jsx`)

- **Divulgación progresiva** (Springer & Whittaker): mostrar primero lo esencial; el detalle técnico solo si se solicita.
- **Explicabilidad contextualizada** (Nefedov): explicaciones ligadas al caso del usuario > descripciones abstractas del sistema.
- **Controles interactivos con retroalimentación** (Kim; Feddersen): simuladores, comparadores, ajustes con feedback inmediato aumentan la agencia y reducen la percepción de arbitrariedad.
- **Presentación multidimensional** (Glazerman): combinar gráficos con cifras > un único indicador agregado.
- **Gestión de expectativas** (Brookings): comunicar **qué NO puede hacer** el sistema (no crea cupos, no garantiza la 1.ª preferencia); dirigir la frustración a la escasez de cupos, no al algoritmo.

**UI:** español chileno con tuteo; lenguaje claro nivel 6.º básico; mobile-first 375 px; contraste WCAG AA mínimo (AAA aplicado); lenguaje inclusivo ("el/la apoderado/a", "la o el estudiante"); siglas con `<abbr title="…">`. Paleta institucional Mineduc: azul `#0057B7`, azul claro `#E8F1FB`, verde `#1A7F37`, naranja `#E07B00`, rojo `#C0392B`, gris texto `#333333`, gris medio `#374151` (8,3:1 sobre blanco).

---

## 5. Textos y fuentes estudiadas (marco de conocimiento)

### 5.1 Revisión sistemática de literatura — 96 publicaciones (2017–2025)

**Archivos:** `docs/investigacion/EXECUTIVE_SUMMARY.md`, `algorithm_transparency_literature_review (1).md`, `algorithm_transparency_supplementary_analysis.md`. Fecha de la revisión: noviembre 2025. Bases: SciSpace (semántica), SciSpace texto completo, Google Scholar (booleana), ArXiv (CS/HCI). Resultados fusionados, deduplicados y reordenados por relevancia. Criterio de inclusión: estudios que **implementen** un mecanismo de transparencia **y** lo **evalúen con usuarios reales** (se descartan propuestas puramente teóricas).

**Qué funciona (convergencia consistente):**
- Divulgación progresiva (transparencia por etapas).
- Explicabilidad contextualizada (explicaciones **locales** > globales).
- Controles interactivos con retroalimentación.
- Presentación multidimensional (gráficos + cifras).
- Reportes y explicaciones **co-diseñadas** con usuarios no expertos.

**Qué no funciona / es contraproducente:**
- **Transparencia técnica sin filtro** (código, ecuaciones, internals) → reduce la confianza en usuarios no técnicos.
- Exceso de información en una sola pantalla → parálisis decisional.
- Explicaciones globales ("así funciona para todos") < explicaciones locales ("así funcionó en tu caso").
- **Control de grano fino** para usuarios sin entrenamiento → ajustes peores que el sistema automático.
- Distintos métodos técnicos de explicación producen comprensión humana similar → la evaluación debe centrarse en el **ajuste a la tarea**, no en la novedad del método.

**La "paradoja de la transparencia":** la transparencia puede mejorar comprensión y confianza y **al mismo tiempo** exponer errores que reducen la aceptación. Hay que **diseñarla y escalonarla**, no maximizarla.

**Dominios cubiertos:** sistemas de recomendación, redes sociales, vehículos inteligentes, salud / apoyo a decisión médica, administración pública (visados, fraude en beneficios), sistemas de pronóstico, personalización de noticias, resumen de video. Tamaños de muestra: 39–432.

**Autores/grupos influyentes:** Aaron Springer & Steve Whittaker (divulgación progresiva); Joy Lu et al. (marco de "buena explicación"); Julia Graefe et al. (vehículos, XAI centrado en humano); Szymon Bobek et al. (evaluación integral de XAI); Nefedov (accesibilidad vs. explicabilidad en administración pública).

**Relevancia para el SAE:** usuarios mayoritariamente con alfabetización digital baja-media; decisión de alto impacto emocional (la educación de un hijo/a); algoritmo con aspectos contraintuitivos (la posición en la lista no garantiza asignación). El diseño orientado a transparencia es requisito funcional, no cosmético.

**Nota sobre la bibliografía (Bloque B de `referencias.bib`):** varias claves de esta revisión tienen autor y año pero **título/venue no verificados** (síntesis automatizada). *Hay que verificarlos contra la fuente original antes de la entrega final de la tesis.*

### 5.2 Investigación del algoritmo SAE

**Archivo:** `docs/investigacion/investigacion_algoritmo_sae.md` (2026-07-30). Fuente primaria: Correa, Epstein, Escobar, Ríos et al., *School Choice in Chile* (paper de los diseñadores, publicado en *Operations Research*). Contenido resumido en la §2 de este documento. Aporta: mecánica del DA por rondas; orden real de prioridades y cuotas (PIE → hermanos → 15 % → funcionario → exalumno); la **cuota SEP como sub-escuela sobre-suscrita** (54,7 % de postulantes / 15 % de cupos en 2018); desempate independiente por colegio; strategy-proofness y sus límites con familias múltiples; cifras 2018; el debate público de la "tómbola" y la reforma 2026. Ancla clave para justificar por qué el prototipo modela la SEP como cuota y no como rango, y de dónde salen los parámetros de población del simulador (`pSep = 0.55` anclado a 2018).

### 5.3 Guías de UX para sistemas de IA

**Archivo:** `docs/investigacion/investigacion_ux_guide_ai_systems.md` (2026-08-13). Resuelve el pendiente sobre qué estudios deben regir el diseño de advertencias/alertas. Es el **marco de referencia de la bitácora del flujo de postulación** (siglas HAX / PAIR-ET / NNG-XAI / BROOK / RISK-NUM / FORM-MS).

| Sigla | Fuente | Aportes usados |
|---|---|---|
| **HAX G1…G18** | Microsoft *Guidelines for Human-AI Interaction* (HAX Toolkit, CHI 2019; 18 guías, 4 momentos) | G1 (qué puede/no puede hacer el sistema, antes de pedir datos), G2 (qué tan bien: la cifra es *estimación* + su fundamento), G4 (info contextual en el punto de decisión), G5/G6 (normas sociales / mitigar sesgos — que ningún aviso juzgue a la familia), G10/G11 (delimitar ante duda; por qué el sistema hizo lo que hizo, razón **real**), G16 (comunicar las consecuencias de las acciones del usuario). |
| **PAIR-ET** | Google *People + AI Guidebook*, cap. "Explainability + Trust" | Calibrar la confianza, **no maximizarla**; explicaciones **parciales**; explicación general del sistema vs. **específica del resultado**; visualizar certeza (el número presupone alfabetización probabilística — probar categorías, N-mejores, gráficos); gestionar la influencia en las decisiones (confianza engañosa induce acciones no deseadas — núcleo del caso San Martín). |
| **NNG-XAI** | Nielsen Norman Group, "Explainable AI in Chat Interfaces" (dic. 2025) | Avisos en el área principal de atención (no en pie ni tras ícono); lenguaje **accionable**, no genérico ("agrega un colegio de demanda media" > "esto es una estimación"); **evitar lenguaje antropomórfico** al describir cómo "decide" el sistema. |
| **BROOK** | Brookings — Kasman & Valant, "The opportunities and risks of K-12 student placement algorithms" (2019) | Comunicar **qué NO puede hacer** el sistema; el mayor riesgo es de **percepción**, no técnico; **videos animados** para explicar el algoritmo. |
| **RISK-NUM** | Comunicación de riesgo / numeracidad. **Fuentes separadas tras la revisión del 2026-09-08** (ver §5.10): **Galesic et al. 2009** (icon arrays, baja numeracidad — médico); **Visschers et al. 2009** + revisión PMC11067312 (formato de frecuencia, efecto dependiente del contexto); **Karagappa et al. 2024 / arXiv:2408.12365** es sobre *visualización de incertidumbre en series temporales* — complementaria, **NO** la fuente de icon arrays (se citaba mal). | **Formato de frecuencia** ("X de cada 100") *puede* facilitar la interpretación (no "siempre mejor que %"); **icon arrays** / barras = decisión fundamentada, eficacia en el SAE = hipótesis a validar. |
| **FORM-MS** | Trámites multipaso. **Fuente preferida (revisión 2026-09-08): GOV.UK Design System** (question pages / check answers / confirmation pages / validation; con investigación de usuarios). WeWeb / Venture Harbour = secundarias. | Indicador de progreso; volver a cualquier paso sin perder datos; validación en tiempo real. **La cifra "−20–25 % abandono" no tiene fuente primaria — retirada, no citar.** |

**Hallazgo propio del documento (§4):** contradicción interna en `PostulacionPage.jsx` — el paso 2 decía "ordena por tu preferencia real" (correcto, strategy-proofness) y el paso 3 sugería "considera ponerlo más abajo en tu lista" ante probabilidad baja (reproduce el mito del riesgo estratégico). Corregido el mismo día (`S22-14 (refinamiento)`).

### 5.10 Revisión bibliográfica de las guías (verificación de fuentes)

**Archivo:** `docs/investigacion/investigacion_guias_ux_transparencia_sae.md` (2026-09-08; generado externamente, **no editar**). Revisa críticamente el marco de 6 guías: qué afirma cada fuente, qué tipo de evidencia entrega, y qué tan legítimo es trasladarla al SAE. Propone una **jerarquía de evidencia** (peer-reviewed > guías profesionales > análisis de política > blogs) y correcciones, de las cuales dos se verificaron contra las fuentes primarias y ya se aplicaron en `investigacion_ux_guide_ai_systems.md` y en la bitácora §2:
- **arXiv:2408.12365** = Karagappa et al. 2024, *series temporales* — se citaba como "síntesis sobre baja numeracidad". **Corregido**: icon arrays → Galesic et al. 2009; frecuencias → Visschers et al. 2009 + revisión PMC11067312.
- **"−20–25 % abandono" (FORM-MS):** sin fuente primaria (blogs). **Retirada** de la documentación; no citar en la memoria. GOV.UK Design System pasa a ser la fuente preferida para un trámite público.

**Dos fuentes nuevas, específicas de Chile, que la revisión recomienda incorporar (pendiente de decisión del autor / writing-agent — tocan `referencias.bib`):**
- **Correa, Epstein, Escobar, Ríos et al. (2022), *School Choice in Chile*, *Operations Research* 70(2), 1066–1087** (DOI 10.1287/opre.2021.2184). Ya es la fuente primaria de `investigacion_algoritmo_sae.md`, pero **no está en `referencias.bib`** como entrada formal (solo `epstein2017mecanismos`). Argumento clave: los diseñadores eligieron DA sobre TTC en parte **porque comunicar el resultado a familias disconformes era más simple** — la comunicabilidad fue criterio explícito de diseño del mecanismo, no una capa UX añadida después.
- **Arteaga, Kapor, Neilson & Zimmerman (2022), *Smart Matching Platforms and Heterogeneous Beliefs in Centralized School Choice*, *Quarterly Journal of Economics* 137(3), 1791–1848** (DOI 10.1093/qje/qjac013). **Verificado.** Evidencia empírica **directamente sobre el SAE chileno** (encuesta a ~48.929 familias del proceso 2020 + intervención de aviso personalizado de riesgo): las familias **sobreestiman** sus posibilidades (subjetiva ≈76 % vs. objetiva ≈44 %); el 35 % deja de agregar colegios "porque cree que quedará en alguno de la lista"; el aviso personalizado de riesgo hizo que ~21,6 % de los tratados **agregaran** colegios (≈+1,6 en promedio, mayormente **abajo** en la lista, −15,5 pp de riesgo de no-asignación); la información **personalizada** de riesgo supera con creces a los *nudges* genéricos de "agrega más colegios". Valida directamente `ColegioAnalisis`, el aviso de lista corta (S22-14) y la estrategia "preferencia real primero + respaldos abajo". *Los números exactos deben verificarse contra el PDF antes de citarlos.*

### 5.4 Investigación de la vitrina oficial

**Archivo:** `docs/investigacion/investigacion_vitrina_sae.md` (2026-07-30). Recorrido en vivo de la Vitrina de Establecimientos oficial (`admision.mineduc.cl/vitrina-vue`, Admisión 2027, v2.5.1). Inventario de la ficha de colegio real y feedback para `InicioPage`/`ColegioPage`.

**Adoptar de la vitrina:** postulantes del año anterior por nivel; vacantes como **rango** con nota de estimación; jornada por nivel; categoría de desempeño de la Agencia con escala visual de 4 niveles; comparación SIMCE contra colegios del **mismo grupo socioeconómico** (no comunal); pago por nivel; identidad institucional (RBD, director, dependencia, orientación); descargables (PEI, reglamento) + nota de procedencia de datos; explicar íconos en el punto de uso.
**Debilidades de la vitrina (que el prototipo evita):** embudo rígido región→comuna→nivel; acordeones mutuamente excluyentes; ordenamiento pobre (solo alumnos/curso y matriculados); comparaciones crípticas; mezcla silenciosa de años; mapa sin distancia; **desacoplada de la postulación** (no hay "guardar" ni "agregar a mi lista"); **sin explicación del algoritmo ni de probabilidades** — entrega el insumo (postulantes vs. vacantes) pero no lo interpreta.

Este documento originó el **esquema v2 de `colegios.js`** (vacantes como array con rango min/max + `postulantesAnterior` + jornada + copago por nivel; campos `rbd`, `director`, `dependencia`, `orientacion`, `categoriaDesempeno`, `gseComparacion`, etc.).

### 5.5 Investigación del "Paso a paso" oficial

**Archivo:** `docs/investigacion/investigacion_paso_a_paso_sae.md` (2026-08-04). Recorrido de las 5 páginas del menú "Paso a paso" del sitio informativo (`sistemadeadmisionescolar.cl`, v2.4.61).

**Las 5 etapas:** Postulación (Periodo Principal) → Asignación (interna) → Resultados → Periodo Complementario → Matrícula (presencial).
**Reglas de alto riesgo enterradas en párrafos del sitio real:** aceptado **por omisión** si no se ingresa; **rechazar deja sin colegio y libera el cupo de origen**; lista de espera solo hacia preferencias **superiores** a la asignada; **si no te matriculas pierdes el cupo**; **no contactar al colegio antes de diciembre**.
**Calendario Admisión 2027 (verificado 2026-08-04):** registro anticipado desde 15 jul 2026; **Postulación Periodo Principal 4 ago (9:00) – 27 ago (14:00) 2026**; **Resultados 15–21 oct 2026**; resultados listas de espera 28–29 oct; Periodo Complementario 10–17 nov; resultados complementario 1 dic; **matrícula presencial 9–22 dic 2026** (hasta el 29 en Aysén y Magallanes). El sitio oficial publica el calendario **solo como imagen** (`fechas.png`), sin texto accesible.

Este documento originó la vista **`/proceso`** (S21).

### 5.6 Análisis de fidelidad del flujo de postulación

**Archivo:** `docs/investigacion/analisis_flujo_postulacion.md` (2026-08-04). Auditoría de `PostulacionPage.jsx` contra las reglas oficiales + benchmark (plataforma oficial, **NYC MySchools**, buenas prácticas de formularios multipaso) + plan en 3 fases con prompt de implementación. Origen de los códigos `S22-1…S22-15`.

**6 errores factuales del prototipo previo (E1–E6), corregidos en S22:**

| # | El prototipo decía | La regla oficial |
|---|---|---|
| E1 | "Solo puedes postular a colegios de tu región" | Se puede postular a otras comunas y regiones |
| E2 | Límite de 8 colegios (tope duro) | **No existe límite**; recomendación de **al menos 6** |
| E3 | "…antes del 30 de agosto" | Cierre **27 de agosto, 14:00** |
| E4 | "5 días hábiles para aceptar/rechazar" | Rango real de Resultados: **15–21 de octubre de 2026** |
| E5 | "Sorteo certificado por el MINEDUC" | Desempate aleatorio **por colegio** (lotería independiente); "certificación" no documentada |
| E6 | Prioridades numeradas 1–4 como ranking | Orden real: PIE → hermanos → 15 % → funcionario → exalumno; el 15 % es **reserva de asientos** |

**De NYC MySchools se adoptó:** drag-and-drop del ranking; info de contexto en el punto de decisión (postulantes por cupo del año anterior); sin límite de opciones; WCAG 2.1 AA+.

### 5.7 Análisis del video oficial del MINEDUC

**Archivo:** `docs/investigacion/analisis_video_paso_a_paso_sae.md` (2026-08-27). Transcripción del video oficial "Paso a paso de Sistema de Admisión Escolar 2025" (canal @mineducchile, ~6:33). **Inventario estructural** del flujo real (pantallas, campos, aceptaciones obligatorias) usado como **checklist de fidelidad**. Tabla de brechas **A–I**:

| # | En el flujo real | Estado en el prototipo | Clasificación |
|---|---|---|---|
| **A** | Casilla "declaro ser apoderado del postulante" antes de "agregar postulante" | Implementada (Bloque L) | Indispensable |
| **B** | Dirección de residencia del estudiante: región + comuna + calle | Implementada en versión **acotada** (se captura, **no** entra en la asignación — Bloque M) | Indispensable |
| **C** | Al agregar un colegio: aceptar jornada + adhesión al PEI y al reglamento interno | Implementada (modal, Bloque L) | Indispensable |
| **D** | Aviso "si quedas asignado pierdes tu cupo actual, aceptes o rechaces" + obligación de postular sin continuidad | Implementada (InfoBox de alerta, Bloque L) | Indispensable |
| **E** | Al modificar: reenviar la postulación y descargar comprobante actualizado | **Parcial** — aviso de texto (Bloque M); falta la invalidación efectiva del comprobante (fase 2) | Deseable-alto |
| **F** | Obligación de postular sin continuidad de nivel | Parcial (párrafo de D) | Deseable |
| **G** | IPA como alternativa al RUT en el login | Pendiente (fase 2, R6) | Deseable menor |
| **H** | Vista mapa de establecimientos | **Fuera de alcance** (mobile-first, 6 colegios) | — |
| **I** | Filtros: jornada, género, internado, técnico-profesional, dependencia, continuidad | Pendiente (fase 2, R3) | Deseable |

### 5.8 Documento de apoyo: comparativa "casi final"

**Archivo:** `docs/planificacion/comparativa_flujo_postulacion_v_final.md` (2026-09-01). Consolida el video + 14 capturas de una versión anterior de la plataforma (`postulaciones2019`) + informe heurístico en un inventario **input por input** del flujo del prototipo vs. el SAE oficial. Encuadre: **"capa de transparencia, no clon"** — la familia entrega los mismos datos que pide la plataforma oficial, y encima el prototipo agrega lo que el SAE no da (probabilidad por colegio, explicación antes de pedir datos, orientación estratégica honesta, resultado explicado). Contiene el **roadmap fase 2 (R1–R6)** para el Cap. 6.

### 5.9 Bibliografía formal de la memoria

`proyecto-tesis/bibliografia/referencias.bib`, dos bloques:
- **Bloque A (verificado):** diseño ético UX (KeepCoding, Checkealos), transparencia de IA (IBM), sesgos algorítmicos (UNIR, Skillnest, casos COMPAS y BOSCO), marcos regulatorios (**NIST AI RMF 1.0**, **ISO/IEC 42001:2023**, OCDE), Gale-Shapley (1962), Epstein "Mecanismos de admisión escolar en Chile" (2017), Morales-Vargas et al. 2026 (informe Fondecyt), WCAG.
- **Bloque B (verificar antes de la entrega):** claves de la revisión de 96 papers (Springer & Whittaker, Lu, Nefedov, Kim, Feddersen, Glazerman, Graefe, Peng, Bobek, Dawoud, Inel, Shin) — **títulos descriptivos, no citas literales; venue no verificado**.

---

## 6. El prototipo: arquitectura y trabajo realizado

### 6.1 Stack y estructura

- **React 19** + **React Router DOM 7** + **Vite 8** + **Tailwind CSS v4** (config en `index.css` con `@theme`, no `tailwind.config.js`) + shadcn/ui (Base UI, no Radix) + Chart.js + lucide-react. JavaScript/JSX, **sin TypeScript**. Objetivo de bundle liviano (< 500 KB); `React.lazy` en 13 rutas.
- **Convenciones:** español en UI, inglés en nombres de código (con clases CSS BEM en español descriptivo); ARIA en todo elemento interactivo; `localStorage` para postulación confirmada, perfil y preferencia de tamaño de texto (cargas iniciales con inicializadores perezosos de `useState`).

**Rutas (`App.jsx`):**

| Ruta | Página | Rol |
|---|---|---|
| `/` | `InicioPage` | Hero + buscador con autocompletado + cards + orden por SIMCE/vacantes/distancia/demanda |
| `/algoritmo` | `AlgoritmoPage` | 4 pasos + simulador interactivo + `AlgoSimuladorPasos` (reproducción paso a paso) + mitos frecuentes + estadísticas históricas (Chart.js) + videos placeholder |
| `/proceso` | `ProcesoPage` | 5 etapas del proceso, estado por fecha, reglas de alto riesgo, calendario 2027 accesible, tabla Principal vs. Complementario, checklist de matrícula |
| `/calendario` | `CalendarioPage` | Línea de tiempo del proceso |
| `/colegio` | `ColegioPage` | Ficha ampliada (esquema v2): identidad institucional, vacantes por nivel, categoría de desempeño, SIMCE vs. GSE, `ProbabilidadVisual` "si postulas sin ninguna prioridad" |
| `/comparador` | `ComparadorPage` | Comparar 2–3 colegios (tabla desktop / cards móvil) |
| `/postulacion` | `PostulacionPage` | Flujo de 3 pasos con ClaveÚnica simulada — **la pieza central** |
| `/seguimiento` | `SeguimientoPage` | Estado de la postulación + resultado + explicación contextualizada + aceptar/rechazar + comprobante |
| `/perfil` | `PerfilPage` | **Fuente única** de datos a nivel estudiante (nombre, RUT, nivel, `prioritario` SEP, `pie`) |
| `/registro` | `RegistroPage` | Crear cuenta (RUN, fecha nac., correo, teléfono, contraseña, 2 casillas de aceptación) |
| `/cumplimiento`, `/roadmap`, `/notas` | páginas internas | Matriz de cumplimiento del plan; roadmap; trazabilidad diseño↔literatura. **No enlazadas en Navbar.** |
| `*` | `NotFoundPage` | 404 personalizado |

**Componentes transversales:** `Navbar`, `Footer` (canales SAE + OIRS), `ChatAyuda` (FAQ flotante), `GuidedTour` + `TourContext`, `SchoolIllustration` (SVG por nombre, reemplaza fotos), `ScrollToTop`, `TextSizeBar` + `TextSizeContext` (Normal/Grande), `ProbabilidadVisual` (barra / icon array 10×10), `ErrorBoundary`.

### 6.2 Evolución iterativa (cronología, `03_metodologia.tex` Tabla 3.1)

| Fecha | Hito |
|---|---|
| Mayo sem. 1 | `CLAUDE.md` + **Iteración 1**: prototipo HTML autocontenido de una página (`prototipo_SAE_mejora.html`) — 5 secciones mínimas del diagnóstico. |
| Mayo sem. 2 | `CLAUDE_v2.md` + docs de investigación. **Iteración 2**: `prototipo_SAE_v2.html` — comparador, calendario, simulación más cercana al DA. |
| Mayo sem. 3 | **Migración a React + Vite**; el contenido textual se extrae programáticamente. |
| Mayo sem. 4 | shadcn/ui; se reconstruyen algoritmo, inicio, postulación, seguimiento sobre React. |
| Junio sem. 3 | `feedback_sae_problemas.md` + `plan_mejora_sae.md` (matriz de ~62 puntos). Se archivan los HTML. |
| Junio sem. 4 | `CONTEXTO_CLAUDE_CODE.md`; **Comparador de colegios**. |
| Julio (12/07) | Tour guiado de *onboarding*; reescritura del flujo de postulación (validación RUT, análisis de probabilidad por colegio). |
| Julio posterior | `NotasPage.jsx` (trazabilidad diseño↔6 principios de literatura); se cierra 15.2 (estadísticas históricas con Chart.js). |
| Julio sem. 5 | Refactor de la vitrina: **esquema v2 de `colegios.js`**; ficha enriquecida. |
| Agosto sem. 1 | Vista **`/proceso`** (S21) → matriz de 20 a **21 categorías, 62→72 puntos**. |
| Agosto sem. 1 | **Rediseño del flujo de postulación (S22)** — E1–E6, comprobante descargable, drag-and-drop accesible, borrador visible, postulación en bloque, orientación estratégica → **22 categorías, 87 puntos**. |
| Agosto sem. 2 | Refinamiento de mensajería del paso 3 por las guías UX-IA; paso de resultado inmediato para la prueba. |
| Agosto sem. 3 | Comunicación visual de probabilidad (`ProbabilidadVisual`) + encuadre HAX G1 antes de pedir datos; auditoría de lenguaje (anti-juicio, accionable, no antropomórfico). |
| Agosto sem. 3 | **Unificación del modelo de datos del estudiante** (`/perfil` fuente única; SEP como dato del Estado, de solo lectura). |
| Agosto sem. 4 – septiembre | Análisis del video oficial → brechas A/C/D + B acotado + aceptaciones de registro + aviso de reenvío. |
| Septiembre | **Reescritura del simulador** (Monte Carlo DA-por-colegio); suite de tests; el caso deja de ser SEP/PIE; reorientación de la validación a estudio comparativo; paso 1 en modo verificación. |

### 6.3 Matriz de trazabilidad (22 categorías; conteo corregido el 2026-09-08)

`docs/planificacion/plan_mejora_sae.md` — matriz de **22 categorías**. Cada punto vincula un problema del diagnóstico con la decisión de diseño y su estado.

- **Categorías 1–20:** derivadas de las 20 dimensiones del informe heurístico (contenido y lenguaje claro; usabilidad; accesibilidad; arquitectura de información; búsqueda; responsividad móvil; diseño e imagen; seguridad; tecnología; atención a la ciudadanía; audiovisualidad; enfoque de género; inclusión; promoción/SEO; **transparencia del algoritmo**; facilidad de acceso; interoperabilidad ClaveÚnica; rapidez; prevención de errores; interacción y retroalimentación).
- **Categoría 21 (S21):** vista "Proceso paso a paso" (10 puntos).
- **Categoría 22 (S22):** rediseño del flujo de postulación (15 puntos, incisos 22-1 … 22-15).

> **Corrección de integridad (2026-09-08 — auditoría independiente, ver §11).** La cifra que este documento y la memoria citaban, **"87/87 puntos aplicables (100 %)"**, **no era reproducible** desde la matriz: sus tablas tienen **102 filas numeradas** (77 en S1–S20, 10 en S21, 15 en S22); el histórico "62" para S1–S20 nunca cuadró con las 77 visibles y no existe una tabla de consolidación que llegue a 87; y varias filas ya estaban marcadas ⚠️ Parcial o ❌ (5.2, 5.3, 8.2, 14.2, 14.3, 10.1). **4 filas no aplican** al prototipo local — **4.3** (panel "Programas" inexistente), **8.1** (redirección HTTP→HTTPS), **8.2** (cabeceras HTTP de seguridad), **9.3** (redirección del dominio `www`) — → **98 requisitos aplicables**. Cifra reproducible: **98 aplicables, abordados a nivel de código**; el estado por fila está en las tablas de cada sección del plan. **No se cita un porcentaje agregado de cumplimiento** hasta re-tabular fila por fila con criterio de veredicto explícito y, de preferencia, un segundo evaluador. La memoria (caps. 00/03/04/06) ya sustituye "el 100 % / 87 de 87" por "la totalidad de los puntos aplicables… a nivel de código".

> **Naturaleza de la cifra:** es una **autoevaluación de implementación de código**, verificable revisando el prototipo. **No** es evidencia de que el prototipo mejore comprensión, confianza o percepción de justicia de usuarios reales — eso es lo que la validación pendiente debe responder. La memoria insiste en esta distinción en los caps. 3, 4 y 6.

### 6.4 S21 — vista `/proceso`

`ProcesoPage.jsx`: línea de tiempo vertical mobile-first de 5 etapas con estado calculado por fecha (completada/activa/futura); divulgación progresiva (resumen de una línea + detalle expandible); **5 reglas de alto riesgo como avisos siempre visibles**; tabla comparativa Periodo Principal vs. Complementario; checklist de documentos de matrícula ("no pueden negarte la matrícula por documentación complementaria"); **calendario Admisión 2027 como tabla HTML accesible** (corrige el hallazgo de accesibilidad del original, que lo publica como imagen). Enlace en Navbar y paso de tour.

### 6.5 S22 — rediseño del flujo de postulación

`PostulacionPage.jsx` reescrita. **Fase 1 fidelidad:** E1–E6 (corregidos también en `InicioPage`, `ColegioPage`, `ComparadorPage`, `AlgoritmoPage`, `CalendarioPage`, `ChatAyuda`, `TourContext`); comprobante `.txt` descargable con folio, lista ordenada y fechas. **Fase 2 flujo:** drag-and-drop nativo + botones ↑↓ con anuncio `aria-live`; `ColegioAnalisis` con postulantes del año anterior y vacantes por nivel como fundamento del %; confirmación explícita del nivel al vincular ("Verifica el curso: es el error más frecuente"); enlaces "Editar" por sección en el paso 3. **Fase 3 diferenciales:** postulación familiar en bloque simulada; consejo estratégico DA + aviso de lista corta/alta demanda; bloque "¿Y si no quedo en ninguna?" con enlaces a `/proceso`. CSS S22 en `index.css`. Optimización 2026-08-06: divulgación progresiva de prioridades (explicaciones a modal `<dialog>` con botón "?"), siglas con `<abbr>`.

**Inciso 22-9 reformulado (2026-09-06):** se retiró la persistencia del borrador reanudable entre visitas (antes `sae_react_postulacion_draft_list`, aviso "Retomaste tu borrador", badge "✓ Borrador guardado"). Ahora la lista se arma **desde cero en cada visita**; navegar entre los 3 pasos la conserva (estado React), recargar la vacía. Motivo: la prueba comparativa entrega una **lista fija** y no debe arrastrar estado entre participantes. El inciso pasa de "guardado visible de borrador + reanudación" a "la lista no se pierde al moverse entre pasos"; sigue ✅, **87/87 sin cambio**.

### 6.6 Refinamientos post-S22 (bitácora del flujo, bloques D–U)

`docs/planificacion/bitacora_flujo_postulacion_y_resultado.md` es el registro único de trazabilidad **qué se cambió → qué guía lo fundamenta → en qué capítulo de la memoria se escribe → estado de validación**. Regla de honestidad: si un cambio no tiene fundamento en una guía/estudio, se marca `⚠ SIN FUNDAMENTO DOCUMENTADO`; no se inventa la cita a posteriori. Bloques principales:

- **D (2026-08-13):** refinamiento de S22-14 por las guías UX-IA — se retira "considera ponerlo más abajo en tu lista" (contradecía strategy-proofness); se separa el dato que fundamenta la probabilidad baja de una frase explícita de que reordenar no cambia esa cifra; formato de frecuencia en los 3 niveles; categoría "Certeza muy alta" (hermano/a nivel 1, prob ≥ 90).
- **E (2026-08-13):** paso de resultado inmediato — `InfoBox` "Solo para esta prueba: mira tu resultado ahora" con enlace a `/seguimiento` (en el SAE real el resultado tarda hasta octubre; aquí se adelanta para observar la reacción en la misma sesión). Marcado como "extensión fuera de la matriz S1–S22"; **87/87 sin cambio**. Decisión abierta: formalizarlo como S23 o dejarlo exclusivo de la prueba.
- **G (2026-08-26):** **prioridad por colegio** — el modelo pasa de global (`nivelPrioridad(perfil)`, único para toda la lista) a **por colegio** (`nivelPrioridadEnColegio(perfil, id)`). `prioritario` (SEP) sigue transversal; `hermano`/`funcionario`/`exalumno` se resuelven contra el colegio concreto (`perfil.prioridadesPorColegio`). Nuevo campo `casoPrioridades` en los 6 colegios. Corrige el bug del colegio-control (antes San Martín heredaba la prioridad de hermano que la familia tenía en Los Andes).
- **H (2026-08-26):** auditoría de microcopy — P4 (HAX G5/G6): ningún aviso juzga a la familia ni refuerza estigmas ("vulnerabilidad socioeconómica verificada" → "el Estado lo determina según la situación socioeconómica… no es algo que decidas tú"). P3 (NNG): toda advertencia accionable.
- **I (2026-08-26):** `ProbabilidadVisual.jsx` (barra proporcional / icon array 10×10, `role="img"`, distinción lleno/vacío por relleno+borde+número, `prefers-reduced-motion`); `InfoBox` "Antes de empezar: cómo se decide tu resultado" siempre visible en el paso 1 (HAX G1: qué hace / qué NO hace el algoritmo — no hay puntaje ni notas ni mérito).
- **J (2026-08-26):** lenguaje no antropomórfico en `AlgoSimuladorPasos` (NNG): "el sistema evalúa… hasta encontrar una asignación" → "revisa tus colegios en el orden que tú elegiste… aplica las prioridades que fija la ley y cuenta los cupos disponibles".
- **K (2026-08-27):** `/perfil` como **fuente única** de datos a nivel estudiante; SEP reencuadrada como **condición del Estado** (Registro Social de Hogares), de solo lectura, nunca casilla. Nuevo `src/utils/rut.js` compartido.
- **L (2026-08-27):** fidelidad brechas A / C / D del video oficial (casilla apoderado/a; modal de dos aceptaciones al agregar colegio; aviso de pérdida de cupo).
- **M (2026-09-01):** brecha B acotada (dirección de residencia: región + comuna + calle; **no** entra en la asignación — "la cercanía no es criterio de prioridad del SAE"); aceptaciones de registro; aviso de reenvío E (solo texto).
- **N (2026-09-02):** panel "condiciones detectadas" tras ClaveÚnica ("Esto es lo que el sistema ya sabe de tu hijo/a"); atajo "⚙️ Cargar caso de ejemplo" (familia Muñoz González) para acortar la sesión de prueba; prioridad por colegio de solo lectura ("el sistema lo detecta, no lo pregunta"); datos básicos del hermano/a en la postulación de bloque.
- **O (2026-09-03):** **el caso deja de tener cuota SEP y PIE**; San Martín pasa a demanda alta → probabilidad ≈ 26–28 %. El "colegio en mente" produce incertidumbre genuina **sin tocar la tabla de probabilidades**.
- **P (2026-09-03):** microcopy de la postulación familiar en bloque — se reencuadra la casilla como declaración de un hecho ("Sofía tiene un hermano que también postula este año"), no una acción; "en esta demo completas y ves solo la de Sofía".
- **Q (2026-09-03):** `ResultadoProvisional` — banner en vivo que hace visible que reordenar la lista **no** cambia los % por colegio (mecanismo a prueba de estrategia) pero **sí** decide en cuál preferencia caes (HAX G16). Refinado 2026-09-06/07: se quitó el umbral 65 obsoleto, se suavizó la certeza, se eliminó el lenguaje de "sorteo/azar" del encuadre. **Reformulado 2026-09-09** (a raíz de una duda del usuario: "no existe en una postulación real, parece un pronóstico"): de **pronóstico** a **ilustración de la regla** — encabezado *"¿Qué hace el orden de tu lista?"*, encabeza con la regla (no con el colegio), se quita "muy probable" y el `%` repetido, y el descargo *"es una simulación con datos del año pasado, no tu resultado; el sistema lo calcula en octubre… muchas familias creen tener más posibilidades de las que después resultan"* (anclado a **Arteaga et al. 2022** — sobre-optimismo de las familias del SAE; PAIR-ET calibrar la confianza; BROOK) pasa a estar **siempre visible** (antes solo en modo tutorial). Marcado como explicabilidad del prototipo → **se oculta en la condición B** del estudio.
- **R (2026-09-03):** **reescritura del simulador** (ver §6.7).
- **S (2026-09-06):** paso 1 en **modo verificación** — el SAE real precarga identidad y domicilio desde ClaveÚnica; la familia **verifica**, no tipea. Recap de solo lectura + "Algún dato no está bien — corregir". Se conservan como actos activos: confirmación del nivel, declaración jurada de apoderado/a, y la confirmación explícita de la postulación en bloque del hermano/a.
- **T (2026-09-08 — tras la auditoría independiente, ver §11):** **(T1)** `calcularResultado` sorteaba el recorrido con **un** PRNG compartido recorrido en orden de lista → el desenlace *queda/no queda* de un colegio podía depender de su posición; ahora cada colegio usa **su propia semilla** `mulberry32((SEED_CASO ^ (id·0x9e3779b1)) >>> 0)`, alineado con la regla real "sorteo independiente por colegio" y con lo que `probabilidadCupo` ya hacía para el `%`. Escenario canónico y snapshot de `%` intactos. **(T2)** `SeguimientoPage.generarExplicacion` narraba *"Quedaste en {colegio} a través del sorteo…"* también cuando la asignación era el **fallback sin cupo** (`sinAsignacionEnPreferencias`); ahora ramifica y dice explícitamente que no hubo asignación. **(T3)** la caché de `probabilidadCupo` ignoraba `params`. **(T4)** stepper con `role="progressbar"`. **(T5)** tests 14 → **16**. Detalle en la bitácora Bloque T y en `CONTEXTO_CLAUDE_CODE.md` §29.
- **U (2026-09-09 — `caso_estudio §3.2`, refinamiento S15-3):** la explicación del resultado en `/seguimiento` (`generarExplicacion`) deja de dar una línea genérica para el "por qué no quedaste en tu opción de más arriba" y pasa a una explicación **específica del colegio no obtenido** (recibe `resultado.detalles`): más familias que cupos (BROOK) + no tenías vínculo ni la reserva del 15 % ahí (HAX G11/G5-G6) + el desempate entre familias sin vínculo es "el propio sorteo del colegio, el mismo para todas… vale solo para ese colegio" (trato igual + strategy-proofness, no "azar") + cierre BROOK ("no crea cupos ni asegura la 1.ª opción"). Formato de frecuencia **"X de cada 100"** en toda la prosa. La rama `default` (nivel 5) también se reencuadra. La tarjeta "¿Qué significa no quedar en tu primera opción?" suma un párrafo de strategy-proofness. `asignacion.js`/`simulacionSae.js`/`prioridadLabels[5]`/snapshot de `%` intactos. Exclusiva de la **condición A** del estudio (ítems C4/C5/J2 + F3/A1). Detalle en la bitácora Bloque U y en `CONTEXTO_CLAUDE_CODE.md` §30.
- **V (2026-09-09 — F3, modo control / condición B):** contexto `ModoEstudioContext` (`esControl`) + pantalla `/estudio` para el moderador; cada pieza de explicabilidad lo consulta para ocultarse o simplificarse. `asignacion.js`/`simulacionSae.js` intactos → resultado idéntico en A y B. Ver §8.5 y `CONTEXTO_CLAUDE_CODE.md` §32.
- **W (2026-09-10 — calibración de bandas, refinamiento S22-14):** el resumen por colegio del paso 3 de `/postulacion` rotulaba todo `< 60 %` como *"probabilidad baja"*; ahora hay una banda **"⚖️ Resultado parejo" (40–59 %)**, el texto usa la demanda real del colegio (se quitó la contradicción "porque tiene alta demanda"), el consejo de sumar colegios queda solo en la banda baja, y el umbral de color rojo/ámbar baja de 60 a **40 %** en el chip, `ColegioAnalisis` y `ProbabilidadVisual`. Microcopy: "chances"→"posibilidades", "Certeza muy alta"→"Casi segura". Solo condición A (oculto en B). `asignacion.js`/snapshot de `%` intactos. Bitácora Bloque W, `CONTEXTO_CLAUDE_CODE.md` §33.
- **X (2026-09-10 — enriquecimiento de la ficha de resultado, refinamiento S15-4/5):** de `propuestas_ficha_resultado.md` se implementaron 5 de 7, solo condición A: tarjeta **"Qué sigue ahora"** (3 pasos con fecha + aviso "se acepta solo si no entras antes del 21 de octubre"); **tabla de 2 filas** "por qué te asignaron este colegio" antes de los párrafos (que pasan a un desplegable); **contrafactual concreto** ("si hubieras puesto {colegio} primero, habrías quedado igual"); **consecuencia de aceptar/rechazar** bajo los botones; y el **detalle por preferencia** suma "N postulantes para X–Y vacantes" + "tu prioridad aquí". De paso se corrigieron dos fechas desalineadas con `/proceso` (aceptar/rechazar hasta el 21 de octubre; matrícula 9–22 de diciembre), en A y B. Pendientes con la profesora: icon array del "no quedaste" (X6) y lista de espera concreta (X7). `asignacion.js` intacto. Bitácora Bloque X, `CONTEXTO_CLAUDE_CODE.md` §34.

### 6.7 El simulador: de tabla fija a Monte Carlo DA-por-colegio (Bloque R, 2026-09-03)

**Antes:** `src/utils/asignacion.js` tenía una tabla fija `probAsignacion` (15 valores `alta/media/baja` × niveles 1–5, escritos **a ojo** en `archivo/CLAUDE_v2.md §3`, sin calibración empírica) y una regla de asignación con **umbral 65 %** ("primer colegio con prob ≥ 65; si ninguno, el mayor con aviso") que **no representa la Aceptación Diferida** (sin umbral, por rondas, estable).

**Ahora (autorizado explícitamente por el usuario):** `src/utils/simulacionSae.js` — la probabilidad de quedar en un colegio se **estima con Monte Carlo (1000 iteraciones)** sobre una simulación *DA-por-colegio*:
- **`PARAMS_POBLACION`:** multitud sintética. `pSep: 0.55` **anclado** (54,7 % de prioritarios entre postulantes 2018); `pHermano: 0.10`, `pFuncionario: 0.02`, `pExalumno: 0.03` **estimaciones** documentadas (sin microdatos, ajustables); `cuotaSep: 0.15` (ley).
- **`simularCupo(colegio, nivel, familiaTramo, rng)`:** un sorteo. `S = round((min+max)/2)` vacantes; `A = postulantesAnterior` competidores sintéticos (campo del catálogo `colegios.js`; **el catálogo es ficticio pero verosímil**, no son datos reales del Mineduc — la bitácora Bloque R los llama "reales" en el sentido de "vienen del archivo de datos, no son un número mágico en la fórmula", fraseo impreciso señalado por la auditoría). **Fase 1 — cuota SEP:** los prioritarios compiten por `round(0.15·S)` cupos reservados, solo por sorteo (sub-escuela). **Fase 2 — pozo general:** los no ubicados compiten por el resto por (rango legal hermano < funcionario < exalumno < sorteo, sorteo).
- **`probabilidadCupo(...)`:** Monte Carlo 1000 iter, **PRNG con semilla fija** por (colegio, nivel), cacheado (la clave incluye `params` desde 2026-09-08). **No depende del orden de la lista.**
- **`calcularResultado(lista, perfil, nivelAlumno)`:** el `%` de cada colegio sale de `probabilidadCupo`; el **colegio asignado** sale de **un recorrido determinista de la lista** — cada colegio con su propia semilla derivada de `(SEED_CASO = 20260903, id)` desde 2026-09-08 (antes: un PRNG compartido recorrido en orden, ver Bloque T / §11). La familia "propone" en orden y para en el primero donde el sorteo la sienta. Fallback al de mayor `%` con `sinAsignacionEnPreferencias: true` (que `SeguimientoPage` ahora respeta: no narra "Quedaste en X"). `probPorcentaje(pRaw)` acota a **[1, 99]**.
- Se **eliminaron** `probAsignacion` y el umbral 65. Se conservan `nivelPrioridad`, `nivelPrioridadEnColegio`, `prioridadLabels` (solo para **etiquetas**), `PRIORIDADES_POR_COLEGIO` y el vocabulario de `estado`.

**Números del caso Muñoz González (4.º básico, sin SEP), Monte Carlo 1000:**

| Colegio | vínculo · demanda | `%` nuevo | (tabla vieja) |
|---|---|---|---|
| Los Andes | hermano/a · alta | **99** | 92 |
| República de Chile | exalumno/a · baja | **99** | 96 |
| Villa del Sol | funcionario/a · alta | **99** | 65 |
| Simón Bolívar | — · media | **50** | 60 |
| Los Quillayes | — · media | **46** | 60 |
| San Martín | — · alta | **26** | 28 |

**Lectura pedagógica:** prioridad legal → ~99 % (fiel: el SAE reserva a hermanos/funcionarios/exalumnos); sin vínculo, manda la demanda (alta → 26 %, media → moneda al aire).

**Limitaciones declaradas de la v1** (en el header de `simulacionSae.js` y en `mapa_resultados_caso_munoz_gonzalez.md`): es DA *por colegio*, no multi-colegio (los demás postulantes no se desplazan entre colegios); no modela la cuota PIE ni alta exigencia académica; los 3 parámetros de vínculo son estimaciones. La calibración con microdatos sería el paso siguiente, fuera de alcance.

### 6.8 Suite de tests (`sae-react/tests/`, 2026-09-02, reescrita 2026-09-03)

Runner nativo `node --test` (Node ≥ 20), **sin frameworks ni dependencias nuevas** (regla de `CLAUDE.md`). Hook `resolve-extensionless.mjs` completa la extensión de los imports estilo Vite solo al correr tests. `flujo-postulacion.test.js` (**16 tests** desde 2026-09-08; antes 14) ejercita `asignacion.js` + `simulacionSae.js` + `colegios.js` con el caso Muñoz González: snapshot calibrado de los 6 `%`, propiedades (prioridad ≥ 90; San Martín < 40; media 30–65), **strategy-proofness** (el `%` de un colegio no cambia con su posición), determinismo, el escenario clave (San Martín 1.º → Los Andes 2.ª), el **fallback sin cupo** (`sinAsignacionEnPreferencias` + no infla el `%`), la **independencia por colegio** del sorteo del recorrido, y un **guardarraíl de regresión** sobre `PARAMS_POBLACION` / `SEED_CASO` / iteraciones Monte Carlo. `npm run lint`, `npm run build` y `npm test` (16/16) limpios al 2026-09-08. *Limitación reconocida en el propio test:* con los 6 colegios del caso no se puede "alcanzar" un colegio en posición > 1 (San Martín es el único que no sienta), así que la independencia total del sorteo es estructural, no observable por test.

### 6.9 Sistema de trazabilidad

- **Códigos `S<sección>-<inciso>`** en comentarios del código (español), atados a la matriz de `plan_mejora_sae.md`. Los refinamientos posteriores usan `S22-14 (refinamiento)`, etc., sin sumar puntos.
- **Bitácora del flujo** (`bitacora_flujo_postulacion_y_resultado.md`): mantenida por `bitacora-agent` tras cada cambio a `PostulacionPage.jsx`, a la parte de `SeguimientoPage.jsx` que consume el resultado, o a `colegios.js`/`asignacion.js`/`simulacionSae.js` que afecte el % o las prioridades. Mapea cada cambio a HAX/PAIR-ET/NNG/BROOK/RISK-NUM/FORM-MS y al capítulo de la memoria.
- **`NotasPage.jsx`** (`/notas`): trazabilidad visible diseño ↔ los 6 principios de la literatura, cada uno con su referencia, el hallazgo empírico y los componentes donde se implementó.
- **Cierre de tarea (regla 6 de `CLAUDE.md`):** cada agente termina actualizando `CLAUDE.md` (sección "Estado del proyecto"), `docs/CONTEXTO_CLAUDE_CODE.md` y/o `plan_mejora_sae.md`. Solo se registra lo hecho y validado, con fecha; nunca avances proyectados.

---

## 7. La memoria de título: estado por capítulo

`proyecto-tesis/main.tex` → 7 archivos en `capitulos/`. Compilación: `latexmk main.tex` (salida en `build/`); revisar `build/main.log` y `main.blg` por citas/referencias rotas. **Placeholders pendientes en la portada:** carrera, grado, profesor(a) guía.

| Cap. | Título | Estado |
|---|---|---|
| **00** | Resumen | ✅ Redactado. Declara explícitamente que la memoria está **en etapa intermedia**: el prototipo no ha sido reevaluado heurísticamente ni sometido a prueba con usuarios; caps. 5 y 6 quedan abiertos hasta tener esa evidencia. |
| **01** | Introducción | ✅ Redactado. Problema, pregunta de investigación, objetivo general, 6 objetivos específicos, estructura. |
| **02** | Marco teórico | ✅ Redactado. Diseño ético en UX / patrones oscuros; user-centered design y *personas*; transparencia vs. explicabilidad vs. interpretabilidad; sesgos algorítmicos (COMPAS, BOSCO); marcos regulatorios (NIST, ISO 42001, OCDE); **síntesis de la revisión de 96 papers** (qué funciona / qué no / relevancia SAE); el algoritmo del SAE (DA por rondas, 4 criterios, Epstein 2017); accesibilidad web (WCAG AA) como condición de transparencia; prototipado iterativo asistido por IA generativa. **Decisión abierta:** citar HAX / PAIR-ET directamente aquí o dejarlos solo como respaldo de diseño en el Cap. 3. |
| **03** | Metodología | ✅ Redactado. **Corregido el 2026-09-08** (Bloque T6): la descripción del caso ya no menciona "condición de estudiante prioritario/a del 15 %" (Bloque O); se añadió una fila de septiembre a la Tabla 3.1 (reescritura del simulador Monte Carlo, Bloque R) + descripción del modelo, limitaciones y anclas 2018; la nota post-tabla dejó de afirmar que "no se alteró la lógica de asignación"; el "100 % / 87 de 87" pasó a "la totalidad de los puntos aplicables… a nivel de código" con la nota de conteo (98 aplicables). **Pendiente mayor (writing-agent):** la §3.5 todavía describe una prueba **formativa N=8** → reescribirla como **estudio comparativo entre-sujetos N≈30** usando §6–§10 del caso de estudio (que ya tiene hipótesis §8.4, plan de análisis §8.5 y amenazas a la validez §10). Prompt en `prompt_pendientes_revision_caso_sin_sep.md`. |
| **04** | Resultados | ⚠️ Parcial **por diseño**. Reporta solo lo verificable de forma independiente: el diagnóstico heurístico (51 %/61 %), el estado de implementación del prototipo (98 aplicables a nivel de código; el "87/87 (100 %)" quedó corregido el 2026-09-08, Bloque T6), y la revisión del sitio oficial (2 de 6 brechas cerradas). **No incluye resultados de validación con usuarios** — pendientes. |
| **05** | Discusión | ⏳ **Pendiente por diseño.** Solo contiene lo discutible con datos ya obtenidos (hipótesis sobre por qué el sitio oficial cerró solo brechas informativas) + la lista de preguntas que deberá responder la discusión completa + limitaciones ya identificables (datos ficticios, persona única, no se audita el algoritmo real, comparación con el sitio oficial es inspección puntual). |
| **06** | Conclusiones | ⏳ **Pendiente por diseño.** Contiene "lo que puede afirmarse hasta ahora" (4 puntos) y "lo que falta para concluir" (4 tareas ordenadas por prioridad). |

**Nota:** LaTeX no siempre está instalado en el entorno de trabajo; varias compilaciones quedan pendientes de correr localmente. En shell externo, `bibtex` requiere `BIBINPUTS` explícito hacia `bibliografia/`; desde VS Code el `.latexmkrc` lo resuelve.

---

## 8. Validación: el plan y su reorientación a estudio comparativo

### 8.1 Plan de reevaluación heurística (5 fases, `03_metodologia.tex` §3.5)

1. **Preparación del instrumento:** rúbrica que replica las preguntas de chequeo SISIB-UChile (20 dimensiones + 14 factores) con hoja de cálculo que computa % por dimensión y global, misma fórmula del informe original.
2. **Aplicación al prototipo:** recorrer las secciones con 4 tipos de evidencia — validadores automáticos (W3C, axe-core, Lighthouse, contraste WCAG); inspección visual en 375/768/1280 px; inspección de código para indicadores estructurales; pruebas funcionales manuales del simulador y del flujo completo; navegación solo por teclado y con lector de pantalla.
3. **Análisis comparativo:** tabla y gráficos prototipo vs. baseline (51 %/61 %), dimensión por dimensión; verificar si las brechas críticas (inclusión, búsqueda, audiovisualidad, interoperabilidad) quedan resueltas.
4. **Informe ejecutivo** con evidencia por indicador y anexo de capturas.
5. **Triangulación con un segundo evaluador** independiente + coeficiente de acuerdo entre evaluadores (mitiga el sesgo de autoevaluación).

### 8.2 Prueba de usabilidad: de formativa N=8 a comparativa N≈30

**Reorientación (reunión con la profesora guía, 2026-09-03; bitácora §7).** De un estudio **formativo de final abierto** (N≈8, el/la participante elige el orden de la lista) a un **estudio comparativo controlado entre-sujetos** (N≈30, ~15 por condición):

- **Orden de postulación fijo** entregado al participante ("postula exactamente estos 6 en este orden") — acota el espacio de opciones, elimina el confound "a fulano le tocó una lista más fácil" y hace que **todos vean el mismo resultado**. Se mide limpiamente "¿esta UX me ayudó a entender *este* resultado?".
- **Dos condiciones:**
  - **A — UX que explica el algoritmo (tratamiento):** el prototipo actual, con toda su capa de explicabilidad construida sobre las guías (`/algoritmo` + `AlgoSimuladorPasos`, `ResultadoProvisional`, probabilidad por colegio + `ProbabilidadVisual`, explicación contextualizada de `/seguimiento`, InfoBox "cómo se decide tu resultado").
  - **B — control, sin explicación:** una versión del mismo flujo que **oculta toda esa capa**, anclada a la vitrina / SAE real. **No** debe ser un espantapájaros: las partes que son fidelidad al SAE real (panel de condiciones detectadas, prioridad por colegio de solo lectura, gates de aceptación) se conservan.
- **Diseño entre-sujetos** (dentro-sujetos no sirve: una vez que se entiende el algoritmo no se puede "desentender"). El "al menos 30" recoge la indicación de la profesora.
- **Instrumento** (comprensión / confianza / percepción de justicia + pregunta abierta) se conserva pero pasa a ser **comparativo entre grupos**; el ítem "tómbola" (B1) queda como **covariable**, junto con la experiencia previa con el SAE.

**Estado del documento del caso (2026-09-09):** `caso_estudio_prueba_usabilidad_postulacion.md` quedó presentable para que la profesora apruebe el **diseño**: caja "Estado del documento" al inicio; **§3.2** (argumento técnico del rechazo de San Martín + su traducción de usuario, ya implementada en código — Bloque U); **§8.4 Hipótesis** (H1 comprensión A>B principal · H2 confianza A>B · H3 justicia diferencia menor/nula, exploratoria · H4 mito estratégico cualitativa); **§8.5 Plan de análisis** (descriptivo + U de Mann-Whitney por constructo + tamaños de efecto; estratificación por covariables; codificación temática con doble codificación); **§10 Amenazas a la validez**; §9 firma las decisiones antes abiertas (alta exigencia académica → fuera de alcance; paso de resultado inmediato → herramienta de la prueba, no S23; ética → acción del autor, no bloquea la aprobación del diseño; F3 bloquea la ejecución, no la aprobación). `guion_moderador…md` reescrito a A/B con lista de orden fijo y 8 tareas; `guion_participante…md` v3 con los 6 colegios en orden canónico; `material_prueba_usabilidad_postulacion.md` (nuevo, cuadernillo del participante) + PDF; `mapa_resultados…md` con nota de escenario canónico. Los 4 PDF (caso, guion moderador, guion participante, material) regenerados con `marked` + Chrome headless (no hay pandoc/LaTeX en el entorno).

### 8.3 Decisiones del autor sobre el diseño (bitácora §7.5, 2026-09-06)

- **D1 — Orden de lista: fijo estricto** (no "estos 6, ordénalos con esta lógica").
- **D2 — Semilla: `SEED_CASO` única, no varía por participante** → todos ven el mismo desenlace determinista.
- **D3 — Resultado canónico: San Martín 1.º → asignación en Colegio Los Andes (2.ª preferencia).** Se eligió sobre "colegio con vínculo 1.º → queda en su 1.ª" porque el contraste entre A y B **solo significa algo si hay algo no obvio que explicar**: "no obtuviste tu primera opción, y este es el porqué".
- **D4 — El modo control oculta toda la capa de explicabilidad:** enlace a `/algoritmo` y simulador paso a paso, `ResultadoProvisional`, "X de cada 100" (`ProbabilidadVisual`), "por qué te asignaron este colegio" (`generarExplicacion`), InfoBox "cómo se decide", y los textos de `ColegioAnalisis` que fundamentan el `%`. Queda un proxy fiel del flujo real (buscar, armar la lista en el orden dado, confirmar, comprobante, ver el resultado **a secas**).
- **D4 resuelto técnicamente (2026-09-09, Bloque V):** contexto `ModoEstudioContext` (`esControl`, de `?modo=control` + `sessionStorage`) + pantalla `/estudio` para el moderador (número de participante → `condicionDe(n)`: impares A, pares B). Un solo código; `asignacion.js`/`simulacionSae.js` intactos → resultado idéntico en A y B. **Ya no bloquea la ejecución.**

### 8.4 Instrumento de medición (caso de estudio §8)

- **Pre-tarea:** B1 (percepción "tómbola", 1–5) + experiencia previa con el SAE (postuló alguna vez / nunca).
- **Post-tarea (Likert 1–5, 13 ítems):**
  - **Comprensión (C1–C5):** para qué sirve cada paso; por qué las posibilidades eran distintas por colegio; que un vínculo da prioridad **solo en ese colegio**; poder explicar con palabras propias por qué era poco probable San Martín; por qué el resultado fue ese y no otro.
  - **Confianza (F1–F5):** el sistema asigna con reglas, no al azar; se podía postular con confianza al colegio preferido sin ventaja; no me habría dado miedo poner primero el que más quiero; si no quedara en ninguno, la plataforma explica qué pasa después; el resultado fue coherente con lo mostrado antes de confirmar.
  - **Percepción de justicia (J1–J3):** el sorteo aleatorio para desempatar es justo; la razón por la que no quedó en San Martín es justa; todas las familias juegan con las mismas reglas.
- **Preguntas abiertas:** A1 (falso riesgo estratégico — "¿la habrías ordenado distinto? ¿dónde habrías puesto San Martín?"); A2 (hallazgos fuera del instrumento).

### 8.5 Roadmap de validación en 3 fases (bitácora §7.2)

| Fase | Qué | Depende de |
|---|---|---|
| **F1 — Caso y orden canónico** | Fijar la lista de 6 colegios y su orden; verificar con la semilla definitiva; re-sincronizar `caso_estudio…md`, `mapa_resultados…md`, `guion_moderador…md`, `guion_participante…md` + PDFs + Cap. 3. **Desbloqueada.** | — |
| **F2 — Explicatividad del algoritmo** | Repaso punto a punto de toda la superficie de explicación del prototipo (`AlgoritmoPage`, `AlgoSimuladorPasos`, `ResultadoProvisional`, `ColegioAnalisis`, `generarExplicacion`, InfoBox del paso 1, `ProbabilidadVisual`) y su refuerzo según HAX/PAIR/NNG/BROOK/RISK-NUM. Es la **condición de tratamiento**: tiene que estar tan sólida como las guías permitan antes de que la comparación signifique algo. | F1 |
| **F3 — Modo control** | **✅ Implementado (2026-09-09, bitácora Bloque V; `CONTEXTO_CLAUDE_CODE.md` §32).** Contexto `ModoEstudioContext` (`esControl`) + pantalla `/estudio` para el moderador; `esControl` cableado en Navbar / `AlgoritmoPage` / `InicioPage` / `ProcesoPage` / tour / `PostulacionPage` / `SeguimientoPage` / `ColegioPage` para ocultar o simplificar la capa de explicabilidad. `asignacion.js`/`simulacionSae.js` intactos → resultado idéntico en A y B. `lint`/`build`/`test` (16/16) limpios; A y B verificados en navegador. `f3_modo_control_inventario.md` §2 con el estado real por pieza. | F1 |

**Aspectos éticos:** consentimiento informado simple (caso ficticio, sin datos sensibles reales) con autorización de grabación de pantalla y audio. **Un estudio comparativo N≈30 refuerza la conveniencia de pasar por el comité de ética de la UTFSM** — queda por confirmar si es exigible para una memoria de título.

---

## 9. Estado actual (septiembre 2026) — resumen ejecutivo

- **Prototipo:** v4.5. Todas las rutas implementadas. Matriz de mejora: **22 categorías, 98 requisitos aplicables abordados a nivel de código** (la cifra histórica "87/87 (100 %)" no era reproducible — corrección de integridad del 2026-09-08, §6.3 y §11). `npm run lint` (0/0), `npm run build` y `npm test` (16/16) limpios al 2026-09-09.
- **Auditoría independiente (2026-09-08):** `docs/auditoria_independiente_sae_2026-09-08.md`. Hallazgos reales; ejecutado un subconjunto acotado (sorteo por colegio, fallback sin cupo, caché, `role=progressbar`, +2 tests, conteo 87→98). Pendiente el resto (§10, §11).
- **Simulador:** reescrito a **Monte Carlo DA-por-colegio** (`simulacionSae.js`); la tabla fija `probAsignacion` y el umbral 65 ya no existen. Limitaciones v1 declaradas.
- **Caso Muñoz González:** cerrado. Familia **sin SEP ni PIE**. Colegio en mente (San Martín) ≈ 26 %. Resultado canónico verificado contra el código: San Martín 1.º → Los Andes 2.ª preferencia.
- **Flujo de postulación:** pasada de fidelidad cerrada (brechas A–F del video, salvo E parcial y G/I/H diferidas); paso 1 en modo verificación; lista se arma desde cero en cada visita. **Explicación del resultado en `/seguimiento` reescrita el 2026-09-09** según `caso_estudio §3.2` (Bloque U): "por qué no quedaste en tu 1.ª opción" pasa a explicación específica del colegio (más familias que cupos + sin vínculo ni reserva 15 % + desempate como trato igual + BROOK), formato "X de cada 100", + párrafo de strategy-proofness.
- **Memoria:** caps. 00–04 redactados (04 parcial por diseño); caps. 05–06 pendientes hasta tener validación. Cap. 3 corregido el 2026-09-08 (conteo, caso sin SEP, fila de simulador en Tabla 3.1); **pendiente mayor: reescribir §3.5** de prueba formativa N=8 a estudio comparativo N≈30 (usar §6–§10 del caso).
- **Validación:** plan diseñado, **no ejecutado**. Reorientada a estudio comparativo entre-sujetos N≈30. **F1 desbloqueada; F3 (modo control) implementada el 2026-09-09 (Bloque V); queda F2** (endurecer la explicabilidad de la condición A).
- **Material de la prueba (2026-09-09):** `caso_estudio…md` (con §3.2/§8.4/§8.5/§10), `guion_moderador…md` (A/B, orden fijo), `guion_participante…md` v3, `material_prueba_usabilidad_postulacion.md` (nuevo cuadernillo), `mapa_resultados…md` — todos sincronizados; los 4 PDF regenerados. Pendiente: reescritura de `03_metodologia.tex` §3.5 (writing-agent).

---

## 10. Proyecciones, trabajo pendiente y decisiones abiertas

### 10.1 Roadmap fase 2 del flujo (R1–R6, `comparativa_flujo_postulacion_v_final.md` §6 → Cap. 6)

| ID | Brecha | Valor | Esfuerzo |
|---|---|---|---|
| **R1** | Modelo de prioridad por **búsqueda de RUN + confirmación del establecimiento** (hermano/funcionario), en vez de chips pre-sembrados | Alto — hace visible por qué la prioridad es específica del colegio | Medio |
| **R2** | Pantalla real OPCIÓN 1 INDEPENDIENTE / OPCIÓN 2 FAMILIAR con checkboxes por hermano, condicionada a colegios en común | Medio | Medio |
| **R3** | Filtros completos de búsqueda (jornada, género, tipo de enseñanza, dependencia, internado, continuidad) — brecha I | Medio — encontrabilidad (S5); varios campos ya existen en los datos | Bajo-medio |
| **R4** | Vista mapa de establecimientos | Bajo — depende de tener más colegios y geodatos | Alto |
| **R5** | Uso de la dirección para proximidad real (si se decide que aporta) | Bajo — en DA la distancia no prioriza | Medio |
| **R6** | IPA como alternativa al RUN en la identificación — brecha G | Bajo — inclusión de postulantes sin RUN | Bajo |

**Pendientes menores de fidelidad (bitácora §5):** invalidación efectiva del comprobante al modificar (brecha E, parte de estado); tratamiento propio de la obligación de postular sin continuidad de nivel (brecha F); N-mejores alternativas ("si no quedas aquí, tus siguientes opciones más probables son…"); reencuadre estricto NNG del "el sistema intenta dejarlos juntos" → "se procura según cupos y prioridades".

### 10.2 Capítulos pendientes de la memoria (por prioridad, Cap. 6)

1. **Ejecutar la reevaluación heurística del prototipo** con el instrumento SISIB, siguiendo el plan de 5 fases, idealmente con triangulación de un segundo evaluador.
2. **Ejecutar la prueba de usabilidad** (estudio comparativo N≈30) sobre el prototipo completo.
3. **Redactar el Cap. 5 (Discusión)** interpretando los resultados a la luz del Cap. 2 y del estado del sitio oficial (§4.3).
4. **Redactar el Cap. 6 (Conclusiones)** definitivo: contribuciones reales, limitaciones confirmadas empíricamente, líneas futuras (colaboración con el Mineduc, ampliación a otros perfiles de usuario).

**Reescrituras del Cap. 3 (writing-agent):** simulador Monte Carlo + parámetros de población como supuesto metodológico anclado parcialmente a 2018; §3.5 de prueba formativa N=8 → estudio comparativo N≈30; caso sin cuota del 15 %; Tabla 3.1 (inciso 22-9). Prompt desglosado en `docs/planificacion/prompt_pendientes_revision_caso_sin_sep.md`.

### 10.3 Decisiones abiertas del autor (bitácora §6)

1. ¿El paso de resultado inmediato entra como **S23** en `plan_mejora_sae.md`, o queda como "extensión fuera de la matriz"? (mientras tanto, 87/87 no se toca).
2. **Cambio de foco de la memoria** (`plan_cambio_foco_postulacion.md`): ¿se ajusta el subtítulo hacia "flujo de postulación"? ¿Se reescriben los objetivos específicos 4 y 5 con la mención explícita?
3. **Citar HAX / PAIR-ET directamente en el Cap. 2**, o dejarlos solo como respaldo de diseño en el Cap. 3.
4. **Alta exigencia académica:** ¿se aborda o queda fuera de alcance? (hoy ningún colegio del prototipo tiene esa modalidad — requeriría agregar uno al set de datos).
5. **Comité de ética UTFSM:** ¿exigible para la prueba aunque los datos sean ficticios? (más peso ahora, con N≈30 comparativo).
6. **Sincronización doc↔código de la prueba:** `guion_participante…md`, `material_…pdf` (regenerar), `mapa_resultados…md`.

### 10.4 Gaps de modelo que tocarían el núcleo protegido (requieren OK explícito del usuario)

- **¿El PIE entra en el cálculo?** Hoy es dato a nivel de estudiante (`/perfil` → `pie`), se **muestra** con la aclaración de que no cambia el %. Cerrarlo (PIE como cuota antes del nivel 1, solo en colegios con `nee.programa`) implica tocar `nivelPrioridadEnColegio`/`calcularResultado` y el modelo de `simulacionSae.js`.
- **¿La postulación de bloque hace una asignación real para el hermano/a?** Hoy se captura (`hermano: {…}`) pero `calcularResultado` corre solo para el estudiante principal.
- **Calibración del simulador con microdatos reales del SAE** (`pHermano`/`pFuncionario`/`pExalumno` son estimaciones; `pSep` está anclado a 2018). Sería el paso siguiente natural, hoy fuera de alcance.
- **DA multi-colegio completo** (que los demás postulantes también se desplacen entre colegios) — la v1 es DA *por colegio*.

### 10.5 Contexto externo a vigilar

- **Reforma del SAE** en el Senado (elección mutua / asignación aleatoria). Si avanza, cambia el objeto de estudio; la memoria la trata en limitaciones/trabajo futuro.
- **Cambios del sitio oficial** — la revisión de §4.3 es de julio 2026; conviene repetirla antes de la entrega final.

### 10.6 Pendientes de la auditoría independiente (2026-09-08)

`docs/auditoria_independiente_sae_2026-09-08.md`. **Ya ejecutado (bitácora Bloque T / `CONTEXTO_CLAUDE_CODE.md` §29):** sorteo del recorrido independiente por colegio (T1), fallback sin cupo dejó de narrarse como asignación (T2), clave de caché con `params` (T3), `role="progressbar"` en el stepper (T4), +2 tests (T5), corrección del conteo "87/87" → 98 aplicables en plan y memoria (T6).

**No ejecutado — decisión del autor / trabajo posterior:**
- **Reescritura mayor de §3.5** (prueba formativa N=8 → estudio comparativo entre-sujetos N≈30) + regenerar `material_prueba_usabilidad_postulacion.pdf`. Sigue en el roadmap F1 y en `prompt_pendientes_revision_caso_sin_sep.md`.
- Teclado y patrón *combobox* completo en el autocomplete de `InicioPage`; pasada de teclado/ARIA a controles personalizados.
- Videos y tutoriales de `/algoritmo`: implementarlos o rotularlos en la UI como *placeholders* (y que `04_resultados.tex` no llame al módulo "plenamente interactivo").
- Decidir si PIE y hermanos-en-bloque entran al modelo de `simulacionSae.js`, o retirar las frases que insinúan que ya lo hacen.
- Unificar las consecuencias de aceptar/rechazar entre `/seguimiento` y `/proceso`.
- Invalidación efectiva del comprobante al modificar la lista (hoy solo aviso de texto — brecha E).
- Limpieza de CSS huérfano / breakpoint 768 px / quick cards / afirmaciones de "foto real" (housekeeping; no son bugs de usuario).
- Sobre la propia auditoría: su re-puntuación "≈55/98 (56 %)" usa veredictos binarios estrictos sobre una matriz que no es una rúbrica pass/fail (guías aspiracionales de microcopy puntuadas como binarias; features reemplazadas por decisión de diseño contadas como fallos). **No debe citarse esa cifra sin revisión fila por fila con criterio explícito.**

### 10.7 Pendientes de la revisión bibliográfica (2026-09-08, `investigacion_guias_ux_transparencia_sae.md`)

**Ya aplicado (docs):** corrección de la fuente arXiv:2408.12365 (series temporales, no icon arrays) y separación de las fuentes RISK-NUM; retiro de la cifra "−20–25 % abandono" sin fuente primaria; GOV.UK Design System como fuente preferida de trámites multipaso — en `investigacion_ux_guide_ai_systems.md` §6/§7 y bitácora §2.

**No aplicado — decisión del autor / writing-agent (toca `referencias.bib` y prosa de la memoria):**
- **Añadir a `referencias.bib`** las dos fuentes chilenas verificadas: **Correa et al. 2022** (*Operations Research* 70(2):1066–1087, DOI 10.1287/opre.2021.2184) — hoy no está como entrada formal, solo `epstein2017mecanismos` — y **Arteaga et al. 2022** (*QJE* 137(3):1791–1848, DOI 10.1093/qje/qjac013), **nueva**. Verificar números exactos de Arteaga contra el PDF.
- **Reencuadrar HAX/PAIR en la memoria** como "heurísticas de interacción adaptadas a un sistema automatizado de asignación", **no** "el SAE es un sistema de IA". (El research doc `investigacion_ux_guide_ai_systems.md` §1 ya lo hace bien; el riesgo es la prosa del Cap. 2/3.) Esto también responde a la decisión abierta §10.3 nº 3 (citar HAX/PAIR en el Cap. 2 o solo como respaldo).
- **Usar "probabilidad estimada / comunicación de incertidumbre"**, nunca "confianza del modelo", para el `%` de Monte Carlo (ya es la práctica del código y los docs; revisar el Cap. 2/3).
- **Nueva cadena de evidencia para el marco teórico** (§12 y §17 de la revisión): Arteaga (problema chileno: creencias, sobreoptimismo, respuesta a info personalizada) → Correa + teoría DA (mecanismo, strategy-proofness, comunicabilidad como criterio de diseño) → HAX/PAIR (diseño de la explicación) → Galesic/risk-communication (probabilidad) → GOV.UK/NNG (flujo) → estudio propio (validación). Reestructurar el Cap. 2 según esa jerarquía es una decisión de alcance de la tesis.
- La revisión **refuerza el diseño A/B**: la condición A (explicativa) queda fundamentada por HAX + PAIR + risk-communication + Brookings + **Arteaga + Correa**; la condición B conserva el flujo real sin la capa explicativa.

---

## 11. Dónde puede aportar investigación nueva

Áreas donde un aporte de investigación encajaría directamente en el proyecto:

1. **Calibración empírica del simulador.** Los parámetros de población (`pHermano`, `pFuncionario`, `pExalumno`) son estimaciones. Microdatos del SAE (bases públicas del Mineduc, informes de la DEG, papers posteriores a Correa et al.) permitirían anclarlos y hacer un análisis de sensibilidad. También: comparar la aproximación "DA por colegio" contra una simulación DA multi-colegio para acotar el error del modelo v1.
2. **Comunicación de probabilidad para baja numeracidad — evidencia específica de elección escolar.** RISK-NUM se apoya en literatura de riesgo médico. ¿Hay estudios sobre icon arrays / formato de frecuencia en decisiones educativas de familias? ¿Qué formato comunica mejor "26 % de quedar" sin disparar el estigma de "tómbola"?
3. **El mito del riesgo estratégico en poblaciones chilenas.** ¿Existe evidencia local (encuestas, estudios cualitativos del CIAE / MIPP / Elige Educar) sobre cuántas familias creen que el orden de la lista "esconde" preferencias? Alimentaría la interpretación de las preguntas abiertas A1/F3.
4. **Diseño del modo control (condición B) que sea un proxy justo del SAE real, no un espantapájaros.** Requiere caracterizar con precisión qué explica y qué no explica la vitrina / plataforma oficial hoy (actualizar `investigacion_vitrina_sae.md` y `analisis_video_paso_a_paso_sae.md`).
5. **Marcos HAX / PAIR aplicados a IA determinista de alto riesgo (no ML).** El proyecto argumenta que el DA "cumple todas las condiciones de alto riesgo desde la UX aunque no sea ML". Reforzar o matizar ese argumento con literatura (¿hay trabajo sobre transparencia de sistemas de *matching* / asignación centralizada — NYC, Boston, Ámsterdam, París — evaluado con usuarios?).
6. **Gestión de expectativas y percepción de justicia.** La literatura sugiere que la explicabilidad contextualizada mejora comprensión y confianza pero **no necesariamente** la percepción de justicia del resultado. El instrumento separa los tres constructos (C/F/J) justamente para observar esto — evidencia previa ayudaría a formular hipótesis direccionales.
7. **Accesibilidad como condición de transparencia.** Auditoría formal (lector de pantalla, axe-core, Lighthouse) del prototipo como anexo de la memoria; comparación con las fallas de accesibilidad documentadas del sitio real.
8. **Reforma legislativa 2026.** Análisis del proyecto de "elección mutua" y su tensión con el argumento de explicabilidad del DA (los diseñadores eligieron DA *porque* es fácil de comunicar y justificar).
9. **Ética y consentimiento en pruebas de usabilidad de memorias de título en la UTFSM** — precedentes, requisitos del comité, plazos.

---

## 12. Glosario de siglas y términos

| Término | Significado |
|---|---|
| **SAE** | Sistema de Admisión Escolar (Mineduc Chile). |
| **DA / Aceptación Diferida** | *Deferred Acceptance* (Gale–Shapley 1962), mecanismo de emparejamiento estable; base del SAE. |
| **Ley 20.845** | Ley de Inclusión Escolar (2015): elimina copago, prohíbe selección, define prioridades. |
| **SEP** | Subvención Escolar Preferencial. "Estudiante prioritario/a" = tercio de menores ingresos según el **Registro Social de Hogares**; cuota del **15 %** de cupos por nivel. Lo determina el Estado, no se autodeclara. |
| **PIE** | Programa de Integración Escolar (NEE). Cuota de hasta 2 cupos/curso, procesada antes que cualquier prioridad. |
| **RSH** | Registro Social de Hogares. |
| **ClaveÚnica** | Identidad digital del Estado de Chile. En el prototipo, login simulado. |
| **IPA / IPE / IPP** | Identificador Provisorio de Apoderado / de Estudiante. Alternativa al RUT para quienes no lo tienen. |
| **RBD** | Rol Base de Datos: identificador único de un establecimiento. |
| **SIMCE** | Sistema de Medición de la Calidad de la Educación. |
| **GSE** | Grupo socioeconómico (usado para comparar SIMCE entre colegios similares). |
| **SIGE** | Sistema de Información General de Estudiantes (registro de matrícula del Mineduc). |
| **Strategy-proofness** | Propiedad: declarar las preferencias verdaderas es la estrategia óptima. |
| **Falso riesgo estratégico** | Creencia errónea de que poner primero el colegio más deseado (aunque improbable) perjudica. El DA lo hace falso. |
| **"Colegio en mente"** | El que la familia quiere de verdad sin tener ninguna prioridad ahí (en el caso: San Martín). |
| **HAX** | Microsoft *Guidelines for Human-AI Interaction* (18 guías, HAX Toolkit). |
| **PAIR-ET** | Google *People + AI Guidebook*, cap. "Explainability + Trust". |
| **NNG / NN/g** | Nielsen Norman Group. |
| **BROOK** | Brookings Institution (Kasman & Valant 2019, algoritmos de asignación K-12). |
| **RISK-NUM** | Literatura de comunicación de riesgo para baja numeracidad (icon arrays, formato de frecuencia). |
| **FORM-MS** | Buenas prácticas de formularios multipaso. |
| **E1–E6** | Los 6 errores de fidelidad del flujo previo, corregidos en S22. |
| **A–I** | Brechas de fidelidad frente al video oficial del Mineduc. |
| **R1–R6** | Roadmap fase 2 del flujo (post-prueba). |
| **F1/F2/F3** | Fases del roadmap de validación (caso canónico / explicatividad / modo control). |
| **SEED_CASO** | `20260903` — semilla fija del recorrido determinista del caso. |
| **`research through design`** | Metodología: diseñar y refinar el artefacto genera conocimiento. |

---

## 13. Cifras clave (no inventar — origen indicado)

| Cifra | Valor | Origen |
|---|---|---|
| Cumplimiento sitio informativo SAE | **51 %** | Informe Fondecyt 1250492 |
| Cumplimiento plataforma de postulación SAE | **61 %** | Informe Fondecyt 1250492 |
| Transparencia y apertura (sitio informativo) | **0 %** | Informe Fondecyt 1250492 |
| Inclusión (sitio informativo) | **0 %** | Informe Fondecyt 1250492 |
| Legibilidad Spaulding sitio informativo / plataforma | **120,43 / 95,26** | Informe Fondecyt 1250492 |
| Contraste gris `#c7c8c7` sobre blanco | **1,68:1** | Informe Fondecyt 1250492 |
| Peso de la portada de la plataforma | **7,7 MB** | Informe Fondecyt 1250492 |
| PageSpeed móvil de la plataforma | **14 %** | Informe Fondecyt 1250492 |
| Publicaciones en la revisión sistemática | **96** (2017–2025) | `EXECUTIVE_SUMMARY.md` |
| Filas de la matriz de mejora | **102 numeradas; 4 no aplican → 98 aplicables**; 22 categorías. (La cifra "87/87 (100 %)" no era reproducible — corr. 2026-09-08.) | `plan_mejora_sae.md` |
| S21 / S22 | **10 / 15 puntos** | `plan_mejora_sae.md` |
| Tests del flujo | **16/16** (14 hasta el 2026-09-07) | `sae-react/tests/` |
| Estudiantes SAE proceso 2018 | **274.990** | Correa et al. (`investigacion_algoritmo_sae.md`) |
| Establecimientos 2018 | **6.421** (522.859 vacantes) | Correa et al. |
| Postulaciones promedio por estudiante (2018) | **3,18** | Correa et al. |
| Asignados a su 1.ª preferencia (2018) | **59,2 %** | Correa et al. |
| Asignados a alguna preferencia (2018) | **82,5 %** | Correa et al. |
| No asignados en ronda principal (2018) | **8,9 %** | Correa et al. |
| Prioritarios entre postulantes (2018) | **54,7 %** (cuota de 15 %) | Correa et al. |
| Postulaciones familiares exitosas: sin/con adaptación (simulación) | **52,9 % → 65,5 %** | Correa et al. |
| Cierre Periodo Principal Admisión 2027 | **27 de agosto de 2026, 14:00** | Calendario oficial (`investigacion_paso_a_paso_sae.md`) |
| Resultados Periodo Principal Admisión 2027 | **15–21 de octubre de 2026** | Calendario oficial |
| Probabilidad estimada San Martín (caso, 4.º básico, sin SEP) | **≈ 26 %** | `simulacionSae.js` (Monte Carlo 1000) |
| Parámetros de población del simulador | `pSep 0.55` (anclado 2018), `pHermano 0.10`, `pFuncionario 0.02`, `pExalumno 0.03`, `cuotaSep 0.15` | `simulacionSae.js` |

---

## 14. Mapa de archivos del repositorio

```
ux-sae-usm/
├── CLAUDE.md                         Instrucciones base del repo (subproyectos, reglas, estado)
├── docs/
│   ├── CONTEXTO_CLAUDE_CODE.md       Contexto técnico del prototipo (34 secciones cronológicas; §32 = F3 modo control, §34 = ficha de resultado)
│   ├── CONTEXTO_GENERAL_PROYECTO.md  ← este documento
│   ├── estudio_algoritmo_SAE_2026-08-05.pdf
│   ├── investigacion/
│   │   ├── EXECUTIVE_SUMMARY.md                        Revisión de 96 papers — resumen
│   │   ├── algorithm_transparency_literature_review (1).md
│   │   ├── algorithm_transparency_supplementary_analysis.md
│   │   ├── Informe Evaluación de calidad web SAE (1).pdf   Diagnóstico Fondecyt 1250492
│   │   ├── feedback_sae_problemas.md                   Extracto del informe (secciones 13 y 14)
│   │   ├── investigacion_algoritmo_sae.md              Mecánica del DA, prioridades, cifras 2018
│   │   ├── investigacion_vitrina_sae.md               Ficha de colegio oficial → esquema v2
│   │   ├── investigacion_paso_a_paso_sae.md           5 etapas, calendario 2027 → /proceso
│   │   ├── analisis_flujo_postulacion.md              Auditoría E1–E6, benchmark → S22
│   │   ├── analisis_video_paso_a_paso_sae.md          Video oficial → brechas A–I
│   │   ├── investigacion_ux_guide_ai_systems.md       HAX / PAIR-ET / NNG / BROOK / RISK-NUM / FORM-MS
│   │   ├── investigacion_guias_ux_transparencia_sae.md  Revisión bibliográfica de las 6 guías + Correa/Arteaga (2026-09-08, externo)
│   │   ├── caso_estudio_prueba_usabilidad_postulacion.md   Familia Muñoz González + diseño del estudio (§3.2, §8.4/8.5, §10) (+ .pdf)
│   │   ├── guion_moderador_prueba_usabilidad.md (+ .pdf)  A/B, lista de orden fijo, 8 tareas
│   │   ├── guion_participante_prueba_postulacion.md (+ .pdf)  v3 — 6 colegios en orden canónico
│   │   └── material_prueba_usabilidad_postulacion.md (+ .pdf)  Cuadernillo del participante (consent + pre + tarjeta + post)
│   └── planificacion/
│       ├── plan_mejora_sae.md                         Matriz: 102 filas, 98 aplicables, 22 categorías
│       ├── bitacora_flujo_postulacion_y_resultado.md  Trazabilidad del flujo (bloques A–X) + roadmap §7
│       ├── comparativa_flujo_postulacion_v_final.md   Inventario input-por-input + roadmap R1–R6
│       ├── plan_cambio_foco_postulacion.md            Propuesta de acotar la memoria al flujo
│       ├── mapa_resultados_caso_munoz_gonzalez.md     Qué colegio queda según el orden
│       ├── prompt_pendientes_revision_caso_sin_sep.md Prompt para el writing-agent
│       ├── f3_modo_control_inventario.md              Inventario de la capa de explicabilidad → condición B (implementada, Bloque V)
│       ├── reunion_profesor_guia_2026-08-06.md
│       └── reunion_profesor_guia_2026-08-13.md
├── proyecto-tesis/
│   ├── main.tex                      report 12pt, natbib author-year, plainnat
│   ├── .latexmkrc
│   ├── capitulos/
│   │   ├── 00_resumen.tex            ✅
│   │   ├── 01_introduccion.tex       ✅
│   │   ├── 02_marco_teorico.tex      ✅
│   │   ├── 03_metodologia.tex        ✅ (reescrituras pendientes: simulador, §3.5, caso)
│   │   ├── 04_resultados.tex         ⚠️ parcial por diseño
│   │   ├── 05_discusion.tex          ⏳ pendiente
│   │   └── 06_conclusiones.tex       ⏳ pendiente
│   └── bibliografia/referencias.bib  Bloque A verificado / Bloque B por verificar
├── sae-react/
│   ├── src/
│   │   ├── App.jsx                   Router, ErrorBoundary, SEO por ruta, lazy loading
│   │   ├── index.css                 Todos los estilos (@theme, mobile-first)
│   │   ├── pages/                    14 rutas (ver §6.1; + /estudio = panel del moderador, F3)
│   │   ├── components/               Navbar, Footer, ChatAyuda, GuidedTour, ProbabilidadVisual,
│   │   │                             AlgoSimuladorPasos, SchoolIllustration, ScrollToTop, TextSizeBar
│   │   ├── context/                  TextSizeContext, TourContext, ModoEstudioContext (F3 — esControl)
│   │   ├── data/
│   │   │   ├── colegios.js           6 colegios ficticios, esquema v2 + casoPrioridades
│   │   │   └── incisos.js            Datos de cumplimiento (CumplimientoPage)
│   │   └── utils/
│   │       ├── asignacion.js         calcularResultado, nivelPrioridadEnColegio, prioridadLabels
│   │       ├── simulacionSae.js      Monte Carlo DA-por-colegio, PARAMS_POBLACION, SEED_CASO
│   │       └── rut.js                formatearRut / rutValido (compartido /perfil y /postulacion)
│   ├── tests/                        node --test, 16 tests, sin frameworks
│   └── package.json                  scripts: dev / build / lint / test
└── archivo/                          Historia (HTML v1/v2, CLAUDE_v2.md, docs antiguos). No editar.
```

---

*Fin del documento. Compilado el 2026-09-07 a partir del estado del repositorio en la rama `main` (commit `ec2543a`).*
