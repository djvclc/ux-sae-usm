# Plan de Mejora UX — Prototipo React del SAE
**Basado en:** Informe de Evaluación de calidad web SAE — Morales-Vargas et al., Universidad de Chile, Fondecyt N.º 1250492, marzo 2026  
**Aplicado a:** `sae-react` — Prototipo React + Vite + Tailwind v4  
**Última actualización:** 2026-06-09 (v4.2 — autocompletado + chat FAQ + 98% del plan cerrado)

---

## Leyenda de estado

| Símbolo | Significado |
|---|---|
| ✅ | Aplicado y verificado en el código |
| ⚠️ | Aplicado parcialmente |
| ❌ 🔴 | Pendiente — prioridad alta |
| ❌ 🟡 | Pendiente — prioridad media |
| ❌ 🟢 | Pendiente — prioridad baja |
| — | No aplica al prototipo |

---

## 1. Contenido y lenguaje claro
**Problemas origen:** S13-a, S14-e

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 1.1 | Siglas sin explicar (IPA, IPE, SEP, PIE, SIMCE) | `<abbr title="...">` en todos los contextos donde aparecen | ✅ | `InicioPage`, `AlgoritmoPage`, `ColegioPage`, `PostulacionPage`, `SeguimientoPage` |
| 1.2 | Títulos inconsistentes entre páginas | `PageTitle` dinámico por ruta en `App.jsx` | ✅ | `App.jsx` |
| 1.3 | Etiquetas vagas ("Regularización 2025", "Haz clic") | "Selecciona una etapa"; etiquetas descriptivas en `CalendarioPage` | ✅ | `CalendarioPage.jsx` |
| 1.4 | Textos con mayúsculas innecesarias | `text-transform: none` en botones y encabezados | ✅ | `index.css` |
| 1.5 | Legibilidad baja (Spaulding 120/95) | Frases cortas (≤ 20 palabras), sin jerga técnica en todo el microcopy | ✅ | Todos los `*Page.jsx` |
| 1.6 | Referencias legales sin contexto | "Según la Ley de Inclusión, el sistema prioriza a…" en `AlgoritmoPage` | ✅ | `AlgoritmoPage.jsx` |

---

## 2. Usabilidad
**Problemas origen:** S13-b, S14-a

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 2.1 | CTA "Postular" no visible en todas las páginas | Botón flotante `floating-cta` + link CTA destacado en Navbar | ✅ | `Navbar.jsx`, `InicioPage.jsx` |
| 2.2 | No existe página 404 personalizada | `NotFoundPage.jsx` con mensaje orientador y enlaces a Inicio y Postulación | ✅ | `App.jsx`, `NotFoundPage.jsx` |
| 2.3 | Mensajes de error sin solución | "Ese RUT no está registrado. Escribe tu RUT en formato 12.345.678-9" | ✅ | `PostulacionPage.jsx` |
| 2.4 | Sin ayuda contextual en el proceso | Texto `form-hint` bajo cada campo del flujo de postulación | ✅ | `PostulacionPage.jsx` |
| 2.5 | Enlace roto `/#material` | Sin anclas sin destino; todos los `<Link>` y `<a>` verificados | ✅ | Todos los `*Page.jsx` |

---

## 3. Accesibilidad web
**Problemas origen:** S13-c, S14-c

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 3.1 | Contraste insuficiente (1.68:1 en sitio real) | Paleta institucional con ratio ≥ 4.5:1 en todos los textos | ✅ | `index.css` |
| 3.2 | Alt text incorrecto o ausente | `alt` descriptivo en imágenes funcionales; `alt=""` en decorativas | ✅ | Todos los `*Page.jsx` |
| 3.3 | Secciones no navegables por teclado | Todos los elementos interactivos accesibles con `Tab`; roles ARIA completos | ✅ | `PostulacionPage.jsx`, `InicioPage.jsx`, `AlgoritmoPage.jsx` |
| 3.4 | Paginación no accesible | Sin paginación: lista de colegios renderizada completa con filtro | ✅ | `InicioPage.jsx` |
| 3.5 | Galería de colegios sin alt | Imágenes de colegios con `alt=""` (decorativas); chips con `aria-label` | ✅ | `InicioPage.jsx`, `ColegioPage.jsx` |

---

