import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { colegios, totalVacantes } from '../data/colegios'
// S16-1: ordenamiento del buscador (investigacion_vitrina_sae.md)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SchoolIllustration from '../components/SchoolIllustration'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'
import { useTour } from '../context/TourContext'

const DRAFT_LIST_KEY = 'sae_react_postulacion_draft_list'

const PASOS_RAPIDOS = [
  {
    num: 1,
    titulo: 'Entiende cómo te asignan un colegio',
    desc: 'El SAE no es una tómbola: hay reglas claras y transparentes. Te explicamos el proceso en 4 pasos cortos — cuándo importa el orden de tu lista y cuáles son tus prioridades.',
    link: '/algoritmo',
    linkText: 'Leer cómo funciona el sistema',
    icon: '📖',
  },
  {
    num: 2,
    titulo: 'Explora y compara colegios',
    desc: 'Busca establecimientos por nombre o comuna, revisa sus datos (SIMCE, vacantes, jornada) y compáralos antes de armar tu lista definitiva.',
    link: '#buscador',
    linkText: 'Ver colegios disponibles',
    icon: '🔎',
    hash: true,
  },
  {
    num: 3,
    titulo: 'Postula con ClaveÚnica',
    desc: 'Cuando tengas tu lista lista, el proceso de postulación toma menos de 10 minutos. Solo necesitas tu ClaveÚnica del Estado chileno.',
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
  const [sortBy, setSortBy] = useState('default')

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

  // S16-1: ordenamiento del buscador por criterio seleccionado
  const ordenados = useMemo(() => {
    const arr = [...resultados]
    const demandaNum = { alta: 2, media: 1, baja: 0 }
    if (sortBy === 'simce') return arr.sort((a, b) => {
      const sa = Math.round((a.simce.lectura + a.simce.matematica + a.simce.ciencias + a.simce.historia) / 4)
      const sb = Math.round((b.simce.lectura + b.simce.matematica + b.simce.ciencias + b.simce.historia) / 4)
      return sb - sa
    })
    if (sortBy === 'vacantes')  return arr.sort((a, b) => totalVacantes(b) - totalVacantes(a))
    if (sortBy === 'distancia') return arr.sort((a, b) => a.distanciaBase - b.distanciaBase)
    if (sortBy === 'demanda')   return arr.sort((a, b) => demandaNum[a.demanda] - demandaNum[b.demanda])
    return arr
  }, [resultados, sortBy])

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
          </div>
          <p className="hero-stage__hint">¿Primera vez aquí? Baja y te explicamos todo el proceso.</p>
        </div>
      </section>

      {/* ── GUÍA VERTICAL 3 PASOS ── */}
      <section className="guia-pasos" aria-label="Proceso de postulación en 3 pasos">
        <h2 className="guia-pasos__titulo">¿Cómo funciona la postulación?</h2>
        <p className="guia-pasos__subtitulo">
          Sigue los pasos en orden — cada uno toma unos minutos y te acerca al colegio que prefieres.
        </p>
        <div className="guia-pasos__lista">
          {PASOS_RAPIDOS.map((paso, idx) => (
            <div key={paso.num} className="guia-item">
              <div className="guia-item__izq" aria-hidden="true">
                <span className="guia-item__num">{paso.num}</span>
                {idx < PASOS_RAPIDOS.length - 1 && <span className="guia-item__linea" />}
              </div>
              <div className="guia-item__cuerpo">
                <div className="guia-item__head">
                  <span className="guia-item__icon">{paso.icon}</span>
                  <h3 className="guia-item__titulo">{paso.titulo}</h3>
                </div>
                <p className="guia-item__desc">{paso.desc}</p>
                {paso.hash ? (
                  <button type="button" className="guia-item__link" onClick={scrollToBuscador}>
                    {paso.linkText} ↓
                  </button>
                ) : (
                  <Link className="guia-item__link" to={paso.link}>
                    {paso.linkText} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUSCADOR DE COLEGIOS ── */}
      <section id="buscador" className="buscador-section">
        <div className="buscador-intro">
          <h2 className="buscador-intro__titulo">Busca colegios</h2>
          <p className="buscador-intro__desc">Busca por nombre o comuna y agrega los que te interesen a tu lista.</p>
        </div>

        {/* S16-1: selector de orden del buscador */}
        <div className="buscador-sort">
          <label htmlFor="sort-colegios" className="buscador-sort__label">Ordenar por:</label>
          <select
            id="sort-colegios"
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ maxWidth: 220 }}
          >
            <option value="default">Relevancia (defecto)</option>
            <option value="simce">Mayor SIMCE</option>
            <option value="vacantes">Más vacantes</option>
            <option value="distancia">Menor distancia</option>
            <option value="demanda">Menor demanda</option>
          </select>
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
              {ordenados.map((c) => {
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
                        <span>{c.vacantes[0]?.jornada === 'Completa' ? 'Jornada completa' : 'Jornada parcial'}</span>
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

    </main>
  )
}
