# Auditoría independiente del proyecto SAE

**Fecha:** 8 de septiembre de 2026  
**Alcance:** prototipo UX SAE, documentación, simulador, tests y memoria de título  
**Método:** inspección independiente de documentación y código; ejecución de tests, lint y build; sin usar comentarios o checks documentales como prueba de cumplimiento.

## 1. Resumen ejecutivo

La afirmación «87/87 puntos aplicables implementados» no es reproducible a partir de la matriz actual.

`docs/planificacion/plan_mejora_sae.md` contiene:

- 77 filas en S1–S20.
- 10 filas en S21.
- 15 filas en S22.
- **Total: 102 requisitos explícitos, no 87.**

El historial tampoco resuelve la discrepancia: una versión anterior ya contenía 77 filas S1–S20 aunque declaraba 62. No existe una tabla que identifique cuáles 62 requisitos originales deben combinarse con los 25 de S21–S22.

Resultado independiente sobre las 102 filas existentes:

| Veredicto | Cantidad |
|---|---:|
| ✅ Cumple completamente | 55 |
| 🟡 Cumple parcialmente | 25 |
| ❌ No cumple | 13 |
| ⚪ No verificable solo mediante código | 5 |
| ➖ No aplica | 4 |
| **Total** | **102** |

Excluyendo los cuatro no aplicables, el puntaje reproducible es:

> **55/98 cumple completamente: 56,1 %.**

No es posible entregar honestamente un único `X/87`. Si se supone que los 87 eran 62 requisitos desconocidos seleccionados de los 77 originales, más los 25 de S21–S22, el resultado podría variar entre **40/87 y 55/87**, dependiendo de qué 15 filas fueran omitidas. Esa selección no está documentada.

Principales hallazgos:

- Matriz y memoria con denominador no trazable.
- Afirmaciones visuales o interactivas respaldadas solamente por CSS huérfano, placeholders o texto.
- Persistencia de borrador documentada, pero retirada del flujo.
- Probabilidades independientes de la posición, pero sorteo determinista no independiente por colegio debido a un RNG compartido.
- Fallback que presenta como asignado el colegio de mayor probabilidad aun cuando ningún colegio entregó cupo.
- Guías de explicabilidad declaradas con mayor fuerza que su implementación.
- Metodología de la memoria desactualizada respecto del simulador y del diseño N≈30.
- Tests verdes, pero insuficientes para demostrar strategy-proofness, accesibilidad, fidelidad del flujo o validez del modelo.

## 2. Puntaje auditado real

### Resultado defendible

**55/98 requisitos aplicables cumplen completamente.**

La cifra `87/87` debe considerarse no demostrada porque:

1. No hay 87 filas: hay 102.
2. S1–S20 suman 77, no 62.
3. S21+S22 agregan 25; `77 + 25 = 102`.
4. No existe una selección o consolidación que explique qué 15 filas fueron excluidas.
5. La matriz mezcla requisitos de producto, verificación visual, producción y contenido.
6. Varios requisitos marcados ✅ no están implementados o solo tienen implementación parcial.

Los cuatro puntos clasificados como no aplicables mediante esta auditoría de código son 4.3, 8.1, 8.2 y 9.3. En particular, 8.2 requiere un servidor/despliegue que el repositorio no incluye.

## 3. Matriz completa auditada

Referencias abreviadas:

- `Plan`: `docs/planificacion/plan_mejora_sae.md`
- `App`: `sae-react/src/App.jsx`
- `CSS`: `sae-react/src/index.css`
- `Inicio`: `sae-react/src/pages/InicioPage.jsx`
- `Alg`: `sae-react/src/pages/AlgoritmoPage.jsx`
- `Post`: `sae-react/src/pages/PostulacionPage.jsx`
- `Seg`: `sae-react/src/pages/SeguimientoPage.jsx`
- `Proceso`: `sae-react/src/pages/ProcesoPage.jsx`
- `Colegio`: `sae-react/src/pages/ColegioPage.jsx`
- `Nav`: `sae-react/src/components/Navbar.jsx`
- `Tour`: `sae-react/src/context/TourContext.jsx`
- `Asig`: `sae-react/src/utils/asignacion.js`
- `MC`: `sae-react/src/utils/simulacionSae.js`
- `Tests`: `sae-react/tests/flujo-postulacion.test.js`

### S1–S10

