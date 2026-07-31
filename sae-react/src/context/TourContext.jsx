import { createContext, useCallback, useContext, useState } from 'react'

/* ══ Pasos del tour guiado ══
   Cada paso tiene:
   - page: ruta donde debe estar el usuario
   - selector: elemento a destacar (null = modal centrado)
   - titulo, contenido, tip: textos explicativos
   - centrado: fuerza el tooltip al centro de la pantalla
*/
export const tourPasos = [
  {
    id: 'bienvenida',
    page: '/',
    selector: null,
    centrado: true,
    titulo: '¡Hola! 👋 Te damos la bienvenida',
    contenido:
      'Te voy a mostrar cómo funciona este sistema en menos de 2 minutos. No necesitas saber nada técnico — solo seguir los pasos.',
    tip: null,
  },
  {
    id: 'buscador',
    page: '/',
    selector: '.search-box',
    titulo: '🔎 Busca colegios por nombre o comuna',
    contenido:
      'Escribe el nombre de un colegio o tu comuna y el sistema te muestra los resultados al instante. Puedes filtrar por nivel educativo (básico, medio) y ver las vacantes disponibles.',
    tip: '💡 Ejemplo: escribe "La Florida" para ver los 3 colegios de esa comuna.',
  },
  {
    id: 'pasos-rapidos',
    page: '/',
    selector: '.pasos-inicio__grid',
    titulo: '3 pasos para postular',
    contenido:
      'El proceso de postulación tiene solo 3 etapas: primero entender cómo funciona el sistema, después buscar y comparar colegios, y finalmente postular con tu ClaveÚnica del Gobierno.',
    tip: '💡 Tienes hasta el 30 de agosto. Puedes guardar tu progreso y volver cuando quieras.',
  },
  {
    id: 'algoritmo-pasos',
    page: '/algoritmo',
    selector: '.algo-timeline',
    titulo: '⚙️ 4 pasos — lee como un artículo',
    contenido:
      'Esta sección explica el proceso completo en 4 pasos con más texto del habitual. No necesitas hacer clic para ver más — todo el contenido está a la vista. Léelo de arriba a abajo como si fuera un artículo de revista.',
    tip: '🌍 El algoritmo de Gale-Shapley que usa el SAE ganó el Premio Nobel de Economía en 2012. Nueva York, Londres y Ámsterdam usan el mismo método.',
  },
  {
    id: 'prioridades',
    page: '/algoritmo',
    selector: '.chip-row',
    titulo: '⚖️ Estas son tus condiciones de prioridad',
    contenido:
      'Las prioridades las define la ley, no el colegio. "Hermano/a matriculado/a" es la más alta: si tu hijo mayor está en ese colegio, el sistema te da preferencia para que el menor también pueda ir.',
    tip: '⚠ Marca solo las condiciones que realmente aplican. Si marcas una que no tienes y el colegio lo verifica, tu postulación puede ser anulada.',
  },
  {
    id: 'seleccion-colegios',
    page: '/algoritmo',
    selector: '.sim-school-grid',
    titulo: '🏫 El orden en que pones los colegios importa',
    contenido:
      'El sistema evalúa primero tu opción N.° 1. Si no hay cupo con tu nivel de prioridad, pasa a la N.° 2, y así. Por eso siempre debes poner primero el colegio que MÁS quieres, no el que crees que te van a dar.',
    tip: '💡 En la postulación real puedes elegir hasta 8 colegios. Mientras más agregues, mayor es tu probabilidad de quedar en alguno.',
  },
  {
    id: 'simulador',
    page: '/algoritmo',
    selector: '.sim-panel',
    titulo: '🎯 Simula tu caso antes de postular',
    contenido:
      'Marca tus condiciones de prioridad y selecciona colegios: el simulador te muestra cuál es tu mejor opción probable y te explica por qué. Es una estimación — el resultado real depende de todos los postulantes.',
    tip: '💡 Pruébalo ahora: selecciona "Hermano/a matriculado/a" y elige el Colegio Los Andes. Verás que tu probabilidad sube al 92%.',
  },
  {
    id: 'comparador',
    page: '/comparador',
    selector: '.comp-selector__grid',
    titulo: '📊 Compara colegios antes de decidir el orden',
    contenido:
      'Antes de armar tu lista definitiva, selecciona hasta 3 colegios para comparar sus datos: puntaje SIMCE versus el promedio comunal, porcentaje de docentes titulados, si tiene programa para necesidades educativas especiales y más.',
    tip: '💡 Daniela compararía Los Andes, República de Chile y Los Quillayes — los tres están en La Florida, cerca de su casa.',
  },
  {
    id: 'postulacion-inicio',
    page: '/postulacion',
    selector: '.post-header',
    titulo: '✅ Aquí postulas en 3 pasos',
    contenido:
      'El flujo de postulación es simple: primero te identificas con tu ClaveÚnica del Gobierno (sin contraseña aparte), después armas y ordenas tu lista de colegios, y finalmente confirmas. Todo dura menos de 10 minutos.',
    tip: '🔑 ClaveÚnica es la clave del Estado chileno. Si no tienes, puedes tramitarla gratis en el Registro Civil.',
  },
  {
    id: 'postulacion-pasos',
    page: '/postulacion',
    selector: '.stepper',
    titulo: '🗺 Esta barra te dice dónde estás',
    contenido:
      'La barra de progreso muestra en qué paso vas en todo momento. Si en algún momento te pierdes, siempre puedes ver cuánto falta y volver al paso anterior sin perder lo que ya ingresaste.',
    tip: '💡 El modo tutorial está activo por defecto — cada decisión tiene una explicación que te dice qué implica lo que estás seleccionando.',
  },
  {
    id: 'final',
    page: '/postulacion',
    selector: null,
    centrado: true,
    titulo: '🎉 ¡Ya tienes todo lo que necesitas!',
    contenido:
      'Sabes cómo buscar colegios, entender el algoritmo, simular tu caso, comparar opciones y postular paso a paso. Cuando estés lista/o, usa el botón "Postular ahora" — el proceso toma menos de 10 minutos.',
    tip: null,
  },
]

const TourContext = createContext({
  isActive: false,
  currentStep: 0,
  startTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  endTour: () => {},
})

export function TourProvider({ children }) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const startTour = useCallback(() => {
    setCurrentStep(0)
    setIsActive(true)
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= tourPasos.length - 1) {
        setIsActive(false)
        return 0
      }
      return prev + 1
    })
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }, [])

  const endTour = useCallback(() => {
    setIsActive(false)
    setCurrentStep(0)
  }, [])

  return (
    <TourContext.Provider value={{ isActive, currentStep, startTour, nextStep, prevStep, endTour }}>
      {children}
    </TourContext.Provider>
  )
}

export function useTour() {
  return useContext(TourContext)
}
