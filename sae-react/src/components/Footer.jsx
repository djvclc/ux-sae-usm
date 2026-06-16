/**
 * Footer global del SAE
 * Cumple S10-2 (OIRS visible), S14-f (tel: clicable en móvil), S5-1 (dirección física).
 * Mobile-first — columna única en móvil, 3 columnas en desktop.
 */

const AÑO = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo" aria-label="Pie de página institucional">
      <div className="site-footer__inner">

        {/* ── Columna 1: Identidad ── */}
        <div className="site-footer__col site-footer__col--brand">
          <p className="site-footer__brand">
            <span aria-hidden="true">🎓</span> SAE
          </p>
          <p className="site-footer__tagline">
            Sistema de Admisión Escolar
          </p>
          <p className="site-footer__dep">
            Ministerio de Educación de Chile
          </p>
          <address className="site-footer__address">
            Av. Libertador Bernardo O'Higgins 1371<br />
            Santiago, Región Metropolitana
          </address>
        </div>

        {/* ── Columna 2: Contacto ── */}
        <div className="site-footer__col">
          <h2 className="site-footer__heading">Contacto y ayuda</h2>
          <ul className="site-footer__list">
            <li>
              <span className="site-footer__icon" aria-hidden="true">📞</span>
              <span>Call center SAE:</span>{' '}
              <a
                href="tel:6006002626"
                className="site-footer__link tel-link"
                aria-label="Llamar al call center SAE al 600 600 2626"
              >
                600 600 2626
              </a>
            </li>
            <li>
              <span className="site-footer__icon" aria-hidden="true">🕐</span>
              Lunes a viernes, 09:00–18:00 hrs.
            </li>
            <li>
              <span className="site-footer__icon" aria-hidden="true">💬</span>
              Chat de ayuda disponible en horario hábil
            </li>
            <li>
              <span className="site-footer__icon" aria-hidden="true">📨</span>
              <a
                href="https://www.mineduc.cl/oirs/"
                className="site-footer__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ir a la Oficina de Información, Reclamos y Sugerencias del Mineduc (abre en nueva pestaña)"
              >
                Oficina OIRS — reclamos y sugerencias
              </a>
            </li>
          </ul>
        </div>

        {/* ── Columna 3: Links útiles ── */}
        <div className="site-footer__col">
          <h2 className="site-footer__heading">Enlaces útiles</h2>
          <ul className="site-footer__list">
            <li>
              <a
                href="https://www.sistemadeadmisionescolar.cl"
                className="site-footer__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ir al sitio oficial del SAE (abre en nueva pestaña)"
              >
                Sitio oficial del SAE
              </a>
            </li>
            <li>
              <a
                href="https://www.mineduc.cl"
                className="site-footer__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ir al sitio del Ministerio de Educación (abre en nueva pestaña)"
              >
                Ministerio de Educación
              </a>
            </li>
            <li>
              <a
                href="https://www.claveunica.gob.cl"
                className="site-footer__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Obtener o recuperar tu ClaveÚnica (abre en nueva pestaña)"
              >
                Obtener ClaveÚnica
              </a>
            </li>
            <li>
              <a
                href="https://www.mineduc.cl/ley-de-inclusion/"
                className="site-footer__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Leer la Ley de Inclusión Escolar (abre en nueva pestaña)"
              >
                Ley de Inclusión Escolar
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* ── Barra inferior ── */}
      <div className="site-footer__bottom">
        <p>
          © {AÑO} Ministerio de Educación de Chile — Este es un prototipo de mejora UX,
          no el sitio oficial.
        </p>
      </div>
    </footer>
  )
}
