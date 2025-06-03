import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    dedupe: ['react', 'react-dom'],
    preserveSymlinks: true
  },
  optimizeDeps: {
    include: [
      '@radix-ui/react-progress',
      '@radix-ui/react-select',
      'react',
      'react-dom'
    ]
  },
  define: {
    'process.env': {}
  }
})
