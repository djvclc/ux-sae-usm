import { useTextSize } from '../context/TextSizeContext'

/**
 * Barra de contexto compartida — muestra en qué página está el usuario
 * y permite cambiar el tamaño del texto (Normal / Grande).
 * Cumple S14-b: control de accesibilidad visible y persistente.
 *
 * 2026-10-05 (feedback del usuario: "Estás en: Postulación" + el título
 * "Postulación" justo debajo era redundante): `pageName` es opcional. Sin él,
 * la barra muestra solo el control de tamaño de texto, alineado a la derecha.
 */
export default function TextSizeBar({ pageName }) {
  const { textoGrande, setTextoGrande } = useTextSize()

  return (
    <div className={`context-bar${pageName ? '' : ' context-bar--sin-ubicacion'}`} role="status" aria-live="polite">
      <div className="context-bar__inner">
        {pageName && (
          <p>
            Estás en: <strong>{pageName}</strong>
          </p>
        )}
        <div className="context-bar__text-size">
          <span>Tamaño de texto</span>
          <button
            type="button"
            className={!textoGrande ? 'is-on' : ''}
            onClick={() => setTextoGrande(false)}
            aria-pressed={!textoGrande}
          >
            Normal
          </button>
          <button
            type="button"
            className={textoGrande ? 'is-on' : ''}
            onClick={() => setTextoGrande(true)}
            aria-pressed={textoGrande}
          >
            Grande
          </button>
        </div>
      </div>
    </div>
  )
}
