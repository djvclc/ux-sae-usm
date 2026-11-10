// Lee la carpeta con las partes bajadas de Drive (o de servidor-prueba.mjs) y
// arma una lista de sesiones con sus muestras decodificadas.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Pantallas que recorre cualquiera que complete la tarea (nombres de
// pantalla() en src/utils/registroCursor.js), en orden.
export const PANTALLAS_FLUJO = [
  'Paso 1 de 3: Tu familia',
  'Ventana: ¿Confirmas estos datos?',
  'Paso 2 de 3: Tus colegios (lista vacía)',
  'Paso 2 de 3: Tus colegios (catálogo)',
  'Paso 2 de 3: Tus colegios',
  'Paso 3 de 3: Revisa y envía',
  'Ventana: Confirma tu postulación',
  'Postulación enviada',
  '/seguimiento',
]

function decodificar(parte) {
  return parte.muestras.map((m) => ({
    t: m.t,
    pantalla: parte.pantallas[m.p],
    ruta: m.r == null ? null : parte.rutas[m.r],
    fx: m.fx,
    fy: m.fy,
    x: m.x,
    y: m.y,
    clic: m.c === 1,
    ventana: parte.ventana,
  }))
}

export function cargarSesiones(carpeta) {
  if (!existsSync(carpeta)) {
    // datos/ no viene con el repositorio (está en .gitignore): se crea una vez.
    console.log(`No existe la carpeta ${carpeta}.\nCréala (mkdir datos) y copia ahí los .json bajados de Drive.`)
    process.exit(1)
  }
  // Lee también las subcarpetas: cada .zip de Drive puede descomprimirse en la
  // suya. Una parte repetida (dos zips, o "archivo (1).json") se cuenta una vez.
  const archivos = readdirSync(carpeta, { recursive: true }).filter((f) => String(f).endsWith('.json'))
  const porSesion = new Map()
  for (const f of archivos) {
    let d
    try {
      d = JSON.parse(readFileSync(join(carpeta, String(f)), 'utf8'))
    } catch {
      console.log(`(se omite ${f}: no es un JSON válido)`)
      continue
    }
    if (!d?.sesion || !Array.isArray(d.muestras)) continue // no es una parte del registro
    if (!porSesion.has(d.sesion)) porSesion.set(d.sesion, { partes: new Map(), completo: null })
    const s = porSesion.get(d.sesion)
    if (d.parte === 'completo') s.completo = d
    else s.partes.set(d.parte, d)
  }
  for (const s of porSesion.values()) s.partes = [...s.partes.values()]
  return [...porSesion.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([sesion, s]) => {
    // Las partes son la fuente principal (sobreviven a una recarga de la
    // página); el archivo "completo" del atajo solo se usa si no hay partes.
    s.partes.sort((a, b) => a.parte - b.parte)
    const base = s.partes[0] || s.completo
    const muestras = s.partes.length ? s.partes.flatMap(decodificar) : decodificar(s.completo)
    const numeros = s.partes.map((p) => p.parte)
    const faltan = []
    for (let i = 0; i <= Math.max(-1, ...numeros); i++) if (!numeros.includes(i)) faltan.push(i)
    return {
      sesion,
      version: base.version,
      inicio: base.inicio,
      punteroFino: base.punteroFino,
      ventanas: [...new Set([...s.partes, s.completo].filter(Boolean).map((p) => `${p.ventana.w}×${p.ventana.h}`))],
      partes: s.partes.length,
      faltan,
      soloRespaldo: !s.partes.length,
      muestras,
    }
  })
}
