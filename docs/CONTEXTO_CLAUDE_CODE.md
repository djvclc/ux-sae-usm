# Contexto para Claude Code — Proyecto SAE UX
**Fecha:** 2026-08-26 (prioridad por colegio en el flujo de postulación — refinamiento S22-11)  
**Estado del proyecto:** v4.5 — 87/87 puntos aplicables implementados (100%); S22 optimizado  
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
│   │   ├── PerfilPage.jsx       # Datos del apoderado
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

## 3. Estado actual — 87/87 puntos aplicables implementados (100%)

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
| 2 | Colegio San Martín | Maipú | Media |
| 3 | Escuela República de Chile | La Florida | Baja |
| 4 | Liceo Técnico Simón Bolívar | Puente Alto | Media |
| 5 | Colegio Villa del Sol | Peñalolén | Alta |
| 6 | Escuela Básica Los Quillayes | La Florida | Media |

Cada colegio tiene (esquema v2 — 2026-07-30): nombre, rbd, director, dependencia, orientacion, dirección, comuna, distanciaBase, niveles, vacantes (array con { nivel, label, min, max, postulantesAnterior, jornada, copago }), simce, simceAnio, promedioComunal, gseComparacion, gseNumColegios, categoriaDesempeno, categoriaAnio, docentes, nee, seguridad, metodos, proyecto, demanda, prioritarios.

ATENCIÓN: el campo `jornada` ya NO es global; está por nivel dentro de `vacantes[n].jornada`. Para acceder a la jornada en páginas que solo muestran un valor, usar `c.vacantes[0]?.jornada`. El campo `totalVacantes()` ahora suma `v.max` (antes sumaba valores directos del objeto).

---

## 8. Lógica del simulador (src/utils/asignacion.js)

```js
nivelPrioridad(perfil)     // retorna 1-5 según hermano/prioritario/funcionario/exalumno/ninguno
probAsignacion(nivel, demanda) // tabla: alta/media/baja × nivel 1-5 → porcentaje
calcularResultado(listaIds, perfil) // simula asignación: retorna { asignado, detalles, nivel, prioridadLabel, error }
```

El simulador está funcional en `AlgoritmoPage.jsx` y el comparador (`ComparadorPage.jsx`) reutiliza `nivelPrioridad` y `probAsignacion`.

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

Los puntos del plan están todos cerrados (87/87 aplicables). Queda trabajo de pulido opcional:

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
