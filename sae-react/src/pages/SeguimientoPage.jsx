import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { colegios } from '../data/colegios'
import { prioridadLabels, etiquetaPrioridad, vacantesDeNivel } from '../utils/asignacion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'
import { useModoEstudio } from '../context/ModoEstudioContext'

const STORAGE_KEY = 'sae_react_postulacion'

/* Etapas del proceso SAE con estado visual */
const ETAPAS_PROCESO = [
  { id: 'postulacion', icon: '📝', label: 'Postulación', desc: 'Enviaste tu lista de colegios' },
  { id: 'validacion', icon: '🔍', label: 'Validación', desc: 'El sistema verificó tus datos y prioridades' },
  { id: 'asignacion', icon: '⚙️', label: 'Asignación', desc: 'El algoritmo procesó todas las postulaciones' },
  { id: 'resultado', icon: '🎓', label: 'Resultado', desc: 'Tu resultado está listo para revisarlo' },
]

const ORDINALES = ['primera', 'segunda', 'tercera', 'cuarta', 'quinta', 'sexta']

/* Genera la explicacion contextualizada del resultado en terminos del usuario.
   S22-11 (refinamiento): la prioridad se explica según el nivel REAL en el
   colegio asignado (asignado.nivel), no según una prioridad global del perfil —
   hermano/funcionario/exalumno solo valen en el colegio donde hay ese vínculo.

   Auditoría 2026-09-08: si `sinAsignacion` es true, la asignación que muestra
   `calcularResultado` es un FALLBACK (el colegio de mayor % estimado, porque
   ningún colegio de la lista sentó a la familia en la simulación). En ese caso
   NO se narra "Quedaste en X" ni se usa el lenguaje de "sorteo": se dice
   explícitamente que no hubo cupo y qué pasaría en el proceso real.

   S15-3 (refinamiento) · caso_estudio §3.2 (2026-09-09): el "por qué no quedaste
   en tu opción de más arriba" pasa de una línea genérica a una explicación
   específica del/de los colegio(s) que no te sentaron: más familias que cupos +
   no tenías un vínculo ni la reserva del 15 % ahí + el desempate entre familias
   en tu misma situación es un sorteo por colegio (trato igual entre iguales, no
   "azar") + qué NO puede hacer el sistema (no crea cupos — BROOK). Formato de
   frecuencia "X de cada 100" (RISK-NUM). Recibe `detalles` de `calcularResultado`. */
