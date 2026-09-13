# Contexto para Claude Code — Proyecto SAE UX
**Fecha:** 2026-09-13 (módulo de verificación del hermano/a unificado con el del/de la estudiante — ver §35; enriquecimiento de la ficha de resultado `/seguimiento` — §34; calibración de bandas — §33; F3 / modo control — §32)  
**Estado del proyecto:** v4.5. Matriz `plan_mejora_sae.md`: 102 filas, 4 no aplican → **98 requisitos aplicables** abordados a nivel de código (la cifra histórica "87/87 (100%)" no era reproducible — ver §29 y la nota de integridad del plan).  
**Directorio principal:** `USM/sae-react/`

---

## 1. Qué es este proyecto

Prototipo web interactivo React que mejora la experiencia de usuario del **Sistema de Admisión Escolar (SAE)** del Mineduc Chile. Está fundamentado en:

- Evaluación heurística del SAE real (51-61% de cumplimiento) — `Informe Evaluación de calidad web SAE (1).pdf`
- Revisión sistemática de 96 papers sobre transparencia algorítmica — `algorithm_transparency_literature_review (1).md`
- Principios de divulgación progresiva, explicabilidad contextualizada y controles interactivos

**No es un proyecto académico teórico** — es un prototipo funcional navegable que demuestra cómo debería verse el SAE mejorado.

---

## 2. Stack técnico

```
sae-react/
├── src/
│   ├── App.jsx              # Router, ErrorBoundary, SEO dinámico, lazy loading
│   ├── index.css            # Todos los estilos (CSS custom properties, mobile-first)
│   ├── pages/               # Una página por ruta
│   │   ├── InicioPage.jsx       # Hero + buscador con autocompletado + cards
│   │   ├── AlgoritmoPage.jsx    # 4 pasos + simulador + mitos frecuentes + videos
│   │   ├── CalendarioPage.jsx   # Línea de tiempo del proceso SAE
│   │   ├── ColegioPage.jsx      # Ficha ampliada con SIMCE + NEE + docentes
│   │   ├── PostulacionPage.jsx  # Flujo 3 pasos con ClaveÚnica + validación RUT
│   │   ├── SeguimientoPage.jsx  # Estado postulación + resultado + comprobante
│   │   ├── PerfilPage.jsx       # Fuente única de datos del estudiante (nombre, RUT, nivel, condición SEP) — ver sección 21
│   │   ├── CumplimientoPage.jsx # Página interna: matriz de estado del plan (no mostrar al usuario)
│   │   ├── RoadmapPage.jsx      # Página interna: roadmap de migración (no mostrar al usuario)
│   │   ├── NotFoundPage.jsx     # 404 personalizado
│   │   ├── ComparadorPage.jsx   # Comparador de 2-3 colegios (tabla desktop / cards móvil)
│   │   └── NotasPage.jsx        # Página interna: trazabilidad diseño ↔ literatura (96 papers)
│   ├── components/
│   │   ├── Navbar.jsx           # Navegación + hamburger mobile + NavLink activo
│   │   ├── Footer.jsx           # Canales de contacto SAE + OIRS
│   │   ├── ChatAyuda.jsx        # Chat flotante con 8 FAQ predefinidas
│   │   ├── GuidedTour.jsx       # Tour guiado paso a paso por la interfaz
│   │   ├── SchoolIllustration.jsx # SVG generado por nombre (reemplaza fotos)
│   │   ├── ScrollToTop.jsx      # Scroll al tope en cada cambio de ruta (montado en App.jsx)
│   │   └── TextSizeBar.jsx      # Control global Normal/Grande de tamaño de fuente
│   ├── context/
│   │   ├── TextSizeContext.jsx  # Provider de tamaño de texto global
│   │   └── TourContext.jsx      # Estado y pasos del tour guiado
│   ├── data/
│   │   ├── colegios.js          # Catálogo de 6 colegios ficticios (esquema completo)
│   │   └── incisos.js           # Datos de cumplimiento del plan (CumplimientoPage)
│   └── utils/
│       └── asignacion.js        # Lógica del simulador: nivelPrioridad(), probAsignacion(), calcularResultado()
├── package.json             # React 19, Vite 8, Tailwind v4, Chart.js, shadcn/ui, lucide-react
└── vite.config.js           # Plugin React + Tailwind + alias @ → src/
```

**Dependencias clave:**
- React 19 + React Router DOM 7
- Tailwind CSS v4 (via `@tailwindcss/vite`, sintaxis diferente a v3)
- shadcn/ui (Base UI)
- Chart.js + react-chartjs-2
- Lucide React (iconos)
- Geist Variable (fuente)

**IMPORTANTE — Tailwind v4:** La sintaxis cambió. No uses `tailwind.config.js` — la configuración va en `index.css` con `@theme { --color-... }`. Tokens CSS se definen con `@theme`.

---

## 3. Estado actual — cobertura de las 22 categorías del plan a nivel de código

> **Conteo corregido el 2026-09-08 (§29 / T6):** la cifra "87/87 (100 %)" que este documento citaba **no era reproducible** desde `plan_mejora_sae.md` (102 filas numeradas; 4 no aplican → **98 requisitos aplicables**; varias filas ya estaban ⚠️/❌). Las menciones a "87/87" en las secciones 15–27 de más abajo son **históricas** (significaban "este cambio no tocó el conteo de la matriz" en su fecha) y se conservan como registro. Ver la "Nota sobre el conteo (2026-09-08)" de `plan_mejora_sae.md`.

El plan completo está en `plan_mejora_sae.md`. Resumen de lo que YA está hecho:

✅ **Completado (matriz original, 62 puntos):** buscador con autocompletado predictivo, módulo de algoritmo con simulador interactivo, ficha de colegio ampliada, flujo de postulación 3 pasos con ClaveÚnica, panel de seguimiento con resultado y comprobante descargable, chat de ayuda FAQ, control de tamaño de texto global, navegación accesible, SEO dinámico + Open Graph por ruta, contraste WCAG AAA, hamburger menu mobile, barras SIMCE adaptadas a móvil, ErrorBoundary, lazy loading en 11 rutas.

✅ **15.2 cerrado (2026-07-21):** sección "Resultados de años anteriores" con estadísticas ficticias y gráfico Chart.js en `AlgoritmoPage.jsx`.

✅ **S21 cerrada (2026-08-04, 10 puntos):** vista `/proceso` (`ProcesoPage.jsx`) con las 5 etapas del proceso, calendario 2027 accesible y reglas de alto riesgo.

✅ **S22 cerrada (2026-08-04, 15 puntos) + optimizada (2026-08-06):** rediseño del flujo de postulación (`PostulacionPage.jsx` reescrita): correcciones de fidelidad E1–E6 (región como filtro, sin tope de 8 colegios — recomendación de al menos 6 —, cierre 27 de agosto 14:00, resultados 15–21 de octubre, desempate aleatorio por colegio, orden real de prioridades PIE → hermanos → 15 % reserva → funcionario → exalumno), comprobante .txt descargable con folio/lista/fechas, drag-and-drop nativo + botones ↑↓ con `aria-live`, borrador visible con aviso de reanudación, enlaces "Editar" por sección en paso 3, análisis por colegio con postulantes del año anterior y vacantes por nivel (esquema v2), confirmación explícita del nivel, postulación en bloque simulada, consejo estratégico y bloque "¿Y si no quedo en ninguna?". El tope de 8 y las fechas erróneas se corrigieron también en `InicioPage`, `ColegioPage`, `ComparadorPage`, `AlgoritmoPage`, `CalendarioPage`, `ChatAyuda` y `TourContext`. **Optimización 2026-08-06:** aplicada divulgación progresiva a prioridades (Paso 2): explicaciones complejas trasladadas a modal HTML `<dialog>` accesible con botón "?" discreto; chipsen-textos reducidos de 4 párrafos a 1-2 líneas. ColegioAnalisis simplificado a datos esenciales (demanda, vacantes, postulantes, prioridad); tips redundantes consolidados en hint del picker. Siglas (PIE, SEP) ahora con `<abbr title="...">` accesible. Textos legibilidad mejorada (Spaulding ~95 → objetivo 80, nivel 6°).

✅ **Lint saneado (2026-08-04):** los 15 errores preexistentes de ESLint fueron corregidos (inicializadores perezosos de `useState` para cargas de localStorage, supresiones justificadas de react-refresh, `import.meta.dirname` en `vite.config.js`, variables sin uso eliminadas). `npm run lint`: 0 errores, 0 warnings.

⚠️ **No aplica al prototipo:**
- **8.2** — Cabeceras HTTP de seguridad (producción/Nginx, no afecta el prototipo local)

---

## 4. `/comparador` — IMPLEMENTADO (2026-07-21)

`src/pages/ComparadorPage.jsx` existe y está conectado en `App.jsx`. Permite seleccionar 2-3 colegios del catálogo y muestra tabla comparativa (distancia, vacantes, SIMCE vs. promedio comunal, docentes, NEE, jornada, demanda) con vista de cards apiladas en móvil. En el mismo ciclo se agregaron el **tour guiado** (`GuidedTour.jsx` + `TourContext.jsx`) y la página interna `/notas` (`NotasPage.jsx`, trazabilidad diseño ↔ literatura), y se rediseñó el flujo de `PostulacionPage.jsx`. `PlaceholderPage.jsx` quedó sin uso y fue movida a `archivo/sae-react-muertos/` (2026-07-29) junto con otros archivos sin referencias (App.css, ui/button.jsx, assets de plantilla, public/icons.svg).

---

## 5. Paleta de colores (CSS custom properties en index.css)

```css
--azul:       #0057B7   /* color primario institucional Mineduc */
--azul-claro: #E8F1FB   /* fondos de secciones */
--verde:      #1A7F37   /* confirmación / éxito */
--naranja:    #E07B00   /* alerta */
--rojo:       #C0392B   /* error */
--gris-texto: #333333   /* texto principal */
--gris-med:   #374151   /* texto secundario (8.3:1 sobre blanco — WCAG AAA) */
```

---

## 6. Persona usuaria (toda decisión de diseño la considera)

**Daniela González**, 35 años, Región Metropolitana.
- Dispositivo: **teléfono móvil** (acceso exclusivo o principal)
- Educación media completa, alfabetización digital básica-intermedia
- Percibe el SAE como una "tómbola" — necesita que le expliquen las reglas
- Postula a máximo 3 colegios, valora: seguridad, cercanía, prestigio
- Usa WhatsApp, Facebook, Instagram. No usa Twitter ni YouTube.

**Implicancia de diseño:** mobile-first siempre, lenguaje simple (nivel 6° básico), ninguna jerga técnica, frases ≤20 palabras.

---

## 7. Datos ficticios disponibles

`src/data/colegios.js` — 6 colegios con esquema completo:

| ID | Nombre | Comuna | Demanda |
|----|--------|--------|---------|
| 1 | Colegio Los Andes | La Florida | Alta |
| 2 | Colegio San Martín | Maipú | Alta (era Media hasta 2026-09-03 — "colegio en mente" del caso, ver sec. 25 / bitácora Bloque O) |
| 3 | Escuela República de Chile | La Florida | Baja |
| 4 | Liceo Técnico Simón Bolívar | Puente Alto | Media |
| 5 | Colegio Villa del Sol | Peñalolén | Alta |
| 6 | Escuela Básica Los Quillayes | La Florida | Media |

Cada colegio tiene (esquema v2 — 2026-07-30): nombre, rbd, director, dependencia, orientacion, dirección, comuna, distanciaBase, niveles, vacantes (array con { nivel, label, min, max, postulantesAnterior, jornada, copago }), simce, simceAnio, promedioComunal, gseComparacion, gseNumColegios, categoriaDesempeno, categoriaAnio, docentes, nee, seguridad, metodos, proyecto, demanda, prioritarios.

ATENCIÓN: el campo `jornada` ya NO es global; está por nivel dentro de `vacantes[n].jornada`. Para acceder a la jornada en páginas que solo muestran un valor, usar `c.vacantes[0]?.jornada`. El campo `totalVacantes()` ahora suma `v.max` (antes sumaba valores directos del objeto).

---

## 8. Lógica del simulador (src/utils/asignacion.js + src/utils/simulacionSae.js)

**Reescrito el 2026-09-03 (Bloque R). Ya NO hay tabla `probAsignacion` ni umbral 65.** La probabilidad se estima con Monte Carlo sobre una simulación DA-por-colegio.

```js
// src/utils/simulacionSae.js — el motor
PARAMS_POBLACION            // { pSep:0.55, pHermano:0.10, pFuncionario:0.02, pExalumno:0.03, cuotaSep:0.15 }
SEED_CASO = 20260903        // semilla del recorrido determinista del caso
ITERACIONES_MONTE_CARLO = 1000
mulberry32(seed)            // PRNG con semilla
tramoFamiliaEnColegio(perfil, colegioId) // → { esSep, general: 'hermano'|'funcionario'|'exalumno'|'sorteo' }
simularCupo(colegio, nivelAlumno, familiaTramo, rng)  // UN sorteo: fase 1 cuota SEP (15%) + fase 2 pozo general → { seated, ... }
probabilidadCupo(colegio, nivelAlumno, familiaTramo)  // Monte Carlo 1000 iter, seed fija por (colegio,nivel), cacheado → 0..1
TRAMO_SIN_PRIORIDAD        // { esSep: false, general: 'sorteo' }

// src/utils/asignacion.js — el orquestador (API estable para consumidores)
nivelPrioridad(perfil)                 // 1-5, solo para ETIQUETAS
nivelPrioridadEnColegio(perfil, id)    // 1-5, solo para ETIQUETAS
probPorcentaje(pRaw)                   // 0..1 → entero acotado a [1,99] (nunca 0% ni 100%)
calcularResultado(listaIds, perfil, nivelAlumno)
  // detalles[i].prob = Monte Carlo; asignado = recorrido determinista de la lista con SEED_CASO
  // → { asignado, detalles, nivel, prioridadLabel, error, sinAsignacionEnPreferencias }
```

Consumidores: `PostulacionPage.jsx` (pasa el nivel del estudiante), `ColegioPage.jsx` (nivel representativo del colegio). `AlgoritmoPage.jsx` (simulador genérico, nivel por defecto `'1° básico'`), `AlgoSimuladorPasos.jsx` y `SeguimientoPage.jsx` no cambiaron (misma forma de `resultado`, mismo vocabulario de `estado`).

---

## 9. Convenciones de código del proyecto

- **Español en UI, inglés en código** (nombres de variables, funciones, clases CSS en español descriptivo)
- **CSS classes** siguen convención BEM: `.card`, `.card__header`, `.card--destacado`
- **ARIA:** todos los elementos interactivos tienen `aria-label`, roles explícitos, navegación por teclado
- **Textos:** tuteo informal pero respetuoso. "el/la apoderado/a", "la o el estudiante" (lenguaje inclusivo)
- **Siglas:** siempre con `<abbr title="...">` la primera vez que aparecen (PIE, SEP, NEE, SIMCE)
- **Imágenes:** `alt` descriptivo en funcionales, `alt=""` en decorativas
- **`localStorage` sí se usa** (corregido 2026-08-04; esta nota decía lo contrario y estaba desactualizada): claves `sae_react_postulacion` (postulación confirmada), `sae_react_postulacion_draft_list` (borrador de lista compartido entre Inicio/Ficha/Comparador/Postulación), perfil y preferencia de tamaño de texto. Las cargas iniciales se hacen con inicializadores perezosos de `useState`, no con efectos.

---

## 10. Próximos pasos recomendados (en orden de prioridad)

Los puntos del plan están todos abordados a nivel de código (98 requisitos aplicables tras el conteo corregido del 2026-09-08 — ver §3 y §29). Queda trabajo de pulido opcional:

