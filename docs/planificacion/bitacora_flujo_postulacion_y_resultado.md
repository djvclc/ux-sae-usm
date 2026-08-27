# Bitácora de decisiones — flujo de postulación y paso de resultado

**Creado:** 2026-08-26
**Ámbito:** `sae-react/src/pages/PostulacionPage.jsx` (flujo `/postulacion`, 3 pasos) y el paso de resultado inmediato que enlaza a `/seguimiento` (`SeguimientoPage.jsx`).
**Mantenido por:** `bitacora-agent` (ver `.claude/agents/bitacora-agent.md`). Actualizar **cada vez** que se toca el flujo o el paso de resultado, en la misma sesión del cambio.

---

## 1. Para qué existe este archivo

La memoria de título todavía no redacta los capítulos que dependen del prototipo (4 resultados, 5 discusión, 6 conclusiones) porque falta terminar el desarrollo del flujo de postulación y ejecutar la prueba de usabilidad. Cuando llegue ese momento, cada decisión de diseño del flujo tendrá que quedar **justificada por una fuente**, no por criterio propio (regla 3 de `CLAUDE.md`: no inventar; regla de honestidad epistémica de la memoria).

Esta bitácora es el registro único de esa trazabilidad: **qué se cambió en el flujo → qué guía o estudio lo fundamenta → en qué capítulo de la memoria se escribe → si está validado (`npm run lint` / `npm run build`)**. Sirve para que, al escribir, no se pierda ningún detalle ni haya que reconstruir el "por qué" desde el código.

**Regla de honestidad de esta bitácora:** si un cambio del flujo **no** tiene fundamento en una guía o estudio, se registra igual y se marca explícitamente `⚠ SIN FUNDAMENTO DOCUMENTADO`. No se inventa una cita a posteriori. Algunos cambios de S22 nacieron de la auditoría de fidelidad (`analisis_flujo_postulacion.md`, 2026-08-04) y no de las guías de UX-IA (`investigacion_ux_guide_ai_systems.md`, 2026-08-13); en esos casos se distingue **fundamento de origen** (lo que motivó el cambio) de **mapeo a guía** (la guía de Microsoft/Google con la que el cambio es coherente y bajo la cual se puede argumentar en la memoria).

---

## 2. Marco de referencia (las "guías investigadas")

Documento base: **`docs/investigacion/investigacion_ux_guide_ai_systems.md`** (2026-08-13). Resume:

| Sigla en esta bitácora | Fuente | Uso |
|---|---|---|
| **HAX G1…G18** | Microsoft *Guidelines for Human-AI Interaction* (HAX Toolkit, CHI 2019) — 18 guías en 4 momentos | Cada guía citable por número. Las más usadas en el flujo: G1 (qué puede hacer el sistema), G2 (qué tan bien lo hace), G4 (info contextualmente relevante), G5/G6 (normas sociales / sesgos), G10 (delimitar ante duda), G11 (por qué el sistema hizo lo que hizo), G16 (comunicar consecuencias de las acciones del usuario) |
| **PAIR-ET** | Google *People + AI Guidebook*, capítulo "Explainability + Trust" | Conceptos: calibrar la confianza (no maximizarla); explicaciones parciales; explicación general del sistema vs. específica del resultado; visualización de confianza/certeza (el número presupone alfabetización probabilística); gestionar la influencia en las decisiones del usuario (confianza engañosa induce acciones no deseadas) |
| **NNG-XAI** | Nielsen Norman Group, "Explainable AI in Chat Interfaces" (dic. 2025) | Ubicación visible de avisos (no en pie ni tras ícono); lenguaje accionable y no genérico; evitar lenguaje antropomórfico al describir cómo "decide" el sistema |
| **BROOK** | Brookings — Kasman & Valant, "The opportunities and risks of K-12 student placement algorithms" (2019) | Comunicar **qué NO puede hacer** el sistema (no crea cupos, no garantiza primera preferencia); el mayor riesgo es de percepción, no técnico; videos animados para explicar el algoritmo |
| **RISK-NUM** | Comunicación de riesgo para baja numeracidad (Max Planck — icon arrays; arXiv 2408.12365) | Formato de frecuencia ("X de cada 100") > porcentaje puro; icon arrays / barras proporcionales |
| **FORM-MS** | Buenas prácticas de formularios multipaso 2026 (WeWeb; Ventureharbour) | Indicador de progreso (−20–25 % abandono); guardado/reanudación explícitos; volver a cualquier paso sin perder datos; validación en tiempo real |

