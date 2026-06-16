# CLAUDE_v2.md — Prototipo SAE Mejora UX · Versión 2
## Instrucciones para Claude Opus (modelo de mayor capacidad)

---

## 0. Punto de partida obligatorio

**Antes de escribir una sola línea de código**, leer completamente:

1. `CLAUDE.md` — instrucciones base del proyecto (contexto, persona usuaria, brechas, principios de diseño)
2. `prototipo_SAE_mejora.html` — la versión 1 ya construida (es el baseline a superar)
3. `algorithm_transparency_literature_review (1).md` — hallazgos de la revisión de literatura
4. `Informe Evaluación de calidad web SAE (1).pdf` — páginas 34–68 (resultados de la evaluación heurística)

La V2 **no reemplaza** la V1 — es un archivo nuevo, más ambicioso, que corrige sus limitaciones y agrega funcionalidades que la V1 no pudo implementar.

---

## 1. Qué mejorar de la V1 — Diagnóstico específico

### 1.1 Limitaciones técnicas a corregir

| Problema en V1 | Corrección en V2 |
|---|---|
| Solo 2 breakpoints responsive (@media 600px y 400px) | Añadir breakpoint 768px (tablet) y 1280px (desktop wide) |
| Mapa de colegio es un div de color con emoji | Reemplazar con mapa SVG interactivo dibujado a mano con marcadores de radio |
| Buscador no filtra ni devuelve resultados reales | Implementar buscador funcional que filtre un catálogo de 6 colegios ficticios en JS |
| Simulador calcula con lógica simplista (puntaje lineal) | Implementar lógica de Gale-Shapley simplificada: preferencias cruzadas con prioridades y vacantes |
| Solo 3 colegios ficticios en el simulador | Ampliar a 6 colegios con perfiles diferenciados |
| Ficha de colegio es estática (un solo colegio hardcodeado) | Hacer ficha dinámica: al seleccionar un colegio del buscador, la ficha carga sus datos |
| Preguntas frecuentes solo tienen 4 mitos | Ampliar a 7 mitos, incluyendo uno sobre el algoritmo de Gale-Shapley en lenguaje simple |
| No hay modo oscuro ni preferencia de contraste alto | Añadir toggle de alto contraste (WCAG AAA para usuarios con baja visión) |
| Las "Notas de diseño" están solo al final como sección separada | Integrar tooltips contextuales ("¿Por qué está esto aquí?") en componentes clave |
| El flujo de postulación no valida nada | Agregar validación de formulario básica con mensajes de error accesibles |
| No hay persistencia de estado | Usar sessionStorage para recordar colegios agregados al navegar entre secciones |

### 1.2 Funcionalidades nuevas que V1 no tiene

Estas son adiciones que V1 no intentó y V2 debe implementar:

- **Comparador de colegios**: seleccionar 2-3 colegios y ver tabla comparativa lado a lado (SIMCE, distancia, NEE, docentes, vacantes).
- **Calendario interactivo del proceso SAE**: línea de tiempo horizontal con las etapas del proceso (postulación, resultados, matrícula, lista de espera). La etapa actual está resaltada.
- **Calculadora de distancia aproximada**: campo donde el usuario ingresa su dirección o selecciona su comuna, y los colegios muestran distancia estimada en km.
- **Modo "Primera vez en el SAE"**: banner de bienvenida que detecta si es el primer acceso (sessionStorage) y ofrece un tour guiado de 3 pasos por la plataforma.
- **Indicador de probabilidad en tiempo real en el flujo de postulación**: mientras el usuario ordena su lista de colegios, muestra al lado de cada uno su probabilidad estimada de asignación dado su perfil.
- **Sección "Testimonios"** (datos ficticios pero representativos): 3 historias cortas de apoderados con distintos resultados, mostrando cómo el sistema los trató y qué aprendieron. Refuerza la confianza y desmonta el mito de la tómbola con narrativa.

---

## 2. Arquitectura de datos — Catálogo de colegios ficticios

V2 debe tener un objeto JavaScript central con los datos de **6 colegios ficticios** que se use en todas las secciones (buscador, simulador, ficha, comparador). Usar exactamente esta estructura:

