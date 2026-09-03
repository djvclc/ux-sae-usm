// Validación del flujo de postulación que se prueba con usuarios
// (caso de la familia Muñoz González — docs/investigacion/caso_estudio_prueba_usabilidad_postulacion.md).
//
// Ejercita la lógica REAL de asignación (src/utils/asignacion.js) con el catálogo
// REAL (src/data/colegios.js), reproduciendo el estado que arma PostulacionPage.jsx:
//   perfilCompleto = { prioritario, prioridadesPorColegio }
// donde `prioridadesPorColegio` se siembra desde `colegio.casoPrioridades` al
// agregar cada colegio (misma regla que `agregar()` en PostulacionPage.jsx).
//
// La familia del caso NO es prioritaria (sin SEP ni PIE): sus únicas ventajas son
// los vínculos por colegio. El "colegio en mente" (San Martín) NO tiene vínculo y
// tiene demanda alta → resultado incierto (28 %). Es el punto donde la prueba
// observa el falso riesgo estratégico (caso_estudio §3.1).
//
// Correr:  npm test        (desde sae-react/)
// No usa ningún framework: runner nativo `node --test` + node:assert.

import test from 'node:test'
import assert from 'node:assert/strict'

import { colegiosById } from '../src/data/colegios.js'
import {
  calcularResultado,
  nivelPrioridadEnColegio,
  probAsignacion,
  prioridadLabels,
  PRIORIDADES_POR_COLEGIO,
} from '../src/utils/asignacion.js'

/* ── IDs del caso (orden de la Tabla 1 del caso de estudio) ── */
const LOS_ANDES = 1
const SAN_MARTIN = 2
const REPUBLICA = 3
const SIMON_BOLIVAR = 4
const VILLA_DEL_SOL = 5
const LOS_QUILLAYES = 6
const LISTA_CASO = [LOS_ANDES, SAN_MARTIN, REPUBLICA, SIMON_BOLIVAR, VILLA_DEL_SOL, LOS_QUILLAYES]

/* Reproduce PostulacionPage.jsx `agregar()`: al agregar un colegio se premarcan
   las prioridades específicas que la familia tiene en él (colegio.casoPrioridades),
   filtradas a las claves válidas por colegio (hermano/funcionario/exalumno). */
function sembrarPrioridadesPorColegio(ids) {
  const mapa = {}
  for (const id of ids) {
    const claves = (colegiosById[id]?.casoPrioridades ?? []).filter((k) =>
      PRIORIDADES_POR_COLEGIO.includes(k),
    )
    if (claves.length) {
      mapa[id] = Object.fromEntries(claves.map((k) => [k, true]))
    }
  }
  return mapa
}

/* perfilCompleto tal como lo construye PostulacionPage.jsx (useMemo). */
function perfilFamilia(ids, { prioritario }) {
  return { prioritario, prioridadesPorColegio: sembrarPrioridadesPorColegio(ids) }
}

/* La familia del caso: NO prioritaria (sin SEP). */
const perfilCaso = (ids) => perfilFamilia(ids, { prioritario: false })

