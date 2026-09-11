# F3 — Inventario de la capa de explicabilidad y diseño de la condición de control

**Fecha:** 2026-09-09
**Para qué:** el estudio comparativo (bitácora `bitacora_flujo_postulacion_y_resultado.md` §7) contrasta **A** (el prototipo, que explica el algoritmo apoyado en las guías) contra **B** (control, sin esa capa, anclado a la vitrina / SAE real). Este documento **identifica todos los componentes/piezas que aportan explicabilidad** y define, para cada uno, qué hace la condición B: **OCULTAR**, **SIMPLIFICAR** (dejar el núcleo de fidelidad, quitar la capa pedagógica) o **MANTENER** (es fidelidad al SAE real, va en ambas condiciones).

**Estado:** ✅ **implementado el 2026-09-09** (bitácora `bitacora_flujo_postulacion_y_resultado.md` §4, **Bloque V**). Este documento es el spec; el estado real por pieza está en §2. `npm run lint` / `build` / `test` (16/16) limpios; A y B verificados en navegador. Falta: writing-agent describe la condición B como implementada en §3.5.

**Invariante:** el resultado de asignación es **idéntico** en A y B — mismo `SEED_CASO = 20260903`, mismo `calcularResultado`. B **no recalcula nada distinto**; solo **no muestra** las probabilidades, las visualizaciones y las explicaciones. Todo lo que sea fidelidad al SAE real (recuperación de prioridades, gates de aceptación, dirección, comprobante, pantalla de resultado con aceptar/rechazar) se conserva en ambas.

---

## 1. Inventario por ubicación

Leyenda: **OCULTAR** = no se renderiza en B · **SIMPLIFICAR** = se renderiza una versión reducida · **MANTENER** = igual en A y B.

### 1.1 `/algoritmo` (`AlgoritmoPage.jsx`) + `AlgoSimuladorPasos.jsx`

| Pieza | Qué aporta | Guía | B |
|---|---|---|---|
| Página `/algoritmo` completa: diagrama de 4 pasos, simulador interactivo con perfil, "mitos frecuentes", videotutoriales, "Resultados de años anteriores" (Chart.js), contexto internacional | Explicación **general** del mecanismo (la capa más profunda de transparencia) | PAIR-ET (general vs. específica) · S15-1 | **OCULTAR** — ruta no accesible; el SAE real solo tiene FAQ genéricas |
| `AlgoSimuladorPasos` — reproducción paso a paso del recorrido de la lista | Visualiza el mecanismo DA sobre la lista del usuario | HAX G11 · NNG-XAI | **OCULTAR** (vive dentro de `/algoritmo`) |
| Ítem de Navbar **"El sistema"** → `/algoritmo` (`Navbar.jsx`) | Acceso a la explicación | — | **OCULTAR** el ítem del menú |
| Paso del **tour guiado** que lleva a `/algoritmo` (`TourContext.jsx`) | — | — | **OCULTAR** ese paso (o desactivar el tour en B — el SAE real no tiene tour) |
| Quick card / enlace a `/algoritmo` en el hero de `/inicio` (`InicioPage.jsx:18`) | Acceso | — | **OCULTAR** ese acceso |

### 1.2 `/postulacion` — Paso 1 (Identifícate)

| Pieza (ancla) | Qué aporta | Guía | B |
|---|---|---|---|
| InfoBox **"Antes de empezar: cómo se decide tu resultado"** (`PostulacionPage.jsx:1162`, `⚖️`) — orden de la lista + prioridades legales + vacantes + "no hay puntaje, ni notas, ni mérito" + enlace `/algoritmo` | Encuadre del algoritmo **antes de pedir datos** | P2 · HAX G1 | **OCULTAR** |
| Panel **`CondicionesDetectadas`** ("Esto es lo que el sistema ya sabe de tu hijo/a", `:223`, `:1300`) — SEP, PIE, vínculos por colegio, con su procedencia | El SAE real **recupera** estas condiciones, no las pregunta → es **fidelidad** | HAX G1/G4 · fidelidad | **MANTENER**. Ajuste: la línea del PIE dice "todavía no se refleja en el porcentaje estimado" → en B no hay `%`, reformular a "se muestra como información". |
| Casilla "Declaro ser apoderado/a legal" · bloque de **dirección de residencia** · confirmación explícita de **nivel** ("Verifica el curso") · **postulación en bloque** del hermano/a · aviso "solo postula si necesitas cambiar de colegio" (brecha D) | Fidelidad al flujo oficial (video MINEDUC) | HAX G1/G16 · fidelidad | **MANTENER** |