Documentos previos que también fundamentan el flujo (fidelidad y algoritmo, no UX-IA):

- **`analisis_flujo_postulacion.md`** (2026-08-04) — auditoría de fidelidad, errores E1–E6, benchmark NYC MySchools, plan en 3 fases. Origen de los códigos `S22-1…S22-15`.
- **`investigacion_algoritmo_sae.md`** — mecánica del algoritmo DA, orden real de prioridades (PIE → hermanos → 15 % → funcionario → exalumno), desempate por lotería por colegio, strategy-proofness (sec. 4.2).
- **`investigacion_paso_a_paso_sae.md`** — calendario Admisión 2027, reglas oficiales de cada etapa.
- **`caso_estudio_prueba_usabilidad_postulacion.md`** — caso Muñoz González; sec. 3.1 define la distinción **riesgo real / falso riesgo estratégico / consejo complementario** que es el eje del texto de advertencia del paso 3.

---

## 3. Mapa a la memoria

Dónde se escribe cada tipo de decisión del flujo cuando se redacten los capítulos:

| Capítulo | Qué del flujo va aquí |
|---|---|
| **Cap. 2 — Marco teórico** | Presentación de HAX y PAIR-ET como marcos de diseño de interacción humano-IA. **Decisión abierta:** citarlos directamente (sec. 2.x nuevo) o dejarlos solo como respaldo de diseño en el cap. 3. Reordenar/destacar de la revisión de 96 papers los que tratan formularios multipaso y puntos de decisión irreversibles. |
| **Cap. 3 — Metodología** | Justificación de cada decisión de diseño del flujo (esta bitácora es el insumo directo). Encuadre "riesgo real vs. falso riesgo estratégico". Metodología de la prueba de usabilidad (N=8, tareas dirigidas centradas en completar una postulación, guion de moderador, instrumento Likert de 11 ítems + línea base). |
| **Cap. 4 — Resultados** | Correcciones de fidelidad E1–E6 como mejoras medibles (¿el usuario entiende ahora el tope de colegios, el desempate, el orden de prioridades?). Resultados de la prueba de usabilidad, con detalle del flujo de postulación y resumen del resto. |
| **Cap. 5 — Discusión** | Hallazgos de postulación contra literatura de formularios de decisión multipaso y transparencia algorítmica. Si el texto corregido del paso 3 desactiva o no el mito del riesgo estratégico (tarea 5 del caso de estudio). |
| **Cap. 6 — Conclusiones** | Qué queda fuera de alcance (vitrina, seguimiento como línea futura). Recomendaciones para implementación institucional. |

---

## 4. Registro de cambios

Formato de cada entrada: **ID · fecha · estado de validación**, luego qué se cambió, fundamento (origen + guía), archivo/ancla, capítulo de la memoria.

Estados de validación: `✅ lint+build OK` · `⏳ pendiente lint/build` · `— sin código (doc/decisión)`.

### 4.0 Verificación de validación global

`npm run lint` y `npm run build` corridos limpios el **2026-08-26** sobre el estado actual de `PostulacionPage.jsx` (incluye S22-1…S22-15, el refinamiento S22-14 del 2026-08-13 y el paso de resultado inmediato). Queda así resuelto el pendiente que arrastraban `CLAUDE.md` y `CONTEXTO_CLAUDE_CODE.md` secs. 15–16. **Toda entrada nueva vuelve a requerir su propia verificación.**

---

### Bloque A — Correcciones de fidelidad (S22-1 … S22-7)

Origen: `analisis_flujo_postulacion.md` sec. 2 (auditoría contra reglas oficiales). Mapeo a guía: mayormente HAX G1 (qué puede/no puede hacer el sistema) y G11 (por qué). Todas coherentes con el argumento de transparencia de la memoria: una herramienta que se presenta como transparente no puede contener afirmaciones falsas sobre el sistema real.

