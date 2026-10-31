// Pasos de la tarea de la prueba (caso Muñoz González, lista 1. San Martín ·
// 2. Los Andes), desde el link de sesión hasta el resultado. Lo usan:
//  - simular-sesion.mjs: con un mouse simulado, para probar el registro;
//  - mapa.mjs: con clics directos, para sacar la captura de cada pantalla.
// `h` trae tres funciones: clic(locator), leer(locator, ms) y foto() — esta
// última se llama justo antes de dejar cada pantalla.
// Si cambian los textos o clases de PostulacionPage.jsx, actualizar aquí.

export const LISTA = ['Colegio San Martín', 'Colegio Los Andes']

export async function abrirSesion(page, base, version) {
  await page.goto(`${base}/postulacion?sesion=${version === 'A' ? 1 : 2}`)
  await page.waitForFunction(() => !/Cargando/.test(document.body.innerText))
  await page.locator('label.post-familia__hijo').first().waitFor()
}

export async function recorrerFlujo(page, version, h) {
  const panel = page.locator('.panel-exp__seccion')
  const leerPanel = async (n, ms) => {
    if (version !== 'A') return
    const total = await panel.count()
    for (let i = 0; i < Math.min(n, total); i++) await h.leer(panel.nth(i), ms)
  }
  const dialogo = page.getByRole('dialog')

  // 1. Tu grupo familiar
  await h.leer(page.locator('.layout-panel__flujo h1, .layout-panel__flujo h2').first(), 1200)
  await leerPanel(2, 3000)
  for (const nombre of ['Sofía', 'Mateo']) await h.clic(page.locator('label.post-familia__hijo', { hasText: nombre }))
  const bloque = page.locator('.post-familia__modo label', { hasText: 'En bloque' }).first()
  await h.leer(bloque, 1800)
  await h.clic(bloque)
  await leerPanel(1, 2500)
  await h.foto()
  await h.clic(page.getByRole('button', { name: 'Continuar', exact: true }))

  // 2. ¿Confirmas estos datos?
  await h.leer(dialogo.locator('h2, h3').first(), 1000)
  await h.leer(dialogo.locator('dl, ul, section').first(), 3000)
  await h.clic(page.locator('label:has(#check-apoderado)'))
  await h.foto()
  await h.clic(dialogo.getByRole('button', { name: 'Continuar', exact: true }))

  // 3. Tu lista vacía → catálogo → los dos colegios
  await leerPanel(2, 3000)
  await h.foto()
  await h.clic(page.getByRole('button', { name: /\+ Agregar colegios/ }))
  for (const [i, nombre] of LISTA.entries()) {
    if (i > 0) {
      await leerPanel(1, 2000)
      await h.clic(page.getByRole('button', { name: /\+ Agregar otro colegio/ }))
    }
    await h.leer(page.locator('.post-colegio-fila').nth(0), 1500)
    await h.leer(page.locator('.post-colegio-fila', { hasText: nombre }), 2000)
    if (i === LISTA.length - 1) await h.foto()
    await h.clic(page.getByRole('button', { name: `Agregar ${nombre} a tu postulación` }))
  }

  // 4. Tu lista con los dos colegios
  await h.leer(page.locator('.post-item').first(), 2000)
  await h.leer(page.locator('.post-item').nth(1), 2000)
  await leerPanel(3, 3500)
  await h.foto()
  await h.clic(page.getByRole('button', { name: /^Continuar →$/ }))

  // 5. Revisa y envía + ventana de confirmación
  await h.leer(page.locator('.post-revision__seccion').first(), 2000)
  await h.leer(page.locator('.post-revision__seccion').nth(1), 2500)
  await leerPanel(2, 3000)
  await h.foto()
  await h.clic(page.getByRole('button', { name: /^Confirmar$/ }))
  await h.leer(dialogo.locator('p, ul').first(), 2500)
  await h.foto()
  await h.clic(dialogo.getByRole('button', { name: /Continuar/ }))

  // 6. Postulación enviada
  await page.waitForTimeout(800)
  await leerPanel(2, 3000)
  await h.foto()
  await h.clic(page.getByRole('link', { name: /Ver mi resultado ahora/ }))

  // 7. Resultado
  await page.waitForURL(/seguimiento/)
  await page.locator('.layout-panel').first().waitFor()
  await page.waitForTimeout(1500) // el resultado termina de calcularse
  await h.leer(page.locator('.layout-panel__flujo h2, .layout-panel__flujo h3').first(), 1500)
  await h.leer(page.locator('.layout-panel__flujo p').first(), 3000)
  await leerPanel(3, 4000)
  await h.foto()
}
