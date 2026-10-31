/* 2026-10-31 (prueba remota, propuesta pendiente de aprobación): registro del
   cursor para hacer mapas de calor por pantalla, en la versión A y en la B.

   Solo funciona en una prueba remota (link de sesión ?sesion=1|2, ver
   sesionRemota.js); en cualquier otra visita no registra nada. No guarda
   nombres, RUN ni lo que se escribe: solo por dónde pasa el cursor, los clics,
   el nombre de la pantalla (textos fijos de la página) y el tamaño de la ventana.

   Cómo funciona:
   - Cada 100 ms anota dónde está el cursor (así el tiempo quieto también
     cuenta), salvo que lleve más de 5 s sin moverse: mientras la persona
     responde en voz alta, el cursor quieto no debe sumar calor.
   - Cada muestra se guarda de dos formas: la posición en la página y la
     posición relativa al elemento bajo el cursor (su ruta en la página + la
     fracción dentro de él). La segunda permite juntar sesiones de pantallas de
     distinto tamaño y ubicar bien lo que es fijo o sticky (panel "Te
     explicamos", ventanas), que se mueve respecto de la página.
   - Cada 15 s manda una "parte" (≈150 muestras) a URL_REGISTRO (un Apps Script
     que la guarda como archivo en Google Drive); al cerrar o esconder la
     pestaña manda lo pendiente. Si un envío falla, la parte queda en
     sessionStorage y se reintenta.
   - Respaldo: Ctrl + Alt + Shift + R descarga todo lo registrado en esta
     pestaña como archivo JSON.

   Guía para el autor y el script de Google: scripts/mapa-calor/LEEME.md. */

// Pegar aquí la URL del Apps Script (termina en /exec). Vacía = no se envía nada
// (se sigue registrando y se puede descargar con el atajo).
const URL_POR_DEFECTO = 'https://script.google.com/macros/s/AKfycbyyiQKPEw0vm_dzfKgaWFPusIBMGoDNPbd841wh43KkASPBtglE-0tjHSdU0Ehw8PPQFw/exec'
export const URL_REGISTRO = import.meta.env.VITE_URL_REGISTRO || URL_POR_DEFECTO

const CLAVE_SESION = 'sae_registro_sesion'
const CLAVE_PENDIENTES = 'sae_registro_pendientes'
const CADA_MS = 100
const INACTIVO_MS = 5000
const ENVIO_MS = 15000

let estado = null // { sesion, version, inicio, parte }
let muestras = [] // las de la parte en curso
let todas = [] // todo lo de esta pestaña, para la descarga de respaldo
let ultimo = null // { cx, cy, t }

const leer = (clave, def) => {
  try {
    return JSON.parse(sessionStorage.getItem(clave)) ?? def
  } catch {
    return def
  }
}
const guardar = (clave, valor) => {
  try {
    sessionStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    /* almacenamiento no disponible o lleno */
  }
}

/* Al abrir un link de sesión: código nuevo, sin datos personales. La hora de
   inicio permite cruzarlo con la planilla del moderador (hora + versión). */