| ID | Requisito | Veredicto | Archivos/líneas | Evidencia y observaciones |
|---|---|---|---|---|
| 1.1 | Explicar IPA, IPE, SEP, PIE y SIMCE con `abbr` en todos los contextos | ❌ | Inicio:307–308; Colegio:510; Chat:9–22 | Algunas apariciones están explicadas, pero otras muestran PIE/SEP/IPA sin expansión. |
| 1.2 | Título dinámico por ruta | ✅ | App:81–165 | `useEffect` actualiza `document.title` según la ruta. |
| 1.3 | Reemplazar etiquetas vagas | ✅ | CalendarioPage; navegación | Se usan nombres de etapa y acciones descriptivas. |
| 1.4 | Eliminar mayúsculas innecesarias | ❌ | CSS; múltiples `text-transform: uppercase` | Contradice explícitamente `text-transform: none`. |
| 1.5 | Frases ≤20 palabras y sin jerga en todo el microcopy | ❌ | Post:1142–1157, 1837–1880; Proceso; Alg | Hay numerosos párrafos y frases superiores a 20 palabras y términos técnicos. |
| 1.6 | Dar contexto legal a prioridades | ✅ | Alg:85–121; Post:1837–1847 | Se explica que las prioridades provienen de reglas legales. |
| 2.1 | CTA Postular visible en todas las páginas | ✅ | Nav:6–15, 47–56; CSS `.floating-cta` | El enlace principal está en la navegación; existe CTA flotante móvil. |
| 2.2 | Página 404 personalizada | ✅ | App:192–205; NotFoundPage | Ruta comodín con orientación y enlaces. |
| 2.3 | Mostrar exactamente error de RUT con solución | ❌ | Post:1176–1216 | Existe validación, pero no el mensaje exacto comprometido por la matriz. |
| 2.4 | `form-hint` debajo de cada campo | 🟡 | Post; RegistroPage | Hay ayudas en varios campos, pero no sistemáticamente en todos. |
| 2.5 | Todos los enlaces y anclas funcionales | 🟡 | App; Alg:322–364; Tour:43 | Las rutas principales existen; hay tutoriales sin acción y un selector de tour obsoleto. |
| 3.1 | Contraste ≥4.5:1 en todos los textos | ⚪ | CSS completo | La afirmación global requiere medición de todos los estados y fondos renderizados. |
| 3.2 | Alt descriptivo/alt vacío según función | 🟡 | SchoolIllustration:23–31 | No hay `<img>` actuales; el SVG tiene identificación genérica, no contextual por colegio. |
| 3.3 | Todo interactivo accesible con teclado y ARIA completo | ❌ | Inicio:230–247; Post:1105–1124 | El autocomplete depende del mouse; el stepper carece del `role="progressbar"` prometido. |
| 3.4 | Sin paginación inaccesible; lista completa con filtros | ✅ | Inicio | La lista se filtra localmente y se renderiza completa. |
| 3.5 | Galería con alt decorativo y chips etiquetados | ❌ | Inicio; Colegio | La galería descrita ya no existe y la cobertura ARIA no es uniforme. |
| 4.1 | Menú en orden del proceso | ✅ | Nav:6–15 | El orden principal sigue el recorrido de uso. |
| 4.2 | Explicar PIE/SEP en cada tarjeta | 🟡 | Inicio:307–308; Colegio:510 | Algunas tarjetas usan `abbr`; otras muestran PIE directamente. |
| 4.3 | Resolver panel “Programas” ambiguo | ➖ | Plan:68 | El panel no existe. |
| 4.4 | Todos los textos de enlace descriptivos | 🟡 | Diversas páginas | Predominan textos descriptivos, pero no se demuestra la universalidad declarada. |
| 4.5 | Coherencia semántica de todos los íconos | ⚪ | Alg; componentes | La comprensión semántica efectiva requiere evaluación renderizada/usuario. |
| 5.1 | Buscador con texto, comuna y nivel | ✅ | Inicio:60–68, 230–247 | Búsqueda y filtros operativos. |
| 5.2 | Metadescripción global y títulos dinámicos | ✅ | index.html:7; App:145–165 | Ambas partes están implementadas. |
| 5.3 | Sugerencias predictivas en tiempo real | 🟡 | Inicio:230–247 | El dropdown aparece, pero no ofrece navegación completa por teclado ni patrón combobox íntegro. |
| 6.1 | Menú hamburguesa verificado a 768 px | ❌ | CSS:227–257 | El cambio ocurre alrededor de 599 px; a 768 px continúa el menú horizontal. |
| 6.2 | Nombres móviles de 16 regiones sin corte | ✅ | Post | Opciones abreviadas y títulos disponibles. |
| 6.3 | Teléfono mediante `tel:` | ✅ | Inicio; Footer | Se usa `href="tel:6006002626"`. |
| 6.4 | Evitar contenido fuera de márgenes | ❌ | CSS completo | No se cumple de manera uniforme la regla declarada; hay superficies dependientes de breakpoints. |
| 6.5 | SIMCE con barras, no tabla horizontal | ✅ | Colegio; `SimceBar` | Implementación basada en barras. |
| 7.1 | CTA Postular destacado | ✅ | Nav; CSS | Color y jerarquía diferenciados. |
| 7.2 | Tipografía Roboto | 🟡 | CSS:85 | Roboto aparece después de fuentes del sistema; normalmente no será la fuente efectiva. |
| 7.3 | No usar `#F3E60BFF` | ✅ | Búsqueda global | El color no aparece. |
| 7.4 | Navegación mínimo 16 px | ✅ | CSS:173–180 | `.menu__link` usa `1rem`. |
| 7.5 | Enlaces dentro de texto subrayados | ✅ | CSS | Existe subrayado explícito en enlaces de contenido. |
| 7.6 | Gradiente radial multipunto y borde luminoso | ❌ | CSS:134–140, 399–408 | El hero usa gradiente lineal y el navbar una sombra/borde convencional. |
| 7.7 | Quick cards diferenciadas por tres colores | ❌ | CSS:641–650; Inicio | No se renderizan las quick cards; quedan estilos residuales. |
| 7.8 | Hover de cards y animación del stepper | 🟡 | CSS:4348–4365 | El hover existe; la clase animada no está conectada al JSX actual. |
| 7.9 | Foto real del colegio asignado con overlay | ❌ | Seg; SchoolIllustration | No hay foto ni Picsum; se usa una ilustración SVG genérica. |
| 8.1 | Redirección HTTP→HTTPS | ➖ | Sin despliegue | Depende de infraestructura de producción. |
| 8.2 | CSP, HSTS y otras cabeceras | ➖ | vite.config.js:7–14 | No hay servidor de producción en alcance. |
| 9.1 | HTML/CSS válido y sin errores | ⚪ | JSX y CSS | Llaves balanceadas o compilación no equivalen a validación completa. |
| 9.2 | Sin errores de consola; ErrorBoundary global | 🟡 | App | El boundary existe, pero no demuestra ausencia de errores durante todos los recorridos. |
| 9.3 | Redirección del dominio `www` | ➖ | Sin despliegue | Requiere DNS/servidor. |
| 10.1 | Chat en tiempo real | 🟡 | ChatAyuda | Es un FAQ simulado, no chat en tiempo real. |
| 10.2 | OIRS visible | ✅ | Inicio; Footer | Enlaces presentes. |
| 10.3 | Tres tutoriales funcionales | 🟡 | Alg:322–364 | Hay cards, pero los botones no reproducen ni abren contenido. |

