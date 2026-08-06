import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* Mantenimiento correctivo (2026-08-05): al cambiar de ruta la vista quedaba
   a mitad de página. Este componente global restaura el scroll al tope en cada
   navegación. Detalles:
   - Depende de pathname + search porque /colegio navega entre fichas cambiando
     solo el query param ?id= (antes lo resolvía ColegioPage localmente).
   - Si hay hash (p. ej. /#buscador desde el Navbar) no interviene, para que el
     anclaje nativo del navegador funcione.
   - No afecta scrolls internos de la misma página (scrollToBuscador en
     InicioPage, auto-scroll del ChatAyuda) porque no producen navegación,
     ni al tour guiado: su scrollIntoView ocurre después (polling) y prevalece. */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, search, hash])

  return null
}
