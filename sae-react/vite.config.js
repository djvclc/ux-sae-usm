import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
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
