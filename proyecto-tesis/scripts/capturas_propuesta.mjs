// Capturas del prototipo para el capítulo "Propuesta" de la memoria.
//
// Uso (con el prototipo servido):
//   cd sae-react && npm run build && npx vite preview --port 4173 &
//   node proyecto-tesis/scripts/capturas_propuesta.mjs [http://localhost:4173]
//
// Dos tipos de captura:
//  - Páginas informativas (inicio, ficha, algoritmo, proceso) a 390 px, el ancho
//    de un teléfono.
//  - El flujo de postulación y el resultado a 1280 px, el ancho del estudio
//    comparativo: el panel "Te explicamos" de la condición A solo se muestra en
//    escritorio. Recorre el caso Muñoz González con la lista del estudio
//    (instrucciones_prueba_usabilidad.md v11): Sofía y Mateo en bloque,
//    1. Colegio San Martín · 2. Colegio Los Andes, en la condición A y en la B.
// Guarda PNG en proyecto-tesis/imagenes/propuesta/. Requiere playwright
// (en este entorno: /opt/pw-browsers/chromium).
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.argv[2] || 'http://localhost:4173'
const FECHA_SIMULADA = '2026-08-20T10:00:00-04:00'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'imagenes', 'propuesta')
mkdirSync(OUT, { recursive: true })

const LISTA = ['Colegio San Martín', 'Colegio Los Andes']
const MOVIL = { width: 390, height: 844 }
const ESCRITORIO = { width: 1280, height: 860 }

// En este entorno, el Chromium preinstalado; en otro equipo, el de playwright.
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' })
  .catch(() => chromium.launch())

async function nuevaPagina(viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, locale: 'es-CL', acceptDownloads: true })
  // Fecha fija dentro del período de postulación (cierra el 27-08-2026 a las 14:00),
  // para que el comprobante, el resultado y la etapa del proceso sean coherentes
  // con el calendario que muestran las demás pantallas, sea cual sea el día de la captura.
  await ctx.clock.install({ time: new Date(FECHA_SIMULADA) })
  const page = await ctx.newPage()
  return { ctx, page }
}

// Espera a que la ruta (carga diferida) muestre su contenido.
async function ir(page, ruta) {
  await page.goto(`${BASE}${ruta}`)
  await page.waitForFunction(() => !/Cargando/.test(document.body.innerText))
  await page.waitForTimeout(300)
}

// Quita del encuadre lo que no es la pantalla en sí: el foco (que muestra el
// enlace "Saltar al contenido") y, en capturas por elemento, la barra fija y el
// botón de chat que se superponen al contenido.
async function limpiar(page, porElemento) {
  await page.mouse.move(1, 1) // sin estado :hover en el último botón pulsado
  await page.evaluate((porElemento) => {
    document.activeElement?.blur?.()
    if (!porElemento) return
    for (const el of document.querySelectorAll('body *')) {
      const pos = getComputedStyle(el).position
      if (pos === 'fixed') el.style.visibility = 'hidden'
      else if (pos === 'sticky') el.style.position = 'static'
    }
  }, porElemento)
}

async function foto(page, nombre, locator) {
  const ruta = join(OUT, `${nombre}.png`)
  await limpiar(page, Boolean(locator))
  if (locator) {
    await locator.scrollIntoViewIfNeeded()
    await locator.screenshot({ path: ruta })
  } else {
    await page.screenshot({ path: ruta })
  }
  console.log('✓', nombre)
}

// Restaura la barra fija y el chat tras una captura por elemento.
async function restaurar(page) {
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('body *')) {
      if (el.style.visibility === 'hidden') el.style.visibility = ''
      if (el.style.position === 'static') el.style.position = ''
    }
  })
}

// Bloque flujo + panel de la pantalla actual (en B, solo el flujo).
const layout = (page) => page.locator('.layout-panel').first()

