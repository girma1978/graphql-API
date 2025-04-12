import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  
    open: true,
    proxy: {
      '/graphql': {
        target: 'https://graphql-api-8rbg.onrender.com',  
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});