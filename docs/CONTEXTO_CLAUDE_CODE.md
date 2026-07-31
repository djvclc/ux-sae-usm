# Contexto para Claude Code — Proyecto SAE UX
**Fecha:** 2026-07-30 (actualizado tras refactor vitrina SAE — investigacion_vitrina_sae.md)  
**Estado del proyecto:** v4.2 — 62/62 puntos aplicables implementados (100%)  
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

## 3. Estado actual — 62/62 puntos aplicables implementados (100%)

El plan completo está en `plan_mejora_sae.md`. Resumen de lo que YA está hecho:

✅ **Completado (61 puntos):** buscador con autocompletado predictivo, módulo de algoritmo con simulador interactivo, ficha de colegio ampliada, flujo de postulación 3 pasos con ClaveÚnica, panel de seguimiento con resultado y comprobante descargable, chat de ayuda FAQ, control de tamaño de texto global, navegación accesible, SEO dinámico + Open Graph por ruta, contraste WCAG AAA, hamburger menu mobile, barras SIMCE adaptadas a móvil, ErrorBoundary, lazy loading en 11 rutas.

✅ **15.2 cerrado (2026-07-21):** sección "Resultados de años anteriores" con estadísticas ficticias y gráfico Chart.js en `AlgoritmoPage.jsx`. Con esto no quedan puntos pendientes.

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
- **No usar `localStorage`** — el proyecto usa estado de React (no hay persistencia entre sesiones por diseño)

---

## 10. Próximos pasos recomendados (en orden de prioridad)

Los puntos del plan están todos cerrados (62/62 aplicables). Queda trabajo de pulido opcional:

1. **Documentar cabeceras HTTP** en `vite.config.js` como comentario de producción (Nginx) — punto 8.2 (no aplica al prototipo, solo documentación).
2. **Marcar páginas internas** (`/cumplimiento`, `/roadmap`, `/notas`) con meta `noindex` — no son parte del flujo público.
3. **Sección de testimonios** en SeguimientoPage — 3 historias ficticias (ver `archivo/CLAUDE_v2.md` sección 4H).
4. **Gráfico radar** en ColegioPage con Chart.js (SIMCE, NEE, Seguridad, Docentes, Proximidad).
5. **Progress ring SVG** para % docentes titulados en ColegioPage.
6. **Corregir 15 errores de lint preexistentes** (variables sin usar y similares en 12 archivos; detectados 2026-07-29).

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
| `docs/planificacion/plan_mejora_sae.md` | Matriz completa de 62 puntos con estado de cada uno |
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
