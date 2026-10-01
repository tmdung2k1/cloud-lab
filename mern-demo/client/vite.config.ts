import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'

// Tự động nhận diện khi chạy trong Docker container
const isDocker = fs.existsSync('/.dockerenv')
const defaultBackend = isDocker ? 'http://backend:5000' : 'http://localhost:5000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || defaultBackend,
        changeOrigin: true,
      }
    }
  }
})
