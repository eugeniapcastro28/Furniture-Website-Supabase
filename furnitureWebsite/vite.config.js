import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteImageOptimize from 'vite-plugin-image-optimize'

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimize({
      // 🌟 FORCE RESIZING: Automatically scale oversized assets down
      exclude: [
        // Optional: Exclude certain files if you don't want them touched
      ],
      include: /\.(png|jpg|jpeg|webp)$/i,
      
      // Configuration for your image processing engines
      webp: {
        quality: 80,
        // 🌟 Downscale massive dimensions (like your 4500px images) to a maximum width of 1400px
        resize: { width: 1400, fit: 'inside', withoutEnlargement: true }
      },
      png: {
        quality: 80,
        // Apply the same structural resize limits for PNG source files
        resize: { width: 1400, fit: 'inside', withoutEnlargement: true }
      },
      jpeg: {
        quality: 80,
        resize: { width: 1400, fit: 'inside', withoutEnlargement: true }
      }
    }),
  ],
})