/* ── Simulación de la asignación del SAE (modelo DA por colegio + Monte Carlo) ──
 *
 * Reemplaza a la tabla fija `probAsignacion`. En vez de un número elegido a mano,
 * la probabilidad de quedar en un colegio se ESTIMA simulando la competencia real:
 * una multitud sintética de otros postulantes con distintos niveles de prioridad,
 * las vacantes y los postulantes del año anterior REALES de `colegios.js`, la
 * cuota del 15 % para estudiantes prioritarios/as modelada como "sub-escuela"
 * (matching with contracts, `investigacion_algoritmo_sae.md` §3.2) y un sorteo
 * aleatorio independiente por colegio (regla de desempate múltiple).
 *
 * ⚠️ Esto NO es la Aceptación Diferida multi-colegio completa: no modela que los
 * demás postulantes también tienen listas y se desplazan entre colegios. Es "DA
 * por colegio" — para el resultado de UNA familia, con los otros postulantes como
 * demanda fija de ese colegio, la aproximación es buena. Ver
 * `docs/planificacion/mapa_resultados_caso_munoz_gonzalez.md`.
 *
 * Simplificaciones declaradas de la v1:
 * - No se modela la cuota PIE (≤2 cupos/curso). El caso de estudio tampoco la usa.
 * - No se modela la cuota de alta exigencia académica (ningún colegio la tiene).
 * - Todo es determinista: los sorteos usan un PRNG con semilla fija, para que el
 *   % mostrado no parpadee entre renders y el caso sea reproducible.
 */

import { colegios } from '../data/colegios'

/* ── Parámetros del modelo de multitud sintética ──
 * pSep: ANCLADO al proceso 2018 (54,7 % de los postulantes fueron prioritarios,
 *   `investigacion_algoritmo_sae.md` §6).
 * pHermano / pFuncionario / pExalumno: ESTIMACIONES plausibles (no hay microdatos
 *   del SAE con estos desgloses). Ajustables desde acá; ver análisis de
 *   sensibilidad en la bitácora. Son la probabilidad marginal de que un
 *   competidor tenga ese vínculo con ESE colegio.
 * cuotaSep: 15 % de los cupos reservados por ley.
 */
export const PARAMS_POBLACION = {
  pSep: 0.55,
  pHermano: 0.10,
  pFuncionario: 0.02,
  pExalumno: 0.03,
  cuotaSep: 0.15,
}

export const ITERACIONES_MONTE_CARLO = 1000

/* Semilla del recorrido determinista del caso. Elegida para que la demo Muñoz
 * González muestre el desenlace representativo (no queda en el "colegio en mente",
 * cae a su siguiente opción con prioridad). Verificado por test. */
export const SEED_CASO = 20260903

/* PRNG mulberry32 — pequeño, rápido, con semilla. Devuelve una función rng() que
 * da flotantes en [0, 1). */
