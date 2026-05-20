import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/perfil', label: 'Mis datos' },
  { to: '/algoritmo', label: 'Como funciona?' },
  { to: '/calendario', label: 'El proceso' },
  { to: '/colegio', label: 'Ver colegio' },
  { to: '/comparador', label: 'Comparar' },
  { to: '/postulacion', label: 'Postula', cta: true },
  { to: '/seguimiento', label: 'Mi postulacion' },
  { to: '/cumplimiento', label: 'Punto 13' },
  { to: '/roadmap', label: 'Roadmap' },
]

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div className="brand" aria-label="Sistema de Admision Escolar">
          <span className="brand__icon" aria-hidden="true">
            🎓
          </span>
          <span>SAE UX</span>
        </div>
        <nav className="menu" aria-label="Navegacion principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `menu__link ${link.cta ? 'menu__link--cta' : ''} ${isActive ? 'menu__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
