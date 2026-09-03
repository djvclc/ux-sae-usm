# Mapa de resultados del caso Muñoz González (prototipo, sin SEP/PIE)

**Fecha:** 2026-09-03
**Para qué:** entender qué colegio puede quedar asignado según el orden que elija el/la participante, para el diseño de tareas de la prueba de usabilidad y para el `writing-agent`.
**Estado del caso:** familia sin cuota SEP ni PIE (revisión Bloque O de `bitacora_flujo_postulacion_y_resultado.md`).

---

## ⚠️ Aclaración importante: esto NO es el algoritmo del SAE

Lo que sigue describe **`calcularResultado`** de `sae-react/src/utils/asignacion.js` — el **modelo didáctico del prototipo**, no el mecanismo real.

**El SAE real** usa **Aceptación Diferida** (Gale–Shapley *student-proposing*, `investigacion_algoritmo_sae.md` §3.1):

- Opera **por rondas**: cada estudiante "propone" a su colegio más preferido que aún no lo rechazó; cada colegio **retiene tentativamente** a los mejores según prioridades legales + un **sorteo aleatorio independiente por colegio**, hasta llenar sus vacantes, y rechaza al resto; los rechazados proponen a su siguiente preferencia; un retenido puede ser **desplazado** en rondas posteriores por alguien con mejor prioridad. Termina cuando no hay más propuestas.
- **No existe un "umbral de probabilidad"**: quedas o no quedas en un colegio según cuántos otros postulantes con igual o mejor prioridad lo pidan, cuántas vacantes haya y cómo caiga el sorteo. El resultado es una **asignación estable** para todo el sistema a la vez.
- Si un colegio tiene menos postulantes que vacantes, **la ley obliga a admitirlos a todos**.
- Las cuotas (PIE, 15 % prioritarios, alta exigencia) se modelan como "sub-escuelas" con sus propias vacantes.

**El prototipo no corre nada de esto.** No simula a los demás postulantes, ni cupos reales, ni rondas, ni sorteo. Estima, para **una sola familia ficticia**, una probabilidad aproximada por colegio en función de (a) su nivel de prioridad legal ahí y (b) qué tan disputado está el colegio, y de ahí deduce un desenlace plausible. Es un **proxy de resultados**, pensado para hacer visible una relación —más prioridad / menos demanda → más probable; el orden decide cuál de tus opciones viables te toca—, no para reproducir el mecanismo.

---

## Qué hace `calcularResultado` (el modelo del prototipo), exacto

1. Para cada colegio de la lista calcula `prob = probAsignacion(nivel, demanda)` (tabla fija de 15 valores; `nivel` 1–5 resuelto por `nivelPrioridadEnColegio`, `demanda` = etiqueta del colegio en `colegios.js`). **La `prob` de un colegio no cambia con su posición en la lista.**
2. `idxAsignado = detalles.findIndex(d => d.prob >= 65)` → **el primer colegio de la lista cuya `prob` estimada llega a 65 %** es la asignación.
3. **Si ninguno llega a 65 %** (`idxAsignado === -1`): asigna el de **mayor `prob`** de la lista (`reduce` que se queda con el primer índice del máximo → en empate gana el que está más arriba). La página lo presenta en rojo (*"ningún colegio de tu lista alcanza… podrías quedar sin asignación en la ronda principal"*).
4. Los `estado` de los demás colegios (`sin_cupos` / `prioridad_insuficiente` / `no_evaluado`) son etiquetas de la visualización paso a paso (`AlgoSimuladorPasos`), no estados del SAE real.

El umbral `65` y el "modo de descarte" vienen del diseño del simulador V2 (`archivo/CLAUDE_v2.md` §3: *"muestra el primer colegio donde la probabilidad supera el 65 %; si ninguno, el de mayor probabilidad con advertencia"*). Son decisiones pedagógicas, sin calibración empírica (ver bitácora sec. 6 nº 9).

---

## Probabilidades fijas del caso (familia sin SEP/PIE)

| # | Colegio | Vínculo de la familia | nivel | demanda | **prob.** | ¿puede ser la asignación? |
|---|---|---|---|---|---|---|
| 1 | Colegio Los Andes | hermano/a (Martina matriculada) | 1 | alta | **92 %** | ✅ siempre (≥ 65) |
| 3 | Escuela República de Chile | exalumno/a (la madre) | 4 | baja | **96 %** | ✅ siempre (≥ 65) |
| 5 | Colegio Villa del Sol | funcionario/a (el padre) | 3 | alta | **65 %** | ✅ siempre (justo en el umbral, inclusivo) |
| 4 | Liceo Técnico Simón Bolívar | — | 5 | media | **60 %** | ⚠️ solo por descarte |
| 6 | **Escuela Básica Los Quillayes** | — (colegio de origen; la continuidad no se modela como prioridad) | 5 | media | **60 %** | ⚠️ solo por descarte |
| 2 | Colegio San Martín | — (el "colegio en mente") | 5 | alta | **28 %** | ❌ prácticamente nunca |

