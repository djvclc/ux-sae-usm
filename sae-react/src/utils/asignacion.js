import { colegios } from '../data/colegios'
import {
  SEED_CASO,
  mulberry32,
  probabilidadCupo,
  simularCupo,
  tramoFamiliaEnColegio,
  vacantesDeNivel,
} from './simulacionSae'

export const prioridadLabels = {
  1: 'Hermano/a matriculado/a',
  2: 'Estudiante prioritario (15%)',
  3: 'Hijo/a de funcionario/a',
  4: 'Exalumno/a',
  5: 'Sorteo público transparente',
}

/* S22-11 (refinamiento) · S22-6:
   La prioridad NO es global. Solo `prioritario` (cuota SEP 15 %) es transversal:
   es un atributo del estudiante y aplica en todos los colegios. En cambio
   `hermano`, `funcionario` y `exalumno` son específicas del establecimiento —
   la familia tiene el hermano matriculado / el empleo / el vínculo de exalumno
   solo en colegios concretos. Se declaran en
   `perfil.prioridadesPorColegio[colegioId] = { hermano, funcionario, exalumno }`. */
export const PRIORIDADES_POR_COLEGIO = ['hermano', 'funcionario', 'exalumno']

// Nivel legal de cada prioridad específica de colegio (menor número = mejor).
// Orden real de procesamiento (S22-6): hermano → (15 % SEP) → funcionario → exalumno.
const NIVEL_ESPECIFICO = { hermano: 1, funcionario: 3, exalumno: 4 }

/* Nivel de prioridad GLOBAL del perfil.
   Valor representativo para etiquetas cuando no hay colegio concreto. */
export function nivelPrioridad(perfil) {
  if (perfil?.hermano) return 1
  if (perfil?.prioritario) return 2
  if (perfil?.funcionario) return 3
  if (perfil?.exalumno) return 4
  return 5
}

/* Nivel de prioridad de la familia EN UN COLEGIO CONCRETO (1–5). Se usa para las
   ETIQUETAS ("Prioridad aplicada", "certeza muy alta") — la probabilidad ya no
   sale de acá, sale de la simulación (`simulacionSae.js`). */
export function nivelPrioridadEnColegio(perfil = {}, colegioId) {
  const mapa = perfil?.prioridadesPorColegio
  const especificas = mapa
    ? mapa[colegioId] ?? {}
    : { hermano: perfil.hermano, funcionario: perfil.funcionario, exalumno: perfil.exalumno }

  const niveles = [5]
  if (perfil?.prioritario) niveles.push(2)
  for (const clave of PRIORIDADES_POR_COLEGIO) {
    if (especificas[clave]) niveles.push(NIVEL_ESPECIFICO[clave])
  }
  return Math.min(...niveles)
}

/* Nivel del/de la estudiante por defecto cuando el consumidor no lo pasa
   (p. ej. el simulador de /algoritmo, que es un explicador genérico). */
const NIVEL_POR_DEFECTO = '1° básico'

/* Convierte la probabilidad cruda (0..1) de `probabilidadCupo` en el entero que
   se muestra. Acota a [1, 99]: un sistema con sorteo nunca garantiza ni prohíbe
   por completo un cupo, así que no mostramos 0 % ni 100 % exactos. */
export function probPorcentaje(pRaw) {
  if (pRaw === null || pRaw === undefined) return null
  return Math.min(99, Math.max(1, Math.round(pRaw * 100)))
}

/* ── Resultado de la postulación ──
   Modelo nuevo (2026-09-03, plan C): la probabilidad por colegio se ESTIMA con
   Monte Carlo sobre una simulación DA-por-colegio (ver `simulacionSae.js`); el
   colegio asignado sale de UN recorrido determinista de la lista con semilla fija
   (`SEED_CASO`): la familia propone a su 1.ª opción, y si el sorteo + su prioridad
   no la sientan, pasa a la 2.ª, etc. Ya no hay tabla `probAsignacion` ni umbral 65. */
export function calcularResultado(listaIds = [], perfil = {}, nivelAlumno = NIVEL_POR_DEFECTO) {
  if (!listaIds.length) {
    return { error: 'Debes agregar al menos un colegio.', asignado: null, detalles: [] }
  }
  const nivel = nivelAlumno || NIVEL_POR_DEFECTO

  const base = listaIds
    .map((id, idx) => {
      const colegio = colegios.find((c) => c.id === id)
      if (!colegio) return null
      const tramo = tramoFamiliaEnColegio(perfil, id)
      const nivelEtq = nivelPrioridadEnColegio(perfil, id)
      const pRaw = probabilidadCupo(colegio, nivel, tramo)
      return {
        id: colegio.id,
        idx: idx + 1,
        nombre: colegio.nombre,
        comuna: colegio.comuna,
        demanda: colegio.demanda,
        nivel: nivelEtq,
        prioridadLabel: prioridadLabels[nivelEtq],
        ofreceNivel: pRaw !== null,
        prob: probPorcentaje(pRaw),
        estado: 'evaluado',
      }
    })
    .filter(Boolean)

  // Recorrido determinista de la lista, un solo sorteo por colegio (semilla fija).
  const rng = mulberry32(SEED_CASO)
  let idxAsignado = -1
  const detalles = base.map((d, i) => {
    if (!d.ofreceNivel) return { ...d, estado: 'sin_nivel' }
    const colegio = colegios.find((c) => c.id === d.id)
    const tramo = tramoFamiliaEnColegio(perfil, d.id)
    const sim = simularCupo(colegio, nivel, tramo, rng)
    const salida = { ...d, simulacion: sim }
    if (idxAsignado === -1 && sim.seated) {
      idxAsignado = i
      salida.estado = 'asignado'
    } else if (idxAsignado === -1) {
      // no quedó y todavía no hay asignación: etiqueta según qué tan fuerte era su prioridad
      salida.estado = d.nivel <= 2 ? 'sin_cupos' : 'prioridad_insuficiente'
    } else {
      salida.estado = 'no_evaluado'
    }
    return salida
  })

  let asignado
  if (idxAsignado !== -1) {
    asignado = detalles[idxAsignado]
  } else {
    // No quedó en ninguna preferencia. En el SAE real acá entra la "asignación por
    // cercanía"; el prototipo muestra el de mayor probabilidad estimada con aviso.
    const conProb = detalles.filter((d) => d.prob !== null)
    if (conProb.length) {
      const mejor = conProb.reduce((b, d) => (d.prob > b.prob ? d : b), conProb[0])
      const i = detalles.findIndex((d) => d.id === mejor.id)
      detalles[i] = { ...detalles[i], estado: 'asignado' }
      asignado = detalles[i]
    } else {
      asignado = null
    }
  }

  const nivelRep = asignado ? asignado.nivel : nivelPrioridad(perfil)
  return {
    error: null,
    asignado,
    detalles,
    nivel: nivelRep,
    prioridadLabel: prioridadLabels[nivelRep],
    // true si la asignación fue por el fallback (ningún colegio de la lista sentó a la familia)
    sinAsignacionEnPreferencias: idxAsignado === -1,
  }
}

/* Compatibilidad: algunos consumidores llamaban `probAsignacion(nivel, demanda)`.
   Ahora la probabilidad necesita el colegio (vacantes, postulantes) y el nivel
   del estudiante, así que se expone la función real. Ver `simulacionSae.js`. */
export { probabilidadCupo, tramoFamiliaEnColegio, vacantesDeNivel }
