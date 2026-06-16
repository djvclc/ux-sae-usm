import { useMemo, useState } from 'react'
import { colegios } from '../data/colegios'
import { calcularResultado, prioridadLabels } from '../utils/asignacion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'

/* Datos de los 4 pasos — separados para mantener el JSX limpio */
const pasos = [
  {
    num: 1,
    icon: '📋',
    titulo: 'Tú eliges',
    desc: 'Eliges hasta 8 colegios en orden de preferencia. El primero es el que más quieres.',
    detalle: 'Puedes cambiar el orden antes de confirmar. Pon el colegio que más quieres primero.',
    color: '#1e3a5f',
  },
  {
    num: 2,
    icon: '⚖️',
    titulo: 'Cada colegio prioriza',
    desc: 'La ley define el orden: hermanos/as primero, luego estudiantes prioritarios/as, funcionarios/as y exalumnos/as.',
    detalle: 'Si no tienes ninguna prioridad, participas en el sorteo junto a otros postulantes sin prioridad.',
    color: '#2d6a4f',
  },
  {
    num: 3,
    icon: '⚙️',
    titulo: 'El sistema asigna',
    desc: 'Se cruzan tus preferencias con las prioridades y los cupos disponibles.',
    detalle: 'Si hay empate entre postulantes con la misma prioridad, el sistema hace un sorteo público certificado.',
    color: '#7b3f96',
  },
  {
    num: 4,
    icon: '📬',
    titulo: 'Te avisamos',
    desc: 'Recibes el resultado. Si no quedas en tu primera opción, el sistema sigue revisando tu lista en orden.',
    detalle: 'Tienes un plazo para aceptar o rechazar el colegio asignado antes de que se ofrezca a otro postulante.',
    color: '#b35c1e',
  },
]

/* Videotutoriales — contenido simulado representativo */
const tutoriales = [
  {
    id: 1,
    titulo: 'Cómo funciona el algoritmo del SAE',
    desc: 'Explicación en 4 pasos de cómo el sistema asigna un colegio a cada estudiante. Ideal antes de postular.',
    dur: '3:45',
    nivel: 'Introductorio',
    color: '#1e3a5f',
  },
  {
    id: 2,
    titulo: 'Cómo elegir el orden de tus colegios',
    desc: '¿Debe ir primero el colegio que más quieres o el que crees que te van a dar? Aquí te lo explicamos.',
    dur: '2:20',
    nivel: 'Consejos prácticos',
    color: '#2d6a4f',
  },
  {
    id: 3,
    titulo: 'Qué son los criterios de prioridad',
    desc: 'Hermano/a matriculado/a, estudiante prioritario/a, hijo/a de funcionario/a y exalumno/a: qué significa cada uno.',
    dur: '4:10',
    nivel: 'Explicación detallada',
    color: '#7b3f96',
  },
]

