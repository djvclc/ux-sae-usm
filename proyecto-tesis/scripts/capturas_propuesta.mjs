// Capturas del prototipo para el capítulo "Propuesta" de la memoria.
//
// Uso (con el prototipo servido):
//   cd sae-react && npm run build && npx vite preview --port 4173 &
//   node proyecto-tesis/scripts/capturas_propuesta.mjs [http://localhost:4173]
//
// Recorre el caso Muñoz González (lista y orden canónicos del estudio comparativo)
// a 390 px de ancho, en la condición A (con explicación) y en la B (control), y
// guarda PNG en proyecto-tesis/imagenes/propuesta/. Requiere playwright
// (en este entorno: PLAYWRIGHT_BROWSERS_PATH ya configurado, o /opt/pw-browsers).
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.argv[2] || 'http://localhost:4173'
const FECHA_SIMULADA = '2026-08-20T10:00:00-04:00'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'imagenes', 'propuesta')
mkdirSync(OUT, { recursive: true })

// Orden canónico del estudio (caso_estudio_prueba_usabilidad_postulacion.md §3).
const LISTA = [
  'Colegio San Martín',
  'Colegio Los Andes',
  'Escuela República de Chile',
  'Colegio Villa del Sol',
  'Liceo Técnico Simón Bolívar',
  'Escuela Básica Los Quillayes',
]

// En este entorno, el Chromium preinstalado; en otro equipo, el de playwright.
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' })
  .catch(() => chromium.launch())

async function nuevaPagina() {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'es-CL' })
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

// Recorre la postulación hasta /seguimiento. `capturar` decide qué se fotografía.
async function postular(page, modo, capturar) {
  await ir(page, `/postulacion${modo === 'control' ? '?modo=control' : ''}`)
  await page.locator('summary', { hasText: 'Herramientas de la prueba' }).click()
  await page.getByRole('button', { name: 'Cargar familia Muñoz González' }).click()

  // Grupo familiar: postulan Mateo y Sofía (en bloque); Martina sigue en su colegio.
  for (const nombre of ['Mateo', 'Sofía']) {
    await page.locator('label.post-familia__hijo', { hasText: nombre }).locator('input').check()
  }
  await capturar('paso1-grupo-familiar', page.locator('.post-familia').first())
  await page.getByRole('button', { name: 'Continuar', exact: true }).click()

  await page.locator('#check-apoderado').check()
  await capturar('paso1-verificacion', page.locator('.post-alumno-block').filter({ hasText: 'Declaro que soy' }).first())
  await page.getByRole('button', { name: 'Vincular estudiante' }).click()
  await page.getByRole('button', { name: 'Sí, continuar' }).click()

  // Paso 2: agregar los 6 colegios en el orden canónico.
  await page.getByRole('button', { name: 'Ir al catálogo de colegios →' }).click()
  await capturar('paso2-catalogo', page.locator('.post-colegio-lista').first())
  for (const [i, nombre] of LISTA.entries()) {
    if (i > 0) await page.getByRole('button', { name: '+ Agregar otro colegio' }).click()
    await page.getByRole('button', { name: `Agregar ${nombre} a tu postulación` }).click()
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await capturar('paso2-tu-lista', page.locator('.post-item').first().locator('xpath=..'))
  const orden = page.locator('.info-box, [class*="info-box"], [role="note"]').filter({ hasText: '¿Qué hace el orden de tu lista?' }).last()
  if (await orden.count()) await capturar('paso2-orden-lista', orden)

  // Paso 3: revisión y envío.
  await page.getByRole('button', { name: 'Siguiente →' }).click()
  await page.getByText('Paso 3 de 3', { exact: false }).first().evaluate((el) => { el.scrollIntoView(); window.scrollBy(0, -80) })
  await capturar('paso3-revision', null)
  await page.getByRole('button', { name: 'Confirmar y enviar postulación' }).click()
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  await page.getByRole('link', { name: /Ver mi resultado ahora/ }).click()

  await page.waitForURL(/seguimiento/)
  await page.evaluate(() => window.scrollTo(0, 0))
  await capturar('resultado', page.locator('.seg-result-plano').first())
}

// ── Condición A (prototipo completo) ────────────────────────────────
{
  const { ctx, page } = await nuevaPagina()
  await ir(page, `/`)
  await foto(page, 'inicio')
  await ir(page, `/colegio?id=2`)
  await foto(page, 'ficha-probabilidad', page.locator('.probviz-block').first())
  await ir(page, `/algoritmo`)
  await foto(page, 'algoritmo')
  await ir(page, `/proceso`)
  await foto(page, 'proceso')

  await postular(page, 'full', async (nombre, loc) => foto(page, `A-${nombre}`, loc))

  // Explicación del resultado (exclusiva de la condición A).
  const explica = page.locator('.card--module').filter({ hasText: '¿Por qué te asignaron este colegio?' }).first()
  if (await explica.count()) await foto(page, 'A-resultado-explicacion', explica)
  await ctx.close()
}

// ── Condición B (control, sin la capa de explicación) ──────────────
{
  const { ctx, page } = await nuevaPagina()
  const soloComparables = new Set(['paso2-tu-lista', 'resultado'])
  await postular(page, 'control', async (nombre, loc) => {
    if (soloComparables.has(nombre)) await foto(page, `B-${nombre}`, loc)
  })
  await ctx.close()
}

await browser.close()
