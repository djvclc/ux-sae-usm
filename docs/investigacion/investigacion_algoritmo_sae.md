# Investigación: El algoritmo del Sistema de Admisión Escolar (SAE) de Chile

**Fecha:** 2026-07-30
**Propósito:** Documentar en profundidad el funcionamiento del algoritmo del SAE y los argumentos que fundamentaron su implementación en Chile. Sirve de respaldo para la memoria de título (`proyecto-tesis/`) y para el prototipo (`sae-react/`).
**Fuente primaria principal:** Correa, Epstein, Escobar, Rios et al., *School Choice in Chile* (Universidad de Chile / Operations Research), paper de los diseñadores del sistema.

---

## 1. Resumen ejecutivo

El SAE es un sistema centralizado de admisión escolar creado por la Ley de Inclusión Escolar N.º 20.845 (2015). Asigna estudiantes a establecimientos con financiamiento público mediante una adaptación del algoritmo de **Aceptación Diferida** (*Deferred Acceptance*, DA) de Gale y Shapley (1962), la misma familia de mecanismos reconocida con el Premio Nobel de Economía 2012 (Roth y Shapley) y utilizada en Nueva York, Boston, Ámsterdam y Nueva Orleans, entre otros. Fue diseñado e implementado por investigadores de Ingeniería Industrial de la Universidad de Chile (José Correa, Rafael Epstein, Juan Escobar e Ignacio Ríos, entre otros), partió como piloto en Magallanes en 2016 y alcanzó cobertura nacional completa en el proceso de admisión 2020. Es uno de los sistemas de elección escolar más grandes del mundo: en el proceso 2018 participaron 274.990 estudiantes y 6.421 establecimientos, y hoy atiende a más de medio millón de estudiantes al año.

## 2. Contexto: el sistema previo y la Ley de Inclusión

### 2.1 Diagnóstico del sistema descentralizado

Antes de la ley, cada establecimiento gestionaba su admisión de forma independiente. El paper de los diseñadores documenta los problemas del esquema anterior:

- **Selección arbitraria:** entrevistas a estudiantes y apoderados, exámenes de admisión no oficiales y revisión de antecedentes académicos y familiares.
- **Descoordinación:** al no existir un proceso común, las familias debían aceptar o rechazar ofertas sin conocer el resultado en otros colegios, y los cupos rechazados no se reasignaban eficientemente.
- **Filas nocturnas:** muchos colegios usaban orden de llegada (*first-come, first-served*), lo que obligaba a los apoderados a hacer filas durante la noche para asegurar un cupo.
- **Segregación:** según el Índice de Segregación de Duncan, las escuelas chilenas se encontraban entre las más segregadas socialmente (Bellei 2013; Valenzuela et al. 2014). La libertad de los colegios para escoger a sus estudiantes se consideraba una de las causas principales.

### 2.2 La Ley de Inclusión Escolar N.º 20.845 (2015)

La ley cambió drásticamente el proceso al: (i) eliminar el copago en establecimientos subvencionados; (ii) **prohibir la selección** por criterios sociales, religiosos, económicos o académicos en todo establecimiento que reciba financiamiento estatal; y (iii) definir prioridades legales para la asignación. La ley exige que los procesos de admisión sean objetivos y transparentes, garanticen equidad e igualdad de oportunidades y no impliquen discriminación arbitraria. El SAE es el instrumento operativo de ese mandato: plataforma de información y postulación en línea más un mecanismo de asignación centralizado.

## 3. Cómo funciona el algoritmo

### 3.1 Base: Aceptación Diferida (Gale–Shapley, 1962)

En la versión *student-proposing* utilizada en Chile, el mecanismo opera por rondas:

1. Cada estudiante "propone" a su colegio más preferido entre los que aún no lo han rechazado.
2. Cada colegio ordena a sus postulantes según prioridades legales y desempate aleatorio, y **retiene tentativamente** a los mejores hasta llenar sus vacantes; rechaza al resto.
3. Los rechazados proponen a su siguiente preferencia. Un estudiante retenido puede ser desplazado en rondas posteriores por otro con mejor prioridad (por eso la aceptación es "diferida": nada es definitivo hasta el final).
4. El proceso termina cuando no hay más propuestas; las retenciones tentativas se vuelven asignaciones definitivas.

Si el número de postulantes a un colegio es menor que sus vacantes, la ley obliga a admitirlos a todos (salvo que queden en un colegio que prefieren más).

