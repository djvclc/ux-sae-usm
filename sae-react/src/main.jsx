import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { aplicarLinkDeSesion } from './utils/sesionRemota'

// 2026-10-27 (prueba remota): link de sesión ?sesion=1|2, antes de montar la app.
aplicarLinkDeSesion()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