| ID | Cambio | Corrige | Fundamento origen | Mapeo a guía | Ancla | Cap. memoria |
|---|---|---|---|---|---|---|
| **S22-1** | La región pasa de restricción ("solo colegios de tu región") a filtro de exploración, con nota de que se puede postular a otras comunas y regiones | E1 | `analisis_flujo_postulacion.md` sec. 2 · "Paso a paso para postular" (sitio oficial) | HAX G1 | `PostulacionPage.jsx` `// S22-1` (~545) | 4 (medible: ¿el usuario cree que hay restricción regional?) |
| **S22-2** | Se elimina el tope duro de 8 colegios; sin límite, recomendación visible de al menos 6 + refuerzo positivo al alcanzarlos. Propagado a `InicioPage`, `ColegioPage`, `ComparadorPage`, `AlgoritmoPage`, `CalendarioPage`, `ChatAyuda`, `TourContext` | E2 | ídem · NYC MySchools sin límite desde 2024-25 | HAX G1 · FORM-MS (menos fricción artificial) | `// S22-2` (~800, ~947) | 4 |
| **S22-3** | Cierre real del Periodo Principal 2027: **27 de agosto, 14:00** (antes "30 de agosto") | E3 | Calendario oficial 2027 (`investigacion_paso_a_paso_sae.md`) | HAX G1, G2 | `// S22-3` (~995, ~1163) | 4 |
| **S22-4** | Resultados: rango real **15–21 de octubre de 2026** (antes "5 días hábiles para aceptar/rechazar", que no existe) | E4 | ídem | HAX G1 | `// S22-4` (~1113) | 4 |
| **S22-5** | Nota del sorteo reescrita: desempate aleatorio **por colegio** (lotería independiente en cada establecimiento), sin "certificado por MINEDUC" | E5 | `investigacion_algoritmo_sae.md` sec. 3.2 | HAX G11 · NNG-XAI (no antropomorfizar, describir la mecánica) | `// S22-5` (~788) | 3, 4 |
| **S22-6** | Prioridades presentadas según el procesamiento real: **PIE → hermanos → 15 % prioritarios → funcionario → exalumno**, aclarando que el 15 % es reserva de asientos, no un ranking 1–4 | E6 | `investigacion_algoritmo_sae.md` sec. 3.2 | HAX G4, G11 | `// S22-6` (~35, ~742) | 3, 4 |
| **S22-7** | Comprobante `.txt` descargable (folio, lista ordenada, fechas siguientes) + aviso "tu postulación es válida cuando descargas el comprobante" | (sitio oficial exige descarga) | `analisis_flujo_postulacion.md` sec. 2 | FORM-MS · HAX G16 | `// S22-7` (~332, ~1141) | 4 |

**Para la memoria:** E1–E6 son el material más concreto del cap. 4 — son afirmaciones falsas del prototipo previo, corregidas y **medibles** en la prueba (el instrumento Likert C1–C4 y la observación de la tarea 5 tocan directamente el tope de colegios, el desempate y el orden de prioridades).

---

### Bloque B — Flujo y accesibilidad (S22-8 … S22-13)

| ID | Cambio | Fundamento origen | Mapeo a guía | Ancla | Cap. memoria |
|---|---|---|---|---|---|
| **S22-8** | Reordenamiento de la lista por arrastrar y soltar (HTML5 nativo, sin librerías) + botones ↑↓ como alternativa + anuncio `aria-live` del nuevo orden | NYC MySchools (drag-and-drop) · WCAG AA · accesibilidad de formularios multipaso (anunciar cambios, mantener foco) | FORM-MS · HAX G3/G4 | `// S22-8` (~263, ~285, ~390, ~885) | 3 (decisión de diseño), 4 (usabilidad del reordenamiento en móvil) |
| **S22-9** | Guardado visible del borrador: indicador "Borrador guardado" en cada acción + aviso de reanudación al volver con borrador | FORM-MS (guardado/reanudación explícitos, −20–25 % abandono) · NNG-XAI (visibilidad) | FORM-MS | `// S22-9` (~231, ~261, ~267, ~871) | 3 |
| **S22-10** | Paso 3 con enlaces "Editar" por sección (identificación / prioridades / lista) que vuelven al paso sin perder estado | FORM-MS (volver a cualquier paso sin perder datos — fallo común) · benchmark sec. 3.3 | FORM-MS · PAIR-ET (explicaciones parciales: revisar sin rehacer) | `// S22-10` (~1000, ~1021, ~1043) | 3 |
| **S22-11** | `ColegioAnalisis`: se muestran **postulantes del año anterior y vacantes por nivel** (esquema v2 de `colegios.js`) como fundamento del % estimado, en vez de una probabilidad "mágica" | NYC MySchools (postulantes por cupo en el punto de decisión) · `analisis_flujo_postulacion.md` sec. 4 | **HAX G2** (de qué está hecha la estimación) · **PAIR-ET** (explicación específica del resultado) · RISK-NUM | `// S22-11` (~159, ~176) | 3, 4, 5 (dato crudo + % es el diferencial frente al sitio oficial) |
| **S22-12** | Confirmación explícita del nivel/curso antes de vincular al estudiante ("Verifica el curso: es el error más frecuente") | Prensa + página oficial de Postulación (el error de curso es la advertencia principal) · FORM-MS (validación en tiempo real) | FORM-MS · HAX G16 | `// S22-12` (~259, ~661) | 3, 4 |
| **S22-13** | Opción "¿Postulas a hermanos?" → postulación familiar en bloque simulada, con explicación del reordenamiento automático de preferencias del menor | Regla oficial "Postulación familiar en bloque" (ausente en el prototipo previo) · persona Daniela (>1 hijo) | HAX G1 · BROOK (gestión de expectativas) | `// S22-13` (~260, ~630) | 3, 4 |