export function mulberry32(seed) {
  let a = seed >>> 0
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* Tramo de vacantes del esquema v2 según el nivel del estudiante. */
export function vacantesDeNivel(colegio, nivelAlumno) {
  if (!colegio || !nivelAlumno) return null
  let clave = null
  if (nivelAlumno === 'Prekínder') clave = 'preKinder'
  else if (nivelAlumno === 'Kínder') clave = 'kinder'
  else if (nivelAlumno.includes('básico')) clave = 'basico'
  else if (nivelAlumno.includes('medio')) clave = 'medio'
  return colegio.vacantes.find((v) => v.nivel === clave) ?? null
}

/* Orden de los tramos de prioridad en el pozo GENERAL (menor = mejor).
 * La SEP no está: es una cuota aparte (se maneja en la fase 1). */
const RANGO_GENERAL = { hermano: 1, funcionario: 2, exalumno: 3, sorteo: 4 }

/* Muestrea el mejor vínculo legal (no-SEP) de un competidor con ESE colegio. */
function muestrearTramoGeneral(rng, p) {
  const r = rng()
  if (r < p.pHermano) return 'hermano'
  if (r < p.pHermano + p.pFuncionario) return 'funcionario'
  if (r < p.pHermano + p.pFuncionario + p.pExalumno) return 'exalumno'
  return 'sorteo'
}

/* Tramo de la familia en un colegio, derivado del perfil:
 *   { esSep, general } donde general ∈ hermano|funcionario|exalumno|sorteo.
 * `esSep` viene del perfil (cuota transversal). `general` viene de las prioridades
 * por colegio (`perfil.prioridadesPorColegio[colegioId]`). */
export function tramoFamiliaEnColegio(perfil = {}, colegioId) {
  const esSep = !!perfil.prioritario
  const mapa = perfil.prioridadesPorColegio
  const esp = mapa
    ? mapa[colegioId] ?? {}
    : { hermano: perfil.hermano, funcionario: perfil.funcionario, exalumno: perfil.exalumno }
  const general = esp.hermano
    ? 'hermano'
    : esp.funcionario
      ? 'funcionario'
      : esp.exalumno
        ? 'exalumno'
        : 'sorteo'
  return { esSep, general }
}

/* ── UN sorteo de cupo en un colegio ──
 * Devuelve si la familia queda, y datos para narrar el proceso.
 * `familiaTramo` = { esSep, general }. `rng` = función del PRNG (se consume). */
export function simularCupo(colegio, nivelAlumno, familiaTramo, rng, params = PARAMS_POBLACION) {
  const vac = vacantesDeNivel(colegio, nivelAlumno)
  if (!vac) return { ofreceNivel: false }

  const S = Math.round((vac.min + vac.max) / 2) // vacantes en el punto medio del rango
  const A = vac.postulantesAnterior || 0        // competidores (dato real)
  const sSep = Math.round(params.cuotaSep * S)  // cupos reservados a prioritarios
  const sGen = S - sSep

  // Competidores sintéticos + la familia. `seated` se marca en el objeto.
  const gente = []
  for (let i = 0; i < A; i++) {
    gente.push({
      familia: false,
      esSep: rng() < params.pSep,
      general: muestrearTramoGeneral(rng, params),
      sorteo: rng(),
      seated: false,
    })
  }
  const familia = {
    familia: true,
    esSep: familiaTramo.esSep,
    general: familiaTramo.general,
    sorteo: rng(),
    seated: false,
  }
  gente.push(familia)

  // FASE 1 — cuota SEP: los prioritarios compiten por `sSep` cupos, solo por sorteo.
  const sep = gente.filter((x) => x.esSep).sort((a, b) => a.sorteo - b.sorteo)
  let cupoSepFamilia = false
  for (let i = 0; i < sep.length && i < sSep; i++) {
    sep[i].seated = true
    if (sep[i].familia) cupoSepFamilia = true
  }

  // FASE 2 — pozo general: los no ubicados compiten por `sGen` cupos, por
  // (rango general, sorteo). Un/a SEP que no alcanzó el reservado entra acá con su
  // vínculo no-SEP (su ventaja ERA el 15 %).
  const restantes = gente
    .filter((x) => !x.seated)
    .sort((a, b) => {
      const ra = RANGO_GENERAL[a.general]
      const rb = RANGO_GENERAL[b.general]
      return ra !== rb ? ra - rb : a.sorteo - b.sorteo
    })
  let posGeneralFamilia = -1
  for (let i = 0; i < restantes.length; i++) {
    if (restantes[i].familia) posGeneralFamilia = i + 1
    if (i < sGen) restantes[i].seated = true
  }

  const seated = familia.seated
  return {
    ofreceNivel: true,
    seated,
    S,
    A,
    sSep,
    sGen,
    via: cupoSepFamilia ? 'cuota-sep' : seated ? 'pozo-general' : null,
    // Posición de la familia en el pozo general (útil para "quedaste en el puesto N")
    posGeneral: posGeneralFamilia,
    // Cuántos competidores del pozo general tenían mejor rango que la familia
    conMejorRango: restantes.filter(
      (x) => !x.familia && RANGO_GENERAL[x.general] < RANGO_GENERAL[familia.general],
    ).length,
  }
}

/* ── Probabilidad estimada (Monte Carlo) de quedar en un colegio ──
 * Devuelve un número 0..1. Semilla fija por (colegio, nivel) para que el valor
 * mostrado sea estable y reproducible. NO depende del orden de la lista, así que
 * se cachea: reordenar la lista no recalcula esto. */
const _cacheProb = new Map()

export function probabilidadCupo(
  colegio,
  nivelAlumno,
  familiaTramo,
  { iteraciones = ITERACIONES_MONTE_CARLO, params = PARAMS_POBLACION } = {},
) {
  const vac = vacantesDeNivel(colegio, nivelAlumno)
  if (!vac) return null

  const clave = `${colegio.id}|${nivelAlumno}|${familiaTramo.esSep ? 1 : 0}|${familiaTramo.general}|${iteraciones}`
  if (_cacheProb.has(clave)) return _cacheProb.get(clave)

  // Semilla determinista a partir del id del colegio y el nivel.
  const semilla =
    (colegio.id * 100003 + [...(nivelAlumno || '')].reduce((s, c) => s + c.charCodeAt(0), 0)) >>> 0
  const rng = mulberry32(semilla)

  let quedaron = 0
  for (let i = 0; i < iteraciones; i++) {
    if (simularCupo(colegio, nivelAlumno, familiaTramo, rng, params).seated) quedaron++
  }
  const p = quedaron / iteraciones
  _cacheProb.set(clave, p)
  return p
}

/* Ayuda para consumidores que no arman un `perfil` (p. ej. la ficha de colegio,
 * "si postulas sin ninguna prioridad"). */
export const TRAMO_SIN_PRIORIDAD = { esSep: false, general: 'sorteo' }

export { colegios }
