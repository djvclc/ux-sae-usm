import { useState } from 'react'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'

const etapas = [
  {
    id: 1,
    icono: '🗓️',
    nombre: 'Inscripción',
    fecha: 'Julio 2026',
    estado: 'completado',
    desc: 'Los sostenedores declaran las vacantes disponibles por nivel y establecimiento. Las familias pueden revisar la oferta de colegios en el catálogo del SAE.',
    quéHacer: 'Esta etapa ya terminó. Si no te inscribiste, revisa si hay segunda oportunidad en el sitio oficial del SAE.',
  },
  {
    id: 2,
    icono: '📝',
    nombre: 'Postulación',
    fecha: 'Agosto 2026',
    estado: 'actual',
    // S22-2 y S22-3 (corrigen E2 y E3): sin límite de colegios; cierre 27 de agosto, 14:00
    desc: 'Las familias eligen sus colegios en orden de preferencia y los declaran en el sistema (sin límite; se recomiendan al menos 6). El orden importa: el sistema evalúa primero tu primera opción.',
    quéHacer: '📌 Estás aquí. Agrega tus colegios preferidos, ordénalos y confirma antes del 27 de agosto a las 14:00.',
  },
  {
    id: 3,
    icono: '⚙️',
    nombre: 'Procesamiento',
    fecha: 'Septiembre 2026',
    estado: 'pendiente',
    desc: 'El algoritmo de asignación cruza las preferencias de todas las familias con las prioridades de cada colegio y las vacantes disponibles. Este proceso es transparente y verificable.',
    quéHacer: 'Mientras esperas, puedes revisar la ficha de tus colegios preferidos y preparar tus documentos para la matrícula.',
  },
  {
    id: 4,
    icono: '📬',
    nombre: 'Resultados',
    fecha: 'Octubre 2026',
    estado: 'pendiente',
    desc: 'Se publica el resultado de la asignación. Las familias reciben una notificación con el colegio asignado o, si corresponde, la información sobre la lista de espera.',
    quéHacer: 'Revisa el resultado en el panel "Mi postulación" de esta plataforma o en sistemadeadmisionescolar.cl.',
  },
  {
    id: 5,
    icono: '✅',
    nombre: 'Aceptación y matrícula',
    fecha: 'Noviembre 2026',
    estado: 'pendiente',
    desc: 'Las familias asignadas deben aceptar el resultado y concurrir al colegio asignado para completar la matrícula dentro del plazo indicado.',
    quéHacer: 'Acepta el resultado dentro del plazo y lleva los documentos requeridos: certificado de nacimiento, cartola de vacunas, informe del colegio anterior.',
  },
  {
    id: 6,
    icono: '📋',
    nombre: 'Lista de espera',
    fecha: 'Nov–Dic 2026',
    estado: 'pendiente',
    desc: 'Las familias que no quedaron asignadas en ninguna preferencia entran a lista de espera. A medida que otros estudiantes no aceptan, las vacantes se ofrecen en orden de lista.',
    quéHacer: 'Si quedas en lista de espera, mantente atento a las notificaciones del SAE. También puedes postular en la segunda etapa si hay vacantes remanentes.',
  },
]

export default function CalendarioPage() {
  const { textoGrande } = useTextSize()
  const [hitoSeleccionado, setHitoSeleccionado] = useState(2) // actual por defecto

  const etapaActual = etapas.find((e) => e.id === hitoSeleccionado)

  const handleHito = (id) => {
    setHitoSeleccionado((prev) => (prev === id ? null : id))
  }

  return (
    <main className={`page${textoGrande ? ' page--texto-grande' : ''}`}>
      <TextSizeBar pageName="Calendario" />
      <h1 tabIndex={-1}>El proceso, paso a paso</h1>
      <p className="page__lead">
        {/* S22-3 (corrige E3): cierre real del Periodo Principal 2027 */}
        El SAE 2026 tiene 6 etapas. Estamos en la <strong>Postulación</strong>{' '}
        — cierra el 27 de agosto a las 14:00. Selecciona una etapa para ver el
        detalle y qué deberías hacer ahora.
      </p>

      {/* Timeline horizontal */}
      <div className="timeline-wrapper" role="region" aria-label="Línea de tiempo del proceso SAE">
        <div className="timeline" role="list">
          {etapas.map((e) => (
            <button
              key={e.id}
              type="button"
              role="listitem"
              className={`timeline__hito timeline__hito--${e.estado}${hitoSeleccionado === e.id ? ' timeline__hito--seleccionado' : ''}`}
              aria-pressed={hitoSeleccionado === e.id}
              aria-label={`Etapa ${e.id}: ${e.nombre}, ${e.fecha}, estado: ${e.estado === 'actual' ? 'etapa actual' : e.estado}`}
              onClick={() => handleHito(e.id)}
            >
              <div className="timeline__circulo" aria-hidden="true">
                {e.estado === 'completado' ? '✓' : e.icono}
              </div>
              <span className="timeline__fecha">{e.fecha}</span>
              <span className="timeline__nombre">{e.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tooltip de etapa seleccionada */}
      {etapaActual && (
        <div
          className="timeline-tooltip"
          role="region"
          aria-label={`Detalle de etapa: ${etapaActual.nombre}`}
          aria-live="polite"
        >
          <h3>
            {etapaActual.icono} {etapaActual.nombre} — {etapaActual.fecha}
          </h3>
          <p>{etapaActual.desc}</p>
          <p style={{ marginTop: '10px', fontWeight: 600, color: 'var(--acento)' }}>
            ¿Qué hacer ahora?
          </p>
          <p>{etapaActual.quéHacer}</p>
        </div>
      )}

      {/* Lista resumen de todas las etapas */}
      <h2 style={{ marginTop: 'var(--esp-xl)' }}>Todas las etapas en detalle</h2>
      <div className="etapas-lista" aria-label="Resumen de etapas">
        {etapas.map((e) => (
          <article
            key={e.id}
            className={`etapa-item${e.estado === 'actual' ? ' etapa-item--actual' : ''}`}
          >
            <span className="etapa-item__icono" aria-hidden="true">
              {e.estado === 'completado' ? '✅' : e.icono}
            </span>
            <div>
              <p className="etapa-item__titulo">{e.nombre}</p>
              <p className="etapa-item__fecha">{e.fecha}</p>
              <p className="etapa-item__desc">{e.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