### 1.3 `/postulacion` — Paso 2 (Tus colegios)

| Pieza (ancla) | Qué aporta | Guía | B |
|---|---|---|---|
| **`ColegioAnalisis`** (`:647`) — por colegio: demanda, vacantes por nivel, postulantes del año anterior, "tu prioridad aquí", **`{prob}% estimado`**, **`ProbabilidadVisual`** (barra "X de cada 100"), categoría cualitativa (alta/media/baja/"certeza muy alta") | Datos crudos (fidelidad, la vitrina los muestra) **+** su interpretación probabilística (explicabilidad) | HAX G2/G4 · RISK-NUM | **SIMPLIFICAR**: dejar demanda / vacantes por nivel / postulantes año anterior / prioridad detectada. **Quitar** `{prob}% estimado`, `ProbabilidadVisual` y la categoría cualitativa. |
| **`ProbabilidadVisual`** (`components/ProbabilidadVisual.jsx`, import `:11`) — barra proporcional / icon array 10×10, "N de cada 100" | Comunicación visual de la probabilidad | RISK-NUM · PAIR-ET | **OCULTAR** (todos los usos) |
| **`ResultadoProvisional`** — "¿Qué hace el orden de tu lista?" (`:566`, render `:2055`) | Muestra la consecuencia del orden (en cuál preferencia quedas) + strategy-proofness | HAX G16 · PAIR-ET | **OCULTAR** — no existe en el SAE real (anotado en el comentario del componente) |
| **`PrioridadModal` / `PRIORIDADES_INFO`** (`:141`, `:271`, botón "?" `:475`) — "¿qué es esta prioridad? qué implica, ejemplo con cifras" | Definición **+** ejemplo pedagógico con porcentajes | HAX G4 · divulgación progresiva | **SIMPLIFICAR**: definición corta de cada criterio (el SAE real las describe). **Quitar** los ejemplos con `%` ("por tu prioridad de hermano tu probabilidad sube a ~90 %"). |
| InfoBox **"¿En qué orden se revisan las prioridades?"** (`:1859`, `🧮`) | Lista legal PIE→hermanos→15 %→funcionario→exalumno + desarrollo | HAX G4/G11 | **SIMPLIFICAR** a la lista legal escueta, o **OCULTAR** si `CondicionesDetectadas` ya la cubre |
| InfoBox **"Consejo: ordena por tu preferencia real"** (`:2072`, `🧠`, S22-14) | Encuadre de strategy-proofness | HAX G16 · PAIR-ET | **OCULTAR** |
| Aviso de **lista corta / de alta demanda** (S22-14, mismo bloque) | "incluye al menos 6" (consejo oficial) **+** el porqué en términos de probabilidad | BROOK · NNG-XAI | **SIMPLIFICAR**: dejar "incluye al menos 6, agrega alguno de demanda media o baja" (es recomendación oficial). Quitar el fraseo probabilístico. |
| `PrioridadColegioControl` en modo **`soloDeteccion`** ("el sistema lo detecta, no lo pregunta") — "✓ hermano/a verificado…" / "No detectamos ningún vínculo… tu cupo depende de cuántas familias pidan este colegio y de las vacantes" | La **detección** es fidelidad; la frase explicativa del "por qué" es capa pedagógica | HAX G1 · fidelidad | **MANTENER** la detección de solo lectura. Recortar la frase "tu cupo depende de cuántas familias…" (deja el hecho: "sin vínculo con este colegio"). |
| Modal de **dos aceptaciones** al agregar un colegio (jornada + PEI/reglamento) | Fidelidad (video MINEDUC, brecha C) | HAX G16 · fidelidad | **MANTENER** |

### 1.4 `/postulacion` — Paso 3 (Confirma)

