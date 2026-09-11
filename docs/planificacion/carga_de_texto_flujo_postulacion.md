# Carga de texto del flujo de postulación — diagnóstico y opciones

**Fecha:** 2026-09-10
**Estado:** investigación, **sin cambios de código**. Insumo para decidir con la profesora guía.
**Motivo:** en Chile la comprensión lectora es frágil (PISA 2022 lectura ≈ 448; ~1 de cada 3 estudiantes de 15 años bajo el nivel 2. PIAAC / alfabetización adulta: cerca de la mitad de los adultos en el nivel más bajo — *verificar las cifras exactas y su fuente antes de citarlas en la memoria*). La persona objetivo (Daniela, alfabetización digital básica-intermedia, nivel 6.º básico) es exactamente ese perfil.

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