1. **Documentar cabeceras HTTP** en `vite.config.js` como comentario de producción (Nginx) — punto 8.2 (no aplica al prototipo, solo documentación).
2. **Marcar páginas internas** (`/cumplimiento`, `/roadmap`, `/notas`) con meta `noindex` — no son parte del flujo público.
3. **Sección de testimonios** en SeguimientoPage — 3 historias ficticias (ver `archivo/CLAUDE_v2.md` sección 4H).
4. **Gráfico radar** en ColegioPage con Chart.js (SIMCE, NEE, Seguridad, Docentes, Proximidad).
5. **Progress ring SVG** para % docentes titulados en ColegioPage.
6. ~~Corregir 15 errores de lint preexistentes~~ — **hecho el 2026-08-04** (lint en 0 errores / 0 warnings).

## 11. Cómo correr el proyecto

```bash
cd sae-react
npm install
npm run dev    # abre en localhost:5173
npm run build  # build de producción en dist/
npm run lint   # validación obligatoria junto con build
```

---

## 12. Archivos de referencia importantes

| Archivo | Qué contiene |
|---------|-------------|
| `CLAUDE.md` | Instrucciones base del repo (subproyectos, reglas globales, agentes) |
| `.claude/agents/` | Agentes: `code-agent` (sae-react) y `writing-agent` (proyecto-tesis) |
| `docs/planificacion/plan_mejora_sae.md` | Matriz completa de 87 puntos con estado de cada uno |
| `docs/investigacion/feedback_sae_problemas.md` | Problemas originales extraídos del informe de calidad |
| `archivo/CLAUDE_v2.md` | Instrucciones para funcionalidades avanzadas (comparador, testimonios, radar) |
| `archivo/prototipo_SAE_mejora.html` | V1 HTML monolítico (baseline superado) |
| `archivo/prototipo_SAE_v2.html` | V2 HTML monolítico (baseline secundario) |

---

## 13. Notas críticas para evitar errores comunes

- **Tailwind v4 no usa `tailwind.config.js`** — los tokens van en `index.css` con `@theme {}`
- **React Router DOM 7** usa `<Link>` y `<NavLink>` de `react-router-dom`, no el antiguo `react-router`
- **shadcn/ui** está configurado con Base UI (`@base-ui/react`), no Radix UI
- **El proyecto es mobile-first** — cualquier nuevo componente debe funcionar correctamente en 375px antes de preocuparse por desktop
- **No agregar dependencias externas** sin necesidad — el objetivo es que el build sea liviano (<500 KB)
- **Los datos de colegios son FICTICIOS** — no mezclar con datos reales del Mineduc
- **CumplimientoPage y RoadmapPage** son páginas internas de trabajo del proyecto, no parte del flujo de usuario — no agregar enlaces a ellas en Navbar

---

## 14. Mantenimiento correctivo 2026-08-05 — scroll al navegar + auditoría móvil 375px

**Scroll al cambiar de ruta:** se creó `src/components/ScrollToTop.jsx` (usa `useLocation` + `useEffect`, hace `window.scrollTo(0,0)` cuando cambian `pathname`/`search`, se omite si hay `hash`) y se montó globalmente en `App.jsx` dentro del Router. Se eliminó el `window.scrollTo(0,0)` local de `ColegioPage.jsx` (línea ~137) por redundante — ScrollToTop ya reacciona a `search` (`?id=`). Verificado sin conflicto con: `scrollToBuscador` de `InicioPage` (ancla en la misma página, no cambia `pathname`), auto-scroll interno de `ChatAyuda` (scroll de un contenedor, no de la ventana) y el `scrollIntoView` del `GuidedTour` (cuando el tour cambia de página, ScrollToTop deja la vista en 0 y el polling del tour reposiciona después con su propio `scrollIntoView`; cuando el tour permanece en la misma página entre pasos, ScrollToTop no vuelve a dispararse).

**Ampliación 2026-09-03 (bitácora Bloque F-2026-09-03):** los 3 pasos de `/postulacion` comparten ruta, así que `ScrollToTop` no reacciona a ellos. Se agregó un `useEffect` local en `PostulacionPage.jsx` que hace `window.scrollTo(0, 0)` cuando cambian `paso`, `alumnoOk` o `confirmado` — antes, tras pulsar "Siguiente" / "← Atrás" / "Confirmar y enviar" / "Vincular estudiante", la vista quedaba a mitad de página o al final. Verificado en navegador.

**Resultado provisional en vivo (2026-09-03, bitácora Bloque Q):** al reordenar la lista los `%` por colegio **no** cambian (correcto: mecanismo a prueba de estrategia), pero nada mostraba lo que el orden **sí** decide — en qué colegio se queda. Componente `ResultadoProvisional` (consume el `useMemo` `resultado`, se actualiza al arrastrar) en el paso 2 (bajo la lista) y el paso 3 (antes del resumen). En el resumen del paso 3, la fila asignada lleva borde verde + *"— te asignarían aquí"*. Sin CSS nuevo; `asignacion.js` intacto. HAX G16.

**Refinamiento 2026-09-06/07:** `ResultadoProvisional` reescrito — se quitó la lógica de umbral 65 % (obsoleta desde Bloque R; ahora usa `resultado.sinAsignacionEnPreferencias` + `asignado.idx`), se suavizó la certeza (*"es poco probable"* / *"X de cada 100"* en vez de *"no quedarías… no alcanza"*), y **se eliminó el lenguaje de "sorteo" / "azar"** del encuadre. **Criterio del usuario (2026-09-07):** "sorteo/azar" **se mantienen** donde describen el mecanismo real (el desempate: `/algoritmo`, `AlgoSimuladorPasos`, `prioridadLabels[5]` = "Sorteo público transparente", el InfoBox "cómo se decide tu resultado" del paso 1); **se evitan** en encuadre y predicción. Bajo ese criterio se cambió también `PrioridadColegioControl` (~535): *"Aquí entras solo por el sorteo"* → *"Sin una prioridad aquí, tu cupo depende de cuántas familias pidan este colegio y de las vacantes que tenga"*; y (2026-09-07) nuevo helper **`etiquetaPrioridad(nivel)`** en `asignacion.js` (`nivel < 5` → `prioridadLabels[nivel]`; `nivel === 5` → *"Sin vínculo con este colegio"*; `null` → *"—"*), aplicado en todos los sitios que mostraban la prioridad de la familia: `ColegioAnalisis` ("Tu prioridad aquí"), el comprobante `.txt`, `AlgoritmoPage` (resultado del simulador) y `SeguimientoPage` ("Prioridad aplicada:" + resumen; stat del hero con *"Sin vínculo"* corto). `prioridadLabels` **sin tocar** (tests + `/algoritmo` para nombrar el paso del sorteo = mecanismo). `AlgoSimuladorPasos` ya decía *"Sin prioridades especiales (Sorteo público)"*. Solo se agregó el helper; la lógica del modelo no cambió. Sincronizados `caso_estudio…md` y `guion_moderador…md`.

**Auditoría de overflow horizontal a 375px:** se recorrieron las 13 rutas (`/`, `/colegio`, `/comparador`, `/postulacion`, `/seguimiento`, `/proceso`, `/algoritmo`, `/calendario`, `/perfil`, `/cumplimiento`, `/roadmap`, `/notas`, `/registro`) con Edge headless a 375×812 (estático, con modo texto grande activo, y con estados dinámicos: postulación con 6 colegios y tutorial activo, comparador con 3 colegios, seguimiento con postulación confirmada, chat abierto). Se detectó y corrigió un solo caso real: en `PostulacionPage.jsx` (paso 2, S22), `ColegioAnalisis` vivía dentro de `.post-item__body`, la columna central de la tarjeta de colegio — junto al grip de arrastre, el número de orden y los botones ↑↓ quedaba comprimida a ~142px de ancho a 375px, con el mini-análisis (demanda, vacantes por nivel, postulantes año anterior) apretado en esa columna angosta. Se movió `ColegioAnalisis` a hijo directo de `.post-item` (ahora con `flex-wrap: wrap`) y se le dio `flex-basis: 100%` para que ocupe una fila propia debajo de la tarjeta. No se encontró overflow horizontal (`scrollWidth` = 375 en todas las rutas y estados) ni se necesitó agregar `overflow-x: hidden` como red de seguridad. `npm run lint` (0 errores/0 warnings) y `npm run build` limpios tras los cambios.

## 15. Aplicación de recomendaciones de `investigacion_ux_guide_ai_systems.md` (2026-08-13)

Se implementaron las 5 recomendaciones priorizadas del documento (§8), todas dentro del bloque de explicación por colegio del paso 3 de `PostulacionPage.jsx` (resumen de confirmación, `resultado.detalles.map`), salvo la #5 que fue solo verificación:

1. **Corrección de la inconsistencia de mensajería (§4):** se eliminó "considera ponerlo más abajo en tu lista" del texto de probabilidad baja — contradecía el consejo de strategy-proofness del paso 2 y reproducía el mito de riesgo estratégico del caso San Martín.
2. **Advertencia "colegio en mente" con riesgo real vs. falso riesgo estratégico:** el texto de probabilidad baja ahora separa el dato que fundamenta el % (demanda alta, y cuando hay datos de nivel: postulantes año anterior y rango de vacantes del esquema v2) de una frase explícita e independiente: "Cambiar el orden de este colegio en tu lista no cambia esta cifra ni tus chances en los demás — el sistema siempre evalúa según tu preferencia real."
3. **Formato de frecuencia extendido a los tres niveles:** probabilidad media y baja ahora usan también "de cada 100 postulantes con tu misma condición, aproximadamente X quedan asignados" (antes solo probabilidad alta lo tenía).
4. **Categoría cualitativa para certeza muy alta:** cuando la prioridad es hermano/a matriculado/a (nivel 1) y la probabilidad calculada es ≥90%, se muestra "Muy alta" / "🟢 Certeza muy alta... prácticamente asegurada" en vez de solo el porcentaje puntual. PIE y continuidad de colegio de origen no se implementaron como categoría cualitativa porque no existen como campos/checkbox en este prototipo (el perfil solo rastrea hermano, prioritario SEP, funcionario, exalumno); ver nota en el código.
5. **Verificación de preservación de datos al editar desde el paso 3:** confirmado por trazado de código, sin cambios necesarios. Los botones "Editar" del paso 3 solo llaman a `setPaso(1)` o `setPaso(2)`; ningún estado de datos (`lista`, `perfil`, `alumnoNombre`, `alumnoRut`, `alumnoNivel`, `alumnoOk`, `region`, `loginOk`) se reinicia al cambiar de paso — cada uno vive en su propio `useState` y solo cambia por acción explícita del usuario.

Comentario de trazabilidad en el código: `S22-14 (refinamiento, investigacion_ux_guide_ai_systems.md)`. No se creó una nueva sección numerada del plan porque el punto de origen (S22-14, consejo estratégico/aviso de lista corta) ya existía y esto es un refinamiento de su mensajería, no una funcionalidad nueva — no se tocó la cifra 87/87 de `plan_mejora_sae.md`.

**Validación pendiente:** el entorno sandbox de esta sesión no pudo completar `npm install` (el registro de npm devolvió `403 Forbidden` para paquetes ad-hoc fuera del lockfile, y la instalación completa del proyecto se interrumpió repetidamente por timeouts de red antes de terminar, dejando `node_modules` en estado parcial). El cambio fue revisado manualmente línea por línea (paréntesis, backticks y template literals anidados balanceados; solo usa helpers ya existentes en el archivo: `colegiosById`, `vacantesDeNivel`) pero **`npm run lint` y `npm run build` no se ejecutaron con éxito en esta sesión**. Pendiente: correr ambos comandos en un entorno local antes de dar por cerrado este cambio.

## 16. Acceso inmediato al resultado + material de la prueba de usabilidad (2026-08-13)

Tras la reunión con el profesor guía del 2026-08-13 (ver `docs/planificacion/reunion_profesor_guia_2026-08-13.md`), se pidieron tres cosas de seguimiento sobre el caso de estudio de usabilidad, todas resueltas el mismo día:

1. **Guion de moderador**, para que Diego lo lea textualmente al presentar la prueba a cada participante: `docs/investigacion/guion_moderador_prueba_usabilidad.md` (y su PDF). Cubre bienvenida, consentimiento, entrega de la tarjeta de familia, instrucción de cada una de las 7 tareas dirigidas con los *probes* de pensar en voz alta, y cierre.

2. **Paso de resultado inmediato en el flujo de postulación**, para poder observar la reacción de la familia al resultado dentro de la misma sesión de prueba (en el sistema real el resultado tarda hasta octubre). Implementado en `PostulacionPage.jsx`, dentro del bloque `confirmado` del paso 3: un `InfoBox` nuevo ("Solo para esta prueba: mira tu resultado ahora") con un botón que lleva a `/seguimiento`. No se duplicó lógica: `SeguimientoPage.jsx` ya calculaba y mostraba el resultado completo (hero de asignación, explicación contextualizada, detalle por preferencia, aceptar/rechazar oferta) a partir del mismo `STORAGE_KEY` que `PostulacionPage` ya escribía al confirmar — solo faltaba el enlace que guiara a la persona hasta ahí. **Comentario de trazabilidad:** se marcó explícitamente como "extensión fuera de la matriz del plan de mejora (S1-S22)" en vez de inventar un código `S<sección>-<inciso>`, porque es una funcionalidad para la prueba de usabilidad, no un punto del plan de mejora cerrado al 100 % (87/87) el 2026-08-04. **No se tocó la cifra 87/87** citada en la memoria. Queda pendiente que el usuario decida si esto debe entrar formalmente a `plan_mejora_sae.md` como una sección nueva (p. ej. S23) — ver `caso_estudio_prueba_usabilidad_postulacion.md` §9.

3. **Cuestionario final ampliado:** se agregaron los ítems C5 ("Entendí por qué el resultado que vi fue ese, y no otro") y F5 ("El resultado que vi fue coherente con las probabilidades y explicaciones que había leído en el paso 3") en `caso_estudio_prueba_usabilidad_postulacion.md` §8.2 y en el material para participantes (`material_prueba_usabilidad_postulacion.pdf`, ítems 5 y 10 tras la renumeración). La lista de tareas dirigidas (§6 del caso de estudio) pasó de 7 a 8 puntos: la nueva tarea 7 pide predecir el resultado antes de verlo y reaccionar ante la explicación contextualizada; la antigua tarea 7 (cuestionario) pasó a ser la 8.

**Validación pendiente (misma causa que la sección 15):** en esta sesión el registro de npm siguió bloqueado (`curl` a `registry.npmjs.org` devolvió `403` desde el proxy del sandbox — confirmado explícitamente, no solo timeout). Además, un intento de `npm install` sobre la carpeta montada del proyecto dejó `node_modules/` en estado parcial (error `ENOTEMPTY` al reintentar) y no se pudo limpiar del todo desde este sandbox (`Operation not permitted` en varias rutas — permisos del punto de montaje). **Antes de dar por cerrado este cambio, corre en tu máquina:** `rm -rf node_modules` seguido de `npm install`, y luego `npm run lint` y `npm run build`. No se tocó ningún archivo de código fuente aparte de `PostulacionPage.jsx`; el estado de `node_modules` no afecta al repositorio (está en `.gitignore`).

## 17. Prioridad por colegio en el flujo de postulación (2026-08-26 — refinamiento S22-11 / S22-6)

Resuelve el pendiente **P6** de `docs/planificacion/bitacora_flujo_postulacion_y_resultado.md` (§5) y el gap de datos señalado en `caso_estudio_prueba_usabilidad_postulacion.md` §5. Antes, `nivelPrioridad(perfil)` devolvía **un solo nivel global** y se aplicaba a todos los colegios de la lista: marcar "hermano" (que la familia Muñoz González tiene solo en Colegio Los Andes) hacía que el prototipo aplicara prioridad de hermano también en Colegio San Martín, el colegio-control del caso.