export default function AlgoritmoPage() {
  const { textoGrande } = useTextSize()
  const [perfil, setPerfil] = useState({
    hermano: false,
    prioritario: false,
    funcionario: false,
    exalumno: false,
  })
  const [seleccion, setSeleccion] = useState([])
  const [pasoExpandido, setPasoExpandido] = useState(null)

  const resultado = useMemo(
    () => (seleccion.length ? calcularResultado(seleccion, perfil) : null),
    [seleccion, perfil],
  )

  const toggleCondicion = (key) => {
    setPerfil((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleColegio = (id) => {
    setSeleccion((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  /* Genera explicación contextualizada del resultado del simulador (S4-2) */
  const explicacionSim = useMemo(() => {
    if (!resultado?.asignado) return null
    const { asignado } = resultado
    if (perfil.hermano) {
      return `Tu mejor opción es <strong>${asignado.nombre}</strong> porque tienes un hermano o hermana matriculado/a ahí. Eso te da la <strong>prioridad más alta por ley</strong>.`
    }
    if (perfil.prioritario) {
      return `Tu mejor opción es <strong>${asignado.nombre}</strong> porque eres estudiante prioritario/a (<abbr title="Subvención Escolar Preferencial">SEP</abbr>). Esta es la segunda prioridad más alta.`
    }
    if (perfil.funcionario) {
      return `Tu mejor opción es <strong>${asignado.nombre}</strong> porque eres hijo/a de funcionario/a. Esta condición te da prioridad sobre el sorteo.`
    }
    if (perfil.exalumno) {
      return `Tu mejor opción es <strong>${asignado.nombre}</strong> porque eres exalumno/a del establecimiento.`
    }
    return `Tu mejor opción probable es <strong>${asignado.nombre}</strong> a través del sorteo público. Como no tienes prioridades especiales, el sistema evalúa disponibilidad de vacantes.`
  }, [resultado, perfil])

  const estadoLabel = {
    asignado: '✅ Mejor opción',
    no_evaluado: '⏭ No evaluado',
    sin_cupos: '🔴 Sin cupos',
    prioridad_insuficiente: '🟡 Prioridad insuficiente',
  }

  return (
    <main className={`page page--module${textoGrande ? ' page--texto-grande' : ''}`}>
      <TextSizeBar pageName="¿Cómo funciona?" />
      <h1>¿Cómo te asignan un colegio?</h1>
      <p className="page__lead">
        El SAE no es una tómbola. Funciona con reglas claras y prioridades definidas por ley.
        Simula tu caso para ver una explicación personalizada.
      </p>

      {/* ══ INFOGRAFÍA 4 PASOS ══ */}
      <section className="algo-pasos" aria-label="Los 4 pasos del proceso SAE">
        <div className="algo-pasos__grid">
          {pasos.map((paso, idx) => (
            <div key={paso.num} className="algo-paso" style={{ '--paso-color': paso.color }}>
              {/* Flecha conectora — oculta en móvil */}
              {idx < pasos.length - 1 && (
                <div className="algo-paso__flecha" aria-hidden="true">→</div>
              )}
              <div className="algo-paso__header">
                <span className="algo-paso__num" aria-hidden="true">{paso.num}</span>
                <span className="algo-paso__icon" aria-hidden="true">{paso.icon}</span>
              </div>
              <h2 className="algo-paso__titulo">{paso.titulo}</h2>
              <p className="algo-paso__desc">{paso.desc}</p>
              <button
                type="button"
                className="algo-paso__mas"
                aria-expanded={pasoExpandido === paso.num}
                onClick={() => setPasoExpandido(pasoExpandido === paso.num ? null : paso.num)}
              >
                {pasoExpandido === paso.num ? '▲ Menos detalle' : '▼ Más detalle'}
              </button>
              {pasoExpandido === paso.num && (
                <p className="algo-paso__detalle" role="note">{paso.detalle}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══ VIDEOTUTORIALES — placeholder (11.1) ══ */}
      <section className="tutoriales-section" aria-labelledby="tutoriales-titulo">
        <div className="tutoriales-header">
          <h2 id="tutoriales-titulo" className="tutoriales-header__titulo">
            <span aria-hidden="true">🎬</span> Aprende con videotutoriales
          </h2>
          <p className="tutoriales-header__sub">
            Videos explicativos del Ministerio de Educación para entender el proceso antes de postular.
          </p>
        </div>
        <div className="tutoriales-grid" role="list">
          {tutoriales.map((t) => (
            <div
              key={t.id}
              className="tutorial-card"
              role="listitem"
              style={{ '--tut-color': t.color }}
            >
              {/* Thumbnail simulado con botón de play */}
              <div className="tutorial-card__thumb" aria-hidden="true">
                <div className="tutorial-card__play">▶</div>
                <span className="tutorial-card__dur">{t.dur}</span>
              </div>
              <div className="tutorial-card__info">
                <span className="tutorial-card__nivel">{t.nivel}</span>
                <h3 className="tutorial-card__titulo">{t.titulo}</h3>
                <p className="tutorial-card__desc">{t.desc}</p>
                <button
                  type="button"
                  className="btn btn--secondary btn--mini tutorial-card__btn"
                  aria-label={`Ver tutorial: ${t.titulo} (${t.dur})`}
                >
                  Ver tutorial
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="form-hint" style={{ marginTop: 10 }}>
          ⚠ Los videos son una simulación para el prototipo. En el sitio real se enlazarán los
          tutoriales oficiales del Mineduc.
        </p>
      </section>

      {/* ══ SIMULADOR INTERACTIVO ══ */}
      <Card className="sim-panel">
        <CardHeader>
          <CardTitle>Simula tu caso</CardTitle>
          <p className="page__lead" style={{ margin: '8px 0 0' }}>
            Marca tus condiciones y elige hasta 3 colegios para estimar tu resultado.
          </p>
        </CardHeader>
        <CardContent>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>
            ¿Tienes alguna de estas condiciones de prioridad?
          </p>
          <span className="form-hint" style={{ marginBottom: 8 }}>
            Estas condiciones afectan directamente tu probabilidad de quedar asignado/a.
          </span>
          <div className="chip-row">
            {[
              ['hermano',    'Hermano/a matriculado/a',         'Prioridad 1 — más alta'],
              ['prioritario','Estudiante prioritario/a',         'Prioridad 2 — con SEP'],
              ['funcionario','Hijo/a de funcionario/a',          'Prioridad 3'],
              ['exalumno',   'Exalumno/a del establecimiento',   'Prioridad 4'],
            ].map(([key, label, titulo]) => (
              <button
                key={key}
                type="button"
                className={`chip-btn ${perfil[key] ? 'chip-btn--on' : ''}`}
                onClick={() => toggleCondicion(key)}
                title={titulo}
                aria-pressed={perfil[key]}
              >
                {label}
              </button>
            ))}
          </div>

          <p style={{ fontWeight: 600, marginTop: 16, marginBottom: 4 }}>
            Elige hasta 3 colegios (en orden de preferencia):
          </p>
          <div className="sim-school-grid">
            {colegios.map((c) => {
              const activo = seleccion.includes(c.id)
              const orden = seleccion.indexOf(c.id) + 1
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`sim-school ${activo ? 'sim-school--on' : ''}`}
                  onClick={() => toggleColegio(c.id)}
                  aria-pressed={activo}
                  aria-label={`${c.nombre}, ${c.comuna}, demanda ${c.demanda}${activo ? `, seleccionado como opción ${orden}` : ''}`}
                >
                  <strong>{c.nombre}</strong>
                  <span>{c.comuna} — demanda {c.demanda}</span>
                  {activo ? (
                    <span style={{ fontSize: '0.78rem', color: 'var(--acento)', fontWeight: 700 }}>
                      Opción {orden}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>

          {!seleccion.length ? (
            <p className="small-note" role="status">
              Selecciona al menos un colegio para ver la simulación.
            </p>
          ) : null}

          {resultado?.asignado ? (
            <div className="sim-result" aria-live="polite">
              <h3>Resultado estimado</h3>
              {/* Explicación contextualizada — no solo un número (S4-2) */}
              {explicacionSim ? (
                /* eslint-disable-next-line react/no-danger */
                <p dangerouslySetInnerHTML={{ __html: explicacionSim }} style={{ marginBottom: 8 }} />
              ) : null}
              <p>
                Probabilidad estimada: <strong>{resultado.asignado.prob}%</strong> ·{' '}
                Prioridad: <strong>{prioridadLabels[resultado.nivel]}</strong>
              </p>
              <ul className="sim-list" aria-label="Detalle por cada colegio seleccionado">
                {resultado.detalles.map((d) => (
                  <li key={d.id}>
                    <span>{d.idx}. {d.nombre}</span>
                    <span>{estadoLabel[d.estado] ?? d.estado} — {d.prob}%</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* ══ PREGUNTAS FRECUENTES ══ */}
      <Card style={{ marginTop: 16 }}>
        <CardHeader>
          <CardTitle>Preguntas frecuentes sobre el SAE</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="mito-list">
            <li className="mito-item">
              <p className="mito-item__pregunta">
                <span aria-hidden="true">❓</span> ¿El SAE es una tómbola?
              </p>
              <p className="mito-item__respuesta">
                No. El sistema aplica prioridades definidas por ley y solo realiza un sorteo cuando
                varios postulantes tienen exactamente las mismas condiciones. El sorteo es público y
                certificado por el Ministerio de Educación.
              </p>
            </li>
            <li className="mito-item">
              <p className="mito-item__pregunta">
                <span aria-hidden="true">❓</span> ¿Importa el orden en que pongo los colegios?
              </p>
              <p className="mito-item__respuesta">
                Sí. El sistema evalúa primero tu preferencia N.° 1. Si no hay cupos con tu nivel
                de prioridad ahí, pasa a la opción N.° 2, y así sucesivamente. Pon primero el
                colegio que más quieres.
              </p>
            </li>
            <li className="mito-item">
              <p className="mito-item__pregunta">
                <span aria-hidden="true">❓</span> ¿Vale la pena postular a más colegios?
              </p>
              <p className="mito-item__respuesta">
                Sí. Postular a más colegios mejora tus posibilidades de quedar asignado/a en
                alguno de tus preferidos. Puedes agregar hasta 8.
              </p>
            </li>
            <li className="mito-item">
              <p className="mito-item__pregunta">
                <span aria-hidden="true">❓</span> ¿Qué pasa si no quedo en ninguno de mis colegios?
              </p>
              <p className="mito-item__respuesta">
                El sistema activa una segunda etapa donde se te asigna el establecimiento más cercano
                con vacantes disponibles para el nivel que buscas. No quedas sin colegio.
              </p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  )
}
