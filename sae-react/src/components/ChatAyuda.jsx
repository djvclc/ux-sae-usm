import { useState } from 'react'

const PREGUNTAS = [
  {
    q: '¿Qué es el SAE?',
    a: 'El SAE (Sistema de Admisión Escolar) es el mecanismo oficial del Ministerio de Educación para postular a colegios públicos y particulares subvencionados de Chile. Funciona con reglas claras definidas por la Ley de Inclusión.',
  },
  {
    q: '¿Cómo funciona la asignación?',
    a: 'El sistema cruza tus preferencias (los colegios que elegiste, en orden) con las prioridades de cada colegio (hermanos, cercanía, estudiante prioritario). Si hay más postulantes que vacantes, se realiza un sorteo público y transparente.',
  },
  {
    q: '¿Qué prioridades existen?',
    a: 'Las prioridades por ley son: 1) Hermano/a matriculado/a en el colegio, 2) Estudiante prioritario/a (SEP, hasta el 15%), 3) Hijo/a de funcionario/a del establecimiento, 4) Exalumno/a. Si nadie tiene prioridad, se decide por sorteo.',
  },
  {
    q: '¿Qué pasa si no quedo en mi primera opción?',
    a: 'El sistema sigue evaluando tus otras opciones en orden. Si no quedas en ninguna, pasas a la lista de espera. Esto no significa que el sistema falló — simplemente había más demanda que vacantes en esos colegios.',
  },
  {
    q: '¿Necesito ClaveÚnica para postular?',
    a: 'ClaveÚnica es la forma más rápida y segura de ingresar, ya que carga tus datos automáticamente. Si no tienes RUN chileno, puedes crear una cuenta SAE con tu identificador provisorio (IPA).',
  },
  {
    q: '¿Puedo cambiar mi postulación?',
    a: 'Sí, puedes modificar tu lista de colegios y su orden cuantas veces quieras dentro del período de postulación. Solo cuenta la última versión que confirmes antes del cierre.',
  },
  {
    q: '¿Cuántos colegios puedo elegir?',
    a: 'Puedes postular a un mínimo de 1 y un máximo de 8 colegios. Te recomendamos agregar varios — mientras más opciones incluyas, más posibilidades tienes de quedar en uno que te guste.',
  },
  {
    q: '¿El SAE es una tómbola?',
    a: 'No. El SAE aplica prioridades definidas por ley antes de cualquier sorteo. Solo cuando varios postulantes tienen las mismas condiciones y no hay vacantes para todos, se realiza un sorteo público, presenciado por un notario. Es transparente y objetivo.',
  },
]

export default function ChatAyuda() {
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState([
    { tipo: 'bot', texto: '¡Hola! Soy el asistente del SAE. ¿En qué puedo ayudarte? Elige una pregunta:' },
  ])
  const [preguntasUsadas, setPreguntasUsadas] = useState([])

  const preguntasDisponibles = PREGUNTAS.filter((_, i) => !preguntasUsadas.includes(i))

  const elegirPregunta = (idx) => {
    const p = PREGUNTAS[idx]
    setMensajes((prev) => [
      ...prev,
      { tipo: 'user', texto: p.q },
      { tipo: 'bot', texto: p.a },
    ])
    setPreguntasUsadas((prev) => [...prev, idx])

    // Scroll al fondo del chat
    setTimeout(() => {
      const el = document.getElementById('chat-mensajes')
      if (el) el.scrollTop = el.scrollHeight
    }, 50)
  }

  const reiniciar = () => {
    setMensajes([
      { tipo: 'bot', texto: '¡Hola! Soy el asistente del SAE. ¿En qué puedo ayudarte? Elige una pregunta:' },
    ])
    setPreguntasUsadas([])
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        className="chat-fab"
        onClick={() => setAbierto((p) => !p)}
        aria-label={abierto ? 'Cerrar chat de ayuda' : 'Abrir chat de ayuda'}
        aria-expanded={abierto}
      >
        {abierto ? '✕' : '💬'}
      </button>

      {/* Panel del chat */}
      {abierto && (
        <div className="chat-panel" role="dialog" aria-label="Chat de ayuda del SAE">
          <div className="chat-panel__header">
            <span className="chat-panel__title">Ayuda SAE</span>
            <span className="chat-panel__sub">Lun–Vie 09:00–18:00</span>
          </div>

          <div className="chat-panel__body" id="chat-mensajes">
            {mensajes.map((m, i) => (
              <div key={i} className={`chat-msg chat-msg--${m.tipo}`}>
                {m.texto}
              </div>
            ))}

            {/* Opciones de pregunta */}
            {preguntasDisponibles.length > 0 && (
              <div className="chat-opciones">
                {PREGUNTAS.map((p, i) =>
                  preguntasUsadas.includes(i) ? null : (
                    <button
                      key={i}
                      type="button"
                      className="chat-opcion"
                      onClick={() => elegirPregunta(i)}
                    >
                      {p.q}
                    </button>
                  )
                )}
              </div>
            )}

            {preguntasDisponibles.length === 0 && (
              <div className="chat-msg chat-msg--bot">
                ¡Listo! Ya respondí todas las preguntas frecuentes. Si necesitas más ayuda, llama al
                <strong> 600 600 2626</strong> o visita la Oficina OIRS.
                <button type="button" className="chat-reiniciar" onClick={reiniciar}>
                  Empezar de nuevo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