```javascript
const COLEGIOS = {
  1: {
    nombre: "Colegio Los Andes",
    direccion: "Av. Los Andes 1240, La Florida",
    comuna: "La Florida",
    distanciaBase: 1.2, // km desde domicilio ficticio del arquetipo
    niveles: ["Prekínder", "Kínder", "1° a 6° Básico", "7° a 4° Medio"],
    vacantes: { preKinder: 12, kinder: 15, basico: 20 },
    simce: { lectura: 268, matematica: 271, ciencias: 265, historia: 258 },
    promedioComunal: { lectura: 255, matematica: 252, ciencias: 249, historia: 247 },
    docentes: { titulados: 87, total: 34 },
    jornada: "Completa",
    nee: { programa: true, psicologa: true, fono: true, rampa: true },
    seguridad: { camaras: true, porteria: true, antibullying: true, semaforo: true },
    metodos: ["Aprendizaje por proyectos", "Inglés desde prekínder", "Robótica", "Arte y música"],
    proyecto: "Formamos personas íntegras con énfasis en el desarrollo socioemocional, la convivencia respetuosa y las competencias del siglo XXI.",
    demanda: "alta",
    prioritarios: ["hermano", "cercano", "nee"],
  },
  2: {
    nombre: "Colegio San Martín",
    direccion: "Los Aromos 450, Maipú",
    comuna: "Maipú",
    distanciaBase: 3.5,
    niveles: ["Prekínder", "Kínder", "1° a 8° Básico"],
    vacantes: { preKinder: 24, kinder: 24, basico: 30 },
    simce: { lectura: 252, matematica: 248, ciencias: 244, historia: 241 },
    promedioComunal: { lectura: 250, matematica: 247, ciencias: 243, historia: 240 },
    docentes: { titulados: 92, total: 28 },
    jornada: "Completa",
    nee: { programa: false, psicologa: true, fono: false, rampa: true },
    seguridad: { camaras: true, porteria: false, antibullying: true, semaforo: false },
    metodos: ["Metodología tradicional con innovación", "Talleres de teatro", "Deporte"],
    proyecto: "Comprometidos con la excelencia académica y el desarrollo valórico, formamos ciudadanos responsables con sólidas bases en lenguaje y matemática.",
    demanda: "media",
    prioritarios: ["hermano", "vulnerabilidad"],
  },
  3: {
    nombre: "Escuela República de Chile",
    direccion: "Calle 5 de Abril 890, La Florida",
    comuna: "La Florida",
    distanciaBase: 0.8,
    niveles: ["Prekínder", "Kínder", "1° a 6° Básico"],
    vacantes: { preKinder: 40, kinder: 35, basico: 45 },
    simce: { lectura: 241, matematica: 239, ciencias: 235, historia: 238 },
    promedioComunal: { lectura: 255, matematica: 252, ciencias: 249, historia: 247 },
    docentes: { titulados: 78, total: 22 },
    jornada: "Parcial (hasta las 14:00)",
    nee: { programa: true, psicologa: false, fono: true, rampa: true },
    seguridad: { camaras: false, porteria: true, antibullying: true, semaforo: true },
    metodos: ["Lectura intensiva", "Matemática concreta", "Huerto escolar"],
    proyecto: "Escuela pública comprometida con la comunidad, con énfasis en la lectura, la naturaleza y los valores ciudadanos.",
    demanda: "baja",
    prioritarios: ["hermano", "cercano", "nee", "vulnerabilidad"],
  },
  4: {
    nombre: "Liceo Técnico Simón Bolívar",
    direccion: "Av. Bolívar 2100, Puente Alto",
    comuna: "Puente Alto",
    distanciaBase: 5.1,
    niveles: ["7° Básico", "8° Básico", "1° a 4° Medio (Técnico-Profesional)"],
    vacantes: { basico: 35, medio: 40 },
    simce: { lectura: 260, matematica: 255, ciencias: 258, historia: 252 },
    promedioComunal: { lectura: 253, matematica: 250, ciencias: 248, historia: 246 },
    docentes: { titulados: 95, total: 41 },
    jornada: "Completa",
    nee: { programa: true, psicologa: true, fono: false, rampa: true },
    seguridad: { camaras: true, porteria: true, antibullying: true, semaforo: false },
    metodos: ["Formación técnica en gastronomía", "Formación técnica en electricidad", "Talleres de emprendimiento"],
    proyecto: "Preparamos a jóvenes para el mundo laboral y la educación superior con especialidades técnicas de alta demanda y sólida formación general.",
    demanda: "media",
    prioritarios: ["hermano", "cercano"],
  },
  5: {
    nombre: "Colegio Villa del Sol",
    direccion: "Pasaje Las Palmas 330, Peñalolén",
    comuna: "Peñalolén",
    distanciaBase: 2.3,
    niveles: ["Prekínder", "Kínder", "1° a 4° Medio"],
    vacantes: { preKinder: 18, kinder: 18, basico: 25, medio: 30 },
    simce: { lectura: 274, matematica: 278, ciencias: 270, historia: 265 },
    promedioComunal: { lectura: 260, matematica: 258, ciencias: 255, historia: 252 },
    docentes: { titulados: 100, total: 48 },
    jornada: "Completa",
    nee: { programa: true, psicologa: true, fono: true, rampa: true },
    seguridad: { camaras: true, porteria: true, antibullying: true, semaforo: true },
    metodos: ["Bilingüe español-inglés", "Aprendizaje basado en proyectos", "Educación emocional", "Tecnología e innovación"],
    proyecto: "Comunidad educativa bilingüe y diversa que desarrolla el pensamiento crítico, la creatividad y la conciencia global en un ambiente inclusivo de excelencia.",
    demanda: "alta",
    prioritarios: ["hermano", "vulnerabilidad", "nee"],
  },
  6: {
    nombre: "Escuela Básica Los Quillayes",
    direccion: "Los Quillayes 1550, La Florida",
    comuna: "La Florida",
    distanciaBase: 1.8,
    niveles: ["Prekínder", "Kínder", "1° a 8° Básico"],
    vacantes: { preKinder: 30, kinder: 28, basico: 35 },
    simce: { lectura: 249, matematica: 245, ciencias: 242, historia: 244 },
    promedioComunal: { lectura: 255, matematica: 252, ciencias: 249, historia: 247 },
    docentes: { titulados: 83, total: 26 },
    jornada: "Completa",
    nee: { programa: true, psicologa: true, fono: true, rampa: false },
    seguridad: { camaras: true, porteria: false, antibullying: true, semaforo: false },
    metodos: ["Educación ambiental", "Talleres de música", "Apoyo diferenciado en aula"],
    proyecto: "Escuela comunitaria con fuerte vínculo con las familias y el barrio, que apuesta por la educación ambiental y el aprendizaje colaborativo.",
    demanda: "media",
    prioritarios: ["hermano", "cercano", "nee", "vulnerabilidad"],
  }
};
```

