import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunking for better code splitting
        manualChunks: (id) => {
          // Vendor chunk for React ecosystem
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
          // Router chunk
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          // Firebase chunk (largest dependency) - handle all firebase imports
          if (id.includes('node_modules/firebase') || id.includes('@firebase')) {
            return 'firebase';
          }
          // Framer Motion chunk (large animation library)
          if (id.includes('node_modules/framer-motion')) {
            return 'framer';
          }
          // UI libraries chunk
          if (id.includes('node_modules/@headlessui') || id.includes('node_modules/react-hook-form')) {
            return 'ui';
          }
          // Icons and smaller utilities
          if (id.includes('node_modules/react-icons') || id.includes('node_modules/@google/generative-ai')) {
            return 'utils';
          }
          // All other node_modules
          if (id.includes('node_modules')) {
            return 'vendor-libs';
          }
        }
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: []
  }
})
