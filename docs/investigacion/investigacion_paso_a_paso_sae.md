# Investigación: El "Paso a paso" del proceso SAE (sitio informativo oficial)

**Fecha:** 2026-08-04
**Método:** Recorrido de las cinco páginas del menú "Paso a paso" del sitio informativo oficial (sistemadeadmisionescolar.cl, versión 2.4.61, proceso Admisión 2027), complementado con el calendario oficial 2027 publicado en prensa (el sitio oficial lo presenta solo como imagen, sin texto accesible).
**Propósito:** Documentar el recorrido completo del apoderado por las cinco etapas del proceso (Postulación → Asignación → Resultados → Periodo Complementario → Matrícula) para implementarlo en el prototipo (`sae-react/`). Cubre la brecha detectada: `investigacion_algoritmo_sae.md` describe las rondas a nivel técnico (§3.4) y `investigacion_vitrina_sae.md` solo la exploración de colegios, pero ninguno documenta el viaje del usuario etapa por etapa.

---

## 1. Estructura oficial del proceso

El sitio informativo organiza el proceso en un menú "Paso a paso" de cinco etapas secuenciales, cada una con página propia:

| # | Etapa | Página oficial | Qué hace el apoderado |
|---|---|---|---|
| 1 | Postulación | `/postulacion.html` | Crea cuenta, registra al estudiante, arma y ordena su lista, envía y descarga comprobante |
| 2 | Asignación | `/asignacion.html` | Nada: espera mientras el algoritmo asigna (etapa interna del sistema) |
| 3 | Resultados | `/informacion_de_resultados.html` | Revisa el resultado y decide: aceptar / aceptar + lista de espera / rechazar |
| 4 | Periodo Complementario | `/periodo_complementario.html` | Solo si quedó sin colegio: segunda postulación con vacantes remanentes |
| 5 | Matrícula | `/matricula.html` | Concurre presencialmente al colegio asignado a matricular |

## 2. Contenido de cada etapa

### 2.1 Postulación (Periodo Principal)

- Flujo declarado: registrarse como apoderado → completar datos del estudiante → buscar establecimientos con filtros → agregarlos al listado → **ordenarlos de mayor a menor preferencia** → enviar → **descargar comprobante** ("la postulación será válida solo cuando completes este paso").
- El sistema "siempre intentará asignar al estudiante en la opción más alta posible"; si queda en una opción, se descartan automáticamente las que estaban más abajo.
- Advertencia oficial: datos erróneos (especialmente el **curso al que postula**) pueden afectar el resultado.
- Recomendación oficial: **incluir al menos 6 establecimientos** si el estudiante no tiene colegio asegurado; no hay límite de postulaciones y se puede postular entre comunas y regiones.
- La exploración se apoya en la Vitrina de Establecimientos (ver `investigacion_vitrina_sae.md`).
- Canales de ayuda: presenciales (Seremi, Deprov, oficinas Ayuda Mineduc) y remotos (600 600 26 26, ayudamineduc.cl, RRSS).

### 2.2 Asignación

Explicación oficial simplificada (versión divulgativa del algoritmo DA documentado en `investigacion_algoritmo_sae.md` §3):

1. Si la 1.ª preferencia tiene vacantes suficientes, el estudiante queda ahí.
2. Si no alcanzan, se aplican los criterios de prioridad y el **desempate es aleatorio**.
3. Si no queda en la 1.ª, el sistema intenta la 2.ª, luego la 3.ª, y así sucesivamente.
4. Si no queda en ninguna preferencia, **conserva su colegio de origen**.
5. Si no queda en ninguna y no tiene continuidad en su colegio de origen, entra **automáticamente a listas de espera** (vigentes solo hasta la publicación de sus resultados; sin relación con "Anótate en la Lista").

Criterios de prioridad publicados (en este orden): hermano matriculado; 15 % de estudiantes prioritarios; hijo de funcionario; exalumno no expulsado.

> Nota de consistencia: la página oficial titula "cuatro criterios de prioridad" mezclando las tres prioridades legales con la cuota del 15 % (que técnicamente es una reserva de asientos, cf. `investigacion_algoritmo_sae.md` §3.2). Para el prototipo conviene la formulación técnica correcta, manteniendo el lenguaje simple.

### 2.3 Resultados (del Periodo Principal)

El apoderado ingresa con usuario y contraseña y tiene **tres opciones**:

1. **Aceptar** el resultado.
2. **Aceptar y activar listas de espera**: solo disponible si el estudiante no quedó en su 1.ª opción; solo permite optar a colegios que estaban **por encima** del asignado, nunca por debajo.
3. **Rechazar**: advertencia oficial destacada — el estudiante queda sin establecimiento y debe postular en el Periodo Complementario; además, al haber sido asignado a un colegio nuevo, **ya se liberó el cupo del colegio de origen** (pierde la matrícula asegurada).

