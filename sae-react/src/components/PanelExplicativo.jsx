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
import { useModoEstudio } from '../context/ModoEstudioContext'

/* Grilla de dos columnas. Sin `panel` (o en la condición B) queda una sola
   columna con el flujo a todo el ancho. */
export function LayoutConPanel({ panel, children }) {
  const { esControl } = useModoEstudio()
  const conPanel = !!panel && !esControl
  return (
    <div className={`layout-panel${conPanel ? '' : ' layout-panel--solo'}`}>
      <div className="layout-panel__flujo">{children}</div>
      {conPanel && panel}
    </div>
  )
}

/* El panel en sí. `clave` identifica el momento del flujo: al cambiar, el
   contenido se vuelve a montar (vuelve al inicio del scroll del panel y se anima)
   y se anuncia el nuevo título a lectores de pantalla. */
export function PanelExplicativo({ clave, titulo, children }) {
  return (
    <aside className="panel-exp" aria-labelledby="panel-exp-titulo">
      <p className="sr-only" role="status" aria-live="polite">
        Explicación actualizada: {titulo}
      </p>
      <div className="panel-exp__contenido" key={clave}>
        <p className="panel-exp__eyebrow" aria-hidden="true">Qué significa este paso</p>
        <h2 className="panel-exp__titulo" id="panel-exp-titulo">{titulo}</h2>
        {children}
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
