# Propuestas para enriquecer la ficha de resultado (`/seguimiento`)

**Fecha:** 2026-09-10
**Estado:** las opciones **1–5 se implementaron el 2026-09-10** (bitácora Bloque X); **6 y 7 quedan pendientes** de decisión con la profesora guía. Material para la reunión.
**Encuadre:** lo que hay hoy no está mal. Estas son cosas que se agregaron según las guías estudiadas, todas para la **condición A** del estudio (agregan capa de explicación → en la condición B no van). Varias **reducen** texto porque vuelven visual algo que hoy eran párrafos.

> **Implementado (1–5):** `sae-react/src/pages/SeguimientoPage.jsx` + CSS. `npm run lint` (0/0), `npm run build`, `npm test` (16/16) — verificado en navegador con el caso canónico (Sofía → San Martín 1.º → Los Andes 2.ª) y a 375 px, en condición A y B. De paso se corrigieron dos fechas que estaban desalineadas con `/proceso`: aceptar/rechazar **hasta el 21 de octubre** (no "15 de noviembre"), matrícula **9–22 de diciembre** (no "30 de noviembre").

---

## Qué muestra hoy la ficha de resultado

1. Línea de tiempo de 4 etapas, todas marcadas como completadas.
2. Tarjeta principal: ilustración del colegio asignado + nombre + "Preferencia N.º 2" + dirección.
3. Barra de datos: Probabilidad · Prioridad · Demanda · N.º de comprobante.
4. Botones "Aceptar asignación" / "Rechazar y pasar a lista de espera".
5. Tarjeta **"¿Por qué te asignaron este colegio?"** — 3 párrafos (por qué San Martín no la sentó, el sorteo entre iguales, el cierre de Brookings).
6. Tarjeta **"Detalle por preferencia"** — lista de los 6 colegios con su estado y su %.
7. Tarjeta **"¿Qué significa no quedar en tu primera opción?"** — 3 párrafos sobre que el orden no perjudica.
8. Acciones: descargar comprobante (.txt), calendario, ficha del colegio.

---

## Hueco más grande: "¿y ahora qué?"

La página trata el resultado como el final del proceso (la línea de tiempo termina en "Resultado"). En el SAE real, después vienen **Periodo Complementario** y **Matrícula**, y hay una **regla de alto riesgo**: si la familia no entra durante la etapa de Resultados, **la asignación se acepta sola**. Esa regla está en `/proceso` pero **no en la ficha de resultado**, que es donde más importa.

---

## Propuestas, ordenadas por impacto

### A. Bloque "Qué sigue ahora" (el que más falta)

**Qué es.** Un recuadro corto, con 2–3 pasos concretos y sus fechas: (1) aceptar o rechazar antes del *[fecha]*; (2) si aceptás, matrícula en el colegio antes del *[fecha]*; (3) si no quedaste conforme, podés volver a postular en el Periodo Complementario del *[fechas]*. Y una línea destacada: **"Si no haces nada antes del *[fecha]*, el sistema acepta la asignación automáticamente."**

**Guías.** GOV.UK — las páginas de confirmación deben decir siempre "qué ocurre después". Brookings — gestión de expectativas: dejar claro que el proceso no terminó. Microsoft G16 — comunicar la consecuencia de *no* actuar.

**Efecto en el estudio.** Confianza (F4: "si no quedara en ninguno, la plataforma explica qué pasa después") y comprensión general del proceso.

**Costo / carga de texto.** Bajo. Suma ~40 palabras, pero reemplaza información que hoy está dispersa (una línea en la tarjeta de aceptar, otra en el mensaje post-aceptación).

---

### B. Comparación visual "por qué este colegio y no el anterior"

**Qué es.** Dos filas, de un vistazo, en vez de (o antes de) los 3 párrafos actuales:

| Colegio | Tu situación ahí | Resultado |
|---|---|---|
| San Martín *(tu 1.ª opción)* | Sin vínculo · alta demanda | No alcanzó |
| **Los Andes** *(tu 2.ª opción)* | **Hermano/a matriculado/a** → prioridad más alta | **Cupo** |

**Guías.** Microsoft G11 (la razón real del resultado) + G4 (información relevante junto a la decisión). Comunicación de riesgo — una tabla se procesa más rápido que tres párrafos.

**Efecto en el estudio.** Comprensión (C4: "puedo explicar con mis palabras por qué era poco probable San Martín", C5: "entendí por qué el resultado fue ese").

**Costo / carga de texto.** **Reduce** texto: la tabla puede quedar arriba y los párrafos volverse un "leer más" opcional (divulgación progresiva, guía de Google).

---

### C. Icon array del "no quedaste" en la primera opción

**Qué es.** La cuadrícula de 100 figuritas que ya existe en la ficha de colegio, aplicada acá: *"En el Colegio San Martín, tu 1.ª opción, quedaron ~26 de cada 100 familias en tu misma situación. Vos estuviste entre las otras 74."* Con las 26 marcadas.

