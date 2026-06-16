import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="page not-found">
      <p className="not-found__code" aria-hidden="true">404</p>
      <h1 className="not-found__title">Página no encontrada</h1>
      <p className="not-found__desc">
        La dirección que buscas no existe o fue movida. No te preocupes, puedes
        volver al inicio o ir directamente a postular.
      </p>
      <div className="hero__actions" style={{ justifyContent: 'center' }}>
        <Link className="btn btn--primary" to="/">
          Volver al inicio
        </Link>
        <Link className="btn btn--secondary" to="/postulacion">
          Ir a Postulación
        </Link>
      </div>
    </main>
  )
}
