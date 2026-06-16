import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { colegiosById, totalVacantes } from '../data/colegios'
import SchoolIllustration from '../components/SchoolIllustration'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'

const DRAFT_LIST_KEY = 'sae_react_postulacion_draft_list'

const nivelLabel = {
  preKinder: 'Prekínder',
  kinder:    'Kínder',
  basico:    '1.° – 8.° Básico',
  medio:     '1.° – 4.° Medio',
}

const nivelColor = {
  preKinder: '#e8f4fd',
  kinder:    '#fef3e2',
  basico:    '#e8f2ee',
  medio:     '#f0edf8',
}

const prioritarioLabel = {
  hermano:        'Hermano/a matriculado/a',
  cercano:        'Residencia cercana',
  nee:            'Necesidades educativas especiales',
  vulnerabilidad: 'Vulnerabilidad socioeconómica',
}

function simcePct(val) {
  return Math.round(((val - 150) / (350 - 150)) * 100)
}

/* ── Barra SIMCE ── */
function SimceBar({ label, icon, valor, comunal }) {
  const pV = simcePct(valor)
  const pC = simcePct(comunal)
  const sobre = valor >= comunal
  const diff = valor - comunal
  return (
    <div className="simce-row" role="listitem">
      <div className="simce-row__head">
        <span className="simce-row__icon" aria-hidden="true">{icon}</span>
        <span className="simce-row__label">{label}</span>
        <span
          className={`simce-badge ${sobre ? 'simce-badge--pos' : 'simce-badge--neg'}`}
          aria-label={`${sobre ? 'Sobre' : 'Bajo'} el promedio comunal por ${Math.abs(diff)} puntos`}
        >
          {sobre ? '▲' : '▼'} {sobre ? '+' : ''}{diff} pts
        </span>
      </div>
      <div className="simce-row__track" aria-hidden="true">
        <div className="simce-row__bar simce-row__bar--comunal" style={{ width: `${pC}%` }} />
        <div
          className={`simce-row__bar simce-row__bar--colegio ${sobre ? 'simce-row__bar--sobre' : 'simce-row__bar--bajo'}`}
          style={{ width: `${pV}%` }}
        />
      </div>
      <div className="simce-row__nums">
        <span className="simce-row__score">{valor}</span>
        <span className="simce-row__comunal">Comunal: {comunal}</span>
      </div>
    </div>
  )
}

/* ── Indicador con ícono grande ── */
function Indicador({ activo, icon, iconNo, label, labelNo, color }) {
  return (
    <div className={`ind-card ${activo ? 'ind-card--on' : 'ind-card--off'}`} style={activo ? { '--ind-color': color } : {}}>
      <span className="ind-card__icon" aria-hidden="true">{activo ? icon : iconNo ?? icon}</span>
      <span className="ind-card__label">{activo ? label : labelNo ?? label}</span>
      <span className={`ind-card__badge ${activo ? 'ind-card__badge--si' : 'ind-card__badge--no'}`}>
        {activo ? 'Sí' : 'No'}
      </span>
    </div>
  )
}

