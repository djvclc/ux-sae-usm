# Caso de estudio para la validación del flujo de postulación

**Fecha:** 2026-08-08 · actualizado 2026-08-13 · **revisión mayor 2026-09-03** (Bloques O y R) · **reorientación a estudio comparativo 2026-09-06** (bitácora `bitacora_flujo_postulacion_y_resultado.md` §7).

**Estado:** el caso y la familia ficticia están cerrados. La **metodología de validación cambió de rumbo** tras la reunión con la profesora guía: de una prueba de usabilidad **formativa de final abierto** (N≈8, la persona elige el orden de la lista) a un **estudio comparativo entre-sujetos** (N≈30, dos condiciones, lista y orden fijos, mismo desenlace para todos). Este documento ya refleja esa reorientación.

### Estado del documento (2026-09-09) — para revisión de la profesora guía

| Bloque del diseño | Estado |
|---|---|
| Familia ficticia y caso (§1–§2) | ✅ Cerrado |
| Lista y orden canónico de 6 colegios (§3) | ✅ Cerrado y **verificado contra el código** (`SEED_CASO = 20260903`; `calcularResultado`; 16/16 tests de `flujo-postulacion.test.js`) — San Martín 1.º (26 %, no queda) → **Colegio Los Andes, 2.ª preferencia** (99 %, por hermano/a) |
| Las dos condiciones A / B (§6.1) | ✅ Definidas **e implementadas en código** (2026-09-09, bitácora Bloque V). B (modo control) se activa vía la pantalla `/estudio` del moderador; contexto `ModoEstudioContext` que oculta la capa de explicabilidad. `asignacion.js`/`simulacionSae.js` intactos → resultado idéntico en A y B |
| **§3.2 — por qué no queda en San Martín** (argumento técnico + traducción de usuario por las guías) | ✅ Añadido 2026-09-09. Fija el texto de referencia para la explicación de `/seguimiento` en la condición A |
| Tareas dirigidas (§6.2) | ✅ 8 tareas, con ramas `[A]` / `[B]` |
| Instrumento: línea base + Likert 13 ítems + abiertas (§8) | ✅ Cerrado |
| **Hipótesis explícitas (§8.4)** | ✅ Añadidas 2026-09-09 |
| **Plan de análisis (§8.5)** | ✅ Añadido 2026-09-09 |
| **Amenazas a la validez (§10)** | ✅ Consolidadas 2026-09-09 |
| Comité de ética UTFSM | ⚠️ **Acción del autor:** confirmar con la Dirección de la carrera / comité si es exigible para una memoria de título con datos ficticios; el consentimiento informado simple ya está redactado (§7.1). No bloquea la aprobación del diseño, sí el reclutamiento |
| `guion_moderador…md` / `guion_participante…md` | ✅ Re-sincronizados a la lista fija y a las ramas A/B el 2026-09-09 |
| **PDF** de este documento + los dos guiones + el material para participantes | ✅ Regenerados el 2026-09-09 (`docs/investigacion/*.pdf`) |
| `material_prueba_usabilidad_postulacion.md` + `.pdf` | ✅ Cuadernillo del participante nuevo (consentimiento, familia sin SEP/PIE, lista fija, cuestionario pre y post) — reemplaza el material de agosto que asumía SEP/PIE |
| `03_metodologia.tex` §3.5 | ⚠️ Reescritura mayor pendiente (`writing-agent`): de "prueba formativa N=8" a "estudio comparativo N≈30". La descripción del caso y del simulador ya se corrigió el 2026-09-08 |

**Qué falta para poder ejecutar el estudio (no para aprobar el diseño):** (1) ~~implementar la condición B (F3)~~ — hecho el 2026-09-09 (Bloque V); (2) confirmar el trámite de ética; (3) reclutar (~15 por condición); (4) piloto: recorrer la condición B end-to-end en 375 px confirmando que es un proxy fiel del SAE real (bitácora §7.7 / `f3_modo_control_inventario.md` §4).

> **Reorientación 2026-09-06 (bitácora §7).** En la reunión, la profesora guía sugirió pasar a un **estudio comparativo controlado**: se entrega a cada participante la **misma lista de 6 colegios en el mismo orden**, de modo que **todos vean el mismo resultado**, y se contrastan **dos condiciones** — (A) el prototipo, que explica el algoritmo apoyado en las guías de `investigacion_ux_guide_ai_systems.md`; (B) un control fiel a la vitrina / SAE real (`investigacion_vitrina_sae.md`), que **no** lo explica. El foco de la memoria es **explicar el algoritmo apoyándose en esas guías**; la condición B es el control que permite atribuir a la explicación las diferencias de comprensión, confianza y percepción de justicia. Diseño **entre-sujetos**, N≈30 (~15 por condición): dentro-sujetos no sirve porque, una vez que se entiende el algoritmo, no se puede "desentender" para el control. Decisiones del autor sobre el diseño en la bitácora §7.5.

> **Revisión 2026-09-03 (Bloques O y R).** (1) El caso **deja de usar la cuota de estudiante prioritario/a (SEP) y el PIE**: la familia Muñoz González ya no es prioritaria. Con SEP activa, el colegio N.º 1 de la lista quedaba asignado **siempre** y el "colegio en mente" no producía ninguna tensión; además, tratar la cuota SEP como un rango casi seguro es incorrecto en el mecanismo (es una reserva del 15 % modelada como "sub-escuela", sobre-suscrita — 54,7 % de postulantes en 2018 para 15 % de cupos, `investigacion_algoritmo_sae.md` §3.2 y §6). (2) Se **reemplazó la tabla `probAsignacion`** (15 valores escritos a mano, sin calibración empírica) y el umbral de asignación del 65 % por una **simulación DA-por-colegio con Monte Carlo** (`sae-react/src/utils/simulacionSae.js`): el `%` de cada colegio sale de simular la competencia real por sus cupos (vacantes y postulantes del año anterior reales, multitud sintética con tramos de prioridad muestreados, cuota SEP del 15 % como sub-escuela, sorteo por colegio; 1000 iteraciones con semilla fija). Con ese modelo el "colegio en mente" da **≈26 %**.

## 1. Criterios del SAE que el caso debe cubrir

Según `investigacion_algoritmo_sae.md` (§3.2), el orden real de procesamiento es:

1. **PIE** (cuota, hasta 2 cupos por curso, se procesa antes que cualquier prioridad) — solo en colegios con programa validado.
2. **Hermano matriculado o admitido** en el establecimiento (prioridad legal 1).
3. **Estudiante prioritario** (cuota del 15 % por nivel, Registro Social de Hogares, tercio de menores ingresos) — se procesa inmediatamente después de hermanos.
4. **Hijo de funcionario** del establecimiento (prioridad legal 2).
5. **Exalumno** no expulsado (prioridad legal 3).
6. *(Cuota adicional, solo 7.º básico/1.º medio con examen: alta exigencia académica — ver nota de alcance en §4.)*