function generarExplicacion(asignado, sinAsignacion = false, detalles = []) {
  if (!asignado) return null

  if (sinAsignacion) {
    return [
      `En esta simulación, el sistema recorrió tu lista y <strong>ningún colegio te dejó un cupo</strong> en la ronda principal.`,
      `En el proceso real, si esto ocurre pasas al <strong>Periodo Complementario</strong> (y conservas tu colegio de origen, si lo tienes, mientras tanto). Como referencia, el colegio de tu lista con la probabilidad estimada más alta era <strong>${asignado.nombre}</strong> (${asignado.prob} de cada 100), pero <strong>eso no es una asignación</strong>.`,
    ]
  }

  const partes = []

  switch (asignado.nivel) {
    case 1:
      partes.push(
        `Quedaste en el <strong>${asignado.nombre}</strong> porque tienes un hermano o hermana matriculado/a ahí. En ese colegio, eso te da la <strong>prioridad más alta por ley</strong>.`
      )
      break
    case 2:
      partes.push(
        `Quedaste en el <strong>${asignado.nombre}</strong> como estudiante prioritario/a (con <abbr title="Subvención Escolar Preferencial">SEP</abbr>). Esta cuota del 15 % vale en todos los colegios de tu lista.`
      )
      break
    case 3:
      partes.push(
        `Quedaste en el <strong>${asignado.nombre}</strong> porque tu apoderado/a trabaja en ese establecimiento. La prioridad de funcionario/a vale <strong>solo en ese colegio</strong>.`
      )
      break
    case 4:
      partes.push(
        `Quedaste en el <strong>${asignado.nombre}</strong> como exalumno/a de ese establecimiento. Esa prioridad vale <strong>solo en ese colegio</strong>.`
      )
      break
    default:
      partes.push(
        `Quedaste en el <strong>${asignado.nombre}</strong>. Ahí no tenías un vínculo (hermano/a matriculado/a, hijo/a de funcionario/a o exalumno/a), así que competías con las demás familias en tu misma situación por los cupos que quedaban después de aplicar las prioridades que fija la ley. Cuando hay más familias que vacantes, cada colegio elige entre esas familias con su propio sorteo, el mismo para todas — y este año tu cupo salió.`
      )
  }

  if (asignado.idx > 1) {
    const previas = detalles.filter((d) => d.idx < asignado.idx && d.estado !== 'no_evaluado')
    if (previas.length === 1) {
      const p = previas[0]
      const ord = ORDINALES[p.idx - 1] ?? `N.º ${p.idx}`
      if ((p.nivel ?? 5) > 2) {
        partes.push(
          `Al <strong>${p.nombre}</strong>, tu ${ord} opción, postularon más familias que los cupos que tenía para tu nivel. Ahí no tenías un vínculo (hermano/a, hijo/a de funcionario/a o exalumno/a) ni la reserva del 15 % para estudiantes prioritarios/as, así que competías por los cupos que quedaban después de aplicar esas prioridades.`
        )
        if (p.prob != null) {
          partes.push(
            `La probabilidad estimada de quedar ahí con tu perfil era de <strong>${p.prob} de cada 100</strong>.`
          )
        }
        partes.push(
          `Entre las familias en tu misma situación —sin un vínculo con ese colegio—, cada establecimiento elige con su propio sorteo, el mismo para todas. Esta vez tu número no alcanzó uno de esos cupos. Ese sorteo vale <strong>solo para el ${p.nombre}</strong>: no afectó tus posibilidades en los demás colegios de tu lista.`
        )
      } else {
        partes.push(
          `En el <strong>${p.nombre}</strong>, tu ${ord} opción, tenías prioridad, pero postularon tantas familias con esa prioridad o una mayor que los cupos no alcanzaron para todas.`
        )
      }
    } else if (previas.length > 1) {
      const nombres = previas.map((d) => d.nombre).join(', ')
      partes.push(
        `No quedaste en tus primeras ${previas.length} opciones (${nombres}) porque en todas postularon más familias que cupos y en ninguna tenías un vínculo o una prioridad que asegurara el lugar. En esos casos el cupo depende de la demanda del colegio y del sorteo que cada uno hace entre las familias en tu misma situación.`
      )
    }
    partes.push(
      `Por eso el sistema <strong>siguió con tu lista</strong> y te asignó al ${asignado.nombre}. El SAE reparte los cupos que existen: no puede crear cupos nuevos en un colegio ni asegurar la primera opción cuando hay más familias que vacantes.`
    )
  } else {
    partes.push('¡Quedaste en tu primera opción!')
  }

  partes.push(
    `La probabilidad estimada para el ${asignado.nombre} con tu perfil era de <strong>${asignado.prob} de cada 100</strong>.`
  )

  return partes
}

/* Opción 2 (2026-09-10) — comparación de un vistazo "por qué este colegio y no
   el anterior". Devuelve las filas (preferencias no obtenidas + la asignada) o
   null si no hay contraste (quedó en la 1.ª opción o fue el fallback sin cupo).
   Guías: HAX G11/G4 — la razón real, junto a la decisión; una tabla se procesa
   más rápido que tres párrafos. Solo condición A. */
function comparacionResultado(asignado, sinAsignacion, detalles = []) {
  if (!asignado || sinAsignacion || asignado.idx <= 1) return null

  const situacion = (nivel) => {
    if (nivel == null || nivel >= 5) return 'Sin vínculo de prioridad'
    return prioridadLabels[nivel].split('/')[0] // "Hermano" en vez de "Hermano/a matriculado/a"
  }

  const previas = detalles
    .filter((d) => d.idx < asignado.idx && d.estado !== 'no_evaluado')
    .map((d) => ({
      idx: d.idx,
      nombre: d.nombre,
      situacion: `${situacion(d.nivel)} · demanda ${d.demanda}`,
      resultado: 'No alcanzó',
      obtuvo: false,
    }))

  return [
    ...previas,
    {
      idx: asignado.idx,
      nombre: asignado.nombre,
      situacion:
        asignado.nivel != null && asignado.nivel < 5
          ? situacion(asignado.nivel)
          : `Sin vínculo · demanda ${asignado.demanda}`,
      resultado: 'Cupo',
      obtuvo: true,
    },
  ]
}

