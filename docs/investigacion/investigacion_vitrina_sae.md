# Investigación: Vitrina de establecimientos del SAE (admision.mineduc.cl/vitrina-vue)

**Fecha:** 2026-07-30
**Método:** Recorrido guiado en vivo sobre la vitrina oficial (proceso Admisión Escolar 2027, versión 2.5.1 de la plataforma), con capturas de: estado inicial, filtros, las tres vistas de resultados, ordenamiento y ficha completa de un establecimiento (Liceo José Abelardo Núñez N.º 4, RBD 25899, Huechuraba). Se complementa con los hallazgos específicos de la vitrina del informe heurístico Fondecyt N.º 1250492 (marzo 2026), disponible en esta misma carpeta.
**Propósito:** Servir de feedback para la vista de colegios del prototipo (`InicioPage.jsx` — buscador— y `ColegioPage.jsx` — ficha).

---

## 1. Arquitectura y flujo de la vitrina

Flujo único y lineal, desacoplado de la postulación:

1. **Selección obligatoria** de Región → Comuna → Nivel al que postula (dropdowns dependientes). Hasta no completarla, la vitrina muestra "0 Establecimientos encontrados". Búsqueda opcional por nombre de establecimiento.
2. **Filtros personalizados** (aparecen tras la selección): Jornada, Género, PIE, Dependencia y "Otros criterios" (gratuitos, con internado, adscritos a SEP, técnico-profesional, hasta 4.° medio) con botón "Filtrar".
3. **Resultados** en tres vistas conmutables: **Detalle** (tarjetas con foto), **Lista** (tabla) y **Mapa** (Google Maps con pines). Paginación clásica. "Ordenar resultados" ofrece solo cuatro criterios: menos/más alumnos por curso y menos/más matriculados.
4. **Ficha del establecimiento** (URL propia: `/vitrina-vue/establecimiento/<RBD>`), con botón de retorno "Ver más establecimientos".

No existe ninguna acción de postulación ni lista de favoritos: la vitrina es solo consulta; postular ocurre en otra plataforma.

## 2. Inventario de información

### 2.1 Tarjeta de resultado (vista Detalle)

Nombre, fotografía real, fila de íconos ($ copago, género, SEP, PIE — atenuados si no aplican), dirección, dependencia (público / particular subvencionado), niveles impartidos, matriculados y alumnos promedio por curso. La vista Lista muestra los mismos campos en tabla más el botón VER. Leyenda de iconografía permanente sobre los resultados.

### 2.2 Ficha del establecimiento

- **Información institucional:** RBD, director(a) con nombre, dependencia, niveles, orientación religiosa, íconos SEP/PIE/género, fotografía con galería.
- **Proyecto Educativo:** resumen expandible ("+Ver más") y **descargables** de Proyecto Educativo y Reglamento Interno (PDF).
- **Proyecto de Integración Escolar:** texto explicativo en lenguaje claro de qué es el PIE.
- **Ubicación y contactos:** dirección con enlace a mapa, región, comuna, teléfono, página web.
- **Vacantes año escolar (2027):** tabla por nivel con jornada, **vacantes expresadas como rango** (ej. "73 a 85 vacantes") y **postulantes del año anterior** por nivel. Notas al pie: vacantes referenciales estimadas con datos del establecimiento; postulantes = cantidad que postuló al curso el año previo.
- **Información de pago:** gratuito/copago desglosado por nivel (parvularia, básica, media).
- **Datos y estadísticas:** matriculados, promedio de alumnos por curso, cantidad de docentes.
- **Indicadores de la Agencia de la Calidad** (acordeones): **SIMCE** (puntaje por prueba y comparación con colegios del **mismo grupo socioeconómico**: "Más bajo/Similar/Más alto"); **Desarrollo personal y social** (autoestima académica y motivación, clima de convivencia, hábitos de vida saludable, participación y formación ciudadana — puntaje y comparación GSE); **Categoría de desempeño** (escala visual Alto/Medio/Medio-Bajo/Insuficiente con la categoría del colegio resaltada y explicación en lenguaje claro que menciona el ajuste por contexto social).
- **Programas, extracurriculares e infraestructura** (acordeones): actividades extraprogramáticas, apoyo académico, deportes, idioma, infraestructura, programas — listas simples de viñetas.
- **Nota de procedencia:** "El contenido de esta ficha fue entregado por el establecimiento a través del SIGE y la Agencia de Calidad de la Educación".

