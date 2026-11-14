import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: [
      'firebase',
      '@firebase/app',
      '@firebase/component',
      '@firebase/util',
      '@firebase/logger',
      '@firebase/auth',
      '@firebase/firestore',
      '@firebase/storage',
      'react',
      'react-dom',
    ],
  },
});