// ───────────────────────────────────────────────────────────────────────────────
test('el catálogo trae los 6 colegios del caso con la demanda y las prioridades documentadas', () => {
  const esperado = [
    { id: LOS_ANDES, nombre: 'Colegio Los Andes', demanda: 'alta', casoPrioridades: ['hermano'] },
    { id: SAN_MARTIN, nombre: 'Colegio San Martín', demanda: 'alta', casoPrioridades: [] }, // colegio en mente: sin vínculo + alta demanda
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
test('paso 1: nivel de prioridad de la familia del caso (sin SEP) — el vínculo por colegio es lo único que aplica', () => {
  const perfil = perfilCaso(LISTA_CASO)

  assert.equal(nivelPrioridadEnColegio(perfil, LOS_ANDES), 1, 'hermano/a matriculado/a')
  assert.equal(nivelPrioridadEnColegio(perfil, SAN_MARTIN), 5, 'colegio en mente: sin vínculo → sorteo')
  assert.equal(nivelPrioridadEnColegio(perfil, REPUBLICA), 4, 'madre exalumna')
  assert.equal(nivelPrioridadEnColegio(perfil, VILLA_DEL_SOL), 3, 'padre funcionario')
  assert.equal(nivelPrioridadEnColegio(perfil, SIMON_BOLIVAR), 5, 'sin vínculo → sorteo')
  assert.equal(nivelPrioridadEnColegio(perfil, LOS_QUILLAYES), 5, 'continuidad no se modela como prioridad')
})

test('nivelPrioridadEnColegio: si la familia fuera prioritaria (SEP), la cuota nivel 2 domina a funcionario y exalumno', () => {
  // Test de la FUNCIÓN, no del caso: documenta cómo se resuelve el nivel cuando
  // `prioritario` es true (Math.min de SEP=2 y el vínculo del colegio).
  const perfil = perfilFamilia(LISTA_CASO, { prioritario: true })

  assert.equal(nivelPrioridadEnColegio(perfil, LOS_ANDES), 1, 'hermano/a (nivel 1) gana a SEP')
  assert.equal(nivelPrioridadEnColegio(perfil, SAN_MARTIN), 2, 'solo SEP')
  assert.equal(nivelPrioridadEnColegio(perfil, REPUBLICA), 2, 'SEP (2) gana a exalumno (4)')
  assert.equal(nivelPrioridadEnColegio(perfil, VILLA_DEL_SOL), 2, 'SEP (2) gana a funcionario (3)')
})

// ───────────────────────────────────────────────────────────────────────────────
test('paso 2: probabilidad estimada por colegio para la familia del caso', () => {
  const perfil = perfilCaso(LISTA_CASO)
  const { detalles } = calcularResultado(LISTA_CASO, perfil)
  const prob = Object.fromEntries(detalles.map((d) => [d.id, d.prob]))

  assert.equal(prob[LOS_ANDES], 92) // nivel 1 (hermano), demanda alta
  assert.equal(prob[SAN_MARTIN], 28) // nivel 5 (sorteo), demanda alta → colegio en mente, resultado incierto
  assert.equal(prob[REPUBLICA], 96) // nivel 4 (exalumno), demanda baja
  assert.equal(prob[SIMON_BOLIVAR], 60) // nivel 5 (sorteo), demanda media
  assert.equal(prob[VILLA_DEL_SOL], 65) // nivel 3 (funcionario), demanda alta → justo en el umbral
  assert.equal(prob[LOS_QUILLAYES], 60) // nivel 5 (sorteo), demanda media
})

// ───────────────────────────────────────────────────────────────────────────────
test('paso 3: con la lista en el orden de la tabla, la familia queda en Los Andes (1ª opción, por hermano/a)', () => {
  const perfil = perfilCaso(LISTA_CASO)
  const { error, asignado, detalles } = calcularResultado(LISTA_CASO, perfil)

  assert.equal(error, null)
  assert.equal(asignado.id, LOS_ANDES)
  assert.equal(asignado.idx, 1)
  assert.equal(asignado.nivel, 1)
  assert.equal(asignado.prob, 92)
  assert.equal(asignado.prioridadLabel, prioridadLabels[1])
  assert.equal(detalles[0].estado, 'asignado')
})

test('paso 3 (escenario clave): si pone San Martín 1º, NO queda ahí (28 % < 65 %) y cae a Los Andes (2ª opción)', () => {
  const lista = [SAN_MARTIN, LOS_ANDES, REPUBLICA, SIMON_BOLIVAR, VILLA_DEL_SOL, LOS_QUILLAYES]
  const { asignado, detalles } = calcularResultado(lista, perfilCaso(lista))

  assert.equal(detalles[0].id, SAN_MARTIN)
  assert.equal(detalles[0].prob, 28)
  assert.notEqual(detalles[0].estado, 'asignado')
  assert.equal(asignado.id, LOS_ANDES, 'siguiente colegio de la lista con probabilidad ≥ 65')
  assert.equal(asignado.idx, 2)
  assert.equal(asignado.nivel, 1) // entra por el hermano/a matriculado/a en Los Andes
})

test('falso riesgo estratégico: la probabilidad de San Martín es 28 % esté donde esté en la lista', () => {
  const primero = [SAN_MARTIN, LOS_ANDES, REPUBLICA]
  const enMedio = [LOS_ANDES, REPUBLICA, SAN_MARTIN]
  const ultimo = [LOS_ANDES, VILLA_DEL_SOL, REPUBLICA, SIMON_BOLIVAR, LOS_QUILLAYES, SAN_MARTIN]

  for (const lista of [primero, enMedio, ultimo]) {
    const { detalles } = calcularResultado(lista, perfilCaso(lista))
    const sanMartin = detalles.find((d) => d.id === SAN_MARTIN)
    assert.equal(sanMartin.prob, 28, `la posición no cambia la probabilidad (lista ${lista.join('-')})`)
    assert.equal(sanMartin.nivel, 5)
  }
})

test('ordenar por preferencia real: esconder Los Andes debajo de opciones peores hace caer la asignación en una que se prefiere menos', () => {
  // San Martín 1º (28, no alcanza), luego dos sin vínculo (60, no alcanzan),
  // República 4º (96) — y Los Andes escondido al final.
  const lista = [SAN_MARTIN, SIMON_BOLIVAR, LOS_QUILLAYES, REPUBLICA, VILLA_DEL_SOL, LOS_ANDES]
  const { asignado } = calcularResultado(lista, perfilCaso(lista))
  assert.equal(asignado.id, REPUBLICA, 'se asigna la 4ª opción; Los Andes quedó fuera de evaluación')
  assert.equal(asignado.idx, 4)
})

// ───────────────────────────────────────────────────────────────────────────────
test('regla de asignación: gana el primer colegio de la lista con probabilidad ≥ 65, aunque haya mejores más abajo', () => {
  // Villa del Sol (funcionario, alta) → 65 (justo el umbral, inclusivo).
  // República (exalumno, baja) → 96 (más alta, pero va después).
  const lista = [VILLA_DEL_SOL, REPUBLICA]
  const { asignado, detalles } = calcularResultado(lista, perfilCaso(lista))

  assert.equal(detalles[0].prob, 65)
  assert.equal(detalles[1].prob, 96)
  assert.equal(asignado.id, VILLA_DEL_SOL, 'el umbral 65 es inclusivo y respeta el orden de la lista')
})

test('lista vacía: calcularResultado devuelve error y sin asignación', () => {
  const r = calcularResultado([], {})
  assert.equal(r.asignado, null)
  assert.ok(r.error)
  assert.deepEqual(r.detalles, [])
})

// ───────────────────────────────────────────────────────────────────────────────
// Núcleo protegido (CLAUDE.md): si alguien toca la tabla probAsignacion o el
// umbral 65 sin pedirlo, estos asserts lo avisan. La tabla NO se recalibró: el
// caso se ajustó cambiando el perfil (sin SEP) y la demanda de San Martín.
test('núcleo protegido: la tabla probAsignacion mantiene sus valores', () => {
  const esperada = {
    alta: { 1: 92, 2: 88, 3: 65, 4: 60, 5: 28 },
    media: { 1: 96, 2: 90, 3: 78, 4: 75, 5: 60 },
    baja: { 1: 99, 2: 98, 3: 96, 4: 96, 5: 92 },
  }
  for (const demanda of Object.keys(esperada)) {
    for (const nivel of [1, 2, 3, 4, 5]) {
      assert.equal(
        probAsignacion(nivel, demanda),
        esperada[demanda][nivel],
        `probAsignacion(${nivel}, '${demanda}')`,
      )
    }
  }
})

test('núcleo protegido: prioridadLabels cubre los 5 niveles legales', () => {
  for (const nivel of [1, 2, 3, 4, 5]) {
    assert.equal(typeof prioridadLabels[nivel], 'string')
    assert.ok(prioridadLabels[nivel].length > 0)
  }
})
