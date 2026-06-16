import { useEffect, useState } from 'react'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'

const PERFIL_KEY = 'sae_react_perfil'

const criterios = [
  {
    key: 'hermano',
    num: '1°',
    titulo: 'Hermano/a matriculado/a en el mismo colegio',
    desc: 'Tienes otro hijo/a ya matriculado/a en el mismo establecimiento. Es la prioridad más alta por ley y casi siempre garantiza la asignación, salvo que las vacantes sean menores a los postulantes con hermano.',
    alerta: null,
  },
  {
    key: 'prioritario',
    num: '2°',
    titulo: 'Estudiante prioritario/a (RSH u otro criterio Mineduc)',
    desc: 'La o el estudiante es prioritario/a según el Ministerio de Educación.',
    alerta:
      '⚠️ Si el nivel ya tiene el 15% o más de estudiantes prioritarios/as, este criterio no aplica aunque seas prioritario/a.',
  },
  {
    key: 'funcionario',
    num: '3°',
    titulo: 'Hijo/a de funcionario/a del establecimiento',
    desc: 'El padre, madre o guardador trabaja de forma permanente como funcionario/a en el establecimiento educativo.',
    alerta: null,
  },
  {
    key: 'exalumno',
    num: '4°',
    titulo: 'Exalumno/a del mismo establecimiento',
    desc: 'La o el estudiante estuvo matriculado/a anteriormente en el mismo establecimiento y desea retornar. No aplica si fue expulsado/a.',
    alerta: null,
  },
]

const niveles = [
  'Prekínder', 'Kínder',
  '1° Básico', '2° Básico', '3° Básico', '4° Básico', '5° Básico', '6° Básico',
  '7° Básico', '8° Básico',
  '1° Medio', '2° Medio', '3° Medio', '4° Medio',
]

export default function PerfilPage() {
  const { textoGrande } = useTextSize()
  const [nombre, setNombre] = useState('')
  const [nivel, setNivel] = useState('')
  const [condiciones, setCondiciones] = useState({
    hermano: false,
    prioritario: false,
    funcionario: false,
    exalumno: false,
  })
  const [guardado, setGuardado] = useState(false)

  // Cargar perfil guardado
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PERFIL_KEY)
      if (raw) {
        const p = JSON.parse(raw)
        if (p.nombre) setNombre(p.nombre)
        if (p.nivel) setNivel(p.nivel)
        if (p.condiciones) setCondiciones(p.condiciones)
      }
    } catch { /* ignorar errores de parseo */ }
  }, [])

  const toggleCondicion = (key) => {
    setCondiciones((prev) => ({ ...prev, [key]: !prev[key] }))
    setGuardado(false)
  }

  const guardar = () => {
    const payload = { nombre, nivel, condiciones }
    localStorage.setItem(PERFIL_KEY, JSON.stringify(payload))
    setGuardado(true)
  }

  const prioridadActiva = criterios.find((c) => condiciones[c.key])

  return (
    <main className={`page${textoGrande ? ' page--texto-grande' : ''}`}>
      <TextSizeBar pageName="Mis datos" />
      <h1 tabIndex={-1}>Mis datos</h1>
      <p className="page__lead">
        Cuéntanos sobre tu situación. Esta información personaliza el simulador,
        las probabilidades y las explicaciones de resultados.
      </p>

      {guardado && (
        <div className="perfil-aviso perfil-aviso--ok" role="status">
          ✅ Datos guardados correctamente. El simulador ya usa tu perfil.
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
              onChange={(e) => { setNombre(e.target.value); setGuardado(false) }}
              placeholder="Ej: Sofía González"
              autoComplete="off"
            />
          </div>
          <div className="perfil-campo">
            <label htmlFor="perf-nivel">Nivel al que postula</label>
            <select
              id="perf-nivel"
              value={nivel}
              onChange={(e) => { setNivel(e.target.value); setGuardado(false) }}
            >
              <option value="">Selecciona un nivel…</option>
              {niveles.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Bloque 2 — Criterios de prioridad */}
        <section className="perfil-bloque">
          <h2>2. Criterios de prioridad que te aplican</h2>
          <p className="small-note">
            La ley define 4 criterios de prioridad.{' '}
            <strong>Solo se aplica el de mayor jerarquía</strong>. Si no aplica
            ninguno, la asignación es por sorteo público transparente.
          </p>

          <div className="criterios-grid" role="group" aria-label="Criterios de prioridad">
            {criterios.map((c) => (
              <label
                key={c.key}
                className={`criterio-card${condiciones[c.key] ? ' criterio-card--on' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={condiciones[c.key]}
                  onChange={() => toggleCondicion(c.key)}
                />
                <div className="criterio-card__body">
                  <span className="criterio-card__num">{c.num}</span>
                  <div>
                    <p className="criterio-card__titulo">{c.titulo}</p>
                    <p className="criterio-card__desc">{c.desc}</p>
                    {c.alerta && (
                      <p className="criterio-card__alerta">{c.alerta}</p>
                    )}
                  </div>
                </div>
              </label>
            ))}

            {/* Tarjeta fija — sorteo */}
            <div className="criterio-card criterio-card--sorteo">
              <div className="criterio-card__body">
                <span className="criterio-card__num criterio-card__num--gris">5°</span>
                <div>
                  <p className="criterio-card__titulo">Sin prioridad especial — Sorteo público</p>
                  <p className="criterio-card__desc">
                    Si no aplica ninguno de los anteriores, el sistema asigna por sorteo público y
                    transparente. El sorteo es presenciado por notario. Las probabilidades dependen
                    de cuántos postulantes sin prioridad hay versus vacantes disponibles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resumen prioridad activa */}
        {prioridadActiva && (
          <div className="sim-result" role="status">
            <h3>Tu prioridad principal</h3>
            <p>
              Según lo que marcaste, tu criterio más alto es{' '}
              <strong>{prioridadActiva.titulo}</strong>. Esto se usará en el simulador.
            </p>
          </div>
        )}

        <button
          type="button"
          className="btn btn--green btn--grande"
          onClick={guardar}
        >
          ✓ Guardar mis datos y personalizar simulador
        </button>
      </div>

      <div className="perfil-aviso" role="note">
        <strong>💡 ¿Cómo se usan estos datos?</strong> Tu nombre y nivel
        personalizan los mensajes del flujo. Las condiciones de prioridad
        alimentan el simulador del algoritmo y las probabilidades estimadas en
        la lista de postulación. <strong>Nada se envía al SAE real</strong> —
        este es un prototipo pedagógico.
      </div>
    </main>
  )
}
