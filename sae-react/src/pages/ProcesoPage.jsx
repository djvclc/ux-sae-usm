// S21-a: Vista "El proceso paso a paso" — línea de tiempo de las 5 etapas del SAE
import { useState } from 'react'
import { Link } from 'react-router-dom'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'

// S21-b: estado calculado contra la fecha real del usuario
const HOY = new Date()

function calcEstado(inicio, fin) {
  if (fin < HOY) return 'completada'
  if (inicio <= HOY) return 'activa'
  return 'futura'
}

/* ── Caja de información contextual (local — S13-g, igual que ColegioPage) ── */
function InfoBox({ icono = 'ℹ️', titulo, tipo = 'info', className = '', children }) {
  const tipoClass = { info: 'tut-info', alerta: 'tut-alerta', exito: 'tut-exito', neutro: 'tut-neutro' }
  return (
    <div
      className={`tut-box ${tipoClass[tipo] ?? 'tut-info'} ${className}`}
      role={tipo === 'alerta' ? 'alert' : 'note'}
    >
      {(icono || titulo) && (
        <div className="tut-box__head">
          {icono && <span className="tut-box__icon" aria-hidden="true">{icono}</span>}
          {titulo && <strong className="tut-box__titulo">{titulo}</strong>}
        </div>
      )}
      <div className="tut-box__body">{children}</div>
    </div>
  )
}

/* S21-e: 5 reglas de alto riesgo — siempre visibles, no colapsadas */
const REGLAS_ALTO_RIESGO = [
  {
    id: 'omision',
    icono: '⏰',
    titulo: 'Aceptado por omisión',
    desc: 'Si no ingresas durante la etapa de Resultados, tu asignación se acepta automáticamente. Es una medida para garantizar continuidad educativa.',
  },
  {
    id: 'rechazar',
    icono: '❌',
    titulo: 'Rechazar tiene consecuencias graves',
    desc: 'Si rechazas tu asignación, quedas sin colegio Y sin el cupo que tenías en tu colegio de origen (ya se liberó). Solo hazlo si estás seguro/a de que podrás quedar en otro en el Complementario.',
  },
  {
    id: 'lista-espera',
    icono: '⬆️',
    titulo: 'Lista de espera solo hacia preferencias superiores',
    desc: 'Solo puedes optar a colegios que estaban MÁS ARRIBA en tu lista original, nunca a los que estaban más abajo.',
  },
  {
    id: 'matricula',
    icono: '🏫',
    titulo: 'Matrícula presencial obligatoria',
    desc: 'Si no te presentas en el plazo del 9 al 22 de diciembre, pierdes el cupo asignado.',
  },
  {
    id: 'no-contactar',
    icono: '📵',
    titulo: 'No contactes al colegio antes de diciembre',
    desc: 'Los establecimientos reciben la información de asignación recién en el periodo de matrícula. Contactarlos antes no sirve y puede generar confusión.',
  },
]