**Modelo nuevo:**
- `prioritario` (cuota SEP 15 %) sigue siendo **booleano global de perfil** — es transversal por ley.
- `hermano`, `funcionario`, `exalumno` son **específicas del establecimiento**. Se declaran en `perfil.prioridadesPorColegio = { [colegioId]: { hermano, funcionario, exalumno } }`.
- `src/data/colegios.js`: nuevo campo `casoPrioridades` por colegio (array), que declara qué prioridades específicas tiene la familia del caso Muñoz González en ese colegio, mapeado por **nombre** desde la Tabla 1 del caso: Colegio Los Andes → `['hermano']` (hija mayor Martina matriculada); Colegio Villa del Sol → `['funcionario']` (padre Rodrigo, asistente de aula); Escuela República de Chile → `['exalumno']` (madre Daniela); Colegio San Martín, Liceo Técnico Simón Bolívar y Escuela Básica Los Quillayes → `[]` (San Martín es el control; Los Quillayes es el colegio de origen de Sofía, continuidad no modelada como checkbox). El array antiguo `prioritarios` (vocabulario hermano/cercano/nee/vulnerabilidad) **no se tocó** — solo alimenta la ficha de colegio y nunca estuvo cableado al algoritmo.

**`src/utils/asignacion.js`:**
- Nueva función `nivelPrioridadEnColegio(perfil, colegioId)`: resuelve el mejor nivel (número más bajo) entre `prioritario` (2) y las prioridades específicas declaradas para ESE colegio. Fallback documentado: si `perfil` no trae `prioridadesPorColegio`, trata las condiciones globales como si aplicaran en todos los colegios (comportamiento previo — lo usa el simulador de `/algoritmo`).
- `calcularResultado`: cada entrada de `detalles[]` lleva ahora su `nivel` y `prioridadLabel` **por colegio**; `probAsignacion` y los estados se calculan con ese nivel. `resultado.nivel` / `resultado.prioridadLabel` de nivel superior pasan a ser un **valor representativo = el del colegio asignado** (compatibilidad con `SeguimientoPage` / `AlgoritmoPage`).
- Se conserva `nivelPrioridad(perfil)` (global) solo como fallback cuando la lista está vacía. Se exporta `PRIORIDADES_POR_COLEGIO = ['hermano','funcionario','exalumno']`.

**UI — `src/pages/PostulacionPage.jsx`:**
- Estado nuevo `prioridadesPorColegio`; `perfilCompleto` (useMemo) combina `perfil` + ese mapa y es lo que se pasa a `calcularResultado` y se guarda en `STORAGE_KEY`.
- Paso 2: al marcar un chip de prioridad específica de colegio aparece un aviso ("¿Dónde tienes esa prioridad?") y, en **cada colegio de la lista**, un control `PrioridadColegioControl` (chips `aria-pressed`, fila completa, patrón visual ya usado) para declarar si la prioridad aplica ahí. Al agregar un colegio se **pre-marca** desde `casoPrioridades` (solo entre las condiciones que la familia marcó); al quitarlo o desmarcar el chip se limpia. Cambios anunciados por `aria-live` (nueva región `anuncioPrioridad`).
- `ColegioAnalisis` usa `nivelPrioridadEnColegio` → muestra el % y la etiqueta "Tu prioridad aquí" del colegio correspondiente.
- Paso 3: el resumen (`resultado.detalles.map`) muestra la prioridad por colegio; se reemplazó el texto "Tu prioridad se aplica a todos los colegios de tu lista. No puedes tener distinta prioridad por colegio" (ahora falso) por la explicación de prioridad transversal vs. específica. El comprobante `.txt` lista la prioridad por colegio. La categoría "certeza muy alta" de S22-14 (`d.nivel === 1 && d.prob >= 90`) sigue funcionando: `d.nivel` es ahora el del colegio.

**`src/pages/SeguimientoPage.jsx`:** `generarExplicacion` conmuta por `asignado.nivel` (nivel real en el colegio asignado) en vez de los booleanos globales del perfil; hero stat y "Prioridad aplicada" quedan coherentes (usan `resultado.nivel` = representativo del asignado); el detalle por preferencia muestra la prioridad de cada colegio.

**`src/pages/AlgoritmoPage.jsx`:** sin cambio funcional — `calcularResultado(seleccion, perfil)` sigue igual y se apoya en el fallback de `nivelPrioridadEnColegio` (documentado con comentario). `explicacionSim` conmuta por `asignado.nivel` para coherencia.

**Trazabilidad:** comentarios `S22-11 (refinamiento)` y `S22-6` en el código. Es un refinamiento de puntos S22 existentes: **no** se creó sección nueva del plan, **no** se sumó ningún punto, **no** se tocó la cifra 87/87 de `plan_mejora_sae.md` ni `src/data/incisos.js`. No impacta cifras citadas en `proyecto-tesis/` (las probabilidades de `probAsignacion` y el umbral 65 no cambiaron; solo cambia a qué colegio se le asigna cada nivel).

**Validación:** `npm run lint` limpio (0 errores / 0 warnings) y `npm run build` limpio, ejecutados en esta sesión (2026-08-26). `node_modules` estaba completo y funcional. Verificación adicional ad-hoc con Node de la resolución por colegio para el caso Muñoz González (script descartado).

---

## 18. Auditoría de lenguaje de los avisos del flujo — P3 y P4 (2026-08-26)

Implementa los pendientes **P3** y **P4** de `docs/planificacion/bitacora_flujo_postulacion_y_resultado.md` (§5). Auditoría de microcopy (no de lógica): no se tocó `asignacion.js`, ni la tabla `probAsignacion`, ni el umbral 65, ni la estructura de componentes.

**P4 (HAX G5/G6 — que ningún aviso juzgue a la familia ni refuerce estigmas):**
- `PostulacionPage.jsx` `PRIORIDADES_INFO.prioritario.que_es`: se reemplazó "vulnerabilidad socioeconómica verificada por el MINEDUC" por "El Estado lo determina según la situación socioeconómica de tu familia… No es algo que decidas tú ni el colegio". Se evita usar "vulnerabilidad" como rótulo repetido y se encuadra la cuota SEP como un derecho.
- `PostulacionPage.jsx` Paso 2, InfoBox "¿En qué orden se revisan las prioridades?": misma corrección ("…estudiantes prioritarios/as, definidos por la situación socioeconómica que el Estado ya tiene registrada").
- `PostulacionPage.jsx` aviso de lista corta (S22-14): el título pasó a "Tu lista es corta y toda de alta demanda" y el cuerpo atribuye el riesgo a "en todos hay más postulantes que vacantes" en vez de un fraseo que podía leerse como "apuntaste muy alto".
- Ya cumplían (sin cambio): `ColegioAnalisis` (solo muestra demanda, vacantes, postulantes año anterior y prioridad — datos de contexto neutros, sin SIMCE/GSE/categoría, sin jerarquía de prestigio); las tres explicaciones de probabilidad del paso 3 (atribuyen la baja probabilidad a la demanda del colegio, no a la familia — ya refinadas en S22-14); el bloque "¿Y si no quedo en ninguna?"; `SeguimientoPage.jsx` `generarExplicacion` y "¿Qué significa no quedar en tu primera opción?" (explican por demanda/prioridad/vacantes, sin juicio).

**P3 (NN/g — toda advertencia accionable, no genérica):**
- `PostulacionPage.jsx` `ColegioAnalisis`, mensaje de nivel sin vacantes publicadas: de "Este colegio no publica vacantes para {nivel}." (genérico) a "…aún no publica vacantes… El porcentaje se calcula solo con su demanda general. Abre la ficha del colegio para confirmar que ofrece ese nivel antes de dejarlo en tu lista." (dice qué significa el dato faltante y qué hacer).
- `PostulacionPage.jsx` aviso de lista corta (S22-14): cierra con acción concreta ("agrega más colegios — al menos 6 — e incluye alguno de demanda media o baja"); no sugiere reordenar por probabilidad (strategy-proofness intacto).
- Ya cumplían (sin cambio): explicación de probabilidad media ("Agregar más colegios a tu lista te da más opciones en total") y baja ("agrega colegios con demanda media o baja"); la de probabilidad alta y la de "certeza muy alta" son mensajes de refuerzo, no advertencias, por lo que no requieren acción; los InfoBox neutro del flujo son informativos/tutoriales, no advertencias de riesgo.

**Trazabilidad:** comentarios `S22-6 (refinamiento)`, `S22-11 (refinamiento)` y `S22-14 (refinamiento)` en `PostulacionPage.jsx`. No se creó sección del plan, no se sumó ningún punto, **87/87 intacto** (`plan_mejora_sae.md` e `incisos.js` sin cambios). Sin impacto en cifras de `proyecto-tesis/`.

**Validación:** `npm run lint` limpio (0 errores / 0 warnings) y `npm run build` limpio, ejecutados en esta sesión (2026-08-26); `PostulacionPage` compila a 40.18 kB. `SeguimientoPage.jsx` no requirió cambios.

---

## 19. Visualización del formato de frecuencia (P1) + encuadre HAX G1 antes de pedir datos (P2) (2026-08-26)

Implementa los pendientes **P1** y **P2** de `docs/planificacion/bitacora_flujo_postulacion_y_resultado.md` (§5).

**P1 — versión visual del formato de frecuencia (RISK-NUM / PAIR-ET, `investigacion_ux_guide_ai_systems.md` §6 y §3).** Nuevo componente compartido `src/components/ProbabilidadVisual.jsx` (sin dependencias; solo CSS/DOM). Toma la cifra de `probAsignacion()` (no inventa nada) y la representa como "X de cada 100":
- `variante="barra"`: barra proporcional con divisiones cada 10 % (vía `background-size`), compacta. Se usa en `PostulacionPage.jsx` → `ColegioAnalisis` (paso 2), donde el ancho dentro de `.post-item` a 375 px es reducido. Acompaña —no reemplaza— al chip "{prob}% estimado" y a la categoría cualitativa.
- `variante="grid"`: icon array de 10×10 (100 celdas, N rellenas). Se usa en `ColegioPage.jsx`, sección "Vacantes por nivel", en un bloque nuevo `.probviz-block` ("Si postulas sin ninguna prioridad"), con `probAsignacion(5, colegio.demanda)` — la ficha no conoce el perfil del usuario, así que muestra el caso base (nivel 5) y remite a `/algoritmo` para el caso propio.
- Accesibilidad: contenedor `role="img"` con `aria-label` = la cifra en palabras ("Probabilidad estimada en {colegio}: {N} de cada 100 postulantes en tu misma condición quedan asignados."); el dibujo es `aria-hidden`. Distinción lleno/vacío por relleno + borde + número, no solo color (WCAG AA). `@media (prefers-reduced-motion: reduce)` desactiva la transición de la barra. Paleta Mineduc por categoría (verde/naranja/rojo), consistente con `.tut-prob--*`.
- CSS nuevo en `src/index.css` (final del archivo): `.probviz`, `.probviz__resumen`, `.probviz__bar(-fill)`, `.probviz__grid`, `.probviz__cell(--on)`, `.probviz-block`.

**P2 — HAX G1: qué hace / qué NO hace el algoritmo, antes de pedir datos (`investigacion_ux_guide_ai_systems.md` §2 "Al inicio").** En `PostulacionPage.jsx`, paso 1 ("Identifícate"), primer elemento dentro de `CardContent` (antes del bloque de ClaveÚnica): `InfoBox` "Antes de empezar: cómo se decide tu resultado", **siempre visible** (no depende del modo tutorial — es encuadre básico, no un tip; no rompe el layout). Dos párrafos: (1) el sistema asigna con el orden de tu lista + las prioridades legales (PIE → hermanos → reserva 15 % SEP → funcionario → exalumno) + las vacantes, y desempata con sorteo al azar por colegio; (2) no hay puntaje ni notas ni ranking por mérito (excepción: alta exigencia académica, fuera de este prototipo), y poner primero el colegio que más quieres nunca perjudica. Enlace "Ver cómo funciona en detalle" → `/algoritmo`. No replica el contenido extenso de `/algoritmo` ni `/proceso`.

**Trazabilidad:** comentarios `P1 · S22-11 (refinamiento)` (visual = refinamiento de "mostrar el dato que fundamenta el %") y `P2 · HAX G1 — S22 (refinamiento)` (relacionado con S22-6 y S13). **No** se creó sección del plan, **no** se sumó ningún punto, **87/87 intacto** (`plan_mejora_sae.md` e `incisos.js` sin cambios). Sin impacto en cifras de `proyecto-tesis/` (`probAsignacion` y el umbral 65 no se tocaron; solo se muestra la misma cifra de otra forma).

**Validación:** `npm run lint` limpio (0 errores / 0 warnings) y `npm run build` limpio, ejecutados en esta sesión (2026-08-26). `PostulacionPage` compila a 41.58 kB; `ProbabilidadVisual` sale como chunk propio (0.84 kB).

---

## 20. Auditoría de lenguaje antropomórfico en `/algoritmo` (2026-08-26)

Implementa el pendiente de lenguaje del `AlgoSimuladorPasos` de `docs/planificacion/bitacora_flujo_postulacion_y_resultado.md` (§5; listado como **P1** tras la última renumeración, originalmente **P3**). Fundamento: NN/g "Explainable AI in Chat Interfaces" (`investigacion_ux_guide_ai_systems.md` §5, L77): describir el procesamiento en términos de reglas y datos, no como una "elección" del sistema.

Auditoría de todo el texto visible y los `aria-label` de `src/components/AlgoSimuladorPasos.jsx` y `src/pages/AlgoritmoPage.jsx` (prosa de los 4 pasos, datos `pasos`/`ESCENARIOS`/`CONTEXTO_MUNDIAL`/`tutoriales`, `explicacionSim`, render de `resultado`, FAQ). No se tocó lógica, animación, `asignacion.js`, la tabla `probAsignacion` ni el umbral 65.

**Único cambio:** `AlgoSimuladorPasos.jsx`, párrafo de intro de la sección "Reproducir el algoritmo paso a paso":
- Antes: "Mira cómo el sistema evalúa cada uno de tus colegios en orden, hasta encontrar una asignación."
- Después: "Mira cómo el sistema revisa tus colegios en el orden que tú elegiste. En cada uno aplica las prioridades que fija la ley y cuenta los cupos disponibles, hasta asignarte uno."
- Motivo: el texto previo no nombraba las reglas ni los datos; el nuevo encuadra el proceso como aplicación de prioridades legales + conteo de cupos, y refuerza que el orden lo elige la familia. Comentario de trazabilidad `S13 (refinamiento) · auditoría NN/g`.

**Ya cumplía (sin cambio):** `AlgoritmoPage.jsx` usa lenguaje de proceso en toda su prosa — "el sistema cruza la lista de todos los postulantes con las prioridades y los cupos", "revisa la N.°2", "el sistema activa una segunda etapa", "el sistema aplica prioridades definidas por ley" (FAQ), "queda asignado al mejor colegio posible según su posición en la lista y sus condiciones de prioridad". Los verbos con sujeto "tú/la familia" ("Tú eliges tu lista", "el nivel que buscas") son correctos y no se tocaron. Las etiquetas de estado de la tabla ("Asignado aquí", "Sin cupos", "Prioridad insuficiente", "No evaluado") y los controles de reproducción (▶️ / ⟲ / ⏸) no son antropomorfismo.

**Trazabilidad:** comentario `S13 (refinamiento) · auditoría NN/g` en `AlgoSimuladorPasos.jsx`. No se creó sección del plan, no se sumó ningún punto, **87/87 intacto** (`plan_mejora_sae.md` e `incisos.js` sin cambios). Sin impacto en cifras de `proyecto-tesis/`.

**Validación:** `npm run lint` limpio (0 errores / 0 warnings) y `npm run build` limpio, ejecutados en esta sesión (2026-08-26). `AlgoritmoPage` compila a 182.64 kB.

---

## 21. Modelo de datos unificado del estudiante + reencuadre de `prioritario` (SEP) como condición del Estado (2026-08-27)

