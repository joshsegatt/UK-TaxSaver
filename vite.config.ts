import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  // ❌ REMOVED: Insecure API key injection
  // Previously exposed GEMINI_API_KEY to frontend bundle - now handled via secure backend API
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
