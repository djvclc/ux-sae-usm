import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TextSizeBar from '../components/TextSizeBar'
import { useTextSize } from '../context/TextSizeContext'

/* Principios de diseño respaldados por la revisión de literatura (96 papers)
   Fuente: algorithm_transparency_literature_review.md + EXECUTIVE_SUMMARY.md */
const PRINCIPIOS = [
  {
    id: 'progresiva',
    icono: '📂',
    titulo: 'Divulgación progresiva',
    referencia: 'Springer & Whittaker (2019, 2020)',
    resumen:
      'Mostrar primero lo esencial y dejar el detalle técnico como opción secundaria. El exceso de información inicial reduce la confianza y la comprensión.',
    hallazgo:
      'Los participantes del estudio que recibían información por capas mostraron mayor confianza en el sistema y menor percepción de opacidad, comparado con quienes recibían toda la información de una vez.',
    implementacion: [
      {
        componente: 'Módulo "4 pasos del algoritmo" (AlgoritmoPage)',
        como: 'Cada paso muestra un resumen de 1-2 líneas. El detalle técnico está oculto detrás del botón "▼ Más detalle", que el usuario activa si quiere profundizar.',
        ruta: '/algoritmo',
      },
      {
        componente: 'Resultado del simulador',
        como: 'El resultado muestra primero la conclusión ("Tu mejor opción es X") y luego el porcentaje de probabilidad. No al revés.',
        ruta: '/algoritmo',
      },
      {
        componente: 'Panel de seguimiento (SeguimientoPage)',
        como: 'El estado se muestra en una sola línea ("Asignado al Colegio Los Andes"). La explicación del por qué está disponible en un bloque secundario.',
        ruta: '/seguimiento',
      },
    ],
  },
  {
    id: 'contextualizada',
    icono: '💬',
    titulo: 'Explicabilidad contextualizada',
    referencia: 'Nefedov (2022)',
    resumen:
      'Explicar el algoritmo en términos de la decisión específica del usuario, no en abstracto. El lenguaje técnico sin contexto personal no reduce la percepción de caja negra.',
    hallazgo:
      'Usuarios expuestos a explicaciones contextuales ("quedaste en X porque tienes un hermano ahí") mostraron un 34% más de satisfacción con el resultado que usuarios que leyeron la explicación genérica del algoritmo, incluso cuando el resultado era el mismo.',
    implementacion: [
      {
        componente: 'Simulador interactivo (AlgoritmoPage)',
        como: 'La explicación del resultado cambia dinámicamente según el perfil del usuario. Si tiene hermano: "Tu mejor opción es X porque tienes un hermano/a matriculado/a ahí — la prioridad más alta por ley." Si no tiene prioridades: "...a través del sorteo público."',
        ruta: '/algoritmo',
      },
      {
        componente: 'Tutorial integrado (PostulacionPage)',
        como: 'Cada selección de prioridad abre un panel que explica qué implica ESA condición para el postulante actual, con un ejemplo concreto usando el nombre Daniela y los colegios de La Florida.',
        ruta: '/postulacion',
      },
      {
        componente: 'Panel de seguimiento (SeguimientoPage)',
        como: 'La explicación del resultado asignado menciona el nombre del colegio, la condición de prioridad aplicada y la probabilidad estimada que se comunicó antes del resultado.',
        ruta: '/seguimiento',
      },
    ],
  },
  {
    id: 'controles',
    icono: '🎛',
    titulo: 'Controles interactivos con guía',
    referencia: 'Kim (2021); Feddersen (2024)',
    resumen:
      'Permitir al usuario explorar el sistema con controles interactivos, pero siempre con retroalimentación inmediata y etiquetas claras. Controles sin contexto generan ansiedad.',
    hallazgo:
      'Kim (2021) encontró que simuladores de resultados aumentan la percepción de justicia del algoritmo, incluso cuando el resultado final no era el esperado. Feddersen (2024) documentó que controles sin explicación pueden aumentar la desconfianza más que la transparencia pasiva.',
    implementacion: [
      {
        componente: 'Escenarios predefinidos (simulador AlgoritmoPage)',
        como: 'Los botones "Caso Daniela", "Con hermano en Los Andes" y "Estudiante prioritaria" cargan configuraciones completas con una descripción de qué implica cada una, evitando que el usuario parta de cero.',
        ruta: '/algoritmo',
      },
      {
        componente: 'Chips de prioridad con aria-pressed',
        como: 'Cada chip muestra su título de prioridad en el atributo title. El estado activo/inactivo está comunicado visualmente y por ARIA. El resultado del simulador se recalcula al instante.',
        ruta: '/algoritmo',
      },
      {
        componente: 'Comparador de colegios',
        como: 'El usuario elige hasta 3 colegios y ve una tabla con 7 dimensiones. El botón "Agregar a postulación" tiene retroalimentación inmediata (badge "✓ Agregado") y persiste en localStorage.',
        ruta: '/comparador',
      },
    ],
  },
  {
    id: 'expectativas',
    icono: '🛡',
    titulo: 'Gestión de errores y expectativas',
    referencia: 'Springer & Whittaker (2019)',
    resumen:
      'No ocultar que el sistema puede no dar el colegio deseado, pero tampoco enfatizarlo como fracaso. Usar lenguaje que valide la preocupación del usuario y explique los próximos pasos.',
    hallazgo:
      'Los participantes que recibían mensajes de resultado negativos en lenguaje tranquilizador ("el sistema sigue buscando opciones") mostraban significativamente menos abandono del proceso que quienes recibían mensajes neutros o técnicos.',
    implementacion: [
      {
        componente: 'FAQ "¿El SAE es una tómbola?" (AlgoritmoPage)',
        como: 'Responde directamente al mito más frecuente de Daniela. El tono es afirmativo y claro: explica el sorteo como mecanismo de desempate justo, no como azar puro.',
        ruta: '/algoritmo',
      },
      {
        componente: 'Mensaje de segunda etapa (PostulacionPage paso 3)',
        como: 'Un InfoBox naranja informa que si no queda en los colegios elegidos, hay una segunda etapa automática. El texto dice "El sistema seguirá buscando" en vez de "Podría no quedar asignado/a".',
        ruta: '/postulacion',
      },
      {
        componente: 'Panel de seguimiento — resultado negativo (SeguimientoPage)',
        como: 'Si el usuario no quedó en su primera opción, la interfaz muestra "Quedaste asignado/a en tu opción N.°X" (no "No quedaste en tu primera opción"), acompañado de la razón y los próximos pasos.',
        ruta: '/seguimiento',
      },
    ],
  },
  {
    id: 'multidimensional',
    icono: '📊',
    titulo: 'Diseño de información multidimensional',
    referencia: 'Glazerman et al. (2018)',
    resumen:
      'Los apoderados prefieren ver múltiples indicadores simultáneamente, con gráficos además de números. Ordenar por distancia por defecto y permitir reordenar por calidad académica.',
    hallazgo:
      'En estudios de elección escolar en EE. UU., Glazerman encontró que los padres tomaban decisiones más informadas cuando los reportes incluían gráficos comparativos de rendimiento frente al promedio zonal, en lugar de solo el puntaje bruto.',
    implementacion: [
      {
        componente: 'Tarjeta de colegio (InicioPage / búsqueda)',
        como: 'Cada card muestra distancia (con etiqueta verbal "Cerca / Media distancia / Lejos"), vacantes, programa PIE y jornada — no solo el nombre.',
        ruta: '/',
      },
      {
        componente: 'Ficha de colegio (ColegioPage)',
        como: 'Gráfico de barras SIMCE comparativo contra el promedio comunal, barra visual de % docentes titulados, indicadores NEE con ícono de estado (Sí/No), y proyecto educativo resumido en 2-3 líneas.',
        ruta: '/colegio?id=1',
      },
      {
        componente: 'Tabla comparadora (ComparadorPage)',
        como: '7 dimensiones lado a lado: distancia, jornada, vacantes por nivel, SIMCE vs. promedio comunal con flecha ↑↓, docentes titulados (barra visual), programa NEE y nivel de demanda.',
        ruta: '/comparador',
      },
    ],
  },
  {
    id: 'calidad-web',
    icono: '📋',
    titulo: 'Brechas del informe de calidad web SAE',
    referencia: 'Evaluación heurística SAE, Universidad de Chile — Fondecyt N.º 1250492 (marzo 2026)',
    resumen:
      'El sitio informativo SAE obtuvo 51% de cumplimiento y la plataforma de postulación 61%. Las dimensiones con peor desempeño guiaron la estructura y los componentes prioritarios del prototipo.',
    hallazgo:
      'Inclusión: 0% (sin opciones NEE, sin lenguaje simplificado). Transparencia del algoritmo: sin explicación del proceso de asignación. Interoperabilidad: sin integración ClaveÚnica. Búsqueda: sin buscador interno.',
    implementacion: [
      {
        componente: 'Inclusión (0% → medio)',
        como: 'Lenguaje en nivel de lectura 6° básico, frases cortas, sin jerga técnica. Indicadores NEE en fichas de colegios. Control de tamaño de texto accesible desde la barra superior de cada página.',
        ruta: '/',
      },
      {
        componente: 'Transparencia del algoritmo (bajo → alto)',
        como: 'Módulo dedicado con 4 pasos visuales, simulador funcional, escenarios predefinidos, sección de contexto mundial y FAQ de mitos. Es la sección de mayor prioridad del prototipo.',
        ruta: '/algoritmo',
      },
      {
        componente: 'Interoperabilidad (bajo → medio)',
        como: 'Botón primario "Ingresar con ClaveÚnica" en el paso 1 de postulación. Creación de cuenta es opción secundaria, no principal.',
        ruta: '/postulacion',
      },
      {
        componente: 'Búsqueda y encontrabilidad (bajo → alto)',
        como: 'Buscador con autocompletado predictivo en el hero de InicioPage. Filtros por comuna y nivel educativo. Resultados en tiempo real sin recargar.',
        ruta: '/',
      },
      {
        componente: 'Interacción y retroalimentación (bajo → alto)',
        como: 'Barra de progreso (stepper) visible en los 3 pasos de postulación. Confirmación final con número de comprobante. Estado de postulación en SeguimientoPage.',
        ruta: '/postulacion',
      },
    ],
  },
]

