import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteImageOptimize from 'vite-plugin-image-optimize' // No curly braces!

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimize({
      // Configuration for your 4K images
      webp: {
        quality: 80,
      },
      png: {
        quality: 80,
      }
    }),
  ],
})