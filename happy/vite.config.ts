import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/rest': {
        target: 'http://10.10.240.162:8101',
        changeOrigin: true
      }
    }
  }
})
