import { Component, lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { TextSizeProvider, useTextSize } from './context/TextSizeContext'
import { TourProvider } from './context/TourContext'
import GuidedTour from './components/GuidedTour'
import ChatAyuda from './components/ChatAyuda'

/* Escala global de fuente — cambia font-size en html para que todos los rem escalen (S13-g) */
function GlobalFontSize() {
  const { textoGrande } = useTextSize()
  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? '18px' : ''
  }, [textoGrande])
  return null
}

/* Error Boundary - contiene fallos de runtime sin romper toda la app (S9-2) */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <main className="page not-found" role="alert">
          <p className="not-found__code" aria-hidden="true">!</p>
          <h1 className="not-found__title">Algo salió mal</h1>
          <p className="not-found__desc">
            Hubo un error inesperado al cargar esta sección. Intenta recargar la página o vuelve al inicio.
          </p>
          <div className="hero__actions" style={{ justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              Recargar página
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => { this.setState({ error: null }); window.location.href = '/' }}
            >
              Volver al inicio
            </button>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}

/* Carga diferida de paginas - reduce bundle inicial para dispositivos lentos (S16-1) */
const InicioPage       = lazy(() => import('./pages/InicioPage'))
const PerfilPage       = lazy(() => import('./pages/PerfilPage'))
const AlgoritmoPage    = lazy(() => import('./pages/AlgoritmoPage'))
const CalendarioPage   = lazy(() => import('./pages/CalendarioPage'))
const PostulacionPage  = lazy(() => import('./pages/PostulacionPage'))
const SeguimientoPage  = lazy(() => import('./pages/SeguimientoPage'))
const CumplimientoPage = lazy(() => import('./pages/CumplimientoPage'))
const RoadmapPage      = lazy(() => import('./pages/RoadmapPage'))
const ColegioPage      = lazy(() => import('./pages/ColegioPage'))
const ComparadorPage   = lazy(() => import('./pages/ComparadorPage'))
const NotFoundPage     = lazy(() => import('./pages/NotFoundPage'))

/* SEO por ruta — título + meta description + Open Graph (S14-t, S14-o, S5-2)
   Implementado con DOM API nativa (sin react-helmet) para 0 dependencias extra. */
const seoData = {
  '/': {
    title: 'SAE — Sistema de Admisión Escolar',
    desc: 'Postula a colegios públicos y particulares subvencionados de Chile. Conoce cómo funciona el sistema de asignación y revisa los establecimientos disponibles.',
    og: 'Postula al SAE — Sistema de Admisión Escolar de Chile',
  },
  '/perfil': {
    title: 'Mis datos — SAE',
    desc: 'Revisa y edita tus datos personales y criterios de prioridad para la postulación al SAE.',
    og: 'Mis datos — SAE',
  },
  '/algoritmo': {
    title: '¿Cómo funciona? — SAE',
    desc: 'Entiende el algoritmo de asignación del SAE en 4 pasos simples. Simula tu postulación y conoce tus prioridades.',
    og: '¿Cómo funciona el SAE? Entiende el proceso en 4 pasos',
  },
  '/calendario': {
    title: 'El proceso y el calendario — SAE',
    desc: 'Fechas clave del proceso de admisión escolar: postulación, resultados, matrículas y listas de espera.',
    og: 'Calendario SAE — Fechas del proceso de admisión',
  },
  '/colegio': {
    title: 'Ver colegio — SAE',
    desc: 'Ficha completa del establecimiento: resultados SIMCE, vacantes, programa PIE, docentes y proyecto educativo.',
    og: 'Ficha de colegio — SAE',
  },
  '/postulacion': {
    title: 'Postulación — SAE',
    desc: 'Ingresa con ClaveÚnica, arma tu lista de colegios y confirma tu postulación al SAE en 3 pasos.',
    og: 'Postula ahora — SAE',
  },
  '/seguimiento': {
    title: 'Mi postulación — SAE',
    desc: 'Consulta el estado de tu postulación, revisa el resultado de asignación y descarga tu comprobante.',
    og: 'Mi postulación — SAE',
  },
  '/comparador': {
    title: 'Comparar colegios — SAE',
    desc: 'Compara hasta 3 colegios lado a lado: SIMCE, vacantes, docentes, programa NEE y nivel de demanda.',
    og: 'Compara colegios del SAE — Sistema de Admisión Escolar',
  },
}

const defaultSeo = {
  title: 'SAE — Sistema de Admisión Escolar',
  desc: 'Sistema de Admisión Escolar del Ministerio de Educación de Chile.',
  og: 'SAE — Sistema de Admisión Escolar',
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(name.startsWith('og:') ? 'property' : 'name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function PageMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const data = seoData[pathname] ?? defaultSeo
    document.title = data.title
    setMeta('description', data.desc)
    setMeta('og:title', data.og)
    setMeta('og:description', data.desc)
    setMeta('og:type', 'website')
    setMeta('og:site_name', 'SAE — Sistema de Admisión Escolar')
  }, [pathname])
  return null
}

function LoadingPage() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      Cargando…
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <TextSizeProvider>
        <TourProvider>
          <GlobalFontSize />
          <GuidedTour />
        <div className="app-shell">
          <Navbar />
          <PageMeta />
          <div id="contenido-principal">
          <ErrorBoundary>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route path="/"             element={<InicioPage />} />
                <Route path="/perfil"       element={<PerfilPage />} />
                <Route path="/algoritmo"    element={<AlgoritmoPage />} />
                <Route path="/calendario"   element={<CalendarioPage />} />
                <Route path="/colegio"      element={<ColegioPage />} />
                <Route path="/comparador"   element={<ComparadorPage />} />
                <Route path="/postulacion"  element={<PostulacionPage />} />
                <Route path="/seguimiento"  element={<SeguimientoPage />} />
                <Route path="/cumplimiento" element={<CumplimientoPage />} />
                <Route path="/roadmap"      element={<RoadmapPage />} />
                <Route path="*"             element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          </div>
          <Footer />
          <ChatAyuda />
        </div>
        </TourProvider>
      </TextSizeProvider>
    </BrowserRouter>
  )
}

export default App