// Recorre la postulación hasta /seguimiento. `capturar` decide qué se fotografía.
async function postular(page, condicion, capturar) {
  // Elegir la versión recarga /postulacion y limpia la sesión anterior.
  await ir(page, '/postulacion')
  await page.locator('summary', { hasText: 'Herramientas de la prueba' }).click()
  await Promise.all([
    page.waitForEvent('load'),
    page.getByRole('button', { name: condicion === 'A' ? /A · Con explicaciones/ : /B · Sin explicaciones/ }).click(),
  ])
  await page.waitForFunction(() => !/Cargando/.test(document.body.innerText))
  await page.locator('summary', { hasText: 'Herramientas de la prueba' }).click()
  await page.getByRole('button', { name: /Cargar familia Muñoz González/ }).click()

  // Grupo familiar: postulan Sofía y Mateo, en bloque; Martina sigue en su colegio.
  for (const nombre of ['Sofía', 'Mateo']) {
    await page.locator('label.post-familia__hijo', { hasText: nombre }).locator('input').check()
  }
  await page.locator('.post-familia__modo label', { hasText: 'En bloque' }).first().click()
  await capturar('familia', layout(page))
  await page.getByRole('button', { name: 'Continuar', exact: true }).click()

  // Ventana "¿Confirmas estos datos?".
  await page.locator('#check-apoderado').check()
  await capturar('confirmar-datos', null)
  await page.getByRole('dialog').getByRole('button', { name: 'Continuar', exact: true }).click()

  // Paso 2: catálogo y lista de dos colegios.
  await page.getByRole('button', { name: /\+ Agregar colegios/ }).click()
  await capturar('catalogo', layout(page))
  for (const [i, nombre] of LISTA.entries()) {
    if (i > 0) await page.getByRole('button', { name: /\+ Agregar otro colegio/ }).click()
    await page.getByRole('button', { name: `Agregar ${nombre} a tu postulación` }).click()
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await capturar('lista', layout(page))

  // Paso 3: revisión y envío.
  await page.getByRole('button', { name: /^Continuar →$/ }).click()
  await page.evaluate(() => window.scrollTo(0, 0))
  await capturar('revisar', layout(page))
  await page.getByRole('button', { name: /^Confirmar$/ }).click()
  await page.getByRole('dialog').getByRole('button', { name: /Continuar/ }).click()
  await page.getByRole('link', { name: /Ver mi resultado ahora/ }).click()

  await page.waitForURL(/seguimiento/)
  await page.waitForFunction(() => !/Cargando/.test(document.body.innerText))
  await page.locator('.layout-panel').first().waitFor()
  await page.waitForTimeout(1500) // el resultado termina de calcularse y se vuelve a pintar
  await page.evaluate(() => window.scrollTo(0, 0))
  await capturar('resultado', layout(page))

  // Recorrido paso a paso de la revisión de la lista (solo existe en la condición A).
  const recorrido = page.locator('summary', { hasText: 'Ver cómo se revisó tu lista' })
  if (await recorrido.count()) {
    await recorrido.first().click()
    await page.waitForTimeout(400)
    await capturar('recorrido', page.locator('.panel-exp__seccion').first())
  }
}

// ── Páginas informativas, a ancho de teléfono ───────────────────────
{
  const { ctx, page } = await nuevaPagina(MOVIL)
  await ir(page, '/')
  await foto(page, 'inicio')
  await ir(page, '/colegio?id=2')
  await foto(page, 'ficha-probabilidad', page.locator('.probviz-block').first())
  await ir(page, '/algoritmo')
  await foto(page, 'algoritmo')
  await ir(page, '/proceso')
  await foto(page, 'proceso')
  await ctx.close()
}

// ── Flujo en las dos condiciones, a ancho de escritorio ─────────────
for (const condicion of ['A', 'B']) {
  const { ctx, page } = await nuevaPagina(ESCRITORIO)
  // En la condición B solo se guardan las pantallas que el capítulo compara con la A.
  const soloComparables = new Set(['lista', 'resultado'])
  await postular(page, condicion, async (nombre, loc) => {
    if (condicion === 'B' && !soloComparables.has(nombre)) return
    await foto(page, `${condicion}-${nombre}`, loc)
    if (loc) await restaurar(page)
  })
  await ctx.close()
}

await browser.close()