### 3.2 Criterios de prioridad y cuotas (definidos por ley)

Para ordenar postulantes en colegios sobredemandados existen **tres grupos de prioridad**, procesados en orden estricto:

1. **Hermanos:** postulantes con un hermano o hermana ya matriculado o admitido en el establecimiento.
2. **Padre o madre funcionario:** hijos de trabajadores del establecimiento.
3. **Ex-estudiantes:** quienes desean regresar y no fueron expulsados.

Y **tres cuotas** (reservas de asientos):

1. **Necesidades educativas especiales (PIE):** hasta 2 cupos por curso, procesada antes que cualquier otra prioridad, solo en colegios con programa validado.
2. **Alta exigencia académica:** entre 30 % y 85 % de los cupos en colegios preseleccionados por Mineduc, solo en 7.º básico y 1.º medio, con ranking por examen de admisión.
3. **Estudiantes prioritarios:** 15 % de los cupos por nivel reservados para el tercio de menores ingresos según el Registro Social de Hogares; se procesa inmediatamente después de los hermanos.

En la práctica, los diseñadores modelan cada cuota como una "sub-escuela" con sus propias vacantes y prioridades (enfoque de *matching with contracts*, basado en Kurata et al. 2017), porque las cuotas con tipos superpuestos pueden hacer inexistente un emparejamiento estable con los modelos clásicos.

Requisitos legales adicionales: los desempates deben sortearse **de forma independiente en cada colegio** (regla *Multiple Tie-Breaking*, no una lotería única nacional); el estudiante que postula para cambiarse de colegio conserva garantizado su cupo actual si no logra mejorar (variante DA\*, que ubica al estudiante en la cima de la prioridad de su colegio actual y agrega ese colegio al final de su lista); y los no asignados se asignan al colegio más cercano con vacantes.

### 3.3 Adaptaciones chilenas: la postulación familiar

El desafío de diseño más novedoso del caso chileno es favorecer que los hermanos queden en el mismo colegio (objetivo acordado con Mineduc, aunque no exigido por ley, porque la ley excluyó deliberadamente la prioridad por cercanía territorial —dada la alta segregación urbana— y casi no existe transporte escolar público). Esto introduce complementariedades análogas al problema de *matching with couples*, y los autores **demuestran que con preferencias familiares arbitrarias puede no existir asignación estable** (Proposición 1 del paper). Su solución heurística tiene tres componentes:

1. **Postulación familiar:** cada hijo presenta su propia lista de preferencias y la familia declara si prioriza que queden juntos. Se asume la estructura *higher-first*: la familia prioriza al hijo de curso superior (por la cercanía de las pruebas de acceso a la universidad) y conveniencia para los menores.
2. **Procesamiento por grados en orden decreciente:** se resuelve primero 4.º medio y se baja hasta prekínder. Tras asignar cada grado, se actualizan las prioridades (los menores adquieren prioridad de hermano donde quedó asignado el mayor) y, si hay postulación familiar, el colegio del hermano mayor sube al primer lugar de la lista del menor.
3. **Lotería por familia:** en cada colegio el desempate aleatorio se sortea primero entre familias y luego entre los miembros de cada familia, lo que correlaciona las posiciones de los hermanos y aumenta la probabilidad de asignación conjunta sin perjudicar a hijos únicos (Proposición 3).

Con estas restricciones, los autores demuestran que la asignación resultante **es estable** (Proposición 2). En simulaciones con 10.000 repeticiones, la combinación de actualización de preferencias y lotería familiar eleva las postulaciones familiares totalmente exitosas de 52,9 % a 65,5 %.

### 3.4 Rondas del proceso

- **Ronda principal** (postulación septiembre–octubre): se ejecuta el algoritmo con las loterías; las familias pueden aceptar, rechazar o esperar movimiento de listas de espera.
- **Ronda complementaria** (noviembre–diciembre): para no asignados, rechazos y nuevos postulantes, solo con colegios con vacantes.
- **Asignación por cercanía:** los no asignados tras la ronda complementaria se asignan al colegio más cercano (dentro de 17 km) con cupos y sin copago; en 2018 solo el 0,6 % del total requirió asignación manual de Mineduc.

## 4. Propiedades teóricas y decisiones de diseño

### 4.1 Por qué Aceptación Diferida y no otro mecanismo