### S11–S20

| ID | Requisito | Veredicto | Archivos/líneas | Evidencia y observaciones |
|---|---|---|---|---|
| 11.1 | Tres videos explicativos | 🟡 | Alg:322–364 | Son placeholders visuales; no hay videos o enlaces funcionales. |
| 11.2 | Diagrama interactivo de cuatro pasos con expansión | ❌ | Alg:294–319 | Los pasos son tarjetas estáticas. |
| 12.1 | Lenguaje inclusivo en todo el microcopy | 🟡 | Todas las páginas | Se usa ampliamente, pero no de forma universal. |
| 12.2 | Tamaño de texto en seis páginas principales | ✅ | TextSizeContext; TextSizeBar | El contexto global está conectado en más de seis páginas. |
| 12.3 | 16 regiones norte→sur | ✅ | Post | Lista completa y ordenada. |
| 13.1 | Información comprensible con tritanopía | ⚪ | CSS; componentes | Hay redundancia texto+color, pero la afirmación global exige prueba visual. |
| 13.2 | Menú de perfil sin superposición desktop | ✅ | Nav; CSS | Posicionamiento y capas explícitas. |
| 14.1 | Título diferente por página | ✅ | App:81–165 | Implementación dinámica. |
| 14.2 | Metadescripción específica por página | 🟡 | App:81–137; index.html:7 | Hay 11 rutas cubiertas; faltan Cumplimiento, Roadmap y 404. |
| 14.3 | Open Graph completo | 🟡 | App:145–165 | Se actualizan título, descripción, tipo y sitio; falta `og:image`. |
| 15.1 | Cuatro pasos interactivos, detalle y simulador con perfil real | 🟡 | Alg:294–319; AlgoSimuladorPasos | Existe simulador separado; los cuatro pasos son estáticos y el perfil es simplificado. |
| 15.2 | Resultados históricos ficticios | ✅ | Alg:491–523 | Sección implementada y rotulada como ficticia. |
| 15.3 | Explicación contextualizada del resultado | 🟡 | Seg:24–74 | Usa prioridad por colegio, pero explica falsamente una asignación ante el fallback sin cupo. |
| 15.4 | Timeline de cuatro etapas | ✅ | Seg:13–18, 192–213 | Se renderiza la línea temporal. |
| 15.5 | Aceptar/rechazar con feedback | 🟡 | Seg:271–323 | Funciona localmente, no persiste y contradice parcialmente `/proceso`. |
| 15.6 | Comprobante descargable desde seguimiento | ✅ | Seg:112–146 | Genera archivo `.txt`. |
| 16.1 | `React.lazy` y bundles <500 kB | ✅ | App:64–77; build | Hay 14 páginas lazy y ningún chunk supera 500 kB. |
| 16.2 | Compatibilidad cross-browser | ⚪ | CSS | No hubo matriz de navegadores ni prueba ejecutada. |
| 16.3 | Evitar imágenes pesadas | ✅ | Inicio; Colegio; build | No hay raster pesado; predominan SVG y CSS. |
| 17.1 | ClaveÚnica principal; RUT secundario | ✅ | Post:1160–1216 | Jerarquía implementada. |
| 17.2 | Confirmar datos cargados desde ClaveÚnica | ✅ | Post | Mensaje y recap visibles. |
| 18.1 | Portada sin carga de 7,7 MB | ✅ | Inicio; CSS; build | No hay fondos fotográficos pesados. |
| 18.2 | Inicio inicial; resto lazy | ✅ | App:64–77 | Las páginas se cargan dinámicamente. |
| 19.1 | Validación RUT en tiempo real | 🟡 | Post:1176–1216; rut.js | Formatea y valida, pero parte depende de blur y el texto no coincide. |
| 19.2 | Contactos correctos en footer | ✅ | Footer | Call center, OIRS y Mineduc diferenciados. |
| 19.3 | Confirmación de dos pasos al cancelar | ✅ | Seg:443–499 | `alertdialog` y advertencia irreversible. |
| 20.1 | Página activa marcada | ✅ | Nav; CSS | `NavLink` asigna clase activa. |
| 20.2 | Stepper con `role="progressbar"` | 🟡 | Post:1105–1124 | Tiene `aria-current`, pero falta el rol exigido. |
| 20.3 | Detalle expandible en seguimiento | ✅ | Seg:347–404 | Expande dirección, jornada, PIE y ficha. |
| 20.4 | Card visual del resultado | ✅ | Seg; SchoolIllustration | Existe card y estadísticas; la imagen es genérica, por lo que no satisface 7.9. |
| 20.5 | Acciones posteriores al resultado | ✅ | Seg | Descargar, calendario y ficha presentes. |