/* S21-a, S21-c, S21-f–i: contenido detallado de cada etapa — JSX estático */
const ETAPAS = [
  {
    id: 'postulacion',
    num: 1,
    nombre: 'Postulación',
    icono: '📝',
    color: '#0057B7',
    inicio: new Date('2026-08-04'),
    fin: new Date('2026-08-27'),
    fechaTexto: '4 de agosto (9:00) – 27 de agosto (14:00) de 2026',
    resumen:
      'Crea tu cuenta, registra al estudiante, arma y ordena tu lista de colegios, envía y descarga el comprobante.',
    contenidoJsx: (
      <div>
        <p>Sigue estos pasos en la plataforma oficial del SAE:</p>
        <ol className="proc-ol">
          <li>Crea cuenta como apoderado/a en la plataforma</li>
          <li>
            Registra los datos del estudiante (RUN, nombre, <strong>curso al que postula</strong>)
          </li>
          <li>Busca establecimientos con filtros: nombre, comuna o nivel educativo</li>
          <li>Agrega los colegios a tu listado</li>
          <li>
            Ordénalos de <strong>mayor a menor preferencia</strong> — el que más quieres, primero
          </li>
          <li>Envía tu postulación</li>
          <li>
            <strong>Descarga el comprobante</strong>
          </li>
        </ol>
        <InfoBox icono="📄" titulo="El comprobante es obligatorio" tipo="alerta">
          La postulación es válida <strong>solo cuando descargas el comprobante</strong>. Sin ese
          último paso, el sistema no la registra.
        </InfoBox>
        <InfoBox icono="💡" titulo="¿Cuántos colegios incluir?">
          Si el estudiante no tiene colegio asegurado, incluye{' '}
          <strong>al menos 6 establecimientos</strong>. No hay límite de postulaciones y puedes
          postular entre comunas y regiones.
        </InfoBox>
        <InfoBox icono="⚠️" titulo="Revisa bien el curso al que postula" tipo="alerta">
          Datos erróneos —especialmente el <strong>curso</strong>— pueden afectar el resultado de
          asignación.
        </InfoBox>
        <div className="proc-detalle-cta">
          <Link to="/postulacion" className="btn btn--primary">
            Ir a postulación →
          </Link>
        </div>
      </div>
    ),
  },
  {
    id: 'asignacion',
    num: 2,
    nombre: 'Asignación',
    icono: '⚙️',
    color: '#6B46C1',
    inicio: new Date('2026-08-28'),
    fin: new Date('2026-10-14'),
    fechaTexto: 'El sistema trabaja entre el 28 de agosto y el 14 de octubre de 2026',
    resumen:
      'El sistema asigna automáticamente. No necesitas hacer nada en esta etapa — solo esperar.',
    contenidoJsx: (
      <div>
        <p>
          En esta etapa el sistema trabaja solo.{' '}
          <strong>No necesitas hacer nada</strong>: solo esperar los resultados.
        </p>
        <p>¿Cómo funciona el sistema? (versión simplificada):</p>
        <ol className="proc-ol">
          <li>Si tu 1.ª preferencia tiene vacantes suficientes, quedas ahí.</li>
          <li>
            Si no alcanzan, se aplican las prioridades y el desempate es <strong>aleatorio</strong>.
          </li>
          <li>
            Si no quedas en la 1.ª, el sistema intenta la 2.ª, luego la 3.ª, y así.
          </li>
          <li>
            Si no quedas en ninguna, conservas tu colegio de origen. Si tampoco hay continuidad
            ahí, entras automáticamente a listas de espera.
          </li>
        </ol>
        {/* S21-f: formulación técnica correcta de prioridades (3 legales + cuota 15 %) */}
        <div className="proc-prioridades">
          <p className="proc-prioridades__titulo">Prioridades de asignación</p>
          <div className="proc-prio-item">
            <span className="proc-prio-item__badge">Prioridad legal</span>
            <span className="proc-prio-item__texto">
              Hermano/a matriculado/a en el establecimiento
            </span>
          </div>
          <div className="proc-prio-item">
            <span className="proc-prio-item__badge">Prioridad legal</span>
            <span className="proc-prio-item__texto">
              Hijo/a de funcionario/a del establecimiento
            </span>
          </div>
          <div className="proc-prio-item">
            <span className="proc-prio-item__badge">Prioridad legal</span>
            <span className="proc-prio-item__texto">
              Exalumno/a no expulsado/a del establecimiento
            </span>
          </div>
          <div className="proc-prio-item">
            <span className="proc-prio-item__badge proc-prio-item__badge--cuota">
              Cuota 15 %
            </span>
            <span className="proc-prio-item__texto">
              Reserva de asientos para estudiantes prioritarios (distinta de las prioridades
              legales)
            </span>
          </div>
        </div>
        {/* S21-f: enlace a /algoritmo */}
        <div className="proc-detalle-cta">
          <Link to="/algoritmo" className="btn btn--secondary">
            Ver cómo funciona el sistema →
          </Link>
        </div>
      </div>
    ),
  },
  {
    id: 'resultados',
    num: 3,
    nombre: 'Resultados',
    icono: '📬',
    color: '#1A7F37',
    inicio: new Date('2026-10-15'),
    fin: new Date('2026-10-21'),
    fechaTexto: '15 – 21 de octubre de 2026',
    resumen:
      'Ingresa a la plataforma, revisa tu resultado y decide: aceptar, aceptar con lista de espera o rechazar.',
    contenidoJsx: (
      <div>
        <p>
          Ingresa con tu usuario y contraseña. Tienes <strong>3 opciones</strong>:
        </p>
        <div className="proc-opciones-res">
          <div className="proc-opcion proc-opcion--ok">
            <strong>1. Aceptar</strong>
            <p>
              Confirmas el colegio asignado. Listo — solo queda matricularte en diciembre.
            </p>
          </div>
          <div className="proc-opcion proc-opcion--lista">
            <strong>2. Aceptar y activar lista de espera</strong>
            <p>
              Solo disponible si no quedaste en tu 1.ª opción. Mantienes el cupo asignado y el
              sistema te reasigna automáticamente si se libera un lugar en un colegio que estaba{' '}
              <strong>más arriba</strong> en tu lista original.
            </p>
          </div>
          <div className="proc-opcion proc-opcion--rech">
            <strong>3. Rechazar</strong>
            <p>
              Quedas sin colegio asignado y debes postular en el Periodo Complementario.
            </p>
          </div>
        </div>
        <InfoBox icono="⏰" titulo="Aceptado por omisión" tipo="alerta">
          Si <strong>no ingresas</strong> durante este periodo, la plataforma considera tu
          resultado <strong>aceptado automáticamente</strong>. No es un error — es una medida para
          garantizar continuidad educativa.
        </InfoBox>
        <InfoBox icono="❌" titulo="Rechazar tiene consecuencias graves" tipo="alerta">
          Si rechazas, quedas sin colegio <strong>Y</strong> sin el cupo de tu colegio de origen
          (ya se liberó cuando te asignaron al nuevo). Solo rechaza si estás seguro/a de quedar en
          otro en el Complementario.
        </InfoBox>
        <InfoBox icono="📵" titulo="No contactes al colegio antes de diciembre" tipo="alerta">
          Los establecimientos reciben la información de asignación{' '}
          <strong>recién en diciembre</strong>. Llamar antes no sirve y puede generar confusión.
        </InfoBox>
        <p className="proc-nota-cambio">
          Puedes cambiar tu respuesta cuantas veces quieras dentro del periodo. Vale la{' '}
          <strong>última guardada</strong>.
        </p>
        {/* S21-g: enlace a SeguimientoPage */}
        <div className="proc-detalle-cta">
          <Link to="/seguimiento" className="btn btn--secondary">
            Ver mi postulación →
          </Link>
        </div>
      </div>
    ),
  },
  {
    id: 'complementario',
    num: 4,
    nombre: 'Periodo Complementario',
    icono: '🔁',
    color: '#ea580c',
    inicio: new Date('2026-11-10'),
    fin: new Date('2026-12-01'),
    fechaTexto:
      'Postulación: 10 – 17 de noviembre · Resultados: 1 de diciembre de 2026',
    resumen:
      'Segunda oportunidad, solo para quienes quedaron sin colegio. Resultado final sin opción de aceptar/rechazar.',
    contenidoJsx: (
      <div>
        <p>
          <strong>¿Para quién es?</strong> Solo para quienes:
        </p>
        <ul className="proc-ul">
          <li>No postularon en el Periodo Principal</li>
          <li>Rechazaron su asignación</li>
          <li>No fueron admitidos en ningún establecimiento</li>
        </ul>
        {/* S21-h: tabla comparativa Principal vs. Complementario */}
        <p>Diferencias con el Periodo Principal:</p>
        <div className="proc-tabla-comp-wrap">
          <table
            className="proc-tabla-comp"
            aria-label="Diferencias entre el Periodo Principal y el Complementario"
          >
            <thead>
              <tr>
                <th scope="col">Aspecto</th>
                <th scope="col">Periodo Principal</th>
                <th scope="col">Periodo Complementario</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Participantes</td>
                <td>Todos los estudiantes nuevos o que desean cambiarse</td>
                <td>
                  Solo quienes quedaron sin colegio o rechazaron su asignación
                </td>
              </tr>
              <tr>
                <td>Oferta</td>
                <td>Todos los establecimientos del SAE</td>
                <td>Solo establecimientos con vacantes disponibles</td>
              </tr>
              <tr>
                <td>Resultado</td>
                <td>Asignación principal + opción de listas de espera</td>
                <td>Asignación final, sin aceptar/rechazar y sin listas de espera</td>
              </tr>
            </tbody>
          </table>
        </div>
        <InfoBox icono="📍" titulo="Asignado por cercanía">
          Si no quedas en ninguna preferencia y no tienes colegio de origen, Mineduc te otorga
          una vacante en un establecimiento <strong>gratuito, sin categoría Insuficiente y a
          menos de 17 km</strong> de tu domicilio. La matrícula en él es voluntaria.
        </InfoBox>
        <InfoBox icono="💡" titulo="Incluye al menos 6 colegios también aquí">
          La oferta es reducida (solo vacantes disponibles), así que agregar más opciones
          aumenta tus probabilidades de quedar en alguno.
        </InfoBox>
      </div>
    ),
  },
  {
    id: 'matricula',
    num: 5,
    nombre: 'Matrícula',
    icono: '🏫',
    color: '#C0392B',
    inicio: new Date('2026-12-09'),
    fin: new Date('2026-12-29'),
    fechaTexto: '9 – 22 de diciembre de 2026 (hasta el 29 en Aysén y Magallanes)',
    resumen:
      'Concurre presencialmente al establecimiento asignado para completar la matrícula.',
    contenidoJsx: (
      <div>
        <p>
          La matrícula es la <strong>única etapa presencial</strong> del proceso. Se realiza en
          el establecimiento asignado.
        </p>
        <InfoBox icono="⚠️" titulo="Si no te presentas, pierdes el cupo" tipo="alerta">
          Tienes que ir <strong>en persona al colegio</strong> entre el 9 y el 22 de diciembre
          (hasta el 29 en Aysén y Magallanes). Si no te presentas en ese plazo,{' '}
          <strong>pierdes el cupo asignado</strong>.
        </InfoBox>
        {/* S21-i: checklist de documentos de matrícula */}
        <p>Documentos que necesitas:</p>
        <p className="proc-checklist__grupo">Del estudiante</p>
        <ul className="proc-checklist" aria-label="Documentos del estudiante">
          <li>Cédula de identidad</li>
          <li>RUN de enrolamiento</li>
          <li>
            Certificado de nacimiento (o{' '}
            <abbr title="Identificación Provisoria para Extranjeros">IPE</abbr> para estudiantes
            extranjeros)
          </li>
        </ul>
        <p className="proc-checklist__grupo">Del apoderado/a</p>
        <ul className="proc-checklist" aria-label="Documentos del apoderado">
          <li>Cédula de identidad</li>
          <li>
            RUN de enrolamiento o{' '}
            <abbr title="Identificación Provisoria para Apoderados">IPA</abbr>
          </li>
        </ul>
        <p className="proc-checklist__grupo">Si tramita un tercero</p>
        <ul className="proc-checklist" aria-label="Documentos si tramita un tercero">
          <li>Poder simple firmado</li>
          <li>Cédula de identidad de quien tramita</li>
        </ul>
        <InfoBox icono="✅" titulo="No pueden negarte la matrícula" tipo="exito">
          Los colegios pueden pedir documentación complementaria para sus registros, pero{' '}
          <strong>no pueden negarte la matrícula</strong> por no tenerla al momento de
          matricularte.
        </InfoBox>
      </div>
    ),
  },
]