- **Frente a Top Trading Cycles (TTC):** ambos eran candidatos; se optó por DA porque **comunicar y justificar los resultados es mucho más simple** —especialmente ante familias disconformes— y por su historial de uso en otros distritos escolares del mundo. Esta razón (explicabilidad del resultado) es directamente relevante para el eje de transparencia algorítmica del proyecto USM.
- **Frente al Mecanismo de Boston (aceptación inmediata):** Boston abandonó ese mecanismo en 2005 precisamente porque incentiva la postulación estratégica (ocultar la verdadera primera preferencia); DA elimina ese incentivo.

### 4.2 Propiedades

- **Estabilidad / ausencia de envidia justificada:** ningún estudiante prefiere un colegio que haya admitido a otro postulante con peor prioridad que él. Es la formalización de "asignación justa" que exige la ley.
- **No desperdicio:** ningún estudiante puede reclamar un cupo vacío de un colegio que prefiere.
- **Incompatibilidad de incentivos (strategy-proofness):** en su forma estándar, el DA con propuesta de estudiantes hace que declarar las preferencias verdaderas sea la estrategia óptima. Con las adaptaciones chilenas el mecanismo **no es strategy-proof en sentido estricto** (Observaciones 3 y 4 del paper: familias con varios hijos podrían en teoría manipular), pero los autores muestran que las desviaciones rentables son muy limitadas y que en mercados grandes el mecanismo es **esencialmente strategy-proof** (los beneficios de manipular se desvanecen; cf. Azevedo y Leshno 2016).

## 5. Argumentos para implementarlo en Chile

Los argumentos documentados se agrupan en cuatro planos:

1. **Normativo (mandato legal):** la Ley 20.845 prohibió seleccionar y exigió procesos objetivos, transparentes y no discriminatorios; un mecanismo centralizado con prioridades explícitas y sorteos auditables es la forma operativa de cumplirlo.
2. **De equidad:** eliminar entrevistas, exámenes y filas suprime ventajas de las familias con más recursos, información y tiempo; las cuotas (15 % prioritarios, PIE) incorporan acción afirmativa; la alta segregación escolar chilena era el problema de fondo que motivó la reforma.
3. **De eficiencia práctica:** una plataforma única reduce el costo de postular (antes había que visitar colegio por colegio), reasigna eficientemente los cupos liberados, y el resultado es estable y sin desperdicio de vacantes.
4. **De respaldo científico:** el DA cuenta con seis décadas de teoría (Gale-Shapley 1962; formalización de school choice por Abdulkadiroğlu y Sönmez 2003), el Nobel de Economía 2012 y experiencia internacional exitosa (Nueva York, Boston, Ámsterdam, Nueva Orleans, entre otros). La primera aplicación en Magallanes (2016) fue evaluada como exitosa: 86,8 % de los postulantes admitido en alguna de sus preferencias.

## 6. Resultados empíricos (proceso 2018, paper de los diseñadores)

| Indicador | Valor |
|---|---|
| Estudiantes (ronda principal) | 274.990 |
| Establecimientos | 6.421 (32.198 pares colegio-grado; 522.859 vacantes) |
| Postulaciones promedio por estudiante | 3,18 colegios |
| Asignados a su 1.ª preferencia | 59,2 % |
| Asignados a alguna preferencia de su lista | 82,5 % |
| Mantienen su colegio actual | 8,6 % |
| No asignados en ronda principal | 8,9 % |
| Postulaciones familiares totalmente exitosas | 65,3 % (y 3 % parcialmente) |
| Estudiantes prioritarios entre postulantes | 54,7 % |

Dato de diseño relevante: los prioritarios superan el 50 % de los postulantes mientras la cuota es de solo 15 %, lo que abre la pregunta (analizada en el paper) sobre el impacto real de una cuota cuando la población objetivo es mayoritaria.

## 7. Debate público y estado actual (2026)

- **La crítica de la "tómbola":** sectores críticos sostienen que el azar reemplazó el mérito y el compromiso de las familias. Los defensores responden que el azar solo opera como último desempate tras preferencias y prioridades, y que caricaturizarlo como tómbola dañó la confianza pública en el sistema. Esta percepción es exactamente la que la persona objetivo del prototipo USM (Daniela González) manifiesta, y la que el prototipo busca revertir mediante transparencia.
- **Evidencia sobre segregación:** estudios gubernamentales tempranos indicaban un efecto moderado o nulo; investigaciones del CIAE reportan una disminución sostenida de la segregación escolar entre 2015 y 2024, consistente con las leyes SEP y de Inclusión.
- **Reforma en trámite (junio 2026):** el Gobierno presentó un proyecto de ley que introduce un sistema mixto de "elección mutua": colegios de alta demanda podrían aplicar criterios propios (rendimiento académico desde 7.º básico, asistencia previa, entrevistas), manteniendo reservas para prioritarios y estudiantes con NEE. Académicos advierten que esto arriesga desmontar el sistema y reinstalar discriminaciones arbitrarias. El proyecto está en discusión; el SAE vigente sigue operando con el algoritmo descrito.

