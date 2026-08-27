import { colegios } from '../data/colegios'

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
   Se conserva como valor representativo para compatibilidad con consumidores
   que aún no distinguen por colegio (p. ej. cuando la lista está vacía). */
export function nivelPrioridad(perfil) {
  if (perfil?.hermano) return 1
  if (perfil?.prioritario) return 2
  if (perfil?.funcionario) return 3
  if (perfil?.exalumno) return 4
  return 5
}

/* S22-11 (refinamiento): nivel de prioridad de la familia EN UN COLEGIO CONCRETO.
   Resuelve el mejor nivel (número más bajo) entre:
   - la prioridad transversal `prioritario` (cuota SEP 15 %), y
   - las prioridades específicas que la familia declaró para ESE colegio.

   Compatibilidad: si el perfil no trae `prioridadesPorColegio` (p. ej. el
   simulador de /algoritmo, que no modela vínculos por colegio), se asume que
   las condiciones marcadas a nivel de perfil aplican en el colegio — es el
   comportamiento previo a este refinamiento. */
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

export function probAsignacion(nivel, demanda) {
  const tabla = {
    alta: { 1: 92, 2: 88, 3: 65, 4: 60, 5: 28 },
    media: { 1: 96, 2: 90, 3: 78, 4: 75, 5: 60 },
    baja: { 1: 99, 2: 98, 3: 96, 4: 96, 5: 92 },
  }
  return tabla[demanda][nivel]
}

export function calcularResultado(listaIds = [], perfil = {}) {
  if (!listaIds.length) {
    return {
      error: 'Debes agregar al menos un colegio.',
      asignado: null,
      detalles: [],
    }
  }

  const detalles = listaIds
    .map((id, idx) => {
      const colegio = colegios.find((c) => c.id === id)
      if (!colegio) return null
      // S22-11 (refinamiento): el nivel se resuelve POR COLEGIO, no global
      const nivel = nivelPrioridadEnColegio(perfil, id)
      return {
        id: colegio.id,
        idx: idx + 1,
        nombre: colegio.nombre,
        comuna: colegio.comuna,
        demanda: colegio.demanda,
        nivel,
        prioridadLabel: prioridadLabels[nivel],
        prob: probAsignacion(nivel, colegio.demanda),
        estado: 'evaluado',
      }
    })
    .filter(Boolean)

  const idxAsignado = detalles.findIndex((d) => d.prob >= 65)
  let asignado

  if (idxAsignado === -1) {
    const mejorIdx = detalles.reduce(
      (best, item, i) => (item.prob > detalles[best].prob ? i : best),
      0,
    )
    detalles.forEach((d, i) => {
      if (i === mejorIdx) d.estado = 'asignado'
      else d.estado = d.nivel <= 2 ? 'sin_cupos' : 'prioridad_insuficiente'
    })
    asignado = detalles[mejorIdx]
  } else {
    detalles.forEach((d, i) => {
      if (i < idxAsignado) d.estado = d.nivel <= 2 ? 'sin_cupos' : 'prioridad_insuficiente'
      else if (i === idxAsignado) d.estado = 'asignado'
      else d.estado = 'no_evaluado'
    })
    asignado = detalles[idxAsignado]
  }

  /* S22-11 (refinamiento): `nivel`/`prioridadLabel` de nivel superior son un
     valor REPRESENTATIVO (el del colegio asignado, que es la "prioridad
     aplicada" que ve la familia). Para el detalle por colegio usar
     `d.nivel` / `d.prioridadLabel` de cada entrada de `detalles`. */
  const nivelRep = asignado ? asignado.nivel : nivelPrioridad(perfil)

  return {
    error: null,
    asignado,
    detalles,
    nivel: nivelRep,
    prioridadLabel: prioridadLabels[nivelRep],
  }
}
