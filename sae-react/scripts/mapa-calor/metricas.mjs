// Una fila por sesión con lo que va en la hoja "Mouse" de RESPUESTAS_PRUEBA_SAE.xlsx,
// en el mismo orden de columnas (desde "Tu familia (s)"), para copiar y pegar.
//
// Uso: node metricas.mjs [carpeta=./datos]
// Escribe metricas.csv junto a la carpeta de datos (separado por ";" para el
// Excel en español) y muestra la misma tabla en la terminal.
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cargarSesiones, PANTALLAS_FLUJO } from './datos.mjs'

const carpeta = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), 'datos')
const salida = join(carpeta, '..', 'metricas.csv')
const CORTO = ['Tu familia', '¿Confirmas estos datos?', 'Lista vacía', 'Catálogo', 'Tu lista',
  'Revisa y envía', 'Confirma tu postulación', 'Postulación enviada', 'Resultado']

const filas = cargarSesiones(carpeta).map((s) => {
  const seg = new Map()
  let clics = 0
  for (const m of s.muestras) {
    if (m.clic) clics++
    else seg.set(m.pantalla, (seg.get(m.pantalla) || 0) + 1)
  }
  // Fuera del flujo: páginas que no son de la tarea, con al menos 1 s.
  // "/postulacion" es solo la carga inicial de la página.
  const otras = [...seg.entries()]
    .filter(([p, n]) => !PANTALLAS_FLUJO.includes(p) && p !== '/postulacion' && n >= 10)
    .map(([p, n]) => `${p} ${Math.round(n / 10)} s`)
  const tResultado = s.muestras.find((m) => m.pantalla === '/seguimiento')?.t
  const salio = tResultado != null && s.muestras.some((m) =>
    m.t > tResultado && !PANTALLAS_FLUJO.includes(m.pantalla) && m.pantalla !== '/postulacion')
  const avisos = []
  if (s.faltan.length) avisos.push(`faltan las partes ${s.faltan.join(', ')}`)
  if (!s.punteroFino) avisos.push('sin mouse ni touchpad')
  const ausentes = PANTALLAS_FLUJO.filter((p) => !seg.has(p)).map((p) => CORTO[PANTALLAS_FLUJO.indexOf(p)])
  if (ausentes.length) avisos.push(`sin datos en: ${ausentes.join(', ')}`)
  if (!clics) avisos.push('0 clics')
  return {
    carpeta: s.carpeta === '.' ? '' : s.carpeta,
    codigo: s.sesion,
    version: s.version,
    inicio: new Date(s.inicio).toLocaleString('es-CL', { timeZone: 'America/Santiago' }),
    estado: avisos.length ? 'Incompleta' : 'Completa',
    valores: [
      ...PANTALLAS_FLUJO.map((p) => Math.round((seg.get(p) || 0) / 10)),
      clics,
      salio ? 'Sí' : 'No',
      otras.join(', '),
      avisos.join(' · '),
    ],
  }
})

if (!filas.length) {
  console.log(`No hay datos en ${carpeta}`)
  process.exit(0)
}

const ENC = ['Carpeta', 'Código de sesión', 'Versión', 'Inicio', 'Registro', ...CORTO.map((p) => `${p} (s)`),
  'Clics en total', '¿Salió del flujo?', 'Otras páginas', 'Avisos']
const celda = (v) => (/[;"\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v))
const csv = [ENC, ...filas.map((f) => [f.carpeta, f.codigo, f.version, f.inicio, f.estado, ...f.valores])]
  .map((r) => r.map(celda).join(';')).join('\r\n')
// BOM: para que Excel muestre bien las tildes.
writeFileSync(salida, '\uFEFF' + csv + '\r\n')

console.log(`${filas.length} sesiones → ${salida}\n`)
console.table(filas.map((f) => Object.fromEntries([
  ['Carpeta', f.carpeta], ['Código', f.codigo], ['V', f.version], ['Registro', f.estado],
  ...CORTO.map((p, i) => [p, f.valores[i]]),
  ['Clics', f.valores[9]], ['Salió', f.valores[10]],
])))
