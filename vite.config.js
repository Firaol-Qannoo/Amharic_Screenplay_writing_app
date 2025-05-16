import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
     optimizeDeps: {
    exclude: ['@reduxjs/toolkit'],
  },
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,

        }),
        react(),
        tailwindcss(),
    ],
    server: {
        host: '127.0.0.1', // Force IPv4
        port: 5173,
      },
});