## 8. Fuentes

**Fuente primaria (algoritmo y diseño):**
- Correa, Epstein, Escobar, Rios et al., [School Choice in Chile](https://www.dii.uchile.cl/~jescobar/paper-SAE.pdf) (versión de trabajo; publicado en *Operations Research*, [DOI](https://pubsonline.informs.org/doi/abs/10.1287/opre.2021.2184)).

**Marco legal y operación:**
- [Ley 20.845 (texto oficial, Mineduc)](https://especial.mineduc.cl/wp-content/uploads/sites/31/2016/08/LEY-20845_08-JUN-2015.pdf)
- [Criterios de prioridad — Ayuda Mineduc](https://www.ayudamineduc.cl/ficha/criterios-de-prioridad)
- [¿Cómo funciona el proceso de Admisión Escolar (SAE)? — Gob.cl](https://www.gob.cl/noticias/sistema-admision-escolar-que-es-como-funciona-fechas-orden-prioridad-estudiantes/)

**Origen científico y difusión:**
- [Algoritmo promete terminar con filas y discriminación — U. de Chile](https://www.uchile.cl/noticias/136623/algoritmo-promete-terminar-con-filas-en-la-admision-escolar)
- [La ciencia detrás del nuevo sistema de admisión escolar — Iniciativa Milenio](https://www.iniciativamilenio.cl/la-ciencia-detras-del-nuevo-sistema-de-admision-escolar/)
- [Las matemáticas y algoritmos detrás del nuevo sistema — El Mostrador / MIPP](https://www.elmostrador.cl/cultura/2017/09/26/las-matematicas-y-algoritmos-detras-del-nuevo-sistema-de-admision-escolar/)
- [Mineduc elogió el algoritmo del SAE — MIPP](https://mipp.cl/es/2022/08/04/ministerio-de-educacion-alaba-algoritmo-de-sistema-de-admision-escolar/)

**Debate y evaluación:**
- [La polémica tras el algoritmo — Chequeado](https://chequeado.com/investigaciones/la-polemica-tras-el-algoritmo-que-busca-mejorar-la-equidad-en-el-acceso-a-la-educacion-en-chile/)
- [SAE: más allá de "la tómbola" — CIPER](https://www.ciperchile.cl/2023/09/20/sistema-de-admision-escolar-sae-mas-alla-de-la-tombola/)
- ["El SAE no es una tómbola" — Radio U. de Chile](https://radio.uchile.cl/2024/12/08/el-sae-no-es-una-tombola-expertos-en-educacion-abordan-las-fortalezas-y-debilidades-del-sistema-de-admision-escolar/)
- [Las consecuencias de la Ley de Inclusión Escolar — FACSO U. de Chile](https://facso.uchile.cl/noticias/136328/las-consecuencias-de-la-ley-de-inclusion-escolar)

**Reforma 2026:**
- [Proyecto de ley que reforma el SAE — Mineduc](https://www.mineduc.cl/presidente-de-la-republica-jose-antonio-kast-y-ministra-arzola-presentaron-proyecto-de-ley-que-reforma-el-sistema-de-admision-escolar/)
- [¿Qué dice el nuevo proyecto de Admisión Escolar? — Gob.cl](https://www.gob.cl/noticias/presentacion-proyecto-ley-reforma-sistema-admision-escolar-sae-repone-merito-academico/)
- [Cabalin: la "elección mutua" arriesga desmontar el sistema — Radio U. de Chile](https://radio.uchile.cl/2026/07/26/cristian-cabalin-por-reforma-al-sae-la-eleccion-mutua-arriesga-desmontar-el-sistema-y-reinstalar-discriminaciones-arbitrarias/)
- [Cambios al SAE reabren choque político — Radio U. de Chile](https://radio.uchile.cl/2026/05/22/cambios-al-sae-reabren-choque-politico-necesitamos-corregir-la-tombola-versus-no-estamos-disponibles-a-retroceder/)
