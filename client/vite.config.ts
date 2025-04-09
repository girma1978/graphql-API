
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Frontend on port 3000
    open: true,
    proxy: {
      '/graphql': {
        // target: 'http://localhost:4000',  // Change this to your backend port (e.g., 4000)
        target:'https://graphql-api-8rbg.onrender.com',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
