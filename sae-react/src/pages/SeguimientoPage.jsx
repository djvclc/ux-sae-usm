import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { colegios } from '../data/colegios'
import { prioridadLabels } from '../utils/asignacion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SchoolIllustration from '../components/SchoolIllustration'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'

const STORAGE_KEY = 'sae_react_postulacion'

/* Etapas del proceso SAE con estado visual */
const ETAPAS_PROCESO = [
  { id: 'postulacion', icon: '📝', label: 'Postulación', desc: 'Enviaste tu lista de colegios' },
  { id: 'validacion', icon: '🔍', label: 'Validación', desc: 'El sistema verificó tus datos y prioridades' },
  { id: 'asignacion', icon: '⚙️', label: 'Asignación', desc: 'El algoritmo procesó todas las postulaciones' },
  { id: 'resultado', icon: '🎓', label: 'Resultado', desc: 'Tu resultado está listo para revisarlo' },
]

/* Genera la explicacion contextualizada del resultado en terminos del usuario.
   S22-11 (refinamiento): la prioridad se explica según el nivel REAL en el
   colegio asignado (asignado.nivel), no según una prioridad global del perfil —
   hermano/funcionario/exalumno solo valen en el colegio donde hay ese vínculo. */
function generarExplicacion(asignado) {
  if (!asignado) return null

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
        `Quedaste en el <strong>${asignado.nombre}</strong> a través del <strong>sorteo público y transparente</strong>. En ese colegio no tenías una prioridad especial, así que entraste al desempate aleatorio que hace cada colegio cuando hay más postulantes que vacantes.`
      )
  }

  if (asignado.idx > 1) {
    partes.push(
      `No quedaste en tus primeras ${asignado.idx - 1} opcion${asignado.idx > 2 ? 'es' : ''} porque ese colegio tenía más postulantes con prioridad mayor o no había vacantes disponibles para tu nivel de prioridad.`
    )
  } else {
    partes.push('¡Quedaste en tu primera opción!')
  }

  partes.push(
    `La probabilidad estimada para este colegio con tu perfil era de <strong>${asignado.prob}%</strong>.`
  )

  return partes
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
      `Prioridad: ${prioridadLabels[resultado?.nivel]}`,
      '',
      '── RESULTADO ──',
      asignado ? `Colegio asignado: ${asignado.nombre}` : 'Sin asignación',
      asignado ? `Preferencia N°${asignado.idx}` : '',
      '',
      '── LISTA DE POSTULACIÓN ──',
      ...resultado?.detalles?.map((d) => `  ${d.idx}. ${d.nombre} (${d.comuna}) — ${estadoLabel[d.estado]?.replace(/[^\w\sáéíóúñ/]/g, '').trim() ?? d.estado}`) ?? [],
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
            <Link className="btn btn--secondary" to="/algoritmo">
              ¿Cómo funciona?
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const { resultado, comprobante } = data
  const asignado = resultado?.asignado
  const explicacion = generarExplicacion(asignado)
  const colegioAsignado = asignado ? colegios.find((c) => c.id === asignado.id) : null

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

      {/* ── Tarjeta principal del resultado ── */}
      <div className="seg-result-hero" ref={comprobanteRef}>
        {asignado && colegioAsignado ? (
          <>
            {/* Ilustración + info del colegio asignado */}
            <div className="seg-hero-img-wrap">
              <SchoolIllustration
                colegioId={colegioAsignado.id}
                demanda={colegioAsignado.demanda}
                width="100%"
                height={200}
              />
              <div className="seg-hero-img-content seg-hero-img-content--solid">
                <span className="seg-hero-badge">Resultado disponible</span>
                <span className="seg-hero-pref">
                  {asignado.idx === 1 ? '⭐ Tu primera opción' : `Preferencia N°${asignado.idx}`}
                </span>
                <h2 className="seg-hero-name">{asignado.nombre}</h2>
                <p className="seg-hero-addr">
                  {'📍 ' + colegioAsignado.direccion + ', ' + colegioAsignado.comuna}
                </p>
              </div>
            </div>

            {/* Stats debajo de la imagen */}
            <div className="seg-hero-stats-bar">
              <div className="seg-hero-stat">
                <span className="seg-hero-stat__num">{asignado.prob}%</span>
                <span className="seg-hero-stat__lbl">Probabilidad</span>
              </div>
              <div className="seg-hero-stat">
                <span className="seg-hero-stat__num">{prioridadLabels[resultado?.nivel]?.split('/')[0] ?? '—'}</span>
                <span className="seg-hero-stat__lbl">Prioridad</span>
              </div>
              <div className="seg-hero-stat">
                <span className="seg-hero-stat__num" style={{ textTransform: 'capitalize' }}>{asignado.demanda}</span>
                <span className="seg-hero-stat__lbl">Demanda</span>
              </div>
              <div className="seg-hero-stat">
                <span className="seg-hero-stat__num">{comprobante}</span>
                <span className="seg-hero-stat__lbl">Comprobante</span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: 'var(--esp-lg)', textAlign: 'center' }}>
            <p>Sin asignación disponible.</p>
          </div>
        )}

        <div className="seg-result-hero__meta">
          <span>Prioridad aplicada: <strong>{prioridadLabels[resultado?.nivel]}</strong></span>
          <span>Fecha postulación: <strong>{new Date(data.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
        </div>
      </div>

      {/* ── Acción: Aceptar o rechazar oferta ── */}
      {asignado && !ofertaAceptada && (
        <Card className="seg-action-card">
          <CardContent>
            <h3 style={{ margin: '0 0 8px', color: 'var(--acento)' }}>¿Aceptas esta asignación?</h3>
            <p style={{ margin: '0 0 16px', color: 'var(--texto-suave)', fontSize: '0.92rem' }}>
              Tienes hasta el <strong>15 de noviembre de 2026</strong> para aceptar o rechazar.
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
          </CardContent>
        </Card>
      )}

      {ofertaAceptada === 'aceptada' && (
        <div className="seg-accept-msg seg-accept-msg--ok" role="status">
          <span className="seg-accept-msg__icon">🎉</span>
          <div>
            <strong>¡Asignación aceptada!</strong>
            <p style={{ margin: '4px 0 0' }}>
              Ahora debes completar la matrícula en el establecimiento antes del
              <strong> 30 de noviembre de 2026</strong>.
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

      {/* ── Explicación contextualizada ── */}
      {explicacion && (
        <Card className="card--module" style={{ marginTop: 16 }}>
          <CardHeader>
            <CardTitle>¿Por qué te asignaron este colegio?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="result-explanation" aria-live="polite">
              {explicacion.map((texto, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: texto }} />
              ))}
            </div>
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
                    <span
                      className="seg-pref-item__estado"
                      style={{ color: estadoColor[d.estado] ?? 'var(--texto-suave)' }}
                    >
                      {estadoLabel[d.estado] ?? d.estado}
                    </span>
                    <span className="seg-pref-item__prob">{d.prob}%</span>
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
                  {detalleAbierto === d.id && col && (
                    <div className="seg-pref-item__detail">
                      <p>📍 {col.direccion}, {col.comuna}</p>
                      <p>🕐 Jornada {col.vacantes?.[0]?.jornada?.toLowerCase() ?? 'no especificada'}</p>
                      <p>{col.nee?.programa ? '♿ Con programa PIE' : 'Sin programa PIE'}</p>
                      <Link
                        className="btn btn--secondary btn--mini"
                        to={`/colegio?id=${col.id}`}
                        style={{ marginTop: 8 }}
                      >
                        Ver ficha completa
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mensaje tranquilizador si no quedó en primera opción */}
      {asignado && asignado.idx > 1 && (
        <Card className="card--module" style={{ marginTop: 16 }}>
          <CardHeader>
            <CardTitle>¿Qué significa no quedar en tu primera opción?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              No quedar en la primera opción no significa que el sistema falló. El SAE evalúa todos
              los colegios de tu lista en orden. Quedaste en la opción {asignado.idx} porque es
              donde había cupos disponibles para tu perfil.
            </p>
            <p>
              El resultado es <strong>objetivo y transparente</strong>: se basa en las prioridades
              definidas por la Ley de Inclusión y en la disponibilidad de vacantes.
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
