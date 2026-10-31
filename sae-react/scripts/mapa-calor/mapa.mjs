// Mapas de calor por pantalla, versión A y B lado a lado, con la misma escala.
//
// Uso (con el prototipo servido, p. ej. npx vite preview --port 4173):
//   node mapa.mjs [carpeta=./datos] [--base http://localhost:4173]
//                 [--ancho 1280 --alto 800] [--nota "texto en el título"]
//
// Junta todas las sesiones de cada versión. Para dibujar, recorre la tarea en un
// navegador (flujo.mjs) a un tamaño de referencia y saca una captura de cada
// pantalla; cada muestra se ubica sobre el MISMO elemento en que estaba el
// cursor (su ruta + la fracción dentro de él), así se pueden juntar personas
// con pantallas de distinto tamaño. Si ese elemento no existe en la captura
// (p. ej., un desplegable que la persona abrió), se usa la posición en la página
// solo si su ventana tenía el mismo ancho; si no, la muestra se descarta y se
// informa cuántas.
// El calor es el promedio por sesión (A y B pueden tener distinto número).
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cargarSesiones } from './datos.mjs'
import { abrirSesion, recorrerFlujo } from './flujo.mjs'
const { chromium } = createRequire(import.meta.url)('playwright')

const AQUI = dirname(fileURLToPath(import.meta.url))
const opt = (n, def) => {
  const i = process.argv.indexOf(`--${n}`)
  return i > 0 ? process.argv[i + 1] : def
}
const posicionales = process.argv.slice(2).filter((a, i, arr) => !a.startsWith('--') && !arr[i - 1]?.startsWith('--'))
const CARPETA = posicionales[0] || join(AQUI, 'datos')
const BASE = opt('base', 'http://localhost:4173')
const VIEWPORT = { width: Number(opt('ancho', 1280)), height: Number(opt('alto', 800)) }
const NOTA = opt('nota', '')
const SALIDA = join(CARPETA, '..', 'mapas')
mkdirSync(SALIDA, { recursive: true })

const sesiones = cargarSesiones(CARPETA).filter((s) => s.punteroFino)
const porVersion = { A: sesiones.filter((s) => s.version === 'A'), B: sesiones.filter((s) => s.version === 'B') }
console.log(`Sesiones con mouse: A = ${porVersion.A.length}, B = ${porVersion.B.length}`)

// Mismo criterio que pantalla() en src/utils/registroCursor.js.
const BASE_PATH = new URL(BASE).pathname.replace(/\/$/, '')
const nombrePantalla = (basePath) => {
  const d = document.querySelector('dialog[open]')
  if (d) return 'Ventana: ' + ((d.querySelector('h2, h3')?.textContent || 'ventana').trim())
  const p = document.querySelector('.post-progreso')
  if (p) {
    let k = p.getAttribute('aria-valuetext') || 'postulación'
    if (document.querySelector('.post-colegio-lista')) k += ' (catálogo)'
    else if (/^Paso 2/.test(k) && !document.querySelector('.post-item')) k += ' (lista vacía)'
    return k
  }
  return location.pathname.replace(basePath, '') || '/'
}