### S21–S22

| ID | Requisito | Veredicto | Archivos/líneas | Evidencia y observaciones |
|---|---|---|---|---|
| 21-a | `/proceso` con cinco etapas | ✅ | Proceso | Ruta y timeline implementados. |
| 21-b | Estado calculado por fecha | 🟡 | Proceso:8, 77+ | Parseo UTC/local y omisión de horas oficiales pueden desplazar límites. |
| 21-c | Resumen y detalle expandible | ✅ | Proceso | Patrón `<details>` operativo. |
| 21-d | Calendario 2027 como tabla | ✅ | Proceso | Tabla HTML. |
| 21-e | Cinco reglas de alto riesgo | ✅ | Proceso | Avisos presentes. |
| 21-f | Enlace a algoritmo y prioridades/cuota | ✅ | Proceso | Enlace y contenido presentes. |
| 21-g | Enlace a seguimiento | ✅ | Proceso | Ruta correcta. |
| 21-h | Comparación Principal/Complementario | ✅ | Proceso | Tabla y cercanía en complementario. |
| 21-i | Checklist de matrícula | ✅ | Proceso | Documentos y nota complementaria. |
| 21-j | Navbar y paso de tour | ✅ | Nav; Tour:23–29 | Ambas integraciones existen. |
| 22-1 | Región solo como filtro; postulación interregional | ✅ | Post | Texto explícito y sin restricción. |
| 22-2 | Sin máximo de ocho; recomendar seis | ✅ | Post y otras superficies | No hay tope; existe refuerzo al alcanzar seis. |
| 22-3 | Cierre 27 de agosto, 14:00 en todas las superficies | 🟡 | Post; Inicio:144–157; Calendario; Tour | La fecha está corregida, pero no todas muestran la hora y quedan mensajes temporales obsoletos. |
| 22-4 | Resultados 15–21 de octubre | ✅ | Post:2257–2260 | Rango visible. |
| 22-5 | Lotería independiente por colegio | ❌ | Asig:117–123 | El resultado usa un único RNG compartido recorrido en orden de lista. |
| 22-6 | PIE→hermanos→SEP→funcionario→exalumno | 🟡 | Post:1837–1847; MC:17–21 | El orden se explica, pero PIE no participa en el simulador. |
| 22-7 | Comprobante y validez condicionada a descarga | 🟡 | Post:965–1051 | Estado local; se pierde al recargar y el payload se almacena antes de descargar. |
| 22-8 | Drag-and-drop, botones y `aria-live` | ✅ | Post:1961–2009 | Las tres alternativas están conectadas. |
| 22-9 | Conservar lista al cambiar de paso | ✅ | Post:707–724 | Se conserva durante la visita; no entre recargas. |
| 22-10 | Editar desde paso 3 sin perder estado | ✅ | Post | Enlaces conservan el estado. |
| 22-11 | Postulantes/vacantes fundamentan porcentaje | ✅ | ColegioAnalisis, Post:638–702 | Muestra los datos y llama al Monte Carlo. |
| 22-12 | Confirmación explícita de nivel | ✅ | Post | Nivel visible y validado. |
| 22-13 | Hermanos en bloque y reordenamiento automático | 🟡 | Post:756–760, 1505–1522, 970–974 | Se recopilan datos, pero no entran al motor ni hay reordenamiento efectivo. |
| 22-14 | Preferencia real y aviso de lista riesgosa | ✅ | Post:1850–1880, 2051–2069 | Mensajes visibles y accionables. |
| 22-15 | Explicar si no queda en ninguna | ✅ | Post:2263–2275; ResultadoProvisional | Existen ambos casos; el motor conserva un fallback separado. |

