import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Remove GitHub Pages specific path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    host: true, // This allows accessing from outside
    proxy: {
      '/api': {
        target: 'http://vk4k4s04wcocgc8kkwo84k00.88.198.171.23.sslip.io',
        changeOrigin: true,
        secure: false
      }
    }
  },
})