**Qué activa este caso:** los **tres grupos de prioridad legal por establecimiento** — hermano/a (Los Andes), funcionario/a (Villa del Sol), exalumno/a (República de Chile) —, cada uno en un colegio distinto, para mostrar que un vínculo vale **solo en el colegio donde existe**. El caso **no activa** las cuotas: ni PIE ni estudiante prioritario/a (15 %). La razón es de diseño: una cuota transversal como la SEP eleva la probabilidad estimada en todos los colegios por igual y borra la tensión que el caso necesita (§3.1); sin ninguna condición transversal, el "colegio en mente" (San Martín, sin vínculo y con demanda alta) tiene una probabilidad genuinamente baja. La distinción prioridad-legal / cuota se explica igual en el flujo (condición A), pero el caso ya no la ejercita en primera persona.

Reglas estructurales que el caso también ejercita: sin tope de colegios y recomendación de listar al menos 6 (E2); se puede postular fuera de la comuna/región de residencia (E1); desempate aleatorio independiente por colegio (E5); postulación familiar en bloque; y conservación del colegio de origen si no hay asignación en ninguna preferencia.

## 2. La familia ficticia: Muñoz González

Coherente con la persona Daniela González (35 años, RM, alfabetización digital básica-intermedia, acceso por móvil, percibe el SAE como "tómbola").

- **Apoderada:** Daniela González, 35 años.
- **Padre:** Rodrigo Muñoz — trabaja como asistente de aula en **Colegio Villa del Sol** (Peñalolén) → activa prioridad **funcionario/a** ahí.
- **Daniela** es exalumna de **Escuela República de Chile** (La Florida) → activa prioridad **exalumno/a** ahí.
- **Hija mayor (no postula este proceso):** Martina, 15 años, matriculada desde 2023 en **Colegio Los Andes** (La Florida) → activa prioridad **hermano/a** para sus hermanos menores si postulan ahí.
- **Hijos que postulan (Admisión 2027), en bloque familiar:**
  - **Sofía**, 9 años, 3.º básico actual en Escuela Básica Los Quillayes (su colegio de origen — conserva continuidad si no queda en otro); **postula a 4.º básico**. Es la estudiante que la persona vincula y cuya postulación completa en el flujo.
  - **Mateo**, 12 años, 6.º básico, postula a 7.º básico. Al marcar la **postulación familiar en bloque** se declara que Mateo también postula y se ingresan sus datos básicos, para que el sistema vincule ambas postulaciones. *En el prototipo, `calcularResultado` corre solo para Sofía; la postulación de Mateo "va aparte" y no se completa en la sesión (bitácora Bloque P).*
- **Condiciones transversales:** ninguna. La familia **no** está en el tercio de menores ingresos del Registro Social de Hogares (sin cuota SEP) y Sofía **no** tiene PIE vigente. Sus únicas ventajas son los **vínculos por establecimiento** de arriba.
- **El colegio que tienen en mente:** Daniela y Rodrigo quieren, además, incluir el **Colegio San Martín** (Maipú) — se los recomendó una vecina y les gustó el proyecto educativo cuando lo visitaron, aunque **no tienen ningún vínculo con él** (ni hermano, ni funcionario, ni exalumno) **y es un colegio de demanda alta**. Esa combinación —preferencia personal alta + cero prioridad + demanda alta— hace que su probabilidad estimada sea **baja (≈26 %)**, muy por debajo de Los Andes (≈99 %, por el hermano). Es el punto de observación central del caso (§3.1).

## 3. Lista de colegios y orden de postulación (fijo)

Se usan los 6 colegios reales de `sae-react/src/data/colegios.js`. **En el estudio comparativo la lista se entrega ya armada y en un orden exacto** (bitácora §7.5, D1): la persona **no** elige ni reordena; se le pide postular exactamente estos 6 en este orden.

`prob.` = probabilidad estimada para el/la estudiante de este caso (4.º básico). Desde el Bloque R la estima una **simulación DA-por-colegio con Monte Carlo** (`simulacionSae.js`), no una tabla. Solo la ve la **condición A**.

| Orden | Colegio | Comuna | Demanda | Vínculo de la familia | prob. |
|---|---|---|---|---|---|
| **1** | **Colegio San Martín** | Maipú | **Alta** | **Ninguno** — el "colegio en mente" | **≈26 %** — probable que NO quede |
| **2** | **Colegio Los Andes** | La Florida | Alta | **Hermano/a** (Martina matriculada ahí) | **≈99 %** — casi seguro |
| 3 | Escuela República de Chile | La Florida | Baja | **Exalumno/a** (la madre) | ≈99 % — casi seguro |
| 4 | Colegio Villa del Sol | Peñalolén | Alta | **Funcionario/a** (el padre trabaja ahí) | ≈99 % — casi seguro |
| 5 | Liceo Técnico Simón Bolívar | Puente Alto | Media | Sin vínculo; **fuera de la comuna de residencia** (E1: no hay restricción regional) | ≈50 % — moneda al aire |
| 6 | Escuela Básica Los Quillayes | La Florida | Media | Colegio de origen de Sofía — la continuidad **no** se modela como prioridad | ≈46 % — moneda al aire |

Con 6 colegios se cumple la recomendación oficial de listar al menos 6 (E2) y se cubren los tres grupos de prioridad legal (cada uno en su establecimiento), la regla de comuna/región, la continuidad de colegio de origen y la postulación familiar en bloque.

**Resultado canónico (verificado contra el código real — `calcularResultado` + `SEED_CASO = 20260903`, 4.º básico, familia sin SEP; coincide con el test `escenario clave` de `flujo-postulacion.test.js`, 16/16 verde el 2026-09-09):**

- Posición 1 · **Colegio San Martín** → el sorteo **no** la sienta (≈26 %) → `prioridad_insuficiente`.
- Posición 2 · **Colegio Los Andes** → **ASIGNADO**, preferencia N.º 2, por el vínculo de hermano/a (≈99 %).
- Posiciones 3–6 · no se evalúan (ya hay asignación).
- `sinAsignacionEnPreferencias: false`.

**Todos los participantes, en ambas condiciones, terminan asignados a Colegio Los Andes en su 2.ª preferencia.** El estudio mide, sobre ese mismo desenlace, si la UX que explica el algoritmo (A) produce mejor comprensión / confianza / percepción de justicia que el control (B). Las posiciones 3–6 se dejaron en el orden "resto de vínculos, luego los sin vínculo de demanda media"; como Los Andes queda 2.º, el desenlace no depende de ese tramo.

