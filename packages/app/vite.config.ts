import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import type { PluginOption } from 'vite';
import cleanPlugin from 'vite-plugin-clean';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3004,
  },
  build: {
    target: 'es2020',
    outDir: process.env.APP_DIST || 'dist',
    rollupOptions: {
      input: {
        index: 'index.html',
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      supported: {
        bigint: true,
      },
      define: {
        global: 'globalThis',
      },
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    {
      ...cleanPlugin({
        targetFiles: ['dist'],
      }),
      apply: 'serve',
    } as PluginOption,
  ],
  define: {
    'process.env': {},
  },
  /**
   * Need because of this issue:
   * https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
   */
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});
