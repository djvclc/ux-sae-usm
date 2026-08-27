import { useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { colegios } from '../data/colegios'
import { calcularResultado, prioridadLabels } from '../utils/asignacion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TextSizeBar from '../components/TextSizeBar'
import AlgoSimuladorPasos from '../components/AlgoSimuladorPasos'
import { useTextSize } from '../context/TextSizeContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

/* Datos ficticios de resultados de años anteriores (punto 15.2 del plan) */
const historialAnios = ['2022', '2023', '2024']

const historialAsignacion = {
  labels: historialAnios,
  datasets: [
    {
      label: '1.ª preferencia',
      data: [72, 74, 76],
      backgroundColor: '#0057B7',
      borderRadius: 6,
    },
    {
      label: '2.ª preferencia',
      data: [16, 15, 14],
      backgroundColor: '#4d94d4',
      borderRadius: 6,
    },
    {
      label: '3.ª preferencia o más',
      data: [8, 7, 7],
      backgroundColor: '#a0c4e8',
      borderRadius: 6,
    },
    {
      label: 'Segunda etapa',
      data: [4, 4, 3],
      backgroundColor: '#e2e8f0',
      borderRadius: 6,
    },
  ],
}

const opcionesGrafico = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { font: { size: 13 }, padding: 16 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`,
      },
    },
  },
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: {
      stacked: true,
      max: 100,
      ticks: { callback: (v) => `${v}%` },
      grid: { color: '#e2e8f0' },
    },
  },
}

const kpis = [
  { valor: '76%', etiqueta: 'quedó en su 1.ª preferencia en 2024', color: '#0057B7' },
  { valor: '97%', etiqueta: 'quedó asignado en alguno de sus colegios', color: '#16a34a' },
  { valor: '4,7', etiqueta: 'colegios en promedio por postulante', color: '#ea580c' },
  { valor: '3%', etiqueta: 'requirió segunda etapa de asignación', color: '#374151' },
]

/* Datos de los 4 pasos — texto ampliado para lectura en scroll (S4-1) */
const pasos = [
  {
    num: 1,
    icon: '📋',
    titulo: 'Tú eliges tu lista',
    // S22-2 (corrige E2): sin límite de establecimientos; se recomiendan al menos 6
    desc: 'Durante el período de postulación, tú armas una lista con los colegios que te interesan — sin límite de establecimientos, se recomiendan al menos 6 — y los ordenas de mayor a menor preferencia. El primero de tu lista es el que más quieres conseguir.',
    detalle: 'Puedes cambiar el orden y agregar o quitar colegios todas las veces que necesites antes de la fecha límite. No te apresures: tomarte el tiempo para investigar y comparar vale la pena.',
    color: '#0057B7',
  },
  {
    num: 2,
    icon: '⚖️',
    titulo: 'Cada colegio tiene un orden de prioridad',
    desc: 'La ley define quién tiene preferencia en cada establecimiento. El orden es: primero, quienes tienen un hermano o hermana matriculado/a en ese colegio. Después, estudiantes prioritarios/as (con designación SEP). Luego, hijos/as de funcionarios/as del colegio. Y finalmente, exalumnos/as del establecimiento.',
    // S22-5 (corrige E5): desempate aleatorio por colegio, sin "certificado por MINEDUC"
    detalle: 'Si no tienes ninguna de estas condiciones, participas en el desempate aleatorio junto a otros postulantes sin prioridad especial: cada colegio realiza su propio sorteo (una lotería independiente por establecimiento) cuando hay más postulantes que vacantes.',
    color: '#1A7F37',
  },
  {
    num: 3,
    icon: '⚙️',
    titulo: 'El algoritmo cruza las listas',
    desc: 'Usando el método de Gale-Shapley — el mismo que usan Nueva York, Londres y Ámsterdam — el sistema cruza la lista de todos los postulantes con las prioridades y los cupos de cada colegio. Cada estudiante queda asignado al mejor colegio posible según su posición en la lista y sus condiciones de prioridad.',
    detalle: 'El algoritmo es "strategy-proof": no tiene sentido "jugar estratégicamente" poniendo primero un colegio de menos demanda esperando tener más opciones. Siempre conviene poner primero el colegio que realmente quieres.',
    color: '#6d3b9e',
  },
  {
    num: 4,
    icon: '📬',
    titulo: 'Recibes tu resultado',
    desc: 'En la fecha de resultados recibes una notificación con el colegio al que quedaste asignado/a. El sistema siempre va de tu primera preferencia hacia abajo: si no hay cupo en la N.°1 con tu prioridad, revisa la N.°2, después la N.°3, y así sucesivamente.',
    detalle: 'Si no quedas en ninguno de los colegios de tu lista, el sistema activa una segunda etapa donde se te asigna el establecimiento más cercano con vacantes disponibles para el nivel que buscas. No quedas sin colegio.',
    color: '#C0392B',
  },
]

/* Escenarios predefinidos para cargar el simulador con un caso real (S4-3) */
const ESCENARIOS = [
  {
    id: 'daniela',
    icono: '👩',
    label: 'Caso Daniela',
    desc: 'Sin prioridades especiales. Prefiere 3 colegios en La Florida.',
    perfil: { hermano: false, prioritario: false, funcionario: false, exalumno: false },
    colegios: [3, 6, 1],
  },
  {
    id: 'con-hermano',
    icono: '👨‍👧',
    label: 'Con hermano en Los Andes',
    desc: 'Su hijo mayor estudia ahí: prioridad máxima por ley.',
    perfil: { hermano: true, prioritario: false, funcionario: false, exalumno: false },
    colegios: [1, 6, 3],
  },
  {
    id: 'prioritaria',
    icono: '📋',
    label: 'Estudiante prioritaria (SEP)',
    desc: 'Con designación SEP — segunda prioridad más alta.',
    perfil: { hermano: false, prioritario: true, funcionario: false, exalumno: false },
    colegios: [1, 5, 2],
  },
]

/* Sistemas de asignación en el mundo — referencia académica (S4-4) */
const CONTEXTO_MUNDIAL = [
  {
    flag: '🇺🇸',
    ciudad: 'Nueva York',
    pais: 'EE. UU.',
    desde: '2003',
    logro: 'Redujo de 34.000 a menos de 3.000 los estudiantes que terminaban sin colegio asignado.',
    diferencia: 'Permite pruebas de admisión en escuelas selectivas junto al algoritmo.',
    color: '#1e3a5f',
  },
  {
    flag: '🇬🇧',
    ciudad: 'Londres',
    pais: 'Reino Unido',
    desde: '2004',
    logro: 'Primer país de Europa en aplicar Gale-Shapley a escala de toda una ciudad.',
    diferencia: 'Cada municipio (borough) administra su propio proceso con el mismo algoritmo.',
    color: '#8B0000',
  },
  {
    flag: '🇳🇱',
    ciudad: 'Ámsterdam',
    pais: 'Países Bajos',
    desde: '2015',
    logro: 'Redujo la segregación escolar y aumentó la movilidad social entre comunas.',
    diferencia: 'Integra automáticamente la distancia del hogar como criterio de prioridad.',
    color: '#c95200',
  },
  {
    flag: '🇨🇱',
    ciudad: 'Chile — SAE',
    pais: 'Chile',
    desde: '2016',
    logro: 'Primer país de América Latina en implementarlo a nivel nacional, con más de 300.000 postulantes anuales.',
    diferencia: 'Incluye criterio de equidad para estudiantes prioritarios (SEP) y opera en todas las regiones.',
    color: '#0057B7',
    destacado: true,
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

  /* S22-11 (refinamiento): este simulador no modela vínculos por colegio.
     `calcularResultado` recibe un `perfil` sin `prioridadesPorColegio`, así que
     `nivelPrioridadEnColegio` trata las condiciones marcadas como si aplicaran
     en todos los colegios elegidos (comportamiento previo, coherente aquí). */
  const resultado = useMemo(
    () => (seleccion.length ? calcularResultado(seleccion, perfil) : null),
    [seleccion, perfil],
  )

  const cargarEscenario = (esc) => {
    setPerfil(esc.perfil)
    setSeleccion(esc.colegios)
  }

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

  /* Genera explicación contextualizada del resultado del simulador (S4-2).
     S22-11 (refinamiento): se explica según el nivel real en el colegio asignado
     (asignado.nivel), no según una prioridad global del perfil. */
  const explicacionSim = useMemo(() => {
    if (!resultado?.asignado) return null
    const { asignado } = resultado
    switch (asignado.nivel) {
      case 1:
        return `Tu mejor opción es <strong>${asignado.nombre}</strong> porque tienes un hermano o hermana matriculado/a ahí. Eso te da la <strong>prioridad más alta por ley</strong>.`
      case 2:
        return `Tu mejor opción es <strong>${asignado.nombre}</strong> porque eres estudiante prioritario/a (<abbr title="Subvención Escolar Preferencial">SEP</abbr>). Esta es la segunda prioridad más alta.`
      case 3:
        return `Tu mejor opción es <strong>${asignado.nombre}</strong> porque eres hijo/a de funcionario/a de ese establecimiento. Esta condición te da prioridad sobre el sorteo.`
      case 4:
        return `Tu mejor opción es <strong>${asignado.nombre}</strong> porque eres exalumno/a de ese establecimiento.`
      default:
        return `Tu mejor opción probable es <strong>${asignado.nombre}</strong> a través del sorteo público. Como no tienes prioridades especiales, el sistema evalúa disponibilidad de vacantes.`
    }
  }, [resultado])

  const estadoLabel = {
    asignado: '✅ Mejor opción',
    no_evaluado: '⏭ No evaluado',
    sin_cupos: '🔴 Sin cupos',
    prioridad_insuficiente: '🟡 Prioridad insuficiente',
  }

  return (
    <main className={`page page--module${textoGrande ? ' page--texto-grande' : ''}`}>
      <TextSizeBar pageName="¿Cómo funciona?" />
      <h1>El Sistema de Admisión Escolar</h1>
      <p className="page__lead">
        Más de 300.000 familias pasan por este proceso cada año en Chile. Acá te explicamos
        paso a paso cómo funciona el algoritmo, cuáles son tus prioridades y qué puedes
        hacer para postular con confianza.
      </p>

      {/* ══ 4 PASOS EN FORMATO SCROLL / TIMELINE ══ */}
      <section className="algo-pasos" aria-label="Los 4 pasos del proceso SAE">
        <h2 className="algo-pasos__subtitulo">¿Cómo te asignan un colegio?</h2>
        <div className="algo-timeline">
          {pasos.map((paso, idx) => (
            <div
              key={paso.num}
              className="algo-timeline__item"
              style={{ '--paso-color': paso.color }}
            >
              <div className="algo-timeline__izq" aria-hidden="true">
                <span className="algo-timeline__num">{paso.num}</span>
                {idx < pasos.length - 1 && (
                  <span className="algo-timeline__linea" />
                )}
              </div>
              <div className="algo-timeline__contenido">
                <div className="algo-timeline__header">
                  <span className="algo-timeline__icon">{paso.icon}</span>
                  <h3 className="algo-timeline__titulo">{paso.titulo}</h3>
                </div>
                <p className="algo-timeline__desc">{paso.desc}</p>
                <p className="algo-timeline__detalle">{paso.detalle}</p>
              </div>
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
          {/* ── Escenarios predefinidos ── */}
          <div className="sim-escenarios" aria-labelledby="sim-escenarios-titulo">
            <p id="sim-escenarios-titulo" className="sim-escenarios__titulo">
              💡 Prueba con un caso real:
            </p>
            <div className="sim-escenarios__grid">
              {ESCENARIOS.map((esc) => (
                <button
                  key={esc.id}
                  type="button"
                  className="esc-btn"
                  onClick={() => cargarEscenario(esc)}
                  aria-label={`Cargar escenario: ${esc.label}`}
                >
                  <span className="esc-btn__icono" aria-hidden="true">{esc.icono}</span>
                  <span className="esc-btn__label">{esc.label}</span>
                  <span className="esc-btn__desc">{esc.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <p style={{ fontWeight: 600, marginBottom: 4, marginTop: 20 }}>
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

      {/* ══ VISUALIZACIÓN ANIMADA DEL ALGORITMO ══ */}
      {resultado ? <AlgoSimuladorPasos resultado={resultado} perfil={perfil} /> : null}

      {/* ══ ESTADÍSTICAS HISTÓRICAS — punto 15.2 ══ */}
      <Card style={{ marginTop: 16 }}>
        <CardHeader>
          <CardTitle>Resultados de años anteriores</CardTitle>
          <p className="page__lead" style={{ margin: '6px 0 0' }}>
            Datos del proceso SAE a nivel nacional (ficticios, representativos del sistema real).
          </p>
        </CardHeader>
        <CardContent>
          {/* KPIs de cifras clave */}
          <div className="hist-kpis" aria-label="Cifras clave del proceso SAE">
            {kpis.map((k) => (
              <div key={k.etiqueta} className="hist-kpi" style={{ '--kpi-color': k.color }}>
                <span className="hist-kpi__valor" aria-hidden="true">{k.valor}</span>
                <span className="hist-kpi__label">{k.etiqueta}</span>
              </div>
            ))}
          </div>

          {/* Gráfico de barras apiladas */}
          <div className="hist-grafico" role="img" aria-label="Gráfico de barras apiladas: distribución de asignaciones por preferencia entre 2022 y 2024">
            <p style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.95rem' }}>
              ¿En qué preferencia quedaron asignados los estudiantes?
            </p>
            <div style={{ height: 260 }}>
              <Bar data={historialAsignacion} options={opcionesGrafico} />
            </div>
          </div>

          <p className="form-hint" style={{ marginTop: 10 }}>
            ⚠ Datos ficticios basados en tendencias del proceso SAE. En el sitio real se publicarán los resultados oficiales del Mineduc.
          </p>
        </CardContent>
      </Card>

      {/* ══ CONTEXTO MUNDIAL ══ */}
      <Card style={{ marginTop: 16 }}>
        <CardHeader>
          <CardTitle>El SAE en el mundo: no estás sola/o</CardTitle>
          <p className="page__lead" style={{ margin: '6px 0 0' }}>
            El mismo algoritmo que usa el SAE —<strong>Gale-Shapley</strong>— es usado por ciudades en todo el
            mundo. Sus creadores ganaron el{' '}
            <strong>Premio Nobel de Economía en 2012</strong> por demostrarlo justo y eficiente.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mundo-grid" role="list" aria-label="Países que usan el mismo sistema de asignación escolar">
            {CONTEXTO_MUNDIAL.map((p) => (
              <article
                key={p.ciudad}
                className={`mundo-card${p.destacado ? ' mundo-card--destacado' : ''}`}
                style={{ '--mundo-color': p.color }}
                role="listitem"
              >
                <div className="mundo-card__head">
                  <span className="mundo-card__flag" aria-hidden="true">{p.flag}</span>
                  <div>
                    <p className="mundo-card__ciudad">{p.ciudad}</p>
                    <p className="mundo-card__pais">{p.pais}</p>
                  </div>
                  <span className="mundo-card__desde" aria-label={`Desde ${p.desde}`}>desde {p.desde}</span>
                </div>
                <div className="mundo-card__body">
                  <p className="mundo-card__logro">
                    <strong>Logro clave:</strong> {p.logro}
                  </p>
                  <p className="mundo-card__diferencia">
                    <strong>Diferencia con el SAE:</strong> {p.diferencia}
                  </p>
                </div>
                {p.destacado && (
                  <div className="mundo-card__badge-destacado" aria-label="Este es el sistema chileno">
                    🇨🇱 Tú estás aquí
                  </div>
                )}
              </article>
            ))}
          </div>
          <p className="form-hint" style={{ marginTop: 12 }}>
            Fuentes: Abdulkadiroğlu & Sönmez (2003); Roth & Sotomayor (2012); Ministerio de Educación Chile (2016).
          </p>
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
                {/* S22-5 (corrige E5): desempate aleatorio por colegio, sin "certificado por MINEDUC" */}
                No. El sistema aplica prioridades definidas por ley y solo realiza un desempate
                aleatorio cuando varios postulantes tienen exactamente las mismas condiciones:
                cada colegio hace su propio sorteo, independiente del resto.
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
                alguno de tus preferidos. No hay límite de colegios; el SAE recomienda incluir al menos 6.
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
