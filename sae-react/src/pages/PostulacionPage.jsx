// PostulacionPage — flujo de postulación en 3 pasos
// S22: rediseño de fidelidad y flujo según docs/investigacion/analisis_flujo_postulacion.md (2026-08-04)
// Fechas y reglas: investigacion_paso_a_paso_sae.md (§2.1 y §3) — calendario oficial Admisión 2027
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { colegios, colegiosById, totalVacantes } from '../data/colegios'
import { calcularResultado, etiquetaPrioridad, probabilidadCupo, probPorcentaje, tramoFamiliaEnColegio, nivelPrioridadEnColegio, PRIORIDADES_POR_COLEGIO } from '../utils/asignacion'
import { formatearRut, rutValido } from '../utils/rut'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'
import { useModoEstudio } from '../context/ModoEstudioContext'

const STORAGE_KEY = 'sae_react_postulacion'
// Nota (2026-09-06): la lista de colegios ya NO se persiste ni se restaura entre
// visitas. Cada vez que se entra a /postulacion se arma desde cero (decisión de
// diseño para la prueba comparativa de lista fija). Antes existía
// `sae_react_postulacion_draft_list` (borrador reanudable, S22-9) — se retiró.
// S4 (refinamiento — arquitectura de información): /perfil es la fuente única de
// los datos del estudiante. Aquí se LEE como base (precarga de nombre/RUT/nivel y
// la condición SEP como información de solo lectura). Contrato completo en
// PerfilPage.jsx.
const PERFIL_KEY = 'sae_react_perfil'

/* S4 (refinamiento) — atajo de la prueba de usabilidad: perfil precargado de la
   familia del caso de estudio (docs/investigacion/caso_estudio_prueba_usabilidad_postulacion.md).
   El botón "Cargar caso de ejemplo" del paso 1 escribe esto en PERFIL_KEY para
   que la persona no tenga que tipear los datos del/de la estudiante ni la
   dirección — reduce el tiempo de la sesión sin alterar lo que se testea
   (ordenar la lista, reaccionar a las advertencias, ver el resultado).

   S22-13 (refinamiento, 2026-09-03): la familia Muñoz González NO es prioritaria
   (sin SEP ni PIE). Sus únicas ventajas son los vínculos por colegio (hermano/a
   en Los Andes, funcionario/a en Villa del Sol, exalumno/a en República). Así el
   "colegio en mente" (San Martín: sin vínculo + demanda alta) da 28 % y refleja
   un resultado incierto — que es lo que la prueba necesita observar. El marcador
   `caso` habilita la vista de vínculos por establecimiento en el panel del paso 1. */
const CASO_EJEMPLO = {
  caso: 'munoz-gonzalez',
  nombre: 'Sofía Muñoz González',
  rut: '25.123.456-7',
  nivel: '4° básico',
  prioritario: false,
  pie: false,
  region: 'RM',
  comuna: 'La Florida',
  calle: 'Av. Los Aromos 123',
  /* 2026-09-22 (feedback profesora guía): el paso 1 parte mostrando el GRUPO
     FAMILIAR que trae ClaveÚnica, y la familia marca a quiénes postula (ver
     `familia` en el componente). Ordenado de mayor a menor. Reemplaza a los
     antiguos campos hermanoNombre/…/hermanaMatriculada (hermano/a que postula
     y hermana ya matriculada eran dos tarjetas distintas).
     - Martina: hija mayor, ya matriculada en Colegio Los Andes — de ahí sale la
       prioridad "hermano/a" que colegios.js declara en ese colegio.
     - Mateo: caso de estudio §2 (6.º básico → postula a 7.º). Colegio actual
       ficticio, fuera del catálogo.
     - Sofía: la estudiante del caso (3.º básico en Los Quillayes → postula a 4.º,
       caso_estudio §2). Sus datos coinciden con nombre/rut/nivel de arriba.
     NO entra en calcularResultado (solo decide de quién es la lista de la demo). */
  familia: [
    { nombre: 'Martina Muñoz González', rut: '23.987.654-3', nivelActual: '3° medio', nivelPostula: '4° medio', colegioActual: 'Colegio Los Andes' },
    { nombre: 'Mateo Muñoz González', rut: '25.234.567-8', nivelActual: '6° básico', nivelPostula: '7° básico', colegioActual: "Escuela Bernardo O'Higgins" },
    { nombre: 'Sofía Muñoz González', rut: '25.123.456-7', nivelActual: '3° básico', nivelPostula: '4° básico', colegioActual: 'Escuela Básica Los Quillayes' },
  ],
}

/* S22-12 / S4 (refinamiento, 2026-09-06) — modo verificación del paso 1.
   En el SAE real, ClaveÚnica devuelve los datos de identidad y domicilio del/de
   la estudiante ya cargados desde el Estado: la familia los VERIFICA, no los
   tipea. Para un visitante sin datos en /perfil, este identikit ficticio hace de
   "lo que devolvió ClaveÚnica"; se muestra con la aclaración de que en el
   sistema real son los datos propios. Si /perfil tiene datos, esos mandan. */
const IDENTIDAD_CLAVEUNICA_DEMO = {
  nombre: 'Sofía Ríos Contreras',
  rut: '21.457.883-4',
  nivel: '4° básico',
  region: 'RM',
  comuna: 'La Florida',
  calle: 'Pasaje Los Copihues 145',
  // 2026-09-22: grupo familiar (mayor → menor), mismo formato que CASO_EJEMPLO.familia.
  // Colegios actuales ficticios salvo Los Andes (de ahí la prioridad "hermano/a").
  familia: [
    { nombre: 'Valentina Ríos Contreras', rut: '24.112.789-0', nivelActual: '2° medio', nivelPostula: '3° medio', colegioActual: 'Colegio Los Andes' },
    { nombre: 'Tomás Ríos Contreras', rut: '22.984.116-5', nivelActual: '6° básico', nivelPostula: '7° básico', colegioActual: 'Escuela Básica Los Aromos' },
    { nombre: 'Sofía Ríos Contreras', rut: '21.457.883-4', nivelActual: '3° básico', nivelPostula: '4° básico', colegioActual: 'Escuela Básica Villa Los Pinos' },
  ],
}

/* 2026-09-22: grupo familiar que "devuelve ClaveÚnica". Si /perfil tiene datos
   del/de la estudiante, esos mandan para el/la hijo/a menor (el/la de la demo). */
function familiaDesdeClaveUnica(base, perfil) {
  const familia = base.map((m) => ({ ...m }))
  const menor = familia[familia.length - 1]
  if (menor && perfil?.nombre) {
    menor.nombre = perfil.nombre
    if (perfil.rut) menor.rut = perfil.rut
    if (perfil.nivel) menor.nivelPostula = perfil.nivel
  }
  return familia
}

/* Folio simulado del comprobante (S22-7). Fuera del componente: la regla
   react-hooks/purity no admite Math.random en el cuerpo del componente. */
const generarFolio = () => `SAE-${Math.floor(100000 + Math.random() * 900000)}`

/* Primer nombre, para textos cortos ("Martina sigue en…"). */
const primerNombre = (nombre) => (nombre || '').trim().split(/\s+/)[0] || nombre

