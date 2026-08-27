// PostulacionPage — flujo de postulación en 3 pasos
// S22: rediseño de fidelidad y flujo según docs/investigacion/analisis_flujo_postulacion.md (2026-08-04)
// Fechas y reglas: investigacion_paso_a_paso_sae.md (§2.1 y §3) — calendario oficial Admisión 2027
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { colegios, colegiosById, totalVacantes } from '../data/colegios'
import { calcularResultado, prioridadLabels, probAsignacion, nivelPrioridadEnColegio, PRIORIDADES_POR_COLEGIO } from '../utils/asignacion'
import { formatearRut, rutValido } from '../utils/rut'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TextSizeBar from '../components/TextSizeBar'
import ProbabilidadVisual from '../components/ProbabilidadVisual'
import { useTextSize } from '../context/TextSizeContext'

const STORAGE_KEY = 'sae_react_postulacion'
const DRAFT_LIST_KEY = 'sae_react_postulacion_draft_list'
// S4 (refinamiento — arquitectura de información): /perfil es la fuente única de
// los datos del estudiante. Aquí se LEE como base (precarga de nombre/RUT/nivel y
// la condición SEP como información de solo lectura). Contrato completo en
// PerfilPage.jsx.
const PERFIL_KEY = 'sae_react_perfil'

/* Lee el perfil del estudiante guardado en /perfil. Devuelve siempre un objeto
   con forma estable; tolera perfiles antiguos (`condiciones.prioritario`). */
function cargarPerfilEstudiante() {
  try {
    const raw = localStorage.getItem(PERFIL_KEY)
    const p = raw ? JSON.parse(raw) : {}
    return {
      nombre: typeof p.nombre === 'string' ? p.nombre : '',
      rut: typeof p.rut === 'string' ? p.rut : '',
      nivel: typeof p.nivel === 'string' ? p.nivel : '',
      prioritario: !!(p.prioritario ?? p.condiciones?.prioritario),
    }
  } catch {
    return { nombre: '', rut: '', nivel: '', prioritario: false }
  }
}

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

/* ── Datos de prioridades — chip + modal accesible ──
   S22-6 (corrige E6): títulos y textos según el orden real de procesamiento
   (PIE → hermanos → 15 % prioritarios → funcionario → exalumno); el 15 % es
   una reserva de asientos, no un puesto en una fila.

   OPTIMIZACIÓN (divulgación progresiva): solo label + icono visible en chip;
   al hacer click se abre modal con explicación completa (qué es, qué implica,
   ejemplo, advertencia). Cierre con ESC o clic fuera.

   S22-6 (refinamiento) · auditoría P4 (HAX G5/G6, bitácora sec. 5): los textos
   describen cada prioridad como un derecho que da la ley, sin etiquetar a la
   familia. La cuota SEP se explica por "situación socioeconómica que el Estado
   ya tiene registrada", no repitiendo "vulnerabilidad" como rótulo. */