export function nuevaSesionRegistro(version) {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  const azar = Math.random().toString(36).slice(2, 6).padEnd(4, '0')
  const sesion = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}-${version}-${azar}`
  guardar(CLAVE_SESION, { sesion, version, inicio: d.toISOString(), parte: 0 })
  guardar(CLAVE_PENDIENTES, [])
}

/* Nombre de la pantalla en que está la persona. Depende de clases de
   PostulacionPage.jsx: si cambian, actualizar aquí. */
function pantalla() {
  const d = document.querySelector('dialog[open]')
  if (d) return 'Ventana: ' + ((d.querySelector('h2, h3')?.textContent || 'ventana').trim())
  const p = document.querySelector('.post-progreso')
  if (p) {
    let k = p.getAttribute('aria-valuetext') || 'postulación'
    if (document.querySelector('.post-colegio-lista')) k += ' (catálogo)'
    else if (/^Paso 2/.test(k) && !document.querySelector('.post-item')) k += ' (lista vacía)'
    return k
  }
  return location.pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), '') || '/'
}

// Ruta estable del elemento (sin ids, que React puede generar distinto).
function ruta(el) {
  const partes = []
  for (let n = el; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
    let i = 1
    for (let s = n.previousElementSibling; s; s = s.previousElementSibling) if (s.tagName === n.tagName) i++
    partes.unshift(`${n.tagName.toLowerCase()}:nth-of-type(${i})`)
  }
  return ['body', ...partes].join('>')
}

function muestra(clic) {
  if (!ultimo || !estado) return
  if (!clic && Date.now() - ultimo.t > INACTIVO_MS) return
  const { cx, cy } = ultimo
  const el = document.elementFromPoint(cx, cy)
  const m = { t: Date.now(), p: pantalla(), x: Math.round(cx + scrollX), y: Math.round(cy + scrollY) }
  if (el) {
    const r = el.getBoundingClientRect()
    m.r = ruta(el)
    m.fx = r.width ? +((cx - r.left) / r.width).toFixed(3) : 0
    m.fy = r.height ? +((cy - r.top) / r.height).toFixed(3) : 0
  }
  if (clic) m.c = 1
  muestras.push(m)
  todas.push(m)
}

// Parte lista para enviar: pantallas y rutas en diccionarios para que pese poco.
function empaquetar(lista) {
  const pantallas = []
  const rutas = []
  const idx = (arr, v) => {
    if (v == null) return undefined
    let i = arr.indexOf(v)
    if (i < 0) i = arr.push(v) - 1
    return i
  }
  return {
    sesion: estado.sesion,
    version: estado.version,
    inicio: estado.inicio,
    parte: estado.parte,
    ventana: { w: innerWidth, h: innerHeight, dpr: devicePixelRatio },
    punteroFino: matchMedia('(pointer: fine)').matches,
    pantallas,
    rutas,
    muestras: lista.map(({ p, r, ...m }) => ({ ...m, p: idx(pantallas, p), r: idx(rutas, r) })),
  }
}

async function enviar(paquete, alCerrar) {
  if (!URL_REGISTRO) return false
  try {
    // no-cors + text/plain: el Apps Script no permite leer la respuesta, pero
    // un error de red sí se detecta y la parte se reintenta.
    await fetch(URL_REGISTRO, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: alCerrar,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(paquete),
    })
    return true
  } catch {
    return false
  }
}

let enviando = false
async function cerrarParte(alCerrar = false) {
  if (!estado || enviando) return
  enviando = true
  const pendientes = leer(CLAVE_PENDIENTES, [])
  if (muestras.length) {
    pendientes.push(empaquetar(muestras))
    muestras = []
    estado.parte += 1
    guardar(CLAVE_SESION, estado)
  }
  const quedan = []
  for (const paquete of pendientes) {
    if (!(await enviar(paquete, alCerrar))) quedan.push(paquete)
  }
  guardar(CLAVE_PENDIENTES, quedan)
  enviando = false
}

function descargarRespaldo() {
  if (!estado) return
  const blob = new Blob([JSON.stringify({ ...empaquetar(todas), parte: 'completo' })], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${estado.sesion}_completo.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

export function iniciarRegistroCursor() {
  estado = leer(CLAVE_SESION, null)
  if (!estado) return
  addEventListener('mousemove', (e) => { ultimo = { cx: e.clientX, cy: e.clientY, t: Date.now() } }, { capture: true, passive: true })
  // pointerdown y no click: el clic en un <label> genera un segundo click en su casilla.
  addEventListener('pointerdown', (e) => {
    ultimo = { cx: e.clientX, cy: e.clientY, t: Date.now() }
    muestra(true)
  }, true)
  addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.shiftKey && e.code === 'KeyR') descargarRespaldo()
  })
  setInterval(() => muestra(false), CADA_MS)
  setInterval(() => cerrarParte(), ENVIO_MS)
  // Al esconder o cerrar la pestaña, mandar lo pendiente (keepalive: < 64 KB).
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') cerrarParte(true)
  })
  cerrarParte() // reintenta lo que haya quedado de una recarga
}