### 3.1 El colegio en mente: el punto de observación central

Colegio San Martín es el que la familia **quiere de verdad**, sin que ese deseo esté respaldado por ninguna prioridad. Esa combinación —preferencia personal alta, favorabilidad algorítmica baja— es donde la desconfianza en el SAE ("tómbola") se vuelve concreta, y por eso el escenario canónico lo pone **primero**: todos los participantes viven el "no obtuve mi primera opción, ¿por qué?". Tres cosas distintas que la prueba debe distinguir:

1. **Riesgo real (probabilidad).** San Martín tiene demanda alta (≈71 postulantes el año anterior contra 24–28 vacantes en básico) y ningún criterio de prioridad a favor de la familia → sin una prioridad que asegure el lugar, el cupo depende de la demanda y las vacantes → probabilidad estimada **≈26 %**, muy por debajo de Los Andes o República de Chile (≈99 %). En la **condición A** este número se muestra con su fundamento visible (postulantes año anterior, vacantes) y no como cifra aislada (HAX G2). En la **condición B** no se muestra ninguna probabilidad. *(Nota de microcopy, 2026-09-07: en el flujo se evita el encuadre "entras solo por el sorteo" — alimenta el estigma de "tómbola"; el término "sorteo" se reserva para explicar el mecanismo en `/algoritmo`, no para el encuadre en el punto de decisión.)*
2. **Falso riesgo estratégico (mito a corregir).** La Aceptación Diferida es esencialmente a prueba de estrategia (`investigacion_algoritmo_sae.md` §4.2): ubicar el colegio realmente preferido primero **nunca** perjudica a la familia frente al sistema, aunque tenga baja probabilidad. En el estudio comparativo la lista se entrega fija, así que este mito **ya no se observa por dónde ubica la persona el colegio**, sino por las **preguntas abiertas** (§8.3): *"si tú hubieras armado la lista, ¿te habría dado miedo poner primero el colegio que más quieres aunque tuviera pocas posibilidades? ¿por qué?"*. Se espera que la condición A —que corrige explícitamente este mito— reduzca ese miedo frente a la condición B.
3. **Consejo complementario.** La orientación estratégica del prototipo (condición A) sugiere agregar colegios de mayor probabilidad más abajo en la lista (los que sí tienen vínculo) como respaldo, no como reemplazo del colegio soñado. En el caso canónico esos respaldos ya están en la lista (posiciones 2–4).

*Antecedente de diseño (2026-08-13):* `investigacion_ux_guide_ai_systems.md` §4 detectó que el paso 3 del prototipo contradecía al paso 2 (el paso 2 dice "ordena por tu preferencia real"; el paso 3 sugería "considera ponerlo más abajo en tu lista", reforzando el mito). Las 5 recomendaciones de ese documento se implementaron en `PostulacionPage.jsx` (`S22-14 (refinamiento)`): se retiró la sugerencia de reordenar, se separó el dato que fundamenta la probabilidad baja de una frase explícita de que reordenar no cambia esa cifra ni las chances en los demás colegios, se extendió el formato de frecuencia a los tres niveles de probabilidad y se añadió la categoría "Certeza muy alta" (prioridad hermano/a, prob. ≥ 90 %). Ese texto corregido es parte de la **condición A**; el estudio comparativo verifica si cambia el comportamiento observado, no solo si es correcto en el papel.

### 3.2 Por qué no queda en el Colegio San Martín: el argumento del algoritmo y su traducción para el usuario

Añadido 2026-09-09. La explicación que la **condición A** entrega en `/seguimiento` (ítems **C4**, **C5**, **J2**) debe ir más allá de "no cumple con las prioridades". Esta sección fija el argumento técnico y su versión en lenguaje de usuario.

#### A. El argumento técnico (efecto de las condiciones del algoritmo)

En Aceptación Diferida, **San Martín ordena a todos sus postulantes en una sola fila** y retiene tentativamente a los ~26 primeros (sus cupos de 4.º básico), rechazando al resto en cada ronda. La fila se arma (`investigacion_algoritmo_sae.md` §3.2):

1. **Por grupo de prioridad legal, en orden estricto:** reserva PIE → hermanos/as → reserva del 15 % para estudiantes prioritarios/as → hijos/as de funcionario/a → exalumnos/as → **familias sin ningún vínculo con ese colegio**.
2. **Dentro de cada grupo, por el número de sorteo propio de San Martín** (cada colegio sortea el suyo — regla de *Multiple Tie-Breaking*, no una lotería nacional única).

La familia Muñoz González cae en el **último grupo** en San Martín (sin hermano/a, sin funcionario/a, sin exalumno/a, sin cuota SEP). El "corte" —el puesto 26— queda por encima de ella. El resultado sale de una **cuenta aritmética**, no de un juicio:

```
cupos de San Martín (4.º básico)                         ≈ 26
– postulantes con prioridad o con la reserva del 15 %
  que también pidieron San Martín                        ≈ 20   (ilustrativo)
────────────────────────────────────────────────────────────────
cupos que quedan para familias sin vínculo               ≈  6
familias sin vínculo que pidieron San Martín             ≈ 31
→ Sofía necesita quedar entre las ~6 primeras de ~31  ≈ 1 de cada 5 en un sorteo puntual
→ repetido 1000 veces (Monte Carlo, `simulacionSae.js`) → queda dentro en ≈ 26 de cada 100
```

*(20 / 6 / 31 son ilustrativos del orden de magnitud, no las cifras internas exactas del modelo; lo que importa es la estructura: la mayoría de los cupos se los llevan familias con prioridad + la reserva SEP, y un remanente pequeño se decide por sorteo entre las familias sin vínculo.)*

**Propiedades del mecanismo que hacen del rechazo algo justo, no un error:**

- **Estabilidad / ausencia de envidia justificada.** Toda familia que quedó en San Martín *o tiene una prioridad que la familia Muñoz González no tiene ahí, o estaba en su misma situación y su número de sorteo salió antes*. El sistema **nunca** deja fuera a una familia para dejar dentro a otra con *menos* prioridad. Ese es el estándar de asignación "objetiva y no discriminatoria" que exige la Ley de Inclusión.
- **Strategy-proofness** (`investigacion_algoritmo_sae.md` §4.2). San Martín evaluó a Sofía **igual la hubiera puesto primera o última** en su lista. Poner San Martín primero **no le costó ninguna posibilidad** en los demás colegios: por eso igual quedó en Los Andes.
- **Garantía de recorrido.** Al no sentarla San Martín, DA **siguió bajando por su lista** y la dejó en el **primer colegio donde sí alcanzaba: Colegio Los Andes** (2.ª opción), donde tiene a su hermana Martina. "Quedas en el mejor colegio de tu lista que te aceptaría" — se cumplió.