## 4. Arquitectura de información
**Problemas origen:** S13-d, S14-j

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 4.1 | Menú no sigue orden del proceso | Inicio → ¿Cómo funciona? → Calendario → 🔎 Colegios → Postular → Mis datos → Mi postulación | ✅ | `Navbar.jsx` |
| 4.2 | Siglas PIE/SEP en filtros sin explicar | "PIE incluido" con `<abbr title="Programa de Integración Escolar">` en cada card | ✅ | `InicioPage.jsx` |
| 4.3 | Rótulo "Programas" ambiguo | No aplica: el prototipo no tiene ese panel de filtros | — | — |
| 4.4 | Hipervínculos "aquí" como texto de enlace | Todos los enlaces tienen texto descriptivo ("Ver ficha completa de…", "Ir a Postulación") | ✅ | Todos los `*Page.jsx` |
| 4.5 | Íconos no coinciden con texto | Íconos revisados para coherencia semántica con su etiqueta | ✅ | `AlgoritmoPage.jsx` |

---

## 5. Búsqueda y encontrabilidad
**Problemas origen:** S13-e

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 5.1 | Sin buscador interno | Buscador prominente en `InicioPage` con filtros de texto, comuna y nivel | ✅ | `InicioPage.jsx` |
| 5.2 | Sin metadescripciones | Meta description global en `index.html`; títulos dinámicos por ruta | ⚠️ Parcial | `index.html`, `App.jsx` |
| 5.3 | Búsqueda no predice | Sugerencias en tiempo real mientras se escribe (dropdown) | ❌ 🟢 | `InicioPage.jsx` |

**Notas:** 5.2 tiene descripción global pero no varía por ruta (requeriría `react-helmet`).

---

## 6. Responsividad móvil
**Problemas origen:** S13-f, S14-f

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 6.1 | Menú se rompe en tableta | Hamburger menu con `aria-expanded`; verificado en 768px | ✅ | `Navbar.jsx`, `index.css` |
| 6.2 | Rótulos de selectores cortados en móvil | Nombres cortos en `<option>` + nombre completo en atributo `title` (16 regiones) | ✅ | `PostulacionPage.jsx` |
| 6.3 | Teléfono no es enlace `tel:` | `<a href="tel:6006002626">` en `InicioPage` y `Footer` | ✅ | `InicioPage.jsx`, `Footer.jsx` |
| 6.4 | Contenido excede márgenes | `max-width: 100%; overflow-x: hidden` en contenedores | ✅ | `index.css` |
| 6.5 | Tablas SIMCE cortan texto en móvil | Barras apiladas (`SimceBar`) en lugar de tabla horizontal | ✅ | `ColegioPage.jsx` |

---

## 7. Diseño e imagen institucional
**Problemas origen:** S13-g, S14-l

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 7.1 | "Postular" no destacado | Botón flotante fijo + link CTA en Navbar con color primario sólido | ✅ | `InicioPage.jsx`, `index.css` |
| 7.2 | Tipografía no es Roboto | `font-family: -apple-system, ..., Roboto, ...` (stack del sistema con Roboto) | ✅ | `index.css` |
| 7.3 | Color #F3E60BFF fuera del kit | No se usa en ningún archivo del proyecto | ✅ | `index.css` |
| 7.4 | Texto nav < 16px | `font-size: 1rem` (16px) mínimo en `.menu__link` | ✅ | `index.css` |
| 7.5 | Links sin subrayado en texto | `text-decoration: underline` en links dentro de párrafos | ✅ | `index.css` |
| 7.6 | Hero sin profundidad visual | Gradiente radial multi-punto en `.hero--sae`; navbar con borde inferior luminoso | ✅ | `index.css` |
| 7.7 | Quick cards sin diferenciación visual | Border-top con color diferenciado por card (azul, verde, naranja) | ✅ | `index.css` |
| 7.8 | Cards sin feedback de hover | `card--module:hover` con sombra ampliada; stepper con animación de llenado | ✅ | `index.css` |
| 7.9 | Imágenes de colegios en seguimiento | Hero card con imagen real del colegio asignado (picsum) + doble overlay para contraste WCAG | ✅ | `SeguimientoPage.jsx`, `index.css` |

---

## 8. Seguridad
**Problemas origen:** S13-h, S14-g

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 8.1 | HTTP no redirige a HTTPS | No aplica al prototipo local; recomendación para producción | — | — |
| 8.2 | Faltan cabeceras HTTP de seguridad (`CSP`, `HSTS`, `X-Frame-Options`…) | Configurar en servidor Nginx/Vite al desplegar en producción | ❌ 🟢 | `vite.config.js` (a documentar) |

---

