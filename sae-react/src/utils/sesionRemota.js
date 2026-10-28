/* 2026-10-27 (prueba remota): la participante abre el prototipo en su propio
   computador, así que el moderador no puede preparar la página con las
   "Herramientas de la prueba de usabilidad". En su lugar, cada versión tiene un
   link de sesión:

     /postulacion?sesion=1  → versión A (con explicaciones)
     /postulacion?sesion=2  → versión B (sin explicaciones)

   Al abrirlo: se fija la versión y se limpia la sesión anterior (fijarCondicion),
   se marca la pestaña como "prueba remota" (las herramientas se ocultan), se deja
   pedido cargar a la familia del caso al llegar a /postulacion y se quita el
   parámetro de la dirección, para que la persona no vea qué versión le tocó.
   Se aplica en main.jsx, antes de montar la app. */
import { fijarCondicion } from '../context/ModoEstudioContext'

export const PRUEBA_REMOTA_KEY = 'sae_prueba_remota'
export const CARGAR_CASO_KEY = 'sae_cargar_caso'

const CONDICION_POR_SESION = { 1: 'A', 2: 'B' }

export function aplicarLinkDeSesion() {
  const url = new URL(window.location.href)
  const cond = CONDICION_POR_SESION[url.searchParams.get('sesion')]
  if (!cond) return
  fijarCondicion(cond)
  try {
    sessionStorage.setItem(PRUEBA_REMOTA_KEY, '1')
    sessionStorage.setItem(CARGAR_CASO_KEY, '1')
  } catch {
    /* almacenamiento no disponible */
  }
  url.searchParams.delete('sesion')
  window.history.replaceState(null, '', url.pathname + url.search + url.hash)
}

export function esPruebaRemota() {
  try {
    return sessionStorage.getItem(PRUEBA_REMOTA_KEY) === '1'
  } catch {
    return false
  }
}