| Pieza (ancla) | Qué aporta | Guía | B |
|---|---|---|---|
| **`ResultadoProvisional`** otra vez (`:2189`) | ídem 1.3 | HAX G16 | **OCULTAR** |
| Bloque de **explicación por colegio** en el resumen (`:~2251`, `tut-prob`) — "🟢 Certeza muy alta / 🔴 Probabilidad baja… N de cada 100… Cambiar el orden no cambia esta cifra…" | Categorías cualitativas + frecuencia + strategy-proofness por colegio | RISK-NUM · PAIR-ET · HAX G16 | **OCULTAR** |
| InfoBox **"prioridades… valen solo en el colegio… por eso el porcentaje estimado puede cambiar"** (`:2186`) | 1.ª mitad = fidelidad (dónde vale un vínculo); 2.ª mitad = explica el `%` | HAX G1/G11 | **SIMPLIFICAR**: dejar "un vínculo vale solo en el colegio donde lo tienes; la cuota del 15 % vale en todos". Quitar "por eso el porcentaje estimado cambia". |
| Bloque **"¿Y si no quedo en ninguna?"** (S22-15) — colegio de origen, listas de espera, Periodo Complementario | Información del **proceso real**, no del algoritmo | BROOK · fidelidad | **MANTENER** |
| **Comprobante `.txt`** descargable (folio, lista, fechas). Nota: hoy incluye `estadoLabel` por colegio | Fidelidad (el SAE real exige descargar el comprobante) | FORM-MS · fidelidad | **MANTENER** el comprobante. Quitar del `.txt` el estado explicativo por colegio si en B no se muestra en pantalla. |
| **Paso de "resultado inmediato"** — InfoBox "Solo para esta prueba: mira tu resultado ahora" + enlace a `/seguimiento` | **Logística de la prueba** (en el SAE real el resultado tarda meses), no explicabilidad | necesidad metodológica | **MANTENER en ambas** (el `/seguimiento` que abre difiere, ver 1.5) |

### 1.5 `/seguimiento` (`SeguimientoPage.jsx`)

| Pieza (ancla) | Qué aporta | Guía | B |
|---|---|---|---|
| Tarjeta **"¿Por qué te asignaron este colegio?"** (`generarExplicacion`, render `:378`) — toda la explicación §3.2 (por qué no San Martín, "de cada 100", desempate como trato igual, BROOK "no crea cupos") | Explicación **específica del resultado** — el corazón de la condición A | HAX G11 · PAIR-ET · BROOK · RISK-NUM | **OCULTAR la tarjeta completa** |
| Tarjeta **"¿Qué significa no quedar en tu primera opción?"** (`:466`) — incl. párrafo de strategy-proofness | Refuerzo de comprensión / justicia | PAIR-ET · `§4.2` DA | **OCULTAR** |
| Hero stat **"Probabilidad {asignado.prob}%"** (`:294`) | La probabilidad del colegio asignado | RISK-NUM | **OCULTAR** ese stat (dejar Prioridad / Demanda / Comprobante). El SAE real no muestra probabilidad en el resultado. |
| **"Detalle por preferencia"** — columna **`{d.prob}%`** (`:426`) + **`estadoLabel`** ("🟡 Prioridad insuficiente", "🔴 Sin cupos", "⏭ No evaluado", `:121`, `:421`) | Desglose probabilístico + diagnóstico por preferencia | RISK-NUM · HAX G11 | **SIMPLIFICAR**: por preferencia, solo "Asignado" en la que corresponde (y nada / "No asignado" en el resto). Quitar la columna `%` y las etiquetas de estado. El SAE real muestra en qué preferencia quedaste, no un desglose. |
| Timeline de 4 etapas · hero con nombre/dirección/ilustración del colegio asignado · botones **aceptar / rechazar / lista de espera** · comprobante · acciones (calendario, ficha) | Pantalla de **resultado del SAE real** | S15-4/5 · fidelidad | **MANTENER** |
| Enlace "¿Cómo funciona?" → `/algoritmo` en el estado vacío (`:214`) | Acceso a la explicación | — | **OCULTAR** el enlace |

### 1.6 `/colegio` (`ColegioPage.jsx`) — ficha

| Pieza (ancla) | Qué aporta | Guía | B |
|---|---|---|---|
| Bloque **`.probviz-block` "Si postulas sin ninguna prioridad"** (`:379`) — `ProbabilidadVisual` icon array + `probabilidadCupo(…, TRAMO_SIN_PRIORIDAD)` + enlace `/algoritmo` | Estimación de probabilidad de cupo en la ficha | RISK-NUM · PAIR-ET | **OCULTAR** el bloque completo (la vitrina real no estima probabilidad de cupo) |
| Enlaces **"Ver cómo funciona la asignación →"** / **"simulador del algoritmo"** (`:390`, `:400`) | Acceso a la explicación | — | **OCULTAR** los enlaces |
| Identidad institucional, vacantes como rango, postulantes año anterior, categoría de desempeño, SIMCE vs. GSE, descargables (PEI, reglamento), nota de procedencia | **La vitrina real** | fidelidad (`investigacion_vitrina_sae.md`) | **MANTENER** |