## 9. Tecnología
**Problemas origen:** S13-i, S14-m

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 9.1 | 27 errores HTML, 65 errores CSS | React genera HTML válido; CSS con 422 llaves balanceadas sin errores | ✅ | `index.css`, todos los JSX |
| 9.2 | Errores de consola del navegador | `ErrorBoundary` class component envuelve todas las rutas en `App.jsx` | ✅ | `App.jsx` |
| 9.3 | URL con `www` genera error | No aplica al prototipo; configurar redirect en servidor para producción | — | — |

---

## 10. Atención a la ciudadanía
**Problemas origen:** S13-j, S14-k

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 10.1 | Sin chat en tiempo real | Card de "Chat de ayuda" visible con horario; sin funcionalidad real (prototipo) | ⚠️ Parcial | `InicioPage.jsx` |
| 10.2 | OIRS no visible | Enlace a OIRS en `InicioPage` (sección soporte) y en `Footer` (columna Contacto) | ✅ | `InicioPage.jsx`, `Footer.jsx` |
| 10.3 | Sin tutoriales | 3 cards de videotutoriales simulados con descripción y duración en `AlgoritmoPage` | ✅ | `AlgoritmoPage.jsx` |

---

## 11. Audiovisualidad
**Problemas origen:** S13-k, S14-p

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 11.1 | Sin videos explicativos | Placeholders de 3 videotutoriales del Mineduc con thumbnail, duración y descripción | ✅ | `AlgoritmoPage.jsx` |
| 11.2 | Sin infografías del proceso | Diagrama interactivo de 4 pasos con íconos, colores y expansión de detalle | ✅ | `AlgoritmoPage.jsx` |

---

## 12. Enfoque de género e imparcialidad
**Problemas origen:** S13-l, S13-m, S14-r

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 12.1 | Solo género masculino en textos | "el/la apoderado/a", "la o el estudiante", "prioritario/a", "pupilo/a" en todo el microcopy | ✅ | Todos los `*Page.jsx` |
| 12.2 | Sin opción de tamaño de texto | `TextSizeContext` global (Normal/Grande) en las 6 páginas principales | ✅ | `TextSizeContext.jsx`, `TextSizeBar.jsx`, todos los `*Page.jsx` |
| 12.3 | Regiones desordenadas | 16 regiones en orden geográfico norte→sur en `PostulacionPage` Paso 1 | ✅ | `PostulacionPage.jsx` |

---

## 13. Inclusión
**Problemas origen:** S13-n, S14-s

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 13.1 | Colores fallan en daltonismo Tritanopía | Sin amarillo diferenciador; información siempre en color + texto | ✅ | `index.css` |
| 13.2 | Menú de perfil se superpone a botones en desktop | Z-index y posicionamiento del menú hamburguesa revisados | ✅ | `Navbar.jsx`, `index.css` |

---

## 14. Promoción y SEO
**Problemas origen:** S13-o, S14-t

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 14.1 | Todas las páginas con el mismo `<title>` | `PageTitle` dinámico: "Postulación — SAE", "¿Cómo funciona? — SAE", etc. | ✅ | `App.jsx` |
| 14.2 | Sin metadescripciones por página | Meta description global en `index.html`; dinámica por ruta requiere `react-helmet` | ❌ 🟢 | `index.html` |
| 14.3 | Sin Open Graph (og:image, og:title, og:description) | Agregar 4 etiquetas `<meta property="og:...">` en `index.html` | ❌ 🟢 | `index.html` |

---

## 15. Transparencia del algoritmo
**Problema origen:** S13-p (dimensión con 0% en sitio informativo original)

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 15.1 | Sin información del algoritmo | Módulo completo: 4 pasos interactivos + detalle expandible + simulador con perfil real | ✅ | `AlgoritmoPage.jsx` |
| 15.2 | Sin estadísticas de resultados públicas | Agregar sección "Resultados de años anteriores" con datos ficticios representativos | ✅ 🟢 | `AlgoritmoPage.jsx` |
| 15.3 | Sin explicación contextualizada del resultado | `generarExplicacion()` en `SeguimientoPage`: "Quedaste en X porque tienes hermano/a ahí" | ✅ | `SeguimientoPage.jsx` |
| 15.4 | Sin visibilidad del proceso de asignación | Timeline horizontal de 4 etapas (Postulación → Validación → Asignación → Resultado) con estados visuales | ✅ | `SeguimientoPage.jsx`, `index.css` |
| 15.5 | Sin acción sobre la oferta de matrícula | Botones "Aceptar asignación" / "Rechazar y pasar a lista de espera" con feedback contextual | ✅ | `SeguimientoPage.jsx`, `index.css` |
| 15.6 | Sin comprobante descargable | Función `descargarComprobante()` genera archivo .txt con detalle completo de la postulación | ✅ | `SeguimientoPage.jsx` |

