import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'

const isDocker = fs.existsSync('/.dockerenv')
const defaultBackend = isDocker ? 'http://backend:5000' : 'http://localhost:5000'

// Render injects PORT; fall back to 3000 locally / docker-compose
const port = Number(process.env.PORT) || 3000

// On Render, set BACKEND_URL to the backend's public URL,
// e.g. https://mern-backend-xxxx.onrender.com
const backendUrl = process.env.BACKEND_URL || defaultBackend

const proxy = {
  '/api': {
    target: backendUrl,
    changeOrigin: true,
    secure: true,
  },
}

// '.onrender.com' allows every *.onrender.com subdomain
const allowedHosts = ['.onrender.com', 'localhost']

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