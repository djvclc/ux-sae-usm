import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { colegios, totalVacantes } from '../data/colegios'
import { calcularResultado, prioridadLabels, probAsignacion, nivelPrioridad } from '../utils/asignacion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'

const STORAGE_KEY = 'sae_react_postulacion'
const DRAFT_LIST_KEY = 'sae_react_postulacion_draft_list'

const REGIONES = [
  { value: 'XV',   label: 'Arica y Parinacota',   full: 'Región de Arica y Parinacota' },
  { value: 'I',    label: 'Tarapacá',              full: 'Región de Tarapacá' },
  { value: 'II',   label: 'Antofagasta',           full: 'Región de Antofagasta' },
  { value: 'III',  label: 'Atacama',               full: 'Región de Atacama' },
  { value: 'IV',   label: 'Coquimbo',              full: 'Región de Coquimbo' },
  { value: 'V',    label: 'Valparaíso',            full: 'Región de Valparaíso' },
  { value: 'RM',   label: 'Metropolitana',         full: 'Región Metropolitana de Santiago' },
  { value: 'VI',   label: "O'Higgins",             full: "Región del Libertador Gral. Bernardo O'Higgins" },
  { value: 'VII',  label: 'Maule',                 full: 'Región del Maule' },
  { value: 'XVI',  label: 'Ñuble',                 full: 'Región de Ñuble' },
  { value: 'VIII', label: 'Biobío',                full: 'Región del Biobío' },
  { value: 'IX',   label: 'La Araucanía',          full: 'Región de La Araucanía' },
  { value: 'XIV',  label: 'Los Ríos',              full: 'Región de Los Ríos' },
  { value: 'X',    label: 'Los Lagos',             full: 'Región de Los Lagos' },
  { value: 'XI',   label: 'Aysén',                 full: 'Región de Aysén del Gral. Carlos Ibáñez del Campo' },
  { value: 'XII',  label: 'Magallanes',            full: 'Región de Magallanes y de la Antártica Chilena' },
]

/* ── Datos de prioridades con explicaciones completas ── */
const PRIORIDADES_INFO = {
  hermano: {
    label: 'Hermano/a matriculado/a',
    titulo: 'Prioridad 1 — La más alta por ley',
    icono: '👨‍👩‍👧',
    que_es: 'Tu hijo/a tiene un hermano o hermana que está actualmente matriculado/a en ese colegio.',
    que_implica: 'El colegio debe darte preferencia por sobre todos los demás postulantes que no tienen esta condición. El sistema revisará primero a quienes tienen hermanos antes de asignar los cupos restantes.',
    ejemplo: 'Si Daniela quiere postular a su segundo hijo al Colegio Los Andes, donde ya está su hija mayor, tiene un 92% de probabilidad de quedar asignada (en vez del 28% sin esta prioridad).',
    advertencia: 'Solo aplica si el hermano/a continuará matriculado/a en el mismo colegio el año escolar siguiente. Si el hermano/a egresa, esta prioridad ya no corresponde.',
    color: 'var(--verde)',
  },
  prioritario: {
    label: 'Estudiante prioritario/a',
    titulo: 'Prioridad 2 — Estudiante con SEP',
    icono: '🏫',
    que_es: 'El/la estudiante es considerado/a prioritario/a según la Ley de Subvención Escolar Preferencial (SEP). Esto incluye situaciones de vulnerabilidad socioeconómica verificadas por el MINEDUC.',
    que_implica: 'Tienes la segunda prioridad más alta. El Estado identifica automáticamente a estos estudiantes — no necesitas postular a esta condición. Si el MINEDUC ya te notificó, puedes marcarla.',
    ejemplo: 'Los estudiantes SEP tienen entre 88-98% de probabilidad de asignación según el nivel de demanda del colegio.',
    advertencia: 'Esta condición la verifica el sistema automáticamente. Marcarla sin serlo puede anular tu postulación.',
    color: 'var(--azul)',
  },
  funcionario: {
    label: 'Hijo/a de funcionario/a',
    titulo: 'Prioridad 3 — Funcionario/a del establecimiento',
    icono: '👔',
    que_es: 'El/la apoderado/a trabaja como funcionario/a (docente, asistente de educación u otro cargo) en el establecimiento al que postulas.',
    que_implica: 'Tienes preferencia sobre postulantes sin prioridad especial. Esta condición la verifica el colegio directamente con el MINEDUC a través de los registros de dotación docente.',
    ejemplo: 'Si trabajas como profesora en el Colegio Los Andes y quieres matricular a tu hijo/a ahí, tienes un 65% de probabilidad (versus 28% sin prioridad).',
    advertencia: 'Aplica solo en el establecimiento donde trabajas. No sirve para postular a un colegio distinto al de tu empleo.',
    color: 'var(--naranja)',
  },
  exalumno: {
    label: 'Exalumno/a del establecimiento',
    titulo: 'Prioridad 4 — Exalumno/a',
    icono: '🎓',
    que_es: 'El/la apoderado/a es exalumno/a del mismo establecimiento al que postulas.',
    que_implica: 'Tienes la cuarta prioridad. En la práctica, esta condición tiene impacto solo cuando hay muchos postulantes con las mismas condiciones anteriores agotadas.',
    ejemplo: 'Si fuiste alumna del Colegio Los Andes y quieres que tu hijo/a estudie ahí, tienes un 60% de probabilidad en colegios de alta demanda.',
    advertencia: 'Algunos establecimientos no aplican esta prioridad. Verifica en la ficha del colegio si está habilitada.',
    color: 'var(--gris-med)',
  },
}

