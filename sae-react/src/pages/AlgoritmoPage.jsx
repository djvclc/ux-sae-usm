import { useMemo, useState } from 'react'
import { colegios } from '../data/colegios'
import { calcularResultado, prioridadLabels } from '../utils/asignacion'

export default function AlgoritmoPage() {
  const [perfil, setPerfil] = useState({
    hermano: false,
    prioritario: false,
    funcionario: false,
    exalumno: false,
  })
  const [seleccion, setSeleccion] = useState([])

  const resultado = useMemo(
    () => (seleccion.length ? calcularResultado(seleccion, perfil) : null),
    [seleccion, perfil],
  )

  const toggleCondicion = (key) => {
    setPerfil((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleColegio = (id) => {
    setSeleccion((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  return (
    <main className="page page--module">
      <h1>Como te asignan un colegio</h1>
      <p className="page__lead">
        El SAE no es una tombola. Funciona con reglas claras y prioridades por
        ley. Simula tu caso para ver una explicacion contextual.
      </p>

      <section className="pasos-grid">
        <article className="paso-card">
          <div className="paso-card__num">1</div>
          <div className="paso-card__icono" aria-hidden="true">📋</div>
          <h2>Tu eliges</h2>
          <p>Tu eliges hasta 8 colegios en orden de preferencia.</p>
        </article>
        <article className="paso-card">
          <div className="paso-card__num">2</div>
          <div className="paso-card__icono" aria-hidden="true">⚖️</div>
          <h2>Cada colegio prioriza</h2>
          <p>Cada colegio aplica prioridades definidas por ley.</p>
        </article>
        <article className="paso-card">
          <div className="paso-card__num">3</div>
          <div className="paso-card__icono" aria-hidden="true">⚙️</div>
          <h2>El sistema asigna</h2>
          <p>El sistema cruza preferencias, prioridades y vacantes.</p>
        </article>
        <article className="paso-card">
          <div className="paso-card__num">4</div>
          <div className="paso-card__icono" aria-hidden="true">📬</div>
          <h2>Te avisamos</h2>
          <p>Se informa resultado y alternativas si no quedas en la primera.</p>
        </article>
      </section>

      <section className="card sim-panel">
        <h2>Simula tu caso</h2>
        <p className="page__lead">
          Marca tus condiciones y elige hasta 3 colegios para estimar resultado.
        </p>

        <div className="chip-row">
          {[
            ['hermano', 'Hermano/a matriculado/a'],
            ['prioritario', 'Estudiante prioritario'],
            ['funcionario', 'Hijo/a de funcionario/a'],
            ['exalumno', 'Exalumno/a'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`chip-btn ${perfil[key] ? 'chip-btn--on' : ''}`}
              onClick={() => toggleCondicion(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="sim-school-grid">
          {colegios.map((c) => {
            const activo = seleccion.includes(c.id)
            return (
              <button
                key={c.id}
                type="button"
                className={`sim-school ${activo ? 'sim-school--on' : ''}`}
                onClick={() => toggleColegio(c.id)}
              >
                <strong>{c.nombre}</strong>
                <span>
                  {c.comuna} - demanda {c.demanda}
                </span>
              </button>
            )
          })}
        </div>

        {!seleccion.length ? (
          <p className="small-note">Selecciona al menos un colegio para simular.</p>
        ) : null}

        {resultado?.asignado ? (
          <div className="sim-result">
            <h3>Resultado estimado</h3>
            <p>
              Tu mejor opcion probable es <strong>{resultado.asignado.nombre}</strong>{' '}
              (preferencia N.{resultado.asignado.idx}) con {resultado.asignado.prob}%.
            </p>
            <p>
              Prioridad aplicada: <strong>{prioridadLabels[resultado.nivel]}</strong>.
            </p>

            <ul className="sim-list">
              {resultado.detalles.map((d) => (
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
          </div>
        ) : null}
      </section>

      <section className="card">
        <h2>Mitos frecuentes</h2>
        <ul className="sim-list">
          <li>
            <span>Es una tombola?</span>
            <span>No, hay prioridades por ley y luego sorteo transparente.</span>
          </li>
          <li>
            <span>Importa el orden?</span>
            <span>Si. El sistema evalua primero tu preferencia N.1.</span>
          </li>
          <li>
            <span>Sirve postular a mas colegios?</span>
            <span>Si, mejora tus opciones de asignacion.</span>
          </li>
        </ul>
      </section>
    </main>
  )
}