---

### Bloque C — Diferenciales de transparencia (S22-14, S22-15)

| ID | Cambio | Fundamento origen | Mapeo a guía | Ancla | Cap. memoria |
|---|---|---|---|---|---|
| **S22-14** (versión original, 2026-08-04) | Paso 2: consejo "ordena por tu preferencia real — poner primero uno 'más fácil' no mejora tus opciones". Aviso si la lista tiene <6 opciones y todas de alta demanda | strategy-proofness del DA (`investigacion_algoritmo_sae.md` sec. 4.2) · `caso_estudio…` sec. 3.1 | **HAX G16** · **PAIR-ET** (gestionar la influencia en decisiones) · BROOK | `// S22-14` (~381, ~959, ~964) | 3, 5 |
| **S22-15** | Paso 3: bloque "¿Y si no quedo en ninguna?" con los dos casos (con/sin colegio de origen) + enlaces a `/proceso` | `analisis_flujo_postulacion.md` sec. 4 · BROOK (comunicar qué NO puede hacer el sistema, dirigir la frustración a la escasez de cupos y no al algoritmo) | **BROOK** · HAX G1 · gestión de expectativas | `// S22-15` (~1118) | 3, 5, 6 |

---

### Bloque D — Refinamiento S22-14 por las guías de UX-IA (2026-08-13)

Origen directo: **`investigacion_ux_guide_ai_systems.md` sec. 4 y sec. 8** (este bloque es el que nace de las guías, no de la auditoría de fidelidad). Comentario de trazabilidad en código: `S22-14 (refinamiento)`. No creó sección nueva del plan; no tocó la cifra 87/87.
Ancla: `PostulacionPage.jsx` `/* S22-14 (refinamiento… */` (~1060) y el bloque `resultado.detalles.map` que le sigue (~1084–1108).
Estado de validación: **✅ lint+build OK (2026-08-26)** (el 2026-08-13 quedó `⏳`; se resolvió en la verificación global 4.0).

| # | Cambio | Fundamento | Cap. memoria |
|---|---|---|---|
| **D1** | Se retira "considera ponerlo más abajo en tu lista" del texto de probabilidad baja. Era una contradicción interna real: el paso 2 dice "ordena por tu preferencia real" (correcto, strategy-proofness) y el paso 3 sugería lo contrario, reforzando el mito del riesgo estratégico que el caso Muñoz González busca detectar | `investigacion_ux_guide_ai_systems.md` sec. 4 (hallazgo) · **HAX G16** (comunicar consecuencias reales, no sugerir una acción basada en un mito) · **PAIR-ET** (confianza engañosa induce acción no deseada) | **3** (es el texto que la prueba evalúa) y **5** |
| **D2** | El texto de probabilidad baja separa el **dato que fundamenta el %** (demanda; y cuando hay datos de nivel: postulantes año anterior y rango de vacantes) de una **frase explícita e independiente**: "Cambiar el orden de este colegio en tu lista no cambia esta cifra ni tus chances en los demás — el sistema siempre evalúa según tu preferencia real." Riesgo real vs. falso riesgo estratégico, sin que la familia tenga que inferir la propiedad | **PAIR-ET** (explicación específica por resultado; evitar confianza engañosa) · **HAX G11** · `caso_estudio…` sec. 3.1 | **3**, **5** |
| **D3** | Formato de frecuencia ("de cada 100 postulantes con tu misma condición, aproximadamente X quedan asignados") extendido a los **tres** niveles de probabilidad (antes solo el alto lo tenía) | **RISK-NUM** (formato de frecuencia > porcentaje puro para baja numeracidad) · **PAIR-ET** (el número presupone alfabetización probabilística) | **3**, **4** |
| **D4** | Categoría cualitativa "Muy alta" / "🟢 Certeza muy alta… prácticamente asegurada" cuando la prioridad es hermano/a matriculado/a (nivel 1) y la probabilidad calculada es ≥90 %, en vez de solo el porcentaje puntual. PIE y continuidad de colegio de origen **no** se modelan como checkbox en este prototipo, así que no se les aplica esta categoría (documentado en el código) | **PAIR-ET** (mostrar "92 %" donde el usuario espera "asegurado" sugiere riesgo real donde no lo hay) | **3**, **5** |
| **D5** | Verificación (sin cambio de código) de que editar desde el paso 3 no descarta selecciones del paso 2. Confirmado por trazado: los botones "Editar" solo llaman `setPaso(1)`/`setPaso(2)`; ningún `useState` de datos se reinicia al cambiar de paso | **FORM-MS** sec. 7 (preservar datos hacia adelante al retroceder — fallo común) | 3 |