const PRIORIDADES_INFO = {
  hermano: {
    label: 'Hermano/a matriculado/a',
    icono: '👨‍👩‍👧',
    que_es: 'Tu hijo/a tiene un hermano o hermana actualmente matriculado/a en ese colegio.',
    que_implica: 'Después de los cupos del Programa de Integración Escolar (PIE), el sistema revisa primero a quienes tienen hermanos/as en el colegio.',
    ejemplo: 'Si Daniela quiere postular a su segundo hijo al Colegio Los Andes, donde ya está su hija mayor, tiene un 92% de probabilidad de quedar asignada (en vez del 28% sin esta prioridad).',
    advertencia: 'Solo aplica si el hermano/a seguirá matriculado/a en el mismo colegio al año siguiente.',
  },
  prioritario: {
    label: 'Estudiante prioritario/a',
    icono: '🏫',
    que_es: 'El/la estudiante es prioritario/a según la Ley de Subvención Escolar Preferencial (SEP). El Estado lo determina según la situación socioeconómica de tu familia, con información que el MINEDUC ya tiene. No es algo que decidas tú ni el colegio.',
    que_implica: 'Cada colegio guarda el 15 % de asientos para estudiantes prioritarios/as. No es un puesto en fila: compites por esos asientos reservados además de los generales. El MINEDUC lo identifica automáticamente.',
    ejemplo: 'Los estudiantes SEP tienen entre 88-98% de probabilidad de asignación según la demanda del colegio.',
    advertencia: 'El sistema verifica esto automáticamente. Marcarla sin serlo puede anular tu postulación.',
  },
  funcionario: {
    label: 'Hijo/a de funcionario/a',
    icono: '👔',
    que_es: 'El/la apoderado/a trabaja como funcionario/a (docente, asistente u otro cargo) en el establecimiento al que postulas.',
    que_implica: 'Tienes preferencia sobre postulantes sin prioridad, una vez asignados los cupos PIE, hermanos/as y la reserva del 15 %. El colegio verifica esto con el MINEDUC.',
    ejemplo: 'Si trabajas como profesora en el Colegio Los Andes y postulas a tu hijo/a ahí, tienes un 65% de probabilidad (versus 28% sin prioridad).',
    advertencia: 'Aplica solo en el establecimiento donde trabajas. No sirve para postular a otro colegio.',
  },
  exalumno: {
    label: 'Exalumno/a del establecimiento',
    icono: '🎓',
    que_es: 'El/la apoderado/a es exalumno/a del mismo establecimiento al que postulas.',
    que_implica: 'Es la última condición antes del desempate aleatorio. Tiene impacto solo cuando quedan asientos después de las otras condiciones.',
    ejemplo: 'Si fuiste alumna del Colegio Los Andes y postulas a tu hijo/a ahí, tienes un 60% de probabilidad en colegios de alta demanda.',
    advertencia: 'Algunos establecimientos no aplican esta prioridad. Verifica en la ficha del colegio.',
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

/* ── Modal accesible de una prioridad (HTML <dialog> nativo) ──
   S22: divulgación progresiva — explicación completa en modal (qué es,
   qué implica, ejemplo, advertencia), desencadenado por chip. */
function PrioridadModal({ clave, abierto, onCerrar }) {
  const info = PRIORIDADES_INFO[clave]
  if (!info) return null

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onCerrar()
  }

  return (
    <dialog
      open={abierto}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
      className="prio-modal"
    >
      <div className="prio-modal__content">
        <div className="prio-modal__header">
          <h2 className="prio-modal__titulo">
            <span aria-hidden="true" style={{ marginRight: '8px' }}>{info.icono}</span>
            {info.label}
          </h2>
          <button
            type="button"
            className="prio-modal__close"
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <dl className="prio-modal__dl">
          <dt>¿Qué significa?</dt>
          <dd>{info.que_es}</dd>
          <dt>¿Qué implica?</dt>
          <dd>{info.que_implica}</dd>
          <dt>Ejemplo</dt>
          <dd>{info.ejemplo}</dd>
          <dt>⚠️ Ten en cuenta</dt>
          <dd>{info.advertencia}</dd>
        </dl>
        <button
          type="button"
          className="btn btn--primary"
          style={{ marginTop: '16px', width: '100%' }}
          onClick={onCerrar}
        >
          Entendido
        </button>
      </div>
    </dialog>
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

/* ── S22-11 (refinamiento) · S4 (refinamiento): control para declarar prioridad POR COLEGIO ──
   `hermano`, `funcionario` y `exalumno` solo valen en el establecimiento donde
   la familia tiene ese vínculo, así que se declaran colegio por colegio (no hay
   chips globales que los "activen"). `prioritario` (SEP, 15 %) NO aparece: no se
   elige en el flujo, viene de /perfil y se muestra como información en el paso 1. */
function PrioridadColegioControl({ colegio, claves, valores, onToggle, onAyuda }) {
  if (!claves.length) return null
  return (
    <div className="post-prio-colegio">
      <p className="post-prio-colegio__titulo">
        ¿Tienes alguna de estas prioridades <strong>en {colegio.nombre}</strong>?
      </p>
      <div className="chip-row" style={{ margin: '6px 0 0' }}>
        {claves.map((clave) => {
          const info = PRIORIDADES_INFO[clave]
          const on = !!valores[clave]
          return (
            <Fragment key={clave}>
              <button
                type="button"
                className={`chip-btn ${on ? 'chip-btn--on' : ''}`}
                aria-pressed={on}
                onClick={() => onToggle(colegio.id, clave)}
              >
                {info.icono} {info.label}
              </button>
              <button
                type="button"
                className="chip-help-btn"
                onClick={() => onAyuda(clave)}
                aria-label={`Saber más sobre ${info.label}`}
                title="Clic para más información"
              >
                ?
              </button>
            </Fragment>
          )
        })}
      </div>
      <span className="form-hint" style={{ display: 'block', marginTop: 4 }}>
        Marca solo el colegio donde de verdad tienes ese vínculo. Si no marcas ninguno, en este colegio entras al desempate general (o por tu cuota de estudiante prioritario/a, si la tienes registrada).
      </span>
    </div>
  )
}

/* ── Mini-análisis de un colegio en la lista ──
   S22: divulgación progresiva — solo datos esenciales (demanda, vacantes,
   postulantes, prioridad). Los tips se trasladan al tutorial del paso 2.
   S22-11 (refinamiento): el nivel y el % son los DE ESTE COLEGIO. */
function ColegioAnalisis({ colegio, orden, perfilCompleto, nivelAlumno }) {
  const nivel = nivelPrioridadEnColegio(perfilCompleto, colegio.id)
  const prob  = probAsignacion(nivel, colegio.demanda)
  // S22-11: postulantes del año anterior y vacantes por nivel como fundamento del % estimado
  const vacNivel = vacantesDeNivel(colegio, nivelAlumno)

  const probClass = prob >= 80 ? 'alta' : prob >= 60 ? 'media' : 'baja'

  return (
    <div className="tut-colegio-info">
      <div className="tut-colegio-info__header">
        <span className="tut-colegio-info__orden">Opción {orden}</span>
        <span className={`tut-prob tut-prob--${probClass}`}>{prob}% estimado</span>
      </div>
      <p className="tut-colegio-info__nombre">{colegio.nombre}</p>
      {/* P1 · S22-11 (refinamiento): versión visual del formato de frecuencia
          (RISK-NUM). Variante "barra" por el ancho reducido dentro de .post-item
          a 375px. Acompaña al chip "{prob}% estimado" y a la categoría cualitativa. */}
      <ProbabilidadVisual
        prob={prob}
        variante="barra"
        sentencia={`Probabilidad estimada en ${colegio.nombre}: ${Math.round(prob)} de cada 100 postulantes en tu misma condición quedan asignados.`}
      />
      <ul className="tut-colegio-info__lista">
        <li>
          <span>Demanda:</span>
          <strong>{colegio.demanda}</strong>
        </li>
        {vacNivel ? (
          <>
            <li>
              <span>Vacantes en {vacNivel.label}:</span>
              <strong>{vacNivel.min}–{vacNivel.max}</strong>
            </li>
            <li>
              <span>Postulantes año anterior:</span>
              <strong>{vacNivel.postulantesAnterior}</strong>
            </li>
          </>
        ) : nivelAlumno ? (
          /* S22-11 (refinamiento) · auditoría P3 (NN/g: aviso accionable, no genérico):
             además de avisar la falta del dato, dice de qué se calcula el % y qué hacer. */
          <li style={{ fontSize: '0.9rem', color: 'var(--texto-suave)' }}>
            ℹ️ Este colegio aún no publica vacantes para {nivelAlumno}. El porcentaje se calcula solo con su demanda general. Abre la ficha del colegio para confirmar que ofrece ese nivel antes de dejarlo en tu lista.
          </li>
        ) : null}
        <li>
          <span>Tu prioridad aquí:</span>
          <strong>{prioridadLabels[nivel]}</strong>
        </li>
      </ul>
    </div>
  )
}

/* Formateo y validación de RUT: helper compartido con /perfil (src/utils/rut.js). */

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
  // S4 (refinamiento): datos del estudiante que vienen de /perfil (fuente única).
  // `prioritario` (SEP) NO es editable en el flujo: se muestra como información.
  const [perfilEstudiante] = useState(cargarPerfilEstudiante)
  // S22-11 (refinamiento): prioridades específicas de colegio declaradas por la familia.
  // Forma: { [colegioId]: { hermano: bool, funcionario: bool, exalumno: bool } }
  const [prioridadesPorColegio, setPrioridadesPorColegio] = useState({})
  const [anuncioPrioridad, setAnuncioPrioridad] = useState('') // S22-11 (refinamiento): aria-live
  const [lista, setLista]       = useState(cargarBorradorInicial)
  const [confirmado, setConfirmado] = useState(null)
  const [modoTutorial, setModoTutorial] = useState(true)
  const [modalPrioridadAbierto, setModalPrioridadAbierto] = useState(null) // S22: modal de prioridades
  const [mostrarRut, setMostrarRut] = useState(false)
  // S4 (refinamiento): precarga desde /perfil; el usuario puede corregir.
  const [alumnoRut, setAlumnoRut]       = useState(perfilEstudiante.rut)
  const [alumnoNombre, setAlumnoNombre] = useState(perfilEstudiante.nombre)
  const [alumnoNivel, setAlumnoNivel]   = useState(perfilEstudiante.nivel)
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

  /* S22-11 (refinamiento) · S4 (refinamiento): perfil que se pasa a
     calcularResultado. `prioritario` (SEP, 15 %) es transversal y NO se elige en
     el flujo — viene de /perfil (localStorage PERFIL_KEY) y se muestra como
     información de solo lectura en el paso 1. `hermano`/`funcionario`/`exalumno`
     se resuelven por colegio en asignacion.js a partir de `prioridadesPorColegio`. */
  const perfilCompleto = useMemo(
    () => ({ prioritario: perfilEstudiante.prioritario, prioridadesPorColegio }),
    [perfilEstudiante.prioritario, prioridadesPorColegio],
  )

  const resultado = useMemo(
    () => calcularResultado(lista, perfilCompleto),
    [lista, perfilCompleto],
  )

  // S4 (refinamiento): hermano/funcionario/exalumno se declaran SIEMPRE por colegio
  // (ya no hay chips globales que los activen).
  const clavesEspecificas = PRIORIDADES_POR_COLEGIO

  /* S22-11 (refinamiento): alterna una prioridad específica en un colegio concreto */
  const togglePrioridadColegio = (colegioId, clave) => {
    setPrioridadesPorColegio((mapa) => {
      const entrada = { ...(mapa[colegioId] ?? {}) }
      const nuevoValor = !entrada[clave]
      if (nuevoValor) entrada[clave] = true
      else delete entrada[clave]
      return { ...mapa, [colegioId]: entrada }
    })
    setBorradorGuardado(true) // S22-9
    const col = colegiosById[colegioId]
    const info = PRIORIDADES_INFO[clave]
    setAnuncioPrioridad(
      `${info?.label ?? 'Prioridad'} en ${col?.nombre ?? 'el colegio'}: ${
        prioridadesPorColegio[colegioId]?.[clave] ? 'quitada' : 'agregada'
      }. Actualizamos el porcentaje estimado de ese colegio.`,
    )
  }

  const abrirModalPrioridad = (key) => {
    setModalPrioridadAbierto(key)
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
    // S22-11 (refinamiento) · S4 (refinamiento): pre-marca las prioridades específicas
    // que la familia del caso de estudio tiene en este colegio (colegios.js
    // `casoPrioridades`). Ya no depende de chips globales: se siembra directo al
    // agregar el colegio. La familia puede desmarcarlas si no le aplican.
    const col = colegiosById[id]
    if (col?.casoPrioridades?.length) {
      setPrioridadesPorColegio((mapa) => {
        const entrada = { ...(mapa[id] ?? {}) }
        let cambio = false
        col.casoPrioridades.forEach((k) => {
          if (PRIORIDADES_POR_COLEGIO.includes(k) && !entrada[k]) {
            entrada[k] = true
            cambio = true
          }
        })
        return cambio ? { ...mapa, [id]: entrada } : mapa
      })
    }
  }

  const quitar = (id) => {
    setLista((prev) => prev.filter((item) => item !== id))
    setBorradorGuardado(true) // S22-9
    // S22-11 (refinamiento): al sacar el colegio, se descartan sus prioridades declaradas
    setPrioridadesPorColegio((mapa) => {
      if (!(id in mapa)) return mapa
      const copia = { ...mapa }
      delete copia[id]
      return copia
    })
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
      // S22-11 (refinamiento): se guarda el perfil con las prioridades por colegio
      perfil: perfilCompleto,
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
      // S22-11 (refinamiento): la "prioridad aplicada" es la del colegio asignado;
      // el detalle por colegio va en la lista de abajo (la prioridad puede cambiar).
      `Prioridad en el colegio asignado: ${prioridadLabels[resultado.nivel]}`,
      '',
      '── LISTA EN ORDEN DE PREFERENCIA ──',
      ...lista.map((id, i) => {
        const c = colegiosById[id]
        const n = nivelPrioridadEnColegio(perfilCompleto, id)
        return `${i + 1}. ${c ? `${c.nombre} — ${c.comuna}` : 'Colegio'} · prioridad: ${prioridadLabels[n]}`
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

  // S4 (refinamiento): hay prioridad si el/la estudiante es prioritario/a (viene de
  // /perfil) o si la familia declaró algún vínculo (hermano/funcionario/exalumno)
  // en algún colegio de su lista.
  const hayPrioridad =
    perfilEstudiante.prioritario ||
    Object.values(prioridadesPorColegio).some((e) => e && Object.values(e).some(Boolean))

  // S22-14: aviso de lista corta con todas las opciones de alta demanda
  const listaColegios = lista.map((id) => colegiosById[id]).filter(Boolean)
  const listaCortaYAlta =
    listaColegios.length > 0 && listaColegios.length < 6 && listaColegios.every((c) => c.demanda === 'alta')

  return (
    <main className={`page page--module${textoGrande ? ' page--texto-grande' : ''}`}>
      <TextSizeBar pageName="Postulación" />

      {/* S22-8: anuncio del nuevo orden para lectores de pantalla */}
      <p className="sr-only" role="status" aria-live="polite">{anuncioOrden}</p>
      {/* S22-11 (refinamiento): anuncio del cambio de prioridad por colegio */}
      <p className="sr-only" role="status" aria-live="polite">{anuncioPrioridad}</p>

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
            {/* P2 · HAX G1 — S22 (refinamiento): encuadre de qué hace y qué NO hace
                el algoritmo, ANTES de pedir datos (investigacion_ux_guide_ai_systems.md
                §2 "Al inicio"). Resumen de encuadre, no repite el detalle de /algoritmo
                ni /proceso. Siempre visible (no depende del modo tutorial): es
                información básica, no un tip. Relacionado con S22-6 (orden legal de
                prioridades) y S13 (transparencia). */}
            <InfoBox icono="⚖️" titulo="Antes de empezar: cómo se decide tu resultado" tipo="info">
              <p>
                El sistema arma la asignación con tres cosas: <strong>el orden de tu lista</strong>,
                las <strong>prioridades que fija la ley</strong> (primero el Programa de Integración
                Escolar, después hermanos/as en el colegio, la reserva del 15 % para estudiantes
                prioritarios/as, hijos/as de funcionarios/as y exalumnos/as) y las
                <strong> vacantes</strong> de cada colegio. Cuando hay más postulantes que vacantes,
                se hace un <strong>sorteo al azar, distinto en cada colegio</strong>.
              </p>
              <p style={{ marginBottom: 0 }}>
                <strong>No hay puntaje, ni notas, ni ranking por mérito.</strong> Tu familia no compite
                por rendimiento (la única excepción es la modalidad de alta exigencia académica, que
                este prototipo no incluye). Y poner primero el colegio que más quieres
                {' '}<strong>nunca te perjudica</strong>.{' '}
                <Link to="/algoritmo" className="link-inline">Ver cómo funciona en detalle</Link>.
              </p>
            </InfoBox>

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

                {/* S4 (refinamiento — arquitectura de información): condiciones a nivel
                    estudiante como INFORMACIÓN de solo lectura, no como un control.
                    La condición SEP la determina el MINEDUC (Registro Social de
                    Hogares); en el sistema real llega ya cargada. Se lee de /perfil
                    (PERFIL_KEY). No hay casilla para marcarla aquí a propósito. */}
                {region && alumnoOk && (
                  perfilEstudiante.prioritario ? (
                    <InfoBox icono="🏫" titulo="Condición registrada: Estudiante prioritario/a (SEP)" tipo="info">
                      <p style={{ marginBottom: 0 }}>
                        El MINEDUC ya tiene esta información (la determina con el{' '}
                        <abbr title="Registro Social de Hogares">Registro Social de Hogares</abbr>),
                        así que no necesitas declararla aquí. Se aplicará en{' '}
                        <strong>todos los colegios</strong> de tu lista: cada uno reserva
                        el 15 % de sus cupos para estudiantes prioritarios/as.{' '}
                        <Link to="/perfil" className="link-inline">Editar en Mis datos</Link>.
                      </p>
                    </InfoBox>
                  ) : (
                    <InfoBox icono="ℹ️" titulo="Sin condiciones prioritarias registradas" tipo="neutro">
                      <p style={{ marginBottom: 0 }}>
                        No hay condiciones prioritarias registradas para este/a estudiante.
                        La condición de estudiante prioritario/a (SEP) la determina el
                        MINEDUC; si corresponde, en el sistema real llega ya cargada.{' '}
                        <Link to="/perfil" className="link-inline">Editar en Mis datos</Link>.
                      </p>
                    </InfoBox>
                  )
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
                <p>Agrega los colegios que te interesan <strong>en el orden en que los prefieres</strong> (el primero es el que más quieres). En cada colegio de tu lista puedes indicar si tienes un vínculo que te da prioridad ahí.</p>
              </InfoBox>
            )}

            {/* Prioridades — S4 (refinamiento): ya no hay chips globales.
                hermano/funcionario/exalumno se declaran por colegio, más abajo en
                cada tarjeta de la lista. La condición SEP no se marca aquí: viene
                de /perfil y se mostró en el paso 1. */}
            <p style={{ marginTop: 14, fontWeight: 600, fontSize: '0.95rem' }}>
              Prioridades que puedes tener en un colegio
            </p>
            <span className="form-hint" style={{ marginBottom: 8, display: 'block' }}>
              Estas son ventajas que da la ley. Las declaras <strong>colegio por colegio</strong>
              {' '}en tu lista, marcando en cuál tienes el vínculo. Toca el <strong>?</strong> para saber qué significa cada una.
            </span>

            <div className="chip-row">
              {PRIORIDADES_POR_COLEGIO.map((key) => {
                const info = PRIORIDADES_INFO[key]
                return (
                  <Fragment key={key}>
                    <span className="chip-btn" style={{ cursor: 'default' }}>
                      {info.icono} {info.label}
                    </span>
                    <button
                      type="button"
                      className="chip-help-btn"
                      onClick={() => abrirModalPrioridad(key)}
                      aria-label={`Saber más sobre ${info.label}`}
                      title="Clic para más información"
                    >
                      ?
                    </button>
                    {modalPrioridadAbierto === key && (
                      <PrioridadModal
                        clave={key}
                        abierto={true}
                        onCerrar={() => setModalPrioridadAbierto(null)}
                      />
                    )}
                  </Fragment>
                )
              })}
            </div>

            {/* S4 (refinamiento): la condición SEP no se elige en el flujo */}
            <span className="form-hint" style={{ marginTop: 6, display: 'block' }}>
              🏫 La condición de <abbr title="Ley de Subvención Escolar Preferencial">SEP</abbr> (estudiante prioritario/a){' '}
              {perfilEstudiante.prioritario
                ? <><strong>ya está registrada</strong> para este/a estudiante y vale en todos los colegios (ver paso 1).</>
                : <>no está registrada para este/a estudiante. La determina el MINEDUC; revísala en <Link to="/perfil" className="link-inline">Mis datos</Link>.</>}
            </span>

            {/* S22-6 (corrige E6): orden real de procesamiento y naturaleza de la cuota del 15 % */}
            {modoTutorial && (
              <InfoBox icono="🧮" titulo="¿En qué orden se revisan las prioridades?" tipo="neutro" className="tut-box--sm">
                <p>
                  En cada colegio, el sistema asigna los asientos en este orden: 1.º cupos del{' '}
                  <abbr title="Programa de Integración Escolar">PIE</abbr>, 2.º hermanos/as, 3.º reserva
                  del 15 % para estudiantes de <abbr title="Ley de Subvención Escolar Preferencial">SEP</abbr>, 4.º hijos/as de funcionarios/as, 5.º exalumnos/as.
                </p>
                {/* S22-6 (refinamiento) · P4 (HAX G6): sin repetir "vulnerabilidad" como rótulo */}
                <p>Ojo: el 15 % <strong>no es un lugar en la fila</strong>. Es un grupo de asientos que cada colegio reserva para estudiantes prioritarios/as, definidos por la situación socioeconómica que el Estado ya tiene registrada.</p>
              </InfoBox>
            )}

            {/* S22-5 (corrige E5): desempate aleatorio por colegio, sin "certificado por MINEDUC" */}
            {!hayPrioridad && modoTutorial && (
              <InfoBox tipo="neutro" className="tut-box--sm">
                <p>Si no tienes ninguna condición de prioridad, participarás en el <strong>desempate aleatorio</strong>: cuando hay más postulantes que vacantes, cada colegio realiza su propio sorteo (una lotería independiente por establecimiento) para ordenar a quienes no tienen prioridad.</p>
              </InfoBox>
            )}

            {/* S22-11 (refinamiento) · S4 (refinamiento): hermano/funcionario/exalumno
                valen solo en el colegio donde tienes ese vínculo. La cuota de
                estudiante prioritario/a (SEP) sí es transversal y viene de /perfil. */}
            {modoTutorial && (
              <InfoBox icono="📍" titulo="¿Dónde tienes esa prioridad?" tipo="alerta" className="tut-box--sm">
                <p style={{ marginBottom: 0 }}>
                  Tener un hermano/a matriculado/a, ser hijo/a de funcionario/a o exalumno/a
                  vale <strong>solo en el colegio</strong> donde de verdad tienes ese vínculo — no en todos.
                  Por eso, debajo de cada colegio de tu lista te preguntamos si aplica ahí.
                </p>
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
                  <>
                    <p className="post-picker-hint">
                      📌 <strong>El orden importa:</strong> el sistema evalúa primero tu opción N.°1. Ponla siempre el colegio que <em>más quieres</em>, no el que crees que te van a dar. El porcentaje estimado considera la demanda actual, vacantes disponibles y tu condición de prioridad.
                    </p>
                  </>
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
                        {/* S22-11 (refinamiento): declaración de prioridad específica
                            (hermano/funcionario/exalumno) para ESTE colegio. Funcional
                            (no depende del modo tutorial). Fila completa dentro del <li>. */}
                        <PrioridadColegioControl
                          colegio={col}
                          claves={clavesEspecificas}
                          valores={prioridadesPorColegio[col.id] ?? {}}
                          onToggle={togglePrioridadColegio}
                          onAyuda={abrirModalPrioridad}
                        />
                        {/* Mantenimiento correctivo (2026-08-05) sobre S22-11: el mini-análisis
                            vivía dentro de post-item__body y a 375px quedaba en una columna de
                            ~142px (grip + número + botones ↑↓ consumen la mitad de la tarjeta).
                            Como hijo directo del <li> (flex-wrap) ocupa una fila completa. */}
                        {modoTutorial && (
                          <ColegioAnalisis colegio={col} orden={idx + 1} perfilCompleto={perfilCompleto} nivelAlumno={alumnoNivel} />
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

                {/* S22-14 (refinamiento): aviso de lista corta con todas las opciones de alta demanda.
                    Auditoría P4 (HAX G6): el riesgo se atribuye a que hay más postulantes que
                    vacantes, no a que la familia "haya apuntado muy alto".
                    Auditoría P3 (NN/g): cierra con acción concreta (agregar colegios, incluir
                    demanda media o baja) y no sugiere reordenar por probabilidad. */}
                {listaCortaYAlta && (
                  <InfoBox icono="⚠️" titulo="Tu lista es corta y toda de alta demanda" tipo="alerta">
                    <p>
                      Tienes {lista.length} {lista.length === 1 ? 'colegio' : 'colegios'} y en todos hay más
                      postulantes que vacantes. Si en ninguno queda cupo para tu prioridad, podrías terminar sin
                      asignación. Para bajar ese riesgo, agrega más colegios — al menos 6 — e incluye alguno de
                      demanda media o baja.
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
              {/* S22-11 (refinamiento) · S4 (refinamiento): la condición SEP viene de
                  /perfil (no se elige aquí); las demás se declararon por colegio. */}
              {perfilEstudiante.prioritario
                ? <>Condición registrada: <strong>estudiante prioritario/a (SEP)</strong> — la determina el MINEDUC y vale en todos tus colegios.{' '}
                    {!confirmado && <Link to="/perfil" className="link-inline">Editar en Mis datos</Link>}.</>
                : <>Sin condición de estudiante prioritario/a registrada.{' '}
                    {!confirmado && <Link to="/perfil" className="link-inline">Editar en Mis datos</Link>}.</>}
              {' '}Las prioridades de hermano/a, funcionario/a y exalumno/a se aplican <strong>solo en el colegio</strong> donde las declaraste; abajo verás la de cada uno.
              {/* S22-10: edición por sección — prioridades por colegio */}
              {!confirmado && (
                <>
                  {' '}
                  <button
                    type="button"
                    className="btn--text-link"
                    onClick={() => setPaso(2)}
                    aria-label="Editar prioridades por colegio: volver al paso 2"
                  >
                    Editar por colegio
                  </button>
                </>
              )}
            </p>

            {modoTutorial && (
              <InfoBox tipo="neutro" className="tut-box--sm">
                {/* S22-11 (refinamiento): corrige el texto anterior, que decía que la
                    prioridad era única para toda la lista */}
                <p>Algunas prioridades (hermano/a matriculado/a, hijo/a de funcionario/a, exalumno/a) valen <strong>solo en el colegio</strong> donde tienes ese vínculo. La cuota de estudiante prioritario/a (15 %) sí vale en todos. Por eso el porcentaje estimado puede cambiar de un colegio a otro.</p>
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
                /* S22-14 (refinamiento, investigacion_ux_guide_ai_systems.md §4 y §8):
                   - #1: se retira "considera ponerlo más abajo en tu lista" del texto de
                     probabilidad baja — contradecía el consejo de strategy-proofness del
                     paso 2 y reproducía el mito de riesgo estratégico (caso San Martín).
                   - #2: cada explicación separa el dato que fundamenta el % (demanda,
                     vacantes y postulantes año anterior del esquema v2) de una frase
                     explícita de que el orden en la lista no afecta las chances en los
                     demás colegios (riesgo real vs. falso riesgo estratégico, PAIR §3).
                   - #3: formato de frecuencia ("de cada 100...") extendido a los tres
                     niveles de probabilidad, no solo al alto.
                   - #4: categoría cualitativa ("certeza muy alta") para el caso de mayor
                     certeza rastreado por el prototipo (prioridad de hermano/a matriculado/a
                     con probabilidad ≥90%), en vez de solo el porcentaje puntual. PIE y
                     continuidad del colegio de origen no se modelan como checkbox en este
                     prototipo, por lo que no se les aplica esta categoría aquí. */
                const probClass = d.prob >= 80 ? 'alta' : d.prob >= 60 ? 'media' : 'baja'
                const colegioD = colegiosById[d.id]
                const vacNivelD = colegioD ? vacantesDeNivel(colegioD, alumnoNivel) : null
                /* S22-11 (refinamiento): d.nivel es el nivel DE ESTE COLEGIO, no global.
                   La categoría "certeza muy alta" solo aplica si en ESTE colegio la
                   prioridad es hermano/a matriculado/a (d.nivel === 1). */
                const certezaMuyAlta = d.nivel === 1 && d.prob >= 90
                return (
                  <li key={d.id} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>
                        <strong>{d.idx}.</strong> {d.nombre}
                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--texto-suave)' }}>
                          {d.demanda} demanda{d.nivel < 5 ? ` · ${d.prioridadLabel}` : ''}
                        </span>
                      </span>
                      <span className={`tut-prob tut-prob--${probClass}`} aria-label={`Probabilidad estimada: ${d.prob}%`}>
                        {certezaMuyAlta ? 'Muy alta' : `${d.prob}%`}
                      </span>
                    </div>
                    {modoTutorial && (
                      <p className="tut-prob-explicacion">
                        {certezaMuyAlta
                          ? `🟢 Certeza muy alta. Por tu prioridad de hermano/a matriculado/a, tu asignación en este colegio está prácticamente asegurada (estimado: ${d.prob} de cada 100 postulantes en tu misma condición).`
                          : d.prob >= 80
                            ? `✅ Muy buena probabilidad. De cada 100 postulantes con tu misma condición en este colegio, aproximadamente ${d.prob} quedan asignados.`
                            : d.prob >= 60
                              ? `🟡 Probabilidad moderada. De cada 100 postulantes con tu misma condición, aproximadamente ${d.prob} quedan asignados. Agregar más colegios a tu lista te da más opciones en total.`
                              : `🔴 Probabilidad baja. De cada 100 postulantes con tu misma condición, aproximadamente ${d.prob} quedan asignados en este colegio${vacNivelD ? ` (el año pasado hubo ${vacNivelD.postulantesAnterior} postulantes para ${vacNivelD.min}–${vacNivelD.max} vacantes en ${vacNivelD.label})` : ''}, porque tiene alta demanda para tu nivel de prioridad. Cambiar el orden de este colegio en tu lista no cambia esta cifra ni tus chances en los demás — el sistema siempre evalúa según tu preferencia real. Para tener más opciones, agrega colegios con demanda media o baja.`
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

                <p style={{ marginTop: 10 }}>En el proceso real, los resultados estarán disponibles en <strong>Mi postulación</strong> entre el 15 y el 21 de octubre de 2026.</p>
                {modoTutorial && (
                  <InfoBox icono="💾" titulo="¿Qué hacer ahora?" tipo="exito">
                    {/* S22-3 (corrige E3): fecha y hora reales de cierre */}
                    <p>Descarga y guarda tu comprobante (folio <strong>{confirmado.comprobante}</strong>). Si quieres cambiar algo, vuelve antes del 27 de agosto a las 14:00 — puedes modificar tu lista todas las veces que necesites hasta esa hora.</p>
                  </InfoBox>
                )}

                {/* Extensión fuera de la matriz del plan de mejora (S1-S22): acceso inmediato
                    al resultado, agregado para la prueba de usabilidad por indicación del
                    profesor guía (2026-08-13) — ver docs/investigacion/caso_estudio_prueba_
                    usabilidad_postulacion.md. En el sistema real hay que esperar hasta octubre;
                    aquí se adelanta solo para poder observar la reacción de la familia al
                    resultado dentro de la misma sesión de prueba. Reutiliza el resultado ya
                    calculado (calcularResultado) y la explicación contextualizada que ya
                    construye SeguimientoPage a partir del mismo STORAGE_KEY. */}
                <InfoBox icono="⏩" titulo="Solo para esta prueba: mira tu resultado ahora" tipo="alerta">
                  <p>
                    En la vida real tendrías que esperar hasta octubre. Para esta prueba,
                    adelantamos el resultado para que puedas verlo hoy mismo.
                  </p>
                  <Link
                    className="btn btn--primary btn--grande"
                    to="/seguimiento"
                    style={{ marginTop: 10, display: 'inline-flex' }}
                  >
                    Ver mi resultado ahora →
                  </Link>
                </InfoBox>
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