/* S21-d: Calendario Admisión 2027 (datos exactos de la fuente oficial) */
const CALENDARIO = [
  {
    hito: 'Registro anticipado de apoderados',
    fecha: 'desde el 15 de julio de 2026',
    destacado: false,
  },
  {
    hito: 'Postulación — Periodo Principal',
    fecha: '4 de agosto (9:00) – 27 de agosto (14:00) de 2026',
    destacado: true,
  },
  {
    hito: 'Resultados del Periodo Principal',
    fecha: '15 – 21 de octubre de 2026',
    destacado: false,
  },
  {
    hito: 'Resultados de listas de espera',
    fecha: '28 – 29 de octubre de 2026',
    destacado: false,
  },
  {
    hito: 'Postulación — Periodo Complementario',
    fecha: '10 – 17 de noviembre de 2026',
    destacado: false,
  },
  {
    hito: 'Resultados del Periodo Complementario',
    fecha: '1 de diciembre de 2026',
    destacado: false,
  },
  {
    hito: 'Matrícula presencial',
    fecha: '9 – 22 de diciembre de 2026 (hasta el 29 en Aysén y Magallanes)',
    destacado: false,
  },
]

export default function ProcesoPage() {
  const { textoGrande } = useTextSize()

  // S21-c: divulgación progresiva — cada etapa expandible
  // Abrir automáticamente la etapa activa; si ninguna activa, la primera
  const [abiertos, setAbiertos] = useState(() => {
    const inicial = {}
    ETAPAS.forEach((e) => {
      const est = calcEstado(e.inicio, e.fin)
      inicial[e.id] = est === 'activa'
    })
    if (!Object.values(inicial).some(Boolean)) inicial[ETAPAS[0].id] = true
    return inicial
  })

  const toggle = (id) => setAbiertos((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <main className={`page page--proceso${textoGrande ? ' page--texto-grande' : ''}`}>
      {/* Breadcrumb */}
      <nav className="ficha-breadcrumb" aria-label="Navegación de retorno">
        <Link to="/" className="ficha-breadcrumb__link">
          ← Inicio
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="ficha-breadcrumb__current">El proceso paso a paso</span>
      </nav>

      <TextSizeBar pageName="El proceso" />

      {/* Hero / encabezado */}
      <section className="proceso-hero">
        <h1>El proceso paso a paso</h1>
        <p className="proceso-hero__lead">
          La postulación al SAE tiene 5 etapas. Conocerlas te ayuda a tomar mejores decisiones
          — especialmente en la etapa de Resultados, donde hay reglas que conviene conocer antes
          de actuar.
        </p>
      </section>

      {/* S21-e: reglas de alto riesgo siempre visibles */}
      <section className="proceso-alertas" aria-labelledby="alertas-titulo">
        <h2 className="proceso-alertas__titulo" id="alertas-titulo">
          <span aria-hidden="true">⚠️</span> 5 reglas importantes antes de empezar
        </h2>
        <p className="proceso-alertas__sub">
          Son las decisiones de mayor consecuencia del proceso. Léelas una vez ahora y ahorra
          dolores de cabeza después.
        </p>
        <div className="proceso-alertas__grid">
          {REGLAS_ALTO_RIESGO.map((r) => (
            <div key={r.id} className="proc-regla">
              <span className="proc-regla__icono" aria-hidden="true">
                {r.icono}
              </span>
              <div className="proc-regla__cuerpo">
                <strong className="proc-regla__titulo">{r.titulo}</strong>
                <p className="proc-regla__desc">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* S21-a, S21-c: línea de tiempo vertical de 5 etapas con detalle expandible */}
      <section className="proceso-timeline" aria-label="Etapas del proceso SAE">
        {ETAPAS.map((etapa, idx) => {
          const estado = calcEstado(etapa.inicio, etapa.fin)
          const abierto = abiertos[etapa.id] ?? false
          return (
            <div
              key={etapa.id}
              className={`proc-etapa proc-etapa--${estado}`}
              style={{ '--etapa-color': etapa.color }}
            >
              {/* Línea conectora (excepto la última) */}
              <div className="proc-etapa__izq" aria-hidden="true">
                <div className="proc-etapa__num">{etapa.num}</div>
                {idx < ETAPAS.length - 1 && <div className="proc-etapa__linea" />}
              </div>

              <div className="proc-etapa__der">
                {/* Cabecera clickeable para expandir */}
                <button
                  type="button"
                  className="proc-etapa__header"
                  onClick={() => toggle(etapa.id)}
                  aria-expanded={abierto}
                  aria-controls={`etapa-detalle-${etapa.id}`}
                >
                  <div className="proc-etapa__titulo-row">
                    <span className="proc-etapa__icono" aria-hidden="true">
                      {etapa.icono}
                    </span>
                    <span className="proc-etapa__nombre">{etapa.nombre}</span>
                    <span className={`proc-estado proc-estado--${estado}`}>
                      {estado === 'completada'
                        ? '✓ Completada'
                        : estado === 'activa'
                          ? '▶ Activa ahora'
                          : 'Próxima'}
                    </span>
                  </div>
                  <div className="proc-etapa__fecha">{etapa.fechaTexto}</div>
                  <p className="proc-etapa__resumen">{etapa.resumen}</p>
                  <span className="proc-etapa__toggle" aria-hidden="true">
                    {abierto ? '▲ Ocultar detalle' : '▼ Ver detalle'}
                  </span>
                </button>

                {/* Detalle expandible */}
                {abierto && (
                  <div
                    id={`etapa-detalle-${etapa.id}`}
                    className="proc-etapa__detalle"
                  >
                    {etapa.contenidoJsx}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </section>

      {/* S21-d: Calendario Admisión 2027 como tabla HTML accesible */}
      <section className="proceso-calendario" aria-labelledby="cal-titulo">
        <h2 id="cal-titulo" className="proceso-calendario__titulo">
          <span aria-hidden="true">📅</span> Calendario Admisión 2027
        </h2>
        <p className="proceso-calendario__nota">
          El calendario oficial se publica solo como imagen en el sitio del Mineduc. Aquí lo
          presentamos en formato accesible para lectores de pantalla y buscadores.
        </p>
        <div className="proceso-calendario__wrap">
          <table
            className="proc-cal-tabla"
            aria-label="Fechas del proceso de admisión escolar 2027"
          >
            <thead>
              <tr>
                <th scope="col">Hito</th>
                <th scope="col">Fechas</th>
              </tr>
            </thead>
            <tbody>
              {CALENDARIO.map((fila) => (
                <tr
                  key={fila.hito}
                  className={fila.destacado ? 'proc-cal-tabla__tr--dest' : ''}
                >
                  <td>{fila.hito}</td>
                  <td className="proc-cal-tabla__fecha">{fila.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="proceso-calendario__fuente">
          Fuente: Ministerio de Educación de Chile — Admisión Escolar 2027. Verificado el 4 de
          agosto de 2026.
        </p>
      </section>

      {/* CTA final */}
      <div className="proceso-footer-cta">
        <Link className="btn btn--primary btn--grande" to="/postulacion">
          Ir a postulación →
        </Link>
        <Link className="btn btn--secondary" to="/algoritmo">
          Ver cómo funciona el sistema
        </Link>
      </div>
    </main>
  )
}