---

### Bloque E — Paso de resultado inmediato (2026-08-13)

Origen: reunión con el profesor guía del 2026-08-13 (`reunion_profesor_guia_2026-08-13.md`) — pedido de poder observar la reacción de la familia al resultado dentro de la misma sesión de prueba. En el sistema real el resultado tarda hasta octubre.
Ancla: `PostulacionPage.jsx`, bloque `confirmado` del paso 3 — `InfoBox` "Solo para esta prueba: mira tu resultado ahora" con `<Link to="/seguimiento">` (~1157–1188 en el diff del 2026-08-13).
Estado de validación: **✅ lint+build OK (2026-08-26)**.

| # | Aspecto | Detalle | Fundamento | Cap. memoria |
|---|---|---|---|---|
| **E1** | Enlace al resultado tras el comprobante | No se duplicó lógica: `SeguimientoPage.jsx` ya calcula y muestra el resultado completo (hero de asignación, explicación contextualizada, detalle por preferencia, aceptar/rechazar) desde el mismo `STORAGE_KEY` que `PostulacionPage` escribe al confirmar. Solo faltaba el enlace | **PAIR-ET** (explicación general del sistema vs. **específica del resultado** — la que más ayuda en el punto de decisión) · necesidad metodológica del caso de estudio (tarea 7) | 3, 4 |
| **E2** | Nota explícita de que es solo para la prueba | El `InfoBox` dice que en el proceso real el resultado tarda hasta octubre y que aquí se adelanta | **HAX G1** (qué puede/no puede hacer el sistema) · **BROOK** (gestión de expectativas) | 3 |
| **E3** | Explicación contextualizada "por qué te asignaron este colegio" (reutilizada de `SeguimientoPage.jsx`) | Es lo que el ítem Likert **C5** ("Entendí por qué el resultado que vi fue ese, y no otro") y **F5** miden en la tarea 7 | **PAIR-ET** (explicación específica del resultado) · **BROOK** (explicación accesible del algoritmo) | 3, 4, 5 |
| **E4** | Marcado como "extensión fuera de la matriz del plan de mejora (S1–S22)" | No se inventó un código `S<sección>-<inciso>`; **no se tocó la cifra 87/87** de la memoria. Decisión pendiente del usuario: formalizarlo como S23 en `plan_mejora_sae.md` o dejarlo como funcionalidad exclusiva de la prueba | regla 3 y 6 de `CLAUDE.md` | 3 (nota de alcance), 6 |

---

### Bloque F — Mantenimiento correctivo (no son cambios de diseño)

| ID | Fecha | Cambio | Naturaleza | Validación |
|---|---|---|---|---|
| **F-2026-08-05** | 2026-08-05 | `ColegioAnalisis` se saca de la columna central de la tarjeta (se comprimía a ~142 px en 375 px) y pasa a fila propia de ancho completo. Parte de la auditoría de overflow de las 13 rutas | Corrección de layout móvil (mobile-first 375 px), **sin fundamento en guía** — es cumplimiento del principio UI vigente del proyecto | ✅ lint+build OK (2026-08-05) |
| **F-2026-08-06** | 2026-08-06 | Paso 2: explicaciones de prioridades movidas de texto siempre visible a modal `<dialog>` accesible (`PrioridadModal`, botón "?"); `ColegioAnalisis` reducido a 4 datos; siglas PIE/SEP con `<abbr>` | Divulgación progresiva (principio vigente del proyecto, `NotasPage.jsx`; `feedback_sae_problemas.md` sec. 14e) · coherente con **PAIR-ET** (explicaciones parciales) | ✅ lint+build OK (2026-08-06) |

