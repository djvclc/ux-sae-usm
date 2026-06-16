import { useEffect, useMemo, useState } from 'react'
import { colegios, totalVacantes } from '../data/colegios'
import { calcularResultado, prioridadLabels } from '../utils/asignacion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'

const STORAGE_KEY = 'sae_react_postulacion'
const DRAFT_LIST_KEY = 'sae_react_postulacion_draft_list'

/* Regiones en orden geográfico norte → sur (S12-3) */
const REGIONES = [
  { value: 'XV', label: 'Arica y Parinacota',         full: 'Región de Arica y Parinacota' },
  { value: 'I',  label: 'Tarapacá',                   full: 'Región de Tarapacá' },
  { value: 'II', label: 'Antofagasta',                full: 'Región de Antofagasta' },
  { value: 'III',label: 'Atacama',                    full: 'Región de Atacama' },
  { value: 'IV', label: 'Coquimbo',                   full: 'Región de Coquimbo' },
  { value: 'V',  label: 'Valparaíso',                 full: 'Región de Valparaíso' },
  { value: 'RM', label: 'Metropolitana',               full: 'Región Metropolitana de Santiago' },
  { value: 'VI', label: "O'Higgins",                  full: "Región del Libertador Gral. Bernardo O'Higgins" },
  { value: 'VII',label: 'Maule',                      full: 'Región del Maule' },
  { value: 'XVI',label: 'Ñuble',                      full: 'Región de Ñuble' },
  { value: 'VIII',label:'Biobío',                     full: 'Región del Biobío' },
  { value: 'IX', label: 'La Araucanía',               full: 'Región de La Araucanía' },
  { value: 'XIV',label: 'Los Ríos',                   full: 'Región de Los Ríos' },
  { value: 'X',  label: 'Los Lagos',                  full: 'Región de Los Lagos' },
  { value: 'XI', label: 'Aysén',                      full: 'Región de Aysén del Gral. Carlos Ibáñez del Campo' },
  { value: 'XII',label: 'Magallanes',                 full: 'Región de Magallanes y de la Antártica Chilena' },
]

/* Formatea RUT mientras el usuario escribe — ej: 123456789 → 12.345.678-9 */
function formatearRut(valor) {
  const limpio = valor.replace(/[^0-9kK]/g, '').slice(0, 9)
  if (limpio.length < 2) return limpio
  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv
}

/* Valida formato X.XXX.XXX-X o XX.XXX.XXX-X */
function rutValido(rut) {
  return /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(rut)
}

