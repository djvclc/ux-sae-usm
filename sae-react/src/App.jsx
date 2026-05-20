import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import AlgoritmoPage from './pages/AlgoritmoPage'
import CumplimientoPage from './pages/CumplimientoPage'
import InicioPage from './pages/InicioPage'
import PlaceholderPage from './pages/PlaceholderPage'
import PostulacionPage from './pages/PostulacionPage'
import RoadmapPage from './pages/RoadmapPage'
import SeguimientoPage from './pages/SeguimientoPage'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route
            path="/perfil"
            element={
              <PlaceholderPage
                title="Mis datos"
                description="Formulario de perfil del estudiante y criterios de prioridad."
              />
            }
          />
          <Route path="/algoritmo" element={<AlgoritmoPage />} />
          <Route
            path="/calendario"
            element={
              <PlaceholderPage
                title="El proceso"
                description="Calendario interactivo por etapas del SAE."
              />
            }
          />
          <Route
            path="/colegio"
            element={
              <PlaceholderPage
                title="Ver colegio"
                description="Ficha ampliada con indicadores, NEE y seguridad."
              />
            }
          />
          <Route
            path="/comparador"
            element={
              <PlaceholderPage
                title="Comparar"
                description="Comparador visual entre colegios para decidir mejor."
              />
            }
          />
          <Route path="/postulacion" element={<PostulacionPage />} />
          <Route path="/seguimiento" element={<SeguimientoPage />} />
          <Route path="/cumplimiento" element={<CumplimientoPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
