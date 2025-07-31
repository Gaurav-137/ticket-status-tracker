import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    // Performance optimizations
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    // Faster builds
    target: 'esnext',
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  server: {
    port: 3000,
    strictPort: false, // Allow port switching
    host: true, // Allow external connections
    open: true, // Auto-open browser
    // Performance optimizations
    hmr: {
      overlay: false // Disable error overlay for better performance
    }
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true // Force pre-bundling
  },
  // Reduce bundle size
  esbuild: {
    drop: ['console', 'debugger'],
    target: 'esnext'
  },
  // Faster development
  clearScreen: false,
  logLevel: 'warn'
}); 