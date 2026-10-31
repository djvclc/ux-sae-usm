// Recibe las partes del registro del cursor y las guarda en una carpeta de
// Google Drive del autor. Se pega en script.google.com (ver LEEME.md).
//
// Cada parte llega como un JSON y se guarda como archivo
// <sesión>_parte-NNN.json. Si llega dos veces la misma parte, se reemplaza.
// Se rechaza lo que no tenga la forma esperada (la URL queda a la vista en el
// repositorio público, así que cualquiera podría mandar algo).

// 1) Pegar entre las comillas el ID de la carpeta de Drive: es lo que va
//    después de /folders/ en la dirección de la carpeta.
const CARPETA_ID = 'PEGAR_AQUI_EL_ID_DE_LA_CARPETA';

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const texto = e.postData.contents;
    const nombre = nombreParte(texto);
    if (!nombre) return salida('rechazado');
    lock.waitLock(10000);
    const carpeta = DriveApp.getFolderById(CARPETA_ID);
    const repetidos = carpeta.getFilesByName(nombre);
    while (repetidos.hasNext()) repetidos.next().setTrashed(true);
    carpeta.createFile(nombre, texto, 'application/json');
    return salida('ok');
  } catch (err) {
    return salida('error');
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

// Abrir la URL /exec en el navegador debe mostrar "funciona".
function doGet() {
  return salida('funciona');
}

// Mismas reglas que servidor-prueba.mjs.
function nombreParte(texto) {
  if (!texto || texto.length > 200000) return null;
  const d = JSON.parse(texto);
  if (!/^\d{8}-\d{4}-[AB]-[a-z0-9]{4}$/.test(d.sesion)) return null;
  if (!Array.isArray(d.muestras)) return null;
  if (d.parte === 'completo') return d.sesion + '_completo.json';
  if (typeof d.parte !== 'number' || d.parte % 1 !== 0 || d.parte < 0 || d.parte > 999) return null;
  return d.sesion + '_parte-' + ('00' + d.parte).slice(-3) + '.json';
}

function salida(texto) {
  return ContentService.createTextOutput(texto);
}

// 2) Para probar sin el prototipo: ejecutar esta función desde el editor.
//    Debe aparecer un archivo 20260101-0000-A-test_parte-000.json en la carpeta
//    (bórralo después).
function probar() {
  const r = doPost({ postData: { contents: JSON.stringify({ sesion: '20260101-0000-A-test', parte: 0, muestras: [] }) } });
  Logger.log(r.getContent());
}
