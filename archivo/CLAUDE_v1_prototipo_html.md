# CLAUDE.md — Proyecto: Prototipo de Mejora UX del SAE
## Instrucciones para el agente de desarrollo

---

## 1. Contexto y propósito del proyecto

Este proyecto tiene como objetivo construir un **prototipo web interactivo** (archivo HTML único, autocontenido) que represente una primera propuesta de mejora de la experiencia de usuario del **Sistema de Admisión Escolar (SAE)** del Ministerio de Educación de Chile (`sistemadeadmisionescolar.cl`).

La propuesta se fundamenta en tres fuentes de investigación que están disponibles en este mismo directorio:

- **`algorithm_transparency_literature_review (1).md`** y **`algorithm_transparency_supplementary_analysis.md`**: revisión sistemática de 96 papers sobre transparencia algorítmica con evaluación de usuarios finales. Sintetiza qué enfoques funcionan (divulgación progresiva, explicabilidad contextualizada, controles interactivos) y cuáles no (transparencia sin filtro, explicaciones técnicas sin contexto).
- **`EXECUTIVE_SUMMARY.md`**: resumen ejecutivo de la revisión anterior.
- **`Informe Evaluación de calidad web SAE (1).pdf`**: evaluación heurística experta del SAE (Universidad de Chile, Fondecyt N.º 1250492, marzo 2026). El sitio informativo obtuvo **51% de cumplimiento** y la plataforma de postulación un **61%**. Identifica brechas concretas en inclusión, búsqueda, accesibilidad, interoperabilidad, transparencia del algoritmo y carga móvil.

El prototipo debe demostrar cómo aplicar los hallazgos de transparencia algorítmica para mejorar estas métricas de calidad web, enfocándose en el **usuario real identificado por el estudio** y en **explicar el algoritmo de asignación del SAE** de forma comprensible.

---

## 2. Público objetivo — Persona usuaria (arquetipo del estudio)

Toda decisión de diseño debe tener presente a esta persona:

- **Nombre ficticio**: Daniela González
- **Edad**: 35 años, mujer chilena
- **Ubicación**: Región Metropolitana o Valparaíso
- **Educación**: Educación media completa
- **Ocupación**: Servicios y ventas
- **Dispositivo predominante**: Teléfono móvil (acceso exclusivo o principal a internet)
- **Fuentes de información que usa**: Mineduc, Google, redes sociales (WhatsApp, Facebook, Instagram). No usa Twitter ni YouTube.
- **Comportamiento en el SAE**: Llega con la decisión tomada, postula a 3 colegios máximo, valora seguridad, ubicación y prestigio del establecimiento.
- **Frustración principal**: Percibe el SAE como una "tómbola" que no premia el esfuerzo ni el mérito. Siente que el sistema no le explica bien las reglas.
- **Nivel de alfabetización digital**: Básico-intermedio. Puede operar apps móviles cotidianas, pero se confunde con interfaces transaccionales complejas.
- **Necesidad no satisfecha clave**: Que alguien le explique cómo funciona el sistema de asignación antes de postular.

---

## 3. Brechas prioritarias a resolver (según el informe de calidad web)

El prototipo debe abordar específicamente las dimensiones con peor desempeño. Están ordenadas por prioridad:

### Sitio informativo (actualmente 51%)
| Dimensión | Problema detectado | Acción requerida en el prototipo |
|---|---|---|
| Transparencia del algoritmo | No se explica cómo funciona la asignación | Módulo interactivo "¿Cómo te asignan un colegio?" |
| Inclusión (0%) | Sin opciones para NEE, sin lenguaje simplificado | Sección accesible con lenguaje claro y opciones NEE |
| Búsqueda y encontrabilidad | Sin buscador interno ni mapa del sitio | Buscador visible con sugerencias predictivas |
| Audiovisualidad | Sin videos explicativos ni infografías | Video embebido corto + infografía del proceso |
| Responsividad móvil | Problemas de contraste y navegación en móvil | Diseño mobile-first con contraste WCAG AA |

### Plataforma de postulación (actualmente 61%)
| Dimensión | Problema detectado | Acción requerida en el prototipo |
|---|---|---|
| Interoperabilidad | No integra ClaveÚnica, exige contraseña aparte | Botón de ingreso con ClaveÚnica como opción principal |
| Facilidad de acceso | Carga lenta en móviles de gama baja (7+ segundos) | Interfaz liviana, sin imágenes pesadas en flujo crítico |
| Información de colegios | Faltan: calidad docente, métodos enseñanza, seguridad, NEE | Fichas de colegios ampliadas con estas dimensiones |
| Interacción y retroalimentación | Sin confirmación clara del estado de la postulación | Indicador de progreso paso a paso con estado actual |

