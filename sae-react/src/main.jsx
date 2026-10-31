import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { aplicarLinkDeSesion, esPruebaRemota } from './utils/sesionRemota'
import { iniciarRegistroCursor } from './utils/registroCursor'

// 2026-10-27 (prueba remota): link de sesión ?sesion=1|2, antes de montar la app.
aplicarLinkDeSesion()
// 2026-10-31: registro del cursor, solo en una prueba remota.
if (esPruebaRemota()) iniciarRegistroCursor()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