### 1.7 `/inicio`, `/proceso`, `/comparador`, `ChatAyuda`

| Pieza | Qué aporta | B |
|---|---|---|
| `/inicio` — selector "Ordenar por: … Menor demanda" + chip de demanda por card | "Demanda" es un proxy; la vitrina real ordena por matriculados / alumnos por curso. Es **borderline**, no es explicabilidad del algoritmo. | **MANTENER** (o cambiar la etiqueta a un criterio de la vitrina real si se quiere ser estricto) |
| `/proceso` (`ProcesoPage.jsx`) — 5 etapas, calendario 2027, reglas de alto riesgo, tabla Principal vs. Complementario, checklist de matrícula | Es el **"paso a paso" del sitio real** — fidelidad, no explicabilidad del algoritmo | **MANTENER**, pero **quitar los enlaces a `/algoritmo`** de la etapa "Asignación" (`:185`, `:591`) y dejar la narración oficial de 5 viñetas |
| `/comparador` — comparar 2–3 fichas lado a lado | Mejora de UX de comparación de fichas; no es transparencia del algoritmo | **MANTENER** (para no mutilar de más; decisión revisable) |
| `ChatAyuda` — 8 FAQ | El SAE real tiene FAQ; algunas explican el mecanismo | **SIMPLIFICAR**: conservar las de proceso/fechas/documentos; revisar las que explican el algoritmo. Impacto menor. |
| `/notas` (`NotasPage.jsx`) | Página interna, fuera del flujo de usuario | irrelevante |

---

## 2. Resumen por decisión

> **Estado de implementación (2026-09-09, Bloque V):** todo lo de abajo está **cableado** vía el contexto `ModoEstudioContext` (`esControl`), salvo dos ajustes respecto del plan:
> - **`ChatAyuda` → MANTENER** (no "SIMPLIFICAR"): el FAQ describe el SAE real en términos neutros, es contenido que la vitrina oficial también tiene; se deja idéntico en A y B para no empobrecer el control.
> - **Recortes parciales, no totales:** de la InfoBox "¿en qué orden se revisan las prioridades?" se oculta solo el 2.º `<p>` (la elaboración "ojo: el 15 %…"); la **lista legal** PIE→hermanos→15 %→funcionario→exalumno se mantiene (el SAE real la publica). De "prioridades valen solo en el colegio…" se oculta solo la coletilla "por eso el porcentaje estimado puede cambiar".
> - **Sin tocar (se mantuvieron como en A):** `/comparador`, `/inicio` "Ordenar por: demanda", `PrioridadModal` / `PRIORIDADES_INFO`, la frase "sin vínculo con este colegio" de `PrioridadColegioControl`, el aviso de lista corta. Son borderline (fidelidad discutible) y su recorte agregaba riesgo sin beneficio claro para el contraste. El grueso de la capa pedagógica (todo lo probabilístico, `/algoritmo`, `ResultadoProvisional`, `generarExplicacion`, los InfoBox de encuadre del algoritmo) **sí** se oculta. Revisable si el contraste A/B resulta débil en el piloto.
>
> Mecanismo: `?modo=control` / `?modo=full` + `sessionStorage['sae_modo_estudio']` + pantalla `/estudio` para el moderador (`condicionDe(n)`: impares → A, pares → B). Resultado de asignación **idéntico** en A y B.

**OCULTAR (explicabilidad pura, sin equivalente en el SAE real):**
`/algoritmo` + `AlgoSimuladorPasos` + su acceso en Navbar/tour/quick-card · `ResultadoProvisional` (pasos 2 y 3) · `ProbabilidadVisual` (todos los usos) · todo `%` / "de cada 100" del flujo y de `/seguimiento` (chip de `ColegioAnalisis`, bloque `tut-prob` del paso 3, hero stat de `/seguimiento`, columna del "detalle por preferencia") · `generarExplicacion` — las dos tarjetas de `/seguimiento` · InfoBox "cómo se decide tu resultado" (paso 1) · InfoBox "Consejo: ordena por tu preferencia real" (paso 2) · `.probviz-block` de `/colegio` · todos los enlaces a `/algoritmo`.

