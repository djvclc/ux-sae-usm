import { useMemo } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'sae_react_postulacion'

export default function SeguimientoPage() {
  const data = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  if (!data) {
    return (
      <main className="page">
        <h1>Mi postulacion</h1>
        <p className="page__lead">
          Aun no hay una postulacion confirmada en esta sesion.
        </p>

        <section className="card status-card">
          <p className="status-pill">Sin postulación registrada</p>
          <h2>Primero debes completar el flujo de postulacion</h2>
          <p>Ingresa con ClaveUnica simulada, arma tu lista y confirma.</p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/postulacion">
              Ir a Postular
            </Link>
          </div>
        </section>
      </main>
    )
  }

  const { resultado, comprobante } = data
  const asignado = resultado?.asignado

  return (
    <main className="page">
      <h1>Mi postulacion</h1>
      <p className="page__lead">
        Seguimiento dinamico de tu postulacion confirmada con explicacion del
        resultado.
      </p>

      <section className="card status-card status-card--main">
        <p className="status-pill">Resultado disponible</p>
        <h2>{asignado ? asignado.nombre : 'Sin asignacion'}</h2>
        <p>
          {asignado
            ? `Quedaste en tu opcion N.${asignado.idx} con probabilidad estimada de ${asignado.prob}%.`
            : 'No se encontro asignacion en la simulacion.'}
        </p>
        <p>
          Comprobante: <strong>{comprobante}</strong>
        </p>
      </section>

      <section className="card card--module">
        <h2>Detalle por preferencia</h2>
        <ul className="sim-list post-list">
          {resultado?.detalles?.map((d) => (
            <li key={d.id}>
              <span>
                {d.idx}. {d.nombre}
              </span>
              <span>
                {d.estado === 'asignado'
                  ? 'Asignado'
                  : d.estado === 'no_evaluado'
                    ? 'No evaluado'
                    : d.estado === 'sin_cupos'
                      ? 'Sin cupos'
                      : 'Prioridad insuficiente'}{' '}
                - {d.prob}%
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card card--module">
        <h2>Si no quedas en tu primera opcion</h2>
        <p>
          El sistema sigue buscando en tu lista segun el orden que definiste. Si
          no quedas en ninguna, se activa asignacion cercana y segunda etapa.
        </p>
      </section>
    </main>
  )
}
