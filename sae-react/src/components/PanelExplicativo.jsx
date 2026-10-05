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
import { useEffect } from 'react'
import { useModoEstudio } from '../context/ModoEstudioContext'

/* Grilla de dos columnas. Sin `panel` (o en la condición B) queda una sola
   columna con el flujo a todo el ancho. */
export function LayoutConPanel({ panel, children }) {
  const { esControl } = useModoEstudio()
  const conPanel = !!panel && !esControl
  return (
    <div className={`layout-panel${conPanel ? '' : ' layout-panel--solo'}`}>
      <div className="layout-panel__flujo">{children}</div>
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

/* El panel en sí: una barra lateral FIJA, patrón estándar de sitios de
   documentación (2026-10-05, feedback: "algo más estándar y fijo"). Siempre
   tiene el mismo alto (el visible bajo el menú), queda pegado bajo el menú desde
   el inicio y, si el texto no cabe, el cuerpo tiene su propio scroll normal (sin
   difuminados ni bloqueo del scroll de la página). La cabecera queda fija.
   `clave` identifica el momento del flujo: al cambiar, el contenido se vuelve a
   montar (vuelve al inicio del scroll del panel) y se anuncia el nuevo título a
   lectores de pantalla. */
export function PanelExplicativo({ clave, titulo, children }) {
  useAltoTopbar()
  return (
    <aside className="panel-exp" aria-labelledby="panel-exp-titulo">
      <p className="sr-only" role="status" aria-live="polite">
        Explicación actualizada: {titulo}
      </p>
      <div className="panel-exp__contenido" key={clave}>
        <div className="panel-exp__cabecera">
          <p className="panel-exp__eyebrow" aria-hidden="true">Te explicamos</p>
          <h2 className="panel-exp__titulo" id="panel-exp-titulo">{titulo}</h2>
        </div>
        {/* Enfocable para desplazarlo con el teclado (región con scroll propio). */}
        <div
          className="panel-exp__cuerpo"
          tabIndex={0}
          role="region"
          aria-label={`Contenido de la explicación: ${titulo}`}
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
