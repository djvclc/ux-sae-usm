// Validación del flujo de postulación que se prueba con usuarios
// (caso de la familia Muñoz González — docs/investigacion/caso_estudio_prueba_usabilidad_postulacion.md).
//
// Desde 2026-09-03 (plan C) la probabilidad por colegio NO sale de una tabla fija:
// la estima `simulacionSae.js` con Monte Carlo sobre una simulación DA-por-colegio
// (multitud sintética + cuota SEP 15% como sub-escuela + sorteo por colegio), y el
// colegio asignado sale de un recorrido determinista de la lista con semilla fija
// (SEED_CASO). Todo es determinista, así que se pueden fijar valores exactos.
//
// Correr:  npm test        (desde sae-react/)
// Sin frameworks: runner nativo `node --test` + node:assert.

import test from 'node:test'
import assert from 'node:assert/strict'

import { colegiosById } from '../src/data/colegios.js'
import {
  calcularResultado,
  nivelPrioridadEnColegio,
  probabilidadCupo,
  probPorcentaje,
  tramoFamiliaEnColegio,
  prioridadLabels,
  PRIORIDADES_POR_COLEGIO,
} from '../src/utils/asignacion.js'
import {
  PARAMS_POBLACION,
  ITERACIONES_MONTE_CARLO,
  SEED_CASO,
  TRAMO_SIN_PRIORIDAD,
} from '../src/utils/simulacionSae.js'

/* ── IDs del caso (orden de la Tabla del §3 del caso de estudio) ── */
const LOS_ANDES = 1
const SAN_MARTIN = 2
const REPUBLICA = 3
const SIMON_BOLIVAR = 4
const VILLA_DEL_SOL = 5
const LOS_QUILLAYES = 6
const LISTA_CASO = [LOS_ANDES, SAN_MARTIN, REPUBLICA, SIMON_BOLIVAR, VILLA_DEL_SOL, LOS_QUILLAYES]
const NIVEL_CASO = '4° básico'

/* Reproduce PostulacionPage.jsx `agregar()`: al agregar un colegio se premarcan
   las prioridades específicas de la familia (colegio.casoPrioridades). */
function sembrarPrioridadesPorColegio(ids) {
  const mapa = {}
  for (const id of ids) {
    const claves = (colegiosById[id]?.casoPrioridades ?? []).filter((k) =>
      PRIORIDADES_POR_COLEGIO.includes(k),
    )
    if (claves.length) mapa[id] = Object.fromEntries(claves.map((k) => [k, true]))
  }
  return mapa
}
/* La familia del caso: NO prioritaria (sin SEP). */
const perfilCaso = (ids) => ({ prioritario: false, prioridadesPorColegio: sembrarPrioridadesPorColegio(ids) })

const probColegio = (id, perfil) =>
  probPorcentaje(probabilidadCupo(colegiosById[id], NIVEL_CASO, tramoFamiliaEnColegio(perfil, id)))

// ───────────────────────────────────────────────────────────────────────────────
test('el catálogo trae los 6 colegios del caso con la demanda y las prioridades documentadas', () => {
  const esperado = [
    { id: LOS_ANDES, nombre: 'Colegio Los Andes', demanda: 'alta', casoPrioridades: ['hermano'] },
    { id: SAN_MARTIN, nombre: 'Colegio San Martín', demanda: 'alta', casoPrioridades: [] },
    { id: REPUBLICA, nombre: 'Escuela República de Chile', demanda: 'baja', casoPrioridades: ['exalumno'] },
    { id: SIMON_BOLIVAR, nombre: 'Liceo Técnico Simón Bolívar', demanda: 'media', casoPrioridades: [] },
    { id: VILLA_DEL_SOL, nombre: 'Colegio Villa del Sol', demanda: 'alta', casoPrioridades: ['funcionario'] },
    { id: LOS_QUILLAYES, nombre: 'Escuela Básica Los Quillayes', demanda: 'media', casoPrioridades: [] },
  ]
  for (const e of esperado) {
    const col = colegiosById[e.id]
    assert.ok(col, `falta el colegio id ${e.id}`)
    assert.equal(col.nombre, e.nombre)
    assert.equal(col.demanda, e.demanda)
    assert.deepEqual(col.casoPrioridades, e.casoPrioridades)
  }
})

// ───────────────────────────────────────────────────────────────────────────────
test('probabilidad estimada por colegio (Monte Carlo, familia del caso) — snapshot calibrado', () => {
  // Valores deterministas del modelo actual. Si cambian PARAMS_POBLACION, SEED,
  // las iteraciones o los datos de vacantes/postulantes de colegios.js, actualizar.
  const perfil = perfilCaso(LISTA_CASO)
  assert.equal(probColegio(LOS_ANDES, perfil), 99)     // hermano/a, alta demanda 3.4x → casi seguro
  assert.equal(probColegio(SAN_MARTIN, perfil), 26)    // sin vínculo, alta demanda 2.7x → el "colegio en mente"
  assert.equal(probColegio(REPUBLICA, perfil), 99)     // exalumno/a, demanda baja → casi seguro
  assert.equal(probColegio(SIMON_BOLIVAR, perfil), 50) // sin vínculo, demanda media → moneda al aire
  assert.equal(probColegio(VILLA_DEL_SOL, perfil), 99) // funcionario/a, alta demanda → casi seguro
  assert.equal(probColegio(LOS_QUILLAYES, perfil), 46) // sin vínculo, demanda media → moneda al aire
})