**Motivación.** Las prioridades se pedían en dos lugares desconectados (`/perfil` con checkboxes y guardado en `sae_react_perfil`, y `/postulacion` con su propio estado) y el flujo nunca leía `/perfil`. Además `prioritario` (SEP) se presentaba como casilla autodeclarada, cuando en el SAE real lo determina el MINEDUC con el Registro Social de Hogares y la familia no lo elige.

**Principio rector (del usuario):** todo lo que la familia no puede modificar (lo determina el Estado / es automático) se muestra en el flujo como alerta o información, no como control editable.

**Contrato de datos (documentado en `PerfilPage.jsx` y `PostulacionPage.jsx`):**
- `localStorage['sae_react_perfil']` (PERFIL_KEY) — lo escribe `/perfil`, fuente única de nivel estudiante: `{ nombre, rut, nivel, prioritario }`. `nivel` usa el mismo vocabulario que el `<select>` del paso 1 de `/postulacion` ("Prekínder", "Kínder", "1° básico"… "4° medio"). `prioritario` es booleano; se activa solo para simular. Tolera perfiles antiguos con `condiciones.prioritario`.
- `localStorage['sae_react_postulacion']` (STORAGE_KEY) — lo escribe `PostulacionPage` al confirmar, sin cambios de forma: `{ fecha, comprobante, alumno:{nombre,run,nivel}, perfil: perfilCompleto, lista, resultado }`. Ahora `perfilCompleto = { prioritario: <de /perfil>, prioridadesPorColegio: {...} }` (ya no lleva `hermano/funcionario/exalumno` globales). `SeguimientoPage` lo lee igual que antes.
- `sae_react_postulacion_draft_list` (DRAFT_LIST_KEY) — sin cambios.

**`src/utils/rut.js` (nuevo).** `formatearRut` y `rutValido` extraídos verbatim de `PostulacionPage.jsx` (comportamiento idéntico). Los usan `PerfilPage` (campo RUT nuevo) y `PostulacionPage`. `RegistroPage.jsx` mantiene sus propias `formatRut`/`validarRut` (no se tocó).

**`PerfilPage.jsx`.** Reescrita: bloque 1 (nombre, RUT nuevo con validación en vivo, nivel con vocabulario unificado); bloque 2 = solo el toggle `prioritario` reencuadrado ("El MINEDUC lo determina según el RSH… aquí lo activas solo para la simulación", con la advertencia de que marcar sin serlo anula la postulación en el sistema real); bloque 3 = nota de que hermano/funcionario/exalumno se declaran al postular, por colegio (con enlace a `/postulacion`). Guarda `{ nombre, rut, nivel, prioritario }`.

**`PostulacionPage.jsx`.**
- Lee `/perfil` con `cargarPerfilEstudiante()` (loader tolerante). `alumnoRut/alumnoNombre/alumnoNivel` se **precargan** desde `/perfil` (inicializadores perezosos; el usuario corrige y confirma con "Vincular estudiante").
- **Paso 1:** tras vincular al estudiante, `InfoBox` de **solo lectura** con la condición de nivel estudiante: si `prioritario` → "Condición registrada: Estudiante prioritario/a (SEP). El MINEDUC ya lo tiene…"; si no → "Sin condiciones prioritarias registradas…". Ambas con enlace "Editar en Mis datos" → `/perfil`.
- **Paso 2:** se **quitaron los chips activadores globales** de hermano/funcionario/exalumno (y el chip `prioritario`). En su lugar, una leyenda no interactiva con las 3 prioridades declarables + botón "?" que abre el modal (`PRIORIDADES_INFO`/`PrioridadModal` se conservan), más una línea informativa sobre la condición SEP que remite al paso 1 / `/perfil`. Las prioridades por colegio se declaran **solo** en `PrioridadColegioControl` (P6), que ahora se muestra en **todos** los colegios de la lista con las 3 claves (`clavesEspecificas = PRIORIDADES_POR_COLEGIO`) y se **siembra directo desde `casoPrioridades`** al agregar el colegio (ya no gateado por un chip global). `hayPrioridad` se recalcula: `prioritario` o cualquier `prioridadesPorColegio` marcada.
- **Paso 3:** el resumen de prioridades dice "Condición registrada: estudiante prioritario/a (SEP) — la determina el MINEDUC" (enlace a `/perfil`) y "Editar por colegio" para las específicas.
- `perfilCompleto = { prioritario: perfilEstudiante.prioritario, prioridadesPorColegio }`. `nivelPrioridadEnColegio` ya lo soporta. **No se tocó `asignacion.js`** (`calcularResultado`, `probAsignacion`, `nivelPrioridadEnColegio`, tabla de probabilidades, umbral 65).

**`AlgoritmoPage.jsx`.** Solo una nota en el `form-hint` del simulador aclarando que es exploratorio y que `prioritario` (SEP) en el flujo real lo determina el MINEDUC, no se elige. Sin cambio funcional (usa el fallback documentado de `nivelPrioridadEnColegio`).

**Verificación caso Muñoz González** (6 colegios, `prioritario` en `/perfil`, hermano/funcionario/exalumno sembrados desde `casoPrioridades`): Los Andes → nivel 1 (hermano, 92 %), San Martín → nivel 2 (prioritario, 90 %); República de Chile y Villa del Sol resuelven a nivel 2 porque la cuota SEP (2) supera a exalumno (4) y funcionario (3) — comportamiento de `Math.min` preexistente, no alterado.

**PIE:** fuera de alcance (no se modela como campo en el prototipo). Si se agrega en el futuro, mismo encuadre que `prioritario` (dato del Estado, no elección).

**Trazabilidad:** comentarios `S4 (refinamiento — arquitectura de información)` y `S22-6 / S22-11 (refinamiento)`. **No** se creó sección del plan, **no** se sumó ningún punto, **87/87 intacto** (`plan_mejora_sae.md` e `incisos.js` sin cambios). Sin impacto en cifras de `proyecto-tesis/`.

**Doc de la prueba a actualizar (writing-agent):** `docs/investigacion/caso_estudio_prueba_usabilidad_postulacion.md` y el material de participantes (`material_prueba_usabilidad_postulacion.pdf`, guion del moderador) asumen que `prioritario` se marca dentro del flujo; ahora se configura en `/perfil` y en el flujo aparece como información de solo lectura. El caso de estudio en sí no cambia (mismas prioridades, mismos resultados).

**Validación:** `npm run lint` limpio (0 errores / 0 warnings) y `npm run build` limpio, ejecutados en esta sesión (2026-08-27). `PostulacionPage` compila a 43.63 kB; `PerfilPage` a 6.22 kB; `rut` sale como chunk propio (0.24 kB).

## 22. Fidelidad del flujo de postulación — brechas A, C y D del análisis del video oficial (2026-08-27)

**Fuente:** `docs/investigacion/analisis_video_paso_a_paso_sae.md` (transcripción del video oficial del MINEDUC, tabla de brechas A–I). Se implementan **A, C y D**; **B** (capturar comuna + dirección de residencia del estudiante) queda fuera de este ciclo por decisión del usuario. Todo en `src/pages/PostulacionPage.jsx`.

**A — Casilla "declaro ser apoderado/a" (paso 1).** Estado nuevo `declaraApoderado` (default `false`). Casilla obligatoria dentro de `post-alumno-block`, justo antes del botón "Vincular estudiante": *"Declaro ser el/la apoderado/a legal de este/a estudiante"*. Mientras no esté marcada, el botón "Vincular estudiante" queda `disabled` (se sumó `|| !declaraApoderado` a la condición existente) con `title` explicativo, y bajo la casilla aparece un `form-hint` rojo con `role="alert"`: *"Debes marcar esta casilla para vincular al estudiante."* `aria-required="true"` en el input. Como la vinculación ya bloqueaba `alumnoOk` y el avance de paso depende de `alumnoOk`, el gate se propaga a la navegación sin tocar `siguiente()`.

**C — Dos aceptaciones al agregar un colegio (paso 2).** Nuevo componente `AgregarColegioModal` (`<dialog>` nativo, mismas clases `.prio-modal*` que `PrioridadModal`, sin CSS nuevo) + helper `jornadaDeColegio(colegio, nivelAlumno)` (usa `vacantesDeNivel(...).jornada`; si el nivel no tiene dato, la jornada más frecuente del colegio; si no hay ninguna, texto genérico). El botón "+ Agregar" de cada tarjeta ya no llama `agregar(c.id)` directo: hace `setColegioPendiente(c.id)` (estado nuevo) y tiene `aria-haspopup="dialog"`. El modal muestra dos casillas:
  1. *"Acepto la jornada **{jornada}** de {colegio}."* (o *"Acepto el tipo de jornada de {colegio}."* si no hay dato)
  2. *"Acepto adherir al proyecto educativo y al reglamento interno de {colegio}."*
  Solo con ambas marcadas se habilita "Agregar a mi lista" (llama `agregar(colegioPendiente)` y cierra); "Cancelar", ✕, ESC y clic-fuera cierran sin agregar. Foco a la primera casilla al abrir (`useEffect` + `contenidoRef.current.querySelector('input')`), `aria-labelledby` al título. Solo intercepta el **agregar**: quitar y reordenar no lo disparan.
  **Pre-carga del caso Muñoz González:** el flujo no pre-siembra colegios en `lista` (solo `casoPrioridades` pre-marca chips de prioridad *al* agregar). El único camino por el que un colegio puede estar en `lista` sin pasar por el modal es un **borrador guardado** (`DRAFT_LIST_KEY`, S22-9); esos colegios se dejan como están (aceptaciones dadas por hechas) y el gate solo aplica a los nuevos "+ Agregar". Comentado en el código.

**D — Aviso de pérdida de cupo (paso 2, prominente al inicio).** `InfoBox tipo="alerta"` **siempre visible** (no depende de `modoTutorial`), primer elemento del `CardContent` del paso 2, antes del tutorial "¿Cómo funciona este paso?". Título: *"Postula solo si necesitas cambiar de colegio"*. Cuerpo (3 párrafos): postular solo si se necesita/desea cambiar; si queda asignado/a en un colegio nuevo **pierde de inmediato el cupo actual, aceptes o rechaces** — con la aclaración de que si **no** queda en ninguna preferencia mantiene su colegio de hoy (cruce de referencia con el bloque S22-15 del paso 3, que trata el caso de *no* quedar); y la obligación de postular si el colegio actual no tiene continuidad de nivel. Distinto del encuadre "cómo se decide tu resultado" del paso 1 (P2/HAX G1, que explica el algoritmo) y del bloque "¿Y si no quedo en ninguna?" del paso 3 (S22-15, que trata el no-quedar): D es el **costo de postular en sí**.

**Trazabilidad:** comentarios `A/C/D · fidelidad (analisis_video_paso_a_paso_sae.md brecha X)` con el código S22 más cercano por ubicación (`S22-12 (refinamiento)` para A, `S22-2 (refinamiento)` para C, `S22-15 (refinamiento)` para D). **No** se creó sección del plan, **no** se sumó ningún punto, **87/87 intacto** (`plan_mejora_sae.md` e `incisos.js` sin cambios). No se tocó `asignacion.js` (`calcularResultado`, `probAsignacion`, `nivelPrioridadEnColegio`, tabla de probabilidades, umbral 65). Sin impacto en cifras de `proyecto-tesis/`.

**Verificación caso Muñoz González end-to-end:** paso 1 con casilla A marcada permite vincular; sin marcar, botón bloqueado. Paso 2 muestra el aviso D al entrar; agregar cada uno de los 6 colegios pasa por el modal C (dos casillas → "Agregar a mi lista"); `casoPrioridades` se sigue sembrando al agregar (Los Andes → hermano/nivel 1; San Martín → nivel 2 por cuota SEP del perfil). Resultados de `calcularResultado` sin cambios respecto a la sección 21.

**Validación:** `npm run lint` limpio (0 errores / 0 warnings) y `npm run build` limpio (2026-08-27). `PostulacionPage` compila a 47.52 kB / 13.90 kB gzip.

## 23. Cierre de la pasada de fidelidad — B acotado + aceptaciones de registro + aviso de reenvío E (2026-09-01)

**Fuentes:** `docs/planificacion/comparativa_flujo_postulacion_v_final.md` (2026-09-01, secciones 2 y 5) y `docs/investigacion/analisis_video_paso_a_paso_sae.md` (brechas B y E). Deja el flujo de postulación en versión casi final para la reunión con la profesora guía del 2026-09-04. Solo `sae-react/`, sin dependencias nuevas, sin tocar `asignacion.js` (`calcularResultado`, `probAsignacion`, `nivelPrioridadEnColegio`, tabla de probabilidades, umbral 65). **No** se creó sección del plan, **no** se sumó ningún punto, **87/87 intacto** (`plan_mejora_sae.md` e `incisos.js` sin cambios). Sin impacto en cifras de `proyecto-tesis/`.

**B acotado — dirección de residencia del/de la estudiante (paso 1).** En `PostulacionPage.jsx`:
- La región (estado `region`, ya existente como filtro de exploración S22-1) pasa a ser el campo de **región de la dirección**; su label ahora dice *"¿En qué región vive el/la estudiante?"* y el comentario S22-1 se amplía con la referencia a la brecha B. Sigue sin ser una restricción (se puede postular a otras comunas/regiones).
- Nuevo bloque **"Dirección del/de la estudiante"** (`<div className="post-direccion-block">`, dentro de `post-alumno-block`, **después de la casilla A** y **antes del botón "Vincular estudiante"**). Contiene:
  - Eco de solo lectura de la región elegida arriba (*"Región: {label} (la eliges más arriba)."*).
  - **Comuna** * — `<input type="text" list="dir-comunas-sugeridas">` + `<datalist>`. Se usa input con datalist y **no** `<select>`: el catálogo de comunas depende de la región y mantener las 346 comunas del país es frágil; el datalist sugiere sin restringir. Semilla `COMUNAS_SUGERIDAS` = comunas de `colegios.js` + comunas frecuentes de RM y Valparaíso (constante nueva junto a `REGIONES`).
  - **Dirección (calle y número)** * — `<input type="text">`, placeholder *"Ej: Av. Los Aromos 450"*.
  - **Número de casa o depto.** (opcional) — `<input type="text">`.
  - **Nota visible** (`form-hint`) bajo el bloque, texto exacto: *"Tu dirección se usa para ubicar colegios cercanos en la búsqueda. No cambia tus probabilidades ni tu resultado: la cercanía no es un criterio de prioridad del SAE."*
- **Obligatoriedad:** `direccionCompleta = !!region && comuna.trim().length > 1 && dirCalle.trim().length > 2`. Se sumó `|| !direccionCompleta` a la condición `disabled` del botón "Vincular estudiante" (junto a `rutValido`, nombre ≥ 3, nivel, `declaraApoderado`) y un `title` explicativo. Como `alumnoOk` ya gatea el avance de paso, no se tocó `siguiente()` ni la navegación.
- **Validación en vivo suave:** estado `dirTocada` (`{ comuna, calle }`), marcado `onBlur` de cada campo; el `role="alert"` de cada faltante aparece solo tras salir del campo, no antes. `aria-required` y `aria-invalid` en los inputs.
- **Persistencia (contrato de datos):** el objeto que `confirmar()` escribe a `STORAGE_KEY` (`sae_react_postulacion`) suma la clave **`direccion: { region, regionLabel, comuna, calle, numero }`** (campos `.trim()`). Es aditivo: `SeguimientoPage` y `calcularResultado` no la leen ni la usan. El comprobante `.txt` (`descargarComprobante`) incluye un bloque nuevo **"── DIRECCIÓN DE RESIDENCIA ──"** (región, comuna, dirección + número entre paréntesis si hay) con la misma advertencia de que no cambia el resultado.
- CSS nuevo mínimo: `.post-direccion-block` (borde superior + padding) en `index.css`, junto a `.post-alumno-block__sub`.
- Trazabilidad: `B · fidelidad (analisis_video_paso_a_paso_sae.md brecha B) · S22-1 (refinamiento)`.

