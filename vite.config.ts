import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@iarna/toml', 'idb']
  },
  define: {
    // Fix for @iarna/toml which expects Node.js global
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      // Explicitly mark these packages as external to avoid build errors
      external: []
    }
  },
  server: {
    headers: {
      // Allow loading content in iframes for screenshot generation
      'Content-Security-Policy': "frame-ancestors 'self'",
      'X-Frame-Options': 'SAMEORIGIN'
    },
    proxy: {
      '/api/proxy': {
        target: 'https://corsproxy.io/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, '')
      }
    }
  }
});