---

## 3. Lógica del simulador V2 — Gale-Shapley simplificado

El simulador V1 usaba puntaje simple. V2 debe implementar una versión pedagógica del algoritmo real:

```
ALGORITMO SIMPLIFICADO (explicado en comentarios del código):

1. El usuario tiene un PERFIL: { hermano: bool, cercano: bool, nee: bool, vulnerabilidad: bool }
2. Cada colegio tiene PRIORIDADES ordenadas (array de criterios).
3. Para cada colegio en la lista del usuario (en orden de preferencia):
   a. Calcular el "nivel de prioridad" del usuario en ese colegio:
      - Nivel 1 (máximo): hermano matriculado
      - Nivel 2: vulnerabilidad socioeconómica certificada
      - Nivel 3: cercanía al domicilio (< 2km)
      - Nivel 4: NEE en colegio con programa
      - Nivel 5: ninguna prioridad especial (sorteo)
   b. Calcular probabilidad base según demanda:
      - Alta demanda + nivel 5: 30%
      - Alta demanda + nivel 3-4: 60%
      - Alta demanda + nivel 1-2: 90%
      - Media demanda + nivel 5: 60%
      - Media demanda + nivel 3-4: 75%
      - Media demanda + nivel 1-2: 95%
      - Baja demanda (cualquier nivel): 95-99%
4. El "resultado simulado" muestra el primer colegio donde la probabilidad supera el 65%.
5. Si ninguno supera 65%, muestra el de mayor probabilidad con advertencia.
6. El resultado SIEMPRE explica el razonamiento en lenguaje natural.
```

La función debe retornar un objeto con:
```javascript
{
  colegioAsignado: { id, nombre, prob },
  razonamiento: "string explicativo en español simple",
  prioridadAplicada: "string con la prioridad que aplicó",
  advertencia: "string | null" // si prob < 65%
}
```

---

## 4. Nuevas secciones requeridas en V2

### Sección F — Comparador de colegios

- Interfaz con checkboxes para seleccionar 2 o 3 colegios del catálogo.
- Tabla comparativa generada dinámicamente en JavaScript con las siguientes filas:
  - Distancia estimada
  - Vacantes disponibles (nivel seleccionado)
  - SIMCE promedio vs. promedio comunal (con indicador visual ↑ o ↓)
  - % docentes titulados (barra de progreso visual)
  - Programa NEE (✅/❌)
  - Jornada
  - Demanda (badge de color)
- Botón "Agregar a mi postulación" por columna.
- En móvil (< 600px): la tabla se convierte en tarjetas apiladas (una por colegio).

### Sección G — Calendario del proceso SAE

