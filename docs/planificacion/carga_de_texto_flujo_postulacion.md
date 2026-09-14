# Carga de texto del flujo de postulación — diagnóstico y opciones

**Fecha:** 2026-09-10 (diagnóstico) · **actualizado 2026-09-13** con la evaluación de la sec. 6.
**Estado:** la profesora guía **confirmó el diagnóstico el 2026-09-13** y dio dos instrucciones explícitas: reducir el texto de la página y subir el tamaño de fuente. La sec. 6 evalúa las opciones de este documento (y agrega la del tamaño de fuente, que no estaba acá) a la luz de eso. **Sigue sin haber cambios de código de esta evaluación** — es insumo para priorizar la siguiente sesión de implementación; sí hay cambios de código de días anteriores (bloques Y/Z, ver sec. 6.1) que ya avanzan parte de esto sin haber sido diseñados explícitamente para ello.
**Motivo:** en Chile la comprensión lectora es frágil (PISA 2022 lectura ≈ 448; ~1 de cada 3 estudiantes de 15 años bajo el nivel 2. PIAAC / alfabetización adulta: cerca de la mitad de los adultos en el nivel más bajo — *verificar las cifras exactas y su fuente antes de citarlas en la memoria*). La persona objetivo (Daniela, alfabetización digital básica-intermedia, nivel 6.º básico) es exactamente ese perfil. Ver también `docs/investigacion/feedback_sae_problemas.md` (evaluación heurística del SAE real): índice Spaulding 95.26–120.43 ("moderadamente difícil" a "difícil") y "no hay controles de tamaño de fuente" como hallazgo (m, línea 94) — ambos hallazgos son la base independiente que ya fundamentaba este trabajo antes del feedback de hoy.

---

## 1. Medición (palabras visibles por pantalla, sin nav ni footer, condición A, modo tutorial ON)

| Pantalla | Palabras | InfoBoxes | Párrafos ≥ 30 palabras |
|---|---:|---:|---:|
| `/inicio` | ~444 | 0 | 1 |
| `/postulacion` paso 1 (tras login) | ~360 | 3 | 3 |
| `/postulacion` paso 2, lista vacía | ~520 | 6 | 6 |
| **`/postulacion` paso 2, con los 6 colegios** | **~1 080** | 8 | 6 |
| **`/postulacion` paso 3, antes de confirmar** | ~830 | 6 | 6 |
| `/postulacion` paso 3, tras confirmar | ~1 000 | 10 | 6 |
| `/seguimiento` (resultado) | ~480 | 0 (5 párrafos de 30–54 pal.) | 5 |
| `/algoritmo` | ~1 000 | — | 15 |
| `/colegio` (ficha) | ~300 | 3 | 1 |

Referencia: un adulto con lectura frágil lee ~100–150 palabras/min con comprensión. El paso 2 con la lista armada son **7–10 min de lectura pura**, encima de la tarea.

## 2. Dónde se concentra la carga (ubicaciones)

1. **InfoBox "Antes de empezar: cómo se decide tu resultado"** (`PostulacionPage.jsx:1177`, siempre visible). Primer párrafo = **una oración de 65 palabras** con un paréntesis anidado que enumera 5 categorías de prioridad. Para nivel 6.º básico se recomienda ~12–15 palabras por oración → 4–5×.
2. **Paso 2 apila 6–8 InfoBoxes** antes de que la persona toque nada: perder el cupo actual (47 pal.), orden de prioridades (32 + 34 pal.), "el 15 % no es un lugar en la fila", consejo de strategy-proofness, aviso de lista corta. Varias repiten la misma idea con otras palabras.
3. **`ResultadoProvisional`** (paso 3): ~160 palabras en 3 párrafos (60 + 45 + 54).
4. **`/seguimiento`**: la tarjeta "¿Por qué te asignaron este colegio?" son 3 párrafos seguidos de 51 + 54 + 41 palabras, más "¿Qué significa no quedar…?" con 37 + 32.
5. **El toggle "Tutorial ON/OFF" ayuda poco donde más pesa**: en paso 1 solo quita ~28 palabras. Las InfoBoxes grandes de paso 1–2 (`:1177` "cómo se decide", `:1792` "postula solo si necesitas cambiar", `:2094` "Consejo") **no están gateadas** por el toggle. El toggle sí aligera el paso 3. El estudio corre con tutorial ON por defecto.

