/**
 * Ilustraciones SVG simples para cards de colegios.
 * Cada tipo genera un color y forma distintos, livianos y consistentes.
 */

const PALETTES = [
  { bg: '#eff6ff', accent: '#2563eb', light: '#93c5fd' },
  { bg: '#f0fdf4', accent: '#16a34a', light: '#86efac' },
  { bg: '#fef3c7', accent: '#d97706', light: '#fcd34d' },
  { bg: '#fce7f3', accent: '#db2777', light: '#f9a8d4' },
  { bg: '#ede9fe', accent: '#7c3aed', light: '#c4b5fd' },
  { bg: '#ecfdf5', accent: '#059669', light: '#6ee7b7' },
]

function getPalette(id) {
  return PALETTES[(id - 1) % PALETTES.length]
}

export default function SchoolIllustration({ colegioId = 1, width = '100%', height = 170 }) {
  const p = getPalette(colegioId)

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 480 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ilustración de colegio"
      style={{ display: 'block', background: p.bg }}
    >
      {/* Suelo */}
      <rect x="0" y="130" width="480" height="40" fill={p.light} opacity="0.3" />

      {/* Edificio principal */}
      <rect x="160" y="50" width="160" height="80" rx="4" fill={p.accent} opacity="0.85" />

      {/* Techo */}
      <polygon points="155,52 320,52 240,18" fill={p.accent} opacity="0.95" />

      {/* Ventanas */}
      <rect x="178" y="65" width="24" height="20" rx="3" fill="white" opacity="0.9" />
      <rect x="214" y="65" width="24" height="20" rx="3" fill="white" opacity="0.9" />
      <rect x="250" y="65" width="24" height="20" rx="3" fill="white" opacity="0.9" />
      <rect x="286" y="65" width="24" height="20" rx="3" fill="white" opacity="0.9" />

      <rect x="178" y="95" width="24" height="20" rx="3" fill="white" opacity="0.7" />
      <rect x="214" y="95" width="24" height="20" rx="3" fill="white" opacity="0.7" />
      <rect x="250" y="95" width="24" height="20" rx="3" fill="white" opacity="0.7" />
      <rect x="286" y="95" width="24" height="20" rx="3" fill="white" opacity="0.7" />

      {/* Puerta */}
      <rect x="224" y="105" width="32" height="25" rx="3" fill="white" opacity="0.95" />

      {/* Ala izquierda */}
      <rect x="90" y="75" width="72" height="55" rx="4" fill={p.accent} opacity="0.6" />
      <rect x="100" y="85" width="18" height="14" rx="2" fill="white" opacity="0.8" />
      <rect x="126" y="85" width="18" height="14" rx="2" fill="white" opacity="0.8" />
      <rect x="100" y="106" width="18" height="14" rx="2" fill="white" opacity="0.6" />
      <rect x="126" y="106" width="18" height="14" rx="2" fill="white" opacity="0.6" />

      {/* Ala derecha */}
      <rect x="318" y="75" width="72" height="55" rx="4" fill={p.accent} opacity="0.6" />
      <rect x="328" y="85" width="18" height="14" rx="2" fill="white" opacity="0.8" />
      <rect x="354" y="85" width="18" height="14" rx="2" fill="white" opacity="0.8" />
      <rect x="328" y="106" width="18" height="14" rx="2" fill="white" opacity="0.6" />
      <rect x="354" y="106" width="18" height="14" rx="2" fill="white" opacity="0.6" />

      {/* Bandera */}
      <line x1="240" y1="18" x2="240" y2="4" stroke={p.accent} strokeWidth="2" />
      <rect x="241" y="4" width="14" height="9" rx="1" fill={p.accent} />

      {/* Arbolitos decorativos */}
      <circle cx="55" cy="115" r="16" fill={p.light} opacity="0.6" />
      <rect x="53" y="128" width="4" height="12" rx="1" fill={p.accent} opacity="0.4" />
      <circle cx="425" cy="112" r="18" fill={p.light} opacity="0.6" />
      <rect x="423" y="127" width="4" height="13" rx="1" fill={p.accent} opacity="0.4" />
    </svg>
  )
}