/* Une nombres en español: "A", "A y B", "A, B y C". */
function unirNombres(nombres) {
  if (nombres.length <= 1) return nombres[0] ?? ''
  return `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`
}

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
      // PIE vigente — dato a nivel de estudiante que el Estado ya conoce. En este
      // prototipo es SOLO informativo: no lo procesa asignacion.js (ver §5 y §9
      // de caso_estudio_prueba_usabilidad_postulacion.md, gap de cálculo abierto).
      pie: !!(p.pie ?? p.condiciones?.pie),
      caso: typeof p.caso === 'string' ? p.caso : '',
    }
  } catch {
    return { nombre: '', rut: '', nivel: '', prioritario: false, pie: false, caso: '' }
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

/* B · fidelidad (analisis_video_paso_a_paso_sae.md brecha B) · S22-1 (refinamiento):
   sugerencias de comuna para el campo de dirección de residencia. Se usa
   <input> + <datalist> y NO un <select>: el catálogo de comunas depende de la
   región y mantener las 346 comunas del país (con sus tildes) es frágil y
   propenso a errores; el datalist sugiere sin restringir la escritura.
   Semilla: comunas presentes en colegios.js + comunas frecuentes de la Región
   Metropolitana y de Valparaíso. */
const COMUNAS_SUGERIDAS = [
  ...colegios.map((c) => c.comuna),
  'Santiago', 'Providencia', 'Ñuñoa', 'Las Condes', 'La Reina', 'Macul',
  'San Joaquín', 'San Miguel', 'Estación Central', 'Recoleta', 'Independencia',
  'Quilicura', 'Pudahuel', 'Cerrillos', 'El Bosque', 'La Cisterna', 'San Bernardo',
  'Lo Prado', 'Cerro Navia', 'Renca', 'Conchalí', 'Huechuraba', 'Vitacura',
  'Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón',
].filter((v, i, a) => a.indexOf(v) === i)

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

/* S4 (refinamiento) · transparencia (HAX G1): vínculos por establecimiento que el
   Estado ya conoce por el RUN del/de la estudiante (hermano/a matriculado/a,
   apoderado/a funcionario/a o exalumno/a). En el SAE real llegan resueltos tras
   ClaveÚnica; aquí se leen del catálogo (colegios.js `casoPrioridades`, la misma
   semilla que usa el paso 2). Es solo lo que se MUESTRA en el panel de
   "condiciones detectadas": la declaración efectiva sigue ocurriendo al agregar
   cada colegio. Se muestra únicamente con el caso de ejemplo cargado. */
const VINCULOS_DETECTADOS = colegios.flatMap((c) =>
  (c.casoPrioridades ?? [])
    .filter((k) => PRIORIDADES_POR_COLEGIO.includes(k))
    .map((k) => ({ colegio: c.nombre, clave: k, info: PRIORIDADES_INFO[k] })),
)

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

/* ── Panel de "condiciones detectadas" (paso 1, tras ClaveÚnica) ──
   S4 (refinamiento) · transparencia (HAX G1, investigacion_ux_guide_ai_systems.md §2):
   apenas la persona ingresa, el sistema le muestra lo que YA sabe del/de la
   estudiante en vez de pedírselo. Es de solo lectura: la condición SEP y el PIE
   los determina el Estado (aquí se configuran en /perfil solo para la
   simulación); los vínculos por establecimiento se confirman al agregar cada
   colegio en el paso 2. El PIE se muestra como información y NO cambia el
   porcentaje estimado (asignacion.js intacto). */
function CondicionesDetectadas({ nombre, prioritario, pie, mostrarVinculos }) {
  const sinNada = !prioritario && !pie && !mostrarVinculos
  return (
    <InfoBox icono="🔎" titulo={`Lo que el sistema ya sabe de ${nombre ? primerNombre(nombre) : 'tu hijo/a'}`} tipo="info">
      <p>
        Condiciones ya registradas en el Estado con tu <strong>ClaveÚnica</strong> — no
        hace falta declararlas de nuevo.
      </p>
      <ul className="cond-detectadas">
        {prioritario && (
          <li>
            <strong>🏫 Estudiante prioritario/a (SEP).</strong> La determina el MINEDUC con el{' '}
            <abbr title="Registro Social de Hogares">Registro Social de Hogares</abbr>. Vale en{' '}
            <strong>todos</strong> los colegios de tu lista: cada uno reserva el 15 % de sus cupos.
          </li>
        )}
        {pie && (
          <li>
            <strong>♿ Programa de Integración Escolar (<abbr title="Programa de Integración Escolar">PIE</abbr>) vigente.</strong>{' '}
            Da prioridad en los colegios que tengan programa PIE.{' '}
            <em>En este prototipo se muestra como información: todavía no se refleja en el porcentaje estimado.</em>
          </li>
        )}
        {mostrarVinculos && VINCULOS_DETECTADOS.map(({ colegio, clave, info }) => (
          <li key={colegio + clave}>
            <strong>{info.icono} {info.label}</strong> en <strong>{colegio}</strong>.{' '}
            Se confirma cuando agregas ese colegio a tu lista (paso 2).
          </li>
        ))}
        {sinNada && (
          <li>
            No hay condiciones de prioridad registradas para este/a estudiante. Podrás
            declarar un vínculo con cada colegio en el paso 2.
          </li>
        )}
      </ul>
      <p style={{ marginBottom: 0 }}>
        ¿Algo no calza? <Link to="/perfil" className="link-inline">Revísalo en Mis datos</Link>
        {' '}(ahí se configura para esta simulación).
      </p>
    </InfoBox>
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

/* ── C · fidelidad (analisis_video_paso_a_paso_sae.md brecha C) · S22-2 (refinamiento) ──
   2026-09-13 (feedback: "todos los colegios eran lo mismo"): esta confirmación
   vivía en el "+ Agregar" y se repetía una vez POR CADA colegio agregado — con
   los 6 colegios del catálogo mostrando la misma jornada, era la misma
   pregunta seis veces sin variación real de contenido. Se mueve de "agregar un
   colegio" a "confirmar y enviar la postulación": una sola vez, para toda la
   lista completa, justo antes del envío final (paso 3).
   2026-09-14 (mismo feedback, segundo ajuste): las dos casillas (que exigían
   marcar para habilitar el botón) pasan a ser texto informativo — "aceptas
   que" — sin acción que marcar; el botón pasa de "Sí, confirmar y enviar" a
   "Siguiente" para no repetir la palabra "confirmar" tres veces en la misma
   pantalla (el título del modal, este botón y el botón de más abajo que lo
   abre). Mismo patrón de <dialog>/`.prio-modal` de siempre — accesible, foco
   al botón principal al abrir, ESC y clic-fuera cierran sin enviar. */
function ConfirmarEnvioModal({ lista, colegiosById, onConfirmar, onCancelar }) {
  const contenidoRef = useRef(null)
  const cantidad = lista.filter((id) => colegiosById[id]).length

  useEffect(() => {
    contenidoRef.current?.querySelector('button')?.focus()
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onCancelar()
  }

  return (
    <dialog
      open
      onKeyDown={handleKeyDown}
      onClick={(e) => e.target === e.currentTarget && onCancelar()}
      className="prio-modal"
      aria-labelledby="confirmar-envio-titulo"
    >
      <div className="prio-modal__content" ref={contenidoRef}>
        <div className="prio-modal__header">
          <h2 className="prio-modal__titulo" id="confirmar-envio-titulo">
            Confirma tu postulación
          </h2>
          <button
            type="button"
            className="prio-modal__close"
            onClick={onCancelar}
            aria-label="Cerrar sin enviar"
          >
            ✕
          </button>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: '0.92rem' }}>
          Al enviar, aceptas que se aplican a {cantidad === 1 ? 'tu único colegio' : `los ${cantidad} colegios de tu lista`}:
        </p>
        <ul className="cond-detectadas" style={{ marginBottom: 12 }}>
          <li>La jornada de cada colegio.</li>
          <li>El proyecto educativo y el reglamento interno de cada colegio.</li>
        </ul>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
          <button type="button" className="btn btn--primary btn--grande" onClick={onConfirmar}>
            Siguiente
          </button>
          <button type="button" className="btn btn--secondary" onClick={onCancelar}>
            Revisar de nuevo
          </button>
        </div>
      </div>
    </dialog>
  )
}

/* 2026-09-13 (feedback profesora guía — un solo botón): unifica "vincular
   estudiante" + "avanzar al paso 2" en una sola confirmación final, en vez de
   dos clics separados (el InfoBox de confirmación de nivel + el botón global
   "Siguiente →"). Mismo patrón de modal que AgregarColegioModal. */
function ConfirmarVinculacionModal({
  alumnoNombre,
  alumnoNivel,
  hermanosEnBloque,
  onConfirmar,
  onCancelar,
}) {
  const contenidoRef = useRef(null)

  useEffect(() => {
    contenidoRef.current?.querySelector('button')?.focus()
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onCancelar()
  }

  return (
    <dialog
      open
      onKeyDown={handleKeyDown}
      onClick={(e) => e.target === e.currentTarget && onCancelar()}
      className="prio-modal confirmar-modal"
      aria-labelledby="confirmar-vinculacion-titulo"
    >
      <div className="prio-modal__content confirmar-modal__content" ref={contenidoRef}>
        <button
          type="button"
          className="confirmar-modal__close"
          onClick={onCancelar}
          aria-label="Cerrar sin continuar"
        >
          ✕
        </button>
        <span className="confirmar-modal__icono" aria-hidden="true">🎒</span>
        <h2 className="confirmar-modal__titulo" id="confirmar-vinculacion-titulo">
          ¿Confirmas estos datos?
        </h2>
        <div className="confirmar-modal__alumno">
          <strong>{alumnoNombre}</strong>
          <span className="confirmar-modal__nivel">Postula a {alumnoNivel}</span>
        </div>
        {hermanosEnBloque.length > 0 && (
          <div className="confirmar-modal__hermano">
            <span aria-hidden="true">👨‍👩‍👧‍👦</span>
            <p>
              En bloque con{' '}
              <strong>{unirNombres(hermanosEnBloque.map((h) => `${primerNombre(h.nombre)} (${h.nivelPostula})`))}</strong>.
              {' '}{hermanosEnBloque.length === 1 ? 'Su lista de colegios se hace' : 'Sus listas de colegios se hacen'} aparte.
            </p>
          </div>
        )}
        <div className="confirmar-modal__acciones">
          <button type="button" className="btn btn--primary btn--grande" onClick={onConfirmar}>
            Sí, continuar
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--grande confirmar-modal__btn-secundario"
            onClick={onCancelar}
          >
            Revisar de nuevo
          </button>
        </div>
      </div>
    </dialog>
  )
}

/* ── S22-11 (refinamiento) · S4 (refinamiento): prioridad POR COLEGIO ──
   `hermano`, `funcionario` y `exalumno` solo valen en el establecimiento donde
   la familia tiene ese vínculo. `prioritario` (SEP, 15 %) NO aparece: viene de
   /perfil y se muestra en el paso 1.

   S4 (refinamiento, 2026-09-02) — "el sistema lo detecta, no lo pregunta":
   - `hermano/a` lo VERIFICA el sistema por RUN contra el registro de matrícula →
     se muestra siempre de solo lectura (detectado / no detectado).
   - `funcionario/a` y `exalumno/a` los DECLARA la familia y los valida el colegio
     → chips editables… salvo con el caso de ejemplo cargado (`soloDeteccion`),
     donde `casoPrioridades` ya trae la respuesta de los 6 colegios y todo se
     muestra de solo lectura, con un `<details>` de corrección por si algo no calza.
   La fuente de la "detección" es `colegio.casoPrioridades`, sembrada en `valores`
   al agregar el colegio (`agregar()`). No cambia `asignacion.js`. */
const PRIO_PROVENIENCIA = {
  hermano: 'verificado con el registro de matrícula',
  funcionario: 'declarado; lo valida el colegio',
  exalumno: 'declarado; lo valida el colegio',
}

function chipAyuda(clave, onAyuda) {
  return (
    <button
      type="button"
      className="chip-help-btn"
      onClick={() => onAyuda(clave)}
      aria-label={`Saber más sobre ${PRIORIDADES_INFO[clave].label}`}
      title="Clic para más información"
    >
      ?
    </button>
  )
}

function filaDetectada(clave, valores, onAyuda) {
  const info = PRIORIDADES_INFO[clave]
  const on = !!valores[clave]
  return (
    <li key={clave} className={`post-prio-det ${on ? 'post-prio-det--on' : 'post-prio-det--off'}`}>
      <span aria-hidden="true">{on ? '✓ ' : '— '}</span>
      {info.icono} <strong>{info.label}</strong>
      {on ? ` — ${PRIO_PROVENIENCIA[clave]}` : ' — no detectado'}
      {' '}{chipAyuda(clave, onAyuda)}
    </li>
  )
}

function chipEditable(clave, colegioId, valores, onToggle, onAyuda) {
  const info = PRIORIDADES_INFO[clave]
  const on = !!valores[clave]
  return (
    <Fragment key={clave}>
      <button
        type="button"
        className={`chip-btn ${on ? 'chip-btn--on' : ''}`}
        aria-pressed={on}
        onClick={() => onToggle(colegioId, clave)}
      >
        {info.icono} {info.label}
      </button>
      {chipAyuda(clave, onAyuda)}
    </Fragment>
  )
}

/* 2026-09-14 (feedback: reducir texto): antes este control tenía DOS diseños
   distintos según `soloDeteccion` — uno mostraba las prioridades ya resueltas
   con un "¿Algo no calza? Corregir" escondido, el otro mostraba siempre la
   fila de hermano/a + una oración invitando a declarar funcionario/a o
   exalumno/a con sus chips abiertos. Se unifican en un solo diseño simple: un
   texto breve con la prioridad (o su ausencia) y un botón mini "Editar" que
   revela las opciones — por si el sistema se equivocó o falta declarar un
   vínculo. hermano/a sigue siendo de solo lectura (lo verifica el sistema); el
   "Editar" solo declara/corrige funcionario/a y exalumno/a. */
function PrioridadColegioControl({ colegio, claves, valores, onToggle, onAyuda, tieneSEP }) {
  if (!claves.length) return null

  const activas = claves.filter((k) => valores[k])
  const declarables = claves.filter((k) => k !== 'hermano') // funcionario/a, exalumno/a

  return (
    <div className="post-prio-colegio">
      <p className="post-prio-colegio__titulo">
        Prioridad <strong>en {colegio.nombre}</strong>
      </p>

      {activas.length > 0 ? (
        <ul className="post-prio-colegio__detectadas">
          {activas.map((k) => filaDetectada(k, valores, onAyuda))}
        </ul>
      ) : (
        <span className="form-hint" style={{ display: 'block' }}>
          Sin vínculo con {colegio.nombre}.{' '}
          {tieneSEP
            ? 'Tu cupo se resuelve por la reserva del 15 % para estudiantes prioritarios/as y, si no, por la demanda y las vacantes.'
            : 'Tu cupo depende de la demanda y las vacantes de este colegio.'}
        </span>
      )}

      <details className="post-prio-colegio__correccion">
        <summary>Editar</summary>
        <div className="chip-row" style={{ margin: '6px 0 0' }}>
          {declarables.map((k) => chipEditable(k, colegio.id, valores, onToggle, onAyuda))}
        </div>
      </details>
    </div>
  )
}

/* ── "¿Qué hace el orden de tu lista?" (ex "Resultado provisional") ──
   S22-13 (refinamiento, 2026-09-03): al reordenar, los porcentajes por colegio NO
   cambian (es lo correcto: el mecanismo es a prueba de estrategia). Lo que sí
   cambia es EN CUÁL COLEGIO quedas asignado, porque el sistema recorre la lista
   en orden y para en el primero donde la familia consigue cupo (recorrido
   determinista con SEED_CASO — ya no hay umbral, Bloque R). Se muestra en vivo en
   el paso 2 y en el paso 3 (HAX G16 — comunicar la consecuencia de la acción del
   usuario). Usa `resultado` (useMemo sobre `lista`), se actualiza al arrastrar.
   ⚠️ Es explicabilidad del prototipo, NO existe en el SAE real → se oculta en la
   condición B del estudio comparativo (F3, `f3_modo_control_inventario.md`). */
/* Bloque Q (refinamiento, 2026-09-06): comunica la CONSECUENCIA del orden de la
   lista (HAX G16) sin lenguaje de "sorteo" / "azar" — el proyecto combate el
   estigma de que el SAE es una "tómbola".

   2026-09-09 (reformulación): de "pronóstico" a "ilustración de la regla".
   - Encabeza con la REGLA (el sistema recorre tu lista en orden; reordenar no
     cambia tus probabilidades por colegio, solo en cuál quedas), no con el
     colegio; el nombre del colegio queda secundario y sin lenguaje de certeza.
   - Se quita "muy probable" y se deja de repetir el %: mostrar un desenlace
     confiado mientras se arma la lista alimenta el sobre-optimismo que Arteaga
     et al. (2022) documentan en las familias del SAE chileno (creencia subjetiva
     ≈76 % vs. objetiva ≈44 %). PAIR-ET: calibrar la confianza, no maximizarla.
   - El descargo ("es una simulación con datos del año pasado, no tu resultado;
     el sistema lo calcula en octubre con las postulaciones reales de este año")
     pasa a estar SIEMPRE visible, ya no solo en modo tutorial (HAX G2 / NN/g:
     los avisos no se esconden tras un modo). BROOK: gestión de expectativas. */
function ResultadoProvisional({ resultado }) {
  const { esControl } = useModoEstudio()
  // F3: es explicabilidad del prototipo, no existe en el SAE real → no va en B.
  if (esControl || resultado.error || !resultado.asignado) return null
  const a = resultado.asignado
  const sinAsignacion = resultado.sinAsignacionEnPreferencias
  const arriba = a.idx === 2 ? 'tu 1.ª opción' : `tus ${a.idx - 1} primeras opciones`
  return (
    <InfoBox
      icono={sinAsignacion ? '⚠️' : '📋'}
      titulo="¿Qué hace el orden de tu lista?"
      tipo={sinAsignacion ? 'alerta' : 'info'}
    >
      <p style={{ marginTop: 0 }}>
        El sistema recorre tu lista <strong>en este orden</strong> y te deja en el primer
        colegio donde consigues cupo. <strong>Cambiar el orden no cambia tus probabilidades
        por colegio</strong> — solo en cuál de tus preferencias podrías quedar. Por eso
        conviene poner primero el que más quieres.
      </p>

      {sinAsignacion ? (
        <p>
          Con los datos del año pasado, este orden <strong>no te llevaría a ningún colegio de
          tu lista</strong>: en todos hay más familias que los piden que vacantes, y tu
          familia no tiene una prioridad en ellos. Conviene agregar colegios con más
          vacantes disponibles para tu nivel.
        </p>
      ) : a.idx === 1 ? (
        <p>
          Con los datos del año pasado, este orden te llevaría a <strong>{a.nombre}</strong>,
          tu primera opción.
        </p>
      ) : (
        <p>
          Con los datos del año pasado, este orden te llevaría a <strong>{a.nombre}</strong>,
          tu preferencia N° {a.idx}. En {arriba} no consigues cupo: son colegios con más
          familias que los piden que vacantes, y no tienes una prioridad ahí que asegure el
          lugar.
        </p>
      )}

      <p style={{ marginBottom: 0 }}>
        <strong>Es una simulación con datos del año pasado, no tu resultado.</strong> El
        sistema lo calcula en octubre y puede ser distinto — muchas familias tienen menos
        posibilidades de las que creían. Por eso conviene incluir varios colegios.{' '}
        <Link to="/algoritmo" className="link-inline">Ver cómo se decide</Link>.
      </p>
    </InfoBox>
  )
}

/* ── % estimado de un colegio, como chip en la fila de "Tu lista" ──
   S22-11 (refinamiento): el % es el DE ESTE COLEGIO.
   2026-09-23 (feedback profesora guía): antes era un bloque gris colapsable
   (`ColegioAnalisis`: "Opción N" + % + barra + demanda/vacantes/prioridad)
   debajo de cada colegio, que ocupaba mucho alto para mostrar poco. El % pasa
   a ser un chip entre el nombre del colegio y los botones; el bloque gris se
   elimina. Lo que mostraba ya está en la fila: número de opción, demanda y
   vacantes (meta), prioridad (PrioridadColegioControl). La barra de frecuencia
   sigue en la ficha del colegio y en el resumen del paso 3. */
function ProbabilidadChip({ colegio, perfilCompleto, nivelAlumno }) {
  const { esControl } = useModoEstudio()
  // F3: el % estimado es explicabilidad → no va en la condición de control.
  if (esControl) return null
  const prob = probPorcentaje(
    probabilidadCupo(colegio, nivelAlumno, tramoFamiliaEnColegio(perfilCompleto, colegio.id)),
  )
  // Bandas calibradas (2026-09-10): verde ≥ 80, ámbar 40–79, rojo < 40.
  const probClass = prob === null ? "media" : prob >= 80 ? "alta" : prob >= 40 ? "media" : "baja"
  return (
    <span
      className={`tut-prob tut-prob--${probClass} post-item__prob`}
      aria-label={prob === null
        ? `${colegio.nombre} aún no publica vacantes para ${nivelAlumno}`
        : `Probabilidad estimada en ${colegio.nombre}: ${prob} de cada 100 postulantes en tu misma condición quedan asignados`}
    >
      {prob === null ? "sin datos" : `${prob}%`}
    </span>
  )
}

/* Formateo y validación de RUT: helper compartido con /perfil (src/utils/rut.js). */

/* S22-12/S4 (refinamiento, 2026-09-13, feedback profesora guía — claridad):
   módulo de verificación reutilizable. Antes solo el/la estudiante principal
   mostraba sus datos como un recap de solo lectura ("verifícalos, no los
   tipeas") con un enlace "corregir"; el bloque del hermano/a, aunque decía
   "Verifica los datos...", mostraba directo los campos editables — mismo
   dato, dos tratamientos distintos. Este componente es EL MISMO para
   ambos: recap de solo lectura primero, "corregir" revela los campos. */
function VerificacionDatosCard({ campos, hint, onCorregir, corregirLabel = 'Algún dato no está bien — corregir' }) {
  return (
    <div className="post-identidad-verif">
      <dl className="post-identidad-verif__lista">
        {campos.map(({ label, valor }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{valor || '—'}</dd>
          </div>
        ))}
      </dl>
      {/* onCorregir es opcional: un registro puramente informativo (p. ej. un
          hermano/a ya matriculado/a, que el sistema conoce por el propio
          registro de matrícula) se muestra sin la acción de editar. */}
      {onCorregir && (
        <button type="button" className="btn--text-link" onClick={onCorregir}>
          {corregirLabel}
        </button>
      )}
      {hint && <p className="form-hint" style={{ margin: '6px 0 0' }}>{hint}</p>}
    </div>
  )
}

/* S22-9: carga perezosa del borrador guardado (sin tope de 8 — corrige E2) */
/* ── Componente principal ── */
export default function PostulacionPage() {
  const { textoGrande } = useTextSize()
  const { esControl } = useModoEstudio() // F3 — condición de control del estudio
  const [paso, setPaso]         = useState(1)
  const [loginOk, setLoginOk]   = useState(false)
  const [region, setRegion]     = useState('')
  const [rut, setRut]           = useState('')
  const [rutTocado, setRutTocado] = useState(false)
  // S4 (refinamiento): datos del estudiante que vienen de /perfil (fuente única).
  // `prioritario` (SEP) NO es editable en el flujo: se muestra como información.
  const [perfilEstudiante, setPerfilEstudiante] = useState(cargarPerfilEstudiante)
  // S22-11 (refinamiento): prioridades específicas de colegio declaradas por la familia.
  // Forma: { [colegioId]: { hermano: bool, funcionario: bool, exalumno: bool } }
  const [prioridadesPorColegio, setPrioridadesPorColegio] = useState({})
  const [anuncioPrioridad, setAnuncioPrioridad] = useState('') // S22-11 (refinamiento): aria-live
  // La lista se arma desde cero en cada visita: no se persiste ni se restaura.
  const [lista, setLista]       = useState([])
  const [confirmado, setConfirmado] = useState(null)
  const [modoTutorial, setModoTutorial] = useState(true)
  const [modalPrioridadAbierto, setModalPrioridadAbierto] = useState(null) // S22: modal de prioridades
  const [mostrarRut, setMostrarRut] = useState(false)
  // S4 (refinamiento): precarga desde /perfil; el usuario puede corregir.
  const [alumnoRut, setAlumnoRut]       = useState(perfilEstudiante.rut)
  const [alumnoNombre, setAlumnoNombre] = useState(perfilEstudiante.nombre)
  const [alumnoNivel, setAlumnoNivel]   = useState(perfilEstudiante.nivel)
  const [alumnoOk, setAlumnoOk]         = useState(false)
  // 2026-09-13 (feedback profesora guía — un solo botón): unifica "vincular
  // estudiante" + "avanzar al paso 2" en un solo popup de confirmación final
  // (antes: InfoBox de nivel + segundo clic en "Siguiente →").
  const [confirmandoVinculacion, setConfirmandoVinculacion] = useState(false)   // S22-12
  // S22-12 / S4 (refinamiento, 2026-09-06): identidad y domicilio se muestran en
  // modo verificación (solo lectura + "corregir"), como los precarga ClaveÚnica
  // en el SAE real. `true` = el usuario abrió el editor.
  const [editandoIdentidad, setEditandoIdentidad] = useState(false)
  // 2026-09-13 (feedback profesora guía — 4º round): ciclo de edición propio
  // para el Domicilio, independiente de `editandoIdentidad` (RUN/nombre/nivel).
  // Antes del Bloque Y6 ya estaban separados; Y6 los había fusionado en un solo
  // "corregir" y la profesora pidió volver a separarlos (sin volver a la
  // posición original, lejos de la card — este bloque queda pegado a ella).
  const [editandoDomicilio, setEditandoDomicilio] = useState(false)
  // A · fidelidad (analisis_video_paso_a_paso_sae.md brecha C): declaración legal
  // obligatoria de ser apoderado/a antes de vincular al estudiante.
  const [declaraApoderado, setDeclaraApoderado] = useState(false)   // S22-12 (refinamiento)
  // B · fidelidad (analisis_video_paso_a_paso_sae.md brecha B) · S22-1 (refinamiento):
  // dirección de residencia del/de la estudiante. El flujo real la pide (región +
  // comuna + calle y número + casa/depto). NO entra en la lógica de asignación
  // (asignacion.js intacto): solo acota la búsqueda. `region` ya existía como
  // filtro de exploración y aquí pasa a ser el campo de región de la dirección.
  const [comuna, setComuna]         = useState('')
  const [dirCalle, setDirCalle]     = useState('')
  const [dirNumero, setDirNumero]   = useState('')
  const [dirTocada, setDirTocada]   = useState({})   // validación en vivo suave (marca al salir del campo)
  const tocarDir = (campo) => setDirTocada((p) => ({ ...p, [campo]: true }))
  const direccionCompleta = !!region && comuna.trim().length > 1 && dirCalle.trim().length > 2
  // 2026-09-13 (feedback): la confirmación de jornada/proyecto educativo se
  // mudó de "agregar un colegio" a "confirmar y enviar" (ver ConfirmarEnvioModal
  // más abajo, junto al botón "Confirmar y enviar postulación" del paso 3).
  const [confirmandoEnvio, setConfirmandoEnvio] = useState(false)
  // Bloque Z (2026-09-13, feedback profesora guía sobre el paso 2): dos vistas
  // separadas en vez de un solo grid con todo mezclado — 'catalogo' (lista de
  // colegios disponibles, formato fila) y 'mia' (lista ordenada de preferencia,
  // con drag-and-drop, prioridad por colegio y botón para quitar). S22 (refinamiento).
  // 2026-09-13 (feedback: la vista de entrada al paso 2 es "Tu lista", que al
  // principio está vacía — no el catálogo). El catálogo se alcanza desde el
  // estado vacío o desde "+ Agregar otro colegio".
  const [vistaColegios, setVistaColegios] = useState('mia')
  // S22-13 (refinamiento, 2026-09-02): datos básicos del hermano/a que se postula
  // en bloque. En el SAE real hay una postulación por cada hijo/a; este prototipo
  // simula una sola, pero captura el nombre/RUN/nivel/colegio actual del hermano/a
  // para que el bloque familiar sea concreto. NO entra en la lógica de asignación.
  // 2026-09-13 (feedback profesora guía — 4º round): se quita el checkbox
  // `postulaHermanos` que activaba este bloque — pasa a ser de SOLO LECTURA
  // (VerificacionDatosCard, igual que el hermano/a ya matriculado/a) y se
  // muestra por la sola presencia del dato: `hayHermanoPostulante` reemplaza
  // al antiguo estado `postulaHermanos` en todo el archivo.
  // 2026-09-22 (feedback profesora guía): "la primera pantalla debe mostrar el
  // grupo familiar, y de allí hay que seleccionar para qué hijos se hace la
  // postulación". Reemplaza los estados hermanoNombre/…/hermanoMatriculado (dos
  // tarjetas de hermano/a distintas) por un solo grupo familiar con casillas.
  // `familia` viene de ClaveÚnica (mayor → menor); `seleccionados` son RUNs.
  // La demo arma UNA lista: la del/de la menor de los/as seleccionados/as —
  // en la postulación en bloque es su lista la que se reordena según el
  // resultado del/de la mayor. Los demás seleccionados/as van "en bloque"; los
  // no seleccionados/as se quedan en su colegio. NO entra en calcularResultado.
  const [familia, setFamilia] = useState([])
  const [seleccionados, setSeleccionados] = useState([])
  const [familiaConfirmada, setFamiliaConfirmada] = useState(false)
  const postulantes = familia.filter((m) => seleccionados.includes(m.rut))
  const postulantePrincipal = postulantes[postulantes.length - 1] ?? null
  const hermanosEnBloque = postulantes.slice(0, -1)
  const quedanEnSuColegio = familia.filter((m) => !seleccionados.includes(m.rut))
  const hayHermanoPostulante = hermanosEnBloque.length > 0
  const toggleSeleccion = (rutHijo) =>
    setSeleccionados((prev) => (prev.includes(rutHijo) ? prev.filter((r) => r !== rutHijo) : [...prev, rutHijo]))
  const confirmarFamilia = () => {
    if (!postulantePrincipal) return
    setAlumnoNombre(postulantePrincipal.nombre)
    setAlumnoRut(postulantePrincipal.rut)
    setAlumnoNivel(postulantePrincipal.nivelPostula)
    setFamiliaConfirmada(true)
  }
  const [anuncioOrden, setAnuncioOrden]         = useState('')      // S22-8
  const [dragIdx, setDragIdx]           = useState(null)            // S22-8
  const [dragOverIdx, setDragOverIdx]   = useState(null)            // S22-8
  const [comprobanteDescargado, setComprobanteDescargado] = useState(false) // S22-7

  /* Mantenimiento correctivo (2026-09-03): el flujo cambia de vista sin cambiar de
     ruta (los 3 pasos comparten /postulacion), así que ScrollToTop.jsx —que se
     dispara por cambio de pathname— no aplica. Al avanzar/retroceder de paso,
     vincular al estudiante o confirmar la postulación, la vista quedaba a mitad
     de página. Se restaura el scroll al tope en esas transiciones. */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [paso, alumnoOk, confirmado])

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
    () => calcularResultado(lista, perfilCompleto, alumnoNivel),
    [lista, perfilCompleto, alumnoNivel],
  )

  // S4 (refinamiento): hermano/funcionario/exalumno se declaran SIEMPRE por colegio
  // (ya no hay chips globales que los activen).
  const clavesEspecificas = PRIORIDADES_POR_COLEGIO

  /* S4 (refinamiento, 2026-09-02): con el caso de ejemplo cargado, el sistema ya
     resolvió los vínculos de los 6 colegios (`casoPrioridades`) → el paso 2
     muestra las prioridades por colegio de SOLO LECTURA ("el sistema lo detecta,
     no lo pregunta"), y los textos de introducción cambian en consecuencia. */
  const prioridadDetectada = perfilEstudiante.caso === 'munoz-gonzalez'

  /* S22-11 (refinamiento): alterna una prioridad específica en un colegio concreto */
  const togglePrioridadColegio = (colegioId, clave) => {
    setPrioridadesPorColegio((mapa) => {
      const entrada = { ...(mapa[colegioId] ?? {}) }
      const nuevoValor = !entrada[clave]
      if (nuevoValor) entrada[clave] = true
      else delete entrada[clave]
      return { ...mapa, [colegioId]: entrada }
    })
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
    const col = colegiosById[movido]
    setAnuncioOrden(`${col ? col.nombre : 'Colegio'} ahora es tu opción número ${hasta + 1} de ${copia.length}.`)
  }

  const mover = (idx, delta) => reordenar(idx, idx + delta)

  const agregar = (id) => {
    setLista((prev) => (prev.includes(id) ? prev : [...prev, id]))
    // S22-11 (refinamiento) · S4 (refinamiento): pre-marca las prioridades específicas
    // que la familia del caso de estudio tiene en este colegio (colegios.js
    // `casoPrioridades`). Ya no depende de chips globales: se siembra directo al
    // agregar el colegio. La familia puede desmarcarlas si no le aplican.
    const col = colegiosById[id]
    // 2026-09-22: la prioridad "hermano/a" solo vale si OTRO/A integrante del
    // grupo familiar estudia hoy en ese colegio (p. ej., si la demo postula a la
    // propia Martina, Los Andes no le da prioridad de hermana consigo misma).
    const hayHermanoAhi = familia.some(
      (m) => m.rut !== postulantePrincipal?.rut && m.colegioActual === col?.nombre,
    )
    if (col?.casoPrioridades?.length) {
      setPrioridadesPorColegio((mapa) => {
        const entrada = { ...(mapa[id] ?? {}) }
        let cambio = false
        col.casoPrioridades.forEach((k) => {
          if (k === 'hermano' && familia.length > 0 && !hayHermanoAhi) return
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

  /* S4 (refinamiento) — atajo para la prueba de usabilidad: precarga el perfil de
     la familia del caso de estudio (nombre/RUN/nivel + dirección) y simula el
     ingreso con ClaveÚnica. Deja intactos los pasos con valor de fidelidad
     (declarar apoderado/a, confirmar el nivel, agregar los colegios con sus dos
     aceptaciones). No toca asignacion.js ni la cifra 87/87. */
  /* S4 (refinamiento, 2026-09-06): "ingresar con ClaveÚnica" trae los datos de
     identidad y domicilio ya cargados. Si /perfil no tenía nada, se usan los del
     identikit demo; el usuario los verifica y puede corregirlos. No pisa datos
     que ya vengan de /perfil ni del caso de ejemplo. */
  const ingresarConClaveUnica = () => {
    setLoginOk(true)
    setRegion((v) => v || IDENTIDAD_CLAVEUNICA_DEMO.region)
    setComuna((v) => v || IDENTIDAD_CLAVEUNICA_DEMO.comuna)
    setDirCalle((v) => v || IDENTIDAD_CLAVEUNICA_DEMO.calle)
    // 2026-09-22: ClaveÚnica trae el grupo familiar; la familia elige a quién
    // postula (pantalla "Tu grupo familiar"). Nadie viene marcado por defecto.
    setFamilia((f) => (f.length ? f : familiaDesdeClaveUnica(IDENTIDAD_CLAVEUNICA_DEMO.familia, perfilEstudiante)))
  }

  /* Reset para la prueba de usabilidad: entre un/a participante y el/la siguiente,
     el perfil (PERFIL_KEY) y la última postulación enviada (STORAGE_KEY) no deben
     arrastrarse. Este botón los borra y recarga a un paso 1 limpio. (La lista de
     colegios ya se arma desde cero en cada visita, no hace falta borrarla.) */
  const limpiarTodo = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(PERFIL_KEY)
    } catch { /* almacenamiento no disponible */ }
    window.location.reload()
  }

  const cargarCasoEjemplo = () => {
    const {
      region: reg, comuna: com, calle,
      familia: familiaCaso,
      ...perfil
    } = CASO_EJEMPLO
    try {
      localStorage.setItem(
        PERFIL_KEY,
        JSON.stringify({
          nombre: perfil.nombre,
          rut: perfil.rut,
          nivel: perfil.nivel,
          prioritario: perfil.prioritario,
          pie: perfil.pie,
          caso: perfil.caso,
        }),
      )
    } catch { /* almacenamiento no disponible: seguimos con el estado en memoria */ }
    setPerfilEstudiante({
      nombre: perfil.nombre,
      rut: perfil.rut,
      nivel: perfil.nivel,
      prioritario: perfil.prioritario,
      pie: perfil.pie,
      caso: perfil.caso,
    })
    setRegion(reg)
    setComuna(com)
    setDirCalle(calle)
    // 2026-09-22: el grupo familiar se carga sin marcar a nadie — elegir a quién
    // se postula es parte de lo que la persona hace en la prueba.
    setFamilia(familiaCaso.map((m) => ({ ...m })))
    setSeleccionados([])
    setFamiliaConfirmada(false)
    setLoginOk(true)
    // La lista arranca vacía en cada visita: las prioridades por colegio se
    // siembran al agregar cada colegio en el paso 2 (ver `agregar`).
  }

  const confirmar = () => {
    const payload = {
      fecha: new Date().toISOString(),
      comprobante: generarFolio(),
      alumno: { nombre: alumnoNombre, run: alumnoRut, nivel: alumnoNivel },
      // S22-13 (refinamiento): datos del hermano/a en postulación de bloque.
      // Aditivo; NO lo usa `calcularResultado` ni `SeguimientoPage`.
      // 2026-09-22: `hermanos` (lista) reemplaza a `hermano` (uno solo).
      hermanos: hermanosEnBloque.map((h) => ({ nombre: h.nombre, run: h.rut, nivel: h.nivelPostula, colegioActual: h.colegioActual })),
      // B · fidelidad (brecha B): dirección de residencia. Se guarda como bloque
      // aparte; NO la usa la lógica de asignación ni SeguimientoPage.
      direccion: {
        region,
        regionLabel: REGIONES.find((r) => r.value === region)?.label ?? '',
        comuna: comuna.trim(),
        calle: dirCalle.trim(),
        numero: dirNumero.trim(),
      },
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
      ...hermanosEnBloque.flatMap((h) => [
        `En bloque con: ${h.nombre} (RUN ${h.rut}) — ${h.nivelPostula}`,
        `  Colegio actual de ${h.nombre}: ${h.colegioActual || '—'}`,
        `  (este comprobante es de ${alumnoNombre}; ${h.nombre} tiene su propia postulación)`,
      ]),
      '',
      // B · fidelidad (brecha B): la dirección va en el comprobante como dato del
      // formulario, no como criterio de asignación.
      '── DIRECCIÓN DE RESIDENCIA ──',
      `Región: ${REGIONES.find((r) => r.value === region)?.label ?? '—'}`,
      `Comuna: ${comuna.trim() || '—'}`,
      `Dirección: ${dirCalle.trim() || '—'}${dirNumero.trim() ? ` (${dirNumero.trim()})` : ''}`,
      'La dirección no cambia tus probabilidades ni tu resultado: la cercanía no',
      'es un criterio de prioridad del SAE.',
      '',
      // S22-11 (refinamiento): la "prioridad aplicada" es la del colegio asignado;
      // el detalle por colegio va en la lista de abajo (la prioridad puede cambiar).
      `Prioridad en el colegio asignado: ${etiquetaPrioridad(resultado.nivel)}`,
      '',
      '── LISTA EN ORDEN DE PREFERENCIA ──',
      ...lista.map((id, i) => {
        const c = colegiosById[id]
        const n = nivelPrioridadEnColegio(perfilCompleto, id)
        return `${i + 1}. ${c ? `${c.nombre} — ${c.comuna}` : 'Colegio'} · prioridad: ${etiquetaPrioridad(n)}`
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
        {/* 2026-09-22 (feedback profesora guía): el título pasa de "Postular en
            3 pasos" a "Postulación"; la barra de progreso de abajo ya dice en qué
            paso vas. Se quitó la bajada técnica ("Flujo con ClaveÚnica simulada…"). */}
        <h1>Postulación</h1>
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

      {/* ── Barra de progreso con etiquetas (S20-2) ──
          role="progressbar" + aria-valuenow/min/max/text para que los lectores
          de pantalla anuncien "paso N de 3"; aria-current="step" marca el activo.
          (Auditoría 2026-09-08: el plan 20.2 pedía role="progressbar" y faltaba.) */}
      <nav
        className="stepper"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={paso}
        aria-valuetext={`Paso ${paso} de 3: ${['Identifícate', 'Tus colegios', 'Confirma'][paso - 1]}`}
        aria-label={`Progreso de postulación: paso ${paso} de 3`}
      >
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
              Entra con tu <strong>ClaveÚnica</strong>. Así confirmamos que eres el apoderado o la apoderada.
            </p>
          </CardHeader>
          <CardContent>
            {/* P2 · HAX G1 — S22 (refinamiento): encuadre de qué hace y qué NO hace
                el algoritmo, ANTES de pedir datos (investigacion_ux_guide_ai_systems.md
                §2 "Al inicio"). Resumen de encuadre, no repite el detalle de /algoritmo
                ni /proceso. Siempre visible (no depende del modo tutorial): es
                información básica, no un tip. Relacionado con S22-6 (orden legal de
                prioridades) y S13 (transparencia). */}
            {/* F3: este encuadre del algoritmo antes de pedir datos es capa de
                explicabilidad (P2/HAX G1) → no va en la condición de control. */}
            {/* 2026-09-14 (feedback: reducir texto). Este encuadre es referencia
                genérica (no cambia según el/la estudiante) — mismo patrón de
                divulgación progresiva que ya usa "¿Cómo funcionan las prioridades
                acá?" en el paso 2: colapsado por defecto, contenido intacto. */}
            {!esControl && (
            <details className="post-demo">
              <summary>⚖️ ¿Cómo se decide tu resultado?</summary>
              <p style={{ marginBottom: 8 }}>
                El sistema arma tu asignación con tres cosas: <strong>el orden de tu lista</strong>, las <strong>prioridades que fija la ley</strong> y las <strong>vacantes</strong> de cada colegio.
              </p>
              <p style={{ marginBottom: 4, fontWeight: 600 }}>Las prioridades, en este orden:</p>
              <ul className="cond-detectadas">
                <li>Programa de Integración Escolar (PIE)</li>
                <li>Hermanos/as en el colegio</li>
                <li>Reserva del 15 % para estudiantes prioritarios/as</li>
                <li>Hijos/as de funcionarios/as</li>
                <li>Exalumnos/as</li>
              </ul>
              <p>Cuando hay más postulantes que vacantes, se hace un <strong>sorteo al azar</strong>, distinto en cada colegio.</p>
              <p style={{ marginBottom: 0 }}>
                <strong>No hay puntaje, ni notas, ni ranking por mérito.</strong> Tu familia no compite
                por rendimiento (la única excepción es la modalidad de alta exigencia académica, que
                este prototipo no incluye). Y poner primero el colegio que más quieres
                {' '}<strong>nunca te perjudica</strong>.{' '}
                <Link to="/algoritmo" className="link-inline">Ver cómo funciona en detalle</Link>.
              </p>
            </details>
            )}

            {/* Acción principal: ClaveÚnica */}
            {!loginOk && (
              <div className="post-clave-block">
                <div className="post-clave-icon" aria-hidden="true">🔑</div>
                <div className="post-clave-texto">
                  <strong>Ingresar con ClaveÚnica</strong>
                  <p>Es la clave del Estado. No necesitas crear otra contraseña, y el SAE nunca ve tu clave.</p>
                </div>
                <button
                  type="button"
                  className="btn btn--primary btn--grande"
                  onClick={ingresarConClaveUnica}
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
                        onClick={ingresarConClaveUnica}
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

                {/* S4 (refinamiento) — atajo para la prueba de usabilidad: evita
                    que la persona tenga que tipear los datos del/de la estudiante y
                    la dirección antes de llegar a lo que se testea. Colapsado y
                    rotulado como herramienta de la demo. */}
                <details className="post-demo">
                  <summary>⚙️ Herramientas de la prueba de usabilidad</summary>
                  <p>
                    <strong>Cargar familia Muñoz González:</strong> rellena{' '}
                    <strong>Mis datos</strong> con el perfil del caso y la dirección de
                    residencia, y simula el ingreso con ClaveÚnica, para no tipear en la
                    sesión.
                  </p>
                  <p>
                    <strong>Limpiar y empezar de cero:</strong> borra el perfil guardado y
                    la última postulación enviada de este dispositivo. Úsalo entre un/a
                    participante y el/la siguiente. (La lista de colegios ya parte vacía en
                    cada visita.) Solo para la demo: no toca el SAE real.
                  </p>
                  <div className="post-demo__botones">
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={cargarCasoEjemplo}
                    >
                      Cargar familia Muñoz González
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={limpiarTodo}
                    >
                      🧹 Limpiar y empezar de cero
                    </button>
                  </div>
                </details>
              </div>
            )}

            {/* Estado: ingreso exitoso */}
            {loginOk && !familiaConfirmada && (
              /* 2026-09-22 (feedback profesora guía): primera pantalla tras el
                 ingreso = el grupo familiar. La familia marca para qué hijos/as
                 postula; la explicación de abajo cambia según lo marcado (uno →
                 los demás se quedan donde están; varios → postulación en bloque). */
              <div className="post-familia">
                <p className="small-note post-login-ok" role="status" aria-live="polite">
                  ✅ Ingresaste con ClaveÚnica.
                </p>
                <h3 className="post-alumno-block__titulo">Tu grupo familiar</h3>
                <p className="post-familia__intro">
                  Estos son los hijos e hijas que tienes registrados en el Estado.
                  Marca a quiénes quieres postular este año.
                </p>

                <fieldset className="post-familia__lista">
                  <legend className="sr-only">Elige a qué hijos o hijas vas a postular</legend>
                  {familia.map((m) => {
                    const marcado = seleccionados.includes(m.rut)
                    return (
                      <label
                        key={m.rut}
                        className={`post-familia__hijo${marcado ? ' post-familia__hijo--marcado' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={marcado}
                          onChange={() => toggleSeleccion(m.rut)}
                        />
                        <span className="post-familia__datos">
                          <span className="post-familia__nombre">{m.nombre}</span>
                          <span>Hoy: {m.nivelActual} en {m.colegioActual}</span>
                          <span>Si postula, entra a <strong>{m.nivelPostula}</strong></span>
                          <span className="post-familia__run">RUN {m.rut}</span>
                        </span>
                      </label>
                    )
                  })}
                </fieldset>

                <div role="status" aria-live="polite">
                  {postulantes.length === 0 && (
                    <p className="post-familia__aviso">Marca al menos a un hijo o hija para continuar.</p>
                  )}

                  {postulantes.length === 1 && (
                    <InfoBox icono="🎒" titulo={`Vas a postular solo a ${primerNombre(postulantePrincipal.nombre)}`} tipo="info">
                      <p style={{ marginTop: 0 }}>
                        Armarás una lista de colegios para {primerNombre(postulantePrincipal.nombre)}.
                      </p>
                      {quedanEnSuColegio.length > 0 && (
                        <ul className="cond-detectadas" style={{ marginBottom: 0 }}>
                          {quedanEnSuColegio.map((m) => (
                            <li key={m.rut}>
                              {primerNombre(m.nombre)} no postula: sigue en {m.colegioActual} y no pierde su matrícula.
                            </li>
                          ))}
                        </ul>
                      )}
                    </InfoBox>
                  )}

                  {postulantes.length > 1 && (
                    <InfoBox icono="👨‍👩‍👧‍👦" titulo="Postulación en bloque" tipo="info">
                      <p style={{ marginTop: 0 }}>
                        Vas a postular a {unirNombres(postulantes.map((m) => primerNombre(m.nombre)))}.
                        {' '}Como es una postulación <strong>en bloque</strong>, el sistema intenta que
                        queden <strong>en el mismo colegio</strong>.
                      </p>
                      <p>
                        Cada uno tiene su propia lista de colegios. El sistema revisa primero a quien es
                        mayor. Si queda en un colegio, ese colegio sube al primer lugar de la lista de
                        quien es menor.
                      </p>
                      {quedanEnSuColegio.length > 0 && (
                        <p>
                          {quedanEnSuColegio.map((m) => `${primerNombre(m.nombre)} no postula: sigue en ${m.colegioActual} y no pierde su matrícula.`).join(' ')}
                        </p>
                      )}
                      <p style={{ marginBottom: 0 }}>
                        En esta prueba solo armarás la lista de{' '}
                        <strong>{primerNombre(postulantePrincipal.nombre)}</strong>.
                      </p>
                    </InfoBox>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn--primary btn--grande"
                  style={{ marginTop: 12 }}
                  disabled={postulantes.length === 0}
                  onClick={confirmarFamilia}
                >
                  Continuar
                </button>
              </div>
            )}

            {loginOk && familiaConfirmada && (
              <div>
                {/* 2026-09-22: resumen del grupo familiar elegido, con vuelta atrás. */}
                <div className="post-familia-resumen">
                  <div className="post-familia-resumen__cabecera">
                    <strong>👨‍👩‍👧‍👦 Tu grupo familiar</strong>
                    <button
                      type="button"
                      className="btn--text-link"
                      onClick={() => { setFamiliaConfirmada(false); setAlumnoOk(false) }}
                    >
                      Cambiar
                    </button>
                  </div>
                  <ul className="post-familia-resumen__lista">
                    {familia.map((m) => {
                      const esPrincipal = m.rut === postulantePrincipal?.rut
                      const enBloque = hermanosEnBloque.some((h) => h.rut === m.rut)
                      return (
                        <li key={m.rut}>
                          <span>{m.nombre}</span>
                          {esPrincipal && <span className="badge badge--info">Postula · esta lista</span>}
                          {enBloque && <span className="badge badge--progress">Postula en bloque · lista aparte</span>}
                          {!esPrincipal && !enBloque && <span className="badge badge--ok">Sigue en {m.colegioActual}</span>}
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* S4 (refinamiento) · transparencia (HAX G1): lo que el sistema
                    ya sabe del/de la estudiante, apenas ingresa y antes de pedirle
                    nada. Ver componente CondicionesDetectadas. */}
                <CondicionesDetectadas
                  nombre={alumnoNombre}
                  prioritario={perfilEstudiante.prioritario}
                  pie={perfilEstudiante.pie}
                  mostrarVinculos={perfilEstudiante.caso === 'munoz-gonzalez'}
                />

                <div className="post-region-block">
                  <label htmlFor="select-region" className="form-label">
                    ¿En qué región vive el/la estudiante?{' '}
                    <span aria-hidden="true" style={{ color: 'var(--rojo)' }}>*</span>
                  </label>
                  {/* S22-1 (corrige E1) · B · fidelidad (analisis_video_paso_a_paso_sae.md brecha B):
                      la región es parte de la dirección de residencia (el resto —comuna,
                      calle y número— se pide abajo, junto a la vinculación). Nunca es una
                      restricción: puedes postular a colegios de otras comunas y regiones. */}
                  <p className="form-hint">
                    Viene de tu domicilio registrado y puedes cambiarla. Sirve para mostrarte primero los colegios cercanos. Igual puedes postular a colegios de cualquier comuna o región.
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
                        <h3 className="post-alumno-block__titulo">Revisa los datos de {primerNombre(alumnoNombre) || 'tu hijo/a'}</h3>
                        <p className="post-alumno-block__sub">
                          Estos datos vienen del Estado. Si alguno está mal, corrígelo antes de seguir.
                        </p>
                      </div>
                    </div>

                    {/* S22-12 / S4 (refinamiento, 2026-09-06): identidad en modo
                        verificación — el SAE real la precarga desde ClaveÚnica y la
                        familia la confirma, no la tipea. "Corregir" abre los campos
                        editables. El nivel mantiene además su confirmación explícita
                        (S22-12, más abajo) y la declaración de apoderado/a sigue siendo un
                        acto activo. 2026-09-13 (feedback profesora guía — 4º round): el
                        Domicilio deja de estar dentro de este "corregir" — recupera su
                        PROPIO botón "Editar" (bloque aparte, justo abajo), independiente
                        de RUN/nombre/nivel. */}
                    {!editandoIdentidad ? (
                      <VerificacionDatosCard
                        campos={[
                          { label: 'Nombre', valor: alumnoNombre },
                          { label: 'RUN', valor: alumnoRut },
                          { label: 'Nivel al que postula', valor: alumnoNivel },
                        ]}
                        onCorregir={() => setEditandoIdentidad(true)}
                        hint="En el sistema real, estos son los datos de tu hijo/a tal como están registrados en el Estado (Registro Civil)."
                      />
                    ) : (
                    <>
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
                        onChange={(e) => { setAlumnoNivel(e.target.value); setConfirmandoVinculacion(false) }}
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
                    <button
                      type="button"
                      className="btn--text-link"
                      style={{ marginTop: 8, alignSelf: 'flex-start' }}
                      onClick={() => setEditandoIdentidad(false)}
                    >
                      Listo, datos verificados
                    </button>
                    </>
                    )}

                    {/* B · fidelidad (analisis_video_paso_a_paso_sae.md brecha B) · S22-1 (refinamiento):
                        dirección de residencia del/de la estudiante, tal como la pide el flujo real
                        (video, Paso 2: región + comuna + calle y número + casa/depto). La dirección NO
                        entra en la lógica de asignación: solo acota la búsqueda de colegios cercanos.
                        2026-09-13 (feedback profesora guía — 4º round): vuelve a tener su PROPIO
                        ciclo recap/"Editar" (`editandoDomicilio`), separado del "corregir" de
                        identidad (Bloque Y6 los había fusionado; la profesora pidió separarlos de
                        nuevo) — pero queda pegado justo debajo de la card de identidad, no lejos
                        como en el diseño original. Reutiliza VerificacionDatosCard con
                        `corregirLabel="Editar"` para que se vea como parte del mismo módulo. */}
                    {!editandoDomicilio ? (
                      <VerificacionDatosCard
                        campos={[
                          { label: 'Domicilio', valor: [dirCalle, dirNumero, comuna].filter((s) => s && s.trim()).join(', ') },
                        ]}
                        onCorregir={() => setEditandoDomicilio(true)}
                        corregirLabel="Editar"
                      />
                    ) : (
                    <>
                    <div className="post-direccion-block">
                      <h4 className="post-alumno-block__titulo" style={{ fontSize: '1rem', margin: '4px 0 8px' }}>
                        Dirección del/de la estudiante
                      </h4>

                      <p className="form-hint" style={{ margin: '0 0 10px' }}>
                        Región: <strong>{REGIONES.find((r) => r.value === region)?.label ?? '—'}</strong>
                        {' '}(la eliges más arriba).
                      </p>

                      <div className="rg-campo">
                        <label className="form-label" htmlFor="dir-comuna">
                          Comuna <span aria-hidden="true" style={{ color: 'var(--rojo)' }}>*</span>
                        </label>
                        <input
                          id="dir-comuna"
                          type="text"
                          className="form-input rg-input"
                          list="dir-comunas-sugeridas"
                          value={comuna}
                          onChange={(e) => setComuna(e.target.value)}
                          onBlur={() => tocarDir('comuna')}
                          placeholder="Ej: La Florida"
                          autoComplete="address-level2"
                          aria-required="true"
                          aria-invalid={dirTocada.comuna && comuna.trim().length <= 1 ? 'true' : undefined}
                        />
                        <datalist id="dir-comunas-sugeridas">
                          {COMUNAS_SUGERIDAS.map((c) => (
                            <option key={c} value={c} />
                          ))}
                        </datalist>
                        {dirTocada.comuna && comuna.trim().length <= 1 && (
                          <span className="form-hint" style={{ color: 'var(--rojo)', display: 'block' }} role="alert">
                            Escribe la comuna donde vive el/la estudiante.
                          </span>
                        )}
                      </div>

                      <div className="rg-campo">
                        <label className="form-label" htmlFor="dir-calle">
                          Dirección (calle y número) <span aria-hidden="true" style={{ color: 'var(--rojo)' }}>*</span>
                        </label>
                        <input
                          id="dir-calle"
                          type="text"
                          className="form-input rg-input"
                          value={dirCalle}
                          onChange={(e) => setDirCalle(e.target.value)}
                          onBlur={() => tocarDir('calle')}
                          placeholder="Ej: Av. Los Aromos 450"
                          autoComplete="address-line1"
                          aria-required="true"
                          aria-invalid={dirTocada.calle && dirCalle.trim().length <= 2 ? 'true' : undefined}
                        />
                        {dirTocada.calle && dirCalle.trim().length <= 2 && (
                          <span className="form-hint" style={{ color: 'var(--rojo)', display: 'block' }} role="alert">
                            Escribe la calle y el número de la casa.
                          </span>
                        )}
                      </div>

                      <div className="rg-campo">
                        <label className="form-label" htmlFor="dir-numero">
                          Número de casa o depto.
                          <span className="form-label__opt"> (opcional)</span>
                        </label>
                        <input
                          id="dir-numero"
                          type="text"
                          className="form-input rg-input"
                          value={dirNumero}
                          onChange={(e) => setDirNumero(e.target.value)}
                          placeholder="Ej: Depto. 32 / Casa B"
                          autoComplete="address-line2"
                        />
                      </div>

                      {/* B · fidelidad: en Aceptación Diferida la cercanía NO prioriza.
                          Se dice explícito para no reforzar el mito del "colegio cercano". */}
                      <p className="form-hint" style={{ margin: '4px 0 0' }}>
                        Tu dirección se usa para ubicar colegios cercanos en la búsqueda. No cambia
                        tus probabilidades ni tu resultado: la cercanía no es un criterio de
                        prioridad del SAE.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn--text-link"
                      style={{ marginTop: 8, alignSelf: 'flex-start' }}
                      onClick={() => setEditandoDomicilio(false)}
                    >
                      Listo, datos verificados
                    </button>
                    </>
                    )}

                    {/* A · fidelidad (analisis_video_paso_a_paso_sae.md brecha A) · S22-12 (refinamiento):
                        en el flujo real, tras ingresar el RUN del postulante, el apoderado/a
                        marca "declaro ser apoderado del postulante" y recién ahí puede agregarlo.
                        Casilla obligatoria: bloquea el botón de vincular mientras no esté marcada. */}
                    <div className="rg-campo">
                      <label className="form-label post-hermanos-check" htmlFor="check-apoderado">
                        <input
                          id="check-apoderado"
                          type="checkbox"
                          checked={declaraApoderado}
                          onChange={(e) => setDeclaraApoderado(e.target.checked)}
                          aria-required="true"
                        />
                        Declaro que soy el apoderado o la apoderada legal de {primerNombre(alumnoNombre) || 'este/a estudiante'}
                      </label>
                      {!declaraApoderado && (
                        <span className="form-hint" style={{ color: 'var(--rojo)', display: 'block' }} role="alert">
                          Debes marcar esta casilla para vincular al estudiante.
                        </span>
                      )}
                    </div>

                    {/* S22-12 (refinamiento, 2026-09-13 — un solo botón): "Vincular
                        estudiante" abre el popup de confirmación final, que además
                        avanza al paso 2 en el mismo clic (ver ConfirmarVinculacionModal). */}
                    <button
                      type="button"
                      className="btn btn--primary"
                      /* B · fidelidad (brecha B): la dirección de residencia (comuna + calle)
                         también es obligatoria para vincular, junto con RUN, nombre, nivel y
                         la declaración de apoderado/a. 2026-09-13 (feedback profesora guía —
                         4º round): el hermano/a que postula ya no es editable aquí (viene
                         precargado de solo lectura), así que deja de ser una condición del
                         botón — no hay nada que el usuario pueda dejar incompleto. */
                      disabled={!rutValido(alumnoRut) || alumnoNombre.trim().length < 3 || !alumnoNivel || !declaraApoderado || !direccionCompleta}
                      title={
                        !declaraApoderado ? 'Primero marca la casilla en que declaras ser el/la apoderado/a legal'
                        : !direccionCompleta ? 'Completa la comuna y la dirección (calle y número) del/de la estudiante'
                        : undefined
                      }
                      onClick={() => setConfirmandoVinculacion(true)}
                    >
                      Vincular estudiante
                    </button>
                    {confirmandoVinculacion && (
                      <ConfirmarVinculacionModal
                        alumnoNombre={alumnoNombre}
                        alumnoNivel={alumnoNivel}
                        hermanosEnBloque={hermanosEnBloque}
                        onConfirmar={() => {
                          setAlumnoOk(true)
                          setConfirmandoVinculacion(false)
                          setPaso(2)
                        }}
                        onCancelar={() => setConfirmandoVinculacion(false)}
                      />
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
                      <span className="post-alumno-card__meta">Vas a hacer <strong>su</strong> postulación (una lista de colegios).</span>
                      {hayHermanoPostulante && (
                        <span className="post-alumno-card__meta">
                          👨‍👩‍👧‍👦 En bloque con {unirNombres(hermanosEnBloque.map((h) => primerNombre(h.nombre)))} — {hermanosEnBloque.length === 1 ? 'su lista va aparte' : 'sus listas van aparte'}.
                        </span>
                      )}
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

                {/* S4 (refinamiento): las condiciones a nivel estudiante (SEP, PIE)
                    y los vínculos por establecimiento se muestran de una vez en el
                    panel "Esto es lo que el sistema ya sabe…" al inicio de este
                    paso (componente CondicionesDetectadas), no se repiten aquí. */}
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
            {/* Bloque Z (2026-09-13, refinamiento S22): dos vistas separadas del
                paso 2 — 'catalogo' (lista de una columna, solo para agregar) y
                'mia' (lista ordenada de preferencia, con drag-and-drop, prioridad
                por colegio y botón para quitar). Antes convivían en un solo grid. */}
            {vistaColegios === 'catalogo' && (
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
                      📌 <strong>El orden importa:</strong> el sistema evalúa primero tu opción N.°1. Ponla siempre el colegio que <em>más quieres</em>, no el que crees que te van a dar. El porcentaje estimado considera la demanda actual, vacantes disponibles y tu condición de prioridad.
                    </p>
                  )}
                  {lista.length > 0 && (
                    <button
                      type="button"
                      className="btn btn--secondary btn--mini"
                      style={{ marginTop: 10 }}
                      onClick={() => setVistaColegios('mia')}
                    >
                      Ver mi lista ({lista.length}) →
                    </button>
                  )}
                </div>

                {/* Lista de colegios disponibles (una columna, ya no grid de tarjetas) */}
                <div
                  className="post-colegio-lista"
                  role="list"
                  aria-label="Colegios disponibles para agregar a tu postulación"
                >
                  {colegios.map((c) => {
                    const enLista = lista.includes(c.id)
                    const orden   = lista.indexOf(c.id) + 1
                    return (
                      <div
                        key={c.id}
                        className={`post-colegio-fila${enLista ? ' post-colegio-fila--agregada' : ''}`}
                        role="listitem"
                      >
                        <div className="post-colegio-fila__info">
                          <strong className="post-colegio-fila__nombre">{c.nombre}</strong>
                          <span className="post-colegio-fila__meta">
                            {c.comuna}
                            <span className={`demand-chip demand-chip--${c.demanda}`} style={{ position: 'static', marginLeft: 6 }}>
                              {c.demanda}
                            </span>
                          </span>
                        </div>
                        {enLista ? (
                          <span className="post-colegio-fila__estado" aria-label={`Ya agregaste ${c.nombre}, opción ${orden}`}>
                            ✓ Ya en tu lista (N.°{orden})
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn btn--primary btn--mini"
                            /* 2026-09-13 (feedback): la confirmación de jornada/proyecto
                               educativo ya no va aquí (ver ConfirmarEnvioModal) — agregar
                               es directo, la aceptación se pide una sola vez al enviar. */
                            onClick={() => { agregar(c.id); setVistaColegios('mia') }}
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
            )}

            {/* ── Vista "Tu lista": orden de preferencia ── */}
            {vistaColegios === 'mia' && lista.length > 0 && (
              <div className="post-order-wrap" style={{ marginTop: 20 }}>
                {/* 2026-09-13 (feedback: no debe estar en ambas vistas — el flujo
                    empieza con la lista vacía, en el catálogo, donde declarar
                    prioridades todavía no aplica a nada). Este bloque explica
                    prioridades "por colegio de tu lista": solo tiene sentido una
                    vez que ya hay al menos un colegio agregado, así que vive
                    únicamente acá, no en la vista de catálogo. */}
                {/* 2026-09-13 (Bloque Z8, carga_de_texto_flujo_postulacion.md §6.4 tarea 5):
                    todo este bloque explicativo de prioridades pasa a <details> colapsado
                    por defecto — divulgación progresiva, mismo patrón que "Herramientas de
                    la prueba de usabilidad" más arriba y que /proceso. */}
                <details className="post-demo">
                  <summary>📋 ¿Cómo funcionan las prioridades acá?</summary>

                  {modoTutorial && (
                    <InfoBox icono="📋" titulo="¿Cómo funciona este paso?" tipo="info">
                      <p>
                        Agrega los colegios que te interesan <strong>en el orden en que los prefieres</strong> (el primero es el que más quieres).{' '}
                        {prioridadDetectada
                          ? <>El sistema ya revisó tus vínculos con cada colegio: en cada tarjeta de tu lista verás la prioridad que detectó ahí.</>
                          : <>En cada colegio de tu lista puedes indicar si tienes un vínculo que te da prioridad ahí.</>}
                      </p>
                    </InfoBox>
                  )}

                  {/* Prioridades — S4 (refinamiento): ya no hay chips globales.
                      hermano/funcionario/exalumno se declaran por colegio, más abajo en
                      cada tarjeta de la lista. La condición SEP no se marca aquí: viene
                      de /perfil y se mostró en el paso 1. */}
                  <p style={{ marginTop: 0, fontWeight: 600, fontSize: '0.95rem' }}>
                    Prioridades que puede tener tu familia en un colegio
                  </p>
                  <span className="form-hint" style={{ marginBottom: 8, display: 'block' }}>
                    Estas son ventajas que da la ley.{' '}
                    {prioridadDetectada
                      ? <>El sistema ya revisó cuáles tienes en cada colegio de tu lista: <strong>hermano/a matriculado/a</strong> lo verifica con el registro de matrícula; <strong>funcionario/a</strong> y <strong>exalumno/a</strong> los valida el colegio.</>
                      : <>Las declaras <strong>colegio por colegio</strong> en tu lista, marcando en cuál tienes el vínculo.</>}
                    {' '}Toca el <strong>?</strong> para saber qué significa cada una.
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
                      {/* S22-6 (refinamiento) · P4 (HAX G6): sin repetir "vulnerabilidad" como rótulo.
                          F3: la aclaración de cómo funciona la cuota es explicabilidad → no en control
                          (la lista legal de arriba sí es fidelidad y se mantiene). */}
                      {!esControl && (
                        <p>Ojo: el 15 % <strong>no es un lugar en la fila</strong>. Es un grupo de asientos que cada colegio reserva para estudiantes prioritarios/as, definidos por la situación socioeconómica que el Estado ya tiene registrada.</p>
                      )}
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
                        {prioridadDetectada
                          ? ' Por eso el sistema los revisa colegio por colegio: en cada tarjeta de tu lista verás cuál detectó ahí.'
                          : ' Por eso, debajo de cada colegio de tu lista te preguntamos si aplica ahí.'}
                      </p>
                    </InfoBox>
                  )}
                </details>

                <p className="post-order-titulo">
                  Tu lista en orden de preferencia:
                  <span className="form-hint" style={{ display: 'block', fontWeight: 600 }}>
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
                        {/* 2026-09-23 (feedback profesora guía): el % estimado va en la
                            misma fila, entre el nombre y los botones (antes: bloque gris
                            aparte, ver ProbabilidadChip). Solo en modo tutorial, como antes. */}
                        {modoTutorial && (
                          <ProbabilidadChip colegio={col} perfilCompleto={perfilCompleto} nivelAlumno={alumnoNivel} />
                        )}
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
                          {/* Bloque Z: quitar ahora vive en la vista "Tu lista", no en el catálogo */}
                          <button
                            type="button"
                            className="post-item__btn post-item__btn--quitar"
                            onClick={() => quitar(col.id)}
                            aria-label={`Quitar ${col.nombre} de tu lista (opción ${idx + 1})`}
                          >
                            ✕ Quitar
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
                          tieneSEP={perfilEstudiante.prioritario}
                        />
                      </li>
                    )
                  })}
                </ul>

                {/* 2026-09-14 (feedback): el botón queda pegado a la lista misma —
                    justo después de verla, antes de sus InfoBox de análisis/avisos y
                    de la advertencia final. */}
                <button
                  type="button"
                  className="btn btn--primary btn--mini"
                  style={{ marginTop: 12, marginBottom: 14 }}
                  onClick={() => setVistaColegios('catalogo')}
                >
                  + Agregar otro colegio
                </button>

                {/* S22-13 (refinamiento): resultado provisional con el orden actual —
                    se actualiza al arrastrar/mover, para que se vea qué hace reordenar */}
                <ResultadoProvisional resultado={resultado} />

                {/* 2026-09-14 (feedback: reducir texto). Antes eran 3 InfoBox separadas
                    (progreso hacia 6, consejo de orden, aviso de lista corta) que podían
                    mostrarse las 3 a la vez diciendo variantes de lo mismo — el consejo de
                    ORDEN además repetía lo que ya dice "¿Qué hace el orden de tu lista?"
                    justo arriba. Una sola caja por estado, sin repetir el consejo de orden. */}
                {listaCortaYAlta ? (
                  /* S22-14 (refinamiento): auditoría P4 (HAX G6) — el riesgo se atribuye a
                     que hay más postulantes que vacantes, no a que la familia "apuntó muy
                     alto"; P3 (NN/g) — cierra con acción concreta. */
                  <InfoBox icono="⚠️" titulo="Tu lista es corta y toda de alta demanda" tipo="alerta">
                    <p>
                      Tienes {lista.length} {lista.length === 1 ? 'colegio' : 'colegios'} y en todos hay más
                      postulantes que vacantes. Agrega más —al menos 6— e incluye alguno de demanda media o baja.
                    </p>
                  </InfoBox>
                ) : lista.length < 6 ? (
                  modoTutorial && (
                    <InfoBox tipo="info" className="tut-box--sm">
                      <p>Tienes {lista.length} {lista.length === 1 ? 'colegio' : 'colegios'}. Más opciones = más probabilidades — el SAE recomienda incluir <strong>al menos 6</strong> si tu hijo/a no tiene matrícula asegurada.</p>
                    </InfoBox>
                  )
                ) : (
                  <InfoBox tipo="exito" className="tut-box--sm">
                    <p>🎉 ¡Bien! Tienes {lista.length}: alcanzaste la recomendación de al menos 6.</p>
                  </InfoBox>
                )}

                {/* D · fidelidad (analisis_video_paso_a_paso_sae.md brecha D) · S22-15 (refinamiento):
                    el costo de postular en sí. Bloque Z (2026-09-13): se mueve al final de la
                    vista "Tu lista" — antes era lo primero que se veía en todo el paso 2. */}
                <InfoBox icono="⚠️" titulo="Postula solo si necesitas cambiar de colegio" tipo="alerta">
                  <p>
                    Postula solo si tu hijo/a necesita un colegio nuevo. Si <strong>queda
                    asignado/a en uno nuevo, pierde de inmediato el cupo en su colegio
                    actual</strong> — aunque después rechaces el resultado; si no queda en ninguna
                    de tus preferencias, mantiene su colegio de hoy.
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    Excepción: si el colegio actual <strong>no sigue el próximo año</strong> con el
                    nivel que le toca (por ejemplo, termina 8° básico y no tiene enseñanza media),
                    sí o sí tienes que postular.
                  </p>
                </InfoBox>
              </div>
            )}

            {/* Edge case (Bloque Z): se navegó a 'mia' sin tener colegios agregados */}
            {vistaColegios === 'mia' && !lista.length && (
              <p className="form-hint" role="status" style={{ marginTop: 8 }}>
                Todavía no agregas ningún colegio.{' '}
                <button
                  type="button"
                  className="btn--text-link"
                  onClick={() => setVistaColegios('catalogo')}
                >
                  Ir al catálogo de colegios →
                </button>
              </p>
            )}

          </CardContent>
        </Card>
      )}

      {/* ══════════════ PASO 3: CONFIRMACIÓN ══════════════ */}
      {/* 2026-09-13 (feedback: la confirmación de envío se sumaba al final de la
          MISMA pantalla de revisión — lista, InfoBoxes de "cuándo sabrás el
          resultado"/"qué pasa si no quedo", etc. seguían visibles arriba, lo
          que se sentía raro/mezclado). Paso 3 ahora es dos pantallas distintas
          según `confirmado`: "revisa y confirma" (todo el resumen editable) o
          "postulación enviada" (solo la confirmación, sin el resumen debajo). */}
      {paso === 3 && (!confirmado ? (
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
                {/* S22-13 (refinamiento): hermano/a en postulación de bloque */}
                {hayHermanoPostulante && (
                  <span className="post-alumno-card__meta">
                    👨‍👩‍👧‍👦 En bloque con <strong>{unirNombres(hermanosEnBloque.map((h) => `${primerNombre(h.nombre)} (${h.nivelPostula})`))}</strong> — {hermanosEnBloque.length === 1 ? 'su lista va aparte' : 'sus listas van aparte'}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn--text-link post-alumno-card__editar"
                onClick={() => setPaso(1)}
                aria-label="Editar identificación: volver al paso 1"
              >
                Editar
              </button>
            </div>

            <p>
              {/* S22-11 (refinamiento) · S4 (refinamiento): la condición SEP viene de
                  /perfil (no se elige aquí); las demás se declararon por colegio. */}
              {perfilEstudiante.prioritario
                ? <>Condición registrada: <strong>estudiante prioritario/a (SEP)</strong> — la determina el MINEDUC y vale en todos tus colegios.{' '}
                    <Link to="/perfil" className="link-inline">Editar en Mis datos</Link>.</>
                : <>Sin condición de estudiante prioritario/a registrada.{' '}
                    <Link to="/perfil" className="link-inline">Editar en Mis datos</Link>.</>}
              {' '}Las prioridades de hermano/a, funcionario/a y exalumno/a se aplican <strong>solo en el colegio</strong> donde las declaraste; abajo verás la de cada uno.
              {' '}
              <button
                type="button"
                className="btn--text-link"
                onClick={() => setPaso(2)}
                aria-label="Editar prioridades por colegio: volver al paso 2"
              >
                Editar por colegio
              </button>
            </p>

            {modoTutorial && (
              <InfoBox tipo="neutro" className="tut-box--sm">
                {/* S22-11 (refinamiento): corrige el texto anterior, que decía que la
                    prioridad era única para toda la lista */}
                {/* F3: la 1.ª parte (dónde vale un vínculo) es fidelidad; "por eso el
                    porcentaje estimado cambia" es explicabilidad → se omite en control. */}
                <p>Algunas prioridades (hermano/a matriculado/a, hijo/a de funcionario/a, exalumno/a) valen <strong>solo en el colegio</strong> donde tienes ese vínculo. La cuota de estudiante prioritario/a (15 %) sí vale en todos.{esControl ? '' : ' Por eso el porcentaje estimado puede cambiar de un colegio a otro.'}</p>
              </InfoBox>
            )}

            {/* S22-13 (refinamiento): mismo resultado provisional que en el paso 2 */}
            <ResultadoProvisional resultado={resultado} />

            {/* S22-10: edición por sección — lista de colegios */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
              <p style={{ fontWeight: 600, margin: 0 }}>Tu lista de colegios:</p>
              <button
                type="button"
                className="btn--text-link"
                onClick={() => setPaso(2)}
                aria-label="Editar la lista de colegios: volver al paso 2"
              >
                Editar lista
              </button>
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
                   - #3: formato de frecuencia ("de cada 100...") en todas las bandas.
                   - #4: categoría cualitativa ("casi segura") para el caso de mayor
                     certeza rastreado por el prototipo (prioridad de hermano/a matriculado/a
                     con probabilidad ≥90%), en vez de solo el porcentaje puntual. PIE y
                     continuidad del colegio de origen no se modelan como checkbox en este
                     prototipo, por lo que no se les aplica esta categoría aquí.
                   Revisión 2026-09-10: se añadió la banda "resultado parejo" (40–59) para
                   no rotular un ~50 % como "probabilidad baja"; el texto usa la demanda
                   real de cada colegio (`d.demanda`) en vez de afirmar "alta demanda"; el
                   consejo de sumar colegios solo aparece en la banda baja. */
                /* Bandas calibradas (2026-09-10): un ~50 % es un resultado PAREJO,
                   no "probabilidad baja" — etiquetarlo de menos induce el mismo mito
                   estratégico que se corrige en el resto del flujo (Arteaga et al. 2022:
                   las familias ya sobre/infra-estiman sus chances). El rojo se reserva
                   para < 40; 40–79 va en ámbar. */
                const probClass = d.prob >= 80 ? 'alta' : d.prob >= 40 ? 'media' : 'baja'
                const colegioD = colegiosById[d.id]
                const vacNivelD = colegioD ? vacantesDeNivel(colegioD, alumnoNivel) : null
                const vacInfoD = vacNivelD
                  ? ` (el año pasado hubo ${vacNivelD.postulantesAnterior} postulantes para ${vacNivelD.min}–${vacNivelD.max} vacantes en ${vacNivelD.label})`
                  : ''
                /* S22-11 (refinamiento): d.nivel es el nivel DE ESTE COLEGIO, no global.
                   La categoría "certeza muy alta" solo aplica si en ESTE colegio la
                   prioridad es hermano/a matriculado/a (d.nivel === 1). */
                const certezaMuyAlta = d.nivel === 1 && d.prob >= 90
                // F3: "te asignarían aquí" y el % son resultado provisional +
                // explicabilidad → no van en la condición de control.
                const esAsignado = !esControl && d.id === resultado.asignado?.id
                return (
                  <li
                    key={d.id}
                    style={{
                      flexDirection: 'column', alignItems: 'flex-start', gap: 4,
                      ...(esAsignado ? { borderLeft: '3px solid var(--verde)', paddingLeft: 10 } : null),
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>
                        <strong>{d.idx}.</strong> {d.nombre}
                        {esAsignado && (
                          <span style={{ color: 'var(--verde)', fontWeight: 700 }}> — te asignarían aquí</span>
                        )}
                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--texto-suave)' }}>
                          {d.demanda} demanda{d.nivel < 5 ? ` · ${d.prioridadLabel}` : ''}
                        </span>
                      </span>
                      {!esControl && (
                        <span className={`tut-prob tut-prob--${probClass}`} aria-label={`Probabilidad estimada: ${d.prob}%`}>
                          {certezaMuyAlta ? 'Muy alta' : `${d.prob}%`}
                        </span>
                      )}
                    </div>
                    {modoTutorial && !esControl && (
                      <p className="tut-prob-explicacion">
                        {certezaMuyAlta
                          ? `🟢 Casi segura. Por tu prioridad de hermano/a matriculado/a, tu asignación en este colegio es casi segura (estimado: ${d.prob} de cada 100 postulantes en tu misma condición quedan asignados).`
                          : d.prob >= 80
                            ? `✅ Probabilidad alta. De cada 100 postulantes en tu misma condición, aproximadamente ${d.prob} quedan asignados en este colegio.`
                            : d.prob >= 60
                              ? `🟡 Más probable que no. De cada 100 postulantes en tu misma condición, aproximadamente ${d.prob} quedan asignados en este colegio: es más probable quedar que no quedar, pero no está asegurado.`
                              : d.prob >= 40
                                ? `⚖️ Resultado parejo. De cada 100 postulantes en tu misma condición, aproximadamente ${d.prob} quedan asignados en este colegio${vacInfoD}: puede pasar o no. En este colegio no tienes un vínculo que te dé prioridad, así que compites por los cupos que quedan. El lugar que ocupe en tu lista no cambia esta cifra.`
                                : `🔴 Probabilidad baja. De cada 100 postulantes en tu misma condición, aproximadamente ${d.prob} quedan asignados en este colegio${vacInfoD}. Aquí no tienes un vínculo que te dé prioridad y hay ${d.demanda} demanda, así que quedan pocos cupos para tu situación. El lugar que ocupe en tu lista no cambia esta cifra; para tener más opciones, suma algún colegio de demanda más baja.`
                        }
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>

            {!esControl && (
              <span className="form-hint" style={{ marginTop: 8, display: 'block' }}>
                Los porcentajes son estimaciones. El resultado real lo entrega el sistema el día de los resultados.
              </span>
            )}

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

            <button
              type="button"
              className="btn btn--primary btn--grande"
              style={{ marginTop: 16 }}
              onClick={() => setConfirmandoEnvio(true)}
            >
              Confirmar y enviar postulación
            </button>
            {confirmandoEnvio && (
              <ConfirmarEnvioModal
                lista={lista}
                colegiosById={colegiosById}
                onConfirmar={() => { confirmar(); setConfirmandoEnvio(false) }}
                onCancelar={() => setConfirmandoEnvio(false)}
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="card--module">
          <CardHeader>
            <CardTitle>✅ Postulación enviada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="sim-result" role="status" aria-live="polite">
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

              {/* E · fidelidad (analisis_video_paso_a_paso_sae.md brecha E) · S22 (refinamiento):
                  en el flujo real, cada modificación durante el período obliga a reenviar la
                  postulación y descargar un comprobante nuevo; el anterior queda obsoleto. Aquí
                  es solo un aviso de texto (siempre visible): NO se invalida el estado ni se
                  rehace el flujo de envío — eso queda para fase 2. */}
              <InfoBox icono="🔁" titulo="Si cambias tu lista después de enviar" tipo="alerta">
                <p style={{ marginBottom: 0 }}>
                  Puedes modificar tu lista todas las veces que quieras hasta el cierre. Pero
                  cada vez que la cambies tienes que <strong>volver a enviar la postulación y
                  descargar un comprobante nuevo</strong>: el comprobante anterior deja de tener
                  validez. Vale siempre el último que descargaste.
                </p>
              </InfoBox>

              {modoTutorial && (
                <InfoBox icono="💾" titulo="¿Qué hacer ahora?" tipo="exito">
                  {/* S22-3 (corrige E3): fecha y hora reales de cierre */}
                  <p>Descarga y guarda tu comprobante (folio <strong>{confirmado.comprobante}</strong>). Si quieres cambiar algo, vuelve antes del 27 de agosto a las 14:00 — puedes modificar tu lista todas las veces que necesites hasta esa hora. Cada cambio te obliga a <strong>reenviar la postulación</strong> y descargar un comprobante nuevo; el anterior ya no vale.</p>
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
          </CardContent>
        </Card>
      ))}

      {/* Navegación entre pasos */}
      <div className="hero__actions" style={{ marginTop: 16 }}>
        {paso > 1 && (
          <button type="button" className="btn btn--secondary btn--dark" onClick={anterior}>← Atrás</button>
        )}
        {/* 2026-09-13 (feedback profesora guía — 4º round): ya no aparece en el
            paso 1. Desde el Bloque Y8, confirmar en el popup de vinculación
            (`ConfirmarVinculacionModal`) avanza directo al paso 2 en el mismo
            clic — este botón global era necesario cuando "vincular" y "avanzar"
            eran dos acciones separadas; ahora sobra y confundía ("¿de nuevo
            siguiente?"). Se mantiene igual para 2 → 3. */}
        {paso === 2 && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={siguiente}
            disabled={!lista.length}
            title={!lista.length ? 'Debes agregar al menos un colegio para continuar' : undefined}
          >
            Siguiente →
          </button>
        )}
      </div>
    </main>
  )
}