**Aceptaciones de registro (`RegistroPage.jsx`).** Las dos casillas obligatorias (`aceptaTerminos`, `aceptaDatos`) ya existían en el `<fieldset className="rg-checks">` del paso 2 y ya bloqueaban el envío vía `paso2Ok` + `disabled` del botón "Registrarme". Se completó: `aria-required="true"` en ambos inputs, comentario de trazabilidad `S22 (refinamiento) · fidelidad`, y **aviso `role="alert"`** al pie del fieldset — *"Tienes que marcar las dos casillas para crear tu cuenta."* — visible mientras falte cualquiera de las dos (mismo patrón que la casilla A del paso 1). Los enlaces "términos y condiciones" y "manejo de datos" apuntan a `/cumplimiento` (simbólico, suficiente).

**Aviso de reenvío al modificar (E) — hecho como texto, sin manejo de estado.** En el paso 3 (`confirmado`), tras el botón de descarga del comprobante, `InfoBox tipo="alerta"` **siempre visible** titulada *"Si cambias tu lista después de enviar"*: cada cambio obliga a **volver a enviar la postulación y descargar un comprobante nuevo**; el anterior deja de tener validez; vale el último descargado. Se añadió además la misma idea a la `InfoBox` de modo tutorial *"¿Qué hacer ahora?"*. **No** se invalida `comprobanteDescargado` al editar ni se rehace el flujo de envío — eso queda como **fase 2** (documentado en el comentario del código y en el resumen de la tarea). Trazabilidad `E · fidelidad (analisis_video_paso_a_paso_sae.md brecha E) · S22 (refinamiento)`.

**Verificación caso Muñoz González end-to-end:** paso 1 no deja vincular hasta tener casilla A + comuna + calle (RUN/nombre/nivel aparte); con los datos completos vincula normal. Prioridades por colegio sin cambios (`casoPrioridades` intacto): Los Andes → nivel 1 (hermano), San Martín → nivel 2 (cuota SEP del perfil), verificado con `nivelPrioridadEnColegio`. `RegistroPage` no deja registrar sin las dos casillas. El comprobante `.txt` incluye el bloque de dirección.

**Validación:** `npm run lint` limpio (0 errores / 0 warnings) y `npm run build` limpio (2026-09-01). `PostulacionPage` compila a 51.83 kB / 15.11 kB gzip; `RegistroPage` 10.80 kB / 3.13 kB gzip.

## 24. Suite de validación del flujo de postulación — `sae-react/tests/` (2026-09-02)

**Motivación:** dejar cubierto el recorrido del caso de estudio (familia Muñoz González, `docs/investigacion/caso_estudio_prueba_usabilidad_postulacion.md`) con una prueba automatizada antes de la reunión con la profesora guía, sin introducir un framework de test (regla de `CLAUDE.md`).

**Qué se agregó (solo archivos nuevos + un script):**

| Archivo | Rol |
|---|---|
| `sae-react/tests/flujo-postulacion.test.js` | 12 tests con `node:test` + `node:assert/strict`. |
| `sae-react/tests/setup.mjs` | `register()` del hook de resolución (se pasa con `--import`). |
| `sae-react/tests/resolve-extensionless.mjs` | Hook ESM que completa la extensión de los imports relativos sin extensión (`../data/colegios` → `../data/colegios.js`), como hace Vite. **Solo** actúa al correr los tests; no interviene en `npm run dev` ni `npm run build`. |
| `sae-react/tests/README.md` | Cómo se corre y qué cubre. |
| `sae-react/package.json` | Nuevo script `"test": "node --test --import ./tests/setup.mjs \"tests/**/*.test.js\""`. |

**Sin dependencias nuevas.** Runner nativo de Node (v24 en el entorno; requiere Node ≥ 20). No se agregó Vitest/Jest.

**Qué valida `flujo-postulacion.test.js`** (ejercita la lógica real `src/utils/asignacion.js` con `src/data/colegios.js`, reproduciendo el `perfilCompleto = { prioritario, prioridadesPorColegio }` que arma `PostulacionPage.jsx`; el helper `sembrarPrioridadesPorColegio` replica la siembra desde `colegio.casoPrioridades` que hace `agregar()`):

1. **Datos del caso** — los 6 colegios, su `demanda` y su `casoPrioridades` (`hermano` / `[]` / `exalumno` / `[]` / `funcionario` / `[]`).
2. **Paso 1 — `nivelPrioridadEnColegio` con SEP** (familia prioritaria): Los Andes → 1 (hermano gana a SEP); San Martín / República / Simón Bolívar / Villa del Sol / Los Quillayes → 2 (la cuota SEP nivel 2 domina a funcionario 3 y exalumno 4).
3. **Paso 1 — sin SEP:** Los Andes → 1, República → 4 (exalumna), Villa del Sol → 3 (funcionario), San Martín / Los Quillayes → 5.
4. **Paso 2 — probabilidad por colegio (familia prioritaria):** Los Andes 92, San Martín 90, República 98, Simón Bolívar 90, Villa del Sol 88, Los Quillayes 90.
5. **Paso 3 — lista en orden de tabla:** `calcularResultado` asigna **Colegio Los Andes** (idx 1, nivel 1, prob 92, `detalles[0].estado === 'asignado'`).
6. **Paso 3 — escenario clave (San Martín 1º):** asigna **Colegio San Martín** (idx 1, nivel 2 por SEP, prob 90).
7. **Falso riesgo estratégico:** la probabilidad de San Martín es **90 en cualquier posición** de la lista (1º, en medio, último) y su nivel sigue siendo 2.
8. **Sin SEP + San Martín 1º:** 60 % < 65 → **no** queda en San Martín; la asignación cae en Los Andes (idx 2). Muestra que la condición SEP es lo que vuelve viable a San Martín como primera preferencia.
9. **Regla de asignación:** gana el primer colegio de la lista con prob **≥ 65** aunque haya uno mejor más abajo (Villa del Sol 65 vs. República 96 → asigna Villa del Sol; umbral inclusivo).
10. **Lista vacía:** `calcularResultado([])` → `error` presente, `asignado === null`, `detalles === []`.
11. **Núcleo protegido:** la tabla `probAsignacion` conserva sus 15 valores (`alta/media/baja` × niveles 1–5).
12. **Núcleo protegido:** `prioridadLabels` cubre los 5 niveles.

Los tests 7–9 y 11–12 son guardarraíles de regresión: si un cambio toca la tabla `probAsignacion`, el umbral 65, `nivelPrioridadEnColegio` o `casoPrioridades`, fallan con un mensaje que apunta al valor movido.

**No se tocó** `asignacion.js`, `PostulacionPage.jsx`, `SeguimientoPage.jsx`, `colegios.js` ni `incisos.js`; **no** se creó sección del plan, **no** se sumó ningún punto, **87/87 intacto**; sin impacto en `proyecto-tesis/`. No aplica actualización de `docs/planificacion/bitacora_flujo_postulacion_y_resultado.md` (no hubo cambio funcional del flujo).

**Validación:** `npm run lint` limpio (0 errores / 0 warnings), `npm run build` limpio, `npm test` → 12/12 verdes (2026-09-02).

## 25. Panel de "condiciones detectadas" + atajo "Cargar caso de ejemplo" en `/postulacion` (2026-09-02)

**Motivación:** duda del usuario — al postular a un/a hijo/a, el sistema debería **mostrar de inmediato las condiciones de prioridad que ya tiene asociadas** (SEP, PIE, hermano/a matriculado/a) en vez de pedir que se declaren, por realismo y para **reducir el tiempo de la sesión de prueba de usabilidad** (menos tipeo antes de llegar a lo que se testea). Alcance elegido: **panel + carga de caso, sin tocar el núcleo**.

**Trazabilidad:** `S4 (refinamiento)` — extiende la sección 21 ("`/perfil` es la fuente única de datos del estudiante", SEP como condición del Estado). **No se creó sección del plan, no se sumó punto, 87/87 intacto** (`plan_mejora_sae.md` e `incisos.js` sin cambios). **`asignacion.js` intacto** (`calcularResultado`, `probAsignacion`, `nivelPrioridadEnColegio`, tabla de probabilidades, umbral `>= 65`). Sin impacto en `proyecto-tesis/`. Bitácora del flujo: Bloque N.

### Cambios

**1. Panel `CondicionesDetectadas` (paso 1, `PostulacionPage.jsx`).** Apenas `loginOk`, InfoBox de solo lectura *"🔎 Esto es lo que el sistema ya sabe de tu hijo/a"*, antes de pedir región/datos. Contenido:
- **SEP** (si `perfilEstudiante.prioritario`) — "la determina el MINEDUC con el Registro Social de Hogares; vale en todos los colegios".
- **PIE vigente** (si `perfilEstudiante.pie`) — "da prioridad en los colegios que tengan programa PIE", con la frase explícita *"En este prototipo se muestra como información: todavía no se refleja en el porcentaje estimado"*.
- **Vínculos por establecimiento** — constante módulo `VINCULOS_DETECTADOS`, derivada de `colegios.js` `casoPrioridades` (hermano/a → Colegio Los Andes, exalumno/a → Escuela República de Chile, funcionario/a → Colegio Villa del Sol). Se muestran **solo con el caso de ejemplo cargado** (`perfilEstudiante.caso === 'munoz-gonzalez'`), cada uno con "se confirma cuando agregas ese colegio (paso 2)".
- Si no hay nada: "No hay condiciones de prioridad registradas… podrás declarar un vínculo con cada colegio en el paso 2".
- Cierre: enlace a `/perfil` + "en el sistema real, SEP y PIE llegan ya cargados; aquí se configuran en Mis datos solo para la simulación".

Se **eliminó** el InfoBox SEP-only que estaba gateado por `region && alumnoOk` (líneas ~1340–1367 previas): el panel nuevo lo cubre y aparece antes, sin duplicar el mensaje.

**2. `pie` en el contrato de `/perfil` (`PerfilPage.jsx`).** `localStorage['sae_react_perfil']` pasa a `{ nombre, rut, nivel, prioritario, pie }`. Bloque 2 retitulado **"2. Condiciones que el Estado ya tiene registradas"** con una segunda `criterio-card` (badge "PIE") junto a la de SEP; la card PIE dice explícitamente que en el prototipo **no cambia el porcentaje estimado**. `guardar()` persiste `pie`; el `sim-result` combina ambas condiciones ("SEP + PIE vigente"). Nota del pie ("¿Cómo se usan estos datos?") actualizada a "las condiciones SEP y PIE se muestran… como información, no como casillas". `cargarPerfilEstudiante()` de `PostulacionPage.jsx` ahora devuelve también `pie` y `caso` (forma estable; tolera `condiciones.pie` de perfiles antiguos).

**3. Atajo `Cargar caso de ejemplo` (paso 1, bloque `!loginOk`).** `<details className="post-demo">` colapsado, rotulado *"⚙️ Cargar caso de ejemplo (para la prueba de usabilidad)"*. Su botón llama `cargarCasoEjemplo()`, que:
- escribe en `PERFIL_KEY` el objeto `{ nombre:'Sofía Muñoz González', rut:'25.123.456-7', nivel:'4° básico', prioritario:true, pie:true, caso:'munoz-gonzalez' }` (constante módulo `CASO_EJEMPLO`);
- precarga estado: `alumnoRut`/`alumnoNombre`/`alumnoNivel`, `region:'RM'`, `comuna:'La Florida'`, `dirCalle:'Av. Los Aromos 123'`; `setPerfilEstudiante({...})`; `setLoginOk(true)`.
- **No** marca `declaraApoderado` ni `alumnoOk`: la persona sigue declarando apoderado/a, confirmando el nivel y agregando los 6 colegios con sus dos aceptaciones (pasos con valor de fidelidad y parte de lo que se observa).
- **Siembra `prioridadesPorColegio` desde `casoPrioridades` para los colegios ya en `lista`** (borrador guardado) — esos no pasan por `agregar()`, así que sin esto el modo "detección" del paso 2 no vería sus vínculos.

**4. Prioridad por colegio de solo lectura — "el sistema lo detecta, no lo pregunta" (`PrioridadColegioControl` reescrito).** Segunda observación del usuario: los tres chips *"¿Tienes alguna de estas prioridades…?"* del paso 2 se ven como un menú de ventajas para elegir; deberían mostrar lo que el sistema **ya resolvió**.
- **`hermano/a`: siempre de solo lectura** — lo verifica el sistema por RUN contra el registro de matrícula. Fila `✓ 👨‍👩‍👧 Hermano/a matriculado/a — verificado con el registro de matrícula` (o `— no detectado`).
- **`funcionario/a` y `exalumno/a`:** en modo normal siguen siendo **chips editables** ("declara si corresponde — el colegio lo verificará", los declara la familia y valida el colegio). Con el **caso de ejemplo cargado** (`prioridadDetectada = perfilEstudiante.caso === 'munoz-gonzalez'` → prop `soloDeteccion`), **todo** es de solo lectura: se listan los vínculos detectados con su procedencia, o *"No detectamos ningún vínculo con {colegio}. Aquí entras por tu cuota de estudiante prioritario/a (SEP) o por el sorteo general."*.
- **Corrección:** en modo `soloDeteccion`, un `<details>` *"¿Algo no calza? Corregir"* revela los chips editables (misma `onToggle` → `calcularResultado` responde). El contenedor pasa de naranja (acción pendiente) a azul (informativo) vía `.post-prio-colegio--deteccion`.
- Textos de introducción del paso 2 con variante `prioridadDetectada`: InfoBox *"¿Cómo funciona este paso?"*, leyenda *"Prioridades que puede tener tu familia en un colegio"* (antes *"…que puedes tener"*), InfoBox *"¿Dónde tienes esa prioridad?"*.
- **`asignacion.js` sin cambios:** solo cambia cómo se muestra/edita `prioridadesPorColegio`, que sigue alimentando `nivelPrioridadEnColegio` igual.
- **Fix draft-restore:** `prioridadesPorColegio` se **inicializa** vía `sembrarPrioridadesDeBorrador()` (lazy initializer) desde el borrador guardado — antes, un colegio restaurado de un borrador (p. ej. Colegio Los Andes tras recargar la página) quedaba "sin vínculo detectado" porque no pasa por `agregar()`. Ahora se siembra al montar, para cualquier perfil.

**5. Datos básicos del hermano/a en postulación de bloque (paso 1).** Al marcar la casilla del hermano/a aparece el bloque **"Datos del hermano o la hermana"** (nombre + RUN + nivel), *antes* de la InfoBox "Postulación familiar en bloque". `hermanoDatosOk` (`rutValido` + nombre ≥ 3 + nivel) se suma al `disabled` de "Vincular estudiante" (con `title` y `role="alert"`). Persistencia **aditiva**: `confirmar()` → `hermano: { nombre, run, nivel } | null` en `STORAGE_KEY`; el comprobante `.txt` y el resumen del paso 3 lo muestran. **NO entra en `calcularResultado`** — el prototipo simula una postulación a la vez. El atajo (punto 3) precarga el hermano = **Mateo Muñoz González, 7° básico** y marca la casilla.

**Refinamiento de microcopy (2026-09-03, bitácora Bloque P):** el bloque quedaba ambiguo sobre si se postulaba a los dos hijos. Se reencuadró: la **casilla** declara un hecho (*"{alumnoNombre} tiene un hermano o hermana que también postula este año"*), no una acción; la **InfoBox** dice explícitamente *"Ahora estás completando la postulación de {alumnoNombre}… en esta demo completas y ves solo la de {alumnoNombre}"*; la sublínea de los campos, la tarjeta del paso 1, el resumen del paso 3 y el `.txt` del comprobante aclaran que *"la postulación de {hermanoNombre} se hace por separado"*. Sin cambios de lógica.

