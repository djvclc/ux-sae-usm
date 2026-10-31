// Revisión rápida después de cada sesión: ¿llegaron los datos completos?
// Uso: node resumen.mjs [carpeta=./datos]
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cargarSesiones } from './datos.mjs'

const carpeta = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), 'datos')
// Pantallas que recorre cualquiera que complete la tarea.
const ESPERADAS = [
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

const sesiones = cargarSesiones(carpeta)
if (!sesiones.length) console.log(`No hay datos en ${carpeta}`)
for (const s of sesiones) {
  const porPantalla = new Map()
  for (const m of s.muestras) {
    const p = porPantalla.get(m.pantalla) || { n: 0, clics: 0 }
    if (m.clic) p.clics++
    else p.n++
    porPantalla.set(m.pantalla, p)
  }
  const ts = s.muestras.map((m) => m.t)
  const min = ts.length ? Math.round((Math.max(...ts) - Math.min(...ts)) / 60000) : 0
  const inicio = new Date(s.inicio).toLocaleString('es-CL', { timeZone: 'America/Santiago' })
  console.log(`\n■ ${s.sesion}  ·  versión ${s.version}  ·  inicio ${inicio}  ·  ${min} min`)
  console.log(`  ventana ${s.ventanas.join(', ')}  ·  ${s.partes} partes${s.soloRespaldo ? ' (solo el archivo de respaldo)' : ''}`)
  for (const [p, v] of porPantalla) {
    if (v.n < 10 && !v.clics) continue // menos de 1 s: la página cargando
    console.log(`  ${p.padEnd(42)} ${String(Math.round(v.n / 10)).padStart(4)} s  ${String(v.clics).padStart(3)} clics`)
  }
  const avisos = []
  if (s.faltan.length) avisos.push(`faltan las partes ${s.faltan.join(', ')} (se perdieron datos de ese tramo)`)
  if (!s.punteroFino) avisos.push('no usó mouse ni touchpad (¿celular o tablet?): no sirve para el mapa de calor')
  const ausentes = ESPERADAS.filter((p) => !porPantalla.has(p))
  if (ausentes.length) avisos.push(`sin datos en: ${ausentes.join(' · ')}`)
  if (![...porPantalla.values()].some((v) => v.clics)) avisos.push('0 clics registrados')
  console.log(avisos.length ? avisos.map((a) => `  ⚠ ${a}`).join('\n') : '  ✓ completa')
}
