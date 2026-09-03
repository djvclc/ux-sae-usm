// Registra el hook de resolución antes de que el runner cargue los archivos de
// test. Se engancha con `node --test --import ./tests/setup.mjs`.
import { register } from 'node:module'

register('./resolve-extensionless.mjs', import.meta.url)
