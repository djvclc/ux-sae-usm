import { incisosP13, estadoLabel } from '../data/incisos'

function badgeClass(estado) {
  if (estado === 'cumplido') return 'badge badge--ok'
  if (estado === 'en-progreso') return 'badge badge--progress'
  return 'badge badge--todo'
}

export default function CumplimientoPage() {
  return (
    <main className="page">
      <h1>Punto 13: Estado de cumplimiento</h1>
      <p className="page__lead">
        Matriz de trabajo en React para los incisos a-t del informe de calidad
        web SAE.
      </p>

      <section className="cards" aria-label="Incisos del punto 13">
        {incisosP13.map((item) => (
          <article key={item.id} className="card">
            <header className="card__header">
              <h2>
                {item.id}) {item.titulo}
              </h2>
              <span className={badgeClass(item.estado)}>
                {estadoLabel[item.estado]}
              </span>
            </header>
            <p>{item.foco}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
