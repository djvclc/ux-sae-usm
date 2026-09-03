// Hook de resolución para `node --test`.
//
// El proyecto importa módulos relativos SIN extensión (convención Vite, +50 usos
// en src/). Node no resuelve esos especificadores por sí solo, así que este hook
// los completa igual que lo haría el bundler. Solo se usa al correr los tests con
// el runner nativo de Node; NO participa en `npm run dev` ni en `npm run build`
// (eso lo hace Vite) y no agrega ninguna dependencia.
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SUFIJOS = ['.js', '.jsx', '.mjs', '/index.js', '/index.jsx']

export async function resolve(specifier, context, nextResolve) {
  const esRelativo = specifier.startsWith('./') || specifier.startsWith('../')
  const yaTieneExtension = /\.[mc]?jsx?$/.test(specifier)

  if (esRelativo && !yaTieneExtension && context.parentURL) {
    for (const sufijo of SUFIJOS) {
      const candidata = new URL(specifier + sufijo, context.parentURL)
      if (existsSync(fileURLToPath(candidata))) {
        return nextResolve(specifier + sufijo, context)
      }
    }
  }

  return nextResolve(specifier, context)
}
