import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { colegios } from '../data/colegios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const DRAFT_LIST_KEY = 'sae_react_postulacion_draft_list'

export default function InicioPage() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [textoGrande, setTextoGrande] = useState(false)
  const [texto, setTexto] = useState('')
  const [comuna, setComuna] = useState('')
  const [nivel, setNivel] = useState('')
  const [listaDraft, setListaDraft] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_LIST_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        setListaDraft(parsed.filter((id) => Number.isInteger(id)))
      }
    } catch {
      // Si el storage tiene datos corruptos, se ignoran y se parte limpio.
    }
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
      const matchNivel = !nivel || c.niveles.includes(nivel)
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

  return (
    <main className={`page page--inicio ${textoGrande ? 'page--texto-grande' : ''}`}>
      {showWelcome ? (
        <div className="welcome-banner" role="region" aria-label="Bienvenida primera vez">
          <div className="welcome-banner__inner">
            <span className="welcome-banner__msg">
              👋 Es tu primera vez aqui? Te mostramos como funciona el SAE en 3 pasos cortos.
            </span>
            <div className="welcome-banner__actions">
              <Link className="btn btn--green" to="/algoritmo">
                Empezar tour
              </Link>
              <button type="button" className="welcome-banner__close" onClick={() => setShowWelcome(false)}>
                ✕
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="stage-banner" role="status">
        <div className="stage-banner__inner">
          Estamos en: <strong>Periodo de postulacion</strong> - cierra el{' '}
          <strong>30 de agosto de 2026</strong>
        </div>
      </div>

      <div className="context-bar" role="status" aria-live="polite">
        <div className="context-bar__inner">
          <p>
            Estas en: <strong>Inicio</strong>
          </p>
          <div className="context-bar__text-size">
            <span>Tamano de texto</span>
            <button
              type="button"
              className={!textoGrande ? 'is-on' : ''}
              onClick={() => setTextoGrande(false)}
            >
              Normal
            </button>
            <button
              type="button"
              className={textoGrande ? 'is-on' : ''}
              onClick={() => setTextoGrande(true)}
            >
              Grande
            </button>
          </div>
        </div>
      </div>

      <section className="hero hero--sae">
        <p className="hero__eyebrow">Sistema de Admision Escolar</p>
        <h1>Tu colegio, sin tombolas y con reglas claras</h1>
        <p>
          El SAE asigna a tu hijo o hija segun prioridades por ley. Aqui te
          explicamos como funciona y te ayudamos a postular paso a paso.
        </p>

        <div className="search-box" role="search" aria-label="Buscador de colegios">
          <p className="search-box__title">Buscador de colegios</p>
          <div className="search-grid">
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Nombre del colegio o comuna"
              aria-label="Nombre del colegio o comuna"
            />
            <select
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              aria-label="Filtrar por comuna"
            >
              <option value="">Todas las comunas</option>
              {comunas.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              aria-label="Filtrar por nivel"
            >
              <option value="">Todos los niveles</option>
              <option value="Prekinder">Prekinder</option>
              <option value="Kinder">Kinder</option>
              <option value="Basico">Basico</option>
              <option value="Medio">Medio</option>
            </select>
            <button type="button" className="btn btn--search">
              🔎 Buscar
            </button>
          </div>

          <p className="result-count">
            {resultados.length} colegio{resultados.length !== 1 ? 's' : ''} encontrado
            {resultados.length !== 1 ? 's' : ''}
          </p>
          <div className="school-grid">
            {resultados.map((c) => (
              <article key={c.id} className="school-card">
                <div className="school-card__hero">
                  <span className="school-card__img" aria-hidden="true">
                    🏫
                  </span>
                  <span className={`demand-chip demand-chip--${c.demanda}`}>{c.demanda} demanda</span>
                </div>
                <h3>{c.nombre}</h3>
                <p>
                  {c.direccion}, {c.comuna}
                </p>
                <p className="school-card__meta">
                  {c.vacantes} vacantes - demanda {c.demanda} - {c.distanciaKm} km
                </p>
                <div className="school-card__tags">
                  {c.pie ? <span>PIE</span> : <span>Sin PIE</span>}
                  <span>{c.niveles.join(' / ')}</span>
                </div>
                <div className="school-card__actions">
                  <Link className="btn btn--secondary btn--mini" to={`/colegio?id=${c.id}`}>
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
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="quick-links" aria-label="Accesos rapidos">
        <Link className="quick-card" to="/algoritmo">
          <strong>Como te asignan un colegio</strong>
          <p>Entiende el algoritmo en 4 pasos y simula tu caso.</p>
        </Link>
        <Link className="quick-card" to="/postulacion">
          <strong>Postular ahora</strong>
          <p>Ingresa con ClaveUnica y completa el flujo en 3 pasos.</p>
        </Link>
        <Link className="quick-card" to="/seguimiento">
          <strong>Revisar mi postulacion</strong>
          <p>Consulta estado, resultado y comprobante.</p>
        </Link>
      </section>

      <section className="support-grid" aria-label="Atencion a la ciudadania">
        <Card>
          <CardHeader><CardTitle>Chat de ayuda</CardTitle></CardHeader>
          <CardContent><p>Lunes a viernes, 09:00 a 18:00. Respuesta rapida para dudas de postulacion.</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Call center SAE</CardTitle></CardHeader>
          <CardContent><p>600 600 2626. Tambien puedes solicitar devolucion de llamada.</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Oficina OIRS</CardTitle></CardHeader>
          <CardContent><p>Ingreso de reclamos, sugerencias o consultas con numero de seguimiento.</p></CardContent>
        </Card>
      </section>

      <Card className="notes">
        <CardHeader><CardTitle>Notas de diseno</CardTitle></CardHeader>
        <CardContent>
          <p>
            Esta home replica la jerarquia del HTML original: contexto del proceso,
            buscador prominente, accesos rapidos, ayuda ciudadana y foco en movil.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/cumplimiento">
              Ver cumplimiento punto 13
            </Link>
            <Link className="btn btn--secondary btn--dark" to="/roadmap">
              Ver roadmap de migracion
            </Link>
          </div>
        </CardContent>
      </Card>

      <Link className="floating-cta" to="/postulacion">
        Postular ahora
      </Link>
    </main>
  )
}
