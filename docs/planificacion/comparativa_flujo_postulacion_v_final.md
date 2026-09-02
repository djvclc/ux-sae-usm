# Flujo de postulación — versión (casi) final para la reunión del 2026-09-04

**Fecha:** 2026-09-01
**Propósito:** dejar el flujo de postulación del prototipo (`/postulacion` + `/perfil` + paso de resultado) en un estado presentable como **versión casi final** ante la profesora guía, con la comparación explícita contra el flujo oficial del SAE y un roadmap de lo que queda como fase 2.
**Fuentes del flujo real:** video oficial MINEDUC "Paso a paso de Sistema de Admisión Escolar 2025" (`analisis_video_paso_a_paso_sae.md`), 14 capturas de una versión anterior de la plataforma (`postulaciones2019`, aportadas 2026-09-01), informe heurístico Fondecyt N.º 1250492 (`feedback_sae_problemas.md`), `investigacion_paso_a_paso_sae.md`, `investigacion_algoritmo_sae.md`.

---

## 1. Encuadre para la reunión

El prototipo **no clona el SAE**. Es una **capa de transparencia sobre el mismo flujo de inputs**: la familia entrega los mismos datos que pide la plataforma oficial (identificación, dirección, prioridades, lista ordenada de colegios, aceptaciones), y encima el prototipo agrega lo que el SAE no da — probabilidad estimada por colegio, explicación del algoritmo antes de pedir datos, orientación estratégica honesta (strategy-proofness) y resultado explicado.

La comparación de la sección 2 es la evidencia de que el flujo de inputs es fiel; la sección 4 es lo que constituye el aporte de la memoria.

---

## 2. Inventario comparativo de inputs del usuario

Marca: ✅ presente · ➖ simplificado a propósito · ❌ no está · 🆕 agregado el 2026-09-01.

### Registro de cuenta (apoderado/a) — una vez
| Input en el flujo real | En el prototipo (`RegistroPage.jsx`) |
|---|---|
| RUN, fecha de nacimiento, N.º serie/documento de la cédula | ✅ RUN, fecha nac.; ➖ N.º serie no se pide (prototipo pedagógico, sin verificación de identidad real) |
| Correo electrónico + confirmación | ✅ |
| Teléfono móvil + confirmación | ✅ |
| Contraseña + confirmación | ✅ |
| Acepto términos y condiciones del proceso de admisión (oblig.) | 🆕 casilla obligatoria |
| Acepto protocolo de manejo de datos (oblig.) | 🆕 casilla obligatoria |
| Interés en info de establecimientos con procedimiento especial NEE (opcional) | ➖ no se pide |

### Ingreso
| RUN apoderado + contraseña | ✅ (o ClaveÚnica simulada) |
| Recuperar contraseña | ➖ enlace simbólico |

### Paso 1 — Datos del postulante
| Input en el flujo real | En el prototipo (`/postulacion` paso 1) |
|---|---|
| Barra de solo lectura: nombre, curso a postular, **establecimiento actual**, badge "ALUMNO PRIORITARIO" | ✅ nombre, nivel; ➖ establecimiento actual no se modela (no hay backend SIGE); ✅ SEP como `InfoBox` de solo lectura desde `/perfil` |
| Región * (dropdown) | 🆕 campo de residencia (antes solo era filtro de exploración) |
| Comuna * (dropdown) | 🆕 |
| Dirección (calle y número) * (texto + validación Google Maps) | 🆕 texto (sin integración Google Maps — nota de alcance) |
| Número de casa o depto. (texto, opcional) | 🆕 |
| Botón "HERMANO/A DEL POSTULANTE" → modal RUN + BUSCAR + confirma establecimiento | ➖ chip por colegio, sembrado del caso de estudio (`casoPrioridades`); sin búsqueda por RUN — ver roadmap R1 |
| Botón "PADRE/MADRE FUNCIONARIO(A)" → mismo modal | ➖ ídem |
| Exalumno/a | ➖ chip por colegio (no aparecía como botón en la versión antigua) |
| Estudiante prioritario / SEP | ✅ dato del sistema, no se declara (badge / `InfoBox`) |
| Checkbox "Declaro ser apoderado del postulante" (oblig.) | ✅ casilla A |
| Botón "COMENZAR POSTULACIÓN" | ✅ "Vincular estudiante" (bloqueado hasta marcar la casilla) |

### Paso 2 — Búsqueda y lista
| Input en el flujo real | En el prototipo (`/postulacion` paso 2 + `InicioPage`) |
|---|---|
| Región / Comuna / nombre de establecimiento (búsqueda) | ✅ (búsqueda por texto/comuna/nivel) |
| Filtros: Tipo de enseñanza · Jornada · Género · Otros criterios (SEP, PIE, copago, internado) | ➖ "PIE incluido" + "Ordenar por"; faltan género/jornada/tipo/internado — ver roadmap R3 |
| Vista: Detalle / Lista / **Mapa** | ➖ Lista + comparador; sin mapa (mobile-first, catálogo de 6) — roadmap R4 |
| Ordenar: distancia · vacantes · SIMCE · monto co-pago | ✅ ≈ SIMCE / vacantes / distancia / demanda |
| Ver ficha del colegio (proyecto educativo, infraestructura, desempeño, convivencia, vacantes referenciales, postulantes año anterior, extracurriculares, galería) | ✅ casi todo; ➖ galería de fotos reemplazada por ilustración SVG (S18) |
| Agregar establecimiento → aceptar jornada + aceptar adhesión al proyecto educativo y reglamento interno | ✅ modal C (dos casillas obligatorias) |
| Reordenar ↑↓ · Eliminar · Ver ficha | ✅ arrastrar + flechas + eliminar + ver ficha |
| ENVIAR POSTULACIÓN → aceptar → descargar comprobante | ✅ + paso de resultado inmediato (para la prueba) |
| Al modificar: reenviar y descargar el comprobante actualizado (el anterior queda obsoleto) | 🆕 aviso explícito en el paso 3 |

