# Feedback: Problemas detectados en el SAE
**Fuente:** Informe de Evaluación de calidad web del SAE — Morales-Vargas et al., Universidad de Chile, Fondecyt N.º 1250492, marzo 2026  
**Fecha de extracción:** 2026-05-26  
**Secciones cubiertas:** 13 (Sitio web informativo) y 14 (Plataforma de postulación)

---

## Resumen de puntajes

| Sitio | Imprescindible | Esperable | Deseable | Total |
|---|---|---|---|---|
| **13 — Sitio informativo** | 55% | 57% | 22% | **51%** |
| **14 — Plataforma de postulación** | 55% | 57% | 22% | **61%** |

---

## Sección 13 — Sitio web informativo del SAE

### a) Contenido y lenguaje claro

- El título del sitio informativo **no coincide** con el de la plataforma de postulación, lo que genera inconsistencia entre ambos sistemas.
- Se usan **siglas desconocidas para el público general**, como IPA (Identificador Provisorio de Apoderado) o IPE (Identificador Provisorio de Estudiante), sin explicación en el contexto donde aparecen.
- Hay **etiquetas vagas** como "Regularización 2025" que no indican claramente a qué proceso hacen referencia.
- Se usan **términos técnicos** como "género del establecimiento" cuyo significado no resulta evidente para un apoderado.
- La **legibilidad del texto es muy baja**: índice Spaulding de 120.43, clasificado como "difícil". El objetivo debería ser nivel 6.° básico.
- Se hacen **referencias legales** (decretos, artículos) sin ofrecer contexto o explicación al usuario.

### b) Usabilidad

- El llamado a la acción "Postular" **no está visible en todas las páginas** y en algunas secciones queda oculto o mal posicionado.
- **No existe página de error 404 personalizada**: cuando el usuario llega a una URL inexistente, se muestra una respuesta genérica sin orientación sobre qué hacer.
- Algunos **vínculos llevan a destinos inesperados** que no corresponden a la etiqueta del enlace.
- Existe un **enlace roto** (`/#material`) que no lleva a ningún contenido.

### c) Accesibilidad web