// ── 1. Capturas de referencia y ubicación de cada muestra ──────────
const browser = await chromium.launch()
const capturas = { A: [], B: [] }
for (const version of ['A', 'B']) {
  if (!porVersion[version].length) continue
  const muestrasV = porVersion[version].flatMap((s) => s.muestras.map((m) => ({ ...m, sesion: s.sesion })))
  const ctx = await browser.newContext({ viewport: VIEWPORT, locale: 'es-CL' })
  // La referencia también abre un link de sesión: que su registro no mande nada.
  await ctx.route('**/*', (r) => (r.request().method() === 'POST' ? r.abort() : r.continue()))
  const page = await ctx.newPage()
  await abrirSesion(page, BASE, version)
  await recorrerFlujo(page, version, {
    clic: async (loc) => { await loc.click(); await page.waitForTimeout(300) },
    leer: async () => {},
    foto: async () => {
      const pantalla = await page.evaluate(nombrePantalla, BASE_PATH)
      await page.mouse.move(1, 1)
      await page.evaluate(() => {
        document.activeElement?.blur?.()
        window.scrollTo(0, 0)
        for (const el of document.querySelectorAll('body *')) {
          if (getComputedStyle(el).position === 'sticky') { el.dataset.eraSticky = '1'; el.style.position = 'static' }
        }
      })
      await page.waitForTimeout(250)
      const muestras = muestrasV.filter((m) => m.pantalla === pantalla)
      const rutas = [...new Set(muestras.map((m) => m.ruta).filter(Boolean))]
      const rects = await page.evaluate((rutas) => Object.fromEntries(rutas.map((r) => {
        let el = null
        try { el = document.querySelector(r) } catch { /* ruta inválida */ }
        const b = el?.getBoundingClientRect()
        return [r, b && b.width ? { x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height } : null]
      })), rutas)
      let fallback = 0
      let descartadas = 0
      const puntos = []
      for (const m of muestras) {
        const b = m.ruta && rects[m.ruta]
        if (b) puntos.push({ x: b.x + m.fx * b.w, y: b.y + m.fy * b.h, clic: m.clic })
        else if (m.ventana?.w === VIEWPORT.width) { puntos.push({ x: m.x, y: m.y, clic: m.clic }); fallback++ }
        else descartadas++
      }
      const png = await page.screenshot({ fullPage: true })
      capturas[version].push({ pantalla, png, puntos, fallback, descartadas, n: muestras.length })
      await page.evaluate(() => {
        for (const el of document.querySelectorAll('[data-era-sticky]')) { el.style.position = ''; delete el.dataset.eraSticky }
      })
    },
  })
  await ctx.close()
}

