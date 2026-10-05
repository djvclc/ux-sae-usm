// PanelExplicativo — layout "flujo + panel de explicación" (refactor 2026-10-02).
// Plantilla acordada con la profesora guía (reunión 2026-10-01): a la izquierda el
// flujo (formularios, lista, botones y avisos del SAE real); a la derecha un panel
// que explica QUÉ SIGNIFICA el momento en que está la familia (p. ej., con la
// lista armada: qué implica el orden). Divulgación progresiva (Springer &
// Whittaker) y explicabilidad contextualizada (Nefedov): la explicación cambia
// con el estado del flujo en vez de apilarse dentro de él.
//
// F3: el panel ES la capa explicativa de la condición A. En la condición B
// (`esControl`) no se renderiza y el flujo ocupa todo el ancho.
import { useEffect, useRef, useState } from 'react'
import { useModoEstudio } from '../context/ModoEstudioContext'

/* Grilla de dos columnas. Sin `panel` (o en la condición B) queda una sola
   columna con el flujo a todo el ancho. */
export function LayoutConPanel({ panel, children }) {
  const { esControl } = useModoEstudio()
  const conPanel = !!panel && !esControl
  return (
    <div className={`layout-panel${conPanel ? '' : ' layout-panel--solo'}`}>
      <div className="layout-panel__flujo">{children}</div>
      {/* La columna lateral no empuja el alto de la fila (contain: size en CSS):
          así el panel nunca es más alto que el flujo/la pantalla y queda pegado
          bajo el menú al bajar, en vez de irse con la página. */}
      {conPanel && <div className="layout-panel__lateral">{panel}</div>}
    </div>
  )
}

/* 2026-10-05 (feedback: "se corta el panel cuando bajo"): el panel se pega
   justo debajo del menú superior (que también es sticky) — antes quedaba a 16 px
   del borde de la ventana y el menú le tapaba la parte de arriba. Se publica la
   altura real del menú en la variable CSS `--alto-topbar` (cambia con el tamaño
   de texto Normal/Grande). */
function useAltoTopbar() {
  useEffect(() => {
    const topbar = document.querySelector('.topbar')
    if (!topbar) return undefined
    const publicar = () =>
      document.documentElement.style.setProperty('--alto-topbar', `${topbar.offsetHeight}px`)
    publicar()
    const ro = new ResizeObserver(publicar)
    ro.observe(topbar)
    return () => ro.disconnect()
  }, [])
}

/* Indica si queda contenido por encima o por debajo dentro del cuerpo con scroll,
   para difuminar ese borde en vez de cortar el texto en seco. */
function useBordesScroll(ref, clave) {
  const [bordes, setBordes] = useState({ arriba: false, abajo: false })
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const medir = () => {
      const arriba = el.scrollTop > 2
      const abajo = el.scrollTop + el.clientHeight < el.scrollHeight - 2
      setBordes((b) => (b.arriba === arriba && b.abajo === abajo ? b : { arriba, abajo }))
    }
    medir()
    el.addEventListener('scroll', medir, { passive: true })
    // El contenido cambia (desplegables, lista que se reordena) y la ventana también.
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    Array.from(el.children).forEach((hijo) => ro.observe(hijo))
    const mo = new MutationObserver(medir)
    mo.observe(el, { childList: true, subtree: true, attributes: true })
    return () => {
      el.removeEventListener('scroll', medir)
      ro.disconnect()
      mo.disconnect()
    }
  }, [ref, clave])
  return bordes
}

/* El panel en sí. `clave` identifica el momento del flujo: al cambiar, el
   contenido se vuelve a montar (vuelve al inicio del scroll del panel y se anima)
   y se anuncia el nuevo título a lectores de pantalla. El título queda fijo y
   solo se desplaza el cuerpo. */
export function PanelExplicativo({ clave, titulo, children }) {
  useAltoTopbar()
  const cuerpoRef = useRef(null)
  const { arriba, abajo } = useBordesScroll(cuerpoRef, clave)
  return (
    <aside className="panel-exp" aria-labelledby="panel-exp-titulo">
      <p className="sr-only" role="status" aria-live="polite">
        Explicación actualizada: {titulo}
      </p>
      <div className="panel-exp__contenido" key={clave}>
        <div className="panel-exp__cabecera">
          <p className="panel-exp__eyebrow" aria-hidden="true">Explicación</p>
          <h2 className="panel-exp__titulo" id="panel-exp-titulo">{titulo}</h2>
        </div>
        <div
          ref={cuerpoRef}
          className={`panel-exp__cuerpo${arriba ? ' panel-exp__cuerpo--mas-arriba' : ''}${abajo ? ' panel-exp__cuerpo--mas-abajo' : ''}`}
          // Desplazable con teclado cuando hay más contenido que alto.
          tabIndex={abajo || arriba ? 0 : undefined}
          aria-label={abajo || arriba ? `Contenido de la explicación: ${titulo}` : undefined}
          role={abajo || arriba ? 'region' : undefined}
        >
          {children}
        </div>
      </div>
    </aside>
  )
}

/* Una sección del panel: título corto + contenido. `tono` destaca la sección
   principal del momento ('principal') o una advertencia ('alerta'). */
export function PanelSeccion({ titulo, icono, tono, children }) {
  return (
    <section className={`panel-exp__seccion${tono ? ` panel-exp__seccion--${tono}` : ''}`}>
      {titulo && (
        <h3 className="panel-exp__seccion-titulo">
          {icono && <span aria-hidden="true">{icono} </span>}
          {titulo}
        </h3>
      )}
      {children}
    </section>
  )
}