const estadoLabel = {
  asignado: '✅ Asignado',
  no_evaluado: '⏭ No evaluado',
  sin_cupos: '🔴 Sin cupos',
  prioridad_insuficiente: '🟡 Prioridad insuficiente',
}

const estadoColor = {
  asignado: 'var(--verde)',
  no_evaluado: 'var(--gris-med)',
  sin_cupos: 'var(--rojo)',
  prioridad_insuficiente: 'var(--naranja)',
}

export default function SeguimientoPage() {
  const { textoGrande } = useTextSize()
  const { esControl } = useModoEstudio() // F3 — condición de control del estudio
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [pedirConfirmacion, setPedirConfirmacion] = useState(false)
  const [ofertaAceptada, setOfertaAceptada] = useState(null) // null | 'aceptada' | 'rechazada'
  const [detalleAbierto, setDetalleAbierto] = useState(null)
  const comprobanteRef = useRef(null)

  const cancelarPostulacion = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('sae_react_postulacion_draft_list')
    setData(null)
    setPedirConfirmacion(false)
  }

  const descargarComprobante = () => {
    if (!data) return
    const { comprobante, resultado } = data
    const asignado = resultado?.asignado
    const txt = [
      '══════════════════════════════════════════',
      '     COMPROBANTE DE POSTULACIÓN SAE',
      '     Sistema de Admisión Escolar',
      '══════════════════════════════════════════',
      '',
      `Comprobante: ${comprobante}`,
      `Fecha: ${new Date(data.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      `Prioridad: ${etiquetaPrioridad(resultado?.nivel)}`,
      '',
      '── RESULTADO ──',
      asignado ? `Colegio asignado: ${asignado.nombre}` : 'Sin asignación',
      asignado ? `Preferencia N°${asignado.idx}` : '',
      '',
      '── LISTA DE POSTULACIÓN ──',
      // F3: en control, sin el diagnóstico por preferencia (solo la marca de asignado).
      ...resultado?.detalles?.map((d) =>
        esControl
          ? `  ${d.idx}. ${d.nombre} (${d.comuna})${d.estado === 'asignado' ? ' — Asignado' : ''}`
          : `  ${d.idx}. ${d.nombre} (${d.comuna}) — ${estadoLabel[d.estado]?.replace(/[^\w\sáéíóúñ/]/g, '').trim() ?? d.estado}`,
      ) ?? [],
      '',
      '══════════════════════════════════════════',
      'Documento generado desde el prototipo SAE.',
      'Este comprobante NO es un documento oficial.',
      '══════════════════════════════════════════',
    ].join('\n')

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comprobante_${comprobante}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  /* Sin postulación */
  if (!data) {
    return (
      <main className={`page${textoGrande ? ' page--texto-grande' : ''}`}>
        <TextSizeBar pageName="Mi postulación" />
        <h1>Mi postulación</h1>
        <p className="page__lead">
          Aquí podrás ver el estado y el resultado de tu postulación.
        </p>

        <div className="seg-empty">
          <div className="seg-empty__icon">📋</div>
          <h2 className="seg-empty__title">No tienes una postulación registrada</h2>
          <p className="seg-empty__desc">
            Completa el flujo de postulación para ver tu resultado aquí.
            Necesitas ingresar con ClaveÚnica, armar tu lista de colegios y confirmar.
          </p>
          <div className="hero__actions" style={{ justifyContent: 'center' }}>
            <Link className="btn btn--primary btn--grande" to="/postulacion">
              Ir a Postulación
            </Link>
            {!esControl && (
              <Link className="btn btn--secondary" to="/algoritmo">
                ¿Cómo funciona?
              </Link>
            )}
          </div>
        </div>
      </main>
    )
  }

  const { resultado, comprobante } = data
  const asignado = resultado?.asignado
  const sinAsignacion = !!resultado?.sinAsignacionEnPreferencias
  const explicacion = generarExplicacion(asignado, sinAsignacion, resultado?.detalles ?? [])
  const comparacion = comparacionResultado(asignado, sinAsignacion, resultado?.detalles ?? [])
  const colegioAsignado = asignado ? colegios.find((c) => c.id === asignado.id) : null
  const alumnoNivel = data.alumno?.nivel ?? null
  // Preferencias que estaban MÁS ARRIBA que la asignada: son las únicas a las que
  // se puede optar por lista de espera (regla real del SAE). Alimenta las líneas
  // de consecuencia de aceptar/rechazar (opción 4) y el "qué sigue ahora" (opción 1).
  const previasNombres = (resultado?.detalles ?? [])
    .filter((d) => asignado && d.idx < asignado.idx && d.estado !== 'no_evaluado')
    .map((d) => d.nombre)

  return (
    <main className={`page page--seguimiento${textoGrande ? ' page--texto-grande' : ''}`}>
      <TextSizeBar pageName="Mi postulación" />
      <h1>Mi postulación</h1>
      <p className="page__lead">
        Revisa el resultado de tu postulación y entiende por qué te fue asignado ese colegio.
      </p>

      {/* ── Timeline del proceso ── */}
      <div className="seg-timeline" role="list" aria-label="Etapas del proceso">
        {ETAPAS_PROCESO.map((etapa, i) => (
          <div
            key={etapa.id}
            className="seg-timeline__step seg-timeline__step--done"
            role="listitem"
            aria-label={`${etapa.label} — completado`}
          >
            <div className="seg-timeline__circle">
              <span className="seg-timeline__icon">{etapa.icon}</span>
              <span className="seg-timeline__check">✓</span>
            </div>
            <div className="seg-timeline__text">
              <span className="seg-timeline__label">{etapa.label}</span>
              <span className="seg-timeline__desc">{etapa.desc}</span>
            </div>
            {i < ETAPAS_PROCESO.length - 1 && (
              <div className="seg-timeline__connector seg-timeline__connector--done" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      {/* ── Resultado, en texto plano ── */}
      {/* 2026-09-14 (feedback: la tarjeta con ilustración, insignias y stats en
          cajas de color se sentía como un "modal" sobrecargado). Mismo
          contenido (estado, nombre, dirección, probabilidad, prioridad,
          demanda, comprobante), sin ilustración ni tarjetas — solo texto. */}
      <div className="seg-result-plano" ref={comprobanteRef}>
        {asignado && colegioAsignado ? (
          <>
            <p className="seg-result-plano__estado">
              <strong>{sinAsignacion ? 'Sin cupo en la ronda principal' : 'Resultado disponible'}</strong>
              {' — '}
              {sinAsignacion
                ? 'no quedaste en ninguna de tus preferencias'
                : asignado.idx === 1
                  ? 'tu primera opción'
                  : `preferencia N°${asignado.idx}`}
            </p>
            <h2 className="seg-result-plano__nombre">{asignado.nombre}</h2>
            <p className="seg-result-plano__addr">
              📍 {colegioAsignado.direccion}, {colegioAsignado.comuna}
            </p>
            <ul className="seg-result-plano__datos">
              {/* F3: la probabilidad es explicabilidad → no va en la condición de control.
                  El SAE real no muestra una probabilidad en la pantalla de resultado. */}
              {!esControl && (
                <li><span>Probabilidad</span><strong>{asignado.prob}%</strong></li>
              )}
              <li>
                <span>Prioridad</span>
                <strong>{resultado?.nivel && resultado.nivel < 5 ? prioridadLabels[resultado.nivel].split('/')[0] : (resultado?.nivel === 5 ? 'Sin vínculo' : '—')}</strong>
              </li>
              <li>
                <span>Demanda</span>
                <strong style={{ textTransform: 'capitalize' }}>{asignado.demanda}</strong>
              </li>
              <li><span>Comprobante</span><strong>{comprobante}</strong></li>
            </ul>
          </>
        ) : (
          <p>Sin asignación disponible.</p>
        )}

        <p className="seg-result-plano__meta">
          Prioridad aplicada: <strong>{etiquetaPrioridad(resultado?.nivel)}</strong>
          {' · '}
          Fecha postulación: <strong>{new Date(data.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
        </p>
      </div>

      {/* ── Acción: Aceptar o rechazar oferta ── */}
      {asignado && !ofertaAceptada && (
        <Card className="seg-action-card">
          <CardContent>
            <h3 style={{ margin: '0 0 8px', color: 'var(--acento)' }}>¿Aceptas esta asignación?</h3>
            <p style={{ margin: '0 0 16px', color: 'var(--texto-suave)', fontSize: '0.92rem' }}>
              Tienes hasta el <strong>21 de octubre de 2026</strong> para aceptar o rechazar.
              Si rechazas, pasas a la lista de espera.
            </p>
            <div className="hero__actions">
              <button
                type="button"
                className="btn btn--green btn--grande"
                onClick={() => setOfertaAceptada('aceptada')}
              >
                ✓ Aceptar asignación
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setOfertaAceptada('rechazada')}
              >
                Rechazar y pasar a lista de espera
              </button>
            </div>
            {/* Opción 4 (2026-09-10) — HAX G16: comunicar la consecuencia ANTES de
                la acción, no después. Solo condición A (apoyo a la decisión). */}
            {!esControl && (
              <div className="seg-consecuencias" aria-hidden="false">
                <p>
                  <strong>Si aceptas:</strong> tu cupo en {asignado.nombre} queda asegurado.
                  {previasNombres.length > 0
                    ? ` Puedes seguir en lista de espera de las preferencias que estaban más arriba (${previasNombres.join(', ')}).`
                    : ''}
                </p>
                <p>
                  <strong>Si rechazas:</strong> renuncias a este cupo.
                  {previasNombres.length > 0
                    ? ` Solo quedas en lista de espera de ${previasNombres.join(', ')}; si no se libera un cupo ahí, puedes quedar sin colegio asignado.`
                    : ' Puedes quedar sin colegio asignado y tendrías que postular en el Periodo Complementario.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {ofertaAceptada === 'aceptada' && (
        <div className="seg-accept-msg seg-accept-msg--ok" role="status">
          <span className="seg-accept-msg__icon">🎉</span>
          <div>
            <strong>¡Asignación aceptada!</strong>
            <p style={{ margin: '4px 0 0' }}>
              Ahora debes matricularte en persona en el establecimiento
              <strong> entre el 9 y el 22 de diciembre de 2026</strong>. Si no vas en ese plazo,
              pierdes el cupo.
            </p>
          </div>
        </div>
      )}

      {ofertaAceptada === 'rechazada' && (
        <div className="seg-accept-msg seg-accept-msg--wait" role="status">
          <span className="seg-accept-msg__icon">⏳</span>
          <div>
            <strong>Pasaste a la lista de espera</strong>
            <p style={{ margin: '4px 0 0' }}>
              Si se liberan cupos en alguno de tus colegios preferidos, serás notificado/a.
            </p>
          </div>
        </div>
      )}

      {/* ── Opción 1 (2026-09-10) — "Qué sigue ahora" ──
          GOV.UK ("qué ocurre después" en la confirmación) · Brookings (el proceso
          no terminó) · HAX G16 (consecuencia de NO actuar). Fechas alineadas con
          `/proceso`. Solo condición A. */}
      {!esControl && asignado && !sinAsignacion && (
        <Card className="card--module" style={{ marginTop: 16 }}>
          <CardHeader>
            <CardTitle>Qué sigue ahora</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="seg-next-list">
              <li>
                <strong>Ahora:</strong> acepta o rechaza tu asignación, entre el
                <strong> 15 y el 21 de octubre de 2026</strong>.
              </li>
              <li>
                <strong>Si aceptas:</strong> matricúlate en persona en {asignado.nombre} entre el
                <strong> 9 y el 22 de diciembre de 2026</strong>.
              </li>
              <li>
                <strong>Si quieres seguir intentando</strong> por un colegio que estaba más arriba en
                tu lista: puedes volver a postular en el <strong>Periodo Complementario</strong> (10 al
                17 de noviembre), con los colegios que aún tengan vacantes.
              </li>
            </ol>
            <p className="seg-next-alerta" role="note">
              ⏰ Si no entras a esta página antes del <strong>21 de octubre</strong>, el sistema
              acepta la asignación automáticamente.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Explicación contextualizada ──
          F3: es el núcleo de la condición A → no va en la de control (B solo
          muestra el colegio asignado, sin el porqué). */}
      {!esControl && explicacion && (
        <Card className="card--module" style={{ marginTop: 16 }}>
          <CardHeader>
            <CardTitle>¿Por qué te asignaron este colegio?</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Opción 2 (2026-09-10) — comparación de un vistazo antes de los
                párrafos. Si hay contraste (no quedó en su 1.ª opción), la tabla
                resume el porqué y la explicación completa queda en un desplegable. */}
            {comparacion ? (
              <>
                <table className="seg-porque-tabla">
                  <thead>
                    <tr>
                      <th scope="col">Colegio</th>
                      <th scope="col">Tu situación ahí</th>
                      <th scope="col">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparacion.map((f) => (
                      <tr key={f.idx} className={f.obtuvo ? 'seg-porque-tabla__ok' : ''}>
                        <td>
                          <strong>{f.nombre}</strong>
                          <span className="seg-porque-tabla__pref"> · tu {ORDINALES[f.idx - 1] ?? `N.º ${f.idx}`} opción</span>
                        </td>
                        <td>{f.situacion}</td>
                        <td>{f.obtuvo ? '✅ Cupo' : 'No alcanzó'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <details className="seg-porque-detalle">
                  <summary>Ver la explicación completa</summary>
                  <div className="result-explanation">
                    {explicacion.map((texto, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: texto }} />
                    ))}
                  </div>
                </details>
              </>
            ) : (
              <div className="result-explanation" aria-live="polite">
                {explicacion.map((texto, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: texto }} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Detalle por preferencia — rediseñado ── */}
      <Card className="card--module" style={{ marginTop: 16 }}>
        <CardHeader>
          <CardTitle>Detalle por preferencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="seg-pref-list" aria-label="Estado de cada colegio en tu lista">
            {resultado?.detalles?.map((d) => {
              const col = colegios.find((c) => c.id === d.id)
              const isAsignado = d.estado === 'asignado'
              return (
                <div
                  key={d.id}
                  className={`seg-pref-item ${isAsignado ? 'seg-pref-item--asignado' : ''}`}
                >
                  <div className="seg-pref-item__rank">
                    <span className="seg-pref-item__num">{d.idx}</span>
                  </div>
                  <div className="seg-pref-item__info">
                    <strong>{d.nombre}</strong>
                    <span className="seg-pref-item__sub">
                      {/* S22-11 (refinamiento): prioridad de ESTE colegio, no la global */}
                      {d.comuna} · demanda {d.demanda}
                      {d.nivel < 5 ? ` · ${d.prioridadLabel ?? prioridadLabels[d.nivel]}` : ''}
                    </span>
                  </div>
                  <div className="seg-pref-item__right">
                    {/* F3: en control solo se marca la preferencia asignada; el
                        diagnóstico por preferencia ("prioridad insuficiente"…) y el
                        % son explicabilidad. */}
                    {(!esControl || d.estado === 'asignado') && (
                      <span
                        className="seg-pref-item__estado"
                        style={{ color: estadoColor[d.estado] ?? 'var(--texto-suave)' }}
                      >
                        {esControl
                          ? '✅ Asignado'
                          : estadoLabel[d.estado] ?? d.estado}
                      </span>
                    )}
                    {!esControl && <span className="seg-pref-item__prob">{d.prob}%</span>}
                  </div>
                  {/* Botón para ver detalle del colegio */}
                  {col && (
                    <button
                      type="button"
                      className="seg-pref-item__toggle"
                      onClick={() => setDetalleAbierto(detalleAbierto === d.id ? null : d.id)}
                      aria-expanded={detalleAbierto === d.id}
                      aria-label={`${detalleAbierto === d.id ? 'Ocultar' : 'Ver'} detalle de ${d.nombre}`}
                    >
                      {detalleAbierto === d.id ? '▲' : '▼'}
                    </button>
                  )}
                  {detalleAbierto === d.id && col && (() => {
                    const vac = vacantesDeNivel(col, alumnoNivel)
                    return (
                    <div className="seg-pref-item__detail">
                      <p>📍 {col.direccion}, {col.comuna}</p>
                      <p>🕐 Jornada {(vac?.jornada ?? col.vacantes?.[0]?.jornada ?? 'no especificada').toLowerCase()}</p>
                      <p>{col.nee?.programa ? '♿ Con programa PIE' : 'Sin programa PIE'}</p>
                      {/* Opción 5 (2026-09-10) — los datos que EXPLICAN el % de este
                          colegio (HAX G2/G11). Van dentro del desplegable, no suman
                          carga en la vista principal. Solo condición A. */}
                      {!esControl && vac && (
                        <>
                          <p>👥 El año pasado: <strong>{vac.postulantesAnterior} postulantes</strong> para {vac.min}–{vac.max} vacantes en {vac.label}</p>
                          <p>🎟️ Tu prioridad aquí: <strong>{d.nivel < 5 ? (d.prioridadLabel ?? prioridadLabels[d.nivel]) : 'sin vínculo con este colegio'}</strong></p>
                        </>
                      )}
                      <Link
                        className="btn btn--secondary btn--mini"
                        to={`/colegio?id=${col.id}`}
                        style={{ marginTop: 8 }}
                      >
                        Ver ficha completa
                      </Link>
                    </div>
                    )
                  })()}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mensaje tranquilizador si no quedó en primera opción (no aplica al
          fallback sin cupo: ese caso lo cubre la explicación de arriba).
          F3: incluye strategy-proofness → no va en la condición de control. */}
      {!esControl && asignado && asignado.idx > 1 && !sinAsignacion && (
        <Card className="card--module" style={{ marginTop: 16 }}>
          <CardHeader>
            <CardTitle>¿Qué significa no quedar en tu primera opción?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              No quedar en tu primera opción no significa que el sistema falló. El SAE revisa todos
              los colegios de tu lista y te deja en el primero donde hay un cupo para tu situación —
              en tu caso, el <strong>{asignado.nombre}</strong>.
            </p>
            <p>
              {/* Opción 3 (2026-09-10) — contrafactual concreto con ESTA lista. Hace
                  verificable la propiedad de "el orden no perjudica" (caso_estudio §3.2),
                  que antes se afirmaba en abstracto. */}
              <strong>¿Y si hubieras ordenado la lista distinto?</strong> El resultado sería el mismo.
              Si hubieras puesto el {asignado.nombre} en primer lugar, habrías quedado igual ahí:
              cada colegio revisa tu postulación por separado, sin mirar en qué puesto de tu lista lo
              dejaste.
            </p>
            <p>
              Por eso poner primero el colegio que más quieres <strong>nunca te perjudica</strong>. El
              resultado se basa solo en las prioridades que fija la Ley de Inclusión y en las vacantes
              disponibles.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Acciones y comprobante ── */}
      <div className="seg-actions-bar">
        <button type="button" className="btn btn--primary" onClick={descargarComprobante}>
          📄 Descargar comprobante
        </button>
        <Link className="btn btn--secondary" to="/calendario">
          📅 Ver calendario del proceso
        </Link>
        <Link className="btn btn--secondary" to={asignado ? `/colegio?id=${asignado.id}` : '#'}>
          🏫 Ver ficha del colegio asignado
        </Link>
      </div>

      {/* Cancelar postulación */}
      <details className="seg-cancel-section" style={{ marginTop: 24 }}>
        <summary className="seg-cancel-summary">
          Cancelar mi postulación
        </summary>
        <div className="seg-cancel-body">
          {!pedirConfirmacion ? (
            <>
              <p>
                Si cancelas, tu postulación quedará eliminada y deberás volver a realizarla
                desde cero antes del cierre del período.
              </p>
              <button
                type="button"
                className="btn btn--secondary btn--dark"
                style={{ borderColor: 'var(--rojo)', color: 'var(--rojo)' }}
                onClick={() => setPedirConfirmacion(true)}
              >
                Quiero cancelar mi postulación
              </button>
            </>
          ) : (
            <div
              className="sim-result"
              role="alertdialog"
              aria-labelledby="confirm-cancel-titulo"
              aria-describedby="confirm-cancel-desc"
              style={{ background: 'var(--rojo-cl)', borderColor: 'var(--rojo)' }}
            >
              <h3 id="confirm-cancel-titulo" style={{ color: 'var(--rojo)' }}>
                ⚠ ¿Seguro que quieres cancelar?
              </h3>
              <p id="confirm-cancel-desc">
                Esta acción <strong>no se puede deshacer</strong>. Tu postulación y tu lista de colegios
                quedarán eliminadas.
              </p>
              <div className="hero__actions" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn--primary"
                  style={{ background: 'var(--rojo)', borderColor: 'var(--rojo)' }}
                  onClick={cancelarPostulacion}
                >
                  Sí, cancelar
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setPedirConfirmacion(false)}
                  autoFocus
                >
                  No, mantener
                </button>
              </div>
            </div>
          )}
        </div>
      </details>
    </main>
  )
}
