import { useState } from 'react'
import { Link } from 'react-router-dom'
import { colegios } from '../data/colegios'
import { useTextSize } from '../context/TextSizeContext'
import TextSizeBar from '../components/TextSizeBar'

const DRAFT_LIST_KEY = 'sae_react_postulacion_draft_list'

const demandaLabel = { alta: 'Alta', media: 'Media', baja: 'Baja' }
const demandaClass = { alta: 'demand-chip--alta', media: 'demand-chip--media', baja: 'demand-chip--baja' }


function simcePromedio(c) {
  return Math.round((c.simce.lectura + c.simce.matematica) / 2)
}
function comunalPromedio(c) {
  return Math.round((c.promedioComunal.lectura + c.promedioComunal.matematica) / 2)
}

/* Barra visual de porcentaje */
function BarraPct({ valor, label }) {
  return (
    <div className="comp-barra-wrap" aria-label={label}>
      <div className="comp-barra" role="img" aria-hidden="true">
        <div className="comp-barra__fill" style={{ width: `${valor}%` }} />
      </div>
      <span>{valor}%</span>
    </div>
  )
}

/* Fila de la tabla comparativa para mantener el JSX limpio */
function FilaTabla({ label, celdas }) {
  return (
    <tr>
      <td className="comp-tabla__row-label">{label}</td>
      {celdas}
    </tr>
  )
}