## 3. Lo que ya está bien resuelto (no tocar)

- `/proceso` usa **divulgación progresiva** real: 5 etapas colapsadas (553 palabras a la vista).
- Prioridades en paso 2 movidas a **modal con botón "?"** (`PrioridadModal`).
- Siglas con `<abbr title>`; formato "X de cada 100" además del %.
- Ficha de colegio sobria (datos, no párrafos).

## 4. Opciones para conversar con la profe (ninguna implementada)

| # | Opción | Alcance | Riesgo |
|---|---|---|---|
| 1 | **Consolidar InfoBoxes del paso 2** de 6–8 a 2–3, eliminando las redundantes | Medio | Bajo — no se pierde contenido, se fusiona |
| 2 | **Partir la oración de 65 palabras** de "cómo se decide" en 3–4 oraciones cortas; la lista de prioridades a viñetas | Bajo | Muy bajo |
| 3 | **Divulgación progresiva en paso 2** (la explicación del orden de prioridades detrás de un desplegable "¿Cómo funciona?", como en `/proceso`) | Medio | Bajo |
| 4 | **Gatear las InfoBoxes grandes de paso 1–2 con el toggle** que ya existe (hoy solo gatea paso 3) | Bajo | Medio — decidir qué es "esencial siempre" vs "tutorial" |
| 5 | **Presupuesto de palabras por pantalla** como criterio de diseño (p. ej. ≤ 400 visibles en el flujo) y auditar contra él | Bajo (proceso) | Ninguno |
| 6 | Para el estudio: decidir si el toggle **arranca ON u OFF**. Hoy ON → maximiza la carga de texto en la condición A | Decisión | Afecta la interpretación del contraste A/B |

## 5. Riesgo para el estudio comparativo

La condición A **es** la de "mucha explicación" a propósito (es el tratamiento). Pero si la carga es tan alta que los participantes **no la leen** (skimming, saltan las cajas), el contraste A vs. B se diluye: se mediría "nadie leyó", no "la explicación no ayudó". **Recomendación:** en el piloto, observar explícitamente si la gente lee las InfoBoxes o las salta, y registrarlo como observación cualitativa.

---

## 6. Evaluación tras el feedback de la profesora guía (2026-09-13)

### 6.1 Lo que ya avanzó esto sin proponérselo (bloques Y/Z, mismo día, antes del feedback)

La sesión del 2026-09-13 hizo varios cambios en `/postulacion` pasos 1 y 2 por otras razones (feedback puntual sobre esas pantallas, ver bitácora Bloques Y y Z) que **de hecho ya avanzan la Opción 3 y parte de la Opción 1** de la tabla de la sec. 4, aunque no fueron diseñados pensando en esta medición. Vale la pena registrarlo para no proponer dos veces lo mismo:

| Cambio (bloque) | Qué texto sacó de la vista por defecto |
|---|---|
| Y8/Y10 — hermano/a que postula pasa a solo lectura, sin ciclo "corregir" | Menos controles y menos copy repetido (etiquetas de campo, mensajes de validación) en el paso 1 |
| Y12/Y13 — popup de confirmación simplificado | Se eliminó el párrafo de "revisa el curso" (una oración larga) y se acortó el aviso del hermano/a a una frase |
| Z1 — aviso "Postula solo si necesitas cambiar de colegio" (47 palabras) movido al final | Ya no es de las primeras ~50 palabras que ve la familia al entrar al paso 2 |
| Z3 — bloque de prioridades ya no se repite en las dos vistas | Elimina una duplicación completa de ~200 palabras (chip row + 3 InfoBoxes + nota SEP) que existía sin que nadie lo hubiera pedido así |
| Z4 — el paso 2 arranca en "Tu lista" (vacía), no en el catálogo de 6 filas | La medición de la sec. 1 ("`/postulacion` paso 2, lista vacía: ~520 palabras, 6 InfoBoxes") **ya no aplica**: la pantalla de entrada real hoy es una línea ("Todavía no agregas ningún colegio…") |