---

### Bloque G — Modelo de prioridad por colegio (refinamiento S22-11 · S22-6, 2026-08-26)

**Fundamento de origen:** fidelidad al algoritmo. `investigacion_algoritmo_sae.md` sec. 3.2 define la prioridad de hermanos como "postulantes con un hermano o hermana ya matriculado o admitido **en el establecimiento**" y la de funcionario como "hijos de trabajadores **del establecimiento**", y exige (sec. 3.2, párrafo de requisitos legales) que los desempates se sorteen "de forma independiente en cada colegio" — son prioridades específicas de establecimiento, no atributos globales del postulante. La única transversal es la cuota de estudiante prioritario (15 %). Verificado también contra sec. 4.2 (strategy-proofness / preferencias verdaderas). Segundo motivo: `caso_estudio_prueba_usabilidad_postulacion.md` sec. 3.1 y Tabla 1 — Colegio San Martín es el colegio-control "sin ningún vínculo (ni hermano, ni funcionario, ni exalumno, ni PIE)" y pierde su función de prueba si el prototipo, con el modelo global, le contagia la prioridad de hermano que la familia tiene en otro colegio.

Implementa el pendiente **P6** de la sec. 5 (gap de datos `funcionario`/`exalumno` en `colegios.js`). No creó sección del plan ni sumó punto: **87/87 intacto** (`plan_mejora_sae.md` e `incisos.js` sin cambios, confirmado). Comentarios de trazabilidad en código: `S22-11 (refinamiento)` y `S22-6`.
**Estado de validación:** ✅ lint+build OK (2026-08-26) — `npm run lint` y `npm run build` corridos en esta sesión sobre el estado con el cambio aplicado, ambos limpios (0 errores; `PostulacionPage` compila a 39.81 kB).
**Impacto en cifras de la memoria:** ninguno.

Qué cambió, en una frase: el modelo de prioridad pasa de **global** (`nivelPrioridad(perfil)`, único para toda la lista) a **por colegio** — `prioritario` sigue transversal; `hermano` (nivel 1), `funcionario` (nivel 3) y `exalumno` (nivel 4) se resuelven contra el colegio concreto donde la familia declara el vínculo. La tabla `probAsignacion` y el umbral `>= 65` no se tocaron; solo cambia a qué colegio se asocia cada nivel.

Verificación funcional (Node, code-agent): en el caso Muñoz González, Colegio San Martín pasa de nivel 1 (96 %) a nivel 2 ("Estudiante prioritario (15 %)", 90 %) — el bug del colegio-control queda corregido. Colegio Los Andes mantiene nivel 1 (hermano, 92 %).