/* ── Caja de información contextual ── */
function InfoBox({ icono, titulo, children, tipo = 'info', className = '' }) {
  const colores = {
    info:    { bg: 'var(--azul-cl)',    borde: 'var(--azul)',    texto: 'var(--azul-osc)' },
    exito:   { bg: 'var(--verde-cl)',   borde: 'var(--verde)',   texto: '#145f2c' },
    alerta:  { bg: 'var(--naranja-cl)', borde: 'var(--naranja)', texto: '#6b2d07' },
    neutro:  { bg: 'var(--gris-cl)',    borde: 'var(--borde)',   texto: 'var(--texto)' },
  }
  const c = colores[tipo] ?? colores.info
  return (
    <div
      className={`tut-box ${className}`}
      style={{ background: c.bg, borderLeft: `4px solid ${c.borde}`, color: c.texto }}
      role="note"
    >
      {(icono || titulo) && (
        <p className="tut-box__titulo">
          {icono && <span aria-hidden="true">{icono} </span>}
          {titulo && <strong>{titulo}</strong>}
        </p>
      )}
      {children}
    </div>
  )
}

/* ── Panel de explicación de una prioridad ── */
function PrioridadDetalle({ clave, perfil }) {
  const info = PRIORIDADES_INFO[clave]
  if (!info) return null
  return (
    <div className="tut-prioridad" style={{ '--prio-color': info.color }}>
      <p className="tut-prioridad__titulo">
        <span aria-hidden="true">{info.icono}</span> {info.titulo}
      </p>
      <dl className="tut-prioridad__dl">
        <dt>¿Qué significa?</dt>
        <dd>{info.que_es}</dd>
        <dt>¿Qué implica seleccionarla?</dt>
        <dd>{info.que_implica}</dd>
        <dt>Ejemplo</dt>
        <dd className="tut-prioridad__ejemplo">{info.ejemplo}</dd>
        <dt>⚠ Ten en cuenta</dt>
        <dd className="tut-prioridad__advertencia">{info.advertencia}</dd>
      </dl>
    </div>
  )
}