test('propiedad: tener una prioridad legal deja la probabilidad "casi segura" (≥ 90)', () => {
  const perfil = perfilCaso(LISTA_CASO)
  for (const id of [LOS_ANDES, REPUBLICA, VILLA_DEL_SOL]) {
    assert.ok(probColegio(id, perfil) >= 90, `colegio ${id} deberia ser ≥ 90`)
  }
})

test('propiedad: sin vínculo + alta demanda = resultado genuinamente incierto (San Martín < 40)', () => {
  assert.ok(probColegio(SAN_MARTIN, perfilCaso(LISTA_CASO)) < 40)
})

test('propiedad: sin vínculo + demanda media = cerca de una moneda al aire (30–65)', () => {
  const perfil = perfilCaso(LISTA_CASO)
  for (const id of [SIMON_BOLIVAR, LOS_QUILLAYES]) {
    const p = probColegio(id, perfil)
    assert.ok(p >= 30 && p <= 65, `colegio ${id} = ${p}, fuera de 30–65`)
  }
})

test('nunca se muestra 0 % ni 100 %: probPorcentaje acota a [1, 99]', () => {
  assert.equal(probPorcentaje(1), 99)
  assert.equal(probPorcentaje(0), 1)
  assert.equal(probPorcentaje(0.5), 50)
  assert.equal(probPorcentaje(null), null)
})

// ───────────────────────────────────────────────────────────────────────────────
test('strategy-proofness: la probabilidad de un colegio NO cambia con su posición en la lista', () => {
  const primero = [SAN_MARTIN, LOS_ANDES, REPUBLICA]
  const enMedio = [LOS_ANDES, REPUBLICA, SAN_MARTIN]
  const ultimo = [LOS_ANDES, VILLA_DEL_SOL, REPUBLICA, SIMON_BOLIVAR, LOS_QUILLAYES, SAN_MARTIN]
  const valores = [primero, enMedio, ultimo].map((lista) => {
    const { detalles } = calcularResultado(lista, perfilCaso(lista), NIVEL_CASO)
    return detalles.find((d) => d.id === SAN_MARTIN).prob
  })
  assert.equal(valores[0], valores[1])
  assert.equal(valores[1], valores[2])
})

test('determinismo: dos llamadas identicas a calcularResultado dan exactamente lo mismo', () => {
  const a = calcularResultado(LISTA_CASO, perfilCaso(LISTA_CASO), NIVEL_CASO)
  const b = calcularResultado(LISTA_CASO, perfilCaso(LISTA_CASO), NIVEL_CASO)
  assert.equal(a.asignado.id, b.asignado.id)
  assert.deepEqual(a.detalles.map((d) => [d.id, d.prob, d.estado]), b.detalles.map((d) => [d.id, d.prob, d.estado]))
})

// ───────────────────────────────────────────────────────────────────────────────
test('paso 3: con la lista en el orden de la tabla, la familia queda en Los Andes (1ª opción, por hermano/a)', () => {
  const { error, asignado, detalles, sinAsignacionEnPreferencias } = calcularResultado(
    LISTA_CASO, perfilCaso(LISTA_CASO), NIVEL_CASO,
  )
  assert.equal(error, null)
  assert.equal(asignado.id, LOS_ANDES)
  assert.equal(asignado.idx, 1)
  assert.equal(asignado.nivel, 1)
  assert.equal(asignado.prioridadLabel, prioridadLabels[1])
  assert.equal(detalles[0].estado, 'asignado')
  assert.equal(sinAsignacionEnPreferencias, false)
})

test('paso 3 (escenario clave): si pone San Martín 1º, NO queda ahí y cae a Los Andes (2ª opción)', () => {
  const lista = [SAN_MARTIN, LOS_ANDES, REPUBLICA, SIMON_BOLIVAR, VILLA_DEL_SOL, LOS_QUILLAYES]
  const { asignado, detalles } = calcularResultado(lista, perfilCaso(lista), NIVEL_CASO)
  assert.equal(detalles[0].id, SAN_MARTIN)
  assert.notEqual(detalles[0].estado, 'asignado')
  assert.equal(asignado.id, LOS_ANDES)
  assert.equal(asignado.idx, 2)
})