- El color gris claro usado en algunos textos (#c7c8c7 sobre blanco) **tiene una ratio de contraste de 1.68:1**, lo que falla en todos los niveles WCAG (A, AA y AAA). Es completamente ilegible para personas con baja visión.
- Un ícono del sitio tiene **texto alternativo (`alt`) incorrecto**: describe la imagen de forma literal y técnica, no funcional.
- Varias **secciones completas del sitio no son navegables por teclado**, bloqueando el acceso a usuarios que no usan ratón (personas con discapacidad motriz).
- El **PDF descargable del proceso falla la evaluación MAUVE++** con 5 de 6 criterios reprobados, lo que lo hace inaccesible para lectores de pantalla.

### d) Arquitectura de información

- El **menú de navegación no sigue el orden cronológico** del proceso SAE, lo que desorienta a apoderados que llegan sin conocimiento previo.
- Se usan **nombres distintos para el mismo concepto** según la sección del sitio que se visite.
- Hay **etiquetas de menú vagas** que no permiten predecir el contenido de la página destino.
- Los **íconos visuales no coinciden** con el texto que los acompaña, generando contradicción.
- Algunos **enlaces llevan a páginas cuyo contenido no corresponde** al título del enlace.

### e) Búsqueda y encontrabilidad

- **No existe un buscador interno** en el sitio, obligando al usuario a navegar manualmente por toda la estructura.
- **No existe un mapa del sitio** (`sitemap.html` ni `sitemap.xml`) que facilite la indexación ni la navegación alternativa.
- Varias páginas **carecen de metadescripciones** (`<meta name="description">`), lo que perjudica el posicionamiento en buscadores y la comprensión del contenido antes de ingresar.

### f) Responsividad móvil

- En tabletas en orientación vertical, el **menú de navegación se rompe** y no se adapta correctamente al ancho de pantalla.
- En la sección "Extranjeros", el contenido **excede los márgenes del viewport**, requiriendo scroll horizontal en dispositivos móviles.

### g) Diseño e imagen institucional

- El botón "Postular" **no está destacado visualmente** como la acción principal del sitio, perdiendo la jerarquía visual que debería tener.
- El sitio usa la tipografía **Museo Sans** en lugar de **Roboto**, que es la fuente oficial del kit de interfaz de usuario del Gobierno de Chile.
- Se usa el color **#F3E60BFF** (amarillo intenso) que **no figura en el kit de UI oficial** de Gobierno Digital Chile.
- El texto de la barra de navegación tiene **15px**, por debajo del mínimo recomendado de 16px para móviles.

### h) Seguridad

- El dominio **no redirige automáticamente de HTTP a HTTPS**, quedando expuesto a ataques de intermediario.
- Falta la cabecera de seguridad **X-Content-Type-Options**, lo que permite ataques de MIME sniffing.

### i) Tecnología

- El HTML del sitio presenta **27 errores de validación** (W3C Markup Validator).
- El CSS del sitio presenta **65 errores de validación** (W3C CSS Validator).
- Durante el período de evaluación, **la plataforma de postulación estuvo inaccesible**, lo que impidió evaluar algunas funcionalidades.

### j) Atención a la ciudadanía

- **No existe un chat en tiempo real** ni mecanismo de comunicación directa en línea para resolver dudas durante el proceso.
- **La OIRS (Oficina de Información, Reclamos y Sugerencias) no es visible** desde las páginas principales del sitio.

### k) Audiovisualidad

- **No existen videotutoriales** que expliquen el proceso SAE al usuario. La totalidad del contenido explicativo es texto plano, sin infografías ni material audiovisual.

### l) Enfoque de género

- Todos los textos del sitio usan **exclusivamente el género masculino** ("el apoderado", "el postulante"), sin formas inclusivas ni opciones de lenguaje neutro.

### m) Imparcialidad e igualdad de trato

- **No hay controles de tamaño de fuente** que permitan a personas con baja visión ajustar el texto.
- **No hay versiones del sitio en otros idiomas** ni en lenguas originarias (Creole, inglés, Mapudungun), pese a que una parte de la población objetivo incluye migrantes y comunidades indígenas.

### n) Inclusión

- El amarillo (#F3E60BFF) utilizado como color diferenciador **desaparece bajo el filtro de daltonismo Tritanopía**, haciendo que ciertos elementos visuales sean indistinguibles para usuarios con ese tipo de ceguera al color.

### o) Promoción

- Existen **múltiples URLs** que apuntan al mismo proceso (con y sin `www`, con distintos paths), generando duplicación de contenido y confusión.
- Se detectan **etiquetas `<h1>` duplicadas** en varias páginas.
- Algunas URLs usan **guiones bajos** en lugar de guiones medios, lo que perjudica el SEO.
- **Faltan metadescripciones** en múltiples páginas, lo que afecta la visibilidad en buscadores.

### p) Transparencia y apertura

- **No existe ninguna sección de transparencia** en el sitio informativo del SAE: no hay información pública sobre el funcionamiento del algoritmo, criterios de asignación, estadísticas de resultados ni datos de gestión accesibles al ciudadano.

### q) Prevención de errores

- La **dirección del pie de página** corresponde a las oficinas del Mineduc, que no son un punto de atención presencial del SAE, induciendo a error al usuario que busca asistencia.
- Algunos **vínculos llevan a destinos incorrectos** respecto a lo que anuncia su etiqueta.
- El **mensaje de error de contraseña incorrecta es genérico**: no indica si el problema es la contraseña, el usuario, o el estado de la cuenta.

### r) Facilidad de acceso

- El sitio **no es navegable en velocidades de conexión móvil muy bajas** (2G simulado), lo que excluye a usuarios en zonas con cobertura limitada.
- Hay **problemas de responsividad entre navegadores**: el sitio se comporta de forma diferente en Chrome, Firefox y Safari móvil.

### s) Interacción y retroalimentación

- En la barra de navegación, **la página actualmente visitada no está marcada como activa**, impidiendo al usuario saber en qué sección se encuentra.

### t) Rapidez de respuesta

- La página de inicio del sitio informativo **demora más de 3 segundos en cargar**, superando el umbral aceptable para retención de usuarios (especialmente en móvil).

---

## Sección 14 — Plataforma de postulación del SAE

**Puntaje:** 61% total (55% imprescindible, 57% esperable, 22% deseable)

### a) Usabilidad

- Los **mensajes de error informan el problema** (ej: "RUT incorrecto") pero **no ofrecen solución** ni indican al usuario qué hacer para corregirlo.
- **No existe ayuda contextual en las etapas del proceso**: el único recurso disponible es un ícono de interrogación en el perfil que redirige al usuario al sitio informativo del SAE. Esto no constituye acompañamiento en el flujo de postulación.

### b) Prevención de errores

- El **campo de ingreso de RUT no tiene validación de longitud ni de formato**: el usuario puede ingresar más caracteres de los requeridos sin recibir aviso inmediato.

### c) Accesibilidad web

- Algunos colores del diseño **no alcanzan el nivel de contraste AAA** de las WCAG (aunque superan AA): por ejemplo, el azul #2e3192 sobre fondo #c8cee tiene un ratio de 6.62:1 que pasa AA pero falla AAA.
- Las **imágenes de galería de cada colegio** en la vitrina de postulación **carecen de atributo `alt`**, haciéndolas inaccesibles para lectores de pantalla.
- La **paginación de resultados de colegios no es navegable por teclado**: al usar Tab, se saltan las páginas 2 y 3, yendo directamente de la página 1 al siguiente elemento.

### d) Interoperabilidad

- La **contraseña de apoderado debe crearse como método separado** y no se integra con ClaveÚnica, exigiendo al usuario mantener credenciales adicionales.
- El registro manual exige **RUT, fecha de nacimiento, correo y teléfono**, datos que ya están disponibles en ClaveÚnica y que podrían ser importados automáticamente, reduciendo la fricción de registro.

### e) Contenido y lenguaje claro

- Se usan siglas como **"SEP" (Subvención Escolar Preferencial) y "PIE" (Programa de Integración Escolar)** sin explicar su significado en el contexto donde aparecen, aunque a veces la sigla aparezca desglosada en otro lugar.
- Hay textos con **mayúsculas innecesarias** que dificultan la legibilidad y restan calidez al tono comunicacional.
- La **legibilidad general de los textos es mejorable**: los índices arrojan valores que van desde "algo difícil" (Fernández Huerta: 54.87) hasta "difícil" (legibilidad μ: 40.31). El índice Spaulding es 95.26 ("moderadamente difícil"), evidenciando que el lenguaje no está adaptado al nivel del público objetivo.

### f) Responsividad móvil

- Los **rótulos de los selectores de región quedan cortados en celulares**: por ejemplo, "Región Metropolitana de Santiago" aparece como "METROPOLITANA SANTI", perdiendo información relevante.
- El **número de teléfono del call center (600 600 2626)** aparece en la esquina inferior derecha como texto plano, **sin ser un enlace `tel:`** que permita llamar directamente desde el celular. Obliga al usuario a copiar y marcar manualmente.

### g) Seguridad

- La plataforma **recibe calificación F** en evaluación de cabeceras de seguridad HTTP (SecurityHeaders.com). Faltan las siguientes cabeceras: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy`.

### h) Resolutividad

- La **plataforma colapsó durante su apertura oficial** (5 de agosto de 2025, primer día del período de postulación 2026), mostrando mensajes de error inconsistentes entre sí: captchas excesivos, redirecciones erróneas y validaciones incorrectas.
- **No se explica qué ocurre si un usuario elimina su postulación**: esa información solo está disponible en la sección de Preguntas Frecuentes del sitio informativo, no en la plataforma donde ocurre la acción.
- **No se especifica el canal de seguimiento** del estado de la postulación una vez enviada.

### i) Facilidad de acceso e independencia tecnológica

- En Mozilla, Opera, Safari y Edge, las **cajas de información de establecimientos en la vitrina (vista Detalle) tienen alturas inconsistentes**, generando un diseño visualmente desequilibrado.
- En **dispositivos móviles pequeños** (Samsung de gama baja, iPhone SE), las tablas de SIMCE y de Desarrollo Personal y Social **cortan el texto a la mitad de la palabra**, haciendo incomprensible la información.
- En **dispositivos de gama baja**, la carga entre secciones puede superar **7 segundos**, inutilizando la plataforma para un segmento relevante de la población objetivo.

### j) Arquitectura de información

- El panel de filtros "Otros criterios" usa **siglas sin explicación**: "Adscritos a PIE" y "Adscritos a SEP" no son comprensibles sin conocimiento previo.
- El rótulo **"Programas" es ambiguo** y no comunica claramente qué tipo de programas incluye.
- En la portada principal se usa la expresión **"aquí" como texto de un hipervínculo**, lo que es una mala práctica de accesibilidad y usabilidad (el enlace no es descriptivo fuera de contexto).

### k) Atención a la ciudadanía

- **No existe un chat ni mecanismo de comunicación en línea** integrado en la plataforma para resolver dudas durante el proceso.
- **No hay tutoriales disponibles** dentro de la misma plataforma.

### l) Diseño e imagen institucional

- En la portada hay **enlaces que no están visualmente diferenciados** del texto circundante: no están subrayados ni tienen color distinto. Esto afecta tanto al enlace "Gobierno de Chile" en el pie de página como al enlace al sitio del SAE en la portada de registro.

### m) Tecnología

- El sitio presentó **errores del lado del servidor** en varias ocasiones durante la evaluación, notificando al usuario que "intente de nuevo" sin ser un error imputable al usuario.
- Cuando se accede con el prefijo `www` en la URL, el sitio **muestra un error de acceso** en lugar de redirigir al dominio correcto.
- El **rendimiento según PageSpeed Insights es de solo 14% en móvil y 37% en desktop**, categorías consideradas urgentes de mejorar (rojo).
- La consola del navegador detecta **328 problemas en la portada principal** (326 errores de consola), **42 errores en el registro de apoderados**, **41 en la sección Mis Postulantes** y **4 en la búsqueda de establecimientos**.

### n) Interacción y retroalimentación

- Esta es la **única dimensión con cumplimiento positivo**: la plataforma cumple con todos los criterios de chequeo de interacción y retroalimentación.

### o) Rapidez de respuesta

- La portada **demora más de 3 segundos en cargar** (Lighthouse Performance: 39/100 desktop, 37/100 móvil).
- La portada **pesa 7.7 MB**, excediendo ampliamente el límite recomendado de 2 MB.
- Las **Core Web Vitals no son superadas**: LCP 2.6s (rojo), INP 156ms (amarillo), CLS 0.296 (rojo).

### p) Audiovisualidad

- **Faltan videotutoriales** que orienten al usuario en el proceso de postulación.

### q) Enfoque de género

- Esta es una de las **dimensiones con cumplimiento positivo**: la plataforma cumple con todos los criterios de enfoque de género.

### r) Imparcialidad e igualdad de trato

- Las **regiones en el selector están desordenadas**: Arica y Parinacota y Ñuble aparecen casi al final de la lista, sin seguir un orden geográfico ni administrativo consistente, lo que puede confundir a usuarios de esas regiones.

### s) Inclusión

- En la **versión desktop, el menú desplegable del perfil de usuario se superpone a los botones** "Ver Listado" y "Ver Postulantes", bloqueando el acceso a esas funciones. En la versión móvil el comportamiento es correcto.

### t) Promoción

- **Todas las páginas de la plataforma tienen el mismo título genérico** ("Ministerio de Educación"), sin incluir el nombre específico de cada sección. Esto dificulta la identificación en pestañas del navegador y en el historial.
- Al **compartir enlaces en WhatsApp o redes sociales**, no se genera ninguna imagen de previsualización (Open Graph incompleto).
- **No existen metadescripciones personalizadas** por página.

---

*Documento generado el 2026-05-26 a partir del Informe de Evaluación de calidad web del SAE (Morales-Vargas et al., 2026).*