## 4. Puntos parciales/no cumplidos y guías de explicabilidad

### 4.1 Listado consolidado

**No cumplen:** `1.1, 1.4, 1.5, 2.3, 3.3, 3.5, 6.1, 6.4, 7.6, 7.7, 7.9, 11.2, 22-5`.

**Cumplen parcialmente:** `2.4, 2.5, 3.2, 4.2, 4.4, 5.3, 7.2, 7.8, 9.2, 10.1, 10.3, 11.1, 12.1, 14.2, 14.3, 15.1, 15.3, 15.5, 19.1, 20.2, 21-b, 22-3, 22-6, 22-7, 22-13`.

### 4.2 Documentación de explicabilidad ↔ código

Esta sección evalúa únicamente documentación contra implementación, no la validez académica externa.

| Guía/principio | Componente | Resultado | Evidencia |
|---|---|---|---|
| HAX G1: qué puede/no puede hacer | Post, Alg, ResultadoProvisional | ✅ | Encuadre inicial de prioridades, orden y límites. |
| HAX G2: desempeño e incertidumbre | ColegioAnalisis, ProbabilidadVisual, ResultadoProvisional | 🟡 ⚠ | Muestra probabilidad y datos, pero la precisión parece mayor que la calibración disponible. |
| HAX G4: información contextual | Post, ColegioAnalisis, Seg | 🟡 | Existe por colegio; simuladores generales usan perfil simplificado. |
| HAX G5/G6: evitar juicio y estigma | Post, Alg | 🟡 | Tono mayormente neutral; sobreviven expresiones como “prioridad insuficiente”. |
| HAX G10: delimitar servicio | Post, Alg | 🟡 | No declara fallback, RNG compartido ni falta de PIE. |
| HAX G11: explicar el resultado | Seg `generarExplicacion()` | 🟡 ⚠ | No distingue el fallback y formula causalidad fuerte. |
| HAX G16: consecuencias de reordenar | Post, ResultadoProvisional | 🟡 ⚠ | La advertencia es visible, pero el RNG compartido contradice la independencia fuerte. |
| PAIR-ET: explicaciones parciales | Post, modales, AlgoSimuladorPasos | ✅ | Resumen y divulgación progresiva. |
| PAIR-ET: general vs. específica | Alg, Proceso, ColegioAnalisis, Seg | 🟡 | La explicación específica falla ante el fallback. |
| PAIR-ET: procedencia de datos | Post, ColegioAnalisis | ✅ | Indica origen de ClaveÚnica y datos de estimación. |
| PAIR-ET: calibración de certeza | ProbabilidadVisual, ResultadoProvisional | 🟡 ⚠ | Porcentaje, categoría y frecuencia; 99 % puede percibirse como certeza. |
| PAIR-ET: evitar influencia estratégica falsa | Post | 🟡 ⚠ | Microcopy corregido; propiedad completa no garantizada por el motor. |
| NNG-XAI: visible y accionable | Post, ColegioAnalisis | ✅ | Alertas en el flujo principal. |
| NNG-XAI: no antropomórfico | AlgoSimuladorPasos, Post, Proceso | 🟡 ⚠ | Quedan usos de “el sistema intenta”. |
| BROOK: explicar límites | Post, Alg | 🟡 ⚠ | Omite restricciones técnicas relevantes. |
| BROOK: video/animación | Alg | ❌ ⚠ | Cards y botones inertes. |
| RISK-NUM: frecuencia e icon array | ProbabilidadVisual, Post, Colegio | ✅ | Frecuencia, barra y cuadrícula visual. |
| FORM-MS: progreso accesible | Post stepper | 🟡 ⚠ | Falta `role="progressbar"`. |
| FORM-MS: guardar/reanudar | Post | ❌ ⚠ | Fue eliminado aunque la guía dice que está implementado. |
| FORM-MS: volver sin perder datos | Post | ✅ | Estado conservado entre pasos. |
| FORM-MS: validación en tiempo real | Post | 🟡 | Parte depende de blur o envío del bloque. |