### Postulación familiar (si hay hermanos con colegios en común)
| Input en el flujo real | En el prototipo |
|---|---|
| Elegir OPCIÓN 1 INDEPENDIENTE / OPCIÓN 2 FAMILIAR + checkboxes por hermano, **después** de armar las listas | ➖ toggle "¿postulas a hermanos?" simplificado en el paso 1 — ver roadmap R2 |

---

## 3. Diferencias de input que importan para la UX del algoritmo

1. **Dirección (B, 🆕):** en Aceptación Diferida la distancia **no es criterio de prioridad**, solo ordena resultados. El prototipo ahora la captura (fidelidad del formulario) y lo dice explícito: *no cambia tu resultado*. Sirve para no reforzar el mito de que "el colegio cercano tiene ventaja".
2. **Prioridad verificada por RUN (roadmap R1):** el flujo real hace visible que la prioridad de hermano/funcionario está atada a **un colegio concreto verificado por el sistema**. El prototipo lo resuelve con chips pre-sembrados — suficiente para el caso de estudio, pero el modelo real es más pedagógico ("por qué tengo prioridad solo aquí").
3. **SEP / PIE / orden de prioridades:** el prototipo ya está **más actualizado** que la infografía antigua (4 prioridades sin PIE): usa el orden vigente PIE → hermanos → 15 % → funcionario → exalumno (S22-6).
4. **Establecimiento actual conocido:** el real personaliza el aviso de pérdida de cupo ("pierdes ESTE cupo"). El prototipo lo da genérico (aviso D) por no tener backend.

---

## 4. Lo que el prototipo agrega y el SAE no tiene (aporte de la memoria)

- **Probabilidad estimada por colegio** con formato de frecuencia + visual ("X de cada 100"), calibrada por nivel de prioridad real en ese colegio.
- **Encuadre del algoritmo antes de pedir datos** (qué decide y qué no; no hay puntaje ni mérito).
- **Orientación estratégica honesta:** ordena por preferencia real; poner primero el colegio que más quieres nunca perjudica (strategy-proofness), separado del riesgo real (baja probabilidad).
- **Aviso de consecuencias:** postular cuesta el cupo actual si quedas asignado.
- **Resultado explicado** en términos de la familia (por qué ese colegio y no otro).
- **Prioridad por colegio** visible y editable, no un valor global opaco.
- Lenguaje nivel 6° básico, sin siglas sin explicar, sin lenguaje antropomórfico, sin juicio a la familia.

---

## 5. Decisiones de alcance conscientes (para declarar en la reunión y en el cap. 3)

| Se simplifica | Por qué |
|---|---|
| Sin backend / SIGE: no se conoce establecimiento actual ni se verifican RUN de hermanos | Prototipo pedagógico; el foco es la capa de comunicación, no la infraestructura |
| Catálogo de 6 colegios ficticios | Suficiente para cubrir los 3 grupos de prioridad legal, ambas cuotas y el caso San Martín |
| Sin integración Google Maps para la dirección | Fuera de alcance; se captura como texto |
| Sin vista mapa de establecimientos | Mobile-first, 6 colegios |
| Postulación familiar simplificada a un toggle | El caso de estudio usa un solo estudiante a la vez |
| Registro con menos campos de verificación de identidad (sin N.º serie de cédula) | No hay validación real contra el Registro Civil |

---

## 6. Roadmap fase 2 (post-prueba de usabilidad → cap. 6 de la memoria)

| ID | Brecha | Valor | Esfuerzo |
|---|---|---|---|
| **R1** | Modelo de prioridad por búsqueda de RUN + confirmación del establecimiento (hermano/funcionario), en vez de chips pre-sembrados | Alto — hace visible por qué la prioridad es específica del colegio | Medio |
| **R2** | Pantalla real OPCIÓN 1 INDEPENDIENTE / OPCIÓN 2 FAMILIAR con checkboxes por hermano, condicionada a colegios en común | Medio — enriquece la comprensión del algoritmo para familias con varios hijos | Medio |
| **R3** | Filtros completos de búsqueda: jornada, género, tipo de enseñanza, dependencia, internado, continuidad (brecha I) | Medio — encontrabilidad (S5); varios campos ya existen en los datos | Bajo-medio |
| **R4** | Vista mapa de establecimientos | Bajo — depende de tener más colegios y geodatos | Alto |
| **R5** | Uso de la dirección para proximidad real (si se decide que aporta) | Bajo — en DA la distancia no prioriza; solo cambiaría el orden de resultados | Medio |
| **R6** | IPA como alternativa al RUN en la identificación (brecha G) | Bajo — inclusión de postulantes sin RUN | Bajo |

---

## 7. Estado (2026-09-01)

- Flujo `/postulacion` + `/perfil` + paso de resultado: coherente y validado (`npm run lint` / `npm run build` limpios).
- Fidelidad al flujo oficial: A, C, D (Bloque L de la bitácora) + B acotado + aceptaciones de registro + aviso de reenvío = **cierre de la pasada de fidelidad** para la versión de la reunión.
- Caso Muñoz González ejecutable end-to-end.
- Todo lo demás (R1–R6) documentado como fase 2, no como deuda.