- Línea de tiempo horizontal con 6 hitos:
  1. 🗓️ Inscripción (julio) 
  2. 📝 Postulación (agosto)  ← etapa actual (resaltar)
  3. ⚙️ Procesamiento del algoritmo (septiembre)
  4. 📬 Resultados (octubre)
  5. ✅ Aceptación y matrícula (noviembre)
  6. 📋 Lista de espera (noviembre-diciembre)
- En cada hito: fecha, descripción de 1 línea, ícono.
- La etapa actual tiene un indicador pulsante animado (CSS puro, sin JS).
- En móvil: la línea de tiempo se convierte en lista vertical.
- Al hacer clic en una etapa futura, se muestra un tooltip con qué hacer ahora para prepararse.

### Sección H — Testimonios

Tres historias ficticias pero representativas del arquetipo del estudio. Mostrar como tarjetas con foto generada con CSS (avatar con iniciales):

```
Testimonio 1 — María, 34 años, Pudahuel:
"Yo pensé que el SAE era una lotería. Mi hijo mayor había quedado en el primero que puse, 
así que no entendía bien cómo funcionaba. Con el segundo hijo usé esta explicación y entendí 
que como vivo a 3 cuadras del colegio, tengo prioridad. Quedé en el primero de nuevo. 
Ya no le tengo miedo al proceso."
Resultado: ✅ 1ª preferencia asignada · Motivo: cercanía al domicilio

Testimonio 2 — Roberto, 41 años, La Florida:
"No quedamos en el primero. Fue frustrante al principio. Pero el sistema nos explicó por qué: 
ese colegio tenía más postulantes con hermanos que nosotros. Quedamos en el segundo que 
pusimos, que también era bueno. Ahora sé que hay que poner más opciones."
Resultado: ✅ 2ª preferencia asignada · Motivo: sin prioridad especial en 1ª opción

Testimonio 3 — Ana, 38 años, Maipú:
"Mi hijo tiene TEA. Filtré los colegios por programa PIE y puse tres que sí tenían. 
Quedé en el primero. El sistema sí considera las NEE. Antes no sabía eso."
Resultado: ✅ 1ª preferencia asignada · Motivo: prioridad NEE + programa PIE disponible
```

---

## 5. Mejoras de accesibilidad requeridas (sobre V1)

V1 tenía 0 imágenes reales (sin `alt=` que fueran necesarios), pero V2 debe mejorar:

