import { useState, useEffect, useRef } from 'react'

// Visualización animada del algoritmo (2026-08-06, mejora de AlgoritmoPage)
// Reutilizable: recibe resultado y perfil.
// Sin nuevas dependencias — animación temporal nativa con useEffect + tiemporiz.

export default function AlgoSimuladorPasos({ resultado, perfil }) {
  const [reproduciendose, setReproduciendose] = useState(false)
  const [pasoActual, setPasoActual] = useState(-1)
  const refDebeDetener = useRef(false)

  const iniciarReproduccion = () => {
    refDebeDetener.current = false
    setReproduciendose(true)
    setPasoActual(0)
  }

  const reiniciar = () => {
    refDebeDetener.current = false
    setReproduciendose(false)
    setPasoActual(-1)
  }

  // Temporizador: avanza cada 1.5s hasta terminar
  useEffect(() => {
    if (!reproduciendose || pasoActual === -1) {
      refDebeDetener.current = false
      return
    }

    const totalPasos = resultado.detalles.length
    const detalleActual = resultado.detalles[pasoActual]

    // Verificar si deberemos detener en el siguiente renderizado
    const debeDetener =
      detalleActual.estado === 'asignado' || pasoActual === totalPasos - 1

    if (debeDetener) {
      refDebeDetener.current = true
      // Detener en el siguiente render sin setState aquí
      setTimeout(() => {
        setReproduciendose(false)
      }, 0)
      return
    }

    // Schedular el siguiente paso después de 1.5s
    const timer = setTimeout(() => {
      setPasoActual((prev) => prev + 1)
    }, 1500)

    return () => clearTimeout(timer)
  }, [reproduciendose, pasoActual, resultado])

  const estadoEmoji = {
    asignado: '✅',
    no_evaluado: '⏭',
    sin_cupos: '🔴',
    prioridad_insuficiente: '🟡',
  }

  const estadoTexto = {
    asignado: 'Asignado aquí',
    no_evaluado: 'No evaluado',
    sin_cupos: 'Sin cupos',
    prioridad_insuficiente: 'Prioridad insuficiente',
  }

  const perfilLabel = () => {
    if (perfil?.hermano) return 'Hermano/a matriculado/a (Prioridad 1)'
    if (perfil?.prioritario) return 'Estudiante prioritario/a — SEP (Prioridad 2)'
    if (perfil?.funcionario) return 'Hijo/a de funcionario/a (Prioridad 3)'
    if (perfil?.exalumno) return 'Exalumno/a del establecimiento (Prioridad 4)'
    return 'Sin prioridades especiales (Sorteo público)'
  }

  const asignado = resultado.asignado
  const yaInicio = reproduciendose || pasoActual > -1

  return (
    <section className="algo-pasos-viz" aria-label="Reproducción paso a paso del algoritmo">
      <h2>Reproducir el algoritmo paso a paso</h2>
      {/* S13 (refinamiento) · auditoría NN/g: describir el procesamiento como
          aplicación de reglas sobre datos, no como una "elección" del sistema. */}
      <p className="algo-pasos-viz__intro">
        Mira cómo el sistema revisa tus colegios en el orden que tú elegiste. En cada uno
        aplica las prioridades que fija la ley y cuenta los cupos disponibles, hasta
        asignarte uno.
      </p>

      {/* Botón para iniciar reproducción */}
      {!yaInicio ? (
        <button
          type="button"
          className="btn btn--primary algo-pasos-viz__btn-reproducir"
          onClick={iniciarReproduccion}
          aria-label="Reproducir la visualización paso a paso del algoritmo"
        >
          ▶️ Reproducir el algoritmo
        </button>
      ) : null}

      {/* Información del perfil + Tabla animada */}
      {yaInicio ? (
        <div className="algo-pasos-viz__contenido" aria-live="polite" aria-atomic="false">
          <div className="algo-pasos-viz__perfil">
            <p>
              <strong>Tu perfil:</strong> {perfilLabel()}
            </p>
          </div>

          <table className="algo-pasos-tabla">
            <thead>
              <tr>
                <th scope="col">Paso</th>
                <th scope="col">Colegio</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              {resultado.detalles.map((detalle, idx) => {
                const esVisible = idx <= pasoActual
                const esActual = idx === pasoActual && reproduciendose

                return (
                  <tr
                    key={detalle.id}
                    className={`algo-pasos-row${esVisible ? ' algo-pasos-row--visible' : ''}${
                      esActual ? ' algo-pasos-row--actual' : ''
                    }${detalle.estado === 'asignado' ? ' algo-pasos-row--asignado' : ''}`}
                    aria-label={`Paso ${detalle.idx}: ${detalle.nombre} (${detalle.comuna}) — ${estadoTexto[detalle.estado]}`}
                  >
                    <td className="algo-pasos-tabla__paso">
                      <span>{detalle.idx}</span>
                    </td>
                    <td className="algo-pasos-tabla__colegio">
                      <span className="algo-pasos-tabla__colegio-nombre">{detalle.nombre}</span>
                      <span className="algo-pasos-tabla__colegio-comuna">{detalle.comuna}</span>
                    </td>
                    <td className="algo-pasos-tabla__estado">
                      <span className="algo-pasos-tabla__estado-icon" aria-hidden="true">
                        {estadoEmoji[detalle.estado]}
                      </span>
                      <span>{estadoTexto[detalle.estado]}</span>
                      <span className="algo-pasos-tabla__prob"> ({detalle.prob}%)</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Info + botón de reinicio */}
          {!reproduciendose && pasoActual > -1 ? (
            <div className="algo-pasos-viz__resultado" aria-live="polite">
              {asignado ? (
                <div className="algo-pasos-viz__resultado-caja">
                  <p className="algo-pasos-viz__resultado-titulo">Tu resultado final:</p>
                  <p className="algo-pasos-viz__resultado-colegio">
                    <strong>{asignado.nombre}</strong> ({asignado.comuna})
                  </p>
                  <p className="algo-pasos-viz__resultado-detalle">
                    Opción N.° {asignado.idx} · Probabilidad: {asignado.prob}%
                  </p>
                </div>
              ) : null}

              <button
                type="button"
                className="btn btn--secondary"
                onClick={reiniciar}
                aria-label="Volver a reproducir desde el inicio"
              >
                ⟲ Volver a reproducir
              </button>
            </div>
          ) : null}

          {/* Mensaje durante reproducción */}
          {reproduciendose ? (
            <div className="algo-pasos-viz__reproduciendo" aria-live="polite">
              <p className="algo-pasos-viz__msg">
                ⏸ Reproduciendo… {pasoActual + 1} / {resultado.detalles.length}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