## 3. Hallazgos UX

### 3.1 Fortalezas a considerar

1. **Transparencia de demanda real:** publicar postulantes del año anterior junto a las vacantes por nivel es el dato más valioso de la ficha — permite a la familia estimar sus posibilidades con evidencia, exactamente la necesidad de nuestra persona (Daniela).
2. **Vacantes como rango con nota de estimación**, gestión de expectativas correcta.
3. **Comparación SIMCE contra colegios del mismo GSE** (no contra la comuna): comparación más justa, alineada con la literatura de información multidimensional.
4. **Categoría de desempeño con escala visual resaltada** y explicación en lenguaje claro, incluido el ajuste por contexto social.
5. **Descargables oficiales** (PEI, reglamento interno) y **nota de procedencia de los datos**: trazabilidad de la fuente.
6. **Explicaciones didácticas** de conceptos (PIE) dentro de la propia ficha.
7. Tres vistas de resultados (tarjetas/tabla/mapa) que sirven a distintos estilos de exploración.

### 3.2 Debilidades observadas en vivo

1. **Embudo rígido:** nada se muestra sin región+comuna+nivel; no hay exploración libre ni por cercanía.
2. **Acordeones mutuamente excluyentes:** no se puede ver SIMCE y desarrollo personal a la vez — impide la lectura multidimensional conjunta.
3. **Ordenamiento pobre:** solo alumnos por curso y matriculados; no por SIMCE, vacantes ni distancia.
4. **Comparaciones crípticas:** "Más bajo (6)" no explica qué significa el número entre paréntesis; el asterisco de GSE se define lejos del dato.
5. **Datos desactualizados o heterogéneos:** categoría de desempeño de 2019 conviviendo con SIMCE 2025, sin advertencia.
6. **Mapa sin utilidad de decisión:** pines sin distancia al hogar ni ruta.
7. **Iconografía dependiente de leyenda** permanente ($, siluetas de género, SEP, PIE).
8. **Vitrina desacoplada de la postulación:** conocer un colegio y postular a él son mundos separados; no hay "guardar" ni "agregar a mi lista".
9. **Sin explicación del algoritmo ni de probabilidades:** la vitrina entrega el insumo (postulantes vs. vacantes) pero no lo interpreta para la familia.

### 3.3 Hallazgos del informe heurístico Fondecyt sobre la vitrina (corroboran lo anterior)

Cajas de establecimientos con alturas desiguales en vista Detalle (Firefox, Opera, Safari, Edge); tablas de SIMCE y desarrollo personal cortadas en móviles de pantalla angosta; carga de hasta 7 segundos entre entradas en dispositivos de gama baja; galería de fotos sin atributo `alt`; paginación de resultados inaccesible por teclado (solo página 1); inconsistencia de rotulado ("Vitrina de establecimientos" vs. "Buscador de establecimientos"); siglas SEP/PIE sin explicar en el buscador; rendimiento PageSpeed de 14 %.

## 4. Feedback accionable para nuestra vista de colegios

### 4.1 Adoptar (brechas del prototipo respecto de la vitrina)

