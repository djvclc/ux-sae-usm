import { colegios } from '../data/colegios'

export const prioridadLabels = {
  1: 'Hermano/a matriculado/a',
  2: 'Estudiante prioritario (15%)',
  3: 'Hijo/a de funcionario/a',
  4: 'Exalumno/a',
  5: 'Sorteo publico transparente',
}

export function nivelPrioridad(perfil) {
  if (perfil?.hermano) return 1
  if (perfil?.prioritario) return 2
  if (perfil?.funcionario) return 3
  if (perfil?.exalumno) return 4
  return 5
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

  const nivel = nivelPrioridad(perfil)

  const detalles = listaIds
    .map((id, idx) => {
      const colegio = colegios.find((c) => c.id === id)
      if (!colegio) return null
      return {
        id: colegio.id,
        idx: idx + 1,
        nombre: colegio.nombre,
        comuna: colegio.comuna,
        demanda: colegio.demanda,
        nivel,
        prob: probAsignacion(nivel, colegio.demanda),
        estado: 'evaluado',
      }
    })
    .filter(Boolean)

  const idxAsignado = detalles.findIndex((d) => d.prob >= 65)
  let asignado = null

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

  return {
    error: null,
    asignado,
    detalles,
    nivel,
    prioridadLabel: prioridadLabels[nivel],
  }
}
