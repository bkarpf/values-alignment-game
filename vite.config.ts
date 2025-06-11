import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/values-alignment-game/', // <-- IMPORTANT: Replace 'values-alignment-game' with your exact GitHub repository name
})