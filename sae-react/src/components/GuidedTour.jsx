import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { tourPasos, useTour } from '../context/TourContext'

const TOOLTIP_W = 340
const PAD = 10     // padding around spotlight
const GAP = 14     // gap entre spotlight y tooltip
const MIN_SPACE = 180 // espacio mínimo para mostrar el tooltip arriba/abajo

/* Calcula la posición del tooltip.
   Usa CSS `bottom` cuando hay más espacio arriba (el tooltip crece hacia arriba),
   así nunca se cortan los botones sin importar cuánto contenido tenga. */
function calcTooltipPos(spot) {
  if (!spot) {
    return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: Math.min(TOOLTIP_W, window.innerWidth - 32) }
  }

  const vh = window.innerHeight
  const vw = window.innerWidth
  const w = Math.min(TOOLTIP_W, vw - 32)

  // Posición horizontal: centrar sobre el spotlight, clipear a la pantalla
  let left = spot.left + spot.width / 2 - w / 2
  left = Math.max(16, Math.min(vw - w - 16, left))

  const spaceAbove = spot.top - GAP
  const spaceBelow = vh - (spot.top + spot.height) - GAP

  // Si no hay espacio suficiente ni arriba ni abajo → centrar en pantalla
  if (spaceAbove < MIN_SPACE && spaceBelow < MIN_SPACE) {
    return { position: 'fixed', top: '50%', left, transform: 'translateY(-50%)', width: w }
  }

  if (spaceBelow >= spaceAbove) {
    // Más espacio abajo → tooltip debajo del spotlight
    return {
      position: 'fixed',
      top: Math.max(8, spot.top + spot.height + GAP),
      left,
      width: w,
      maxHeight: Math.max(spaceBelow - 8, MIN_SPACE),
    }
  } else {
    // Más espacio arriba → anclar por `bottom` para que crezca hacia arriba
    // `bottom` en fixed = distancia desde el borde inferior del viewport
    return {
      position: 'fixed',
      bottom: Math.max(8, vh - spot.top + GAP),
      left,
      width: w,
      maxHeight: Math.max(spaceAbove - 8, MIN_SPACE),
    }
  }
}

export default function GuidedTour() {
  const { isActive, currentStep, nextStep, prevStep, endTour } = useTour()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [spot, setSpot] = useState(null)   // spotlight rect (viewport coords)
  const [ready, setReady] = useState(false)
  const pollRef = useRef(null)
  const paso = tourPasos[currentStep]

  /* Navegar a la página del paso cuando cambia currentStep */
  useEffect(() => {
    if (!isActive || !paso) return
    if (pathname !== paso.page) {
      navigate(paso.page)
    }
  }, [isActive, currentStep]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Buscar el elemento objetivo en el DOM (con reintentos tras navegación).
     El reinicio síncrono del spotlight al cambiar de paso es deliberado:
     sincroniza el estado con el DOM externo (polling con querySelector). */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isActive || !paso) return

    setSpot(null)
    setReady(false)
    clearInterval(pollRef.current)

    if (!paso.selector || paso.centrado) {
      setReady(true)
      return
    }

    // El elemento puede no estar aún en el DOM tras la navegación — hacemos polling
    let attempts = 0
    pollRef.current = setInterval(() => {
      attempts++
      const el = document.querySelector(paso.selector)
      if (el) {
        clearInterval(pollRef.current)
        // Hacer scroll suave al elemento y luego tomar las coordenadas
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => {
          const r = el.getBoundingClientRect()
          setSpot({
            top: r.top - PAD,
            left: r.left - PAD,
            width: r.width + PAD * 2,
            height: r.height + PAD * 2,
          })
          setReady(true)
        }, 380)
      } else if (attempts > 20) {
        clearInterval(pollRef.current)
        setReady(true) // fallback: mostrar tooltip igual
      }
    }, 100)

    return () => clearInterval(pollRef.current)
  }, [isActive, currentStep, pathname]) // eslint-disable-line react-hooks/exhaustive-deps -- re-ejecuta cuando cambia la página
  /* eslint-enable react-hooks/set-state-in-effect */

  /* Recalcular spotlight en scroll y resize — el elemento se mueve con la página */
  useEffect(() => {
    if (!isActive || !ready || !paso?.selector || paso?.centrado) return

    const update = () => {
      const el = document.querySelector(paso.selector)
      if (!el) return
      const r = el.getBoundingClientRect()
      setSpot({
        top: r.top - PAD,
        left: r.left - PAD,
        width: r.width + PAD * 2,
        height: r.height + PAD * 2,
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [isActive, currentStep, paso, ready])

  /* Cerrar con Escape */
  useEffect(() => {
    if (!isActive) return
    const onKey = (e) => { if (e.key === 'Escape') endTour() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isActive, endTour])

  if (!isActive || !paso || !ready) return null

  const tooltipStyle = calcTooltipPos(spot)
  const esPrimero = currentStep === 0
  const esUltimo = currentStep === tourPasos.length - 1

  return (
    <>
      {/* Overlay semitransparente — clic fuera cierra el tour */}
      <div
        className="tour-overlay"
        role="presentation"
        aria-hidden="true"
        onClick={endTour}
      />

      {/* Spotlight: agujero luminoso sobre el elemento objetivo */}
      {spot && (
        <div
          className="tour-spotlight"
          aria-hidden="true"
          style={{ top: spot.top, left: spot.left, width: spot.width, height: spot.height }}
        />
      )}

      {/* Tooltip con explicación */}
      <div
        className="tour-tooltip"
        role="dialog"
        aria-modal="true"
        aria-label={`Paso ${currentStep + 1} de ${tourPasos.length}: ${paso.titulo}`}
        style={tooltipStyle}
      >
        {/* Barra de progreso de pasos */}
        <div className="tour-progress" aria-label={`Paso ${currentStep + 1} de ${tourPasos.length}`}>
          {tourPasos.map((_, i) => (
            <span
              key={i}
              className={`tour-dot${i === currentStep ? ' tour-dot--on' : i < currentStep ? ' tour-dot--done' : ''}`}
              aria-hidden="true"
            />
          ))}
          <span className="tour-progress__label">{currentStep + 1} / {tourPasos.length}</span>
        </div>

        <h3 className="tour-tooltip__titulo">{paso.titulo}</h3>
        <p className="tour-tooltip__contenido">{paso.contenido}</p>

        {paso.tip && (
          <div className="tour-tooltip__tip" role="note">
            {paso.tip}
          </div>
        )}

        <div className="tour-acciones">
          {!esPrimero && (
            <button
              type="button"
              className="tour-btn tour-btn--sec"
              onClick={prevStep}
              aria-label="Ir al paso anterior"
            >
              ← Anterior
            </button>
          )}
          <button
            type="button"
            className="tour-btn tour-btn--ghost"
            onClick={endTour}
            aria-label="Saltar el tour"
          >
            Saltar
          </button>
          {esUltimo ? (
            <button
              type="button"
              className="tour-btn tour-btn--pri"
              onClick={endTour}
              aria-label="Terminar el tour"
            >
              ¡Listo! 🎉
            </button>
          ) : (
            <button
              type="button"
              className="tour-btn tour-btn--pri"
              onClick={nextStep}
              aria-label="Ir al siguiente paso"
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </>
  )
}