test('lista vacía: calcularResultado devuelve error y sin asignación', () => {
  const r = calcularResultado([], {}, NIVEL_CASO)
  assert.equal(r.asignado, null)
  assert.ok(r.error)
  assert.deepEqual(r.detalles, [])
})

// ───────────────────────────────────────────────────────────────────────────────
// Auditoría 2026-09-08.
//
// (a) Fallback sin cupo: si NINGÚN colegio de la lista sienta a la familia en la
//     simulación, `calcularResultado` NO deja `asignado` en null: marca el colegio
//     de mayor `%` como `asignado` y levanta `sinAsignacionEnPreferencias: true`.
//     `SeguimientoPage.generarExplicacion(asignado, sinAsignacion)` DEBE ramificar
//     por esa bandera y no narrar "Quedaste en…" (no testeable aquí — es un
//     componente; sí se testea que la bandera exista y sea correcta).
test('fallback: San Martín solo/a en la lista → sin cupo, marca la bandera y NO deja asignado en null', () => {
  const r = calcularResultado([SAN_MARTIN], perfilCaso([SAN_MARTIN]), NIVEL_CASO)
  assert.equal(r.sinAsignacionEnPreferencias, true)
  assert.equal(r.asignado.id, SAN_MARTIN)      // fallback = el de mayor % estimado
  assert.equal(r.detalles[0].estado, 'asignado')
  assert.equal(r.asignado.prob, 26)            // el % NO se infla: sigue siendo el estimado
})

// (b) Sorteo del recorrido independiente por colegio: cada colegio se sortea con
//     su propia semilla derivada de (SEED_CASO, id), así su desenlace no depende
//     de qué colegios van antes en la lista (regla real del SAE, §3.2). Antes se
//     compartía un PRNG recorrido en orden de lista.
//     Con los 6 colegios del caso, el único que NO sienta en el recorrido es San
//     Martín (sin vínculo, demanda alta), así que no se puede "alcanzar" un
//     colegio en posición > 1 para observar su sorteo aislado. Se verifica lo
//     observable: San Martín 1.º nunca sienta y la familia cae a Los Andes,
//     sea cual sea el resto de la lista.
test('recorrido: San Martín 1.º nunca sienta, sea cual sea el resto de la lista (independencia por colegio)', () => {
  const colas = [
    [LOS_ANDES, REPUBLICA, SIMON_BOLIVAR, VILLA_DEL_SOL, LOS_QUILLAYES],
    [VILLA_DEL_SOL, LOS_QUILLAYES, LOS_ANDES, SIMON_BOLIVAR, REPUBLICA],
    [SIMON_BOLIVAR, LOS_QUILLAYES, VILLA_DEL_SOL, REPUBLICA, LOS_ANDES],
  ]
  for (const cola of colas) {
    const lista = [SAN_MARTIN, ...cola]
    const { detalles, asignado } = calcularResultado(lista, perfilCaso(lista), NIVEL_CASO)
    assert.equal(detalles[0].id, SAN_MARTIN)
    assert.equal(detalles[0].estado, 'prioridad_insuficiente') // San Martín 1.º nunca sienta
    assert.notEqual(asignado.id, SAN_MARTIN)
    assert.equal(asignado.idx, 2) // cae al 1.º colegio de la cola, que en los 3 casos sienta
  }
})

// ───────────────────────────────────────────────────────────────────────────────
// Núcleo del modelo (antes era la tabla probAsignacion): si alguien cambia los
// parámetros de población, la semilla o las iteraciones sin quererlo, esto avisa.
test('núcleo del modelo: parámetros de población y semilla estables', () => {
  assert.deepEqual(PARAMS_POBLACION, {
    pSep: 0.55,
    pHermano: 0.10,
    pFuncionario: 0.02,
    pExalumno: 0.03,
    cuotaSep: 0.15,
  })
  assert.equal(ITERACIONES_MONTE_CARLO, 1000)
  assert.equal(SEED_CASO, 20260903)
})

test('núcleo del modelo: prioridadLabels cubre los 5 niveles + TRAMO_SIN_PRIORIDAD bien formado', () => {
  for (const nivel of [1, 2, 3, 4, 5]) {
    assert.equal(typeof prioridadLabels[nivel], 'string')
    assert.ok(prioridadLabels[nivel].length > 0)
  }
  assert.deepEqual(TRAMO_SIN_PRIORIDAD, { esSep: false, general: 'sorteo' })
})

test('nivelPrioridadEnColegio (etiquetas) — la familia del caso solo tiene vínculo por establecimiento', () => {
  const perfil = perfilCaso(LISTA_CASO)
  assert.equal(nivelPrioridadEnColegio(perfil, LOS_ANDES), 1)
  assert.equal(nivelPrioridadEnColegio(perfil, SAN_MARTIN), 5)
  assert.equal(nivelPrioridadEnColegio(perfil, REPUBLICA), 4)
  assert.equal(nivelPrioridadEnColegio(perfil, VILLA_DEL_SOL), 3)
})
