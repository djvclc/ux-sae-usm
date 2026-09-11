/* ── Modo del estudio comparativo (F3 — condición de control) ──
 *
 * El estudio contrasta dos condiciones sobre EL MISMO flujo:
 *   A ("full")    → el prototipo completo, con toda la capa de explicabilidad.
 *   B ("control") → el mismo flujo SIN esa capa (probabilidades, /algoritmo,
 *                   "por qué te asignaron este colegio", "¿qué hace el orden…?").
 *
 * NO es una copia de la página: es un switch. Cada pieza de explicabilidad
 * consulta `esControl` y se oculta o se simplifica. El motor de asignación
 * (`asignacion.js` / `simulacionSae.js`) es idéntico en ambas → el resultado
 * es el mismo; B solo NO lo explica. Inventario por pieza en
 * `docs/planificacion/f3_modo_control_inventario.md`.
 *
 * Activación: el moderador entra por `/estudio`, ingresa el número de
 * participante, y esa pantalla fija el modo en `sessionStorage` y redirige a
 * `/` SIN query (para que el participante no vea "control" en la barra).
 * `?modo=control` / `?modo=full` en la URL también funciona (útil para pruebas).
 * Default: "full" — sin nada configurado, el prototipo se comporta como siempre.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const KEY = 'sae_modo_estudio' // 'full' | 'control'

const ModoEstudioContext = createContext({ esControl: false, condicion: 'A', modo: 'full' })

function leerModoInicial(qMode) {
  if (qMode === 'control' || qMode === 'b') return 'control'
  if (qMode === 'full' || qMode === 'a') return 'full'
  try {
    const s = sessionStorage.getItem(KEY)
    return s === 'control' ? 'control' : 'full'
  } catch {
    return 'full'
  }
}

function normalizarQuery(q) {
  if (q === 'control' || q === 'b') return 'control'
  if (q === 'full' || q === 'a') return 'full'
  return null
}

export function ModoEstudioProvider({ children }) {
  const [params] = useSearchParams()
  const qModo = normalizarQuery(params.get('modo'))

  // El estado guarda el último modo conocido; el ?modo=… de la URL, si viene,
  // tiene prioridad sobre él. Así el modo efectivo es siempre determinista sin
  // necesidad de sincronizar estado dentro de un efecto.
  const [modoGuardado, setModoGuardado] = useState(() => leerModoInicial(qModo))
  const modo = qModo ?? modoGuardado

  // Único efecto: sincroniza sistemas externos (sessionStorage) y el estado
  // interno con el modo efectivo. React descarta el setState si no cambió.
  useEffect(() => {
    setModoGuardado(modo) // eslint-disable-line react-hooks/set-state-in-effect -- sync con la query string (sistema externo); no-op si no cambió
    try {
      sessionStorage.setItem(KEY, modo)
    } catch {
      /* sessionStorage no disponible: el modo vive solo en memoria */
    }
  }, [modo])

  const value = {
    modo,
    esControl: modo === 'control',
    condicion: modo === 'control' ? 'B' : 'A',
  }
  return <ModoEstudioContext.Provider value={value}>{children}</ModoEstudioContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModoEstudio() {
  return useContext(ModoEstudioContext)
}

/* Helper para `/estudio`: fija el modo y limpia el estado de la sesión anterior.
 * `cond` es 'A'/'B' (o 'full'/'control'). No borra el flag de modo. */
// eslint-disable-next-line react-refresh/only-export-components -- helper del panel del moderador, junto al contexto por diseño
export function fijarCondicion(cond, nParticipante) {
  const modo = cond === 'B' || cond === 'control' ? 'control' : 'full'
  try {
    sessionStorage.setItem(KEY, modo)
    if (nParticipante != null) sessionStorage.setItem('sae_estudio_participante', String(nParticipante))
    // Estado de una sesión anterior (identidad + última postulación).
    localStorage.removeItem('sae_react_postulacion')
    localStorage.removeItem('sae_react_perfil')
  } catch {
    /* almacenamiento no disponible */
  }
}
