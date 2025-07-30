import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'frontend',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend'),
    }
  },
  server: {
    port: 3000
  }
});
