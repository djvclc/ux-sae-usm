// Imita al Apps Script (apps-script.gs) en el propio computador, para probar el
// registro sin Google: recibe las partes y las guarda en ./datos/ con el mismo
// nombre que tendrían en Drive.
//
// Uso: node servidor-prueba.mjs [puerto=8787]
// y compilar el prototipo apuntando a él:
//   VITE_URL_REGISTRO=http://localhost:8787 npm run build && npx vite preview
import { createServer } from 'node:http'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PUERTO = Number(process.argv[2] || 8787)
const DATOS = join(dirname(fileURLToPath(import.meta.url)), 'datos')
mkdirSync(DATOS, { recursive: true })

// Mismas reglas que apps-script.gs.
export function nombreParte(texto) {
  if (texto.length > 200000) return null
  const d = JSON.parse(texto)
  if (!/^\d{8}-\d{4}-[AB]-[a-z0-9]{4}$/.test(d.sesion)) return null
  if (!Array.isArray(d.muestras)) return null
  if (d.parte === 'completo') return `${d.sesion}_completo.json`
  if (!Number.isInteger(d.parte) || d.parte < 0 || d.parte > 999) return null
  return `${d.sesion}_parte-${String(d.parte).padStart(3, '0')}.json`
}

createServer((req, res) => {
  if (req.method !== 'POST') { res.end('ok'); return }
  let texto = ''
  req.on('data', (c) => { texto += c })
  req.on('end', () => {
    try {
      const nombre = nombreParte(texto)
      if (!nombre) { res.end('rechazado'); return }
      writeFileSync(join(DATOS, nombre), texto)
      console.log('←', nombre)
      res.end('ok')
    } catch {
      res.end('error')
    }
  })
}).listen(PUERTO, () => console.log(`Recibiendo partes en http://localhost:${PUERTO} → ${DATOS}`))