export default function ColegioPage() {
  const { textoGrande } = useTextSize()
  const [params]    = useSearchParams()
  const id          = Number(params.get('id'))
  const colegio     = colegiosById[id]
  const [lista, setLista]   = useState([])
  const [agregado, setAgregado] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_LIST_KEY)
      if (raw) { const p = JSON.parse(raw); if (Array.isArray(p)) setLista(p) }
    } catch { /* noop */ }
  }, [])

  const yaEsta    = lista.includes(id)
  const listaLlena = lista.length >= 8

  const agregarALista = () => {
    if (yaEsta || listaLlena) return
    const nueva = [...lista, id]
    setLista(nueva)
    localStorage.setItem(DRAFT_LIST_KEY, JSON.stringify(nueva))
    setAgregado(true)
    setTimeout(() => setAgregado(false), 3500)
  }

  if (!colegio) {
    return (
      <main className={`page${textoGrande ? ' page--texto-grande' : ''}`}>
        <h1>Colegio no encontrado</h1>
        <p className="page__lead">No encontramos un establecimiento con ese identificador.</p>
        <Link className="btn btn--primary" to="/">← Volver al inicio</Link>
      </main>
    )
  }

  const vac           = totalVacantes(colegio)
  const pctTitulados  = colegio.docentes.titulados
  const simcePromedio = Math.round(
    (colegio.simce.lectura + colegio.simce.matematica + colegio.simce.ciencias + colegio.simce.historia) / 4
  )
  const comunalPromedio = Math.round(
    (colegio.promedioComunal.lectura + colegio.promedioComunal.matematica +
     colegio.promedioComunal.ciencias + colegio.promedioComunal.historia) / 4
  )
  const simceSobre = simcePromedio >= comunalPromedio

  return (
    <main className={`page ficha-page${textoGrande ? ' page--texto-grande' : ''}`}>

      {/* Breadcrumb */}
      <nav className="ficha-breadcrumb" aria-label="Navegación de retorno">
        <Link to="/" className="ficha-breadcrumb__link">← Explorar colegios</Link>
        <span aria-hidden="true"> / </span>
        <span className="ficha-breadcrumb__current">{colegio.nombre}</span>
      </nav>

      <TextSizeBar pageName="Ficha del colegio" />

      {/* ══ ILUSTRACIÓN DEL COLEGIO ══ */}
      <div className="ficha-photo">
        <SchoolIllustration
          colegioId={colegio.id}
          demanda={colegio.demanda}
          width="100%"
          height={220}
        />
      </div>

      {/* ══ HERO ══ */}
      <section className="ficha-hero">
        <div className="ficha-hero__body">
          <div className="ficha-hero__left">
            <div className="ficha-hero__emoji-wrap" aria-hidden="true">
              <span className="ficha-hero__emoji">🏫</span>
            </div>
          </div>
          <div className="ficha-hero__info">
            <div className="ficha-hero__chips">
              <span className={`fh-chip fh-chip--demand fh-chip--${colegio.demanda}`}>
                {colegio.demanda === 'alta' ? '🔥' : colegio.demanda === 'media' ? '📊' : '✅'}{' '}
                Demanda {colegio.demanda}
              </span>
              <span className={`fh-chip ${simceSobre ? 'fh-chip--sobre' : 'fh-chip--bajo'}`}>
                {simceSobre ? '📈' : '📉'} SIMCE {simcePromedio} pts
              </span>
              <span className="fh-chip fh-chip--jornada">
                {colegio.jornada === 'Completa' ? '🕐 Jornada completa' : '⏱ Jornada parcial'}
              </span>
            </div>
            <h1 className="ficha-hero__nombre">{colegio.nombre}</h1>
            <p className="ficha-hero__dir">
              <span aria-hidden="true">📍</span>{' '}
              {colegio.direccion}, {colegio.comuna}
            </p>
            <p className="ficha-hero__niveles">
              {colegio.niveles.map(n => (
                <span key={n} className="ficha-hero__nivel-tag">{n}</span>
              ))}
            </p>
          </div>
        </div>

        {/* Prioridades reconocidas */}
        {colegio.prioritarios?.length > 0 && (
          <div className="ficha-hero__prioridades">
            <span className="ficha-hero__prioridades-label">Prioridades reconocidas por este colegio:</span>
            <div className="ficha-hero__prio-chips">
              {colegio.prioritarios.map(p => (
                <span key={p} className="prio-chip">
                  ✓ {prioritarioLabel[p] ?? p}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ══ QUICK STATS ══ */}
      <div className="ficha-quickbar" role="list" aria-label="Indicadores clave del establecimiento">
        {[
          { icon: '🪑', num: vac,                      lbl: 'vacantes disponibles',     color: '#1e3a5f' },
          { icon: '👩‍🏫', num: `${pctTitulados}%`,       lbl: 'docentes titulados/as',   color: '#2d6a4f' },
          { icon: '📍', num: `${colegio.distanciaBase} km`, lbl: 'de distancia base',    color: '#7b3f96' },
          { icon: '🏫', num: colegio.docentes.total,   lbl: 'docentes en total',         color: '#b35c1e' },
        ].map(({ icon, num, lbl, color }) => (
          <div key={lbl} className="qs-card" role="listitem" style={{ '--qs-color': color }}>
            <span className="qs-card__icon" aria-hidden="true">{icon}</span>
            <span className="qs-card__num">{num}</span>
            <span className="qs-card__lbl">{lbl}</span>
          </div>
        ))}
      </div>

      {/* ══ CTA AGREGAR ══ */}
      <div className="ficha-cta-zone">
        {yaEsta ? (
          <div className="ficha-cta-zone__ok" role="status">
            <span className="ficha-cta-zone__ok-icon" aria-hidden="true">✅</span>
            <div>
              <strong>{colegio.nombre}</strong> ya está en tu lista de postulación.
              <Link to="/postulacion" className="ficha-cta-zone__link"> Ver mi lista →</Link>
            </div>
          </div>
        ) : listaLlena ? (
          <div className="ficha-cta-zone__llena" role="status">
            <span aria-hidden="true">⚠</span> Tu lista ya tiene 8 colegios (el máximo).{' '}
            <Link to="/postulacion" className="tel-link">Quita alguno en Postulación</Link> para agregar este.
          </div>
        ) : (
          <div className="ficha-cta-zone__add">
            <button
              type="button"
              className="btn btn--primary btn--grande ficha-cta-zone__btn"
              onClick={agregarALista}
              aria-label={`Agregar ${colegio.nombre} a mi lista de postulación`}
            >
              + Agregar a mi lista de postulación
            </button>
            <span className="form-hint">{lista.length} de 8 colegios en tu lista.</span>
          </div>
        )}
        {agregado ? (
          <p className="ficha-cta-zone__aviso" role="status" aria-live="polite">
            ✅ ¡Agregado! <Link to="/postulacion" className="tel-link">Ir a postulación →</Link>
          </p>
        ) : null}
      </div>

      {/* ══ GRID PRINCIPAL ══ */}
      <div className="ficha-grid">

        {/* ── Vacantes por nivel ── */}
        <section className="ficha-section ficha-section--vacantes" aria-labelledby="vacantes-titulo">
          <h2 className="ficha-section__title" id="vacantes-titulo">
            <span className="ficha-section__icon" aria-hidden="true">🪑</span>
            Vacantes por nivel
          </h2>
          <p className="form-hint" style={{ marginBottom: 14 }}>
            Estimación. El número definitivo se publica al inicio del proceso.
          </p>
          <div className="vacantes-grid">
            {Object.entries(colegio.vacantes).map(([nivel, cantidad]) => (
              <div key={nivel} className="vacante-card" style={{ background: nivelColor[nivel] ?? '#f2f4f7' }}>
                <span className="vacante-card__num">{cantidad}</span>
                <span className="vacante-card__nivel">{nivelLabel[nivel] ?? nivel}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── SIMCE ── */}
        <section className="ficha-section ficha-section--simce" aria-labelledby="simce-titulo">
          <h2 className="ficha-section__title" id="simce-titulo">
            <span className="ficha-section__icon" aria-hidden="true">📊</span>
            Resultados <abbr title="Sistema de Medición de la Calidad de la Educación">SIMCE</abbr>
          </h2>

          {/* Resumen general */}
          <div className="simce-resumen">
            <div className={`simce-resumen__score ${simceSobre ? 'simce-resumen__score--pos' : 'simce-resumen__score--neg'}`}>
              <span className="simce-resumen__num">{simcePromedio}</span>
              <span className="simce-resumen__lbl">promedio del colegio</span>
            </div>
            <div className="simce-resumen__vs">
              <span>{simceSobre ? '▲ Sobre' : '▼ Bajo'} el promedio comunal ({comunalPromedio} pts)</span>
            </div>
          </div>

          <div className="simce-legend" aria-hidden="true">
            <span className="simce-legend__item simce-legend__item--colegio">Este colegio</span>
            <span className="simce-legend__item simce-legend__item--comunal">Promedio comunal</span>
          </div>

          <div className="simce-chart" role="list" aria-label="Resultados SIMCE por área">
            <SimceBar icon="📖" label="Lectura"    valor={colegio.simce.lectura}     comunal={colegio.promedioComunal.lectura} />
            <SimceBar icon="🔢" label="Matemática" valor={colegio.simce.matematica}  comunal={colegio.promedioComunal.matematica} />
            <SimceBar icon="🔬" label="Ciencias"   valor={colegio.simce.ciencias}    comunal={colegio.promedioComunal.ciencias} />
            <SimceBar icon="🌎" label="Historia"   valor={colegio.simce.historia}    comunal={colegio.promedioComunal.historia} />
          </div>
        </section>

        {/* ── Docentes ── */}
        <section className="ficha-section ficha-section--docentes" aria-labelledby="docentes-titulo">
          <h2 className="ficha-section__title" id="docentes-titulo">
            <span className="ficha-section__icon" aria-hidden="true">👩‍🏫</span>
            Equipo docente
          </h2>
          <div className="docentes-layout">
            <div className="docentes-big">
              <span className="docentes-big__num">{colegio.docentes.total}</span>
              <span className="docentes-big__lbl">docentes en total</span>
            </div>
            <div className="docentes-bar-wrap">
              <div className="docentes-bar-label">
                <span>Porcentaje con título universitario</span>
                <strong>{pctTitulados}%</strong>
              </div>
              <div
                className="docentes-barra"
                role="progressbar"
                aria-valuenow={pctTitulados}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${pctTitulados}% de docentes con título universitario`}
              >
                <div
                  className="docentes-barra__fill"
                  style={{ width: `${pctTitulados}%` }}
                />
                <span className="docentes-barra__pct" aria-hidden="true">{pctTitulados}%</span>
              </div>
              <p className="form-hint" style={{ marginTop: 6 }}>
                {pctTitulados >= 90
                  ? 'La gran mayoría del equipo cuenta con formación universitaria completa.'
                  : pctTitulados >= 75
                    ? 'La mayor parte del equipo tiene titulación universitaria.'
                    : 'Una parte del equipo aún está en proceso de titulación.'}
              </p>
            </div>
          </div>
        </section>

        {/* ── NEE / Inclusión ── */}
        <section className="ficha-section ficha-section--nee" aria-labelledby="nee-titulo">
          <h2 className="ficha-section__title" id="nee-titulo">
            <span className="ficha-section__icon" aria-hidden="true">♿</span>
            Inclusión y <abbr title="Necesidades Educativas Especiales">NEE</abbr>
          </h2>
          <div className="ind-grid" role="list" aria-label="Indicadores de inclusión y NEE">
            <Indicador activo={colegio.nee.programa} icon="♿" label="Programa PIE" labelNo="Sin Programa PIE"       color="#2d6a4f" />
            <Indicador activo={colegio.nee.psicologa} icon="🧠" label="Psicóloga/o" labelNo="Sin psicóloga/o propio" color="#2d6a4f" />
            <Indicador activo={colegio.nee.fono}     icon="🗣️" label="Fonoaudióloga/o" labelNo="Sin fonoaudióloga/o" color="#2d6a4f" />
            <Indicador activo={colegio.nee.rampa}    icon="🚪" label="Acceso universal" labelNo="Sin rampas"         color="#2d6a4f" />
          </div>
        </section>

        {/* ── Seguridad ── */}
        <section className="ficha-section ficha-section--seg" aria-labelledby="seg-titulo">
          <h2 className="ficha-section__title" id="seg-titulo">
            <span className="ficha-section__icon" aria-hidden="true">🛡️</span>
            Seguridad
          </h2>
          <div className="ind-grid" role="list" aria-label="Medidas de seguridad del establecimiento">
            <Indicador activo={colegio.seguridad.camaras}     icon="📹" label="Cámaras de seguridad"     labelNo="Sin cámaras"         color="#1e3a5f" />
            <Indicador activo={colegio.seguridad.porteria}    icon="🚪" label="Portería controlada"      labelNo="Sin portería"         color="#1e3a5f" />
            <Indicador activo={colegio.seguridad.antibullying} icon="🛡️" label="Protocolo anti-bullying" labelNo="Sin protocolo"        color="#1e3a5f" />
            <Indicador activo={colegio.seguridad.semaforo}    icon="🚦" label="Semáforo peatonal"        labelNo="Sin semáforo"         color="#1e3a5f" />
          </div>
        </section>

        {/* ── Métodos de enseñanza ── */}
        <section className="ficha-section ficha-section--metodos" aria-labelledby="metodos-titulo">
          <h2 className="ficha-section__title" id="metodos-titulo">
            <span className="ficha-section__icon" aria-hidden="true">📚</span>
            Métodos de enseñanza
          </h2>
          <ul className="metodos-list" aria-label="Enfoques y métodos pedagógicos">
            {colegio.metodos.map((m, i) => (
              <li key={i} className="metodos-item">
                <span className="metodos-item__num" aria-hidden="true">{i + 1}</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Proyecto educativo ── */}
        <section className="ficha-section ficha-section--proyecto" aria-labelledby="proyecto-titulo">
          <h2 className="ficha-section__title" id="proyecto-titulo">
            <span className="ficha-section__icon" aria-hidden="true">🎯</span>
            Proyecto educativo
          </h2>
          <blockquote className="ficha-proyecto">
            <p>{colegio.proyecto}</p>
          </blockquote>
        </section>

      </div>{/* /ficha-grid */}

      {/* ══ CTA FINAL ══ */}
      <div className="ficha-footer-cta">
        {yaEsta ? (
          <Link className="btn btn--green btn--grande" to="/postulacion">
            ✅ Ya en tu lista — Ir a postulación
          </Link>
        ) : !listaLlena ? (
          <button
            type="button"
            className="btn btn--primary btn--grande"
            onClick={agregarALista}
            aria-label={`Agregar ${colegio.nombre} a mi lista de postulación`}
          >
            + Agregar a mi lista de postulación
          </button>
        ) : null}
        <Link className="btn btn--secondary" to="/">
          ← Seguir explorando colegios
        </Link>
      </div>

    </main>
  )
}
