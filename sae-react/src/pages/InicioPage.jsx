import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { colegios, totalVacantes } from '../data/colegios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SchoolIllustration from '../components/SchoolIllustration'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'
import { useTour } from '../context/TourContext'

const DRAFT_LIST_KEY = 'sae_react_postulacion_draft_list'

const PASOS_RAPIDOS = [
  {
    num: 1,
    titulo: 'Conoce cómo funciona',
    desc: 'Entiende el proceso de asignación en 4 pasos simples. Sin tómbolas, con reglas claras.',
    link: '/algoritmo',
    linkText: 'Ver cómo funciona',
    icon: '📖',
  },
  {
    num: 2,
    titulo: 'Busca y compara colegios',
    desc: 'Explora los establecimientos disponibles, revisa sus datos y arma tu lista de preferencias.',
    link: '#buscador',
    linkText: 'Buscar colegios',
    icon: '🔎',
    hash: true,
  },
  {
    num: 3,
    titulo: 'Postula con ClaveÚnica',
    desc: 'Ingresa con tu ClaveÚnica, ordena tus opciones y confirma tu postulación en minutos.',
    link: '/postulacion',
    linkText: 'Ir a postulación',
    icon: '✅',
  },
]

export default function InicioPage() {
  const [showWelcome, setShowWelcome] = useState(true)
  const { textoGrande } = useTextSize()
  const { startTour } = useTour()
  const [texto, setTexto] = useState('')
  const [comuna, setComuna] = useState('')
  const [nivel, setNivel] = useState('')
  const [listaDraft, setListaDraft] = useState([])
  const [buscadorAbierto, setBuscadorAbierto] = useState(true)
  const [showSugerencias, setShowSugerencias] = useState(false)

  const sugerencias = useMemo(() => {
    if (!texto || texto.length < 2) return []
    return colegios
      .filter((c) =>
        c.nombre.toLowerCase().includes(texto.toLowerCase()) ||
        c.comuna.toLowerCase().includes(texto.toLowerCase())
      )
      .slice(0, 5)
  }, [texto])

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_LIST_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        setListaDraft(parsed.filter((id) => Number.isInteger(id)))
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    localStorage.setItem(DRAFT_LIST_KEY, JSON.stringify(listaDraft))
  }, [listaDraft])

  const resultados = useMemo(() => {
    return colegios.filter((c) => {
      const matchTexto =
        !texto ||
        c.nombre.toLowerCase().includes(texto.toLowerCase()) ||
        c.comuna.toLowerCase().includes(texto.toLowerCase())
      const matchComuna = !comuna || c.comuna === comuna
      const matchNivel = !nivel || c.niveles.some((n) => n.toLowerCase().includes(nivel.toLowerCase()))
      return matchTexto && matchComuna && matchNivel
    })
  }, [texto, comuna, nivel])

  const comunas = [...new Set(colegios.map((c) => c.comuna))].sort()

  const agregarALista = (id) => {
    setListaDraft((prev) => {
      if (prev.includes(id) || prev.length >= 8) return prev
      return [...prev, id]
    })
  }

  const scrollToBuscador = () => {
    setBuscadorAbierto(true)
    setTimeout(() => {
      document.getElementById('buscador')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <main className={`page page--inicio ${textoGrande ? 'page--texto-grande' : ''}`}>
      {showWelcome && (
        <div className="welcome-banner" role="region" aria-label="Bienvenida primera vez">
          <div className="welcome-banner__inner">
            <span className="welcome-banner__msg">
              Es tu primera vez aquí? Te mostramos cómo funciona el SAE en 3 pasos cortos.
            </span>
            <div className="welcome-banner__actions">
              <button
                type="button"
                className="btn btn--primary btn--mini"
                onClick={() => { setShowWelcome(false); startTour() }}
              >
                Iniciar tour guiado
              </button>
              <button type="button" className="welcome-banner__close" onClick={() => setShowWelcome(false)}>
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <TextSizeBar pageName="Inicio" />

      {/* ── HERO: Etapa actual del proceso ── */}
      <section className="hero hero--sae">
        <div className="hero-stage">
          <span className="hero-stage__badge">Etapa actual</span>
          <h1>Estamos en período de postulación</h1>
          <p className="hero-stage__date">
            Tienes hasta el <strong>30 de agosto de 2026</strong> para postular a los colegios que prefieras.
          </p>
          <div className="hero__actions" style={{ justifyContent: 'center' }}>
            <Link className="btn btn--primary btn--grande" to="/postulacion">
              Postular ahora
            </Link>
            <Link className="btn btn--secondary" to="/calendario">
              Ver calendario completo
            </Link>
          </div>
        </div>
      </section>

      {/* ── MINI-GUÍA: 3 pasos rápidos ── */}
      <section className="pasos-inicio" aria-label="Cómo funciona en 3 pasos">
        <h2 className="pasos-inicio__titulo">¿Cómo postular? 3 pasos simples</h2>
        <div className="pasos-inicio__grid">
          {PASOS_RAPIDOS.map((paso) => (
            <div key={paso.num} className="paso-inicio">
              <span className="paso-inicio__icon">{paso.icon}</span>
              <span className="paso-inicio__num">Paso {paso.num}</span>
              <h3 className="paso-inicio__titulo">{paso.titulo}</h3>
              <p className="paso-inicio__desc">{paso.desc}</p>
              {paso.hash ? (
                <button
                  type="button"
                  className="btn btn--secondary btn--mini"
                  onClick={scrollToBuscador}
                >
                  {paso.linkText}
                </button>
              ) : (
                <Link className="btn btn--secondary btn--mini" to={paso.link}>
                  {paso.linkText}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── ACCESOS RÁPIDOS ── */}
      <section className="quick-links" aria-label="Accesos rápidos">
        <Link className="quick-card" to="/algoritmo">
          <strong>¿Cómo te asignan un colegio?</strong>
          <p>Entiende el proceso en 4 pasos y simula tu caso.</p>
        </Link>
        <Link className="quick-card" to="/seguimiento">
          <strong>Revisar mi postulación</strong>
          <p>Consulta el estado, el resultado y descarga tu comprobante.</p>
        </Link>
        <Link className="quick-card" to="/perfil">
          <strong>Mis datos y prioridades</strong>
          <p>Revisa tus criterios de prioridad antes de postular.</p>
        </Link>
      </section>

      {/* ── BUSCADOR DE COLEGIOS (colapsable) ── */}
      <section id="buscador" className="buscador-section">
        <div className="buscador-header">
          <h2>Busca colegios</h2>
        </div>

            <div className="search-box" role="search" aria-label="Buscador de colegios">
              <div className="search-grid">
                <div className="autocomplete-wrap">
                  <input
                    type="text"
                    value={texto}
                    onChange={(e) => { setTexto(e.target.value); setShowSugerencias(true) }}
                    onFocus={() => setShowSugerencias(true)}
                    onBlur={() => setTimeout(() => setShowSugerencias(false), 200)}
                    placeholder="Nombre del colegio o comuna"
                    aria-label="Nombre del colegio o comuna"
                    aria-autocomplete="list"
                    aria-expanded={showSugerencias && sugerencias.length > 0}
                    autoComplete="off"
                  />
                  {showSugerencias && sugerencias.length > 0 && (
                    <ul className="autocomplete-list" role="listbox" aria-label="Sugerencias de colegios">
                      {sugerencias.map((c) => (
                        <li
                          key={c.id}
                          role="option"
                          className="autocomplete-item"
                          onMouseDown={() => { setTexto(c.nombre); setShowSugerencias(false) }}
                        >
                          <strong>{c.nombre}</strong>
                          <span>{c.comuna} · {c.demanda} demanda</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <select
                  value={comuna}
                  onChange={(e) => setComuna(e.target.value)}
                  aria-label="Filtrar por comuna"
                >
                  <option value="">Todas las comunas</option>
                  {comunas.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  aria-label="Filtrar por nivel"
                >
                  <option value="">Todos los niveles</option>
                  <option value="Prekínder">Prekínder</option>
                  <option value="Kínder">Kínder</option>
                  <option value="Básico">Básico</option>
                  <option value="Medio">Medio</option>
                </select>
              </div>

              <p className="result-count">
                {resultados.length} colegio{resultados.length !== 1 ? 's' : ''} encontrado
                {resultados.length !== 1 ? 's' : ''}
                {listaDraft.length > 0 && (
                  <span> · <strong>{listaDraft.length} en tu lista</strong></span>
                )}
              </p>
            </div>

            <div className="school-grid">
              {resultados.map((c) => {
                const vac = totalVacantes(c)
                const dist = c.distanciaBase
                const distLabel = dist < 2 ? 'Cerca' : dist < 4 ? 'Media distancia' : 'Lejos'
                return (
                  <article key={c.id} className="school-card">
                    <div className="school-card__hero">
                      <SchoolIllustration colegioId={c.id} demanda={c.demanda} />
                      <span
                        className={`demand-chip demand-chip--${c.demanda}`}
                        aria-label={`Demanda ${c.demanda}`}
                      >
                        {c.demanda} demanda
                      </span>
                    </div>
                    <div className="school-card__body">
                      <h3>{c.nombre}</h3>
                      <p className="school-card__addr">{c.direccion}, {c.comuna}</p>
                      <p className="school-card__meta">
                        {dist} km · {distLabel} — {vac} vacantes
                      </p>
                      <div className="school-card__tags">
                        {c.nee.programa
                          ? <span><abbr title="Programa de Integración Escolar">PIE</abbr> incluido</span>
                          : <span>Sin programa PIE</span>}
                        <span>{c.jornada === 'Completa' ? 'Jornada completa' : 'Jornada parcial'}</span>
                      </div>
                      <div className="school-card__actions">
                        <Link
                          className="btn btn--secondary btn--mini"
                          to={`/colegio?id=${c.id}`}
                          aria-label={`Ver ficha completa de ${c.nombre}`}
                        >
                          Ver ficha
                        </Link>
                        <button
                          type="button"
                          className={`btn btn--mini ${listaDraft.includes(c.id) ? 'btn--green' : 'btn--primary'}`}
                          onClick={() => agregarALista(c.id)}
                          disabled={!listaDraft.includes(c.id) && listaDraft.length >= 8}
                        >
                          {listaDraft.includes(c.id) ? '✓ En tu lista' : '+ A mi lista'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
      </section>

      {/* ── SOPORTE ── */}
      <section className="support-grid" aria-label="Atención a la ciudadanía">
        <Card>
          <CardHeader><CardTitle>Chat de ayuda</CardTitle></CardHeader>
          <CardContent>
            <p>Lunes a viernes, 09:00 a 18:00. Respuesta rápida para dudas de postulación.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Call center SAE</CardTitle></CardHeader>
          <CardContent>
            <p>
              Llama directamente:{' '}
              <a href="tel:6006002626" className="tel-link" aria-label="Llamar al call center SAE">
                600 600 2626
              </a>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Oficina OIRS</CardTitle></CardHeader>
          <CardContent>
            <p>
              Ingresa reclamos, sugerencias o consultas.{' '}
              <a href="https://www.mineduc.cl/oirs/" className="tel-link" target="_blank" rel="noopener noreferrer">
                Ir a la OIRS
              </a>
            </p>
          </CardContent>
        </Card>
      </section>

      <Link className="floating-cta" to="/postulacion" aria-label="Ir a postulación">
        Postular ahora
      </Link>
    </main>
  )
}
