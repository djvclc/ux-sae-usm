// Todo en un paso: descomprime los zips de las sesiones, revisa cada una y arma
// la tabla de métricas.
//
// Uso (desde sae-react/scripts/mapa-calor):
//   node procesar.mjs "C:\ruta\de\los\zips"   descomprime y procesa
//   node procesar.mjs                          solo procesa lo que ya hay en datos/
//
// Cada zip queda en datos/<nombre del zip>/ (si ya existe, no se vuelve a
// descomprimir). Conviene nombrar los zips con el ID del participante
// (P01.zip, P02.zip…): así metricas.csv sale en ese orden y se pega de una vez
// en la hoja "Mouse" del Excel. Luego corre resumen.mjs y metricas.mjs.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DATOS = join(AQUI, 'datos')
const carpetaZips = process.argv[2] ? resolve(process.argv[2]) : null

function descomprimir(zip, destino) {
  mkdirSync(destino, { recursive: true })
  if (process.platform === 'win32') {
    const q = (s) => `'${s.replace(/'/g, "''")}'`
    execFileSync('powershell', ['-NoProfile', '-Command',
      `Expand-Archive -LiteralPath ${q(zip)} -DestinationPath ${q(destino)} -Force`], { stdio: 'pipe' })
  } else {
    try {
      execFileSync('unzip', ['-oq', zip, '-d', destino], { stdio: 'pipe' })
    } catch {
      execFileSync('tar', ['-xf', zip, '-C', destino], { stdio: 'pipe' })
    }
  }
}

if (carpetaZips) {
  if (!existsSync(carpetaZips)) {
    console.log(`No existe la carpeta ${carpetaZips}`)
    process.exit(1)
  }
  const zips = readdirSync(carpetaZips).filter((f) => f.toLowerCase().endsWith('.zip')).sort()
  console.log(`\n${zips.length} zips en ${carpetaZips}`)
  let nuevos = 0
  for (const z of zips) {
    const destino = join(DATOS, basename(z, '.zip'))
    if (existsSync(destino) && readdirSync(destino).length) {
      console.log(`  = ${z} (ya estaba en datos/)`)
      continue
    }
    try {
      descomprimir(join(carpetaZips, z), destino)
      console.log(`  ✓ ${z} → datos/${basename(z, '.zip')}/`)
      nuevos++
    } catch (e) {
      console.log(`  ✗ ${z}: no se pudo descomprimir (${String(e.message).split('\n')[0]})`)
      console.log('    Descomprímelo a mano en esa carpeta y vuelve a correr "node procesar.mjs".')
    }
  }
  console.log(`${nuevos} descomprimidos ahora.`)
} else if (!existsSync(DATOS)) {
  console.log('No hay carpeta datos/. Uso: node procesar.mjs "C:\\ruta\\de\\los\\zips"')
  process.exit(1)
}

const correr = (script) => execFileSync(process.execPath, [join(AQUI, script)], { stdio: 'inherit' })
console.log('\n════════ Revisión de cada sesión (resumen.mjs) ════════')
correr('resumen.mjs')
console.log('\n════════ Tabla para el Excel (metricas.mjs) ════════')
correr('metricas.mjs')
console.log('\nListo. Abre metricas.csv con Excel. Los mapas: con el prototipo levantado, "node mapa.mjs datos".')