## 5. Inconsistencias documentación ↔ código

| Documento/afirmación | Estado real |
|---|---|
| Plan: 87/87 | La matriz contiene 102 filas y solo 55 cumplen completamente. |
| Plan: forma final de 87 puntos | No existe consolidación que produzca 87. |
| Plan, pie v4.5: borrador visible | El borrador persistente fue eliminado. |
| Guía UX: borrador y reanudación implementados | Falso en el código actual. |
| Bitácora antigua: borrador visible | La propia bitácora lo contradice después en el bloque S. |
| CONTEXTO_GENERAL: único no aplicable 8.2 | El plan también marca 4.3, 8.1 y 9.3; 8.2 depende del despliegue. |
| CONTEXTO_GENERAL/bitácora: datos reales | `colegios.js` los identifica como ficticios/demostrativos. |
| 87 filas reflejadas en `incisos.js` | Contiene 20 categorías agregadas, no 87 ni 102 filas. |
| Número de rutas | App declara 14 páginas lazy más la ruta comodín; documentación habla de 11 o 13. |
| Tour: `.pasos-inicio__grid` | La página usa `.guia-pasos__lista`; selector obsoleto. |
| Foto Picsum en seguimiento | Sustituida por SVG genérico. |
| Quick cards diferenciadas | JSX ausente; quedan estilos. |
| Infografía interactiva | Es estática. |
| Tutoriales | Placeholders sin acción. |
| `probAsignacion` y umbral 65 activos | Ya no existen como lógica ejecutable; sobreviven referencias históricas. |
| Ejemplos 92/88/65/60 | Valores antiguos que no representan necesariamente el Monte Carlo actual. |
| Caso Muñoz con SEP/PIE | Caso actual: `prioritario:false`, `pie:false`. |
| Estudio N=8 | Bitácora vigente propone N≈30 entre sujetos. |
| Hermanos en bloque | Se recopilan/narran, pero no entran al cálculo. |
| Invalidación del comprobante | Solo hay advertencia textual; no invalidación efectiva. |
| Fase F2 terminada | La bitácora la presenta pendiente y existen brechas. |
| Modo control F3 | No existe bandera, query param ni ruta paralela. |

Las referencias antiguas claramente rotuladas como historia no son por sí solas defectos del código. El problema es que los documentos acumulan afirmaciones incompatibles sin separar consistentemente historial, estado actual y pendientes.

## 6. Inconsistencias memoria ↔ código

Hallazgos en `proyecto-tesis/capitulos/03_metodologia.tex`:

- Afirma que el caso Muñoz activa todos los criterios, incluida la cuota del 15 %; el caso actual no tiene SEP ni PIE.
- La línea 54 afirma “guardado visible de borrador”; fue retirado.
- Habla de lotería independiente por colegio; el resultado canónico usa un RNG compartido.
- Las líneas 58 y 63 afirman que refinamientos posteriores no alteraron la lógica. Es falso: el 3 de septiembre se reemplazó tabla/umbral y se reescribió `calcularResultado`.
- Las líneas 54 y 69 repiten 22 categorías/87 puntos y cumplimiento total.
- Describe prueba formativa N=8; la bitácora vigente propone estudio comparativo N≈30.
- La tarea permite elegir el orden; el diseño actual fija lista y orden.
- No documenta suficientemente parámetros, 1.000 iteraciones, semilla, cuota SEP, midpoint, fallback y limitaciones.
- Afirma haber eliminado lenguaje antropomórfico; quedan usos de “el sistema intenta”.
- Describe búsqueda dentro del flujo; el paso 2 usa un catálogo fijo de seis.