**SIMPLIFICAR (dejar el núcleo de fidelidad, quitar la capa pedagógica):**
`ColegioAnalisis` → demanda/vacantes/postulantes/prioridad, sin %/visual/categoría · `PrioridadModal`/`PRIORIDADES_INFO` → definición corta, sin ejemplos con cifras · InfoBox "¿en qué orden se revisan las prioridades?" → lista legal escueta · aviso de lista corta → "al menos 6" sin el porqué probabilístico · `PrioridadColegioControl` `soloDeteccion` → deja "sin vínculo", quita "tu cupo depende de…" · InfoBox "prioridades valen solo en el colegio…" → deja la 1.ª mitad · "Detalle por preferencia" de `/seguimiento` → quita `%` y etiquetas de estado · `ChatAyuda` → curar FAQ · comprobante `.txt` → sin estado explicativo por colegio.

**MANTENER (fidelidad al SAE real, en A y en B):**
`CondicionesDetectadas` · prioridad por colegio de solo lectura (detección) · gates de aceptación (jornada/PEI) · dirección de residencia · casilla apoderado/a · confirmación de nivel · postulación en bloque · aviso de pérdida de cupo (brecha D) · bloque "¿Y si no quedo en ninguna?" (S22-15) · comprobante descargable · `/proceso` (sin enlaces a `/algoritmo`) · calendario · `/seguimiento` (timeline, hero del colegio, aceptar/rechazar/lista de espera, acciones) · ficha de `/colegio` (sin `.probviz-block`) · `/comparador` · el paso de resultado inmediato (logística de la prueba).

---

## 3. Enfoque técnico (implementado — Bloque V)

**Elegido (era el recomendado):** contexto `ModoEstudioContext` que expone `esControl: boolean`, leído de un **query param** `?modo=control` y fijado en `sessionStorage['sae_modo_estudio']` para que persista durante la navegación. Cada pieza del inventario consulta `useModoEstudio()` para renderizar A o B / ocultarse. Una sola base de código → no se puede desincronizar A y B por accidente; el guardarraíl de tests sigue cubriendo `asignacion.js` (idéntico en ambas).

**Operación en terreno:** pantalla `/estudio` (`EstudioPage.jsx`) donde el moderador ingresa el **número de participante**; `condicionDe(n)` asigna A/B por paridad (impares → A, pares → B; se cambia ahí si se estratifica por la covariable de experiencia previa), fija el flag con `fijarCondicion` (que además limpia `sae_react_postulacion` / `sae_react_perfil`) y redirige a `/` **sin query** (recarga completa). El participante nunca ve que hay dos versiones ni "control" en la barra.

**No por URL:** la lista de 6 colegios y su orden se entregan **en papel** (D1) — el participante hace el acto de agregarlos; no se pre-siembran.

**Alternativas descartadas:** ruta paralela `/postulacion-control` (duplica JSX, riesgo de desincronía); build separado (dos artefactos que mantener).

**Ejecutado:** `asignacion.js` / `simulacionSae.js` **no se tocaron**. Archivos nuevos: `context/ModoEstudioContext.jsx`, `pages/EstudioPage.jsx`. Cableado de `esControl` en `App`, `Navbar`, `AlgoritmoPage`, `InicioPage`, `ProcesoPage`, `TourContext` + `GuidedTour`, `PostulacionPage`, `SeguimientoPage`, `ColegioPage`.

---

## 4. Verificación de que el control es un proxy justo (bitácora §7.3, Cuidado 1)

El control **no** debe ser una versión mutilada a propósito. Chequeo antes de ejecutar el estudio: recorrer B de principio a fin y confirmar que **todo lo que hay** corresponde a algo que el SAE real / la vitrina real efectivamente tiene (`investigacion_vitrina_sae.md`, `analisis_video_paso_a_paso_sae.md`, `investigacion_paso_a_paso_sae.md`). Si en B falta algo que el SAE real sí da (p. ej. la descripción de los criterios de prioridad), es un error de la condición de control, no una feature de A.

**Parcialmente verificado (2026-09-09, Bloque V):** se recorrieron en navegador `/` (pasos rápidos, Navbar), `/algoritmo` (redirige a `/`), el tour (8 pasos, sin `/algoritmo`), `/postulacion` paso 1 y `/estudio`. La **lista legal de prioridades se conserva** en B (solo se recorta la elaboración probabilística). **Pendiente antes del piloto:** recorrido completo de B end-to-end en 375 px con el caso canónico, confirmando que la pantalla de resultado (`/seguimiento` sin `generarExplicacion` ni `%`) sigue siendo comprensible por sí sola.
