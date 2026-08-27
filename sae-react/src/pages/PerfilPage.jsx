import { useState } from 'react'
import { Link } from 'react-router-dom'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'
import { formatearRut, rutValido } from '../utils/rut'

/* S4 (refinamiento — arquitectura de información):
   /perfil es la FUENTE ÚNICA de los datos a nivel estudiante.
   Contrato de datos en localStorage['sae_react_perfil'] (PERFIL_KEY):
     {
       nombre: string,          // nombre del/la estudiante
       rut: string,             // formato "12.345.678-9" (helper src/utils/rut.js)
       nivel: string,           // mismo vocabulario que el <select> del paso 1 de
                                // /postulacion ("Prekínder", "Kínder", "1° básico"… "4° medio")
       prioritario: boolean,    // condición SEP — la DETERMINA EL ESTADO (Registro
                                // Social de Hogares), la familia NO la elige. Acá se
                                // activa solo para poder simular el caso de estudio.
     }
   `hermano`, `funcionario` y `exalumno` NO viven aquí: son vínculos con un
   establecimiento concreto y se declaran POR COLEGIO al postular (ver
   PostulacionPage.jsx paso 2, `prioridadesPorColegio`). Así /perfil y el flujo
   no piden lo mismo dos veces.

   PostulacionPage lee PERFIL_KEY como base (precarga nombre/RUT/nivel y muestra
   `prioritario` como información de solo lectura). Al confirmar, PostulacionPage
   sigue escribiendo el objeto combinado en 'sae_react_postulacion' (STORAGE_KEY)
   para que SeguimientoPage funcione igual. */
const PERFIL_KEY = 'sae_react_perfil'

// Mismo vocabulario de niveles que el <select> del paso 1 de /postulacion.
const niveles = [
  'Prekínder', 'Kínder',
  '1° básico', '2° básico', '3° básico', '4° básico',
  '5° básico', '6° básico', '7° básico', '8° básico',
  '1° medio', '2° medio', '3° medio', '4° medio',
]