Otras inconsistencias:

- `00_resumen.tex`, línea 7: declara 100 %.
- `04_resultados.tex`, línea 24: declara 87/87.
- `04_resultados.tex` describe el algoritmo como plenamente interactivo; los pasos son estáticos y videos inertes.
- `06_conclusiones.tex`, línea 13: repite 100 %.
- `05_discusion.tex` sí contiene una cautela consistente: datos ficticios y ausencia de auditoría del algoritmo real.
- No se encontraron contradicciones técnicas directas adicionales en `01_introduccion.tex` o `02_marco_teorico.tex`.

## 7. Auditoría del simulador

### Comprobaciones solicitadas

| Comprobación | Resultado |
|---|---|
| Tabla antigua `probAsignacion` | ✅ Eliminada de la lógica ejecutable; sobrevive en comentarios/documentación. |
| Umbral 65 como regla | ✅ Eliminado; el número aparece en ejemplos antiguos, no como regla activa. |
| Probabilidad independiente del orden | ✅ Para el porcentaje. ⚠ No para el sorteo puntual de `calcularResultado`. |
| Prioridades por colegio | ✅ En el motor; UI genérica aún simplifica. |
| `SEED_CASO` | ✅ `20260903`. |
| San Martín primero → Los Andes segundo | ✅ Reproducido. |
| Porcentajes reproducibles | ✅ `99, 99, 99, 50, 46, 26` en orden de catálogo. |
| Monte Carlo 1.000 iteraciones | ✅ Constante y bucle real de 1.000. |
| Limitaciones corresponden al código | 🟡 Las principales sí; faltan varias importantes. |

### RNG compartido

`asignacion.js` crea un único `mulberry32(SEED_CASO)` y consume números al recorrer la lista. Mover un colegio cambia qué parte del flujo pseudoaleatorio recibe ese colegio.

Una prueba dinámica de solo lectura ubicando San Martín en posiciones 1–6 mantuvo su porcentaje en 26 %, pero cambió su resultado sentado/no sentado según la posición. Esto contradice “lotería independiente por establecimiento”.

### Fallback presentado como asignación

Si ningún colegio entrega cupo, `calcularResultado` escoge el de mayor probabilidad, lo marca `asignado` y añade `sinAsignacionEnPreferencias:true`. `ResultadoProvisional` revisa la bandera; `SeguimientoPage.generarExplicacion()` no lo hace y puede narrar “Quedaste en…” sin cupo simulado.

### Cache incompleta

La cache de `probabilidadCupo` no incorpora parámetros personalizados. Ejecuciones con parámetros distintos pueden reutilizar un resultado previo.

### Validez y datos

- `colegios.js` declara datos ficticios.
- La bitácora los denomina “reales”.
- `pHermano`, `pFuncionario` y `pExalumno` son estimaciones.
- Vacantes por rango se reducen al punto medio.
- El modelo es DA por colegio, no multi-colegio completo.
- No modela PIE ni alta exigencia.
- La probabilidad se recorta a `[1,99]`.
- Los porcentajes son reproducibles como salida del modelo, no probabilidades validadas del SAE.

## 8. Auditoría de tests y comandos

La primera ejecución literal de `npm test` desde PowerShell terminó con código 1 por la política local:

```text
npm.ps1 cannot be loaded because running scripts is disabled on this system
```

Se repitieron mediante `npm.cmd` sobre una copia temporal para evitar modificar `dist/`.

| Comando | Resultado exacto |
|---|---|
| `npm.cmd test` | Exit 0; 14 tests, 14 pass, 0 fail; 244.006 ms |
| `npm.cmd run lint` | Exit 0; `eslint .`; sin mensajes |
| `npm.cmd run build` | Exit 0; Vite 8.0.13; 62 módulos; 434 ms |

Build principal:

```text
index.html                         0.68 kB
assets/index-*.css               116.80 kB
assets/AlgoritmoPage-*.js        182.76 kB
assets/index-*.js                258.81 kB
```

Ningún chunk superó 500 kB sin comprimir.

### Qué prueban realmente los tests

