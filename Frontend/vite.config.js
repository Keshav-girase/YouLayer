import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import removeConsole from 'vite-plugin-remove-console';

// https://vite.dev/config/
export default defineConfig({
  darkMode: 'class',
  plugins: [react(), removeConsole()],
  resolve: {
    alias: {
      '@': '/src', // You can adjust the alias based on your folder structure
    },
  },
  server: {
    proxy: {
      //
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