| # | Cambio | Ancla | Mapeo a guía | Cap. memoria |
|---|---|---|---|---|
| **G1** | `nivelPrioridadEnColegio(perfil, colegioId)`: resuelve el mejor nivel entre `prioritario` transversal y las prioridades específicas declaradas para ese colegio. `calcularResultado`: cada entrada de `detalles[]` lleva su `nivel`/`prioridadLabel` por colegio; `resultado.nivel` de nivel superior pasa a ser valor representativo (el del colegio asignado). `nivelPrioridad` global se conserva como fallback. Exporta `PRIORIDADES_POR_COLEGIO` | `asignacion.js` `/* S22-11 (refinamiento) · S22-6 */` (~11, ~35) | **HAX G11** (la razón del número mostrado es ahora real y específica del colegio, no genérica — `investigacion_ux_guide_ai_systems.md` L39) · **PAIR-ET** (explicación específica del resultado vs. general del sistema — doc L53) | 3, 4 |
| **G2** | `colegios.js`: campo nuevo `casoPrioridades` en los 6 colegios del caso Muñoz González, mapeado por nombre desde la Tabla 1: Los Andes `['hermano']`, Villa del Sol `['funcionario']`, República de Chile `['exalumno']`, San Martín / Simón Bolívar / Los Quillayes `[]`. El array antiguo `prioritarios` (solo alimenta `ColegioPage`, nunca cableado al algoritmo) queda intacto | `colegios.js` `// S22-11 (refinamiento) · S22-6` (~4) | fidelidad (`caso_estudio…` Tabla 1) · **HAX G11** | 3, 4 |
| **G3** | `PostulacionPage.jsx`: estado `prioridadesPorColegio` + `perfilCompleto` (useMemo). Componente `PrioridadColegioControl` (chips `aria-pressed`, fila full-width, cambios anunciados por región `aria-live` `anuncioPrioridad`) por cada colegio de la lista en el paso 2. Pre-marcado desde `casoPrioridades` al agregar un colegio, solo entre las condiciones que la familia marcó; el usuario puede sobreescribir. `ColegioAnalisis` y el resumen del paso 3 muestran el % y la prioridad por colegio; el comprobante `.txt` lista la prioridad por colegio | `PostulacionPage.jsx` `// S22-11 (refinamiento)` (~170, ~287, ~316, ~400, ~1078) | **HAX G4** (info contextual por colegio en el punto de decisión) · **FORM-MS** (estado/validación visibles) · **RISK-NUM** (el % por colegio se apoya en el dato crudo del esquema v2) | 3, 4 |
| **G4** | Se reemplaza el texto ahora falso ("Tu prioridad se aplica a **todos** los colegios… No puedes tener distinta prioridad por colegio") por la explicación transversal (15 %) vs. específica (hermano/funcionario/exalumno). InfoBox nueva "¿Dónde tienes esa prioridad?" en el paso 2 | `PostulacionPage.jsx` `// S22-11 (refinamiento)` (~922, ~1180, ~1195) | **HAX G1** (qué hace / qué no hace el sistema) · **HAX G11** | 3, 4 |
| **G5** | La categoría cualitativa "certeza muy alta" de D4 (`d.nivel === 1 && d.prob >= 90`) ahora usa el nivel **por colegio**: solo aparece donde la prioridad de hermano/a aplica de verdad, no en toda la lista | `PostulacionPage.jsx` bloque `resultado.detalles.map` (~1215) | **PAIR-ET** (no mostrar "asegurado" donde sí hay riesgo real) — continuidad de D4 sobre el nuevo modelo | 3, 5 |
| **G6** | `SeguimientoPage.jsx`: `generarExplicacion` conmuta por `asignado.nivel` (nivel real en el colegio asignado) en vez de los booleanos globales del perfil; hero stat, "Prioridad aplicada" y detalle por preferencia coherentes | `SeguimientoPage.jsx` `S22-11 (refinamiento)` (~20, ~355) | **HAX G11** · **PAIR-ET** (explicación específica del resultado) | 3, 4, 5 |
| **G7** | `AlgoritmoPage.jsx`: sin cambio funcional (usa el fallback global, documentado en el código); `explicacionSim` conmuta por `asignado.nivel` para coherencia de redacción | `AlgoritmoPage.jsx` `S22-11 (refinamiento)` (~227, ~256) | — (mantenimiento de coherencia, sin fundamento en guía) | — |
| **G8** | `index.css`: `.post-prio-colegio` — fila full-width, paleta naranja Mineduc, `margin-left: 0` en < 480 px (mismo patrón anti-compresión a 375 px que `ColegioAnalisis`, cf. F-2026-08-05) | `index.css` `/* S22-11 (refinamiento) */` (~5840) | — (cumplimiento del principio UI mobile-first del proyecto, **sin fundamento en guía**) | — |

**Para la memoria (observación, no editar):** `caso_estudio_prueba_usabilidad_postulacion.md` sec. 5 y sec. 9 describen este gap de datos como pendiente abierto. Con este cambio queda **resuelto**, pero ese documento no se editó — actualizarlo es trabajo del `writing-agent` / decisión del usuario.

---

## 5. Pendientes propuestos por las guías (aún NO implementados)

De `investigacion_ux_guide_ai_systems.md` sec. 8 y observaciones sec. 2–sec. 3. (El gap de datos que figuraba aquí como **P6** se implementó el 2026-08-26 — ver Bloque G.) Estos son el insumo del "repaso punto a punto" para cerrar el desarrollo antes de la prueba.

