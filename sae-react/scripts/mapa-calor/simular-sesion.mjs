// Simula participantes para PROBAR el registro del cursor de punta a punta:
// abre el link de sesión, hace la tarea con un mouse simulado (curvas, temblor,
// pausas de lectura) y deja que el registro mande sus partes. Los datos que
// produce NO son de personas: sirven solo para verificar que todo funciona.
//
// Uso: node simular-sesion.mjs [url-base] [n por versión] [--respaldo]
//   --respaldo: además prueba el atajo Ctrl+Alt+Shift+R y guarda el archivo en
//   ./respaldos/.
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { abrirSesion, recorrerFlujo } from './flujo.mjs'
const { chromium } = createRequire(import.meta.url)('playwright')

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const BASE = args[0] || 'http://localhost:4173'
const N = Number(args[1] || 1)
const RESPALDO = process.argv.includes('--respaldo')
const AQUI = dirname(fileURLToPath(import.meta.url))
// Tamaños de ventana distintos, como en una prueba remota.
const VENTANAS = [{ width: 1280, height: 800 }, { width: 1440, height: 900 }, { width: 1366, height: 768 }]

function prng(semilla) {
  let a = semilla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function crearMouse(page, azar, alto) {
  let pos = { x: 600, y: 400 }
  const espera = (ms) => page.waitForTimeout(ms)
  async function mover(x, y) {
    const d = Math.hypot(x - pos.x, y - pos.y)
    const pasos = Math.max(6, Math.round(d / 22))
    const cx = (pos.x + x) / 2 + (azar() - 0.5) * d * 0.3
    const cy = (pos.y + y) / 2 + (azar() - 0.5) * d * 0.3
    for (let i = 1; i <= pasos; i++) {
      const t = i / pasos
      await page.mouse.move(
        (1 - t) ** 2 * pos.x + 2 * (1 - t) * t * cx + t * t * x + (azar() - 0.5) * 2,
        (1 - t) ** 2 * pos.y + 2 * (1 - t) * t * cy + t * t * y + (azar() - 0.5) * 2,
      )
      await espera(14)
    }
    pos = { x, y }
  }
  async function pausa(ms) {
    const fin = Date.now() + ms
    while (Date.now() < fin) {
      await page.mouse.move(pos.x + (azar() - 0.5) * 4, pos.y + (azar() - 0.5) * 4)
      await espera(150)
    }
  }
  async function aLaVista(loc) {
    for (let i = 0; i < 40; i++) {
      const b = await loc.boundingBox()
      if (!b) return null
      if (b.y >= 90 && b.y + Math.min(b.height, 300) <= alto - 40) return b
      await page.mouse.wheel(0, b.y < 90 ? -160 : 160)
      await espera(140)
    }
    return loc.boundingBox()
  }
  return {
    async clic(loc) {
      const b = await aLaVista(loc)
      await mover(b.x + b.width * (0.3 + azar() * 0.4), b.y + b.height * (0.35 + azar() * 0.3))
      await pausa(250 + azar() * 400)
      await page.mouse.down()
      await page.mouse.up()
      await espera(500)
    },
    async leer(loc, ms) {
      if (azar() < 0.25) return // a veces no lee
      const b = await aLaVista(loc)
      if (!b) return
      const lineas = Math.max(1, Math.min(6, Math.round(b.height / 26)))
      for (let i = 0; i < lineas; i++) {
        const y = b.y + (i + 0.5) * (b.height / lineas)
        await mover(b.x + 10 + azar() * 30, y)
        await mover(b.x + b.width * (0.55 + azar() * 0.4), y + (azar() - 0.5) * 6)
        await pausa(((ms / lineas) * (0.5 + azar())) / 2)
      }
    },
    foto: async () => {},
  }
}

const browser = await chromium.launch()
let k = 0
for (const version of ['A', 'B']) {
  for (let i = 0; i < N; i++, k++) {
    const viewport = VENTANAS[k % VENTANAS.length]
    const ctx = await browser.newContext({ viewport, locale: 'es-CL', acceptDownloads: true })
    const page = await ctx.newPage()
    await abrirSesion(page, BASE, version)
    await recorrerFlujo(page, version, crearMouse(page, prng(1000 + k), viewport.height))
    if (RESPALDO) {
      mkdirSync(join(AQUI, 'respaldos'), { recursive: true })
      const [descarga] = await Promise.all([page.waitForEvent('download'), page.keyboard.press('Control+Alt+Shift+KeyR')])
      await descarga.saveAs(join(AQUI, 'respaldos', descarga.suggestedFilename()))
      console.log('  respaldo:', descarga.suggestedFilename())
    }
    // Esconder la pestaña manda lo pendiente, como al cerrar el navegador.
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })
      document.dispatchEvent(new Event('visibilitychange'))
    })
    await page.waitForTimeout(1500)
    console.log(`✓ sesión simulada ${version} (${viewport.width}×${viewport.height})`)
    await ctx.close()
  }
}
await browser.close()