**Conclusión:** la fila "paso 2, lista vacía" de la tabla de la sec. 1 está desactualizada (medida antes de Z3/Z4) y las cifras de "paso 2 con los 6 colegios" también deberían bajar porque el bloque de prioridades ahora solo se cuenta una vez, no dos. **Recomendación:** re-medir antes de decidir qué más consolidar — es posible que la Opción 1 (consolidar InfoBoxes) necesite menos trabajo del que parecía el 09-10.

### 6.2 Evaluación de las 6 opciones de la sec. 4, con el diagnóstico de hoy

| # | Opción | Estado tras Y/Z | Evaluación |
|---|---|---|---|
| 1 | Consolidar InfoBoxes del paso 2 (6–8 → 2–3) | Parcial (Z3 quitó la duplicación) | **Proceder, prioridad media.** Con la duplicación fuera, quedan por fusionar: progreso hacia 6 colegios, consejo de orden real, aviso de lista corta, y el aviso de riesgo (movido al final por Z1) — hoy siguen siendo 4 cajas separadas en "Tu lista". Fusionables en 1–2 sin perder información, ya que varias son condicionales entre sí (nunca se muestran dos a la vez en la práctica: progreso e "✔ llegaste a 6" son mutuamente excluyentes, por ejemplo). |
| 2 | Partir la oración de 65 palabras de "cómo se decide" (paso 1) en 3–4 cortas + viñetas | Sin cambios (no tocado hoy) | **Proceder, prioridad alta, riesgo mínimo.** Es la intervención más barata de todo el documento: mismo contenido, mejor formato. Coincide directamente con el pedido de "reducir texto" sin decidir qué información sacar. |
| 3 | Divulgación progresiva en paso 2 (desplegable "¿Cómo funciona?") | Parcial — Z3/Z4 lograron el efecto por otra vía (ocultar el bloque hasta que hay ≥1 colegio, en vez de un `<details>` colapsable) | **Reevaluar alcance, no descartar.** El bloque de prioridades, cuando SÍ se muestra (en "Tu lista", con colegios agregados), sigue siendo 4 InfoBoxes expandidas de una sola vez. Se puede aplicar el patrón de `/proceso` (colapsado por defecto, con un "¿Cómo funciona?" que lo despliega) a esa instancia única, ahora que ya no hay que resolver la duplicación primero. |
| 4 | Gatear las InfoBoxes grandes de paso 1–2 con el toggle Tutorial ON/OFF existente | Sin cambios | **Depende de una decisión previa (ver Opción 6).** Sigue sin tocarse el InfoBox "Antes de empezar: cómo se decide tu resultado" (paso 1, la oración de 65 palabras de la Opción 2) ni el aviso D · fidelidad (paso 2, ahora al final). Antes de gatearlas hay que resolver si el estudio comparativo necesita que main la condición A muestre esto siempre (fidelidad al "tratamiento") independiente del toggle. |
| 5 | Presupuesto de palabras por pantalla (≤ 400 visibles) como criterio de diseño | No adoptado formalmente | **Adoptar ahora como regla de facto para todo cambio nuevo** (ya se aplicó de forma implícita en Y/Z: cada ajuste de hoy fue en la dirección de "menos, no más"). Formalizarlo evita que futuras InfoBoxes nuevas (como las que se agreguen por otros pedidos) vuelvan a inflar el conteo sin que nadie lo note. |
| 6 | Decidir si el toggle Tutorial arranca ON u OFF para el estudio | Sin decidir | **Sigue pendiente del usuario/profesora — no es una decisión de UX sino de diseño experimental.** Nota: si se gatea más contenido con el toggle (Opción 4) sin resolver esto primero, cambiar el default después obliga a re-tabular cuánto texto ve cada condición. |

### 6.3 Nuevo: subir el tamaño de fuente (pedido explícito de hoy, no estaba en este documento)

**Estado actual del código** (`sae-react/src/index.css`, `App.jsx`, `TextSizeContext.jsx`, `TextSizeBar.jsx`):

