/* 2026-10-27 (prueba remota): el prototipo se publica en GitHub Pages bajo
   /ux-sae-usm/, no en la raíz. Vite expone esa base en import.meta.env.BASE_URL
   ('/' en local). Toda navegación que no pase por React Router (recargas
   completas con window.location, enlaces <a> nativos) debe usar rutaApp. */
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/** rutaApp('/postulacion') → '/ux-sae-usm/postulacion' en Pages, '/postulacion' en local. */
export function rutaApp(ruta) {
  return `${BASE}${ruta}`
}