- **Modo alto contraste**: toggle en la barra de navegación que aplique una clase `high-contrast` al `<body>`. En ese modo: fondo negro, texto blanco, todos los colores de acento en amarillo (#FFD700). Persistir preferencia en sessionStorage.
- **Skip link**: al inicio del `<body>`, un `<a href="#contenido-principal">` que solo aparece al recibir foco. Permite a usuarios de teclado saltarse la navegación.
- **Landmarks ARIA completos**: `<header>`, `<main>`, `<nav>`, `<footer>` con roles y labels explícitos.
- **Estados de carga**: cuando el simulador calcula, mostrar un `aria-live="assertive"` spinner de texto (no visual) que diga "Calculando tu resultado..." antes de mostrar el resultado.
- **Validación de formulario accesible**: en el paso 2 de postulación, si el usuario intenta avanzar sin agregar colegios, mostrar un mensaje de error con `role="alert"` vinculado al campo con `aria-describedby`.
- **Focus management**: al cambiar de página/sección, mover el foco al `<h1>` de la nueva sección con `focus()` programático.

---

## 6. Mejoras de diseño visual requeridas (sobre V1)

### Animaciones y transiciones (CSS puro, sin librerías)

- Transición `fade-in` al cambiar entre secciones (opacity 0→1 en 200ms).
- Barras de progreso del simulador animadas con `@keyframes` (llenan de izquierda a derecha al aparecer).
- Etapa actual del calendario con pulso CSS (`@keyframes pulse`).
- Botón de ClaveÚnica con efecto shimmer sutil en hover.

### Componentes visuales nuevos

- **Badge de vacantes urgente**: si un colegio tiene menos de 5 vacantes, mostrar badge rojo pulsante "¡Quedan X vacantes!".
- **Chip de distancia personalizado**: en la lista de resultados del buscador, mostrar "📍 X km de tu casa" calculado en base a la comuna seleccionada.
- **Gráfico radar** (Chart.js) en la ficha de colegio que muestre en un pentágono: SIMCE, NEE, Seguridad, Docentes, Proximidad — para comparación visual rápida.
- **Progress ring** (SVG inline) para el porcentaje de docentes titulados, en lugar del número plano de V1.

---

## 7. Refactorización de código requerida

V2 debe tener código más limpio y mantenible:

- **Separar datos de presentación**: todos los textos de la UI deben venir del objeto `TEXTOS` (en JS), no hardcodeados en HTML. Esto facilita futuras traducciones.
- **Componentes reutilizables en JS**: funciones `renderTarjetaColegio(id)`, `renderFicha(id)`, `renderComparacion(ids[])` que generen HTML dinámicamente.
- **Un solo estado global**: objeto `ESTADO = { pagina, colegiosAgregados[], perfilUsuario{}, primeraVez }` que centralice el estado de la aplicación.
- **Comentarios de código**: cada función debe tener un comentario de 1 línea explicando qué hace y qué principio de investigación la respalda.
- **CSS custom properties para espaciado**: agregar variables `--esp-xs: 4px`, `--esp-sm: 8px`, `--esp-md: 16px`, `--esp-lg: 24px`, `--esp-xl: 40px` para consistencia.

---

## 8. Archivo de salida

Guardar el prototipo V2 como:

```
C:\Users\dvill\OneDrive\Documentos\Claude\Projects\USM\prototipo_SAE_v2.html
```

El V1 (`prototipo_SAE_mejora.html`) debe quedar intacto — no modificarlo.

---

## 9. Estructura de secciones en V2

La navegación principal debe tener estos ítems (en este orden):

| ID sección | Etiqueta en navbar | Descripción |
|---|---|---|
| inicio | Inicio | Buscador funcional + accesos rápidos + banner NEE |
| algoritmo | ¿Cómo funciona? | 4 pasos + simulador Gale-Shapley + 7 mitos |
| calendario | El proceso | Línea de tiempo interactiva del proceso SAE |
| colegio | Ver colegio | Ficha dinámica + gráfico radar + botón comparar |
| comparador | Comparar | Tabla comparativa 2-3 colegios |
| postulacion | Postula | Flujo 3 pasos con validación + indicador probabilidad en tiempo real |
| seguimiento | Mi postulación | Panel de estado + testimonios |

---

## 10. Métricas de éxito V2 (más ambiciosas que V1)

| Dimensión SAE | V1 logró | V2 debe lograr |
|---|---|---|
| Transparencia del algoritmo | Módulo de 4 pasos + simulador básico | Simulador Gale-Shapley + tooltips contextuales + testimonios |
| Búsqueda y encontrabilidad | Buscador estático (sin filtrado real) | Buscador funcional con filtros en tiempo real + comparador |
| Inclusión | Lenguaje claro + sección NEE | + Modo alto contraste + skip links + focus management |
| Interacción y retroalimentación | Confirmaciones básicas | + Validación de formulario + probabilidad en tiempo real |
| Audiovisualidad | Gráfico SIMCE de barras | + Gráfico radar + progress ring + línea de tiempo visual |
| Responsividad móvil | 2 breakpoints | 4 breakpoints + tabla comparativa adaptable |
| Confianza y desmitificación | 4 preguntas frecuentes | 7 mitos + 3 testimonios con resultado real |

---

## 11. Checklist de entrega para V2

Antes de guardar el archivo final, verificar:

- [ ] Todos los 6 colegios del catálogo aparecen correctamente en buscador, simulador y comparador
- [ ] El simulador retorna resultados coherentes para todas las combinaciones de condiciones
- [ ] El calendario tiene las 6 etapas y la etapa "Postulación" resaltada
- [ ] El comparador funciona con 2 y con 3 colegios simultáneos
- [ ] El modo alto contraste es togglable y persiste en sessionStorage
- [ ] El flujo de postulación valida que haya al menos 1 colegio antes de avanzar al paso 3
- [ ] Los testimonios muestran el avatar con iniciales generado en CSS
- [ ] El gráfico radar de la ficha se renderiza correctamente con Chart.js
- [ ] El skip link aparece al recibir foco y lleva al contenido principal
- [ ] El foco se mueve al `<h1>` al cambiar de sección
- [ ] El archivo abre sin errores en Chrome sin servidor local
- [ ] El archivo abre correctamente en Chrome móvil (viewport 375px)
- [ ] Las notas de diseño al final referencian V2 con los principios aplicados

---

## 12. Nota sobre el modelo

Estas instrucciones están escritas para **Claude Opus**, el modelo de mayor capacidad. Se espera que:

- El código JavaScript sea más robusto y esté mejor estructurado que en V1.
- El CSS sea más consistente y use las custom properties correctamente.
- El HTML semántico sea impecable (landmarks, roles, jerarquía de headings).
- Los textos de la interfaz en español sean más naturales y mejor calibrados para el arquetipo "Daniela González" (35 años, educación media, acceso principalmente móvil).
- Cada decisión de diseño esté comentada en el código con su fundamento de investigación.