export default function PerfilPage() {
  const { textoGrande } = useTextSize()
  // Carga perezosa del perfil guardado (evita setState dentro del efecto).
  const perfilInicial = (() => {
    try {
      const raw = localStorage.getItem(PERFIL_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch { return {} }
  })()
  const [nombre, setNombre] = useState(perfilInicial.nombre ?? '')
  const [rut, setRut] = useState(perfilInicial.rut ?? '')
  const [rutTocado, setRutTocado] = useState(false)
  const [nivel, setNivel] = useState(perfilInicial.nivel ?? '')
  // Compatibilidad: perfiles antiguos guardaban `condiciones.prioritario`.
  const [prioritario, setPrioritario] = useState(
    perfilInicial.prioritario ?? perfilInicial.condiciones?.prioritario ?? false,
  )
  const [guardado, setGuardado] = useState(false)

  const marcarSucio = () => setGuardado(false)

  const rutError =
    rutTocado && rut.length > 0 && !rutValido(rut)
      ? 'Formato incorrecto. Escribe el RUT así: 12.345.678-9 (con puntos y guión).'
      : null

  const guardar = () => {
    const payload = { nombre, rut, nivel, prioritario }
    localStorage.setItem(PERFIL_KEY, JSON.stringify(payload))
    setGuardado(true)
  }

  return (
    <main className={`page${textoGrande ? ' page--texto-grande' : ''}`}>
      <TextSizeBar pageName="Mis datos" />
      <h1 tabIndex={-1}>Mis datos</h1>
      <p className="page__lead">
        Estos son los datos del o la estudiante. El flujo de postulación los usa
        como punto de partida: así no tienes que escribirlos de nuevo.
      </p>

      {guardado && (
        <div className="perfil-aviso perfil-aviso--ok" role="status">
          ✅ Datos guardados en este dispositivo. El flujo de postulación ya los usa.
        </div>
      )}

      <div className="perfil-form">

        {/* Bloque 1 — Datos de la o el estudiante */}
        <section className="perfil-bloque">
          <h2>1. ¿Para quién postulas?</h2>
          <div className="perfil-campo">
            <label htmlFor="perf-nombre">Nombre de la o el estudiante</label>
            <input
              id="perf-nombre"
              type="text"
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); marcarSucio() }}
              placeholder="Ej: Sofía González"
              autoComplete="off"
            />
          </div>
          <div className="perfil-campo">
            <label htmlFor="perf-rut">RUT de la o el estudiante</label>
            <input
              id="perf-rut"
              type="text"
              inputMode="numeric"
              value={rut}
              onChange={(e) => { setRut(formatearRut(e.target.value)); marcarSucio() }}
              onBlur={() => setRutTocado(true)}
              placeholder="12.345.678-9"
              maxLength={12}
              aria-describedby="perf-rut-hint perf-rut-error"
              aria-invalid={rutError ? 'true' : undefined}
            />
            <span id="perf-rut-hint" className="small-note">Formato: 12.345.678-9 (con puntos y guión).</span>
            {rutError && (
              <span id="perf-rut-error" className="field-error" role="alert">⚠ {rutError}</span>
            )}
          </div>
          <div className="perfil-campo">
            <label htmlFor="perf-nivel">Nivel al que postula</label>
            <select
              id="perf-nivel"
              value={nivel}
              onChange={(e) => { setNivel(e.target.value); marcarSucio() }}
            >
              <option value="">Selecciona un nivel…</option>
              {niveles.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Bloque 2 — Condición que determina el Estado (SEP)
            S4 (refinamiento): la prioridad de estudiante prioritario/a NO es una
            casilla que la familia elige. La determina el MINEDUC con el Registro
            Social de Hogares. Se deja el interruptor solo para poder configurar el
            caso de estudio en la simulación. */}
        <section className="perfil-bloque">
          <h2>2. Condición de estudiante prioritario/a (SEP)</h2>
          <p className="small-note">
            Esta condición <strong>no la eliges tú</strong>. El Ministerio de
            Educación la determina según el{' '}
            <abbr title="Registro Social de Hogares">RSH</abbr> de tu familia. En el
            sistema real llega ya cargada y no aparece como una casilla.{' '}
            <strong>Aquí la activas solo para la simulación.</strong>
          </p>

          <div className="criterios-grid" role="group" aria-label="Condición de estudiante prioritario/a">
            <label className={`criterio-card${prioritario ? ' criterio-card--on' : ''}`}>
              <input
                type="checkbox"
                checked={prioritario}
                onChange={() => { setPrioritario((v) => !v); marcarSucio() }}
              />
              <div className="criterio-card__body">
                <span className="criterio-card__num" aria-hidden="true">SEP</span>
                <div>
                  <p className="criterio-card__titulo">
                    Simular que el MINEDUC me tiene registrado/a como estudiante prioritario/a
                  </p>
                  <p className="criterio-card__desc">
                    Si la activas, en la simulación cada colegio reservará el 15 % de
                    sus cupos para estudiantes prioritarios/as y tu hijo/a competirá
                    también por esos cupos. Esta cuota vale en <strong>todos</strong>{' '}
                    los colegios de la lista.
                  </p>
                  <p className="criterio-card__alerta">
                    ⚠️ En el sistema real, marcar esto sin serlo puede anular la
                    postulación: el MINEDUC lo verifica automáticamente.
                  </p>
                </div>
              </div>
            </label>
          </div>

          {prioritario && (
            <div className="sim-result" role="status">
              <p style={{ margin: 0 }}>
                Registrado para la simulación: <strong>estudiante prioritario/a (SEP)</strong>.
                El flujo de postulación lo mostrará como una condición ya registrada,
                sin pedirte que la marques otra vez.
              </p>
            </div>
          )}
        </section>

        {/* Bloque 3 — Prioridades que se declaran al postular (no van aquí) */}
        <section className="perfil-bloque">
          <h2>3. Otras prioridades: se declaran al postular</h2>
          <p className="small-note">
            Tener un <strong>hermano/a matriculado/a</strong>, ser{' '}
            <strong>hijo/a de funcionario/a</strong> o <strong>exalumno/a</strong> son
            vínculos con un colegio concreto, no con el o la estudiante. Por eso no se
            configuran aquí: los declaras <strong>colegio por colegio</strong> en el
            paso 2 de la postulación, marcando en cuál de tu lista tienes ese vínculo.
          </p>
          <p style={{ marginTop: 12 }}>
            <Link to="/postulacion" className="link-inline">Ir a la postulación</Link>
          </p>
        </section>

        <button
          type="button"
          className="btn btn--green btn--grande"
          onClick={guardar}
        >
          ✓ Guardar mis datos
        </button>
      </div>

      <div className="perfil-aviso" role="note">
        <strong>💡 ¿Cómo se usan estos datos?</strong> El nombre, el RUT y el nivel
        se precargan en el paso 1 de la postulación (puedes corregirlos ahí). La
        condición SEP se muestra en el flujo como información, no como una casilla.{' '}
        <strong>Nada se envía al SAE real</strong> — este es un prototipo pedagógico y
        todo queda guardado solo en este dispositivo.
      </div>
    </main>
  )
}
