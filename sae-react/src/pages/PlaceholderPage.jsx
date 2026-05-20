export default function PlaceholderPage({ title, description }) {
  return (
    <main className="page">
      <h1>{title}</h1>
      <p className="page__lead">{description}</p>
      <section className="card">
        <h2>Seccion en migracion</h2>
        <p>
          Esta vista se incorporo para mantener la navegacion 1:1 con el HTML
          original mientras terminamos de portar todos los modulos a React.
        </p>
      </section>
    </main>
  )
}
