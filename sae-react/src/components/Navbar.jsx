import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useModoEstudio } from '../context/ModoEstudioContext'
import { rutaApp } from '../utils/rutas'

/* 2026-10-05 (pedido del usuario: "limpiar la navbar"): de 9 a 7 enlaces (6 en la condición B, sin "El sistema").
   - "El proceso" y "Calendario" eran casi la misma página (las dos con título
     "El proceso paso a paso"; /proceso ya incluye el calendario Admisión 2027):
     queda "El proceso" y /calendario redirige a /proceso (App.jsx).
   - "Comparar" sale del menú: el comparador se abre desde el buscador de
     colegios y desde la ficha de cada colegio. "Colegios" sin emoji.
   - Lo personal ("Mi postulación", "Mis datos") va en un grupo aparte a la
     derecha; "Postular" es el único elemento con forma de botón y la página
     activa se marca con un subrayado (antes era otro recuadro).
   Grupo principal: orden del proceso SAE (4.1).
   hash:true → se renderiza como <a> con scroll suave si ya estamos en "/"
   soloA:true → se oculta en la condición de control del estudio (F3) */
const linksPrincipales = [
  { to: '/',            label: 'Inicio',          end: true },
  { to: '/proceso',     label: 'El proceso' },
  { to: '/algoritmo',   label: 'El sistema',       soloA: true },
  { to: '/#buscador',   label: 'Colegios',         hash: true },
  { to: '/postulacion', label: 'Postular',         cta: true },
]
const linksPersonales = [
  { to: '/seguimiento', label: 'Mi postulación' },
  { to: '/perfil',      label: 'Mis datos' },
]

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)
  const { pathname } = useLocation()
  const { esControl } = useModoEstudio()
  /* 2026-10-27 (pedido del autor, prueba de usabilidad): en /postulacion la barra
     queda solo con "Postular". Cualquier otro link borraba la postulación a medio
     hacer, que vive en el estado de React. "Postular" sigue reiniciando el flujo
     (vuelve al principio), a propósito. */
  const enFlujo = pathname === '/postulacion'
  const principales = linksPrincipales
    .filter((l) => !(l.soloA && esControl))
    .filter((l) => !enFlujo || l.cta)
  const personales = enFlujo ? [] : linksPersonales

  /* Scroll suave si ya estamos en "/" — navega normalmente si venimos de otra ruta */
  const handleHashClick = (e) => {
    setAbierto(false)
    if (pathname === '/') {
      e.preventDefault()
      document.getElementById('buscador')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const renderLink = (link) =>
    link.hash ? (
      /* Enlace de hash — usa <a> nativo para respetar el anchor */
      <a
        key={link.to}
        href={rutaApp(link.to)}
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

  return (
    <header className="topbar">
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido principal
      </a>
      <div className="topbar__inner">
        {enFlujo ? (
          <span className="brand" aria-label="Sistema de Admisión Escolar">
            <span className="brand__icon" aria-hidden="true">🎓</span>
            <span>SAE</span>
          </span>
        ) : (
          <NavLink
            to="/"
            className="brand"
            aria-label="Sistema de Admisión Escolar — Inicio"
            onClick={() => setAbierto(false)}
          >
            <span className="brand__icon" aria-hidden="true">🎓</span>
            <span>SAE</span>
          </NavLink>
        )}

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
          <div className="menu__grupo">
            {principales.map(renderLink)}
          </div>
          {/* Lo personal, separado de lo informativo */}
          {personales.length > 0 && (
            <div className="menu__grupo menu__grupo--personal">
              {personales.map(renderLink)}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
