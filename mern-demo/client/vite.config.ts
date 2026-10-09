import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'

const isDocker = fs.existsSync('/.dockerenv')
const isRender = !!process.env.RENDER // Render tự set RENDER=true
const defaultBackend = isRender
  ? 'https://mern-backend-236912.onrender.com'
  : isDocker
    ? 'http://backend:5000'
    : 'http://localhost:5000'

// Render injects PORT; fall back to 3000 locally / docker-compose
const port = Number(process.env.PORT) || 3000

// BACKEND_URL (nếu có) sẽ ghi đè giá trị mặc định ở trên
const backendUrl = process.env.BACKEND_URL || defaultBackend

const proxy = {
  '/api': {
    target: backendUrl,
    changeOrigin: true,
    secure: true,
  },
}

// Allow every host (Render domain, custom domains, localhost...)
const allowedHosts = true as const

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port,
    strictPort: true,
    allowedHosts,
    proxy,
  },
  preview: {
    host: '0.0.0.0',
    port,
    strictPort: true,
    allowedHosts,
    proxy,
  },
})
