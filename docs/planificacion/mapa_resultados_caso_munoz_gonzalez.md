# Mapa de resultados del caso Muñoz González

**Fecha:** 2026-09-03 (reescrito para el modelo nuevo — bitácora Bloque R)
**Para qué:** entender qué colegio puede quedar asignado según el orden que elija el/la participante, para el diseño de tareas de la prueba de usabilidad y para el `writing-agent`.
**Estado del caso:** familia sin cuota SEP ni PIE (Bloque O). Nivel: 4° básico.

---

## Qué modelo describe esto

`src/utils/simulacionSae.js` + `calcularResultado` de `asignacion.js`. Es una **simulación DA-por-colegio**:

- Para cada colegio, se simula la competencia por sus cupos: `postulantesAnterior` competidores sintéticos (dato real de `colegios.js`) con tramos de prioridad muestreados de `PARAMS_POBLACION`, la **cuota SEP del 15 %** como bloque reservado (fase 1) y el pozo general (fase 2), con un **sorteo aleatorio por colegio**.
- El **`%` mostrado** es Monte Carlo: 1000 sorteos → fracción en que la familia queda. Es **estable** (semilla fija) y **no depende del orden de la lista**.
- El **colegio asignado** sale de **un** recorrido determinista de la lista con `SEED_CASO`: la familia "propone" a su 1.ª opción; si ese sorteo no la sienta, propone a la 2.ª; y así.

**⚠️ No es la Aceptación Diferida multi-colegio completa:** no modela que los demás postulantes también tienen listas y se desplazan entre colegios. Para el resultado de *una* familia, con los otros como demanda fija de cada colegio, la aproximación es buena. Sin cuota PIE ni alta exigencia académica. Los parámetros `pHermano`/`pFuncionario`/`pExalumno` son estimaciones (ver Bloque R).

---

## Probabilidad por colegio (familia del caso, 4° básico)

| # | Colegio | Vínculo | demanda · sobredemanda | **`%`** | lectura |
|---|---|---|---|---|---|
| 1 | Colegio Los Andes | hermano/a | alta · 3,4× | **99 %** | casi seguro |
| 3 | Escuela República de Chile | exalumno/a | baja · 0,8× | **99 %** | casi seguro (colegio no sobredemandado → la ley obliga a admitir a todos) |
| 5 | Colegio Villa del Sol | funcionario/a | alta · 2,9× | **99 %** | casi seguro |
| 4 | Liceo Técnico Simón Bolívar | — | media · 1,7× | **50 %** | moneda al aire |
| 6 | Escuela Básica Los Quillayes | — | media · 1,8× | **46 %** | moneda al aire |
| 2 | **Colegio San Martín** | — | alta · 2,7× | **26 %** | el "colegio en mente": probable que **no** quede |

**Idea central:** tener cualquier prioridad legal (hermano/a, funcionario/a, exalumno/a) deja el resultado casi asegurado — es fiel, el SAE reserva a esos grupos para que no dependan del sorteo. **Sin vínculo, manda la demanda:** alta → 26 %, media → ~48 %.

---

## Qué decide el orden de la lista

- El `%` de cada colegio **no cambia** con su posición (strategy-proofness — verificado por test).
- Lo que el orden decide es **en cuál colegio caés**: la familia recorre su lista y para en el primero donde el sorteo la sienta.
- Con `SEED_CASO`, cada colegio tiene un desenlace determinista para *ese* sorteo:
  - Los Andes / República / Villa del Sol → **siempre** sientan (99 %).
  - San Martín → **no** sienta (cayó en el 74 % que no queda).
  - Simón Bolívar / Los Quillayes → **sí** sientan con `SEED_CASO` (cayeron en el ~48 % que sí queda). *Ojo:* esto es un sorteo puntual; su `%` mostrado es ~48 %.

### Recorridos de ejemplo (con `SEED_CASO`)

| Lista | Asignación | Preferencia |
|---|---|---|
| `Los Andes · San Martín · …` | Colegio Los Andes | 1.ª |
| `San Martín · Los Andes · …` | Colegio Los Andes | 2.ª (San Martín se salta) |
| `San Martín · Simón Bolívar · Los Quillayes · República · …` | **Liceo Técnico Simón Bolívar** | 2.ª |
| `Los Quillayes · Los Andes · …` | **Escuela Básica Los Quillayes** | 1.ª |
| `San Martín · San Martín-only…` (lista de 1) | fallback: San Martín, con aviso "podrías quedar sin asignación" | 1.ª |

**Diferencia clave con el modelo viejo:** antes Simón Bolívar y Los Quillayes tenían 60 % < umbral 65 → **nunca** se asignaban. Ahora, con demanda media, un/a sin-prioridad tiene ~48 % de chance real ahí, así que **sí pueden quedar** si van arriba en la lista — y su orden importa. San Martín (26 %) sigue siendo el que casi nunca queda.

---

## Respuestas puntuales

**¿Puede quedar en Escuela Básica Los Quillayes?**
Sí, con probabilidad real (~46 %) si va antes que un colegio con vínculo. Ej.: `Los Quillayes · Los Andes · …` → con `SEED_CASO` queda en Los Quillayes (1.ª opción). Pedagógicamente: "pusiste tu colegio de origen primero y esta vez el sorteo te favoreció".

**¿Puede quedar en Liceo Técnico Simón Bolívar?**
Igual que Los Quillayes (~50 %).

**¿Puede quedar en Colegio San Martín?**
Es poco probable (26 %). Con `SEED_CASO` no queda. Si en la prueba la persona lo pone 1.º, el desenlace esperado es que **no** quede y caiga a su siguiente opción con vínculo.

---

## Para el diseño de la prueba

- **Escenario A (esperado):** un colegio con vínculo como 1.ª opción → queda ahí (99 %).
- **Escenario B (el clave):** San Martín 1.º → no queda → cae a Los Andes en 2.ª preferencia. Observa la reacción a *no* obtener el colegio en mente y si la conecta con el 26 % que la página ya mostraba.
- **Escenario C (nuevo, más rico que antes):** una lista que mezcla colegios sin vínculo de demanda media (Simón Bolívar, Los Quillayes) → puede quedar en cualquiera de ellos según el orden, con ~50 % de chance cada uno. Enseña que el orden entre opciones "moneda al aire" sí decide cuál te toca.
- **Anti-patrón:** listar solo colegios sin vínculo → resultado incierto; si van todos de demanda alta (como San Martín), riesgo real de no-asignación.

## Para el `writing-agent`

Encuadrar como el **comportamiento del simulador del prototipo** y contrastarlo con la Aceptación Diferida real (`investigacion_algoritmo_sae.md §3.1`). Los parámetros de población son un supuesto metodológico documentado, parcialmente anclado a 2018 (`pSep`); la calibración con microdatos queda fuera de alcance. Ver bitácora Bloque R.