**Caso hipotético (contrafactual) — qué habría cambiado el resultado, con los mismos 26 cupos y la misma demanda:**

| Cambio | Efecto sobre el resultado en San Martín |
|---|---|
| Sofía tuviera un hermano/a matriculado/a en San Martín | Sube al grupo "hermanos" → ≈ 99 % (como Los Andes). **Lo único que cambia es su grupo en la fila.** |
| San Martín tuviera ~40 cupos (misma demanda) | Crece el remanente para "sin vínculo" → su probabilidad sube |
| Solo ~40 familias hubieran pedido San Martín (mismos cupos) | Igual: más cupos por familia sin vínculo |
| Su número de sorteo en San Martín hubiera salido más bajo | En *ese* sorteo entra. El sorteo es independiente por colegio: un mal número ahí **no dice nada** de sus chances en los demás |
| Reordenar su lista / postular otro día / "esconder" San Martín más abajo | **Nada.** (Strategy-proofness.) |

#### B. La traducción para el usuario (según HAX / PAIR-ET / NNG-XAI / BROOK / RISK-NUM)

Texto de referencia para la explicación contextualizada de `/seguimiento` en la **condición A** ("¿Por qué no quedaste en el Colegio San Martín?"). **Implementado en `SeguimientoPage.generarExplicacion` el 2026-09-09** (bitácora Bloque U): reemplazó la línea genérica anterior (*"…tenía más postulantes con prioridad mayor o no había vacantes…"*) por esta versión específica del colegio no obtenido, con formato de frecuencia "X de cada 100" y el cierre BROOK; la tarjeta "¿Qué significa no quedar en tu primera opción?" sumó el párrafo de strategy-proofness. El texto en producción es una adaptación fiel de lo que sigue:

> Al **Colegio San Martín postularon más familias que los cupos** que tenía para 4.º básico. Cuando eso pasa, la ley define un orden para repartir los cupos: primero las familias con un vínculo con ese colegio —un hermano o hermana matriculado/a, ser hijo/a de un funcionario/a, o haber sido estudiante ahí— y la reserva del 15 % para estudiantes prioritarios/as. **Tu familia no tiene ninguno de esos vínculos con el Colegio San Martín**, así que competías por los cupos que quedaban después.
>
> Entre las familias que están en tu misma situación —sin un vínculo con ese colegio—, el colegio elige con un **sorteo propio, el mismo para todas**. Esta vez tu número no alcanzó uno de esos cupos. Ese sorteo vale **solo para el Colegio San Martín**: no afectó tus posibilidades en los otros colegios de tu lista.
>
> Por eso el sistema **siguió con tu lista** y te asignó al **Colegio Los Andes**, tu segunda opción, donde tienes a tu hija matriculada y por eso tenías prioridad.
>
> El sistema reparte los cupos que existen: **no puede crear cupos nuevos en un colegio ni asegurar la primera opción cuando hay más familias que vacantes.**

**Versión de una línea** (chip / resumen): *"Al Colegio San Martín postularon más familias que cupos, y las que tienen un vínculo con ese colegio o la reserva del 15 % van primero por ley. Tu familia no tenía ese vínculo ahí."*

**El dato crudo al lado** (HAX G2 — que se vea de qué está hecho el número): *"Colegio San Martín · 4.º básico · demanda alta. El año pasado postularon 71 familias para 24–28 cupos. Sin un vínculo con este colegio, ≈ 26 de cada 100 familias en tu situación obtuvieron cupo."*

#### C. Por qué está redactado así (mapeo a las guías)

| Elección de redacción | Guía | Razón |
|---|---|---|
| "postularon más familias que cupos" como **primera** frase | BROOK · HAX G11 | La causa estructural (escasez) va antes que nada; dirige la lectura a la demanda real, no al algoritmo |
| "la ley define un orden" / "van primero **por ley**" | HAX G11 · justicia | El resultado es una regla pública, no una decisión del colegio ni del software |
| "**tu familia no tiene** ninguno de esos vínculos **con el Colegio San Martín**" | HAX G5/G6 · PAIR-ET | Hecho verificable y acotado a *ese* colegio; no dice "no calificaste" ni "apuntaste alto" — nada que suene a juicio o carencia de la familia |
| "el colegio elige con un **sorteo propio, el mismo para todas**" | precisión del mecanismo + justicia | Se nombra el sorteo (es el desempate real), pero enmarcado como **trato igual entre iguales**, que es su función; no como "mala suerte" |
| "Ese sorteo vale **solo para el Colegio San Martín**… no afectó tus posibilidades en los otros" | PAIR-ET (no inducir acción errónea) · strategy-proofness | Corta el mito del riesgo estratégico y la sensación de "el azar me arruinó todo" |
| "el sistema **siguió con tu lista** y te asignó a…" | HAX G1 · NNG-XAI | Describe el proceso ("recorre la lista", "asigna al primero donde alcanzas"), no una intención; muestra que el sistema **sí hizo algo** por la familia |
| "**no puede crear cupos** ni asegurar la primera opción" | BROOK | Comunicar qué **no** puede hacer el sistema → la frustración va a la escasez, no a la arbitrariedad |
| "**≈ 26 de cada 100**" en vez de "26 %" | RISK-NUM | Formato de frecuencia para numeracidad básica-intermedia |
| Sin "tómbola", sin "te tocó", sin "lamentablemente" | encuadre 2026-09-07 (bitácora) | "Sorteo" solo donde describe el mecanismo; nunca como encuadre del resultado |

#### D. Relación con el estudio comparativo

Esta explicación completa (ya en producción, ver Bloque U de la bitácora) es **exclusiva de la condición A**. La **condición B** solo muestra "quedaste en el Colegio Los Andes", sin el porqué (implementado el 2026-09-09, Bloque V: `esControl` oculta la tarjeta completa en `/seguimiento`). El ítem **C4** ("puedo explicar con mis palabras por qué era poco probable San Martín"), **C5** ("entendí por qué el resultado fue ese") y **J2** ("me pareció justa la razón") miden si esta traducción funciona; la pregunta abierta **A1** y el ítem **F3** capturan si el argumento de strategy-proofness caló. El único uso de "sorteo" en el texto —el desempate entre familias sin vínculo, enmarcado como trato igual— es coherente con el criterio de microcopy del 2026-09-07 (se evita en el encuadre y la predicción; se conserva donde describe el mecanismo).

## 4. Nota de alcance: alta exigencia académica

Esta cuota (30–85 % de cupos en colegios preseleccionados por Mineduc, solo 7.º básico/1.º medio, con examen) no está representada porque ningún colegio de `colegios.js` tiene esa modalidad hoy, y la persona Daniela no prioriza ese tipo de establecimiento. Queda como extensión opcional — requeriría agregar un colegio con esa modalidad al set de datos.

