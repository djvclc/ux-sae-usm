/* ── Pantalla del moderador para el estudio comparativo (F3) ──
 * NO la usa el/la participante. El moderador entra aquí antes de cada sesión,
 * ingresa el número de participante, y esta pantalla:
 *   1. calcula la condición (A/B) con el esquema balanceado,
 *   2. la fija en sessionStorage + limpia la sesión anterior (`fijarCondicion`),
 *   3. redirige a "/" SIN query, para que el participante no vea "control" en la barra.
 * Ver `docs/planificacion/f3_modo_control_inventario.md`.
 */
import { useState } from 'react'
import { fijarCondicion, useModoEstudio } from '../context/ModoEstudioContext'

/* Esquema de asignación a condición. Alternancia por paridad del número de
 * participante: impares → A (prototipo completo), pares → B (control).
 * Se define ANTES de reclutar; si se quiere estratificar por la covariable de
 * experiencia previa con el SAE, se cambia aquí. */
function condicionDe(n) {
  return n % 2 === 1 ? 'A' : 'B'
}

export default function EstudioPage() {
  const { condicion, modo } = useModoEstudio()
  const [n, setN] = useState('')
  const num = Number(n)
  const valido = Number.isInteger(num) && num > 0
  const cond = valido ? condicionDe(num) : null

  const empezar = () => {
    if (!valido) return
    fijarCondicion(cond, num)
    // Recarga completa a "/" para limpiar el estado React de las páginas.
    window.location.href = '/'
  }

  return (
    <main className="page" style={{ maxWidth: 560 }}>
      <h1>Estudio comparativo — panel del moderador</h1>
      <p className="page__lead">
        Uso interno. No mostrar esta pantalla al/la participante.
      </p>

      <div
        style={{
          border: '1px solid var(--gris-borde, #d0d7e2)',
          borderRadius: 8,
          padding: 20,
          marginTop: 16,
        }}
      >
        <label htmlFor="estudio-n" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
          Número de participante
        </label>
        <input
          id="estudio-n"
          type="number"
          min="1"
          inputMode="numeric"
          value={n}
          onChange={(e) => setN(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && empezar()}
          style={{ fontSize: '1.1rem', padding: '8px 10px', width: 140 }}
          autoFocus
        />

        {valido && (
          <p style={{ marginTop: 14, fontSize: '1.05rem' }}>
            Participante <strong>{num}</strong> &rarr; Condición{' '}
            <strong style={{ color: cond === 'A' ? 'var(--verde)' : 'var(--naranja)' }}>
              {cond === 'A' ? 'A — prototipo completo (explica el algoritmo)' : 'B — control (sin explicación)'}
            </strong>
          </p>
        )}

        <button
          type="button"
          className="btn btn--primary"
          onClick={empezar}
          disabled={!valido}
          style={{ marginTop: 12 }}
        >
          Empezar la sesión &rarr; ir a Inicio
        </button>
      </div>

      <p style={{ marginTop: 18, fontSize: '0.9rem', color: 'var(--texto-suave, #555)' }}>
        Estado actual de esta pestaña: modo <code>{modo}</code> (condición {condicion}). Se aplica al
        pulsar &laquo;Empezar&raquo;. La lista de 6 colegios y su orden se entregan en papel, no por
        aquí. Esquema de asignación: impares &rarr; A, pares &rarr; B.
      </p>

      <p style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--texto-suave, #777)' }}>
        Para volver al prototipo completo fuera del estudio: abre{' '}
        <code>/estudio</code> con un número impar, o navega con <code>?modo=full</code>.
      </p>
    </main>
  )
}
