// ProbabilidadVisual — representación visual del formato de frecuencia
// P1 · S22-11 (refinamiento): RISK-NUM / PAIR-ET
// (docs/investigacion/investigacion_ux_guide_ai_systems.md §6 y §3).
// Acompaña —no reemplaza— al texto y a la categoría cualitativa (alta/media/baja).
// Muestra la MISMA cifra que devuelve probAsignacion() como "X de cada 100":
//   - variante "barra": barra proporcional segmentada, compacta (espacios angostos).
//   - variante "grid":  icon array de 10×10 celdas (cuando hay más aire).
// Sin dependencias nuevas: solo CSS/DOM. El dibujo es decorativo (aria-hidden);
// la cifra en palabras va en el aria-label del contenedor (role="img") y en un
// texto visible, para no depender del color (relleno + borde + número).

function claseProb(prob) {
  return prob >= 80 ? 'alta' : prob >= 60 ? 'media' : 'baja'
}

export default function ProbabilidadVisual({ prob, sentencia, variante = 'barra' }) {
  const n = Math.max(0, Math.min(100, Math.round(prob)))
  const clase = claseProb(n)

  return (
    <div
      className={`probviz probviz--${variante} probviz--${clase}`}
      role="img"
      aria-label={sentencia}
    >
      <span className="probviz__resumen" aria-hidden="true">
        <span className="probviz__resumen-num">{n}</span> de cada 100 postulantes
      </span>

      {variante === 'grid' ? (
        <div className="probviz__grid" aria-hidden="true">
          {Array.from({ length: 100 }, (_, i) => (
            <span
              key={i}
              className={`probviz__cell${i < n ? ' probviz__cell--on' : ''}`}
            />
          ))}
        </div>
      ) : (
        <div className="probviz__bar" aria-hidden="true">
          <div className="probviz__bar-fill" style={{ width: `${n}%` }} />
        </div>
      )}
    </div>
  )
}
