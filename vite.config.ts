import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  base: '/sb1-oqvptk1z/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        format: 'es',
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
    },
    sourcemap: true,
    assetsDir: 'assets',
    target: 'esnext',
    minify: 'esbuild'
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})