**6. Variante "sin prioridad SEP" del atajo + fix visual `/seguimiento` + concordancia.** El usuario notó que **con la familia SEP el colegio N.°1 SIEMPRE queda asignado**: `nivelPrioridadEnColegio` devuelve ≤2 en cualquier colegio (SEP transversal) y `probAsignacion` nivel 2 = 88/90/98 según demanda, todo ≥ 65 (umbral). Las ramas "no quedaste en tu 1.ª opción" eran código muerto para un participante SEP.
- **`CASO_EJEMPLO_SIN_SEP`** (`{ ...CASO_EJEMPLO, prioritario: false, pie: false }`, mismo `caso`) + `cargarCasoEjemplo(cfg)` parametrizado. El `<details>` del atajo pasa a **dos botones**: "Familia Muñoz González (con SEP)" y "Variante sin prioridad SEP", con nota explicativa. Sin SEP, San Martín como 1.ª opción → nivel 5, demanda media → `probAsignacion(5,'media')` = **60** < 65 → **no** queda ahí → cae a Los Andes (hermano, 92 %) en preferencia 2 → `generarExplicacion` produce "No quedaste en tu primera opción porque…". Ese es el escenario para testear cómo la página comunica el peso de un colegio sin ventaja.
- `PrioridadColegioControl` gana prop **`tieneSEP`**: el texto de "sin vínculo" dice *"entras solo por el sorteo: no tienes ninguna prioridad en este colegio"* cuando no hay SEP, en vez de mencionar la cuota.
- **Fix visual `/seguimiento`:** `.seg-hero-img-wrap` tenía `height` fijo (280/200px) + `overflow: hidden` y recortaba el nombre del colegio (bloque `--solid` que fluye tras la ilustración). Se quitó el alto fijo (y el override de `@media`) → `height: auto`.
- **Concordancia:** `generarExplicacion` (`SeguimientoPage.jsx`) decía *"No quedaste en tus primeras 1 opcion"* → ahora *"No quedaste en tu primera opción"* (singular/plural, y con acento). Este mensaje aparecía por primera vez de verdad con la variante sin SEP.
- **`asignacion.js` intacto.** Recalibrar `probAsignacion` para que SEP no sea casi-garantía queda como decisión abierta (bitácora sec. 6 nº 9).

**CSS nuevo (`index.css`):** junto a `.post-direccion-block` — `.cond-detectadas`, `.post-demo` (+ `> summary`, `p`), `.post-hermano-datos`. Junto a `.post-prio-colegio__titulo` — `.post-prio-colegio--deteccion`, `.post-prio-colegio__detectadas`, `.post-prio-det` / `--on` / `--off`, `.post-prio-colegio__correccion`. Sin dependencias nuevas.

### Lo que NO cambió / gap abierto

> **Parcialmente superado por la sección 26 (Bloque O, 2026-09-03):** el caso Muñoz González ya **no** es SEP ni PIE, y San Martín pasó a demanda alta. Las líneas de abajo que dicen "Sofía entra por SEP" / "San Martín nivel 2 / 90 %" reflejan el estado anterior.

- **PIE no entra al cálculo.** `asignacion.js` no lee `pie`. Cerrar el gap (`caso_estudio_prueba_usabilidad_postulacion.md` §5/§9: PIE como cuota antes del nivel 1, solo en colegios con `nee.programa`) tocaría el **núcleo protegido** y probablemente la tabla `probAsignacion` → decisión pendiente del usuario (bitácora sec. 6 nº 9).
- `SeguimientoPage.jsx` y `calcularResultado` no se tocaron.
- Sin el caso de ejemplo cargado, `funcionario/a` y `exalumno/a` siguen siendo declaración editable por colegio (así lo pide el SAE real); solo `hermano/a` pasó a solo lectura para todos.
- **La postulación de bloque se captura pero se simula una sola** (`calcularResultado` corre solo para el estudiante principal). Hacer una asignación real para el hermano/a tocaría el núcleo — gap abierto, junto al del PIE.
- **Pendiente writing-agent:** el material de la prueba (`caso_estudio…`, `material_prueba_usabilidad_postulacion.pdf`, `guion_moderador_prueba_usabilidad.md`) ahora puede asumir el atajo "Cargar caso de ejemplo" en el guion del moderador; el PIE aparece como condición ya registrada en el panel del paso 1 y las prioridades por colegio salen resueltas de solo lectura en el paso 2 (con `<details>` de corrección).

**Fix visual `/seguimiento` (2026-09-02):** el hero del resultado (`.seg-hero-img-wrap`) tenía `height: 280px` (200px en móvil) + `overflow: hidden`; como `.seg-hero-img-content--solid` (nombre del colegio + dirección) **fluye después** de la ilustración (no está posicionado en absoluto), el nombre del colegio quedaba recortado. Se quitó el alto fijo del wrap (y el override de `@media`), dejándolo `height: auto`; la ilustración conserva su `height` propio. Solo `index.css`; sin cambios de lógica ni de `SeguimientoPage.jsx`.

**Validación:** `npm run lint` (0 errores / 0 warnings), `npm run build` (limpio; `PostulacionPage` ~58.6 kB / ~16.9 kB gzip) y `npm test` (12/12) limpios (2026-09-02). Verificado end-to-end en el navegador: el atajo deja el paso 1 precargado con `loginOk` **y la casilla de hermano/a marcada con los datos de Mateo Muñoz González, 7° básico**; el panel lista SEP + PIE + los 3 vínculos; en el paso 2, **San Martín** → "No detectamos ningún vínculo… cuota SEP o sorteo" (90 %), **Los Andes** → "✓ Hermano/a matriculado/a — verificado con el registro de matrícula" (92 %), sin chips editables; el `<details>` de corrección abre los chips y togglear "hermano/a" en San Martín sube el % a 96; el paso 3 muestra "👨‍👩‍👧‍👦 Bloque familiar con Mateo Muñoz González…" y `STORAGE_KEY` guarda `hermano: {…}`. Sin errores de consola.

## 26. El caso Muñoz González deja de tener cuota SEP; "colegio en mente" = sin vínculo + demanda alta (2026-09-03)

**Decisión del usuario:** quitar del caso la cuota SEP (y el PIE) porque no aportaba al estudio. El caso necesita un **"colegio en mente"** que la familia pone 1.º pero que **probablemente no obtenga** — demanda alta + sin prioridad destacada — para que surjan dudas del tipo *"¿lo pongo primero igual? ¿o el de mi otro hijo? ¿o uno más cerca?"*.

**Por qué (resumen; argumento completo en bitácora Bloque O):** en el SAE real la SEP es una **cuota** del 15 % modelada como sub-escuela (`investigacion_algoritmo_sae.md` §3.2), sobre-suscrita (54,7 % de postulantes para 15 % de cupos, §6) — **no** un rango en la fila. El modelo del prototipo la trataba como ~88–98 % en toda demanda, lo que (a) está mal en el mecanismo y (b) hacía que el colegio N.°1 siempre quedara asignado. Se descartó recalibrar `probAsignacion` (núcleo protegido → re-sync de la memoria); se resolvió por el caso.

**Cambios:**
- `src/data/colegios.js` — **Colegio San Martín: `demanda: 'media' → 'alta'`** + `postulantesAnterior` subido (básico 44→71) + vacantes básico 28–32 → 24–28.
- `PostulacionPage.jsx` — `CASO_EJEMPLO`: **`prioritario: false`, `pie: false`**. La familia Muñoz González ya no tiene condición transversal; solo los vínculos por colegio (hermano/a → Los Andes, funcionario/a → Villa del Sol, exalumno/a → República).
- Se **elimina** `CASO_EJEMPLO_SIN_SEP` y el doble botón de la sección 25 (N6): la variante sin SEP es **el** caso. Un solo botón "Cargar familia Muñoz González". `cargarCasoEjemplo()` sin parámetro. CSS `.post-demo__botones` / `.post-demo__nota` retirado.
- `sae-react/tests/flujo-postulacion.test.js` **reescrito** al caso sin SEP (San Martín 28 %; escenario clave invertido). El guardarraíl "núcleo protegido: la tabla probAsignacion" queda **idéntico** — la tabla no se tocó.

**Números del caso (tabla `probAsignacion` intacta):**

| Colegio | nivel · demanda | % |
|---|---|---|
| Los Andes (hermano/a) | 1 · alta | **92** — el seguro |
| **San Martín (ninguna)** | **5 · alta** | **28** — colegio en mente |
| República de Chile (exalumno/a) | 4 · baja | 96 |
| Simón Bolívar (ninguna) | 5 · media | 60 |
| Villa del Sol (funcionario/a) | 3 · alta | 65 — justo en el umbral |
| Los Quillayes (ninguna) | 5 · media | 60 |

**Escenario clave:** San Martín 1.ª opción → 28 < 65 → no queda → `calcularResultado` cae a Los Andes (2.ª opción, hermano, 92 %) → `generarExplicacion`: "…No quedaste en tu primera opción porque ese colegio tenía más postulantes con prioridad mayor…". La **cercanía** no da prioridad — se responde con microcopy (nota de dirección S22-1), no con la tabla.

**NO se tocó:** `probAsignacion`, umbral 65, `asignacion.js`, cifra 87/87. Los ejemplos de `%` en `PRIORIDADES_INFO` siguen válidos (escritos contra la tabla actual).

**Recorrido manual actualizado:** en `/perfil` **no** actives "estudiante prioritario/a"; el toggle PIE tampoco. Con el atajo "Cargar familia Muñoz González" queda así por defecto. En el paso 2, San Martín muestra **28 %** y *"entras solo por el sorteo: no tienes ninguna prioridad en este colegio"*.

**Pendiente writing-agent (grande):** `caso_estudio_prueba_usabilidad_postulacion.md` §1/§2/§3/§3.1/§8 asumen familia SEP + PIE y San Martín de "demanda moderada"; revisar también el ítem C3 del cuestionario. Más `material_prueba_usabilidad_postulacion.pdf` y `guion_moderador_prueba_usabilidad.md`. Y queda pendiente **argumentar por escrito de dónde salen los porcentajes de `probAsignacion`** (origen: heurística a ojo de `archivo/CLAUDE_v2.md` §3, sin calibración empírica; anclas para justificar: `investigacion_algoritmo_sae.md` §3.1/§3.2/§6).

**Validación:** `npm run lint` (0/0), `npm run build` (limpio), `npm test` (12/12) — 2026-09-03. Verificado end-to-end en navegador: atajo carga `{ prioritario:false, pie:false }`; panel del paso 1 lista solo los 3 vínculos; San Martín 28 % en el paso 2; con San Martín 1.º, `calcularResultado` asigna Los Andes en preferencia 2 y `/seguimiento` muestra "no quedaste en tu primera opción". Sin errores de consola.

## 27. Reescritura del simulador — DA-por-colegio + Monte Carlo (plan C, 2026-09-03)

**Autorizado explícitamente por el usuario.** La tabla `probAsignacion` (15 valores a ojo, `archivo/CLAUDE_v2.md §3`) no tenía calibración empírica y su regla ("primer colegio con prob ≥ 65 %; si ninguno, el mayor con aviso") **no representa la Aceptación Diferida** (sin umbral, por rondas, asignación estable). Se reemplazó por una simulación.

**`src/utils/simulacionSae.js` (nuevo):**
- **`PARAMS_POBLACION`** — multitud sintética. `pSep: 0.55` **anclado** (54,7 % prioritarios entre postulantes 2018, `investigacion_algoritmo_sae.md §6`); `pHermano: 0.10`, `pFuncionario: 0.02`, `pExalumno: 0.03` **estimaciones** (sin microdatos; ajustables); `cuotaSep: 0.15` (ley).
- **`simularCupo`** — un sorteo de cupo. `S = round((min+max)/2)` (vacantes en el punto medio), `A = postulantesAnterior` competidores. **Fase 1 cuota SEP:** prioritarios por `round(0.15·S)` cupos reservados, solo por sorteo (sub-escuela, §3.2). **Fase 2 pozo general:** no ubicados por (rango legal hermano<funcionario<exalumno<sorteo, sorteo).
- **`probabilidadCupo`** — Monte Carlo 1000 iteraciones, PRNG con semilla fija por (colegio, nivel), cacheado. **No depende del orden de la lista.**
- **`mulberry32`**, **`tramoFamiliaEnColegio`**, **`TRAMO_SIN_PRIORIDAD`**.

**`src/utils/asignacion.js` (reescrito):**
- Se **eliminaron `probAsignacion` y el umbral 65**.
- `calcularResultado(lista, perfil, nivelAlumno)`: `detalles[i].prob` = `probPorcentaje(probabilidadCupo(...))`; el **colegio asignado** sale de un **recorrido determinista** de la lista con `SEED_CASO = 20260903` (`simularCupo` por colegio, `rng` compartido — la familia "propone" en orden y para en el primero donde el sorteo la sienta). Fallback al de mayor `%` con `sinAsignacionEnPreferencias: true`.
- **`probPorcentaje(pRaw)`** acota a **[1, 99]** — un sistema con sorteo nunca garantiza ni prohíbe del todo un cupo (evita 0 %/100 %).
- Se conservan `nivelPrioridad`, `nivelPrioridadEnColegio`, `prioridadLabels`, `PRIORIDADES_POR_COLEGIO` y el vocabulario de `estado`.

**Ajuste de datos** (`colegios.js`, tras analizar resultados): Simón Bolívar y Los Quillayes tenían `postulantesAnterior`/vacantes ~1,2–1,4× (incoherente con "demanda media" → un/a sin-prioridad daba ~75 %). Se subieron a ~1,7× (básico: Simón Bolívar 42→60, Los Quillayes 48→62; otros niveles en proporción).

**Números del caso Muñoz González (4° básico, sin SEP), Monte Carlo 1000:**

| Colegio | vínculo · demanda | `%` nuevo | (tabla vieja) |
|---|---|---|---|
| Los Andes | hermano/a · alta | **99** | 92 |
| República de Chile | exalumno/a · baja | **99** | 96 |
| Villa del Sol | funcionario/a · alta | **99** | 65 |
| Simón Bolívar | — · media | **50** | 60 |
| Los Quillayes | — · media | **46** | 60 |
| San Martín | — · alta | **26** | 28 |

Lectura: **prioridad legal → ~99 %** (fiel: el SAE reserva a hermanos/funcionarios/exalumnos); **sin vínculo, manda la demanda** (alta → 26 %, media → moneda al aire). Escenario clave intacto: San Martín 1.º → no queda → Los Andes en 2.ª preferencia.

**Limitaciones v1 (declaradas en el header de `simulacionSae.js` y en `mapa_resultados_caso_munoz_gonzalez.md`):** DA *por colegio*, no multi-colegio (los demás postulantes no se desplazan entre colegios); sin cuota PIE ni alta exigencia académica; los 3 parámetros de vínculo son estimaciones (calibración con microdatos = paso siguiente, fuera de alcance).

**Tests:** `tests/flujo-postulacion.test.js` reescrito, 14 tests — snapshot calibrado de los 6 `%`, propiedades (prioridad ≥ 90; San Martín < 40; media 30–65), **strategy-proofness**, determinismo, escenario clave, guardarraíl de `PARAMS_POBLACION`/`SEED_CASO`/iteraciones.

**Validación:** `npm run lint` (0/0), `npm run build` (limpio), `npm test` (14/14) — 2026-09-03. Verificado end-to-end en navegador: los 6 `%` del flujo coinciden con el snapshot; `/colegio` y `/algoritmo` sin errores de consola.

**Pendiente writing-agent (grande):** `proyecto-tesis/capitulos/03_metodologia.tex` describe el simulador como "lógica Gale-Shapley simplificada" con estimación por (demanda, prioridad). Reescribir esa parte del Cap. 3 con el modelo nuevo, sus limitaciones declaradas y los parámetros de población como supuesto metodológico. **Subsume** la tarea previa de "argumentar de dónde salen los porcentajes".

---

## 28. Paso 1 de `/postulacion` en modo verificación (2026-09-06 — refinamiento S22-12 / S4)