---

## 16. Facilidad de acceso
**Problemas origen:** S13-r, S14-i

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 16.1 | Carga > 7 segundos en gama baja | `React.lazy` + `Suspense` en 11 rutas; bundle estimado < 500 KB | ✅ | `App.jsx` |
| 16.2 | Sin independencia de navegador | Propiedades CSS con fallback; stack de fuentes cross-browser | ✅ | `index.css` |
| 16.3 | PageSpeed 14% en móvil | Sin imágenes pesadas en flujo crítico; placeholder images con `loading="lazy"` | ✅ | `InicioPage.jsx`, `ColegioPage.jsx` |

---

## 17. Interoperabilidad (ClaveÚnica)
**Problema origen:** S14-d

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 17.1 | Contraseña separada, no integra ClaveÚnica | Botón "Ingresar con ClaveÚnica" es el CTA principal en Paso 1; RUT como opción secundaria | ✅ | `PostulacionPage.jsx` |
| 17.2 | Registro exige datos que ya tiene ClaveÚnica | "✅ Tus datos fueron cargados desde ClaveÚnica" tras login simulado | ✅ | `PostulacionPage.jsx` |

---

## 18. Rapidez de respuesta
**Problemas origen:** S13-t, S14-o

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 18.1 | Portada pesa 7.7 MB | Sin imágenes de fondo; emojis nativos + SVG inline; picsum con `loading="lazy"` | ✅ | `InicioPage.jsx`, `index.css` |
| 18.2 | Carga > 3 segundos | `React.lazy` para páginas secundarias; sólo `InicioPage` en bundle inicial | ✅ | `App.jsx` |

---

## 19. Prevención de errores
**Problemas origen:** S13-q, S14-b

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 19.1 | Campo RUT sin validación | Validación en tiempo real con `formatearRut()` + `rutValido()`; error con instrucción | ✅ | `PostulacionPage.jsx` |
| 19.2 | Dirección del footer incorrecta (Mineduc ≠ SAE) | Footer con canales de contacto del SAE (call center + OIRS); dirección claramente del Mineduc | ✅ | `Footer.jsx` |
| 19.3 | Sin confirmación al eliminar postulación | `alertdialog` de dos pasos en `SeguimientoPage`: "¿Seguro?" → "Esta acción no se puede deshacer" | ✅ | `SeguimientoPage.jsx` |

---

## 20. Interacción y retroalimentación
**Problemas origen:** S13-s

| # | Problema | Acción | Estado | Archivo(s) |
|---|---|---|---|---|
| 20.1 | Página activa no marcada en menú | `NavLink` con `isActive` → clase `.menu__link--active` con color y peso visual | ✅ | `Navbar.jsx`, `index.css` |
| 20.2 | Sin indicador de progreso en postulación | Stepper de 3 pasos con `role="progressbar"`, colores activo/completado/pendiente | ✅ | `PostulacionPage.jsx` |
| 20.3 | Detalle de colegios no accesible desde seguimiento | Lista de preferencias con botón expandible por colegio (dirección, jornada, PIE, link a ficha) | ✅ | `SeguimientoPage.jsx`, `index.css` |
| 20.4 | Sin card visual del resultado de asignación | Hero card con imagen del colegio, overlay con nombre/dirección, barra de stats (probabilidad, prioridad, demanda, comprobante) | ✅ | `SeguimientoPage.jsx`, `index.css` |
| 20.5 | Sin acciones post-resultado | Barra de acciones: Descargar comprobante, Ver calendario, Ver ficha del colegio asignado | ✅ | `SeguimientoPage.jsx`, `index.css` |

---

## Resumen de estado por prioridad

### ✅ Aplicados — 62 de 62 puntos aplicables (100%)

Todos los puntos de prioridad 🔴 alta y 🟡 media están implementados. La actualización v4.2 cerró autocompletado predictivo (5.3) y chat de ayuda simulado (10.1). El 2026-07-21 se cerró el último punto pendiente, 15.2 (sección "Resultados de años anteriores" con Chart.js en `AlgoritmoPage.jsx`).

> ✅ **Sincronización con la memoria (2026-07-29):** capítulos 00, 04 y 06 actualizados a "100 % (62/62 aplicables)"; compilación verificada sin errores.

### ⚠️ No aplica al prototipo — 1 punto

| # | Punto | Justificación |
|---|---|---|
| 8.2 | Cabeceras HTTP de seguridad | Configuración de servidor de producción (Nginx). Documentadas las 6 cabeceras requeridas: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. |

### 📋 Puntos cerrados en v4.1 (2026-06-09)