Reglas adicionales:

- **Aceptado por omisión:** si el apoderado no ingresa durante la etapa, la plataforma considera el resultado **aceptado por defecto** (para asegurar continuidad educativa).
- Se puede cambiar la respuesta cuantas veces se quiera dentro del periodo; vale la última guardada.
- **Listas de espera, dos casos:** (a) quien aceptó y activó la lista mantiene su cupo asegurado y puede ser **reasignado automáticamente** si se libera una vacante en una preferencia superior; (b) quien quedó en lista de espera automática (sin asignación y sin colegio de origen con continuidad) puede recibir una vacante liberada, y en ese caso sí puede aceptarla o rechazarla.
- Advertencia oficial: **no contactar al colegio asignado antes del periodo de matrícula** (los establecimientos reciben la información recién en diciembre).

### 2.4 Periodo Complementario

- **Segunda etapa de postulación**, dirigida a quienes: no postularon en el Periodo Principal, rechazaron su asignación, o no fueron admitidos en ningún establecimiento.
- Solo se puede postular a establecimientos **con vacantes disponibles** (oferta reducida). Se mantiene la recomendación de listar al menos 6.
- **El resultado es final e informativo:** no se acepta ni rechaza en plataforma y **no hay listas de espera**.
- **Asignado por cercanía:** al estudiante sin colegio de origen que no quedó en ninguna preferencia, Mineduc le otorga una vacante en un establecimiento **gratuito, sin categoría Insuficiente y a menos de 17 km** de su domicilio. La matrícula en él es voluntaria.

Tabla oficial de diferencias con el Periodo Principal:

| Aspecto | Periodo Principal | Periodo Complementario |
|---|---|---|
| Participantes | Todos los estudiantes nuevos o que desean cambiarse | Solo quienes quedaron sin colegio o rechazaron su asignación |
| Oferta | Todos los establecimientos del SAE | Solo establecimientos con vacantes |
| Resultado | Asignación principal + opción de listas de espera | Asignación final, sin aceptar/rechazar y sin listas de espera |

### 2.5 Matrícula

- **Única etapa presencial:** se realiza en el establecimiento asignado, en fechas del calendario oficial (diciembre). **Si el apoderado no se presenta en el plazo, pierde el cupo.**
- Documentación exigible (solo identidad): del estudiante — cédula, RUN de enrolamiento, certificado de nacimiento o IPE; del apoderado — cédula, RUN de enrolamiento o IPA; terceros — poder simple firmado más cédula de quien tramita.
- Los colegios pueden pedir documentación complementaria para sus registros, pero **no pueden negar la matrícula** por no tenerla en el momento.
- El proceso se acompaña de notificaciones por correo, SMS y redes sociales.

## 3. Calendario oficial Admisión 2027 (verificado 2026-08-04)

| Hito | Fechas |
|---|---|
| Registro anticipado de apoderados | desde el 15 de julio de 2026 |
| Postulación — Periodo Principal | 4 de agosto (9:00) – 27 de agosto (14:00) de 2026 |
| Resultados del Periodo Principal | 15 – 21 de octubre de 2026 |
| Resultados de listas de espera | 28 – 29 de octubre de 2026 |
| Postulación — Periodo Complementario | 10 – 17 de noviembre de 2026 |
| Resultados del Periodo Complementario | 1 de diciembre de 2026 |
| Matrícula presencial | 9 – 22 de diciembre de 2026 (hasta el 29 en Aysén y Magallanes) |

> El sitio oficial publica este calendario **solo como imagen** (`fechas.png`), sin alternativa textual — hallazgo de accesibilidad consistente con las fallas del informe heurístico (imágenes sin `alt`). Las fechas se verificaron con prensa (El Dínamo, 2026-07-28) y coinciden con la ventana de matrícula citada en la página oficial de Resultados.

## 4. Hallazgos UX del sitio informativo oficial

1. **La secuencia de 5 etapas es un buen modelo mental**, pero está fragmentada en páginas aisladas: no hay línea de tiempo visual, ni indicador de "en qué etapa estamos hoy", ni conexión con el estado real de la postulación del usuario (el sitio informativo y la plataforma de postulación son mundos separados).
2. **El calendario es una imagen sin texto:** inaccesible para lectores de pantalla y no indexable; el usuario debe cruzar manualmente etapas y fechas.
3. **Reglas críticas enterradas en párrafos:** "aceptado por omisión", "rechazar te deja sin colegio y sin tu cupo de origen", "solo optas a preferencias superiores en lista de espera" y "si no te matriculas pierdes el cupo" son las decisiones de mayor consecuencia del proceso y aparecen como texto corrido con negritas, sin jerarquía visual ni simulación de consecuencias.
4. **La Asignación es una caja negra narrada en 5 viñetas:** correcta pero sin visualización del mecanismo ni vínculo con las probabilidades reales (vacantes vs. postulantes) que la vitrina sí publica.
5. **Inconsistencia terminológica oficial:** "cuatro criterios de prioridad" (mezcla prioridades y cuota del 15 %); nombres de etapa distintos entre menú ("Resultados") y título de página ("Información de resultados").
6. **Erratas y descuidos visibles** en la página oficial de Postulación (párrafo duplicado truncado, "Preguntas fecuentes" en el menú), señal de bajo control de calidad editorial.

