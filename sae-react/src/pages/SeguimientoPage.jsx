import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

        <Card className="status-card">
          <CardHeader>
            <p className="status-pill">Sin postulación registrada</p>
            <CardTitle>Primero debes completar el flujo de postulacion</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ingresa con ClaveUnica simulada, arma tu lista y confirma.</p>
            <div className="hero__actions">
              <Link className="btn btn--primary" to="/postulacion">
                Ir a Postular
              </Link>
            </div>
          </CardContent>
        </Card>
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

      <Card className="status-card status-card--main">
        <CardHeader>
          <p className="status-pill">Resultado disponible</p>
          <CardTitle>{asignado ? asignado.nombre : 'Sin asignacion'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {asignado
              ? `Quedaste en tu opcion N.${asignado.idx} con probabilidad estimada de ${asignado.prob}%.`
              : 'No se encontro asignacion en la simulacion.'}
          </p>
          <p>
            Comprobante: <strong>{comprobante}</strong>
          </p>
        </CardContent>
      </Card>

      <Card className="card--module">
        <CardHeader><CardTitle>Detalle por preferencia</CardTitle></CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card className="card--module">
        <CardHeader><CardTitle>Si no quedas en tu primera opcion</CardTitle></CardHeader>
        <CardContent>
          <p>
            El sistema sigue buscando en tu lista segun el orden que definiste. Si
            no quedas en ninguna, se activa asignacion cercana y segunda etapa.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