| # | Pendiente | Fundamento | Prioridad sugerida | Bloquea la prueba |
|---|---|---|---|---|
| **P1** | Versión **visual** del formato de frecuencia (mini icon array o barra proporcional), no solo texto, en `ColegioAnalisis` y en la ficha de colegio. Los datos crudos ya existen (esquema v2) | RISK-NUM · PAIR-ET (visualización de confianza) | Alta | No, pero fortalece C2/J2 |
| **P2** | Primera pantalla de `/postulacion`: explicitar **antes de pedir datos** qué hace el algoritmo y qué no decide la familia (orden de prioridad legal, no "puntaje") | HAX G1 · sec. 2 | Media | No |
| **P3** | Auditar que **todos** los textos de advertencia de `ColegioAnalisis` sean accionables y no genéricos ("agrega al menos un colegio de demanda media o baja" > "esto es una estimación") | NNG-XAI · sec. 5 | Media | No |
| **P4** | Revisar que ningún aviso suene a juicio sobre la familia ("apuntó muy alto") ni que ningún dato mostrado refuerce estigmas socioeconómicos entre colegios de distinta categoría | HAX G5 / G6 | Media | Conviene resolver antes (sesgo observable en la prueba) |
| **P5** | Lenguaje de `AlgoSimuladorPasos` (en `/algoritmo`, no en el flujo, pero relacionado): describir el procesamiento en términos de reglas y datos, no de "elección" del sistema | NNG-XAI (antropomorfismo) · sec. 5 | Baja | No |
| **P6** | Evaluar mostrar **N-mejores alternativas** ("si no quedas aquí, tus siguientes opciones más probables son…") | PAIR-ET (patrón de alternativas) | Baja | No |

---

## 6. Decisiones abiertas del usuario

1. **¿El paso de resultado inmediato entra como S23 en `plan_mejora_sae.md`?** Mientras no se defina, queda como "extensión fuera de la matriz" y la cifra 87/87 de la memoria no se toca (Bloque E4).
2. **Cambio de foco de la memoria** (`plan_cambio_foco_postulacion.md`, 2026-08-08, no ejecutado): ¿se ajusta el subtítulo de la tesis hacia "flujo de postulación"? ¿Se reescriben los objetivos específicos 4 y 5 con la mención explícita? El objetivo general vigente sigue siendo el amplio.
3. **Citar HAX / PAIR-ET directamente en el cap. 2**, o dejarlos solo como respaldo de diseño en el cap. 3 (pregunta que quedó para la reunión con el profesor guía).
4. **Alta exigencia académica** (`caso_estudio…` sec. 4): ¿se aborda o queda fuera de alcance? Hoy ningún colegio del prototipo tiene esa modalidad.
5. **Comité de ética UTFSM:** ¿se requiere para la prueba aunque los datos sean ficticios?
6. **Variantes de grupo** en la prueba: ¿un solo grupo de 8 o subgrupos? (recomendación en el caso de estudio: un solo grupo).

---

## 7. Protocolo de actualización (para `bitacora-agent`)

1. Se dispara **después** de cualquier cambio a `PostulacionPage.jsx` (flujo) o a la parte de `SeguimientoPage.jsx` que consume el resultado de la postulación, y después de cambios de datos en `colegios.js`/`asignacion.js` que afecten el % estimado o las prioridades.
2. Para cada cambio, agregar fila/entrada en el Bloque correspondiente de sec. 4 con: **ID / código de trazabilidad**, fecha, qué se cambió (1–2 frases), **fundamento de origen**, **mapeo a guía** (sigla del sec. 2 + número o concepto), **ancla** (`archivo` + código `S..-..` o nº de línea aproximado), **capítulo(s) de la memoria**, **estado de validación**.
3. Si el cambio **no** tiene fundamento en una guía o estudio del sec. 2 o en los documentos previos listados, marcarlo `⚠ SIN FUNDAMENTO DOCUMENTADO` y avisar al usuario en el resumen. **No inventar la cita.**
4. Verificar el fundamento contra `investigacion_ux_guide_ai_systems.md` (no citar de memoria): la guía invocada debe decir efectivamente lo que se le atribuye.
5. Si un pendiente de sec. 5 se implementa, moverlo a sec. 4 (con su ID nuevo) y quitarlo de sec. 5. Si aparece un pendiente nuevo derivado de las guías, agregarlo a sec. 5.
6. Si el cambio altera una cifra citada en la memoria (`proyecto-tesis/`), o el estado 87/87, decirlo explícitamente en el resumen — no editar la memoria.
7. Registrar el estado real de `npm run lint` / `npm run build`: `✅` solo si se corrieron y pasaron en esta sesión; si no, `⏳ pendiente` con el motivo.
8. No tocar código, no tocar `proyecto-tesis/`, no tocar otros documentos de `docs/` salvo esta bitácora. Actualizar `CLAUDE.md` / `CONTEXTO_CLAUDE_CODE.md` es responsabilidad del `code-agent` que hizo el cambio, no de este agente.