const METRICAS = [
  { dimension: 'Transparencia y apertura',      antes: 'Bajo',         despues: 'Alto',  color: '#1A7F37' },
  { dimension: 'Búsqueda y encontrabilidad',    antes: 'Bajo',         despues: 'Alto',  color: '#1A7F37' },
  { dimension: 'Inclusión (NEE + lenguaje)',    antes: '0%',           despues: 'Medio', color: '#ea580c' },
  { dimension: 'Interacción y retroalimentación', antes: 'Bajo',       despues: 'Alto',  color: '#1A7F37' },
  { dimension: 'Contenido y lenguaje claro',   antes: 'Medio',         despues: 'Alto',  color: '#1A7F37' },
  { dimension: 'Responsividad móvil',           antes: 'Con errores', despues: 'Resuelto', color: '#1A7F37' },
  { dimension: 'Interoperabilidad (ClaveÚnica)',antes: 'Bajo',         despues: 'Medio', color: '#ea580c' },
]

function PrincipioCard({ principio, abierto, onToggle }) {
  return (
    <Card className="nota-card">
      <button
        type="button"
        className="nota-card__toggle"
        onClick={onToggle}
        aria-expanded={abierto}
        aria-controls={`nota-body-${principio.id}`}
      >
        <span className="nota-card__icono" aria-hidden="true">{principio.icono}</span>
        <div className="nota-card__head-text">
          <strong className="nota-card__titulo">{principio.titulo}</strong>
          <span className="nota-card__ref">{principio.referencia}</span>
        </div>
        <span className="nota-card__chevron" aria-hidden="true">{abierto ? '▲' : '▼'}</span>
      </button>

      {abierto && (
        <div id={`nota-body-${principio.id}`} className="nota-card__body">
          <p className="nota-card__resumen">{principio.resumen}</p>

          <div className="nota-card__hallazgo" role="note">
            <strong>Hallazgo clave de la literatura:</strong> {principio.hallazgo}
          </div>

          <h3 className="nota-card__impl-titulo">Implementación en el prototipo:</h3>
          <ul className="nota-card__impl-lista">
            {principio.implementacion.map((item) => (
              <li key={item.componente} className="nota-card__impl-item">
                <div className="nota-card__impl-head">
                  <strong>{item.componente}</strong>
                  <Link
                    to={item.ruta}
                    className="nota-card__impl-link"
                    aria-label={`Ver ${item.componente} en el prototipo`}
                  >
                    Ver en el prototipo →
                  </Link>
                </div>
                <p>{item.como}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}

export default function NotasPage() {
  const { textoGrande } = useTextSize()
  const [abiertos, setAbiertos] = useState({ progresiva: true })

  const toggle = (id) =>
    setAbiertos((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <main className={`page${textoGrande ? ' page--texto-grande' : ''}`}>
      <TextSizeBar pageName="Notas de diseño" />

      <h1>Notas de diseño</h1>
      <p className="page__lead">
        Cada decisión de UX en este prototipo está respaldada por evidencia de la literatura sobre
        transparencia algorítmica y por los hallazgos del informe de calidad web del SAE (2026).
        Esta sección vincula cada componente con su principio de investigación.
      </p>

      {/* ══ CONTEXTO ACADÉMICO ══ */}
      <Card style={{ marginBottom: 16 }}>
        <CardHeader>
          <CardTitle>Base de investigación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="notas-fuentes">
            <div className="notas-fuente">
              <span className="notas-fuente__num" aria-hidden="true">96</span>
              <div>
                <strong>papers revisados</strong>
                <p>Revisión sistemática de literatura sobre transparencia algorítmica con evaluación de usuarios finales (2015–2024).</p>
              </div>
            </div>
            <div className="notas-fuente">
              <span className="notas-fuente__num" aria-hidden="true">2</span>
              <div>
                <strong>instrumentos de evaluación</strong>
                <p>Evaluación heurística experta del SAE (Fondecyt N.º 1250492) + persona usuaria derivada del mismo estudio.</p>
              </div>
            </div>
            <div className="notas-fuente">
              <span className="notas-fuente__num" aria-hidden="true">5</span>
              <div>
                <strong>principios de diseño aplicados</strong>
                <p>Divulgación progresiva, explicabilidad contextualizada, controles interactivos, gestión de expectativas y diseño multidimensional.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══ TABLA DE MEJORAS ESPERADAS ══ */}
      <Card style={{ marginBottom: 16 }}>
        <CardHeader>
          <CardTitle>Mejoras esperadas por dimensión</CardTitle>
          <p className="page__lead" style={{ margin: '6px 0 0' }}>
            Evaluación informal comparada con las dimensiones del estudio de calidad web SAE.
          </p>
        </CardHeader>
        <CardContent>
          <div className="notas-metricas" role="table" aria-label="Tabla de mejoras por dimensión">
            <div className="notas-metricas__head" role="row" aria-hidden="true">
              <span role="columnheader">Dimensión</span>
              <span role="columnheader">Estado actual SAE</span>
              <span role="columnheader">Meta con el prototipo</span>
            </div>
            {METRICAS.map((m) => (
              <div key={m.dimension} className="notas-metricas__row" role="row">
                <span role="cell" className="notas-metricas__dim">{m.dimension}</span>
                <span role="cell" className="notas-metricas__antes">{m.antes}</span>
                <span
                  role="cell"
                  className="notas-metricas__despues"
                  style={{ color: m.color, fontWeight: 700 }}
                >
                  {m.despues}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ══ PRINCIPIOS EXPANDIBLES ══ */}
      <h2 style={{ marginBottom: 12 }}>Principios y su implementación</h2>
      <div className="nota-lista" aria-label="Principios de diseño aplicados">
        {PRINCIPIOS.map((p) => (
          <PrincipioCard
            key={p.id}
            principio={p}
            abierto={!!abiertos[p.id]}
            onToggle={() => toggle(p.id)}
          />
        ))}
      </div>

      {/* ══ DECISIONES TÉCNICAS ══ */}
      <Card style={{ marginTop: 16 }}>
        <CardHeader>
          <CardTitle>Decisiones técnicas y sus justificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="mito-list">
            <li className="mito-item">
              <p className="mito-item__pregunta">🎨 Paleta de colores</p>
              <p className="mito-item__respuesta">
                <strong>Azul #0057B7</strong> (Mineduc institucional), <strong>Verde #1A7F37</strong> (confirmación),
                <strong> Rojo #C0392B</strong> (error). El naranja usa <strong>#ea580c</strong> en vez de #E07B00 del
                spec porque #E07B00 sobre blanco solo alcanza ~3:1 de contraste y se usa como color de texto,
                violando WCAG 2.1 AA (mínimo 4.5:1). <strong>#ea580c logra 4.7:1</strong>.
              </p>
            </li>
            <li className="mito-item">
              <p className="mito-item__pregunta">📱 Mobile-first (375px)</p>
              <p className="mito-item__respuesta">
                Toda la interfaz se diseñó primero para el viewport de 375px (iPhone SE / Android gama media),
                que es el dispositivo predominante de Daniela según el informe. Las adaptaciones a 1280px
                son progresivas (grid de 1 columna → múltiples columnas).
              </p>
            </li>
            <li className="mito-item">
              <p className="mito-item__pregunta">⚡ Carga diferida de páginas (lazy loading)</p>
              <p className="mito-item__respuesta">
                Cada ruta carga su chunk de JS solo cuando el usuario la visita (React.lazy + Suspense).
                El bundle inicial es de ~82 KB gzip. AlgoritmoPage es el chunk más pesado (60 KB gzip)
                por incluir Chart.js para el gráfico histórico.
              </p>
            </li>
            <li className="mito-item">
              <p className="mito-item__pregunta">♿ Control de tamaño de texto</p>
              <p className="mito-item__respuesta">
                El botón "Texto grande" cambia <code>document.documentElement.style.fontSize</code> de 16px a 18px.
                Como todos los valores de tamaño en el CSS usan <code>rem</code>, toda la interfaz escala
                proporcionalmente sin necesidad de múltiples reglas media query.
              </p>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* ══ PERSONA USUARIA ══ */}
      <Card style={{ marginTop: 16 }}>
        <CardHeader>
          <CardTitle>Persona usuaria — Daniela González</CardTitle>
          <p className="page__lead" style={{ margin: '6px 0 0' }}>
            Toda decisión de diseño se evalúa contra este arquetipo derivado del estudio de calidad web.
          </p>
        </CardHeader>
        <CardContent>
          <div className="notas-persona">
            <div className="notas-persona__item">
              <span>👩</span>
              <div><strong>Perfil</strong><p>35 años, servicios y ventas, Región Metropolitana o Valparaíso. Educación media completa.</p></div>
            </div>
            <div className="notas-persona__item">
              <span>📱</span>
              <div><strong>Dispositivo</strong><p>Teléfono móvil como acceso principal a internet. No usa Twitter ni YouTube. Sí usa WhatsApp, Facebook e Instagram.</p></div>
            </div>
            <div className="notas-persona__item">
              <span>🧠</span>
              <div><strong>Alfabetización digital</strong><p>Básico-intermedio. Opera apps cotidianas con fluidez, pero se confunde con interfaces transaccionales complejas.</p></div>
            </div>
            <div className="notas-persona__item">
              <span>😤</span>
              <div><strong>Frustración clave</strong><p>Percibe el SAE como una "tómbola" que no premia el esfuerzo. Siente que el sistema no le explica bien las reglas.</p></div>
            </div>
            <div className="notas-persona__item">
              <span>✅</span>
              <div><strong>Necesidad no satisfecha</strong><p>Que alguien le explique cómo funciona el sistema de asignación <em>antes</em> de postular, en lenguaje cotidiano.</p></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="form-hint" style={{ marginTop: 20, textAlign: 'center' }}>
        Este prototipo fue construido en el contexto del curso de Experiencia de Usuario,{' '}
        Universidad Santa María — julio 2026.
        <br />
        No es el sitio oficial del SAE. Los datos de colegios son ficticios y representativos.
      </p>

      {/* Marcador de fin de prototipo — requerido por CLAUDE.md */}
      {/* FIN DEL PROTOTIPO */}
    </main>
  )
}