## 5. Gap detectado en los datos del prototipo — RESUELTO

El gap original: `colegios.js` no distinguía `funcionario` ni `exalumno` como prioridades independientes. **Resuelto** (bitácora Bloque G, 2026-08-26): `colegios.js` tiene el campo `casoPrioridades` por colegio (Los Andes → `['hermano']`, Villa del Sol → `['funcionario']`, República de Chile → `['exalumno']`, el resto `[]`), y la lógica resuelve el nivel de prioridad **por establecimiento** (`nivelPrioridadEnColegio`). En el flujo, al agregar cada colegio, la prioridad de la familia se **pre-siembra y se muestra de solo lectura** ("el sistema lo detecta, no lo pregunta", bitácora Bloque N4): San Martín, Simón Bolívar y Los Quillayes muestran *"No detectamos ningún vínculo con {colegio}. Sin una prioridad aquí, tu cupo depende de cuántas familias pidan este colegio y de las vacantes que tenga"* (microcopy 2026-09-07, antes decía "entras solo por el sorteo"). Esto es **fidelidad al SAE real** (el sistema recupera las prioridades, no las pregunta) y se conserva en **ambas condiciones**.

## 6. Diseño del estudio comparativo

### 6.1 Las dos condiciones

Asignación **entre-sujetos**: cada participante hace la tarea en **una sola** condición.

- **Condición A — UX que explica el algoritmo (tratamiento).** El prototipo actual, con toda su capa de explicabilidad construida sobre `investigacion_ux_guide_ai_systems.md` (HAX / PAIR-ET / NNG-XAI / BROOK / RISK-NUM): el módulo `/algoritmo` y el simulador paso a paso, el recuadro *"¿qué hace el orden de tu lista?"* (`ResultadoProvisional`), la probabilidad por colegio con su fundamento y su visual "X de cada 100" (`ProbabilidadVisual`), la explicación contextualizada *"por qué te asignaron este colegio"* de `/seguimiento`, y el recuadro inicial *"cómo se decide tu resultado"*.
- **Condición B — control, sin explicación (proxy del SAE real).** Una versión del mismo flujo que **oculta toda esa capa** (bitácora §7.5, D4): sin `/algoritmo`, sin resultado provisional, sin probabilidades ni "X de cada 100", sin el "por qué te asignaron", sin el recuadro "cómo se decide". Queda el flujo pelado —buscar, armar la lista en el orden dado, confirmar, descargar el comprobante, ver el colegio asignado **a secas**— anclado a la vitrina / SAE real ya documentado (`investigacion_vitrina_sae.md`, `analisis_video_paso_a_paso_sae.md`). **No** debe ser una versión deliberadamente pobre (bitácora §7.3, Cuidado 1): las partes que son fidelidad al SAE real (panel de condiciones que el sistema ya conoce, prioridad por colegio de solo lectura, gates de aceptación) se conservan.

> **Dependencia — resuelta.** La condición B (fase **F3** del roadmap, bitácora §7.2) **está implementada desde el 2026-09-09** (bitácora Bloque V): un contexto `ModoEstudioContext` (`esControl`) que cada pieza de explicabilidad consulta para ocultarse o simplificarse, activado por la pantalla `/estudio` del moderador. `asignacion.js`/`simulacionSae.js` no se tocaron, así que el resultado de asignación es idéntico en A y B. Antes del piloto queda recorrer B end-to-end en 375 px y confirmar que es un proxy fiel del SAE real (`f3_modo_control_inventario.md` §4).

### 6.2 Tareas dirigidas

Ocho tareas que recorren el flujo completo. `[A]` = solo condición con explicación · `[B]` = solo control · sin marca = igual en ambas. El moderador **conoce la condición** de cada participante (bitácora §7; no hay cegado del moderador) y sigue la rama correspondiente del guion.

