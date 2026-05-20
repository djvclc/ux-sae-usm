import { useEffect, useMemo, useState } from 'react'
import { colegios } from '../data/colegios'
import { calcularResultado, prioridadLabels } from '../utils/asignacion'

const STORAGE_KEY = 'sae_react_postulacion'
const DRAFT_LIST_KEY = 'sae_react_postulacion_draft_list'

export default function PostulacionPage() {
  const [paso, setPaso] = useState(1)
  const [loginOk, setLoginOk] = useState(false)
  const [perfil, setPerfil] = useState({
    hermano: false,
    prioritario: false,
    funcionario: false,
    exalumno: false,
  })
  const [lista, setLista] = useState([])
  const [toAdd, setToAdd] = useState('')
  const [confirmado, setConfirmado] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_LIST_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        setLista(parsed.filter((id) => Number.isInteger(id)).slice(0, 8))
      }
    } catch {
      // Ignora errores de parseo para no bloquear el flujo de postulacion.
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(DRAFT_LIST_KEY, JSON.stringify(lista))
  }, [lista])

  const resultado = useMemo(() => calcularResultado(lista, perfil), [lista, perfil])

  const disponibles = colegios.filter((c) => !lista.includes(c.id))

  const togglePerfil = (key) => {
    setPerfil((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const addColegio = () => {
    const id = Number(toAdd)
    if (!id || lista.includes(id) || lista.length >= 8) return
    setLista((prev) => [...prev, id])
    setToAdd('')
  }

  const mover = (idx, delta) => {
    const next = idx + delta
    if (next < 0 || next >= lista.length) return
    const copia = [...lista]
    ;[copia[idx], copia[next]] = [copia[next], copia[idx]]
    setLista(copia)
  }

  const quitar = (id) => {
    setLista((prev) => prev.filter((item) => item !== id))
  }

  const siguiente = () => {
    if (paso === 1 && !loginOk) return
    if (paso === 2 && !lista.length) return
    setPaso((prev) => Math.min(prev + 1, 3))
  }

  const anterior = () => setPaso((prev) => Math.max(prev - 1, 1))

  const confirmar = () => {
    const payload = {
      fecha: new Date().toISOString(),
      comprobante: `SAE-${Math.floor(100000 + Math.random() * 900000)}`,
      perfil,
      lista,
      resultado,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    setConfirmado(payload)
  }

  return (
    <main className="page page--module">
      <h1>Postular en 3 pasos</h1>
      <p className="page__lead">
        Flujo funcional en React con ClaveUnica simulada, orden de colegios y
        confirmacion con comprobante.
      </p>

      <div className="stepper" aria-label="Progreso del formulario">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`stepper__item ${paso >= n ? 'stepper__item--on' : ''}`} />
        ))}
      </div>

      {paso === 1 ? (
        <section className="card card--module">
          <h2>Paso 1 de 3 - Identificate</h2>
          <p>Ingresa con ClaveUnica como opcion principal.</p>
          <div className="hero__actions">
            <button type="button" className="btn btn--primary" onClick={() => setLoginOk(true)}>
              Ingresar con ClaveUnica
            </button>
            <button type="button" className="btn btn--secondary btn--dark">
              Crear cuenta SAE
            </button>
          </div>
          {loginOk ? <p className="small-note">Ingreso exitoso. Ya puedes avanzar.</p> : null}
        </section>
      ) : null}

      {paso === 2 ? (
        <section className="card card--module">
          <h2>Paso 2 de 3 - Agrega y ordena colegios</h2>
          <p>Maximo 8 colegios. El orden define tus preferencias.</p>

          <div className="chip-row">
            {[
              ['hermano', 'Hermano/a'],
              ['prioritario', 'Prioritario/a'],
              ['funcionario', 'Hijo/a funcionario/a'],
              ['exalumno', 'Exalumno/a'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`chip-btn ${perfil[key] ? 'chip-btn--on' : ''}`}
                onClick={() => togglePerfil(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="add-row">
            <select value={toAdd} onChange={(e) => setToAdd(e.target.value)}>
              <option value="">Selecciona un colegio</option>
              {disponibles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} - {c.comuna}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn--primary" onClick={addColegio}>
              Agregar
            </button>
          </div>

          <ul className="sim-list post-list">
            {lista.map((id, idx) => {
              const col = colegios.find((c) => c.id === id)
              if (!col) return null
              return (
                <li key={id}>
                  <span>
                    {idx + 1}. {col.nombre}
                  </span>
                  <span className="inline-actions">
                    <button type="button" onClick={() => mover(idx, -1)}>
                      Subir
                    </button>
                    <button type="button" onClick={() => mover(idx, 1)}>
                      Bajar
                    </button>
                    <button type="button" onClick={() => quitar(id)}>
                      Quitar
                    </button>
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      {paso === 3 ? (
        <section className="card card--module">
          <h2>Paso 3 de 3 - Revisa y confirma</h2>
          <p>
            Prioridad aplicada: <strong>{prioridadLabels[resultado.nivel]}</strong>
          </p>
          <ul className="sim-list post-list">
            {resultado.detalles.map((d) => (
              <li key={d.id}>
                <span>
                  {d.idx}. {d.nombre}
                </span>
                <span>{d.prob}%</span>
              </li>
            ))}
          </ul>

          {!confirmado ? (
            <button type="button" className="btn btn--primary" onClick={confirmar}>
              Confirmar y enviar postulacion
            </button>
          ) : (
            <div className="sim-result">
              <h3>Postulacion enviada</h3>
              <p>
                Comprobante: <strong>{confirmado.comprobante}</strong>
              </p>
              <p>Resultados estimados disponibles en la seccion Mi postulacion.</p>
            </div>
          )}
        </section>
      ) : null}

      <div className="hero__actions">
        <button type="button" className="btn btn--secondary btn--dark" onClick={anterior}>
          Atras
        </button>
        <button type="button" className="btn btn--primary" onClick={siguiente}>
          Siguiente
        </button>
      </div>
    </main>
  )
}