## 5. Recomendaciones de implementación para el prototipo

La brecha central que el prototipo puede cerrar: **convertir las 5 etapas en una línea de tiempo viva, conectada al estado de la postulación del usuario y a la explicación del algoritmo.** Propuesta:

1. **Nueva vista "Paso a paso" (p. ej. `/proceso`)** con las 5 etapas como línea de tiempo vertical mobile-first: cada etapa con nombre, fechas 2027, qué hace el apoderado y qué hace el sistema, y estado (completada / activa / futura) calculado según la fecha. Aplica divulgación progresiva: resumen de una línea por etapa, expandible al detalle.
2. **Integrar el estado real del usuario:** en `SeguimientoPage` ya existe seguimiento de la postulación; la línea de tiempo debe enlazar "tu postulación está en la etapa X" en lugar de ser solo informativa (supera el divorcio sitio informativo ↔ plataforma del original).
3. **Destacar las reglas de alto riesgo como avisos visuales** (patrón de gestión de expectativas ya usado en el prototipo): aceptado por omisión; consecuencias de rechazar; lista de espera solo hacia preferencias superiores; pérdida de cupo por no matricularse; no contactar al colegio antes de diciembre.
4. **Enlazar la etapa "Asignación" con `/algoritmo`:** la narración oficial de 5 viñetas es la versión simple; nuestro simulador es la capa profunda. Usar la formulación técnica correcta de prioridades y cuotas (§2.2, nota de consistencia).
5. **Calendario como tabla HTML accesible** (§3), nunca como imagen: corrige el hallazgo de accesibilidad del original y permite recordatorios contextuales ("la matrícula parte el 9 de diciembre").
6. **Explicar el Periodo Complementario y la asignación por cercanía** en la etapa 4: es la red de seguridad del sistema y hoy es casi desconocida; la tabla de diferencias Principal vs. Complementario (§2.4) es directamente reutilizable en lenguaje claro.
7. **Checklist de matrícula** en la etapa 5 con los documentos exigibles y el aviso "no pueden negarte la matrícula por documentación complementaria".

Trazabilidad sugerida: al implementarse, asociar los cambios a la matriz del plan de mejora con un código nuevo o el que corresponda de `plan_mejora_sae.md` (validar sección con el usuario antes de codificar).

## 6. Fuentes

**Páginas oficiales del menú "Paso a paso" (sistemadeadmisionescolar.cl, v2.4.61, consultadas 2026-08-04):**

- [Paso a paso para postular](https://www.sistemadeadmisionescolar.cl/paso_a_paso_para_postular.html)
- [Postulación](https://www.sistemadeadmisionescolar.cl/postulacion.html)
- [Asignación](https://www.sistemadeadmisionescolar.cl/asignacion.html)
- [Resultados](https://www.sistemadeadmisionescolar.cl/informacion_de_resultados.html)
- [Periodo Complementario](https://www.sistemadeadmisionescolar.cl/periodo_complementario.html)
- [Matrícula](https://www.sistemadeadmisionescolar.cl/matricula.html)
- [Fechas del proceso](https://www.sistemadeadmisionescolar.cl/fechas_del_proceso.html) (calendario solo como imagen)

**Calendario 2027 (verificación de fechas):**

- [Admisión SAE 2027: fechas clave — El Dínamo, 2026-07-28](https://www.eldinamo.cl/pais/2026/07/28/admision-sae-2027-estas-son-las-fechas-claves-del-proceso-de-postulacion-a-colegios/)

**Documentos internos relacionados:**

- `investigacion_algoritmo_sae.md` — detalle técnico del algoritmo y las rondas (§3).
- `investigacion_vitrina_sae.md` — exploración de colegios que alimenta la etapa de Postulación.

---

## 7. Estado de implementación

**Implementado el 2026-08-04 (S21):** `ProcesoPage.jsx` — ruta `/proceso`. Línea de tiempo de 5 etapas, estado calculado por fecha, divulgación progresiva (expandir/colapsar por etapa), 5 reglas de alto riesgo como avisos siempre visibles, tabla comparativa Principal vs. Complementario (§2.4), checklist de documentos de matrícula (§2.5), calendario 2027 como tabla HTML accesible (§3). Enlace en Navbar (`El proceso`) y nuevo paso en tour guiado. Build limpio.
