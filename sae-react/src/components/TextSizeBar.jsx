import { useTextSize } from '../context/TextSizeContext'

/**
 * Barra de contexto compartida — muestra en qué página está el usuario
 * y permite cambiar el tamaño del texto (Normal / Grande).
 * Cumple S14-b: control de accesibilidad visible y persistente.
 */
export default function TextSizeBar({ pageName }) {
  const { textoGrande, setTextoGrande } = useTextSize()

  return (
    <div className="context-bar" role="status" aria-live="polite">
      <div className="context-bar__inner">
        <p>
          Estas en: <strong>{pageName}</strong>
        </p>
        <div className="context-bar__text-size">
          <span>Tamano de texto</span>
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