1. **Agregar postulantes del año anterior por nivel** en la tabla de vacantes de `ColegioPage`: fundamenta el chip de demanda (alta/media/baja) con el dato real que lo origina, en línea con explicabilidad contextualizada.
2. **Vacantes como rango** ("29 a 45") en lugar de número exacto — hoy tenemos nota de estimación, pero el número puntual sugiere falsa precisión.
3. **Jornada por nivel** dentro de la tabla de vacantes (hoy es un chip global).
4. **Sumar categoría de desempeño** de la Agencia con la escala visual de 4 niveles y explicación en lenguaje claro — encaja con nuestro patrón de divulgación progresiva.
5. **Comparación SIMCE de referencia doble:** mantener el promedio comunal (concreto para Daniela) y añadir la comparación con colegios de GSE similar, explicando en una línea qué significa.
6. **Información de pago por nivel** (gratuito/copago) — dato de primera necesidad que hoy no mostramos.
7. **Identidad institucional para realismo:** RBD, director(a), dependencia y orientación religiosa en el encabezado de la ficha.
8. **Descargables** (PEI y reglamento) y **nota de procedencia de datos** al pie de la ficha — refuerza nuestra línea de transparencia.
9. **Explicar íconos en el punto de uso** (tooltips/texto junto al ícono), evitando la leyenda desacoplada de la vitrina.

### 4.2 Conservar (ventajas de nuestro prototipo que la vitrina no tiene)

1. **Ficha en secciones abiertas simultáneas** (grid) en lugar de acordeones excluyentes.
2. **CTA integrada "Agregar a mi lista de postulación"** desde la ficha: unifica exploración y postulación, el mayor quiebre de flujo de la vitrina.
3. **Comparador lado a lado** (`/comparador`), inexistente en la vitrina.
4. **Interpretación de demanda y expectativas** (chips y textos explicativos), no solo datos crudos.
5. **Exploración libre** sin embudo región→comuna→nivel obligatorio.
6. **Accesibilidad**: barra de tamaño de texto, roles ARIA, navegación por teclado — puntos donde la vitrina reprueba en el informe heurístico.

### 4.3 Oportunidades diferenciales

1. **Ordenar resultados por criterios útiles** (SIMCE, vacantes, distancia, demanda), superando los 4 criterios pobres de la vitrina.
2. **Conectar vacantes/postulantes con la explicación del algoritmo** (`/algoritmo`): la vitrina entrega el insumo pero no lo traduce en "qué significa para tu postulación"; ese puente es exactamente nuestra tesis.
3. **Fechar cada dato** (año de la medición) para evitar la mezcla silenciosa de años observada en la vitrina.

## 5. Registro de capturas

Recorrido efectuado el 2026-07-30 (12:14–12:25) en Chrome sobre el proceso Admisión 2027: (1) estado inicial con buscador vacío; (2) filtros personalizados con RM/Huechuraba/IV Medio, 4 resultados; (3) menú "Otros criterios"; (4) tarjetas vista Detalle; (5) vista Lista con menú de ordenamiento; (6) vista Mapa; (7–12) ficha RBD 25899: encabezado + vacantes, pago + estadísticas + acordeones, SIMCE, desarrollo personal y social, categoría de desempeño, actividades extraprogramáticas y cierre con nota de procedencia.

## 6. Fuentes

- Recorrido en vivo: [Vitrina de establecimientos SAE](https://admision.mineduc.cl/vitrina-vue) (Admisión 2027, v2.5.1).
- Informe heurístico: `docs/investigacion/Informe Evaluación de calidad web SAE (1).pdf` (Fondecyt N.º 1250492, marzo 2026).
- Descripción oficial de la vitrina: [Mineduc — registro de apoderados](https://www.mineduc.cl/sistema-de-admision-escolar-sae-comienza-el-registro-de-apoderados/), [Gob.cl — Conoce tu escuela](https://www.gob.cl/noticias/conoce-escuela-forma-anticipada-postulaciones-sae-2024-sistema-admision-escolar/), [Paso a paso para postular](https://www.sistemadeadmisionescolar.cl/paso_a_paso_para_postular.html).