**Decisión del usuario (opción "a", comportamiento permanente).** El SAE real precarga identidad y domicilio del/de la estudiante desde ClaveÚnica; la familia los **verifica**, no los tipea. Extiende el patrón de la sección 25 (Bloque N, "el sistema lo detecta, no lo pregunta") de las prioridades a la identidad.

**`PostulacionPage.jsx`:**
- `IDENTIDAD_CLAVEUNICA_DEMO` — identikit ficticio (Sofía Ríos Contreras, RUN, 4° básico, RM / La Florida / Pasaje Los Copihues 145, y un `hermano`: Tomás Ríos Contreras, 7° básico) que hace de "lo que devolvió ClaveÚnica" para un visitante sin datos en `/perfil`.
- `ingresarConClaveUnica()` — al pulsar "Ingresar con ClaveÚnica" o "Continuar con RUT": `setLoginOk(true)` + siembra nombre/RUN/nivel/región/comuna/calle y, si hay `hermano` en el identikit, sus datos + `setPostulaHermanos(true)`, todo con `((v) => v || DEMO.x)` (no pisa `/perfil` ni el caso de ejemplo). Ambos botones de login lo usan.
- Estado `editandoIdentidad` (default `false`). Con `false`: identidad + dirección se muestran como **recap de solo lectura** (`<dl class="post-identidad-verif__lista">`: Nombre / RUN / Nivel / Domicilio) + botón "Algún dato no está bien — corregir". Con `true`: los inputs editables + el `post-direccion-block` + botón "Listo, datos verificados". Título del bloque: "Verifica los datos del estudiante".
- **Se conservan como pasos activos (visibles, no dentro del "corregir"):** la confirmación explícita del nivel (S22-12, "Verifica el curso"), la casilla "Declaro ser apoderado/a legal" (no se premarca) y la **postulación en bloque del hermano/a**: la casilla "tiene un hermano/a que también postula" aparece **marcada** y sus campos **rellenados** desde ClaveÚnica, para que la familia confirme explícitamente esa postulación (encabezado "Verifica los datos del hermano o la hermana"). La casilla es interactiva: se puede quitar si el Estado detectó mal.
- **La lista de colegios se arma desde cero en cada visita (2026-09-06).** Se retiró la persistencia del borrador reanudable (antes `sae_react_postulacion_draft_list`, S22-9): `cargarBorradorInicial`/`sembrarPrioridadesDeBorrador`, el `useEffect` de guardado, `borradorCargado` + el aviso "Retomaste tu borrador", y el badge "✓ Borrador guardado" (`.post-draft-badge`). `lista` y `prioridadesPorColegio` arrancan en `[]` / `{}`. Navegar entre los 3 pasos conserva la lista (estado React); recargar o volver a entrar la vacía. Motivo: la prueba comparativa entrega una lista fija y no debe arrastrar estado entre participantes. `limpiarTodo()` (en el `<details>` de la demo) ahora solo borra `PERFIL_KEY` + `STORAGE_KEY`. **Plan:** inciso 22-9 reformulado, se mantiene ✅, 87/87 sin cambio; Cap. 3 Tabla 3.1 requiere un ajuste de redacción (writing-agent).
- `index.css`: `.post-identidad-verif` + `.post-identidad-verif__lista` (grid responsive, colapsa a 1 columna < 420px).

**No se tocó** `asignacion.js` / `simulacionSae.js` / la cifra 87/87. `npm run lint` (0/0), `npm run build` (limpio, `PostulacionPage` 63.4 kB), `npm test` (14/14) — 2026-09-06. Verificado end-to-end en navegador por inspección de DOM.

**Pendiente writing-agent / material (fase F1):** `03_metodologia.tex` §3.5/§6.2, `caso_estudio_prueba_usabilidad_postulacion.md` (tareas 1 y 3) y `guion_*` — la tarea de identificación pasa de "rellenar" a "verificar los datos precargados". Sube la fidelidad frente a `analisis_video_paso_a_paso_sae.md` brecha B. Bitácora del flujo: Bloque S.

---

## 29. Correcciones tras la auditoría independiente (2026-09-08)

`docs/auditoria_independiente_sae_2026-09-08.md` (inspección de código y docs; **no la escribió este proyecto, no editarla**) planteó hallazgos reales. Se ejecutó un subconjunto acotado; el resto queda como decisión del autor o trabajo posterior. Detalle y trazabilidad a guías en la **bitácora del flujo, Bloque T**.

### Cambios de código

| # | Archivo | Cambio |
|---|---|---|
| **T1** | `src/utils/asignacion.js` | **Sorteo del recorrido independiente por colegio.** `calcularResultado` creaba **un** `mulberry32(SEED_CASO)` y lo consumía recorriendo la lista en orden: como cada `simularCupo` gasta `3·postulantesAnterior + 1` llamadas a `rng()`, mover un colegio cambiaba su tramo del flujo pseudoaleatorio y podía cambiar su desenlace *queda/no queda* — incoherente con la regla real *Multiple Tie-Breaking* (`investigacion_algoritmo_sae.md` §3.2). Ahora cada colegio del recorrido usa `mulberry32((SEED_CASO ^ (d.id * 0x9e3779b1)) >>> 0)`, igual que `probabilidadCupo` para el `%`. El `%` por colegio ya era independiente del orden; esto lo alinea para el sorteo puntual. **Escenario canónico (San Martín 1.º → Los Andes 2.ª preferencia) y snapshot de `%` (99/99/99/50/46/26) intactos.** |
| **T2** | `src/pages/SeguimientoPage.jsx` | **El fallback deja de narrarse como asignación real.** Si ningún colegio de la lista sienta a la familia, `calcularResultado` marca el de mayor `%` como `asignado` + `sinAsignacionEnPreferencias: true`. `generarExplicacion` **no** miraba la bandera y decía *"Quedaste en el {colegio}… a través del sorteo público y transparente"* (cupo inexistente + lenguaje de "tómbola"). Firma nueva `generarExplicacion(asignado, sinAsignacion)`: sin cupo → *"el sistema recorrió tu lista y ningún colegio te dejó un cupo… en el proceso real pasarías al Periodo Complementario… {colegio} es el de mayor probabilidad estimada ({p}%), pero eso no es una asignación"*. El `badge` y la línea de preferencia del hero, y el bloque *"¿Qué significa no quedar en tu primera opción?"*, se condicionan a `!sinAsignacion`. **No dispara en el caso canónico** (Los Andes sienta al 99 %); es un bug latente. |
| **T3** | `src/utils/simulacionSae.js` | La clave de caché de `probabilidadCupo` (`id\|nivel\|esSep\|general\|iteraciones`) omitía `params`; se le añadió un hash de los 5 parámetros de población. Bug latente (la app no pasa `params` custom). |
| **T4** | `src/pages/PostulacionPage.jsx` | Stepper del flujo con `role="progressbar"` + `aria-valuemin/max/now/text` (el plan 20.2 lo pedía y faltaba); se conserva `aria-current="step"` por paso. |
| **T5** | `tests/flujo-postulacion.test.js` | 14 → **16 tests**: (a) *fallback* — `calcularResultado([SAN_MARTIN])` → `sinAsignacionEnPreferencias: true`, `asignado.id === SAN_MARTIN`, `estado === 'asignado'`, `prob === 26`; (b) *independencia por colegio* — San Martín 1.º nunca sienta y el desenlace no cambia con la cola de la lista. Comentario en el test: con los 6 colegios del caso no se puede "alcanzar" un colegio en posición > 1 (San Martín es el único que no sienta), así que la independencia total es estructural, no observable. |

**Validación:** `npm run lint` (0/0), `npm run build` (limpio; `PostulacionPage` 64.16 kB, `SeguimientoPage` 15.52 kB, ningún chunk > 500 kB), `npm test` (16/16) — 2026-09-08.

### Cambios de documentación (T6 — sin tocar `sae-react/`)

La cifra **"87/87 puntos aplicables (100 %)"** no era reproducible desde `plan_mejora_sae.md`: sus tablas tienen **102 filas numeradas** (77 en S1–S20, 10 en S21, 15 en S22); el histórico "62" para S1–S20 nunca cuadró con las 77 visibles y no hay tabla de consolidación 102→87; y varias filas ya estaban ⚠️/❌ (5.2, 5.3, 8.2, 14.2, 14.3, 10.1). **4 filas no aplican** (4.3 panel inexistente, 8.1 HTTP→HTTPS, 8.2 cabeceras, 9.3 dominio `www`) → **98 requisitos aplicables**.
- `plan_mejora_sae.md`: nueva "Nota sobre el conteo (2026-09-08)"; el bloque "No aplica — 1 punto" pasa a "4 puntos".
- Memoria (`00_resumen.tex`, `03_metodologia.tex` nota tras Tabla 3.1 + "Estado actual", `04_resultados.tex`, `06_conclusiones.tex`): "el 100 % / 87 de 87" → "la totalidad de los puntos aplicables… a nivel de código", con el conteo agregado pendiente de re-tabular fila por fila. Además, `03_metodologia.tex` gana una fila de septiembre en la Tabla 3.1 (reescritura del modelo Monte Carlo) y la nota post-tabla deja de afirmar que "no se alteró la lógica de asignación" (Bloque R sí la reescribió); la descripción del caso deja de decir que activa "la cuota del 15 %".

### No hecho (decisión del autor / trabajo posterior)

Teclado en el autocomplete de `InicioPage`; reclasificar/implementar videos y tutoriales de `/algoritmo`; decidir si PIE y hermanos-en-bloque entran al modelo o se retira la afirmación; unificar consecuencias de aceptar/rechazar (`/seguimiento` vs `/proceso`); invalidación efectiva del comprobante al modificar; limpieza de CSS huérfano / breakpoint 768 px / quick cards / "foto real"; **reescritura mayor de §3.5** (prueba formativa N=8 → estudio comparativo entre-sujetos N≈30) — sigue en el roadmap F1 y en `prompt_pendientes_revision_caso_sin_sep.md`. (`material_prueba_usabilidad_postulacion.pdf` ya se regeneró el 2026-09-09, con `material_…md` como fuente.)

---

## 30. Explicación del resultado en `/seguimiento` según `caso_estudio §3.2` (2026-09-09)

**Origen:** la reflexión de `docs/investigacion/caso_estudio_prueba_usabilidad_postulacion.md` §3.2 — argumento técnico de por qué la familia del caso no queda en el Colegio San Martín (fila única del colegio por grupos de prioridad legal + sorteo por colegio; la familia en el último grupo; cuenta cupos − postulantes con prioridad = remanente; estabilidad = rechazo justo; strategy-proofness; garantía de recorrido) y su **traducción para el usuario** según HAX / PAIR-ET / NNG-XAI / BROOK / RISK-NUM. Se llevó el texto B de §3.2 al copy real. **Refinamiento de S15-3** (explicación contextualizada del resultado); no crea sección del plan; `asignacion.js` / `simulacionSae.js` / snapshot de `%` / cifra de la matriz intactos. Bitácora del flujo: **Bloque U**.

**`src/pages/SeguimientoPage.jsx` — `generarExplicacion`:**
- Firma nueva `generarExplicacion(asignado, sinAsignacion = false, detalles = [])`; el call site pasa `resultado?.detalles ?? []`.
- **`asignado.idx > 1` (no quedó en su preferencia de más arriba):** con `previas = detalles.filter(d => d.idx < asignado.idx && d.estado !== 'no_evaluado')`. Si hay **una** previa y su `nivel > 2` (sin vínculo): (1) "Al {colegio}, tu {ordinal} opción, postularon más familias que los cupos… no tenías un vínculo (hermano/a, funcionario/a, exalumno/a) ni la reserva del 15 %… competías por los cupos que quedaban" (BROOK + HAX G11/G5-G6); (2) "La probabilidad estimada de quedar ahí… era de {prob} de cada 100" (RISK-NUM); (3) "Entre las familias en tu misma situación… cada establecimiento elige con su propio sorteo, el mismo para todas… ese sorteo vale **solo para el {colegio}**: no afectó tus posibilidades en los demás" (trato igual + strategy-proofness; "sorteo" describe el mecanismo, criterio 2026-09-07). Si `nivel ≤ 2` (tenía prioridad pero `sin_cupos`): "tenías prioridad, pero postularon tantas familias con esa prioridad o mayor que los cupos no alcanzaron". Si hay **varias** previas: una frase combinada compacta.
- Cierre BROOK: "Por eso el sistema **siguió con tu lista** y te asignó al {asignado}. El SAE reparte los cupos que existen: no puede crear cupos nuevos ni asegurar la primera opción cuando hay más familias que vacantes".
- **Formato de frecuencia** "X de cada 100" en toda la prosa de la función (incluida la del asignado y la rama `sinAsignacion`). Los chips/stats del hero y del detalle por preferencia siguen en "%".
- **Rama `default` (nivel 5, quedó por el desempate sin vínculo):** reencuadrada — ya no encabeza con "a través del sorteo público y transparente… desempate aleatorio"; ahora "no tenías un vínculo… competías con las familias en tu misma situación… cada colegio elige con su propio sorteo, el mismo para todas — y este año tu cupo salió". `prioridadLabels[5]` (string compartido con `/algoritmo`) **no se tocó**.
- Constante nueva `ORDINALES = ['primera'…'sexta']`.

**Tarjeta "¿Qué significa no quedar en tu primera opción?"** (`asignado.idx > 1 && !sinAsignacion`): párrafo nuevo de strategy-proofness — "Poner ese colegio primero en tu lista no te quitó ninguna posibilidad en los demás: cada establecimiento revisa tu postulación por separado, sin importar en qué lugar de tu lista lo pusiste".

**Validación:** `npm run lint` (0/0), `npm run build` (limpio), `npm test` (16/16) — 2026-09-09. Verificado en navegador (`/seguimiento` con el payload del caso canónico Sofía: San Martín 1.º 26 / Los Andes 2.ª 99): las 6 frases nuevas aparecen en orden, sin errores de consola.

**En el estudio comparativo:** toda esta explicación es **exclusiva de la condición A**; la condición B (F3, sin implementar) solo mostrará "quedaste en {colegio}". Ítems del instrumento que la miden: C4, C5, J2 (comprensión/justicia del "por qué no San Martín"), F3 + abierta A1 (strategy-proofness).

---

## 31. `ResultadoProvisional` reformulado + inventario de la capa de explicabilidad para F3 (2026-09-09)

### `ResultadoProvisional` — de "pronóstico" a "ilustración de la regla"

**Origen:** duda del usuario — el recuadro "Con este orden, ¿dónde quedarías?" (`PostulacionPage.jsx` ~566, render en paso 2 ~2055 y paso 3 ~2189) **no existe en una postulación real** y "predice un resultado sin ejecutar el algoritmo". Diagnóstico: sí ejecuta el algoritmo (`calcularResultado`), pero presentaba una simulación con `SEED_CASO` fijo como un **pronóstico confiado** (*"la estimación te deja en {X}… tu cupo es muy probable ({p} de cada 100)"*), actualizado en vivo al arrastrar, con el descargo (*"es una estimación… el resultado real en octubre puede salir distinto"*) **oculto tras el modo tutorial**. Contra **Arteaga et al. 2022** (las familias del SAE sobreestiman sus chances: subjetiva ≈76 % vs. objetiva ≈44 %), **PAIR-ET** (calibrar la confianza, no maximizarla) y **BROOK** (gestión de expectativas).

