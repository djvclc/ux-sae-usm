import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

/* Orden sigue el flujo del proceso SAE (4.1)
   hash:true → se renderiza como <a> con scroll suave si ya estamos en "/" */
const links = [
  { to: '/',            label: 'Inicio',          end: true },
  { to: '/algoritmo',   label: '¿Cómo funciona?' },
  { to: '/calendario',  label: 'Calendario' },
  { to: '/#buscador',   label: '🔎 Colegios',     hash: true },
  { to: '/comparador',  label: 'Comparar' },
  { to: '/postulacion', label: 'Postular',         cta: true },
  { to: '/perfil',      label: 'Mis datos' },
  { to: '/seguimiento', label: 'Mi postulación' },
]

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)
  const { pathname } = useLocation()

  /* Scroll suave si ya estamos en "/" — navega normalmente si venimos de otra ruta */
  const handleHashClick = (e) => {
    setAbierto(false)
    if (pathname === '/') {
      e.preventDefault()
      document.getElementById('buscador')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header className="topbar">
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido principal
      </a>
      <div className="topbar__inner">
        <NavLink
          to="/"
          className="brand"
          aria-label="Sistema de Admisión Escolar — Inicio"
          onClick={() => setAbierto(false)}
        >
          <span className="brand__icon" aria-hidden="true">🎓</span>
          <span>SAE</span>
        </NavLink>

        {/* Botón hamburguesa — visible solo en móvil */}
        <button
          className="topbar__hamburger"
          aria-expanded={abierto}
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú de navegación'}
          aria-controls="navbar-nav"
          onClick={() => setAbierto((p) => !p)}
        >
          {abierto ? '✕' : '☰'}
        </button>

        {/* Menú de navegación */}
        <nav
          id="navbar-nav"
          className={`menu${abierto ? ' menu--abierto' : ''}`}
          aria-label="Navegación principal"
        >
          {links.map((link) =>
            link.hash ? (
              /* Enlace de hash — usa <a> nativo para respetar el anchor */
              <a
                key={link.to}
                href={link.to}
                className="menu__link"
                onClick={handleHashClick}
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end ?? false}
                onClick={() => setAbierto(false)}
                className={({ isActive }) =>
                  `menu__link${link.cta ? ' menu__link--cta' : ''}${isActive ? ' menu__link--active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
