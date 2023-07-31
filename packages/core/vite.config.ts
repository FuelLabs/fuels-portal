import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import './load.envs.js';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3003,
  },
  plugins: [react(), tsconfigPaths()],
  define: {
    'process.env': {},
  },
  build: {
    target: ['es2020'],
    outDir: process.env.BUILD_PATH || 'dist',
  },
});
