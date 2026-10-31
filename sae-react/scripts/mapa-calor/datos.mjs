// Lee la carpeta con las partes bajadas de Drive (o de servidor-prueba.mjs) y
// arma una lista de sesiones con sus muestras decodificadas.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

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
  const porSesion = new Map()
  for (const f of readdirSync(carpeta).filter((f) => f.endsWith('.json'))) {
    const d = JSON.parse(readFileSync(join(carpeta, f), 'utf8'))
    if (!porSesion.has(d.sesion)) porSesion.set(d.sesion, { partes: [], completo: null })
    const s = porSesion.get(d.sesion)
    if (d.parte === 'completo') s.completo = d
    else s.partes.push(d)
  }
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