/* ── Mini-análisis de un colegio en la lista ── */
function ColegioAnalisis({ colegio, orden, perfil }) {
  const nivel = nivelPrioridad(perfil)
  const prob  = probAsignacion(nivel, colegio.demanda)
  const vac   = totalVacantes(colegio)

  const probClass = prob >= 80 ? 'alta' : prob >= 60 ? 'media' : 'baja'
  const demandaTexto = { alta: 'Muchos postulantes compiten por pocas vacantes.', media: 'Competencia moderada por las vacantes.', baja: 'Pocas personas postulando — más fácil de conseguir.' }

  return (
    <div className="tut-colegio-info">
      <div className="tut-colegio-info__header">
        <span className="tut-colegio-info__orden">Opción {orden}</span>
        <span className={`tut-prob tut-prob--${probClass}`}>{prob}% estimado</span>
      </div>
      <p className="tut-colegio-info__nombre">{colegio.nombre}</p>
      <ul className="tut-colegio-info__lista">
        <li>
          <span>Demanda:</span>
          <strong>{colegio.demanda}</strong>
          <span className="tut-hint"> — {demandaTexto[colegio.demanda]}</span>
        </li>
        <li>
          <span>Vacantes totales:</span>
          <strong>{vac}</strong>
        </li>
        <li>
          <span>Tu prioridad:</span>
          <strong>{prioridadLabels[nivel]}</strong>
        </li>
        {orden === 1 && (
          <li className="tut-colegio-info__tip">
            💡 Esta es tu primera opción. El sistema la evalúa primero. Ponla aquí solo si realmente es la que más quieres.
          </li>
        )}
        {colegio.nee.programa && (
          <li className="tut-colegio-info__tip">
            ♿ Este colegio tiene programa <abbr title="Necesidades Educativas Especiales">NEE</abbr>.
          </li>
        )}
      </ul>
    </div>
  )
}

/* ── Formateo y validación de RUT ── */
function formatearRut(valor) {
  const limpio = valor.replace(/[^0-9kK]/g, '').slice(0, 9)
  if (limpio.length < 2) return limpio
  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv
}

function rutValido(rut) {
  return /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(rut)
}

