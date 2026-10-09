import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'

const isDocker = fs.existsSync('/.dockerenv')
const defaultBackend = isDocker ? 'http://backend:5000' : 'http://localhost:5000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'mern-frontend-236912.onrender.com',
      '.onrender.com'
    ],
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || defaultBackend,
        changeOrigin: true,
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'mern-frontend-236912.onrender.com',
      '.onrender.com'
    ]
  }
})
