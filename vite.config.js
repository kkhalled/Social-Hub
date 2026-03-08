import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://linked-posts.routemisr.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core libraries
          'react-vendor': ['react', 'react-dom', 'react-router'],
          // Form libraries
          'form-vendor': ['formik', 'yup'],
          // UI libraries
          'ui-vendor': [
            '@fortawesome/react-fontawesome',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/free-regular-svg-icons',
            'react-toastify'
          ],
          // API client
          'api-vendor': ['axios']
        }
      }
    },
    chunkSizeWarningLimit: 600 // Slightly increased limit for vendor chunks
  }
});
