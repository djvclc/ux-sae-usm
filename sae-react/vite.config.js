import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import process from 'node:process'

// https://vite.dev/config/
// 2026-10-27 (prueba remota): en GitHub Pages el sitio vive en /ux-sae-usm/.
// El workflow de despliegue define BASE_PATH; en local queda en la raíz.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    // Permite acceder desde el túnel temporal (cloudflared) usado para
    // compartir el prototipo con otra persona. Quitar si ya no se necesita.
    allowedHosts: ['.trycloudflare.com'],
  },
})
