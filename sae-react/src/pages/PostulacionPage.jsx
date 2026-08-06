// PostulacionPage — flujo de postulación en 3 pasos
// S22: rediseño de fidelidad y flujo según docs/investigacion/analisis_flujo_postulacion.md (2026-08-04)
// Fechas y reglas: investigacion_paso_a_paso_sae.md (§2.1 y §3) — calendario oficial Admisión 2027
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { colegios, colegiosById, totalVacantes } from '../data/colegios'
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

/* ── Datos de prioridades con explicaciones completas ──
   S22-6 (corrige E6): títulos y textos según el orden real de procesamiento
   (PIE → hermanos → 15 % prioritarios → funcionario → exalumno); el 15 % es
   una reserva de asientos, no un puesto en una fila. */
const PRIORIDADES_INFO = {
  hermano: {
    label: 'Hermano/a matriculado/a',
    titulo: 'Hermano/a matriculado/a — se revisa primero (después de los cupos PIE)',
    icono: '👨‍👩‍👧',
    que_es: 'Tu hijo/a tiene un hermano o hermana que está actualmente matriculado/a en ese colegio.',
    que_implica: 'Después de llenar los cupos del Programa de Integración Escolar (PIE), el sistema revisa primero a quienes tienen hermanos/as en el colegio, antes de asignar los asientos restantes.',
    ejemplo: 'Si Daniela quiere postular a su segundo hijo al Colegio Los Andes, donde ya está su hija mayor, tiene un 92% de probabilidad de quedar asignada (en vez del 28% sin esta prioridad).',
    advertencia: 'Solo aplica si el hermano/a continuará matriculado/a en el mismo colegio el año escolar siguiente. Si el hermano/a egresa, esta prioridad ya no corresponde.',
    color: 'var(--verde)',
  },
  prioritario: {
    label: 'Estudiante prioritario/a',
    titulo: 'Reserva del 15 % — asientos guardados para estudiantes prioritarios/as',
    icono: '🏫',
    que_es: 'El/la estudiante es considerado/a prioritario/a según la Ley de Subvención Escolar Preferencial (SEP). Esto incluye situaciones de vulnerabilidad socioeconómica verificadas por el MINEDUC.',
    que_implica: 'No es un puesto en una fila: cada colegio guarda el 15 % de sus asientos para estudiantes prioritarios/as. Si perteneces a este grupo, compites por esos asientos reservados además de los generales. El Estado identifica automáticamente a estos estudiantes — no necesitas postular a esta condición.',
    ejemplo: 'Los estudiantes SEP tienen entre 88-98% de probabilidad de asignación según el nivel de demanda del colegio.',
    advertencia: 'Esta condición la verifica el sistema automáticamente. Marcarla sin serlo puede anular tu postulación.',
    color: 'var(--azul)',
  },
  funcionario: {
    label: 'Hijo/a de funcionario/a',
    titulo: 'Hijo/a de funcionario/a — se revisa después de la reserva del 15 %',
    icono: '👔',
    que_es: 'El/la apoderado/a trabaja como funcionario/a (docente, asistente de educación u otro cargo) en el establecimiento al que postulas.',
    que_implica: 'Tienes preferencia sobre postulantes sin prioridad especial, una vez asignados los cupos PIE, los hermanos/as y la reserva del 15 %. Esta condición la verifica el colegio directamente con el MINEDUC a través de los registros de dotación docente.',
    ejemplo: 'Si trabajas como profesora en el Colegio Los Andes y quieres matricular a tu hijo/a ahí, tienes un 65% de probabilidad (versus 28% sin prioridad).',
    advertencia: 'Aplica solo en el establecimiento donde trabajas. No sirve para postular a un colegio distinto al de tu empleo.',
    color: 'var(--naranja)',
  },
  exalumno: {
    label: 'Exalumno/a del establecimiento',
    titulo: 'Exalumno/a — la última prioridad antes del desempate aleatorio',
    icono: '🎓',
    que_es: 'El/la apoderado/a es exalumno/a del mismo establecimiento al que postulas.',
    que_implica: 'Es la última condición que revisa el sistema antes del desempate aleatorio. En la práctica, tiene impacto solo cuando quedan asientos después de las condiciones anteriores.',
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
function PrioridadDetalle({ clave }) {
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

/* ── S22-11: tramo de vacantes del esquema v2 según el nivel del estudiante ── */
function vacantesDeNivel(colegio, nivelAlumno) {
  if (!nivelAlumno) return null
  let clave = null
  if (nivelAlumno === 'Prekínder') clave = 'preKinder'
  else if (nivelAlumno === 'Kínder') clave = 'kinder'
  else if (nivelAlumno.includes('básico')) clave = 'basico'
  else if (nivelAlumno.includes('medio')) clave = 'medio'
  return colegio.vacantes.find((v) => v.nivel === clave) ?? null
}

/* ── Mini-análisis de un colegio en la lista ── */
function ColegioAnalisis({ colegio, orden, perfil, nivelAlumno }) {
  const nivel = nivelPrioridad(perfil)
  const prob  = probAsignacion(nivel, colegio.demanda)
  const vac   = totalVacantes(colegio)
  // S22-11: postulantes del año anterior y vacantes por nivel como fundamento del % estimado
  const vacNivel = vacantesDeNivel(colegio, nivelAlumno)

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
        {vacNivel ? (
          <>
            <li>
              <span>Vacantes en {vacNivel.label}:</span>
              <strong>entre {vacNivel.min} y {vacNivel.max}</strong>
            </li>
            <li>
              <span>Postulantes el año pasado:</span>
              <strong>{vacNivel.postulantesAnterior}</strong>
            </li>
            <li className="tut-colegio-info__tip">
              📊 El {prob}% estimado nace de estos datos: el año pasado postularon {vacNivel.postulantesAnterior} personas a un máximo de {vacNivel.max} cupos en {vacNivel.label}, más tu condición de prioridad.
            </li>
          </>
        ) : nivelAlumno ? (
          <li className="tut-colegio-info__tip">
            ⚠ Este colegio no publica vacantes para {nivelAlumno}. Revisa su ficha antes de postular.
          </li>
        ) : (
          <li>
            <span>Vacantes totales:</span>
            <strong>{vac}</strong>
          </li>
        )}
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

/* S22-9: carga perezosa del borrador guardado (sin tope de 8 — corrige E2) */
function cargarBorradorInicial() {
  try {
    const raw = localStorage.getItem(DRAFT_LIST_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => Number.isInteger(id)) : []
  } catch { return [] }
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
  const [lista, setLista]       = useState(cargarBorradorInicial)
  const [confirmado, setConfirmado] = useState(null)
  const [modoTutorial, setModoTutorial] = useState(true)
  const [prioridadAbierta, setPrioridadAbierta] = useState(null)
  const [mostrarRut, setMostrarRut] = useState(false)
  const [alumnoRut, setAlumnoRut]       = useState('')
  const [alumnoNombre, setAlumnoNombre] = useState('')
  const [alumnoNivel, setAlumnoNivel]   = useState('')
  const [alumnoOk, setAlumnoOk]         = useState(false)
  const [confirmandoNivel, setConfirmandoNivel] = useState(false)   // S22-12
  const [postulaHermanos, setPostulaHermanos]   = useState(false)   // S22-13
  const [borradorGuardado, setBorradorGuardado] = useState(false)   // S22-9
  const [anuncioOrden, setAnuncioOrden]         = useState('')      // S22-8
  const [dragIdx, setDragIdx]           = useState(null)            // S22-8
  const [dragOverIdx, setDragOverIdx]   = useState(null)            // S22-8
  const [comprobanteDescargado, setComprobanteDescargado] = useState(false) // S22-7

  // S22-9: aviso de reanudación si llegamos con un borrador guardado (fijado al primer render)
  const [borradorCargado] = useState(lista.length > 0)

  // S22-9: persistencia del borrador; el indicador visible se activa en cada acción del usuario
  useEffect(() => {
    localStorage.setItem(DRAFT_LIST_KEY, JSON.stringify(lista))
  }, [lista])

  const resultado = useMemo(() => calcularResultado(lista, perfil), [lista, perfil])

  const togglePerfil = (key) => {
    setPerfil((prev) => ({ ...prev, [key]: !prev[key] }))
    setPrioridadAbierta((prev) => (prev === key ? null : key))
  }

  /* S22-8: reordenamiento compartido por botones ↑↓ y arrastrar/soltar,
     con anuncio del nuevo orden para lectores de pantalla */
  const reordenar = (desde, hasta) => {
    if (desde == null || hasta == null || desde === hasta) return
    if (desde < 0 || hasta < 0 || desde >= lista.length || hasta >= lista.length) return
    const copia = [...lista]
    const [movido] = copia.splice(desde, 1)
    copia.splice(hasta, 0, movido)
    setLista(copia)
    setBorradorGuardado(true) // S22-9
    const col = colegiosById[movido]
    setAnuncioOrden(`${col ? col.nombre : 'Colegio'} ahora es tu opción número ${hasta + 1} de ${copia.length}.`)
  }

  const mover = (idx, delta) => reordenar(idx, idx + delta)

  const agregar = (id) => {
    setLista((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setBorradorGuardado(true) // S22-9
  }

  const quitar = (id) => {
    setLista((prev) => prev.filter((item) => item !== id))
    setBorradorGuardado(true) // S22-9
  }

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
      alumno: { nombre: alumnoNombre, run: alumnoRut, nivel: alumnoNivel },
      perfil,
      lista,
      resultado,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    setConfirmado(payload)
  }

  /* S22-7: comprobante descargable simulado — folio, lista ordenada y fechas siguientes.
     Fechas: calendario oficial Admisión 2027 (investigacion_paso_a_paso_sae.md §3). */
  const descargarComprobante = () => {
    if (!confirmado) return
    const lineas = [
      '══════════════════════════════════════════',
      '     COMPROBANTE DE POSTULACIÓN SAE',
      '     Sistema de Admisión Escolar (prototipo)',
      '══════════════════════════════════════════',
      '',
      `Folio: ${confirmado.comprobante}`,
      `Fecha de envío: ${new Date(confirmado.fecha).toLocaleString('es-CL')}`,
      `Estudiante: ${alumnoNombre} (RUN ${alumnoRut})`,
      `Nivel al que postula: ${alumnoNivel}`,
      `Prioridad aplicada: ${prioridadLabels[resultado.nivel]}`,
      '',
      '── LISTA EN ORDEN DE PREFERENCIA ──',
      ...lista.map((id, i) => {
        const c = colegiosById[id]
        return `${i + 1}. ${c ? `${c.nombre} — ${c.comuna}` : 'Colegio'}`
      }),
      '',
      '── PRÓXIMAS FECHAS (ADMISIÓN 2027) ──',
      'Cierre del Periodo Principal: 27 de agosto de 2026, 14:00',
      'Resultados del Periodo Principal: 15 al 21 de octubre de 2026',
      'Resultados de listas de espera: 28 y 29 de octubre de 2026',
      'Postulación Periodo Complementario: 10 al 17 de noviembre de 2026',
      'Matrícula presencial: 9 al 22 de diciembre de 2026',
      '',
      'Tu postulación es válida cuando descargas este comprobante.',
      'Documento simulado con fines de prototipo.',
    ]
    const blob = new Blob([lineas.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comprobante_${confirmado.comprobante}.txt`
    a.click()
    URL.revokeObjectURL(url)
    setComprobanteDescargado(true)
  }

  const rutError =
    rutTocado && rut.length > 0 && !rutValido(rut)
      ? 'Formato incorrecto. Escribe tu RUT así: 12.345.678-9 (con puntos y guión).'
      : null

  const hayPrioridad = Object.values(perfil).some(Boolean)

  // S22-14: aviso de lista corta con todas las opciones de alta demanda
  const listaColegios = lista.map((id) => colegiosById[id]).filter(Boolean)
  const listaCortaYAlta =
    listaColegios.length > 0 && listaColegios.length < 6 && listaColegios.every((c) => c.demanda === 'alta')

  return (
    <main className={`page page--module${textoGrande ? ' page--texto-grande' : ''}`}>
      <TextSizeBar pageName="Postulación" />

      {/* S22-8: anuncio del nuevo orden para lectores de pantalla */}
      <p className="sr-only" role="status" aria-live="polite">{anuncioOrden}</p>

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

      {/* S22-9: aviso de reanudación al volver con un borrador guardado */}
      {borradorCargado && !confirmado && (
        <InfoBox icono="📂" titulo="Retomaste tu borrador" tipo="info">
          <p>
            Guardamos tu lista con {lista.length} {lista.length === 1 ? 'colegio' : 'colegios'} la última vez.
            Puedes seguir donde quedaste: tu avance se guarda automáticamente en este dispositivo.
          </p>
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
                  {/* S22-1 (corrige E1): la región es solo un filtro de exploración, no una restricción */}
                  <p className="form-hint">
                    Usamos tu región para mostrarte primero los colegios cercanos. Puedes postular a colegios de otras comunas y regiones si así lo deseas.
                  </p>
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
                        onChange={(e) => { setAlumnoNivel(e.target.value); setConfirmandoNivel(false) }}
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

                    {/* S22-13: postulación familiar en bloque */}
                    <div className="rg-campo">
                      <label className="form-label post-hermanos-check" htmlFor="check-hermanos">
                        <input
                          id="check-hermanos"
                          type="checkbox"
                          checked={postulaHermanos}
                          onChange={(e) => setPostulaHermanos(e.target.checked)}
                        />
                        ¿Postulas también a un hermano o una hermana?
                      </label>
                    </div>

                    {postulaHermanos && (
                      <InfoBox icono="👨‍👩‍👧‍👦" titulo="Postulación familiar en bloque" tipo="info">
                        <p>Cuando postulas a dos o más hermanos/as, puedes pedir la <strong>postulación en bloque</strong>: el sistema intenta dejarlos en el mismo colegio.</p>
                        <p>Si tu hijo/a mayor queda admitido/a, el sistema <strong>reordena automáticamente</strong> la lista del menor y pone primero el colegio del mayor. Así se ve la simulación:</p>
                        <p>
                          Lista del menor antes: <strong>1. Colegio San Martín · 2. Colegio Los Andes</strong><br />
                          El mayor queda en Colegio Los Andes ➜ lista del menor ahora: <strong>1. Colegio Los Andes · 2. Colegio San Martín</strong>
                        </p>
                        <p>En este prototipo simulamos una postulación a la vez. En el sistema real marcas esta opción al postular a cada hermano/a.</p>
                      </InfoBox>
                    )}

                    {modoTutorial && (
                      <InfoBox tipo="info" icono="ℹ️">
                        <p>Vinculas un estudiante por postulación. Si postulas a hermanos/as, harás una postulación para cada uno/a y puedes pedir la <strong>postulación familiar en bloque</strong> para que el sistema intente dejarlos juntos.</p>
                      </InfoBox>
                    )}

                    {/* S22-12: confirmación explícita del nivel antes de vincular */}
                    {!confirmandoNivel ? (
                      <button
                        type="button"
                        className="btn btn--primary"
                        disabled={!rutValido(alumnoRut) || alumnoNombre.trim().length < 3 || !alumnoNivel}
                        onClick={() => setConfirmandoNivel(true)}
                      >
                        Vincular estudiante
                      </button>
                    ) : (
                      <InfoBox icono="🎯" titulo="Verifica el curso antes de continuar" tipo="alerta">
                        <p>
                          Vas a postular a <strong>{alumnoNombre}</strong> al nivel <strong>{alumnoNivel}</strong>.
                          Postular a un curso incorrecto es el error más frecuente y puede afectar tu asignación.
                        </p>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                          <button
                            type="button"
                            className="btn btn--primary"
                            onClick={() => { setAlumnoOk(true); setConfirmandoNivel(false) }}
                          >
                            Sí, el curso es correcto
                          </button>
                          <button
                            type="button"
                            className="btn btn--secondary"
                            onClick={() => setConfirmandoNivel(false)}
                          >
                            Corregir curso
                          </button>
                        </div>
                      </InfoBox>
                    )}
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

            {/* S22-6 (corrige E6): orden real de procesamiento y naturaleza de la cuota del 15 % */}
            {modoTutorial && (
              <InfoBox icono="🧮" titulo="¿En qué orden se revisan las prioridades?" tipo="neutro" className="tut-box--sm">
                <p>
                  En cada colegio, el sistema asigna los asientos en este orden: 1.º cupos del{' '}
                  <abbr title="Programa de Integración Escolar">PIE</abbr>, 2.º hermanos/as, 3.º reserva
                  del 15 % para estudiantes prioritarios/as, 4.º hijos/as de funcionarios/as y 5.º exalumnos/as.
                </p>
                <p>Ojo: el 15 % <strong>no es un lugar en la fila</strong>. Es un grupo de asientos que cada colegio guarda para estudiantes prioritarios/as.</p>
              </InfoBox>
            )}

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
                      <PrioridadDetalle clave={key} />
                    </div>
                  )
                })}
              </div>
            )}

            {/* S22-5 (corrige E5): desempate aleatorio por colegio, sin "certificado por MINEDUC" */}
            {!hayPrioridad && modoTutorial && (
              <InfoBox tipo="neutro" className="tut-box--sm">
                <p>Si no tienes ninguna condición de prioridad, participarás en el <strong>desempate aleatorio</strong>: cuando hay más postulantes que vacantes, cada colegio realiza su propio sorteo (una lotería independiente por establecimiento) para ordenar a quienes no tienen prioridad.</p>
              </InfoBox>
            )}

            {/* ── Selector visual de colegios ── */}
            <div className="post-picker-wrap" style={{ marginTop: 20 }}>
              <div className="post-picker-header">
                <p className="post-picker-titulo">
                  Elige tus colegios:
                  {/* S22-2 (corrige E2): sin límite de colegios; recomendación oficial de al menos 6 */}
                  <span className="post-picker-count" aria-live="polite">
                    {lista.length} {lista.length === 1 ? 'seleccionado' : 'seleccionados'} · sin límite, se recomiendan al menos 6
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
                  return (
                    <div
                      key={c.id}
                      className={`post-school-card${enLista ? ' post-school-card--added' : ''}`}
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
                          onClick={() => agregar(c.id)}
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
                  {/* S22-9: indicador visible de guardado del borrador */}
                  {borradorGuardado && (
                    <span className="post-draft-badge" role="status">✓ Borrador guardado</span>
                  )}
                  <span className="form-hint" style={{ display: 'block', fontWeight: 400 }}>
                    Arrastra las tarjetas o usa los botones ↑ y ↓ para reordenar. El 1 es el que más quieres.
                  </span>
                </p>
                <ul className="post-order-list" aria-label="Tu lista de colegios en orden de preferencia">
                  {lista.map((id, idx) => {
                    const col = colegiosById[id]
                    if (!col) return null
                    const vac = totalVacantes(col)
                    return (
                      /* S22-8: arrastrar y soltar nativo + botones ↑↓ como alternativa accesible */
                      <li
                        key={id}
                        className={`post-item post-item--draggable${dragIdx === idx ? ' post-item--dragging' : ''}${dragOverIdx === idx && dragIdx !== idx ? ' post-item--dragover' : ''}`}
                        draggable
                        onDragStart={(e) => {
                          setDragIdx(idx)
                          e.dataTransfer.effectAllowed = 'move'
                          e.dataTransfer.setData('text/plain', String(idx))
                        }}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.dataTransfer.dropEffect = 'move'
                          if (dragOverIdx !== idx) setDragOverIdx(idx)
                        }}
                        onDragLeave={() => { if (dragOverIdx === idx) setDragOverIdx(null) }}
                        onDrop={(e) => {
                          e.preventDefault()
                          reordenar(dragIdx, idx)
                          setDragIdx(null)
                          setDragOverIdx(null)
                        }}
                        onDragEnd={() => { setDragIdx(null); setDragOverIdx(null) }}
                      >
                        <span className="post-item__grip" aria-hidden="true">⠿</span>
                        <span className="post-item__num" aria-hidden="true">{idx + 1}</span>
                        <div className="post-item__body">
                          <strong className="post-item__nombre">{col.nombre}</strong>
                          <span className="post-item__meta">{col.comuna} · {vac} vacantes · {col.demanda} demanda</span>
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
                        {/* Mantenimiento correctivo (2026-08-05) sobre S22-11: el mini-análisis
                            vivía dentro de post-item__body y a 375px quedaba en una columna de
                            ~142px (grip + número + botones ↑↓ consumen la mitad de la tarjeta).
                            Como hijo directo del <li> (flex-wrap) ocupa una fila completa. */}
                        {modoTutorial && (
                          <ColegioAnalisis colegio={col} orden={idx + 1} perfil={perfil} nivelAlumno={alumnoNivel} />
                        )}
                      </li>
                    )
                  })}
                </ul>

                {/* S22-2: progreso hacia la recomendación de al menos 6 + refuerzo positivo */}
                {modoTutorial && lista.length >= 2 && lista.length < 6 && (
                  <InfoBox tipo="info" className="tut-box--sm">
                    <p>Tienes {lista.length} colegios. Más opciones = más probabilidades. No hay límite, y el SAE recomienda incluir <strong>al menos 6</strong> si tu hijo/a no tiene matrícula asegurada.</p>
                  </InfoBox>
                )}
                {lista.length >= 6 && (
                  <InfoBox tipo="exito" className="tut-box--sm">
                    <p>🎉 ¡Bien! Tienes {lista.length} opciones: alcanzaste la recomendación oficial de al menos 6. Puedes seguir agregando si quieres.</p>
                  </InfoBox>
                )}

                {/* S22-14: consejo estratégico — ordenar por preferencia real */}
                <InfoBox icono="🧠" titulo="Consejo: ordena por tu preferencia real" tipo="info" className="tut-box--sm">
                  <p>El sistema está hecho para que te convenga poner primero el colegio que <strong>más quieres</strong>. Poner primero uno "más fácil" no mejora tus opciones y puedes perder el que preferías.</p>
                </InfoBox>

                {/* S22-14: aviso de lista corta con todas las opciones de alta demanda */}
                {listaCortaYAlta && (
                  <InfoBox icono="⚠️" titulo="Lista corta y toda de alta demanda" tipo="alerta">
                    <p>
                      Tu lista tiene {lista.length} {lista.length === 1 ? 'opción' : 'opciones'} y todas son de
                      alta demanda. Así podrías quedar sin asignación. Agrega más colegios — idealmente al menos 6 —
                      e incluye alguno de demanda media o baja.
                    </p>
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
                {/* S22-3 (corrige E3): cierre real del Periodo Principal 2027 */}
                <p>Esta es tu postulación final. Una vez que hagas clic en "Confirmar", el sistema registra tu lista. <strong>Podrás modificarla durante el período de postulación</strong> antes de la fecha límite (27 de agosto a las 14:00). Después de esa hora, la lista queda fija.</p>
              </InfoBox>
            )}

            {/* S22-10: edición por sección sin perder estado — identificación */}
            <div className="post-alumno-card post-alumno-card--resumen" aria-label="Estudiante vinculado">
              <span className="post-alumno-card__icono" aria-hidden="true">🎒</span>
              <div className="post-alumno-card__info">
                <strong className="post-alumno-card__nombre">{alumnoNombre}</strong>
                <span className="post-alumno-card__meta">{alumnoNivel} · RUN {alumnoRut}</span>
              </div>
              {!confirmado && (
                <button
                  type="button"
                  className="btn--text-link post-alumno-card__editar"
                  onClick={() => setPaso(1)}
                  aria-label="Editar identificación: volver al paso 1"
                >
                  Editar
                </button>
              )}
            </div>

            <p>
              Prioridad aplicada: <strong>{prioridadLabels[resultado.nivel]}</strong>
              {/* S22-10: edición por sección — prioridades */}
              {!confirmado && (
                <>
                  {' '}
                  <button
                    type="button"
                    className="btn--text-link"
                    onClick={() => setPaso(2)}
                    aria-label="Editar prioridades: volver al paso 2"
                  >
                    Editar
                  </button>
                </>
              )}
            </p>

            {modoTutorial && (
              <InfoBox tipo="neutro" className="tut-box--sm">
                <p>Tu prioridad se aplica a <strong>todos</strong> los colegios de tu lista. No puedes tener distinta prioridad por colegio.</p>
              </InfoBox>
            )}

            {/* S22-10: edición por sección — lista de colegios */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
              <p style={{ fontWeight: 600, margin: 0 }}>Tu lista de colegios:</p>
              {!confirmado && (
                <button
                  type="button"
                  className="btn--text-link"
                  onClick={() => setPaso(2)}
                  aria-label="Editar la lista de colegios: volver al paso 2"
                >
                  Editar lista
                </button>
              )}
            </div>

            <ul className="sim-list post-list" aria-label="Resumen de tu postulación" style={{ marginTop: 8 }}>
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
                {/* S22-4 (corrige E4): rango real de la etapa de Resultados, sin "5 días hábiles" */}
                <p>Los resultados del Periodo Principal se publican en la sección <strong>Mi postulación</strong> entre el <strong>15 y el 21 de octubre de 2026</strong>. En ese mismo rango de fechas podrás aceptar el resultado, aceptar y activar listas de espera, o rechazarlo. Recibirás una notificación en el correo que registraste.</p>
              </InfoBox>
            )}

            {/* S22-15: qué pasa si no queda en ninguna opción — con y sin colegio de origen */}
            <InfoBox icono="🧭" titulo="¿Y si no quedo en ninguna opción?" tipo="neutro">
              <p><strong>Si tu hijo/a ya tiene colegio:</strong> conserva su matrícula actual. Nadie pierde su colegio de origen por postular y no quedar en sus preferencias.</p>
              <p>
                <strong>Si no tiene colegio:</strong> entra automáticamente a listas de espera y puede volver a
                postular en el <strong>Periodo Complementario</strong> (10 al 17 de noviembre de 2026), con los
                colegios que aún tengan vacantes. Si aun así no queda, el Mineduc le ofrece una vacante en un
                colegio gratuito, sin categoría Insuficiente y a menos de 17 km de tu casa.
              </p>
              <p>
                <Link to="/proceso" className="link-inline">Revisa las 5 etapas del proceso paso a paso</Link>.
              </p>
            </InfoBox>

            {!confirmado ? (
              <button type="button" className="btn btn--primary btn--grande" style={{ marginTop: 16 }} onClick={confirmar}>
                Confirmar y enviar postulación
              </button>
            ) : (
              <div className="sim-result" role="status" aria-live="polite">
                <h3>✅ Postulación enviada</h3>
                <p>Número de comprobante: <strong>{confirmado.comprobante}</strong></p>

                {/* S22-7: la postulación es válida al descargar el comprobante */}
                {!comprobanteDescargado ? (
                  <InfoBox icono="📄" titulo="Falta un paso: descarga tu comprobante" tipo="alerta">
                    <p>Tu postulación es válida cuando descargas el comprobante. Es tu respaldo con el folio, tu lista y las próximas fechas.</p>
                  </InfoBox>
                ) : (
                  <InfoBox icono="✅" titulo="Comprobante descargado" tipo="exito">
                    <p>Listo. Tu postulación quedó registrada y tienes tu respaldo guardado.</p>
                  </InfoBox>
                )}
                <button
                  type="button"
                  className="btn btn--primary"
                  style={{ marginTop: 10 }}
                  onClick={descargarComprobante}
                >
                  ⬇ Descargar comprobante (.txt)
                </button>

                <p style={{ marginTop: 10 }}>Los resultados estarán disponibles en <strong>Mi postulación</strong> entre el 15 y el 21 de octubre de 2026.</p>
                {modoTutorial && (
                  <InfoBox icono="💾" titulo="¿Qué hacer ahora?" tipo="exito">
                    {/* S22-3 (corrige E3): fecha y hora reales de cierre */}
                    <p>Descarga y guarda tu comprobante (folio <strong>{confirmado.comprobante}</strong>). Si quieres cambiar algo, vuelve antes del 27 de agosto a las 14:00 — puedes modificar tu lista todas las veces que necesites hasta esa hora.</p>
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