---

## 4. Principios de diseño — Basados en la literatura de transparencia algorítmica

Aplica estos principios en cada componente del prototipo. Están respaldados por la revisión de literatura disponible en este directorio:

### 4.1 Divulgación progresiva (Springer & Whittaker, 2019-2020)
- Muestra primero lo esencial, deja el detalle técnico como opción secundaria.
- Ejemplo: "Tu hijo quedó en el colegio X" → [Ver por qué] → explicación del algoritmo.
- **No mostrar todo de golpe**; el exceso de información reduce la confianza.

### 4.2 Explicabilidad contextualizada (Nefedov, 2022)
- Explica el algoritmo en términos de la decisión específica del usuario, no en abstracto.
- En lugar de: "El algoritmo de Gale-Shapley asigna según preferencias declaradas..."
- Mejor: "Postulaste al Colegio San Martín como primera opción. Tienes prioridad porque tu hijo mayor estudia ahí."
- Vincular siempre la explicación a la situación personal del apoderado.

### 4.3 Controles interactivos (Kim, 2021; Feddersen, 2024)
- Permitir al usuario explorar, pero con guía. No dejar controles sin contexto.
- Simulador de postulación: el usuario selecciona colegios y ve en tiempo real cómo cambia su probabilidad estimada.
- **Importante**: los controles deben tener etiquetas claras y retroalimentación inmediata.

### 4.4 Gestión de errores y expectativas (Springer & Whittaker, 2019)
- No ocultar que el sistema puede no darle el colegio deseado, pero tampoco enfatizarlo como fracaso.
- Mensaje claro: "Si no quedas en tu primera opción, el sistema seguirá buscando opciones según tus preferencias."
- Evitar el efecto "tómbola": explicar que hay reglas claras y objetivas.

### 4.5 Diseño multi-dimensional de información (Glazerman et al., 2018)
- Los apoderados prefieren ver gráficos además de números.
- Ordenar colegios por distancia por defecto (preferencia reportada), con opción de ordenar por calidad académica.
- Mostrar múltiples indicadores (seguridad, rendimiento SIMCE, distancia, vacantes), no solo uno.

---

## 5. Especificaciones técnicas del prototipo

### Formato de entrega
- **Un único archivo HTML** autocontenido (todo CSS y JS inline o en `<style>`/`<script>`).
- No requiere servidor ni dependencias externas (puede usar CDN para Chart.js o similar).
- Debe funcionar correctamente en Chrome móvil (viewport 375px).

### Secciones obligatorias del prototipo

El prototipo debe simular las siguientes pantallas/secciones navegables:

#### A. Página de inicio mejorada
- Hero con explicación en 1 oración qué es el SAE y qué hace.
- Buscador de colegios prominente con campo de texto + filtros básicos (comuna, nivel educativo).
- Tres accesos rápidos: "Conoce cómo funciona el sistema", "Postula ahora" (con ClaveÚnica), "Revisa tu postulación".
- Indicador de etapa actual del calendario del SAE (ej: "Estamos en: Período de postulación — cierra el 30 de agosto").

#### B. Módulo "¿Cómo funciona el algoritmo?" (PRIORIDAD ALTA)
Esta es la sección más importante del prototipo. Debe:
- Explicar el proceso de asignación en **4 pasos simples**, con íconos visuales.
- **Paso 1**: Tú eliges hasta 8 colegios en orden de preferencia.
- **Paso 2**: Cada colegio define sus prioridades por ley (hermanos, cercanía, vulnerabilidad).
- **Paso 3**: El sistema cruza tus preferencias con las prioridades y asigna según disponibilidad de vacantes.
- **Paso 4**: Te notificamos el resultado. Si no quedas en tu primera opción, seguimos buscando.
- Incluir un **simulador interactivo** simple: el usuario elige 3 colegios ficticios con distintas condiciones (tiene hermano, sin hermano; distancia cercana/lejana) y el sistema muestra cuál sería más probable que le asignen y por qué.
- Sección de mitos frecuentes: "¿El SAE es una tómbola?" → Respuesta clara y tranquilizadora.

#### C. Ficha de colegio ampliada
Mostrar una ficha de ejemplo con al menos:
- Nombre, dirección, mapa (estático con imagen de placeholder).
- Niveles educativos disponibles y vacantes estimadas.
- Puntaje SIMCE con gráfico de barras comparativo (promedio comunal).
- Indicadores nuevos: % docentes con título, tipo de jornada, opciones para estudiantes NEE, medidas de seguridad en el entorno.
- Proyecto educativo resumido en 2-3 líneas (no solo enlace a PDF).
- Botón "Agregar a mi lista de postulación" con retroalimentación visual inmediata.