Pre-tarea (antes de la #1): ítem de línea base **B1** sobre la percepción "tómbola" (§8.1) — pasa a **covariable**.

1. **Identificarse** como apoderada de Sofía (vía ClaveÚnica simulada) y marcar la casilla *"declaro ser apoderada legal"*.
   `[A]` además: leer el panel *"esto es lo que el sistema ya sabe de tu hijo/a"* — probe: *"¿qué te dice la página que ya sabe? ¿te calza con la tarjeta de familia?"*.
   `[B]` ese panel no aparece.
2. **Agregar los 6 colegios en el orden exacto de la tarjeta** (§3): San Martín · Los Andes · República de Chile · Villa del Sol · Simón Bolívar · Los Quillayes. Se entrega el orden por escrito; **la persona no lo elige ni lo reordena** — el moderador lo recuerda si intenta cambiarlo.
3. **Vincular la postulación familiar en bloque con Mateo:** marcar que el hermano también postula e ingresar sus datos básicos (nombre, RUN, nivel). El prototipo aclara que la postulación de Mateo va aparte y que en la sesión se completa **solo la de Sofía**.
4. **Revisar la lista antes de confirmar.**
   `[A]` leer lo que la página muestra de cada colegio (demanda, postulantes/vacantes, probabilidad) y el recuadro *"¿qué hace el orden de tu lista?"*; pensar en voz alta sobre San Martín en 1.ª posición con ≈26 %. Probe: *"¿qué entiendes de lo que muestra la página aquí?"*.
   `[B]` revisar la lista tal como la muestra el proxy, sin esa capa. Probe: *"¿qué esperas que pase con esta lista?"*.
5. **Confirmar la postulación y descargar el comprobante.**
6. **Predecir el resultado (antes de verlo).** Probe: *"¿en qué colegio crees que va a quedar Sofía, y por qué?"*.
   `[A]` ya vio la probabilidad y el resultado provisional → mide si conectó esa información con su predicción.
   `[B]` predicción a ciegas → línea base de qué se puede inferir sin la capa de explicación.
7. **Ver el resultado y reaccionar.** Resultado = **Colegio Los Andes, 2.ª preferencia** (por el hermano).
   `[A]` leer también la explicación *"por qué te asignaron este colegio"*. Probes: *"¿esperabas esto? ¿entiendes por qué no quedaste en San Martín? ¿esa explicación te hace sentido?"*.
   `[B]` solo se ve el colegio asignado. Probes: *"¿esperabas esto? ¿por qué crees que pasó? ¿te queda claro por qué no quedaste en San Martín?"*.
8. **Cuestionario post-tarea** (§8): batería Likert de 13 ítems (comprensión / confianza / percepción de justicia) —**la misma en ambas condiciones; se compara entre grupos**— y las preguntas abiertas (§8.3).

## 7. Metodología de la prueba

### 7.1 Participantes y asignación a condición

- **N objetivo: ≈30** (~15 por condición). Un diseño entre-sujetos con dos grupos necesita más participantes que una prueba formativa; el "al menos 30" recoge la indicación de la profesora guía. El estudio previo del mismo equipo (maqueta Figma del módulo de explicación, Cap. 3 §3.2) usó 10 personas en un diseño de un solo grupo.
- **Asignación a condición:** por número de participante, definida antes de reclutar, para equilibrar los grupos en tamaño y en la covariable de experiencia previa con el SAE. Implementado en la pantalla `/estudio`: `condicionDe(n)` = impares → A, pares → B; se ajusta ahí si se decide estratificar por la covariable.
- **Criterios de inclusión**, alineados con la persona Daniela González: (a) madre, padre o apoderado/a legal con al menos un hijo/a en edad de postular a educación parvularia, básica o media en Chile (no es necesario que postule este año — el caso usa datos ficticios); (b) autopercepción de alfabetización digital básica-intermedia — excluir explícitamente a personas con perfil técnico/UX que evaluarían la interfaz en vez de vivir el caso como usuario final; (c) acceso principal a internet vía smartphone.
- **Covariable:** experiencia previa con el SAE real (ya postuló alguna vez / nunca). Se registra y se procura balancear entre condiciones; junto con B1 permite leer los resultados en contexto.
- **Reclutamiento:** por conveniencia/bola de nieve (red personal, no muestreo probabilístico) — limitación metodológica que se declara explícitamente en el Cap. 3, igual que en el estudio Figma previo.
- **Consentimiento y ética:** el caso es ficticio y no se recogen datos personales sensibles reales, por lo que se prevé un consentimiento informado simple con autorización de grabación de pantalla y audio. **Un estudio comparativo con N≈30 refuerza la conveniencia de pasar por el comité de ética de la UTFSM** — queda por confirmar si es exigible para una memoria de título (bitácora §7.3).

### 7.2 Modalidad y duración

Sesión moderada individual, presencial, ~45–55 minutos:

| Bloque | Duración | Contenido |
|---|---|---|
| Bienvenida y consentimiento | 5 min | Explicar el propósito sin adelantar el caso San Martín ni la existencia de dos condiciones |
| Cuestionario pre-tarea | 3–5 min | Perfil breve + covariable (experiencia SAE) + ítem de línea base B1 (§8.1) |
| Tareas dirigidas 1–7 (§6.2; la tarea 8 es el cuestionario, bloque siguiente) | 20–25 min | Pensar en voz alta; el moderador sigue la rama A o B según la condición y no ayuda salvo bloqueo total |
| Cuestionario post-tarea | 10 min | Batería Likert (§8.2) + preguntas abiertas (§8.3) |
| Cierre | 5 min | Agradecimiento |

Presencial es preferible a remoto: permite observar el uso real en móvil (persona Daniela) y el pensar en voz alta. Remoto con pantalla compartida es la alternativa si la logística no lo permite.

### 7.3 Guion del moderador (esqueleto)

1. Contexto neutro: *"Vas a simular la postulación de una hija al sistema de admisión escolar, siguiendo una lista de colegios que te voy a entregar. No hay respuestas correctas, nos interesa cómo lo interpretas tú."* Sin mencionar San Martín, las prioridades, el objetivo de observar el mito del riesgo estratégico ni que existe una segunda condición.
2. Entregar el perfil de la familia Muñoz González (§2) y **la lista de 6 colegios en su orden** (§3) como tarjeta física o pantalla aparte, para que la persona la lea a su ritmo. Dejar claro que **debe respetar ese orden**.
3. Ejecutar las tareas 1–7 de §6.2 **por la rama que corresponda a la condición** del participante, con los probes de pensar en voz alta indicados ahí.
4. Probe obligatorio al revisar la lista (tarea 4): registrar si la persona intenta reordenar la lista y por qué — sin permitírselo, pero anotando la intención (es señal del mito del riesgo estratégico).
5. Probe obligatorio al ver el resultado (tarea 7): *"¿esperabas este resultado? ¿por qué crees que pasó?"* — antes de que la persona lea cualquier explicación (condición A), para comparar su hipótesis con el texto.
6. Cuestionario post-tarea (§8) y cierre.

**El texto completo, palabra por palabra, que Diego lee en cada sesión está en `docs/investigacion/guion_moderador_prueba_usabilidad.md` (y su PDF), con las dos ramas A/B — este esqueleto queda como referencia de estructura.**

## 8. Instrumento de medición

El instrumento es **el mismo para ambas condiciones**; el análisis es una **comparación entre grupos** (A vs. B) en cada constructo, con B1 y la experiencia previa como covariables. Algunos ítems presuponen información que solo la condición A recibe (probabilidades, explicación del resultado): eso es **deliberado** — una puntuación más baja en B es precisamente la señal que el estudio busca.

### 8.1 Línea base / covariable (pre-tarea)

> **B1.** Antes de usar esta plataforma, ¿qué tan de acuerdo estás con esta frase? *"El sistema de admisión escolar es como una tómbola: no se entienden bien sus reglas."* (1 = Totalmente en desacuerdo — 5 = Totalmente de acuerdo)

Se registra también la **experiencia previa con el SAE real** (postuló alguna vez / nunca).

### 8.2 Post-tarea (escala Likert 1–5, Totalmente en desacuerdo → Totalmente de acuerdo)

Tres constructos, alineados con la pregunta de investigación del Cap. 1 (comprensión, confianza, percepción de justicia).

**Comprensión**
- **C1.** Entendí para qué sirve cada uno de los pasos de la postulación.
- **C2.** Entendí por qué mis posibilidades de quedar eran distintas en cada colegio de la lista.
- **C3.** Entendí que tener un vínculo con un colegio (hermano/a matriculado/a, ser hijo/a de funcionario/a o exalumno/a) da prioridad **solo en ese colegio**, no en todos.
- **C4.** Puedo explicar con mis propias palabras por qué era poco probable quedar en el Colegio San Martín.
- **C5.** Entendí por qué el resultado que vi fue ese, y no otro.

**Confianza**
- **F1.** Confío en que el sistema asigna a los estudiantes siguiendo reglas, no al azar.
- **F2.** Sentí que se podía postular con confianza al colegio preferido (Colegio San Martín) aunque la familia no tuviera ninguna ventaja ahí.
- **F3.** Si yo hubiera armado la lista, no me habría dado miedo poner primero el colegio que más quiero, aunque tuviera pocas posibilidades.
- **F4.** Si el sistema no asignara al estudiante en ningún colegio de la lista, confío en que la plataforma explica qué pasa después.
- **F5.** El resultado que vi fue coherente con lo que la plataforma me había mostrado antes de confirmar.

**Percepción de justicia**
- **J1.** Me pareció justo que el sistema use un sorteo aleatorio para desempatar entre postulantes con la misma prioridad.
- **J2.** Me pareció justa la razón por la que no se quedó en el Colegio San Martín.
- **J3.** Sentí que todas las familias juegan con las mismas reglas, tengan o no una prioridad legal.

### 8.3 Preguntas abiertas

- **A1 (falso riesgo estratégico).** *"Si tú hubieras armado esta lista, ¿la habrías ordenado distinto? En particular, ¿dónde habrías puesto el Colegio San Martín, y por qué?"*
- **A2 (hallazgos fuera del instrumento).** *"¿Hubo algo que te generó desconfianza o que no entendiste, aunque no te lo haya preguntado recién?"*

### 8.4 Hipótesis

Todas se contrastan **entre condiciones** (A = con capa de explicación del algoritmo; B = control sin esa capa), sobre el **mismo caso, la misma lista y el mismo desenlace** (Colegio Los Andes en 2.ª preferencia).

- **H1 (comprensión).** Las personas de la condición A puntúan más alto en el constructo de comprensión (C1–C5) que las de la condición B. Es la hipótesis principal: la capa de explicación está construida precisamente para eso.
- **H2 (confianza).** Las personas de la condición A puntúan más alto en el constructo de confianza (F1–F5) que las de la condición B, y en particular reportan menos miedo a ubicar primero el colegio preferido sin ventaja (F2, F3).
- **H3 (percepción de justicia).** Se espera una diferencia **menor o nula** a favor de A en el constructo de justicia (J1–J3). La literatura de gestión de expectativas (Springer & Whittaker; Brookings) sugiere que explicar un resultado mejora la comprensión y la confianza sin necesariamente cambiar cuán *justo* se percibe *no haber obtenido* el colegio preferido. H3 se plantea como hipótesis exploratoria, no direccional fuerte.
- **H4 (mito del riesgo estratégico — cualitativa).** En las preguntas abiertas (A1) y en el probe de la tarea 4, las personas de la condición A verbalizan con más frecuencia que ubicar primero el colegio preferido **no** perjudica, y menos frecuentemente la intención de "esconderlo" más abajo, que las de la condición B.

**Covariables:** B1 (percepción "tómbola" pre-tarea) y experiencia previa con el SAE real. No se usan para "corregir" el efecto sino para leer los resultados en contexto (p. ej., si el efecto de A se concentra en quienes llegaban con más desconfianza).

### 8.5 Plan de análisis

El N es pequeño para estándares inferenciales (≈15 por condición); el análisis es **principalmente descriptivo y cualitativo**, con pruebas no paramétricas como apoyo y con tamaños de efecto reportados siempre junto al valor *p*.

**Cuantitativo (Likert 1–5, §8.2):**
1. **Descriptivo por ítem y por constructo**, por condición: mediana, rango intercuartílico, y distribución de respuestas (gráfico de barras apiladas 1–5). El puntaje de constructo es la media de sus ítems por participante (comprensión: C1–C5; confianza: F1–F5; justicia: J1–J3), reportada como media ± DE y como mediana [RIC].
2. **Comparación entre condiciones:** prueba **U de Mann-Whitney** sobre el puntaje de cada constructo (A vs. B), y sobre los ítems individuales de mayor interés teórico (C4, C5, F2, F3, J2). Tamaño de efecto: **r = Z/√N** (o *rank-biserial*), interpretado con los cortes convencionales 0,1 / 0,3 / 0,5.
3. **Covariables:** análisis estratificado —repetir la comparación A vs. B **por separado** en el grupo "ya postuló al SAE" y en "nunca postuló", y en tramos de B1 (bajo: 1–2 / alto: 4–5)— en vez de un ANCOVA, por el tamaño de muestra. Si algún subgrupo queda con <5 personas por celda, se reporta solo de forma descriptiva.
4. **Consistencia interna** de cada constructo: alfa de Cronbach (o McDonald's ω), reportado como referencia, no como criterio de exclusión de ítems dado el N.
5. **B1 pre/nada:** B1 se mide **solo antes** de la tarea (es covariable, no medida de cambio). Un eventual efecto sobre la percepción "tómbola" se lee de forma indirecta vía J1/J3 y la pregunta abierta A2, no como pre-post.

**Cualitativo (pensar en voz alta + A1/A2 + probes de las tareas 4 y 7):**
6. **Codificación temática** de las transcripciones, con un libro de códigos derivado de los tres constructos + categorías emergentes. Foco: (a) cómo la persona explica *por qué* no quedó en San Martín; (b) presencia/ausencia del razonamiento de "esconder" el colegio preferido (mito estratégico); (c) momentos de confusión y qué elemento de la interfaz los origina o los resuelve.
7. **Doble codificación** de una submuestra (≈20–30 % de las sesiones) por una segunda persona y acuerdo entre codificadores (κ de Cohen o porcentaje de acuerdo) como control de confiabilidad.
8. **Triangulación:** los hallazgos cualitativos se contrastan con los cuantitativos por constructo (p. ej., si A puntúa más alto en C4 y además verbaliza mejor el porqué de San Martín).

**Criterio de "resultado positivo" para la memoria:** que la condición A muestre una ventaja **consistente** (misma dirección en el descriptivo, la prueba no paramétrica y la evidencia cualitativa) en comprensión (H1) y, deseablemente, en confianza (H2), reconociendo explícitamente si la percepción de justicia (H3) no se mueve.

## 9. Pendientes y decisiones

**Decisiones ya tomadas (bitácora §7.5, 2026-09-06):** orden de lista fijo estricto (D1); semilla `SEED_CASO` única, sin variación por participante (D2); resultado canónico = San Martín 1.º → Colegio Los Andes en 2.ª preferencia (D3); el modo control oculta toda la capa de explicabilidad (D4).

**Recomendaciones firmes (para llevar a la reunión — el autor decide con la profesora):**
- **Alta exigencia académica (§4): fuera de alcance.** Ningún colegio del set tiene esa modalidad, la persona Daniela no prioriza ese tipo de establecimiento, y añadirla no aporta al contraste A/B (el caso ya cubre los tres grupos de prioridad legal). Se declara como limitación y línea futura en la memoria.
- **Paso de "resultado inmediato": herramienta de la prueba, no punto del plan de mejora.** Es un artefacto para poder observar la reacción al resultado en la misma sesión (en el SAE real tarda meses); no es una mejora de UX del SAE. Se mantiene comentado como "extensión fuera de la matriz"; la cifra del plan no se toca. No se crea una sección S23.
- **Comité de ética UTFSM:** el consentimiento informado simple está redactado (§7.1) y el caso no recoge datos personales sensibles reales. **Acción del autor antes de reclutar:** consultar a la Dirección de la carrera / al comité si el trámite es exigible para una memoria; si lo es, presentar este documento + el guion + el consentimiento. No bloquea la aprobación del diseño.

**Antes de la ejecución (no de la aprobación del diseño):**
- **F3 (modo control) — ✅ implementado el 2026-09-09 (bitácora Bloque V).** Se resolvió como un contexto `ModoEstudioContext` (`esControl`, de `?modo=control` + `sessionStorage`) que cada pieza de explicabilidad consulta; la asignación de condición en terreno la hace la pantalla `/estudio` (número de participante → `condicionDe(n)`). `asignacion.js`/`simulacionSae.js` intactos → resultado idéntico en A y B. **Queda:** recorrer B end-to-end en 375 px antes del piloto (chequeo de "proxy fiel", `f3_modo_control_inventario.md` §4).

**Re-sincronización — estado 2026-09-09:**
- ✅ `guion_moderador_prueba_usabilidad.md` (+ PDF) — reescrito a la lista fija + ramas A/B + 8 tareas + duración 45–55 min.
- ✅ `guion_participante_prueba_postulacion.md` v3 (+ PDF) — tarjeta de familia + los 6 colegios en el orden canónico; se quitó "ordena como prefieras".
- ✅ `material_prueba_usabilidad_postulacion.md` (+ PDF, **nuevo**) — cuadernillo del participante: consentimiento, cuestionario pre-tarea (P1 experiencia SAE + B1), tarjeta de familia sin SEP/PIE, lista fija, cuestionario post-tarea (C1–C5 / F1–F5 / J1–J3 + A1/A2). Reemplaza el material de agosto que asumía familia SEP+PIE.
- ✅ Este `.md` — PDF regenerado (`caso_estudio_prueba_usabilidad_postulacion.pdf`, 2026-09-09). *(La tabla de estado y §6.1/§9 se actualizaron el 2026-09-09 tras implementar F3 — Bloque V; conviene regenerar el PDF de nuevo.)*
- ✅ **Condición B implementada en `sae-react/`** (2026-09-09, bitácora Bloque V): `context/ModoEstudioContext.jsx` + `pages/EstudioPage.jsx` (`/estudio`) + cableado de `esControl` en Navbar / `AlgoritmoPage` / `InicioPage` / `ProcesoPage` / tour / `PostulacionPage` / `SeguimientoPage` / `ColegioPage`. `lint`/`build`/`test` (16/16) limpios; A y B verificados en navegador.
- ✅ `docs/planificacion/mapa_resultados_caso_munoz_gonzalez.md` — nota al inicio: el escenario vigente para el estudio es el canónico (orden fijo); la enumeración de recorridos queda como material de respaldo.
- ⚠️ `proyecto-tesis/capitulos/03_metodologia.tex` §3.5 — **`writing-agent`:** reescribir de "prueba formativa N=8" a "estudio comparativo entre-sujetos N≈30" (usar §6–§10 de este documento). La descripción del caso y del simulador ya se corrigió el 2026-09-08. Prompt en `docs/planificacion/prompt_pendientes_revision_caso_sin_sep.md`.

*Los PDF se generaron con `marked` + Chrome headless (`docs/investigacion/*.pdf`), no con pandoc/LaTeX; si se editan los `.md` hay que regenerarlos.*

**Ya resuelto (antes bloqueaba):**
- ~~`colegios.js` no distingue `funcionario`/`exalumno`~~ → resuelto, ver §5.
- ~~¿un solo grupo de N=8 o variantes?~~ → superado por la reorientación a estudio comparativo entre-sujetos N≈30.
- ~~verificar `npm run lint`/`npm run build`~~ → validación automatizada: `npm run lint`, `npm run build` y `npm test` (**16 tests** que ejercitan `asignacion.js` + `simulacionSae.js` + `colegios.js` con este caso) corren limpios el 2026-09-09; guardarraíles de regresión sobre `PARAMS_POBLACION`, iteraciones Monte Carlo, `SEED_CASO`, el escenario canónico y el fallback sin cupo.

## 10. Amenazas a la validez y limitaciones

Se declaran explícitamente en la memoria (Cap. 3 §3.5 y Cap. 5).

**De validez interna**
- **Moderador no ciego a la condición.** El moderador conoce si el participante está en A o B y sigue la rama correspondiente del guion. Mitigación: guion de lectura textual, probes idénticos en lo que se puede, no ayudar salvo bloqueo total, y —de ser posible— que una segunda persona codifique una submuestra de las grabaciones.
- **Ítems que presuponen información solo de A.** Varios ítems Likert (C2, C4, C5, F5, J2) preguntan por algo que solo la condición A muestra en pantalla (probabilidades, explicación del resultado). Es **deliberado**: una puntuación más baja en B es la señal que el estudio busca, no un defecto del instrumento. Se interpreta como "B no tuvo los elementos para responder alto", no como "B entendió menos con la misma información".
- **Efecto de demanda / deseabilidad social.** El encuadre neutro ("evalúo la página, no a ti") y el anonimato de la grabación buscan reducirlo; aun así, se reporta como limitación.
- **Un solo caso, un solo desenlace.** Todo el estudio gira en torno a "no obtuve mi 1.ª opción, quedé en la 2.ª por el hermano". No se puede generalizar a "quedé en mi 1.ª opción" ni a "no quedé en ninguna"; esos escenarios quedan como línea futura.

**De validez externa**
- **Muestra por conveniencia / bola de nieve**, no probabilística. Los resultados describen a estas ~30 personas, no a la población de apoderados del SAE. Se declara igual que en el estudio Figma previo.
- **Prototipo, no el SAE real.** El flujo es fiel en inputs pero la asignación la produce un **simulador didáctico** (Monte Carlo DA-por-colegio, `simulacionSae.js`), no el mecanismo real; los `%` son salida de ese modelo con parámetros de población documentados, no probabilidades validadas del SAE. La condición B se ancla a la vitrina / SAE real documentado, pero sigue siendo un proxy.
- **Sesión de laboratorio, presencial y guiada**, distinta de una postulación real hecha en casa, sola, bajo presión de plazo.

**De constructo**
- La "comprensión" se mide por autorreporte Likert + verbalización, no con un test de conocimiento objetivo. C4 ("puedo explicar con mis palabras…") y la codificación cualitativa de A1/A2 acercan la medida a comprensión demostrada, pero no la vuelven objetiva.
- La percepción de "tómbola" (B1) se mide con un solo ítem; es covariable, no constructo.

**Estadísticas**
- N≈15 por grupo → potencia baja para efectos pequeños; el análisis es **descriptivo + no paramétrico + cualitativo**, con tamaños de efecto siempre reportados. No se hará corrección por comparaciones múltiples formal; se prioriza la **consistencia** del patrón entre las tres fuentes de evidencia (§8.5).