/* ── Componente principal ── */
export default function PostulacionPage() {
  const { textoGrande } = useTextSize()
  const [paso, setPaso]         = useState(1)
  const [loginOk, setLoginOk]   = useState(false)
  const [region, setRegion]     = useState('')
  const [rut, setRut]           = useState('')
  const [rutTocado, setRutTocado] = useState(false)
  const [perfil, setPerfil]     = useState({ hermano: false, prioritario: false, funcionario: false, exalumno: false })
  const [lista, setLista]       = useState([])
  const [toAdd, setToAdd]       = useState('')
  const [confirmado, setConfirmado] = useState(null)
  const [modoTutorial, setModoTutorial] = useState(true)
  const [prioridadAbierta, setPrioridadAbierta] = useState(null)
  const [mostrarRut, setMostrarRut] = useState(false)
  const [alumnoRut, setAlumnoRut]       = useState('')
  const [alumnoNombre, setAlumnoNombre] = useState('')
  const [alumnoNivel, setAlumnoNivel]   = useState('')
  const [alumnoOk, setAlumnoOk]         = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_LIST_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) setLista(parsed.filter((id) => Number.isInteger(id)).slice(0, 8))
    } catch { /* ignora */ }
  }, [])

  useEffect(() => { localStorage.setItem(DRAFT_LIST_KEY, JSON.stringify(lista)) }, [lista])

  const resultado   = useMemo(() => calcularResultado(lista, perfil), [lista, perfil])
  const disponibles = colegios.filter((c) => !lista.includes(c.id))

  const togglePerfil = (key) => {
    setPerfil((prev) => ({ ...prev, [key]: !prev[key] }))
    setPrioridadAbierta((prev) => (prev === key ? null : key))
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

  const quitar = (id) => setLista((prev) => prev.filter((item) => item !== id))

  const siguiente = () => {
    if (paso === 1 && (!loginOk || !region || !alumnoOk)) return
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

  const rutError =
    rutTocado && rut.length > 0 && !rutValido(rut)
      ? 'Formato incorrecto. Escribe tu RUT así: 12.345.678-9 (con puntos y guión).'
      : null

  const hayPrioridad = Object.values(perfil).some(Boolean)

  return (
    <main className={`page page--module${textoGrande ? ' page--texto-grande' : ''}`}>
      <TextSizeBar pageName="Postulación" />

      {/* ── Encabezado con toggle de tutorial ── */}
      <div className="post-header">
        <div>
          <h1>Postular en 3 pasos</h1>
          <p className="page__lead">
            Flujo con <abbr title="Sistema de identidad digital del Estado de Chile">ClaveÚnica</abbr> simulada, selección de colegios y comprobante.
          </p>
        </div>
        <button
          type="button"
          className={`tut-toggle${modoTutorial ? ' tut-toggle--on' : ''}`}
          onClick={() => setModoTutorial((v) => !v)}
          aria-pressed={modoTutorial}
        >
          {modoTutorial ? '📖 Tutorial ON' : '📖 Tutorial OFF'}
        </button>
      </div>

      {modoTutorial && (
        <InfoBox icono="💡" titulo="Modo tutorial activado" tipo="info">
          <p>En cada paso verás explicaciones de lo que significa cada decisión y qué implica para tu postulación. Puedes desactivarlo con el botón de arriba.</p>
        </InfoBox>
      )}

      {/* ── Barra de progreso con etiquetas ── */}
      <nav className="stepper" aria-label={`Progreso de postulación: paso ${paso} de 3`}>
        {[
          { n: 1, label: 'Identifícate' },
          { n: 2, label: 'Tus colegios' },
          { n: 3, label: 'Confirma' },
        ].map(({ n, label }, i) => (
          <Fragment key={n}>
            <div
              className={`stepper__step${paso > n ? ' stepper__step--done' : ''}${paso === n ? ' stepper__step--active' : ''}`}
              aria-current={paso === n ? 'step' : undefined}
            >
              <span className="stepper__num" aria-hidden="true">
                {paso > n ? '✓' : n}
              </span>
              <span className="stepper__label">{label}</span>
            </div>
            {i < 2 && <span className="stepper__linea" aria-hidden="true" />}
          </Fragment>
        ))}
      </nav>

      {/* ══════════════ PASO 1: IDENTIFICACIÓN ══════════════ */}
      {paso === 1 && (
        <Card className="card--module">
          <CardHeader>
            <CardTitle>Identifícate</CardTitle>
            <p className="page__lead" style={{ margin: '4px 0 0' }}>
              Usamos <strong>ClaveÚnica</strong> para verificar que eres el/la apoderado/a legal.
            </p>
          </CardHeader>
          <CardContent>
            {/* Acción principal: ClaveÚnica */}
            {!loginOk && (
              <div className="post-clave-block">
                <div className="post-clave-icon" aria-hidden="true">🔑</div>
                <div className="post-clave-texto">
                  <strong>Ingresar con ClaveÚnica</strong>
                  <p>La clave del Estado chileno. No necesitas crear otra contraseña. Tu clave nunca se comparte con el SAE.</p>
                </div>
                <button
                  type="button"
                  className="btn btn--primary btn--grande"
                  onClick={() => setLoginOk(true)}
                >
                  Ingresar con ClaveÚnica
                </button>

                {/* RUT como opción secundaria colapsada */}
                {!mostrarRut ? (
                  <button
                    type="button"
                    className="btn--text-link"
                    onClick={() => setMostrarRut(true)}
                  >
                    ¿No tengo ClaveÚnica? Ingresar con RUT
                  </button>
                ) : (
                  <div className="post-rut-fallback">
                    <label htmlFor="rut-input" className="form-label">
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
                      className="form-input"
                    />
                    <span id="rut-hint" className="form-hint">Formato: 12.345.678-9</span>
                    {rutError && (
                      <span id="rut-error" className="field-error" role="alert">⚠ {rutError}</span>
                    )}
                    {rutValido(rut) && (
                      <button
                        type="button"
                        className="btn btn--primary"
                        style={{ marginTop: 10 }}
                        onClick={() => setLoginOk(true)}
                      >
                        Continuar con RUT
                      </button>
                    )}
                    {modoTutorial && (
                      <InfoBox tipo="alerta" className="tut-box--sm">
                        <p>Si no tienes ClaveÚnica puedes obtenerla gratis en <strong>claveunica.gob.cl</strong> o en cualquier oficina del Registro Civil. Es lo más recomendable.</p>
                      </InfoBox>
                    )}
                  </div>
                )}

                <p className="post-registro-hint">
                  ¿Aún no tienes cuenta?{' '}
                  <Link to="/registro" className="link-inline">
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            )}

            {/* Estado: ingreso exitoso */}
            {loginOk && (
              <div>
                <p className="small-note post-login-ok" role="status" aria-live="polite">
                  ✅ Ingreso exitoso. Tus datos fueron cargados desde ClaveÚnica.
                </p>

                <div className="post-region-block">
                  <label htmlFor="select-region" className="form-label">
                    ¿En qué región vives?{' '}
                    <span aria-hidden="true" style={{ color: 'var(--rojo)' }}>*</span>
                  </label>
                  {modoTutorial && (
                    <p className="form-hint">
                      Tu región determina qué establecimientos puedes ver. Solo puedes postular a colegios de la región donde vive el/la estudiante.
                    </p>
                  )}
                  <select
                    id="select-region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    aria-required="true"
                    aria-label="Selecciona tu región"
                    className="form-select"
                  >
                    <option value="">Selecciona tu región…</option>
                    {REGIONES.map((r) => (
                      <option key={r.value} value={r.value} title={r.full}>{r.label}</option>
                    ))}
                  </select>
                  {!region && (
                    <span className="form-hint" style={{ color: 'var(--rojo)' }} role="alert">
                      Selecciona tu región para continuar.
                    </span>
                  )}
                </div>

                {/* ── Vinculación de estudiante ── */}
                {region && !alumnoOk && (
                  <div className="post-alumno-block">
                    <div className="post-alumno-block__header">
                      <span className="post-alumno-block__icono" aria-hidden="true">🎒</span>
                      <div>
                        <h3 className="post-alumno-block__titulo">¿Para quién vas a postular?</h3>
                        <p className="post-alumno-block__sub">
                          Ingresa los datos del estudiante que va a participar en el proceso SAE.
                        </p>
                      </div>
                    </div>

                    <div className="rg-campo">
                      <label className="form-label" htmlFor="alum-run">RUN del estudiante</label>
                      <input
                        id="alum-run"
                        type="text"
                        inputMode="numeric"
                        className="form-input rg-input"
                        value={alumnoRut}
                        onChange={(e) => setAlumnoRut(formatearRut(e.target.value))}
                        placeholder="Ej. 25.123.456-7"
                        maxLength={12}
                      />
                    </div>

                    <div className="rg-campo">
                      <label className="form-label" htmlFor="alum-nombre">Nombre completo del estudiante</label>
                      <input
                        id="alum-nombre"
                        type="text"
                        className="form-input rg-input"
                        value={alumnoNombre}
                        onChange={(e) => setAlumnoNombre(e.target.value)}
                        placeholder="Ej. Martina González"
                        autoCapitalize="words"
                      />
                    </div>

                    <div className="rg-campo">
                      <label className="form-label" htmlFor="alum-nivel">Nivel al que postula</label>
                      <select
                        id="alum-nivel"
                        className="form-select"
                        value={alumnoNivel}
                        onChange={(e) => setAlumnoNivel(e.target.value)}
                        style={{ maxWidth: '100%' }}
                      >
                        <option value="">Selecciona un nivel…</option>
                        <option value="Prekínder">Prekínder</option>
                        <option value="Kínder">Kínder</option>
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <option key={n} value={`${n}° básico`}>{n}° básico</option>
                        ))}
                        {[1,2,3,4].map(n => (
                          <option key={n} value={`${n}° medio`}>{n}° medio</option>
                        ))}
                      </select>
                    </div>

                    {modoTutorial && (
                      <InfoBox tipo="info" icono="ℹ️">
                        <p>Puedes vincular un solo estudiante por postulación. Si tienes más de un hijo/a en el proceso, deberás hacer una postulación separada para cada uno/a.</p>
                      </InfoBox>
                    )}

                    <button
                      type="button"
                      className="btn btn--primary"
                      disabled={!rutValido(alumnoRut) || alumnoNombre.trim().length < 3 || !alumnoNivel}
                      onClick={() => setAlumnoOk(true)}
                    >
                      Vincular estudiante
                    </button>
                  </div>
                )}

                {/* Estudiante vinculado — tarjeta de confirmación */}
                {region && alumnoOk && (
                  <div className="post-alumno-card" role="status" aria-live="polite">
                    <span className="post-alumno-card__icono" aria-hidden="true">🎒</span>
                    <div className="post-alumno-card__info">
                      <strong className="post-alumno-card__nombre">{alumnoNombre}</strong>
                      <span className="post-alumno-card__meta">{alumnoNivel} · RUN {alumnoRut}</span>
                    </div>
                    <button
                      type="button"
                      className="btn--text-link post-alumno-card__editar"
                      onClick={() => setAlumnoOk(false)}
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ══════════════ PASO 2: COLEGIOS ══════════════ */}
      {paso === 2 && (
        <Card className="card--module">
          <CardHeader>
            <CardTitle>Paso 2 de 3 — Agrega y ordena tus colegios</CardTitle>
          </CardHeader>
          <CardContent>
            {modoTutorial && (
              <InfoBox icono="📋" titulo="¿Cómo funciona este paso?" tipo="info">
                <p>Primero marca si tienes condiciones de prioridad (son ventajas que te da la ley). Después agrega los colegios que te interesan <strong>en el orden en que los prefieres</strong>. El primero es el que más quieres.</p>
              </InfoBox>
            )}

            {/* Prioridades */}
            <p style={{ marginTop: 14, fontWeight: 600, fontSize: '0.95rem' }}>
              ¿Tienes alguna condición de prioridad?
            </p>
            <span className="form-hint" style={{ marginBottom: 8 }}>
              Marca solo las que aplican a tu caso. El sistema las verifica.
            </span>

            <div className="chip-row">
              {Object.entries(PRIORIDADES_INFO).map(([key, info]) => (
                <button
                  key={key}
                  type="button"
                  className={`chip-btn ${perfil[key] ? 'chip-btn--on' : ''}`}
                  onClick={() => togglePerfil(key)}
                  aria-pressed={perfil[key]}
                  aria-expanded={prioridadAbierta === key}
                  aria-describedby={`prio-detalle-${key}`}
                >
                  {info.icono} {info.label}
                </button>
              ))}
            </div>

            {/* Explicación de la prioridad seleccionada / abierta */}
            {(prioridadAbierta || (modoTutorial && hayPrioridad)) && (
              <div className="tut-prioridades-wrap">
                {Object.entries(PRIORIDADES_INFO).map(([key]) => {
                  const mostrar = modoTutorial ? perfil[key] : prioridadAbierta === key
                  if (!mostrar) return null
                  return (
                    <div key={key} id={`prio-detalle-${key}`} aria-live="polite">
                      <PrioridadDetalle clave={key} perfil={perfil} />
                    </div>
                  )
                })}
              </div>
            )}

            {!hayPrioridad && modoTutorial && (
              <InfoBox tipo="neutro" className="tut-box--sm">
                <p>Si no tienes ninguna condición de prioridad, participarás en el <strong>sorteo público</strong> junto a otros postulantes sin prioridad. El sorteo es certificado por el MINEDUC y completamente transparente.</p>
              </InfoBox>
            )}

            {/* ── Selector visual de colegios ── */}
            <div className="post-picker-wrap" style={{ marginTop: 20 }}>
              <div className="post-picker-header">
                <p className="post-picker-titulo">
                  Elige tus colegios:
                  <span className="post-picker-count" aria-live="polite">
                    {lista.length}/8 seleccionados
                  </span>
                </p>
                {modoTutorial && (
                  <p className="post-picker-hint">
                    📌 <strong>El orden importa:</strong> el sistema evalúa primero tu opción N.°1. Ponla siempre el colegio que <em>más quieres</em>, no el que crees que te van a dar.
                  </p>
                )}
              </div>

              {/* Grid de tarjetas de colegios */}
              <div
                className="post-school-picker"
                role="list"
                aria-label="Colegios disponibles para agregar a tu postulación"
              >
                {colegios.map((c) => {
                  const enLista = lista.includes(c.id)
                  const orden   = lista.indexOf(c.id) + 1
                  const llena   = lista.length >= 8
                  return (
                    <div
                      key={c.id}
                      className={`post-school-card${enLista ? ' post-school-card--added' : ''}${!enLista && llena ? ' post-school-card--bloq' : ''}`}
                      role="listitem"
                    >
                      {enLista && (
                        <span className="post-school-card__badge" aria-hidden="true">{orden}</span>
                      )}
                      <div className="post-school-card__info">
                        <strong className="post-school-card__nombre">{c.nombre}</strong>
                        <span className="post-school-card__meta">
                          {c.comuna}
                          <span className={`demand-chip demand-chip--${c.demanda}`} style={{ position: 'static', marginLeft: 6 }}>
                            {c.demanda}
                          </span>
                        </span>
                      </div>
                      {enLista ? (
                        <button
                          type="button"
                          className="post-school-card__btn post-school-card__btn--quitar"
                          onClick={() => quitar(c.id)}
                          aria-label={`Quitar ${c.nombre} de tu lista (opción ${orden})`}
                        >
                          ✓ Quitar
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="post-school-card__btn post-school-card__btn--agregar"
                          onClick={() => { if (!llena) setLista((prev) => [...prev, c.id]) }}
                          disabled={llena}
                          aria-label={`Agregar ${c.nombre} a tu postulación`}
                        >
                          + Agregar
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Lista ordenada de colegios seleccionados ── */}
            {lista.length > 0 && (
              <div className="post-order-wrap">
                <p className="post-order-titulo">
                  Tu lista en orden de preferencia:
                  <span className="form-hint" style={{ display: 'block', fontWeight: 400 }}>
                    Usa los botones para reordenar. El 1 es el que más quieres.
                  </span>
                </p>
                <ul className="post-order-list" aria-label="Tu lista de colegios en orden de preferencia">
                  {lista.map((id, idx) => {
                    const col = colegios.find((c) => c.id === id)
                    if (!col) return null
                    const vac = totalVacantes(col)
                    return (
                      <li key={id} className="post-item">
                        <span className="post-item__num" aria-hidden="true">{idx + 1}</span>
                        <div className="post-item__body">
                          <strong className="post-item__nombre">{col.nombre}</strong>
                          <span className="post-item__meta">{col.comuna} · {vac} vacantes · {col.demanda} demanda</span>
                          {modoTutorial && (
                            <ColegioAnalisis colegio={col} orden={idx + 1} perfil={perfil} />
                          )}
                        </div>
                        <div className="post-item__acciones">
                          <button
                            type="button"
                            className="post-item__btn"
                            onClick={() => mover(idx, -1)}
                            disabled={idx === 0}
                            aria-label={`Subir ${col.nombre} en la lista`}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="post-item__btn"
                            onClick={() => mover(idx, 1)}
                            disabled={idx === lista.length - 1}
                            aria-label={`Bajar ${col.nombre} en la lista`}
                          >
                            ↓
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                {modoTutorial && lista.length >= 2 && (
                  <InfoBox tipo="exito" className="tut-box--sm">
                    <p>Tienes {lista.length} colegios. Más opciones = más probabilidades. Puedes agregar hasta 8.</p>
                  </InfoBox>
                )}
              </div>
            )}

            {!lista.length && (
              <p className="form-hint" role="status" style={{ marginTop: 8 }}>
                Toca "+ Agregar" en los colegios que te interesen para armar tu lista.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ══════════════ PASO 3: CONFIRMACIÓN ══════════════ */}
      {paso === 3 && (
        <Card className="card--module">
          <CardHeader>
            <CardTitle>Paso 3 de 3 — Revisa y confirma</CardTitle>
          </CardHeader>
          <CardContent>
            {modoTutorial && (
              <InfoBox icono="👁" titulo="¿Qué estás a punto de enviar?" tipo="info">
                <p>Esta es tu postulación final. Una vez que hagas clic en "Confirmar", el sistema registra tu lista. <strong>Podrás modificarla durante el período de postulación</strong> antes de la fecha límite (30 de agosto). Después de esa fecha, la lista queda fija.</p>
              </InfoBox>
            )}

            <div className="post-alumno-card post-alumno-card--resumen" aria-label="Estudiante vinculado">
              <span className="post-alumno-card__icono" aria-hidden="true">🎒</span>
              <div className="post-alumno-card__info">
                <strong className="post-alumno-card__nombre">{alumnoNombre}</strong>
                <span className="post-alumno-card__meta">{alumnoNivel} · RUN {alumnoRut}</span>
              </div>
            </div>

            <p>Prioridad aplicada: <strong>{prioridadLabels[resultado.nivel]}</strong></p>

            {modoTutorial && (
              <InfoBox tipo="neutro" className="tut-box--sm">
                <p>Tu prioridad se aplica a <strong>todos</strong> los colegios de tu lista. No puedes tener distinta prioridad por colegio.</p>
              </InfoBox>
            )}

            <ul className="sim-list post-list" aria-label="Resumen de tu postulación" style={{ marginTop: 14 }}>
              {resultado.detalles.map((d) => {
                const probClass = d.prob >= 80 ? 'alta' : d.prob >= 60 ? 'media' : 'baja'
                return (
                  <li key={d.id} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>
                        <strong>{d.idx}.</strong> {d.nombre}
                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--texto-suave)' }}>{d.demanda} demanda</span>
                      </span>
                      <span className={`tut-prob tut-prob--${probClass}`} aria-label={`Probabilidad estimada: ${d.prob}%`}>
                        {d.prob}%
                      </span>
                    </div>
                    {modoTutorial && (
                      <p className="tut-prob-explicacion">
                        {d.prob >= 80
                          ? `✅ Muy buena probabilidad. De cada 100 postulantes con tu misma condición en este colegio, aproximadamente ${d.prob} quedan asignados.`
                          : d.prob >= 60
                            ? `🟡 Probabilidad moderada. Tienes buenas chances, pero no está garantizado. Considera agregar más opciones.`
                            : `🔴 Probabilidad baja. Este colegio tiene alta demanda para tu nivel de prioridad. Considera ponerlo más abajo en tu lista o agregar colegios con menos demanda.`
                        }
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>

            <span className="form-hint" style={{ marginTop: 8, display: 'block' }}>
              Los porcentajes son estimaciones. El resultado real lo entrega el sistema el día de los resultados.
            </span>

            {modoTutorial && (
              <InfoBox icono="📅" titulo="¿Cuándo sabrás el resultado?" tipo="neutro">
                <p>Los resultados se publican en la sección <strong>Mi postulación</strong> a partir del <strong>15 de octubre de 2026</strong>. Recibirás una notificación en el correo que registraste. Tendrás 5 días hábiles para aceptar o rechazar el colegio asignado.</p>
              </InfoBox>
            )}

            {!confirmado ? (
              <button type="button" className="btn btn--primary btn--grande" style={{ marginTop: 16 }} onClick={confirmar}>
                Confirmar y enviar postulación
              </button>
            ) : (
              <div className="sim-result" role="status" aria-live="polite">
                <h3>✅ Postulación enviada</h3>
                <p>Número de comprobante: <strong>{confirmado.comprobante}</strong></p>
                <p>Guarda este número. Los resultados estarán disponibles en <strong>Mi postulación</strong> a partir de la fecha de resultados.</p>
                {modoTutorial && (
                  <InfoBox icono="💾" titulo="¿Qué hacer ahora?" tipo="exito">
                    <p>Guarda tu número de comprobante (<strong>{confirmado.comprobante}</strong>). También puedes hacer una captura de pantalla. Si quieres cambiar algo, vuelve antes del 30 de agosto — puedes modificar tu lista todas las veces que necesites hasta esa fecha.</p>
                  </InfoBox>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navegación entre pasos */}
      <div className="hero__actions" style={{ marginTop: 16 }}>
        {paso > 1 && (
          <button type="button" className="btn btn--secondary btn--dark" onClick={anterior}>← Atrás</button>
        )}
        {paso < 3 && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={siguiente}
            disabled={(paso === 1 && (!loginOk || !region || !alumnoOk)) || (paso === 2 && !lista.length)}
            title={
              paso === 1 && !loginOk ? 'Primero debes ingresar con ClaveÚnica o con tu RUT'
              : paso === 1 && !region ? 'Debes seleccionar tu región para continuar'
              : paso === 1 && !alumnoOk ? 'Debes vincular al estudiante para continuar'
              : paso === 2 && !lista.length ? 'Debes agregar al menos un colegio para continuar'
              : undefined
            }
          >
            Siguiente →
          </button>
        )}
      </div>
    </main>
  )
}