| Test | Qué valida | Limitación |
|---|---|---|
| Catálogo de seis colegios | IDs/datos contra constantes | No usa una fuente independiente. |
| Snapshot Monte Carlo | 99/99/99/50/46/26 | Regresión de calibración, no evidencia empírica. |
| Prioridad legal ≥90 | Tres casos seleccionados | No cubre todos los colegios/niveles. |
| San Martín <40 | Caso produce 26 | Solo un caso. |
| Demanda media 30–65 | Dos colegios en rango | No valida la categoría general. |
| Clamp [1,99] | Recorte de extremos | Valida presentación, no metodología. |
| “Strategy-proofness” | Porcentaje no cambia de posición | No prueba sorteo, estrategia dominante ni DA multi-colegio. |
| Determinismo | Misma entrada produce misma salida | No prueba independencia por colegio. |
| Lista estándar | Los Andes primero | Regresión. |
| San Martín primero | Los Andes segunda | Reproduce escenario canónico. |
| Lista vacía | Entrada vacía | No cubre lista sin cupos. |
| Parámetros y seed | Constantes | No verifica su uso integral. |
| Etiquetas y tramo | Mapeo | No prueba explicación visible. |
| Etiquetas por colegio | Vínculos por establecimiento | No cubre PIE ni UI genérica. |

Cobertura ausente:

- DOM y rutas.
- Teclado/ARIA.
- Conservación o borrador.
- Invalidación del comprobante.
- Fallback en Seguimiento.
- Fechas, horas y zona.
- Independencia del sorteo por colegio.
- Cache con parámetros distintos.
- Conteo instrumentado de 1.000 iteraciones.
- Modo control/comparación entre sujetos.
- Validación visual o cross-browser.

## 9. Riesgos metodológicos

1. **Denominador reconstruido retrospectivamente:** 87 no surge de la matriz.
2. **Autoclasificación como evidencia:** comentarios y checks provienen del mismo proceso de desarrollo.
3. **Modelo presentado como probabilidad real:** parámetros y datos parcialmente ficticios.
4. **Explicaciones causales sobre una simulación:** “Quedaste porque…” excede lo que demuestra el modelo.
5. **Tratamiento incompleto:** F2 tiene brechas y F3 no existe.
6. **Metodología desincronizada:** N=8/N≈30, orden libre/fijo y caso SEP/sin SEP.
7. **Resultado fijo con confound técnico:** RNG compartido dependiente del recorrido.
8. **Validez externa inexistente:** parámetros no contrastados con resultados reales.
9. **Ausencia de evaluación de accesibilidad:** ARIA parcial sin pruebas asistivas.
10. **Estados y fechas simulados:** reloj del cliente y límites UTC/locales.

## 10. Lista priorizada de correcciones

Estas son recomendaciones; la auditoría no aplicó ninguna.

### Prioridad crítica

1. Definir una matriz canónica con IDs estables y denominador correcto.
2. Retirar 87/87 de plan, contextos y memoria hasta repetir la auditoría.
3. Hacer independiente por colegio el sorteo determinista y probarlo conductualmente.
4. Eliminar/reformular el fallback de “asignación” sin cupo y propagar su estado.
5. Sincronizar `03_metodologia.tex` con el Monte Carlo y el diseño N≈30.
6. No iniciar el estudio hasta completar tratamiento y control.

### Prioridad alta

7. Corregir autocomplete, stepper y controles personalizados; probar teclado y ARIA.
8. Declarar en la UI que datos/parámetros son ficticios o estimados.
9. Incorporar parámetros a la clave de cache.
10. Definir si PIE y hermanos en bloque participan del modelo o retirar la afirmación.
11. Unificar consecuencias de aceptar/rechazar.
12. Implementar invalidación efectiva del comprobante o moderar el texto.

### Prioridad media

13. Implementar videos/infografía o reclasificarlos como placeholders.
14. Actualizar el tour y eliminar selectores obsoletos.
15. Completar metadatos y `og:image`.
16. Revisar siglas, lenguaje inclusivo y longitud del microcopy.
17. Corregir breakpoint de 768 px y overflow móvil.
18. Retirar afirmaciones de foto real, quick cards y borrador visible.
19. Añadir pruebas de fechas/horas con zona `America/Santiago`.
20. Separar claramente historial, estado actual y trabajo pendiente.

## Conclusión

El repositorio compila, pasa lint y sus 14 tests, pero la evidencia no respalda un cumplimiento 87/87. El resultado independiente reproducible es **55 de 98 requisitos aplicables completamente implementados**, sobre una matriz real de **102 filas**.

## Integridad de la auditoría

- No se modificó código del proyecto.
- No se corrigieron defectos.
- No se hicieron commits.
- El build se ejecutó en una copia temporal.
- Antes de crear este informe, la única entrada de `git status --short` era `?? docs/CONTEXTO_GENERAL_PROYECTO.md`.