export default function ComparadorPage() {
  const { textoGrande } = useTextSize()
  const [seleccionados, setSeleccionados] = useState([])
  const [postulados, setPostulados] = useState(() => {
    try {
      const raw = localStorage.getItem(DRAFT_LIST_KEY)
      return raw ? JSON.parse(raw).filter(Number.isInteger) : []
    } catch { return [] }
  })

  const toggleColegio = (id) => {
    setSeleccionados((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const agregarPostulacion = (id) => {
    setPostulados((prev) => {
      if (prev.includes(id)) return prev
      const nueva = [...prev, id]
      try {
        const raw = localStorage.getItem(DRAFT_LIST_KEY)
        const actual = raw ? JSON.parse(raw) : []
        // S22-2 (corrige E2): sin tope de 8 — el SAE no limita el número de colegios
        const merged = [...new Set([...(Array.isArray(actual) ? actual : []), id])]
        localStorage.setItem(DRAFT_LIST_KEY, JSON.stringify(merged))
      } catch { /* noop */ }
      return nueva
    })
  }

  const cols = seleccionados.map((id) => colegios.find((c) => c.id === id)).filter(Boolean)

  return (
    <main className={`page${textoGrande ? ' page--texto-grande' : ''}`}>
      <TextSizeBar pageName="Comparar colegios" />
      <h1>Compara colegios</h1>
      <p className="page__lead">
        Selecciona hasta 3 colegios para ver sus características lado a lado y decidir mejor.
      </p>

      {/* ══ SELECTOR ══ */}
      <section className="comp-selector" aria-labelledby="comp-selector-titulo">
        <h2 id="comp-selector-titulo">¿Cuáles quieres comparar?</h2>
        <p className="form-hint">Puedes elegir hasta 3 establecimientos.</p>
        <div className="comp-selector__grid" role="group" aria-label="Lista de colegios para comparar">
          {colegios.map((c) => {
            const activo = seleccionados.includes(c.id)
            const bloqueado = !activo && seleccionados.length >= 3
            return (
              <label
                key={c.id}
                className={`comp-check${activo ? ' comp-check--on' : ''}${bloqueado ? ' comp-check--bloq' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={activo}
                  disabled={bloqueado}
                  onChange={() => toggleColegio(c.id)}
                  aria-label={`Seleccionar ${c.nombre} para comparar`}
                />
                <span className="comp-check__nombre">{c.nombre}</span>
                <span className="comp-check__meta">
                  {c.comuna} · demanda {demandaLabel[c.demanda]}
                </span>
              </label>
            )
          })}
        </div>

        {seleccionados.length === 0 && (
          <p className="small-note" role="status">Selecciona al menos 2 colegios para activar la comparación.</p>
        )}
        {seleccionados.length === 1 && (
          <p className="small-note" role="status">Selecciona 1 colegio más para ver la comparación.</p>
        )}
      </section>

      {/* ══ TABLA COMPARATIVA (≥2 colegios) ══ */}
      {cols.length >= 2 && (
        <section className="comp-tabla-wrap" aria-label="Comparación de colegios seleccionados">

          {/* Vista de tabla — desktop (≥600px) */}
          <div className="comp-tabla-desktop">
            <table className="comp-tabla">
              <thead>
                <tr>
                  <th scope="col" className="comp-tabla__row-label">Característica</th>
                  {cols.map((c) => (
                    <th key={c.id} scope="col">{c.nombre}<br /><span style={{ fontWeight: 400, fontSize: '0.8rem', opacity: 0.85 }}>{c.comuna}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <FilaTabla
                  label="📍 Distancia estimada"
                  celdas={cols.map((c) => <td key={c.id}>{c.distanciaBase} km</td>)}
                />
                <FilaTabla
                  label="🕐 Jornada"
                  celdas={cols.map((c) => <td key={c.id}>{c.vacantes[0]?.jornada ?? 'No especificada'}</td>)}
                />
                <FilaTabla
                  label="🪑 Vacantes por nivel"
                  celdas={cols.map((c) => (
                    <td key={c.id}>
                      {/* S16-1: vacantes como array con rango min–max */}
                      {c.vacantes.map((v) => (
                        <div key={v.nivel} className="comp-vacante-row">
                          <span className="comp-vacante-row__nivel">{v.label}</span>
                          <span className="comp-vacante-row__rango">{v.min}–{v.max}</span>
                        </div>
                      ))}
                    </td>
                  ))}
                />
                <FilaTabla
                  label={<><abbr title="Sistema de Medición de la Calidad de la Educación">SIMCE</abbr> (lec. + mat.)</>}
                  celdas={cols.map((c) => {
                    const sp = simcePromedio(c)
                    const cp = comunalPromedio(c)
                    const arriba = sp >= cp
                    return (
                      <td key={c.id}>
                        <span className={`comp-simce ${arriba ? 'comp-simce--up' : 'comp-simce--down'}`}>
                          {sp} {arriba ? '↑' : '↓'}
                        </span>
                        <span className="comp-simce__ref"> (prom. comunal: {cp})</span>
                      </td>
                    )
                  })}
                />
                <FilaTabla
                  label="👩‍🏫 Docentes titulados"
                  celdas={cols.map((c) => (
                    <td key={c.id}>
                      <BarraPct valor={c.docentes.titulados} label={`${c.docentes.titulados}% de docentes titulados`} />
                    </td>
                  ))}
                />
                <FilaTabla
                  label={<>♿ Programa <abbr title="Necesidades Educativas Especiales">NEE</abbr></>}
                  celdas={cols.map((c) => (
                    <td key={c.id}>
                      {c.nee.programa
                        ? <span className="comp-badge comp-badge--si">✅ Sí</span>
                        : <span className="comp-badge comp-badge--no">❌ No</span>}
                    </td>
                  ))}
                />
                <FilaTabla
                  label="🔥 Nivel de demanda"
                  celdas={cols.map((c) => (
                    <td key={c.id}>
                      <span className={`demand-chip ${demandaClass[c.demanda]}`} style={{ position: 'static' }}>
                        {demandaLabel[c.demanda]}
                      </span>
                    </td>
                  ))}
                />
                {/* Fila de acción */}
                <tr>
                  <td className="comp-tabla__row-label" aria-hidden="true" />
                  {cols.map((c) => (
                    <td key={c.id}>
                      {postulados.includes(c.id) ? (
                        <span className="comp-badge comp-badge--agregado">✓ Agregado</span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn--primary btn--mini"
                          onClick={() => agregarPostulacion(c.id)}
                          aria-label={`Agregar ${c.nombre} a mi postulación`}
                        >
                          + Agregar a postulación
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Vista de tarjetas — móvil (<600px) */}
          <div className="comp-cards-mobile">
            {cols.map((c) => {
              const sp = simcePromedio(c)
              const cp = comunalPromedio(c)
              const arriba = sp >= cp
              return (
                <article key={c.id} className="comp-card-mobile">
                  <h3 className="comp-card-mobile__nombre">{c.nombre}</h3>
                  <p className="comp-card-mobile__meta">{c.comuna}</p>
                  <ul className="comp-card-mobile__lista">
                    <li>
                      <span>📍 Distancia</span>
                      <strong>{c.distanciaBase} km</strong>
                    </li>
                    <li>
                      <span>🕐 Jornada</span>
                      <strong>{c.vacantes[0]?.jornada ?? 'No especificada'}</strong>
                    </li>
                    <li>
                      <span>📊 SIMCE</span>
                      <strong className={arriba ? 'comp-simce--up' : 'comp-simce--down'}>
                        {sp} {arriba ? '↑' : '↓'} <span style={{ fontWeight: 400, fontSize: '0.78rem', color: 'var(--texto-suave)' }}>(com. {cp})</span>
                      </strong>
                    </li>
                    <li>
                      <span>👩‍🏫 Docentes titulados</span>
                      <strong>{c.docentes.titulados}%</strong>
                    </li>
                    <li>
                      <span>♿ Programa NEE</span>
                      {c.nee.programa
                        ? <span className="comp-badge comp-badge--si">✅ Sí</span>
                        : <span className="comp-badge comp-badge--no">❌ No</span>}
                    </li>
                    <li>
                      <span>🔥 Demanda</span>
                      <span className={`demand-chip ${demandaClass[c.demanda]}`} style={{ position: 'static' }}>
                        {demandaLabel[c.demanda]}
                      </span>
                    </li>
                  </ul>
                  <div style={{ marginTop: 12 }}>
                    {postulados.includes(c.id) ? (
                      <span className="comp-badge comp-badge--agregado">✓ Agregado a tu postulación</span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn--primary"
                        style={{ width: '100%' }}
                        onClick={() => agregarPostulacion(c.id)}
                        aria-label={`Agregar ${c.nombre} a mi postulación`}
                      >
                        + Agregar a mi postulación
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* ══ BANNER: colegios agregados ══ */}
      {postulados.length > 0 && (
        <div className="comp-postulados" role="status" aria-live="polite">
          <p>
            <strong>{postulados.length} colegio{postulados.length !== 1 ? 's' : ''}</strong>{' '}
            agregado{postulados.length !== 1 ? 's' : ''} a tu lista.{' '}
            <Link to="/postulacion" className="link-inline">Ir a postular →</Link>
          </p>
        </div>
      )}

      {/* ══ NOTA ACLARATORIA ══ */}
      <p className="form-hint" style={{ marginTop: 24 }}>
        ⚠ Las distancias son estimadas desde el centro de la comuna. Los datos de vacantes son referenciales y pueden cambiar durante el proceso oficial.
      </p>
    </main>
  )
}
