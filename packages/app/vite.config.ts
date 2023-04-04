import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import './load.envs.ts';

const WHITELIST = ['NODE_ENV', 'PUBLIC_URL'];
const ENV_VARS = Object.entries(process.env).filter(([key]) =>
  WHITELIST.some((k) => k === key || key.match(/^VITE_/))
);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3004,
  },
  define: {
    'process.env': Object.fromEntries(ENV_VARS),
  },
  plugins: [react(), tsconfigPaths()],
});