export default function PostulacionPage() {
  const { textoGrande } = useTextSize()
  const [paso, setPaso] = useState(1)
  const [loginOk, setLoginOk] = useState(false)
  const [region, setRegion] = useState('')
  const [rut, setRut] = useState('')
  const [rutTocado, setRutTocado] = useState(false)
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
      // Ignora errores de parseo para no bloquear el flujo de postulación.
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
    if (paso === 1 && (!loginOk || !region)) return
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

  /* Error de RUT — solo visible si el usuario ya tocó el campo (S2-3, S19-1) */
  const rutError =
    rutTocado && rut.length > 0 && !rutValido(rut)
      ? 'Formato incorrecto. Escribe tu RUT así: 12.345.678-9 (con puntos y guión).'
      : null

  return (
    <main className={`page page--module${textoGrande ? ' page--texto-grande' : ''}`}>
      <TextSizeBar pageName="Postulación" />
      <h1>Postular en 3 pasos</h1>
      <p className="page__lead">
        Flujo funcional con <abbr title="Sistema de identidad digital del Estado de Chile">ClaveÚnica</abbr>{' '}
        simulada, orden de colegios y confirmación con comprobante.
      </p>

      {/* Barra de progreso accesible — visible en todo momento (S20-2) */}
      <div
        className="stepper"
        role="progressbar"
        aria-valuenow={paso}
        aria-valuemin={1}
        aria-valuemax={3}
        aria-label={`Paso ${paso} de 3`}
      >
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`stepper__item ${paso >= n ? 'stepper__item--on' : ''}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="form-hint" style={{ marginBottom: 12 }}>
        Estás en el paso {paso} de 3.
      </p>

      {/* ── PASO 1: Identificación ── */}
      {paso === 1 ? (
        <Card className="card--module">
          <CardHeader>
            <CardTitle>Paso 1 de 3 — Identifícate</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Ingresa con <strong>ClaveÚnica</strong> para cargar tus datos automáticamente.
              Es la forma más rápida y segura. Si no tienes RUN chileno, puedes crear una cuenta SAE.
            </p>

            {/* ClaveÚnica como opción principal (S17-1) */}
            <div className="hero__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setLoginOk(true)}
              >
                Ingresar con ClaveÚnica
              </button>
              <button type="button" className="btn btn--secondary btn--dark">
                Crear cuenta SAE
              </button>
            </div>

            {loginOk ? (
              <div>
                <p className="small-note" role="status" aria-live="polite">
                  ✅ Ingreso exitoso. Tus datos fueron cargados desde ClaveÚnica.
                </p>
                {/* Selector de región — orden geográfico norte→sur (S12-3) */}
                <div style={{ marginTop: 20 }}>
                  <label
                    htmlFor="select-region"
                    style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: '0.95rem' }}
                  >
                    ¿En qué región vives? <span aria-hidden="true" style={{ color: 'var(--rojo)' }}>*</span>
                  </label>
                  <span className="form-hint" style={{ marginBottom: 6 }}>
                    Selecciona tu región para ver colegios cercanos.
                  </span>
                  <select
                    id="select-region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    aria-required="true"
                    aria-label="Selecciona tu región"
                    style={{ display: 'block', marginTop: 4 }}
                  >
                    <option value="">Selecciona tu región…</option>
                    {REGIONES.map((r) => (
                      <option key={r.value} value={r.value} title={r.full}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  {!region && (
                    <span className="form-hint" style={{ color: 'var(--rojo)', marginTop: 4 }}>
                      Debes seleccionar una región para continuar.
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* Campo RUT alternativo con validación en tiempo real (S19-1) */
              <div style={{ marginTop: 20 }}>
                <p style={{ marginBottom: 8, fontWeight: 600, fontSize: '0.95rem' }}>
                  ¿No puedes usar ClaveÚnica? Ingresa tu RUT:
                </p>
                <label
                  htmlFor="rut-input"
                  style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem', fontWeight: 600 }}
                >
                  RUT del apoderado/a
                </label>
                <input
                  id="rut-input"
                  type="text"
                  inputMode="numeric"
                  value={rut}
                  onChange={(e) => setRut(formatearRut(e.target.value))}
                  onBlur={() => setRutTocado(true)}
                  placeholder="12.345.678-9"
                  maxLength={12}
                  aria-describedby="rut-hint rut-error"
                  aria-invalid={rutError ? 'true' : undefined}
                  style={{
                    border: `2px solid ${rutError ? 'var(--rojo)' : 'var(--borde)'}`,
                    borderRadius: 'var(--radio)',
                    padding: '10px 14px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    width: '100%',
                    maxWidth: 280,
                    display: 'block',
                  }}
                />
                {/* Ayuda contextual antes del error (S2-4) */}
                <span id="rut-hint" className="form-hint">
                  Escribe tu RUT en formato 12.345.678-9. Máximo 12 caracteres.
                </span>
                {/* Mensaje de error con instrucción de solución (S2-3) */}
                {rutError ? (
                  <span id="rut-error" className="field-error" role="alert">
                    ⚠ {rutError}
                  </span>
                ) : null}
                {rutValido(rut) ? (
                  <button
                    type="button"
                    className="btn btn--primary"
                    style={{ marginTop: 12 }}
                    onClick={() => setLoginOk(true)}
                  >
                    Continuar con RUT
                  </button>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* ── PASO 2: Agregar y ordenar colegios ── */}
      {paso === 2 ? (
        <Card className="card--module">
          <CardHeader>
            <CardTitle>Paso 2 de 3 — Agrega y ordena tus colegios</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Puedes agregar hasta 8 colegios. El primero de la lista es tu primera opción.</p>

            <p style={{ marginTop: 14, fontWeight: 600, fontSize: '0.95rem' }}>
              ¿Tienes alguna de estas condiciones de prioridad? (opcional)
            </p>
            <span className="form-hint" style={{ marginBottom: 8 }}>
              Marcar tus condiciones reales aumenta la exactitud de la estimación.
            </span>

            <div className="chip-row">
              {[
                ['hermano', 'Hermano/a matriculado/a', 'Prioridad 1 — más alta por ley'],
                ['prioritario', 'Estudiante prioritario/a', 'Prioridad 2 — estudiantes con SEP'],
                ['funcionario', 'Hijo/a de funcionario/a del establecimiento', 'Prioridad 3'],
                ['exalumno', 'Exalumno/a del establecimiento', 'Prioridad 4'],
              ].map(([key, label, titulo]) => (
                <button
                  key={key}
                  type="button"
                  className={`chip-btn ${perfil[key] ? 'chip-btn--on' : ''}`}
                  onClick={() => togglePerfil(key)}
                  title={titulo}
                  aria-pressed={perfil[key]}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="add-row" style={{ marginTop: 16 }}>
              <select
                id="select-colegio"
                value={toAdd}
                onChange={(e) => setToAdd(e.target.value)}
                aria-label="Selecciona un colegio para agregar a tu lista de postulación"
              >
                <option value="">Selecciona un colegio…</option>
                {disponibles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} — {c.comuna} ({c.demanda} demanda)
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn--primary"
                onClick={addColegio}
                disabled={!toAdd}
                aria-label="Agregar colegio seleccionado a tu lista"
              >
                Agregar
              </button>
            </div>
            <span className="form-hint">
              {lista.length} de 8 colegios agregados. Usa ↑ Subir y ↓ Bajar para ordenar por preferencia.
            </span>

            <ul className="sim-list post-list" aria-label="Tu lista de colegios en orden de preferencia">
              {lista.map((id, idx) => {
                const col = colegios.find((c) => c.id === id)
                if (!col) return null
                const vac = totalVacantes(col)
                return (
                  <li key={id}>
                    <span>
                      <strong>{idx + 1}.</strong> {col.nombre}
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--texto-suave)' }}>
                        {col.comuna} · {vac} vacantes · demanda {col.demanda}
                      </span>
                    </span>
                    <span className="inline-actions">
                      <button
                        type="button"
                        onClick={() => mover(idx, -1)}
                        disabled={idx === 0}
                        aria-label={`Subir ${col.nombre} en la lista de preferencias`}
                      >
                        ↑ Subir
                      </button>
                      <button
                        type="button"
                        onClick={() => mover(idx, 1)}
                        disabled={idx === lista.length - 1}
                        aria-label={`Bajar ${col.nombre} en la lista de preferencias`}
                      >
                        ↓ Bajar
                      </button>
                      <button
                        type="button"
                        onClick={() => quitar(id)}
                        aria-label={`Quitar ${col.nombre} de la lista`}
                        style={{ color: 'var(--rojo)' }}
                      >
                        Quitar
                      </button>
                    </span>
                  </li>
                )
              })}
            </ul>
            {!lista.length ? (
              <p className="form-hint" role="status">
                Aún no has agregado colegios. Selecciona uno en el menú de arriba y haz clic en "Agregar".
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {/* ── PASO 3: Revisión y confirmación ── */}
      {paso === 3 ? (
        <Card className="card--module">
          <CardHeader>
            <CardTitle>Paso 3 de 3 — Revisa y confirma</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Revisa tu lista antes de enviar. Una vez confirmada, recibirás un número de comprobante.
            </p>
            <p>
              Prioridad aplicada: <strong>{prioridadLabels[resultado.nivel]}</strong>
            </p>

            <ul className="sim-list post-list" aria-label="Resumen de tu postulación">
              {resultado.detalles.map((d) => (
                <li key={d.id}>
                  <span>
                    <strong>{d.idx}.</strong> {d.nombre}
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--texto-suave)' }}>
                      {d.demanda} demanda
                    </span>
                  </span>
                  <span aria-label={`Probabilidad estimada: ${d.prob} por ciento`}>
                    {d.prob}%
                  </span>
                </li>
              ))}
            </ul>

            <span className="form-hint" style={{ marginTop: 8 }}>
              Los porcentajes son estimaciones. El resultado real lo entrega el sistema el día de los resultados.
            </span>

            {!confirmado ? (
              <button
                type="button"
                className="btn btn--primary btn--grande"
                style={{ marginTop: 16 }}
                onClick={confirmar}
              >
                Confirmar y enviar postulación
              </button>
            ) : (
              <div className="sim-result" role="status" aria-live="polite">
                <h3>✅ Postulación enviada</h3>
                <p>
                  Número de comprobante: <strong>{confirmado.comprobante}</strong>
                </p>
                <p>
                  Guarda este número. Los resultados estarán disponibles en{' '}
                  <strong>Mi postulación</strong> a partir de la fecha de resultados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* Botones de navegación entre pasos */}
      <div className="hero__actions" style={{ marginTop: 16 }}>
        {paso > 1 ? (
          <button type="button" className="btn btn--secondary btn--dark" onClick={anterior}>
            ← Atrás
          </button>
        ) : null}
        {paso < 3 ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={siguiente}
            disabled={(paso === 1 && (!loginOk || !region)) || (paso === 2 && !lista.length)}
            title={
              paso === 1 && !loginOk
                ? 'Primero debes ingresar con ClaveÚnica o con tu RUT'
                : paso === 1 && !region
                  ? 'Debes seleccionar tu región para continuar'
                  : paso === 2 && !lista.length
                    ? 'Debes agregar al menos un colegio para continuar'
                    : undefined
            }
          >
            Siguiente →
          </button>
        ) : null}
      </div>
    </main>
  )
}