// ── 2. Pintar ──────────────────────────────────────────────────────
const page = await browser.newPage()
await page.setContent('<canvas></canvas>')
const pantallas = [...new Set([...capturas.A, ...capturas.B].map((c) => c.pantalla))]
for (const [n, pantalla] of pantallas.entries()) {
  const lados = ['A', 'B'].map((v) => {
    const c = capturas[v].find((c) => c.pantalla === pantalla)
    if (!c) return null
    const ns = porVersion[v].length
    const segundos = Math.round(c.puntos.filter((p) => !p.clic).length / 10 / ns)
    const clics = (c.puntos.filter((p) => p.clic).length / ns).toFixed(1).replace('.', ',')
    const ubicadas = c.n ? Math.round(((c.n - c.descartadas) / c.n) * 100) : 100
    console.log(`  ${v} · ${pantalla}: ${c.n} muestras, ${c.fallback} por posición en la página, ${c.descartadas} descartadas`)
    return {
      v, ns, peso: 1 / ns, puntos: c.puntos,
      img: 'data:image/png;base64,' + Buffer.from(c.png).toString('base64'),
      subtitulo: `${ns} sesiones · ${segundos} s y ${clics} clics por sesión · ${ubicadas} % ubicado${NOTA ? ' · ' + NOTA : ''}`,
    }
  }).filter(Boolean)
  const b64 = await page.evaluate(async ({ lados, pantalla, altoVentana }) => {
    const cargar = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = src })
    const R = 30, ALFA = 0.045, CAB = 70, GAP = 40
    const capas = []
    for (const l of lados) {
      const img = await cargar(l.img)
      // Las ventanas son fijas: se recorta al alto de la pantalla.
      const h = pantalla.startsWith('Ventana') ? Math.min(img.height, altoVentana) : img.height
      const c = new OffscreenCanvas(img.width, h)
      const g = c.getContext('2d')
      for (const p of l.puntos) {
        if (p.clic) continue
        const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, R)
        gr.addColorStop(0, `rgba(0,0,0,${Math.min(1, ALFA * l.peso)})`)
        gr.addColorStop(1, 'rgba(0,0,0,0)')
        g.fillStyle = gr
        g.fillRect(p.x - R, p.y - R, 2 * R, 2 * R)
      }
      capas.push({ img, h, datos: g.getImageData(0, 0, img.width, h) })
    }
    // Misma escala para A y B: el máximo de los dos.
    let max = 1
    for (const k of capas) for (let i = 3; i < k.datos.data.length; i += 4) max = Math.max(max, k.datos.data[i])
    const pal = new OffscreenCanvas(256, 1).getContext('2d')
    const lg = pal.createLinearGradient(0, 0, 256, 0)
    ;[[0, '#2b6cff'], [0.35, '#00c2a8'], [0.6, '#b6e300'], [0.8, '#ffb000'], [1, '#e8002d']].forEach(([s, col]) => lg.addColorStop(s, col))
    pal.fillStyle = lg
    pal.fillRect(0, 0, 256, 1)
    const P = pal.getImageData(0, 0, 256, 1).data

    const W = capas.reduce((s, k) => s + k.img.width, 0) + GAP * (capas.length - 1)
    const H = Math.max(...capas.map((k) => k.h)) + CAB
    const out = new OffscreenCanvas(W, H)
    const o = out.getContext('2d')
    o.fillStyle = '#ffffff'
    o.fillRect(0, 0, W, H)
    let x0 = 0
    for (const [i, k] of capas.entries()) {
      const l = lados[i]
      o.save(); o.filter = 'grayscale(1) opacity(0.55)'
      o.drawImage(k.img, 0, 0, k.img.width, k.h, x0, CAB, k.img.width, k.h); o.restore()
      const d = k.datos
      for (let j = 0; j < d.data.length; j += 4) {
        const a = d.data[j + 3]
        if (a < 3) { d.data[j + 3] = 0; continue }
        const t = Math.min(255, Math.round((a / max) * 255))
        d.data[j] = P[t * 4]; d.data[j + 1] = P[t * 4 + 1]; d.data[j + 2] = P[t * 4 + 2]
        d.data[j + 3] = Math.round(70 + (t / 255) * 150)
      }
      const capa = new OffscreenCanvas(k.img.width, k.h)
      capa.getContext('2d').putImageData(d, 0, 0)
      o.drawImage(capa, x0, CAB)
      for (const p of l.puntos.filter((p) => p.clic)) {
        o.beginPath(); o.arc(x0 + p.x, CAB + p.y, 7, 0, 2 * Math.PI)
        o.fillStyle = 'rgba(17,17,17,0.8)'; o.fill(); o.lineWidth = 2; o.strokeStyle = '#fff'; o.stroke()
      }
      o.fillStyle = '#111'; o.font = 'bold 26px sans-serif'
      o.fillText(`${pantalla} — versión ${l.v === 'A' ? 'A · con explicaciones' : 'B · sin explicaciones'}`, x0 + 16, 32)
      o.font = '20px sans-serif'; o.fillStyle = '#444'
      o.fillText(l.subtitulo, x0 + 16, 58)
      x0 += k.img.width + GAP
    }
    const s = 0.6
    const fin = new OffscreenCanvas(Math.round(W * s), Math.round(H * s))
    fin.getContext('2d').drawImage(out, 0, 0, fin.width, fin.height)
    const buf = new Uint8Array(await (await fin.convertToBlob({ type: 'image/png' })).arrayBuffer())
    let bin = ''
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000))
    return btoa(bin)
  }, { lados, pantalla, altoVentana: VIEWPORT.height })
  const slug = pantalla.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const archivo = join(SALIDA, `${String(n + 1).padStart(2, '0')}-${slug}.png`)
  writeFileSync(archivo, Buffer.from(b64, 'base64'))
  console.log('✓', archivo)
}
await browser.close()