Se llaman **"viables"** a Los Andes, República de Chile y Villa del Sol (prob ≥ 65).

---

## Regla derivada

El desenlace depende **solo de cuál de los tres viables aparece primero** en la lista:

- **Si la lista contiene al menos un viable:** la asignación es **el primer viable de la lista**. Su número de preferencia = su posición (contando los no-viables que pusiste antes). Como hay 3 no-viables, un viable puede terminar hasta en 4.ª preferencia.
- **Si la lista no contiene ningún viable:** modo de descarte → gana el de mayor `prob` entre {Simón Bolívar 60, Los Quillayes 60, San Martín 28} que esté en la lista; en el empate 60–60, el que esté más arriba. Siempre con la alerta roja.

---

## Mapa de resultados

| Orden (lo que importa) | Asignación | Preferencia | Cómo lo presenta la página |
|---|---|---|---|
| Los Andes antes que República y Villa del Sol | **Los Andes** (92 %) | 1.ª–4.ª | verde; *"prioridad más alta por ley (hermano/a)"* |
| República antes que Los Andes y Villa del Sol | **República de Chile** (96 %) | 1.ª–4.ª | verde; *"exalumno/a de ese establecimiento"* |
| Villa del Sol antes que Los Andes y República | **Villa del Sol** (65 %) | 1.ª–4.ª | verde; *"tu apoderado/a trabaja ahí"*. Al 65 % — menos certeza que Los Andes, pero igual queda. Poner Los Andes primero no le habría costado nada |
| San Martín 1.º, luego un viable | ese viable | 2.ª+ | *"no quedaste en tu primera opción porque…"* |
| Lista **sin** Los Andes, República ni Villa del Sol, con Simón Bolívar antes que Los Quillayes | **Simón Bolívar** (60 %) | según posición | **alerta roja**: ningún colegio alcanza el umbral |
| Lista **sin** los tres viables, con **Los Quillayes antes que Simón Bolívar** (o sin Simón Bolívar) | **Escuela Básica Los Quillayes** (60 %) | según posición | **alerta roja** |
| Lista = solo San Martín | San Martín (28 %) | 1.ª | degenerado (la recomendación es ≥ 6 colegios) |

---

## Respuestas puntuales

**¿Puede quedar en Escuela Básica Los Quillayes?**
Sí, pero solo con una lista "mala": hay que **excluir los tres colegios donde la familia tiene prioridad** (Los Andes, República, Villa del Sol) y poner Los Quillayes antes que Simón Bolívar. Ejemplo mínimo:

> `San Martín · Los Quillayes · Simón Bolívar` → asignación **Escuela Básica Los Quillayes** (60 %), preferencia 2, con la alerta *"ningún colegio de tu lista alcanza… podrías quedar sin asignación"*.

**¿Puede quedar en Liceo Técnico Simón Bolívar?**
Igual que Los Quillayes, pero con Simón Bolívar antes que Los Quillayes en una lista sin viables.

**¿Puede quedar en Colegio San Martín?**
No, salvo que sea el **único** colegio de la lista. Su 28 % está por debajo de todo lo demás, así que ni el modo de descarte lo elige mientras haya otro colegio.

---

## Para el diseño de la prueba

- El caso "esperado" (viable como 1.ª opción) y el caso "puse San Martín 1.º y caí en Los Andes" ya están cubiertos.
- **Anti-patrón observable:** una persona que arma su lista solo con colegios "aspiracionales" donde no tiene vínculo (San Martín, Simón Bolívar, Los Quillayes) y deja fuera los tres donde sí tiene prioridad. Resultado: cae en su colegio de origen (Los Quillayes) por descarte, o queda en riesgo de no-asignación. Enseña que **listar colegios donde tienes un vínculo real es lo que da opciones**, no solo listar los que te gustan.
- **Villa del Sol 1.º vs Los Andes 1.º:** los dos quedan asignados; sirve para observar si la persona entiende que poner primero el menos seguro (65 %) igual la deja adentro y no perjudica al otro.

## Para el `writing-agent`

Este mapa **no debe** presentarse en la memoria como "el algoritmo del SAE". Si se usa, encuadrarlo como el **comportamiento del simulador del prototipo** y contrastarlo con la Aceptación Diferida real (`investigacion_algoritmo_sae.md` §3.1). Conecta con la tarea pendiente de "argumentar de dónde salen los porcentajes de `probAsignacion`" (`prompt_pendientes_revision_caso_sin_sep.md`, Tarea 2).