**Guías.** Comunicación de riesgo (Galesic 2009, icon arrays para baja numeracidad). Google — probar representaciones visuales además del número. Convierte el "no quedaste" en algo **medido**, no arbitrario → ataca la percepción de "tómbola".

**Efecto en el estudio.** Percepción de justicia (J2: "me pareció justa la razón por la que no quedó en San Martín") y confianza (F1: "el sistema asigna con reglas, no al azar").

**Costo / carga de texto.** Medio. Suma un elemento visual + ~20 palabras. Ojo: no acumularlo encima de los 3 párrafos; iría **en vez de** parte de ellos.

---

### D. Contrafactual concreto con *esta* lista

**Qué es.** Una sola frase, anclada al caso real: *"¿Y si hubieras ordenado distinto? El resultado sería el mismo. Si hubieras puesto Los Andes primero, habrías quedado igual en Los Andes: cada colegio te evalúa por separado, sin mirar en qué lugar de tu lista lo pusiste."*

**Guías.** Google — la explicación específica del resultado (no la general) es la que despeja la confusión. Correa/Brookings — hace concreto y verificable el "el orden no te perjudica" (hoy se dice en abstracto en la 3.ª tarjeta).

**Efecto en el estudio.** El ítem F3 y la pregunta abierta A1 (el mito del riesgo estratégico) — que son exploratorios y hoy dependen de que la persona *infiera* la propiedad.

**Costo / carga de texto.** Bajo. ~35 palabras. Puede fusionarse con la tarjeta "¿Qué significa no quedar en tu primera opción?" (que hoy tiene 3 párrafos algo redundantes → quedaría más corta).

---

### E. Apoyo a la decisión de aceptar / rechazar

**Qué es.** Una línea de consecuencia debajo de cada botón: bajo "Aceptar" → *"Quedas matriculado/a en Los Andes. Sales de las listas de espera de tus otras preferencias."* Bajo "Rechazar" → *"Mantienes la lista de espera de tus preferencias 1 a 6, pero si no se libera ningún cupo puedes quedar sin asignación."*

**Guías.** Microsoft G16 — comunicar la consecuencia **antes** de la acción, no después. GOV.UK — recuperación y claridad en pasos irreversibles.

**Efecto en el estudio.** Confianza en el momento de una decisión real; comprensión de qué es la lista de espera.

**Costo / carga de texto.** Bajo. ~25 palabras, en el punto exacto donde se necesitan.

---

### F. "Detalle por preferencia" con los datos que explican el %

**Qué es.** Hoy, al desplegar un colegio de la lista se ve dirección, jornada y PIE. Agregar los datos que **explican su probabilidad**: postulantes del año anterior, rango de vacantes, tu prioridad ahí. Así la persona puede ver, colegio por colegio, *por qué* uno la sentó y otro no.

**Guías.** Microsoft G2 (dejar claro de qué está hecha la estimación) + G11. Google — acompañar el número con su fundamento.

**Efecto en el estudio.** Comprensión (C2: "por qué las posibilidades eran distintas por colegio").

**Costo / carga de texto.** Nulo en la vista principal (va dentro del desplegable, que es opcional). Reemplaza datos poco útiles (jornada) por datos que explican.

---

### G. Lista de espera concreta (no abstracta)

**Qué es.** Si rechaza o queda en 2.ª opción, mostrar de qué colegios queda en lista de espera y, si hay dato, una referencia de cuántos cupos suelen liberarse. Hoy "pasas a la lista de espera" no dice de qué ni con qué probabilidad.

**Guías.** Google — patrón de "alternativas / N-mejores opciones" (es el pendiente P1 de la bitácora). Brookings — expectativas realistas sobre el paso siguiente.

**Efecto en el estudio.** Confianza (F4) y realismo de expectativas (ligado a Arteaga: sobreoptimismo).

**Costo / carga de texto.** Medio. Requiere decidir si el prototipo simula movimiento de listas de espera o solo las nombra. Nombrarlas es barato; simular movimiento es más trabajo y otro supuesto que declarar.

---

## Cómo llevarlo a la reunión

- Las de **mayor impacto y menor costo**: **A** (qué sigue ahora), **B** (comparación visual), **D** (contrafactual concreto), **E** (consecuencia de aceptar/rechazar).
- **C** y **G** son más potentes para "sensación de justicia" y "expectativas realistas", pero suman elemento visual / un supuesto nuevo — conviene decidir con la profe si valen el costo.
- **F** es casi gratis y mejora la comprensión del "por qué distinto en cada colegio".
- Regla transversal: **casi todas deberían sustituir texto, no acumularse encima** — la ficha ya tiene 3 tarjetas de párrafos y el flujo completo está cargado de lectura (ver `carga_de_texto_flujo_postulacion.md`).