**Cambios (`PostulacionPage.jsx`):**
- Encabezado `"Con este orden, ¿dónde quedarías?"` → **`"¿Qué hace el orden de tu lista?"`**; icono `🎯` → `📋`.
- El cuerpo **encabeza con la regla** (el sistema recorre tu lista en este orden; cambiar el orden no cambia tus probabilidades por colegio, solo en cuál preferencia quedas; conviene poner primero el que más quieres). El colegio queda en una frase secundaria (*"con los datos del año pasado, este orden te llevaría a {X}, tu preferencia N° {idx}"*), **sin** *"muy probable"* ni repetir el `%`.
- El descargo pasa a estar **siempre visible** (se eliminó el gate `modoTutorial` y el prop `modoTutorial` del componente y de los dos call sites): *"Es una simulación con los datos del año pasado, no tu resultado. El sistema lo calcula en octubre, con las postulaciones reales de este año… Muchas familias creen tener más posibilidades de las que después resultan; por eso conviene incluir varios colegios."* (nota anclada a Arteaga).
- Se conserva el enlace *"Ver cómo se decide"* → `/algoritmo` (PAIR: explicaciones parciales) y la rama `sinAsignacion` (BROOK: "agrega colegios con más vacantes").
- El comentario del componente marca que **es explicabilidad del prototipo, no existe en el SAE real → se oculta en la condición B**.

**Trazabilidad:** `S22-13 (refinamiento)` · Bloque Q de la bitácora del flujo. `asignacion.js`/`simulacionSae.js`/cifra de la matriz intactos. `npm run lint` (0/0), `npm run build` (`PostulacionPage` 63.90 kB), `npm test` (16/16) — 2026-09-09. Sincronizados `caso_estudio…md` §6.2 y `guion_moderador…md` (Tarea 4) que citaban el nombre del recuadro.

### Inventario de la capa de explicabilidad (spec de la condición B — F3)

Nuevo **`docs/planificacion/f3_modo_control_inventario.md`**: identifica **todos** los componentes/piezas que aportan explicabilidad y define, por pieza, qué hace la condición **B** del estudio comparativo — **OCULTAR** (explicabilidad pura, sin equivalente real), **SIMPLIFICAR** (dejar el núcleo de fidelidad, quitar la capa pedagógica) o **MANTENER** (fidelidad al SAE real, va en A y B). Invariante: **el resultado de asignación es idéntico en A y B** (mismo `SEED_CASO`, mismo `calcularResultado`); B solo **no muestra** la capa. Enfoque técnico recomendado: contexto `ModoEstudio` (`esControl`) leído de `?modo=control` + flag de sesión, con una mini pantalla `/estudio` para el moderador; la lista de 6 colegios se entrega en papel, no por URL. Resumen en la bitácora del flujo §7.7. **Implementado el 2026-09-09 — ver §32.**

---

## 32. F3 implementada — modo control / condición B (2026-09-09, bitácora Bloque V)

**Qué es:** la condición de control del estudio comparativo (§7 de la bitácora del flujo) — el mismo flujo de postulación **sin la capa de explicabilidad**, para aislar su efecto sobre comprensión / confianza / percepción de justicia. Implementación del spec de §31 / `f3_modo_control_inventario.md`.

**Mecanismo — un switch, no una copia:**

| Archivo nuevo | Rol |
|---|---|
| `src/context/ModoEstudioContext.jsx` | `ModoEstudioProvider` (montado dentro de `<BrowserRouter>`, arriba de todo). `useModoEstudio()` → `{ modo: 'full'\|'control', esControl: boolean, condicion: 'A'\|'B' }`. Lee `?modo=control` / `?modo=full` (`useSearchParams`), persiste en `sessionStorage['sae_modo_estudio']`. Default `'full'` → fuera del estudio el prototipo se comporta igual que siempre. Helper `fijarCondicion(cond, n)`: fija el modo + borra `sae_react_postulacion` / `sae_react_perfil`. |
| `src/pages/EstudioPage.jsx` (`/estudio`, lazy) | Pantalla del moderador (uso interno, no para el/la participante). `condicionDe(n)` = `n % 2 === 1 ? 'A' : 'B'` (impares → A, pares → B; se estratifica aquí si hace falta). "Empezar" → `fijarCondicion` + `window.location.href = '/'` (recarga completa, **sin query en la barra** → ceguera del participante). |

**Cableado de `esControl` (todo es "ocultar/simplificar cuando `esControl`"):**

- `App.jsx` — monta `<ModoEstudioProvider>`, ruta `/estudio` + entrada SEO.
- `Navbar.jsx` — el ítem `{ to:'/algoritmo', soloA:true }` se filtra (`visibles`).
- `AlgoritmoPage.jsx` — `if (esControl) return <Navigate to="/" replace />`.
- `InicioPage.jsx` — `pasosRapidos` quita el paso a `/algoritmo` (2 pasos en B).
- `ProcesoPage.jsx` — componente `EnlaceAlgoritmo` (lee el contexto) reemplaza los 2 `<Link to="/algoritmo">` → `null` en B.
- `TourContext.jsx` + `GuidedTour.jsx` — `pasos` se filtra por `page !== '/algoritmo'` (**12 → 8** pasos en B); el provider expone `pasos` por contexto (`GuidedTour` ya no importa `tourPasos`); el paso `final` reescribe su texto para no mencionar "el algoritmo" ni "simular tu caso".
- `PostulacionPage.jsx` — `ResultadoProvisional` → `return null`; `ColegioAnalisis` oculta el chip `tut-prob` y `ProbabilidadVisual`; InfoBox "Antes de empezar: cómo se decide tu resultado", InfoBox "Consejo: ordena por tu preferencia real", el 2.º `<p>` de "¿en qué orden se revisan las prioridades?" (se conserva la lista legal) y la coletilla "por eso el % cambia" se ocultan; paso 3 oculta el badge de probabilidad, la explicación tutorial, el "te asignarían aquí" y el hint "los porcentajes son estimaciones".
- `SeguimientoPage.jsx` — oculta: enlace a `/algoritmo` del estado vacío, stat "Probabilidad {prob}%" del hero, tarjeta "¿Por qué te asignaron este colegio?" (`generarExplicacion`), tarjeta "¿Qué significa no quedar en tu primera opción?". Simplifica: "Detalle por preferencia" → solo "✅ Asignado" en la preferencia que corresponde (sin `estadoLabel` ni `%`); comprobante `.txt` sin estado por-preferencia salvo "— Asignado".
- `ColegioPage.jsx` — oculta `.probviz-block` y `vacantes-infobox` (esta última con enlace a `/algoritmo`).
- `ChatAyuda.jsx` — **sin cambios** (decisión): el FAQ describe el SAE real en términos neutros (proceso, prioridades por ley, sorteo con notario), es contenido que la vitrina oficial también tiene; se deja idéntico en A y B para no empobrecer el control.

**Invariante verificado:** `asignacion.js` / `simulacionSae.js` / `SEED_CASO` **no se tocaron** → el resultado de asignación es **idéntico** en A y B (Sofía → San Martín 1.º 26 → Colegio Los Andes 2.ª 99). El guardarraíl de 16 tests sigue cubriendo el motor.

**Validación:** `npm run lint` (0/0), `npm run build` (limpio; `index` 261 kB, `EstudioPage` 2.15 kB), `npm test` (**16/16**) — 2026-09-09. Navegador: A (`?modo=full` / default) y B (`?modo=control` y vía `/estudio` con nº par) — Navbar, `/algoritmo` (redirige), tour (8 pasos), `/postulacion` paso 1, `/estudio` (proyección de condición correcta, redirección sin query, limpieza de `localStorage`). El switch funciona en ambos sentidos.

**Ajustes respecto del inventario:** `ChatAyuda` pasó de "SIMPLIFICAR" a MANTENER; `/comparador`, "Ordenar por: demanda", `PrioridadModal`, la frase "sin vínculo" y el aviso de lista corta se dejaron como en A (borderline; recorte sin beneficio claro). `f3_modo_control_inventario.md` §2 registra el estado real.

**Pendiente writing-agent:** `03_metodologia.tex` §3.5 describe la condición B como implementada (no "planificada"). Queda **F2** (endurecer la explicabilidad de A).

---

## 33. Calibración de las bandas de probabilidad del resumen del paso 3 (2026-09-10, bitácora Bloque W)

**Origen:** revisión visual del usuario sobre el resumen por colegio del paso 3 de `/postulacion` (condición A). Rotulaba todo `< 60 %` como *"🔴 Probabilidad baja"*, con un texto idéntico repetido que además afirmaba *"porque tiene alta demanda para tu nivel de prioridad"* incluso en colegios rotulados *"media demanda"* dos líneas más arriba. Un ~50 % (moneda al aire) mal calibrado induce el mismo error de expectativas que el resto del flujo corrige (**Arteaga et al. 2022**).

**Cambios (solo microcopy + clases CSS; `asignacion.js` / `simulacionSae.js` / snapshot de `%` intactos):**

- **Nueva banda "⚖️ Resultado parejo" (40–59 %)** en el `resultado.detalles.map` del paso 3 (`PostulacionPage.jsx` ~2284), entre "🟡 Más probable que no" (60–79) y "🔴 Probabilidad baja" (< 40). Texto: *"…puede pasar o no. En este colegio no tienes un vínculo que te dé prioridad, así que compites por los cupos que quedan."*
- **Banda baja (< 40)** usa la demanda real del colegio (`d.demanda`) en vez de afirmar "alta demanda"; el consejo *"suma algún colegio de demanda más baja"* queda solo aquí (antes *"agrega colegios con demanda media o baja"* aparecía también sobre colegios de demanda media — circular).
- **Umbral de color unificado a 40 %** (`≥ 80` verde · `40–79` ámbar · `< 40` rojo) en tres sitios que estaban en 60: `probClass` del chip del paso 3 (~2248), `probClass` de `ColegioAnalisis` (paso 2, ~661) y `claseProb` de `components/ProbabilidadVisual.jsx` (~12). Antes una barra al 50 % salía roja.
- **Microcopy menor:** *"chances"* → *"posibilidades"*; *"Muy buena probabilidad"* → *"Probabilidad alta"*; *"Certeza muy alta"* → *"Casi segura"*; denominador uniforme *"De cada 100 postulantes en tu misma condición…"* en todas las bandas.

**Validación:** `npm run lint` (0/0), `npm run build` (limpio), `npm test` (16/16) — 2026-09-10. Navegador (caso canónico, lista fija): San Martín 26 → 🔴 `tut-prob--baja`; Simón Bolívar 50 / Los Quillayes 46 → ⚖️ "Resultado parejo" `tut-prob--media` (ámbar, ya no rojo); 99 → ✅ "Probabilidad alta" / 🟢 "Casi segura". Consistente entre chip del paso 2, barra `ProbabilidadVisual` y resumen del paso 3. Todo el bloque está oculto en la condición B (F3, `esControl`).

---

## 34. Enriquecimiento de la ficha de resultado `/seguimiento` (2026-09-10, bitácora Bloque X)

**Origen:** revisión de la ficha de resultado contra las guías (`docs/planificacion/propuestas_ficha_resultado.md`). De 7 propuestas, el usuario eligió implementar 5. Todo **condición A** (`!esControl`); en la condición B la ficha queda como estaba. Solo `SeguimientoPage.jsx` + CSS; `asignacion.js`/`simulacionSae.js` intactos.

| # | Qué se agregó | Ubicación | Guía |
|---|---|---|---|
| **X1** | Tarjeta **"Qué sigue ahora"**: 3 pasos con fecha (aceptar/rechazar 15–21 oct · matrícula 9–22 dic · Complementario 10–17 nov) + aviso naranja *"si no entras antes del 21 de octubre, se acepta automáticamente"*. | tras el bloque aceptar/rechazar (~455) | GOV.UK (confirmation: "qué ocurre después") · BROOK · HAX G16 |
| **X2** | Tabla **"por qué te asignaron este colegio"** de 2 filas (no obtenida → *No alcanzó* / asignada → *Cupo*) delante de los párrafos; `generarExplicacion` pasa a `<details>` "Ver la explicación completa". Helper `comparacionResultado(asignado, sinAsignacion, detalles)` (~123). Solo si `asignado.idx > 1 && !sinAsignacion`. | tarjeta "¿Por qué te asignaron…?" (~491) | HAX G11/G4 · divulgación progresiva (Google) |
| **X3** | **Contrafactual concreto** en "¿Qué significa no quedar…?": *"si hubieras puesto {colegio} primero, habrías quedado igual ahí…"*. Los 3 párrafos quedan más cortos. | tarjeta `idx > 1 && !sinAsignacion` (~525) | PAIR (explicación específica) · caso_estudio §3.2 |
| **X4** | Bloque `.seg-consecuencias` bajo los botones: *"Si aceptas… / Si rechazas: … solo lista de espera de {preferencias más arriba}; si no se libera cupo puedes quedar sin colegio"*. | tarjeta "¿Aceptas esta asignación?" (~340) | HAX G16 (consecuencia antes de la acción) |
| **X5** | El desplegable por preferencia suma *"El año pasado: N postulantes para X–Y vacantes en {label}"* + *"Tu prioridad aquí: …"* (usa `vacantesDeNivel(col, data.alumno.nivel)`, importado de `asignacion.js`). | `seg-pref-item__detail` (~597) | HAX G2/G11 |
| **X0** | **Fidelidad (en A y B):** `SeguimientoPage.jsx` tenía dos fechas desalineadas con `/proceso` → corregidas: aceptar/rechazar *"hasta el 21 de octubre de 2026"* (era "15 de noviembre"); matrícula *"entre el 9 y el 22 de diciembre de 2026"* (era "antes del 30 de noviembre"). | ~342, ~434 | fidelidad (`ProcesoPage.jsx`) |

CSS nuevo en `index.css` tras `.result-explanation`: `.seg-consecuencias`, `.seg-next-list` / `.seg-next-alerta`, `.seg-porque-tabla` (+ `__ok` / `__pref`) / `.seg-porque-detalle`.

**Validación:** `npm run lint` (0/0), `npm run build`, `npm test` (16/16) — 2026-09-10. Navegador: caso canónico (Sofía → San Martín 1.º 26 → Los Andes 2.ª 99) en A y en B, y a 375 px (sin desborde; la tabla X2 encaja).

**No implementado (decisión con la profesora):** X6 (icon array del "no quedaste" en la 1.ª opción), X7 (lista de espera concreta con referencia de movimiento). X1 y X4 son *borderline* fidelidad: si se quieren también en la condición B, es quitar el `!esControl` de esos dos bloques.

---

## 35. Módulo de verificación del hermano/a unificado con el del/de la estudiante (2026-09-13, bitácora Bloque Y)

**Origen:** feedback de la profesora guía (captura de `/postulacion` paso 1). El bloque del/de la estudiante mostraba un recap de solo lectura (Nombre/RUN/Nivel/Domicilio) + "Algún dato no está bien — corregir" (Bloque S, modo verificación). El bloque del hermano/a, pese al título "Verifica los datos del hermano o la hermana", mostraba directo los `<input>`/`<select>` editables — sin el paso de verificación. Falta de claridad por dos tratamientos distintos del mismo tipo de dato.

**Cambio:** `PostulacionPage.jsx` gana un componente local `VerificacionDatosCard({ campos, hint, onCorregir, corregirLabel })` (recap `<dl>` + botón "corregir"), usado en **ambos** bloques:
- Estudiante: migrado a `VerificacionDatosCard` (mismo comportamiento que antes).
- Hermano/a: ahora usa el mismo componente — recap (Nombre/RUN/Nivel) → "corregir" → los mismos 3 campos editables de antes → botón nuevo **"Listo, datos verificados"** (mismo texto que ya cerraba la edición del/de la estudiante) → vuelve al recap. Estado nuevo `editandoHermano` (arranca `false`).

**Validación:** `npm run lint` (0/0), `npm run build`, `npm test` (16/16) — 2026-09-13. Navegador: identidad demo genérica (Sofía Ríos Contreras / hermano Tomás Ríos Contreras, `IDENTIDAD_CLAVEUNICA_DEMO`) y caso Muñoz González — recap correcto, ciclo corregir↔verificado sin errores de consola, sin desborde a 375 px.

**Sin impacto:** `asignacion.js`/`simulacionSae.js` intactos; el hermano/a sigue sin entrar en `calcularResultado` (aditivo, como siempre).
