import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/emergefy-core-demo/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
      },
    },
  },
})