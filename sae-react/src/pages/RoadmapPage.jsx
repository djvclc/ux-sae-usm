const pasos = [
  'Separar estilos globales y tokens en un modulo de design system.',
  'Migrar navegacion, hero y buscador desde el HTML actual a componentes.',
  'Mover datos de colegios, hitos y textos a archivos en src/data.',
  'Implementar estados y acciones con hooks y contexto compartido.',
  'Agregar pruebas de accesibilidad y smoke tests de rutas criticas.',
]

export default function RoadmapPage() {
  return (
    <main className="page">
      <h1>Roadmap de migracion a React</h1>
      <p className="page__lead">
        Plan minimo para pasar del prototipo en HTML a una app mantenible y
        testeable.
      </p>
      <ol className="roadmap">
        {pasos.map((paso) => (
          <li key={paso}>{paso}</li>
        ))}
      </ol>
    </main>
  )
}