#### D. Flujo de postulación simplificado (3 pasos)
Simular el flujo de postulación mostrando:
- **Paso 1 de 3**: Ingresa con ClaveÚnica (botón primario) o crea cuenta (secundario).
- **Paso 2 de 3**: Agrega y ordena tus colegios (arrastrar para reordenar, máximo 8).
- **Paso 3 de 3**: Revisa y confirma. Mostrar resumen claro antes de enviar.
- Barra de progreso visible en todo momento.
- Mensaje final de confirmación con número de comprobante y fecha de resultados.

#### E. Panel de seguimiento de postulación
Pantalla simple que muestra:
- Estado actual: "En proceso de asignación" / "Resultado disponible".
- Si hay resultado: nombre del colegio asignado y explicación breve de por qué fue asignado.
- Si no quedó en primera opción: explicación tranquilizadora y próximos pasos.
- Botón para descargar comprobante.

---

## 6. Requisitos de accesibilidad y responsividad

Todos los componentes deben cumplir:

- **Contraste**: ratio mínimo 4.5:1 para texto normal (WCAG 2.1 AA), crítico dado el 0% en inclusión.
- **Tipografía**: fuente sans-serif, tamaño mínimo 16px en móvil, 14px en desktop.
- **Navegación por teclado**: todos los elementos interactivos deben ser accesibles con Tab.
- **Textos alternativos**: todas las imágenes e íconos con `alt` descriptivo.
- **Lenguaje claro**: frases cortas, sin jerga técnica. El nivel de lectura objetivo es 6° básico.
- **Mobile-first**: diseñar primero para 375px, luego adaptar a desktop 1280px.
- **Sin carga pesada**: no usar imágenes de fondo grandes ni animaciones complejas en el flujo principal.

---

## 7. Paleta de colores y estilo visual

Mantener coherencia con la identidad institucional del Mineduc chileno:

- **Azul principal**: `#0057B7` (color institucional Mineduc)
- **Azul claro**: `#E8F1FB` (fondos de secciones)
- **Verde confirmación**: `#1A7F37`
- **Naranja alerta**: `#E07B00`
- **Rojo error**: `#C0392B`
- **Gris texto**: `#333333`
- **Blanco**: `#FFFFFF`
- Íconos: usar emojis nativos del sistema o SVG simples inline (sin dependencias externas).
- Estilo general: limpio, gubernamental, confiable. Evitar elementos decorativos innecesarios.

---

## 8. Métricas de éxito del prototipo

El prototipo será evaluado informalmente contra las mismas dimensiones del estudio de calidad web. Las mejoras esperadas son:

| Dimensión | Puntaje actual | Meta con el prototipo |
|---|---|---|
| Transparencia y apertura | Bajo | Alto — módulo de algoritmo explícito |
| Búsqueda y encontrabilidad | Bajo | Alto — buscador prominente |
| Inclusión | 0% | Medio — lenguaje claro + opciones NEE |
| Interacción y retroalimentación | Bajo | Alto — confirmaciones y progreso |
| Contenido y lenguaje claro | Medio | Alto — microcopy revisado |
| Responsividad móvil | Con errores | Sin errores — diseño mobile-first |
| Interoperabilidad | Bajo | Medio — ClaveÚnica como opción principal |

---

## 9. Archivo de salida

Guardar el prototipo como:
```
C:\Users\dvill\OneDrive\Documentos\Claude\Projects\USM\prototipo_SAE_mejora.html
```

El archivo debe poder abrirse directamente en el navegador sin servidor local ni dependencias adicionales instaladas.

---

## 10. Notas finales para el agente

- Leer los archivos `.md` del directorio antes de comenzar para extraer hallazgos específicos de la literatura.
- El simulador del algoritmo debe ser funcional (JavaScript simple), no solo visual.
- Priorizar la sección B (módulo del algoritmo) sobre las demás si hay que elegir.
- No incluir datos reales de colegios; usar datos ficticios pero realistas y representativos del contexto chileno.
- El texto de la interfaz debe estar en español chileno informal pero respetuoso (tuteo, vocabulario cotidiano).
- Incluir al final del HTML un comentario `<!-- FIN DEL PROTOTIPO -->` y una sección de "Notas de diseño" visible en la página que explique qué principio de investigación respalda cada decisión de diseño.
