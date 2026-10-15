import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Render injects PORT; mặc định 3000
const port = Number(process.env.PORT) || 3000

// Ưu tiên BACKEND_URL nếu có, mặc định trỏ thẳng về Render Backend
const backendUrl = process.env.BACKEND_URL || 'https://mern-backend-236912.onrender.com'

const proxy = {
  '/api': {
    target: backendUrl,
    changeOrigin: true,
    secure: false,
  },
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port,
    strictPort: true,
    allowedHosts: true,
    proxy,
  },
  preview: {
    host: '0.0.0.0',
    port,
    strictPort: true,
    allowedHosts: true,
    proxy,
  },
})