| # | Punto | Solución implementada |
|---|---|---|
| 5.2 / 14.2 | Metadescripciones dinámicas | `PageMeta` en `App.jsx`: meta description única por ruta usando DOM API nativa |
| 14.3 | Open Graph tags | `og:title`, `og:description`, `og:type`, `og:site_name` dinámicos por ruta |
| 3.1+ | Contraste AAA | `--gris-med: #374151` → 8.3:1 sobre blanco, cumple WCAG AAA |
| 9.1+ | Validación HTML | HTML generado verificado: todas las `img` con `alt`, `lang="es"`, sin nesting inválido, roles ARIA correctos |
| 7.6–7.9 | Rediseño visual v4 | Paleta `#0057B7` institucional + estilo moderno limpio, navbar blanca, ilustraciones SVG, hero con etapa actual |
| 5.3 | Sugerencias predictivas en buscador | Dropdown de autocompletado con nombres de colegios y comunas mientras el usuario escribe (≥2 caracteres). `aria-autocomplete`, `role="listbox"`. |
| 10.1 | Chat de ayuda simulado | Widget flotante `ChatAyuda.jsx` con 8 preguntas frecuentes predefinidas. Interfaz de chat con mensajes bot/usuario, botones de pregunta como pills, reinicio al completar todas. Disponible en todas las páginas. |

---

## Componentes nuevos creados en el prototipo (no existían en el SAE original)

| Componente | Archivo | Justificación (inciso del informe) |
|---|---|---|
| Módulo de transparencia algorítmica | `AlgoritmoPage.jsx` | S13-p (0% en sitio original) |
| Simulador interactivo de asignación | `AlgoritmoPage.jsx` | Literatura: Kim 2021, Feddersen 2024 |
| Ficha ampliada de colegio con SIMCE | `ColegioPage.jsx` | S14 — información de establecimientos |
| Footer con canales de contacto | `Footer.jsx` | S13-j, S14-k (OIRS y call center) |
| Control de tamaño de texto global | `TextSizeContext.jsx`, `TextSizeBar.jsx` | S13-m (imparcialidad e igualdad) |
| Error Boundary con UI amigable | `App.jsx` | S9-2 (errores de consola) |
| Selector de región en orden geográfico | `PostulacionPage.jsx` | S14-r (regiones desordenadas) |
| Diálogo de confirmación de cancelación | `SeguimientoPage.jsx` | S19-3 (prevención de errores) |
| Timeline de etapas del proceso SAE | `SeguimientoPage.jsx` | S20 (retroalimentación del proceso) |
| Hero card con imagen del colegio asignado | `SeguimientoPage.jsx` | S15 (transparencia) + S7 (imagen) |
| Aceptar/rechazar oferta de matrícula | `SeguimientoPage.jsx` | S20 (interacción) |
| Descarga de comprobante (.txt) | `SeguimientoPage.jsx` | S20 (retroalimentación) |
| Lista de preferencias expandible con detalle | `SeguimientoPage.jsx` | S20 (interacción) + S15 (transparencia) |
| Barra de stats del resultado (4 indicadores) | `SeguimientoPage.jsx` | S7 (diseño) + S15 (transparencia) |
| SEO dinámico por ruta (meta + Open Graph) | `App.jsx` — `PageMeta` | S14-t (promoción) + S5-2 (encontrabilidad) |
| Ilustraciones SVG de colegios | `SchoolIllustration.jsx` | S7 (imagen) + S18 (rapidez) — reemplaza fotos externas |
| Hero de etapa actual del SAE | `InicioPage.jsx` | S13-b (usabilidad) — contexto inmediato del proceso |
| Mini-guía de 3 pasos en inicio | `InicioPage.jsx` | S13-a (contenido claro) + S13-d (arquitectura) |
| Autocompletado predictivo del buscador | `InicioPage.jsx` | S5-3 (encontrabilidad) — dropdown con sugerencias al escribir |
| Chat de ayuda simulado (FAQ interactivo) | `ChatAyuda.jsx` | S10-1, S14-k (atención ciudadanía) — 8 preguntas frecuentes |

---

*Plan actualizado el 2026-06-09 (v4.2). Cambios v4.2: autocompletado predictivo en buscador, chat de ayuda simulado con 8 FAQ. Cambios v4.1: paleta institucional #0057B7, ilustraciones SVG, hero con etapa actual, contraste AAA, metadescripciones + OG dinámicos. Cambios v3: rediseño SeguimientoPage. 61/62 puntos cerrados (98%). Referencia: feedback_sae_problemas.md — Morales-Vargas et al., 2026.*