- Tamaño base del sitio: `body { font-size: 16px }` — el que ve **todo el mundo por defecto**.
- El toggle "Tamaño de texto: Normal | Grande" (ya existe, visible arriba de cada página) hace dos cosas a la vez cuando se activa "Grande": `document.documentElement.style.fontSize = '18px'` (sube la base rem de todo el sitio, +12.5 %) y además `.page--texto-grande { font-size: 1.06rem }` en el contenedor de cada página (otro +6 % sobre esa base) → el texto dentro de `.page` termina en **~19 px efectivos** cuando "Grande" está activo, contra **16 px** cuando no.
- El problema que señala la profesora no es que el modo "Grande" sea insuficiente (19 px es razonable) — es que **es opt-in**: hay que saber que el control existe y tocarlo. La persona objetivo (Daniela, alfabetización digital básica-intermedia) es precisamente el perfil con menos probabilidad de descubrir y usar un control de accesibilidad opcional. `feedback_sae_problemas.md` ya señalaba esto como hallazgo en el SAE real (m, "no hay controles de tamaño de fuente..."); acá el control existe pero el default sigue siendo el chico.

**Opciones:**

| # | Opción | Efecto | Riesgo |
|---|---|---|---|
| A | Subir el `body { font-size }` por defecto de 16px a **17–18px** (todo el sitio, sin tocar el toggle) | Todo el mundo lee más grande desde el primer segundo, sin depender de que encuentren el control | Bajo — puede requerir revisar algunos layouts angostos (chips, badges) a 375px por si el texto más grande rompe algún ajuste fino de ancho fijo en px |
| B | Mantener 16px por defecto pero agrandar la diferencia de "Grande" (hoy ~19px) a algo más notorio (ej. 20–21px), para quienes sí lo activen | Beneficia solo a quien usa el toggle — no resuelve el problema de que el default siga chico | Bajo, pero no responde al pedido tal como se planteó |
| C | **A + B combinadas**: subir el default a 17–18px y mantener "Grande" como un salto adicional real sobre ese nuevo default (ej. Normal 17px / Grande 21px) | Resuelve el pedido completo: todo el sitio se lee más grande, y el toggle sigue teniendo un propósito claro para quien lo necesite | Medio — más superficie que revisar a 375px, pero ninguna reescritura de componentes |

**Recomendación:** Opción C. Es la única que atiende literalmente el pedido ("subir la fuente de la página web", no "mejorar el toggle") sin dejar el modo "Grande" sin sentido. Antes de implementar, revisar a 375px las zonas con texto en cajas de ancho fijo o `white-space: nowrap` (chips de demanda, badges de prioridad, botones `btn--mini`) — son las que más riesgo tienen de desbordar con una base más grande.

### 6.4 Plan sugerido (orden, no implementado — pendiente de que el usuario lo apruebe)

1. **✅ HECHO (2026-09-13, Bloque Z8).** **Opción 2** (partir la oración de 65 palabras + viñetas) — más barato, cero riesgo, hazlo ya.
2. **✅ HECHO (2026-09-13, Bloque Z8).** **Opción C de fuente** (6.3) — impacto inmediato y visible, requiere solo revisar overflow a 375px. *Nota:* la revisión de overflow se hizo por lectura de CSS, no en navegador en vivo (el entorno de esa sesión no tenía herramienta de navegador) — ver detalle en la bitácora, Bloque Z8. Queda una verificación visual en vivo pendiente de confirmar.
3. **NO hecho.** **Re-medir** la carga de texto de `/postulacion` (tabla de la sec. 1) ahora que Y/Z ya cambiaron los números, antes de decidir cuánto falta de la Opción 1.
4. **Pospuesto (2026-09-13, Bloque Z8).** **Opción 1** (consolidar InfoBoxes restantes de "Tu lista") con los números re-medidos como referencia. Motivo: al revisar el código, esa vista ya había bajado de las 6-8 cajas diagnosticadas originalmente a 2-4 condicionales (varias mutuamente excluyentes por rango de `lista.length`), así que no se justificó tocarla más en esta pasada.
5. **✅ HECHO (2026-09-13, Bloque Z8).** **Opción 3** (colapsar el bloque de prioridades único que queda en "Tu lista", estilo `/proceso`) — se hizo con `<details className="post-demo">`, mismo patrón que "Herramientas de la prueba de usabilidad".
6. **Pendiente de decisión del usuario.** **Opciones 4 y 6** (gateo por toggle + default ON/OFF) — quedan para cuando el usuario decida el diseño experimental definitivo; no bloquean nada de lo anterior.

No se tocó código para escribir esta evaluación. `asignacion.js`/`simulacionSae.js`/`colegios.js` no están involucrados en ninguna de estas opciones (todo es texto/CSS/estructura visual).
